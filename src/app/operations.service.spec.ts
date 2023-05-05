import { TestBed } from '@angular/core/testing';

import { OperationsService } from './operations.service';

describe('OperationsService', () => {
    let service: OperationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OperationsService);
    });

    describe('complement', () => {
        it('no operations', () => {
            service.operations = [];
            service.complement();

            expect(service.operations).toEqual([]);
        });

        it('few operations', () => {
            service.operations = [
                { gn: 'X', qi: [0] },
                { gn: 'Y', qi: [1] },
                { gn: 'CX', qi: [1, 0] },
            ];
            service.complement();

            expect(service.operations).toEqual([
                service.operations[0],
                service.operations[1],
                service.operations[2],
                service.operations[2],
                service.operations[1],
                service.operations[0],
            ]);
        });
    });
});
