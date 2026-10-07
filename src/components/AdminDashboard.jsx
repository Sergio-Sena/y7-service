import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Plus, 
  Search, 
  CalendarPlus, 
  FileText, 
  BarChart3, 
  Check, 
  Trash2, 
  Edit3,
  Bell,
  Printer,
  UserCog,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { fetchUsuarios, saveUsuario, deleteUsuario } from '../lib/db';
import { Y7_INFO } from '../data/initialData';
import { generateGoogleCalendarUrl, exportToIcsCalendar } from '../utils/googleCalendar';
import ClientModal from './ClientModal';
import ProtocolModal from './ProtocolModal';
import FinancialStatementsEditor from './FinancialStatementsEditor';

export default function AdminDashboard({ 
  clients, 
  setClients, 
  obligations, 
  setObligations,
  onOpenAlertPopup,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  saveCliente,
  deleteCliente,
  saveObrigacao,
  deleteObrigacao
}) {
  const [localActiveTab, setLocalActiveTab] = useState('obrigacoes');
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propSetActiveTab || setLocalActiveTab;
  const [filtroRegime, setFiltroRegime] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [termoBusca, setTermoBusca] = useState('');
  
  // Modais
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [selectedObligation, setSelectedObligation] = useState(null);

  // Cliente selecionado para demonstrativo
  const [selectedClientForReport, setSelectedClientForReport] = useState(clients[0]?.id || '');

  // Usuários
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', perfil: 'contador' });
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    if (activeTab === 'usuarios') {
      fetchUsuarios().then(setUsuarios).catch(() => {});
    }
  }, [activeTab]);

  const handleSaveUsuario = async (e) => {
    e.preventDefault();
    await saveUsuario(novoUsuario);
    const lista = await fetchUsuarios();
    setUsuarios(lista);
    setNovoUsuario({ nome: '', email: '', perfil: 'contador' });
    setShowUserForm(false);
  };

  const handleDeleteUsuario = async (id) => {
    if (window.confirm('Remover este usuário?')) {
      await deleteUsuario(id);
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  // Nova obrigação rápida
  const [showAddObligationForm, setShowAddObligationForm] = useState(false);
  const [newObData, setNewObData] = useState({
    clienteId: clients[0]?.id || '',
    obrigacao: 'DCTFWeb',
    competencia: '10/2026',
    vencimento: '2026-10-15',
    observacao: ''
  });

  // Estatísticas
  const totalClientes = clients.length;
  const totalObrigacoes = obligations.length;
  const entregues = obligations.filter(o => o.status === 'Entregue').length;
  const pendentes = obligations.filter(o => o.status === 'Pendente').length;
  const atrasados = obligations.filter(o => o.status === 'Atrasado').length;

  const percentualEntregue = totalObrigacoes > 0 ? Math.round((entregues / totalObrigacoes) * 100) : 100;

  // Filtragem
  const obrigacoesFiltradas = obligations.filter(ob => {
    const matchRegime = filtroRegime === 'Todos' || ob.regime === filtroRegime;
    const matchStatus = filtroStatus === 'Todos' || ob.status === filtroStatus;
    const matchBusca = termoBusca === '' || 
      ob.clienteNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      ob.cnpj.includes(termoBusca) ||
      ob.obrigacao.toLowerCase().includes(termoBusca.toLowerCase());
    return matchRegime && matchStatus && matchBusca;
  });

  const handleSaveClient = async (clientData) => {
    await saveCliente(clientData);
    if (editingClient) {
      setClients(clients.map(c => c.id === clientData.id ? clientData : c));
    } else {
      setClients([clientData, ...clients]);
    }
    setEditingClient(null);
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Deseja realmente remover este cliente e suas obrigações?')) {
      await deleteCliente(id);
      setClients(clients.filter(c => c.id !== id));
      setObligations(obligations.filter(o => o.clienteId !== id));
    }
  };

  const handleUpdateObligation = async (updated) => {
    await saveObrigacao(updated);
    setObligations(obligations.map(o => o.id === updated.id ? updated : o));
  };

  const handleCreateObligation = async (e) => {
    e.preventDefault();
    const targetId = newObData.clienteId || clients[0]?.id;
    const cliente = clients.find(c => c.id === targetId);
    if (!cliente) {
      alert('Cadastre pelo menos um cliente antes de lançar uma obrigação.');
      return;
    }

    const nova = {
      id: `ob-${Date.now()}`,
      clienteId: cliente.id,
      clienteNome: cliente.razaoSocial,
      cnpj: cliente.cnpj,
      regime: cliente.regime,
      obrigacao: newObData.obrigacao,
      competencia: newObData.competencia,
      vencimento: newObData.vencimento,
      status: 'Pendente',
      protocolo: null,
      dataEntrega: null,
      responsavel: 'Contador Responsável Y7',
      observacao: newObData.observacao
    };

    await saveObrigacao(nova);
    setObligations([nova, ...obligations]);
    setShowAddObligationForm(false);
  };

  const handleExportAllToGoogleCalendar = () => {
    const success = exportToIcsCalendar(obligations, `Y7_Obrigacoes_Contabeis.ics`);
    if (success) {
      alert('Arquivo de calendário (.ics) baixado com sucesso!\nImporte no Google Agenda para ativar todos os alarmes automáticos.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Entregue':
        return <span className="badge badge-entregue"><Check size={12} /> Entregue</span>;
      case 'Em Andamento':
        return <span className="badge badge-andamento"><Clock size={12} /> Em Andamento</span>;
      case 'Pendente':
        return <span className="badge badge-pendente"><AlertTriangle size={12} /> Pendente</span>;
      case 'Atrasado':
        return <span className="badge badge-atrasado"><AlertTriangle size={12} /> Atrasado</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '36px 0 70px 0' }}>
      <div className="container">
        {/* Header do Painel */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '18px',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                backgroundColor: 'rgba(200, 30, 61, 0.18)',
                color: '#F87171',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.76rem',
                fontWeight: 700
              }}>
                PAINEL DO CONTADOR
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                Usuário Conectado: <strong>Admin</strong>
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginTop: '4px' }}>
              Gestão Fiscal & Obrigações Conectadas
            </h1>
            <div style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
              {Y7_INFO.razaoSocial} • Alphaville Barueri/SP
            </div>
          </div>

          {/* Ações Globais */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={onOpenAlertPopup}
              className="btn btn-secondary btn-sm"
              style={{ color: '#F59E0B', borderColor: 'rgba(245, 158, 11, 0.4)' }}
              title="Visualizar popup com alerta dos prazos"
            >
              <Bell size={15} />
              <span>Ver Alertas de Prazos</span>
            </button>

            <button
              onClick={handleExportAllToGoogleCalendar}
              className="btn btn-outline-blue btn-sm"
              title="Baixar arquivo de integração para o Google Agenda"
            >
              <CalendarPlus size={15} />
              <span>Sincronizar Google Agenda (.ics)</span>
            </button>

            <button
              onClick={() => { setEditingClient(null); setIsClientModalOpen(true); }}
              className="btn btn-ruby btn-sm"
            >
              <Plus size={15} />
              <span>Novo Cliente</span>
            </button>
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="no-print" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Clientes Ativos
              </span>
              <Users size={16} color="#38BDF8" />
            </div>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: '6px 0' }}>
              {totalClientes}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
              Carteira real gerenciada
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Entregas Concluídas
              </span>
              <CheckCircle2 size={16} color="#10B981" />
            </div>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', margin: '6px 0' }}>
              {entregues} <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>/ {totalObrigacoes}</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600 }}>
              {totalObrigacoes > 0 ? `${percentualEntregue}% de conformidade` : '100% em dia (Sem pendências)'}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Pendentes a Entregar
              </span>
              <Clock size={16} color="#F59E0B" />
            </div>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B', margin: '6px 0' }}>
              {pendentes}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
              Conectadas com alertas
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Atrasadas
              </span>
              <AlertTriangle size={16} color="#EF4444" />
            </div>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: atrasados > 0 ? '#EF4444' : '#10B981', margin: '6px 0' }}>
              {atrasados}
            </div>
            <div style={{ fontSize: '0.74rem', color: atrasados > 0 ? '#EF4444' : '#10B981' }}>
              {atrasados > 0 ? 'Prioridade de entrega' : 'Nenhuma em atraso'}
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="no-print" style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '24px',
          gap: '8px'
        }}>
          {[
            { id: 'obrigacoes', label: 'Obrigações Fiscais (Google Calendar)', icon: <FileText size={15} /> },
            { id: 'clientes', label: 'Cadastro de Clientes Reais', icon: <Building2 size={15} /> },
            { id: 'demonstrativos', label: 'Emissão DRE & Balanço', icon: <BarChart3 size={15} /> },
            { id: 'usuarios', label: 'Usuários do Sistema', icon: <UserCog size={15} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #C81E3D' : '3px solid transparent',
                color: activeTab === tab.id ? '#FFFFFF' : '#94A3B8',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ========================================================
            ABA 1: MATRIZ DE OBRIGAÇÕES COM GOOGLE AGENDA
           ======================================================== */}
        {activeTab === 'obrigacoes' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
                <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '36px', fontSize: '0.86rem' }}
                  placeholder="Buscar por Empresa, CNPJ ou Obrigação..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '0.84rem', width: 'auto' }}
                value={filtroRegime}
                onChange={(e) => setFiltroRegime(e.target.value)}
              >
                <option value="Todos">Todos os Regimes</option>
                <option value="Simples Nacional">Simples Nacional</option>
                <option value="Lucro Presumido">Lucro Presumido</option>
                <option value="Lucro Real">Lucro Real</option>
              </select>

              <select
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '0.84rem', width: 'auto' }}
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="Todos">Todos os Status</option>
                <option value="Entregue">🟢 Entregues</option>
                <option value="Pendente">🟡 Pendentes</option>
                <option value="Atrasado">🔴 Atrasados</option>
              </select>

              <button
                onClick={() => setShowAddObligationForm(!showAddObligationForm)}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} />
                <span>{showAddObligationForm ? 'Fechar' : '+ Nova Obrigação'}</span>
              </button>
            </div>

            {/* Formulário de Nova Obrigação */}
            {showAddObligationForm && (
              <form onSubmit={handleCreateObligation} style={{
                backgroundColor: 'rgba(200, 30, 61, 0.08)',
                border: '1px solid rgba(200, 30, 61, 0.25)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                  Lançar Obrigação para Monitoramento
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  <div>
                    <label className="form-label">Cliente</label>
                    <select
                      className="form-control"
                      value={newObData.clienteId || clients[0]?.id || ''}
                      onChange={(e) => setNewObData({ ...newObData, clienteId: e.target.value })}
                    >
                      {clients.length === 0 ? (
                        <option value="">Nenhum cliente cadastrado (cadastre primeiro)</option>
                      ) : (
                        clients.map(c => (
                          <option key={c.id} value={c.id}>{c.razaoSocial}</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Obrigação</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: DCTFWeb, PGDAS-D"
                      value={newObData.obrigacao}
                      onChange={(e) => setNewObData({ ...newObData, obrigacao: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Competência</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="10/2026"
                      value={newObData.competencia}
                      onChange={(e) => setNewObData({ ...newObData, competencia: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Data de Vencimento</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newObData.vencimento}
                      onChange={(e) => setNewObData({ ...newObData, vencimento: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button type="submit" className="btn btn-ruby btn-sm">
                    Salvar e Conectar ao Calendário
                  </button>
                </div>
              </form>
            )}

            {/* Tabela de Obrigações */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', color: '#94A3B8' }}>
                    <th style={{ padding: '10px 12px' }}>Empresa / CNPJ</th>
                    <th style={{ padding: '10px 12px' }}>Regime</th>
                    <th style={{ padding: '10px 12px' }}>Obrigação Fiscal</th>
                    <th style={{ padding: '10px 12px' }}>Competência</th>
                    <th style={{ padding: '10px 12px' }}>Vencimento</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px' }}>Recibo / Protocolo</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Google Agenda / Baixa</th>
                  </tr>
                </thead>
                <tbody>
                  {obrigacoesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '36px 20px', textAlign: 'center', color: '#94A3B8' }}>
                        <div style={{ fontSize: '1rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '6px' }}>
                          Nenhuma obrigação fiscal lançada no momento.
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '14px' }}>
                          A carteira está limpa e pronta para ser alimentada pela equipe de contadores.
                        </div>
                        <button
                          onClick={() => setShowAddObligationForm(true)}
                          className="btn btn-ruby btn-sm"
                        >
                          <Plus size={14} />
                          <span>+ Lançar Primeira Obrigação</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    obrigacoesFiltradas.map((ob) => {
                      const googleCalendarUrl = generateGoogleCalendarUrl(ob);

                      return (
                        <tr 
                          key={ob.id}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{ob.clienteNome}</div>
                            <div className="mono" style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{ob.cnpj}</div>
                          </td>

                          <td style={{ padding: '12px' }}>
                            <span style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>{ob.regime}</span>
                          </td>

                          <td style={{ padding: '12px' }}>
                            <strong style={{ color: '#F8FAFC' }}>{ob.obrigacao}</strong>
                          </td>

                          <td style={{ padding: '12px' }}>
                            <span className="mono">{ob.competencia}</span>
                          </td>

                          <td style={{ padding: '12px' }}>
                            <div className="mono" style={{ fontWeight: 600, color: ob.status === 'Atrasado' ? '#EF4444' : '#FFFFFF' }}>
                              {ob.vencimento.split('-').reverse().join('/')}
                            </div>
                          </td>

                          <td style={{ padding: '12px' }}>
                            {getStatusBadge(ob.status)}
                          </td>

                          <td style={{ padding: '12px' }}>
                            {ob.protocolo ? (
                              <span className="mono" style={{ fontSize: '0.75rem', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                {ob.protocolo}
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Pendente</span>
                            )}
                          </td>

                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              <a
                                href={googleCalendarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Adicionar ao Google Agenda"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '5px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                                  border: '1px solid rgba(56, 189, 248, 0.3)',
                                  color: '#38BDF8',
                                  textDecoration: 'none',
                                  fontSize: '0.76rem',
                                  fontWeight: 600
                                }}
                              >
                                <Calendar size={12} />
                                <span>Google Agenda</span>
                              </a>

                              <button
                                onClick={() => { setSelectedObligation(ob); setIsProtocolModalOpen(true); }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '5px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(200, 30, 61, 0.15)',
                                  border: '1px solid rgba(200, 30, 61, 0.35)',
                                  color: '#FFFFFF',
                                  fontSize: '0.76rem',
                                  cursor: 'pointer'
                                }}
                              >
                                <CheckCircle2 size={12} color="#C81E3D" />
                                <span>Baixa</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            ABA 2: CARTEIRA DE CLIENTES
           ======================================================== */}
        {activeTab === 'clientes' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Empresas Cadastradas</h3>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Carteira oficial da Y7 Service (cadastre seus clientes reais abaixo)
                </div>
              </div>

              <button
                onClick={() => { setEditingClient(null); setIsClientModalOpen(true); }}
                className="btn btn-ruby btn-sm"
              >
                <Plus size={14} />
                <span>+ Cadastrar Cliente Real</span>
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {clients.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                  <Building2 size={32} style={{ marginBottom: '10px', opacity: 0.4 }} />
                  <div style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: '6px' }}>Nenhum cliente cadastrado</div>
                  <div style={{ fontSize: '0.84rem', marginBottom: '16px' }}>Cadastre as empresas atendidas pela contabilidade para vincular obrigações e emitir demonstrações.</div>
                  <button onClick={() => { setEditingClient(null); setIsClientModalOpen(true); }} className="btn btn-ruby btn-sm">
                    <Plus size={14} /> <span>+ Cadastrar Primeiro Cliente</span>
                  </button>
                </div>
              ) : (
                clients.map((cli) => {
                  const pendentesCli = obligations.filter(o => o.clienteId === cli.id && o.status !== 'Entregue').length;

                  return (
                    <div
                      key={cli.id}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#38BDF8',
                            backgroundColor: 'rgba(56, 189, 248, 0.1)',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {cli.regime}
                          </span>

                          <span style={{ fontSize: '0.74rem', color: pendentesCli > 0 ? '#F59E0B' : '#10B981', fontWeight: 600 }}>
                            {pendentesCli > 0 ? `⚠️ ${pendentesCli} pendente(s)` : '🟢 100% em dia'}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '4px' }}>
                          {cli.razaoSocial}
                        </h4>
                        <div className="mono" style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '10px' }}>
                          CNPJ: {cli.cnpj}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#CBD5E1' }}>
                          <div><strong>Responsável:</strong> {cli.responsavel}</div>
                          <div><strong>E-mail:</strong> {cli.email}</div>
                          <div><strong>Telefone:</strong> {cli.telefone}</div>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        marginTop: '16px',
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                      }}>
                        <button
                          onClick={() => { setEditingClient(cli); setIsClientModalOpen(true); }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '5px 8px' }}
                          title="Editar"
                        >
                          <Edit3 size={12} />
                        </button>

                        <button
                          onClick={() => handleDeleteClient(cli.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '5px 8px', color: '#EF4444' }}
                          title="Remover"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            ABA 3: EMISSÃO E INJEÇÃO DE DRE & BALANÇO (IMPRESSÃO / PDF)
           ======================================================== */}
        {activeTab === 'demonstrativos' && (
          <FinancialStatementsEditor clients={clients} onUpdateClient={handleSaveClient} />
        )}

        {/* ========================================================
            ABA 4: USUÁRIOS DO SISTEMA
           ======================================================== */}
        {activeTab === 'usuarios' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Usuários do Sistema</h3>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Contadores e colaboradores com acesso ao painel</div>
              </div>
              <button onClick={() => setShowUserForm(!showUserForm)} className="btn btn-ruby btn-sm">
                <Plus size={14} />
                <span>{showUserForm ? 'Fechar' : '+ Novo Usuário'}</span>
              </button>
            </div>

            {showUserForm && (
              <form onSubmit={handleSaveUsuario} style={{
                backgroundColor: 'rgba(200, 30, 61, 0.08)',
                border: '1px solid rgba(200, 30, 61, 0.25)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  <div>
                    <label className="form-label">Nome</label>
                    <input type="text" required className="form-control" placeholder="Nome completo"
                      value={novoUsuario.nome} onChange={e => setNovoUsuario({ ...novoUsuario, nome: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">E-mail</label>
                    <input type="email" required className="form-control" placeholder="email@y7service.com.br"
                      value={novoUsuario.email} onChange={e => setNovoUsuario({ ...novoUsuario, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Perfil</label>
                    <select className="form-control" value={novoUsuario.perfil}
                      onChange={e => setNovoUsuario({ ...novoUsuario, perfil: e.target.value })}>
                      <option value="contador">Contador</option>
                      <option value="admin">Administrador</option>
                      <option value="assistente">Assistente</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button type="submit" className="btn btn-ruby btn-sm">Salvar Usuário</button>
                </div>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {usuarios.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                  <UserCog size={32} style={{ marginBottom: '10px', opacity: 0.4 }} />
                  <div style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: '6px' }}>Nenhum usuário cadastrado</div>
                  <div style={{ fontSize: '0.84rem' }}>Adicione os contadores que terão acesso ao painel.</div>
                </div>
              ) : usuarios.map(u => (
                <div key={u.id} style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, color: '#38BDF8',
                      backgroundColor: 'rgba(56,189,248,0.1)', padding: '3px 8px', borderRadius: '4px'
                    }}>
                      {u.perfil}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: u.ativo ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                      {u.ativo ? '🟢 Ativo' : '🔴 Inativo'}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1rem' }}>{u.nome}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>
                      <Mail size={12} />{u.email}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={() => handleDeleteUsuario(u.id)}
                      className="btn btn-secondary btn-sm" style={{ padding: '5px 8px', color: '#EF4444' }} title="Remover">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClient}
        editingClient={editingClient}
      />

      <ProtocolModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
        onConfirm={handleUpdateObligation}
        obligation={selectedObligation}
      />
    </div>
  );
}
