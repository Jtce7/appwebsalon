const express = require('express');
const router = express.Router();
const beautySalonController = require('../controllers/beautySalons'); // Cambia 'beautySalon' a 'beautySalon'
const check = require("../middlewares/auth");

// Ruta para crear un nuevo salón de belleza
router.post('/salons', check.auth, beautySalonController.createBeautySalon);
// Ruta para agregar los otros campos del salón
router.put('/salons/:id/add-details', check.auth, beautySalonController.addDetailsToSalon);


// Otras rutas para salones de belleza...

module.exports = router;


// Otras rutas para salones de belleza...
router.get('/salons', beautySalonController.getAllSalons);
router.get('/salons/:id', beautySalonController.getSalonById);
router.put('/salons/:id', beautySalonController.updateSalon);
router.delete('/salons/:id', beautySalonController.deleteSalon);

module.exports = router;
