const TIPO_INSTRUCCION = require('../arbol/instrucciones').TIPO_INSTRUCCION;
const TIPO_OPERACION = require('../arbol/instrucciones').TIPO_OPERACION;
const TIPO_VALOR = require('../arbol/instrucciones').TIPO_VALOR;
const TIPO_DATO = require('../arbol/tablasimbolos').TIPO_DATO;
const fs = require('fs');
var base64 = require('base-64');

const TS = require('../arbol/tablasimbolos').TS;
let salida = '';
let tsReporte = new TS([]);
let grafoarbol = ""
let expresionpro = 0
let asignacion = 0
let declaracion = 0
let parametro = 0
let llamada = 0
let imprimirr = 0
let iff = 0
let condicioniff = 0
let cuerpoiff = 0
let switchh = 0
let casoswitchh = 0
let defaultswitchh = 0
let cuerpocasoswitchh = 0
let whilee =0
let condicionwhilee =0
let cuerpowhilee =0
let dowhilee=0
let condiciondowhilee =0
let cuerpodowhilee =0
let forr = 0
let condicionforr = 0
let cuerpoforr = 0
let breakk = 0
let continuee = 0
let returnn = 0
let cantif = 0
let cantswitch = 0
let operando = 0
let metodo = 0
let caso = false

function GrafoArbol(arbol){
    expresionpro = 0
    asignacion = 0
    declaracion = 0
    parametro = 0
    llamada = 0
    imprimirr = 0
    iff = 0
    condicioniff = 0
    cuerpoiff = 0
    switchh = 0
    casoswitchh = 0
    defaultswitchh = 0
    cuerpocasoswitchh = 0
    whilee =0
    condicionwhilee =0
    cuerpowhilee =0
    dowhilee=0
    condiciondowhilee =0
    cuerpodowhilee =0
    forr = 0
    condicionforr = 0
    cuerpoforr = 0
    breakk = 0
    continuee = 0
    returnn = 0
    cantif = 0
    cantswitch = 0
    operando = 0
    metodo = 0
    caso = false
    tsReporte = new TS([]);
    salida='';
    let tsglobal = new TS([]);
    let tslocal = new TS([]);
    let metodos = [];
    let main = [];
    let banderaciclo = [];
    let tipots = []
    let padre = "raiz"
    grafoarbol = ""
    grafoarbol = "digraph G { \n"
    grafoarbol += "raiz[label=\"Raiz\",style=\"filled\", fillcolor=\"red:white\"];\n"
    ejecutarbloqueglobal(arbol, tsglobal, tslocal,tipots,"BloqueGlobal-", metodos, main,padre);
    if(main.length==1){
        metodos.forEach(metodo2=>{
            if(metodo2.identificador==main[0].identificador){
                if(metodo2.parametros.length==main[0].parametros.length){
                    var valoresmetodo = [];
                    for(var contador = 0; contador<main[0].parametros.length;contador++){
                        var valor = procesarexpresion(main[0].parametros[contador],tsglobal, tslocal,tipots);
                        if(valor.tipo != metodo2.parametros[contador].tipo){
                            console.log("Error el valor mandado no es el mismo que se declaro")
                            salida = "Error Semantico"
                            return;
                        }
                        else{
                            valoresmetodo.push(valor);
                        }       
                    }
                    var tslocal2=new TS([]);
                    tipots.push(".");
                    grafoarbol += "main"+"[label=\"Metodo Exec: "+main[0].identificador+"\",style=\"filled\", fillcolor=\"white:red\"];\n"
                    grafoarbol += "raiz"+"->"+"main;\n"
                    padre = "main"
                    for(var contador=0;contador<main[0].parametros.length;contador++){
                        grafoarbol += "parametro"+parametro.toString()+"[label=\"Parametro Exec: "+main[0].identificador+"\"];\n"
                        grafoarbol += "main"+"->"+"parametro"+parametro.toString()+";\n"
                        parametro++
                        tslocal2.agregar(valoresmetodo[contador].tipo, metodo2.parametros[contador].identificador,valoresmetodo[contador],"ParametroMain-");
                        tsReporte.agregar(valoresmetodo[contador].tipo, metodo2.parametros[contador].identificador,valoresmetodo[contador],"ParametroMain-");
                    }
                    ejecutarbloquelocal(metodo2.instrucciones, tsglobal, tslocal2,tipots,"BloqueLocalPrincipal-",padre, metodos,banderaciclo);
                }else{
                    console.log("Error se estan mandando una cantidad de valores mayor a la que recibe el metodo")
                    salida = "Error Semantico"
                }
            }else{
                var valoresmetodo = [];
                for(var contador = 0; contador<metodo2.parametros.length;contador++){
                    var valor = procesarexpresion(metodo2.parametros[contador],tsglobal, tslocal,tipots);
                    if(valor.tipo != metodo2.parametros[contador].tipo){
                        console.log("Error el valor mandado no es el mismo que se declaro")
                        salida = "Error Semantico"
                        return;
                    }
                    else{
                        valoresmetodo.push(valor);
                    }       
                }
                var tslocal2=new TS([]);
                tipots.push(".");
                grafoarbol += "main"+metodo.toString()+"[label=\"Metodo: "+metodo2.identificador+"\",style=\"filled\", fillcolor=\"white:red\"];\n"
                grafoarbol += "raiz"+"->"+"main"+metodo.toString()+";\n"
                padre = "main"+metodo.toString()
                metodo++
                for(var contador=0;contador<metodo2.parametros.length;contador++){
                    grafoarbol += "parametro"+parametro.toString()+"[label=\"Parametro: "+metodo2.identificador+"\"];\n"
                    grafoarbol += padre+"->"+"parametro"+parametro.toString()+";\n"
                    parametro++
                    tslocal2.agregar(valoresmetodo[contador].tipo, metodo2.parametros[contador].identificador,valoresmetodo[contador],"ParametroMain-");
                    tsReporte.agregar(valoresmetodo[contador].tipo, metodo2.parametros[contador].identificador,valoresmetodo[contador],"ParametroMain-");
                }
                ejecutarbloquelocal(metodo2.instrucciones, tsglobal, tslocal2,tipots,"BloqueLocalPrincipal-",padre, metodos,banderaciclo);
            }
        });
    }
    else{
        console.log("No puede haber mas de un main");
        salida = "Error Semantico"
    }
    grafoarbol += "}\n"
    fs.readFile('./routes/arbol/Arbol.dot', 'utf8', function(err, data) {
        if (err) {
          return console.log(err);
        }
    });
    fs.writeFile("./routes/arbol/Arbol.dot", grafoarbol, function(err) {
        if (err) {
          return console.log(err);
        }
      });
    const child = require("child_process");
    child.spawn('cmd',['/c','dot -Tpng ./routes/arbol/Arbol.dot -o C:/Users/usuario/OneDrive/Escritorio/Imagenes/Arbol.png'])
    var bitmap = fs.readFileSync("C:/Users/usuario/OneDrive/Escritorio/Imagenes/Arbol.png");
    let base = new Buffer.from(bitmap).toString('base64')
    return base;
}


function ejecutarbloqueglobal(instrucciones, tsglobal, tslocal,tipots,ambito, metodos, main,padre){
    instrucciones.forEach((instruccion)=>{
        if (salida == "Error Semantico"){
            console.log("Error Semantico")
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.DECLARACION){
            ejecutardeclaracionglobal(instruccion, tsglobal,tslocal,tipots, ambito+"DeclaracionGlobal-",padre);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.ASIGNACION){
            ejecutarasignacionglobal(instruccion, tsglobal, tslocal,tipots,padre);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.METODO){
            metodos.push(instruccion);
        }
        else if(instruccion.tipo==TIPO_INSTRUCCION.MAIN){
            
            main.push(instruccion);
        }
    });
}

function ejecutarbloquelocal(instrucciones, tsglobal, tslocal,tipots,ambito,padre,metodos,banderaciclo){
    for(var i=0; i<instrucciones.length; i++){
        instruccion = instrucciones[i];
        if (salida == "Error Semantico"){
            console.log("Error Semantico");
            continue;
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.DECLARACION){
            ejecutardeclaracionlocal(instruccion, tsglobal,tslocal,tipots,ambito+"DeclaracionLocal-",padre,metodos);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.ASIGNACION){
            ejecutarasignacionlocal(instruccion, tsglobal, tslocal,tipots,padre,metodos);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.LLAMADA){
            if(banderaciclo.length != 0){
                var posible = ejecutarllamada(instruccion,padre);
                if(posible){
                    return posible;
                }
            }
            else{
                var posible = ejecutarllamada(instruccion,padre);
                if(posible){
                    return posible;
                }
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.IMPRIMIR){
            ejecutarimprimir(instruccion, tsglobal, tslocal,tipots,padre,metodos);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.IFF){
            var tslocal2=new TS([]);
                tslocal.pushts(tslocal2)
                tipots.push(["If"]);
                var posible = ejecutarif(instruccion, tsglobal, tslocal,tipots,ambito+"BloqueIF-",padre,banderaciclo);
                if(posible){
                    tslocal.popts();
                    tipots.pop();
                    return posible;
                }
                tipots.pop();
                tslocal.popts();
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.SWITCHH){
            if (cantswitch == 0){
                cantswitch++
                var tslocal2=new TS([]);
                tslocal.pushts(tslocal2)
                tipots.push(["IDSwitch"]);
                grafoarbol += "switch"+switchh.toString()+"[label=\"Instruccion SWITCH\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"switch"+switchh.toString()+";\n"
                var posible = ejecutarswitch(instruccion, tsglobal, tslocal,tipots,ambito+"BloqueSWITCH-","switch"+switchh.toString(),metodos,banderaciclo);
                switchh++
                cantswitch--
                if(posible){
                    tslocal.popts();
                    tipots.pop();
                    return posible;
                }
                tipots.pop();
                tslocal.popts();
            }else{
                cantswitch++
                switchh++
                var tslocal2=new TS([]);
                tslocal.pushts(tslocal2)
                tipots.push(["IDSwitch"]);
                grafoarbol += "switch"+switchh.toString()+"[label=\"Instruccion SWITCH\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"switch"+switchh.toString()+";\n"
                var posible = ejecutarswitch(instruccion, tsglobal, tslocal,tipots,ambito+"BloqueSWITCH-","switch"+switchh.toString(),metodos,banderaciclo);
                switchh++
                cantswitch--
                if(posible){
                    tslocal.popts();
                    tipots.pop();
                    return posible;
                }
                tipots.pop();
                tslocal.popts();
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.WHILEE){
            if(banderaciclo.length == 0){
                grafoarbol += "while"+whilee.toString()+"[label=\"Instruccion WHILE\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"while"+whilee.toString()+";\n"
                var posible = ejecutarwhile(instruccion, tsglobal, tslocal,tipots,ambito+"BloqueWHILE-","while"+whilee.toString(),metodos,banderaciclo);
                whilee++
                if(posible){
                    return posible;
                }
            }else{
                whilee++
                grafoarbol += "while"+whilee.toString()+"[label=\"Instruccion WHILE\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"while"+whilee.toString()+";\n"
                var posible = ejecutarwhile(instruccion, tsglobal, tslocal,tipots,ambito+"BloqueWHILE-","while"+whilee.toString(),metodos,banderaciclo);
                whilee++
                if(posible){
                    return posible;
                }
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.DOWHILEE){
            if(banderaciclo.length == 0){
                grafoarbol += "dowhile"+dowhilee.toString()+"[label=\"Instruccion DO WHILE\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"dowhile"+dowhilee.toString()+";\n"
                var posible = ejecutardowhile(instruccion, tsglobal, tslocal,tipots,ambito+"BloqueDOWHILE-","dowhile"+dowhilee.toString(),metodos,banderaciclo);
                dowhilee++
                if(posible){
                    return posible;
                }
            }else{
                dowhilee++
                grafoarbol += "dowhile"+dowhilee.toString()+"[label=\"Instruccion DO WHILE\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"dowhile"+dowhilee.toString()+";\n"
                var posible = ejecutardowhile(instruccion, tsglobal, tslocal,tipots,ambito+"BloqueDOWHILE-","dowhile"+dowhilee.toString(),metodos,banderaciclo);
                dowhilee++
                if(posible){
                    return posible;
                }
            }
            
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.FORR){
            if(banderaciclo.length == 0){
                var tslocal2=new TS([]);
                tslocal.pushts(tslocal2)
                tipots.push(["VariableFor"]);
                grafoarbol += "for"+forr.toString()+"[label=\"Instruccion FOR\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"for"+forr.toString()+";\n"
                var posible = ejecutarfor(instruccion, tsglobal, tslocal,tipots,ambito+"BloqueFOR-","for"+forr.toString(),metodos,banderaciclo);
                forr++
                if(posible){
                    tslocal.popts();
                    tipots.pop();
                    return posible;
                }
                tipots.pop();
                tslocal.popts();
            }else{
                forr++
                var tslocal2=new TS([]);
                tslocal.pushts(tslocal2)
                tipots.push(["VariableFor"]);
                grafoarbol += "for"+forr.toString()+"[label=\"Instruccion FOR\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"for"+forr.toString()+";\n"
                var posible = ejecutarfor(instruccion, tsglobal, tslocal,tipots,ambito+"BloqueFOR-","for"+forr.toString(),metodos,banderaciclo);
                forr++
                if(posible){
                    tslocal.popts();
                    tipots.pop();
                    return posible;
                }
                tipots.pop();
                tslocal.popts();
                }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.BREAK){
            grafoarbol += "break"+breakk.toString()+"[label=\"Instruccion BREAK\",style=\"filled\", fillcolor=\"red\"];\n"
            grafoarbol += padre+"->"+"break"+breakk.toString()+";\n"
            padre = "break"+breakk.toString()
            breakk++
            if(banderaciclo != 0){
                return{
                    tipo_resultado: TIPO_INSTRUCCION.BREAK,
                    resultado: undefined
                }
            }else{
                if(caso){
                    return{
                        tipo_resultado: TIPO_INSTRUCCION.BREAK,
                        resultado: undefined
                    }
                }else{
                    salida = "Error Semantico";
                    console.log("No puede haber un break sin un ciclo")
                    return{
                        tipo_resultado: TIPO_INSTRUCCION.ERRORR,
                        resultado: "No puede haber un continue sin un ciclo"
                    }
                }
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.CONTINUE){
            grafoarbol += "continue"+continuee.toString()+"[label=\"Instruccion CONTINUE\",style=\"filled\", fillcolor=\"red\"];\n"
            grafoarbol += padre+"->"+"continue"+continuee.toString()+";\n"
            padre = "continue"+continuee.toString()
            continuee++
            if(banderaciclo.length != 0){
                return{
                    tipo_resultado: TIPO_INSTRUCCION.CONTINUE,
                    resultado: undefined
                }
            }else{
                //salida = "Error Semantico";
                console.log("No puede haber un continue sin un ciclo")
                return{
                    tipo_resultado: TIPO_INSTRUCCION.ERRORR,
                    resultado: "No puede haber un continue sin un ciclo"
                }
            }
            
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.RETURN){
            grafoarbol += "return"+returnn.toString()+"[label=\"Instruccion RETURN\",style=\"filled\", fillcolor=\"red\"];\n"
            grafoarbol += padre+"->"+"return"+returnn.toString()+";\n"
            padre = "return"+returnn.toString()
            returnn++
            return{
                tipo_resultado: TIPO_INSTRUCCION.RETURN,
                resultado: undefined
            }
        }
    }
}

function ejecutarimprimir(instruccion, tsglobal, tslocal,tipots,padre,metodos){
    grafoarbol += "imprimir"+imprimirr.toString()+"[label=\"Funcion Imprimir\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
    grafoarbol += padre+"->"+"imprimir"+imprimirr.toString()+";\n"
    var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal,tipots,"imprimir"+imprimirr.toString(),metodos);
    imprimirr++
    if (instruccion.expresion === "\n"){
        salida+='\n';
    }
    else if (valor === undefined){
        salida = "Error Semantico";
    }
    else{
        salida+=valor.valor+'\n';
    }
}

function ejecutardeclaracionglobal(instruccion, tsglobal, tslocal,tipots,ambito,padre,metodos){
    if(instruccion.expresion == undefined){
        var error = tsglobal.agregar(instruccion.tipo_dato, instruccion.id, valor,ambito+"Variable",metodos);
        if (error == undefined){
            salida = "Error Semantico";
        }
        grafoarbol += "declaracion"+declaracion.toString()+"[label=\"Declaracion Global: "+instruccion.id+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
        grafoarbol += padre+"->"+"declaracion"+declaracion.toString()+";\n"
        declaracion++
    }else{
        grafoarbol += "valordeclaracion"+declaracion.toString()+"[label=\"Valor Declaracion Global\"];\n"
        var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal,tipots,"valordeclaracion"+declaracion.toString(),metodos);
        declaracion++
        if (valor == undefined){
            salida = "Error Semantico";
        }else{
            var error = tsglobal.agregar(instruccion.tipo_dato, instruccion.id, valor,ambito+"Variable",metodos);
            if (error == undefined){
                salida = "Error Semantico";
            }
            grafoarbol += "declaracion"+declaracion.toString()+"[label=\"Declaracion Global: "+instruccion.id+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
            grafoarbol += padre+"->"+"declaracion"+declaracion.toString()+";\n"
            grafoarbol += "declaracion"+declaracion.toString()+"->"+"valordeclaracion"+(declaracion-1).toString()+";\n"
            declaracion++
        }
    }
}

function ejecutardeclaracionlocal(instruccion, tsglobal, tslocal,tipots,ambito,padre,metodos){
    if(instruccion.expresion == undefined){
        if (tslocal.lengthts() == 0){
            var error =  tslocal.agregar(instruccion.tipo_dato, instruccion.id, valor,ambito+"Variable",metodos);
            if (error == undefined){
                salida = "Error Semantico";
            }
            grafoarbol += "declaracion"+declaracion.toString()+"[label=\"Declaracion Local: "+instruccion.id+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
            grafoarbol += padre+"->"+"declaracion"+declaracion.toString()+";\n"
            declaracion++
        }else{
            var auxactual = tslocal.popts();
            if (auxactual.id == undefined){
                var error =  auxactual.agregar(instruccion.tipo_dato, instruccion.id, valor,ambito+"Variable",metodos);
                if (error == undefined){
                    salida = "Error Semantico";
                }
                grafoarbol += "declaracion"+declaracion.toString()+"[label=\"Declaracion Local: "+instruccion.id+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"declaracion"+declaracion.toString()+";\n"
                declaracion++
                tslocal.pushts(auxactual);
            }else{
                tslocal.pushts(auxactual);
                var error =  tslocal.agregar(instruccion.tipo_dato, instruccion.id, valor,ambito+"Variable",metodos);
                if (error == undefined){
                    salida = "Error Semantico";
                }
                grafoarbol += "declaracion"+declaracion.toString()+"[label=\"Declaracion Local: "+instruccion.id+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"declaracion"+declaracion.toString()+";\n"
                declaracion++
            }
        }
    }else{
        grafoarbol += "valordeclaracion"+declaracion.toString()+"[label=\"Valor Declaracion Local\"];\n"
        var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal,tipots,"valordeclaracion"+declaracion.toString(),metodos);
        declaracion++
        if (valor == undefined){
            salida = "Error Semantico";
        }else{
            if (tslocal.lengthts() == 0){
                var error =  tslocal.agregar(instruccion.tipo_dato, instruccion.id, valor,ambito+"Variable",metodos);
                if (error == undefined){
                    salida = "Error Semantico";
                }
                grafoarbol += "declaracion"+declaracion.toString()+"[label=\"Declaracion Local: "+instruccion.id+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                grafoarbol += padre+"->"+"declaracion"+declaracion.toString()+";\n"
                grafoarbol += "declaracion"+declaracion.toString()+"->"+"valordeclaracion"+(declaracion-1).toString()+";\n"
                declaracion++
            }else{
                var auxactual = tslocal.popts();
                if (auxactual.id == undefined){
                    var error =  auxactual.agregar(instruccion.tipo_dato, instruccion.id, valor,ambito+"Variable",metodos);
                    if (error == undefined){
                        salida = "Error Semantico";
                    }
                    grafoarbol += "declaracion"+declaracion.toString()+"[label=\"Declaracion Local: "+instruccion.id+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                    grafoarbol += padre+"->"+"declaracion"+declaracion.toString()+";\n"
                    grafoarbol += "declaracion"+declaracion.toString()+"->"+"valordeclaracion"+(declaracion-1).toString()+";\n"
                    declaracion++
                    tslocal.pushts(auxactual);
                }else{
                    tslocal.pushts(auxactual);
                    var error =  tslocal.agregar(instruccion.tipo_dato, instruccion.id, valor,ambito+"Variable",metodos);
                    if (error == undefined){
                        salida = "Error Semantico";
                    }
                    grafoarbol += "declaracion"+declaracion.toString()+"[label=\"Declaracion Local: "+instruccion.id+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                    grafoarbol += padre+"->"+"declaracion"+declaracion.toString()+";\n"
                    grafoarbol += "declaracion"+declaracion.toString()+"->"+"valordeclaracion"+(declaracion-1).toString()+";\n"
                    declaracion++
                }
            }
        }
    }
}

function ejecutarasignacionglobal(instruccion, tsglobal, tslocal,tipots,padre,metodos){
    grafoarbol += "valorasignacion"+declaracion.toString()+"[label=\"Valor Asignacion Global\"];\n"
    var valor = procesarexpresion(instruccion.expresion,tsglobal, tslocal,tipots,metodos);
    asignacion++
    if(tsglobal.obtener(instruccion.identificador)!=undefined){
        var error =  tsglobal.actualizar(instruccion.identificador, valor,metodos);
        if (error == undefined){
            salida = "Error Semantico";
        }
        grafoarbol += "asignacion"+asignacion.toString()+"[label=\"Asignacion Global: "+instruccion.identificador+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
        grafoarbol += padre+"->"+"asignacion"+asignacion.toString()+";\n"
        grafoarbol += "asignacion"+asignacion.toString()+"->"+"valorasignacion"+(asignacion-1).toString()+";\n"
        asignacion++
    }
}

function ejecutarasignacionlocal(instruccion, tsglobal, tslocal,tipots,padre,metodos){
    grafoarbol += "valorasignacion"+asignacion.toString()+"[label=\"Valor Asignacion Local\"];\n"
    var valor = procesarexpresion(instruccion.expresion,tsglobal, tslocal,tipots,"valorasignacion"+asignacion.toString(),metodos);
    asignacion++
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        if(tslocal != undefined){
            var encontrado = false;
            var aux = new TS([]);
            var postipo = tipots.length;
            while(postipo!=0) {
                if ((typeof tipots[postipo-1]) == "object"){
                    var auxactual = tslocal.popts();
                    aux.pushts(auxactual);
                    if(auxactual.obtener(instruccion.identificador)!=undefined){
                        var error = auxactual.actualizar(instruccion.identificador, valor,metodos);
                        if (error == undefined){
                            salida = "Error Semantico";
                        }
                        grafoarbol += "asignacion"+asignacion.toString()+"[label=\"Asignacion Local: "+instruccion.identificador+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                        grafoarbol += padre+"->"+"asignacion"+asignacion.toString()+";\n"
                        grafoarbol += "asignacion"+asignacion.toString()+"->"+"valorasignacion"+(asignacion-1).toString()+";\n"
                        asignacion++
                        let final = aux.lengthts();
                        while(final != 0){
                            tslocal.pushts(aux.popts());
                            final--;
                        }
                        encontrado = true;
                        break;
                    }
                }else{
                    if(tslocal.obtener(instruccion.identificador)!=undefined){
                        var error = tslocal.actualizar(instruccion.identificador, valor,metodos);
                        if (error == undefined){
                            salida = "Error Semantico";
                        }
                        grafoarbol += "asignacion"+asignacion.toString()+"[label=\"Asignacion Local: "+instruccion.identificador+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                        grafoarbol += padre+"->"+"asignacion"+asignacion.toString()+";\n"
                        grafoarbol += "asignacion"+asignacion.toString()+"->"+"valorasignacion"+(asignacion-1).toString()+";\n"
                        asignacion++
                        let final = aux.lengthts();
                        while(final != 0){
                            tslocal.pushts(aux.popts());
                            final--;
                        }
                        encontrado = true;
                        break;
                    }
                }
                postipo--;
            }
            if (!encontrado){
                if(tsglobal.obtener(instruccion.identificador)!=undefined){
                    var error = tsglobal.actualizar(instruccion.identificador, valor,metodos);
                    tsReporte.actualizar(instruccion.identificador, valor,metodos);
                    if (error == undefined){
                        salida = "Error Semantico";
                    }
                    grafoarbol += "asignacion"+asignacion.toString()+"[label=\"Asignacion Local: "+instruccion.identificador+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                    grafoarbol += padre+"->"+"asignacion"+asignacion.toString()+";\n"
                    grafoarbol += "asignacion"+asignacion.toString()+"->"+"valorasignacion"+(asignacion-1).toString()+";\n"
                    asignacion++
                }
            }
        }
        else if(tsglobal.obtener(instruccion.identificador)!=undefined){
            var error = tsglobal.actualizar(instruccion.identificador, valor,metodos);
            tsReporte.actualizar(instruccion.identificador, valor,metodos);
            if (error == undefined){
                salida = "Error Semantico";
            }
            grafoarbol += "asignacion"+asignacion.toString()+"[label=\"Asignacion Local: "+instruccion.identificador+"\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
            grafoarbol += padre+"->"+"asignacion"+asignacion.toString()+";\n"
            grafoarbol += "asignacion"+asignacion.toString()+"->"+"valorasignacion"+(asignacion-1).toString()+";\n"
            asignacion++
        }
    }
}

function ejecutarllamada(instruccion,padre){
    grafoarbol += "llamada"+llamada.toString()+"[label=\"Llamada: "+instruccion.identificador+"\",style=\"filled\", fillcolor=\"blue:green\"];\n"
    grafoarbol += padre+"->"+"llamada"+llamada.toString()+";\n"
    llamada++
}

function ejecutarif(instruccion, tsglobal, tslocal,tipots,ambito,padre,banderaciclo,metodos){
    if (cantif == 0){
        cantif++
        grafoarbol += "if"+iff.toString()+"[label=\"Instruccion IF\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
        grafoarbol += padre+"->"+"if"+iff.toString()+";\n"
        grafoarbol += "condicionif"+condicioniff.toString()+"[label=\"Condicion IF\"];\n"
        grafoarbol += "if"+iff.toString()+"->"+"condicionif"+condicioniff.toString()+";\n"
        condicioniff++
        var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,tipots,"condicionif"+(condicioniff-1).toString(),metodos);
        if (valor == undefined){
            salida = "Error Semantico";
        }else{
            if(instruccion.cuerpofalso!=undefined){
                grafoarbol += "cuerpoif"+cuerpoiff.toString()+"[label=\"Cuerpo IF\"];\n"
                grafoarbol += "if"+iff.toString()+"->"+"cuerpoif"+cuerpoiff.toString()+";\n"
                iff++
                cuerpoiff++
                ejecutarbloquelocal(instruccion.cuerpoverdadero,tsglobal,tslocal,tipots,ambito,"cuerpoif"+(cuerpoiff-1).toString(),metodos,banderaciclo);
                if(instruccion.cuerpofalso[0].tipo != "INSTR_IF"){
                    grafoarbol += "if"+iff.toString()+"[label=\"Instruccion ELSE\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                    grafoarbol += padre+"->"+"if"+iff.toString()+";\n"
                    grafoarbol += "cuerpoif"+cuerpoiff.toString()+"[label=\"Cuerpo ELSE\"];\n"
                    grafoarbol += "if"+iff.toString()+"->"+"cuerpoif"+cuerpoiff.toString()+";\n"
                    iff++
                    cuerpoiff++
                    ejecutarbloquelocal(instruccion.cuerpofalso,tsglobal,tslocal,tipots,ambito,"cuerpoif"+(cuerpoiff-1).toString(),metodos,banderaciclo);
                    cantif=0
                }else{
                    ejecutarbloquelocal(instruccion.cuerpofalso,tsglobal,tslocal,tipots,ambito,padre,metodos,banderaciclo);
                }
            }else{
                grafoarbol += "cuerpoif"+cuerpoiff.toString()+"[label=\"Cuerpo IF\"];\n"
                grafoarbol += "if"+iff.toString()+"->"+"cuerpoif"+cuerpoiff.toString()+";\n"
                iff++
                cuerpoiff++
                ejecutarbloquelocal(instruccion.cuerpoverdadero,tsglobal,tslocal,tipots,ambito,"cuerpoif"+(cuerpoiff-1).toString(),metodos,banderaciclo);
                cantif = 0
            }
        }
    }else{
        grafoarbol += "if"+iff.toString()+"[label=\"Instruccion ELSE IF\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
        grafoarbol += padre+"->"+"if"+iff.toString()+";\n"
        grafoarbol += "condicionif"+condicioniff.toString()+"[label=\"Condicion ELSE IF\"];\n"
        grafoarbol += "if"+iff.toString()+"->"+"condicionif"+condicioniff.toString()+";\n"
        condicioniff++
        var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,tipots,"condicionif"+(condicioniff-1).toString(),metodos);

        if (valor == undefined){
            salida = "Error Semantico";
        }else{
            if(instruccion.cuerpofalso!=undefined){
                grafoarbol += "cuerpoif"+cuerpoiff.toString()+"[label=\"Cuerpo ELSE IF\"];\n"
                grafoarbol += "if"+iff.toString()+"->"+"cuerpoif"+cuerpoiff.toString()+";\n"
                iff++
                cuerpoiff++
                ejecutarbloquelocal(instruccion.cuerpoverdadero,tsglobal,tslocal,tipots,ambito,"cuerpoif"+(cuerpoiff-1).toString(),metodos,banderaciclo);
                if(instruccion.cuerpofalso[0].tipo != "INSTR_IF"){
                    grafoarbol += "if"+iff.toString()+"[label=\"Instruccion ELSE\",style=\"filled\", fillcolor=\"orange:yellow\"];\n"
                    grafoarbol += padre+"->"+"if"+iff.toString()+";\n"
                    grafoarbol += "cuerpoif"+cuerpoiff.toString()+"[label=\"Cuerpo ELSE\"];\n"
                    grafoarbol += "if"+iff.toString()+"->"+"cuerpoif"+cuerpoiff.toString()+";\n"
                    iff++
                    cuerpoiff++
                    ejecutarbloquelocal(instruccion.cuerpofalso,tsglobal,tslocal,tipots,ambito,"cuerpoif"+(cuerpoiff-1).toString(),metodos,banderaciclo);
                    cantif=0
                }else{
                    ejecutarbloquelocal(instruccion.cuerpofalso,tsglobal,tslocal,tipots,ambito,padre,metodos,banderaciclo);
                }
            }else{
                grafoarbol += "cuerpoif"+cuerpoiff.toString()+"[label=\"Cuerpo ELSE IF\"];\n"
                grafoarbol += "if"+iff.toString()+"->"+"cuerpoif"+cuerpoiff.toString()+";\n"
                iff++
                cuerpoiff++
                ejecutarbloquelocal(instruccion.cuerpoverdadero,tsglobal,tslocal,tipots,ambito,"cuerpoif"+(cuerpoiff-1).toString(),metodos,banderaciclo);
                cantif = 0
            }
        }
    }
    
}

function ejecutarswitch(instruccion, tsglobal, tslocal,tipots,ambito,padre,metodos,banderaciclo){
    caso = true;
    var valor = procesarexpresion(instruccion.identificador,tsglobal, tslocal,tipots,padre,metodos);
    if (valor == undefined){
        caso = false
        salida = "Error Semantico";
    }else{
        ejecutarcase(valor,instruccion.casos,tsglobal,tslocal,tipots,ambito,padre,metodos,banderaciclo);
        caso = false
    }
}

function ejecutarcase(identificador,instruccion, tsglobal, tslocal,tipots,ambito,padre,metodos,banderaciclo){
    if(instruccion.caso == "defaultSwitch" && instruccion.cuerpocaso != undefined){
        grafoarbol += "casoDefault"+defaultswitchh.toString()+"[label=\"Caso Default Switch\"];\n"
        grafoarbol += padre+"->"+"casoDefault"+defaultswitchh.toString()+";\n"
        ejecutarbloquelocal(instruccion.cuerpocaso,tsglobal,tslocal,tipots,ambito+"CuerpoDefault-","casoDefault"+defaultswitchh.toString(),metodos,banderaciclo);
        defaultswitchh++
        return;
    }
    var valor = procesarexpresion(instruccion.caso,tsglobal, tslocal,tipots,"condicioncasoSwitch"+casoswitchh.toString(),metodos);
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        grafoarbol += "casoSwitch"+cuerpocasoswitchh.toString()+"[label=\"Caso Switch\"];\n"
        grafoarbol += padre+"->"+"casoSwitch"+cuerpocasoswitchh.toString()+";\n"
        ejecutarbloquelocal(instruccion.cuerpocaso,tsglobal,tslocal,tipots,ambito+"CuerpoCaso-","casoSwitch"+cuerpocasoswitchh.toString(),metodos,banderaciclo);
        cuerpocasoswitchh++
        ejecutarcase(identificador,instruccion.masCasos[0],tsglobal,tslocal,tipots,ambito,padre,metodos,banderaciclo);
    }
}

function ejecutarwhile(instruccion, tsglobal, tslocal,tipots,ambito,padre,metodos,banderaciclo){
    banderaciclo.push(".");
    grafoarbol += "condicionwhile"+condicionwhilee.toString()+"[label=\"Condicion While\"];\n"
    grafoarbol += padre+"->"+"condicionwhile"+condicionwhilee.toString()+";\n"
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,tipots,"condicionwhile"+condicionwhilee.toString(),metodos);
    condicionwhilee++
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        if (banderaciclo.length == 1){
            grafoarbol += "cuerpowhile"+cuerpowhilee.toString()+"[label=\"Cuerpo While\"];\n"
            grafoarbol += padre+"->"+"cuerpowhile"+cuerpowhilee.toString()+";\n"
            var tslocal2=new TS([]);
            tslocal.pushts(tslocal2);
            tipots.push(["While"]);
            ejecutarbloquelocal(instruccion.instrucciones,tsglobal,tslocal,tipots,ambito,"cuerpowhile"+cuerpowhilee.toString(),metodos,banderaciclo);
            cuerpowhilee++
            tslocal.popts();
            tipots.pop();
        }else{
            cuerpowhilee++
            grafoarbol += "cuerpowhile"+cuerpowhilee.toString()+"[label=\"Cuerpo While\"];\n"
            grafoarbol += padre+"->"+"cuerpowhile"+cuerpowhilee.toString()+";\n"
            var tslocal2=new TS([]);
            tslocal.pushts(tslocal2);
            tipots.push(["While"]);
            ejecutarbloquelocal(instruccion.instrucciones,tsglobal,tslocal,tipots,ambito,"cuerpowhile"+cuerpowhilee.toString(),metodos,banderaciclo);
            cuerpowhilee++
            tslocal.popts();
            tipots.pop();
        }
    }
    banderaciclo.pop();
}

function ejecutardowhile(instruccion, tsglobal, tslocal, tipots,ambito,padre,metodos,banderaciclo){
    banderaciclo.push(".");
    grafoarbol += "condiciondowhile"+condiciondowhilee.toString()+"[label=\"Condicion Do While\"];\n"
    grafoarbol += padre+"->"+"condiciondowhile"+condiciondowhilee.toString()+";\n"
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,tipots,"condiciondowhile"+condiciondowhilee.toString(),metodos);
    condiciondowhilee++
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        if (banderaciclo.length == 1){
            grafoarbol += "cuerpodowhilee"+cuerpodowhilee.toString()+"[label=\"Cuerpo Do While\"];\n"
            grafoarbol += padre+"->"+"cuerpodowhilee"+cuerpodowhilee.toString()+";\n"
            var tslocal2=new TS([]);
            tslocal.pushts(tslocal2);
            tipots.push(["DoWhile"]);
            ejecutarbloquelocal(instruccion.instrucciones,tsglobal,tslocal,tipots,ambito,"cuerpodowhilee"+cuerpodowhilee.toString(),metodos,banderaciclo);
            cuerpodowhilee++
            tslocal.popts();
            tipots.pop();
        }else{
            cuerpodowhilee++
            grafoarbol += "cuerpodowhilee"+cuerpodowhilee.toString()+"[label=\"Cuerpo Do While\"];\n"
            grafoarbol += padre+"->"+"cuerpodowhilee"+cuerpodowhilee.toString()+";\n"
            var tslocal2=new TS([]);
            tslocal.pushts(tslocal2);
            tipots.push(["DoWhile"]);
            ejecutarbloquelocal(instruccion.instrucciones,tsglobal,tslocal,tipots,ambito,"cuerpodowhilee"+cuerpodowhilee.toString(),metodos,banderaciclo);
            cuerpodowhilee++
            tslocal.popts();
            tipots.pop();
        }
    }
    banderaciclo.pop();
}

function ejecutarfor(instruccion, tsglobal, tslocal, tipots,ambito,padre, metodos,banderaciclo){
    banderaciclo.push(".");
    if(instruccion.declaracion.tipo == TIPO_INSTRUCCION.DECLARACION){
        ejecutardeclaracionlocal(instruccion.declaracion, tsglobal,tslocal,tipots,ambito+"DeclaracionVariableFor-",padre,metodos);
    }
    else if(instruccion.declaracion.tipo == TIPO_INSTRUCCION.ASIGNACION){
        ejecutarasignacionlocal(instruccion.declaracion, tsglobal, tslocal,tipots,padre,metodos);
    }
    grafoarbol += "condicionfor"+condicionforr.toString()+"[label=\"Condicion For\"];\n"
    grafoarbol += padre+"->"+"condicionfor"+condicionforr.toString()+";\n"
    condicionforr++
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,tipots,"condicionfor"+(condicionforr-1).toString(),metodos);
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        if (banderaciclo.length == 1){
            grafoarbol += "cuerpofor"+cuerpoforr.toString()+"[label=\"Cuerpo For\"];\n"
            grafoarbol += padre+"->"+"cuerpofor"+cuerpoforr.toString()+";\n"
            var tslocal2=new TS([]);
            tslocal.pushts(tslocal2);
            tipots.push(["FOR"]);
            cuerpoforr++
            ejecutarbloquelocal(instruccion.cuerpoFor,tsglobal,tslocal,tipots,ambito,"cuerpofor"+(cuerpoforr-1).toString(),metodos,banderaciclo); 
            tslocal.popts();
            tipots.pop();
        }else{
            cuerpoforr++
            grafoarbol += "cuerpofor"+cuerpoforr.toString()+"[label=\"Cuerpo For\"];\n"
            grafoarbol += padre+"->"+"cuerpofor"+cuerpoforr.toString()+";\n"
            var tslocal2=new TS([]);
            tslocal.pushts(tslocal2);
            tipots.push(["FOR"]);
            ejecutarbloquelocal(instruccion.cuerpoFor,tsglobal,tslocal,tipots,ambito,"cuerpofor"+cuerpoforr.toString(),metodos,banderaciclo);
            cuerpoforr++
            tslocal.popts();
            tipots.pop();
        }
        
    }
    banderaciclo.pop();
}

function procesarexpresion(expresion, tsglobal, tslocal,tipots,padre,metodos){
    if(expresion.tipo == TIPO_OPERACION.SUMA){
        grafoarbol += "suma"+expresionpro.toString()+"[label=\"Operacion SUMA\"];\n"
        grafoarbol += padre+"->"+"suma"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"suma"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"+\"];\n"
        grafoarbol += "suma"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"suma"+temporal.toString(), metodos);
        
        //ENTERO
        if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor+valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor+valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.BANDERA){
            if(valorDer.valor == true){
                return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor+1 };
            }else{
                return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor };
            }
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.CARACTER){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor+ valorDer.valor.charCodeAt() };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.CADENA){
            return { tipo:TIPO_DATO.CADENA, valor: String(valorIzq.valor)+valorDer.valor };
        }

        //DOUBLE
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor+valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor+valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.BANDERA){
            if(valorDer.valor == true){
                return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor+1 };
            }else{
                return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor };
            }
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.CARACTER){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor+valorDer.valor.charCodeAt() };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.CADENA){
            return { tipo:TIPO_DATO.CADENA, valor: String(valorIzq.valor)+valorDer.valor };
        }

        //BOOLEANO
        else if(valorIzq.tipo == TIPO_DATO.BANDERA && valorDer.tipo == TIPO_DATO.ENTERO){
            if(valorIzq.valor == true){
                return { tipo:TIPO_DATO.ENTERO, valor: valorDer.valor+1 };
            }else{
                return { tipo:TIPO_DATO.ENTERO, valor: valorDer.valor };
            }
        }
        else if(valorIzq.tipo == TIPO_DATO.BANDERA && valorDer.tipo == TIPO_DATO.DECIMAL){
            if(valorIzq.valor == true){
                return { tipo:TIPO_DATO.DECIMAL, valor: valorDer.valor+1 };
            }else{
                return { tipo:TIPO_DATO.DECIMAL, valor: valorDer.valor };
            }
        }
        else if(valorIzq.tipo == TIPO_DATO.BANDERA && valorDer.tipo == TIPO_DATO.CADENA){
            return { tipo:TIPO_DATO.CADENA, valor: String(valorIzq.valor)+valorDer.valor };
        }

        //CARACTER
        if(valorIzq.tipo == TIPO_DATO.CARACTER && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor.charCodeAt()+valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.CARACTER && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor.charCodeAt()+valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.CARACTER && valorDer.tipo == TIPO_DATO.CARACTER){
            return { tipo:TIPO_DATO.CADENA, valor: String(valorIzq.valor)+ String(valorDer.valor) };
        }
        else if(valorIzq.tipo == TIPO_DATO.CARACTER && valorDer.tipo == TIPO_DATO.CADENA){
            return { tipo:TIPO_DATO.CADENA, valor: String(valorIzq.valor)+valorDer.valor };
        }

        //CADENA
        if(valorIzq.tipo == TIPO_DATO.CADENA && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor+String(valorDer.valor) };
        }
        else if(valorIzq.tipo == TIPO_DATO.CADENA && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor+String(valorDer.valor) };
        }
        else if(valorIzq.tipo == TIPO_DATO.CADENA && valorDer.tipo == TIPO_DATO.BANDERA){
            return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor+String(valorDer.valor) };
        }
        else if(valorIzq.tipo == TIPO_DATO.CADENA && valorDer.tipo == TIPO_DATO.CARACTER){
            return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor+ String(valorDer.valor) };
        }
        else if(valorIzq.tipo == TIPO_DATO.CADENA && valorDer.tipo == TIPO_DATO.CADENA){
            return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor+valorDer.valor };
        }

        else {
            console.log('Error semantico los tipos no se pueden sumar');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.INCREMENTO){
        grafoarbol += "incremento"+expresionpro.toString()+"[label=\"Operacion INCREMENTO\"];\n"
        grafoarbol += padre+"->"+"incremento"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"incremento"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"++\"];\n"
        grafoarbol += "incremento"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        //ENTERO
        if(valorIzq.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor+1 };
        }

        //DOUBLE
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor+1 };
        }

        else {
            console.log('Error semantico los tipos no se pueden Aumentar en 1');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.RESTA){
        grafoarbol += "resta"+expresionpro.toString()+"[label=\"Operacion RESTA\"];\n"
        grafoarbol += padre+"->"+"resta"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"resta"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"-\"];\n"
        grafoarbol += "resta"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"resta"+temporal.toString(), metodos);
        //ENTERO
        if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor-valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor-valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.BANDERA){
            if(valorDer.valor == true){
                return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor-1 };
            }else{
                return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor };
            }
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.CARACTER){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor- valorDer.valor.charCodeAt() };
        }

        //DECIMAL
        if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor-valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor-valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.BANDERA){
            if(valorDer.valor == true){
                return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor-1 };
            }else{
                return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor };
            }
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.CARACTER){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor- valorDer.valor.charCodeAt() };
        }

         //BOOLEANO
         if(valorIzq.tipo == TIPO_DATO.BANDERA && valorDer.tipo == TIPO_DATO.ENTERO){
            if(valorIzq.valor == true){
                return { tipo:TIPO_DATO.ENTERO, valor: valorDer.valor-1 };
            }else{
                return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor };
            }
        }
        else if(valorIzq.tipo == TIPO_DATO.BANDERA && valorDer.tipo == TIPO_DATO.DECIMAL){
            if(valorIzq.valor == true){
                return { tipo:TIPO_DATO.DECIMAL, valor: valorDer.valor-1 };
            }else{
                return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor };
            }
        }

         //CARACTER
         if(valorIzq.tipo == TIPO_DATO.CARACTER && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor.charCodeAt() - valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.CARACTER && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor.charCodeAt() - valorDer.valor };
        }

        else {
            console.log('Error semantico los tipos no se pueden restar');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.DECREMENTO){
        grafoarbol += "decremento"+expresionpro.toString()+"[label=\"Operacion DECREMENTO\"];\n"
        grafoarbol += padre+"->"+"decremento"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"decremento"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"--\"];\n"
        grafoarbol += "decremento"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        //ENTERO
        if(valorIzq.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor-1 };
        }

        //DOUBLE
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor-1 };
        }
        
        else {
            console.log('Error semantico los tipos no se pueden Disminuir en 1');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.MULTIPLICACION){
        grafoarbol += "multi"+expresionpro.toString()+"[label=\"Operacion MULTIPLICACION\"];\n"
        grafoarbol += padre+"->"+"multi"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"multi"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"*\"];\n"
        grafoarbol += "multi"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"multi"+temporal.toString(), metodos);
        //ENTERO
        if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor*valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor*valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.CARACTER){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor*valorDer.valor.charCodeAt() };
        }

        //DECIMAL
        if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor*valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor*valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.CARACTER){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor*valorDer.valor.charCodeAt() };
        }

        //CARACTER
        if(valorIzq.tipo == TIPO_DATO.CARACTER && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor.charCodeAt()*valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.CARACTER && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor.charCodeAt()*valorDer.valor };
        }

        else {
            console.log('Error semantico los tipos no se pueden multiplicar');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.DIVISION){
        grafoarbol += "division"+expresionpro.toString()+"[label=\"Operacion DIVISION\"];\n"
        grafoarbol += padre+"->"+"division"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"division"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"/\"];\n"
        grafoarbol += "division"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"division"+temporal.toString(), metodos);
        
        //DIVISIONES ENTRE 0
        if(valorDer.tipo == TIPO_DATO.DECIMAL && valorDer.valor == 0){
            console.log('Error semantico el divisor es 0');
            return undefined;
        }
        else if(valorDer.tipo == TIPO_DATO.ENTERO && valorDer.valor == 0){
            console.log('Error semantico el divisor es 0');
            return undefined;
        }
        
        else if(valorDer.tipo == TIPO_DATO.CARACTER && valorDer.valor == 0){
            console.log('Error semantico el divisor es 0');
            return undefined;
        }

        //ENTERO
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor/valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor/valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.CARACTER){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor/valorDer.valor.charCodeAt() };
        }

        //DECIMAL
        if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor/valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor/valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.CARACTER){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor/valorDer.valor.charCodeAt() };
        }

        //CARACTER
        if(valorIzq.tipo == TIPO_DATO.CARACTER && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor.charCodeAt()/valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.CARACTER && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor.charCodeAt()*valorDer.valor };
        }

        else {
            console.log('Error semantico los tipos no se pueden dividir');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.POTENCIA){
        grafoarbol += "potencia"+expresionpro.toString()+"[label=\"Operacion POTENCIA\"];\n"
        grafoarbol += padre+"->"+"potencia"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"potencia"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"^\"];\n"
        grafoarbol += "potencia"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"potencia"+temporal.toString(), metodos);
        //ENTERO
        if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: Math.pow(valorIzq.valor,valorDer.valor) };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: Math.pow(valorIzq.valor,valorDer.valor) };
        }

        //DECIMAL
        if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.DECIMAL, valor: Math.pow(valorIzq.valor,valorDer.valor) };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: Math.pow(valorIzq.valor,valorDer.valor) };
        }

        else {
            console.log('Error semantico los tipos no se pueden multiplicar');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.MODULO){
        grafoarbol += "modulo"+expresionpro.toString()+"[label=\"Operacion MODULO\"];\n"
        grafoarbol += padre+"->"+"modulo"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"modulo"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"%\"];\n"
        grafoarbol += "modulo"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"modulo"+temporal.toString(), metodos);
        //ENTERO
        if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor % valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.ENTERO && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor % valorDer.valor };
        }

        //DECIMAL
        if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor % valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor % valorDer.valor };
        }

        else {
            console.log('Error semantico los tipos no se pueden multiplicar');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.NEGATIVO){
        grafoarbol += "negativo"+expresionpro.toString()+"[label=\"Operacion NEGATIVO\"];\n"
        grafoarbol += padre+"->"+"negativo"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        grafoarbol += "operando"+operando.toString()+"[label=\"-\"];\n"
        grafoarbol += "negativo"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"negativo"+temporal.toString(), metodos);
        
        if(valorIzq.tipo == TIPO_DATO.ENTERO){
            return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor*-1 };
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor*-1 };
        }
        else {
            console.log('Error semantico los tipos no se puede volver negativo');
            return undefined;
        }
    }   
    else if(expresion.tipo == TIPO_OPERACION.MENOR){
        grafoarbol += "menor"+expresionpro.toString()+"[label=\"Operacion MENOR\"];\n"
        grafoarbol += padre+"->"+"menor"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"menor"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"<\"];\n"
        grafoarbol += "menor"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"menor"+temporal.toString(), metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.ENTERO:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3<5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3<5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<valorDer.valor };
                    case TIPO_DATO.BANDERA:
                        //if(3<true || 3 <false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<0 };
                        }
                    default:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3.0<5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3.0<5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<valorDer.valor };
                    case TIPO_DATO.BANDERA:
                        //if(3.0<true || 3.0 <false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<0 };
                        }
                    default:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
            case TIPO_DATO.CARACTER:
                switch(valorDer.tipo){
                    case TIPO_DATO.CARACTER:
                        //if('A'<'B')
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()<valorDer.valor.charCodeAt };
                    case TIPO_DATO.CADENA:
                        //if('A'<"B")
                        let palabra = 0
                        for (let index = 0; index < valorDer.valor.length; index++) {
                            palabra+=valorDer.valor.charCodeAt(index)
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()<palabra };
                    case TIPO_DATO.BANDERA:
                        //if('A'<true || 'A' <false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()<1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()<0 };
                        }
                    default:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
            case TIPO_DATO.CADENA:
                let palabraizq = 0
                for (let index = 0; index < valorIzq.valor.length; index++) {
                    palabraizq+=valorIzq.valor.charCodeAt(index)
                }
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        //if("A"<'B')
                        return { tipo:TIPO_DATO.BANDERA, valor: palabraizq<valorIzq.valor.charCodeAt() };
                    case TIPO_DATO.CADENA:
                        //if("A"<"B")
                        let palabrader = 0
                        for (let index = 0; index < valorDer.valor.length; index++) {
                            palabrader+=valorDer.valor.charCodeAt(index)
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: palabraizq<palabrader };
                    case TIPO_DATO.BANDERA:
                        //if('A'<true || 'A' <false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: palabraizq<1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: palabraizq<0 };
                        }
                    default:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
            case TIPO_DATO.BANDERA:
                if (valorIzq.valor == true){
                    switch(valorDer.tipo){
                        case TIPO_DATO.ENTERO:
                            //if(true<3)
                            return { tipo:TIPO_DATO.BANDERA, valor: 1<valorDer.valor };
                        case TIPO_DATO.DECIMAL:
                            //if(true<3.0)
                            return { tipo:TIPO_DATO.BANDERA, valor: 1<valorDer.valor };
                        case TIPO_DATO.CARACTER:
                            //if(true<'A')
                            return { tipo:TIPO_DATO.BANDERA, valor: 1<valorDer.valor.charCodeAt() };
                        case TIPO_DATO.CADENA:
                            //if(true<"B")
                            let palabrader = 0
                            for (let index = 0; index < valorDer.valor.length; index++) {
                                palabrader+=valorDer.valor.charCodeAt(index)
                            }
                            return { tipo:TIPO_DATO.BANDERA, valor: 1<palabrader };
                        case TIPO_DATO.BANDERA:
                            //if(true<true || true <false)
                            if (valorDer.valor == true){
                                return { tipo:TIPO_DATO.BANDERA, valor: 1<1 };
                            }else{
                                return { tipo:TIPO_DATO.BANDERA, valor: 1<0 };
                            }
                        default:
                            console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                            return undefined;
                    }
                }else{
                    switch(valorDer.tipo){
                        case TIPO_DATO.ENTERO:
                            //if(false<3)
                            return { tipo:TIPO_DATO.BANDERA, valor: 0<valorDer.valor };
                        case TIPO_DATO.DECIMAL:
                            //if(false<3.0)
                            return { tipo:TIPO_DATO.BANDERA, valor: 0<valorDer.valor };
                        case TIPO_DATO.CARACTER:
                            //if(false<'A')
                            return { tipo:TIPO_DATO.BANDERA, valor: 0<valorDer.valor.charCodeAt() };
                        case TIPO_DATO.CADENA:
                            //if(true<"B")
                            let palabrader = 0
                            for (let index = 0; index < valorDer.valor.length; index++) {
                                palabrader+=valorDer.valor.charCodeAt(index)
                            }
                            return { tipo:TIPO_DATO.BANDERA, valor: 0<palabrader };
                        case TIPO_DATO.BANDERA:
                            //if(false<true || false <false)
                            if (valorDer.valor == true){
                                return { tipo:TIPO_DATO.BANDERA, valor: 0<1 };
                            }else{
                                return { tipo:TIPO_DATO.BANDERA, valor: 0<0 };
                            }
                        default:
                            console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                            return undefined;
                    }
                }
            default:
                console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                return undefined;    
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.MAYOR){
        grafoarbol += "mayor"+expresionpro.toString()+"[label=\"Operacion MAYOR\"];\n"
        grafoarbol += padre+"->"+"mayor"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"mayor"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\">\"];\n"
        grafoarbol += "mayor"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"mayor"+temporal.toString(), metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.ENTERO:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3>5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3>5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>valorDer.valor };
                    case TIPO_DATO.BANDERA:
                        //if(3>true || 3 >false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>0 };
                        }
                    default:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3.0>5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3.0>5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>valorDer.valor };
                    case TIPO_DATO.BANDERA:
                        //if(3.0>true || 3.0 >false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>0 };
                        }
                    default:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
            case TIPO_DATO.CARACTER:
                switch(valorDer.tipo){
                    case TIPO_DATO.CARACTER:
                        //if('A'>'B')
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()>valorDer.valor.charCodeAt };
                    case TIPO_DATO.CADENA:
                        //if('A'>"B")
                        let palabra = 0
                        for (let index = 0; index < valorDer.valor.length; index++) {
                            palabra+=valorDer.valor.charCodeAt(index)
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()>palabra };
                    case TIPO_DATO.BANDERA:
                        //if('A'>true || 'A' >false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()>1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()>0 };
                        }
                    default:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
            case TIPO_DATO.CADENA:
                let palabraizq = 0
                for (let index = 0; index < valorIzq.valor.length; index++) {
                    palabraizq+=valorIzq.valor.charCodeAt(index)
                }
                switch(valorDer.tipo){
                    case TIPO_DATO.CARACTER:
                        //if("A">'B')
                        return { tipo:TIPO_DATO.BANDERA, valor: palabraizq>valorIzq.valor.charCodeAt() };
                    case TIPO_DATO.CADENA:
                        //if("A">"B")
                        let palabrader = 0
                        for (let index = 0; index < valorDer.valor.length; index++) {
                            palabrader+=valorDer.valor.charCodeAt(index)
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: palabraizq>palabrader };
                    case TIPO_DATO.BANDERA:
                        //if('A'>true || 'A' >false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: palabraizq>1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: palabraizq>0 };
                        }
                    default:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
            case TIPO_DATO.BANDERA:
                if (valorIzq.valor == true){
                    switch(valorDer.tipo){
                        case TIPO_DATO.ENTERO:
                            //if(true>3)
                            return { tipo:TIPO_DATO.BANDERA, valor: 1>valorDer.valor };
                        case TIPO_DATO.DECIMAL:
                            //if(true>3.0)
                            return { tipo:TIPO_DATO.BANDERA, valor: 1>valorDer.valor };
                        case TIPO_DATO.CARACTER:
                            //if(true>'A')
                            return { tipo:TIPO_DATO.BANDERA, valor: 1>valorDer.valor.charCodeAt() };
                        case TIPO_DATO.CADENA:
                            //if(true>"B")
                            let palabrader = 0
                            for (let index = 0; index < valorDer.valor.length; index++) {
                                palabrader+=valorDer.valor.charCodeAt(index)
                            }
                            return { tipo:TIPO_DATO.BANDERA, valor: 1>palabrader };
                        case TIPO_DATO.BANDERA:
                            //if(true>true || true >false)
                            if (valorDer.valor == true){
                                return { tipo:TIPO_DATO.BANDERA, valor: 1>1 };
                            }else{
                                return { tipo:TIPO_DATO.BANDERA, valor: 1>0 };
                            }
                    }
                    break;
                }else{
                    switch(valorDer.tipo){
                        case TIPO_DATO.ENTERO:
                            //if(false>3)
                            return { tipo:TIPO_DATO.BANDERA, valor: 0>valorDer.valor };
                        case TIPO_DATO.DECIMAL:
                            //if(false>3.0)
                            return { tipo:TIPO_DATO.BANDERA, valor: 0>valorDer.valor };
                        case TIPO_DATO.CARACTER:
                            //if(false>'A')
                            return { tipo:TIPO_DATO.BANDERA, valor: 0>valorDer.valor.charCodeAt() };
                        case TIPO_DATO.CADENA:
                            //if(true>"B")
                            let palabrader = 0
                            for (let index = 0; index < valorDer.valor.length; index++) {
                                palabrader+=valorDer.valor.charCodeAt(index)
                            }
                            return { tipo:TIPO_DATO.BANDERA, valor: 0>palabrader };
                        case TIPO_DATO.BANDERA:
                            //if(false>true || false >false)
                            if (valorDer.valor == true){
                                return { tipo:TIPO_DATO.BANDERA, valor: 0>1 };
                            }else{
                                return { tipo:TIPO_DATO.BANDERA, valor: 0>0 };
                            }
                    }
                    break;
                }    
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.MENORIGUAL){
        grafoarbol += "menorigual"+expresionpro.toString()+"[label=\"Operacion MENORIGUAL\"];\n"
        grafoarbol += padre+"->"+"menorigual"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"menorigual"+temporal.toString(),metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"<=\"];\n"
        grafoarbol += "menorigual"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"menorigual"+temporal.toString(),metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.ENTERO:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3<=5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<=valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3<=5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<=valorDer.valor };
                    case TIPO_DATO.CARACTER:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor igual');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor igual');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(3<=true || 3 <=false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<=1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<=0 };
                        }
                }
                break;
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3.0<=5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<=valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3.0<=5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<=valorDer.valor };
                    case TIPO_DATO.CARACTER:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor igual');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor igual');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(3.0<=true || 3.0 <=false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<=1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<=0 };
                        }
                }
                break;
            case TIPO_DATO.CARACTER:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor igual');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor igual');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        //if('A'<='B')
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()<=valorDer.valor.charCodeAt };
                    case TIPO_DATO.CADENA:
                        //if('A'<="B")
                        let palabra = 0
                        for (let index = 0; index < valorDer.valor.length; index++) {
                            palabra+=valorDer.valor.charCodeAt(index)
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()<=palabra };
                    case TIPO_DATO.BANDERA:
                        //if('A'<=true || 'A' <=false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()<=1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()<=0 };
                        }
                }
                break;
            case TIPO_DATO.CADENA:
                let palabraizq = 0
                for (let index = 0; index < valorIzq.valor.length; index++) {
                    palabraizq+=valorIzq.valor.charCodeAt(index)
                }
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor igual');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor igual');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        //if("A"<='B')
                        return { tipo:TIPO_DATO.BANDERA, valor: palabraizq<=valorIzq.valor.charCodeAt() };
                    case TIPO_DATO.CADENA:
                        //if("A"<="B")
                        let palabrader = 0
                        for (let index = 0; index < valorDer.valor.length; index++) {
                            palabrader+=valorDer.valor.charCodeAt(index)
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: palabraizq<=palabrader };
                    case TIPO_DATO.BANDERA:
                        //if('A'<=true || 'A' <=false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: palabraizq<=1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: palabraizq<=0 };
                        }
                }
                break;
            case TIPO_DATO.BANDERA:
                if (valorIzq.valor == true){
                    switch(valorDer.tipo){
                        case TIPO_DATO.ENTERO:
                            //if(true<=3)
                            return { tipo:TIPO_DATO.BANDERA, valor: 1<=valorDer.valor };
                        case TIPO_DATO.DECIMAL:
                            //if(true<=3.0)
                            return { tipo:TIPO_DATO.BANDERA, valor: 1<=valorDer.valor };
                        case TIPO_DATO.CARACTER:
                            //if(true<='A')
                            return { tipo:TIPO_DATO.BANDERA, valor: 1<=valorDer.valor.charCodeAt() };
                        case TIPO_DATO.CADENA:
                            //if(true<="B")
                            let palabrader = 0
                            for (let index = 0; index < valorDer.valor.length; index++) {
                                palabrader+=valorDer.valor.charCodeAt(index)
                            }
                            return { tipo:TIPO_DATO.BANDERA, valor: 1<=palabrader };
                        case TIPO_DATO.BANDERA:
                            //if(true<=true || true <=false)
                            if (valorDer.valor == true){
                                return { tipo:TIPO_DATO.BANDERA, valor: 1<=1 };
                            }else{
                                return { tipo:TIPO_DATO.BANDERA, valor: 1<=0 };
                            }
                    }
                    break;
                }else{
                    switch(valorDer.tipo){
                        case TIPO_DATO.ENTERO:
                            //if(false<=3)
                            return { tipo:TIPO_DATO.BANDERA, valor: 0<=valorDer.valor };
                        case TIPO_DATO.DECIMAL:
                            //if(false<=3.0)
                            return { tipo:TIPO_DATO.BANDERA, valor: 0<=valorDer.valor };
                        case TIPO_DATO.CARACTER:
                            //if(false<='A')
                            return { tipo:TIPO_DATO.BANDERA, valor: 0<=valorDer.valor.charCodeAt() };
                        case TIPO_DATO.CADENA:
                            //if(true<="B")
                            let palabrader = 0
                            for (let index = 0; index < valorDer.valor.length; index++) {
                                palabrader+=valorDer.valor.charCodeAt(index)
                            }
                            return { tipo:TIPO_DATO.BANDERA, valor: 0<=palabrader };
                        case TIPO_DATO.BANDERA:
                            //if(false<=true || false <=false)
                            if (valorDer.valor == true){
                                return { tipo:TIPO_DATO.BANDERA, valor: 0<=1 };
                            }else{
                                return { tipo:TIPO_DATO.BANDERA, valor: 0<=0 };
                            }
                    }
                    break;
                }    
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.MAYORIGUAL){
        grafoarbol += "mayorigual"+expresionpro.toString()+"[label=\"Operacion MAYORIGUAL\"];\n"
        grafoarbol += padre+"->"+"mayorigual"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"mayorigual"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\">=\"];\n"
        grafoarbol += "mayorigual"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"mayorigual"+temporal.toString(), metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.ENTERO:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3>=5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>=valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3>=5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>=valorDer.valor };
                    case TIPO_DATO.CARACTER:
                        console.log('Error semantico los tipos no se pueden operar en el caso del mayor igual');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del mayor igual');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(3>=true || 3 >=false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>=1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>=0 };
                        }
                }
                break;
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3.0>=5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>=valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3.0>=5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>=valorDer.valor };
                    case TIPO_DATO.CARACTER:
                        console.log('Error semantico los tipos no se pueden operar en el caso del mayor igual');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del mayor igual');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(3.0>=true || 3.0 >=false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>=1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>=0 };
                        }
                }
                break;
            case TIPO_DATO.CARACTER:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del mayor igual');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del mayor igual');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        //if('A'>='B')
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()>=valorDer.valor.charCodeAt };
                    case TIPO_DATO.CADENA:
                        //if('A'>="B")
                        let palabra = 0
                        for (let index = 0; index < valorDer.valor.length; index++) {
                            palabra+=valorDer.valor.charCodeAt(index)
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()>=palabra };
                    case TIPO_DATO.BANDERA:
                        //if('A'>=true || 'A' >=false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()>=1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor.charCodeAt()>=0 };
                        }
                }
                break;
            case TIPO_DATO.CADENA:
                let palabraizq = 0
                for (let index = 0; index < valorIzq.valor.length; index++) {
                    palabraizq+=valorIzq.valor.charCodeAt(index)
                }
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del mayor igual');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del mayor igual');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        //if("A">='B')
                        return { tipo:TIPO_DATO.BANDERA, valor: palabraizq>=valorIzq.valor.charCodeAt() };
                    case TIPO_DATO.CADENA:
                        //if("A">="B")
                        let palabrader = 0
                        for (let index = 0; index < valorDer.valor.length; index++) {
                            palabrader+=valorDer.valor.charCodeAt(index)
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: palabraizq>=palabrader };
                    case TIPO_DATO.BANDERA:
                        //if('A'>=true || 'A' >=false)
                        if (valorDer.valor == true){
                            return { tipo:TIPO_DATO.BANDERA, valor: palabraizq>=1 };
                        }else{
                            return { tipo:TIPO_DATO.BANDERA, valor: palabraizq>=0 };
                        }
                }
                break;
            case TIPO_DATO.BANDERA:
                if (valorIzq.valor == true){
                    switch(valorDer.tipo){
                        case TIPO_DATO.ENTERO:
                            //if(true>=3)
                            return { tipo:TIPO_DATO.BANDERA, valor: 1>=valorDer.valor };
                        case TIPO_DATO.DECIMAL:
                            //if(true>=3.0)
                            return { tipo:TIPO_DATO.BANDERA, valor: 1>=valorDer.valor };
                        case TIPO_DATO.CARACTER:
                            //if(true>='A')
                            return { tipo:TIPO_DATO.BANDERA, valor: 1>=valorDer.valor.charCodeAt() };
                        case TIPO_DATO.CADENA:
                            //if(true>="B")
                            let palabrader = 0
                            for (let index = 0; index < valorDer.valor.length; index++) {
                                palabrader+=valorDer.valor.charCodeAt(index)
                            }
                            return { tipo:TIPO_DATO.BANDERA, valor: 1>=palabrader };
                        case TIPO_DATO.BANDERA:
                            //if(true>=true || true >=false)
                            if (valorDer.valor == true){
                                return { tipo:TIPO_DATO.BANDERA, valor: 1>=1 };
                            }else{
                                return { tipo:TIPO_DATO.BANDERA, valor: 1>=0 };
                            }
                    }
                    break;
                }else{
                    switch(valorDer.tipo){
                        case TIPO_DATO.ENTERO:
                            //if(false>=3)
                            return { tipo:TIPO_DATO.BANDERA, valor: 0>=valorDer.valor };
                        case TIPO_DATO.DECIMAL:
                            //if(false>=3.0)
                            return { tipo:TIPO_DATO.BANDERA, valor: 0>=valorDer.valor };
                        case TIPO_DATO.CARACTER:
                            //if(false>='A')
                            return { tipo:TIPO_DATO.BANDERA, valor: 0>=valorDer.valor.charCodeAt() };
                        case TIPO_DATO.CADENA:
                            //if(true>="B")
                            let palabrader = 0
                            for (let index = 0; index < valorDer.valor.length; index++) {
                                palabrader+=valorDer.valor.charCodeAt(index)
                            }
                            return { tipo:TIPO_DATO.BANDERA, valor: 0>=palabrader };
                        case TIPO_DATO.BANDERA:
                            //if(false>=true || false >=false)
                            if (valorDer.valor == true){
                                return { tipo:TIPO_DATO.BANDERA, valor: 0>=1 };
                            }else{
                                return { tipo:TIPO_DATO.BANDERA, valor: 0>=0 };
                            }
                    }
                    break;
                }    
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.IGUALIGUAL){
        grafoarbol += "igualigual"+expresionpro.toString()+"[label=\"Operacion IGUALIGUAL\"];\n"
        grafoarbol += padre+"->"+"igualigual"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"igualigual"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"==\"];\n"
        grafoarbol += "igualigual"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"igualigual"+temporal.toString(), metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.ENTERO:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3===5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor===valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3===5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor===valorDer.valor };
                    case TIPO_DATO.CARACTER:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                }
                break;
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3.0===5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor===valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3.0===5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor===valorDer.valor };
                    case TIPO_DATO.CARACTER:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        //if(3.0==="hola")
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                }
                break;
            case TIPO_DATO.CARACTER:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        //if('A'==='B')
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor===valorDer.valor };
                    case TIPO_DATO.CADENA:
                        //if('A'==="B")
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor===valorDer.valor };
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                }
                break;
            case TIPO_DATO.CADENA:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        //if('A'==='B')
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor===valorDer.valor };
                    case TIPO_DATO.CADENA:
                        //if('A'==="B")
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor===valorDer.valor };
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                }
                break;
            case TIPO_DATO.BANDERA:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del igual');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(true===true || true ===false)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor===valorDer.valor };
                }
                break;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.NOIGUAL){
        grafoarbol += "noigual"+expresionpro.toString()+"[label=\"Operacion NOIGUAL\"];\n"
        grafoarbol += padre+"->"+"noigual"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"noigual"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"!=\"];\n"
        grafoarbol += "noigual"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"noigual"+temporal.toString(), metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.ENTERO:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3!==5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!==valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3!==5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!==valorDer.valor };
                    case TIPO_DATO.CARACTER:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                }
                break;
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        //if(3.0!==5)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!==valorDer.valor };
                    case TIPO_DATO.DECIMAL:
                        //if(3.0!==5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!==valorDer.valor };
                    case TIPO_DATO.CARACTER:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                }
                break;
            case TIPO_DATO.CARACTER:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        //if('A'!=='B')
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!==valorDer.valor };
                    case TIPO_DATO.CADENA:
                        //if('A'!=="B")
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!==valorDer.valor };
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                }
                break;
            case TIPO_DATO.CADENA:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        //if('A'!=='B')
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!==valorDer.valor };
                    case TIPO_DATO.CADENA:
                        //if('A'!=="B")
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!==valorDer.valor };
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                }
                break;
            case TIPO_DATO.BANDERA:
                switch(valorDer.tipo){
                    case TIPO_DATO.ENTERO:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.CARACTER:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del distinto');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(true!==true)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!==valorDer.valor };
                }
                break;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.OR){
        grafoarbol += "or"+expresionpro.toString()+"[label=\"Operacion OR\"];\n"
        grafoarbol += padre+"->"+"or"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"or"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"||\"];\n"
        grafoarbol += "or"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"or"+temporal.toString(), metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.BANDERA:
                switch(valorDer.tipo){
                    case TIPO_DATO.BANDERA:
                        if((valorIzq.valor == true) && (valorDer.valor == true)){
                            return { tipo:TIPO_DATO.BANDERA, valor: true };
                        }
                        else if((valorIzq.valor == true) && (valorDer.valor == false)){
                            return { tipo:TIPO_DATO.BANDERA, valor: true };
                        }
                        else if((valorIzq.valor == false) && (valorDer.valor == true)){
                            return { tipo:TIPO_DATO.BANDERA, valor: true };
                        }
                        else if((valorIzq.valor == false) && (valorDer.valor == false)){
                            return { tipo:TIPO_DATO.BANDERA, valor: false };
                        }
                    default:
                        console.log("Tipo De Dato Invalido Para Comparacion OR, Operador Derecho")
                    return undefined;
                }
            default:
                console.log("Tipo De Dato Invalido Para Comparacion OR, Operador Izquierdo")
                return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.AND){
        grafoarbol += "and"+expresionpro.toString()+"[label=\"Operacion AND\"];\n"
        grafoarbol += padre+"->"+"and"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"and"+temporal.toString(), metodos);
        grafoarbol += "operando"+operando.toString()+"[label=\"&&\"];\n"
        grafoarbol += "and"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"and"+temporal.toString(), metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.BANDERA:
                switch(valorDer.tipo){
                    case TIPO_DATO.BANDERA:
                        if((valorIzq.valor == true) && (valorDer.valor == true)){
                            return { tipo:TIPO_DATO.BANDERA, valor: true };
                        }
                        else if((valorIzq.valor == true) && (valorDer.valor == false)){
                            return { tipo:TIPO_DATO.BANDERA, valor: false };
                        }
                        else if((valorIzq.valor == false) && (valorDer.valor == true)){
                            return { tipo:TIPO_DATO.BANDERA, valor: false };
                        }
                        else if((valorIzq.valor == false) && (valorDer.valor == false)){
                            return { tipo:TIPO_DATO.BANDERA, valor: false };
                        }
                    default:
                        console.log("Tipo De Dato Invalido Para Comparacion AND, Operador Derecho")
                    return undefined;
                }
            default:
                console.log("Tipo De Dato Invalido Para Comparacion AND, Operador Izquierdo")
                return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.NOT){
        grafoarbol += "not"+expresionpro.toString()+"[label=\"Operacion NOT\"];\n"
        grafoarbol += padre+"->"+"not"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        grafoarbol += "operando"+operando.toString()+"[label=\"!\"];\n"
        grafoarbol += "not"+temporal+"->"+"operando"+operando.toString()+";\n"
        operando++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"not"+temporal.toString(),metodos);
        
        switch(valorIzq.tipo){
            case TIPO_DATO.BANDERA:
                if (valorIzq.valor == true){
                    return { tipo:TIPO_DATO.BANDERA, valor: false };
                }
                else{
                    return { tipo:TIPO_DATO.BANDERA, valor: true };
                }
            default:
                console.log("Tipo De Dato Invalido Para Comparacion NOT")
                return undefined;;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.LOWER){
        grafoarbol += "lower"+expresionpro.toString()+"[label=\"Operacion TOLOWER\"];\n"
        grafoarbol += padre+"->"+"lower"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"lower"+temporal.toString(),metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.CADENA:
                return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor.toLowerCase() };
            default:
                console.log("Tipo De Dato Invalido Para Funcion LOWER")
                return undefined;;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.UPPER){
        grafoarbol += "upper"+expresionpro.toString()+"[label=\"Operacion TOUPPER\"];\n"
        grafoarbol += padre+"->"+"upper"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"upper"+temporal.toString(),metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.CADENA:
                return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor.toUpperCase() };
            default:
                console.log("Tipo De Dato Invalido Para Funcion UPPER")
                return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.LENGTH){
        grafoarbol += "length"+expresionpro.toString()+"[label=\"Operacion LENGTH\"];\n"
        grafoarbol += padre+"->"+"length"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"length"+temporal.toString(),metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.CADENA:
                return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor.length };
            default:
                console.log("Tipo De Dato Invalido Para Funcion UPPER")
                return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.TRUNCATE){
        grafoarbol += "truncate"+expresionpro.toString()+"[label=\"Operacion TRUNCATE\"];\n"
        grafoarbol += padre+"->"+"truncate"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"truncate"+temporal.toString(),metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.ENTERO:
                return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor };
            case TIPO_DATO.DECIMAL:
                return { tipo:TIPO_DATO.ENTERO, valor: Math.trunc(valorIzq.valor) };
            default:
                console.log("Tipo De Dato Invalido Para Funcion UPPER")
                return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.ROUND){
        grafoarbol += "round"+expresionpro.toString()+"[label=\"Operacion ROUND\"];\n"
        grafoarbol += padre+"->"+"round"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"round"+temporal.toString(),metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.ENTERO:
                return { tipo:TIPO_DATO.ENTERO, valor: valorIzq.valor };
            case TIPO_DATO.DECIMAL:
                return { tipo:TIPO_DATO.ENTERO, valor: Math.round(valorIzq.valor) };
            default:
                console.log("Tipo De Dato Invalido Para Funcion UPPER")
                return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.TYPEOF){
        grafoarbol += "typeof"+expresionpro.toString()+"[label=\"Operacion TYPEOF\"];\n"
        grafoarbol += padre+"->"+"typeof"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"typeof"+temporal.toString(),metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.ENTERO:
                return { tipo:TIPO_DATO.CADENA, valor: "Int" };
            case TIPO_DATO.DECIMAL:
                return { tipo:TIPO_DATO.CADENA, valor: "Double" };
            case TIPO_DATO.CADENA:
                return { tipo:TIPO_DATO.CADENA, valor: "String" };
            case TIPO_DATO.CARACTER:
                return { tipo:TIPO_DATO.CADENA, valor: "Char" };
            case TIPO_DATO.BANDERA:
                return { tipo:TIPO_DATO.CADENA, valor: "Boolean" };
            default:
                console.log("Tipo De Dato Invalido Para Funcion UPPER")
                return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.TOSTRING){
        grafoarbol += "tostring"+expresionpro.toString()+"[label=\"Operacion TOSTRING\"];\n"
        grafoarbol += padre+"->"+"tostring"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"tostring"+temporal.toString(),metodos);
        switch(valorIzq.tipo){
            case TIPO_VALOR.ENTERO:
                return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor.toString() };

            case TIPO_VALOR.DECIMAL:
                return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor.toString() };

            case TIPO_VALOR.CARACTER:
                return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor.toString() };

            case TIPO_VALOR.CADENA:
                return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor.toString() };
                    
            case TIPO_VALOR.BANDERA:
                return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor.toString() };

            default:
                console.log("Tipo De Dato Invalido Para Funcion UPPER")
                return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.TOCHARARRAY){
        grafoarbol += "tochar"+expresionpro.toString()+"[label=\"Operacion TO CHAR ARRAY\"];\n"
        grafoarbol += padre+"->"+"tochar"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"tochar"+temporal.toString(),metodos);
        switch(valorIzq.tipo){
            case TIPO_DATO.CADENA:
                return { tipo:TIPO_DATO.LISTACAR, valor: valorIzq.valor.split('') };
            default:
                console.log("Tipo De Dato Invalido Para Funcion UPPER")
                return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.CASTEO){
        grafoarbol += "casteo"+expresionpro.toString()+"[label=\"Operacion CASTEO\"];\n"
        grafoarbol += padre+"->"+"casteo"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, tipots,"casteo"+temporal.toString(), metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, tipots,"casteo"+temporal.toString(), metodos);
        switch(valorIzq.tipo){
            case TIPO_VALOR.ENTERO:
                switch(valorDer.tipo){
                    case TIPO_VALOR.DECIMAL:
                        return { tipo:TIPO_DATO.ENTERO, valor: Math.trunc(valorDer.valor) };
    
                    case TIPO_VALOR.CARACTER:
                        return { tipo:TIPO_DATO.ENTERO, valor: valorDer.valor.charCodeAt() };

                    default:
                        console.log('Casteo Explicito Invalido');
                        return undefined;
                }
            
            case TIPO_VALOR.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_VALOR.ENTERO:
                        return { tipo:TIPO_DATO.DECIMAL, valor: valorDer.valor };
                    
                    case TIPO_VALOR.CARACTER:
                        return { tipo:TIPO_DATO.DECIMAL, valor: valorDer.valor.charCodeAt() };
    
                    default:
                        console.log('Casteo Explicito Invalido');
                        return undefined;
                }

            case TIPO_VALOR.CARACTER:
                switch(valorDer.tipo){
                    case TIPO_VALOR.ENTERO:
                        return { tipo:TIPO_DATO.CARACTER, valor: String.fromCharCode(valorDer.valor) };

                    default:
                        console.log('Casteo Explicito Invalido');
                        return undefined;
                }

            case TIPO_VALOR.CADENA:
                switch(valorDer.tipo){
                    default:
                        console.log('Casteo Explicito Invalido');
                        return undefined;
                }
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.TERNARIO){
        grafoarbol += "ternario"+expresionpro.toString()+"[label=\"Operacion TERNARIO\"];\n"
        grafoarbol += padre+"->"+"ternario"+expresionpro.toString()+";\n"
        var temporal = expresionpro
        expresionpro++
        var condicion = procesarexpresion(expresion.condicion, tsglobal, tslocal, tipots,"ternario"+temporal.toString(), metodos);
        if(condicion.valor == true){

            grafoarbol += "valverdadero"+expresionpro.toString()+"[label=\"Operacion VALOR VERDADERO\"];\n"
            grafoarbol += padre+"->"+"valverdadero"+expresionpro.toString()+";\n"
            temporal = expresionpro
            expresionpro++
            var resultado= procesarexpresion(expresion.valverdadero, tsglobal, tslocal, tipots,"valverdadero"+temporal.toString(), metodos);

            grafoarbol += "operando"+operando.toString()+"[label=\"?\"];\n"
            grafoarbol += "ternario"+temporal+"->"+"operando"+operando.toString()+";\n"
            operando++

            grafoarbol += "valfalso"+expresionpro.toString()+"[label=\"Operacion VALOR FALSO\"];\n"
            grafoarbol += padre+"->"+"valfalso"+expresionpro.toString()+";\n"
            expresionpro++
            procesarexpresion(expresion.valfalso, tsglobal, tslocal, tipots,"valfalso"+temporal.toString(), metodos);
            return resultado;
        }
        else if(condicion.valor == false){
            grafoarbol += "valfalso"+expresionpro.toString()+"[label=\"Operacion VALOR FALSO\"];\n"
            grafoarbol += padre+"->"+"valfalso"+expresionpro.toString()+";\n"
            temporal = expresionpro
            expresionpro++
            var resultado= procesarexpresion(expresion.valfalso, tsglobal, tslocal, tipots,"valfalso"+temporal.toString(), metodos);
            
            grafoarbol += "operando"+operando.toString()+"[label=\"?\"];\n"
            grafoarbol += "ternario"+temporal+"->"+"operando"+operando.toString()+";\n"
            operando++

            grafoarbol += "valverdadero"+expresionpro.toString()+"[label=\"Operacion VALOR VERDADERO\"];\n"
            grafoarbol += padre+"->"+"valverdadero"+expresionpro.toString()+";\n"
            expresionpro++
            procesarexpresion(expresion.valverdadero, tsglobal, tslocal, tipots,"valverdadero"+temporal.toString(), metodos);
            return resultado;
        }
    }
    else if(expresion.tipo == TIPO_VALOR.ENTERO){
        if (padre != undefined){
            grafoarbol += "entero"+expresionpro.toString()+"[label=\"VALOR ENTERO\"];\n"
            grafoarbol += padre+"->"+"entero"+expresionpro.toString()+";\n"
            expresionpro++
        }
        if(expresion.valor != undefined){
            grafoarbol += "entero"+expresionpro.toString()+"[label=\""+expresion.valor+"\"];\n"
            grafoarbol += "entero"+(expresionpro-1).toString()+"->"+"entero"+(expresionpro).toString()+";\n"
            expresionpro++
        }
        return { tipo:TIPO_DATO.ENTERO, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.DECIMAL){
        if (padre != undefined){
            grafoarbol += "decimal"+expresionpro.toString()+"[label=\"VALOR DECIMAL\"];\n"
            grafoarbol += padre+"->"+"decimal"+expresionpro.toString()+";\n"
            expresionpro++
        }
        if(expresion.valor != undefined){
            grafoarbol += "decimal"+expresionpro.toString()+"[label=\""+expresion.valor+"\"];\n"
            grafoarbol += "decimal"+(expresionpro-1).toString()+"->"+"decimal"+(expresionpro).toString()+";\n"
            expresionpro++
        }
        return { tipo:TIPO_DATO.DECIMAL, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.CARACTER){
        if (padre != undefined){
            grafoarbol += "caracter"+expresionpro.toString()+"[label=\"VALOR CARACTER\"];\n"
            grafoarbol += padre+"->"+"caracter"+expresionpro.toString()+";\n"
            expresionpro++
        }
        if(expresion.valor != undefined){
            grafoarbol += "caracter"+expresionpro.toString()+"[label=\""+expresion.valor+"\"];\n"
            grafoarbol += "caracter"+(expresionpro-1).toString()+"->"+"caracter"+(expresionpro).toString()+";\n"
            expresionpro++
        }
        return { tipo:TIPO_DATO.CARACTER, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.CADENA){
        if (padre != undefined){
            grafoarbol += "cadena"+expresionpro.toString()+"[label=\"VALOR CADENA\"];\n"
            grafoarbol += padre+"->"+"cadena"+expresionpro.toString()+";\n"
            expresionpro++
        }
        if(expresion.valor != undefined){
            grafoarbol += "cadena"+expresionpro.toString()+"[label=\""+expresion.valor+"\"];\n"
            grafoarbol += "cadena"+(expresionpro-1).toString()+"->"+"cadena"+(expresionpro).toString()+";\n"
            expresionpro++
        }
        return { tipo:TIPO_DATO.CADENA, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.BANDERA){
        if (padre != undefined){
            grafoarbol += "bandera"+expresionpro.toString()+"[label=\"VALOR BANDERA\"];\n"
            grafoarbol += padre+"->"+"bandera"+expresionpro.toString()+";\n"
            expresionpro++
        }
        if(expresion.valor != undefined){
            grafoarbol += "bandera"+expresionpro.toString()+"[label=\""+expresion.valor+"\"];\n"
            grafoarbol += "bandera"+(expresionpro-1).toString()+"->"+"bandera"+(expresionpro).toString()+";\n"
            expresionpro++
        }
        return { tipo:TIPO_DATO.BANDERA, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.IDENTIFICADOR){
        if(tslocal != undefined){
            var aux = new TS([]);
            var postipo = tipots.length;
            while(postipo!=0) {
                if ((typeof tipots[postipo-1]) == "object"){
                    var auxactual = tslocal.popts();
                    aux.pushts(auxactual);
                    var valorr = auxactual.obtener(expresion.valor);
                    if(valorr){
                        let final = aux.lengthts();
                        while(final != 0){
                            tslocal.pushts(aux.popts());
                            final--;
                        }
                        grafoarbol += "identificador"+expresionpro.toString()+"[label=\"VALOR IDENTIFICADOR: "+expresion.valor+"\"];\n"
                        grafoarbol += padre+"->"+"identificador"+expresionpro.toString()+";\n"
                        expresionpro++
                        return { tipo:valorr.tipo, valor:valorr.valor };
                    }
                }else{
                    var valorr = tslocal.obtener(expresion.valor);
                    if(valorr){
                        let final = aux.lengthts();
                        while(final != 0){
                            tslocal.pushts(aux.popts());
                            final--;
                        }
                        grafoarbol += "identificador"+expresionpro.toString()+"[label=\"VALOR IDENTIFICADOR: "+expresion.valor+"\"];\n"
                        grafoarbol += padre+"->"+"identificador"+expresionpro.toString()+";\n"
                        expresionpro++
                        return { tipo:valorr.tipo, valor:valorr.valor };
                    }
                }
                postipo--;
            }
            var valorr = tsglobal.obtener(expresion.valor);
            if(valorr){
                let final = aux.lengthts();
                while(final != 0){
                    tslocal.pushts(aux.popts());
                    final--;
                }
                grafoarbol += "identificador"+expresionpro.toString()+"[label=\"VALOR IDENTIFICADOR: "+expresion.valor+"\"];\n"
                grafoarbol += padre+"->"+"identificador"+expresionpro.toString()+";\n"
                expresionpro++
                return { tipo:valorr.tipo, valor:valorr.valor };
            }
            else {
                let final = aux.lengthts();
                while(final != 0){
                    tslocal.pushts(aux.popts());
                    final--;
                }
                return undefined;
            }
        }
        else{
            var valorr = tsglobal.obtener(expresion.valor);
            if(valorr){
                console.log(valorr)
                grafoarbol += "identificador"+expresionpro.toString()+"[label=\"VALOR IDENTIFICADOR: "+expresion.valor+"\"];\n"
                grafoarbol += padre+"->"+"identificador"+expresionpro.toString()+";\n"
                expresionpro++
                return { tipo:valorr.tipo, valor:valorr.valor };
            }
            else {
                return undefined;
            }
        }
    }
    else if(expresion.expresion == TIPO_VALOR.INCREMENTO){
        var valor = { tipo:TIPO_DATO.INCREMENTO, valor: 1}
        valor = tslocal.actualizar(expresion.identificador, valor,metodos);
        tsReporte.actualizar(expresion.identificador, valor,metodos);
        grafoarbol += "asignacion"+expresionpro.toString()+"[label=\"ASIGNACION INCREMENTO"+expresion.identificador+"\"];\n"
        grafoarbol += padre+"->"+"asignacion"+expresionpro.toString()+";\n"
        expresionpro++
        return valor
    }
    else if(expresion.expresion == TIPO_VALOR.DECREMENTO){
        var valor = { tipo:TIPO_DATO.DECREMENTO, valor: 1}
        valor = tslocal.actualizar(expresion.identificador, valor,metodos);
        tsReporte.actualizar(expresion.identificador, valor,metodos);
        grafoarbol += "asignacion"+expresionpro.toString()+"[label=\"ASIGNACION DECREMENTO"+expresion.identificador+"\"];\n"
        grafoarbol += padre+"->"+"asignacion"+expresionpro.toString()+";\n"
        expresionpro++
        return valor
    }
    else if(expresion == TIPO_VALOR.INCREMENTO){
        grafoarbol += "incremento"+expresionpro.toString()+"[label=\"OPERACION INCREMENTO\"];\n"
        grafoarbol += padre+"->"+"incremento"+expresionpro.toString()+";\n"
        expresionpro++
        return { tipo:TIPO_DATO.INCREMENTO, valor: 1}
    }
    else if(expresion == TIPO_VALOR.DECREMENTO){
        grafoarbol += "decremento"+expresionpro.toString()+"[label=\"OPERACION DECREMENTO\"];\n"
        grafoarbol += padre+"->"+"decremento"+expresionpro.toString()+";\n"
        expresionpro++
        return { tipo:TIPO_DATO.DECREMENTO, valor: 1}
    }
}

module.exports.GrafoArbol = GrafoArbol;