import { describe, expect, it } from "bun:test";

import type { User } from "@libs/contract";

import { CategoryPolicy } from "./category.policy";

const user = {
  id: "019b76da-a800-7000-8000-000000000001",
  email: "user@example.com",
  role: "USER",
  shopId: null,
  shopRole: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
} as const satisfies User;

const admin = { ...user, role: "SYSTEM_ADMIN" } as const satisfies User;

describe("CategoryPolicy", () => {
  const policy = new CategoryPolicy();

  it.each(["create", "update", "delete"] as const)("%s requires the system administrator role", (action) => {
    expect(policy[action](null)).toBe(false);
    expect(policy[action](user)).toBe(false);
    expect(policy[action](admin)).toBe(true);
  });
});
