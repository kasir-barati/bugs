import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  Collection,
  Connection,
  IndexDefinition,
  IndexOptions,
} from 'mongoose';
import { isDeepStrictEqual } from 'util';

import { sleep } from '../../utils';
import { CurrentOperation } from '../interfaces';

@Injectable()
export class IndexService implements OnApplicationBootstrap {
  private readonly logger = new Logger(IndexService.name);

  constructor(private readonly connection: Connection) {}

  async onApplicationBootstrap() {
    await this.createIndexes();
  }

  private async createIndexes() {
    const models = this.connection.modelNames();

    this.logger.log('Creating indexes for models: ' + models.join(', '));

    for (const modelName of models) {
      const model = this.connection.model(modelName);

      try {
        // This step is necessary. If this app is connected to a new database it needs to create the collections first.
        const collection = await model.createCollection();
        const adminDb = this.connection.db?.admin();
        const existingIndexes = await model.collection.indexes();
        const definedIndexes = model.schema.indexes();

        for (const definedIndex of definedIndexes) {
          const alreadyExistingIndex = existingIndexes.find((existingIndex) => {
            return existingIndex.name === definedIndex[1].name;
          });

          if (alreadyExistingIndex) {
            this.isIndexSchemaInSync(
              modelName,
              alreadyExistingIndex,
              definedIndex,
            );
            continue;
          }

          if (!adminDb) {
            throw new Error('Did not found an admin database');
          }

          await this.waitForPendingIndexOperations(
            adminDb,
            modelName,
            collection.collectionName,
          );

          const [indexSpecification, indexOptions] = definedIndex;
          const indexName = indexOptions.name;

          this.logger.log(
            `⏳ Creating ${JSON.stringify(indexOptions)} index for ${modelName} where the index name is ${indexName}`,
          );

          // @ts-expect-error This is OK
          await model.collection.createIndex(indexSpecification, indexOptions);

          this.logger.log(
            `✅ ${indexName} index has been created for ${modelName}`,
          );
        }

        this.logger.log(`✅ Indexes created for: ${modelName}`);

        this.findOrphanedIndexes(modelName, existingIndexes, definedIndexes);
      } catch (err) {
        this.logger.error(
          `❌ Index error for ${modelName}: ${JSON.stringify(err)}`,
        );
      }
    }
  }

  private isIndexSchemaInSync(
    modelName: string,
    existingIndex: Awaited<ReturnType<Collection['indexes']>>[number],
    definedIndex: [IndexDefinition, IndexOptions],
  ) {
    const definedIndexOptions = definedIndex[1];
    /**
     * @description key, version, and namespace comes from DB and are irrelevant in the context of mongoose:
     *
     * - Key is the fields which are indexed.
     * - Namespace is the database name & collection name concatenated together with a dot ("my_db_name.users")
     */
    const {
      v: _version,
      key: _key,
      ns: _namespace,
      ...restOfExistingIndex
    } = existingIndex;

    if (!isDeepStrictEqual(definedIndexOptions, restOfExistingIndex)) {
      this.logger.warn(
        `⚠️ ${modelName}'s defined index in code does not match the index options in the database (Defined index: ${JSON.stringify(definedIndexOptions)}, existing index: ${JSON.stringify(restOfExistingIndex)})`,
      );
      return false;
    }

    return true;
  }

  private findOrphanedIndexes(
    modelName: string,
    existingIndexes: Awaited<ReturnType<Collection['indexes']>>,
    definedIndexes: [IndexDefinition, IndexOptions][],
  ) {
    const definedIndexesNames = definedIndexes
      .map(([_, options]) => options.name)
      .filter(Boolean) as string[];
    const extraIndexes = existingIndexes
      .filter(
        (existingIndex) =>
          existingIndex.name &&
          !definedIndexesNames.includes(existingIndex.name),
      )
      .filter((extraIndex) => extraIndex.name !== '_id_');

    if (extraIndexes.length > 0) {
      const extraIndexesNames = extraIndexes
        .map((extraIndex) => extraIndex.name)
        .filter(Boolean);

      this.logger.log(
        `ℹ️ Extra indexes in DB for ${modelName}: ${extraIndexesNames.join(', ')}`,
      );

      return extraIndexes;
    }
  }

  /** @description `timeoutInSeconds` cannot be too high, otherwise it's possible to fail the health check script. */
  private async waitForPendingIndexOperations(
    adminDb: ReturnType<NonNullable<Connection['db']>['admin']>,
    modelName: string,
    collectionName: string,
    timeoutInSeconds = 30,
  ) {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const startTime = Date.now();
    const timeoutMs = timeoutInSeconds * 1000;

    while (Date.now() - startTime < timeoutMs) {
      const currentOps: CurrentOperation = await adminDb.command({
        currentOp: 1,
        $or: [
          { 'command.createIndexes': collectionName },
          { op: 'command', 'command.createIndexes': collectionName },
        ],
      });

      // If no index operations are running, return
      if (!currentOps.inprog || currentOps.inprog.length === 0) {
        return;
      }

      const activeOps = currentOps.inprog.filter((op) => {
        if (op.command?.$or[0]['command.createIndexes'] === collectionName) {
          return true;
        }

        if (op.command?.$or[1]['command.createIndexes'] === collectionName) {
          return true;
        }

        return false;
      });

      if (activeOps.length === 0) {
        return;
      }

      this.logger.warn(
        `🚧 Waiting for ${activeOps.length} index operations to complete (collection name: ${collectionName}, model name: ${modelName})`,
      );

      await sleep(5);
    }

    throw new Error(
      `Timeout waiting for index operations (collection name: ${collectionName}, model name: ${modelName})`,
    );
  }
}
