/**
 * Background Animation Worker
 * Runs canvas rendering in a separate thread using OffscreenCanvas.
 */

import {
  CONFIG,
  createShapeClass,
  createRandomShape,
} from './background-shared.js';

/** @type {OffscreenCanvas | null} */
let canvas = null;
/** @type {OffscreenCanvasRenderingContext2D | null} */
let ctx = null;
/** @type {InstanceType<ReturnType<typeof createShapeClass>>[]} */
let shapes = [];
/** @type {number | null} */
let rafId = null;
let isPaused = false;
let dpr = 1;
let logicalWidth = 0;
let logicalHeight = 0;

/** @type {ReturnType<typeof createShapeClass> | null} */
let Shape = null;

/**
 * Initialize shapes
 */
const initShapes = () => {
  Shape = createShapeClass(dpr);
  shapes = [];
  for (let i = 0; i < CONFIG.shapeCount; i++) {
    shapes.push(createRandomShape(Shape, logicalWidth, logicalHeight));
  }
};

/**
 * Animation loop
 */
const animate = () => {
  if (isPaused || !ctx || !canvas) return;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < shapes.length; i++) {
    shapes[i].update();
    shapes[i].draw(ctx);
  }

  rafId = requestAnimationFrame(animate);
};

/**
 * Start animation
 */
const start = () => {
  if (!isPaused) return;
  isPaused = false;
  rafId = requestAnimationFrame(animate);
};

/**
 * Pause animation
 */
const pause = () => {
  isPaused = true;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
};

/**
 * Handle messages from main thread
 */
self.onmessage = (e) => {
  const { type, data } = e.data;

  switch (type) {
    case "init":
      canvas = data.canvas;
      ctx = canvas.getContext("2d");
      dpr = data.dpr || 1;
      logicalWidth = data.width;
      logicalHeight = data.height;
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;
      initShapes();
      rafId = requestAnimationFrame(animate);
      break;

    case 'resize':
      dpr = data.dpr || 1;
      logicalWidth = data.width;
      logicalHeight = data.height;
      if (canvas) {
        canvas.width = logicalWidth * dpr;
        canvas.height = logicalHeight * dpr;
      }
      // Recreate Shape class with new dpr
      Shape = createShapeClass(dpr);
      shapes.forEach((shape) =>
        shape.updateCanvasSize(logicalWidth, logicalHeight)
      );
      break;

    case "pause":
      pause();
      break;

    case "resume":
      start();
      break;
  }
};
