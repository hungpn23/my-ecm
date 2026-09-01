import turboConfig from "../turbo.json" with { type: "json" };

const envContent = await Bun.file(".env").text();
const envKeyPattern = /^[ \t]*(?:export[ \t]+)?([A-Za-z_][A-Za-z0-9_]*)[ \t]*=/gm;

const envKeys = new Set(
  Array.from(envContent.matchAll(envKeyPattern), (match) => match[1]).filter(
    (key): key is string => key !== undefined,
  ),
);

const globalEnv = new Set(turboConfig.globalEnv);
const missingKeys = [...envKeys].filter((key) => !globalEnv.has(key));

if (missingKeys.length > 0) {
  console.error("Missing environment variables in turbo.json globalEnv:");

  for (const key of missingKeys) console.error(`- ${key}`);

  process.exitCode = 1;
} else {
  console.log("All root .env variables are declared in turbo.json globalEnv.");
}
