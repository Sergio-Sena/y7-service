import React from 'react';
import { 
  FileEdit, 
  BarChart3, 
  Scale, 
  ShieldCheck, 
  Users, 
  Building, 
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { Y7_INFO } from '../data/initialData';

export default function ServicesSection() {
  const services = [
    {
      id: "alteracao-contratual",
      icon: <FileEdit size={26} color="#C81E3D" />,
      titulo: "Alteração Contratual & Societário",
      descricao: "Elaboração e registro de alterações de contrato social na JUCESP e Receita Federal: admissão e saída de sócios, mudança de endereço, inclusão de CNAEs e aumento de capital social.",
      beneficios: [
        "Adequação jurídica e societária completa",
        "Redação com cláusulas de proteção entre sócios",
        "Tramitação ágil na Junta Comercial e RFB"
      ]
    },
    {
      id: "balanco-dre",
      icon: <BarChart3 size={26} color="#38BDF8" />,
      titulo: "Balanço Patrimonial & DRE",
      descricao: "Emissão de demonstrações contábeis auditáveis (DRE e Balanço) essenciais para obtenção de crédito bancário, participação em licitações e distribuição isenta de lucros aos sócios.",
      beneficios: [
        "DRE Analítica e Sintética com EBITDA",
        "Balanço Patrimonial rigorosamente conciliado",
        "Relatórios executivos para tomada de decisão"
      ]
    },
    {
      id: "regimes-tributarios",
      icon: <Scale size={26} color="#10B981" />,
      titulo: "Planejamento Tributário Especializado",
      descricao: "Estudo comparativo detalhado para enquadrar sua empresa no regime que assegure a menor carga tributária possível com total segurança jurídica.",
      beneficios: [
        "Simples Nacional com aplicação do Fator R",
        "Lucro Presumido para serviços e alta margem",
        "Lucro Real para empresas com margens reduzidas"
      ]
    },
    {
      id: "obrigacoes-compliance",
      icon: <ShieldCheck size={26} color="#F59E0B" />,
      titulo: "Cumprimento de Obrigações Acessórias",
      descricao: "Monitoramento e entrega pontual de todas as obrigações federais, estaduais e municipais: DCTFWeb, PGDAS, EFD-Contribuições, SPED Fiscal, ECD e ECF.",
      beneficios: [
        "Controle rigoroso de prazos com zero multas",
        "Armazenamento de recibos e protocolos oficiais",
        "Sincronização direta com o Google Agenda"
      ]
    },
    {
      id: "bpo-folha",
      icon: <Users size={26} color="#8B5CF6" />,
      titulo: "Folha de Pagamento & eSocial",
      descricao: "Gestão completa das rotinas trabalhistas: elaboração de folha, cálculo de pró-labore, rescisões, férias e transmissão pontual dos eventos ao eSocial e DCTFWeb.",
      beneficios: [
        "Cálculo exato de encargos (INSS, FGTS, IRRF)",
        "Fechamento mensal e emissão de guias DAE/DARF",
        "Orientação preventiva sobre a legislação"
      ]
    },
    {
      id: "abertura-regularizacao",
      icon: <Building size={26} color="#EC4899" />,
      titulo: "Abertura & Regularização de Empresas",
      descricao: "Constituição rápida de empresas (LTDA, SLU ou S/A), obtenção de CNPJ, inscrições municipal e estadual, além de regularização de pendências fiscais e emissão de CNDs.",
      beneficios: [
        "Enquadramento no CNAE tributário correto",
        "Alvarás e licenças municipais ativas",
        "Parcelamento e quitação de débitos fiscais"
      ]
    }
  ];

  return (
    <section id="solucoes" style={{ padding: '70px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        {/* Cabeçalho da Seção */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 46px auto' }}>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)', color: '#FFFFFF', marginBottom: '14px' }}>
            Serviços Contábeis Especializados
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Soluções completas com atendimento direto, rigor técnico e acompanhamento permanente da situação fiscal da sua empresa.
          </p>
        </div>

        {/* Grid de Serviços */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {services.map((item) => (
            <div 
              key={item.id}
              className="glass-panel"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Ícone e Título */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: '1.18rem', color: '#FFFFFF', lineHeight: 1.3 }}>
                    {item.titulo}
                  </h3>
                </div>

                <p style={{ color: '#CBD5E1', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  {item.descricao}
                </p>

                {/* Benefícios */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
                  {item.beneficios.map((b, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#E2E8F0' }}>
                      <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Ponta a Ponta com Espaçamento Correto */}
              <a
                href={`https://wa.me/${Y7_INFO.contatos.whatsappRaw}?text=${encodeURIComponent(`Olá, gostaria de saber mais sobre o serviço de ${item.titulo} da Y7 Service.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-block"
                style={{
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  fontSize: '0.92rem'
                }}
              >
                <span>Consultar Especialista</span>
                <ArrowUpRight size={16} color="#38BDF8" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
