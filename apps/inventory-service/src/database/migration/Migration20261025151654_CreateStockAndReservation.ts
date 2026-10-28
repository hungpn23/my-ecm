import { Migration } from '@mikro-orm/migrations';

export class Migration20261025151654_CreateStockAndReservation extends Migration {

  override name = 'Migration20261025151654_CreateStockAndReservation';

  override up(): void | Promise<void> {
    this.addSql(`create table "stock" ("id" uuid not null, "product_id" uuid not null, "shop_id" uuid not null, "on_hand" int not null, "reserved" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "stock" add constraint "stock_product_id_unique" unique ("product_id");`);

    this.addSql(`create table "reservation" ("id" uuid not null, "checkout_id" uuid not null, "stock_id" uuid not null, "quantity" int not null, "status" text not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "reservation" add constraint "reservation_checkout_id_unique" unique ("checkout_id");`);

    this.addSql(`alter table "stock" add constraint "stock_on_hand_check" check (on_hand >= 0);`);
    this.addSql(`alter table "stock" add constraint "stock_reserved_check" check (reserved >= 0 and reserved <= on_hand);`);

    this.addSql(`alter table "reservation" add constraint "reservation_stock_id_foreign" foreign key ("stock_id") references "stock" ("id");`);
    this.addSql(`alter table "reservation" add constraint "reservation_quantity_check" check (quantity > 0);`);
    this.addSql(`alter table "reservation" add constraint "reservation_status_check" check ("status" in ('HELD', 'COMMITTED', 'EXPIRED'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "reservation" drop constraint "reservation_stock_id_foreign";`);

    this.addSql(`drop table if exists "stock" cascade;`);
    this.addSql(`drop table if exists "reservation" cascade;`);
  }

}
