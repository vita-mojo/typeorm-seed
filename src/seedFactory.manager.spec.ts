import * as faker from 'faker';
import { EntityManager } from 'typeorm';
import { SeedFactoryManager } from '.';

describe('Seed Factory Manager', () => {
  const entity = class {};
  const factory = jest.fn();
  const entityManager = {} as EntityManager;
  entityManager.save = jest.fn();

  let seedFactoryManager: SeedFactoryManager;

  beforeEach(() => {
    jest.clearAllMocks();

    seedFactoryManager = new SeedFactoryManager();
    seedFactoryManager.register(entity, factory);
  });

  it('should find the factory for registered entity', () => {
    expect(seedFactoryManager.getFactory(entity)).toBe(factory);
  });

  it('should not find a factory for unregistered entity', () => {
    const unregistered = class {};

    expect(() => {
      seedFactoryManager.getFactory(unregistered);
    }).toThrow();
  });

  it('should make one item', () => {
    jest.spyOn(seedFactoryManager, 'getFactory');
    seedFactoryManager.makeOne(entity);
    expect(seedFactoryManager.getFactory).toBeCalledWith(entity);
  });

  it('should make multiple items', () => {
    const times = faker.random.number({ min: 1, max: 10});
    const data = {};

    jest.spyOn(seedFactoryManager, 'makeOne');
    seedFactoryManager.makeMany(entity, data, times);
    expect(seedFactoryManager.makeOne).nthCalledWith(times, entity, data);
  });

  it('should seed one item', async () => {
    const data = {};
    const returned = {};

    jest.spyOn(SeedFactoryManager, 'getManager').mockReturnValue(entityManager);
    jest.spyOn(seedFactoryManager, 'makeOne').mockReturnValue(returned);

    await seedFactoryManager.seedOne(entity, data);

    expect(SeedFactoryManager.getManager).toBeCalled();
    expect(seedFactoryManager.makeOne).toBeCalledWith(entity, data);
    expect(entityManager.save).toBeCalledWith(entity.name, returned);
  });

  it('should seed many items', async () => {
    const times = faker.random.number({ min: 1, max: 10});
    const data = {};
    const returned = [];

    jest.spyOn(SeedFactoryManager, 'getManager').mockReturnValue(entityManager);
    jest.spyOn(seedFactoryManager, 'makeMany').mockReturnValue(returned);

    await seedFactoryManager.seedMany(entity, data, times);

    expect(SeedFactoryManager.getManager).toBeCalled();
    expect(seedFactoryManager.makeMany).toBeCalledWith(entity, data, times);
    expect(entityManager.save).toBeCalledWith(entity.name, returned);
  });

  it('should seed all items from the provided array', async () => {
    const item1 = {};
    const item2 = {};

    jest.spyOn(SeedFactoryManager, 'getManager').mockReturnValue(entityManager);
    jest.spyOn(seedFactoryManager, 'makeOne');

    await seedFactoryManager.seedAll(entity, [item1, item2]);

    expect(SeedFactoryManager.getManager).toBeCalled();
    expect(seedFactoryManager.makeOne).toBeCalledWith(entity, item1);
    expect(seedFactoryManager.makeOne).toBeCalledWith(entity, item2);
    expect(entityManager.save).toBeCalled();
  });
});
