/* eslint-disable no-param-reassign */
// eslint-disable-next-line max-len
export default function eraserAction(showCursorCoords, isMouseDown, toolState, ctxMain, canvasMain, canvasToCursor, ctxToCursor, ctxPreview, drawLine, copyCanvas, canvasCur, returnCurrentFrame) {
  let prevX;
  let prevY;

  canvasToCursor.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  canvasToCursor.addEventListener('mousedown', (e) => {
    if (toolState.currentToolId === 'eraser') {
      ctxToCursor.clearRect(prevX, prevY, 1, 1);
      isMouseDown = true;
      ctxMain.beginPath();
      ctxMain.clearRect(e.offsetX, e.offsetY, 1, 1);
      ctxMain.fill();
    }
  });
  canvasToCursor.addEventListener('mouseup', () => {
    if (toolState.currentToolId === 'eraser') {
      isMouseDown = false;
      ctxMain.beginPath();
      prevX = false;
      prevY = false;
      // copyCanvas(ctxMain, ctxPreview, canvasCur(returnCurrentFrame()).getContext('2d'));
      copyCanvas(canvasMain, canvasCur(returnCurrentFrame()));

      // let UUUU = canvasMain.toDataURL("image/png");
      // console.log('UUUU', UUUU);
    }
  });

  canvasToCursor.addEventListener('mouseout', () => {
    if (toolState.currentToolId === 'eraser') {
      ctxToCursor.beginPath();
      ctxToCursor.clearRect(prevX, prevY, 1, 1);
      ctxToCursor.fill();
      showCursorCoords();
    }
  });

  canvasToCursor.addEventListener('mousemove', (e) => {
    if (toolState.currentToolId === 'eraser') {
      showCursorCoords(e.offsetX, e.offsetY);
      if (isMouseDown === true) {
        // eslint-disable-next-line max-len
        if (prevX !== false && prevY !== false) drawLine(prevX, prevY, e.offsetX, e.offsetY, ctxMain, true);
        prevX = e.offsetX;
        prevY = e.offsetY;
        ctxMain.beginPath();
        ctxMain.clearRect(e.offsetX, e.offsetY, 1, 1);
        ctxMain.fill();
      }
      if (isMouseDown === false) {
        ctxToCursor.beginPath();
        ctxToCursor.clearRect(prevX, prevY, 1, 1);
        ctxToCursor.fill();
        prevX = e.offsetX;
        prevY = e.offsetY;
        ctxToCursor.fillStyle = 'rgba(255,255,255, 0.5)';
        ctxToCursor.rect(e.offsetX, e.offsetY, 1, 1);
        ctxToCursor.fill();
      }
    }
  });
}
