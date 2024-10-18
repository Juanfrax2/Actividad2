// Crear la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Definir controles para interacción (rotación, zoom)
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Cargar la fuente para el texto 3D
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {

    // Datos de obesidad, ingesta calórica y actividad física por región de Chile
    const data = [
        {region: "Arica y Parinacota", x: 32.5, y: 2800, z: 22},
        {region: "Tarapaca", x: 30.5, y: 2900, z: 21},
        {region: "Antofagasta", x: 35.0, y: 3200, z: 15},
        {region: "Atacama", x: 31.0, y: 3000, z: 20},
        {region: "Coquimbo", x: 28.0, y: 2700, z: 30},
        {region: "Valparaiso", x: 30.0, y: 2800, z: 25},
        {region: "Metropolitana", x: 34.0, y: 3000, z: 20},
        {region: "O’Higgins", x: 29.5, y: 2750, z: 26},
        {region: "Maule", x: 29.0, y: 2750, z: 28},
        {region: "Nuble", x: 32.0, y: 2900, z: 18},
        {region: "Biobio", x: 32.5, y: 2900, z: 18},
        {region: "Araucania", x: 33.0, y: 3100, z: 22},
        {region: "Los Rios", x: 33.5, y: 3150, z: 16},
        {region: "Los Lagos", x: 36.0, y: 3400, z: 12},
        {region: "Aysen", x: 31.5, y: 2950, z: 23},
        {region: "Magallanes", x: 32.8, y: 3050, z: 19}
    ];

    // Crear material para los puntos (color)
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});

    // Escalar los datos para ajustarlos al tamaño del gráfico
    const scaleX = d3.scaleLinear().domain([25, 40]).range([-50, 50]); // Tasa de obesidad
    const scaleY = d3.scaleLinear().domain([2600, 3500]).range([-50, 50]); // Ingesta calórica
    const scaleZ = d3.scaleLinear().domain([10, 35]).range([-50, 50]); // Nivel de actividad física

    // Añadir los puntos y etiquetas a la escena
    data.forEach(d => {
        // Crear puntos esféricos
        const geometry = new THREE.SphereGeometry(0.8, 32, 32); // Radio de las esferas
        const point = new THREE.Mesh(geometry, material);
        point.position.set(scaleX(d.x), scaleY(d.y), scaleZ(d.z)); // Posiciones escaladas 3D
        scene.add(point);

        // Crear el texto 3D para la región
        const textGeometry = new THREE.TextGeometry(d.region, {
            font: font,
            size: 2,
            height: 0.1,
        });

        const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(scaleX(d.x) + 1, scaleY(d.y) + 1, scaleZ(d.z) + 1); // Posicionar el texto junto al punto
        scene.add(textMesh);
    });

    // Crear ejes (X, Y, Z) usando líneas
    const axesHelper = new THREE.AxesHelper(100);  // Los ejes tendrán un largo de 100 unidades
    scene.add(axesHelper);

    // Crear etiquetas 3D para los ejes
    const axisLabels = [
        {text: 'Tasa de Obesidad (%)', position: {x: 60, y: -5, z: 0}},
        {text: 'Ingesta Calorica Diaria (kcal)', position: {x: -5, y: 60, z: 0}},
        {text: 'Actividad Fisica (%)', position: {x: 0, y: -5, z: 60}},
    ];

    axisLabels.forEach(labelInfo => {
        const textGeometry = new THREE.TextGeometry(labelInfo.text, {
            font: font,
            size: 2,
            height: 0.1,
        });

        const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(labelInfo.position.x, labelInfo.position.y, labelInfo.position.z);
        scene.add(textMesh);
    });

});

// Posicionar la cámara para una mejor vista 3D
camera.position.set(80, 80, 120);
controls.update();

// Función de animación para renderizar la escena
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Actualizar controles de interacción
    renderer.render(scene, camera); // Renderizar la escena 3D
}

animate();
