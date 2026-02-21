import path from 'path';
import { fileURLToPath } from 'url';
import tf from '@tensorflow/tfjs-node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Training {
    /** URL file:// para salvar/carregar no disco (obrigatório no Node) */
    static get path(): string {
        return 'file://' + path.resolve(__dirname, '..', 'model');
    }
    static neurons: number = 100;
    static epochs: number = 100;
    static async train(tensorX: tf.Tensor, tensorY: tf.Tensor): Promise<tf.Sequential> {

        /** Instance a model */
        const model = tf.sequential();

        /** Add layers to the model */
        model.add(tf.layers.dense({ 
            units: this.neurons, 
            inputShape: [tensorX.shape[1] as number], // Information size of the input layer,
            activation: 'relu'
        }));
        
        /** Add output layer to the model */
        model.add(tf.layers.dense({ 
            units: tensorY.shape[1] as number,  // Information size of the output layer
            activation: 'softmax'
        }));
        
        /** Compile the model */
        model.compile({ 
            optimizer: 'adam',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });


        /** Train the model */
        await model.fit(tensorX, tensorY, {
            verbose: 0,
            epochs: this.epochs,
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
                }
            }
        });

        /** Return the model */
        return model;
    }
    static async save(model: tf.Sequential): Promise<void> {
        await model.save(this.path);
    }

    static async load(): Promise<tf.LayersModel> {
        const model = await tf.loadLayersModel(this.path)
        
        return model;
    }
}