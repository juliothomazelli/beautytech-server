import { Middleware } from '@decorators/express';
import { NextFunction } from 'express';
import { Response, Request} from '@decorators/express';
import { HttpMethodsTypes } from '../base/server';
import { StringUtils } from '../utils/StringUtils';
import { ObjectUtils } from '../utils/ObjectUtils';
import { UserIO } from '../io/user.io';
 
export class UserMiddleware implements Middleware {
  public use(@Response() response, @Request() request, next: NextFunction): void {
    // this.validationCommon(response, request);
    next();
  }
  
  private validationCommon(@Response() response, @Request() request){    
    if (response.method == HttpMethodsTypes.GET){
      this.isValidGET();
    }

    if (response.method == HttpMethodsTypes.POST){
      if (!this.isValidPOST(response.req.body)){
        //? Subir exceção
      }
    }

    if (response.method == HttpMethodsTypes.PUT){
      this.isValidPUT(response.req.body);
    }

    if (response.method == HttpMethodsTypes.PATCH){
      this.isValidPATCH(response.req.body);
    }
  }

  private isValidGET(){
    //? Aqui vai algum código ainda, só não sei qual kkkk
  }

  private isValidPOST(body) : boolean{
    let userIO : UserIO = this.objectRequestIsValid(body);

    if (ObjectUtils.isNullOrUndefined(userIO)){
      return false;
    }

    if (StringUtils.isEmpty(userIO.Name)){
      return false
    }
  }

  private isValidPUT(body){
    this.objectRequestIsValid(body);

  }

  private isValidPATCH(body){
    this.objectRequestIsValid(body);

  }

  private objectRequestIsValid(body) : UserIO{
    if(ObjectUtils.isNullOrUndefined(body)){
      return null;
    }
  }

}