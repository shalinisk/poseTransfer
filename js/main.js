

if ( WEBGL.isWebGLAvailable() === false ) {
		document.body.appendChild( WEBGL.getWebGLErrorMessage() );
		}

var canvas3, controls, bones, modelGLTF;
var camera, scene, renderer;

var helper, model;

var roboSkeleton, mesh;

var a = 0.175;
var b =0.1;

init();
loadModels();

function init() {

	canvas3 = document.getElementById('model');

	var width = canvas3.clientWidth;
	var height = canvas3.clientHeight;

	camera = new THREE.OrthographicCamera();
    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.near = 0.1;
    camera.far = 1500;
    camera.updateProjectionMatrix();

	scene = new THREE.Scene();
	scene.background  = new THREE.Color( 0x8FBCD4 ); // single color background


	    // position and point the camera to the center of the scene
        camera.position.x = -500;
        camera.position.y = 200;
        camera.position.z = 300;
        camera.lookAt(scene.position);


	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( -500, 200, 300 );
	scene.add( directionalLight );

	var light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
	light.position.set( -500, 200, 300 );
	scene.add( light );


	renderer = new THREE.WebGLRenderer( { canvas:canvas3});
	renderer.setSize(width, height, false);

	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//window.addEventListener('keypress',onDocumentKeyPress, false)

	// start the animation loop
	  renderer.setAnimationLoop( () => {

	    update();
	    render();
    } );

}



		function loadModels(){

			const url = 'assets/RobotExpressive.glb';

			const onLoad = ( gltf, position ) => {
				modelGLTF = gltf;
		    	model = gltf.scene;
		    	model.position.copy( position );

				// View skeleton
				helper = new THREE.SkeletonHelper( modelGLTF.scene.children[0] );
				helper.skeleton = modelGLTF.scene.children;
					
				helper.visible = true;	
				
				bones = helper.bones;
				roboSkeleton = new THREE.Skeleton( bones );
				
				mesh = new THREE.SkinnedMesh( model );

				mesh.bind(roboSkeleton);
				roboSkeleton.visible = true;
				scene.add(helper );

				console.log(roboSkeleton.bones)

		   		gltf.scene.traverse( function ( child ) {
					if ( child.isMesh ) {
						child.skinning = true;
					}
				});


		   		model.scale.set(22,22,22);
		   		//gltf.scene.position.y = -2.4;

		   		gltf.scene.position.y = -1.4;

		    	scene.add(model);


			};


			// loading callback
			const onProgress = () => { console.log("We are working on it")};

			// Error callback
			const onError = ( errorMessage ) => { console.log( errorMessage ); };

			 // load the first model. Each model is loaded asynchronously,
			const modelPosition = new THREE.Vector3( 0, -0.9, -1.4 );


			loader = new THREE.GLTFLoader().load( url, gltf => onLoad( gltf, modelPosition ),
			  	onProgress, 
			  	onError );
	
		}


		function onWindowResize() {
			camera.aspect = canvas3.innerWidth / canvas3.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( canvas3.innerWidth, canvas3.innerHeight );
		}


		function onDocumentMouseMove( event ) {
			event.preventDefault();
		}


		function resizeCanvasToDisplaySize() {
		  const canvas3 = renderer.domElement;
		  const width = canvas3.clientWidth;
		  const height = canvas3.clientHeight;
		  if (canvas3.width !== width ||canvas3.height !== height) {
		    // you must pass false here or three.js sadly fights the browser
		    renderer.setSize(width, height, false);
		    camera.aspect = width / height;
		    camera.updateProjectionMatrix();

		    // set render target sizes here
		  }
}


			function update() {
				if(model) model.rotation.y = -1;
		

			    if(roboSkeleton){

			   	/*
			   	 7 -> head,hands similarly 9
			   	 2 -> body - moves everything except 2 foot
			   	 11 - head
			   	 12 - left shoulder bone
			   	 26 - Right shoulder bone


			   	 */
			   	
			   	if(poses. length > 0){
			   		

			   		roboSkeleton.bones[2].position.x = poses[0].pose.keypoints[0].position.x/2000 - a;
			   		roboSkeleton.bones[2].position.y = poses[0].pose.keypoints[0].position.y/2000 - b;


			   		// roboSkeleton.bones[12].position.x = poses[0].pose.keypoints[5].position.x/2000 - 0.3
			   		// roboSkeleton.bones[12].position.y = poses[0].pose.keypoints[5].position.y/2000 - 0.37

			   		// roboSkeleton.bones[26].position.x = poses[0].pose.keypoints[6].position.x/2000- 0.3
			   		// roboSkeleton.bones[26].position.y = poses[0].pose.keypoints[6].position.y/2000 - 0.37

			   		// UpperarmL; actuallly looks like right lower leg

			   		roboSkeleton.bones[6].position.x = poses[0].pose.keypoints[7].position.x/ 2000- a; 
					roboSkeleton.bones[6].position.y = poses[0].pose.keypoints[7].position.y/2000 - b; 

					// UpperarmR
					// roboSkeleton.bones[9].position.x = poses[0].pose.keypoints[8].position.x/ 2000 - a; 
					// roboSkeleton.bones[9].position.y = poses[0].pose.keypoints[8].position.y/2000 - b;


			   	}

                roboSkeleton.matrixWorldNeedsUpdate = true;

			    }

		}


		function render() {
			renderer.render( scene, camera );
		}

