import { Injectable } from '@angular/core';
import { OperationsService } from './operations.service';
import { gatesMap } from '../lib/gates';
import { G } from '../lib/g';

@Injectable({
    providedIn: 'root'
})
export class ValidatedOperationsService {
    errorMap: Map<number, string> = new Map<number, string>();
    qubitsQuantity = 0;
    usedQubit: boolean[] = [];

    constructor(readonly operationsService: OperationsService) {
        operationsService.operationsChange.subscribe(() => {
            this.calcStats(operationsService);
            this.validate();
        });
    }

    private calcStats(operationsService: OperationsService) {
        const allQubitIndexes = new Set<number>(operationsService.operations.flatMap((operation) => operation.qi));
        this.qubitsQuantity = Math.max(-1, ...allQubitIndexes) + 1;
        this.usedQubit = Array<boolean>(this.qubitsQuantity).fill(false);
        allQubitIndexes.forEach((qubitIndex) => this.usedQubit[qubitIndex] = true);
    }

    private validate() {
        this.errorMap.clear();
        for (let i = 0; i < this.operationsService.operations.length; ++i) {
            const step = this.operationsService.operations[i];
            const gate: G | undefined = gatesMap.get(step.gn);

            if (!gate) {
                this.errorMap.set(i, 'Gate name is not recognized');
                continue;
            }
            const error = gate.validateQubitIndexes(step.qi);
            if (error) {
                this.errorMap.set(i, error);
                continue;
            }
        }
    }
}
