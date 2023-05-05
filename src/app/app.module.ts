import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GateComponent } from './gate/gate.component';
import { GateViewComponent } from './gate-view/gate-view.component';
import { OperationComponent } from './operation/operation.component';
import { DefaultGateComponent } from './gate-select/default-gate/default-gate.component';
import { HttpClientModule } from '@angular/common/http';
import { LinkComponent } from './link/link.component';
import { GateSelectComponent } from './gate-select/gate-select.component';

@NgModule({
  declarations: [
    AppComponent,
    GateComponent,
    GateViewComponent,
    OperationComponent,
    DefaultGateComponent,
    LinkComponent,
    GateSelectComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
