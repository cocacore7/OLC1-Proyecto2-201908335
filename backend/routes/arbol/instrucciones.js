const TIPO_VALOR = {
    ENTERO:             'VAL_ENTERO',
    DECIMAL:            'VAL_DECIMAL',
    CADENA:             'VAL_CADENA',
    CARACTER:           'VAL_CARACTER',
    BANDERA:            'VAL_BANDERA',
    IDENTIFICADOR:      'VAL_IDENTIFICADOR'
}

const TIPO_OPERACION = {
    SUMA:               'OP_SUMA',
    RESTA:              'OP_RESTA',
    MULTIPLICACION:     'OP_MULTIPLICACION',
    DIVISION:           'OP_DIVISION',
    POTENCIA:           'OP_POTENCIA',
    MODULO:             'OP_MODULO',
    NEGATIVO:           'OP_NEGATIVO',
    MENOR:              'OP_MENOR',
    MAYOR:              'OP_MAYOR',
    MENORIGUAL:         'OP_MENORIGUAL',
    MAYORIGUAL:         'OP_MAYORIGUAL',
    IGUALIGUAL:         'OP_IGUALIGUAL',
    NOIGUAL:            'OP_NOIGUAL',
    OR:                 'OP_OR',
    AND:                'OP_AND',
    NOT:                'OP_NOT'
}

const TIPO_INSTRUCCION = {
    IMPRIMIR:           'INSTR_IMPRIMIR',
    DECLARACION:        'INSTR_DECLARACION',
    ASIGNACION:         'INSTR_ASIGNACION',
    WHILEE:             'INSTR_WHILE',
    DOWHILEE:           'INSTR_DOWHILE',
    FORR:               'INSTR_FOR',
    IFF:                'INSTR_IF',
    SWITCHH:            'INSTR_SWITCH',
    METODO:             'INSTR_METODO',
    MAIN:               'INSTR_MAIN'
}

const INSTRUCCIONES = {
    nuevaOperacionBinaria: function(tipo, operandoIzq, operandoDer){
        return {
            tipo: tipo,
            operandoIzq: operandoIzq,
            operandoDer: operandoDer
        }
    },
    nuevaOperacionUnaria: function(tipo, operandoIzq){
        return {
            tipo: tipo,
            operandoIzq: operandoIzq,
            operandoDer: undefined
        }
    },
    nuevoValor: function(tipo, valor){
        return {
            tipo:tipo,
            valor:valor
        }
    },
    nuevoImprimir: function(expresion){
        return{
            tipo: TIPO_INSTRUCCION.IMPRIMIR,
            expresion: expresion
        }
    },
    nuevaDeclaracion: function(tipo, id, expresion){
        return {
            tipo: TIPO_INSTRUCCION.DECLARACION,
            tipo_dato:tipo,
            id:id,
            expresion: expresion
        }
    },
    nuevaAsignacion: function(identificador, expresion){
        return {
            tipo: TIPO_INSTRUCCION.ASIGNACION,
            identificador: identificador,
            expresion: expresion
        }
    },
    nuevoWhile: function(condicion, instrucciones){
        return{
            tipo: TIPO_INSTRUCCION.WHILEE,
            condicion: condicion,
            instrucciones: instrucciones
        }
    },
    nuevoDoWhile: function(condicion, instrucciones){
        return{
            tipo: TIPO_INSTRUCCION.DOWHILEE,
            condicion: condicion,
            instrucciones: instrucciones
        }
    },
    nuevoIf: function(condicion, cuerpoverdadero, cuerpofalso){
        return {
            tipo: TIPO_INSTRUCCION.IFF,
            condicion: condicion,
            cuerpoverdadero: cuerpoverdadero,
            cuerpofalso: cuerpofalso
        }
    },
    nuevoSwitch: function(condicion, casos, definido){
        return {
            tipo: TIPO_INSTRUCCION.SWITCHH,
            condicion: condicion,
            casos: casos,
            definido: definido
        }
    },
    nuevoMetodo: function(identificador, parametros, instrucciones){
        return {
            tipo: TIPO_INSTRUCCION.METODO,
            identificador: identificador,
            parametros: parametros,
            instrucciones: instrucciones
        }
    },
    nuevoMain: function(identificador, parametros){
        return{
            tipo: TIPO_INSTRUCCION.MAIN,
            identificador: identificador,
            parametros: parametros
        }
    }
}

module.exports.TIPO_VALOR=TIPO_VALOR;
module.exports.TIPO_OPERACION=TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION=TIPO_INSTRUCCION;
module.exports.INSTRUCCIONES=INSTRUCCIONES;