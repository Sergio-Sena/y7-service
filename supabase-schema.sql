-- Tabela de clientes
create table if not exists clientes (
  id text primary key,
  razao_social text not null,
  nome_fantasia text,
  cnpj text not null,
  regime text not null,
  segmento text,
  responsavel text,
  email text,
  telefone text,
  cidade text,
  status text default 'Ativo',
  data_entrada date,
  honorario_mensal numeric default 0,
  created_at timestamptz default now()
);

-- Tabela de obrigações
create table if not exists obrigacoes (
  id text primary key,
  cliente_id text references clientes(id) on delete cascade,
  cliente_nome text not null,
  cnpj text not null,
  regime text not null,
  obrigacao text not null,
  competencia text not null,
  vencimento date not null,
  status text default 'Pendente',
  protocolo text,
  data_entrega date,
  responsavel text,
  observacao text,
  created_at timestamptz default now()
);

-- Tabela de usuários do sistema
create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  perfil text default 'contador',
  ativo boolean default true,
  created_at timestamptz default now()
);

-- Habilitar RLS
alter table clientes enable row level security;
alter table obrigacoes enable row level security;
alter table usuarios enable row level security;

-- Policies: acesso total para usuários autenticados
create policy "acesso autenticado clientes" on clientes for all using (true);
create policy "acesso autenticado obrigacoes" on obrigacoes for all using (true);
create policy "acesso autenticado usuarios" on usuarios for all using (true);
