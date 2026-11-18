(function () {
  'use strict';
  // Rhino Pi X1 (QCS8550) material: 7 cameras through VPU / GPU / NPU / CPU (.181, 2026-11-18). Engine: js/core.js (TTEx deck).
  var D = window.DECK, el = D.el, svg = D.svg, css = D.css, rise = D.rise, fade = D.fade, prep = D.prep, draw = D.draw, prog = D.prog, ease = D.ease, clamp = D.clamp, bind = D.bind, L = D.L;
  var C = { acc: '#1a95d6', acc2: '#6cc4f2', ok: '#5fb98a', warn: '#e0a030', grey: '#8a8880', line: '#3a3834', ink: '#f4f2ec', ink2: '#a7a49b', card: '#242220' };
  var MONO = 'ui-monospace,Menlo,Consolas,monospace', SANS = 'system-ui,"Noto Sans KR","Malgun Gothic",sans-serif';
  var T_ = function (parent, x, y, str, o) { o = o || {}; var e = svg('text', { x: x, y: y, fill: o.fill || '#f4f2ec', 'text-anchor': o.anchor || 'start', 'font-family': o.mono ? MONO : SANS, 'font-size': o.size || 24, 'font-weight': o.weight || 500 }, parent); e.textContent = str; return e; };
  L('ui', { ko: { doc: 'Rhino Pi X1', toc: '목차' }, en: { doc: 'Rhino Pi X1', toc: 'Contents' }, uz: { doc: 'Rhino Pi X1', toc: 'Mundarija' } });

  // ───────────────── x1flow: 7 kamera Rhino Pi X1 (QCS8550) ichida (2026-11-18, .181, 내곡 videolari) ─────────────────
  L('x1flow', {
    ko: { t: 'X1: 카메라 7대, 장비 하나', s: 'RTSP 스트림이 장비의 각 부품을 지나는 길 · 내곡 주유소 1080p · 10 fps', cam: 'RTSP · H.265 1080p',
      st1: '디코드', st2: '텐서', st3: '감지', st4: '추적', st5: '크롭', st6: '판독', st7: '기록',
      vpu_d: '비디오 디코더 · qtic2vdec', gpu_d: 'Adreno 740 · OpenCL', npu_d: 'Hexagon · QNN 2.36 · uint8', cpu_d: 'Kryo 6코어 · Python',
      vpu1: 'H.265 1080p 디코드 · 7대 × 10 fps = 70 fps', vpu2: '프레임은 dmabuf에 그대로 (CPU 복사 없음)',
      gpu1: '디코더 버퍼를 직접 읽음 (zero-copy)', gpu2: 'NV12 → 감지 입력 640×640 uint8', gpu3: '금지 구역(Banned)을 회색으로 칠함', gpu4: '번호판용 프레임을 GPU 링에 보관 (0.2초마다)', gpu5: '차량 크롭 → 번호판 모델 입력', gpu6: '번호판 크롭 → 문자 모델 입력',
      npu1: '차량 감지 (det, 5 클래스)', npu2: '번호판 위치 (plate)', npu3: '문자 66 클래스 (char)',
      cpu1: 'NMS · 출력 해석 (0.2–0.4 ms)', cpu2: 'ByteTrack 추적 (차량 ID)', cpu3: '문자 조립 → 번호판 텍스트, 형식 검사', cpu4: '<cam>.jsonl 기록 → gid 프로세스',
      row: '추적 · 번호판', now: '이번 단계', sum_l: '11분 평균', sum_t: '결과', sum1: 'CPU 전체', sum2: 'AI 몫', sum3: '디코드 fps', sum4: 'CPU 최고 온도', ram: 'RAM 3.6 / 15 GB · AI ≈ 1.75 GB (NPU·디코더 버퍼 포함)',
      c0: '<b>카메라 7대</b>의 RTSP 스트림이 X1 장비 하나로 들어옵니다.', c1: '<b>VPU</b>가 디코드하고, 프레임은 dmabuf에 남습니다.', c2: '<b>GPU</b>가 그 버퍼를 직접 읽어 감지 입력을 만듭니다.', c3: '<b>NPU</b>가 차량을 찾습니다.', c4: '<b>CPU</b>는 가벼운 일만 합니다: NMS와 추적.', c5: '다시 <b>GPU</b>: 차량과 번호판을 잘라 모델 입력으로 만듭니다.', c6: '<b>NPU</b>가 번호판과 문자를 읽습니다.', c7: '<b>CPU</b>가 문자를 조립해 <b>jsonl</b>에 씁니다.', c8: '7대 모두 10 fps, <b>CPU 41%</b>, <b>AI 31%</b>.' },
    en: { t: 'X1: 7 cameras, one device', s: 'Where each RTSP stream goes inside the device · Naegok station 1080p · 10 fps', cam: 'RTSP · H.265 1080p',
      st1: 'decode', st2: 'tensor', st3: 'detect', st4: 'track', st5: 'crop', st6: 'read', st7: 'write',
      vpu_d: 'Video decoder · qtic2vdec', gpu_d: 'Adreno 740 · OpenCL', npu_d: 'Hexagon · QNN 2.36 · uint8', cpu_d: 'Kryo, 6 cores · Python',
      vpu1: 'Decodes H.265 1080p · 7 cams × 10 fps = 70 fps', vpu2: 'Frames stay in the dmabuf (no CPU copy)',
      gpu1: 'Reads the decoder buffer directly (zero-copy)', gpu2: 'NV12 → detector input 640×640 uint8', gpu3: 'Paints Banned zones grey', gpu4: 'Keeps the plate frame in a GPU ring (every 0.2 s)', gpu5: 'Car crop → plate model input', gpu6: 'Plate crop → char model input',
      npu1: 'Vehicle detection (det, 5 classes)', npu2: 'Plate box (plate)', npu3: 'Characters, 66 classes (char)',
      cpu1: 'NMS · output decoding (0.2–0.4 ms)', cpu2: 'ByteTrack tracking (car IDs)', cpu3: 'Chars → plate text, format check', cpu4: 'Writes <cam>.jsonl → gid process',
      row: 'tracks · plates', now: 'this step', sum_l: '11-minute average', sum_t: 'Result', sum1: 'CPU total', sum2: 'AI share', sum3: 'Decoded fps', sum4: 'CPU max temp', ram: 'RAM 3.6 / 15 GB · AI ≈ 1.75 GB (incl. NPU / decoder buffers)',
      c0: '<b>Seven cameras</b> stream RTSP into one X1 device.', c1: 'The <b>VPU</b> decodes; the frames stay in the dmabuf.', c2: 'The <b>GPU</b> reads that buffer directly and builds the detector input.', c3: 'The <b>NPU</b> finds the cars.', c4: 'The <b>CPU</b> does only the light work: NMS and tracking.', c5: 'The <b>GPU</b> again: it cuts cars and plates into model inputs.', c6: 'The <b>NPU</b> reads the plate and its characters.', c7: 'The <b>CPU</b> assembles the text and writes the <b>jsonl</b>.', c8: 'All 7 cameras at 10 fps, <b>CPU 41%</b>, <b>AI 31%</b>.' },
    uz: { t: 'X1: 7 kamera, bitta qurilma', s: 'RTSP oqim qurilmaning qaysi qismlaridan o\'tadi · 내곡 주유소 1080p · 10 fps', cam: 'RTSP · H.265 1080p',
      st1: 'dekod', st2: 'tensor', st3: 'aniqlash', st4: 'kuzatish', st5: 'kesish', st6: 'o\'qish', st7: 'yozish',
      vpu_d: 'Video dekoder · qtic2vdec', gpu_d: 'Adreno 740 · OpenCL', npu_d: 'Hexagon · QNN 2.36 · uint8', cpu_d: 'Kryo, 6 yadro · Python',
      vpu1: 'H.265 1080p dekodlash · 7 × 10 fps = 70 fps', vpu2: 'Kadr dmabuf\'da qoladi (CPU nusxalamaydi)',
      gpu1: 'Decoder buferini o\'zi o\'qiydi (zero-copy)', gpu2: 'NV12 → det kirishi 640×640 uint8', gpu3: 'Banned zonalarni kulrangga bo\'yaydi', gpu4: 'Raqam kadrini GPU ring\'da saqlaydi (har 0.2 s)', gpu5: 'Mashina kesimi → raqam modeli kirishi', gpu6: 'Raqam kesimi → belgi modeli kirishi',
      npu1: 'Mashina aniqlash (det, 5 sinf)', npu2: 'Raqam joyi (plate)', npu3: 'Belgilar, 66 sinf (char)',
      cpu1: 'NMS · natijani o\'qish (0.2–0.4 ms)', cpu2: 'ByteTrack kuzatish (mashina ID)', cpu3: 'Belgilar → raqam matni, format tekshiruvi', cpu4: '<cam>.jsonl yozadi → gid jarayoni',
      row: 'track · raqam', now: 'shu qadam', sum_l: '11 daqiqa o\'rtachasi', sum_t: 'Natija', sum1: 'CPU jami', sum2: 'AI ulushi', sum3: 'Dekod fps', sum4: 'CPU eng yuqori harorat', ram: 'RAM 3.6 / 15 GB · AI ≈ 1.75 GB (NPU / dekoder buferlari bilan)',
      c0: '<b>7 ta kamera</b>ning RTSP oqimi bitta X1 qurilmaga kiradi.', c1: '<b>VPU</b> dekodlaydi, kadr dmabuf\'da qoladi.', c2: '<b>GPU</b> o\'sha buferni o\'zi o\'qib, det kirishini yasaydi.', c3: '<b>NPU</b> mashinalarni topadi.', c4: '<b>CPU</b> faqat yengil ish qiladi: NMS va kuzatish.', c5: 'Yana <b>GPU</b>: mashina va raqamni kesib, model kirishiga aylantiradi.', c6: '<b>NPU</b> raqam va belgilarni o\'qiydi.', c7: '<b>CPU</b> belgilarni yig\'ib, <b>jsonl</b>ga yozadi.', c8: '7 kameraning hammasi 10 fps\'da, <b>CPU 41%</b>, <b>AI 31%</b>.' }
  });
  var XC = { vpu: '#e8c35a', gpu: '#5fc4a8', npu: '#9d8ff2', cpu: '#e59a5c', hot: '#e0a070', dim: '#3a3834', ok: '#5fb98a', grey: '#8a8880', warn: '#e0a030' };
  var XCAMS = ['cam1', 'cam2', 'cam6', 'cam10', 'cam12', 'cam14', 'cam15'];
  var XPARTS = { vpu: { y: 220, h: 118, n: 2, m: '70 fps' }, gpu: { y: 352, h: 226, n: 6, m: '2–5 %' }, npu: { y: 592, h: 150, n: 3, m: '~2.8 ms' }, cpu: { y: 756, h: 166, n: 4, m: 'AI 31 %' } };
  var XSTEPS = [['vpu', [1, 2]], ['gpu', [1, 2, 3]], ['npu', [1]], ['cpu', [1, 2]], ['gpu', [4, 5, 6]], ['npu', [2, 3]], ['cpu', [3, 4]]];
  var XT0 = 4, XDT = 3, XCX = 470, XCW = 600;
  var xmid = function (k) { return XPARTS[k].y + XPARTS[k].h / 2; };
  D.page({ id: 'x1flow', dur: 30, caps: [[.8, 'x1flow.c0'], [4, 'x1flow.c1'], [7, 'x1flow.c2'], [10, 'x1flow.c3'], [13, 'x1flow.c4'], [16, 'x1flow.c5'], [19, 'x1flow.c6'], [22, 'x1flow.c7'], [25.5, 'x1flow.c8']], setup: function (root, p) {
    p.h = D.head(p, root);
    var s = svg('svg', { width: 1920, height: 1080 }, root); css(s, { position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }); p.s = s;
    // stepper (1..7)
    svg('line', { x1: 1160, y1: 96, x2: 1160 + 6 * 98, y2: 96, stroke: XC.dim, 'stroke-width': 2 }, s);
    p.st = XSTEPS.map(function (st, i) { var cx = 1160 + i * 98, c = svg('circle', { cx: cx, cy: 96, r: 22, fill: '#1b1a19', stroke: XC.dim, 'stroke-width': 2 }, s);
      var n = T_(s, cx, 104, String(i + 1), { anchor: 'middle', size: 22, weight: 700, mono: true, fill: XC.grey });
      var lb = bind(el('div', 'abs', root), 'x1flow.st' + (i + 1)); css(lb, { left: (cx - 50) + 'px', width: '100px', top: '126px', textAlign: 'center', font: '500 16px var(--sans)', color: XC.grey });
      return { c: c, n: n, lb: lb, k: st[0] }; });
    // kameralar
    p.cams = XCAMS.map(function (nm, i) { var y = 230 + i * 84, w = el('div', 'abs', root); css(w, { left: '120px', top: y + 'px', width: '230px', height: '62px', background: C.card, border: '1px solid ' + C.line, borderRadius: '14px', padding: '8px 16px' });
      var a = el('div', '', w, nm); css(a, { font: '600 24px var(--mono)', color: C.ink }); var b = bind(el('div', '', w), 'x1flow.cam'); css(b, { font: '400 15px var(--sans)', color: C.ink2 });
      var path = svg('path', { d: 'M350 ' + (y + 31) + ' C415 ' + (y + 31) + ' 405 ' + xmid('vpu') + ' ' + XCX + ' ' + xmid('vpu'), fill: 'none', stroke: '#4a4741', 'stroke-width': 2 }, s); prep(path);
      var dots = [0, 1].map(function () { return svg('circle', { r: 5, fill: XC.vpu, opacity: 0 }, s); });
      return { w: w, path: path, dots: dots, i: i }; });
    // qurilma qismlari
    p.parts = {};
    Object.keys(XPARTS).forEach(function (k) { var P = XPARTS[k], w = el('div', 'abs', root);
      css(w, { left: XCX + 'px', top: P.y + 'px', width: XCW + 'px', height: P.h + 'px', background: C.card, border: '1.5px solid ' + C.line, borderRadius: '16px', transition: 'border-color .3s, box-shadow .3s' });
      var dot = el('div', 'abs', w); css(dot, { left: '20px', top: '22px', width: '14px', height: '14px', borderRadius: '4px', background: XC[k] });
      var nm = el('div', 'abs', w, k.toUpperCase()); css(nm, { left: '46px', top: '10px', font: '700 30px var(--mono)', color: C.ink });
      var ds = bind(el('div', 'abs', w), 'x1flow.' + k + '_d'); css(ds, { left: '130px', top: '19px', font: '400 18px var(--sans)', color: C.ink2, whiteSpace: 'nowrap' });
      var m = el('div', 'abs', w, P.m); css(m, { right: '18px', top: '14px', font: '600 17px var(--mono)', color: XC[k], border: '1.5px solid ' + XC[k], borderRadius: '999px', padding: '3px 12px', opacity: 0 });
      var rows = []; for (var i = 1; i <= P.n; i++) { var r = el('div', 'abs', w); css(r, { left: '22px', top: (56 + (i - 1) * 27) + 'px', whiteSpace: 'nowrap', opacity: .35 });
        var b = el('span', '', r, String(i)); css(b, { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', font: '700 13px/1 var(--mono)', color: '#1b1a19', background: XC.dim, marginRight: '12px', verticalAlign: 'middle' });
        var tx = bind(el('span', '', r), 'x1flow.' + k + i); css(tx, { font: '400 19px var(--sans)', color: C.ink2, verticalAlign: 'middle' }); rows.push({ r: r, b: b, tx: tx, i: i }); }
      p.parts[k] = { w: w, m: m, rows: rows }; });
    // qadamlar orasidagi yo'llar (o'ngdan pastga; 4 -> 5 CPU dan GPU ga yuqoriga; 7 -> results)
    var R = XCX + XCW, segs = [
      ['vpu', 'gpu', 60], ['gpu', 'npu', 60], ['npu', 'cpu', 60], ['cpu', 'gpu', 100], ['gpu', 'npu', 60], ['npu', 'cpu', 60]];
    p.seg = segs.map(function (g) { var y1 = xmid(g[0]), y2 = xmid(g[1]);
      var d = 'M' + R + ' ' + y1 + ' C' + (R + g[2]) + ' ' + y1 + ' ' + (R + g[2]) + ' ' + y2 + ' ' + R + ' ' + y2;
      var base = svg('path', { d: d, fill: 'none', stroke: '#4a4741', 'stroke-width': 2, 'stroke-dasharray': g[2] > 60 ? '7 7' : '' }, s); base.style.opacity = 0;
      var hot = prep(svg('path', { d: d, fill: 'none', stroke: XC.hot, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, s)); return { base: base, hot: hot }; });
    var d7 = 'M' + R + ' ' + xmid('cpu') + ' C' + (R + 150) + ' ' + xmid('cpu') + ' ' + (R + 70) + ' 372 1210 372';
    p.seg.push({ base: (function () { var b = svg('path', { d: d7, fill: 'none', stroke: '#4a4741', 'stroke-width': 2 }, s); b.style.opacity = 0; return b; })(), hot: prep(svg('path', { d: d7, fill: 'none', stroke: XC.hot, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, s)) });
    p.tok = svg('circle', { r: 10, fill: '#fff', stroke: XC.hot, 'stroke-width': 4, opacity: 0 }, s);
    p.now = el('div', 'abs', root); css(p.now, { font: '600 16px var(--sans)', color: '#2b1e05', background: XC.hot, borderRadius: '999px', padding: '3px 12px', opacity: 0, whiteSpace: 'nowrap' }); bind(p.now, 'x1flow.now');
    // results/<day>/
    p.res = el('div', 'abs', root); css(p.res, { left: '1210px', top: '220px', width: '590px', height: '310px', background: '#1f1e1c', border: '1px solid ' + C.line, borderRadius: '18px', padding: '18px 24px' });
    var rh = el('div', '', p.res, 'results/<day>/'); css(rh, { font: '600 26px var(--mono)', color: C.ink, marginBottom: '10px' });
    p.rrows = XCAMS.map(function (nm) { var r = el('div', '', p.res); css(r, { display: 'flex', alignItems: 'center', gap: '12px', height: '32px', background: '#262421', borderRadius: '8px', padding: '0 14px', marginBottom: '4px', opacity: 0 });
      var dt = el('span', '', r); css(dt, { width: '9px', height: '9px', borderRadius: '50%', background: XC.cpu, display: 'inline-block' });
      var a = el('span', '', r, nm + '.jsonl'); css(a, { font: '500 19px var(--mono)', color: C.ink, flex: '1' }); var b = bind(el('span', '', r), 'x1flow.row'); css(b, { font: '400 15px var(--sans)', color: C.ink2 }); return r; });
    // natija kartasi
    p.sum = el('div', 'abs', root); css(p.sum, { left: '1210px', top: '556px', width: '590px', height: '254px', background: 'rgba(224,160,112,.08)', border: '1.5px solid ' + XC.hot, borderRadius: '18px', padding: '18px 26px', opacity: 0 });
    var sl = bind(el('div', '', p.sum), 'x1flow.sum_l'); css(sl, { font: '500 16px var(--sans)', color: XC.hot, letterSpacing: '.06em' });
    var stt = bind(el('div', '', p.sum), 'x1flow.sum_t'); css(stt, { font: '800 34px var(--sans)', color: C.ink, margin: '2px 0 10px' });
    [['sum1', '41 %'], ['sum2', '31 %'], ['sum3', '69.5 / 70'], ['sum4', '62 °C']].forEach(function (q) { var r = el('div', '', p.sum); css(r, { display: 'flex', justifyContent: 'space-between', font: '400 21px/1.55 var(--sans)', color: C.ink2 });
      bind(el('span', '', r), 'x1flow.' + q[0]); var v = el('span', '', r, q[1]); css(v, { font: '600 21px var(--mono)', color: C.ink }); });
    p.ram = bind(el('div', 'abs', root), 'x1flow.ram'); css(p.ram, { left: '1212px', top: '828px', width: '590px', font: '400 17px/1.5 var(--mono)', color: C.ink2, opacity: 0 });
  }, render: function (t) { var p = this; p.h.render(t);
    var si = t < XT0 ? -1 : Math.min(7, Math.floor((t - XT0) / XDT));
    p.st.forEach(function (st, i) { var on = i === si, done = i < si; st.c.setAttribute('fill', on ? XC.hot : '#1b1a19'); st.c.setAttribute('stroke', on ? XC.hot : done ? XC.hot : XC.dim);
      st.n.setAttribute('fill', on ? '#2b1e05' : done ? XC.hot : XC.grey); st.lb.style.color = on ? C.ink : done ? C.ink2 : XC.grey; st.c.setAttribute('r', on ? 25 : 22); });
    p.cams.forEach(function (c) { rise(c.w, ease.out(prog(t, .9 + c.i * .12, .5)), 14); draw(c.path, ease.out(prog(t, 1.6 + c.i * .1, .8)));
      c.dots.forEach(function (d, j) { if (t < 2.6) { d.setAttribute('opacity', 0); return; } var q = ((t * .62 + c.i * .137 + j * .5) % 1), pt = c.path.getPointAtLength(q * c.path._l); d.setAttribute('cx', pt.x.toFixed(1)); d.setAttribute('cy', pt.y.toFixed(1)); d.setAttribute('opacity', (Math.sin(q * Math.PI) * .95).toFixed(2)); }); });
    var act = si >= 0 && si < 7 ? XSTEPS[si] : null;
    Object.keys(p.parts).forEach(function (k, ki) { var P = p.parts[k]; rise(P.w, ease.out(prog(t, 1.4 + ki * .25, .6)), 18); fade(P.m, ease.out(prog(t, 2.6 + ki * .2, .5)));
      var on = act && act[0] === k; P.w.style.borderColor = on ? XC[k] : C.line; P.w.style.boxShadow = on ? '0 0 0 4px ' + XC[k] + '22' : 'none';
      P.rows.forEach(function (r) { var st = -1; XSTEPS.forEach(function (x, i) { if (x[0] === k && x[1].indexOf(r.i) >= 0) st = i; });
        var cur = st === si, done = st < si && si >= 0; r.r.style.opacity = cur ? 1 : done ? .78 : .35;
        r.b.style.background = cur ? XC[k] : done ? XC[k] + '99' : XC.dim; r.b.textContent = done ? '✓' : String(r.i); r.tx.style.color = cur ? C.ink : C.ink2; }); });
    p.seg.forEach(function (g, i) { var s0 = XT0 + i * XDT + 2.0; g.base.style.opacity = t >= s0 ? .9 : 0; var q = ease.io(prog(t, s0, .95)); draw(g.hot, q); g.hot.style.opacity = t < s0 + 1.6 ? 1 : .0; });
    var tk = null; p.seg.forEach(function (g, i) { var s0 = XT0 + i * XDT + 2.0; if (t >= s0 && t < s0 + .95) tk = { g: g, q: ease.io(prog(t, s0, .95)) }; });
    if (tk) { var pt = tk.g.hot.getPointAtLength(tk.q * tk.g.hot._l); p.tok.setAttribute('cx', pt.x.toFixed(1)); p.tok.setAttribute('cy', pt.y.toFixed(1)); p.tok.setAttribute('opacity', 1); } else p.tok.setAttribute('opacity', 0);
    if (act) { var P = XPARTS[act[0]]; css(p.now, { left: (XCX + XCW - 128) + 'px', top: (P.y - 15) + 'px' }); fade(p.now, ease.out(prog(t, XT0 + si * XDT, .4))); } else fade(p.now, 0);
    rise(p.res, ease.out(prog(t, 2.2, .7)), 18); p.rrows.forEach(function (r, i) { rise(r, ease.out(prog(t, 22.6 + i * .3, .4)), 8); });
    rise(p.sum, ease.out(prog(t, 25.5, .8)), 22); fade(p.ram, ease.out(prog(t, 26.6, .6))); } });
})();
