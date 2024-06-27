import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '../redis.service';

describe('RedisService', () => {
  let redisService: RedisService;
  let mockRedis: any;

  beforeEach(async () => {
    mockRedis = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: mockRedis,
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
    mockRedis = module.get('default_IORedisModuleConnectionToken');
  });

  it('should be defined', () => {
    expect(redisService).toBeDefined();
  });

  it('레디스에 데이터를 저장한다.', async () => {
    mockRedis.set.mockResolvedValue('OK');
    expect(await redisService.set('key', 'value')).toBe('OK');
    expect(mockRedis.set).toHaveBeenCalledWith('key', 'value', 'EX', 600);
  });

  it('레디스에서 데이터를 가져온다.', async () => {
    mockRedis.get.mockResolvedValue('value');
    expect(await redisService.get('key')).toBe('value');
    expect(mockRedis.get).toHaveBeenCalledWith('key');
  });

  it('레디스에서 데이터를 삭제한다.', async () => {
    mockRedis.del.mockResolvedValue(1);
    expect(await redisService.del('key')).toBe(1);
    expect(mockRedis.del).toHaveBeenCalledWith('key');
  });
});
