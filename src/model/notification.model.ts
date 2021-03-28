
import { Column, DataType, PrimaryKey, Table, Model } from "sequelize-typescript";

@Table
export class Notification extends Model{

  @PrimaryKey
  @Column(DataType.STRING(45))
  Key: string;

  @Column(DataType.STRING(45))
  FkCompany: string;

  @Column(DataType.STRING(45))
  FkUser: string;

  @Column(DataType.STRING(20))
  Title: string;

  @Column(DataType.STRING(20))
  Description: string;

  @Column
  Status: number;
}