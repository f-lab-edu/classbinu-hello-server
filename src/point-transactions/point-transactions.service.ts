import { CreatePointTransactionDto } from './dto/create-point-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PointTransaction } from './entities/point-transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdatePointTransactionDto } from './dto/update-point-transaction.dto';
import { Point } from 'src/points/entities/point.entity';

@Injectable()
export class PointTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private pointTransactionRepository: Repository<PointTransaction>,
    private dataSource: DataSource,
  ) {}

  async create(
    createPointTransactionDto: CreatePointTransactionDto,
  ): Promise<PointTransaction> {
    const { userId, amount, description } = createPointTransactionDto;

    return await this.dataSource.transaction(async (entityManager) => {
      const point = await entityManager.findOne(Point, {
        where: { user: { id: userId } },
      });

      if (!point) {
        throw new Error('Point not found');
      }

      point.adjustBalance(amount);
      await entityManager.save(point);

      const pointTransaction = new PointTransaction();
      pointTransaction.point = point;
      pointTransaction.amount = amount;
      pointTransaction.description = description;

      await entityManager.save(pointTransaction);

      return pointTransaction;
    });
  }

  async findAll() {
    return await this.pointTransactionRepository.find();
  }

  async findOne(id: number) {
    return await this.pointTransactionRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updatePointTransactionDto: UpdatePointTransactionDto,
  ) {
    return await this.pointTransactionRepository.update(
      id,
      updatePointTransactionDto,
    );
  }

  async remove(id: number) {
    return await this.pointTransactionRepository.delete(id);
  }
}
