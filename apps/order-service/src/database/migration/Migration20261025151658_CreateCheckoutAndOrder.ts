import { Migration } from '@mikro-orm/migrations';

export class Migration20261025151658_CreateCheckoutAndOrder extends Migration {

  override name = 'Migration20261025151658_CreateCheckoutAndOrder';

  override up(): void | Promise<void> {
    this.addSql(`create table "checkout" ("id" uuid not null, "user_id" uuid not null, "shop_id" uuid not null, "product_id" uuid not null, "product_name" varchar(255) not null, "unit_price" numeric(12,2) not null, "quantity" int not null, "shipping_fee" numeric(12,2) not null, "total" numeric(12,2) not null, "recipient_name" varchar(255) not null, "phone" varchar(255) not null, "shipping_address" text not null, "payment_method" text not null, "status" text not null, "expires_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`create table "order" ("id" uuid not null, "checkout_id" uuid not null, "status" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "order" add constraint "order_checkout_id_unique" unique ("checkout_id");`);

    this.addSql(`alter table "checkout" add constraint "checkout_quantity_check" check (quantity > 0);`);
    this.addSql(`alter table "checkout" add constraint "checkout_unit_price_check" check (unit_price between 0 and 9999999999.99);`);
    this.addSql(`alter table "checkout" add constraint "checkout_shipping_fee_check" check (shipping_fee between 0 and 9999999999.99);`);
    this.addSql(`alter table "checkout" add constraint "checkout_total_check" check (total between 0 and 9999999999.99);`);
    this.addSql(`alter table "checkout" add constraint "checkout_payment_method_check" check ("payment_method" in ('ONLINE'));`);
    this.addSql(`alter table "checkout" add constraint "checkout_status_check" check ("status" in ('OPEN', 'PAYMENT_PENDING', 'ORDER_CREATED', 'EXPIRED'));`);

    this.addSql(`alter table "order" add constraint "order_checkout_id_foreign" foreign key ("checkout_id") references "checkout" ("id") on delete no action;`);
    this.addSql(`alter table "order" add constraint "order_status_check" check ("status" in ('READY_TO_SHIP', 'PROCESSED', 'SHIPPED', 'TO_CONFIRM_RECEIVE', 'COMPLETED'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "order" drop constraint "order_checkout_id_foreign";`);

    this.addSql(`drop table if exists "checkout" cascade;`);
    this.addSql(`drop table if exists "order" cascade;`);
  }

}
