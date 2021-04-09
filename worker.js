"use strict";
const R_OFFSET = 0;
const G_OFFSET = 1;
const B_OFFSET = 2;

let originalPixels = null;
let srcImageWidth = 0;
let srcImageHeight = 0;
let currentPixels = null;

function addBlue(x, y, value) {
  const index = getIndex(x, y) + B_OFFSET;
  const currentValue = currentPixels[index];
  currentPixels[index] = clamp(currentValue + value);
}
function addGreen(x, y, value) {
  const index = getIndex(x, y) + G_OFFSET;
  const currentValue = currentPixels[index];
  currentPixels[index] = clamp(currentValue + value);
}
function addRed(x, y, value) {
  const index = getIndex(x, y) + R_OFFSET;
  const currentValue = currentPixels[index];
  currentPixels[index] = clamp(currentValue + value);
}
function setGrayscale(x, y) {
  const redIndex = getIndex(x, y) + R_OFFSET;
  const greenIndex = getIndex(x, y) + G_OFFSET;
  const blueIndex = getIndex(x, y) + B_OFFSET;

  const redValue = currentPixels[redIndex];
  const greenValue = currentPixels[greenIndex];
  const blueValue = currentPixels[blueIndex];

  const mean = (redValue + greenValue + blueValue) / 3;

  currentPixels[redIndex] = clamp(mean);
  currentPixels[greenIndex] = clamp(mean);
  currentPixels[blueIndex] = clamp(mean);
}
function getIndex(x, y) {
  return (x + y * srcImageWidth) * 4;
}
function clamp(value) {
  return Math.max(0, Math.min(Math.floor(value), 255));
}

function processImage() {
  currentPixels = originalPixels.slice();

  for (let i = 0; i < srcImageHeight; i++) {
    for (let j = 0; j < srcImageWidth; j++) {
      setGrayscale(j, i);
    }
  }

  postMessage(currentPixels);
}

onmessage = function (event) {
  if (event.data) {
    srcImageWidth = event.data[0];
    srcImageHeight = event.data[1];
    originalPixels = event.data[2];
    processImage();
  }
};
