import * as jwt from 'jsonwebtoken';
import {Request, Response } from 'express';

export class Authentication {
  private secret : string = 'beautytech987654321'; //? Usado para assinar e verificar TOKEN

  constructor(){}

  signJWT(AUserKey : string){
    // ? Objeto contendo uma chave única para
    let payload = {
      Key: AUserKey
    }

    // ? Tempo que vai expirar o token
    let tokenExpires = {
      expiresIn : 36000
    }

    return jwt.sign(payload, this.secret, tokenExpires);
  }

  verifyJWT(req : Request, resp : Response) : Promise<any>{
    return new Promise (
      (resolve, reject) => {
        let token : any = req.headers['authorization'];

        jwt.verify(token, this.secret, (error : any, decoded : any) => {
          if (error){
            reject(error);
            return;
          }

          resolve(true);
        });
      }
    );
  }
}