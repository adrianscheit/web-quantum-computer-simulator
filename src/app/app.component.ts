import { Component, HostListener, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { G } from './lib/g';
import { GateName, Gates } from './lib/gates';
import { Operation, StepperData } from './lib/v';

// [{"gateName":"H","qi":[0]},{"gateName":"X","qi":[1]}]

export interface GUIGate {
    o: Operation;
    ii: number;
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
    guiProgram: GUIGate[][] = [];
    programJson: string;

    results: StepperData[] = [];
    readonly gates = Gates.gates;
    worker: Worker = new Worker('./stepper.worker', { type: 'module' });;

    ngOnInit() {
        this.programJson = localStorage.getItem('program');
        if (this.programJson) {
            this.parseJson();
            this.cookiesEnabled = true;
        } else {
            this.updateJson();
        }

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

    enableCookies(): void {
        this.cookiesEnabled = true;
        this.beforeClose();
    }

    disableCookies(): void {
        this.cookiesEnabled = false;
        localStorage.clear();
    }

    updateJson(): void {
        this.program = [];
        for (const step of this.guiProgram) {
            for (const guiGate of step) {
                if (guiGate.o.gateName && guiGate.ii === 0) {
                    this.program.push(guiGate.o);
                }
            }
        }
        this.programJson = JSON.stringify(this.program);
        console.log(this.guiProgram, '=>', this.program, this.programJson);
    }

    jsonChange(event) {
        console.log(event);
        this.programJson = event;
        this.parseJson();
    }

    parseJson(): void {
        let program: Operation[];
        try {
            program = JSON.parse(this.programJson);
            this.qubitsQuantity = 0;
            for (const operation of program) {
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
        this.program = program;
        this.guiProgram = [];
        this.addStep(0);
        console.log(this.programJson, this.qubitsQuantity);
        for (const step of this.program) {
            for (const index of step.qi) {
                if (this.guiProgram[this.guiProgram.length - 1][index].o.gateName) {
                    this.addStep(this.guiProgram.length);
                    break;
                }
            }
            for (let j = 0; j < step.qi.length; ++j) {
                this.guiProgram[this.guiProgram.length - 1][step.qi[j]] = { o: step, ii: j };
            }
        }
        console.log(this.programJson, this.program, '=>', this.guiProgram, this.qubitsQuantity);
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

    addQubit(index: number): void {
        this.qubitsQuantity++;
        for (const step of this.guiProgram) {
            step.splice(index, 0, { o: { gateName: '', qi: [step.length] }, ii: 0 });
        }
    }

    deleteQubit(i: number): void {
        this.qubitsQuantity--;
        for (const step of this.guiProgram) {
            step.splice(i, 1);
        }
        this.updateJson();
    }

    addStep(index: number): void {
        const gates = [];
        for (let i = 0; i < this.qubitsQuantity; ++i) {
            const guiGate: GUIGate = { o: { gateName: '', qi: [i] }, ii: 0 };
            gates.push(guiGate)
        }
        this.guiProgram.splice(index, 0, gates);
    }

    deleteStep(i: number): void {
        this.guiProgram.splice(i, 1);
        this.updateJson();
    }

    selectGate(gateName: GateName, stepIndex: number, gateIndex: number) {
        console.log(gateName, stepIndex, gateIndex);
        const newOperation = { gateName: gateName, qi: [] };
        for (let i = 0; i < Gates.gatesMap.get(gateName).colspan; ++i) {
            newOperation.qi.push(gateIndex + i);
            this.guiProgram[stepIndex][gateIndex + i] = { o: newOperation, ii: i }
        }
        this.updateJson();
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
        this.updateJson();
        this.parseJson();
    }

    complem(): void {

    }

}
