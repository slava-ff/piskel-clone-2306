/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line max-len
export default class PenClass {
  constructor(showCursorCoords, isMouseDown, toolState, ctxMain, canvasMain, canvasToCursor, ctxToCursor, drawLine, copyCanvas) {
    this.penAction = () => {
      let prevX;
      let prevY;
      let colorToPaint;

      canvasToCursor.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });

      canvasToCursor.addEventListener('mousedown', (e) => {
        if (toolState.currentToolId === 'pen') {
          ctxToCursor.clearRect(prevX, prevY, 1, 1);
          isMouseDown = true;
          ctxMain.beginPath();
          if (e.button === 2) colorToPaint = toolState.secondaryColor;
          else colorToPaint = toolState.primaryColor;
          ctxMain.fillStyle = colorToPaint;
          ctxMain.rect(e.offsetX, e.offsetY, 1, 1);
          ctxMain.fill();
        }
      });
      canvasToCursor.addEventListener('mouseup', () => {
        if (toolState.currentToolId === 'pen') {
          isMouseDown = false;
          ctxMain.beginPath();
          prevX = false;
          prevY = false;
          copyCanvas();

          // let UUUU = canvasMain.toDataURL("image/png");
          // console.log('UUUU', UUUU);
        }
      });

      canvasToCursor.addEventListener('mouseout', () => {
        if (toolState.currentToolId === 'pen') {
          ctxToCursor.beginPath();
          ctxToCursor.clearRect(prevX, prevY, 1, 1);
          ctxToCursor.fill();
          showCursorCoords();
        }
      });

      canvasToCursor.addEventListener('mousemove', (e) => {
        if (toolState.currentToolId === 'pen') {
          showCursorCoords(e.offsetX, e.offsetY);
          if (isMouseDown === true) {
            if (prevX !== false && prevY !== false) drawLine(prevX, prevY, e.offsetX, e.offsetY, ctxMain, false);
            prevX = e.offsetX;
            prevY = e.offsetY;
            ctxMain.beginPath();
            ctxMain.fillStyle = colorToPaint;
            ctxMain.rect(e.offsetX, e.offsetY, 1, 1);
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
    };

    this.rende = () => {
      console.log('RENDERRR');
      const markup = '<button class="btn" id="pen"><img src="src/icons/tool-pen.png" alt="tool-pen.png"></button>';
      // eslint-disable-next-line no-undef
      if (tools.innerHTML !== markup) tools.appendChild(markup);
    };
  }
}
