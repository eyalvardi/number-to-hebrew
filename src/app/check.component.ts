import { Component, inject, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NumbersToHebrewService } from 'number-to-hebrew';

@Component({
    selector: 'check',
    standalone: true,
    styles: [`
      .check {
        background-image: url("../assets/img.png");
        background-size: 500px 251px;
        width: 500px;
        height: 251px;
      }

      .check-values {
        display: grid;
        grid-template-columns: 147px 500px;
        margin-top: 132px;
        margin-right: 30px;
        position: absolute;
      }


      .check-text {
        font: 14px Arial, sans-serif;
      }

      .check-value {
        font: 14px Arial, sans-serif;

      }
    `],
    imports: [
        DecimalPipe
    ],
    template: `
        <div class="check">
            <div class="check-values">
                <div class="check-value">{{ value | number }}</div>
                <div class="check-text">{{ text }}</div>
            </div>
        </div>
    `
})
export class CheckComponent {
    protected numbersToText = inject(NumbersToHebrewService)
    value:number = 0;
    text:string = '';
    @Input() set valueNum(val:number){
        this.value = val;
        this.text = this.numbersToText.translate(val);
    }

}
