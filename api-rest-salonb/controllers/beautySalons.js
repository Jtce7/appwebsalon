
const mongoose = require('mongoose');
const jwt = require("../services/jwt"); // Importar el servicio JWT para autenticación
const BeautySalon = require('../models/beautySalon'); // Importar el modelo BeautySalon

// Controladores para Salones de Belleza
const createBeautySalon = async (req, res) => {
    try {
        // Verificar autenticación (JWT)
        if (!req.user) {
            return res.status(401).json({ error: "Acceso no autorizado. Debes iniciar sesión." });
        }

        // Verificar rol de usuario (role_admin)
        if (req.user.role !== "role_admin") {
            return res.status(403).json({ error: "No tienes permiso para crear salones de belleza." });
        }

        const salonData = req.body;
        const newSalon = new BeautySalon(salonData);
        await newSalon.save();

        res.status(201).json(newSalon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addDetailsToSalon = async (req, res) => {
    try {
        const salonId = req.params.id; // Obtén el ID de la sucursal a la que se agregarán los detalles
        const salonData = req.body; // Datos adicionales a agregar

        // Verificar si el usuario es propietario de la sucursal (puedes agregar esta lógica según tus necesidades)
        if (req.user.role !== "role_admin") {
            return res.status(403).json({ error: "No tienes permiso para agregar detalles a esta sucursal." });
        }

        // Encuentra la sucursal por su ID
        const salon = await BeautySalon.findById(salonId);

        if (!salon) {
            return res.status(404).json({ error: "La sucursal no existe." });
        }

        // Agrega los detalles al objeto de la sucursal
        salon.nuevosDetalles = salonData.nuevosDetalles; // Por ejemplo, supongamos que quieres agregar nuevosDetalles

        // Guarda la sucursal actualizada
        const updatedSalon = await salon.save();

        res.status(200).json({ message: "Detalles agregados con éxito", salon: updatedSalon });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getAllSalons = async (req, res) => {
    try {
        // Verificar si se ha proporcionado un token válido en la cabecera de autorización
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Acceso no autorizado, token no proporcionado."
            });
        }

        // Decodificar el token y obtener el ID del usuario
        const userId = jwt.decodeToken(token);

        if (!userId) {
            return res.status(401).json({
                message: "Acceso no autorizado, token inválido o caducado."
            });
        }

        // Consultar la base de datos para verificar el rol del usuario
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({
                message: "Acceso no autorizado, usuario no encontrado."
            });
        }

        // Verificar el rol del usuario (por ejemplo, si es un administrador)
        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Acceso no autorizado, permisos insuficientes."
            });
        }

        // Si el usuario es un administrador, puede acceder a la lista de salones
        const salons = await BeautySalon.find();
        return res.status(200).json({
            message: "Búsqueda exitosa",
            salons
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getSalonById = async (req, res) => {
    try {
        const { id } = req.params;
        const salon = await BeautySalon.findById(id);
        if (!salon) {
            return res.status(404).json({ message: 'Salón de belleza no encontrado' });
        }
        res.status(200).json(salon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSalon = async (req, res) => {
    try {
        const { id } = req.params;
        const salonData = req.body;
        const updatedSalon = await BeautySalon.findByIdAndUpdate(id, salonData, { new: true });
        if (!updatedSalon) {
            return res.status(404).json({ message: 'Salón de belleza no encontrado' });
        }
        res.status(200).json(updatedSalon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSalon = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSalon = await BeautySalon.findByIdAndDelete(id);
        if (!deletedSalon) {
            return res.status(404).json({ message: 'Salón de belleza no encontrado' });
        }
        res.status(200).json({ message: 'Salón de belleza eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBeautySalon,
    getAllSalons,
    getSalonById,
    updateSalon,
    deleteSalon,
    addDetailsToSalon
};
