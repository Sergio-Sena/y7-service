import React from 'react';
import { MapPin, Mail, ArrowUp, MessageCircle, LogIn } from 'lucide-react';
import { Y7_INFO } from '../data/initialData';

export default function Footer({ onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: '#04070e',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '45px 0 20px 0',
      color: '#CBD5E1',
      fontSize: '0.92rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
          marginBottom: '36px'
        }}>
          {/* Coluna 1: Empresa & Identidade */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1.5px solid #C81E3D',
                backgroundColor: '#0a0f1d'
              }}>
                <img 
                  src="/assets/y7_logo_emblema.jpg" 
                  alt="Y7 Service" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <span style={{ fontSize: '1.22rem', fontWeight: 800, color: '#FFFFFF' }}>
                Y7 <span style={{ color: '#C81E3D' }}>SERVICE</span>
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '14px', color: '#CBD5E1' }}>
              Assessoria contábil, gestão tributária e societária para empresas no Simples Nacional, Lucro Presumido e Lucro Real.
            </p>

            <div style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.6 }}>
              <strong>Razão Social:</strong> {Y7_INFO.razaoSocial}<br />
              <strong>CNPJ:</strong> {Y7_INFO.cnpj} • Porte {Y7_INFO.porte}
            </div>
          </div>

          {/* Coluna 2: Serviços Contábeis */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '12px' }}>
              Serviços Oferecidos
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li>Alteração Contratual (JUCESP/RFB)</li>
              <li>Balanço Patrimonial & DRE Gerencial</li>
              <li>Planejamento Tributário & Fator R</li>
              <li>Obrigações Acessórias (SPED, DCTFWeb, PGDAS)</li>
              <li>Folha de Pagamento & eSocial</li>
              <li>Abertura e Regularização de Empresas</li>
            </ul>
          </div>

          {/* Coluna 3: Acesso Restrito */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '12px' }}>
              Acesso Restrito
            </h4>
            <p style={{ fontSize: '0.86rem', marginBottom: '14px', color: '#CBD5E1', lineHeight: 1.6 }}>
              Acompanhamento de clientes, protocolos de transmissão e integração com o Google Agenda.
            </p>
            <button
              onClick={onOpenAdmin}
              className="btn btn-secondary btn-block"
              style={{ padding: '12px 16px', fontSize: '0.9rem' }}
            >
              <LogIn size={15} color="#38BDF8" />
              <span>Login</span>
            </button>
          </div>

          {/* Coluna 4 (ÚLTIMA COLUNA): Endereço, E-mail e Botão WhatsApp Web sem mostrar número */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '12px' }}>
              Localização & Contato
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              {/* Endereço */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={18} color="#C81E3D" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#E2E8F0', lineHeight: 1.5 }}>
                  {Y7_INFO.endereco.logradouro} - {Y7_INFO.endereco.complemento}<br />
                  {Y7_INFO.endereco.bairro}<br />
                  {Y7_INFO.endereco.municipio}/{Y7_INFO.endereco.uf} - CEP {Y7_INFO.endereco.cep}
                </span>
              </div>

              {/* E-mail */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} color="#38BDF8" style={{ flexShrink: 0 }} />
                <a href={`mailto:${Y7_INFO.contatos.email}`} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}>
                  {Y7_INFO.contatos.email}
                </a>
              </div>

              {/* Botão para WhatsApp Web Direto sem mostrar número */}
              <a
                href={`https://wa.me/${Y7_INFO.contatos.whatsappRaw}?text=${encodeURIComponent('Olá, gostaria de falar com a equipe contábil da Y7 Service.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ruby btn-block"
                style={{ padding: '13px 18px', fontSize: '0.94rem', marginTop: '4px' }}
              >
                <MessageCircle size={17} />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Linha Inferior com Copyright e Voltar ao Topo */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem'
        }}>
          <div>
            © {new Date().getFullYear()} Y7 SERVICE LTDA. CNPJ: {Y7_INFO.cnpj}. Todos os direitos reservados.
          </div>

          <button
            onClick={scrollToTop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            <span>Voltar ao topo</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
