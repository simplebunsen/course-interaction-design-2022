let isBlack = false;

let radius = 20;

let canvas;

function setup() {
  canvas = createCanvas(720, 720);
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
  } else if (keyCode === UP_ARROW) {
    radius = (radius + 75) % 1000;
    console.log(radius);
  } else if (keyCode === DOWN_ARROW) {
    radius = (radius - 75) % 1000;
    console.log(radius);
  } else if (keyCode === LEFT_ARROW) {
    console.log("jesus");
    resizeCanvas(1280, 720);
    console.log("resized to widescreen");
  } else if (keyCode === RIGHT_ARROW) {
    resizeCanvas(720, 720);
    console.log("resized to square");
  }

}

function mouseClicked() {
  saveCanvas(canvas, "screenie", "jpg")
}