import { Migration } from '@mikro-orm/migrations';

export class Migration20260929152443_UpdateProductTableAddShopId extends Migration {

  override name = 'Migration20260929152443_UpdateProductTableAddShopId';

  override up(): void | Promise<void> {
    this.addSql(`alter table "product" add "shop_id" uuid not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "product" drop column "shop_id";`);
  }

}
