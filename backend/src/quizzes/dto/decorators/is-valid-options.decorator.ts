import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { QuestionType } from '@prisma/client';

export function IsValidOptions(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidOptions',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const question = args.object as any;
          const options = value as any[] | undefined;
          const opts = options ?? [];

          if (question.type === QuestionType.BOOLEAN) {
            if (opts.length !== 2) return false;
            const correctCount = opts.filter((o) => o.isCorrect).length;
            if (correctCount !== 1) return false;
          } else if (question.type === QuestionType.INPUT) {
            if (opts.length !== 1) return false;
            if (!opts[0] || !opts[0].isCorrect) return false;
          } else if (question.type === QuestionType.CHECKBOX) {
            if (opts.length < 1) return false;
            const correctCount = opts.filter((o) => o.isCorrect).length;
            if (correctCount < 1) return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const question = args.object as any;

          if (question.type === QuestionType.BOOLEAN) {
            return `Boolean question "${question.text || ''}" must have exactly 2 options, with exactly 1 marked as correct.`;
          } else if (question.type === QuestionType.INPUT) {
            return `Input question "${question.text || ''}" must have exactly 1 option, and it must be marked as correct.`;
          } else if (question.type === QuestionType.CHECKBOX) {
            return `Checkbox question "${question.text || ''}" must have at least 1 option, with at least 1 marked as correct.`;
          }
          return `Invalid options for question type ${question.type}.`;
        },
      },
    });
  };
}
