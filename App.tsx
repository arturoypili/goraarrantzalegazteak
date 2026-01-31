
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Mandos from './components/Mandos';
import Cantineras from './components/Cantineras';
import History from './components/History';
import Photos from './components/Photos';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import Activities from './components/Activities';
import InscriptionsList from './components/InscriptionsList';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('gora_admin_active') === 'true';
  });
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminLogin = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanEmail === 'goraarrantzalegazteak@gmail.com' && cleanPass === 'turu010907') {
      setIsAdmin(true);
      sessionStorage.setItem('gora_admin_active', 'true');
      setShowAdminModal(false);
    } else {
      alert('Email o Contraseña incorrectos.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('gora_admin_active');
    alert('Sesión de administrador cerrada.');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#001f3f] overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Navbar 
        isScrolled={isScrolled} 
        isAdmin={isAdmin} 
        onAdminClick={() => setShowAdminModal(true)} 
        onLogout={handleLogout}
        onInscripcionClick={() => setShowContactForm(true)}
      />
      
      <main className="flex-grow">
        <Hero onInscripcionClick={() => setShowContactForm(true)} />
        <Activities isAdmin={isAdmin} />
        <History isAdmin={isAdmin} />
        <Mandos isAdmin={isAdmin} />
        <Cantineras isAdmin={isAdmin} />
        <Photos isAdmin={isAdmin} />
        
        {/* PANEL DE INSCRIPCIONES - SOLO ADMIN */}
        {isAdmin && <InscriptionsList />}
      </main>

      <Footer />

      {showAdminModal && (
        <AdminModal 
          onClose={() => setShowAdminModal(false)} 
          onLogin={handleAdminLogin} 
        />
      )}

      {showContactForm && (
        <Contact onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
};

export default App;
