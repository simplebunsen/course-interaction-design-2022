var w = window.innerWidth;
var h = window.innerHeight;


//SHAKE DETECT
let threshold = 40;
let accChangeX = 0;
let accChangeY = 0;
let accChangeT = 0;

let fS = 24;

let pShakeMs = 0;
let shakeSafetyDelay = 200;

let interShakeDurations = [];

let shakesProcessed = 0;

let currentProcessedBeatDelay = 0;

let beatIntervalObj;

let mouseStartMs = 0;
let mouseRestartDelay = 1000;

let countdownIntervalObj;

let countdownCurrent = 3;


let beatIndicatorMs = 0;
let beatIndicatorTO = 500;

let curBPM = 0;


let osc;
let playing;
let freq = 100;
let amp = .5;

const State = {
  Splash: 'Splash',
  Countdown: 'Countdown',
  Record: 'Record',
  Play: 'Play'
};
var currentState = State.Splash;

function setup() {
  canvas = createCanvas(w, h);
  textSize(fS * 0.8);
  checkSensorPermissions();

  osc = new p5.Oscillator('triangle');
  osc.freq(freq);
  osc.amp(amp);

}



function draw() {
  background(255);

  switch (currentState) {
    case State.Splash:
      if (mouseStartMs == 0) mouseStartMs = millis();
      text("Press your Screen Once To record a beat", 20, height / 2);
      if (mouseIsPressed && mouseStartMs + mouseRestartDelay < millis()) {
        countdownIntervalObj = setInterval(() => {
          countdownCurrent--;
        }, 1000);
        currentState = State.Countdown;
        mouseStartMs = 0;
      }
      break;
    case State.Countdown:
      text("Countdown to record start: " + countdownCurrent, 20, height / 2);
      if (countdownCurrent == 0) {
        currentState = State.Record;
        clearInterval(countdownIntervalObj);
        countdownCurrent = 3;
      }
      break;
    case State.Record:
      text("recording, shake or click in beat", 20, height / 2);
      if (checkForShake() || mouseIsPressed) {
        processShake();
      }

      let they = 40;
      interShakeDurations.forEach(e => {
        text('element: ' + e, 20, they);
        they += 10;
      });

      if (shakesProcessed >= 5) {
        console.log("we full na")
        let sum = 0;
        interShakeDurations.forEach(e => sum += e);
        sum = sum / interShakeDurations.length;
        currentProcessedBeatDelay = sum;
        currentState = State.Play;
        curBPM = round(60000/sum);

        fill("red");
        beatIntervalObj = setInterval(() => {
          beatIndicatorMs = millis();
          playOscillator();
          setTimeout(rampDownOscillator, 50);
        }, currentProcessedBeatDelay);
      }
      break;
    case State.Play:
      if (mouseStartMs == 0) mouseStartMs = millis();

      if(beatIndicatorMs + beatIndicatorTO < millis() ) beatIndicatorMs = 0;
      if(beatIndicatorMs != 0){
        let colores = lerpColor(color("red"), color("white"), map(millis(), beatIndicatorMs, beatIndicatorMs + beatIndicatorTO, 0, 1));
        fill(colores);
        rect(width / 2, height / 2, 50, 50);
      }
      fill("black");

      text("playing back ur beat, press to reset", 20, height / 2);
      text("BPM: " + curBPM, width/2, height/2 + 100);
      if (mouseIsPressed && mouseStartMs + mouseRestartDelay < millis()) {
        currentState = State.Splash;
        interShakeDurations = [];
        shakesProcessed = 0;
        pShakeMs = 0;
        clearInterval(beatIntervalObj);
        mouseStartMs = 0;
      }
      break;
    default:
      break;
  }

  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
  }

}

function checkForShake() {
  // Calculate total change in accelerationX and accelerationY
  accChangeX = abs(accelerationX - pAccelerationX);
  accChangeY = abs(accelerationY - pAccelerationY);
  accChangeZ = abs(accelerationZ - pAccelerationZ);
  accChangeT = accChangeX + accChangeY + accChangeZ;

  // If shake
  if (accChangeT >= threshold) return true;
  // If not shake
  else return false;
}

function processShake() {
  console.log("simulating shake");
  if (pShakeMs == 0) {
    console.log("inside pshakems == 0")
    pShakeMs = millis();
    playOscillator();
    setTimeout(rampDownOscillator, 50);
    shakesProcessed += 1;
  } else if (millis() > pShakeMs + shakeSafetyDelay) {
    console.log("getting inside array push " + (millis() - pShakeMs));
    interShakeDurations.push(millis() - pShakeMs);
    pShakeMs = millis();
    playOscillator();
    setTimeout(rampDownOscillator, 50);
    shakesProcessed += 1;
  } else console.log("inside neither");
}


function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  userStartAudio();
  osc.start();
  playing = true;
}

function rampDownOscillator() {
  // ramp amplitude to 0 over 0.1 seconds
  console.log("ramping down");
  osc.amp(0, 0.3);
  playing = false;
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

function windowResized() {
  // assigns new values for width and height variables
  w = window.innerWidth;
  h = window.innerHeight;
  resizeCanvas(w, h);
}