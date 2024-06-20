import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

import { drawVideo } from "./camera.js";

async function loadModel() {
  const model = await cocoSsd.load();
  return model;
}

async function main() {
  const loading = document.getElementById("status");
  loading.innerText = "Loading model...";

  const model = await loadModel();

  loading.innerText = "Loading camera...";
  const canvas = await drawVideo();

  async function detectFrame() {
    loading.innerText = "Detecting objects...";

    const predictions = await model.detect(canvas);
    console.log(predictions);
    requestAnimationFrame(detectFrame);
    predictions.forEach((pred) => {
      if (pred.class == "person") {
        loading.innerText = "Person detected!";
        const context = canvas.getContext("2d");
        context.beginPath();
        context.rect(pred.bbox[0], pred.bbox[1], pred.bbox[2], pred.bbox[3]);
        context.lineWidth = 2;
        context.strokeStyle = "red";
        context.fillStyle = "red";
        context.stroke();
        context.font = "18px Arial";
        context.fillStyle = "red";
        context.fillText(
          pred.class + ": " + Math.round(pred.score * 100) + "%",
          pred.bbox[0],
          pred.bbox[1] > 10 ? pred.bbox[1] - 5 : 10
        );
        const audio = document.getElementById("audio");
        audio.play();

        // Capture and display the
        if (pred.score < 0.6) {
          return;
        }
        const img = document.createElement("img");
        img.width = canvas.width;
        img.height = canvas.height;
        img.src = canvas.toDataURL("image/png");

        // Append the captured photo to the DOM
        const photosDiv = document.getElementById("photos");
        photosDiv.appendChild(img);
      }
    });

    console.log(tf.memory().numTensors);
  }

  detectFrame();

  console.log(tf.memory().numTensors);
}

main();
