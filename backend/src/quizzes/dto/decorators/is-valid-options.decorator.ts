import { QuestionType } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

interface OptionDto {
  text: string;
  isCorrect: boolean;
}

interface QuestionDto {
  text: string;
  type: QuestionType;
  order: number;
  options?: OptionDto[];
}

@ValidatorConstraint({ name: 'isValidOptions', async: false })
export class IsValidOptionsConstraint implements ValidatorConstraintInterface {
  validate(options: unknown, args: ValidationArguments) {
    if (!Array.isArray(options)) {
      return false;
    }

    const question = args.object as QuestionDto;
    const type = question.type;
    const opts = options as OptionDto[];

    if (type === QuestionType.BOOLEAN) {
      if (opts.length !== 2) return false;
      const correctCount = opts.filter((o) => o.isCorrect === true).length;
      return correctCount === 1;
    }

    if (type === QuestionType.INPUT) {
      if (opts.length !== 1) return false;
      return opts[0].isCorrect === true;
    }

    if (type === QuestionType.CHECKBOX) {
      if (opts.length < 1) return false;
      const correctCount = opts.filter((o) => o.isCorrect === true).length;
      return correctCount >= 1;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const question = args.object as QuestionDto;
    const type = question.type;
    if (type === QuestionType.BOOLEAN) {
      return 'Boolean question must have exactly 2 options, and exactly 1 must be correct.';
    }
    if (type === QuestionType.INPUT) {
      return 'Input question must have exactly 1 answer option, which must be correct.';
    }
    if (type === QuestionType.CHECKBOX) {
      return 'Checkbox question must have at least 1 option, and at least 1 must be correct.';
    }
    return 'Invalid options for the question type.';
  }
}

export function IsValidOptions(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidOptions',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidOptionsConstraint,
    });
  };
}
