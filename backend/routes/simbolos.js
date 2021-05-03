var express = require('express');
var router = express.Router();
var parser = require('./analizador/gramatica');
var GraficaTS = require('./interprete/interprete').GraficaTS;

router.post('/', function(req, res, next) {
    let salida="";
    try {
        salida = GraficaTS();
        console.log(salida)
        res.statusCode = 200;
        res.json({salida:salida});
    }
    catch(e){
        console.log(e);
        res.statusCode = 200;
        res.json({salida:salida});
    }
});

module.exports = router;