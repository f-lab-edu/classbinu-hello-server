import { Module } from '@nestjs/common';
import { Point } from 'src/points/entities/point.entity';
import { PointTransaction } from './entities/point-transaction.entity';
import { PointTransactionsController } from './point-transactions.controller';
import { PointTransactionsService } from './point-transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PointTransaction, Point])],
  controllers: [PointTransactionsController],
  providers: [PointTransactionsService],
})
export class PointTransactionsModule {}
