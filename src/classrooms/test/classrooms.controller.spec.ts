import { Test, TestingModule } from '@nestjs/testing';

import { Classroom } from '../entities/classroom.entity';
import { ClassroomsController } from '../classrooms.controller';
import { ClassroomsService } from '../classrooms.service';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

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

      const result = await controller.create(createClassroomDto);
      expect(result).toEqual(expectedClassroom);
      expect(mockClassroomsService.create).toHaveBeenCalledWith(
        createClassroomDto,
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
});
