//Experience this in fullscreen!
//concept: it feels like it's impossible to be happy when you work a professional job/become an adult!!
//so... if you are off camera for too long... sketch tells you to go back to work
//and if you're distracted and think of a happy thought, sketch also gets upset!

//uses clmtracker.js and its emotion tracking!

//TO DO:
//fix footer design

let capture;
let tracker;
let positions;

//timer 1
let savedTime;
let currentTime;
let mil;

//timer 2
let savedTime2;
let currentTime2;
let mil2;

//emotions
let fr = 15;
let ec = new emotionClassifier();
ec.init(emotionModel);
let emotionData = ec.getBlank();
let sadVal = 0;
let happyVal = 0;
let angry=1
let scaleVal

//alarms
let alarm1;
let alarm2;
let sampleIsLooping = false

let zoom1, zoom2, zoom3;

function preload() {
  zoom1 = loadImage("zoom1-01.png");
  zoom2 = loadImage("zoom2-01.png");
  zoom3 = loadImage("zoom3-01.png");
}

function setup() {
  //webcamera
  let mycanvas = createCanvas(windowWidth, windowHeight);
  mycanvas.parent("canvas");
  capture = createCapture(VIDEO);
  capture.elt.setAttribute("playsinline", "");
  capture.size(width, height);
  capture.hide();

  //tracker stuff
  tracker = new clm.tracker();
  tracker.init(pModel);
  tracker.start(capture.elt);

  //timer for tracker
  mil = millis();
  savedTime = mil;

  //timer for happiness
  mil2 = millis();
  savedTime2 = mil2;
  scaleVal=1

  soundFormats("mp3");
  alarm1 = createAudio("alarm1.mp3");
  alarm2 = createAudio("alarm2.mp3");
}

function draw() {
  background(0);
  push();
  //mirror the camera
  translate(capture.width, 0);
  scale(-1, 1);
  scale(0.5);
  translate(width, height / 2);
  image(capture, 0, 0, width, height);
  capture.loadPixels();
  positions = tracker.getCurrentPosition();
  noFill();
  stroke(255);
  noStroke();
  for (let i = 0; i < positions.length; i++) {
    fill(255);
    ellipse(positions[i][0], positions[i][1], 4, 4);
  }
  pop();

  push()
  scale(1)
  image(zoom3, 0, height/4);
  pop()
  
  push();
  // scale(0.5)
  // translate(width, height / 2);
  image(zoom1,width/2,height/4)
  pop();
  push()
  scale(angry)
  console.log(angry)
  translate(random(0,4),(random(0,4)))
  image(zoom2,width/2,height/4)
  pop()

  //emotions tracker
  let cp = tracker.getCurrentParameters();
  er = ec.meanPredict(cp);
  if (er) {
    for (let i = 3; i < er.length; i++) {
      // rect(width / 2, height / 2, 60, -er[3].value * 100);
    }

    // angryVal = er[0].value;
    // sadVal = er[1].value;
    // surprisedVal = er[2].value;
    happyVal = er[3].value;
    // disgustedVal = er[4].value;
    // fearVal = er[5].value;
    // console.log("sad:", sadVal,"happy:", happyVal);
  }

  //happiness value is between 0 and 1
  frameRate(fr);
  fr = map(happyVal, 0, 1, 10, 40);
  console.log("val", happyVal);

  //if you are offscreen for 10 seconds
  if (positions == false) {
    currentTime = millis() - savedTime;
    if (currentTime > 10000) {
      console.log("go back to work!");
      if (!sampleIsLooping) {
        alarm1.loop();
        sampleIsLooping = true;
      }
    }
  } else {
    savedTime = millis();
    alarm1.stop();
    sampleIsLooping = false;
  }

  //if you are happy for 5 seconds
  if (happyVal > 0.4) {
    currentTime2 = millis() - savedTime2;
    if (currentTime2 > 5000) {
      console.log("stop thinking happy thoughts, go back to work!");
      if (!sampleIsLooping) {
        alarm2.loop();
        sampleIsLooping = true;
      }
    }
  } else {
    savedTime2 = millis();
    alarm2.stop();
    sampleIsLooping = false;
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
