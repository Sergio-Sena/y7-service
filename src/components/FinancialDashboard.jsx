import React from 'react';
import { Cpu, TrendingUp, ShieldCheck, Activity } from 'lucide-react';
import { DASHBOARD_METRICS } from '../data/initialData';

export default function FinancialDashboard() {
  const formatBRL = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const maxReceita = Math.max(...DASHBOARD_METRICS.evolucaoMensal.map(m => m.receita));

  return (
    <section id="dashboard-contabil" style={{ padding: '60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        {/* Cabeçalho com Aspecto Tecnológico */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38BDF8',
            padding: '5px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '12px'
          }}>
            <Cpu size={14} color="#00F5D4" />
            <span>TECNOLOGIA CONTÁBIL & GESTÃO DE DADOS</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: '#FFFFFF', marginBottom: '10px' }}>
            Indicadores & Demonstrativos Financeiros
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '1.02rem', lineHeight: 1.6 }}>
            Painel ilustrativo de acompanhamento: DRE em tempo real, liquidez patrimonial e gestão de custos da sua empresa com inteligência tributária.
          </p>
        </div>

        {/* Grade de Cards de KPIs Tecnológicos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
          marginBottom: '26px'
        }}>
          {DASHBOARD_METRICS.kpis.map((kpi, index) => (
            <div 
              key={index}
              className="glass-panel"
              style={{
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, rgba(14, 22, 38, 0.95) 0%, rgba(8, 14, 26, 0.9) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.18)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {kpi.label}
                </span>
                <Activity size={14} color={index === 0 ? '#00F5D4' : index === 2 ? '#10B981' : '#38BDF8'} />
              </div>

              <div className="mono" style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: index === 0 ? '#00F5D4' : index === 2 ? '#34D399' : '#FFFFFF',
                margin: '8px 0',
                textShadow: index === 0 ? '0 0 16px rgba(0, 245, 212, 0.35)' : 'none'
              }}>
                {kpi.isIndex ? kpi.valor.toFixed(2) : formatBRL(kpi.valor)}
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                color: index === 2 ? '#10B981' : '#38BDF8',
                fontWeight: 700,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                <TrendingUp size={13} />
                <span>{kpi.variacao}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico Tecnológico de DRE e Composição */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '22px',
          marginBottom: '26px'
        }}>
          {/* Gráfico 1: Barras Tech com Glow e Grid Cibernético */}
          <div className="glass-panel" style={{
            padding: '24px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(13, 21, 39, 0.95) 0%, rgba(7, 12, 22, 0.98) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Evolução Periódica de Faturamento & Resultado</span>
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#38BDF8' }}>
                  Processamento analítico DRE
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', fontSize: '0.76rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#00F5D4' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#00F5D4', borderRadius: '2px', boxShadow: '0 0 6px #00F5D4' }} />
                  Receita
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10B981' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '2px', boxShadow: '0 0 6px #10B981' }} />
                  Lucro Líquido
                </span>
              </div>
            </div>

            {/* Container das Barras com Grid Tech */}
            <div className="chart-bars-container" style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '175px',
              paddingTop: '15px',
              borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
              position: 'relative',
              backgroundImage: 'linear-gradient(to top, rgba(56, 189, 248, 0.05) 1px, transparent 1px)',
              backgroundSize: '100% 35px',
              gap: '6px'
            }}>
              {DASHBOARD_METRICS.evolucaoMensal.map((item) => {
                const heightReceita = Math.round((item.receita / maxReceita) * 140);
                const heightLucro = Math.round((item.lucro / maxReceita) * 140);

                return (
                  <div 
                    key={item.mes}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      minWidth: '24px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '140px' }}>
                      {/* Barra Faturamento Tech */}
                      <div 
                        title={`Receita em ${item.mes}: ${formatBRL(item.receita)}`}
                        style={{
                          width: '11px',
                          height: `${heightReceita}px`,
                          background: 'linear-gradient(180deg, #00F5D4 0%, #0088FF 100%)',
                          borderRadius: '2px 2px 0 0',
                          boxShadow: '0 0 8px rgba(0, 245, 212, 0.4)'
                        }}
                      />
                      {/* Barra Lucro Líquido Tech */}
                      <div 
                        title={`Lucro em ${item.mes}: ${formatBRL(item.lucro)}`}
                        style={{
                          width: '11px',
                          height: `${heightLucro}px`,
                          background: 'linear-gradient(180deg, #34D399 0%, #059669 100%)',
                          borderRadius: '2px 2px 0 0',
                          boxShadow: '0 0 8px rgba(52, 211, 153, 0.4)'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>
                      {item.mes}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.82rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00F5D4', boxShadow: '0 0 8px #00F5D4' }} />
              <span>Dados estruturados para planejamento estratégico de tributação e fluxo de caixa.</span>
            </div>
          </div>

          {/* Gráfico 2: Composição Tech de Custos */}
          <div className="glass-panel" style={{
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'linear-gradient(180deg, rgba(13, 21, 39, 0.95) 0%, rgba(7, 12, 22, 0.98) 100%)'
          }}>
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '4px' }}>
              Composição da Carga de Custos & Impostos
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '18px' }}>
              Distribuição percentual das saídas operacionais
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {DASHBOARD_METRICS.composicaoDespesas.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '5px' }}>
                    <span style={{ color: '#FFFFFF' }}>{item.categoria}</span>
                    <span className="mono" style={{ color: item.cor, fontWeight: 700 }}>
                      {item.percentual}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.percentual * 1.8}%`,
                      maxWidth: '100%',
                      height: '100%',
                      backgroundColor: item.cor,
                      borderRadius: '9999px',
                      boxShadow: `0 0 8px ${item.cor}88`
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '20px',
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0, 245, 212, 0.06)',
              border: '1px solid rgba(0, 245, 212, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              color: '#00F5D4'
            }}>
              <ShieldCheck size={16} style={{ flexShrink: 0 }} />
              <span>Simulações para otimização da carga tributária em conformidade com o Fisco.</span>
            </div>
          </div>
        </div>

        {/* Estrutura do Balanço Patrimonial */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.18rem', color: '#FFFFFF' }}>
                Balanço Patrimonial & Saúde Financeira
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                Ativo Total, Obrigações e Patrimônio Líquido apurados
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '5px 12px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>Liquidez: </span>
                <strong style={{ color: '#10B981', fontSize: '0.88rem' }}>{DASHBOARD_METRICS.balancoEstrutural.indiceLiquidez}</strong>
              </div>

              <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '5px 12px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>Endividamento: </span>
                <strong style={{ color: '#38BDF8', fontSize: '0.88rem' }}>{DASHBOARD_METRICS.balancoEstrutural.endividamentoGeral}</strong>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', padding: '16px' }}>
              <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>ATIVO TOTAL (BENS & DIREITOS)</div>
              <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>{formatBRL(DASHBOARD_METRICS.balancoEstrutural.ativoTotal)}</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>Disponibilidades em caixa, clientes e imobilizado</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', padding: '16px' }}>
              <div style={{ color: '#F87171', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>PASSIVO CIRCULANTE</div>
              <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>{formatBRL(DASHBOARD_METRICS.balancoEstrutural.passivoCirculante)}</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>Obrigações operacionais, fornecedores e eSocial</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '16px' }}>
              <div style={{ color: '#34D399', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>PATRIMÔNIO LÍQUIDO DOS SÓCIOS</div>
              <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34D399' }}>{formatBRL(DASHBOARD_METRICS.balancoEstrutural.patrimonioLiquido)}</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>Capital social e lucros prontos para distribuição</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
