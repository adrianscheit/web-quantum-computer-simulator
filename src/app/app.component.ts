import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Gate2DView, GateName, Operation, Result, StepperData } from './domain';
import { G } from './lib/g';
import { gates, gatesMap, x } from './lib/gates';
import { OperationsService } from './services/operations.service';
import { Utils } from './utils/utils';
import { ValidatedOperationsService } from './services/validated-operations.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    selfLink = window.location.origin;

    programGUI: Gate2DView[][] = [];
    programJson: string = '';
    jsonError: string | undefined;

    operationIndex: number | undefined;
    defaultGate: G = x;

    waitAtResult = false;
    quickResult: Result[] | undefined;
    results: StepperData[] = [];
    workers: Worker[] = [];

    readonly gates = gates;
    readonly gatesMap = gatesMap;

    constructor(private httpClient: HttpClient, readonly operationsService: OperationsService, readonly validatedOperationsService: ValidatedOperationsService) {
        operationsService.operationsChange.subscribe(() => {
            // Reset:
            this.programGUI = [];
            this.quickResult = undefined;
            this.waitAtResult = false;

            // Update JSON:
            this.programJson = JSON.stringify(this.operationsService.operations);
            this.jsonError = undefined;

            // Update GUI:
            this.programGUI.push(Array(this.validatedOperationsService.qubitsQuantity + 1).fill({ oi: 0, color: '#ffff' }));
            const newProgramGUIRow = new Map<number, Gate2DView>();
            for (let i = 0; i < this.operationsService.operations.length; ++i) {
                const validatedOperation = this.validatedOperationsService.validatedOperations[i];
                for (const qindex of validatedOperation.operation.qi) {
                    if (newProgramGUIRow.has(qindex)) {
                        this.addRowToProgramGUI(newProgramGUIRow);
                    }
                }
                for (let j = 0; j < validatedOperation.operation.qi.length; ++j) {
                    newProgramGUIRow.set(validatedOperation.operation.qi[j], {
                        o: validatedOperation.operation,
                        oi: i,
                        ii: j,
                        color: validatedOperation.error || !validatedOperation.gate ? '#faa' : validatedOperation.gate.color,
                    });
                }
            }
            this.addRowToProgramGUI(newProgramGUIRow);
            this.addRowToProgramGUI(newProgramGUIRow);
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
            this.operationsService.emitChange();
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
            this.operationsService.emitChange();
        } catch (e) {
            this.jsonError = (e as any).message;
        }
    }

    addRowToProgramGUI(rowDescription: Map<number, Gate2DView>): void {
        const row: Gate2DView[] = [];
        let oi = Math.min(this.operationsService.operations.length, ...[...rowDescription.values()].map(g => g.oi));
        for (let i = 0; i <= this.validatedOperationsService.qubitsQuantity; ++i) {
            if (rowDescription.has(i)) {
                row.push(rowDescription.get(i)!);
                oi = Math.max(rowDescription.get(i)!.oi + 1, oi);
            } else {
                row.push({ oi, color: '#ffff' });
            }
        }
        this.programGUI.push(row);
        rowDescription.clear();
    }

    /// GUI's operations ----------------------------------------------------

    addOperationForQubit(index: number, qubitIndex: number): void {
        const newOperation: Operation = { gn: this.defaultGate.name, qi: [qubitIndex] };
        this.operationsService.add(index, newOperation);
        if (this.defaultGate.colspan !== 1) {
            this.editOperation(index);
        }
    }

    click2d(guiGate: Gate2DView, j: number): void {
        if (guiGate.o) {
            this.editOperation(guiGate.oi);
        } else {
            this.addOperationForQubit(guiGate.oi, j);
        }
    }

    addQubitBefore(index: number): void {
        for (const step of this.operationsService.operations) {
            for (let j = 0; j < step.qi.length; ++j) {
                if (step.qi[j] >= index) {
                    ++(step.qi[j]);
                }
            }
        }
        this.operationsService.emitChange();
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
        this.operationsService.emitChange();
    }

    /// Operation operations --------------------------------------------------------------

    addOperation(index: number): void {
        const newOperation: Operation = { gn: '' as GateName, qi: [] };
        this.operationsService.add(index, newOperation);
        this.editOperation(index);
    }

    editOperation(index: number): void {
        this.operationIndex = index;
    }


    exitOperation(): void {
        this.operationIndex = undefined;
        this.operationsService.emitChange();
    }

    /// Simulation -------------------------------------------------------------------

    simulate(callback?: string): void {
        let stepperData: StepperData = {
            qubitsQuantity: this.validatedOperationsService.qubitsQuantity,
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
