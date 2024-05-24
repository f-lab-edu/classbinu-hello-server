import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Post } from './post.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
@Unique(['userId', 'postId'])
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.postLikes)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Post, (post) => post.postLikes)
  @JoinColumn()
  post: Post;

  @Column()
  postId: number;

  @CreateDateColumn()
  createdAt: Date;
}
