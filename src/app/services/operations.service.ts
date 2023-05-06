import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Operation } from '../domain';

@Injectable({
    providedIn: 'root'
})
export class OperationsService {
    private _operations: Operation[] = [];
    get operations(): Operation[] {
        return this._operations;
    }
    private _operationsChange = new Subject<void>();
    readonly operationsChange = this._operationsChange.asObservable();

    complement(): void {
        for (let i = this.operations.length - 1; i >= 0; --i) {
            this.operations.push({ gn: this.operations[i].gn, qi: [...this.operations[i].qi] });
        }
        this.emitChange();
    }

    set(operations: Operation[]): void {
        this._operations = operations;
        this.emitChange();
    }

    add(index: number, operation: Operation): void {
        this._add(index, operation);
        this.emitChange();
    }

    move(oldIndex: number, newIndex: number): void {
        this._add(newIndex, this._remove(oldIndex));
        this.emitChange();
    }

    remove(index: number): void {
        this._remove(index);
        this.emitChange();
    }

    emitChange(): void {
        this._operationsChange.next();
    }

    private validateIndex(index: number): void {
        if (index < 0 || index > this.operations.length) {
            throw new Error(`invalid index ${index} for array of ${this.operations.length} operations`);
        }
    }

    private _add(index: number, operation: Operation): void {
        this.validateIndex(index);
        this.operations.splice(index, 0, operation);
    }

    private _remove(index: number): Operation {
        this.validateIndex(index + 1);
        return this.operations.splice(index, 1)[0];
    }
}
