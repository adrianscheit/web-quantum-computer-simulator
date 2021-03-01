import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { G } from '../lib/g';
import { GateName, Gates } from '../lib/gates';
import { Operation } from '../lib/v';

@Component({
    selector: 'app-operation',
    templateUrl: './operation.component.html',
    styleUrls: ['./operation.component.css']
})
export class OperationComponent {
    @Input() operation: Operation;
    @Input() index: number;
    @Output() exit = new EventEmitter<number>();
    readonly gates: G[] = Gates.gates;

    changeGate(gateName: GateName): void {
        this.operation.gateName = gateName;
        const gate: G = Gates.gatesMap.get(gateName);
        while (gate.colspan !== this.operation.qi.length) {
            if (gate.colspan > this.operation.qi.length) {
                this.operation.qi.push(Math.max(...this.operation.qi) + 1);
            } else {
                this.operation.qi.pop();
            }
        }
    }
}
