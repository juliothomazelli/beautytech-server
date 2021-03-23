import { Response, Params, Controller, Get, attachControllers, Middleware, Post, Request, Patch, Put} from '@decorators/express';
import { PrivateMiddleware } from '../middleware/private.middleware';
import { UserMiddleware } from "../middleware/user.middleware";
import { Company } from '../model/company.model';
import { ObjectUtils } from '../utils/ObjectUtils';
import { StringUtils } from '../utils/StringUtils';
import { UIID } from '../utils/Uiid';

@Controller('/company', null, [PrivateMiddleware, UserMiddleware])
export class CompanyAction {

  @Get('/')
  public async Load(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.query.key)){
      response.send();
      return;  
    }

    let company : any = {};

    company.Key    = response.req.query.key;
    company.Status = 1;

    let result = await Company.findOne({where: company, raw: true});

    response.send(result);
  }

  @Post('/')
  public async Save(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body)){
      return;
    }

    let company = new Company();

    company.Key          = UIID.generate()               ;
    company.Fantasy_Name = response.req.body.Fantasy_Name;
    company.Company_Name = response.req.body.Company_Name;
    company.Phone        = response.req.body.Phone       ;
    company.Address      = response.req.body.Address     ;
    company.City         = response.req.body.City        ;
    company.District     = response.req.body.District    ;
    company.Is_Open      = response.req.body.Is_Open     ;
    company.Zipcode      = response.req.body.Zipcode     ;
    company.Status       = 1                             ;

    await company.save();

    let result = await Company.findOne({where: {Key: company.Key}, raw: true});
    
    response.send(result);
  }

  @Put('/')
  public async Update(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body) || (StringUtils.isEmpty(response.req.body.Key))){
      return;
    }

    let company : any = {};

    company.Fantasy_Name = response.req.body.Fantasy_Name;
    company.Company_Name = response.req.body.Company_Name;
    company.Phone        = response.req.body.Phone       ;
    company.Address      = response.req.body.Address     ;
    company.City         = response.req.body.City        ;
    company.District     = response.req.body.District    ;
    company.Is_Open      = response.req.body.Is_Open     ;
    company.Zipcode      = response.req.body.Zipcode     ;
    
    await Company.update(company, {where: {Key: response.req.body.Key, Status: 1}});

    let result = await Company.findOne({where: {Key: response.req.body.Key}, raw: true});

    response.send(result);
  }

  @Patch('/')
  public async Delete(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body.Key)){
      return;
    }

    await Company.update({Status: 2}, {where: {Key: response.req.body.Key}});

    response.send({Key: response.req.body.Key});
  }
}