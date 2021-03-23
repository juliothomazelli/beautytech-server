import { Controller, Get, Post, Request, Response } from "@decorators/express";
import { Authentication } from "../authentication/authentication";
import { LoginMiddleware } from "../middleware/login.middleware";
import { PublicMiddleware } from "../middleware/public.middleware";
import { User } from "../model/user.model";
import { ObjectUtils } from "../utils/ObjectUtils";
import { StringUtils } from "../utils/StringUtils";

@Controller('/login', null, [PublicMiddleware, LoginMiddleware])
export class LoginAction {
  @Post('/')
  public async Login(@Response() response, @Request() request){
    let user : any = {};

    user.Email    = response.req.body.Email   ;
    user.Password = response.req.body.Password;

    let result = await User.findOne({where: user, raw: true});

    if (ObjectUtils.isNullOrUndefined(result)){
      response.status(404).send({error: '0004', message: 'User not found.'});
      return;
    }

    let token = '';

    if (!ObjectUtils.isNullOrUndefined(result) && StringUtils.isNotEmpty(result.Key)){
      let authentication = new Authentication();

      token = authentication.signJWT(result.Key);
    }

    if (StringUtils.isEmpty(token)){
      response.status(404).send({error: '0005', message: 'Problem when realizing authentication.'});
      return;
    }

    response.send({token: token});
  }
}