import { Pessoa } from "../index.js";

export class Tools {
    /**
     * Calculate the tensor number.
     * When the value is 1 is a Max value, 0 is a Min value.
     * Example:
     * 
     * min = 0
     * max = 100
     * value = 50
     * 
     * (50 - 0) / (100 - 0) = 0.5
     * 
     * 0.5 is the tensor number.
     * 
     * @param min - The minimum value.
     * @param max - The maximum value.
     * @param value - The value to be calculated.
     * @returns The tensor number.
     */
    static calcTensorNumber(min: number, max: number, value: number) {
        return (value - min) / (max - min);
    }

    /**
     * One hot encode the data.
     * @param data - The data to be encoded.
     * @param categories - The categories to be encoded.
     * @returns The one hot encoded data.
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
    static categorias_de_risco = [
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
    static riskAnalysis(p: Pessoa): number {
        let score = 0

        // Idade: muito jovem ou muito idoso tende a aumentar risco
        if (p.idade < 20) score += 1.2
        else if (p.idade < 25) score += 0.8
        else if (p.idade >= 65) score += 0.5

        // Experiência: poucos anos de carteira aumenta risco
        if (p.anos_habilitacao < 1) score += 1.2
        else if (p.anos_habilitacao < 2) score += 0.8
        else if (p.anos_habilitacao < 3) score += 0.3

        // Renda: faixas mais baixas podem indicar maior risco (manutenção do veículo, etc.)
        if (p.renda < 1500) score += 1.2
        else if (p.renda < 2500) score += 0.7
        else if (p.renda < 4000) score += 0.3

        // Região: capital e metropolitana com mais sinistros; interior mais estável
        if (p.regiao === 'capital') score += 1
        else if (p.regiao === 'metropolitana') score += 0.5

        // Garante índice inteiro 0–5 para one-hot encoding
        const clamped = Math.min(Math.max(score, 0), Tools.categorias_de_risco.length - 1)
        return Math.round(clamped)
    }
}