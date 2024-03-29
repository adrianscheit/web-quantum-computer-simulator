import { Result } from '../domain';
import { C } from './c';
import { G } from './g';

/** Vector of complex numbers */
export class V {

    constructor(public state: C[] = [new C(1), new C()]) {
        this.qubits = Math.log2(state.length);
    }
    readonly qubits: number;

    /* tslint:disable:no-bitwise */
    static newSimpleState(qubitsQuantity: number, initialState: number = 0): C[] {
        const result: C[] = [];
        const stateLength = 1 << qubitsQuantity;
        for (let i = 0; i < stateLength; ++i) {
            result.push(new C());
        }
        result[initialState] = new C(1);
        return result;
    }

    static takeBits(index: number, qi: number[]): number {
        let result = 0;
        for (const i of qi) {
            result <<= 1;
            if (index & (1 << i)) {
                result |= 1;
            }
        }
        return result;
    }

    static setBits(source: number, qi: number[], oj: number): number {
        for (let i = qi.length - 1; i >= 0; --i, oj >>= 1) {
            if (oj & 1) {
                source |= 1 << qi[i];
            } else {
                source &= ~(1 << qi[i]);
            }
        }
        return source;
    }

    getQubitsValues(stateIndex: number): boolean[] {
        const result: boolean[] = [];
        for (let i = 0; i < this.qubits; ++i) {
            result.push(!!(stateIndex & 1));
            stateIndex >>= 1;
        }
        return result;
    }
    /* tslint:enable:no-bitwise */

    step(g: G, qi: number[], resultState: C[] = []): C[] {
        if (!resultState.length) {
            resultState = V.newSimpleState(this.qubits);
        }
        for (let i = 0; i < this.state.length; ++i) {
            resultState[i].r = 0;
            resultState[i].i = 0;
            const oi = V.takeBits(i, qi);
            for (let oj = 0; oj < g.widthAndHeight; ++oj) {
                const j = V.setBits(i, qi, oj);
                resultState[i].plusProductOf(this.state[j], g.get(oi, oj));
            }
        }
        return resultState;
    }

    calcResults(minPropability = 0.02): Result[] {
        const allResults: Result[] = this.state
            .map((c: C, i: number) => ({ propability: c.absSqer(), values: this.getQubitsValues(i) }))
            .filter((result: Result) => result.propability);
        if (allResults.length > 1) {
            const constantResults: (boolean | undefined)[] = [...allResults[0].values];
            for (let i = 0; i < constantResults.length; ++i) {
                for (let j = 1; j < allResults.length; ++j) {
                    if (allResults[j].values[i] !== constantResults[i]) {
                        constantResults[i] = undefined;
                        break;
                    }
                }
            }
            if (constantResults.filter((qubit: boolean | undefined) => qubit !== undefined).length) {
                allResults.unshift({ propability: 1, values: constantResults });
            }

        }
        const result = allResults
            .filter((result: Result) => result.propability > minPropability)
            .sort((a: Result, b: Result) => b.propability - a.propability);
        return result;
    }
}
