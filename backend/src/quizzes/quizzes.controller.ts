import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizListItemDto, QuizResponseDto } from './dto/quiz-response.dto';
import { QuizzesService } from './quizzes.service';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quiz with questions and options' })
  @ApiResponse({
    status: 201,
    description: 'The quiz has been successfully created.',
    type: QuizResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload or option validation failed.',
  })
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all quizzes' })
  @ApiResponse({
    status: 200,
    description: 'List of all quizzes with metadata and question counts.',
    type: [QuizListItemDto],
  })
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a quiz by ID' })
  @ApiParam({ name: 'id', description: 'Quiz UUID' })
  @ApiResponse({
    status: 200,
    description: 'Detailed quiz object with all questions and answer options.',
    type: QuizResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quiz by ID' })
  @ApiParam({ name: 'id', description: 'Quiz UUID' })
  @ApiResponse({ status: 200, description: 'Quiz successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }
}
