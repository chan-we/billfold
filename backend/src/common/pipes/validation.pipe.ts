import { ValidationPipe, BadRequestException, ValidationError } from '@nestjs/common';

function formatErrors(errors: ValidationError[]): string {
  const messages: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }
    if (error.children && error.children.length > 0) {
      messages.push(formatErrors(error.children));
    }
  }

  return messages.join('; ');
}

export const validationPipeConfig = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (errors: ValidationError[]) => {
    const message = formatErrors(errors);
    return new BadRequestException(message || '请求参数错误');
  },
});
