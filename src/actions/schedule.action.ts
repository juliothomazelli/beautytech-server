import { Controller, Get, Response, Request, Post, Put, Patch } from "@decorators/express";
import { response } from "express";
import { QueryTypes } from "sequelize";
import { ExceptionErrorTypes, ExceptionService } from "../error/exception.service";
import { PrivateMiddleware } from "../middleware/private.middleware";
import { Schedule } from "../model/schedule.model";
import { SequelizeORM } from "../sequelize/sequelize";
import { BooleanUtils } from "../utils/BooleanUtils";
import { DateUtils } from "../utils/DateUtils";
import { ObjectUtils } from "../utils/ObjectUtils";
import { StringUtils } from "../utils/StringUtils";
import { UIID } from "../utils/Uiid";

@Controller('/schedule', null, [PrivateMiddleware])
export class ScheduleAction {
  @Post('/load')
  public async LoadDaySchedule(@Response() response, @Request() request){
    let select = `select  s.Key,
                          s.Description,
                          s.FkCompany,
                          s.FkUser_Scheduled_By,
                          s.FkCustomer,
                          s.FkService,
                          s.Scheduled_Date,
                          s.Note,
                          s.Status
                  from schedule s
                  where s.fkcompany = ?
                    and s.Scheduled_Date between ? and ?
                    and s.Status = 1 
                  order by s.Scheduled_Date `;

    let initialDate = DateUtils.formatDateTime(new Date(response.req.body.schedule.atomicDay));
    let finalDate   = DateUtils.formatDateTime(new Date(response.req.body.schedule.atomicDay), false);

    let schedules : any = await SequelizeORM.getInstance().getSequelizeORM().query(select, {replacements: [response.req.body.fkcompany, initialDate, finalDate], type: QueryTypes.SELECT});

    if (ObjectUtils.isNullOrUndefined(schedules)){
      return ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0010, true, response);
    }

    let result = response.req.body.schedule;

    for (const item of result.hourList){
      for (const schedule of schedules){
        if (item.hour != DateUtils.formatDateTime(schedule.Scheduled_Date).substring(11, 16)){
          continue;
        }

        item.serviceList.push(schedule);
      }
    }

    return response.send(result);
  }
}