import { Component, Input } from '@angular/core';
import { Operation } from '../domain';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: 'app-sample-code',
    templateUrl: './sample-code.component.html',
    styleUrls: ['./sample-code.component.css']
})
export class SampleCodeComponent {
    @Input() set code(code: Operation[]) {
        this.stringifiedCode = JSON.stringify(code);
    }

    stringifiedCode: string = '';

    constructor(private clipboard: Clipboard) {

    }

    copyToClipboard(): void {
        this.clipboard.copy(this.stringifiedCode);
    }
}
