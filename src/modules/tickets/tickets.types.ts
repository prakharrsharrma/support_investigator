import {
  InvestigationFindings,
  InvestigationFindingsResponse,
} from "./ticket.schema";

export enum InvestigationResultStatus {
  COMPLETED = "completed",
  INCOMPLETE = "incomplete",
}

export enum InvestigationResultReason {
  MODEL_FINISHED = "model_finished",
  STEP_LIMIT = "step_limit",
  TIMEOUT = "timeout",
}

export type InvestigationResult =
  | ((
      | {
          status: InvestigationResultStatus.COMPLETED;
          reason: InvestigationResultReason.MODEL_FINISHED;
        }
      | {
          status: InvestigationResultStatus.INCOMPLETE;
          reason: InvestigationResultReason.STEP_LIMIT;
        }
    ) &
      InvestigationFindings)
  | {
      status: InvestigationResultStatus.INCOMPLETE;
      reason: InvestigationResultReason.TIMEOUT;
      message: string;
    };

export interface InvestigationTrace {
  startedAt: string;
  durationMs: number;
  modelCalls: number;
  toolCalls: Array<{
    name: string;
    durationMs: number;
  }>;
  modelCallDurationsMs: number[];
}
