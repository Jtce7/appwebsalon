const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    // Nombre del servicio
    nombre: {
        type: String,
        required: true,
    },
    
    // Precio del servicio
    precio: {
        type: Number,
        required: true,
        min: 0,
    },
});

const weeklyScheduleSchema = new mongoose.Schema({
    // Día de la semana
    diaSemana: {
        type: String,
        required: true,
        enum: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    
    // Hora de apertura
    horaApertura: {
        type: String, // Puedes ajustar el formato de hora según tus necesidades
        required: true,
    },
    
    // Hora de cierre
    horaCierre: {
        type: String, // Puedes ajustar el formato de hora según tus necesidades
        required: true,
    },
});

const beautySalonSchema = new mongoose.Schema({
    // Nombre del salón de belleza
    nombre: {
        type: String,
        required: true,
    },
    
    // Dirección del salón de belleza
    direccion: {
        type: String,
        required: true,
    },
    
    // Ubicación geográfica (por ejemplo, coordenadas)
    ubicacion: {
        type: String,
        required: true,
    },
    
    // Referencia al propietario (usuario registrado)
    propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Nombre del modelo de usuario registrado
    },
    
    // Servicios ofrecidos
    servicios: [serviceSchema],

    // Horario semanal de atención
    horarioSemanal: [weeklyScheduleSchema],
    
    // Capacidad de citas
    capacidadCitas: {
        type: Number,
        required: true,
        min: 0,
    },
    
    // Otros campos y detalles según tus necesidades
});

const BeautySalon = mongoose.model('BeautySalon', beautySalonSchema);

module.exports = BeautySalon;
