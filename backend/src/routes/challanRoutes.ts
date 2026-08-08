import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, authorize, type AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { challanSchema } from '../validators/challanValidators.js';

const router = Router();

const generateChallanNumber = async () => {
  const count = await prisma.challan.count();
  return `SC-2026-${String(count + 1).padStart(5, '0')}`;
};

router.get('/', authenticate, authorize('Admin', 'Sales', 'Accounts', 'Warehouse'), async (req, res, next) => {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const where: any = {};

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { challanNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [challans, total] = await Promise.all([
      prisma.challan.findMany({
        where,
        include: { customer: true, createdBy: true, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.challan.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        challans,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, authorize('Sales', 'Admin'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = challanSchema.parse(req.body);
    const challanNumber = await generateChallanNumber();

    const challan = await prisma.$transaction(async (tx) => {
      const itemsWithSnapshot = await Promise.all(
        parsed.items.map(async (item) => {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product) throw Object.assign(new Error(`Product ${item.productId} not found`), { statusCode: 404 });
          return {
            productId: item.productId,
            productName: product.name,
            sku: product.sku,
            unitPrice: product.unitPrice,
            quantity: item.quantity,
          };
        })
      );

      return tx.challan.create({
        data: {
          challanNumber,
          customerId: parsed.customerId,
          totalQuantity: itemsWithSnapshot.reduce((sum, item) => sum + item.quantity, 0),
          status: 'Draft',
          createdById: req.user!.id,
          items: {
            create: itemsWithSnapshot,
          },
        },
        include: { items: true },
      });
    });
    res.status(201).json({ success: true, data: challan });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, authorize('Admin', 'Sales', 'Accounts', 'Warehouse'), async (req, res, next) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') return res.status(400).json({ success: false, message: 'Invalid challan id' });
    const challan = await prisma.challan.findUnique({
      where: { id },
      include: { customer: true, createdBy: true, items: true },
    });
    if (!challan) return res.status(404).json({ success: false, message: 'Challan not found' });
    res.json({ success: true, data: challan });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/confirm', authenticate, authorize('Sales', 'Admin'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') return res.status(400).json({ success: false, message: 'Invalid challan id' });
    const challan = await prisma.challan.findUnique({ where: { id }, include: { items: true } });
    if (!challan) return res.status(404).json({ success: false, message: 'Challan not found' });
    if (challan.status === 'Confirmed') return res.status(409).json({ success: false, message: 'Challan already confirmed' });
    if (challan.status === 'Cancelled') return res.status(409).json({ success: false, message: 'Cannot confirm a cancelled challan' });

    const result = await prisma.$transaction(async (tx) => {
      for (const item of challan.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw Object.assign(new Error(`Product ${item.productName} not found`), { statusCode: 404 });
        if (product.currentStock < item.quantity) {
          throw Object.assign(new Error(`Insufficient stock for ${item.productName}`), { statusCode: 400 });
        }
      }

      for (const item of challan.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { currentStock: { decrement: item.quantity } },
        });
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            movementType: 'OUT',
            reason: `Challan ${challan.challanNumber}`,
            createdById: req.user!.id,
          },
        });
      }

      return tx.challan.update({
        where: { id },
        data: { status: 'Confirmed' },
        include: { items: true },
      });
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    next(error);
  }
});

router.post('/:id/cancel', authenticate, authorize('Sales', 'Admin'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') return res.status(400).json({ success: false, message: 'Invalid challan id' });
    const challan = await prisma.challan.update({
      where: { id },
      data: { status: 'Cancelled' },
      include: { items: true },
    });
    res.json({ success: true, data: challan });
  } catch (error) {
    next(error);
  }
});

export default router;
