const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; // Obtén el ID del usuario a eliminar

        // Verificar si el usuario autenticado tiene permisos de administrador (puedes ajustar esta lógica según tus necesidades)
        if (req.user.role !== "role_admin") {
            return res.status(403).json({ error: "No tienes permiso para eliminar usuarios." });
        }

        // Elimina el usuario por su ID
        await User.findByIdAndDelete(userId);

        res.status(204).json(); // 204 significa "No Content" (éxito sin contenido)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSalon = async (req, res) => {
    try {
        const salonId = req.params.id; // Obtén el ID del salón a eliminar

        // Verificar si el usuario autenticado tiene permisos de administrador (puedes ajustar esta lógica según tus necesidades)
        if (req.user.role !== "role_admin") {
            return res.status(403).json({ error: "No tienes permiso para eliminar salones de belleza." });
        }

        // Elimina el salón por su ID
        await BeautySalon.findByIdAndDelete(salonId);

        res.status(204).json(); // 204 significa "No Content" (éxito sin contenido)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};