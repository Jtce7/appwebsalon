//Importar Dependencias y Modulos
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
//Importar Modelos
const User = require("../models/user");


//Importar Servicios
const jwt = require("../services/jwt");

//Acciones de Prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde : /controllers/user",
        usuario: req.user
    });
}

// Metodo de Registro de Usuarios
const register = async (req, res) => {
    // Recoger Datos de la Petición
    let params = req.body;

    // Comprobar que me llegan bien (+validación)
    if (!params.name || !params.email || !params.password || !params.nick || !params.phone) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos en la solicitud para el registro de usuarios."
        });
    }

    try {
        // Control de Usuarios Duplicados
        const existingUser = await User.findOne({
            $or: [
                { email: params.email.toLowerCase() },
                { phone: params.phone.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        }).exec();

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "El usuario ya existe."
            });
        }

        // Cifrar la contraseña
        const pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        // Crear el nuevo usuario
        const newUser = new User(params);
        await newUser.save();

        return res.status(201).json({
            status: "success",
            message: "Usuario registrado correctamente."
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al registrar el usuario",
            error: error.message
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

const profile = async (req, res) => {
    try {
        // Recibir el parámetro del ID de usuario desde la URL
        const id = req.params.id;

        // Consultar para obtener los datos del usuario
        const userProfile = await User.findById(id).select({ password: 0, role: 0 });

        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "El usuario no existe"
            });
        }

        // Devolver el resultado
        // Posteriormente: devolver la información de los seguidores (follows)
        return res.status(200).send({
            status: "success",
            user: userProfile
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Hubo un error en el servidor"
        });
    }
}


const list = async (req, res) => {
    try {
        // Controlar en qué página estamos
        let page = 1;
        if (req.params.page) {
            page = parseInt(req.params.page);
        }

        // Definir el valor de itemsPerPage
        const itemsPerPage = 5; // Puedes ajustar este valor según tus necesidades

        const options = {
            page,
            limit: itemsPerPage,
            sort: { _id: 1 }, // Ordenar por _id ascendente, puedes cambiarlo si es necesario
        };

        const result = await User.paginate({}, options);

        return res.status(200).send({
            status: 'success',
            message: 'Ruta de listado de usuarios',
            users: result.docs,
            page: result.page,
            itemsPerPage: Math.ceil(result.limit),
            total: result.totalDocs,
            pages: result.totalPages,
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Hubo un error en el servidor',
            error,
        });
    }
}


const update = async (req, res) => {
    try {
        // Recoger información del usuario a actualizar
        let userIdentify = req.user;
        let userToUpdate = req.body;

        // Eliminar campos sobrantes
        delete userToUpdate.iat;
        delete userToUpdate.exp;
        //delete userToUpdate.role;
        delete userToUpdate.image;

        // Comprobar si el usuario ya existe (excluyendo al usuario actual)
        const existingUser = await User.findOne({
            $and: [
                { $or: [{ email: userToUpdate.email }, { nick: userToUpdate.nick }] },
                { _id: { $ne: userIdentify.id } }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "El usuario ya existe"
            });
        }

        if (userToUpdate.password) {
            // Cifrar la contraseña
            const hashedPassword = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = hashedPassword;
        }

        // Actualizar el usuario
        const updatedUser = await User.findByIdAndUpdate(userIdentify.id, userToUpdate, { new: true });

        // Eliminar campos innecesarios nuevamente en la respuesta
        delete updatedUser.iat;
        delete updatedUser.exp;
        //delete updatedUser.role;
        delete updatedUser.image;

        return res.status(200).json({
            status: "success",
            message: "Usuario actualizado correctamente",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar el usuario",
            error: error.message
        });
    }
}

const upload = (req, res) => {

    // Recoger el fichero de imagen y comprobar que existe
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "Petición no incluye la imagen"
        });
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar la extension del archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];

    // Comprobar extension
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {

        // Borrar archivo subido
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        // Devolver respuesta negativa
        return res.status(400).send({
            status: "error",
            message: "Extensión del fichero invalida"
        });
    }

    // Si si es correcta, guardar imagen en bbdd
    User.findOneAndUpdate({ _id: req.user.id }, { image: req.file.filename }, { new: true }, (error, userUpdated) => {
        if (error || !userUpdated) {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida del avatar"
            })
        }

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            user: userUpdated,
            file: req.file,
        });
    });

}

const avatar = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/avatars/" + file;

    // Comprobar que existe
    fs.stat(filePath, (error, exists) => {

        if (!exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            });
        }

        // Devolver un file
        return res.sendFile(path.resolve(filePath));
    });

}


// Exportar Acciones
module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar

}
