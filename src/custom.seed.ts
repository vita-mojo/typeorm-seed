export interface CustomSeed {
  up(...data: any[]): Promise<any>;

  down(...data: any[]): Promise<any>;
}
