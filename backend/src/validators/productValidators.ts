import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  unitPrice: z.number().nonnegative('Unit price cannot be negative'),
  currentStock: z.number().nonnegative('Stock cannot be negative'),
  minimumStock: z.number().nonnegative('Minimum stock cannot be negative'),
  warehouse: z.string().min(1, 'Warehouse is required'),
});
