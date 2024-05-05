import { CreateClassroomDto } from './dto/create-classroom.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Classroom } from './entities/classroom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
  ) {}

  async create(createClassroomDto: CreateClassroomDto) {
    return await this.classroomRepository.save(createClassroomDto);
  }

  async findAll() {
    return await this.classroomRepository.find();
  }

  async findOne(id: number) {
    return await this.classroomRepository.findOneBy({ id });
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto) {
    const result = await this.classroomRepository.update(
      id,
      updateClassroomDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Classroom with ID ${id} not found.`);
    }
    return result;
  }

  async remove(id: number) {
    const result = await this.classroomRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Classroom with ID ${id} not found.`);
    }
    return result;
  }
}
