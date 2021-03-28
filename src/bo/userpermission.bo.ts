import { User } from "../model/user.model";
import { UserPermission } from "../model/userpermission.model";
import { SequelizeORM } from "../sequelize/sequelize";
import { ObjectUtils } from "../utils/ObjectUtils";
import { UIID } from "../utils/Uiid";

export enum UserPermissionTypes{
  dashboard    = 'dashboard',
  notification = 'notification',
  chat         = 'chat'
}

export class UserPermissionBO {
  public userpermissionTypes = this.createUserPermissionTypes();

  public async createUserPermission(user: User){
    if (ObjectUtils.isNullOrUndefined(user)){
      return;
    }
    
    
    let sql = this.userCreateSQL();

    SequelizeORM.getInstance().getSequelizeORM().query(sql);
    // let userPermission = new UserPermission();

    // userPermission.Key  = UIID.generate();
    // userPermission.Name = 
  }

  public userCreateSQL() : string{
    return '';
  }

  public createUserPermissionTypes(){
    return [
      UserPermissionTypes.dashboard,
      UserPermissionTypes.notification,
      UserPermissionTypes.chat
    ]
  }
}