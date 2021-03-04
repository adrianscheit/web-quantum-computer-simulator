import { C } from "./c";
import { G, GateName } from "./g";

export const gates: G[] = [
    new G('', [new C(1)]),
    new G('X', [new C(), new C(1), new C(1), new C()]),
    new G('Y', [new C(), new C(0, -1), new C(0, 1), new C()]),
    new G('Z', [new C(1), new C(), new C(), new C(-1)]),
    new G('H', [new C(1), new C(1), new C(1), new C(-1)].map(c => c.mul(new C(Math.SQRT1_2)))),
    new G('SP', [new C(1), new C(), new C(), new C(0, 1)]),
    new G('T', [new C(1), new C(), new C(), new C(Math.SQRT1_2, Math.SQRT1_2)]),
    new G('CX', [
        new C(1), new C(), new C(), new C(),
        new C(), new C(1), new C(), new C(),
        new C(), new C(), new C(), new C(1),
        new C(), new C(), new C(1), new C(),
    ]),
    new G('CZ', [
        new C(1), new C(), new C(), new C(),
        new C(), new C(1), new C(), new C(),
        new C(), new C(), new C(1), new C(),
        new C(), new C(), new C(), new C(-1),
    ]),
    new G('SWAP', [
        new C(1), new C(), new C(), new C(),
        new C(), new C(), new C(1), new C(),
        new C(), new C(1), new C(), new C(),
        new C(), new C(), new C(), new C(1),
    ]),
    new G('CCX', [
        new C(1), new C(), new C(), new C(), new C(), new C(), new C(), new C(),
        new C(), new C(1), new C(), new C(), new C(), new C(), new C(), new C(),
        new C(), new C(), new C(1), new C(), new C(), new C(), new C(), new C(),
        new C(), new C(), new C(), new C(1), new C(), new C(), new C(), new C(),
        new C(), new C(), new C(), new C(), new C(1), new C(), new C(), new C(),
        new C(), new C(), new C(), new C(), new C(), new C(1), new C(), new C(),
        new C(), new C(), new C(), new C(), new C(), new C(), new C(), new C(1),
        new C(), new C(), new C(), new C(), new C(), new C(), new C(1), new C(),
    ]),
];

export const gatesMap = new Map<GateName, G>(gates.map(g => [g.name, g]));

