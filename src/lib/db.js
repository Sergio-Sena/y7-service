import { supabase } from './supabase';

// Chaves de armazenamento persistente
const STORAGE_CLIENTES = 'y7_db_clientes';
const STORAGE_OBRIGACOES = 'y7_db_obrigacoes';
const STORAGE_USUARIOS = 'y7_db_usuarios';

// ── CLIENTES ──────────────────────────────────────────────

export async function fetchClientes() {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && Array.isArray(data)) {
      const list = data.map(dbToClient).filter(c => !c.id?.includes('athene') && !c.razaoSocial?.toLowerCase().includes('athene'));
      localStorage.setItem(STORAGE_CLIENTES, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    // Modo local / offline
  }

  const cached = localStorage.getItem(STORAGE_CLIENTES);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) 
        ? parsed.filter(c => !c.id?.includes('athene') && !c.razaoSocial?.toLowerCase().includes('athene')) 
        : [];
    } catch (e) {}
  }
  return [];
}

export async function saveCliente(client) {
  // 1. Persistência imediata local
  try {
    const cached = localStorage.getItem(STORAGE_CLIENTES);
    let list = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex(c => c.id === client.id);
    if (idx >= 0) {
      list[idx] = client;
    } else {
      list.unshift(client);
    }
    localStorage.setItem(STORAGE_CLIENTES, JSON.stringify(list));
  } catch (e) {}

  // 2. Persistência no banco Supabase
  try {
    await supabase.from('clientes').upsert(clientToDb(client));
  } catch (err) {}
}

export async function deleteCliente(id) {
  // 1. Remoção local
  try {
    const cached = localStorage.getItem(STORAGE_CLIENTES);
    if (cached) {
      const list = JSON.parse(cached).filter(c => c.id !== id);
      localStorage.setItem(STORAGE_CLIENTES, JSON.stringify(list));
    }
  } catch (e) {}

  // 2. Remoção no banco Supabase
  try {
    await supabase.from('clientes').delete().eq('id', id);
  } catch (err) {}
}

// ── OBRIGAÇÕES ────────────────────────────────────────────

export async function fetchObrigacoes() {
  try {
    const { data, error } = await supabase
      .from('obrigacoes')
      .select('*')
      .order('vencimento', { ascending: true });
    if (!error && Array.isArray(data)) {
      const list = data.map(dbToObligation).filter(o => !o.clienteId?.includes('athene') && !o.clienteNome?.toLowerCase().includes('athene'));
      localStorage.setItem(STORAGE_OBRIGACOES, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    // Modo local / offline
  }

  const cached = localStorage.getItem(STORAGE_OBRIGACOES);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed)
        ? parsed.filter(o => !o.clienteId?.includes('athene') && !o.clienteNome?.toLowerCase().includes('athene'))
        : [];
    } catch (e) {}
  }
  return [];
}

export async function saveObrigacao(ob) {
  // 1. Persistência imediata local
  try {
    const cached = localStorage.getItem(STORAGE_OBRIGACOES);
    let list = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex(o => o.id === ob.id);
    if (idx >= 0) {
      list[idx] = ob;
    } else {
      list.unshift(ob);
    }
    localStorage.setItem(STORAGE_OBRIGACOES, JSON.stringify(list));
  } catch (e) {}

  // 2. Persistência no banco Supabase
  try {
    await supabase.from('obrigacoes').upsert(obligationToDb(ob));
  } catch (err) {}
}

export async function deleteObrigacao(id) {
  // 1. Remoção local
  try {
    const cached = localStorage.getItem(STORAGE_OBRIGACOES);
    if (cached) {
      const list = JSON.parse(cached).filter(o => o.id !== id);
      localStorage.setItem(STORAGE_OBRIGACOES, JSON.stringify(list));
    }
  } catch (e) {}

  // 2. Remoção no banco Supabase
  try {
    await supabase.from('obrigacoes').delete().eq('id', id);
  } catch (err) {}
}

// ── USUÁRIOS ──────────────────────────────────────────────

export async function fetchUsuarios() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && Array.isArray(data)) {
      localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(data));
      return data;
    }
  } catch (err) {}

  const cached = localStorage.getItem(STORAGE_USUARIOS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }
  return [];
}

export async function saveUsuario(usuario) {
  const userWithId = {
    ...usuario,
    id: usuario.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`)
  };

  try {
    const cached = localStorage.getItem(STORAGE_USUARIOS);
    let list = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex(u => u.id === userWithId.id);
    if (idx >= 0) list[idx] = userWithId;
    else list.unshift(userWithId);
    localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(list));
  } catch (e) {}

  try {
    await supabase.from('usuarios').upsert(userWithId);
  } catch (err) {}
}

export async function deleteUsuario(id) {
  try {
    const cached = localStorage.getItem(STORAGE_USUARIOS);
    if (cached) {
      const list = JSON.parse(cached).filter(u => u.id !== id);
      localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(list));
    }
  } catch (e) {}

  try {
    await supabase.from('usuarios').delete().eq('id', id);
  } catch (err) {}
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
