const express = require("express");
const router = express.Router();
const servicesController = require("../controllers/servicesController");
const check = require("../middlewares/auth");

// Rutas para agregar servicios a un salón
router.post("/salons/:id/services", check.auth, servicesController.addServiceToSalon);

module.exports = router;
