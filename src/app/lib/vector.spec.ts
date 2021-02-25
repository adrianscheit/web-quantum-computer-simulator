import { Complex } from './complex';

describe('Vector tests', () => {
    beforeEach(() => {

    });

    it('operator plus and minus', () => {
        expect(new Complex(2).plus(new Complex(3))).toEqual(new Complex(5));
        expect(new Complex(-2).plus(new Complex(3))).toEqual(new Complex(1));
        expect(new Complex(1, 1).plus(new Complex(2, -2))).toEqual(new Complex(3, -1));
    });
});
