(function () {
  'use strict';
  var D = window.DECK, el = D.el, svg = D.svg, css = D.css, rise = D.rise, fade = D.fade, prep = D.prep, draw = D.draw, prog = D.prog, ease = D.ease, clamp = D.clamp, bind = D.bind, L = D.L;
  var C = { acc: '#1a95d6', acc2: '#6cc4f2', ok: '#5fb98a', warn: '#e0a030', grey: '#8a8880', line: '#3a3834', ink: '#f4f2ec', ink2: '#a7a49b', card: '#242220' };

  // ───────────────── tarjimalar ─────────────────
  L('ui', { ko: { doc: 'TTEx AI Work Briefings', toc: '목차' }, en: { doc: 'TTEx AI Work Briefings', toc: 'Contents' }, uz: { doc: 'TTEx AI Work Briefings', toc: 'Mundarija' } });
  L('p01', {
    ko: { t: '하나의 코드, 여러 스테이션', s: '읽고 설정하고 실행한다', q: '“모든 스테이션의 AI 서비스를 위한 단일 소스. 코드는 한 곳에 두고, 각 스테이션에는 설정 폴더만 둔다.”', term: '터미널', ph: '코드베이스', pd: '프로젝트를 이루는 소스 코드 전체',
      c1: '<b>터미널</b>에서 하나의 코드베이스로 작업합니다.', c2: '<b>core/</b>에 AI 코드: 감지, 추적, 번호판, 구역, 슬롯.', c3: '<b>sites/</b>에는 스테이션별 설정과 overlay만 있습니다.', c4: '코드는 한 곳에, 차이는 <b>sites/</b> 안에만 있습니다.' },
    en: { t: 'One codebase, many stations', s: 'Reads, configures, deploys', q: '“A single source for the AI services at every station. The code lives in one place; each station only gets a config folder.”', term: 'Terminal', ph: 'Codebase', pd: 'All the source code that makes up the project',
      c1: 'Work from the <b>terminal</b> on a single codebase.', c2: 'AI code lives in <b>core/</b>: detect, track, plates, zones, slots.', c3: '<b>sites/</b> holds only each station\'s config and overlay.', c4: 'One codebase; differences live only inside <b>sites/</b>.' },
    uz: { t: 'Bitta kod, ko\'p stansiya', s: 'O\'qiydi, sozlaydi, ishga tushiradi', q: '“Barcha stansiyalardagi AI servislar uchun yagona source. Kod bitta joyda turadi, har bir stansiya faqat config papkasi.”', term: 'Terminal', ph: 'Kod bazasi', pd: 'Loyihani tashkil etuvchi barcha manba kodi',
      c1: '<b>Terminal</b>dan yagona kod bazasi bilan ishlanadi.', c2: '<b>core/</b> da AI kodi: aniqlash, kuzatish, raqam, zona, slot.', c3: '<b>sites/</b> da har bir stansiya faqat config va overlay.', c4: 'Kod bitta joyda, farq faqat <b>sites/</b> ichida.' }
  });
  L('p02', {
    ko: { t: '사용 방법: ttex_ai.run()', s: '앱 이름으로 호출한다', cli: 'CLI에서도 동일', note: '왜 <code>ttex_ai.station()</code>이 아닌가요? <code>ttex_ai.station</code>은 스테이션 서버 API 클라이언트 모듈이라, 앱은 <code>run()</code>으로 호출합니다.',
      c1: '설정은 한 번만 불러옵니다.', c2: '앱마다 <b>run()</b> 하나: station과 carwash는 지금 동작합니다.', c3: '<b>human</b>과 <b>safety</b>는 아직 이전되지 않아 오류가 납니다.' },
    en: { t: 'Usage: ttex_ai.run()', s: 'Call an app by its name', cli: 'Same from the CLI', note: 'Why not <code>ttex_ai.station()</code>? <code>ttex_ai.station</code> is the station-server API client module, so apps are called through <code>run()</code>.',
      c1: 'Load the config once.', c2: 'One <b>run()</b> per app: station and carwash work today.', c3: '<b>human</b> and <b>safety</b> are not ported yet, so they raise an error.' },
    uz: { t: 'Ishlatish: ttex_ai.run()', s: 'App nomi bilan chaqiriladi', cli: 'CLI\'da xuddi shu', note: 'Nega <code>ttex_ai.station()</code> emas? <code>ttex_ai.station</code> station server API client\'ining moduli, shuning uchun app\'lar <code>run()</code> orqali chaqiriladi.',
      c1: 'Config bir marta yuklanadi.', c2: 'Har app uchun bitta <b>run()</b>: station va carwash hozir ishlaydi.', c3: '<b>human</b> va <b>safety</b> hali ko\'chirilmagan, shuning uchun xato beradi.' }
  });
  L('p03', {
    ko: { t: '네 가지 앱', s: '하나의 core 위에서 도는 네 서비스', d1: '어느 슬롯에 어떤 번호판의 차가 있는지', d2: '세차장에 들어간 차와 출구 연결', d3: '사람 구역', d4: '화재, 연기, 낙상', b1: '운영 중', b2: '섀도 모드', b3: '이전 예정', b4: '이전 예정',
      c1: '<b>station</b>과 <b>carwash</b>는 지금 ttex_ai 안에서 동작합니다.', c2: '<b>human</b>과 <b>safety</b>는 아직 legacy 변형으로 돌아갑니다.' },
    en: { t: 'Four apps', s: 'Four services on one core', d1: 'Who stands in which slot, with which plate', d2: 'Which car entered the wash, and did it leave', d3: 'People zones', d4: 'Fire, smoke, falls', b1: 'live', b2: 'shadow mode', b3: 'not ported yet', b4: 'not ported yet',
      c1: '<b>station</b> and <b>carwash</b> run inside ttex_ai today.', c2: '<b>human</b> and <b>safety</b> still run from the legacy variant.' },
    uz: { t: 'To\'rtta app', s: 'Bitta core ustida to\'rtta servis', d1: 'Slot-N da kim va qaysi raqam bilan turibdi', d2: 'Moykaga kirgan mashina va uning chiqishi', d3: 'Odamlar zonasi', d4: 'Yong\'in, tutun, yiqilish', b1: 'ishlayapti', b2: 'shadow rejim', b3: 'hali ko\'chirilmagan', b4: 'hali ko\'chirilmagan',
      c1: '<b>station</b> va <b>carwash</b> hozir ttex_ai ichida ishlaydi.', c2: '<b>human</b> va <b>safety</b> hali eski (legacy) variantdan ishlab turibdi.' }
  });
  L('p04', {
    ko: { t: 'station: 카메라에서 슬롯까지', s: '두 프로세스: cams와 gid', l1: 'cams: 카메라 그룹마다 GPU 프로세스 하나', l2: 'gid: jsonl을 읽음, GPU 불필요', d1: '최신 프레임', d2: '차량 (.engine)', d3: 'ByteTrack ID', d4: '≥100 px, 0.2초마다', d5: 'results/<day>/', d6: '파일을 따라 읽음', d7: '카메라 간 통합', d8: '번호판 투표', d9: '1초마다', d10: '체류 1회 = 에피소드 1개',
      c1: '<b>cams</b>: 프레임 → 감지 → 추적 → 번호판 판독 → jsonl.', c2: '<b>gid</b>: jsonl → 글로벌 ID → 번호판 투표 → gid_slots.json.' },
    en: { t: 'station: from camera to slot', s: 'Two processes: cams and gid', l1: 'cams: one GPU process per camera group', l2: 'gid: tails the jsonl, no GPU needed', d1: 'newest frame', d2: 'vehicles (.engine)', d3: 'ByteTrack ID', d4: '≥100 px, every 0.2 s', d5: 'results/<day>/', d6: 'tails the file', d7: 'fuses the cameras', d8: 'plate vote', d9: 'every 1 s', d10: 'one stay = one episode',
      c1: '<b>cams</b>: frame → detect → track → plate read → jsonl.', c2: '<b>gid</b>: jsonl → global ID → plate vote → gid_slots.json.' },
    uz: { t: 'station: kameradan slotgacha', s: 'Ikki jarayon: cams va gid', l1: 'cams: har kamera guruhiga bitta GPU jarayon', l2: 'gid: jsonl\'ni o\'qiydi, GPU kerak emas', d1: 'so\'nggi kadr', d2: 'mashina (.engine)', d3: 'ByteTrack ID', d4: '≥100 px, har 0.2 s', d5: 'results/<day>/', d6: 'faylni kuzatadi', d7: 'kameralar birlashadi', d8: 'raqamga ovoz', d9: 'har 1 s', d10: 'turish = 1 epizod',
      c1: '<b>cams</b>: kadr → aniqlash → kuzatish → raqam o\'qish → jsonl.', c2: '<b>gid</b>: jsonl → global ID → raqam ovozi → gid_slots.json.' }
  });
  L('p05', {
    ko: { t: 'carwash: 입구와 출구', s: '두 구역이 한 대의 차를 연결한다', zin: '결제 구역', zout: '세차장 출구', dw: '구역 체류', note: '<code>send: false</code>(섀도, 기본값)에서는 스테이션으로 아무것도 보내지 않고 <code>events.jsonl</code>에만 기록합니다.',
      c1: '차량이 <b>helper_entry</b>에 <b>min_in_zone_s</b> 이상 머물면 방문(visit)입니다.', c2: '<b>helper_exit</b>을 지나면 같은 번호판으로 방문이 종료됩니다.' },
    en: { t: 'carwash: entry and exit', s: 'Two zones link one car', zin: 'payment pad', zout: 'wash exit', dw: 'dwell in zone', note: '<code>send: false</code> (shadow, the default) sends nothing to the station; everything goes to <code>events.jsonl</code>.',
      c1: 'A car that stays in <b>helper_entry</b> for <b>min_in_zone_s</b> is a visit.', c2: 'Passing <b>helper_exit</b> closes the visit with the same plate.' },
    uz: { t: 'carwash: kirish va chiqish', s: 'Ikki zona bitta mashinani bog\'laydi', zin: 'to\'lov maydoni', zout: 'moyka chiqishi', dw: 'zonada turish', note: '<code>send: false</code> (shadow, default) rejimda station\'ga hech narsa yuborilmaydi, hammasi <code>events.jsonl</code> ga yoziladi.',
      c1: 'Mashina <b>helper_entry</b> da <b>min_in_zone_s</b> tursa, bu tashrif (visit).', c2: '<b>helper_exit</b> dan o\'tganda tashrif o\'sha raqam bilan yopiladi.' }
  });
  L('p06', {
    ko: { t: 'station.yaml', s: '스테이션마다 설정 파일 하나', k1: '파일 하나', k1d: '스테이션 PC마다 station.yaml 하나', k2: '비밀은 git에 없음', k2d: '<code>${CAM_PASS}</code>로 쓰고 값은 스테이션의 site.env에만 둡니다', k3: '.engine만', k3d: '모델은 스테이션 GPU에서 <code>ttex-ai engine</code>으로 빌드', c1: '같은 코드, 스테이션마다 다른 <b>station.yaml</b>.' },
    en: { t: 'station.yaml', s: 'One config per station', k1: 'One file', k1d: 'One station.yaml per station PC', k2: 'No secrets in git', k2d: 'Written as <code>${CAM_PASS}</code>; the value lives in the station\'s site.env', k3: '.engine only', k3d: 'Models are built on the station GPU with <code>ttex-ai engine</code>', c1: 'Same code, a different <b>station.yaml</b> per station.' },
    uz: { t: 'station.yaml', s: 'Har stansiya uchun bitta config', k1: 'Bitta fayl', k1d: 'Har stansiya PC\'si uchun bitta station.yaml', k2: 'Secret gitga tushmaydi', k2d: '<code>${CAM_PASS}</code> deb yoziladi, qiymati stansiyadagi site.env da', k3: 'Faqat .engine', k3d: 'Model stansiya GPU\'sida <code>ttex-ai engine</code> bilan quriladi', c1: 'Kod bir xil, har stansiyada o\'z <b>station.yaml</b> fayli.' }
  });
  L('p07', {
    ko: { t: '배포와 롤백', s: '스테이션에는 태그만 배포한다', n1: '검증', n2: '배포', n3: '롤백', d1: 'CI가 실행합니다', d2: '브랜치가 아닌 태그(vX.Y.Z)로', d3: 'current 심볼릭 링크를 이전 릴리스로', end: '하나의 코드베이스 · 스테이션별 설정만 · 태그로 배포' },
    en: { t: 'Deploy and rollback', s: 'Only tags go to a station', n1: 'Validate', n2: 'Deploy', n3: 'Roll back', d1: 'CI runs this', d2: 'By tag (vX.Y.Z), never a branch', d3: 'The current symlink goes back to the previous release', end: 'One codebase · per-station config only · deploy by tag' },
    uz: { t: 'Chiqarish va qaytarish', s: 'Stansiyaga faqat tag chiqadi', n1: 'Tekshirish', n2: 'Chiqarish', n3: 'Qaytarish', d1: 'CI shuni ishlatadi', d2: 'Tag (vX.Y.Z) bilan, branch emas', d3: 'current symlink oldingi release\'ga qaytadi', end: 'Bitta kod bazasi · faqat config stansiyaga xos · tag bilan deploy' }
  });

  L('modes', {
    ko: { t: '도입 모드', s: '섀도에서 라이브까지, 한 단계씩', n1: 'Shadow', n2: 'Publish', n3: 'Live', u1: '관찰만', u2: '웹 UI에 공개', u3: '스테이션으로 전송',
      d1: '다른 엔진의 결과를 읽기만 하고, 자신은 results_dir에만 씁니다.', d2: 'gid_*.json을 스테이션 웹 UI가 읽는 폴더에 씁니다.', d3: '기존 엔진을 대체하고 스테이션 서버로 전송합니다.', i1: '읽기', i2: '쓰기', i3: '전송', yes: '함', no: '안 함',
      c1: '<b>Shadow</b>: 기존 엔진과 나란히 돌려 결과만 비교합니다.', c2: '<b>Publish</b>: 웹 UI는 바뀌지 않고 같은 gid_slots.json을 읽습니다.', c3: '<b>Live</b>: 기존 엔진을 대체하고 스테이션 서버로 보냅니다.' },
    en: { t: 'Rollout modes', s: 'From shadow to live, one step at a time', n1: 'Shadow', n2: 'Publish', n3: 'Live', u1: 'Observe only', u2: 'Feeds the web UI', u3: 'Sends to the station',
      d1: 'Reads another engine\'s results and writes only to its own results_dir.', d2: 'Writes gid_*.json to the folder the station web UI reads.', d3: 'Replaces the old engine and sends to the station server.', i1: 'read', i2: 'write', i3: 'send', yes: 'yes', no: 'no',
      c1: '<b>Shadow</b>: runs beside the old engine, only the results are compared.', c2: '<b>Publish</b>: the web UI is unchanged and reads the same gid_slots.json.', c3: '<b>Live</b>: replaces the old engine and sends to the station server.' },
    uz: { t: 'Joriy etish rejimlari', s: 'Shadow\'dan live\'gacha, bosqichma-bosqich', n1: 'Shadow', n2: 'Publish', n3: 'Live', u1: 'Faqat kuzatadi', u2: 'Web UI ga chiqaradi', u3: 'Station\'ga yuboradi',
      d1: 'Boshqa engine natijasini o\'qiydi, o\'zi faqat results_dir ga yozadi.', d2: 'gid_*.json ni stansiya web UI o\'qiydigan papkaga yozadi.', d3: 'Eski engine o\'rniga ishlaydi va station serveriga yuboradi.', i1: 'o\'qiydi', i2: 'yozadi', i3: 'yuboradi', yes: 'ha', no: 'yo\'q',
      c1: '<b>Shadow</b>: eski engine yonida ishlaydi, faqat natijalar solishtiriladi.', c2: '<b>Publish</b>: web UI o\'zgarmaydi, o\'sha gid_slots.json ni o\'qiydi.', c3: '<b>Live</b>: eski engine o\'rniga ishlaydi va station serveriga yuboradi.' }
  });
  L('layers', {
    ko: { t: '설정 계층', s: '위치가 적용 범위를 정한다', l1: '이 스테이션 PC에만', l1s: 'git에 올라가지 않음 (비밀)', l2: '이 스테이션 전용 파일', l2s: '배포 때 코드 위에 복사', l3: '스테이션 하나', l3s: '카메라, 서비스, 변형', l4: '모든 스테이션', l4s: '엔진 코드(변형) 목록', c1: '아래에서 위로 갈수록 적용 범위가 좁아집니다.', c2: '비밀은 맨 위, 스테이션 PC에만 있습니다.' },
    en: { t: 'Config layers', s: 'Location sets the scope', l1: 'This station PC only', l1s: 'never in git (secrets)', l2: 'Files for this station only', l2s: 'copied over the code on deploy', l3: 'One station', l3s: 'cameras, services, variant', l4: 'Every station', l4s: 'the list of engine code (variants)', c1: 'From the bottom up, the scope gets narrower.', c2: 'Secrets sit on top, on the station PC only.' },
    uz: { t: 'Config qatlamlari', s: 'Joylashuv qamrovni belgilaydi', l1: 'Faqat shu stansiya PC\'si', l1s: 'gitga tushmaydi (secret)', l2: 'Shu stansiyaga xos fayllar', l2s: 'deploy\'da kod ustiga ko\'chiriladi', l3: 'Bitta stansiya', l3s: 'kameralar, servislar, variant', l4: 'Barcha stansiyalar', l4s: 'engine kodlari (variant\'lar)', c1: 'Pastdan yuqoriga qamrov torayib boradi.', c2: 'Secret eng tepada, faqat stansiya PC\'sida.' }
  });
  L('cycle', {
    ko: { t: '설정 루프', s: '세 단계를 반복한다', n1: '설정 수정', n2: '렌더', n3: '라이브 비교', e1: 'edit config', e2: 'render pm2', e3: 'diff live', cmd: '명령', c1: '<b>sites/</b>의 설정을 고칩니다.', c2: '설정을 pm2 ecosystem으로 <b>렌더</b>합니다.', c3: '렌더 결과와 실제 <b>pm2</b>를 비교합니다.' },
    en: { t: 'The config loop', s: 'Three steps, repeated', n1: 'Edit config', n2: 'Render', n3: 'Compare live', e1: 'edit config', e2: 'render pm2', e3: 'diff live', cmd: 'command', c1: 'Edit the config under <b>sites/</b>.', c2: '<b>Render</b> the config into a pm2 ecosystem.', c3: 'Compare the render with the live <b>pm2</b>.' },
    uz: { t: 'Config sikli', s: 'Uch qadam takrorlanadi', n1: 'Config o\'zgartirish', n2: 'Render', n3: 'Jonli bilan solishtirish', e1: 'edit config', e2: 'render pm2', e3: 'diff live', cmd: 'buyruq', c1: '<b>sites/</b> dagi configni o\'zgartirasiz.', c2: 'Config pm2 ecosystem\'ga <b>render</b> qilinadi.', c3: 'Render natijasi haqiqiy <b>pm2</b> bilan solishtiriladi.' }
  });

  // ───────────────── p01: tuzilma ─────────────────
  var ROWS = [['ttex-ai/', '', null], ['├ ttex_ai/', '', null], ['│ ├ core/', 'detect · track · plates · zones · slots', [8.2, 10]], ['│ ├ apps/', 'station · carwash · human · safety', null], ['│ └ cli.py · deploy.py · pm2.py', '', null], ['├ sites/', '', [10.4, 12.4]], ['│ ├ <site-A>/', 'site.yaml · overlay/', null], ['│ └ <site-B>/', 'site.yaml · overlay/', null], ['├ engines.yaml', '', null], ['├ deploy/', '', null], ['├ docs/', '', null], ['├ tests/', '', null], ['└ tools/', '', null]];
  D.page({ id: 'p01', dur: 15, caps: [[3.2, 'p01.c1'], [8.2, 'p01.c2'], [10.4, 'p01.c3'], [12.8, 'p01.c4']], setup: function (root, p) {
    p.title = bind(el('div', 'abs', root), 'p01.t'); css(p.title, { left: '120px', top: '300px', font: '800 84px/1.05 var(--sans)', letterSpacing: '-.02em', whiteSpace: 'nowrap' });
    p.sub = bind(el('div', 'abs', root), 'p01.s'); css(p.sub, { left: '124px', top: '420px', font: '400 38px var(--sans)', color: C.ink2, whiteSpace: 'nowrap' });
    p.q = bind(el('div', 'abs', root), 'p01.q'); css(p.q, { left: '124px', top: '500px', width: '900px', font: 'italic 400 29px/1.5 Georgia,"Times New Roman",serif', color: C.ink2 });
    p.src = el('div', 'abs', root, 'ttex-ai — README'); css(p.src, { left: '124px', top: '610px', font: '400 19px var(--mono)', color: '#6f6d66' });
    var s = svg('svg', { viewBox: '0 0 200 132', fill: 'none', stroke: C.acc, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, root); css(s, { position: 'absolute', left: '120px', top: '720px', width: '200px', height: '132px' });
    p.tb = prep(svg('rect', { x: 2, y: 2, width: 196, height: 128, rx: 3 }, s)); p.tp = prep(svg('path', { d: 'M24 38 L52 62 L24 86' }, s)); p.tl = prep(svg('path', { d: 'M66 90 H108' }, s));
    p.tlab = bind(el('div', 'abs', root), 'p01.term'); css(p.tlab, { left: '120px', top: '872px', width: '200px', textAlign: 'center', font: '600 28px var(--sans)' });
    p.ph = bind(el('div', 'abs', root), 'p01.ph'); css(p.ph, { left: '1190px', top: '290px', font: '800 40px var(--sans)' });
    p.pd = bind(el('div', 'abs', root), 'p01.pd'); css(p.pd, { left: '1192px', top: '348px', font: '400 24px var(--sans)', color: C.ink2, whiteSpace: 'nowrap' });
    var bs = svg('svg', { viewBox: '0 0 14 470', preserveAspectRatio: 'none', fill: 'none', stroke: C.acc, 'stroke-width': 2.5 }, root); css(bs, { position: 'absolute', left: '1166px', top: '406px', width: '14px', height: '470px' });
    p.br = prep(svg('path', { d: 'M12 1 H2 V469 H12' }, bs));
    var tr = el('div', 'abs', root); css(tr, { left: '1190px', top: '404px', width: '690px', font: '400 22px/1.5 var(--mono)', whiteSpace: 'pre' });
    p.rows = ROWS.map(function (r) { var d = el('span', '', tr); css(d, { display: 'block', height: '36px', color: C.ink2 }); var b = el('b', '', d, r[0]); css(b, { fontWeight: 400, color: C.ink }); if (r[1]) { var i = el('i', '', d, r[1]); css(i, { fontStyle: 'normal', color: '#6f6d66', marginLeft: '12px' }); } return [d, b, r[2]]; });
  }, render: function (t, p) { p = this;
    rise(p.title, ease.out(prog(t, .2, .9)), 28); rise(p.sub, ease.out(prog(t, .9, .8)), 18); rise(p.q, ease.out(prog(t, 1.6, .9)), 14); rise(p.src, ease.out(prog(t, 2.2, .7)), 10);
    draw(p.tb, ease.out(prog(t, 1.6, 1))); draw(p.tp, ease.out(prog(t, 2.5, .5))); draw(p.tl, prog(t, 3, .4)); p.tl.style.opacity = t > 3.4 ? (Math.floor(t * 2) % 2 === 0 ? 1 : .15) : 1; rise(p.tlab, ease.out(prog(t, 2.8, .6)), 10);
    rise(p.ph, ease.out(prog(t, 3.4, .6)), 16); rise(p.pd, ease.out(prog(t, 3.7, .6)), 12); draw(p.br, ease.out(prog(t, 4, 1.4)));
    p.rows.forEach(function (r, i) { var q = ease.out(prog(t, 4.4 + i * .28, .45)); r[0].style.opacity = q.toFixed(3); r[0].style.transform = 'translateX(' + ((1 - q) * -16).toFixed(1) + 'px)'; var w = r[2], on = w && t >= w[0] && t < w[1]; r[1].style.color = on ? C.acc2 : C.ink; r[0].style.color = on ? C.acc2 : C.ink2; });
  } });

  // ───────────────── p02: ishlatish ─────────────────
  D.page({ id: 'p02', dur: 15, caps: [[1.2, 'p02.c1'], [4.2, 'p02.c2'], [9.4, 'p02.c3']], setup: function (root, p) {
    p.h = D.head(p, root);
    p.tm = D.term(root, { x: 120, y: 250, w: 1120, h: 520, title: 'python', lines: [
      { code: 'import ttex_ai', at: .9 }, { code: '', at: 99 },
      { code: 'cfg = ttex_ai.load("station.yaml")', at: 2.0 },
      { code: 'ttex_ai.run("station", cfg)', cm: '# live', cls: 'ok', at: 4.2 },
      { code: 'ttex_ai.run("carwash", cfg)', cm: '# shadow', cls: 'warn', at: 6.0 },
      { code: 'ttex_ai.run("human",   cfg)', cm: '# NotImplementedError', cls: 'grey', at: 7.8 },
      { code: 'ttex_ai.run("safety",  cfg)', cm: '# NotImplementedError', cls: 'grey', at: 9.6 }] });
    p.cl = bind(el('div', 'abs', root), 'p02.cli'); css(p.cl, { left: '1320px', top: '262px', font: '600 24px var(--sans)', color: C.acc2 });
    p.cli = el('div', 'term abs', root); css(p.cli, { left: '1320px', top: '312px', width: '480px', height: '230px' });
    var b = el('div', 'body', p.cli); css(b, { font: '400 24px/1.6 var(--mono)', padding: '24px', whiteSpace: 'pre' });
    el('span', '', b, '$ ttex-ai run station\n    --config station.yaml\n    --part gid'); p.cliB = b;
    p.note = bind(el('div', 'note', root), 'p02.note', true); css(p.note, { left: '120px', top: '810px', width: '1680px' });
  }, render: function (t) { var p = this; p.h.render(t); p.tm.render(t); rise(p.cl, ease.out(prog(t, 3.2, .6)), 12); rise(p.cli, ease.out(prog(t, 3.5, .7)), 18); rise(p.note, ease.out(prog(t, 11, .8)), 14); } });

  // ───────────────── p03: to'rtta app ─────────────────
  var APPS = [['station', 'ok', 'd1', 'b1', 'ok'], ['carwash', 'warn', 'd2', 'b2', 'warn'], ['human', 'grey', 'd3', 'b3', 'grey'], ['safety', 'grey', 'd4', 'b4', 'grey']];
  D.page({ id: 'p03', dur: 15, caps: [[6, 'p03.c1'], [10, 'p03.c2']], setup: function (root, p) {
    p.h = D.head(p, root); p.cards = [];
    APPS.forEach(function (a, i) {
      var c = el('div', 'card', root); css(c, { left: (120 + i * 428) + 'px', top: '250px', width: '396px', height: '640px' });
      var ic = svg('svg', { viewBox: '0 0 396 220', width: 396, height: 220 }, c); css(ic, { position: 'absolute', left: 0, top: 0 });
      svg('rect', { x: 24, y: 24, width: 348, height: 172, rx: 12, fill: '#1b1a19', stroke: C.line }, ic);
      var anim = [];
      if (i === 0) { for (var k = 0; k < 5; k++) { var r = svg('rect', { x: 44 + k * 62, y: 70, width: 50, height: 80, rx: 6, fill: 'none', stroke: C.acc, 'stroke-width': 2.5 }, ic); anim.push(r); } }
      if (i === 1) { var z1 = svg('rect', { x: 50, y: 80, width: 110, height: 60, rx: 6, fill: 'none', stroke: C.warn, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, ic), z2 = svg('rect', { x: 236, y: 80, width: 110, height: 60, rx: 6, fill: 'none', stroke: C.warn, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, ic); var car = svg('rect', { x: 70, y: 96, width: 44, height: 28, rx: 5, fill: C.warn }, ic); anim.push(car); }
      if (i >= 2) { var col = C.grey; if (i === 2) { [100, 190, 280].forEach(function (x) { svg('circle', { cx: x, cy: 96, r: 16, fill: 'none', stroke: col, 'stroke-width': 2.5 }, ic); svg('path', { d: 'M' + (x - 24) + ' 150 q24 -34 48 0', fill: 'none', stroke: col, 'stroke-width': 2.5 }, ic); }); svg('rect', { x: 52, y: 58, width: 292, height: 104, rx: 8, fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-dasharray': '8 6' }, ic); } else { svg('path', { d: 'M198 58 L262 160 H134 Z', fill: 'none', stroke: col, 'stroke-width': 3, 'stroke-linejoin': 'round' }, ic); svg('path', { d: 'M198 92 V128 M198 142 V144', stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' }, ic); } }
      var nm = el('div', 'nm', c, a[0]); css(nm, { position: 'absolute', left: '28px', top: '244px' });
      var cl = el('div', 'cl', c, 'run("' + a[0] + '", cfg)'); css(cl, { position: 'absolute', left: '28px', top: '304px' });
      var ds = bind(el('div', 'ds', c), 'p03.' + a[2]); css(ds, { position: 'absolute', left: '28px', top: '364px', width: '340px' });
      var pill = bind(el('span', 'pill ' + a[4], c), 'p03.' + a[3]); css(pill, { position: 'absolute', left: '28px', top: '556px' });
      p.cards.push({ c: c, anim: anim, i: i });
    });
  }, render: function (t) { var p = this; p.h.render(t);
    p.cards.forEach(function (k) { var q = ease.out(prog(t, 1.2 + k.i * .5, .7)); rise(k.c, q, 30);
      if (k.i === 0) k.anim.forEach(function (r, j) { var on = t > 3 + j * .5; r.setAttribute('fill', on ? 'rgba(26,149,214,.28)' : 'none'); });
      if (k.i === 1) { var x = 70 + 186 * ease.io(prog(t % 5, .8, 3.2)); k.anim[0].setAttribute('x', x.toFixed(1)); } }); } });

  // ───────────────── p04: station quvuri ─────────────────
  D.page({ id: 'p04', dur: 16, caps: [[3, 'p04.c1'], [8.5, 'p04.c2']], setup: function (root, p) {
    p.h = D.head(p, root);
    var lane1 = [['frame', 'd1'], ['detect', 'd2'], ['track', 'd3'], ['plates', 'd4'], ['<cam>.jsonl', 'd5']], lane2 = [['<cam>.jsonl', 'd6'], ['global id', 'd7'], ['plate vote', 'd8'], ['gid_slots.json', 'd9'], ['gid_table.json', 'd10']];
    p.l1 = bind(el('div', 'lane', root), 'p04.l1'); css(p.l1, { left: '120px', top: '246px' }); p.l2 = bind(el('div', 'lane', root), 'p04.l2'); css(p.l2, { left: '120px', top: '566px' });
    p.boxes = []; p.arrows = [];
    var s = svg('svg', { width: 1920, height: 1080 }, root); css(s, { position: 'absolute', left: 0, top: 0, pointerEvents: 'none' });
    [[lane1, 300], [lane2, 620]].forEach(function (ln, li) {
      ln[0].forEach(function (b, i) {
        var x = 120 + i * 350, bx = el('div', 'box', root); css(bx, { left: x + 'px', top: ln[1] + 'px', width: '280px', height: '120px' });
        el('div', 'a', bx, b[0]); bind(el('div', 'b', bx), 'p04.' + b[1]); p.boxes.push({ e: bx, lane: li, i: i });
        if (i < 4) { var a = prep(svg('path', { d: 'M' + (x + 284) + ' ' + (ln[1] + 60) + ' H' + (x + 346) + ' M' + (x + 334) + ' ' + (ln[1] + 50) + ' L' + (x + 346) + ' ' + (ln[1] + 60) + ' L' + (x + 334) + ' ' + (ln[1] + 70), fill: 'none', stroke: C.acc, 'stroke-width': 3, 'stroke-linecap': 'round' }, s)); p.arrows.push({ a: a, lane: li, i: i }); }
      });
    });
    p.dots = [svg('circle', { r: 9, fill: C.acc2 }, s), svg('circle', { r: 9, fill: C.acc2 }, s)];
    p.c1 = el('div', 'abs', root, 'ttex-ai run station --config station.yaml --part cams --cams cam1,cam2'); p.c2 = el('div', 'abs', root, 'ttex-ai run station --config station.yaml --part gid');
    [p.c1, p.c2].forEach(function (e, i) { css(e, { left: '120px', top: (790 + i * 56) + 'px', font: '500 25px var(--mono)', color: C.acc2 }); });
  }, render: function (t) { var p = this; p.h.render(t); fade(p.l1, ease.out(prog(t, 1, .6))); fade(p.l2, ease.out(prog(t, 8, .6)));
    p.boxes.forEach(function (b) { var st = b.lane ? 8.4 : 1.4; rise(b.e, ease.out(prog(t, st + b.i * .45, .5)), 18); });
    p.arrows.forEach(function (a) { var st = a.lane ? 8.4 : 1.4; draw(a.a, ease.out(prog(t, st + .3 + a.i * .45, .4))); });
    [0, 1].forEach(function (li) { var st = li ? 11.2 : 4.2, q = prog(t, st, 3), d = p.dots[li]; d.setAttribute('cx', (260 + q * 1400).toFixed(1)); d.setAttribute('cy', (li ? 680 : 360)); d.style.opacity = q > 0 && q < 1 ? 1 : 0; });
    fade(p.c1, ease.out(prog(t, 3, .6))); fade(p.c2, ease.out(prog(t, 9.8, .6))); } });

  // ───────────────── p05: carwash ─────────────────
  D.page({ id: 'p05', dur: 15, caps: [[3.6, 'p05.c1'], [9.2, 'p05.c2']], setup: function (root, p) {
    p.h = D.head(p, root);
    var s = svg('svg', { width: 1920, height: 1080 }, root); css(s, { position: 'absolute', left: 0, top: 0 });
    svg('rect', { x: 120, y: 330, width: 1000, height: 300, rx: 18, fill: '#161514', stroke: C.line }, s);
    svg('path', { d: 'M140 480 H1100', stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '16 14' }, s);
    p.ze = svg('rect', { x: 220, y: 380, width: 280, height: 200, rx: 10, fill: 'rgba(224,160,48,.06)', stroke: C.warn, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, s);
    p.zx = svg('rect', { x: 740, y: 380, width: 280, height: 200, rx: 10, fill: 'rgba(95,185,138,.06)', stroke: C.ok, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, s);
    var t1 = el('div', 'abs', root, 'helper_entry'), t2 = el('div', 'abs', root, 'helper_exit'); [[t1, 220, C.warn], [t2, 740, C.ok]].forEach(function (x) { css(x[0], { left: x[1] + 'px', top: '640px', font: '600 26px var(--mono)', color: x[2] }); });
    var l1 = bind(el('div', 'abs', root), 'p05.zin'), l2 = bind(el('div', 'abs', root), 'p05.zout'); [[l1, 220], [l2, 740]].forEach(function (x) { css(x[0], { left: x[1] + 'px', top: '682px', font: '400 22px var(--sans)', color: C.ink2 }); });
    p.car = svg('rect', { x: 140, y: 450, width: 110, height: 60, rx: 10, fill: C.acc }, s);
    p.plate = svg('rect', { x: 162, y: 470, width: 66, height: 20, rx: 3, fill: '#f4f2ec' }, s);
    p.ring = svg('rect', { x: 220, y: 600, width: 0, height: 8, rx: 4, fill: C.warn }, s);
    p.dw = bind(el('div', 'abs', root), 'p05.dw'); css(p.dw, { left: '220px', top: '716px', font: '400 20px var(--sans)', color: C.warn });
    p.log = D.term(root, { x: 1200, y: 330, w: 600, h: 300, title: 'events.jsonl', lines: [
      { code: 'visit      12가3456', at: 6.2, cps: 40 }, { code: 'visit_end  vote ok', at: 8, cps: 40 }, { code: 'exit       → linked', at: 10.4, cps: 40 }] });
    css(p.log.w.querySelector('.body'), { font: '400 25px/1.8 var(--mono)', padding: '22px' });
    p.note = bind(el('div', 'note', root), 'p05.note', true); css(p.note, { left: '120px', top: '800px', width: '1680px' });
  }, render: function (t) { var p = this; p.h.render(t); p.log.render(t);
    var x = 140 + (t < 3.2 ? 0 : 0); var q1 = ease.io(prog(t, 1.6, 1.8)), q2 = ease.io(prog(t, 8.2, 1.8));
    x = 140 + 160 * q1 + 520 * q2; p.car.setAttribute('x', x.toFixed(1)); p.plate.setAttribute('x', (x + 22).toFixed(1));
    var dw = prog(t, 3.4, 2.8); p.ring.setAttribute('width', (280 * dw).toFixed(1)); fade(p.dw, ease.out(prog(t, 3.4, .5)));
    p.ze.setAttribute('fill', t > 3.4 && t < 8.4 ? 'rgba(224,160,48,.22)' : 'rgba(224,160,48,.06)'); p.zx.setAttribute('fill', t > 9.8 && t < 12 ? 'rgba(95,185,138,.25)' : 'rgba(95,185,138,.06)');
    rise(p.note, ease.out(prog(t, 11.6, .8)), 14); } });

  // ───────────────── modes: joriy etish rejimlari (p13 uslubi) ─────────────────
  var ICON = {
    read: '<ellipse cx="24" cy="24" rx="16" ry="10"/><circle cx="24" cy="24" r="4.5"/>',
    write: '<path d="M10 38 L14 28 L32 10 L38 16 L20 34 Z M28 14 L34 20"/>',
    send: '<path d="M8 24 L40 10 L30 38 L22 28 Z M22 28 L40 10"/>'
  };
  function chip(parent, kind, on, lab, x) {
    var w = el('div', '', parent); css(w, { position: 'absolute', left: x + 'px', top: '306px', width: '110px', textAlign: 'center' });
    var b = el('div', '', w); css(b, { width: '104px', height: '104px', margin: '0 auto', borderRadius: '18px', border: '2px ' + (on ? 'solid ' + C.ok : 'dashed #4a4741'), background: on ? 'rgba(95,185,138,.14)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' });
    var sv = svg('svg', { viewBox: '0 0 48 48', width: 50, height: 50, fill: 'none', stroke: on ? C.ok : '#5c5a54', 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b); sv.innerHTML = ICON[kind];
    var l = bind(el('div', '', w), lab); css(l, { marginTop: '8px', font: '400 21px var(--sans)', color: on ? C.ink2 : '#5c5a54' }); return w;
  }
  var MODE_CFG = ['tail_dir: <other-engine>/results', 'publish_dir: <station-ui>/results', 'send: true'];
  var MODE_ON = [[1, 0, 0], [1, 1, 0], [1, 1, 1]];
  D.page({ id: 'modes', dur: 17, caps: [[4, 'modes.c1'], [8, 'modes.c2'], [12, 'modes.c3']], setup: function (root, p) {
    p.h = D.head(p, root); p.cards = [];
    for (var i = 0; i < 3; i++) (function (i) {
      var c = el('div', 'card', root); css(c, { left: (120 + i * 580) + 'px', top: '250px', width: '520px', height: '470px', border: '2px solid ' + C.line });
      var nm = bind(el('div', '', c), 'modes.n' + (i + 1)); css(nm, { position: 'absolute', left: '34px', top: '28px', font: '800 48px var(--sans)' });
      var u = bind(el('div', '', c), 'modes.u' + (i + 1)); css(u, { position: 'absolute', left: '34px', top: '98px', font: '600 27px var(--sans)', color: C.acc2 });
      var d = bind(el('div', 'ds', c), 'modes.d' + (i + 1)); css(d, { position: 'absolute', left: '34px', top: '148px', width: '452px', height: '120px' });
      var kinds = ['read', 'write', 'send'], labs = ['modes.i1', 'modes.i2', 'modes.i3'];
      for (var k = 0; k < 3; k++) chip(c, kinds[k], !!MODE_ON[i][k], labs[k], 34 + k * 140);
      p.cards.push(c);
    })(i);
    var lg = el('div', 'abs', root); css(lg, { left: '124px', top: '742px', font: '400 22px var(--sans)', color: C.ink2, display: 'flex', gap: '34px' });
    var y = el('span', '', lg); var yb = el('i', '', y); css(yb, { display: 'inline-block', width: '18px', height: '18px', borderRadius: '5px', background: C.ok, verticalAlign: '-2px', marginRight: '10px' }); bind(el('span', '', y), 'modes.yes');
    var n = el('span', '', lg); var nb = el('i', '', n); css(nb, { display: 'inline-block', width: '18px', height: '18px', borderRadius: '5px', border: '2px dashed #5c5a54', verticalAlign: '-2px', marginRight: '10px' }); bind(el('span', '', n), 'modes.no');
    p.bar = el('div', 'abs', root); css(p.bar, { left: '120px', top: '800px', width: '1000px', height: '92px', border: '2px solid ' + C.acc, borderRadius: '16px', background: '#131211', display: 'flex', alignItems: 'center', padding: '0 34px', font: '500 34px var(--mono)', color: C.ink });
    p.arr = el('span', '', p.bar, '▸▸'); css(p.arr, { color: C.acc2, marginRight: '22px' }); p.txt = el('span', '', p.bar, '');
    p.dots = [0, 1, 2].map(function (i) { var d = el('div', 'abs', root); css(d, { left: (1240 + i * 190) + 'px', top: '822px', width: '170px', textAlign: 'center', font: '700 24px var(--mono)', color: '#5c5a54' }); d.textContent = ['SHADOW', 'PUBLISH', 'LIVE'][i]; return d; });
    p.ln = el('div', 'abs', root); css(p.ln, { left: '1250px', top: '868px', height: '5px', width: '0', background: C.acc, borderRadius: '3px' });
    p.base = el('div', 'abs', root); css(p.base, { left: '1250px', top: '868px', height: '5px', width: '530px', background: C.line, borderRadius: '3px' });
  }, render: function (t) { var p = this; p.h.render(t);
    var act = t < 4 ? -1 : t < 8 ? 0 : t < 12 ? 1 : 2;
    p.cards.forEach(function (c, i) { var q = ease.out(prog(t, 1.2 + i * .55, .7)); c.style.opacity = q.toFixed(3); var up = i === act ? -10 : 0; c.style.transform = 'translateY(' + ((1 - q) * 30 + up).toFixed(1) + 'px)'; c.style.borderColor = i === act ? C.acc : C.line; c.style.boxShadow = i === act ? '0 0 0 2px rgba(26,149,214,.25), 0 18px 40px rgba(0,0,0,.35)' : 'none'; });
    fade(p.bar, ease.out(prog(t, 3.2, .6))); var m = act < 0 ? '' : MODE_CFG[act]; if (p.txt._m !== m) { p.txt.textContent = m; p.txt._m = m; }
    p.dots.forEach(function (d, i) { d.style.color = i === act ? C.acc2 : '#5c5a54'; fade(d, ease.out(prog(t, 3.2, .6))); });
    fade(p.base, ease.out(prog(t, 3.2, .6))); p.ln.style.width = (530 * (act < 0 ? 0 : (act + 1) / 3)).toFixed(0) + 'px'; } });

  // ───────────────── p06: station.yaml ─────────────────
  D.page({ id: 'p06', dur: 15, caps: [[10.5, 'p06.c1']], setup: function (root, p) {
    p.h = D.head(p, root);
    p.tm = D.term(root, { x: 120, y: 250, w: 1000, h: 640, title: 'station.yaml', lines: [
      { code: 'site: <site-A>', at: .9 }, { code: 'ttex_ai: 0.2.0', at: 1.7 }, { code: 'apps: [station]', at: 2.5 }, { code: 'results_dir: results', at: 3.3 }, { code: 'zones_dir: zones', at: 4.1 },
      { code: 'cams_file: cams.txt', cm: '# mode 600', at: 4.9 }, { code: 'weights:', cm: '# .engine only', at: 5.9 }, { code: '  det:   weights/det/best.engine', at: 6.7, cps: 40 }, { code: '  plate: weights/plate/best.engine', at: 7.7, cps: 40 },
      { code: '  char:  weights/char/best.engine', at: 8.7, cps: 40 }, { code: 'fps: 10', at: 9.7 }, { code: 'slots: {cover_min: 0.5}', at: 10.2 }] });
    css(p.tm.w.querySelector('.body'), { font: '400 25px/1.5 var(--mono)', padding: '18px 26px' }); p.tm.lines.forEach(function (l) { l.d.style.minHeight = '40px'; });
    p.ks = [1, 2, 3].map(function (n, i) {
      var c = el('div', 'card', root); css(c, { left: '1200px', top: (250 + i * 215) + 'px', width: '600px', height: '195px', padding: '24px 30px' });
      var h = bind(el('div', '', c), 'p06.k' + n); css(h, { font: '700 32px var(--sans)', marginBottom: '8px' }); var d = bind(el('div', 'ds', c), 'p06.k' + n + 'd', true); return c; });
  }, render: function (t) { var p = this; p.h.render(t); p.tm.render(t); p.ks.forEach(function (c, i) { rise(c, ease.out(prog(t, 2 + i * 2.6, .7)), 24); }); } });

  // ───────────────── layers: config qatlamlari (p18 uslubi) ─────────────────
  var LAYER = [
    { f: 'site.env', fill: '#f4f2ec', ink: '#1b1a19', col: '#f4f2ec', k: 'l1' },
    { f: 'overlay/', fill: '#1a95d6', ink: '#ffffff', col: '#6cc4f2', k: 'l2' },
    { f: 'site.yaml', fill: '#5fb98a', ink: '#10231a', col: '#5fb98a', k: 'l3' },
    { f: 'engines.yaml', fill: '#3a3834', ink: '#f4f2ec', col: '#a7a49b', k: 'l4' }];
  D.page({ id: 'layers', dur: 15, caps: [[2, 'layers.c1'], [9, 'layers.c2']], setup: function (root, p) {
    p.h = D.head(p, root);
    var iso = el('div', 'abs', root); css(iso, { left: '330px', top: '330px', width: '640px', height: '400px', transform: 'rotateX(58deg) rotateZ(-34deg)', transformStyle: 'preserve-3d' });
    p.ls = LAYER.map(function (L0, i) {
      var c = el('div', '', iso); css(c, { position: 'absolute', left: 0, top: 0, width: '640px', height: '400px', borderRadius: '26px', background: L0.fill, boxShadow: '0 0 0 1px rgba(255,255,255,.08)', color: L0.ink });
      var bar = el('div', '', c); css(bar, { position: 'absolute', left: '36px', top: '34px', width: '70px', height: '10px', borderRadius: '5px', background: L0.ink, opacity: .55 });
      var f = el('div', '', c, L0.f); css(f, { position: 'absolute', left: '36px', top: '62px', font: '700 46px var(--mono)' });
      var d = el('div', '', c); css(d, { position: 'absolute', left: '36px', top: '132px', font: '400 22px var(--mono)', opacity: .6, whiteSpace: 'pre' }); d.textContent = ['SECRET=••••', '*.tmpl → ${VAR}', 'site: <site-A>', 'engines: [...]'][i];
      return c; });
    p.lb = LAYER.map(function (L0, i) {
      var y = 300 + i * 118, w = el('div', 'abs', root); css(w, { left: '1200px', top: y + 'px', width: '620px' });
      var ln = el('div', '', w); css(ln, { position: 'absolute', left: '-80px', top: '22px', width: '64px', height: '2px', background: L0.col });
      var a = bind(el('div', '', w), 'layers.' + L0.k); css(a, { font: '800 42px var(--sans)', color: L0.col }); var b = bind(el('div', '', w), 'layers.' + L0.k + 's'); css(b, { font: '400 24px var(--sans)', color: C.ink2, marginTop: '4px' }); return w; });
  }, render: function (t) { var p = this; p.h.render(t);
    p.ls.forEach(function (c, i) { var step = 3 - i, q = ease.out(prog(t, 1.2 + step * 1.0, .9)); var z = i === 0 ? 0 : 0; var final = (3 - i) * 62, from = final + 280; c.style.opacity = q.toFixed(3); c.style.transform = 'translateZ(' + (from + (final - from) * q).toFixed(1) + 'px)'; });
    p.lb.forEach(function (w, i) { var step = 3 - i; rise(w, ease.out(prog(t, 1.9 + step * 1.0, .7)), 14); }); } });

  // ───────────────── p07: deploy ─────────────────
  D.page({ id: 'p07', dur: 15, caps: [], setup: function (root, p) {
    p.h = D.head(p, root); var cmds = ['ttex-ai validate --all --no-env', 'ttex-ai deploy --site <site> --ref v0.2.0', 'ttex-ai rollback'];
    p.st = [0, 1, 2].map(function (i) {
      var x = 120 + i * 590, g = el('div', 'abs', root); css(g, { left: x + 'px', top: '260px', width: '500px' });
      var n = el('div', '', g); css(n, { font: '300 120px/1 Georgia,serif', color: C.acc, display: 'inline-block', verticalAlign: 'middle' }); n.textContent = i + 1;
      var nm = bind(el('div', '', g), 'p07.n' + (i + 1)); css(nm, { display: 'inline-block', verticalAlign: 'middle', font: '800 52px var(--sans)', marginLeft: '24px' });
      var tm = D.term(g, { x: 0, y: 160, w: 500, h: 190, title: 'bash', lines: [{ code: cmds[i], at: 2.2 + i * 3.2, cps: 28 }] }); tm.w.style.top = '160px'; tm.w.style.left = '0';
      css(tm.w.querySelector('.body'), { font: '400 22px/1.6 var(--mono)', padding: '20px 22px', whiteSpace: 'normal', wordBreak: 'normal' });
      var ds = bind(el('div', 'ds', g), 'p07.d' + (i + 1)); css(ds, { position: 'absolute', top: '380px', width: '480px', font: '400 28px/1.45 var(--sans)', color: C.ink2 });
      return { g: g, tm: tm, i: i }; });
    var s = svg('svg', { width: 1920, height: 1080 }, root); css(s, { position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }); p.ar = [0, 1].map(function (i) { var x = 650 + i * 590; return prep(svg('path', { d: 'M' + x + ' 420 H' + (x + 60) + ' M' + (x + 44) + ' 402 L' + (x + 60) + ' 420 L' + (x + 44) + ' 438', fill: 'none', stroke: C.mute || '#6f6d66', 'stroke-width': 4, 'stroke-linecap': 'round' }, s)); });
    p.end = bind(el('div', 'abs', root), 'p07.end'); css(p.end, { left: 0, width: '1920px', top: '860px', textAlign: 'center', font: '700 40px var(--sans)', color: C.ink });
  }, render: function (t) { var p = this; p.h.render(t); p.st.forEach(function (s) { rise(s.g, ease.out(prog(t, 1 + s.i * 3.2, .7)), 26); s.tm.render(t); }); p.ar.forEach(function (a, i) { draw(a, ease.out(prog(t, 3.4 + i * 3.2, .5))); }); rise(p.end, ease.out(prog(t, 11.5, .8)), 16); } });


  // ───────────────── cycle: config sikli, izometrik bloklar (p4 uslubi) ─────────────────
  var S = 54, OX = 1370, OY = 300;
  var PX = function (x, y, z) { return [OX + (x - y) * .866 * S, OY + (x + y) * .5 * S - z * S]; };
  var pts = function (a) { return a.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '); };
  var PLATES = [{ n: 'sites/', x: 0, y: 0, cubes: [[.4, .4, 1.1], [2.2, .5, .7], [.6, 2.3, 1.6], [2.4, 2.4, .9]] }, { n: 'ttex_ai/', x: 5, y: 0, cubes: [[.4, .4, .8], [2.3, .4, 1.4], [.5, 2.3, .6], [2.3, 2.3, 1.0]] }, { n: 'deploy/', x: 0, y: 5, cubes: [[.5, .5, .7], [2.3, .6, 1.2], [1.4, 2.3, .9]] }, { n: 'tests/', x: 5, y: 5, cubes: [[.4, .5, .6], [2.2, .4, .9], [.5, 2.2, 1.2], [2.3, 2.3, .7]] }];
  var STEPS = [{ pl: 0, cu: 1, tag: 'site.yaml  +1  −1', cmd: ['$ git diff sites/<site>/site.yaml'] }, { pl: 1, cu: 2, tag: '$ ttex-ai render', cmd: ['$ ttex-ai render', '    --site <site>'] }, { pl: 2, cu: 0, tag: '$ ttex-ai diff-live', cmd: ['$ ttex-ai diff-live', '    --site <site>'] }];
  D.page({ id: 'cycle', dur: 18, caps: [[2, 'cycle.c1'], [7, 'cycle.c2'], [12, 'cycle.c3']], setup: function (root, p) {
    p.h = D.head(p, root);
    p.rows = [0, 1, 2].map(function (i) {
      var w = el('div', 'abs', root); css(w, { left: '120px', top: (290 + i * 102) + 'px', whiteSpace: 'nowrap' });
      var bar = el('div', '', w); css(bar, { position: 'absolute', left: '-2px', top: '8px', width: '6px', height: '56px', background: C.acc, borderRadius: '3px', opacity: 0 });
      var n = el('span', '', w, '0' + (i + 1)); css(n, { font: '500 28px var(--mono)', color: C.acc2, marginLeft: '28px', verticalAlign: 'middle' });
      var a = bind(el('span', '', w), 'cycle.n' + (i + 1)); css(a, { font: '800 56px var(--sans)', marginLeft: '22px', verticalAlign: 'middle' });
      var b = bind(el('span', '', w), 'cycle.e' + (i + 1)); css(b, { font: '400 24px var(--mono)', color: C.mute || '#6f6d66', marginLeft: '20px', verticalAlign: 'middle' });
      return { w: w, bar: bar, n: n, a: a }; });
    p.box = el('div', 'abs', root); css(p.box, { left: '120px', top: '650px', width: '640px', height: '200px', background: '#131211', border: '1px solid ' + C.line, borderRadius: '18px', padding: '22px 30px' });
    var bl = bind(el('div', '', p.box), 'cycle.cmd'); css(bl, { font: '600 22px var(--sans)', color: C.ink2, marginBottom: '10px' });
    p.cm = el('div', '', p.box); css(p.cm, { font: '500 30px/1.6 var(--mono)', whiteSpace: 'pre', color: C.ink });
    var sv = svg('svg', { width: 1920, height: 1080 }, root); css(sv, { position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }); p.sv = sv;
    p.cube = [];
    PLATES.forEach(function (pl, pi) {
      svg('polygon', { points: pts([PX(pl.x - .3, pl.y - .3, 0), PX(pl.x + 4.3, pl.y - .3, 0), PX(pl.x + 4.3, pl.y + 4.3, 0), PX(pl.x - .3, pl.y + 4.3, 0)]), fill: '#22262a', stroke: '#343a40', 'stroke-width': 1.5 }, sv);
      var lp = PX(pl.x - .2, pl.y + 4.7, 0), tx = svg('text', { x: 0, y: 0, transform: 'translate(' + lp[0].toFixed(1) + ',' + lp[1].toFixed(1) + ') rotate(30)', fill: '#8a8880', 'font-family': 'ui-monospace,Menlo,Consolas,monospace', 'font-size': 24, 'font-style': 'italic' }, sv); tx.textContent = pl.n;
      var list = pl.cubes.slice().sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]); });
      list.forEach(function (c) {
        var x = pl.x + c[0], y = pl.y + c[1], w = 1.5, d = 1.5, h = c[2];
        var top = svg('polygon', { points: pts([PX(x, y, h), PX(x + w, y, h), PX(x + w, y + d, h), PX(x, y + d, h)]), fill: '#e9edf0', stroke: '#8f979e', 'stroke-width': 1 }, sv);
        var lf = svg('polygon', { points: pts([PX(x, y + d, 0), PX(x + w, y + d, 0), PX(x + w, y + d, h), PX(x, y + d, h)]), fill: '#b8c0c7', stroke: '#8f979e', 'stroke-width': 1 }, sv);
        var rt = svg('polygon', { points: pts([PX(x + w, y, 0), PX(x + w, y + d, 0), PX(x + w, y + d, h), PX(x + w, y, h)]), fill: '#9aa3ab', stroke: '#8f979e', 'stroke-width': 1 }, sv);
        p.cube.push({ pl: pi, c: c, top: top, lf: lf, rt: rt, topPt: PX(x + w / 2, y + d / 2, h) });
      }); });
    p.find = function (pl, ci) { var tc = PLATES[pl].cubes[ci]; return p.cube.filter(function (k) { return k.pl === pl && k.c === tc; })[0]; };
    p.act = STEPS.map(function (s) { return p.find(s.pl, s.cu); });
    p.path = [0, 1].map(function (i) { var a = p.act[i].topPt, b = p.act[i + 1].topPt; return prep(svg('path', { d: 'M' + a[0] + ' ' + (a[1] - 6) + ' L' + b[0] + ' ' + (b[1] - 6), fill: 'none', stroke: '#e07a57', 'stroke-width': 2.5, 'stroke-dasharray': '9 8' }, sv)); });
    p.path.forEach(function (q) { q.style.strokeDasharray = '9 8'; q._l = q.getTotalLength(); });
    p.tags = STEPS.map(function (s, i) { var tp = p.act[i].topPt, w = 20 + s.tag.length * 15.2;
      var g = svg('g', {}, sv), ln = svg('line', { x1: tp[0], y1: tp[1] - 8, x2: tp[0], y2: tp[1] - 60, stroke: '#1a95d6', 'stroke-width': 2 }, g);
      svg('rect', { x: tp[0] - w / 2, y: tp[1] - 100, width: w, height: 42, fill: '#131211', stroke: '#1a95d6', 'stroke-width': 2 }, g);
      var tt = svg('text', { x: tp[0], y: tp[1] - 71, fill: '#f4f2ec', 'text-anchor': 'middle', 'font-family': 'ui-monospace,Menlo,Consolas,monospace', 'font-size': 25, 'font-weight': 700 }, g); tt.textContent = s.tag; g.style.opacity = 0; return g; });
  }, render: function (t) { var p = this; p.h.render(t);
    var act = t < 2 ? -1 : t < 7 ? 0 : t < 12 ? 1 : 2;
    p.rows.forEach(function (r, i) { var q = ease.out(prog(t, 1 + i * .3, .6)), on = i === act; r.w.style.opacity = (q * (on || act < 0 ? 1 : .32)).toFixed(3); r.w.style.transform = 'translateX(' + ((1 - q) * -20).toFixed(1) + 'px)'; r.bar.style.opacity = on ? 1 : 0; });
    var cm = act < 0 ? '' : STEPS[act].cmd.join('\n'), start = [2, 7, 12][Math.max(act, 0)], n = act < 0 ? 0 : clamp((t - start - .3) * 26, 0, cm.length) | 0, shown = cm.slice(0, n); if (p.cm._s !== shown) { p.cm.textContent = shown; p.cm._s = shown; }
    fade(p.box, ease.out(prog(t, 1.4, .6)));
    p.cube.forEach(function (k) { var on = p.act.indexOf(k) >= 0 && p.act.indexOf(k) <= act; if (k._on !== on) { k._on = on; k.top.setAttribute('fill', on ? '#6cc4f2' : '#e9edf0'); k.lf.setAttribute('fill', on ? '#1a95d6' : '#b8c0c7'); k.rt.setAttribute('fill', on ? '#1276ad' : '#9aa3ab'); } });
    p.tags.forEach(function (g, i) { g.style.opacity = i === act ? ease.out(prog(t, [2, 7, 12][i] + .4, .5)).toFixed(3) : 0; });
    p.path.forEach(function (q, i) { draw(q, ease.io(prog(t, [5.8, 10.8][i], 1.4))); q.style.strokeDasharray = prog(t, [5.8, 10.8][i], 1.4) >= .999 ? '9 8' : q._l + ' ' + (q._l + 2); }); } });
})();
