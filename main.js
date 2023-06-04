// Inicjalizacja zmiennych
let numberOfSteps = 20;
const stepHeight = 0.2;
const stepWidth = 2;
const input = document.getElementById('stepRange');

// Inicjalizacja sceny i kamery
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

// Wygładzenie krawędzi stopni
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight); // Ustawiamy rozmiar rendera na rozmiar okna przeglądarki (window)
document.body.appendChild(renderer.domElement); // Dodanie elementu rendera do dokumentu HTML

// Tworzenie kształtu schodów
const stepGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepWidth);
// Ustawienie koloru materiału
const stepMaterial = new THREE.MeshBasicMaterial({ color: 0x345995 });

// Tworzenie obiektu Mesh dla każdego stopnia
function createSteps() {
	for (let i = 0; i < numberOfSteps; i++) {
		const stepMesh = new THREE.Mesh(stepGeometry, stepMaterial);

		// Ustawianie pozycji i obrót dla każdego stopnia (spiralny układ)
		const angle = i * (Math.PI / 180) * 10; // Kąt obrotu
		const radius = 5; // Promień spiralny
		const x = radius * Math.cos(angle); // Odleglość od osi X
		const y = i * stepHeight; // Podnosimy wysokość spirali o wysokość stopnia na osi Y
		const z = radius * Math.sin(angle); // Odleglość od osi Z
		stepMesh.position.set(x, y, z); // Ustawiamy współrzędne
		stepMesh.rotation.y = -angle; // Ustawienie rotacji stopnia

		scene.add(stepMesh);
	}
}

// Wywołanie funkcji
createSteps();

// Ustawianie kamery
camera.position.set(20, 20, 20); // Ustawienie pozycji kamery
camera.lookAt(new THREE.Vector3(0, 10, 0)); // Skierowanie kamery na punkt (0, 10, 0)

// Renderowanie sceny
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate(); // wywołanie funkcji renderowania sceny

// Funkcja aktualizująca ilość stopni na podstawie wartości suwaka
input.addEventListener('input', () => {
	numberOfSteps = parseInt(input.value);
	resetScene();
	createSteps();
});

// Funkcja resetująca scenę
function resetScene() {
	while (scene.children.length > 0) {
		scene.remove(scene.children[0]);
	}
}
