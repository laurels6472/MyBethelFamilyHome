// ═══ SAFETY CENTER — consent-based check-ins, device rules reference, remote device controls, and UNDO ═══
// Honest limits: a web app can't track in the background or lock the phone itself. Check-ins are sent when a person taps the button.
// "Device commands" act on THIS APP on that device (sign out / lock this app / wipe its local data / unlink). Phone-level lock
// (Screen Time, Family Link, Find My) still happens in those systems. Every change made here is recorded and can be undone.
function sfDeviceId() { try { var d = localStorage.getItem('fm_device_id'); if (!d) { d = 'dv' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); localStorage.setItem('fm_device_id', d); } return d; } catch (e) { return 'dv-temp'; } }
function sfUid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
// Every write goes through here so it can be undone.
function sfWrite(path, value, label) {
  var before = null; try { before = syncGet(path); } catch (e) {}
  var id = sfUid('h'); try { syncSet('safety/history/' + id, { id: id, ts: Date.now(), by: window._currentPersonId || '', path: path, label: label || path, before: before == null ? null : before, after: value == null ? null : value, undone: false }); } catch (e) {}
  syncSet(path, value);
}
function sfUndo(h) {
  if (!h || h.undone) return; syncSet(h.path, h.before == null ? null : h.before); syncSet('safety/history/' + h.id + '/undone', true);
}
var SF_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var SF_MODES = [['apponly', '📱 This app only (lock the phone to it)'], ['free', '🎮 Free time (other apps OK)'], ['down', '🌙 Downtime / bedtime (phone off)']];
function sfActiveWindow(rules) {
  var now = new Date(), day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes(), hit = null;
  (rules || []).forEach(function (w) { if (!w || !(w.days || []).includes(day)) return; var s = (w.start || '00:00').split(':'), e = (w.end || '23:59').split(':'); var a = +s[0] * 60 + +s[1], b = +e[0] * 60 + +e[1]; if (mins >= a && mins < b) hit = w; });
  return hit;
}
var SF_CARD = { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: 12, marginBottom: 10 };
var SF_INP = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 10, color: '#fff', padding: '8px 10px', fontSize: 14, width: '100%', boxSizing: 'border-box', marginBottom: 6, fontFamily: 'inherit' };
function sfChips(fam, sel, setSel, onlyKids, withAll) {
  var h = React.createElement, list = (withAll ? [{ id: '__all', emoji: '👪', name: 'Everyone', color: '#FFB74D' }] : []).concat(fam.filter(function (p) { return !onlyKids || p.role !== 'parent'; }));
  return h('div', { style: { display: 'flex', gap: 5, overflowX: 'auto', marginBottom: 8 } }, list.map(function (p) { return h('button', { key: p.id, onClick: function () { setSel(p.id); }, style: { flexShrink: 0, padding: '5px 10px', borderRadius: 20, border: 'none', background: sel === p.id ? p.color || '#81C784' : 'rgba(255,255,255,.1)', color: sel === p.id ? '#000' : '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' } }, p.emoji + ' ' + p.name); }));
}
function sfWordsFor(pid) {
  var out = { mode: 'block', list: [] }, seen = {};
  ['__all', pid].forEach(function (k) { var c = null; try { c = syncGet('safety/words/' + k); } catch (e) {} if (!c) return; if (c.mode && (k === pid || !out.modeSet)) { out.mode = c.mode; out.modeSet = k === pid; } Object.values(c.list || {}).forEach(function (x) { if (x && x.w && !seen[x.w]) { seen[x.w] = 1; out.list.push(x.w); } }); });
  return out;
}
// true if a search/typed phrase is NOT allowed for this person
function sfWordBlocked(text, pid) {
  var t = ' ' + String(text || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ') + ' ', cfg = sfWordsFor(pid);
  if (!cfg.list.length) return false;
  var hit = cfg.list.some(function (w) { return t.indexOf(' ' + w.toLowerCase() + ' ') !== -1 || (w.length > 4 && t.indexOf(w.toLowerCase()) !== -1); });
  return cfg.mode === 'allow' ? !hit : hit;
}
function sfSiteBlockedNow(d, pid) {
  var k = d.replace(/\./g, '_'), hit = false;
  ['__all', pid].forEach(function (x) { var c = null; try { c = syncGet('safety/sites/' + x + '/block/' + k); } catch (e) {} if (c && (!c.until || c.until > Date.now())) hit = true; });
  return hit;
}
function sfBtn(bg, fg, fn, t, small) { return React.createElement('button', { onClick: fn, style: { background: bg, color: fg || '#000', border: 'none', borderRadius: 20, padding: small ? '5px 10px' : '8px 14px', fontWeight: 800, fontSize: small ? 11 : 12, cursor: 'pointer' } }, t); }

// ── mounted once at the app root: registers this device, obeys admin commands ──
function DeviceGuard() {
  var h = React.createElement, id = React.useRef(sfDeviceId()).current;
  var dS = ktUse('devices/' + id, null), dev = dS[0];
  var tick = React.useState(0), setTick = tick[1];
  React.useEffect(function () {
    function beat() {
      var pid = window._currentPersonId || ''; if (!pid) return;
      var ua = navigator.userAgent || '', kind = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows PC' : /Mac/.test(ua) ? 'Mac' : 'Device';
      try { syncSet('devices/' + id + '/info', { id: id, kind: kind, personId: pid, lastSeen: Date.now(), online: navigator.onLine !== false }); } catch (e) {}
    }
    var t0 = setTimeout(beat, 3000), iv = setInterval(beat, 60000); return function () { clearTimeout(t0); clearInterval(iv); };
  }, []);
  React.useEffect(function () {
    if (!dev || !dev.cmd || !dev.cmd.ts) return; var seen = 0; try { seen = +localStorage.getItem('fm_cmd_seen') || 0; } catch (e) {}
    if (dev.cmd.ts <= seen) return; try { localStorage.setItem('fm_cmd_seen', String(dev.cmd.ts)); } catch (e) {}
    var t = dev.cmd.type, keep = ['fm_device_id', 'fm_cmd_seen', 'fb_cfg'];
    function clearLocal(all) { try { Object.keys(localStorage).forEach(function (k) { if (all ? k !== 'fm_device_id' && k !== 'fm_cmd_seen' : keep.indexOf(k) === -1) localStorage.removeItem(k); }); sessionStorage.clear(); } catch (e) {} }
    if (t === 'signout') { try { localStorage.removeItem('last_user'); } catch (e) {} location.reload(); }
    if (t === 'wipe') { clearLocal(false); location.reload(); }
    if (t === 'unlink') { clearLocal(true); try { syncSet('devices/' + id, null); } catch (e) {} location.reload(); }
    if (t === 'refresh') location.reload();
  }, [dev && dev.cmd && dev.cmd.ts]);
  var me = window._currentPersonId, isOwner = me === 'laurel' || me === 'eric';
  if (dev && dev.locked && !isOwner) return h('div', { style: { position: 'fixed', inset: 0, zIndex: 100000, background: '#0e0c20', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 30 } },
    h('div', null, h('div', { style: { fontSize: 54 } }, '🔒'), h('div', { style: { fontSize: 20, fontWeight: 900, margin: '10px 0' } }, 'This app is locked'), h('div', { style: { fontSize: 13, color: '#aaa', lineHeight: 1.6 } }, (dev.lockMsg || 'A parent locked this for now.') + ' Ask a parent to unlock it.')));
  return null;
}

// ── member-facing card (home screen): consent, check-in, today's windows ──
function SafetyCard(props) {
  var h = React.createElement, pid = props.personId;
  var cS = ktUse('safety/consent/' + pid, null), con = cS[0];
  var rS = ktUse('safety/rules/' + pid, []), raS = ktUse('safety/rules/__all', []), rl = function (x) { return Array.isArray(x) ? x : Object.values(x || {}); }, rules = rl(rS[0]).concat(rl(raS[0]));
  var mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  var bS = React.useState(false), busy = bS[0], setBusy = bS[1];
  var say = function (t) { setMsg(t); setTimeout(function () { setMsg(''); }, 4000); };
  var win = sfActiveWindow(rules);
  function setConsent(v) { sfWrite('safety/consent/' + pid, v ? { location: true, ts: Date.now(), device: sfDeviceId() } : null, (v ? 'Location sharing ON for ' : 'Location sharing OFF for ') + pid); }
  function checkIn(kind) {
    if (!navigator.geolocation) { say('Location is not available on this device.'); return; }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(function (p) {
      var id = sfUid('ci'); syncSet('safety/checkins/' + pid + '/' + id, { id: id, ts: Date.now(), lat: p.coords.latitude, lon: p.coords.longitude, acc: Math.round(p.coords.accuracy || 0), kind: kind });
      var map = 'https://www.google.com/maps?q=' + p.coords.latitude + ',' + p.coords.longitude, who = props.name || pid;
      ['laurel', 'eric'].forEach(function (to) {
        if (kind !== 'ride' && to !== 'laurel') { var cf = null; try { cf = syncGet('notify_cfg'); } catch (e) {} if (!(cf && cf.types && cf.types.checkin_loc)) return; }
        var nid = (kind === 'ride' ? 'ride_' : 'loc_') + to + '_' + id;
        syncSet('notifs/' + nid, { id: nid, type: kind === 'ride' ? 'safety' : 'checkin_loc', personId: to, aboutId: pid, title: (kind === 'ride' ? '🚗 ' + who + ' needs a ride / pickup' : '📍 ' + who + ' checked in'), message: (kind === 'ride' ? 'Needs a pickup. ' : 'Location sent. ') + 'Accuracy about ' + Math.round(p.coords.accuracy || 0) + ' m.', link: map, timestamp: Date.now(), read: false, approved: null, requiresApproval: false });
      });
      setBusy(false); say(kind === 'ride' ? 'Sent — a parent will see it.' : '✅ Checked in!');
    }, function () { setBusy(false); say('Could not get location — allow Location for this site.'); }, { enableHighAccuracy: true, timeout: 15000 });
  }
  return h('div', { style: { margin: '10px 14px', background: 'rgba(76,175,130,.07)', border: '1px solid rgba(76,175,130,.35)', borderRadius: 14, padding: 12 } },
    h('div', { style: { fontSize: 11, fontWeight: 800, color: '#81C784', letterSpacing: 1, marginBottom: 6 } }, '🛡 SAFETY'),
    msg && h('div', { style: { background: 'rgba(76,175,130,.18)', color: '#9be5bd', borderRadius: 8, padding: '5px 8px', fontSize: 12, marginBottom: 6 } }, msg),
    win && h('div', { style: { background: 'rgba(0,0,0,.25)', borderRadius: 10, padding: 8, marginBottom: 8, fontSize: 12, color: '#fff' } }, 'Right now: ', h('b', null, win.label || 'Scheduled time'), ' · ' + (SF_MODES.find(function (m) { return m[0] === win.mode; }) || ['', ''])[1] + ' until ' + win.end),
    h(SF_AskSite, { pid: pid, name: props.name }),
    !con ? h('div', null, h('div', { style: { fontSize: 11, color: '#ddd', lineHeight: 1.6, marginBottom: 8 } }, 'Share my location with my parents when I tap "Check in." Nothing is tracked in the background. I can turn this off any time.'), sfBtn('#81C784', '#000', function () { setConsent(true); }, 'I agree — turn on check-ins'))
      : h('div', null, h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, sfBtn('#81C784', '#000', function () { checkIn('checkin'); }, busy ? 'Finding you…' : '📍 Check in'), sfBtn('#FF9800', '#000', function () { checkIn('ride'); }, '🚗 I need a ride'), sfBtn('transparent', '#aaa', function () { setConsent(false); }, 'Turn off', true)),
        h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 6 } }, 'Sharing is ON. Only taps send your location.')));
}

// ── Admin Safety Center ──
function SafetyCenter(props) {
  var h = React.createElement, fam = (props.family || []).filter(function (p) { return !p.deleted; });
  var tS = React.useState('people'), tab = tS[0], setTab = tS[1];
  var cS = ktUse('safety/consent', {}), consent = cS[0] || {};
  var ckS = ktUse('safety/checkins', {}), checkins = ckS[0] || {};
  var dS = ktUse('devices', {}), devs = Object.values(dS[0] || {}).map(function (d) { return Object.assign({}, d.info || {}, { id: (d.info || {}).id, cmd: d.cmd, locked: d.locked, lockMsg: d.lockMsg, name: d.name }); }).filter(function (d) { return d.id; });
  var hS = ktUse('safety/history', {}), hist = Object.values(hS[0] || {}).sort(function (a, b) { return b.ts - a.ts; });
  var rAll = ktUse('safety/rules', {}), rulesAll = rAll[0] || {};
  var selS = React.useState((fam[0] || {}).id), sel = selS[0], setSel = selS[1];
  var mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  var wS = React.useState({ days: [1, 2, 3, 4, 5], start: '08:00', end: '12:00', mode: 'apponly' }), w = wS[0], setW = wS[1];
  var say = function (t) { setMsg(t); setTimeout(function () { setMsg(''); }, 3500); };
  var nameOf = function (id) { if (id === '__all') return 'Everyone'; return (fam.find(function (p) { return p.id === id; }) || {}).name || id; };
  var ago = function (ts) { var m = Math.round((Date.now() - ts) / 60000); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago'; };
  var ok = function (m) { return window._safeConfirm ? window._safeConfirm(m) : confirm(m); };
  if (!props.isAdmin) return h('div', { style: { padding: 20, color: '#aaa' } }, 'Parents only.');
  var rules = function (pid) { var r = rulesAll[pid]; return Array.isArray(r) ? r : Object.values(r || {}); };
  function cmd(d, type) { var labels = { signout: 'Sign this device out', wipe: 'Erase this app’s saved data on that device', unlink: 'UNLINK that device from the family (it must be set up again)', refresh: 'Reload the app on that device' }; if (!ok(labels[type] + '?')) return; syncSet('devices/' + d.id + '/cmd', { type: type, ts: Date.now(), by: window._currentPersonId }); say('Command sent — it runs the next time that device is online with the app open.'); }
  function lock(d, v) { syncSet('devices/' + d.id + '/locked', v ? true : null); say(v ? 'Locked.' : 'Unlocked.'); }
  function addWin() { var list = rules(sel).slice(); if (!w.label) { say('Give the window a name.'); return; } list.push(Object.assign({ id: sfUid('w') }, w)); sfWrite('safety/rules/' + sel, list, 'Added window "' + w.label + '" for ' + nameOf(sel)); setW(Object.assign({}, w, { label: '' })); }
  function delWin(id) { sfWrite('safety/rules/' + sel, rules(sel).filter(function (x) { return x.id !== id; }), 'Removed a window for ' + nameOf(sel)); }
  function panic() {
    if (!ok('RESET Safety to empty? This turns off all consents, deletes all check-in locations and all device rules. You can still UNDO each step from the Undo tab.')) return;
    ['safety/consent', 'safety/checkins', 'safety/rules'].forEach(function (p) { sfWrite(p, null, 'RESET: cleared ' + p.split('/')[1]); }); say('Everything reset. Use Undo to bring any of it back.');
  }
  var tabs = [['people', '👥 People'], ['devices', '📱 Devices'], ['rules', '⏰ Rules'], ['web', '🌐 Sites'], ['words', '🔤 Words'], ['focus', '🎯 On-Task'], ['terms', '📜 Terms'], ['lock', '🔧 Lock-down'], ['undo', '↩️ Undo']];
  var btn = function (bg, fg, fn, t) { return sfBtn(bg, fg, fn, t, true); };
  return h('div', { style: { paddingBottom: 60 } },
    h('div', { style: { padding: '12px 14px 4px' } }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff' } }, '🛡 Safety Center'), h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', lineHeight: 1.5 } }, 'Consent-based. Everything here syncs through the family database and can be undone.')),
    h('div', { style: { display: 'flex', borderBottom: '1px solid rgba(255,255,255,.08)' } }, tabs.map(function (t) { return h('button', { key: t[0], onClick: function () { setTab(t[0]); }, style: { flex: 1, padding: '10px 4px', background: 'transparent', border: 'none', borderBottom: '2px solid ' + (tab === t[0] ? '#81C784' : 'transparent'), color: tab === t[0] ? '#81C784' : 'rgba(255,255,255,.4)', fontWeight: tab === t[0] ? 800 : 500, fontSize: 12, cursor: 'pointer' } }, t[1]); })),
    h('div', { style: { padding: 14 } },
      msg && h('div', { style: { background: 'rgba(76,175,130,.15)', color: '#9be5bd', borderRadius: 8, padding: '6px 10px', fontSize: 12, marginBottom: 8 } }, msg),

      tab === 'people' && h('div', null, fam.map(function (p) {
        var c = consent[p.id], list = Object.values(checkins[p.id] || {}).sort(function (a, b) { return b.ts - a.ts; }), last = list[0];
        return h('div', { key: p.id, style: SF_CARD },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } }, h('div', { style: { fontSize: 22 } }, p.emoji), h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 14, fontWeight: 800, color: '#fff' } }, p.name), h('div', { style: { fontSize: 10, color: c ? '#81C784' : '#999' } }, c ? 'Consented · ' + new Date(c.ts).toLocaleDateString() : 'Has not opted in'))),
          last && h('div', { style: { marginTop: 8, fontSize: 12, color: '#fff' } }, (last.kind === 'ride' ? '🚗 Asked for a ride ' : '📍 Last check-in ') + ago(last.ts) + ' (±' + last.acc + ' m) ', h('a', { href: 'https://www.google.com/maps?q=' + last.lat + ',' + last.lon, target: '_blank', rel: 'noopener', style: { color: '#90CAF9' } }, 'Open map')),
          list.length > 1 && h('div', { style: { fontSize: 10, color: '#999', marginTop: 4 } }, list.slice(1, 6).map(function (x) { return ago(x.ts); }).join(' · ')),
          h('div', { style: { display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' } }, c && btn('rgba(239,83,80,.25)', '#EF9A9A', function () { sfWrite('safety/consent/' + p.id, null, 'Admin turned off sharing for ' + p.name); }, 'Revoke sharing'), !c && p.role !== 'parent' && btn('#81C784', '#000', function () { if (ok('Record consent for ' + p.name + ' as their parent/guardian? They will see check-in buttons on their own device.')) sfWrite('safety/consent/' + p.id, { location: true, ts: Date.now(), device: 'guardian:' + (window._currentPersonId || '') }, 'Guardian consent recorded for ' + p.name); }, 'Record guardian consent'), list.length > 0 && btn('rgba(255,255,255,.12)', '#fff', function () { if (ok('Delete all of ' + p.name + '’s saved check-ins? (Undo is available.)')) sfWrite('safety/checkins/' + p.id, null, 'Deleted check-ins for ' + p.name); }, 'Delete their locations')));
      }), h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)', lineHeight: 1.5 } }, 'For live location and finding a lost phone, also use Apple Find My (Family Sharing) or Google Family Link / Find My Device — those work with the screen off.')),

      tab === 'devices' && h('div', null,
        devs.length === 0 && h('div', { style: { color: '#999', fontSize: 12 } }, 'No devices have checked in yet. They appear here once someone opens the app on them.'),
        devs.sort(function (a, b) { return (b.lastSeen || 0) - (a.lastSeen || 0); }).map(function (d) {
          return h('div', { key: d.id, style: SF_CARD },
            h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } }, h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, (d.kind || 'Device') + ' · ' + nameOf(d.personId) + (d.locked ? ' 🔒' : '')), h('div', { style: { fontSize: 10, color: '#aaa' } }, 'Seen ' + ago(d.lastSeen || 0) + (d.id === sfDeviceId() ? ' · THIS device' : ''))), h('div', { style: { width: 10, height: 10, borderRadius: '50%', background: Date.now() - (d.lastSeen || 0) < 180000 ? '#4CAF50' : '#777' } })),
            h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } }, d.locked ? btn('#81C784', '#000', function () { lock(d, false); }, '🔓 Unlock app') : btn('#FF9800', '#000', function () { lock(d, true); }, '🔒 Lock app'), btn('rgba(255,255,255,.12)', '#fff', function () { cmd(d, 'signout'); }, 'Sign out'), btn('rgba(255,255,255,.12)', '#fff', function () { cmd(d, 'refresh'); }, 'Reload'), btn('rgba(239,83,80,.25)', '#EF9A9A', function () { cmd(d, 'wipe'); }, 'Erase app data'), btn('rgba(239,83,80,.25)', '#EF9A9A', function () { cmd(d, 'unlink'); }, 'Unlink device')));
        }),
        h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)', lineHeight: 1.5 } }, 'These act on THIS APP only, and only when the device is online with the app open. They cannot lock the whole phone or remove other apps — use Screen Time / Family Link for that. Parents’ own sign-ins are never locked out.')),

      tab === 'rules' && h('div', null,
        sfChips(fam, sel, setSel, true, true),
        sel === '__all' && h('div', { style: { fontSize: 10, color: '#FFB74D', marginBottom: 6 } }, 'Windows added under Everyone apply to every child and to Grandpa, on top of their own.'),
        rules(sel).length === 0 && h('div', { style: { color: '#999', fontSize: 12, marginBottom: 8 } }, 'No windows yet for ' + nameOf(sel) + '.'),
        rules(sel).map(function (x) { return h('div', { key: x.id, style: SF_CARD }, h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, x.label + ' · ' + x.start + '–' + x.end), h('div', { style: { fontSize: 10, color: '#aaa' } }, (x.days || []).map(function (d) { return SF_DAYS[d]; }).join(' ') + ' · ' + (SF_MODES.find(function (m) { return m[0] === x.mode; }) || ['', ''])[1]), h('div', { style: { marginTop: 6 } }, btn('rgba(239,83,80,.25)', '#EF9A9A', function () { delWin(x.id); }, 'Remove'))); }),
        h('div', { style: SF_CARD },
          h('input', { type: 'text', placeholder: 'Window name (School time, Free time, Bedtime…)', value: w.label || '', onChange: function (e) { setW(Object.assign({}, w, { label: e.target.value })); }, style: SF_INP }),
          h('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 } }, SF_DAYS.map(function (n, i) { var on = (w.days || []).includes(i); return h('button', { key: n, onClick: function () { setW(Object.assign({}, w, { days: on ? w.days.filter(function (x) { return x !== i; }) : w.days.concat([i]) })); }, style: { padding: '6px 9px', borderRadius: 20, border: 'none', background: on ? '#81C784' : 'rgba(255,255,255,.1)', color: on ? '#000' : '#ccc', fontWeight: 700, fontSize: 11, cursor: 'pointer' } }, n); })),
          h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'time', value: w.start, onChange: function (e) { setW(Object.assign({}, w, { start: e.target.value })); }, style: SF_INP }), h('input', { type: 'time', value: w.end, onChange: function (e) { setW(Object.assign({}, w, { end: e.target.value })); }, style: SF_INP })),
          h('select', { value: w.mode, onChange: function (e) { setW(Object.assign({}, w, { mode: e.target.value })); }, style: SF_INP }, SF_MODES.map(function (m) { return h('option', { key: m[0], value: m[0], style: { color: '#000' } }, m[1]); })),
          sfBtn('#81C784', '#000', addWin, 'Add window')),
        h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)', lineHeight: 1.5 } }, 'These windows show on the child’s home screen as "Right now." To actually enforce them, set the same times in Screen Time (iPhone) or Family Link (Android). On iPhone, Guided Access locks the screen to just this app.')),

      tab === 'focus' && h(SF_Focus, { fam: fam, nameOf: nameOf, sel: sel, setSel: setSel }),
      tab === 'terms' && h(SF_Terms, { fam: fam, nameOf: nameOf }),
      tab === 'words' && h(SF_Words, { fam: fam, nameOf: nameOf, sel: sel, setSel: setSel }),
      tab === 'web' && h(SF_Sites, { fam: fam, nameOf: nameOf, sel: sel, setSel: setSel }),
      tab === 'lock' && h(SF_Hardening, { fam: fam, nameOf: nameOf, sel: sel, setSel: setSel }),
      tab === 'undo' && h('div', null,
        h('div', { style: Object.assign({}, SF_CARD, { borderColor: 'rgba(239,83,80,.5)' }) }, h('div', { style: { fontSize: 12, color: '#ddd', lineHeight: 1.5, marginBottom: 8 } }, 'Something went sideways? Undo the last change, or wipe Safety back to empty (that is undoable too).'), h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, sfBtn('#FFB74D', '#000', function () { var l = hist.find(function (x) { return !x.undone; }); if (l) { sfUndo(l); say('Undid: ' + l.label); } else say('Nothing to undo.'); }, '↩️ Undo last change'), sfBtn('rgba(239,83,80,.8)', '#fff', panic, '🧯 Reset Safety to empty'))),
        hist.length === 0 && h('div', { style: { color: '#999', fontSize: 12 } }, 'No changes recorded yet.'),
        hist.slice(0, 50).map(function (x) { return h('div', { key: x.id, style: { display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.06)', alignItems: 'center', opacity: x.undone ? 0.45 : 1 } }, h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 12, color: '#fff' } }, x.label), h('div', { style: { fontSize: 9, color: '#999' } }, new Date(x.ts).toLocaleString() + ' · by ' + nameOf(x.by) + (x.undone ? ' · undone' : ''))), !x.undone && btn('#FFB74D', '#000', function () { sfUndo(x); say('Undone.'); }, 'Undo')); }),
        h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 8 } }, 'History covers Safety Center changes. Device commands (sign out, erase, unlink) cannot be un-run, but an unlinked device can be set up again from Admin → Sync Setup.'))));
}

// ── Lock-down checklist: the phone-level steps that actually make controls hard to undo ──
var SF_STEPS = {
  ios: [
    ['i1', 'Set a Screen Time passcode that only parents know (Settings → Screen Time → Use Screen Time Passcode). Different from the phone\u2019s own passcode.'],
    ['i2', 'Turn on Content & Privacy Restrictions, then set Passcode Changes, Account Changes, Cellular Data Changes and Delete Apps to "Don\u2019t Allow."'],
    ['i3', 'Set Downtime, App Limits, and put only allowed apps (this app, Phone, Messages) under "Always Allowed."'],
    ['i4', 'Turn on Lock Screen Time Settings / disable "Share Across Devices" tampering; remove any other Apple ID the child could use.'],
    ['i5', 'Find My iPhone ON with a parent Apple ID (Activation Lock), and Family Sharing "Ask to Buy" ON.'],
    ['i6', 'Keep the CleanBrowsing / DNS profile installed, and check that Screen Time blocks removing it (or supervise the device, below).'],
    ['i7', 'STRONGEST: supervise the device with a management tool (Apple Configurator on a Mac, or an MDM such as Jamf Now / Mosyle). Supervised phones can block removing profiles, adding or removing VPN/DNS settings, and erasing the phone, and can run in single-app mode. Setup erases the phone once.'],
    ['i7b', 'Web filter: Settings → Screen Time → Content & Privacy → Content Restrictions → Web Content → Allowed Websites Only (or Limit Adult Websites + add blocked sites). Use the list from the Websites tab. Safari is filtered; other browsers should be removed or blocked.'],
    ['i8', 'Test it: restart the phone, then try to delete the profile, change the passcode, and open Settings. Write down what still works.']
  ],
  android: [
    ['a1', 'Create the child\u2019s Google account in Family Link and make it supervised; set daily limits, bedtime, and app approvals.'],
    ['a2', 'Turn on "Block unknown sources" and Play Store approvals; remove other Google accounts from the phone.'],
    ['a3', 'Set a Family Link / device PIN the child does not know; turn on Find My Device and Factory Reset Protection.'],
    ['a4', 'Install the DNS filter (CleanBrowsing) as Private DNS and lock settings access with your management app.'],
    ['a5', 'STRONGEST: enroll the phone as a fully managed device (Android Enterprise, Samsung Knox Manage or a kiosk launcher). That can lock the phone to chosen apps, stop settings changes, and survive restarts.'],
    ['a5b', 'Web filter: in Family Link set Chrome to \u201cOnly allow approved sites\u201d (or block specific sites) and add the sites from the Websites tab; block or uninstall other browsers; turn off Private DNS bypass and VPN apps.'],
    ['a6', 'Test it: restart in normal and safe mode, then try Settings, uninstalling the controls, and a factory reset. Write down what still works.']
  ],
  pc: [
    ['p1', 'Give each child a STANDARD (non-administrator) account on the PC. Only parents keep the administrator password. Without admin rights they can\u2019t install other browsers, VPNs, or change DNS.'],
    ['p2', 'Windows: link the child\u2019s account to Microsoft Family Safety and turn on web filtering (allowed sites only, or blocked sites). Mac: use Screen Time → Content & Privacy → Web Content (Allowed Websites Only).'],
    ['p3', 'Chrome / Edge / Firefox: install only the browsers you want, or remove the rest. In Chrome use the Website Allow/Block policy (export below) and turn off "Use secure DNS" so the DNS filter can\u2019t be skipped.'],
    ['p4', 'Install the DNS filter profile (CleanBrowsing or NextDNS) on the PC as well as the router, so filtering follows the PC outside the house.'],
    ['p5', 'Block incognito/guest browsing, extensions installs, and proxy/VPN apps with the admin policy; turn off the guest account.'],
    ['p6', 'Set time limits and an app/game allowlist in Family Safety / Screen Time. Test: restart, try a blocked site in every browser, try incognito, try a VPN extension.']
  ],
  grandpa: [
    ['g1', 'iPhone (iOS 17+): turn on Assistive Access (Settings → Accessibility → Assistive Access). It shows only a few big-button apps you choose and hides Settings, so nothing can be changed by accident.'],
    ['g2', 'Set an Assistive Access passcode that only family knows (it is needed to exit).'],
    ['g3', 'Choose only the apps he needs (Phone, Messages, Camera, this app). Remove everything else from the home screen.'],
    ['g4', 'Turn on Find My iPhone, and share his location with the family through Find My (with his agreement or his guardian\u2019s).'],
    ['g5', 'Android alternative: use the Simple/Easy mode launcher or a kiosk launcher with a PIN-protected exit; turn on Find My Device.'],
    ['g6', 'Write the family contacts into his Phone favorites, and set up the same screen-time passcode on any old phone he might switch to.']
  ]
};
function SF_Hardening(props) {
  var h = React.createElement, fam = props.fam, pid = props.sel || (fam[0] || {}).id;
  var pS = React.useState('ios'), plat = pS[0], setPlat = pS[1];
  var dS = ktUse('safety/hardening/' + pid, {}), done = dS[0] || {};
  var steps = SF_STEPS[plat], n = steps.filter(function (x) { return done[x[0]]; }).length;
  return h('div', null,
    h('div', { style: Object.assign({}, SF_CARD, { borderColor: 'rgba(255,152,0,.5)' }) }, h('div', { style: { fontSize: 12, color: '#FFCC80', lineHeight: 1.6 } }, 'This app cannot lock a phone or act as a VPN — only the phone\u2019s own system can. These steps are what makes controls hard to switch off, even after a restart. No setting is 100% against a determined person, so test each one and keep Bark/monitoring on as a backstop. Get each person\u2019s agreement (or a guardian\u2019s) first.')),
    h('div', { style: { display: 'flex', gap: 5, overflowX: 'auto', marginBottom: 8 } }, fam.map(function (p) { return h('button', { key: p.id, onClick: function () { props.setSel(p.id); }, style: { flexShrink: 0, padding: '5px 10px', borderRadius: 20, border: 'none', background: pid === p.id ? p.color || '#81C784' : 'rgba(255,255,255,.1)', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' } }, p.emoji + ' ' + p.name); })),
    h('div', { style: { display: 'flex', gap: 5, marginBottom: 8 } }, [['ios', 'iPhone / iPad'], ['android', 'Android'], ['pc', 'Windows / Mac PC'], ['grandpa', 'Simple phone (Grandpa)']].map(function (k) { return h('button', { key: k[0], onClick: function () { setPlat(k[0]); }, style: { flex: 1, padding: '7px 4px', borderRadius: 20, border: '1px solid ' + (plat === k[0] ? '#81C784' : 'rgba(255,255,255,.2)'), background: plat === k[0] ? '#81C784' : 'transparent', color: plat === k[0] ? '#000' : '#ccc', fontWeight: 700, fontSize: 11, cursor: 'pointer' } }, k[1]); })),
    h('div', { style: { fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 6 } }, props.nameOf(pid) + ' — ' + n + ' of ' + steps.length + ' steps done'),
    steps.map(function (x) { return h('label', { key: x[0], style: Object.assign({}, SF_CARD, { display: 'flex', gap: 10, alignItems: 'flex-start', opacity: done[x[0]] ? 0.6 : 1 }) }, h('input', { type: 'checkbox', checked: !!done[x[0]], onChange: function (e) { sfWrite('safety/hardening/' + pid + '/' + x[0], e.target.checked ? Date.now() : null, 'Checklist step ' + x[0] + ' for ' + props.nameOf(pid)); }, style: { width: 22, height: 22, flexShrink: 0, marginTop: 2 } }), h('div', { style: { fontSize: 12, color: '#fff', lineHeight: 1.5 } }, x[1])); }),
    h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)', lineHeight: 1.5 } }, 'Menu names change between iOS/Android versions — check Apple\u2019s and Google\u2019s current help pages. VPN-style filtering comes from the management tool or DNS profile you install, not from this app.'));
}

// ── Websites: allowed / blocked lists per person, with requests, exports and undo ──
function sfDomain(u) { u = String(u || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('?')[0]; return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(u) ? u : ''; }
function SF_Sites(props) {
  var h = React.createElement, fam = props.fam, pid = props.sel || (fam[0] || {}).id;
  var cS = ktUse('safety/sites/' + pid, {}), cfg = cS[0] || {};
  var gS = ktUse('safety/sites/__all', {}), gcfg = pid === '__all' ? {} : (gS[0] || {});
  var rS = ktUse('safety/siterequests', {}), reqs = Object.values(rS[0] || {}).filter(function (r) { return r.status === 'pending'; });
  var nS = React.useState(''), nw = nS[0], setNw = nS[1];
  var mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  var pS2 = React.useState('always'), purpose = pS2[0], setPurpose = pS2[1];
  var purposeOf = function (d) { var e = ((cfg.allow || {})[key(d)]) || ((gcfg.allow || {})[key(d)]) || {}; return e.purpose || 'always'; };
  var mode = cfg.mode || gcfg.mode || 'allow';
  var own = function (c, k) { return Object.keys(c[k] || {}).map(function (x) { return c[k][x] || {}; }).filter(function (e) { return e.d && (!e.until || e.until > Date.now()); }).map(function (e) { return e.d; }); };
  var untilOf = function (list, d) { var e = ((cfg[list] || {})[key(d)]) || ((gcfg[list] || {})[key(d)]) || {}; return e.until || 0; };
  var untilTxt = function (list, d) { var u = untilOf(list, d); return u ? '  ⏳ until ' + new Date(u).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''; };
  var allowOwn = own(cfg, 'allow').sort(), blockOwn = own(cfg, 'block').sort();
  var allowInh = own(gcfg, 'allow').filter(function (d) { return allowOwn.indexOf(d) === -1; }).sort(), blockInh = own(gcfg, 'block').filter(function (d) { return blockOwn.indexOf(d) === -1; }).sort();
  var allow = allowOwn.concat(allowInh), block = blockOwn.concat(blockInh);
  var say = function (t) { setMsg(t); setTimeout(function () { setMsg(''); }, 3000); };
  var key = function (d) { return d.replace(/\./g, '_'); };
  function add(list, raw) { var d = sfDomain(raw); if (!d) { say('Type a site like example.com'); return false; } sfWrite('safety/sites/' + pid + '/' + list + '/' + key(d), { d: d, ts: Date.now(), purpose: list === 'allow' ? purpose : null }, (list === 'allow' ? 'Allowed ' : 'Blocked ') + d + ' for ' + props.nameOf(pid)); return true; }
  function rm(list, d) { sfWrite('safety/sites/' + pid + '/' + list + '/' + key(d), null, 'Removed ' + d + ' from ' + list + ' list for ' + props.nameOf(pid)); }
  function setMode(m) { sfWrite('safety/sites/' + pid + '/mode', m, props.nameOf(pid) + ': website mode ' + (m === 'allow' ? 'ALLOWED SITES ONLY' : 'BLOCK LIST')); }
  function decide(r, ok, mins) {
    var until = mins ? Date.now() + mins * 60000 : null, lbl = mins ? (mins >= 1440 ? Math.round(mins / 1440) + ' day' : mins >= 60 ? Math.round(mins / 60) + ' hour(s)' : mins + ' minutes') : 'until a parent changes it';
    syncSet('safety/siterequests/' + r.id + '/status', ok ? 'approved' : 'denied');
    sfWrite('safety/sites/' + r.personId + '/' + (ok ? 'allow' : 'block') + '/' + key(r.domain), { d: r.domain, ts: Date.now(), until: until }, (ok ? 'Allowed ' : 'Blocked ') + r.domain + ' for ' + props.nameOf(r.personId) + ' (' + lbl + ')');
    var nid = 'sr_' + r.id; syncSet('notifs/' + nid, { id: nid, type: 'safety', personId: r.personId, title: ok ? '✅ ' + r.domain + ' approved (' + lbl + ')' : '🚫 ' + r.domain + ' blocked (' + lbl + ')', message: ok ? 'A parent allowed this site.' : 'A parent said no to this site.', timestamp: Date.now(), read: false, approved: null, requiresApproval: false });
  }
  var DUR = [[10, '10 min'], [60, '1 hr'], [240, '4 hr'], [1440, '24 hr'], [0, 'Always']];
  var list = mode === 'allow' ? allow : block;
  function copy(t) { try { navigator.clipboard.writeText(t); say('Copied.'); } catch (e) { say('Press and hold to copy.'); } }
  var chrome = JSON.stringify(mode === 'allow' ? { URLBlocklist: ['*'], URLAllowlist: allow } : { URLBlocklist: block }, null, 2);
  var hosts = block.map(function (d) { return '0.0.0.0 ' + d; }).join('\n');
  return h('div', null,
    msg && h('div', { style: { background: 'rgba(76,175,130,.15)', color: '#9be5bd', borderRadius: 8, padding: '6px 10px', fontSize: 12, marginBottom: 8 } }, msg),
    reqs.length > 0 && h('div', { style: Object.assign({}, SF_CARD, { borderColor: '#FF9800' }) }, h('div', { style: { fontSize: 12, fontWeight: 800, color: '#FFB74D', marginBottom: 6 } }, '🌐 Website requests (' + reqs.length + ')'),
      reqs.map(function (r) { return h('div', { key: r.id, style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
        h('div', { style: { fontSize: 12, color: '#fff', marginBottom: 5 } }, props.nameOf(r.personId) + ' wants ', h('b', null, r.domain), r.why ? ' — ' + r.why : ''),
        h('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 } }, h('span', { style: { fontSize: 10, color: '#81C784', width: 44 } }, 'ALLOW'), DUR.map(function (d) { return sfBtn('#81C784', '#000', function () { decide(r, true, d[0]); }, d[1], true); })),
        h('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' } }, h('span', { style: { fontSize: 10, color: '#EF9A9A', width: 44 } }, 'BLOCK'), [[60, '1 hr'], [1440, '24 hr'], [0, 'Always']].map(function (d) { return sfBtn('rgba(239,83,80,.3)', '#EF9A9A', function () { decide(r, false, d[0]); }, d[1], true); }))); })),
    sfChips(fam, pid, props.setSel, false, true),
    h('div', { style: { display: 'flex', gap: 6, marginBottom: 8 } }, [['allow', '✅ Allowed sites ONLY'], ['block', '🚫 Block list']].map(function (m) { return h('button', { key: m[0], onClick: function () { setMode(m[0]); }, style: { flex: 1, padding: 9, borderRadius: 20, border: '1px solid ' + (mode === m[0] ? '#81C784' : 'rgba(255,255,255,.2)'), background: mode === m[0] ? '#81C784' : 'transparent', color: mode === m[0] ? '#000' : '#ccc', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, m[1]); })),
    h('div', { style: SF_CARD },
      h('div', { style: { fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 6 } }, (pid === '__all' ? 'Everyone' : props.nameOf(pid)) + (mode === 'allow' ? ' may only open these sites' : ' may NOT open these sites')),
      list.length === 0 && h('div', { style: { fontSize: 11, color: '#999', marginBottom: 6 } }, 'Nothing on the list yet.'),
      list.map(function (d) { var inh = (mode === 'allow' ? allowInh : blockInh).indexOf(d) !== -1; return h('div', { key: d, style: { display: 'flex', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,.06)' } }, h('div', { style: { flex: 1, fontSize: 13, color: '#fff' } }, d, h('span', { style: { fontSize: 9, color: '#90CAF9' } }, untilTxt(mode, d)), mode === 'allow' && purposeOf(d) === 'school' && h('span', { style: { fontSize: 9, color: '#CE93D8' } }, '  📚 school only'), inh && h('span', { style: { fontSize: 9, color: '#FFB74D' } }, '  👪 from Everyone')), !inh && h('button', { onClick: function () { rm(mode, d); }, style: { background: 'transparent', border: 'none', color: 'rgba(239,83,80,.6)', fontSize: 16, cursor: 'pointer' } }, '×')); }),
      mode === 'allow' && h('div', { style: { display: 'flex', gap: 6, marginTop: 8 } }, [['always', '✅ Always allowed'], ['school', '📚 School use only']].map(function (m) { var on = purpose === m[0]; return h('button', { key: m[0], onClick: function () { setPurpose(m[0]); }, style: { flex: 1, padding: 7, borderRadius: 20, border: '1px solid ' + (on ? '#CE93D8' : 'rgba(255,255,255,.2)'), background: on ? '#CE93D8' : 'transparent', color: on ? '#000' : '#ccc', fontSize: 11, fontWeight: 800, cursor: 'pointer' } }, m[1]); })),
      h('div', { style: { display: 'flex', gap: 6, marginTop: 8 } }, h('input', { type: 'text', placeholder: 'example.com', value: nw, onChange: function (e) { setNw(e.target.value); }, style: Object.assign({}, SF_INP, { marginBottom: 0 }) }), sfBtn('#81C784', '#000', function () { if (add(mode, nw)) setNw(''); }, 'Add'))),
    h('div', { style: SF_CARD },
      h('div', { style: { fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 6 } }, 'Use this list on the real devices'),
      h('div', { style: { fontSize: 11, color: '#ccc', lineHeight: 1.6, marginBottom: 8 } }, 'This app stores the list and handles requests, but blocking happens in your DNS filter, router, and each device\u2019s own controls. Copy the list into each one, then keep them matching:'),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, sfBtn('#42A5F5', '#000', function () { copy(list.join('\n')); }, '📋 Domain list', true), mode === 'allow' && sfBtn('#CE93D8', '#000', function () { copy(list.filter(function (d) { return purposeOf(d) === 'school'; }).join('\n')); }, '📋 School-only list', true), mode === 'allow' && sfBtn('#81C784', '#000', function () { copy(list.filter(function (d) { return purposeOf(d) !== 'school'; }).join('\n')); }, '📋 Always-allowed list', true), sfBtn('rgba(255,255,255,.15)', '#fff', function () { copy(chrome); }, '📋 Chrome/Edge policy (JSON)', true), mode === 'block' && sfBtn('rgba(255,255,255,.15)', '#fff', function () { copy(hosts); }, '📋 Hosts-file format', true), sfBtn('rgba(255,255,255,.15)', '#fff', function () { bhDownload && bhDownload('sites-' + pid + '.csv', 'mode,domain\n' + list.map(function (d) { return mode + ',' + d; }).join('\n')); }, '⬇ CSV', true)),
      h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', marginTop: 8, lineHeight: 1.6 } }, '• DNS filter (CleanBrowsing / NextDNS / Deco): paste into its allow or block list for that person\u2019s profile.\n• iPhone/iPad/Mac: Screen Time → Web Content. Android: Family Link → Chrome. Windows: Family Safety → Web filtering. Chrome/Edge: use the JSON policy.\n• Allowed-sites-only is much harder to get around than a block list. Pair it with the Lock-down steps (no admin rights, no VPN or other browsers, DNS over HTTPS off) so the filter can\u2019t be skipped.')));
}

function SF_AskSite(props) {
  var h = React.createElement, vS = React.useState(''), v = vS[0], setV = vS[1], wS = React.useState(''), why = wS[0], setWhy = wS[1], mS = React.useState(''), m = mS[0], setM = mS[1];
  function send() { var d = sfDomain(v); if (!d) { setM('Type a site like example.com'); return; } if (sfWordBlocked(d.replace(/\./g, ' '), props.pid) || sfSiteBlockedNow(d, props.pid)) { setM('That one is not allowed right now.'); return; } var id = sfUid('sr'); syncSet('safety/siterequests/' + id, { id: id, personId: props.pid, domain: d, why: why, ts: Date.now(), status: 'pending' }); var nid = 'srn_' + id; syncSet('notifs/' + nid, { id: nid, type: 'safety', personId: props.pid, title: '🌐 ' + (props.name || props.pid) + ' asked for ' + d, message: why || 'Open Safety → Websites to answer.', timestamp: Date.now(), read: false, approved: null, requiresApproval: false }); setV(''); setWhy(''); setM('Sent! A parent will answer.'); setTimeout(function () { setM(''); }, 4000); }
  return h('div', { style: { background: 'rgba(0,0,0,.2)', borderRadius: 10, padding: 8, marginBottom: 8 } },
    h('div', { style: { fontSize: 11, color: '#ddd', marginBottom: 4 } }, '🌐 Need a website for school? Ask a parent:'),
    h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'text', placeholder: 'example.com', value: v, onChange: function (e) { setV(e.target.value); }, style: Object.assign({}, SF_INP, { marginBottom: 0 }) }), sfBtn('#81C784', '#000', send, 'Ask', true)),
    h('input', { type: 'text', placeholder: 'What is it for?', value: why, onChange: function (e) { setWhy(e.target.value); }, style: Object.assign({}, SF_INP, { marginTop: 6, marginBottom: 0 }) }),
    m && h('div', { style: { fontSize: 11, color: '#9be5bd', marginTop: 4 } }, m));
}

// ── Words: search terms people may / may not look up ──
function SF_Words(props) {
  var h = React.createElement, fam = props.fam, pid = props.sel || '__all';
  var cS = ktUse('safety/words/' + pid, {}), cfg = cS[0] || {};
  var gS = ktUse('safety/words/__all', {}), g = pid === '__all' ? {} : (gS[0] || {});
  var nS = React.useState(''), nw = nS[0], setNw = nS[1];
  var mode = cfg.mode || g.mode || 'block';
  var own = Object.values(cfg.list || {}).map(function (x) { return x && x.w; }).filter(Boolean).sort();
  var inh = Object.values(g.list || {}).map(function (x) { return x && x.w; }).filter(function (w) { return w && own.indexOf(w) === -1; }).sort();
  var key = function (w) { return w.replace(/[^a-z0-9]+/g, '_'); };
  var clean = function (w) { return String(w || '').trim().toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); };
  function add() { var w = clean(nw); if (!w) return; sfWrite('safety/words/' + pid + '/list/' + key(w), { w: w, ts: Date.now() }, (mode === 'allow' ? 'Allowed word "' : 'Blocked word "') + w + '" for ' + props.nameOf(pid)); setNw(''); }
  function rm(w) { sfWrite('safety/words/' + pid + '/list/' + key(w), null, 'Removed word "' + w + '" for ' + props.nameOf(pid)); }
  function setMode(m) { sfWrite('safety/words/' + pid + '/mode', m, props.nameOf(pid) + ': words ' + (m === 'allow' ? 'ALLOWED LIST ONLY' : 'BLOCK LIST')); }
  function copy(t) { try { navigator.clipboard.writeText(t); } catch (e) {} }
  var all = own.concat(inh);
  return h('div', null,
    sfChips(fam, pid, props.setSel, false, true),
    h('div', { style: { display: 'flex', gap: 6, marginBottom: 8 } }, [['block', '🚫 Blocked words'], ['allow', '✅ Allowed words only']].map(function (m) { return h('button', { key: m[0], onClick: function () { setMode(m[0]); }, style: { flex: 1, padding: 9, borderRadius: 20, border: '1px solid ' + (mode === m[0] ? '#81C784' : 'rgba(255,255,255,.2)'), background: mode === m[0] ? '#81C784' : 'transparent', color: mode === m[0] ? '#000' : '#ccc', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, m[1]); })),
    h('div', { style: SF_CARD },
      h('div', { style: { fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 6 } }, (pid === '__all' ? 'Everyone' : props.nameOf(pid)) + (mode === 'allow' ? ' may only search for things containing these words' : ' may NOT search for these words')),
      all.length === 0 && h('div', { style: { fontSize: 11, color: '#999', marginBottom: 6 } }, 'Nothing on the list yet.'),
      all.map(function (w) { var ih = inh.indexOf(w) !== -1; return h('div', { key: w, style: { display: 'flex', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,.06)' } }, h('div', { style: { flex: 1, fontSize: 13, color: '#fff' } }, w, ih && h('span', { style: { fontSize: 9, color: '#FFB74D' } }, '  👪 from Everyone')), !ih && h('button', { onClick: function () { rm(w); }, style: { background: 'transparent', border: 'none', color: 'rgba(239,83,80,.6)', fontSize: 16, cursor: 'pointer' } }, '×')); }),
      h('div', { style: { display: 'flex', gap: 6, marginTop: 8 } }, h('input', { type: 'text', placeholder: 'a word or short phrase', value: nw, onChange: function (e) { setNw(e.target.value); }, style: Object.assign({}, SF_INP, { marginBottom: 0 }) }), sfBtn('#81C784', '#000', add, 'Add', true)),
      h('div', { style: { marginTop: 8 } }, sfBtn('#42A5F5', '#000', function () { copy(all.join('\n')); }, '📋 Copy list', true))),
    h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', lineHeight: 1.6 } }, 'Inside this app, any search box that checks the list (food and recipe searches, website requests) will refuse these. Google, YouTube and other apps are not checked by this app. For those, turn on SafeSearch lock and a DNS filter, put the same words into Bark\u2019s keyword alerts, and use Family Link / Screen Time content limits. Word matching is simple and can miss misspellings and slang.'));
}

// ── My Accounts: big one-tap buttons to each person's own sites. NO passwords are stored here. ──
function MyAccounts(props) {
  var h = React.createElement, pid = props.personId, fam = (props.family || []).filter(function (p) { return !p.deleted; });
  var sS = React.useState(pid), sel = sS[0], setSel = sS[1];
  var aS = ktUse('accounts/' + sel, {}), list = Object.values(aS[0] || {}).sort(function (a, b) { return (a.ts || 0) - (b.ts || 0); });
  var fS = React.useState({ emoji: '🔗' }), f = fS[0], setF = fS[1];
  var big = !props.isAdmin || sel === pid && (fam.find(function (p) { return p.id === pid; }) || {}).role === 'elder';
  function add() { var u = String(f.url || '').trim(); if (!f.name || !u) return; if (!/^https?:\/\//i.test(u)) u = 'https://' + u; var id = sfUid('ac'); syncSet('accounts/' + sel + '/' + id, { id: id, name: f.name, url: u, emoji: f.emoji || '🔗', note: f.note || '', ts: Date.now() }); setF({ emoji: '🔗' }); }
  return h('div', { style: { padding: 14, paddingBottom: 60 } },
    h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 8 } }, '🔗 My Accounts'),
    props.isAdmin && h('div', null,
      h('div', { style: Object.assign({}, SF_CARD, { borderColor: 'rgba(255,152,0,.5)' }) }, h('div', { style: { fontSize: 11, color: '#FFCC80', lineHeight: 1.6 } }, 'This app does NOT store or capture passwords — a web page can\u2019t see what is typed on other sites, and keeping passwords in a family-synced database would put every account at risk. These buttons open each site. Let a password manager do the log-in: Apple Passwords / iCloud Keychain, Google Password Manager, Bitwarden or 1Password (their family plans can share a vault, including emergency access for you). On Grandpa\u2019s phone, turn on AutoFill so the site fills itself in after he taps the button and Face ID/Touch ID.')),
      sfChips(fam, sel, setSel, false, false)),
    list.length === 0 && h('div', { style: { color: '#999', fontSize: 13, padding: 10 } }, props.isAdmin ? 'No buttons yet for this person.' : 'Nothing here yet. Ask a parent to add your sites.'),
    list.map(function (a) { return h('div', { key: a.id, style: { display: 'flex', gap: 8, marginBottom: 10 } },
      h('a', { href: a.url, target: '_blank', rel: 'noopener', style: { flex: 1, display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', background: 'rgba(66,165,245,.15)', border: '2px solid rgba(66,165,245,.5)', borderRadius: 18, padding: big ? '22px 18px' : '14px 14px', color: '#fff' } }, h('span', { style: { fontSize: big ? 38 : 26 } }, a.emoji), h('span', null, h('div', { style: { fontSize: big ? 22 : 16, fontWeight: 900 } }, a.name), a.note && h('div', { style: { fontSize: big ? 14 : 11, color: '#aaa', marginTop: 2 } }, a.note))),
      props.isAdmin && h('button', { onClick: function () { syncSet('accounts/' + sel + '/' + a.id, null); }, style: { background: 'transparent', border: 'none', color: 'rgba(239,83,80,.6)', fontSize: 18, cursor: 'pointer' } }, '×')); }),
    props.isAdmin && h('div', { style: SF_CARD },
      h('div', { style: { fontSize: 12, fontWeight: 800, color: '#C0CA33', marginBottom: 6 } }, '➕ Add a button for ' + ((fam.find(function (p) { return p.id === sel; }) || {}).name || '')),
      h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'text', value: f.emoji, maxLength: 2, onChange: function (e) { setF(Object.assign({}, f, { emoji: e.target.value })); }, style: Object.assign({}, SF_INP, { width: 56, textAlign: 'center' }) }), h('input', { type: 'text', placeholder: 'Name (Bank, Medicare, Pharmacy…)', value: f.name || '', onChange: function (e) { setF(Object.assign({}, f, { name: e.target.value })); }, style: SF_INP })),
      h('input', { type: 'text', placeholder: 'Website address', value: f.url || '', onChange: function (e) { setF(Object.assign({}, f, { url: e.target.value })); }, style: SF_INP }),
      h('input', { type: 'text', placeholder: 'Note shown on the button (e.g. "Tap, then Face ID")', value: f.note || '', onChange: function (e) { setF(Object.assign({}, f, { note: e.target.value })); }, style: SF_INP }),
      sfBtn('#C0CA33', '#000', add, 'Add button')));
}

// ── Terms & Conditions: shown once after sign-in; "I Agree" opens the app ──
var SF_TERMS_DEFAULT = "Welcome to MyBethelFamilyHome.\n\n• This app is for our family. Use it kindly and honestly.\n• The app is managed by your family\u2019s administrators (parents). They decide which features, schedules, and permissions each person has, and they can change them at any time.\n• Your passcode is yours — don\u2019t share it. Your administrators can see it and can help you if you forget it.\n• What you enter in the app (tasks, time, logs, journal entries you choose to share, requests) is saved to the family\u2019s private database and can be seen by the administrators.\n• Don\u2019t try to get around the app\u2019s settings or other people\u2019s accounts.\n• If something looks wrong or you need help, tell an administrator.\n• These terms may be updated. When they change, you\u2019ll be asked to agree again.";
function TermsOverlay() {
  var h = React.createElement, t = React.useState(0), setTick = t[1], rd = React.useState(false), ready = rd[0], setReady = rd[1];
  React.useEffect(function () { var iv = setInterval(function () { setTick(function (x) { return x + 1; }); }, 1500), t0 = setTimeout(function () { setReady(true); }, 1800); return function () { clearInterval(iv); clearTimeout(t0); }; }, []);
  var pid = ''; try { pid = (JSON.parse(localStorage.getItem('last_user') || 'null') || {}).personId || ''; } catch (e) {}
  var cfgS = ktUse('terms/config', null), cfg = cfgS[0] || {};
  var agS = ktUse('terms/agreed/' + (pid || '_none'), null), ag = agS[0];
  var ver = cfg.version || 1, text = cfg.text || SF_TERMS_DEFAULT, lk = 'fm_terms_' + pid + '_v' + ver;
  var okLocal = false; try { okLocal = !!localStorage.getItem(lk); } catch (e) {}
  var exempt = !pid || pid === 'laurel' || pid === 'eric';
  var okRemote = !!(ag && (ag.ver || 1) >= ver);
  React.useEffect(function () { if (okRemote && !okLocal) { try { localStorage.setItem(lk, '1'); } catch (e) {} } }, [okRemote, okLocal, lk]);
  if (exempt || okLocal || okRemote || !ready) return null;
  function agree() { try { localStorage.setItem(lk, '1'); } catch (e) {} try { syncSet('terms/agreed/' + pid, { ts: Date.now(), ver: ver, device: sfDeviceId() }); } catch (e) {} setTick(function (x) { return x + 1; }); }
  function leave() { try { localStorage.removeItem('last_user'); } catch (e) {} location.reload(); }
  return h('div', { style: { position: 'fixed', inset: 0, zIndex: 99990, background: 'linear-gradient(160deg,#0f0c29,#1a1a2e)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 18px', overflowY: 'auto' } },
    h('div', { style: { fontSize: 40, marginTop: 10 } }, '📜'),
    h('div', { style: { fontSize: 20, fontWeight: 900, color: '#fff', margin: '6px 0 12px' } }, 'Terms & Conditions'),
    h('div', { style: { width: '100%', maxWidth: 420, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 16, color: '#e8e8f0', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 16 } }, text),
    h('button', { onClick: agree, style: { width: '100%', maxWidth: 420, background: '#4CAF82', color: '#000', border: 'none', borderRadius: 30, padding: 16, fontWeight: 900, fontSize: 18, cursor: 'pointer' } }, 'I Agree'),
    h('button', { onClick: leave, style: { marginTop: 14, background: 'transparent', border: 'none', color: 'rgba(255,255,255,.4)', fontSize: 12, cursor: 'pointer' } }, 'Go back'));
}
function SF_Terms(props) {
  var h = React.createElement, fam = props.fam.filter(function (p) { return p.id !== 'laurel' && p.id !== 'eric'; });
  var cfgS = ktUse('terms/config', null), cfg = cfgS[0] || {};
  var aS = ktUse('terms/agreed', {}), agreed = aS[0] || {};
  var tS = React.useState(null), draft = tS[0], setDraft = tS[1];
  var text = draft != null ? draft : (cfg.text || SF_TERMS_DEFAULT), ver = cfg.version || 1;
  function save(bump) { sfWrite('terms/config', { text: text, version: bump ? ver + 1 : ver }, bump ? 'Terms updated — everyone must agree again' : 'Terms text saved'); setDraft(null); }
  return h('div', null,
    h('div', { style: SF_CARD }, h('div', { style: { fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 6 } }, 'Terms shown at first sign-in (version ' + ver + ')'),
      h('textarea', { value: text, onChange: function (e) { setDraft(e.target.value); }, rows: 12, style: Object.assign({}, SF_INP, { fontSize: 12, lineHeight: 1.5 }) }),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, sfBtn('#81C784', '#000', function () { save(false); }, 'Save text', true), sfBtn('#FFB74D', '#000', function () { if (window._safeConfirm('Everyone will be asked to agree again. Continue?')) save(true); }, 'Save & ask everyone to agree again', true), sfBtn('rgba(255,255,255,.15)', '#fff', function () { setDraft(SF_TERMS_DEFAULT); }, 'Restore default', true)),
      h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 6, lineHeight: 1.5 } }, 'The screen says they agree to the app\u2019s terms. Keep it truthful: it mentions that administrators manage features and permissions. Location sharing has its own separate opt-in on the Safety card.')),
    fam.map(function (p) { var a = agreed[p.id]; var cur = a && (a.ver || 1) >= ver; return h('div', { key: p.id, style: Object.assign({}, SF_CARD, { display: 'flex', alignItems: 'center', gap: 8 }) }, h('div', { style: { fontSize: 20 } }, p.emoji), h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, p.name), h('div', { style: { fontSize: 10, color: cur ? '#81C784' : '#FFB74D' } }, cur ? 'Agreed ' + new Date(a.ts).toLocaleDateString() : (a ? 'Agreed an older version' : 'Has not agreed yet'))),
      !cur && sfBtn('rgba(255,255,255,.15)', '#fff', function () { if (window._safeConfirm('Record agreement')) sfWrite('terms/agreed/' + p.id, { ts: Date.now(), ver: ver, device: 'guardian:' + (window._currentPersonId || '') }, 'Recorded agreement for ' + p.name); }, 'Record for them', true),
      cur && sfBtn('transparent', '#EF9A9A', function () { sfWrite('terms/agreed/' + p.id, null, 'Reset agreement for ' + p.name); }, 'Ask again', true)); }));
}
