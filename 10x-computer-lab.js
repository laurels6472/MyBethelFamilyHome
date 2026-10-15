// ═══ COMPUTER LAB — for the ThinkPad P16s: typing · programming · Unreal Engine 5 · free tools ═══
// Adds (1) a "💻 Computer Lab" tab and (2) a "Computer link-up" box under each school lesson (CompLink).
// Firebase: argilan/school/complab/<pid> = { done:{id:true}, typing:{best:{wpm,acc,ts}, log:{ts:{wpm,acc}}}, mins:{yyyy-mm-dd:n}, ue:{wk:'notes'} }
var CL_GRADE = { mykah: 4, ashelyn: 8, kayla: 11, ryan: 12 };
var CL_WPM_GOAL = { 4: 15, 8: 30, 11: 40, 12: 50 };
var CL_DAY = function () { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };

// ── typing practice text (original sentences — the memory-verse box lets them type NWT text from JW Library) ──
var CL_TYPE = {
  1: ['a sad lad had a salad', 'ask dad if jack has a flag', 'the sun is hot and the sky is blue', 'Jehovah made the sun and the moon', 'we can help mom in the kitchen', 'a red hen sat on ten eggs'],
  2: ['Jehovah made the earth with wisdom, and we get to learn about it every day.', 'Our family cooks, studies and builds things together.', 'A good scientist watches carefully and writes down what happens.', 'Practice a little every day, and your fingers will learn the keys.'],
  3: ['Typing without looking at the keys is a skill that will save you hours of time over the years.', 'Before you save your work, read it again out loud and fix any mistakes you find.', 'A computer follows instructions exactly, so a programmer must be clear, careful and patient.'],
  4: ['Precise instructions matter: a single missing comma, bracket or quotation mark can stop an entire program from running.', 'Good programmers break a big problem into small steps, test each step, and keep notes so they can find mistakes quickly.', 'Using a computer wisely means managing time, protecting private information, and choosing what is upbuilding to watch and read.']
};
function clLevel(grade) { return grade <= 4 ? 1 : grade <= 8 ? 2 : grade <= 11 ? 3 : 4; }

// ── each child's computer path (checklist) ──
var CL_PATH = {
  mykah: [
    ['m1', 'Turn the ThinkPad on and off the right way, and log in.'], ['m2', 'Name the parts: screen, keyboard, touchpad, ports, battery.'],
    ['m3', 'Find the home row (a s d f  j k l ;) and type it with the right fingers.'], ['m4', 'Type your name, your family’s names and 10 kitchen words without looking.'],
    ['m5', 'Make a Scratch project: a character that moves and says something (scratch.mit.edu — free).'], ['m6', 'Use “if” and “repeat” blocks in Scratch.'],
    ['m7', 'Draw a picture of something Jehovah made in a paint program, and save it in the right folder.'], ['m8', 'Type a 5-sentence paragraph about a kitchen experiment and save it.'],
    ['m9', 'Learn the 3 safe-internet rules: ask first, never share private information, tell a parent about anything confusing.'], ['m10', 'Reach 15 words per minute with 90% accuracy.']
  ],
  ashelyn: [
    ['a1', 'Touch-type all three rows with correct fingering (no looking).'], ['a2', 'Reach 30 words per minute with 92% accuracy.'], ['a3', 'Build a Scratch game with a score and a timer.'],
    ['a4', 'Write your first Python program in Thonny (free): print, input, variables.'], ['a5', 'Use a Python loop and an if-statement to make a quiz.'], ['a6', 'Make a spreadsheet (LibreOffice Calc or Google Sheets) with a formula and a chart of a kitchen experiment.'],
    ['a7', 'Write a report in a word processor with a title, headings and page numbers; export to PDF.'], ['a8', 'Use wol.jw.org search to find 3 scriptures and the Insight article on a topic; bookmark them.'],
    ['a9', 'Organize your folders and back up your work to a USB drive.'], ['a10', 'Explain how the internet gets a web page to your screen (draw it).']
  ],
  kayla: [
    ['k1', 'Reach 40 words per minute with 94% accuracy.'], ['k2', 'Python: functions, lists and a program that solves a real math problem from your lessons.'], ['k3', 'Build a web page with HTML and CSS in VS Code (free) — about our family’s kitchen science.'],
    ['k4', 'Add JavaScript: a button that changes something on the page.'], ['k5', 'Spreadsheet: use SUM, AVERAGE, IF and a chart; build a budget for a recipe.'], ['k6', 'Make a slide presentation (LibreOffice Impress or Google Slides) with good design rules.'],
    ['k7', 'Design a simple graphic or logo in Inkscape or Krita (both free).'], ['k8', 'Write an email and a formal letter with correct format and etiquette.'],
    ['k9', 'Make strong passwords, set up a password manager, and explain phishing in your own words.'], ['k10', 'Finish an online computing course (CS50’s Introduction to Programming with Python is free).']
  ],
  ryan: [
    ['r1', 'Reach 50 words per minute with 95% accuracy.'], ['r2', 'Python: classes, files and a small project (a quiz or a budgeting tool).'], ['r3', 'Install Epic Games Launcher and Unreal Engine 5 (free). Install it on your tower’s NVMe drive (see Unreal track).'],
    ['r4', 'Complete the Unreal Engine 5 beginner weeks below (Blueprints first).'], ['r5', 'Try Godot 4 (free, light) for one small 2D game and compare it with Unreal.'], ['r6', 'Use Git and GitHub: make a repository for a project, commit and push.'],
    ['r7', 'Web: build a portfolio page with HTML, CSS and JavaScript.'], ['r8', 'Finish CS50x or CS50P (Harvard, free) problem sets 0–2.'], ['r9', 'Learn what a database is: build one in LibreOffice Base or SQLite (free alternatives to Access).'],
    ['r10', 'Write a plan for a game or app that serves others (education, kindness, Bible-lands exploration) with a schedule and a budget of $0.']
  ]
};

// ── Ryan's Unreal Engine 5 track ──
var CL_UE = [
  ['Week 1 — Set up & check the hardware', 'Open Settings → System → About and write down the processor, RAM and graphics. Your tower (Ryzen 9 9950X3D, RTX 5060 Ti 16 GB, 64 GB RAM) is far above Epic’s recommended 32 GB RAM and 8 GB graphics memory, so you can use full UE5 features. Install the Epic Games Launcher with the engine on the 2 TB NVMe drive (the engine is large) and keep project backups on the hard drives. Make an empty project from the “Blank” template with Starter Content off.'],
  ['Week 2 — The editor', 'Move around the viewport (right-mouse + W A S D), place, move, rotate and scale cubes. Name every object and keep the Outliner organized. Save often. Keep Engine Scalability on High while building; the first time a project opens, shaders compile — be patient.'],
  ['Week 3 — Blueprints, the visual script', 'Make a Blueprint actor that spins. Use Event Tick, variables and a “Print String.” Goal: explain what an event, a variable and a branch are.'],
  ['Week 4 — Build with real measurements', 'Using cubits from Insight on the Scriptures (“Weights and Measures” — about 44.5 cm per cubit) build a simple walkthrough of a Bible structure, such as the tabernacle courtyard, with cubes. Convert cubits to Unreal units (1 unit = 1 cm) in a spreadsheet first.'],
  ['Week 5 — Materials & light (keep it light)', 'Make 3 materials (colors, a texture). Add one directional light and a sky. Your RTX 5060 Ti can run Lumen and Nanite, so try them on, then compare frame rate with them off to see what each costs.'],
  ['Week 6 — Character & movement', 'Start the Third Person template. Change the character speed and jump height with Blueprint variables. Add a safe test level.'],
  ['Week 7 — Triggers and collectibles', 'Make a trigger box and a collectible. Add a counter that goes up when the player touches one. Print the score on the screen.'],
  ['Week 8 — Interface', 'Make a HUD with a score and a timer using the UMG widget editor. Add a “You finished!” screen.'],
  ['Week 9 — Sound and polish', 'Add background and effect sounds (use only sounds you have the right to use — free libraries or ones you record). Tune it so it feels fun.'],
  ['Week 10 — Level design', 'Design a level with a start, a challenge and an end. Idea: “Journey through the Promised Land” using the maps in See the Good Land as a guide. Draw the layout on paper first.'],
  ['Week 11 — Performance', 'Find the frame rate (stat fps), then test on a ThinkPad too. Reduce lights and mesh count until a lower-power computer runs it, and package a test build. Write down what made the biggest difference.'],
  ['Week 12 — Showcase', 'Present your project to the family: demo it, explain your Blueprints, and list what you would add next. Back up the whole project folder.']
];

// ── computer link-up for each school lesson (rotates by day; wording by grade) ──
var CL_LINK = {
  lang: [
    ['⌨️', 'Type today’s writing assignment on the ThinkPad. Use spell-check, then read it aloud and fix three things.', 'LibreOffice Writer or Google Docs (free)'],
    ['🔎', 'Look up three words from the lesson in an online dictionary and type a sentence for each.', 'Free dictionary website'],
    ['📚', 'Type the best sentence from the lesson 3 times with perfect spelling, then check your speed.', 'Typing trainer in the Computer Lab tab']
  ],
  math: [
    ['📊', 'Put today’s problems in a spreadsheet and let the computer check your answers with a formula.', 'LibreOffice Calc or Google Sheets (free)'],
    ['🐍', 'Write a short program that solves one kind of problem from today’s lesson (Scratch for younger students; Python for older ones).', 'Scratch (free) or Thonny/Python (free)'],
    ['📈', 'Make a chart of today’s numbers. Which kind of chart shows it best?', 'LibreOffice Calc or Google Sheets']
  ],
  history: [
    ['🗺️', 'Find the places in today’s lesson on a map and mark them. Compare with the maps in See the Good Land.', 'jw.org / wol.jw.org and a free map tool'],
    ['🕒', 'Build a timeline of today’s events in a spreadsheet or slide with dates in order.', 'LibreOffice Calc / Impress or Google Slides'],
    ['🔎', 'Practice research: find two reliable sources on wol.jw.org or jw.org for today’s topic and list what each says.', 'wol.jw.org search']
  ],
  comp: [
    ['✉️', 'Write today’s piece as a formal email or letter with a greeting, body and closing.', 'LibreOffice Writer or Google Docs'],
    ['🎨', 'Format your final draft: title, headings, spacing, page numbers. Save a PDF.', 'LibreOffice Writer or Google Docs'],
    ['🧐', 'Peer review: share the file with a parent, accept or reject the suggested changes.', 'Google Docs (suggesting mode)']
  ],
  art: [
    ['🖌️', 'Make a digital version of today’s art with a free drawing program. Save it as an image.', 'Krita (free), Inkscape (free), or Paint'],
    ['📷', 'Photograph your art with the Olympus SZ-30 and view it on the ThinkPad.', 'Camera SD card reader'],
    ['🧩', 'Make a pattern with shapes and repeat it with copy-paste. Print or export it.', 'Inkscape or LibreOffice Draw (free)']
  ],
  science: [
    ['📈', 'Enter today’s kitchen-science measurements in a spreadsheet and make a graph.', 'LibreOffice Calc or Google Sheets'],
    ['📷', 'Move your photos from the Olympus SZ-30 to the ThinkPad, rename them, and put 3 in a slide with captions.', 'SD card reader · LibreOffice Impress or Google Slides'],
    ['🔬', 'Use a free simulation or video from jw.org to explore the idea in today’s lesson, then write what you learned.', 'jw.org (Bible Teachings / Science articles)']
  ],
  bible: [
    ['⌨️', 'Type today’s memory verse from JW Library or wol.jw.org, then use the typing trainer’s “my own text” box.', 'Typing trainer in the Computer Lab tab'],
    ['🔎', 'Practice the research tools: use wol.jw.org to find the verse, the Insight article and one picture related to today’s lesson.', 'wol.jw.org · JW Library'],
    ['📝', 'Type your lesson notes and format them with headings so they are easy to review.', 'LibreOffice Writer or Google Docs']
  ]
};
function compLinkFor(subjectId, day, grade) {
  var list = CL_LINK[subjectId]; if (!list) return null;
  var it = list[(parseInt(day) || 0) % list.length];
  var young = grade <= 4;
  return { icon: it[0], task: young ? it[1].replace(/spreadsheet/g, 'chart table') : it[1], tool: it[2] };
}
function CompLink(props) {
  var l = compLinkFor(props.subjectId, props.day, props.grade); if (!l) return null;
  var h = React.createElement;
  return h('div', { style: { background: 'rgba(3,155,229,.1)', border: '1px solid rgba(3,155,229,.35)', borderRadius: 8, padding: '6px 9px', margin: '6px 0' } },
    h('div', { style: { fontSize: 9, color: '#4FC3F7', letterSpacing: 1, marginBottom: 2 } }, '💻 COMPUTER LINK-UP (ThinkPad)'),
    h('div', { style: { fontSize: 10, color: '#ddd', lineHeight: 1.6 } }, l.icon + ' ' + l.task),
    h('div', { style: { fontSize: 9, color: '#81D4FA', marginTop: 2 } }, 'Free tool: ' + l.tool));
}

// ── the Computer Lab tab ──
function clSect(title, open, setOpen, key, body) {
  var h = React.createElement;
  return h('div', { style: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, marginBottom: 10, overflow: 'hidden' } },
    h('div', { onClick: function () { setOpen(open === key ? '' : key); }, style: { padding: '12px 14px', display: 'flex', alignItems: 'center', cursor: 'pointer' } },
      h('div', { style: { flex: 1, fontSize: 15, fontWeight: 900, color: '#fff' } }, title), h('span', { style: { color: '#9ad' } }, open === key ? '▾' : '▸')),
    open === key && h('div', { style: { padding: '0 14px 14px' } }, body));
}
function TypingTrainer(props) {
  var h = React.createElement, grade = props.grade, pid = props.pid, lv = clLevel(grade), goal = CL_WPM_GOAL[grade] || 30;
  var s1 = React.useState(0), idx = s1[0], setIdx = s1[1];
  var s2 = React.useState(''), val = s2[0], setVal = s2[1];
  var s3 = React.useState(0), t0 = s3[0], setT0 = s3[1];
  var s4 = React.useState(null), res = s4[0], setRes = s4[1];
  var s5 = React.useState(''), own = s5[0], setOwn = s5[1];
  var s6 = React.useState(false), useOwn = s6[0], setUseOwn = s6[1];
  var s7 = React.useState(null), best = s7[0], setBest = s7[1];
  React.useEffect(function () { var u = syncOn('school/complab/' + pid + '/typing/best', function (d) { setBest(d || null); }); return function () { if (u) u(); }; }, [pid]);
  var list = CL_TYPE[lv], target = useOwn && own.trim() ? own.trim() : list[idx % list.length];
  function onType(e) {
    var v = e.target.value; if (res) return;
    if (!t0 && v.length) setT0(Date.now());
    setVal(v);
    if (v.length >= target.length) {
      var ms = Date.now() - (t0 || Date.now()), mins = Math.max(ms / 60000, 0.05), ok = 0;
      for (var i = 0; i < target.length; i++) if (v[i] === target[i]) ok++;
      var acc = Math.round(100 * ok / Math.max(v.length, 1)), wpm = Math.round((target.length / 5) / mins);
      var r = { wpm: wpm, acc: acc, ts: Date.now() }; setRes(r);
      try { syncSet('school/complab/' + pid + '/typing/log/' + r.ts, { wpm: wpm, acc: acc, len: target.length }); } catch (x) {}
      if (acc >= 85 && (!best || wpm > best.wpm)) { try { syncSet('school/complab/' + pid + '/typing/best', r); } catch (x) {} setBest(r); }
      try { playSound(acc >= 90 ? 'success' : 'claim'); } catch (x) {}
    }
  }
  function next() { setIdx(idx + 1); setVal(''); setT0(0); setRes(null); }
  var chars = target.split('').map(function (c, i) {
    var typed = val[i], col = typed == null ? 'rgba(255,255,255,.45)' : typed === c ? '#81C784' : '#EF5350';
    return h('span', { key: i, style: { color: col, background: i === val.length ? 'rgba(255,255,255,.2)' : 'none', fontSize: 18, fontFamily: 'monospace' } }, c);
  });
  return h('div', null,
    h('div', { style: { fontSize: 12, color: '#9ad', marginBottom: 6 } }, 'Goal for your grade: ' + goal + ' words per minute with 90%+ accuracy.' + (best ? '  Your best: ' + best.wpm + ' wpm (' + best.acc + '%)' : '')),
    h('div', { style: { background: 'rgba(0,0,0,.3)', borderRadius: 10, padding: 12, lineHeight: 1.7, marginBottom: 8, wordBreak: 'break-word' } }, chars),
    h('textarea', { value: val, onChange: onType, rows: 3, autoCapitalize: 'off', autoCorrect: 'off', spellCheck: false, placeholder: 'Start typing here…', style: { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 16, fontFamily: 'monospace' } }),
    res ? h('div', { style: { margin: '8px 0', padding: 10, borderRadius: 10, background: res.acc >= 90 ? 'rgba(76,175,80,.2)' : 'rgba(255,152,0,.2)', color: '#fff', fontSize: 14, fontWeight: 800 } }, '⏱ ' + res.wpm + ' wpm · ' + res.acc + '% accurate ' + (res.acc >= 90 ? '— great job!' : '— slow down a little and aim for accuracy first.')) : null,
    h('div', { style: { display: 'flex', gap: 8, marginTop: 6 } },
      h('button', { onClick: next, style: { flex: 1, background: '#039BE5', color: '#fff', border: 'none', borderRadius: 20, padding: 10, fontWeight: 800, cursor: 'pointer' } }, res ? 'Next sentence ›' : 'Skip ›'),
      h('button', { onClick: function () { setUseOwn(!useOwn); next(); }, style: { flex: 1, background: 'rgba(255,255,255,.1)', color: '#ddd', border: 'none', borderRadius: 20, padding: 10, fontWeight: 800, cursor: 'pointer' } }, useOwn ? 'Use practice sentences' : 'Type my own text')),
    useOwn ? h('div', { style: { marginTop: 8 } }, h('textarea', { value: own, onChange: function (e) { setOwn(e.target.value); setVal(''); setT0(0); setRes(null); }, rows: 2, placeholder: 'Paste or type your memory verse or lesson sentence here (from JW Library or wol.jw.org), then type it above.', style: { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 13 } })) : null,
    h('div', { style: { fontSize: 11, color: '#9ad', marginTop: 8, lineHeight: 1.5 } }, 'Free extra practice: typing.com · TypingClub · Keybr · Monkeytype (all free in a web browser). Sit up straight, keep your wrists level, and look at the screen, not your hands.'));
}
function ClChecklist(props) {
  var h = React.createElement, pid = props.pid, items = props.items;
  var s = React.useState({}), done = s[0], setDone = s[1];
  React.useEffect(function () { var u = syncOn('school/complab/' + pid + '/done', function (d) { setDone(d || {}); }); return function () { if (u) u(); }; }, [pid]);
  function tog(id) { var v = !done[id]; var n = Object.assign({}, done); n[id] = v; setDone(n); try { syncSet('school/complab/' + pid + '/done/' + id, v); } catch (x) {} if (v) { try { playSound('success'); } catch (x) {} } }
  var n = items.filter(function (i) { return done[i[0]]; }).length;
  return h('div', null,
    h('div', { style: { height: 8, background: 'rgba(255,255,255,.1)', borderRadius: 6, marginBottom: 8 } }, h('div', { style: { height: 8, width: (100 * n / items.length) + '%', background: '#4CAF82', borderRadius: 6 } })),
    h('div', { style: { fontSize: 11, color: '#9ad', marginBottom: 6 } }, n + ' of ' + items.length + ' done' + (n === items.length ? ' 🏆' : '')),
    items.map(function (it) {
      return h('div', { key: it[0], onClick: function () { tog(it[0]); }, style: { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderTop: '1px solid rgba(255,255,255,.06)', cursor: 'pointer' } },
        h('span', { style: { fontSize: 18 } }, done[it[0]] ? '✅' : '⬜'), h('span', { style: { fontSize: 13, color: done[it[0]] ? '#81C784' : '#eee', lineHeight: 1.5 } }, it[1]));
    }));
}
function UeTrack(props) {
  var h = React.createElement, pid = props.pid;
  var s = React.useState({}), d = s[0], setD = s[1];
  React.useEffect(function () { var u = syncOn('school/complab/' + pid + '/ue', function (x) { setD(x || {}); }); return function () { if (u) u(); }; }, [pid]);
  function setNote(i, key, v) { var n = Object.assign({}, d); n['w' + i] = Object.assign({}, n['w' + i] || {}); n['w' + i][key] = v; setD(n); try { syncSet('school/complab/' + pid + '/ue/w' + i + '/' + key, v); } catch (x) {} }
  return h('div', null,
    h('div', { style: { fontSize: 12, color: '#FFE082', lineHeight: 1.6, marginBottom: 8 } }, 'Unreal Engine 5 is free to download from Epic Games. Do this track on your tower (Ryzen 9 9950X3D, RTX 5060 Ti 16 GB, 64 GB RAM) — it handles full UE5. The ThinkPads have integrated graphics only, so they are best for typing, coding, writing and editing; use Godot 4 there if you want to build a small game away from the tower.'),
    CL_UE.map(function (w, i) {
      var st = d['w' + i] || {};
      return h('div', { key: i, style: { borderTop: '1px solid rgba(255,255,255,.08)', padding: '8px 0' } },
        h('div', { onClick: function () { setNote(i, 'done', !st.done); }, style: { display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' } },
          h('span', { style: { fontSize: 18 } }, st.done ? '✅' : '⬜'), h('b', { style: { color: st.done ? '#81C784' : '#fff', fontSize: 13 } }, w[0])),
        h('div', { style: { fontSize: 12, color: '#ccc', lineHeight: 1.55, margin: '4px 0 6px 26px' } }, w[1]),
        h('input', { value: st.note || '', onChange: function (e) { setNote(i, 'note', e.target.value); }, placeholder: 'What I built / what went wrong / what I learned', style: { marginLeft: 26, width: 'calc(100% - 26px)', boxSizing: 'border-box', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, color: '#fff', padding: 7, fontSize: 12 } }));
    }));
}
function LaptopTime(props) {
  var h = React.createElement, pid = props.pid;
  var s = React.useState(0), start = s[0], setStart = s[1];
  var s2 = React.useState({}), mins = s2[0], setMins = s2[1];
  var s3 = React.useState(0), tick = s3[0], setTick = s3[1];
  React.useEffect(function () { var u = syncOn('school/complab/' + pid + '/mins', function (d) { setMins(d || {}); }); var iv = setInterval(function () { setTick(function (x) { return x + 1; }); }, 20000); return function () { if (u) u(); clearInterval(iv); }; }, [pid]);
  function stop() { var m = Math.max(1, Math.round((Date.now() - start) / 60000)), k = CL_DAY(); var tot = (mins[k] || 0) + m; setStart(0); try { syncSet('school/complab/' + pid + '/mins/' + k, tot); } catch (x) {} var n = Object.assign({}, mins); n[k] = tot; setMins(n); }
  var today = mins[CL_DAY()] || 0, week = 0; for (var i = 0; i < 7; i++) { var dd = new Date(); dd.setDate(dd.getDate() - i); var k2 = dd.getFullYear() + '-' + ('0' + (dd.getMonth() + 1)).slice(-2) + '-' + ('0' + dd.getDate()).slice(-2); week += mins[k2] || 0; }
  return h('div', null,
    h('div', { style: { fontSize: 12, color: '#ccc', lineHeight: 1.6, marginBottom: 8 } }, 'One ThinkPad, four students: take turns. Tap Start when you sit down, Stop when you are done. Mom and Dad can see the time.'),
    start ? h('div', { style: { fontSize: 20, fontWeight: 900, color: '#FFB74D', marginBottom: 8 } }, '⏱ ' + Math.max(0, Math.round((Date.now() - start) / 60000)) + ' min so far') : null,
    h('button', { onClick: function () { start ? stop() : setStart(Date.now()); }, style: { width: '100%', background: start ? '#EF5350' : '#4CAF82', color: '#fff', border: 'none', borderRadius: 22, padding: 12, fontWeight: 900, fontSize: 15, cursor: 'pointer' } }, start ? '⏹ I’m done — save my time' : '▶ I’m starting on the ThinkPad'),
    h('div', { style: { fontSize: 12, color: '#9ad', marginTop: 8 } }, 'Today: ' + today + ' min · Last 7 days: ' + week + ' min'));
}
var CL_FREE = [
  ['📝 Documents, spreadsheets, slides', 'FREE: LibreOffice (Writer, Calc, Impress) installs on the ThinkPad and opens Word, Excel and PowerPoint files. Google Docs, Sheets and Slides are free in the browser. Word, Excel and PowerPoint “for the web” are also free with a free Microsoft account (basic features, online only).'],
  ['💲 If you want real Microsoft 365', 'Prices on Microsoft’s site (checked for this guide): Basic $1.99/month (Outlook and cloud storage only — no desktop Word or Excel). Personal $99.99/year (one person: desktop Word, Excel, PowerPoint, OneNote, Outlook, Copilot). Family $129.99/year (up to 6 people; Copilot for the owner only). Confirm current prices before you buy.'],
  ['🗄 Microsoft Access', 'Access is not part of the home plans above. Free choices that teach the same ideas: LibreOffice Base, or SQLite with “DB Browser for SQLite.” A spreadsheet with filters also covers most family needs.'],
  ['🤖 Copilot', 'The regular Copilot chat on the web and in the app is free (daily limits). It does not work inside your desktop Office apps unless you have a paid Microsoft 365 plan. Copilot Pro stopped being sold in late 2025. For students, use any AI helper only for explaining ideas and checking work — not for doing the assignment.'],
  ['⌨️ Typing', 'FREE: typing.com, TypingClub, Keybr, Monkeytype, and the typing trainer in this tab.'],
  ['👾 Programming', 'FREE: Scratch (Mykah, Ashelyn), Thonny + Python (Ashelyn, Kayla), VS Code (Kayla, Ryan), Godot 4, Unreal Engine 5 (free to download; royalty terms apply only if a product earns a lot — read Epic’s license), GitHub, CS50 from Harvard, freeCodeCamp, Khan Academy computing.'],
  ['🎨 Art and media', 'FREE: Krita (painting), Inkscape (vector graphics), GIMP (photos), Audacity (sound), Shotcut or DaVinci Resolve (video).'],
  ['🛡 Safety on the ThinkPad', 'Windows security is built in and free. Give each child their own standard (not administrator) account, turn on Microsoft Family Safety (free) for time limits and website filtering, and keep updates on. Parents keep the administrator password.'],
  ['📚 JW sources', 'jw.org, wol.jw.org and JW Library are free. Use them for research practice, scripture lookup and memory verses.']
];
function CompLab(props) {
  var h = React.createElement, fam = props.family || [], admin = !!props.isAdmin;
  var kids = fam.filter(function (p) { return p.role === 'child' && p.id !== 'jacob'; });
  var s0 = React.useState(admin && kids[0] ? kids[0].id : props.personId), pid = s0[0], setPid = s0[1];
  var s1 = React.useState('typing'), open = s1[0], setOpen = s1[1];
  var grade = CL_GRADE[pid] || 8, me = fam.filter(function (p) { return p.id === pid; })[0] || {};
  var path = CL_PATH[pid];
  return h('div', { style: { padding: '4px 2px' } },
    h('div', { style: { fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 2 } }, '💻 Computer Lab'),
    h('div', { style: { fontSize: 12, color: '#9ad', marginBottom: 10 } }, 'ThinkPad P16s · learn to type, program, build and use free tools'),
    admin ? h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 } }, kids.map(function (k) { return h('button', { key: k.id, onClick: function () { setPid(k.id); }, style: { background: pid === k.id ? '#039BE5' : 'rgba(255,255,255,.08)', color: '#fff', border: 'none', borderRadius: 20, padding: '6px 12px', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, (k.emoji || '') + ' ' + k.name); })) : null,
    clSect('⌨️ Typing trainer', open, setOpen, 'typing', h(TypingTrainer, { key: pid, pid: pid, grade: grade })),
    path ? clSect('🧭 ' + (me.name || 'My') + '’s computer path', open, setOpen, 'path', h(ClChecklist, { key: pid, pid: pid, items: path })) : null,
    pid === 'ryan' ? clSect('🎮 Unreal Engine 5 — 12 weeks', open, setOpen, 'ue', h(UeTrack, { key: pid, pid: pid })) : null,
    (typeof SeriesStudio === 'function') ? clSect('🎬 Bible Adventures Studio (team series)', open, setOpen, 'series', h(SeriesStudio, { pid: pid, isAdmin: admin })) : null,
    (typeof LabSummary === 'function') ? clSect('🎓 What we are learning', open, setOpen, 'sum', h(LabSummary, { pid: admin ? null : pid })) : null,
    (typeof Stations === 'function') ? clSect('🖥 Pick a computer (5 at once)', open, setOpen, 'stations', h(Stations, { pid: admin ? props.personId : pid, name: admin ? 'Parent' : (me.name || pid), isAdmin: admin })) : null,
    (typeof PhotoBox === 'function') ? clSect('📷 My photos & screenshots', open, setOpen, 'photos', h(PhotoBox, { key: pid, path: 'school/complab/' + pid + '/photos', isAdmin: admin, by: pid })) : null,
    clSect('⏱ ThinkPad time', open, setOpen, 'time', h(LaptopTime, { key: pid, pid: pid })),
    clSect('💸 Free & low-cost tools (and Microsoft)', open, setOpen, 'free', h('div', null, CL_FREE.map(function (r, i) { return h('div', { key: i, style: { borderTop: i ? '1px solid rgba(255,255,255,.07)' : 'none', padding: '7px 0' } }, h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, r[0]), h('div', { style: { fontSize: 12, color: '#ccc', lineHeight: 1.55 } }, r[1])); }))));
}
