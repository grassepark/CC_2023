//inspired code: https://github.com/ayox/Steering-p5js/blob/master/vehicle.js

let font;
let particle;
let particles = [];
let wordArray = [];

function preload() {
  font = loadFont("NeutralFace.otf");
}

function setup() {
  createCanvas(600, 600);

  textFont(font);

  wordArray = font.textToPoints("ALLURE", 130, 550, 400, {
    sampleFactor: 0.1,
  });

  wordArray.forEach(function (_point) {
    particle = new Particle(_point.x, _point.y);
    particles.push(particle);
  });
}
function draw() {
  push();
  fill(0, 0, 0, 40);
  rect(-10, -10, 700, 700);
  pop();
  scale(0.3);
  translate(70, 590);

  particles.forEach(function (_particle) {
    _particle.update();
    _particle.behaviors();
    _particle.render();
  });
  frameRate(50);
}

// create boid
function Particle(x, y) {
  this.pos = createVector(random(width), random(height));
  this.acceleration = createVector();
  this.velocity = p5.Vector.random2D();
  this.position = createVector(x, y);
  this.r = 8;
  this.maxSpeed = 20;
  this.maxForce = 0.3;
  this.wave = random(5);
  this.rate = random(0.05, 0.01);
}

// update velocity, limit speed, and reset acceleration
Particle.prototype.update = function () {
  this.pos.add(this.velocity);
  this.velocity.add(this.acceleration);
  this.acceleration.mult(0);
};

// create the particles
Particle.prototype.render = function () {

  this.wave += this.rate; /// flashing speed
  let flash = abs(sin(this.wave) * 255);

  let falpha = map(flash, 0, 255, 50, 155); 
  push()
  stroke(flash * 0.5, flash * 0.5 - 20, 0, falpha);
  strokeWeight(30);
  point(this.pos.x, this.pos.y);
  pop()
  
  push()
  stroke(255, 255, 225);
  strokeWeight(11);
  point(this.pos.x, this.pos.y);
  pop()
};

Particle.prototype.behaviors = function () {
  let arrive = this.arrive(this.position);
  let mouse = createVector(mouseX, mouseY);
  let chase = this.chase(mouse);
  chase.mult(10);
  arrive.mult(2);
  this.applyForce(arrive);
  this.applyForce(chase);
};
Particle.prototype.applyForce = function (_force) {
  this.acceleration.add(_force);
};

Particle.prototype.flee = function (_position) {
  let desired = p5.Vector.sub(_position, this.pos);
  if (desired.mag() < 50) {
    desired.setMag(this.maxSpeed);
    desired.mult(-1);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};


Particle.prototype.chase = function (_position) {
  let desired = p5.Vector.sub(this.pos, _position);
  if (desired.mag() < 100) {
    desired.setMag(this.maxSpeed);
    desired.mult(-1);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

//when far from other vectors speed is faster
Particle.prototype.arrive = function (_position) {
  let desired = p5.Vector.sub(_position, this.pos);
  let distance = desired.mag();
  let speed = this.maxSpeed;
  if (distance < 100) {
    speed = map(distance, 0, 100, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let arrive = p5.Vector.sub(desired, this.velocity);
  arrive.limit(this.maxForce);
  return arrive;
};

// if in position stop moving
Particle.prototype.isInPosition = function () {
  let desired = p5.Vector.sub(this.position, this.pos);
  let distance = desired.mag();
  return distance < 1;
};
