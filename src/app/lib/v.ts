import { C } from "./c";

export interface Result {
    propability: number;
    state: boolean[];
}

export class V {
    readonly qubits: number;

    constructor(public readonly state: C[] = [new C(1), new C()]) {
        this.qubits = Math.log2(state.length);
    }

    new(): V {
        return new V(this.state.map(c => c.new()));
    }

    static newTensorProduct(vectors: V[]): V {
        let result = [new C(1)];
        for (const v of vectors) {
            const nextResult = [];
            for (const vc of v.state) {
                for (const rc of result) {
                    nextResult.push(rc.new().mul(vc));
                }
            }
            result = nextResult;
        }
        return new V(result);
    }

    getState(stateIndex: number): boolean[] {
        const result: boolean[] = [];
        for (let i = 0; i < this.qubits; ++i) {
            result.push(!!(stateIndex & 1));
            stateIndex >>= 1;
        }
        return result;
    }

    calcResults(): Result[] {
        return this.state
            .map((c: C, i: number) => <Result>{ propability: c.absSqer(), state: this.getState(i) })
            .filter((result: Result) => result.propability > 0)
            .sort((a, b) => a[0] - b[0]);
    }
}
