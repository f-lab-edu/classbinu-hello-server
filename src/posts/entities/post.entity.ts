import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CreatePostDto } from '../dto/create-post.dto';
import { PostStatus } from '../enums/posts.enum';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: 양방향으로 변경
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

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
