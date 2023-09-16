const pruebatestimonios = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde : /controllers/testimonios"
    });
}


// Exportar Acciones
module.exports = {
    pruebatestimonios
}