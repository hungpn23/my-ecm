import { Migration } from '@mikro-orm/migrations';

export class Migration20261109004413_RequireCheckoutExpiresAt extends Migration {

  override name = 'Migration20261109004413_RequireCheckoutExpiresAt';

  override up(): void | Promise<void> {
    this.addSql(`alter table "checkout" alter column "expires_at" set not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "checkout" alter column "expires_at" drop not null;`);
  }

}
