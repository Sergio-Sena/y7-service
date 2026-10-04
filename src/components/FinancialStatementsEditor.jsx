import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Printer, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  BarChart2, 
  Building2, 
  Download,
  Eye
} from 'lucide-react';
import { Y7_INFO } from '../data/initialData';

export default function FinancialStatementsEditor({ clients }) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || 'cli-y7');
  const [isEditing, setIsEditing] = useState(true); // Aberto por padrão para injeção imediata
  const [reportType, setReportType] = useState('unificado'); // 'dre', 'balanco', 'unificado' (unificado por padrão)
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0] || {
    razaoSocial: Y7_INFO.razaoSocial,
    cnpj: Y7_INFO.cnpj,
    regime: "Lucro Presumido"
  };

  // Estado dos dados contábeis editáveis por cliente
  const [financialData, setFinancialData] = useState(() => {
    const saved = localStorage.getItem(`y7_fin_${selectedClientId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      periodo: "Exercício de 2026",
      dre: {
        receitaBruta: 1850000,
        deducoesImpostos: 175750,
        custosOperacionais: 740000,
        despesasAdminPessoal: 380000,
        despesasComerciais: 45000,
        outrasReceitas: 15000,
        provisaoIrpjCsll: 65000
      },
      balanco: {
        disponibilidades: 312500,
        clientesReceber: 185200,
        estoquesOutros: 34100,
        imobilizadoTecnologia: 143000,
        depreciacaoAcumulada: 18500,
        fornecedores: 42300,
        obrigacoesTrabalhistas: 58400,
        tributosFederais: 36100,
        capitalSocial: 150000,
        reservasLucros: 85000,
        lucrosAcumulados: 303000
      }
    };
  });

  // Atualiza ao trocar de cliente
  useEffect(() => {
    const saved = localStorage.getItem(`y7_fin_${selectedClientId}`);
    if (saved) {
      try {
        setFinancialData(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setFinancialData({
      periodo: "Exercício de 2026",
      dre: {
        receitaBruta: 1850000,
        deducoesImpostos: 175750,
        custosOperacionais: 740000,
        despesasAdminPessoal: 380000,
        despesasComerciais: 45000,
        outrasReceitas: 15000,
        provisaoIrpjCsll: 65000
      },
      balanco: {
        disponibilidades: 312500,
        clientesReceber: 185200,
        estoquesOutros: 34100,
        imobilizadoTecnologia: 143000,
        depreciacaoAcumulada: 18500,
        fornecedores: 42300,
        obrigacoesTrabalhistas: 58400,
        tributosFederais: 36100,
        capitalSocial: 150000,
        reservasLucros: 85000,
        lucrosAcumulados: 303000
      }
    });
  }, [selectedClientId]);

  // Cálculos Automáticos da DRE
  const receitaLiquida = financialData.dre.receitaBruta - financialData.dre.deducoesImpostos;
  const lucroBruto = receitaLiquida - financialData.dre.custosOperacionais;
  const ebitda = lucroBruto - financialData.dre.despesasAdminPessoal - financialData.dre.despesasComerciais + financialData.dre.outrasReceitas;
  const lucroLiquido = ebitda - financialData.dre.provisaoIrpjCsll;

  // Cálculos Automáticos do Balanço
  const ativoCirculante = Number(financialData.balanco.disponibilidades) + Number(financialData.balanco.clientesReceber) + Number(financialData.balanco.estoquesOutros);
  const ativoNaoCirculante = Number(financialData.balanco.imobilizadoTecnologia) - Number(financialData.balanco.depreciacaoAcumulada);
  const totalAtivo = ativoCirculante + ativoNaoCirculante;

  const passivoCirculante = Number(financialData.balanco.fornecedores) + Number(financialData.balanco.obrigacoesTrabalhistas) + Number(financialData.balanco.tributosFederais);
  const patrimonioLiquido = Number(financialData.balanco.capitalSocial) + Number(financialData.balanco.reservasLucros) + Number(financialData.balanco.lucrosAcumulados);
  const totalPassivoPL = passivoCirculante + patrimonioLiquido;

  const handleSave = () => {
    localStorage.setItem(`y7_fin_${selectedClientId}`, JSON.stringify(financialData));
    setSaveSuccessMessage(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <div>
      {/* Controles de Topo (Ocultados na impressão) */}
      <div className="no-print" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: '16px 20px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>
              Selecionar Cliente
            </label>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.88rem' }}
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.razaoSocial} ({c.regime})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>
              Demonstrativo
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setReportType('dre')}
                className="btn btn-sm"
                style={{
                  backgroundColor: reportType === 'dre' ? '#C81E3D' : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF'
                }}
              >
                <BarChart2 size={14} />
                <span>DRE</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('balanco')}
                className="btn btn-sm"
                style={{
                  backgroundColor: reportType === 'balanco' ? '#C81E3D' : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF'
                }}
              >
                <Layers size={14} />
                <span>Balanço</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('unificado')}
                className="btn btn-sm"
                style={{
                  backgroundColor: reportType === 'unificado' ? '#C81E3D' : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF'
                }}
              >
                <span>DRE + Balanço</span>
              </button>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saveSuccessMessage && (
            <span style={{ color: '#10B981', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={16} /> Dados Salvos!
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-secondary btn-sm"
          >
            <FileEdit size={15} color="#38BDF8" />
            <span>{isEditing ? 'Fechar Edição' : 'Injetar / Editar Dados'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-ruby btn-sm"
            title="Abre o menu de impressão para imprimir ou salvar em PDF"
          >
            <Printer size={15} />
            <span>Imprimir / Salvar em PDF</span>
          </button>
        </div>
      </div>

      {/* Painel de Injeção e Edição de Dados (Oculto na impressão) */}
      {isEditing && (
        <div className="no-print glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '28px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileEdit size={18} />
              <span>Injetar Dados Financeiros: {selectedClient.razaoSocial}</span>
            </h3>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSave} className="btn btn-ruby btn-sm">
                <Save size={15} />
                <span>Salvar Informações</span>
              </button>
            </div>
          </div>

          <div className="form-group" style={{ maxWidth: '300px', marginBottom: '20px' }}>
            <label className="form-label">Período / Exercício Contábil</label>
            <input
              type="text"
              className="form-control"
              value={financialData.periodo}
              onChange={(e) => setFinancialData({ ...financialData, periodo: e.target.value })}
              placeholder="Ex: Exercício Findo em 2026"
            />
          </div>

          {/* Abas de Campos de Injeção */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {/* Bloco 1: Injeção DRE */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '18px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
                Dados da DRE (R$)
              </h4>

              <div className="form-group">
                <label className="form-label">Receita Bruta de Vendas e Serviços</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.dre.receitaBruta}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    dre: { ...financialData.dre, receitaBruta: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">(-) Deduções e Tributos sobre Serviços/Vendas</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.dre.deducoesImpostos}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    dre: { ...financialData.dre, deducoesImpostos: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">(-) Custos Operacionais / Insumos / CPV</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.dre.custosOperacionais}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    dre: { ...financialData.dre, custosOperacionais: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">(-) Despesas Administrativas & Pessoal</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.dre.despesasAdminPessoal}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    dre: { ...financialData.dre, despesasAdminPessoal: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">(-) Despesas Comerciais e Marketing</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.dre.despesasComerciais}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    dre: { ...financialData.dre, despesasComerciais: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">(+) Outras Receitas Operacionais</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.dre.outrasReceitas}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    dre: { ...financialData.dre, outrasReceitas: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">(-) Provisão para IRPJ e CSLL</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.dre.provisaoIrpjCsll}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    dre: { ...financialData.dre, provisaoIrpjCsll: Number(e.target.value) }
                  })}
                />
              </div>
            </div>

            {/* Bloco 2: Injeção Balanço Patrimonial */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '18px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
                Dados do Balanço Patrimonial (R$)
              </h4>

              <div style={{ fontSize: '0.8rem', color: '#38BDF8', fontWeight: 700, marginBottom: '6px' }}>ATIVO</div>
              <div className="form-group">
                <label className="form-label">Disponibilidades (Caixa & Bancos)</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.balanco.disponibilidades}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    balanco: { ...financialData.balanco, disponibilidades: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contas a Receber / Clientes</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.balanco.clientesReceber}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    balanco: { ...financialData.balanco, clientesReceber: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ativo Imobilizado (TI, Máquinas, Móveis)</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.balanco.imobilizadoTecnologia}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    balanco: { ...financialData.balanco, imobilizadoTecnologia: Number(e.target.value) }
                  })}
                />
              </div>

              <div style={{ fontSize: '0.8rem', color: '#F87171', fontWeight: 700, marginTop: '16px', marginBottom: '6px' }}>PASSIVO & PATRIMÔNIO LÍQUIDO</div>
              <div className="form-group">
                <label className="form-label">Fornecedores a Pagar</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.balanco.fornecedores}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    balanco: { ...financialData.balanco, fornecedores: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Obrigações Trabalhistas & Tributárias</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.balanco.obrigacoesTrabalhistas}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    balanco: { ...financialData.balanco, obrigacoesTrabalhistas: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Capital Social Subscrito</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.balanco.capitalSocial}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    balanco: { ...financialData.balanco, capitalSocial: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lucros Líquidos Acumulados</label>
                <input
                  type="number"
                  className="form-control mono"
                  value={financialData.balanco.lucrosAcumulados}
                  onChange={(e) => setFinancialData({
                    ...financialData,
                    balanco: { ...financialData.balanco, lucrosAcumulados: Number(e.target.value) }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Ações no Rodapé do Painel de Injeção */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '22px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
              Os totais do Ativo, Passivo, Receita Líquida e Lucro são recalculados automaticamente em tempo real.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSave} className="btn btn-ruby btn-sm">
                <Save size={15} />
                <span>Salvar Informações Injetadas</span>
              </button>

              <button onClick={handlePrint} className="btn btn-outline-blue btn-sm">
                <Printer size={15} />
                <span>Imprimir / Salvar em PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dica de Impressão e PDF */}
      <div className="no-print" style={{
        marginBottom: '16px',
        padding: '12px 16px',
        backgroundColor: 'rgba(56, 189, 248, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '0.86rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>📄</span>
          <span>
            <strong>Dica de Impressão / PDF:</strong> Ao clicar no botão <strong>"Imprimir / Salvar em PDF"</strong>, na tela de impressão do seu navegador, escolha como destino a opção <strong>"Salvar como PDF"</strong>. O documento é gerado automaticamente formatado em folha A4 com papel timbrado oficial da Y7 Service.
          </span>
        </div>

        <button onClick={handlePrint} className="btn btn-ruby btn-sm" style={{ flexShrink: 0 }}>
          <Printer size={15} />
          <span>Imprimir / Salvar em PDF</span>
        </button>
      </div>

      {/* ========================================================
          DOCUMENTO OFICIAL IMPRESSÍVEL (PAPEL TIMBRADO A4)
         ======================================================== */}
      <div 
        className="printable-report" 
        style={{
          backgroundColor: '#0a0f1d',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '36px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Cabeçalho do Papel Timbrado Oficial - Estritamente Y7 Service */}
        <div className="report-header" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderBottom: '2.5px solid #C81E3D',
          paddingBottom: '16px',
          marginBottom: '20px',
          gap: '8px'
        }}>
          {/* Logo e Nome da Y7 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '2px solid #C81E3D',
              backgroundColor: '#0a0f1d',
              flexShrink: 0
            }}>
              <img 
                src="/assets/y7_logo_emblema.jpg" 
                alt="Y7 Service" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                Y7 SERVICE LTDA
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Assessoria Contábil, Auditoria & Gestão Tributária Estratégica
              </div>
            </div>
          </div>

          {/* Dados Fiscais e Localização Y7 */}
          <div style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '2px' }}>
            <span><strong>CNPJ:</strong> {Y7_INFO.cnpj}</span>
            <span>•</span>
            <span><strong>Endereço:</strong> Av. Copacabana, 112 - Sala 1712, Alphaville - Barueri/SP</span>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            <span><strong>E-mail:</strong> {Y7_INFO.contatos.email}</span>
            <span>•</span>
            <span><strong>WhatsApp/Tel:</strong> {Y7_INFO.contatos.telefone}</span>
          </div>
        </div>

        {/* TÍTULO DO RELATÓRIO & PERÍODO */}
        <div style={{ textAlign: 'center', marginBottom: '22px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
            {reportType === 'dre' && 'Demonstração do Resultado do Exercício (DRE)'}
            {reportType === 'balanco' && 'Balanço Patrimonial Sintético'}
            {reportType === 'unificado' && 'Demonstrações Contábeis Oficiais: DRE & Balanço Patrimonial'}
          </h2>
          <div style={{ fontSize: '0.84rem', color: '#38BDF8', fontWeight: 600, marginTop: '4px' }}>
            {financialData.periodo} • Normas Brasileiras de Contabilidade (NBC TG / CFC) • Padrão IFRS
          </div>
        </div>

        {/* ========================================================
            TABELA DRE
           ======================================================== */}
        {(reportType === 'dre' || reportType === 'unificado') && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#38BDF8', marginBottom: '10px', textTransform: 'uppercase' }}>
              1. Demonstração do Resultado do Exercício (DRE)
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <tbody>
                <tr className="highlight-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>RECEITA BRUTA DE VENDAS E SERVIÇOS</td>
                  <td className="mono" style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700 }}>
                    {formatCurrency(financialData.dre.receitaBruta)}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '8px 14px 8px 30px', color: '#94A3B8' }}>(-) Deduções da Receita e Impostos sobre Faturamento</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>
                    - {formatCurrency(financialData.dre.deducoesImpostos)}
                  </td>
                </tr>

                <tr className="highlight-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>(=) RECEITA OPERACIONAL LÍQUIDA</td>
                  <td className="mono" style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#FFFFFF' }}>
                    {formatCurrency(receitaLiquida)}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '8px 14px 8px 30px', color: '#94A3B8' }}>(-) Custos dos Serviços Prestados / Insumos / CPV</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>
                    - {formatCurrency(financialData.dre.custosOperacionais)}
                  </td>
                </tr>

                <tr className="highlight-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>(=) LUCRO BRUTO OPERACIONAL</td>
                  <td className="mono" style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#FFFFFF' }}>
                    {formatCurrency(lucroBruto)}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '8px 14px 8px 30px', color: '#94A3B8' }}>(-) Despesas Administrativas e com Pessoal / Pró-Labore</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>
                    - {formatCurrency(financialData.dre.despesasAdminPessoal)}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '8px 14px 8px 30px', color: '#94A3B8' }}>(-) Despesas Comerciais e Operacionais</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>
                    - {formatCurrency(financialData.dre.despesasComerciais)}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '8px 14px 8px 30px', color: '#94A3B8' }}>(+) Outras Receitas Operacionais / Financeiras</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#10B981' }}>
                    + {formatCurrency(financialData.dre.outrasReceitas)}
                  </td>
                </tr>

                <tr className="highlight-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>(=) RESULTADO ANTES DOS TRIBUTOS (LAIR / EBITDA)</td>
                  <td className="mono" style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#FFFFFF' }}>
                    {formatCurrency(ebitda)}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '8px 14px 8px 30px', color: '#94A3B8' }}>(-) Provisão para IRPJ e CSLL</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>
                    - {formatCurrency(financialData.dre.provisaoIrpjCsll)}
                  </td>
                </tr>

                <tr className="super-highlight" style={{
                  backgroundColor: 'rgba(200, 30, 61, 0.2)',
                  border: '1px solid rgba(200, 30, 61, 0.5)'
                }}>
                  <td style={{ padding: '14px', fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>
                    (=) LUCRO LÍQUIDO DO EXERCÍCIO (DISPONÍVEL AOS SÓCIOS)
                  </td>
                  <td className="mono" style={{ padding: '14px', textAlign: 'right', fontWeight: 800, fontSize: '1.2rem', color: '#34D399' }}>
                    {formatCurrency(lucroLiquido)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================================
            TABELA BALANÇO PATRIMONIAL
           ======================================================== */}
        {(reportType === 'balanco' || reportType === 'unificado') && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#38BDF8', marginBottom: '10px', textTransform: 'uppercase' }}>
              2. Balanço Patrimonial (Ativo, Passivo & Patrimônio Líquido)
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {/* Coluna ATIVO */}
              <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '10px 14px', fontWeight: 700, color: '#38BDF8', display: 'flex', justifyContent: 'space-between' }}>
                  <span>ATIVO TOTAL</span>
                  <span className="mono">{formatCurrency(totalAtivo)}</span>
                </div>
                <div style={{ padding: '12px 14px', fontSize: '0.88rem' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>Ativo Circulante</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#94A3B8' }}>
                    <span>• Disponibilidades (Caixa e Bancos)</span>
                    <span className="mono">{formatCurrency(financialData.balanco.disponibilidades)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#94A3B8' }}>
                    <span>• Clientes / Contas a Receber</span>
                    <span className="mono">{formatCurrency(financialData.balanco.clientesReceber)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#94A3B8' }}>
                    <span>• Outros Créditos / Estoques</span>
                    <span className="mono">{formatCurrency(financialData.balanco.estoquesOutros)}</span>
                  </div>

                  <div style={{ fontWeight: 700, color: '#FFFFFF', marginTop: '12px', marginBottom: '6px' }}>Ativo Não Circulante</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#94A3B8' }}>
                    <span>• Imobilizado & Tecnologia</span>
                    <span className="mono">{formatCurrency(financialData.balanco.imobilizadoTecnologia)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#EF4444' }}>
                    <span>• (-) Depreciação Acumulada</span>
                    <span className="mono">- {formatCurrency(financialData.balanco.depreciacaoAcumulada)}</span>
                  </div>
                </div>
              </div>

              {/* Coluna PASSIVO & PL */}
              <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '10px 14px', fontWeight: 700, color: '#F87171', display: 'flex', justifyContent: 'space-between' }}>
                  <span>PASSIVO & PATRIMÔNIO LÍQUIDO</span>
                  <span className="mono">{formatCurrency(totalPassivoPL)}</span>
                </div>
                <div style={{ padding: '12px 14px', fontSize: '0.88rem' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>Passivo Circulante</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#94A3B8' }}>
                    <span>• Fornecedores a Pagar</span>
                    <span className="mono">{formatCurrency(financialData.balanco.fornecedores)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#94A3B8' }}>
                    <span>• Obrigações Trabalhistas & eSocial</span>
                    <span className="mono">{formatCurrency(financialData.balanco.obrigacoesTrabalhistas)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#94A3B8' }}>
                    <span>• Tributos Federais a Recolher</span>
                    <span className="mono">{formatCurrency(financialData.balanco.tributosFederais)}</span>
                  </div>

                  <div style={{ fontWeight: 700, color: '#10B981', marginTop: '12px', marginBottom: '6px' }}>Patrimônio Líquido</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#94A3B8' }}>
                    <span>• Capital Social Subscrito</span>
                    <span className="mono">{formatCurrency(financialData.balanco.capitalSocial)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#94A3B8' }}>
                    <span>• Reservas de Lucros</span>
                    <span className="mono">{formatCurrency(financialData.balanco.reservasLucros)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#34D399', fontWeight: 600 }}>
                    <span>• Lucros Líquidos Acumulados</span>
                    <span className="mono">{formatCurrency(financialData.balanco.lucrosAcumulados)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quadro de Assinaturas Formais (Exibido na impressão e tela) */}
        <div style={{
          paddingTop: '32px',
          borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
          marginTop: '36px'
        }}>
          {/* Data e Certificação Digital */}
          <div style={{ 
            fontSize: '0.82rem', 
            color: '#94A3B8', 
            lineHeight: 1.5,
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            Barueri - Alphaville/SP, {new Date().toLocaleDateString('pt-BR')} &nbsp;•&nbsp; 
            Certificação e Emissão Digital por <strong>Y7 SERVICE LTDA</strong> &nbsp;•&nbsp; 
            Responsabilidade Técnica Contábil Assegurada
          </div>

          {/* Linha das Assinaturas Rigorosamente na Mesma Altura */}
          <div className="signature-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '36px',
            alignItems: 'flex-start',
            maxWidth: '720px',
            margin: '0 auto'
          }}>
            {/* Assinatura Contador */}
            <div className="signature-col" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="signature-line" style={{ borderBottom: '1.5px solid #CBD5E1', marginBottom: '10px', width: '240px' }} />
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFFFFF' }}>Nilson / Contabilidade</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>Contador Responsável Técnico • CRC/SP</div>
              <div style={{ fontSize: '0.76rem', color: '#38BDF8', fontWeight: 600, marginTop: '2px' }}>Y7 SERVICE LTDA</div>
            </div>

            {/* Assinatura Administrador / Sócio */}
            <div className="signature-col" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="signature-line" style={{ borderBottom: '1.5px solid #CBD5E1', marginBottom: '10px', width: '240px' }} />
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFFFFF' }}>{selectedClient.responsavel || 'Administrador(a)'}</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>Sócio / Representante Legal</div>
              <div style={{ fontSize: '0.76rem', color: '#CBD5E1', fontWeight: 500, marginTop: '2px' }}>{selectedClient.razaoSocial}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
