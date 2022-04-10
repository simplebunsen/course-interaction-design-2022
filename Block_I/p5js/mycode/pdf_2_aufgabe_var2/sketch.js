let w = 800
let h = 800;
let seconds, milliseconds;

let lecounter = 0;

function setup() {
  createCanvas(w, h);
  angleMode(DEGREES);
  background(255);
  rectMode(CENTER);
}

function draw() {

  //technical second calc stuff
  milliseconds = int(millis() % 60000);
  seconds = int(milliseconds / 1000);  
  millisecondsPerSecond = milliseconds % 1000;

  let seconds_two_digits = String(seconds).padStart(2, "0");
  let milliseconds_three_digits = String(millisecondsPerSecond).padStart(3, "0");

  if(millis() >= 60000) fill(128, 255, 128);
  else fill(242,242,242);
  rect(110,35,200,50,10);
  fill(0);
  textSize(40);
  textAlign(LEFT, CENTER);
  
  let curtime = "00:" + seconds_two_digits + "." + milliseconds_three_digits; 
  text(curtime, 20, 40);

  fill(255, 128, 255);
  noStroke();
  ellipse(mouseX, mouseY, 3);
  stroke(0);

}



function keyPressed(){
  fill(keyCode);
  let x = 75 + (lecounter % 14) * 50;
  let y = 150 + (int) (lecounter / 14) * 50;
  rect(x ,y, 40, 40, 10);
  if(keyCode > 150) fill(0);
  else fill(255);
  if(key.length > 1) textSize(10);
  else textSize(30);
  textAlign(CENTER, CENTER);
  text(key, x, y);
  lecounter += 1;
}