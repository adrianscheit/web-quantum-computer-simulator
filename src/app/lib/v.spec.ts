import { C } from './c';
import { V } from './v';

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
});
