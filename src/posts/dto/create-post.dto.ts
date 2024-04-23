import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '../enums/posts.enum';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ example: PostStatus.PUBLIC })
  @IsNotEmpty()
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  readonly onlyTeacher: boolean;
}
