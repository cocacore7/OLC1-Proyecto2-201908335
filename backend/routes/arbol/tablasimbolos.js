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

function crearSimbolo(tipo, id, valor,ambito){
    return {
        tipo: tipo,
        id: id,
        valor: valor,
        ambito: ambito
    }
}

class TS {
    constructor(simbolos) {
        this._simbolos = [];
        this._simbolos = this._simbolos.concat(simbolos);
    }
    agregar(tipo, id, valor,ambito){
        var simbolo = this._simbolos.filter((simbolo)=>simbolo.id==id)[0];
        if(simbolo){
            //Manejan si no existe variable
            //console.log('La variable ya existe');
            return ""
        }
        else{
            if (valor == undefined){
                this._simbolos.push(crearSimbolo(tipo, id, undefined,ambito));
                return ""
            }
            else if (tipo == valor.tipo){
                //Si hay casteos implicitos aca los verifican
                this._simbolos.push(crearSimbolo(tipo, id, valor.valor,ambito));
                return ""
            }else{
                //Manejan si el casteo no existe
                switch(tipo){
                    case TIPO_VALOR.ENTERO:
                        switch(valor.tipo){
                            
                            case TIPO_VALOR.DECIMAL:
                                this._simbolos.push(crearSimbolo(tipo, id, Math.trunc(valor.valor),ambito));
                                return "";

                            case TIPO_VALOR.BANDERA:
                                if(valor.valor==true){
                                    this._simbolos.push(crearSimbolo(tipo, id, 1),ambito);
                                }
                                else if (valor.valor==false){
                                    this._simbolos.push(crearSimbolo(tipo, id, 0),ambito);
                                }
                                return "";

                            default:
                                console.log('No se pudo castear implicitamente por tipos incompatibles');
                                return undefined;
                        }
                    
                    case TIPO_VALOR.DECIMAL:
                        switch(valor.tipo){
                            case TIPO_VALOR.ENTERO:
                                this._simbolos.push(crearSimbolo(tipo, id, valor.valor),ambito);
                                return "";
            
                            case TIPO_VALOR.BANDERA:
                                if(valor.valor==true){
                                    this._simbolos.push(crearSimbolo(tipo, id, 1),ambito);
                                }
                                else if (valor.valor==false){
                                    this._simbolos.push(crearSimbolo(tipo, id, 0),ambito);
                                }
                                return "";

                            default:
                                console.log('No se pudo castear implicitamente por tipos incompatibles');
                                return undefined;
                        }
    
                    case TIPO_VALOR.CARACTER:
                        switch(valor.tipo){
                            
                            case TIPO_VALOR.CADENA:
                                this._simbolos.push(crearSimbolo(tipo, id, valor.valor),ambito);
                                return "";
            
                            default:
                                console.log('No se pudo castear implicitamente por tipos incompatibles');
                                return undefined;
                        }
    
                    case TIPO_VALOR.CADENA:
                        switch(valor.tipo){
                            
                            case TIPO_VALOR.CARACTER:
                                this._simbolos.push(crearSimbolo(tipo, id, valor.valor),ambito);
                                return "";
            
                            default:
                                console.log('No se pudo castear implicitamente por tipos incompatibles');
                                return undefined;
                        }
    
                    case TIPO_VALOR.BANDERA:
                        switch(valor.tipo){
                            case TIPO_VALOR.ENTERO:
                                if (valor.valor == 1){
                                    this._simbolos.push(crearSimbolo(tipo, id, true),ambito);
                                }else if (valor.valor == 0){
                                    this._simbolos.push(crearSimbolo(tipo, id, false),ambito);
                                }else{
                                    console.log('No se pudo castear implicitamente por tipos incompatibles');
                                    return undefined;
                                }
                                return "";
                            
                            case TIPO_VALOR.DECIMAL:
                                if (valor.valor == 1){
                                    this._simbolos.push(crearSimbolo(tipo, id, true),ambito);
                                }else if (valor.valor == 0){
                                    this._simbolos.push(crearSimbolo(tipo, id, false),ambito);
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
        var simbolo = this._simbolos.filter((simbolo)=>simbolo.id==id)[0];
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
        var simbolo = this._simbolos.filter(simbolo=>simbolo.id == id)[0];
        if(simbolo){
            if(simbolo.tipo == valor.tipo){
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
                            
                            case TIPO_VALOR.CADENA:
                                simbolo.valor=valor.valor;
                                return "";
            
                            default:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return undefined;
                        }
    
                    case TIPO_VALOR.CADENA:
                        switch(valor.tipo){
                            
                            case TIPO_VALOR.CARACTER:
                                simbolo.valor=valor.valor;
                                return "";
            
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
    get simbolos() {
        return this._simbolos;
    }
}

module.exports.TIPO_DATO = TIPO_DATO;
module.exports.TS = TS;

/*
    Guia para tablas
    int b=0;
    int a=1;
    if(true){
    int a=0;
    }
    int a=0;
    
    ts = new ts([]);
    //ts->se creo a y b
    ejecutarif(ts);
    ejecutarif(ts){
        tsif = new ts(ts);
        //tsif -> ya incluye a y b; 
    }

    decimal a <- 3.5;
    cout << a;
*/