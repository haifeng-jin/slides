/*
Webcam Integration for Reveal.js Slides

This script provides webcam functionality for presentations, allowing presenters to show their camera feed and switch between multiple cameras.

Keyboard Shortcuts:
- Ctrl+C: Toggle webcam visibility (show/hide the webcam overlay)
- Ctrl+Shift+C: Switch between available cameras (only works when webcam is visible)

To add webcam to your slides:
1. Include this script in your HTML after other scripts: <script src="path/to/webcam.js"></script>
2. Add the following HTML structure in your <body> (preferably at the top for overlay positioning):
   <div class="webcam-container hidden" id="webcamContainer">
       <video class="webcam-video" id="webcamVideo" autoplay muted playsinline></video>
       <div class="webcam-error" id="webcamError" style="display: none;">
           Camera not available
       </div>
   </div>
3. Include the webcam.css stylesheet in your HTML head: <link rel="stylesheet" href="path/to/webcam.css">
4. The webcam will appear as a fixed overlay in the bottom-left corner when activated.
*/

// Webcam functionality
let webcamStream = null;
let webcamInitialized = false;
let webcamVisible = false;
let videoDevices = [];
let currentDeviceIndex = 0;

async function getVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    videoDevices = devices.filter(device => device.kind === 'videoinput');
}

async function initWebcam(deviceId = null) {
    if (webcamInitialized && !deviceId) return;

    const video = document.getElementById('webcamVideo');
    const error = document.getElementById('webcamError');

    try {
        if (webcamStream) {
            webcamStream.getTracks().forEach(track => track.stop());
        }
        if (!deviceId) {
            if (videoDevices.length === 0) {
                await getVideoDevices();
            }
            if (videoDevices.length > 0) {
                deviceId = videoDevices[0].deviceId;
                currentDeviceIndex = 0;
            }
        }
        const constraints = {
            video: { deviceId: { exact: deviceId } },
            audio: false
        };
        webcamStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = webcamStream;
        webcamInitialized = true;
        error.style.display = 'none';
        video.style.display = 'block';
    } catch (err) {
        console.error('Error accessing webcam:', err);
        error.style.display = 'flex';
        video.style.display = 'none';
    }
}

async function switchCamera() {
    if (videoDevices.length === 0) {
        await getVideoDevices();
    }
    if (videoDevices.length > 1) {
        currentDeviceIndex = (currentDeviceIndex + 1) % videoDevices.length;
        await initWebcam(videoDevices[currentDeviceIndex].deviceId);
    }
}

function toggleWebcamVisibility() {
    const container = document.getElementById('webcamContainer');

    if (webcamVisible) {
        // Hide webcam
        container.classList.add('hidden');
        webcamVisible = false;
    } else {
        // Show webcam (initialize if needed)
        if (!webcamInitialized) {
            initWebcam();
        }
        container.classList.remove('hidden');
        webcamVisible = true;
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'c' && e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        toggleWebcamVisibility();
    } else if (e.key === 'C' && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        if (webcamVisible) {
            switchCamera();
        }
    }
});