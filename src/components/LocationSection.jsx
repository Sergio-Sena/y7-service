import React, { useState } from 'react';
import { MapPin, Mail, Send, Building2, CheckCircle2, MessageCircle } from 'lucide-react';
import { Y7_INFO } from '../data/initialData';

export default function LocationSection() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    regime: 'Simples Nacional',
    mensagem: ''
  });

  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <section id="localizacao" style={{ padding: '60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: '#FFFFFF', marginBottom: '10px' }}>
            Atendimento & Solicitação de Proposta
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '1.02rem', lineHeight: 1.6 }}>
            Envie sua mensagem ou inicie uma conversa imediata pelo WhatsApp Web com nossos contadores.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {/* Card Institucional */}
          <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(200, 30, 61, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Building2 size={22} color="#C81E3D" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>{Y7_INFO.razaoSocial}</h3>
                  <div style={{ fontSize: '0.82rem', color: '#38BDF8', fontWeight: 600 }}>
                    CNPJ: {Y7_INFO.cnpj} • Porte {Y7_INFO.porte}
                  </div>
                </div>
              </div>

              {/* Informações de Contato */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <MapPin size={20} color="#C81E3D" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.96rem' }}>
                      {Y7_INFO.endereco.logradouro} - {Y7_INFO.endereco.complemento}
                    </div>
                    <div style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>
                      {Y7_INFO.endereco.bairro}
                    </div>
                    <div style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>
                      {Y7_INFO.endereco.municipio} - {Y7_INFO.endereco.uf} • CEP: {Y7_INFO.endereco.cep}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Mail size={18} color="#38BDF8" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>E-mail Contábil</div>
                    <a href={`mailto:${Y7_INFO.contatos.email}`} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600, fontSize: '0.94rem' }}>
                      {Y7_INFO.contatos.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Ação Direta no WhatsApp Web */}
            <div>
              <div style={{
                padding: '12px 16px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.86rem',
                color: '#CBD5E1',
                marginBottom: '14px'
              }}>
                <strong>Constituição da Empresa:</strong> {Y7_INFO.dataConstituicao}
              </div>

              <a
                href={`https://wa.me/${Y7_INFO.contatos.whatsappRaw}?text=${encodeURIComponent('Olá, gostaria de falar com a equipe contábil da Y7 Service.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-blue btn-block"
                style={{ padding: '14px', fontSize: '0.94rem' }}
              >
                <MessageCircle size={17} color="#10B981" />
                <span>Conversar pelo WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Formulário de Coleta de Proposta */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '6px' }}>
              Solicitar Proposta
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.92rem', marginBottom: '20px' }}>
              Preencha os campos para receber uma proposta personalizada da Y7 Service.
            </p>

            {enviado ? (
              <div style={{
                textAlign: 'center',
                padding: '32px 18px',
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.35)'
              }}>
                <CheckCircle2 size={40} color="#10B981" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ color: '#FFFFFF', fontSize: '1.15rem', marginBottom: '6px' }}>Proposta Solicitada!</h4>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem' }}>
                  Nossa equipe contábil entrará em contato em breve com você.
                </p>
                <button 
                  onClick={() => setEnviado(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '16px' }}
                >
                  Enviar Nova Solicitação
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Nome Completo</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control" 
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Telefone / WhatsApp</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-control" 
                      placeholder="(11) 99999-9999"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input 
                      type="email" 
                      required 
                      className="form-control" 
                      placeholder="seu.email@empresa.com.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Empresa ou CNPJ</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Razão Social ou CNPJ"
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Regime Tributário</label>
                  <select 
                    className="form-control"
                    value={formData.regime}
                    onChange={(e) => setFormData({ ...formData, regime: e.target.value })}
                  >
                    <option value="Simples Nacional">Simples Nacional</option>
                    <option value="Lucro Presumido">Lucro Presumido</option>
                    <option value="Lucro Real">Lucro Real</option>
                    <option value="Nova Empresa / Abertura">Nova Empresa / Abertura</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mensagem (Opcional)</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Conte sobre sua necessidade contábil..."
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  />
                </div>

                {/* 1 Botão só para Coletar */}
                <button 
                  type="submit" 
                  className="btn btn-ruby btn-block" 
                  style={{ padding: '15px 20px', fontSize: '0.98rem', marginTop: '6px' }}
                >
                  <Send size={17} />
                  <span>Enviar Solicitação de Proposta</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
