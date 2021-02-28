import { C } from "./c";
import { GateName } from "./gates";

export class G {
    readonly matrix: C[];
    readonly desc: string;
    readonly colspan: number;
    readonly widthOrHeight: number;
    readonly color: string;

    constructor(public readonly name: GateName, m: C[], desc?: string, color?: string) {
        this.desc = desc ? desc : name ? name : 'ID';
        this.matrix = m;
        this.widthOrHeight = Math.sqrt(m.length);
        this.colspan = Math.log2(this.widthOrHeight);
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
        return this.matrix[i * this.widthOrHeight + j];
    }

    smul(s: number): G {
        const sc = new C(s);
        for (let i = 0; i < this.matrix.length; ++i) {
            this.matrix[i].mul(sc);
        }
        return this;
    }
}
