import { Utils } from './utils';

describe('Utils', () => {
    it('getIndexes', () => {
        expect(Utils.getIndexes(0)).toEqual([]);
        expect(Utils.getIndexes(1)).toEqual([0]);
        expect(Utils.getIndexes(5)).toEqual([0, 1, 2, 3, 4]);
    });
});
