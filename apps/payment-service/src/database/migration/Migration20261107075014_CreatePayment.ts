import { Migration } from '@mikro-orm/migrations';

export class Migration20261107075014_CreatePayment extends Migration {

  override name = 'Migration20261107075014_CreatePayment';

  override up(): void | Promise<void> {
    this.addSql(`create table "payment" ("id" uuid not null, "checkout_id" uuid not null, "amount" numeric(12,2) not null, "status" text not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`alter table "payment" add constraint "payment_amount_check" check (amount between 0 and 9999999999.99);`);
    this.addSql(`alter table "payment" add constraint "payment_status_check" check ("status" in ('INITIATED', 'SUCCEEDED', 'FAILED', 'EXPIRED'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "payment" cascade;`);
  }

}
