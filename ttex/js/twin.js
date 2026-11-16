/* Generik stansiya "digital twin": oddiy geometriya + namunaviy (mock) ma'lumot. Hech qanday mijoz modeli/logosi yo'q.
   update(t) t (soniya) ning sof funksiyasi: bir xil t, bir xil kadr. */
import * as THREE from './vendor/three.module.min.js';

const BAY_X = [-9, -5, -1, 3], BAY_Z = 2.3, LANE_Z = 9.3;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const easeIO = p => (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const lerpAngle = (a, b, p) => { let d = ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return a + d * p; };

// namunaviy mashinalar: [t, x, z] yo'l nuqtalari; slot: [bay, kirish, chiqish]
const CARS = [
  { id: 'A', plate: '31다2048', color: 0xf2f2f2, slot: [1, 3.4, 11], wp: [[.5, -22, LANE_Z], [2.2, BAY_X[1], LANE_Z], [3.4, BAY_X[1], BAY_Z], [11, BAY_X[1], BAY_Z], [12.2, BAY_X[1], LANE_Z], [14.5, 22, LANE_Z]] },
  { id: 'B', plate: '57마8812', color: 0x2b2d31, slot: [3, 4.4, 9.5], wp: [[1, -22, LANE_Z], [3.3, BAY_X[3], LANE_Z], [4.4, BAY_X[3], BAY_Z], [9.5, BAY_X[3], BAY_Z], [10.7, BAY_X[3], LANE_Z], [13, 22, LANE_Z]] },
  { id: 'C', plate: '204허1357', color: 0xb6bcc4, slot: [0, 8.8, 17], wp: [[6, -22, LANE_Z], [7.6, BAY_X[0], LANE_Z], [8.8, BAY_X[0], BAY_Z], [17, BAY_X[0], BAY_Z], [18.2, BAY_X[0], LANE_Z], [20.5, 22, LANE_Z]] },
  { id: 'W', plate: '12가3456', color: 0x1a95d6, wash: true, wp: [[4, -22, LANE_Z], [7.3, 9, LANE_Z], [8.5, 9, BAY_Z], [10.5, 9, BAY_Z], [14.5, 19, BAY_Z], [15.7, 19, LANE_Z], [17.5, 24, LANE_Z]] },
  { id: 'P1', color: 0xd9dde2, still: [-12.5, -8, Math.PI / 2], parked: true },
  { id: 'P2', color: 0x8a2b2b, still: [-16, -8, Math.PI / 2] }
];

function carMesh(color) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.3, .85, 1.85), new THREE.MeshStandardMaterial({ color, roughness: .45, metalness: .25 }));
  body.position.y = .72; body.castShadow = true; g.add(body);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, .72, 1.6), new THREE.MeshStandardMaterial({ color: 0x1c2630, roughness: .2, metalness: .5 }));
  cab.position.set(-.2, 1.5, 0); cab.castShadow = true; g.add(cab);
  const wm = new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: .8 });
  [[1.4, .92], [1.4, -.92], [-1.4, .92], [-1.4, -.92]].forEach(([x, z]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .3, 14), wm); w.rotation.x = Math.PI / 2; w.position.set(x, .38, z); g.add(w); });
  return g;
}
const box = (w, h, d, color, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: .8, ...o })); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m; };

export function createTwin(o) {
  const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: true });
  renderer.setSize(o.w, o.h, false); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.setClearColor(0x1a2026, 1);
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x1a2026, 60, 120);
  const cam = new THREE.PerspectiveCamera(36, o.w / o.h, .5, 200);

  scene.add(new THREE.HemisphereLight(0xdbeaff, 0x39414a, 1.35));
  const sun = new THREE.DirectionalLight(0xffffff, 1.25); sun.position.set(-14, 26, 16); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 28, bottom: -24, near: 1, far: 80 }); sun.shadow.bias = -.0004; scene.add(sun);

  // yer, yo'l, maydon
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 80), new THREE.MeshStandardMaterial({ color: 0x2d353d, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const plane = (w, d, c, x, z, y = .01) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ color: c, roughness: .95 })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; scene.add(m); return m; };
  plane(70, 3.8, 0x20262b, 0, 9.4); plane(17, 11, 0x3b444d, -3, 1.2, .02);
  for (let x = -34; x < 34; x += 5) plane(2.4, .12, 0xe8e4d4, x, 9.3, .03);
  plane(14, 8, 0x3b444d, -13, -8, .02);
  [-16, -12.5, -9].forEach(x => { [[-1.6, 0], [1.6, 0]].forEach(([dx]) => plane(.1, 4.6, 0xffffff, x + dx, -8, .03)); });

  // pompa orollari, ustunlar, tom
  const bays = BAY_X.map((x, i) => {
    scene.add(box(.9, .25, 2.4, 0xcfd3d6, x, .12, -.6)); scene.add(box(.8, 1.7, .6, 0xe9ecee, x, 1.1, -.6)); scene.add(box(.82, .3, .62, 0x1a95d6, x, 2.05, -.6));
    const f = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 4), new THREE.MeshBasicMaterial({ color: 0x1a95d6, transparent: true, opacity: 0 })); f.rotation.x = -Math.PI / 2; f.position.set(x, .045, BAY_Z); scene.add(f);
    const ln = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.9, 4)), new THREE.LineBasicMaterial({ color: 0x8a8880 })); ln.rotation.x = -Math.PI / 2; ln.position.set(x, .05, BAY_Z); scene.add(ln);
    return f;
  });
  [-11, -3, 5].forEach(x => [-3.2, 5].forEach(z => scene.add(box(.5, 5.2, .5, 0xdfe3e6, x, 2.6, z))));
  const roof = new THREE.Mesh(new THREE.BoxGeometry(17, .3, 8.6), new THREE.MeshStandardMaterial({ color: 0xdfe3e6, transparent: true, opacity: .2, depthWrite: false })); roof.position.set(-3, 5.3, .9); scene.add(roof);
  const re = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(17, .3, 8.6)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55 })); re.position.copy(roof.position); scene.add(re);

  // moyka, do'kon, daraxtlar
  scene.add(box(7, 4.2, 4.2, 0xcfd6dc, 14.5, 2.1, BAY_Z)); scene.add(box(7.2, .35, 4.4, 0x1a95d6, 14.5, 4.3, BAY_Z));
  const door = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3), new THREE.MeshBasicMaterial({ color: 0x0b0d0f })); door.rotation.y = -Math.PI / 2; door.position.set(10.98, 1.5, BAY_Z); scene.add(door);
  scene.add(box(11, 3.2, 4.4, 0x3a4048, 5, 1.6, -9.2)); scene.add(box(11.2, .3, 4.6, 0x1a95d6, 5, 3.3, -9.2));
  [[-22, -3], [-21, 3], [-20, -8], [22, -9], [24, 0], [-19, 14], [8, -15], [-6, -16]].forEach(([x, z]) => { scene.add(box(.35, 1.4, .35, 0x4a3a2a, x, .7, z)); const c = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.4, 8), new THREE.MeshStandardMaterial({ color: 0x2f5d3a, roughness: .9 })); c.position.set(x, 3, z); c.castShadow = true; scene.add(c); });

  // mashinalar
  const cars = CARS.map(c => { const m = carMesh(c.color); m.visible = false; scene.add(m); return { c, m }; });
  function pose(c, t) {
    if (c.still) return { x: c.still[0], z: c.still[1], ry: c.still[2], on: true };
    const w = c.wp; if (t < w[0][0] || t > w[w.length - 1][0]) return { on: false };
    const hs = []; let prev = Math.atan2(-(w[1][2] - w[0][2]), w[1][1] - w[0][1]);
    for (let i = 0; i < w.length - 1; i++) { const dx = w[i + 1][1] - w[i][1], dz = w[i + 1][2] - w[i][2]; if (Math.hypot(dx, dz) > .01) prev = Math.atan2(-dz, dx); hs.push(prev); }
    let i = 0; while (i < w.length - 2 && t > w[i + 1][0]) i++;
    const p = easeIO(clamp((t - w[i][0]) / (w[i + 1][0] - w[i][0])));
    const ry = i > 0 ? lerpAngle(hs[i - 1], hs[i], clamp((t - w[i][0]) / .6)) : hs[0];
    return { x: lerp(w[i][1], w[i + 1][1], p), z: lerp(w[i][2], w[i + 1][2], p), ry, on: true };
  }

  // yorliqlar
  const mk = () => { const d = document.createElement('div'); Object.assign(d.style, { position: 'absolute', transform: 'translate(-50%,-100%)', whiteSpace: 'nowrap', font: '600 20px/1.15 system-ui,"Noto Sans KR",sans-serif', textAlign: 'center', padding: '5px 12px', borderRadius: '9px', background: 'rgba(20,24,28,.9)', border: '1.5px solid #3a3834', color: '#a7a49b', pointerEvents: 'none' }); o.labelsRoot.appendChild(d); return d; };
  const slotL = BAY_X.map(mk), washL = mk(), parkL = mk();
  const v = new THREE.Vector3();
  function place(el, x, y, z) { v.set(x, y, z).project(cam); el.style.left = clamp((v.x * .5 + .5) * o.box.w, 120, o.box.w - 120).toFixed(1) + 'px'; el.style.top = clamp((-v.y * .5 + .5) * o.box.h, 60, o.box.h - 20).toFixed(1) + 'px'; }
  const mmss = s => { s = Math.max(0, Math.floor(s)); return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + s % 60).slice(-2); };

  return { update(t, T) {
    const az = Math.sin(t * .22) * .16, r = 31, el = 52 * Math.PI / 180; cam.position.set(.5 + r * Math.cos(el) * Math.sin(az), r * Math.sin(el), 3 + r * Math.cos(el) * Math.cos(az)); cam.lookAt(.5, 0, 1.6); cam.updateMatrixWorld();
    const slots = [null, null, null, null]; let wash = 0;
    cars.forEach(({ c, m }) => {
      const p = pose(c, t); m.visible = p.on; if (!p.on) return; m.position.set(p.x, 0, p.z); m.rotation.y = p.ry;
      if (c.slot && t >= c.slot[1] && t <= c.slot[2]) slots[c.slot[0]] = { plate: c.plate, since: t - c.slot[1] };
      if (c.wash) { if (t >= 8.5 && t < 10.5) wash = 1; else if (t >= 10.5 && t < 14.5) wash = 2; }
    });
    bays.forEach((f, i) => { f.material.opacity = slots[i] ? .28 : 0; });
    slotL.forEach((d, i) => { const s = slots[i]; d.innerHTML = '<div style="font-size:15px;color:#8a8880;letter-spacing:.06em">SLOT ' + (i + 1) + '</div><div>' + (s ? s.plate + ' · ' + mmss(s.since) : T('p08.empty')) + '</div>'; d.style.color = s ? '#f4f2ec' : '#8a8880'; d.style.borderColor = s ? '#1a95d6' : '#3a3834'; place(d, BAY_X[i], i % 2 ? 9.6 : 6.4, BAY_Z); });
    washL.textContent = T('p08.wash' + wash); washL.style.color = wash ? '#f4f2ec' : '#8a8880'; washL.style.borderColor = wash === 2 ? '#e0a030' : '#3a3834'; place(washL, 14.5, 5.6, BAY_Z);
    parkL.textContent = 'P2 · ' + mmss(t + 900); place(parkL, -12.5, 3.2, -8);
    renderer.render(scene, cam);
    return { slots, wash };
  } };
}
