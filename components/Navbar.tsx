
import React, { useState } from 'react';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import Shield from './Shield';

interface NavbarProps {
  isScrolled: boolean;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  onLogout?: () => void;
  onInscripcionClick: () => void;
}

const navItems = [
  { es: 'Inicio', eu: 'Hasiera', href: '#' },
  { es: 'Noticias', eu: 'Albisteak', href: '#actividades' },
  { es: 'Historia', eu: 'Historia', href: '#historia' },
  { es: 'Mandos', eu: 'Manduak', href: '#mandos' },
  { es: 'Cantineras', eu: 'Kantinerak', href: '#cantineras' },
  { es: 'Fotos', eu: 'Argazkiak', href: '#fotos' },
  { es: 'Inscripción', eu: 'Izen-ematea', href: 'CONTACTO' },
];

const Navbar: React.FC<NavbarProps> = ({ isScrolled, isAdmin, onAdminClick, onLogout, onInscripcionClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href === 'CONTACTO') {
      onInscripcionClick();
      return;
    }
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#001f3f] shadow-xl py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <button onClick={() => handleNavClick('#')} className="flex items-center space-x-2 group text-left">
          <div className="bg-white p-1 rounded-full shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
             <Shield className="w-8 h-8 md:w-9 md:h-9" />
          </div>
          <div className="flex flex-col justify-center hidden sm:flex">
            <span className="text-[10px] font-black tracking-widest text-white leading-none uppercase">GORA ARRANTZALE GAZTEAK</span>
          </div>
        </button>

        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="group flex flex-col items-center focus:outline-none"
            >
              <span className="text-white font-black text-[13px] uppercase tracking-wide hover:text-blue-300 transition-colors">
                {item.es} / {item.eu}
              </span>
              <div className="w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></div>
            </button>
          ))}
          
          <div className="flex items-center space-x-2 border-l border-white/20 pl-4">
            {isAdmin && (
              <button 
                onClick={onLogout}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="text-[9px] font-black uppercase">Salir</span>
              </button>
            )}
            <button 
              onClick={onAdminClick}
              className={`p-2 rounded-lg transition-all ${isAdmin ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Móvil */}
      <div className={`fixed inset-0 bg-[#001f3f] z-40 transition-transform duration-500 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full justify-center items-center space-y-6">
          <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2 text-white"><X size={32} /></button>
          <Shield className="w-32 h-32 mb-4" />
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="text-center group"
            >
              <div className="text-white text-2xl font-black uppercase tracking-tight hover:text-blue-300 transition-colors">
                {item.es} / {item.eu}
              </div>
            </button>
          ))}
          {isAdmin && (
            <button onClick={onLogout} className="mt-4 bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase">Cerrar Sesión</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
