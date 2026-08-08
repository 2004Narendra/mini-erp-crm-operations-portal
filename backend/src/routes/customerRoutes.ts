import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, authorize, type AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { customerSchema } from '../validators/customerValidators.js';

const router = Router();

router.get('/', authenticate, authorize('Admin', 'Sales', 'Accounts'), async (req, res, next) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : '';
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const where: any = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { mobile: { contains: search, mode: 'insensitive' as const } },
            { businessName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { followUps: true },
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({ success: true, data: { customers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, authorize('Admin', 'Sales'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = customerSchema.parse(req.body);
    const customer = await prisma.customer.create({
      data: {
        name: parsed.name,
        mobile: parsed.mobile,
        email: parsed.email,
        businessName: parsed.businessName,
        gstNumber: parsed.gstNumber,
        customerType: parsed.customerType,
        address: parsed.address,
        status: parsed.status,
        followUpDate: parsed.followUpDate ? new Date(parsed.followUpDate) : null,
        notes: parsed.notes,
        createdById: req.user!.id,
      },
    });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, authorize('Admin', 'Sales', 'Accounts'), async (req, res, next) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') return res.status(400).json({ success: false, message: 'Invalid customer id' });
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { followUps: true, challans: true },
    });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize('Admin', 'Sales'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') return res.status(400).json({ success: false, message: 'Invalid customer id' });
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Customer not found' });
    const parsed = customerSchema.parse(req.body);
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: parsed.name,
        mobile: parsed.mobile,
        email: parsed.email,
        businessName: parsed.businessName,
        gstNumber: parsed.gstNumber,
        customerType: parsed.customerType,
        address: parsed.address,
        status: parsed.status,
        followUpDate: parsed.followUpDate ? new Date(parsed.followUpDate) : null,
        notes: parsed.notes,
      },
    });
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/follow-up', authenticate, authorize('Sales', 'Admin'), async (req, res, next) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') return res.status(400).json({ success: false, message: 'Invalid customer id' });
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    const note = await prisma.customerFollowUp.create({
      data: { customerId: id, note: req.body.note },
    });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
});

export default router;
