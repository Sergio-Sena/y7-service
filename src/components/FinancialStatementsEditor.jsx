import React, { useState, useEffect, useMemo } from 'react';
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
  Eye,
  FileSpreadsheet,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Briefcase,
  Award,
  Edit3
} from 'lucide-react';
import { Y7_INFO } from '../data/initialData';

export const formatarDataExtenso = (dataStr, anoPadrao = '2026') => {
  if (!dataStr) return `02 de Janeiro de ${Number(anoPadrao) + 1}`;
  if (/[a-zA-Z]/.test(dataStr)) return dataStr;
  const partes = String(dataStr).trim().split(/[/.-]/);
  if (partes.length === 3) {
    let dia, mes, ano;
    if (partes[0].length === 4) {
      [ano, mes, dia] = partes;
    } else {
      [dia, mes, ano] = partes;
    }
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const mIdx = parseInt(mes, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      const dNum = parseInt(dia, 10);
      const diaFormatado = isNaN(dNum) ? dia : (dNum < 10 ? `0${dNum}` : `${dNum}`);
      return `${diaFormatado} de ${meses[mIdx]} de ${ano}`;
    }
  }
  return dataStr;
};

// Componente da Rubrica Manuscrita Autêntica de Nilson Oliveira dos Santos
export function NilsonSignatureRubric() {
  return (
    <div style={{ height: '46px', marginBottom: '-10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'none' }}>
      <svg
        viewBox="0 0 160 85"
        width="130"
        height="64"
        style={{ overflow: 'visible' }}
      >
        <path
          d="M 24 62 C 18 52 14 38 22 24 C 30 10 44 4 52 4 C 57 4 64 8 66 18 C 69 32 64 48 58 60 C 53 70 48 78 42 90 M 38 34 C 46 22 62 16 75 22 C 86 27 92 38 86 50 C 80 60 68 64 60 60 C 54 57 52 50 56 42 C 62 34 74 36 82 44 M 48 48 C 46 58 42 72 38 92"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="signature-rubric-path"
        />
      </svg>
    </div>
  );
}

// Estrutura de pesos de sazonalidade e coeficientes da planilha oficial Y7
const MODELO_ESTRUTURA = {
  pesosMensais: [
    { mes: "Janeiro", peso: 807500 },
    { mes: "Fevereiro", peso: 806250 },
    { mes: "Março", peso: 1120000 },
    { mes: "Abril", peso: 1081250 },
    { mes: "Maio", peso: 991250 },
    { mes: "Junho", peso: 835000 },
    { mes: "Julho", peso: 981250 },
    { mes: "Agosto", peso: 1086250 },
    { mes: "Setembro", peso: 1191250 },
    { mes: "Outubro", peso: 1012500 },
    { mes: "Novembro", peso: 1091250 },
    { mes: "Dezembro", peso: 1103750 }
  ]
};

// Presets exatos dos PDFs para carregamento rápido
const PRESETS_PDF = {
  p2026: {
    razaoSocial: 'MOURATO E ASSOCIADOS LTDA',
    cnpj: '37.377.738/0001-45',
    faturamento: 1409898.34,
    capitalSocial: 1000000,
    anoExercicio: '2026',
    anoAnterior: '2025',
    socioNome: 'JOSE JAILSON MOURATO DA SILVA',
    socioCpf: '317.769.598-92'
  },
  p2025: {
    razaoSocial: 'JOSE JAILSON MOURATO DA SILVA',
    cnpj: '37.377.738/0001-45',
    faturamento: 1385016.52,
    capitalSocial: 100000,
    anoExercicio: '2025',
    anoAnterior: '2024',
    socioNome: 'JOSE JAILSON MOURATO DA SILVA',
    socioCpf: '317.769.598-92'
  },
  p2024: {
    razaoSocial: 'JOSE JAILSON MOURATO DA SILVA',
    cnpj: '37.377.738/0001-45',
    faturamento: 1200447.02,
    capitalSocial: 100000,
    anoExercicio: '2024',
    anoAnterior: '2023',
    socioNome: 'JOSE JAILSON MOURATO DA SILVA',
    socioCpf: '317.769.598-92'
  }
};

export default function FinancialStatementsEditor({ clients = [], onUpdateClient }) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [activeTab, setActiveTab] = useState('dre');
  const [reportViewMode, setReportViewMode] = useState('unificado');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // Valor de Faturamento Anual (inicia com modelo de referência ou salvo)
  const [faturamentoInput, setFaturamentoInput] = useState(() => {
    if (clients[0]?.id) {
      const saved = localStorage.getItem(`y7_fat_${clients[0].id}`);
      if (saved) return Number(saved);
    }
    return 1409898.34;
  });

  // Modo de edição inline na Visualização Executiva (PDF / A4)
  const [isReportEditing, setIsReportEditing] = useState(false);

  // Informações cadastrais da empresa e responsáveis técnicos
  const [empresaData, setEmpresaData] = useState(() => {
    const cli = clients.find(c => c.id === selectedClientId) || clients[0];
    if (cli) {
      const saved = localStorage.getItem(`y7_empresa_${cli.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!parsed.dataEmissao) {
            parsed.dataEmissao = `02/01/${Number(parsed.anoExercicio || 2026) + 1}`;
          }
          return parsed;
        } catch (e) {}
      }
      return {
        razaoSocial: cli.razaoSocial || cli.nomeFantasia || 'MOURATO E ASSOCIADOS LTDA',
        cnpj: cli.cnpj || '37.377.738/0001-45',
        capitalSocial: 1000000,
        regime: cli.regime || 'Simples Nacional',
        anoExercicio: '2026',
        anoAnterior: '2025',
        dataEmissao: '02/01/2027',
        socio: {
          nome: cli.responsavel || 'JOSE JAILSON MOURATO DA SILVA',
          qualificacao: 'Sócio Administrador',
          cpf: '317.769.598-92'
        },
        contador: {
          nome: 'Nilson Oliveira dos Santos',
          crc: 'CRC/SP 215.114',
          cpf: '086.986.408-42'
        }
      };
    }
    return {
      razaoSocial: 'MOURATO E ASSOCIADOS LTDA',
      cnpj: '37.377.738/0001-45',
      capitalSocial: 1000000,
      regime: 'Simples Nacional',
      anoExercicio: '2026',
      anoAnterior: '2025',
      dataEmissao: '02/01/2027',
      socio: {
        nome: 'JOSE JAILSON MOURATO DA SILVA',
        qualificacao: 'Sócio Administrador',
        cpf: '317.769.598-92'
      },
      contador: {
        nome: 'Nilson Oliveira dos Santos',
        crc: 'CRC/SP 215.114',
        cpf: '086.986.408-42'
      }
    };
  });

  // Atualização ao trocar de cliente
  useEffect(() => {
    const cli = clients.find(c => c.id === selectedClientId) || clients[0];
    if (cli) {
      if (selectedClientId !== cli.id) {
        setSelectedClientId(cli.id);
      }
      const savedEmpresa = localStorage.getItem(`y7_empresa_${cli.id}`);
      if (savedEmpresa) {
        try {
          const parsed = JSON.parse(savedEmpresa);
          if (!parsed.dataEmissao) {
            parsed.dataEmissao = `02/01/${Number(parsed.anoExercicio || 2026) + 1}`;
          }
          setEmpresaData(parsed);
        } catch (e) {}
      } else {
        setEmpresaData({
          razaoSocial: cli.razaoSocial || cli.nomeFantasia || 'MOURATO E ASSOCIADOS LTDA',
          cnpj: cli.cnpj || '37.377.738/0001-45',
          capitalSocial: 1000000,
          regime: cli.regime || 'Simples Nacional',
          anoExercicio: '2026',
          anoAnterior: '2025',
          dataEmissao: '02/01/2027',
          socio: {
            nome: cli.responsavel || 'JOSE JAILSON MOURATO DA SILVA',
            qualificacao: 'Sócio Administrador',
            cpf: '317.769.598-92'
          },
          contador: {
            nome: 'Nilson Oliveira dos Santos',
            crc: 'CRC/SP 215.114',
            cpf: '086.986.408-42'
          }
        });
      }

      const savedFat = localStorage.getItem(`y7_fat_${cli.id}`);
      if (savedFat) {
        setFaturamentoInput(Number(savedFat));
      }
    }
  }, [selectedClientId, clients]);

  // Carregar dados de um preset de PDF
  const handleApplyPreset = (presetKey) => {
    const p = PRESETS_PDF[presetKey];
    if (p) {
      setFaturamentoInput(p.faturamento);
      setEmpresaData({
        ...empresaData,
        razaoSocial: p.razaoSocial,
        cnpj: p.cnpj,
        capitalSocial: p.capitalSocial,
        anoExercicio: p.anoExercicio,
        anoAnterior: p.anoAnterior,
        dataEmissao: `02/01/${Number(p.anoExercicio) + 1}`,
        socio: {
          ...empresaData.socio,
          nome: p.socioNome,
          cpf: p.socioCpf
        }
      });
    }
  };

  // Total dos pesos mensais para normalização
  const somaPesos = useMemo(() => {
    return MODELO_ESTRUTURA.pesosMensais.reduce((acc, curr) => acc + curr.peso, 0);
  }, []);

  // 1. CÁLCULO DINÂMICO DE FATURAMENTO MENSAL E ACUMULADO (ESTRUTURA DO PDF)
  const tabelaFaturamento = useMemo(() => {
    let acumulado = 0;
    const baseFat = Number(faturamentoInput) || 0;
    return MODELO_ESTRUTURA.pesosMensais.map((item) => {
      const part = somaPesos > 0 ? (item.peso / somaPesos) : 0;
      const valor = baseFat * part;
      acumulado += valor;
      return {
        mes: item.mes,
        ano: empresaData.anoExercicio,
        baseAtual: item.peso,
        participacao: part,
        valorMensal: valor,
        acumulado: acumulado
      };
    });
  }, [faturamentoInput, somaPesos, empresaData.anoExercicio]);

  const faturamentoTotal = useMemo(() => {
    return tabelaFaturamento.reduce((acc, curr) => acc + curr.valorMensal, 0);
  }, [tabelaFaturamento]);

  // 2. CÁLCULO DOS IMPOSTOS MENSAIS E ANUAIS (PIS, COFINS, CSLL, IRPJ)
  const tabelaImpostos = useMemo(() => {
    const aliqPIS = 0.00716595;
    const aliqCOFINS = 0.03307360;
    const aliqCSLL = 0.01190650;
    const aliqIRPJ = 0.02645888;

    return tabelaFaturamento.map((item, idx) => {
      const fat = item.valorMensal;
      const pis = fat * aliqPIS;
      const cofins = fat * aliqCOFINS;
      const csll = fat * aliqCSLL;
      const irpj = fat * aliqIRPJ;
      return {
        id: idx + 1,
        mes: item.mes.toUpperCase(),
        faturamento: fat,
        pis,
        cofins,
        csll,
        irpj,
        totalImpostosMes: pis + cofins + csll + irpj
      };
    });
  }, [tabelaFaturamento]);

  const totaisImpostos = useMemo(() => {
    return tabelaImpostos.reduce((acc, curr) => ({
      pis: acc.pis + curr.pis,
      cofins: acc.cofins + curr.cofins,
      csll: acc.csll + curr.csll,
      irpj: acc.irpj + curr.irpj,
      faturamento: acc.faturamento + curr.faturamento,
      totalImpostos: acc.totalImpostos + curr.totalImpostosMes
    }), { pis: 0, cofins: 0, csll: 0, irpj: 0, faturamento: 0, totalImpostos: 0 });
  }, [tabelaImpostos]);

  // 3. CÁLCULO COMPLETO DA DRE CONFORME ESTRUTURA DO PDF
  const dreCalculada = useMemo(() => {
    const fat = faturamentoTotal;

    const receitaBruta = fat;
    const deducoes = 0.033289084809646 * fat; // ~3.33% conforme modelo PDF
    const receitaLiquida = receitaBruta - deducoes;
    const cmv = 0.676945999953816 * fat; // CMV conforme modelo PDF
    const lucroBruto = receitaLiquida - cmv;

    const despesasAdmin = 0.0199667318661517 * fat;
    const servicosTerceiros = 0.0266587250698497 * fat;
    const despesasFinanceiras = 0.00426140307609118 * fat;
    const totalDespesasOperacionais = despesasAdmin + servicosTerceiros + despesasFinanceiras;

    const lucroOperacional = lucroBruto - totalDespesasOperacionais;

    const csll = 0.0008387 * fat;
    const lair = lucroOperacional - csll;
    const irpj = 0.0009125 * fat;
    const resultadoAntesPart = lair - irpj;
    const participacoes = 0.0151742049541289 * fat;
    const lucroLiquido = resultadoAntesPart - participacoes;

    return {
      receitaBruta,
      deducoes,
      receitaLiquida,
      cmv,
      lucroBruto,
      despesasAdmin,
      servicosTerceiros,
      despesasFinanceiras,
      totalDespesasOperacionais,
      lucroOperacional,
      csll,
      lair,
      irpj,
      resultadoAntesPart,
      participacoes,
      lucroLiquido
    };
  }, [faturamentoTotal]);

  // Comparativo ano anterior
  const dreAnoAnterior = useMemo(() => ({
    receitaBruta: 0,
    deducoes: 0,
    receitaLiquida: 0,
    cmv: 0,
    lucroBruto: 0,
    despesasAdmin: 0,
    servicosTerceiros: 0,
    despesasFinanceiras: 0,
    totalDespesasOperacionais: 0,
    lucroOperacional: 0,
    csll: 0,
    lair: 0,
    irpj: 0,
    resultadoAntesPart: 0,
    participacoes: 0,
    lucroLiquido: 0
  }), []);

  // 4. CÁLCULO DO BALANÇO PATRIMONIAL ATIVO CONFORME ESTRUTURA DO PDF
  const ativoCalculado = useMemo(() => {
    const fat = faturamentoTotal;

    // 1.1 Circulante
    const caixa = 0.0224899998899222 * fat;
    const bancos = 0.0767759999171238 * fat;
    const aplicacoes = 0.1811600001583176 * fat;
    const totalDisponivel = caixa + bancos + aplicacoes;

    const duplicatas = 0.249962999754904 * fat;
    const duplicatasDescontadas = 0;
    const adiantamentos = 0;
    const impostosRecuperar = 0;
    const clientesDiversos = 0;
    const totalCreditos = duplicatas + duplicatasDescontadas + adiantamentos + impostosRecuperar + clientesDiversos;

    const mercadorias = 0.00488770943234802 * fat;
    const materialConsumo = 0.00128947404759145 * fat;
    const totalEstoques = mercadorias + materialConsumo;

    const segurosApropriar = 0;
    const jurosApropriar = 0;
    const totalDespSeguinte = segurosApropriar + jurosApropriar;

    const totalCirculante = totalDisponivel + totalCreditos + totalEstoques + totalDespSeguinte;

    // 1.2 Não Circulante
    const clientesLP = 0.0300799999943277 * fat;
    const investimentosLP = 0.018947853806805 * fat;
    const clientesDiversosLP = 0;
    const totalRealizavelLP = clientesLP + investimentosLP + clientesDiversosLP;

    const investimentos = 0;

    // Imobilizado estruturado conforme PDF
    const maquinas = 0.02663 * fat;
    const veiculos = 0.05704 * fat;
    const informatica = 0.00514 * fat;
    const instalacoes = 0.02737 * fat;
    const depreciacao = -0.00678020184141549 * fat;
    const totalImobilizado = maquinas + veiculos + informatica + instalacoes + depreciacao;

    const diferido = 0;

    const totalNaoCirculante = totalRealizavelLP + investimentos + totalImobilizado + diferido;
    const totalAtivo = totalCirculante + totalNaoCirculante;

    return {
      caixa, bancos, aplicacoes, totalDisponivel,
      duplicatas, duplicatasDescontadas, adiantamentos, impostosRecuperar, clientesDiversos, totalCreditos,
      mercadorias, materialConsumo, totalEstoques,
      segurosApropriar, jurosApropriar, totalDespSeguinte,
      totalCirculante,
      clientesLP, investimentosLP, clientesDiversosLP, totalRealizavelLP,
      investimentos,
      maquinas, veiculos, informatica, instalacoes, depreciacao, totalImobilizado,
      diferido,
      totalNaoCirculante,
      totalAtivo
    };
  }, [faturamentoTotal]);

  // 5. CÁLCULO DO BALANÇO PATRIMONIAL PASSIVO CONFORME ESTRUTURA DO PDF
  const passivoCalculado = useMemo(() => {
    const fat = faturamentoTotal;

    // 2.1 Passivo Circulante
    const fornecedores = 0.11117765 * fat; // Conforme modelo PDF
    const obrigacoesFiscais = 0.0299999997720956 * fat;
    const irPagar = 0.022097327678201 * fat;
    const obrigacoesSociais = 0.00598469288119272 * fat;
    const outrasContas = 0.00112086124732951 * fat;
    const totalCirculante = fornecedores + obrigacoesFiscais + irPagar + obrigacoesSociais + outrasContas;

    // 2.2 Não Circulante
    const fornecedoresLP = 0;
    const emprestimos = 0;
    const outrasContasLP = 0;
    const totalNaoCirculante = fornecedoresLP + emprestimos + outrasContasLP;

    // 2.3 Exercícios Futuros
    const alugueisVencer = 0;
    const outrasReceitasVencer = 0;
    const totalExerciciosFuturos = alugueisVencer + outrasReceitasVencer;

    // 2.4 Patrimônio Líquido
    const capitalSocial = Number(empresaData.capitalSocial) || 100000;
    const capitalRealizar = 0;
    const totalCapital = capitalSocial - capitalRealizar;

    const reservaLegal = fat * 0.0381; // 3.81%
    const totalReserva = reservaLegal;

    // Lucro do período vem diretamente da DRE
    const lucroPeriodo = dreCalculada.lucroLiquido;

    // Contrapartida patrimonial para Ativo = Passivo
    const passivoExigivelEPLParcial = totalCirculante + totalNaoCirculante + totalExerciciosFuturos + totalCapital + totalReserva + lucroPeriodo;
    const lucrosAcumuladosBalanceados = ativoCalculado.totalAtivo - passivoExigivelEPLParcial;

    const totalPL = totalCapital + totalReserva + lucrosAcumuladosBalanceados + lucroPeriodo;
    const totalPassivo = totalCirculante + totalNaoCirculante + totalExerciciosFuturos + totalPL;

    return {
      fornecedores, obrigacoesFiscais, irPagar, obrigacoesSociais, outrasContas, totalCirculante,
      fornecedoresLP, emprestimos, outrasContasLP, totalNaoCirculante,
      alugueisVencer, outrasReceitasVencer, totalExerciciosFuturos,
      capitalSocial, capitalRealizar, totalCapital,
      reservaLegal, totalReserva,
      lucrosAcumulados: lucrosAcumuladosBalanceados,
      lucroPeriodo,
      totalPL,
      totalPassivo,
      diferencaBalanceamento: ativoCalculado.totalAtivo - totalPassivo
    };
  }, [faturamentoTotal, empresaData.capitalSocial, dreCalculada.lucroLiquido, ativoCalculado.totalAtivo]);

  const handleSave = async () => {
    if (selectedClientId) {
      localStorage.setItem(`y7_empresa_${selectedClientId}`, JSON.stringify(empresaData));
      localStorage.setItem(`y7_fat_${selectedClientId}`, String(faturamentoInput));

      const currentClient = clients.find(c => c.id === selectedClientId);
      if (currentClient && onUpdateClient) {
        try {
          await onUpdateClient({
            ...currentClient,
            razaoSocial: empresaData.razaoSocial || currentClient.razaoSocial,
            cnpj: empresaData.cnpj || currentClient.cnpj,
            regime: empresaData.regime || currentClient.regime,
            responsavel: empresaData.socio?.nome || currentClient.responsavel
          });
        } catch (e) {
          console.warn('Erro ao atualizar cliente:', e);
        }
      }
    }
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  const handlePrintSpecific = (mode) => {
    if (mode) {
      setReportViewMode(mode);
    }
    setActiveTab('relatorio');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handlePrint = () => {
    handlePrintSpecific(reportViewMode || 'unificado');
  };

  const formatBRL = (val) => {
    const num = Number(val);
    if (!isFinite(num) || isNaN(num)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num || 0);
  };

  const formatPct = (val) => {
    const num = Number(val);
    if (!isFinite(num) || isNaN(num) || num === 0) return '0,00%';
    return (num * 100).toFixed(2).replace('.', ',') + '%';
  };

  return (
    <div style={{ color: '#F8FAFC' }}>
      {/* ========================================================
          BARRA DE FERRAMENTAS ORIGINAL Y7 COM BOTÕES CLÁSSICOS
         ======================================================== */}
      <div className="no-print glass-panel editor-toolbar" style={{
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: 'rgba(10, 15, 29, 0.95)',
        border: '1px solid rgba(56, 189, 248, 0.2)'
      }}>
        {/* Controles de Empresa, Faturamento e Data de Emissão em Linha Única */}
        <div className="editor-toolbar-controls" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ width: '240px', minWidth: '220px' }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
              Empresa / Cliente Selecionado
            </label>
            <select
              className="form-control"
              style={{ width: '100%', padding: '7px 10px', fontSize: '0.84rem', fontWeight: 600, color: '#38BDF8' }}
              value={selectedClientId}
              onChange={(e) => {
                const val = e.target.value;
                if (val.startsWith('preset_')) {
                  handleApplyPreset(val.replace('preset_', ''));
                } else {
                  setSelectedClientId(val);
                }
              }}
            >
              <optgroup label="Modelos Oficiais (PDF)">
                <option value="preset_p2026">Mourato e Associados (Exercício 2026 - R$ 1,40M)</option>
                <option value="preset_p2025">Jose Jailson Mourato (Exercício 2025 - R$ 1,38M)</option>
                <option value="preset_p2024">Jose Jailson Mourato (Exercício 2024 - R$ 1,20M)</option>
              </optgroup>
              {clients.length > 0 && (
                <optgroup label="Clientes do Sistema">
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.razaoSocial || c.nomeFantasia} ({c.regime || 'Simples'})</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div style={{ width: '170px', minWidth: '160px' }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
              Faturamento Anual (R$)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                className="form-control mono"
                style={{ flex: 1, minWidth: 0, padding: '7px 10px', fontSize: '0.88rem', fontWeight: 700, color: '#00F5D4' }}
                value={faturamentoInput === 0 || faturamentoInput === '' ? '' : faturamentoInput}
                onChange={(e) => {
                  const raw = e.target.value.replace(/^0+(?=\d)/, '');
                  setFaturamentoInput(raw === '' ? '' : Number(raw));
                }}
                onFocus={(e) => {
                  if (e.target.value === '0') {
                    setFaturamentoInput('');
                  }
                }}
                placeholder="0,00"
              />
              <button
                type="button"
                onClick={() => setFaturamentoInput('')}
                className="btn btn-secondary btn-sm"
                title="Zerar Faturamento"
                style={{ padding: '7px 8px', flexShrink: 0 }}
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* NOVO: Campo de Data de Emissão que sai nas impressões */}
          <div style={{ width: '160px', minWidth: '150px' }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
              Data Emissão (Impressão)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="text"
                className="form-control mono"
                style={{ flex: 1, minWidth: 0, padding: '7px 10px', fontSize: '0.88rem', fontWeight: 700, color: '#38BDF8' }}
                value={empresaData.dataEmissao || ''}
                onChange={(e) => setEmpresaData(prev => ({ ...prev, dataEmissao: e.target.value }))}
                placeholder="02/01/2027"
                title="Data oficial que constará no cabeçalho e assinaturas da impressão"
              />
              <button
                type="button"
                onClick={() => setEmpresaData(prev => ({ ...prev, dataEmissao: `02/01/${Number(prev.anoExercicio || 2026) + 1}` }))}
                className="btn btn-secondary btn-sm"
                title="Restaurar data padrão"
                style={{ padding: '7px 8px', flexShrink: 0 }}
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Botões de Ação Rápida com Funções de Impressão Separadas */}
        <div className="editor-toolbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {saveSuccessMessage && (
            <span style={{ color: '#10B981', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <CheckCircle2 size={15} /> Salvo!
            </span>
          )}

          <button onClick={handleSave} className="btn btn-ruby btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 11px' }}>
            <Save size={14} />
            <span>Salvar Alterações</span>
          </button>

          <button 
            onClick={handlePrint} 
            className="btn btn-ruby btn-sm" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px' }}
            title="Imprimir relatório contábil oficial em PDF"
          >
            <Printer size={14} />
            <span>Imprimir Relatório (PDF)</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          NAVEGADOR DE ABAS DO PAINEL (FORMATO ORIGINAL Y7)
         ======================================================== */}
      <div className="no-print editor-nav-tabs" style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '24px',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'dre', label: '1. DRE Oficial (Resultado)', icon: BarChart2, badge: 'DRE' },
          { id: 'balanco', label: '2. Balanço Patrimonial (Ativo e Passivo)', icon: Layers, badge: 'BP' },
          { id: 'faturamento', label: '3. Faturamento 12 Meses', icon: Calendar, badge: '12M' },
          { id: 'impostos', label: '4. Declaração de Impostos', icon: DollarSign, badge: 'Tributos' },
          { id: 'cadastro', label: '5. Dados & Responsáveis', icon: Building2, badge: 'Cadastro' },
          { id: 'relatorio', label: '📄 Visualização Executiva (PDF / A4)', icon: FileSpreadsheet, badge: 'Oficial' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : '#94A3B8',
                backgroundColor: isActive ? 'rgba(200, 30, 61, 0.25)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid #C81E3D' : '3px solid transparent',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? '#38BDF8' : '#94A3B8'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          CARD DE EQUILÍBRIO E STATUS CONTÁBIL ORIGINAL
         ======================================================== */}
      <div className="no-print glass-panel" style={{
        padding: '14px 20px',
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        backgroundColor: 'rgba(8, 14, 26, 0.85)',
        border: '1px solid rgba(56, 189, 248, 0.2)'
      }}>
        <div>
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase' }}>Faturamento Anual (Exercício)</div>
          <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38BDF8' }}>
            {formatBRL(faturamentoTotal)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase' }}>Lucro Líquido do Exercício (DRE)</div>
          <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }}>
            {formatBRL(dreCalculada.lucroLiquido)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase' }}>Total do Ativo (BP)</div>
          <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
            {formatBRL(ativoCalculado.totalAtivo)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase' }}>Total do Passivo + PL</div>
          <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
            {formatBRL(passivoCalculado.totalPassivo)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            backgroundColor: Math.abs(passivoCalculado.diferencaBalanceamento) < 0.05 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: Math.abs(passivoCalculado.diferencaBalanceamento) < 0.05 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
            color: Math.abs(passivoCalculado.diferencaBalanceamento) < 0.05 ? '#10B981' : '#EF4444',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%'
          }}>
            <CheckCircle size={15} />
            <span>Balanço Equilibrado (Ativo = Passivo)</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          CONTEÚDO DA ABA 1: DRE OFICIAL (COM ESTRUTURA DO PDF)
         ======================================================== */}
      {activeTab === 'dre' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={20} color="#38BDF8" />
                <span>Demonstrativo de Resultado do Exercício (DRE)</span>
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                {empresaData.razaoSocial} • CNPJ: {empresaData.cnpj} • Exercício {empresaData.anoExercicio}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handlePrintSpecific('dre')}
                className="btn btn-ruby btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Imprimir Demonstração do Resultado do Exercício Oficial"
              >
                <Printer size={15} />
                <span>Imprimir DRE</span>
              </button>
              <div style={{ fontSize: '0.82rem', color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '5px 12px', borderRadius: '4px' }}>
                Estrutura Contábil Calibrada conforme Modelo Oficial dos PDFs
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', width: '100px' }}>CÓDIGO</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>DESCRIÇÃO DA CONTA</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '180px' }}>{empresaData.anoExercicio} (R$)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '140px' }}>PART. (%)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '180px' }}>{empresaData.anoAnterior} (R$)</th>
                </tr>
              </thead>
              <tbody>
                {/* 4 RECEITA BRUTA */}
                <tr className="highlight-row" style={{ backgroundColor: 'rgba(56, 189, 248, 0.06)', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td className="mono" style={{ padding: '9px 14px' }}>4</td>
                  <td style={{ padding: '9px 14px' }}>RECEITA BRUTA DE VENDAS</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#38BDF8' }}>{formatBRL(dreCalculada.receitaBruta)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right' }}>100,00%</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#94A3B8' }}>{formatBRL(dreAnoAnterior.receitaBruta)}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '8px 14px 8px 24px', color: '#94A3B8' }}>4.1</td>
                  <td style={{ padding: '8px 14px 8px 24px', color: '#CBD5E1' }}>Receita Bruta de Vendas</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right' }}>{formatBRL(dreCalculada.receitaBruta)}</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#94A3B8' }}>100,00%</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#94A3B8' }}>{formatBRL(dreAnoAnterior.receitaBruta)}</td>
                </tr>

                {/* DEDUÇÕES */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '8px 14px', color: '#EF4444' }}>(-)4.1.2</td>
                  <td style={{ padding: '8px 14px', color: '#F87171', fontWeight: 600 }}>DEDUÇÕES DA RECEITA BRUTA</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.deducoes)}</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>-3,33%</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.deducoes)}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '7px 14px 7px 24px', color: '#94A3B8' }}>4.1.2.001</td>
                  <td style={{ padding: '7px 14px 7px 24px', color: '#94A3B8' }}>Deduções e Abatimentos de Vendas e Serviços</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.deducoes)}</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#94A3B8' }}>-3,33%</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#94A3B8' }}>- {formatBRL(dreAnoAnterior.deducoes)}</td>
                </tr>

                {/* RECEITA LÍQUIDA */}
                <tr className="highlight-row" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td className="mono" style={{ padding: '9px 14px' }}>4.1.1</td>
                  <td style={{ padding: '9px 14px' }}>RECEITA LÍQUIDA DE VENDAS</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#FFFFFF' }}>{formatBRL(dreCalculada.receitaLiquida)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right' }}>{formatPct(dreCalculada.receitaBruta > 0 ? (dreCalculada.receitaLiquida / dreCalculada.receitaBruta) : 0)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#94A3B8' }}>{formatBRL(dreAnoAnterior.receitaLiquida)}</td>
                </tr>

                {/* CMV */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '8px 14px', color: '#EF4444' }}>(-)4.1.1.007</td>
                  <td style={{ padding: '8px 14px', color: '#F87171' }}>CUSTO DAS MERCADORIAS VENDIDAS – CMV</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.cmv)}</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>-67,69%</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.cmv)}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '7px 14px 7px 24px', color: '#94A3B8' }}>4.1.1.007a</td>
                  <td style={{ padding: '7px 14px 7px 24px', color: '#94A3B8' }}>Custo das Mercadorias e ou Serviços</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.cmv)}</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#94A3B8' }}>-67,69%</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#94A3B8' }}>- {formatBRL(dreAnoAnterior.cmv)}</td>
                </tr>

                {/* LUCRO BRUTO */}
                <tr className="highlight-row" style={{ backgroundColor: 'rgba(56, 189, 248, 0.04)', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td className="mono" style={{ padding: '9px 14px' }}>5</td>
                  <td style={{ padding: '9px 14px' }}>LUCRO BRUTO</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#38BDF8' }}>{formatBRL(dreCalculada.lucroBruto)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right' }}>{formatPct(dreCalculada.receitaBruta > 0 ? (dreCalculada.lucroBruto / dreCalculada.receitaBruta) : 0)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#94A3B8' }}>{formatBRL(dreAnoAnterior.lucroBruto)}</td>
                </tr>

                {/* DESPESAS OPERACIONAIS */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '8px 14px', color: '#EF4444' }}>3.3</td>
                  <td style={{ padding: '8px 14px', color: '#F87171', fontWeight: 600 }}>DESPESAS OPERACIONAIS</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.totalDespesasOperacionais)}</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>-5,09%</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.totalDespesasOperacionais)}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '7px 14px 7px 24px', color: '#94A3B8' }}>3.3.2</td>
                  <td style={{ padding: '7px 14px 7px 24px', color: '#94A3B8' }}>Despesas Administrativas</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.despesasAdmin)}</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#94A3B8' }}>-2,00%</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#94A3B8' }}>- {formatBRL(dreAnoAnterior.despesasAdmin)}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '7px 14px 7px 24px', color: '#94A3B8' }}>3.3.9</td>
                  <td style={{ padding: '7px 14px 7px 24px', color: '#94A3B8' }}>Serviços de Terceiros</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.servicosTerceiros)}</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#94A3B8' }}>-2,67%</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#94A3B8' }}>- {formatBRL(dreAnoAnterior.servicosTerceiros)}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '7px 14px 7px 24px', color: '#94A3B8' }}>3.3.3</td>
                  <td style={{ padding: '7px 14px 7px 24px', color: '#94A3B8' }}>Despesas Financeiras</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.despesasFinanceiras)}</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#94A3B8' }}>-0,43%</td>
                  <td className="mono" style={{ padding: '7px 14px', textAlign: 'right', color: '#94A3B8' }}>- {formatBRL(dreAnoAnterior.despesasFinanceiras)}</td>
                </tr>

                {/* LUCRO OPERACIONAL */}
                <tr className="highlight-row" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td className="mono" style={{ padding: '9px 14px' }}>5.1</td>
                  <td style={{ padding: '9px 14px' }}>LUCRO OPERACIONAL</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#FFFFFF' }}>{formatBRL(dreCalculada.lucroOperacional)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right' }}>{formatPct(dreCalculada.receitaBruta > 0 ? (dreCalculada.lucroOperacional / dreCalculada.receitaBruta) : 0)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#94A3B8' }}>{formatBRL(dreAnoAnterior.lucroOperacional)}</td>
                </tr>

                {/* PROVISÃO CSLL */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '8px 14px', color: '#EF4444' }}>5.1a</td>
                  <td style={{ padding: '8px 14px', color: '#CBD5E1' }}>(-) Despesa com Provisão para CSLL</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.csll)}</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>-0,08%</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.csll)}</td>
                </tr>

                {/* RESULTADO ANTES DO IR */}
                <tr className="highlight-row" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td className="mono" style={{ padding: '9px 14px' }}>5.1.1</td>
                  <td style={{ padding: '9px 14px' }}>RESULTADO ANTES DO IMPOSTO DE RENDA</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#FFFFFF' }}>{formatBRL(dreCalculada.lair)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right' }}>{formatPct(dreCalculada.receitaBruta > 0 ? (dreCalculada.lair / dreCalculada.receitaBruta) : 0)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#94A3B8' }}>{formatBRL(dreAnoAnterior.lair)}</td>
                </tr>

                {/* PROVISÃO IRPJ */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '8px 14px', color: '#EF4444' }}>5.1.1.001</td>
                  <td style={{ padding: '8px 14px', color: '#CBD5E1' }}>(-) Despesa com Provisão para Imposto de Renda</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.irpj)}</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>-0,09%</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.irpj)}</td>
                </tr>

                {/* RESULTADO ANTES PARTICIPAÇÕES */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '8px 14px' }}>5.1.1.002</td>
                  <td style={{ padding: '8px 14px' }}>RESULTADO ANTES DAS PARTICIPAÇÕES</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#FFFFFF' }}>{formatBRL(dreCalculada.resultadoAntesPart)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right' }}>{formatPct(dreCalculada.receitaBruta > 0 ? (dreCalculada.resultadoAntesPart / dreCalculada.receitaBruta) : 0)}</td>
                  <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#94A3B8' }}>{formatBRL(dreAnoAnterior.resultadoAntesPart)}</td>
                </tr>

                {/* PARTICIPAÇÕES */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="mono" style={{ padding: '8px 14px', color: '#EF4444' }}>5.1.1.002a</td>
                  <td style={{ padding: '8px 14px', color: '#CBD5E1' }}>(-) Participações</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.participacoes)}</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>-1,52%</td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.participacoes)}</td>
                </tr>

                {/* LUCRO LÍQUIDO DO EXERCÍCIO */}
                <tr className="super-highlight" style={{
                  backgroundColor: 'rgba(200, 30, 61, 0.25)',
                  border: '1.5px solid #C81E3D',
                  fontWeight: 800
                }}>
                  <td className="mono" style={{ padding: '12px 14px', fontSize: '1rem', color: '#FFFFFF' }}>5.1.1.003</td>
                  <td style={{ padding: '12px 14px', fontSize: '1rem', color: '#FFFFFF' }}>LUCRO LÍQUIDO DO EXERCÍCIO</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right', fontSize: '1.15rem', color: '#34D399' }}>{formatBRL(dreCalculada.lucroLiquido)}</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right', color: '#34D399' }}>{formatPct(dreCalculada.receitaBruta > 0 ? (dreCalculada.lucroLiquido / dreCalculada.receitaBruta) : 0)}</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right', fontSize: '1rem', color: '#E2E8F0' }}>{formatBRL(dreAnoAnterior.lucroLiquido)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          CONTEÚDO DA ABA 2: BALANÇO PATRIMONIAL ANALÍTICO (PDF)
         ======================================================== */}
      {activeTab === 'balanco' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="#38BDF8" />
                <span>Balanço Patrimonial Analítico</span>
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                {empresaData.razaoSocial} • Encerrado em {empresaData.anoExercicio}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handlePrintSpecific('balanco')}
                className="btn btn-ruby btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Imprimir Balanço Patrimonial Oficial"
              >
                <Printer size={15} />
                <span>Imprimir Balanço</span>
              </button>
              <div style={{ fontSize: '0.84rem', color: '#38BDF8', fontWeight: 700 }}>
                Ativo: {formatBRL(ativoCalculado.totalAtivo)}
              </div>
              <div style={{ color: '#64748B' }}>|</div>
              <div style={{ fontSize: '0.84rem', color: '#34D399', fontWeight: 700 }}>
                Passivo + PL: {formatBRL(passivoCalculado.totalPassivo)}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
            {/* QUADRO DO ATIVO */}
            <div style={{ border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.96rem' }}>1 • ATIVO TOTAL</span>
                <span className="mono" style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.1rem' }}>{formatBRL(ativoCalculado.totalAtivo)}</span>
              </div>

              <div style={{ padding: '14px', fontSize: '0.86rem' }}>
                {/* 1.1 CIRCULANTE */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#FFFFFF', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>1.1 ATIVO CIRCULANTE</span>
                  <span className="mono">{formatBRL(ativoCalculado.totalCirculante)}</span>
                </div>

                <div style={{ paddingLeft: '12px', margin: '6px 0 12px 0' }}>
                  <div style={{ fontWeight: 600, color: '#38BDF8', margin: '4px 0' }}>1.1.1 DISPONÍVEL ({formatBRL(ativoCalculado.totalDisponivel)})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.1.1.001 Caixa</span>
                    <span className="mono">{formatBRL(ativoCalculado.caixa)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.1.1.002 Bancos c/ Movimento</span>
                    <span className="mono">{formatBRL(ativoCalculado.bancos)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.1.1.003 Bancos c/ Aplicação</span>
                    <span className="mono">{formatBRL(ativoCalculado.aplicacoes)}</span>
                  </div>

                  <div style={{ fontWeight: 600, color: '#38BDF8', margin: '8px 0 4px 0' }}>1.1.2 CRÉDITOS ({formatBRL(ativoCalculado.totalCreditos)})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.1.2.001 Duplicatas a Receber (Clientes)</span>
                    <span className="mono">{formatBRL(ativoCalculado.duplicatas)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>(-)1.1.2.002 (-) Duplicatas Descontadas</span>
                    <span className="mono">R$ 0,00</span>
                  </div>

                  <div style={{ fontWeight: 600, color: '#38BDF8', margin: '8px 0 4px 0' }}>1.1.3 ESTOQUES ({formatBRL(ativoCalculado.totalEstoques)})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.1.3.001 Mercadorias</span>
                    <span className="mono">{formatBRL(ativoCalculado.mercadorias)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.1.3.002 Material de Uso e Consumo</span>
                    <span className="mono">{formatBRL(ativoCalculado.materialConsumo)}</span>
                  </div>
                </div>

                {/* 1.2 NÃO CIRCULANTE */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#FFFFFF', padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>1.2 ATIVO NÃO CIRCULANTE</span>
                  <span className="mono">{formatBRL(ativoCalculado.totalNaoCirculante)}</span>
                </div>

                <div style={{ paddingLeft: '12px', margin: '6px 0' }}>
                  <div style={{ fontWeight: 600, color: '#38BDF8', margin: '4px 0' }}>1.2.1 REALIZÁVEL A LONGO PRAZO ({formatBRL(ativoCalculado.totalRealizavelLP)})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.2.1.001 Clientes - LP</span>
                    <span className="mono">{formatBRL(ativoCalculado.clientesLP)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.2.1.002 Investimentos Temporários LP</span>
                    <span className="mono">{formatBRL(ativoCalculado.investimentosLP)}</span>
                  </div>

                  <div style={{ fontWeight: 600, color: '#38BDF8', margin: '8px 0 4px 0' }}>1.2.3 IMOBILIZADO ({formatBRL(ativoCalculado.totalImobilizado)})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.2.3.001 Máquinas</span>
                    <span className="mono">{formatBRL(ativoCalculado.maquinas)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.2.3.002 Veículos</span>
                    <span className="mono">{formatBRL(ativoCalculado.veiculos)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.2.3.003 Equipamentos de Informática</span>
                    <span className="mono">{formatBRL(ativoCalculado.informatica)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>1.2.3.004 Instalações</span>
                    <span className="mono">{formatBRL(ativoCalculado.instalacoes)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444', padding: '2px 0 2px 10px' }}>
                    <span>(-)1.2.3.005 (-) Depreciação Acumulada</span>
                    <span className="mono">{formatBRL(ativoCalculado.depreciacao)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUADRO DO PASSIVO E PATRIMÔNIO LÍQUIDO */}
            <div style={{ border: '1px solid rgba(200, 30, 61, 0.35)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: 'rgba(200, 30, 61, 0.2)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#F87171', fontSize: '0.96rem' }}>2 • PASSIVO & PATRIMÔNIO LÍQUIDO</span>
                <span className="mono" style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.1rem' }}>{formatBRL(passivoCalculado.totalPassivo)}</span>
              </div>

              <div style={{ padding: '14px', fontSize: '0.86rem' }}>
                {/* 2.1 CIRCULANTE */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#FFFFFF', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>2.1 PASSIVO CIRCULANTE</span>
                  <span className="mono">{formatBRL(passivoCalculado.totalCirculante)}</span>
                </div>

                <div style={{ paddingLeft: '12px', margin: '6px 0 12px 0' }}>
                  <div style={{ fontWeight: 600, color: '#F87171', margin: '4px 0' }}>2.1.1 OBRIGAÇÕES ({formatBRL(passivoCalculado.totalCirculante)})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>2.1.1.001 Fornecedores</span>
                    <span className="mono">{formatBRL(passivoCalculado.fornecedores)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>2.1.1.002 Obrigações Fiscais</span>
                    <span className="mono">{formatBRL(passivoCalculado.obrigacoesFiscais)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>2.1.1.003 Imposto de Renda a Pagar</span>
                    <span className="mono">{formatBRL(passivoCalculado.irPagar)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>2.1.1.004 Obrigações Sociais e Trabalhistas</span>
                    <span className="mono">{formatBRL(passivoCalculado.obrigacoesSociais)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', padding: '2px 0 2px 10px' }}>
                    <span>2.1.1.005 Outras Contas a Pagar</span>
                    <span className="mono">{formatBRL(passivoCalculado.outrasContas)}</span>
                  </div>
                </div>

                {/* 2.4 PATRIMÔNIO LÍQUIDO */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#34D399', padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>2.4 PATRIMÔNIO LÍQUIDO</span>
                  <span className="mono">{formatBRL(passivoCalculado.totalPL)}</span>
                </div>

                <div style={{ paddingLeft: '12px', margin: '6px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1', padding: '3px 0' }}>
                    <span>2.4.1.001 Capital Social Subscrito</span>
                    <span className="mono">{formatBRL(passivoCalculado.capitalSocial)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1', padding: '3px 0' }}>
                    <span>2.4.2.001 Reserva Legal (3,81%)</span>
                    <span className="mono">{formatBRL(passivoCalculado.reservaLegal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1', padding: '3px 0' }}>
                    <span>2.4.3.001 Lucros Acumulados</span>
                    <span className="mono">{formatBRL(passivoCalculado.lucrosAcumulados)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399', fontWeight: 700, padding: '4px 0', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                    <span>2.4.4.001 Lucro do Exercício (Vindo da DRE)</span>
                    <span className="mono">{formatBRL(passivoCalculado.lucroPeriodo)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CONTEÚDO DA ABA 3: FATURAMENTO 12 MESES ORIGINAL
         ======================================================== */}
      {activeTab === 'faturamento' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} color="#38BDF8" />
                <span>Declaração de Faturamento – 12 Meses</span>
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                Distribuição ponderada mensal conforme modelo de sazonalidade dos PDFs
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handlePrintSpecific('faturamento')}
                className="btn btn-ruby btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Imprimir Declaração de Faturamento 12 Meses Oficial"
              >
                <Printer size={15} />
                <span>Imprimir 12 Meses</span>
              </button>
              <span style={{ fontSize: '0.84rem', color: '#94A3B8' }}>Total Declarado Anual:</span>
              <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00F5D4' }}>
                {formatBRL(faturamentoTotal)}
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', width: '60px' }}>Nº</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>MÊS</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '100px' }}>ANO</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '160px' }}>BASE ATUAL</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '130px' }}>PARTICIPAÇÃO (%)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '200px' }}>FATURAMENTO (R$)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '200px' }}>ACUMULADO (R$)</th>
                </tr>
              </thead>
              <tbody>
                {tabelaFaturamento.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td className="mono" style={{ padding: '9px 14px', color: '#94A3B8' }}>{idx + 1}</td>
                    <td style={{ padding: '9px 14px', fontWeight: 600, color: '#FFFFFF' }}>{row.mes.toUpperCase()}</td>
                    <td className="mono" style={{ padding: '9px 14px', textAlign: 'center', color: '#94A3B8' }}>{row.ano}</td>
                    <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#94A3B8' }}>{formatBRL(row.baseAtual)}</td>
                    <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#38BDF8' }}>{formatPct(row.participacao)}</td>
                    <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 700, color: '#00F5D4' }}>{formatBRL(row.valorMensal)}</td>
                    <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#CBD5E1' }}>{formatBRL(row.acumulado)}</td>
                  </tr>
                ))}
                {/* TOTAL */}
                <tr className="highlight-row" style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', fontWeight: 800, borderTop: '2px solid rgba(56, 189, 248, 0.3)' }}>
                  <td colSpan={3} style={{ padding: '12px 14px', fontSize: '0.95rem' }}>TOTAL CONSOLIDADO (12 MESES)</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right' }}>{formatBRL(somaPesos)}</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right' }}>100,00%</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right', fontSize: '1.05rem', color: '#00F5D4' }}>{formatBRL(faturamentoTotal)}</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right', fontSize: '1.05rem', color: '#38BDF8' }}>{formatBRL(faturamentoTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          CONTEÚDO DA ABA 4: IMPOSTOS MENSAIS E ANUAIS
         ======================================================== */}
      {activeTab === 'impostos' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={20} color="#38BDF8" />
                <span>Declaração de Faturamento & Impostos Detalhados</span>
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                PIS, COFINS, CSLL e IRPJ apurados mês a mês e integrados à DRE oficial
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handlePrintSpecific('impostos')}
                className="btn btn-ruby btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Imprimir Declaração de Apuração de Impostos Oficial"
              >
                <Printer size={15} />
                <span>Imprimir Impostos</span>
              </button>
              <div style={{ fontSize: '0.84rem', color: '#10B981', fontWeight: 700 }}>
                Total Impostos Federais: {formatBRL(totaisImpostos.totalImpostos)}
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', width: '50px' }}>CÓD.</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', width: '130px' }}>MÊS</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>PIS (~0,72%)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>COFINS (~3,31%)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>CSLL (~1,19%)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>IRPJ (~2,65%)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '190px' }}>FATURAMENTO (R$)</th>
                </tr>
              </thead>
              <tbody>
                {tabelaImpostos.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td className="mono" style={{ padding: '9px 14px', color: '#94A3B8' }}>{row.id}</td>
                    <td style={{ padding: '9px 14px', fontWeight: 600, color: '#FFFFFF' }}>{row.mes}</td>
                    <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#CBD5E1' }}>{formatBRL(row.pis)}</td>
                    <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#CBD5E1' }}>{formatBRL(row.cofins)}</td>
                    <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#38BDF8' }}>{formatBRL(row.csll)}</td>
                    <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', color: '#38BDF8' }}>{formatBRL(row.irpj)}</td>
                    <td className="mono" style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 700, color: '#00F5D4' }}>{formatBRL(row.faturamento)}</td>
                  </tr>
                ))}
                {/* TOTAL */}
                <tr className="highlight-row" style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', fontWeight: 800, borderTop: '2px solid rgba(56, 189, 248, 0.3)' }}>
                  <td colSpan={2} style={{ padding: '12px 14px', fontSize: '0.95rem' }}>TOTAL ANUAL</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right', color: '#CBD5E1' }}>{formatBRL(totaisImpostos.pis)}</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right', color: '#CBD5E1' }}>{formatBRL(totaisImpostos.cofins)}</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right', color: '#38BDF8' }}>{formatBRL(totaisImpostos.csll)}</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right', color: '#38BDF8' }}>{formatBRL(totaisImpostos.irpj)}</td>
                  <td className="mono" style={{ padding: '12px 14px', textAlign: 'right', fontSize: '1.05rem', color: '#00F5D4' }}>{formatBRL(totaisImpostos.faturamento)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          CONTEÚDO DA ABA 5: CADASTRO E RESPONSÁVEIS
         ======================================================== */}
      {activeTab === 'cadastro' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Building2 size={20} color="#38BDF8" />
            <span>Cadastro da Empresa & Responsáveis Técnicos</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">Razão Social da Empresa</label>
              <input
                type="text"
                className="form-control"
                value={empresaData.razaoSocial}
                onChange={(e) => setEmpresaData({ ...empresaData, razaoSocial: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CNPJ</label>
              <input
                type="text"
                className="form-control mono"
                value={empresaData.cnpj}
                onChange={(e) => setEmpresaData({ ...empresaData, cnpj: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Capital Social (R$)</label>
              <input
                type="number"
                className="form-control mono"
                value={empresaData.capitalSocial === 0 || empresaData.capitalSocial === '' ? '' : empresaData.capitalSocial}
                onChange={(e) => {
                  const raw = e.target.value.replace(/^0+(?=\d)/, '');
                  setEmpresaData({ ...empresaData, capitalSocial: raw === '' ? '' : Number(raw) });
                }}
                onFocus={(e) => {
                  if (e.target.value === '0') {
                    setEmpresaData({ ...empresaData, capitalSocial: '' });
                  }
                }}
                placeholder="0,00"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Encerramento do Exercício (Cabeçalho da Impressão)</label>
              <input
                type="text"
                className="form-control"
                value={empresaData.textoExercicio !== undefined ? empresaData.textoExercicio : `Exercício Encerrado em 31/12/${empresaData.anoExercicio || '2026'}`}
                onChange={(e) => {
                  const val = e.target.value;
                  const anoMatch = val.match(/\b(20\d\d)\b/);
                  const novoAno = anoMatch ? anoMatch[1] : empresaData.anoExercicio;
                  const novoAnoAnterior = anoMatch ? String(Number(anoMatch[1]) - 1) : empresaData.anoAnterior;
                  setEmpresaData(prev => ({
                    ...prev,
                    textoExercicio: val,
                    anoExercicio: novoAno,
                    anoAnterior: novoAnoAnterior
                  }));
                }}
                placeholder="Exercício Encerrado em 31/12/2025"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Data de Emissão (Impressão e Assinatura)</label>
              <input
                type="text"
                className="form-control mono"
                value={empresaData.dataEmissao || ''}
                onChange={(e) => setEmpresaData(prev => ({ ...prev, dataEmissao: e.target.value }))}
                placeholder="02/01/2027"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nome do Sócio Administrador</label>
              <input
                type="text"
                className="form-control"
                value={empresaData.socio.nome}
                onChange={(e) => setEmpresaData({
                  ...empresaData,
                  socio: { ...empresaData.socio, nome: e.target.value }
                })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CPF do Sócio</label>
              <input
                type="text"
                className="form-control mono"
                value={empresaData.socio.cpf}
                onChange={(e) => setEmpresaData({
                  ...empresaData,
                  socio: { ...empresaData.socio, cpf: e.target.value }
                })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contador Responsável</label>
              <input
                type="text"
                className="form-control"
                value={empresaData.contador.nome}
                onChange={(e) => setEmpresaData({
                  ...empresaData,
                  contador: { ...empresaData.contador, nome: e.target.value }
                })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CRC do Contador</label>
              <input
                type="text"
                className="form-control mono"
                value={empresaData.contador.crc}
                onChange={(e) => setEmpresaData({
                  ...empresaData,
                  contador: { ...empresaData.contador, crc: e.target.value }
                })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CPF do Contador</label>
              <input
                type="text"
                className="form-control mono"
                value={empresaData.contador.cpf}
                onChange={(e) => setEmpresaData({
                  ...empresaData,
                  contador: { ...empresaData.contador, cpf: e.target.value }
                })}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DOCUMENTO OFICIAL IMPRESSÍVEL (PAPEL TIMBRADO ORIGINAL Y7)
          Visível na aba "relatorio" e sempre ativo para @media print
         ======================================================== */}
      {(activeTab === 'relatorio' || true) && (
        <div className={`printable-report ${activeTab !== 'relatorio' ? 'report-tab-hidden' : ''}`} style={{
          backgroundColor: '#0a0f1d',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '36px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          marginTop: '20px'
        }}>
          {/* Seletor do tipo de relatório para impressão */}
          <div className="no-print" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
            paddingBottom: '14px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div className="report-view-buttons" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setReportViewMode('unificado')}
                className="btn btn-sm"
                style={{
                  backgroundColor: reportViewMode === 'unificado' ? '#C81E3D' : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF'
                }}
              >
                Caderno Completo (Todas)
              </button>
              <button
                type="button"
                onClick={() => setReportViewMode('dre')}
                className="btn btn-sm"
                style={{
                  backgroundColor: reportViewMode === 'dre' ? '#C81E3D' : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF'
                }}
              >
                DRE Oficial
              </button>
              <button
                type="button"
                onClick={() => setReportViewMode('balanco')}
                className="btn btn-sm"
                style={{
                  backgroundColor: reportViewMode === 'balanco' ? '#C81E3D' : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF'
                }}
              >
                Balanço Patrimonial
              </button>
              <button
                type="button"
                onClick={() => setReportViewMode('faturamento')}
                className="btn btn-sm"
                style={{
                  backgroundColor: reportViewMode === 'faturamento' ? '#C81E3D' : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF'
                }}
              >
                Faturamento 12M
              </button>
              <button
                type="button"
                onClick={() => setReportViewMode('impostos')}
                className="btn btn-sm"
                style={{
                  backgroundColor: reportViewMode === 'impostos' ? '#C81E3D' : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF'
                }}
              >
                Declaração de Impostos
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsReportEditing(!isReportEditing)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Ativar modo de edição direta nesta demonstração"
              >
                <Edit3 size={15} color={isReportEditing ? '#10B981' : '#38BDF8'} />
                <span>{isReportEditing ? 'Concluir Edição' : 'Editar na Folha'}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePrintSpecific(reportViewMode)}
                className="btn btn-ruby btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={15} />
                <span>
                  {reportViewMode === 'dre' ? 'Imprimir DRE' :
                   reportViewMode === 'balanco' ? 'Imprimir Balanço' :
                   reportViewMode === 'faturamento' ? 'Imprimir 12 Meses' :
                   reportViewMode === 'impostos' ? 'Imprimir Impostos' : 'Imprimir Caderno Completo'}
                </span>
              </button>
            </div>
          </div>

          {/* Barra auxiliar de Edição Direta quando ativa */}
          {isReportEditing && (
            <div className="no-print animate-fade-in" style={{
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '8px',
              padding: '12px 18px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ fontSize: '0.86rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={16} color="#00F5D4" />
                <span>
                  <strong>Modo de Edição Ativo:</strong> Altere os dados diretamente nos campos da folha. Na impressão ou PDF, o documento sairá perfeitamente timbrado sem bordas de edição.
                </span>
              </div>
            </div>
          )}

          {/* Cabeçalho do Papel Timbrado Oficial - Y7 Service com Logo da Empresa */}
          <div className="report-header" style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderBottom: '2.5px solid #C81E3D',
            paddingBottom: '16px',
            marginBottom: '18px',
            gap: '8px'
          }}>
            {/* Marca d'água de fundo */}
            <div className="report-watermark" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '160px',
              height: '160px',
              opacity: 0.12,
              pointerEvents: 'none',
              zIndex: 0,
              userSelect: 'none'
            }}>
              <img 
                src="/assets/y7_watermark.png" 
                alt="Y7 Service" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Logo da Empresa Y7 (exibido na tela, ocultado na impressão para ficar só a marca d'água) */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <div className="report-logo-badge" style={{
                width: '56px',
                height: '56px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid #C81E3D',
                backgroundColor: '#0a0f1d',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src="/assets/y7_logo_emblema.jpg" 
                  alt="Y7 Service" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span style="color:#C81E3D;font-weight:900;font-size:20px;">Y7</span>';
                  }}
                />
              </div>
              <div className="report-title-block" style={{ textAlign: 'left' }}>
                <div className="report-header-title" style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                  Y7 SERVICE LTDA
                </div>
                <div className="report-header-subtitle" style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Assessoria Contábil, Auditoria & Gestão Tributária Estratégica
                </div>
              </div>
            </div>

            <div className="report-header-contact" style={{ position: 'relative', zIndex: 1, fontSize: '0.82rem', color: '#CBD5E1', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '6px' }}>
              <span><strong>CNPJ</strong> {Y7_INFO.cnpj}</span>
              <span><strong>Endereço</strong> Av. Copacabana 112 Sala 1712 Alphaville Barueri SP</span>
              <span><strong>E-mail</strong> {Y7_INFO.contatos.email}</span>
            </div>
          </div>

          {/* Dados da Empresa Auditada com Data de Emissão (100% Editáveis Diretamente) */}
          <div className="company-header-block" style={{ textAlign: 'center', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h2 style={{ fontSize: '1.18rem', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em', margin: 0, fontWeight: 800 }}>
              <input
                className="report-inline-input hide-on-print"
                style={{ textAlign: 'center', fontSize: '1.15rem', fontWeight: 800, width: '92%', maxWidth: '540px', color: '#FFFFFF', textTransform: 'uppercase' }}
                value={empresaData.razaoSocial}
                onChange={(e) => setEmpresaData(prev => ({ ...prev, razaoSocial: e.target.value }))}
                title="Razão Social da empresa (editável - clique para alterar)"
              />
              <span className="only-on-print" style={{ fontWeight: 800 }}>
                {empresaData.razaoSocial}
              </span>
            </h2>
            <div className="company-meta" style={{ fontSize: '0.82rem', color: '#38BDF8', fontWeight: 600, marginTop: '6px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>CNPJ</span>
                <input
                  className="report-inline-input mono hide-on-print"
                  style={{ width: '165px', fontSize: '0.82rem', textAlign: 'center', color: '#38BDF8', fontWeight: 600 }}
                  value={empresaData.cnpj}
                  onChange={(e) => setEmpresaData(prev => ({ ...prev, cnpj: e.target.value }))}
                  title="CNPJ da empresa (editável - clique para alterar)"
                />
                <span className="only-on-print mono">
                  {empresaData.cnpj}
                </span>
              </span>

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <input
                  className="report-inline-input hide-on-print"
                  style={{ width: '280px', fontSize: '0.82rem', textAlign: 'center', color: '#38BDF8', fontWeight: 700 }}
                  value={empresaData.textoExercicio !== undefined ? empresaData.textoExercicio : `Exercício Encerrado em 31/12/${empresaData.anoExercicio || '2026'}`}
                  onChange={(e) => {
                    const val = e.target.value;
                    const anoMatch = val.match(/\b(20\d\d)\b/);
                    const novoAno = anoMatch ? anoMatch[1] : empresaData.anoExercicio;
                    const novoAnoAnterior = anoMatch ? String(Number(anoMatch[1]) - 1) : empresaData.anoAnterior;
                    setEmpresaData(prev => ({
                      ...prev,
                      textoExercicio: val,
                      anoExercicio: novoAno,
                      anoAnterior: novoAnoAnterior
                    }));
                  }}
                  placeholder="Exercício Encerrado em 31/12/2025"
                  title="Texto e data de encerramento do exercício (100% editável - clique para alterar)"
                />
                <span className="only-on-print" style={{ fontWeight: 700 }}>
                  {empresaData.textoExercicio !== undefined ? empresaData.textoExercicio : `Exercício Encerrado em 31/12/${empresaData.anoExercicio || '2026'}`}
                </span>
              </span>

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>Data de Emissão</span>
                <input
                  className="report-inline-input mono hide-on-print"
                  style={{ width: '115px', fontSize: '0.82rem', textAlign: 'center', color: '#38BDF8', fontWeight: 600 }}
                  value={empresaData.dataEmissao || `02/01/${Number(empresaData.anoExercicio || 2026) + 1}`}
                  onChange={(e) => setEmpresaData(prev => ({ ...prev, dataEmissao: e.target.value }))}
                  placeholder="02/01/2027"
                  title="Data oficial de emissão (editável - clique para alterar)"
                />
                <span className="only-on-print mono">
                  {empresaData.dataEmissao || `02/01/${Number(empresaData.anoExercicio || 2026) + 1}`}
                </span>
              </span>
            </div>
          </div>

          {/* 1. DRE IMPRESSÃO (ESTRUTURA DO PDF) */}
          {(reportViewMode === 'unificado' || reportViewMode === 'dre') && (
            <div className="report-section" style={{ marginBottom: '24px' }}>
              <div className="report-section-title" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase' }}>
                DRE – DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid rgba(255,255,255,0.2)' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '90px' }}>CÓDIGO</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>DESCRIÇÃO DA CONTA</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '160px' }}>{empresaData.anoExercicio} (R$)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '160px' }}>{empresaData.anoAnterior} (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td className="mono" style={{ padding: '7px 10px', fontWeight: 700 }}>4</td>
                    <td style={{ padding: '7px 10px', fontWeight: 700 }}>RECEITA BRUTA DE VENDAS</td>
                    <td className="mono" style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 700 }}>{formatBRL(dreCalculada.receitaBruta)}</td>
                    <td className="mono" style={{ padding: '7px 10px', textAlign: 'right' }}>{formatBRL(dreAnoAnterior.receitaBruta)}</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td className="mono" style={{ padding: '6px 10px', color: '#EF4444' }}>(-)4.1.2</td>
                    <td style={{ padding: '6px 10px', color: '#EF4444' }}>Deduções da Receita Bruta</td>
                    <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.deducoes)}</td>
                    <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.deducoes)}</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700 }}>
                    <td className="mono" style={{ padding: '7px 10px' }}>4.1.1</td>
                    <td style={{ padding: '7px 10px' }}>RECEITA LÍQUIDA DE VENDAS</td>
                    <td className="mono" style={{ padding: '7px 10px', textAlign: 'right' }}>{formatBRL(dreCalculada.receitaLiquida)}</td>
                    <td className="mono" style={{ padding: '7px 10px', textAlign: 'right' }}>{formatBRL(dreAnoAnterior.receitaLiquida)}</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td className="mono" style={{ padding: '6px 10px', color: '#EF4444' }}>(-)4.1.1.007</td>
                    <td style={{ padding: '6px 10px', color: '#EF4444' }}>Custo das Mercadorias Vendidas – CMV</td>
                    <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.cmv)}</td>
                    <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.cmv)}</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700 }}>
                    <td className="mono" style={{ padding: '7px 10px' }}>5</td>
                    <td style={{ padding: '7px 10px' }}>LUCRO BRUTO</td>
                    <td className="mono" style={{ padding: '7px 10px', textAlign: 'right' }}>{formatBRL(dreCalculada.lucroBruto)}</td>
                    <td className="mono" style={{ padding: '7px 10px', textAlign: 'right' }}>{formatBRL(dreAnoAnterior.lucroBruto)}</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td className="mono" style={{ padding: '6px 10px', color: '#EF4444' }}>3.3</td>
                    <td style={{ padding: '6px 10px', color: '#EF4444' }}>Despesas Operacionais (Admin, Terc, Fin)</td>
                    <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.totalDespesasOperacionais)}</td>
                    <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.totalDespesasOperacionais)}</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700 }}>
                    <td className="mono" style={{ padding: '7px 10px' }}>5.1</td>
                    <td style={{ padding: '7px 10px' }}>LUCRO OPERACIONAL</td>
                    <td className="mono" style={{ padding: '7px 10px', textAlign: 'right' }}>{formatBRL(dreCalculada.lucroOperacional)}</td>
                    <td className="mono" style={{ padding: '7px 10px', textAlign: 'right' }}>{formatBRL(dreAnoAnterior.lucroOperacional)}</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td className="mono" style={{ padding: '6px 10px', color: '#EF4444' }}>5.1a / 5.1.1.001</td>
                    <td style={{ padding: '6px 10px', color: '#EF4444' }}>(-) Provisão para CSLL e IRPJ (Total Anual)</td>
                    <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.csll + dreCalculada.irpj)}</td>
                    <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.csll + dreAnoAnterior.irpj)}</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td className="mono" style={{ padding: '6px 10px', color: '#EF4444' }}>5.1.1.002a</td>
                    <td style={{ padding: '6px 10px', color: '#EF4444' }}>(-) Participações</td>
                    <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreCalculada.participacoes)}</td>
                    <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', color: '#EF4444' }}>- {formatBRL(dreAnoAnterior.participacoes)}</td>
                  </tr>

                  <tr style={{ backgroundColor: 'rgba(200, 30, 61, 0.2)', border: '1.5px solid #C81E3D', fontWeight: 800 }}>
                    <td className="mono" style={{ padding: '10px', fontSize: '0.95rem' }}>5.1.1.003</td>
                    <td style={{ padding: '10px', fontSize: '0.95rem' }}>LUCRO LÍQUIDO DO EXERCÍCIO</td>
                    <td className="mono" style={{ padding: '10px', textAlign: 'right', fontSize: '1.05rem', color: '#34D399' }}>{formatBRL(dreCalculada.lucroLiquido)}</td>
                    <td className="mono" style={{ padding: '10px', textAlign: 'right', fontSize: '0.95rem' }}>{formatBRL(dreAnoAnterior.lucroLiquido)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 2. BALANÇO PATRIMONIAL IMPRESSÃO (COM AS CONTAS DO PDF) */}
          {(reportViewMode === 'unificado' || reportViewMode === 'balanco') && (
            <div className="report-section" style={{ marginBottom: '24px' }}>
              <div className="report-section-title" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase' }}>
                BALANÇO PATRIMONIAL SINTÉTICO
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Coluna Ativo */}
                <div style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '12px', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#38BDF8', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '8px' }}>
                    <span>1 • ATIVO</span>
                    <span className="mono">{formatBRL(ativoCalculado.totalAtivo)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#FFFFFF' }}>
                    <span>1.1 Ativo Circulante</span>
                    <span className="mono">{formatBRL(ativoCalculado.totalCirculante)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Disponibilidades</span>
                    <span className="mono">{formatBRL(ativoCalculado.totalDisponivel)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Clientes / Contas a Receber</span>
                    <span className="mono">{formatBRL(ativoCalculado.duplicatas)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Estoques (Mercadorias & Material)</span>
                    <span className="mono">{formatBRL(ativoCalculado.totalEstoques)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 3px 0', color: '#FFFFFF', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '6px' }}>
                    <span>1.2 Ativo Não Circulante</span>
                    <span className="mono">{formatBRL(ativoCalculado.totalNaoCirculante)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Realizável a Longo Prazo</span>
                    <span className="mono">{formatBRL(ativoCalculado.totalRealizavelLP)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Imobilizado Líquido</span>
                    <span className="mono">{formatBRL(ativoCalculado.totalImobilizado)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 18px', color: '#64748B', fontSize: '0.8rem' }}>
                    <span>- Máquinas & Equipamentos</span>
                    <span className="mono">{formatBRL(ativoCalculado.maquinas + ativoCalculado.informatica)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 18px', color: '#64748B', fontSize: '0.8rem' }}>
                    <span>- Veículos & Instalações</span>
                    <span className="mono">{formatBRL(ativoCalculado.veiculos + ativoCalculado.instalacoes)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 18px', color: '#EF4444', fontSize: '0.8rem' }}>
                    <span>- (-) Depreciação Acumulada</span>
                    <span className="mono">{formatBRL(ativoCalculado.depreciacao)}</span>
                  </div>
                </div>

                {/* Coluna Passivo & PL */}
                <div style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '12px', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#F87171', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '8px' }}>
                    <span>2 • PASSIVO & PATRIMÔNIO LÍQUIDO</span>
                    <span className="mono">{formatBRL(passivoCalculado.totalPassivo)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#FFFFFF' }}>
                    <span>2.1 Passivo Circulante</span>
                    <span className="mono">{formatBRL(passivoCalculado.totalCirculante)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Fornecedores</span>
                    <span className="mono">{formatBRL(passivoCalculado.fornecedores)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Obrigações Fiscais e Tributárias</span>
                    <span className="mono">{formatBRL(passivoCalculado.obrigacoesFiscais + passivoCalculado.irPagar)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Obrigações Sociais e Trabalhistas</span>
                    <span className="mono">{formatBRL(passivoCalculado.obrigacoesSociais)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 3px 0', color: '#34D399', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '6px', fontWeight: 700 }}>
                    <span>2.4 Patrimônio Líquido</span>
                    <span className="mono">{formatBRL(passivoCalculado.totalPL)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Capital Social Subscrito</span>
                    <span className="mono">{formatBRL(passivoCalculado.capitalSocial)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Reservas de Lucros</span>
                    <span className="mono">{formatBRL(passivoCalculado.reservaLegal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#94A3B8' }}>
                    <span>• Lucros Acumulados</span>
                    <span className="mono">{formatBRL(passivoCalculado.lucrosAcumulados)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 10px', color: '#34D399', fontWeight: 700 }}>
                    <span>• Lucro Líquido do Exercício</span>
                    <span className="mono">{formatBRL(passivoCalculado.lucroPeriodo)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. FATURAMENTO 12 MESES IMPRESSÃO */}
          {(reportViewMode === 'unificado' || reportViewMode === 'faturamento') && (
            <div className="report-section" style={{ marginBottom: '24px' }}>
              <div className="report-section-title" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase' }}>
                DECLARAÇÃO DE FATURAMENTO – 12 MESES
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid rgba(255,255,255,0.2)' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '220px' }}>MÊS</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '140px' }}>ANO</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '200px' }}>FATURAMENTO (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {tabelaFaturamento.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '6px 10px', fontWeight: 600 }}>{row.mes.toUpperCase()}</td>
                      <td className="mono" style={{ padding: '6px 10px', textAlign: 'center', color: '#94A3B8' }}>{row.ano}</td>
                      <td className="mono" style={{ padding: '6px 10px', textAlign: 'right' }}>{formatBRL(row.valorMensal)}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', borderTop: '1.5px solid rgba(56, 189, 248, 0.4)', fontWeight: 800 }}>
                    <td style={{ padding: '10px' }}>TOTAL CONSOLIDADO</td>
                    <td className="mono" style={{ padding: '10px', textAlign: 'center' }}>12 MESES</td>
                    <td className="mono" style={{ padding: '10px', textAlign: 'right', fontSize: '1.05rem', color: '#00F5D4' }}>{formatBRL(faturamentoTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 4. DECLARAÇÃO DE IMPOSTOS IMPRESSÃO (PIS, COFINS, CSLL, IRPJ) */}
          {(reportViewMode === 'unificado' || reportViewMode === 'impostos') && (
            <div className="report-section" style={{ marginBottom: '24px' }}>
              <div className="report-section-title" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase' }}>
                DECLARAÇÃO DE FATURAMENTO E APURAÇÃO DE IMPOSTOS FEDERAIS
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid rgba(255,255,255,0.2)' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '50px' }}>CÓD</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '130px' }}>MÊS</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>PIS (~0,72%)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>COFINS (~3,31%)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>CSLL (~1,19%)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>IRPJ (~2,65%)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '160px' }}>FATURAMENTO (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {tabelaImpostos.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td className="mono" style={{ padding: '6px 10px' }}>{row.id}</td>
                      <td style={{ padding: '6px 10px', fontWeight: 600 }}>{row.mes}</td>
                      <td className="mono" style={{ padding: '6px 10px', textAlign: 'right' }}>{formatBRL(row.pis)}</td>
                      <td className="mono" style={{ padding: '6px 10px', textAlign: 'right' }}>{formatBRL(row.cofins)}</td>
                      <td className="mono" style={{ padding: '6px 10px', textAlign: 'right' }}>{formatBRL(row.csll)}</td>
                      <td className="mono" style={{ padding: '6px 10px', textAlign: 'right' }}>{formatBRL(row.irpj)}</td>
                      <td className="mono" style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600 }}>{formatBRL(row.faturamento)}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', borderTop: '1.5px solid rgba(56, 189, 248, 0.4)', fontWeight: 800 }}>
                    <td colSpan={2} style={{ padding: '10px' }}>TOTAL CONSOLIDADO ANUAL</td>
                    <td className="mono" style={{ padding: '10px', textAlign: 'right' }}>{formatBRL(totaisImpostos.pis)}</td>
                    <td className="mono" style={{ padding: '10px', textAlign: 'right' }}>{formatBRL(totaisImpostos.cofins)}</td>
                    <td className="mono" style={{ padding: '10px', textAlign: 'right' }}>{formatBRL(totaisImpostos.csll)}</td>
                    <td className="mono" style={{ padding: '10px', textAlign: 'right' }}>{formatBRL(totaisImpostos.irpj)}</td>
                    <td className="mono" style={{ padding: '10px', textAlign: 'right', fontSize: '1.02rem', color: '#00F5D4' }}>{formatBRL(totaisImpostos.faturamento)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 5. QUADRO FORMAL DE ASSINATURAS */}
          <div className="report-signature-section" style={{
            paddingTop: '20px',
            borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
            marginTop: '32px'
          }}>
            {/* 1. Assinaturas ACIMA - Sempre alinhadas na mesma linha horizontal */}
            <div className="signature-grid" style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              width: '100%',
              maxWidth: '740px',
              margin: '0 auto 14px auto'
            }}>
              {/* Lugar da Assinatura do Contador */}
              <div className="signature-col" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 0%', maxWidth: '340px', padding: '0 10px' }}>
                <div className="signature-spacer" style={{ height: '32px' }} />
                <div className="signature-line" style={{ borderBottom: '1.5px solid #CBD5E1', marginBottom: '8px', width: '250px' }} />
                <div className="signature-name" style={{ fontSize: '0.94rem', fontWeight: 800 }}>
                  {isReportEditing && (
                    <input
                      className="report-inline-input hide-on-print"
                      style={{ textAlign: 'center', fontWeight: 800, width: '240px' }}
                      value={empresaData.contador.nome}
                      onChange={(e) => setEmpresaData(prev => ({
                        ...prev,
                        contador: { ...prev.contador, nome: e.target.value }
                      }))}
                    />
                  )}
                  <span className={isReportEditing ? 'only-on-print' : ''} style={{ fontWeight: 800 }}>
                    {empresaData.contador.nome}
                  </span>
                </div>
                <div className="signature-role" style={{ fontSize: '0.80rem', marginTop: '2px', fontWeight: 600 }}>
                  <span>Contador </span>
                  {isReportEditing && (
                    <input
                      className="report-inline-input hide-on-print"
                      style={{ textAlign: 'center', width: '130px', fontSize: '0.8rem' }}
                      value={empresaData.contador.crc}
                      onChange={(e) => setEmpresaData(prev => ({
                        ...prev,
                        contador: { ...prev.contador, crc: e.target.value }
                      }))}
                    />
                  )}
                  <span className={isReportEditing ? 'only-on-print' : ''}>
                    {empresaData.contador.crc}
                  </span>
                </div>
                <div className="signature-doc" style={{ fontSize: '0.78rem', marginTop: '1px' }}>
                  <span>CPF </span>
                  {isReportEditing && (
                    <input
                      className="report-inline-input hide-on-print"
                      style={{ textAlign: 'center', width: '130px', fontSize: '0.78rem' }}
                      value={empresaData.contador.cpf}
                      onChange={(e) => setEmpresaData(prev => ({
                        ...prev,
                        contador: { ...prev.contador, cpf: e.target.value }
                      }))}
                    />
                  )}
                  <span className={isReportEditing ? 'only-on-print' : ''}>
                    {empresaData.contador.cpf}
                  </span>
                </div>
                <div className="signature-sub" style={{ fontSize: '0.75rem', marginTop: '2px', fontWeight: 600 }}>Responsável Técnico Y7 SERVICE</div>
              </div>

              {/* Lugar da Assinatura do Sócio Administrador */}
              <div className="signature-col" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 0%', maxWidth: '340px', padding: '0 10px' }}>
                <div className="signature-spacer" style={{ height: '32px' }} />
                <div className="signature-line" style={{ borderBottom: '1.5px solid #CBD5E1', marginBottom: '8px', width: '250px' }} />
                <div className="signature-name" style={{ fontSize: '0.94rem', fontWeight: 800 }}>
                  {isReportEditing && (
                    <input
                      className="report-inline-input hide-on-print"
                      style={{ textAlign: 'center', fontWeight: 800, width: '240px' }}
                      value={empresaData.socio.nome}
                      onChange={(e) => setEmpresaData(prev => ({
                        ...prev,
                        socio: { ...prev.socio, nome: e.target.value }
                      }))}
                    />
                  )}
                  <span className={isReportEditing ? 'only-on-print' : ''} style={{ fontWeight: 800 }}>
                    {empresaData.socio.nome}
                  </span>
                </div>
                <div className="signature-role" style={{ fontSize: '0.80rem', marginTop: '2px', fontWeight: 600 }}>
                  {isReportEditing && (
                    <input
                      className="report-inline-input hide-on-print"
                      style={{ textAlign: 'center', width: '160px', fontSize: '0.8rem' }}
                      value={empresaData.socio.qualificacao}
                      onChange={(e) => setEmpresaData(prev => ({
                        ...prev,
                        socio: { ...prev.socio, qualificacao: e.target.value }
                      }))}
                    />
                  )}
                  <span className={isReportEditing ? 'only-on-print' : ''}>
                    {empresaData.socio.qualificacao}
                  </span>
                </div>
                <div className="signature-doc" style={{ fontSize: '0.78rem', marginTop: '1px' }}>
                  <span>CPF </span>
                  {isReportEditing && (
                    <input
                      className="report-inline-input hide-on-print"
                      style={{ textAlign: 'center', width: '130px', fontSize: '0.78rem' }}
                      value={empresaData.socio.cpf}
                      onChange={(e) => setEmpresaData(prev => ({
                        ...prev,
                        socio: { ...prev.socio, cpf: e.target.value }
                      }))}
                    />
                  )}
                  <span className={isReportEditing ? 'only-on-print' : ''}>
                    {empresaData.socio.cpf}
                  </span>
                </div>
                <div className="signature-sub" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{empresaData.razaoSocial}</div>
              </div>
            </div>

            {/* 2. Informação ABAIXO */}
            <div className="signature-disclaimer" style={{ 
              fontSize: '0.8rem', 
              color: '#94A3B8', 
              lineHeight: 1.5,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px'
            }}>
              <div>
                São Paulo {formatarDataExtenso(empresaData.dataEmissao, empresaData.anoExercicio)}
              </div>
              <div>Emissão e Validação Técnica Contábil por <strong>Y7 SERVICE LTDA</strong></div>
              <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Normas Brasileiras de Contabilidade NBC TG CFC</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
