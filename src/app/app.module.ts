import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GateComponent } from './gate/gate.component';
import { GateViewComponent } from './gate-view/gate-view.component';

@NgModule({
  declarations: [
    AppComponent,
    GateComponent,
    GateViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
