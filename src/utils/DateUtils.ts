import { ObjectUtils } from "./ObjectUtils";

export class DateUtils {
  public static formatDateTime(date : Date, initialDate = true){
    if (ObjectUtils.isNullOrUndefined(date)){
      return '';
    }

    let result = '';
    
    result = date.getFullYear() + '-' + DateUtils.getMonth(date.getMonth()) + '-' + DateUtils.formatZeronumber(date.getDate().toString()) + ' ';

    if (initialDate){
      result += DateUtils.formatZeronumber(date.getHours().toString()) + ':' + DateUtils.formatZeronumber(date.getMinutes().toString()) + ':' + DateUtils.formatZeronumber(date.getSeconds().toString());
    } else {
      result += '23:59:59';
    }
    

    return result;
  }

  private static formatZeronumber(hourMinuteSecond : string){
    if (hourMinuteSecond.length != 1){
      return hourMinuteSecond;
    }

    return '0' + hourMinuteSecond;
  }

  public static getMonth(month : number){
    if (month == 0){
      return '01';
    }

    if (month == 1){
      return '02';
    }

    if (month == 2){
      return '03';
    }

    if (month == 3){
      return '04';
    }

    if (month == 4){
      return '05';
    }

    if (month == 5){
      return '06';
    }

    if (month == 6){
      return '07';
    }

    if (month == 7){
      return '08';
    }

    if (month == 8){
      return '09';
    }

    if (month == 9){
      return '10';
    }

    if (month == 10){
      return '11';
    }

    if (month == 11){
      return '12';
    }
  }

  public static getNumberDaysOfMonth(date : Date){
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }
}