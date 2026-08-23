import { Glob } from "bun";
import { dirname, join } from "node:path";

const root = process.cwd();
const envExampleGlob = new Glob("**/.env.example");

async function copyEnvExample(file: string) {
  const source = join(root, file);
  const target = join(dirname(source), ".env");

  if (await Bun.file(target).exists()) return { file, copied: false };

  await Bun.write(target, Bun.file(source));
  return { file, copied: true };
}

const files = await Array.fromAsync(envExampleGlob.scan({ cwd: root, dot: true }));
const results = await Promise.all(files.map(copyEnvExample));

for (const { file, copied } of results) {
  console.log(copied ? `copy: ${file} → .env` : `skip: ${file} → .env already exists`);
}

const copiedCount = results.filter((r) => r.copied).length;
console.log(`\n${copiedCount} file(s) copied`);
