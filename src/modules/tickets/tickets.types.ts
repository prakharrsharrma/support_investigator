export enum InvestigationResultStatus {
  COMPLETED = "completed",
  INCOMPLETE = "incomplete",
}

export enum InvestigationResultReason {
  MODEL_FINISHED = "model_finished",
  STEP_LIMIT = "step_limit",
  TIMEOUT = "timeout",
}

export type InvestigationResult = {
  status: InvestigationResultStatus;
  reason: InvestigationResultReason | null;
  investigation: string;
};
