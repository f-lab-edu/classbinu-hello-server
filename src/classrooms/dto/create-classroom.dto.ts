import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateClassroomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  schoolYear: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  grade: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  classSection: string;

  @ApiProperty()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pin: string;
}
