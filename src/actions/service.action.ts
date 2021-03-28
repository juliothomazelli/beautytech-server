import { Controller, Get, Response, Request, Post, Patch } from "@decorators/express";
import { response } from "express";
import { ExceptionErrorTypes, ExceptionService } from "../error/exception.service";
import { PrivateMiddleware } from "../middleware/private.middleware";
import { PublicMiddleware } from "../middleware/public.middleware";
import { Service } from "../model/service.model";
import { BooleanUtils } from "../utils/BooleanUtils";
import { ObjectUtils } from "../utils/ObjectUtils";
import { SQLQueryUtils } from "../utils/SQLQueryUtils";

@Controller('/service', null, [PrivateMiddleware])
export class ServiceAction {
  @Get('/')
  public async LoadList(@Response() response, @Request() request) {
    if (ObjectUtils.isNullOrUndefined(response.req.query.fkuser) || ObjectUtils.isNullOrUndefined(response.req.query.fkcompany)) {
      response.send();
      return;
    }

    let service: any = {};

    service.FkUser    = response.req.query.fkuser;
    service.FkCompany = response.req.query.fkcompany;
    service.Status    = BooleanUtils.TRUE;

    let result = await Service.findAll({ where: service, raw: true });

    response.send(result);
  }

  @Post('/')
  public async Save(@Response() response, @Request() request) {
    if (ObjectUtils.isNullOrUndefined(response.req.body) || ObjectUtils.isEmptyArray(response.req.body)) {
      return;
    }

    SQLQueryUtils.UpdateOrInsertListToTable(response.req.body, new Service()).then(() => {
      response.send({success: true});
    }).catch(() => {
      ExceptionService.CreateAPIException(ExceptionErrorTypes.E_0007, true, response);
    });
  }

  @Patch('/')
  public async Delete(@Response() response, @Request() request) {
    if (ObjectUtils.isNullOrUndefined(response.req.body.Key)) {
      return;
    }

    await Service.update({Status: 2}, { where: {Key: response.req.body.Key}});

    response.send({ Key: response.req.body.Key });
  }
}