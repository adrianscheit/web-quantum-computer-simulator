import { Component, EventEmitter, Input, Output } from '@angular/core';
import { G } from '../lib/g';
import { gates, gatesMap } from '../lib/gates';
import { OperationsService } from '../operations.service';
import { Utils } from '../utils/utils';

@Component({
    selector: 'app-operation',
    templateUrl: './operation.component.html',
    styleUrls: ['./operation.component.css']
})
export class OperationComponent {
    @Input() set index(index: number | undefined) {
        this._index = index;
        if (index !== undefined) {
            this.newIndex = index;
            this.qi = [...this.operationsService.operations[index].qi];
            this.deletedQi = [];
            if (gatesMap.has(this.operationsService.operations[index].gn)) {
                this.setGate(gatesMap.get(this.operationsService.operations[index].gn)!);
            } else {
                this.gate = undefined;
            }
        }
    }
    get index(): number | undefined {
        return this._index;
    }
    @Output() exit = new EventEmitter<void>();

    constructor(public operationsService: OperationsService) { }

    private _index: number | undefined;

    private newIndex: number = -1;
    qi: number[] = [];
    private deletedQi: number[] = [];
    gate: G | undefined;
    readonly gates: G[] = gates;
    valid = true;

    setIndex(newIndex: number): void {
        this.newIndex = newIndex;
        this.valid = this.isValid();
    }

    setGate(newGate: G): void {
        this.gate = newGate;
        while (this.qi.length !== this.gate.colspan) {
            if (this.qi.length < this.gate.colspan) {
                this.qi.push(this.deletedQi.length ? this.deletedQi.pop()! : Math.max(-1, ...this.qi) + 1);
            } else {
                this.deletedQi.push(this.qi.pop()!);
            }
        }
        this.valid = this.isValid();
    }

    setQubitIndex(i: number, newQi: number): void {
        this.qi[i] = newQi;
        this.valid = this.isValid();
    }

    del(): void {
        this.operationsService.remove(this.index!);
        this.exit.emit();
    }

    private isValid(): boolean {
        return this.gate !== undefined && !this.gate.validateQubitIndexes(this.qi);
    }

    close(): void {
        if (this.valid) {
            this.operationsService.operations[this.index!].gn = this.gate!.name;
            this.operationsService.operations[this.index!].qi = this.qi;
            if (this.index !== this.newIndex) {
                this.operationsService.move(this.index!, this.newIndex);
            }
        }
        this.exit.emit();
    }

    eventTargetValue = Utils.eventTargetValue;
}
