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
    static riskAnalysis(p: Pessoa): number {
        let score = 0

        if (p.idade < 21) score += 1
        if (p.anos_habilitacao < 2) score += 1
        if (p.renda < 2000) score += 1
        if (p.regiao === 'capital') score += 1
        if (p.regiao === 'interior') score += 0 // Não oferece risco
        if (p.regiao === 'metropolitana') score += 0.4

        return Math.min(score, 5)
    }
}