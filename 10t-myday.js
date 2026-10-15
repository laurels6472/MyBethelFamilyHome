// ═══ MY DAY — one ordered checklist: schedule, habits and chores. Checking things off pays points straight away,
// finishing early earns a time bonus, and school/clock time pays too. Points are Bethel Cash (points ÷ points-per-B$). ═══
function mdCfgDefaults(c) { c = c || {}; return { habitPts: c.habitPts != null && c.habitPts !== '' ? +c.habitPts : 1, blockPts: c.blockPts != null && c.blockPts !== '' ? +c.blockPts : 2, bonusPerMin: c.bonusPerMin != null && c.bonusPerMin !== '' ? +c.bonusPerMin : 0.5, clockMult: c.clockMult != null && c.clockMult !== '' ? +c.clockMult : 1, clockPay: c.clockPay === false ? false : true }; }
function mdPtsPerB(sc) { return sc && +sc.ptsPerB > 0 ? +sc.ptsPerB : 20; }
function mdRaw(pts, ptsPerB) { return (window._payMode || 'pay') === 'points' ? Math.round(pts * 100) / 100 : Math.round((pts / ptsPerB) * 100) / 100; }
function mdFmtB(pts, ptsPerB) { return 'B$' + (Math.round((pts / ptsPerB) * 100) / 100).toFixed(2); }
function mdAward(pid, key, pts, rawOverride, reason, ptsPerB) {
  if (!(pts > 0) && !(rawOverride > 0)) return false;
  var path = 'awards/' + rtDay() + '/' + pid + '/' + key, have = null; try { have = syncGet(path); } catch (e) {}
  if (have) return false;
  var raw = rawOverride != null ? rawOverride : mdRaw(pts, ptsPerB);
  try { syncSet(path, { pts: pts, raw: raw, ts: Date.now(), reason: reason }); } catch (e) {}
  if (raw > 0 && typeof window._creditFn === 'function') { try { window._creditFn(pid, raw, reason, key, true); } catch (e) {} }
  return true;
}
function mdRevoke(pid, key, reason) {
  var path = 'awards/' + rtDay() + '/' + pid + '/' + key, have = null; try { have = syncGet(path); } catch (e) {}
  if (!have) return;
  try { syncSet(path, null); } catch (e) {}
  if (have.raw > 0 && typeof window._deductFn === 'function') { try { window._deductFn(pid, have.raw, '↩ ' + reason); } catch (e) {} }
}

function MyDayList(props) {
  var h = React.createElement, pid = props.personId, name = props.name || '', day = (typeof planDayKey === 'function' ? planDayKey() : ''), rdy = (typeof rtDay === 'function' ? rtDay() : day);
  var cfg = mdCfgDefaults(ktUse('points_cfg', null)[0]), sc = ktUse('store/cfg', null)[0] || {}, ppb = mdPtsPerB(sc);
  var pdS = ktUse('plansdone/' + day + '/' + pid, {}), pdone = pdS[0] || {}, hdS = ktUse('habitsdone/' + rdy + '/' + pid, {}), hdone = hdS[0] || {}, hrS = ktUse('habitsrun/' + rdy + '/' + pid, {}), hruns = hrS[0] || {};
  var sdS = ktUse('startday/' + todayKey() + '/' + pid, null), sd = sdS[0] || {}, ohS = ktUse('habits/' + pid, null), haS = ktUse('habits/__all', null);
  var odS = ktUse('opsdone', {}), odone = odS[0] || {}, opS = ktUse('opsprog', {}), oprog = opS[0] || {}, ocS = ktUse('ops/custom', null), olS = ktUse('ops/lib', {});
  var awS = ktUse('awards/' + rdy + '/' + pid, {}), awards = awS[0] || {};
  var xS = React.useState(null), ex = xS[0], setEx = xS[1], tS = React.useState(0), setT = tS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  React.useEffect(function () { window._ptsPerB = ppb; });
  React.useEffect(function () { var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 20000); return function () { clearInterval(iv); }; }, []);
  var d = new Date(), nowM = d.getHours() * 60 + d.getMinutes();
  function say(t) { setMsg(t); setTimeout(function () { setMsg(''); }, 3500); }
  var blocks = (typeof planBlocksFor === 'function') ? planBlocksFor(props.schedHook, pid, day) : [];
  var rows = [];
  blocks.forEach(function (b, i) {
    var nx = blocks[i + 1], endM = nx && nx._t != null ? nx._t : (b._t != null ? b._t + 30 : null), dn = pdone[b.id];
    rows.push({ k: 'b_' + b.id, t: b._t != null ? b._t : 900 + i / 100, kind: 'block', icon: b.emoji || '🕒', label: b.title, time: b.time, color: b.color || '#9C8DC4', on: !!dn && (dn.status === 'approved' || dn.status === 'submitted'), pts: +b.pts || cfg.blockPts, mins: b._t != null && endM != null ? endM - b._t : null, startM: b._t, endM: endM, b: b });
  });
  var PER = [['morning', '☀️', 360, 'Morning habit'], ['afternoon', '🌤', 900, 'Afternoon habit'], ['evening', '🌙', 1140, 'Evening habit']];
  if (typeof rtHabits === 'function') PER.forEach(function (p) {
    rtHabits(name, pid, p[0], ohS[0], haS[0]).forEach(function (label, i) {
      var pr = rtParse(label), id = p[0] + '_' + rtHash(label);
      rows.push({ k: 'h_' + id, t: p[2] + i / 100, kind: 'habit', icon: p[1], label: pr.text, color: '#7CB342', on: !!hdone[id], ts: hdone[id] || 0, pts: cfg.habitPts, mins: pr.mins, per: p[0], hid: id, raw: label });
    });
  });
  var chores = [];
  if (typeof rtItems === 'function') { var its = rtItems(ocS[0], pid, name, olS[0]); chores = its.weekly.concat(its.daily); }
  chores.forEach(function (it, i) {
    var r = odone[it.id], rec = r && r.period === rtPeriod(it.freq) ? r : null, p = oprog[it.id] && oprog[it.id].period === rtPeriod(it.freq) ? oprog[it.id] : null;
    var tt = /before school|morning|wake|breakfast|\bbeds?\b/i.test(it.label) ? 405 : /dinner|evening|bed ?time|night/i.test(it.label) ? 1110 : 930;
    rows.push({ k: 'c_' + it.id, t: tt + i / 100, kind: 'chore', icon: '🧹', label: it.label, color: '#26A69A', on: !!rec && (rec.status === 'approved' || rec.status === 'submitted'), pts: it.pts || 5, mins: it.est || null, it: it, rec: rec, prog: p });
  });
  rows.sort(function (a, b) { return a.t - b.t; });
  var doneN = rows.filter(function (r) { return r.on; }).length;
  var todayPts = Object.keys(awards).reduce(function (n, k) { return n + (+(awards[k] || {}).pts || 0); }, 0);

  function bonusFor(savedMin) { return savedMin > 0 ? Math.floor(savedMin * cfg.bonusPerMin * 10) / 10 : 0; }
  function finish(r, pts, raw, reason, savedMin) {
    var bonus = bonusFor(savedMin), ok = mdAward(pid, r.k, pts, raw, reason, ppb), got = false;
    if (ok) got = true;
    if (bonus > 0 && ok) mdAward(pid, r.k + '_bonus', bonus, null, '⏱ Time bonus: ' + reason, ppb);
    say(got ? '✅ +' + pts + ' pts' + (bonus > 0 ? ' + ⏱ ' + bonus + ' bonus pts for finishing early!' : '') + ' (' + mdFmtB(pts + bonus, ppb) + ')' : '✅ Done');
  }
  function toggle(r) {
    if (r.kind === 'habit') {
      if (r.on) { try { syncSet('habitsdone/' + rdy + '/' + pid + '/' + r.hid, null); } catch (e) {} mdRevoke(pid, r.k, r.label); mdRevoke(pid, r.k + '_bonus', r.label); return; }
      var sameP = rows.filter(function (x) { return x.kind === 'habit' && x.per === r.per && x.on; }).reduce(function (m, x) { return x.ts > m ? x.ts : m; }, 0);
      var start = sameP || hruns[r.per] || (r.per === 'morning' && sd.dayStart) || 0, saved = start ? (r.mins * 60 - (Date.now() - start) / 1000) / 60 : 0;
      try { syncSet('habitsdone/' + rdy + '/' + pid + '/' + r.hid, Date.now()); } catch (e) {}
      var inPer = rows.filter(function (x) { return x.kind === 'habit' && x.per === r.per; }), leftN = inPer.filter(function (x) { return !x.on && x.k !== r.k; }).length;
      if (!inPer.some(function (x) { return x.on; })) tcLink(pid, 'chores', 'Daily habits', true); if (leftN === 0) tcLink(pid, 'chores', '', false);
      if (/glass of water/i.test(r.label)) { var hid = 'hl_hab_' + rdy.replace(/-/g, '') + '_' + r.hid; try { syncSet('health_log/' + pid + '/' + hid, { id: hid, type: 'water', ts: Date.now(), loggedBy: pid, amount: '8', note: 'Daily habit' }); } catch (e) {} }
      finish(r, r.pts, null, '🌱 ' + r.label, saved);
    } else if (r.kind === 'block') {
      if (r.on) { try { syncSet('plansdone/' + day + '/' + pid + '/' + r.b.id, null); } catch (e) {} mdRevoke(pid, r.k, r.label); mdRevoke(pid, r.k + '_bonus', r.label); return; }
      var saved2 = (!r.b.activity && r.startM != null && r.endM != null && nowM >= r.startM && nowM < r.endM) ? r.endM - nowM : 0;
      if (r.b.activity) tcLink(pid, r.b.activity, '', false);
      try { syncSet('plansdone/' + day + '/' + pid + '/' + r.b.id, { status: 'approved', auto: true, ts: Date.now(), title: r.label, pts: r.pts }); } catch (e) {}
      finish(r, r.pts, null, '✅ ' + r.label, saved2);
    } else {
      var it = r.it, per = rtPeriod(it.freq);
      if (r.on) { try { syncSet('opsdone/' + it.id, null); } catch (e) {} mdRevoke(pid, r.k, r.label); return; }
      tcLink(pid, 'chores', '', false);
      var mins = r.prog && r.prog.start ? Math.max(1, Math.round((Date.now() - r.prog.start) / 60000)) : null, saved3 = (r.prog && r.prog.start && it.est) ? it.est - (Date.now() - r.prog.start) / 60000 : 0;
      var rawC = (window._payMode || 'pay') === 'points' ? (it.pts || 0) : (+it.cash || 0);
      try { syncSet('opsdone/' + it.id, { status: 'approved', auto: true, by: pid, byName: name, ts: Date.now(), period: per, label: it.label, freq: it.freq, mins: mins, pts: it.pts || 0, cash: +it.cash || 0, credited: { amt: rawC, mode: window._payMode || 'pay', ts: Date.now() } }); } catch (e) {}
      finish(r, it.pts || 0, rawC, '🧹 ' + it.label.slice(0, 60), saved3);
    }
  }
  function toggleStep(r, i) {
    var it = r.it; if (!r.prog) tcLink(pid, 'chores', it.label.slice(0, 50), true);
    var p = r.prog || { period: rtPeriod(it.freq), start: Date.now(), by: pid, label: it.label, steps: {} }, st = Object.assign({}, p.steps || {});
    if (st[i]) delete st[i]; else st[i] = true;
    try { syncSet('opsprog/' + it.id, Object.assign({}, p, { steps: st })); } catch (e) {}
  }
  function clockInFor(b) { if (b.activity && typeof clockInActivity === 'function') clockInActivity(pid, props.sessions || {}, props.onUpdate, b.activity); }
  var running = (typeof clockActiveList === 'function') ? clockActiveList((props.sessions || {})[pid] || {}).map(function (x) { return x.activity; }) : [];
  function tl(m) { if (m >= 9000) return ''; var hh = Math.floor(m / 60), mm = Math.floor(m % 60); return (hh % 12 || 12) + ':' + (mm < 10 ? '0' : '') + mm + (hh < 12 ? 'a' : 'p'); }
  return h('div', { style: { padding: '0 0 10px' } },
    typeof PlanRightNow === 'function' && h(PlanRightNow, { schedHook: props.schedHook, personId: pid, sessions: props.sessions, onUpdate: props.onUpdate }),
    h('div', { style: { background: 'rgba(76,175,130,.12)', border: '1px solid rgba(76,175,130,.45)', borderRadius: 14, padding: 12, margin: '4px 0 10px' } },
      h('div', { style: { display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' } }, h('div', { style: { fontSize: 18, fontWeight: 900, color: '#fff', flex: 1 } }, '✅ My day, in order'), h('div', { style: { fontSize: 14, fontWeight: 900, color: '#7be3ae' } }, doneN + '/' + rows.length + ' done')),
      h('div', { style: { height: 8, background: 'rgba(255,255,255,.12)', borderRadius: 4, overflow: 'hidden', margin: '8px 0' } }, h('div', { style: { height: '100%', width: (rows.length ? doneN / rows.length * 100 : 0) + '%', background: '#4CAF82', transition: 'width .3s' } })),
      h('div', { style: { fontSize: 14, color: '#fff', fontWeight: 800 } }, '⭐ Earned today: ' + (Math.round(todayPts * 10) / 10) + ' pts  =  ' + mdFmtB(todayPts, ppb) + ' Bethel Cash'),
      h('div', { style: { fontSize: 12, color: '#c8d8c8', marginTop: 3, lineHeight: 1.5 } }, 'Check things off in order. Finish before the time is up and the minutes left over are added as bonus points. School and clock time pay on their own. ' + ppb + ' points = B$1, so points pay your bills.')),
    msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 10, padding: 9, fontWeight: 800, fontSize: 14, marginBottom: 8 } }, msg),
    rows.length === 0 && h('div', { style: { fontSize: 14, color: '#b8b8c8', padding: 14 } }, 'Nothing is set for today. Ask a parent.'),
    rows.map(function (r) {
      var open = ex === r.k, steps = r.it && r.it.steps, nS = steps ? steps.length : 0, dn = r.prog ? Object.keys(r.prog.steps || {}).length : 0, aw = awards[r.k], isNow = r.kind === 'block' && r.startM != null && r.endM != null && nowM >= r.startM && nowM < r.endM;
      return h('div', { key: r.k, style: { marginBottom: 7, borderRadius: 14, border: '1px solid ' + (isNow ? '#FFD54F' : r.color + '55'), background: r.on ? 'rgba(76,175,130,.14)' : isNow ? 'rgba(255,213,79,.12)' : r.color + '14', overflow: 'hidden' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px' } },
          h('button', { onClick: function () { if (r.kind === 'chore' && nS && !r.on) { setEx(open ? null : r.k); } else toggle(r); }, 'aria-label': 'check off', style: { width: 40, height: 40, borderRadius: '50%', flexShrink: 0, border: '3px solid ' + (r.on ? '#4CAF82' : 'rgba(255,255,255,.55)'), background: r.on ? '#4CAF82' : 'transparent', color: '#000', fontWeight: 900, fontSize: 20, cursor: 'pointer' } }, r.on ? '✓' : ''),
          h('div', { onClick: function () { if (nS) setEx(open ? null : r.k); }, style: { flex: 1, minWidth: 0, cursor: nS ? 'pointer' : 'default' } },
            h('div', { style: { fontSize: 15, fontWeight: 800, color: '#fff', textDecoration: r.on ? 'line-through' : 'none', opacity: r.on ? .7 : 1, lineHeight: 1.35 } }, r.icon + ' ' + r.label),
            h('div', { style: { fontSize: 12, color: '#b8c0d0', marginTop: 2 } }, (r.time || tl(r.t)) + (r.time || tl(r.t) ? ' · ' : '') + (r.mins ? r.mins + ' min · ' : '') + '+' + r.pts + ' pts' + (nS ? ' · ' + nS + ' steps' + (dn ? ' (' + dn + ' done)' : '') : '') + (aw ? ' · ✅ paid' : '') + (isNow ? ' · ⏱ NOW' : ''))),
          r.kind === 'block' && r.b.activity && !r.on && h('button', { onClick: function () { tcLink(pid, r.b.activity, r.label, true); }, style: { background: running.indexOf(r.b.activity) !== -1 ? 'rgba(76,175,130,.3)' : '#039BE5', color: '#fff', border: 'none', borderRadius: 14, padding: '10px 11px', fontWeight: 800, fontSize: 12, cursor: 'pointer', flexShrink: 0 } }, running.indexOf(r.b.activity) !== -1 ? '⏱ Clocked in' : '▶ Clock in')),
        open && nS > 0 && h('div', { style: { padding: '0 12px 12px', borderTop: '1px solid rgba(255,255,255,.08)' } },
          !r.prog && h('button', { onClick: function () { tcLink(pid, 'chores', r.it.label.slice(0, 50), true); try { syncSet('opsprog/' + r.it.id, { period: rtPeriod(r.it.freq), start: Date.now(), by: pid, label: r.it.label, steps: {} }); } catch (e) {} }, style: { background: '#039BE5', color: '#fff', border: 'none', borderRadius: 14, padding: '10px 14px', fontWeight: 800, fontSize: 13, margin: '10px 0 4px', cursor: 'pointer' } }, '▶ Start the timer'),
          steps.map(function (s, i) { var on = !!(r.prog && r.prog.steps && r.prog.steps[i]); return h('div', { key: i, onClick: function () { toggleStep(r, i); }, style: { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)', cursor: 'pointer' } }, h('div', { style: { width: 26, height: 26, borderRadius: 7, border: '2px solid ' + (on ? '#4CAF82' : 'rgba(255,255,255,.4)'), background: on ? '#4CAF82' : 'transparent', color: '#000', fontWeight: 900, textAlign: 'center', lineHeight: '22px', flexShrink: 0 } }, on ? '✓' : ''), h('div', { style: { fontSize: 14, color: on ? '#8a8a9a' : '#fff', textDecoration: on ? 'line-through' : 'none', lineHeight: 1.4 } }, s)); }),
          h('div', { style: { marginTop: 10 } }, dn >= nS ? h('button', { onClick: function () { toggle(r); setEx(null); }, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 14, padding: '12px 16px', fontWeight: 900, fontSize: 15, cursor: 'pointer' } }, '✅ All done — get paid (+' + r.pts + ' pts)') : h('div', { style: { fontSize: 12, color: '#FFB74D' } }, 'Check off every step (' + dn + '/' + nS + ') to finish.'))));
    }));
}

// Pays points for productive clock time (school, spiritual, service …) — runs on the child's own device
function ClockPayEngine(props) {
  var pid = props.personId, cfg = mdCfgDefaults(ktUse('points_cfg', null)[0]), sc = ktUse('store/cfg', null)[0] || {}, ppb = mdPtsPerB(sc), day = (typeof rtDay === 'function' ? rtDay() : ''), cpS = ktUse('clockpaid/' + day + '/' + pid, null), cp = cpS[0] || {};
  var ref = React.useRef({});
  ref.current = { sessions: props.sessions, cfg: cfg, ppb: ppb, cp: cp };
  React.useEffect(function () {
    function tick() {
      var R = ref.current, data = (R.sessions || {})[pid]; if (!data || !R.cfg.clockPay) return;
      var all = (data.today || []).slice(); if (typeof clockActiveList === 'function') clockActiveList(data).forEach(function (a) { all.push(Object.assign({}, a, { duration: (Date.now() - a.startTime) / 60000 })); });
      var earned = all.reduce(function (n, e) { var a = typeof getAct === 'function' ? getAct(e.activity) : {}; return n + ((a.productive !== false && a.pts) ? a.pts * (e.duration || 0) / 60 : 0); }, 0) * R.cfg.clockMult;
      var paid = +(R.cp.pts || 0), owed = Math.floor((earned - paid) * 10) / 10; if (owed < 1) return;
      var raw = mdRaw(owed, R.ppb); if (!(raw > 0)) return;
      try { syncSet('clockpaid/' + day + '/' + pid, { pts: Math.round((paid + owed) * 10) / 10, ts: Date.now() }); } catch (e) {}
      ref.current.cp = { pts: paid + owed };
      if (typeof window._creditFn === 'function') { try { window._creditFn(pid, raw, '⏱ Paid for clock time (school & work)', 'clock_' + day + '_' + Date.now(), true); } catch (e) {} }
    }
    tick(); var iv = setInterval(tick, 60000); return function () { clearInterval(iv); };
  }, [pid, day]);
  return null;
}

// Parent settings for points
function PointsSettings(props) {
  var h = React.createElement, cS = ktUse('points_cfg', null), c = cS[0] || {}, d = mdCfgDefaults(c), oS = React.useState(false), open = oS[0], setOpen = oS[1];
  function set(k, v) { try { syncSet('points_cfg/' + k, v === '' ? null : (k === 'clockPay' ? !!v : +v)); } catch (e) {} }
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 15, width: 90 };
  var row = function (label, key, val, hint) { return h('div', { key: key, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' } }, h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 14, color: '#fff', fontWeight: 700 } }, label), h('div', { style: { fontSize: 11, color: '#9aa' } }, hint)), h('input', { type: 'number', inputMode: 'decimal', defaultValue: val, onBlur: function (e) { set(key, e.target.value); }, style: inp })); };
  return h('div', { style: { margin: '10px 14px' } },
    h('button', { onClick: function () { setOpen(!open); }, style: { width: '100%', textAlign: 'left', background: 'rgba(255,213,79,.12)', border: '1px solid rgba(255,213,79,.45)', borderRadius: 14, padding: 12, color: '#fff', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, '⭐ Points & pay rules ' + (open ? '▾' : '▸')),
    open && h('div', { style: { marginTop: 8, padding: 12, background: 'rgba(255,255,255,.05)', borderRadius: 14 } },
      row('Points per habit', 'habitPts', d.habitPts, 'each habit checked off'),
      row('Points per schedule item', 'blockPts', d.blockPts, 'unless the item has its own points'),
      row('Bonus points per minute saved', 'bonusPerMin', d.bonusPerMin, 'minutes left over when a timed item is finished early'),
      row('Clock-time pay multiplier', 'clockMult', d.clockMult, '1 = the points per hour shown on each clock activity (School is 2/hr); 2 doubles it; 0 turns it off'),
      h('div', { style: { fontSize: 12, color: '#9aa', marginTop: 6, lineHeight: 1.5 } }, 'Points become Bethel Cash at the rate set in Store & Envelopes (points per B$). In Bethel Cash mode they are added as B$ at that same rate.')));
}

// ═══ TIMERS ↔ CLOCK: anything with a timer clocks the child in (and out) so time is tracked and paid ═══
function tcLink(pid, actId, label, on) {
  try {
    var api = window._clockApi; if (!api || !api.onUpdate || !pid || typeof clockInActivity !== 'function') return;
    var data = (api.sessions || {})[pid] || {}, list = clockActiveList(data), has = list.filter(function (a) { return a.activity === actId; })[0];
    if (on) { if (!has) clockInActivity(pid, api.sessions || {}, api.onUpdate, actId, { stack: true, label: label || '', linked: true }); }
    else if (has && has.linked) clockOutActivity(pid, api.sessions || {}, api.onUpdate, actId);
  } catch (e) {}
}
function tcSopAct(dept) { return dept === 'kitchen' ? 'meals' : 'chores'; }

// ═══ ATTENDANCE: clocking into School checks attendance in; clocking out records the end time ═══
function AttendanceAuto(props) {
  var pid = props.personId, iso = tcIso(new Date()), rS = ktUse('attendance/' + iso + '/' + pid, null), rec = rS[0];
  var ref = React.useRef({}); ref.current = { sessions: props.sessions, rec: rec };
  function hm(ts) { var d = new Date(ts); return tcPad(d.getHours()) + ':' + tcPad(d.getMinutes()); }
  function tick() {
    var R = ref.current, data = (R.sessions || {})[pid]; if (!data) return;
    var act = typeof clockActiveList === 'function' ? clockActiveList(data) : [], runningSchool = act.filter(function (a) { return a.activity === 'school'; })[0];
    var done = (data.today || []).filter(function (e) { return e.activity === 'school'; });
    if (!runningSchool && !done.length) return;
    var starts = done.map(function (e) { return e.startTime; }).concat(runningSchool ? [runningSchool.startTime] : []).filter(Boolean), first = Math.min.apply(null, starts);
    var ends = done.map(function (e) { return e.endTime || (e.startTime + (e.duration || 0) * 60000); }), last = ends.length ? Math.max.apply(null, ends) : 0;
    var rc = R.rec; if (rc && !rc.auto) return;
    var want = { status: (rc && rc.status) || 'present', start: hm(first), end: runningSchool ? '' : (last ? hm(last) : ''), note: (rc && rc.note) || '', auto: true, by: pid, at: Date.now() };
    if (rc && rc.start === want.start && (rc.end || '') === want.end) return;
    ref.current.rec = want;
    try { syncSet('attendance/' + iso + '/' + pid, want); } catch (e) {}
  }
  React.useEffect(function () { tick(); }, [props.sessions]);
  React.useEffect(function () { var iv = setInterval(tick, 30000); return function () { clearInterval(iv); }; }, [pid]);
  return null;
}
function AttendanceCard(props) {
  var h = React.createElement, pid = props.personId, iso = tcIso(new Date()), rS = ktUse('attendance/' + iso + '/' + pid, null), rec = rS[0];
  var eS = React.useState(false), edit = eS[0], setEdit = eS[1], fS = React.useState({}), f = fS[0], setF = fS[1], cS = React.useState(false), conf = cS[0], setConf = cS[1];
  var running = typeof clockActiveList === 'function' ? clockActiveList((props.sessions || {})[pid] || {}).some(function (a) { return a.activity === 'school'; }) : false;
  var STAT = [['present', '✅ Present'], ['late', '⏰ Late'], ['absent', '❌ Absent'], ['excused', '📝 Excused'], ['holiday', '🏖 Holiday / Vacation (excused)']];
  var v = function (k, d) { return f[k] != null ? f[k] : (rec && rec[k] != null ? rec[k] : d); };
  function save() { var st = v('status', 'present'), off = st === 'absent' || st === 'excused' || st === 'holiday'; try { syncSet('attendance/' + iso + '/' + pid, { status: st, start: off ? '' : v('start', '09:00'), end: off ? '' : v('end', ''), note: v('note', ''), by: window._currentPersonId || 'parent', at: Date.now() }); } catch (e) {} setEdit(false); setF({}); }
  function del() { if (!conf) { setConf(true); setTimeout(function () { setConf(false); }, 4000); return; } try { syncSet('attendance/' + iso + '/' + pid, null); } catch (e) {} setConf(false); setEdit(false); }
  var inp = { background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, color: '#fff', padding: 9, fontSize: 15 };
  var present = rec && (rec.status === 'present' || rec.status === 'late');
  var fmt = function (t) { if (!t) return '—'; var m = /^(\d{1,2}):(\d{2})$/.exec(t); if (!m) return t; var hh = +m[1]; return (hh % 12 || 12) + ':' + m[2] + (hh < 12 ? ' AM' : ' PM'); };
  return h('div', { style: { background: present ? 'rgba(76,175,130,.14)' : 'rgba(255,255,255,.06)', border: '2px solid ' + (present ? '#4CAF82' : 'rgba(255,255,255,.2)'), borderRadius: 16, padding: 12, marginBottom: 12 } },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
      h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', flex: 1 } }, '🎒 Attendance today'),
      h('div', { style: { fontSize: 13, fontWeight: 900, color: present ? '#7be3ae' : rec ? '#FFB74D' : '#aaa' } }, rec ? ((STAT.filter(function (x) { return x[0] === rec.status; })[0] || ['', rec.status])[1]) : 'Not checked in')),
    rec && rec.status !== 'absent' && rec.status !== 'excused' && rec.status !== 'holiday' && h('div', { style: { fontSize: 14, color: '#e0e6f0', margin: '4px 0' } }, 'In ' + fmt(rec.start) + '  ·  Out ' + (running ? 'still in school' : fmt(rec.end)) + (rec.auto ? '  (from the school clock)' : '')),
    !rec && !running && h('button', { onClick: function () { tcLink(pid, 'school', 'School', true); }, style: { display: 'block', width: '100%', background: '#4CAF82', color: '#000', border: 'none', borderRadius: 14, padding: '14px', fontWeight: 900, fontSize: 16, cursor: 'pointer', marginTop: 6 } }, '✅ Check in — clock into School'),
    !rec && running && h('div', { style: { fontSize: 13, color: '#9aa' } }, 'Checking you in…'),
    !rec && !running && h('div', { style: { fontSize: 12, color: '#9aa', marginTop: 6 } }, 'Clocking into School checks you in automatically. Clocking out records your time out.'),
    props.isAdmin && h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } },
      h('button', { onClick: function () { setEdit(!edit); }, style: { background: '#FFB74D', color: '#000', border: 'none', borderRadius: 12, padding: '10px 13px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, '✏️ Edit'),
      rec && h('button', { onClick: del, style: { background: conf ? '#EF5350' : 'rgba(239,83,80,.25)', color: conf ? '#fff' : '#FF8A80', border: 'none', borderRadius: 12, padding: '10px 13px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, conf ? 'Tap again to delete' : '🗑 Delete / reset')),
    props.isAdmin && edit && h('div', { style: { marginTop: 8, padding: 10, background: 'rgba(0,0,0,.2)', borderRadius: 12 } },
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 } }, STAT.map(function (x) { var on = v('status', 'present') === x[0]; return h('button', { key: x[0], onClick: function () { setF(Object.assign({}, f, { status: x[0] })); }, style: { background: on ? '#4CAF82' : 'rgba(255,255,255,.1)', color: on ? '#000' : '#fff', border: 'none', borderRadius: 12, padding: '10px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, x[1]); })),
      h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } }, h('span', { style: { color: '#ddd', fontSize: 13 } }, 'In'), h('input', { type: 'time', value: v('start', '09:00'), onChange: function (e) { setF(Object.assign({}, f, { start: e.target.value })); }, style: inp }), h('span', { style: { color: '#ddd', fontSize: 13 } }, 'Out'), h('input', { type: 'time', value: v('end', ''), onChange: function (e) { setF(Object.assign({}, f, { end: e.target.value })); }, style: inp }), h('button', { onClick: save, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 12, padding: '11px 16px', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, 'Save'))));
}

// ═══ ADMIN TIMER EDITOR: type in a start/end time, add a missed clock-in, delete or reset ANY timer for a person ═══
function teTs(hhmm) { var m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || ''); if (!m) return null; var d = new Date(); d.setHours(+m[1], +m[2], 0, 0); return Math.min(d.getTime(), Date.now()); }
function teHm(ts) { if (!ts) return ''; var d = new Date(ts); var z = function (n) { return (n < 10 ? '0' : '') + n; }; return z(d.getHours()) + ':' + z(d.getMinutes()); }
function TimeRow(props) {
  var h = React.createElement, a = React.useState(teHm(props.start)), s1 = a[0], setS1 = a[1], b = React.useState(teHm(props.end)), s2 = b[0], setS2 = b[1], c = React.useState(false), conf = c[0], setConf = c[1], m = React.useState(''), note = m[0], setNote = m[1];
  React.useEffect(function () { setS1(teHm(props.start)); setS2(teHm(props.end)); }, [props.start, props.end]);
  var inp = { background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, color: '#fff', padding: '9px 8px', fontSize: 15 };
  var btn = function (bg, fg, fn, t) { return h('button', { onClick: fn, style: { background: bg, color: fg, border: 'none', borderRadius: 12, padding: '10px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, t); };
  function save() { var a1 = teTs(s1), a2 = props.hasEnd ? (s2 ? teTs(s2) : null) : undefined; if (!a1) { setNote('Type a start time'); return; } if (a2 && a2 <= a1) { setNote('End must be after start'); return; } setNote(''); props.onSave(a1, a2); setNote('✅ saved'); setTimeout(function () { setNote(''); }, 2000); }
  function del() { if (!conf) { setConf(true); setTimeout(function () { setConf(false); }, 4000); return; } setConf(false); props.onDelete(); }
  return h('div', { style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
    h('div', { style: { fontSize: 13, color: '#fff', fontWeight: 700, marginBottom: 5 } }, props.label),
    h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' } },
      h('span', { style: { fontSize: 12, color: '#b8c0d0' } }, props.startLabel || 'Started'), h('input', { type: 'time', value: s1, onChange: function (e) { setS1(e.target.value); }, style: inp }),
      props.hasEnd && [h('span', { key: 'l', style: { fontSize: 12, color: '#b8c0d0' } }, 'Ended'), h('input', { key: 'i', type: 'time', value: s2, onChange: function (e) { setS2(e.target.value); }, style: inp })],
      btn('#4CAF82', '#000', save, 'Save'), props.onDelete && btn(conf ? '#EF5350' : 'rgba(239,83,80,.25)', conf ? '#fff' : '#FF8A80', del, conf ? 'Tap again' : '🗑'),
      note && h('span', { style: { fontSize: 12, color: note[0] === '✅' ? '#7be3ae' : '#FFB74D' } }, note)));
}
function TimerEditor(props) {
  var h = React.createElement, pid = props.personId, sessions = props.sessions || {}, onUpdate = props.onUpdate, day = (typeof rtDay === 'function' ? rtDay() : ''), pday = (typeof planDayKey === 'function' ? planDayKey() : day);
  var oS = React.useState(!!props.startOpen), open = oS[0], setOpen = oS[1], aS = React.useState('school'), act = aS[0], setAct = aS[1], tS = React.useState(''), st = tS[0], setSt = tS[1], eS = React.useState(''), en = eS[0], setEn = eS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  var sd = ktUse('startday/' + todayKey() + '/' + pid, null)[0] || {}, hr = ktUse('habitsrun/' + day + '/' + pid, {})[0] || {}, op = ktUse('opsprog', {})[0] || {}, tr = ktUse('taskruns/' + pday + '/' + pid, {})[0] || {};
  var data = sessions[pid] || {}, list = (typeof clockActiveList === 'function' ? clockActiveList(data) : []), today = (data.today || []);
  var acts = typeof CLOCK_ACTS !== 'undefined' ? CLOCK_ACTS : [], nm = function (id) { var a = acts.filter(function (x) { return x.id === id; })[0]; return a ? a.label : id; };
  function save(cur, others, tdy) { if (typeof clockSave === 'function') clockSave(pid, sessions, onUpdate, cur || null, others || [], tdy || []); }
  function setRun(a, ts) { var nl = list.map(function (x) { return x === a ? Object.assign({}, x, { startTime: ts, adjustedBy: window._currentPersonId || 'parent' }) : x; }); save(nl[0], nl.slice(1), today); }
  function delRun(a) { var nl = list.filter(function (x) { return x !== a; }); save(nl[0], nl.slice(1), today); }
  function setEntry(i, s, e) { var nt = today.map(function (x, j) { return j !== i ? x : Object.assign({}, x, { startTime: s, endTime: e || x.endTime || Date.now(), duration: Math.round(((e || x.endTime || Date.now()) - s) / 60000 * 10) / 10 }); }); save(data.current, data.others, nt); }
  function delEntry(i) { save(data.current, data.others, today.filter(function (_, j) { return j !== i; })); }
  function addNew() {
    var s = teTs(st), e = en ? teTs(en) : null; if (!s) { setMsg('Type the time they started'); return; } if (e && e <= s) { setMsg('End must be after start'); return; }
    if (e) { var ent = { activity: act, startTime: s, endTime: e, duration: Math.round((e - s) / 60000 * 10) / 10, approvalStatus: 'approved', adminAdded: true }; save(data.current, data.others, today.concat([ent])); }
    else { if (list.some(function (x) { return x.activity === act; })) { setMsg('Already clocked into that — adjust it below'); return; } var run = { activity: act, startTime: s, approvalStatus: 'approved', adminAdded: true }; save(run, list, today); }
    setSt(''); setEn(''); setMsg('✅ Added — ' + nm(act) + (e ? ' ' + teHm(s) + '–' + teHm(e) : ' running since ' + teHm(s)));
  }
  var inp = { background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, color: '#fff', padding: '9px 8px', fontSize: 15 };
  var sec = function (t) { return h('div', { style: { fontSize: 12, fontWeight: 900, color: '#C5B8E8', letterSpacing: 1, margin: '12px 0 2px' } }, t); };
  var opsMine = Object.keys(op).filter(function (id) { return op[id] && op[id].by === pid; });
  var trKeys = Object.keys(tr).filter(function (k) { return tr[k] && tr[k].start; });
  return h('div', { style: { marginTop: 6 } },
    h('button', { onClick: function () { setOpen(!open); }, style: { background: '#FFB74D', color: '#000', border: 'none', borderRadius: 12, padding: '10px 13px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, '⏱ Edit / add / delete times ' + (open ? '▾' : '▸')),
    open && h('div', { style: { marginTop: 8, padding: 10, background: 'rgba(0,0,0,.25)', borderRadius: 12 } },
      msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 10, padding: 7, fontWeight: 800, fontSize: 13, marginBottom: 6 } }, msg),
      sec('➕ MISSED A CLOCK-IN? ADD IT'),
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' } },
        h('select', { value: act, onChange: function (e) { setAct(e.target.value); }, style: Object.assign({}, inp, { maxWidth: 170 }) }, acts.map(function (a) { return h('option', { key: a.id, value: a.id, style: { color: '#000' } }, a.label); })),
        h('span', { style: { fontSize: 12, color: '#b8c0d0' } }, 'Started'), h('input', { type: 'time', value: st, onChange: function (e) { setSt(e.target.value); }, style: inp }),
        h('span', { style: { fontSize: 12, color: '#b8c0d0' } }, 'Ended (blank = keep running)'), h('input', { type: 'time', value: en, onChange: function (e) { setEn(e.target.value); }, style: inp }),
        h('button', { onClick: addNew, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 12, padding: '11px 14px', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, 'Add')),
      sec('🗓 MY DAY CLOCK'),
      sd.dayStart ? h(TimeRow, { key: 'ds' + sd.dayStart, label: 'Day clock', start: sd.dayStart, end: sd.dayEnd || null, hasEnd: true, startLabel: 'Started', onSave: function (a, b) { try { syncSet('startday/' + todayKey() + '/' + pid, Object.assign({}, sd, { dayStart: a, dayEnd: b || null })); } catch (e) {} }, onDelete: function () { try { syncSet('startday/' + todayKey() + '/' + pid, null); } catch (e) {} } })
        : h(TimeRow, { key: 'dsn', label: 'Day not started — start it at:', start: null, startLabel: 'Started', onSave: function (a) { try { syncSet('startday/' + todayKey() + '/' + pid, Object.assign({}, sd, { dayStart: a, dayEnd: null, clockedAt: a })); } catch (e) {} } }),
      list.length > 0 && sec('▶ RUNNING NOW'),
      list.map(function (a) { return h(TimeRow, { key: 'r' + a.activity + a.startTime, label: nm(a.activity) + (a.label ? ' — ' + a.label : '') + ' (running)', start: a.startTime, onSave: function (s) { setRun(a, s); }, onDelete: function () { delRun(a); } }); }),
      today.length > 0 && sec('✔ FINISHED TODAY'),
      today.map(function (e, i) { return h(TimeRow, { key: 'e' + i + e.startTime + (e.endTime || ''), label: nm(e.activity) + (e.label ? ' — ' + e.label : ''), start: e.startTime, end: e.endTime || (e.startTime + (e.duration || 0) * 60000), hasEnd: true, onSave: function (s, en2) { setEntry(i, s, en2); }, onDelete: function () { delEntry(i); } }); }),
      Object.keys(hr).length > 0 && sec('🌱 HABIT TIMERS'),
      Object.keys(hr).map(function (per) { return h(TimeRow, { key: 'h' + per + hr[per], label: per + ' habits timer', start: hr[per], onSave: function (s) { try { syncSet('habitsrun/' + day + '/' + pid + '/' + per, s); } catch (e) {} }, onDelete: function () { try { syncSet('habitsrun/' + day + '/' + pid + '/' + per, null); } catch (e) {} } }); }),
      opsMine.length > 0 && sec('🧹 CHORE TIMERS'),
      opsMine.map(function (id) { return h(TimeRow, { key: 'o' + id + op[id].start, label: op[id].label || id, start: op[id].start, onSave: function (s) { try { syncSet('opsprog/' + id, Object.assign({}, op[id], { start: s })); } catch (e) {} }, onDelete: function () { try { syncSet('opsprog/' + id, null); } catch (e) {} } }); }),
      trKeys.length > 0 && sec('📅 SCHEDULE TASK TIMERS'),
      trKeys.map(function (k) { var t = tr[k]; return h(TimeRow, { key: 't' + k + t.start, label: t.title || k, start: t.start, end: t.end || null, hasEnd: true, onSave: function (s, e2) { try { syncSet('taskruns/' + pday + '/' + pid + '/' + k, Object.assign({}, t, { start: s, end: e2 || null })); } catch (e) {} }, onDelete: function () { try { syncSet('taskruns/' + pday + '/' + pid + '/' + k, null); } catch (e) {} } }); }),
      h('div', { style: { fontSize: 11, color: '#9aa', marginTop: 10, lineHeight: 1.5 } }, 'Times are for today. A start time in the future is set to right now. Delete asks you to tap twice.')));
}

// 💬 message bubble next to the bell: unread count, opens the messenger
function MsgBubble(props) {
  var h = React.createElement, pid = props.personId, mS = ktUse('messages', {}), all = mS[0] || {};
  var n = 0; try { Object.keys(all).forEach(function (t) { var arr = all[t]; if (arr && !Array.isArray(arr)) arr = Object.keys(arr).map(function (k) { return arr[k]; }); (arr || []).forEach(function (m) { if (m && m.to === pid && !m.read) n++; }); }); } catch (e) {}
  return h('button', { onClick: props.onClick, title: 'Messages', style: { background: 'transparent', border: 'none', color: n > 0 ? '#64B5F6' : 'rgba(255,255,255,.7)', fontSize: 22, cursor: 'pointer', position: 'relative', minHeight: 44, padding: '0 6px' } }, '💬',
    n > 0 && h('div', { style: { position: 'absolute', top: 2, right: 0, minWidth: 16, height: 16, borderRadius: 8, background: '#EF5350', color: '#fff', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' } }, n));
}

// ═══ ALERTS ON THIS DEVICE: Home Screen install, notification permission, push token, test sound ═══
try { if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); }); } catch (e) {}
function AlertsSetup(props) {
  var h = React.createElement, pid = props.personId, admin = !!props.isAdmin;
  var supported = typeof Notification !== 'undefined', pS = React.useState(supported ? Notification.permission : 'unsupported'), perm = pS[0], setPerm = pS[1];
  var oS = React.useState(false), open = oS[0], setOpen = oS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1], kS = React.useState(''), key = kS[0], setKey = kS[1];
  var vapid = ktUse('push_cfg/vapid', '')[0] || '';
  React.useEffect(function () { if (typeof ntfyWatch === 'function') ntfyWatch(); }, []);
  var lk = 'fm_push_' + pid, on = false; try { on = !!localStorage.getItem(lk); } catch (e) {}
  var ua = navigator.userAgent || '', ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var standalone = false; try { standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; } catch (e) {}
  var btn = function (bg, fg, fn, t) { return h('button', { onClick: fn, style: { background: bg, color: fg, border: 'none', borderRadius: 14, padding: '11px 14px', fontWeight: 800, fontSize: 14, cursor: 'pointer' } }, t); };
  function hash(s) { var x = 0; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return 'd' + (x >>> 0).toString(36); }
  function turnOn() {
    if (!supported) { setMsg(ios && !standalone ? 'On iPhone/iPad, first add this app to the Home Screen (Share ▸ Add to Home Screen), open it from there, then tap this again.' : 'This browser does not support alerts.'); return; }
    try { if (typeof playSound === 'function') playSound('notif'); } catch (e) {}
    Notification.requestPermission().then(function (r) {
      setPerm(r); if (r !== 'granted') { setMsg('Alerts are blocked. Allow notifications for this app in the device Settings, then try again.'); return; }
      var reg = navigator.serviceWorker && navigator.serviceWorker.register ? navigator.serviceWorker.register('sw.js') : Promise.resolve(null);
      return reg.then(function (rg) {
        if (rg && navigator.serviceWorker.ready) return navigator.serviceWorker.ready; return rg;
      }).then(function (rg) {
        if (!vapid) { try { localStorage.setItem(lk, 'local'); } catch (e) {} setMsg('✅ Alerts on while the app is open. For alerts when the app is closed, Laurel needs to finish the Push key step.'); return; }
        if (typeof firebase === 'undefined' || !firebase.messaging) { setMsg('Push library did not load — check your connection and try again.'); return; }
        return firebase.messaging().getToken({ vapidKey: vapid, serviceWorkerRegistration: rg }).then(function (t) {
          if (!t) { setMsg('Could not get a push token.'); return; }
          syncSet('push_tokens/' + pid + '/' + hash(t), { t: t, ua: ua.slice(0, 80), at: Date.now() });
          try { localStorage.setItem(lk, t); } catch (e) {} setMsg('✅ This device will get alerts even when the app is closed.');
        });
      });
    }).catch(function (e) { setMsg('Could not turn on alerts: ' + (e && e.message ? e.message : e)); });
  }
  function testAlert() { try { if (typeof playSound === 'function') playSound('notif'); } catch (e) {} try { fireBrowserNotif('Test alert', 'If you can see and hear this, alerts work on this device.'); } catch (e) {} setMsg('Sent a test — you should hear the chime' + (perm === 'granted' ? ' and see a banner.' : '. Turn on alerts to also see a banner.')); }
  return h('div', { style: { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 14, padding: 10, marginBottom: 10 } },
    h('button', { onClick: function () { setOpen(!open); }, style: { width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', textAlign: 'left', padding: 0, minHeight: 36 } },
      h('span', { style: { flex: 1 } }, '🔔 Alerts & sound on this device'), h('span', { style: { fontSize: 12, color: perm === 'granted' ? '#7be3ae' : '#FFB74D' } }, perm === 'granted' ? 'On ✓' : 'Not on yet'), h('span', null, open ? '▾' : '▸')),
    open && h('div', { style: { marginTop: 8 } },
      msg && h('div', { style: { background: 'rgba(0,0,0,.3)', borderRadius: 10, padding: 8, fontSize: 13, color: '#fff', marginBottom: 8, lineHeight: 1.5 } }, msg),
      !standalone && h('div', { style: { fontSize: 13, color: '#e0e6f0', lineHeight: 1.6, marginBottom: 8 } }, ios ? '📲 iPhone/iPad: tap the Share button ▸ "Add to Home Screen", then open the app from that new icon. Alerts only work from the Home Screen icon.' : '📲 Android: tap ⋮ ▸ "Install app" / "Add to Home screen", then open it from the new icon.'),
      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, btn('#4CAF82', '#000', turnOn, perm === 'granted' ? '🔔 Re-register this device' : '🔔 Turn on alerts'), btn('#FFD54F', '#000', testAlert, '🔊 Test sound & alert')),
      h('div', { style: { fontSize: 11, color: '#9aa', marginTop: 8, lineHeight: 1.5 } }, 'The happy chime plays when the app is open (turn the volume up; iPhone silent switch mutes it). When the app is closed the phone uses its own notification sound.'),
      typeof NtfyCard === 'function' && h(NtfyCard, { personId: pid, isAdmin: admin, family: props.family }),
      admin && h('div', { style: { marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.1)' } },
        h('div', { style: { fontSize: 12, color: '#C5B8E8', fontWeight: 800, marginBottom: 4 } }, 'ADVANCED — PUSH KEY (Laurel, one time) ' + (vapid ? '✓ saved' : '— not set')),
        h('div', { style: { display: 'flex', gap: 6 } }, h('input', { value: key, onChange: function (e) { setKey(e.target.value); }, placeholder: 'Paste the Web Push key here', style: { flex: 1, minWidth: 0, background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, color: '#fff', padding: 9, fontSize: 13 } }), btn('#FFB74D', '#000', function () { if (key.trim()) { syncSet('push_cfg/vapid', key.trim()); setKey(''); setMsg('✅ Push key saved. Now tap "Re-register this device" on each device.'); } }, 'Save')))));
}

// ═══ OUTSIDE-THE-APP ALERTS via ntfy (free): real phone notifications with the app closed / screen off ═══
var NTFY_BASE = 'https://ntfy.sh';
window._ntfyTopics = window._ntfyTopics || {};
function ntfyWatch() { if (window._ntfyWatching) return; window._ntfyWatching = true; try { syncOn('push_cfg/ntfy', function (d) { window._ntfyTopics = d || {}; }); } catch (e) { window._ntfyWatching = false; } }
function ntfyPost(topic, title, message, priority, tags) {
  try { fetch(NTFY_BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: topic, title: String(title || 'MyBethelFamilyHome').slice(0, 120), message: String(message || '').slice(0, 500) || ' ', priority: priority || 3, tags: tags || [], click: location.href.split('#')[0] }) }).catch(function () {}); } catch (e) {}
}
window._ntfyNotif = function (n) {
  try {
    var T = window._ntfyTopics || {}, cfg = null; try { cfg = syncGet('notify_cfg'); } catch (e) {}
    var me = window._loginPersonId, pr = n.type === 'page' || n.urgent ? 5 : (n.type === 'message' || n.requiresApproval ? 4 : 3), tag = n.type === 'page' ? ['rotating_light'] : n.type === 'message' ? ['speech_balloon'] : ['bell'];
    Object.keys(T).forEach(function (id) {
      if (!T[id] || (id === me && n.type !== 'test')) return;
      var want = typeof ncWants === 'function' ? ncWants(id, n, cfg) : (n.personId === id || n.personId === 'all');
      if (n.type === 'page' || n.type === 'test') want = n.personId === id;
      if (n.requiresApproval && id === 'laurel') want = true;
      if (want) ntfyPost(T[id], n.title, n.message, pr, tag);
    });
  } catch (e) {}
};
function NtfyCard(props) {
  var h = React.createElement, pid = props.personId, admin = !!props.isAdmin, fam = (props.family || []).filter(function (p) { return !p.deleted && p.role !== 'elder' && p.id !== 'grandpa'; });
  React.useEffect(function () { ntfyWatch(); }, []);
  var T = ktUse('push_cfg/ntfy', {})[0] || {}, C = ktUse('contacts', {})[0] || {}, mS = React.useState(''), msg = mS[0], setMsg = mS[1], fS = React.useState({}), f = fS[0], setF = fS[1];
  var mine = T[pid] || '', ua = navigator.userAgent || '', ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var btn = function (bg, fg, fn, t) { return h('button', { onClick: fn, style: { background: bg, color: fg, border: 'none', borderRadius: 14, padding: '11px 14px', fontWeight: 800, fontSize: 14, cursor: 'pointer' } }, t); };
  var link = function (bg, fg, href, t) { return h('a', { href: href, target: '_blank', rel: 'noopener', style: { background: bg, color: fg, borderRadius: 14, padding: '11px 14px', fontWeight: 800, fontSize: 14, textDecoration: 'none', display: 'inline-block' } }, t); };
  var inp = { background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, color: '#fff', padding: 9, fontSize: 14, minWidth: 0 };
  function make(id) { var al = 'abcdefghjkmnpqrstuvwxyz23456789', r = ''; for (var i = 0; i < 12; i++) r += al[Math.floor(Math.random() * al.length)]; syncSet('push_cfg/ntfy/' + id, 'bethel-' + id + '-' + r); setMsg('✅ Alert address created.'); }
  function test(id) { if (!T[id]) { setMsg('Create the alert address first.'); return; } ntfyPost(T[id], '🧪 Test alert', 'If this appears with the app closed, outside alerts work!', 4, ['white_check_mark']); setMsg('Sent a test. It should pop up on that phone within a few seconds.'); }
  function copy(t) { try { navigator.clipboard.writeText(t); setMsg('Copied.'); } catch (e) { setMsg(t); } }
  function saveC(id) { var v = { phone: (f[id + 'p'] != null ? f[id + 'p'] : (C[id] || {}).phone || '').trim(), email: (f[id + 'e'] != null ? f[id + 'e'] : (C[id] || {}).email || '').trim() }; syncSet('contacts/' + id, v); setMsg('✅ Saved contact info.'); }
  var setup = function (id, name) { return 'Hi ' + name + '! To get My Bethel Family alerts even when the app is closed: 1) install the free "ntfy" app, 2) tap this link: ntfy://ntfy.sh/' + T[id] + '  (or in ntfy tap + and type: ' + T[id] + ')'; };
  return h('div', { style: { marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.12)' } },
    h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 4 } }, '📱 Alerts when the app is closed or the screen is off'),
    h('div', { style: { fontSize: 12, color: '#c8c8d8', lineHeight: 1.6, marginBottom: 8 } }, 'This uses the free ntfy app. It lights up the phone, plays a sound and vibrates even when the app is swiped away or the phone is asleep.'),
    msg && h('div', { style: { background: 'rgba(0,0,0,.3)', borderRadius: 10, padding: 8, fontSize: 13, color: '#fff', marginBottom: 8 } }, msg),
    !mine ? btn('#4CAF82', '#000', function () { make(pid); }, '1️⃣ Create my alert address')
      : h('div', null,
        h('div', { style: { fontSize: 13, color: '#e0e6f0', lineHeight: 1.7, marginBottom: 8 } }, h('b', null, '2️⃣ Install the free "ntfy" app'), ios ? ' from the App Store' : ' from Google Play (or F-Droid)', '. ', h('b', null, '3️⃣ Tap "Subscribe"'), ' below — or in ntfy tap + and type your address:', h('div', { style: { fontFamily: 'monospace', background: 'rgba(0,0,0,.35)', padding: 8, borderRadius: 8, margin: '6px 0', wordBreak: 'break-all' } }, mine)),
        h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, link('#039BE5', '#fff', 'ntfy://ntfy.sh/' + mine, '3️⃣ Subscribe in ntfy'), btn('rgba(255,255,255,.15)', '#fff', function () { copy(mine); }, '📋 Copy address'), btn('#FFD54F', '#000', function () { test(pid); }, '🧪 Send me a test')),
        h('div', { style: { fontSize: 12, color: '#9aa', lineHeight: 1.6, marginTop: 8 } }, ios ? 'iPhone: nothing else needed. Allow notifications for ntfy when asked.' : 'Android power saver: Settings ▸ Apps ▸ ntfy ▸ Battery ▸ set to Unrestricted. In ntfy settings turn on notifications for all priority levels.')),
    admin && h('div', { style: { marginTop: 12 } },
      h('div', { style: { fontSize: 12, color: '#C5B8E8', fontWeight: 900, letterSpacing: 1, marginBottom: 6 } }, 'FAMILY (Laurel) — alert address, phone & email'),
      fam.map(function (p) { var has = !!T[p.id], c = C[p.id] || {};
        return h('div', { key: p.id, style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 } }, h('b', { style: { color: '#fff', flex: 1 } }, (p.emoji || '') + ' ' + p.name),
            !has ? btn('#4CAF82', '#000', function () { make(p.id); }, 'Create address') : [btn('#FFD54F', '#000', function () { test(p.id); }, '🧪 Test'), h('a', { key: 's', href: 'sms:' + (c.phone || '') + '?&body=' + encodeURIComponent(setup(p.id, p.name)), style: { background: '#039BE5', color: '#fff', borderRadius: 14, padding: '11px 14px', fontWeight: 800, fontSize: 13, textDecoration: 'none' } }, '📱 Text setup'), c.email && h('a', { key: 'e', href: 'mailto:' + c.email + '?subject=' + encodeURIComponent('Set up My Bethel alerts') + '&body=' + encodeURIComponent(setup(p.id, p.name)), style: { background: '#FFB74D', color: '#000', borderRadius: 14, padding: '11px 14px', fontWeight: 800, fontSize: 13, textDecoration: 'none' } }, '✉️ Email setup')]),
          h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
            h('input', { type: 'tel', placeholder: 'Phone', value: f[p.id + 'p'] != null ? f[p.id + 'p'] : (c.phone || ''), onChange: function (e) { var o = {}; o[p.id + 'p'] = e.target.value; setF(Object.assign({}, f, o)); }, style: Object.assign({}, inp, { flex: 1 }) }),
            h('input', { type: 'email', placeholder: 'Email', value: f[p.id + 'e'] != null ? f[p.id + 'e'] : (c.email || ''), onChange: function (e) { var o = {}; o[p.id + 'e'] = e.target.value; setF(Object.assign({}, f, o)); }, style: Object.assign({}, inp, { flex: 1 }) }),
            btn('#FFB74D', '#000', function () { saveC(p.id); }, 'Save'))); }),
      h('div', { style: { fontSize: 11, color: '#9aa', lineHeight: 1.6, marginTop: 8 } }, 'Phone & email add 📞 call, 📱 text and ✉️ email buttons next to each person in the Family status. Alerts are sent from whichever device the action happens on, so the app must be open on the device that triggers it (for example, a child finishing a chore).')));
}

// ═══ MY BETHEL FAMILY — AT A GLANCE: one compact section for everyone (family clock status + each person's day) ═══
function FamilyGlance(props) {
  var h = React.createElement, fam = (props.family || []).filter(function (p) { return !p.deleted && p.id !== 'grandpa' && p.role !== 'elder'; });
  var cS = ktUse('glance_cfg', null), show = (cS[0] || {}).show || null, oS = React.useState(false), setOpen = oS[1], open = oS[0], tS = React.useState(0), setT = tS[1], aS = React.useState(false), tm = aS[0], setTm = aS[1];
  var fS = React.useState({}), ages = fS[0], setAges = fS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  React.useEffect(function () { var iv = setInterval(function () { setT(function (x) { return x + 1; }); }, 10000); return function () { clearInterval(iv); }; }, []);
  window._foldMem = window._foldMem || {};
  var shS = React.useState(window._foldMem.glance !== true), shut = shS[0], setShut = shS[1];
  function togShut() { var n = !shut; setShut(n); window._foldMem.glance = !n; }
  var isOn = function (p) { return !show || show[p.id] !== false; };
  function setShow(id, v) { var n = Object.assign({}, show || {}); fam.forEach(function (p) { if (n[p.id] == null) n[p.id] = true; }); n[id] = v; try { syncSet('glance_cfg', { show: n }); } catch (e) {} }
  function setAll(v) { var n = {}; fam.forEach(function (p) { n[p.id] = v; }); try { syncSet('glance_cfg', { show: n }); } catch (e) {} }
  function saveAge(p) { var v = ages[p.id]; if (v == null || v === '') return; var a = Math.max(0, Math.min(99, parseInt(v, 10))); if (isNaN(a)) return; try { syncSet('people/' + p.id, Object.assign({}, p, { age: a })); setMsg('✅ ' + p.name + ' is now ' + a); } catch (e) {} }
  var shown = fam.filter(isOn), anyOn = 0;
  var chip = function (on) { return { background: on ? 'rgba(76,175,130,.3)' : 'rgba(255,255,255,.08)', color: '#fff', border: '2px solid ' + (on ? '#4CAF82' : 'rgba(255,255,255,.2)'), borderRadius: 14, padding: '9px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' }; };
  return h('div', { style: { margin: '10px 14px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: 14 } },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } }, h('button', { onClick: togShut, style: { flex: 1, textAlign: 'left', background: 'transparent', border: 'none', color: '#fff', fontSize: 15, fontWeight: 900, cursor: 'pointer', padding: '6px 0', minHeight: 40 } }, '🏠 My Bethel Family — at a glance ' + (shut ? '▸' : '▾')),
      !shut && h('button', { onClick: function () { setOpen(!open); }, style: { background: open ? '#FFB74D' : 'rgba(255,255,255,.12)', color: open ? '#000' : '#fff', border: 'none', borderRadius: 12, padding: '9px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, '⚙ Who shows')),
    !shut && h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.45)', margin: '2px 0 6px' } }, 'Where everyone is right now. Tap a name for the full breakdown, timers and message / page / call buttons.'),
    !shut && open && h('div', { style: { background: 'rgba(0,0,0,.25)', borderRadius: 12, padding: 10, marginBottom: 8 } },
      msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 10, padding: 6, fontWeight: 800, fontSize: 13, marginBottom: 6 } }, msg),
      h('div', { style: { fontSize: 12, fontWeight: 900, color: '#C5B8E8', letterSpacing: 1, marginBottom: 6 } }, 'CHOOSE WHO SHOWS'),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 } }, fam.map(function (p) { var on = isOn(p); return h('button', { key: p.id, onClick: function () { setShow(p.id, !on); }, style: chip(on) }, (on ? '✅ ' : '⬜ ') + (p.emoji || '') + ' ' + p.name); }),
        h('button', { onClick: function () { setAll(true); }, style: chip(false) }, 'All'), h('button', { onClick: function () { setAll(false); }, style: chip(false) }, 'None')),
      h('div', { style: { fontSize: 12, fontWeight: 900, color: '#C5B8E8', letterSpacing: 1, margin: '6px 0' } }, 'AGES'),
      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, fam.map(function (p) {
        return h('div', { key: p.id, style: { display: 'flex', alignItems: 'center', gap: 4 } }, h('span', { style: { fontSize: 13, color: '#fff' } }, p.name),
          h('input', { type: 'number', inputMode: 'numeric', min: 0, max: 99, defaultValue: p.age || '', key: p.id + (p.age || ''), onChange: function (e) { var o = {}; o[p.id] = e.target.value; setAges(Object.assign({}, ages, o)); }, placeholder: 'age', style: { width: 62, background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, color: '#fff', padding: 8, fontSize: 15 } }),
          h('button', { onClick: function () { saveAge(p); }, style: { background: '#FFD54F', color: '#000', border: 'none', borderRadius: 10, padding: '9px 10px', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, 'Save'));
      }))),
    !shut && shown.length === 0 && h('div', { style: { color: '#9aa', fontSize: 13, padding: 8 } }, 'Nobody is chosen. Tap ⚙ Who shows and pick the people you want to see.'),
    (shut ? [] : shown).map(function (p) {
      return h(KidStatRow, { key: p.id, person: p, sessions: props.sessions, schedHook: props.schedHook, onUpdate: props.onUpdate, addNotif: props.addNotif,
        extra: typeof FamilyStatusTop === 'function' ? h(FamilyStatusTop, { sessions: props.sessions, family: [p], onUpdate: props.onUpdate, setTab: props.setTab, bare: true }) : null });
    }),
    !shut && h('button', { onClick: function () { setTm(!tm); }, style: { width: '100%', textAlign: 'left', marginTop: 8, background: 'rgba(192,202,51,.12)', border: '1px solid rgba(192,202,51,.4)', borderRadius: 12, padding: 11, color: '#E6EE9C', fontWeight: 900, fontSize: 14, cursor: 'pointer' } }, '⏱ Admin time management ' + (tm ? '▲' : '▼')),
    !shut && tm && typeof AdminTimeEditor === 'function' && h(AdminTimeEditor, { sessions: props.sessions, family: props.family, onUpdate: props.onUpdate, syncSet: syncSet }));
}

// ═══ SCHOOL: starts blank. Admin adds curriculum day by day, or loads the DKA 180-day set. ═══
function DKAModule(props) {
  var h = React.createElement, cfg = ktUse('school/curriculum_cfg', null)[0] || {}, cS = React.useState(false), conf = cS[0], setConf = cS[1];
  var admin = !!(props.isTeacher || props.isAdmin);
  if (cfg.enabled !== false) {
    return h('div', null,
      admin && h('div', { style: { margin: '8px 14px 0', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: 8 } },
        h('span', { style: { flex: 1, fontSize: 12, color: '#c8c8d8' } }, '📚 Curriculum loaded: Discovering Kids Academy 180-day'),
        h('button', { onClick: function () { if (!conf) { setConf(true); setTimeout(function () { setConf(false); }, 4000); return; } setConf(false); try { syncSet('school/curriculum_cfg', { enabled: false }); } catch (e) {} }, style: { background: conf ? '#EF5350' : 'rgba(239,83,80,.25)', color: conf ? '#fff' : '#FF8A80', border: 'none', borderRadius: 12, padding: '10px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, conf ? 'Tap again — hide it' : '↺ Reset school to blank')),
      h(DKAModuleFull, props));
  }
  return h(SchoolBlank, props);
}
function SchoolBlank(props) {
  var h = React.createElement, admin = !!(props.isTeacher || props.isAdmin), pid = props.personId;
  var iso = typeof tcIso === 'function' ? tcIso(new Date()) : '', allS = ktUse('school/custom', {}), all = allS[0] || {};
  var fS = React.useState({ date: iso, title: '', scripture: '', notes: '', tasks: {} }), f = fS[0], setF = fS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1], dS = React.useState(''), delK = dS[0], setDelK = dS[1], lS = React.useState(false), loadC = lS[0], setLoadC = lS[1];
  var kids = (props.family || (typeof DEFAULT_FAMILY !== 'undefined' ? DEFAULT_FAMILY : [])).filter(function (p) { return !p.deleted && p.role === 'child'; });
  var inp = { background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 15, width: '100%', boxSizing: 'border-box' };
  var today = all[iso], dates = Object.keys(all).filter(function (k) { return all[k]; }).sort();
  function save() {
    if (!f.date || !f.title.trim()) { setMsg('Add a date and a title.'); return; }
    var tasks = {}; Object.keys(f.tasks || {}).forEach(function (k) { if ((f.tasks[k] || '').trim()) tasks[k] = f.tasks[k].trim(); });
    try { syncSet('school/custom/' + f.date, { title: f.title.trim(), scripture: f.scripture.trim(), notes: f.notes, tasks: tasks, at: Date.now() }); setMsg('✅ Saved ' + f.date); } catch (e) {}
  }
  function edit(k) { var e = all[k] || {}; setF({ date: k, title: e.title || '', scripture: e.scripture || '', notes: e.notes || '', tasks: e.tasks || {} }); try { window.scrollTo(0, 0); } catch (x) {} }
  function del(k) { if (delK !== k) { setDelK(k); setTimeout(function () { setDelK(''); }, 4000); return; } setDelK(''); try { syncSet('school/custom/' + k, null); } catch (e) {} }
  var card = { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 12, margin: '10px 14px' };
  var mine = today && today.tasks && today.tasks[pid];
  return h('div', null,
    h('div', { style: card }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff' } }, '🏫 School'),
      h('div', { style: { fontSize: 13, color: '#c8c8d8', marginTop: 4, lineHeight: 1.6 } }, admin ? 'No curriculum is loaded. Add lessons below whenever you are ready, or load the Discovering Kids Academy 180-day set.' : 'No lessons are loaded yet. Ask Mom or Dad when school will start.')),
    today && h('div', { style: Object.assign({}, card, { borderColor: '#4CAF82' }) },
      h('div', { style: { fontSize: 12, fontWeight: 900, color: '#7be3ae', letterSpacing: 1 } }, 'TODAY'), h('div', { style: { fontSize: 18, fontWeight: 900, color: '#fff', margin: '4px 0' } }, today.title),
      today.scripture && h('div', { style: { fontSize: 14, color: '#E0D7F5' } }, '📖 ' + today.scripture),
      mine && h('div', { style: { background: 'rgba(255,213,79,.15)', borderRadius: 10, padding: 10, margin: '8px 0', fontSize: 15, color: '#fff' } }, '✏️ Your assignment: ' + mine),
      admin && today.notes && h('div', { style: { whiteSpace: 'pre-wrap', fontSize: 15, color: '#f2f2f8', lineHeight: 1.7, marginTop: 8 } }, today.notes)),
    admin && h('div', { style: card },
      h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 8 } }, '➕ Add or edit a lesson'),
      msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 10, padding: 7, fontWeight: 800, fontSize: 13, marginBottom: 8 } }, msg),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        h('input', { type: 'date', value: f.date, onChange: function (e) { setF(Object.assign({}, f, { date: e.target.value })); }, style: inp }),
        h('input', { type: 'text', placeholder: 'Lesson title', value: f.title, onChange: function (e) { setF(Object.assign({}, f, { title: e.target.value })); }, style: inp }),
        h('input', { type: 'text', placeholder: 'Scripture / subject (optional)', value: f.scripture, onChange: function (e) { setF(Object.assign({}, f, { scripture: e.target.value })); }, style: inp }),
        h('textarea', { rows: 6, placeholder: 'Teacher notes or script — only parents see this', value: f.notes, onChange: function (e) { setF(Object.assign({}, f, { notes: e.target.value })); }, style: Object.assign({}, inp, { fontFamily: 'inherit' }) }),
        kids.map(function (k) { return h('input', { key: k.id, type: 'text', placeholder: k.name + '’s assignment (optional)', value: (f.tasks || {})[k.id] || '', onChange: function (e) { var t = Object.assign({}, f.tasks || {}); t[k.id] = e.target.value; setF(Object.assign({}, f, { tasks: t })); }, style: inp }); }),
        h('button', { onClick: save, style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 14, padding: 14, fontWeight: 900, fontSize: 16, cursor: 'pointer' } }, 'Save lesson'))),
    admin && dates.length > 0 && h('div', { style: card }, h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '📅 Saved lessons'),
      dates.map(function (k) { return h('div', { key: k, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderTop: '1px solid rgba(255,255,255,.08)' } }, h('div', { style: { flex: 1, color: '#fff', fontSize: 14 } }, k + ' — ' + all[k].title),
        h('button', { onClick: function () { edit(k); }, style: { background: '#FFB74D', color: '#000', border: 'none', borderRadius: 12, padding: '9px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, 'Edit'),
        h('button', { onClick: function () { del(k); }, style: { background: delK === k ? '#EF5350' : 'rgba(239,83,80,.25)', color: delK === k ? '#fff' : '#FF8A80', border: 'none', borderRadius: 12, padding: '9px 12px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, delK === k ? 'Tap again' : '🗑')); })),
    admin && typeof TakeAttendance === 'function' && h('div', { style: { margin: '10px 14px' } }, h(TakeAttendance, { family: props.family || (typeof DEFAULT_FAMILY !== 'undefined' ? DEFAULT_FAMILY : []) })),
    admin && h('div', { style: card },
      h('div', { style: { fontSize: 13, color: '#c8c8d8', marginBottom: 8 } }, 'Want the full Discovering Kids Academy 180-day curriculum back?'),
      h('button', { onClick: function () { if (!loadC) { setLoadC(true); setTimeout(function () { setLoadC(false); }, 4000); return; } setLoadC(false); try { syncSet('school/curriculum_cfg', { enabled: true }); } catch (e) {} }, style: { background: loadC ? '#4CAF82' : 'rgba(255,255,255,.12)', color: loadC ? '#000' : '#fff', border: 'none', borderRadius: 14, padding: '12px 14px', fontWeight: 800, fontSize: 14, cursor: 'pointer' } }, loadC ? 'Tap again to load it' : '📚 Load the DKA 180-day curriculum')));
}

// ═══ Fold: a tidy drop-down box. Tap the title to open, tap again to close. Remembers its state on this device. ═══
function Fold(props) {
  var h = React.createElement, key = props.id; window._foldMem = window._foldMem || {};
  var oS = React.useState(window._foldMem[key] === true), open = oS[0], setOpen = oS[1];
  function tog() { var n = !open; setOpen(n); window._foldMem[key] = n; }
  var kids = React.Children ? React.Children.toArray(props.children) : [].concat(props.children || []);
  return h('div', { style: { margin: '8px 14px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, overflow: 'hidden' } },
    h('button', { onClick: tog, style: { width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: open ? 'rgba(255,255,255,.07)' : 'transparent', border: 'none', color: '#fff', padding: '13px 14px', minHeight: 48, fontSize: 15, fontWeight: 800, cursor: 'pointer', textAlign: 'left' } },
      h('span', { style: { flex: 1 } }, props.title), props.badge ? h('span', { style: { background: '#EF5350', color: '#fff', borderRadius: 10, padding: '2px 8px', fontSize: 12 } }, props.badge) : null, h('span', { style: { fontSize: 16, color: '#b8c0d0' } }, open ? '▾' : '▸')),
    open && h('div', { style: { padding: '2px 0 8px' } }, kids));
}

// ← Back / Home bar shown at the top of every page except the home page
function BackBar(props) {
  var h = React.createElement, b = function (bg, fg, fn, t) { return h('button', { onClick: fn, style: { background: bg, color: fg, border: 'none', borderRadius: 16, padding: '12px 18px', fontWeight: 900, fontSize: 15, cursor: 'pointer', minHeight: 46 } }, t); };
  return h('div', { style: { display: 'flex', gap: 8, padding: '8px 0 10px' } }, b('#4CAF82', '#000', props.onBack, '← Back'), b('rgba(255,255,255,.14)', '#fff', props.onHome, '🏠 ' + (props.homeLabel || 'Home')));
}
