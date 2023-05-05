import { Component, EventEmitter, Input, Output } from '@angular/core';
import { G } from '../lib/g';
import { gates, gatesMap } from '../lib/gates';
import { Utils } from '../utils/utils';
import { GateName } from '../domain';

@Component({
    selector: 'app-gate-select',
    templateUrl: './gate-select.component.html',
    styleUrls: ['./gate-select.component.css']
})
export class GateSelectComponent {
    @Input() gate: G | undefined;
    @Output() gateChange = new EventEmitter<G>();
    readonly gates = gates;

    eventTargetValue = Utils.eventTargetValue;

    change(gateName: string): void {
        const gate = gatesMap.get(gateName as GateName);
        if (!gate) {
            throw new Error('gateName not found!');
        }
        this.gateChange.emit(gate);
    }
}
