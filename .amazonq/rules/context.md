# Context — Y7 Service

## Projeto
Sistema de gestão fiscal interno + site institucional público da **Y7 Service Ltda** — escritório contábil em Barueri/SP (Alphaville).

## Stack
- React 19 + Vite 8 + Supabase JS + Lucide React
- Sem TypeScript, sem roteador
- Lint: oxlint

## Repositórios
- **Origin (produção):** `https://github.com/Sergio-Sena/y7-service.git`
- **Upstream (cliente):** `https://github.com/mouratoimportacao-cloud/y7-service.git`
- **Hosting:** AWS Amplify (`d3pgghxxzqjef5`)
- **Domínio:** `y7service.com.br` (www via CNAME → Amplify/CloudFront)

### Fluxo de trabalho

**Cliente desenvolve no upstream:**
```bash
git checkout dev
# faz alterações
git add . && git commit -m "feat: descrição"
git push origin dev
# merge dev → main quando pronto
```

**Sergio sincroniza e deploya:**
```bash
git fetch upstream
git merge upstream/main
git push origin main
# Amplify detecta push em main e deploya automaticamente (~2-3 min)
```

### Regras
- Sempre desenvolver em `dev` — nunca direto em `main`
- Sincronizar antes de começar: `git fetch upstream && git merge upstream/dev`
- Testar localmente com `npm run dev` antes do push
- Commit messages: `feat:`, `fix:`, `docs:`, etc.
- Nunca force push

## Supabase
- Projeto: `y7-service`
- Ref: `fqkfdtumqingxcgzqbli`
- CLI linkado: sim
- Migrations aplicadas: sim (tabelas `clientes`, `obrigacoes`, `usuarios`)
- RLS habilitado com policy de acesso total para `anon` (painel interno)

## Variáveis de ambiente (.env)
```
VITE_ADMIN_USER
VITE_ADMIN_PASS
VITE_SUPABASE_DB_PASS
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## Estado atual da persistência
- `App.jsx` ainda usa **localStorage** (`y7_clients_v2`, `y7_obligations_v3`)
- `src/lib/db.js` tem todas as funções Supabase prontas com mappers camelCase↔snake_case
- **Pendente:** integrar `db.js` no `App.jsx`

## Autenticação
- Atual: credenciais via `.env` (`VITE_ADMIN_USER`/`VITE_ADMIN_PASS`) comparadas no frontend — **inseguro para produção**
- **Pendente:** migrar para Supabase Auth antes do deploy

## Plano de Deploy

### Fase 1 — Código (bloqueador)
- [ ] Integrar `db.js` no `App.jsx` (substituir localStorage)
- [ ] Migrar autenticação para Supabase Auth

### Fase 2 — AWS Amplify
- [ ] Criar app no Amplify Console conectado ao `Sergio-Sena/y7-service`
- [ ] Criar `amplify.yml` na raiz (build: `npm ci && npm run build`, artifacts: `dist/`)
- [ ] Configurar as 5 variáveis de ambiente no Amplify Console

### Fase 3 — GitHub Actions (CI)
- [ ] Criar `.github/workflows/deploy.yml`
  - Lint no push/PR
  - Build de validação
  - Deploy automático para Amplify no merge na `main`

### Fase 4 — DNS registro.br
- [ ] Definir domínio (confirmar com cliente)
- [ ] Adicionar domínio customizado no Amplify → obter CNAMEs
- [ ] Apontar CNAMEs no registro.br
- [ ] SSL provisionado automaticamente via ACM

### Fase 5 — Pós-deploy
- [ ] Sentry para erros em produção

## Componentes principais
| Arquivo | Responsabilidade |
|---|---|
| `App.jsx` | Estado global, autenticação, roteamento de views |
| `AdminDashboard.jsx` | Painel admin — obrigações, clientes, DRE/Balanço |
| `FinancialStatementsEditor.jsx` | Editor e impressão de DRE e Balanço (persiste em `y7_fin_{id}`) |
| `LoginModal.jsx` | Login via env vars (temporário) |
| `ClientModal.jsx` | CRUD de clientes |
| `ProtocolModal.jsx` | Baixa de obrigações |
| `ObligationAlertPopup.jsx` | Alertas de vencimento + Google Agenda + .ics |
| `FinancialDashboard.jsx` | Dashboard público ilustrativo (dados estáticos) |
| `src/lib/db.js` | Funções Supabase — ainda não integradas |
| `src/lib/supabase.js` | Cliente Supabase |
| `src/data/initialData.js` | Dados iniciais, catálogo de obrigações, métricas |
| `src/utils/googleCalendar.js` | Geração de URL Google Agenda e export .ics |
