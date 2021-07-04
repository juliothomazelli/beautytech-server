import { Sequelize } from "sequelize-typescript";
import { DataBaseConfig } from "../database/database.config";
import { Company } from "../model/company.model";
import { CompanyGroup } from "../model/companygroup.model";
import { Message } from "../model/message.model";
import { MessageItem } from "../model/messageitem.model";
import { Notification } from "../model/notification.model";
import { Schedule } from "../model/schedule.model";
import { Service } from "../model/service.model";
import { User, UserType } from "../model/user.model";
import { UserPermission } from "../model/userpermission.model";
import { BooleanUtils } from "../utils/BooleanUtils";
import { PasswordHashUtils } from "../utils/PasswordHashUtils";
import { SQLQueryUtils } from "../utils/SQLQueryUtils";

export class SequelizeORM {
  private static instance : SequelizeORM;
  private sequelize : Sequelize;
  private dataInsert = false;

  public async createORM() {
    this.sequelize = new Sequelize(DataBaseConfig.getDataBase(), DataBaseConfig.getUserName(), DataBaseConfig.getPassword(), {
      host: DataBaseConfig.getHost(),
      dialect: 'mysql',
      models: [User, Company, Notification, Schedule, Service, UserPermission, Message, MessageItem, CompanyGroup],
      define:{
        freezeTableName: true
      }
    });
    
    this.sequelize.authenticate().then(async () => {
      try {
        await this.sequelize.sync({force: false});

        if (this.dataInsert){
          this.insertLocalhostDataTest();
        }
      } catch (error) {
        console.log(error.message);
      }
    }).catch((error) => {
      console.error('Deu erro ao criar a ORM!', error);
    });
  }

  private insertLocalhostDataTest(){
    let companygroup = [
      {
        Name: 'Thomazelli lazarotto Beauty Ltda.'
      }
    ]

    SQLQueryUtils.UpdateOrInsertListToTable(companygroup, new CompanyGroup()).then(async () => {
      let companygroup = await CompanyGroup.findAll({ where: {Status : BooleanUtils.TRUE}, raw: true });

      let company = [
        {
          Fantasy_Name: 'Salao de beleza masculina',
          Company_Name: 'Salao do ju',
          Phone: '47999459332',
          Address: 'Arthur Guinter',
          City: 'Jaraguá do sul',
          District: 'Amizade',
          Is_Open: BooleanUtils.TRUE,
          Zipcode: '89255580',
          FkCompanyGroup: companygroup[0].Key,
          Domain: 'salaoju'
        },
        {
          Fantasy_Name: 'Salao de beleza de feminina',
          Company_Name: 'Salao do dê',
          Phone: '47999459331',
          Address: 'Joao Januario Ayroso',
          City: 'Jaraguá do sul',
          District: 'Rau',
          Is_Open: BooleanUtils.TRUE,
          Zipcode: '89255570',
          FkCompanyGroup: companygroup[0].Key,
          Domain: 'salaode'
        }
      ]

      SQLQueryUtils.UpdateOrInsertListToTable(company, new Company()).then(async () => {
        let companies = await Company.findAll({ where: {Status : BooleanUtils.TRUE}, raw: true});

        let service = [
          {
            FkCompany: companies[0].Key,
            Name: 'Corte masculino',
            Note: 'Um corte de cabelo masculino.',
            Price: 20,
            Icon_Name: '',
            Enabled: BooleanUtils.TRUE,
            Status: BooleanUtils.TRUE
          },
          {
            FkCompany: companies[0].Key,
            Name: 'Corte feminino',
            Note: 'Um corte de cabelo feminino.',
            Price: 30,
            Icon_Name: '',
            Enabled: BooleanUtils.TRUE,
            Status: BooleanUtils.TRUE
          },
          {
            FkCompany: companies[0].Key,
            Name: 'Luzes',
            Note: 'Luzes deixa o cabelo bem bonito e claro.',
            Price: 80,
            Icon_Name: '',
            Enabled: BooleanUtils.TRUE,
            Status: BooleanUtils.TRUE
          },
          {
            FkCompany: companies[1].Key,
            Name: 'Corte feminino',
            Note: 'Um corte de cabelo feminino.',
            Price: 35,
            Icon_Name: '',
            Enabled: BooleanUtils.TRUE,
            Status: BooleanUtils.TRUE
          },
          {
            FkCompany: companies[1].Key,
            Name: 'Corte masculino',
            Note: 'Um corte de cabelo masculino.',
            Price: 25,
            Icon_Name: '',
            Enabled: BooleanUtils.TRUE,
            Status: BooleanUtils.TRUE
          }
        ]

        SQLQueryUtils.UpdateOrInsertListToTable(service, new Service()).catch(() => {
          console.error('Erro na criação dos dados de serviço');
        });

        let user = [
          {
            Name: 'Julio Thomazelli',
            Type: UserType.ADMIN,
            Id: 123,
            Password: PasswordHashUtils.ToHash('julio123'),
            Phone: '47996395743',
            Email: 'juliothomazelli@gmail.com',
            FkCompany: ''
          },
          {
            Name: 'Juliano',
            Type: UserType.USER,
            Id: 456,
            Password: PasswordHashUtils.ToHash('juliano123'),
            Phone: '4799641599',
            Email: 'julianothomazelli@gmail.com',
            FkCompany: companies[0].Key
          },
          {
            Name: 'Lucas Goncalves',
            Type: UserType.FINAL_USER,
            Id: 999,
            Password: PasswordHashUtils.ToHash('lucas123'),
            Phone: '47996853423',
            Email: 'lucasgoncalves@gmail.com',
            FkCompany: companies[0].Key
          },
          {
            Name: 'Deisy Lazarotto Thomazelli',
            Type: UserType.USER,
            Id: 521,
            Password: PasswordHashUtils.ToHash('deisy123'),
            Phone: '4799641598',
            Email: 'deisylazarotto@gmail.com',
            FkCompany: companies[1].Key
          },
          {
            Name: 'Natalia Carlini',
            Type: UserType.FINAL_USER,
            Id: 789,
            Password: PasswordHashUtils.ToHash('natalia123'),
            Phone: '47997128770',
            Email: 'nataliacarlini@gmail.com',
            FkCompany: companies[1].Key
          }
        ]

        SQLQueryUtils.UpdateOrInsertListToTable(user, new User()).then(() => {
          
        }).catch(() => {
          console.error('Erro na criação dos dados de user');
        });
      }).catch(() => {
        console.error('Erro na criação dos dados de company');
      });
    }).catch(() => {
      console.error('Erro na criação dos dados do companygroup');
    });
  }

  public static getInstance() : SequelizeORM {
    if (!SequelizeORM.instance) {
      SequelizeORM.instance = new SequelizeORM();
    }

    return SequelizeORM.instance;
  }

  public getSequelizeORM() : Sequelize {
      return this.sequelize;
  }
}