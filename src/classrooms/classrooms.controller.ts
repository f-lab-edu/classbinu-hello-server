import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createClassroomDto: CreateClassroomDto) {
    return await this.classroomsService.create(createClassroomDto);
  }

  @Get()
  async findAll() {
    return await this.classroomsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.classroomsService.findOne(id);
  }

  @Patch(':id')
  // TODO: 학급 개설자만 수정할 수 있도록 수정
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: number,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return await this.classroomsService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  // TODO: 학급 개설자만 삭제할 수 있도록 수정
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: number) {
    return await this.classroomsService.remove(id);
  }
}
