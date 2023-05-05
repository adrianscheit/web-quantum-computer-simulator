import { Component, EventEmitter, Input, Output } from '@angular/core';
import { G } from '../../lib/g';
import { noGate } from '../../lib/gates';

@Component({
    selector: 'app-default-gate',
    templateUrl: './default-gate.component.html',
    styleUrls: ['./default-gate.component.css']
})
export class DefaultGateComponent {
    @Input() gate: G | undefined;
    @Output() gateChange = new EventEmitter<G>();
}
