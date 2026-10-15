// ═══ MONEY MODULE — allowance bank for the kids (checking · savings · bills · credit) ═══════════
// Checking = the family wallet (earned + approved money/points). Savings, credit and bills live in bank/<id>.
// Kids REQUEST every move (transfer, bill payment, credit use); an admin approves, edits, deletes or adds anything.
// Works in Cash ($) or Points mode — the admin picks in the Money tab (settings.payMode).

var MONEY_LESSONS = [
  { t: '🐷 Pay yourself first', b: 'When you earn, move some to Savings right away — before you spend. Even 10% adds up fast.' },
  { t: '🎯 Needs vs. wants', b: 'A need keeps you safe and healthy. A want is nice to have. Pay bills (needs) first, then choose wants.' },
  { t: '📈 Interest', b: 'Savings pays you a little extra each month. Credit charges you extra on what you owe — so pay it off quickly.' },
  { t: '💳 Credit is borrowing', b: 'Using credit means spending money you do not have yet. You must pay it back, plus interest if you wait.' },
  { t: '🧾 Bills come every month', b: 'Bills are promises. Pay on time so you never owe extra — and so others can trust you.' },
  { t: '🎁 Give + save + spend', b: 'A healthy plan has three parts: something to give, something to save, and something to spend wisely.' }
];

function mnRound(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
function mnYM(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2); }
function mnUid(p) { return p + Date.now() + Math.random().toString(36).slice(2, 5); }

function MoneyModule(props) {
  var h = React.createElement;
  var personId = props.personId;
  var isAdmin = !!props.isAdmin;
  var payMode = props.payMode || 'pay';
  var family = (props.family || []).filter(function (p) { return p.inPaySystem && !p.deleted; });
  var settings = props.settings || {};
  var unit = payMode === 'pay' ? '$' : '';
  function fmt(v) { v = Number(v) || 0; return payMode === 'pay' ? (v < 0 ? '-$' : '$') + Math.abs(v).toFixed(2) : (Math.round(v * 10) / 10) + ' pts'; }

  var selState = React.useState(function () {
    var mine = family.find(function (p) { return p.id === personId; });
    return mine ? personId : (family[0] ? family[0].id : personId);
  });
  var sel = isAdmin ? selState[0] : personId, setSel = selState[1];

  var walletsS = React.useState({}), wallets = walletsS[0], setWallets = walletsS[1];
  var banksS = React.useState({}), banks = banksS[0], setBanks = banksS[1];
  var panelS = React.useState('accounts'), panel = panelS[0], setPanel = panelS[1];
  var msgS = React.useState(''), msg = msgS[0], setMsg = msgS[1];
  var formS = React.useState({}), form = formS[0], setForm = formS[1];

  React.useEffect(function () {
    var u1 = null, u2 = null;
    try {
      u1 = syncOn('wallets', function (d) { if (d) setWallets(d); });
      u2 = isAdmin
        ? syncOn('bank', function (d) { setBanks(d || {}); })
        : syncOn('bank/' + personId, function (d) { var o = {}; o[personId] = d || {}; setBanks(o); });
    } catch (e) {}
    return function () { if (typeof u1 === 'function') u1(); if (typeof u2 === 'function') u2(); };
  }, [personId, isAdmin]);

  var wallet = wallets[sel] || { balance: 0, pending: 0, history: [] };
  var bank = banks[sel] || {};
  var savings = (bank.savings && bank.savings.balance) || 0;
  var owed = (bank.credit && bank.credit.owed) || 0;
  var bs = bank.settings || {};
  var savApr = bs.savApr != null ? bs.savApr : 2;
  var creditLimit = bs.creditLimit != null ? bs.creditLimit : (payMode === 'pay' ? 25 : 100);
  var creditApr = bs.creditApr != null ? bs.creditApr : 10;
  var available = Math.max(0, creditLimit - owed);
  var checking = wallet.balance || 0;
  var txs = Object.values(bank.tx || {}).sort(function (a, b) { return b.ts - a.ts; });
  var bills = Object.values(bank.bills || {}).sort(function (a, b) { return (a.dueDay || 1) - (b.dueDay || 1); });
  var ym = mnYM();
  var person = family.find(function (p) { return p.id === sel; }) || {};

  function say(t) { setMsg(t); setTimeout(function () { setMsg(''); }, 3500); }
  function setF(k, v) { setForm(function (p) { var n = Object.assign({}, p); n[k] = v; return n; }); }

  // ── low-level writers ───────────────────────────────────────────────────────
  function writeChecking(delta, reason) {
    if (!delta) return;
    var w = wallets[sel] || { balance: 0, pending: 0, history: [] };
    var entry = { id: mnUid('tx'), type: 'bank', amount: delta, reason: reason, timestamp: Date.now(), approved: true };
    syncSet('wallets/' + sel, Object.assign({}, w, { balance: mnRound((w.balance || 0) + delta), history: [entry].concat(w.history || []).slice(0, 100) }));
  }
  function writeSavings(delta) { if (delta) syncSet('bank/' + sel + '/savings', { balance: mnRound(savings + delta) }); }
  function writeCredit(delta) { if (delta) syncSet('bank/' + sel + '/credit', { owed: Math.max(0, mnRound(owed + delta)) }); }
  function applyDeltas(d, sign, reason) {
    writeChecking((d.checking || 0) * sign, reason);
    writeSavings((d.savings || 0) * sign);
    writeCredit((d.credit || 0) * sign);
  }
  function markBill(billId, month, paid) {
    if (!billId) return;
    syncSet('bank/' + sel + '/bills/' + billId + '/paid/' + month, paid ? Date.now() : null);
  }
  function record(tx) {
    var t = Object.assign({ id: mnUid('b'), ts: Date.now(), by: personId }, tx);
    syncSet('bank/' + sel + '/tx/' + t.id, t);
    return t;
  }

  // ── monthly interest (savings earns, credit charges) ────────────────────────
  React.useEffect(function () {
    if (!sel || !banks[sel] && !isAdmin) return;
    var t = setTimeout(function () {
      var last = bs.lastInterest;
      if (!last) { syncSet('bank/' + sel + '/settings/lastInterest', ym); return; }
      if (last >= ym) return;
      syncSet('bank/' + sel + '/settings/lastInterest', ym);
      var si = mnRound(savings * savApr / 12 / 100);
      var ci = mnRound(owed * creditApr / 12 / 100);
      if (si > 0) { writeSavings(si); record({ kind: 'interest', status: 'approved', acct: 'savings', amount: si, desc: 'Savings interest ' + ym, deltas: { savings: si } }); }
      if (ci > 0) { writeCredit(ci); record({ kind: 'interest', status: 'approved', acct: 'credit', amount: ci, desc: 'Credit interest ' + ym, deltas: { credit: ci } }); }
    }, 1500);
    return function () { clearTimeout(t); };
  }, [sel, bs.lastInterest, ym, !!banks[sel]]);

  // ── kid requests (pending until admin approves) ─────────────────────────────
  function notifyAdmin(title, text) {
    var id = 'n' + Date.now() + Math.random().toString(36).slice(2, 5);
    try { syncSet('notifs/' + id, { id: id, type: 'money_request', personId: sel, title: title, message: text, timestamp: Date.now(), read: false, approved: null, adminNote: '' }); } catch (e) {}
  }
  function request(kind, amount, desc, deltas, extra) {
    amount = mnRound(parseFloat(amount));
    if (!(amount > 0)) { say('Enter an amount greater than 0.'); return false; }
    var status = isAdmin ? 'approved' : 'pending';
    if (!isAdmin) {
      if (deltas.checking && -deltas.checking > checking + 0.0001) { say('Not enough in checking.'); return false; }
      if (deltas.savings && -deltas.savings > savings + 0.0001) { say('Not enough in savings.'); return false; }
      if (kind === 'credit_use' && amount > available + 0.0001) { say('That is over your available credit.'); return false; }
    }
    var t = record(Object.assign({ kind: kind, status: status, amount: amount, desc: desc, deltas: deltas }, extra || {}));
    if (status === 'approved') { applyDeltas(deltas, 1, desc); if (t.billId) markBill(t.billId, t.month, true); say('✅ Done.'); }
    else { notifyAdmin('💰 Money request', (person.name || sel) + ': ' + desc + ' (' + fmt(amount) + ')'); say('📨 Sent to admin for approval.'); }
    return true;
  }
  function approve(tx) {
    var d = tx.deltas || {};
    if (d.checking && -d.checking > checking + 0.0001) { say('Not enough in checking to approve.'); return; }
    applyDeltas(d, 1, tx.desc);
    if (tx.billId) markBill(tx.billId, tx.month, true);
    syncSet('bank/' + sel + '/tx/' + tx.id, Object.assign({}, tx, { status: 'approved', resolvedBy: personId, resolvedAt: Date.now() }));
    say('✅ Approved.');
  }
  function deny(tx) {
    syncSet('bank/' + sel + '/tx/' + tx.id, Object.assign({}, tx, { status: 'denied', resolvedBy: personId, resolvedAt: Date.now() }));
  }
  function removeTx(tx) {
    if (tx.status === 'approved' && tx.deltas) { applyDeltas(tx.deltas, -1, 'Reversed: ' + tx.desc); if (tx.billId) markBill(tx.billId, tx.month, false); }
    syncSet('bank/' + sel + '/tx/' + tx.id, null);
    say('Deleted' + (tx.status === 'approved' ? ' and reversed.' : '.'));
  }

  // ── admin tools ─────────────────────────────────────────────────────────────
  function adminAdjust(acct, newVal) {
    newVal = mnRound(parseFloat(newVal));
    if (isNaN(newVal)) { say('Enter a number.'); return; }
    var cur = acct === 'checking' ? checking : acct === 'savings' ? savings : owed;
    var delta = mnRound(newVal - cur);
    if (!delta) return;
    var d = {}; d[acct] = delta;
    applyDeltas(d, 1, 'Admin adjustment (' + acct + ')');
    record({ kind: 'adjust', status: 'approved', acct: acct, amount: delta, desc: 'Admin set ' + acct + ' to ' + fmt(newVal), deltas: d });
    say('Balance updated.');
  }
  function adminEntry(sign) {
    var amt = mnRound(parseFloat(form.amt));
    if (!(amt > 0)) { say('Enter an amount.'); return; }
    var d = { checking: sign * amt };
    var desc = (form.note || (sign > 0 ? 'Deposit' : 'Withdrawal')).trim();
    applyDeltas(d, 1, desc);
    record({ kind: sign > 0 ? 'deposit' : 'withdrawal', status: 'approved', acct: 'checking', amount: amt, desc: desc, deltas: d });
    setF('amt', ''); setF('note', ''); say('Entry added.');
  }
  function saveSetting(k, v) { var n = parseFloat(v); if (!isNaN(n)) syncSet('bank/' + sel + '/settings/' + k, n); }
  function saveBill(b) {
    var amount = mnRound(parseFloat(b.amount)), dueDay = Math.max(1, Math.min(28, parseInt(b.dueDay, 10) || 1));
    if (!b.name || !(amount > 0)) { say('Bill needs a name and amount.'); return; }
    var id = b.id || mnUid('bill');
    syncSet('bank/' + sel + '/bills/' + id, Object.assign({}, b, { id: id, name: b.name, amount: amount, dueDay: dueDay }));
    setForm({}); say('Bill saved.');
  }

  // ── styles ──────────────────────────────────────────────────────────────────
  var card = { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: 14, marginBottom: 12 };
  var inp = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 10, color: '#fff', padding: '9px 10px', fontSize: 14, width: '100%', boxSizing: 'border-box', marginBottom: 6 };
  var btn = function (bg, fg) { return { background: bg, color: fg || '#000', border: 'none', borderRadius: 20, padding: '8px 14px', fontWeight: 800, fontSize: 12, cursor: 'pointer' }; };
  var ghost = { background: 'transparent', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 20, padding: '6px 12px', fontSize: 11, cursor: 'pointer' };
  var lbl = function (t) { return h('div', { style: { fontSize: 9, fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,.45)', marginBottom: 4 } }, t); };

  function acctCard(icon, title, value, color, sub) {
    return h('div', { style: { flex: 1, minWidth: 140, background: color + '18', border: '1px solid ' + color + '55', borderRadius: 14, padding: '12px 12px' } },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: color } }, icon + ' ' + title),
      h('div', { style: { fontSize: 24, fontWeight: 900, color: '#fff', margin: '2px 0' } }, value),
      sub ? h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.5)' } }, sub) : null);
  }

  var pending = txs.filter(function (t) { return t.status === 'pending'; });
  var allPending = [];
  if (isAdmin) Object.keys(banks).forEach(function (pid) { Object.values((banks[pid] || {}).tx || {}).forEach(function (t) { if (t.status === 'pending') allPending.push(Object.assign({ _pid: pid }, t)); }); });

  var tabs = [['accounts', '🏦 Accounts'], ['bills', '🧾 Bills'], ['credit', '💳 Credit'], ['history', '📜 History'], ['learn', '🎓 Learn']];
  if (isAdmin) tabs.push(['admin', '🛠 Admin']);

  // ───────────────────────────────── render ─────────────────────────────────
  return h('div', { style: { padding: 14, paddingBottom: 90 } },
    h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 2 } }, '💰 My Money'),
    h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', marginBottom: 10 } }, (payMode === 'pay' ? 'Cash mode' : 'Points mode') + ' · every move is approved by an admin'),

    isAdmin && h('div', { style: { display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 10 } },
      family.map(function (p) {
        return h('button', { key: p.id, onClick: function () { setSel(p.id); setForm({}); }, style: { flexShrink: 0, padding: '6px 12px', borderRadius: 20, border: '1px solid ' + (sel === p.id ? p.color : 'rgba(255,255,255,.12)'), background: sel === p.id ? p.color : 'rgba(255,255,255,.06)', color: sel === p.id ? '#fff' : '#aaa', fontSize: 11, fontWeight: 700, cursor: 'pointer' } }, (p.emoji || '') + ' ' + p.name);
      })),

    isAdmin && allPending.length > 0 && h('div', { style: Object.assign({}, card, { border: '2px solid #F6BF26', background: 'rgba(246,191,38,.08)' }) },
      lbl('⏳ WAITING FOR YOUR APPROVAL (' + allPending.length + ')'),
      allPending.map(function (t) {
        var pn = (family.find(function (p) { return p.id === t._pid; }) || {}).name || t._pid;
        return h('div', { key: t.id, style: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,.07)', flexWrap: 'wrap' } },
          h('div', { style: { flex: 1, minWidth: 140, fontSize: 12, color: '#fff' } }, h('b', null, pn), ' — ' + t.desc + ' · ' + fmt(t.amount)),
          h('button', { onClick: function () { setSel(t._pid); setTimeout(function () { approve(t); }, 0); }, style: btn('#4CAF82') }, 'Approve'),
          h('button', { onClick: function () { setSel(t._pid); setTimeout(function () { deny(t); }, 0); }, style: btn('rgba(239,83,80,.2)', '#EF5350') }, 'Deny'));
      })),

    msg && h('div', { style: { background: 'rgba(76,175,130,.15)', color: '#9be5bd', borderRadius: 10, padding: '8px 12px', fontSize: 12, marginBottom: 10 } }, msg),

    h('div', { style: { display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 12 } },
      tabs.map(function (t) {
        return h('button', { key: t[0], onClick: function () { setPanel(t[0]); setForm({}); }, style: { flexShrink: 0, padding: '8px 12px', border: 'none', borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: 'pointer', background: panel === t[0] ? '#C0CA33' : 'rgba(255,255,255,.07)', color: panel === t[0] ? '#000' : 'rgba(255,255,255,.55)' } }, t[1] + (t[0] === 'history' && pending.length ? ' (' + pending.length + ')' : ''));
      })),

    // ── ACCOUNTS ──
    panel === 'accounts' && h('div', null,
      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 } },
        acctCard('🏦', 'Checking', fmt(checking), '#26A69A', wallet.pending ? fmt(wallet.pending) + ' waiting for approval' : 'Spend & pay bills from here'),
        acctCard('🐷', 'Savings', fmt(savings), '#66BB6A', 'Earns ' + savApr + '% a year'),
        acctCard('💳', 'Credit owed', fmt(owed), '#EF5350', fmt(available) + ' available of ' + fmt(creditLimit))),
      h('div', { style: card },
        lbl('MOVE MONEY (needs admin OK)'),
        h('input', { type: 'number', inputMode: 'decimal', placeholder: 'Amount', value: form.amt || '', onChange: function (e) { setF('amt', e.target.value); }, style: inp }),
        h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
          h('button', { onClick: function () { var a = parseFloat(form.amt); if (request('transfer', a, 'Checking → Savings', { checking: -a, savings: a })) setF('amt', ''); }, style: btn('#66BB6A') }, '🐷 To Savings'),
          h('button', { onClick: function () { var a = parseFloat(form.amt); if (request('transfer', a, 'Savings → Checking', { savings: -a, checking: a })) setF('amt', ''); }, style: btn('#26A69A') }, '🏦 To Checking')),
        h('div', { style: { height: 10 } }),
        lbl('SPEND (ask to buy something)'),
        h('input', { type: 'text', placeholder: 'What is it for?', value: form.spendNote || '', onChange: function (e) { setF('spendNote', e.target.value); }, style: inp }),
        h('input', { type: 'number', inputMode: 'decimal', placeholder: 'Cost', value: form.spendAmt || '', onChange: function (e) { setF('spendAmt', e.target.value); }, style: inp }),
        h('button', { onClick: function () { var a = parseFloat(form.spendAmt); if (request('spend', a, 'Spend: ' + (form.spendNote || 'purchase'), { checking: -a })) { setF('spendAmt', ''); setF('spendNote', ''); } }, style: btn('#FFB74D') }, '🛍 Ask to Spend')),
      // savings goal
      h('div', { style: card },
        lbl('🎯 MY SAVINGS GOAL'),
        bank.goal && bank.goal.target > 0
          ? h('div', null,
              h('div', { style: { fontSize: 13, color: '#fff', fontWeight: 800 } }, bank.goal.name + ' — ' + fmt(savings) + ' of ' + fmt(bank.goal.target)),
              h('div', { style: { height: 8, borderRadius: 4, background: 'rgba(255,255,255,.1)', margin: '6px 0', overflow: 'hidden' } }, h('div', { style: { width: Math.min(100, Math.round(savings / bank.goal.target * 100)) + '%', height: '100%', background: '#66BB6A' } })),
              h('button', { onClick: function () { syncSet('bank/' + sel + '/goal', null); }, style: ghost }, 'Change goal'))
          : h('div', null,
              h('input', { type: 'text', placeholder: 'What are you saving for?', value: form.gName || '', onChange: function (e) { setF('gName', e.target.value); }, style: inp }),
              h('input', { type: 'number', inputMode: 'decimal', placeholder: 'Goal amount', value: form.gAmt || '', onChange: function (e) { setF('gAmt', e.target.value); }, style: inp }),
              h('button', { onClick: function () { var a = parseFloat(form.gAmt); if (form.gName && a > 0) { syncSet('bank/' + sel + '/goal', { name: form.gName, target: a }); setForm({}); } }, style: btn('#66BB6A') }, 'Set goal')))),

    // ── BILLS ──
    panel === 'bills' && h('div', null,
      bills.length === 0 && h('div', { style: { color: 'rgba(255,255,255,.4)', fontSize: 12, padding: 20, textAlign: 'center' } }, 'No bills yet.' + (isAdmin ? ' Add one below.' : ' An admin will add your bills.')),
      bills.map(function (b) {
        var paid = !!(b.paid && b.paid[ym]);
        var today = new Date().getDate();
        var reqd = txs.find(function (t) { return t.billId === b.id && t.month === ym && t.status === 'pending'; });
        var status = paid ? '✅ Paid' : reqd ? '⏳ Waiting for approval' : today > b.dueDay ? '⚠️ Overdue' : 'Due on the ' + b.dueDay + 'th';
        return h('div', { key: b.id, style: Object.assign({}, card, { border: '1px solid ' + (paid ? 'rgba(76,175,130,.5)' : (!reqd && today > b.dueDay) ? 'rgba(239,83,80,.6)' : 'rgba(255,255,255,.1)') }) },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            h('div', { style: { flex: 1 } },
              h('div', { style: { fontSize: 14, fontWeight: 800, color: '#fff' } }, b.name),
              h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.55)' } }, fmt(b.amount) + ' · ' + status)),
            !paid && !reqd && h('button', { onClick: function () { request('billpay', b.amount, 'Bill: ' + b.name, { checking: -b.amount }, { billId: b.id, month: ym }); }, style: btn('#4CAF82') }, 'Pay')),
          isAdmin && h('div', { style: { display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' } },
            h('button', { onClick: function () { setForm({ id: b.id, name: b.name, amount: b.amount, dueDay: b.dueDay, editing: true }); }, style: ghost }, '✏️ Edit'),
            h('button', { onClick: function () { markBill(b.id, ym, !paid); }, style: ghost }, paid ? 'Mark unpaid' : 'Mark paid (no charge)'),
            h('button', { onClick: function () { syncSet('bank/' + sel + '/bills/' + b.id, null); }, style: Object.assign({}, ghost, { color: '#EF5350', borderColor: 'rgba(239,83,80,.4)' }) }, 'Delete')));
      }),
      isAdmin && h('div', { style: card },
        lbl(form.editing ? 'EDIT BILL' : 'ADD A BILL FOR ' + (person.name || '').toUpperCase()),
        h('input', { type: 'text', placeholder: 'Bill name (e.g. Phone, Game subscription)', value: form.name || '', onChange: function (e) { setF('name', e.target.value); }, style: inp }),
        h('div', { style: { display: 'flex', gap: 8 } },
          h('input', { type: 'number', inputMode: 'decimal', placeholder: 'Amount', value: form.amount || '', onChange: function (e) { setF('amount', e.target.value); }, style: inp }),
          h('input', { type: 'number', inputMode: 'numeric', placeholder: 'Due day (1-28)', value: form.dueDay || '', onChange: function (e) { setF('dueDay', e.target.value); }, style: inp })),
        h('button', { onClick: function () { saveBill(form); }, style: btn('#C0CA33') }, form.editing ? 'Save changes' : 'Add bill'))),

    // ── CREDIT ──
    panel === 'credit' && h('div', null,
      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 } },
        acctCard('💳', 'You owe', fmt(owed), '#EF5350', creditApr + '% a year if not paid off'),
        acctCard('✅', 'Available', fmt(available), '#42A5F5', 'Limit ' + fmt(creditLimit))),
      h('div', { style: card },
        lbl('USE CREDIT (borrow — needs admin OK)'),
        h('input', { type: 'text', placeholder: 'What is it for?', value: form.cNote || '', onChange: function (e) { setF('cNote', e.target.value); }, style: inp }),
        h('input', { type: 'number', inputMode: 'decimal', placeholder: 'Amount', value: form.cAmt || '', onChange: function (e) { setF('cAmt', e.target.value); }, style: inp }),
        h('button', { onClick: function () { var a = parseFloat(form.cAmt); if (request('credit_use', a, 'Credit: ' + (form.cNote || 'purchase'), { credit: a })) { setF('cAmt', ''); setF('cNote', ''); } }, style: btn('#EF5350', '#fff') }, '💳 Ask to Use Credit'),
        h('div', { style: { height: 10 } }),
        lbl('PAY BACK FROM CHECKING'),
        h('input', { type: 'number', inputMode: 'decimal', placeholder: 'Amount to pay (you owe ' + fmt(owed) + ')', value: form.pAmt || '', onChange: function (e) { setF('pAmt', e.target.value); }, style: inp }),
        h('button', { onClick: function () { var a = Math.min(parseFloat(form.pAmt), owed); if (request('credit_pay', a, 'Credit payment', { checking: -a, credit: -a })) setF('pAmt', ''); }, style: btn('#4CAF82') }, 'Pay credit'))),

    // ── HISTORY ──
    panel === 'history' && h('div', null,
      txs.length === 0 && h('div', { style: { color: 'rgba(255,255,255,.4)', fontSize: 12, padding: 20, textAlign: 'center' } }, 'Nothing yet.'),
      txs.slice(0, 60).map(function (t) {
        var col = t.status === 'pending' ? '#F6BF26' : t.status === 'denied' ? '#EF5350' : '#4CAF82';
        return h('div', { key: t.id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.06)', flexWrap: 'wrap' } },
          h('div', { style: { flex: 1, minWidth: 150 } },
            h('div', { style: { fontSize: 12, color: '#fff', fontWeight: 700 } }, t.desc),
            h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)' } }, new Date(t.ts).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }))),
          h('div', { style: { fontSize: 12, fontWeight: 800, color: col } }, fmt(t.amount)),
          h('div', { style: { fontSize: 9, color: col, fontWeight: 800 } }, t.status),
          isAdmin && t.status === 'pending' && h('button', { onClick: function () { approve(t); }, style: btn('#4CAF82') }, 'Approve'),
          isAdmin && t.status === 'pending' && h('button', { onClick: function () { deny(t); }, style: btn('rgba(239,83,80,.2)', '#EF5350') }, 'Deny'),
          (isAdmin || (t.status === 'pending' && t.by === personId)) && h('button', { onClick: function () { if (isAdmin) removeTx(t); else syncSet('bank/' + sel + '/tx/' + t.id, null); }, style: ghost }, isAdmin ? '🗑 Delete' : 'Cancel'));
      })),

    // ── LEARN ──
    panel === 'learn' && h('div', null,
      MONEY_LESSONS.map(function (l, i) {
        return h('div', { key: i, style: card }, h('div', { style: { fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 } }, l.t), h('div', { style: { fontSize: 12, color: 'rgba(255,255,255,.7)', lineHeight: 1.6 } }, l.b));
      })),

    // ── ADMIN ──
    panel === 'admin' && isAdmin && h('div', null,
      h('div', { style: card },
        lbl('HOW ARE REWARDS PAID?'),
        h('div', { style: { display: 'flex', gap: 8, marginBottom: 8 } },
          [['pay', '💵 Cash ($)'], ['points', '⭐ Points']].map(function (m) {
            return h('button', { key: m[0], onClick: function () { if (props.updateSetting) props.updateSetting('payMode', m[0]); }, style: btn(payMode === m[0] ? '#C0CA33' : 'rgba(255,255,255,.1)', payMode === m[0] ? '#000' : '#aaa') }, m[1]);
          })),
        h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', marginBottom: 6 } }, 'Daily routine/schedule check-offs are worth 5 points each, or the cash value below. They are paid only after an admin approves them in the 🔔 notifications.'),
        h('input', { type: 'number', inputMode: 'decimal', placeholder: 'Cash value of one routine check-off', defaultValue: settings.routineCash != null ? settings.routineCash : 0.25, onBlur: function (e) { if (props.updateSetting && !isNaN(parseFloat(e.target.value))) props.updateSetting('routineCash', parseFloat(e.target.value)); }, style: inp })),
      h('div', { style: card },
        lbl('ADD / REMOVE MONEY FOR ' + (person.name || '').toUpperCase()),
        h('input', { type: 'number', inputMode: 'decimal', placeholder: 'Amount', value: form.amt || '', onChange: function (e) { setF('amt', e.target.value); }, style: inp }),
        h('input', { type: 'text', placeholder: 'Note (e.g. birthday gift, correction)', value: form.note || '', onChange: function (e) { setF('note', e.target.value); }, style: inp }),
        h('div', { style: { display: 'flex', gap: 8 } },
          h('button', { onClick: function () { adminEntry(1); }, style: btn('#4CAF82') }, '＋ Deposit'),
          h('button', { onClick: function () { adminEntry(-1); }, style: btn('#EF5350', '#fff') }, '－ Withdraw'))),
      h('div', { style: card },
        lbl('FIX A BALANCE (set exact amount)'),
        [['checking', 'Checking', checking], ['savings', 'Savings', savings], ['credit', 'Credit owed', owed]].map(function (a) {
          return h('div', { key: a[0], style: { display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 } },
            h('div', { style: { width: 90, fontSize: 11, color: '#ccc' } }, a[1]),
            h('input', { type: 'number', inputMode: 'decimal', placeholder: String(a[2]), value: form['set_' + a[0]] || '', onChange: function (e) { setF('set_' + a[0], e.target.value); }, style: Object.assign({}, inp, { marginBottom: 0 }) }),
            h('button', { onClick: function () { adminAdjust(a[0], form['set_' + a[0]]); setF('set_' + a[0], ''); }, style: btn('#C0CA33') }, 'Set'));
        })),
      h('div', { style: card },
        lbl('ACCOUNT RULES FOR ' + (person.name || '').toUpperCase()),
        [['savApr', 'Savings interest % / year', savApr], ['creditLimit', 'Credit limit', creditLimit], ['creditApr', 'Credit interest % / year', creditApr]].map(function (r) {
          return h('div', { key: r[0], style: { display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 } },
            h('div', { style: { flex: 1, fontSize: 11, color: '#ccc' } }, r[1]),
            h('input', { type: 'number', inputMode: 'decimal', defaultValue: r[2], key: sel + r[0] + r[2], onBlur: function (e) { saveSetting(r[0], e.target.value); }, style: Object.assign({}, inp, { width: 90, marginBottom: 0 }) }));
        }),
        h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 6 } }, 'Interest is added automatically once a month.'))));
}
