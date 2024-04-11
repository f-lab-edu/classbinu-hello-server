import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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

  @ApiProperty({ example: PostStatus.PUBLIC })
  @IsNotEmpty()
  @IsEnum(PostStatus)
  readonly status: PostStatus;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  readonly onlyTeacher: boolean;
}
