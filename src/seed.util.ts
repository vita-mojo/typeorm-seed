import { CustomSeed } from './custom.seed';
import { Commands, SeedType } from './types';

export const importSeeds = (files: string[]): Promise<any> => {
  return Promise.all(files.map(async file => {
    const imported = await import(file);

    return imported.default;
  }));
};

export const runMany = (command: Commands, ...seeds: SeedType<CustomSeed>[]): Promise<any> => {
  return seeds.reduce(async (acc, seed) => {
    await acc;
    await (new seed)[command]();
  }, Promise.resolve());
};

export const runManyUp = (...seeds: SeedType<CustomSeed>[]): Promise<any> => {
  return runMany(Commands.UP, ...seeds);
};

export const runManyDown = (...seeds: SeedType<CustomSeed>[]): Promise<any> => {
  return runMany(Commands.DOWN, ...seeds);
};
