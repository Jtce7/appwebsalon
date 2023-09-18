const mongoose = require('mongoose');

// Modelo para los Servicios
const serviceSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
        min: 0,
    },
});