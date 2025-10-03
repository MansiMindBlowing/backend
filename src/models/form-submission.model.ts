import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Form } from './form.model';
import { FieldResponse } from './field-response.model';
// import { FieldResponse } from './field-response.model';

@Table({
  tableName: 'form_submissions',
  timestamps: true,
  paranoid: true, //for softdelete
})
export class FormSubmission extends BaseModel {
  @ForeignKey(() => Form)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  form_id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  respondent_email: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  ip_address: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  user_agent: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  submission_data: object;

  @Column({
    type: DataType.ENUM('completed', 'partial', 'flagged'),
    allowNull: false,
    defaultValue: 'completed',
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  submitted_at: Date;

  // Relationships
  @BelongsTo(() => Form)
  form: Form;

  @HasMany(() => FieldResponse)
  responses: FieldResponse[];
}
