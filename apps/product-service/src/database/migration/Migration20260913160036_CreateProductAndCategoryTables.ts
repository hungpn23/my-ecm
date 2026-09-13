import { Migration } from '@mikro-orm/migrations';

export class Migration20260913160036_CreateProductAndCategoryTables extends Migration {

  override name = 'Migration20260913160036_CreateProductAndCategoryTables';

  override up(): void | Promise<void> {
    this.addSql(`create table "category" ("id" uuid not null, "name" varchar(255) not null, "code" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "category" add constraint "category_code_unique" unique ("code");`);

    this.addSql(`create table "product" ("id" uuid not null, "name" varchar(255) not null, "description" text null, "price" numeric(12,2) not null, "status" text not null, "category_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`alter table "product" add constraint "product_category_id_foreign" foreign key ("category_id") references "category" ("id");`);
    this.addSql(`alter table "product" add constraint "product_status_check" check ("status" in ('active', 'inactive'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "product" drop constraint "product_category_id_foreign";`);

    this.addSql(`drop table if exists "category" cascade;`);
    this.addSql(`drop table if exists "product" cascade;`);
  }

}
