const TIPO_VALOR = {
    ENTERO:             'VAL_ENTERO',
    DECIMAL:            'VAL_DECIMAL',
    CADENA:             'VAL_CADENA',
    CARACTER:           'VAL_CARACTER',
    BANDERA:            'VAL_BANDERA',
    INCREMENTO:         'VAL_INCREMENTO',
    DECREMENTO:         'VAL_DECREMENTO',
    IDENTIFICADOR:      'VAL_IDENTIFICADOR',
    VECTORE:            'VAL_VECTORE',
    VECTORD:            'VAL_VECTORD',
    VECTORCAR:          'VAL_VECTORCAR',
    VECTORCAD:          'VAL_VECTORCAD',
    VECTORB:            'VAL_VECTORB',
    LISTAE:             'VAL_LISTAE',
    LISTAD:             'VAL_LISTAD',
    LISTACAR:           'VAL_LISTACAR',
    LISTACAD:           'VAL_LISTACAD',
    LISTAB:             'VAL_LISTAB'
}

const TIPO_OPERACION = {
    SUMA:               'OP_SUMA',
    INCREMENTO:         'OP_INCREMENTO',
    RESTA:              'OP_RESTA',
    DECREMENTO:         'OP_DECREMENTO',
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
    NOT:                'OP_NOT',
    LOWER:              'OP_LOWER',
    UPPER:              'OP_UPPER',
    LENGTH:             'OP_LENGTH',
    TRUNCATE:           'OP_TRUNCATE',
    ROUND:              'OP_ROUND',
    TYPEOF:             'OP_TYPEOF',
    TOSTRING:           'OP_TOSTRING',
    TOCHARARRAY:        'OP_TOCHARARRAY',
    CASTEO:             'OP_CASTEO',
    TERNARIO:           'INSTR_TERNARIO'
}

const TIPO_INSTRUCCION = {
    MAIN:               'INSTR_MAIN',
    METODO:             'INSTR_METODO',
    LLAMADA:            'INSTR_LLAMADA',
    DECLARACION:        'INSTR_DECLARACION',
    ASIGNACION:         'INSTR_ASIGNACION',
    IMPRIMIR:           'INSTR_IMPRIMIR',
    WHILEE:             'INSTR_WHILE',
    DOWHILEE:           'INSTR_DOWHILE',
    FORR:               'INSTR_FOR',
    IFF:                'INSTR_IF',
    SWITCHH:            'INSTR_SWITCH',
    CASEE:              'INSTR_CASE',
    BREAK:              'INSTR_BREAK',
    CONTINUE:           'INSTR_CONTINUE',
    ERRORR:             'INSTR_ERROR'
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
    nuevoMain: function(identificador, parametros){
        return{
            tipo: TIPO_INSTRUCCION.MAIN,
            identificador: identificador,
            parametros: parametros
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
    nuevaLlamada: function(identificador, parametros){
        return{
            tipo: TIPO_INSTRUCCION.LLAMADA,
            identificador: identificador,
            parametros: parametros
        }
    },
    nuevoParametro: function(tipo, identificador){
        return{
            tipo: tipo,
            identificador: identificador
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
    nuevoDoWhile: function(instrucciones, condicion){
        return{
            tipo: TIPO_INSTRUCCION.DOWHILEE,
            condicion: condicion,
            instrucciones: instrucciones
        }
    },
    nuevoFor: function(declaracion, condicion, cambio, cuerpoFor){
        return{
            tipo: TIPO_INSTRUCCION.FORR,
            declaracion: declaracion,
            condicion: condicion,
            cambio: cambio,
            cuerpoFor: cuerpoFor
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
    nuevoSwitch: function(identificador, casos){
        return {
            tipo: TIPO_INSTRUCCION.SWITCHH,
            identificador: identificador,
            casos: casos
        }
    },
    nuevoCase: function(caso, cuerpocaso, masCasos){
        return {
            tipo: TIPO_INSTRUCCION.CASEE,
            caso: caso,
            cuerpocaso: cuerpocaso,
            masCasos: masCasos
        }
    },
    nuevoBreak: function(){
        return{
            tipo: TIPO_INSTRUCCION.BREAK
        }
    },
    nuevoContinue: function(){
        return{
            tipo: TIPO_INSTRUCCION.CONTINUE
        }
    },
    nuevoTernario: function(tipo, condicion, valverdadero, valfalso){
        return{
            tipo: tipo,
            condicion: condicion,
            valverdadero: valverdadero,
            valfalso: valfalso
        }
    }
}

module.exports.TIPO_VALOR=TIPO_VALOR;
module.exports.TIPO_OPERACION=TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION=TIPO_INSTRUCCION;
module.exports.INSTRUCCIONES=INSTRUCCIONES;