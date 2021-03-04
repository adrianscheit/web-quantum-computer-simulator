import { Component, EventEmitter, Input, Output } from '@angular/core';
import { G } from '../lib/g';
import { gates, gatesMap } from '../lib/gates';
import { Operation } from '../lib/v';

@Component({
    selector: 'app-operation',
    templateUrl: './operation.component.html',
    styleUrls: ['./operation.component.css']
})
export class OperationComponent {
    @Input() program: Operation[];
    @Input() set index(index: number) {
        this._index = index;
        if (index !== undefined) {
            this.newIndex = index;
            this.qi = [...this.program[index].qi];
            this.deletedQi = [];
            this.setGate(gatesMap.get(this.program[index].gn));
        }
    }
    @Output() exit = new EventEmitter<boolean>();

    _index: number;
    private newIndex: number;
    qi: number[];
    private deletedQi: number[];
    gate: G;
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
                this.qi.push(this.deletedQi.length ? this.deletedQi.pop() : Math.max(-1, ...this.qi) + 1);
            } else {
                this.deletedQi.push(this.qi.pop());
            }
        }
        this.valid = this.isValid();
    }

    setQubitIndex(i: number, newQi: number): void {
        this.qi[i] = newQi;
        this.valid = this.isValid();
    }

    private isValid(): boolean {
        if (!Number.isInteger(this.newIndex) || this.newIndex < 0 || this.newIndex >= this.program.length) {
            return false;
        }
        return !this.gate.getError(this.qi);
    }

    close(): void {
        if (this.valid) {
            this.program[this._index].gn = this.gate.name;
            this.program[this._index].qi = this.qi;
            if (this._index !== this.newIndex) {
                this.program.splice(this.newIndex, 0, ...this.program.splice(this._index, 1));
            }
            this.exit.emit(true);
        } else {
            this.exit.emit(false);
        }
    }
}
