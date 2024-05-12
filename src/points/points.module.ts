import { Module } from '@nestjs/common';
import { Point } from './entities/point.entity';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
