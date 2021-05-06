import { Component, ViewChild } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
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

export const fs : any = window["fs"];
export const child : any = window["child_process"];

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
    { name: 'File1.ty', formm: new FormControl(''), codee: '' }
  ]






  title = 'frontend';

  columna = 0

  banderaeditorr = true;
  banderaast = false;
  banderasimb = false;
  banderareporteerrores = false;
  banderareportesimbolos = false;
  simbolos = []
  cadenaerrores = ''

  public urlimagen;
  public urlimagen2;
  public urlimagen3;

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

  constructor(private monacoLoaderService: MonacoEditorLoaderService, private http: HttpClient,private sanitizer: DomSanitizer) {
    
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

  crear() {
    var ultimo = this.tabs.length +1
    this.tabs.unshift({ name: ('File'+ultimo.toString()+'.ty'), formm: new FormControl(''), codee: '' })
  }

  guardar() {
    fileSaver.saveAs(new Blob([this.editor1.getValue()], { type: "text/plain" }), 'entrada.ty');
  }

  cerrarpestania() {
    this.tabs.splice(this.selected.value, 1)
  }

  compilar() {
    this.editor2.setValue('')
    let formData = new FormData();
    let nombre = "entrada1.txt"

    formData.append('archivo', new Blob([this.tabs[this.selected.value].formm.value], { type: "text/plain" }), nombre);

    this.http.post('http://localhost:3000/compilar', formData, { responseType: 'text' }).subscribe((res:any) => {
    this.editor2.setValue(JSON.parse(res).salida)
    console.log(JSON.parse(res).salida)
    })
  }

  regresareditorast() {
    this.banderaeditorr = true;
    this.banderaast = false;
  }

  regresareditorreporteerrores() {
    this.banderaeditorr = true;
    this.banderareporteerrores = false;
  }

  regresareditorreportesimbolos() {
    this.banderaeditorr = true;
    this.banderareportesimbolos = false;
  }

  reportesimbolos() {
    this.http.get("http://localhost:3000/grafo3?a=" + new Date().getTime(), { responseType: 'text' }).subscribe(res => {
      this.urlimagen3 = "data:image/png;base64,"+res.toString()
      this.banderaeditorr = false;
      this.banderareportesimbolos = true;
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
    let formData = new FormData();
    let nombre = "entrada1.txt"

    formData.append('archivo', new Blob([this.tabs[this.selected.value].formm.value], { type: "text/plain" }), nombre);
    this.http.post("http://localhost:3000/grafo?a=" + new Date().getTime(), formData, { responseType: 'text' }).subscribe((res:any) => {
      this.urlimagen = "data:image/png;base64,"+res.toString()
      this.banderaeditorr = false;
      this.banderaast = true;
    })
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
