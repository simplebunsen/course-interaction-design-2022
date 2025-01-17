let canvas;

let showWarning = false;

setTimeout(function() {showWarning = true;}, 60000);


let sketch = function (p) {
  var scalingW;
  var scalingH;
  var curHandSizes = [0, 0];
  var processedHandSizes = [40, 40];

  var trombone;
  var nextTrombone = 0;
  var tromboneCurHand = 0;

  var snare;
  var nextSnare = 0;
  var snareCurHand = 1;

  var handImg;
  var drumsImg;
  var tromboneImg;

  var depthImg;

  var leftLine = {};
  var rightLine = {};



  p.preload = function () {
    console.log("preloading");

    // Sound recording by Mirko Horstmann via freesound.org
    // https://freesound.org/people/m1rk0/sounds/50070/
  }

  p.setup = function () {
    snare = p.loadSound('metronome_clack.wav');
    trombone = p.loadSound('trombone.wav');

    handImg = p.loadImage("hand.png");
    drumsImg = p.loadImage("drums.png");
    tromboneImg = p.loadImage("trombone.png");
    depthImg = p.loadImage("depth.png");
    canvas = p.createCanvas(innerWidth, innerHeight);
    scalingW = p.width / 1000;
    scalingH = p.height/ 1000;
    canvas.id("canvas");

    p.colorMode(p.HSB);
    p.imageMode(p.CENTER);

    leftLine = {
      x1: 200 * scalingW,
      y1: p.height - 120 * scalingH,
      x2: 400 * scalingW,
      y2: 500 * scalingH,
    }
    rightLine = {
      x1: p.width - 200 * scalingW,
      y1: p.height - 120 * scalingH,
      x2: p.width - 400 * scalingW,
      y2: 500 * scalingH,
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(innerWidth, innerHeight);
    scalingW = p.width / 1000;

    leftLine = {
      x1: 200 * scalingW,
      y1: p.height - 120 * scalingH,
      x2: 400 * scalingW,
      y2: 500 * scalingH,
    }
    rightLine = {
      x1: p.width - 200 * scalingW,
      y1: p.height - 120 * scalingH,
      x2: p.width - 400 * scalingW,
      y2: 500 * scalingH,
    }


  }







  p.draw = function () {
    p.clear();
    p.background(255);
    p.textSize(40);
    p.noStroke();
    if(showWarning) p.text("p5 sound becomes laggy after time, \n please reload site in case of bugs", 20, 50);

    p.strokeWeight(20*scalingW);
    p.stroke(89);
    p.line(leftLine.x1, leftLine.y1, leftLine.x2, leftLine.y2);
    
    p.line(rightLine.x1, rightLine.y1, rightLine.x2, rightLine.y2);



    p.drawDepthIndicator();    
    p.drawSlidingInstruments();
    let timeNow = p.millis();

    if (detections != undefined) {
      if (detections.multiHandLandmarks != undefined) {

        /*  p.drawLines([0, 5, 9, 13, 17, 0]); //palm
         p.drawLines([0, 1, 2, 3, 4]); //thumb
         p.drawLines([5, 6, 7, 8]); //index finger
         p.drawLines([9, 10, 11, 12]); //middle finger
         p.drawLines([13, 14, 15, 16]); //ring finger
         p.drawLines([17, 18, 19, 20]); //pinky

         p.drawLandmarks([0, 1], 0); //palm base
         p.drawLandmarks([1, 5], 60); //thumb
         p.drawLandmarks([5, 9], 120); //index finger
         p.drawLandmarks([9, 13], 180); //middle finger
         p.drawLandmarks([13, 17], 240); //ring finger
         p.drawLandmarks([17, 21], 300); //pinky */

        p.calcHandSizes();
        //p.drawHandIcons();

        for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
          if (detections.multiHandedness[i].label == "Right") tromboneCurHand = i;
        }

        for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
          if (detections.multiHandedness[i].label == "Left") snareCurHand = i;
        }
        console.log("trombone hand = " + tromboneCurHand);
        console.log("snar hand: " + snareCurHand);

      }
    }


    //this is shitty and will break if only 1 hand is there
    if (trombone != undefined && timeNow > nextTrombone) {
      try {
        trombone.play();
      } catch (error) {}
      nextTrombone = timeNow + 60000 / p.map(processedHandSizes[tromboneCurHand], 40, 200, 20, 120, true);
    }

    if (snare != undefined && timeNow > nextSnare) {
      try {
        snare.play();
      } catch (error) {}
      nextSnare = timeNow + 60000 / processedHandSizes[snareCurHand];
    }


  }

  p.drawSlidingInstruments = function () {
    let tromboneFactor, snareFactor;
    tromboneFactor = p.map(processedHandSizes[tromboneCurHand], 40, 200, 1, 0);
    snareFactor = p.map(processedHandSizes[snareCurHand], 40, 200, 1, 0);
    
    
    let v1l = p.createVector(leftLine.x1, leftLine.y1);
    let v2l = p.createVector(leftLine.x2, leftLine.y2)
    p.push();
    p.translate(v1l.lerp(v2l, tromboneFactor));
    p.image(tromboneImg, 0, 0, processedHandSizes[tromboneCurHand] * 1 * scalingW, processedHandSizes[tromboneCurHand] * 1 * scalingW);
    p.pop();

    let v1r = p.createVector(rightLine.x1, rightLine.y1);
    let v2r = p.createVector(rightLine.x2, rightLine.y2)
    p.push();
    p.translate(v1r.lerp(v2r, snareFactor));
    p.image(drumsImg, 0, 0, processedHandSizes[snareCurHand] * 1 * scalingW, processedHandSizes[snareCurHand] * 1 * scalingW);
    p.pop();
    
  }

  p.drawDepthIndicator = function () {
    if (depthImg != undefined) {
      p.image(depthImg, p.width / 2, p.height / 4, scalingW * 150, scalingW * 150);
    }
  }

  p.drawLandmarks = function (indexArray, hue) {
    p.noFill();
    p.strokeWeight(8);
    for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
      for (let j = indexArray[0]; j < indexArray[1]; j++) {
        let x = (1 - detections.multiHandLandmarks[i][j].x) * p.width;
        let y = detections.multiHandLandmarks[i][j].y * p.height;
        // let z = detections.multiHandLandmarks[i][j].z;
        p.stroke(hue, 40, 255);
        p.point(x, y);
      }
      p.fill(0);
      p.textSize(200);
      p.text(i, (1 - detections.multiHandLandmarks[i][0].x) * p.width, detections.multiHandLandmarks[i][0].y * p.height);
    }
  }

  p.drawLines = function (index) {
    p.stroke(0, 0, 255);
    p.strokeWeight(3);
    for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
      for (let j = 0; j < index.length - 1; j++) {
        let x = (1 - detections.multiHandLandmarks[i][index[j]].x) * p.width;
        let y = detections.multiHandLandmarks[i][index[j]].y * p.height;
        // let z = detections.multiHandLandmarks[i][index[j]].z;

        let _x = (1 - detections.multiHandLandmarks[i][index[j + 1]].x) * p.width;
        let _y = detections.multiHandLandmarks[i][index[j + 1]].y * p.height;
        // let _z = detections.multiHandLandmarks[i][index[j+1]].z;
        p.line(x, y, _x, _y);
      }
    }
  }

  p.drawHandIcons = function () {
    for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
      let angle = p.calcAngle(1 - detections.multiHandLandmarks[i][0].x,
        detections.multiHandLandmarks[i][0].y,
        1 - detections.multiHandLandmarks[i][12].x,
        detections.multiHandLandmarks[i][12].y);
      p.push();
      p.translate((1 - detections.multiHandLandmarks[i][9].x) * p.width, detections.multiHandLandmarks[i][9].y * p.height)
      p.rotate(angle);
      if (detections.multiHandedness[i].label == "Right") p.scale(-1, 1);
      p.fill(255);
      p.image(handImg, 0, 0, processedHandSizes[i] * 4 * scalingW, processedHandSizes[i] * 4 * scalingW);
      if(i == snareCurHand) {
        p.translate(scalingW * 20, scalingW *40);
        p.image(drumsImg, 0, 0, processedHandSizes[i] * 1 * scalingW, processedHandSizes[i] * 1 * scalingW)
      }
      if(i == tromboneCurHand) {
        p.translate(scalingW * 20, scalingW *40);
        p.image(tromboneImg, 0, 0, processedHandSizes[i] * 1 * scalingW, processedHandSizes[i] * 1 * scalingW)
      }
      p.pop();

    }
  }

  p.calcHandSizes = function () {
    for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
      let z = p.dist(detections.multiHandLandmarks[i][0].x, detections.multiHandLandmarks[i][0].y,
        detections.multiHandLandmarks[i][5].x, detections.multiHandLandmarks[i][5].y);
      curHandSizes[i] = z;
      processedHandSizes[i] = Math.floor(p.map(curHandSizes[i], 0.15, .8, 40, 200, true));
      console.log(detections.multiHandedness[i].label + ", " + i + ": " + processedHandSizes[i]);
    }
  }

  p.calcAngle = function (midX, midY, extremityX, extremityY) {
    let v0 = p.createVector(extremityX - midX, extremityY - midY);
    return (v0.heading()) + p.PI / 2;
  }
}

let myp5 = new p5(sketch);