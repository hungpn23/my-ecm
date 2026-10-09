import { Migration } from '@mikro-orm/migrations';

export class Migration20261009032011_RemoveAuthTablePrefix extends Migration {

  override name = 'Migration20261009032011_RemoveAuthTablePrefix';

  override up(): void | Promise<void> {
    this.addSql(`alter table "auth_mfa_failure" rename to "mfa_failure";`);
    this.addSql(`alter table "mfa_failure" rename constraint "auth_mfa_failure_pkey" to "mfa_failure_pkey";`);
    this.addSql(`alter index "auth_mfa_failure_failed_at_index" rename to "mfa_failure_failed_at_index";`);
    this.addSql(`alter index "auth_mfa_failure_user_id_failed_at_index" rename to "mfa_failure_user_id_failed_at_index";`);
    this.addSql(`alter sequence "auth_mfa_failure_id_seq" rename to "mfa_failure_id_seq";`);

    this.addSql(`alter table "auth_recovery_code" rename to "recovery_code";`);
    this.addSql(`alter table "recovery_code" rename constraint "auth_recovery_code_pkey" to "recovery_code_pkey";`);

    this.addSql(`alter table "auth_refresh_token" rename to "refresh_token";`);
    this.addSql(`alter table "refresh_token" rename constraint "auth_refresh_token_pkey" to "refresh_token_pkey";`);
    this.addSql(`alter index "auth_refresh_token_family_id_index" rename to "refresh_token_family_id_index";`);
    this.addSql(`alter index "auth_refresh_token_user_id_index" rename to "refresh_token_user_id_index";`);
    this.addSql(`alter index "auth_refresh_token_family_expires_at_index" rename to "refresh_token_family_expires_at_index";`);

    this.addSql(`alter table "auth_totp" rename to "totp";`);
    this.addSql(`alter table "totp" rename constraint "auth_totp_pkey" to "totp_pkey";`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "totp" rename constraint "totp_pkey" to "auth_totp_pkey";`);
    this.addSql(`alter table "totp" rename to "auth_totp";`);

    this.addSql(`alter index "refresh_token_family_expires_at_index" rename to "auth_refresh_token_family_expires_at_index";`);
    this.addSql(`alter index "refresh_token_user_id_index" rename to "auth_refresh_token_user_id_index";`);
    this.addSql(`alter index "refresh_token_family_id_index" rename to "auth_refresh_token_family_id_index";`);
    this.addSql(`alter table "refresh_token" rename constraint "refresh_token_pkey" to "auth_refresh_token_pkey";`);
    this.addSql(`alter table "refresh_token" rename to "auth_refresh_token";`);

    this.addSql(`alter table "recovery_code" rename constraint "recovery_code_pkey" to "auth_recovery_code_pkey";`);
    this.addSql(`alter table "recovery_code" rename to "auth_recovery_code";`);

    this.addSql(`alter sequence "mfa_failure_id_seq" rename to "auth_mfa_failure_id_seq";`);
    this.addSql(`alter index "mfa_failure_user_id_failed_at_index" rename to "auth_mfa_failure_user_id_failed_at_index";`);
    this.addSql(`alter index "mfa_failure_failed_at_index" rename to "auth_mfa_failure_failed_at_index";`);
    this.addSql(`alter table "mfa_failure" rename constraint "mfa_failure_pkey" to "auth_mfa_failure_pkey";`);
    this.addSql(`alter table "mfa_failure" rename to "auth_mfa_failure";`);
  }

}
