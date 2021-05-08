const { TIPO_VALOR } = require("./instrucciones");

const TIPO_DATO = {
    ENTERO:         'VAL_ENTERO',
    DECIMAL:        'VAL_DECIMAL',
    CARACTER:       'VAL_CARACTER',
    CADENA:         'VAL_CADENA',
    INCREMENTO:     'VAL_INCREMENTO',
    DECREMENTO:     'VAL_DECREMENTO',
    BANDERA:        'VAL_BANDERA',
    VECTORE:        'VAL_VECTORE',
    VECTORD:        'VAL_VECTORD',
    VECTORCAR:      'VAL_VECTORCAR',
    VECTORCAD:      'VAL_VECTORCAD',
    VECTORB:        'VAL_VECTORB',
    LISTAE:         'VAL_LISTAE',
    LISTAD:         'VAL_LISTAD',
    LISTACAR:       'VAL_LISTACAR',
    LISTACAD:       'VAL_LISTACAD',
    LISTAB:         'VAL_LISTAB'
}

function crearSimbolo(tipo, id, valor,ambito,linea,columna){
    if (tipo == "VAL_ENTERO"){
        columna = columna + 4
    }else if (tipo == "VAL_DECIMAL"){
        columna = columna + 7
    }else if (tipo == "VAL_CARACTER"){
        columna = columna + 5
    }else if (tipo == "VAL_CADENA"){
        columna = columna + 7
    }else if (tipo == "VAL_BANDERA"){
        columna = columna + 9
    }else if (tipo == "VAL_VECTORE"){
        columna = columna + 6
    }else if (tipo == "VAL_VECTORD"){
        columna = columna + 9
    }else if (tipo == "VAL_VECTORCAR"){
        columna = columna + 7
    }else if (tipo == "VAL_VECTORCAD"){
        columna = columna + 9
    }else if (tipo == "VAL_VECTORB"){
        columna = columna + 11
    }else if (tipo == "VAL_LISTAE"){
        columna = columna + 10
    }else if (tipo == "VAL_LISTAD"){
        columna = columna + 13
    }else if (tipo == "VAL_LISTACAR"){
        columna = columna + 11
    }else if (tipo == "VAL_LISTACAD"){
        columna = columna + 14
    }else if (tipo == "VAL_LISTAB"){
        columna = columna + 16
    }
    return {
        tipo: tipo,
        id: id,
        valor: valor,
        ambito: ambito,
        linea:linea,
        columna:columna
    }
}

class TS {
    constructor(simbolos) {
        this._simbolos = [];
        this._simbolos = this._simbolos.concat(simbolos);
    }
    agregar(tipo, id, valor,ambito,linea,columna){
        var simbolo = this._simbolos.filter((simbolo)=>simbolo.id.toLowerCase()== id.toLowerCase())[0];
        if(simbolo){
            //Manejan si no existe variable
            //console.log('La variable ya existe');
            return undefined
        }
        else{
            if (tipo == "VAL_VECTORE"){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor,ambito,linea,columna));
                return ""
            }else if (tipo == "VAL_VECTORD"){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor,ambito,linea,columna));
                return ""
            }else if (tipo == "VAL_VECTORCAR"){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor,ambito,linea,columna));
                return ""
            }else if (tipo == "VAL_VECTORCAD"){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor,ambito,linea,columna));
                return ""
            }else if (tipo == "VAL_VECTORB"){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor,ambito,linea,columna));
                return ""
            }else if (tipo == "VAL_LISTAE"){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor,ambito,linea,columna));
                return ""
            }else if (tipo == "VAL_LISTAD"){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor,ambito,linea,columna));
                return ""
            }else if (tipo == "VAL_LISTACAR"){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor,ambito,linea,columna));
                return ""
            }else if (tipo == "VAL_LISTACAD"){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor,ambito,linea,columna));
                return ""
            }else if (tipo == "VAL_LISTAB"){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor,ambito,linea,columna));
                return ""
            }
            else if (valor == undefined){
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), undefined,ambito,linea,columna));
                return ""
            }
            else if (tipo == valor.tipo){
                //Si hay casteos implicitos aca los verifican
                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor.valor,ambito,linea,columna));
                return ""
            }else{
                //Manejan si el casteo no existe
                switch(tipo){
                    case TIPO_VALOR.ENTERO:
                        switch(valor.tipo){
                            
                            case TIPO_VALOR.DECIMAL:
                                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), Math.trunc(valor.valor),ambito,linea,columna));
                                return "";

                            case TIPO_VALOR.BANDERA:
                                if(valor.valor==true){
                                    this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), 1,ambito,linea,columna));
                                }
                                else if (valor.valor==false){
                                    this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), 0,ambito,linea,columna));
                                }
                                return "";

                            default:
                                console.log('No se pudo castear implicitamente por tipos incompatibles');
                                return undefined;
                        }
                    
                    case TIPO_VALOR.DECIMAL:
                        switch(valor.tipo){
                            case TIPO_VALOR.ENTERO:
                                this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), valor.valor,ambito,linea,columna));
                                return "";
            
                            case TIPO_VALOR.BANDERA:
                                if(valor.valor==true){
                                    this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), 1,ambito,linea,columna));
                                }
                                else if (valor.valor==false){
                                    this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), 0,ambito,linea,columna));
                                }
                                return "";

                            default:
                                console.log('No se pudo castear implicitamente por tipos incompatibles');
                                return undefined;
                        }
    
                    case TIPO_VALOR.CARACTER:
                        switch(valor.tipo){
                            default:
                                console.log('No se pudo castear implicitamente por tipos incompatibles');
                                return undefined;
                        }
    
                    case TIPO_VALOR.CADENA:
                        switch(valor.tipo){
            
                            default:
                                console.log('No se pudo castear implicitamente por tipos incompatibles');
                                return undefined;
                        }
    
                    case TIPO_VALOR.BANDERA:
                        switch(valor.tipo){
                            case TIPO_VALOR.ENTERO:
                                if (valor.valor == 1){
                                    this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), true,ambito,linea,columna));
                                }else if (valor.valor == 0){
                                    this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), false,ambito,linea,columna));
                                }else{
                                    console.log('No se pudo castear implicitamente por tipos incompatibles');
                                    return undefined;
                                }
                                return "";
                            
                            case TIPO_VALOR.DECIMAL:
                                if (valor.valor == 1){
                                    this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), true,ambito,linea,columna));
                                }else if (valor.valor == 0){
                                    this._simbolos.push(crearSimbolo(tipo, id.toLowerCase(), false,ambito,linea,columna));
                                }else{
                                    console.log('No se pudo castear implicitamente por tipos incompatibles');
                                    return undefined;
                                }
                                return "";

                            default:
                                console.log('No se pudo castear implicitamente por tipos incompatibles');
                                return undefined;
                        }
                }
            }
        }
    }
    obtener(id){
        var simbolo = this._simbolos.filter((simbolo)=> simbolo.id.toLowerCase()==id.toLowerCase())[0];
        if(simbolo){
            return simbolo;
        }
        else{
            //Manejar que devolvorean si no existe
            //console.log('No existe la variable: '+id);
            return undefined;
        }
    }
    actualizar(id, valor){
        var simbolo = undefined//this._simbolos.filter(simbolo=>simbolo.id.toLowerCase()  == id.toLowerCase())[0];
        for (let i = 0; i < this._simbolos.length; i++) {
            if(this._simbolos[i].id != undefined){
                if(this._simbolos[i].id.toLowerCase() == id.toLowerCase()){
                    simbolo = this._simbolos[i]
                    break;
                }
            }
        }
        if(simbolo){
            if(simbolo.tipo == "VAL_VECTORE"){
                simbolo.valor==valor;
                return "";
            }else if(simbolo.tipo == "VAL_VECTORD"){
                simbolo.valor==valor;
                return "";
            }else if(simbolo.tipo == "VAL_VECTORCAR"){
                simbolo.valor==valor;
                return "";
            }else if(simbolo.tipo == "VAL_VECTORCAD"){
                simbolo.valor==valor;
                return "";
            }else if(simbolo.tipo == "VAL_VECTORB"){
                simbolo.valor==valor;
                return "";
            }else if(simbolo.tipo == "VAL_LISTAE"){
                simbolo.valor==valor;
                return "";
            }else if(simbolo.tipo == "VAL_LISTAD"){
                simbolo.valor==valor;
                return "";
            }else if(simbolo.tipo == "VAL_LISTACAR"){
                simbolo.valor==valor;
                return "";
            }else if(simbolo.tipo == "VAL_LISTACAD"){
                simbolo.valor==valor;
                return "";
            }else if(simbolo.tipo == "VAL_LISTAB"){
                simbolo.valor==valor;
                return "";
            }
            else if(simbolo.tipo == valor.tipo){
                simbolo.valor=valor.valor;
                return ""
            }
            else{
                // a=3; donde a es un decimal EN ESTA PARTE VERIFICAN LOS POSIBLES CASTEOS
                switch(simbolo.tipo){

                    case TIPO_VALOR.ENTERO:
                        switch(valor.tipo){
                            
                            case TIPO_VALOR.DECIMAL:
                                simbolo.valor==Math.trunc(valor.valor);
                                return "";

                            case TIPO_VALOR.INCREMENTO:
                                simbolo.valor++;
                                return simbolo;

                            case TIPO_VALOR.DECREMENTO:
                                simbolo.valor--;
                                return simbolo;

                            case TIPO_VALOR.BANDERA:
                                if(valor.valor==true){
                                    simbolo.valor=1;
                                }
                                else if (valor.valor==false){
                                    simbolo.valor=0;
                                }
                                return "";

                            default:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return undefined;
                        }
                    
                    case TIPO_VALOR.DECIMAL:
                        switch(valor.tipo){
                            case TIPO_VALOR.ENTERO:
                                simbolo.tipo==valor.valor;
                                return "";
                            
                            case TIPO_VALOR.INCREMENTO:
                                simbolo.valor == simbolo.valor + 1;
                                return simbolo;

                            case TIPO_VALOR.DECREMENTO:
                                simbolo.valor--;
                                return simbolo;
            
                            case TIPO_VALOR.BANDERA:
                                if(valor.valor==true){
                                    simbolo.valor=1;
                                }
                                else if (valor.valor==false){
                                    simbolo.valor=0;
                                }
                                return "";

                            default:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return undefined;
                        }
    
                    case TIPO_VALOR.CARACTER:
                        switch(valor.tipo){
                            default:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return undefined;
                        }
    
                    case TIPO_VALOR.CADENA:
                        switch(valor.tipo){
                            default:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return undefined;
                        }
    
                    case TIPO_VALOR.BANDERA:
                        switch(valor.tipo){
                            case TIPO_VALOR.ENTERO:
                                if (valor.valor == 1){
                                    simbolo.valor = true;
                                }else if (valor.valor == 0){
                                    simbolo.valor = false;
                                }else{
                                    console.log('No se pudo actualizar por tipos incompatibles');
                                    return undefined;
                                }
                                return "";
                            
                            case TIPO_VALOR.DECIMAL:
                                if (valor.valor == 1){
                                    simbolo.valor = true;
                                }else if (valor.valor == 0){
                                    simbolo.valor = false;
                                }else{
                                    console.log('No se pudo actualizar por tipos incompatibles');
                                    return undefined;
                                }
                                return "";

                            default:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return undefined;
                        }
                }
            }
        }
    }
    pushts(nueva){
        this._simbolos.push(nueva);
    }
    popts(){
        var actual = this._simbolos.pop();
        return actual
    }
    lengthts(){
        return this._simbolos.length;
    }
    aumentarlista(id,valor){
        var simbolo = undefined//this._simbolos.filter(simbolo=>simbolo.id.toLowerCase()  == id.toLowerCase())[0];
        for (let i = 0; i < this._simbolos.length; i++) {
            if(this._simbolos[i].id != undefined){
                if(this._simbolos[i].id.toLowerCase() == id.toLowerCase()){
                    simbolo = this._simbolos[i]
                    break;
                }
            }
        }
        if(simbolo){
            if(simbolo.tipo == "VAL_LISTAE"){
                if(valor.tipo == "VAL_ENTERO"){
                    simbolo.valor.push(valor);
                    return "";
                }else{
                    console.log("valor de expresion invalido, no es tipo entero")
                    return undefined;
                }
            }else if(simbolo.tipo == "VAL_LISTAD"){
                if(valor.tipo == "VAL_DECIMAL"){
                    simbolo.valor.push(valor);
                    return "";
                }else{
                    console.log("valor de expresion invalido, no es tipo entero")
                    return undefined;
                }
            }else if(simbolo.tipo == "VAL_LISTACAR"){
                if(valor.tipo == "VAL_CARACTER"){
                    simbolo.valor.push(valor);
                    return "";
                }else{
                    console.log("valor de expresion invalido, no es tipo entero")
                    return undefined;
                }
            }else if(simbolo.tipo == "VAL_LISTACAD"){
                if(valor.tipo == "VAL_CADENA"){
                    simbolo.valor.push(valor);
                    return "";
                }else{
                    console.log("valor de expresion invalido, no es tipo entero")
                    return undefined;
                }
            }else if(simbolo.tipo == "VAL_LISTAB"){
                if(valor.tipo == "VAL_BANDERA"){
                    simbolo.valor.push(valor);
                    return "";
                }else{
                    console.log("valor de expresion invalido, no es tipo entero")
                    return undefined;
                }
            }else{
                console.log("Tipo invalido, no es una lista")
                return undefined
            }
        }
    }
    get simbolos() {
        return this._simbolos;
    }
}

module.exports.TIPO_DATO = TIPO_DATO;
module.exports.TS = TS;