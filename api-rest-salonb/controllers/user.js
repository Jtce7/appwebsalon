//Importar Dependencias y Modulos
const bcrypt = require("bcrypt");
const mongoosePaginate = require('mongoose-paginate-v2'); // Importa mongoose-paginate-v2

//Importar Modelos
const User = require("../models/user");

//Importar Servicios
const jwt = require("../services/jwt")

//Acciones de Prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde : /controllers/user",
        usuario: req.user
    });
}

// Metodo de Registro de Usuarios
const register = async (req, res) => {
    //Recoger Datos de la Peticion
    let params = req.body;

    //Comprobar que me llegan bien (+validación)
    if (!params.name || !params.email || !params.password || !params.nick || !params.phone) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos en la solicitud para el registro de usuarios."
        });
    }

    try {
        //Control de Usuarios Duplicados
        const users = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { phone: params.phone.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        }).exec();

        if (users && users.length >= 1) {
            return res.status(200).json({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        //Cifrar la contraseña
        const pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        //Crear Objeto de Usuario
        let user_to_save = new User(params);

        //Guardar Usuario en la BBDD
        const userStored = await user_to_save.save();

        //Devolver Resultado
        return res.status(200).json({
            status: "success",
            message: "Usuario registrado correctamente",
            user: userStored
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al registrar el usuario",
            error: error.message // Puedes agregar más detalles del error aquí si es necesario
        });
    }
}

const login = async (req, res) => {
    // Recoger Parametros del Body
    let params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    try {
        // Buscar en la Base de Datos si existe el Usuario
        const user = await User.findOne({ email: params.email }).exec();

        if (!user) {
            return res.status(404).send({ status: "error", message: "No existe el usuario" });
        }

        // Comprobar su contraseña
        const isPasswordValid = await bcrypt.compare(params.password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({
                status: "error",
                message: "No te has identificado correctamente"
            });
        }

        // Conseguir el Token
        const token = jwt.createToken(user);

        // Devolver Datos del Usuario
        return res.status(200).send({
            status: "success",
            message: "Te has identificado correctamente",
            user: {
                id: user.id,
                name: user.name,
                nick: user.nick
            },
            token
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en la autenticación",
            error: error.message // Puedes proporcionar detalles adicionales del error si es necesario
        });
    }
}

const profile = (req, res) => {
    //Recibir el parametro del id de usuario por la url
    const id = req.params.id;

    //Consultar para sacar los datos del usuario
    User.findById(id)
        .select({ password: 0, role: 0 })
        .exec((error, userProfile) => {
            if (error || !userProfile) {
                return res.status(404).send({
                    status: "error",
                    message: "El usuario no existe o hay un error"
                });
            }

            //Devovler el resutaldo
            //Posteriormente : devolver la informacion de follows
            return res.status(200).send({
                status: "success",
                user: userProfile
            });
        });

}


const list = async (req, res) => {
    // Controlar en qué página estamos
    let page = 1;
    if (req.params.page) {
        page = parseInt(req.params.page);
    }

    // Definir el valor de itemsPerPage
    const itemsPerPage = 5; // Puedes ajustar este valor según tus necesidades

    try {
        const users = await User.paginate({}, { page, limit: itemsPerPage, sort: { _id: 'asc' } });
        return res.status(200).send({
            status: "success",
            users: users.docs,
            page: users.page,
            itemsPerPage,
            total: users.totalDocs,
            pages: users.totalPages
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en la consulta de usuarios",
            error
        });
    }
}


// Exportar Acciones
module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list

}
