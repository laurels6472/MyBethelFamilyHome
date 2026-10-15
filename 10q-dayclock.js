// ═══ DAY CLOCK (start/end my day), per-kid stats, admin quick tiles ═══
function dcMerge(ivs) {
  var a = ivs.filter(function (x) { return x[1] > x[0]; }).sort(function (x, y) { return x[0] - y[0]; }), out = [];
  a.forEach(function (x) { var l = out[out.length - 1]; if (l && x[0] <= l[1]) l[1] = Math.max(l[1], x[1]); else out.push([x[0], x[1]]); });
  return out;
}
// seconds of the day that are covered by at least one clock-in (overlaps counted once)
function dcAccounted(data, from, to) {
  var iv = (typeof cdEntries === 'function' ? cdEntries(data || {}) : []).map(function (e) { return [Math.max(e.start, from), Math.min(e.end, to)]; });
  return dcMerge(iv).reduce(function (n, x) { return n + Math.max(0, x[1] - x[0]) / 1000; }, 0);
}
function dcFmt(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60); return h ? h + 'h ' + m + 'm' : m + 'm'; }
function dcTime(ts) { return ts ? new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '—'; }

// Two-tap confirm that works on iPhone/iPad (window.confirm is blocked there)
function DcConfirm(props) {
  var h = React.createElement, aS = React.useState(false), armed = aS[0], setArmed = aS[1];
  React.useEffect(function () { if (!armed) return; var t = setTimeout(function () { setArmed(false); }, 5000); return function () { clearTimeout(t); }; }, [armed]);
  return h('button', { onClick: function () { if (armed) { setArmed(false); props.onConfirm(); } else setArmed(true); }, style: Object.assign({}, props.style, armed ? { background: '#E53935', color: '#fff', border: '1px solid #E53935' } : {}) }, armed ? (props.sure || 'Tap again to confirm') : props.label);
}
function dcResetDay(pid, sessions, onUpdate) {
  var dk = typeof planDayKey === 'function' ? planDayKey() : todayKey(), tk = todayKey();
  ['startday/' + tk + '/' + pid, 'habitsdone/' + dk + '/' + pid, 'habitsrun/' + dk + '/' + pid, 'taskruns/' + dk + '/' + pid, 'plansdone/' + dk + '/' + pid, 'planlog/' + dk + '/' + pid, 'sessions/' + tk + '/' + pid].forEach(function (p) { try { syncSet(p, null); } catch (e) {} });
  if (onUpdate) { var n = Object.assign({}, sessions || {}); delete n[pid]; onUpdate(n); }
}
function DayClock(props) {
  var h = React.createElement, pid = props.personId, key = 'startday/' + todayKey() + '/' + pid;
  var sdS = ktUse(key, null), sd = sdS[0] || {};
  var tS = React.useState(0), setT = tS[1];
  React.useEffect(function () { var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 1000); return function () { clearInterval(iv); }; }, []);
  var data = (props.sessions || {})[pid] || {};
  var now = Date.now(), started = !!sd.dayStart, ended = !!sd.dayEnd, end = ended ? sd.dayEnd : now;
  var total = started ? (end - sd.dayStart) / 1000 : 0;
  var acc = started ? dcAccounted(data, sd.dayStart, end) : 0, un = Math.max(0, total - acc);
  function startDay() { try { syncSet(key, Object.assign({}, sd, { dayStart: Date.now(), dayEnd: null, clockedAt: sd.clockedAt || Date.now() })); } catch (e) {} }
  function endDay() {
    if (typeof clockOutAll === 'function') clockOutAll(pid, props.sessions || {}, props.onUpdate);
    try { syncSet(key, Object.assign({}, sd, { dayEnd: Date.now() })); } catch (e) {}
  }
  function startOver() { dcResetDay(pid, props.sessions, props.onUpdate); }
  function reopen() { try { syncSet(key, Object.assign({}, sd, { dayEnd: null })); } catch (e) {} }
  var card = { background: 'linear-gradient(135deg,rgba(76,175,130,.28),rgba(3,155,229,.2))', border: '2px solid ' + (started && !ended ? '#4CAF82' : 'rgba(255,255,255,.25)'), borderRadius: 20, padding: 16, marginBottom: 12 };
  if (!started) return h('div', { style: card },
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: 1 } }, '🕐 MY DAY CLOCK'),
    h('div', { style: { fontSize: 14, color: '#d8d8e8', margin: '4px 0 12px' } }, 'Start this first. It shows how long your whole day was.'),
    h('button', { onClick: startDay, style: { width: '100%', background: '#4CAF82', color: '#000', border: 'none', borderRadius: 18, padding: 20, fontWeight: 900, fontSize: 22, cursor: 'pointer' } }, '▶ Start my day'),
    props.canReset && props.inside && h('div', { style: { margin: '14px -14px 0' } }, props.inside),
    props.canReset && typeof TimerEditor === 'function' && h(TimerEditor, { personId: pid, sessions: props.sessions, onUpdate: props.onUpdate }));
  var cfgD = cfgGet() || {}, hours = cfgD.dayHours != null && cfgD.dayHours !== '' ? +cfgD.dayHours : 10, L = Math.max(1, hours) * 3600;
  var ents = typeof cdEntries === 'function' ? cdEntries(data) : [], depts = typeof CD_DEPTS !== 'undefined' ? CD_DEPTS : [];
  var running = typeof clockActiveList === 'function' ? clockActiveList(data) : [];
  var deptColor = function (act) { var d = depts.filter(function (x) { return x.acts.indexOf(act) !== -1; })[0]; return d ? d.color : '#9E9E9E'; };
  var nameOf = function (id) { return typeof planActLabel === 'function' ? planActLabel(id) : id; };
  var elapsed = Math.min(total, L), frac = elapsed / L;
  // wedges: colored where clocked into something, gray where nothing was clocked, empty where the day has not happened yet
  var cuts = [];
  ents.forEach(function (e) { var a = Math.max(e.start, sd.dayStart), z = Math.min(e.end, sd.dayStart + elapsed * 1000); if (z > a) cuts.push({ a: a, z: z, col: deptColor(e.activity) }); });
  cuts.sort(function (x, y) { return x.a - y.a; });
  var segs = [], cur = sd.dayStart, stop = sd.dayStart + elapsed * 1000;
  cuts.forEach(function (c) { if (c.z <= cur) return; var a = Math.max(c.a, cur); if (a > cur) segs.push({ a: cur, z: a, col: 'rgba(255,255,255,.28)' }); segs.push({ a: a, z: c.z, col: c.col }); cur = c.z; });
  if (stop > cur) segs.push({ a: cur, z: stop, col: 'rgba(255,255,255,.28)' });
  var R = 90, CX = 100, CY = 100;
  function pt(f) { var ang = f * 2 * Math.PI - Math.PI / 2; return [CX + R * Math.cos(ang), CY + R * Math.sin(ang)]; }
  function wedge(f0, f1, col, key) {
    if (f1 - f0 < 0.0005) return null;
    if (f1 - f0 > 0.9995) return h('circle', { key: key, cx: CX, cy: CY, r: R, fill: col });
    var p0 = pt(f0), p1 = pt(f1);
    return h('path', { key: key, d: 'M' + CX + ' ' + CY + ' L' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + ' A' + R + ' ' + R + ' 0 ' + (f1 - f0 > 0.5 ? 1 : 0) + ' 1 ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) + ' Z', fill: col });
  }
  var byDept = {}; ents.forEach(function (e) { var d = depts.filter(function (x) { return x.acts.indexOf(e.activity) !== -1; })[0]; var id = d ? d.id : 'other'; byDept[id] = (byDept[id] || 0) + Math.max(0, Math.min(e.end, end) - Math.max(e.start, sd.dayStart)) / 1000; });
  var mono = 'ui-monospace,Menlo,monospace', hms = function (sec) { sec = Math.max(0, Math.round(sec)); var hh = Math.floor(sec / 3600), mm = Math.floor((sec % 3600) / 60), ss = sec % 60; return (hh ? hh + ':' : '') + ('0' + mm).slice(hh ? -2 : -2) + ':' + ('0' + ss).slice(-2); };
  return h('div', { style: card },
    h('div', { style: { fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: 1 } }, ended ? '🌙 DAY FINISHED' : '🟢 CLOCKED IN — MY DAY IS RUNNING'),
    h('div', { style: { fontSize: 12, color: '#c8c8d8' } }, 'Started ' + dcTime(sd.dayStart) + (ended ? ' · Ended ' + dcTime(sd.dayEnd) : '')),
    h('div', { style: { textAlign: 'center', fontSize: 56, fontWeight: 900, color: '#fff', fontFamily: mono, margin: '6px 0 2px', lineHeight: 1 } }, hms(total)),
    h('div', { style: { textAlign: 'center', fontSize: 12, color: '#c8c8d8', marginBottom: 10 } }, 'time since you started your day'),
    !ended && h('div', { style: { background: running.length ? 'rgba(0,0,0,.28)' : 'rgba(239,83,80,.25)', border: '2px solid ' + (running.length ? 'rgba(129,199,132,.6)' : '#EF5350'), borderRadius: 16, padding: 12, marginBottom: 12 } },
      h('div', { style: { fontSize: 12, fontWeight: 900, color: running.length ? '#81C784' : '#FF8A80', letterSpacing: 1, marginBottom: 6 } }, running.length ? '⏱ CLOCKED INTO' : '⚠️ NOT CLOCKED INTO ANYTHING'),
      !running.length && h('div', { style: { fontSize: 15, color: '#fff' } }, 'Pick what you are doing below so your time counts.'),
      running.map(function (r) { return h('div', { key: r.activity, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' } },
        h('div', { style: { width: 14, height: 14, borderRadius: '50%', background: deptColor(r.activity), flexShrink: 0 } }),
        h('div', { style: { flex: 1, fontSize: 18, fontWeight: 900, color: '#fff' } }, nameOf(r.activity) + (r.with ? ' with ' + r.with : '')),
        h('div', { style: { fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: mono } }, hms((now - r.startTime) / 1000))); })),
    h('div', { style: { display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' } },
      h('svg', { viewBox: '0 0 200 200', width: 190, height: 190, style: { flexShrink: 0 } },
        h('circle', { cx: CX, cy: CY, r: R + 6, fill: 'rgba(255,255,255,.08)' }),
        h('circle', { cx: CX, cy: CY, r: R, fill: 'rgba(0,0,0,.35)' }),
        segs.map(function (g, n) { return wedge((g.a - sd.dayStart) / 1000 / L, (g.z - sd.dayStart) / 1000 / L, g.col, 'w' + n); }),
        h('circle', { cx: CX, cy: CY, r: 44, fill: '#1a1a2e' }),
        h('text', { x: CX, y: CY - 2, textAnchor: 'middle', fill: '#fff', fontSize: 20, fontWeight: 900 }, Math.round(frac * 100) + '%'),
        h('text', { x: CX, y: CY + 16, textAnchor: 'middle', fill: '#b8b8c8', fontSize: 10 }, 'of my day')),
      h('div', { style: { flex: 1, minWidth: 150, fontSize: 13, color: '#fff' } },
        h('div', { style: { fontSize: 11, color: '#b8b8c8', marginBottom: 4 } }, 'The circle fills in as your day goes (' + hours + ' hours = full).'),
        depts.map(function (d) { return byDept[d.id] ? h('div', { key: d.id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' } }, h('div', { style: { width: 12, height: 12, borderRadius: 3, background: d.color } }), h('div', { style: { flex: 1 } }, d.emoji + ' ' + d.label), h('b', null, dcFmt(byDept[d.id]))) : null; }),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' } }, h('div', { style: { width: 12, height: 12, borderRadius: 3, background: 'rgba(255,255,255,.28)' } }), h('div', { style: { flex: 1 } }, 'Not clocked into anything'), h('b', { style: { color: un > 1800 ? '#FF8A80' : '#FFD54F' } }, dcFmt(un))))),
    !ended && !props.canReset && h('button', { onClick: pciOpen, style: { width: '100%', background: '#FF1493', color: '#fff', border: '2px solid #fff', borderRadius: 16, padding: 14, fontWeight: 900, fontSize: 16, cursor: 'pointer', marginTop: 10 } }, '👋 Check in with Mom & Dad'),
    !ended && h(DcConfirm, { onConfirm: endDay, label: '🌙 End my day', sure: 'Tap again to end my day', style: { width: '100%', background: 'rgba(239,83,80,.25)', color: '#FF8A80', border: '1px solid #EF5350', borderRadius: 16, padding: 12, fontWeight: 900, fontSize: 15, cursor: 'pointer', marginTop: 12 } }),
    props.canReset && h(DcConfirm, { onConfirm: startOver, label: '↺ Start today over (parent only)', sure: 'Tap again — this clears today', style: { display: 'block', marginTop: 8, background: 'transparent', color: '#FFB74D', border: '1px solid #FFB74D', borderRadius: 14, padding: '10px 14px', fontSize: 13, cursor: 'pointer' } }),
    props.inside && h('div', { style: { margin: '14px -14px 0' } }, props.inside),
    props.canReset && typeof TimerEditor === 'function' && h(TimerEditor, { personId: pid, sessions: props.sessions, onUpdate: props.onUpdate }),
    ended && h('button', { onClick: reopen, style: { background: 'transparent', color: '#c8c8d8', border: '1px solid rgba(255,255,255,.3)', borderRadius: 14, padding: '8px 12px', fontSize: 12, cursor: 'pointer', marginTop: 8 } }, '↩ I’m not done yet'));
}

function cfgGet() { try { return syncGet('startday_cfg'); } catch (e) { return null; } }
function KidStatRow(props) {
  var h = React.createElement, p = props.person, pid = p.id, day = todayKey(), dk = typeof planDayKey === 'function' ? planDayKey() : day;
  var sdS = ktUse('startday/' + day + '/' + pid, null), sd = sdS[0] || {};
  var trS = ktUse('taskruns/' + dk + '/' + pid, {}), tr = Object.values(trS[0] || {});
  var pdS = ktUse('plansdone/' + dk + '/' + pid, {}), pd = Object.values(pdS[0] || {});
  var data = (props.sessions || {})[pid] || {};
  var ents = typeof cdEntries === 'function' ? cdEntries(data) : [];
  var depts = typeof CD_DEPTS !== 'undefined' ? CD_DEPTS : [];
  var nameOf = function (id) { return typeof planActLabel === 'function' ? planActLabel(id) : id; };
  var byAct = {}; ents.forEach(function (e) { byAct[e.activity] = (byAct[e.activity] || 0) + (e.end - e.start) / 1000; });
  var end = sd.dayEnd || Date.now(), total = sd.dayStart ? (end - sd.dayStart) / 1000 : 0;
  var acc = sd.dayStart ? dcAccounted(data, sd.dayStart, end) : 0;
  var oS = React.useState(false), open = oS[0], setOpen = oS[1];
  var hbS = ktUse('habits/' + pid, null), haS = ktUse('habits/__all', null), hdS = ktUse('habitsdone/' + dk + '/' + pid, {}), hrS = ktUse('habitsrun/' + dk + '/' + pid, {});
  var opS = ktUse('opsprog', {}), odS = ktUse('opsdone', {});
  // ── where are they right now? ──
  var nowL = [], stage = '🔴 Has not started the day', sCol = '#FF8A80', now = Date.now();
  var running = typeof clockActiveList === 'function' ? clockActiveList(data) : [];
  if (sd.dayEnd) { stage = '🌙 Day finished at ' + dcTime(sd.dayEnd); sCol = '#b8b8c8'; }
  else if (sd.dayStart) {
    sCol = '#81C784';
    if (!sd.readyAt) {
      var hl = typeof rtHabits === 'function' ? rtHabits(p.name, pid, 'morning', hbS[0], haS[0]) : [], hd = hdS[0] || {}, k = 0, act = null;
      hl.forEach(function (lab, i) { var id = 'morning_' + rtHash(lab); if (hd[id]) k++; else if (!act) act = rtParse(lab); });
      stage = '🌅 Getting ready — step ' + Math.min(k + 1, hl.length) + ' of ' + hl.length + (act ? ': ' + act.text : '');
      var ts = Object.values(hd), seg = ts.length ? Math.max.apply(null, ts) : sd.dayStart;
      if (act) { var lf = Math.round(act.mins * 60 - (now - seg) / 1000); nowL.push((lf < 0 ? '⚠️ ' + dcFmt(-lf) + ' over on this step' : '⏳ ' + dcFmt(lf) + ' left on this step')); if (lf < 0) sCol = '#FFB74D'; }
      var gl = sd.dayStart + (((cfgGet() || {}).mins != null && (cfgGet() || {}).mins !== '' ? +(cfgGet() || {}).mins : 15)) * 60000;
      nowL.push(now > gl ? '⏰ Past the get-ready deadline' : '⏳ ' + dcFmt((gl - now) / 1000) + ' until the get-ready deadline');
    } else stage = '📋 Following the day (ready at ' + dcTime(sd.readyAt) + ')';
    if (running.length) nowL.push('⏱ Clocked into: ' + running.map(function (r) { return nameOf(r.activity) + (r.with ? ' with ' + r.with : '') + ' (' + dcFmt((now - r.startTime) / 1000) + ')'; }).join(' + '));
    else if (sd.readyAt) { nowL.push('⚠️ Not clocked into anything'); sCol = '#FFB74D'; }
    tr.forEach(function (t) { if (t.start && !t.end) nowL.push('▶ Working on: ' + (t.title || 'task') + ' — ' + dcFmt((now - t.start) / 1000)); });
    Object.keys(opS[0] || {}).forEach(function (id) { var o = (opS[0] || {})[id], dn = (odS[0] || {})[id]; if (o && o.by === pid && o.start && !(dn && dn.period === o.period)) nowL.push('🧹 Chore in progress: ' + (Object.keys(o.steps || {}).length) + ' steps checked, ' + dcFmt((now - o.start) / 1000)); });
    if (props.schedHook && typeof planBlocksFor === 'function') {
      var bl = planBlocksFor(props.schedHook, pid, dk), nm = new Date().getHours() * 60 + new Date().getMinutes(), cb = null, nb = null;
      bl.forEach(function (b) { if (b._t != null) { if (b._t <= nm) cb = b; else if (!nb) nb = b; } });
      if (cb) { var want = cb.activity, on = !want || running.some(function (r) { return r.activity === want; }); nowL.push('📅 Schedule says: ' + cb.title + ' (' + cb.time + ')' + (on ? ' ✓ on track' : ' ⚠️ not clocked into ' + nameOf(want))); if (!on) sCol = '#FFB74D'; }
      if (nb) nowL.push('Next: ' + nb.title + ' at ' + nb.time);
    }
  }
  var doneN = pd.filter(function (x) { return x.status === 'approved'; }).length, subN = pd.filter(function (x) { return x.status === 'submitted'; }).length;
  return h('div', { style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
    h('div', { onClick: function () { setOpen(!open); }, style: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' } },
      h('div', { style: { fontSize: 22 } }, p.emoji),
      h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 14, fontWeight: 800, color: '#fff' } }, p.name + (p.age ? ' · ' + p.age : '')), h('div', { style: { fontSize: 12, fontWeight: 800, color: sCol } }, stage), sd.dayStart && h('div', { style: { fontSize: 11, color: '#b8b8c8' } }, 'Day ' + dcTime(sd.dayStart) + ' → ' + (sd.dayEnd ? dcTime(sd.dayEnd) : 'now') + ' · ' + dcFmt(total))),
      h('div', { style: { fontSize: 11, color: '#c8c8d8', textAlign: 'right' } }, doneN + ' done' + (subN ? ' · ' + subN + ' waiting' : '') + (open ? ' ▲' : ' ▼'))),
    nowL.length > 0 && h('div', { style: { margin: '4px 0 0 30px', fontSize: 12, color: '#e8e8f4', lineHeight: 1.6 } }, nowL.map(function (t, i) { return h('div', { key: i }, t); })),
    open && h('div', { style: { margin: '8px 0 0 30px', fontSize: 12, color: '#ddd' } }, h('div', { style: { fontWeight: 900, color: '#FFD54F', marginBottom: 2 } }, '👋 Check-ins today'), h(PciRecent, { pid: pid })),
    open && props.extra,
    open && h(SendToMember, { person: p, addNotif: props.addNotif }),
    open && h(AdminDayEditor, { person: p }),
    open && h(DcConfirm, { onConfirm: function () { dcResetDay(pid, props.sessions, props.onUpdate); }, label: '↺ Reset ' + p.name + '\u2019s day', sure: 'Tap again to reset ' + p.name, style: { margin: '8px 0 0 30px', background: 'transparent', color: '#FFB74D', border: '1px solid #FFB74D', borderRadius: 14, padding: '10px 14px', fontSize: 13, cursor: 'pointer' } }),
    open && h('div', { style: { margin: '8px 0 0 30px', fontSize: 12, color: '#ddd', lineHeight: 1.7 } },
      sd.lateAt && h('div', { style: { color: '#FF8A80' } }, '⏰ Not ready on time' + (sd.penalty ? ' — deducted ' + (sd.penalty.mode === 'points' ? sd.penalty.amt + ' pts' : '$' + sd.penalty.amt.toFixed(2)) : '')),
      sd.readyAt && sd.dayStart && h('div', null, '🌅 Ready after ' + Math.round((sd.readyAt - sd.dayStart) / 60000) + ' min'),
      sd.dayStart && h('div', null, '⏳ Not clocked into anything: ', h('b', null, dcFmt(Math.max(0, total - acc)))),
      depts.map(function (d) { var sec = d.acts.reduce(function (n, a) { return n + (byAct[a] || 0); }, 0); if (!sec) return null;
        return h('div', { key: d.id }, h('b', null, d.emoji + ' ' + d.label + ': ' + dcFmt(sec)), d.acts.filter(function (a) { return byAct[a]; }).map(function (a) { return h('div', { key: a, style: { marginLeft: 14, color: '#b8b8c8' } }, nameOf(a) + ' — ' + dcFmt(byAct[a])); })); }),
      tr.length > 0 && h('div', { style: { marginTop: 4 } }, h('b', null, '⏱ Task times'), tr.map(function (t, i) { var m = t.mins != null ? t.mins : (t.start && !t.end ? Math.round((Date.now() - t.start) / 60000) : null); return h('div', { key: i, style: { marginLeft: 14, color: '#b8b8c8' } }, (t.title || 'Task') + ' — ' + (m != null ? m + ' min' + (t.end ? '' : ' (running)') : '—')); })),
      !sd.dayStart && ents.length === 0 && tr.length === 0 && h('div', { style: { color: '#888' } }, 'Nothing yet today.')));
}
function KidStats(props) {
  var h = React.createElement, kids = (props.family || []).filter(function (p) { return !p.deleted && p.role === 'child'; });
  var tS = React.useState(0), setT = tS[1];
  React.useEffect(function () { var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 5000); return function () { clearInterval(iv); }; }, []);
  if (!kids.length) return null;
  return h('div', { style: { margin: '10px 14px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: 14 } },
    h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 2 } }, '📊 Each child’s day'),
    h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.45)', marginBottom: 6 } }, 'Where each child is right now, plus day length, where the time went, and how long tasks took. Tap a child for the full breakdown.'),
    kids.map(function (p) { return h(KidStatRow, { key: p.id, person: p, sessions: props.sessions, schedHook: props.schedHook, onUpdate: props.onUpdate, addNotif: props.addNotif }); }));
}

function AdminQuickTiles(props) {
  var h = React.createElement;
  function go(t) { window._bhStartTab = t; props.onSwitchTab && props.onSwitchTab('bills'); }
  var tiles = [['🚗', 'Mileage', function () { go('mileage'); }], ['🧾', 'Receipts', function () { go('docs'); }], ['📒', 'Expenses', function () { go('ledger'); }], ['💵', 'Record deposit', function () { props.onSwitchTab && props.onSwitchTab('money'); }], ['📁', 'Documents', function () { go('docs'); }], ['⏱', 'Time', function () { go('reports'); }]];
  return h('div', { style: { margin: '10px 14px' } },
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '⚡ Quick tools'),
    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 } }, tiles.map(function (t) {
      return h('button', { key: t[1], onClick: t[2], style: { background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 14, padding: '12px 4px', color: '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, h('div', { style: { fontSize: 24 } }, t[0]), t[1]);
    })));
}

function ReadyTimerSettings() {
  var h = React.createElement, cS = ktUse('startday_cfg', null), c = cS[0] || {}, oS = React.useState(false), open = oS[0], setOpen = oS[1];
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 10, color: '#fff', padding: 8, fontSize: 14, width: '100%', boxSizing: 'border-box' };
  function set(k, v) { try { syncSet('startday_cfg', Object.assign({}, c, (function () { var o = {}; o[k] = v; return o; })())); } catch (e) {} }
  var lab = function (t, el) { return h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 11, color: '#b8b8c8', marginBottom: 3 } }, t), el); };
  return h('div', { style: { margin: '10px 14px' } },
    h('button', { onClick: function () { setOpen(!open); }, style: { width: '100%', textAlign: 'left', background: 'rgba(255,213,79,.12)', border: '1px solid rgba(255,213,79,.4)', borderRadius: 14, padding: 12, color: '#fff', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, '⏳ Get-ready timer & late deduction ' + (open ? '▾' : '▸')),
    open && h('div', { style: { marginTop: 8, padding: 12, background: 'rgba(255,255,255,.05)', borderRadius: 14 } },
      h('div', { style: { display: 'flex', gap: 8, marginBottom: 8 } },
        lab('Minutes to get ready', h('input', { type: 'number', defaultValue: c.mins != null ? c.mins : 15, onBlur: function (e) { set('mins', e.target.value); }, style: inp })),
        lab('Late deduction $ (cash mode)', h('input', { type: 'number', step: '0.25', defaultValue: c.cash != null ? c.cash : 0.5, onBlur: function (e) { set('cash', e.target.value); }, style: inp })),
        lab('Late deduction pts', h('input', { type: 'number', defaultValue: c.pts != null ? c.pts : 5, onBlur: function (e) { set('pts', e.target.value); }, style: inp }))),
      h('div', { style: { marginBottom: 8 } }, lab('Length of the school/work day in hours (the day circle fills to this)', h('input', { type: 'number', step: '0.5', defaultValue: c.dayHours != null ? c.dayHours : 10, onBlur: function (e) { set('dayHours', e.target.value); }, style: inp }))),
      h('label', { style: { fontSize: 13, color: '#fff' } }, h('input', { type: 'checkbox', checked: !c.off, onChange: function (e) { set('off', !e.target.checked); } }), ' Deduct automatically when time runs out'),
      h('div', { style: { fontSize: 11, color: '#b8b8c8', marginTop: 6 } }, 'The timer starts when the child taps Start my day. The deduction happens once, only while their app is open.')));
}

// ── Parent editor: change/delete/add the day clock, task times, habit check-offs, late deduction ──
function hhmm(ts) { if (!ts) return ''; var d = new Date(ts), p = function (n) { return (n < 10 ? '0' : '') + n; }; return p(d.getHours()) + ':' + p(d.getMinutes()); }
function fromHhmm(str) { var m = /^(\d{1,2}):(\d{2})$/.exec(str || ''); if (!m) return null; var d = new Date(); d.setHours(+m[1], +m[2], 0, 0); return d.getTime(); }
function AdminDayEditor(props) {
  var h = React.createElement, p = props.person, pid = p.id, tk = todayKey(), dk = typeof planDayKey === 'function' ? planDayKey() : tk;
  var sdKey = 'startday/' + tk + '/' + pid;
  var sdS = ktUse(sdKey, null), sd = sdS[0] || {};
  var trS = ktUse('taskruns/' + dk + '/' + pid, {}), trs = trS[0] || {};
  var hdS = ktUse('habitsdone/' + dk + '/' + pid, {}), hd = hdS[0] || {};
  var nS = React.useState({ title: '', mins: '' }), nf = nS[0], setNf = nS[1];
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, color: '#fff', padding: 6, fontSize: 13, boxSizing: 'border-box' };
  var btn = function (bg, fg, fn, t) { return h('button', { onClick: fn, style: { background: bg, color: fg, border: 'none', borderRadius: 12, padding: '6px 10px', fontWeight: 800, fontSize: 12, cursor: 'pointer', marginLeft: 6 } }, t); };
  function saveSd(patch) { try { syncSet(sdKey, Object.assign({}, sd, patch)); } catch (e) {} }
  function setTime(field, val) { var t = fromHhmm(val); if (t) saveSd((function () { var o = {}; o[field] = t; return o; })()); }
  function refund() {
    var pen = sd.penalty; if (!pen) return;
    if (typeof window._creditFn === 'function') window._creditFn(pid, pen.amt, '↩ Late deduction removed', 'refund_' + tk + '_' + pid, true);
    saveSd({ penalty: null, penalized: true, refunded: true });
  }
  function setRun(id, mins) { var t = trs[id]; if (!t) return; var m = Math.max(0, +mins || 0); try { syncSet('taskruns/' + dk + '/' + pid + '/' + id, Object.assign({}, t, { mins: m, end: t.end || Date.now() })); } catch (e) {} }
  function delRun(id) { try { syncSet('taskruns/' + dk + '/' + pid + '/' + id, null); } catch (e) {} }
  function addRun() { if (!nf.title.trim()) return; var id = 'm' + Date.now().toString(36), m = Math.max(1, +nf.mins || 1); try { syncSet('taskruns/' + dk + '/' + pid + '/' + id, { title: nf.title.trim(), mins: m, start: Date.now() - m * 60000, end: Date.now(), manual: true }); setNf({ title: '', mins: '' }); } catch (e) {} }
  var morning = typeof rtHabits === 'function' ? rtHabits(p.name, pid, 'morning', null, null) : [];
  var sec = function (t) { return h('div', { style: { fontSize: 12, fontWeight: 900, color: '#FFD54F', margin: '10px 0 4px' } }, t); };
  return h('div', { style: { margin: '8px 0 0 30px', padding: 10, background: 'rgba(0,0,0,.25)', borderRadius: 12, fontSize: 12, color: '#ddd' } },
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff' } }, '✏️ Edit ' + p.name + '’s day'),
    sec('Day clock'),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' } },
      'Start', h('input', { type: 'time', key: 's' + sd.dayStart, defaultValue: hhmm(sd.dayStart), onBlur: function (e) { setTime('dayStart', e.target.value); }, style: inp }),
      'End', h('input', { type: 'time', key: 'e' + sd.dayEnd, defaultValue: hhmm(sd.dayEnd), onBlur: function (e) { setTime('dayEnd', e.target.value); }, style: inp }),
      sd.dayEnd && btn('rgba(255,255,255,.12)', '#fff', function () { saveSd({ dayEnd: null }); }, 'Reopen day'),
      sd.dayStart && btn('rgba(239,83,80,.3)', '#FF8A80', function () { saveSd({ dayStart: null, dayEnd: null, readyAt: null }); }, 'Delete')),
    h('div', { style: { marginTop: 6 } }, 'Ready at', h('input', { type: 'time', key: 'r' + sd.readyAt, defaultValue: hhmm(sd.readyAt), onBlur: function (e) { setTime('readyAt', e.target.value); }, style: Object.assign({}, inp, { marginLeft: 6 }) }), sd.readyAt && btn('rgba(255,255,255,.12)', '#fff', function () { saveSd({ readyAt: null }); }, 'Not ready'),
      sd.penalty && btn('#4CAF82', '#000', refund, '↩ Give back ' + (sd.penalty.mode === 'points' ? sd.penalty.amt + ' pts' : '$' + (+sd.penalty.amt).toFixed(2)))),
    sec('Morning habits (tap to check or uncheck)'),
    h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }, morning.map(function (lab) { var id = 'morning_' + rtHash(lab), on = !!hd[id], pr = rtParse(lab);
      return h('button', { key: id, onClick: function () { try { syncSet('habitsdone/' + dk + '/' + pid + '/' + id, on ? null : Date.now()); } catch (e) {} }, style: { background: on ? 'rgba(76,175,130,.3)' : 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid ' + (on ? '#4CAF82' : 'rgba(255,255,255,.2)'), borderRadius: 14, padding: '5px 10px', fontSize: 12, cursor: 'pointer' } }, (on ? '✓ ' : '') + pr.text); })),
    morning.length > 0 && btn('rgba(255,255,255,.12)', '#fff', function () { try { syncSet('habitsdone/' + dk + '/' + pid, null); syncSet('habitsrun/' + dk + '/' + pid, null); } catch (e) {} }, '↺ Restart habits'),
    sec('Task times'),
    Object.keys(trs).length === 0 && h('div', { style: { color: '#888' } }, 'None yet.'),
    Object.keys(trs).map(function (id) { var t = trs[id], m = t.mins != null ? t.mins : Math.round((Date.now() - t.start) / 60000);
      return h('div', { key: id + (t.mins || ''), style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 } }, h('div', { style: { flex: 1 } }, (t.title || 'Task') + (t.end ? '' : ' (running)')), h('input', { type: 'number', defaultValue: m, onBlur: function (e) { setRun(id, e.target.value); }, style: Object.assign({}, inp, { width: 60 }) }), 'min', btn('rgba(239,83,80,.3)', '#FF8A80', function () { delRun(id); }, '🗑')); }),
    h('div', { style: { display: 'flex', gap: 6, marginTop: 6 } }, h('input', { type: 'text', placeholder: 'Add a task time…', value: nf.title, onChange: function (e) { setNf(Object.assign({}, nf, { title: e.target.value })); }, style: Object.assign({}, inp, { flex: 1 }) }), h('input', { type: 'number', placeholder: 'min', value: nf.mins, onChange: function (e) { setNf(Object.assign({}, nf, { mins: e.target.value })); }, style: Object.assign({}, inp, { width: 60 }) }), btn('#4CAF82', '#000', addRun, '＋ Add')),
    h('div', { style: { marginTop: 8, color: '#9a9ab0' } }, 'Clock-in entries (add, edit, delete) are in “Admin Time Management” further down this page. Habit minutes and chore steps are in “Set up habits & chores”. The get-ready limit is in “Get-ready timer”.'));
}

// ── Fresh start for the whole family ──
function FamilyFreshStart(props) {
  var h = React.createElement, oS = React.useState(false), open = oS[0], setOpen = oS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  var kids = (props.family || []).filter(function (p) { return !p.deleted && p.role === 'child'; });
  function freshTimers() {
    (props.family || []).forEach(function (p) { if (!p.deleted) dcResetDay(p.id, props.sessions, null); });
    try { syncSet('opsdone', null); syncSet('opsprog', null); } catch (e) {}
    if (props.onUpdate) props.onUpdate({});
    setMsg('✅ Every timer, check-off and clock-in for today is cleared. Everyone starts fresh.');
  }
  function clearKidPins() {
    kids.forEach(function (p) { try { if (typeof window._appSetPin === 'function') window._appSetPin(p.id, ''); else syncSet('pins/' + p.id, null); } catch (e) {} });
    setMsg('✅ All children’s passcodes are cleared. They cannot log in until you set each one in Admin → PIN Manager.');
  }
  var b = { display: 'block', width: '100%', textAlign: 'left', borderRadius: 12, padding: '12px 14px', fontWeight: 800, fontSize: 14, cursor: 'pointer', marginTop: 8, background: 'rgba(255,255,255,.07)', color: '#fff', border: '1px solid rgba(255,255,255,.25)' };
  return h('div', { style: { margin: '10px 14px' } },
    h('button', { onClick: function () { setOpen(!open); }, style: { width: '100%', textAlign: 'left', background: 'rgba(239,83,80,.12)', border: '1px solid rgba(239,83,80,.45)', borderRadius: 14, padding: 12, color: '#fff', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, '🧼 Fresh start for the whole family ' + (open ? '▾' : '▸')),
    open && h('div', { style: { padding: 12, background: 'rgba(255,255,255,.05)', borderRadius: 14, marginTop: 8 } },
      h('div', { style: { fontSize: 12, color: '#c8c8d8', lineHeight: 1.5 } }, 'Use before you share the app, or any time you want a clean slate. It never touches accounts, money, journals, schedules or settings.'),
      h(DcConfirm, { onConfirm: freshTimers, label: '↺ Clear all timers, check-offs & clock-ins (today)', sure: 'Tap again — clears everyone’s day', style: b }),
      h(DcConfirm, { onConfirm: clearKidPins, label: '🔒 Clear all children’s passcodes (I will set them)', sure: 'Tap again — kids are locked out until you set PINs', style: b }),
      msg && h('div', { style: { fontSize: 12, color: '#81C784', marginTop: 10 } }, msg)));
}

// ── Alert for parents when a child asks for a passcode reset ──
function PinRequestBanner(props) {
  var h = React.createElement, psS = ktUse('pinset', {}), ps = psS[0] || {}, ncS = ktUse('notify_cfg', null), ncfg = ncS[0] || {};
  var seen = React.useRef(null), gS = React.useState({}), gone = gS[0], setGone = gS[1];
  var fam = props.family || [];
  var reqs = (props.notifs || []).filter(function (n) { return n && !gone[n.id] && n.type === 'pin_reset_request' && n.approved == null && !n.read && (!ps[n.personId] || n.timestamp > ps[n.personId]); });
  React.useEffect(function () {
    var ids = reqs.map(function (r) { return r.id; });
    if (seen.current === null) { seen.current = ids; return; }
    var fresh = reqs.filter(function (r) { return seen.current.indexOf(r.id) === -1; });
    if (fresh.length) {
      try { fireBrowserNotif('🙋 Passcode reset needed', fresh.map(function (r) { return r.personName || r.personId; }).join(', ') + ' needs a new passcode'); } catch (e) {}
      try { playSound('notif'); } catch (e) {}
    }
    seen.current = ids;
  });
  if (!reqs.length || (props.personId && typeof ncWants === 'function' && !ncWants(props.personId, { type: 'pin_reset_request', personId: 'x' }, ncfg))) return null;
  function dismiss(r) { setGone(function (o) { var n = Object.assign({}, o); n[r.id] = true; return n; }); try { syncSet('notifs/' + r.id, Object.assign({}, r, { read: true, approved: true, resolvedAt: Date.now() })); } catch (e) {} }
  return h('div', { style: { background: '#FF9800', color: '#000', padding: '10px 12px', flexShrink: 0 } },
    reqs.map(function (r) {
      var p = fam.find(function (f) { return f.id === r.personId; }) || { name: r.personName || r.personId, emoji: '👤' };
      return h('div', { key: r.id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' } },
        h('div', { style: { flex: 1, fontSize: 14, fontWeight: 900 } }, '🙋 ' + p.emoji + ' ' + p.name + ' needs a passcode reset'),
        h('button', { onClick: function () { dismiss(r); if (props.onOpen) props.onOpen(); }, style: { background: '#000', color: '#fff', border: 'none', borderRadius: 16, padding: '10px 14px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, 'Set it'),
        h('button', { onClick: function () { dismiss(r); }, style: { background: 'rgba(0,0,0,.2)', color: '#000', border: 'none', borderRadius: 16, padding: '10px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, 'Dismiss'));
    }));
}

// ── Parent → member message (shows up in their bell, plays a sound and pops a banner on their device) ──
function SendToMember(props) {
  var h = React.createElement, p = props.person, tS = React.useState(''), txt = tS[0], setTxt = tS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  function send() {
    if (!txt.trim() || !props.addNotif) return;
    props.addNotif('message', p.id, '📣 Message from ' + (window._currentPersonName && window._currentPersonName !== p.name ? window._currentPersonName : 'your parents'), txt.trim(), { requiresApproval: false });
    setTxt(''); setMsg('✅ Sent to ' + p.name);
  }
  return h('div', { style: { margin: '8px 0 0 30px', display: 'flex', gap: 6, alignItems: 'center' } },
    h('input', { type: 'text', value: txt, placeholder: '📣 Send ' + p.name + ' a message…', onChange: function (e) { setTxt(e.target.value); setMsg(''); }, style: { flex: 1, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 8, fontSize: 13 } }),
    h('button', { onClick: send, style: { background: '#039BE5', color: '#fff', border: 'none', borderRadius: 14, padding: '9px 12px', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, 'Send'),
    msg && h('span', { style: { fontSize: 11, color: '#81C784' } }, msg));
}

// ── Pop-up alerts for the person using this device: messages and notifications sent to them (parents get their kids' requests) ──
function IncomingAlerts(props) {
  var h = React.createElement, pid = props.personId, isAdmin = !!props.isAdmin;
  var mS = ktUse('messages', {}), msgs = mS[0] || {};
  var ncS = ktUse('notify_cfg', null), ncfg = ncS[0] || {};
  var seen = React.useRef(null), t0 = React.useRef(Date.now());
  var tS = React.useState([]), toasts = tS[0], setToasts = tS[1];
  var found = [];
  Object.keys(msgs).forEach(function (tid) { var arr = msgs[tid]; arr = Array.isArray(arr) ? arr : Object.values(arr || {}); arr.forEach(function (m) { if (m && m.to === pid && !m.read && m.ts > t0.current - 60000) found.push({ id: 'm_' + (m.id || m.ts), title: '💬 Message from ' + (m.from || ''), body: m.text }); }); });
  (props.notifs || []).forEach(function (n) {
    if (!n || n.read || n.timestamp < t0.current - 60000 || n.type === 'pin_reset_request' || n.type === 'clock_in') return;
    var mine = n.personId === pid || n.personId === 'all';
    if (mine || (isAdmin && n.personId !== pid && (typeof ncWants !== 'function' || ncWants(pid, n, ncfg)))) found.push({ id: 'n_' + n.id, title: n.title || 'Notification', body: n.message || '', link: n.link });
  });
  React.useEffect(function () {
    var ids = found.map(function (f) { return f.id; });
    if (seen.current === null) { seen.current = ids; return; }
    var fresh = found.filter(function (f) { return seen.current.indexOf(f.id) === -1; });
    if (fresh.length) {
      setToasts(function (old) { return old.concat(fresh).slice(-4); });
      try { fireBrowserNotif(fresh[0].title, fresh[0].body); } catch (e) {}
      try { playSound('notif'); } catch (e) {}
    }
    seen.current = ids;
  });
  if (!toasts.length) return null;
  return h('div', { style: { background: '#1E88E5', color: '#fff', padding: '8px 12px', flexShrink: 0 } },
    toasts.map(function (t) { return h('div', { key: t.id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' } },
      h('div', { style: { flex: 1, fontSize: 14 } }, h('b', null, t.title), t.body ? ' — ' + String(t.body).slice(0, 120) : ''),
      t.link && h('a', { href: t.link, target: '_blank', rel: 'noopener noreferrer', style: { background: '#4CAF82', color: '#000', borderRadius: 14, padding: '7px 11px', fontWeight: 800, fontSize: 12, textDecoration: 'none' } }, '\uD83D\uDCCD Map'),
      props.onOpen && h('button', { onClick: function () { setToasts(function (old) { return old.filter(function (x) { return x.id !== t.id; }); }); props.onOpen(); }, style: { background: '#fff', color: '#1E88E5', border: 'none', borderRadius: 14, padding: '7px 11px', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, 'Open'),
      h('button', { onClick: function () { setToasts(function (old) { return old.filter(function (x) { return x.id !== t.id; }); }); }, style: { background: 'rgba(0,0,0,.25)', color: '#fff', border: 'none', borderRadius: 14, padding: '7px 10px', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, '✕')); }));
}

// ── Reminders to log food and health while the app is open ──
var CI_DEFAULT = ['07:45 | Breakfast — what did you eat? | meal', '10:15 | Snack check-in — did you have a snack? | snack', '12:15 | Lunch — log what you ate | meal', '15:00 | Afternoon snack check-in | snack', '18:00 | Dinner — log what you ate | meal', '20:00 | Health check — log meals, medicine and exercise for today | meal'];
function ciList(cfg) { var arr = Array.isArray(cfg) ? cfg : (cfg && typeof cfg === 'object' ? Object.values(cfg) : null); arr = (arr && arr.length ? arr : CI_DEFAULT); return arr.map(function (l) { var p = String(l).split('|').map(function (x) { return x.trim(); }), m = /^(\d{1,2}):(\d{2})$/.exec(p[0] || ''); return m ? { t: p[0], min: +m[1] * 60 + +m[2], label: p[1] || 'Check in', kind: p[2] || 'meal' } : null; }).filter(Boolean); }
function CheckInReminders(props) {
  var h = React.createElement, pid = props.personId, cS = ktUse('checkin_cfg', null), list = ciList(cS[0]);
  var tS = React.useState(0), setT = tS[1], seenR = React.useRef({});
  React.useEffect(function () { var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 20000); return function () { clearInterval(iv); }; }, []);
  var d = new Date(), nowM = d.getHours() * 60 + d.getMinutes(), day = typeof planDayKey === 'function' ? planDayKey() : todayKey();
  var key = function (r) { return 'fm_ci_' + pid + '_' + day + '_' + r.t; };
  var due = list.filter(function (r) { var done = false; try { done = !!localStorage.getItem(key(r)); } catch (e) {} return !done && nowM >= r.min && nowM < r.min + 120; }).sort(function (a, b) { return b.min - a.min; })[0];
  React.useEffect(function () { if (due && !seenR.current[due.t]) { seenR.current[due.t] = 1; try { fireBrowserNotif('Check in', due.label); } catch (e) {} try { playSound('reminder'); } catch (e) {} } });
  if (!due) return null;
  function finish() { try { localStorage.setItem(key(due), '1'); } catch (e) {} setT(function (x) { return x + 1; }); }
  return h('div', { style: { background: '#7E57C2', color: '#fff', padding: '10px 12px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 } },
    h('div', { style: { flex: 1, fontSize: 15, fontWeight: 800 } }, '🍽 ' + due.label),
    h('button', { onClick: function () { window._healthStartType = due.kind; finish(); props.onGo && props.onGo(); }, style: { background: '#fff', color: '#4527A0', border: 'none', borderRadius: 16, padding: '10px 14px', fontWeight: 900, fontSize: 13, cursor: 'pointer' } }, 'Log it'),
    h('button', { onClick: finish, style: { background: 'rgba(0,0,0,.25)', color: '#fff', border: 'none', borderRadius: 16, padding: '10px 12px', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, 'Not now'));
}
function CheckInSettings() {
  var h = React.createElement, cS = ktUse('checkin_cfg', null), oS = React.useState(false), open = oS[0], setOpen = oS[1], list = Array.isArray(cS[0]) ? cS[0] : CI_DEFAULT;
  return h('div', { style: { margin: '10px 14px' } },
    h('button', { onClick: function () { setOpen(!open); }, style: { width: '100%', textAlign: 'left', background: 'rgba(126,87,194,.15)', border: '1px solid rgba(126,87,194,.5)', borderRadius: 14, padding: 12, color: '#fff', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, '🍽 Food & health reminders ' + (open ? '▾' : '▸')),
    open && h('div', { style: { marginTop: 8, padding: 12, background: 'rgba(255,255,255,.05)', borderRadius: 14 } },
      h('div', { style: { fontSize: 12, color: '#c8c8d8', marginBottom: 6, lineHeight: 1.5 } }, 'One reminder per line: time (24-hour) | message | what to log (meal, snack, med, bg, exercise). It pops up on each person’s device while the app is open.'),
      h('textarea', { rows: 8, defaultValue: list.join('\n'), id: 'ci_text', style: { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 13, fontFamily: 'inherit' } }),
      h('button', { onClick: function () { var el = document.getElementById('ci_text'); if (el) { var arr = el.value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean); try { syncSet('checkin_cfg', arr.length ? arr : null); } catch (e) {} } }, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 14, padding: '8px 14px', fontWeight: 800, cursor: 'pointer', marginTop: 8 } }, 'Save reminders'),
      h('button', { onClick: function () { try { syncSet('checkin_cfg', null); } catch (e) {} }, style: { background: 'transparent', color: '#c8c8d8', border: '1px solid rgba(255,255,255,.3)', borderRadius: 14, padding: '8px 14px', cursor: 'pointer', marginTop: 8, marginLeft: 8 } }, 'Back to the default times')));
}

// ── Check in with the parents: where am I, what am I doing, how am I — at random times through the day ──
var PCI_STATUS = [['school', '📚', 'On school work'], ['chores', '🧹', 'Doing chores'], ['home', '🏠', 'Home — free time'], ['friends', '🎉', 'Fun / with friends'], ['out', '🚗', 'Out and about'], ['eating', '🍽', 'Eating'], ['spiritual', '🙏', 'Spiritual time'], ['work', '💼', 'Working']];
var PCI_PROMPTS = ['What is one good thing you can say about yourself right now? (your affirmation)', 'What is one thing you finished since the last check-in?', 'What is one thing you are proud of today?', 'Is anything hard right now? What kind of help would make it easier?', 'What are you thankful for today?', 'What is your next step after this?', 'Tell Mom or Dad something fun or interesting you learned or saw.', 'What is something kind you did for someone today?'];
var PCI_CONTEXT = { school: 'What are you working on right now? (subject and what part)', chores: 'Which chore are you on and how far along are you?', work: 'What are you working on right now?', spiritual: 'What are you reading, studying or doing right now?', friends: 'Who are you with, and where are you?', out: 'Where are you and who are you with?', eating: 'What are you eating? Is it a meal or a snack?', home: 'What are you doing with your free time?' };
function pciGuess(running) {
  var a = running[0] && running[0].activity; if (!a) return null;
  if (a === 'school') return 'school'; if (a === 'spiritual') return 'spiritual'; if (a === 'chores' || a === 'meals' || a === 'animals') return a === 'meals' ? 'eating' : 'chores';
  if (a === 'fun') return 'friends'; if (a === 'free') return 'home'; if (a === 'driving') return 'out'; return 'work';
}
function ParentCheckIn(props) {
  var h = React.createElement, pid = props.personId, name = props.name || pid, dayK = typeof planDayKey === 'function' ? planDayKey() : todayKey();
  var sdS = ktUse('startday/' + todayKey() + '/' + pid, null), sd = sdS[0] || {};
  var cfgS = ktUse('pcheckin_cfg', null), cfg = cfgS[0] || {};
  var ciS = ktUse('checkins/' + dayK + '/' + pid, {}), done = Object.values(ciS[0] || {});
  var tS = React.useState(0), setT = tS[1], oS = React.useState(false), open = oS[0], setOpen = oS[1];
  var fS = React.useState({ status: null, ctx: '', aff: '', mood: null, help: false }), f = fS[0], setF = fS[1];
  var sentS = React.useState(false), sent = sentS[0], setSent = sentS[1];
  React.useEffect(function () { var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 15000); return function () { clearInterval(iv); }; }, []);
  React.useEffect(function () { var fn = function () { setSent(false); setOpen(true); }; window.addEventListener('fm-checkin-open', fn); return function () { window.removeEventListener('fm-checkin-open', fn); }; }, []);
  var nk = 'fm_pci_next_' + pid + '_' + dayK, lo = cfg.min != null && cfg.min !== '' ? +cfg.min : 45, hi = Math.max(lo, cfg.max != null && cfg.max !== '' ? +cfg.max : 90);
  var running = typeof clockActiveList === 'function' ? clockActiveList((props.sessions || {})[pid] || {}) : [];
  var active = !!sd.dayStart && !sd.dayEnd && !cfg.off && !(props.role === 'elder');
  var now = Date.now(), next = 0; try { next = +localStorage.getItem(nk) || 0; } catch (e) {}
  if (active && !next) { next = (done.length ? now : sd.dayStart) + (lo + Math.random() * (hi - lo)) * 60000; if (!done.length) next = sd.dayStart + (20 + Math.random() * 25) * 60000; try { localStorage.setItem(nk, String(next)); } catch (e) {} }
  var due = active && next && now >= next;
  React.useEffect(function () { if (due && !open) { setSent(false); setOpen(true); setF({ status: pciGuess(running), ctx: '', aff: '', mood: null, help: false }); try { playSound('reminder'); fireBrowserNotif('Check in with Mom & Dad', 'Tap to tell them where you are'); } catch (e) {} } });
  function schedule(mins) { try { localStorage.setItem(nk, String(Date.now() + mins * 60000)); } catch (e) {} }
  function close(snooze) { schedule(snooze ? 10 : lo + Math.random() * (hi - lo)); setOpen(false); setT(function (x) { return x + 1; }); }
  if (!open) return null;
  var st = PCI_STATUS.filter(function (x) { return x[0] === f.status; })[0], ctxQ = f.status ? PCI_CONTEXT[f.status] : null, aff = PCI_PROMPTS[done.length % PCI_PROMPTS.length];
  var curLabel = running.length ? running.map(function (r) { return (typeof planActLabel === 'function' ? planActLabel(r.activity) : r.activity); }).join(' + ') : 'nothing';
  function submit() {
    if (!f.status) return;
    var id = 'ci' + Date.now().toString(36), rec = { id: id, ts: Date.now(), status: f.status, statusLabel: st ? st[2] : f.status, ctx: f.ctx.trim(), ctxQ: ctxQ, aff: f.aff.trim(), affQ: aff, mood: f.mood, help: f.help, clocked: curLabel };
    try { syncSet('checkins/' + dayK + '/' + pid + '/' + id, rec); } catch (e) {}
    var bits = [(st ? st[1] + ' ' + st[2] : f.status), rec.ctx && ('“' + rec.ctx + '”'), rec.aff && ('Affirmation: “' + rec.aff + '”'), f.mood && ('Feeling ' + f.mood), 'Clocked into: ' + curLabel].filter(Boolean);
    if (props.addNotif) { try { props.addNotif(f.help ? 'alert' : 'checkin', pid, (f.help ? '🆘 ' : '👋 ') + name + (f.help ? ' needs help' : ' checked in'), bits.join(' · '), { requiresApproval: false }); } catch (e) {} }
    try { playSound('success'); } catch (e) {}
    setSent(true); schedule(lo + Math.random() * (hi - lo)); setTimeout(function () { setOpen(false); setT(function (x) { return x + 1; }); }, 1800);
  }
  var big = { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.1)', border: '2px solid rgba(255,255,255,.25)', borderRadius: 14, color: '#fff', padding: 12, fontSize: 16, fontFamily: 'inherit' };
  return h('div', { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.82)', zIndex: 5000, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '16px 12px' } },
    h('div', { style: { width: '100%', maxWidth: 520, background: 'linear-gradient(160deg,#2b1055,#1a1a2e)', border: '3px solid #FF1493', borderRadius: 22, padding: 18, boxShadow: '0 0 40px #FF149388' } },
      sent ? h('div', { style: { textAlign: 'center', padding: 30 } }, h('div', { style: { fontSize: 60 } }, '✅'), h('div', { style: { fontSize: 22, fontWeight: 900, color: '#fff' } }, 'Sent to Mom & Dad!'))
      : h('div', null,
        h('div', { style: { fontSize: 22, fontWeight: 900, color: '#fff' } }, '👋 Check in with Mom & Dad'),
        h('div', { style: { fontSize: 13, color: '#d8d8e8', margin: '2px 0 12px' } }, 'You are clocked into: ' + curLabel),
        h('div', { style: { fontSize: 15, fontWeight: 800, color: '#FFD54F', marginBottom: 6 } }, '1. Where are you in your day?'),
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 } }, PCI_STATUS.map(function (x) { var on = f.status === x[0]; return h('button', { key: x[0], onClick: function () { setF(Object.assign({}, f, { status: x[0] })); }, style: { background: on ? '#FF1493' : 'rgba(255,255,255,.08)', color: '#fff', border: '2px solid ' + (on ? '#fff' : 'rgba(255,255,255,.2)'), borderRadius: 14, padding: '12px 6px', fontWeight: 800, fontSize: 14, cursor: 'pointer' } }, x[1] + ' ' + x[2]); })),
        ctxQ && h('div', null, h('div', { style: { fontSize: 15, fontWeight: 800, color: '#FFD54F', marginBottom: 6 } }, '2. ' + ctxQ), h('textarea', { rows: 2, value: f.ctx, onChange: function (e) { setF(Object.assign({}, f, { ctx: e.target.value })); }, style: Object.assign({}, big, { marginBottom: 12 }) })),
        h('div', { style: { fontSize: 15, fontWeight: 800, color: '#FFD54F', marginBottom: 6 } }, (ctxQ ? '3. ' : '2. ') + aff),
        h('textarea', { rows: 2, value: f.aff, onChange: function (e) { setF(Object.assign({}, f, { aff: e.target.value })); }, style: Object.assign({}, big, { marginBottom: 12 }) }),
        h('div', { style: { fontSize: 15, fontWeight: 800, color: '#FFD54F', marginBottom: 6 } }, 'How are you feeling?'),
        h('div', { style: { display: 'flex', gap: 8, marginBottom: 12 } }, [['😀', 'happy'], ['🙂', 'okay'], ['😐', 'meh'], ['😟', 'worried'], ['😢', 'sad']].map(function (m) { var on = f.mood === m[1]; return h('button', { key: m[1], onClick: function () { setF(Object.assign({}, f, { mood: m[1] })); }, style: { flex: 1, fontSize: 28, padding: '8px 0', background: on ? '#FF1493' : 'rgba(255,255,255,.08)', border: '2px solid ' + (on ? '#fff' : 'rgba(255,255,255,.2)'), borderRadius: 14, cursor: 'pointer' } }, m[0]); })),
        h('button', { onClick: function () { setF(Object.assign({}, f, { help: !f.help })); }, style: { width: '100%', background: f.help ? '#E53935' : 'rgba(255,255,255,.08)', color: '#fff', border: '2px solid ' + (f.help ? '#fff' : 'rgba(255,255,255,.25)'), borderRadius: 14, padding: 12, fontWeight: 900, fontSize: 15, cursor: 'pointer', marginBottom: 12 } }, f.help ? '🆘 I need help — Mom & Dad will be alerted loudly' : '🆘 I need help with something'),
        h('button', { onClick: submit, disabled: !f.status, style: { width: '100%', background: f.status ? '#4CAF82' : '#555', color: f.status ? '#000' : '#aaa', border: 'none', borderRadius: 16, padding: 16, fontWeight: 900, fontSize: 18, cursor: f.status ? 'pointer' : 'default' } }, f.status ? '📨 Send check-in' : 'Pick where you are first'),
        h('button', { onClick: function () { close(true); }, style: { width: '100%', background: 'transparent', color: '#c8c8d8', border: 'none', padding: 12, fontSize: 13, cursor: 'pointer', marginTop: 4 } }, 'Remind me in 10 minutes'))));
}
function pciOpen() { try { window.dispatchEvent(new CustomEvent('fm-checkin-open')); } catch (e) {} }
function PciSettings() {
  var h = React.createElement, cS = ktUse('pcheckin_cfg', null), c = cS[0] || {}, inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, color: '#fff', padding: 8, fontSize: 14, width: 80 };
  function set(k, v) { try { syncSet('pcheckin_cfg', Object.assign({}, c, (function () { var o = {}; o[k] = v; return o; })())); } catch (e) {} }
  return h('div', { style: { margin: '10px 14px', padding: 12, background: 'rgba(255,20,147,.1)', border: '1px solid rgba(255,20,147,.5)', borderRadius: 14 } },
    h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '👋 Check-ins with the kids'),
    h('div', { style: { fontSize: 12, color: '#c8c8d8', marginBottom: 8, lineHeight: 1.5 } }, 'While the app is open and their day is running, each child gets a loud check-in pop-up at a random time between these minutes. It asks where they are, what they are working on, an affirmation question and how they feel, and sends it to you.'),
    h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } }, 'Every', h('input', { type: 'number', defaultValue: c.min != null ? c.min : 45, onBlur: function (e) { set('min', e.target.value); }, style: inp }), 'to', h('input', { type: 'number', defaultValue: c.max != null ? c.max : 90, onBlur: function (e) { set('max', e.target.value); }, style: inp }), 'minutes',
      h('label', { style: { fontSize: 13, color: '#fff', marginLeft: 8 } }, h('input', { type: 'checkbox', checked: !c.off, onChange: function (e) { set('off', !e.target.checked); } }), ' On')));
}
function PciRecent(props) {
  var h = React.createElement, dayK = typeof planDayKey === 'function' ? planDayKey() : todayKey(), cS = ktUse('checkins/' + dayK + '/' + props.pid, {}), arr = Object.values(cS[0] || {}).sort(function (a, b) { return b.ts - a.ts; });
  if (!arr.length) return h('div', { style: { color: '#888' } }, 'No check-ins yet today.');
  return h('div', null, arr.slice(0, 5).map(function (r) { return h('div', { key: r.id, style: { padding: '3px 0', borderTop: '1px solid rgba(255,255,255,.06)' } }, h('b', null, dcTime(r.ts) + ' · ' + r.statusLabel + (r.help ? ' · 🆘 NEEDS HELP' : '') + (r.mood ? ' · ' + r.mood : '')), r.ctx && h('div', { style: { color: '#b8b8c8' } }, '“' + r.ctx + '”'), r.aff && h('div', { style: { color: '#b8b8c8' } }, 'Affirmation: “' + r.aff + '”')); }));
}
