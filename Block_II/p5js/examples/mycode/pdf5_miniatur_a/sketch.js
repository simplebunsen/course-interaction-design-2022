let x = 200;
let y = 200;
let diameter = 200;
let dragging = false;

let returning = false;

let leftLimit;
let rightLimit;
let upperLimit;
let lowerLimit;
let startlerp = 0;

let confettiTimes = 0;

const resetTime = 250;

let customFont;

let cnv;

function preload() {
  // load data here
  customFont = loadFont('font/Lobster-Regular.ttf');
}


function setup() {
  if(window.innerHeight > window.innerWidth) createCanvas(window.innerWidth, window.innerWidth);
  else createCanvas(window.innerHeight, window.innerHeight);
  rectMode(CENTER);
  leftLimit = 120;
  rightLimit = width - 120;
  upperLimit = 100;
  lowerLimit = height - 200;
  if(lowerLimit <= upperLimit){
    lowerLimit += upperLimit - lowerLimit + 21;
  }
  x = width / 2;
  y = height / 2;
  
  textFont(customFont);
  textAlign(CENTER, CENTER);
  
}

function windowResized() {
  if(window.innerHeight > window.innerWidth) resizeCanvas(window.innerWidth, window.innerWidth);
  else resizeCanvas(window.innerHeight, window.innerHeight);
  leftLimit = 120;
  rightLimit = width - 120;
  upperLimit = 100;
  lowerLimit = height - 200;
  if(lowerLimit <= upperLimit){
    lowerLimit += upperLimit - lowerLimit + 15;
  }
  x = width / 2;
  y = height / 2;
}

function draw() {

  let t = frameCount / 60; // update time
  background(255);

  if (returning) {
    let frac = (millis() - startlerp) / resetTime;
    if (frac < 1) y = lerp(lowerLimit - 20, upperLimit, frac);
    else returning = false;
  }
  else {

    //if dragging is true
    //set x, y to mouseX, mouseY
    if (dragging) {
      x = lerp(x, constrain(mouseX, leftLimit, rightLimit), 0.1);
      y = lerp(y, constrain(mouseY, upperLimit, lowerLimit), 0.1);
    }

    if (y >= lowerLimit - 20) {
      returning = true;
      dragging = false;
      setTimeout(function obama() {
        dropConfetti();
        if (confettiTimes < 10) {
          setTimeout(obama, 200)
          confettiTimes++;
        } else {
          confettiTimes = 0;
        }
      }, 1)
      startlerp = millis();
    }

  }

  stroke(0);
  strokeWeight(5);
  dragging ? line(mouseX, 0, x, y - 25) : line(x, 0, x, y - 25);
  fill(0, 0, 0, 0);
  rect(x, y, 200, 50);

  
  fill(0);

  for (let flake of flakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }
  noStroke();
  textSize(width/8);
  text("drag me", width/2, height/2 + height/8);
} //end draw

/*when mouse is pressed, 
check if mouse is intersecting w/ circle */
function mousePressed() {
  //check if mouse is over the ellipse
  if (dist(x, y, mouseX, mouseY) < diameter / 2) {
    dragging = true;
  }
}

function mouseReleased() {
  dragging = false;
}

// <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
let flakes = []; // array to hold snowflake objects

function dropConfetti() {

  // create a random number of snowflakes each frame
  for (let i = 0; i < random(25); i++) {
    flakes.push(new Flake()); // append snowflake object
  }

  // loop through snowflakes with a for..of loop

}

// snowflake class
class Flake {

  constructor() {
    // initialize coordinates
    this.posX = 0;
    this.posY = random(-50, 0);
    this.initialangle = random(0, 2 * PI);
    this.size = random(4, 20);

    // radius of snowflake spiral
    // chosen so the snowflakes are uniformly spread out in area
    this.radius = sqrt(random(pow(width / 2, 2)));
    this.color = color(random(255));
  }

  update(time) {
    // x position follows a circle
    let w = 0.6; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete snowflake if past end of screen
    if (this.posY > height) {
      let index = flakes.indexOf(this);
      flakes.splice(index, 1);
    }
  };

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.posX, this.posY, this.size);
  };
}