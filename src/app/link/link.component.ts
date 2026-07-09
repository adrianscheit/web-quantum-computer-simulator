import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-link',
    templateUrl: './link.component.html',
    styleUrls: ['./link.component.css'],
    standalone: false
})
export class LinkComponent {
    @Input() link: string = '';
}
