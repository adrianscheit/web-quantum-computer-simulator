import { Complex } from "./complex";

export class Vector {

    constructor(public a: Complex[]) { }

    new(): Vector {
        return new Vector(this.a.map(c => c.new()));
    }

    size(): number {
        return Math.log2(this.a.length);
    }
}
