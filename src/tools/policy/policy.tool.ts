import type { Policy, PolicyCategory } from "../../data/policies";
import { policies } from "../../data/policies";

export function searchPolicy(category: PolicyCategory): Policy[] {
  return policies.filter((policy) => policy.category === category);
}
