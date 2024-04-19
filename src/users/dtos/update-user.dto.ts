import { IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly refreshToken?: string;
}
