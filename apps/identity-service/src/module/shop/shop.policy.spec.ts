import { describe, expect, it } from "bun:test";

import type { User } from "@libs/contract";

import { ShopPolicy } from "./shop.policy";

const user = {
  id: "019b76da-a800-7000-8000-000000000001",
  email: "user@example.com",
  role: "USER",
  shopId: null,
  shopRole: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
} as const satisfies User;

const member = { ...user, shopId: "019b76da-a800-7000-8000-000000000002", shopRole: "OWNER" } as const satisfies User;

describe("ShopPolicy.create", () => {
  const policy = new ShopPolicy();

  it("allows a user who does not belong to a shop", () => {
    expect(policy.create(user)).toBe(true);
  });

  it("denies a user who already belongs to a shop", () => {
    expect(policy.create(member)).toBe(false);
  });

  it("denies an unauthenticated user", () => {
    expect(policy.create(null)).toBe(false);
  });
});
