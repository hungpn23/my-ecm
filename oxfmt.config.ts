import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [
    "AGENTS.md",
    "tools/oxlint/anti-slop/**",
    "bun.lock",
    "**/*/entities.generated.ts",
    "**/migration/*",
  ],
  sortPackageJson: {
    sortScripts: true,
  },
});
