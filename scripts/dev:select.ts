import { dirname, join } from "node:path";

import checkbox from "@inquirer/checkbox";
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

  const selected = await checkbox({
    message: "Select apps to run",
    choices: apps.map((app) => ({
      name: app,
      value: app,
      checked: app === requiredApp,
      disabled: app === requiredApp ? "(always enabled)" : false,
    })),
    shortcuts: { all: null, invert: null },
  });

  const child = Bun.spawn([process.execPath, "run", "dev", ...selected.map((app) => `--filter=./apps/${app}`)], {
    cwd: root,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  process.exitCode = await child.exited;
}

try {
  await main();
} catch (error) {
  if (error instanceof Error && error.name === "ExitPromptError") {
    process.exitCode = 130;
  } else {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
