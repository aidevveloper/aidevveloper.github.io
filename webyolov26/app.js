// YOLOv26-n in the browser: same pre/post-processing as the PyTorch repo's test (utils/dataset.py resize, augment=False)
//   letterbox to 640x640: scale down only (r <= 1), black border, RGB, 0..1, NCHW float32
//   output [1, 300, 6] = x1, y1, x2, y2 (letterbox pixels), score, class id; already top-k sorted, no NMS needed
"use strict";
let SIZE = 640;
const MODEL_URL = "model/best.onnx";
const EXAMPLES = ["coco_000000162858.jpg", "coco_000000087144.jpg", "coco_000000371749.jpg", "coco_000000429109.jpg"];
let NAMES = ["person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light",
  "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear",
  "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball",
  "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
  "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza",
  "donut", "cake", "chair", "couch", "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote",
  "keyboard", "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors",
  "teddy bear", "hair drier", "toothbrush"];
// fixed colour per class: a class keeps its colour in every image (20 well-separated colours, class id mod 20)
const PALETTE = ["#e6194b", "#3cb44b", "#4363d8", "#f58231", "#911eb4", "#0fa3b1", "#f032e6", "#7cb518", "#d4a017", "#008080",
  "#9a6324", "#800000", "#2f9e44", "#808000", "#000075", "#c2185b", "#5c6bc0", "#ef6c00", "#00897b", "#6d4c41"];
const color = (c) => PALETTE[c % PALETTE.length];

const $ = (id) => document.getElementById(id);
const out = $("out"), octx = out.getContext("2d");
const lb = document.createElement("canvas"); lb.width = lb.height = SIZE;
const lctx = lb.getContext("2d", { willReadFrequently: true });
let session = null, backend = "", current = null, lastDets = [], busy = false, stream = null;

function setStatus(html, cls) { $("status").innerHTML = cls ? `<span class="${cls}">${html}</span>` : html; }

async function loadModel() {
  ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
  let model = MODEL_URL;
  if (new URLSearchParams(location.search).get("model") === "custom") {       // a model converted on the Convert page
    const m = await ModelStore.get().catch(() => null);
    if (!m) { setStatus("No converted model in this browser. Convert one first.", "err"); return; }
    model = new Uint8Array(m.onnx); NAMES = m.names; SIZE = m.imgsz;
    lb.width = lb.height = SIZE;
    $("mname").innerHTML = `${m.label}, ${SIZE}×${SIZE} · <a href="./">default model</a>`;
  }
  const tries = navigator.gpu ? ["webgpu", "wasm"] : ["wasm"];
  for (const ep of tries) {
    try {
      session = await ort.InferenceSession.create(model, { executionProviders: [ep], graphOptimizationLevel: "all" });
      backend = ep === "webgpu" ? "WebGPU" : "WebAssembly (CPU)";
      // warm-up, and a check that this backend really runs the graph
      await session.run({ [session.inputNames[0]]: new ort.Tensor("float32", new Float32Array(3 * SIZE * SIZE), [1, 3, SIZE, SIZE]) });
      break;
    } catch (e) {
      console.warn(`backend ${ep} failed`, e);
      session = null;
    }
  }
  if (!session) { setStatus("The model could not be loaded in this browser.", "err"); return; }
  $("be").textContent = backend;
  setStatus("Model ready. Choose an image.", "ok");
  window.__ready = true;
}

function letterbox(src, w, h) {
  const r = Math.min(SIZE / h, SIZE / w, 1);                    // scale down only, as in the PyTorch test
  const nw = Math.round(w * r), nh = Math.round(h * r);
  const dw = (SIZE - nw) / 2, dh = (SIZE - nh) / 2;
  const left = Math.round(dw - 0.1), top = Math.round(dh - 0.1);
  lctx.fillStyle = "#000"; lctx.fillRect(0, 0, SIZE, SIZE);
  lctx.imageSmoothingEnabled = true; lctx.imageSmoothingQuality = "medium";
  lctx.drawImage(src, 0, 0, w, h, left, top, nw, nh);
  const px = lctx.getImageData(0, 0, SIZE, SIZE).data, n = SIZE * SIZE;
  const t = new Float32Array(3 * n);
  for (let i = 0, j = 0; i < n; i++, j += 4) {
    t[i] = px[j] / 255; t[n + i] = px[j + 1] / 255; t[2 * n + i] = px[j + 2] / 255;
  }
  return { tensor: new ort.Tensor("float32", t, [1, 3, SIZE, SIZE]), r, left, top };
}

async function detect(src, w, h) {
  const lb_ = letterbox(src, w, h);
  const t0 = performance.now();
  const res = await session.run({ [session.inputNames[0]]: lb_.tensor });
  const ms = performance.now() - t0;
  const y = res[session.outputNames[0]].data;                    // 300 x 6
  const dets = [];
  for (let k = 0; k < y.length / 6; k++) {
    const o = k * 6, s = y[o + 4];
    if (s < 0.05) break;                                          // rows are sorted by score
    const cl = (v, m) => Math.max(0, Math.min(m, v));
    dets.push({
      x1: cl((y[o] - lb_.left) / lb_.r, w), y1: cl((y[o + 1] - lb_.top) / lb_.r, h),
      x2: cl((y[o + 2] - lb_.left) / lb_.r, w), y2: cl((y[o + 3] - lb_.top) / lb_.r, h),
      score: s, cls: Math.round(y[o + 5]),
    });
  }
  return { dets, ms };
}

function draw(src, w, h, dets) {
  out.width = w; out.height = h;
  octx.drawImage(src, 0, 0, w, h);
  const th = +$("th").value, lw = Math.max(2, Math.round(Math.max(w, h) / 400)), fs = Math.max(12, Math.round(Math.max(w, h) / 50));
  octx.font = `600 ${fs}px system-ui, sans-serif`; octx.textBaseline = "top";
  const shown = dets.filter((d) => d.score >= th);
  for (const d of shown) {
    const c = color(d.cls);
    octx.strokeStyle = c; octx.lineWidth = lw;
    octx.strokeRect(d.x1, d.y1, d.x2 - d.x1, d.y2 - d.y1);
    const label = `${NAMES[d.cls]} ${d.score.toFixed(2)}`, tw = octx.measureText(label).width + 8, tht = fs + 6;
    const ly = d.y1 - tht >= 0 ? d.y1 - tht : d.y1;
    const lx = Math.max(0, Math.min(d.x1 - lw / 2, w - tw));      // keep the label inside the image
    octx.fillStyle = c; octx.fillRect(lx, ly, tw, tht);
    octx.fillStyle = "#fff"; octx.fillText(label, lx + 4, ly + 3);
  }
  return shown;
}

function table(shown) {
  $("rows").innerHTML = shown.map((d, i) => `<tr><td>${i + 1}</td><td><span class="sw" style="background:${color(d.cls)}"></span>${NAMES[d.cls]}</td>` +
    `<td class="n">${d.score.toFixed(3)}</td><td class="n">${d.x1.toFixed(0)}</td><td class="n">${d.y1.toFixed(0)}</td>` +
    `<td class="n">${d.x2.toFixed(0)}</td><td class="n">${d.y2.toFixed(0)}</td></tr>`).join("");
  $("tw").hidden = shown.length === 0;
  const cnt = {};
  shown.forEach((d) => (cnt[NAMES[d.cls]] = (cnt[NAMES[d.cls]] || 0) + 1));
  $("summary").textContent = shown.length
    ? `${shown.length} object${shown.length > 1 ? "s" : ""}: ` + Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v} ${k}`).join(", ")
    : "No objects above the threshold.";
}

function show(src, w, h, dets) {
  $("ph").hidden = true; out.hidden = false;
  current = { src, w, h }; lastDets = dets;
  table(draw(src, w, h, dets));
}

async function runImage(img) {
  if (!session || busy) return;
  stopCam();
  busy = true;
  try {
    const w = img.naturalWidth, h = img.naturalHeight;
    const { dets, ms } = await detect(img, w, h);
    $("ms").textContent = `${ms.toFixed(1)} ms`;
    $("sz").textContent = `${w}×${h}`;
    show(img, w, h, dets);
    window.__result = { n: dets.filter((d) => d.score >= +$("th").value).length, dets, ms, backend };
  } catch (e) {
    console.error(e); setStatus("Inference failed: " + e.message, "err");
  } finally { busy = false; }
}

function loadUrl(url) {
  const img = new Image();
  img.onload = () => runImage(img);
  img.onerror = () => setStatus("This file could not be read as an image.", "err");
  img.src = url;
}

// camera: one detection per animation frame, as fast as the backend allows
async function startCam() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 } }, audio: false });
  } catch (e) { setStatus("Camera not available: " + e.message, "err"); return; }
  const v = $("video"); v.srcObject = stream; await v.play();
  $("cam").textContent = "Stop camera";
  const loop = async () => {
    if (!stream) return;
    if (!busy && v.videoWidth) {
      busy = true;
      try {
        const { dets, ms } = await detect(v, v.videoWidth, v.videoHeight);
        $("ms").textContent = `${ms.toFixed(1)} ms (${(1000 / ms).toFixed(0)} fps max)`;
        $("sz").textContent = `${v.videoWidth}×${v.videoHeight} (camera)`;
        show(v, v.videoWidth, v.videoHeight, dets);
      } finally { busy = false; }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
function stopCam() {
  if (!stream) return;
  stream.getTracks().forEach((t) => t.stop()); stream = null;
  $("cam").textContent = "Start camera";
}

// UI
$("th").addEventListener("input", () => {
  $("thv").textContent = (+$("th").value).toFixed(2);
  if (current && !stream) table(draw(current.src, current.w, current.h, lastDets));
});
$("file").addEventListener("change", (e) => { const f = e.target.files[0]; if (f) loadUrl(URL.createObjectURL(f)); e.target.value = ""; });
const drop = $("drop");
["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("on"); }));
["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("on"); }));
drop.addEventListener("drop", (e) => { const f = e.dataTransfer.files[0]; if (f) loadUrl(URL.createObjectURL(f)); });
$("cam").addEventListener("click", () => (stream ? stopCam() : session && startCam()));
for (const name of EXAMPLES) {
  const b = document.createElement("button"); b.title = name; b.setAttribute("aria-label", `Example ${name}`);
  b.innerHTML = `<img src="examples/${name}" alt="" loading="lazy">`;
  b.addEventListener("click", () => loadUrl(`examples/${name}`));
  $("examples").appendChild(b);
}
// automated check: ?autotest=examples/<file> runs that image once the model is ready and writes the raw result as JSON
const autotest = new URLSearchParams(location.search).get("autotest");
loadModel().then(async () => {
  if (!autotest || !session) return;
  const img = new Image(); img.src = autotest; await img.decode();
  await runImage(img);
  const pre = document.createElement("pre"); pre.id = "autotest"; pre.hidden = true;
  pre.textContent = JSON.stringify(window.__result); document.body.appendChild(pre);
});
