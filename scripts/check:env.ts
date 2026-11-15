import { Glob } from "bun";

import turboConfig from "../turbo.json" with { type: "json" };

const envKeyPattern = /^[ \t]*(?:export[ \t]+)?([A-Za-z_][A-Za-z0-9_]*)[ \t]*=/gm;
const globalEnv = new Set(turboConfig.globalEnv);
const forbiddenSharedEnv = ["APP_NAME", "APP_PORT"];

type EnvFile = { path: string; keys: Set<string> | undefined };

async function readEnvFile(path: string): Promise<EnvFile> {
  const file = Bun.file(path);
  if (!(await file.exists())) return { path, keys: undefined };

  const content = await file.text();
  const keys = new Set(
    Array.from(content.matchAll(envKeyPattern), (match) => match[1]).filter((key): key is string => key !== undefined),
  );
  return { path, keys };
}

function printGroup(name: string, forbiddenKeys: string[]): void {
  console.log(`\n${name}`);
  console.log(`  Forbidden variables: ${forbiddenKeys.length > 0 ? forbiddenKeys.join(", ") : "none"}`);
}

function checkFile(file: EnvFile, allowedKeys: Set<string> | undefined, forbiddenKeys: string[]): boolean {
  if (!file.keys) {
    console.error(`  ❌ ${file.path}: file not found`);
    return false;
  }

  const forbidden = [...file.keys].filter((key) => forbiddenKeys.includes(key));
  const missing = allowedKeys ? [...file.keys].filter((key) => !allowedKeys.has(key)) : [];
  if (forbidden.length === 0 && missing.length === 0) {
    console.log(`  ✅ ${file.path}`);
    return true;
  }

  console.error(`  ❌ ${file.path}`);
  if (forbidden.length > 0) console.error(`    Forbidden variables: ${forbidden.join(", ")}`);
  if (missing.length > 0) console.error(`    Variables missing from turbo.json globalEnv: ${missing.join(", ")}`);
  return false;
}

function checkPair(env: EnvFile, example: EnvFile, forbiddenKeys: string[]): boolean {
  const envValid = checkFile(env, undefined, forbiddenKeys);
  const exampleValid = checkFile(example, undefined, forbiddenKeys);
  if (!env.keys || !example.keys) return false;

  const missing = [...example.keys].filter((key) => !env.keys?.has(key));
  const extra = [...env.keys].filter((key) => !example.keys?.has(key));
  if (missing.length > 0)
    console.error(`  ❌ ${env.path}: missing variables from ${example.path}: ${missing.join(", ")}`);
  if (extra.length > 0) console.error(`  ❌ ${example.path}: missing variables from ${env.path}: ${extra.join(", ")}`);
  if (missing.length === 0 && extra.length === 0) console.log(`  ✅ ${env.path} matches ${example.path}`);
  return envValid && exampleValid && missing.length === 0 && extra.length === 0;
}

function checkAppEnv(name: string, env: EnvFile, example: EnvFile): boolean {
  if (!env.keys || !example.keys) {
    if (!env.keys) console.error(`  ❌ ERROR ${name}: file not found: ${env.path}`);
    if (!example.keys) console.error(`  ❌ ERROR ${name}: file not found: ${example.path}`);
    return false;
  }

  const missing = [...example.keys].filter((key) => !env.keys?.has(key));
  const extra = [...env.keys].filter((key) => !example.keys?.has(key));

  if (missing.length > 0)
    console.error(`  ❌ ERROR ${name}: ${env.path} is missing variables from ${example.path}: ${missing.join(", ")}`);
  if (extra.length > 0)
    console.warn(`  ⚠️ WARN ${name}: ${example.path} is missing variables from ${env.path}: ${extra.join(", ")}`);
  if (missing.length === 0 && extra.length === 0) console.log(`  ✅ SUCCESS ${name}: files match`);

  return missing.length === 0;
}

const appManifests = await Array.fromAsync(new Glob("apps/*/package.json").scan());
const appDirs = appManifests.map((path) => path.replace(/\/package\.json$/, "")).sort();
const [rootEnv, rootExample, dockerEnv, dockerExample] = await Promise.all([
  readEnvFile(".env"),
  readEnvFile(".env.example"),
  readEnvFile(".env.docker"),
  readEnvFile(".env.docker.example"),
]);
const appPairs = await Promise.all(
  appDirs.map(async (path) => {
    const [env, example] = await Promise.all([readEnvFile(`${path}/.env`), readEnvFile(`${path}/.env.example`)]);
    return { name: path.slice("apps/".length), env, example };
  }),
);

printGroup("Root env", forbiddenSharedEnv);
const rootValid = checkFile(rootEnv, globalEnv, forbiddenSharedEnv);
const rootExampleValid = checkFile(rootExample, undefined, forbiddenSharedEnv);

printGroup("App env", []);
const appResults = appPairs.map(({ name, env, example }) => checkAppEnv(name, env, example));

printGroup("Docker env", forbiddenSharedEnv);
const dockerValid = checkPair(dockerEnv, dockerExample, forbiddenSharedEnv);

if (!rootValid || !rootExampleValid || !appResults.every(Boolean) || !dockerValid) process.exitCode = 1;
