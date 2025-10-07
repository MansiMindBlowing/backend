import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItem {
  @IsNumber()
  field_id: number;

  @IsNumber()
  order_index: number;
}

export class ReorderFieldsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  order: OrderItem[];
}
