import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateClassroomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  schoolYear: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  grade: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  classSection: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  teacherId: number;

  @ApiProperty()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pin: string;
}
