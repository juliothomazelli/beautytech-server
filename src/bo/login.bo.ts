import { Controller, Get, Post, Request, Response } from "@decorators/express";
import { SequelizeORM } from "../sequelize/sequelize";
import { ObjectUtils } from "../utils/ObjectUtils";
import { QueryTypes } from "sequelize";

export class LoginBO {
  private response : any;
  private request  : any;

  constructor(@Response() response = undefined, @Request() request = undefined){
    this.response = response;
    this.request  = request ;
  }

  public async login(){
    if (ObjectUtils.isNullOrUndefined(this.response)){
      return;
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

    SequelizeORM.getInstance().getSequelizeORM().query(select, {replacements: [domain], type: QueryTypes.SELECT});
  }
}