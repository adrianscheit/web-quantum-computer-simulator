import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Gate2DView, Result, StepperData } from './domain';
import { G } from './lib/g';
import { gates, gatesMap, x } from './lib/gates';
import { OperationsService } from './services/operations.service';
import { ValidatedOperationsService } from './services/validated-operations.service';
import { Utils } from './utils/utils';

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
            this.quickResult = undefined;
            this.waitAtResult = false;

            // Update JSON:
            this.programJson = JSON.stringify(this.operationsService.operations);
            this.jsonError = undefined;
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
        } catch (e: unknown) {
            this.jsonError = (e as {message: string}).message;
        }
    }


    // Operation operations --------------------------------------------------------------

    editOperation(index: number): void {
        this.operationIndex = index;
    }


    exitOperation(): void {
        this.operationIndex = undefined;
        this.operationsService.emitChange();
    }

    // Simulation -------------------------------------------------------------------

    simulate(callback?: string): void {
        const stepperData: StepperData = {
            qubitsQuantity: this.validatedOperationsService.qubitsQuantity,
            usedQubits: this.validatedOperationsService.usedQubits,
            operations: this.operationsService.operations,
            id: this.results.length,
            callback
        };
        this.results[stepperData.id] = stepperData;
        this.waitAtResult = true;

        const worker = new Worker(new URL('./stepper.worker', import.meta.url));
        this.workers[stepperData.id] = worker;
        worker.addEventListener('message', ({ data }) => {
            const stepperData: StepperData = data;
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
