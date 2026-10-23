export interface Order {
  orderId: string;
  status: "placed" | "shipped" | "delivered";
  amount: number;
  shipmentId: string | null;
}

export const orders: Order[] = [
  {
    orderId: "ORD-123",
    status: "shipped",
    amount: 2499,
    shipmentId: "SHP-123",
  },
  {
    orderId: "ORD-456",
    status: "delivered",
    amount: 1599,
    shipmentId: "SHP-456",
  },
];
