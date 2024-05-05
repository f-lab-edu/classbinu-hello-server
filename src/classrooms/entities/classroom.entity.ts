import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  schoolYear: number;

  @Column()
  grade: number;

  @Column()
  classSection: string;

  // TODO: 외래키 설정
  @Column()
  teacherId: number;

  @Column()
  bio: string;

  @Column()
  pin: string;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
