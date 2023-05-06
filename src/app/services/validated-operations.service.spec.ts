import { TestBed } from '@angular/core/testing';

import { GateName } from '../domain';
import { gatesMap, x } from '../lib/gates';
import { OperationsService } from './operations.service';
import { ValidatedOperationsService } from './validated-operations.service';

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
            { gn: 'XX' as GateName, qi: [] },
            { gn: 'X', qi: [0, 2] },
        ]);

        expect(service.qubitsQuantity).toBe(3);
        expect(service.usedQubit).toEqual([true, false, true]);
        expect(service.validatedOperations).toEqual([
            { operation: operationsService.operations[0], gate: x, },
            { operation: operationsService.operations[1], error: 'Gate is required' },
            { operation: operationsService.operations[2], gate: x, error: 'Incorrect number of qubits assigned to this gate' },
        ]);
    });
});
