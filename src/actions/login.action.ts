import { Controller, Get, Post, Request, Response } from "@decorators/express";
import { Authentication } from "../authentication/authentication";
import { LoginMiddleware } from "../middleware/login.middleware";
import { PublicMiddleware } from "../middleware/public.middleware";
import { User } from "../model/user.model";
import { BooleanUtils } from "../utils/BooleanUtils";
import { ObjectUtils } from "../utils/ObjectUtils";
import { PasswordHashUtils } from "../utils/PasswordHashUtils";
import { StringUtils } from "../utils/StringUtils";

@Controller('/login', null, [PublicMiddleware, LoginMiddleware])
export class LoginAction {
  @Post('/')
  public async Login(@Response() response, @Request() request){
    let user : any = {};

    user.Email    = response.req.body.Email        ;
    user.Status   = BooleanUtils.booleanToInt(true);

    let result = await User.findOne({where: user, raw: true});

    if (ObjectUtils.isNullOrUndefined(result)){
      response.status(404).send({error: '0004', message: 'User not found.'});
      return;
    }

    if (!PasswordHashUtils.IsValid(response.req.body.Password, result.Password)){
      response.status(404).send({error: '0006', message: 'Email or Password incorrect.'});
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

    let userResult = {
      Key: result.Key,
      Name: result.Name,
      Type: result.Type,
      FkCompany: result.FkCompany,
      Token: token
    }

    response.send(userResult);
  }
}