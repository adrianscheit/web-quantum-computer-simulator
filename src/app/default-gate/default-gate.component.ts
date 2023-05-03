import { Component, EventEmitter, Input, Output } from '@angular/core';
import { gates } from '../lib/gates';
import { GateName } from '../domain';

@Component({
    selector: 'app-default-gate',
    templateUrl: './default-gate.component.html',
    styleUrls: ['./default-gate.component.css']
})
export class DefaultGateComponent {
    @Input() gateName: GateName | undefined;
    @Output() gateNameChange = new EventEmitter<GateName>();
    readonly gates = gates;
}
