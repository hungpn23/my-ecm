import { describe, expect, it } from "bun:test";

import type { ShopMember, User } from "@libs/contract";
import { AuthenticationContext, AuthenticationError } from "@nestjs/authentication";
import { ForbiddenException } from "@nestjs/common";

import { ShopContext } from "./shop.context";
import { isShopMember } from "./shop.helper";

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

describe("isShopMember", () => {
  it("rejects anonymous users and users without a shop", () => {
    expect(isShopMember(null)).toBe(false);
    expect(isShopMember(user)).toBe(false);
  });

  it("recognizes a shop member", () => {
    expect(isShopMember(member)).toBe(true);
  });
});

describe("ShopContext", () => {
  const authentication = new AuthenticationContext();
  const shop = new ShopContext(authentication);

  it("returns the current member and shop ID", () => {
    expect(authentication.run<ShopMember>({ user: member }, () => shop.member)).toEqual(member);
    expect(authentication.run({ user: member }, () => shop.shopId)).toBe(member.shopId);
  });

  it("rejects an authenticated user without a shop", () => {
    expect(() => authentication.run({ user }, () => shop.member)).toThrow(ForbiddenException);
    expect(() => authentication.run({ user }, () => shop.shopId)).toThrow(ForbiddenException);
  });

  it("requires authentication", () => {
    expect(() => shop.member).toThrow(AuthenticationError);
    expect(() => shop.shopId).toThrow(AuthenticationError);
  });
});
