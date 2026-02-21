import tf from '@tensorflow/tfjs-node'
import { Tools } from './helpers/tools.js'
import { Training } from './helpers/training.js'

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
            Tools.categorias_de_risco[Tools.riskAnalysis(pessoa)],
            Tools.categorias_de_risco
        )
    ])

/**
 * X representa as entradas (features).
 * Y representa as saídas (labels).
 */
const tensorX = tf.tensor2d(tensorPessoas) // Features
const tensorY = tf.tensor2d(riscos) // Target 

tensorX.print()
tensorY.print()



// Para treinar e salvar (como está agora):
const model = await Training.train(tensorX, tensorY);
await Training.save(model);

// Para só carregar o modelo já salvo (sem treinar):
// const model = await Training.load();