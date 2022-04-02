"use strict";
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//changeable properties
const lineAmountPer = 30;

const redX = 200;
const blueX = 600;

const lineOffset = 80;


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//all lines aray
let lines = [];

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//define helper functions
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

let customFont;
let dp;

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//preload suff

function preload() {
  customFont = loadFont('data/ChakraPetch/ChakraPetch-Regular.ttf');
}

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

function setup() {
  createCanvas(800, 800);

  textFont(customFont);

  let blueColors = [color("#30697E"), color("#258DA0"), color("#11B2BD"), color("#1ED8D2"), color("#4CFFDF"), color("#97B0AA")];
  let redColors = [color("#F64747"), color("#FF6C82"), color("#FF94BA"), color("#FFBDEE"), color("#BFA6A2"), color("#4E0000")];

  //red
  for (let i = 0; i < lineAmountPer; i++) {
    lines.push(new line(random(redX - lineOffset, redX + lineOffset), redColors[getRandomInt(0, redColors.length)]));
  }

  //blue
  for (let i = 0; i < lineAmountPer; i++) {
    lines.push(new line(random(blueX - lineOffset, blueX + lineOffset), blueColors[getRandomInt(0, blueColors.length)]));
  }


  
  dp = new dataPoint("red");
}

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

function draw() {
  // get seconds and milliseconds
  let milliseconds = int(millis() % 60000);
  let seconds = int(milliseconds / 1000) % 60000;
  let millisecondsPerSecond = milliseconds % 1000;
  let seconds_two_digits = String(seconds).padStart(2, "0");
  let milliseconds_three_digits = String(millisecondsPerSecond).padStart(3, "0");

  background(255);

  noFill();
  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    stroke(lines[lineNo].colour);
    strokeWeight(lines[lineNo].weight);
    beginShape();
    for (let i = 0; i < lines[lineNo].getCtrlPoints.length; i++) {
      curveVertex(lines[lineNo].getCtrlPoints[i].getCurPos, (i - 1) * 100);
    }
    endShape();
  }

  //gen second text
  noStroke();
  fill(color("#97B0AA"));
  textAlign(CENTER, CENTER);
  textSize(200);
  text("0", width / 2, 180);
  text(seconds_two_digits.split("")[0], width / 2, 380);
  text(seconds_two_digits.split("")[1], width / 2, 580);

  rectMode(CENTER);
  rect(width / 2, 310, 15, 15);

  //data points

  rect(dp.XLocation, dp.YLocation, 50, 50);
  dp.update();

}

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//Data Point Object
class dataPoint {
  constructor(kind) {
    this.kind = kind;

    switch (this.kind) {
      case "red":
        this.speed = 1;
        this.XLocation = this.rndX(redX); 
        this.YLocation = -20;
        break;
      case "blue":
        this.speed = -1;
        this.XLocation = this.rndX(blueX);
        this.YLocation = 820;
        break;
      default:
        console.error("wtf kinda data point you trying to create B");
        break;
    }
  }

  update() {
    this.YLocation += this.speed;
  }

  hasLeft(){
    let flag;
    switch (this.kind) {
      case "red":
        this.YLocation >= height + 20 ? flag = true : flag = false;
        break;
      case "blue":
        this.YLocation >= 0 - 20 ? flag = true : flag = false;
        break;
      default:
        console.error("dat color cant even leave bro");
        break;
    }
    return flag;
  }

  whichIcon(){
    switch (kind) {
      case "red":

        break;
      case "blue":

        break;
      default:
        console.error("wtf ya not getting an icon for that kinda shit");
        break;
    }
  }

  rndX(center) {
    return random(center - 20, center + 20);
  }
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//Line mit verschiedenen Punkten
class line {
  constructor(pos, colour) {
    this.ctrlPoints = [];
    this.colour = colour;
    this.weight = random(0.1, 1.5);
    for (let i = 0; i < 11; i++) {
      this.ctrlPoints[i] = new ctrlPoint(pos);
    }
  }

  get getCtrlPoints() {
    return this.ctrlPoints;
  }
}

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// Einzelner Punkt in einer Line
class ctrlPoint {
  constructor(center) {
    this.direction = Math.round(Math.random()) * 2 - 1;
    this.initialPos = this.rndX(center);
    this.curPos = this.initialPos;
    this.maxDiverge = 20;
    this.speed = random(0.1, 0.5);
  }

  rndX(center) {
    return random(center - 20, center + 20);
  }

  randomizeSpeed() {
    this.speed = clamp(this.speed + random(-0.1, 0.1), 0.1, 0.5);
  }

  update() {

    this.randomizeSpeed();

    let tempPos = this.curPos + this.speed * this.direction;

    if (this.direction > 0) {
      tempPos > this.initialPos + this.maxDiverge ?
        (this.direction = -this.direction) :
        (this.curPos = tempPos);
    } else {
      tempPos < this.initialPos - this.maxDiverge ?
        (this.direction = -this.direction) :
        (this.curPos = tempPos);
    }
  }

  get getCurPos() {
    this.update();
    return this.curPos;
  }
}
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>