import { Component, Output, EventEmitter, Input } from '@angular/core';
import { GateName } from '../domain';
import { gatesMap } from '../lib/gates';
import { ValidatedOperationsService } from '../services/validated-operations.service';
import { OperationsService } from '../services/operations.service';

@Component({
    selector: 'app-view1d',
    templateUrl: './view1d.component.html',
    styleUrls: ['./view1d.component.css']
})
export class View1dComponent {
    @Output() operationIndex = new EventEmitter<number>();
    readonly gatesMap = gatesMap;

    constructor(
        readonly operationsService: OperationsService,
        readonly validatedOperationsService: ValidatedOperationsService,
    ) { }

    addOperation(index: number): void {
        this.operationsService.add(index, { gn: '' as GateName, qi: [] });
        this.operationIndex.next(index);
    }
}
