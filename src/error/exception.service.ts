import { StringUtils } from "../utils/StringUtils";

export class ExceptionService {

  public static CreateAPIException(exceptionErrorType : ExceptionErrorTypes, condition : boolean, response);
  public static CreateAPIException(exceptionErrorType : ExceptionErrorTypes, condition : boolean, response, additionalInfo: string);

  public static CreateAPIException(exceptionErrorType : ExceptionErrorTypes, condition : boolean, response, additionalInfo?: string){
    if (!condition){
      return;
    }

    let errorCodes = this.getErrorCodes();

    for (const errorcode of errorCodes){
      if (errorcode.error !== exceptionErrorType){
        continue;
      }

      errorcode.adittionalInfo = StringUtils.nonNullString(additionalInfo);
      
      return response.status(404).send(errorcode);
    }
  }

  private static getErrorCodes(){
    let errorCodes = [];

    errorCodes.push({error: ExceptionErrorTypes.E_0001, message: 'Http Method must be POST.',              adittionalInfo: ''});
    errorCodes.push({error: ExceptionErrorTypes.E_0002, message: 'Property Email or Password not found.',  adittionalInfo: ''});
    errorCodes.push({error: ExceptionErrorTypes.E_0003, message: 'Property Email or Password is empty.',   adittionalInfo: ''});
    errorCodes.push({error: ExceptionErrorTypes.E_0004, message: 'User not found.',                        adittionalInfo: ''});
    errorCodes.push({error: ExceptionErrorTypes.E_0005, message: 'Problem when realizing authentication.', adittionalInfo: ''});
    errorCodes.push({error: ExceptionErrorTypes.E_0006, message: 'Authentication token invalid.',          adittionalInfo: ''});
    errorCodes.push({error: ExceptionErrorTypes.E_0007, message: 'Service action.',                        adittionalInfo: ''});
    errorCodes.push({error: ExceptionErrorTypes.E_0008, message: 'Schedule action.',                       adittionalInfo: ''});

    return errorCodes;
  }
}

export enum ExceptionErrorTypes{
  E_0001 = '0001',
  E_0002 = '0002',
  E_0003 = '0003',
  E_0004 = '0004',
  E_0005 = '0005',
  E_0006 = '0006',
  E_0007 = '0007',
  E_0008 = '0008',
  E_0009 = '0009',
  E_0010 = '0010',
  E_0011 = '0011',
  E_0012 = '0012',
  E_0013 = '0013',
  E_0014 = '0014',
  E_0015 = '0015',
  E_0016 = '0016',
  E_0017 = '0017',
  E_0018 = '0018',
  E_0019 = '0019',
  E_0020 = '0020'
}