/* Analizador Lexico */

%lex

%options case-insensitive

%%

\s+                                         //Se ignoran espacios
"//".*                                      //Comentario unilinea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]         //Comentario multilinea


/* Tipos De Datos */
"int"                   return 'entero';
"char"                  return 'caracter';
"double"                return 'decimal';
"string"                return 'cadena';
"boolean"               return 'bandera';
"true"                  return 'truee';
"false"                 return 'falsee';
"void"                  return "vacio";

/* Signos */
";"                     return 'pcoma';
","                     return 'coma';
"{"                     return 'llavea';
"}"                     return 'llavec';
"("                     return 'parentesisa';
")"                     return 'parentesisc';
"?"                     return 'signointerrogacion';
":"                     return 'dospuntos';
"++"                    return 'incremento';
"--"                    return 'decremento';
"-"                     return 'menos';
"+"                     return 'mas';
"*"                     return 'por';
"/"                     return 'dividido';
"^"                     return 'potencia';
"%"                     return 'modulo';
"<="                    return 'menorigual';
">="                    return 'mayorigual';
"=="                    return 'igualigual';
"!="                    return 'noigual';
"<"                     return 'menor';
">"                     return 'mayor';
"="                     return 'igual';
"||"                    return 'or';
"&&"                    return 'and';
"!"                     return 'not';

/* Sentencias de Control */
"if"                    return 'si';
"else"                  return 'sino';
"switch"                return 'switch';
"case"                  return 'case';
"default"               return 'default';

/* Sentencias Ciclicas */
"while"                 return 'mientras';
"do"                    return 'do';
"for"                   return 'for';

/* Sentencias de Transferencias */
"break"                 return 'breakk';
"continue"              return 'continuee';
"return"                return 'return';

/* Funciones */
"print"                 return 'imprimir';
"tolower"               return 'tolower';
"toupper"               return 'toupper';

/* Funciones Nativas */
"lenght"                return 'lenght';
"truncate"              return 'truncate';
"round"                 return 'round';
"typeof"                return 'typeof';
"tostring"              return 'tostring';
"tochararray"           return 'tochararray';

/* Ejecutar Funcion Main */
"exec"                      return 'exec';

/* Tipos Valores */
([0-9])+(["."])([0-9])+     return 'decimall';
[0-9]+                      return 'enteroo';
([a-zA-Z])[a-zA-Z0-9_]*     return 'identificador';
\"[^\"]*\"                  { yytext = yytext.substr(1, yyleng-2); return 'cadenaa'; }
\'[^\']*\'                   { yytext = yytext.substr(1, yyleng-2); return 'caracterr'; }

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

%left  'or'
%left  'and'
%rigth 'not'
%left  'menor' 'menorigual' 'mayor' 'mayorigual' 'igualigual' 'noigual'
%left  'incremento' 'decremento' 'mas' 'menos' 
%left  'por' 'dividido' 'modulo'
%left  'potencia'
%left  UMENOS


%start INICIO

%% /* Gramatica */

INICIO
    : CUERPO EOF { console.log('Funciono'); return $1; };

CUERPO
    : CUERPO MAIN           { $1.push($2); $$=$1; }
    | CUERPO METODO         { $1.push($2); $$=$1; }
    | CUERPO DECLARACION    { $1.push($2); $$=$1; }
    | CUERPO ASIGNACION     { $1.push($2); $$=$1; }
    | MAIN                  { $$=[$1]; }
    | METODO                { $$=[$1]; }
    | DECLARACION           { $$ = [$1]; }
    | ASIGNACION            { $$=[$1]; };

CUERPO2
    : CUERPO2 DECLARACION   { $1.push($2); $$=$1; }
    | CUERPO2 ASIGNACION    { $1.push($2); $$=$1; }
    | CUERPO2 LLAMADA       { $1.push($2); $$=$1; }
    | CUERPO2 IMPRIMIR      { $1.push($2); $$=$1; }
    | CUERPO2 SI            { $1.push($2); $$=$1; }
    | CUERPO2 SWITCHH       { $1.push($2); $$=$1; }
    | CUERPO2 WHILEE        { $1.push($2); $$=$1; }
    | CUERPO2 DOWHILEE      { $1.push($2); $$=$1; }
    | CUERPO2 FOR           { $1.push($2); $$=$1; }
    | CUERPO2 BREAKK        { $1.push($2); $$=$1; }
    | CUERPO2 CONTINUEE     { $1.push($2); $$=$1; }
    | IMPRIMIR              { $$ = [$1]; }
    | DECLARACION           { $$ = [$1]; }
    | ASIGNACION            { $$ = [$1]; }
    | LLAMADA               { $$ = [$1]; }
    | SI                    { $$ = [$1]; }
    | SWITCHH               { $$ = [$1]; }
    | WHILEE                { $$ = [$1]; }
    | DOWHILEE              { $$ = [$1]; }
    | FOR                   { $$ = [$1]; }
    | BREAKK                { $$ = [$1]; }
    | CONTINUEE             { $$ = [$1]; };

MAIN
    : exec identificador parentesisa parentesisc pcoma                              {$$=INSTRUCCIONES.nuevoMain($2, []);}
    | exec identificador parentesisa VALORESLLAMADA parentesisc pcoma               {$$=INSTRUCCIONES.nuevoMain($2, $4);};

METODO
    : vacio identificador parentesisa parentesisc llavea CUERPO2 llavec             { $$ = INSTRUCCIONES.nuevoMetodo($2, [], $6) }
    | vacio identificador parentesisa PARAMETROS parentesisc llavea CUERPO2 llavec  { $$ = INSTRUCCIONES.nuevoMetodo($2, $4, $7) };

PARAMETROS
    : PARAMETROS coma TIPO identificador                                            { $1.push(INSTRUCCIONES.nuevoParametro($3,$4)); $$=$1;}
    | TIPO identificador                                                            { $$=[INSTRUCCIONES.nuevoParametro($1, $2)]; };

LLAMADA
    : identificador parentesisa VALORESLLAMADA parentesisc pcoma                    {$$=INSTRUCCIONES.nuevaLlamada($1, $3);}
    | identificador parentesisa parentesisc pcoma                                   {$$=INSTRUCCIONES.nuevaLlamada($1, []);};

VALORESLLAMADA
    : VALORESLLAMADA coma EXP                                                       {$1.push($3); $$=$1;}
    | VALORESLLAMADA coma CASTEO                                                    {$1.push($3); $$=$1;}
    | VALORESLLAMADA coma TERNARIO                                                  {$1.push($3); $$=$1;}
    | EXP                                                                           {$$=[$1];}
    | CASTEO                                                                        {$$=[$1];}
    | TERNARIO                                                                      {$$=[$1];};

DECLARACION
    : TIPO identificador igual EXP pcoma                                            { $$=INSTRUCCIONES.nuevaDeclaracion($1, $2, $4); }
    | TIPO identificador pcoma                                                      { $$=INSTRUCCIONES.nuevaDeclaracion($1, $2, undefined); }
    | TIPO identificador igual CASTEO pcoma                                         { $$=INSTRUCCIONES.nuevaDeclaracion($1, $2, $4); }
    | TIPO identificador igual TERNARIO pcoma                                       { $$=INSTRUCCIONES.nuevaDeclaracion($1, $2, $4); };

ASIGNACION
    : identificador igual EXP pcoma                                                 { $$ = INSTRUCCIONES.nuevaAsignacion($1, $3); } 
    | identificador igual CASTEO pcoma                                              { $$ = INSTRUCCIONES.nuevaAsignacion($1, $3); }
    | identificador igual TERNARIO pcoma                                            { $$ = INSTRUCCIONES.nuevaAsignacion($1, $3); }
    | identificador incremento pcoma                                                { $$ = INSTRUCCIONES.nuevaAsignacion($1, TIPO_VALOR.INCREMENTO); }
    | identificador decremento pcoma                                                { $$ = INSTRUCCIONES.nuevaAsignacion($1, TIPO_VALOR.DECREMENTO); };


IMPRIMIR
    : imprimir parentesisa EXP parentesisc pcoma                                    { $$=INSTRUCCIONES.nuevoImprimir($3); }
    | imprimir parentesisa parentesisc pcoma                                        { $$=INSTRUCCIONES.nuevoImprimir("\n"); }
    | imprimir parentesisa CASTEO parentesisc pcoma                                 { $$=INSTRUCCIONES.nuevoImprimir($3); }
    | imprimir parentesisa TERNARIO parentesisc pcoma                               { $$=INSTRUCCIONES.nuevoImprimir($3); };

SI
    :si parentesisa EXP parentesisc llavea CUERPO2 llavec sino llavea CUERPO2 llavec        { $$=INSTRUCCIONES.nuevoIf($3, $6, $10); }
    |si parentesisa EXP parentesisc llavea CUERPO2 llavec                                   { $$=INSTRUCCIONES.nuevoIf($3, $6, undefined); }
    |si parentesisa EXP parentesisc llavea CUERPO2 llavec sino SI                           { $$=INSTRUCCIONES.nuevoIf($3, $6, [$9]); }
    |si parentesisa CASTEO parentesisc llavea CUERPO2 llavec sino llavea CUERPO2 llavec     { $$=INSTRUCCIONES.nuevoIf($3, $6, $10); }
    |si parentesisa CASTEO parentesisc llavea CUERPO2 llavec                                { $$=INSTRUCCIONES.nuevoIf($3, $6, undefined); }
    |si parentesisa CASTEO parentesisc llavea CUERPO2 llavec sino SI                        { $$=INSTRUCCIONES.nuevoIf($3, $6, [$9]); }
    |si parentesisa TERNARIO parentesisc llavea CUERPO2 llavec sino llavea CUERPO2 llavec   { $$=INSTRUCCIONES.nuevoIf($3, $6, $10); }
    |si parentesisa TERNARIO parentesisc llavea CUERPO2 llavec                              { $$=INSTRUCCIONES.nuevoIf($3, $6, undefined); }
    |si parentesisa TERNARIO parentesisc llavea CUERPO2 llavec sino SI                      { $$=INSTRUCCIONES.nuevoIf($3, $6, [$9]); };

SWITCHH
    :switch parentesisa EXP parentesisc llavea CASES llavec                         { $$=INSTRUCCIONES.nuevoSwitch($3, $6); }
    |switch parentesisa CASTEO parentesisc llavea CASES llavec                      { $$=INSTRUCCIONES.nuevoSwitch($3, $6); }
    |switch parentesisa TERNARIO parentesisc llavea CASES llavec                    { $$=INSTRUCCIONES.nuevoSwitch($3, $6); };

CASES
    : case EXP dospuntos CUERPO2 CASES                                              { $$=INSTRUCCIONES.nuevoCase($2, $4, [$5]); }
    | case EXP dospuntos CUERPO2                                                    { $$=INSTRUCCIONES.nuevoCase($2, $4, undefined); }
    | case CASTEO dospuntos CUERPO2 CASES                                           { $$=INSTRUCCIONES.nuevoCase($2, $4, [$5]); }
    | case CASTEO dospuntos CUERPO2                                                 { $$=INSTRUCCIONES.nuevoCase($2, $4, undefined); }
    | case TERNARIO dospuntos CUERPO2 CASES                                         { $$=INSTRUCCIONES.nuevoCase($2, $4, [$5]); }
    | case TERNARIO dospuntos CUERPO2                                               { $$=INSTRUCCIONES.nuevoCase($2, $4, undefined); }
    | default dospuntos CUERPO2                                                     { $$=INSTRUCCIONES.nuevoCase("defaultSwitch", $3, undefined); };

WHILEE
    : mientras parentesisa EXP parentesisc llavea CUERPO2 llavec                    { $$=INSTRUCCIONES.nuevoWhile($3, $6); }
    | mientras parentesisa CASTEO parentesisc llavea CUERPO2 llavec                 { $$=INSTRUCCIONES.nuevoWhile($3, $6); }
    | mientras parentesisa TERNARIO parentesisc llavea CUERPO2 llavec               { $$=INSTRUCCIONES.nuevoWhile($3, $6); };

DOWHILEE
    : do llavea CUERPO2 llavec mientras parentesisa EXP parentesisc pcoma           { $$=INSTRUCCIONES.nuevoDoWhile($3, $7); }
    | do llavea CUERPO2 llavec mientras parentesisa CASTEO parentesisc pcoma        { $$=INSTRUCCIONES.nuevoDoWhile($3, $7); }
    | do llavea CUERPO2 llavec mientras parentesisa TERNARIO parentesisc pcoma      { $$=INSTRUCCIONES.nuevoDoWhile($3, $7); };

FOR
    : for parentesisa DECLARACION EXP pcoma EXP parentesisc llavea CUERPO2 llavec     { $$=INSTRUCCIONES.nuevoFor($3, $4,$6,$9); }
    | for parentesisa ASIGNACION EXP pcoma EXP parentesisc llavea CUERPO2 llavec     { $$=INSTRUCCIONES.nuevoFor($3, $4,$6,$9); };

BREAKK
    : breakk pcoma { $$ = INSTRUCCIONES.nuevoBreak(); };

CONTINUEE
    : continuee pcoma { $$ = INSTRUCCIONES.nuevoContinue(); };

CASTEO
    : parentesisa TIPO parentesisc EXP { $$=INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.CASTEO, INSTRUCCIONES.nuevoValor($2,0), $4); };

TERNARIO
    : EXP signointerrogacion EXP dospuntos EXP          { $$ = INSTRUCCIONES.nuevoTernario(TIPO_OPERACION.TERNARIO, $1, $3, $5); }
    | EXP signointerrogacion CASTEO dospuntos CASTEO    { $$ = INSTRUCCIONES.nuevoTernario(TIPO_OPERACION.TERNARIO, $1, $3, $5); }
    | EXP signointerrogacion EXP dospuntos CASTEO       { $$ = INSTRUCCIONES.nuevoTernario(TIPO_OPERACION.TERNARIO, $1, $3, $5); }
    | EXP signointerrogacion CASTEO dospuntos EXP       { $$ = INSTRUCCIONES.nuevoTernario(TIPO_OPERACION.TERNARIO, $1, $3, $5); };

TIPO
    : entero                                            { $$ = TIPO_DATO.ENTERO; }
    | decimal                                           { $$ = TIPO_DATO.DECIMAL; }
    | caracter                                          { $$ = TIPO_DATO.CARACTER; }
    | cadena                                            { $$ = TIPO_DATO.CADENA; }
    | bandera                                           { $$ = TIPO_DATO.BANDERA; };

EXP
    : EXP mas EXP                                       { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.SUMA, $1, $3); }
    | EXP menos EXP                                     { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.RESTA, $1, $3); }
    | identificador incremento                          { $$ = INSTRUCCIONES.nuevaAsignacion($1, TIPO_VALOR.INCREMENTO); }
    | identificador decremento                          { $$ = INSTRUCCIONES.nuevaAsignacion($1, TIPO_VALOR.DECREMENTO); }
    | EXP por EXP                                       { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MULTIPLICACION, $1, $3); }
    | EXP dividido EXP                                  { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.DIVISION, $1, $3); }
    | EXP potencia EXP                                  { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.POTENCIA, $1, $3); }
    | EXP modulo EXP                                    { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MODULO, $1, $3); }
    | menos EXP %prec UMENOS                            { $$ = INSTRUCCIONES.nuevaOperacionUnaria(TIPO_OPERACION.NEGATIVO, $2); }
    | EXP menor EXP                                     { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MENOR, $1, $3); }
    | EXP mayor EXP                                     { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MAYOR, $1, $3); }
    | EXP menorigual EXP                                { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MENORIGUAL, $1, $3); }
    | EXP mayorigual EXP                                { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MAYORIGUAL, $1, $3); }
    | EXP igualigual EXP                                { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.IGUALIGUAL, $1, $3); }
    | EXP noigual EXP                                   { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.NOIGUAL, $1, $3); }
    | EXP or EXP                                        { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.OR, $1, $3); }
    | EXP and EXP                                       { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.AND, $1, $3); }
    | not EXP %prec UMENOS                              { $$ = INSTRUCCIONES.nuevaOperacionUnaria(TIPO_OPERACION.NOT, $2); }
    | parentesisa EXP parentesisc                       { $$ = $2 }
    | enteroo                                           { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.ENTERO, Number($1)); }
    | decimall                                          { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.DECIMAL, Number($1)); }
    | caracterr                                         { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.CARACTER, $1); }
    | cadenaa                                           { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.CADENA, $1); }
    | truee                                             { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.BANDERA, true); }
    | falsee                                            { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.BANDERA, false); }
    | identificador                                     { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.IDENTIFICADOR, $1); };