import { ObjectLiteral } from 'typeorm';

export type EntityType<Entity extends ObjectLiteral> = { new (): Entity };
