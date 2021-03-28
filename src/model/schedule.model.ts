import { Column, DataType, PrimaryKey, Table, Model } from "sequelize-typescript";

@Table
export class Schedule extends Model{

  @PrimaryKey
  @Column(DataType.STRING(45))
  Key: string;

  @Column(DataType.STRING(40))
  Description: string;

  @Column(DataType.STRING(45))
  FkCompany: string;

  @Column(DataType.STRING(45))
  FkUser_Scheduled_By: string;

  @Column(DataType.STRING(45))
  FkCustomer: string;

  @Column(DataType.STRING(45))
  FkService: string;

  @Column(DataType.DATE)
  Scheduled_Date: Date;

  @Column(DataType.STRING(100))
  Note: string;

  @Column
  Status: number;
}