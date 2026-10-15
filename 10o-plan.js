// ═══ DAILY PLAN: schedule blocks tied to clock-in activities, kid check-offs, parent approval ═══
function planDayKey() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
function planMinutes(str) {
  var m = String(str || '').trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]\.?m\.?)?/i);
  if (!m) return null;
  var h = +m[1], mi = +(m[2] || 0), ap = (m[3] || '').toLowerCase();
  if (ap && ap[0] === 'p' && h < 12) h += 12; if (ap && ap[0] === 'a' && h === 12) h = 0;
  if (h > 23 || mi > 59) return null; return h * 60 + mi;
}
function planActLabel(id) { var a = (typeof CLOCK_ACTS !== 'undefined' ? CLOCK_ACTS : []).find(function (x) { return x.id === id; }); return a ? a.label : id; }
function planBlocksFor(schedHook, pid, dayKey) {
  var day = schedHook && schedHook.getDay ? schedHook.getDay(dayKey) : { blocks: [] };
  var bl = (day.blocks || []).filter(function (b) { return !b.kids || !b.kids.length || b.kids.indexOf(pid) !== -1; }).map(function (b, i) { return Object.assign({ _i: i, _t: planMinutes(b.time) }, b); });
  return bl.sort(function (a, b) { if (a._t == null && b._t == null) return a._i - b._i; if (a._t == null) return 1; if (b._t == null) return -1; return a._t - b._t || a._i - b._i; });
}
function PlanRightNow(props) {
  var h = React.createElement, pid = props.personId, dayKey = planDayKey();
  var tS = React.useState(0), setT = tS[1];
  React.useEffect(function () { var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 30000); return function () { clearInterval(iv); }; }, []);
  var logged = React.useRef({});
  var blocks = planBlocksFor(props.schedHook, pid, dayKey), d = new Date(), nowM = d.getHours() * 60 + d.getMinutes();
  var cur = null, next = null;
  blocks.forEach(function (b) { if (b._t != null) { if (b._t <= nowM) cur = b; else if (!next) next = b; } });
  var data = (props.sessions || {})[pid] || {}, running = typeof clockActiveList === 'function' ? clockActiveList(data) : [], runIds = running.map(function (r) { return r.activity; });
  var want = cur && cur.activity ? cur.activity : null, match = want && runIds.indexOf(want) !== -1;
  React.useEffect(function () {
    if (!want || match) return;
    var key = cur.id + '_' + (runIds.join('+') || 'none');
    if (logged.current[key]) return; logged.current[key] = 1;
    try { var id = 'pl' + Date.now().toString(36); syncSet('planlog/' + dayKey + '/' + pid + '/' + id, { id: id, ts: Date.now(), blockId: cur.id, title: cur.title, expected: want, actual: runIds }); } catch (e) {}
  });
  var card = { background: 'rgba(255,213,79,.1)', border: '2px solid #FFD54F', borderRadius: 18, padding: 14, marginBottom: 12 };
  if (!cur && !next) return h('div', { style: Object.assign({}, card, { background: 'rgba(255,255,255,.05)', borderColor: 'rgba(255,255,255,.15)' }) }, h('div', { style: { fontSize: 14, color: '#c8c8d8' } }, blocks.length ? 'Nothing is scheduled right now.' : 'No schedule has been set for today yet.'));
  function clockTo(act) { if (typeof clockInActivity === 'function') clockInActivity(pid, props.sessions || {}, props.onUpdate, act); }
  return h('div', { style: card },
    cur && h('div', null,
      h('div', { style: { fontSize: 12, fontWeight: 800, color: '#FFD54F', letterSpacing: 1 } }, 'RIGHT NOW  ·  ' + (cur.time || '')),
      h('div', { style: { fontSize: 22, fontWeight: 900, color: '#fff', margin: '2px 0 6px' } }, (cur.emoji ? cur.emoji + ' ' : '') + cur.title),
      want && match && h('div', { style: { fontSize: 14, color: '#81C784', fontWeight: 800 } }, '✅ Clocked into ' + planActLabel(want) + ' — you are on track'),
      want && !match && h('div', null,
        h('div', { style: { fontSize: 14, color: '#FF8A80', fontWeight: 800, marginBottom: 6 } }, runIds.length ? '⚠️ Your schedule says ' + planActLabel(want) + ', but you are clocked into ' + runIds.map(planActLabel).join(' + ') : '⏱ You are not clocked in. Your schedule says ' + planActLabel(want)),
        h('button', { onClick: function () { clockTo(want); }, style: { width: '100%', background: '#4CAF82', color: '#000', border: 'none', borderRadius: 16, padding: 16, fontWeight: 900, fontSize: 17, cursor: 'pointer' } }, '▶ Clock in to ' + planActLabel(want))),
      !want && h('div', { style: { fontSize: 13, color: '#c8c8d8' } }, 'Do this, then check it off below.')),
    !cur && next && h('div', { style: { fontSize: 14, color: '#fff' } }, 'Nothing yet — first up at ' + next.time + ': ' + next.title),
    cur && next && h('div', { style: { fontSize: 13, color: '#c8c8d8', marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.12)' } }, 'Next at ' + next.time + ': ' + (next.emoji || '') + ' ' + next.title + (next.activity ? ' (' + planActLabel(next.activity) + ')' : '')));
}
function SchedulePlan(props) {
  if (typeof MyDayList === 'function' && !props.legacy) return React.createElement(MyDayList, props);
  var h = React.createElement, pid = props.personId, dayKey = planDayKey();
  var dS = ktUse('plansdone/' + dayKey + '/' + pid, {}), done = dS[0] || {};
  var blocks = planBlocksFor(props.schedHook, pid, dayKey);
  var rS = ktUse('taskruns/' + dayKey + '/' + pid, {}), runs = rS[0] || {};
  var tk = React.useState(0), setTk = tk[1];
  React.useEffect(function () { var iv = setInterval(function () { setTk(function (x) { return x + 1; }); }, 15000); return function () { clearInterval(iv); }; }, []);
  function startTask(b) {
    try { syncSet('taskruns/' + dayKey + '/' + pid + '/' + b.id, { start: Date.now(), title: b.title, activity: b.activity || null }); } catch (e) {}
    if (b.activity && typeof clockInActivity === 'function') { var d = (props.sessions || {})[pid] || {}; var ids = (typeof clockActiveList === 'function' ? clockActiveList(d) : []).map(function (r) { return r.activity; }); if (ids.indexOf(b.activity) === -1) clockInActivity(pid, props.sessions || {}, props.onUpdate, b.activity); }
  }
  function submit(b) { var tr = runs[b.id], mins = tr && tr.start && !tr.end ? Math.max(1, Math.round((Date.now() - tr.start) / 60000)) : (tr && tr.mins) || null;
    if (tr && tr.start && !tr.end) { try { syncSet('taskruns/' + dayKey + '/' + pid + '/' + b.id, Object.assign({}, tr, { end: Date.now(), mins: mins })); } catch (e) {} }
    try { syncSet('plansdone/' + dayKey + '/' + pid + '/' + b.id, { status: 'submitted', ts: Date.now(), title: b.title, pts: b.pts || 0, mins: mins }); } catch (e) {} if (props.addNotif) { try { props.addNotif('approval', pid, '✅ ' + (props.name || pid) + ' finished: ' + b.title, 'Checked off at ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), { id: 'plan_' + dayKey + '_' + pid + '_' + b.id }); } catch (e) {} } }
  function undo(b) { try { syncSet('plansdone/' + dayKey + '/' + pid + '/' + b.id, null); } catch (e) {} }
  return h('div', { style: { padding: '0 0 10px' } },
    h(PlanRightNow, { schedHook: props.schedHook, personId: pid, sessions: props.sessions, onUpdate: props.onUpdate }),
    h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', margin: '4px 0 8px' } }, 'My day'),
    blocks.length === 0 && h('div', { style: { fontSize: 14, color: '#b8b8c8', padding: 14 } }, 'No schedule has been set for today. Ask a parent.'),
    blocks.map(function (b) {
      var dn = done[b.id], st = dn && dn.status, col = b.color || '#9C8DC4';
      return h('div', { key: b.id, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px', marginBottom: 8, background: col + '18', border: '1px solid ' + col + '55', borderRadius: 14, opacity: st === 'approved' ? .7 : 1 } },
        h('div', { style: { minWidth: 62, fontSize: 13, fontWeight: 800, color: '#fff' } }, b.time || '—'),
        h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 15, fontWeight: 800, color: '#fff' } }, (b.emoji ? b.emoji + ' ' : '') + b.title), b.activity && h('div', { style: { fontSize: 12, color: '#b8b8c8' } }, '⏱ ' + planActLabel(b.activity))),
        !st && (!runs[b.id] || !runs[b.id].start) && h('button', { onClick: function () { startTask(b); }, style: { background: '#039BE5', color: '#fff', border: 'none', borderRadius: 20, padding: '10px 12px', fontWeight: 900, fontSize: 13, cursor: 'pointer' } }, '▶ Start'),
        !st && runs[b.id] && runs[b.id].start && !runs[b.id].end && h('div', { style: { fontSize: 12, fontWeight: 800, color: '#FFD54F', fontFamily: 'ui-monospace,Menlo,monospace' } }, '⏱ ' + Math.max(0, Math.round((Date.now() - runs[b.id].start) / 60000)) + 'm'),
        !st && h('button', { onClick: function () { submit(b); }, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 20, padding: '10px 14px', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, '✅ Done'),
        st === 'submitted' && h('button', { onClick: function () { undo(b); }, style: { background: 'rgba(255,213,79,.2)', color: '#FFD54F', border: '1px solid #FFD54F', borderRadius: 20, padding: '8px 12px', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, '🕓 Waiting'),
        st === 'approved' && h('div', { style: { fontSize: 20 } }, '✅'),
        st === 'redo' && h('button', { onClick: function () { undo(b); }, style: { background: 'rgba(239,83,80,.2)', color: '#FF8A80', border: '1px solid #EF5350', borderRadius: 20, padding: '8px 12px', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, '🔁 Redo'));
    }));
}
function PlanApprovals(props) {
  var h = React.createElement, dayKey = planDayKey();
  var dS = ktUse('plansdone/' + dayKey, {}), all = dS[0] || {}, lS = ktUse('planlog/' + dayKey, {}), logs = lS[0] || {};
  var fam = props.family || [], nm = function (id) { var p = fam.find(function (x) { return x.id === id; }); return p ? p.emoji + ' ' + p.name : id; };
  var rows = []; Object.keys(all).forEach(function (pid) { Object.keys(all[pid] || {}).forEach(function (bid) { var e = all[pid][bid]; if (e && e.status === 'submitted') rows.push({ pid: pid, bid: bid, e: e }); }); });
  var off = []; Object.keys(logs).forEach(function (pid) { Object.values(logs[pid] || {}).forEach(function (l) { off.push(Object.assign({ pid: pid }, l)); }); });
  off.sort(function (a, b) { return b.ts - a.ts; });
  function decide(r, ok) { var path = 'plansdone/' + dayKey + '/' + r.pid + '/' + r.bid; try { syncSet(path, Object.assign({}, r.e, { status: ok ? 'approved' : 'redo', by: 'parent', decidedAt: Date.now() })); } catch (e) {} if (ok && r.e.pts && window._creditFn) { try { window._creditFn(r.pid, r.e.pts, '✅ ' + r.e.title, 'plan_' + dayKey + '_' + r.bid); } catch (e) {} } }
  if (!rows.length && !off.length) return null;
  return h('div', { style: { background: 'rgba(66,165,245,.1)', border: '1px solid rgba(66,165,245,.4)', borderRadius: 16, padding: 14, margin: '10px 14px' } },
    h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '✅ Waiting for your approval (' + rows.length + ')'),
    rows.length === 0 && h('div', { style: { fontSize: 13, color: '#b8b8c8' } }, 'Nothing waiting.'),
    rows.map(function (r) { return h('div', { key: r.pid + r.bid, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
      h('div', { style: { flex: 1, fontSize: 14, color: '#fff' } }, h('b', null, nm(r.pid)), ' — ' + r.e.title + (r.e.mins ? ' (took ' + r.e.mins + ' min)' : ''), h('span', { style: { fontSize: 11, color: '#b8b8c8' } }, '  ' + new Date(r.e.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))),
      h('button', { onClick: function () { decide(r, true); }, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 16, padding: '8px 12px', fontWeight: 900, cursor: 'pointer' } }, '✓'),
      h('button', { onClick: function () { decide(r, false); }, style: { background: 'rgba(239,83,80,.25)', color: '#FF8A80', border: 'none', borderRadius: 16, padding: '8px 12px', fontWeight: 900, cursor: 'pointer' } }, '🔁')); }),
    off.length > 0 && h('div', { style: { marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.12)' } },
      h('div', { style: { fontSize: 13, fontWeight: 800, color: '#FFB74D', marginBottom: 4 } }, '⚠️ Off schedule today (' + off.length + ')'),
      off.slice(0, 8).map(function (l) { return h('div', { key: l.id, style: { fontSize: 12, color: '#ddd', padding: '2px 0' } }, nm(l.pid) + ' · ' + new Date(l.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' · should be ' + planActLabel(l.expected) + ' (' + l.title + '), was ' + (l.actual && l.actual.length ? l.actual.map(planActLabel).join('+') : 'not clocked in')); })));
}

// ── Put the family schedule on Google Calendar (or any calendar app) as a file the calendar can import ──
function ScheduleToCalendar(props) {
  var h = React.createElement, sS = ktUse('schedule', {}), sched = sS[0] || {}, fam = (props.family || []).filter(function (p) { return !p.deleted && p.role !== 'elder'; });
  var oS = React.useState(false), open = oS[0], setOpen = oS[1], wS = React.useState('all'), who = wS[0], setWho = wS[1], dS = React.useState(14), days = dS[0], setDays = dS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  function esc(t) { return String(t || '').replace(/\\/g, '\\\\').replace(/[,;]/g, function (c) { return '\\' + c; }).replace(/\n/g, '\\n'); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function build() {
    var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MyBethelFamilyHome//Schedule//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:' + esc(who === 'all' ? 'Bethel Family Schedule' : ((fam.find(function (p) { return p.id === who; }) || {}).name || who) + ' schedule')], count = 0, stamp = new Date();
    for (var i = 0; i < days; i++) {
      var d = new Date(); d.setDate(d.getDate() + i);
      var key = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()), alt = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      var day = sched[key] || sched[alt]; if (!day) continue;
      var bl = (Array.isArray(day.blocks) ? day.blocks : Object.values(day.blocks || {})).filter(function (b) { return b && (!b.kids || !b.kids.length || who === 'all' || b.kids.indexOf(who) !== -1); }).map(function (b) { return { b: b, t: planMinutes(b.time || b.t) }; }).filter(function (x) { return x.t != null; }).sort(function (a, b) { return a.t - b.t; });
      bl.forEach(function (x, k) {
        var end = k + 1 < bl.length ? bl[k + 1].t : x.t + 30; if (end <= x.t) end = x.t + 30; if (end > 24 * 60 - 1) end = 24 * 60 - 1;
        var ds = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()), tm = function (m) { return pad(Math.floor(m / 60)) + pad(m % 60) + '00'; };
        L.push('BEGIN:VEVENT', 'UID:sched-' + key + '-' + (x.b.id || k) + '@mybethelfamilyhome', 'DTSTAMP:' + stamp.getUTCFullYear() + pad(stamp.getUTCMonth() + 1) + pad(stamp.getUTCDate()) + 'T' + pad(stamp.getUTCHours()) + pad(stamp.getUTCMinutes()) + '00Z', 'DTSTART:' + ds + 'T' + tm(x.t), 'DTEND:' + ds + 'T' + tm(end), 'SUMMARY:' + esc((x.b.emoji ? x.b.emoji + ' ' : '') + (x.b.title || 'Schedule')), 'DESCRIPTION:' + esc((x.b.sub || x.b.note || '') + (x.b.kids && x.b.kids.length ? ' (' + x.b.kids.join(', ') + ')' : '')), 'END:VEVENT'); count++;
      });
    }
    L.push('END:VCALENDAR'); return { text: L.join('\r\n'), count: count };
  }
  function go() {
    var r = build(); if (!r.count) { setMsg('No schedule blocks with times found for the next ' + days + ' days.'); return; }
    try { bhDownload('bethel-schedule.ics', r.text, 'text/calendar'); } catch (e) {}
    setMsg('✅ ' + r.count + ' events saved to a file called bethel-schedule.ics. Now import it (steps below).');
  }
  var btn = function (bg, fg, fn, t) { return h('button', { onClick: fn, style: { background: bg, color: fg, border: 'none', borderRadius: 16, padding: '10px 14px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, t); };
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 8, fontSize: 14 };
  return h('div', { style: { margin: '10px 14px' } },
    h('button', { onClick: function () { setOpen(!open); }, style: { width: '100%', textAlign: 'left', background: 'rgba(66,133,244,.15)', border: '1px solid rgba(66,133,244,.5)', borderRadius: 14, padding: 12, color: '#fff', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, '📅 Schedule → Google Calendar ' + (open ? '▾' : '▸')),
    open && h('div', { style: { marginTop: 8, padding: 12, background: 'rgba(255,255,255,.05)', borderRadius: 14 } },
      h('div', { style: { fontSize: 12, color: '#c8c8d8', lineHeight: 1.6, marginBottom: 8 } }, 'This app cannot log into Google by itself, so it makes a calendar file with the schedule blocks and you import it once. Run it again whenever the schedule changes.'),
      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8, alignItems: 'center' } },
        h('select', { value: who, onChange: function (e) { setWho(e.target.value); }, style: inp }, [h('option', { key: 'all', value: 'all', style: { color: '#000' } }, 'Everyone')].concat(fam.map(function (p) { return h('option', { key: p.id, value: p.id, style: { color: '#000' } }, p.emoji + ' ' + p.name); }))),
        h('select', { value: days, onChange: function (e) { setDays(+e.target.value); }, style: inp }, [7, 14, 30, 60].map(function (n) { return h('option', { key: n, value: n, style: { color: '#000' } }, 'Next ' + n + ' days'); })),
        btn('#4285F4', '#fff', go, '⬇ Make calendar file')),
      msg && h('div', { style: { fontSize: 13, color: '#81C784', marginBottom: 8, fontWeight: 700 } }, msg),
      h('div', { style: { fontSize: 12, color: '#b8b8c8', lineHeight: 1.7 } }, 'To import: on a computer open calendar.google.com → ⚙ Settings → Import & export → choose the file → pick which calendar → Import. Tip: import each person’s file into that person’s own calendar. The phone app cannot import files; do it once on a computer and it shows on every device. Importing twice makes duplicates, so delete the old events first.')));
}
