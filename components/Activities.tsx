
import React, { useState, useEffect } from 'react';
import { Activity as ActivityType } from '../types';
import { Calendar, Plus, Edit, Trash2, X, Save, Upload, Loader2 } from 'lucide-react';
import { dbService, uploadToCloudinary } from '../lib/storage';

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.description) return;
    setSaving(true);
    try {
      let imageUrl = formState.image || '';
      if (imageUrl.startsWith('data:image')) imageUrl = await uploadToCloudinary(imageUrl);
      const data = { ...formState, image: imageUrl, date: formState.date || new Date().toLocaleDateString() };
      if (isAdding) await dbService.add('activities', data);
      else if (isEditing) await dbService.update('activities', isEditing.id, data);
      await loadData();
      setIsAdding(false); setIsEditing(null); setFormState({});
    } catch (e) { alert("Error"); }
    setSaving(false);
  };

  if (loading) return <div className="py-24 text-center text-slate-400 font-bold uppercase animate-pulse">Cargando...</div>;

  return (
    <section id="actividades" className="py-24 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b pb-8">
          <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] uppercase">NOTICIAS / ALBISTEAK</h2>
          {isAdmin && (
            <button onClick={() => { setIsAdding(true); setFormState({}); }} className="bg-[#001f3f] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={18} /> Añadir Noticia</button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {activities.map((act) => (
            <div key={act.id} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all relative">
              <div className="relative h-64 overflow-hidden">
                <img src={act.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-[#001f3f] text-white px-4 py-2 rounded-lg text-xs font-bold"><Calendar size={14} className="inline mr-2" /> {act.date}</div>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-xl font-black text-[#001f3f] mb-4 uppercase">{act.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-4">{act.description}</p>
                {isAdmin && (
                  <div className="mt-6 flex gap-2">
                    <button onClick={() => { setIsEditing(act); setFormState(act); }} className="p-2 bg-blue-600 text-white rounded-lg"><Edit size={16} /></button>
                    {deletingId === act.id ? (
                       <button onClick={async () => { await dbService.delete('activities', act.id); loadData(); }} className="bg-red-600 text-white px-4 rounded-lg text-xs font-bold">CONFIRMAR</button>
                    ) : (
                       <button onClick={() => setDeletingId(act.id)} className="p-2 bg-red-600 text-white rounded-lg"><Trash2 size={16} /></button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-[#001f3f] p-6 text-white flex justify-between">
              <span className="font-black uppercase">{isAdding ? 'Nueva Noticia' : 'Editar Noticia'}</span>
              <button onClick={() => { setIsAdding(false); setIsEditing(null); }}><X /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-4">
              <input required placeholder="Título..." value={formState.title || ''} onChange={e => setFormState({...formState, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl" />
              <textarea required placeholder="Descripción..." value={formState.description || ''} onChange={e => setFormState({...formState, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl min-h-[100px]" />
              <input type="file" onChange={e => {
                 const file = e.target.files?.[0];
                 if (file) {
                   const r = new FileReader();
                   r.onload = () => setFormState({...formState, image: r.result as string});
                   r.readAsDataURL(file);
                 }
              }} className="w-full text-xs" />
              <button type="submit" disabled={saving} className="w-full py-4 bg-red-600 text-white font-black rounded-xl uppercase shadow-lg">
                {saving ? 'GUARDANDO...' : 'GUARDAR'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Activities;
