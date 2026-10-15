// ═══ v40 MONEY SKILLS — school, chores & SOP steps become a "job"; kids learn to give, save and spend wisely ═══
// Data (argilan/): finplan/cfg · finplan/p/<pid> · finplan/goals/<id>. Nothing existing is modified.
var FP_KIDS = ['mykah', 'ashelyn', 'kayla', 'ryan'];
var FP_CFG_DEF = { rates: { mykah: 0.5, ashelyn: 0.75, kayla: 1, ryan: 1.25 }, split: { give: 10, house: 10, save: 50, spend: 30 }, cap: 5, sopPay: 0.25 };
var FP_BUCKETS = [['give', '🤲 Give', 'Giving to others and helping with the work of the congregation. Acts 20:35'], ['house', '🏠 Household contribution', 'Shared family costs — like taxes, it pays for things we all use.'], ['save', '🏦 Save', 'Money for later, for goals and for emergencies. This is the biggest part.'], ['spend', '🛍 Spend', 'Money you may choose to spend wisely.']];
var FP_SCRIPT = [
  ['Luke 16:10', 'The one faithful in what is least is faithful in much too. Small jobs done well train us for big ones.'],
  ['Ecclesiastes 3:13', 'It is a gift of God when a person can eat, drink and find good in all their hard work.'],
  ['Proverbs 21:5', 'The plans of the diligent surely lead to success. Plan first, then work the plan.'],
  ['Proverbs 13:11', 'Gathering little by little makes it grow. Small savings add up.'],
  ['Luke 14:28', 'Before building, sit down and count the cost. Budget before you buy.'],
  ['Acts 20:35', 'There is more happiness in giving than in receiving.'],
  ['Colossians 3:23', 'Work at it whole-souled, as for Jehovah, not for men.'],
  ['Proverbs 6:6-8', 'Consider the ant: it prepares its food in the summer without anyone telling it to.'],
  ['Proverbs 22:7', 'The borrower is a slave to the lender, so think hard before you borrow.']
];
var FP_SOPS = [
  ['morning', '🌅 Morning routine', ['Wake up and make your bed', 'Wash up and get dressed', 'Daily text and prayer', 'Breakfast, then clean your dishes', 'Tidy your room', 'Ready for school on time']],
  ['school', '📚 School day', ['Daily text and prayer', 'Do each lesson in the schedule order', 'Check your own work', 'Put away school supplies', 'Report to a parent']],
  ['kitchen', '🍽 Kitchen cleanup', ['Clear the table', 'Scrape and rinse dishes', 'Wash or load the dishes', 'Wipe counters and table', 'Sweep the floor', 'Take out trash if full']],
  ['laundry', '🧺 Laundry', ['Sort by color', 'Wash', 'Dry', 'Fold', 'Put away in the right place']],
  ['room', '🛏 Room reset', ['Pick up the floor', 'Make the bed', 'Put clothes away', 'Dust and wipe', 'Vacuum or sweep']]
];
var FP_REWARDS = [['play15', '🎮 15 extra minutes of playtime', 5], ['fun30', '🎉 30 minutes of fun time (your choice)', 9], ['skip1', '🛋 Skip one chore', 8], ['late', '🌙 Stay up 20 minutes later on a weekend', 10], ['movie', '🍿 Choose the family movie or game night', 12]];
var FP_BONUS = [['Kindness shown', 2], ['Went the extra mile', 2], ['Helped a sibling', 2], ['Leadership', 2], ['Perfect week', 5], ['Team goal reached', 3]];
var FP_LESSONS = {
  mykah: [['Three jars', 'You earn B$1.00. Put it into give, save and spend jars. Which jar gets the most? Why?', 'Proverbs 13:11'], ['Needs and wants', 'List 6 things your family buys. Sort them into needs and wants.', 'Luke 14:28'], ['Saving goal', 'Pick something you want. Count how many weeks it takes to save for it.', 'Proverbs 6:6-8'], ['Making change', 'Make B$1.50 three different ways with coins.', 'Colossians 3:23']],
  ashelyn: [['Percent of a paycheck', 'Your paycheck is B$10. Find 10%, 10%, 50% and 30%. Do they add to 100%?', 'Luke 14:28'], ['Unit price', 'Compare two packages at a store or online by price per ounce. Which is cheaper?', 'Proverbs 21:5'], ['Simple interest', 'B$10 earns 10% each month. How much after 3 months?', 'Proverbs 13:11'], ['Budget table', 'Make a one-month budget in a spreadsheet for B$20 of pay.', 'Proverbs 21:5']],
  kayla: [['Read a pay stub', 'Open a past paycheck. Explain gross, deductions and net pay in your own words.', 'Colossians 3:23'], ['Compound interest', 'In a spreadsheet, grow B$100 at 5% a year for 10 years. Chart it.', 'Proverbs 13:11'], ['Cost of borrowing', 'Compare paying B$50 today with paying B$60 later. What is the real cost?', 'Proverbs 22:7'], ['Monthly budget', 'Build a budget with needs, wants, giving and saving for a month of income.', 'Luke 14:28']],
  ryan: [['Net pay and taxes', 'Find out how payroll taxes work. Calculate net pay from a sample gross wage.', 'Luke 16:10'], ['Credit and debt', 'Compare a loan at 8% and 20% interest over 2 years. How much extra do you pay?', 'Proverbs 22:7'], ['Compound interest', 'Model B$50 saved a month for 10 years in a spreadsheet or a Python script.', 'Proverbs 13:11'], ['Emergency fund', 'Decide how big an emergency fund should be and plan how to build it.', 'Proverbs 6:6-8'], ['Business plan', 'Write a one-page plan with start-up costs, prices and expected profit.', 'Luke 14:28']]
};
var fpR2 = function (n) { return Math.round((+n || 0) * 100) / 100; };
var fpDay = function (d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
function fpFmt(n) { return typeof prFmt === 'function' ? prFmt(n) : 'B$' + (+n || 0).toFixed(2); }
function fpUsd(n) { return '$' + (+n || 0).toFixed(2); }
function fpDeep(o, parts, val) { var r = Object.assign({}, o || {}); if (parts.length === 1) { if (val === null) delete r[parts[0]]; else r[parts[0]] = val; } else r[parts[0]] = fpDeep(r[parts[0]], parts.slice(1), val); return r; }
function fpDoc(path, def) {
  var s = React.useState(function () { var v = null; try { v = syncGet(path); } catch (e) {} return v == null ? def : v; });
  React.useEffect(function () { var u = syncOn(path, function (v) { s[1](v == null ? def : v); }, true); return function () { if (u) u(); }; }, [path]);
  var put = function (sub, v) { s[1](function (o) { return fpDeep(o, sub.split('/'), v); }); try { syncSet(path + '/' + sub, v); } catch (e) {} };
  return [s[0], put];
}
function fpCfg(cfg) { cfg = cfg || {}; return { rates: Object.assign({}, FP_CFG_DEF.rates, cfg.rates || {}), split: Object.assign({}, FP_CFG_DEF.split, cfg.split || {}), cap: cfg.cap != null ? +cfg.cap : FP_CFG_DEF.cap, sopPay: cfg.sopPay != null ? +cfg.sopPay : FP_CFG_DEF.sopPay }; }
function fpPay(pid, amt, why, key) {
  if (!(amt > 0)) return;
  try { if (typeof window._payrollOn === 'function' && window._payrollOn(pid)) window._payrollLog(pid, amt, why, key); else if (typeof window._walletCredit === 'function') window._walletCredit(pid, amt, why, key); } catch (e) {}
}
function fpNotify(to, title, body) { try { if (window._addNotifFn) window._addNotifFn('paycheck', to, title, body, {}); } catch (e) {} }
function fpPts(p) { var e = (p.pts || {}).earned || {}, s = (p.pts || {}).spent || {}; var t = 0; Object.keys(e).forEach(function (k) { t += +(e[k] || {}).n || 0; }); Object.keys(s).forEach(function (k) { t -= +(s[k] || {}).n || 0; }); return t; }
function fpAward(put, pid, key, n, why) { put('pts/earned/' + key, { n: n, why: why, ts: Date.now() }); }
function fpSect(title, open, setOpen, key, badge, body) {
  var h = React.createElement;
  return h('div', { style: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, marginBottom: 10, overflow: 'hidden' } },
    h('div', { onClick: function () { setOpen(open === key ? '' : key); }, style: { padding: '12px 14px', display: 'flex', alignItems: 'center', cursor: 'pointer' } },
      h('div', { style: { flex: 1, fontSize: 15, fontWeight: 900, color: '#fff' } }, title), badge ? h('span', { style: { background: '#EF5350', color: '#fff', borderRadius: 10, fontSize: 11, fontWeight: 900, padding: '1px 7px', marginRight: 8 } }, badge) : null, h('span', { style: { color: '#9ad' } }, open === key ? '▾' : '▸')),
    open === key && h('div', { style: { padding: '0 14px 14px' } }, body));
}
var fpBtn = function (bg) { return { background: bg || '#039BE5', color: '#fff', border: 'none', borderRadius: 18, padding: '7px 13px', fontWeight: 800, fontSize: 12, cursor: 'pointer' }; };
var fpIn = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, color: '#fff', padding: 7, fontSize: 13, boxSizing: 'border-box' };
var fpNote = { fontSize: 12, color: '#ccc', lineHeight: 1.55 };

// ── 1. school day + SOP step-by-step ──
function FpWork(props) {
  var h = React.createElement, pid = props.pid, p = props.p, put = props.put, cfg = props.cfg, today = fpDay();
  var s1 = React.useState(''), sop = s1[0], setSop = s1[1];
  var rate = fpR2((p.rate != null ? p.rate : cfg.rates[pid]) || 0), day = (p.days || {})[today] || {};
  function reqDay() { put('days/' + today + '/req', Date.now()); fpNotify('laurel', '📚 School day check: ' + props.name, props.name + ' says today’s school day is finished. Open Money Skills to approve it.'); }
  var sopDef = FP_SOPS.filter(function (x) { return x[0] === sop; })[0], run = ((p.sop || {})[today] || {})[sop] || {};
  function stepTap(i) { var steps = (run.steps || []).slice(); while (steps.length < sopDef[2].length) steps.push(0); if (run.done) return; if (i > 0 && !steps[i - 1]) return; steps[i] = 1; put('sop/' + today + '/' + sop + '/steps', steps); }
  function skipStep(i) { var steps = (run.steps || []).slice(); while (steps.length < sopDef[2].length) steps.push(0); if (run.done) return; steps[i] = -1; put('sop/' + today + '/' + sop + '/steps', steps); }
  function finish() {
    var steps = run.steps || [], n = sopDef[2].length, ok = steps.filter(function (x) { return x === 1; }).length, score = ok / n, pay = fpR2(cfg.sopPay * score);
    put('sop/' + today + '/' + sop, { steps: steps, score: Math.round(score * 100), paid: pay, done: Date.now() });
    fpPay(pid, pay, '✅ ' + sopDef[1].replace(/^\S+\s/, '') + ' (' + Math.round(score * 100) + '%)', 'sop_' + sop + '_' + today);
    if (score === 1) fpAward(put, pid, 'sop100_' + today, 1, 'Perfect order: ' + sopDef[1]);
  }
  return h('div', null,
    h('div', { style: fpNote }, 'Your school day is your main job. When you finish it, tell a parent. After a parent says OK, you are paid ' + fpFmt(rate) + '. No finished work means no pay.'),
    day.ok ? h('div', { style: { margin: '8px 0', padding: 9, borderRadius: 10, background: 'rgba(76,175,80,.2)', color: '#fff', fontWeight: 800, fontSize: 13 } }, '✅ Today’s school day approved — ' + fpFmt(rate) + ' earned') :
      day.req ? h('div', { style: { margin: '8px 0', padding: 9, borderRadius: 10, background: 'rgba(255,152,0,.2)', color: '#fff', fontWeight: 800, fontSize: 13 } }, '⏳ Waiting for a parent to check your school day') :
        h('button', { onClick: reqDay, style: Object.assign({}, fpBtn('#4CAF82'), { width: '100%', margin: '8px 0', padding: 11 }) }, '🎒 I finished my school day — ask for approval'),
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', margin: '10px 0 4px' } }, '📋 Do a job in order (SOP steps)'),
    h('div', { style: fpNote }, 'Do the steps in order. A step opens only after the one before it is checked. You earn pay and points for the steps done correctly. Skipped steps earn nothing.'),
    h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0' } }, FP_SOPS.map(function (x) { var d = ((p.sop || {})[today] || {})[x[0]]; return h('button', { key: x[0], onClick: function () { setSop(x[0]); }, style: Object.assign({}, fpBtn(sop === x[0] ? '#039BE5' : 'rgba(255,255,255,.1)')) }, (d && d.done ? '✅ ' : '') + x[1]); })),
    sopDef ? h('div', null,
      sopDef[2].map(function (t, i) {
        var st = (run.steps || [])[i], open = !run.done && (i === 0 || (run.steps || [])[i - 1]), ico = st === 1 ? '✅' : st === -1 ? '⏭' : open ? '⬜' : '🔒';
        return h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderTop: '1px solid rgba(255,255,255,.07)', opacity: open || st ? 1 : 0.5 } },
          h('span', { onClick: function () { if (open && !st) stepTap(i); }, style: { fontSize: 20, cursor: open && !st ? 'pointer' : 'default' } }, ico),
          h('span', { style: { flex: 1, fontSize: 13, color: '#eee' } }, (i + 1) + '. ' + t),
          open && !st ? h('span', { onClick: function () { skipStep(i); }, style: { fontSize: 10, color: '#EF9A9A', cursor: 'pointer' } }, 'skip') : null);
      }),
      run.done ? h('div', { style: { marginTop: 8, padding: 9, borderRadius: 10, background: 'rgba(76,175,80,.2)', color: '#fff', fontWeight: 800, fontSize: 13 } }, 'Finished — ' + run.score + '% in order · earned ' + fpFmt(run.paid || 0))
        : h('button', { onClick: finish, disabled: !(run.steps || []).some(function (x) { return x; }), style: Object.assign({}, fpBtn('#4CAF82'), { width: '100%', marginTop: 8, padding: 10 }) }, 'Finish this job and get paid for the finished steps')) : null);
}
// ── 2. paycheck splitter + buckets ──
function FpMoney(props) {
  var h = React.createElement, pid = props.pid, p = props.p, put = props.put, cfg = props.cfg, sp = cfg.split;
  var s1 = React.useState({}), checks = s1[0], setChecks = s1[1];
  React.useEffect(function () { var u = syncOn('paychecks/' + pid, function (d) { setChecks(d || {}); }, true); return function () { if (u) u(); }; }, [pid]);
  var b = p.buckets || {}, alloc = p.alloc || {}, list = Object.keys(checks).map(function (k) { return checks[k]; }).filter(function (c) { return c && c.status === 'paid'; }).sort(function (a, c) { return (c.paidAt || 0) - (a.paidAt || 0); });
  var todo = list.filter(function (c) { return !alloc[c.id]; });
  function split(c) {
    var amt = fpR2(c.raw), parts = {}, used = 0, ks = ['give', 'house', 'save']; ks.forEach(function (k) { parts[k] = fpR2(amt * sp[k] / 100); used += parts[k]; }); parts.spend = fpR2(amt - used);
    Object.keys(parts).forEach(function (k) { put('buckets/' + k, fpR2((+b[k] || 0) + parts[k])); }); put('alloc/' + c.id, { ts: Date.now(), parts: parts, amt: amt });
  }
  function move(from, to, amt) { amt = fpR2(amt); if (!(amt > 0) || amt > (+b[from] || 0)) return; put('buckets/' + from, fpR2((+b[from] || 0) - amt)); }
  function used(k, why) { var v = window.prompt('How much (B$) did you ' + why + '?'); var n = fpR2(v); if (!(n > 0)) return; if (n > (+b[k] || 0)) { window.alert('That is more than you have in this bucket.'); return; } put('buckets/' + k, fpR2((+b[k] || 0) - n)); put('log/' + Date.now(), { k: k, n: n, why: why }); }
  var tot = ['give', 'house', 'save', 'spend'].reduce(function (n, k) { return n + (+b[k] || 0); }, 0);
  return h('div', null,
    h('div', { style: fpNote }, 'Every paycheck is split the same way: ' + sp.give + '% give · ' + sp.house + '% household · ' + sp.save + '% save · ' + sp.spend + '% spend. Saving is the biggest part on purpose.'),
    todo.length ? todo.slice(0, 5).map(function (c) {
      var amt = fpR2(c.raw);
      return h('div', { key: c.id, style: { background: 'rgba(255,213,79,.12)', border: '1px solid rgba(255,213,79,.4)', borderRadius: 10, padding: 10, margin: '8px 0' } },
        h('div', { style: { fontSize: 13, fontWeight: 900, color: '#FFD54F' } }, '🧾 ' + (c.label || 'Paycheck') + ' — gross ' + fpFmt(amt)),
        ['give', 'house', 'save'].map(function (k) { return h('div', { key: k, style: { fontSize: 12, color: '#ddd' } }, '− ' + FP_BUCKETS.filter(function (x) { return x[0] === k; })[0][1] + ' ' + sp[k] + '%: ' + fpFmt(amt * sp[k] / 100)); }),
        h('div', { style: { fontSize: 12, color: '#fff', fontWeight: 800 } }, '= Spend ' + sp.spend + '%: ' + fpFmt(amt - fpR2(amt * sp.give / 100) - fpR2(amt * sp.house / 100) - fpR2(amt * sp.save / 100))),
        h('button', { onClick: function () { split(c); }, style: Object.assign({}, fpBtn('#4CAF82'), { marginTop: 6 }) }, 'Split my paycheck'));
    }) : h('div', { style: { fontSize: 12, color: '#9ad', margin: '8px 0' } }, 'No new paychecks to split. When a paycheck is paid, it shows up here.'),
    h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 } }, FP_BUCKETS.map(function (x) {
      return h('div', { key: x[0], style: { background: 'rgba(0,0,0,.28)', borderRadius: 10, padding: 9 } },
        h('div', { style: { fontSize: 12, fontWeight: 900, color: '#fff' } }, x[1]), h('div', { style: { fontSize: 18, fontWeight: 900, color: x[0] === 'save' ? '#81C784' : '#FFD54F' } }, fpFmt(b[x[0]] || 0)),
        h('div', { style: { fontSize: 10, color: '#9ad', lineHeight: 1.4, margin: '2px 0 4px' } }, x[2]),
        x[0] === 'give' ? h('span', { onClick: function () { used('give', 'give'); }, style: { fontSize: 11, color: '#81D4FA', cursor: 'pointer' } }, 'I gave some') : x[0] === 'spend' ? h('span', { onClick: function () { used('spend', 'spend'); }, style: { fontSize: 11, color: '#81D4FA', cursor: 'pointer' } }, 'I spent some') : null);
    })),
    h('div', { style: { fontSize: 12, color: '#9ad', marginTop: 8 } }, 'Saved so far: ' + fpFmt(b.save || 0) + ' vs spend: ' + fpFmt(b.spend || 0) + ((+b.save || 0) >= (+b.spend || 0) ? ' — you save more than you spend! 🎉' : ' — try to keep saving above spending.')));
}
// ── 3. goals (solo or team) ──
function FpGoals(props) {
  var h = React.createElement, pid = props.pid, p = props.p, put = props.put, b = p.buckets || {};
  var gs = fpDoc('finplan/goals', {}), goals = gs[0], gput = gs[1];
  var s1 = React.useState(''), name = s1[0], setName = s1[1], s2 = React.useState(''), target = s2[0], setTarget = s2[1], s3 = React.useState('solo'), mode = s3[0], setMode = s3[1];
  var ids = Object.keys(goals).filter(function (k) { var g = goals[k]; return g && (props.isAdmin || g.mode === 'team' || (g.members || {})[pid]); });
  function add() { if (!name.trim() || !(+target > 0)) return; var id = 'g' + Date.now(); var mem = {}; mem[pid] = true; if (mode === 'team') props.kids.forEach(function (k) { mem[k] = true; }); gput(id, { name: name.trim(), target: fpR2(target), mode: mode, members: mem, by: pid, ts: Date.now() }); setName(''); setTarget(''); }
  function addMoney(id, from) { var v = window.prompt('How much (B$) from your ' + from + ' bucket?'); var n = fpR2(v); if (!(n > 0)) return; if (n > (+b[from] || 0)) { window.alert('You do not have that much in ' + from + '.'); return; } put('buckets/' + from, fpR2((+b[from] || 0) - n)); var g = goals[id], cur = +((g.put || {})[pid]) || 0; gput(id + '/put/' + pid, fpR2(cur + n)); }
  return h('div', null,
    h('div', { style: fpNote }, 'Save for something together or by yourself. Money comes from your Save bucket (or Spend). Count the cost first — Luke 14:28.'),
    ids.map(function (id) {
      var g = goals[id], sum = 0; Object.keys(g.put || {}).forEach(function (k) { sum += +g.put[k] || 0; }); var pct = Math.min(100, Math.round(100 * sum / g.target));
      return h('div', { key: id, style: { background: 'rgba(0,0,0,.25)', borderRadius: 10, padding: 10, margin: '8px 0' } },
        h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff' } }, (g.mode === 'team' ? '👥 ' : '🎯 ') + g.name), h('div', { style: { fontSize: 12, color: '#9ad' } }, fpFmt(sum) + ' of ' + fpFmt(g.target) + (g.mode === 'team' ? ' · team goal' : '')),
        h('div', { style: { height: 8, background: 'rgba(255,255,255,.1)', borderRadius: 6, margin: '6px 0' } }, h('div', { style: { height: 8, width: pct + '%', background: pct >= 100 ? '#FFD54F' : '#4CAF82', borderRadius: 6 } })),
        Object.keys(g.put || {}).map(function (k) { return h('span', { key: k, style: { fontSize: 11, color: '#ccc', marginRight: 8 } }, k + ': ' + fpFmt(g.put[k])); }),
        pct >= 100 ? h('div', { style: { fontSize: 12, color: '#FFD54F', fontWeight: 800, marginTop: 4 } }, '🏆 Goal reached! Tell a parent.') : (g.members || {})[pid] || g.mode === 'team' ? h('div', { style: { marginTop: 4 } }, h('span', { onClick: function () { addMoney(id, 'save'); }, style: { fontSize: 12, color: '#81C784', cursor: 'pointer', marginRight: 12 } }, '+ from Save'), h('span', { onClick: function () { addMoney(id, 'spend'); }, style: { fontSize: 12, color: '#81D4FA', cursor: 'pointer' } }, '+ from Spend')) : null);
    }),
    h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } },
      h('input', { value: name, onChange: function (e) { setName(e.target.value); }, placeholder: 'Goal (e.g. board game)', style: Object.assign({}, fpIn, { flex: '2 1 140px' }) }),
      h('input', { value: target, onChange: function (e) { setTarget(e.target.value); }, placeholder: 'Cost B$', inputMode: 'decimal', style: Object.assign({}, fpIn, { flex: '1 1 70px' }) }),
      h('select', { value: mode, onChange: function (e) { setMode(e.target.value); }, style: Object.assign({}, fpIn, { flex: '1 1 90px' }) }, h('option', { value: 'solo', style: { color: '#000' } }, 'Just me'), h('option', { value: 'team', style: { color: '#000' } }, 'Team goal')),
      h('button', { onClick: add, style: fpBtn('#4CAF82') }, '➕ Start goal')));
}
// ── 4. fun time points ──
function FpFun(props) {
  var h = React.createElement, pid = props.pid, p = props.p, put = props.put, pts = fpPts(p), red = (p.redeem || {});
  function ask(r) { if (pts < r[2]) return; var id = 'r' + Date.now(); put('redeem/' + id, { key: r[0], label: r[1], cost: r[2], ts: Date.now(), status: 'pending' }); fpNotify('laurel', '🎉 Reward request: ' + props.name, props.name + ' wants: ' + r[1] + ' (' + r[2] + ' pts). Open Money Skills to approve.'); }
  var hold = 0; Object.keys(red).forEach(function (k) { if (red[k].status === 'pending') hold += red[k].cost; });
  return h('div', null,
    h('div', { style: { fontSize: 22, fontWeight: 900, color: '#FFD54F' } }, '⭐ ' + pts + ' bonus points'),
    h('div', { style: fpNote }, 'Earn points for a finished school day (+1), a perfect-order job (+1 a day) and extra effort a parent awards. Turn them into rewards. A parent says yes.'),
    FP_REWARDS.map(function (r) { var can = pts - hold >= r[2]; return h('div', { key: r[0], style: { display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderTop: '1px solid rgba(255,255,255,.07)' } }, h('div', { style: { flex: 1, fontSize: 13, color: '#eee' } }, r[1]), h('button', { onClick: function () { ask(r); }, disabled: !can, style: Object.assign({}, fpBtn(can ? '#FFA000' : 'rgba(255,255,255,.1)'), { opacity: can ? 1 : 0.5 }) }, r[2] + ' pts')); }),
    Object.keys(red).length ? h('div', { style: { marginTop: 8 } }, Object.keys(red).sort().reverse().slice(0, 6).map(function (k) { var x = red[k]; return h('div', { key: k, style: { fontSize: 12, color: x.status === 'ok' ? '#81C784' : x.status === 'no' ? '#EF9A9A' : '#FFD54F' } }, (x.status === 'ok' ? '✅ ' : x.status === 'no' ? '✖ ' : '⏳ ') + x.label); })) : null);
}
// ── 5. real bank + monthly review ──
function fpMonthStats(p, ym, rate) {
  var y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1, now = new Date(), last = new Date(y, m + 1, 0), end = (now.getFullYear() === y && now.getMonth() === m) ? now : last, poss = 0, ok = 0;
  for (var d = new Date(y, m, 1); d <= end; d.setDate(d.getDate() + 1)) { var k = fpDay(d), wd = d.getDay(); if (wd === 0 || wd === 6) continue; if (typeof SCHOOL_START_DATE !== 'undefined' && k < SCHOOL_START_DATE) continue; if (typeof SC_OFF_DAYS !== 'undefined' && SC_OFF_DAYS.indexOf(k) >= 0) continue; poss++; if (((p.days || {})[k] || {}).ok) ok++; }
  var sc = [], sops = p.sop || {}; Object.keys(sops).forEach(function (dk) { if (dk.slice(0, 7) === ym) Object.keys(sops[dk]).forEach(function (id) { if (sops[dk][id].done) sc.push(+sops[dk][id].score || 0); }); });
  var att = poss ? ok / poss : 0, sop = sc.length ? sc.reduce(function (a, c) { return a + c; }, 0) / sc.length / 100 : 0;
  return { poss: poss, ok: ok, att: att, sop: sop, sopRuns: sc.length };
}
function FpBank(props) {
  var h = React.createElement, p = props.p, put = props.put, real = p.real || {}, admin = props.isAdmin, ym = fpDay().slice(0, 7), cfg = props.cfg;
  var rv = (p.review || {})[ym] || {}, st = fpMonthStats(p, ym), s1 = React.useState(''), ck = s1[0], setCk = s1[1], s2 = React.useState(''), sv = s2[0], setSv = s2[1];
  var parent = rv.parent != null ? +rv.parent : 100, score = Math.round(50 * st.att + 30 * st.sop + 20 * parent / 100 * 1), pay = fpR2(Math.min(cfg.cap, cfg.cap * score / 100)), raise = score >= 90;
  function setBal() { var a = ck !== '' ? fpR2(ck) : real.checking || 0, c = sv !== '' ? fpR2(sv) : real.savings || 0; put('real/checking', a); put('real/savings', c); put('real/asof', Date.now()); setCk(''); setSv(''); }
  function approve() {
    if (!window.confirm('Record a real deposit of ' + fpUsd(pay) + ' into ' + props.name + '’s savings? Only do this after the money is really put in their account.')) return;
    put('real/savings', fpR2((+real.savings || 0) + pay)); put('real/asof', Date.now()); put('real/hist/' + Date.now(), { amt: pay, note: 'Monthly pay ' + ym + ' (score ' + score + '%)' });
    var newRate = raise ? fpR2((+(p.rate != null ? p.rate : cfg.rates[props.pid]) || 0) + 0.05) : null; if (newRate) put('rate', newRate);
    put('review/' + ym, { parent: parent, score: score, pay: pay, raise: !!raise, done: Date.now() });
    fpNotify(props.pid, '🏦 Monthly pay recorded: ' + fpUsd(pay), 'Your ' + ym + ' review was ' + score + '%.' + (raise ? ' You earned a raise!' : ''));
  }
  var hist = Object.keys(real.hist || {}).sort().reverse().slice(0, 6);
  return h('div', null,
    h('div', { style: fpNote }, 'Your real bank and savings money. A parent keeps these numbers up to date from the real bank account — the app cannot see the bank by itself. You can earn up to ' + fpUsd(cfg.cap) + ' real money a month, paid into savings.'),
    h('div', { style: { display: 'flex', gap: 8, margin: '8px 0' } },
      h('div', { style: { flex: 1, background: 'rgba(0,0,0,.28)', borderRadius: 10, padding: 10 } }, h('div', { style: { fontSize: 11, color: '#9ad' } }, '🏛 BANK ACCOUNT'), h('div', { style: { fontSize: 20, fontWeight: 900, color: '#fff' } }, fpUsd(real.checking))),
      h('div', { style: { flex: 1, background: 'rgba(76,175,80,.18)', borderRadius: 10, padding: 10 } }, h('div', { style: { fontSize: 11, color: '#9ad' } }, '🏦 REAL SAVINGS'), h('div', { style: { fontSize: 20, fontWeight: 900, color: '#81C784' } }, fpUsd(real.savings)))),
    real.asof ? h('div', { style: { fontSize: 11, color: '#789' } }, 'As of ' + new Date(real.asof).toLocaleDateString()) : h('div', { style: { fontSize: 11, color: '#789' } }, 'A parent has not entered the balances yet.'),
    hist.length ? h('div', { style: { marginTop: 6 } }, hist.map(function (k) { return h('div', { key: k, style: { fontSize: 12, color: '#ccc' } }, '+ ' + fpUsd(real.hist[k].amt) + ' · ' + real.hist[k].note); })) : null,
    h('div', { style: { background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: 10, marginTop: 10 } },
      h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff' } }, '📅 This month’s review (' + ym + ')'),
      h('div', { style: fpNote }, 'School days approved: ' + st.ok + ' of ' + st.poss + ' · Jobs done in order: ' + Math.round(st.sop * 100) + '% (' + st.sopRuns + ' jobs) · Attitude and character: ' + parent + '%'),
      h('div', { style: { fontSize: 16, fontWeight: 900, color: '#FFD54F', margin: '4px 0' } }, 'Score ' + score + '% → ' + fpUsd(pay) + ' this month' + (raise ? ' · raise earned! 🎉' : '')),
      h('div', { style: { fontSize: 11, color: '#9ad' } }, 'Score = 50% school days + 30% jobs in order + 20% parent’s rating of attitude. A score of 90% or more earns a raise.'),
      rv.done ? h('div', { style: { color: '#81C784', fontWeight: 800, fontSize: 13, marginTop: 6 } }, '✅ Recorded: ' + fpUsd(rv.pay) + (rv.raise ? ' + a raise' : '')) : null),
    admin ? h('div', { style: { marginTop: 10, borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 8 } },
      h('div', { style: { fontSize: 12, fontWeight: 900, color: '#FFD54F', marginBottom: 4 } }, '👪 Parent controls'),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
        h('input', { value: ck, onChange: function (e) { setCk(e.target.value); }, placeholder: 'Bank $', inputMode: 'decimal', style: Object.assign({}, fpIn, { width: 90 }) }),
        h('input', { value: sv, onChange: function (e) { setSv(e.target.value); }, placeholder: 'Savings $', inputMode: 'decimal', style: Object.assign({}, fpIn, { width: 90 }) }),
        h('button', { onClick: setBal, style: fpBtn() }, 'Update balances')),
      h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' } }, h('span', { style: fpNote }, 'Attitude/character rating:'), h('input', { type: 'range', min: 0, max: 100, step: 5, value: parent, onChange: function (e) { put('review/' + ym + '/parent', +e.target.value); } }), h('b', { style: { color: '#fff' } }, parent + '%')),
      !rv.done ? h('button', { onClick: approve, style: Object.assign({}, fpBtn('#4CAF82'), { marginTop: 8 }) }, '✔ Approve month and record ' + fpUsd(pay) + ' deposit') : null) : null);
}
// ── 6. weekly money lesson ──
function FpLesson(props) {
  var h = React.createElement, pid = props.pid, p = props.p, put = props.put, list = FP_LESSONS[pid] || FP_LESSONS.ashelyn, wk = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1)) / 604800000), L = list[wk % list.length], key = new Date().getFullYear() + '_' + wk, done = ((p.lessons || {})[key]);
  return h('div', null,
    h('div', { style: { fontSize: 11, color: '#9ad' } }, 'THIS WEEK’S MONEY LESSON'), h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', margin: '2px 0' } }, L[0]),
    h('div', { style: { fontSize: 13, color: '#ddd', lineHeight: 1.6 } }, L[1]), h('div', { style: { fontSize: 12, color: '#FFD54F', margin: '4px 0' } }, '📖 ' + L[2]),
    h('div', { style: { fontSize: 11, color: '#9ad', marginBottom: 6 } }, 'Tip: use a spreadsheet in the Computer Lab to do the math.'),
    done ? h('div', { style: { color: '#81C784', fontWeight: 800 } }, '✅ Done this week') : h('button', { onClick: function () { put('lessons/' + key, Date.now()); fpAward(put, pid, 'lesson_' + key, 2, 'Money lesson: ' + L[0]); }, style: fpBtn('#4CAF82') }, 'I finished it (+2 points)'));
}
// ── parent queues & settings ──
function FpAdmin(props) {
  var h = React.createElement, cfgS = fpDoc('finplan/cfg', {}), cfg = fpCfg(cfgS[0]), put = cfgS[1], kids = props.kids, names = props.names;
  var docs = {}; kids.forEach(function (k) { docs[k] = fpDoc('finplan/p/' + k, {}); });
  var today = fpDay(), reqs = [], reds = [];
  kids.forEach(function (k) { var p = docs[k][0], put2 = docs[k][1], rate = fpR2((p.rate != null ? p.rate : cfg.rates[k]) || 0);
    Object.keys(p.days || {}).forEach(function (d) { var x = p.days[d]; if (x.req && !x.ok) reqs.push({ k: k, d: d, rate: rate, put: put2 }); });
    Object.keys(p.redeem || {}).forEach(function (r) { var x = p.redeem[r]; if (x.status === 'pending') reds.push({ k: k, id: r, x: x, put: put2 }); }); });
  function approveDay(r) { r.put('days/' + r.d + '/ok', Date.now()); fpPay(r.k, r.rate, '📚 School day ' + r.d, 'school_' + r.d); fpAward(r.put, r.k, 'school_' + r.d, 1, 'School day'); fpNotify(r.k, '✅ School day approved', 'Great work! You earned ' + fpFmt(r.rate) + ' and 1 point.'); }
  function rejectDay(r) { r.put('days/' + r.d + '/req', null); fpNotify(r.k, '📚 School day not approved yet', 'Talk with a parent about what is left to finish.'); }
  function okRed(r) { r.put('redeem/' + r.id + '/status', 'ok'); r.put('pts/spent/' + r.id, { n: r.x.cost, why: r.x.label, ts: Date.now() }); fpNotify(r.k, '🎉 Reward approved', r.x.label); }
  function noRed(r) { r.put('redeem/' + r.id + '/status', 'no'); fpNotify(r.k, 'Reward not now', r.x.label + ' — talk with a parent.'); }
  var s1 = React.useState('Kindness shown'), why = s1[0], setWhy = s1[1], s2 = React.useState(kids[0]), who = s2[0], setWho = s2[1];
  function award() { var b = FP_BONUS.filter(function (x) { return x[0] === why; })[0]; var d = docs[who]; fpAward(d[1], who, 'bonus_' + Date.now(), b[1], why); fpNotify(who, '⭐ Bonus: +' + b[1] + ' points', why); }
  var rs = Object.assign({}, cfg.rates), sps = Object.assign({}, cfg.split);
  var tot = sps.give + sps.house + sps.save + sps.spend;
  return h('div', null,
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 4 } }, '📥 Needs your OK (' + (reqs.length + reds.length) + ')'),
    reqs.length + reds.length === 0 ? h('div', { style: { fontSize: 12, color: '#9ad' } }, 'Nothing waiting.') : null,
    reqs.map(function (r) { return h('div', { key: r.k + r.d, style: { display: 'flex', gap: 6, alignItems: 'center', padding: '6px 0', borderTop: '1px solid rgba(255,255,255,.07)' } }, h('div', { style: { flex: 1, fontSize: 13, color: '#eee' } }, '📚 ' + names[r.k] + ' — school day ' + r.d + ' (' + fpFmt(r.rate) + ')'), h('button', { onClick: function () { approveDay(r); }, style: fpBtn('#4CAF82') }, 'Approve'), h('button', { onClick: function () { rejectDay(r); }, style: fpBtn('#EF5350') }, 'Not yet')); }),
    reds.map(function (r) { return h('div', { key: r.k + r.id, style: { display: 'flex', gap: 6, alignItems: 'center', padding: '6px 0', borderTop: '1px solid rgba(255,255,255,.07)' } }, h('div', { style: { flex: 1, fontSize: 13, color: '#eee' } }, '🎉 ' + names[r.k] + ': ' + r.x.label + ' (' + r.x.cost + ' pts)'), h('button', { onClick: function () { okRed(r); }, style: fpBtn('#4CAF82') }, 'Yes'), h('button', { onClick: function () { noRed(r); }, style: fpBtn('#EF5350') }, 'No')); }),
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', margin: '12px 0 4px' } }, '⭐ Award bonus points'),
    h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
      h('select', { value: who, onChange: function (e) { setWho(e.target.value); }, style: fpIn }, kids.map(function (k) { return h('option', { key: k, value: k, style: { color: '#000' } }, names[k]); })),
      h('select', { value: why, onChange: function (e) { setWhy(e.target.value); }, style: fpIn }, FP_BONUS.map(function (b) { return h('option', { key: b[0], value: b[0], style: { color: '#000' } }, b[0] + ' (+' + b[1] + ')'); })),
      h('button', { onClick: award, style: fpBtn('#FFA000') }, 'Give')),
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', margin: '12px 0 4px' } }, '⚙️ Pay settings (start small)'),
    h('div', { style: fpNote }, 'Pay per finished school day (B$):'),
    h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', margin: '4px 0' } }, kids.map(function (k) { return h('label', { key: k, style: { fontSize: 11, color: '#ccc' } }, names[k], h('input', { defaultValue: rs[k], key: k + rs[k], inputMode: 'decimal', onBlur: function (e) { var v = fpR2(e.target.value); put('rates/' + k, v); docs[k][1]('rate', null); }, style: Object.assign({}, fpIn, { width: 62, marginLeft: 4 }) })); })),
    h('div', { style: fpNote }, 'Split of each paycheck (must total 100%): ' + (tot === 100 ? '✓' : '⚠ currently ' + tot + '%')),
    h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', margin: '4px 0' } }, FP_BUCKETS.map(function (x) { return h('label', { key: x[0], style: { fontSize: 11, color: '#ccc' } }, x[1].replace(/^\S+\s/, ''), h('input', { defaultValue: sps[x[0]], key: x[0] + sps[x[0]], inputMode: 'numeric', onBlur: function (e) { put('split/' + x[0], Math.max(0, Math.min(100, +e.target.value || 0))); }, style: Object.assign({}, fpIn, { width: 52, marginLeft: 4 }) })); })),
    h('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 } },
      h('label', { style: { fontSize: 11, color: '#ccc' } }, 'Real $ cap per month', h('input', { defaultValue: cfg.cap, key: 'cap' + cfg.cap, inputMode: 'decimal', onBlur: function (e) { put('cap', fpR2(e.target.value)); }, style: Object.assign({}, fpIn, { width: 62, marginLeft: 4 }) })),
      h('label', { style: { fontSize: 11, color: '#ccc' } }, 'Pay per SOP job (B$)', h('input', { defaultValue: cfg.sopPay, key: 'sp' + cfg.sopPay, inputMode: 'decimal', onBlur: function (e) { put('sopPay', fpR2(e.target.value)); }, style: Object.assign({}, fpIn, { width: 62, marginLeft: 4 }) }))));
}
function MoneySkills(props) {
  var h = React.createElement, fam = props.family || [], admin = !!props.isAdmin;
  var kids = FP_KIDS.filter(function (k) { return fam.some(function (p) { return p.id === k; }); }), names = {}; fam.forEach(function (p) { names[p.id] = p.name; });
  var s0 = React.useState(admin ? (kids[0] || 'ryan') : props.personId), pid = s0[0], setPid = s0[1], s1 = React.useState('work'), open = s1[0], setOpen = s1[1];
  var cfgS = fpDoc('finplan/cfg', {}), cfg = fpCfg(cfgS[0]), pd = fpDoc('finplan/p/' + pid, {}), p = pd[0], put = pd[1];
  var sc = FP_SCRIPT[Math.floor(Date.now() / 86400000) % FP_SCRIPT.length], pts = fpPts(p), name = names[pid] || pid;
  var pendingMine = Object.keys(p.redeem || {}).filter(function (k) { return p.redeem[k].status === 'pending'; }).length;
  var Hs = function (id, title, body, badge) { return fpSect(title, open, setOpen, id, badge, body); };
  return h('div', { style: { padding: '4px 2px' } },
    h('div', { style: { fontSize: 20, fontWeight: 900, color: '#fff' } }, '🏦 Money Skills'),
    h('div', { style: { fontSize: 12, color: '#9ad', marginBottom: 8 } }, 'School, chores and good habits are your job. Learn to give, save and spend wisely.'),
    h('div', { style: { background: 'rgba(255,213,79,.12)', border: '1px solid rgba(255,213,79,.4)', borderRadius: 10, padding: 9, marginBottom: 10 } }, h('b', { style: { color: '#FFD54F', fontSize: 12 } }, '📖 ' + sc[0]), h('div', { style: { fontSize: 12, color: '#fff', lineHeight: 1.5 } }, sc[1])),
    admin ? h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 } }, kids.map(function (k) { return h('button', { key: k, onClick: function () { setPid(k); }, style: fpBtn(pid === k ? '#039BE5' : 'rgba(255,255,255,.1)') }, names[k]); })) : null,
    admin ? Hs('admin', '👪 Parent corner (approvals & settings)', h(FpAdmin, { kids: kids, names: names })) : null,
    Hs('work', '📚 My job: school day & SOP steps', h(FpWork, { key: pid, pid: pid, p: p, put: put, cfg: cfg, name: name })),
    Hs('money', '💵 My paycheck & buckets', h(FpMoney, { key: pid, pid: pid, p: p, put: put, cfg: cfg })),
    Hs('goals', '🎯 Savings goals (solo or team)', h(FpGoals, { key: pid, pid: pid, p: p, put: put, isAdmin: admin, kids: kids })),
    Hs('fun', '⭐ Bonus points & fun time (' + pts + ')', h(FpFun, { key: pid, pid: pid, p: p, put: put, name: name }), pendingMine || null),
    Hs('bank', '🏛 Real bank, savings & monthly review', h(FpBank, { key: pid, pid: pid, p: p, put: put, cfg: cfg, name: name, isAdmin: admin })),
    Hs('learn', '🎓 This week’s money lesson', h(FpLesson, { key: pid, pid: pid, p: p, put: put })));
}
