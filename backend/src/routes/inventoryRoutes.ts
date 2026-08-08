import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, authorize('Admin', 'Warehouse', 'Accounts'), async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

router.get('/movements', authenticate, authorize('Admin', 'Warehouse', 'Accounts'), async (req, res, next) => {
  try {
    const productId = req.query.productId as string | undefined;
    const movementType = req.query.movementType as string | undefined;
    const date = req.query.date as string | undefined;

    const where: any = {};
    if (productId) where.productId = productId;
    if (movementType) where.movementType = movementType;
    if (date) {
      const day = new Date(date);
      where.createdAt = {
        gte: new Date(day.setHours(0, 0, 0, 0)),
        lt: new Date(day.setHours(23, 59, 59, 999)),
      };
    }

    const movements = await prisma.stockMovement.findMany({
      where,
      include: { product: true, createdBy: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: movements });
  } catch (error) {
    next(error);
  }
});

router.get('/low-stock', authenticate, authorize('Admin', 'Warehouse'), async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    const lowStockProducts = products.filter((product) => product.currentStock <= product.minimumStock);
    res.json({ success: true, data: lowStockProducts });
  } catch (error) {
    next(error);
  }
});

export default router;
