# Architecture

Arquitetura simples para o MVP, com separacao clara entre app, API e dados.

**Componentes**
1. Web App B2C para eleitores.
2. Portal do Candidato.
3. Admin de moderacao.
4. API para score e dados.
5. Banco PostgreSQL (Railway).
6. Storage para documentos de verificacao (Railway Volume).
7. Cache e filas simples com Redis (Railway).

**Fluxo principal**
1. Usuario aceita consentimento e responde questionario.
2. API calcula score com base em respostas e dados do candidato.
3. Resultado mostra Top 3 e motivos.

**Fluxo do candidato**
1. Candidato cria perfil e publica.
2. Envia documento e selfie.
3. Admin valida e altera status.

**Camadas de dados**
1. Dados de usuario e respostas.
2. Dados de candidatos e perfis.
3. Scores calculados e logs de auditoria.

**Seguranca**
1. RBAC para admin e moderacao.
2. Criptografia de dados sensiveis.
3. Logs imutaveis para alteracoes.

**Integrações**
1. Seeds iniciais com dados TSE 2022.
2. Analytics para produto e qualidade.
