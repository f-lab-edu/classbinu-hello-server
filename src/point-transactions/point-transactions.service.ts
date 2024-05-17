import { CreatePointTransactionDto } from './dto/create-point-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PointTransaction } from './entities/point-transaction.entity';
import { Repository } from 'typeorm';
import { UpdatePointTransactionDto } from './dto/update-point-transaction.dto';
import { Point } from 'src/points/entities/point.entity';

@Injectable()
export class PointTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private pointTransactionRepository: Repository<PointTransaction>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  async create(createPointTransactionDto: CreatePointTransactionDto) {
    const { userId, amount, description } = createPointTransactionDto;

    const point = await this.pointRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!point) {
      throw new Error('Point not found');
    }

    point.adjustBalance(createPointTransactionDto.amount);
    await this.pointRepository.save(point);

    const transaction = new PointTransaction();
    transaction.point = point;
    transaction.amount = amount;
    transaction.description = description;

    await this.pointTransactionRepository.save(transaction);
    return transaction;
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
