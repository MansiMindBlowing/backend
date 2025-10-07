import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsNumber,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export const FIELD_TYPES = [
  'short_answer',
  'paragraph',
  'multiple_choice',
  'checkboxes',
  'dropdown',
  'file_upload',
  'linear_scale',
  'rating',
  'multiple_choice_grid',
  'checkbox_grid',
  'date',
  'time',
] as const;

export type FieldType = typeof FIELD_TYPES[number];

export class CreateFieldDto {
  @IsNotEmpty()
  @IsEnum(FIELD_TYPES as any)
  field_type: FieldType;

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_required?: boolean = false;

  @IsOptional()
  @IsObject()
  options?: any;

  @IsOptional()
  @IsObject()
  validation_rules?: any;

  @IsOptional()
  @IsNumber()
  order_index?: number;
}
