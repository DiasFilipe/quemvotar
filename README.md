# Quem Votar

SaaS B2C para mostrar compatibilidade entre eleitor e candidatos, sem pedir voto. O objetivo e orientar o eleitor com base em temas, ideologia auto declarada e contexto local.

**Principios**
1. Compatibilidade, nao recomendacao.
2. Transparencia do por que um candidato aparece.
3. Consentimento explicito para opiniao politica.
4. Dados minimos e auditaveis.
5. Candidato pode se descrever e atualizar o proprio perfil.

**MVP 2026 (resumo)**
1. Questionario com 10 temas e pesos do usuario.
2. Top 3 por cargo com score 0 a 100 e motivos curtos.
3. Zonas por cidade como bonus local para deputados.
4. Portal do candidato com publicacao imediata e verificacao.
5. Admin pode revisar perfis e ajustar zonas e temas.
6. Seeds iniciais com Top 100 por cargo em 2022.

**O que este produto nao faz**
1. Nao pede voto.
2. Nao faz impulsionamento pago.
3. Nao usa dados pessoais sensiveis sem consentimento.

**Fluxos principais**
1. Eleitor faz onboarding, aceita consentimento e responde o questionario.
2. Sistema calcula compatibilidade e mostra Top 3 com score e motivos.
3. Candidato cria perfil, publica e depois valida identidade.
4. Admin revisa e audita conteudo e scores.

**Arquivos importantes**
1. `scripts/seed_2022_top100.py` gera seeds a partir de dados oficiais.
2. `config/party_ideology_map.example.json` exemplo de mapa por partido.
3. `ROADMAP.md` fases e entregas.
4. `DASHBOARD.md` metricas e KPIs.
5. `SCORING.md` modelo de score.
6. `COMPLIANCE.md` regras de LGPD e eleitoral.
7. `SEEDING.md` como popular dados iniciais.
8. `DATA_MODEL.md` modelo de dados minimo.
9. `RAILWAY.md` setup de Postgres, Redis e Volume.

**Seed rapido**
```powershell
python scripts/seed_2022_top100.py --top 100 --turno 1
```

**Aviso**
Este repositorio define regras e processos. A interpretacao juridica final deve ser validada por assessoria legal.
