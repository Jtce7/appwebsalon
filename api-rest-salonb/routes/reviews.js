const express = require("express");
const router = express.Router();
const ReviewsController = require("../controllers/reviews");

// Definir Rutas
router.get("/prueba-testimonios", ReviewsController.pruebatestimonios);

// Exportar Router
module.exports = router;