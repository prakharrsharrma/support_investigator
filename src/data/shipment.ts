export interface Shipment {
  shipmentId: string;
  status: "in_transit" | "delayed" | "delivered";
  estimatedDelivery: string | null;
}

export const shipments: Shipment[] = [
  {
    shipmentId: "SHP-123",
    status: "delayed",
    estimatedDelivery: null,
  },
  {
    shipmentId: "SHP-456",
    status: "delivered",
    estimatedDelivery: null,
  },
];
