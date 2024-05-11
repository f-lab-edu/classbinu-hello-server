import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { Classroom } from '../entities/classroom.entity';
import { ClassroomStudent } from '../entities/classroom_student.entity';
import { ClassroomsService } from '../classrooms.service';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { JoinClassroomDto } from '../dto/join-classroom.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateClassroomStudentDto } from '../dto/update-classroom-student.dto';

describe('ClassroomsService', () => {
  let service: ClassroomsService;
  let mockClassroomRepository: jest.Mocked<Repository<Classroom>>;
  let mockClassroomStudentRepository: jest.Mocked<Repository<ClassroomStudent>>;

  beforeEach(async () => {
    mockClassroomRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockClassroomStudentRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassroomsService,
        {
          provide: 'ClassroomRepository',
          useValue: mockClassroomRepository,
        },
        {
          provide: 'ClassroomStudentRepository',
          useValue: mockClassroomStudentRepository,
        },
      ],
    }).compile();

    service = module.get<ClassroomsService>(ClassroomsService);
  });

  describe('create', () => {
    let createClassroomDto: CreateClassroomDto;

    beforeEach(() => {
      createClassroomDto = {} as CreateClassroomDto;
    });

    it('정상 요청인 경우 학급이 생성되어야 한다.', async () => {
      const expectedClassroom = {
        id: 1,
        teacherId: 1,
        isActive: true,
      } as Classroom;

      const userId = 1;

      // TODO: 별도 인터페이스로 분리해야 하나?
      const classroom = new Classroom(createClassroomDto);
      classroom.teacherId = userId;

      mockClassroomRepository.save.mockResolvedValue(expectedClassroom);

      const result = await service.create(createClassroomDto, userId);
      expect(result).toEqual(expectedClassroom);
      expect(mockClassroomRepository.save).toHaveBeenCalledWith(classroom);
    });
  });

  describe('findAll', () => {
    it('모든 학급을 반환해야 한다.', async () => {
      const expectedClassrooms = [
        {
          id: 1,
        },
      ] as Classroom[];

      mockClassroomRepository.find.mockResolvedValue(expectedClassrooms);

      const result = await service.findAll();
      expect(result).toEqual(expectedClassrooms);
      expect(mockClassroomRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('특정 학급을 반환해야 한다.', async () => {
      const expectedClassroom = {
        id: 1,
      } as Classroom;

      mockClassroomRepository.findOneBy.mockResolvedValue(expectedClassroom);

      const result = await service.findOne(1);
      expect(result).toEqual(expectedClassroom);
      expect(mockClassroomRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('특정 학급이 없는 경우 null을 반환해야 한다.', async () => {
      mockClassroomRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(1);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    let updateClassroomDto: CreateClassroomDto;

    beforeEach(() => {
      updateClassroomDto = {} as CreateClassroomDto;
    });

    it('정상 요청인 경우 학급이 수정되어야 한다.', async () => {
      const updateResult = {
        affected: 1,
      } as UpdateResult;

      mockClassroomRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(1, updateClassroomDto);
      expect(result).toEqual(updateResult);
      expect(mockClassroomRepository.update).toHaveBeenCalledWith(1, {});
    });

    it('특정 학급이 없는 경우 에러가 발생해야 한다.', async () => {
      const expectedError = new NotFoundException(
        `Classroom with ID 1 not found.`,
      );

      mockClassroomRepository.update.mockRejectedValue(expectedError);
      const result = service.update(1, updateClassroomDto);

      expect(result).rejects.toThrow(expectedError);
      expect(mockClassroomRepository.update).toHaveBeenCalledWith(
        1,
        updateClassroomDto,
      );
    });
  });

  describe('remove', () => {
    it('특정 학급을 삭제해야 한다.', async () => {
      const expectedDeleteResult = {
        affected: 1,
      } as DeleteResult;

      mockClassroomRepository.delete.mockResolvedValue(expectedDeleteResult);

      const result = await service.remove(1);
      expect(result).toEqual(expectedDeleteResult);
      expect(mockClassroomRepository.delete).toHaveBeenCalledWith(1);
    });

    it('특정 학급이 없는 경우 에러가 발생해야 한다.', async () => {
      const expectedError = new NotFoundException(
        `Classroom with ID 1 not found.`,
      );

      mockClassroomRepository.delete.mockRejectedValue(expectedError);
      const result = service.remove(1);

      expect(result).rejects.toThrow(expectedError);
      expect(mockClassroomRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('joinClassroom', () => {
    let joinClassroomDto: JoinClassroomDto;

    beforeEach(() => {
      joinClassroomDto = {
        pin: '1234',
      } as JoinClassroomDto;
    });

    it('정상 요청인 경우 학급 가입이 완료되어야 한다.', async () => {
      const expectedClassroom = {
        id: 1,
        pin: '1234',
      } as Classroom;

      const expectedClassroomStudent = {} as ClassroomStudent;

      mockClassroomRepository.findOneBy.mockResolvedValue(expectedClassroom);
      mockClassroomStudentRepository.save.mockResolvedValue(
        expectedClassroomStudent,
      );

      const result = await service.joinClassroom(1, 1, joinClassroomDto);
      expect(result).toEqual(expectedClassroomStudent);
      expect(mockClassroomRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('특정 학급이 없는 경우 에러가 발생해야 한다.', async () => {
      const expectedError = new NotFoundException(
        `Classroom with ID 1 not found.`,
      );

      mockClassroomRepository.findOneBy.mockResolvedValue(null);
      const result = service.joinClassroom(1, 1, joinClassroomDto);

      expect(result).rejects.toThrow(expectedError);
      expect(mockClassroomRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('학급 가입 핀이 일치하지 않는 경우 에러가 발생해야 한다.', async () => {
      const expectedError = new NotFoundException('Invalid pin');

      mockClassroomRepository.findOneBy.mockResolvedValue({
        id: 1,
        pin: '9999',
      } as Classroom);
      const result = service.joinClassroom(1, 1, joinClassroomDto);

      expect(result).rejects.toThrow(expectedError);
    });
  });

  describe('findClassroomStudents', () => {
    it('특정 학급의 학생을 반환해야 한다.', async () => {
      const expectedStudents = [
        {
          id: 1,
        },
      ] as ClassroomStudent[];

      mockClassroomStudentRepository.find.mockResolvedValue(expectedStudents);

      const result = await service.findClassroomStudents(1);
      expect(result).toEqual(expectedStudents);
    });

    it('특정 학급의 학생이 없는 경우 빈 배열을 반환해야 한다.', async () => {
      mockClassroomStudentRepository.find.mockResolvedValue([]);

      const result = await service.findClassroomStudents(1);
      expect(result).toEqual([]);
    });
  });

  describe('updateClassromStudent', () => {
    let updateClassroomStudentDto: UpdateClassroomStudentDto;

    beforeEach(() => {
      updateClassroomStudentDto = {} as UpdateClassroomStudentDto;
    });

    it('특정 학급의 학생을 수정(활성/비활성)해야 한다.', async () => {
      const updateResult = {
        affected: 1,
      } as UpdateResult;

      mockClassroomStudentRepository.update.mockResolvedValue(updateResult);

      const result = await service.updateClassromStudent(
        1,
        1,
        updateClassroomStudentDto,
      );
      expect(result).toEqual(updateResult);
      expect(mockClassroomStudentRepository.update).toHaveBeenCalledWith(
        {
          classroom: { id: 1 },
          student: { id: 1 },
        },
        updateClassroomStudentDto,
      );
    });

    it('특정 학급의 학생이 없는 경우 에러가 발생해야 한다.', async () => {
      const expectedError = new NotFoundException(
        `Classroom student with ID 1 not found.`,
      );

      mockClassroomStudentRepository.update.mockRejectedValue(expectedError);
      const result = service.updateClassromStudent(
        1,
        1,
        updateClassroomStudentDto,
      );

      expect(result).rejects.toThrow(expectedError);
      expect(mockClassroomStudentRepository.update).toHaveBeenCalledWith(
        {
          classroom: { id: 1 },
          student: { id: 1 },
        },
        updateClassroomStudentDto,
      );
    });
  });

  describe('leaveClassroom', () => {
    it('특정 학급을 탈퇴해야 한다.', async () => {
      const expectedDeleteResult = {
        affected: 1,
      } as DeleteResult;

      mockClassroomStudentRepository.delete.mockResolvedValue(
        expectedDeleteResult,
      );

      const result = await service.leaveClassroom(1, 1);
      expect(result).toEqual(expectedDeleteResult);
      expect(mockClassroomStudentRepository.delete).toHaveBeenCalledWith({
        classroom: { id: 1 },
        student: { id: 1 },
      });
    });

    it('특정 학급의 학생이 없는 경우 에러가 발생해야 한다.', async () => {
      const expectedError = new NotFoundException(
        `Classroom student with ID 1 not found.`,
      );

      mockClassroomStudentRepository.delete.mockRejectedValue(expectedError);
      const result = service.leaveClassroom(1, 1);

      expect(result).rejects.toThrow(expectedError);
      expect(mockClassroomStudentRepository.delete).toHaveBeenCalledWith({
        classroom: { id: 1 },
        student: { id: 1 },
      });
    });
  });
});
