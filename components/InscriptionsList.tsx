
import React, { useState, useEffect } from 'react';
import { Inscription } from '../types';
import { Trash2, User, Phone, Mail, FileText, Calendar, ShieldAlert, Crosshair, Info, CreditCard } from 'lucide-react';
import { dbService } from '../lib/storage';

const InscriptionsList: React.FC = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadInscriptions = async () => {
    try {
      const data = await dbService.getAll('inscriptions');
      setInscriptions(data as Inscription[]);
    } catch (e) {
      console.error("Error cargando inscripciones:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInscriptions();
    window.addEventListener('inscription_added', loadInscriptions);
    return () => window.removeEventListener('inscription_added', loadInscriptions);
  }, []);

  const confirmDelete = async (id: string) => {
    await dbService.delete('inscriptions', id);
    setInscriptions(prev => prev.filter(ins => ins.id !== id));
    setDeletingId(null);
  };

  if (loading) return <div className="py-24 text-center text-slate-400 font-black uppercase animate-pulse">Cargando Solicitudes...</div>;

  if (inscriptions.length === 0) {
    return (
      <section className="py-20 bg-slate-100 border-t-4 border-[#001f3f]">
        <div className="container mx-auto px-4 text-center">
          <ShieldAlert size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-3xl font-black text-[#001f3f] uppercase">Panel de Inscripciones</h2>
          <p className="text-slate-500 mt-2 font-bold uppercase text-xs tracking-widest">No hay nuevas solicitudes en el archivo</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-100 border-t-4 border-[#001f3f]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-[#001f3f] uppercase italic">Archivo de Inscripciones</h2>
            <p className="text-red-600 font-black uppercase text-[10px] tracking-[0.3em] mt-1">Solo visible para administradores</p>
          </div>
          <div className="bg-[#001f3f] text-white px-6 py-2 rounded-full font-black text-sm uppercase">
            Total: {inscriptions.length} Aspirantes
          </div>
        </div>

        <div className="grid gap-6">
          {inscriptions.map((ins) => (
            <div key={ins.id} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 flex flex-col lg:flex-row gap-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#001f3f]">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#001f3f] uppercase leading-none">{ins.nombre}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
                      <Calendar size={10} /> {ins.fecha}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={16} className="text-blue-500" /> {ins.email}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={16} className="text-green-500" /> {ins.tlf}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <FileText size={16} className="text-slate-400" /> {ins.dni}
                  </div>
                  <div className="flex items-center gap-3 text-[#001f3f] uppercase tracking-tighter">
                    <Crosshair size={16} className="text-red-500" /> 
                    {ins.puesto} {ins.escopeta_tipo ? `/ ${ins.escopeta_tipo.toUpperCase()}` : ''}
                  </div>
                </div>

                {ins.numero_serie && (
                  <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border border-red-100">
                    Nº Serie: {ins.numero_serie}
                  </div>
                )}
              </div>

              <div className="flex-1 lg:border-l lg:pl-8 border-slate-100 flex flex-col gap-4">
                {ins.cuenta && (
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
                      <CreditCard size={10} /> Nº de Cuenta:
                    </p>
                    <p className="text-xs font-black text-blue-600 font-mono tracking-tight">{ins.cuenta}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
                    <Info size={10} /> Observaciones:
                  </p>
                  <div className="bg-slate-50 p-4 rounded-2xl text-xs font-semibold text-slate-600 leading-relaxed italic border border-slate-100">
                    {ins.comentarios || 'Sin comentarios adicionales.'}
                  </div>
                </div>
              </div>

              <div className="lg:self-center z-[100]">
                {deletingId === ins.id ? (
                  <div className="flex flex-col gap-2 animate-in zoom-in-95">
                    <button onClick={() => confirmDelete(ins.id)} className="bg-red-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase">BORRAR DEFINITIVO</button>
                    <button onClick={() => setDeletingId(null)} className="bg-slate-200 text-slate-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase text-center">NO</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setDeletingId(ins.id)}
                    className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 size={20} />
                    <span className="lg:hidden font-black uppercase text-xs">Borrar Solicitud</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InscriptionsList;
