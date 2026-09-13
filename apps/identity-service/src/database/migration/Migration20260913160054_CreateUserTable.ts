import { Migration } from '@mikro-orm/migrations';

export class Migration20260913160054_CreateUserTable extends Migration {

  override name = 'Migration20260913160054_CreateUserTable';

  override up(): void | Promise<void> {
    this.addSql(`create table "user" ("id" uuid not null, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
