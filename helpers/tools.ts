import { Person } from "../index.js";

export class Tools {
    /**
     * Calcula o número do tensor (normalização).
     * Quando o valor é 1 representa o máximo, 0 representa o mínimo.
     * Exemplo:
     *
     * min = 0
     * max = 100
     * value = 50
     *
     * (50 - 0) / (100 - 0) = 0.5
     *
     * 0.5 é o número do tensor.
     *
     * @param min - O valor mínimo.
     * @param max - O valor máximo.
     * @param value - O valor a ser calculado.
     * @returns O número do tensor normalizado.
     */
    static calcTensorNumber(min: number, max: number, value: number) {
        return (value - min) / (max - min);
    }

    /**
     * Codifica os dados em one-hot.
     * @param data - O dado a ser codificado.
     * @param categories - As categorias para codificação.
     * @returns Os dados codificados em one-hot.
     */
    static oneHotEncode(data: string, categories: string[]) {
        return categories.map(category => data === category ? 1 : 0);
    }


    /**
     * A regra de negócio que vai determinar o risco da pessoa.
     * Essa regra foi gerada apenas para fins de estudo.
     * Quanto maior o valor, maior o risco
     * @param person Essa pessoa será analisada para determinar o risco.
     * @returns A pontuação de risco da pessoa.
     */
    static risks = [
        "nenhum",
        "baixo",
        "médio",
        "alto",
        "perigoso",
        "recusar"
    ]

    /**
     * Análise de risco por fatores.
     * Retorna índice 0–5 que corresponde a categorias_de_risco.
     */
    static riskAnalysis(p: Person): number {
        let score = 0

        // Idade: muito jovem ou muito idoso tende a aumentar risco
        if (p.age < 20) score += 1.2
        else if (p.age < 25) score += 0.8
        else if (p.age >= 65) score += 0.5

        // Experiência: poucos anos de carteira aumenta risco
        if (p.driving_experience < 1) score += 1.2
        else if (p.driving_experience < 2) score += 0.8
        else if (p.driving_experience < 3) score += 0.3

        // Renda: faixas mais baixas podem indicar maior risco (manutenção do veículo, etc.)
        if (p.income < 1500) score += 1.2
        else if (p.income < 2500) score += 0.7
        else if (p.income < 4000) score += 0.3

        // Região: capital e metropolitana com mais sinistros; interior mais estável
        if (p.region === 'capital') score += 1
        else if (p.region === 'metropolitana') score += 0.5

        // Garante índice inteiro 0–5 para one-hot encoding
        const clamped = Math.min(Math.max(score, 0), Tools.risks.length - 1)
        return Math.round(clamped)
    }
}