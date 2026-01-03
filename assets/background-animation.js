/**
 * Background Animation
 * Renders floating geometric shapes on a canvas element.
 * Shapes: triangles, rectangles, lines with random positions and velocities.
 */

const CANVAS_CONFIG = {
  elementId: 'background-canvas',
  shapeCount: 20,
  shapeTypes: ['triangle', 'rectangle', 'line'],
  sizeRange: { min: 10, max: 50 },
  velocityRange: 0.5,
  rotationRange: 0.01,
  opacityRange: { min: 0.1, max: 0.6 },
  color: 150, // grayscale value (0-255)
};

/**
 * Shape class for geometric elements
 */
class Shape {
  /**
   * @param {number} x
   * @param {number} y
   * @param {string} type
   * @param {number} size
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   */
  constructor(x, y, type, size, canvasWidth, canvasHeight) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.angle = Math.random() * Math.PI * 2;
    this.vx = (Math.random() - 0.5) * CANVAS_CONFIG.velocityRange;
    this.vy = (Math.random() - 0.5) * CANVAS_CONFIG.velocityRange;
    this.rotationSpeed = (Math.random() - 0.5) * CANVAS_CONFIG.rotationRange;

    const { min, max } = CANVAS_CONFIG.opacityRange;
    const opacity = Math.random() * (max - min) + min;
    const c = CANVAS_CONFIG.color;
    this.color = `rgba(${c}, ${c}, ${c}, ${opacity})`;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;

    switch (this.type) {
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();
        ctx.stroke();
        break;

      case 'rectangle':
        ctx.strokeRect(
          -this.size / 2,
          -this.size / 2,
          this.size,
          this.size
        );
        break;

      case 'line':
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(this.size, 0);
        ctx.stroke();
        break;
    }

    ctx.restore();
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

  /**
   * @param {number} width
   * @param {number} height
   */
  updateCanvasSize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
}

/**
 * Creates a random shape
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @returns {Shape}
 */
const createRandomShape = (canvasWidth, canvasHeight) => {
  const { shapeTypes, sizeRange } = CANVAS_CONFIG;
  const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
  const size = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min;
  const x = Math.random() * canvasWidth;
  const y = Math.random() * canvasHeight;
  return new Shape(x, y, type, size, canvasWidth, canvasHeight);
};

/**
 * Initializes and runs the background animation
 */
const initBackgroundAnimation = () => {
  const canvas = document.getElementById(CANVAS_CONFIG.elementId);
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  /** @type {Shape[]} */
  let shapes = [];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    shapes.forEach((shape) => shape.updateCanvasSize(canvas.width, canvas.height));
  };

  const initShapes = () => {
    resizeCanvas();
    shapes = Array.from(
      { length: CANVAS_CONFIG.shapeCount },
      () => createRandomShape(canvas.width, canvas.height)
    );
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => {
      shape.update();
      shape.draw(ctx);
    });
    requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resizeCanvas);

  initShapes();
  animate();
};

initBackgroundAnimation();
