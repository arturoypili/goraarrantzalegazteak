
import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/storage';

const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<{id: string, url: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const data = await dbService.getAll('photos');
      setPhotos(data.map((p: any) => ({ id: p.id, url: p.url })));
    } catch (e) {
      console.error("Error cargando fotos:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-24 text-center text-slate-400 font-black uppercase">Cargando Galería...</div>;

  return (
    <section id="fotos" className="py-24 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center md:text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] uppercase leading-none italic">GALERÍA / ARGAZKIAK</h2>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-10 text-slate-300 font-bold italic">La galería está vacía.</div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-4 gap-4 space-y-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group rounded-3xl overflow-hidden shadow-md bg-slate-50">
                <img src={photo.url} alt="Alarde" className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Photos;
