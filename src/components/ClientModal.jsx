import React, { useState } from 'react';
import { X, Building2, Shield, Mail, Phone, MapPin, DollarSign, Save } from 'lucide-react';

export default function ClientModal({ isOpen, onClose, onSave, editingClient }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState(
    editingClient || {
      id: `cli-${Date.now()}`,
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      regime: 'Simples Nacional',
      segmento: 'Prestação de Serviços',
      responsavel: '',
      email: '',
      telefone: '',
      cidade: 'Barueri - Alphaville/SP',
      status: 'Ativo',
      dataEntrada: new Date().toISOString().split('T')[0],
      honorarioMensal: 2500
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.razaoSocial || !formData.cnpj) {
      alert('Por favor, informe a Razão Social e o CNPJ.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={24} color="#C81E3D" />
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>
              {editingClient ? 'Editar Cadastro de Cliente' : 'Cadastrar Novo Cliente - Y7 Service'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Razão Social *</label>
              <input 
                type="text" 
                required 
                className="form-control" 
                placeholder="Ex: Alfa Soluções Empresariais Ltda"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nome Fantasia</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Alfa Soluções"
                value={formData.nomeFantasia}
                onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">CNPJ *</label>
              <input 
                type="text" 
                required 
                className="form-control mono" 
                placeholder="00.000.000/0001-00"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Regime Tributário *</label>
              <select 
                className="form-control"
                value={formData.regime}
                onChange={(e) => setFormData({ ...formData, regime: e.target.value })}
              >
                <option value="Simples Nacional">Simples Nacional</option>
                <option value="Lucro Presumido">Lucro Presumido</option>
                <option value="Lucro Real">Lucro Real</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Ativo">Ativo</option>
                <option value="Suspenso">Suspenso</option>
                <option value="Em Constituição">Em Constituição</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Segmento / Ramo</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Comércio Eletrônico, Serviços TI"
                value={formData.segmento}
                onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contato / Sócio Responsável</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nome do contato principal"
                value={formData.responsavel}
                onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">E-mail Financeiro</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="financeiro@empresa.com.br"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telefone / Celular</label>
              <input 
                type="tel" 
                className="form-control" 
                placeholder="(11) 90000-0000"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Cidade / Estado</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Barueri - Alphaville/SP"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Honorário Contábil Mensal (R$)</label>
              <input 
                type="number" 
                className="form-control mono" 
                placeholder="2500"
                value={formData.honorarioMensal}
                onChange={(e) => setFormData({ ...formData, honorarioMensal: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancelar
            </button>
            <button type="submit" className="btn btn-ruby btn-sm">
              <Save size={16} />
              <span>Salvar Cliente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
