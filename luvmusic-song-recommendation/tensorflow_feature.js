var tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node')

var model = tf.sequential();
model.add(tf.layers.dense({units: 100, activation: 'relu', inputShape: [10]}));
model.add(tf.layers.dense({units: 1, activation: 'linear'}));
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

var xs = tf.randomNormal([100, 10]);
var ys = tf.randomNormal([100, 1]);

model.fit(xs, ys, {
  epochs: 100,
  callbacks: {
    onEpochEnd: async (epoch, log) => {
      console.log(`Epoch ${epoch}: loss = ${log.loss}`);
    }
  }
});