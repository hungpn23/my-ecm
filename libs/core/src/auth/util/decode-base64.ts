export function decodeBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString();
}
