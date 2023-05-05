/** string limited only to implemented gate names */
export type GateName = 'X' | 'Y' | 'Z' | 'H' | 'SP' | 'T' | 'CX' | 'CY' | 'CZ' | 'SWAP' | 'CCX' | '√X' | '√SWAP' | 'CSWAP';

/** One possible result */
export interface Result {
    propability: number;
    values: boolean[];
}

/** Single quantum operation definition */
export interface Operation {
    gn: GateName;
    qi: number[];
}

/** stepper.worker data */
export interface StepperData {
    /// Input:
    qubitsQuantity: number;
    operations?: Operation[];
    id: number;
    canceled?: true;
    callback?: string;
    /// Output:
    operationsQuantity?: number;
    startTime?: Date;
    progress?: number;
    results?: Result[];
    endTime?: Date;
}
