import { environment } from "src/environments/environment";
import { C } from "./c";

export type GateName = 'X' | 'Y' | 'Z' | 'H' | 'SP' | 'T' | 'CX' | 'CZ' | 'SWAP' | 'CCX';

export class G {
    readonly matrix: C[];
    readonly desc: string;
    readonly colspan: number;
    readonly widthAndHeight: number;
    readonly color: string;

    constructor(public readonly name: GateName, m: C[], desc?: string, color?: string) {
        this.desc = desc ? desc : name ? name : 'ID';
        this.matrix = m;
        this.widthAndHeight = Math.sqrt(m.length);
        this.colspan = Math.log2(this.widthAndHeight);
        if (this.colspan !== Math.round(this.colspan)) {
            throw new Error(`The gate is invalid because the matrix size is: ${m.length}`);
        }
        const colors = {
            1: '#afd',
            2: '#dfa',
            3: '#dfd',
        }
        this.color = color ? color : colors[this.colspan] ? colors[this.colspan] : '#faa';
    }

    get(i: number, j: number): C {
        return this.matrix[i * this.widthAndHeight + j];
    }

    getError(qi: number[]) {
        if (qi.length !== this.colspan) {
            return 'Incorrect number of qubits assigned to this gate';
        }
        if (new Set<number>(qi).size !== qi.length) {
            return 'The same Qubit is used multiple times for this gate';
        }
        for (const index of qi) {
            if (!Number.isInteger(index)) {
                return 'In qubit index is not an integer'
            }
            if (index < 0) {
                return 'Ngative index of qubit'
            }
            if (index >= environment.maxQubitsQuantity) {
                return `The simulated computer can not be so big: ${index + 1} qubits`
            }
        }
    }
}

