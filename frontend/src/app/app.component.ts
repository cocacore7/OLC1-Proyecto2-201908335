import { Component, ViewChild } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import {
  MonacoEditorComponent,
  MonacoEditorConstructionOptions,
  MonacoEditorLoaderService,
  MonacoStandaloneCodeEditor
} from '@materia-ui/ngx-monaco-editor';

import { HttpClient } from '@angular/common/http';

import * as fileSaver from 'file-saver';
import { dependenciesFromGlobalMetadata } from '@angular/compiler/src/render3/r3_factory';

import { FormControl, Validators } from '@angular/forms';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  check: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  selected = new FormControl(0)
  tabs = [
    { name: 'File1.js', formm: new FormControl(''), codee: '' }
  ]






  title = 'frontend';

  columna = 0

  banderaeditorr = true;
  banderaast = false;
  banderabloque = false;
  banderasimb = false;
  banderareporteerrores = false;
  banderareportesimbolos = false;
  banderareportefunciones = false;
  banderareporteoptimizacion = false;
  simbolos = []
  optimizaciones = []
  funciones = []
  cadenaerrores = ''

  urlimagen = "http://localhost:3000/grafo?a=" + new Date().getTime();
  urlimagen2 = "http://localhost:3000/grafo2?a=" + new Date().getTime();

  @ViewChild(MonacoEditorComponent, { static: false })
  monacoComponent: MonacoEditorComponent;
  editorOptions: MonacoEditorConstructionOptions = {
    theme: 'myCustomTheme',
    language: 'html',
    roundedSelection: true,
    autoIndent: true
  };
  code = this.getCode();

  editorOptions2: MonacoEditorConstructionOptions = {
    theme: 'myCustomTheme',
    language: 'html',
    roundedSelection: true,
    autoIndent: true,
    readOnly: true
  };
  code2 = this.getCode2()

  editorOptions3: MonacoEditorConstructionOptions = {
    theme: 'myCustomTheme',
    language: 'html',
    roundedSelection: true,
    autoIndent: true,
    readOnly: true
  };
  code3 = this.getCode3()

  editor1: MonacoStandaloneCodeEditor;
  editor2: MonacoStandaloneCodeEditor;
  editor3: MonacoStandaloneCodeEditor;

  archivo: File = null;

  constructor(private monacoLoaderService: MonacoEditorLoaderService, private http: HttpClient) {

    this.monacoLoaderService.isMonacoLoaded$
      .pipe(
        filter(isLoaded => isLoaded),
        take(1)
      )
      .subscribe(() => {
        monaco.editor.defineTheme('myCustomTheme', {
          base: 'vs', // can also be vs or hc-black
          inherit: true, // can also be false to completely replace the builtin rules
          rules: [
            {
              token: 'comment',
              foreground: 'ffa500',
              fontStyle: 'italic underline'
            },
            { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
            { token: 'comment.css', foreground: '0000ff' } // will inherit fontStyle from `comment` above
          ],
          colors: {}
        });
      });
  }

  editorInit(editor: MonacoStandaloneCodeEditor) {
    //monaco.editor.setTheme('vs');
    editor.setSelection({
      startLineNumber: 1,
      startColumn: 1,
      endColumn: 50,
      endLineNumber: 3
    });
    this.editor1 = editor;
  }

  editorInit2(editor: MonacoStandaloneCodeEditor) {
    //monaco.editor.setTheme('vs');
    editor.setSelection({
      startLineNumber: 1,
      startColumn: 1,
      endColumn: 50,
      endLineNumber: 3
    });
    this.editor2 = editor;
  }

  editorInit3(editor: MonacoStandaloneCodeEditor) {
    //monaco.editor.setTheme('vs');
    editor.setSelection({
      startLineNumber: 1,
      startColumn: 1,
      endColumn: 50,
      endLineNumber: 3
    });
    this.editor3 = editor;
  }

  getCode() {
    return (''
    );
  }

  getCode2() {
    return (''
    );
  }

  getCode3() {
    return (''
    );
  }

  guardar() {
    fileSaver.saveAs(new Blob([this.editor1.getValue()], { type: "text/plain" }), 'entrada.txt');
  }

  cerrarpestania() {
    this.tabs.splice(this.selected.value, 1)
  }

  compilar() {
    this.editor3.setValue('')
    this.editor2.setValue('')
    let formData = new FormData();
    let nombre = "entrada1.txt"

    formData.append('archivo', new Blob([this.tabs[this.selected.value].formm.value], { type: "text/plain" }), nombre);

    this.http.post('http://localhost:3000/compilar', formData, { responseType: 'text' }).subscribe((res:any) => {
    this.editor2.setValue(JSON.parse(res).salida)
    console.log(JSON.parse(res).salida)
    })
  }

  optimizar() {
    this.editor3.setValue('')
    this.editor2.setValue('')
    let formData = new FormData();
    let nombre = "entrada1.txt"
    formData.append('archivo', new Blob([this.tabs[this.selected.value].formm.value], { type: "text/plain" }), nombre);

    this.http.post('http://localhost:3000/compilar2', formData, { responseType: 'text' }).subscribe(res => {
      this.editor2.setValue(res.toString())
      this.http.post('http://localhost:3000/errores', formData, { responseType: 'text' }).subscribe(res => {
        this.editor3.setValue(res.toString())
      })
    })
  }

  regresareditorast() {
    this.banderaeditorr = true;
    this.banderaast = false;
  }

  regresareditorbloque() {
    this.banderaeditorr = true;
    this.banderabloque = false;
  }

  regresareditorreporteerrores() {
    this.banderaeditorr = true;
    this.banderareporteerrores = false;
  }

  regresareditorreportesimbolos() {
    this.banderaeditorr = true;
    this.banderareportesimbolos = false;
  }

  regresareditorfunciones() {
    this.banderaeditorr = true;
    this.banderareportefunciones = false;
  }

  regresareditoroptimizacion() {
    this.banderaeditorr = true;
    this.banderareporteoptimizacion = false;
  }

  reportesimbolos() {
    this.http.post('http://localhost:3000/simbolos', {}, { responseType: 'text' }).subscribe(res => {
      this.simbolos = JSON.parse(res.toString())
      this.banderaeditorr = false;
      this.banderareportesimbolos = true;
    })
  }

  reportefunciones() {
    this.http.post('http://localhost:3000/funciones', {}, { responseType: 'text' }).subscribe(res => {
      this.funciones = JSON.parse(res.toString())
      this.banderaeditorr = false;
      this.banderareportefunciones = true;
    })
  }

  reporteoptimizacion() {
    this.http.post('http://localhost:3000/optimizaciones', {}, { responseType: 'text' }).subscribe(res => {
      this.optimizaciones = JSON.parse(res.toString())
      this.banderaeditorr = false;
      this.banderareporteoptimizacion = true;
    })
  }

  reporteerrores() {
    this.banderaeditorr = false;
    this.banderareporteerrores = true;
    this.http.post('http://localhost:3000/errores', {}, { responseType: 'text' }).subscribe(res => {
      this.cadenaerrores = res.toString()
    })
  }

  reporteast() {
    this.banderaeditorr = false;
    this.banderaast = true;
    this.urlimagen = "http://localhost:3000/grafo?a=" + new Date().getTime();
  }

  reportebloque() {
    this.banderaeditorr = false;
    this.banderabloque = true;
    this.urlimagen = "http://localhost:3000/grafo2?a=" + new Date().getTime();
  }

  fileChanged(files: FileList) {

    this.archivo = files.item(0)
    var myReader: FileReader = new FileReader();

    this.tabs.push({ name: this.archivo.name, formm: new FormControl(''), codee: '' })
    myReader.onloadend = (e) => {
      this.selected.setValue(this.tabs.length - 1);
      this.tabs[this.selected.value].formm.setValue(myReader.result.toString())
    };

    myReader.readAsText(this.archivo);
  }

  abrir() {
    document.getElementById('inputt').click()
  }

}
