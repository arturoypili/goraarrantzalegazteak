
import React, { useState, useEffect } from 'react';
import { Cantinera } from '../types';
import { dbService } from '../lib/storage';

const Cantineras: React.FC = () => {
  const [cantineras, setCantineras] = useState<Cantinera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await dbService.getAll('cantineras');
      setCantineras(data as Cantinera[]);
    } catch (e) {
      console.error("Error cargando cantineras:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-24 text-center text-white font-black uppercase animate-pulse">Cargando Historial...</div>;

  return (
    <section id="cantineras" className="py-24 bg-[#001f3f] text-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight italic">CANTINERAS / KANTINERAK</h2>
        </div>

        {cantineras.length === 0 ? (
          <div className="text-center py-10 text-white/40 font-bold italic">No hay historial de cantineras registrado.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {cantineras.map((c) => (
              <div key={c.id} className="group relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-blue-400 bg-slate-800">
                  <img src={c.foto} alt={c.nombre} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-blue-200 font-black text-2xl">{c.año}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider">{c.nombre} {c.apellidos}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Cantineras;
