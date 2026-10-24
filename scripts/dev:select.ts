import { dirname, join } from "node:path";

import { confirm, isCancel, log, multiselect } from "@clack/prompts";
import { Glob } from "bun";

async function main(): Promise<void> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("dev:select requires an interactive terminal.");
  }

  const root = dirname(import.meta.dir);
  const manifests = await Array.fromAsync(new Glob("*/package.json").scan({ cwd: join(root, "apps") }));
  const apps = manifests.map((file) => dirname(file)).toSorted((left, right) => left.localeCompare(right));
  const requiredApp = "identity-service";

  if (!apps.includes(requiredApp)) {
    throw new Error(`apps/${requiredApp}/package.json is required.`);
  }

  log.info(`${requiredApp.replace(/-service$/, "")} (always enabled)`);
  const optionalApps = apps.filter((app) => app !== requiredApp);
  if (optionalApps.length === 0) {
    const start = await confirm({ message: `Start ${requiredApp.replace(/-service$/, "")}?`, initialValue: true });
    if (isCancel(start) || !start) {
      process.exitCode = isCancel(start) ? 130 : 0;
      return;
    }
  }

  const selected =
    optionalApps.length > 0
      ? await multiselect({
          message: "Select additional apps to run",
          options: optionalApps.map((app) => ({ label: app.replace(/-service$/, ""), value: app })),
          required: false,
        })
      : [];

  if (isCancel(selected)) {
    process.exitCode = 130;
    return;
  }

  const child = Bun.spawn(
    [process.execPath, "run", "dev", ...[requiredApp, ...selected].map((app) => `--filter=./apps/${app}`)],
    {
      cwd: root,
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    },
  );
  process.exitCode = await child.exited;
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
