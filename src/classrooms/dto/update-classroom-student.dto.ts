import { IsBoolean, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassroomStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
