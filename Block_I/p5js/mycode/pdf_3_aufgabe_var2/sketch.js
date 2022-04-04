"use strict";

let intervalDie = window.setInterval(spawnDeath, 555);
let intervalBorn = window.setInterval(spawnLife, 232);
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//changeable properties
const lineAmountPer = 30;

const redX = 200;
const blueX = 600;

const lineOffset = 80;


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//all lines aray
let lines = [];

//all dp array
let dps = [];

//counters
let deathCounter = 0;
let bornCounter = 0;

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//define helper functions
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

let customFont;


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//define listener functions

function spawnDeath(){
  console.log("spawned red death");
  dps.push(new dataPoint("red"));
  deathCounter++;
}

function spawnLife(){
  console.log("spawned blue alive");
  dps.push(new dataPoint("blue"));
  bornCounter++;
}

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
    lines.push(new ctrlLine(random(redX - lineOffset, redX + lineOffset), redColors[getRandomInt(0, redColors.length)]));
  }

  //blue
  for (let i = 0; i < lineAmountPer; i++) {
    lines.push(new ctrlLine(random(blueX - lineOffset, blueX + lineOffset), blueColors[getRandomInt(0, blueColors.length)]));
  }

}

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

function draw() {  
  rotate(1/2 * PI);
  translate(0, -width);
    // get seconds and milliseconds
  let milliseconds = int(millis() % 60000);
  let seconds = int(milliseconds / 1000) % 60000;
  let seconds_two_digits = String(seconds).padStart(2, "0");

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
  dps.forEach(dp => {
    push();
    translate(dp.XLocation,dp.YLocation);
    scale(0.5);
    fill(dp.mainCol);
    circle(0,0,80,80);
    stroke(dp.secCol);
    dp.whichIcon().drawItem();    
    pop();
    dp.update();

  });

  //Counters
  fill(color("#4E0000"));
  circle(50,height, 415,415);
  fill(color("#30697E"));  
  circle(width - 50, 0, 415, 415);  
  fill(color("#97B0AA"));
  circle(50,height, 400,400);
  circle(width - 50, 0, 400, 400);
  noStroke();
  fill(color("#F64747"));
  textAlign(CENTER, CENTER);
  textSize(140);
  text(deathCounter, 100, height - 100);
  fill(color("#1ED8D2"));
  text(bornCounter, width - 100, 70);

}

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//Data Point Object
class dataPoint {
  constructor(kind) {
    this.kind = kind;

    switch (this.kind) {
      case "red":
        this.speed = 100;
        this.XLocation = null;
        this.XLocation = this.rndX(redX);
        this.YLocation = -20;
        this.mainCol = color("#F64747");
        this.secCol = color("#4E0000")
        break;
      case "blue":
        this.speed = -100;
        this.XLocation = null;
        this.XLocation = this.rndX(blueX);
        this.YLocation = 820;
        this.mainCol = color("#1ED8D2");
        this.secCol = color("#30697E")
        break;
      default:
        console.error("wtf kinda data point you trying to create B");
        break;
    }
  }

  update() {
    this.setLocs();
    //Speed per Second!
    this.YLocation += this.speed * deltaTime / 1000;
  }

  setLocs() {
    if(this.XLocation === null) {
      switch (this.kind) {
        case "red":
          this.XLocation = this.rndX(redX);
          break;
        case "blue":
          this.XLocation = this.rndX(blueX);
          break;
        default:
          console.error("I forgor");
          break;
      }
    }
  }

  hasLeft() {
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

  whichIcon() {
    switch (this.kind) {
      case "red":
        return new Skull();
      case "blue":
        return new Baby();
      default:
        console.error("wtf ya not getting an icon for that kinda shit");
        break;
    }
  }

  rndX(center) {
    return random(center - 100, center + 100);
  }
}

class Skull {
  drawItem() {
    strokeWeight(5);
    strokeCap(SQUARE);
    //SkullSHape
    beginShape();
    vertex(-25, -15);
    vertex(-15, -25);
    vertex(15, -25);
    vertex(25, -15);
    vertex(25, 5);
    vertex(15, 15);
    vertex(15, 25);
    vertex(-15, 25);
    vertex(-15, 15);
    vertex(-25, 5);
    endShape(CLOSE);
    //skullLines
    strokeWeight(5);
    line(-7, 5, -7, 20);
    line(0, 5, 0, 20);
    line(7, 5, 7, 20);
    //Skulleyes
    strokeWeight(4);
    beginShape();
    vertex(-15,-12);
    vertex(-5,-9);
    vertex(-5,-3);
    vertex(-15,-3);
    endShape(CLOSE);
      beginShape();
    vertex(15,-12);
    vertex(5,-9);
    vertex(5,-3);
    vertex(15,-3);
    endShape(CLOSE); 
  }
}

class Baby {
  drawItem() {
    //babby
    //Head
    strokeWeight(5);
    beginShape();
    vertex(-25, -15);
    vertex(-15, -25);
    vertex(15, -25);
    vertex(25, -15);
    vertex(25, -5);
    vertex(30, 0);
    vertex(30, 2);
    vertex(30, 5);
    vertex(25, 10);
    vertex(25, 15);
    vertex(15, 25);
    vertex(-15, 25);
    vertex(-25, 15);
    vertex(-25, 10);
    vertex(-30, 5);
    vertex(-30, 2);
    vertex(-30, 0);
    vertex(-25, -5);
    endShape(CLOSE);
    //lips
    beginShape();
    curveVertex(-15, 10);
    curveVertex(-15, 10);
    curveVertex(0, 15);
    curveVertex(15, 10);
    curveVertex(15, 10);
    endShape();
    //eyes
    strokeWeight(7);
    point(-10, -5);
    point(10, -5);
  }
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//Line mit verschiedenen Punkten
class ctrlLine {
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