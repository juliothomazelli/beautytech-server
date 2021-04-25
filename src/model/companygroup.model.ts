import { Column, DataType, PrimaryKey, Table, Model } from "sequelize-typescript";

@Table
export class CompanyGroup extends Model{

  @PrimaryKey
  @Column(DataType.STRING(45))
  Key: string;

  @Column(DataType.STRING(100))
  Name: string;

  @Column
  Status: number;
}