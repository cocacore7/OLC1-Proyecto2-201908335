const TIPO_VALOR = {
    DECIMAL:            'VAL_DECIMAL',
    CADENA:             'VAL_CADENA',
    BANDERA:            'VAL_BANDERA',
    IDENTIFICADOR:      'VAL_IDENTIFICADOR'
}

const TIPO_OPERACION = {
    SUMA:               'OP_SUMA',
    RESTA:              'OP_RESTA',
    MULTIPLICACION:     'OP_MULTIPLICACION',
    DIVISION:           'OP_DIVISION',
    NEGATIVO:           'OP_NEGATIVO',
    MENOR:              'OP_MENOR',
    MAYOR:              'OP_MAYOR',
    MENORIGUAL:         'OP_MENORIGUAL',
    MAYORIGUAL:         'OP_MAYORIGUAL',
    IGUALIGUAL:         'OP_IGUALIGUAL',
    NOIGUAL:            'OP_NOIGUAL'
}

const TIPO_INSTRUCCION = {
    IMPRIMIR:           'INSTR_IMPRIMIR',
    DECLARACION:        'INSTR_DECLARACION',
    WHILEE:             'INSTR_WHILE',
    IFF:                'INSTR_IF',
    ASIGNACION:         'INSTR_ASIGNACION',
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
    nuevaDeclaracion: function(tipo, id, expresion){
        return {
            tipo: TIPO_INSTRUCCION.DECLARACION,
            tipo_dato:tipo,
            id:id,
            expresion: expresion
        }
    },
    nuevoImprimir: function(expresion){
        return{
            tipo: TIPO_INSTRUCCION.IMPRIMIR,
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
    nuevoIf: function(condicion, cuerpoverdadero, cuerpofalso){
        return {
            tipo: TIPO_INSTRUCCION.IFF,
            condicion: condicion,
            cuerpoverdadero: cuerpoverdadero,
            cuerpofalso: cuerpofalso
        }
    },
    nuevaAsignacion: function(identificador, expresion){
        return {
            tipo: TIPO_INSTRUCCION.ASIGNACION,
            identificador: identificador,
            expresion: expresion
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