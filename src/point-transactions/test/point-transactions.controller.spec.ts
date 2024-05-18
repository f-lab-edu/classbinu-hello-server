import { Test, TestingModule } from '@nestjs/testing';

import { PointTransactionsController } from '../point-transactions.controller';
import { PointTransactionsService } from '../point-transactions.service';

describe('PointTransactionsController', () => {
  let controller: PointTransactionsController;
  let mockPointTransactionsService: jest.Mocked<
    Partial<PointTransactionsService>
  >;

  beforeEach(async () => {
    mockPointTransactionsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointTransactionsController],
      providers: [
        {
          provide: PointTransactionsService,
          useValue: mockPointTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<PointTransactionsController>(
      PointTransactionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('포인트 트랜잭션이 정상적으로 생성된다.', async () => {
      const createPointTransactionDto = {
        userId: 1,
        amount: 100,
      };

      mockPointTransactionsService.create.mockResolvedValueOnce({
        id: 1,
      } as any);

      await expect(
        controller.create(createPointTransactionDto),
      ).resolves.toEqual({
        id: 1,
      });
      expect(mockPointTransactionsService.create).toHaveBeenCalledWith(
        createPointTransactionDto,
      );
    });
  });
});
