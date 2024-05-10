import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CreateClassroomDto } from '../dto/create-classroom.dto';

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

  constructor(createClassroomDto?: CreateClassroomDto) {
    if (createClassroomDto) {
      this.schoolYear = createClassroomDto.schoolYear;
      this.grade = createClassroomDto.grade;
      this.classSection = createClassroomDto.classSection;
      this.bio = createClassroomDto.bio;
      this.pin = createClassroomDto.pin;
      this.isActive = true;
    }
  }
}
