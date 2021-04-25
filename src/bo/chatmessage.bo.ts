import { QueryTypes } from "sequelize";
import { Message } from "../model/message.model";
import { MessageItem } from "../model/messageitem.model";
import { SequelizeORM } from "../sequelize/sequelize";
import { BooleanUtils } from "../utils/BooleanUtils";
import { ObjectUtils } from "../utils/ObjectUtils";
import { StringUtils } from "../utils/StringUtils";
import { UIID } from "../utils/Uiid";

export class ChatMessageBO {
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
        messageObject.FkUser         = message.FKUSER        ;

        let messageItem = {
          Message: message.MESSAGE,
          DateTime_Message: message.DATETIME_MESSAGE,
          Read: message.READ,
          Send_By: message.SEND_BY
        }

        messageObject.Messages.push(messageItem);

        messageResult.push(messageObject);

        continue;
      }

      if (StringUtils.equals(message.KEY, key)){
        let messageItem = {
          Message: message.MESSAGE,
          DateTime_Message: message.DATETIME_MESSAGE,
          Read: message.READ,
          Send_By: message.SEND_BY
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
      FkUser: '',
      Messages: []
    }
  }

  public async saveMessages(messageRequest){
    let message = await Message.findOne({where: {FkUser: messageRequest.FkUser, Status: BooleanUtils.booleanToInt(true)}, raw: true});

    if (ObjectUtils.isNullOrUndefined(message)){
      let message = new Message();

      message.Key = UIID.generate();

      message.FkCompany      = messageRequest.FkCompany        ;
      message.FkUser         = messageRequest.FkUser           ;
      message.FkUser_Contact = messageRequest.FkUser_Contact   ;
      message.Status         = BooleanUtils.booleanToInt(true);

      await message.save();
    }

    let messageitem = new MessageItem();

    messageitem.Key              = UIID.generate()                 ;
    messageitem.FkMessage        = message.Key                     ;
    messageitem.Message          = messageRequest.Message          ;
    messageitem.DateTime_Message = new Date()                      ;
    messageitem.Read             = BooleanUtils.booleanToInt(false) ;
    messageitem.Status           = BooleanUtils.booleanToInt(true) ;
    messageitem.Send_By          = messageRequest.FkUser           ;

    await messageitem.save();

    let messageUserContact = await Message.findOne({where: {FkUser: messageRequest.FkUser_Contact, Status: BooleanUtils.booleanToInt(true)}, raw: true});

    if (ObjectUtils.isNullOrUndefined(messageUserContact)){
      messageUserContact = new Message();

      messageUserContact.Key = UIID.generate();

      messageUserContact.FkCompany      = messageRequest.FkCompany       ;
      messageUserContact.FkUser         = messageRequest.FkUser_Contact  ;
      messageUserContact.FkUser_Contact = messageRequest.FkUser          ;
      messageUserContact.Status         = BooleanUtils.booleanToInt(true);

      await messageUserContact.save();
    }

    let messageitemUserContact = new MessageItem();

    messageitemUserContact.Key              = UIID.generate()                 ;
    messageitemUserContact.FkMessage        = messageUserContact.Key          ;
    messageitemUserContact.Message          = messageRequest.Message          ;
    messageitemUserContact.DateTime_Message = new Date()                      ;
    messageitemUserContact.Read             = BooleanUtils.booleanToInt(true);
    messageitemUserContact.Status           = BooleanUtils.booleanToInt(true) ;
    messageitemUserContact.Send_By          = messageRequest.FkUser           ;

    await messageitemUserContact.save();

    let result = {
      Send_by: await MessageItem.findOne({where: {Key: messageitem.Key}, raw: true}),
      User_Contact: await MessageItem.findOne({where: {Key: messageitemUserContact.Key}, raw: true}),
      FkUser_Contact: messageRequest.FkUser_Contact
    }

    return result;
  }
}