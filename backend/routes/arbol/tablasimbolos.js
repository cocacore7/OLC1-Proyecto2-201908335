const { TIPO_VALOR } = require("./instrucciones");

const TIPO_DATO = {
    ENTERO:         'VAL_ENTERO',
    DECIMAL:        'VAL_DECIMAL',
    CARACTER:       'VAL_CARACTER',
    CADENA:         'VAL_CADENA',
    BANDERA:        'VAL_BANDERA'
}

function crearSimbolo(tipo, id, valor){
    return {
        tipo: tipo,
        id: id,
        valor: valor
    }
}

class TS {
    constructor(simbolos) {
        this._simbolos = simbolos;
    }
    agregar(tipo, id, valor){
        var simbolo = this._simbolos.filter((simbolo)=>simbolo.id==id)[0];
        if(simbolo){
            //Manejan si no existe variable
            console.log('La variable ya existe');
        }
        else{
            if (tipo == valor.tipo){
                //Si hay casteos implicitos aca los verifican
                this._simbolos.push(crearSimbolo(tipo, id, valor.valor));
            }else{
                //Manejan si el casteo no existe
                console.log('Error Semantico');
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
            console.log('No existe la variable: '+id);
            return undefined;
        }
    }
    actualizar(id, valor){
        var simbolo = this._simbolos.filter(simbolo=>simbolo.id == id)[0];
        if(simbolo){
            if(simbolo.tipo == valor.tipo){
                simbolo.valor=valor.valor;
            }
            else{
                // a=3; donde a es un decimal EN ESTA PARTE VERIFICAN LOS POSIBLES CASTEOS
                switch(simbolo.tipo){
                    case TIPO_VALOR.ENTERO:
                        switch(valor.tipo){
                            
                            case TIPO_VALOR.DECIMAL:
                                simbolo.valor==Math.trunc(valor.valor);
                            break;

                            case TIPO_VALOR.BANDERA:
                                if(valor.valor==true){
                                    simbolo.valor=1;
                                }
                                else if (valor.valor==false){
                                    simbolo.valor=0;
                                }
                            break;

                            default:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return;
                        }
    
                    break;
                    
                    case TIPO_VALOR.DECIMAL:
                        switch(valor.tipo){
                            case TIPO_VALOR.ENTERO:
                                simbolo.tipo==valor.valor;
                            break;
            
                            case TIPO_VALOR.BANDERA:
                                if(valor.valor==true){
                                    simbolo.valor=1;
                                }
                                else if (valor.valor==false){
                                    simbolo.valor=0;
                                }
                            break;

                            default:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return;
                        }
    
                    break;
    
                    case TIPO_VALOR.CARACTER:
                        switch(valor.tipo){
                            
                            case TIPO_VALOR.CADENA:
                                simbolo.valor=valor.valor;
                            break;
            
                            default:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return;
                        }
    
                    break;
    
                    case TIPO_VALOR.CADENA:
                        switch(valor.tipo){
                            
                            case TIPO_VALOR.CARACTER:
                                simbolo.valor=valor.valor;
                            break;
            
                            default:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return;
                        }
    
                    break;
    
                    case TIPO_VALOR.BANDERA:
                        switch(valor.tipo){
                            case TIPO_VALOR.ENTERO:
                                if (valor.valor == 1){
                                    simbolo.valor = true;
                                }else if (valor.valor == 0){
                                    simbolo.valor = false;
                                }else{
                                    console.log('No se pudo actualizar por tipos incompatibles');
                                    return;
                                }
                            break;
                            
                            case TIPO_VALOR.DECIMAL:
                                if (valor.valor == 1){
                                    simbolo.valor = true;
                                }else if (valor.valor == 0){
                                    simbolo.valor = false;
                                }else{
                                    console.log('No se pudo actualizar por tipos incompatibles');
                                    return;
                                }
                            break;
            
                            case TIPO_VALOR.CARACTER:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return;
            
                            case TIPO_VALOR.CADENA:
                                console.log('No se pudo actualizar por tipos incompatibles');
                                return;
                        }
    
                    break;
                }
            }
        }
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