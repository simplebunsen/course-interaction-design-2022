let mic;
let vh, vw;

let hasTouched = false;

function setup() {
  w = window.innerWidth;
  h = window.innerHeight;
  createCanvas(w, h, WEBGL);
  vw = w / 1000;
  vh = h / 1000;
}

let modell;

function preload() {
  modell = loadModel('model.obj');
  customFont = loadFont('font/Lobster-Regular.ttf');

}

function draw() {
  background(0);

  textFont(customFont);
  textAlign(CENTER, CENTER);
  textSize(100 * vw);


  if (!hasTouched) {
    push();
    translate(-width / 2, -height / 2);
    fill("red");
    text("Touch Screen!", width / 2, 80 * vw);

    pop();
  } else {


    push();
    translate(-width / 2, -height / 2);

    fill(255);
    text("Head Banger", width / 2, 80 * vw);
    pop();

    // Get the overall volume (between 0 and 1.0)
    let vol = mic.getLevel();

    ambientLight(100);
    directionalLight(255, 255, 255, 0, 0, 1);

    stroke(255);
    strokeWeight(100);
    line(-width, height / 3, width, height / 3);

    push();
    noStroke();
    specularMaterial(255);
    translate(0, vh * 600, 0);
    rotateX(PI);
    rotateY(PI);
    rotateX(map(vol, 0, 1, 0, PI));
    fill(150);
    scale(vh * 1500);
    model(modell);
    pop();

  }

}


function windowResized() {
  // assigns new values for width and height variables
  w = window.innerWidth;
  h = window.innerHeight;
  resizeCanvas(w, h);
  vw = w / 1000;
  vh = h / 1000;
}

function startMic() {
  if (true) {
    // Create an Audio input
    mic = new p5.AudioIn();

    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    mic.start();
    hasTouched = true;
  }
}

function touchStarted() {
  startMic();
}
function mousePressed() {
  startMic();
}