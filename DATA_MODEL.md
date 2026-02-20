# Data Model

**user**
1. id
2. uf
3. cidade
4. zona
5. consentimento_aceite_em
6. ideologia_auto_declarada
7. pesos_temas

**question**
1. id
2. tema
3. texto
4. ordem

**answer**
1. user_id
2. question_id
3. valor

**candidate**
1. id
2. nome_urna
3. nome_completo
4. partido
5. cargo
6. uf
7. numero
8. zona
9. status_verificacao

**candidate_profile**
1. candidate_id
2. bio
3. causas
4. links
5. atualizado_em

**candidate_answers**
1. candidate_id
2. tema
3. valor
4. fonte (auto)

**admin_scores**
1. candidate_id
2. tema
3. valor
4. fonte (admin)

**verification**
1. candidate_id
2. status
3. doc_hash
4. selfie_hash
5. verified_at

**score**
1. user_id
2. candidate_id
3. score
4. motivos
5. gerado_em

**moderation_log**
1. id
2. candidate_id
3. acao
4. motivo
5. admin_id
6. criado_em
