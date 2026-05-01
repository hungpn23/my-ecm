import { dirname, join, resolve } from "node:path";
import { Glob } from "bun";

const root = resolve(import.meta.dir, "..");
const glob = new Glob("**/.env.example");
let copied = 0;

for await (const file of glob.scan({ cwd: root, dot: true })) {
  const source = join(root, file);
  const target = join(dirname(source), ".env");

  if (await Bun.file(target).exists()) {
    console.log(`skip: ${file} → .env already exists`);
    continue;
  }

  await Bun.write(target, Bun.file(source));
  console.log(`copy: ${file} → .env`);
  copied++;
}

console.log(`\n${copied} file(s) copied`);
