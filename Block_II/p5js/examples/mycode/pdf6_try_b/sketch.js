var w = window.innerWidth;
var h = window.innerHeight;



let mouseStartMs = 0;
let mouseRestartDelay = 1000;


let osc;
let playing;
let freq = 100;
let amp = .5;


function setup() {
  canvas = createCanvas(w, h);
  checkSensorPermissions();

  osc = new p5.Oscillator('triangle');
  osc.freq(freq);
  osc.amp(amp);

}



function draw() {
  background(255);

  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
  }

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