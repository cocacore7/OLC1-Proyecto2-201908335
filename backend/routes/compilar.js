var express = require('express');
var router = express.Router();
var parser = require('./analizador/gramatica');
var interprete = require('./interprete/interprete').ejecutar;

router.post('/', function(req, res, next) {
    let salida="";
    try {
        console.log(req.files.archivo.data.toString('utf-8'));
        let arbol = parser.parse(req.files.archivo.data.toString('utf-8'));
        salida = interprete(arbol);
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