// ═══ ON-TASK GUARD — hourly check-ins, idle lock, School Focus, and approved school links ═══
// Works only while this app is open on the device (a web page cannot watch other apps). Parents' sign-ins are never locked.
function otCfg(pid) {
  var out = { enabled: false, hourly: 60, idle: 10, scope: 'school', focus: true };
  ['__all', pid].forEach(function (k) { var c = null; try { c = syncGet('safety/ontask/' + k); } catch (e) {} if (c) Object.keys(c).forEach(function (x) { if (c[x] != null) out[x] = c[x]; }); });
  return out;
}
function OnTaskGuard() {
  var h = React.createElement, t = React.useState(0), setTick = t[1], lk = React.useState(null), lock = lk[0], setLock = lk[1], nS = React.useState(''), note = nS[0], setNote = nS[1];
  var pid = ''; try { pid = (JSON.parse(localStorage.getItem('last_user') || 'null') || {}).personId || ''; } catch (e) {}
  var exempt = !pid || pid === 'laurel' || pid === 'eric';
  var sesS = ktUse('sessions/' + (typeof todayKey === 'function' ? todayKey() : '') + '/' + (pid || '_none'), null), ses = sesS[0] || {};
  var last = React.useRef(Date.now()), cfgSrc = ktUse('safety/ontask/' + (pid || '_none'), null), cfgAll = ktUse('safety/ontask/__all', null);
  var cfg = otCfg(pid);
  var school = ['school', 'spiritual'];
  var running = [ses.current].concat(ses.others || []).filter(Boolean);
  var onTask = cfg.enabled && !exempt && running.some(function (r) { return cfg.scope === 'any' || school.indexOf(r.activity) !== -1; });
  var cKey = 'fm_ot_last_' + pid;
  React.useEffect(function () {
    function bump() { last.current = Date.now(); }
    var ev = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart', 'wheel', 'click'];
    ev.forEach(function (e) { window.addEventListener(e, bump, { passive: true }); });
    var iv = setInterval(function () { setTick(function (x) { return x + 1; }); }, 10000);
    return function () { ev.forEach(function (e) { window.removeEventListener(e, bump); }); clearInterval(iv); };
  }, []);
  // focus flag for the App (hides distracting tabs while on school work)
  React.useEffect(function () { var f = !!(onTask && cfg.focus); if (window._focusOn !== f) { window._focusOn = f; try { window.dispatchEvent(new Event('fm-focus')); } catch (e) {} } });
  // start a fresh hourly timer when someone clocks in
  var started = React.useRef(false);
  React.useEffect(function () { if (onTask && !started.current) { started.current = true; try { localStorage.setItem(cKey, String(Date.now())); } catch (e) {} } if (!onTask) started.current = false; }, [onTask]);
  if (onTask && !lock) {
    var now = Date.now(), lastCheck = 0; try { lastCheck = +localStorage.getItem(cKey) || 0; } catch (e) {}
    var grace = 0; try { grace = +localStorage.getItem('fm_ot_grace') || 0; } catch (e) {}
    if (now > grace && now - last.current > (Number(cfg.idle) || 10) * 60000) { setTimeout(function () { goLock('idle'); }, 0); }
    else if (lastCheck && now - lastCheck > (Number(cfg.hourly) || 60) * 60000) { setTimeout(function () { goLock('hourly'); }, 0); }
  }
  function goLock(kind) {
    if (lock) return;
    var acts = running.map(function (r) { return r.activity; });
    if (kind === 'idle') { try { localStorage.setItem('fm_ot_resume_' + pid, JSON.stringify(acts)); } catch (e) {} if (typeof clockOutAll === 'function') { var o = {}; o[pid] = ses; clockOutAll(pid, o, function () {}); } }
    setLock({ kind: kind, acts: acts, ts: Date.now() });
  }
  function checkIn() {
    var id = 'ot' + Date.now().toString(36), acts = lock.acts || [];
    try { syncSet('safety/ontask_log/' + pid + '/' + id, { id: id, ts: Date.now(), kind: lock.kind, acts: acts, note: note || '', lockedAt: lock.ts }); } catch (e) {}
    if (lock.kind === 'idle') { var o = {}; o[pid] = syncGet('sessions/' + todayKey() + '/' + pid) || { current: null, today: [] }; var want = []; try { want = JSON.parse(localStorage.getItem('fm_ot_resume_' + pid) || '[]'); } catch (e) {} want.forEach(function (a) { if (typeof clockInActivity === 'function') { clockInActivity(pid, o, function (u) { o = u; }, a, { stack: true }); } }); }
    try { localStorage.setItem(cKey, String(Date.now())); } catch (e) {} last.current = Date.now(); setNote(''); setLock(null);
  }
  if (!lock || exempt) return null;
  var idle = lock.kind === 'idle';
  return h('div', { style: { position: 'fixed', inset: 0, zIndex: 99995, background: 'linear-gradient(160deg,#0f0c29,#1a1a2e)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' } },
    h('div', { style: { maxWidth: 360, width: '100%' } },
      h('div', { style: { fontSize: 60 } }, idle ? '😴' : '⏰'),
      h('div', { style: { fontSize: 22, fontWeight: 900, margin: '8px 0' } }, idle ? 'Are you still there?' : 'Time to check in!'),
      h('div', { style: { fontSize: 14, color: '#bbb', lineHeight: 1.6, marginBottom: 16 } }, idle ? 'No activity for ' + (cfg.idle || 10) + ' minutes, so your clock was paused. Check in to pick up right where you left off.' : 'It has been about ' + (cfg.hourly || 60) + ' minutes. Tell us you are still working on your assignment.'),
      h('input', { type: 'text', placeholder: 'What are you working on? (optional)', value: note, onChange: function (e) { setNote(e.target.value); }, style: { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 12, color: '#fff', padding: 12, fontSize: 15, marginBottom: 12 } }),
      h('button', { onClick: checkIn, style: { width: '100%', background: '#4CAF82', color: '#000', border: 'none', borderRadius: 30, padding: 16, fontWeight: 900, fontSize: 18, cursor: 'pointer' } }, idle ? "✅ I'm here — back to work" : "✅ I'm still on task")));
}

// ── approved school links: kids tap these, the app logs it ──
function SchoolLinks(props) {
  var h = React.createElement, pid = props.personId, isAdmin = props.isAdmin;
  var sel = React.useState(isAdmin ? '__all' : pid), who = sel[0], setWho = sel[1];
  var aS = ktUse('safety/schoollinks/__all', {}), pS = ktUse('safety/schoollinks/' + pid, {}), wS = ktUse('safety/schoollinks/' + who, {});
  var lS = ktUse('safety/linklog/' + (isAdmin ? '__none' : pid), {});
  var fS = React.useState({}), f = fS[0], setF = fS[1];
  var mine = Object.values(aS[0] || {}).concat(pid === '__all' ? [] : Object.values(pS[0] || {})).sort(function (a, b) { return (a.ts || 0) - (b.ts || 0); });
  var editing = Object.values(wS[0] || {});
  function open(l) { try { var id = 'll' + Date.now().toString(36); syncSet('safety/linklog/' + pid + '/' + id, { id: id, ts: Date.now(), title: l.title, url: l.url }); } catch (e) {} try { localStorage.setItem('fm_ot_grace', String(Date.now() + 30 * 60000)); } catch (e) {} window.open(l.url, '_blank', 'noopener'); }
  function add() { var u = String(f.url || '').trim(); if (!f.title || !u) return; if (!/^https?:\/\//i.test(u)) u = 'https://' + u; var id = sfUid('sl'); sfWrite('safety/schoollinks/' + who + '/' + id, { id: id, title: f.title, url: u, ts: Date.now() }, 'Added school link "' + f.title + '"'); setF({}); }
  var card = { background: 'rgba(126,87,194,.1)', border: '1px solid rgba(126,87,194,.4)', borderRadius: 16, padding: 14, margin: '10px 14px' };
  if (!isAdmin && mine.length === 0) return null;
  return h('div', { style: card },
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 4 } }, '📚 Approved school links'),
    !isAdmin && h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.5)', marginBottom: 8 } }, 'Open school sites and videos from here. Going somewhere else for fun is not school time.'),
    !isAdmin && mine.map(function (l) { return h('button', { key: l.id, onClick: function () { open(l); }, style: { display: 'block', width: '100%', textAlign: 'left', background: 'rgba(0,0,0,.2)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: 14, fontWeight: 800, marginBottom: 6, cursor: 'pointer' } }, '▶ ' + l.title); }),
    isAdmin && h('div', null,
      h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.5)', marginBottom: 6 } }, 'Links here appear as big buttons for the children. Pick Everyone or one person.'),
      sfChips(props.family.filter(function (p) { return !p.deleted; }), who, setWho, true, true),
      editing.map(function (l) { return h('div', { key: l.id, style: { display: 'flex', gap: 6, alignItems: 'center', padding: '4px 0', fontSize: 12, color: '#fff' } }, h('div', { style: { flex: 1 } }, l.title + ' — ' + l.url), h('button', { onClick: function () { sfWrite('safety/schoollinks/' + who + '/' + l.id, null, 'Removed school link "' + l.title + '"'); }, style: { background: 'transparent', border: 'none', color: 'rgba(239,83,80,.7)', cursor: 'pointer' } }, '×')); }),
      h('input', { type: 'text', placeholder: 'Title (e.g. Science video — Day 3)', value: f.title || '', onChange: function (e) { setF(Object.assign({}, f, { title: e.target.value })); }, style: SF_INP }),
      h('input', { type: 'text', placeholder: 'Link (YouTube, curriculum page…)', value: f.url || '', onChange: function (e) { setF(Object.assign({}, f, { url: e.target.value })); }, style: SF_INP }),
      sfBtn('#7E57C2', '#fff', add, 'Add school link')));
}

// ── settings tab for the Safety Center ──
function SF_Focus(props) {
  var h = React.createElement, fam = props.fam, pid = props.sel || '__all';
  var cS = ktUse('safety/ontask/' + pid, {}), c = cS[0] || {}, gS = ktUse('safety/ontask/__all', {}), g = pid === '__all' ? {} : (gS[0] || {});
  var lS = ktUse('safety/ontask_log', {}), logs = lS[0] || {};
  var get = function (k, d) { return c[k] != null ? c[k] : (g[k] != null ? g[k] : d); };
  var set = function (k, v) { sfWrite('safety/ontask/' + pid + '/' + k, v, 'On-task setting ' + k + ' for ' + props.nameOf(pid)); };
  var rows = [];
  Object.keys(logs).forEach(function (p) { Object.values(logs[p] || {}).forEach(function (e) { rows.push(Object.assign({ pid: p }, e)); }); });
  rows = rows.filter(function (e) { return new Date(e.ts).toDateString() === new Date().toDateString(); }).sort(function (a, b) { return b.ts - a.ts; });
  var num = function (label, k, d) { return h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } }, h('div', { style: { flex: 1, fontSize: 12, color: '#ddd' } }, label), h('input', { type: 'number', min: 1, key: pid + k + get(k, d), defaultValue: get(k, d), onBlur: function (e) { set(k, parseInt(e.target.value, 10) || d); }, style: Object.assign({}, SF_INP, { width: 80, marginBottom: 0 }) })); };
  return h('div', null,
    sfChips(fam, pid, props.setSel, false, true),
    h('div', { style: SF_CARD },
      h('label', { style: { display: 'flex', gap: 10, alignItems: 'center', color: '#fff', fontSize: 14, fontWeight: 800, marginBottom: 8 } }, h('input', { type: 'checkbox', checked: !!get('enabled', false), onChange: function (e) { set('enabled', e.target.checked); }, style: { width: 22, height: 22 } }), 'Turn on On-Task Guard for ' + (pid === '__all' ? 'Everyone' : props.nameOf(pid))),
      num('Check in every ___ minutes', 'hourly', 60), num('Lock after ___ minutes with no movement', 'idle', 10),
      h('div', { style: { display: 'flex', gap: 6, marginBottom: 8 } }, [['school', 'While clocked into School'], ['any', 'While clocked into anything']].map(function (m) { var on = get('scope', 'school') === m[0]; return h('button', { key: m[0], onClick: function () { set('scope', m[0]); }, style: { flex: 1, padding: 8, borderRadius: 20, border: '1px solid ' + (on ? '#81C784' : 'rgba(255,255,255,.2)'), background: on ? '#81C784' : 'transparent', color: on ? '#000' : '#ccc', fontSize: 11, fontWeight: 800, cursor: 'pointer' } }, m[1]); })),
      h('label', { style: { display: 'flex', gap: 10, alignItems: 'center', color: '#ddd', fontSize: 12 } }, h('input', { type: 'checkbox', checked: !!get('focus', true), onChange: function (e) { set('focus', e.target.checked); }, style: { width: 20, height: 20 } }), 'School Focus: hide Money, Board and Journal while on school work (Health, Messages and Clock stay open)')),
    h('div', { style: SF_CARD }, h('div', { style: { fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 6 } }, '✅ Check-ins today'), rows.length === 0 && h('div', { style: { fontSize: 11, color: '#999' } }, 'None yet.'), rows.slice(0, 20).map(function (e) { return h('div', { key: e.id, style: { fontSize: 11, color: '#ddd', padding: '3px 0' } }, props.nameOf(e.pid) + ' · ' + new Date(e.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' · ' + (e.kind === 'idle' ? 'came back after idle' : 'hourly check-in') + (e.note ? ' — ' + e.note : '')); })),
    h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', lineHeight: 1.6 } }, 'These only work while the app is open. If a device locks or the app is closed, the lock appears the next time it is opened. They cannot block other apps or websites — see the Sites tab and Lock-down steps for that.'));
}
