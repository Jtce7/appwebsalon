const mongoose = require('mongoose');

const weeklyScheduleSchema = new mongoose.Schema({
    diaSemana: {
        type: String,
        required: true,
        enum: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    horaApertura: {
        type: String, // Puedes ajustar el formato de hora según tus necesidades
        required: true,
    },
    horaCierre: {
        type: String, // Puedes ajustar el formato de hora según tus necesidades
        required: true,
    },
});