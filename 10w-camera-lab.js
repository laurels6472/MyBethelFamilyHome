// ═══ SCIENCE CAMERA LAB — Olympus SZ-30 for the Science Kitchen assignment ═══
// The photos stay on the camera's SD card. The app keeps the student's notes and photo numbers.
// Firebase: argilan/school/camera_log/<studentId>/<yyyy-mm-dd>/<entryId> = { challenge, photoNums, noticed, because, ts }
var CAM_GRADE = { mykah: 4, ashelyn: 8, kayla: 11, ryan: 12 };
var CAM_RULES = [
  'Ask Mom or Dad before you pick up the camera, and always put the strap around your wrist.',
  'Keep the camera away from the stove, steam, sinks and wet hands. Photograph from a few steps back, then zoom in.',
  'Wipe the lens with the soft cloth only. Never touch the glass with your fingers.',
  'Battery is about 200 shots — check it before you start, and put it back on the charger after class.',
  'Take 3 photos of each thing and keep the best one. Write the photo number (shown on the screen when you review it) in the app.'
];
var CAM_TIPS = [
  '🔍 Close-up: pick the close-up (macro) setting, turn the zoom all the way out, and move in until the picture is sharp. This camera can focus as close as about 3 cm (1 inch) when zoomed out.',
  '🔭 Zoom: the 24× zoom reaches far, but zoomed in it needs about 40 cm (16 inches) of space. Step back first, then zoom.',
  '🤚 Hold still: press the button halfway to focus, then all the way down. Rest your elbows on the counter.',
  '💡 Light: use window light. Turn the flash off for close-ups — it washes out the detail.',
  '🎞 Video: it records Full HD video — good for bubbling, boiling, melting and mixing. This camera has no time-lapse, so take a photo every few minutes instead.'
];
var CAM_CHALLENGES = [
  { id: 'before-after', icon: '🥕', title: 'Before & After', what: 'Photograph one ingredient raw, then again after it is cooked or baked. Same angle, same distance.',
    q: ['What changed — color, size, shape, texture?', 'Was the change reversible? (Can you un-cook it?)', 'What energy caused the change, and how do you know?'],
    verse: 'Psalm 104:24; Ecclesiastes 3:11', ref: 'Insight on the Scriptures — “Creation”', skill: 'chemical vs. physical change' },
  { id: 'close-up', icon: '🔍', title: 'Close-Up Detective', what: 'Take close-ups (macro) of three things from the pantry: salt or sugar crystals, flour, and a spice. Try to fill the whole picture with each one.',
    q: ['What shapes do you see in each? Are the crystals all the same?', 'What can you see with the camera that you could not see with your eyes?', 'Which one surprised you most?'],
    verse: 'Job 37:14; Psalm 139:14', ref: 'Enjoy Life Forever! — the lessons on creation', skill: 'structure and observation' },
  { id: 'bubbles', icon: '🫧', title: 'Bubble Watch', what: 'Photograph or film yeast in warm water with sugar, or baking soda meeting vinegar. Take a photo every 2–3 minutes (this camera has no time-lapse).',
    q: ['What is making the bubbles? What gas is it?', 'What did warmth, sugar or time do to the speed?', 'Put your photos in order — what story do they tell?'],
    verse: 'Genesis 1:11, 12; Psalm 104:14', ref: 'Insight on the Scriptures — “Yeast”', skill: 'gas production, cause and effect' },
  { id: 'seed-pattern', icon: '🍎', title: 'Cut It Open', what: 'With an adult cutting, photograph the inside of an apple, tomato, citrus or pepper — across and lengthwise. Close-up on the seeds.',
    q: ['Count the seeds or sections. Is the pattern the same in each one?', 'How is the fruit built to protect and spread its seeds?', 'What does this show about the way Jehovah designed living things?'],
    verse: 'Genesis 1:11; Matthew 6:28', ref: 'Insight on the Scriptures — “Creation”', skill: 'plant structure and design' },
  { id: 'states', icon: '🧊', title: 'Solid, Liquid, Gas', what: 'Photograph butter or chocolate as it melts, ice as it melts, and steam rising from a pot (from a safe distance, zoomed in).',
    q: ['Which state of matter is each picture? What was added or taken away to change it?', 'Where did the steam come from, and where does it go?', 'What happens to the water cycle in your kitchen?'],
    verse: 'Ecclesiastes 1:7; Job 36:27', ref: 'Insight on the Scriptures — “Water”', skill: 'states of matter and the water cycle' },
  { id: 'oil-water', icon: '🫗', title: 'Oil & Water', what: 'Photograph oil and water in a clear glass before shaking, right after shaking, and 5 minutes later. Try again with a drop of dish soap or egg yolk.',
    q: ['What happened when you shook it? What happened over time?', 'What did the soap or egg yolk change?', 'Where do we use this when we cook (salad dressing, mayonnaise)?'],
    verse: 'Psalm 104:24', ref: 'Insight on the Scriptures — “Creation”', skill: 'mixtures and emulsions' },
  { id: 'color-change', icon: '🥬', title: 'Color Detective', what: 'Boil red cabbage to make purple juice. Photograph it, then add lemon juice (acid) and baking soda (base) in separate cups.',
    q: ['What color did each one turn? Put the photos side by side.', 'What is the juice telling you about acids and bases?', 'List 3 other kitchen things you could test and predict first.'],
    verse: 'Proverbs 25:2', ref: 'Insight on the Scriptures — “Wisdom”', skill: 'acids, bases and indicators' },
  { id: 'dissolve', icon: '🧂', title: 'Dissolving Race', what: 'Stir the same spoon of sugar into cold, warm and hot water. Photograph each cup at the start and after 1 minute (adult handles the hot water).',
    q: ['Which dissolved fastest? Why?', 'Can you see any sugar left? Use the close-up to check the bottom of the cup.', 'What variable did you change, and which ones did you keep the same?'],
    verse: 'Psalm 119:90, 91', ref: 'Enjoy Life Forever! — the lessons on creation', skill: 'dissolving and fair testing' },
  { id: 'cooking-design', icon: '🥚', title: 'Egg Science', what: 'Photograph an egg raw (cracked in a dish), soft-cooked and hard-cooked. Close-up on the white and the yolk.',
    q: ['Describe each stage. What happened to the proteins when heated?', 'Which part changed first, the white or the yolk?', 'Why is an egg shell strong even though it is thin?'],
    verse: 'Job 38:36; Psalm 139:14', ref: 'Insight on the Scriptures — “Creation”', skill: 'protein change and structure' },
  { id: 'measure', icon: '📏', title: 'Measure & Show', what: 'Photograph measuring cups, spoons and a scale being used for today’s recipe. Put a ruler beside one ingredient in a close-up.',
    q: ['Write today’s recipe amounts and convert one to a different unit.', 'Why do we measure carefully when baking?', 'How does an exact measurement show good order and care?'],
    verse: 'Proverbs 11:1; 1 Corinthians 14:40', ref: 'Insight on the Scriptures — “Weights and Measures”', skill: 'measurement and unit conversion' },
  { id: 'kitchen-safe', icon: '🧯', title: 'Kitchen Safety Scan', what: 'Photograph 5 kitchen safety items or hazards (fire extinguisher, oven mitts, knife block, wet floor, cord near the stove). Do not stage anything dangerous.',
    q: ['Explain why each item matters.', 'What rule would you add to our kitchen rules?', 'How does caring about safety show love for others?'],
    verse: 'Deuteronomy 22:8; Matthew 22:39', ref: 'Love People—Make Disciples — lessons on showing love', skill: 'safety and responsibility' },
  { id: 'mold-bread', icon: '🍞', title: 'Rise & Crumb', what: 'Photograph bread dough before and after rising, and the crumb (inside) of the baked loaf. Use the close-up on the air holes.',
    q: ['How much did the dough grow? Measure it with a ruler in the photo.', 'What made the holes? What did the yeast eat?', 'What would change if you left the yeast out?'],
    verse: 'Matthew 13:33', ref: 'Insight on the Scriptures — “Yeast”', skill: 'fermentation and expansion' }
];
var CAM_ASK = {
  4: 'Tell what you saw in 2 sentences. Use your senses words: color, shape, smell, feel.',
  8: 'Write 3–4 sentences: what you observed, what caused it, and one question you still have.',
  11: 'Write a short lab note: observation, explanation using the science vocabulary, and one thing you would change to test it better.',
  12: 'Write a lab report paragraph: hypothesis, evidence from your photos, explanation, and a way to improve the experiment. Cite one scripture or Insight article that fits.'
};
function camDayIndex() {
  try { var s = new Date((typeof SCHOOL_START_DATE !== 'undefined' ? SCHOOL_START_DATE : '2026-10-06') + 'T12:00:00'), n = new Date(); n.setHours(12, 0, 0, 0); return Math.max(0, Math.round((n - s) / 86400000)); } catch (e) { return 0; }
}
function CameraLabCard(props) {
  var sid = props.studentId || 'student', grade = CAM_GRADE[sid] || 8;
  var h = React.createElement;
  var st = React.useState(false), open = st[0], setOpen = st[1];
  var st2 = React.useState(camDayIndex() % CAM_CHALLENGES.length), ci = st2[0], setCi = st2[1];
  var st3 = React.useState(''), nums = st3[0], setNums = st3[1];
  var st4 = React.useState(''), noticed = st4[0], setNoticed = st4[1];
  var st5 = React.useState(''), because = st5[0], setBecause = st5[1];
  var st6 = React.useState({}), log = st6[0], setLog = st6[1];
  var st7 = React.useState(''), msg = st7[0], setMsg = st7[1];
  var today = (typeof ktDay === 'function' ? ktDay() : new Date().toISOString().slice(0, 10));
  var path = 'school/camera_log/' + sid + '/' + today;
  React.useEffect(function () { var u = syncOn(path, function (d) { setLog(d || {}); }); return function () { if (u) u(); }; }, [path]);
  var c = CAM_CHALLENGES[ci];
  var done = Object.keys(log).map(function (k) { return log[k]; }).filter(Boolean);
  var inp = { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 14, marginBottom: 8, fontFamily: 'inherit' };
  function save() {
    if (!noticed.trim()) { setMsg('Write what you noticed first.'); return; }
    var id = 'c' + Date.now().toString(36);
    var e = { challenge: c.id, title: c.title, photoNums: nums.trim(), noticed: noticed.trim(), because: because.trim(), grade: grade, ts: Date.now() };
    try { syncSet(path + '/' + id, e); } catch (x) {}
    var n = Object.assign({}, log); n[id] = e; setLog(n);
    setNums(''); setNoticed(''); setBecause(''); setMsg('✅ Saved! Great scientist work.');
    try { playSound('success'); } catch (x) {}
  }
  var box = { background: 'rgba(3,155,229,.08)', border: '1px solid rgba(3,155,229,.35)', borderRadius: 14, padding: '12px 14px', marginBottom: 12 };
  return h('div', { style: box },
    h('div', { onClick: function () { setOpen(!open); }, style: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' } },
      h('span', { style: { fontSize: 26 } }, '📷'),
      h('div', { style: { flex: 1 } },
        h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff' } }, 'Science Camera Lab — Olympus SZ-30'),
        h('div', { style: { fontSize: 11, color: '#9ad' } }, 'Today: ' + c.icon + ' ' + c.title + (done.length ? ' · ' + done.length + ' saved today' : ''))),
      h('span', { style: { color: '#9ad', fontSize: 18 } }, open ? '▾' : '▸')),
    open && h('div', { style: { marginTop: 10 } },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#FFB74D', marginBottom: 4 } }, 'CAMERA RULES'),
      CAM_RULES.map(function (r, i) { return h('div', { key: i, style: { fontSize: 12, color: '#ddd', lineHeight: 1.5, marginBottom: 2 } }, '• ' + r); }),
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#81D4FA', margin: '10px 0 4px' } }, 'HOW TO GET GOOD PHOTOS'),
      CAM_TIPS.map(function (r, i) { return h('div', { key: i, style: { fontSize: 12, color: '#ddd', lineHeight: 1.5, marginBottom: 2 } }, r); }),
      h('div', { style: { borderTop: '1px solid rgba(255,255,255,.1)', marginTop: 12, paddingTop: 10 } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } },
          h('div', { style: { flex: 1, fontSize: 16, fontWeight: 900, color: '#fff' } }, c.icon + ' ' + c.title),
          h('button', { onClick: function () { setCi((ci + 1) % CAM_CHALLENGES.length); setMsg(''); }, style: { background: 'rgba(255,255,255,.1)', color: '#ccc', border: 'none', borderRadius: 20, padding: '5px 11px', fontSize: 11, fontWeight: 800, cursor: 'pointer' } }, 'Another challenge ›')),
        h('div', { style: { fontSize: 13, color: '#fff', lineHeight: 1.55, marginBottom: 8 } }, '📸 ' + c.what),
        h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', marginBottom: 3 } }, 'THINK ABOUT'),
        c.q.map(function (q, i) { return h('div', { key: i, style: { fontSize: 12, color: '#ddd', lineHeight: 1.5 } }, (i + 1) + '. ' + q); }),
        h('div', { style: { fontSize: 11, color: '#9ad', margin: '8px 0' } }, 'Science skill: ' + c.skill + '  ·  Read: ' + c.verse + ' (New World Translation)  ·  ' + c.ref),
        h('div', { style: { fontSize: 12, color: '#FFE082', marginBottom: 8, lineHeight: 1.5 } }, '✏️ ' + (CAM_ASK[grade] || CAM_ASK[8]))),
      h('div', { style: { borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 10 } },
        h('input', { value: nums, onChange: function (e) { setNums(e.target.value); }, placeholder: 'Photo numbers from the camera (like 0012, 0013)', style: inp }),
        h('textarea', { rows: 3, value: noticed, onChange: function (e) { setNoticed(e.target.value); }, placeholder: 'What I noticed…', style: inp }),
        h('textarea', { rows: 2, value: because, onChange: function (e) { setBecause(e.target.value); }, placeholder: 'I think it happened because…', style: inp }),
        h('button', { onClick: save, style: { width: '100%', background: '#039BE5', color: '#fff', border: 'none', borderRadius: 22, padding: 12, fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, '💾 Save my camera notes'),
        msg ? h('div', { style: { fontSize: 12, color: '#81C784', marginTop: 6 } }, msg) : null),
      done.length ? h('div', { style: { marginTop: 12 } },
        h('div', { style: { fontSize: 11, fontWeight: 800, color: '#81C784', marginBottom: 4 } }, 'SAVED TODAY'),
        done.sort(function (a, b) { return a.ts - b.ts; }).map(function (e, i) {
          return h('div', { key: i, style: { background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '7px 10px', marginBottom: 5, fontSize: 12, color: '#ddd', lineHeight: 1.5 } },
            h('b', null, e.title), e.photoNums ? ' · photos ' + e.photoNums : '', h('br'), e.noticed, e.because ? h('div', { style: { color: '#9ad' } }, 'Because: ' + e.because) : null);
        })) : null));
}
