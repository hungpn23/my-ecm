import { Migration } from '@mikro-orm/migrations';

export class Migration20261025145527_AddAddress extends Migration {

  override name = 'Migration20261025145527_AddAddress';

  override up(): void | Promise<void> {
    this.addSql(`create table "address" ("id" uuid not null, "user_id" uuid not null, "recipient_name" varchar(255) not null, "phone" varchar(255) not null, "address" text not null, "is_default" boolean not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`alter table "address" add constraint "address_user_id_foreign" foreign key ("user_id") references "user" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "address" cascade;`);
  }

}
