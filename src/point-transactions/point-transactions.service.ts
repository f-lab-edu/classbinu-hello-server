import { CreatePointTransactionDto } from './dto/create-point-transaction.dto';
import { Injectable } from '@nestjs/common';
import { UpdatePointTransactionDto } from './dto/update-point-transaction.dto';

@Injectable()
export class PointTransactionsService {
  create(createPointTransactionDto: CreatePointTransactionDto) {
    return 'This action adds a new pointTransaction';
  }

  findAll() {
    return `This action returns all pointTransactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pointTransaction`;
  }

  update(id: number, updatePointTransactionDto: UpdatePointTransactionDto) {
    return `This action updates a #${id} pointTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} pointTransaction`;
  }
}
