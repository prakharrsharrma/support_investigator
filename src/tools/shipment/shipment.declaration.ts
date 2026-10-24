import { Type, type FunctionDeclaration } from "@google/genai";

export const getShipmentDeclaration: FunctionDeclaration = {
  name: "getShipment",
  description: "Retrieve shipment tracking status using a shipment ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      shipmentId: {
        type: Type.STRING,
        description: "Shipment identifier, e.g. SHP-123",
      },
    },
    required: ["shipmentId"],
  },
};
