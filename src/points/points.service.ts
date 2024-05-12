import { CreatePointDto } from './dto/create-point.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from './entities/point.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @Inject(UsersService)
    private usersService: UsersService,
  ) {}

  async create(createPointDto: CreatePointDto) {
    const user = await this.usersService.findOne(createPointDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newPoint = this.pointRepository.create({
      user,
    });
    return await this.pointRepository.save(newPoint);
  }

  async findAll() {
    return await this.pointRepository.find();
  }

  async findOne(id: number) {
    return await this.pointRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.pointRepository.delete(id);
  }
}
