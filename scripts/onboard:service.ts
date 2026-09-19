import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

type OnboardOptions = {
  name: string;
  httpPort: number;
  tcpPort: number;
  auth: boolean;
  mikroOrm: boolean;
};

type ParseResult = { kind: "help" } | { kind: "options"; options: OnboardOptions };

const usage = `Usage:
  bun run onboard:service -- --name <name> --http-port <port> --tcp-port <port> [options]

Required:
  --name <name>       Service name in kebab-case, without -service
  --http-port <port>  HTTP port
  --tcp-port <port>   TCP port

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
  let tcpPort: number | undefined;
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
  if (httpPort === undefined) throw new Error("--http-port is required.");
  if (tcpPort === undefined) throw new Error("--tcp-port is required.");
  if (httpPort === tcpPort) throw new Error("--http-port and --tcp-port must differ.");

  return {
    kind: "options",
    options: { name, httpPort, tcpPort, auth, mikroOrm },
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
  const dependencies = [
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

  if (options.auth) {
    dependencies.push(["@nestjs/passport", "catalog:backend"]);
  }

  return `${JSON.stringify(
    {
      name: `@apps/${options.name}-service`,
      version: "0.0.0",
      private: true,
      type: "module",
      scripts,
      dependencies: Object.fromEntries(dependencies),
      devDependencies: {},
    },
    null,
    2,
  )}\n`;
}

function createTsConfig(options: OnboardOptions): string {
  return `${JSON.stringify(
    {
      $schema: "https://json.schemastore.org/tsconfig",
      extends: "../../tsconfig.json",
      compilerOptions: {
        paths: options.mikroOrm
          ? {
              "@src/*": ["./src/*"],
              "@mikro-orm/generated": ["./entities.generated.ts"],
            }
          : { "@src/*": ["./src/*"] },
      },
      include: ["src/**/*.ts"],
    },
    null,
    2,
  )}\n`;
}

function createMain(options: OnboardOptions): string {
  const serviceTitle = toServiceTitle(options.name);

  return `import { getAppConfig } from "@libs/core";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "nestjs-pino";
import "reflect-metadata";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    routeConflictPolicy: { duplicate: "error", shadow: "error" },
  });

  const logger = app.get(Logger);
  app.useLogger(logger);

  const { APP_HOST, APP_PORT, APP_PORT_TCP } = getAppConfig();

  const swaggerConfig = new DocumentBuilder()
    .setTitle("${serviceTitle} Service API")
    .setVersion("1.0")
${options.auth ? "    .addBearerAuth()\n" : ""}    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, documentFactory);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: APP_HOST, port: APP_PORT_TCP },
  });

  await app.startAllMicroservices();
  await app.listen(APP_PORT, APP_HOST);

  logger.log(\`Swagger: http://\${APP_HOST}:\${APP_PORT}/swagger\`);
  logger.log(\`TCP: \${APP_HOST}:\${APP_PORT_TCP}\`);
}

await bootstrap();
`;
}

function createAppModule(options: OnboardOptions): string {
  const coreImports = [
    ...(options.mikroOrm ? ["databaseConfig"] : []),
    "GlobalConfigModule",
    ...(options.mikroOrm ? ["GlobalMikroOrmModule"] : []),
    ...(options.auth ? ["jwtConfig", "JwtGuard", "redisConfig", "RedisModule"] : []),
  ];
  const configLoads = [
    ...(options.auth ? ["jwtConfig", "redisConfig"] : []),
    ...(options.mikroOrm ? ["databaseConfig"] : []),
  ];
  const configModule =
    configLoads.length === 0
      ? "GlobalConfigModule.forRoot()"
      : `GlobalConfigModule.forRoot({\n      load: [${configLoads.join(", ")}],\n    })`;
  const imports = [
    configModule,
    ...(options.mikroOrm ? ["GlobalMikroOrmModule.forRoot(entities)"] : []),
    "GlobalLoggerModule.forRoot()",
    ...(options.auth ? ["RedisModule", "AuthModule"] : []),
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

  return `import { GlobalLoggerModule, ArktypeValidationPipe } from "@libs/common";
import {
  ${coreImports.join(",\n  ")},
} from "@libs/core";
${
  options.mikroOrm
    ? `import { entities } from "@mikro-orm/generated";
`
    : ""
}import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { ${options.auth ? "APP_GUARD, " : ""}APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
${options.auth ? 'import { AuthModule } from "./module/auth/auth.module";\n' : ""}
@Module({
  imports: [
    ${imports.join(",\n    ")},
  ],
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
      `APP_PORT=${options.httpPort}\nAPP_PORT_TCP=${options.tcpPort}\n${options.mikroOrm ? `\nDB_DATABASE=${options.name}-service\n` : ""}`,
    ],
    ["package.json", createPackageJson(options)],
    ["tsconfig.json", createTsConfig(options)],
    ["src/main.ts", createMain(options)],
    ["src/app.module.ts", createAppModule(options)],
  ];

  if (options.auth) {
    files.push([
      "src/module/auth/auth.module.ts",
      `import { JwtStrategy } from "@libs/core";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [PassportModule.register({})],
  providers: [JwtStrategy],
})
export class AuthModule {}
`,
    ]);
  }

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
