import { IsString, IsOptional, IsArray, ValidateIf } from 'class-validator';

export class AddFieldFromTypeDto {
  @IsString()
  field_type: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsArray()
  options?: { label: string; value?: string }[]; // only for select/checkbox/radio

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  is_required?: boolean;
}
