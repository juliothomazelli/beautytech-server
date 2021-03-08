import { ObjectUtils } from "./ObjectUtils";
import { StringUtils } from "./StringUtils";

export class BeautyUtils {
  constructor(){}

  public static copyToClipboard(text){
    if (StringUtils.isEmpty(text)){
      return;
    }

    (<any>navigator).clipboard.writeText(text).then(
      () => {        
      })
  }  

  public static removeAccents(word: string) {
    let newWord = word.toLowerCase();

    newWord = newWord.replace(new RegExp(/\s/g),       '');
    newWord = newWord.replace(new RegExp(/[àáâãäå]/g), 'a');
    newWord = newWord.replace(new RegExp(/æ/g),        'ae');
    newWord = newWord.replace(new RegExp(/ç/g),        'c');
    newWord = newWord.replace(new RegExp(/[èéêë]/g),   'e');
    newWord = newWord.replace(new RegExp(/[ìíîï]/g),   'i');
    newWord = newWord.replace(new RegExp(/ñ/g),        'n');
    newWord = newWord.replace(new RegExp(/[òóôõö]/g),  'o');
    newWord = newWord.replace(new RegExp(/œ/g),        'oe');
    newWord = newWord.replace(new RegExp(/[ùúûü]/g),   'u');
    newWord = newWord.replace(new RegExp(/[ýÿ]/g),     'y');
    newWord = newWord.replace(new RegExp(/\W/g),       '');

    return newWord;
  }

  public static formatNumber(value: number, places: number = 2, symbol: string = ''): string {
    if (!value) {
      value = 0;
    }

    let number = value.toFixed(places).replace(',', 'p').replace('.', ',').replace('p', '.');
    return symbol + number;
  }
}