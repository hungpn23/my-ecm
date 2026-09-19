import { MikroOrmModule, type MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import { EntitySchema, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { type DynamicModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";
import { databaseConfig, type DatabaseConfig } from "./database.config";

export class DatabaseModule {
  static forRoot(entities: readonly EntitySchema[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MikroOrmModule.forRootAsync({
          imports: [ConfigModule.forFeature(databaseConfig)],
          inject: [databaseConfig.KEY, PinoLogger],
          driver: PostgreSqlDriver,
          useFactory: (config: DatabaseConfig, logger: PinoLogger) => {
            let ormOptions: MikroOrmModuleOptions = {
              ...config,
              entities,
            };

            if (config.debug) {
              logger.setContext(DatabaseModule.name);

              ormOptions = {
                ...ormOptions,
                logger: (msg) => logger.debug(msg),
                highlighter: new SqlHighlighter(),
              };
            }

            return ormOptions;
          },
        }),
      ],
    };
  }
}
