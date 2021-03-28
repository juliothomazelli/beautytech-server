
import { Column, DataType, PrimaryKey, Table, Model } from "sequelize-typescript";

@Table
export class Service extends Model{
  
  @PrimaryKey
  @Column(DataType.STRING(45))
  Key: string;

  @Column(DataType.STRING(45))
  FkCompany: string;

  @Column(DataType.STRING(45))
  FkUser: string;

  @Column(DataType.STRING(45))
  Name: string;

  @Column(DataType.STRING(100))
  Note: string;

  @Column
  Enabled: number;

  @Column
  Status: number;
}