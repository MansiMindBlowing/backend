import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { FormSubmission } from './form-submission.model';
import { FormField } from './form-fields.model';
// import { FormField } from './form-field.model';

@Table({
  tableName: 'field_responses',
  timestamps: true,
  paranoid: true,
})
export class FieldResponse extends BaseModel {
  @ForeignKey(() => FormSubmission)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  submission_id: number;

  @ForeignKey(() => FormField)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  field_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  response_value: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  file_path: string;

  // Relationships
  @BelongsTo(() => FormSubmission)
  submission: FormSubmission;

  @BelongsTo(() => FormField)
  field: FormField;
}
