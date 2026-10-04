import React, { useState } from 'react';
import { Check, MessageCircle } from 'lucide-react';
import { Y7_INFO } from '../data/initialData';

export default function TaxSimulator() {
  const [faturamentoMensal, setFaturamentoMensal] = useState(100000);
  const [segmento, setSegmento] = useState('servicos'); // servicos, comercio, industria
  const [folhaMensal, setFolhaMensal] = useState(28000);
  const [margemLucro, setMargemLucro] = useState(25);

  const faturamentoAnual = faturamentoMensal * 12;
  const folhaAnual = folhaMensal * 12;
  const lucroAnualEstimado = faturamentoAnual * (margemLucro / 100);

  // Cálculo Simples Nacional
  const calcularSimples = () => {
    let aliquota = 0.08;
    if (segmento === 'comercio') {
      if (faturamentoAnual <= 360000) aliquota = 0.04;
      else if (faturamentoAnual <= 1800000) aliquota = 0.085;
      else aliquota = 0.125;
    } else if (segmento === 'servicos') {
      const fatorR = folhaAnual / faturamentoAnual;
      if (fatorR >= 0.28) {
        aliquota = faturamentoAnual <= 1800000 ? 0.095 : 0.145;
      } else {
        aliquota = faturamentoAnual <= 1800000 ? 0.165 : 0.205;
      }
    } else {
      aliquota = 0.09;
    }
    return faturamentoAnual * aliquota;
  };

  // Cálculo Lucro Presumido
  const calcularPresumido = () => {
    if (segmento === 'servicos') {
      const baseIR = faturamentoAnual * 0.32;
      const irpj = baseIR * 0.15 + (baseIR > 240000 ? (baseIR - 240000) * 0.10 : 0);
      const csll = baseIR * 0.09;
      const pisCofins = faturamentoAnual * 0.0365;
      const iss = faturamentoAnual * 0.03;
      const inssFolha = folhaAnual * 0.28;
      return irpj + csll + pisCofins + iss + inssFolha;
    } else {
      const baseIR = faturamentoAnual * 0.08;
      const irpj = baseIR * 0.15;
      const csll = (faturamentoAnual * 0.12) * 0.09;
      const pisCofins = faturamentoAnual * 0.0365;
      const icms = faturamentoAnual * 0.04;
      const inssFolha = folhaAnual * 0.28;
      return irpj + csll + pisCofins + icms + inssFolha;
    }
  };

  // Cálculo Lucro Real
  const calcularReal = () => {
    const irpj = lucroAnualEstimado * 0.15 + (lucroAnualEstimado > 240000 ? (lucroAnualEstimado - 240000) * 0.10 : 0);
    const csll = lucroAnualEstimado * 0.09;
    const pisCofinsLiquido = faturamentoAnual * 0.045;
    const tributosIndiretos = segmento === 'servicos' ? faturamentoAnual * 0.03 : faturamentoAnual * 0.04;
    const inssFolha = folhaAnual * 0.28;
    return irpj + csll + pisCofinsLiquido + tributosIndiretos + inssFolha;
  };

  const impostoSimples = calcularSimples();
  const impostoPresumido = calcularPresumido();
  const impostoReal = calcularReal();

  const valores = [
    { regime: 'Simples Nacional', valor: impostoSimples },
    { regime: 'Lucro Presumido', valor: impostoPresumido },
    { regime: 'Lucro Real', valor: impostoReal }
  ];

  valores.sort((a, b) => a.valor - b.valor);
  const regimeIdeal = valores[0];
  const piorRegime = valores[valores.length - 1];
  const economiaAnual = piorRegime.valor - regimeIdeal.valor;

  const formatBRL = (num) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);

  const mensagemWhatsApp = encodeURIComponent(
    `Olá, equipe Y7 Service!\n` +
    `Fiz uma simulação no site para minha empresa:\n` +
    `• Faturamento Mensal: ${formatBRL(faturamentoMensal)}\n` +
    `• Atividade: ${segmento.toUpperCase()}\n` +
    `• Folha Mensal: ${formatBRL(folhaMensal)}\n` +
    `• Regime mais econômico no simulador: ${regimeIdeal.regime} (Diferença estimada de até ${formatBRL(economiaAnual)}/ano)\n\n` +
    `Gostaria de falar com um contador para validar o planejamento fiscal.`
  );

  return (
    <section id="simulador" style={{ padding: '70px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 36px auto' }}>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)', color: '#FFFFFF', marginBottom: '12px' }}>
            Simulador de Regime Tributário
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Compare a estimativa de carga tributária entre Simples Nacional, Lucro Presumido e Lucro Real.
          </p>
        </div>

        {/* Card do Simulador */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}>
            {/* Controles */}
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '20px' }}>
                Dados da Empresa
              </h3>

              {/* Segmento */}
              <div className="form-group">
                <label className="form-label">Ramo de Atividade</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'servicos', label: 'Serviços' },
                    { id: 'comercio', label: 'Comércio' },
                    { id: 'industria', label: 'Indústria' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSegmento(s.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        border: segmento === s.id ? '2px solid #C81E3D' : '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: segmento === s.id ? 'rgba(200, 30, 61, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '0.94rem',
                        cursor: 'pointer'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faturamento */}
              <div className="form-group" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Faturamento Mensal Estimado</label>
                  <span className="mono" style={{ color: '#38BDF8', fontWeight: 700, fontSize: '1.05rem' }}>
                    {formatBRL(faturamentoMensal)}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="20000" 
                  max="1000000" 
                  step="10000"
                  value={faturamentoMensal}
                  onChange={(e) => setFaturamentoMensal(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#C81E3D', height: '6px', cursor: 'pointer' }}
                />
              </div>

              {/* Folha */}
              <div className="form-group" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Folha Salarial + Pró-Labore</label>
                  <span className="mono" style={{ color: '#10B981', fontWeight: 700, fontSize: '1.05rem' }}>
                    {formatBRL(folhaMensal)}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="3000" 
                  max="300000" 
                  step="2000"
                  value={folhaMensal}
                  onChange={(e) => setFolhaMensal(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10B981', height: '6px', cursor: 'pointer' }}
                />
              </div>

              {/* Margem */}
              <div className="form-group" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Margem Líquida Estimada</label>
                  <span className="mono" style={{ color: '#F59E0B', fontWeight: 700, fontSize: '1.05rem' }}>
                    {margemLucro}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="1"
                  value={margemLucro}
                  onChange={(e) => setMargemLucro(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#F59E0B', height: '6px', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Resultado */}
            <div style={{
              backgroundColor: '#0a1020',
              borderRadius: '10px',
              padding: '28px',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.16)',
                color: '#34D399',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.86rem',
                fontWeight: 700,
                marginBottom: '16px'
              }}>
                <Check size={16} />
                <span>REGIME MAIS ECONÔMICO: {regimeIdeal.regime.toUpperCase()}</span>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '0.92rem', color: '#CBD5E1' }}>
                  Diferença Anual Estimada:
                </div>
                <div className="mono" style={{
                  fontSize: 'clamp(1.7rem, 2.8vw, 2.2rem)',
                  fontWeight: 800,
                  color: '#10B981',
                  marginTop: '4px'
                }}>
                  {formatBRL(economiaAnual)} / ano
                </div>
              </div>

              {/* Comparativo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {valores.map((v, i) => (
                  <div 
                    key={v.regime}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      backgroundColor: i === 0 ? 'rgba(16, 185, 129, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                      border: i === 0 ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: i === 0 ? '#34D399' : '#FFFFFF' }}>
                        {v.regime} {i === 0 && '⭐'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                        Alíquota média calculada: {((v.valor / faturamentoAnual) * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="mono" style={{ fontWeight: 700, fontSize: '1rem', color: i === 0 ? '#34D399' : '#FFFFFF' }}>
                      {formatBRL(v.valor)}/ano
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão de Ponta a Ponta com Espaçamento Correto */}
              <a
                href={`https://wa.me/${Y7_INFO.contatos.whatsappRaw}?text=${mensagemWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ruby btn-block"
                style={{ padding: '15px 20px', fontSize: '1rem' }}
              >
                <MessageCircle size={18} />
                <span>Enviar Simulação para Análise no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
