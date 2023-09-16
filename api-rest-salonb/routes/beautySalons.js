const express = require("express");
const router = express.Router();
const BeautySalonsController = require("../controllers/beautySalons");

// Definir Rutas
router.get("/prueba-sucursales", BeautySalonsController.pruebaSucursal);

// Exportar Router
module.exports = router;