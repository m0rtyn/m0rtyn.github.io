/**
 * Background Animation
 * Delegates rendering to a Web Worker with OffscreenCanvas.
 * Falls back to main thread if OffscreenCanvas is not supported.
 */

import {
  CONFIG,
  createShapeClass,
  createRandomShape,
  resolveAllCollisions,
} from './background-shared.js';

/**
 * Check if OffscreenCanvas is supported
 */
const supportsOffscreenCanvas = () => {
  try {
    return (
      'OffscreenCanvas' in self &&
      'transferControlToOffscreen' in HTMLCanvasElement.prototype
    );
  } catch {
    return false;
  }
};

/**
 * Initialize with OffscreenCanvas + Web Worker
 */
const initWithWorker = (canvas) => {
  const offscreen = canvas.transferControlToOffscreen();
  const worker = new Worker(
    new URL('./background-worker.js', import.meta.url),
    { type: 'module' }
  );

  worker.postMessage(
    {
      type: 'init',
      data: {
        canvas: offscreen,
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
      },
    },
    [offscreen]
  );

  window.addEventListener('resize', () => {
    worker.postMessage({
      type: 'resize',
      data: {
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
      },
    });
  });

  document.addEventListener('visibilitychange', () => {
    worker.postMessage({ type: document.hidden ? 'pause' : 'resume' });
  });
};

/**
 * Fallback: main thread rendering (for browsers without OffscreenCanvas)
 */
const initFallback = (canvas) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const Shape = createShapeClass(1); // dpr = 1 for fallback
  let shapes = [];
  let rafId = null;
  let isPaused = false;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    shapes.forEach((shape) =>
      shape.updateCanvasSize(canvas.width, canvas.height)
    );
  };

  const initShapes = () => {
    resizeCanvas();
    shapes = [];
    for (let i = 0; i < CONFIG.shapeCount; i++) {
      shapes.push(createRandomShape(Shape, canvas.width, canvas.height));
    }
  };

  const animate = () => {
    if (isPaused) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update positions
    for (let i = 0; i < shapes.length; i++) {
      shapes[i].update();
    }
    
    // Check and resolve collisions
    resolveAllCollisions(shapes);
    
    // Draw shapes
    for (let i = 0; i < shapes.length; i++) {
      shapes[i].draw(ctx);
    }
    
    rafId = requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isPaused = true;
      if (rafId) cancelAnimationFrame(rafId);
    } else {
      isPaused = false;
      rafId = requestAnimationFrame(animate);
    }
  });

  initShapes();
  rafId = requestAnimationFrame(animate);
};

/**
 * Initialize background animation
 */
const initBackgroundAnimation = () => {
  const canvas = document.getElementById(CONFIG.elementId);
  if (!(canvas instanceof HTMLCanvasElement)) return;

  if (supportsOffscreenCanvas()) {
    initWithWorker(canvas);
  } else {
    initFallback(canvas);
  }
};

initBackgroundAnimation();
