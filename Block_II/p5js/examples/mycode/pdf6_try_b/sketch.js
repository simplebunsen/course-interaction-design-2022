// webcam
let video;

// handpose
let handpose;
let poses = [];


let mouseStartMs = 0;
let mouseRestartDelay = 1000;


let osc;
let playing;
let freq = 100;
let amp = .5;

let canvas;

let curHandSize = 0;
let processedHandSize = 40;

let klack;
let nextKlack = 0;
let muted = false;

function preload() {
  klack = loadSound('metronome_clack.wav');
  klack.playMode('restart');
  // Sound recording by Mirko Horstmann via freesound.org
  // https://freesound.org/people/m1rk0/sounds/50070/
}

function setup() {
  canvas = createCanvas(640, 480);;

  canvas.parent('canvas');

  // init webcam
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // init handpose, see also https://google.github.io/mediapipe/solutions/hands.html

  // options
  const options = {
    flipHorizontal: true, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  }
  handpose = ml5.handpose(video, options, modelReady);

  select('#output').html('... loading model');

  // detect if new pose detected and call 'gotResultModel'
  handpose.on('predict', gotResultsModel);

  // Hide the video element, and just show the canvas
  video.hide();

  checkSensorPermissions();

  osc = new p5.Oscillator('triangle');
  osc.freq(freq);
  osc.amp(amp);

}



function draw() {
  background(255);

  // show video (flipped)
  push();
  translate(width, 0);
  scale(-1, 1);

  image(video, 0, 0, width, height);
  pop();

  // show results of handpose
  drawKeypoints();
  drawSkeleton();
  //rect(poses[0].boundingBox.topLeft[0], poses[0].boundingBox.topLeft[1], poses[0].boundingBox.bottomRight[0], poses[0].boundingBox.bottomRight[1]);

  let handtemp = calcHandSize();
  if(handtemp) curHandSize = handtemp;


  let timeNow = millis();

  processedHandSize = map(curHandSize, 200, 900, 40, 300, true);
  console.log(processedHandSize);
  
  if (timeNow > nextKlack) {
    klack.play();
  	nextKlack = timeNow + 60000/processedHandSize;
  }


  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
  }

}


// model ready
function modelReady() {
  select('#output').html('model loaded');
}

// results of current model (p.ex. PoseNet, handpose, facemesh...)
function gotResultsModel(result) {
  poses = result;
  // just update optimized input data if new input data available
  if (poses.length > 0) {
    optimizedInputData = poses[0].landmarks;
    // console.log(optimizedInputData);
  }
}

////////////////////////////
// Visualization handpose //
////////////////////////////

// draw ellipses over the detected keypoints
function calcHandSize() {
  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i];

    // have a detailed look in your console
    // console.log(pose); 

    for (let j = 0; j < pose.landmarks.length; j += 1) {
      const topLeftX = pose.boundingBox.topLeft[0];
      const topLeftY = pose.boundingBox.topLeft[1];
      const bottomRightX = pose.boundingBox.bottomRight[0];
      const bottomRightY = pose.boundingBox.bottomRight[1];
      return dist(topLeftX, topLeftY, bottomRightX, bottomRightY);
    }
  }
  return false;
}


function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i];

    // have a detailed look in your console
    // console.log(pose); 

    for (let j = 0; j < pose.landmarks.length; j += 1) {
      const keypoint = pose.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 20, 20);
    }
  }
}

// draw the skeletons
function drawSkeleton() {

  for (let i = 0; i < poses.length; i++) {
    //onst pose = poses[i];
    let annotations = poses[0].annotations;
    stroke(0, 255, 0);
    for (let j = 0; j < annotations.thumb.length - 1; j++) {
      line(annotations.thumb[j][0], annotations.thumb[j][1], annotations.thumb[j + 1][0], annotations.thumb[j + 1][1]);
    }
    for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
      line(annotations.indexFinger[j][0], annotations.indexFinger[j][1], annotations.indexFinger[j + 1][0], annotations.indexFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
      line(annotations.middleFinger[j][0], annotations.middleFinger[j][1], annotations.middleFinger[j + 1][0], annotations.middleFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
      line(annotations.ringFinger[j][0], annotations.ringFinger[j][1], annotations.ringFinger[j + 1][0], annotations.ringFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.pinky.length - 1; j++) {
      line(annotations.pinky[j][0], annotations.pinky[j][1], annotations.pinky[j + 1][0], annotations.pinky[j + 1][1]);
    }

    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.thumb[0][0], annotations.thumb[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.indexFinger[0][0], annotations.indexFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.middleFinger[0][0], annotations.middleFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.ringFinger[0][0], annotations.ringFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.pinky[0][0], annotations.pinky[0][1]);

    textSize(50);
    fill(0);
    noStroke();
    text("BPM: " + round(processedHandSize),annotations.palmBase[0][0], annotations.palmBase[0][1]);
  }

}

// ----------------------------------------------
// https://editor.p5js.org/PaulGSA/sketches/Ezs-7rM3Y
// ----------------------------------------------
// SENSOR PERMISSION MANAGER FOR iOS13 AND SAFARI
// THANKS TO Dae In Chung for his video here:
// https://youtu.be/AbB9ayaffTc
let sensorPermissionGranted = false;

function checkSensorPermissions() {
  // DeviceOrientationEvent and DeviceMotionEvent
  if (typeof (DeviceOrientationEvent) !== 'undefined' &&
    typeof (DeviceOrientationEvent.requestPermission) === 'function') {
    // Must be iOS device so we need to ask permission to use sensors
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        // show permission dialogue only first time
        // This button label can be customised
        let button = createButton("Allow access to sensors");
        button.style("font-size", "48px");
        button.center();
        button.mousePressed(requestAccess);
        throw error;
      })
      .then(() => {
        // already granted permission
        sensorPermissionGranted = true;
      })
  } else {
    // Non-iOS13 device so no worries
    sensorPermissionGranted = true;
  }
}

function requestAccess() {
  DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response == 'granted') {
        // User has granted permission to access sensors
        sensorPermissionGranted = true;
      } else {
        // User has denied permission to access sensors
        sensorPermissionGranted = false;
      }
    })
    .catch(console.error);
  this.remove(); // kills button after user interaction
}