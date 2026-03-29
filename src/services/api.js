/**
 * SERVICIO DE API - PALAPA LA CASONA
 * Maneja la comunicación entre el frontend (Astro/React) y el backend (Laravel)
 */

// Usamos 127.0.0.1 por defecto para evitar problemas de resolución de DNS en Node.js
const API_URL = import.meta.env.PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// URL para acceder a las fotos guardadas en storage/app/public/
export const STORAGE_URL = "http://127.0.0.1:8000/storage/";

/**
 * 1. OBTENER TODAS LAS HABITACIONES
 * Se usa principalmente en RoomCards.astro para el catálogo inicial.
 */
export const getRooms = async () => {
    try {
        const response = await fetch(`${API_URL}/rooms`);
        
        // Si el servidor responde pero con error (ej. 404 o 500)
        if (!response.ok) {
            console.warn(`Error HTTP: ${response.status}`);
            return [];
        }
        
        return await response.json();
    } catch (error) {
        // Si el servidor está apagado o no hay internet
        console.error("Fallo de conexión en getRooms:", error.message);
        return [];
    }
};

/**
 * 2. CONSULTAR DISPONIBILIDAD FILTRADA
 * Recibe check_in y check_out para devolver solo las habitaciones libres.
 */
export const checkAvailability = async (checkIn, checkOut) => {
    try {
        const response = await fetch(`${API_URL}/check-availability`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                check_in: checkIn, 
                check_out: checkOut 
            }),
        });
        
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error en checkAvailability:", error.message);
        return [];
    }
};

/**
 * 3. REGISTRAR RESERVACIÓN FINAL
 * Envía los datos del formulario (nombre, correo, pago, fechas, etc.)
 */
export const reserveRoom = async (bookingData) => {
    try {
        const response = await fetch(`${API_URL}/reserve-room`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json' 
            },
            body: JSON.stringify(bookingData),
        });
        
        const data = await response.json();

        // Si Laravel devuelve errores de validación (422) o éxito (201)
        return {
            status: response.status,
            ...data
        };
    } catch (error) {
        console.error("Error crítico en reserveRoom:", error.message);
        return { 
            success: false, 
            message: "No se pudo establecer conexión con el servidor de reservas." 
        };
    }
};

/**
 * 4. DISPONIBILIDAD GENERAL
 * Útil para calendarios informativos que marcan días ocupados.
 */
export const getGeneralAvailability = async () => {
    try {
        const response = await fetch(`${API_URL}/availability`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error en getGeneralAvailability:", error.message);
        return [];
    }
};