let myRec = new p5.SpeechRec();
let woof = new p5.Speech();
let greetings = ["hello", "hi"];
let sitting = ["sit", "butt down", "good dog", "fine","stop","shut up","sits"];
let getUp = ["get up","stand"]
let gun = ["bang", "die"];
let speaking = ["speak", "bark", "woof", "say something"];
let sadge = ["finals","parsons","school","it was really bad","Parsons","sad"]
let sadge2 = ["weak","pain","painful","throw up","throwing up","understand","i hate myself","drank","drunk"]
let alert = ["depressed", "bridge", "miserable", "hospitalized", "depression"]
let timer = 6;
let words = [];

myRec.continuous = true;
myRec.intrimResults = true;
let currentImage;

function preload() {
  sit = loadImage("doggie/sitting.GIF");
  idle = loadImage("doggie/idle.gif");
  bark = loadImage("doggie/barking.GIF");
  dead = loadImage("doggie/dead.GIF");
  listening = loadImage("doggie/listening.GIF");
  stronger = loadImage("doggie/stronger.GIF");
  angry = loadImage("doggie/angry.GIF");
  stand = loadImage("doggie/stand.PNG");
  concern = loadImage("doggie/concerned.PNG")
}

function setup() {
  createCanvas(600, 600);
  myRec.start();
  currentImage = idle;
}

function draw() {
  background(255);
  push();
  scale(0.3);
  image(currentImage, 0, 0);
  pop();

  let string = myRec.resultString;

  if (string) {
    console.log(string)

    words = string.split(" ");

    for (let i = 0; i < words.length; i++) {
      if (greetings.includes(words[i])) {
        aiGreetsBack();
        break;
      }
    if (sitting.includes(words[i])) {
        aiSits();
        break;
      }
    if (speaking.includes(words[i])) {
        aiBark();
        break;
      }
    if (gun.includes(words[i])) {
        aiDead();
        break;
      }
    if (sadge.includes(words[i])) {
        aiStrong();
        break;
      }
    if (sadge2.includes(words[i])) {
        aiSad();
        break;
      }
    if (alert.includes(words[i])) {
        aiSpeak();
        break;
      }
    if (getUp.includes(words[i])) {
        aiStand();
        break;
      }
      
    }

    if (frameCount % 60 == 0 && timer > 0) {
    timer--;
    }
  } else {
    textAlign(CENTER);
    textSize(20)
    text("the doggie is listening", 70, 550, 500, height);
    currentImage = listening;
    timer = 6;
  }
}

function aiGreetsBack() {
  currentImage = bark;
  woof.setVoice("Victoria");
  woof.speak("woof");
  if (timer < 5) {
    currentImage = idle;
    woof.stop();
  }
}

function aiSits() {
  currentImage = sit;
}

function aiStrong() {
  currentImage = stronger;
}

function aiDead() {
  currentImage = dead;
}

function aiStand() {
  currentImage = stand;
}

function aiSad() {
  currentImage = concern;
}

function aiBark() {
  currentImage = bark;
  //woof.listVoices();
  woof.setVoice("Victoria");
  woof.speak("bark");
  if (timer < 5) {
    currentImage = idle;
    woof.stop();
  }
}

function aiSpeak() {
  currentImage = angry;
  if (timer < 5) {
    currentImage = idle;
  }
}
