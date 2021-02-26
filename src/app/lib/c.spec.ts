import { C } from './c';

describe('Complex tests', () => {
    beforeEach(() => {

    });

    it('operator plus and minus', () => {
        expect(new C(2).plus(new C(3))).toEqual(new C(5));
        expect(new C(-2).plus(new C(3))).toEqual(new C(1));
        expect(new C(1, 1).plus(new C(2, -2))).toEqual(new C(3, -1));
    });

    it('absolute squer', () => {
        expect(new C(2).absSqer()).toEqual(4);
    });

    it('mul', () => {
        expect(new C(0).mul(new C(1))).toEqual(new C(0));
        expect(new C(1).mul(new C(0))).toEqual(new C(0));
        expect(new C(1).mul(new C(1))).toEqual(new C(1));
        expect(new C(1, 1).mul(new C(0, 3))).toEqual(new C(-3, 3));
    });

    it('toString', () => {
        expect(new C().toString()).toEqual('0');
        expect(new C(1).toString()).toEqual('1');
        expect(new C(1, 1).toString()).toEqual('1+i');
        expect(new C(1, -1).toString()).toEqual('1-i');
        expect(new C(0.1, -0.1).toString()).toEqual('0.1-0.1i');
        expect(new C(0.1, 0.1).toString()).toEqual('0.1+0.1i');
    });
});
