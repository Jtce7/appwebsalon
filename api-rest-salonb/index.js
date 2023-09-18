// Importar Dependencias
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Mensaje de Bienvenida
console.log("API NODE para APPWEBSALON arrancada!!");

// Conexion a la Base de Datos
connection();

// Crear Servidor Node
const app = express();
const puerto = 3900;

// Configuraciones de Cors
app.use(cors());

// Convertir los Datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargar Configuración de Rutas
const userRoutes = require("./routes/user");
const beautySalonsRoutes = require("./routes/beautySalons"); // Importar rutas de salones de belleza

// Importar rutas de servicios y horarios
const servicesRoutes = require("./routes/servicesRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

app.use("/api/user", userRoutes);
app.use("/api/beauty-salons", beautySalonsRoutes); // Usar rutas de salones de belleza bajo /api/beauty-salons

// Agregar rutas de servicios y horarios
app.use("/api/services", servicesRoutes);
app.use("/api/schedule", scheduleRoutes);

// Ruta de prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json({
        "id": 1,
        "nombre": "Juan",
        "web": "fxd"
    });
});

// Poner al servidor escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor de node corriendo en el puerto: ", puerto);
});
