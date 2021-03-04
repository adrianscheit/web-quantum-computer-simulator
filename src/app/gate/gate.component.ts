import { Component, HostBinding, Input } from '@angular/core';
import { GateGUI } from '../app.component';

@Component({
    selector: 'app-gate',
    templateUrl: './gate.component.html',
    styleUrls: ['./gate.component.css']
})
export class GateComponent {
    @Input() gate: GateGUI = { oi: 0, color: '#faa' };
    @HostBinding('style.background-color')
    get color(): string {
        return this.gate.color;
    }
}
