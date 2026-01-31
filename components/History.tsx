
import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';
import { BookOpen, Plus, Edit, Trash2, X, Save, Upload, Loader2, AlertCircle } from 'lucide-react';
import { dbService, uploadToCloudinary, optimizeImage } from '../lib/storage';

interface Props {
  isAdmin?: boolean;
}

const History: React.FC<Props> = ({ isAdmin }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);
  const [isEditing, setIsEditing] = useState<HistoryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<Partial<HistoryItem>>({ images: [] });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await dbService.getAll('history');
      setHistoryItems(data as HistoryItem[]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setProcessingImages(true);
    const newImages: string[] = [...(formState.images || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Reducimos a 300px con calidad baja (0.4) para asegurar que quepan muchas fotos
        const optimized = await optimizeImage(file, 300, 300, 0.4);
        newImages.push(optimized);
      } catch (err: any) {
        if (err.message === "IMAGE_TOO_LARGE") {
          setError("Una de las fotos es demasiado grande para procesarla.");
        } else {
          setError("Error al procesar una de las imágenes.");
        }
      }
    }

    setFormState(prev => ({ ...prev, images: newImages }));
    setProcessingImages(false);
  };

  const removeImage = (idx: number) => {
    setFormState(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== idx) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.content) return;
    
    setSaving(true);
    setError(null);

    try {
      const currentImages = formState.images || [];
      const uploadedImages = await Promise.all(
        currentImages.map(async (img) => {
          if (img.startsWith('data:image')) return await uploadToCloudinary(img);
          return img;
        })
      );

      const data = {
        title: formState.title,
        content: formState.content,
        images: uploadedImages,
        year: formState.year || ''
      };

      if (isAdding) {
        await dbService.add('history', data);
      } else if (isEditing) {
        await dbService.update('history', isEditing.id, data);
      }
      
      await loadData();
      setIsAdding(false); 
      setIsEditing(null); 
      setFormState({ images: [] });
    } catch (err: any) {
      if (err.message === "QUOTA_EXCEEDED") {
        setError("La memoria del navegador está saturada por las fotos. Intenta borrar alguna noticia o historia antigua.");
      } else {
        setError("Error al guardar. Intenta subir menos fotos a la vez.");
      }
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: string) => {
    await dbService.delete('history', id);
    setHistoryItems(prev => prev.filter(i => i.id !== id));
    setDeletingId(null);
  };

  if (loading) return <div className="py-24 text-center text-slate-400 font-bold uppercase animate-pulse">Cargando Historia...</div>;

  return (
    <section id="historia" className="py-24 bg-slate-50 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] uppercase italic leading-none">HISTORIA</h2>
            <div className="w-24 h-1.5 bg-red-600 mt-4 mx-auto md:mx-0"></div>
          </div>
          {isAdmin && (
            <button onClick={() => { setIsAdding(true); setFormState({ images: [] }); setError(null); }} className="flex items-center space-x-2 bg-[#001f3f] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-all shadow-xl">
              <Plus size={20} /> <span>Añadir Relato</span>
            </button>
          )}
        </div>

        <div className="space-y-24">
          {historyItems.map((item, index) => (
            <div key={item.id} className="border-b border-slate-200 pb-24 last:border-0 relative">
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-start`}>
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="flex items-center gap-4">
                    {item.year && <span className="bg-red-600 text-white font-black px-4 py-1 rounded-lg text-lg italic shadow-lg">{item.year}</span>}
                    <h3 className="text-3xl md:text-4xl font-black text-[#001f3f] uppercase leading-tight italic">{item.title}</h3>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    {item.content.split('\n').map((paragraph, i) => <p key={i} className="text-lg text-slate-600 leading-relaxed font-medium mb-4">{paragraph}</p>)}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-4 pt-8 border-t border-slate-200">
                      <button 
                        onClick={() => { setIsEditing(item); setFormState({...item, images: item.images || []}); setError(null); }} 
                        className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm hover:bg-blue-700 shadow-xl transition-all active:scale-95"
                      >
                        <Edit size={20} /> Editar
                      </button>
                      
                      {deletingId === item.id ? (
                        <div className="flex items-center bg-red-50 p-2 rounded-2xl border-2 border-red-200">
                          <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase">SÍ, BORRAR</button>
                          <button onClick={() => setDeletingId(null)} className="px-6 py-2 text-slate-500 text-xs font-black uppercase">NO</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeletingId(item.id)} 
                          className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-sm hover:bg-red-700 shadow-xl transition-all"
                        >
                          <Trash2 size={20} /> Eliminar
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-1/2">
                  <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group bg-slate-200">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><BookOpen size={64} className="text-slate-400" /></div>
                    )}
                  </div>
                  {item.images && item.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {item.images.slice(1).map((img, i) => (
                        <img key={i} src={img} className="w-full aspect-square object-cover rounded-2xl border-2 border-white shadow-md" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
            <div className="bg-[#001f3f] p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase italic leading-none">{isAdding ? 'Añadir Relato' : 'Editar Relato'}</h3>
              </div>
              <button onClick={() => { setIsAdding(false); setIsEditing(null); setFormState({ images: [] }); setError(null); }} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={28} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-black uppercase">
                  <AlertCircle size={20} /> {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Título</label>
                  <input required value={formState.title || ''} onChange={e => setFormState({...formState, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Año</label>
                  <input placeholder="Ej: 2024" value={formState.year || ''} onChange={e => setFormState({...formState, year: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Relato</label>
                <textarea required value={formState.content || ''} onChange={e => setFormState({...formState, content: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl min-h-[180px] leading-relaxed outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Fotos del Relato</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {(formState.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-100 group">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black">X</button>
                    </div>
                  ))}
                  
                  <label className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${processingImages ? 'bg-slate-100 border-slate-300' : 'hover:bg-blue-50 hover:border-blue-400 border-slate-200'}`}>
                    {processingImages ? (
                      <Loader2 className="animate-spin text-blue-500" />
                    ) : (
                      <>
                        <Upload size={24} className="text-slate-400 mb-1" />
                        <span className="text-[8px] font-black uppercase text-slate-500">Subir</span>
                      </>
                    )}
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} disabled={processingImages} className="hidden" />
                  </label>
                </div>
              </div>

              <button type="submit" disabled={saving || processingImages} className="w-full py-5 bg-red-600 text-white font-black uppercase rounded-[1.5rem] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                {saving ? <Loader2 className="animate-spin" /> : <Save />} {saving ? 'GUARDANDO...' : 'GUARDAR RELATO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default History;
