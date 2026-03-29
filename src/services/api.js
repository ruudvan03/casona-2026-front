const API_URL = import.meta.env.PUBLIC_API_URL;

// URL base para las imágenes que vienen del storage de Laravel
export const STORAGE_URL = "http://localhost:8000/storage/";

/**
 * Envía una solicitud de reservación al backend
 */
export const reserveEvent = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/reserve`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json' 
            },
            body: JSON.stringify(formData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error en reserveEvent:", error);
        return { success: false, message: "Error de conexión con el servidor" };
    }
};

/**
 * Obtiene la lista de habitaciones desde la base de datos
 */
export const getRooms = async () => {
    try {
        const response = await fetch(`${API_URL}/rooms`);
        if (!response.ok) throw new Error('Error al obtener habitaciones');
        return await response.json();
    } catch (error) {
        console.error("Error en getRooms:", error);
        return [];
    }
};

/**
 * Obtiene disponibilidad de fechas (opcional para el buscador)
 */
export const getAvailability = async () => {
    try {
        const response = await fetch(`${API_URL}/availability`);
        return await response.json();
    } catch (error) {
        return [];
    }
};