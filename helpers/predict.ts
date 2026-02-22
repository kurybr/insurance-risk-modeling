import tf from '@tensorflow/tfjs-node';
import { Training } from './training.js';
import { Tools } from './tools.js';

export class Predict {
    static async predict(model: tf.Sequential, tensorX: tf.Tensor) {
        
        const output = await model.predict(tensorX) as tf.Tensor<tf.Rank>;

        const [predictions] = await output.array() as number[][];

        const risks = predictions.map((prediction: number, index: number) => {
            return {
                risk: Tools.risks[index],
                probability: prediction,
            }
        }).map(risk => `${risk.risk}: (${risk.probability.toFixed(2)}%)`)

        console.log(risks.join('\n'));
    }
}