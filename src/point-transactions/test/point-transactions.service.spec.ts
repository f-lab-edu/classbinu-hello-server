import { Test, TestingModule } from '@nestjs/testing';

import { PointTransactionsService } from '../point-transactions.service';

describe('PointTransactionsService', () => {
  let service: PointTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointTransactionsService],
    }).compile();

    service = module.get<PointTransactionsService>(PointTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
