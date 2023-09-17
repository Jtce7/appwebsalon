//Importar Modulos
const jwt = require("jwt-simple");
const moment = require("moment");


//Importar Clave Secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

//MIDDLEWARE de Autenticacion
exports.auth = (req, res, next) => {
    //Comprobar si llega la Cabacera de auth
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene la cabecera de autenticacion"
        });
    }

    //Limpiar el Token
    let token = req.headers.authorization.replace(/[""]+/g, "");

    //Decodificar el Token
    try {
        let payload = jwt.decode(token, secret);

        //Comprobar expiracion del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "Token Expirado",

            });
        }


        //Agregar Datos de Usuarios a Request
        req.user = payload;



    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Token Invalido",
            error

        });
    }

    //Pasar a la ejecucion de accion
    next();
}
