import { Injectable } from '@nestjs/common';

import { CreateTopicDto } from './dto/create-topic.dto';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
  ) {}

  async create(createTopicDto: CreateTopicDto) {
    const topic = new Topic(createTopicDto);
    return await this.topicRepository.save(topic);
  }

  async findAll() {
    return await this.topicRepository.find();
  }

  async findOne(id: number) {
    return await this.topicRepository.findOneBy({ id });
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    return await this.topicRepository.update(id, updateTopicDto);
  }

  async remove(id: number) {
    return await this.topicRepository.delete(id);
  }
}
