import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, authorize, type AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { productSchema } from '../validators/productValidators.js';

const router = Router();

router.get('/', authenticate, authorize('Admin', 'Sales', 'Warehouse', 'Accounts'), async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, authorize('Admin'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = productSchema.parse(req.body);
    const product = await prisma.product.create({
      data: {
        name: parsed.name,
        sku: parsed.sku,
        category: parsed.category,
        unitPrice: parsed.unitPrice,
        currentStock: parsed.currentStock,
        minimumStock: parsed.minimumStock,
        warehouse: parsed.warehouse,
      },
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, authorize('Admin', 'Sales', 'Warehouse', 'Accounts'), async (req, res, next) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') return res.status(400).json({ success: false, message: 'Invalid product id' });
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize('Admin'), async (req, res, next) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') return res.status(400).json({ success: false, message: 'Invalid product id' });
    const parsed = productSchema.parse(req.body);
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: parsed.name,
        sku: parsed.sku,
        category: parsed.category,
        unitPrice: parsed.unitPrice,
        currentStock: parsed.currentStock,
        minimumStock: parsed.minimumStock,
        warehouse: parsed.warehouse,
      },
    });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

export default router;
