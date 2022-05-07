let isBlack = false;

let radius = 20;

let canvas;

function setup() {
  canvas = createCanvas(800, 800);
  noCursor();
}


function draw() {
  noStroke();
  if (isBlack) {
    background(0);
    fill(255);
  } else {
    background(255);
    fill(0);
  }

  circle(mouseX, mouseY, radius);
}

function keyPressed() {
  if (key === "b") {
    console.log("toggled bg");
    isBlack = !isBlack;
  } else if (keyCode === UP_ARROW){
    radius = (radius + 75) % 1000;
    console.log(radius);
  }
  else if (keyCode === DOWN_ARROW){
    radius = (radius - 75) % 1000;
    console.log(radius);
  }

}

function mouseClicked(){
  saveCanvas(canvas, "screenie", "jpg")
}