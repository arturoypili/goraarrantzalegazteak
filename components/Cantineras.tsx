
import React, { useState, useEffect } from 'react';
import { Cantinera } from '../types';
import { dbService, uploadToCloudinary } from '../lib/storage';
import { Plus, Edit, Trash2, X, Save, Upload, Loader2, Heart } from 'lucide-react';

interface Props {
  isAdmin?: boolean;
}

const Cantineras: React.FC<Props> = ({ isAdmin }) => {
  const [cantineras, setCantineras] = useState<Cantinera[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState<Cantinera | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<Partial<Cantinera>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.nombre || !formState.apellidos || !formState.año) return;
    setSaving(true);

    try {
      let fotoUrl = formState.foto || '';
      if (fotoUrl.startsWith('data:image')) {
        fotoUrl = await uploadToCloudinary(fotoUrl);
      }

      const data = {
        nombre: formState.nombre,
        apellidos: formState.apellidos,
        año: Number(formState.año),
        foto: fotoUrl
      };

      if (isAdding) {
        await dbService.add('cantineras', data);
      } else if (isEditing) {
        await dbService.update('cantineras', isEditing.id, data);
      }
      
      await loadData();
      setIsAdding(false);
      setIsEditing(null);
      setFormState({});
    } catch (error) {
      alert("Error al guardar cantinera");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (id: string) => {
    await dbService.delete('cantineras', id);
    setCantineras(prev => prev.filter(c => c.id !== id));
    setDeletingId(null);
  };

  if (loading) return <div className="py-24 text-center text-white font-black uppercase animate-pulse">Cargando Historial...</div>;

  return (
    <section id="cantineras" className="py-24 bg-[#001f3f] text-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight italic">CANTINERAS / KANTINERAK</h2>
          </div>
          {isAdmin && (
            <button onClick={() => { setIsAdding(true); setFormState({}); }} className="flex items-center space-x-2 bg-white text-[#001f3f] px-8 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-xl">
              <Plus size={20} /> <span>Añadir Cantinera</span>
            </button>
          )}
        </div>

        {cantineras.length === 0 ? (
          <div className="text-center py-10 text-white/40 font-bold italic">No hay historial de cantineras registrado.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {cantineras.map((c) => (
              <div key={c.id} className="group relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-blue-400 bg-slate-800 relative">
                  <img src={c.foto || 'https://via.placeholder.com/300x400?text=Kantini'} alt={c.nombre} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setIsEditing(c); setFormState(c); }} className="p-2 bg-blue-600 text-white rounded-lg"><Edit size={14} /></button>
                      {deletingId === c.id ? (
                        <button onClick={() => confirmDelete(c.id)} className="p-2 bg-red-600 text-white rounded-lg text-[8px] font-black">SÍ</button>
                      ) : (
                        <button onClick={() => setDeletingId(c.id)} className="p-2 bg-red-600 text-white rounded-lg"><Trash2 size={14} /></button>
                      )}
                    </div>
                  )}

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

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#001f3f] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic">{isAdding ? 'Nueva Cantinera' : 'Editar Cantinera'}</h3>
              <button disabled={saving} onClick={() => { setIsAdding(false); setIsEditing(null); setFormState({}); }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Año / Urtea</label>
                <input required type="number" placeholder="Ej: 2023" value={formState.año || ''} onChange={e => setFormState({...formState, año: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Nombre" value={formState.nombre || ''} onChange={e => setFormState({...formState, nombre: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
                <input required placeholder="Apellidos" value={formState.apellidos || ''} onChange={e => setFormState({...formState, apellidos: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Foto</label>
                <div className="relative h-40 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer hover:border-blue-400 group">
                  {formState.foto ? (
                    <img src={formState.foto} className="w-full h-full object-cover" />
                  ) : (
                    <Heart className="text-slate-200" size={64} />
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-5 bg-red-600 text-white font-black uppercase rounded-2xl shadow-xl flex items-center justify-center gap-2">
                {saving ? <Loader2 className="animate-spin" /> : <Save />} {saving ? 'GUARDANDO...' : 'GUARDAR CANTINERA'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cantineras;
