
import React from 'react';
import Shield from './Shield';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001f3f] text-white py-12 border-t border-white/5">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center justify-center space-y-4 mb-10">
          <Shield className="w-20 h-20" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
              GORA ARRANTZALE GAZTEAK
            </div>
            <div className="text-blue-300 font-bold uppercase tracking-[0.3em] text-[10px] mt-3">
              Hondarribia - Gipuzkoa
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase tracking-widest text-blue-200/40">
          <span className="hover:text-white transition-colors cursor-default">Gora Hondarribia!</span>
          <span className="hover:text-white transition-colors cursor-default">Irailak 8 / 8 de Septiembre</span>
          <span className="hover:text-white transition-colors cursor-default">Gora Alardea!</span>
        </div>
        <div className="mt-10 pt-8 border-t border-white/5 text-[9px] text-white/20 uppercase tracking-[0.5em] font-bold">
          © {new Date().getFullYear()} Gora Arrantzale Gazteak
        </div>
      </div>
    </footer>
  );
};

export default Footer;
