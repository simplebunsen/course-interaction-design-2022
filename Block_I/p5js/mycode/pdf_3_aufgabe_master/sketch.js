let offsetsLeft = [];

let lines = [];

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i < 20; i++) {
    lines[i] = new line(random(120,280));
  }
}

function draw() {
  background(200, 200, 200);

  noFill();

  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    beginShape();

    for (let i = 0; i < lines[lineNo].getCtrlPoints.length; i++) {
      curveVertex(lines[lineNo].getCtrlPoints[i].getCurPos, (i - 1) * 100);
    }

    endShape();
  }
}

function getRndChange() {
  return random(-2.0, 2.0);
}


//Line mit verschiedenen Punkten
class line {
  constructor(pos){
    this.ctrlPoints = [];
    for(let i = 0; i < 11; i++){
      this.ctrlPoints[i] = new ctrlPoint(pos);
    }
  }

  get getCtrlPoints(){
    return this.ctrlPoints;
  }
  
}


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
