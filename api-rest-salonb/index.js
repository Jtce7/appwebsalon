//Importar Dependencias
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Mensaje Bienvenidad
console.log("API NODE para APPWEBSALON arrancada!!");


// Conexion a Base de Datos
connection();


//Crear Servidor Node
const app = express();
const puerto = 3900;


//Configuraciones de Cors
app.use(cors());

//Convertir los Datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Cargar Configuracion de Rutas

const  userRoutes = require("./routes/user");
const  servicesRoutes = require("./routes/services");
const  reviewsRoutes = require("./routes/reviews");
const  beautySalonsRoutes = require("./routes/beautySalons");
const  appointmentsRoutes = require("./routes/appointments");

app.use("/api/user", userRoutes);
app.use("/api", servicesRoutes);
app.use("/api", reviewsRoutes);
app.use("/api", beautySalonsRoutes);
app.use("/api", appointmentsRoutes);



//Ruta de prueba
app.get("/ruta-prueba", (req, res) => {

    return res.status(200).json(
        {
            "id": 1,
            "nombre": "Juan",
            "web": "fxd"
        }
    )

});

//Poner al servidor escuchar peticiones http

app.listen(puerto, () => {
    console.log("Servidor de node corriendo en el puerto: ", puerto);
});