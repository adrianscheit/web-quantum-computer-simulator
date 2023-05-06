import { Injectable } from '@angular/core';
import { Operation } from '../domain';
import { G } from '../lib/g';
import { gatesMap } from '../lib/gates';
import { OperationsService } from './operations.service';

export class ValidatedOperation {
    gate: G | undefined;
    error: string | undefined;
    constructor(readonly operation: Operation) {
        this.gate = gatesMap.get(operation.gn);
        this.error = ValidatedOperation.getError(this.gate, operation.qi);
    }

    static getError(gate: G | undefined, qi: number[]): string | undefined {
        if (!gate) {
            return 'Gate is required';
        }
        return gate.validateQubitIndexes(qi);
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
