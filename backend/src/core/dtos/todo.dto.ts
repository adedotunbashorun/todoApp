import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     TodoStatus:
 *       type: string
 *       enum:
 *         - Unfinished
 *         - Done
 *       description: The status of a Todo item
 */
export enum TodoStatus {
  UNFINISHED = 'Unfinished',
  DONE = 'Done',
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTodoDto:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the Todo item
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The due date of the Todo item
 *         status:
 *           type: string
 *           enum:
 *             - Unfinished
 *             - Done
 *           description: The status of the Todo item
 */
export class CreateTodoDto {
  @ApiProperty({
    description: 'The content of the Todo item',
    example: 'Buy groceries',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({
    description: 'The due date of the Todo item',
    example: '2024-12-31T12:00:00Z',
  })
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'The status of the Todo item',
    enum: TodoStatus,
    default: TodoStatus.UNFINISHED,
  })
  @IsEnum(TodoStatus)
  @IsOptional()
  status: TodoStatus = TodoStatus.UNFINISHED;
}

export class UpdateTodoDto {
  @ApiProperty({
    description: 'The content of the Todo item',
    example: 'Updated content for the Todo item',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'The due date of the Todo item',
    example: '2025-01-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'The status of the Todo item',
    enum: TodoStatus,
  })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
}
