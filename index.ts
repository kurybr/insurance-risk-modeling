import tf from '@tensorflow/tfjs-node'
import fs from 'fs';
import { Tools } from './helpers/tools.js'
import { Training } from './helpers/training.js'
import { Predict } from './helpers/predict.js'

export interface Person { 
    age: number;
    income: number;
    driving_experience: number;
    region: 'capital' | 'interior' | 'metropolitana';
}

/**
 * A cada possibilidade de variação é considerado uma dimensão
 */

const dataset = fs.readFileSync('data/dataset.json', 'utf8');
const people: Person[] = JSON.parse(dataset);

const tensorPeople = people.map(person => [
    Tools.calcTensorNumber(0, 100, person.age),
    Tools.calcTensorNumber(0, 100000, person.income),
    Tools.calcTensorNumber(0, 10, person.driving_experience),
    ...Tools.oneHotEncode(person.region, ['capital', 'interior', 'metropolitana']),
])

const risks = people.map(person => 
    [
        ...Tools.oneHotEncode(
            Tools.risks[Tools.riskAnalysis(person)],
            Tools.risks
        )
    ])

/**
 * X representa as entradas (features).
 * Y representa as saídas (labels).
 */
const tensorX = tf.tensor2d(tensorPeople) // Features
const tensorY = tf.tensor2d(risks) // Target 

// tensorX.print()
// tensorY.print()

// Para treinar e salvar (como está agora):
const model = await Training.train(tensorX, tensorY);
await Training.save(model);



/**
 * 
 */





// 0 - nenhum (score ≈ 0): perfil estável
const risco_nenhum: Person = {
    age: 30,
    income: 5000,
    driving_experience: 5,
    region: 'interior',
}

// 1 - baixo (score ≈ 1): idoso ou metropolitana
const risco_baixo: Person = {
    age: 66,
    income: 5000,
    driving_experience: 5,
    region: 'metropolitana',
}

// 2 - médio (score ≈ 1.6 → round 2): jovem + pouca experiência
const risco_medio: Person = {
    age: 22,
    income: 5000,
    driving_experience: 1,
    region: 'interior',
}

// 3 - alto (score ≈ 3): jovem, sem experiência, capital
const risco_alto: Person = {
    age: 22,
    income: 5000,
    driving_experience: 0,
    region: 'capital',
}

// 4 - perigoso (score ≈ 4.2): seu exemplo atual
const risco_perigoso: Person = {
    age: 22,
    income: 1000,
    driving_experience: 0,
    region: 'capital',
}

// 5 - recusar (score ≈ 4.6 → round 5): todos os fatores máximos
const risco_recusar: Person = {
    age: 18,
    income: 1000,
    driving_experience: 0,
    region: 'capital',
}

const new_person_tensor = [
    [
        Tools.calcTensorNumber(0, 100, risco_recusar.age),
        Tools.calcTensorNumber(0, 100000, risco_recusar.income),
        Tools.calcTensorNumber(0, 10, risco_recusar.driving_experience),
        ...Tools.oneHotEncode(risco_recusar.region, ['capital', 'interior', 'metropolitana']),
    ]
]

const new_person_tensor_tf = tf.tensor2d(new_person_tensor);


await Predict.predict(model, new_person_tensor_tf);

