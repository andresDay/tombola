import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElementsComponent } from './elements/elements.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TombolaComponent } from './tombola/tombola.component';
import { WinnerComponent } from './winner/winner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    ElementsComponent,
    TombolaComponent,
    WinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
