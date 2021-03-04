import { C } from "./c";
import { G, GateName } from "./g";

export const gates: G[] = [
    new G('X', [new C(), new C(1), new C(1), new C()], 'Pauli-X'),
    new G('Y', [new C(), new C(0, -1), new C(0, 1), new C()], 'Pauli-Y'),
    new G('Z', [new C(1), new C(), new C(), new C(-1)], 'Pauli-Z'),
    new G('H', [new C(1), new C(1), new C(1), new C(-1)].map(c => c.mul(new C(Math.SQRT1_2))), 'Hadamard'),
    new G('SP', [new C(1), new C(), new C(), new C(0, 1)], 'Phase'),
    new G('T', [new C(1), new C(), new C(), new C(Math.SQRT1_2, Math.SQRT1_2)], 'PI/8'),
    new G('CX', [
        new C(1), new C(), new C(), new C(),
        new C(), new C(1), new C(), new C(),
        new C(), new C(), new C(), new C(1),
        new C(), new C(), new C(1), new C(),
    ], 'Controlled NOT'),
    new G('CY', [
        new C(1), new C(), new C(), new C(),
        new C(), new C(1), new C(), new C(),
        new C(), new C(), new C(), new C(1),
        new C(), new C(), new C(1), new C(),
    ], 'Controlled NOT'),
    new G('CZ', [
        new C(1), new C(), new C(), new C(),
        new C(), new C(1), new C(), new C(),
        new C(), new C(), new C(), new C(0, -1),
        new C(), new C(), new C(0, 1), new C(),
    ], 'Controlled Z'),
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
    ], 'Toffoli (CCX, TOFF)'),
    new G('√X', [new C(1, 1), new C(1, -1), new C(1, -1), new C(1, 1)].map(c => c.mul(new C(0.5))), 'Square root of Pauli-X'),
    new G('√SWAP', [
        new C(1), new C(), new C(), new C(),
        new C(), new C(0.5, 0.5), new C(0.5, -0.5), new C(),
        new C(), new C(0.5, -0.5), new C(0.5, 0.5), new C(),
        new C(), new C(), new C(), new C(1),
    ], 'Square root of SWAP'),
    new G('CSWAP', [
        new C(1), new C(), new C(), new C(), new C(), new C(), new C(), new C(),
        new C(), new C(1), new C(), new C(), new C(), new C(), new C(), new C(),
        new C(), new C(), new C(1), new C(), new C(), new C(), new C(), new C(),
        new C(), new C(), new C(), new C(1), new C(), new C(), new C(), new C(),
        new C(), new C(), new C(), new C(), new C(1), new C(), new C(), new C(),
        new C(), new C(), new C(), new C(), new C(), new C(), new C(1), new C(),
        new C(), new C(), new C(), new C(), new C(), new C(1), new C(), new C(),
        new C(), new C(), new C(), new C(), new C(), new C(), new C(), new C(1),
    ], 'Toffoli (CCX, TOFF)'),
    new G('XY', [new C(0, 1), new C(), new C(), new C(0, -1)], 'Serial connection of Pauli-X and Pauli-Y'),
];

export const gatesMap = new Map<GateName, G>(gates.map(g => [g.name, g]));

export const noGate = new G(null, [new C(1)]);
