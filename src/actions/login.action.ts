import { Controller, Get, Post, Request, Response } from "@decorators/express";
import { QueryTypes } from "sequelize";
import { Authentication } from "../authentication/authentication";
import { LoginBO } from "../bo/login.bo";
import { LoginMiddleware } from "../middleware/login.middleware";
import { PublicMiddleware } from "../middleware/public.middleware";
import { Company } from "../model/company.model";
import { User } from "../model/user.model";
import { SequelizeORM } from "../sequelize/sequelize";
import { BooleanUtils } from "../utils/BooleanUtils";
import { ObjectUtils } from "../utils/ObjectUtils";
import { PasswordHashUtils } from "../utils/PasswordHashUtils";
import { StringUtils } from "../utils/StringUtils";

@Controller('/login', null, [PublicMiddleware, LoginMiddleware])
export class LoginAction {
  @Post('/')
  public async Login(@Response() response, @Request() request){
    let loginBO = new LoginBO(response, request);

    return loginBO.login();
    
    

    

    // let token = '';

    // if (!ObjectUtils.isNullOrUndefined(result) && StringUtils.isNotEmpty(result.Key)){
    //   let authentication = new Authentication();

    //   token = authentication.signJWT(result.Key);
    // }

    // if (StringUtils.isEmpty(token)){
    //   response.status(404).send({error: '0005', message: 'Problem when realizing authentication.'});
    //   return;
    // }

    // let logonResult = {
    //   userInfo : {
    //     Key: result.Key,
    //     Name: result.Name,
    //     Type: result.Type,
    //     FkCompany: result.FkCompany
    //   },
    //   sessionInfo: {

    //   },
    //   sessionToken: token
    // }

    // response.send(logonResult);
  }
}