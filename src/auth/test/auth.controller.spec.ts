import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: jest.Mocked<Partial<AuthService>>;

  const tokens = {
    accessToken: '1234',
    refreshToken: '5678',
  };

  beforeEach(async () => {
    mockAuthService = {
      validateUser: jest.fn(),
      hashData: jest.fn(),
      signUp: jest.fn().mockResolvedValue(tokens),
      login: jest.fn(),
      logout: jest.fn(),
      updateRefreshToken: jest.fn(),
      refreshTokens: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user and return tokens', async () => {
    const createUserDto = {
      username: 'test',
      password: 'test',
      email: 'test@gmail.com',
    };
    expect(await controller.signup(createUserDto)).toEqual(tokens);
    expect(mockAuthService.signUp).toHaveBeenCalledWith(createUserDto);
  });

  it('should login and return tokens', async () => {
    const authDto = {
      username: 'test',
      password: '1234',
    };
    mockAuthService.login.mockResolvedValue(tokens);
    expect(await controller.login(authDto)).toEqual(tokens);
    expect(mockAuthService.login).toHaveBeenCalledWith(authDto);
  });

  it('should logout', async () => {
    const req = {
      user: {
        sub: 1,
        refreshToken: '5678',
      },
    } as any;
    expect(await controller.logout(req)).toBeUndefined();
    expect(mockAuthService.logout).toHaveBeenCalledWith(req.user.sub);
  });

  it('should refresh tokens', async () => {
    const req = {
      user: {
        sub: 1,
        refreshToken: '5678',
      },
    } as any;

    mockAuthService.refreshTokens.mockResolvedValue(tokens);
    expect(await controller.refresh(req)).toEqual(tokens);
  });
});
