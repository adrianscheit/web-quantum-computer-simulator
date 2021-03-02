import { C } from "./c";
import { G } from "./g";
import { GateName } from "./gates";

export interface Result {
    propability: number;
    state: boolean[];
}

export interface Operation {
    gateName: GateName,
    qi: number[]
}

export interface StepperData {
    /// Input:
    qubitsQuantity: number;
    operations: Operation[],
    id: number;
    /// Output:
    operationsQuantity?: number;
    startTime?: Date,
    progress?: number,
    results?: Result[],
    endTime?: Date
}

export class V {
    readonly qubits: number;

    constructor(public state: C[] = [new C(1), new C()]) {
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

    calcResults(minPropability: number = 0.001): Result[] {
        return this.state
            .map((c: C, i: number) => <Result>{ propability: c.absSqer(), state: this.getState(i) })
            .filter((result: Result) => result.propability > minPropability)
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

    static setBits(source: number, qi: number[], oj: number): number {
        let mask = 1;
        for (let i = 0; i < qi.length; ++i, mask <<= 1) {
            if (oj & mask) {
                source |= 1 << qi[i];
            } else {
                source &= ~(1 << qi[i]);
            }
        }
        return source;
    }

    step(g: G, qi: number[]): C[] {
        const result: C[] = [];
        const mask = qi.map(i => 1 << i).reduce((p, c) => p | c, 0);
        const nMask = ~mask;

        for (let i = 0; i < this.state.length; ++i) {
            const sum = new C();
            const oi = V.takeBits(i, qi);
            for (let oj = 0; oj < g.widthOrHeight; ++oj) {
                const j = V.setBits(i, qi, oj);
                sum.plus(this.state[j].new().mul(g.get(oi, oj)));
            }
            result.push(sum);
        }
        return result;
    }
}
