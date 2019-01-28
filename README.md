# poseTransfer

With the recent strides in AI, pose estimation with just a regular webcam or phone is finally possible. Though the accuracy needs improvement, this is a start for a lot of cool applications in AR and VR. This is my attempt at one. 

This project is in its early stages of development. The ultimate goal is to use the keypoints from Google's Posenet to animate 3d models.I am using ml5.js to access the Posenet results and three.js for the rendering of the model.

Suggestions and collaboration are welcome.

Next steps:
1. Translate posenet results to 3D model.
2. Convert orthographic coordinates to 2D canvas coordinates.
3. Record animation
	- start and stop buttons
	- smoothing function
4. Support for multiple poses
5. Option to choose between different models




