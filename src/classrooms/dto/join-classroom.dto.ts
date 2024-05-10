import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class JoinClassroomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pin: string;
}
