import { C } from './c';
import { G } from './g'

describe('Gate tests', () => {
    const gate1 = new G('', [new C(1), new C(2), new C(3), new C(4)]);
    const gate2 = new G('', [
        new C(1), new C(0), new C(0), new C(0),
        new C(0), new C(1), new C(0), new C(0),
        new C(0), new C(0), new C(0), new C(1),
        new C(0), new C(0), new C(1), new C(0),
    ]);

    it('take an element with 2 indexes', () => {
        expect(gate1.get(0, 0)).toEqual(new C(1));
        expect(gate1.get(0, 1)).toEqual(new C(2));
        expect(gate1.get(1, 0)).toEqual(new C(3));
        expect(gate1.get(1, 1)).toEqual(new C(4));
    });

    it('calculate the colspan and widthOrHeight', () => {
        expect(gate1.colspan).toEqual(1);
        expect(gate1.widthOrHeight).toEqual(2);

        expect(gate2.colspan).toEqual(2);
        expect(gate2.widthOrHeight).toEqual(4);
    });

    it('throws exception if the calspan is invalid', () => {
        try {
            new G('', [new C(0), new C(0), new C(0)]);
            expect('should not be executed').toBeFalsy();
        } catch (e) {
            // ok
        }
    });
});
