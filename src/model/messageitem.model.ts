import { Column, DataType, PrimaryKey, Table, Model } from "sequelize-typescript";

@Table
export class MessageItem extends Model{

  @PrimaryKey
  @Column(DataType.STRING(45))
  Key: string;

  @Column(DataType.STRING(45))
  FkMessage: string;

  @Column(DataType.STRING(1000))
  Message: string;

  @Column(DataType.DATE)
  DateTime_Message: Date;

  @Column(DataType.STRING(45))
  Send_By: string;

  @Column
  Read: number;

  @Column
  Status: number;
}