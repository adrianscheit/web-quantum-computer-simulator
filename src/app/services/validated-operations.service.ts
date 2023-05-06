import { Injectable } from '@angular/core';
import { Operation } from '../domain';
import { G } from '../lib/g';
import { gatesMap } from '../lib/gates';
import { OperationsService } from './operations.service';

class ValidatedOperation {
    gate: G | undefined;
    error: string | undefined;
    constructor(readonly operation: Operation) {
        this.gate = gatesMap.get(operation.gn);

        if (!this.gate) {
            this.error = 'Gate name is not recognized';
        } else {
            this.error = this.gate.validateQubitIndexes(operation.qi);
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class ValidatedOperationsService {
    validatedOperations: ValidatedOperation[] = [];
    qubitsQuantity = 0;
    usedQubit: boolean[] = [];

    constructor(readonly operationsService: OperationsService) {
        operationsService.operationsChange.subscribe(() => {
            this.calcStats();
            this.validatedOperations = operationsService.operations.map((operation) => new ValidatedOperation(operation));
        });
    }

    private calcStats() {
        const allQubitIndexes = new Set<number>(this.operationsService.operations.flatMap((operation) => operation.qi));
        this.qubitsQuantity = Math.max(-1, ...allQubitIndexes) + 1;
        this.usedQubit = Array<boolean>(this.qubitsQuantity).fill(false);
        allQubitIndexes.forEach((qubitIndex) => this.usedQubit[qubitIndex] = true);
    }
}
