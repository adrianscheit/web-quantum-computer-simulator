import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { gates, gatesMap, noGate, x } from './lib/gates';
import { Operation, Result, StepperData, GateName } from './domain';
import { G } from './lib/g';
import { Utils } from './utils/utils';
import { OperationsService } from './operations.service';

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

    //program: Operation[] = [];
    programGUI: GateGUI[][] = [];
    programJson: string = '';
    errorMap: Map<number, string> = new Map<number, string>();
    jsonError: string | undefined;

    currentOperationIndex: number | undefined;
    defaultGate: G = x;

    waitAtResult = false;
    quickResult: Result[] | undefined;
    results: StepperData[] = [];
    workers: Worker[] = [];

    readonly gates = gates;
    readonly gatesMap = gatesMap;

    constructor(private httpClient: HttpClient, public operationsService: OperationsService) {
        operationsService.operationsChange.subscribe(() => {
            this.parseProgram();
        });
    }

    ngOnInit(): void {
        const hash = window.location.hash;
        if (hash) {
            const params = decodeURIComponent(hash).split('#');
            this.setProgramJson(decodeURIComponent(params[1]));
            this.simulate(params[2]);
        } else {
            this.programJson = localStorage.getItem('program') || '';
            if (this.programJson) {
                this.parseProgramJson();
                this.cookies = true;
            }
            this.parseProgram();
        }
    }

    getIndexes(length: number): number[] {
        return Array(length).fill(0).map((_, index) => index);
    }

    eventTargetValue = Utils.eventTargetValue;

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
            this.operationsService.set(JSON.parse(this.programJson));
            this.parseProgram();
        } catch (e) {
            this.jsonError = (e as any).message;
        }
    }

    parseProgram(): void {
        // Reset:
        this.qubitsQuantity = 0;
        this.errorMap.clear();
        this.programGUI = [];
        this.quickResult = undefined;
        this.waitAtResult = false;

        // Validation:
        for (let i = 0; i < this.operationsService.operations.length; ++i) {
            const step = this.operationsService.operations[i];
            const gate: G | undefined = gatesMap.get(step.gn);

            if (!gate) {
                this.errorMap.set(i, 'Gate name is not recognized');
                continue;
            }
            const error = gate.validateQubitIndexes(step.qi);
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
        this.programJson = JSON.stringify(this.operationsService.operations);
        this.jsonError = undefined;

        // Update GUI:
        this.programGUI.push(Array(this.qubitsQuantity + 1).fill({ oi: 0, color: noGate.color }));
        const newProgramGUIRow = new Map<number, GateGUI>();
        for (let i = 0; i < this.operationsService.operations.length; ++i) {
            const step = this.operationsService.operations[i];
            for (const qindex of step.qi) {
                if (newProgramGUIRow.has(qindex)) {
                    this.addRowToProgramGUI(newProgramGUIRow);
                }
            }
            for (let j = 0; j < step.qi.length; ++j) {
                newProgramGUIRow.set(step.qi[j], { o: step, oi: i, ii: j, color: gatesMap.get(step.gn)!.color });
            }
        }
        this.addRowToProgramGUI(newProgramGUIRow);
        this.addRowToProgramGUI(newProgramGUIRow);
    }

    addRowToProgramGUI(rowDescription: Map<number, GateGUI>): void {
        const row: GateGUI[] = [];
        let oi = Math.min(this.operationsService.operations.length, ...[...rowDescription.values()].map(g => g.oi));
        for (let i = 0; i <= this.qubitsQuantity; ++i) {
            if (rowDescription.has(i)) {
                row.push(rowDescription.get(i)!);
                oi = Math.max(rowDescription.get(i)!.oi + 1, oi);
            } else {
                row.push({ oi, color: noGate.color });
            }
        }
        this.programGUI.push(row);
        rowDescription.clear();
    }

    /// GUI's operations ----------------------------------------------------

    addQubitBefore(index: number): void {
        for (const step of this.operationsService.operations) {
            for (let j = 0; j < step.qi.length; ++j) {
                if (step.qi[j] >= index) {
                    ++(step.qi[j]);
                }
            }
        }
        this.parseProgram();
    }

    deleteQubit(index: number): void {
        for (const step of this.operationsService.operations) {
            for (let j = 0; j < step.qi.length; ++j) {
                if (step.qi[j] === index) {
                    throw new Error('Deleting operations by deleting a qubit is forbidden!');
                } else if (step.qi[j] > index) {
                    --(step.qi[j]);
                }
            }
        }
        this.parseProgram();
    }

    /// Operation operations --------------------------------------------------------------

    addOperation(index: number, qubitIndex: number | undefined): void {
        const newOperation: Operation = { gn: this.defaultGate.name!, qi: qubitIndex === undefined ? [] : [qubitIndex] };
        this.operationsService.add(index, newOperation);
        if (this.defaultGate.colspan !== 1 || qubitIndex === undefined) {
            this.editOperation(index);
        } else {
            this.parseProgram();
        }
    }

    editOperation(index: number): void {
        this.currentOperationIndex = index;
    }

    click2d(guiGate: GateGUI, j: number): void {
        if (guiGate.o) {
            this.editOperation(guiGate.oi);
        } else {
            this.addOperation(guiGate.oi, j);
        }
    }

    exitOperation(): void {
        this.currentOperationIndex = undefined;
        this.operationsService.update();
    }

    /// Simulation -------------------------------------------------------------------

    simulate(callback?: string): void {
        let stepperData: StepperData = {
            qubitsQuantity: this.qubitsQuantity,
            operations: this.operationsService.operations,
            id: this.results.length,
            callback
        };
        this.waitAtResult = true;
        const worker = new Worker(new URL('./stepper.worker', import.meta.url));
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
                        .subscribe({ next: console.log, error: console.error });
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

}
