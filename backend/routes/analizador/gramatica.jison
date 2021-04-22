/* Analizador Lexico */

%lex

%options case-insensitive

%%

\s+                                         //Se ignoran espacios
"//".*                                      //Comentario unilinea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]         //Comentario multilinea

"decimal"               return 'decimal';
"cadena"                return 'cadena';
"bandera"               return 'bandera';
";"                     return 'pcoma';
"-"                     return 'menos';
"+"                     return 'mas';
"*"                     return 'por';
"/"                     return 'dividido';
"<="                    return 'menorigual';
">="                    return 'mayorigual';
"=="                    return 'igualigual';
"!="                    return 'noigual';
"<"                     return 'menor';
">"                     return 'mayor';
"="                     return 'igual';
"true"                  return 'truee';
"false"                 return 'falsee';
"cout"                  return 'imprimir';
"mientras"              return 'mientras';
"{"                     return 'llavea';
"}"                     return 'llavec';
"("                     return 'parentesisa';
")"                     return 'parentesisc';
"?"                     return 'signointerrogacion';
":"                     return 'dospuntos';
"si"                    return 'si';
"sino"                  return 'sino';
"exec"                  return 'exec';

\"[^\"]*\"                  { yytext = yytext.substr(1, yyleng-2); return 'cadenaa'; }
[0-9]+("."[0-9]+)?\b        return 'decimall';
([a-zA-Z])[a-zA-Z0-9_]*     return 'identificador';

<<EOF>>                 return 'EOF';

.           {console.log('Error Lexico: '+yytext+' en la linea' + yylloc.first_line + ' en la columna '+yylloc.first_column); }

/lex

%{
    const TIPO_OPERACION = require('../arbol/instrucciones').TIPO_OPERACION;
    const TIPO_VALOR = require('../arbol/instrucciones').TIPO_VALOR;
    const INSTRUCCIONES = require('../arbol/instrucciones').INSTRUCCIONES;
    const TIPO_DATO = require('../arbol/tablasimbolos').TIPO_DATO;
%}

// Precedencia de operadores
%left 'menor' 'menorigual' 'mayor' 'mayorigual' 'igualigual' 'noigual'
%left 'mas' 'menos'
%left 'por' 'dividido'
%left UMENOS


%start INICIO

%% /* Gramatica */

INICIO
    : CUERPO EOF { console.log('Funciono'); return $1; };

CUERPO
    : CUERPO DECLARACION { $1.push($2); $$=$1; }
    | CUERPO ASIGNACION { $1.push($2); $$=$1; }
    | CUERPO METODO { $1.push($2); $$=$1; }
    | CUERPO MAIN { $1.push($2); $$=$1; }
    | DECLARACION { $$ = [$1]; }
    | ASIGNACION { $$=[$1]; }
    | METODO { $$=[$1]; }
    | MAIN { $$=[$1]; };

CUERPO2
    : CUERPO2 DECLARACION { $1.push($2); $$=$1; }
    | CUERPO2 IMPRIMIR { $1.push($2); $$=$1; }
    | CUERPO2 WHILEE { $1.push($2); $$=$1; }
    | CUERPO2 SI { $1.push($2); $$=$1; }
    | CUERPO2 ASIGNACION { $1.push($2); $$=$1; }
    | DECLARACION { $$ = [$1]; }
    | IMPRIMIR { $$ = [$1]; }
    | SI { $$=[$1]; }
    | WHILEE { $$=[$1]; }
    | ASIGNACION { $$=[$1]; };

MAIN
    :exec identificador parentesisa parentesisc pcoma {$$=INSTRUCCIONES.nuevoMain($2, []);};

METODO
    : identificador igual mayor parentesisa parentesisc llavea CUERPO2 llavec {$$=INSTRUCCIONES.nuevoMetodo($1, [], $7)};

ASIGNACION
    : identificador menor menos EXP pcoma { $$ = INSTRUCCIONES.nuevaAsignacion($1, $4); } ;

DECLARACION
    : TIPO identificador menor menos EXP pcoma { $$=INSTRUCCIONES.nuevaDeclaracion($1, $2, $5); }
    | TIPO identificador pcoma { $$=INSTRUCCIONES.nuevaDeclaracion($1, $2, undefined); };

IMPRIMIR
    : imprimir menor menor EXP pcoma { $$=INSTRUCCIONES.nuevoImprimir($4); };

WHILEE
    : mientras parentesisa EXP parentesisc llavea CUERPO2 llavec{ $$=INSTRUCCIONES.nuevoWhile($3, $6); };

SI
    :si parentesisa EXP parentesisc llavea CUERPO2 llavec sino llavea CUERPO2 llavec { $$=INSTRUCCIONES.nuevoIf($3, $6, $10); }
    |si parentesisa EXP parentesisc llavea CUERPO2 llavec { $$=INSTRUCCIONES.nuevoIf($3, $6, undefined); };

TIPO
    : decimal                           { $$ = TIPO_DATO.DECIMAL; }
    | cadena                            { $$ = TIPO_DATO.CADENA; }
    | bandera                           { $$ = TIPO_DATO.BANDERA; };

EXP
    : EXP mas EXP                       { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.SUMA, $1, $3); }
    | EXP menos EXP                     { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.RESTA, $1, $3); }
    | EXP por EXP                       { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MULTIPLICACION, $1, $3); }
    | EXP dividido EXP                  { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.DIVISION, $1, $3); }
    | EXP menor EXP                     { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MENOR, $1, $3); }
    | EXP mayor EXP                     { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MAYOR, $1, $3); }
    | EXP menorigual EXP                { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MENORIGUAL, $1, $3); }
    | EXP mayorigual EXP                { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MAYORIGUAL, $1, $3); }
    | EXP igualigual EXP                { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.IGUALIGUAL, $1, $3); }
    | EXP noigual EXP                   { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.NOIGUAL, $1, $3); }
    | menos EXP %prec UMENOS            { $$ = INSTRUCCIONES.nuevaOperacionUnaria(TIPO_OPERACION.NEGATIVO, $2); }
    | parentesisa EXP parentesisc       { $$ = $2 }
    | decimall                          { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.DECIMAL, Number($1)); }
    | cadenaa                           { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.CADENA, $1); }
    | truee                             { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.BANDERA, true); }
    | falsee                            { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.BANDERA, false); }
    | identificador                     { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.IDENTIFICADOR, $1); };