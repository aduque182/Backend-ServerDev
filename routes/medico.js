var express = require("express");
var app = express();
var mdAutenticacion = require("../middelwares/autenticacion");
var Medico = require("../models/medico");

//====================================================
// Obtener todos los medicos
//====================================================

app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("hospital", "nombre")
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando lista de medicos",
          errors: err
        });
      }
      Medico.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          mensaje: "Exitoso",
          medicos: medicos,
          Total: conteo
        });
      });
    });
});

//====================================================
// Actualizar medico
//====================================================

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar medico",
        errors: err
      });
    }
    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un medico con ese ID",
        errors: { message: "No existe un medico con ese ID" }
      });
    }
    medico.nombre = body.nombre;
    medico.usuario = body.usuario;
    medico.hospital = body.hospital;

    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar medico",
          errors: err
        });
      }
      res.status(200).json({
        ok: true,
        mensaje: "Exitoso",
        medico: medicoGuardado
      });
    });
  });
});
//====================================================
// Crear medico
//====================================================

app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  var body = req.body;
  var medico = new Medico({
    nombre: body.nombre,
    usuario: body.usuario,
    hospital: body.hospital
  });

  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear medico",
        errors: err
      });
    }
    res.status(201).json({
      ok: true,
      mensaje: "Exitoso",
      medico: medicoGuardado
    });
  });
});

//====================================================
// Borrar medico por id
//====================================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar medico",
        errors: err
      });
    }
    if (!medicoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un medico con ese ID",
        errors: { message: "No existe un medico con ese ID" }
      });
    }
    res.status(201).json({
      ok: true,
      mensaje: "Exitoso",
      medico: medicoBorrado
    });
  });
});

module.exports = app;
