import { Migration } from '@mikro-orm/migrations';

export class Migration20261007040836_CreateAuthenticationStorage extends Migration {

  override name = 'Migration20261007040836_CreateAuthenticationStorage';

  override up(): void | Promise<void> {
    this.addSql(`create table "auth_mfa_failure" ("id" serial primary key, "user_id" text not null, "failed_at" timestamptz not null);`);
    this.addSql(`create index "auth_mfa_failure_failed_at_index" on "auth_mfa_failure" ("failed_at");`);
    this.addSql(`create index "auth_mfa_failure_user_id_failed_at_index" on "auth_mfa_failure" ("user_id", "failed_at");`);

    this.addSql(`create table "auth_recovery_code" ("user_id" text not null, "code_hash" text not null, primary key ("user_id", "code_hash"));`);

    this.addSql(`create table "auth_refresh_token" ("id" text not null, "family_id" text not null, "user_id" text not null, "created_at" timestamptz not null, "expires_at" timestamptz not null, "family_expires_at" timestamptz not null, "used_at" timestamptz null, "claims" jsonb null, "revoked" boolean not null default false, primary key ("id"));`);
    this.addSql(`create index "auth_refresh_token_family_id_index" on "auth_refresh_token" ("family_id");`);
    this.addSql(`create index "auth_refresh_token_user_id_index" on "auth_refresh_token" ("user_id");`);
    this.addSql(`create index "auth_refresh_token_family_expires_at_index" on "auth_refresh_token" ("family_expires_at");`);

    this.addSql(`create table "auth_totp" ("user_id" text not null, "secret" text not null, "confirmed" boolean not null, "pending_secret" text null, "last_used_step" int null, primary key ("user_id"));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "auth_mfa_failure" cascade;`);
    this.addSql(`drop table if exists "auth_recovery_code" cascade;`);
    this.addSql(`drop table if exists "auth_refresh_token" cascade;`);
    this.addSql(`drop table if exists "auth_totp" cascade;`);
  }

}
