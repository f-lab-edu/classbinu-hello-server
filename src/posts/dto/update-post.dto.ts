import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '../enums/posts.enum';

export class UpdatePostDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly content?: string;

  @ApiProperty({ required: false, example: PostStatus.PUBLIC })
  @IsOptional()
  @IsEnum(PostStatus)
  readonly status?: PostStatus;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  readonly onlyTeacher?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  views?: number;
}
