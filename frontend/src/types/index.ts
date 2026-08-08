export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Customer = {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  businessName?: string;
  gstNumber?: string;
  customerType: string;
  address?: string;
  status: string;
  followUpDate?: string;
  notes?: string;
  createdAt?: string;
  followUps?: Array<{ id: string; note: string; createdAt: string }>;
  challans?: Array<{ id: string; challanNumber: string }>;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  warehouse: string;
};

export type StockMovement = {
  id: string;
  quantity: number;
  movementType: string;
  reason?: string;
  createdAt: string;
  createdBy?: { name: string };
  product?: { name: string };
};

export type ChallanItem = {
  id: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
};

export type Challan = {
  id: string;
  challanNumber: string;
  customer?: Customer;
  customerId: string;
  totalQuantity: number;
  status: string;
  createdBy?: User;
  createdAt: string;
  items?: ChallanItem[];
};
