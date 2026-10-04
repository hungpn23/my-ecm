import { Migration } from '@mikro-orm/migrations';

export class Migration20261004024918_UpdateUserTableAddRoleColumn extends Migration {

  override name = 'Migration20261004024918_UpdateUserTableAddRoleColumn';

  override up(): void | Promise<void> {
    this.addSql(`alter table "user" add "role" text not null;`);
    this.addSql(`alter table "user" add constraint "user_role_check" check ("role" in ('SYSTEM_ADMIN', 'USER'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_role_check";`);
    this.addSql(`alter table "user" drop column "role";`);
  }

}
