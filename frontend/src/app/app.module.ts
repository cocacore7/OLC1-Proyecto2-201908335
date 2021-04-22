import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

import { HttpClientModule } from '@angular/common/http'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatTabsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MonacoEditorModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    HttpClientModule,
  ],
  providers: [{
    provide: MONACO_PATH,
    useValue: 'https://unpkg.com/monaco-editor@0.19.3/min/vs'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
