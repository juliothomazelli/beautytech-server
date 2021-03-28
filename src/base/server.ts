import express = require("express");
import * as http from 'http';
import { attachControllers } from '@decorators/express';
import { UserAction } from '../actions/user.action';
import { SequelizeORM } from "../sequelize/sequelize";
import { CompanyAction } from "../actions/company.action";
import { LoginAction } from "../actions/login.action";
import { ScheduleAction } from "../actions/schedule.action";
import { ServiceAction } from "../actions/service.action";


var cors = require('cors');
var bodyParser = require('body-parser');

export class Server {
    private static instance : Server;

    private server : any = null;
    private app    : express.Application;

    private constructor(){
      this.app    = express();
      this.server = http.createServer(this.app);
    }

    public static getInstance() : Server{
        if (Server.instance == null || Server.instance == undefined){
            Server.instance = new Server();
        }

        return Server.instance;
    }

    public build() : void{
        this.prepareExpressApp();
    }

    private async prepareExpressApp() {
        this.app.use(cors({maxAge : 86400}));
        this.app.use(bodyParser.json());

        attachControllers(this.app, [UserAction, CompanyAction, LoginAction, ScheduleAction, ServiceAction]);           

        SequelizeORM.getInstance().createORM();
        // DatabaseConnection.getInstance().connect();
        
        // new Routes().registerRoutes(this.app);
    }

    public runExpressApp(port : number) : void {
        this.server.listen(port, () => {
            console.log('Server started at ' + port);
        });
    }

    public getExpressApp () : express.Application{
        return this.app;
    }
}

export enum HttpMethodsTypes {
  GET   = 'GET',
  POST  = 'POST',
  PUT   = 'PUT',
  PATCH = 'PATCH'
}