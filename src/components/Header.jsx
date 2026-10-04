import React from 'react';
import { Building2, Shield, Calendar, Phone, LogIn, LogOut, Globe, LayoutDashboard } from 'lucide-react';
import { Y7_INFO } from '../data/initialData';

export default function Header({ currentView, setCurrentView, isAuthenticated, onLogout }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#070b16',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Barra Superior Institucional */}
      <div style={{
        backgroundColor: '#050811',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '7px 0',
        fontSize: '0.84rem',
        color: '#CBD5E1'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={14} color="#C81E3D" />
              <span>Av. Copacabana, 112 - Sala 1712 - Alphaville, Barueri/SP</span>
            </span>
            <span className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="#38BDF8" />
              <span>CNPJ: {Y7_INFO.cnpj}</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0', fontWeight: 600 }}>
            <Calendar size={14} color="#C81E3D" />
            <span>Constituição: 2020</span>
          </div>
        </div>
      </div>

      {/* Barra Principal de Navegação */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
        {/* Logo Y7 */}
        <div 
          onClick={() => setCurrentView('site')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid #C81E3D',
            backgroundColor: '#0a0f1d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img 
              src="/assets/y7_logo_emblema.jpg" 
              alt="Y7 Service" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span style="color:#C81E3D;font-weight:900;font-size:16px;">Y7</span>';
              }}
            />
          </div>
          <div>
            <div style={{ 
              fontSize: '1.28rem', 
              fontWeight: 800, 
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              letterSpacing: '0.02em',
              lineHeight: 1.1
            }}>
              <span>Y7</span>
              <span style={{ color: '#C81E3D' }}>SERVICE</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
              Contabilidade
            </div>
          </div>
        </div>

        {/* Menu Links Desktop */}
        <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => { setCurrentView('site'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ 
              background: 'none', border: 'none', 
              color: currentView === 'site' ? '#FFFFFF' : '#CBD5E1', 
              cursor: 'pointer', fontWeight: 600, fontSize: '0.94rem',
              borderBottom: currentView === 'site' ? '2px solid #C81E3D' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            Início
          </button>
          
          <a href="#solucoes" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.94rem', fontWeight: 500 }}>
            Serviços
          </a>

          <a href="#dashboard-contabil" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.94rem', fontWeight: 500 }}>
            DRE & Balanço
          </a>

          <a href="#localizacao" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.94rem', fontWeight: 500 }}>
            Contato
          </a>
        </nav>

        {/* Botões do Topo: Login / Logout e WhatsApp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isAuthenticated ? (
            <button 
              onClick={() => setCurrentView('admin')}
              className="btn btn-ruby btn-sm"
              title="Acesso com login Admind"
              style={{ padding: '8px 14px', fontSize: '0.86rem' }}
            >
              <LogIn size={15} />
              <span>Login</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentView === 'site' ? (
                <button 
                  onClick={() => setCurrentView('admin')}
                  className="btn btn-ruby btn-sm"
                  style={{ padding: '8px 12px', fontSize: '0.84rem' }}
                >
                  <LayoutDashboard size={14} />
                  <span>Painel</span>
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentView('site')}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '8px 12px', fontSize: '0.84rem' }}
                >
                  <Globe size={14} color="#38BDF8" />
                  <span>Ver Site</span>
                </button>
              )}

              <button 
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                title="Sair do painel"
                style={{ padding: '8px 10px', fontSize: '0.84rem', color: '#F87171' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          <a 
            href={`https://wa.me/${Y7_INFO.contatos.whatsappRaw}?text=${encodeURIComponent('Olá, gostaria de falar com a equipe contábil da Y7 Service.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-blue btn-sm"
            style={{ padding: '8px 14px', fontSize: '0.86rem' }}
          >
            <Phone size={14} />
            <span className="hide-mobile">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}
