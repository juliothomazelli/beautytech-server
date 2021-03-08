import { Column, Model, PrimaryKey, Table, DataType } from 'sequelize-typescript';

@Table
export class User extends Model {

  @PrimaryKey
  @Column(DataType.STRING(45))
  Key: string;

  @Column(DataType.STRING(100))
  Name: string;

  @Column(DataType.STRING(20))
  Username: string;

  @Column
  Status: number;

  @Column
  Type: number;

  @Column
  Id: number;

  @Column(DataType.STRING(20))
  Password: string;

  @Column(DataType.STRING(20))
  Phone: string;

  @Column(DataType.STRING(45))
  Email: string;
}