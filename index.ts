import tf from '@tensorflow/tfjs-node'
import { Tools } from './helpers/tools.js'

export interface Pessoa { 
    idade: number;
    renda: number;
    anos_habilitacao: number;
    regiao: 'capital' | 'interior' | 'metropolitana';
}


/**
 * A cada possibilidade de variação é considerado uma dimensão
 */

const pessoas: Pessoa[] = [
    {
        idade: 25,
        renda: 1000,
        anos_habilitacao: 5,
        regiao: 'capital',
    }
]


const tensorPessoas = pessoas.map(pessoa => [
    Tools.calcTensorNumber(0, 100, pessoa.idade),
    Tools.calcTensorNumber(0, 100000, pessoa.renda),
    Tools.calcTensorNumber(0, 10, pessoa.anos_habilitacao),
    ...Tools.oneHotEncode(pessoa.regiao, ['capital', 'interior', 'metropolitana']),
])



const riscos = pessoas.map(pessoa => 
    [
        ...Tools.oneHotEncode(
            Tools.riskAnalysis(pessoa).toString(), 
            Tools.categorias_de_risco
        )
    ])


const tensor = tf.tensor2d(tensorPessoas)

tensor.print()