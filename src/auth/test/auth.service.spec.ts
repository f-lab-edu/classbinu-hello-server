import * as argon2 from 'argon2';

import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../auth.service';
import { TokenStrategy } from '../strategies/token.strategy';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: jest.Mocked<Partial<UsersService>>;
  let mockTokenStrategy: jest.Mocked<Partial<TokenStrategy>>;

  beforeEach(async () => {
    mockUsersService = {
      findOne: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    mockTokenStrategy = {
      createTokens: jest
        .fn()
        .mockResolvedValue({ accessToken: '1234', refreshToken: '5678' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: 'TokenStrategy',
          useValue: mockTokenStrategy,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = { id: 1 } as User;
    mockUsersService.findByUsername.mockResolvedValue(undefined);
    mockUsersService.create.mockResolvedValue(user);

    const createUserDto = {
      username: 'test',
      password: 'password',
      email: 'test@gmail.com',
    };
    const result = await service.signUp(createUserDto);

    expect(result).toEqual({ accessToken: '1234', refreshToken: '5678' });
    expect(mockUsersService.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: expect.any(String),
    });
  });

  it('should throw an error if the user already exists', async () => {
    mockUsersService.findByUsername.mockResolvedValue({ id: 1 } as User);

    const createUserDto = {
      username: 'test',
      password: 'password',
      email: 'test@gmail.com',
    };

    await expect(service.signUp(createUserDto)).rejects.toThrow(
      ConflictException,
    );
    await expect(service.signUp(createUserDto)).rejects.toThrow(
      'Username already exists',
    );
  });

  it('should login a user', async () => {
    const tokens = { accessToken: '1234', refreshToken: '5678' };
    const user = {
      id: 1,
      username: 'test',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$astVF+6HxCi0Tz8az/E48w$8R14GM3THxiiobbqqWC9veNQJD3/Esui4WoP+N5aa5M',
    } as User;
    mockUsersService.findByUsername.mockResolvedValue(user);
    mockTokenStrategy.createTokens.mockResolvedValue(tokens);

    const authDto = {
      username: 'test',
      password: '1234',
    };
    const result = await service.login(authDto);

    expect(result).toEqual(tokens);
    expect(mockTokenStrategy.createTokens).toHaveBeenCalledWith(
      user.id,
      user.username,
    );
  });

  it('should throw an error if the user does not exist', async () => {
    mockUsersService.findByUsername.mockResolvedValue(undefined);

    const authDto = {
      username: 'test',
      password: '1234',
    };

    await expect(service.login(authDto)).rejects.toThrow(UnauthorizedException);
    await expect(service.login(authDto)).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error if the password is incorrect', async () => {
    const user = {
      id: 1,
      username: 'test',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$astVF+6HxCi0Tz8az/E48w$8R14GM3THxiiobbqqWC9veNQJD3/Esui4WoP+N5aa5M',
    } as User;

    mockUsersService.findByUsername.mockResolvedValue(user);

    const authDto = {
      username: 'test',
      password: 'wrong password',
    };

    await expect(service.login(authDto)).rejects.toThrow(UnauthorizedException);
    await expect(service.login(authDto)).rejects.toThrow('Invalid credentials');
  });

  it('should logout a user', async () => {
    await expect(service.logout(1)).resolves.toBeUndefined();
  });

  it('should update the refresh token', async () => {
    const userId = 1;
    const refreshToken = '1234';

    await service.updateRefreshToken(userId, refreshToken);

    expect(mockUsersService.update).toHaveBeenCalledWith(userId, {
      refreshToken: expect.any(String),
    });
    await expect(
      service.updateRefreshToken(userId, refreshToken),
    ).resolves.toBeUndefined();
  });

  it('should throw an error if the user does not exist', async () => {
    mockUsersService.findOne.mockResolvedValue(undefined);

    const userId = 1;
    const refreshToken = '5678';

    await expect(service.refreshTokens(userId, refreshToken)).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.refreshTokens(userId, refreshToken)).rejects.toThrow(
      'User not found',
    );
  });

  it('should throw an error if the user does not have a refresh token', async () => {
    const user = { id: 1, refreshToken: undefined } as User;
    mockUsersService.findOne.mockResolvedValue(user);

    const userId = 1;
    const refreshToken = '5678';

    await expect(service.refreshTokens(userId, refreshToken)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(service.refreshTokens(userId, refreshToken)).rejects.toThrow(
      'No refresh token provided',
    );
  });

  it('should throw an error if the refresh token is invalid', async () => {
    const user = {
      id: 1,
      refreshToken: '5678',
    } as User;
    mockUsersService.findOne.mockResolvedValue(user);

    const userId = 1;
    const refreshToken = 'invalid';

    jest.spyOn(argon2, 'verify').mockResolvedValue(false);

    await expect(service.refreshTokens(userId, refreshToken)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(service.refreshTokens(userId, refreshToken)).rejects.toThrow(
      'Invalid refresh token',
    );
  });

  it('should refresh the tokens', async () => {
    const tokens = { accessToken: '1234', refreshToken: '5678' };
    const user = {
      id: 1,
      username: 'test',
      refreshToken: '5678',
    } as User;

    mockUsersService.findOne.mockResolvedValue(user);
    mockTokenStrategy.createTokens.mockResolvedValue(tokens);

    jest.spyOn(argon2, 'verify').mockResolvedValue(true);
    expect(
      await service.updateRefreshToken(user.id, user.refreshToken),
    ).toBeUndefined();
    expect(await service.refreshTokens(user.id, user.refreshToken)).toEqual(
      tokens,
    );
  });
});
