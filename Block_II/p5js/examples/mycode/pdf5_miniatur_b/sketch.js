let x = 200;
let y = 200;

let upperLimit;
let lowerLimit;
let leftLimit;
let rightLimit;

let osc, playing, freq, amp, cnv;



//le wave
let xspacing = 16; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 0; // Height of wave
let period = 100.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave


function setup() {
  cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.mousePressed(playOscillator);
  cnv.touchStarted(playOscillator);
  osc = new p5.Oscillator('triangle');
  rectMode(CENTER);
  x = width / 2;
  y = height / 2;
  leftLimit = width/12;
  rightLimit = width - width/12;
  upperLimit = height/12;
  lowerLimit = height - height/12;


  w = width + 16;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  x = width / 2;
  y = height / 2;
  leftLimit = width/12;
  rightLimit = width - width/12;
  upperLimit = height/12;
  lowerLimit = height - height/12;


  w = width + 16;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));
}

function draw() {
  dx = (TWO_PI / period) * xspacing;
  background(255);
  stroke(0);
  triangle()
  line(leftLimit - width/24, upperLimit , leftLimit - width/24, lowerLimit + height / 24);
  line(leftLimit - width/24, lowerLimit + height/24, rightLimit + width/24, lowerLimit + height / 24);



  x = lerp(x, constrain(mouseX, leftLimit, rightLimit), 0.1);
  y = lerp(y, constrain(mouseY, upperLimit, lowerLimit), 0.1);

  freq = constrain(map(x, leftLimit, rightLimit, 100, 500), 100, 500);
  amp = constrain(map(y, lowerLimit, upperLimit, 0, 1), 0, 1);
  fill(0);
  if(playing){
    fill("gray");
  }
  rect(x,y, 20, 20);

  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
    amplitude = constrain(map(amp, 0, 1, 0, 75), 0, 75);
    period = 600 - freq;
    
    calcWave();
    renderWave();
  }
}

function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  osc.start();
  playing = true;
}

function mouseReleased() {
  // ramp amplitude to 0 over 0.5 seconds
  osc.amp(0, 0.5);
  playing = false;
}

function touchEnded() {
    // ramp amplitude to 0 over 0.5 seconds
    osc.amp(0, 0.5);
    playing = false;
}


function calcWave() {
  // Increment theta (try different values for
  // 'angular velocity' here)
  theta += 0.02;

  // For every x value, calculate a y value with sine function
  let x_w = theta;
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x_w) * amplitude;
    x_w += dx;
  }
}

function renderWave() {
  noStroke();
  fill(0);
  // A simple way to draw the wave with an ellipse at each location
  for (let x_f = 0; x_f < yvalues.length; x_f++) {
    ellipse(x_f * xspacing, height / 2 + yvalues[x_f], 16, 16);
  }
}
