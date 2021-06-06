import { Controller, Get, Response, Request, Post, Put, Patch } from "@decorators/express";
import { response } from "express";
import { QueryTypes } from "sequelize";
import { ExceptionErrorTypes, ExceptionService } from "../error/exception.service";
import { PrivateMiddleware } from "../middleware/private.middleware";
import { Schedule } from "../model/schedule.model";
import { SequelizeORM } from "../sequelize/sequelize";
import { BooleanUtils } from "../utils/BooleanUtils";
import { ObjectUtils } from "../utils/ObjectUtils";
import { StringUtils } from "../utils/StringUtils";
import { UIID } from "../utils/Uiid";

@Controller('/schedule', null, [PrivateMiddleware])
export class ScheduleAction {
  @Get('/key')
  public async LoadByKey(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.query.key) || StringUtils.isEmpty(response.req.query.key)){
      ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0008, true, response);
      return;
    }

    let schedule : any = {};

    schedule.Key    = response.req.query.key;
    schedule.Status = BooleanUtils.TRUE     ;

    let result : any = await Schedule.findOne({where: schedule, raw: true});

    if (ObjectUtils.isNullOrUndefined(result)){
      result = [];
    }

    response.send(result);
  }

  @Post('/')
  public async Save(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body)){
      ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0008, true, response);
      return;
    }

    ObjectUtils.verifyProperty(response.req.body, 'Note', '');
    ObjectUtils.verifyProperty(response.req.body, 'FkCustomer', '');
    ObjectUtils.verifyProperty(response.req.body, 'FkService', '');

    let schedule = new Schedule();

    schedule.Key            = UIID.generate()                 ;
    schedule.Note           = response.req.body.Note          ;
    schedule.Description    = response.req.body.Description   ;
    schedule.Status         = BooleanUtils.TRUE               ;
    schedule.Scheduled_Date = response.req.body.Scheduled_Date;
    schedule.FkCompany      = response.req.body.FkCompany     ;
    schedule.FkCustomer     = response.req.body.FkCustomer    ;
    schedule.FkService      = response.req.body.FkService     ;

    await schedule.save();

    let result = await Schedule.findOne({where: {Key: schedule.Key}});

    response.send(result);
  }

  @Put('/')
  public async Update(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body) || (StringUtils.isEmpty(response.req.body.Key))){
      return;
    }

    let schedule : any = {};

    schedule.Key            = response.req.body.Key           ;
    schedule.Note           = response.req.body.Note          ;
    schedule.Description    = response.req.body.Description   ;
    schedule.Scheduled_Date = response.req.body.Scheduled_Date;
    schedule.FkCompany      = response.req.body.FkCompany     ;
    schedule.FkCustomer     = response.req.body.FkCustomer    ;
    schedule.FkService      = response.req.body.FkService     ;
    
    await Schedule.update(schedule, {where: {Key: response.req.body.Key, Status: 1}});

    let result = await Schedule.findOne({where: {Key: response.req.body.Key}, raw: true});

    response.send(result);
  }

  @Patch('/')
  public async Delete(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body)){
      return;
    }

    await Schedule.update({Status: 2}, {where: {Key: response.req.body.Key}});

    response.send({Key: response.req.body.Key});
  }
}