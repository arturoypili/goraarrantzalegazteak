
import React, { useState, useEffect } from 'react';
import { dbService, uploadToCloudinary, optimizeImage } from '../lib/storage';
import { Plus, Trash2, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

interface Props {
  isAdmin?: boolean;
}

const Photos: React.FC<Props> = ({ isAdmin }) => {
  const [photos, setPhotos] = useState<{id: string, url: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setUploading(true);
    try {
      const filesArray = Array.from(files) as File[];
      
      for (const file of filesArray) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const optimized = await optimizeImage(base64);
        const url = await uploadToCloudinary(optimized);
        await dbService.add('photos', { url });
      }
      await loadPhotos();
    } catch (error) {
      alert("Error al subir fotos. Es posible que el almacenamiento esté lleno.");
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async (id: string) => {
    await dbService.delete('photos', id);
    setPhotos(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
  };

  if (loading) return <div className="py-24 text-center text-slate-400 font-black uppercase">Cargando Galería...</div>;

  return (
    <section id="fotos" className="py-24 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] uppercase leading-none italic">GALERÍA / ARGAZKIAK</h2>
          </div>
          
          {isAdmin && (
            <label className="flex items-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-xl font-bold cursor-pointer hover:bg-[#001f3f] transition-all shadow-xl">
              {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
              <span>{uploading ? 'SUBIENDO...' : 'Añadir Fotos'}</span>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
            </label>
          )}
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-10 text-slate-300 font-bold italic">La galería está vacía.</div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-4 gap-4 space-y-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group rounded-3xl overflow-hidden shadow-md bg-slate-50 border-2 border-transparent hover:border-blue-400 transition-all">
                <img src={photo.url} alt="Alarde" className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                
                {isAdmin && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {deletingId === photo.id ? (
                      <button onClick={() => confirmDelete(photo.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black shadow-xl">BORRAR SÍ</button>
                    ) : (
                      <button onClick={() => setDeletingId(photo.id)} className="p-3 bg-red-600 text-white rounded-xl shadow-xl hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Photos;
