import { Connection, DeepPartial, EntityManager, getConnection, ObjectLiteral } from 'typeorm';
import { EntityType } from './types';

export class SeedFactoryManager {
  private static manager: EntityManager;
  private connection: Connection;
  private factories: ObjectLiteral = {};

  // @deprecated use getManager instead
  getConnection(): Connection {
    if (!this.connection) {
      this.setConnection(getConnection());
    }

    return this.connection;
  }

  // @deprecated use setManager instead
  setConnection(connection: Connection): SeedFactoryManager {
    this.connection = connection;

    return this;
  }

  static getManager() {
    if (!SeedFactoryManager.manager) {
      SeedFactoryManager.setManager(getConnection().manager);
    }

    return SeedFactoryManager.manager;
  }

  static setManager(manager: EntityManager) {
    SeedFactoryManager.manager = manager;
  }

  register<Entity extends ObjectLiteral>(entity: EntityType<Entity>, factory: () => DeepPartial<Entity>): SeedFactoryManager {
    this.factories[entity.name] = factory;

    return this;
  };

  getFactory<Entity>(entity: EntityType<Entity>): () => DeepPartial<Entity> {
    if (!(entity.name in this.factories)) {
      throw `Factory not found for ${entity.name}`;
    }

    return this.factories[entity.name];
  }

  makeOne<Entity>(entity: EntityType<Entity>, data: Partial<Entity> = {}): Entity {
    const target = new entity();
    const generated = this.getFactory(entity)();

    return Object.assign(target, generated, data);
  }

  makeMany<Entity>(entity: EntityType<Entity>, data: Partial<Entity> = {}, length: number = 10): Entity[] {
    return Array(length).fill(null).map(() => this.makeOne(entity, data));
  }

  seedOne<Entity>(entity: EntityType<Entity>, data: Partial<Entity> = {}): Promise<Entity> {
    return SeedFactoryManager.getManager().save(entity.name, this.makeOne(entity, data));
  }

  seedMany<Entity>(entity: EntityType<Entity>, data: Partial<Entity> = {}, length: number = 10): Promise<Entity[]> {
    return SeedFactoryManager.getManager().save(entity.name, this.makeMany(entity, data, length));
  }

  seedAll<Entity>(entity: EntityType<Entity>, items: Partial<Entity>[] = []): Promise<Entity[]> {
    const data = items.map(item => this.makeOne(entity, item));

    return SeedFactoryManager.getManager().save(entity.name, data);
  }
}
