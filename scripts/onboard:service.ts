import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { Glob } from "bun";

import turboConfig from "../turbo.json" with { type: "json" };

type OnboardOptions = {
  name: string;
  httpPort: number | undefined;
  tcpPort: number | undefined;
  db: boolean;
};

type ServiceOptions = OnboardOptions & { httpPort: number; tcpPort: number };

type ParseResult = { kind: "help" } | { kind: "options"; options: OnboardOptions };

const usage = `Usage:
  bun run onboard:service --name <name> [options]

Required:
  --name <name>       Service name in kebab-case, without -service

Options:
  --http-port <port>  HTTP port (default: highest apps/*/.env.example APP_PORT + 1)
  --tcp-port <port>   TCP port (default: highest root .env.example TCP port + 1)
  --db                Enable MikroORM without entities or migrations
  --help              Show this message

Authentication is always enabled. App .env.example is copied to .env.
Shared TCP config, turbo.json and root env files are updated automatically.`;

function parsePort(value: string, option: string): number {
  if (!/^\d+$/.test(value)) throw new Error(`${option} must be an integer.`);

  const port = Number(value);
  if (port < 1 || port > 65_535) throw new Error(`${option} must be between 1 and 65535.`);

  return port;
}

function parseArguments(arguments_: readonly string[]): ParseResult {
  let name: string | undefined;
  let httpPort: number | undefined;
  let tcpPort: number | undefined;
  let db = false;

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (!argument) continue;

    switch (argument) {
      case "--":
        break;
      case "--help":
        return { kind: "help" };
      case "--db":
        db = true;
        break;
      case "--name": {
        const value = arguments_[index + 1];
        if (!value) throw new Error("--name requires a value.");
        if (name) throw new Error("--name can only be provided once.");
        name = value;
        index += 1;
        break;
      }
      case "--http-port": {
        const value = arguments_[index + 1];
        if (!value) throw new Error("--http-port requires a value.");
        if (httpPort !== undefined) throw new Error("--http-port can only be provided once.");
        httpPort = parsePort(value, "--http-port");
        index += 1;
        break;
      }
      case "--tcp-port": {
        const value = arguments_[index + 1];
        if (!value) throw new Error("--tcp-port requires a value.");
        if (tcpPort !== undefined) throw new Error("--tcp-port can only be provided once.");
        tcpPort = parsePort(value, "--tcp-port");
        index += 1;
        break;
      }
      default:
        throw new Error(`Unknown option: ${argument}`);
    }
  }

  if (!name) throw new Error("--name is required.");
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error("--name must use kebab-case.");
  }
  if (name.endsWith("-service")) {
    throw new Error("--name must omit the -service suffix.");
  }

  return {
    kind: "options",
    options: { name, httpPort, tcpPort, db },
  };
}

function toServiceTitle(name: string): string {
  return name
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function createPackageJson(options: OnboardOptions): string {
  const packageImports = options.db
    ? {
        "#internal/*": "./src/*.ts",
        "#mikro-orm/generated": "./entities.generated.ts",
      }
    : { "#internal/*": "./src/*.ts" };
  const scripts = Object.fromEntries([
    ["build", "bun ../../scripts/build.ts"],
    ["check:types", "bun check"],
    ["dev", "bun --watch src/main.ts"],
    ...(options.db
      ? [
          ["discovery:export", "bun mikro-orm discovery:export"],
          ["migration:down", "bun mikro-orm migration:down"],
          ["migration:up", "bun mikro-orm migration:up"],
          ["orm:debug", "bun mikro-orm debug"],
        ]
      : []),
    ["start", "bun src/main.ts"],
  ]);
  const dependencies: [string, string][] = [
    ["@libs/common", "workspace:*"],
    ["@libs/contract", "workspace:*"],
    ["@libs/core", "workspace:*"],
    ["@nestjs/common", "catalog:nest"],
    ["@nestjs/core", "catalog:nest"],
    ["@nestjs/microservices", "catalog:nest"],
    ["@nestjs/platform-express", "catalog:nest"],
    ["@nestjs/swagger", "catalog:nest"],
    ["nestjs-pino", "catalog:logging"],
    ["reflect-metadata", "catalog:backend"],
    ["rxjs", "catalog:backend"],
  ];

  if (options.db) {
    dependencies.push(
      ["@mikro-orm/cli", "catalog:mikro"],
      ["@mikro-orm/core", "catalog:mikro"],
      ["@mikro-orm/migrations", "catalog:mikro"],
      ["@mikro-orm/nestjs", "catalog:mikro"],
      ["@mikro-orm/postgresql", "catalog:mikro"],
      ["dotenv", "catalog:backend"],
    );
  }

  return `${JSON.stringify(
    {
      name: `@apps/${options.name}-service`,
      version: "0.0.0",
      private: true,
      type: "module",
      imports: packageImports,
      scripts,
      dependencies: Object.fromEntries(dependencies.sort(([left], [right]) => left.localeCompare(right))),
      devDependencies: {},
    },
    null,
    2,
  )}\n`;
}

function createTsConfig(): string {
  return `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.json",
  "include": ["src/**/*.ts"]
}\n`;
}

function createMain(options: OnboardOptions): string {
  const serviceTitle = toServiceTitle(options.name);
  const tcpPrefix = toTcpPrefix(options.name);

  return `import "@libs/contract/arktype-global";

import { ArktypeValidationPipe, RpcExceptionFilter } from "@libs/common";
import { type AppConfig, appConfig, type TcpConfig, tcpConfig } from "@libs/core";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type TcpOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, type OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { Logger, registerMicroserviceLogging } from "nestjs-pino";
import "reflect-metadata";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    routeConflictPolicy: { duplicate: "error", shadow: "error" },
  });

  app.enableShutdownHooks();

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  const { APP_HOST, APP_PORT } = app.get<unknown, AppConfig>(appConfig.KEY);
  const { ${tcpPrefix}_TCP_HOST, ${tcpPrefix}_TCP_PORT } = app.get<unknown, TcpConfig>(tcpConfig.KEY);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("${serviceTitle} Service API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, documentFactory);

  const ms = app.connectMicroservice<TcpOptions>(
    {
      transport: Transport.TCP,
      options: {
        host: ${tcpPrefix}_TCP_HOST,
        port: ${tcpPrefix}_TCP_PORT,
      },
    },
    { deferInitialization: true },
  );
  registerMicroserviceLogging(ms);
  ms.useGlobalPipes(new ArktypeValidationPipe());
  ms.useGlobalFilters(new RpcExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(APP_PORT, APP_HOST);

  logger.log(\`🔥 Swagger: http://\${APP_HOST}:\${APP_PORT}/swagger\`);
  logger.log(\`🟢 HTTP: http://\${APP_HOST}:\${APP_PORT}/api\`);
  logger.log(\`🔵 TCP: \${${tcpPrefix}_TCP_HOST}:\${${tcpPrefix}_TCP_PORT}\`);
}

await bootstrap();
`;
}

function createAppModule(options: OnboardOptions): string {
  const commonImports = [
    "ArktypeValidationPipe",
    ...(options.db ? ["MikroOrmExceptionFilter"] : []),
    "RxjsExceptionFilter",
  ];
  const coreImports = ["AuthModule", "ConfigModule", ...(options.db ? ["DatabaseModule"] : []), "LoggerModule"];
  const imports = [
    "ConfigModule.forRoot()",
    ...(options.db ? ["DatabaseModule.forRoot(entities)"] : []),
    "LoggerModule.forRoot()",
    "AuthModule",
  ];
  const providers = [
    `{
      provide: APP_FILTER,
      useClass: RxjsExceptionFilter,
    }`,
    ...(options.db
      ? [
          `{
      provide: APP_FILTER,
      useClass: MikroOrmExceptionFilter,
    }`,
        ]
      : []),
    `{
      provide: APP_PIPE,
      useClass: ArktypeValidationPipe,
    }`,
    `{
      provide: APP_INTERCEPTOR,
      useClass: StandardSchemaSerializerInterceptor,
    }`,
  ];
  const coreImport =
    coreImports.length <= 3
      ? `import { ${coreImports.join(", ")} } from "@libs/core";`
      : `import {\n  ${coreImports.join(",\n  ")},\n} from "@libs/core";`;
  const moduleImports =
    imports.length <= 3 ? `imports: [${imports.join(", ")}],` : `imports: [\n    ${imports.join(",\n    ")},\n  ],`;

  return `import { ${commonImports.join(", ")} } from "@libs/common";
${coreImport}
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
${options.db ? '\nimport { entities } from "#mikro-orm/generated";\n' : ""}

@Module({
  ${moduleImports}
  providers: [
    ${providers.join(",\n    ")},
  ],
})
export class AppModule {}
`;
}

function createMikroOrmConfig(): string {
  return `import { databaseConfig, defineDatabaseConfig } from "@libs/core";
import { config } from "dotenv";
import { resolve } from "node:path";

config({
  path: [resolve(import.meta.dirname, "../../.env"), resolve(import.meta.dirname, ".env")],
});

export default defineDatabaseConfig(databaseConfig());
`;
}

function createEntitiesGenerated(): string {
  return `import type { EntitySchema } from "@mikro-orm/core";

export const entities: readonly EntitySchema[] = [];
`;
}

function createFiles(options: ServiceOptions): [string, string][] {
  const files: [string, string][] = [
    [
      ".env.example",
      `APP_NAME=${options.name}-service\nAPP_PORT=${options.httpPort}\n${options.db ? `\nDB_DATABASE=${options.name}-service\n` : ""}`,
    ],
    ["package.json", createPackageJson(options)],
    ["tsconfig.json", createTsConfig()],
    ["src/main.ts", createMain(options)],
    ["src/app.module.ts", createAppModule(options)],
  ];

  if (options.db) {
    files.push(["entities.generated.ts", createEntitiesGenerated()]);
    files.push(["mikro-orm.config.ts", createMikroOrmConfig()]);
    files.push(["src/database/entity/index.ts", "export {};\n"]);
  }

  return files;
}

function toTcpPrefix(name: string): string {
  return `${name.replaceAll("-", "_").toUpperCase()}_SERVICE`;
}

function nextPort(contents: readonly string[], pattern: RegExp, option: string): number {
  const ports = contents.flatMap((content) =>
    Array.from(content.matchAll(pattern), (match) => parsePort(match[1] ?? "", option)),
  );

  if (ports.length === 0) throw new Error(`Cannot infer ${option} from .env.example files. Provide it explicitly.`);

  return parsePort(String(Math.max(...ports) + 1), option);
}

function appendTcpEnv(content: string, prefix: string, port: number): string {
  const keys = new Set(
    Array.from(content.matchAll(/^[ \t]*(?:export[ \t]+)?([A-Za-z_][A-Za-z0-9_]*)[ \t]*=/gm), (match) => match[1]),
  );
  const entries = [
    [`${prefix}_TCP_HOST`, "localhost"],
    [`${prefix}_TCP_PORT`, String(port)],
  ];
  const missing = entries.filter(([key]) => !keys.has(key)).map(([key, value]) => `${key}=${value}\n`);
  if (missing.length === 0) return content;

  const lastTcp = Array.from(
    content.matchAll(/^[ \t]*(?:export[ \t]+)?[A-Z][A-Z0-9_]*_TCP_(?:HOST|PORT)[ \t]*=[^\r\n]*(?:\r?\n|$)/gm),
  ).at(-1);
  const index = lastTcp ? lastTcp.index + lastTcp[0].length : content.length;
  const before = content.slice(0, index);

  return `${before}${before.length > 0 && !before.endsWith("\n") ? "\n" : ""}${missing.join("")}${content.slice(index)}`;
}

async function createService(options: OnboardOptions): Promise<void> {
  const root = dirname(import.meta.dir);
  const serviceName = `${options.name}-service`;
  const serviceDirectory = join(root, "apps", serviceName);

  if (existsSync(serviceDirectory)) {
    throw new Error(`${serviceDirectory} already exists.`);
  }

  const envExamplePath = join(root, ".env.example");
  const envPath = join(root, ".env");
  const tcpConfigPath = join(root, "libs/core/src/config/tcp.config.ts");
  const [envExample, tcpSource] = await Promise.all([
    readFile(envExamplePath, "utf8"),
    readFile(tcpConfigPath, "utf8"),
  ]);
  const tcpPrefix = toTcpPrefix(options.name);
  const tcpMarker = "  }),";

  if (new RegExp(`^[ \\t]*${tcpPrefix}_TCP_(?:HOST|PORT)[ \\t]*:`, "m").test(tcpSource)) {
    throw new Error(`${tcpPrefix} is already registered in tcp.config.ts.`);
  }
  if (tcpSource.split(tcpMarker).length !== 2) {
    throw new Error("Cannot locate the TCP schema in tcp.config.ts.");
  }

  const httpExamples =
    options.httpPort === undefined
      ? await Array.fromAsync(new Glob("apps/*/.env.example").scan({ cwd: root, dot: true }))
      : [];
  const httpContents = await Promise.all(httpExamples.map((file) => readFile(join(root, file), "utf8")));
  const httpPort =
    options.httpPort ??
    nextPort(
      httpContents,
      /^[ \t]*(?:export[ \t]+)?APP_PORT[ \t]*=[ \t]*["']?(\d+)["']?[ \t]*(?:#.*)?$/gm,
      "--http-port",
    );
  const tcpPort =
    options.tcpPort ??
    nextPort(
      [envExample],
      /^[ \t]*(?:export[ \t]+)?[A-Z][A-Z0-9_]*_TCP_PORT[ \t]*=[ \t]*["']?(\d+)["']?[ \t]*(?:#.*)?$/gm,
      "--tcp-port",
    );
  const updatedExample = appendTcpEnv(envExample, tcpPrefix, tcpPort);
  const updatedEnv = existsSync(envPath)
    ? appendTcpEnv(await readFile(envPath, "utf8"), tcpPrefix, tcpPort)
    : updatedExample;
  const updatedTcpSource = tcpSource.replace(
    tcpMarker,
    `    ${tcpPrefix}_TCP_HOST: "string.host",\n    ${tcpPrefix}_TCP_PORT: "number.port",\n${tcpMarker}`,
  );
  const globalEnv = [...turboConfig.globalEnv];
  const lastTcpIndex = globalEnv.findLastIndex((key) => /_TCP_(?:HOST|PORT)$/.test(key));
  const tcpKeys = [`${tcpPrefix}_TCP_HOST`, `${tcpPrefix}_TCP_PORT`].filter((key) => !globalEnv.includes(key));
  globalEnv.splice(lastTcpIndex === -1 ? globalEnv.length : lastTcpIndex + 1, 0, ...tcpKeys);
  const updatedTurbo = { ...turboConfig, globalEnv };
  const files = createFiles({ ...options, httpPort, tcpPort });

  await mkdir(serviceDirectory);
  await Promise.all(
    files.map(async ([relativePath, content]) => {
      const filePath = join(serviceDirectory, relativePath);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, content);
    }),
  );
  await copyFile(join(serviceDirectory, ".env.example"), join(serviceDirectory, ".env"));
  await writeFile(tcpConfigPath, updatedTcpSource);
  await writeFile(join(root, "turbo.json"), `${JSON.stringify(updatedTurbo, null, 2)}\n`);
  await writeFile(envExamplePath, updatedExample);
  await writeFile(envPath, updatedEnv);

  console.log(`Created apps/${serviceName} (HTTP: ${httpPort}, TCP: ${tcpPort}).`);
  console.log("Copied app .env.example to .env and updated shared TCP config, turbo.json and root env files.");
}

async function main(): Promise<void> {
  const result = parseArguments(Bun.argv.slice(2));

  if (result.kind === "help") {
    console.log(usage);
    return;
  }

  await createService(result.options);
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
