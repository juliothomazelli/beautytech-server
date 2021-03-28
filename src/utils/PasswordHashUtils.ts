import { generate, verify, isHashed } from 'password-hash';
import { StringUtils } from './StringUtils';

export class PasswordHashUtils {
  public static ToHash(password : string){
    if (StringUtils.isEmpty(password)){
      return '';
    }

    return generate(password);
  }

  public static IsValid(password : string, passwordHashed : string){
    if (StringUtils.isEmpty(password) || StringUtils.isEmpty(passwordHashed)){
      return false;
    }

    return verify(password, passwordHashed);
  }
}