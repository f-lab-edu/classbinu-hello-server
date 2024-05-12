import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PointTransactionsService } from './point-transactions.service';
import { CreatePointTransactionDto } from './dto/create-point-transaction.dto';
import { UpdatePointTransactionDto } from './dto/update-point-transaction.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('point-transaction')
@Controller('point-transactions')
export class PointTransactionsController {
  constructor(
    private readonly pointTransactionsService: PointTransactionsService,
  ) {}

  @Post()
  create(@Body() createPointTransactionDto: CreatePointTransactionDto) {
    return this.pointTransactionsService.create(createPointTransactionDto);
  }

  @Get()
  findAll() {
    return this.pointTransactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pointTransactionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePointTransactionDto: UpdatePointTransactionDto,
  ) {
    return this.pointTransactionsService.update(id, updatePointTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pointTransactionsService.remove(id);
  }
}
