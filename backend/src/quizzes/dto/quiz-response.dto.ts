import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '@prisma/client';

export class OptionResponseDto {
  @ApiProperty({ description: 'ID of the option', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: 'Text of the option', example: 'Paris' })
  text: string;

  @ApiProperty({ description: 'Whether the option is correct', example: true })
  isCorrect: boolean;
}

export class QuestionResponseDto {
  @ApiProperty({ description: 'ID of the question', example: 'uuid-string' })
  id: string;

  @ApiProperty({
    description: 'Question text',
    example: 'What is the capital of France?',
  })
  text: string;

  @ApiProperty({
    description: 'Type of the question',
    enum: QuestionType,
    example: QuestionType.INPUT,
  })
  type: QuestionType;

  @ApiProperty({ description: 'Display order of the question', example: 1 })
  order: number;

  @ApiProperty({
    description: 'List of answer options',
    type: [OptionResponseDto],
  })
  options: OptionResponseDto[];
}

export class QuizResponseDto {
  @ApiProperty({ description: 'ID of the quiz', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: 'Title of the quiz', example: 'Geography Quiz' })
  title: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2026-06-09T06:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2026-06-09T06:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'List of questions',
    type: [QuestionResponseDto],
  })
  questions: QuestionResponseDto[];
}

export class QuizListItemDto {
  @ApiProperty({ description: 'ID of the quiz', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: 'Title of the quiz', example: 'Geography Quiz' })
  title: string;

  @ApiProperty({ description: 'Number of questions in this quiz', example: 5 })
  questionsCount: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2026-06-09T06:00:00.000Z',
  })
  createdAt: Date;
}
