
import React, { useState, useEffect } from 'react';
import { Mando } from '../types';
import { dbService, uploadToCloudinary, optimizeImage } from '../lib/storage';
import { Plus, Edit, Trash2, X, Save, Upload, Loader2, UserCircle } from 'lucide-react';

interface Props {
  isAdmin?: boolean;
}

const Mandos: React.FC<Props> = ({ isAdmin }) => {
  const [mandos, setMandos] = useState<Mando[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState<Mando | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<Partial<Mando>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const optimized = await optimizeImage(reader.result as string, 800, 1000);
        setFormState(prev => ({ ...prev, foto: optimized }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.nombre || !formState.apellidos || !formState.puesto) return;
    setSaving(true);

    try {
      let fotoUrl = formState.foto || '';
      if (fotoUrl.startsWith('data:image')) {
        fotoUrl = await uploadToCloudinary(fotoUrl);
      }

      const data = {
        nombre: formState.nombre,
        apellidos: formState.apellidos,
        puesto: formState.puesto,
        años: formState.años || '',
        foto: fotoUrl
      };

      if (isAdding) {
        await dbService.add('mandos', data);
      } else if (isEditing) {
        await dbService.update('mandos', isEditing.id, data);
      }
      
      await loadData();
      setIsAdding(false);
      setIsEditing(null);
      setFormState({});
    } catch (error) {
      alert("Error al guardar mando");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (id: string) => {
    await dbService.delete('mandos', id);
    setMandos(prev => prev.filter(m => m.id !== id));
    setDeletingId(null);
  };

  if (loading) return <div className="py-24 text-center text-[#001f3f] font-black uppercase animate-pulse">Cargando Mandos...</div>;

  return (
    <section id="mandos" className="py-24 bg-slate-50 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] uppercase italic">MANDOS / MANDUAK</h2>
            <div className="w-24 h-1.5 bg-red-600 mt-4 mx-auto md:mx-0"></div>
          </div>
          {isAdmin && (
            <button onClick={() => { setIsAdding(true); setFormState({}); }} className="flex items-center space-x-2 bg-[#001f3f] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-all shadow-xl">
              <Plus size={20} /> <span>Añadir Mando</span>
            </button>
          )}
        </div>

        {mandos.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-bold italic">No hay mandos registrados actualmente.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {mandos.map((mando) => (
              <div key={mando.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                <div className="aspect-[3/4] overflow-hidden bg-slate-200 relative">
                  <img src={mando.foto || 'https://via.placeholder.com/400x500?text=Mando'} alt={mando.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => { setIsEditing(mando); setFormState(mando); }} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all"><Edit size={18} /></button>
                      {deletingId === mando.id ? (
                        <div className="flex bg-white p-1 rounded-xl shadow-xl animate-in zoom-in-95">
                          <button onClick={() => confirmDelete(mando.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black">SÍ</button>
                          <button onClick={() => setDeletingId(null)} className="px-3 py-1 text-slate-400 text-[10px] font-black">NO</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(mando.id)} className="p-3 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition-all"><Trash2 size={18} /></button>
                      )}
                    </div>
                  )}
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

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#001f3f] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic">{isAdding ? 'Nuevo Mando' : 'Editar Mando'}</h3>
              <button disabled={saving} onClick={() => { setIsAdding(false); setIsEditing(null); setFormState({}); }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Puesto / Kargu</label>
                <select required value={formState.puesto || ''} onChange={e => setFormState({...formState, puesto: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold text-[#001f3f]">
                  <option value="">Seleccionar...</option>
                  <option value="Capitán">Capitán</option>
                  <option value="Teniente">Teniente</option>
                  <option value="Alférez">Alférez</option>
                  <option value="Sargento">Sargento</option>
                  <option value="Cabo">Cabo</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Nombre" value={formState.nombre || ''} onChange={e => setFormState({...formState, nombre: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
                <input required placeholder="Apellidos" value={formState.apellidos || ''} onChange={e => setFormState({...formState, apellidos: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
              </div>
              <input placeholder="Años (ej: 2020 - Actualidad)" value={formState.años || ''} onChange={e => setFormState({...formState, años: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Foto del Mando</label>
                <div className="relative h-40 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer hover:border-blue-400 group">
                  {formState.foto ? (
                    <img src={formState.foto} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="text-slate-200" size={64} />
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-5 bg-red-600 text-white font-black uppercase rounded-2xl shadow-xl flex items-center justify-center gap-2">
                {saving ? <Loader2 className="animate-spin" /> : <Save />} {saving ? 'GUARDANDO...' : 'GUARDAR MANDO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Mandos;
