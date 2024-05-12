import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePointDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly userId: number;
}
