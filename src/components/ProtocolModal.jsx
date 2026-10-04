import React, { useState } from 'react';
import { X, CheckCircle, FileText, Calendar, Hash, UserCheck } from 'lucide-react';

export default function ProtocolModal({ isOpen, onClose, onConfirm, obligation }) {
  if (!isOpen || !obligation) return null;

  const [protocolo, setProtocolo] = useState(obligation.protocolo || `REC-${obligation.obrigacao.substring(0, 4)}-${Date.now().toString().slice(-6)}`);
  const [dataEntrega, setDataEntrega] = useState(obligation.dataEntrega || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState(obligation.status === 'Entregue' ? 'Entregue' : 'Entregue');
  const [responsavel, setResponsavel] = useState(obligation.responsavel || 'Nilson / Contador Responsável');
  const [observacao, setObservacao] = useState(obligation.observacao || 'Transmissão concluída com sucesso sem inconsistências fiscais.');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      ...obligation,
      status,
      protocolo,
      dataEntrega,
      responsavel,
      observacao
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={22} color="#10B981" />
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>
              Confirmar Entrega de Obrigação Fiscal
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Resumo da Obrigação */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.82rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>
            {obligation.regime} • Competência: {obligation.competencia}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: '4px 0' }}>
            {obligation.obrigacao} - {obligation.clienteNome}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
            CNPJ: {obligation.cnpj} • Prazo Limite: {obligation.vencimento}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Status da Obrigação</label>
            <select 
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Entregue">🟢 Entregue (Comprovante e Recibo Validados)</option>
              <option value="Em Andamento">🔵 Em Andamento (Em Apuração / Validação)</option>
              <option value="Pendente">🟡 Pendente (Aguardando Documentos)</option>
              <option value="Atrasado">🔴 Atrasado (Cobrança Urgente)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Número do Recibo / Protocolo RFB</label>
              <input 
                type="text" 
                required 
                className="form-control mono" 
                placeholder="Ex: REC-40216-DCTF-12345"
                value={protocolo}
                onChange={(e) => setProtocolo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Data da Transmissão / Entrega</label>
              <input 
                type="date" 
                required 
                className="form-control" 
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contador / Operador Responsável</label>
            <input 
              type="text" 
              className="form-control" 
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Observações e Histórico de Validação</label>
            <textarea 
              className="form-control" 
              rows="3" 
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancelar
            </button>
            <button type="submit" className="btn btn-ruby btn-sm">
              <CheckCircle size={16} />
              <span>Salvar Baixa da Obrigação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
