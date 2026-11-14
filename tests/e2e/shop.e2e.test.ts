import { describe, expect, it } from "bun:test";
import { randomUUID } from "node:crypto";

import request from "supertest";

import { TokenResponse } from "../../libs/contract/src/identity/auth.schema";
import { ShopDetail } from "../../libs/contract/src/identity/shop.schema";
import { User } from "../../libs/contract/src/identity/user.schema";

const identityUrl = Bun.env["E2E_IDENTITY_URL"];

if (!identityUrl) throw new Error("Set E2E_IDENTITY_URL before running E2E tests.");

const api = request(identityUrl);

async function signUp(): Promise<string> {
  const response = await api
    .post("/api/v1/auth/sign-up")
    .send({ email: `${randomUUID()}@example.invalid`, password: randomUUID() })
    .expect(201);
  const body: unknown = response.body;

  if (!TokenResponse.allows(body)) throw new Error("Sign-up response does not match the token contract.");

  return body.accessToken;
}

async function getUser(token: string): Promise<typeof User.infer> {
  const response = await api.get("/api/v1/users/info").set("Authorization", `Bearer ${token}`).expect(200);
  const body: unknown = response.body;

  if (!User.out.allows(body)) throw new Error("User response does not match the user contract.");

  return body;
}

async function createShop(token: string): Promise<typeof ShopDetail.infer> {
  const response = await api
    .post("/api/v1/shops")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Test shop" })
    .expect(201);
  const body: unknown = response.body;

  if (!ShopDetail.out.allows(body)) throw new Error("Shop response does not match the shop contract.");

  return body;
}

async function addMember(ownerToken: string, userId: string): Promise<typeof User.infer> {
  const response = await api
    .post(`/api/v1/shops/members/${userId}`)
    .set("Authorization", `Bearer ${ownerToken}`)
    .expect(201);
  const body: unknown = response.body;

  if (!User.out.allows(body)) throw new Error("User response does not match the user contract.");

  return body;
}

describe("(e2e) create shop", () => {
  it("creates a shop and makes the user its owner", async () => {
    const token = await signUp();
    const response = await api
      .post("/api/v1/shops")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test shop", description: "A test shop" })
      .expect(201);
    const shop: unknown = response.body;

    if (!ShopDetail.out.allows(shop)) throw new Error("Shop response does not match the shop contract.");

    expect(shop).toMatchObject({ name: "Test shop", description: "A test shop" });

    const userResponse = await api.get("/api/v1/users/info").set("Authorization", `Bearer ${token}`).expect(200);
    const user: unknown = userResponse.body;

    expect(user).toMatchObject({ id: shop.ownerId, shopId: shop.id, shopRole: "OWNER" });
  });

  it("creates a shop without a description", async () => {
    const token = await signUp();
    const response = await api
      .post("/api/v1/shops")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test shop" })
      .expect(201);
    const shop: unknown = response.body;

    expect(shop).toMatchObject({ name: "Test shop", description: null });
  });

  it("rejects creating another shop and preserves the existing membership", async () => {
    const token = await signUp();
    const response = await api
      .post("/api/v1/shops")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Original shop" })
      .expect(201);
    const shop: unknown = response.body;

    if (!ShopDetail.out.allows(shop)) throw new Error("Shop response does not match the shop contract.");

    await api.post("/api/v1/shops").set("Authorization", `Bearer ${token}`).send({ name: "Another shop" }).expect(403);

    const userResponse = await api.get("/api/v1/users/info").set("Authorization", `Bearer ${token}`).expect(200);
    const user: unknown = userResponse.body;

    expect(user).toMatchObject({ id: shop.ownerId, shopId: shop.id, shopRole: "OWNER" });
  });

  it.each([
    ["missing name", {}],
    ["name longer than 255 characters", { name: "a".repeat(256) }],
    ["empty description", { name: "Test shop", description: "" }],
  ])("rejects %s", async (_scenario, input) => {
    const token = await signUp();
    const response = await api.post("/api/v1/shops").set("Authorization", `Bearer ${token}`).send(input).expect(422);
    const body: unknown = response.body;

    expect(body).toMatchObject({ errorCode: "VALIDATION_FAILED" });
  });
});

describe("(e2e) add shop member", () => {
  it("adds a user as staff in the owner's shop", async () => {
    const ownerToken = await signUp();
    const shop = await createShop(ownerToken);
    const memberToken = await signUp();
    const member = await getUser(memberToken);
    const response = await addMember(ownerToken, member.id);

    expect(response).toMatchObject({ id: member.id, shopId: shop.id, shopRole: "STAFF" });
    expect(await getUser(memberToken)).toMatchObject({ id: member.id, shopId: shop.id, shopRole: "STAFF" });
  });

  it("rejects adding a user who is already a member of the shop", async () => {
    const ownerToken = await signUp();
    const shop = await createShop(ownerToken);
    const memberToken = await signUp();
    const member = await getUser(memberToken);
    await addMember(ownerToken, member.id);

    const response = await api
      .post(`/api/v1/shops/members/${member.id}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(403);
    const body: unknown = response.body;

    expect(body).toMatchObject({ errorCode: "JOIN_SHOP_NOT_ALLOWED" });
    expect(await getUser(memberToken)).toMatchObject({ shopId: shop.id, shopRole: "STAFF" });
  });

  it("rejects adding a user who belongs to another shop", async () => {
    const ownerToken = await signUp();
    await createShop(ownerToken);
    const otherOwnerToken = await signUp();
    const otherShop = await createShop(otherOwnerToken);
    const otherOwner = await getUser(otherOwnerToken);

    const response = await api
      .post(`/api/v1/shops/members/${otherOwner.id}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(403);
    const body: unknown = response.body;

    expect(body).toMatchObject({ errorCode: "JOIN_SHOP_NOT_ALLOWED" });
    expect(await getUser(otherOwnerToken)).toMatchObject({ shopId: otherShop.id, shopRole: "OWNER" });
  });
});

describe("(e2e) add shop member authorization", () => {
  it("rejects a user who does not belong to a shop", async () => {
    const actorToken = await signUp();
    const targetToken = await signUp();
    const target = await getUser(targetToken);

    await api.post(`/api/v1/shops/members/${target.id}`).set("Authorization", `Bearer ${actorToken}`).expect(403);
    expect(await getUser(targetToken)).toMatchObject({ shopId: null, shopRole: null });
  });

  it("rejects a staff member adding another user", async () => {
    const ownerToken = await signUp();
    await createShop(ownerToken);
    const staffToken = await signUp();
    const staff = await getUser(staffToken);
    await addMember(ownerToken, staff.id);
    const targetToken = await signUp();
    const target = await getUser(targetToken);

    await api.post(`/api/v1/shops/members/${target.id}`).set("Authorization", `Bearer ${staffToken}`).expect(403);
    expect(await getUser(targetToken)).toMatchObject({ shopId: null, shopRole: null });
  });
});

describe("(e2e) add shop member user ID validation", () => {
  it.each([
    ["a malformed user ID", "invalid-user-id"],
    ["a UUID v4 user ID", randomUUID()],
  ])("rejects %s", async (_scenario, userId) => {
    const ownerToken = await signUp();
    await createShop(ownerToken);
    const response = await api
      .post(`/api/v1/shops/members/${userId}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(422);
    const body: unknown = response.body;

    expect(body).toMatchObject({ errorCode: "VALIDATION_FAILED" });
  });

  it("rejects a valid user ID that does not exist", async () => {
    const ownerToken = await signUp();
    await createShop(ownerToken);
    const response = await api
      .post(`/api/v1/shops/members/${Bun.randomUUIDv7()}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(404);
    const body: unknown = response.body;

    expect(body).toMatchObject({ errorCode: "NOT_FOUND" });
  });
});
