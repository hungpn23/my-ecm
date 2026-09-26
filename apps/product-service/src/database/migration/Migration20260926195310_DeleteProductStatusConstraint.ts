import { Migration } from '@mikro-orm/migrations';

export class Migration20260926195310_DeleteProductStatusConstraint extends Migration {

  override name = 'Migration20260926195310_DeleteProductStatusConstraint';

  override up(): void | Promise<void> {
    this.addSql(`alter table "product" drop constraint "product_status_check";`);
    this.addSql(`alter table "product" alter column "status" type varchar(255) using ("status"::varchar(255));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "product" alter column "status" type text using ("status"::text);`);
    this.addSql(`alter table "product" add constraint "product_status_check" check ("status" in ('ACTIVE', 'INACTIVE'));`);
  }

}
