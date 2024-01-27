import { Injectable } from '@angular/core';

const NUMBERS = ['אפס', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'];
const DECADES = ['עשר', 'עשרים', 'שלושים', 'ארבעים', 'חמשים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
const HUNDREDS = ['מאה', 'מאתיים', 'שלוש מאות', 'ארבע מאות', 'חמש מאות', 'שש מאות', 'שבע מאות', 'שמונה מאות', 'תשעת מאות'];

const THOUSANDS1 = ['אלף', 'אלפיים', 'שלושת אלפים', 'ארבת אלפים', 'חמשת אלפים', 'ששת אלפים', 'שבעת אלפים', 'שמונת אלפים', 'תשעת אלפים'];

@Injectable({providedIn: 'root'})
export class NumbersToHebrewService {
  translate(originalNum: number): string {

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

        let n;
        if(number === 2 && originalNum > 10){
          n = 'שניים';
        } else if(number === 2 && originalNum < 10){
          n = 'שני';
        } else {
          n = NUMBERS[number];
        }
        return originalNum > 10 && isAnd ? `ו${n}` : `${n}`
      }
      else if (number == 10 && originalNum == 10) {
        return 'עשרה';
      }
      else if (number < 20) {
        const dec = DECADES[getWords(number, 10)];
        const num = number % 10 === 2 ? 'שניים' : NUMBERS[number % 10];

        if( originalNum < 20  || !isAnd){
          return num === 'אפס' ? `${dec}` : `${num} ${dec}`;
        } else {
          return num ===  "אפס" ? `${dec}` : `ו${num} ${dec}`;
        }
      }
      else if (number < 100) {
        const dec = DECADES[getWords(number, 10)];
        const num = NUMBERS[number % 10];
        return num === 'אפס' ? `${dec}` : `${dec} ו${num}`;
      }
      //////////////////////////////////////////////////////////
      //////////////////// Recursion ///////////////////////////
      //////////////////////////////////////////////////////////
      else if (number < 1_000) {
        const dec = HUNDREDS[getWords(number, 100)];
        const num = number % 100;
        const result =  num === 0 ? `${dec}` : `${dec} ${__translate(num)}`;
        return result;
      }
      else if (number < 10_000) {
        const result =  THOUSANDS1[getWords(number, 1_000)] + ' ' + __translate(number % 1_000);
        return result;
      }
      else if (number < 1_000_000) {
        const leftNum = Math.floor(number / 1_000);
        let leftText = __translate(leftNum, false);
        leftText = leftText + ' אלף';
        const rightNum = number % 1_000;
        if (rightNum === 0) return leftText;
        return leftText + ' ' + __translate(rightNum);
      }
      else if (number < 1_000_000_000) {
        const leftNum = Math.floor(number / 1_000_000);
        if(leftNum === 2){
          return 'שני מיליון' + ' ' + __translate(number % 1_000_000);
        } else {
          let leftText = __translate(leftNum, false);
          leftText = leftText + ' מיליון';
          const rightNum = number % 1_000_000;
          if (rightNum === 0) return leftText;

          return leftText + ' ' + __translate(rightNum);
        }
      }
      else if (number < 1_000_000_000_000) {
        const leftNum = Math.floor(number / 1_000_000_000);
        const rightText = __translate(number % 1_000_000_000);
        if(leftNum === 1){
          return  'ביליון' + ' ' + rightText;
        }
        else if(leftNum === 2){
          return 'שני מיליארד' + 'ו ' + rightText;
        } else {
          return __translate(leftNum,false) + ' מיליארד'+ ' ו' + rightText;
        }
      }
      else {
        const leftNum = Math.floor(number / 1_000_000_000_000);
        const rightText = __translate(number % 1_000_000_000_000);
        if(leftNum === 1){
          return  'טריליון' + ' ' + rightText;
        }
        else if(leftNum === 2){
          return 'שני טריליון' + 'ו ' + rightText;
        } else {
          return __translate(leftNum,false) + ' טריליון'+ ' ו' + rightText;
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
