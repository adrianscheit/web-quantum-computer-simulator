import { TestBed } from '@angular/core/testing';

import { OperationsService } from './operations.service';
import { ValidatedOperationsService } from './validated-operations.service';
import { gatesMap, x } from '../lib/gates';

describe('ValidatedOperationsService', () => {
    let service: ValidatedOperationsService;
    let operationsService: OperationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ValidatedOperationsService);
        operationsService = TestBed.inject(OperationsService);
    });

    it('should calc on operations change', () => {
        operationsService.set([
            { gn: 'X', qi: [1] },
            { gn: 'CX', qi: [1, 2] },
        ]);

        expect(service.qubitsQuantity).toBe(3);
        expect(service.usedQubit).toEqual([false, true, true]);
        expect(service.validatedOperations).toEqual([
            { operation: operationsService.operations[0], gate: x, },
            { operation: operationsService.operations[1], gate: gatesMap.get('CX'), },
        ]);
    });

    it('should calc on operations change - case with errors', () => {
        operationsService.set([
            { gn: 'X', qi: [0] },
            { gn: 'X', qi: [] },
            { gn: 'X', qi: [0, 2] },
        ]);

        expect(service.qubitsQuantity).toBe(3);
        expect(service.usedQubit).toEqual([true, false, true]);
        expect(service.validatedOperations).toEqual([
            { operation: operationsService.operations[0], gate: x, },
            { operation: operationsService.operations[1], gate: x, error: 'Incorrect number of qubits assigned to this gate' },
            { operation: operationsService.operations[2], gate: x, error: 'Incorrect number of qubits assigned to this gate' },
        ]);
    });
});
