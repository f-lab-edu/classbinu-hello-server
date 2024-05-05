import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { Classroom } from '../entities/classroom.entity';
import { ClassroomsService } from '../classrooms.service';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { NotFoundException } from '@nestjs/common';

describe('ClassroomsService', () => {
  let service: ClassroomsService;
  let mockClassroomRepository: jest.Mocked<Repository<Classroom>>;

  beforeEach(async () => {
    mockClassroomRepository = {
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
      } as Classroom;

      mockClassroomRepository.save.mockResolvedValue(expectedClassroom);

      const result = await service.create(createClassroomDto);
      expect(result).toEqual(expectedClassroom);
      expect(mockClassroomRepository.save).toHaveBeenCalledWith(
        createClassroomDto,
      );
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
});
