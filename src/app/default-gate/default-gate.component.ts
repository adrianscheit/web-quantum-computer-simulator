import { Component, Input } from '@angular/core';
import { gates } from '../lib/gates';

@Component({
    selector: 'app-default-gate',
    templateUrl: './default-gate.component.html',
    styleUrls: ['./default-gate.component.css']
})
export class DefaultGateComponent {

    @Input() defaultGateName: string;
    gates = gates;

}
