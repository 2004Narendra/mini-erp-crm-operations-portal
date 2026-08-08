import bcrypt from 'bcryptjs';
import prisma from './lib/prisma.js';

async function main() {
  await prisma.$connect();
  await prisma.customerFollowUp.deleteMany();
  await prisma.challanItem.deleteMany();
  await prisma.challan.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password', 10);

  const admin = await prisma.user.create({ data: { name: 'Admin User', email: 'admin@example.com', passwordHash, role: 'Admin' } });
  const sales = await prisma.user.create({ data: { name: 'Sales User', email: 'sales@example.com', passwordHash, role: 'Sales' } });
  const warehouse = await prisma.user.create({ data: { name: 'Warehouse User', email: 'warehouse@example.com', passwordHash, role: 'Warehouse' } });
  const accounts = await prisma.user.create({ data: { name: 'Accounts User', email: 'accounts@example.com', passwordHash, role: 'Accounts' } });

  const product = await prisma.product.create({ data: { name: 'Keyboard', sku: 'KEY-001', category: 'Accessories', unitPrice: 1200, currentStock: 100, minimumStock: 10, warehouse: 'Main Warehouse' } });
  const customer = await prisma.customer.create({ data: { name: 'ABC Traders', mobile: '9999999999', email: 'abc@example.com', businessName: 'ABC Traders Pvt Ltd', gstNumber: '29ABCDE1234F1Z5', customerType: 'Wholesale', address: 'Bengaluru', status: 'Active', followUpDate: new Date(), notes: 'Preferred wholesale discounts', createdById: admin.id } });

  await prisma.stockMovement.create({ data: { productId: product.id, quantity: 100, movementType: 'IN', reason: 'Initial stock', createdById: admin.id } });
  await prisma.customerFollowUp.create({ data: { customerId: customer.id, note: 'Requested callback next Monday.' } });

  const challan = await prisma.challan.create({
    data: {
      challanNumber: 'SC-2026-00001',
      customerId: customer.id,
      totalQuantity: 10,
      status: 'Draft',
      createdById: sales.id,
      items: {
        create: [{ productId: product.id, productName: product.name, sku: product.sku, unitPrice: product.unitPrice, quantity: 10 }],
      },
    },
  });

  console.log({ admin, sales, warehouse, accounts, product, customer, challan });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
