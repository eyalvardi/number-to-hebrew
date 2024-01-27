import { Component, inject, signal } from '@angular/core';
import {  ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, DecimalPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import {NumbersToHebrewService} from "number-to-hebrew";
import { CheckComponent } from './check.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CurrencyPipe,
        KeyValuePipe,
        DecimalPipe,
        CheckComponent,
        JsonPipe
    ],
    styles: [`
        check {
            align-self: center;
        }
        .layout{
            display: grid;
            width: 100%;
            align-items: center;
            justify-items: center;
        }
    `],
    template: `
        <div class="layout">
            <div dir="rtl">
                <h1>שירות תרגום מספרים למילים</h1>
                מספר מבוקש : <input #num type="number" />
                <button (click)="valueToText.set(+num.value)">תרגם</button>
                <br><br>
                <check [valueNum]="valueToText()" />
                <hr>
                טריליון : {{ numbersToText.debugParts.trillionsText }}<br>
                ביליון   : {{ numbersToText.debugParts.billonsText }}<br>
                מיליון   : {{ numbersToText.debugParts.milionsText }}<br>
                אלפים : {{ numbersToText.debugParts.thousandsText }}<br>
                מאות : {{ numbersToText.debugParts.hundredsText }}<br>
                עשרות : {{ numbersToText.debugParts.tensText }}<br>
                אחדות : {{ numbersToText.debugParts.onesText }}<br>
                <hr>
                <h2>בדיקה רנדומלית</h2>

                <hr>
                min : <input #min type="number"> max : <input #max type="number">
                <button (click)="buildWords(+min.value,+max.value)">Build</button>
                <div dir="rtl">
                    <table>
                        <thead>
                        <tr>
                            <th>מספר</th>
                            <th>מילים</th>
                        </tr>
                        </thead>
                        <tbody>
                            @for (t of test | keyvalue; track t.key) {
                                <tr>
                                    <td>{{ t.key | number }}</td>
                                    <td>{{ t.value }} ש״ח</td>
                                </tr>
                                @if ($index % 10 === 0) {
                                    <tr>
                                        <td colspan="2">------------------</td>
                                    </tr>
                                }
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
})
export class AppComponent {
    protected numbersToText = inject(NumbersToHebrewService)
    test = new Map<number, string>();
    valueToText = signal(1234);
    buildWords(min: number, max: number ) {
        if(max <= min){
            max = min + 10;
        }
        this.test.clear();
        for (let i = min; i < max; i++) {
            this.test.set(i, this.numbersToText.translate(i));
        }
    }

}

