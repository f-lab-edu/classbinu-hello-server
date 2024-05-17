import { DataSource, EntityManager, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { PointTransaction } from '../entities/point-transaction.entity';
import { PointTransactionsService } from '../point-transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PointTransactionsService', () => {
  let service: PointTransactionsService;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockManager: jest.Mocked<EntityManager>;
  let mockPointTransactionsRepository: jest.Mocked<
    Repository<PointTransaction>
  >;

  beforeEach(async () => {
    mockManager = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    mockDataSource = {
      transaction: jest
        .fn()
        .mockImplementation((operation) => operation(mockManager)),
    } as any;

    mockPointTransactionsRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      increment: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointTransactionsService,
        {
          provide: getRepositoryToken(PointTransaction),
          useValue: mockPointTransactionsRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: EntityManager,
          useValue: mockManager,
        },
      ],
    }).compile();

    service = module.get<PointTransactionsService>(PointTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('포인트 거래내역이 정상적으로 생성됩니다.', async () => {
      const point = { adjustBalance: jest.fn() };
      (mockManager.findOne as jest.Mock).mockResolvedValueOnce(point);
      (mockManager.save as jest.Mock).mockResolvedValueOnce(point);

      const result = await service.create({
        userId: 1,
        amount: 100,
        description: 'test',
      });

      expect(result).toEqual({
        point,
        amount: 100,
        description: 'test',
      });
    });
  });
});
