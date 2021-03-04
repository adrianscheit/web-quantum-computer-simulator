import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GateComponent } from './gate/gate.component';
import { GateViewComponent } from './gate-view/gate-view.component';
import { OperationComponent } from './operation/operation.component';
import { DefaultGateComponent } from './default-gate/default-gate.component';

@NgModule({
  declarations: [
    AppComponent,
    GateComponent,
    GateViewComponent,
    OperationComponent,
    DefaultGateComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
