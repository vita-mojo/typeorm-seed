import { CustomSeed } from '../custom.seed';

export type SeedType<Seed extends CustomSeed> = { new (): Seed };
