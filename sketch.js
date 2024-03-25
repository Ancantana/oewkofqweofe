document.addEventListener('DOMContentLoaded', function() {
    const captureVideo = document.getElementById('captureVideo');
    const textInput = document.getElementById('textInput');
    const asciiArtContainer = document.getElementById('asciiArtContainer');
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            captureVideo.srcObject = stream;
            captureVideo.onloadedmetadata = function() {
                canvas.width = captureVideo.videoWidth;
                canvas.height = captureVideo.videoHeight;
                captureVideo.play();
            };
        })
        .catch(function(error) {
            console.error("Error accessing the webcam: ", error);
        });

    function captureFrame() {
        context.drawImage(captureVideo, 0, 0, canvas.width, canvas.height);
        return context.getImageData(0, 0, canvas.width, canvas.height);
    }

    function convertToAscii(imageData, chars) {
        if (chars.length === 0) return; // Exit if no characters provided

        let asciiArt = '';
        for (let i = 0; i < imageData.height; i += 10) {
            for (let j = 0; j < imageData.width; j += 5) {
                const offset = (i * imageData.width + j) * 4;
                const brightness = (imageData.data[offset] + imageData.data[offset + 1] + imageData.data[offset + 2]) / 3;
                const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                asciiArt += chars[charIndex];
            }
            asciiArt += '\n';
        }

        asciiArtContainer.textContent = asciiArt;
    }

    textInput.addEventListener('input', function() {
        const frameData = captureFrame();
        convertToAscii(frameData, textInput.value);
    });
});


