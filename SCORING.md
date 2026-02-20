# Scoring

Modelo simples, auditavel e explicavel. O score final vai de 0 a 100.

**Entradas**
1. Respostas do usuario por tema, escala 1 a 5.
2. Pesos do usuario por tema.
3. Respostas do candidato por tema.
4. Bonus local para deputados quando aplicavel.

**Resposta do candidato**
1. Valor final por tema = 0.60 * auto_declaracao + 0.40 * admin.
2. Se auto declaracao nao existe, usar 100% admin.
3. Se admin nao existe, usar apenas auto declaracao e marcar como provisoria.

**Similaridade por tema**
1. Distancia = abs(resposta_usuario - resposta_candidato).
2. Similaridade = 1 - (distancia / 4).
3. Resultado em 0.0 a 1.0.

**Score base**
1. Para cada tema respondido pelo usuario, aplicar peso.
2. Score_base = media ponderada das similaridades.
3. Score_base = round(Score_base * 100).

**Ajustes**
1. Bonus_local de 0 a 5 pontos para deputados, quando cidade tem zonas configuradas.
2. Penalidade por resposta faltante do candidato: -2 por tema sem resposta.
3. Score_final = clamp(Score_base + bonus_local - penalidade, 0, 100).

**Explicacao curta**
1. Mostrar 3 temas com maior contribuicao positiva.
2. Se houver penalidade, mostrar aviso "perfil incompleto".
