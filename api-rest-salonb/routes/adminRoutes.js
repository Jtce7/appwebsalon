const express = require('express');
const router = express.Router();
const check = require("../middlewares/auth");
const adminController = require('../controllers/adminController');

// Ruta para eliminar un usuario
router.delete('/users/:id', check.auth, adminController.deleteUser);

// Ruta para eliminar un salón de belleza
router.delete('/salons/:id', check.auth, adminController.deleteSalon);

module.exports = router;