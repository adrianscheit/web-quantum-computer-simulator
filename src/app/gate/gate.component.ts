import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GateName, Gates } from '../lib/gates';

@Component({
    selector: 'app-gate',
    templateUrl: './gate.component.html',
    styleUrls: ['./gate.component.css']
})
export class GateComponent {
    @Input() gateName: GateName;
    @Output() selectGateName = new EventEmitter<GateName>();
    gates = Gates.gates;
}
