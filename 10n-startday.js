// ═══ START MY DAY — kids: 1) clock in  2) get ready  3) follow the schedule ═══
function StartMyDay(props) {
  var h = React.createElement, pid = props.personId, nm = props.name || '';
  var sdS = ktUse('startday/' + todayKey() + '/' + pid, null), sd = sdS[0] || {};
  var sesAll = props.sessions || {}, mine = sesAll[pid] || {};
  var running = typeof clockActiveList === 'function' ? clockActiveList(mine) : [];
  var todayList = mine.today || [];
  var clocked = !!sd.dayStart;
  var ready = !!sd.readyAt;
  var oS = React.useState(null), openStep = oS[0], setOpen = oS[1];
  // remember the first clock-in of the day
  React.useEffect(function () { if (false && running.length > 0 && !sd.clockedAt) { try { syncSet('startday/' + todayKey() + '/' + pid, Object.assign({}, sd, { clockedAt: Date.now() })); } catch (e) {} } });
  var cfgS = ktUse('startday_cfg', null), cfg = cfgS[0] || {};
  var limMin = cfg.mins != null && cfg.mins !== '' ? +cfg.mins : 15, penOn = cfg.off ? false : true;
  var mode = window._payMode || 'pay';
  var penAmt = mode === 'points' ? (cfg.pts != null && cfg.pts !== '' ? +cfg.pts : 5) : (cfg.cash != null && cfg.cash !== '' ? +cfg.cash : 0.5);
  var tkS = React.useState(0), setTk = tkS[1];
  React.useEffect(function () { var iv = setInterval(function () { setTk(function (x) { return x + 1; }); }, 1000); return function () { clearInterval(iv); }; }, []);
  var deadline = sd.dayStart ? sd.dayStart + limMin * 60000 : 0, left = deadline ? Math.round((deadline - Date.now()) / 1000) : 0;
  var lateNow = !!deadline && left < 0 && !ready;
  React.useEffect(function () {
    if (!deadline || sd.penalized || sd.readyAt && sd.readyAt <= deadline || Date.now() <= deadline) return;
    var applied = null;
    if (penOn && penAmt > 0 && typeof window._deductFn === 'function') { try { window._deductFn(pid, penAmt, '⏰ Not ready for the day on time'); applied = { amt: penAmt, mode: mode }; } catch (e) {} }
    try { syncSet('startday/' + todayKey() + '/' + pid, Object.assign({}, sd, { penalized: true, penalty: applied, lateAt: Date.now() })); } catch (e) {}
    if (props.addNotif) { try { props.addNotif('info', pid, '⏰ ' + (nm || pid) + ' was not ready on time', applied ? 'Deducted ' + (mode === 'points' ? applied.amt + ' pts' : '$' + applied.amt.toFixed(2)) : 'No deduction set', { id: 'late_' + todayKey() + '_' + pid }); } catch (e) {} }
  });
  var step = !clocked ? 1 : !ready ? 2 : 3;
  var cur = openStep || step;
  var hour = new Date().getHours(), greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  var C = { done: '#4CAF82', now: '#FFD54F', lock: 'rgba(255,255,255,.25)' };
  function head(n, icon, title, state, sub) {
    var col = state === 'done' ? C.done : state === 'now' ? C.now : C.lock;
    return h('div', { onClick: function () { if (state !== 'lock') setOpen(cur === n && openStep ? null : n); }, style: { display: 'flex', alignItems: 'center', gap: 12, cursor: state === 'lock' ? 'default' : 'pointer' } },
      h('div', { style: { width: 46, height: 46, borderRadius: '50%', background: state === 'done' ? C.done : 'transparent', border: '3px solid ' + col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: state === 'done' ? 24 : 22, color: state === 'done' ? '#000' : '#fff', flexShrink: 0 } }, state === 'done' ? '✓' : state === 'lock' ? '🔒' : icon),
      h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 18, fontWeight: 900, color: state === 'lock' ? 'rgba(255,255,255,.4)' : '#fff' } }, n + '. ' + title), h('div', { style: { fontSize: 13, color: state === 'lock' ? 'rgba(255,255,255,.3)' : '#c8c8d8' } }, sub)));
  }
  function box(n, state, children) { return h('div', { style: { background: state === 'now' ? 'rgba(255,213,79,.08)' : 'rgba(255,255,255,.05)', border: '2px solid ' + (state === 'now' ? C.now : state === 'done' ? 'rgba(76,175,130,.5)' : 'rgba(255,255,255,.1)'), borderRadius: 18, padding: 14, marginBottom: 12 } }, children); }
  var s1 = clocked ? 'done' : 'now', s2 = !clocked ? 'lock' : ready ? 'done' : 'now', s3 = !ready ? 'lock' : 'now';
  var go = function (t) { return function () { props.onSwitchTab && props.onSwitchTab(t); }; };
  var big = function (bg, fg, fn, label) { return h('button', { onClick: fn, style: { display: 'block', width: '100%', background: bg, color: fg, border: 'none', borderRadius: 16, padding: '16px 14px', fontWeight: 900, fontSize: 17, marginTop: 8, cursor: 'pointer', textAlign: 'left' } }, label); };
  return h('div', { style: { padding: '8px 14px 24px' } },
    h('div', { style: { fontSize: 24, fontWeight: 900, color: '#fff' } }, greet + (nm ? ', ' + nm : '') + '! 👋'),
    h('div', { style: { fontSize: 14, color: '#c8c8d8', margin: '2px 0 14px' } }, new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) + ' — do these 3 steps in order.'),
    props.topEl,
    props.safetyEl,
    box(1, s1, h('div', null, head(1, '⏱', 'Start my day', s1, clocked ? 'Your day is running ✔' : 'Tap the green button'), (cur === 1 || clocked) && h('div', { style: { marginTop: 10 } }, props.dayEl))),
    box(2, s2, h('div', null, head(2, '🌱', 'My daily habits', s2, s2 === 'lock' ? 'Start your day first' : ready ? 'Ready for the day ✔ — habits stay here all day' : 'Morning, afternoon & evening — one step at a time'),
      s2 !== 'lock' && (cur === 2) && h('div', { style: { marginTop: 10 } },
        !ready && deadline > 0 && h('div', { style: { textAlign: 'center', padding: 12, marginBottom: 10, borderRadius: 14, background: lateNow ? 'rgba(239,83,80,.2)' : 'rgba(255,213,79,.12)', border: '2px solid ' + (lateNow ? '#EF5350' : '#FFD54F') } },
          h('div', { style: { fontSize: 12, fontWeight: 900, color: lateNow ? '#FF8A80' : '#FFD54F', letterSpacing: 1 } }, lateNow ? '⏰ TIME IS UP' : '⏳ GET READY — YOU HAVE ' + limMin + ' MINUTES'),
          h('div', { style: { fontSize: 36, fontWeight: 900, color: '#fff', fontFamily: 'ui-monospace,Menlo,monospace' } }, (left < 0 ? '+' : '') + Math.floor(Math.abs(left) / 60) + ':' + ('0' + (Math.abs(left) % 60)).slice(-2)),
          h('div', { style: { fontSize: 12, color: '#e0e0ee' } }, lateNow ? (sd.penalty ? 'Late — ' + (sd.penalty.mode === 'points' ? sd.penalty.amt + ' pts' : '$' + sd.penalty.amt.toFixed(2)) + ' was taken from your account.' : 'You are late. A parent will see this.') : (penOn && penAmt > 0 ? 'Finish before it hits 0:00 or ' + (mode === 'points' ? penAmt + ' pts' : '$' + penAmt.toFixed(2)) + ' comes out of your account.' : 'Finish before it hits 0:00.'))),
        ready && sd.lateAt && h('div', { style: { fontSize: 12, color: '#FF8A80', marginBottom: 8 } }, '⏰ You finished late today.'),
        props.habitsAllEl,
        !ready && big('#4CAF82', '#000', function () { try { syncSet('startday/' + todayKey() + '/' + pid, Object.assign({}, sd, { readyAt: Date.now() })); } catch (e) {} setOpen(null); }, "✅ I'm ready for the day"),
        ready && big('rgba(255,255,255,.1)', '#fff', function () { try { syncSet('startday/' + todayKey() + '/' + pid, Object.assign({}, sd, { readyAt: null })); } catch (e) {} }, '↩ Not ready yet')))),
    box(3, s3, h('div', null, head(3, '📋', 'Follow my schedule', s3, s3 === 'lock' ? 'Get ready first' : 'Pick what is next'),
      s3 !== 'lock' && h('div', null,
        props.rightNow, props.clockEl, props.planEl,
        big('#039BE5', '#fff', go('work'), '🏫  School & Worship'),
        big('#26A69A', '#fff', go('chores'), '🧹  Chores & order of operations')))),
    h('div', { style: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 6, lineHeight: 1.6 } }, 'Your parents can see when you clock in and finish each step.'));
}
