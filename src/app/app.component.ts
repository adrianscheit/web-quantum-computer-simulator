import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { GateName } from './lib/g';
import { gates, gatesMap, noGate } from './lib/gates';
import { Operation, Result, StepperData } from './lib/v';

export interface GateGUI {
    o?: Operation;
    oi: number;
    ii?: number;
    color: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    selfLink = window.location.origin;

    qubitsQuantity = 10;

    program: Operation[] = [];
    programGUI: GateGUI[][] = [];
    programJson: string;
    errorMap: Map<number, string> = new Map<number, string>();
    jsonError: string = undefined;

    currentOperationIndex: number = undefined;
    defaultGateName: GateName = 'H';

    waitAtResult = false;
    quickResult: Result[] = undefined;
    results: StepperData[] = [];
    workers: Worker[] = [];

    readonly gates = gates;
    visits: number = undefined;

    constructor(private httpClient: HttpClient) {
    }

    ngOnInit(): void {
        console.log(window.location);
        const hash = window.location.hash;
        if (hash) {
            const params = decodeURIComponent(hash).split('#');
            this.setProgramJson(decodeURIComponent(params[1]));
            this.simulate(params[2]);
        } else {
            this.programJson = localStorage.getItem('program');
            if (this.programJson) {
                this.parseProgramJson();
                this.cookies = true;
            }
            this.parseProgram();
        }

        this.httpClient.get('/assets/visits.php?app=qcs').subscribe((value: any) => this.visits = value);
    }

    getIndexes(length: number): number[] {
        return Array(length).fill(0).map((_, index) => index);
    }

    /// Cookies -------------------------------------------------------------------------------

    set cookies(enabled: boolean) {
        if (enabled) {
            localStorage.setItem('program', this.programJson);
        } else {
            localStorage.clear();
        }
    }
    get cookies(): boolean {
        return !!localStorage.getItem('program');
    }

    @HostListener('window:beforeunload')
    beforeClose(): void {
        if (this.cookies) {
            localStorage.setItem('program', this.programJson);
        }
    }

    // Parsing ----------------------------------------------------------------------------

    setProgramJson(programJson: string): void {
        this.programJson = programJson;
        this.parseProgramJson();
    }

    parseProgramJson(): void {
        this.jsonError = undefined;
        try {
            this.program = JSON.parse(this.programJson);
            this.parseProgram();
        } catch (e) {
            this.jsonError = e;
        }
    }

    parseProgram(): void {
        // Reset:
        this.qubitsQuantity = 0;
        this.errorMap.clear();
        this.programGUI = [];
        this.quickResult = undefined;
        this.waitAtResult = false;

        // Remove ID operations:
        for (let i = 0; i < this.program.length; ++i) {
            if (!this.program[i] || !this.program[i].gn) {
                this.program.splice(i--, 1);
            }
        }

        // Validation:
        for (let i = 0; i < this.program.length; ++i) {
            const step = this.program[i];
            if (!gatesMap.has(step.gn)) {
                this.errorMap.set(i, 'Gate name is not recognized');
                continue;
            }
            const error = gatesMap.get(step.gn).getError(step.qi);
            if (error) {
                this.errorMap.set(i, error);
                continue;
            }
            this.qubitsQuantity = Math.max(this.qubitsQuantity, Math.max(...step.qi) + 1);
        }
        if (this.errorMap.size > 0) {
            return;
        }

        // Update JSON:
        this.programJson = JSON.stringify(this.program);
        this.jsonError = undefined;

        // Update GUI:
        const newProgramGUIRow = new Map<number, GateGUI>();
        for (let i = 0; i < this.program.length; ++i) {
            const step = this.program[i];
            for (const qindex of step.qi) {
                if (newProgramGUIRow.has(qindex)) {
                    this.addRowToProgramGUI(newProgramGUIRow);
                }
            }
            for (let j = 0; j < step.qi.length; ++j) {
                newProgramGUIRow.set(step.qi[j], { o: step, oi: i, ii: j, color: gatesMap.get(step.gn).color });
            }
        }
        this.addRowToProgramGUI(newProgramGUIRow);
        this.addRowToProgramGUI(newProgramGUIRow);
        // console.log(this.programJson, this.program, '=>', this.programGUI, this.qubitsQuantity);
    }

    addRowToProgramGUI(rowDescription: Map<number, GateGUI>): void {
        const row: GateGUI[] = [];
        let oi = Math.min(this.program.length, ...[...rowDescription.values()].map(g => g.oi));
        for (let i = 0; i <= this.qubitsQuantity; ++i) {
            if (rowDescription.has(i)) {
                row.push(rowDescription.get(i));
                oi = Math.max(rowDescription.get(i).oi + 1, oi);
            } else {
                row.push({ oi, color: noGate.color });
            }
        }
        this.programGUI.push(row);
        rowDescription.clear();
    }

    /// GUI's operations ----------------------------------------------------

    addQubitBefore(index: number): void {
        for (const step of this.program) {
            for (let j = 0; j < step.qi.length; ++j) {
                if (step.qi[j] >= index) {
                    ++(step.qi[j]);
                }
            }
        }
        this.parseProgram();
    }

    deleteQubit(index: number): void {
        for (let i = 0; i < this.program.length; ++i) {
            for (let j = 0; j < this.program[i].qi.length; ++j) {
                if (this.program[i].qi[j] === index) {
                    this.program.splice(i--, 1);
                    break;
                } else if (this.program[i].qi[j] > index) {
                    --(this.program[i].qi[j]);
                }
            }
        }
        this.parseProgram();
    }

    addStep(index: number): void {
        this.programGUI.splice(
            index,
            0,
            Array(this.qubitsQuantity + 1).fill({ oi: this.programGUI[index][0].oi, color: noGate.color })
        );
    }

    deleteStep(index: number): void {
        const indexes = new Set<number>(this.programGUI[index].filter(g => g.o).map(g => g.oi));
        if (indexes.size) {
            const min = Math.min(...indexes.values());
            const max = Math.max(...indexes.values());
            this.program.splice(min, max - min + 1);
        }
        this.parseProgram();
    }

    /// Operation operations --------------------------------------------------------------

    addOperation(index: number, qubitIndex: number): void {
        const newOperation: Operation = { gn: this.defaultGateName, qi: qubitIndex === undefined ? [] : [qubitIndex] };
        this.program.splice(index, 0, newOperation);
        if (gatesMap.get(this.defaultGateName).colspan !== 1 || qubitIndex === undefined) {
            this.currentOperationIndex = index;
        } else {
            this.parseProgram();
        }
    }

    editOperation(index: number): void {
        this.currentOperationIndex = index;
    }

    deleteOperation(index: number): void {
        this.program.splice(index, 1);
        this.parseProgram();
    }

    changeOperation(guiGate: GateGUI, i: number, j: number): void {
        if (guiGate.o) {
            this.editOperation(guiGate.oi);
        } else {
            this.addOperation(guiGate.oi, j);
        }
    }

    exitOperation(): void {
        this.currentOperationIndex = undefined;
        this.parseProgram();
    }

    /// Simulation -------------------------------------------------------------------

    simulate(callback?: string): void {
        let stepperData: StepperData = {
            qubitsQuantity: this.qubitsQuantity,
            operations: this.program,
            id: this.results.length,
            callback
        };
        this.waitAtResult = true;
        const worker = new Worker('./stepper.worker', { type: 'module' });
        this.workers[stepperData.id] = worker;
        worker.addEventListener('message', ({ data }) => {
            stepperData = data;
            this.results[stepperData.id] = stepperData;
            if (stepperData.results) {
                if (this.waitAtResult) {
                    this.quickResult = stepperData.results;
                }
                if (stepperData.callback) {
                    this.httpClient.get(stepperData.callback + encodeURIComponent(JSON.stringify(stepperData.results)))
                        .subscribe(console.log, console.error);
                }
                worker.terminate();
            }
        });
        worker.postMessage(stepperData);
    }

    cancelSimulation(index: number): void {
        this.workers[index].terminate();
        this.results[index].canceled = true;
    }

    complem(): void {
        let length = this.program.length;
        while (length) {
            this.program.push(this.program[--length]);
        }
        this.parseProgram();
    }

    getOperationQubitIndexes(qi: number[]): string {
        return qi.reduce((a, c) => a + ',' + c, '');
    }

}
