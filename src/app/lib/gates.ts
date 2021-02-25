import { Complex } from "./complex";

export type GateName = null | 'H' | 'X' | 'SWAP';

export interface Gate {
    matrix: Complex[],
    desc: string,
    name: GateName,
    colspan: number
}

export class Gates {

    static gateEntry(name: GateName, m: Complex[], desc?: string): [GateName, Gate] {
        return [name, { name: name, desc: desc ? desc : name ? name : 'ID', matrix: m, colspan: Math.log2(Math.sqrt(m.length)) } as Gate];
    }

    static gatesMap = new Map<GateName, Gate>([
        Gates.gateEntry(null, [new Complex(1), new Complex(0), new Complex(0), new Complex(1)]),
        Gates.gateEntry('X', [new Complex(0), new Complex(1), new Complex(1), new Complex(0)]),
        Gates.gateEntry('H', [new Complex(0), new Complex(1), new Complex(1), new Complex(0)]),
        Gates.gateEntry('SWAP', [
            new Complex(1), new Complex(0), new Complex(0), new Complex(0),
            new Complex(0), new Complex(0), new Complex(1), new Complex(0),
            new Complex(0), new Complex(1), new Complex(0), new Complex(0),
            new Complex(0), new Complex(0), new Complex(0), new Complex(1),
        ]),
    ]);
    static gates = [...Gates.gatesMap.values()];
}
