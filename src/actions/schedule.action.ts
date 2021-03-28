import { Controller, Get, Response, Request, Post, Put, Patch } from "@decorators/express";
import { response } from "express";
import { QueryTypes } from "sequelize";
import { PrivateMiddleware } from "../middleware/private.middleware";
import { Schedule } from "../model/schedule.model";
import { SequelizeORM } from "../sequelize/sequelize";
import { BooleanUtils } from "../utils/BooleanUtils";
import { ObjectUtils } from "../utils/ObjectUtils";
import { StringUtils } from "../utils/StringUtils";
import { UIID } from "../utils/Uiid";

@Controller('/schedule', null, [PrivateMiddleware])
export class ScheduleAction {
  @Get('/')
  public async LoadList(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.query.initial_date) || ObjectUtils.isNullOrUndefined(response.req.query.final_date) || ObjectUtils.isNullOrUndefined(response.req.query.fkcompany)){
      response.send();
      return;  
    }

    let sql = ' SELECT SCHEDULE.KEY,                                            '+
              ' SCHEDULE.FKCOMPANY,                                             '+
              ' SCHEDULE.FKSERVICE,                                             '+
              ' SCHEDULE.SCHEDULED_DATE,                                        '+
              ' SCHEDULE.FKUSER_SCHEDULED_BY,                                   '+
              ' SCHEDULE.FKCUSTOMER,                                            '+
              ' SCHEDULE.DESCRIPTION,                                           '+
              ' SCHEDULE.NOTE,                                                  '+
              ' COMPANY.COMPANY_NAME,                                           '+
              ' CUSTOMER.NAME AS CUSTOMER_NAME,                                 '+
              ' USER.NAME AS USER_NAME,                                         '+
              ' SERVICE.NAME AS SERVICE_NAME,                                   '+
              ' SERVICE.NOTE AS SERVICE_NOTE                                    '+
              ' FROM SCHEDULE                                                   '+
              ' LEFT JOIN USER AS CUSTOMER ON CUSTOMER.KEY = SCHEDULE.FKCUSTOMER'+
              '                   AND CUSTOMER.STATUS = 1                       '+
              ' INNER JOIN COMPANY ON COMPANY.KEY  = ?                          '+
              '                   AND COMPANY.STATUS = 1                        '+
              ' INNER JOIN USER ON USER.KEY = SCHEDULE.FKUSER_SCHEDULED_BY      '+
              '                 AND USER.STATUS = 1                             '+
              ' LEFT JOIN SERVICE ON SERVICE.KEY  = SCHEDULE.FKSERVICE          '+
              '                     AND SERVICE.STATUS = 1                      '+
              '   WHERE SCHEDULE.STATUS = 1                                     '+
              '     AND SCHEDULE.SCHEDULED_DATE >= ?                            '+
              '     AND SCHEDULE.SCHEDULED_DATE <= ?                            '+
              '   ORDER BY SCHEDULE.SCHEDULED_DATE                              ';

    let result = await SequelizeORM.getInstance().getSequelizeORM().query(sql, {replacements: [response.req.query.fkcompany, response.req.query.initial_date, response.req.query.final_date], type: QueryTypes.SELECT});

    response.send(result);
  }

  @Get('/key')
  public async LoadByKey(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.query.key) || StringUtils.isEmpty(response.req.query.key)){
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