import 'dotenv/config';
import { PrismaClient, QuestionType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres_password@localhost:35432/quiz_builder_db?schema=public';

const pool = new Pool({
  connectionString,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  // Deleting quizzes will delete all questions and options due to cascading deletes.
  await prisma.quiz.deleteMany({});
  console.log('Database cleared.');

  console.log('Seeding database with sample quizzes...');

  // 1. JavaScript Trivia
  await prisma.quiz.create({
    data: {
      title: 'JavaScript Trivia',
      questions: {
        create: [
          {
            text: 'Is JavaScript a class-based programming language?',
            type: QuestionType.BOOLEAN,
            order: 1,
            options: {
              create: [
                { text: 'Yes', isCorrect: false },
                { text: 'No, it is prototype-based', isCorrect: true },
              ],
            },
          },
          {
            text: 'What keyword is used to declare a block-scoped variable that can be reassigned?',
            type: QuestionType.INPUT,
            order: 2,
            options: {
              create: [{ text: 'let', isCorrect: true }],
            },
          },
          {
            text: 'Which of the following are primitive data types in JavaScript? (Select all that apply)',
            type: QuestionType.CHECKBOX,
            order: 3,
            options: {
              create: [
                { text: 'String', isCorrect: true },
                { text: 'Number', isCorrect: true },
                { text: 'Object', isCorrect: false },
                { text: 'Undefined', isCorrect: true },
                { text: 'Array', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // 2. Web Development Essentials
  await prisma.quiz.create({
    data: {
      title: 'Web Development Essentials',
      questions: {
        create: [
          {
            text: 'Is HTTP a secure protocol by default?',
            type: QuestionType.BOOLEAN,
            order: 1,
            options: {
              create: [
                { text: 'True', isCorrect: false },
                { text: 'False', isCorrect: true },
              ],
            },
          },
          {
            text: 'What does HTML stand for?',
            type: QuestionType.INPUT,
            order: 2,
            options: {
              create: [{ text: 'HyperText Markup Language', isCorrect: true }],
            },
          },
          {
            text: 'Which of the following are valid CSS display property values? (Select all that apply)',
            type: QuestionType.CHECKBOX,
            order: 3,
            options: {
              create: [
                { text: 'flex', isCorrect: true },
                { text: 'grid', isCorrect: true },
                { text: 'block', isCorrect: true },
                { text: 'floating', isCorrect: false },
                { text: 'inline', isCorrect: true },
              ],
            },
          },
        ],
      },
    },
  });

  // 3. NestJS Architecture
  await prisma.quiz.create({
    data: {
      title: 'NestJS Architecture',
      questions: {
        create: [
          {
            text: 'NestJS controllers are responsible for handling incoming requests and returning responses to the client.',
            type: QuestionType.BOOLEAN,
            order: 1,
            options: {
              create: [
                { text: 'True', isCorrect: true },
                { text: 'False', isCorrect: false },
              ],
            },
          },
          {
            text: 'Which decorator is used to define a NestJS provider/service so it can be injected?',
            type: QuestionType.INPUT,
            order: 2,
            options: {
              create: [
                { text: '@Injectable()', isCorrect: true },
                { text: 'Injectable', isCorrect: true },
              ],
            },
          },
          {
            text: 'Which components are part of the NestJS execution context flow? (Select all that apply)',
            type: QuestionType.CHECKBOX,
            order: 3,
            options: {
              create: [
                { text: 'Guards', isCorrect: true },
                { text: 'Interceptors', isCorrect: true },
                { text: 'Pipes', isCorrect: true },
                { text: 'Filters', isCorrect: true },
                { text: 'Routes', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
