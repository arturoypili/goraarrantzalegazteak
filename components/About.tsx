
import React from 'react';
import { Users, Compass, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="quienes-somos" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-60"></div>
            <div className="relative z-10 space-y-6">
              <span className="text-red-600 font-bold tracking-widest uppercase text-sm">Nuestra Historia</span>
              <h2 className="text-4xl md:text-5xl font-black text-blue-900 uppercase">
                QUIÉNES <br /> SOMOS
              </h2>
              <div className="w-20 h-1.5 bg-red-600 mb-8"></div>
              <p className="text-lg text-slate-700 leading-relaxed">
                Gora Arrantzale Gazteak es una asociación nacida de la inquietud de los jóvenes del sector pesquero del País Vasco. 
                Nuestra misión es asegurar que el mar siga siendo fuente de vida y trabajo para las próximas generaciones.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed italic border-l-4 border-blue-900 pl-6 py-2">
                "No somos solo pescadores, somos guardianes de una tradición milenaria adaptada a los nuevos tiempos."
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-2">
                  <h4 className="text-3xl font-black text-blue-900">150+</h4>
                  <p className="text-sm font-bold text-slate-500 uppercase">Socios Activos</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-black text-blue-900">20+</h4>
                  <p className="text-sm font-bold text-slate-500 uppercase">Puertos Representados</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img src="https://picsum.photos/id/666/400/500" alt="Mar" className="rounded-2xl shadow-xl w-full object-cover h-80" />
              <div className="bg-blue-900 p-8 rounded-2xl text-white">
                <Compass className="mb-4 text-red-500" size={40} />
                <h3 className="text-xl font-bold mb-2">Visión</h3>
                <p className="text-sm text-blue-100">Ser el motor del cambio hacia una pesca sostenible y tecnológica.</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <Users className="mb-4 text-red-600" size={40} />
                <h3 className="text-xl font-bold mb-2">Comunidad</h3>
                <p className="text-sm text-slate-600">Crear red entre cofradías y jóvenes pescadores.</p>
              </div>
              <img src="https://picsum.photos/id/641/400/500" alt="Barco" className="rounded-2xl shadow-xl w-full object-cover h-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
