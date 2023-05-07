import { Utils } from './utils';

describe('Utils', () => {
    it('eventTargetValue', () => {
        const value = 'test Value';

        expect(Utils.eventTargetValue({target: {value}} as any)).toBe(value);
    });
});
