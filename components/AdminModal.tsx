
import React, { useState } from 'react';
import { X, Lock, Key, Mail } from 'lucide-react';

interface Props {
  onClose: () => void;
  onLogin: (email: string, pass: string) => void;
}

const AdminModal: React.FC<Props> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-white rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
        <div className="bg-[#001f3f] p-10 text-white relative text-center">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"><X size={28} /></button>
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
            <Lock size={32} />
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tight italic">Acceso Admin</h3>
          <p className="text-blue-300 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">Panel de Control Privado</p>
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Mail size={12} /> Email de Administrador
            </label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="goraarrantzalegazteak@gmail.com"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-600 outline-none transition-all font-bold text-[#001f3f]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Key size={12} /> Contraseña / Pasahitza
            </label>
            <div className="relative">
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-600 outline-none transition-all pl-14 font-bold text-[#001f3f]"
              />
              <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full py-5 mt-4 bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#001f3f] transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            <Lock size={20} />
            Entrar / Sartu
          </button>
          
          <p className="text-center text-slate-300 text-[10px] uppercase font-bold mt-4">
            Solo personal autorizado
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
