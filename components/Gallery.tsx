
import React from 'react';

const Gallery: React.FC = () => {
  const images = [
    'https://picsum.photos/id/645/600/800',
    'https://picsum.photos/id/646/800/600',
    'https://picsum.photos/id/647/800/800',
    'https://picsum.photos/id/648/800/600',
    'https://picsum.photos/id/649/600/800',
    'https://picsum.photos/id/650/800/600',
  ];

  return (
    <section id="galeria" className="py-24 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white uppercase mb-4">MOMENTOS EN EL MAR</h2>
          <div className="w-20 h-1.5 bg-red-600 mx-auto"></div>
        </div>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((src, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-xl">
              <img 
                src={src} 
                alt={`Gallery ${i}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" 
              />
              <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold border-2 border-white px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">Ver Imagen</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
