// ═══ VOLUME CONTROL — everyone controls their own volume; a parent can override any child back ON at any time. ═══
// Firebase: argilan/volume_cfg/<pid> = { floor: 0-4, ts }  (parent override: child is never quieter than floor until released)
//           argilan/volume_cfg/_school = false  (parent turned off the school-hours minimum)
//           argilan/volume_state/<pid> = { own, eff, ts }  (what the child's device is actually doing)
// Levels: 0 mute · 1 soft · 2 normal · 3 loud · 4 ultra
var VC_LABELS = [['🔇', 'Mute'], ['🔈', 'Soft'], ['🔊', 'Normal'], ['📢', 'Loud'], ['📣', 'Ultra']];
var VC_SCHOOL_MIN = 3; // children are never quieter than Loud during school hours
function vcOffDay(ds) { try { return typeof SC_OFF_DAYS !== 'undefined' && SC_OFF_DAYS.indexOf(ds) !== -1; } catch (e) { return false; } }
function vcSchoolHours(now) {
  now = now || new Date();
  var dow = now.getDay(); if (dow < 1 || dow > 5) return false;
  var ds = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
  try { if (typeof SCHOOL_START_DATE !== 'undefined' && ds < SCHOOL_START_DATE) return false; } catch (e) {}
  if (vcOffDay(ds)) return false;
  var m = now.getHours() * 60 + now.getMinutes();
  return m >= 7 * 60 + 30 && m < 15 * 60; // 7:30 AM – 3:00 PM
}
function vcOwn() { var v = parseInt(localStorage.getItem('alarm_vol')); return isNaN(v) ? 4 : v; }
function vcFloor(pid, cfg) { var c = (cfg || {})[pid]; var v = c && c.floor != null ? parseInt(c.floor) : 0; return isNaN(v) ? 0 : v; }
function vcEffective(pid, cfg) {
  var own = vcOwn(), fl = vcFloor(pid, cfg), sc = ((cfg || {})._school !== false && vcSchoolHours()) ? VC_SCHOOL_MIN : 0;
  return Math.max(own, fl, sc);
}
function VolumeGuard(props) {
  var pid = props.personId, child = !!props.isChild;
  var st = React.useState(function () { try { return syncGet('volume_cfg') || {}; } catch (e) { return {}; } }), cfg = st[0], setCfg = st[1];
  var tick = React.useState(0), setTick = tick[1];
  React.useEffect(function () { var u = syncOn('volume_cfg', function (d) { setCfg(d || {}); }); var iv = setInterval(function () { setTick(function (x) { return x + 1; }); }, 30000); return function () { if (u) u(); clearInterval(iv); }; }, []);
  window._volLocked = false;
  window._effVol = function () { return child ? vcEffective(pid, cfg) : null; };
  // when a parent turns a child's volume back ON, raise the child's own setting too so the button shows it
  React.useEffect(function () {
    if (!child) return;
    var fl = vcFloor(pid, cfg), c = (cfg || {})[pid] || {}, seen = 0;
    try { seen = parseInt(localStorage.getItem('vc_seen_' + pid)) || 0; } catch (e) {}
    if (fl > 0 && c.ts && c.ts > seen) {
      try { localStorage.setItem('vc_seen_' + pid, String(c.ts)); if (vcOwn() < fl) localStorage.setItem('alarm_vol', String(fl)); } catch (e) {}
      try { playSound('notif'); } catch (e) {}
      setTick(function (x) { return x + 1; });
    }
  }, [cfg]);
  // let the parent see what this device is really doing
  React.useEffect(function () {
    if (!child || !pid) return;
    var s = { own: vcOwn(), eff: vcEffective(pid, cfg), ts: Date.now() };
    try { var prev = syncGet('volume_state/' + pid) || {}; if (prev.own !== s.own || prev.eff !== s.eff || Date.now() - (prev.ts || 0) > 5 * 60000) syncSet('volume_state/' + pid, s); } catch (e) {}
  });
  React.useEffect(function () { return function () { window._effVol = null; }; }, []);
  return null;
}
function VolumeAdmin(props) {
  var fam = props.family || [];
  var st = React.useState(function () { try { return syncGet('volume_cfg') || {}; } catch (e) { return {}; } }), cfg = st[0], setCfg = st[1];
  var st2 = React.useState(function () { try { return syncGet('volume_state') || {}; } catch (e) { return {}; } }), vs = st2[0], setVs = st2[1];
  React.useEffect(function () {
    var a = syncOn('volume_cfg', function (d) { setCfg(d || {}); }), b = syncOn('volume_state', function (d) { setVs(d || {}); });
    return function () { if (a) a(); if (b) b(); };
  }, []);
  function setFloor(pid, lv) {
    var n = Object.assign({}, cfg); n[pid] = { floor: lv, by: 'parent', ts: Date.now() }; setCfg(n);
    try { syncSet('volume_cfg/' + pid, n[pid]); } catch (e) {}
    try { if (lv > 0) playSound('notif'); } catch (e) {}
  }
  function setSchool(on) { var n = Object.assign({}, cfg); n._school = on; setCfg(n); try { syncSet('volume_cfg/_school', on); } catch (e) {} }
  var kids = fam.filter(function (p) { return p.role === 'child'; });
  var school = cfg._school !== false;
  function lab(i) { return VC_LABELS[Math.max(0, Math.min(4, i))]; }
  function row(p) {
    var fl = vcFloor(p.id, cfg), s = vs[p.id], fresh = s && (Date.now() - (s.ts || 0) < 15 * 60000);
    var own = s ? lab(s.own) : null;
    return React.createElement('div', { key: p.id, style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.07)' } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 3 } }, (p.emoji || '') + ' ' + p.name),
      React.createElement('div', { style: { fontSize: 11, marginBottom: 6, color: s && s.eff === 0 ? '#EF5350' : '#9ad' } },
        s ? ('Their volume: ' + (own[0] + ' ' + own[1]) + (s.eff !== s.own ? ' · playing at ' + lab(s.eff)[1] : '') + (fresh ? '' : ' · (last seen a while ago)')) : 'Their device hasn’t reported yet'),
      React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
        [[0, 'Let them control'], [2, '🔊 Turn ON (Normal)'], [3, '📢 Turn ON (Loud)'], [4, '📣 Turn ON (Ultra)']].map(function (o) {
          var on = fl === o[0];
          return React.createElement('button', { key: o[0], onClick: function () { setFloor(p.id, o[0]); }, style: { background: on ? (o[0] ? '#EF5350' : '#1A73E8') : 'rgba(255,255,255,.07)', color: on ? '#fff' : '#bbb', border: 'none', borderRadius: 20, padding: '6px 11px', fontSize: 11, fontWeight: 800, cursor: 'pointer' } }, o[1]);
        })),
      fl > 0 ? React.createElement('div', { style: { fontSize: 10, color: '#FFB74D', marginTop: 5 } }, 'Override on: ' + p.name + ' can’t go quieter than ' + lab(fl)[1] + ' until you tap “Let them control”.') : null);
  }
  return React.createElement(Fold, { id: 'volumes', title: '🔊 Member volume — turn a child back ON' },
    React.createElement('div', { style: { fontSize: 11, color: '#bbb', lineHeight: 1.5, marginBottom: 8 } }, 'Children set their own volume. If someone isn’t responding, tap “Turn ON” for them — it reaches their device within seconds, plays a chime, and holds their volume up until you release it.'),
    React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#fff', marginBottom: 6, cursor: 'pointer' } },
      React.createElement('input', { type: 'checkbox', checked: school, onChange: function (e) { setSchool(e.target.checked); } }),
      'School days 7:30 AM – 3:00 PM: children are never quieter than Loud'),
    kids.map(row));
}
