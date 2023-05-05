import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Operation } from './domain';

@Injectable({
    providedIn: 'root'
})
export class OperationsService {
    operations: Operation[] = [];
    operationsChange = new Subject<void>();

    complement(): void {
        for (let i = this.operations.length - 1; i >= 0; --i) {
            this.operations.push({ gn: this.operations[i].gn, qi: [...this.operations[i].qi] });
        }
        this.operationsChange.next();
    }
}
