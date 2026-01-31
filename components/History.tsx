
import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';
import { BookOpen, Plus, Edit, Trash2, X, Save, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { dbService, uploadToCloudinary } from '../lib/storage';

interface Props {
  isAdmin?: boolean;
}

const History: React.FC<Props> = ({ isAdmin }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState<HistoryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<Partial<HistoryItem>>({ images: [] });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await dbService.getAll('history');
      setHistoryItems(data as HistoryItem[]);
    } catch (e) { 
      console.error(e); 
    } finally {
      setLoading(false);
    }
  };

  // Explicitly typing 'file' as File to resolve the 'unknown' type error in some TS environments
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormState(prev => ({
            ...prev,
            images: [...(prev.images || []), reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (idx: number) => {
    setFormState(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.content) return;
    setSaving(true);

    try {
      // Subir todas las imágenes nuevas a Cloudinary
      const currentImages = formState.images || [];
      const uploadedImages = await Promise.all(
        currentImages.map(async (img) => {
          if (img.startsWith('data:image')) {
            return await uploadToCloudinary(img);
          }
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
    } catch (error) {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (id: string) => {
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
            <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] uppercase italic">HISTORIA / HISTORIA</h2>
            <div className="w-24 h-1.5 bg-red-600 mt-4 mx-auto md:mx-0"></div>
          </div>
          {isAdmin && (
            <button onClick={() => { setIsAdding(true); setFormState({ images: [] }); }} className="flex items-center space-x-2 bg-[#001f3f] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-all shadow-xl">
              <Plus size={20} /> <span>Añadir Relato</span>
            </button>
          )}
        </div>

        <div className="space-y-24">
          {historyItems.map((item, index) => (
            <div key={item.id} className="border-b border-slate-200 pb-24 last:border-0">
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-start mb-12`}>
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="flex items-center gap-4">
                    {item.year && (
                      <span className="bg-red-600 text-white font-black px-6 py-2 rounded-xl text-xl italic shadow-lg">
                        {item.year}
                      </span>
                    )}
                    <h3 className="text-3xl md:text-4xl font-black text-[#001f3f] uppercase leading-tight italic">
                      {item.title}
                    </h3>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    {item.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="text-lg text-slate-600 leading-relaxed font-medium">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center space-x-4 pt-4">
                      <button onClick={() => { setIsEditing(item); setFormState(item); }} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all"><Edit size={20} /></button>
                      {deletingId === item.id ? (
                        <div className="flex bg-white p-1 rounded-xl border-2 border-red-600 animate-in zoom-in-95">
                          <button onClick={() => confirmDelete(item.id)} className="bg-red-600 text-white px-4 py-1 rounded-lg text-xs font-black uppercase">SÍ</button>
                          <button onClick={() => setDeletingId(null)} className="px-4 py-1 text-slate-400 text-xs font-black uppercase">NO</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(item.id)} className="p-3 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition-all"><Trash2 size={20} /></button>
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
                </div>
              </div>

              {item.images && item.images.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                  {item.images.slice(1).map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition-transform duration-300">
                      <img src={img} className="w-full h-full object-cover" alt={`Detalle ${i}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="bg-[#001f3f] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic">{isAdding ? 'Añadir Relato' : 'Editar Relato'}</h3>
              <button disabled={saving} onClick={() => { setIsAdding(false); setIsEditing(null); setFormState({ images: [] }); }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input required placeholder="Título..." value={formState.title || ''} onChange={e => setFormState({...formState, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
                <input placeholder="Año (ej: 1985)" value={formState.year || ''} onChange={e => setFormState({...formState, year: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
              </div>
              <textarea required placeholder="Relato..." value={formState.content || ''} onChange={e => setFormState({...formState, content: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl min-h-[150px]" />
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Imágenes (Varias fotos permitidas)</label>
                <div className="grid grid-cols-4 gap-2">
                  {(formState.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"><X size={12} /></button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50">
                    <Upload size={20} className="text-slate-400" />
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-5 bg-red-600 text-white font-black uppercase rounded-2xl shadow-xl flex items-center justify-center gap-2">
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
