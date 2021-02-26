import { C } from "./c";
import { G } from "./g";

export type GateName = '' | 'X' | 'Y' | 'Z' | 'H' | 'SP' | 'T' | 'CNOT' | 'CZ' | 'SWAP' | 'CCNOT';


export class Gates {

    static gateEntry(name: GateName, m: C[], desc?: string): [GateName, G] {
        return [name, new G(name, m, desc)];
    }

    static gatesMap = new Map<GateName, G>([
        Gates.gateEntry('', [new C(1), new C(), new C(), new C(1)]),
        Gates.gateEntry('X', [new C(), new C(1), new C(1), new C()]),
        Gates.gateEntry('Y', [new C(), new C(0, -1), new C(0, 1), new C()]),
        Gates.gateEntry('Z', [new C(1), new C(), new C(), new C(-1)]),
        Gates.gateEntry('H', [new C(1), new C(1), new C(1), new C(-1)].map(c => c.mul(new C(Math.SQRT1_2)))),
        Gates.gateEntry('SP', [new C(1), new C(), new C(), new C(0, 1)]),
        Gates.gateEntry('T', [new C(1), new C(), new C(), new C(Math.SQRT1_2, Math.SQRT1_2)]),
        Gates.gateEntry('CNOT', [
            new C(1), new C(), new C(), new C(),
            new C(), new C(1), new C(), new C(),
            new C(), new C(), new C(), new C(1),
            new C(), new C(), new C(1), new C(),
        ]), Gates.gateEntry('CZ', [
            new C(1), new C(), new C(), new C(),
            new C(), new C(1), new C(), new C(),
            new C(), new C(), new C(1), new C(),
            new C(), new C(), new C(), new C(-1),
        ]),
        Gates.gateEntry('SWAP', [
            new C(1), new C(), new C(), new C(),
            new C(), new C(), new C(1), new C(),
            new C(), new C(1), new C(), new C(),
            new C(), new C(), new C(), new C(1),
        ]), Gates.gateEntry('CCNOT', [
            new C(1), new C(), new C(), new C(), new C(), new C(), new C(), new C(),
            new C(), new C(1), new C(), new C(), new C(), new C(), new C(), new C(),
            new C(), new C(), new C(1), new C(), new C(), new C(), new C(), new C(),
            new C(), new C(), new C(), new C(1), new C(), new C(), new C(), new C(),
            new C(), new C(), new C(), new C(), new C(1), new C(), new C(), new C(),
            new C(), new C(), new C(), new C(), new C(), new C(1), new C(), new C(),
            new C(), new C(), new C(), new C(), new C(), new C(), new C(), new C(1),
            new C(), new C(), new C(), new C(), new C(), new C(), new C(1), new C(),
        ]),

    ]);
    static gates = [...Gates.gatesMap.values()];
}
