# Seeding

Objetivo: iniciar o app com dados reais para evitar tela vazia.

**Fonte recomendada**
1. Dados oficiais do TSE 2022.
2. Seeds geradas por cargo com Top 100 por votos nominais.

**Script**
1. Arquivo: `scripts/seed_2022_top100.py`
2. Entrada: arquivos oficiais do TSE (baixados automaticamente).
3. Saidas:
4. `data/seeds/candidates_2022_top100.json`
5. `data/seeds/candidate_answers_2022_top100.json`

**Como rodar**
```powershell
python scripts/seed_2022_top100.py --top 100 --turno 1
```

**Ideologia inicial**
1. Usa `config/party_ideology_map.json` quando existe.
2. Se nao existir, preenche 3 em todos os temas.
3. Marca como "admin_inferred" e "low confidence".

**Revisao**
1. Todo candidato pode atualizar o perfil depois.
2. Admin pode ajustar ideologia e zona.
