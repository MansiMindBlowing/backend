import {
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

export abstract class BaseModel extends Model {
  // Primary Key - Auto Increment
//   @Column({
//     type: DataType.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   })
//   id: number;

  // Created At - Timestamp when record was created
  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created_at: Date;

  // Updated At - Timestamp when record was last updated
  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updated_at: Date;

  // Deleted At - Soft delete timestamp
  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deleted_at: Date;

  // Created By - User who created this record
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'User ID who created this record',
  })
  created_by: number;

  // Updated By - User who last updated this record
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'User ID who last updated this record',
  })
  updated_by: number;

  // Is Deleted - Boolean flag for soft delete
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  is_deleted: boolean;
}