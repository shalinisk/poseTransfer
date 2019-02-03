

if ( WEBGL.isWebGLAvailable() === false ) {
		document.body.appendChild( WEBGL.getWebGLErrorMessage() );
		}

var canvas3, controls, bones, modelGLTF;
var camera, scene, renderer;

var model;

var roboSkeleton, mesh;

var mouse, pos;

var width, height;

const vector = new THREE.Vector3();

init();
loadModels();

function init() {

	canvas3 = document.getElementById('model');

	width = canvas3.clientWidth;
	height = canvas3.clientHeight;

	
	pos = new THREE.Vector2();
	mouse = new THREE.Vector2();

	camera = new THREE.OrthographicCamera();
    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.near = 0.1;
    camera.far = 600;
    camera.updateProjectionMatrix();

	scene = new THREE.Scene();
	scene.background  = new THREE.Color( 0x8FBCD4 ); // single color background


	    // position and point the camera to the center of the scene
        camera.position.set(0,200,300);
        //camera.lookAt(scene.position);

        camera.lookAt(new THREE.Vector3(0,0,0));


	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 0, 200, 500 );
	scene.add( directionalLight );

	var light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
	light.position.set( 0, 200, 300 );
	scene.add( light );


	renderer = new THREE.WebGLRenderer( { canvas:canvas3});
	renderer.setSize(width, height, false);

	console.log("Renderer width: ", renderer.domElement.clientWidth);
	console.log("Renderer height: ", renderer.domElement.clientHeight);

	console.log("Width:", width);
	console.log("Height: ", height);


	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener('mousedown', onDocumentMouseDown, false);
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
				var helper = new THREE.SkeletonHelper( modelGLTF.scene.children[0] );
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
		    	console.log("Initial position: ", roboSkeleton.bones[2].position)


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

		function onDocumentMouseMove( event ) {
			event.preventDefault();
		}


		function onWindowResize() {
		  const canvas3 = renderer.domElement;
		  const width = canvas3.clientWidth;
		  const height = canvas3.clientHeight;
		  if (canvas3.width !== width ||canvas3.height !== height) {
		    
		    renderer.setSize(width, height, false);
		    camera.aspect = width / height;
		    camera.updateProjectionMatrix();

		    
		  }
}


			function update() {
				//if(model) model.rotation.y = -1;
		
			    if(roboSkeleton){

			   	if(poses.length > 0){
			   		
			   		pos.x = poses[0].pose.keypoints[0].position.x;
			   		pos.y = poses[0].pose.keypoints[0].position.y;

			   		
			  		vector.x = ( pos.x / renderer.domElement.clientWidth ) * 2 - 1;
					vector.y = - ( pos.y/ renderer.domElement.clientHeight ) * 2 + 1;
					vector.project( camera );

			   		roboSkeleton.bones[2].position.x = vector.x*18;
			   		roboSkeleton.bones[2].position.y = vector.y*20;
			   		

			   	}

                roboSkeleton.bones[2].updateMatrix();

			    }

		}


		function render() {
			renderer.render( scene, camera );
		}


		function onDocumentMouseDown(event){

		vector.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		vector.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
		vector.project( camera ); // converts to -1 to 1 range

		console.log("vector after project: ", vector);

		if(roboSkeleton && poses.length > 0){
				roboSkeleton.bones[2].position.x = vector.x;
			   	roboSkeleton.bones[2].position.y = vector.y;

			   	roboSkeleton.bones[2].updateMatrix();

		}

		}
