import path from 'path';
import { fileURLToPath } from 'url';
import tf from '@tensorflow/tfjs-node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Training {
    /** URL file:// para salvar/carregar no disco (obrigatório no Node) */
    static get path(): string {
        return 'file://' + path.resolve(__dirname, '..', 'model');
    }
    static neurons: number = 10000;
    static epochs: number = 100;
    static async train(tensorX: tf.Tensor, tensorY: tf.Tensor): Promise<tf.Sequential> {

        /** Instancia o modelo */
        const model = tf.sequential();

        /** Adiciona camadas ao modelo */
        model.add(tf.layers.dense({ 
            units: this.neurons, 
            inputShape: [tensorX.shape[1] as number], // Tamanho da entrada (camada de entrada)
            activation: 'relu'
        }));
        
        /** Adiciona a camada de saída ao modelo */
        model.add(tf.layers.dense({ 
            units: tensorY.shape[1] as number,  // Tamanho da saída (camada de saída)
            activation: 'softmax'
        }));
        
        /** Compila o modelo */
        model.compile({ 
            optimizer: 'adam',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });


        /** Treina o modelo */
        await model.fit(tensorX, tensorY, {
            verbose: 0,
            epochs: this.epochs,
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    // console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
                }
            }
        });

        /** Retorna o modelo */
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