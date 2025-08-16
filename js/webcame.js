document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('webcam');
    const debugPanel = document.getElementById('webcam-debug');

    // Request webcam access
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' } // Front-facing for hand gestures in rhythm game
        });
        video.srcObject = stream;

        // Wait for video to load metadata before fullscreen
        video.addEventListener('loadedmetadata', () => {
            startDebugLoop();
        });
    } catch (error) {
        console.error('Webcam access denied:', error);
        debugPanel.innerHTML = 'Error: Enable camera for rhythm hand controls.';
    }

    // Debug loop: Update FPS or other data (expand for MediaPipe later)
    let lastTime = performance.now();
    let fps = 0;

    function startDebugLoop() {
        function updateDebug() {
            const now = performance.now();
            const delta = now - lastTime;
            fps = Math.round(1000 / delta);
            lastTime = now;

            debugPanel.innerHTML = `
                FPS: ${fps}<br>
                Resolution: ${video.videoWidth}x${video.videoHeight}<br>
            `;

            requestAnimationFrame(updateDebug); // Smooth updates tied to browser refresh
        }
        updateDebug();
    }
});
