import React, { useState } from 'react';
import { X, Lock, User, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: usuario.trim(),
      password: senha,
    });
    setLoading(false);
    if (error) {
      setErro('Usuário ou senha incorretos.');
    } else {
      onLoginSuccess();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        {/* Topo do Modal */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '22px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'rgba(200, 30, 61, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(200, 30, 61, 0.3)'
            }}>
              <Shield size={20} color="#C81E3D" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Acesso Restrito</h3>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Painel do Contador Y7 Service</div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '6px',
            padding: '10px 14px',
            color: '#F87171',
            fontSize: '0.86rem',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{erro}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="#38BDF8" />
              <span>Usuário</span>
            </label>
            <input 
              type="text" 
              required 
              autoFocus
              className="form-control" 
              placeholder="Digite seu usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} color="#C81E3D" />
              <span>Senha</span>
            </label>
            <input 
              type="password" 
              required 
              className="form-control" 
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-ruby btn-block"
            style={{ padding: '14px', fontSize: '1rem' }}
            disabled={loading}
          >
            <CheckCircle2 size={18} />
            <span>{loading ? 'Entrando...' : 'Entrar no Painel do Contador'}</span>
          </button>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.78rem', color: '#64748B' }}>
            Ambiente seguro com criptografia e conformidade tributária Y7.
          </div>
        </form>
      </div>
    </div>
  );
}
