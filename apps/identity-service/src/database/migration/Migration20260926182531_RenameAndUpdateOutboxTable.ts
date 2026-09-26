import { Migration } from '@mikro-orm/migrations';

export class Migration20260926182531_RenameAndUpdateOutboxTable extends Migration {

  override name = 'Migration20260926182531_RenameAndUpdateOutboxTable';

  override up(): void | Promise<void> {
    this.addSql(`create table "outbox" ("id" uuid not null, "aggregate_type" varchar(255) not null, "aggregate_id" varchar(255) not null, "event_type" varchar(255) not null, "payload" jsonb not null, "request_id" uuid not null, "created_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`drop table if exists "outbox_event" cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`create table "outbox_event" ("aggregate_id" varchar(255) not null, "aggregate_type" varchar(255) not null, "created_at" timestamptz(6) not null, "event_type" varchar(255) not null, "id" uuid not null, "metadata" jsonb not null default '{}', "payload" jsonb not null, primary key ("id"));`);

    this.addSql(`drop table if exists "outbox" cascade;`);
  }

}
