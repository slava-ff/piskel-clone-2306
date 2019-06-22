/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line max-len
export default function scaleCanvas(scaleOne, canvasSize, canvasMain, canvasToCursor, canvasPreview, framesHTML, canvasCur, framesUrls, copyCanvas, returnCurrentFrame, showCursorCoords) {
  const canvasMainRealSize = 512;
  const canvasPreviewRealSize = 160;
  const canvasFrameRealSize = 128;
  let canvasCurrVirtualSize = 32;
  let canvasPrevVirtualSize = 32;
  canvasPrevVirtualSize = canvasCurrVirtualSize;
  canvasCurrVirtualSize = canvasSize.value;
  const pointToInsert = (canvasCurrVirtualSize - canvasPrevVirtualSize) / 2;
  // if (pointToInsert < 0) pointToInsert = 0;
  console.log('canvasCurrVirtualSize: ', canvasCurrVirtualSize);
  console.log('canvasPrevVirtualSize: ', canvasPrevVirtualSize);
  console.log('pointToInsert: ', pointToInsert);
  const marginCorr0 = 0;
  const marginCorr1 = 1;

  scaleOne(canvasMain, canvasMainRealSize, marginCorr1);
  scaleOne(canvasToCursor, canvasMainRealSize, marginCorr1);
  scaleOne(canvasPreview, canvasPreviewRealSize, marginCorr0);
  for (let i = 0; i < framesHTML.children.length - 1; i++) {
    const myImageData = canvasCur(i).getContext('2d').getImageData(0, 0, canvasPrevVirtualSize, canvasPrevVirtualSize);
    scaleOne(canvasCur(i), canvasFrameRealSize, marginCorr0);
    canvasCur(i).getContext('2d').putImageData(myImageData, pointToInsert, pointToInsert);
    framesUrls[i] = canvasCur(i).toDataURL('image/png');
  }
  copyCanvas(canvasCur(returnCurrentFrame()), canvasMain);

  showCursorCoords();
}
