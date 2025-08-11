import { Collection, Connection, Model } from 'mongoose';

import { IndexService } from './index.service';

describe('IndexService.onApplicationBootstrap', () => {
  let service: IndexService;
  let mockConnection: jest.Mocked<Connection>;
  let mockModel: jest.Mocked<Model<any>>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      createIndex: jest.fn(),
      indexes: jest.fn().mockResolvedValue([]),
      dbName: 'testDb',
    } as any;
    mockModel = {
      createCollection: jest.fn(),
      collection: mockCollection as Collection,
      schema: {
        indexes: jest
          .fn()
          .mockReturnValue([[{ field: 1 }, { name: 'field_1', unique: true }]]),
      },
    } as any;
    mockConnection = {
      modelNames: jest.fn().mockReturnValue(['TestModel']),
      model: jest.fn().mockReturnValue(mockModel),
      db: {
        admin: jest.fn().mockReturnValue({
          command: jest.fn().mockResolvedValue({ inprog: [] }),
        }),
      },
    } as any;

    service = new IndexService(mockConnection as Connection);

    jest.spyOn(service['logger'], 'log').mockImplementation();
    jest.spyOn(service['logger'], 'error').mockImplementation();
    jest.spyOn(service['logger'], 'warn').mockImplementation();
  });

  it('should create indexes on bootstrap', async () => {
    mockModel.createCollection.mockResolvedValue({
      collectionName: 'collection_name',
    } as any);

    await service.onApplicationBootstrap();

    expect(mockModel.createCollection).toHaveBeenCalled();
    expect(mockCollection.createIndex).toHaveBeenCalledWith(
      { field: 1 },
      { name: 'field_1', unique: true },
    );
  });

  it('should NOT create any index on bootstrap if the we have no index defined in code', async () => {
    mockModel.schema.indexes = jest.fn().mockReturnValue([]);
    await service.onApplicationBootstrap();

    expect(mockModel.createCollection).toHaveBeenCalled();
    expect(mockCollection.createIndex).not.toHaveBeenCalled();
  });

  it('should NOT create indexes when admin database does not exists', async () => {
    mockConnection.db!.admin = jest.fn().mockReturnValue(undefined);

    await service.onApplicationBootstrap();

    expect(mockModel.createCollection).toHaveBeenCalled();
    expect(mockCollection.createIndex).not.toHaveBeenCalledWith();
  });

  it('should NOT reraise the exception during index creation', async () => {
    mockModel.createCollection = jest
      .fn()
      .mockRejectedValue(new Error('some error'));
    const spy = jest.spyOn(service['logger'], 'error');

    await service.onApplicationBootstrap();

    expect(mockCollection.createIndex).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });
});
