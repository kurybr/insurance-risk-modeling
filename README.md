# Classificação de risco para seguros de automóveis

Projeto de estudo que usa **redes neurais** (TensorFlow.js) para classificar o risco de uma pessoa em um cenário de seguro de carro. Faz parte dos exercícios sobre Fundamentos de IA e Redes Neurais.

---

## Sobre o projeto: funcionamento, estrutura e como rodar

### O que o projeto faz

- Lê um dataset de pessoas (`data/dataset.json`) com: **idade**, **renda**, **anos de experiência ao volante** e **região**.
- Usa uma **regra de negócio** (em `helpers/tools.ts`) para gerar o *label* de risco de cada pessoa — apenas para fins de estudo.
- Treina um modelo de **classificação multiclasse** que aprende a mapear esses atributos para uma das 6 categorias de risco: `nenhum`, `baixo`, `médio`, `alto`, `perigoso`, `recusar`.
- Salva o modelo em `model/` e permite **prever** o risco de novas pessoas, exibindo a probabilidade por categoria.

### Estrutura do projeto

- **`index.ts`** — Carrega o dataset, monta X e Y, treina o modelo, salva e faz predição para perfis de teste.
- **`helpers/tools.ts`** — Normalização, one-hot encoding e regra de negócio de risco (`riskAnalysis`).
- **`helpers/training.ts`** — Definição do modelo (camada densa + softmax), treino e save/load em disco.
- **`helpers/predict.ts`** — Recebe o modelo e um tensor de entrada e imprime as probabilidades por categoria de risco.
- **`data/dataset.json`** — Lista de pessoas usadas no treino.
- **`model/`** — Modelo treinado salvo (gerado ao rodar).

### Como rodar

```bash
npm install
npm start
```

O script lê o dataset, treina o modelo, salva e faz uma predição de exemplo (por padrão um perfil de risco “recusar”). As probabilidades são exibidas no console.

---

## Conceitos utilizados e material de apoio

### Arquitetura da rede neural

<p align="center">
  <img src="./assets/exemplo-rede-detalhada.png" alt="Arquitetura da Rede Neural" width="600">
</p>

A figura acima ilustra a arquitetura de uma **rede neural feedforward** (dados fluem da esquerda para a direita):

- **Parâmetros de entrada:** os dados que entram na rede (no nosso projeto, o vetor com idade, renda, experiência e região em one-hot — 6 valores por pessoa).
- **Neurônios:** cada círculo representa um neurônio. **Cada coluna de círculos é uma camada** (entrada, ocultas, saída).
- **Camada oculta (hidden layer):** as colunas do meio. Cada camada refina a informação da anterior, como filtros que vão extraindo padrões.
- **Camada de saída:** a última coluna, que devolve o resultado do modelo (no nosso caso, as 6 probabilidades de risco: nenhum, baixo, médio, alto, perigoso, recusar).

As linhas tracejadas entre camadas indicam que cada neurônio está ligado a todos da camada seguinte (rede **densa**, como no `training.ts`). O treinamento ajusta os pesos dessas conexões para que a saída se aproxime dos rótulos esperados (tensor Y).

### Normalização (entrada numérica)

Valores numéricos são normalizados para o intervalo **[0, 1]** para a rede trabalhar melhor:

- **Fórmula:** `(valor - min) / (max - min)`
- Exemplo: idade 50 com min=0 e max=100 → `0.5`

### One-hot encoding

Dados **categóricos** (como região) viram **dimensões binárias**: cada categoria vira uma posição no vetor, com 1 na categoria da pessoa e 0 nas demais.

> **Nota:** One-hot encoding é uma forma de representar categorias (texto ou rótulos) como números para a rede neural. Em vez de usar um único número (ex.: 1, 2, 3), cada categoria vira uma **dimensão**: só uma posição fica com valor 1 (“quente”) e as outras com 0. Assim a rede não interpreta ordem ou grandeza entre categorias — todas ficam no mesmo pé. No projeto, usamos one-hot tanto na **entrada** (região) quanto na **saída** (classe de risco).
>
> **Leia mais:** [one-hot.md](./one-hot.md) — guia didático com a regra “cada alternativa vira uma coluna” e exemplos (região, risco, cidades).

**Região** (ordem: capital, interior, metropolitana):

| Região        | Capital | Interior | Metropolitana |
| ------------- | ------- | -------- | ------------- |
| capital       | 1       | 0        | 0             |
| interior      | 0       | 1        | 0             |
| metropolitana | 0       | 0        | 1             |

O **risco** também é one-hot encoded na saída: cada uma das 6 categorias é uma dimensão; a rede aprende a “acender” a categoria correta.

### Tensores de entrada e saída

- **Tensor X (features / entradas):** contém os **dados de entrada** do modelo. Cada linha é uma pessoa, com 6 valores:  
  `[idade_norm, renda_norm, exp_norm, capital, interior, metropolitana]`  
  Ou seja: as três primeiras posições são numéricas normalizadas; as três últimas são o one-hot da região.

- **Tensor Y (labels / target / saídas):** contém as **respostas esperadas** para cada pessoa. Cada linha é o one-hot do risco daquela pessoa (6 posições, uma por categoria: nenhum, baixo, médio, alto, perigoso, recusar).

> **Nota:** Na notação comum de aprendizado de máquina, **X** representa as *features* (atributos que entram no modelo) e **Y** representa o *target* (o que queremos prever). O modelo aprende a mapear X → Y: dado um vetor de entrada, produzir a classe de risco correta.

### Informações adicionais

- **`one-hot.md`** — Guia didático sobre one-hot encoding (cada alternativa = uma coluna), com exemplos de região, risco e cidades.
