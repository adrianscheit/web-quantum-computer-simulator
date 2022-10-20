import { C } from './c';
import { G } from './g';
import { gates } from './gates';
import { V } from './v';
import { vectorsEquals } from './v.spec';

describe('Gates tests', () => {
    it.each(gates)('check if %s gate is really reversable', (g: G) => {
        for (let i = 0; i < g.widthAndHeight; ++i) {
            const startingVector: V = new V(V.newSimpleState(g.colspan, i));
            const indexes = Array(g.colspan).fill(0).map((_, index) => index);
            const transformed = startingVector.step(g, indexes);
            expect(vectorsEquals(startingVector.state, new V(transformed).step(g, indexes))).toBeTruthy();

            const transformedReverse = startingVector.step(g, indexes.reverse());
            expect(vectorsEquals(startingVector.state, new V(transformedReverse).step(g, indexes.reverse()))).toBeTruthy();
        }
    });

    it.each(gates)('gatesMultiplication: %s square is an ident matrix', (g: G) => {
        const identMatrix: C[] = [];
        for (let i = 0; i < g.widthAndHeight; ++i) {
            for (let j = 0; j < g.widthAndHeight; ++j) {
                identMatrix.push(new C(i === j ? 1 : 0))
            }
        }

        expect(G.gatesMultiplication(g, g)).toEqual(identMatrix);
    });
});
