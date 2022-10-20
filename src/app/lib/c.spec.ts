import { C } from './c';

describe('Complex tests', () => {
    it('operator plus and minus', () => {
        expect(new C(2).plus(new C(3))).toEqual(new C(5));
        expect(new C(-2).plus(new C(3))).toEqual(new C(1));
        expect(new C(0, -2).plus(new C(3))).toEqual(new C(3, -2));
        expect(new C(3).plus(new C(0, -2))).toEqual(new C(3, -2));
        expect(new C(1, 1).plus(new C(2, -2))).toEqual(new C(3, -1));
    });

    it('mul', () => {
        expect(new C(0).mul(new C(1))).toEqual(new C(0));
        expect(new C(1).mul(new C(0))).toEqual(new C(0));
        expect(new C(1).mul(new C(1))).toEqual(new C(1));
        expect(new C(1, 1).mul(new C(0, 3))).toEqual(new C(-3, 3));
    });

    it('absolute squer', () => {
        expect(new C(2).absSqer()).toEqual(4);
        expect(new C(3, 4).absSqer()).toEqual(25);
        expect(new C(-3, 4).absSqer()).toEqual(25);
        expect(new C(-3, -4).absSqer()).toEqual(25);
        expect(new C(3, -4).absSqer()).toEqual(25);
    });

    it('plusProductOf', () => {
        expect(new C(0).plusProductOf(new C(1), new C(2))).toEqual(new C(2));
        expect(new C(3).plusProductOf(new C(1), new C(2))).toEqual(new C(5));
    });

    it('toString', () => {
        expect(new C().toString()).toEqual('0');
        expect(new C(1).toString()).toEqual('1');
        expect(new C(1, 1).toString()).toEqual('1+i');
        expect(new C(1, -1).toString()).toEqual('1-i');
        expect(new C(0.1, -0.1).toString()).toEqual('0.1-0.1i');
        expect(new C(0.1, 0.1).toString()).toEqual('0.1+0.1i');
        expect(new C(0, 1).toString()).toEqual('i');
        expect(new C(0, -1).toString()).toEqual('-i');
    });
});
