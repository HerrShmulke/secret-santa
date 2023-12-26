import { IMigration } from "./migration.interfaces";

export abstract class Migration implements IMigration {
  async migrate(): Promise<void> {
    const isExists = await this.isTableExists();

    if (isExists) {
      await this.createTable();
    }
  }

  protected abstract isTableExists(): Promise<boolean>;
  protected abstract createTable(): Promise<void>;
}
