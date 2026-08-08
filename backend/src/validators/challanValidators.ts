import { z } from 'zod';

export const challanSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product is required'),
      quantity: z.number().int().positive('Quantity must be greater than zero'),
    })
  ).min(1, 'At least one product is required'),
});
