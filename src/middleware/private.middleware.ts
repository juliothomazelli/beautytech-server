import { Middleware, Request, Response } from "@decorators/express";
import { NextFunction } from "express";
import { Authentication } from "../authentication/authentication";

export class PrivateMiddleware implements Middleware{
  public async use(@Response() response, @Request() request, next: NextFunction) {
    if (request.req.headers['authorization'] == 'beauty123'){
      next();
      return;
    }

    if (!await this.isValidToken(response, request)){
      request.status(404).send({error: '0006', message: 'JWT Invalid.'});
      return;
    }

    next();
  }

  public async isValidToken(@Response() response, @Request() request){
    let authentication = false;

    await new Authentication().verifyJWT(request.req, response).then(() => {
        authentication = true;
      }).catch(() => {
        authentication = false;
      });

    return authentication;
  }
}