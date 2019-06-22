/* eslint-disable no-param-reassign */
// eslint-disable-next-line max-len
export default function strokeAction(showCursorCoords, isMouseDown, toolState, ctxMain, canvasMain, canvasToCursor, ctxToCursor, ctxPreview, drawLine, copyCanvas, canvasCur, returnCurrentFrame) {
  let colorToPaint;
  let x0;
  let y0;
  let prevX;
  let prevY;

  canvasToCursor.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  canvasToCursor.addEventListener('mousedown', (e) => {
    if (toolState.currentToolId === 'stroke') {
      isMouseDown = true;
      x0 = e.offsetX;
      y0 = e.offsetY;
      if (e.button === 2) colorToPaint = toolState.secondaryColor;
      else colorToPaint = toolState.primaryColor;
    }
  });

  canvasToCursor.addEventListener('mouseup', (e) => {
    if (toolState.currentToolId === 'stroke') {
      ctxToCursor.beginPath();
      ctxToCursor.clearRect(0, 0, 32, 32);
      ctxToCursor.fill();
      isMouseDown = false;
      ctxMain.beginPath();
      if (e.button === 2) colorToPaint = toolState.secondaryColor;
      else colorToPaint = toolState.primaryColor;
      ctxMain.fillStyle = colorToPaint;
      drawLine(x0, y0, e.offsetX, e.offsetY, ctxMain, false);
      copyCanvas(canvasMain, canvasCur(returnCurrentFrame()));
    }
  });

  canvasToCursor.addEventListener('mouseout', () => {
    if (toolState.currentToolId === 'stroke') {
      ctxToCursor.beginPath();
      ctxToCursor.clearRect(prevX, prevY, 1, 1);
      ctxToCursor.fill();
      showCursorCoords();
    }
  });

  canvasToCursor.addEventListener('mousemove', (e) => {
    if (toolState.currentToolId === 'stroke') {
      if (isMouseDown === true) {
        ctxToCursor.beginPath();
        drawLine(x0, y0, prevX, prevY, ctxToCursor, true);
        prevX = e.offsetX;
        prevY = e.offsetY;
        ctxToCursor.fillStyle = colorToPaint;
        drawLine(x0, y0, e.offsetX, e.offsetY, ctxToCursor, false);
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
