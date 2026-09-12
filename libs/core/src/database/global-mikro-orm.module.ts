import { MikroOrmModule, type MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import { EntitySchema, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import type { DynamicModule } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { databaseConfig, type DatabaseConfig } from "./database.config";

export class GlobalMikroOrmModule {
  static forRoot(entities: readonly EntitySchema[]): DynamicModule {
    return {
      module: GlobalMikroOrmModule,
      imports: [
        MikroOrmModule.forRootAsync({
          inject: [databaseConfig.KEY, PinoLogger],
          driver: PostgreSqlDriver,
          useFactory: (config: DatabaseConfig, logger: PinoLogger) => {
            let ormOptions: MikroOrmModuleOptions = {
              ...config,
              entities,
            };

            if (config.debug) {
              logger.setContext(GlobalMikroOrmModule.name);

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
