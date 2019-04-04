import * as parseArgs from 'minimist';
import { createConnection, EntityManager, getConnectionManager } from 'typeorm';
import { Commands as allowedCommands } from '../types';
import { clearDatabase, importSeeds, runMany, SeedFactoryManager } from '..';

const defaultSeedPath = 'dist/data/seeds';
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  process.stdout.write(
    `Usage:
  node seed ${allowedCommands.UP} <file|files>      execute one or more seed files
  node seed ${allowedCommands.DOWN} <file|files>    rollback one or more seed files
  node seed ${allowedCommands.CLEAR}                clear database
  
Options:
  --help                         show help
  --dir                          location of seed files (default: ${defaultSeedPath})

Example running storeSeed.js from default location (dist/data/seed):
  node seed ${allowedCommands.UP} storeSeed
  
Example running storeSeed.js from custom directory:
  node seed ${allowedCommands.UP} storeSeed --dir custom/path/to/seeds
`
  );
  process.exit(0);
}

const [ command, ...files ] = args._;

if (!Object.values(allowedCommands).includes(command)) {
  process.stdout.write('Wrong usage, use --help for more information\n');
  process.exit(1);
}

if ((command === allowedCommands.UP || command === allowedCommands.DOWN) && !files.length) {
  process.stdout.write('Path to seed file was not specified, use --help for more information\n');
  process.exit(1);
}

const seedPath = 'dir' in args ? args.dir : defaultSeedPath;
const seedFiles = files.map(filename => `${process.cwd()}/${seedPath}/${filename}`);

(async () => {
  try {
    const connection = await createConnection();

    switch (command) {
      case allowedCommands.CLEAR:
        await clearDatabase(connection);
        break;

      case allowedCommands.UP:
      case allowedCommands.DOWN:
        await connection.transaction(async (manager: EntityManager) => {
          SeedFactoryManager.setManager(manager);
          const seedClasses = await importSeeds(seedFiles);
          await runMany(command, ...seedClasses);
        });
    }
  } catch (e) {
    console.error(e);
  } finally {
    await getConnectionManager().connections.reduce(async (acc, conn) => {
      await acc;

      if (conn && conn.isConnected) {
        await conn.close();
      }
    }, Promise.resolve());
  }
})();
