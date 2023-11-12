import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Gate2DView, Operation, Result } from '../domain';
import { G } from '../lib/g';
import { h } from '../lib/gates';
import { OperationsService } from '../services/operations.service';
import { ValidatedOperationsService } from '../services/validated-operations.service';

@Component({
    selector: 'app-view2d',
    templateUrl: './view2d.component.html',
    styleUrls: ['./view2d.component.css']
})
export class View2dComponent {
    @Input() quickResult: Result[] | undefined;
    @Output() operationIndex = new EventEmitter<number>();
    programGUI: Gate2DView[][] = [];
    defaultGate: G = h;

    constructor(
        readonly operationsService: OperationsService,
        readonly validatedOperationsService: ValidatedOperationsService,
    ) {
        operationsService.operationsChange.subscribe(() => {
            this.programGUI = [Array(this.validatedOperationsService.qubitsQuantity + 1).fill({ oi: 0, color: '#ffff' })];
            const newProgramGUIRow = new Map<number, Gate2DView>();
            for (let i = 0; i < this.operationsService.operations.length; ++i) {
                const validatedOperation = this.validatedOperationsService.validatedOperations[i];
                for (const qindex of validatedOperation.operation.qi) {
                    if (newProgramGUIRow.has(qindex)) {
                        this.addRowToProgramGUI(newProgramGUIRow);
                    }
                }
                for (let j = 0; j < validatedOperation.operation.qi.length; ++j) {
                    newProgramGUIRow.set(validatedOperation.operation.qi[j], {
                        o: validatedOperation.operation,
                        oi: i,
                        ii: j,
                        color: validatedOperation.error || !validatedOperation.gate ? '#faa' : validatedOperation.gate.color,
                    });
                }
            }
            this.addRowToProgramGUI(newProgramGUIRow);
            this.addRowToProgramGUI(newProgramGUIRow);
        });
    }


    addOperationForQubit(index: number, qubitIndex: number): void {
        const newOperation: Operation = { gn: this.defaultGate.name, qi: [qubitIndex] };
        this.operationsService.add(index, newOperation);
        if (this.defaultGate.colspan !== 1) {
            this.operationIndex.emit(index);
        }
    }

    click2d(guiGate: Gate2DView, j: number): void {
        if (guiGate.o) {
            this.operationIndex.emit(guiGate.oi);
        } else {
            this.addOperationForQubit(guiGate.oi, j);
        }
    }

    addQubitBefore(index: number): void {
        for (const step of this.operationsService.operations) {
            for (let j = 0; j < step.qi.length; ++j) {
                if (step.qi[j] >= index) {
                    ++(step.qi[j]);
                }
            }
        }
        this.operationsService.emitChange();
    }

    deleteQubit(index: number): void {
        for (const step of this.operationsService.operations) {
            for (let j = 0; j < step.qi.length; ++j) {
                if (step.qi[j] === index) {
                    throw new Error('Deleting operations by deleting a qubit is forbidden!');
                } else if (step.qi[j] > index) {
                    --(step.qi[j]);
                }
            }
        }
        this.operationsService.emitChange();
    }

    private addRowToProgramGUI(rowDescription: Map<number, Gate2DView>): void {
        const row: Gate2DView[] = [];
        let oi = Math.min(this.operationsService.operations.length, ...[...rowDescription.values()].map(g => g.oi));
        for (let i = 0; i <= this.validatedOperationsService.qubitsQuantity; ++i) {
            if (rowDescription.has(i)) {
                row.push(rowDescription.get(i));
                oi = Math.max(rowDescription.get(i).oi + 1, oi);
            } else {
                row.push({ oi, color: '#ffff' });
            }
        }
        this.programGUI.push(row);
        rowDescription.clear();
    }
}
