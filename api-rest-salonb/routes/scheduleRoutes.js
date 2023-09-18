const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const check = require("../middlewares/auth");

// Rutas para agregar horarios a un salón
router.post("/salons/:id/schedule", check.auth, scheduleController.addScheduleToSalon);

module.exports = router;
