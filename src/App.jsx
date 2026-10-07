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
import { supabase } from './lib/supabase';
import { fetchClientes, fetchObrigacoes, saveCliente, deleteCliente, saveObrigacao, deleteObrigacao } from './lib/db';
import { INITIAL_CLIENTS } from './data/initialData';

export default function App() {
  const [currentView, setCurrentView] = useState('site'); // 'site' ou 'admin'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(false);

  const [adminTab, setAdminTab] = useState('obrigacoes');
  const [pendingTabAfterLogin, setPendingTabAfterLogin] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [obligations, setObligations] = useState([]);

  // Carregamento de dados do banco e autenticação
  useEffect(() => {
    // Limpeza de chaves legadas e carga inicial
    try {
      localStorage.removeItem('y7_empresa_cli-athene');
      localStorage.removeItem('y7_fat_cli-athene');
      localStorage.removeItem('y7_fin_cli-athene');
      localStorage.removeItem('y7_fin_cli-y7');
    } catch (e) {}

    loadData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        loadData();
      }
    }).catch(() => {});

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) loadData();
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadData() {
    try {
      const [cls, obs] = await Promise.all([fetchClientes(), fetchObrigacoes()]);
      setClients(cls || []);
      setObligations(obs || []);
    } catch (e) {
      console.warn('Erro ao carregar dados do banco:', e);
    }
  }

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
    const targetTab = pendingTabAfterLogin || 'obrigacoes';
    setAdminTab(targetTab);
    setPendingTabAfterLogin(null);
    setCurrentView('admin');
    if (targetTab === 'obrigacoes') setTimeout(() => setIsAlertPopupOpen(true), 400);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
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
            handleLogout();
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
            <FinancialDashboard />
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
            saveCliente={saveCliente}
            deleteCliente={deleteCliente}
            saveObrigacao={saveObrigacao}
            deleteObrigacao={deleteObrigacao}
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
