let font;
let wordArray = [];
let r,g,b;
let s=100;

function preload() {
  font = loadFont("NeutralFace.otf");
}

function setup() {
  createCanvas(600, 600);
   background(0);
}

function draw() {
 push()
  fill(0,0,0,20)
rect(-10,-10,700,900)
  pop()

  wordArray = font.textToPoints(
    "GLITCHY",
    width / 2 -(2*s)-20,
    height / 2 + 30,
    s,
    {
      sampleFactor: 0.2,
    }
  );

  r = random(200,255);
  g = random(200,255);
  b = random(200,255); 
  
  stroke(r,g,b,90);
  strokeWeight(3);
  noFill();

  // for (let i = 0; i < wordArray.length; i++) {
  //   ellipse(wordArray[i].x, wordArray[i].y,1,1);

  for (let i = 0; i < wordArray.length; i++) {
    ellipse(
      wordArray[i].x + random(-1, 7),
      wordArray[i].y - random(-0.1, 0.11),
      random(10, -10),
      random(-1, 1)
    );
  }
  
   
    if (mouseIsPressed === true) {
        s = random(100,120); 
    } else {
      s = 80
    }

  
  
  
  
}
