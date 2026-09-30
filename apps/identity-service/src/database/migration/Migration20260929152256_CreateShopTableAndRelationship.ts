import { Migration } from '@mikro-orm/migrations';

export class Migration20260929152256_CreateShopTableAndRelationship extends Migration {

  override name = 'Migration20260929152256_CreateShopTableAndRelationship';

  override up(): void | Promise<void> {
    this.addSql(`create table "shop" ("id" uuid not null, "name" varchar(255) not null, "description" text null, "owner_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "shop" add constraint "shop_owner_id_unique" unique ("owner_id");`);

    this.addSql(`alter table "user" add "shop_role" text null, add "shop_id" uuid null;`);
    this.addSql(`alter table "user" add constraint "user_shop_id_foreign" foreign key ("shop_id") references "shop" ("id") on delete set null;`);
    this.addSql(`alter table "user" add constraint "user_shop_role_check" check ("shop_role" in ('OWNER', 'ADMIN', 'STAFF'));`);

    this.addSql(`alter table "shop" add constraint "shop_owner_id_foreign" foreign key ("owner_id") references "user" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_shop_id_foreign";`);

    this.addSql(`drop table if exists "shop" cascade;`);

    this.addSql(`alter table "user" drop constraint "user_shop_role_check";`);
    this.addSql(`alter table "user" drop column "shop_role", drop column "shop_id";`);
  }

}
