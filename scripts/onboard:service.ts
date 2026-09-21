import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

type OnboardOptions = {
  name: string;
  httpPort: number;
  auth: boolean;
  mikroOrm: boolean;
};

type ParseResult = { kind: "help" } | { kind: "options"; options: OnboardOptions };

const usage = `Usage:
  bun run onboard:service -- --name <name> --http-port <port> [options]

Required:
  --name <name>       Service name in kebab-case, without -service
  --http-port <port>  HTTP port

Options:
  --mikro-orm         Enable MikroORM without entities or migrations
  --no-auth           Omit JWT, Redis, and the global auth guard
  --help              Show this message`;

function parsePort(value: string, option: string): number {
  if (!/^\d+$/.test(value)) throw new Error(`${option} must be an integer.`);

  const port = Number(value);
  if (port < 1 || port > 65_535) throw new Error(`${option} must be between 1 and 65535.`);

  return port;
}

function parseArguments(arguments_: readonly string[]): ParseResult {
  let name: string | undefined;
  let httpPort: number | undefined;
  let auth = true;
  let mikroOrm = false;

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (!argument) continue;

    switch (argument) {
      case "--help":
        return { kind: "help" };
      case "--mikro-orm":
        mikroOrm = true;
        break;
      case "--no-auth":
        auth = false;
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
  if (httpPort === undefined) throw new Error("--http-port is required.");

  return {
    kind: "options",
    options: { name, httpPort, auth, mikroOrm },
  };
}

function toServiceTitle(name: string): string {
  return name
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function createPackageJson(options: OnboardOptions): string {
  const scripts = Object.fromEntries([
    ["build", "bun ../../scripts/build.ts"],
    ["check:types", "tsc"],
    ["dev", "bun --watch src/main.ts"],
    ...(options.mikroOrm
      ? [
          ["discovery:export", "bun -b mikro-orm discovery:export"],
          ["migration:down", "bun -b mikro-orm migration:down"],
          ["migration:up", "bun -b mikro-orm migration:up"],
        ]
      : []),
    ["start", "bun src/main.ts"],
  ]);
  const dependencies: [string, string][] = [
    ["@libs/common", "workspace:*"],
    ["@libs/core", "workspace:*"],
    ["@nestjs/common", "catalog:backend"],
    ["@nestjs/core", "catalog:backend"],
    ["@nestjs/microservices", "catalog:backend"],
    ["@nestjs/platform-express", "catalog:backend"],
    ["@nestjs/swagger", "catalog:backend"],
    ["nestjs-pino", "catalog:backend"],
    ["reflect-metadata", "catalog:backend"],
    ["rxjs", "catalog:backend"],
  ];

  if (options.mikroOrm) {
    dependencies.push(
      ["@mikro-orm/cli", "catalog:backend"],
      ["@mikro-orm/core", "catalog:backend"],
      ["@mikro-orm/migrations", "catalog:backend"],
      ["@mikro-orm/nestjs", "catalog:backend"],
      ["@mikro-orm/postgresql", "catalog:backend"],
      ["dotenv", "catalog:backend"],
    );
  }

  return `${JSON.stringify(
    {
      name: `@apps/${options.name}-service`,
      version: "0.0.0",
      private: true,
      type: "module",
      scripts,
      dependencies: Object.fromEntries(
        dependencies.sort(([left], [right]) => left.localeCompare(right)),
      ),
      devDependencies: {},
    },
    null,
    2,
  )}\n`;
}

function createTsConfig(options: OnboardOptions): string {
  return `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@src/*": ["./src/*"]${options.mikroOrm ? ',\n      "@mikro-orm/generated": ["./entities.generated.ts"]' : ""}
    }
  },
  "include": ["src/**/*.ts"]
}\n`;
}

function createMain(options: OnboardOptions): string {
  const serviceTitle = toServiceTitle(options.name);

  return `import { appConfig, KafkaService } from "@libs/core";
import { NestFactory } from "@nestjs/core";
import { type KafkaOptions } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, registerMicroserviceLogging } from "nestjs-pino";
import "reflect-metadata";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    routeConflictPolicy: { duplicate: "error", shadow: "error" },
  });

  app.enableShutdownHooks();

  const logger = app.get(Logger);
  app.useLogger(logger);

  const { APP_HOST, APP_PORT } = app.get(appConfig.KEY);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("${serviceTitle} Service API")
    .setVersion("1.0")
${options.auth ? "    .addBearerAuth()\n" : ""}    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, documentFactory);

  const ms = app.connectMicroservice<KafkaOptions>(
    app.get(KafkaService).options,
    { deferInitialization: true },
  );
  registerMicroserviceLogging(ms);

  await app.startAllMicroservices();
  await app.listen(APP_PORT, APP_HOST);

  logger.log(\`🔥 Swagger: http://\${APP_HOST}:\${APP_PORT}/swagger\`);
}

await bootstrap();
`;
}

function createAppModule(options: OnboardOptions): string {
  const coreImports = [
    ...(options.auth ? ["AuthModule"] : []),
    "ConfigModule",
    ...(options.mikroOrm ? ["DatabaseModule"] : []),
    ...(options.auth ? ["JwtGuard"] : []),
    "KafkaModule",
    "LoggerModule",
    ...(options.auth ? ["RedisModule"] : []),
  ];
  const imports = [
    "ConfigModule.forRoot()",
    ...(options.mikroOrm ? ["DatabaseModule.forRoot(entities)"] : []),
    "LoggerModule.forRoot()",
    "KafkaModule.forRoot()",
    ...(options.auth ? ["RedisModule.forRoot()", "AuthModule"] : []),
  ];
  const providers = [
    ...(options.auth
      ? [
          `{
      provide: APP_GUARD,
      useClass: JwtGuard,
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
    imports.length <= 3
      ? `imports: [${imports.join(", ")}],`
      : `imports: [\n    ${imports.join(",\n    ")},\n  ],`;

  return `import { ArktypeValidationPipe } from "@libs/common";
${coreImport}
${
  options.mikroOrm
    ? `import { entities } from "@mikro-orm/generated";
`
    : ""
}import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { ${options.auth ? "APP_GUARD, " : ""}APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

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

function createFiles(options: OnboardOptions): [string, string][] {
  const files: [string, string][] = [
    [
      ".env.example",
      `APP_NAME=${options.name}-service\nAPP_PORT=${options.httpPort}\n${options.mikroOrm ? `\nDB_DATABASE=${options.name}-service\n` : ""}`,
    ],
    ["package.json", createPackageJson(options)],
    ["tsconfig.json", createTsConfig(options)],
    ["src/main.ts", createMain(options)],
    ["src/app.module.ts", createAppModule(options)],
  ];

  if (options.mikroOrm) {
    files.push(["entities.generated.ts", createEntitiesGenerated()]);
    files.push(["mikro-orm.config.ts", createMikroOrmConfig()]);
  }

  return files;
}

async function createService(options: OnboardOptions): Promise<void> {
  const root = dirname(import.meta.dir);
  const serviceName = `${options.name}-service`;
  const serviceDirectory = join(root, "apps", serviceName);

  if (existsSync(serviceDirectory)) {
    throw new Error(`${serviceDirectory} already exists.`);
  }

  const files = createFiles(options);

  await mkdir(serviceDirectory, { recursive: true });
  await Promise.all(
    files.map(async ([relativePath, content]) => {
      const filePath = join(serviceDirectory, relativePath);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, content);
    }),
  );

  console.log(`Created apps/${serviceName}`);
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
