// ═══ BETHEL STORE & ENVELOPES ═══════════════════════════════════════════════════════════════════
// Two kinds of money:
//   • BETHEL CASH (B$) — make-believe family money the kids earn. It lives in wallets/<id> (settings.payMode must be "pay").
//     It is spent inside the home: envelopes, house bills, the store, gifts.
//   • REAL CASH ($) — the real nest egg in the bank: nest/<id>. Parents deposit it, or Bethel Cash can be converted at the family rate.
// Envelope budgeting: earnings arrive "unassigned", the child puts them into envelopes (rent, utilities, food, fun, savings goals…),
// and bills/purchases are paid out of the envelopes. Honor system: everything is logged and the parents are told.
var ST_CATS = [['fun', '🎮 Fun & Screen Time', 'fun'], ['food', '🍎 Snacks & Meals', 'snacks'], ['house', '🧼 Family House Store', 'supplies']];
var ST_DEFAULT_ITEMS = [
  { id: 'scr30', cat: 'fun', emoji: '🎮', name: 'Video game / screen time — 30 min', cost: 1.5 },
  { id: 'scr60', cat: 'fun', emoji: '📺', name: 'Video game / screen time — 1 hour', cost: 2.5 },
  { id: 'play', cat: 'fun', emoji: '🛝', name: 'Fun play time with a parent — 1 hour', cost: 2 },
  { id: 'movie', cat: 'fun', emoji: '🍿', name: 'Pick the family movie night movie', cost: 3 },
  { id: 'friend', cat: 'fun', emoji: '👫', name: 'Friend hangout (parent approved)', cost: 4 },
  { id: 'snack', cat: 'food', emoji: '🍪', name: 'Snack of your choice', cost: 0.75 },
  { id: 'treat', cat: 'food', emoji: '🍦', name: 'Special treat', cost: 1.25 },
  { id: 'dinner', cat: 'food', emoji: '🍝', name: 'Pick tonight’s dinner', cost: 3 },
  { id: 'soap', cat: 'house', emoji: '🧼', name: 'Bar of soap', cost: 1 },
  { id: 'bodywash', cat: 'house', emoji: '🚿', name: 'Body wash', cost: 1.25 },
  { id: 'shampoo', cat: 'house', emoji: '🧴', name: 'Shampoo', cost: 1.5 },
  { id: 'cond', cat: 'house', emoji: '💆', name: 'Conditioner', cost: 1.5 },
  { id: 'tpaste', cat: 'house', emoji: '🪥', name: 'Toothpaste', cost: 0.75 },
  { id: 'tbrush', cat: 'house', emoji: '🦷', name: 'Toothbrush', cost: 0.5 },
  { id: 'deo', cat: 'house', emoji: '🌸', name: 'Deodorant', cost: 1.25 },
  { id: 'lotion', cat: 'house', emoji: '🧴', name: 'Lotion', cost: 1 }
];
// The bills a grown-up pays, scaled down for a student. Each is also an envelope.
var ST_DEFAULT_BILLS = [
  { id: 'rent', emoji: '🏠', name: 'Rent', cost: 20, dueDay: 1 },
  { id: 'elec', emoji: '💡', name: 'Electricity', cost: 6, dueDay: 5 },
  { id: 'water', emoji: '🚿', name: 'Water & sewer', cost: 3, dueDay: 5 },
  { id: 'trash', emoji: '🗑', name: 'Trash pickup', cost: 2, dueDay: 10 },
  { id: 'net', emoji: '🌐', name: 'Internet', cost: 4, dueDay: 10 },
  { id: 'food', emoji: '🍽', name: 'Groceries (food share)', cost: 15, dueDay: 15 },
  { id: 'cloth', emoji: '👕', name: 'Clothing', cost: 5, dueDay: 20 },
  { id: 'ride', emoji: '🚗', name: 'Transportation / gas', cost: 4, dueDay: 20 },
  { id: 'ins', emoji: '🏥', name: 'Insurance & health', cost: 4, dueDay: 25 },
  { id: 'school', emoji: '📚', name: 'School supplies', cost: 3, dueDay: 25 }
];
var ST_FREE_ENVS = [
  { id: 'fun', emoji: '🎮', name: 'Fun & screen time' },
  { id: 'snacks', emoji: '🍎', name: 'Snacks & treats' },
  { id: 'supplies', emoji: '🧼', name: 'Personal supplies' },
  { id: 'give', emoji: '🎁', name: 'Giving & gifts' }
];
function stList(v, def) { var a = Array.isArray(v) ? v : (v && typeof v === 'object' ? Object.values(v) : null); a = a && a.filter(Boolean); return a && a.length ? a : def; }
function stYM() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2); }
function stR(n) { return Math.round((+n || 0) * 100) / 100; }
function stUid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 4); }
function stMonthOf(ts) { var d = new Date(ts); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2); }

function BethelStore(props) {
  var h = React.createElement, isAdmin = !!props.isAdmin, myId = props.personId;
  var fam = (props.family || []).filter(function (p) { return p.inPaySystem && !p.deleted; });
  var kids = fam.filter(function (p) { return p.role !== 'parent'; });
  var sS = React.useState(isAdmin ? ((kids[0] || fam[0] || {}).id || myId) : myId), selRaw = sS[0], setSel = sS[1], sel = isAdmin ? selRaw : myId;
  var pS = React.useState('env'), panel = pS[0], setPanel = pS[1], mS = React.useState(''), msg = mS[0], setMsg = mS[1], fS = React.useState({}), form = fS[0], setForm = fS[1];
  var vS = React.useState('B'), view = vS[0], setView = vS[1];
  var wS = ktUse('wallets', {}), wallets = wS[0] || {}, cfgS = ktUse('store/cfg', null), cfg = cfgS[0] || {};
  var itS = ktUse('store/items', null), items = stList(itS[0], ST_DEFAULT_ITEMS), biS = ktUse('store/bills', null), bills = stList(biS[0], ST_DEFAULT_BILLS);
  var pdS = ktUse('store/paid/' + sel, {}), paid = pdS[0] || {}, invS = ktUse('store/inv/' + sel, {}), inv = Object.values(invS[0] || {}).sort(function (a, b) { return b.ts - a.ts; });
  var nS = ktUse('nest/' + sel, {}), nest = nS[0] || {}, ntx = Object.values(nest.tx || {}).sort(function (a, b) { return b.ts - a.ts; });
  var eS = ktUse('env/' + sel, {}), envData = eS[0] || {}, envBal = Object.assign({}, envData.bal || {}), etx = Object.values(envData.tx || {}).sort(function (a, b) { return b.ts - a.ts; });
  var rqS = ktUse('store/req', {}), reqAll = Object.values(rqS[0] || {}).sort(function (a, b) { return b.ts - a.ts; });
  var toStart = typeof stDaysToStart === 'function' ? stDaysToStart(cfg) : 0, started = toStart <= 0, startLbl = typeof stStartDate === 'function' ? stStartDate(cfg).toLocaleDateString([], { month: 'long', day: 'numeric' }) : '';
  var rate = +cfg.rate > 0 ? +cfg.rate : 10, ptsPerB = +cfg.ptsPerB > 0 ? +cfg.ptsPerB : 20, unit = props.payMode === 'points' ? ptsPerB : 1, allowance = cfg.allowance != null && cfg.allowance !== '' ? +cfg.allowance : 5;
  var w = wallets[sel] || { balance: 0, history: [] }, cash = stR((w.balance || 0) / unit), ym = stYM(), day = new Date().getDate();
  var me = fam.find(function (p) { return p.id === sel; }) || { name: sel, emoji: '🙂' };
  var cashOf = function (pid) { return stR((((wallets[pid] || { balance: 0 }).balance) || 0) / unit); };
  var B = function (n) { return 'B$' + stR(n).toFixed(2); };
  var show = function (n) { return view === 'B' ? B(n) : view === 'P' ? Math.round(n * ptsPerB) + ' pts' : '$' + stR(n / rate).toFixed(2); };
  var customEnvs = stList(envData.custom, []);
  var envs = bills.map(function (b) { return { id: 'b_' + b.id, emoji: b.emoji || '🧾', name: b.name, target: +b.cost, bill: b }; })
    .concat(ST_FREE_ENVS.map(function (e) { return { id: e.id, emoji: e.emoji, name: e.name }; }))
    .concat(customEnvs.map(function (c) { return { id: c.id, emoji: c.emoji || '⭐', name: c.name, goal: +c.goal || 0, custom: true, target: +c.goal || 0 }; }));
  var envTotal = envs.reduce(function (n, e) { return n + (envBal[e.id] || 0); }, 0);
  function say(t) { setMsg(t); setTimeout(function () { setMsg(''); }, 4500); }
  function setF(k, v) { setForm(function (p) { var n = Object.assign({}, p); n[k] = v; return n; }); }
  function walletWrite(pid, delta, reason) {
    var cur = wallets[pid] || { balance: 0, history: [] };
    var raw = stR(delta * unit), e = { id: stUid('tx'), type: delta < 0 ? 'purchase' : 'earned', amount: raw, reason: reason, timestamp: Date.now(), approved: true };
    var next = Object.assign({}, cur, { balance: stR((cur.balance || 0) + raw), history: [e].concat(cur.history || []).slice(0, 100) });
    syncSet('wallets/' + pid, next); wallets[pid] = next;
  }
  function envAdd(id, delta) { var v = stR((envBal[id] || 0) + delta); envBal[id] = v; syncSet('env/' + sel + '/bal/' + id, v); }
  function logTx(type, env, amt, desc) { var id = stUid('e'); try { syncSet('env/' + sel + '/tx/' + id, { id: id, ts: Date.now(), type: type, env: env || null, amt: stR(amt), desc: desc }); } catch (e) {} }
  function tell(type, who, title, text) { if (props.addNotif) { try { props.addNotif(type, who, title, text, { requiresApproval: false }); } catch (e) {} } }
  // take money for something: from the envelope first, then from unassigned cash
  function payFrom(envId, cost, desc, kind) {
    var eb = envBal[envId] || 0, fromEnv = Math.min(eb, cost), rest = stR(cost - fromEnv), curCash = cashOf(sel);
    if (rest > curCash + 0.001) { say('You need ' + B(rest - curCash) + ' more. Earn it, or move money into this envelope.'); return false; }
    if (fromEnv > 0) envAdd(envId, -fromEnv);
    if (rest > 0) walletWrite(sel, -rest, desc);
    logTx(kind || 'pay', envId, cost, desc);
    return true;
  }
  function fund(envId, amt) {
    amt = stR(amt); var curCash = cashOf(sel);
    if (!(amt > 0)) { say('Enter an amount.'); return; } if (amt > curCash + 0.001) { say('You only have ' + B(curCash) + ' unassigned.'); return; }
    walletWrite(sel, -amt, '✉️ Put into envelope'); envAdd(envId, amt); logTx('fund', envId, amt, 'Moved into envelope'); say('✉️ Moved ' + B(amt) + ' into the envelope.');
  }
  function buy(it) {
    var to = form['for_' + it.id] || sel, cost = +it.cost || 0, cat = ST_CATS.filter(function (c) { return c[0] === it.cat; })[0], envId = cat ? cat[2] : 'fun';
    if (!payFrom(envId, cost, '🛒 ' + it.name + (to !== sel ? ' (gift)' : ''), 'pay')) return;
    var id = stUid('v'); try { syncSet('store/inv/' + to + '/' + id, { id: id, itemId: it.id, name: it.name, emoji: it.emoji, cost: cost, from: sel, fromName: me.name, ts: Date.now(), used: null }); } catch (e) {}
    tell('purchase', sel, '🛒 ' + me.name + ' bought: ' + it.name, B(cost) + (to !== sel ? ' — as a gift for ' + ((fam.find(function (p) { return p.id === to; }) || {}).name || to) : ''));
    if (to !== sel) tell('gift', to, '🎁 ' + me.name + ' bought you: ' + it.name, 'Find it in My Stuff in the Bethel Store.');
    try { playSound('payment'); } catch (e) {} say('✅ Bought! It is in “My stuff”.');
  }
  function useIt(v) { try { syncSet('store/inv/' + sel + '/' + v.id, Object.assign({}, v, { used: Date.now() })); } catch (e) {} tell('purchase', sel, '✅ ' + me.name + ' is using: ' + v.name, 'Please give it to them (or tap OK).'); say('Told Mom & Dad. Enjoy!'); }
  function payBill(e) {
    var b = e.bill; if ((paid[ym] || {})[b.id]) return;
    if (!started) { say('Bills start ' + startLbl + '. You can fill the envelopes now!'); return; }
    if (!payFrom(e.id, +b.cost, '🏠 Paid: ' + b.name, 'pay')) return;
    try { syncSet('store/paid/' + sel + '/' + ym + '/' + b.id, Date.now()); } catch (x) {}
    tell('purchase', sel, '🏠 ' + me.name + ' paid ' + b.name, B(b.cost)); try { playSound('success'); } catch (x) {} say('✅ Bill paid. Great job being responsible!');
  }
  function nestWrite(delta, desc) {
    var bal = stR((+nest.balance || 0) + delta), id = stUid('n');
    syncSet('nest/' + sel + '/balance', bal); syncSet('nest/' + sel + '/tx/' + id, { id: id, ts: Date.now(), amount: delta, desc: desc, by: myId }); nest = Object.assign({}, nest, { balance: bal });
  }
  function convert() {
    var a = stR(form.cvt); if (a < rate) { say('Move at least ' + B(rate) + ' (that makes $1).'); return; }
    var curCash = cashOf(sel); if (a > curCash + 0.001) { say('You only have ' + B(curCash) + ' unassigned.'); return; }
    var dollars = stR(a / rate); walletWrite(sel, -a, '💵 Turned into real cash ($' + dollars.toFixed(2) + ')'); logTx('convert', null, a, 'To real cash'); nestWrite(dollars, 'Turned ' + B(a) + ' into real cash');
    tell('purchase', sel, '💵 ' + me.name + ' moved ' + B(a) + ' into real savings', '$' + dollars.toFixed(2) + ' added to the bank'); setF('cvt', ''); try { playSound('payment'); } catch (e) {} say('💰 $' + dollars.toFixed(2) + ' real cash added to your bank!');
  }
  function gift() {
    var to = form.giftTo, a = stR(form.giftAmt), curCash = cashOf(sel); if (!to) { say('Pick who to give to.'); return; } if (a <= 0 || a > curCash + 0.001) { say('Enter an amount up to ' + B(curCash) + '.'); return; }
    var nm = (fam.find(function (x) { return x.id === to; }) || {}).name || to;
    walletWrite(sel, -a, '🎁 Gift to ' + nm); walletWrite(to, a, '🎁 Gift from ' + me.name); logTx('pay', 'give', a, 'Gift to ' + nm);
    tell('gift', to, '🎁 ' + me.name + ' gave you ' + B(a) + '!', form.giftNote || ''); setF('giftAmt', ''); try { playSound('success'); } catch (e) {} say('🎁 Sent!');
  }
  function saveItems(arr) { try { syncSet('store/items', arr); } catch (e) {} }
  function saveBills(arr) { try { syncSet('store/bills', arr); } catch (e) {} }
  function saveCustom(arr) { try { syncSet('env/' + sel + '/custom', arr.length ? arr : null); } catch (e) {} }
  function addCustom() { var n = (form.cName || '').trim(); if (!n) { say('Give the envelope a name.'); return; } saveCustom(customEnvs.concat([{ id: stUid('c'), name: n, emoji: form.cEmoji || '⭐', goal: +form.cGoal || 0 }])); setF('cName', ''); setF('cGoal', ''); say('✉️ Envelope added.'); }
  function delCustom(c) { var bal = envBal[c.id] || 0; if (bal > 0) { walletWrite(sel, bal, '✉️ Envelope emptied: ' + c.name); envAdd(c.id, -bal); } saveCustom(customEnvs.filter(function (x) { return x.id !== c.id; })); }
  function askFor() {
    var n = (form.rName || '').trim(); if (!n) { say('What do you need?'); return; }
    var id = stUid('q'); try { syncSet('store/req/' + id, { id: id, pid: sel, name: n, price: stR(form.rPrice), note: form.rNote || '', status: 'pending', ts: Date.now() }); } catch (e) {}
    tell('request', sel, '🛍 ' + me.name + ' is asking for: ' + n, 'Suggested price ' + B(form.rPrice) + (form.rNote ? ' — ' + form.rNote : '') + '. Review it in the Bethel Store → Set up.');
    setF('rName', ''); setF('rPrice', ''); setF('rNote', ''); say('📨 Sent to Mom & Dad. They will approve it or set a price.');
  }
  function updReq(r, patch) { try { syncSet('store/req/' + r.id, Object.assign({}, r, patch)); } catch (e) {} }
  function decideReq(r, ok, price) { updReq(r, { status: ok ? 'approved' : 'declined', price: stR(price), decidedAt: Date.now() }); tell('request', r.pid, ok ? '✅ Approved: ' + r.name : '❌ Not this time: ' + r.name, ok ? 'Price: ' + B(price) + '. Find it in the Shop.' : ''); }
  function buyReq(r) { var envId = form['rEnv_' + r.id] || 'fun'; if (!payFrom(envId, +r.price, '🛍 ' + r.name, 'pay')) return; updReq(r, { status: 'bought', boughtAt: Date.now() }); var id = stUid('v'); try { syncSet('store/inv/' + sel + '/' + id, { id: id, itemId: r.id, name: r.name, emoji: '🛍', cost: r.price, from: sel, fromName: me.name, ts: Date.now(), used: null }); } catch (e) {} tell('purchase', sel, '🛍 ' + me.name + ' bought: ' + r.name, B(r.price)); try { playSound('payment'); } catch (e) {} say('✅ Bought!'); }
  function saveFor(r) { saveCustom(customEnvs.concat([{ id: stUid('c'), name: r.name, emoji: '🎯', goal: +r.price, reqId: r.id }])); say('🎯 A saving envelope for “' + r.name + '” was made. Fill it up!'); setPanel('env'); }
  var card = { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: 14, marginBottom: 12 };
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, color: '#fff', padding: 10, fontSize: 15, boxSizing: 'border-box' };
  var btn = function (bg, fg, fn, t, extra) { return h('button', { onClick: fn, style: Object.assign({ background: bg, color: fg, border: 'none', borderRadius: 16, padding: '10px 14px', fontWeight: 900, fontSize: 14, cursor: 'pointer' }, extra || {}) }, t); };
  var myReqs = reqAll.filter(function (r) { return r.pid === sel; }), pendingAll = reqAll.filter(function (r) { return r.status === 'pending'; });
  var unusedN = inv.filter(function (v) { return !v.used; }).length;
  var tabs = [['env', '✉️ Envelopes'], ['shop', '🛒 Shop'], ['sheet', '📊 Budget sheet'], ['bank', '🏦 Real cash bank'], ['gift', '🎁 Give'], ['mine', '🎟 My stuff' + (unusedN ? ' (' + unusedN + ')' : '')]].concat(isAdmin ? [['admin', '⚙️ Set up' + (pendingAll.length ? ' (' + pendingAll.length + ')' : '')]] : []);
  var dueEnvs = envs.filter(function (e) { return e.bill && !(paid[ym] || {})[e.bill.id]; });
  var envFund = function (e) {
    var need = e.target ? Math.max(0, stR(e.target - (envBal[e.id] || 0))) : 0;
    return h('div', { style: { display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' } },
      h('input', { type: 'number', step: '0.25', placeholder: 'B$ to add', value: form['f_' + e.id] || '', onChange: function (ev) { setF('f_' + e.id, ev.target.value); }, style: Object.assign({}, inp, { width: 100, padding: 7, fontSize: 13 }) }),
      btn('#039BE5', '#fff', function () { fund(e.id, form['f_' + e.id]); setF('f_' + e.id, ''); }, '＋ Add', { padding: '7px 12px', fontSize: 12 }),
      need > 0 && btn('rgba(255,255,255,.12)', '#fff', function () { fund(e.id, Math.min(need, cash)); }, 'Fill (' + B(need) + ')', { padding: '7px 12px', fontSize: 12 }));
  };
  return h('div', { style: { padding: '8px 14px 30px' } },
    h('div', { style: { fontSize: 22, fontWeight: 900, color: '#fff' } }, '🛒 Bethel Store & Envelopes'),
    isAdmin && h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0' } }, kids.map(function (p) { var on = p.id === sel; return h('button', { key: p.id, onClick: function () { setSel(p.id); }, style: { padding: '8px 12px', borderRadius: 18, border: '2px solid ' + (on ? '#FFD54F' : 'rgba(255,255,255,.2)'), background: on ? 'rgba(255,213,79,.18)' : 'transparent', color: '#fff', fontWeight: 800, cursor: 'pointer' } }, p.emoji + ' ' + p.name); })),
    isAdmin && h('div', { style: Object.assign({}, card, { padding: 10 }) }, h('div', { style: { fontSize: 12, color: '#c8c8d8', marginBottom: 6, lineHeight: 1.5 } }, 'How the family EARNS right now (chores and habits pay out in this):'),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' } }, [['pay', '💵 Dollars / Bethel Cash'], ['points', '⭐ Points']].map(function (m) { var on = (props.payMode === 'points' ? 'points' : 'pay') === m[0]; return h('button', { key: m[0], onClick: function () { props.updateSetting && props.updateSetting('payMode', m[0]); }, style: { padding: '8px 12px', borderRadius: 16, border: '2px solid ' + (on ? '#FFD54F' : 'rgba(255,255,255,.2)'), background: on ? 'rgba(255,213,79,.18)' : 'transparent', color: '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, m[1]); }),
        props.payMode === 'points' && h('div', { style: { fontSize: 11, color: '#b8b8c8' } }, ptsPerB + ' points = B$1 = $' + stR(1 / rate).toFixed(2)))),
    h('div', { style: Object.assign({}, card, { display: 'flex', gap: 10, alignItems: 'center', background: 'linear-gradient(135deg,rgba(255,213,79,.2),rgba(76,175,130,.15))' }) },
      h('div', { style: { fontSize: 34 } }, me.emoji),
      h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 12, color: '#c8c8d8' } }, '🎩 Bethel Cash on hand (not in an envelope)'), h('div', { style: { fontSize: 32, fontWeight: 900, color: '#FFD54F', lineHeight: 1 } }, show(cash)), h('div', { style: { fontSize: 11, color: '#c8c8d8', marginTop: 2 } }, 'In envelopes: ' + show(envTotal))),
      h('div', { style: { textAlign: 'right' } }, h('div', { style: { fontSize: 11, color: '#c8c8d8' } }, '🏦 Real cash'), h('div', { style: { fontSize: 22, fontWeight: 900, color: '#81C784' } }, '$' + stR(+nest.balance || 0).toFixed(2)))),
    h('div', { style: { display: 'flex', gap: 6, marginBottom: 10, alignItems: 'center' } }, h('div', { style: { fontSize: 12, color: '#c8c8d8' } }, 'Show amounts as:'), ['B', 'P', '$'].map(function (v) { var on = view === v; return h('button', { key: v, onClick: function () { setView(v); }, style: { padding: '6px 12px', borderRadius: 14, border: '2px solid ' + (on ? '#FFD54F' : 'rgba(255,255,255,.2)'), background: on ? 'rgba(255,213,79,.18)' : 'transparent', color: '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer' } }, v === 'B' ? 'Bethel Cash (B$)' : v === 'P' ? 'Points' : 'Real dollars ($)'); }), h('div', { style: { fontSize: 11, color: '#9a9ab0' } }, ptsPerB + ' pts = B$1 · ' + B(rate) + ' = $1')),
    started && dueEnvs.length > 0 && day >= Math.min.apply(null, dueEnvs.map(function (e) { return +e.bill.dueDay || 1; })) && h('div', { style: { background: 'rgba(239,83,80,.18)', border: '2px solid #EF5350', borderRadius: 14, padding: 10, marginBottom: 10, fontSize: 14, color: '#fff', cursor: 'pointer' }, onClick: function () { setPanel('env'); } }, '⏰ ' + dueEnvs.length + ' bill' + (dueEnvs.length > 1 ? 's' : '') + ' still to pay this month — tap to see.'),
    h('div', { style: { display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 10 } }, tabs.map(function (t) { var on = panel === t[0]; return h('button', { key: t[0], onClick: function () { setPanel(t[0]); }, style: { flexShrink: 0, padding: '10px 14px', borderRadius: 20, border: '2px solid ' + (on ? '#FFD54F' : 'rgba(255,255,255,.2)'), background: on ? 'rgba(255,213,79,.18)' : 'transparent', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, t[1]); })),
    msg && h('div', { style: { background: '#4CAF82', color: '#000', borderRadius: 12, padding: 10, fontWeight: 800, marginBottom: 10 } }, msg),
    // ── ENVELOPES ──
    panel === 'env' && h('div', null,
      !started && h('div', { style: Object.assign({}, card, { borderColor: '#FFB74D', background: 'rgba(255,183,77,.12)' }) }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#FFD54F' } }, '🏠 Bills start ' + startLbl + ' — in ' + toStart + ' day' + (toStart === 1 ? '' : 's')), h('div', { style: { fontSize: 13, color: '#fff', lineHeight: 1.6, marginTop: 4 } }, typeof stStartText === 'function' ? stStartText(cfg, bills) : '')),
      h('div', { style: { fontSize: 12, color: '#c8c8d8', lineHeight: 1.6, marginBottom: 10 } }, 'Every time you earn Bethel Cash, give it a job. Put it into envelopes. Bills and purchases come out of the envelopes. Nothing is spent that does not have a home.'),
      h('div', { style: card }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '🏠 Bills — ' + ym),
        envs.filter(function (e) { return e.bill; }).map(function (e) { var b = e.bill, done = (paid[ym] || {})[b.id], late = started && !done && day > (+b.dueDay || 1), eb = envBal[e.id] || 0, pct = Math.min(100, Math.round(eb / (+b.cost || 1) * 100));
          return h('div', { key: e.id, style: { padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
              h('div', { style: { fontSize: 24 } }, e.emoji),
              h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 15, color: '#fff', fontWeight: 800 } }, b.name + ' — ' + B(b.cost)), h('div', { style: { fontSize: 12, color: done ? '#81C784' : late ? '#FF8A80' : '#b8b8c8' } }, done ? '✅ Paid' : (late ? '⚠️ Past due (was the ' + b.dueDay + ')' : 'Due on the ' + b.dueDay) + ' · envelope has ' + show(eb))),
              done ? h('div', { style: { fontSize: 22 } }, '✅') : btn((eb + cash >= b.cost) ? '#4CAF82' : 'rgba(255,255,255,.12)', (eb + cash >= b.cost) ? '#000' : '#aaa', function () { payBill(e); }, 'Pay')),
            !done && h('div', null, h('div', { style: { height: 8, background: 'rgba(255,255,255,.1)', borderRadius: 4, overflow: 'hidden', marginTop: 6 } }, h('div', { style: { height: '100%', width: pct + '%', background: pct >= 100 ? '#4CAF82' : '#FFD54F' } })), envFund(e))); })),
      h('div', { style: card }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '✉️ Spending & saving envelopes'),
        envs.filter(function (e) { return !e.bill; }).map(function (e) { var eb = envBal[e.id] || 0, pct = e.goal ? Math.min(100, Math.round(eb / e.goal * 100)) : null;
          return h('div', { key: e.id, style: { padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } }, h('div', { style: { fontSize: 24 } }, e.emoji), h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 15, color: '#fff', fontWeight: 800 } }, e.name + (e.goal ? ' — goal ' + B(e.goal) : '')), h('div', { style: { fontSize: 12, color: '#b8b8c8' } }, 'In the envelope: ' + show(eb) + (pct != null ? ' (' + pct + '%)' : ''))),
              e.custom && h('button', { onClick: function () { delCustom(e); }, title: 'Remove (money goes back to unassigned)', style: { background: 'rgba(239,83,80,.2)', color: '#FF8A80', border: 'none', borderRadius: 10, padding: '6px 9px', cursor: 'pointer' } }, '🗑')),
            pct != null && h('div', { style: { height: 8, background: 'rgba(255,255,255,.1)', borderRadius: 4, overflow: 'hidden', marginTop: 6 } }, h('div', { style: { height: '100%', width: pct + '%', background: pct >= 100 ? '#4CAF82' : '#FFD54F' } })),
            envFund(e)); })),
      h('div', { style: card }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '➕ Make my own envelope (a saving goal)'),
        h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, h('input', { placeholder: '😀', value: form.cEmoji || '', onChange: function (e) { setF('cEmoji', e.target.value); }, style: Object.assign({}, inp, { width: 54 }) }), h('input', { placeholder: 'What are you saving for?', value: form.cName || '', onChange: function (e) { setF('cName', e.target.value); }, style: Object.assign({}, inp, { flex: 1, minWidth: 150 }) }), h('input', { type: 'number', placeholder: 'Goal B$', value: form.cGoal || '', onChange: function (e) { setF('cGoal', e.target.value); }, style: Object.assign({}, inp, { width: 100 }) }), btn('#4CAF82', '#000', addCustom, 'Add')))),
    // ── SHOP ──
    panel === 'shop' && h('div', null,
      h('div', { style: card }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff' } }, '🛍 Need something that is not here?'),
        h('div', { style: { fontSize: 12, color: '#c8c8d8', margin: '2px 0 8px', lineHeight: 1.5 } }, 'Ask for it. Say what it is and what you think it costs (look it up if you can). Mom or Dad will approve it or set the price.'),
        h('input', { placeholder: 'What do you need?', value: form.rName || '', onChange: function (e) { setF('rName', e.target.value); }, style: Object.assign({}, inp, { width: '100%', marginBottom: 8 }) }),
        h('div', { style: { display: 'flex', gap: 8, marginBottom: 8 } }, h('input', { type: 'number', step: '0.25', placeholder: 'Price in B$', value: form.rPrice || '', onChange: function (e) { setF('rPrice', e.target.value); }, style: Object.assign({}, inp, { width: 130 }) }), h('input', { placeholder: 'Link or notes (optional)', value: form.rNote || '', onChange: function (e) { setF('rNote', e.target.value); }, style: Object.assign({}, inp, { flex: 1 }) })),
        btn('#EC407A', '#fff', askFor, '📨 Ask for it'),
        myReqs.length > 0 && h('div', { style: { marginTop: 12 } }, myReqs.map(function (r) {
          return h('div', { key: r.id, style: { padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
            r.status === 'pending' ? h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' } }, h('input', { defaultValue: r.name, onBlur: function (e) { updReq(r, { name: e.target.value }); }, style: Object.assign({}, inp, { flex: 1, minWidth: 130, padding: 7, fontSize: 14 }) }), h('input', { type: 'number', defaultValue: r.price, step: '0.25', onBlur: function (e) { updReq(r, { price: stR(e.target.value) }); }, style: Object.assign({}, inp, { width: 80, padding: 7, fontSize: 14 }) }), h('span', { style: { fontSize: 12, color: '#FFD54F' } }, '⏳ waiting'), h('button', { onClick: function () { try { syncSet('store/req/' + r.id, null); } catch (e) {} }, style: { background: 'rgba(239,83,80,.2)', color: '#FF8A80', border: 'none', borderRadius: 10, padding: '6px 9px', cursor: 'pointer' } }, '🗑'))
            : r.status === 'approved' ? h('div', null, h('div', { style: { fontSize: 15, color: '#fff', fontWeight: 800 } }, '⭐ ' + r.name + ' — ' + B(r.price) + ' (approved)'), h('div', { style: { display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' } }, h('select', { value: form['rEnv_' + r.id] || 'fun', onChange: function (e) { setF('rEnv_' + r.id, e.target.value); }, style: Object.assign({}, inp, { padding: 7, fontSize: 13 }) }, envs.map(function (e) { return h('option', { key: e.id, value: e.id, style: { color: '#000' } }, e.emoji + ' ' + e.name); })), btn('#FFD54F', '#000', function () { buyReq(r); }, 'Buy now', { padding: '7px 12px', fontSize: 13 }), btn('#039BE5', '#fff', function () { saveFor(r); }, '🎯 Save up for it', { padding: '7px 12px', fontSize: 13 })))
            : h('div', { style: { fontSize: 13, color: '#b8b8c8' } }, (r.status === 'declined' ? '❌ ' : '✅ ') + r.name + ' — ' + r.status)); }))),
      ST_CATS.map(function (c) {
        var list = items.filter(function (it) { return it.cat === c[0]; }); if (!list.length) return null;
        return h('div', { key: c[0], style: card }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 2 } }, c[1]), h('div', { style: { fontSize: 11, color: '#9a9ab0', marginBottom: 6 } }, 'Paid from your “' + (ST_FREE_ENVS.filter(function (e) { return e.id === c[2]; })[0] || {}).name + '” envelope first, then cash on hand.'),
          list.map(function (it) { var can = (envBal[c[2]] || 0) + cash >= it.cost;
            return h('div', { key: it.id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
              h('div', { style: { fontSize: 26 } }, it.emoji),
              h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 14, color: '#fff', fontWeight: 700 } }, it.name), h('select', { value: form['for_' + it.id] || sel, onChange: function (e) { setF('for_' + it.id, e.target.value); }, style: Object.assign({}, inp, { padding: '3px 6px', fontSize: 11, marginTop: 3 }) }, fam.map(function (p) { return h('option', { key: p.id, value: p.id, style: { color: '#000' } }, (p.id === sel ? 'For me' : 'For ' + p.name)); }))),
              btn(can ? '#FFD54F' : 'rgba(255,255,255,.12)', can ? '#000' : '#aaa', function () { buy(it); }, B(it.cost), { flexShrink: 0 })); })); })),
    // ── BUDGET SHEET ──
    panel === 'sheet' && (function () {
      var inMonth = function (ts) { return stMonthOf(ts) === ym; };
      var income = (w.history || []).filter(function (t) { return inMonth(t.timestamp) && t.amount > 0 && !/Gift from|Envelope emptied/.test(t.reason || ''); }).reduce(function (n, t) { return n + t.amount / unit; }, 0);
      var gifts = (w.history || []).filter(function (t) { return inMonth(t.timestamp) && t.amount > 0 && /Gift from/.test(t.reason || ''); }).reduce(function (n, t) { return n + t.amount / unit; }, 0);
      var mtx = etx.filter(function (t) { return inMonth(t.ts); });
      var spentBy = {}, fundedBy = {}; mtx.forEach(function (t) { if (t.type === 'pay') spentBy[t.env] = (spentBy[t.env] || 0) + t.amt; if (t.type === 'fund') fundedBy[t.env] = (fundedBy[t.env] || 0) + t.amt; });
      var converted = mtx.filter(function (t) { return t.type === 'convert'; }).reduce(function (n, t) { return n + t.amt; }, 0);
      var spentAll = Object.keys(spentBy).reduce(function (n, k) { return n + spentBy[k]; }, 0);
      var td = { padding: '6px 4px', fontSize: 13, color: '#ddd', borderTop: '1px solid rgba(255,255,255,.08)' }, tr = Object.assign({}, td, { textAlign: 'right' });
      return h('div', { style: card }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff' } }, '📊 Budget sheet — ' + ym), h('div', { style: { fontSize: 12, color: '#c8c8d8', margin: '2px 0 8px' } }, 'Where all of ' + me.name + '’s money went this month. Use the buttons at the top to see it in Bethel Cash or real dollars.'),
        h('table', { style: { width: '100%', borderCollapse: 'collapse' } }, h('tbody', null,
          h('tr', null, h('td', { style: Object.assign({}, td, { fontWeight: 900, color: '#81C784' }) }, '⬆ Earned this month'), h('td', { style: Object.assign({}, tr, { fontWeight: 900, color: '#81C784' }) }, show(income))),
          gifts > 0 && h('tr', null, h('td', { style: td }, '🎁 Gifts received'), h('td', { style: tr }, show(gifts))),
          h('tr', null, h('td', { colSpan: 2, style: Object.assign({}, td, { fontWeight: 900, color: '#FFD54F', paddingTop: 12 }) }, 'Envelopes — put in / spent / left')),
          envs.map(function (e) { return h('tr', { key: e.id }, h('td', { style: td }, e.emoji + ' ' + e.name), h('td', { style: tr }, '＋' + show(fundedBy[e.id] || 0) + ' / −' + show(spentBy[e.id] || 0) + ' / ' + show(envBal[e.id] || 0))); }),
          h('tr', null, h('td', { style: Object.assign({}, td, { fontWeight: 900, paddingTop: 12 }) }, '⬇ Spent this month'), h('td', { style: Object.assign({}, tr, { fontWeight: 900, paddingTop: 12, color: '#FF8A80' }) }, show(spentAll))),
          h('tr', null, h('td', { style: td }, '🏦 Turned into real cash'), h('td', { style: tr }, show(converted) + ' = $' + stR(converted / rate).toFixed(2))),
          h('tr', null, h('td', { style: td }, '💼 Still in envelopes'), h('td', { style: tr }, show(envTotal))),
          h('tr', null, h('td', { style: td }, '🎩 Unassigned cash on hand'), h('td', { style: Object.assign({}, tr, { color: cash > 0 ? '#FFB74D' : '#ddd' }) }, show(cash))),
          h('tr', null, h('td', { style: Object.assign({}, td, { fontWeight: 900 }) }, 'Total on hand now'), h('td', { style: Object.assign({}, tr, { fontWeight: 900 }) }, show(envTotal + cash))))),
        cash > 0.005 && h('div', { style: { marginTop: 10, background: 'rgba(255,183,77,.14)', borderRadius: 10, padding: 10, fontSize: 13, color: '#fff' } }, '💡 You still have ' + show(cash) + ' with no job. A balanced budget gives every B$ a job — put it in an envelope.'),
        cash <= 0.005 && income > 0 && h('div', { style: { marginTop: 10, background: 'rgba(76,175,130,.16)', borderRadius: 10, padding: 10, fontSize: 13, color: '#fff' } }, '✅ Every B$ has a job. That is a balanced budget!'));
    })(),
    // ── REAL CASH BANK ──
    panel === 'bank' && h('div', null,
      h('div', { style: card }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff' } }, '🏦 Real cash bank (the nest egg)'), h('div', { style: { fontSize: 34, fontWeight: 900, color: '#81C784' } }, '$' + stR(+nest.balance || 0).toFixed(2)),
        h('div', { style: { fontSize: 12, color: '#c8c8d8', lineHeight: 1.5, margin: '4px 0 10px' } }, 'This is real money, saved for when you grow up. Bethel Cash only works inside our home. You can turn Bethel Cash into real cash: ' + B(rate) + ' = $1.'),
        h('div', { style: { display: 'flex', gap: 8 } }, h('input', { type: 'number', step: '0.5', placeholder: 'B$ to turn into real cash (min ' + rate + ')', value: form.cvt || '', onChange: function (e) { setF('cvt', e.target.value); }, style: Object.assign({}, inp, { flex: 1 }) }), btn('#4CAF82', '#000', convert, 'Move to bank')),
        form.cvt > 0 && h('div', { style: { fontSize: 12, color: '#81C784', marginTop: 6 } }, '= $' + stR((+form.cvt) / rate).toFixed(2) + ' real cash')),
      isAdmin && h('div', { style: card }, h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '👨‍👩‍👧 Parent tools — real dollars'),
        h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' } },
          btn(nest.lastAllowance === ym ? 'rgba(255,255,255,.12)' : '#039BE5', nest.lastAllowance === ym ? '#aaa' : '#fff', function () { if (nest.lastAllowance === ym) { say('Already paid this month.'); return; } nestWrite(allowance, 'Monthly savings deposit'); try { syncSet('nest/' + sel + '/lastAllowance', ym); } catch (e) {} say('✅ $' + allowance + ' deposited.'); }, nest.lastAllowance === ym ? '✔ ' + ym + ' deposit made' : '💵 Pay monthly $' + allowance + ' deposit'),
          h('input', { type: 'number', step: '0.01', placeholder: '$ amount', value: form.dep || '', onChange: function (e) { setF('dep', e.target.value); }, style: Object.assign({}, inp, { width: 110 }) }),
          btn('#4CAF82', '#000', function () { var a = stR(form.dep); if (a > 0) { nestWrite(a, 'Deposit recorded by parent'); setF('dep', ''); say('✅ Deposit recorded.'); } }, '＋ Record deposit'),
          btn('rgba(239,83,80,.3)', '#FF8A80', function () { var a = stR(form.dep); if (a > 0) { nestWrite(-a, 'Withdrawal recorded by parent'); setF('dep', ''); say('Withdrawal recorded.'); } }, '− Withdraw'))),
      h('div', { style: card }, h('div', { style: { fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 4 } }, 'History'), ntx.length === 0 && h('div', { style: { color: '#888', fontSize: 13 } }, 'Nothing yet.'),
        ntx.slice(0, 20).map(function (t) { return h('div', { key: t.id, style: { display: 'flex', fontSize: 13, color: '#ddd', padding: '4px 0', borderTop: '1px solid rgba(255,255,255,.06)' } }, h('div', { style: { flex: 1 } }, new Date(t.ts).toLocaleDateString() + ' · ' + t.desc), h('b', { style: { color: t.amount < 0 ? '#FF8A80' : '#81C784' } }, (t.amount < 0 ? '-' : '+') + '$' + Math.abs(t.amount).toFixed(2))); }))),
    // ── GIVE ──
    panel === 'gift' && h('div', { style: card }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff' } }, '🎁 Give Bethel Cash to someone'),
      h('div', { style: { fontSize: 12, color: '#c8c8d8', margin: '2px 0 8px' } }, 'Kind things feel good. You have ' + B(cash) + ' on hand.'),
      h('select', { value: form.giftTo || '', onChange: function (e) { setF('giftTo', e.target.value); }, style: Object.assign({}, inp, { width: '100%', marginBottom: 8 }) }, [h('option', { key: '', value: '', style: { color: '#000' } }, 'Who is it for?')].concat(fam.filter(function (p) { return p.id !== sel; }).map(function (p) { return h('option', { key: p.id, value: p.id, style: { color: '#000' } }, p.emoji + ' ' + p.name); }))),
      h('input', { type: 'number', step: '0.25', placeholder: 'How many B$?', value: form.giftAmt || '', onChange: function (e) { setF('giftAmt', e.target.value); }, style: Object.assign({}, inp, { width: '100%', marginBottom: 8 }) }),
      h('input', { type: 'text', placeholder: 'A kind note (optional)', value: form.giftNote || '', onChange: function (e) { setF('giftNote', e.target.value); }, style: Object.assign({}, inp, { width: '100%', marginBottom: 10 }) }),
      btn('#EC407A', '#fff', gift, '🎁 Send the gift')),
    // ── MY STUFF ──
    panel === 'mine' && h('div', { style: card }, h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '🎟 My stuff'),
      inv.length === 0 && h('div', { style: { color: '#888', fontSize: 13 } }, 'Buy something in the Shop and it shows up here.'),
      inv.map(function (v) { return h('div', { key: v.id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)', opacity: v.used ? .5 : 1 } },
        h('div', { style: { fontSize: 26 } }, v.emoji), h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 14, color: '#fff', fontWeight: 700 } }, v.name), h('div', { style: { fontSize: 11, color: '#b8b8c8' } }, (v.from && v.from !== sel ? 'Gift from ' + v.fromName + ' · ' : '') + (v.used ? 'Used ' + new Date(v.used).toLocaleDateString() : 'Ready to use'))),
        !v.used && btn('#4CAF82', '#000', function () { useIt(v); }, 'Use it')); })),
    // ── ADMIN SETUP ──
    panel === 'admin' && isAdmin && h('div', null,
      pendingAll.length > 0 && h('div', { style: Object.assign({}, card, { borderColor: '#EC407A' }) }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '🛍 Requests from the kids'),
        pendingAll.map(function (r) { var who = (fam.find(function (p) { return p.id === r.pid; }) || {}).name || r.pid, pr = form['rp_' + r.id] != null ? form['rp_' + r.id] : r.price;
          return h('div', { key: r.id, style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' } }, h('div', { style: { fontSize: 14, color: '#fff' } }, h('b', null, who), ' wants: ', r.name, r.note ? ' — ' + r.note : ''),
            h('div', { style: { display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' } }, 'Price B$', h('input', { type: 'number', step: '0.25', value: pr, onChange: function (e) { setF('rp_' + r.id, e.target.value); }, style: Object.assign({}, inp, { width: 90, padding: 7 }) }), btn('#4CAF82', '#000', function () { decideReq(r, true, pr); }, 'Approve', { padding: '7px 12px' }), btn('rgba(239,83,80,.3)', '#FF8A80', function () { decideReq(r, false, pr); }, 'Not now', { padding: '7px 12px' }))); })),
      h('div', { style: card }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '⚙️ The economy'),
        h('div', { style: { fontSize: 12, color: '#c8c8d8', lineHeight: 1.6, marginBottom: 8 } }, 'Bethel Cash is what they earn from chores, habits and schoolwork. These bills add up to ' + B(bills.reduce(function (n, b) { return n + (+b.cost || 0); }, 0)) + ' a month. Watch what they earn for a week or two, then raise or lower the bills and prices so a good month leaves some left to save and enjoy.'),
        h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
          h('div', { style: { flex: 1, minWidth: 140 } }, h('div', { style: { fontSize: 11, color: '#b8b8c8' } }, 'B$ that equal $1 real'), h('input', { type: 'number', defaultValue: rate, onBlur: function (e) { try { syncSet('store/cfg', Object.assign({}, cfg, { rate: +e.target.value })); } catch (x) {} }, style: Object.assign({}, inp, { width: '100%' }) })),
          h('div', { style: { flex: 1, minWidth: 140 } }, h('div', { style: { fontSize: 11, color: '#b8b8c8' } }, 'Bills start on'), h('input', { type: 'date', defaultValue: cfg.billsStart || '2026-11-01', onBlur: function (e) { try { syncSet('store/cfg', Object.assign({}, cfg, { billsStart: e.target.value })); } catch (x) {} }, style: Object.assign({}, inp, { width: '100%' }) })),
          h('div', { style: { flex: 1, minWidth: 140 } }, h('div', { style: { fontSize: 11, color: '#b8b8c8' } }, 'Points that equal B$1'), h('input', { type: 'number', defaultValue: ptsPerB, onBlur: function (e) { try { syncSet('store/cfg', Object.assign({}, cfg, { ptsPerB: +e.target.value })); } catch (x) {} }, style: Object.assign({}, inp, { width: '100%' }) })),
          h('div', { style: { flex: 1, minWidth: 140 } }, h('div', { style: { fontSize: 11, color: '#b8b8c8' } }, 'Monthly real-cash deposit ($)'), h('input', { type: 'number', step: '0.5', defaultValue: allowance, onBlur: function (e) { try { syncSet('store/cfg', Object.assign({}, cfg, { allowance: +e.target.value })); } catch (x) {} }, style: Object.assign({}, inp, { width: '100%' })  })))),
      h('div', { style: card }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '🛒 Items in the store (B$)'),
        items.map(function (it, i) { return h('div', { key: it.id + i, style: { display: 'flex', gap: 4, alignItems: 'center', marginBottom: 6 } },
          h('input', { defaultValue: it.emoji, onBlur: function (e) { var a = items.slice(); a[i] = Object.assign({}, it, { emoji: e.target.value }); saveItems(a); }, style: Object.assign({}, inp, { width: 44, padding: 6 }) }),
          h('input', { defaultValue: it.name, onBlur: function (e) { var a = items.slice(); a[i] = Object.assign({}, it, { name: e.target.value }); saveItems(a); }, style: Object.assign({}, inp, { flex: 1, padding: 6, fontSize: 13 }) }),
          h('select', { defaultValue: it.cat, onChange: function (e) { var a = items.slice(); a[i] = Object.assign({}, it, { cat: e.target.value }); saveItems(a); }, style: Object.assign({}, inp, { padding: 6, fontSize: 12, width: 70 }) }, ST_CATS.map(function (c) { return h('option', { key: c[0], value: c[0], style: { color: '#000' } }, c[1].split(' ')[0]); })),
          h('input', { type: 'number', step: '0.25', defaultValue: it.cost, onBlur: function (e) { var a = items.slice(); a[i] = Object.assign({}, it, { cost: +e.target.value }); saveItems(a); }, style: Object.assign({}, inp, { width: 70, padding: 6 }) }),
          h('button', { onClick: function () { saveItems(items.filter(function (_, j) { return j !== i; })); }, style: { background: 'rgba(239,83,80,.3)', color: '#FF8A80', border: 'none', borderRadius: 10, padding: '8px 10px', cursor: 'pointer' } }, '🗑')); }),
        h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } }, btn('#4CAF82', '#000', function () { saveItems(items.concat([{ id: stUid('i'), cat: 'fun', emoji: '⭐', name: 'New item', cost: 1 }])); }, '＋ Add an item'), btn('transparent', '#c8c8d8', function () { try { syncSet('store/items', null); } catch (e) {} }, 'Back to the starting list', { border: '1px solid rgba(255,255,255,.3)' }))),
      h('div', { style: card }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '🏠 Bills every child pays each month (B$)'),
        bills.map(function (b, i) { return h('div', { key: b.id + i, style: { display: 'flex', gap: 4, alignItems: 'center', marginBottom: 6 } },
          h('input', { defaultValue: b.emoji || '🧾', onBlur: function (e) { var a = bills.slice(); a[i] = Object.assign({}, b, { emoji: e.target.value }); saveBills(a); }, style: Object.assign({}, inp, { width: 44, padding: 6 }) }),
          h('input', { defaultValue: b.name, onBlur: function (e) { var a = bills.slice(); a[i] = Object.assign({}, b, { name: e.target.value }); saveBills(a); }, style: Object.assign({}, inp, { flex: 1, padding: 6, fontSize: 13 }) }),
          h('input', { type: 'number', step: '0.25', defaultValue: b.cost, onBlur: function (e) { var a = bills.slice(); a[i] = Object.assign({}, b, { cost: +e.target.value }); saveBills(a); }, style: Object.assign({}, inp, { width: 66, padding: 6 }) }),
          h('input', { type: 'number', defaultValue: b.dueDay, onBlur: function (e) { var a = bills.slice(); a[i] = Object.assign({}, b, { dueDay: +e.target.value }); saveBills(a); }, style: Object.assign({}, inp, { width: 48, padding: 6 }) }),
          h('button', { onClick: function () { saveBills(bills.filter(function (_, j) { return j !== i; })); }, style: { background: 'rgba(239,83,80,.3)', color: '#FF8A80', border: 'none', borderRadius: 10, padding: '8px 10px', cursor: 'pointer' } }, '🗑')); }),
        h('div', { style: { fontSize: 11, color: '#9a9ab0', marginBottom: 6 } }, 'Icon · name · B$ per month · day of the month it is due'),
        h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, btn('#4CAF82', '#000', function () { saveBills(bills.concat([{ id: stUid('b'), emoji: '🧾', name: 'New bill', cost: 2, dueDay: 15 }])); }, '＋ Add a bill'), btn('transparent', '#c8c8d8', function () { try { syncSet('store/bills', null); } catch (e) {} }, 'Back to the starting bills', { border: '1px solid rgba(255,255,255,.3)' }))),
      h('div', { style: card }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 } }, '➕ Give or take Bethel Cash from ' + me.name),
        h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
          h('input', { type: 'number', step: '0.25', placeholder: 'B$ (use − to take away)', value: form.adj || '', onChange: function (e) { setF('adj', e.target.value); }, style: Object.assign({}, inp, { width: 150 }) }),
          h('input', { type: 'text', placeholder: 'Reason', value: form.adjWhy || '', onChange: function (e) { setF('adjWhy', e.target.value); }, style: Object.assign({}, inp, { flex: 1, minWidth: 120 }) }),
          btn('#039BE5', '#fff', function () { var a = stR(form.adj); if (!a) return; walletWrite(sel, a, (a > 0 ? '⭐ Bonus: ' : '➖ Adjustment: ') + (form.adjWhy || 'from a parent')); tell('payment', sel, a > 0 ? '⭐ You got ' + B(a) + '!' : '➖ ' + B(Math.abs(a)) + ' taken', form.adjWhy || ''); setF('adj', ''); setF('adjWhy', ''); say('Done.'); }, 'Apply')))));
}
