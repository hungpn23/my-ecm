import { describe, expect, it } from "bun:test";
import { randomBytes, randomUUID } from "node:crypto";

import request from "supertest";

import { TokenResponse } from "../../libs/contract/src/identity/auth.schema";
import { User } from "../../libs/contract/src/identity/user.schema";

const identityUrl = Bun.env["E2E_IDENTITY_URL"];
const email = Bun.env["E2E_EMAIL"];
const password = Bun.env["E2E_PASSWORD"];

if (!identityUrl || !email || !password) {
  throw new Error("Set E2E_IDENTITY_URL, E2E_EMAIL and E2E_PASSWORD before running E2E tests.");
}

const api = request(identityUrl);

async function signIn(): Promise<typeof TokenResponse.infer> {
  const response = await api.post("/api/v1/auth/token").send({ email, password }).expect(201);
  const body: unknown = response.body;

  if (!TokenResponse.allows(body)) throw new Error("Sign-in response does not match the token contract.");

  return body;
}

describe("(e2e) user info", () => {
  it("rejects a request without an access token", async () => {
    await api.get("/api/v1/users/info").expect(401);
  });

  it("rejects an invalid access token", async () => {
    await api.get("/api/v1/users/info").set("Authorization", "Bearer invalid-token").expect(401);
  });
});

describe("(e2e) sign up", () => {
  it("creates a user and issues a token that authenticates them", async () => {
    const newUserEmail = `${randomUUID()}@example.invalid`;
    const response = await api
      .post("/api/v1/auth/sign-up")
      .send({ email: newUserEmail, password: randomUUID() })
      .expect("Cache-Control", "no-store")
      .expect(201);
    const body: unknown = response.body;

    if (!TokenResponse.allows(body)) throw new Error("Sign-up response does not match the token contract.");

    expect(body.accessToken.length).toBeGreaterThan(0);
    expect(body.refreshToken.length).toBeGreaterThan(0);

    const userResponse = await api
      .get("/api/v1/users/info")
      .set("Authorization", `Bearer ${body.accessToken}`)
      .expect(200);
    const user: unknown = userResponse.body;

    expect(User.out.allows(user)).toBe(true);
    expect(user).toMatchObject({ email: newUserEmail });
  });

  it("rejects an invalid email", async () => {
    const response = await api
      .post("/api/v1/auth/sign-up")
      .send({ email: "invalid-email", password: randomUUID() })
      .expect(422);
    const body: unknown = response.body;

    expect(body).toMatchObject({ errorCode: "VALIDATION_FAILED" });
  });
});

describe("(e2e) sign in", () => {
  it("issues a token that authenticates the test user", async () => {
    const response = await api
      .post("/api/v1/auth/token")
      .send({ email, password })
      .expect("Cache-Control", "no-store")
      .expect(201);
    const body: unknown = response.body;

    if (!TokenResponse.allows(body)) throw new Error("Sign-in response does not match the token contract.");

    expect(body.accessToken.length).toBeGreaterThan(0);
    expect(body.refreshToken.length).toBeGreaterThan(0);

    const userResponse = await api
      .get("/api/v1/users/info")
      .set("Authorization", `Bearer ${body.accessToken}`)
      .expect(200);
    const user: unknown = userResponse.body;

    expect(User.out.allows(user)).toBe(true);
    expect(user).toMatchObject({ email });
  });

  it("rejects an incorrect password", async () => {
    const wrongPassword = password === "incorrect-password" ? "another-incorrect-password" : "incorrect-password";
    const response = await api.post("/api/v1/auth/token").send({ email, password: wrongPassword }).expect(401);
    const body: unknown = response.body;

    expect(body).toMatchObject({ errorCode: "INVALID_CREDENTIALS" });
  });

  it("rejects an unknown user", async () => {
    const unknownEmail = `${randomUUID()}@example.invalid`;
    const response = await api.post("/api/v1/auth/token").send({ email: unknownEmail, password }).expect(401);
    const body: unknown = response.body;

    expect(body).toMatchObject({ errorCode: "INVALID_CREDENTIALS" });
  });
});

describe("(e2e) refresh token", () => {
  it("rotates the refresh token and issues an access token for the test user", async () => {
    const signInBody = await signIn();

    const refreshResponse = await api
      .post("/api/v1/auth/token/refresh")
      .send({ refreshToken: signInBody.refreshToken })
      .expect("Cache-Control", "no-store")
      .expect(201);
    const refreshBody: unknown = refreshResponse.body;

    if (!TokenResponse.allows(refreshBody)) throw new Error("Refresh response does not match the token contract.");

    expect(refreshBody.refreshToken).not.toBe(signInBody.refreshToken);

    const userResponse = await api
      .get("/api/v1/users/info")
      .set("Authorization", `Bearer ${refreshBody.accessToken}`)
      .expect(200);
    const user: unknown = userResponse.body;

    expect(User.out.allows(user)).toBe(true);
    expect(user).toMatchObject({ email });
  });

  it("rejects an invalid refresh token", async () => {
    const response = await api.post("/api/v1/auth/token/refresh").send({ refreshToken: randomUUID() }).expect(401);
    const body: unknown = response.body;

    expect(body).toMatchObject({ errorCode: "INVALID_REFRESH_TOKEN" });
  });

  it("rejects a refresh token after it has been used", async () => {
    const signInResponse = await api.post("/api/v1/auth/token").send({ email, password }).expect(201);
    const signInBody: unknown = signInResponse.body;

    if (!TokenResponse.allows(signInBody)) throw new Error("Sign-in response does not match the token contract.");

    await api.post("/api/v1/auth/token/refresh").send({ refreshToken: signInBody.refreshToken }).expect(201);
    await api.post("/api/v1/auth/token/refresh").send({ refreshToken: signInBody.refreshToken }).expect(401);
  });
});

async function revokeToken(refreshToken: string): Promise<void> {
  const response = await api.post("/api/v1/auth/token/revoke").send({ refreshToken }).expect(201);
  const body: unknown = response.body;

  expect(body).toMatchObject({ ok: true });
}

describe("(e2e) revoke token", () => {
  it("revokes a refresh token and prevents it from refreshing", async () => {
    const tokens = await signIn();

    await revokeToken(tokens.refreshToken);
    await api.post("/api/v1/auth/token/refresh").send({ refreshToken: tokens.refreshToken }).expect(401);
  });

  it("accepts a refresh token that has already been revoked", async () => {
    const tokens = await signIn();

    await revokeToken(tokens.refreshToken);
    await revokeToken(tokens.refreshToken);
  });

  it("revokes the token family using a previously spent refresh token", async () => {
    const tokens = await signIn();
    const response = await api
      .post("/api/v1/auth/token/refresh")
      .send({ refreshToken: tokens.refreshToken })
      .expect(201);
    const rotatedTokens: unknown = response.body;

    if (!TokenResponse.allows(rotatedTokens)) throw new Error("Refresh response does not match the token contract.");

    await revokeToken(tokens.refreshToken);
    await api.post("/api/v1/auth/token/refresh").send({ refreshToken: rotatedTokens.refreshToken }).expect(401);
  });
});

describe("(e2e) revoke token session isolation", () => {
  it("leaves another session able to refresh", async () => {
    const firstSession = await signIn();
    const secondSession = await signIn();

    await revokeToken(firstSession.refreshToken);
    await api.post("/api/v1/auth/token/refresh").send({ refreshToken: firstSession.refreshToken }).expect(401);
    await api.post("/api/v1/auth/token/refresh").send({ refreshToken: secondSession.refreshToken }).expect(201);
  });

  it("leaves the issued access token usable after revoke", async () => {
    const tokens = await signIn();

    await revokeToken(tokens.refreshToken);

    const response = await api
      .get("/api/v1/users/info")
      .set("Authorization", `Bearer ${tokens.accessToken}`)
      .expect(200);
    const user: unknown = response.body;

    expect(user).toMatchObject({ email });
  });
});

describe("(e2e) revoke token input", () => {
  it.each([
    ["an unknown token", randomBytes(32).toString("base64url")],
    ["a malformed token", "invalid-token"],
    ["an empty token", ""],
  ])("accepts %s without revealing whether it exists", async (_scenario, refreshToken) => {
    await revokeToken(refreshToken);
  });

  it.each([
    ["a missing refresh token", {}],
    ["a null refresh token", { refreshToken: null }],
    ["a numeric refresh token", { refreshToken: 123 }],
  ])("rejects %s", async (_scenario, input) => {
    const response = await api.post("/api/v1/auth/token/revoke").send(input).expect(422);
    const body: unknown = response.body;

    expect(body).toMatchObject({ errorCode: "VALIDATION_FAILED" });
  });
});
