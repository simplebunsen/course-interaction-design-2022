let canvas;

let showWarning = false;

setTimeout(function () { showWarning = true; }, 60000);

setTimeout(function () { location.reload(); }, 63000);


let sketch = function (p) {
  var scaling;
  var curHandSizes = [0, 0];
  var processedHandSizes = [40, 40];

  var trombone;
  var nextTrombone = 0;
  var tromboneCurHand = 0;

  var snare;
  var nextSnare = 0;
  var snareCurHand = 1;

  var firstRecogMs = 0;

  var handImg;
  var leftHandImage;
  var rightHandImage;

  var drumsImg;
  var tromboneImg;

  var handsFont;


  var depthImg;

  var tromboneRate = 1;



  p.preload = function () {
    console.log("preloading");
    snare = p.loadSound('metronome_clack.wav');
    trombone = p.loadSound('trombone.wav');

    handImg = p.loadImage("hand.png");
    leftHandImage = p.loadImage("thumb_up.svg");
    rightHandImage = p.loadImage("hand.svg");
    drumsImg = p.loadImage("drums.png");
    tromboneImg = p.loadImage("trombone.png");
    depthImg = p.loadImage("depth.png");
    // Sound recording by Mirko Horstmann via freesound.org
    // https://freesound.org/people/m1rk0/sounds/50070/
  }

  p.setup = function () {
    canvas = p.createCanvas(innerWidth, innerHeight);
    scaling = p.width / 1000;
    canvas.id("canvas");

    handsFont = p.loadFont("handsworkaround.ttf");

    p.colorMode(p.HSB);
    p.imageMode(p.CENTER);
  }

  p.windowResized = function () {
    p.resizeCanvas(innerWidth, innerHeight);
    scaling = p.width / 1000;
  }



  let tromboneHUDworks = false;
  let drumsHUDworks = false;

  let loadingStill = true;

  p.draw = function () {
    p.clear();
    p.background(255);
    p.textSize(scaling*30);
    p.noStroke();
    p.fill(0);
    p.textFont("Helvetica")
    p.textAlign(p.CENTER, p.CENTER);
    if (showWarning) p.text("reloading in 3 seconds", p.width/2, 50);
    if (loadingStill) {
      p.text("...loading...", p.width / 2, 100);
    }
    p.drawDepthIndicator(firstRecogMs);
    p.drawRecognNotice(firstRecogMs);

    let timeNow = p.millis();

    if (detections != undefined) {
      if (detections.multiHandLandmarks != undefined) {
        if (firstRecogMs == 0 && detections.multiHandLandmarks.length != 0) {
          console.log("first detect at " + p.millis());
          firstRecogMs = p.millis();
        }

    
        for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
          if (detections.multiHandedness[i].label == "Right") tromboneHUDworks = true;
          if (detections.multiHandedness[i].label == "Left") drumsHUDworks = true;
        }
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
        p.drawHandIcons();
        p.drawHUDIndicators();

        for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
          if (detections.multiHandedness[i].label == "Right") tromboneCurHand = i;
        }

        for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
          if (detections.multiHandedness[i].label == "Left") snareCurHand = i;
        }
        //console.log("trombone hand = " + tromboneCurHand);
        //console.log("snar hand: " + snareCurHand);

      }
    }



    //this is shitty and will break if only 1 hand is there
    if (trombone != undefined && timeNow > nextTrombone) {
      try {
        if(tromboneHUDworks){
          console.log(tromboneRate);
          trombone.rate(tromboneRate);
          trombone.play();
        } 
      } catch (error) { }
      nextTrombone = timeNow + 60000 / p.map(processedHandSizes[tromboneCurHand], 40, 200, 120, 20, true);
      tromboneHUDworks = false;
    }

    if (snare != undefined && timeNow > nextSnare) {
      try {
        if(drumsHUDworks) snare.play();
      } catch (error) { }
      nextSnare = timeNow + 60000 / p.map(processedHandSizes[snareCurHand], 40, 200, 200, 40, true);
      drumsHUDworks = false;
    }


  }


  p.drawDepthIndicator = function (firstRecogMs) {
    let fadeTime = 3000;
    let leColor = p.color("255");
    if (handsFont != undefined && firstRecogMs == 0) {
      leColor = p.color(0);
    } else if (firstRecogMs != 0 && p.millis() - firstRecogMs < fadeTime) {
      let factor = p.map(p.millis() - firstRecogMs, 0, fadeTime, 0, 1);
      leColor = p.lerpColor(p.color(0), p.color(255), factor);
    }
    p.fill(leColor);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(scaling * 200);
    p.textFont(handsFont);
    p.text("C", p.width / 2, p.height / 2);
  }

  p.drawRecognNotice = function (firstRecogMs) {
    let fadeTime = 3000;
    let leColor = p.color("255");
    if (handsFont != undefined && firstRecogMs == 0) {
      leColor = p.color(50);
    } else if (firstRecogMs != 0 && p.millis() - firstRecogMs < fadeTime) {
      let factor = p.map(p.millis() - firstRecogMs, 0, fadeTime, 0, 1);
      leColor = p.lerpColor(p.color(50), p.color(255), factor);
    }
    p.fill(leColor);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(scaling * 120);
    p.textFont(handsFont);
    p.push();
    p.translate(p.width / 3, p.height / 2);
    p.scale(-1, 1);
    p.text("A", 0, 0);
    p.pop();
    p.text("A", 2 * p.width / 3, p.height / 2);
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
      //right is really left, neo
      let whichHand = "A";
      if (detections.multiHandedness[i].label == "Right") {
        p.scale(-1, 1);
        whichHand = "B"
        console.log(detections.multiHandLandmarks[i][5].y);
        tromboneRate = p.map(detections.multiHandLandmarks[i][5].y, 0, 1, 1.5, 0.8);
      }
      p.fill(50);
      //using text workaround font because p5js doesnt't provide any SVG Capability
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(processedHandSizes[i] * 4 * scaling);
      p.textFont(handsFont);
      p.text(whichHand, 0, 0);
      //p.image(leftHandImage, 0, 0, processedHandSizes[i] * 4 * scaling, processedHandSizes[i] * 4 * scaling);

      if (i == snareCurHand) {
        p.push();
        p.fill(0);
        p.translate(scaling * 20, scaling * 40);
        p.rotate(2 / 3 * p.PI);
        p.translate(processedHandSizes[i] * -.2, processedHandSizes[i] * 2);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(processedHandSizes[i] * 4 * scaling);
        p.textFont(handsFont);
        p.text("E", 0, 0);
        //p.image(drumsImg, 0, 0, processedHandSizes[i] * 1 * scaling, processedHandSizes[i] * 1 * scaling)
        p.pop();
      }
      if (i == tromboneCurHand) {
        p.push();
        p.fill(0);
        p.translate(scaling * 20, scaling * 40);
        p.scale(-1, 1);
        p.rotate(.25 * p.PI);
        p.translate(processedHandSizes[i] * -.2, processedHandSizes[i] * -.8);
        //p.translate(0, 200);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(processedHandSizes[i] * 4 * scaling);
        p.textFont(handsFont);
        p.text("D", 0, 0);
        //p.image(tromboneImg, 0, 0, processedHandSizes[i] * 1 * scaling, processedHandSizes[i] * 1 * scaling)
        p.pop();
      }
      p.pop();

    }
  }


  p.drawHUDIndicators = function () {
    loadingStill = false;
    let totalnum = 4;
    let tromboneHUDnum = 4;
    let drumsHUDnum = 4;
    let tromboneHUDworks = false;
    let drumsHUDworks = false;

    for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
      if (detections.multiHandedness[i].label == "Right") tromboneHUDworks = true;
      if (detections.multiHandedness[i].label == "Left") drumsHUDworks = true;
    }

    tromboneHUDnum = p.floor(p.map(processedHandSizes[tromboneCurHand], 40, 200, 1.5, 5.5, true));
    drumsHUDnum = p.floor(p.map(processedHandSizes[snareCurHand], 40, 200, 1.5, 5.5, true));

    p.push();
    p.fill(0);
    p.translate(0, p.height - scaling * 40);
    for (let i = 0; i < totalnum; i++) {
      p.translate(40 * scaling, 0);
      if (!tromboneHUDworks) p.fill("red");
      else if (i < tromboneHUDnum) p.fill(0);
      else p.fill(50);
      p.ellipse(0, 0, 20, 20);
    }
    p.pop();

    p.push();
    p.fill(0);
    p.translate(p.width, p.height - scaling * 40);
    for (let i = 0; i < totalnum; i++) {
      p.translate(-40 * scaling, 0);
      if (!drumsHUDworks) p.fill("red");
      else if (i < drumsHUDnum) p.fill(0);
      else p.fill(50);
      p.ellipse(0, 0, 20, 20);
    }
    p.pop()

  }

  p.calcHandSizes = function () {
    for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
      let z = p.dist(detections.multiHandLandmarks[i][0].x, detections.multiHandLandmarks[i][0].y,
        detections.multiHandLandmarks[i][5].x, detections.multiHandLandmarks[i][5].y);
      curHandSizes[i] = z;
      processedHandSizes[i] = Math.floor(p.map(curHandSizes[i], 0.15, .8, 40, 200, true));
      //console.log(detections.multiHandedness[i].label + ", " + i + ": " + processedHandSizes[i]);
    }
  }

  p.calcAngle = function (midX, midY, extremityX, extremityY) {
    let v0 = p.createVector(extremityX - midX, extremityY - midY);
    return (v0.heading()) + p.PI / 2;
  }
}

let myp5 = new p5(sketch);