import { Controller, Get, Post, Request, Response } from "@decorators/express";
import { SequelizeORM } from "../sequelize/sequelize";
import { ObjectUtils } from "../utils/ObjectUtils";
import { QueryTypes } from "sequelize";
import { BooleanUtils } from "../utils/BooleanUtils";
import { User } from "../model/user.model";
import { PasswordHashUtils } from "../utils/PasswordHashUtils";
import { ExceptionErrorTypes, ExceptionService } from "../error/exception.service";
import { StringUtils } from "../utils/StringUtils";
import { Authentication } from "../authentication/authentication";

export class LoginBO {
  private response : any;
  private request  : any;

  constructor(@Response() response = undefined, @Request() request = undefined){
    this.response = response;
    this.request  = request ;
  }

  public async login(){
    if (ObjectUtils.isNullOrUndefined(this.response)){
      return ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0005, true, this.response);
    }
    
    let domain = this.response.req.body.Email.substring(this.response.req.body.Email.indexOf('@') + 1, this.response.req.body.Email.length);

    let select = `SELECT  C.Key,
                          C.FkCompanyGroup,
                          C.Fantasy_Name,
                          C.Company_Name,
                          C.Phone,
                          C.Address,
                          C.City,
                          C.District,
                          C.Is_Open,
                          C.Status,
                          C.ZipCode,
                          C.Domain,
                          CG.Key as CompanyGroupKey,
                          CG.Name as CompanyGroupName,
                          CG.Status as CompanyGroupStatus
                      from company C
                      inner join companygroup CG on CG.Key = C.FkCompanyGroup
                      where C.Domain = ?`

    let companyData : any = await SequelizeORM.getInstance().getSequelizeORM().query(select, {replacements: [domain], type: QueryTypes.SELECT});

    if (ObjectUtils.isEmptyArray(companyData) || companyData.length != 1){
      return ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0009, true, this.response);
    }

    companyData = companyData[0];

    let user : any = {};

    user.Email     = this.response.req.body.Email   ;
    user.FkCompany = companyData.Key                ;
    user.Status    = BooleanUtils.booleanToInt(true);

    let userData = await User.findOne({where: user, raw: true});

    if (ObjectUtils.isNullOrUndefined(userData)){
      return ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0009, true, this.response);
    }

    if (!PasswordHashUtils.IsValid(this.response.req.body.Password, userData.Password)){
      return ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0009, true, this.response);
    }

    let sessionData = {
      token: ''
    };

    if (!ObjectUtils.isNullOrUndefined(userData.Key) && StringUtils.isNotEmpty(userData.Key)){
      let authentication = new Authentication();

      sessionData.token = authentication.signJWT(userData.Key);
    }

    if (StringUtils.isEmpty(sessionData.token)){
      return ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0005, true, this.response);
    }

    delete userData.Password;

    return this.response.send({companyData: companyData, userData: userData, sessionData: sessionData});
  }
}