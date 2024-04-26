import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../entities/user.entity';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: jest.Mocked<Partial<UsersService>>;

  beforeEach(async () => {
    mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      username: 'test',
      password: 'password',
      email: 'test@gmail.com',
    };

    await controller.create(createUserDto);

    expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should find all users', async () => {
    mockUsersService.findAll.mockResolvedValue([]);

    const result = await controller.findAll();
    expect(mockUsersService.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should find one user by id', async () => {
    const user = { id: 1 } as User;
    mockUsersService.findOne.mockResolvedValue(user);

    const result = await controller.findOne(1);
    expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(user);
  });

  it('should update a user', async () => {
    const updateUserDto = {
      username: 'test',
      password: 'password',
      email: 'new-test@gmail.com',
    };

    await controller.update(1, updateUserDto);
    expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDto);
  });

  it('should remove a user', async () => {
    await controller.remove(1);
    expect(mockUsersService.remove).toHaveBeenCalledWith(1);
  });
});
