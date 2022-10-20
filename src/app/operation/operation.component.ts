import { Component, EventEmitter, Input, Output } from '@angular/core';
import { G } from '../lib/g';
import { gates, gatesMap, noGate } from '../lib/gates';
import { Operation } from '../domain';

@Component({
    selector: 'app-operation',
    templateUrl: './operation.component.html',
    styleUrls: ['./operation.component.css']
})
export class OperationComponent {
    @Input() program: Operation[];
    @Input() set index(index: number) {
        this.orginalIndexCopy = index;
        if (index !== undefined) {
            this.newIndex = index;
            this.qi = [...this.program[index].qi];
            this.deletedQi = [];
            if (gatesMap.has(this.program[index].gn)) {
                this.setGate(gatesMap.get(this.program[index].gn));
            } else {
                this.gate = noGate;
            }
        }
    }
    get index(): number {
        return this.orginalIndexCopy;
    }
    @Output() exit = new EventEmitter<void>();

    private orginalIndexCopy: number;

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

    del(): void {
        this.program.splice(this.index, 1);
        this.exit.emit();
    }

    private isValid(): boolean {
        if (!Number.isInteger(this.newIndex) || this.newIndex < 0 || this.newIndex >= this.program.length) {
            return false;
        }
        return !this.gate.validateQubitIndexes(this.qi);
    }

    close(): void {
        if (this.valid) {
            this.program[this.index].gn = this.gate.name;
            this.program[this.index].qi = this.qi;
            if (this.index !== this.newIndex) {
                this.program.splice(this.newIndex, 0, ...this.program.splice(this.index, 1));
            }
        }
        this.exit.emit();
    }
}
