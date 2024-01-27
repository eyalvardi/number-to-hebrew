import { Injectable } from '@angular/core';

const NUMBERS = ['אפס', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'];
const DECADES = ['עשר', 'עשרים', 'שלושים', 'ארבעים', 'חמשים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
const HUNDREDS = ['מאה', 'מאתיים', 'שלוש מאות', 'ארבע מאות', 'חמש מאות', 'שש מאות', 'שבע מאות', 'שמונה מאות', 'תשעת מאות'];

const THOUSANDS1 = ['אלף', 'אלפיים', 'שלושת אלפים', 'ארבת אלפים', 'חמשת אלפים', 'ששת אלפים', 'שבעת אלפים', 'שמונת אלפים', 'תשעת אלפים'];

@Injectable({providedIn: 'root'})
export class NumbersToHebrewService {
  debugParts = {
    originalNum : 0,
    isPoint: false,
    decPart: '',
    pointText: '',

    trillionsNum: 0,
    trillionsText: '',

    billonsNum: 0,
    billonsText: '',

    milionsNum: 0,
    milionsText: '',

    thousandsNum: 0,
    thousandsText: '',

    hundredsNum: 0,
    hundredsText: '',

    tensNum: 0,
    tensText: '',

    onesNum: 0,
    onesText: '',

  }
  translate(originalNum: number): string {
    this.debugParts = {
      originalNum,
      isPoint: false,
      decPart: '',
      pointText: '',

      trillionsNum: 0,
      trillionsText: '',

      billonsNum: 0,
      billonsText: '',

      milionsNum: 0,
      milionsText: '',

      thousandsNum: 0,
      thousandsText: '',

      hundredsNum: 0,
      hundredsText: '',

      tensNum: 0,
      tensText: '',

      onesNum: 0,
      onesText: '',

    }
    const debugParts = this.debugParts;
    const getWords = this.getWords.bind(this);
    let pointText = '';
    let decPart = '';

    const isPoint = (originalNum+"").split(".").length > 1;
    if(isPoint){
      decPart = (originalNum + "" )
        .split(".")[1]
        .padEnd(2,'0')
        .substring(0,2);
      pointText   = this.translatePoint(+decPart);
      originalNum = Math.floor(originalNum);
      let result;
      if(originalNum === 0){
        result = pointText + ' אגורות ';
      } else {
        result = __translate.call(this,originalNum) + ' ש״ח ' + 'ו' + pointText + ' אגורות ';
      }
      return result;
    }
    return __translate.call(this,originalNum) + ' ש״ח ' ;


    function __translate(number: number, isAnd = true): string {

      if (number === 0) return '';

      if (number < 0) {
        return 'מינוס ' + __translate(-number);
      }
      else if (number < 10) {
        debugParts.onesNum = number;

        let n;
        if(number === 2 && originalNum > 10){
          n = 'שניים';
        } else if(number === 2 && originalNum < 10){
          n = 'שני';
        } else {
          n = NUMBERS[number];
        }
        debugParts.onesText = n;
        return originalNum > 10 && isAnd ? `ו${n}` : `${n}`
      }
      else if (number == 10 && originalNum == 10) {
        return 'עשרה';
      }
      else if (number < 20) {
        const dec = DECADES[getWords(number, 10)];
        const num = number % 10 === 2 ? 'שניים' : NUMBERS[number % 10];
        debugParts.tensNum = number / 10;
        debugParts.tensText = dec;
        if( originalNum < 20  || !isAnd){
          return num === 'אפס' ? `${dec}` : `${num} ${dec}`;
        } else {
          return num ===  "אפס" ? `${dec}` : `ו${num} ${dec}`;
        }
      }
      else if (number < 100) {
        const dec = DECADES[getWords(number, 10)];
        const num = NUMBERS[number % 10];
        debugParts.tensNum = number / 10;
        debugParts.tensText = dec;
        debugParts.onesNum = number % 10;
        debugParts.onesText= NUMBERS[number % 10];

        return num === 'אפס' ? `${dec}` : `${dec} ו${num}`;
      }
        //////////////////////////////////////////////////////////
        //////////////////// Recursion ///////////////////////////
      //////////////////////////////////////////////////////////
      else if (number < 1_000) {
        debugParts.hundredsNum = number;
        const dec = HUNDREDS[getWords(number, 100)];
        const num = number % 100;
        const result =  num === 0 ? `${dec}` : `${dec} ${__translate(num)}`;
        debugParts.hundredsText = result;
        return result;
      }
      else if (number < 10_000) {
        debugParts.thousandsNum = number;
        const result =  THOUSANDS1[getWords(number, 1_000)] + ' ' + __translate(number % 1_000);
        debugParts.thousandsText = THOUSANDS1[getWords(number, 1_000)];
        return result;
      }
        // else if (number < 100_000) {
        //     const mill = Math.floor(number/10_000);
        //     return THOUSANDS[mill] + " " + translate(number % 10_000);
      // }
      else if (number < 1_000_000) {
        const thoNum = Math.floor(number / 1_000);
        debugParts.thousandsNum = thoNum;
        debugParts.thousandsText = __translate(thoNum,false);
        const tho = __translate(thoNum, false);
        const num = number % 1_000;
        const elepWord = tho + ' אלף';
        if (num === 0) return elepWord;
        return elepWord + ' ' + __translate(number % 1_000);
      }
      else if (number < 1_000_000_000) {
        const thoNum = Math.floor(number / 1_000_000);
        debugParts.milionsNum = thoNum;
        debugParts.milionsText = __translate(thoNum,false);
        if(thoNum === 2){
          return 'שני מיליון' + ' ' + __translate(number % 1_000_000);
        } else {
          const tho = __translate(thoNum, false);
          const num = number % 1_000_000;
          const elepWord = tho + ' מיליון';

          if (num === 0) return elepWord;

          return elepWord + ' ' + __translate(number % 1_000_000);
        }
      }

      else if (number < 1_000_000_000_000) {
        const billonsNum = Math.floor(number / 1_000_000_000);
        const cary = __translate(number % 1_000_000_000);
        debugParts.billonsNum = billonsNum;
        debugParts.billonsText = __translate(billonsNum,false);
        if(billonsNum === 1){
          return  'ביליון' + ' ' + cary;
        }
        else if(billonsNum === 2){
          return 'שני מיליארד' + 'ו ' + cary;
        } else {
          return __translate(billonsNum,false) + ' מיליארד'+ ' ו' + cary;
        }
      }
      else {
        const trillionsNum = Math.floor(number / 1_000_000_000_000);
        const cary = __translate(number % 1_000_000_000_000);
        debugParts.trillionsNum = trillionsNum;
        debugParts.trillionsText = __translate(trillionsNum,false);
        if(trillionsNum === 1){
          return  'טריליון' + ' ' + cary;
        }
        else if(trillionsNum === 2){
          return 'שני טריליון' + 'ו ' + cary;
        } else {
          return __translate(trillionsNum,false) + ' טריליון'+ ' ו' + cary;
        }
      }
    }
  }

  private translatePoint(number:number): string {
    const getWords = this.getWords.bind(this);
    if (number < 10) {
      let n;
      if (number === 2) {
        n = 'שני';
      } else {
        n = NUMBERS[number];
      }
      return n;
    } else if (number == 10) {
      return 'עשר';
    } else if (number < 20) {
      const dec = DECADES[getWords(number, 10)];
      const num = number % 10 === 2 ? 'שניים' : NUMBERS[number % 10];
      return num === 'אפס' ? `${dec}` : `${num} ${dec}`;
    } else if (number < 100) {
      const dec = DECADES[getWords(number, 10)];
      const num = NUMBERS[number % 10];
      return num === 'אפס' ? `${dec}` : `${dec} ${num}`;
    }
    return "";
  }
  private getWords(number: number, divide: number): number {
    return Math.floor(number / divide) - 1;
  }
}
