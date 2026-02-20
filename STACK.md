# Stack

Stack padrao sugerida para o MVP. Foco em rapidez de entrega, simplicidade e escalabilidade moderada.

**Frontend**
1. Next.js 14 (App Router)
2. TypeScript
3. Tailwind CSS

**Backend**
1. Node.js 20
2. API em Next.js Route Handlers ou Fastify
3. Prisma como ORM

**Banco de dados**
1. PostgreSQL 16 (Railway)
2. Redis para cache e filas simples (Railway)

**Infra**
1. Railway para frontend, API e jobs
2. PostgreSQL no Railway
3. Redis no Railway
4. Storage de documentos no Railway (Volume)

**Observabilidade**
1. Sentry para erros
2. PostHog para analytics de produto

**Seguranca**
1. Hash e criptografia de dados sensiveis
2. Logs de auditoria imutaveis
3. RBAC simples para admin e moderacao

**Ambientes**
1. Local
2. Staging
3. Producao

Se quiser, podemos trocar o backend para Python (FastAPI) ou manter tudo em Next.js.
