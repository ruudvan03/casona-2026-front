import { useState, useEffect } from 'react';

const API_URL = "http://127.0.0.1:8000/api";

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [checkingRooms, setCheckingRooms] = useState(false);
  const [response, setResponse] = useState(null);
  const [rooms, setRooms] = useState([]);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  // 1. Filtrar disponibilidad
  useEffect(() => {
    if (checkIn && checkOut) {
      setCheckingRooms(true);
      setRooms([]);
      
      fetch(`${API_URL}/check-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          check_in: checkIn, 
          check_out: checkOut,
          guests: parseInt(guests) 
        })
      })
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setCheckingRooms(false);
      })
      .catch(() => setCheckingRooms(false));
    }
  }, [checkIn, checkOut, guests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.room_id = parseInt(data.room_id);

    try {
      const res = await fetch(`${API_URL}/reserve-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setResponse({ success: true, ...result });
      } else {
        setResponse({ success: false, error: result.message });
      }
    } catch (error) {
      setResponse({ success: false, error: "Error de conexión con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de Éxito con Datos Bancarios
  if (response?.success) {
    const waMessage = `Hola, envío el comprobante de mi reserva con folio: ${response.folio}`;
    const waLink = `https://wa.me/521XXXXXXXXXX?text=${encodeURIComponent(waMessage)}`; // Reemplaza las X con tu número

    return (
      <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center shadow-sm animate-in fade-in duration-500">
        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Confirmación de Reserva</h3>
        <div className="mt-4 bg-white border border-slate-200 inline-block px-8 py-3 rounded-lg font-mono text-2xl font-bold text-emerald-700 shadow-sm">
          {response.folio}
        </div>

        {response.payment === 'transfer' && (
          <div className="mt-6 p-6 bg-emerald-50 border border-emerald-100 rounded-xl text-left shadow-inner">
            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-3">Datos para Transferencia (50% Anticipo)</p>
            <div className="space-y-2 text-sm text-emerald-900 font-medium">
              <p className="flex justify-between border-b border-emerald-100 pb-1"><span>Banco:</span> <strong>BBVA</strong></p>
              <p className="flex justify-between border-b border-emerald-100 pb-1"><span>Titular:</span> <strong>Palapa La Casona</strong></p>
              <p className="flex justify-between border-b border-emerald-100 pb-1"><span>CLABE:</span> <strong className="font-mono">012345678901234567</strong></p>
              <p className="flex justify-between"><span>Concepto:</span> <strong>{response.folio}</strong></p>
            </div>
            
            <a href={waLink} target="_blank" rel="noopener noreferrer" 
               className="mt-6 block w-full py-3 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors uppercase tracking-widest shadow-md">
               Enviar comprobante por WhatsApp
            </a>
          </div>
        )}

        <div className="mt-6 text-sm text-slate-700 border-t border-slate-200 pt-6 space-y-2 text-left max-w-xs mx-auto">
            <p>Monto total: <strong>${response.total} MXN</strong></p>
            <p>Método: <strong>{response.payment === 'transfer' ? 'Transferencia' : 'Efectivo'}</strong></p>
        </div>

        <button 
          onClick={() => { setResponse(null); setCheckIn(''); setCheckOut(''); setGuests(1); }} 
          className="mt-8 text-xs font-bold text-slate-900 border-b border-slate-900 uppercase tracking-widest hover:text-emerald-700 transition-all"
        >
          Nueva Reservación
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
      <header className="border-b border-slate-50 pb-4">
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Sistema de Reservas</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium italic">Atención personalizada en La Casona</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Entrada</label>
          <input name="check_in" type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Salida</label>
          <input name="check_out" type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase text-slate-400">Número de Huéspedes</label>
        <select 
          name="guests" 
          value={guests} 
          onChange={(e) => setGuests(e.target.value)} 
          className="w-full p-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none text-sm bg-white"
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num} {num === 1 ? 'Persona' : 'Personas'}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase text-slate-400">Habitaciones Disponibles</label>
        <select name="room_id" required disabled={!checkIn || !checkOut || checkingRooms} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:bg-slate-50 text-sm">
          <option value="">
            {checkingRooms ? 'Consultando disponibilidad...' : (!checkIn ? 'Elija fechas para comenzar' : 'Seleccione palapa')}
          </option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>{room.name} — ${room.price_per_night} / noche</option>
          ))}
        </select>
        {!checkingRooms && checkIn && checkOut && rooms.length === 0 && (
            <p className="text-[10px] text-red-600 font-bold uppercase mt-1 tracking-tighter">Sin disponibilidad para estas fechas o capacidad.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-50 pt-4">
        <input name="name" type="text" placeholder="Nombre completo" required className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none" />
        <input name="email" type="email" placeholder="Correo electrónico" required className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="phone" type="tel" placeholder="WhatsApp" required className="w-full p-3 rounded-xl border-2 border-slate-100 text-sm outline-none" />
        <select name="payment_method" required className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none bg-white font-medium">
            <option value="transfer">Transferencia</option>
            <option value="cash">Efectivo al llegar</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={loading || !rooms.length} 
        className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-emerald-800 disabled:bg-slate-200 transition-all shadow-md uppercase tracking-widest text-xs"
      >
        {loading ? 'Confirmando...' : 'Confirmar Reservación'}
      </button>
    </form>
  );
}