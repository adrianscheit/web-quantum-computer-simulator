import { Component, HostListener, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Gates } from './lib/gates';
import { Operation, StepperData } from './lib/v';

export interface GateGUI {
    o?: Operation;
    oi: number;
    ii?: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    cookiesEnabled = false;
    prod = environment.production;
    qubitsQuantity: number = 10;

    program: Operation[] = [];
    programGUI: GateGUI[][] = [];
    programJson: string;

    currentOperation: Operation;

    results: StepperData[] = [];
    readonly gates = Gates.gates;
    worker: Worker = new Worker('./stepper.worker', { type: 'module' });;

    ngOnInit() {
        this.programJson = localStorage.getItem('program');
        if (this.programJson) {
            this.parseProgramJson();
            this.cookiesEnabled = true;
        }
        this.parseProgram();

        this.worker.addEventListener('message', ({ data }) => {
            console.log('Got worker updates');
            const stepperData: StepperData = data;
            this.results[stepperData.id] = stepperData;
        });
    }

    getIndexes(length: number): number[] {
        return Array(length).fill(0).map((v, i) => i);
    }

    @HostListener('window:beforeunload')
    beforeClose() {
        if (this.cookiesEnabled) {
            localStorage.setItem('program', this.programJson);
        }
    }

    /// Cookies -------------------------------------------------------------------------------

    enableCookies(): void {
        this.cookiesEnabled = true;
    }

    disableCookies(): void {
        this.cookiesEnabled = false;
        localStorage.clear();
    }

    // Parsing ----------------------------------------------------------------------------

    parseProgramJson(): void {
        this.program = JSON.parse(this.programJson);
        this.parseProgram();
    }

    parseProgram(): void {
        // Remove ID operations:
        this.program = this.program.filter(step => step.gateName);
        // Validation:
        try {
            this.qubitsQuantity = 0;
            for (const operation of this.program) {
                if (operation.qi.length !== Gates.gatesMap.get(operation.gateName).colspan) {
                    console.error('Incorrect number of qubits put to operation: ', operation);
                    throw new Error();
                }
                if (new Set<number>(operation.qi).size !== operation.qi.length) {
                    console.error('The same Qubit used multiple times for one gate: ', operation);
                    throw new Error();
                }
                for (const index of operation.qi) {
                    if (Math.round(index) !== index) {
                        console.error('In operation an index is not integer', operation, index);
                        throw new Error();
                    }
                    if (index < 0) {
                        console.error('negative index', operation, index);
                        throw new Error();
                    }
                    if ((index + 1) > this.qubitsQuantity) {
                        this.qubitsQuantity = index + 1;
                    }
                }
            }
        } catch (e) {
            console.error(e);
            return;
        }
        // Update JSON:
        this.programJson = JSON.stringify(this.program);
        // Update GUI:
        this.programGUI = [];
        const newProgramGUIRow = new Map<number, GateGUI>();
        for (let i = 0; i < this.program.length; ++i) {
            const step = this.program[i];
            for (let j = 0; j < step.qi.length; ++j) {
                if (newProgramGUIRow.has(step.qi[j])) {
                    this.addRowToProgramGUI(newProgramGUIRow);
                }
            }
            for (let j = 0; j < step.qi.length; ++j) {
                newProgramGUIRow.set(step.qi[j], { o: step, oi: i, ii: j });
            }
        }
        this.addRowToProgramGUI(newProgramGUIRow);
        this.addRowToProgramGUI(newProgramGUIRow);
        console.log(this.programJson, this.program, '=>', this.programGUI, this.qubitsQuantity);
    }

    addRowToProgramGUI(gates: Map<number, GateGUI>): void {
        const row: GateGUI[] = [];
        let oi = Math.min(this.program.length, ...[...gates.values()].map(g => g.oi));
        for (let i = 0; i <= this.qubitsQuantity; ++i) {
            if (gates.has(i)) {
                row.push(gates.get(i));
                oi = Math.max(gates.get(i).oi + 1, oi);
            } else {
                row.push({ oi: oi });
            }
        }
        this.programGUI.push(row);
        gates.clear();
    }

    jsonChange(event) {
        this.programJson = event;
        this.parseProgramJson();
    }

    /// GUI's operations ----------------------------------------------------

    deleteQubit(index: number): void {
        for (let i = 0; i < this.program.length; ++i) {
            for (let j = 0; j < this.program[i].qi.length; ++j) {
                if (this.program[i].qi[j] === index) {
                    this.program.splice(i, 0);
                    --i;
                    break;
                } else if (this.program[i].qi[j] > index) {
                    this.program[i].qi[j]--;
                }
            }
        }
        this.parseProgram();
    }

    addStep(i: number): void {
        this.programGUI.splice(i, 0, this.getIndexes(this.qubitsQuantity + 1).map(_ => ({ oi: this.programGUI[i][0].oi } as GateGUI)));
    }

    deleteStep(i: number): void {
        const indexes = new Set<number>(this.programGUI[i].filter(g => g.o).map(g => g.oi));
        if (indexes.size) {
            const min = Math.min(...indexes.values());
            const max = Math.max(...indexes.values());
            this.program.splice(min, max - min + 1);
        }
        this.parseProgram();
    }

    /// Operation operations --------------------------------------------------------------

    addOperation(index: number, qubitIndex: number): void {
        const newOperation: Operation = { gateName: '', qi: [qubitIndex] };
        this.program.splice(index, 0, newOperation);
        this.currentOperation = newOperation;
    }
    editOperation(operation: Operation): void {
        this.currentOperation = operation;
    }

    deleteOperation(i: number): void {
        this.program.splice(i, 1);
        this.parseProgram();
    }

    changeOperation(guiGate: GateGUI, i: number, j: number): void {
        if (guiGate.o) {
            this.currentOperation = guiGate.o;
        } else {
            this.addOperation(guiGate.oi, j);
        }
    }

    exitOperation(): void {
        this.currentOperation = undefined;
        this.parseProgram();
    }

    simulate(): void {
        const stepperData: StepperData = {
            qubitsQuantity: this.qubitsQuantity,
            operations: this.program,
            id: this.results.length
        };
        this.worker.postMessage(stepperData);
    }

    cleanUp(): void {
        this.parseProgram();
    }

    complem(): void {

    }

    getOperationQubitIndexes(operation: Operation): string {
        return operation.qi.reduce((a, c) => a + ',' + c, '');
    }

}
