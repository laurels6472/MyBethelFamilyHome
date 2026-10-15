// ═══ CLOCK-INS BY DEPARTMENT — four big cards, each with its own running timer; several can run at once ═══
var CD_DEPTS = [
  { id: 'work', label: 'Work', emoji: '💼', color: '#F4511E', acts: ['school', 'spiritual', 'service', 'va_work', 'eric_work', 'consulting', 'el_sales'] },
  { id: 'chores', label: 'Chores', emoji: '🧹', color: '#26A69A', acts: ['chores', 'meals', 'animals'] },
  { id: 'extra', label: 'Extra Curricular', emoji: '🎨', color: '#EC407A', acts: ['free', 'fun', 'driving'] }
];
function cdHms(sec) { sec = Math.max(0, Math.floor(sec)); var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2); }
function cdStyle() {
  if (typeof document === 'undefined' || document.getElementById('cd-style')) return;
  var st = document.createElement('style'); st.id = 'cd-style';
  st.textContent = '@keyframes cdPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}@keyframes cdGlow{0%,100%{box-shadow:0 4px 16px rgba(0,0,0,.3)}50%{box-shadow:0 4px 22px var(--cdc)}}.cd-emoji-on{animation:cdPulse 1.4s ease-in-out infinite}.cd-card-on{animation:cdGlow 2s ease-in-out infinite}.cd-btn:active{transform:scale(.97)}';
  document.head.appendChild(st);
}
function cdSetWith(pid, sessions, onUpdate, actId, text) {
  var d = (sessions || {})[pid] || {}; if (typeof clockActiveList !== 'function') return;
  var list = clockActiveList(d).map(function (r) { return r.activity === actId ? Object.assign({}, r, { with: text }) : r; });
  if (typeof clockSave === 'function') clockSave(pid, sessions, onUpdate, list[0] || null, list.slice(1), d.today || []);
}
function cdTime(ts) { return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
function cdDur(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60); return h > 0 ? h + 'h ' + m + 'm' : m < 1 ? '<1m' : m + 'm'; }
// every session of the day (finished + running) with overlap flags
function cdEntries(data) {
  var now = Date.now(), list = (data.today || []).map(function (e) { return { activity: e.activity, start: e.startTime, end: e.endTime || (e.startTime + (e.duration || 0) * 60000), live: false, with: e.with }; });
  [data.current].concat(data.others || []).filter(Boolean).forEach(function (r) { list.push({ activity: r.activity, start: r.startTime, end: now, live: true, with: r.with }); });
  list.sort(function (a, b) { return a.start - b.start; });
  list.forEach(function (e, i) { e.overlap = list.some(function (o, j) { return j !== i && o.start < e.end && o.end > e.start; }); });
  return list;
}
function ClockDepartments(props) {
  cdStyle();
  var h = React.createElement, pid = props.personId, sessions = props.sessions, onUpdate = props.onUpdate;
  var data = (sessions || {})[pid] || {}, tk = React.useState(0), setTick = tk[1];
  var running = [data.current].concat(data.others || []).filter(Boolean);
  React.useEffect(function () { if (!running.length) return; var iv = setInterval(function () { setTick(function (x) { return x + 1; }); }, 1000); return function () { clearInterval(iv); }; }, [running.length]);
  var acts = typeof CLOCK_ACTS !== 'undefined' ? CLOCK_ACTS : [];
  var person = (props.getPerson && props.getPerson(pid)) || {};
  var runOf = function (id) { return running.find(function (r) { return r.activity === id; }); };
  function toggle(a) {
    var r = runOf(a.id);
    if (r) { if (typeof clockOutActivity === 'function') clockOutActivity(pid, sessions, onUpdate, a.id); return; }
    if (typeof clockInActivity === 'function') clockInActivity(pid, sessions, onUpdate, a.id, { stack: true });
    if (props.addNotif) try { props.addNotif('clock_in', pid, (person.name || '') + ' clocked in: ' + a.label, a.label, {}); } catch (e) {}
  }
  function stopAll() { if (typeof clockOutAll === 'function') clockOutAll(pid, sessions, onUpdate); }
  function actSeconds(id) {
    var done = (data.today || []).filter(function (e) { return e.activity === id; }).reduce(function (n, e) { return n + (e.duration || 0) * 60; }, 0);
    var r = runOf(id); return done + (r ? (Date.now() - r.startTime) / 1000 : 0);
  }
  var deptSeconds = function (d) { return d.acts.reduce(function (n, id) { return n + actSeconds(id); }, 0); };
  var entries = cdEntries(data), totalSec = CD_DEPTS.reduce(function (n, d) { return n + deptSeconds(d); }, 0);
  var nameOf = function (id) { return (acts.find(function (x) { return x.id === id; }) || { label: id }).label; };
  var deptOf = function (id) { return CD_DEPTS.find(function (d) { return d.acts.indexOf(id) !== -1; }) || {}; };
  return h('div', { style: { padding: '14px 14px 6px' } },
    h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: 4 } },
      h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff' } }, '⏱ My Clock-Ins'), h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.45)' } }, 'Multitasking is fine — tap as many as you are doing right now. Each keeps its own time.')),
      running.length > 1 && h('button', { onClick: stopAll, style: { background: 'transparent', color: '#EF9A9A', border: '1px solid rgba(239,83,80,.5)', borderRadius: 20, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' } }, 'Clock out of all')),
    h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.5)', margin: '6px 0 10px' } }, 'Logged today: ' + cdHms(totalSec) + (running.length ? ' · ' + running.length + ' running now' : '')),
    CD_DEPTS.map(function (d) {
      var on = d.acts.some(function (id) { return !!runOf(id); }), sec = deptSeconds(d);
      var opts = d.acts.map(function (a) { return acts.find(function (x) { return x.id === a; }); }).filter(Boolean);
      return h('div', { key: d.id, className: on ? 'cd-card-on' : '', style: { '--cdc': d.color + '88', background: 'linear-gradient(135deg,' + d.color + (on ? '40' : '22') + ',' + d.color + '0a)', border: '1.5px solid ' + d.color + (on ? '' : '70'), borderRadius: 20, padding: 16, marginBottom: 12, boxShadow: '0 4px 16px rgba(0,0,0,.3)' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 } },
          h('div', { className: on ? 'cd-emoji-on' : '', style: { fontSize: 34 } }, d.emoji),
          h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff' } }, d.label), h('div', { style: { fontSize: 11, color: on ? '#fff' : 'rgba(255,255,255,.5)', fontWeight: 700 } }, on ? 'Going strong!' : (sec > 0 ? 'Nice work today!' : 'Ready when you are!'))),
          h('div', { style: { fontSize: 22, fontWeight: 900, color: on ? '#fff' : 'rgba(255,255,255,.55)', fontFamily: 'ui-monospace,Menlo,monospace' } }, cdHms(sec))),
        opts.map(function (a) {
          var r = runOf(a.id), s2 = actSeconds(a.id);
          return h('div', { key: a.id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', marginTop: 6, borderRadius: 14, background: r ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.18)', border: '1px solid ' + (r ? d.color : 'rgba(255,255,255,.08)') } },
            h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, a.label), r && h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.65)' } }, 'since ' + cdTime(r.startTime))),
            h('div', { style: { fontSize: 14, fontWeight: 800, color: r ? '#fff' : 'rgba(255,255,255,.5)', fontFamily: 'ui-monospace,Menlo,monospace' } }, cdHms(s2)),
            h('button', { className: 'cd-btn', onClick: function () { toggle(a); }, style: { padding: '8px 14px', borderRadius: 20, border: 'none', fontWeight: 900, fontSize: 12, cursor: 'pointer', background: r ? '#EF5350' : d.color, color: '#fff', minWidth: 84 } }, r ? '⏹ Out' : '▶ In'));
        }), d.id === 'extra' && runOf('fun') && h('div', { style: { marginTop: 8 } }, h('input', { type: 'text', key: 'w' + (runOf('fun') || {}).startTime, defaultValue: (runOf('fun') || {}).with || '', placeholder: '👫 Who are you with? (friends\u2019 names)', onBlur: function (e) { cdSetWith(pid, sessions, onUpdate, 'fun', e.target.value.trim()); }, style: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,.25)', border: '1px solid rgba(255,255,255,.25)', borderRadius: 12, color: '#fff', padding: '10px 12px', fontSize: 14 } })));
    }),
    h('div', { style: { marginTop: 14, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: 14 } },
      h('div', { style: { fontSize: 12, fontWeight: 900, color: '#fff', marginBottom: 2 } }, '🗓 Where my time went today'),
      h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 8 } }, 'Every clock-in with its start and end. 🔀 means I was doing it at the same time as something else.'),
      entries.length === 0 && h('div', { style: { fontSize: 12, color: 'rgba(255,255,255,.4)' } }, 'Nothing yet — tap an ▶ In button to start.'),
      entries.map(function (e, i) { var d = deptOf(e.activity); return h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: i ? '1px solid rgba(255,255,255,.06)' : 'none' } },
        h('div', { style: { width: 8, height: 8, borderRadius: '50%', background: d.color || '#888', flexShrink: 0 } }),
        h('div', { style: { flex: 1, fontSize: 12, color: '#fff' } }, nameOf(e.activity) + (e.with ? ' with ' + e.with : ''), e.overlap && h('span', { style: { marginLeft: 6, fontSize: 10, color: '#FFB74D' } }, '🔀 multitasking')),
        h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.55)', textAlign: 'right' } }, cdTime(e.start) + ' – ' + (e.live ? 'now' : cdTime(e.end)), h('div', { style: { fontWeight: 800, color: e.live ? '#81C784' : '#fff' } }, cdDur((e.end - e.start) / 1000)))); })));
}

// Parents: everyone's clock-ins at a glance (who is clocked into what, since when, and the day so far)
function ClockFamilyBoard(props) {
  var h = React.createElement, sessions = props.sessions || {}, fam = (props.family || []).filter(function (p) { return !p.deleted; });
  var tk = React.useState(0), setTick = tk[1], oS = React.useState(null), open = oS[0], setOpen = oS[1];
  React.useEffect(function () { var iv = setInterval(function () { setTick(function (x) { return x + 1; }); }, 30000); return function () { clearInterval(iv); }; }, []);
  var nameOf = function (id) { return (typeof CLOCK_ACTS !== 'undefined' ? CLOCK_ACTS : []).reduce(function (n, x) { return x.id === id ? x.label : n; }, id); };
  return h('div', { style: { margin: '10px 14px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: 14 } },
    h('div', { style: { fontSize: 12, fontWeight: 900, color: '#fff', marginBottom: 8 } }, '👀 Everyone\u2019s time right now'),
    fam.map(function (p) {
      var d = sessions[p.id] || {}, run = [d.current].concat(d.others || []).filter(Boolean), ent = cdEntries(d), tot = ent.reduce(function (n, e) { return n + (e.end - e.start) / 1000; }, 0);
      return h('div', { key: p.id, style: { padding: '7px 0', borderTop: '1px solid rgba(255,255,255,.06)' } },
        h('div', { onClick: function () { setOpen(open === p.id ? null : p.id); }, style: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' } },
          h('div', { style: { fontSize: 20 } }, p.emoji),
          h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, p.name), h('div', { style: { fontSize: 11, color: run.length ? '#81C784' : 'rgba(255,255,255,.4)' } }, run.length ? run.map(function (r) { return nameOf(r.activity) + ' (since ' + cdTime(r.startTime) + ')'; }).join(' + ') : 'Not clocked in')),
          h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.55)' } }, cdDur(tot) + ' today ' + (open === p.id ? '▲' : '▼'))),
        open === p.id && h('div', { style: { margin: '6px 0 0 28px' } }, ent.length === 0 ? h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.4)' } }, 'No clock-ins yet today.') : ent.map(function (e, i) { return h('div', { key: i, style: { display: 'flex', fontSize: 11, color: '#ddd', padding: '2px 0', gap: 8 } }, h('div', { style: { flex: 1 } }, nameOf(e.activity) + (e.overlap ? ' 🔀' : '')), h('div', null, cdTime(e.start) + ' – ' + (e.live ? 'now' : cdTime(e.end)) + ' · ' + cdDur((e.end - e.start) / 1000)))
        })));
    }));
}
