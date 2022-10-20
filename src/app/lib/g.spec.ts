import { C } from './c';
import { G } from './g';
import { x, y } from './gates';

describe('Gate tests', () => {
    const gate2x2 = new G('X', [new C(1), new C(2), new C(3), new C(4)]);
    const gate4x4 = new G('X', [
        new C(1), new C(0), new C(0), new C(0),
        new C(0), new C(1), new C(0), new C(0),
        new C(0), new C(0), new C(0), new C(1),
        new C(0), new C(0), new C(1), new C(0),
    ]);

    it('take an element with 2 indexes', () => {
        expect(gate2x2.get(0, 0)).toEqual(new C(1));
        expect(gate2x2.get(0, 1)).toEqual(new C(2));
        expect(gate2x2.get(1, 0)).toEqual(new C(3));
        expect(gate2x2.get(1, 1)).toEqual(new C(4));
    });

    it('calculate the colspan and widthOrHeight', () => {
        expect(gate2x2.colspan).toEqual(1);
        expect(gate2x2.widthAndHeight).toEqual(2);

        expect(gate4x4.colspan).toEqual(2);
        expect(gate4x4.widthAndHeight).toEqual(4);
    });

    it('throws exception if the calspan is invalid', () => {
        expect(() => new G('X', [new C(0), new C(0), new C(0)])).toThrow();
    });

    it('validate qubit indexes', () => {
        expect(gate2x2.validateQubitIndexes([1])).toBeFalsy();

        expect(gate4x4.validateQubitIndexes([1, 0])).toBeFalsy();
        expect(gate4x4.validateQubitIndexes([2, 4])).toBeFalsy();

        expect(gate2x2.validateQubitIndexes([0.5])).toBeTruthy();
        expect(gate2x2.validateQubitIndexes([-1])).toBeTruthy();
        expect(gate2x2.validateQubitIndexes([60])).toBeTruthy();

        expect(gate4x4.validateQubitIndexes([2, 2])).toBeTruthy();
        expect(gate4x4.validateQubitIndexes([2, -1])).toBeTruthy();
        expect(gate4x4.validateQubitIndexes([-1, 2])).toBeTruthy();
        expect(gate4x4.validateQubitIndexes([2, 0.5])).toBeTruthy();
        expect(gate4x4.validateQubitIndexes([0.5, 5])).toBeTruthy();
        expect(gate4x4.validateQubitIndexes([60, 5])).toBeTruthy();
        expect(gate4x4.validateQubitIndexes([6, 60])).toBeTruthy();
    });

    it('constructFromMultiplication', () => {
        expect(G.gatesMultiplication(gate2x2, gate2x2)).toEqual([new C(7), new C(10), new C(15), new C(22)]);
    });

    it('XY and YX is not the same gate', () => {
        expect(G.gatesMultiplication(x, y)).not.toEqual(G.gatesMultiplication(y, x));
    });
});
