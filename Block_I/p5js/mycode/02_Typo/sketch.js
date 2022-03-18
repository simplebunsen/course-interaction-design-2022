// globals
let customFont;
let seconds, milliseconds, millisecondsPerSecond;
let currentX = 0;
let currentString = "0";
let currentSecondRepresented = 0;

// preload
function preload() {
  // load data here
  customFont = loadFont('data/Amatic-SC/AmaticSC-Bold.ttf');
}

// setup
function setup() {

  // init canvas
  canvas = createCanvas(800, 800).parent('canvas');

  // init custom fonts
  textFont(customFont);

}

// draw
function draw() {



  // background
  background(0);

  // get seconds and milliseconds
  milliseconds = int(millis() % 60000);
  seconds = int(milliseconds / 1000) % 60000;
  millisecondsPerSecond = milliseconds % 1000;

  if(currentSecondRepresented >= 59){
    currentSecondRepresented = 0;
    currentString = "58, 59, 60";
  }


  //every sec, add new sec string onto string.
  if (seconds > currentSecondRepresented) {
    currentSecondRepresented = seconds;
    currentString = currentString + ", " + seconds;
  }


  //cursor
  if (millisecondsPerSecond >= 500) {

    stroke(255);
    fill(255);
    line(width/ 2 + 70, height / 2 - 100, width/ 2 + 70, height / 2 + 100);
  }

  // show seconds and milliseconds
  noStroke();
  fill(255);
  textAlign(RIGHT, CENTER);
  textSize(200);
  text(currentString, width / 2 + 50, height / 2 - 25);

  //process preceeding numberess
  let preceedingString = ", ";
  for (let i = 1; i <= 4; i++) {
    if(currentSecondRepresented >= 59) {
      preceedingString = ", 60, 1 , 2"
    }
    preceedingString = preceedingString + (currentSecondRepresented + i) + ", ";
  }

  fill(50);
  textAlign(LEFT, CENTER);
  text(preceedingString, width / 2 + 75, height / 2 - 25);


}