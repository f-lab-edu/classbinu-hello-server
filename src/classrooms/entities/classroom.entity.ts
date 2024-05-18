import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CreateClassroomDto } from '../dto/create-classroom.dto';

export class Authenticator {
  authenticate: (classroom: Classroom, value: any) => boolean;
}

// 독립적인 파일이라고 생각
export class PinAuthenticator implements Authenticator {
  authenticate = (classroom: Classroom, value: string) => {
    return classroom.pin.localeCompare(value) === 0;
  };
}

export class MockAuthenticator implements Authenticator {
  authenticate = () => true;
}

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

  // TODO: 찾아보기 ===
  // checkAuthorization = (pin: string): boolean => {
  //   return this.pin.localeCompare(pin) === 0;
  // };

  static createFromDto(createClassroomDto: CreateClassroomDto): Classroom {
    const classroom = new Classroom();
    classroom.schoolYear = createClassroomDto.schoolYear;
    classroom.grade = createClassroomDto.grade;
    classroom.classSection = createClassroomDto.classSection;
    classroom.bio = createClassroomDto.bio;
    classroom.pin = createClassroomDto.pin;
    classroom.isActive = true;
    return classroom;
  }

  constructor() {}
}
