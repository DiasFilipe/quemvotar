# API

API minima para o MVP. Os endpoints abaixo sao exemplos e podem ser ajustados ao framework escolhido.

**Auth**
1. `POST /api/auth/signup` cria usuario
2. `POST /api/auth/login` autentica usuario
3. `POST /api/auth/logout` encerra sessao

**Consentimento**
1. `POST /api/consent` registra aceite
2. `DELETE /api/consent` revoga consentimento

**Questionario**
1. `GET /api/questions` lista perguntas
2. `POST /api/answers` envia respostas do usuario
3. `GET /api/answers/me` retorna respostas do usuario

**Compatibilidade**
1. `POST /api/score` calcula score por cargo
2. `GET /api/score/me` retorna Top 3 e motivos

**Candidatos**
1. `GET /api/candidates` lista candidatos por cargo e UF
2. `GET /api/candidates/{id}` retorna perfil publico

**Portal do Candidato**
1. `POST /api/candidate/signup` cria conta de candidato
2. `POST /api/candidate/verify` envia documento e selfie
3. `PUT /api/candidate/profile` atualiza bio e causas
4. `PUT /api/candidate/answers` atualiza respostas tematicas

**Admin**
1. `GET /api/admin/candidates` lista perfis para revisao
2. `PUT /api/admin/candidates/{id}` ajusta zona e dados
3. `POST /api/admin/moderation` registra acao de moderacao
4. `GET /api/admin/logs` consulta auditoria

**Payloads minimos**
1. `POST /api/answers` envia `answers` com `question_id` e `valor`
2. `POST /api/score` envia `cargo`, `uf`, `cidade`, `zona`
3. `PUT /api/candidate/profile` envia `bio`, `causas`, `links`
4. `PUT /api/candidate/answers` envia `tema` e `valor`

**Erros**
1. `400` dados invalidos
2. `401` nao autenticado
3. `403` sem permissao
4. `404` nao encontrado
5. `429` limite de requisicoes
