import { useState, useEffect } from 'react';

const API_URL = "http://localhost:8000/api";

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [rooms, setRooms] = useState([]);

  // Cargar las habitaciones para el menú desplegable
  useEffect(() => {
    fetch(`${API_URL}/rooms`)
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error("Error al cargar habitaciones:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      room_id: formData.get('room_id'),
      check_in: formData.get('check_in'),
      check_out: formData.get('check_out'),
    };

    try {
      const res = await fetch(`${API_URL}/reserve-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setResponse(result);
    } catch (error) {
      setResponse({ error: "Error de conexión con el servidor." });
    }
    setLoading(false);
  };

  if (response?.success) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-200 p-8 rounded-3xl text-center shadow-inner">
        <h3 className="text-2xl font-black text-emerald-900">¡Reserva Solicitada!</h3>
        <p className="mt-3 text-emerald-700">Tu folio es: <strong className="text-xl">{response.folio}</strong></p>
        <p className="text-sm mt-4 text-emerald-600/80">Hemos enviado un correo de confirmación a <strong>{response.email}</strong> con los detalles para el pago.</p>
        <button onClick={() => setResponse(null)} className="mt-6 text-sm font-bold text-emerald-800 hover:underline">
          Hacer otra reserva
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 space-y-5">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Reserva tu Habitación</h2>
        <p className="text-slate-500 text-sm">Asegura tu descanso en La Casona.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" type="text" placeholder="Nombre completo" required className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all" />
        <input name="email" type="email" placeholder="Correo electrónico" required className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="phone" type="tel" placeholder="WhatsApp (10 dígitos)" required className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all" />
        <select name="room_id" required className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all cursor-pointer">
          <option value="">Selecciona una habitación...</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>{room.name} - ${room.price_per_night}/noche</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Llegada (Check-in)</label>
          <input name="check_in" type="date" required className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Salida (Check-out)</label>
          <input name="check_out" type="date" required className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all" />
        </div>
      </div>

      {response?.error && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">⚠️ {response.error}</div>}

      <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all active:scale-95">
        {loading ? 'PROCESANDO...' : 'SOLICITAR RESERVA'}
      </button>
    </form>
  );
}