console.info('JS Module loaded.');

import { Loop } from './Loop.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.insertAdjacentElement('beforeend', canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lerp = (A, B, t) => A + (B - A) * t;
const { random } = Math;

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  add(v2, scalar = 1) {
    this.x += v2.x * scalar;
    this.y += v2.y * scalar;
  }
  mult(scalar = 1) {
    this.x *= scalar;
    this.y *= scalar;
  }
}
class Particle {
  constructor(x, y, w, h) {
    this.pos = new Vector(x, y);
    this.size = new Vector(w, h);
    this.vel = new Vector((random() * 2 - 1) * 250, (random() * 2 - 1) * 190);
    this.acc = new Vector();
    this.opacity = 1;
  }
  update(dt) {
    this.vel.add(this.acc, dt);
    this.pos.add(this.vel, dt);
    this.acc.mult(0);
    this.opacity -= dt;
  }
  draw(ctx) {
    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--text");
    ctx.globalAlpha = this.opacity;
    ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
  applyForce(force) {
    this.acc.add(force);
  }
}

class Animation {
  constructor() {
    this.particles = new Set();
  }
  update(dt) {
    for (const particle of this.particles) {
      if (particle.opacity <= dt) {
        this.particles.delete(particle);
      }
      particle.update(dt);
    }
  }
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
  }
  add(position) {
    for (let i = 0; i < 50; i++) {
      this.particles.add(new Particle(position.x, position.y, 2, 2));
    }
  }
}

const loop = new Loop();
const animation = new Animation();
loop.add(animation);

const scale = window.devicePixelRatio;
const resize = () => {
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  ctx.scale(scale, scale);
};
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(document.documentElement);


document.body.addEventListener('click', (event) => {
  const mouse = new Vector(event.clientX, event.clientY);
  animation.add(mouse);
  umami.track('Click. Animation added to Button');
});
