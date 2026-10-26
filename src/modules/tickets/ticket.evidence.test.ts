import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { validateEvidenceReferences } from "./ticket.evidence";
import { InvestigationFindings } from "./ticket.schema";

// Synthetic evidence returned by our tools
const evidence = [
  {
    tool: "getOrder",
    result: {
      orderId: "ORD-123",
      status: "shipped",
      shipmentId: "SHP-123",
    },
  },
  {
    tool: "searchPolicy",
    result: [
      {
        id: "POL-001",
        category: "refund",
      },
    ],
  },
];

// Helper to build valid findings
function createFindings(
  source: InvestigationFindings["findings"][number]["source"],
  referenceId: string,
): InvestigationFindings {
  return {
    findings: [
      {
        statement: "Test finding",
        source,
        referenceId,
      },
    ],
    missingInformation: [],
    refundEligibility: "undetermined",
    recommendedNextAction: "Investigate further",
  };
}

describe("validateEvidenceReferences", () => {
  it("accepts a retrieved order reference", () => {
    const findings = createFindings("getOrder", "ORD-123");

    assert.doesNotThrow(() => {
      validateEvidenceReferences(findings, evidence);
    });
  });

  it("rejects shipment references not retrieved", () => {
    const findings = createFindings("getShipment", "SHP-123");

    assert.throws(
      () => validateEvidenceReferences(findings, evidence),
      /Unsupported evidence reference/,
    );
  });

  it("rejects nonexistent policy references", () => {
    const findings = createFindings("searchPolicy", "POL-999");

    assert.throws(
      () => validateEvidenceReferences(findings, evidence),
      /Unsupported evidence reference/,
    );
  });

  it("accepts retrieved policy references", () => {
    const findings = createFindings("searchPolicy", "POL-001");

    assert.doesNotThrow(() => {
      validateEvidenceReferences(findings, evidence);
    });
  });
});
