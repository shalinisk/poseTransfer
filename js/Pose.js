

var video = document.getElementById('video');
var canvas = document.getElementById('videocan'); //red
var drawing = document.getElementById('board'); //green
var ctx = canvas.getContext('2d');
var brd = drawing.getContext('2d');

var keypoint;

video.addEventListener("loadedmetadata", function(e){
  drawing.width = canvas.width = video.width = video.videoWidth;
  drawing.height = canvas.height = video.height = video.videoHeight;

}, false);


var poses = [];

// Create a webcam capture
const vdoConstraints = {
  //video: {facingMode: "user" , width: {min: canvas.width}, height: {min: canvas.height}}
  video: {facingMode: "user" }
};

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia(vdoConstraints).then(function(stream) {
    video.srcObject = stream;
    drawCameraIntoCanvas();
  })
  .catch(function(error) {
        console.error("What just happened!", error);
        alert("OMG! ")
    });
}




/*
The output stride and image scale factor have the largest effects on accuracy/speed. 
A higher output stride results in lower accuracy but higher speed. 
A higher image scale factor results in higher accuracy but lower speed.

*/


// Create a new poseNet method with a single detection
modelOptions = { 
 imageScaleFactor: 0.5,
 outputStride: 8,
 flipHorizontal: false,
 minConfidence: 0.1,
 maxPartConfidence: 0.5,
 maxPoseDetections: 5,
 scoreThreshold: 0.5,
 nmsRadius: 20,
 detectionType: 'single',
 multiplier: 1,
}


const poseNet = ml5.poseNet(video, 'single', modelLoaded, modelOptions);
console.log("after passing: ", video.width, video.height)

poseNet.on('pose', function (results) {
  poses = results;

});

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}

// A function to draw the video and poses into the canvas.
function drawCameraIntoCanvas() {
  ctx.drawImage(video, 0, 0, video.width, video.height);
  brd.clearRect(0,0, video.width, video.height);
  drawKeypoints();
  drawSkeleton();
  window.requestAnimationFrame(drawCameraIntoCanvas);
}


function drawKeypoints()  {

  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];

      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI);
        ctx.stroke();

        if(j > 4){
        brd.beginPath();
        brd.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        brd.fillStyle = "black";
        brd.lineCap = "round";
        brd.fill();
        brd.stroke();

      //console.log("Midpoints:", midpointX, midpointY)

      }
      }
      
      //console.log(keypoint)

    }
  }
}


function drawSkeleton() {

  for (let i = 0; i < poses.length; i++) {

    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];

      //draw on the video canvas
      ctx.beginPath();
      ctx.moveTo(partA.position.x, partA.position.y);
      ctx.lineWidth = 5;
      ctx.lineTo(partB.position.x, partB.position.y);
      ctx.stroke();

      //draw on the drawing board
      brd.strokeStyle = "black";
      brd.beginPath();
      brd.moveTo(partA.position.x, partA.position.y);
      brd.lineWidth = 5;
      brd.strokeStyle = "red";
      brd.lineTo(partB.position.x, partB.position.y);
      brd.stroke();
    
    }


      brd.beginPath();
      brd.arc(poses[i].pose.keypoints[0].position.x, poses[i].pose.keypoints[0].position.y,
       50, 0, 2 * Math.PI);
      brd.closePath();
      brd.stroke();

      ctx.beginPath();
      ctx.arc(poses[i].pose.keypoints[0].position.x, poses[i].pose.keypoints[0].position.y,
       50, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();

  }
}