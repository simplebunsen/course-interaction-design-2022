// https://p5js.org/examples/input-clock.html

let w = 800
let h = 800;
let seconds, milliseconds;

function setup() {
  createCanvas(w, h);
  angleMode(DEGREES);
}

function draw() {

  //background(255);

  //technical second calc stuff
  milliseconds = int(millis() % 60000);
  seconds = int(milliseconds / 1000);

  let s = map(seconds, 0, 60, 0, 360);
  let m = map(milliseconds, 0, 1000, 0, 360);

  let currentSize = w - ((w / 60) * seconds);
  let currentColor = map(currentSize, 0, w, 0, 255);



  colorMode(HSB);
  // seconds
  push();

  strokeWeight(2);
  stroke(currentColor, 255, 90);
  fill(currentColor, 255, 255);
  ellipseMode(CORNER);
  ellipse((w - currentSize) / 2, (h - currentSize) / 2, currentSize, currentSize);

  pop();


  // milliseconds
  push();

  translate(w / 2, h / 2);
  rotate(m - 90);
  stroke(currentColor, 255, 90);
  if (currentSize >= 0.1 * w) strokeWeight(25);
  else strokeWeight(10);
  strokeCap(ROUND);
  let lineLenght = currentSize / 2 - 20 >= 0 ? currentSize / 2 - 20 : 0;
  line(0, 0, lineLenght, 0);
  
  pop();
}