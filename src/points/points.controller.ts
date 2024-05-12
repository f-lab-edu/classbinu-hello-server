import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('points')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  create(@Body() createPointDto: CreatePointDto) {
    return this.pointsService.create(createPointDto);
  }

  @Get()
  findAll() {
    return this.pointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pointsService.findOne(id);
  }

  // 포인트 객체는 업데이트 API가 필요하지 않습니다.

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pointsService.remove(id);
  }
}
