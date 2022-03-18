let w = 800
let h = 800;

let seconds, milliseconds;

let currentCol;

let dotArray = [];
let oldDots = [];

class Dot {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
  }
}


let curColor, color1, color2, color1Dark, color2Dark;
let clrToggle, dontChange;

function setup() {

  createCanvas(w, h);
  angleMode(DEGREES);

  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 10; x++) {
      dotArray.push(new Dot(x * w / 10, y * h / 6, currentCol));
    }
  }

  color1 = color(77, 27, 0);
  color1Dark = color(97, 34, 0);

  color2 = color(255, 231, 176);
  color2Dark = color(247, 227, 181);

  curColor = color1;
  curColorDark = color1Dark;

  clrToggle = false;
  dontChange = true;


}

let revisions = 0;
let regognizedRevisions = 0;

function draw() {

  background(100);

  milliseconds = int(millis() % 60000);
  seconds = milliseconds / 1000;

  if(seconds >= 2 && seconds <= 4) dontChange = false;

  if(revisions >= 1){
    for (let i = 0; i < dotArray.length; i++) {
      fill(curColor == color1 ? color2 : color1);
      rect(dotArray[i].x, dotArray[i].y, w / 10, h / 6);
      fill(curColorDark == color1Dark ? color2Dark : color1Dark);
      rect(dotArray[i].x + 10, dotArray[i].y + 15, w / 10 - 20, h / 6 - 30);
    }
  }

  for (let i = 0; i < seconds; i++) {
    fill(curColor);
    rect(dotArray[i].x, dotArray[i].y, w / 10, h / 6);
    fill(curColorDark);
    rect(dotArray[i].x + 10, dotArray[i].y + 15, w / 10 - 20, h / 6 - 30);
    // fill(255);
    // textAlign(CENTER, CENTER);
    // textSize(20);
    // text(i, dotArray[i].x + w/20, dotArray[i].y + h / 12);
  }


  //this code is so shitty I'm literally crying
  if(seconds <= 1 && clrToggle == false && !dontChange){
    console.log("changing to white color");
    curColor = color2;
    curColorDark = color2Dark;
    clrToggle = true;
    dontChange= true;
  }
  else if(seconds <= 1 && clrToggle == true && !dontChange){
    console.log("changing to white color");
    curColor = color1;
    curColorDark = color1Dark;
    clrToggle = false;
    dontChange = true;
  }

  if(seconds >= 59 && regognizedRevisions <= revisions){
    regognizedRevisions++;
  }

  if(seconds <= 1 && regognizedRevisions > revisions){
    revisions++;
  }


}