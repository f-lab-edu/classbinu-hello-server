import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { PostStatus } from '../enums/posts.enum';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsEnum(PostStatus)
  readonly status?: PostStatus;

  @IsOptional()
  @IsBoolean()
  readonly onlyTeacher?: boolean;
}
