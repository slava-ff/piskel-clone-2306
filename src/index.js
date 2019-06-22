/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
import penAction from './tools/pen';
import eraserAction from './tools/eraser';
import strokeAction from './tools/stroke';
import drawLine from './tools/drawLine';
// import scaleCanvas from './animation_management/scaleCanvas';

/* const landingPage = document.getElementById('start');
landingPage.onclick = function () {
  document.getElementById('landingPage').style.display = 'none';
}; */

// ==================      FRAMES / PREVIEW / BUTTONS      ================== //

const framesHTML = document.getElementById('frames');
const addFrameBtn = document.getElementById('addFrame');
const newFrameBtn = document.getElementById('newFrame');
const fullscreen = document.getElementById('fullscreen');
const canvasMain = document.getElementById('canvasToPaint');
const canvasToCursor = document.getElementById('canvasToCursor');

const speedRange = document.getElementById('speedRange');
const speedRangeValue = document.getElementById('speedRangeValue');
const cursorCoords = document.getElementById('cursorCoords');

const canvasPreview = document.getElementById('canvasPreview');
console.log('canvasPreview: ', canvasPreview);
console.log('canvasMain: ', canvasMain);
const ctxPreview = canvasPreview.getContext('2d');

const frameNames = [];
for (let i = 0; i < 100; i += 1) {
  const x = `frame${i}`;
  frameNames.push(x);
  window[`frame${i}`] = document.getElementById(x);
}


const framesUrls = [];


// ==================      TOOLS      ================== //

const tools = document.getElementById('tools');

const toolPaint = document.getElementById('paint');
const toolColorpicker = document.getElementById('colorpicker');
const toolPen = document.getElementById('pen');
const toolRectangle = document.getElementById('rectangle');
const toolCircle = document.getElementById('circle');
const toolStroke = document.getElementById('stroke');
const toolEraser = document.getElementById('eraser');

const primaryColor = document.getElementById('primaryColor');
const secondaryColor = document.getElementById('secondaryColor');
const swapColors = document.getElementById('swapColors');

const canvasSize = document.getElementById('size');

// ==================      TOOL ACTIVATION FUNCTIONALITY      ================== //

const ctxMain = canvasMain.getContext('2d');
const ctxToCursor = canvasToCursor.getContext('2d');


const toolState = {
  currentToolId: '',
  primaryColor: '#ff0000',
  secondaryColor: '#9555af',
};

// смена инструмента (выделение + активация/деактивация)
function changeTool(e, clickedElement) {
  canvasToCursor.classList.remove(`${toolState.currentToolId}Cursor`);
  // toolPaint.classList.remove('highlight');
  // toolColorpicker.classList.remove('highlight');
  // toolRectangle.classList.remove('highlight');
  // toolCircle.classList.remove('highlight');
  toolPen.classList.remove('highlight');
  toolStroke.classList.remove('highlight');
  toolEraser.classList.remove('highlight');
  if (toolState.currentToolId === clickedElement.id) toolState.currentToolId = '';
  else {
    toolState.currentToolId = clickedElement.id;
    clickedElement.classList.add('highlight');
    canvasToCursor.classList.add(`${clickedElement.id}Cursor`);
  }
  if (toolState.currentToolId === 'pen') penAction(showCursorCoords, isMouseDown, toolState, ctxMain, canvasMain, canvasToCursor, ctxToCursor, ctxPreview, drawLine, copyCanvas, canvasCur, returnCurrentFrame);
  if (toolState.currentToolId === 'eraser') eraserAction(showCursorCoords, isMouseDown, toolState, ctxMain, canvasMain, canvasToCursor, ctxToCursor, ctxPreview, drawLine, copyCanvas, canvasCur, returnCurrentFrame);
  if (toolState.currentToolId === 'stroke') strokeAction(showCursorCoords, isMouseDown, toolState, ctxMain, canvasMain, canvasToCursor, ctxToCursor, ctxPreview, drawLine, copyCanvas, canvasCur, returnCurrentFrame);
  console.log('toolState.currentToolId', toolState.currentToolId);
  // if (toolState.currentToolId === 'rectangle') rectangleAction();
}

// выбор инструмента по клавише
onkeypress = (e) => {
  if (e.code === 'KeyP') changeTool(e, toolPaint);
  else if (e.code === 'KeyC') changeTool(e, toolColorpicker);
};

// выбор инструмента по клику
tools.onclick = (e) => {
  if (e.target.tagName !== 'IMG') return;
  const target = e.target.closest('.btn');
  changeTool(e, target);
};

// ==================      SCALE FUNCTIONALITY      ================== //

let currentFrame = 0;

const canvasMainRealSize = 512;
const canvasPreviewRealSize = 160;
const canvasFrameRealSize = 128;
let canvasCurrVirtualSize = 32;
let canvasPrevVirtualSize = 32;

function scaleOne(someCanvas, realSize, marginCorrection) {
  someCanvas.width = canvasCurrVirtualSize;
  someCanvas.height = canvasCurrVirtualSize;
  someCanvas.style.transform = `scale(${realSize / someCanvas.width}, ${realSize / someCanvas.height})`;
  someCanvas.style.marginTop = `${(realSize - someCanvas.height) / 2 - marginCorrection}px`;
  someCanvas.style.marginLeft = `${(realSize - someCanvas.width) / 2 - marginCorrection}px`;
}

function scaleCanvas() {
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

function showCursorCoords(x, y) {
  if (x && y) cursorCoords.innerHTML = `[${canvasSize.value}x${canvasSize.value}]: ${x}x${y}`;
  else cursorCoords.innerHTML = `[${canvasSize.value}x${canvasSize.value}]`;
}

scaleCanvas();

canvasSize.onchange = () => {
  scaleCanvas();
};

// ==================      FRAMES FUNCTIONALITY      ================== //

// let currentFrame = 0;

function returnCurrentFrame() {
  return currentFrame;
}

function findCurFrame(e) {
  let curFramebox;
  if (e.classList) {
    if (e.classList.value === 'frameBox' || e.classList.value === 'frameBox current') curFramebox = e;
  } else curFramebox = e.target.closest('.frameBox');
  const allFrameBoxes = [];
  for (let i = 0; i < framesHTML.children.length - 1; i++) {
    allFrameBoxes.push(framesHTML.children[i]);
  }
  return allFrameBoxes.indexOf(curFramebox);
}

function findLastFrame() {
  return framesHTML.children.length - 2;
}

function activateCurFrame(i) {
  for (let j = 0; j < framesHTML.children.length - 1; j++) {
    framesHTML.children[j].classList.remove('current');
    framesHTML.children[j].children[2].innerHTML = j + 1;
  }
  framesHTML.children[i].classList.add('current');
  copyCanvas(canvasCur(i), canvasMain);
  if (framesHTML.children.length - 1 === 1) framesHTML.children[0].children[1].classList.add('hide');
  else framesHTML.children[0].children[1].classList.remove('hide');
}

// find index of clicked frame
framesHTML.onclick = (e) => {
  if (e.target.classList.value === 'frame') {
    currentFrame = findCurFrame(e);
    activateCurFrame(currentFrame);
  }
};


function canvasCur(i) {
  return framesHTML.children[i].lastElementChild; // it was firstElementChild
}

function clearCanva() {
  ctxMain.beginPath();
  ctxMain.clearRect(0, 0, canvasMain.width, canvasMain.height);
  ctxMain.fill();
}

function zeroFrame() {
  clearCanva();
  const ctxCur = canvasCur(0).getContext('2d');
  activateCurFrame(currentFrame);
  ctxCur.beginPath();
  ctxCur.clearRect(0, 0, canvasCur(0).width, canvasCur(0).height);
  framesUrls[currentFrame] = canvasCur(0).toDataURL('image/png');
}

zeroFrame();

function addFrame() {
  const markup = `
    <div class="frameBox">
        <button class="copy"><img class="copyImg" src="src/icons/frame-copy.png" alt="frame-copy.png"></button>
        <button class="del"><img class="delImg" src="src/icons/frame-del.png" alt="frame-del.png"></button>
        <div class="frameNumber"></div>
        <canvas class="frame" width="32" height="32"></canvas>
    </div>
  `;
  newFrameBtn.insertAdjacentHTML('beforebegin', markup);
  currentFrame = findLastFrame();
  scaleOne(canvasCur(currentFrame), canvasFrameRealSize, 0);
  framesUrls[currentFrame] = canvasCur(currentFrame).toDataURL('image/png');
  activateCurFrame(currentFrame);
}

function findFrameBox(e) {
  let { target } = e;
  const findParent = () => {
    target = target.parentNode;
    if (!target.classList.contains('frameBox')) {
      findParent();
    }
    return target;
  };
  return findParent();
}

function copyFrame(e) {
  const markup = `
    <div class="frameBox">
      <button class="copy"><img class="copyImg" src="src/icons/frame-copy.png" alt="frame-copy.png"></button>
      <button class="del"><img class="delImg" src="src/icons/frame-del.png" alt="frame-del.png"></button>
      <div class="frameNumber"></div>
      <canvas class="frame" width="32" height="32"></canvas>
    </div>
  `;
  currentFrame = findCurFrame(findFrameBox(e));
  framesHTML.children[currentFrame].insertAdjacentHTML('afterend', markup);
  const canvasCopyFrom = canvasCur(currentFrame);
  framesUrls.splice(currentFrame, 0, canvasCur(currentFrame).toDataURL('image/png'));
  currentFrame++;
  scaleOne(canvasCur(currentFrame), canvasFrameRealSize, 0);
  const canvasCopyTo = canvasCur(currentFrame);
  copyCanvas(canvasCopyFrom, canvasCopyTo);
  console.log('canvasCur(currentFrame): ', canvasCur(currentFrame));
  activateCurFrame(currentFrame);
}

function deleteFrame(e) {
  console.log('targetToFrame(e): ', findFrameBox(e));
  const index = findCurFrame(findFrameBox(e));
  console.log('index: ', index);
  document.getElementById('frames').removeChild(findFrameBox(e));
  framesUrls.splice(index, 1);
  if (returnCurrentFrame() >= index && returnCurrentFrame() !== 0) currentFrame--;
  activateCurFrame(currentFrame);
}

addFrameBtn.addEventListener('click', () => {
  addFrame();
  clearCanva();
});

document.addEventListener('click', (e) => {
  /* console.log('e.target: ', e.target);
  console.log('e.target.classList.value: ', e.target.classList.value);
  console.log('e.target.id: ', e.target.id); */

  if (e.target.classList.value === 'copyImg' || e.target.classList.value === 'copy') {
    // currentFrame =
    // activateCurFrame(currentFrame);
    copyFrame(e);
  }
  if (e.target.classList.value === 'delImg' || e.target.classList.value === 'del') {
    deleteFrame(e);
  }
});

// ==================      ANIMATION      ================== //

function draw(frameSrc) {
  const frame = new Image();
  frame.src = frameSrc;
  // console.log(`frame${count}: `, frame);
  ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
  ctxPreview.drawImage(frame, 0, 0);
  // console.log(`i am drawing now! ${count}`);
}

let count = 0;
let intervalX;

function startAnimation() {
  if (intervalX) clearInterval(intervalX);
  intervalX = setInterval(() => {
    const frameSrc = framesUrls[count % framesUrls.length];
    draw(frameSrc);
    count++;
  }, 1000 / speedRange.value);
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    canvasPreview.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

startAnimation();

speedRange.onmouseup = () => {
  speedRangeValue.innerHTML = speedRange.value.toString();
  startAnimation();
};

fullscreen.onclick = () => {
  toggleFullScreen();
};

// ==================      TOOLS USAGE FUNCTIONALITY      ================== //

let isMouseDown = false;

function initColors() {
  primaryColor.value = toolState.primaryColor;
  secondaryColor.value = toolState.secondaryColor;
}

initColors();

swapColors.onclick = () => {
  const tempColor = toolState.primaryColor;
  toolState.primaryColor = toolState.secondaryColor;
  toolState.secondaryColor = tempColor;
  initColors();
};

primaryColor.onchange = () => {
  toolState.primaryColor = primaryColor.value;
};

secondaryColor.onchange = () => {
  toolState.secondaryColor = secondaryColor.value;
};

function copyCanvas(fromCanvas, toCanvas) {
  const myImageData = fromCanvas.getContext('2d').getImageData(0, 0, canvasCurrVirtualSize, canvasCurrVirtualSize);
  toCanvas.getContext('2d').putImageData(myImageData, 0, 0);
  framesUrls[returnCurrentFrame()] = canvasCur(returnCurrentFrame()).toDataURL('image/png');
}

// PEN functionality - NOW IS IMPORTED
// STROKE functionality - NOW IS IMPORTED
// Bresenham's line algorithm - NOW IS IMPORTED

document.addEventListener('click', (e) => {
  if (toolState.currentToolId === 'rectangle') {
    console.log('rect event', e);
    /* let drawRect = async () => {
      await
      contextToPaint.fillRect();
    }
    drawRect(); */
  }
  if (toolState.currentToolId === 'colorpicker') {
    /*
    console.log('getComputedStyle(currentColor1).backgroundColor', getComputedStyle(currentColor1).backgroundColor);
      if (e.target.classList.value !== 'txt') {
        if (e.target.classList.value === 'txt2' || e.target.id === 'blueBtn' || e.target.id === 'redBtn' || e.target.id === 'currentBtn' || e.target.id === 'prevBtn') {
          if (e.target.id === 'currentTxt' || e.target.id === 'currentBtn') currentColor1.style.backgroundColor = currentColor1.style.backgroundColor;
          else if (e.target.id === 'prevTxt' || e.target.id === 'prevBtn') currentColor1.style.backgroundColor = getComputedStyle(prevColor1).backgroundColor;
          else if (e.target.id === 'redTxt' || e.target.id === 'redBtn') currentColor1.style.backgroundColor = getComputedStyle(redColor1).backgroundColor;
          else if (e.target.id === 'blueTxt' || e.target.id === 'blueBtn') currentColor1.style.backgroundColor = getComputedStyle(blueColor1).backgroundColor;
        } else currentColor1.style.backgroundColor = getComputedStyle(e.target).backgroundColor;
        // localStorage.setItem('currentColor1', currentColor1.style.backgroundColor);
      }
      */
    console.log('OOOOPS');
  }

  if (toolState.currentToolId === 'paint') {
    /* if (e.target.classList.value == 'square') {
      console.log('e.target.id', e.target.id);
      e.target.style.backgroundColor = currentColor1.style.backgroundColor;
      prevColor1.style.backgroundColor = e.target.style.backgroundColor;

      let canvas = document.getElementById(currentFrame);
      let c = canvas.getContext('2d');
      c.fillRect(51, 51, 20, 20);
      framesUrls[currentFrame] = canvas.toDataURL("image/png");
    } */
  }
});

// ==================      COLOR MANAGEMENT      ================== //

/*
ctx.scale(2, 2); - увеличение масштаба!!!!
ctx.rotate(-.1) / (.1) поворот в радианах! и в градусах: ctx.rotate (10 * Math.PI/180)
сtx.fillText("Hello", 50, 50) - / ctx.font = '40px Georgia' / ctx.textAlign = 'center'
*/
