import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DefaultGateComponent } from './gate-select/default-gate/default-gate.component';
import { GateSelectComponent } from './gate-select/gate-select.component';
import { GateViewComponent } from './gate-view/gate-view.component';
import { LinkComponent } from './link/link.component';
import { OperationComponent } from './operation/operation.component';
import { SampleCodeComponent } from './sample-code/sample-code.component';
import { View1dComponent } from './view1d/view1d.component';
import { GateComponent } from './view2d/gate/gate.component';
import { View2dComponent } from './view2d/view2d.component';

@NgModule({
    declarations: [
        AppComponent,
        GateComponent,
        GateViewComponent,
        OperationComponent,
        DefaultGateComponent,
        LinkComponent,
        GateSelectComponent,
        SampleCodeComponent,
        View1dComponent,
        View2dComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
