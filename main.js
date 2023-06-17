// Zmienne globalne
let scene, camera, renderer;

// Główna funkcja inicjująca
function init() {
	// Inicjalizacja zmiennych
	const inputNumberOfSteps = document.getElementById('numberOfSteps');
	const inputStepHeight = document.getElementById('stepHeight');
	const inputStepWidth = document.getElementById('stepWidth');
	const inputGeoCorner = document.getElementById('geoCorner');
	const inputGeoRadius = document.getElementById('geoRadius');

	// Tagi label z akutalnymi parametrami
	const inputNumberOfStepsStats = document.getElementById('numberOfStepsStats');
	const inputStepHeightStats = document.getElementById('stepHeightStats');
	const inputStepWidthStats = document.getElementById('stepWidthStats');
	const inputGeoCornerStats = document.getElementById('geoCornerStats');
	const inputGeoRadiusStats = document.getElementById('geoRadiusStats');

	// Inicjalizacja sceny i kamery
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	// Wygładzenie krawędzi stopni
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	scene.background = new THREE.Color(0xffffff);
	document.body.appendChild(renderer.domElement);

	// Tworzenie kształtu schodów
	let stepGeometry = new THREE.BoxGeometry(5, 0.2, 5);
	const texture = new THREE.TextureLoader().load('textures/woodenplates.jpg');
	const stepMaterial = new THREE.MeshBasicMaterial({ map: texture });

	// Utworzenie możliwości ruchu kamerą
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 8, 0);
	scene.add(controls);

	// Ustawianie kamery
	camera.position.set(20, 20, 20);
	camera.lookAt(new THREE.Vector3(0, 8, 0));

	// Tworzenie obiektu Mesh dla każdego stopnia
	function createSteps() {
		const numberOfSteps = parseInt(inputNumberOfSteps.value);

		for (let i = 0; i < numberOfSteps; i++) {
			const stepWidth = parseFloat(inputStepWidth.value);
			const stepHeight = parseFloat(inputStepHeight.value);
			const geoCorner = parseInt(inputGeoCorner.value);
			const geoRadius = parseInt(inputGeoRadius.value);

			const stepMesh = new THREE.Mesh(stepGeometry, stepMaterial);
			stepGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepWidth);

			// Ustawianie pozycji i obrót dla każdego stopnia (spiralny układ)
			const angle = i * (Math.PI / 180) * geoCorner; // Kąt obrotu
			const radius = geoRadius; // Promień spiralny
			const x = radius * Math.cos(angle); // Odleglość od osi X
			const y = i * stepHeight; // Podnosimy wysokość spirali o wysokość stopnia na osi Y
			const z = radius * Math.sin(angle); // Odleglość od osi Z
			stepMesh.position.set(x, y, z); // Ustawiamy współrzędne
			stepMesh.rotation.y = -angle; // Ustawienie rotacji stopnia

			scene.add(stepMesh);
		}
	}

	// Funkcja aktualizująca wygląd schodów
	function updateGeometry() {
		stepGeometry.dispose();
		resetScene();
		createSteps();
		updateStats();
	}

	// Funkcja aktualizująca na bieżąco aktualne parametry kontrolerów
	function updateStats() {
		inputNumberOfStepsStats.textContent =
			'Liczba stopni spirali: ' + inputNumberOfSteps.value;
		inputStepHeightStats.textContent =
			'Wysokośc jednego stopnia: ' + inputStepHeight.value;
		inputStepWidthStats.textContent =
			'Szerokość jednego stopnia: ' + inputStepWidth.value;
		inputGeoCornerStats.textContent =
			'Kąt wychylenia jednego stopnia: ' + inputGeoCorner.value;
		inputGeoRadiusStats.textContent =
			'Promień spirali: ' + inputGeoRadius.value;
	}

	// Nasłuchiwacze na suwaki
	inputNumberOfSteps.addEventListener('input', updateGeometry);

	inputStepHeight.addEventListener('input', updateGeometry);

	inputStepWidth.addEventListener('input', updateGeometry);

	inputGeoCorner.addEventListener('input', updateGeometry);

	inputGeoRadius.addEventListener('input', updateGeometry);

	// Wywołanie funkcji pierwszy raz
	createSteps();
	updateGeometry();
}

// Renderowanie sceny
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

// Funkcja resetująca scenę
function resetScene() {
	while (scene.children.length > 0) {
		scene.remove(scene.children[0]);
	}
}

// Funkcja ustawiająca spiralę zawsze na środku ekranu przy zmiane szerokości okna przeglądarki
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();
