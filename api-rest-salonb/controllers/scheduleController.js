const BeautySalon = require('../models/beautySalon'); // Importar el modelo BeautySalon

// Controlador para agregar un horario a un salón
const addScheduleToSalon = async (req, res) => {
    try {
        const salonId = req.params.id; // Obtén el ID del salón al que se agregará el horario
        const { diaSemana, horaApertura, horaCierre } = req.body; // Datos del horario a agregar

        // Verificar autenticación (JWT)
        if (!req.user) {
            return res.status(401).json({ error: "Acceso no autorizado. Debes iniciar sesión." });
        }

        // Buscar el salón por su ID
        const salon = await BeautySalon.findById(salonId);

        if (!salon) {
            return res.status(404).json({ error: "El salón no existe." });
        }

        // Verificar si el usuario tiene permiso para modificar este salón (puedes agregar lógica adicional según tus necesidades)
        if (salon.propietario.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "No tienes permiso para modificar este salón." });
        }

        // Crear el objeto del horario
        const nuevoHorario = {
            diaSemana,
            horaApertura,
            horaCierre,
        };

        // Agregar el horario al salón
        salon.horarioSemanal.push(nuevoHorario);

        // Guardar el salón actualizado
        await salon.save();

        res.status(201).json({ message: "Horario agregado con éxito", salon });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addScheduleToSalon,
};
