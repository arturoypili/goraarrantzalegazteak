
import React, { useState } from 'react';
import { Send, X, CheckCircle, Loader2, Crosshair, ClipboardList, CreditCard } from 'lucide-react';
import { dbService } from '../lib/storage';

interface ContactProps {
  onClose: () => void;
}

const Contact: React.FC<ContactProps> = ({ onClose }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    email: '',
    tlf: '',
    cuenta: '',
    puesto: '',
    escopeta_tipo: '',
    numero_serie: '',
    comentarios: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const newInscription = {
        ...formData,
        id: Date.now().toString(),
        fecha: new Date().toLocaleString('es-ES')
      };

      await dbService.add('inscriptions', newInscription);

      setFormSubmitted(true);
      window.dispatchEvent(new Event('inscription_added'));

      setTimeout(() => {
        setFormSubmitted(false);
        onClose();
      }, 3000);
    } catch (e) {
      alert("Error al enviar la inscripción");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-300 z-10">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-slate-100 text-slate-500 hover:bg-red-600 hover:text-white rounded-full transition-all z-20"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12 lg:p-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-[#001f3f] uppercase mb-4 italic tracking-tight">Inscripción / Izen-ematea</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
          </div>

          {formSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle size={56} />
              </div>
              <h3 className="text-3xl font-black text-[#001f3f] uppercase">¡RECIBIDO!</h3>
              <p className="text-slate-600 font-bold">Tu solicitud ha sido enviada correctamente.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {/* DATOS PERSONALES */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">* Nombre y Apellidos</label>
                <input required name="nombre" value={formData.nombre} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-red-500 outline-none transition-all" placeholder="Nombre completo..." />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">* DNI</label>
                <input required name="dni" value={formData.dni} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-red-500 outline-none transition-all" placeholder="12345678X" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">* Teléfono</label>
                <input required name="tlf" value={formData.tlf} onChange={handleChange} type="tel" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-red-500 outline-none transition-all" placeholder="600 000 000" />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">* E-mail</label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-red-500 outline-none transition-all" placeholder="tu@email.com" />
              </div>

              <div className="md:col-span-2 h-px bg-slate-100 my-2"></div>

              {/* PUESTO Y DETALLES */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1 flex items-center gap-2">
                  <Crosshair size={12} /> * Puesto / Postua
                </label>
                <select required name="puesto" value={formData.puesto} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-red-500 outline-none transition-all appearance-none font-bold text-slate-700">
                  <option value="">Seleccionar puesto...</option>
                  <option value="txibilito">Txibilito</option>
                  <option value="redoble">Redoble</option>
                  <option value="partxe">Partxe</option>
                  <option value="cubero">Cubero</option>
                  <option value="escopeta">Escopeta</option>
                </select>
              </div>

              {formData.puesto === 'escopeta' && (
                <div className="space-y-1 animate-in slide-in-from-left-2 duration-300">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">* Tipo de Escopeta</label>
                  <select required name="escopeta_tipo" value={formData.escopeta_tipo} onChange={handleChange} className="w-full px-6 py-4 bg-blue-50 border-2 border-transparent rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-blue-900">
                    <option value="">¿Remington o Réplica?</option>
                    <option value="remington">Remington</option>
                    <option value="replica">Réplica</option>
                  </select>
                </div>
              )}

              {formData.puesto === 'escopeta' && formData.escopeta_tipo === 'remington' && (
                <div className="md:col-span-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">* Número de Serie (Remington)</label>
                  <input required name="numero_serie" value={formData.numero_serie} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-red-50 border-2 border-transparent rounded-2xl focus:border-red-500 outline-none transition-all font-bold text-red-900" placeholder="Introduce el Nº de serie..." />
                </div>
              )}

              {/* CAMPOS ADICIONALES */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1 flex items-center gap-2">
                  <CreditCard size={12} /> Nº de Cuenta
                </label>
                <input name="cuenta" value={formData.cuenta} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 outline-none transition-all" placeholder="ES00 0000 0000 0000 0000 0000" />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                  <ClipboardList size={12} /> Observaciones o Dudas
                </label>
                <textarea name="comentarios" value={formData.comentarios} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 outline-none transition-all min-h-[100px]" placeholder="Alguna duda o aclaración..."></textarea>
              </div>

              <div className="md:col-span-2 pt-4">
                <button type="submit" disabled={isSaving} className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#001f3f] transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-95">
                  {isSaving ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                  <span>{isSaving ? 'ENVIANDO...' : 'Confirmar Inscripción'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
