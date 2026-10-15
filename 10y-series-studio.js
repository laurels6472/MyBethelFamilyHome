// ═══ v37: 5 computers at once · photo upload · grade-by-grade learning summary · Bible Adventures Studio (team animated series) ═══
var CS_STATIONS = [['tp1', '💻 ThinkPad 1'], ['tp2', '💻 ThinkPad 2'], ['tp3', '💻 ThinkPad 3'], ['pc1', '🖥 Windows PC 1'], ['pc2', '🖥 Windows PC 2']];
var CS_SUMMARY = {
  mykah: { g: 'Grade 4', goal: 'Comfortable, safe and creative with a computer', items: ['Typing: home row, then all letters — 15 words per minute by spring', 'Scratch: make characters move, talk, repeat and choose (blocks, no typing code)', 'Digital drawing and saving files in the right folder', 'Recording her own voice for the series characters', 'Safe-internet rules; using jw.org kids pages with a parent'] },
  ashelyn: { g: 'Grade 8', goal: 'Confident typist and first real programmer', items: ['Typing: 30 words per minute, touch typing', 'Scratch animation with scenes, score and timers; storyboards', 'Python basics in Thonny: variables, loops, if-statements, a quiz game', 'Spreadsheets with formulas and charts; reports with headings and PDF export', 'Audio editing with Audacity for the series; research on wol.jw.org'] },
  kayla: { g: 'Grade 11', goal: 'Builds real things — web, data and design', items: ['Typing: 40 words per minute', 'HTML, CSS and JavaScript: an animated web page and the series website', 'Python with functions and lists; data in spreadsheets', 'Frame-by-frame animation in Krita and video editing in Shotcut', 'Password safety, phishing, email and letter format; CS50P (Harvard) free course'] },
  ryan: { g: 'Grade 12', goal: 'Career-ready skills and an engine project', items: ['Typing: 50 words per minute', 'Python with classes and files; Git and GitHub for the team’s project', 'Unreal Engine 5 (12-week track) and Godot 4 for the series’ 3D/2D scenes', 'Technical lead: file organization, backups, exporting and publishing the finished episodes', 'Databases (LibreOffice Base or SQLite) and a portfolio website; CS50 problem sets'] }
};
var CS_ROLES = {
  mykah: ['🎨 Character artist & voice', 'Draws characters and backgrounds, records voices.'],
  ashelyn: ['🎬 Storyboard & animator', 'Plans each scene and animates it in Scratch.'],
  kayla: ['✍️ Writer & editor', 'Writes the script from the Bible account and edits the episode.'],
  ryan: ['🛠 Technical lead', 'Builds scenes in Godot/Unreal, sound, exports and backups.']
};
var CS_EPISODES = [
  ['Creation days', 'Genesis 1', 'science · art', 'Each day of creation as a short scene; the earth’s water cycle and plants.'],
  ['Noah builds the ark', 'Genesis 6–9', 'math · history', 'Ark cubit measurements (Insight), animals in pairs, a flood scene.'],
  ['Joseph in Egypt', 'Genesis 37–45', 'history · language', 'Forgiveness, a map of Canaan to Egypt, grain storage math.'],
  ['Ruth and Naomi', 'Ruth 1–4', 'language · art', 'Loyalty and kindness; the barley harvest.'],
  ['David and the sling', 'First Samuel 17', 'science · math', 'Trust in Jehovah; physics of a sling.'],
  ['Esther’s courage', 'Esther 4–8', 'history · composition', 'Persian empire map; a letter-writing scene.'],
  ['Daniel and his friends', 'Daniel 1; 6', 'history · art', 'Babylon, integrity, choosing wisely.'],
  ['Jonah', 'Jonah 1–4', 'science · language', 'The sea voyage, mercy and obedience.'],
  ['Nehemiah rebuilds', 'Nehemiah 2–6', 'math · history', 'Wall measurements, teamwork, a build-timeline.'],
  ['Jesus and the children', 'Mark 10:13-16', 'language · art', 'Kindness and humility, told with care.'],
  ['Paul’s voyage', 'Acts 27', 'history · science', 'Map of the Mediterranean; ship and weather facts.'],
  ['Our season finale', 'Our choice', 'all subjects', 'The team picks a theme from their own lessons.']
];
var CS_STEPS = [['study', '📖 Study the account in the New World Translation and Insight'], ['script', '✍️ Script written'], ['board', '🧩 Storyboard drawn'], ['art', '🎨 Art & characters made'], ['anim', '🎞 Animated'], ['reverence', '🙏 Reverence check done (parent confirms) before any recording'], ['sound', '🔊 Voices & sound recorded'], ['review', '👀 Parent accuracy review'], ['premiere', '🍿 Family premiere']];
var CS_RULES = ['Stay true to the Bible account — read it first and check every detail against the New World Translation and Insight.', 'The team writes every script together. Everyone adds, reads and improves the lines.', 'Jehovah’s voice is a high, honored privilege — read the Jehovah’s-voice promise below before anyone records it.', 'Keep it respectful, never mocking or scary for little ones.', 'Use our own drawings, voices and music — no copyrighted characters, songs or clips.', 'A parent approves every episode before it is shared outside the family.'];
var CS_PROMISE = ['We are representing Jehovah, the Most High, Sovereign of the whole earth and universe. Giving voice to his words is a serious, weighty and deeply honored privilege.', 'Jehovah’s lines use only words taken directly from the Bible (New World Translation). We add no words of our own to what he says.', 'Before recording, we pause, pray and calm our hearts. Everyone is quiet and respectful in the room.', 'We speak slowly, steadily and with dignity — no silly voices, no jokes, no laughing during these lines.', 'If anyone cannot be serious, we stop and record another day. A parent is present for these recordings.'];

function csResize(file, maxW, cb) {
  var rd = new FileReader();
  rd.onload = function () { var im = new Image(); im.onload = function () { var r = Math.min(1, maxW / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * r); c.height = Math.round(im.height * r); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', 0.65)); }; im.onerror = function () { cb(null); }; im.src = rd.result; };
  rd.readAsDataURL(file);
}
function PhotoBox(props) {
  var h = React.createElement, path = props.path, admin = props.isAdmin;
  var s = React.useState({}), ph = s[0], setPh = s[1], s2 = React.useState(''), cap = s2[0], setCap = s2[1], s3 = React.useState(''), msg = s3[0], setMsg = s3[1];
  React.useEffect(function () { var u = syncOn(path, function (d) { setPh(d || {}); }, true); return function () { if (u) u(); }; }, [path]);
  function pick(e) {
    var f = e.target.files && e.target.files[0]; if (!f) return; setMsg('Saving…');
    csResize(f, 900, function (img) {
      if (!img) { setMsg('That file could not be read as a picture.'); return; }
      var ts = Date.now(); try { var o = { img: img, cap: cap, ts: ts, by: props.by || '' }; syncSet(path + '/' + ts, o); setPh(function (m) { var n = Object.assign({}, m); n[ts] = o; return n; }); setMsg('Saved ✓'); setCap(''); } catch (x) { setMsg('Could not save — try again.'); }
    }); e.target.value = '';
  }
  function del(k) { if (!admin) return; if (window.confirm('Delete this photo?')) { try { syncSet(path + '/' + k, null); } catch (x) {} setPh(function (m) { var n = Object.assign({}, m); delete n[k]; return n; }); } }
  var keys = Object.keys(ph).sort().reverse();
  return h('div', null,
    h('input', { value: cap, onChange: function (e) { setCap(e.target.value); }, placeholder: 'Caption (what is this?)', style: { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, color: '#fff', padding: 8, fontSize: 13, marginBottom: 6 } }),
    h('label', { style: { display: 'block', textAlign: 'center', background: '#039BE5', color: '#fff', borderRadius: 20, padding: 10, fontWeight: 800, cursor: 'pointer' } }, '📷 Add a photo or picture', h('input', { type: 'file', accept: 'image/*', onChange: pick, style: { display: 'none' } })),
    msg ? h('div', { style: { fontSize: 11, color: '#9ad', marginTop: 4 } }, msg) : null,
    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginTop: 8 } }, keys.slice(0, 40).map(function (k) { var p = ph[k]; return h('div', { key: k, onClick: function () { del(k); }, style: { background: 'rgba(0,0,0,.3)', borderRadius: 8, overflow: 'hidden' } }, h('img', { src: p.img, style: { width: '100%', display: 'block' } }), p.cap ? h('div', { style: { fontSize: 11, color: '#ddd', padding: 4 } }, p.cap) : null); })),
    admin && keys.length ? h('div', { style: { fontSize: 10, color: '#789', marginTop: 4 } }, 'Parents: tap a photo to delete it.') : null);
}
function Stations(props) {
  var h = React.createElement, pid = props.pid;
  var s = React.useState({}), st = s[0], setSt = s[1], s2 = React.useState(0), tk = s2[0], setTk = s2[1];
  React.useEffect(function () { var u = syncOn('school/complab_stations', function (d) { setSt(d || {}); }, true); var iv = setInterval(function () { setTk(function (x) { return x + 1; }); }, 30000); return function () { if (u) u(); clearInterval(iv); }; }, []);
  function sit(id) { var o = { pid: pid, name: props.name, ts: Date.now() }; try { syncSet('school/complab_stations/' + id, o); } catch (x) {} setSt(function (m) { var n = Object.assign({}, m); n[id] = o; return n; }); }
  function leave(id) { try { syncSet('school/complab_stations/' + id, null); } catch (x) {} setSt(function (m) { var n = Object.assign({}, m); delete n[id]; return n; }); }
  return h('div', null,
    h('div', { style: { fontSize: 12, color: '#ccc', lineHeight: 1.6, marginBottom: 8 } }, 'Three ThinkPads and two Windows computers — everyone can work at once. Tap a free computer to sit down, tap yours again when you are done.'),
    CS_STATIONS.map(function (c) {
      var o = st[c[0]], mine = o && o.pid === pid, busy = o && !mine;
      return h('div', { key: c[0], onClick: function () { mine ? leave(c[0]) : (!busy || props.isAdmin) ? sit(c[0]) : null; }, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', marginBottom: 6, borderRadius: 10, cursor: 'pointer', background: mine ? 'rgba(76,175,130,.25)' : busy ? 'rgba(239,83,80,.15)' : 'rgba(255,255,255,.06)' } },
        h('div', { style: { flex: 1, fontSize: 14, fontWeight: 800, color: '#fff' } }, c[1]),
        h('div', { style: { fontSize: 12, color: mine ? '#81C784' : busy ? '#EF9A9A' : '#9ad' } }, mine ? 'You — tap to finish' : busy ? o.name + ' is on' : 'Free'));
    }));
}
function LabSummary(props) {
  var h = React.createElement, show = props.pid ? [props.pid] : ['mykah', 'ashelyn', 'kayla', 'ryan'];
  return h('div', null, show.map(function (id) {
    var d = CS_SUMMARY[id]; if (!d) return null;
    return h('div', { key: id, style: { borderTop: '1px solid rgba(255,255,255,.08)', padding: '8px 0' } },
      h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff' } }, id.charAt(0).toUpperCase() + id.slice(1) + ' · ' + d.g), h('div', { style: { fontSize: 12, color: '#FFE082', margin: '2px 0 4px' } }, 'Goal: ' + d.goal),
      d.items.map(function (t, i) { return h('div', { key: i, style: { fontSize: 12, color: '#ddd', lineHeight: 1.55 } }, '• ' + t); }));
  }));
}
function SeriesStudio(props) {
  var h = React.createElement, pid = props.pid, admin = props.isAdmin;
  var s = React.useState({}), d = s[0], setD = s[1], s2 = React.useState(0), ep = s2[0], setEp = s2[1];
  React.useEffect(function () { var u = syncOn('school/series', function (x) { setD(x || {}); }); return function () { if (u) u(); }; }, []);
  var E = CS_EPISODES[ep], st = d['e' + ep] || {};
  function tog(k) { if ((k === 'review' || k === 'reverence') && !admin) return; var v = !(st[k]); var n = Object.assign({}, d); n['e' + ep] = Object.assign({}, st); n['e' + ep][k] = v; setD(n); try { syncSet('school/series/e' + ep + '/' + k, v); } catch (x) {} }
  var done = CS_STEPS.filter(function (x) { return st[x[0]]; }).length, role = CS_ROLES[pid];
  return h('div', null,
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#FFD54F', marginBottom: 4 } }, '🎬 Bible Adventures — our family animated series'),
    h('div', { style: { fontSize: 12, color: '#ccc', lineHeight: 1.6, marginBottom: 8 } }, 'The four students make one episode at a time as a team, using what they learn in their lessons: history, science, math, art and language.'),
    role ? h('div', { style: { background: 'rgba(255,213,79,.12)', borderRadius: 10, padding: 9, marginBottom: 8, fontSize: 12, color: '#fff' } }, h('b', null, 'My role: ' + role[0]), h('div', { style: { color: '#ddd' } }, role[1])) : null,
    h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 } }, CS_EPISODES.map(function (e, i) { var dn = CS_STEPS.every(function (x) { return (d['e' + i] || {})[x[0]]; }); return h('button', { key: i, onClick: function () { setEp(i); }, style: { background: ep === i ? '#039BE5' : 'rgba(255,255,255,.08)', color: '#fff', border: 'none', borderRadius: 14, padding: '5px 9px', fontSize: 11, fontWeight: 800, cursor: 'pointer' } }, (dn ? '✅ ' : '') + (i + 1)); })),
    h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff' } }, 'Episode ' + (ep + 1) + ': ' + E[0]),
    h('div', { style: { fontSize: 12, color: '#81D4FA', marginBottom: 2 } }, E[1] + ' · ties to: ' + E[2]), h('div', { style: { fontSize: 12, color: '#ccc', marginBottom: 8 } }, E[3]),
    h('div', { style: { height: 8, background: 'rgba(255,255,255,.1)', borderRadius: 6, marginBottom: 6 } }, h('div', { style: { height: 8, width: (100 * done / CS_STEPS.length) + '%', background: '#4CAF82', borderRadius: 6 } })),
    CS_STEPS.map(function (x) { var lock = (x[0] === 'review' || x[0] === 'reverence') && !admin; return h('div', { key: x[0], onClick: function () { tog(x[0]); }, style: { display: 'flex', gap: 8, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,.06)', cursor: lock ? 'default' : 'pointer', opacity: lock && !st[x[0]] ? 0.6 : 1 } }, h('span', null, st[x[0]] ? '✅' : '⬜'), h('span', { style: { fontSize: 13, color: '#eee' } }, x[1] + (lock ? ' (parent checks this)' : ''))); }),
    h('div', { style: { fontSize: 12, fontWeight: 800, color: '#fff', margin: '10px 0 4px' } }, '✍️ Team script (everyone writes together)'),
    h(ScriptWriter, { key: 's' + ep, ep: ep, pid: pid, admin: admin }),
    h(JehovahPromise, null),
    h('div', { style: { fontSize: 12, fontWeight: 800, color: '#fff', margin: '10px 0 4px' } }, '📷 Pictures for this episode (drawings, storyboards, screenshots)'),
    h(PhotoBox, { key: ep, path: 'school/series/e' + ep + '/photos', isAdmin: admin, by: pid }),
    h('div', { style: { background: 'rgba(239,83,80,.12)', borderRadius: 10, padding: 9, marginTop: 10 } }, h('div', { style: { fontSize: 12, fontWeight: 900, color: '#FFAB91', marginBottom: 3 } }, 'Studio rules'), CS_RULES.map(function (r, i) { return h('div', { key: i, style: { fontSize: 11, color: '#ddd', lineHeight: 1.5 } }, '• ' + r); })));
}

function JehovahPromise() {
  var h = React.createElement;
  return h('div', { style: { background: 'rgba(255,213,79,.14)', border: '1px solid rgba(255,213,79,.5)', borderRadius: 10, padding: 10, marginTop: 10 } },
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#FFD54F', marginBottom: 4 } }, '🙏 The Jehovah’s-voice promise'),
    CS_PROMISE.map(function (t, i) { return h('div', { key: i, style: { fontSize: 12, color: '#fff', lineHeight: 1.55, marginBottom: 3 } }, (i + 1) + '. ' + t); }));
}
function ScriptWriter(props) {
  var h = React.createElement, ep = props.ep, path = 'school/series/e' + ep + '/script';
  var s = React.useState({}), ls = s[0], setLs = s[1], s2 = React.useState('Narrator'), who = s2[0], setWho = s2[1], s3 = React.useState(''), txt = s3[0], setTxt = s3[1], s4 = React.useState(''), custom = s4[0], setCustom = s4[1];
  React.useEffect(function () { var u = syncOn(path, function (d) { setLs(d || {}); }, true); return function () { if (u) u(); }; }, [path]);
  var keys = Object.keys(ls).sort();
  var names = ['Narrator', 'Jehovah (Bible words only)', 'Scene note'];
  function add() { if (!txt.trim()) return; var ts = Date.now(), w = who === 'Other' ? (custom.trim() || 'Character') : who; var o = { who: w, text: txt.trim(), by: props.pid, ts: ts }; try { syncSet(path + '/' + ts, o); } catch (x) {} setLs(function (m) { var n = Object.assign({}, m); n[ts] = o; return n; }); setTxt(''); }
  function save(k, v) { try { syncSet(path + '/' + k + '/text', v); syncSet(path + '/' + k + '/editedBy', props.pid); } catch (x) {} setLs(function (m) { var n = Object.assign({}, m); n[k] = Object.assign({}, n[k], { text: v, editedBy: props.pid }); return n; }); }
  function del(k) { if (window.confirm('Delete this line?')) { try { syncSet(path + '/' + k, null); } catch (x) {} setLs(function (m) { var n = Object.assign({}, m); delete n[k]; return n; }); } }
  var by = function (id) { return id ? id.charAt(0).toUpperCase() + id.slice(1) : ''; };
  return h('div', null,
    h('div', { style: { fontSize: 11, color: '#9ad', marginBottom: 6 } }, 'Add lines in order. Anyone can fix or improve any line — tap a line to edit it. Talk it over together before you change someone else’s words.'),
    keys.length ? keys.map(function (k) { var l = ls[k], jv = /^Jehovah/.test(l.who); return h('div', { key: k + (l.text || ''), style: { background: jv ? 'rgba(255,213,79,.12)' : 'rgba(0,0,0,.25)', borderLeft: '3px solid ' + (jv ? '#FFD54F' : '#039BE5'), borderRadius: 6, padding: '5px 8px', marginBottom: 5 } },
      h('div', { style: { fontSize: 10, color: jv ? '#FFD54F' : '#81D4FA', fontWeight: 800 } }, (jv ? '🙏 ' : '') + l.who + ' · by ' + by(l.by) + (l.editedBy && l.editedBy !== l.by ? ' · edited by ' + by(l.editedBy) : '')),
      h('textarea', { defaultValue: l.text, rows: 2, onBlur: function (e) { if (e.target.value !== l.text) save(k, e.target.value); }, style: { width: '100%', boxSizing: 'border-box', background: 'transparent', border: 'none', color: '#fff', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' } }),
      (props.admin || l.by === props.pid) ? h('span', { onClick: function () { del(k); }, style: { fontSize: 10, color: '#EF9A9A', cursor: 'pointer' } }, 'delete line') : null); }) : h('div', { style: { fontSize: 12, color: '#789', marginBottom: 6 } }, 'No lines yet — be the first to write one.'),
    h('div', { style: { display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' } },
      h('select', { value: who, onChange: function (e) { setWho(e.target.value); }, style: { flex: 1, minWidth: 130, background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: 7, fontSize: 12 } }, names.concat(['Other']).map(function (n) { return h('option', { key: n, value: n, style: { color: '#000' } }, n === 'Other' ? 'Another character…' : n); })),
      who === 'Other' ? h('input', { value: custom, onChange: function (e) { setCustom(e.target.value); }, placeholder: 'Character name', style: { flex: 1, minWidth: 110, background: 'rgba(255,255,255,.07)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: 7, fontSize: 12 } }) : null),
    /^Jehovah/.test(who) ? h('div', { style: { fontSize: 11, color: '#FFD54F', marginTop: 4 } }, '🙏 Use only words taken directly from the Bible. Include the scripture reference in your line.') : null,
    h('textarea', { value: txt, onChange: function (e) { setTxt(e.target.value); }, rows: 2, placeholder: 'Type the next line of the script…', style: { width: '100%', boxSizing: 'border-box', marginTop: 6, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, color: '#fff', padding: 8, fontSize: 13 } }),
    h('button', { onClick: add, style: { width: '100%', marginTop: 6, background: '#4CAF82', color: '#fff', border: 'none', borderRadius: 20, padding: 9, fontWeight: 800, cursor: 'pointer' } }, '➕ Add line to the team script'));
}
