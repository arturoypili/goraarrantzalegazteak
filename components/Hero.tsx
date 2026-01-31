
import React from 'react';
import { ChevronDown } from 'lucide-react';
import Shield from './Shield';

interface HeroProps {
  onInscripcionClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onInscripcionClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544415847-1ad52873cf1a?auto=format&fit=crop&q=80&w=1920')` }}
      >
        <div className="absolute inset-0 bg-[#001f3f]/90 md:bg-gradient-to-b md:from-[#001f3f] md:via-[#001f3f]/80 md:to-[#001f3f]"></div>
      </div>

      <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* ESCUDO */}
        <div className="mb-4 animate-in fade-in zoom-in duration-1000 scale-75 sm:scale-80 md:scale-90">
          <Shield className="w-56 h-56 sm:w-64 sm:h-64 md:w-[400px] md:h-[400px] drop-shadow-[0_0_60px_rgba(49,155,0,0.3)]" />
        </div>

        <div className="relative w-full max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] md:leading-[0.9] uppercase tracking-tighter italic drop-shadow-2xl">
            <span className="block mb-1">GORA</span>
            <span className="text-blue-300 not-italic block mb-1">ARRANTZALE</span>
            <span className="text-white block">GAZTEAK</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
            <a href="#actividades" className="w-full sm:w-auto px-10 py-3 bg-white text-[#001f3f] font-black rounded-lg hover:bg-blue-100 transition-all shadow-xl text-sm uppercase tracking-widest">
              Ver Noticias / Albisteak Ikusi
            </a>
            <button 
              onClick={onInscripcionClick}
              className="w-full sm:w-auto px-10 py-3 border-2 border-white/40 text-white font-black rounded-lg hover:bg-white hover:text-[#001f3f] transition-all text-sm uppercase tracking-widest backdrop-blur-sm"
            >
              Inscribirse / Izen-ematea
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/10 hidden md:block">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

export default Hero;
