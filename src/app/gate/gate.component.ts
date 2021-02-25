import { Component, Input, OnInit } from '@angular/core';
import { Gate } from '../app.component';

@Component({
    selector: 'app-gate',
    templateUrl: './gate.component.html',
    styleUrls: ['./gate.component.css']
})
export class GateComponent {

    @Input() gate: Gate;

}
