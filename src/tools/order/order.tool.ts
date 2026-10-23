import { orders, type Order } from "../../data/orders";

export function getOrder(orderId: string): Order | null {
  return orders.find((order) => order.orderId === orderId) ?? null;
}
