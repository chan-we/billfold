import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  validateSync,
  Min,
  Max,
} from 'class-validator';

class EnvironmentVariables {
  // Database (Required)
  @IsString()
  DB_HOST: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASS: string;

  @IsString()
  @IsOptional()
  DB_DATABASE?: string;

  // Redis (Optional)
  @IsString()
  @IsOptional()
  REDIS_HOST?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(65535)
  REDIS_PORT?: number;

  @IsString()
  @IsOptional()
  REDIS_PASS?: string;

  // Cloudflare KV (Optional)
  @IsString()
  @IsOptional()
  CF_ACCOUNT_ID?: string;

  @IsString()
  @IsOptional()
  CF_NAMESPACE_ID?: string;

  @IsString()
  @IsOptional()
  CF_API_TOKEN?: string;

  // Security (Optional)
  @IsString()
  @IsOptional()
  JWT_SECRET?: string;

  @IsString()
  @IsOptional()
  REDIRECT_WHITELIST?: string;

  // Server
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(65535)
  PORT?: number;

  @IsString()
  @IsOptional()
  NODE_ENV?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const missingFields = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(', ')
          : 'validation failed';
        return `  - ${error.property}: ${constraints}`;
      })
      .join('\n');

    throw new Error(
      `Configuration validation failed:\n${missingFields}\n\nPlease check your .env file or environment variables.`,
    );
  }

  return validatedConfig;
}
