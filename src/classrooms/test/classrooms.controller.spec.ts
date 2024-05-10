import { DeleteResult, UpdateResult } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { Classroom } from '../entities/classroom.entity';
import { ClassroomStudent } from '../entities/classroom_student.entity';
import { ClassroomsController } from '../classrooms.controller';
import { ClassroomsService } from '../classrooms.service';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { JoinClassroomDto } from '../dto/join-classroom.dto';
import { NotFoundException } from '@nestjs/common';

describe('ClassroomsController', () => {
  let controller: ClassroomsController;
  let mockClassroomsService: jest.Mocked<Partial<ClassroomsService>>;

  beforeEach(async () => {
    mockClassroomsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      joinClassroom: jest.fn(),
      findClassroomStudents: jest.fn(),
      updateClassromStudent: jest.fn(),
      leaveClassroom: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassroomsController],
      providers: [
        {
          provide: ClassroomsService,
          useValue: mockClassroomsService,
        },
      ],
    }).compile();

    controller = module.get<ClassroomsController>(ClassroomsController);
  });

  describe('create', () => {
    let createClassroomDto: CreateClassroomDto;

    beforeEach(() => {
      createClassroomDto = {} as CreateClassroomDto;
    });

    it('정상 요청인 경우 학급 생성 서비스를 호출하고 학습 생성 결과를 반환해야 한다.', async () => {
      const expectedClassroom = {
        id: 1,
      } as Classroom;

      mockClassroomsService.create.mockResolvedValue(expectedClassroom);

      const result = await controller.create(createClassroomDto, 1);
      expect(result).toEqual(expectedClassroom);
      expect(mockClassroomsService.create).toHaveBeenCalledWith(
        createClassroomDto,
        1,
      );
    });
  });

  describe('findAll', () => {
    it('모든 학급을 반환해야 한다.', async () => {
      const expectedClassrooms = [
        {
          id: 1,
        } as Classroom,
      ];

      mockClassroomsService.findAll.mockResolvedValue(expectedClassrooms);

      const result = await controller.findAll();
      expect(result).toEqual(expectedClassrooms);
    });

    it('학급이 없는 경우 빈 배열을 반환해야 한다.', async () => {
      const expectedClassrooms = [];

      mockClassroomsService.findAll.mockResolvedValue(expectedClassrooms);

      const result = await controller.findAll();
      expect(result).toEqual(expectedClassrooms);
    });
  });

  describe('findOne', () => {
    it('특정 학급을 반환해야 한다.', async () => {
      const expectedClassroom = {
        id: 1,
      } as Classroom;

      mockClassroomsService.findOne.mockResolvedValue(expectedClassroom);

      const result = await controller.findOne(1);
      expect(result).toEqual(expectedClassroom);
    });
  });

  describe('update', () => {
    let updateClassroomDto: CreateClassroomDto;

    beforeEach(() => {
      updateClassroomDto = {} as CreateClassroomDto;
    });

    it('정상 요청인 경우 학급 수정 서비스를 호출하고 학습 수정 결과를 반환해야 한다.', async () => {
      const expectedClassroom = {
        affected: 1,
      } as UpdateResult;

      mockClassroomsService.update.mockResolvedValue(expectedClassroom);

      const result = await controller.update(1, updateClassroomDto);
      expect(result).toEqual(expectedClassroom);
      expect(mockClassroomsService.update).toHaveBeenCalledWith(
        1,
        updateClassroomDto,
      );
    });

    it('수정할 학급이 없는 경우 404 에러를 반환해야 한다.', async () => {
      const expectedError = new NotFoundException();

      mockClassroomsService.update.mockRejectedValue(expectedError);

      await expect(controller.update(1, updateClassroomDto)).rejects.toThrow(
        expectedError,
      );
    });
  });

  describe('remove', () => {
    it('정상 요청인 경우 학급 삭제 서비스를 호출하고 학습 삭제 결과를 반환해야 한다.', async () => {
      const expectedClassroom = {
        affected: 1,
      } as UpdateResult;

      mockClassroomsService.remove.mockResolvedValue(expectedClassroom);

      const result = await controller.remove(1);
      expect(result).toEqual(expectedClassroom);
      expect(mockClassroomsService.remove).toHaveBeenCalledWith(1);
    });

    it('삭제할 학급이 없는 경우 404 에러를 반환해야 한다.', async () => {
      const expectedError = new NotFoundException();

      mockClassroomsService.remove.mockRejectedValue(expectedError);

      await expect(controller.remove(1)).rejects.toThrow(expectedError);
    });
  });

  describe('joinClassroom', () => {
    it('정상 요청인 경우 학급 가입 서비스를 호출하고 학급 가입 결과를 반환해야 한다.', async () => {
      const expectedClassroom = {
        id: 1,
      } as Classroom;

      const joinClassroomDto = {
        pin: '1234',
      } as JoinClassroomDto;

      mockClassroomsService.joinClassroom.mockResolvedValue(
        expectedClassroom as any,
      );

      const result = await controller.joinClassroom(1, joinClassroomDto, 1);
      expect(result).toEqual(expectedClassroom);
      expect(mockClassroomsService.joinClassroom).toHaveBeenCalledWith(1, 1, {
        pin: '1234',
      });
    });
  });

  describe('findClassroomStudents', () => {
    it('특정 학급의 학생을 반환해야 한다.', async () => {
      const expectedStudents = [
        {
          id: 1,
        },
      ] as ClassroomStudent[];

      mockClassroomsService.findClassroomStudents.mockResolvedValue(
        expectedStudents,
      );

      const result = await controller.findStudents(1);
      expect(result).toEqual(expectedStudents);
    });
  });

  describe('updateClassromStudent', () => {
    it('특정 학급의 학생을 수정(활성/비활성)해야 한다.', async () => {
      const expectedClassroomStudent = {
        affected: 1,
      } as UpdateResult;

      mockClassroomsService.updateClassromStudent.mockResolvedValue(
        expectedClassroomStudent,
      );

      const result = await controller.updateClassromStudent(1, 1, {
        isActive: false,
      });
      expect(result).toEqual(expectedClassroomStudent);
    });
  });

  describe('leaveClassroom', () => {
    it('특정 학급을 나가야 한다.', async () => {
      const expectedClassroomStudent = {
        affected: 1,
      } as DeleteResult;

      mockClassroomsService.leaveClassroom.mockResolvedValue(
        expectedClassroomStudent,
      );

      const result = await controller.leaveClassroom(1, 1);
      expect(result).toEqual(expectedClassroomStudent);
    });

    it('나갈 학급이 없는 경우 404 에러를 반환해야 한다.', async () => {
      const expectedError = new NotFoundException();

      mockClassroomsService.leaveClassroom.mockRejectedValue(expectedError);

      await expect(controller.leaveClassroom(1, 1)).rejects.toThrow(
        expectedError,
      );
    });
  });
});
