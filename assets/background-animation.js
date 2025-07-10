const canvas = document.getElementById('background-canvas');

if (canvas instanceof HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');

  if (ctx) {
    let shapes = [];
    const shapeCount = 20; // Number of shapes

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Shape class
    class Shape {
      constructor(x, y, type, size) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = size;
        this.angle = Math.random() * Math.PI * 2;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        // Use monochrome colors with varying opacity
        this.color = `rgba(150, 150, 150, ${Math.random() * 0.5 + 0.1})`;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
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
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
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
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }
    }

    const init = () => {
      resizeCanvas();
      shapes = [];
      const types = ['triangle', 'rectangle', 'line'];
      for (let i = 0; i < shapeCount; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const size = Math.random() * 40 + 10;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        shapes.push(new Shape(x, y, type, size));
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);

    init();
    animate();
  }
}
