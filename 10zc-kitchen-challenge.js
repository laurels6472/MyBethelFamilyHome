// ═══ v43 KIDS' MENU CHALLENGE — the students plan the week's menu, build the shopping list, shop on a real budget and balance it ═══
// The Smart Menu plan (approved a week ahead by a parent) is the answer key. Data: kitchenchallenge/<week>/...
var KC_KIDS = ['mykah', 'ashelyn', 'kayla', 'ryan'];
var KC_Q = {
  g4: ['What was the most expensive thing on our list?', 'Which healthy food did you choose that you had not tried before?', 'What would you change next week?'],
  g8: ['Which meal cost the most per serving, and why?', 'How close was your estimate to what you really spent? Find the difference and the percent.', 'What did you change to stay inside the budget?'],
  g12: ['Compute your plan’s cost per person per day and per meal. Compare the estimate with the receipt (variance in $ and %).', 'Which two choices saved the most money without hurting nutrition? Explain with numbers.', 'Explain how your menu supports kidney-stone prevention, focus and healthy growth for the whole family.']
};
function kcLines(l) { var c = {}, o = []; l.forEach(function (x) { if (!c[x]) { c[x] = 0; o.push(x); } c[x]++; }); return o.map(function (x) { return c[x] > 1 ? c[x] + '× ' + x : x; }).join(' + '); }
function kcG(pid) { var g = { mykah: 4, ashelyn: 8, kayla: 11, ryan: 12 }[pid] || 8; return g <= 5 ? 'g4' : g <= 9 ? 'g8' : 'g12'; }
function kcKey(c, k) { return (c + '_' + k).replace(/[^a-zA-Z0-9]/g, '_').slice(0, 60); }
function kcPicks(plan) { var d = []; for (var i = 0; i < 7; i++) { var o = {}; SM_MEALS.forEach(function (m) { var k = (plan || {})[i + '_' + m[0]]; if (k) o[m[0]] = k; }); d.push(o); } return d; }
function kcScore(picks, ev, byK, cfg, hasSales, hasPantry, reflected) {
  var tot = 0, n = 0, tags = {}, dinners = {}, lunches = {}, bfs = {}, bfProt = 0, bfN = 0, onHand = 0, sale = 0, fishM = 0;
  picks.forEach(function (d) { SM_MEALS.forEach(function (m) { var k = d[m[0]]; if (!k || !byK[k]) return; n++; tot += ev[k].total; onHand += ev[k].have.length; sale += ev[k].sale; byK[k].tags.forEach(function (t) { tags[t] = (tags[t] || 0) + 1; });
    if (m[0] === 'dinner') dinners[k] = (dinners[k] || 0) + 1; if (m[0] === 'lunch') lunches[k] = (lunches[k] || 0) + 1; if (m[0] === 'breakfast') { bfs[k] = (bfs[k] || 0) + 1; bfN++; if (byK[k].tags.some(function (t) { return t === 'egg' || t === 'dairy' || t === 'poultry'; })) bfProt++; } }); });
  var maxRep = function (o, lim) { return Object.keys(o).every(function (k) { return o[k] <= lim; }); };
  var checks = [
    ['complete', 'All 28 meals planned', n === 28, 0],
    ['budget', 'Under the budget of $' + cfg.budget, n === 28 && tot <= cfg.budget, 25],
    ['fish', 'At least 2 fish meals (omega-3 for the brain)', (tags.fish || 0) >= 2, 10],
    ['limits', 'Red meat limited (beef ≤ 1, pork ≤ 1) and beans/lentils ≤ 2', (tags.beef || 0) <= 1 && (tags.pork || 0) <= 1 && (tags.legume || 0) <= 2, 10],
    ['veg', 'At least 14 meals with vegetables', (tags.veg || 0) >= 14, 15],
    ['variety', 'Variety: no dinner or lunch repeated, no breakfast more than twice', maxRep(dinners, 1) && maxRep(lunches, 1) && maxRep(bfs, 2), 15],
    ['bfprot', 'Protein at every breakfast (eggs, yogurt, cottage cheese or poultry)', bfN > 0 && bfProt === bfN, 10],
    ['use', 'Uses what we already have and what is on sale', (!hasPantry || onHand >= 5) && (!hasSales || sale >= 1) && (hasPantry || hasSales || true), 10],
    ['reflect', 'Finished the reflection questions', !!reflected, 5]
  ];
  var score = 0; checks.forEach(function (c) { if (c[2]) score += c[3]; });
  return { total: Math.round(tot * 100) / 100, n: n, checks: checks, score: score, tags: tags, onHand: onHand, sale: sale };
}
function kcApply(week, picks, byK) {
  var n = 0;
  picks.forEach(function (dd, di) { SM_MEALS.forEach(function (m) {
    var r = byK[dd[m[0]]]; if (!r) return; var id = r.own ? r.k : 'lib_' + r.k;
    if (!r.own) { var rec = ktBuildRecipe({ id: id, title: r.t, servings: '6', source: 'Smart Menu (whole foods)', ingredients: r.ing.map(function (i) { return i[0]; }), directionsText: r.steps.join('\n') }); syncSet('recipes/' + id, rec); }
    syncSet('kitchen_menu/' + week + '/days/' + di + '/' + m[0], { rid: id, title: r.t }); n++; }); });
  return n;
}
function KitchenChallenge(props) {
  var h = React.createElement, admin = !!props.isAdmin, pid0 = props.personId;
  var wS = React.useState(ktAddDays(ktWeekStart(), 7)), week = wS[0], setWeek = wS[1];
  var kidsHere = KC_KIDS.filter(function (k) { return (props.family || []).some(function (p) { return p.id === k; }); });
  var vS = React.useState(admin ? (kidsHere[0] || 'ryan') : pid0), pid = vS[0], setPid = vS[1], oS = React.useState('plan'), sec = oS[0], setSec = oS[1];
  var pS = ktUse('pantry', {}), pantry = pS[0], rcS = ktUse('recipes', {}), recipesAll = rcS[0], cS = ktUse('smartmenu/cfg', {}), scfg = cS[0], slS = ktUse('smartmenu/sales/' + week, {}), sales = slS[0];
  var kc = fpDoc('kitchenchallenge/' + week, {}), D = kc[0], put = kc[1];
  var teamMap = D.team || {}, mode = teamMap[pid] ? 'team' : 'solo', planId = mode === 'team' ? 'team' : pid, P = (D.plans || {})[planId] || {}, plan = P.plan || {}, status = P.status || 'draft';
  var budget = +((D.cfg || {}).budget) || 300, locked = status !== 'draft' && !admin;
  var ownRes = React.useMemo(function () { return scfg.useMine === false ? { out: [] } : smOwn(recipesAll); }, [recipesAll, scfg.useMine]);
  var lib = React.useMemo(function () { return SM_LIB.concat(ownRes.out); }, [ownRes]);
  var byK = React.useMemo(function () { var o = {}; lib.forEach(function (r) { o[r.k] = r; }); return o; }, [lib]);
  var ev = React.useMemo(function () { var o = {}, adj = (scfg.priceAdj || 100) / 100; lib.forEach(function (r) { o[r.k] = smEval(r, pantry, sales, adj); }); return o; }, [lib, pantry, sales, scfg.priceAdj]);
  var picks = kcPicks(plan), refl = P.reflect || {}, q = KC_Q[kcG(pid)], reflected = q.every(function (x, i) { return (refl['q' + i] || '').trim().length > 5; });
  var res = kcScore(picks, ev, byK, { budget: budget }, Object.keys(sales || {}).length > 0, Object.keys(pantry || {}).length > 0, reflected);
  var bench = React.useMemo(function () { return smPlan(pantry, sales, Object.assign({}, scfg, { budget: budget }), parseInt(week.replace(/-/g, '')) % 97, {}, ownRes.out); }, [pantry, sales, scfg, budget, week, ownRes]);
  var benchScore = kcScore(bench.days, bench.ev, bench.byK, { budget: budget }, true, true, true);
  var shop = res.n === 28 ? smShopping({ days: picks, ev: ev }) : [], sh = P.shop || {};
  var card = { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: 12, marginBottom: 10 };
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, color: '#fff', padding: 8, fontSize: 13, boxSizing: 'border-box' };
  var btn = function (bg) { return { background: bg || '#039BE5', color: '#fff', border: 'none', borderRadius: 18, padding: '8px 14px', fontWeight: 800, fontSize: 12, cursor: 'pointer' }; };
  var base = 'kitchenchallenge/' + week + '/';
  function setMode(m) { put('team/' + pid, m === 'team'); }
  function setSlot(di, meal, k) { if (mode === 'team') put('plans/team/by/' + di + '_' + meal, pid); put('plans/' + planId + '/plan/' + di + '_' + meal, k || null); }
  function submit() { put('plans/' + planId + '/status', 'submitted'); put('plans/' + planId + '/submitted', Date.now()); put('plans/' + planId + '/score', res.score); put('plans/' + planId + '/total', res.total); try { if (window._addNotifFn) window._addNotifFn('task', 'laurel', '👩‍🍳 Menu challenge submitted', (mode === 'team' ? 'The team' : pid) + ' turned in a menu: score ' + res.score + '%, about $' + res.total.toFixed(2) + '.', {}); } catch (e) {} }
  function approve() {
    var n = kcApply(week, picks, byK); var pts = Math.round(res.score / 20), pay = res.score >= 85 && res.total <= budget ? 1 : 0.5, who = mode === 'team' ? kidsHere.filter(function (k) { return teamMap[k]; }) : [pid]; if (mode === 'team') { pay += 0.25; pts += 2; }
    who.forEach(function (k) { try { syncSet('finplan/p/' + k + '/pts/earned/kc_' + week, { n: pts, why: 'Kids’ menu challenge', ts: Date.now() }); } catch (e) {} if (typeof fpPay === 'function') fpPay(k, pay, '👩‍🍳 Menu challenge ' + week, 'kc_' + week + '_' + k); });
    put('plans/' + planId + '/status', 'approved'); put('plans/' + planId + '/review/score', res.score); put('plans/' + planId + '/review/ts', Date.now());
  }
  function changes() { put('plans/' + planId + '/status', 'draft'); }
  var members = mode === 'team' ? kidsHere.filter(function (k) { return teamMap[k]; }) : [pid], recv = +sh.receipt || 0, start = +sh.cardStart || 0, left = start - recv, diff = recv - res.total;
  var checkList = h('div', { style: card },
    h('div', { style: { fontSize: 11, color: '#9ad' } }, 'YOUR MENU’S ESTIMATE'),
    h('div', { style: { fontSize: 24, fontWeight: 900, color: res.n === 28 && res.total <= budget ? '#81C784' : '#FFB74D' } }, '$' + res.total.toFixed(2) + ' ', h('span', { style: { fontSize: 13, color: '#ccc' } }, 'of $' + budget + ' budget · score ' + res.score + '%')),
    res.checks.map(function (c) { return h('div', { key: c[0], style: { fontSize: 12, color: c[2] ? '#9be5bd' : '#FFCC80', padding: '2px 0' } }, (c[2] ? '✅ ' : '⬜ ') + c[1]); }));
  var picker = h('div', null, SM_DAYS.map(function (dn, di) {
    return h('div', { key: di, style: card }, h('div', { style: { fontSize: 13, fontWeight: 900, color: '#FFB74D', marginBottom: 4 } }, dn),
      SM_MEALS.map(function (m) { var opts = lib.filter(function (r) { return r.m === m[0]; }), cur = plan[di + '_' + m[0]] || '';
        return h('div', { key: m[0], style: { display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' } }, h('span', { style: { width: 22 } }, m[1]),
          mode === 'team' && (P.by || {})[di + '_' + m[0]] ? h('span', { style: { fontSize: 10, color: '#9ad', width: 14 } }, (P.by[di + '_' + m[0]] || '?')[0].toUpperCase()) : null,
          h('select', { value: cur, disabled: locked, onChange: function (e) { setSlot(di, m[0], e.target.value); }, style: Object.assign({}, inp, { flex: 1, minWidth: 0, padding: 6, fontSize: 12 }) }, h('option', { value: '', style: { color: '#000' } }, 'Choose…'), opts.map(function (r) { return h('option', { key: r.k, value: r.k, style: { color: '#000' } }, (r.own ? '⭐ ' : '') + r.t + ' · $' + ev[r.k].total.toFixed(2)); })));
      })); }));
  var shopping = h('div', null,
    h('div', { style: card }, h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 4 } }, '🛒 Your shopping list — est. $' + res.total.toFixed(2)),
      h('div', { style: { fontSize: 11, color: '#9ad', marginBottom: 6 } }, 'Things we already have are left off. At the store, check each item and type what you really paid.'),
      res.n < 28 ? h('div', { style: { fontSize: 12, color: '#FFCC80' } }, 'Finish planning all 28 meals to see the full list.') : null,
      Object.keys(SM_CATS).map(function (c) { var rows = shop.filter(function (s) { return s.cat === c; }); if (!rows.length) return null;
        return h('div', { key: c, style: { marginTop: 6 } }, h('div', { style: { fontSize: 12, fontWeight: 900, color: '#FFB74D' } }, SM_CATS[c]),
          rows.map(function (s, i) { var k = kcKey(c, s.lines.join('|')), done = (sh.bought || {})[k]; return h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' } },
            h('span', { onClick: function () { if (!locked) put('plans/' + planId + '/shop/bought/' + k, !done); }, style: { fontSize: 18, cursor: 'pointer' } }, done ? '✅' : '⬜'),
            h('div', { style: { flex: 1, fontSize: 12, color: done ? '#789' : '#eee', textDecoration: done ? 'line-through' : 'none' } }, kcLines(s.lines) + ' (est. $' + s.cost.toFixed(2) + ')'),
            h('input', { defaultValue: (sh.actual || {})[k] || '', key: k + ((sh.actual || {})[k] || ''), inputMode: 'decimal', placeholder: '$', onBlur: function (e) { put('plans/' + planId + '/shop/actual/' + k, e.target.value === '' ? null : Math.round((+e.target.value || 0) * 100) / 100); }, style: Object.assign({}, inp, { width: 62, padding: 5 }) })); })); })),
    h('div', { style: card }, h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '💳 Shop and balance the card'),
      h('div', { style: { fontSize: 11, color: '#9ad', marginBottom: 6 } }, 'Write down how much is on the debit card before you shop, then the receipt total after. The difference shows how well your plan matched real life.'),
      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, h('label', { style: { fontSize: 12, color: '#ccc' } }, 'Card before $', h('input', { defaultValue: sh.cardStart || '', key: 's' + sh.cardStart, inputMode: 'decimal', onBlur: function (e) { put('plans/' + planId + '/shop/cardStart', +e.target.value || 0); }, style: Object.assign({}, inp, { width: 80, marginLeft: 4 }) })), h('label', { style: { fontSize: 12, color: '#ccc' } }, 'Receipt total $', h('input', { defaultValue: sh.receipt || '', key: 'r' + sh.receipt, inputMode: 'decimal', onBlur: function (e) { put('plans/' + planId + '/shop/receipt', +e.target.value || 0); }, style: Object.assign({}, inp, { width: 80, marginLeft: 4 }) }))),
      recv > 0 ? h('div', { style: { marginTop: 8, fontSize: 13, color: '#fff', lineHeight: 1.7 } },
        h('div', null, 'Planned: $' + res.total.toFixed(2) + ' · Spent: $' + recv.toFixed(2)),
        h('div', { style: { color: diff <= 0 ? '#81C784' : '#FFB74D', fontWeight: 800 } }, diff <= 0 ? '✓ $' + Math.abs(diff).toFixed(2) + ' under your plan (' + Math.abs(Math.round(100 * diff / (res.total || 1))) + '%)' : '⚠ $' + diff.toFixed(2) + ' over your plan (' + Math.round(100 * diff / (res.total || 1)) + '%)'),
        start ? h('div', null, 'Left on the card: $' + left.toFixed(2)) : null) : null),
    h('div', { style: card }, h('div', { style: { fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '📝 Think it through'),
      q.map(function (t, i) { return h('div', { key: i, style: { marginBottom: 6 } }, h('div', { style: { fontSize: 12, color: '#ddd', marginBottom: 2 } }, (i + 1) + '. ' + t), h('textarea', { defaultValue: refl['q' + i] || '', key: 'q' + i + (refl['q' + i] || '').length, disabled: locked, rows: 2, onBlur: function (e) { put('plans/' + planId + '/reflect/q' + i, e.target.value); }, style: Object.assign({}, inp, { width: '100%' }) })); })));
  var done = status === 'approved';
  var compare = (done || admin) ? h('div', { style: Object.assign({}, card, { borderColor: 'rgba(179,136,255,.5)' }) },
    h('div', { style: { fontSize: 13, fontWeight: 900, color: '#B39DDB', marginBottom: 4 } }, admin ? '🔑 Smart Menu answer key (parents only until approved)' : '🔑 How your menu compared with the Smart Menu'),
    h('div', { style: { fontSize: 12, color: '#ddd', lineHeight: 1.6 } }, 'Smart Menu: about $' + bench.total.toFixed(2) + ' · score ' + benchScore.score + '%  |  Your menu: about $' + res.total.toFixed(2) + ' · score ' + res.score + '%'),
    admin ? h('div', { style: { marginTop: 6 } }, SM_DAYS.map(function (dn, di) { return h('div', { key: di, style: { fontSize: 11, color: '#cfc4e8' } }, dn.slice(0, 3) + ': ' + SM_MEALS.map(function (m) { return m[1] + ' ' + bench.byK[bench.days[di][m[0]]].t; }).join(' · ')); })) : h('div', { style: { fontSize: 11, color: '#9ad', marginTop: 4 } }, 'Which choices were different? Was yours cheaper or healthier anywhere?')) : null;
  return h('div', null,
    h('div', { style: { background: 'rgba(255,193,7,.12)', border: '1px solid rgba(255,193,7,.35)', borderRadius: 10, padding: 9, marginBottom: 8, fontSize: 11, color: '#FFE082', lineHeight: 1.5 } }, '🩺 Why this week matters: this menu is a kidney-stone-friendly trial week before the stone analysis (due before Nov 24, 2026). The advice is general. The right diet depends on the stone type, so keep the urologist’s results and 24-hour urine test in mind and adjust after them.'),
    h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.6)', lineHeight: 1.5, marginBottom: 8 } }, 'Plan next week’s menu for our family of 6, build the shopping list, shop with the debit card and balance the budget. It uses math (cost and percent), science (nutrition and kidney health) and money skills. A parent has already prepared a plan to compare with yours.'),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } }, h('button', { onClick: function () { setWeek(ktAddDays(week, -7)); }, style: KT_GHOST }, '‹'), h('div', { style: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 800, color: '#fff' } }, 'Menu for the week of ' + new Date(week + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })), h('button', { onClick: function () { setWeek(ktAddDays(week, 7)); }, style: KT_GHOST }, '›')),
    admin ? h('div', { style: card }, h('div', { style: { fontSize: 12, fontWeight: 900, color: '#FFD54F', marginBottom: 4 } }, '👪 Parent settings'),
      h('label', { style: { fontSize: 12, color: '#ccc' } }, 'Challenge budget for the week $', h('input', { defaultValue: budget, key: 'bg' + budget, inputMode: 'numeric', onBlur: function (e) { put('cfg/budget', Math.max(20, +e.target.value || 300)); }, style: Object.assign({}, inp, { width: 80, marginLeft: 4 }) })),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } }, kidsHere.map(function (k) { var pp = ((D.plans || {})[(teamMap[k] ? 'team' : k)] || {}).status || 'draft'; return h('button', { key: k, onClick: function () { setPid(k); }, style: btn(pid === k ? '#039BE5' : 'rgba(255,255,255,.1)') }, k + ' · ' + pp); }))) : null,
    h('div', { style: { display: 'flex', gap: 6, marginBottom: 10 } }, [['solo', '🙋 I plan alone'], ['team', '👥 Our team plans together']].map(function (m) { return h('button', { key: m[0], disabled: locked, onClick: function () { setMode(m[0]); }, style: btn(mode === m[0] ? '#4CAF82' : 'rgba(255,255,255,.1)') }, m[1]); })),
    h('div', { style: { fontSize: 11, color: '#9ad', marginBottom: 6 } }, mode === 'team' ? 'Team plan — ' + members.join(', ') + ' share one menu on every device and see each other’s changes live (small letter = who picked it). Team bonus when a parent approves: +25¢ and +2 points each.' : 'Your own plan.'),
    status !== 'draft' ? h('div', { style: { background: status === 'approved' ? 'rgba(76,175,80,.2)' : 'rgba(255,152,0,.2)', borderRadius: 10, padding: 9, marginBottom: 10, fontSize: 13, fontWeight: 800, color: '#fff' } }, status === 'approved' ? '✅ Approved by a parent and put on the weekly menu!' : '⏳ Turned in — waiting for a parent to review it.') : null,
    checkList,
    h('div', { style: { display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' } }, [['plan', '🗓 Plan the menu'], ['shop', '🛒 Shop & balance'], ['crew', '👥 Cook together']].map(function (v) { return h('button', { key: v[0], onClick: function () { setSec(v[0]); }, style: btn(sec === v[0] ? '#039BE5' : 'rgba(255,255,255,.1)') }, v[1]); })),
    sec === 'plan' ? picker : sec === 'crew' ? h(KitchenCrew, { week: week, isAdmin: admin, personId: pid0, kids: kidsHere }) : shopping,
    compare,
    status === 'draft' ? h('button', { onClick: submit, disabled: res.n < 28, style: Object.assign({}, btn('#4CAF82'), { width: '100%', padding: 12, fontSize: 14, opacity: res.n < 28 ? 0.5 : 1 }) }, res.n < 28 ? 'Plan all 28 meals to turn it in (' + res.n + '/28)' : '📤 Turn in my menu for review') : null,
    admin && status === 'submitted' ? h('div', { style: { display: 'flex', gap: 8 } }, h('button', { onClick: approve, style: Object.assign({}, btn('#4CAF82'), { flex: 1, padding: 11 }) }, '✔ Approve & put on weekly menu (+' + Math.round(res.score / 20) + ' pts)'), h('button', { onClick: changes, style: Object.assign({}, btn('#EF5350'), { padding: 11 }) }, 'Send back')) : null);
}
