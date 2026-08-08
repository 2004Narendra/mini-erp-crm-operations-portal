import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  mobile: z.string().min(7, 'Mobile number must be valid'),
  email: z.string().email('Email must be valid').optional().or(z.literal('')),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
  customerType: z.enum(['Retail', 'Wholesale', 'Distributor']),
  address: z.string().optional(),
  status: z.enum(['Lead', 'Active', 'Inactive']),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});
