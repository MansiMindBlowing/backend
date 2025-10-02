import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { User } from './user.model';
import { FormField } from './form-fields.model';

@Table({
  tableName: 'forms',
  timestamps: true,
  paranoid: true,
})
export class Form extends BaseModel {
  // Foreign Key: References User table
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: DataType.ENUM('draft', 'published', 'archived', 'closed'),
    allowNull: false,
    defaultValue: 'draft',
  })
  status: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  settings: object;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  theme_config: object;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expires_at: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  max_responses: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_public: boolean;

  // Relationships
  @BelongsTo(() => User)
  user: User;

  @HasMany(() => FormField)
  fields: FormField[];
}
