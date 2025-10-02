import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Form } from './form.model';

@Table({
  tableName: 'form_fields',
  timestamps: true,
  paranoid: true,
})
export class FormField extends BaseModel {
  @ForeignKey(() => Form)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  form_id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  field_type: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  label: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  placeholder: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_required: boolean;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  validation_rules: object;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  options: any;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_index: number;

  // Relationship
  @BelongsTo(() => Form)
  form: Form;
}
