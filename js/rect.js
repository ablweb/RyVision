import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

import hit from '/res/hit.mp3';

// Internal variables
let renderer, scene, camera, composer, dbg, dctx;
let cones = [];
let teseract;
let animationId;

const CONFIG = {
    COUNT: 12,
    SPAWN_R: 18,
    SPEED: 0.07
};

export let score = 100;
export const rectState = { debug: false, audio: false };

function projectToScreen(pos) {
    const v = pos.clone().project(camera);
    return {
        x: (v.x * 0.5 + 0.5) * dbg.width,
        y: (-v.y * 0.5 + 0.5) * dbg.height
    };
}

// Create cone mesh
function createCone() {
    const geom = new THREE.ConeGeometry(1, 2, 3);
    const mRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cone = new THREE.Mesh(geom, mRed);

    const edgesGeom = new THREE.EdgesGeometry(geom);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0xeeeeee });
    const edges = new THREE.LineSegments(edgesGeom, edgesMat);
    cone.add(edges);

    cone.userData.rotAxis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
    cone.userData.rotSpeed = 0.03 + Math.random() * 0.03;
    cone.userData.speedMod = 0.5 + Math.random() * 0.4; // Speed variation up to 1.3x

    return cone;
}

// Create teseract mesh
function createTeseract() {
    const geom = new THREE.ConeGeometry(2, 2, 3);
    const mRed = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const cone = new THREE.Mesh(geom, mRed);

    const edgesGeom = new THREE.EdgesGeometry(geom);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const edges = new THREE.LineSegments(edgesGeom, edgesMat);
    cone.add(edges);

    const mBlack = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.BackSide });
    const outline = new THREE.Mesh(geom, mBlack);
    outline.scale.set(1.05, 1.05, 1.05);
    cone.add(outline);

    cone.userData.rotAxis = new THREE.Vector3(0.4, 0.1, 0.5).normalize();
    cone.userData.rotSpeed = 0.03;

    return cone;
}

// Reset cone position
function resetCone(cone) {
    const a = Math.random() * Math.PI * 2;
    const r = CONFIG.SPAWN_R;
    cone.position.set(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 4);
    const toCenter = new THREE.Vector3().copy(cone.position).multiplyScalar(-1).normalize().multiplyScalar(CONFIG.SPEED * cone.userData.speedMod);
    cone.userData.vel = toCenter;
    if (rectState.audio) {
        const hitAudio = new Audio(hit);
        hitAudio.volume = 0.5;
        hitAudio.play();
    }
}

// Handle window resize
function handleResize() {
    const w = renderer.domElement.clientWidth;
    const h = renderer.domElement.clientHeight;
    if (dbg.width !== w || dbg.height !== h) { 
        dbg.width = w; 
        dbg.height = h; 
    }
    camera.aspect = w / h; 
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
}

// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);

    // Move and rotate cones
    for (const cone of cones) {
        cone.position.add(cone.userData.vel);
        cone.rotateOnAxis(cone.userData.rotAxis, cone.userData.rotSpeed);

        if (cone.position.lengthSq() < 0.5 * 0.5) {
            resetCone(cone);
            score--;
        }
    }

    // Rotate teseract
    teseract.rotateOnAxis(teseract.userData.rotAxis, teseract.userData.rotSpeed);

    dctx.clearRect(0, 0, dbg.width, dbg.height);
    if (rectState.debug) {
        dctx.clearRect(0, 0, dbg.width, dbg.height);
        dctx.lineWidth = 3;
        dctx.strokeStyle = "yellow";

        for (const c of cones) {
            const p = projectToScreen(c.position);
            const hs = 45; // half-size in pixels, adjust as needed
            dctx.strokeRect(p.x - hs, p.y - hs, hs * 2, hs * 2);
        }
    }

    // Render
    composer.render();
}


// Exported functions
export function setupRenderer() {
    // Create renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    Object.assign(renderer.domElement.style, {
        position: 'absolute', 
        inset: '0', 
        zIndex: '5', 
        pointerEvents: 'none'
    });
    document.body.appendChild(renderer.domElement);

    // Create scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    // Create debug canvas
    dbg = document.createElement('canvas');
    dctx = dbg.getContext('2d');
    Object.assign(dbg.style, { 
        position: 'absolute', 
        inset: '0', 
        zIndex: '3',         // moved above renderer
        pointerEvents: 'auto' // allow clicks
    });
    document.body.appendChild(dbg);

    // click hit test (hs = 45)
    dbg.addEventListener('click', (e) => {
        const rect = dbg.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (dbg.width / rect.width);
        const my = (e.clientY - rect.top) * (dbg.height / rect.height);

        for (const c of cones) {
            const p = projectToScreen(c.position);
            const hs = 45;
            if (mx >= p.x - hs && mx <= p.x + hs && my >= p.y - hs && my <= p.y + hs) {
                resetCone(c);
                score++;
                const gameInfo = document.getElementById("game-info");
                gameInfo.textContent = "score: " + score;
            }
        }
    });

    // Setup effects composer
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const afterimage = new AfterimagePass();
    afterimage.uniforms['damp'].value = 0.85;
    composer.addPass(afterimage);

    // Setup resize handler
    window.addEventListener('resize', handleResize);
    handleResize();
}

export function setupScene() {
    // Create cones
    cones = [];
    for (let i = 0; i < CONFIG.COUNT; i++) {
        const cone = createCone();
        resetCone(cone);
        scene.add(cone);
        cones.push(cone);
    }

    // Create teseract
    teseract = createTeseract();
    teseract.position.set(0, 0, 0);
    scene.add(teseract);
}

export function startAnimation() {
    if (!animationId) {
        animate();
    }
}

export function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

export function updateConfig(newConfig) {
    Object.assign(CONFIG, newConfig);
}
