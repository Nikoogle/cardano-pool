// constants
const IS_MOBILE = isMobile();
const MAX_ALPHA = IS_MOBILE ? 100 : 180;
const MIN_ALPHA = 40;
const MAX_FRAME_RATE = 24;
// global variables
let NUMBER_OF_PARTICLES = calculateNumberOfParticles();
let PARTICLES = [];
let BACKGROUND_COLOR = [255, 255, 255];

function isMobile() {
  const { innerWidth, innerHeight } = window;
  return innerHeight > innerWidth ? true : false;
}

function density() {
  const { innerWidth, innerHeight } = window;
  return innerWidth * innerHeight;
}

function calculateNumberOfParticles() {
  return Math.floor(density() / 4000); 
}

// create particles
function generateParticle() {
  const size = random(0.2, 3);
  const color = generateParticleColor();
  const alpha = 0; // + random(-60, 120);
  const alphaShiftDirection = alpha > ((MAX_ALPHA + MIN_ALPHA) / 2) ? 1 : -1;
  const position = [random(0, windowWidth), random(0, windowHeight)];
  const angle = TWO_PI / random(5,13);
  
  return {
    x: position[0], 
    y: position[1], 
    alpha,
    alphaShiftDirection,
    size,
    color,
    angle,
  };
}

function populateParticles() {
  // reset
  PARTICLES = [];
  
  for(let i = 0; i < NUMBER_OF_PARTICLES; i++) {
    PARTICLES.push(generateParticle());
  }
}

// handle position updates
function jiggleParticles() {
  PARTICLES = PARTICLES.map(p => {
    return {
      ...p,
      x: p.x + random(-0.4, 0.4),
      y: p.y + random(-0.4, 0.4),
    }
  });
}

// handle particle color updates
function generateParticleColor() {
  const red = Math.round(random(200, 220));
  const green = Math.round(random(210, 250));
  const blue = Math.round(random(200, 255));
  
  const palette = [red, green, blue];
  const white = [250, 250, 250];
  const bright = [random(200, 250), random(20, 220), random(10, 20)];
  
  if (random(100) > 98) return white;
  if (random(100) > 90) return bright;
  return palette;
}

// handle background color updates
function generateCanvasColor() {
  const red = Math.round(random(0, 40));
  const green = Math.round(random(20, 75));
  const blue = Math.round(random(20, 100));
  
  return [0, 0, 0];
}

function shiftParticlesAlpha() {
  PARTICLES = PARTICLES.map((p) => {
    const { alpha, alphaShiftDirection } = p;
    let shiftValue = alphaShiftDirection * (IS_MOBILE ? random(2, 6) : random(3, 15));
    let newAlpha = alpha + shiftValue;
    let newShiftDirection = alphaShiftDirection;

    if (newAlpha >= MAX_ALPHA) {
      newShiftDirection = -1;  
    } else if (newAlpha <= MIN_ALPHA) {
      newShiftDirection = 1;
    }

    return {
      ...p,
      alpha: newAlpha,
      alphaShiftDirection: newShiftDirection,
    };
  });
}

// render particles on canvas
function drawParticles() {
  PARTICLES.map(p => {
    fill(p.color[0], p.color[1], p.color[2], p.alpha);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += p.angle) {
      let sx = p.x + cos(a) * p.size;
      let sy = p.y + sin(a) * p.size;
      vertex(sx, sy);
    }

    endShape(CLOSE);
  });
}

function backgroundHue() {
  const newColor = BACKGROUND_COLOR;

  BACKGROUND_COLOR = newColor;
  background(
    newColor[0],
    newColor[1],
    newColor[2],
    40
  );
}

function applyCanvasStyles(canvas) {
  canvas.style('display', 'block'); 
  canvas.style('position', 'absolute');
  canvas.style('top', '0');
  canvas.style('left', '0');
  // canvas.style('z-index', '-1');
  canvas.style('overflow', 'hidden');
}

function initBackgroundCanvas() {
  // create a full-screen canvas
  const mainCanvas = createCanvas(windowWidth, windowHeight);
  applyCanvasStyles(mainCanvas);

  stroke(0, 0, 0, 0);
  BACKGROUND_COLOR = generateCanvasColor();
  background(
    BACKGROUND_COLOR[0], 
    BACKGROUND_COLOR[1], 
    BACKGROUND_COLOR[2], 
    200
  );
}

function setup() {
  frameRate(MAX_FRAME_RATE);
  // create canvas
  initBackgroundCanvas();
  // add particles
  setTimeout(populateParticles, 1200);
}

function draw() {
  clear();
  drawParticles();
  jiggleParticles();
  shiftParticlesAlpha();
  backgroundHue();
}
// handle resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true);
  NUMBER_OF_PARTICLES = calculateNumberOfParticles();
  populateParticles();
}