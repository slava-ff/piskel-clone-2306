/* eslint-disable no-plusplus */

function pixel(x, y, whichCtx, shouldErase) {
  if (shouldErase === true) whichCtx.clearRect(x, y, 1, 1);
  else whichCtx.rect(x, y, 1, 1);
  whichCtx.fill();
}

// ==================      Bresenham's line algorithm      ================== //

export default function drawLine(x1, y1, x2, y2, whichCtx, shouldErase) {
  let x; let y; let px; let py; let xe; let ye; let i;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dx1 = Math.abs(dx);
  const dy1 = Math.abs(dy);
  px = 2 * dy1 - dx1;
  py = 2 * dx1 - dy1;
  if (dy1 <= dx1) {
    if (dx >= 0) {
      x = x1; y = y1; xe = x2;
    } else {
      x = x2; y = y2; xe = x1;
    }
    pixel(x, y, whichCtx, shouldErase);
    for (i = 0; x < xe; i++) {
      x += 1;
      if (px < 0) {
        px += 2 * dy1;
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          y += 1;
        } else {
          y -= 1;
        }
        px += 2 * (dy1 - dx1);
      }
      pixel(x, y, whichCtx, shouldErase);
    }
  } else {
    if (dy >= 0) {
      x = x1; y = y1; ye = y2;
    } else {
      x = x2; y = y2; ye = y1;
    }
    pixel(x, y, whichCtx, shouldErase);
    for (i = 0; y < ye; i++) {
      y += 1;
      if (py <= 0) {
        py += 2 * dx1;
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          x += 1;
        } else {
          x -= 1;
        }
        py += 2 * (dx1 - dy1);
      }
      pixel(x, y, whichCtx, shouldErase);
    }
  }
}
