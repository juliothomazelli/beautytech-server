import { Middleware } from '@decorators/express';
import { NextFunction } from 'express';
import { Response, Request} from '@decorators/express';
import { HttpMethodsTypes } from '../base/server';
import { StringUtils } from '../utils/StringUtils';
import { ObjectUtils } from '../utils/ObjectUtils';

export class LoginMiddleware implements Middleware {
  public use(@Response() response, @Request() request, next: NextFunction): void {
    if (!this.validationCommon(response, request)){
      return;
    }

    next();
  }

  public validationCommon(@Response() response, @Request() request) : boolean{
    if (response.method != HttpMethodsTypes.POST){
      request.status(404).send({error: '0001', message: 'Http Method must be POST.'});
      return false;
    }

    if (!response.body.hasOwnProperty('Email') || !response.body.hasOwnProperty('Password')){
      request.status(404).send({error: '0002', message: 'Property Email or Password not found.'});
      return false;
    }

    if (StringUtils.isEmpty(response.body.Email) || StringUtils.isEmpty(response.body.Password)){
      request.status(404).send({error: '0003', message: 'Property Email or Password is empty.'});
      return false;
    }

    return true;
  }
}