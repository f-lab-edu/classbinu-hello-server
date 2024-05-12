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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JoinClassroomDto } from './dto/join-classroom.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateClassroomStudentDto } from './dto/update-classroom-student.dto';

@ApiTags('classrooms')
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createClassroomDto: CreateClassroomDto,
    @User('userId') userId: number,
  ) {
    return await this.classroomsService.create(createClassroomDto, userId);
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

  @Post(':id/join')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async joinClassroom(
    @Param('id') id: number,
    @Body() joinClassroomDto: JoinClassroomDto,
    @User('userId') userId: number,
  ) {
    return await this.classroomsService.joinClassroom(
      id,
      userId,
      joinClassroomDto,
    );
  }

  @Get(':id/students')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  // TODO: 학급 구성원만 조회할 수 있도록 수정
  async findStudents(@Param('id') id: number) {
    console.log(id);
    return await this.classroomsService.findClassroomStudents(id);
  }

  @Patch(':id/students/:studentId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  // TODO: 학급 개설자만 비활성화할 수 있도록 수정
  async updateClassromStudent(
    @Param('id') id: number,
    @Param('studentId') studentId: number,
    @Body() updateDto: UpdateClassroomStudentDto,
  ) {
    return await this.classroomsService.updateClassromStudent(
      id,
      studentId,
      updateDto,
    );
  }

  @Delete(':id/students/leave')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  // 본인만 나갈 수 있도록 수정
  async leaveClassroom(
    @Param('id') id: number,
    @User('userId') userId: number,
  ) {
    return await this.classroomsService.leaveClassroom(id, userId);
  }
}
