import { Module } from '@nestjs/common';
import { PointTransactionsService } from './point-transactions.service';
import { PointTransactionsController } from './point-transactions.controller';

@Module({
  controllers: [PointTransactionsController],
  providers: [PointTransactionsService],
})
export class PointTransactionsModule {}
