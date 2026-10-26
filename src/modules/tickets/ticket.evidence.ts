import { EvidenceValidationError } from "../../errors/ai/error.validations";
import { InvestigationFindings } from "./ticket.schema";

type Evidence = {
  tool: string;
  result: unknown;
};

export function validateEvidenceReferences(
  findings: InvestigationFindings,
  evidence: Evidence[],
): void {
  const validReferences = new Set<string>();

  for (const entry of evidence) {
    switch (entry.tool) {
      case "getOrder": {
        const order = entry.result as { orderId: string } | null;

        if (order) {
          validReferences.add(`getOrder:${order.orderId}`);
        }
        break;
      }

      case "getShipment": {
        const shipment = entry.result as {
          shipmentId: string;
        } | null;

        if (shipment) {
          validReferences.add(`getShipment:${shipment.shipmentId}`);
        }
        break;
      }

      case "searchPolicy": {
        const policies = entry.result as Array<{ id: string }>;

        for (const policy of policies) {
          validReferences.add(`searchPolicy:${policy.id}`);
        }
        break;
      }
    }
  }

  for (const finding of findings.findings) {
    const key = `${finding.source}:${finding.referenceId}`;

    if (!validReferences.has(key)) {
      throw new EvidenceValidationError(key);
    }
  }
}
