let distance = 0;

let customFont;

let cnv;


var dragging = false; // Is the slider being dragged?
var rollover = false; // Is the mouse over the slider?

// Circle variables for knob
var x;
var y;
var r;;

// Knob angle
var angle = 0.001;

var count = 0;

// Offset angle for turning knob
var offsetAngle = 0;


let progress;

function preload() {
  // load data here
  customFont = loadFont('font/Lobster-Regular.ttf');
}


function setup() {
  
  if(window.innerHeight > window.innerWidth) cnv = createCanvas(window.innerWidth, window.innerWidth);
  else cnv = createCanvas(window.innerHeight, window.innerHeight);

  textFont(customFont);
  textAlign(CENTER, CENTER);
  x = width/2;
  y = height/2  +height/3;
  r = width/10;
}

function windowResized() {  
  if(window.innerHeight > window.innerWidth) resizeCanvas(window.innerWidth, window.innerWidth);
  else resizeCanvas(window.innerHeight, window.innerHeight); 
  
  x = width/2;
  y = height/2 +height/3;  
  r = width/10;
}

function draw() {
  background(255);

  if (count === 0) {
		
    // Is it being dragged?
    if (dragging) {
      var dx = mouseX - x;
      var dy = mouseY - y;
      var mouseAngle = atan2(dy, dx);
      angle = mouseAngle - offsetAngle;
    }
  
    // Fill according to state
    if (dragging) {
      fill (175);
    } 
    else {
      fill(255);
    }
    // Draw ellipse for knob
    stroke(0);
    push();
    translate(x, y);
    rotate(angle);
    strokeWeight(4);
    ellipse(0, 0, r*2, r*2);
    strokeWeight(10);
    line(0, 0, r, 0);
    pop();
    fill(0);
  
  
    // Map is an amazing function that will map one range to another!
    // Here we take the slider's range and map it to a value between 0 and 255
    // Our angle is either between
    var calcAngle = 0; 
    if (angle < 0) {
      calcAngle = map(angle, -PI, 0, PI, 0);
    } 
    else if (angle > 0) {
      calcAngle = map(angle, 0, PI, TWO_PI, PI);
    }
    
    noStroke();
    textAlign(CENTER);
    
    textSize(width/10);
    text("Turn me", width/2, height/2 + height/ 8);
  
    var degree = int(degrees(calcAngle));
  
    if (dragging && degree < 10) {
      count == 2;
    }
    }
    if (count === 2) {
      var b = map(calcAngle, 0, TWO_PI, 0, 255);
      fill(b);
      rect(320, 90, 160, 180);
    }
    stroke(0);
    strokeWeight(10);
    for (let i = 0; i < 16; i++) {
        let myX = map(i, 0, 15, 0 + width/24, width - width/24);
        line(myX, height / 2, myX, 0 + height / 24);
    }

    progress = map(calcAngle, 0, 2 * PI, 0, width);
    noStroke();
    fill(255);
    rect(width - progress, 0, width, height/ 2 + height/24);
} 

function mouseWheel(event){
  distance += event.delta / 10;
  distance = constrain(distance, 0, width)
  print(distance);
}


function mousePressed() {
  // Did I click on slider?
  if (dist(mouseX, mouseY, x, y) < r) {
    dragging = true;
    // If so, keep track of relative location of click to corner of rectangle
    var dx = mouseX - x;
    var dy = mouseY - y;
    offsetAngle = atan2(dy, dx) - angle;
  }
}

function mouseReleased() {
  // Stop dragging
  dragging = false;
}