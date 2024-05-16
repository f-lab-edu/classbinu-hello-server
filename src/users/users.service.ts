import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { EventBus } from '@nestjs/cqrs';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventBus: EventBus,
    // DataSource는 Global로 주입되고 있습니다.
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const newUser = this.userRepository.create(createUserDto);
        const user = await manager.save(newUser);

        this.eventBus.publish(new UserCreatedEvent(user.id));
        return user;
      } catch {
        throw new Error('Failed to create user');
      }
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
