const bcrypt = require("bcrypt")
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
    if (!params.name || !params.email || !params.password || !params.nick || !params.phone) {
        return res.status(400).json({
            status: "error",
            message: "Metodo o Acción de Registro de Usuarios",
        });

    }

    //Control de Usuarios Duplicados
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { phone: params.phone.toLowerCase() },
            { nick: params.nick.toLowerCase() }

        ]
    }).exec(async (error, users) => {

        if (error) return res.status(500).json({ status: "error", message: "Error en la consulta de usuarios" })

        if (users && users.length >= 1) {
            return res.status(200).json({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        //Cifrar la contraseña
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        //Crear Objeto de Usuario
        let user_to_save = new User(params);

        //Guardar Usuario en la BBDD
        user_to_save.save((error, userStored) => {
            if (error || userStored) return res.status(500).send({ status: "error", "message": "Error al guardar el usuario" })

            //Devolver Resultado
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado correctamente",
                user: userStored
            });

        });

    });

}


// Exportar Acciones
module.exports = {
    pruebaUser,
    register,


}
