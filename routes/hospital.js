var express = require("express");
var bcrypt = require('bcryptjs');
var app = express();

var mdAutenticacion = require('../middelwares/autenticacion');
var Hospital = require("../models/hospital");

//====================================================
// Obtener todos los usuarios
//====================================================
app.get('/', (req, res, next) =>{
Hospital.find({}, 'nombre img usuario')
.exec(
    (err, hospitales) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando hospitales",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "Exitoso",
            hospitales:hospitales
        });
    }
)
});

//====================================================
// Crear nuevo hospital
//====================================================
app.post('/', (req, res) =>{
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });
    hospital.save((err, hospitalGuardado) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear hospital",
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: "Exitoso",
            //usuarioToken:req.usuario
         
            hospital:hospitalGuardado
        });

    });
});

//====================================================
// Borrar usuario por id
//====================================================

app.delete('/:id',  (req, res) =>{
var id = req.params.id;

Hospital.findByIdAndRemove(id,(err, hospitalBorrado) =>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: "Error al borrar hospital",
            errors: err
        });
    }   
    if (!hospitalBorrado) {
        return res.status(400).json({
            ok: false,
            mensaje: "No existe un hospital con ese ID",
            errors: {message: 'No existe un hospital con ese ID'}
        });
    }
    res.status(201).json({
        ok: true,
        mensaje: "Exitoso",
        hospital:hospitalBorrado
    });
});
});

module.exports = app;