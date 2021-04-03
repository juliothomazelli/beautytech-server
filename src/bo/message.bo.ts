import { QueryTypes } from "sequelize";
import { SequelizeORM } from "../sequelize/sequelize";
import { StringUtils } from "../utils/StringUtils";

export enum MessageTypes {
  LOAD_MESSAGES = 'LOAD_MESSAGES',
  NEW_MESSAGE   = 'NEW_MESSAGE'
}

export class MessageBO {
  public async loadMessages(userKey : string, fkCompany: string){
    let sql = ' SELECT MESSAGE.KEY,                                '+
              ' MESSAGE.FKCOMPANY,                                 '+
              ' MESSAGE.FKUSER,                                    '+
              ' USER_CONTACT.NAME,                                 '+
              ' USER_CONTACT.PHONE,                                '+
              ' MESSAGE.FKUSER_CONTACT,                            '+
              ' MESSAGEITEM.MESSAGE,                               '+
              ' MESSAGEITEM.DATETIME_MESSAGE,                      '+
              ' MESSAGEITEM.SEND_BY,                               '+
              ' MESSAGEITEM.READ                                   '+
              ' FROM MESSAGE, MESSAGEITEM, USER AS USER_CONTACT    '+
              ' WHERE MESSAGE.STATUS = 1                           '+
              ' AND   MESSAGE.FKUSER    = ?                        '+
              ' AND   MESSAGE.FKCOMPANY = ?                        '+
              ' AND   MESSAGEITEM.FKMESSAGE = MESSAGE.KEY          '+
              ' AND   MESSAGEITEM.STATUS    = 1                    '+
              ' AND   USER_CONTACT.KEY    = MESSAGE.FKUSER_CONTACT '+
              ' AND   USER_CONTACT.STATUS = 1                      '+
              ' ORDER BY MESSAGE.KEY, MESSAGEITEM.DATETIME_MESSAGE ';

    let messages : any = await SequelizeORM.getInstance().getSequelizeORM().query(sql, {replacements: [userKey, fkCompany], type: QueryTypes.SELECT});

    let messageResult : any = [];

    let messageObject = this.createEmptyMessageObject();

    let key = '';
    for (const message of messages){
      if (StringUtils.isEmpty(key) || !StringUtils.equals(message.KEY, key)){
        key = message.KEY;

        messageObject = this.createEmptyMessageObject();

        messageObject.Key            = message.KEY           ;
        messageObject.Name           = message.NAME          ;
        messageObject.Phone          = message.PHONE         ;
        messageObject.FkUser_Contact = message.FKUSER_CONTACT;

        let messageItem = {
          Message: message.MESSAGE,
          DateTime_Message: message.DATETIME_MESSAGE,
          Read: message.READ
        }

        messageObject.Messages.push(messageItem);

        messageResult.push(messageObject);

        continue;
      }

      if (StringUtils.equals(message.KEY, key)){
        let messageItem = {
          Message: message.MESSAGE,
          DateTime_Message: message.DATETIME_MESSAGE,
          Read: message.READ
        }

        messageObject.Messages.push(messageItem);
      }
    }

    return messageResult;
  }

  private createEmptyMessageObject(){
    return {
      Key: '',
      Name: '',
      Phone: '',
      FkUser_Contact: '',
      Messages: []
    }
  }

  public saveMessages(message){

  }
}