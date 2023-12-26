export interface IMigration {
  migrate(): Promise<void>;
}
