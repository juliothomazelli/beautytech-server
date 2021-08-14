import { Controller, Get, Response, Request, Post, Patch, Put } from "@decorators/express";
import { QueryTypes } from "sequelize";
import { ExceptionErrorTypes, ExceptionService } from "../error/exception.service";
import { PrivateMiddleware } from "../middleware/private.middleware";
import { Service } from "../model/service.model";
import { SequelizeORM } from "../sequelize/sequelize";
import { BooleanUtils } from "../utils/BooleanUtils";
import { ObjectUtils } from "../utils/ObjectUtils";
import { StringUtils } from "../utils/StringUtils";
import { UIID } from "../utils/Uiid";

@Controller('/service', null, [PrivateMiddleware])
export class ServiceAction {
  @Get('/')
  public async LoadList(@Response() response, @Request() request) {
    if (ObjectUtils.isNullOrUndefined(response.req.query.fkcompany)) {
      response.send();
      return;
    }

    let service: any = {};
    
    service.FkCompany = response.req.query.fkcompany;
    service.Status    = BooleanUtils.TRUE           ;

    let result = await Service.findAll({ where: service, raw: true });

    response.send(result);
  }

  @Get('/key')
  public async Load(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.query.key)) {
      response.send();
      return;
    }
    
    let service : any = {};

    service.Key    = response.req.query.key;
    service.Status = BooleanUtils.TRUE     ;

    let result = await Service.findOne({ where: service, raw: true });

    response.send(result);
  }

  @Post('/')
  public async Save(@Response() response, @Request() request) {
    if (ObjectUtils.isNullOrUndefined(response.req.body)) {
      ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0007, true, response);
      return;
    }
    
    let service = new Service();

    service.Key       = UIID.generate()             ;
    service.Name      = response.req.body.Name      ;
    service.Note      = response.req.body.Note      ;
    service.Status    = BooleanUtils.TRUE           ;
    service.Enabled   = response.req.body.Enabled   ;
    service.FkCompany = response.req.body.FkCompany ;
    service.Price     = response.req.body.Price     ;
    service.Icon_Name = response.req.body.Icon_Name ;

    await service.save();

    let result = await Service.findOne({where: {Key: service.Key}, raw: true});

    response.send(result);
  }

  @Put('/')
  public async Update(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body) || (StringUtils.isEmpty(response.req.body.Key))){
      ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0007, true, response);
      return;
    }

    let service : any = {};

    service.Name      = response.req.body.Name      ;
    service.Note      = response.req.body.Note      ;
    service.Enabled   = response.req.body.Enabled   ;
    service.Price     = response.req.body.Price     ;
    service.Icon_Name = response.req.body.Icon_Name ;
    
    await Service.update(service, {where: {Key: response.req.body.Key, Status: 1}});

    let result = await Service.findOne({where: {Key: response.req.body.Key}, raw: true});

    response.send(result);
  }

  @Patch('/')
  public async Delete(@Response() response, @Request() request) {
    if (ObjectUtils.isNullOrUndefined(response.req.body.Key)) {
      ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0007, true, response);
      return;
    }

    await Service.update({Status: 2}, { where: {Key: response.req.body.Key}});

    response.send({ Key: response.req.body.Key });
  }
}