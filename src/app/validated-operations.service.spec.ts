import { TestBed } from '@angular/core/testing';

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
            { gn: 'X', qi: [0] },
            { gn: 'X', qi: [] },
            { gn: 'X', qi: [0, 2] },
        ]);

        expect(service.qubitsQuantity).toBe(3);
        expect(service.usedQubit).toEqual([true, false, true]);
        expect(service.errorMap.get(0)).toBeFalsy();
        expect(service.errorMap.get(1)).toBeTruthy();
        expect(service.errorMap.get(2)).toBeTruthy();
    });
});
