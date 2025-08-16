import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

import { setDot, clearDot } from './rect.js'; // adjust path to your three.js file

const video = document.getElementById('webcam');

const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

let handLandmarker;
let runningMode = 'VIDEO';
let lastVideoTime = -1;

// Initialize HandLandmarker
async function init() {
    const vision = await FilesetResolver.forVisionTasks('/mediapipe/tasks-vision/wasm');
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: '/hand_landmarker.task',
            delegate: 'GPU'
        },
        runningMode,
        numHands: 2
    });
    video.addEventListener('loadeddata', detect);
}

init();

function drawLandmarks(landmarksArray) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Step 1: draw detected landmarks
    landmarksArray.forEach((landmarks, handIndex) => {
        const point = landmarks[8]; // index finger tip
        if (!point) return; // skip if not detected

        const x = point.x * canvas.width;
        const mirroredX = canvas.width - x;
        const y = point.y * canvas.height;

        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Step 2: activate dot
        setDot(handIndex, mirroredX, y);
    });
}

// Detect and log/draw landmarks
async function detect() {
    if (!handLandmarker) return;

    const startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const results = handLandmarker.detectForVideo(video, startTimeMs);
        if (results.landmarks && results.landmarks.length > 0) {
            //console.log('Hand landmarks:', results.landmarks);
            drawLandmarks(results.landmarks);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < 2; i++) clearDot(i); // deactivate dots
        }
    }

    requestAnimationFrame(detect);
}
