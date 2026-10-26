export enum PolicyCategory {
  REFUND = "refund",
  DELIVERY = "delivery",
  DAMAGE = "damage",
}

export interface Policy {
  id: string;
  category: PolicyCategory;
  title: string;
  description: string;
}

export const policies: Policy[] = [
  {
    id: "POL-001",
    category: PolicyCategory.REFUND,
    title: "Refund for delayed orders",
    description:
      "Orders delayed by more than 7 days beyond " +
      "their promised delivery date may be eligible " +
      "for a refund after verification.",
  },
  {
    id: "POL-002",
    category: PolicyCategory.DELIVERY,
    title: "Missing deliveries",
    description:
      "Orders marked delivered but reported missing " +
      "require delivery verification before resolution.",
  },
  {
    id: "POL-003",
    category: PolicyCategory.DAMAGE,
    title: "Damaged products",
    description:
      "Customers reporting damaged items must provide " +
      "evidence of damage before refund review.",
  },
];
