/**
 * Shared configuration and drawing functions for background animation.
 * Used by both main thread (fallback) and Web Worker.
 */

export const CONFIG = {
  elementId: 'background-canvas',
  shapeCount: 20,
  shapeTypes: ['triangle', 'rectangle', 'line', 'star'],
  rareShapes: ['personalSign'], // ~5% chance
  sizeRange: { min: 10, max: 50 },
  velocityRange: 0.5,
  rotationRange: 0.01,
  opacityRange: { min: 0.1, max: 0.6 },
  color: 150,
};

/**
 * Draw functions for each shape type.
 * All functions receive (ctx, size, lineWidth) where size is already scaled by dpr.
 */
export const drawShapeFunctions = {
  triangle(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s, s);
    ctx.lineTo(-s, s);
    ctx.closePath();
    ctx.stroke();
  },

  rectangle(ctx, s) {
    ctx.strokeRect(-s / 2, -s / 2, s, s);
  },

  line(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s, 0);
    ctx.lineTo(s, 0);
    ctx.stroke();
  },

  star(ctx, s) {
    const spikes = 5;
    const outerRadius = s;
    const innerRadius = s * 0.4;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  },

  personalSign(ctx, size, lw) {
    const s = size / 2;

    // 1. Draw all shapes
    ctx.strokeRect(-s * 0.3, -s, s * 0.6, s * 1.6);

    ctx.beginPath();
    ctx.arc(0, s * 0.7, s * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-s * 0.3, -s * 1.2, s * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(s * 0.3, -s * 1.2, s * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Erase intersections using destination-out composite
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'white';

    // Erase rect lines inside bottom circle
    ctx.beginPath();
    ctx.arc(0, s * 0.7, s * 0.3 - lw, 0, Math.PI * 2);
    ctx.fill();

    // Erase circle lines inside rectangle area
    ctx.fillRect(-s * 0.3 + lw, -s + lw, s * 0.6 - lw * 2, s * 1.6 - lw * 2);

    // Erase rect lines inside top circles
    ctx.beginPath();
    ctx.arc(-s * 0.3, -s * 1.2, s * 0.5 - lw, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(s * 0.3, -s * 1.2, s * 0.5 - lw, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
  },
};

/**
 * Pick a random shape type (5% chance for rare shapes)
 */
export const pickRandomShapeType = () => {
  const { shapeTypes, rareShapes } = CONFIG;
  const isRare = Math.random() < 0.05;
  const pool = isRare ? rareShapes : shapeTypes;
  return pool[(Math.random() * pool.length) | 0];
};

/**
 * Generate random size within configured range
 */
export const randomSize = () => {
  const { min, max } = CONFIG.sizeRange;
  return Math.random() * (max - min) + min;
};

/**
 * Generate shape color with random opacity
 */
export const generateShapeColor = () => {
  const { min, max } = CONFIG.opacityRange;
  const opacity = Math.random() * (max - min) + min;
  const c = CONFIG.color;
  return `rgba(${c}, ${c}, ${c}, ${opacity})`;
};

/**
 * Create Shape class factory.
 * @param {number} dpr - Device pixel ratio (1 for fallback, actual dpr for worker)
 */
export const createShapeClass = (dpr = 1) => {
  return class Shape {
    constructor(x, y, type, size, canvasWidth, canvasHeight) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.size = size;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.angle = Math.random() * Math.PI * 2;
      this.vx = (Math.random() - 0.5) * CONFIG.velocityRange;
      this.vy = (Math.random() - 0.5) * CONFIG.velocityRange;
      this.rotationSpeed = (Math.random() - 0.5) * CONFIG.rotationRange;
      this.color = generateShapeColor();
      this._drawFn = drawShapeFunctions[type];
    }

    draw(ctx) {
      const cos = Math.cos(this.angle);
      const sin = Math.sin(this.angle);
      ctx.setTransform(cos, sin, -sin, cos, this.x * dpr, this.y * dpr);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = dpr;
      this._drawFn(ctx, this.size * dpr, dpr);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.rotationSpeed;

      // Screen wrap
      const margin = this.size;
      if (this.x < -margin) this.x = this.canvasWidth + margin;
      if (this.x > this.canvasWidth + margin) this.x = -margin;
      if (this.y < -margin) this.y = this.canvasHeight + margin;
      if (this.y > this.canvasHeight + margin) this.y = -margin;
    }

    updateCanvasSize(width, height) {
      this.canvasWidth = width;
      this.canvasHeight = height;
    }
  };
};

/**
 * Create a random shape instance
 * @param {typeof Shape} ShapeClass - Shape class to instantiate
 * @param {number} canvasWidth - Logical canvas width
 * @param {number} canvasHeight - Logical canvas height
 */
export const createRandomShape = (ShapeClass, canvasWidth, canvasHeight) => {
  const type = pickRandomShapeType();
  const size = randomSize();
  const x = Math.random() * canvasWidth;
  const y = Math.random() * canvasHeight;
  return new ShapeClass(x, y, type, size, canvasWidth, canvasHeight);
};
