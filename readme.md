# TypeORM Seed Utils

TypeORM Seed Utils is an opinionated library to write and run database seeds.

### Installing
Run ```npm install @vita-mojo/typeorm-seed```

### Running the CLI
```
node ./node_modules/.bin/typeorm-seed <command> <...files>
```

### CLI features:
* Execute one or multiple seed files ```up```
```
node ./node_modules/.bin/typeorm-seed up roles users
```

This will execute sequentially the files dist/data/seeds/roles.js and dist/data/seeds/users.js.
Base directory (dist/data/seeds) is not configurable at the moment.

* Revert one or multiple seed files ```down```
```
node ./node_modules/.bin/typeorm-seed down users roles
```
This command will revert seed files users.js and roles.js.

* Clear entire database ```clear```
```
node ./node_modules/.bin/typeorm-seed clear
```
Clear all data from all models registered in configured connection (ormconfig.json).

* Show help ```--help```
```
node ./node_modules/.bin/typeorm-seed --help
```

### Adding seed files
Seed files should be added at ```src/data/seeds/<seedFile>.ts```. Base path will be configurable in the future.

Examples of seed files will be added later.

### Additional functionality
#### Seed factory manager
Allows generating data and seeding it to database from the provided factories and models.

Code example:
```typescript
import * as faker from 'faker';
import { SeedFactoryManager } from 'typeorm-seed';
import { SampleModel, OtherModel } from 'data/models';

const createSampleModel = () => ({
  uuid: faker.random.uuid(),
  name: faker.name.firstName(),
});

const createOtherModel = () => ({
  uuid: faker.random.uuid(),
  name: faker.name.firstName(),
});

export const modelsFactories: SeedFactoryManager = new SeedFactoryManager()
  .register(SampleModel, createSampleModel)
  .register(OtherModel, createOtherModel);
```

Using model factories:
```typescript
modelsFactories.makeOne(SampleModel); // create a Sample object from random data (using faker factory)
modelsFactories.makeOne(SampleModel, data); // create a Sample object from provided (partial) data
modelsFactories.makeMany(SampleModel, data, 10); // create 10 Sample objects

await modelsFactories.seedOne(SampleModel); // create and save to database one Sample object
await modelsFactories.seedOne(SampleModel, data, 10); // create and save to database 10 Sample objects
await modelsFactories.seedAll(SampleModel, data); // create and save Sample objects from an array of partial entities
```

Providing custom connection to an instance of SeedFactoryManager:
```typescript
modelsFactories.setConnection(customConnection);
```

Clearing the database:
```typescript
import { clearEntities, clearDatabase } from 'typeorm-seed';

clearEntities([SampleModel, OtherModel]); // deletes data from specified entities

clearDatabase(customConnection); // deletes data from all entities registered connection (ormconfig.json)
```

### To do
* Configurable connection
