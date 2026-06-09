import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsValidOptions } from './decorators/is-valid-options.decorator';

export class CreateOptionDto {
  @ApiProperty({ description: 'Text of the option', example: 'Paris' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Whether the option is correct', example: true })
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Question text',
    example: 'What is the capital of France?',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'Type of the question',
    enum: QuestionType,
    example: QuestionType.INPUT,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({ description: 'The display order of the question', example: 1 })
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({
    description: 'List of answer options',
    type: [CreateOptionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @IsValidOptions()
  @IsOptional()
  options?: CreateOptionDto[];
}

export class CreateQuizDto {
  @ApiProperty({ description: 'Title of the quiz', example: 'Geography Quiz' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'List of questions',
    type: [CreateQuestionDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
