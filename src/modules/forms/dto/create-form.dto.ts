import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsObject,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';

export const FORM_STATUS = ['draft', 'published', 'archived', 'closed'] as const;
export type FormStatus = typeof FORM_STATUS[number];

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  // optional slug - if not provided server will generate one
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(FORM_STATUS as any)
  status?: FormStatus = 'draft';

  @IsOptional()
  @IsObject()
  settings?: object;

  @IsOptional()
  @IsObject()
  theme_config?: object;

  @IsOptional()
  @IsInt()
  @Min(1)
  max_responses?: number;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean = true;
}
