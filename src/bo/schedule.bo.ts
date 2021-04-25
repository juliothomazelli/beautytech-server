import { SequelizeORM } from "../sequelize/sequelize";
import { DateUtils } from "../utils/DateUtils";
import { QueryTypes } from "sequelize";

export class ScheduleBO {
  public fkcompany : string;
  public month     : number;
  public year      : number;
  public daysMonth : any   ;

  constructor(fkcompany: string, month: number, year: number){
    this.fkcompany = fkcompany;
    this.month     = month    ;
    this.year      = year     ;
  }

  public LoadDaysOfMonth(){
    let numberDaysOfMonth = this.makeDaysOfMonth();

    return this.createDaysMonthObject(numberDaysOfMonth);
  }

  private makeDaysOfMonth(){
    let numberDaysOfMonth = DateUtils.getNumberDaysOfMonth(new Date(this.year, this.month));

    let result = [];

    for (let i = 0; i < numberDaysOfMonth; i++) {
      result.push(i + 1);
    }

    return result;
  }

  private createDaysMonthObject(daysOfMonth){
    let scheduleMonth : any = [];

    let initial_date = this.year + '-' + DateUtils.getMonth(this.month) + '-01 00:00:00';
    let final_date   = this.year + '-' + DateUtils.getMonth(this.month) + '-' + daysOfMonth.length + ' 23:59:00';

    // let scheduleMonthList = await this.LoadScheduleMonth(this.fkcompany, initial_date, final_date);
    
    for (const day of daysOfMonth){
      let schedule = {
        day: day,
        hourList: this.createHourOfDayList()
      }

      scheduleMonth.push(schedule);
    }

    return scheduleMonth;
  }

  private async makeHourServiceList(scheduleMonthList, day){
    let hours = this.createHourOfDayList();

    for (const hour of hours){
      for (const schedule of scheduleMonthList){
        if (day != DateUtils.formatDateTime(schedule.SCHEDULED_DATE).slice(8, 10)){
          continue;
        }

        if (hour.hour != DateUtils.formatDateTime(schedule.SCHEDULED_DATE).slice(11, 16)){
          continue;
        }

        hour.serviceList.push(schedule);
      }
    }
  }

  private async LoadScheduleMonth(fkCompany: string, initial_date: string, final_date: string){
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

    return await SequelizeORM.getInstance().getSequelizeORM().query(sql, {replacements: [fkCompany, initial_date, final_date], type: QueryTypes.SELECT});
  }

  private createHourOfDayList(){
    return [
      {
        hour: '00:00',
        serviceList: []
      },
      {
        hour: '00:15',
        serviceList: []
      },
      {
        hour: '00:30',
        serviceList: []
      },
      {
        hour: '00:45',
        serviceList: []
      },
      {
        hour: '01:00',
        serviceList: []
      },
      {
        hour: '01:15',
        serviceList: []
      },
      {
        hour: '01:30',
        serviceList: []
      },
      {
        hour: '01:45',
        serviceList: []
      },
      {
        hour: '02:00',
        serviceList: []
      },
      {
        hour: '02:15',
        serviceList: []
      },
      {
        hour: '02:30',
        serviceList: []
      },
      {
        hour: '02:45',
        serviceList: []
      },
      {
        hour: '03:00',
        serviceList: []
      },
      {
        hour: '03:15',
        serviceList: []
      },
      {
        hour: '03:30',
        serviceList: []
      },
      {
        hour: '03:45',
        serviceList: []
      },      
      {
        hour: '04:00',
        serviceList: []
      },
      {
        hour: '04:15',
        serviceList: []
      },
      {
        hour: '04:30',
        serviceList: []
      },
      {
        hour: '04:45',
        serviceList: []
      },      
      {
        hour: '05:00',
        serviceList: []
      },
      {
        hour: '05:15',
        serviceList: []
      },
      {
        hour: '05:30',
        serviceList: []
      },
      {
        hour: '05:45',
        serviceList: []
      },      
      {
        hour: '06:00',
        serviceList: []
      },
      {
        hour: '06:15',
        serviceList: []
      },
      {
        hour: '06:30',
        serviceList: []
      },
      {
        hour: '06:45',
        serviceList: []
      },      
      {
        hour: '07:00',
        serviceList: []
      },
      {
        hour: '07:15',
        serviceList: []
      },
      {
        hour: '07:30',
        serviceList: []
      },
      {
        hour: '07:45',
        serviceList: []
      },      
      {
        hour: '08:00',
        serviceList: []
      },
      {
        hour: '08:15',
        serviceList: []
      },
      {
        hour: '08:30',
        serviceList: []
      },
      {
        hour: '08:45',
        serviceList: []
      },      
      {
        hour: '09:00',
        serviceList: []
      },
      {
        hour: '09:15',
        serviceList: []
      },
      {
        hour: '09:30',
        serviceList: []
      },
      {
        hour: '09:45',
        serviceList: []
      },      
      {
        hour: '10:00',
        serviceList: []
      },
      {
        hour: '10:15',
        serviceList: []
      },
      {
        hour: '10:30',
        serviceList: []
      },
      {
        hour: '10:45',
        serviceList: []
      },      
      {
        hour: '11:00',
        serviceList: []
      },
      {
        hour: '11:15',
        serviceList: []
      },
      {
        hour: '11:30',
        serviceList: []
      },
      {
        hour: '11:45',
        serviceList: []
      },      
      {
        hour: '12:00',
        serviceList: []
      },
      {
        hour: '12:15',
        serviceList: []
      },
      {
        hour: '12:30',
        serviceList: []
      },
      {
        hour: '12:45',
        serviceList: []
      },      
      {
        hour: '13:00',
        serviceList: []
      },
      {
        hour: '13:15',
        serviceList: []
      },
      {
        hour: '13:30',
        serviceList: []
      },
      {
        hour: '13:45',
        serviceList: []
      },      
      {
        hour: '14:00',
        serviceList: []
      },
      {
        hour: '14:15',
        serviceList: []
      },
      {
        hour: '14:30',
        serviceList: []
      },
      {
        hour: '14:45',
        serviceList: []
      },      
      {
        hour: '15:00',
        serviceList: []
      },
      {
        hour: '15:15',
        serviceList: []
      },
      {
        hour: '15:30',
        serviceList: []
      },
      {
        hour: '15:45',
        serviceList: []
      },
            
      {
        hour: '16:00',
        serviceList: []
      },
      {
        hour: '16:15',
        serviceList: []
      },
      {
        hour: '16:30',
        serviceList: []
      },
      {
        hour: '16:45',
        serviceList: []
      },      
      {
        hour: '17:00',
        serviceList: []
      },
      {
        hour: '17:15',
        serviceList: []
      },
      {
        hour: '17:30',
        serviceList: []
      },
      {
        hour: '17:45',
        serviceList: []
      },      
      {
        hour: '18:00',
        serviceList: []
      },
      {
        hour: '18:15',
        serviceList: []
      },
      {
        hour: '18:30',
        serviceList: []
      },
      {
        hour: '18:45',
        serviceList: []
      },      
      {
        hour: '19:00',
        serviceList: []
      },
      {
        hour: '19:15',
        serviceList: []
      },
      {
        hour: '19:30',
        serviceList: []
      },
      {
        hour: '19:45',
        serviceList: []
      },      
      {
        hour: '20:00',
        serviceList: []
      },
      {
        hour: '20:15',
        serviceList: []
      },
      {
        hour: '20:30',
        serviceList: []
      },
      {
        hour: '20:45',
        serviceList: []
      },      
      {
        hour: '21:00',
        serviceList: []
      },
      {
        hour: '21:15',
        serviceList: []
      },
      {
        hour: '21:30',
        serviceList: []
      },
      {
        hour: '21:45',
        serviceList: []
      },      
      {
        hour: '22:00',
        serviceList: []
      },
      {
        hour: '22:15',
        serviceList: []
      },
      {
        hour: '22:30',
        serviceList: []
      },
      {
        hour: '22:45',
        serviceList: []
      },      
      {
        hour: '23:00',
        serviceList: []
      },
      {
        hour: '23:15',
        serviceList: []
      },
      {
        hour: '23:30',
        serviceList: []
      },
      {
        hour: '23:45',
        serviceList: []
      },
    ]
  }
}