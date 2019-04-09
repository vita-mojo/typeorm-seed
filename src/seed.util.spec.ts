import { CustomSeed, runManyDown, runManyUp } from '.';
import * as seedUtil from './seed.util';
import { Commands, SeedType } from './types';

describe('Seed Util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute many seed files', async () => {
    const up1 = jest.fn();
    const up2 = jest.fn();

    const seed1 = jest.fn(() => ({ up: up1, down: jest.fn() }));
    const seed2 = jest.fn(() => ({ up: up2, down: jest.fn() }));

    jest.spyOn(seedUtil, 'runMany');

    await runManyUp(seed1, seed2);

    expect(seedUtil.runMany).toBeCalledWith(Commands.UP, seed1, seed2);
    expect(seed1).toBeCalled();
    expect(up1).toBeCalled();
    expect(seed2).toBeCalled();
    expect(up2).toBeCalled();
  });

  it('should revert many seed files', async () => {
    const down1 = jest.fn();
    const down2 = jest.fn();

    const seed1 = jest.fn(() => ({ up: jest.fn(), down: down1 }));
    const seed2 = jest.fn(() => ({ up: jest.fn(), down: down2 }));

    jest.spyOn(seedUtil, 'runMany');

    await runManyDown(seed1, seed2);

    expect(seedUtil.runMany).toBeCalledWith(Commands.DOWN, seed1, seed2);
    expect(seed1).toBeCalled();
    expect(down1).toBeCalled();
    expect(seed2).toBeCalled();
    expect(down2).toBeCalled();
  });
});
