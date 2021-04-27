const TIPO_INSTRUCCION = require('../arbol/instrucciones').TIPO_INSTRUCCION;
const TIPO_OPERACION = require('../arbol/instrucciones').TIPO_OPERACION;
const TIPO_VALOR = require('../arbol/instrucciones').TIPO_VALOR;
const TIPO_DATO = require('../arbol/tablasimbolos').TIPO_DATO;

const TS = require('../arbol/tablasimbolos').TS;
let salida = '';
let banderaciclo = false;

function ejecutar(arbol){
    console.log(arbol);
    salida='';
    let tsglobal = new TS([]);
    let tslocal = new TS([]);
    let metodos = [];
    let main = [];

    ejecutarbloqueglobal(arbol, tsglobal, tslocal, metodos, main);
    if(main.length==1){
        metodos.forEach(metodo2=>{
            if(metodo2.identificador==main[0].identificador){
                if(metodo2.parametros.length==main[0].parametros.length){
                    var valoresmetodo = [];
                    for(var contador = 0; contador<main[0].parametros.length;contador++){
                        var valor = procesarexpresion(main[0].parametros[contador],tsglobal, tslocal);
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
                    for(var contador=0;contador<main[0].parametros.length;contador++){
                        tslocal2.agregar(valoresmetodo[contador].tipo, metodo2.parametros[contador].identificador,valoresmetodo[contador]);
                    }
                    ejecutarbloquelocal(metodo2.instrucciones, tsglobal, tslocal2, metodos);
                }else{
                    console.log("Error se estan mandando una cantidad de valores mayor a la que recibe el metodo")
                    salida = "Error Semantico"
                }
            }
        });
    }
    else{
        console.log("No puede haber mas de un main");
        salida = "Error Semantico"
    }
    return salida;
}

function ejecutarbloqueglobal(instrucciones, tsglobal, tslocal, metodos, main){
    instrucciones.forEach((instruccion)=>{
        if (salida == "Error Semantico"){
            console.log("Error Semantico")
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.DECLARACION){
            ejecutardeclaracionglobal(instruccion, tsglobal,tslocal);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.ASIGNACION){
            ejecutarasignacionglobal(instruccion, tsglobal, tslocal);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.METODO){
            metodos.push(instruccion);
        }
        else if(instruccion.tipo==TIPO_INSTRUCCION.MAIN){
            
            main.push(instruccion);
        }
    });
}

function ejecutarbloquelocal(instrucciones, tsglobal, tslocal,metodos){
    for(var i=0; i<instrucciones.length; i++){
        instruccion = instrucciones[i];
        if (salida == "Error Semantico"){
            console.log("Error Semantico");
            continue;
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.DECLARACION){
            ejecutardeclaracionlocal(instruccion, tsglobal,tslocal,metodos);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.ASIGNACION){
            ejecutarasignacionlocal(instruccion, tsglobal, tslocal,metodos);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.LLAMADA){
            if(banderaciclo==true){
                banderaciclo = false;
                var posible = ejecutarllamada(instruccion, tsglobal, tslocal, metodos);
                banderaciclo = true;
                if(posible){
                    return posible;
                }
            }
            else{
                var posible = ejecutarllamada(instruccion, tsglobal, tslocal, metodos);
                if(posible){
                    return posible;
                }
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.IMPRIMIR){
            ejecutarimprimir(instruccion, tsglobal, tslocal,metodos);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.WHILEE){
            var posible = ejecutarwhile(instruccion, tsglobal, tslocal,metodos);
            if(posible){
                return posible;
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.DOWHILEE){
            var posible = ejecutardowhile(instruccion, tsglobal, tslocal,metodos);
            if(posible){
                return posible;
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.FORR){
            var posible = ejecutarfor(instruccion, tsglobal, tslocal,metodos);
            if(posible){
                return posible;
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.IFF){
            var posible = ejecutarif(instruccion, tsglobal, tslocal,metodos);
            if(posible){
                return posible;
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.BREAK){
            if(banderaciclo){
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
        else if(instruccion.tipo == TIPO_INSTRUCCION.CONTINUE){
            if(banderaciclo){
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
    }
}

function ejecutarimprimir(instruccion, tsglobal, tslocal,metodos){
    var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal,metodos);
    console.log(valor)
    
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

function ejecutardeclaracionglobal(instruccion, tsglobal, tslocal,metodos){
    var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal,metodos);
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        var error = tsglobal.agregar(instruccion.tipo_dato, instruccion.id, valor,metodos);
        if (error == undefined){
            salida = "Error Semantico";
        }
    }
}

function ejecutardeclaracionlocal(instruccion, tsglobal, tslocal,metodos){
    var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal,metodos);
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        var error =  tslocal.agregar(instruccion.tipo_dato, instruccion.id, valor,metodos);
        if (error == undefined){
            salida = "Error Semantico";
        }
    }
}

function ejecutarasignacionglobal(instruccion, tsglobal, tslocal,metodos){
    var valor = procesarexpresion(instruccion.expresion,tsglobal, tslocal,metodos);
    if(tsglobal.obtener(instruccion.identificador)!=undefined){
        var error =  tsglobal.actualizar(instruccion.identificador, valor,metodos);
        if (error == undefined){
            salida = "Error Semantico";
        }
    }
}

function ejecutarasignacionlocal(instruccion, tsglobal, tslocal,metodos){
    var valor = procesarexpresion(instruccion.expresion,tsglobal, tslocal,metodos);
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        if(tslocal.obtener(instruccion.identificador)!=undefined){
            var error = tslocal.actualizar(instruccion.identificador, valor,metodos);
            if (error == undefined){
                salida = "Error Semantico";
            }
        }
        else if(tsglobal.obtener(instruccion.identificador)!=undefined){
            var error = tsglobal.actualizar(instruccion.identificador, valor,metodos);
            if (error == undefined){
                salida = "Error Semantico";
            }
        }
    }
}

function ejecutarllamada(instruccion, tsglobal, tslocal, metodos){
    var error;
    metodos.forEach(metodo2=>{
        if(metodo2.identificador==instruccion.identificador){
            /*Sobrecarga de metodos (NO SE HACE EN ESTE PROYECTO) puede servir en compi2
                cadena1 = tipo (de todos los identificadores del metodo)
                cadena2 = tipo (de todos los valores de la llamada)
                cadena1==cadena2 (sobrecarga hacia match)
            */
            if(metodo2.parametros.length==instruccion.parametros.length){
                var valoresmetodo = [];
                for(var contador = 0; contador<instruccion.parametros.length;contador++){
                    var valor = procesarexpresion(instruccion.parametros[contador],tsglobal, tslocal, metodos);
                    if(valor.tipo != metodo2.parametros[contador].tipo){
                        console.log("El valor mandado no es el mismo que se declaro");
                        salida = "Error Semantico";
                        return;
                    }
                    else{
                        valoresmetodo.push(valor);
                    }       
                }
                var tslocal2=new TS([]);
                for(var contador=0;contador<instruccion.parametros.length;contador++){
                    tslocal2.agregar(valoresmetodo[contador].tipo, metodo2.parametros[contador].identificador,valoresmetodo[contador]);
                }
                console.log(tslocal2._simbolos);
                error = ejecutarbloquelocal(metodo2.instrucciones, tsglobal, tslocal2, metodos);
            }
            else{
                console.log("Error se estan mandando una cantidad de valores mayor a la que recibe el metodo");
                salida = "Error Semantico";
            }
        }
    });
    if (error){
        return error;
    }
}

function ejecutarif(instruccion, tsglobal, tslocal,metodos){
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,metodos);
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        if(valor.valor==true){
            return ejecutarbloquelocal(instruccion.cuerpoverdadero,tsglobal,tslocal,metodos);
        }
        else if(valor.valor==false){
            if(instruccion.cuerpofalso!=undefined){
                return ejecutarbloquelocal(instruccion.cuerpofalso,tsglobal,tslocal,metodos);
            }
        }
    }
}

function ejecutarwhile(instruccion, tsglobal, tslocal,metodos){
    banderaciclo = true;
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,metodos);
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        while(valor.valor){
            var posible = ejecutarbloquelocal(instruccion.instrucciones,tsglobal,tslocal,metodos);
            if (posible){
                if (posible.tipo_resultado == TIPO_INSTRUCCION.BREAK){
                    banderaciclo = false;
                    break;
                }
                else if(posible.tipo_resultado == TIPO_INSTRUCCION.CONTINUE){
                    continue
                }
                else if(posible.tipo_resultado == TIPO_INSTRUCCION.ERRORR){
                    console.log(posible.resultado)
                    salida = "Error Semantico";
                    banderaciclo = false;
                    break;
                }
            }
            valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,metodos);
            if (valor == undefined){
                salida = "Error Semantico";
                banderaciclo = false;
                break;
            }
        }
    }
    banderaciclo = false;
}

function ejecutardowhile(instruccion, tsglobal, tslocal,metodos){
    banderaciclo = true;
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,metodos);
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        var posible = ejecutarbloquelocal(instruccion.instrucciones,tsglobal,tslocal,metodos);
        if (posible){
            if (posible.tipo_resultado == TIPO_INSTRUCCION.BREAK){
                banderaciclo = false;
                console.log("Break En Primera Iteracion Do While");
            }
            else if(posible.tipo_resultado == TIPO_INSTRUCCION.CONTINUE){
                valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,metodos);
                if (valor == undefined){
                    salida = "Error Semantico";
                }else{
                    while(valor.valor){
                        posible = ejecutarbloquelocal(instruccion.instrucciones,tsglobal,tslocal,metodos);
                        if (posible){
                            if (posible.tipo_resultado == TIPO_INSTRUCCION.BREAK){
                                console.log("Break Iteraciones Do While");
                                banderaciclo = false;
                                break;
                            }
                            else if(posible.tipo_resultado == TIPO_INSTRUCCION.CONTINUE){
                                continue;
                            }
                            else if(posible.tipo_resultado == TIPO_INSTRUCCION.ERRORR){
                                console.log(posible.resultado)
                                salida = "Error Semantico";
                                banderaciclo = false;
                                break;
                            }
                        }
                        valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,metodos);
                        if (valor == undefined){
                            salida = "Error Semantico";
                            banderaciclo = false;
                            break;
                        }
                    }
                }
            }
            else if(posible.tipo_resultado == TIPO_INSTRUCCION.ERRORR){
                console.log(posible.resultado)
                salida = "Error Semantico";
                banderaciclo = false;
            }
        }else{
            valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,metodos);
            if (valor == undefined){
                salida = "Error Semantico";
            }else{
                while(valor.valor){
                    posible = ejecutarbloquelocal(instruccion.instrucciones,tsglobal,tslocal,metodos);
                    if (posible){
                        if (posible.tipo_resultado == TIPO_INSTRUCCION.BREAK){
                            console.log("Break Iteraciones Do While");
                            break;
                        }
                        else if(posible.tipo_resultado == TIPO_INSTRUCCION.CONTINUE){
                            continue;
                        }
                        else if(posible.tipo_resultado == TIPO_INSTRUCCION.ERRORR){
                            console.log(posible.resultado)
                            salida = "Error Semantico";
                            banderaciclo = false;
                            break;
                        }
                    }
                    valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,metodos);
                    if (valor == undefined){
                        salida = "Error Semantico";
                        break;
                    }
                }
            }
        }
    }
    banderaciclo = false;
}

function ejecutarfor(instruccion, tsglobal, tslocal,metodos){
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,metodos);
    if (valor == undefined){
        salida = "Error Semantico";
    }else{
        ejecutarbloquelocal(instruccion.instrucciones,tsglobal,tslocal,metodos);
        valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal,metodos);
        if (valor == undefined){
            salida = "Error Semantico";
        }
        console.log("Falta Terminar");
    }
}

function procesarexpresion(expresion, tsglobal, tslocal,metodos){
    if(expresion.tipo == TIPO_OPERACION.SUMA){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
    if(expresion.tipo == TIPO_OPERACION.INCREMENTO){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
    if(expresion.tipo == TIPO_OPERACION.DECREMENTO){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
        
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);

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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
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
    else if(expresion.tipo == TIPO_OPERACION.CASTEO){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal,metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal,metodos);
        switch(valorIzq.tipo){
            case TIPO_VALOR.ENTERO:
                switch(valorDer.tipo){
                    case TIPO_VALOR.DECIMAL:
                        return { tipo:TIPO_DATO.ENTERO, valor: Math.trunc(valorDer.valor) };
    
                    case TIPO_VALOR.CARACTER:
                        return { tipo:TIPO_DATO.ENTERO, valor: valorDer.valor.charCodeAt() };

                    default:
                        console.log('Casteo Explicito Invalido');
                        return undefined;;
                }
            
            case TIPO_VALOR.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_VALOR.ENTERO:
                        return { tipo:TIPO_DATO.DECIMAL, valor: valorDer.valor };
                    
                    case TIPO_VALOR.CARACTER:
                        return { tipo:TIPO_DATO.DECIMAL, valor: valorDer.valor.charCodeAt() };
    
                    default:
                        console.log('Casteo Explicito Invalido');
                        return undefined;;
                }

            case TIPO_VALOR.CARACTER:
                switch(valorDer.tipo){
                    case TIPO_VALOR.ENTERO:
                        return { tipo:TIPO_DATO.CARACTER, valor: String.fromCharCode(valorDer.valor) };

                    default:
                        console.log('Casteo Explicito Invalido');
                        return undefined;;
                }

            case TIPO_VALOR.CADENA:
                switch(valorDer.tipo){

                    case TIPO_VALOR.ENTERO:
                        return { tipo:TIPO_DATO.CADENA, valor: valorDer.valor.toString() };

                    case TIPO_VALOR.DECIMAL:
                        return { tipo:TIPO_DATO.CADENA, valor: valorDer.valor.toString() };
    
                    default:
                        console.log('Casteo Explicito Invalido');
                        return undefined;;
                }
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.TERNARIO){
        var condicion = procesarexpresion(expresion.condicion, tsglobal, tslocal, metodos);
        if(condicion.valor == true){
            var resultado= procesarexpresion(expresion.valverdadero, tslocal, tsglobal, metodos);
            return resultado;
        }
        else if(condicion.valor == false){
            var resultado= procesarexpresion(expresion.valfalso, tslocal, tsglobal, metodos);
            return resultado;
        }
    }
    else if(expresion.tipo == TIPO_VALOR.ENTERO){
        return { tipo:TIPO_DATO.ENTERO, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.DECIMAL){
        return { tipo:TIPO_DATO.DECIMAL, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.CARACTER){
        return { tipo:TIPO_DATO.CARACTER, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.CADENA){
        return { tipo:TIPO_DATO.CADENA, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.BANDERA){
        return { tipo:TIPO_DATO.BANDERA, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.IDENTIFICADOR){
        if(tslocal != undefined){
            var valorr = tslocal.obtener(expresion.valor);
            if(valorr){
                return { tipo:valorr.tipo, valor:valorr.valor };
            }
            else{
                valorr = tsglobal.obtener(expresion.valor);
                if(valorr){
                    return { tipo:valorr.tipo, valor:valorr.valor };
                }
                else {
                    return undefined;
                }
            }
        }
        else{
            var valorr = tsglobal.obtener(expresion.valor);
            if(valorr){
                console.log(valorr)
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
        return valor
    }
    else if(expresion.expresion == TIPO_VALOR.DECREMENTO){
        var valor = { tipo:TIPO_DATO.DECREMENTO, valor: 1}
        valor = tslocal.actualizar(expresion.identificador, valor,metodos);
        return valor
    }
    else if(expresion == TIPO_VALOR.INCREMENTO){
        return { tipo:TIPO_DATO.INCREMENTO, valor: 1}
    }
    else if(expresion == TIPO_VALOR.DECREMENTO){
        return { tipo:TIPO_DATO.DECREMENTO, valor: 1}
    }
}

module.exports.ejecutar = ejecutar;