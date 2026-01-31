
import React, { useState, useEffect } from 'react';
import { Inscription } from '../types';
import { Trash2, User, Phone, Mail, FileText, Calendar, ShieldAlert, Crosshair, Info, CreditCard, HardDrive, RefreshCw } from 'lucide-react';
import { dbService } from '../lib/storage';

const InscriptionsList: React.FC = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState(dbService.getStorageInfo());

  const loadInscriptions = async () => {
    try {
      const data = await dbService.getAll('inscriptions');
      setInscriptions(data as Inscription[]);
      setStorageInfo(dbService.getStorageInfo());
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
    setStorageInfo(dbService.getStorageInfo());
  };

  const handleClearCache = () => {
    if (confirm("¿ESTÁS SEGURO? Se borrarán TODOS los datos guardados (Mandos, Cantineras, Historias, Fotos y Noticias) para liberar el almacenamiento.")) {
      dbService.clearStorage();
    }
  };

  if (loading) return <div className="py-24 text-center text-slate-400 font-black uppercase animate-pulse">Cargando Solicitudes...</div>;

  return (
    <section className="py-24 bg-slate-100 border-t-4 border-[#001f3f]">
      <div className="container mx-auto px-4">
        
        {/* MONITOR DE ALMACENAMIENTO */}
        <div className="mb-12 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <HardDrive size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Estado de la Memoria</p>
              <h4 className="text-xl font-black text-[#001f3f] uppercase">
                {storageInfo.used} MB <span className="text-slate-300">/ {storageInfo.limit} MB</span>
              </h4>
              <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${Number(storageInfo.used) > 4 ? 'bg-red-600' : 'bg-blue-600'}`}
                  style={{ width: `${(Number(storageInfo.used) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleClearCache}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            <RefreshCw size={14} /> Borrar Todo el Almacenamiento
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-[#001f3f] uppercase italic leading-none">Inscripciones</h2>
            <p className="text-red-600 font-black uppercase text-[10px] tracking-[0.3em] mt-2">Solo visible para administradores</p>
          </div>
          <div className="bg-[#001f3f] text-white px-6 py-2 rounded-full font-black text-sm uppercase">
            Total: {inscriptions.length}
          </div>
        </div>

        {inscriptions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
             <ShieldAlert size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-bold uppercase text-xs">No hay inscripciones guardadas.</p>
          </div>
        ) : (
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
                    <div className="flex items-center gap-3 text-slate-600"><Mail size={16} className="text-blue-500" /> {ins.email}</div>
                    <div className="flex items-center gap-3 text-slate-600"><Phone size={16} className="text-green-500" /> {ins.tlf}</div>
                    <div className="flex items-center gap-3 text-slate-600"><FileText size={16} className="text-slate-400" /> {ins.dni}</div>
                    <div className="flex items-center gap-3 text-[#001f3f] uppercase tracking-tighter">
                      <Crosshair size={16} className="text-red-500" /> {ins.puesto} {ins.escopeta_tipo ? `/ ${ins.escopeta_tipo.toUpperCase()}` : ''}
                    </div>
                  </div>
                </div>
                <div className="flex-1 lg:border-l lg:pl-8 border-slate-100 flex flex-col gap-4">
                  {ins.cuenta && (
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1"><CreditCard size={10} /> Cuenta:</p>
                      <p className="text-xs font-black text-blue-600 font-mono tracking-tight">{ins.cuenta}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1"><Info size={10} /> Notas:</p>
                    <div className="bg-slate-50 p-4 rounded-2xl text-xs font-semibold text-slate-600 italic border border-slate-100">
                      {ins.comentarios || 'Sin notas.'}
                    </div>
                  </div>
                </div>
                <div className="lg:self-center">
                  {deletingId === ins.id ? (
                    <div className="flex flex-col gap-2">
                      <button onClick={() => confirmDelete(ins.id)} className="bg-red-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase">BORRAR</button>
                      <button onClick={() => setDeletingId(null)} className="bg-slate-200 text-slate-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase">NO</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeletingId(ins.id)} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={20} /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default InscriptionsList;
