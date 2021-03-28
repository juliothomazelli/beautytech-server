import { Model } from "sequelize-typescript";
import { SequelizeORM } from "../sequelize/sequelize";
import { BooleanUtils } from "./BooleanUtils";
import { DateUtils } from "./DateUtils";
import { ObjectUtils } from "./ObjectUtils";
import { StringUtils } from "./StringUtils";
import { UIID } from "./Uiid";

export class SQLQueryUtils {
  private static fieldList : any = [];

  public static UpdateOrInsertListToTable(list: any, table: Model) : Promise<any>{
    return new Promise (
      (resolve, reject) => {
        let keyListToSelect = [];

        if (ObjectUtils.isEmptyArray(list)){
          reject();
          return;
        }
    
        let sql = 'INSERT INTO ' + table.constructor.name.toUpperCase() + ' ( ';
    
        for (const item of list){
          ObjectUtils.verifyProperty(item, 'Key', '');
          ObjectUtils.verifyProperty(item, 'Status', BooleanUtils.TRUE);
    
          if (StringUtils.isEmpty(item.Key)){
            item.Key = UIID.generate();

            keyListToSelect.push(item.Key);
          }

          this.fieldList = Object.keys(item);
        }

        let count = 0;
        for (let field of this.fieldList){
          count++;
    
          if (StringUtils.equals(field, 'key', false) || StringUtils.equals(field, 'status', false)){
            field = table.constructor.name + '.' + field;
          }
    
          if (count == this.fieldList.length){
            sql += field + ', createdAt, updatedAt) ';
            break;
          }
    
          sql += field + ', ';
          
        }
    
        sql += ' VALUES ';
    
        let countList = 0;
    
        let tableToStringField : any = table; //! GAMBI NERVOSA POIS O OBJETO table NÃO TEM A PROPRIEDADE "tableAttributes"
    
        for (const item of list){
          let count = 0;
    
          countList++;
    
          for (const field of this.fieldList){
            count++;
    
            if (tableToStringField.sequelize.models[table.constructor.name].tableAttributes[field].type.__proto__.constructor.key == 'STRING'){
              item[field] = '"' + item[field] + '"';
            }
    
            if (count == this.fieldList.length){
              if (countList == list.length){
                sql += item[field] + ', ';
                sql += '"' + DateUtils.formatDateTime(new Date()) + '", "' + DateUtils.formatDateTime(new Date()) + '" )';
              } else {
                sql += item[field] + ', ';
                sql += '"' + DateUtils.formatDateTime(new Date()) + '", "' + DateUtils.formatDateTime(new Date()) + '" ),';
              }
              
              break;
            }
    
            if (count == 1){
                sql += ' ( ' + item[field] + ', ';
                continue;
            }
    
            sql += item[field] + ', ';
          }
        }
    
        SequelizeORM.getInstance().getSequelizeORM().query(sql).then((response) => {
          resolve(null);
        }).catch((error) => {
          reject();
        });
      });

      //! DEVE SER FEITO O UPDATE 
  }
}