import { Column, DataType, PrimaryKey, Table, Model } from "sequelize-typescript";

@Table
export class Message extends Model{

  @PrimaryKey
  @Column(DataType.STRING(45))
  Key: string;

  @Column(DataType.STRING(45))
  FkCompany: string;

  @Column(DataType.STRING(45))
  FkUser: string;

  @Column(DataType.STRING(45))
  FkUser_Contact: string;

  @Column
  Status: number;
}