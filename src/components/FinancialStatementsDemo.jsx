import React, { useState } from 'react';
import { BarChart2, Layers, Printer } from 'lucide-react';
import { SAMPLE_DRE_DATA, SAMPLE_BALANCO_DATA } from '../data/initialData';

export default function FinancialStatementsDemo() {
  const [activeTab, setActiveTab] = useState('dre');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <section id="demonstrativos" style={{ padding: '70px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 36px auto' }}>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)', color: '#FFFFFF', marginBottom: '12px' }}>
            Demonstrações Contábeis: Balanço & DRE
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Relatórios contábeis com alto nível de detalhamento e conciliação, essenciais para tomada de decisões, auditorias e linhas de crédito empresariais.
          </p>
        </div>

        {/* Botões de Seleção de Demonstrativo com Espaçamento Correto */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '14px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('dre')}
            className="btn"
            style={{
              backgroundColor: activeTab === 'dre' ? '#C81E3D' : 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: activeTab === 'dre' ? '1px solid #C81E3D' : '1px solid rgba(255, 255, 255, 0.15)',
              padding: '12px 24px',
              fontSize: '0.96rem'
            }}
          >
            <BarChart2 size={18} />
            <span>Demonstração do Resultado (DRE)</span>
          </button>

          <button
            onClick={() => setActiveTab('balanco')}
            className="btn"
            style={{
              backgroundColor: activeTab === 'balanco' ? '#C81E3D' : 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: activeTab === 'balanco' ? '1px solid #C81E3D' : '1px solid rgba(255, 255, 255, 0.15)',
              padding: '12px 24px',
              fontSize: '0.96rem'
            }}
          >
            <Layers size={18} />
            <span>Balanço Patrimonial</span>
          </button>
        </div>

        {/* Card do Relatório */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {/* Topo do Relatório */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF' }}>
                {activeTab === 'dre' ? 'Demonstração do Resultado do Exercício (DRE)' : 'Balanço Patrimonial'}
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '4px' }}>
                Estrutura contábil oficial com conciliação analítica e sintética
              </div>
            </div>

            <button 
              onClick={() => window.print()}
              className="btn btn-secondary btn-sm"
            >
              <Printer size={15} />
              <span>Imprimir Relatório</span>
            </button>
          </div>

          {/* DRE */}
          {activeTab === 'dre' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SAMPLE_DRE_DATA.linhas.map((linha, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: linha.superDestaque ? '16px 20px' : linha.destaque ? '12px 18px' : '10px 18px',
                    borderRadius: '6px',
                    backgroundColor: linha.superDestaque 
                      ? 'rgba(200, 30, 61, 0.2)' 
                      : linha.destaque 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'transparent',
                    border: linha.superDestaque 
                      ? '1px solid rgba(200, 30, 61, 0.45)' 
                      : 'none',
                    fontWeight: linha.destaque ? 700 : 400
                  }}
                >
                  <span style={{
                    color: linha.superDestaque ? '#FFFFFF' : linha.destaque ? '#FFFFFF' : '#CBD5E1',
                    fontSize: linha.superDestaque ? '1.1rem' : linha.destaque ? '1rem' : '0.94rem',
                    paddingLeft: linha.tipo === 'analitico' ? '22px' : '0'
                  }}>
                    {linha.descricao}
                  </span>

                  <span className="mono" style={{
                    color: linha.valor < 0 ? '#EF4444' : linha.superDestaque ? '#34D399' : '#FFFFFF',
                    fontSize: linha.superDestaque ? '1.25rem' : '0.98rem',
                    fontWeight: linha.destaque ? 700 : 500
                  }}>
                    {formatCurrency(linha.valor)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Balanço */}
          {activeTab === 'balanco' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {/* Ativo */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                padding: '22px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <h4 style={{ color: '#38BDF8', fontSize: '1.15rem' }}>ATIVO TOTAL</h4>
                  <span className="mono" style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.15rem' }}>
                    {formatCurrency(656300)}
                  </span>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Ativo Circulante
                  </div>
                  {SAMPLE_BALANCO_DATA.ativo.circulante.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '0.92rem', color: '#E2E8F0' }}>
                      <span>{item.conta}</span>
                      <span className="mono">{formatCurrency(item.valor)}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Ativo Não Circulante (Imobilizado)
                  </div>
                  {SAMPLE_BALANCO_DATA.ativo.naoCirculante.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '0.92rem', color: '#E2E8F0' }}>
                      <span>{item.conta}</span>
                      <span className="mono" style={{ color: item.valor < 0 ? '#EF4444' : 'inherit' }}>
                        {formatCurrency(item.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passivo e PL */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                padding: '22px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(200, 30, 61, 0.35)' }}>
                  <h4 style={{ color: '#F87171', fontSize: '1.15rem' }}>PASSIVO E PATRIMÔNIO LÍQUIDO</h4>
                  <span className="mono" style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.15rem' }}>
                    {formatCurrency(656300)}
                  </span>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Passivo Circulante
                  </div>
                  {SAMPLE_BALANCO_DATA.passivo.circulante.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '0.92rem', color: '#E2E8F0' }}>
                      <span>{item.conta}</span>
                      <span className="mono">{formatCurrency(item.valor)}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Patrimônio Líquido
                  </div>
                  {SAMPLE_BALANCO_DATA.passivo.patrimonioLiquido.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '0.92rem', color: '#E2E8F0' }}>
                      <span>{item.conta}</span>
                      <span className="mono" style={{ color: '#34D399', fontWeight: 600 }}>
                        {formatCurrency(item.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
