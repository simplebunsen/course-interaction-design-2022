"use strict";
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//changeable properties
  const lineAmountPer = 30;



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

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

function setup() {
  createCanvas(800, 800);

  let blueColors = [color("#30697E"), color("#258DA0"), color("#11B2BD"), color("#1ED8D2"), color("#4CFFDF"), color("#97B0AA")];
  let redColors = [color("#F64747"), color("#FF6C82"), color("#FF94BA"), color("#FFBDEE"), color("#BFA6A2"), color("#4E0000")];

  //red
  for (let i = 0; i < lineAmountPer; i++) {
    lines.push(new line(random(120,280), redColors[getRandomInt(0, redColors.length)]));
  }

  //blue
  for (let i = 0; i < lineAmountPer; i++) {
    lines.push(new line(random(520,680), blueColors[getRandomInt(0, blueColors.length)]));
  }
}

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

function draw() {
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
}

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//Line mit verschiedenen Punkten
class line {
  constructor(pos, colour){
    this.ctrlPoints = [];
    this.colour = colour;
    this.weight = random(0.1,1.5);
    for(let i = 0; i < 11; i++){
      this.ctrlPoints[i] = new ctrlPoint(pos);
    }
  }

  get getCtrlPoints(){
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
      tempPos > this.initialPos + this.maxDiverge
        ? (this.direction = -this.direction)
        : (this.curPos = tempPos);
    } else {
      tempPos < this.initialPos - this.maxDiverge
        ? (this.direction = -this.direction)
        : (this.curPos = tempPos);
    }
  }

  get getCurPos() {
    this.update();
    return this.curPos;
  }
}
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>