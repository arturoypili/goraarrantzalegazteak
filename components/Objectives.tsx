
import React from 'react';
import { Target, Fish, Shield, HeartHandshake } from 'lucide-react';

const objectives = [
  {
    title: 'Sostenibilidad',
    desc: 'Promovemos métodos de captura selectivos que respeten la biodiversidad del Cantábrico.',
    icon: <Fish size={32} />
  },
  {
    title: 'Digitalización',
    desc: 'Modernizamos el sector integrando nuevas tecnologías en la gestión y comercialización.',
    icon: <Target size={32} />
  },
  {
    title: 'Formación',
    desc: 'Impulsamos programas de capacitación técnica y empresarial para jóvenes.',
    icon: <Shield size={32} />
  },
  {
    title: 'Reconocimiento',
    desc: 'Damos visibilidad social y política a la importancia estratégica de la pesca.',
    icon: <HeartHandshake size={32} />
  }
];

const Objectives: React.FC = () => {
  return (
    <section id="objetivos" className="py-24 bg-blue-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600/10 skew-x-12 transform translate-x-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Nuestro Compromiso</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 uppercase">OBJETIVOS ESTRATÉGICOS</h2>
          <div className="w-24 h-1.5 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {objectives.map((obj, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {obj.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{obj.title}</h3>
              <p className="text-blue-100 leading-relaxed font-light">
                {obj.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Objectives;
