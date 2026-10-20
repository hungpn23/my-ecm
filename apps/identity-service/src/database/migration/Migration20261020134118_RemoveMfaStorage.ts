import { Migration } from '@mikro-orm/migrations';

export class Migration20261020134118_RemoveMfaStorage extends Migration {

  override name = 'Migration20261020134118_RemoveMfaStorage';

  override up(): void | Promise<void> {
    this.addSql(`drop table if exists "mfa_failure" cascade;`);
    this.addSql(`drop table if exists "recovery_code" cascade;`);
    this.addSql(`drop table if exists "totp" cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`create table "mfa_failure" ("failed_at" timestamptz(6) not null, "id" serial primary key, "user_id" text not null);`);
    this.addSql(`create index "mfa_failure_failed_at_index" on "mfa_failure" ("failed_at");`);
    this.addSql(`create index "mfa_failure_user_id_failed_at_index" on "mfa_failure" ("user_id", "failed_at");`);

    this.addSql(`create table "recovery_code" ("code_hash" text not null, "user_id" text not null, primary key ("user_id", "code_hash"));`);

    this.addSql(`create table "totp" ("confirmed" boolean not null, "last_used_step" int null, "pending_secret" text null, "secret" text not null, "user_id" text not null, primary key ("user_id"));`);
  }

}
