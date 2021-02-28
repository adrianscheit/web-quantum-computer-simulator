import { Component, HostBinding, Input } from '@angular/core';
import { GUIGate } from '../app.component';
import { Gates } from '../lib/gates';

@Component({
    selector: 'app-gate',
    templateUrl: './gate.component.html',
    styleUrls: ['./gate.component.css']
})
export class GateComponent {
    @Input() gate: GUIGate;
    @HostBinding('style.background-color')
    get color(): string {
        if (!this.gate.o) {
            return '#af8';
        }
        return Gates.gatesMap.get(this.gate.o.gateName).color;
    }
}
