import { TestBed } from '@angular/core/testing';

import { Operation } from './domain';
import { OperationsService } from './operations.service';

describe('OperationsService', () => {
    const opX: Operation = { gn: 'X', qi: [0] };
    const opY: Operation = { gn: 'Y', qi: [1] };
    const opZ: Operation = { gn: 'Z', qi: [2] };
    let service: OperationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OperationsService);
        service.set([]);
    });

    describe('complement', () => {
        it('no operations', () => {
            service.complement();

            expect(service.operations).toEqual([]);
        });

        it('few operations', () => {
            service.set([opX, opY, opZ]);
            service.complement();

            expect(service.operations).toEqual([opX, opY, opZ, opZ, opY, opX]);
        });
    });

    describe('add, edit, move, remove', () => {
        it('add', () => {
            service.add(0, opX);
            service.add(1, opY);
            service.add(0, opY);

            expect(service.operations).toEqual([opY, opX, opY]);
        });

        it('add fail', () => {
            expect(() => service.add(1, opX)).toThrow();
        });

        it('move forward', () => {
            service.add(0, opX);
            service.add(1, opY);
            service.add(2, opZ);
            service.move(0, 2);

            expect(service.operations).toEqual([opY, opZ, opX]);
        });

        it('move backward', () => {
            service.add(0, opX);
            service.add(1, opY);
            service.add(2, opZ);
            service.move(2, 0);

            expect(service.operations).toEqual([opZ, opX, opY]);
        });

        it('move fail', () => {
            expect(() => service.move(0, 0)).toThrow();
        });

        it('remove', () => {
            service.add(0, opX);
            service.add(1, opY);
            service.remove(0);

            expect(service.operations).toEqual([opY]);
        });

        it('remove fail', () => {
            expect(() => service.remove(0)).toThrow();
        });
    });
});
