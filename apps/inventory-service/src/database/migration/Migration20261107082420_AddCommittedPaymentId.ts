import { Migration } from '@mikro-orm/migrations';

export class Migration20261107082420_AddCommittedPaymentId extends Migration {

  override name = 'Migration20261107082420_AddCommittedPaymentId';

  override up(): void | Promise<void> {
    this.addSql(`alter table "reservation" add "committed_payment_id" uuid null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "reservation" drop column "committed_payment_id";`);
  }

}
