export class EvidenceValidationError extends Error {
  constructor(reference: string) {
    super(`Unsupported evidence reference: ${reference}`);
    this.name = "EvidenceValidationError";
  }
}
