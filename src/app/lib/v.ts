import { C } from "./c";

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
}
