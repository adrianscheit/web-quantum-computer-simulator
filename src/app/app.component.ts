import { Component, HostListener, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { G } from './lib/g';
import { GateName, Gates } from './lib/gates';
import { Result, StepperData, V } from './lib/v';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    cookiesEnabled = false;
    progress = 0.118964561534;
    prod = environment.production;
    qubitsIndexes: number[] = [0, 1, 2, 3, 4];

    programGUI: GateName[][] = [['H', 'H', 'H', 'H', 'H']];
    programJson: string;
    defaultGateName: GateName = '';

    results: StepperData[] = [];
    readonly gates = Gates.gates;
    worker: Worker = new Worker('./stepper.worker', { type: 'module' });;

    ngOnInit() {
        this.programJson = localStorage.getItem('program');
        if (this.programJson) {
            this.parseJson();
            this.cookiesEnabled = true;
        }
        this.updateJson();

        console.log(Gates.gatesMap, Gates.gates);
    }

    @HostListener('window:beforeunload')
    beforeClose() {
        if (this.cookiesEnabled) {
            localStorage.setItem('program', this.programJson);
        }
    }

    enableCookies(): void {
        this.cookiesEnabled = true;
        this.beforeClose();
    }

    disableCookies(): void {
        this.cookiesEnabled = false;
        localStorage.clear();
    }

    getProgess(): number {
        return this.progress * 100;
    }

    updateJson(): void {
        this.programJson = JSON.stringify(this.programGUI);
    }

    parseJson(): void {
        this.programGUI = JSON.parse(this.programJson);
        this.qubitsIndexes = [];
        for (let i = 0; i < this.programGUI[0]?.length; ++i) {
            this.qubitsIndexes.push(i);
        }
    }

    getGates(gateNames: GateName[]): G[] {
        const result: G[] = [];
        for (let i = 0; i < gateNames.length; ++i) {
            const gate = Gates.gatesMap.get(gateNames[i]);
            console.log(gate);
            result.push(gate);
            i += gate.colspan - 1;
        }
        return result;
    }

    addQubit(): void {
        this.qubitsIndexes.push(this.qubitsIndexes.length);
        for (const step of this.programGUI) {
            step.push(this.defaultGateName);
        }
        this.updateJson();
    }

    deleteQubit(i: number): void {
        this.qubitsIndexes.pop();
        for (const step of this.programGUI) {
            step.splice(i, 1);
        }
        this.updateJson();
    }

    addStep(): void {
        const gates = [];
        for (const i of this.qubitsIndexes) {
            gates.push(this.defaultGateName)
        }
        this.programGUI.push(gates);
        this.updateJson();
    }

    deleteStep(i: number): void {
        this.programGUI.splice(i, 1);
        this.updateJson();
    }

    selectGate(gateName: GateName, stepIndex: number, gateIndex: number) {
        console.log(gateName, stepIndex, gateIndex);
        this.programGUI[stepIndex][gateIndex] = gateName;
        this.updateJson();
    }

    simulate(): void {
        const stepperData: StepperData = { initQubits: this.qubitsIndexes.map(() => new V()), operations: [] };
        this.worker.postMessage(stepperData);
        this.results.push(stepperData);
    }

    cancel(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
}
