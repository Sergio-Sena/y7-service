# Changelog — Y7 Service

## [Unreleased]
### Pendente
- GitHub Actions (esteira CI) — `.github/workflows/test-dev.yml`
- Sentry para erros em produção

---

## [0.4.0] — 2026-10-05
### Adicionado
- Integração Supabase no `App.jsx` — localStorage substituído por `db.js`
- Autenticação via Supabase Auth (`signInWithPassword`, `onAuthStateChange`, `signOut`)
- Aba de Usuários do Sistema no painel admin (CRUD na tabela `usuarios`)
- `context.md` e `CHANGELOG.md` criados
- Deploy configurado no AWS Amplify (`d3pgghxxzqjef5`)
- Domínio `www.y7service.com.br` configurado via CNAME no registro.br
- Validação SSL via ACM (CNAME `_bb7d8b4dda...` no registro.br)
- Redirecionamento `y7service.com.br` → `www.y7service.com.br` configurado no Amplify
- Variáveis de ambiente configuradas no Amplify Console (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_DB_PASS`)

### Arquitetura de deploy
| Item | Valor |
|---|---|
| Amplify App ID | `d3pgghxxzqjef5` |
| Domínio | `www.y7service.com.br` |
| CloudFront | `d1nsdxutuhwswx.cloudfront.net` |
| Branch produção | `main` |
| Upstream | `mouratoimportacao-cloud/y7-service` |
| Origin | `Sergio-Sena/y7-service` |

---

## [0.3.0] — 2026-10-05
### Adicionado
- Módulo de injeção de dados DRE e Balanço (`FinancialStatementsEditor`)
- Botão de impressão e geração de PDF oficial com papel timbrado Y7
- Banco de dados Supabase criado via CLI e linkado ao projeto (`fqkfdtumqingxcgzqbli`)
- Migrations SQL aplicadas — tabelas `clientes`, `obrigacoes`, `usuarios` com RLS
- `src/lib/db.js` com todas as funções Supabase e mappers camelCase↔snake_case (aguardando integração)
- `src/lib/supabase.js` com cliente inicializado
- `.env.example` com as 5 variáveis necessárias
- `push.bat` e scripts `sync`/`push` no `package.json`
- Upstream `mouratoimportacao-cloud/y7-service` configurado como remoto

### Corrigido
- Remoção de telefone de contato da impressão do balanço
- Limpeza de pendências e entregas mockadas (carteira limpa para alimentação manual)
- Alinhamento das assinaturas do contador e sócio na impressão
- Remoção de botões da impressão — apenas cabeçalho oficial Y7

---

## [0.2.0] — 2026-10-05
### Adicionado
- Portal institucional público (site) com Header, Hero, ServicesSection, FinancialDashboard, LocationSection, Footer
- Painel admin com 3 abas: Obrigações Fiscais, Cadastro de Clientes, Emissão DRE & Balanço
- Autenticação via variáveis de ambiente + sessionStorage
- CRUD de clientes com `ClientModal`
- Baixa de obrigações com `ProtocolModal`
- Alertas de vencimento com `ObligationAlertPopup` + integração Google Agenda + export `.ics`
- Catálogo de obrigações por regime fiscal em `initialData.js`
- Design system completo em `index.css` (variáveis CSS, glass-panel, badges, modais, estilos de impressão A4)

---

## [0.1.0] — 2026-10-05
### Adicionado
- Setup inicial: React 19 + Vite 8 + Supabase JS + Lucide React
- Fork de `mouratoimportacao-cloud/y7-service`
