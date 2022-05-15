let detections = {};


const videoElement = document.getElementById('video');



const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(gotHands);

function gotHands(results) {
    detections = results;
}

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({
            image: videoElement
        });
    },
    width: innerWidth,
    height: innerWidth / 16 * 9,
});
camera.start();