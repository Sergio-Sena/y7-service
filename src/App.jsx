import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import FinancialDashboard from './components/FinancialDashboard';
import LocationSection from './components/LocationSection';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ObligationAlertPopup from './components/ObligationAlertPopup';

import { INITIAL_CLIENTS, INITIAL_OBLIGATIONS_RECORD } from './data/initialData';

export default function App() {
  const [currentView, setCurrentView] = useState('site'); // 'site' ou 'admin'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(false);

  const [adminTab, setAdminTab] = useState('obrigacoes');
  const [pendingTabAfterLogin, setPendingTabAfterLogin] = useState(null);

  // Autenticação oficial: Admind / Admin1307
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('y7_auth') === 'true';
  });

  // Clientes: Carrega apenas a matriz ou o que o usuário cadastrou (sem dados inventados)
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('y7_clients_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Erro ao ler clientes', e);
      }
    }
    return INITIAL_CLIENTS;
  });

  // Obrigações Reais
  const [obligations, setObligations] = useState(() => {
    const saved = localStorage.getItem('y7_obligations_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Erro ao ler obrigações', e);
      }
    }
    return INITIAL_OBLIGATIONS_RECORD;
  });

  useEffect(() => {
    localStorage.setItem('y7_clients_v2', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('y7_obligations_v2', JSON.stringify(obligations));
  }, [obligations]);

  // Ação de Login Geral
  const handleLoginClick = (targetTab = 'obrigacoes') => {
    if (isAuthenticated) {
      setAdminTab(targetTab);
      setCurrentView('admin');
      if (targetTab === 'obrigacoes') {
        setIsAlertPopupOpen(true);
      }
    } else {
      setPendingTabAfterLogin(targetTab);
      setIsLoginModalOpen(true);
    }
  };

  const handleOpenDemonstrativos = () => {
    handleLoginClick('demonstrativos');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('y7_auth', 'true');
    const targetTab = pendingTabAfterLogin || 'obrigacoes';
    setAdminTab(targetTab);
    setPendingTabAfterLogin(null);
    setCurrentView('admin');
    
    if (targetTab === 'obrigacoes') {
      setTimeout(() => {
        setIsAlertPopupOpen(true);
      }, 400);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('y7_auth');
    setCurrentView('site');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header com Login Oficial */}
      <Header 
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'admin') {
            handleLoginClick();
          } else {
            setCurrentView('site');
          }
        }}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Conteúdo Principal */}
      <main style={{ flex: 1 }}>
        {currentView === 'site' ? (
          <>
            <Hero />
            <ServicesSection />
            <FinancialDashboard onOpenDemonstrativos={handleOpenDemonstrativos} />
            <LocationSection />
          </>
        ) : (
          <AdminDashboard 
            clients={clients}
            setClients={setClients}
            obligations={obligations}
            setObligations={setObligations}
            activeTab={adminTab}
            setActiveTab={setAdminTab}
            onOpenAlertPopup={() => setIsAlertPopupOpen(true)}
          />
        )}
      </main>

      {/* Rodapé */}
      <Footer onOpenAdmin={handleLoginClick} />

      {/* Modal de Autenticação (Admind / Admin1307) */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Popup de Alerta de Obrigações Conectadas ao Google Calendar */}
      <ObligationAlertPopup 
        isOpen={isAlertPopupOpen}
        onClose={() => setIsAlertPopupOpen(false)}
        obligations={obligations}
      />
    </div>
  );
}
