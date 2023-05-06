import { Component, HostBinding, Input } from '@angular/core';
import { Gate2DView } from '../domain';

@Component({
    selector: 'app-gate',
    templateUrl: './gate.component.html',
    styleUrls: ['./gate.component.css']
})
export class GateComponent {
    @Input() gate: Gate2DView = { oi: 0, color: '#faa' };
    @HostBinding('style.background-color')
    get color(): string {
        return this.gate.color;
    }
}
