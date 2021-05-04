var express = require('express');
var router = express.Router();
var GraficaTS = require('./interprete/interprete').GraficaTS;

router.get('/', function(req, res, next) {
    let salida="";
    try {
        salida = GraficaTS();
        console.log(salida)
        res.send(salida);
        res.statusCode = 200;
    }
    catch(e){
        console.log(e);
        res.statusCode = 200;
        res.json({salida:salida});
    }
});

module.exports = router;