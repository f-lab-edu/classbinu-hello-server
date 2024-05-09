import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateClassroomDto {
  @ApiProperty()
  @IsString()
  schoolYear?: number;

  @ApiProperty()
  @IsString()
  grade?: number;

  @ApiProperty()
  @IsString()
  classSection?: string;

  @ApiProperty()
  @IsString()
  teacherId?: number;

  @ApiProperty()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsString()
  pin?: string;

  @ApiProperty()
  @IsString()
  isActive?: boolean;
}
