import { CreateClassroomDto } from './dto/create-classroom.dto';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Authenticator, Classroom } from './entities/classroom.entity';
import { Repository } from 'typeorm';
import { JoinClassroomDto } from './dto/join-classroom.dto';
import { ClassroomStudent } from './entities/classroom_student.entity';
import { UpdateClassroomStudentDto } from './dto/update-classroom-student.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
    @InjectRepository(ClassroomStudent)
    private classroomStudentRepository: Repository<ClassroomStudent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(Authenticator)
    private authenticator: Authenticator,
  ) {}

  async create(createClassroomDto: CreateClassroomDto, userId: number) {
    const classroom = new Classroom(createClassroomDto);
    classroom.teacherId = userId;
    return await this.classroomRepository.save(classroom);
  }

  async findAll() {
    return await this.classroomRepository.find();
  }

  // TODO: 학급이 없을 때 error throw
  async findOne(id: number) {
    return await this.classroomRepository.findOneBy({ id });
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto) {
    const result = await this.classroomRepository.update(
      id,
      updateClassroomDto,
    );

    // Todo: 에러 메시지 적절한지 검토
    if (result.affected === 0) {
      throw new NotFoundException(`Classroom with ID ${id} not found.`);
    }
    return result;
  }

  async remove(id: number) {
    const result = await this.classroomRepository.delete(id);
    // Todo: 에러 메시지 적절한지 검토
    if (result.affected === 0) {
      throw new NotFoundException(`Classroom with ID ${id} not found.`);
    }
    return result;
  }

  async joinClassroom(
    id: number,
    userId: number,
    joinClassroomDto: JoinClassroomDto,
  ) {
    const classroom = await this.classroomRepository.findOneBy({ id });
    const user = await this.classroomStudentRepository.findOneBy({
      id: userId,
    });

    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found.`);
    }
    if (this.authenticator.authenticate(classroom, joinClassroomDto.pin)) {
      throw new UnauthorizedException('Invalid pin');
    }

    return await this.classroomStudentRepository.save({
      classroom: classroom,
      student: user,
      isActive: true,
    });
  }

  async findClassroomStudents(id: number) {
    return await this.classroomStudentRepository.find({
      where: { classroom: { id: id } },
      relations: ['student'],
    });
  }

  // 학급에 가입한 학생의 활성/비활성 상태를 변경합니다.
  async updateClassromStudent(
    id: number,
    studentId: number,
    updateDto: UpdateClassroomStudentDto,
  ) {
    // const result = await this.classroomStudentRepository.update(
    //   { classroom: { id }, student: { id: studentId } },
    //   updateDto,
    // );

    // if (result.affected === 0) {
    //   throw new NotFoundException(
    //     `Classroom with ID ${id} or Student with ID ${studentId} not found.`,
    //   );
    // }

    // return result;

    const classroom = await this.classroomRepository.findOneBy({ id });
    if (!classroom) {
      throw new NotFoundException('학급을 찾을 수 없습니다.');
    }

    const student = await this.userRepository.findOneBy({ id: studentId });
    if (!student) {
      throw new NotFoundException('학생을 찾을 수 없습니다.');
    }

    const result = await this.classroomStudentRepository.update(
      { classroom: { id }, student: { id: studentId } },
      updateDto,
    );

    return result;
  }

  async leaveClassroom(id: number, userId: number) {
    const result = await this.classroomStudentRepository.delete({
      classroom: { id },
      student: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Classroom with ID ${id} or Student with ID ${userId} not found.`,
      );
    }

    return result;
  }
}
