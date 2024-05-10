import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ClassroomStudent {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: 외래키 설정
  @Column()
  classroom: number;

  // TODO: 외래키 설정
  @Column()
  studentId: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
