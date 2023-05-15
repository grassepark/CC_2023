//pendulum code: https://editor.p5js.org/vojtech.svob/sketches/vTEaAkgs

let font;
let wordArray = [];
let sample = 0.1;
let d, angle;
let angle1 = 0;
let angle2 = 0;
let scalar = 45;

function preload() {
  font = loadFont("NeutralFace.otf");
}

function setup() {
  createCanvas(600, 800);
  textFont(font);
  background(0);
  m=2
  l=2.705
  g=9.814
  dt=0.02
  t=0
  theta = 3.14/10; // Pendulum initial angle theta
  omega = 0; // Initial angular velocity
  C = 2; // Center point
}

function draw() {
  push()
  fill(0,10)
rect(-10,-10,700,900)
  pop()
  
  //pendulum effect- ewww mathhh
  
  push()
  translate(80,0)
  t = t + dt;
  F=-m*g*sin(theta)
  epsilon = (F/m)/l; //angular acceleration
  omega = omega + epsilon * dt;
  theta = theta + omega * dt;
  xp = C - l * sin(theta); // X coordinate
  yp = l * cos(theta); // Y coordinate
  ppm=110 //scale
  fill(0,50)
  line(C*ppm, 0, xp*ppm, yp*ppm);
  ellipse(xp*ppm, yp*ppm, 100);
  pop()

  
  let ang2 = radians(angle2);
  let x2 = width / 2 + scalar * cos(ang2);
  // ellipse(x2, 230, scalar, scalar);
  angle2 += 3;
  
  wordArray = font.textToPoints("DREAMY", width / 2 - 220, height / 2 + 50, 100, {
    sampleFactor: sample,
  });

  stroke(255,40);
  strokeWeight(2);
  noFill();

  d = 10 + sin(frameCount / 50) * 50;
  angle = frameCount / 100;
  if (mouseIsPressed === true) {
  d = dist(mouseX, mouseY, width/2, height/2)
  angle = atan2(mouseY-height/2, mouseX-width/2) 
  } else {
  d = 10 + sin(frameCount / 50) * 50;
  angle = frameCount / 100;
  }

  push();

  for (let i = 0; i < wordArray.length; i++) {
    const p = wordArray[i];
    push();
    translate(0,100)
    translate(p.x, p.y);
    rotate(angle);
    line(-d, -d, +d, +d);
    pop();
  }
  pop();
  

}

