import React, { useState } from 'react';
import { Building2, Shield, Calendar, Phone, LogIn, LogOut, Globe, LayoutDashboard, Menu, X } from 'lucide-react';
import { Y7_INFO } from '../data/initialData';

export default function Header({ currentView, setCurrentView, isAuthenticated, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', action: () => { setCurrentView('site'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false); } },
    { label: 'Serviços', href: '#solucoes' },
    { label: 'DRE & Balanço', href: '#dashboard-contabil' },
    { label: 'Contato', href: '#localizacao' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#070b16',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Barra Superior Institucional — oculta no mobile */}
      <div className="hide-mobile" style={{
        backgroundColor: '#050811',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '7px 0',
        fontSize: '0.84rem',
        color: '#CBD5E1'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={14} color="#C81E3D" />
              <span>Av. Copacabana, 112 - Sala 1712 - Alphaville, Barueri/SP</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
        {/* Logo */}
        <div
          onClick={() => { setCurrentView('site'); setMenuOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden',
            border: '2px solid #C81E3D', backgroundColor: '#0a0f1d',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
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
              fontSize: '1.28rem', fontWeight: 800, color: '#FFFFFF',
              display: 'flex', alignItems: 'center', gap: '5px',
              letterSpacing: '0.02em', lineHeight: 1.1
            }}>
              <span>Y7</span>
              <span style={{ color: '#C81E3D' }}>SERVICE</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
              Contabilidade
            </div>
          </div>
        </div>

        {/* Nav Desktop */}
        <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {navLinks.map((link) =>
            link.href ? (
              <a key={link.label} href={link.href} style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.94rem', fontWeight: 500 }}>
                {link.label}
              </a>
            ) : (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: 'none', border: 'none',
                  color: currentView === 'site' ? '#FFFFFF' : '#CBD5E1',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.94rem',
                  borderBottom: currentView === 'site' ? '2px solid #C81E3D' : '2px solid transparent',
                  paddingBottom: '4px'
                }}
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        {/* Botões direita + hamburguer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isAuthenticated ? (
            <button
              onClick={() => setCurrentView('admin')}
              className="btn btn-ruby btn-sm"
              style={{ padding: '8px 14px', fontSize: '0.86rem' }}
            >
              <LogIn size={15} />
              <span className="hide-mobile">Login</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentView === 'site' ? (
                <button onClick={() => setCurrentView('admin')} className="btn btn-ruby btn-sm" style={{ padding: '8px 12px', fontSize: '0.84rem' }}>
                  <LayoutDashboard size={14} />
                  <span className="hide-mobile">Painel</span>
                </button>
              ) : (
                <button onClick={() => setCurrentView('site')} className="btn btn-secondary btn-sm" style={{ padding: '8px 12px', fontSize: '0.84rem' }}>
                  <Globe size={14} color="#38BDF8" />
                  <span className="hide-mobile">Ver Site</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                style={{ padding: '8px 10px', color: '#F87171' }}
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

          {/* Botão hamburguer — só mobile */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none', border: 'none',
              color: '#FFFFFF', cursor: 'pointer', padding: '6px'
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {menuOpen && (
        <nav style={{
          backgroundColor: '#070b16',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '12px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {navLinks.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: '#CBD5E1', textDecoration: 'none',
                  fontSize: '1rem', fontWeight: 500,
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: 'none', border: 'none', textAlign: 'left',
                  color: '#FFFFFF', cursor: 'pointer',
                  fontSize: '1rem', fontWeight: 600,
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                {link.label}
              </button>
            )
          )}
        </nav>
      )}
    </header>
  );
}
