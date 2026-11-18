(function () {
  'use strict';
  var D = window.DECK, el = D.el, svg = D.svg, css = D.css, rise = D.rise, fade = D.fade, prep = D.prep, draw = D.draw, prog = D.prog, ease = D.ease, clamp = D.clamp, bind = D.bind, L = D.L;
  var C = { acc: '#1a95d6', acc2: '#6cc4f2', ok: '#5fb98a', warn: '#e0a030', grey: '#8a8880', line: '#3a3834', ink: '#f4f2ec', ink2: '#a7a49b', card: '#242220' };

  // ───────────────── tarjimalar ─────────────────
  L('ui', { ko: { doc: 'TTEx AI Work Briefings', toc: '목차' }, en: { doc: 'TTEx AI Work Briefings', toc: 'Contents' }, uz: { doc: 'TTEx AI Work Briefings', toc: 'Mundarija' } });
  L('p01', {
    ko: { t: '하나의 코드, 여러 스테이션', s: '읽고 설정하고 실행한다', q: '“모든 스테이션의 AI 서비스를 위한 단일 소스. 코드는 한 곳에 두고, 각 스테이션에는 설정 폴더만 둔다.”', term: '터미널', ph: '코드베이스', pd: '프로젝트를 이루는 소스 코드 전체',
      c1: '<b>터미널</b>에서 하나의 코드베이스로 작업합니다.', c2: '<b>core/</b>에 AI 코드: 감지, 추적, 번호판, 구역, 슬롯.', c3: '<b>sites/</b>에는 스테이션별 설정과 overlay만 있습니다.', c4: '코드는 한 곳에, 차이는 <b>sites/</b> 안에 있습니다.', c5: '스테이션별 추가 커스터마이징이 필요하면 <b>misc/</b>에서 합니다.' },
    en: { t: 'One codebase, many stations', s: 'Reads, configures, deploys', q: '“A single source for the AI services at every station. The code lives in one place; each station only gets a config folder.”', term: 'Terminal', ph: 'Codebase', pd: 'All the source code that makes up the project',
      c1: 'Work from the <b>terminal</b> on a single codebase.', c2: 'AI code lives in <b>core/</b>: detect, track, plates, zones, slots.', c3: '<b>sites/</b> holds only each station\'s config and overlay.', c4: 'One codebase; the differences live inside <b>sites/</b>.', c5: 'If a station needs extra customizing, it is done in <b>misc/</b>.' },
    uz: { t: 'Bitta kod, ko\'p stansiya', s: 'O\'qiydi, sozlaydi, ishga tushiradi', q: '“Barcha stansiyalardagi AI servislar uchun yagona source. Kod bitta joyda turadi, har bir stansiya faqat config papkasi.”', term: 'Terminal', ph: 'Kod bazasi', pd: 'Loyihani tashkil etuvchi barcha manba kodi',
      c1: '<b>Terminal</b>dan yagona kod bazasi bilan ishlanadi.', c2: '<b>core/</b> da AI kodi: aniqlash, kuzatish, raqam, zona, slot.', c3: '<b>sites/</b> da har bir stansiya faqat config va overlay.', c4: 'Kod bitta joyda, farq <b>sites/</b> ichida.', c5: 'Stansiyaga xos qo\'shimcha sozlash kerak bo\'lsa, u <b>misc/</b> da qilinadi.' }
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
    uz: { t: 'Config sikli', s: 'Uch qadam takrorlanadi', n1: 'Config o\'zgartirish', n2: 'Render', n3: 'Jonli solishtirish', e1: 'edit config', e2: 'render pm2', e3: 'diff live', cmd: 'buyruq', c1: '<b>sites/</b> dagi configni o\'zgartirasiz.', c2: 'Config pm2 ecosystem\'ga <b>render</b> qilinadi.', c3: 'Render natijasi haqiqiy <b>pm2</b> bilan solishtiriladi.' }
  });

  L('lpr', {
    ko: { t: '번호판 인식: 세 개의 검출기', s: '차량 → 번호판 → 문자', n1: '차량', n2: '번호판', n3: '문자', e1: 'detect car', e2: 'detect plate', e3: 'detect chars', lab0: '코드', lab1: '임계값', note: '실제 모델 출력 (사무실 차량)',
      c0: '<b>run()</b>이 시작되면 카메라 프레임마다 이 흐름을 거칩니다.', c1: '먼저 <b>차량</b>을 찾습니다 (car, truck, bus는 한 클래스).', c2: '그 차량 안의 <b>번호판</b>만 씁니다: 최소 90%가 차량 안에 있어야 합니다.', c3: '번호판을 잘라 <b>문자</b>를 하나씩 검출합니다.' },
    en: { t: 'Plate reading: three detectors', s: 'Car \u2192 plate \u2192 characters', n1: 'Vehicle', n2: 'Plate', n3: 'Characters', e1: 'detect car', e2: 'detect plate', e3: 'detect chars', lab0: 'code', lab1: 'thresholds', note: 'real model output (office car)',
      c0: 'Once <b>run()</b> starts, every camera frame goes through this chain.', c1: 'First the <b>vehicle</b> is found (car, truck and bus count as one class).', c2: 'Only the <b>plate</b> inside that car is used: at least 90% must lie within the car box.', c3: 'The plate is cropped and each <b>character</b> is detected.' },
    uz: { t: 'Raqam o\'qish: uchta detektor', s: 'Mashina \u2192 plastinka \u2192 belgilar', n1: 'Mashina', n2: 'Plastinka', n3: 'Belgilar', e1: 'detect car', e2: 'detect plate', e3: 'detect chars', lab0: 'kod', lab1: 'chegaralar', note: 'haqiqiy model chiqishi (ishxona mashinasi)',
      c0: '<b>run()</b> ishga tushgach, har kamera kadri shu zanjirdan o\'tadi.', c1: 'Avval <b>mashina</b> topiladi (car, truck, bus bitta sinf).', c2: 'Faqat shu mashina ichidagi <b>plastinka</b> olinadi: kamida 90% mashina ichida bo\'lishi shart.', c3: 'Plastinka kesiladi va har bir <b>belgi</b> alohida aniqlanadi.' }
  });
  L('lpr2', {
    ko: { t: '후처리: 문자에서 결과까지', s: '조립, 검증, 투표', n1: '조립', n2: '검증', n3: '투표', e1: 'assemble', e2: 'format', e3: 'vote', lab0: '코드', lab1: '함수',
      dd: '한 글자에 두 클래스: 가장 확실한 것만 남김', tl: '번호판 자체 축(PCA)으로 읽기', bad: '이미지 y축으로 읽으면', good: '번호판 축으로 읽으면', sh: '실제 번호판 형태는 세 가지뿐', r1: '한글 두 개', r2: '숫자 그룹 누락', rej: '형식에 맞지 않으면 투표하지 않음', vt: '신뢰도 가중 투표', rd: '읽기', win: '최대 합계가 이김', res: '결과',
      c1: '<b>조립</b>: 중복 상자를 없애고, 번호판의 기울기에 맞춰 읽습니다.', c2: '<b>검증</b>: 세 가지 번호판 형태 중 하나여야만 후보가 됩니다.', c3: '<b>투표</b>: 같은 차의 모든 읽기에서 신뢰도 합계가 가장 큰 번호판이 이깁니다.' },
    en: { t: 'Post-processing: from characters to a result', s: 'Assemble, validate, vote', n1: 'Assemble', n2: 'Validate', n3: 'Vote', e1: 'assemble', e2: 'format', e3: 'vote', lab0: 'code', lab1: 'function',
      dd: 'two classes on one glyph: the most confident stays', tl: 'read along the plate\'s own axis (PCA)', bad: 'reading by image y gives', good: 'reading by the plate axis gives', sh: 'only three real plate shapes exist', r1: 'two hangul', r2: 'missing digit group', rej: 'an invalid shape never votes', vt: 'confidence-weighted vote', rd: 'reads', win: 'the largest total wins', res: 'result',
      c1: '<b>Assemble</b>: drop duplicate boxes, then read along the plate\'s own tilt.', c2: '<b>Validate</b>: only one of the three real plate shapes can be a candidate.', c3: '<b>Vote</b>: across every read of the same car, the plate with the largest confidence total wins.' },
    uz: { t: 'Post-processing: matndan natijagacha', s: 'Yig\'ish, tekshirish, ovoz berish', n1: 'Yig\'ish', n2: 'Tekshirish', n3: 'Ovoz berish', e1: 'assemble', e2: 'format', e3: 'vote', lab0: 'kod', lab1: 'funksiya',
      dd: 'bir belgiga ikki sinf: eng ishonchlisi qoladi', tl: 'plastinkaning o\'z o\'qi (PCA) bo\'yicha o\'qiladi', bad: 'tasvir y bo\'yicha o\'qisa', good: 'plastinka o\'qi bo\'yicha o\'qisa', sh: 'haqiqiy plastinka shakli faqat uchta', r1: 'ikkita hangul', r2: 'raqam guruhi yo\'q', rej: 'yaroqsiz shakl ovoz bermaydi', vt: 'ishonchga vaznli ovoz', rd: 'o\'qishlar', win: 'eng katta yig\'indi yutadi', res: 'natija',
      c1: '<b>Yig\'ish</b>: takroriy qutilar olib tashlanadi, keyin plastinkaning qiyaligi bo\'yicha o\'qiladi.', c2: '<b>Tekshirish</b>: faqat uchta haqiqiy shakldan biriga mos kelsa nomzod bo\'ladi.', c3: '<b>Ovoz</b>: bir mashinaning barcha o\'qishlari ichida ishonch yig\'indisi eng katta raqam yutadi.' }
  });

  L('wire', {
    ko: { t: '모델의 시선', s: '실제 프레임이 도식으로 바뀐다', note: '도식: 이미지 가장자리(2D)에서 추출, 3D 복원 아님', hud: '모델 뷰',
      c1: '<b>실제 프레임</b>: 배경을 제거한 차량.', c2: '가장자리가 <b>네온 선</b>으로 바뀝니다.', c3: '그 위에 <b>실제 결과</b>: 차량, 번호판, 문자 8개.', c4: '결과: <b>205더7419</b>.' },
    en: { t: 'Through the model\'s eyes', s: 'The real frame turns into a schematic', note: 'schematic: from image edges (2D), not a 3D reconstruction', hud: 'model view',
      c1: 'The <b>real frame</b>: the car with the background removed.', c2: 'The edges turn into <b>neon lines</b>.', c3: 'On top, the <b>real result</b>: car, plate, 8 characters.', c4: 'Result: <b>205더7419</b>.' },
    uz: { t: 'Model ko\'zi bilan', s: 'Real kadr sxemaga aylanadi', note: 'sxema: rasm qirralaridan (2D), 3D rekonstruksiya emas', hud: 'model ko\'rinishi',
      c1: '<b>Real kadr</b>: fon olib tashlangan mashina.', c2: 'Qirralar <b>neon chiziqqa</b> aylanadi.', c3: 'Ustiga <b>haqiqiy natija</b>: mashina, plastinka, 8 ta belgi.', c4: 'Natija: <b>205더7419</b>.' }
  });

  // ───────────────── p01: tuzilma ─────────────────
  var ROWS = [['ttex-ai/', '', null], ['├ ttex_ai/', '', null], ['│ ├ core/', 'detect · track · plates · zones · slots', [8.2, 10]], ['│ ├ apps/', 'station · carwash · human · safety', null], ['│ └ cli.py · deploy.py · pm2.py', '', null], ['├ sites/', '', [10.4, 12.2]], ['│ ├ <site-A>/', 'site.yaml · overlay/', null], ['│ └ <site-B>/', 'site.yaml · overlay/', null], ['├ engines.yaml', '', null], ['├ deploy/', '', null], ['├ docs/', '', null], ['├ tests/', '', null], ['├ misc/', 'station customizing', [13.8, 16.6]], ['└ tools/', '', null]];
  D.page({ id: 'p01', dur: 18, caps: [[3.2, 'p01.c1'], [8.2, 'p01.c2'], [10.4, 'p01.c3'], [12.2, 'p01.c4'], [13.8, 'p01.c5']], setup: function (root, p) {
    p.title = bind(el('div', 'abs', root), 'p01.t'); css(p.title, { left: '120px', top: '300px', font: '800 84px/1.05 var(--sans)', letterSpacing: '-.02em', whiteSpace: 'nowrap' });
    p.sub = bind(el('div', 'abs', root), 'p01.s'); css(p.sub, { left: '124px', top: '420px', font: '400 38px var(--sans)', color: C.ink2, whiteSpace: 'nowrap' });
    p.q = bind(el('div', 'abs', root), 'p01.q'); css(p.q, { left: '124px', top: '500px', width: '900px', font: 'italic 400 29px/1.5 Georgia,"Times New Roman",serif', color: C.ink2 });
    p.src = el('div', 'abs', root, 'ttex-ai — README'); css(p.src, { left: '124px', top: '610px', font: '400 19px var(--mono)', color: '#6f6d66' });
    var s = svg('svg', { viewBox: '0 0 200 132', fill: 'none', stroke: C.acc, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, root); css(s, { position: 'absolute', left: '120px', top: '720px', width: '200px', height: '132px' });
    p.tb = prep(svg('rect', { x: 2, y: 2, width: 196, height: 128, rx: 3 }, s)); p.tp = prep(svg('path', { d: 'M24 38 L52 62 L24 86' }, s)); p.tl = prep(svg('path', { d: 'M66 90 H108' }, s));
    p.tlab = bind(el('div', 'abs', root), 'p01.term'); css(p.tlab, { left: '120px', top: '872px', width: '200px', textAlign: 'center', font: '600 28px var(--sans)' });
    p.ph = bind(el('div', 'abs', root), 'p01.ph'); css(p.ph, { left: '1190px', top: '290px', font: '800 40px var(--sans)' });
    p.pd = bind(el('div', 'abs', root), 'p01.pd'); css(p.pd, { left: '1192px', top: '348px', font: '400 24px var(--sans)', color: C.ink2, whiteSpace: 'nowrap' });
    var bs = svg('svg', { viewBox: '0 0 14 506', preserveAspectRatio: 'none', fill: 'none', stroke: C.acc, 'stroke-width': 2.5 }, root); css(bs, { position: 'absolute', left: '1166px', top: '406px', width: '14px', height: '506px' });
    p.br = prep(svg('path', { d: 'M12 1 H2 V505 H12' }, bs));
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

  // ───────────────── umumiy chap panel (p04 uslubi): raqamlangan qadamlar + kod qutisi ─────────────────
  function stepsPanel(root, p, id) {
    p.rows = [0, 1, 2].map(function (i) {
      var w = el('div', 'abs', root); css(w, { left: '120px', top: (290 + i * 102) + 'px', whiteSpace: 'nowrap' });
      var bar = el('div', '', w); css(bar, { position: 'absolute', left: '-2px', top: '8px', width: '6px', height: '56px', background: C.acc, borderRadius: '3px', opacity: 0 });
      var n = el('span', '', w, '0' + (i + 1)); css(n, { font: '500 28px var(--mono)', color: C.acc2, marginLeft: '28px', verticalAlign: 'middle' });
      var a = bind(el('span', '', w), id + '.n' + (i + 1)); css(a, { font: '800 56px var(--sans)', marginLeft: '22px', verticalAlign: 'middle' });
      var b = bind(el('span', '', w), id + '.e' + (i + 1)); css(b, { font: '400 24px var(--mono)', color: '#6f6d66', marginLeft: '20px', verticalAlign: 'middle' });
      return { w: w, bar: bar }; });
    p.box = el('div', 'abs', root); css(p.box, { left: '120px', top: '640px', width: '660px', height: '210px', background: '#131211', border: '1px solid ' + C.line, borderRadius: '18px', padding: '22px 30px' });
    p.lab = el('div', '', p.box); css(p.lab, { font: '600 22px var(--sans)', color: C.ink2, marginBottom: '10px' });
    p.cm = el('div', '', p.box); css(p.cm, { font: '500 28px/1.6 var(--mono)', whiteSpace: 'pre', color: C.ink });
  }
  function stepsRender(p, id, t, act, starts, texts, labels) {
    p.rows.forEach(function (r, i) { var q = ease.out(prog(t, .8 + i * .3, .6)), on = i === act; r.w.style.opacity = (q * (on || act < 0 ? 1 : .32)).toFixed(3); r.w.style.transform = 'translateX(' + ((1 - q) * -20).toFixed(1) + 'px)'; r.bar.style.opacity = on ? 1 : 0; });
    var k = Math.max(act, -1), txt = texts[k + 1], st = starts[k + 1], n = clamp((t - st - .2) * 30, 0, txt.length) | 0, shown = txt.slice(0, n);
    var lb = D.T(id + '.' + labels[k + 1]); if (p.lab._l !== lb) { p.lab.textContent = lb; p.lab._l = lb; } if (p.cm._s !== shown) { p.cm.textContent = shown; p.cm._s = shown; }
    fade(p.box, ease.out(prog(t, 1, .6)));
  }
  var MONO = 'ui-monospace,Menlo,Consolas,monospace', SANS = 'system-ui,"Noto Sans KR","Malgun Gothic",sans-serif';
  var T_ = function (parent, x, y, str, o) { o = o || {}; var e = svg('text', { x: x, y: y, fill: o.fill || '#f4f2ec', 'text-anchor': o.anchor || 'start', 'font-family': o.mono ? MONO : SANS, 'font-size': o.size || 24, 'font-weight': o.weight || 500 }, parent); e.textContent = str; return e; };

  // ───────────────── lpr: kaskad (HAQIQIY mashina va haqiqiy model chiqishi) ─────────────────
  var LD = window.LPR_DATA, VB = { x: 250, y: 100, w: 840 }, FS = 940 / VB.w, SHR = .5, CARD = { x: 230, y: 325, w: 480 };
  D.page({ id: 'lpr', dur: 24, caps: [[.8, 'lpr.c0'], [4, 'lpr.c1'], [9, 'lpr.c2'], [14, 'lpr.c3']], setup: function (root, p) {
    p.h = D.head(p, root); stepsPanel(root, p, 'lpr');
    var holder = el('div', 'abs', root); css(holder, { left: '880px', top: '230px', width: '940px', height: '600px' });
    var A = svg('svg', { viewBox: VB.x + ' ' + VB.y + ' ' + VB.w + ' ' + (VB.w * 600 / 940), width: 940, height: 600 }, holder); css(A, { position: 'absolute', left: 0, top: 0, overflow: 'visible', transformOrigin: '470px 0px' }); p.A = A;
    var im = LD.car.img; p.im = svg('image', { href: 'img/car_cutout.png', x: im[0], y: im[1], width: im[2], height: im[3] }, A);
    var cb = LD.car.box, pb = LD.plate.box, sw = 4 / FS;
    p.cb = prep(svg('rect', { x: cb[0], y: cb[1], width: cb[2] - cb[0], height: cb[3] - cb[1], rx: 3, fill: 'none', stroke: C.acc2, 'stroke-width': sw }, A));
    p.cl = svg('g', {}, A); var lw = 150 / FS, lh = 32 / FS; svg('rect', { x: cb[0], y: cb[1] - lh, width: lw, height: lh, fill: C.acc2 }, p.cl); var t1 = T_(p.cl, cb[0] + 8 / FS, cb[1] - 9 / FS, 'car ' + LD.car.conf.toFixed(2), { size: 22 / FS, weight: 700, fill: '#10202b', mono: true });
    p.pb = prep(svg('rect', { x: pb[0] - 3, y: pb[1] - 3, width: pb[2] - pb[0] + 6, height: pb[3] - pb[1] + 6, rx: 3, fill: 'none', stroke: C.warn, 'stroke-width': 3.5 / FS }, A));
    p.pl = svg('g', {}, A); svg('rect', { x: pb[0] - 3, y: pb[1] - 3 - lh, width: 168 / FS, height: lh, fill: C.warn }, p.pl); T_(p.pl, pb[0] + 5 / FS, pb[1] - 3 - 9 / FS, 'plate ' + LD.plate.conf.toFixed(2), { size: 21 / FS, weight: 700, fill: '#2b1e05', mono: true });
    // yuqori qatlam (ekran koordinatalari): zoom chiziqlari, plastinka kesimi, belgilar
    var B = svg('svg', { viewBox: '0 0 940 600', width: 940, height: 600 }, holder); css(B, { position: 'absolute', left: 0, top: 0, overflow: 'visible' });
    var mapA = function (x, y) { var px = (x - VB.x) * FS, py = (y - VB.y) * FS; return [470 + (px - 470) * SHR, py * SHR]; };
    var q1 = mapA(pb[0], pb[3]), q2 = mapA(pb[2], pb[3]);
    p.zl = [svg('path', { d: 'M' + q1[0] + ' ' + (q1[1] + 4) + ' L' + CARD.x + ' ' + CARD.y, fill: 'none', stroke: C.warn, 'stroke-width': 2, 'stroke-dasharray': '7 7' }, B), svg('path', { d: 'M' + q2[0] + ' ' + (q2[1] + 4) + ' L' + (CARD.x + CARD.w) + ' ' + CARD.y, fill: 'none', stroke: C.warn, 'stroke-width': 2, 'stroke-dasharray': '7 7' }, B)];
    var cr = LD.plate.crop, cw = cr[2] - cr[0], chh = cr[3] - cr[1], sc = CARD.w / cw, cardH = chh * sc;
    p.big = svg('g', {}, B); svg('image', { href: 'img/plate_crop.jpg', x: CARD.x, y: CARD.y, width: CARD.w, height: cardH, preserveAspectRatio: 'none' }, p.big); svg('rect', { x: CARD.x, y: CARD.y, width: CARD.w, height: cardH, rx: 4, fill: 'none', stroke: '#777', 'stroke-width': 3 }, p.big);
    p.chb = LD.chars.map(function (c, i0) { var hg = c.cls >= 10, x = CARD.x + (c.box[0] - cr[0]) * sc, y = CARD.y + (c.box[1] - cr[1]) * sc, w = (c.box[2] - c.box[0]) * sc, h = (c.box[3] - c.box[1]) * sc;
      var r = prep(svg('rect', { x: x, y: y, width: w, height: h, rx: 3, fill: 'none', stroke: hg ? C.warn : C.acc, 'stroke-width': 3 }, B)); var t = T_(B, CARD.x + (i0 + .5) * (CARD.w / LD.chars.length), CARD.y + cardH + 26, c.conf.toFixed(2).replace('0.', '.'), { anchor: 'middle', size: 19, mono: true, fill: hg ? C.warn : C.acc2 }); t.style.opacity = 0; return { r: r, c: t }; });
    p.cardBottom = CARD.y + cardH;
    p.rs = [T_(B, CARD.x, p.cardBottom + 72, '', { mono: true, size: 28, fill: '#f4f2ec', weight: 700 }), T_(B, CARD.x, p.cardBottom + 108, '', { mono: true, size: 24, fill: C.ink2 })];
    p.nt = bind(el('div', 'abs', root), 'lpr.note'); css(p.nt, { left: '1470px', top: '236px', font: '400 20px var(--sans)', color: '#6f6d66', textAlign: 'right', width: '350px' });
  }, render: function (t) { var p = this; p.h.render(t);
    var act = t < 4 ? -1 : t < 9 ? 0 : t < 14 ? 1 : 2;
    stepsRender(p, 'lpr', t, act, [.8, 4, 9, 14], ['ttex_ai.run("station", cfg, part="cams")', 'det_conf 0.5 · IoU 0.45', 'plate_conf 0.15 · inside ≥ 90%', 'char_conf 0.30 · crop +5%'], ['lab0', 'lab1', 'lab1', 'lab1']);
    var kz = 1 - (1 - SHR) * ease.io(prog(t, 10.8, .8)); p.A.style.transform = 'scale(' + kz.toFixed(3) + ')';
    fade(p.im, ease.out(prog(t, 2, .8))); draw(p.cb, ease.out(prog(t, 4.4, 1.2))); fade(p.cl, ease.out(prog(t, 5.6, .4)));
    draw(p.pb, ease.out(prog(t, 9.4, .8))); fade(p.pl, ease.out(prog(t, 10.2, .4)));
    p.zl.forEach(function (q) { fade(q, ease.out(prog(t, 11.2, .6))); });
    fade(p.big, ease.out(prog(t, 11.6, .7))); p.big.setAttribute('transform', 'translate(0,' + ((1 - ease.out(prog(t, 11.6, .7))) * 14).toFixed(1) + ')');
    p.chb.forEach(function (c, i) { draw(c.r, ease.out(prog(t, 14.4 + i * .42, .4))); fade(c.c, ease.out(prog(t, 14.8 + i * .42, .3))); });
    var R = LD.result, r1 = 'text: "' + R.text + '"', r2 = 'conf ' + R.conf.toFixed(3) + ' · hangul_conf ' + R.hangul_conf.toFixed(3);
    var n1 = clamp((t - 18.2) * 30, 0, r1.length) | 0, n2 = clamp((t - 19.2) * 30, 0, r2.length) | 0; p.rs[0].textContent = r1.slice(0, n1); p.rs[1].textContent = r2.slice(0, n2);
    fade(p.nt, ease.out(prog(t, 18, .6))); } });

  // ───────────────── wire: real kadrdan neon sxemaga (qirralardan, 2D) ─────────────────
  var WD = window.WIRE_DATA, WX0 = 334, WW = 612;
  D.page({ id: 'wire', dur: 17, caps: [[.8, 'wire.c1'], [4.2, 'wire.c2'], [8.2, 'wire.c3'], [12.8, 'wire.c4']], setup: function (root, p) {
    p.h = D.head(p, root);
    var holder = el('div', 'abs', root); css(holder, { left: '560px', top: '215px', width: '1200px', height: '680px' });
    var A = svg('svg', { viewBox: '230 90 1000 ' + (1000 * 680 / 1200), width: 1200, height: 680 }, holder); css(A, { position: 'absolute', left: 0, top: 0, overflow: 'visible' });
    var defs = svg('defs', {}, A);
    var f = svg('filter', { id: 'glowW', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs); svg('feGaussianBlur', { stdDeviation: 5, result: 'b' }, f); var m = svg('feMerge', {}, f); svg('feMergeNode', { in: 'b' }, m); svg('feMergeNode', { in: 'b' }, m); svg('feMergeNode', { in: 'SourceGraphic' }, m);
    var cp = svg('clipPath', { id: 'clipW' }, defs); p.clip = svg('rect', { x: WX0, y: 0, width: 3000, height: 3000 }, cp);
    var lg = svg('linearGradient', { id: 'scanG', x1: 0, x2: 1, y1: 0, y2: 0 }, defs); [[0, 0], [.5, .9], [1, 0]].forEach(function (q) { svg('stop', { offset: q[0], 'stop-color': '#6cc4f2', 'stop-opacity': q[1] }, lg); });
    var im = LD.car.img; p.im = svg('image', { href: 'img/car_cutout.png', x: im[0], y: im[1], width: im[2], height: im[3], 'clip-path': 'url(#clipW)' }, A);
    var wg = p.wg = svg('g', { filter: 'url(#glowW)', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, A);
    var mk = function (d, col, sw) { var e = svg('path', { d: d, stroke: col, 'stroke-width': sw, pathLength: 1, 'stroke-dasharray': '1 1' }, wg); e.style.strokeDashoffset = 1; e.style.opacity = 0; var nums = d.match(/-?\d+/g).map(Number), xs = nums.filter(function (_, i2) { return i2 % 2 === 0; }); e._fx = (Math.min.apply(null, xs) - WX0) / WW; return e; };
    p.out = WD.outline.map(function (d) { return mk(d, '#bfeaff', 3); });
    p.ins = WD.inside.map(function (d) { return mk(d, '#4cc3f5', 1.8); });
    p.sc = svg('rect', { x: WX0, y: 110, width: 36, height: 540, fill: 'url(#scanG)' }, A); p.sc.style.opacity = 0;
    // haqiqiy model natijasi: neon qutilar
    var cb = LD.car.box, pb = LD.plate.box, ov = svg('g', { fill: 'none' }, A);
    var box = function (b, col, sw, pad) { pad = pad || 0; return prep(svg('rect', { x: b[0] - pad, y: b[1] - pad, width: b[2] - b[0] + 2 * pad, height: b[3] - b[1] + 2 * pad, rx: 3, stroke: col, 'stroke-width': sw }, ov)); };
    p.cbx = box(cb, '#6cc4f2', 3.5, 0); p.pbx = box(pb, C.warn, 3, 3);
    p.chx = LD.chars.map(function (c) { return box(c.box, c.cls >= 10 ? C.warn : '#6cc4f2', 2.2, 0); });
    p.lbl = svg('g', {}, A); svg('rect', { x: cb[0], y: cb[1] - 30, width: 150, height: 30, fill: '#6cc4f2' }, p.lbl); T_(p.lbl, cb[0] + 8, cb[1] - 9, 'car ' + LD.car.conf.toFixed(2), { size: 21, weight: 700, fill: '#10202b', mono: true });
    p.lbl2 = svg('g', {}, A); svg('rect', { x: pb[0] - 3, y: pb[1] - 33, width: 156, height: 30, fill: C.warn }, p.lbl2); T_(p.lbl2, pb[0] + 5, pb[1] - 12, 'plate ' + LD.plate.conf.toFixed(2), { size: 20, weight: 700, fill: '#2b1e05', mono: true });
    // HUD (chap)
    var hud = el('div', 'abs', root); css(hud, { left: '120px', top: '300px', width: '400px' }); p.hud = hud;
    var tag = bind(el('div', '', hud), 'wire.hud'); css(tag, { font: '600 22px var(--mono)', color: C.acc2, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '16px' });
    var R = LD.result; p.lines = [['car', LD.car.conf.toFixed(2), 8.2], ['plate', LD.plate.conf.toFixed(2), 9.4], ['chars', String(LD.chars.length), 10.4], ['text', R.text, 12.8], ['conf', R.conf.toFixed(3), 13.2], ['hangul_conf', R.hangul_conf.toFixed(3), 13.6]].map(function (q) {
      var r = el('div', '', hud); css(r, { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid ' + C.line, padding: '10px 2px', font: '500 26px var(--mono)' });
      el('span', '', r, q[0]).style.color = C.ink2; var v = el('span', '', r, q[1]); v.style.color = q[0] === 'text' ? '#f4f2ec' : C.acc2; if (q[0] === 'text') v.style.fontWeight = 800; r._t = q[2]; return r; });
    p.nt = bind(el('div', 'abs', root), 'wire.note'); css(p.nt, { left: '1060px', top: '884px', width: '740px', textAlign: 'right', font: '400 20px var(--sans)', color: '#6f6d66' });
  }, render: function (t) { var p = this; p.h.render(t);
    var sf = ease.io(prog(t, 2.2, 4.8)), scanX = WX0 - 20 + (WW + 40) * sf;
    p.clip.setAttribute('x', scanX.toFixed(1)); fade(p.im, ease.out(prog(t, .6, 1.2)));
    var on = t > 2.2 && t < 7.2; p.sc.setAttribute('x', (scanX - 18).toFixed(1)); p.sc.style.opacity = on ? 1 : 0;
    p.out.forEach(function (e) { var q = ease.out(prog(t, 2.3, 4.2)); e.style.strokeDashoffset = (1 - q).toFixed(4); e.style.opacity = q > .002 ? 1 : 0; });
    p.ins.forEach(function (e) { var q = clamp((sf - e._fx) / .16); e.style.strokeDashoffset = (1 - ease.out(q)).toFixed(4); e.style.opacity = q > .002 ? .95 : 0; });
    p.wg.style.opacity = (t > 9 ? .78 + .22 * Math.sin(t * 2.2) : 1).toFixed(3);
    draw(p.cbx, ease.out(prog(t, 8.2, .9))); fade(p.lbl, ease.out(prog(t, 9, .4))); draw(p.pbx, ease.out(prog(t, 9.4, .7))); fade(p.lbl2, ease.out(prog(t, 10.1, .4)));
    p.chx.forEach(function (e, i) { draw(e, ease.out(prog(t, 10.4 + i * .28, .35))); });
    p.lines.forEach(function (r) { rise(r, ease.out(prog(t, r._t, .5)), 10); });
    fade(p.nt, ease.out(prog(t, 3, .8))); } });

  // ───────────────── lpr2: post-processing ─────────────────
  D.page({ id: 'lpr2', dur: 28, caps: [[4, 'lpr2.c1'], [10.4, 'lpr2.c2'], [17.6, 'lpr2.c3']], setup: function (root, p) {
    p.h = D.head(p, root); stepsPanel(root, p, 'lpr2');
    var sv = svg('svg', { viewBox: '0 0 940 600', width: 940, height: 600 }, root); css(sv, { position: 'absolute', left: '880px', top: '310px', overflow: 'visible' });
    // 1) yig'ish
    var g1 = p.g1 = svg('g', {}, sv);
    p.dd = bind(el('div', 'abs', root), 'lpr2.dd'); css(p.dd, { left: '880px', top: '222px', width: '400px', font: '600 24px/1.3 var(--sans)', color: C.acc2 });
    svg('rect', { x: 20, y: 36, width: 200, height: 130, rx: 12, fill: '#f6f4ee', stroke: '#777', 'stroke-width': 3 }, g1); T_(g1, 120, 140, '보', { anchor: 'middle', size: 110, weight: 800, fill: '#1b1a19' });
    p.d1 = svg('g', {}, g1); svg('rect', { x: 36, y: 46, width: 168, height: 112, fill: 'none', stroke: C.acc, 'stroke-width': 4 }, p.d1); svg('rect', { x: 36, y: 4, width: 130, height: 34, fill: C.acc }, p.d1); T_(p.d1, 44, 29, '\ubcf4  0.55', { size: 21, weight: 700, fill: '#082433', mono: true });
    p.d2 = svg('g', {}, g1); svg('rect', { x: 36, y: 46, width: 168, height: 112, fill: 'none', stroke: '#c0463a', 'stroke-width': 3, 'stroke-dasharray': '9 6' }, p.d2); svg('rect', { x: 36, y: 170, width: 130, height: 34, fill: '#c0463a' }, p.d2); T_(p.d2, 44, 195, '\ub108  0.36 \u2717', { size: 21, weight: 700, fill: '#fff', mono: true });
    p.tl = bind(el('div', 'abs', root), 'lpr2.tl'); css(p.tl, { left: '1360px', top: '222px', width: '440px', font: '600 24px/1.3 var(--sans)', color: C.acc2 });
    var tp = p.tp = svg('g', { transform: 'translate(700,120) rotate(-14)' }, g1); svg('rect', { x: -150, y: -50, width: 300, height: 100, rx: 10, fill: '#f6f4ee', stroke: '#777', 'stroke-width': 3 }, tp); '05\uc11c0331'.split('').forEach(function (ch, i) { T_(tp, -118 + i * 40, 24, ch, { anchor: 'middle', size: 62, weight: 800, fill: '#1b1a19', mono: true }); });
    p.ax = prep(svg('path', { d: 'M535 200 L865 120 M845 112 L865 120 L846 132', fill: 'none', stroke: C.ok, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g1));
    p.bd = el('div', 'abs', root); css(p.bd, { left: '880px', top: '556px', font: '400 22px var(--sans)', color: C.ink2 }); bind(el('span', '', p.bd), 'lpr2.bad'); p.bs = el('span', '', p.bd); p.bs.textContent = '  033105\uc11c'; css(p.bs, { font: '700 32px ' + MONO, color: '#c0463a', textDecoration: 'line-through', marginLeft: '14px' });
    p.gd = el('div', 'abs', root); css(p.gd, { left: '880px', top: '610px', font: '400 22px var(--sans)', color: C.ink2 }); bind(el('span', '', p.gd), 'lpr2.good'); p.gs = el('span', '', p.gd); p.gs.textContent = '  05\uc11c0331'; css(p.gs, { font: '700 32px ' + MONO, color: C.ok, marginLeft: '14px' });
    // 2) format
    var g2 = p.g2 = svg('g', {}, sv);
    p.sh = bind(el('div', 'abs', root), 'lpr2.sh'); css(p.sh, { left: '880px', top: '246px', font: '600 26px var(--sans)', color: C.acc2 });
    var SH = [['\\d{2}[\uac00-\ud7a3]\\d{4}', '12\uac00' + '3456'], ['\\d{3}[\uac00-\ud7a3]\\d{4}', '123\ud558' + '4567'], ['[\uac00-\ud7a3]{1,2}\\d{2}[\uac00-\ud7a3]\\d{4}', '\ubd80\uc0b032\ubc140469']];
    p.shr = SH.map(function (r, i) { var y = 30 + i * 74, g = svg('g', {}, g2); svg('rect', { x: 0, y: y, width: 900, height: 60, rx: 12, fill: '#1c1e20', stroke: C.line }, g); T_(g, 20, y + 39, r[0], { mono: true, size: 24, fill: C.ink2 }); T_(g, 800, y + 40, r[1], { mono: true, size: 30, weight: 700, anchor: 'end' }); var ck = T_(g, 880, y + 42, '\u2713', { size: 34, weight: 800, fill: C.ok, anchor: 'end' }); return { g: g, ck: ck }; });
    p.rj = bind(el('div', 'abs', root), 'lpr2.rej'); css(p.rj, { left: '880px', top: '616px', font: '600 24px var(--sans)', color: '#c0463a' });
    var RJ = [['12\ud558\ud5c93456', 'lpr2.r1'], ['1\ub2e423', 'lpr2.r2']];
    p.rjr = RJ.map(function (r, i) { var y = 320 + i * 66, g = svg('g', {}, g2); svg('rect', { x: 0, y: y, width: 900, height: 56, rx: 12, fill: '#241a19', stroke: '#5a2a25' }, g); T_(g, 20, y + 38, r[0], { mono: true, size: 30, weight: 700, fill: '#e08a80' }); var d = svg('g', {}, g); var tt = T_(d, 880, y + 36, '', { size: 22, fill: '#e08a80', anchor: 'end' }); tt._k = r[1]; T_(d, 560, y + 38, '\u2717', { size: 32, weight: 800, fill: '#c0463a' }); return { g: g, tt: tt }; });
    // 3) ovoz
    var g3 = p.g3 = svg('g', {}, sv);
    p.vt = bind(el('div', 'abs', root), 'lpr2.vt'); css(p.vt, { left: '880px', top: '246px', font: '600 26px var(--sans)', color: C.acc2 });
    var RD = [['12\uac003456', '0.91', 'cam1'], ['12\uac003456', '0.95', 'cam2'], ['12\uac003456', '0.88', 'cam1'], ['12\uac003466', '0.62', 'cam1']];
    p.rdr = RD.map(function (r, i) { var y = 30 + i * 50, g = svg('g', {}, g3); T_(g, 0, y + 30, r[0], { mono: true, size: 26, weight: 700 }); T_(g, 220, y + 30, r[1], { mono: true, size: 26, fill: C.acc2 }); T_(g, 320, y + 30, r[2], { mono: true, size: 22, fill: C.ink2 }); return g; });
    p.bar = [{ y: 262, w: 2.74, c: C.ok, l: '12\uac003456  \u03a3 2.74  (3)' }, { y: 312, w: .62, c: C.grey, l: '12\uac003466  \u03a3 0.62  (1)' }].map(function (b) { var r = svg('rect', { x: 0, y: b.y, width: 0, height: 34, rx: 6, fill: b.c }, g3); var t2 = T_(g3, 12, b.y + 25, b.l, { mono: true, size: 21, weight: 700, fill: '#0e1a14' }); t2.style.opacity = 0; if (b.c === C.grey) t2.setAttribute('fill', '#f4f2ec'); return { r: r, t: t2, w: b.w }; });
    p.rt = [T_(g3, 0, 440, '', { mono: true, size: 26, weight: 700, fill: '#f4f2ec' }), T_(g3, 0, 482, '', { mono: true, size: 24, fill: C.ink2 })];
    p.win = bind(el('div', 'abs', root), 'lpr2.win'); css(p.win, { left: '1480px', top: '628px', font: '600 22px var(--sans)', color: C.ok });
    p.ng = [p.g1, p.g2, p.g3];
  }, render: function (t) { var p = this; p.h.render(t);
    var act = t < 4 ? -1 : t < 10.4 ? 0 : t < 17.6 ? 1 : 2;
    stepsRender(p, 'lpr2', t, act, [.8, 4, 10.4, 17.6], ['reads = [reader.read(f, box) ...]', 'assemble_chars(dets)', 'is_valid_plate_format(text)', 'vote(reads)'], ['lab0', 'lab1', 'lab1', 'lab1']);
    // ko'rinish: faol qadam guruhi
    var vis = [act === 0, act === 1, act === 2];
    [p.g1, p.g2, p.g3].forEach(function (g, i) { var s0 = [4, 10.4, 17.6][i], q = vis[i] ? ease.out(prog(t, s0, .5)) : 0; g.style.opacity = q.toFixed(3); });
    [[p.dd, p.tl, p.bd, p.gd], [p.sh, p.rj], [p.vt, p.win]].forEach(function (grp, i) { grp.forEach(function (e) { e.style.opacity = vis[i] ? (parseFloat(e._a || 1)).toFixed(2) : 0; }); });
    // 1) yig'ish
    var q1 = ease.out(prog(t, 4.4, .6)); p.dd.style.opacity = vis[0] ? q1.toFixed(2) : 0;
    p.d1.style.opacity = ease.out(prog(t, 4.8, .5)).toFixed(2); p.d2.style.opacity = ease.out(prog(t, 5.4, .5)) * (t > 6.6 ? 1 - .75 * prog(t, 6.6, .6) : 1);
    var q2 = ease.out(prog(t, 7.2, .6)); p.tl.style.opacity = vis[0] ? q2.toFixed(2) : 0; p.tp.style.opacity = q2.toFixed(2); draw(p.ax, ease.out(prog(t, 7.8, .8)));
    p.bd.style.opacity = vis[0] ? ease.out(prog(t, 8.6, .5)).toFixed(2) : 0; p.gd.style.opacity = vis[0] ? ease.out(prog(t, 9.2, .5)).toFixed(2) : 0;
    // 2) format
    p.sh.style.opacity = vis[1] ? ease.out(prog(t, 10.8, .5)).toFixed(2) : 0;
    p.shr.forEach(function (r, i) { var q = ease.out(prog(t, 11.2 + i * .6, .5)); r.g.style.opacity = q.toFixed(2); r.ck.style.opacity = ease.out(prog(t, 12.2 + i * .6, .3)).toFixed(2); });
    p.rj.style.opacity = vis[1] ? ease.out(prog(t, 14.2, .5)).toFixed(2) : 0;
    p.rjr.forEach(function (r, i) { r.g.style.opacity = ease.out(prog(t, 14.6 + i * .7, .5)).toFixed(2); r.tt.textContent = D.T(r.tt._k); });
    // 3) ovoz
    p.vt.style.opacity = vis[2] ? ease.out(prog(t, 18, .5)).toFixed(2) : 0;
    p.rdr.forEach(function (g, i) { g.style.opacity = ease.out(prog(t, 18.4 + i * .5, .4)).toFixed(2); });
    p.bar.forEach(function (b, i) { var q = ease.out(prog(t, 20.8 + i * .5, .9)); b.r.setAttribute('width', (b.w / 2.74 * 560 * q).toFixed(1)); b.t.style.opacity = q > .6 ? 1 : 0; });
    p.win.style.opacity = vis[2] ? ease.out(prog(t, 22.6, .5)).toFixed(2) : 0;
    var r1 = '{"plate":"12\uac003456","conf":0.913,', r2 = '"cams":["cam1","cam2"],"n":3}  \u2192 gid_slots.json'; p.rt[0].textContent = r1.slice(0, clamp((t - 23.2) * 34, 0, r1.length) | 0); p.rt[1].textContent = r2.slice(0, clamp((t - 24.4) * 34, 0, r2.length) | 0); } });

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
    p.base = el('div', 'abs', root); css(p.base, { left: '1250px', top: '868px', height: '5px', width: '530px', background: C.line, borderRadius: '3px' });
    p.ln = el('div', 'abs', root); css(p.ln, { left: '1250px', top: '868px', height: '5px', width: '0', background: C.acc, borderRadius: '3px' });
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
    var iso = el('div', 'abs', root); css(iso, { left: '330px', top: '380px', width: '640px', height: '400px', transform: 'rotateX(58deg) rotateZ(-34deg)', transformStyle: 'preserve-3d' });
    p.ls = LAYER.map(function (L0, i) {
      var c = el('div', '', iso); css(c, { position: 'absolute', left: 0, top: 0, width: '640px', height: '400px', borderRadius: '26px', background: L0.fill, boxShadow: '0 0 0 1px rgba(255,255,255,.08)', color: L0.ink });
      var bar = el('div', '', c); css(bar, { position: 'absolute', left: '36px', top: '34px', width: '70px', height: '10px', borderRadius: '5px', background: L0.ink, opacity: .55 });
      var f = el('div', '', c, L0.f); css(f, { position: 'absolute', left: '36px', top: '326px', font: '700 40px var(--mono)' });
      var d = el('div', '', c); css(d, { position: 'absolute', left: '36px', top: '88px', font: '400 24px var(--mono)', opacity: .6, whiteSpace: 'pre' }); d.textContent = ['SECRET=••••', '*.tmpl → ${VAR}', 'site: <site-A>', 'engines: [...]'][i];
      return c; });
    p.lb = LAYER.map(function (L0, i) {
      var y = 300 + i * 118, w = el('div', 'abs', root); css(w, { left: '1200px', top: y + 'px', width: '620px' });
      var ln = el('div', '', w); css(ln, { position: 'absolute', left: '-80px', top: '22px', width: '64px', height: '2px', background: L0.col });
      var a = bind(el('div', '', w), 'layers.' + L0.k); css(a, { font: '800 42px var(--sans)', color: L0.col }); var b = bind(el('div', '', w), 'layers.' + L0.k + 's'); css(b, { font: '400 24px var(--sans)', color: C.ink2, marginTop: '4px' }); return w; });
  }, render: function (t) { var p = this; p.h.render(t);
    p.ls.forEach(function (c, i) { var step = 3 - i, q = ease.out(prog(t, 1.2 + step * 1.0, .9)); var z = i === 0 ? 0 : 0; var final = (3 - i) * 96, from = final + 300; c.style.opacity = q.toFixed(3); c.style.transform = 'translateZ(' + (from + (final - from) * q).toFixed(1) + 'px)'; });
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
  var S = 48, OX = 1440, OY = 330;
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


  // ───────────────── x1flow / x1gain: 7 RTSP kamera Rhino Pi X1 (QCS8550) ichida (2026-11-18, .181, 내곡 videolari) ─────────────────
  L('x1flow', {
    ko: { t: 'X1: 카메라 7대, 장비 하나', s: 'RTSP 스트림이 장비의 각 부품을 지나는 길 · 내곡 주유소 1080p · 10 fps', cam: 'RTSP · H.265 1080p',
      st1: '디코드', st2: '텐서', st3: '감지', st4: '추적', st5: '크롭', st6: '판독', st7: '기록',
      vpu_d: '비디오 디코더 · qtic2vdec', gpu_d: 'Adreno 740 · OpenCL', npu_d: 'Hexagon · QNN 2.36 · uint8', cpu_d: 'Kryo 6코어 · Python',
      vpu1: 'H.265 1080p 디코드 · 7대 × 10 fps = 70 fps', vpu2: '프레임은 dmabuf에 그대로 (CPU 복사 없음)',
      gpu1: '디코더 버퍼를 직접 읽음 (zero-copy)', gpu2: 'NV12 → 감지 입력 640×640 uint8', gpu3: '금지 구역(Banned)을 회색으로 칠함', gpu4: '번호판용 프레임을 GPU 링에 보관 (0.2초마다)', gpu5: '차량 크롭 → 번호판 모델 입력', gpu6: '번호판 크롭 → 문자 모델 입력',
      npu1: '차량 감지 (det, 5 클래스)', npu2: '번호판 위치 (plate)', npu3: '문자 66 클래스 (char)',
      cpu1: 'NMS · 출력 해석 (0.2–0.4 ms)', cpu2: 'ByteTrack 추적 (차량 ID)', cpu3: '문자 조립 → 번호판 텍스트, 형식 검사', cpu4: '<cam>.jsonl 기록 → gid 프로세스',
      row: '추적 · 번호판', now: '이번 단계', sum_l: '같은 영상 · 처음 11분 평균', sum_t: '결과', sum1: 'CPU 전체', sum2: 'AI 몫', sum3: '디코드 fps', sum4: 'CPU 최고 온도', ram: 'RAM 3.6 / 15 GB · AI ≈ 1.75 GB (NPU·디코더 버퍼 포함)',
      c0: '<b>카메라 7대</b>의 RTSP 스트림이 X1 장비 하나로 들어옵니다.', c1: '<b>VPU</b>가 디코드하고, 프레임은 dmabuf에 남습니다.', c2: '<b>GPU</b>가 그 버퍼를 직접 읽어 감지 입력을 만듭니다.', c3: '<b>NPU</b>가 차량을 찾습니다.', c4: '<b>CPU</b>는 가벼운 일만 합니다: NMS와 추적.', c5: '다시 <b>GPU</b>: 차량과 번호판을 잘라 모델 입력으로 만듭니다.', c6: '<b>NPU</b>가 번호판과 문자를 읽습니다.', c7: '<b>CPU</b>가 문자를 조립해 <b>jsonl</b>에 씁니다.', c8: '같은 영상에서 <b>CPU 68% → 41%</b>, 모든 카메라가 10 fps를 유지합니다.' },
    en: { t: 'X1: 7 cameras, one device', s: 'Where each RTSP stream goes inside the device · Naegok station 1080p · 10 fps', cam: 'RTSP · H.265 1080p',
      st1: 'decode', st2: 'tensor', st3: 'detect', st4: 'track', st5: 'crop', st6: 'read', st7: 'write',
      vpu_d: 'Video decoder · qtic2vdec', gpu_d: 'Adreno 740 · OpenCL', npu_d: 'Hexagon · QNN 2.36 · uint8', cpu_d: 'Kryo, 6 cores · Python',
      vpu1: 'Decodes H.265 1080p · 7 cams × 10 fps = 70 fps', vpu2: 'Frames stay in the dmabuf (no CPU copy)',
      gpu1: 'Reads the decoder buffer directly (zero-copy)', gpu2: 'NV12 → detector input 640×640 uint8', gpu3: 'Paints Banned zones grey', gpu4: 'Keeps the plate frame in a GPU ring (every 0.2 s)', gpu5: 'Car crop → plate model input', gpu6: 'Plate crop → char model input',
      npu1: 'Vehicle detection (det, 5 classes)', npu2: 'Plate box (plate)', npu3: 'Characters, 66 classes (char)',
      cpu1: 'NMS · output decoding (0.2–0.4 ms)', cpu2: 'ByteTrack tracking (car IDs)', cpu3: 'Chars → plate text, format check', cpu4: 'Writes <cam>.jsonl → gid process',
      row: 'tracks · plates', now: 'this step', sum_l: 'Same video · first 11 minutes, average', sum_t: 'Result', sum1: 'CPU total', sum2: 'AI share', sum3: 'Decoded fps', sum4: 'CPU max temp', ram: 'RAM 3.6 / 15 GB · AI ≈ 1.75 GB (incl. NPU / decoder buffers)',
      c0: '<b>Seven cameras</b> stream RTSP into one X1 device.', c1: 'The <b>VPU</b> decodes; the frames stay in the dmabuf.', c2: 'The <b>GPU</b> reads that buffer directly and builds the detector input.', c3: 'The <b>NPU</b> finds the cars.', c4: 'The <b>CPU</b> does only the light work: NMS and tracking.', c5: 'The <b>GPU</b> again: it cuts cars and plates into model inputs.', c6: 'The <b>NPU</b> reads the plate and its characters.', c7: 'The <b>CPU</b> assembles the text and writes the <b>jsonl</b>.', c8: 'On the same video: <b>CPU 68% → 41%</b>, and every camera holds 10 fps.' },
    uz: { t: 'X1: 7 kamera, bitta qurilma', s: 'RTSP oqim qurilmaning qaysi qismlaridan o\'tadi · 내곡 주유소 1080p · 10 fps', cam: 'RTSP · H.265 1080p',
      st1: 'dekod', st2: 'tensor', st3: 'aniqlash', st4: 'kuzatish', st5: 'kesish', st6: 'o\'qish', st7: 'yozish',
      vpu_d: 'Video dekoder · qtic2vdec', gpu_d: 'Adreno 740 · OpenCL', npu_d: 'Hexagon · QNN 2.36 · uint8', cpu_d: 'Kryo, 6 yadro · Python',
      vpu1: 'H.265 1080p dekodlash · 7 × 10 fps = 70 fps', vpu2: 'Kadr dmabuf\'da qoladi (CPU nusxalamaydi)',
      gpu1: 'Decoder buferini o\'zi o\'qiydi (zero-copy)', gpu2: 'NV12 → det kirishi 640×640 uint8', gpu3: 'Banned zonalarni kulrangga bo\'yaydi', gpu4: 'Raqam kadrini GPU ring\'da saqlaydi (har 0.2 s)', gpu5: 'Mashina kesimi → raqam modeli kirishi', gpu6: 'Raqam kesimi → belgi modeli kirishi',
      npu1: 'Mashina aniqlash (det, 5 sinf)', npu2: 'Raqam joyi (plate)', npu3: 'Belgilar, 66 sinf (char)',
      cpu1: 'NMS · natijani o\'qish (0.2–0.4 ms)', cpu2: 'ByteTrack kuzatish (mashina ID)', cpu3: 'Belgilar → raqam matni, format tekshiruvi', cpu4: '<cam>.jsonl yozadi → gid jarayoni',
      row: 'track · raqam', now: 'shu qadam', sum_l: 'Bir xil video · birinchi 11 daqiqa o\'rtachasi', sum_t: 'Natija', sum1: 'CPU jami', sum2: 'AI ulushi', sum3: 'Dekod fps', sum4: 'CPU eng yuqori harorat', ram: 'RAM 3.6 / 15 GB · AI ≈ 1.75 GB (NPU / dekoder buferlari bilan)',
      c0: '<b>7 ta kamera</b>ning RTSP oqimi bitta X1 qurilmaga kiradi.', c1: '<b>VPU</b> dekodlaydi, kadr dmabuf\'da qoladi.', c2: '<b>GPU</b> o\'sha buferni o\'zi o\'qib, det kirishini yasaydi.', c3: '<b>NPU</b> mashinalarni topadi.', c4: '<b>CPU</b> faqat yengil ish qiladi: NMS va kuzatish.', c5: 'Yana <b>GPU</b>: mashina va raqamni kesib, model kirishiga aylantiradi.', c6: '<b>NPU</b> raqam va belgilarni o\'qiydi.', c7: '<b>CPU</b> belgilarni yig\'ib, <b>jsonl</b>ga yozadi.', c8: 'Bir xil videoda: <b>CPU 68% → 41%</b>, hamma kamera 10 fps\'da.' }
  });
  L('x1gain', {
    ko: { t: '무엇이 바뀌었나: 측정', s: '내곡 7대 · 같은 영상 · 처음 11분 평균 (.181)', r1: '처음 (CPU 크롭)', r2: 'GPU 크롭', r3: '+ zero-copy · uint8 · shared', lg1: 'CPU 전체', lg2: 'AI 몫',
      k1: 'NPU 호출당 CPU', k2: '번호판 판독 (프레임당)', k3: 'CPU 최고 온도', list: 'GPU 작업 목록', s_ok: '완료', s_skip: '안 함', s_next: '다음',
      j1: '헛도는 스레드 제거', j1d: 'CPU 크롭이 사라지자 sched_yield 0', j2: '감지 결과 필터를 GPU로', j2d: 'CPU에서 0.3 ms: 옮길 가치 없음', j3: 'zero-copy', j3d: 'GPU가 디코더 dmabuf를 직접 읽음', j4: '번호판·문자 필터를 GPU로', j4d: 'CPU에서 0.2 ms: 옮길 가치 없음', j5: '번호판 프레임을 GPU에', j5d: 'CPU 복사 대신 GPU 링', j6: '움직임 필터', j6d: '서 있는 차는 다시 읽지 않음', j7: '크롭 묶음 처리', j7d: '효과 작음', j8: 'uint8 모델 + shared buffer', j8d: 'NPU 호출 CPU 5.3 → 2.8 ms',
      c1: '그룹마다 위 막대는 <b>CPU 전체</b>, 아래 막대는 <b>AI 몫</b>입니다.', c2: '<b>GPU 크롭</b>이 CPU를 가장 많이 줄였고, <b>uint8 + zero-copy</b>가 더 줄였습니다.', c3: '<b>움직임 필터</b>는 판독 로직을 바꾸므로 따로 검증합니다.' },
    en: { t: 'What changed: measured', s: 'Naegok, 7 cams · same video · first 11 minutes, average (.181)', r1: 'Before (CPU crops)', r2: 'GPU crops', r3: '+ zero-copy · uint8 · shared', lg1: 'CPU total', lg2: 'AI share',
      k1: 'CPU per NPU call', k2: 'Plate read (per frame)', k3: 'CPU max temp', list: 'GPU task list', s_ok: 'done', s_skip: 'not done', s_next: 'next',
      j1: 'Spinning threads gone', j1d: 'sched_yield fell to 0 once the CPU crops left', j2: 'Detector output filter on the GPU', j2d: '0.3 ms on the CPU: not worth moving', j3: 'Zero-copy', j3d: 'The GPU reads the decoder dmabuf directly', j4: 'Plate / char filter on the GPU', j4d: '0.2 ms on the CPU: not worth moving', j5: 'Plate frame kept on the GPU', j5d: 'A GPU ring instead of a CPU copy', j6: 'Motion filter', j6d: 'A car standing still is not read again', j7: 'Batched crops', j7d: 'Small gain', j8: 'uint8 models + shared buffer', j8d: 'CPU per NPU call 5.3 → 2.8 ms',
      c1: 'In each group the top bar is the <b>CPU total</b>, the bottom bar the <b>AI share</b>.', c2: '<b>GPU crops</b> cut the most CPU; <b>uint8 + zero-copy</b> cut more.', c3: 'The <b>motion filter</b> changes the reading logic, so it is checked separately.' },
    uz: { t: 'Nima o\'zgardi: o\'lchov', s: '내곡 7 kamera · bir xil video · birinchi 11 daqiqa o\'rtachasi (.181)', r1: 'Oldin (CPU kesish)', r2: 'GPU kesish', r3: '+ zero-copy · uint8 · shared', lg1: 'CPU jami', lg2: 'AI ulushi',
      k1: 'NPU chaqiruviga CPU', k2: 'Raqam o\'qish (kadrga)', k3: 'CPU eng yuqori harorat', list: 'GPU ishlari ro\'yxati', s_ok: 'bajarildi', s_skip: 'qilinmadi', s_next: 'navbatda',
      j1: 'Bo\'sh aylanish yo\'qoldi', j1d: 'CPU kesish ketgach sched_yield 0', j2: 'Det natijasini GPU\'da filtrlash', j2d: 'CPU\'da 0.3 ms: ko\'chirishga arzimaydi', j3: 'Zero-copy', j3d: 'GPU decoder dmabuf\'ini o\'zi o\'qiydi', j4: 'Raqam/belgi filtrini GPU\'ga', j4d: 'CPU\'da 0.2 ms: ko\'chirishga arzimaydi', j5: 'Raqam kadri GPU\'da', j5d: 'CPU nusxasi o\'rniga GPU ring', j6: 'Harakat filtri', j6d: 'Turgan mashina qayta o\'qilmaydi', j7: 'Kesishlarni bitta chaqiruvda', j7d: 'Foydasi kichik', j8: 'uint8 model + shared buffer', j8d: 'NPU chaqiruviga CPU 5.3 → 2.8 ms',
      c1: 'Har guruhda yuqori ustun <b>CPU jami</b>, pastkisi <b>AI ulushi</b>.', c2: 'CPU\'ni eng ko\'p <b>GPU kesish</b> kamaytirdi, <b>uint8 + zero-copy</b> yana kamaytirdi.', c3: '<b>Harakat filtri</b> o\'qish mantig\'ini o\'zgartiradi, shuning uchun alohida tekshiriladi.' }
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
    [['sum1', '68 % → 41 %'], ['sum2', '57 % → 31 %'], ['sum3', '66 → 69.5 / 70'], ['sum4', '88 → 62 °C']].forEach(function (q) { var r = el('div', '', p.sum); css(r, { display: 'flex', justifyContent: 'space-between', font: '400 21px/1.55 var(--sans)', color: C.ink2 });
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

  // x1gain: o'lchov (bir xil video, birinchi 11 daqiqa): ikki ustun bitta o'q, 0..100 %
  var XRUNS = [['r1', 68.4, 57.2], ['r2', 51.8, 41.7], ['r3', 40.7, 30.9]];
  var XJOBS = [['j1', 'ok'], ['j2', 'skip'], ['j3', 'ok'], ['j4', 'skip'], ['j5', 'ok'], ['j6', 'next'], ['j7', 'next'], ['j8', 'ok']];
  D.page({ id: 'x1gain', dur: 20, caps: [[1.5, 'x1gain.c1'], [7, 'x1gain.c2'], [13, 'x1gain.c3']], setup: function (root, p) {
    p.h = D.head(p, root);
    var s = svg('svg', { width: 1920, height: 1080 }, root); css(s, { position: 'absolute', left: 0, top: 0, pointerEvents: 'none' });
    var X0 = 470, W = 640, sx = function (v) { return X0 + v / 100 * W; };
    [0, 25, 50, 75, 100].forEach(function (v) { svg('line', { x1: sx(v), y1: 282, x2: sx(v), y2: 690, stroke: v ? '#2c2a27' : '#4a4741', 'stroke-width': v ? 1 : 2 }, s); T_(s, sx(v), 716, v + ' %', { anchor: 'middle', size: 17, mono: true, fill: C.ink2 }); });
    // legend
    p.lg = el('div', 'abs', root); css(p.lg, { left: X0 + 'px', top: '238px', display: 'flex', gap: '28px', font: '500 19px var(--sans)', color: C.ink2 });
    [[C.acc2, 'lg1'], [C.acc, 'lg2']].forEach(function (q) { var it = el('span', '', p.lg); css(it, { display: 'flex', alignItems: 'center', gap: '9px' }); var sw = el('i', '', it); css(sw, { width: '16px', height: '16px', borderRadius: '4px', background: q[0], display: 'inline-block' }); bind(el('span', '', it), 'x1gain.' + q[1]); });
    p.bars = [];
    XRUNS.forEach(function (r, i) { var y = 300 + i * 136;
      var lb = bind(el('div', 'abs', root), 'x1gain.' + r[0]); css(lb, { left: '120px', top: (y + 18) + 'px', width: '330px', font: (i === 2 ? '700 ' : '500 ') + '22px var(--sans)', color: i === 2 ? C.ink : C.ink2, whiteSpace: 'nowrap' });
      [[r[1], C.acc2], [r[2], C.acc]].forEach(function (b, j) { var by = y + j * 40;
        var rect = svg('rect', { x: X0, y: by, width: 0, height: 32, rx: 4, fill: b[1] }, s);
        var v = T_(s, X0, by + 24, Math.round(b[0]) + ' %', { size: 20, mono: true, weight: 700, fill: C.ink }); v.style.opacity = 0;
        p.bars.push({ rect: rect, v: v, val: b[0], w: b[0] / 100 * W, st: 1.2 + i * 1.6 + j * .25 }); }); });
    // ko'rsatkich plitalari
    p.kp = [['k1', '5.3 → 2.8 ms'], ['k2', '24 → 14 ms'], ['k3', '88 → 62 °C']].map(function (q, i) { var w = el('div', 'abs', root); css(w, { left: (120 + i * 340) + 'px', top: '756px', width: '320px', height: '120px', background: C.card, border: '1px solid ' + C.line, borderRadius: '16px', padding: '16px 22px' });
      var a = bind(el('div', '', w), 'x1gain.' + q[0]); css(a, { font: '500 18px var(--sans)', color: C.ink2 }); var b = el('div', '', w, q[1]); css(b, { font: '700 34px var(--mono)', color: C.ink, marginTop: '10px' }); return w; });
    // GPU ishlari ro'yxati
    var lt = bind(el('div', 'abs', root), 'x1gain.list'); css(lt, { left: '1250px', top: '232px', font: '700 26px var(--sans)', color: C.ink }); p.lt = lt;
    p.jobs = XJOBS.map(function (q, i) { var w = el('div', 'abs', root); css(w, { left: '1250px', top: (282 + i * 74) + 'px', width: '560px', height: '64px', background: q[1] === 'ok' ? C.card : 'transparent', border: '1px solid ' + (q[1] === 'ok' ? C.line : '#2c2a27'), borderRadius: '12px', padding: '8px 16px' });
      var n = el('span', 'abs', w, i < 7 ? String(i + 1) : '+'); css(n, { left: '16px', top: '17px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', font: '700 15px/1 var(--mono)', color: '#1b1a19', background: q[1] === 'ok' ? XC.ok : q[1] === 'next' ? XC.warn : XC.grey });
      var a = bind(el('div', 'abs', w), 'x1gain.' + q[0]); css(a, { left: '58px', top: '7px', font: '600 20px var(--sans)', color: q[1] === 'ok' ? C.ink : C.ink2, whiteSpace: 'nowrap' });
      var b = bind(el('div', 'abs', w), 'x1gain.' + q[0] + 'd'); css(b, { left: '58px', top: '35px', font: '400 15px var(--sans)', color: C.ink2, whiteSpace: 'nowrap' });
      var pl = bind(el('span', 'pill ' + (q[1] === 'ok' ? 'ok' : q[1] === 'next' ? 'warn' : 'grey'), w), 'x1gain.s_' + q[1]); css(pl, { position: 'absolute', right: '14px', top: '16px', font: '600 14px var(--sans)', padding: '3px 12px' });
      return w; });
  }, render: function (t) { var p = this; p.h.render(t); fade(p.lg, ease.out(prog(t, 1, .5)));
    p.bars.forEach(function (b) { var q = ease.out(prog(t, b.st, .9)); b.rect.setAttribute('width', (b.w * q).toFixed(1)); b.v.setAttribute('x', (470 + b.w * q + 10).toFixed(1)); b.v.style.opacity = prog(t, b.st + .5, .4).toFixed(2); });
    p.kp.forEach(function (w, i) { rise(w, ease.out(prog(t, 6.2 + i * .35, .6)), 16); });
    fade(p.lt, ease.out(prog(t, 8.6, .5))); p.jobs.forEach(function (w, i) { rise(w, ease.out(prog(t, 9 + i * .35, .5)), 12); }); } });
})();
