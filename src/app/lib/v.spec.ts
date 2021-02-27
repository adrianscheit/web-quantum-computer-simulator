import { C } from './c';
import { Gates } from './gates';
import { Result, V } from './v';

describe('Vector tests', () => {
    const v1 = new V([new C(1), new C()]);
    const v2 = new V([new C(1), new C(), new C(), new C(1),]);
    const v3 = new V([new C(), new C(1)]);

    it('calc the size the right way', () => {
        expect(v1.qubits).toEqual(1);
        expect(v2.qubits).toEqual(2);
        expect(v3.qubits).toEqual(1);
    });

    it('tensor product', () => {
        expect(V.newTensorProduct([v1, v1, v1]).state).toEqual([new C(1), new C(), new C(), new C(), new C(), new C(), new C(), new C()]);
        expect(V.newTensorProduct([v3, v3, v3]).state).toEqual([new C(), new C(), new C(), new C(), new C(), new C(), new C(), new C(1)]);
        expect(V.newTensorProduct([v1, v1, v3]).state).toEqual([new C(), new C(), new C(), new C(), new C(1), new C(), new C(), new C()]);
        expect(V.newTensorProduct([v3, v1, v1]).state).toEqual([new C(), new C(1), new C(), new C(), new C(), new C(), new C(), new C()]);
    });

    it('calc state the same way how tensor product is calculated', () => {
        expect(v1.getState(0)).toEqual([false]);
        expect(v1.getState(1)).toEqual([true]);

        expect(v2.getState(0)).toEqual([false, false]);
        expect(v2.getState(1)).toEqual([true, false]);
        expect(v2.getState(2)).toEqual([false, true]);
        expect(v2.getState(3)).toEqual([true, true]);
    });


    it('calcResult', () => {
        expect(v1.calcResults()).toEqual([{ propability: 1, state: [false] }]);
        expect(v3.calcResults()).toEqual([{ propability: 1, state: [true] }]);
        expect(new Set<Result>(new V([new C(0.5), new C(0.5), new C(0.5), new C(0.5)]).calcResults())).toEqual(new Set<Result>([
            { propability: 0.25, state: [false, false] },
            { propability: 0.25, state: [false, true] },
            { propability: 0.25, state: [true, false] },
            { propability: 0.25, state: [true, true] },
        ]));
    });

    it('take bits', () => {
        expect(V.takeBits(0, [8, 5])).toEqual(0);
        expect(V.takeBits(0, [1])).toEqual(0);

        expect(V.takeBits(1, [0])).toEqual(1);
        expect(V.takeBits(1, [1])).toEqual(0);
        expect(V.takeBits(1, [0, 1])).toEqual(2);
        expect(V.takeBits(1, [1, 0])).toEqual(1);

        expect(V.takeBits(2, [0])).toEqual(0);
        expect(V.takeBits(2, [1])).toEqual(1);
        expect(V.takeBits(2, [0, 1])).toEqual(1);
        expect(V.takeBits(2, [1, 0])).toEqual(2);
    });

    it('step simple', () => {
        expect(new V([new C(1), new C(0)]).step({ gate: Gates.gatesMap.get(''), qi: [0] })).toEqual({ 0: new C(1), 1: new C(0) });
        expect(new V([new C(0), new C(1)]).step({ gate: Gates.gatesMap.get(''), qi: [0] })).toEqual({ 0: new C(0), 1: new C(1) });

        expect(new V([new C(1), new C(0)]).step({ gate: Gates.gatesMap.get('X'), qi: [0] })).toEqual({ 0: new C(0), 1: new C(1) });
        expect(new V([new C(0), new C(1)]).step({ gate: Gates.gatesMap.get('X'), qi: [0] })).toEqual({ 0: new C(1), 1: new C(0) });
    });
});
