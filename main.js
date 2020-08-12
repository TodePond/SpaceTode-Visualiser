//=======//
// Setup //
//=======//
const stage = new Stage(document.body, {start: true, shadow: false, postProcess: false})
const {canvas, renderer, scene, camera, raycaster, cursor, dummyCamera} = stage

camera.position.set(20, 20, 20)
camera.lookAt(0, 0, 0)

const background = makeBackground()
scene.background = background

const sun = makeSun()
scene.add(sun)

const orbit = new THREE.OrbitControls(camera, document.body)
orbit.mouseButtons.LEFT = THREE.MOUSE.ROTATE
orbit.mouseButtons.MIDDLE = THREE.MOUSE.PAN
orbit.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
orbit.touches.ONE = undefined
orbit.touches.TWO = THREE.TOUCH.DOLLY_ROTATE
orbit.enableKeys = false
orbit.enableDamping = true
orbit.panSpeed = 1.8
on.process(orbit.update)

//==============//
// Event Window //
//==============//
// v3
/*{

	const EW_THICKNESS = 0.95
	const geo = new THREE.BoxGeometry(EW_THICKNESS, EW_THICKNESS, EW_THICKNESS)
	
	for (const pos of SITE_POSITIONS) {
	
		const [x, y, z] = pos
		
		const wireGeo = new THREE.WireframeGeometry(geo)
		
		
		const box = new THREE.LineSegments(wireGeo)
		box.position.x += pos[0]
		box.position.y += pos[1]
		box.position.z += pos[2]
		scene.add(box)
	}

}*/

// v2
{

	const EW_THICKNESS = 0.9
	const geo = new THREE.BoxGeometry(EW_THICKNESS, EW_THICKNESS, EW_THICKNESS)
	const mat = new THREE.MeshBasicMaterial({color: "white", transparent: true, opacity: 0.6})
	
	for (const pos of SITE_POSITIONS) {
	
		const [x, y, z] = pos
		
		const boxMat = [
			x == 2 || (x == 0)? mat : undefined, // Front
			x == -2 || (x == 0)? mat : undefined, // Back
			y == 2 || (y == 0)? mat : undefined, // Top
			y == -2 || (y == 0)? mat : undefined, // Bottom
			z == 2 || z == 0? mat : undefined, // Left
			z == -2 || z == 0? mat : undefined, // Right
		]
		
		const box = new THREE.Mesh(geo, boxMat)
		box.position.x += pos[0]
		box.position.y += pos[1]
		box.position.z += pos[2]
		scene.add(box)
	}

}

// Make EW! v1
/*{

	const geo = new THREE.BoxGeometry(0.95, 0.95, 0.95)
	const mat = new THREE.MeshLambertMaterial({color: "#d4d7de", emissive: "#b7bcc8", transparent: true, opacity: 0.7})
		
	for (const pos of SITE_POSITIONS) {
		const box = new THREE.Mesh(geo, mat)
		box.position.x += pos[0]
		box.position.y += pos[1]
		box.position.z += pos[2]
		scene.add(box)
	}

}*/

//===================//
// Diagram Functions //
//===================//

const BOX_SIZE = 0.75
const boxGeo = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE)

const diagramMeshes = []

const getFirstDiagram = (spaceTode) => spaceTode.instructions[0].value
const drawDiagram = (diagram) => {
	const parent = new THREE.Object3D()
	for (const spot of diagram) {
		const element = window[spot.input.symbol]
		const {colour, emissive, visible} = element
		const boxMat = new THREE.MeshLambertMaterial({color: colour, emissive, visible})
		const boxMesh = new THREE.Mesh(boxGeo, boxMat)
		boxMesh.position.x += spot.x
		boxMesh.position.y += spot.y
		boxMesh.position.z += spot.z
		parent.add(boxMesh)
	}
	
	parent.originalPosition = {...parent.position}
	diagramMeshes.push(parent)
	scene.add(parent)
}

let t = -Math.PI / 2
let paused = true
const animateDiagrams = (moves) => {
	const {x, y, z, r = 0} = moves
	
	on.process((e) => {
		if (paused) return
		t += e.detail.tickTime * 1.5
		const a = ((Math.sin(t) + 1) / 2)
		for (const mesh of diagramMeshes) {
			mesh.position.x = mesh.originalPosition.x + a * x
			mesh.position.y = mesh.originalPosition.y + a * y
			mesh.position.z = mesh.originalPosition.z + a * z
			mesh.rotation.x = 0 + a * (Math.PI / 2) * r
		}
	})
}

on.keydown(e => {
	if (e.key == " ") paused = !paused
})

//==========//
// Diagrams //
//==========//
SpaceTode `
	element Sand {
		colour "#fc0"
		emissive "#ffa34d"
	}
	
	element Empty visible false
	
	element Mouse {
		colour "white"
		emissive "grey"
	}
	
	element Rabbit {
		colour "white"
		emissive "grey"
	}
	
	element MouseTail {
		colour "pink"
		emissive "rgb(255, 64, 128)"
	}
	
	element Carrot {
		colour "rgb(200, 80, 0)"
	}
	
	element Leaf {
		colour "green"
	}
	
	origin L
	symbol L Leaf
	symbol C Carrot
	
	origin S
	symbol S Sand
	
	symbol _ Empty
	
	origin M
	symbol M Mouse
	symbol T MouseTail
	
	symbol R Rabbit
	
	keep .
	
`

const sandDiagram = getFirstDiagram(SpaceTode `


	S => _
	_    S

`)

const mouseDiagram = getFirstDiagram(SpaceTode `

	TM => ..

`)

const carrotDiagram = getFirstDiagram(SpaceTode `

	C    .
	C => .
	L    .

`)

const rabbitDiagram = getFirstDiagram(SpaceTode `

	R R    . .
	RMR => ...

`)


/*drawDiagram(sandDiagram)
animateDiagrams({x: 0, y: -1, z: 0})
*/
/*
drawDiagram(mouseDiagram)
animateDiagrams({x: 1, y: 0, z: 0})
*/

/*drawDiagram(carrotDiagram)
animateDiagrams({x: 0, y: 0, z: 0, r: 1})
*/

drawDiagram(rabbitDiagram)
animateDiagrams({x: 0, y: 0, z: 1})


