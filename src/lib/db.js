import { supabase } from './supabase';

// ── CLIENTES ──────────────────────────────────────────────

export async function fetchClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(dbToClient);
}

export async function saveCliente(client) {
  const { error } = await supabase
    .from('clientes')
    .upsert(clientToDb(client));
  if (error) throw error;
}

export async function deleteCliente(id) {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── OBRIGAÇÕES ────────────────────────────────────────────

export async function fetchObrigacoes() {
  const { data, error } = await supabase
    .from('obrigacoes')
    .select('*')
    .order('vencimento', { ascending: true });
  if (error) throw error;
  return data.map(dbToObligation);
}

export async function saveObrigacao(ob) {
  const { error } = await supabase
    .from('obrigacoes')
    .upsert(obligationToDb(ob));
  if (error) throw error;
}

export async function deleteObrigacao(id) {
  const { error } = await supabase
    .from('obrigacoes')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── USUÁRIOS ──────────────────────────────────────────────

export async function fetchUsuarios() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveUsuario(usuario) {
  const { error } = await supabase
    .from('usuarios')
    .upsert(usuario);
  if (error) throw error;
}

export async function deleteUsuario(id) {
  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── MAPPERS ───────────────────────────────────────────────

function clientToDb(c) {
  return {
    id: c.id,
    razao_social: c.razaoSocial,
    nome_fantasia: c.nomeFantasia,
    cnpj: c.cnpj,
    regime: c.regime,
    segmento: c.segmento,
    responsavel: c.responsavel,
    email: c.email,
    telefone: c.telefone,
    cidade: c.cidade,
    status: c.status,
    data_entrada: c.dataEntrada,
    honorario_mensal: c.honorarioMensal,
  };
}

function dbToClient(r) {
  return {
    id: r.id,
    razaoSocial: r.razao_social,
    nomeFantasia: r.nome_fantasia,
    cnpj: r.cnpj,
    regime: r.regime,
    segmento: r.segmento,
    responsavel: r.responsavel,
    email: r.email,
    telefone: r.telefone,
    cidade: r.cidade,
    status: r.status,
    dataEntrada: r.data_entrada,
    honorarioMensal: r.honorario_mensal,
  };
}

function obligationToDb(o) {
  return {
    id: o.id,
    cliente_id: o.clienteId,
    cliente_nome: o.clienteNome,
    cnpj: o.cnpj,
    regime: o.regime,
    obrigacao: o.obrigacao,
    competencia: o.competencia,
    vencimento: o.vencimento,
    status: o.status,
    protocolo: o.protocolo,
    data_entrega: o.dataEntrega,
    responsavel: o.responsavel,
    observacao: o.observacao,
  };
}

function dbToObligation(r) {
  return {
    id: r.id,
    clienteId: r.cliente_id,
    clienteNome: r.cliente_nome,
    cnpj: r.cnpj,
    regime: r.regime,
    obrigacao: r.obrigacao,
    competencia: r.competencia,
    vencimento: r.vencimento,
    status: r.status,
    protocolo: r.protocolo,
    dataEntrega: r.data_entrega,
    responsavel: r.responsavel,
    observacao: r.observacao,
  };
}
