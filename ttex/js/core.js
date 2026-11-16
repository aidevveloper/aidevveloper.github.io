/* TTEx deck engine: 1920x1080 sahna, har sahifa t (soniya) ning sof funksiyasi. Audio yo'q. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var clamp = function (x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a == null ? 0 : a, x)); };
  var prog = function (t, s, d) { return clamp((t - s) / d); };
  var ease = { out: function (p) { return 1 - Math.pow(1 - p, 3); }, io: function (p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; } };
  function el(tag, cls, parent, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); if (text != null) e.textContent = text; return e; }
  function svg(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function css(e, o) { for (var k in o) e.style[k] = o[k]; return e; }
  function rise(e, p, dy) { e.style.opacity = p.toFixed(3); e.style.transform = 'translateY(' + ((1 - p) * (dy == null ? 20 : dy)).toFixed(1) + 'px)'; }
  function fade(e, p) { e.style.opacity = p.toFixed(3); }
  function prep(p) { var l = p.getTotalLength(); p._l = l; p.style.strokeDasharray = l + ' ' + (l + 2); p.style.strokeDashoffset = l; return p; }
  function draw(p, v) { p.style.strokeDashoffset = (p._l * (1 - clamp(v))).toFixed(1); }

  var pages = [], cur = -1, t = 0, playing = true, auto = true, lang = 'ko', fixed = null, tx = [], DICT = { ko: {}, en: {}, uz: {} };
  var $ = function (id) { return document.getElementById(id); };
  var stage, capEl, segs, cnt;

  function L(id, d) { ['ko', 'en', 'uz'].forEach(function (l) { var o = d[l] || {}; for (var k in o) DICT[l][id + '.' + k] = o[k]; }); }
  function T(key) { return DICT[lang][key] != null ? DICT[lang][key] : (DICT.en[key] != null ? DICT.en[key] : key); }
  function bind(e, key, html) { tx.push([e, key, !!html]); e[html ? 'innerHTML' : 'textContent'] = T(key); return e; }

  function applyLang(l, save) {
    lang = l; document.documentElement.lang = l;
    tx.forEach(function (x) { x[0][x[2] ? 'innerHTML' : 'textContent'] = T(x[1]); });
    Array.prototype.forEach.call(document.querySelectorAll('#lang button'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-l') === l ? 'true' : 'false'); });
    document.title = T('ui.doc'); capEl._h = null; buildToc();
    if (save) { try { localStorage.setItem('ttexLang', l); } catch (e) {} }
  }

  function head(p, root) {
    var h = bind(el('div', 'h1', root), p.id + '.t'), s = bind(el('div', 'h2', root), p.id + '.s');
    return { render: function (tt) { rise(h, ease.out(prog(tt, .15, .8)), 26); rise(s, ease.out(prog(tt, .7, .7)), 16); } };
  }
  // terminal oynasi + yozib ko'rsatish
  function term(root, o) {
    var w = el('div', 'term abs', root); css(w, { left: o.x + 'px', top: o.y + 'px', width: o.w + 'px', height: o.h + 'px' });
    var b = el('div', 'bar', w); el('i', '', b); el('i', '', b); el('i', '', b); el('span', '', b, o.title || '');
    var body = el('div', 'body', w); var lines = o.lines.map(function (ln) {
      var d = el('span', 'ln', body), c = el('span', 'c', d), m = null;
      if (ln.cm) { m = el('span', 'cm ' + (ln.cls || ''), d, ln.cm); m.style.opacity = 0; }
      return { d: d, c: c, m: m, code: ln.code || '', at: ln.at, cps: ln.cps || 30 };
    });
    return { w: w, lines: lines, render: function (tt) {
      var caretOn = null;
      lines.forEach(function (l) {
        var n = clamp((tt - l.at) * l.cps, 0, l.code.length) | 0, done = n >= l.code.length && tt >= l.at;
        l.c.textContent = tt >= l.at ? l.code.slice(0, n) : '';
        if (tt >= l.at && !done) caretOn = l;
        if (l.m) fade(l.m, done ? ease.out(prog(tt, l.at + l.code.length / l.cps, .4)) : 0);
      });
      lines.forEach(function (l) { var c = l.d.querySelector('.caret'); if (c) c.remove(); });
      var last = null; lines.forEach(function (l) { if (tt >= l.at) last = l; });
      if (last && (caretOn || Math.floor(tt * 2) % 2 === 0)) { var k = el('span', 'caret'); last.c.appendChild(k); }
    } };
  }

  function page(p) {
    p.root = el('div', 'pg', $('stage')); p.setup(p.root, p); pages.push(p);
  }

  function show(i) {
    if (i < 0 || i >= pages.length) return;
    if (cur >= 0) pages[cur].root.classList.remove('on');
    cur = i; t = 0; pages[i].root.classList.add('on'); capEl._h = null;
    try { history.replaceState(null, '', '#' + pages[i].id); } catch (e) {}
    cnt.textContent = ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + pages.length).slice(-2);
    Array.prototype.forEach.call(segs.children, function (b, j) { b.className = j < i ? 'done' : ''; b.firstChild.style.width = ''; });
    document.querySelectorAll('#toc a').forEach(function (a, j) { a.classList.toggle('cur', j === i); });
  }

  function renderCap(p, tt) {
    var c = null, cs = -1; (p.caps || []).forEach(function (x) { if (tt >= x[0]) { c = x[1]; cs = x[0]; } });
    if (c) { var h = T(c); if (capEl._h !== h) { capEl.innerHTML = h; capEl._h = h; } rise(capEl, ease.out(prog(tt, cs, .5)), 10); } else capEl.style.opacity = 0;
  }

  function buildToc() {
    var box = $('toc').querySelector('.in'); box.innerHTML = '';
    el('h2', '', box, T('ui.toc'));
    pages.forEach(function (p, i) {
      var a = el('a', i === cur ? 'cur' : '', box); el('em', '', a, ('0' + (i + 1)).slice(-2)); el('span', '', a, T(p.id + '.t'));
      a.onclick = function () { closeToc(); show(i); };
    });
  }
  function closeToc() { $('toc').classList.remove('on'); }
  function toggleToc() { $('toc').classList.toggle('on'); }

  function fit() { var k = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = 'scale(' + k + ') translate(-50%,-50%)'; }

  var last = null;
  function frame(now) {
    if (last == null) last = now;
    var dt = (now - last) / 1000; last = now;
    var p = pages[cur];
    if (fixed == null && playing) {
      t += dt;
      if (t >= p.dur + 1.5) { if (auto && cur < pages.length - 1) show(cur + 1); else t = p.dur + 1.5; }
    }
    var tt = fixed != null ? fixed : Math.min(t, p.dur + 1.5);
    p.render(tt); renderCap(p, tt);
    Array.prototype.forEach.call(segs.children, function (b, j) { if (j === cur) b.firstChild.style.width = (clamp(tt / p.dur) * 100).toFixed(1) + '%'; });
    requestAnimationFrame(frame);
  }

  function init() {
    stage = $('stage'); capEl = $('cap'); segs = $('segs'); cnt = $('cnt');
    try { var sv = localStorage.getItem('ttexLang'); if (sv && DICT[sv]) lang = sv; } catch (e) {}
    var q = new URLSearchParams(location.search);
    if (q.get('lang') && DICT[q.get('lang')]) lang = q.get('lang');
    pages.forEach(function () { el('b', '', segs).appendChild(el('i')); });
    Array.prototype.forEach.call(segs.children, function (b, j) { b.onclick = function () { show(j); }; });
    $('prev').onclick = function () { show(cur - 1); }; $('next').onclick = function () { show(cur + 1); };
    $('play').onclick = tglPlay; $('tocb').onclick = toggleToc; $('toc').onclick = function (e) { if (e.target === $('toc')) closeToc(); };
    $('autob').onclick = function () { auto = !auto; this.setAttribute('aria-pressed', auto ? 'true' : 'false'); };
    $('fs').onclick = function () { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); };
    Array.prototype.forEach.call(document.querySelectorAll('#lang button'), function (b) { b.onclick = function () { applyLang(b.getAttribute('data-l'), true); }; });
    function tglPlay() { playing = !playing; $('play').innerHTML = playing ? '&#10074;&#10074;' : '&#9654;'; }
    addEventListener('keydown', function (e) {
      if (e.code === 'Space') { e.preventDefault(); tglPlay(); }
      else if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 't' || e.key === 'T') toggleToc(); else if (e.key === 'Escape') closeToc();
      else if (e.key === 'r' || e.key === 'R') { t = 0; } else if (e.key === 'f' || e.key === 'F') $('fs').onclick(); else if (e.key === 'a' || e.key === 'A') $('autob').onclick();
    });
    addEventListener('resize', fit); fit();
    applyLang(lang, false);
    var start = 0, h = location.hash.replace('#', '');
    pages.forEach(function (p, i) { if (p.id === h) start = i; });
    if (q.has('p')) start = clamp(parseInt(q.get('p'), 10) - 1, 0, pages.length - 1);
    if (q.has('t')) fixed = parseFloat(q.get('t'));
    show(start); requestAnimationFrame(frame);
  }

  window.DECK = { page: page, L: L, T: T, bind: bind, head: head, term: term, el: el, svg: svg, css: css, rise: rise, fade: fade, prep: prep, draw: draw, prog: prog, ease: ease, clamp: clamp, init: init };
})();
