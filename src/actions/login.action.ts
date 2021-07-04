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

    let result = loginBO.login();

    // let domain = response.req.body.Email.substring(response.req.body.Email.indexOf('@') + 1, response.req.body.Email.length);

    // let select = `SELECT  C.Key,
    //                       C.FkCompanyGroup,
    //                               C.Fantasy_Name,
    //                               C.Company_Name,
    //                               C.Phone,
    //                               C.Address,
    //                               C.City,
    //                               C.District,
    //                               C.Is_Open,
    //                               C.Status,
    //                               C.ZipCode,
    //                               C.Domain,
    //                               CG.Key as CompanyGroupKey,
    //                               CG.Name as CompanyGroupName,
    //                               CG.Status as CompanyGroupStatus
    //                   from company C
    //                   inner join companygroup CG on CG.Key = C.FkCompanyGroup
    //                   where C.Domain = ? `;

    // let sessionInfo : any = await SequelizeORM.getInstance().getSequelizeORM().query(select, {replacements: [domain], type: QueryTypes.SELECT});
    // let user : any = {};

    // user.Email    = response.req.body.Email        ;
    // user.Status   = BooleanUtils.booleanToInt(true);

    // let result = await User.findOne({where: user, raw: true});

    // if (ObjectUtils.isNullOrUndefined(result)){
    //   response.status(404).send({error: '0004', message: 'User not found.'});
    //   return;
    // }

    // if (!PasswordHashUtils.IsValid(response.req.body.Password, result.Password)){
    //   response.status(404).send({error: '0006', message: 'Email or Password incorrect.'});
    //   return;
    // }

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