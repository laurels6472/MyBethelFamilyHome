// ═══ MY BETHEL JOB — the family runs like a small business. Work earns points, points pile up during the pay
// period, and at payday a paycheck is made. Laurel approves the paycheck, then it lands in the child's account.
// No work, no points, no pay. ═══
var PR_FREQ = [['daily', 'Daily'], ['weekly', 'Weekly'], ['biweekly', 'Every 2 weeks'], ['monthly', 'Monthly']];
var prZ = function (n) { return (n < 10 ? '0' : '') + n; };
function prDayKey(ts) { var d = new Date(ts); return d.getFullYear() + '-' + prZ(d.getMonth() + 1) + '-' + prZ(d.getDate()); }
function prCfg() { var c = null; try { c = syncGet('payroll_cfg'); } catch (e) {} c = c || {}; return { enabled: c.enabled !== false, people: c.people || {}, anchor: c.anchor || '2026-10-05' }; }
function prPerson(pid) { var p = (prCfg().people || {})[pid] || {}; return { freq: p.freq || 'weekly', auto: !!p.auto }; }
function prFmt(raw) { raw = +raw || 0; return (window._payMode || 'pay') === 'points' ? (Math.round(raw * 100) / 100) + ' pts' : 'B$' + raw.toFixed(2); }
function prIsEmployee(pid) { try { var fam = window._payrollFamily || []; var p = fam.filter(function (x) { return x.id === pid; })[0]; return !!p && p.role === 'child' && p.inPaySystem !== false; } catch (e) { return false; } }
window._payrollOn = function (pid) { return prCfg().enabled && prIsEmployee(pid); };
window._payrollLog = function (pid, raw, reason, key) {
  var ts = Date.now(), id = String(key || 'e').replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40) + '_' + ts.toString(36) + Math.floor(Math.random() * 99);
  try { syncSet('earnings/' + prDayKey(ts) + '/' + pid + '/' + id, { raw: raw, reason: reason || '', ts: ts, key: key || '' }); } catch (e) {}
  return true;
};
function prEntries(earn, pid) {
  var out = []; Object.keys(earn || {}).forEach(function (day) { var m = ((earn[day] || {})[pid]) || {}; Object.keys(m).forEach(function (id) { var e = m[id]; if (e && e.ts != null) out.push({ id: id, day: day, ts: e.ts, raw: +e.raw || 0, reason: e.reason || '' }); }); });
  return out.sort(function (a, b) { return a.ts - b.ts; });
}
function prPeriod(ts, freq, anchor) {
  var d = new Date(ts); d.setHours(0, 0, 0, 0); var s = new Date(d), e;
  if (freq === 'daily') { e = new Date(s); e.setDate(e.getDate() + 1); }
  else if (freq === 'weekly') { s.setDate(s.getDate() - ((s.getDay() + 6) % 7)); e = new Date(s); e.setDate(e.getDate() + 7); }
  else if (freq === 'biweekly') { var a = new Date((anchor || '2026-10-05') + 'T00:00:00'); var k = Math.floor(Math.round((s - a) / 86400000) / 14); s = new Date(a); s.setDate(a.getDate() + k * 14); e = new Date(s); e.setDate(e.getDate() + 14); }
  else { s = new Date(s.getFullYear(), s.getMonth(), 1); e = new Date(s.getFullYear(), s.getMonth() + 1, 1); }
  var f = function (t) { return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
  var last = e.getTime() - 86400000;
  return { start: s.getTime(), end: e.getTime() - 1, endExcl: e.getTime(), id: freq + '_' + prDayKey(s.getTime()), label: freq === 'daily' ? new Date(s.getTime()).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : f(s.getTime()) + ' – ' + f(last) };
}
function prState(pid) { var s = null; try { s = syncGet('payroll_state/' + pid); } catch (e) {} return s || {}; }
function prMakeCheck(p, per, items, auto, by) {
  var total = Math.round(items.reduce(function (n, x) { return n + x.raw; }, 0) * 100) / 100;
  if (!(total > 0)) return null;
  var id = per.id, n = 1; try { while (syncGet('paychecks/' + p.id + '/' + id)) { n++; id = per.id + '_' + n; } } catch (e) {}
  var lines = items.slice(-80).map(function (x) { return { r: x.reason, raw: x.raw, ts: x.ts }; });
  var pc = { id: id, pid: p.id, name: p.name, label: per.label, from: per.start, to: per.end, raw: total, count: items.length, freq: per.freq || '', status: 'pending', created: Date.now(), lines: lines };
  try { syncSet('paychecks/' + p.id + '/' + id, pc); } catch (e) {}
  try { if (window._addNotifFn) window._addNotifFn('paycheck', 'laurel', '💼 Paycheck ready: ' + p.name, p.name + ' earned ' + prFmt(total) + ' for ' + per.label + '. Open the Payroll box to pay it.', { paycheckId: id, paycheckPid: p.id }); } catch (e) {}
  return pc;
}
function prPay(pc, by) {
  var cur = null; try { cur = syncGet('paychecks/' + pc.pid + '/' + pc.id); } catch (e) {}
  if (cur && cur.status === 'paid') return false;
  try { syncSet('paychecks/' + pc.pid + '/' + pc.id, Object.assign({}, cur || pc, { status: 'paid', paidAt: Date.now(), by: by || 'laurel' })); } catch (e) {}
  if (typeof window._walletCredit === 'function') { try { window._walletCredit(pc.pid, pc.raw, '💼 Paycheck: ' + pc.label, 'pay_' + pc.id); } catch (e) {} }
  try { if (window._addNotifFn) window._addNotifFn('paycheck', pc.pid, '💼 Paycheck paid: ' + prFmt(pc.raw), pc.label + ' — it is in your account now. Great work!', {}); } catch (e) {}
  return true;
}
function prDeny(pc, by) {
  try { syncSet('paychecks/' + pc.pid + '/' + pc.id, Object.assign({}, pc, { status: 'rejected', by: by || 'laurel', at: Date.now() })); } catch (e) {}
  try { if (window._addNotifFn) window._addNotifFn('paycheck', pc.pid, '💼 Paycheck not paid: ' + pc.label, 'Talk with Mom or Dad about this pay period.', {}); } catch (e) {}
}
function prCutNow(p, earn) {
  var through = prState(p.id).through || 0, ent = prEntries(earn, p.id).filter(function (e) { return e.ts > through; });
  if (!ent.length) return null; var now = Date.now();
  var per = { start: ent[0].ts, end: now, endExcl: now + 1, id: 'cut_' + prDayKey(now) + '_' + now.toString(36), label: 'Early paycheck ' + new Date(now).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), freq: 'cut' };
  var pc = prMakeCheck(p, per, ent, false); try { syncSet('payroll_state/' + p.id, { through: now }); } catch (e) {} return pc;
}
function prRun(family, earn) {
  var cfg = prCfg(); if (!cfg.enabled) return;
  (family || []).filter(function (p) { return !p.deleted && p.role === 'child' && p.inPaySystem !== false; }).forEach(function (p) {
    var pp = prPerson(p.id), through = prState(p.id).through || 0, ent = prEntries(earn, p.id).filter(function (e) { return e.ts > through; }), now = Date.now(), cur = through, guard = 0, made = [];
    while (guard++ < 40) {
      var first = ent.filter(function (e) { return e.ts > cur; })[0]; if (!first) break;
      var per = prPeriod(first.ts, pp.freq, cfg.anchor); per.freq = pp.freq; if (per.endExcl > now) break;
      var items = ent.filter(function (e) { return e.ts > cur && e.ts <= per.end; }), pc = prMakeCheck(p, per, items, pp.auto); if (pc) made.push(pc); cur = per.end;
    }
    if (cur !== through) { try { syncSet('payroll_state/' + p.id, { through: cur }); } catch (e) {} }
    if (pp.auto) made.forEach(function (pc) { prPay(pc, 'auto'); });
  });
}
function PayrollEngine(props) {
  var eS = ktUse('earnings', {}), earn = eS[0] || {}, cS = ktUse('payroll_cfg', null), cfg = cS[0];
  window._payrollFamily = props.family || [];
  var ref = React.useRef({}); ref.current = { earn: earn, fam: props.family };
  React.useEffect(function () { if (!props.isAdmin) return; var go = function () { try { prRun(ref.current.fam, ref.current.earn); } catch (e) {} }; var t0 = setTimeout(go, 4000), iv = setInterval(go, 60000); return function () { clearTimeout(t0); clearInterval(iv); }; }, [props.isAdmin]);
  return null;
}
var prBtn = function (bg, fg, fn, t, extra) { return React.createElement('button', { onClick: fn, style: Object.assign({ background: bg, color: fg, border: 'none', borderRadius: 14, padding: '11px 14px', fontWeight: 800, fontSize: 14, cursor: 'pointer' }, extra || {}) }, t); };
function PrChip(status) { var m = { pending: ['⏳ Waiting for approval', '#FFD54F'], paid: ['✅ Paid', '#7be3ae'], rejected: ['✖ Not paid', '#FF8A80'] }[status] || [status, '#aaa']; return React.createElement('span', { style: { fontSize: 12, fontWeight: 900, color: m[1] } }, m[0]); }
// ── The kids' "My Bethel Job" page ──
function KidJob(props) {
  var h = React.createElement, pid = props.personId, name = props.name || '';
  var eS = ktUse('earnings', {}), earn = eS[0] || {}, pS = ktUse('paychecks/' + pid, {}), checks = Object.values(pS[0] || {}).sort(function (a, b) { return (b.created || 0) - (a.created || 0); });
  var cS = ktUse('payroll_cfg', null), cfg = cS[0] || {}, stS = ktUse('payroll_state/' + pid, null), through = (stS[0] || {}).through || 0, wS = ktUse('wallets/' + pid, null), bal = (wS[0] || {}).balance || 0;
  var tS = React.useState(0), setT = tS[1];
  React.useEffect(function () { var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 30000); return function () { clearInterval(iv); }; }, []);
  var pp = (cfg.people || {})[pid] || {}, freq = pp.freq || 'weekly', on = cfg.enabled !== false;
  var ent = prEntries(earn, pid).filter(function (e) { return e.ts > through; }), total = ent.reduce(function (n, e) { return n + e.raw; }, 0), today = prDayKey(Date.now());
  var tdy = ent.filter(function (e) { return e.day === today; }), tdTotal = tdy.reduce(function (n, e) { return n + e.raw; }, 0);
  var per = prPeriod(Date.now(), freq, cfg.anchor), fq = (PR_FREQ.filter(function (x) { return x[0] === freq; })[0] || [0, 'Weekly'])[1];
  var card = { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 16, padding: 14, marginBottom: 12 };
  return h('div', { style: { paddingTop: 6 } },
    h('div', { style: Object.assign({}, card, { background: 'linear-gradient(135deg,rgba(76,175,130,.22),rgba(76,175,130,.06))', borderColor: 'rgba(76,175,130,.5)' }) },
      h('div', { style: { fontSize: 12, fontWeight: 900, color: '#7be3ae', letterSpacing: 1 } }, '💼 MY BETHEL JOB'),
      h('div', { style: { fontSize: 20, fontWeight: 900, color: '#fff', margin: '2px 0' } }, name ? name + ' — Bethel Family Team Member' : 'Bethel Family Team Member'),
      h('div', { style: { fontSize: 13, color: '#d8e6dc', lineHeight: 1.6 } }, on ? 'You are paid for work that is done and approved. Finish your day, earn points, and get a paycheck. No work means no pay.' : 'Points go straight to your account right now.'),
      on && h('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 } },
        h('div', { style: { flex: '1 1 130px', background: 'rgba(0,0,0,.25)', borderRadius: 12, padding: 10 } }, h('div', { style: { fontSize: 11, color: '#b8c0d0' } }, 'EARNED SO FAR THIS PAY PERIOD'), h('div', { style: { fontSize: 24, fontWeight: 900, color: '#FFD54F' } }, prFmt(total))),
        h('div', { style: { flex: '1 1 130px', background: 'rgba(0,0,0,.25)', borderRadius: 12, padding: 10 } }, h('div', { style: { fontSize: 11, color: '#b8c0d0' } }, 'PAID ' + fq.toUpperCase()), h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginTop: 4 } }, 'Payday after ' + new Date(per.end).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })), h('div', { style: { fontSize: 11, color: '#b8c0d0' } }, per.label)),
        h('div', { style: { flex: '1 1 130px', background: 'rgba(0,0,0,.25)', borderRadius: 12, padding: 10 } }, h('div', { style: { fontSize: 11, color: '#b8c0d0' } }, 'IN MY ACCOUNT NOW'), h('div', { style: { fontSize: 24, fontWeight: 900, color: '#fff' } }, prFmt(bal))))),
    on && h('div', { style: card },
      h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '📋 Today’s earnings ' + (tdy.length ? '· ' + prFmt(tdTotal) : '')),
      tdy.length === 0 && h('div', { style: { fontSize: 13, color: '#9aa' } }, 'Nothing earned yet today. Check off your morning routine, schedule, chores and school time.'),
      tdy.slice().reverse().map(function (e) { return h('div', { key: e.id, style: { display: 'flex', gap: 8, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,.07)', fontSize: 14 } }, h('div', { style: { flex: 1, color: '#fff' } }, e.reason || 'Work'), h('b', { style: { color: e.raw < 0 ? '#FF8A80' : '#7be3ae' } }, (e.raw < 0 ? '−' : '+') + prFmt(Math.abs(e.raw)))); })),
    on && h('div', { style: card },
      h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '🧾 My paychecks'),
      checks.length === 0 && h('div', { style: { fontSize: 13, color: '#9aa' } }, 'No paychecks yet. Your first one is made at the end of the pay period.'),
      checks.slice(0, 12).map(function (pc) { return h('div', { key: pc.id, style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.07)' } }, h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } }, h('div', { style: { flex: 1, color: '#fff', fontSize: 14, fontWeight: 700 } }, pc.label), h('b', { style: { color: '#FFD54F', fontSize: 16 } }, prFmt(pc.raw))), h('div', { style: { fontSize: 12 } }, PrChip(pc.status), h('span', { style: { color: '#9aa' } }, ' · ' + (pc.count || 0) + ' items'))); })),
    props.children && (typeof Fold === 'function' ? h(Fold, { id: 'kidmoney', title: '💰 My money, envelopes & bills' }, props.children) : props.children));
}
// ── Laurel's payroll box ──
function PayrollAdmin(props) {
  var h = React.createElement, fam = (props.family || []).filter(function (p) { return !p.deleted && p.role === 'child' && p.inPaySystem !== false; });
  var eS = ktUse('earnings', {}), earn = eS[0] || {}, cS = ktUse('payroll_cfg', null), cfg = cS[0] || {}, aS = ktUse('paychecks', {}), all = aS[0] || {}, sS = ktUse('payroll_state', {}), states = sS[0] || {};
  var mS = React.useState(''), msg = mS[0], setMsg = mS[1], on = cfg.enabled !== false, who = window._loginPersonId || 'laurel';
  function setCfg(patch) { var n = Object.assign({}, cfg, patch); try { syncSet('payroll_cfg', n); } catch (e) {} }
  function setP(pid, patch) { var ppl = Object.assign({}, cfg.people || {}); ppl[pid] = Object.assign({}, ppl[pid] || {}, patch); setCfg({ people: ppl }); }
  var pend = []; Object.keys(all).forEach(function (pid) { Object.keys(all[pid] || {}).forEach(function (k) { var pc = all[pid][k]; if (pc && pc.status === 'pending') pend.push(pc); }); }); pend.sort(function (a, b) { return (a.created || 0) - (b.created || 0); });
  var recent = []; Object.keys(all).forEach(function (pid) { Object.keys(all[pid] || {}).forEach(function (k) { var pc = all[pid][k]; if (pc && pc.status !== 'pending') recent.push(pc); }); }); recent.sort(function (a, b) { return (b.paidAt || b.at || b.created || 0) - (a.paidAt || a.at || a.created || 0); });
  var chip = function (onn) { return { background: onn ? 'rgba(76,175,130,.3)' : 'rgba(255,255,255,.08)', color: '#fff', border: '2px solid ' + (onn ? '#4CAF82' : 'rgba(255,255,255,.2)'), borderRadius: 12, padding: '9px 11px', fontWeight: 800, fontSize: 13, cursor: 'pointer' }; };
  var body = h('div', { style: { padding: '4px 12px 10px' } },
    msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 10, padding: 7, fontWeight: 800, fontSize: 13, margin: '6px 0' } }, msg),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0 10px', flexWrap: 'wrap' } }, h('div', { style: { flex: 1, fontSize: 13, color: '#d8d8e8', lineHeight: 1.5 } }, on ? 'Pay by paycheck is ON: work earns points that pile up, and each paycheck needs your approval.' : 'Pay by paycheck is OFF: points go straight to the account like before.'), prBtn(on ? 'rgba(239,83,80,.25)' : '#4CAF82', on ? '#FF8A80' : '#000', function () { setCfg({ enabled: !on }); }, on ? 'Turn off' : 'Turn on')),
    pend.length > 0 && h('div', { style: { background: 'rgba(255,213,79,.12)', border: '1px solid #FFD54F', borderRadius: 12, padding: 10, marginBottom: 10 } },
      h('div', { style: { fontSize: 13, fontWeight: 900, color: '#FFD54F', marginBottom: 6 } }, '⏳ Paychecks waiting for you (' + pend.length + ')'),
      pend.map(function (pc) { return h('div', { key: pc.pid + pc.id, style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.1)' } },
        h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } }, h('div', { style: { flex: 1, minWidth: 140, color: '#fff', fontSize: 14, fontWeight: 800 } }, (pc.name || pc.pid) + ' — ' + pc.label, h('div', { style: { fontSize: 12, color: '#b8c0d0', fontWeight: 400 } }, (pc.count || 0) + ' items of work')), h('b', { style: { color: '#FFD54F', fontSize: 17 } }, prFmt(pc.raw))),
        h('div', { style: { display: 'flex', gap: 8, marginTop: 6 } }, prBtn('#4CAF82', '#000', function () { prPay(pc, who); setMsg('✅ Paid ' + (pc.name || pc.pid) + ' ' + prFmt(pc.raw)); }, '✅ Pay it'), prBtn('rgba(239,83,80,.25)', '#FF8A80', function () { prDeny(pc, who); setMsg('Marked not paid.'); }, '✖ Don’t pay')),
        h('details', { style: { marginTop: 6, fontSize: 12, color: '#c8c8d8' } }, h('summary', { style: { cursor: 'pointer' } }, 'See the work'), (pc.lines || []).slice(-30).map(function (l, i) { return h('div', { key: i }, (l.raw < 0 ? '− ' : '+ ') + prFmt(Math.abs(l.raw)) + '  ' + l.r); }))); }),
      pend.length > 1 && prBtn('#4CAF82', '#000', function () { pend.forEach(function (pc) { prPay(pc, who); }); setMsg('✅ Paid all ' + pend.length + ' paychecks'); }, '✅ Pay all', { marginTop: 8 })),
    h('div', { style: { fontSize: 12, fontWeight: 900, color: '#C5B8E8', letterSpacing: 1, margin: '8px 0 4px' } }, 'EACH CHILD’S PAY SCHEDULE'),
    fam.map(function (p) { var pp = (cfg.people || {})[p.id] || {}, fq = pp.freq || 'weekly', th = (states[p.id] || {}).through || 0, ent = prEntries(earn, p.id).filter(function (e) { return e.ts > th; }), tot = ent.reduce(function (n, e) { return n + e.raw; }, 0);
      return h('div', { key: p.id, style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } }, h('b', { style: { color: '#fff', flex: 1 } }, (p.emoji || '') + ' ' + p.name), h('span', { style: { color: '#FFD54F', fontWeight: 900 } }, prFmt(tot) + ' earned this period')),
        h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' } }, PR_FREQ.map(function (f) { return h('button', { key: f[0], onClick: function () { setP(p.id, { freq: f[0] }); }, style: chip(fq === f[0]) }, f[1]); }),
          h('button', { onClick: function () { setP(p.id, { auto: !pp.auto }); }, style: chip(!!pp.auto) }, (pp.auto ? '✅ ' : '⬜ ') + 'Pay automatically'),
          prBtn('#FFB74D', '#000', function () { var pc = prCutNow(p, earn); setMsg(pc ? '✅ Made an early paycheck for ' + p.name + ': ' + prFmt(pc.raw) : 'Nothing to pay ' + p.name + ' yet.'); }, '✂️ Pay out now', { padding: '9px 11px', fontSize: 13 }))); }),
    recent.length > 0 && h('div', { style: { marginTop: 10 } }, h('div', { style: { fontSize: 12, fontWeight: 900, color: '#C5B8E8', letterSpacing: 1, marginBottom: 4 } }, 'RECENT PAYCHECKS'),
      recent.slice(0, 8).map(function (pc) { return h('div', { key: pc.pid + pc.id, style: { display: 'flex', gap: 8, fontSize: 13, padding: '4px 0', color: '#ddd' } }, h('div', { style: { flex: 1 } }, (pc.name || pc.pid) + ' · ' + pc.label), h('b', null, prFmt(pc.raw)), PrChip(pc.status)); })));
  return typeof Fold === 'function' ? h(Fold, { id: 'payroll', title: '💼 Payroll & paychecks', badge: pend.length ? String(pend.length) : null }, body) : body;
}
