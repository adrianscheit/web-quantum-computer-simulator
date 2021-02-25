import { Complex } from './complex';

describe('Complex tests', () => {
    beforeEach(() => {

    });

    it('operator plus and minus', () => {
        expect(new Complex(2).plus(new Complex(3))).toEqual(new Complex(5));
        expect(new Complex(-2).plus(new Complex(3))).toEqual(new Complex(1));
        expect(new Complex(1, 1).plus(new Complex(2, -2))).toEqual(new Complex(3, -1));
    });

    it('absolute squer', () => {
        expect(new Complex(2).absSqr()).toEqual(4);
    });
});
