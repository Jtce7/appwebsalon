// Importar Dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave Secreta
const secret = "CLAVE_SECRETA_de_la_APP_web_SalonB_160923";

//Crear una funcion para generar tokens
const createToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    //Devolver JWT token codificado
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}
