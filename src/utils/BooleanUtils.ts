export class  BooleanUtils {
  public static TRUE  = 1;
  public static FALSE = 2;

  public static intToBoolean(value : any) : boolean{
      return value == 1;
  }

  public static booleanToInt(value : boolean) : number{
      if (value){
          return 1;
      } else {
          return 2;
      }
  }
}