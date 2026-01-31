
import React, { useState, useEffect } from 'react';
import { Mando } from '../types';
import { dbService } from '../lib/storage';

const Mandos: React.FC = () => {
  const [mandos, setMandos] = useState<Mando[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await dbService.getAll('mandos');
      setMandos(data as Mando[]);
    } catch (e) { 
      console.error("Error cargando mandos:", e); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-24 text-center text-[#001f3f] font-black uppercase animate-pulse">Cargando Mandos...</div>;

  return (
    <section id="mandos" className="py-24 bg-slate-50 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] uppercase italic">MANDOS / MANDUAK</h2>
        </div>

        {mandos.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-bold italic">No hay mandos registrados actualmente.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {mandos.map((mando) => (
              <div key={mando.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                <div className="aspect-[3/4] overflow-hidden bg-slate-200">
                  <img src={mando.foto} alt={mando.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 text-center">
                  <div className="text-blue-500 font-bold uppercase text-xs tracking-widest mb-1">{mando.puesto}</div>
                  <h3 className="text-2xl font-black text-[#001f3f] mb-2 uppercase">{mando.nombre} {mando.apellidos}</h3>
                  <p className="text-slate-500 font-semibold italic">{mando.años}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Mandos;
