
import React, { useState, useEffect } from 'react';
import { Activity as ActivityType } from '../types';
import { Calendar, Plus, Edit, Trash2, X, Save, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { dbService, uploadToCloudinary, optimizeImage } from '../lib/storage';

interface Props {
  isAdmin?: boolean;
}

const Activities: React.FC<Props> = ({ isAdmin }) => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState<ActivityType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<Partial<ActivityType>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await dbService.getAll('activities');
      setActivities(data as ActivityType[]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onload = async () => {
        // Añadimos optimización aquí (antes no estaba y llenaba la memoria)
        const optimized = await optimizeImage(r.result as string, 800, 600, 0.6);
        setFormState({...formState, image: optimized});
      };
      r.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.description) return;
    setSaving(true);
    try {
      let imageUrl = formState.image || '';
      if (imageUrl.startsWith('data:image')) {
        imageUrl = await uploadToCloudinary(imageUrl);
      }
      const data = { 
        ...formState, 
        image: imageUrl, 
        date: formState.date || new Date().toLocaleDateString('es-ES') 
      };
      if (isAdding) await dbService.add('activities', data);
      else if (isEditing) await dbService.update('activities', isEditing.id, data);
      await loadData();
      setIsAdding(false); setIsEditing(null); setFormState({});
    } catch (e) { 
      alert("Error al guardar noticia. El almacenamiento podría estar lleno."); 
    }
    setSaving(false);
  };

  if (loading) return <div className="py-24 text-center text-slate-400 font-bold uppercase animate-pulse">Cargando Noticias...</div>;

  return (
    <section id="actividades" className="py-24 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b pb-8">
          <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] uppercase italic">NOTICIAS / ALBISTEAK</h2>
          {isAdmin && (
            <button onClick={() => { setIsAdding(true); setFormState({}); }} className="bg-[#001f3f] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg"><Plus size={18} /> Añadir Noticia</button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {activities.length === 0 ? (
            <div className="col-span-3 text-center py-10 text-slate-300 font-bold italic">No hay noticias publicadas.</div>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all relative">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  {act.image ? (
                    <img src={act.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={act.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>
                  )}
                  <div className="absolute top-4 left-4 bg-[#001f3f] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg"><Calendar size={14} className="inline mr-2" /> {act.date}</div>
                </div>
                <div className="p-8 flex-grow">
                  <h3 className="text-xl font-black text-[#001f3f] mb-4 uppercase leading-tight">{act.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-4 leading-relaxed">{act.description}</p>
                  {isAdmin && (
                    <div className="mt-6 flex gap-2">
                      <button onClick={() => { setIsEditing(act); setFormState(act); }} className="p-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all"><Edit size={16} /></button>
                      {deletingId === act.id ? (
                        <button onClick={async () => { await dbService.delete('activities', act.id); loadData(); setDeletingId(null); }} className="bg-red-600 text-white px-4 rounded-xl text-[10px] font-black uppercase shadow-md">CONFIRMAR BORRADO</button>
                      ) : (
                        <button onClick={() => setDeletingId(act.id)} className="p-3 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition-all"><Trash2 size={16} /></button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="bg-[#001f3f] p-6 text-white flex justify-between items-center">
              <span className="font-black uppercase italic">{isAdding ? 'Nueva Noticia' : 'Editar Noticia'}</span>
              <button onClick={() => { setIsAdding(false); setIsEditing(null); setFormState({}); }}><X /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Título</label>
                <input required placeholder="Escribe el título..." value={formState.title || ''} onChange={e => setFormState({...formState, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Contenido</label>
                <textarea required placeholder="Escribe la noticia..." value={formState.description || ''} onChange={e => setFormState({...formState, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl min-h-[150px] leading-relaxed" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Imagen de Portada</label>
                <div className="relative h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden group cursor-pointer hover:border-blue-400">
                  {formState.image ? (
                    <img src={formState.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <Upload className="mx-auto mb-2" />
                      <span className="text-[10px] font-bold uppercase">Subir Foto</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full py-5 bg-red-600 text-white font-black rounded-2xl uppercase shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                {saving ? <Loader2 className="animate-spin" /> : <Save />} 
                {saving ? 'GUARDANDO...' : 'PUBLICAR NOTICIA'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Activities;
