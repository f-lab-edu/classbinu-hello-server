import { Test, TestingModule } from '@nestjs/testing';

import { PointTransactionsController } from '../point-transactions.controller';
import { PointTransactionsService } from '../point-transactions.service';

describe('PointTransactionsController', () => {
  let controller: PointTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointTransactionsController],
      providers: [PointTransactionsService],
    }).compile();

    controller = module.get<PointTransactionsController>(
      PointTransactionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
