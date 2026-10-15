// ═══ HOME ROUTINES: daily micro-habits (morning / afternoon / evening) + Order of Operations (chores & home maintenance) ═══
function rtHash(s) { var h = 5381; s = String(s); for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); }
function rtDay() { return typeof planDayKey === 'function' ? planDayKey() : new Date().toISOString().split('T')[0]; }
var RT_PERIODS = [['morning', '☀️ Morning'], ['afternoon', '🌤 Afternoon'], ['evening', '🌙 Evening']];
var RT_AFTERNOON = ['Put your school things away', 'Clean up after your snack or lunch — dish to the sink', 'Tidy the space you used — desk, table, floor', 'Move your body — go outside or stretch', 'Check your schedule for what is next'];
// 9 glasses of water a day, 3 in each part of the day (they also count on the hydration chart)
function rtWithWater(list, period) {
  var base = period === 'morning' ? 0 : period === 'afternoon' ? 3 : 6, n = list.length, out = list.slice();
  for (var i = 2; i >= 0; i--) { var pos = Math.min(n, Math.floor((i + 1) * (n + 1) / 4)); out.splice(pos, 0, 'Drink a glass of water (' + (base + i + 1) + ' of 9) | 1'); }
  return out;
}
function rtNowPeriod() { var h = new Date().getHours(); return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'; }
function rtDefaults(name, period) {
  var nm = (typeof MORNING_ITEMS !== 'undefined' && MORNING_ITEMS[name]) ? name : 'Ryan';
  if (period === 'morning') return rtWithWater((typeof MORNING_ITEMS !== 'undefined' ? MORNING_ITEMS[nm] : []) || [], 'morning');
  if (period === 'afternoon') return rtWithWater(RT_AFTERNOON, 'afternoon');
  var b = typeof BEDTIME_ITEMS !== 'undefined' ? BEDTIME_ITEMS : {};
  return rtWithWater(['Devices put away at 8 PM'].concat(b[name] || b.Ryan || []), 'evening');
}
function rtList(v) { return Array.isArray(v) ? v.filter(Boolean) : (v && typeof v === 'object' ? Object.values(v).filter(Boolean) : null); }
function rtHabits(name, pid, period, own, all) {
  return rtList(own && own[period]) || rtList(all && all[period]) || rtDefaults(name, period);
}
var RT_CARD = { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: 14, marginBottom: 12 };

function rtParse(label) { var m = String(label).match(/^(.*?)\s*\|\s*(\d+(?:\.\d+)?)\s*$/); if (m) return { text: m[1], mins: +m[2] };
  var t = String(label), x = t.toLowerCase(), mins = /breakfast|eat |lunch|dinner|meal/.test(x) ? 20 : /shower|bath\b/.test(x) ? 10 : /dress|clothes|outfit|hair/.test(x) ? 5 : /daily text|scripture|pray|devotion|worship|bible|read/.test(x) ? 10 : /wake/.test(x) ? 1 : /bed\b|make your bed|make the bed|teeth|face|bathroom|restroom/.test(x) ? 2 : 3;
  return { text: t, mins: mins }; }
function rtClock(sec) { var a = Math.abs(Math.round(sec)); return (sec < 0 ? '+' : '') + Math.floor(a / 60) + ':' + ('0' + (a % 60)).slice(-2); }
function rtHabitSet(pid, id, on, label) {
    try { syncSet('habitsdone/' + rtDay() + '/' + pid + '/' + id, on ? Date.now() : null); } catch (e) {}
    if (typeof mdAward === 'function') { try { var _c = mdCfgDefaults((typeof syncGet === 'function' && syncGet('points_cfg')) || null), _sc = (typeof syncGet === 'function' && syncGet('store/cfg')) || {}; if (on) mdAward(pid, 'h_' + id, _c.habitPts, null, '🌱 ' + (label || 'habit'), mdPtsPerB(_sc)); else { mdRevoke(pid, 'h_' + id, label || 'habit'); mdRevoke(pid, 'h_' + id + '_bonus', label || 'habit'); } } catch (e) {} }
    if (label && /glass of water/i.test(label)) {
      var hid = 'hl_hab_' + rtDay().replace(/-/g, '') + '_' + id;
      try { syncSet('health_log/' + pid + '/' + hid, on ? { id: hid, type: 'water', ts: Date.now(), loggedBy: pid, amount: '8', note: 'Daily habit' } : null); } catch (e) {}
    }
}
function HabitsPanel(props) {
  var h = React.createElement, pid = props.personId, name = props.name || '', only = props.only || null;
  var pS = React.useState(only || rtNowPeriod()), period = pS[0], setPeriod = pS[1];
  var dS = ktUse('habitsdone/' + rtDay() + '/' + pid, {}), done = dS[0] || {};
  var oS = ktUse('habits/' + pid, null), aS = ktUse('habits/__all', null);
  var sdS = ktUse('startday/' + todayKey() + '/' + pid, null), sd = sdS[0] || {};
  var rnS = ktUse('habitsrun/' + rtDay() + '/' + pid, {}), runs = rnS[0] || {};
  var tkS = React.useState(0), setTk = tkS[1];
  React.useEffect(function () { var iv = setInterval(function () { setTk(function (x) { return x + 1; }); }, 1000); return function () { clearInterval(iv); }; }, []);
  function set(id, on, label) { rtHabitSet(pid, id, on, label); }
  function block(p) {
    var list = rtHabits(name, pid, p, oS[0], aS[0]), n = 0;
    var rows = list.map(function (label) { var pr = rtParse(label), id = p + '_' + rtHash(label), on = !!done[id]; if (on) n++; return { id: id, label: pr.text, mins: pr.mins, on: on, ts: done[id] || 0 }; });
    return { rows: rows, n: n };
  }
  var periods = only ? RT_PERIODS.filter(function (x) { return x[0] === only; }) : RT_PERIODS;
  var cur = block(period);
  // when did the current step start? = when the last step was checked off, else when the block started
  var blockStart = runs[period] || (period === 'morning' && sd.dayStart) || 0;
  var lastTs = cur.rows.reduce(function (m, r) { return r.on && r.ts > m ? r.ts : m; }, 0);
  var segStart = lastTs || blockStart, activeIdx = -1;
  for (var q = 0; q < cur.rows.length; q++) { if (!cur.rows[q].on) { activeIdx = q; break; } }
  var sortedTs = cur.rows.filter(function (r) { return r.on; }).map(function (r) { return r.ts; }).sort(function (a, b) { return a - b; });
  function took(r) { var k = sortedTs.indexOf(r.ts), prev = k > 0 ? sortedTs[k - 1] : blockStart; return prev && r.ts > prev ? r.ts - prev : null; }
  function startBlock() { try { syncSet('habitsrun/' + rtDay() + '/' + pid + '/' + period, Date.now()); } catch (e) {} if (typeof tcLink === 'function') tcLink(pid, 'chores', 'Daily habits', true); }
  var canTime = !!blockStart;
  React.useEffect(function () {
    if (!cur.rows.length || cur.n !== cur.rows.length) return;
    var fk = 'fm_hb_' + pid + '_' + rtDay() + '_' + period, got = false; try { got = !!localStorage.getItem(fk); } catch (e) {}
    if (got) return; try { localStorage.setItem(fk, '1'); } catch (e) {}
    if (typeof tcLink === 'function') tcLink(pid, 'chores', '', false);
  });
  return h('div', { style: only ? {} : RT_CARD },
    !only && h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 8 } }, '🌱 My daily habits'),
    !only && h('div', { style: { display: 'flex', gap: 6, marginBottom: 10 } }, periods.map(function (x) { var b = block(x[0]), on = period === x[0]; return h('button', { key: x[0], onClick: function () { setPeriod(x[0]); }, style: { flex: 1, padding: '10px 4px', borderRadius: 14, border: '2px solid ' + (on ? '#FFD54F' : 'rgba(255,255,255,.15)'), background: on ? 'rgba(255,213,79,.15)' : 'transparent', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, x[1], h('div', { style: { fontSize: 12, color: b.n === b.rows.length && b.rows.length ? '#81C784' : '#b8b8c8' } }, b.n + '/' + b.rows.length)); })),
    h('div', { style: { height: 8, background: 'rgba(255,255,255,.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 } }, h('div', { style: { height: '100%', width: (cur.rows.length ? cur.n / cur.rows.length * 100 : 0) + '%', background: cur.n === cur.rows.length ? '#4CAF82' : '#FFD54F', transition: 'width .3s' } })),
    !canTime && cur.rows.length > 0 && cur.n === 0 && h('button', { onClick: startBlock, style: { display: 'block', width: '100%', background: '#039BE5', color: '#fff', border: 'none', borderRadius: 16, padding: 14, fontWeight: 900, fontSize: 16, marginBottom: 10, cursor: 'pointer' } }, '▶ Start — timers will run for each step'),
    cur.rows.map(function (r, idx) {
      var active = idx === activeIdx && canTime, left = active ? r.mins * 60 - (Date.now() - segStart) / 1000 : 0, over = left < 0;
      var pct = active ? Math.max(0, Math.min(100, left / (r.mins * 60) * 100)) : 0, tk = r.on ? took(r) : null;
      return h('div', { key: r.id, style: { marginBottom: 6, borderRadius: 14, overflow: 'hidden', position: 'relative', background: r.on ? 'rgba(76,175,130,.15)' : active ? 'rgba(255,213,79,.12)' : 'rgba(255,255,255,.05)', border: (active ? '2px solid ' + (over ? '#EF5350' : '#FFD54F') : '1px solid ' + (r.on ? 'rgba(76,175,130,.5)' : 'rgba(255,255,255,.1)')) } },
        active && h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: pct + '%', background: over ? 'rgba(239,83,80,.25)' : 'rgba(255,213,79,.22)', transition: 'width 1s linear' } }),
        h('button', { onClick: function () { set(r.id, !r.on, r.label); }, style: { position: 'relative', display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: active ? '16px 12px' : '12px 12px', color: '#fff', fontSize: active ? 17 : 15, cursor: 'pointer' } },
          h('span', { style: { width: 32, height: 32, borderRadius: '50%', border: '2px solid ' + (r.on ? '#4CAF82' : 'rgba(255,255,255,.5)'), background: r.on ? '#4CAF82' : 'transparent', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 } }, r.on ? '✓' : ''),
          h('span', { style: { flex: 1, textDecoration: r.on ? 'line-through' : 'none', opacity: r.on ? .7 : 1, fontWeight: active ? 900 : 500 } }, r.label, active && h('div', { style: { fontSize: 11, fontWeight: 700, color: over ? '#FF8A80' : '#FFD54F' } }, over ? 'Over time — tap the circle when finished' : 'Tap the circle when done — the next timer starts by itself')),
          active ? h('span', { style: { fontSize: 24, fontWeight: 900, fontFamily: 'ui-monospace,Menlo,monospace', color: over ? '#FF8A80' : '#fff' } }, rtClock(left))
            : h('span', { style: { fontSize: 12, color: r.on ? '#81C784' : '#b8b8c8', flexShrink: 0 } }, r.on ? (tk ? rtClock(tk / 1000) : '✓') + (tk ? ' (' + r.mins + ' planned)' : '') : r.mins + ' min')));
    }),
    cur.rows.length > 0 && cur.n === cur.rows.length && h('div', { style: { textAlign: 'center', fontSize: 16, fontWeight: 900, color: '#4CAF82', padding: 8 } }, '🎉 All done!'));
}

// ── Order of Operations ──
function rtMonthKey() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1); }
function rtYearKey() { return String(new Date().getFullYear()); }
function rtWeekNo() { var d = new Date(), j = new Date(d.getFullYear(), 0, 1); return Math.floor(((d - j) / 86400000 + j.getDay()) / 7); }
var RT_EXTRA_MONTHLY = ['Test every smoke detector and carbon monoxide detector — press and hold the test button', 'Check the fire extinguisher gauge is in the green', 'Check the first-aid kit and the emergency flashlight'];
var RT_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var RT_LIB = [
  { key: 'bathroom', re: /bath(room)?\b|shower|toilet/i, title: 'Deep clean the bathroom', pts: 30, cash: 3, mins: 45, steps: ['Take out the dirty towels, rugs and linens and put them in the wash', 'Clear the counter and shelves', 'Spray the shower or tub walls and let the cleaner sit', 'Scrub the shower or tub inside and out, then rinse', 'Scrub the toilet inside (bowl and under the rim) and outside (seat, lid, base)', 'Wash the sink, faucet and counter', 'Wipe the mirror', 'Wipe the baseboards', 'Wash the walls and door where it is splashed', 'Wash the window and sill if there is one', 'Empty the trash and put in a new bag', 'Sweep, then mop the floor', 'Hang fresh towels and put the clean rug down'] },
  { key: 'fridge', re: /refrigerator|fridge/i, title: 'Deep clean the refrigerator', pts: 30, cash: 3, mins: 40, steps: ['Throw away anything old or expired', 'Take everything out and set it on the counter', 'Take out all the shelves and drawers', 'Wash the shelves and drawers in warm soapy water, dry them', 'Wipe the inside walls, door and rubber seals', 'Wipe down the jars, bottles and packages before they go back', 'Put the shelves and drawers back', 'Put everything back, organized by type', 'Wipe the outside and handle'] },
  { key: 'oven', re: /oven|stove|range/i, title: 'Clean the stove and oven', pts: 25, cash: 2.5, mins: 40, steps: ['Make sure everything is off and cool', 'Take off the burner grates and drip pans and soak them', 'Wipe the stovetop', 'Clean the oven inside (spray, wait, scrub, wipe)', 'Wipe the oven door and glass', 'Scrub and dry the grates and pans, put them back', 'Wipe the outside and knobs'] },
  { key: 'windows', re: /window/i, title: 'Wash the windows', pts: 20, cash: 2, mins: 30, steps: ['Dust or vacuum the sill and track', 'Spray the glass', 'Wipe the glass clean with a dry cloth, top to bottom', 'Wipe the frame and sill', 'Check for streaks from the other side'] },
  { key: 'laundry', re: /laundry|wash(ing)? (the )?clothes|towels/i, title: 'Do a load of laundry', pts: 10, cash: 1, mins: 15, steps: ['Sort the clothes (darks, lights, towels)', 'Put one load in, add soap, start the washer', 'Move it to the dryer when it is done', 'Take it out when dry and fold it right away', 'Put the clothes away where they belong'] },
  { key: 'floors', re: /floor|vacuum|mop|sweep/i, title: 'Clean the floors', pts: 15, cash: 1.5, mins: 25, steps: ['Pick up anything on the floor', 'Move chairs and small things out of the way', 'Sweep or vacuum the whole room, including corners and edges', 'Mop hard floors with the mop and cleaner', 'Put everything back'] },
  { key: 'kitchen', re: /kitchen/i, title: 'Clean the kitchen', pts: 20, cash: 2, mins: 30, steps: ['Put away or wash every dish', 'Load and start the dishwasher or wash by hand', 'Wipe the counters', 'Wipe the table', 'Wipe the front of the appliances', 'Clean the sink and faucet', 'Empty the trash and put in a new bag', 'Sweep the floor'] },
  { key: 'trash', re: /trash|garbage|bins?\b/i, title: 'Take out the trash', pts: 8, cash: 0.75, mins: 10, steps: ['Collect trash from every room', 'Tie the bags and take them out', 'Put a new bag in each can', 'Roll the bin to the curb if it is trash day'] },
  { key: 'detectors', re: /smoke|carbon monoxide|detector|fire extinguisher/i, title: 'Safety check: smoke and CO detectors', pts: 20, cash: 2, mins: 20, steps: ['Press and hold the test button on each smoke detector — it should beep loudly', 'Do the same on each carbon monoxide detector', 'Write down any that are weak or chirping', 'Check the fire extinguisher gauge is in the green', 'Tell a parent about anything that needs a new battery or replacing'] },
  { key: 'schoolroom', re: /school ?room|classroom|school area|school things/i, title: 'Reset the school room', pts: 12, cash: 1, mins: 15, steps: ['Put books and supplies back where they live', 'Throw away scrap paper', 'Wipe the table or desk', 'Push in the chairs', 'Lay out tomorrow’s books'] },
  { key: 'bedroom', re: /bedroom|your room|my room|sheets|bed\b/i, title: 'Clean the bedroom', pts: 15, cash: 1.5, mins: 25, steps: ['Strip the bed and put the sheets in the wash', 'Put clothes in the hamper or away', 'Dust the shelves and furniture', 'Vacuum or sweep the floor', 'Make the bed with clean sheets', 'Empty the trash'] }
];
function rtLibFor(label, over) {
  var m = null; for (var i = 0; i < RT_LIB.length; i++) { if (RT_LIB[i].re.test(label || '')) { m = RT_LIB[i]; break; } }
  if (!m) return null;
  var o = (over || {})[m.key] || {}, st = rtList(o.steps) || m.steps;
  return { key: m.key, title: m.title, steps: st, pts: o.pts != null && o.pts !== '' ? +o.pts : m.pts, cash: o.cash != null && o.cash !== '' ? +o.cash : m.cash, mins: m.mins };
}
function rtItems(custom, pid, name, over) {
  var out = { daily: [], weekly: [], monthly: [], yearly: [] }, dn = RT_DAYS[new Date().getDay()];
  var base = { daily: 5, weekly: 10, monthly: 25, yearly: 40 };
  var add = function (freq, label, extra) {
    var lib = rtLibFor(label, over), pts = lib ? lib.pts : base[freq];
    out[freq].push(Object.assign({ id: freq + '_' + rtHash(label), label: label, freq: freq, steps: lib ? lib.steps : null, pts: pts, cash: lib ? lib.cash : Math.round(pts * 0.1 * 4) / 4, est: lib ? lib.mins : null }, extra || {}));
  };
  (typeof CHORES_DAILY !== 'undefined' ? CHORES_DAILY : []).forEach(function (l) { add('daily', l); });
  ((typeof CHORES_WEEKLY !== 'undefined' && CHORES_WEEKLY[dn]) || []).forEach(function (l) { add('weekly', l); });
  (typeof CHORES_MONTHLY !== 'undefined' ? CHORES_MONTHLY : []).concat(RT_EXTRA_MONTHLY).forEach(function (l) { add('monthly', l); });
  (typeof CHORES_YEARLY !== 'undefined' ? CHORES_YEARLY : []).forEach(function (l) { add('yearly', l); });
  (rtList(custom) || []).forEach(function (c) {
    if (!c || !c.label) return; if (c.assignee && c.assignee !== 'any' && c.assignee !== pid) return;
    if (c.freq === 'weekly' && c.weekday != null && c.weekday !== '' && +c.weekday !== new Date().getDay()) return;
    if (!out[c.freq]) return;
    var lib = rtLibFor(c.label, over), steps = (c.steps && String(c.steps).trim()) ? String(c.steps).split('\n').map(function (x) { return x.trim(); }).filter(Boolean) : (lib ? lib.steps : null);
    var pts = c.pts !== '' && c.pts != null ? +c.pts : (lib ? lib.pts : base[c.freq]), cash = c.cash !== '' && c.cash != null ? +c.cash : (lib ? lib.cash : Math.round(pts * 0.1 * 4) / 4);
    out[c.freq].push({ id: c.id || (c.freq + '_' + rtHash(c.label)), label: c.label, freq: c.freq, custom: true, assignee: c.assignee, steps: steps, pts: pts, cash: cash });
  });
  return out;
}
function rtPeriod(freq) { return freq === 'monthly' ? rtMonthKey() : freq === 'yearly' ? rtYearKey() : rtDay(); }
function rtReward(it, mode) { return mode === 'points' ? (it.pts || 0) + ' pts' : '$' + (+it.cash || 0).toFixed(2); }
function OrderOfOps(props) {
  var h = React.createElement, pid = props.personId, name = props.name || '';
  var dS = ktUse('opsdone', {}), done = dS[0] || {}, cS = ktUse('ops/custom', null), lS = ktUse('ops/lib', {}), pgS = ktUse('opsprog', {}), prog = pgS[0] || {};
  var items = rtItems(cS[0], pid, name, lS[0]);
  var mode = (typeof window !== 'undefined' && window._payMode) || 'pay';
  var oS = React.useState({ monthly: false, yearly: false }), open = oS[0], setOpen = oS[1], eS = React.useState(null), ex = eS[0], setEx = eS[1];
  var tk = React.useState(0), setTk = tk[1];
  React.useEffect(function () { var iv = setInterval(function () { setTk(function (x) { return x + 1; }); }, 15000); return function () { clearInterval(iv); }; }, []);
  function rec(it) { var r = done[it.id]; return r && r.period === rtPeriod(it.freq) ? r : null; }
  function pr(it) { var p = prog[it.id]; return p && p.period === rtPeriod(it.freq) ? p : null; }
  function startIt(it) { if (pr(it)) return; if (typeof tcLink === 'function') tcLink(pid, 'chores', it.label.slice(0, 50), true); try { syncSet('opsprog/' + it.id, { period: rtPeriod(it.freq), start: Date.now(), by: pid, label: it.label, steps: {} }); } catch (e) {} }
  function toggleStep(it, i) {
    if (!pr(it) && typeof tcLink === 'function') tcLink(pid, 'chores', it.label.slice(0, 50), true);
    var p = pr(it) || { period: rtPeriod(it.freq), start: Date.now(), by: pid, label: it.label, steps: {} }, st = Object.assign({}, p.steps || {});
    if (st[i]) delete st[i]; else st[i] = true;
    try { syncSet('opsprog/' + it.id, Object.assign({}, p, { steps: st })); } catch (e) {}
  }
  function stepsDone(it) { var p = pr(it); return p ? Object.keys(p.steps || {}).length : 0; }
  function submit(it) {
    var p = pr(it), mins = p && p.start ? Math.max(1, Math.round((Date.now() - p.start) / 60000)) : null;
    var rawC = mode === 'points' ? (it.pts || 0) : (+it.cash || 0);
    if (typeof tcLink === 'function') tcLink(pid, 'chores', '', false);
    try { syncSet('opsdone/' + it.id, { status: 'approved', auto: true, by: pid, byName: name, ts: Date.now(), period: rtPeriod(it.freq), label: it.label, freq: it.freq, mins: mins, pts: it.pts || 0, cash: +it.cash || 0, steps: it.steps ? it.steps.length : 0, credited: { amt: rawC, mode: mode, ts: Date.now() } }); } catch (e) {}
    if (typeof mdAward === 'function') { try { mdAward(pid, 'c_' + it.id, it.pts || 0, rawC, '🧹 ' + it.label.slice(0, 60), mdPtsPerB((typeof syncGet === 'function' && syncGet('store/cfg')) || {})); } catch (e) {} }
    if (false && props.addNotif) { try { props.addNotif('approval', pid, '🧹 ' + (name || pid) + ' finished: ' + it.label.slice(0, 60), it.freq + ' chore' + (mins ? ' · took ' + mins + ' min' : ''), { id: 'ops_' + it.id + '_' + rtPeriod(it.freq) }); } catch (e) {} }
  }
  function undo(it) { try { syncSet('opsdone/' + it.id, null); } catch (e) {} }
  var btn = function (bg, fg, fn, label, bd) { return h('button', { onClick: function (e) { e.stopPropagation(); fn(); }, style: { background: bg, color: fg, border: bd || 'none', borderRadius: 18, padding: '9px 13px', fontWeight: 900, fontSize: 13, cursor: 'pointer', flexShrink: 0 } }, label); };
  function row(it) {
    var r = rec(it), st = r && r.status, p = pr(it), n = it.steps ? it.steps.length : 0, dn = stepsDone(it), isOpen = ex === it.id;
    var allDone = !n || dn >= n;
    var elapsed = p && p.start && !st ? Math.max(0, Math.round((Date.now() - p.start) / 60000)) : null;
    return h('div', { key: it.id, style: { marginBottom: 8, background: st === 'approved' ? 'rgba(76,175,130,.12)' : 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, overflow: 'hidden' } },
      h('div', { onClick: function () { setEx(isOpen ? null : it.id); }, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 10px', cursor: 'pointer' } },
        h('div', { style: { flex: 1, opacity: st === 'approved' ? .7 : 1 } },
          h('div', { style: { fontSize: 14, color: '#fff', lineHeight: 1.4 } }, it.label),
          h('div', { style: { fontSize: 11, color: '#b8b8c8', marginTop: 2 } }, (n ? n + ' steps' + (dn && !st ? ' · ' + dn + ' done' : '') + ' · ' : '') + 'worth ' + rtReward(it, mode) + (elapsed != null ? ' · ⏱ ' + elapsed + ' min' : '') + (r && r.mins ? ' · took ' + r.mins + ' min' : '')),
          st === 'approved' && r.credited && h('div', { style: { fontSize: 12, fontWeight: 800, color: '#81C784', marginTop: 2 } }, '💰 ' + (r.credited.mode === 'points' ? r.credited.amt + ' pts' : '$' + (+r.credited.amt).toFixed(2)) + ' added to your account')),
        !st && n > 0 && h('div', { style: { fontSize: 13, color: '#b8b8c8' } }, isOpen ? '▲' : '▼ steps'),
        !st && n === 0 && btn('#4CAF82', '#000', function () { submit(it); }, '✅ Done'),
        st === 'submitted' && btn('rgba(255,213,79,.2)', '#FFD54F', function () { undo(it); }, '🕓 Waiting', '1px solid #FFD54F'),
        st === 'approved' && h('div', { style: { fontSize: 22 } }, '✅'),
        st === 'redo' && btn('rgba(239,83,80,.2)', '#FF8A80', function () { undo(it); }, '🔁 Redo', '1px solid #EF5350')),
      isOpen && !st && n > 0 && h('div', { style: { padding: '0 10px 12px', borderTop: '1px solid rgba(255,255,255,.08)' } },
        !p && h('div', { style: { padding: '10px 0 4px' } }, btn('#039BE5', '#fff', function () { startIt(it); }, '▶ Start the timer')),
        it.steps.map(function (s, i) {
          var on = !!(p && p.steps && p.steps[i]);
          return h('div', { key: i, onClick: function () { toggleStep(it, i); }, style: { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.05)', cursor: 'pointer' } },
            h('div', { style: { width: 24, height: 24, borderRadius: 6, border: '2px solid ' + (on ? '#4CAF82' : 'rgba(255,255,255,.4)'), background: on ? '#4CAF82' : 'transparent', color: '#000', fontWeight: 900, textAlign: 'center', lineHeight: '20px', flexShrink: 0 } }, on ? '✓' : ''),
            h('div', { style: { fontSize: 14, color: on ? '#8a8a9a' : '#fff', textDecoration: on ? 'line-through' : 'none', lineHeight: 1.4 } }, s));
        }),
        h('div', { style: { marginTop: 10 } }, allDone ? btn('#4CAF82', '#000', function () { submit(it); }, '✅ All done — send for approval (' + rtReward(it, mode) + ')') : h('div', { style: { fontSize: 12, color: '#FFB74D' } }, 'Check off every step to send it for approval (' + dn + '/' + n + ').'))));
  }
  function count(list) { return list.filter(function (it) { var r = rec(it); return r && (r.status === 'approved' || r.status === 'submitted'); }).length; }
  var rot = null;
  if (typeof ROTATION_CHORES !== 'undefined' && typeof KIDS_ROT !== 'undefined') { var ki = KIDS_ROT.indexOf(name); if (ki >= 0) rot = ROTATION_CHORES[(rtWeekNo() + ki) % ROTATION_CHORES.length]; }
  var rotItem = null;
  if (rot) { var rl = rtLibFor(rot.name + ' ' + rot.desc, lS[0]); rotItem = { id: 'rot_' + rtHash(rot.name) + '_' + rtWeekNo(), label: rot.icon + ' This week’s job: ' + rot.name + ' — ' + rot.desc, freq: 'weekly', steps: (rot.items && rot.items.length ? rot.items : (rl ? rl.steps : null)), pts: rl ? rl.pts : 15, cash: rl ? rl.cash : 1.5 }; }
  var section = function (title, list, key) {
    var collapsible = key === 'monthly' || key === 'yearly', isOpen = !collapsible || open[key];
    return h('div', { style: RT_CARD },
      h('div', { onClick: collapsible ? function () { var o = Object.assign({}, open); o[key] = !o[key]; setOpen(o); } : undefined, style: { display: 'flex', alignItems: 'center', cursor: collapsible ? 'pointer' : 'default', marginBottom: isOpen ? 8 : 0 } }, h('div', { style: { flex: 1, fontSize: 16, fontWeight: 900, color: '#fff' } }, title), h('div', { style: { fontSize: 13, color: '#b8b8c8' } }, count(list) + '/' + list.length + (collapsible ? (isOpen ? ' ▲' : ' ▼') : ''))),
      isOpen && list.map(row), isOpen && list.length === 0 && h('div', { style: { fontSize: 13, color: '#b8b8c8' } }, 'Nothing here.'));
  };
  var today = (rotItem ? [rotItem] : []).concat(items.weekly, items.daily);
  return h('div', { style: { padding: '8px 14px 24px' } },
    h('div', { style: { fontSize: 22, fontWeight: 900, color: '#fff' } }, '🧹 Chores & Order of Operations'),
    h('div', { style: { fontSize: 13, color: '#c8c8d8', margin: '2px 0 12px' } }, 'Tap a job to see every step. Check each step off, and the timer shows how long it took. Then send it for approval — money or points go straight into your account.'),
    rot && MYKAH_ASSIST_OK(name) && h('div', { style: { fontSize: 12, color: '#FFB74D', marginBottom: 8 } }, 'Helper job: ' + MYKAH_ASSIST[rot.name]),
    section('📅 Today (' + RT_DAYS[new Date().getDay()] + ')', today, 'today'),
    section('🗓 This month — home maintenance', items.monthly, 'monthly'),
    section('📆 This year', items.yearly, 'yearly'));
}
function MYKAH_ASSIST_OK(name) { return name === 'Mykah' && typeof MYKAH_ASSIST !== 'undefined'; }

function OpsApprovals(props) {
  var h = React.createElement, dS = ktUse('opsdone', {}), all = dS[0] || {}, hS = ktUse('habitsdone/' + rtDay(), {}), hd = hS[0] || {};
  var rows = Object.keys(all).map(function (k) { return Object.assign({ key: k }, all[k]); }).filter(function (r) { return r && r.status === 'submitted'; });
  var fam = props.family || [], nm = function (id) { var p = fam.find(function (x) { return x.id === id; }); return p ? p.emoji + ' ' + p.name : id; };
  function decide(r, ok) {
    var credited = r.credited || null;
    if (ok && !credited) {
      var mode = window._payMode || 'pay', amt = mode === 'points' ? (+r.pts || 0) : (+r.cash || 0);
      if (amt > 0 && typeof window._creditFn === 'function') { try { window._creditFn(r.by, amt, '🧹 ' + (r.label || 'Chore').slice(0, 60), 'ops_' + r.key + '_' + r.period, true); credited = { amt: amt, mode: mode, ts: Date.now() }; } catch (e) {} }
    }
    try { syncSet('opsdone/' + r.key, Object.assign({}, r, { key: undefined, status: ok ? 'approved' : 'redo', decidedAt: Date.now(), credited: credited })); } catch (e) {}
  }
  var habitLine = Object.keys(hd).map(function (pid) { return nm(pid) + ' ' + Object.keys(hd[pid] || {}).length; }).join('  ·  ');
  if (!rows.length && !habitLine) return null;
  return h('div', { style: { background: 'rgba(38,166,154,.1)', border: '1px solid rgba(38,166,154,.4)', borderRadius: 16, padding: 14, margin: '10px 14px' } },
    h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '🧹 Chores to check (' + rows.length + ')'),
    rows.length === 0 && h('div', { style: { fontSize: 13, color: '#b8b8c8' } }, 'Nothing waiting.'),
    rows.map(function (r) { return h('div', { key: r.key, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
      h('div', { style: { flex: 1, fontSize: 13, color: '#fff' } }, h('b', null, nm(r.by)), ' — ' + (r.label || '').slice(0, 90), h('span', { style: { fontSize: 11, color: '#b8b8c8' } }, '  ' + r.freq + (r.mins ? ' · took ' + r.mins + ' min' : '') + ' · pays ' + ((window._payMode || 'pay') === 'points' ? (r.pts || 0) + ' pts' : '$' + (+r.cash || 0).toFixed(2)))),
      h('button', { onClick: function () { decide(r, true); }, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 16, padding: '8px 12px', fontWeight: 900, cursor: 'pointer' } }, '✓'),
      h('button', { onClick: function () { decide(r, false); }, style: { background: 'rgba(239,83,80,.25)', color: '#FF8A80', border: 'none', borderRadius: 16, padding: '8px 12px', fontWeight: 900, cursor: 'pointer' } }, '🔁')); }),
    habitLine && h('div', { style: { marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.12)', fontSize: 12, color: '#ddd' } }, '🌱 Habits checked today: ' + habitLine));
}

// ── Parent setup: edit habit lists + add custom chores ──
function RoutinesAdmin(props) {
  var h = React.createElement, fam = (props.family || []).filter(function (p) { return !p.deleted && p.role === 'child'; });
  var oS = React.useState(false), open = oS[0], setOpen = oS[1], sS = React.useState('__all'), sel = sS[0], setSel = sS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  var hS = ktUse('habits/' + sel, null), cur = hS[0] || {}, cS = ktUse('ops/custom', null), custom = rtList(cS[0]) || [];
  var nf = React.useState({ freq: 'weekly', weekday: '', assignee: 'any', label: '', steps: '', pts: '', cash: '' }), f = nf[0], setF = nf[1];
  var selName = sel === '__all' ? '' : ((fam.find(function (p) { return p.id === sel; }) || {}).name || '');
  function save(period, text) { var arr = text.split('\n').map(function (x) { return x.trim(); }).filter(Boolean); try { syncSet('habits/' + sel + '/' + period, arr.length ? arr : null); setMsg('Saved ' + period + '.'); } catch (e) {} }
  function addChore() { if (!f.label.trim()) return; var id = 'c' + Date.now().toString(36); try { syncSet('ops/custom', custom.concat([Object.assign({}, f, { id: id, label: f.label.trim() })])); setF(Object.assign({}, f, { label: '', steps: '', pts: '', cash: '' })); setMsg('Chore added.'); } catch (e) {} }
  function delChore(id) { try { var next = custom.filter(function (c) { return c.id !== id; }); syncSet('ops/custom', next.length ? next : null); } catch (e) {} }
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 14, width: '100%', boxSizing: 'border-box', marginBottom: 8, fontFamily: 'inherit' };
  return h('div', { style: { margin: '10px 14px' } },
    h('button', { onClick: function () { setOpen(!open); }, style: { width: '100%', textAlign: 'left', background: 'rgba(126,87,194,.15)', border: '1px solid rgba(126,87,194,.5)', borderRadius: 14, padding: 14, color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer' } }, '🌱 Set up habits & chores ' + (open ? '▾' : '▸')),
    open && h('div', { style: Object.assign({}, RT_CARD, { marginTop: 8 }) },
      h('div', { style: { fontSize: 13, color: '#c8c8d8', marginBottom: 8, lineHeight: 1.5 } }, 'Habits are the small daily things (hygiene, getting dressed). One per line. Add " | 3" at the end of a line to give it 3 minutes (it is 2 minutes if you leave it off). Leave a box as it is to use the family default. Pick Everyone or one child.'),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 } }, [{ id: '__all', name: 'Everyone', emoji: '👪' }].concat(fam).map(function (p) { var on = sel === p.id; return h('button', { key: p.id, onClick: function () { setSel(p.id); }, style: { padding: '8px 12px', borderRadius: 18, border: '1px solid ' + (on ? '#9C8DC4' : 'rgba(255,255,255,.2)'), background: on ? '#9C8DC4' : 'transparent', color: on ? '#000' : '#ddd', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, (p.emoji || '') + ' ' + p.name); })),
      RT_PERIODS.map(function (x) {
        var list = rtList(cur[x[0]]) || rtDefaults(selName || 'Ryan', x[0]);
        return h('div', { key: x[0] + sel }, h('div', { style: { fontSize: 14, fontWeight: 800, color: '#fff', margin: '6px 0 4px' } }, x[1]),
          h('textarea', { rows: Math.min(10, list.length + 1), defaultValue: list.join('\n'), id: 'rt_' + x[0], style: inp }),
          h('button', { onClick: function () { var el = document.getElementById('rt_' + x[0]); if (el) save(x[0], el.value); }, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 16, padding: '7px 14px', fontWeight: 800, cursor: 'pointer', marginBottom: 6 } }, 'Save ' + x[0]));
      }),
      h('div', { style: { borderTop: '1px solid rgba(255,255,255,.12)', marginTop: 12, paddingTop: 10 } },
        h('div', { style: { fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 6 } }, '➕ Add your own chore / maintenance job'),
        h('input', { type: 'text', placeholder: 'e.g. Change the air filter', value: f.label, onChange: function (e) { setF(Object.assign({}, f, { label: e.target.value })); }, style: inp }),
        h('div', { style: { display: 'flex', gap: 6 } },
          h('select', { value: f.freq, onChange: function (e) { setF(Object.assign({}, f, { freq: e.target.value })); }, style: inp }, ['daily', 'weekly', 'monthly', 'yearly'].map(function (x) { return h('option', { key: x, value: x, style: { color: '#000' } }, x); })),
          f.freq === 'weekly' && h('select', { value: f.weekday, onChange: function (e) { setF(Object.assign({}, f, { weekday: e.target.value })); }, style: inp }, [h('option', { key: 'any', value: '', style: { color: '#000' } }, 'any day')].concat(RT_DAYS.map(function (d, i) { return h('option', { key: d, value: i, style: { color: '#000' } }, d); }))),
          h('select', { value: f.assignee, onChange: function (e) { setF(Object.assign({}, f, { assignee: e.target.value })); }, style: inp }, [h('option', { key: 'any', value: 'any', style: { color: '#000' } }, 'anyone')].concat(fam.map(function (p) { return h('option', { key: p.id, value: p.id, style: { color: '#000' } }, p.name); })))),
        h('textarea', { rows: 4, placeholder: 'Steps — one per line (optional). Example: Remove the shelves / Wash them / Wipe the walls / Put it all back', value: f.steps, onChange: function (e) { setF(Object.assign({}, f, { steps: e.target.value })); }, style: inp }),
        h('div', { style: { display: 'flex', gap: 6 } },
          h('input', { type: 'number', placeholder: 'Points', value: f.pts, onChange: function (e) { setF(Object.assign({}, f, { pts: e.target.value })); }, style: inp }),
          h('input', { type: 'number', step: '0.25', placeholder: 'Cash $', value: f.cash, onChange: function (e) { setF(Object.assign({}, f, { cash: e.target.value })); }, style: inp })),
        h('button', { onClick: addChore, style: { background: '#7E57C2', color: '#fff', border: 'none', borderRadius: 16, padding: '8px 16px', fontWeight: 800, cursor: 'pointer' } }, 'Add chore'),
        custom.map(function (c) { return h('div', { key: c.id, style: { display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', fontSize: 13, color: '#ddd' } }, h('div', { style: { flex: 1 } }, c.label + ' — ' + c.freq + (c.assignee && c.assignee !== 'any' ? ' · ' + c.assignee : '')), h('button', { onClick: function () { delChore(c.id); }, style: { background: 'transparent', border: 'none', color: '#EF5350', fontSize: 18, cursor: 'pointer' } }, '×')); })),
      h(RtLibEditor, { setMsg: setMsg }),
      msg && h('div', { style: { fontSize: 12, color: '#FFB74D', marginTop: 8 } }, msg)));
}
function RtLibEditor(props) {
  var h = React.createElement, oS = React.useState(false), open = oS[0], setOpen = oS[1], lS = ktUse('ops/lib', {}), over = lS[0] || {};
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 10, color: '#fff', padding: 8, fontSize: 13, width: '100%', boxSizing: 'border-box', marginBottom: 6, fontFamily: 'inherit' };
  function save(k) {
    var st = document.getElementById('lib_s_' + k).value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean), pts = document.getElementById('lib_p_' + k).value, cash = document.getElementById('lib_c_' + k).value;
    try { syncSet('ops/lib/' + k, { steps: st, pts: pts, cash: cash }); props.setMsg('Saved.'); } catch (e) {}
  }
  function reset(k) { try { syncSet('ops/lib/' + k, null); props.setMsg('Back to the default.'); } catch (e) {} }
  return h('div', { style: { borderTop: '1px solid rgba(255,255,255,.12)', marginTop: 12, paddingTop: 10 } },
    h('div', { onClick: function () { setOpen(!open); }, style: { fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer' } }, '📋 Edit the step lists, points & cash for standard jobs ' + (open ? '▾' : '▸')),
    open && RT_LIB.map(function (m) {
      var lib = rtLibFor(m.title + ' ' + m.key, over) || {}, o = over[m.key] || {}, cur = rtList(o.steps) || m.steps;
      return h('div', { key: m.key + JSON.stringify(o), style: { margin: '10px 0', padding: 10, background: 'rgba(0,0,0,.2)', borderRadius: 12 } },
        h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 6 } }, m.title),
        h('textarea', { id: 'lib_s_' + m.key, rows: Math.min(12, cur.length + 1), defaultValue: cur.join('\n'), style: inp }),
        h('div', { style: { display: 'flex', gap: 6 } }, h('input', { id: 'lib_p_' + m.key, type: 'number', placeholder: 'Points', defaultValue: o.pts != null ? o.pts : m.pts, style: inp }), h('input', { id: 'lib_c_' + m.key, type: 'number', step: '0.25', placeholder: 'Cash $', defaultValue: o.cash != null ? o.cash : m.cash, style: inp })),
        h('button', { onClick: function () { save(m.key); }, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 14, padding: '6px 12px', fontWeight: 800, cursor: 'pointer', marginRight: 8 } }, 'Save'),
        h('button', { onClick: function () { reset(m.key); }, style: { background: 'transparent', color: '#c8c8d8', border: '1px solid rgba(255,255,255,.3)', borderRadius: 14, padding: '6px 12px', cursor: 'pointer' } }, 'Use default'));
    }));
}
