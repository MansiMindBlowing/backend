import { Table, Column, DataType, HasMany, Scopes } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Form } from './form.model';
// import { Form } from './form.model';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
@Scopes(() => ({
  // Scope to exclude password from queries
  withoutPassword: {
    attributes: { exclude: ['password_hash'] },
  },
}))
export class User extends BaseModel {
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password_hash: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  first_name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  last_name: string;

  @Column({
    type: DataType.ENUM('admin', 'user', 'viewer'),
    allowNull: false,
    defaultValue: 'user',
  })
  role: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;

  // Relationship: User has many Forms
  @HasMany(() => Form)
  forms: Form[];
}
