const express = require("express");
const router = express.Router();
const ServicesController = require("../controllers/services");

// Definir Rutas
router.get("/prueba-servicios", ServicesController.pruebaServicios);

// Exportar Router
module.exports = router;