import { describe, expect, it } from "bun:test";

import type { User } from "@libs/contract";

import { ProductPolicy } from "./product.policy";

const user = {
  id: "019b76da-a800-7000-8000-000000000001",
  email: "user@example.com",
  role: "USER",
  shopId: null,
  shopRole: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
} as const satisfies User;

const member = { ...user, shopId: "019b76da-a800-7000-8000-000000000002", shopRole: "STAFF" } as const satisfies User;

describe("ProductPolicy", () => {
  const policy = new ProductPolicy();

  it.each(["view", "viewDetail", "create", "update", "delete"] as const)(
    "%s requires membership in a shop",
    (action) => {
      expect(policy[action](null)).toBe(false);
      expect(policy[action](user)).toBe(false);
      expect(policy[action](member)).toBe(true);
    },
  );
});
