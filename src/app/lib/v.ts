import { C } from "./c";
import { G } from "./g";

export interface Result {
    propability: number;
    state: boolean[];
}

export interface Operation {
    gate: G,
    qi: number[]
}

export interface StepperData {
    initQubits: V[];
    operations: Operation[],
    qubitsQuantity?: number;
    progress?: number,
    results?: Result[],
    startTime?: Date,
    endTime?: Date
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

    static takeBits(index: number, qi: number[]): number {
        let result = 0;
        for (const i of qi) {
            result <<= 1;
            result |= (index & (1 << i)) ? 1 : 0
        }
        return result;
    }

    step(o: Operation): { [index: number]: C } {
        const result: { [index: number]: C } = {};
        const mask = o.qi.map(i => 1 << i).reduce((p, c) => p | c, 0);
        const nMask = ~mask;

        for (let i = 0; i < this.state.length; ++i) {
            for (let j = 0; j < this.state.length; ++j) {
                if ((i & nMask) === (j & nMask)) {
                    const r = this.state[i].new().mul(o.gate.get(V.takeBits(i, o.qi), V.takeBits(j, o.qi)));
                    result[j] = result[j] ? result[j].plus(r) : r;
                }
            }
        }
        return result;
    }
}
