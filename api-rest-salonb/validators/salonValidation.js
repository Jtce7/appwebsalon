const { body } = require('express-validator');

const createSalonValidationRules = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
    body('horarioApertura').isISO8601().withMessage('El horario de apertura debe ser una fecha y hora válida.'),
    body('categoria').isIn(['cabello', 'uñas', 'maquillaje']).withMessage('La categoría de servicio no es válida.'),
    body('imagen').isURL().withMessage('La imagen debe ser una URL válida.'),
    body('telefono').isMobilePhone().withMessage('El número de teléfono no es válido.'),
    body('correoElectronico').isEmail().withMessage('El correo electrónico no es válido.'),
    body('precio').isNumeric().withMessage('El precio debe ser un número válido.'),
    body('precio').isFloat({ min: 0 }).withMessage('El precio no puede ser negativo.'),
    // Agrega más reglas de validación según tus necesidades
];

module.exports = {
    createSalonValidationRules,
};
