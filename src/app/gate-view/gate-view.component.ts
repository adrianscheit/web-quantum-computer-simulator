import { Component, Input, OnInit } from '@angular/core';
import { G } from '../lib/g';

@Component({
    selector: 'app-gate-view',
    templateUrl: './gate-view.component.html',
    styleUrls: ['./gate-view.component.css']
})
export class GateViewComponent {
    @Input() gate: G;
}