import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { confirm, group, text } from "@clack/prompts";
import { Glob } from "bun";

import turboConfig from "../turbo.json" with { type: "json" };

type OnboardOptions = {
  name: string;
  httpPort: number | undefined;
  tcpPort: number | undefined;
  db: boolean;
};

type ServiceOptions = OnboardOptions & { httpPort: number; tcpPort: number };

function parsePort(value: string, option: string): number {
  if (!/^\d+$/.test(value)) throw new Error(`${option} must be an integer.`);

  const port = Number(value);
  if (port < 1 || port > 65_535) throw new Error(`${option} must be between 1 and 65535.`);

  return port;
}

function validatePort(value: string, label: string): string | undefined {
  if (value === "") return;

  try {
    parsePort(value, label);
    return;
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid port.";
  }
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
    ["check:types", "bun check"],
    ["dev", "bun --watch src/main.ts"],
    ...(options.db
      ? [
          ["discovery:export", "bun mikro-orm discovery:export"],
          ["migration:create", "bun mikro-orm migration:create"],
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
    ["@nestjs/observe", "catalog:nest"],
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
  const tcpProperty = toTcpProperty(options.name);

  return `import "@libs/contract/arktype-global";

import { ArktypeValidationPipe, RpcExceptionFilter } from "@libs/common";
import { type AppConfig, appConfig, type TcpConfig, tcpConfig } from "@libs/core";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type TcpOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, type OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { Logger, registerMicroserviceLogging } from "nestjs-pino";
import "reflect-metadata";
import { AppModule, ObserveInstrument } from "./app.module";

async function bootstrap(): Promise<void> {
  if (!ObserveInstrument) throw new Error("Observe instrument is unavailable");

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    instrument: ObserveInstrument,
    routeConflictPolicy: { duplicate: "error", shadow: "error" },
  });

  app.enableShutdownHooks();

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  const { appHost, appPort } = app.get<unknown, AppConfig>(appConfig.KEY);
  const { ${tcpProperty}Host, ${tcpProperty}Port } = app.get<unknown, TcpConfig>(tcpConfig.KEY);

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
        host: ${tcpProperty}Host,
        port: ${tcpProperty}Port,
      },
    },
    { deferInitialization: true },
  );
  registerMicroserviceLogging(ms);
  ms.useGlobalPipes(new ArktypeValidationPipe());
  ms.useGlobalFilters(new RpcExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(appPort, appHost);

  logger.log(\`🔥 Swagger: http://\${appHost}:\${appPort}/swagger\`);
  logger.log(\`🟢 HTTP: http://\${appHost}:\${appPort}/api\`);
  logger.log(\`🔵 TCP: \${${tcpProperty}Host}:\${${tcpProperty}Port}\`);
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
  const coreImports = [
    "type AppConfig",
    "appConfig",
    "AuthModule",
    "ConfigModule",
    ...(options.db ? ["DatabaseModule"] : []),
    "LoggerModule",
  ];
  const imports = [
    `ObserveModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (config: AppConfig) => ({
        appKey: config.observeAppKey,
        appSecret: config.observeAppSecret,
        serviceId: config.appName,
        debug: config.observeEnableDebug,
      }),
    })`,
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
import { createObserveModule } from "@nestjs/observe";
${options.db ? '\nimport { entities } from "#mikro-orm/generated";\n' : ""}

export const { ObserveModule, ObserveInstrument } = createObserveModule();

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

function toTcpProperty(name: string): string {
  const [first, ...rest] = name.split("-");
  return `${first}${rest.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("")}ServiceTcp`;
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
  const tcpMarker = "  });";
  const tcpReturnMarker = "  };";
  const tcpProperty = toTcpProperty(options.name);

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
      "HTTP port",
    );
  const tcpPort =
    options.tcpPort ??
    nextPort(
      [envExample],
      /^[ \t]*(?:export[ \t]+)?[A-Z][A-Z0-9_]*_TCP_PORT[ \t]*=[ \t]*["']?(\d+)["']?[ \t]*(?:#.*)?$/gm,
      "TCP port",
    );
  const updatedExample = appendTcpEnv(envExample, tcpPrefix, tcpPort);
  const updatedEnv = existsSync(envPath)
    ? appendTcpEnv(await readFile(envPath, "utf8"), tcpPrefix, tcpPort)
    : updatedExample;
  const updatedTcpSource = tcpSource.replace(
    tcpMarker,
    `    ${tcpPrefix}_TCP_HOST: "string.host",\n    ${tcpPrefix}_TCP_PORT: "number.port",\n${tcpMarker}`,
  );
  const updatedTcpMapping = updatedTcpSource.replace(
    tcpReturnMarker,
    `    ${tcpProperty}Host: env.${tcpPrefix}_TCP_HOST,\n    ${tcpProperty}Port: env.${tcpPrefix}_TCP_PORT,\n${tcpReturnMarker}`,
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
  await writeFile(tcpConfigPath, updatedTcpMapping);
  await writeFile(join(root, "turbo.json"), `${JSON.stringify(updatedTurbo, null, 2)}\n`);
  await writeFile(envExamplePath, updatedExample);
  await writeFile(envPath, updatedEnv);

  console.log(`Created apps/${serviceName} (HTTP: ${httpPort}, TCP: ${tcpPort}).`);
  console.log("Copied app .env.example to .env and updated shared TCP config, turbo.json and root env files.");
}

async function main(): Promise<void> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("onboard:service requires an interactive terminal.");
  }

  if (Bun.argv.length > 2) {
    throw new Error("Run bun onboard:service without arguments.");
  }

  const { name, httpPort, tcpPort, db } = await group(
    {
      name: () =>
        text({
          message: "Service name (kebab-case, without -service)",
          validate: (value) => {
            if (!value || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value)) {
              return "Service name must use kebab-case.";
            }
            if (value.endsWith("-service")) return "Omit the -service suffix.";
            if (existsSync(join(import.meta.dir, "../apps", `${value}-service`))) {
              return `apps/${value}-service already exists.`;
            }
            return;
          },
        }),
      httpPort: () =>
        text({
          message: "HTTP port (leave blank to choose automatically)",
          validate: (value) => validatePort(value ?? "", "HTTP port"),
        }),
      tcpPort: () =>
        text({
          message: "TCP port (leave blank to choose automatically)",
          validate: (value) => validatePort(value ?? "", "TCP port"),
        }),
      db: () =>
        confirm({
          message: "Enable MikroORM?",
          initialValue: false,
          active: "yes",
          inactive: "no",
        }),
    },
    {
      onCancel: () => {
        throw new DOMException("Onboarding cancelled.", "AbortError");
      },
    },
  );

  await createService({
    name,
    httpPort: httpPort === "" ? undefined : parsePort(httpPort, "HTTP port"),
    tcpPort: tcpPort === "" ? undefined : parsePort(tcpPort, "TCP port"),
    db,
  });
}

try {
  await main();
} catch (error) {
  if (error instanceof Error && error.name === "AbortError") {
    process.exitCode = 130;
  } else {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
