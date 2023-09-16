const express = require("express");
const router = express.Router();
const AppointmentsController = require("../controllers/appointments");

// Definir Rutas
router.get("/prueba-citas", AppointmentsController.PruebaCitas);

// Exportar Router
module.exports = router;