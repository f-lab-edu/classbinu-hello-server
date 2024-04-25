import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CreatePostDto } from '../dto/create-post.dto';
import { PostStatus } from '../enums/posts.enum';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  views: number;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.PUBLIC })
  status: PostStatus;

  @Column({ default: false })
  onlyTeacher: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(createPostDto?: CreatePostDto) {
    if (createPostDto) {
      this.title = createPostDto.title;
      this.content = createPostDto.content;
      this.userId = createPostDto.userId;
      this.status = createPostDto.status;
      this.onlyTeacher = createPostDto.onlyTeacher;
    }
  }
}
