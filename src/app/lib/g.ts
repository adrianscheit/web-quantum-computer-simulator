import { GateName } from '../domain';
import { environment } from '../../environments/environment';
import { C } from './c';

/** Quantum gate */
export class G {
    readonly matrix: C[];
    readonly desc: string;
    readonly colspan: number;
    readonly widthAndHeight: number;
    readonly color: string;

    constructor(public readonly name: GateName | undefined, m: C[], desc?: string, color?: string) {
        this.desc = desc ? desc : name ? name : 'ID';
        this.matrix = m;
        this.widthAndHeight = Math.sqrt(m.length);
        this.colspan = Math.log2(this.widthAndHeight);
        if (this.colspan !== Math.round(this.colspan)) {
            throw new Error(`The gate is invalid because the matrix size is: ${m.length}`);
        }
        const colors = ['#ddd','#afd','#dfa','#dfd'];
        this.color = color ? color : colors[this.colspan] ? colors[this.colspan] : '#faa';
    }

    static gatesMultiplication(g0: G, g1: G): C[] {
        if (g0.widthAndHeight !== g1.widthAndHeight) {
            throw new Error('Different matrixes sizes to multiply');
        }
        const result: C[] = [];
        for (let i = 0; i < g0.widthAndHeight; ++i) {
            for (let j = 0; j < g1.widthAndHeight; ++j) {
                const sum: C = new C();
                for (let k = 0; k < g0.widthAndHeight; ++k) {
                    sum.plusProductOf(g0.get(i, k), g1.get(k, j));
                }
                result.push(sum);
            }
        }
        return result;
    }

    get(i: number, j: number): C {
        return this.matrix[i * this.widthAndHeight + j];
    }

    validateQubitIndexes(qi: number[]): string | undefined {
        if (qi.length !== this.colspan) {
            return 'Incorrect number of qubits assigned to this gate';
        }
        if (new Set<number>(qi).size !== qi.length) {
            return 'The same Qubit is used multiple times for this gate';
        }
        for (const index of qi) {
            if (!Number.isInteger(index)) {
                return 'In qubit index is not an integer';
            }
            if (index < 0) {
                return 'Ngative index of qubit';
            }
            if (index >= environment.maxQubitsQuantity) {
                return `The simulated computer can not be so big: ${index + 1} qubits`;
            }
        }
    }
}

