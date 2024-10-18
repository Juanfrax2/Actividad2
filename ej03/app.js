// Configuración básica de la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Importar OrbitControls para mover la cámara
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Datos de ejemplo para las barras
const data = [5, 10, 7, 3, 6, 8];
const bars = [];
const labels = [];  // Arreglo para guardar los sprites con los valores

// Función para generar un color basado en la altura de la barra
function getColorBasedOnHeight(height, minHeight, maxHeight) {
    const percentage = (height - minHeight) / (maxHeight - minHeight);  // Normalizar la altura
    const color = new THREE.Color();
    
    // Interpolamos entre azul (barras más bajas) y rojo (barras más altas)
    color.lerpColors(new THREE.Color(0x0000ff), new THREE.Color(0xff0000), percentage);
    
    return color;
}

// Función para crear un sprite que muestra texto (el valor de la barra)
// Función para crear un sprite que muestra texto (el valor de la barra)
function createTextSprite(value) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;  // Aumentar el tamaño del canvas para un texto más grande
    context.font = 'Bold 60px Arial';  // Aumentar el tamaño de la fuente
    context.fillStyle = 'white';
    context.textAlign = 'center';  // Centrar el texto
    context.fillText(value, canvas.width / 2, 80);  // Ajustar la posición del texto en el canvas

    // Crear la textura y el material del sprite a partir del canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    return sprite;
}


// Geometría y material de las barras
const geometry = new THREE.BoxGeometry(1, 1, 1);
const minHeight = Math.min(...data);  // Encontrar la barra más baja
const maxHeight = Math.max(...data);  // Encontrar la barra más alta

data.forEach((value, index) => {
    const color = getColorBasedOnHeight(value, minHeight, maxHeight);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const bar = new THREE.Mesh(geometry, material);
    bar.scale.y = value;  // Escala de la barra según el valor de los datos
    bar.position.x = index * 1.5 - (data.length - 1) * 0.75; // Centrar las barras en el eje X
    bar.position.y = bar.scale.y / 2 - 2;  // Ajustar la posición de la barra en el eje Y
    bars.push(bar);
    scene.add(bar);

    // Crear el sprite con el valor de la barra
    const sprite = createTextSprite(value);
    sprite.position.x = bar.position.x;
    sprite.position.y = bar.scale.y - 2 + 0.5;  // Posicionar el sprite justo en la parte superior de la barra
    sprite.scale.set(2.5, 1.5, 1);  // Escalar el sprite para que el texto sea más visible
    labels.push(sprite);
    scene.add(sprite);
});


// Posicionar la cámara
camera.position.z = 15;
camera.position.y = 5;  // Elevar ligeramente la cámara

// Raycaster para la interacción del clic
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Función para detectar clic y cambiar el color de la barra
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(bars);
    if (intersects.length > 0) {
        const clickedBar = intersects[0].object;
        clickedBar.material.color.set(Math.random() * 0xffffff);
    }
}
window.addEventListener('click', onMouseClick, false);

// Función para animar las barras con un efecto de respiración (ondas de música)
let time = 0;
function animateBreathingEffect() {
    time += 0.05;
    bars.forEach((bar, index) => {
        // Animar la escala Y de las barras con una función seno para crear un efecto de onda
        const baseHeight = data[index];
        bar.scale.y = baseHeight + Math.sin(time + index) * (baseHeight * 0.5);  // Variación basada en el índice y el tiempo
        bar.position.y = bar.scale.y / 2 - 2;  // Ajustar la posición de la barra en Y según la nueva escala
    
        // Actualizar la posición del sprite (etiqueta) para que siempre esté sobre la barra
        const sprite = labels[index];
        sprite.position.y = bar.scale.y - 2 + 0.5;  // Posicionar el sprite justo en la parte superior de la barra
    });
    
}

// Animación general
function animate() {
    requestAnimationFrame(animate);
    animateBreathingEffect();
    controls.update();  // Actualizar los controles para mover la cámara
    renderer.render(scene, camera);
}

// Iniciar la animación
animate();
