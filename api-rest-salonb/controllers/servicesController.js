const BeautySalon = require('../models/beautySalon'); // Importar el modelo BeautySalon

// Controlador para agregar un servicio a un salón
const addServiceToSalon = async (req, res) => {
    try {
        const salonId = req.params.id; // Obtén el ID del salón al que se agregará el servicio
        const { nombre, precio } = req.body; // Datos del servicio a agregar

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

        // Crear el objeto del servicio
        const nuevoServicio = {
            nombre,
            precio,
        };

        // Agregar el servicio al salón
        salon.servicios.push(nuevoServicio);

        // Guardar el salón actualizado
        await salon.save();

        res.status(201).json({ message: "Servicio agregado con éxito", salon });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addServiceToSalon,
};
