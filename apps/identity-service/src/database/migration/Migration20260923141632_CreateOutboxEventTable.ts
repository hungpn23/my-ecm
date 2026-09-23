import { Migration } from '@mikro-orm/migrations';

export class Migration20260923141632_CreateOutboxEventTable extends Migration {

  override name = 'Migration20260923141632_CreateOutboxEventTable';

  override up(): void | Promise<void> {
    this.addSql(`create table "outbox_event" ("id" uuid not null, "aggregate_type" varchar(255) not null, "aggregate_id" varchar(255) not null, "event_type" varchar(255) not null, "payload" jsonb not null, "metadata" jsonb not null default '{}', "created_at" timestamptz not null, primary key ("id"));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "outbox_event" cascade;`);
  }

}
