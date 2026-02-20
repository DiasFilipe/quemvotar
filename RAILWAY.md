# Railway Setup

Guia rapido para configurar Postgres, Redis e Volume no Railway.

**Recursos no Railway**
1. Criar um projeto.
2. Adicionar PostgreSQL (plugin).
3. Adicionar Redis (plugin).
4. Adicionar Volume e montar no app em `/data`.

**Variaveis de ambiente (app)**
1. `DATABASE_URL` (fornecida pelo Postgres do Railway).
2. `REDIS_URL` (fornecida pelo Redis do Railway). 
3. `SESSION_COOKIE_NAME=qv_session`
4. `SESSION_TTL_DAYS=30`
5. `STORAGE_PATH=/data/storage`

**Migrations em producao**
1. Use `npx prisma migrate deploy` no step de deploy/boot.
2. Gere o client com `npx prisma generate` quando necessario.

**Local (Docker)**
1. Suba infra local: `docker compose up -d`
2. Rode migrations: `npx prisma migrate dev`

Observacao: o volume do Railway deve persistir documentos de verificacao. A pasta alvo eh `STORAGE_PATH`.
