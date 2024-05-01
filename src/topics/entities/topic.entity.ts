import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CreateTopicDto } from '../dto/create-topic.dto';
import { IsOptional } from 'class-validator';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @IsOptional()
  description?: string;

  @Column()
  status: string = 'private';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(createTopicDto?: CreateTopicDto) {
    if (createTopicDto) {
      this.title = createTopicDto.title;
      this.description = createTopicDto.description;
      this.status = createTopicDto.status;
    }
  }
}
