var express = require("express");
var bcrypt = require("bcryptjs");
var app = express();

var mdAutenticacion = require("../middelwares/autenticacion");
var Hospital = require("../models/hospital");

//====================================================
// Obtener todos los usuarios
//====================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando hospitales",
          errors: err
        });
      }
      Hospital.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          mensaje: "Exitoso",
          hospitales: hospitales,
          total: conteo
        });
      });
    });
});

//====================================================
// Actualizar usuario
//====================================================

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar hospital",
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id " + " no existe ",
        errors: { message: "No existe un hospital con ese ID" }
      });
    }
    hospital.nombre = body.nombre;
    hospital.usuario = body.usuario;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar hospital",
          errors: err
        });
      }
      res.status(200).json({
        ok: true,
        mensaje: "Exitoso",
        hospital: hospitalGuardado
      });
    });
    /*usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;*/
  });
});

//====================================================
// Crear nuevo hospital
//====================================================
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  var body = req.body;
  var hospital = new Hospital({
    nombre: body.nombre,
    img: body.img,
    usuario: body.usuario
  });
  hospital.save((err, hospitalGuardado) => {
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

      hospital: hospitalGuardado
    });
  });
});

//====================================================
// Borrar usuario por id
//====================================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
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
        errors: { message: "No existe un hospital con ese ID" }
      });
    }
    res.status(201).json({
      ok: true,
      mensaje: "Exitoso",
      hospital: hospitalBorrado
    });
  });
});

module.exports = app;
