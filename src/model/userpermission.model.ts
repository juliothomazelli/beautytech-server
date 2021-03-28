import { Column, Model, PrimaryKey, Table, DataType } from 'sequelize-typescript';

@Table
export class UserPermission extends Model{
  @PrimaryKey
  @Column(DataType.STRING(45))
  Key: string;

  @Column(DataType.STRING(45))
  FkUser: string;

  @Column
  Status: number;

  @Column(DataType.STRING(20))
  Name: string;

  @Column
  Active: number;
}