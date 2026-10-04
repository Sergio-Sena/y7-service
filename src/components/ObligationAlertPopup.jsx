import React from 'react';
import { X, AlertTriangle, Calendar, CalendarPlus, CheckCircle, ArrowRight } from 'lucide-react';
import { generateGoogleCalendarUrl, exportToIcsCalendar } from '../utils/googleCalendar';

export default function ObligationAlertPopup({ isOpen, onClose, obligations }) {
  if (!isOpen) return null;

  // Filtrar obrigações que não foram entregues ainda
  const pendencias = obligations.filter(o => o.status !== 'Entregue');

  const handleExportAll = () => {
    exportToIcsCalendar(pendencias, 'Y7_Alertas_Obrigacoes_Google.ics');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', border: '1px solid rgba(239, 68, 68, 0.4)' }}
      >
        {/* Cabeçalho do Alerta */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(239, 68, 68, 0.35)'
            }}>
              <AlertTriangle size={20} color="#EF4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.22rem', color: '#FFFFFF' }}>
                Alerta de Obrigações Fiscais Pendentes
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#F87171' }}>
                Atenção aos prazos limites de entrega do mês corrente
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {pendencias.length > 0 ? (
          <p style={{ color: '#E2E8F0', fontSize: '0.94rem', lineHeight: 1.5, marginBottom: '18px' }}>
            Identificamos <strong>{pendencias.length} obrigação(ões)</strong> que necessitam de acompanhamento prioritário. Conecte ao seu Google Agenda para receber notificações automáticas antes do vencimento:
          </p>
        ) : (
          <p style={{ color: '#CBD5E1', fontSize: '0.94rem', lineHeight: 1.5, marginBottom: '18px' }}>
            Nenhuma obrigação pendente no momento. Conforme os contadores forem lançando as declarações e tributos de cada cliente, os alertas e sincronizações com o Google Agenda ficarão disponíveis aqui.
          </p>
        )}

        {/* Lista de Pendências */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxHeight: '280px',
          overflowY: 'auto',
          marginBottom: '20px',
          paddingRight: '4px'
        }}>
          {pendencias.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#10B981' }}>
              <CheckCircle size={32} style={{ margin: '0 auto 8px auto' }} />
              <div>Todas as obrigações cadastradas estão 100% entregues!</div>
            </div>
          ) : (
            pendencias.map((ob) => {
              const googleUrl = generateGoogleCalendarUrl(ob);

              return (
                <div 
                  key={ob.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#FFFFFF', fontSize: '0.94rem' }}>{ob.obrigacao}</strong>
                      <span style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: ob.status === 'Atrasado' ? '#EF4444' : '#F59E0B',
                        backgroundColor: ob.status === 'Atrasado' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {ob.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
                      {ob.clienteNome} • Prazo: <span className="mono" style={{ color: '#FFFFFF', fontWeight: 600 }}>{ob.vencimento.split('-').reverse().join('/')}</span>
                    </div>
                  </div>

                  <a
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-blue btn-sm"
                    style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                    title="Adicionar esta obrigação ao Google Agenda com lembretes automáticos"
                  >
                    <Calendar size={13} />
                    <span>Conectar Google Agenda</span>
                  </a>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé do Alerta com Botões */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {pendencias.length > 0 && (
            <button
              onClick={handleExportAll}
              className="btn btn-outline-blue btn-sm"
              style={{ fontSize: '0.85rem' }}
            >
              <CalendarPlus size={15} />
              <span>Sincronizar Todas (.ics)</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="btn btn-ruby btn-sm"
            style={{ marginLeft: 'auto', fontSize: '0.88rem' }}
          >
            <span>Entendido, vou providenciar</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
