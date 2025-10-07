// src/modules/forms/dto/update-field.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { FIELD_TYPES } from './create-field.dto';

export type FieldType = typeof FIELD_TYPES[number];

export class UpdateFieldDto {
  @IsOptional()
  @IsEnum(FIELD_TYPES as any)
  field_type?: FieldType;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_required?: boolean;

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
