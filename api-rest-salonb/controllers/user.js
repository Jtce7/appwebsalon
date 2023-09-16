const User = require("../models/user");


const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde : /controllers/user"
    });
}

// Metodo de Registro de Usuarios
const register = (req, res) => {

    //Recoger Datos de la Peticion
    let params = req.body;
    

    //Comprobar que me llegan bien (+validacion)

    //Control de Usuarios Duplicados

    //Cifrar la contraseña

    //Guardar Usuario en la BBDD

    //Devolver Resultado
    return res.status(200).json({
        message: "Metodo o Acción de Registro de Usuarios",
        params
    });
}


// Exportar Acciones
module.exports = {
    pruebaUser,
    register
   
}
