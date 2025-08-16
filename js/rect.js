// cones-step1.js
// import * as THREE from 'three';

import * as THREE from 'three';

const canvas = document.getElementById('overlay');

// ---- renderer (transparent, above webcam) ----
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
Object.assign(renderer.domElement.style, {
  position: 'absolute', inset: '0', zIndex: '5', pointerEvents: 'none'
});
document.body.appendChild(renderer.domElement);

const screenWidth = renderer.domElement.clientWidth;
const screenHeight = renderer.domElement.clientHeight;

// ---- scene/camera ----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 12;

// ---- debug 2D canvas for collision boxes ----
const dbg = document.createElement('canvas');
const dctx = dbg.getContext('2d');
Object.assign(dbg.style, { position: 'absolute', inset: '0', zIndex: '3', pointerEvents: 'none' });
document.body.appendChild(dbg);

// ---- helpers ----
const SIZE = () => {
  const w = renderer.domElement.clientWidth;
  const h = renderer.domElement.clientHeight;
  if (dbg.width !== w || dbg.height !== h) { dbg.width = w; dbg.height = h; }
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
};
window.addEventListener('resize', SIZE);
SIZE();

function projectToScreen(vec3) {
  const v = vec3.clone().project(camera);
  const w = dbg.width, h = dbg.height;
  return { x: (v.x + 1) * 0.5 * w, y: (1 - (v.y + 1) * 0.5) * h };
}

// ---- cone factory (red + black silhouette outline) ----
function makeCone() {
  const geom = new THREE.ConeGeometry(1, 2, 3); // smaller 3D
  // red fill (darker)
  const mRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cone = new THREE.Mesh(geom, mRed);

  // black edges
  const edgesGeom = new THREE.EdgesGeometry(geom);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xffffff });
  const edges = new THREE.LineSegments(edgesGeom, edgesMat);
  cone.add(edges);

  // black outline via backface-scaled shell (gives thick edge)
  const mBlack = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
  const outline = new THREE.Mesh(geom, mBlack);
  outline.scale.set(1.02, 1.02, 1.02); // thickness
  cone.add(outline);

  // random 3D rotation axis + speed
  cone.userData.rotAxis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
  cone.userData.rotSpeed = 0.03 + Math.random() * 0.03;

  return cone;
}

// ---- swarm ----
const COUNT = 12;
const SPAWN_R = 18;         // world units from center
const SPEED = 0.07;         // toward center
const HITBOX_PX = 60;       // small 2D collision box (half-size)
const cones = [];

function resetCone(c) {
  const a = Math.random() * Math.PI * 2;
  const r = SPAWN_R;
  c.position.set(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 4);
  const toCenter = new THREE.Vector3().copy(c.position).multiplyScalar(-1).normalize().multiplyScalar(SPEED);
  c.userData.vel = toCenter;
}

for (let i = 0; i < COUNT; i++) {
  const c = makeCone();
  resetCone(c);
  scene.add(c);
  cones.push(c);
}


// ---- dots ----
//
// inside your three.js file
const dots = []; // max 10
const MAX_DOTS = 10;

// initialize dots
for (let i = 0; i < MAX_DOTS; i++) {
  dots.push({ x: 0, y: 0, active: false }); // inactive until used
}

// update a dot position
export function setDot(index, x, y) {
  if (index < 0 || index >= MAX_DOTS) return;
  dots[index].x = x;
  dots[index].y = y;
  dots[index].active = true;
}

// deactivate a dot
export function clearDot(index) {
  if (index < 0 || index >= MAX_DOTS) return;
  dots[index].active = false;
}

// ---- 2D collision (screen-space AABB around projected center) ----
// For now: AABB centered at the projected cone position. Debug drawn in yellow.

function checkCollisions() {
  for (const c of cones) {
    const p = projectToScreen(c.position);
    const hs = HITBOX_PX;

    for (const d of dots) {
      if (!d.active) continue;
      const scaleX = screenWidth / canvas.width;   // 1920 / 640 = 3
      const scaleY = screenHeight / canvas.height; // 1080 / 480 = 2.25

      const dx = d.x * scaleX;
      const dy = d.y * scaleY;

      console.log("Dot position:", dx, dy);
      console.log("CONE:", p.x, p.y);
      if (
        dx >= p.x - hs &&
        dx <= p.x + hs &&
        dy >= p.y - hs &&
        dy <= p.y + hs
      ) {
        resetCone(c); // triangle hit
        console.log("COLISION");
        break; // no need to check other dots for this triangle
      }
    }
  }
}

// ---- loop ----
function tick() {
  requestAnimationFrame(tick);

  // move + rotate
  for (const c of cones) {
    c.position.add(c.userData.vel);
    c.rotateOnAxis(c.userData.rotAxis, c.userData.rotSpeed);

    // respawn if near center (world)
    if (c.position.lengthSq() < 0.5 * 0.5) resetCone(c);
  }

  // draw
  renderer.render(scene, camera);

  checkCollisions();

  // debug AABBs
  dctx.clearRect(0, 0, dbg.width, dbg.height);
  dctx.lineWidth = 3;
  dctx.strokeStyle = 'yellow';
  for (const c of cones) {
    const p = projectToScreen(c.position);
    const hs = HITBOX_PX;
    dctx.strokeRect(p.x - hs, p.y - hs, hs * 2, hs * 2);
  }
}

tick();
