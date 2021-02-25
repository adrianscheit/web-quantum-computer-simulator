import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface Gate {
    colspan: number
}

export interface Step {
    gates: Gate[]
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    cookiesEnabled = false;
    progress = 0.118964561534;
    prod = environment.production;
    qubitsQuantity = 5;

    program: Step[] = [{ gates: [] }, { gates: [] }, { gates: [] }];

    enableCookies(): void {
        this.cookiesEnabled = true;
    }

    disableCookies(): void {
        this.cookiesEnabled = false;
        localStorage.clear();
    }

    getProgess(): number {
        return this.progress * 100;
    }

    addQubit(): void {
        for (const step of this.program) {
            step.gates.push({ colspan: 1 });
        }
    }

    deleteQubit(i: number): void {
        for (const step of this.program) {
            step.gates.splice(i, 1);
        }
    }

    getProgram(): string {
        return JSON.stringify(this.program);
    }

    setProgram(json: string): void {
        this.program = JSON.parse(json);
    }

    addStep(): void {
        const gates = [];
        for(let i=0; i<this.qubitsQuantity; ++i){
            gates.push()
        }
        this.program.push();
    }

    deleteStep(i: number): void {
        this.program.splice(i, 1);
    }
}
