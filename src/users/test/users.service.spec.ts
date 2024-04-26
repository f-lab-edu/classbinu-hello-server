import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: jest.Mocked<Partial<Repository<User>>>;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'UserRepository', useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = {
      id: 1,
    } as User;

    const createUserDto = {
      username: 'test',
      password: 'password',
      email: 'test@gmail.com',
    };

    mockUserRepository.create.mockReturnValue(user);
    mockUserRepository.save.mockResolvedValue(user);

    const result = await service.create(createUserDto);
    expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  it('should find all users', async () => {
    const users = [{ id: 1 } as User];
    mockUserRepository.find.mockResolvedValue(users);

    const result = await service.findAll();
    expect(mockUserRepository.find).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('should find one user by id', async () => {
    const user = { id: 1 } as User;
    mockUserRepository.findOne.mockResolvedValue(user);

    const result = await service.findOne(1);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(user);
  });

  it('should find one user by username', async () => {
    const user = { id: 1 } as User;
    mockUserRepository.findOne.mockResolvedValue(user);

    const result = await service.findByUsername('test');
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { username: 'test' },
    });
    expect(result).toEqual(user);
  });

  it('should update a user', async () => {
    const user = { id: 1 } as User;
    const updateUserDto = {
      username: 'test',
      password: 'password',
      email: 'test2@gmail.com',
    };

    mockUserRepository.update.mockResolvedValue(user as any);
    expect(await service.update(1, updateUserDto)).toEqual(user);
  });

  it('should remove a user', async () => {
    const result = await service.remove(1);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    expect(result).toBeUndefined();
  });
});
