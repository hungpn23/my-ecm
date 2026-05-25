const root = `${import.meta.dir}/..`;
const target = resolveFromRoot(process.argv[2] ?? "apps/identity-service/.env");
const envExamplePath = resolveFromRoot("apps/identity-service/.env.example");

const keyPair = await crypto.subtle.generateKey(
  {
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  },
  true,
  ["sign", "verify"],
);

const [privateKeyDer, publicKeyDer] = await Promise.all([
  crypto.subtle.exportKey("pkcs8", keyPair.privateKey),
  crypto.subtle.exportKey("spki", keyPair.publicKey),
]);

const privateKey = derToPem("PRIVATE KEY", privateKeyDer);
const publicKey = derToPem("PUBLIC KEY", publicKeyDer);

const values: Record<string, string> = {
  JWT_PRIVATE_KEY_BASE64: btoa(privateKey),
  JWT_PUBLIC_KEY_BASE64: btoa(publicKey),
};
let content = "";

if (await Bun.file(target).exists()) {
  content = await Bun.file(target).text();
} else if (await Bun.file(envExamplePath).exists()) {
  content = await Bun.file(envExamplePath).text();
}

for (const [key, value] of Object.entries(values)) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  content = pattern.test(content)
    ? content.replace(pattern, line)
    : `${content.trimEnd()}\n${line}`;
}

await Bun.$`mkdir -p ${dirnameOf(target)}`.quiet();
await Bun.write(target, `${content.trimEnd()}\n`);

console.log(`JWT key pair written to ${target}`);

function resolveFromRoot(path: string): string {
  return path.startsWith("/") ? path : `${root}/${path}`;
}

function dirnameOf(path: string): string {
  const index = path.lastIndexOf("/");
  return index === -1 ? "." : path.slice(0, index);
}

function derToPem(label: "PRIVATE KEY" | "PUBLIC KEY", der: ArrayBuffer) {
  const base64 = bytesToBase64(new Uint8Array(der));
  const lines = base64.match(/.{1,64}/g);

  if (!lines) {
    throw new Error(`Failed to encode ${label}`);
  }

  return [`-----BEGIN ${label}-----`, ...lines, `-----END ${label}-----`, ""].join("\n");
}

function bytesToBase64(bytes: Uint8Array) {
  const chunkSize = 8192;
  let binary = "";

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}
