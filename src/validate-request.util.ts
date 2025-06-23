import { plainToInstance } from 'class-transformer';
import { ChunkDto } from './chunk.dto';
import { validate } from 'class-validator';
import { ValidationError } from '@nestjs/common';

export async function validateIncomingData(
  unvalidatedData: ChunkDto,
): Promise<ChunkDto> {
  const data = plainToInstance(ChunkDto, unvalidatedData, {
    enableImplicitConversion: true,
  });
  const validationResult = await validate(data);

  if (validationResult.length > 0) {
    const error = constraintsToString(validationResult);
    throw new Error(error?.join(', ') ?? 'Validation failed');
  }

  return data;
}

function constraintsToString(errors: ValidationError[]): string[] {
  const constraints: string[] = [];

  for (const error of errors) {
    const errorMessages = deepSearchByKey(error, 'constraints');
    constraints.push(...errorMessages);
  }

  return constraints;
}

function deepSearchByKey(
  object: any,
  originalKey: string,
  matches: string[] = [],
) {
  if (object != null) {
    if (Array.isArray(object)) {
      for (const arrayItem of object) {
        deepSearchByKey(arrayItem, originalKey, matches);
      }
    } else if (typeof object == 'object') {
      for (const key of Object.keys(object)) {
        if (key == originalKey) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          matches.push(...Object.values(object[key] as string[]));
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          deepSearchByKey(object[key], originalKey, matches);
        }
      }
    }
  }

  return matches;
}
