import React from 'react';
import { Send, ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById('localizacao')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      position: 'relative',
      padding: '50px 0 40px 0'
    }}>
      <div className="container">
        <div className="hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'center'
        }}>
          {/* Lado Esquerdo: Mensagem e Apenas 1 Botão para Coletar Lead */}
          <div>
            <h1 style={{
              fontSize: 'clamp(2.1rem, 3.8vw, 3.1rem)',
              lineHeight: 1.2,
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '18px'
            }}>
              Contabilidade Estratégica, Gestão Societária e <span style={{ color: '#C81E3D' }}>Blindagem Tributária</span>.
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#E2E8F0',
              lineHeight: 1.65,
              marginBottom: '28px',
              maxWidth: '560px'
            }}>
              Assessoria contábil de precisão para empresas no <strong style={{ color: '#FFFFFF' }}>Simples Nacional, Lucro Presumido e Lucro Real</strong>. 
              Elaboração de demonstrações contábeis (DRE e Balanço Patrimonial), alterações contratuais ágeis e cumprimento rigoroso das obrigações fiscais.
            </p>

            {/* Apenas 1 Botão para Coleta de Lead */}
            <div className="hero-buttons" style={{ maxWidth: '340px' }}>
              <button 
                onClick={scrollToContact}
                className="btn btn-ruby btn-block"
                style={{ padding: '16px 26px', fontSize: '1.02rem' }}
              >
                <Send size={18} />
                <span>Solicitar Proposta Contábil</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Lado Direito: Logo Puro e Limpo */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="hero-logo-box" style={{
              width: '100%',
              maxWidth: '400px',
              borderRadius: '14px',
              overflow: 'hidden',
              backgroundColor: '#0a0f1d',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
            }}>
              <img 
                src="/assets/y7_logo_emblema.jpg" 
                alt="Y7 Empresarial"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
