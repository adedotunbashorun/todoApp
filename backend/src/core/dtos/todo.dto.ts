import { IsString, IsDateString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export enum TodoStatus {
  UNFINISHED = 'Unfinished',
  DONE = 'Done',
}

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  content?: string;

  // @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus = TodoStatus.UNFINISHED;
}

export class UpdateTodoDto {
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
