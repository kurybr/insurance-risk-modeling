# One-hot encoding — guia didático

One-hot encoding é uma forma de representar **categorias** (texto ou rótulos) como números para a rede neural. Em vez de usar um único número (ex.: 1, 2, 3), cada categoria vira uma **dimensão** no vetor: só uma posição fica com valor **1** (“quente”) e as outras com **0**. Assim a rede não interpreta ordem ou grandeza entre categorias — todas ficam no mesmo pé.

---

## Regra principal: cada alternativa vira uma coluna

**Cada alternativa possível do campo vira uma coluna** (uma posição no vetor). O número de colunas é sempre igual ao número de categorias.

- 3 regiões → 3 colunas  
- 6 categorias de risco → 6 colunas  
- 10 cidades → 10 colunas  

Em cada linha (cada registro), **apenas uma** dessas posições vale 1 (a categoria daquele registro); as demais valem 0.

---

## Exemplo 1: Região (3 alternativas)

Campo **região** com 3 alternativas: capital, interior, metropolitana → **3 colunas**.

| Região        | Capital | Interior | Metropolitana |
| ------------- | ------- | -------- | ------------- |
| capital       | 1       | 0        | 0             |
| interior      | 0       | 1        | 0             |
| metropolitana | 0       | 0        | 1             |

---

## Exemplo 2: Categorias de risco (6 alternativas)

Campo **risco** com 6 alternativas → **6 colunas**. Cada pessoa é representada por um vetor de 6 posições.

| Pessoa | nenhum | baixo | médio | alto | perigoso | recusar |
| ------ | ------ | ----- | ----- | ---- | -------- | ------- |
| 1      | 0      | 0     | 1     | 0    | 0        | 0       |
| 2      | 1      | 0     | 0     | 0    | 0        | 0       |
| 3      | 0      | 0     | 0     | 0    | 0        | 1       |

---

## Exemplo 3: Cidades (N alternativas)

Se o campo for **cidade**, você precisa de **uma coluna para cada cidade**.

- 3 cidades (São Paulo, Campinas, Santos) → 3 colunas  
- 100 cidades → 100 colunas  

| Pessoa | São Paulo | Campinas | Santos |
| ------ | --------- | -------- | ------ |
| 1      | 1         | 0        | 0      |
| 2      | 0         | 1        | 0      |
| 3      | 0         | 0        | 1      |

Quando há **muitas** categorias (ex.: centenas de cidades), o vetor fica grande. Nesses casos às vezes se usa **embedding** ou agrupar categorias (ex.: regiões em vez de cidades) para reduzir o número de colunas. Para poucas categorias, one-hot é simples e funciona bem.

---

## Resumo

| Pergunta | Resposta |
| -------- | -------- |
| Quantas colunas? | Uma por alternativa do campo. |
| Valores em cada coluna? | 0 ou 1; só uma coluna com 1 por linha. |
| Por que usar? | Para a rede tratar categorias sem ordem ou “tamanho” entre elas. |

No projeto, one-hot é usado na **entrada** (campo região) e na **saída** (classe de risco).
