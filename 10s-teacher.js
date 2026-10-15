// ═══ TEACHER TOOLS: coming-up strip, take attendance for any day, assignment grades ═══════════════════
function tcPad(n) { return (n < 10 ? '0' : '') + n; }
function tcIso(d) { return d.getFullYear() + '-' + tcPad(d.getMonth() + 1) + '-' + tcPad(d.getDate()); }
function tcLetter(p) { return p >= 90 ? 'A' : p >= 80 ? 'B' : p >= 70 ? 'C' : p >= 60 ? 'D' : 'F'; }
function tcLetterColor(l) { return { A: '#4CAF82', B: '#C0CA33', C: '#FF9800', D: '#FF5722', F: '#EF5350' }[l] || '#fff'; }

// ── What is about to end / start / come due ──
function ComingUp(props) {
  var h = React.createElement, pid = props.personId, tS = React.useState(0), setT = tS[1];
  React.useEffect(function () { var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 20000); return function () { clearInterval(iv); }; }, []);
  var snS = ktUse('comingup_snooze', {}), snooze = snS[0] || {}, nowTs = Date.now(), midnight = (function () { var m = new Date(); m.setHours(0, 0, 0, 0); return m.getTime(); })(), hS = React.useState({}), hid = hS[0], setHid = hS[1];
  function isSnz(key) { var z = snooze[key]; return !!hid[key] || (typeof z === 'number' && z >= midnight); }
  var uS = React.useState({}), sent = uS[0], setSent = uS[1], mS2 = React.useState(''), openMsg = mS2[0], setOpenMsg = mS2[1], tS2 = React.useState(''), msgTxt = tS2[0], setMsgTxt = tS2[1];
  var sS = ktUse('schedule', {}), sched = sS[0] || {}, sdS = ktUse('startday/' + todayKey() + '/' + pid, null), sd = sdS[0] || {}, cfgS = ktUse('startday_cfg', null), cfg = cfgS[0] || {};
  var biS = ktUse('store/bills', null), pdAll = (ktUse('store/paid', {})[0] || {}), paid = pdAll[pid] || {}, isAdm = !!props.isAdmin, kidsList = (props.family || []).filter(function (p) { return !p.deleted && p.role === 'child' && p.inPaySystem !== false; });
  var d = new Date(), nowM = d.getHours() * 60 + d.getMinutes(), now = d.getTime(), out = [];
  var day = sched[tcIso(d)] || sched[todayKey()];
  var bl = day ? (Array.isArray(day.blocks) ? day.blocks : Object.values(day.blocks || {})).filter(function (b) { return b && (!b.kids || !b.kids.length || b.kids.indexOf(pid) !== -1); }).map(function (b) { return { b: b, t: planMinutes(b.time || b.t) }; }).filter(function (x) { return x.t != null; }).sort(function (a, b) { return a.t - b.t; }) : [];
  var ci = -1; bl.forEach(function (x, i) { if (x.t <= nowM) ci = i; });
  if (ci >= 0 && ci + 1 < bl.length) { var left = bl[ci + 1].t - nowM; out.push({ k: 'cur', icon: '⏳', text: (bl[ci].b.emoji || '') + ' ' + (bl[ci].b.title || 'Now') + ' ends in', mins: left, urgent: left <= 5 }); }
  if (ci + 1 < bl.length) { var nx = bl[ci + 1], toNext = nx.t - nowM; if (toNext > 0 && toNext <= 90) out.push({ k: 'next', icon: '➡️', text: 'Next: ' + (nx.b.emoji || '') + ' ' + (nx.b.title || '') + ' starts in', mins: toNext }); }
  if (sd.dayStart && !sd.readyAt && !sd.dayEnd) { var mins = +cfg.mins > 0 ? +cfg.mins : 15, leftMs = sd.dayStart + mins * 60000 - now; out.push({ k: 'ready', icon: '🚿', text: leftMs > 0 ? 'Get ready — time left' : 'Get-ready time is up!', mins: Math.max(0, Math.ceil(leftMs / 60000)), urgent: leftMs < 5 * 60000 }); }
  var bills = (Array.isArray(biS[0]) ? biS[0] : (biS[0] && typeof biS[0] === 'object' ? Object.values(biS[0]) : (typeof ST_DEFAULT_BILLS !== 'undefined' ? ST_DEFAULT_BILLS : []))).filter(Boolean), ym = d.getFullYear() + '-' + tcPad(d.getMonth() + 1);
  var cfgAll = (ktUse('store/cfg', null)[0]) || {}, toStart = stDaysToStart(cfgAll), started = toStart <= 0;
  var envAll = (ktUse('env', {})[0]) || {}, walAll = (ktUse('wallets', {})[0]) || {}, pm = window._payMode, unitC = pm === 'points' ? (+cfgAll.ptsPerB > 0 ? +cfgAll.ptsPerB : 20) : 1;
  function needOf(k) { var bal = ((envAll[k.id] || {}).bal) || {}; return bills.reduce(function (n, b) { return n + Math.max(0, (+b.cost || 0) - (+bal['b_' + b.id] || 0)); }, 0); }
  var notReady = kidsList.filter(function (k) { return needOf(k) > 0.001 && !isSnz(k.id + '_start_' + (cfgAll.billsStart || 'x')); });
  if (!started && toStart <= 21 && isAdm) { if (notReady.length) out.push({ k: 'billstartA', startKids: notReady, days: toStart }); }
  else if (!started && toStart <= 21) out.push({ k: 'billstart', icon: '🏠', text: 'Bills start in ' + toStart + ' day' + (toStart === 1 ? '' : 's') + ' (' + stStartDate(cfgAll).toLocaleDateString([], { month: 'long', day: 'numeric' }) + ') — fill your envelopes!', noTime: true });
  if (isAdm && started) {
    bills.forEach(function (b) {
      var dd = (+b.dueDay || 1) - d.getDate(); if (dd > 3) return;
      var late = kidsList.filter(function (k) { return !(((pdAll[k.id] || {})[ym] || {})[b.id]) && !isSnz(k.id + '_' + b.id + '_' + ym); });
      if (!late.length) return;
      out.push({ k: 'abill' + b.id, bill: b, dd: dd, late: late, urgent: dd <= 0, noTime: true });
    });
  } else if (started && props.showBills !== false) bills.forEach(function (b) { if ((paid[ym] || {})[b.id]) return; var dd = (+b.dueDay || 1) - d.getDate(); if (dd <= 3) out.push({ k: 'bill' + b.id, icon: dd < 0 ? '⚠️' : '🏠', text: (b.name || 'Bill') + (dd < 0 ? ' is past due' : dd === 0 ? ' is due today' : ' is due in ' + dd + ' day' + (dd > 1 ? 's' : '')), urgent: dd <= 0, noTime: true }); });
  if (!out.length) return null;
  function say(kid, bill, text) { if (!props.addNotif) return; try { props.addNotif('alert', kid.id, '🏠 ' + (bill.name || 'Bill') + ' — reminder from ' + ((window._currentPersonName) || 'your parents'), text, { requiresApproval: false }); } catch (e) {} }
  function snzKey(key) { setHid(function (o) { var n = Object.assign({}, o); n[key] = true; return n; }); try { syncSet('comingup_snooze/' + key, Date.now()); } catch (e) {} }
  function snz(kid, bill) { snzKey(kid.id + '_' + bill.id + '_' + ym); }
  function mark(key) { setSent(function (o) { var n = Object.assign({}, o); n[key] = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); return n; }); }
  function remind(kid, bill, dd) { say(kid, bill, bill.name + ' is ' + (dd < 0 ? 'past due' : dd === 0 ? 'due today' : 'due in ' + dd + ' day' + (dd > 1 ? 's' : '')) + '. Please pay it in the Store & Envelopes tab.'); mark('r' + kid.id + bill.id); snz(kid, bill); }
  var startKey = cfgAll.billsStart || 'x';
  function snzStart(kid) { snzKey(kid.id + '_start_' + startKey); }
  function remindStart(kid) { if (!props.addNotif) return; try { props.addNotif('alert', kid.id, '🏠 Fill your envelopes', 'Bills start in ' + toStart + ' day' + (toStart === 1 ? '' : 's') + '. Open Store & Envelopes and put Bethel Cash into each bill envelope. You still need B$' + needOf(kid).toFixed(2) + '.', { requiresApproval: false }); } catch (e) {} mark('sr' + kid.id); snzStart(kid); }
  function doStart(kid) {
    var w = walAll[kid.id] || { balance: 0, history: [] }, free = Math.round(((w.balance || 0) / unitC) * 100) / 100, bal = Object.assign({}, ((envAll[kid.id] || {}).bal) || {}), used = 0;
    bills.forEach(function (b) { var need = Math.max(0, (+b.cost || 0) - (+bal['b_' + b.id] || 0)), put = Math.min(need, free - used); if (put > 0.001) { put = Math.round(put * 100) / 100; used += put; bal['b_' + b.id] = Math.round(((+bal['b_' + b.id] || 0) + put) * 100) / 100; try { syncSet('env/' + kid.id + '/bal/b_' + b.id, bal['b_' + b.id]); var id = 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); syncSet('env/' + kid.id + '/tx/' + id, { id: id, ts: Date.now(), type: 'fund', env: 'b_' + b.id, amt: put, desc: 'Filled by ' + ((window._currentPersonName) || 'parent') }); } catch (e) {} } });
    used = Math.round(used * 100) / 100;
    if (used > 0) { var raw = Math.round(used * unitC * 100) / 100, e = { id: 'tx' + Date.now().toString(36), type: 'purchase', amount: raw, reason: '✉️ Put into bill envelopes by parent', timestamp: Date.now(), approved: true }; try { syncSet('wallets/' + kid.id, Object.assign({}, w, { balance: Math.round(((w.balance || 0) - raw) * 100) / 100, history: [e].concat(w.history || []).slice(0, 100) })); } catch (x) {} if (props.addNotif) try { props.addNotif('alert', kid.id, '✉️ Your bill envelopes were filled', 'A parent put B$' + used.toFixed(2) + ' of your Bethel Cash into your bill envelopes so you are ready for ' + stStartDate(cfgAll).toLocaleDateString([], { month: 'long', day: 'numeric' }) + '.', { requiresApproval: false }); } catch (x) {} }
    mark('sd' + kid.id + (used > 0 ? '+' : '0')); if (used <= 0) mark('sn' + kid.id); snzStart(kid);
  }
  function sendMsg(kid, bill) { if (!msgTxt.trim()) return; say(kid, bill, msgTxt.trim()); mark('m' + kid.id + bill.id); snz(kid, bill); setMsgTxt(''); setOpenMsg(''); }
  function markPaid(kid, bill) { try { syncSet('store/paid/' + kid.id + '/' + ym + '/' + bill.id, Date.now()); } catch (e) {} mark('p' + kid.id + bill.id); snz(kid, bill); }
  var sb = function (bg, fg, fn, t) { return h('button', { onClick: fn, style: { background: bg, color: fg, border: 'none', borderRadius: 14, padding: '9px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, t); };
  return h('div', { style: { background: 'rgba(255,152,0,.14)', borderBottom: '1px solid rgba(255,152,0,.4)', padding: '8px 12px', flexShrink: 0 } },
    h('div', { style: { fontSize: 11, fontWeight: 900, color: '#FFB74D', letterSpacing: 1, marginBottom: 2 } }, 'COMING UP'),
    out.slice(0, 10).map(function (o) {
      if (o.startKids) {
        return h('div', { key: o.k, style: { padding: '4px 0' } },
          h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff' } }, '🏠 Bills start in ' + o.days + ' day' + (o.days === 1 ? '' : 's') + ' (' + stStartDate(cfgAll).toLocaleDateString([], { month: 'long', day: 'numeric' }) + ') — these kids still need to fill their envelopes:'),
          o.startKids.map(function (kid) {
            var nd = needOf(kid);
            return h('div', { key: kid.id, style: { padding: '4px 0 6px 12px', borderLeft: '3px solid rgba(255,183,77,.5)', marginTop: 4 } },
              h('div', { style: { fontSize: 14, color: '#fff', fontWeight: 700, marginBottom: 4 } }, kid.emoji + ' ' + kid.name + ' — needs B$' + nd.toFixed(2) + ' more in bill envelopes', sent['sr' + kid.id] && h('span', { style: { fontSize: 11, color: '#81C784', marginLeft: 8 } }, 'reminded ' + sent['sr' + kid.id])),
              h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
                sb('rgba(255,255,255,.18)', '#fff', function () { snzStart(kid); }, '⏭ Skip for now'),
                sb('#FFB74D', '#000', function () { remindStart(kid); }, '🔔 Send reminder'),
                sb('#4CAF82', '#000', function () { doStart(kid); }, '⚡ Do it for ' + kid.name)));
          }));
      }
      if (o.bill) {
        var b = o.bill;
        return h('div', { key: o.k, style: { padding: '4px 0' } },
          h('div', { style: { fontSize: 14, fontWeight: 900, color: o.urgent ? '#FF8A80' : '#fff' } }, (o.dd < 0 ? '⚠️ ' : '🏠 ') + (b.emoji || '') + ' ' + (b.name || 'Bill') + ' ' + (o.dd < 0 ? 'is PAST DUE' : o.dd === 0 ? 'is due today' : 'is due in ' + o.dd + ' day' + (o.dd > 1 ? 's' : ''))),
          o.late.map(function (kid) {
            var key = kid.id + b.id;
            return h('div', { key: kid.id, style: { padding: '4px 0 6px 12px', borderLeft: '3px solid rgba(255,183,77,.5)', marginTop: 4 } },
              h('div', { style: { fontSize: 14, color: '#fff', fontWeight: 700, marginBottom: 4 } }, kid.emoji + ' ' + kid.name, sent['r' + key] && h('span', { style: { fontSize: 11, color: '#81C784', marginLeft: 8 } }, 'reminded ' + sent['r' + key]), sent['m' + key] && h('span', { style: { fontSize: 11, color: '#81C784', marginLeft: 8 } }, 'messaged ' + sent['m' + key])),
              h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
                sb('#FFB74D', '#000', function () { remind(kid, b, o.dd); }, '🔔 Send reminder'),
                sb('rgba(255,255,255,.18)', '#fff', function () { setOpenMsg(openMsg === key ? '' : key); setMsgTxt(''); }, '💬 Message'),
                sb('#4CAF82', '#000', function () { markPaid(kid, b); }, '✅ Mark paid')),
              openMsg === key && h('div', { style: { display: 'flex', gap: 6, marginTop: 6 } }, h('input', { value: msgTxt, onChange: function (e) { setMsgTxt(e.target.value); }, placeholder: 'Write to ' + kid.name + '…', style: { flex: 1, background: 'rgba(0,0,0,.25)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, color: '#fff', padding: 9, fontSize: 14 } }), sb('#039BE5', '#fff', function () { sendMsg(kid, b); }, 'Send')));
          }));
      }
      return h('div', { key: o.k, style: { fontSize: 14, color: o.urgent ? '#FF8A80' : '#fff', fontWeight: o.urgent ? 900 : 600, padding: '3px 0', display: 'flex', gap: 8, alignItems: 'center' } }, h('span', { style: { flex: 1 } }, o.icon + ' ' + o.text + (o.noTime ? '' : ' ' + o.mins + ' min')), (String(o.k).indexOf('bill') === 0 && props.onGo) && sb('#FFD54F', '#000', props.onGo, 'Pay it'), (o.k === 'ready' && props.onGoStart) && sb('#FFD54F', '#000', props.onGoStart, 'Go'));
    }));
}

// ── Teacher attendance: any day, any time ──
function TakeAttendance(props) {
  var h = React.createElement, kids = (props.family || []).filter(function (p) { return !p.deleted && p.role === 'child'; });
  var dS = React.useState(tcIso(new Date())), date = dS[0], setDate = dS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1], fS = React.useState({}), f = fS[0], setF = fS[1];
  var aS = ktUse('attendance/' + date, {}), att = aS[0] || {};
  var parts = date.split('-'), plain = (+parts[0]) + '-' + (+parts[1]) + '-' + (+parts[2]);
  var OFF = { absent: 1, excused: 1, holiday: 1 };
  function nowHm() { var d = new Date(); return tcPad(d.getHours()) + ':' + tcPad(d.getMinutes()); }
  function ms(t) { var m = /^(\d{1,2}):(\d{2})$/.exec(t || ''); if (!m) return null; var x = new Date(+parts[0], +parts[1] - 1, +parts[2], +m[1], +m[2], 0, 0); return x.getTime(); }
  function val(pid, k, def) { var key = pid + '_' + k; return f[key] != null ? f[key] : (att[pid] && att[pid][k] != null ? att[pid][k] : def); }
  function setV(pid, k, v) { setF(function (o) { var n = Object.assign({}, o); n[pid + '_' + k] = v; return n; }); }
  // One tap saves. Clock-in leaves "out" blank until the teacher clocks them out later.
  function write(p, st, s, e, quiet) {
    var off = !!OFF[st], rec = { status: st, start: off ? '' : (s || ''), end: off ? '' : (e || ''), note: val(p.id, 'note', ''), by: window._currentPersonId || 'parent', at: Date.now() };
    try { syncSet('attendance/' + date + '/' + p.id, rec); } catch (x) {}
    try {
      var cur = {}; try { cur = syncGet('startday/' + plain + '/' + p.id) || {}; } catch (x) {}
      if (rec.start) syncSet('startday/' + plain + '/' + p.id, Object.assign({}, cur, { dayStart: ms(rec.start), dayEnd: rec.end ? ms(rec.end) : null, enteredByTeacher: true }));
      else if (cur.enteredByTeacher) syncSet('startday/' + plain + '/' + p.id, null);
    } catch (x) {}
    setF(function (o) { var n = {}; Object.keys(o).forEach(function (k) { if (k.indexOf(p.id + '_') !== 0 || k === p.id + '_note') n[k] = o[k]; }); return n; });
    if (!quiet) setMsg('✅ ' + p.name + ' — ' + st + (rec.start ? ' in ' + rec.start : '') + (rec.end ? ', out ' + rec.end : ''));
  }
  function setStatus(p, st) { var sv = att[p.id] || {}; write(p, st, sv.start || val(p.id, 'start', '') || nowHm(), sv.end || '', false); }
  function saveTimes(p) { var sv = att[p.id]; if (!sv) { setMsg('Pick a status first.'); return; } write(p, sv.status, val(p.id, 'start', sv.start || nowHm()), val(p.id, 'end', ''), false); }
  function clockOut(p) { var sv = att[p.id]; if (!sv || OFF[sv.status]) { setMsg('Mark ' + p.name + ' present or late first.'); return; } write(p, sv.status, sv.start || nowHm(), val(p.id, 'end', '') || nowHm(), false); }
  function clearOut(p) { var sv = att[p.id]; if (sv) write(p, sv.status, sv.start, '', false); }
  function everyone(st) { var t = nowHm(); kids.forEach(function (p) { var sv = att[p.id] || {}; write(p, st, sv.start || t, sv.end || '', true); }); setMsg('✅ Everyone marked ' + st + (OFF[st] ? '' : ' — clock them out later')); }
  function allOut() { var t = nowHm(), n = 0; kids.forEach(function (p) { var sv = att[p.id]; if (sv && !OFF[sv.status] && !sv.end) { write(p, sv.status, sv.start || t, t, true); n++; } }); setMsg(n ? '✅ Clocked out ' + n + ' at ' + t : 'Nobody is clocked in.'); }
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 8, fontSize: 15 };
  var STAT = [['present', '✅ Present', '#4CAF82'], ['late', '⏰ Late', '#FFB74D'], ['absent', '❌ Absent', '#EF5350'], ['excused', '📝 Excused', '#90CAF9'], ['holiday', '🏖 Holiday / Vacation (excused)', '#BA68C8']];
  var pill = function (bg, fg, fn, t) { return h('button', { onClick: fn, style: { background: bg, color: fg, border: 'none', borderRadius: 16, padding: '10px 13px', fontWeight: 900, fontSize: 13, cursor: 'pointer' } }, t); };
  return h('div', { style: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: 14, marginBottom: 14 } },
    h('div', { style: { fontSize: 18, fontWeight: 900, color: '#fff' } }, '🍎 Take attendance'),
    h('div', { style: { fontSize: 12, color: '#c8c8d8', margin: '2px 0 10px', lineHeight: 1.5 } }, 'Tap a status and it saves right away — no Save button. Present/Late clocks them in now and keeps them clocked in. When school ends tap Clock out (or Clock everyone out). Holiday/Vacation, Absent and Excused have no times.'),
    h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 } },
      h('input', { type: 'date', value: date, onChange: function (e) { setDate(e.target.value); setF({}); setMsg(''); }, style: inp }),
      pill('#4CAF82', '#000', function () { everyone('present'); }, '✅ Everyone present'),
      pill('#BA68C8', '#000', function () { everyone('holiday'); }, '🏖 Everyone: Holiday'),
      pill('#90CAF9', '#000', allOut, '🚪 Clock everyone out')),
    msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 10, padding: 8, fontWeight: 800, marginBottom: 8, fontSize: 13 } }, msg),
    kids.map(function (p) {
      var saved = att[p.id], st = saved ? saved.status : '', isIn = saved && !OFF[st];
      return h('div', { key: p.id, style: { padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.1)' } },
        h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, p.emoji + ' ' + p.name, saved && h('span', { style: { fontSize: 11, color: isIn && !saved.end ? '#7be3ae' : '#81C784', fontWeight: 700, marginLeft: 8 } }, st + (saved.start ? ' · in ' + saved.start : '') + (isIn ? (saved.end ? ' · out ' + saved.end : ' · 🟢 still clocked in') : ''))),
        h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 } }, STAT.map(function (s) { var on = st === s[0]; return h('button', { key: s[0], onClick: function () { setStatus(p, s[0]); }, style: { padding: '9px 12px', borderRadius: 16, border: '2px solid ' + (on ? s[2] : 'rgba(255,255,255,.2)'), background: on ? s[2] + '33' : 'transparent', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, s[1]); })),
        isIn && h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', color: '#c8c8d8', fontSize: 13, marginBottom: 6 } },
          'In', h('input', { type: 'time', value: val(p.id, 'start', saved.start || ''), onChange: function (e) { setV(p.id, 'start', e.target.value); }, style: inp }),
          'Out', h('input', { type: 'time', value: val(p.id, 'end', saved.end || ''), onChange: function (e) { setV(p.id, 'end', e.target.value); }, style: inp }),
          pill('#FFD54F', '#000', function () { saveTimes(p); }, 'Save times'),
          !saved.end && pill('#90CAF9', '#000', function () { clockOut(p); }, '🚪 Clock out'),
          saved.end && pill('rgba(255,255,255,.15)', '#fff', function () { clearOut(p); }, '↩ Clocked out by mistake')),
        h('input', { type: 'text', placeholder: 'Note (optional — saves when you tap a status)', value: val(p.id, 'note', ''), onChange: function (e) { setV(p.id, 'note', e.target.value); }, style: Object.assign({}, inp, { width: '100%', boxSizing: 'border-box' }) }));
    }),
    kids.length === 0 && h('div', { style: { color: '#888' } }, 'No students found.'));
}

// ── Assignment grades: type them in, or paste from Google Classroom ──
function AssignmentGrades(props) {
  var h = React.createElement, isAdmin = !!props.isAdmin, me = props.personId, fam = (props.family || []).filter(function (p) { return !p.deleted && p.role === 'child'; });
  var gS = ktUse('grades', {}), grades = gS[0] || {}, fS = React.useState({ pid: (fam[0] || {}).id, date: tcIso(new Date()) }), f = fS[0], setFm = fS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1], pS = React.useState(''), paste = pS[0], setPaste = pS[1], oS = React.useState(false), imp = oS[0], setImp = oS[1];
  function set(k, v) { setFm(function (o) { var n = Object.assign({}, o); n[k] = v; return n; }); }
  function add(pid, rec) { var id = 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 4); try { syncSet('grades/' + pid + '/' + id, Object.assign({ id: id }, rec)); } catch (e) {} return id; }
  function save() {
    var sc = parseFloat(f.score), out = parseFloat(f.out || 100); if (!f.pid || !(f.name || '').trim() || isNaN(sc) || !(out > 0)) { setMsg('Pick a student, name the assignment, and enter the score.'); return; }
    add(f.pid, { name: f.name.trim(), subject: f.subject || '', score: sc, out: out, date: f.date, note: f.note || '', src: 'manual' });
    setFm(function (o) { return { pid: o.pid, date: o.date, subject: o.subject }; }); setMsg('✅ Grade saved.');
    try { if (props.addNotif) props.addNotif('info', f.pid, '📒 New grade: ' + f.name.trim(), sc + '/' + out + ' (' + tcLetter(sc / out * 100) + ')', { requiresApproval: false }); } catch (e) {}
  }
  function doImport() {
    var n = 0, miss = 0;
    String(paste).split('\n').forEach(function (line) {
      line = line.trim(); if (!line) return; var c = line.split(/\t|,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(function (x) { return x.trim().replace(/^"|"$/g, ''); }); if (c.length < 3) { miss++; return; }
      var kid = fam.find(function (p) { var nm = c[0].toLowerCase(); return nm === p.name.toLowerCase() || nm.split(' ')[0] === p.name.toLowerCase() || (p.full || '').toLowerCase() === nm; });
      var sc = parseFloat(c[2]), out = parseFloat(c[3] || 100); if (!kid || isNaN(sc)) { miss++; return; }
      add(kid.id, { name: c[1], subject: '', score: sc, out: out > 0 ? out : 100, date: tcIso(new Date()), note: 'Pasted from Google Classroom', src: 'classroom' }); n++;
    });
    setMsg('✅ Imported ' + n + ' grade' + (n === 1 ? '' : 's') + (miss ? ' · ' + miss + ' line(s) skipped (name not found or no score)' : '')); if (n) { setPaste(''); setImp(false); }
  }
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 9, fontSize: 15, boxSizing: 'border-box' };
  var shown = isAdmin ? fam : fam.filter(function (p) { return p.id === me; });
  return h('div', { style: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: 14, marginBottom: 14 } },
    h('div', { style: { fontSize: 18, fontWeight: 900, color: '#fff' } }, '📝 Assignment grades'),
    isAdmin && h('div', null,
      h('div', { style: { fontSize: 12, color: '#c8c8d8', margin: '2px 0 10px', lineHeight: 1.5 } }, 'Type in a grade after you check their work. The app turns it into a percent and a letter and keeps a running average for each child.'),
      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 } },
        h('select', { value: f.pid || '', onChange: function (e) { set('pid', e.target.value); }, style: inp }, fam.map(function (p) { return h('option', { key: p.id, value: p.id, style: { color: '#000' } }, p.emoji + ' ' + p.name); })),
        h('input', { placeholder: 'Assignment', value: f.name || '', onChange: function (e) { set('name', e.target.value); }, style: Object.assign({}, inp, { flex: 1, minWidth: 150 }) }),
        h('input', { placeholder: 'Subject', value: f.subject || '', onChange: function (e) { set('subject', e.target.value); }, style: Object.assign({}, inp, { width: 110 }) })),
      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 } },
        h('input', { type: 'number', placeholder: 'Score', value: f.score || '', onChange: function (e) { set('score', e.target.value); }, style: Object.assign({}, inp, { width: 90 }) }), '/',
        h('input', { type: 'number', placeholder: '100', value: f.out || '', onChange: function (e) { set('out', e.target.value); }, style: Object.assign({}, inp, { width: 90 }) }),
        h('input', { type: 'date', value: f.date || '', onChange: function (e) { set('date', e.target.value); }, style: inp }),
        f.score && h('b', { style: { color: tcLetterColor(tcLetter(parseFloat(f.score) / (parseFloat(f.out) || 100) * 100)), fontSize: 18 } }, Math.round(parseFloat(f.score) / (parseFloat(f.out) || 100) * 100) + '% ' + tcLetter(parseFloat(f.score) / (parseFloat(f.out) || 100) * 100))),
      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 } },
        h('input', { placeholder: 'Comment for the student (optional)', value: f.note || '', onChange: function (e) { set('note', e.target.value); }, style: Object.assign({}, inp, { flex: 1, minWidth: 160 }) }),
        h('button', { onClick: save, style: { background: '#FFD54F', color: '#000', border: 'none', borderRadius: 16, padding: '11px 18px', fontWeight: 900, cursor: 'pointer' } }, 'Save grade')),
      h('button', { onClick: function () { setImp(!imp); }, style: { background: 'rgba(66,133,244,.2)', color: '#90CAF9', border: '1px solid rgba(66,133,244,.5)', borderRadius: 14, padding: '9px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer', marginBottom: 8 } }, '📥 Paste grades from Google Classroom ' + (imp ? '▾' : '▸')),
      imp && h('div', { style: { marginBottom: 10 } },
        h('div', { style: { fontSize: 12, color: '#c8c8d8', lineHeight: 1.6, marginBottom: 6 } }, 'The app cannot log into Google Classroom for you. In Classroom open the assignment → Student work, or the Grades page, and copy the names and scores. Paste one line per grade, like:  Ryan, Chapter 3 quiz, 18, 20  (student, assignment, score, out of — the “out of” defaults to 100).'),
        h('textarea', { rows: 6, value: paste, onChange: function (e) { setPaste(e.target.value); }, placeholder: 'Ryan, Chapter 3 quiz, 18, 20\nKayla, Book report, 92', style: Object.assign({}, inp, { width: '100%', fontFamily: 'inherit', fontSize: 13 }) }),
        h('button', { onClick: doImport, style: { background: '#4285F4', color: '#fff', border: 'none', borderRadius: 14, padding: '10px 16px', fontWeight: 800, cursor: 'pointer', marginTop: 6 } }, 'Import these lines'))),
    msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 10, padding: 8, fontWeight: 800, margin: '6px 0', fontSize: 13 } }, msg),
    shown.map(function (p) {
      var list = Object.values(grades[p.id] || {}).filter(Boolean).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      var tot = list.reduce(function (n, g) { return n + g.score / g.out * 100; }, 0), avg = list.length ? tot / list.length : null;
      return h('div', { key: p.id, style: { padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.1)' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', flex: 1 } }, p.emoji + ' ' + p.name), avg != null ? h('div', { style: { fontSize: 20, fontWeight: 900, color: tcLetterColor(tcLetter(avg)) } }, Math.round(avg) + '% ' + tcLetter(avg)) : h('div', { style: { color: '#888', fontSize: 12 } }, 'no grades yet')),
        list.slice(0, 12).map(function (g) { var pc = g.score / g.out * 100; return h('div', { key: g.id, style: { display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#ddd', padding: '4px 0' } },
          h('div', { style: { flex: 1 } }, g.name + (g.subject ? ' · ' + g.subject : '') + ' ', h('span', { style: { color: '#888', fontSize: 11 } }, g.date), g.note && h('div', { style: { fontSize: 11, color: '#b8b8c8' } }, g.note)),
          h('b', { style: { color: tcLetterColor(tcLetter(pc)) } }, g.score + '/' + g.out + ' ' + tcLetter(pc)),
          isAdmin && h('button', { onClick: function () { try { syncSet('grades/' + p.id + '/' + g.id, null); } catch (e) {} }, style: { background: 'rgba(239,83,80,.2)', color: '#FF8A80', border: 'none', borderRadius: 10, padding: '7px 10px', cursor: 'pointer' } }, '🗑')); }));
    }));
}


// ── Who gets which notification: Laurel (owner) gets everything; other parents only what is addressed to them or what they opt in to ──
var NC_TYPES = [['safety', '🚗 Ride / safety requests', true], ['checkin_loc', '📍 Location check-ins', false], ['approval', '✅ Task & work approvals', false], ['pin_reset_request', '🔒 PIN reset requests', false], ['purchase', '🛒 Store purchases & bills paid', false], ['message', '💬 Messages & reminders I send', false], ['other', '🔔 Everything else', false]];
function ncOwner(pid) { return pid === 'laurel'; }
function ncKind(n) { var t = n && n.type; return NC_TYPES.some(function (x) { return x[0] === t; }) ? t : 'other'; }
function ncWants(viewerId, n, cfg) {
  if (!n) return false;
  if (n.type === 'message') return n.personId === viewerId;
  if (n.personId === viewerId || n.personId === 'all') return true;
  if (ncOwner(viewerId)) return true;
  var c = (cfg && cfg.types) || {}, k = ncKind(n), def = (NC_TYPES.filter(function (x) { return x[0] === k; })[0] || [0, 0, false])[2];
  return c[k] != null ? !!c[k] : def;
}
function NotifyRouting(props) {
  var h = React.createElement, cS = ktUse('notify_cfg', null), cfg = cS[0] || {}, oS = React.useState(false), open = oS[0], setOpen = oS[1], lS = React.useState({}), loc = lS[0], setLoc = lS[1];
  var others = (props.family || []).filter(function (p) { return !p.deleted && p.role === 'parent' && !ncOwner(p.id); });
  function set(k, v) { setLoc(function (o) { var n = Object.assign({}, o); n[k] = v; return n; }); var t = Object.assign({}, cfg.types || {}); t[k] = v; try { syncSet('notify_cfg', Object.assign({}, cfg, { types: t })); } catch (e) {} }
  return h('div', { style: { margin: '10px 14px' } },
    h('button', { onClick: function () { setOpen(!open); }, style: { width: '100%', textAlign: 'left', background: 'rgba(255,152,0,.12)', border: '1px solid rgba(255,152,0,.45)', borderRadius: 14, padding: 12, color: '#fff', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, '🔔 Who gets notified ' + (open ? '▾' : '▸')),
    open && h('div', { style: { marginTop: 8, padding: 12, background: 'rgba(255,255,255,.05)', borderRadius: 14 } },
      h('div', { style: { fontSize: 12, color: '#c8c8d8', lineHeight: 1.6, marginBottom: 8 } }, 'You (Laurel) get every alert from the kids. ' + (others.map(function (p) { return p.name; }).join(', ') || 'The other parent') + ' only gets alerts sent to them directly, plus the kinds you tick here.'),
      NC_TYPES.map(function (t) { var on = (loc[t[0]] != null) ? !!loc[t[0]] : ((cfg.types && cfg.types[t[0]] != null) ? !!cfg.types[t[0]] : t[2]); return h('button', { key: t[0], type: 'button', onClick: function () { set(t[0], !on); }, style: { display: 'flex', width: '100%', gap: 12, alignItems: 'center', justifyContent: 'space-between', padding: '14px 12px', marginBottom: 8, borderRadius: 14, border: '2px solid ' + (on ? '#4CAF82' : 'rgba(255,255,255,.2)'), background: on ? 'rgba(76,175,130,.18)' : 'rgba(255,255,255,.05)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', textAlign: 'left' } }, h('span', null, t[1]), h('span', { style: { fontWeight: 900, color: on ? '#4CAF82' : '#999', minWidth: 52, textAlign: 'right' } }, on ? '✅ ON' : 'OFF')); })));
}

// ── Bills start date: reminders two weeks and one week before, with what to expect ──
function stStartDate(cfg) { var s = (cfg && cfg.billsStart) || '2026-11-01', m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(2026, 10, 1); }
function stDaysToStart(cfg) { var t = new Date(); t = new Date(t.getFullYear(), t.getMonth(), t.getDate()); return Math.round((stStartDate(cfg) - t) / 86400000); }
function stStartText(cfg, bills) {
  var tot = (bills || []).reduce(function (n, b) { return n + (+b.cost || 0); }, 0), d = stStartDate(cfg).toLocaleDateString([], { month: 'long', day: 'numeric' });
  return 'Starting ' + d + ' you pay your own household bills with your Bethel Cash, like a grown-up. Bills: ' + (bills || []).map(function (b) { return b.name + ' B$' + b.cost; }).join(', ') + ' (about B$' + tot + ' a month). How it works: 1) Earn Bethel Cash with chores, habits and schoolwork. 2) In the Store & Envelopes tab, put money into each bill\u2019s envelope. 3) Pay each bill by its due day. Late bills turn red and your parents are told. Start filling your envelopes now so you are ready!';
}
function BillsStartNotices(props) {
  var h = React.createElement, cfgS = ktUse('store/cfg', null), cfg = cfgS[0] || {}, biS = ktUse('store/bills', null), sentS = ktUse('store/remsent', {}), sent = sentS[0] || {};
  var bills = (Array.isArray(biS[0]) ? biS[0] : (biS[0] && typeof biS[0] === 'object' ? Object.values(biS[0]) : (typeof ST_DEFAULT_BILLS !== 'undefined' ? ST_DEFAULT_BILLS : []))).filter(Boolean);
  var kids = (props.family || []).filter(function (p) { return !p.deleted && p.role === 'child' && p.inPaySystem !== false; });
  React.useEffect(function () {
    if (!props.addNotif || !kids.length) return;
    var days = stDaysToStart(cfg), key0 = (cfg.billsStart || '2026-11-01');
    [[14, 'two weeks'], [7, 'one week'], [0, 'today']].forEach(function (r) {
      var flag = key0 + '_' + r[0];
      if (days > r[0] || days < r[0] - 3 || sent[flag]) return;
      try { syncSet('store/remsent/' + flag, Date.now()); } catch (e) {}
      var head = r[0] === 0 ? '🏠 Bills start TODAY' : '🏠 Bills start in ' + r[1];
      kids.forEach(function (k) { try { props.addNotif('alert', k.id, head, stStartText(cfg, bills), { requiresApproval: false }); } catch (e) {} });
      try { props.addNotif('message', 'laurel', head + ' — sent to the kids', 'Reminder went to ' + kids.map(function (k) { return k.name; }).join(', ') + '.', { requiresApproval: false }); } catch (e) {}
    });
  });
  return null;
}

// ═══ SCHOOL: Today's plan — what to say, what to teach, who does what, one-tap Google Classroom ═══
var SC_VIEW_FOR = [[/worship/i, 'worship'], [/bible lecture/i, 'teacher'], [/level assign|reconvene|reading|handwrit/i, 'levels'], [/music/i, 'music']];
function scBlockView(label, views) { var hit = null; SC_VIEW_FOR.forEach(function (x) { if (!hit && x[0].test(label || '')) hit = x[1]; }); if (hit && views.indexOf(hit) !== -1) return hit; return null; }
function scOpen(url) { try { window.open(url, '_blank', 'noopener'); } catch (e) { location.href = url; } }
function scGoStudent(setView, pid) { window._dkaFocus = pid; setView('levels'); setTimeout(function () { try { var el = document.getElementById('dka_stu_' + pid); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {} }, 120); }

function TeachingPlan(props) {
  var h = React.createElement, isT = !!props.isTeacher, pid = props.personId, kids = (props.kids || []), views = props.views || [];
  var cS = ktUse('school/classroom', {}), cl = cS[0] || {}, eS = React.useState(false), edit = eS[0], setEdit = eS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1], oS = React.useState({}), open = oS[0], setOpen = oS[1];
  var url = function (id) { return ((cl.kids || {})[id]) || cl.main || 'https://classroom.google.com'; };
  var tasks = props.tasks || {};
  var asS = ktUse('school/assign/' + props.dayNum, {}), assign = asS[0] || {}, lkS = ktUse('school/assignlink/' + props.dayNum, {}), alinks = lkS[0] || {};
  function taskOf(id) { return assign[id] || tasks[id] || ''; }
  function dayLink(id) { return alinks[id] || url(id); }
  function copyTxt(t) { try { navigator.clipboard.writeText(t); say('📋 Copied — paste it into Google Classroom'); } catch (e) { say('Copy is not available on this device'); } }
  function titleOf(k) { return 'Day ' + props.dayNum + ' — ' + props.title + ' — ' + k.name; }
  function bodyOf(k) { return taskOf(k.id) + (props.scripture ? '\n\nScripture: ' + props.scripture : '') + '\n\nWhen you finish, attach your work (photo, document or file) and tap Turn in.'; }
  function goKid(view, act, label) { try { if (typeof tcLink === 'function' && pid) tcLink(pid, act, label, true); } catch (e) {} props.setView(view); }
  function say(t) { setMsg(t); setTimeout(function () { setMsg(''); }, 4000); }
  function sendTo(k) {
    var f = window._addNotifFn; if (typeof f !== 'function') { say('Notifications are not ready.'); return; }
    var text = 'Today: ' + props.title + (props.scripture ? ' (' + props.scripture + ')' : '') + '. YOUR WORK: ' + (taskOf(k.id) || 'See your teacher.') + ' Turn in: ' + dayLink(k.id) + ' Classroom: ' + url(k.id);
    try { f('message', k.id, '📚 Today’s assignment', text, { requiresApproval: false, link: dayLink(k.id) }); } catch (e) {}
    say('✅ Sent to ' + k.name);
  }
  function sendAll() { kids.forEach(sendTo); say('✅ Sent to everyone'); }
  var card = { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 12, marginBottom: 12 };
  var bigBtn = function (bg, fg, fn, t, st) { return h('button', { onClick: fn, style: Object.assign({ background: bg, color: fg, border: 'none', borderRadius: 14, padding: '12px 14px', fontWeight: 800, fontSize: 14, cursor: 'pointer' }, st || {}) }, t); };
  var cue = function (b) {
    var l = b.l || '';
    if (/worship/i.test(l)) return 'SAY: “Let’s begin with Jehovah.” Read today’s Daily Text, sing song #' + (props.songNum || '—') + ', pray, then ask one Dig Deeper question.';
    if (/bible lecture/i.test(l)) return 'TEACH: ' + props.title + (props.scripture ? ' — ' + props.scripture : '') + '. ' + 'Open “Read today’s script” above and read it aloud.';
    if (/level assign/i.test(l)) return 'DO: Give each child their own level of work (tap a name below). 30 minutes, working alone.';
    if (/reconvene/i.test(l)) return 'ASK each child: 1) What did you find? 2) Where did you find it? 3) How will you apply it?';
    if (/reading|handwrit/i.test(l)) return 'DO: 25 minutes of reading and handwriting, every child, every day.';
    if (/independent/i.test(l)) return 'CHECK: Ryan & Kayla in Penn Foster · Ashelyn & Mykah in Khan. Look at Google Classroom for anything assigned.';
    if (/music/i.test(l)) return 'DO: Instrument lesson, chords and rhythm.';
    return b.s || '';
  };
  return h('div', null,
    h('div', { style: Object.assign({}, card, { background: 'linear-gradient(135deg,rgba(156,141,196,.22),rgba(156,141,196,.06))', borderColor: 'rgba(156,141,196,.5)' }) },
      h('div', { style: { fontSize: 11, fontWeight: 900, color: '#C5B8E8', letterSpacing: 1 } }, 'TODAY — DAY ' + props.dayNum + ' OF 180' + (props.unitTitle ? ' · ' + props.unitTitle : '')),
      h('div', { style: { fontSize: 22, fontWeight: 900, color: '#fff', margin: '4px 0' } }, props.title),
      props.scripture && h('div', { style: { fontSize: 15, color: '#E0D7F5' } }, '📖 ' + props.scripture),
      props.songNum > 0 && h('div', { style: { fontSize: 14, color: '#F6BF26', marginTop: 2 } }, '🎵 Song #' + props.songNum),

      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 } },
        isT && views.indexOf('manual') !== -1 && bigBtn('#9C8DC4', '#000', function () { window._manualDay = props.dayNum; props.setView('manual'); }, '📖 Read today\u2019s script'),
        bigBtn('#1A73E8', '#fff', function () { scOpen(url(pid)); }, '🎓 Open Google Classroom'))),
    !isT && h('div', { style: card },
      h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 8 } }, 'Where do you want to go?'),
      h('div', { style: { display: 'grid', gap: 8 } },
        views.indexOf('levels') !== -1 && bigBtn('#4CAF82', '#000', function () { goKid('levels', 'school', 'Assignments'); }, '✍️ Go to my assignment', { fontSize: 17, padding: '16px 14px' }),
        views.indexOf('worship') !== -1 && bigBtn('#9C8DC4', '#000', function () { goKid('worship', 'spiritual', 'Morning worship'); }, '✨ Go to worship', { fontSize: 17, padding: '16px 14px' }),
        views.indexOf('music') !== -1 && bigBtn('#F6BF26', '#000', function () { goKid('music', 'school', 'Music'); }, '🎵 Go to music', { fontSize: 17, padding: '16px 14px' }),
        bigBtn('#1A73E8', '#fff', function () { scOpen(dayLink(pid)); }, '📤 Turn in my work in Google Classroom', { fontSize: 16, padding: '16px 14px' }))),
    isT && props.script && h('div', { style: card }, h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } }, h('div', { style: { flex: 1, fontSize: 16, fontWeight: 900, color: '#fff' } }, '🗣 What to say today'), bigBtn('rgba(255,255,255,.14)', '#fff', function () { setOpen(Object.assign({}, open, { _s: !open._s })); }, open._s ? 'Hide ▾' : 'Show ▸', { padding: '9px 12px', fontSize: 13 })), open._s && h('div', { style: { marginTop: 8 } }, h(ScriptText, { text: props.script, big: false }))),
    msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 10, padding: 8, fontWeight: 800, marginBottom: 10, fontSize: 13 } }, msg),
    h('div', { style: card },
      h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 8 } }, '⏰ The school day, step by step'),
      (props.blocks || []).map(function (b, i) {
        var v = scBlockView(b.l, views), isOpen = open[i];
        return h('div', { key: i, style: { padding: '10px 0', borderTop: i ? '1px solid rgba(255,255,255,.08)' : 'none', borderLeft: '4px solid ' + b.c, paddingLeft: 10 } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            h('div', { style: { fontSize: 12, color: b.c, fontWeight: 800, minWidth: 78 } }, b.t),
            h('div', { style: { flex: 1, fontSize: 15, fontWeight: 800, color: '#fff' } }, b.l),
            h('button', { onClick: function () { var o = Object.assign({}, open); o[i] = !o[i]; setOpen(o); }, style: { background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', borderRadius: 12, padding: '8px 11px', fontSize: 13, cursor: 'pointer' } }, isOpen ? '▾' : (isT ? 'What to say' : 'Details'))),
          isOpen && h('div', { style: { fontSize: 14, color: '#e8e8f0', lineHeight: 1.6, margin: '8px 0 4px', background: 'rgba(0,0,0,.22)', borderRadius: 10, padding: 10 } }, isT ? cue(b) : (b.s || '')),
          h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 } },
            v && bigBtn(b.c, '#000', function () { props.setView(v); }, 'Go to ' + (v === 'worship' ? 'Worship' : v === 'teacher' ? 'the script' : v === 'levels' ? (isT ? 'Assignments' : 'My Work') : 'Music') + ' ›', { padding: '9px 12px', fontSize: 13 }),
            /independent/i.test(b.l) && bigBtn('#1A73E8', '#fff', function () { scOpen(url(pid)); }, '🎓 Google Classroom ›', { padding: '9px 12px', fontSize: 13 })));
      })),
    h('div', { style: card },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' } }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', flex: 1 } }, isT ? '✍️ Today’s assignments — one per student' : '✍️ My assignment today'), isT && kids.length > 1 && bigBtn('#4CAF82', '#000', sendAll, '📨 Send all', { padding: '9px 12px', fontSize: 13 })),
      kids.map(function (k) {
        return h('div', { key: k.id, style: { padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
          h('div', { style: { fontSize: 16, fontWeight: 900, color: k.color || '#fff', marginBottom: 4 } }, (k.emoji || '') + ' ' + k.name),
          h('div', { style: { fontSize: 14, color: '#e8e8f0', lineHeight: 1.6, marginBottom: 8 } }, taskOf(k.id) || 'See your teacher for today’s assignment.'),
          h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
            views.indexOf('levels') !== -1 && bigBtn('rgba(76,175,130,.25)', '#9be5bd', function () { scGoStudent(props.setView, k.id); }, '✍️ ' + (isT ? k.name + '’s leveled work ›' : 'Open my work ›'), { padding: '9px 12px', fontSize: 13 }),
            bigBtn('#1A73E8', '#fff', function () { scOpen(dayLink(k.id)); }, isT ? '🎓 Classroom' : '📤 Turn in my work', { padding: '9px 12px', fontSize: 13 }),
            isT && bigBtn('#FFB74D', '#000', function () { sendTo(k); }, '📨 Send to ' + k.name, { padding: '9px 12px', fontSize: 13 })));
      })),
    isT && h('div', { style: card },
      h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff' } }, '🎓 Google Classroom — Day ' + props.dayNum + ' assignments'),
      h('div', { style: { fontSize: 12, color: '#c8c8d8', lineHeight: 1.6, margin: '4px 0 10px' } }, 'Google does not let this app create Classroom posts for you. So: edit each child’s assignment here, tap Copy, open Classroom, make an Assignment and paste. Then paste that assignment’s web address in “Turn-in link” so the child’s “Turn in my work” button opens exactly that post.'),
      kids.map(function (k) {
        return h('div', { key: k.id, style: { padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.1)' } },
          h('div', { style: { fontSize: 15, fontWeight: 900, color: k.color || '#fff' } }, (k.emoji || '') + ' ' + k.name),
          h('div', { style: { fontSize: 12, color: '#9aa', margin: '2px 0' } }, 'Title: ' + titleOf(k)),
          h('textarea', { key: 'ta' + props.dayNum + k.id, defaultValue: taskOf(k.id), rows: 3, onBlur: function (e) { var v = e.target.value.trim(); try { syncSet('school/assign/' + props.dayNum + '/' + k.id, v && v !== tasks[k.id] ? v : null); } catch (x) {} }, style: { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 14, fontFamily: 'inherit' } }),
          h('input', { key: 'ln' + props.dayNum + k.id, defaultValue: alinks[k.id] || '', placeholder: 'Turn-in link (the Classroom assignment’s address)', onBlur: function (e) { var v = e.target.value.trim(); try { syncSet('school/assignlink/' + props.dayNum + '/' + k.id, v || null); } catch (x) {} }, style: { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 14, margin: '6px 0' } }),
          h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
            bigBtn('rgba(255,255,255,.16)', '#fff', function () { copyTxt(titleOf(k)); }, '📋 Copy title', { padding: '9px 12px', fontSize: 13 }),
            bigBtn('#FFB74D', '#000', function () { copyTxt(bodyOf(k)); }, '📋 Copy instructions', { padding: '9px 12px', fontSize: 13 }),
            bigBtn('#1A73E8', '#fff', function () { scOpen(url(k.id)); }, '🎓 Open Classroom', { padding: '9px 12px', fontSize: 13 })));
      })),
    isT && h('div', { style: card },
      h('button', { onClick: function () { setEdit(!edit); }, style: { background: 'transparent', border: 'none', color: '#90CAF9', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 } }, '🔗 Google Classroom links ' + (edit ? '▾' : '▸')),
      edit && h('div', { style: { marginTop: 8 } },
        h('div', { style: { fontSize: 12, color: '#c8c8d8', lineHeight: 1.6, marginBottom: 8 } }, 'In Google Classroom open your class and copy the address from the top of the browser. Paste it here. You can give each child their own class link, or leave theirs empty to use the main one.'),
        [['main', 'Main class link']].concat(kids.map(function (k) { return [k.id, k.name + '’s link (optional)']; })).map(function (f) {
          var cur = f[0] === 'main' ? cl.main : (cl.kids || {})[f[0]];
          return h('div', { key: f[0], style: { marginBottom: 8 } }, h('div', { style: { fontSize: 12, color: '#b8b8c8' } }, f[1]), h('input', { defaultValue: cur || '', placeholder: 'https://classroom.google.com/c/…', onBlur: function (e) { var v = e.target.value.trim(); try { if (f[0] === 'main') syncSet('school/classroom/main', v || null); else syncSet('school/classroom/kids/' + f[0], v || null); } catch (x) {} }, style: { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 14 } }));
        }),
        h('div', { style: { fontSize: 12, color: '#9a9ab0' } }, 'Google Classroom does not allow this app to read grades automatically. Open Classroom with the button, then type grades in the Grades & Attendance tab or paste them in.'))));
}

// ═══ ADMIN TOP: who is clocked in / in a chore / in an assignment right now, where to find them, adjust time ═══
var FS_LOC = { school: ['school', 'School tab'], spiritual: ['spiritual', 'Spiritual tab'], service: ['spiritual', 'Spiritual tab'], va_work: ['va', 'VA tab'], eric_work: ['work', 'Work tab'], consulting: ['consulting', 'Consulting tab'], el_sales: ['work', 'Work tab'], chores: ['chores', 'Chores tab'], meals: ['menu', 'Menu tab'], animals: ['chores', 'Chores tab'], free: ['clock', 'Clock tab'], fun: ['clock', 'Clock tab'], rest: ['clock', 'Clock tab'], phone: ['clock', 'Clock tab'], driving: ['safety', 'Safety tab'], waiting: ['clock', 'Clock tab'] };
function fsT(ts) { return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
function fsDur(ms) { var m = Math.max(0, Math.round(ms / 60000)); return m >= 60 ? Math.floor(m / 60) + 'h ' + (m % 60) + 'm' : m + 'm'; }
function FamilyStatusTop(props) {
  var h = React.createElement, sessions = props.sessions || {}, onUpdate = props.onUpdate, fam = (props.family || []).filter(function (p) { return !p.deleted && p.id !== 'grandpa' && p.role !== 'elder'; });
  var tS = React.useState(0), setT = tS[1], aS = React.useState(''), adj = aS[0], setAdj = aS[1], rsS = React.useState(''), rst = rsS[0], setRst = rsS[1], vS = React.useState(''), val = vS[0], setVal = vS[1], xS = React.useState(false), openTm = xS[0], setOpenTm = xS[1], cS = React.useState(false), shut = cS[0], setShut = cS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  React.useEffect(function () { var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 20000); return function () { clearInterval(iv); }; }, []);
  var day = typeof rtDay === 'function' ? rtDay() : '', hr = ktUse('habitsrun/' + day, {})[0] || {}, op = ktUse('opsprog', {})[0] || {}, od = ktUse('opsdone', {})[0] || {}, sdAll = ktUse('startday/' + todayKey(), {})[0] || {};
  var contacts = ktUse('contacts', {})[0] || {};
  var now = Date.now(), actName = function (id) { var a = (typeof CLOCK_ACTS !== 'undefined' ? CLOCK_ACTS : []).filter(function (x) { return x.id === id; })[0]; return a ? a.label : id; };
  var PER = { morning: 'Morning routine', afternoon: 'Afternoon routine', evening: 'Evening routine' };
  function go(tab) { if (props.setTab) props.setTab(tab); else if (window._dashSetTab) window._dashSetTab(tab); try { window.scrollTo(0, 0); } catch (e) {} }
  function rows(p) {
    var d = sessions[p.id] || {}, on = [], list = [d.current].concat(d.others || []).filter(Boolean);
    list.forEach(function (r) { var loc = FS_LOC[r.activity] || ['clock', 'Clock tab']; on.push({ k: 'c' + r.activity, icon: '⏱', what: actName(r.activity) + (r.activity === 'school' ? ' (assignment / lessons)' : r.activity === 'chores' ? ' (chore)' : ''), since: r.startTime, tab: loc[0], where: loc[1] + (r.with ? ' · with ' + r.with : '') }); });
    var runs = hr[p.id] || {}; Object.keys(runs).forEach(function (per) { if (now - runs[per] < 90 * 60000) on.push({ k: 'h' + per, icon: '✅', what: PER[per] || 'Routine', since: runs[per], tab: 'chores', where: 'Chores tab → habits' }); });
    Object.keys(op).forEach(function (id) { var o = op[id]; if (!o || o.by !== p.id) return; var dn = od[id]; if (dn && dn.period === o.period) return; if (now - o.start > 5 * 3600000) return; on.push({ k: 'o' + id, icon: '🧹', what: 'Chore: ' + (o.label || id.replace(/_/g, ' ')), since: o.start, tab: 'chores', where: 'Chores tab → Order of operations' }); });
    var sd = sdAll[p.id]; if (sd && sd.dayStart && !sd.readyAt && !sd.dayEnd && now - sd.dayStart < 60 * 60000) on.push({ k: 'g', icon: '🚿', what: 'Getting ready', since: sd.dayStart, tab: 'start', where: 'Start My Day' });
    return on;
  }
  function lastOut(p) { var t = ((sessions[p.id] || {}).today || []).slice().sort(function (a, b) { return (b.endTime || 0) - (a.endTime || 0); })[0]; if (!t) return null; var loc = FS_LOC[t.activity] || ['clock', 'Clock tab']; return { what: actName(t.activity), start: t.startTime, end: t.endTime || (t.startTime + (t.duration || 0) * 60000), tab: loc[0], where: loc[1] }; }
  function setStartedAgo(p, mins) {
    var d = sessions[p.id] || {}; if (!d.current || !(mins >= 0)) return;
    var cur = Object.assign({}, d.current, { startTime: Date.now() - mins * 60000, adjustedBy: window._currentPersonId || 'parent' });
    if (typeof clockSave === 'function') clockSave(p.id, sessions, onUpdate, cur, d.others || [], d.today || []);
    setAdj(''); setVal(''); setMsg('✅ ' + p.name + '’s timer is now at ' + mins + ' min');
  }
  function clockOut(p) {
    var d = sessions[p.id] || {}; if (typeof clockActiveList !== 'function' || typeof clockSave !== 'function') return;
    var act = clockActiveList(d), today = (d.today || []).concat(act.map(function (a) { return clockClose(a); }));
    clockSave(p.id, sessions, onUpdate, null, [], today); setMsg('⏹ Clocked ' + p.name + ' out');
  }
  function resetDay(p) {
    if (rst !== p.id) { setRst(p.id); setTimeout(function () { setRst(''); }, 4000); return; }
    setRst('');
    try { if (typeof clockSave === 'function') clockSave(p.id, sessions, onUpdate, null, [], []); } catch (e) {}
    var iso = tcIso(new Date());
    try { syncSet('attendance/' + iso + '/' + p.id, null); syncSet('startday/' + todayKey() + '/' + p.id, null); syncSet('habitsrun/' + day + '/' + p.id, null); } catch (e) {}
    setMsg('↺ ' + p.name + '’s day was reset (time, attendance and start-of-day)');
  }
  var anyOn = 0, rowEls = fam.map(function (p) {
    var on = rows(p), lo = on.length ? null : lastOut(p), hasData = on.length || lo;
    if (on.length) anyOn++;
    return h('div', { key: p.id, style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
        !props.bare && h('span', { style: { fontSize: 20 } }, p.emoji || '🙂'),
        props.bare ? h('span', { style: { flex: 1 } }) : h('b', { style: { color: '#fff', fontSize: 15, flex: 1 } }, p.name),
        window._msgTo && h('button', { onClick: function () { window._msgTo(p.id); }, style: { background: '#1A73E8', color: '#fff', border: 'none', borderRadius: 14, padding: '7px 11px', fontSize: 14, cursor: 'pointer' } }, '💬'),
        window._addNotifFn && h('button', { onClick: function () { window._addNotifFn('page', p.id, '📣 ' + ((window._loginPersonId || 'Laurel').charAt(0).toUpperCase() + (window._loginPersonId || 'laurel').slice(1)) + ' needs you', 'Please check in right now.', { urgent: true }); }, style: { background: '#EF5350', color: '#fff', border: 'none', borderRadius: 14, padding: '7px 11px', fontSize: 13, fontWeight: 800, cursor: 'pointer' } }, '📣 Page'),
        (contacts[p.id] || {}).phone && h('a', { href: 'tel:' + contacts[p.id].phone, style: { background: '#4CAF82', color: '#000', borderRadius: 14, padding: '7px 11px', fontSize: 14, textDecoration: 'none' } }, '📞'),
        (contacts[p.id] || {}).phone && h('a', { href: 'sms:' + contacts[p.id].phone, style: { background: '#039BE5', color: '#fff', borderRadius: 14, padding: '7px 11px', fontSize: 14, textDecoration: 'none' } }, '📱'),
        (contacts[p.id] || {}).email && h('a', { href: 'mailto:' + contacts[p.id].email, style: { background: '#FFB74D', color: '#000', borderRadius: 14, padding: '7px 11px', fontSize: 14, textDecoration: 'none' } }, '✉️'),
        h('span', { style: { fontSize: 12, fontWeight: 900, padding: '4px 10px', borderRadius: 12, background: on.length ? 'rgba(76,175,130,.25)' : 'rgba(255,255,255,.08)', color: on.length ? '#7be3ae' : '#aaa' } }, on.length ? '🟢 CLOCKED IN' : lo ? '⚪ Clocked out — not clocked into anything' : '⚫ Not clocked in')),
      on.map(function (r) {
        return h('div', { key: r.k, style: { display: 'flex', alignItems: 'center', gap: 8, margin: '5px 0 0 28px', flexWrap: 'wrap' } },
          h('div', { style: { flex: 1, minWidth: 150 } }, h('div', { style: { fontSize: 14, color: '#fff', fontWeight: 700 } }, r.icon + ' ' + r.what), h('div', { style: { fontSize: 12, color: '#b8c0d0' } }, 'since ' + fsT(r.since) + ' (' + fsDur(now - r.since) + ') · find them: ' + r.where)),
          h('button', { onClick: function () { go(r.tab); }, style: { background: 'rgba(255,255,255,.14)', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 12px', fontSize: 13, fontWeight: 800, cursor: 'pointer' } }, 'Go ›'));
      }),
      lo && h('div', { style: { margin: '4px 0 0 28px', fontSize: 13, color: '#b8c0d0' } }, 'Last: ' + lo.what + ' ' + fsT(lo.start) + '–' + fsT(lo.end) + ' (' + fsDur(lo.end - lo.start) + ') · was at: ' + lo.where, ' ', h('button', { onClick: function () { go(lo.tab); }, style: { background: 'transparent', color: '#90CAF9', border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, 'Go ›')),
      h('div', { style: { margin: '6px 0 0 28px' } }, typeof TimerEditor === 'function' && h(TimerEditor, { personId: p.id, sessions: sessions, onUpdate: onUpdate }), h('div', { style: { height: 6 } }), h('button', { onClick: function () { resetDay(p); }, style: { background: rst === p.id ? '#EF5350' : 'rgba(255,255,255,.08)', color: rst === p.id ? '#fff' : '#b8c0d0', border: 'none', borderRadius: 12, padding: '8px 11px', fontSize: 12, fontWeight: 800, cursor: 'pointer' } }, rst === p.id ? 'Tap again to reset ' + p.name + '’s day' : '↺ Reset day')),
      (sessions[p.id] && sessions[p.id].current) && h('div', { style: { margin: '6px 0 0 28px', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' } },
        adj === p.id ? [h('span', { key: 'l', style: { fontSize: 12, color: '#ddd' } }, 'Timer should show'), h('input', { key: 'i', type: 'number', inputMode: 'numeric', value: val, onChange: function (e) { setVal(e.target.value); }, placeholder: 'min', style: { width: 70, background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, color: '#fff', padding: 9, fontSize: 15 } }), h('span', { key: 'm', style: { fontSize: 12, color: '#ddd' } }, 'minutes'), h('button', { key: 's', onClick: function () { setStartedAgo(p, parseFloat(val)); }, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 12, padding: '9px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, 'Set'), h('button', { key: 'x', onClick: function () { setAdj(''); }, style: { background: 'rgba(255,255,255,.12)', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 12px', fontSize: 13, cursor: 'pointer' } }, 'Cancel')]
          : [h('button', { key: 'a', onClick: function () { setAdj(p.id); setVal(''); }, style: { background: '#FFB74D', color: '#000', border: 'none', borderRadius: 12, padding: '9px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, '⏱ Adjust time'), h('button', { key: 'o', onClick: function () { clockOut(p); }, style: { background: 'rgba(239,83,80,.25)', color: '#FF8A80', border: 'none', borderRadius: 12, padding: '9px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, '⏹ Clock out')]));
  });
  if (props.bare) return h('div', { style: { marginTop: 6 } }, msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 10, padding: 7, fontWeight: 800, fontSize: 13, margin: '4px 0' } }, msg), rowEls);
  return h('div', { style: { background: 'rgba(8,12,24,.96)', borderBottom: '2px solid rgba(76,175,130,.5)', padding: '8px 12px', flexShrink: 0 } },
    h('button', { onClick: function () { setShut(!shut); }, style: { width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px 0', textAlign: 'left' } }, h('span', { style: { fontSize: 15, fontWeight: 900, flex: 1 } }, '👀 Family clock status'), h('span', { style: { fontSize: 12, color: '#7be3ae', fontWeight: 800 } }, anyOn + ' clocked in ' + (shut ? '▸' : '▾'))),
    msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 10, padding: 7, fontWeight: 800, fontSize: 13, margin: '4px 0' } }, msg),
    !shut && rowEls,
    h('button', { onClick: function () { setOpenTm(!openTm); }, style: { width: '100%', textAlign: 'left', marginTop: 8, background: 'rgba(192,202,51,.12)', border: '1px solid rgba(192,202,51,.4)', borderRadius: 12, padding: 11, color: '#E6EE9C', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, '⏱ Admin time management ' + (openTm ? '▾' : '▸')),
    openTm && typeof AdminTimeEditor === 'function' && h(AdminTimeEditor, { sessions: sessions, family: props.family, onUpdate: onUpdate, syncSet: syncSet }));
}

// ═══ TEACHER MANUAL: every day's read-aloud script, big readable type ═══
function scScriptFor(day, fallback) { return (typeof DKA_SCRIPTS !== 'undefined' && DKA_SCRIPTS[day]) || fallback || ''; }
function ScriptText(props) {
  var h = React.createElement, big = !!props.big, fs = big ? 18 : 13, lines = String(props.text || '').split('\n');
  var SEC = /^(🎣|🌱|❓|✅|📖|🎵|🙏|⭐|📝|🔑|🏠|💬)/, LAB = /(SAY:|TEACH:|ASK:|DO:|READ:|NOTE:|Hook:|Teach:|Music:|Worship Dig Deeper:|After School:)/;
  return h('div', { style: { color: '#f2f2f8', lineHeight: 1.75, fontSize: fs } }, lines.map(function (ln, i) {
    var t = ln.trim(); if (!t) return h('div', { key: i, style: { height: 6 } });
    if (SEC.test(t) || (t.length < 48 && t === t.toUpperCase() && /[A-Z]{3}/.test(t))) return h('div', { key: i, style: { marginTop: 14, padding: '8px 10px', borderRadius: 10, background: 'rgba(156,141,196,.22)', color: '#E0D7F5', fontWeight: 900, fontSize: fs - 1, letterSpacing: .5 } }, t);
    if (/^\[.*\]$/.test(t)) return h('div', { key: i, style: { color: '#FFD54F', fontStyle: 'italic', margin: '4px 0' } }, t);
    var parts = t.split(LAB);
    return h('div', { key: i, style: { margin: '5px 0' } }, parts.map(function (p, j) { if (LAB.test(p) && j % 2 === 1) return h('span', { key: j, style: { display: 'inline-block', background: /^SAY|^ASK/i.test(p) ? '#4CAF82' : '#9C8DC4', color: '#000', fontWeight: 900, fontSize: fs - 4, borderRadius: 8, padding: '1px 8px', marginRight: 6 } }, p.replace(':', '')); return h('span', { key: j, style: /^[“"]/.test(p.trim()) || /SAY/.test(parts[j - 1] || '') ? { color: '#fff', fontWeight: 600 } : null }, p); }));
  }));
}
function TeacherManual(props) {
  var h = React.createElement, cur = (typeof DKA_CURRICULUM !== 'undefined') ? DKA_CURRICULUM : [], units = (typeof DKA_UNITS !== 'undefined') ? DKA_UNITS : {};
  var dS = React.useState(window._manualDay || props.dayNum || 1), day = dS[0], setDay = dS[1], bS = React.useState(true), big = bS[0], setBig = bS[1], uS = React.useState(false), listOpen = uS[0], setListOpen = uS[1];
  var e = cur[day - 1] || [], unit = e[1] || 0, have = typeof DKA_SCRIPTS !== 'undefined' && DKA_SCRIPTS[day];
  var text = scScriptFor(day, e[7]);
  function go(n) { n = Math.max(1, Math.min(180, n)); window._manualDay = n; setDay(n); try { window.scrollTo(0, 0); } catch (x) {} }
  var btn = function (bg, fg, fn, t) { return h('button', { onClick: fn, style: { background: bg, color: fg, border: 'none', borderRadius: 14, padding: '12px 14px', fontWeight: 800, fontSize: 15, cursor: 'pointer' } }, t); };
  return h('div', null,
    h('div', { style: { background: 'linear-gradient(135deg,rgba(156,141,196,.25),rgba(156,141,196,.06))', border: '1px solid rgba(156,141,196,.5)', borderRadius: 14, padding: 12, marginBottom: 10 } },
      h('div', { style: { fontSize: 12, fontWeight: 900, color: '#C5B8E8', letterSpacing: 1 } }, '📖 TEACHER MANUAL · DAY ' + day + ' OF 180 · WEEK ' + Math.ceil(day / 5) + (units[unit] ? ' · UNIT ' + unit + ': ' + units[unit] : '')),
      h('div', { style: { fontSize: 22, fontWeight: 900, color: '#fff', margin: '4px 0' } }, e[3] || ('Day ' + day)),
      e[4] && e[4] !== 'See 180-day document' && h('div', { style: { fontSize: 15, color: '#E0D7F5' } }, '📖 ' + e[4]),
      e[5] > 0 && h('div', { style: { fontSize: 14, color: '#F6BF26' } }, '🎵 Song #' + e[5] + ' — play it first'),
      h('div', { style: { fontSize: 13, color: '#c8c8d8', marginTop: 6 } }, 'Read straight from this page. Anything in a green SAY tag is what you say out loud. Yellow [brackets] are things you do.')),
    h('div', { style: { display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' } }, btn('rgba(255,255,255,.14)', '#fff', function () { go(day - 1); }, '‹ Previous'), btn('#9C8DC4', '#000', function () { go(day + 1); }, 'Next day ›'), btn('rgba(255,255,255,.14)', '#fff', function () { if (props.today) go(props.today); }, 'Today'), btn('rgba(255,255,255,.14)', '#fff', function () { setBig(!big); }, big ? 'A− smaller' : 'A+ bigger'), btn('rgba(255,255,255,.14)', '#fff', function () { setListOpen(!listOpen); }, '📚 All days ' + (listOpen ? '▾' : '▸'))),
    listOpen && h('div', { style: { background: 'rgba(255,255,255,.05)', borderRadius: 14, padding: 10, marginBottom: 10, maxHeight: 360, overflowY: 'auto' } }, Object.keys(units).map(function (u) {
      return h('div', { key: u, style: { marginBottom: 8 } }, h('div', { style: { fontSize: 13, fontWeight: 900, color: '#C5B8E8', marginBottom: 4 } }, 'UNIT ' + u + ' — ' + units[u]),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } }, cur.filter(function (x) { return x[1] == u; }).map(function (x) { return h('button', { key: x[0], onClick: function () { go(x[0]); setListOpen(false); }, title: x[3], style: { minWidth: 44, padding: '9px 6px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13, background: x[0] === day ? '#9C8DC4' : (typeof DKA_SCRIPTS !== 'undefined' && DKA_SCRIPTS[x[0]] ? 'rgba(76,175,130,.25)' : 'rgba(255,255,255,.1)'), color: x[0] === day ? '#000' : '#fff' } }, x[0]); })));
    })),
    !have && h('div', { style: { background: 'rgba(255,152,0,.15)', border: '1px solid rgba(255,152,0,.5)', borderRadius: 12, padding: 10, marginBottom: 10, fontSize: 13, color: '#FFE0B2', lineHeight: 1.5 } }, 'This day is not written out in your Teacher Lectures document yet, so you are seeing the app’s general outline. Ask me and I can write a full word-for-word script for it.'),
    h('div', { style: { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 14 } }, h(ScriptText, { text: text, big: big })),
    h('div', { style: { display: 'flex', gap: 8, marginTop: 12 } }, btn('rgba(255,255,255,.14)', '#fff', function () { go(day - 1); }, '‹ Previous'), btn('#9C8DC4', '#000', function () { go(day + 1); }, 'Next day ›')));
}
