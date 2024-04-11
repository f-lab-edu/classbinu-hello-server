export class CreatePostDto {
  readonly title: string;
  readonly content: string;
  readonly status: string;
  readonly onlyTeacher: boolean;
}
