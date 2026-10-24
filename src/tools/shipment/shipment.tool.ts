import { shipments } from "../../data/shipment";

export function getShipment(shipmentId: string) {
  return (
    shipments.find((shipment) => shipment.shipmentId === shipmentId) ?? null
  );
}
