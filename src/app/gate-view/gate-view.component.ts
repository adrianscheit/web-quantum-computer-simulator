import { Component, Input } from '@angular/core';
import { G } from '../lib/g';
import { noGate } from '../lib/gates';

@Component({
    selector: 'app-gate-view',
    templateUrl: './gate-view.component.html',
    styleUrls: ['./gate-view.component.css']
})
export class GateViewComponent {
    @Input() gate: G = noGate;
}
