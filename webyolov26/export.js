// Export page: talks to webyolo-agent on 127.0.0.1:17860 (runs on this PC), which exports best.pt on this PC's GPU
"use strict";
const AGENT = "http://127.0.0.1:17860";
const WHEEL = new URL("agent/webyolo_agent-0.3.0-py3-none-any.whl", location.href).href;
const ZIP = new URL("agent/webyolov26-export.zip", location.href).href;
const $ = (id) => document.getElementById(id);
let agent = null, file = null, job = null, os = /Win/.test(navigator.platform) ? "win" : "linux";

// ---- what the browser itself can tell about the GPU (a hint only; the agent reads the real values)
function browserGpu() {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    const ext = gl && gl.getExtension("WEBGL_debug_renderer_info");
    const r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "";
    const m = r.match(/NVIDIA[^,()]*?(GeForce|RTX|Quadro|Tesla|TITAN|[A-Z]\d{2,4})[^,()]*/i);
    return m ? m[0].replace(/\s+\(0x[0-9a-f]+\)/i, "").trim() : "no NVIDIA GPU visible to the browser (the agent checks the real GPU)";
  } catch (e) { return "unknown"; }
}

// ---- install commands
const CMDS = {
  linux: [["1. PyTorch (CUDA build), once", "pip install torch --index-url https://download.pytorch.org/whl/cu128"],
          ["2. the agent, once", `pip install ${WHEEL}`],
          ["3. start it (every time)", "webyolo-agent"]],
  win: [["1. PyTorch (CUDA build), once", "py -m pip install torch --index-url https://download.pytorch.org/whl/cu128"],
        ["2. the agent, once", `py -m pip install ${WHEEL}`],
        ["3. start it (every time)", "py -m webyolo_agent"]],
};
const OFFLINE = {
  linux: [["1. unzip and go into the folder", "unzip webyolov26-export.zip && cd webyolov26-export"],
          ["2. install, once", "pip install torch --index-url https://download.pytorch.org/whl/cu128\npip install -r requirements.txt"],
          ["3. check the GPU and libraries", "python export.py --info"],
          ["4. export (output: ./exported)", "python export.py --weights /path/to/best.pt"],
          ["5. run the engine", "cd exported\npython run.py --model best.engine --source image.jpg"]],
  win: [["1. unzip and go into the folder", "Expand-Archive webyolov26-export.zip .; cd webyolov26-export"],
        ["2. install, once", "py -m pip install torch --index-url https://download.pytorch.org/whl/cu128\npy -m pip install -r requirements.txt"],
        ["3. check the GPU and libraries", "py export.py --info"],
        ["4. export (output: .\\exported)", "py export.py --weights C:\\path\\to\\best.pt"],
        ["5. run the engine", "cd exported\npy run.py --model best.engine --source image.jpg"]],
};
function renderCmds(box, list) {
  $(box).innerHTML = list.map(([t, c]) => `<p class="note" style="margin:10px 0 0">${t}</p><pre class="cmd">${c}<button>Copy</button></pre>`).join("");
  $(box).querySelectorAll("pre.cmd button").forEach((b) => b.addEventListener("click", () => {
    navigator.clipboard.writeText(b.parentElement.firstChild.textContent).then(() => { b.textContent = "Copied"; setTimeout(() => (b.textContent = "Copy"), 1200); });
  }));
}
function showCmds() {
  renderCmds("cmds", CMDS[os]); renderCmds("cmds2", OFFLINE[os]);
  ["ostabs", "ostabs2"].forEach((t) => $(t).querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.os === os)));
}
["ostabs", "ostabs2"].forEach((t) => $(t).addEventListener("click", (e) => { if (e.target.dataset.os) { os = e.target.dataset.os; showCmds(); } }));

// ---- the two ways: A (agent, on this page) / B (download the export tool)
function setMode(m) {
  $("mode-web").hidden = m !== "web"; $("mode-offline").hidden = m !== "offline";
  $("modes").querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.mode === m));
  history.replaceState(null, "", m === "offline" ? "#offline" : location.pathname + location.search);
}
$("modes").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setMode(b.dataset.mode); });
$("dlzip").addEventListener("click", () => { const a = document.createElement("a"); a.href = ZIP; a.download = "webyolov26-export.zip"; a.click(); });
if (location.hash === "#offline") setMode("offline");

// ---- agent connection (polls until it answers)
async function poll() {
  try {
    const r = await fetch(`${AGENT}/info`, { cache: "no-store" });
    agent = await r.json();
  } catch (e) { agent = null; }
  if (agent) {
    $("astate").innerHTML = `<span class="pill ok">connected</span> v${agent.agent}`;
    $("ainfo").hidden = false; $("install").hidden = true;
    $("i_gpu").textContent = agent.name || agent.error || "?";
    $("i_cc").textContent = agent.compute_capability ? `${agent.compute_capability} (sm_${agent.compute_capability.replace(".", "")})` : "?";
    $("i_drv").textContent = `${agent.driver || "?"} / CUDA ${agent.cuda_driver || "?"}`;
    $("i_trt").innerHTML = agent.tensorrt || '<span style="color:var(--err)">not installed: pip install tensorrt</span>';
    $("i_torch").innerHTML = `${agent.torch || "?"} ` + (agent.torch_cuda ? "(CUDA)" : '<span style="color:var(--err)">(no CUDA: engine check and run.py need the CUDA build)</span>');
  } else {
    $("astate").innerHTML = '<span class="pill err">not running</span>';
    $("ainfo").hidden = true; $("install").hidden = false;
  }
  ready();
  setTimeout(poll, agent ? 10000 : 3000);
}

function ready() { $("go").disabled = !(agent && agent.tensorrt && file) || (job && job.state === "running"); }

// ---- file
function setFile(f) {
  if (!f) return;
  if (!/\.pt$/i.test(f.name)) { $("status").innerHTML = '<span class="err">Choose a .pt file.</span>'; return; }
  file = f;
  $("fname").innerHTML = `<strong>${f.name}</strong> · ${(f.size / 1e6).toFixed(1)} MB`;
  ready();
}
$("file").addEventListener("change", (e) => setFile(e.target.files[0]));
const drop = $("drop");
["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("on"); }));
["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("on"); }));
drop.addEventListener("drop", (e) => setFile(e.dataTransfer.files[0]));

// ---- export
function bar(p) { $("bar").hidden = false; $("bar").firstElementChild.style.width = `${Math.round(p * 100)}%`; }

function upload(f, url) {                       // XHR: upload progress
  return new Promise((ok, bad) => {
    const x = new XMLHttpRequest();
    x.open("POST", url);
    x.setRequestHeader("Content-Type", "application/octet-stream");
    x.upload.onprogress = (e) => e.lengthComputable && bar(0.02 * e.loaded / e.total);
    x.onload = () => (x.status === 200 ? ok(JSON.parse(x.responseText)) : bad(new Error(JSON.parse(x.responseText || "{}").error || x.status)));
    x.onerror = () => bad(new Error("the agent did not answer"));
    x.send(f);
  });
}

async function runExport() {
  $("res").hidden = true; $("log").hidden = false; $("log").textContent = "";
  $("status").textContent = "Uploading to the local agent…"; bar(0);
  try {
    const q = new URLSearchParams({ imgsz: $("imgsz").value, fp16: $("prec").value, name: file.name });
    const { id } = await upload(file, `${AGENT}/export?${q}`);
    job = { id, state: "running" }; ready();
    $("status").textContent = "Exporting on this GPU…";
    while (true) {
      await new Promise((r) => setTimeout(r, 1000));
      job = await (await fetch(`${AGENT}/jobs/${id}`, { cache: "no-store" })).json();
      bar(job.progress);
      $("log").textContent = job.log.join("\n"); $("log").scrollTop = 1e9;
      if (job.state === "done" || job.state === "error") break;
    }
    if (job.state === "error") { $("status").innerHTML = `<span class="err">${job.error}</span>`; return; }
    $("status").innerHTML = '<span class="ok">Done.</span>';
    showResult(job);
  } catch (e) {
    $("status").innerHTML = `<span class="err">${e.message}</span>`;
  } finally { ready(); }
}
$("go").addEventListener("click", runExport);

const DESC = { onnx: "portable: any PC, server or browser", engine: "TensorRT, built for this GPU", zip: "everything in one file",
  "names.json": "class names", "info.json": "export details + check", "run.py": "ready detection script", "README.txt": "how to run" };

function showResult(j) {
  const r = j.result, v = r.verify, info = r.info;
  $("vrows").innerHTML = Object.entries(v).map(([k, m]) => `<tr><td>${k === "onnx" ? "ONNX" : "TensorRT " + info.precision.toUpperCase()}</td>` +
    `<td class="n">${m.ref} / ${m.out}</td><td class="n">${m.matched}</td><td class="n">${m.box_px ?? "–"} px</td>` +
    `<td class="n">${m.score ?? "–"}</td><td><span class="pill ${m.ok ? "ok" : "err"}">${m.ok ? "same" : "differs"}</span>` +
    `${m.ms ? ` · ${m.ms} ms` : ""}</td></tr>`).join("") || '<tr><td colspan="6">no check (onnxruntime / CUDA torch missing)</td></tr>';
  const files = [...r.files].sort((a, b) => b.endsWith(".zip") - a.endsWith(".zip"));   // the zip first
  $("dl").innerHTML = files.map((f) => {
    const ext = f.endsWith(".zip") ? "zip" : f.endsWith(".onnx") ? "onnx" : f.endsWith(".engine") ? "engine" : f;
    return `<button data-f="${f}" class="${ext === "zip" ? "main" : ""}"><b>${f}</b><span>${DESC[ext] || ""}</span></button>`;
  }).join("");
  $("dl").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => download(j.id, b.dataset.f, b)));
  $("enote").textContent = `The engine is for ${info.gpu.name || "this GPU"} (compute ${info.gpu.compute_capability || "?"}) with TensorRT ${info.tensorrt}.`;
  $("test").onclick = () => testInBrowser(j.id, r, info);
  $("res").hidden = false;
}

async function fetchFile(id, f) {
  const r = await fetch(`${AGENT}/jobs/${id}/files/${encodeURIComponent(f)}`);
  if (!r.ok) throw new Error(`download failed (${r.status})`);
  return r.blob();
}

async function download(id, f, btn) {
  const span = btn.querySelector("span"), old = span.textContent;
  span.textContent = "downloading…";
  try {
    const url = URL.createObjectURL(await fetchFile(id, f));
    const a = document.createElement("a"); a.href = url; a.download = f; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    span.textContent = old;
  } catch (e) { span.textContent = e.message; }
}

async function testInBrowser(id, r, info) {
  const onnxName = r.files.find((f) => f.endsWith(".onnx"));
  const [onnx, names] = await Promise.all([fetchFile(id, onnxName).then((b) => b.arrayBuffer()), fetchFile(id, "names.json").then((b) => b.text()).then(JSON.parse)]);
  await ModelStore.put({ onnx, names, imgsz: info.imgsz, label: info.source.replace(/\.pt$/, "") + ` (${names.length} classes)` });
  location.href = "./?model=custom";
}

// ---- start
$("bgpu").textContent = browserGpu();
showCmds();
poll();

// automated check: ?autotest=<url of a .pt> exports it once the agent answers and writes the job as JSON
const autotest = new URLSearchParams(location.search).get("autotest");
if (autotest) {
  (async () => {
    while (!agent) await new Promise((r) => setTimeout(r, 500));
    const b = await (await fetch(autotest)).blob();
    setFile(new File([b], "best.pt"));
    await runExport();
    const pre = document.createElement("pre"); pre.id = "autotest"; pre.hidden = true;
    pre.textContent = JSON.stringify(job); document.body.appendChild(pre);
  })();
}
