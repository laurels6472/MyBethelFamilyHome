// ═══ ACCESS: Family Code join, locked parent sign-in (Admin Key), live presence ═══
var FM_PARENTS = ['laurel', 'eric'];
function fmIsTrusted() { try { return localStorage.getItem('fm_trusted_device') === '1'; } catch (e) { return false; } }
function fmTrust() { try { localStorage.setItem('fm_trusted_device', '1'); } catch (e) {} }
function fmSha(str) {
  var s = 'mbfh|' + str;
  try {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); });
    }
  } catch (e) {}
  var h1 = 5381, h2 = 52711; for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); h1 = (h1 * 33) ^ c; h2 = (h2 * 33) ^ c; }
  return Promise.resolve('x' + (h1 >>> 0).toString(16) + (h2 >>> 0).toString(16));
}
function fmRemoteKeyHash() {
  return new Promise(function (res) {
    var local = null; try { local = localStorage.getItem('fm_adminkey'); } catch (e) {}
    if (typeof db === 'undefined' || !db) return res(local);
    var done = false, to = setTimeout(function () { if (!done) { done = true; res(local); } }, 4500);
    try { db.ref('argilan/security/adminKey').once('value').then(function (s) { if (done) return; done = true; clearTimeout(to); var v = s.val(); if (v && v.h) { try { localStorage.setItem('fm_adminkey', v.h); } catch (e) {} res(v.h); } else res(null); }).catch(function () { if (!done) { done = true; clearTimeout(to); res(local); } }); } catch (e) { res(local); }
  });
}
window.fmCheckAdminKey = function (k) { return Promise.all([fmSha(String(k)), fmRemoteKeyHash()]).then(function (r) { return !!r[1] && r[0] === r[1]; }); };
function fmStoreKey(k) {
  return fmSha(k).then(function (h) {
    try { localStorage.setItem('fm_adminkey', h); } catch (e) {}
    if (typeof db !== 'undefined' && db) { try { db.ref('argilan/security/adminKey').set({ h: h, ts: Date.now() }); } catch (e) {} FM_PARENTS.forEach(function (p) { try { db.ref('argilan/pins/' + p).remove(); } catch (e) {} }); }
    return h;
  });
}
function fmFamilyCode() {
  try { var c = localStorage.getItem('fb_cfg'); if (!c) return ''; return 'MBFH-' + btoa(unescape(encodeURIComponent(c))); } catch (e) { return ''; }
}
function fmParseJoin(txt) {
  txt = String(txt || '').trim();
  var m = txt.match(/MBFH-([A-Za-z0-9+\/=]+)/);
  if (m) return { cfg: JSON.parse(decodeURIComponent(escape(atob(m[1])))), setup: false };
  m = txt.match(/[#&]fb=([^&\s]+)/);
  if (m) return { cfg: JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1]))))), setup: false };
  var a = txt.indexOf('{'), b = txt.lastIndexOf('}');
  if (a < 0 || b < a) throw new Error('That does not look like a Family Code. It starts with MBFH-');
  var o = txt.slice(a, b + 1).replace(/\/\/.*$/gm, '').replace(/([{,]\s*)([A-Za-z_]\w*)\s*:/g, '$1"$2":').replace(/'([^']*)'/g, '"$1"').replace(/,\s*}/g, '}');
  var cfg = JSON.parse(o);
  if (!cfg.apiKey || !cfg.projectId) throw new Error('Missing apiKey or projectId.');
  if (!cfg.databaseURL) cfg.databaseURL = 'https://' + cfg.projectId + '-default-rtdb.firebaseio.com';
  return { cfg: cfg, setup: true };
}
function fmNeedsJoin() { return (typeof db === 'undefined' || !db); }

var FM_PAGE = { minHeight: '100vh', background: 'linear-gradient(160deg,#0f0c29,#1a1a2e,#16213e)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, color: '#fff', boxSizing: 'border-box' };
var FM_IN = { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 12, color: '#fff', padding: 14, fontSize: 16, marginBottom: 10, fontFamily: 'inherit' };
function fmBigBtn(bg, fg, fn, t, dis) { return React.createElement('button', { onClick: fn, disabled: !!dis, style: { width: '100%', background: dis ? '#555' : bg, color: fg, border: 'none', borderRadius: 30, padding: 16, fontWeight: 900, fontSize: 17, cursor: dis ? 'default' : 'pointer', marginBottom: 10 } }, t); }

// ── First screen on a device that is not connected yet ──
function JoinGate(props) {
  var h = React.createElement, a = React.useState(''), txt = a[0], setTxt = a[1], b = React.useState(''), msg = b[0], setMsg = b[1], c = React.useState(false), agree = c[0], setAgree = c[1], sp = React.useState(false), setup = sp[0], setSetup = sp[1];
  function join() {
    try {
      var r = fmParseJoin(txt);
      if (!initFirebase(r.cfg)) throw new Error('Could not start sync with that code.');
      if (r.setup) { try { localStorage.setItem('fm_setup_device', '1'); } catch (e) {} }
      setMsg('Connected! Loading your family…'); setTimeout(function () { location.reload(); }, 800);
    } catch (e) { setMsg('❌ ' + (e.message || 'That code did not work.')); }
  }
  return h('div', { style: FM_PAGE }, h('div', { style: { maxWidth: 380, width: '100%', textAlign: 'center' } },
    h('div', { style: { fontSize: 54 } }, '🏠'),
    h('div', { style: { fontSize: 22, fontWeight: 900, margin: '6px 0' } }, 'Welcome to MyBethelFamilyHome'),
    h('div', { style: { fontSize: 11, color: '#888', marginBottom: 8 } }, 'Build ' + (typeof FM_BUILD !== 'undefined' ? FM_BUILD : 'old') + (typeof _fmFbErr !== 'undefined' && _fmFbErr ? ' · Sync error: ' + _fmFbErr : '') + (typeof firebase === 'undefined' ? ' · library: NOT loaded' : ' · library: loaded')),
    (typeof firebase === 'undefined') && h('div', { style: { background: 'rgba(239,83,80,.2)', border: '2px solid #EF5350', borderRadius: 14, padding: 12, fontSize: 14, color: '#FFAB91', lineHeight: 1.6, marginBottom: 14, textAlign: 'left' } }, '\u26A0\uFE0F The sync library could not load on this device, so it cannot connect. Open the app from your hosted web address in Safari or Chrome (not inside a preview, a chat app or a file viewer), make sure the internet is on, and turn off any ad blocker or content blocker for this site. Then reload.'),
    h('button', { onClick: function () { setSetup(!setup); }, style: { width: '100%', background: '#7E57C2', color: '#fff', border: 'none', borderRadius: 30, padding: 18, fontWeight: 900, fontSize: 18, cursor: 'pointer', marginBottom: 6 } }, setup ? '\u25BE Hide the setup steps' : '\uD83D\uDC51 I\u2019m Laurel or Eric \u2014 set up family sync'),
    setup && h('div', { style: { textAlign: 'left', marginBottom: 14 } }, h(FirebaseGuide, null)),
    h('div', { style: { fontSize: 12, color: '#aaa', marginBottom: 22 } }, 'Family sync is required so notifications, PINs and approvals reach everyone. You only set it up once.'),
    h('div', { style: { fontSize: 13, color: '#888', marginBottom: 14 } }, '— or, for the children and others —'),
    h('div', { style: { fontSize: 14, color: '#c8c8d8', lineHeight: 1.6, marginBottom: 12 } }, 'Enter the Family Code Laurel sent you so this device joins the family. It starts with MBFH-'),
    h('textarea', { rows: 4, value: txt, onChange: function (e) { setTxt(e.target.value); }, placeholder: 'Paste Family Code here', style: FM_IN }),
    h('label', { style: { display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left', fontSize: 13, color: '#ddd', marginBottom: 12 } }, h('input', { type: 'checkbox', checked: agree, onChange: function (e) { setAgree(e.target.checked); }, style: { width: 22, height: 22, flexShrink: 0 } }), 'I accept the family Terms & Conditions and I want this device to join our family sync.'),
    fmBigBtn('#4CAF82', '#000', join, '✅ Accept & Join Family', !agree || !txt.trim()),
    msg && h('div', { style: { fontSize: 13, color: '#FFB74D', marginBottom: 10 } }, msg),
    h('div', { style: { fontSize: 11, color: '#777', lineHeight: 1.6, marginTop: 6 } }, 'Only the Family Code works in the box above.')));
}

// ── Parent accounts: Admin Key on a new device, then just the PIN ──
function ParentGate(props) {
  var h = React.createElement, person = props.person;
  var s1 = React.useState('loading'), mode = s1[0], setMode = s1[1], s2 = React.useState(''), k = s2[0], setK = s2[1], s3 = React.useState(''), k2 = s3[0], setK2 = s3[1], s4 = React.useState(''), msg = s4[0], setMsg = s4[1], s5 = React.useState('');
  var pin = s5[0], setPin2 = s5[1];
  var localPin = ''; try { localPin = (JSON.parse(localStorage.getItem('argilan_pins') || '{}')[person.id]) || ''; } catch (e) {}
  React.useEffect(function () {
    fmRemoteKeyHash().then(function (hh) {
      if (hh) return setMode('enter');
      var setupOk = false; try { setupOk = localStorage.getItem('fm_setup_device') === '1'; } catch (e) {}
      if (localPin) setMode('migrate'); else if (setupOk) setMode('create'); else setMode('blocked');
    });
  }, []);
  function lockedNow() { try { var u = +localStorage.getItem('fm_gate_lock') || 0; return u > Date.now() ? Math.ceil((u - Date.now()) / 60000) : 0; } catch (e) { return 0; } }
  function fail() { try { var n = (+localStorage.getItem('fm_gate_fail') || 0) + 1; localStorage.setItem('fm_gate_fail', String(n)); if (n >= 5) { localStorage.setItem('fm_gate_lock', String(Date.now() + 5 * 60000)); localStorage.setItem('fm_gate_fail', '0'); } } catch (e) {} }
  function enter() {
    var l = lockedNow(); if (l) return setMsg('Too many tries. Wait ' + l + ' minute(s).');
    window.fmCheckAdminKey(k).then(function (ok) { if (ok) { try { localStorage.setItem('fm_gate_fail', '0'); } catch (e) {} fmTrust(); props.onPass(); } else { fail(); setK(''); setMsg('That is not the Admin Key.'); } });
  }
  function checkMigrate() { if (String(pin) === String(localPin)) { setMode('create'); setMsg(''); } else setMsg('That is not your current PIN.'); }
  function create() {
    if (k.length < 8) return setMsg('Use at least 8 characters.');
    if (k !== k2) return setMsg('The two keys do not match.');
    fmStoreKey(k).then(function () { fmTrust(); props.onPass(); });
  }
  var title = { loading: 'Checking…', enter: 'Parent sign-in', migrate: 'Protect the parent accounts', create: 'Create your Admin Key', blocked: 'Parent sign-in is locked' }[mode];
  return h('div', { style: FM_PAGE }, h('div', { style: { maxWidth: 360, width: '100%', textAlign: 'center' } },
    h('div', { style: { width: 72, height: 72, borderRadius: '50%', background: person.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, margin: '0 auto 10px' } }, person.emoji),
    h('div', { style: { fontSize: 20, fontWeight: 900 } }, person.name), h('div', { style: { fontSize: 15, color: '#c8c8d8', margin: '4px 0 16px' } }, title),
    mode === 'enter' && h('div', null, h('div', { style: { fontSize: 13, color: '#bbb', marginBottom: 10, lineHeight: 1.6 } }, 'This is a new device. Enter the Admin Key one time. After that this device only needs your PIN.'), h('input', { type: 'password', value: k, onChange: function (e) { setK(e.target.value); }, placeholder: 'Admin Key', style: FM_IN }), fmBigBtn('#7E57C2', '#fff', enter, 'Unlock this device', !k)),
    mode === 'migrate' && h('div', null, h('div', { style: { fontSize: 13, color: '#bbb', marginBottom: 10, lineHeight: 1.6 } }, 'To stop anyone else from signing in as a parent, you will make a private Admin Key. First enter your current PIN.'), h('input', { type: 'password', inputMode: 'numeric', maxLength: 4, value: pin, onChange: function (e) { setPin2(e.target.value.replace(/[^0-9]/g, '')); }, placeholder: 'Current PIN', style: FM_IN }), fmBigBtn('#7E57C2', '#fff', checkMigrate, 'Continue', pin.length < 4)),
    mode === 'create' && h('div', null, h('div', { style: { fontSize: 13, color: '#bbb', marginBottom: 10, lineHeight: 1.6 } }, 'Make a private phrase only parents know (8+ characters). New devices need it once before a parent PIN works. Never share it with the children.'), h('input', { type: 'password', value: k, onChange: function (e) { setK(e.target.value); }, placeholder: 'Admin Key', style: FM_IN }), h('input', { type: 'password', value: k2, onChange: function (e) { setK2(e.target.value); }, placeholder: 'Type it again', style: FM_IN }), fmBigBtn('#4CAF82', '#000', create, 'Save Admin Key', !k || !k2)),
    mode === 'blocked' && h('div', { style: { fontSize: 14, color: '#FFB74D', lineHeight: 1.6, marginBottom: 14 } }, 'The Admin Key has not been created yet. Laurel needs to finish owner setup on her own device first (Admin → Sync Setup).'),
    (mode === 'blocked' && person.id === 'laurel') && fmBigBtn('#7E57C2', '#fff', function () { try { localStorage.setItem('fm_setup_device', '1'); } catch (e) {} setMode('create'); }, '👑 I am Laurel — first-time setup, create the Admin Key'),
    msg && h('div', { style: { fontSize: 13, color: '#FF8A80', marginBottom: 10 } }, msg),
    h('button', { onClick: props.onBack, style: { background: 'transparent', border: 'none', color: '#999', fontSize: 13, cursor: 'pointer' } }, 'Back')));
}


// ── Stupid-simple Firebase walkthrough (shown while this device is not connected) ──
function FirebaseGuide() {
  var h = React.createElement, a = React.useState(''), txt = a[0], setTxt = a[1], b = React.useState(''), msg = b[0], setMsg = b[1], c = React.useState(0), step = c[0], setStep = c[1];
  var steps = [
    ['Open Firebase', 'Tap the blue button. Sign in with your Google account (laurels6472@gmail.com).', 'https://console.firebase.google.com', 'Open Firebase'],
    ['Make a project', 'Tap “Create a project” (or “Add project”). Name it MyBethelFamilyHome. Turn Google Analytics OFF. Tap Create.', null],
    ['Make the database', 'On the left tap Build, then “Realtime Database”, then “Create Database”. Pick United States. Choose “Start in test mode”. Tap Enable.', null],
    ['Get your code', 'Tap the gear ⚙ at the top left, then “Project settings”. Scroll down to “Your apps”. Tap the round </> icon, name it anything, tap Register app.', null],
    ['Copy it', 'You will see a box of text that starts with “const firebaseConfig = {”. Press and hold on it, Select All, and Copy.', null],
    ['Paste it here', 'Come back to this app and paste it in the box below, then tap Connect.', null]
  ];
  var cur = steps[step];
  function connect() {
    try { var r = fmParseJoin(txt); if (!initFirebase(r.cfg)) throw new Error('Firebase would not start with that code.'); try { localStorage.setItem('fm_setup_device', '1'); } catch (e) {} setMsg('✅ Connected! Reloading…'); setTimeout(function () { location.reload(); }, 800); }
    catch (e) { setMsg('❌ ' + (e.message || 'That did not work. Copy the whole box again.')); }
  }
  return h('div', { style: { background: 'rgba(255,193,7,.1)', border: '2px solid rgba(255,193,7,.5)', borderRadius: 16, padding: 14, marginBottom: 14 } },
    h('div', { style: { fontSize: 16, fontWeight: 900, color: '#FFD54F', marginBottom: 4 } }, '🚀 Set up family sync — 6 easy steps'),
    h('div', { style: { fontSize: 12, color: '#ddd', marginBottom: 10 } }, 'It is free and takes about 5 minutes. You only do this once.'),
    h('div', { style: { display: 'flex', gap: 4, marginBottom: 10 } }, steps.map(function (st, i) { return h('div', { key: i, onClick: function () { setStep(i); }, style: { flex: 1, height: 8, borderRadius: 4, cursor: 'pointer', background: i <= step ? '#FFD54F' : 'rgba(255,255,255,.2)' } }); })),
    h('div', { style: { fontSize: 13, color: '#FFD54F', fontWeight: 800 } }, 'Step ' + (step + 1) + ' of 6'),
    h('div', { style: { fontSize: 20, fontWeight: 900, color: '#fff', margin: '2px 0 6px' } }, cur[0]),
    h('div', { style: { fontSize: 15, color: '#eee', lineHeight: 1.6, marginBottom: 12 } }, cur[1]),
    cur[2] && h('a', { href: cur[2], target: '_blank', rel: 'noopener noreferrer', style: { display: 'block', textAlign: 'center', background: '#1A73E8', color: '#fff', borderRadius: 30, padding: 14, fontWeight: 900, fontSize: 16, textDecoration: 'none', marginBottom: 10 } }, cur[3] + ' ↗'),
    step === 5 && h('div', null, h('textarea', { rows: 5, value: txt, onChange: function (e) { setTxt(e.target.value); }, placeholder: 'Paste here', style: Object.assign({}, FM_IN, { fontSize: 13 }) }), fmBigBtn('#4CAF82', '#000', connect, '✅ Connect', !txt.trim())),
    msg && h('div', { style: { fontSize: 13, color: '#FFB74D', marginBottom: 8 } }, msg),
    h('div', { style: { display: 'flex', gap: 8 } },
      step > 0 && h('button', { onClick: function () { setStep(step - 1); }, style: { flex: 1, background: 'rgba(255,255,255,.12)', color: '#fff', border: 'none', borderRadius: 24, padding: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer' } }, '‹ Back'),
      step < 5 && h('button', { onClick: function () { setStep(step + 1); }, style: { flex: 2, background: '#FFD54F', color: '#000', border: 'none', borderRadius: 24, padding: 12, fontWeight: 900, fontSize: 15, cursor: 'pointer' } }, 'Done — next ›')));
}

// ── Admin panel: Family Code + Admin Key + trust ──
function FamilyAccessPanel() {
  var h = React.createElement, a = React.useState(0), tick = a[0], setTick = a[1], b = React.useState(''), msg = b[0], setMsg = b[1], c = React.useState(''), cur = c[0], setCur = c[1], d = React.useState(''), nk = d[0], setNk = d[1], e2 = React.useState(null), has = e2[0], setHas = e2[1];
  React.useEffect(function () { fmRemoteKeyHash().then(function (x) { setHas(!!x); }); }, [tick]);
  var code = fmFamilyCode(), box = { background: 'rgba(126,87,194,.1)', border: '1px solid rgba(126,87,194,.4)', borderRadius: 12, padding: 12, marginBottom: 14 };
  function setKey() {
    if (nk.length < 8) return setMsg('Use at least 8 characters.');
    var go = function () { fmStoreKey(nk).then(function () { fmTrust(); setNk(''); setCur(''); setMsg('✅ Admin Key saved.'); setTick(tick + 1); }); };
    if (has) window.fmCheckAdminKey(cur).then(function (ok) { if (ok) go(); else setMsg('Current key is not right.'); }); else go();
  }
  var notConnected = (typeof db === 'undefined' || !db);
  return h('div', null, notConnected && h(FirebaseGuide, null), h('div', { style: box },
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '🔑 Family Code & Admin Key'),
    h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.6)', lineHeight: 1.6, marginBottom: 8 } }, 'Send the Family Code to everyone so their device joins your sync. It does NOT let anyone into the parent accounts. Parents sign in on a new device with the Admin Key one time, then just the PIN.'),
    code ? h('div', null, h('textarea', { readOnly: true, rows: 3, value: code, onFocus: function (e) { e.target.select(); }, style: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, color: '#fff', fontSize: 11, padding: 8 } }),
      h('button', { onClick: function () { try { navigator.clipboard.writeText(code); setMsg('Family Code copied.'); } catch (x) { setMsg('Select the code and copy it.'); } }, style: { background: '#7E57C2', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 14px', fontWeight: 800, fontSize: 12, marginTop: 6, cursor: 'pointer' } }, '📋 Copy Family Code'))
      : h('div', { style: { fontSize: 12, color: '#FFB74D' } }, 'Connect this device to Firebase first (above) and the Family Code will appear here.'),
    h('div', { style: { fontSize: 12, fontWeight: 800, color: '#fff', margin: '12px 0 4px' } }, has === null ? 'Admin Key: checking…' : has ? 'Admin Key: ✅ set (change it below)' : 'Admin Key: ⚠️ NOT SET — set it now so nobody else can become a parent'),
    has && h('input', { type: 'password', value: cur, onChange: function (e) { setCur(e.target.value); }, placeholder: 'Current Admin Key', style: Object.assign({}, FM_IN, { fontSize: 14, padding: 10 }) }),
    h('input', { type: 'password', value: nk, onChange: function (e) { setNk(e.target.value); }, placeholder: has ? 'New Admin Key (8+ characters)' : 'Create Admin Key (8+ characters)', style: Object.assign({}, FM_IN, { fontSize: 14, padding: 10 }) }),
    h('button', { onClick: setKey, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 20, padding: '8px 14px', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, has ? 'Change Admin Key' : 'Save Admin Key'),
    msg && h('div', { style: { fontSize: 11, color: '#FFB74D', marginTop: 6 } }, msg)));
}

// ── Live presence: every device says "I'm here" every 25s ──
function FMPresence() {
  React.useEffect(function () {
    function beat() {
      if (typeof db === 'undefined' || !db) return;
      var pid = ''; try { pid = (JSON.parse(localStorage.getItem('last_user') || 'null') || {}).personId || ''; } catch (e) {}
      var id = typeof sfDeviceId === 'function' ? sfDeviceId() : 'dev'; var ref = db.ref('argilan/presence/' + id);
      try { ref.set({ pid: pid, ts: Date.now(), ua: (navigator.userAgent || '').slice(0, 60), vis: document.visibilityState }); ref.onDisconnect().remove(); } catch (e) {}
    }
    beat(); var iv = setInterval(beat, 25000); document.addEventListener('visibilitychange', beat);
    return function () { clearInterval(iv); document.removeEventListener('visibilitychange', beat); };
  }, []);
  return null;
}
function LiveNow(props) {
  var h = React.createElement, pS = React.useState({}), pres = pS[0], setPres = pS[1], tS = React.useState(0), setT = tS[1];
  var sesS = ktUse('sessions/' + todayKey(), {}), ses = sesS[0] || {};
  var sdAll = ktUse('startday/' + todayKey(), {})[0] || {};
  React.useEffect(function () { var u = syncOn('presence', function (d) { setPres(d || {}); }); var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 15000); return function () { if (u) u(); clearInterval(iv); }; }, []);
  var fam = props.family || [];
  var now = Date.now(), live = Object.values(pres).filter(function (p) { return p && p.ts && now - p.ts < 70000 && p.pid; });
  var byPid = {}; live.forEach(function (p) { byPid[p.pid] = (byPid[p.pid] || 0) + 1; });
  var who = Object.keys(byPid);
  var nm = function (id) { var p = fam.find(function (x) { return x.id === id; }); return p ? p.emoji + ' ' + p.name : id; };
  var acts = function (id) { var d = ses[id] || {}; return [d.current].concat(d.others || []).filter(Boolean).map(function (a) { return a.activity; }); };
  return h('div', { style: { background: 'rgba(76,175,130,.1)', border: '1px solid rgba(76,175,130,.4)', borderRadius: 16, padding: 14, margin: '10px 14px' } },
    h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '🟢 Live now (' + who.length + ')'),
    typeof db === 'undefined' || !db ? h('div', { style: { fontSize: 12, color: '#FFB74D' } }, 'This device is not connected to family sync yet. Open Admin → Sync Setup and follow the 6 easy steps.') :
      who.length === 0 ? h('div', { style: { fontSize: 13, color: '#b8b8c8' } }, 'No one else has the app open right now.') :
        who.map(function (id) { var a = acts(id); return h('div', { key: id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 14, color: '#fff' } }, h('span', { style: { fontWeight: 800 } }, nm(id)), byPid[id] > 1 && h('span', { style: { fontSize: 11, color: '#b8b8c8' } }, byPid[id] + ' devices'), h('span', { style: { fontSize: 12, color: a.length ? '#81C784' : '#999' } }, a.length ? '⏱ ' + a.join(' + ') : 'not clocked in'), (sdAll[id] || {}).readyAt && h('span', { style: { fontSize: 12, color: '#FFD54F' } }, '🌅 ready')); }));
}
