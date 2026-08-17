import { Migration } from "@mikro-orm/migrations";

export class Migration20260714094314 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "user" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password" varchar(255) not null, primary key ("id"));`,
    );
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }
}
