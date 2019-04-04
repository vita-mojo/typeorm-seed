import { Connection, getConnection, EntityManager, EntityMetadata } from 'typeorm';
import { EntityType } from './types';

const getEntityMetadata = (target: string | EntityType<any>, connection: Connection): EntityMetadata => {
  const targetName = typeof target === 'string' ? target : target.name;

  return connection.entityMetadatas.find((metadata: EntityMetadata) => metadata.name === targetName);
};

export const clearEntities = async (
  targets: (string | EntityType<any>)[],
  connection: Connection = getConnection(),
): Promise<void> => {
  await connection.transaction(async (entityManager: EntityManager) => {
    await entityManager.query('set FOREIGN_KEY_CHECKS = 0');

    await targets.reduce(async (acc: Promise<void>, target: EntityType<any>) => {
      const tableName = getEntityMetadata(target, connection).tableName;

      await acc;
      await entityManager.query(`truncate ${tableName}`);
    }, Promise.resolve());

    await entityManager.query('set FOREIGN_KEY_CHECKS = 1');
  });
};

export const clearDatabase = async (connection: Connection = getConnection()): Promise<void> => {
  const entities = connection.entityMetadatas.map((metadata: EntityMetadata) => metadata.name);

  await clearEntities(entities, connection);
};
