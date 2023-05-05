import { Component, EventEmitter, Input, Output } from '@angular/core';
import { G } from '../lib/g';
import { gates } from '../lib/gates';

@Component({
    selector: 'app-gate-select',
    templateUrl: './gate-select.component.html',
    styleUrls: ['./gate-select.component.css']
})
export class GateSelectComponent {
    @Input() gate: G | undefined;
    @Output() gateChange = new EventEmitter<G>();
    readonly gates = gates;
}
