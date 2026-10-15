// ═══ v44 TEAM COOKING CREW, NICKEL BONUSES, HOSPITALITY & FUN PLANNER ═══
var TC_JOBS = ['Wash and chop the vegetables', 'Cook the grain or potatoes', 'Cook the main protein', 'Make the sauce or seasoning', 'Set the table', 'Clean up the kitchen', 'Measure and prepare the ingredients'];
var NB_PRESETS = ['Helped a sibling without being asked', 'Did the job right the first time', 'Kind words or encouragement', 'Finished a hard task without complaining', 'Helped in the kitchen without a reminder', 'Cleaned up more than their own mess'];
var HF_TYPES = { game: ['🎮', 'Video game time'], park: ['🌳', 'Park / outdoor fun'], trip: ['🚌', 'Field trip'], host: ['🏡', 'Hospitality: have guests over'], deliver: ['🍲', 'Cook & deliver a meal'], craft: ['✂️', 'Craft for the congregation'], gift: ['🎁', 'Gift or card'], visit: ['💛', 'Visit / encouragement'] };
var HF_SERVICE = { host: 1, deliver: 1, craft: 1, gift: 1, visit: 1 };
function tcStyle() {
  return {
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: 12, marginBottom: 10 },
    inp: { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, color: '#fff', padding: 7, fontSize: 12, boxSizing: 'border-box' },
    btn: function (bg) { return { background: bg || '#039BE5', color: '#fff', border: 'none', borderRadius: 18, padding: '7px 13px', fontWeight: 800, fontSize: 12, cursor: 'pointer' }; }
  };
}
function tcAward(k, cents, pts, why, key) {
  try { if (typeof fpPay === 'function' && cents > 0) fpPay(k, cents / 100, why, key); } catch (e) {}
  try { if (pts > 0) syncSet('finplan/p/' + k + '/pts/earned/' + key, { n: pts, why: why, ts: Date.now() }); } catch (e) {}
}
function tcId() { return 'i' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36); }

// ── Cook together: each person takes a job for a meal, everyone sees it live ──
function KitchenCrew(props) {
  var h = React.createElement, S = tcStyle(), admin = !!props.isAdmin, me = props.personId, week = props.week;
  var kids = props.kids || [];
  var menu = ktUse('kitchen_menu/' + week, {})[0], days = (menu || {}).days || {};
  var slots = [];
  for (var d = 0; d < 7; d++) ['breakfast', 'lunch', 'dinner', 'snack'].forEach(function (m) { var x = (days[d] || {})[m]; if (x) slots.push({ key: d + '_' + m, d: d, m: m, title: x.title }); });
  var sS = React.useState(''), sel = sS[0], setSel = sS[1];
  var cur = slots.filter(function (x) { return x.key === sel; })[0] || slots.filter(function (x) { return x.m === 'dinner'; })[0] || slots[0];
  var C = fpDoc('kitchencrew/' + week + '/' + (cur ? cur.key : 'none'), {}), doc = C[0], put = C[1];
  var tasks = doc.tasks || {}, ids = Object.keys(tasks);
  var nS = React.useState(''), nt = nS[0], setNt = nS[1];
  if (!slots.length) return h('div', { style: S.card }, h('div', { style: { fontSize: 12, color: '#ddd' } }, 'No meals are on the weekly menu yet. Once a parent approves a menu (the Smart Menu or a kids’ menu), you can plan who does what for each meal here.'));
  var DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function suggest() { var n = Math.max(kids.length, 2); TC_JOBS.slice(0, Math.max(n, 4)).forEach(function (t, i) { var id = tcId() + i; put('tasks/' + id, { t: t, who: kids[i % kids.length] || '', done: false }); }); }
  function addTask() { if (!nt.trim()) return; put('tasks/' + tcId(), { t: nt.trim(), who: admin ? '' : me, done: false }); setNt(''); }
  function pay() {
    var done = ids.filter(function (i) { return tasks[i].done && tasks[i].who && !tasks[i].paid; });
    done.forEach(function (i) { var t = tasks[i]; tcAward(t.who, 5, 1, '👩‍🍳 Cooking crew: ' + t.t, 'crew_' + week + '_' + cur.key + '_' + i); put('tasks/' + i + '/paid', true); });
    var allDone = ids.length > 0 && ids.every(function (i) { return tasks[i].done; });
    var who = {}; ids.forEach(function (i) { if (tasks[i].who) who[tasks[i].who] = 1; });
    var team = Object.keys(who);
    if (allDone && team.length >= 2 && !doc.teamPaid) { team.forEach(function (k) { tcAward(k, 5, 2, '👥 Cooked together', 'crewteam_' + week + '_' + cur.key + '_' + k); }); put('teamPaid', true); }
  }
  var who = {}; ids.forEach(function (i) { if (tasks[i].who) who[tasks[i].who] = 1; });
  var allDone = ids.length > 0 && ids.every(function (i) { return tasks[i].done; });
  return h('div', null,
    h('div', { style: S.card },
      h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 4 } }, '👥 Cook together'),
      h('div', { style: { fontSize: 11, color: '#9ad', marginBottom: 6, lineHeight: 1.5 } }, 'Pick a meal, then each person takes a job: one chops the vegetables while another cooks the rice. Each finished job earns a 5¢ nickel + 1 point. If everyone finishes together, the whole team earns another nickel + 2 points. Everyone sees the changes live on their own device.'),
      h('select', { value: cur.key, onChange: function (e) { setSel(e.target.value); }, style: Object.assign({}, S.inp, { width: '100%' }) }, slots.map(function (x) { return h('option', { key: x.key, value: x.key, style: { color: '#000' } }, DN[x.d] + ' · ' + x.m + ' · ' + x.title); }))),
    h('div', { style: S.card },
      h('div', { style: { fontSize: 13, fontWeight: 900, color: '#FFB74D', marginBottom: 6 } }, cur.title + ' — jobs'),
      ids.length === 0 ? h('div', { style: { fontSize: 12, color: '#ccc', marginBottom: 6 } }, 'No jobs yet.') : null,
      ids.map(function (i) { var t = tasks[i], can = admin || t.who === me;
        return h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' } },
          h('span', { onClick: function () { if (can && !t.paid) put('tasks/' + i + '/done', !t.done); }, style: { fontSize: 20, cursor: can ? 'pointer' : 'default' } }, t.done ? '✅' : '⬜'),
          h('div', { style: { flex: 1, fontSize: 12, color: t.done ? '#9be5bd' : '#eee' } }, t.t + (t.paid ? ' · 5¢ paid' : '')),
          h('select', { value: t.who || '', disabled: !!t.paid, onChange: function (e) { put('tasks/' + i + '/who', e.target.value); }, style: Object.assign({}, S.inp, { width: 92, padding: 4 }) }, h('option', { value: '', style: { color: '#000' } }, 'Who?'), kids.map(function (k) { return h('option', { key: k, value: k, style: { color: '#000' } }, k); })),
          admin && !t.paid ? h('span', { onClick: function () { put('tasks/' + i, null); }, style: { cursor: 'pointer', color: '#EF5350' } }, '✕') : null); }),
      h('div', { style: { display: 'flex', gap: 6, marginTop: 6 } }, h('input', { value: nt, onChange: function (e) { setNt(e.target.value); }, placeholder: 'Add a job…', style: Object.assign({}, S.inp, { flex: 1 }) }), h('button', { onClick: addTask, style: S.btn('#4CAF82') }, 'Add')),
      ids.length === 0 ? h('button', { onClick: suggest, style: Object.assign({}, S.btn('#039BE5'), { marginTop: 8 }) }, '✨ Suggest jobs for everyone') : null,
      allDone && Object.keys(who).length >= 2 ? h('div', { style: { marginTop: 8, fontSize: 12, fontWeight: 800, color: '#81C784' } }, doc.teamPaid ? '🎉 Team bonus paid!' : '🎉 Everyone finished — team bonus waiting for a parent.') : null,
      admin ? h('button', { onClick: pay, style: Object.assign({}, S.btn('#4CAF82'), { marginTop: 8, width: '100%' }) }, '💰 Pay the nickels for finished jobs') : null));
}

// ── Nickel bonus bank (parents award 5¢ or a point any time) ──
function NickelBank(props) {
  var h = React.createElement, S = tcStyle(), kids = props.kids || [], admin = !!props.isAdmin, me = props.personId;
  var kS = React.useState(kids[0] || ''), k = kS[0], setK = kS[1];
  var N = fpDoc('nickels', {}), doc = N[0], put = N[1];
  var rS = React.useState(NB_PRESETS[0]), why = rS[0], setWhy = rS[1];
  function give(cents, pts) { var id = tcId(); put(k + '/' + id, { why: why, c: cents, p: pts, ts: Date.now() }); tcAward(k, cents, pts, '⭐ ' + why, 'nb_' + id); try { if (window._addNotifFn) window._addNotifFn('task', k, '⭐ Bonus!', why + (cents ? ' (+5¢)' : ' (+1 point)'), {}); } catch (e) {} }
  var list = function (pid) { var o = doc[pid] || {}; return Object.keys(o).map(function (i) { return o[i]; }).sort(function (a, b) { return b.ts - a.ts; }); };
  var shown = admin ? kids : [me];
  return h('div', { style: S.card },
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 4 } }, '⭐ Nickel bonuses'),
    h('div', { style: { fontSize: 11, color: '#9ad', marginBottom: 6 } }, 'Small bonuses (5¢ or a point) add up and can be saved for bigger things: craft supplies for the congregation, gifts and kind surprises.'),
    admin ? h('div', null,
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 } }, kids.map(function (x) { return h('button', { key: x, onClick: function () { setK(x); }, style: S.btn(k === x ? '#039BE5' : 'rgba(255,255,255,.1)') }, x); })),
      h('select', { value: why, onChange: function (e) { setWhy(e.target.value); }, style: Object.assign({}, S.inp, { width: '100%', marginBottom: 6 }) }, NB_PRESETS.map(function (p) { return h('option', { key: p, style: { color: '#000' } }, p); })),
      h('div', { style: { display: 'flex', gap: 6 } }, h('button', { onClick: function () { give(5, 0); }, style: S.btn('#4CAF82') }, '+ 5¢ nickel'), h('button', { onClick: function () { give(0, 1); }, style: S.btn('#FF9800') }, '+ 1 point'))) : null,
    shown.map(function (pid) { var l = list(pid); var c = l.reduce(function (a, x) { return a + (x.c || 0); }, 0), p = l.reduce(function (a, x) { return a + (x.p || 0); }, 0);
      return h('div', { key: pid, style: { marginTop: 8, fontSize: 12, color: '#ddd' } }, h('b', null, pid + ': '), c + '¢ and ' + p + ' pts from bonuses', l.slice(0, 4).map(function (x, i) { return h('div', { key: i, style: { fontSize: 11, color: '#9ad' } }, '• ' + x.why + (x.c ? ' (+5¢)' : ' (+1 pt)')); })); }));
}

// ── Hospitality & Fun planner ──
function HospitalityFun(props) {
  var h = React.createElement, S = tcStyle(), admin = !!props.isAdmin, me = props.personId, kids = props.kids || [];
  var E = fpDoc('hospitality/events', {}), ev = E[0], putE = E[1], Pp = fpDoc('hospitality/people', {}), ppl = Pp[0], putP = Pp[1];
  var fS = React.useState({ type: 'deliver', date: '', time: '', title: '', person: '', notes: '', who: {} }), f = fS[0], setF = fS[1], oS = React.useState(false), openF = oS[0], setOpenF = oS[1];
  var pS = React.useState({ name: '', note: '' }), pf = pS[0], setPf = pS[1];
  var today = new Date().toISOString().slice(0, 10);
  var list = Object.keys(ev).map(function (i) { return Object.assign({ id: i }, ev[i]); }).filter(function (x) { return x && x.title; }).sort(function (a, b) { return (a.date || '9') < (b.date || '9') ? -1 : 1; });
  var people = Object.keys(ppl).map(function (i) { return Object.assign({ id: i }, ppl[i]); }).filter(function (x) { return x && x.name; });
  function save() { if (!f.title.trim() && !HF_TYPES[f.type]) return; var id = tcId(); var t = f.title.trim() || HF_TYPES[f.type][1]; putE(id, { type: f.type, date: f.date, time: f.time, title: t, person: f.person, notes: f.notes, who: f.who, by: me, status: admin ? 'planned' : 'proposed' }); setF({ type: f.type, date: '', time: '', title: '', person: '', notes: '', who: {} }); setOpenF(false); if (!admin) { try { if (window._addNotifFn) window._addNotifFn('task', 'laurel', '📅 Idea for the schedule', me + ' suggested: ' + t, {}); } catch (e) {} } }
  function done(x) {
    putE(x.id + '/status', 'done');
    if (HF_SERVICE[x.type]) Object.keys(x.who || {}).filter(function (k) { return x.who[k]; }).forEach(function (k) { tcAward(k, 5, 2, '💛 Serving others: ' + x.title, 'hf_' + x.id + '_' + k); });
  }
  var fmt = function (d) { try { return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); } catch (e) { return d || 'no date yet'; } };
  var up = list.filter(function (x) { return x.status !== 'done'; }), past = list.filter(function (x) { return x.status === 'done'; });
  return h('div', null,
    h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.65)', lineHeight: 1.5, marginBottom: 8 } }, 'Plan fun, hospitality and service for the whole family. Kids can suggest ideas and a parent approves them. When the family serves others (cooking for someone, a craft, a gift, a visit), each helper earns 5¢ + 2 points. Cooking for others can use a meal from the weekly menu: plan the delivery meal here and make it in “Cook together”.'),
    h('div', { style: Object.assign({}, S.card, { borderColor: 'rgba(255,193,7,.35)' }) }, h('div', { style: { fontSize: 11, color: '#FFE082', lineHeight: 1.5 } }, '💛 Tip for surprise visits: ask the person or their caregiver first, or have an elder or the person’s friend check in. Homebound friends are often tired or unwell, so a short, warm visit (about 20 minutes) with food in disposable containers is usually best. Note any allergies or diet needs so the meal is safe for them.')),
    h('button', { onClick: function () { setOpenF(!openF); }, style: Object.assign({}, S.btn('#4CAF82'), { width: '100%', marginBottom: 10, padding: 11 }) }, openF ? 'Close' : (admin ? '➕ Add to the schedule' : '💡 Suggest an idea')),
    openF ? h('div', { style: S.card },
      h('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 } }, Object.keys(HF_TYPES).map(function (t) { return h('button', { key: t, onClick: function () { setF(Object.assign({}, f, { type: t })); }, style: S.btn(f.type === t ? '#039BE5' : 'rgba(255,255,255,.1)') }, HF_TYPES[t][0] + ' ' + HF_TYPES[t][1]); })),
      h('input', { value: f.title, onChange: function (e) { setF(Object.assign({}, f, { title: e.target.value })); }, placeholder: 'What is the plan? (e.g. Soup for Sister Lee)', style: Object.assign({}, S.inp, { width: '100%', marginBottom: 6 }) }),
      h('div', { style: { display: 'flex', gap: 6, marginBottom: 6 } }, h('input', { type: 'date', value: f.date, min: today, onChange: function (e) { setF(Object.assign({}, f, { date: e.target.value })); }, style: Object.assign({}, S.inp, { flex: 1 }) }), h('input', { value: f.time, onChange: function (e) { setF(Object.assign({}, f, { time: e.target.value })); }, placeholder: 'Time', style: Object.assign({}, S.inp, { width: 80 }) })),
      (f.type === 'host' || f.type === 'deliver' || f.type === 'visit' || f.type === 'gift') ? h('select', { value: f.person, onChange: function (e) { setF(Object.assign({}, f, { person: e.target.value })); }, style: Object.assign({}, S.inp, { width: '100%', marginBottom: 6 }) }, h('option', { value: '', style: { color: '#000' } }, 'For whom? (choose from your list below)'), people.map(function (p) { return h('option', { key: p.id, value: p.id, style: { color: '#000' } }, p.name); })) : null,
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 } }, kids.map(function (k) { var on = f.who[k]; return h('button', { key: k, onClick: function () { var w = Object.assign({}, f.who); w[k] = !w[k]; setF(Object.assign({}, f, { who: w })); }, style: S.btn(on ? '#4CAF82' : 'rgba(255,255,255,.1)') }, (on ? '✓ ' : '') + k); })),
      h('textarea', { value: f.notes, rows: 2, onChange: function (e) { setF(Object.assign({}, f, { notes: e.target.value })); }, placeholder: 'Notes (food needs, what to bring, who drives…)', style: Object.assign({}, S.inp, { width: '100%', marginBottom: 6 }) }),
      h('button', { onClick: save, style: Object.assign({}, S.btn('#4CAF82'), { width: '100%' }) }, admin ? 'Save to schedule' : 'Send to parents')) : null,
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#FFB74D', margin: '6px 0' } }, '📅 Coming up'),
    up.length === 0 ? h('div', { style: { fontSize: 12, color: '#9ad', marginBottom: 8 } }, 'Nothing planned yet. Try a park day, a video game hour, or a meal to deliver.') : null,
    up.map(function (x) { var pn = (ppl[x.person] || {}).name, helpers = Object.keys(x.who || {}).filter(function (k) { return x.who[k]; });
      return h('div', { key: x.id, style: Object.assign({}, S.card, { borderColor: x.status === 'proposed' ? 'rgba(255,152,0,.6)' : 'rgba(255,255,255,.1)' }) },
        h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, HF_TYPES[x.type][0] + ' ' + x.title),
        h('div', { style: { fontSize: 11, color: '#9ad' } }, fmt(x.date) + (x.time ? ' · ' + x.time : '') + (pn ? ' · for ' + pn : '') + (helpers.length ? ' · helpers: ' + helpers.join(', ') : '') + (x.status === 'proposed' ? ' · ⏳ idea from ' + x.by : '')),
        x.notes ? h('div', { style: { fontSize: 11, color: '#ccc', marginTop: 3 } }, x.notes) : null,
        admin ? h('div', { style: { display: 'flex', gap: 6, marginTop: 6 } }, x.status === 'proposed' ? h('button', { onClick: function () { putE(x.id + '/status', 'planned'); }, style: S.btn('#4CAF82') }, '✔ Approve') : h('button', { onClick: function () { done(x); }, style: S.btn('#4CAF82') }, '✓ Done' + (HF_SERVICE[x.type] ? ' (pay helpers)' : '')), h('button', { onClick: function () { putE(x.id, null); }, style: S.btn('#EF5350') }, 'Remove')) : null); }),
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#FFB74D', margin: '10px 0 6px' } }, '💛 Our congregation friends'),
    h('div', { style: { fontSize: 11, color: '#9ad', marginBottom: 6 } }, 'Parents keep this list (names stay in this family’s app only). Add food needs and what they would enjoy.'),
    people.map(function (p) { return h('div', { key: p.id, style: Object.assign({}, S.card, { padding: 8 }) }, h('div', { style: { fontSize: 12, fontWeight: 800, color: '#fff' } }, p.name), p.note ? h('div', { style: { fontSize: 11, color: '#ccc' } }, p.note) : null, admin ? h('span', { onClick: function () { putP(p.id, null); }, style: { fontSize: 11, color: '#EF5350', cursor: 'pointer' } }, 'remove') : null); }),
    admin ? h('div', { style: S.card }, h('input', { value: pf.name, onChange: function (e) { setPf({ name: e.target.value, note: pf.note }); }, placeholder: 'Name', style: Object.assign({}, S.inp, { width: '100%', marginBottom: 6 }) }), h('input', { value: pf.note, onChange: function (e) { setPf({ name: pf.name, note: e.target.value }); }, placeholder: 'Notes: allergies, favorites, best times…', style: Object.assign({}, S.inp, { width: '100%', marginBottom: 6 }) }), h('button', { onClick: function () { if (pf.name.trim()) { putP(tcId(), { name: pf.name.trim(), note: pf.note.trim() }); setPf({ name: '', note: '' }); } }, style: S.btn('#039BE5') }, 'Add friend')) : null,
    past.length ? h('div', { style: { fontSize: 12, color: '#9ad', marginTop: 8 } }, '✓ Finished: ' + past.slice(-5).map(function (x) { return x.title; }).join(' · ')) : null);
}
function KitchenFunTab(props) {
  var h = React.createElement, S = tcStyle(), kids = (props.family || []).map(function (p) { return p.id; }).filter(function (k) { return KC_KIDS.indexOf(k) >= 0; });
  var vS = React.useState('fun'), v = vS[0], setV = vS[1];
  return h('div', null, h('div', { style: { display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' } }, [['fun', '📅 Fun & hospitality'], ['nick', '⭐ Nickel bonuses']].map(function (t) { return h('button', { key: t[0], onClick: function () { setV(t[0]); }, style: S.btn(v === t[0] ? '#039BE5' : 'rgba(255,255,255,.1)') }, t[1]); })),
    v === 'fun' ? h(HospitalityFun, { isAdmin: props.isAdmin, personId: props.personId, kids: kids }) : h(NickelBank, { isAdmin: props.isAdmin, personId: props.personId, kids: kids }));
}
