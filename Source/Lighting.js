//==========//
// Lighting //
//==========//
function makeSun(is2D = false) {
	const sun = new THREE.DirectionalLight()
	sun.position.set(-200, 400, 100)
	return sun
}

const bgColour = new THREE.Color()
bgColour.setHSL(Math.random(), 1, 0.8)
//bgColour.setHSL(Math.random(), 1, 0.85)
const bgColourString = `rgb(${Math.floor(bgColour.r * 255)}, ${Math.floor(bgColour.g * 255)}, ${Math.floor(bgColour.b * 255)})`

function makeBackground() {
	return bgColour
}
