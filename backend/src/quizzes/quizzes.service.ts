import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    // TODO rewrite this to efficient way
    for (let i = 0; i < createQuizDto.questions.length; i++) {
      const q = createQuizDto.questions[i];
      const options = q.options ?? [];

      if (q.type === QuestionType.BOOLEAN) {
        if (options.length !== 2) {
          throw new BadRequestException(
            `Question ${i + 1} ("${q.text}"): Boolean type must have exactly 2 options.`,
          );
        }
        const correctCount = options.filter((o) => o.isCorrect).length;
        if (correctCount !== 1) {
          throw new BadRequestException(
            `Question ${i + 1} ("${q.text}"): Boolean type must have exactly 1 correct answer.`,
          );
        }
      } else if (q.type === QuestionType.INPUT) {
        if (options.length !== 1) {
          throw new BadRequestException(
            `Question ${i + 1} ("${q.text}"): Input type must have exactly 1 answer option.`,
          );
        }
        if (!options[0].isCorrect) {
          throw new BadRequestException(
            `Question ${i + 1} ("${q.text}"): Input type answer option must be marked as correct.`,
          );
        }
      } else if (q.type === QuestionType.CHECKBOX) {
        if (options.length < 1) {
          throw new BadRequestException(
            `Question ${i + 1} ("${q.text}"): Checkbox type must have at least 1 option.`,
          );
        }
        const correctCount = options.filter((o) => o.isCorrect).length;
        if (correctCount < 1) {
          throw new BadRequestException(
            `Question ${i + 1} ("${q.text}"): Checkbox type must have at least 1 correct option.`,
          );
        }
      }
    }

    return this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        questions: {
          create: createQuizDto.questions.map((question) => ({
            text: question.text,
            type: question.type,
            order: question.order,
            options: {
              create: (question.options ?? []).map((option) => ({
                text: option.text,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
          include: {
            options: true,
          },
        },
      },
    });
  }

  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: {
          select: { questions: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return quizzes.map((quizze) => ({
      id: quizze.id,
      title: quizze.title,
      createdAt: quizze.createdAt,
      questionsCount: quizze._count.questions,
    }));
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${id}" not found`);
    }

    return quiz;
  }

  async remove(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${id}" not found`);
    }

    await this.prisma.quiz.delete({
      where: { id },
    });

    return { success: true };
  }
}
