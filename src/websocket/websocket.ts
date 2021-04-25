import WebSocket from 'ws';
import { ChatMessageBO } from '../bo/chatmessage.bo';
import { Message } from '../model/message.model';
import { ObjectUtils } from '../utils/ObjectUtils';

export enum MessageTypes {
  LOAD_MESSAGES = 'LOAD_MESSAGES',
  NEW_MESSAGE   = 'NEW_MESSAGE'
}

export class WebSocketUtils{
  private static instance : WebSocketUtils;
  private clients         : any = [];

  public async registerWebSocket(){
    const wss = new WebSocket.Server({port: 8080});

    wss.on('connection', (ws, req) => {
      let client = {
        Key: req.url.slice(6, req.url.indexOf('&')), 
        FkCompany: req.url.slice(49, req.url.length), 
        Ws: ws
      };

      this.clients.push(client);

      let message : any = {
        Type: MessageTypes.LOAD_MESSAGES,
        Messages : []
      }

      new ChatMessageBO().loadMessages(client.Key, client.FkCompany).then((response) => {
        if (ObjectUtils.isNullOrUndefined(response)){
          return;
        }

        message.Messages = response;

        ws.send(JSON.stringify(message));
      }).catch((error) => {
        ws.close(error);
      });
      
      ws.on('message', (message) => {
        let messageResult = JSON.parse(message.toString());

        if (messageResult.Type == MessageTypes.NEW_MESSAGE){
          new ChatMessageBO().saveMessages(messageResult).then((response : any) => {
            let resultSend_by = {
              Type: MessageTypes.NEW_MESSAGE,
              Message: response.Send_by
            }

            ws.send(JSON.stringify(resultSend_by));

            for (const client of this.clients){
              if (client.Key !== response.FkUser_Contact){
                continue;
              }

              let resultUserContact = {
                Type: MessageTypes.NEW_MESSAGE,
                Message: response.User_Contact
              }

              client.Ws.send(JSON.stringify(resultUserContact));
            }

          }).catch((error) => {
            ws.close(error);
          });
        }
      });
    
      ws.on('open', (message: WebSocket.Data) => {
        
      });

      ws.on('close', (ws: WebSocket) => {
        this.clients.splice(this.clients.indexOf(ws), 1);
      });
      
    });
  }

  public static getInstance() : WebSocketUtils{
    if (!WebSocketUtils.instance) {
      WebSocketUtils.instance = new WebSocketUtils();
    }

    return WebSocketUtils.instance;
  }
}