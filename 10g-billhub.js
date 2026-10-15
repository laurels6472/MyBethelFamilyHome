// ═══ BILL PAY + BUDGET HUB (admin) — bills, accounts, ledger, self-employed totals ═══
// Honest scope: no automatic bank/biller sync (needs a paid aggregator such as Plaid + a private server).
// Balances and transactions are typed in (or imported from CSV); each bill/account has a one-tap link to the real site.
// Everything is stored in Firebase under household/*, so every parent device sees the same numbers live.
var BH_STREAMS = ['E&L Services', 'Virtual Assistant', 'Consulting', 'Personal / Household'];
var BH_CATS_EXP = ['Housing', 'Utilities', 'Groceries', 'Dining out', 'Transportation', 'Insurance', 'Medical', 'Phone & Internet', 'Software & Subscriptions', 'Supplies', 'Advertising', 'Education', 'Clothing', 'Entertainment', 'Donations', 'Other'];
function bhMoney(n) { n = Number(n) || 0; return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function bhMonthKey(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2); }
function bhUrl(u) { if (!u) return ''; return /^https?:\/\//i.test(u) ? u : 'https://' + u; }
function bhDaysTo(b, now) {
  now = now || new Date(); var ym = bhMonthKey(now);
  var d = new Date(now.getFullYear(), now.getMonth(), Math.min(28, b.dueDay || 1));
  if (b.paid && b.paid[ym]) d = new Date(now.getFullYear(), now.getMonth() + 1, Math.min(28, b.dueDay || 1));
  return Math.ceil((d - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
}
function bhSummary(bills, accts) {
  var ym = bhMonthKey();
  var cash = accts.filter(function (a) { return a.type !== 'credit' && a.type !== 'loan'; }).reduce(function (s, a) { return s + (Number(a.balance) || 0); }, 0);
  var owed = accts.filter(function (a) { return a.type === 'credit' || a.type === 'loan'; }).reduce(function (s, a) { return s + (Number(a.balance) || 0); }, 0);
  var unpaid = bills.filter(function (b) { return !(b.paid && b.paid[ym]); });
  var due = unpaid.reduce(function (s, b) { return s + (Number(b.amount) || 0); }, 0);
  return { cash: cash, owed: owed, unpaid: unpaid, due: due, left: cash - due, overdue: unpaid.filter(function (b) { return bhDaysTo(b) < 0; }).length };
}

function BH_useData() {
  var b = ktUse('household/bills', {}), a = ktUse('household/accounts', {});
  return { bills: Object.values(b[0] || {}), accts: Object.values(a[0] || {}) };
}

// ── Home-page budget card (admin only) ───────────────────────────────────────
function BudgetHomeCard(props) {
  var h = React.createElement, d = BH_useData(), S = bhSummary(d.bills, d.accts);
  if (!props.isAdmin) return null;
  var upcoming = S.unpaid.slice().sort(function (x, y) { return bhDaysTo(x) - bhDaysTo(y); }).slice(0, 6);
  var stat = function (v, l, c) { return h('div', { style: { flex: 1, textAlign: 'center' } }, h('div', { style: { fontSize: 16, fontWeight: 900, color: c } }, v), h('div', { style: { fontSize: 8, color: '#aaa', fontWeight: 800 } }, l)); };
  return h(React.Fragment, null, typeof AlertEngine === 'function' && !props.noEngine && h(AlertEngine, { isAdmin: true }), h('div', { style: { margin: '10px 14px', background: 'rgba(66,165,245,.07)', border: '1px solid rgba(66,165,245,.35)', borderRadius: 14, padding: 12 } },
    h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: 8 } },
      h('div', { style: { flex: 1, fontSize: 11, fontWeight: 800, color: '#90CAF9', letterSpacing: 1 } }, '💵 BUDGET · ' + new Date().toLocaleDateString('en-US', { month: 'long' }).toUpperCase()),
      props.onOpen && h('button', { onClick: props.onOpen, style: { background: '#42A5F5', color: '#000', border: 'none', borderRadius: 20, padding: '4px 10px', fontSize: 10, fontWeight: 800, cursor: 'pointer' } }, 'Open Bill Pay')),
    d.accts.length === 0 && d.bills.length === 0 && h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.5)' } }, 'Add your accounts and bills in Bill Pay to see your budget here.'),
    (d.accts.length > 0 || d.bills.length > 0) && h('div', null,
      h('div', { style: { display: 'flex', marginBottom: 8 } }, stat(bhMoney(S.cash), 'IN BANK', '#4CAF82'), stat(bhMoney(S.due), 'BILLS DUE', '#FFB74D'), stat(bhMoney(S.left), 'LEFT AFTER BILLS', S.left < 0 ? '#EF5350' : '#fff')),
      S.left < 0 && h('div', { style: { background: 'rgba(239,83,80,.18)', color: '#FFAB91', fontSize: 11, borderRadius: 8, padding: '5px 8px', marginBottom: 6 } }, '⚠️ Bills due are more than what is in the bank by ' + bhMoney(-S.left) + '.'),
      upcoming.map(function (b) {
        var dd = bhDaysTo(b), late = dd < 0;
        return h('div', { key: b.id, style: { display: 'flex', gap: 8, padding: '5px 0', borderTop: '1px solid rgba(255,255,255,.07)', fontSize: 12, alignItems: 'center' } },
          h('div', { style: { flex: 1, color: '#fff' } }, b.name, h('span', { style: { color: late ? '#EF5350' : dd <= 3 ? '#FFB74D' : '#999', fontSize: 10 } }, ' · ' + (late ? 'overdue ' + (-dd) + 'd' : dd === 0 ? 'due today' : 'due in ' + dd + 'd') + ' (day ' + b.dueDay + ')')),
          h('div', { style: { fontWeight: 800, color: '#fff' } }, bhMoney(b.amount)),
          b.url && h('button', { onClick: function () { window.open(bhUrl(b.url), '_blank', 'noopener'); }, style: { background: 'rgba(66,165,245,.25)', color: '#90CAF9', border: 'none', borderRadius: 14, padding: '3px 8px', fontSize: 10, fontWeight: 800, cursor: 'pointer' } }, 'Pay'));
      }))));
}

// ── Main hub ─────────────────────────────────────────────────────────────────
function BillHub(props) {
  var h = React.createElement, fam = (props.family || []).filter(function (p) { return !p.deleted; });
  var bS = ktUse('household/bills', {}), bills = Object.values(bS[0] || {});
  var aS = ktUse('household/accounts', {}), accts = Object.values(aS[0] || {});
  var lS = ktUse('household/ledger', {}), ledger = Object.values(lS[0] || {}).sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  var tS = ktUse('household/taxpct', null), taxPct = tS[0];
  var dcS = ktUse('household/docs', {});
  var tabS = React.useState(window._tripAutoStart ? 'mileage' : (function () { var t = window._bhStartTab; window._bhStartTab = null; return t || 'overview'; })()), tab = tabS[0], setTab = tabS[1];
  var fS = React.useState({}), f = fS[0], setF = fS[1];
  var aF = React.useState({ type: 'checking' }), af = aF[0], setAf = aF[1];
  var lF = React.useState({ type: 'expense', stream: BH_STREAMS[3], date: new Date().toISOString().slice(0, 10) }), lf = lF[0], setLf = lF[1];
  var mS = React.useState(''), msg = mS[0], setMsg = mS[1];
  var shS = React.useState(null), assign = shS[0], setAssign = shS[1];
  var now = new Date(), ym = bhMonthKey(now), yr = String(now.getFullYear());
  var say = function (t) { setMsg(t); setTimeout(function () { setMsg(''); }, 3000); };
  var uid = function (p) { return p + Date.now() + Math.random().toString(36).slice(2, 5); };
  var S = bhSummary(bills, accts);
  var sorted = bills.slice().sort(function (a, b) { return bhDaysTo(a) - bhDaysTo(b); });
  var inp = NT_INP, card = NT_CARD;
  var B = function (t, bg, fg, fn) { return h('button', { onClick: fn, style: Object.assign({}, ntBtn(bg, fg), { padding: '6px 11px', fontSize: 11 }) }, t); };
  var up = function (st, set, k) { return function (e) { var o = Object.assign({}, st); o[k] = e.target.value; set(o); }; };
  if (!props.isAdmin) return h('div', { style: { padding: 20, color: '#aaa', fontSize: 12 } }, 'Bill Pay is for parents only.');

  function saveBill() {
    var amt = parseFloat(f.amount), due = parseInt(f.dueDay, 10);
    if (!f.name || !(amt >= 0) || !(due >= 1 && due <= 31)) { say('Needs a name, amount and due day (1–31).'); return; }
    var id = f.id || uid('hb'); syncSet('household/bills/' + id, Object.assign({}, f, { id: id, amount: amt, dueDay: due })); setF({}); say('Saved.');
  }
  function togglePaid(b) {
    var was = b.paid && b.paid[ym]; syncSet('household/bills/' + b.id + '/paid/' + ym, was ? null : Date.now());
    if (!was && b.accountId) { var a = accts.find(function (x) { return x.id === b.accountId; }); if (a) syncSet('household/accounts/' + a.id + '/balance', Math.round(((Number(a.balance) || 0) - (Number(b.amount) || 0)) * 100) / 100); }
    if (!was) { var id = uid('lg'); syncSet('household/ledger/' + id, { id: id, date: new Date().toISOString().slice(0, 10), type: 'expense', amount: Number(b.amount) || 0, category: b.category || 'Utilities', stream: b.stream || BH_STREAMS[3], note: 'Bill: ' + b.name, accountId: b.accountId || null, billId: b.id, month: ym }); }
  }
  function assignTo(b, pid) { var id = uid('bill'); syncSet('bank/' + pid + '/bills/' + id, { id: id, name: b.name, amount: b.amount, dueDay: b.dueDay }); setAssign(null); say('Added to that child’s Bills.'); }
  function saveAcct() {
    var bal = parseFloat(af.balance); if (!af.name || isNaN(bal)) { say('Needs a name and current balance.'); return; }
    var id = af.id || uid('ha'); syncSet('household/accounts/' + id, Object.assign({}, af, { id: id, balance: bal, updated: Date.now() })); setAf({ type: 'checking' }); say('Account saved.');
  }
  function saveLedger() {
    var amt = parseFloat(lf.amount); if (!(amt > 0)) { say('Enter an amount.'); return; }
    var id = uid('lg'); syncSet('household/ledger/' + id, Object.assign({}, lf, { id: id, amount: amt, category: lf.category || (lf.type === 'income' ? 'Income' : 'Other') }));
    if (lf.accountId) { var a = accts.find(function (x) { return x.id === lf.accountId; }); if (a) syncSet('household/accounts/' + a.id + '/balance', Math.round(((Number(a.balance) || 0) + (lf.type === 'income' ? amt : -amt)) * 100) / 100); }
    setLf({ type: lf.type, stream: lf.stream, date: lf.date }); say('Added.');
  }
  function importCsv(file) {
    if (!file) return; var r = new FileReader();
    r.onload = function (ev) {
      var rows = String(ev.target.result).split(/\r?\n/).map(function (l) { return l.split(','); }), n = 0;
      rows.forEach(function (c, i) { if (c.length < 3) return; var amt = parseFloat((c[2] || '').replace(/[^0-9.\-]/g, '')); var dt = new Date(c[0]); if (isNaN(amt) || isNaN(dt)) return; var id = uid('lg') + i; syncSet('household/ledger/' + id, { id: id, date: dt.toISOString().slice(0, 10), type: amt < 0 ? 'expense' : 'income', amount: Math.abs(amt), category: amt < 0 ? 'Other' : 'Income', stream: BH_STREAMS[3], note: (c[1] || '').replace(/"/g, '') }); n++; });
      say('Imported ' + n + ' transactions — set the business ones in Ledger.');
    }; r.readAsText(file);
  }
  function exportCsv() {
    var csv = 'Date,Type,Amount,Category,Stream,Note\n' + ledger.map(function (t) { return [t.date, t.type, t.amount, t.category, t.stream, '"' + (t.note || '').replace(/"/g, '""') + '"'].join(','); }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'ledger-' + yr + '.csv'; a.click();
  }

  // reports
  var inYear = ledger.filter(function (t) { return (t.date || '').slice(0, 4) === yr; });
  var inMonth = ledger.filter(function (t) { return (t.date || '').slice(0, 7) === ym; });
  var sumBy = function (list, type, fn) { var tot = 0; list.forEach(function (t) { if (t.type !== type) return; (typeof bhAlloc === 'function' ? bhAlloc(t) : [{ stream: t.stream, amt: Number(t.amount) || 0 }]).forEach(function (p) { if (!fn || fn(Object.assign({}, t, { stream: p.stream }))) tot += p.amt; }); }); return tot; };
  var biz = function (t) { return t.stream && t.stream !== BH_STREAMS[3]; };
  var bizInc = sumBy(inYear, 'income', biz), bizExp = sumBy(inYear, 'expense', biz), bizNet = bizInc - bizExp;
  var seTax = bizNet > 400 ? bizNet * 0.9235 * 0.153 : 0;
  var setAside = taxPct ? Math.max(0, bizNet) * (Number(taxPct) / 100) : 0;
  var catTotals = {}; inMonth.filter(function (t) { return t.type === 'expense'; }).forEach(function (t) { catTotals[t.category || 'Other'] = (catTotals[t.category || 'Other'] || 0) + (Number(t.amount) || 0); });
  var tabs = [['overview', '📊 Overview'], ['bills', '🧾 Bills'], ['accounts', '🏦 Accounts'], ['ledger', '📒 Ledger'], ['budgets', '🎯 Budgets'], ['mileage', '🚗 Mileage'], ['docs', '📁 Documents'], ['alerts', '🔔 Alerts'], ['reports', '💼 Business'], ['tax', '🧾 Taxes']];
  var P = { h: h, inp: inp, card: card, B: B, up: up, uid: uid, say: say, accts: accts, bills: bills, ledger: ledger, fam: fam, isOwner: props.isOwner, personId: props.personId };

  return h('div', { style: { paddingBottom: 60 } },
    typeof AlertEngine === 'function' && h(AlertEngine, { isAdmin: true }),
    h('div', { style: { padding: '12px 14px 4px' } }, h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff' } }, '🧾 Bill Pay & Budget'), h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', lineHeight: 1.5 } }, 'Admin only · synced live across parent devices · passwords are never stored.')),
    h('div', { style: { display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,.08)' } }, tabs.map(function (t) { return h('button', { key: t[0], onClick: function () { setTab(t[0]); }, style: { flexShrink: 0, padding: '10px 12px', background: 'transparent', border: 'none', borderBottom: '2px solid ' + (tab === t[0] ? '#C0CA33' : 'transparent'), color: tab === t[0] ? '#C0CA33' : 'rgba(255,255,255,.4)', fontWeight: tab === t[0] ? 800 : 500, fontSize: 12, cursor: 'pointer' } }, t[1]); })),
    h('div', { style: { padding: 14 } },
      msg && h('div', { style: { background: 'rgba(76,175,130,.15)', color: '#9be5bd', borderRadius: 8, padding: '6px 10px', fontSize: 12, marginBottom: 8 } }, msg),

      tab === 'overview' && h('div', null,
        h(BudgetHomeCard, { isAdmin: true, noEngine: true }),
        h('div', { style: card }, h('div', { style: { fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 6 } }, 'ACCOUNTS'),
          accts.length === 0 && h('div', { style: { fontSize: 11, color: '#999' } }, 'Add your bank and credit accounts in the Accounts tab.'),
          accts.map(function (a) { return h('div', { key: a.id, style: { display: 'flex', fontSize: 13, color: '#fff', padding: '4px 0' } }, h('div', { style: { flex: 1 } }, a.name), h('div', { style: { fontWeight: 800, color: a.type === 'credit' || a.type === 'loan' ? '#EF9A9A' : '#4CAF82' } }, (a.type === 'credit' || a.type === 'loan' ? 'owe ' : '') + bhMoney(a.balance))); }),
          S.owed > 0 && h('div', { style: { fontSize: 11, color: '#EF9A9A', marginTop: 4 } }, 'Total owed on cards/loans: ' + bhMoney(S.owed))),
        Object.keys(catTotals).length > 0 && h('div', { style: card }, h('div', { style: { fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 6 } }, 'SPENDING THIS MONTH'),
          Object.keys(catTotals).sort(function (a, b) { return catTotals[b] - catTotals[a]; }).map(function (k) { var tot = Object.values(catTotals).reduce(function (a, b) { return a + b; }, 0); return h('div', { key: k, style: { marginBottom: 5 } }, h('div', { style: { display: 'flex', fontSize: 12, color: '#fff' } }, h('div', { style: { flex: 1 } }, k), h('div', null, bhMoney(catTotals[k]))), h('div', { style: { height: 5, borderRadius: 3, background: 'rgba(255,255,255,.1)' } }, h('div', { style: { width: Math.round(catTotals[k] / tot * 100) + '%', height: '100%', background: '#42A5F5', borderRadius: 3 } }))); }))),

      tab === 'bills' && h('div', null,
        sorted.length === 0 && h('div', { style: { color: 'rgba(255,255,255,.4)', fontSize: 12, textAlign: 'center', padding: 12 } }, 'No bills yet — add one below.'),
        sorted.map(function (b) {
          var paid = b.paid && b.paid[ym], d = bhDaysTo(b), late = !paid && d < 0, soon = !paid && d >= 0 && d <= 3, acct = accts.find(function (a) { return a.id === b.accountId; });
          return h('div', { key: b.id, style: Object.assign({}, card, { borderColor: late ? '#EF5350' : soon ? '#FF9800' : 'rgba(255,255,255,.1)' }) },
            h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
              h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 14, fontWeight: 800, color: '#fff' } }, b.name + (b.autopay ? ' 🔁' : '')), h('div', { style: { fontSize: 10, color: late ? '#EF5350' : soon ? '#FFB74D' : '#aaa' } }, paid ? '✅ Paid this month' : (late ? 'OVERDUE ' + (-d) + ' day(s)' : d === 0 ? 'Due TODAY' : 'Due in ' + d + ' day(s)') + ' · day ' + b.dueDay + (acct ? ' · from ' + acct.name : ''))),
              h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff' } }, bhMoney(b.amount))),
            h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } },
              b.url && B('🌐 Open & pay', '#42A5F5', '#000', function () { window.open(bhUrl(b.url), '_blank', 'noopener'); }),
              B(paid ? 'Mark unpaid' : '✔ Mark paid', paid ? 'rgba(255,255,255,.12)' : '#4CAF82', paid ? '#fff' : '#000', function () { togglePaid(b); }),
              B('Assign to child', 'rgba(255,255,255,.12)', '#fff', function () { setAssign(assign === b.id ? null : b.id); }),
              B('Edit', 'rgba(255,255,255,.12)', '#fff', function () { setF(b); }),
              B('Delete', 'rgba(239,83,80,.2)', '#EF5350', function () { if (window._safeConfirm ? window._safeConfirm('Delete ' + b.name + '?') : confirm('Delete?')) syncSet('household/bills/' + b.id, null); })),
            assign === b.id && h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } }, fam.filter(function (p) { return p.role === 'child'; }).map(function (p) { return B(p.emoji + ' ' + p.name, p.color || '#888', '#fff', function () { assignTo(b, p.id); }); })));
        }),
        h('div', { style: card },
          h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', marginBottom: 6 } }, f.id ? 'EDIT BILL' : '➕ ADD A BILL'),
          h('input', { type: 'text', placeholder: 'Bill name (Electric, Rent, Phone…)', value: f.name || '', onChange: up(f, setF, 'name'), style: inp }),
          h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'number', placeholder: 'Amount $', value: f.amount || '', onChange: up(f, setF, 'amount'), style: inp }), h('input', { type: 'number', min: 1, max: 31, placeholder: 'Due day', value: f.dueDay || '', onChange: up(f, setF, 'dueDay'), style: inp })),
          h('input', { type: 'text', placeholder: 'Website to pay (e.g. duke-energy.com)', value: f.url || '', onChange: up(f, setF, 'url'), style: inp }),
          h('select', { value: f.accountId || '', onChange: up(f, setF, 'accountId'), style: inp }, h('option', { value: '' }, 'Paid from which account? (optional)'), accts.filter(function (a) { return a.type !== 'credit'; }).map(function (a) { return h('option', { key: a.id, value: a.id, style: { color: '#000' } }, a.name); })),
          h('select', { value: f.stream || BH_STREAMS[3], onChange: up(f, setF, 'stream'), style: inp }, BH_STREAMS.map(function (s) { return h('option', { key: s, value: s, style: { color: '#000' } }, s === BH_STREAMS[3] ? 'Household bill' : 'Business bill — ' + s); })),
          h('label', { style: { display: 'flex', gap: 8, alignItems: 'center', color: '#ddd', fontSize: 12, margin: '4px 0 8px' } }, h('input', { type: 'checkbox', checked: !!f.autopay, onChange: function (e) { setF(Object.assign({}, f, { autopay: e.target.checked })); }, style: { width: 18, height: 18 } }), 'On autopay 🔁'),
          h('div', { style: { display: 'flex', gap: 8 } }, B(f.id ? 'Save changes' : 'Add bill', '#C0CA33', '#000', saveBill), f.id && B('Cancel', 'rgba(255,255,255,.12)', '#fff', function () { setF({}); })))),

      tab === 'accounts' && h('div', null,
        accts.map(function (a) {
          return h('div', { key: a.id, style: card },
            h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } }, h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 14, fontWeight: 800, color: '#fff' } }, a.name + (a.last4 ? ' ••' + a.last4 : '')), h('div', { style: { fontSize: 10, color: '#aaa' } }, a.type + (a.updated ? ' · balance updated ' + new Date(a.updated).toLocaleDateString() : ''))), h('div', { style: { fontSize: 16, fontWeight: 900, color: a.type === 'credit' || a.type === 'loan' ? '#EF9A9A' : '#4CAF82' } }, bhMoney(a.balance))),
            h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } }, a.url && B('🌐 Open', '#42A5F5', '#000', function () { window.open(bhUrl(a.url), '_blank', 'noopener'); }), B('Update balance', 'rgba(255,255,255,.12)', '#fff', function () { setAf(a); }), B('Delete', 'rgba(239,83,80,.2)', '#EF5350', function () { if (window._safeConfirm ? window._safeConfirm('Delete ' + a.name + '?') : confirm('Delete?')) syncSet('household/accounts/' + a.id, null); })));
        }),
        h('div', { style: card },
          h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', marginBottom: 6 } }, af.id ? 'UPDATE ACCOUNT' : '➕ ADD AN ACCOUNT'),
          h('input', { type: 'text', placeholder: 'Account name (Business checking, Visa…)', value: af.name || '', onChange: up(af, setAf, 'name'), style: inp }),
          h('select', { value: af.type || 'checking', onChange: up(af, setAf, 'type'), style: inp }, ['checking', 'savings', 'cash', 'credit', 'loan'].map(function (t) { return h('option', { key: t, value: t, style: { color: '#000' } }, t); })),
          h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'number', placeholder: 'Balance $', value: af.balance == null ? '' : af.balance, onChange: up(af, setAf, 'balance'), style: inp }), h('input', { type: 'text', inputMode: 'numeric', maxLength: 4, placeholder: 'Last 4', value: af.last4 || '', onChange: up(af, setAf, 'last4'), style: inp })),
          h('input', { type: 'text', placeholder: 'Bank website (to open it)', value: af.url || '', onChange: up(af, setAf, 'url'), style: inp }),
          h('div', { style: { display: 'flex', gap: 8 } }, B(af.id ? 'Save' : 'Add account', '#C0CA33', '#000', saveAcct), af.id && B('Cancel', 'rgba(255,255,255,.12)', '#fff', function () { setAf({ type: 'checking' }); })),
          h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 8, lineHeight: 1.5 } }, 'Balances are typed in (bills marked paid and ledger entries update them automatically). Live bank syncing would need a paid link service — never enter bank passwords here.'))),

      tab === 'ledger' && h('div', null,
        h('div', { style: card },
          h('div', { style: { display: 'flex', gap: 6, marginBottom: 6 } }, ['expense', 'income'].map(function (t) { return h('button', { key: t, onClick: function () { setLf(Object.assign({}, lf, { type: t })); }, style: { flex: 1, padding: 8, borderRadius: 20, border: 'none', fontWeight: 800, background: lf.type === t ? (t === 'income' ? '#4CAF82' : '#EF5350') : 'rgba(255,255,255,.1)', color: lf.type === t ? '#000' : '#ccc', cursor: 'pointer' } }, t === 'income' ? '＋ Money in' : '－ Money out'); })),
          h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'number', placeholder: 'Amount $', value: lf.amount || '', onChange: up(lf, setLf, 'amount'), style: inp }), h('input', { type: 'date', value: lf.date || '', onChange: up(lf, setLf, 'date'), style: inp })),
          h('select', { value: lf.stream, onChange: up(lf, setLf, 'stream'), style: inp }, BH_STREAMS.map(function (s) { return h('option', { key: s, value: s, style: { color: '#000' } }, s); })),
          lf.type === 'expense' && h('select', { value: lf.category || '', onChange: up(lf, setLf, 'category'), style: inp }, h('option', { value: '' }, 'Category'), (typeof BH_CATS_ALL === 'function' ? BH_CATS_ALL() : BH_CATS_EXP).map(function (s) { return h('option', { key: s, value: s, style: { color: '#000' } }, s); })),
          h('select', { value: lf.accountId || '', onChange: up(lf, setLf, 'accountId'), style: inp }, h('option', { value: '' }, 'Account (optional — updates its balance)'), accts.map(function (a) { return h('option', { key: a.id, value: a.id, style: { color: '#000' } }, a.name); })),
          lf.type === 'expense' && lf.category === 'Donations' && h('input', { type: 'text', placeholder: 'Donated to (organization)', value: lf.recipient || '', onChange: up(lf, setLf, 'recipient'), style: inp }),
          h('label', { style: { display: 'flex', gap: 8, alignItems: 'center', color: '#ddd', fontSize: 12, margin: '2px 0 6px' } }, h('input', { type: 'checkbox', checked: !!lf.split, onChange: function (e) { setLf(Object.assign({}, lf, { split: e.target.checked ? { stream: BH_STREAMS[0], pct: 50 } : null })); }, style: { width: 18, height: 18 } }), 'Split this with a business'),
          lf.split && h('div', { style: { display: 'flex', gap: 6 } }, h('select', { value: lf.split.stream, onChange: function (e) { setLf(Object.assign({}, lf, { split: Object.assign({}, lf.split, { stream: e.target.value }) })); }, style: inp }, BH_STREAMS.slice(0, 3).map(function (s) { return h('option', { key: s, value: s, style: { color: '#000' } }, s); })), h('input', { type: 'number', min: 1, max: 100, placeholder: '% to business', value: lf.split.pct, onChange: function (e) { setLf(Object.assign({}, lf, { split: Object.assign({}, lf.split, { pct: e.target.value }) })); }, style: Object.assign({}, inp, { width: 110 }) })),
          lf.split && h('div', { style: { fontSize: 10, color: '#9be5bd', marginBottom: 6 } }, 'The business is charged ' + lf.split.pct + '% of this; the rest stays under "' + lf.stream + '".'),
          lf.type === 'expense' && h('label', { style: { display: 'flex', gap: 8, alignItems: 'center', color: '#ddd', fontSize: 12, margin: '2px 0 6px' } }, h('input', { type: 'checkbox', checked: !!lf.school, onChange: function (e) { setLf(Object.assign({}, lf, { school: e.target.checked })); }, style: { width: 18, height: 18 } }), '🏫 School / homeschool expense'),
          h('input', { type: 'text', placeholder: 'Note (client, store, what for)', value: lf.note || '', onChange: up(lf, setLf, 'note'), style: inp }),
          B('Add to ledger', '#C0CA33', '#000', saveLedger)),
        h('div', { style: { display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' } }, B('⬇ Export CSV', 'rgba(255,255,255,.12)', '#fff', exportCsv), h('label', { style: Object.assign({}, ntBtn('rgba(255,255,255,.12)', '#fff'), { padding: '6px 11px', fontSize: 11 }) }, '⬆ Import bank CSV', h('input', { type: 'file', accept: '.csv', style: { display: 'none' }, onChange: function (e) { importCsv(e.target.files[0]); e.target.value = ''; } }))),
        h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', marginBottom: 6 } }, 'CSV import expects columns: date, description, amount (negative = money out). Download one from your bank’s website.'),
        ledger.slice(0, 80).map(function (t) { return h('div', { key: t.id, style: { display: 'flex', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.06)', alignItems: 'center' } }, h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { style: { fontSize: 12, color: '#fff' } }, t.note || t.category), h('div', { style: { fontSize: 9, color: '#999' } }, t.date + ' · ' + (t.category || '') + ' · ' + (t.stream || '') + (t.split ? ' · ' + t.split.pct + '% → ' + t.split.stream : ''))), h('div', { style: { fontWeight: 800, color: t.type === 'income' ? '#4CAF82' : '#EF9A9A' } }, (t.type === 'income' ? '+' : '-') + bhMoney(t.amount).replace('$', '$')), h('button', { onClick: function () { syncSet('household/ledger/' + t.id, null); }, style: { background: 'transparent', border: 'none', color: 'rgba(239,83,80,.5)', cursor: 'pointer' } }, '×')); })),

      tab === 'budgets' && typeof BH_Budgets === 'function' && h(BH_Budgets, P),
      tab === 'mileage' && typeof BH_Mileage === 'function' && h(BH_Mileage, P),
      tab === 'docs' && typeof BH_Docs === 'function' && h(BH_Docs, P),
      tab === 'alerts' && typeof BH_Alerts === 'function' && h(BH_Alerts, P),
      tab === 'tax' && typeof BH_Tax === 'function' && h(BH_Tax, P),
      tab === 'reports' && h('div', null,
        h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.5)', marginBottom: 8 } }, 'Self-employed view for ' + yr + ' — income and expenses tagged to a business stream in the Ledger.'),
        h('div', { style: Object.assign({}, card, { display: 'flex', textAlign: 'center' }) }, [['Business income', bhMoney(bizInc), '#4CAF82'], ['Expenses', bhMoney(bizExp), '#EF9A9A'], ['Net profit', bhMoney(bizNet), '#fff']].map(function (m) { return h('div', { key: m[0], style: { flex: 1 } }, h('div', { style: { fontSize: 15, fontWeight: 900, color: m[2] } }, m[1]), h('div', { style: { fontSize: 9, color: '#aaa' } }, m[0].toUpperCase())); })),
        BH_STREAMS.slice(0, 3).map(function (s) { var i = sumBy(inYear, 'income', function (t) { return t.stream === s; }), e = sumBy(inYear, 'expense', function (t) { return t.stream === s; }); return h('div', { key: s, style: { display: 'flex', fontSize: 12, color: '#fff', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.06)' } }, h('div', { style: { flex: 1 } }, s), h('div', { style: { color: '#4CAF82', width: 90, textAlign: 'right' } }, bhMoney(i)), h('div', { style: { color: '#EF9A9A', width: 90, textAlign: 'right' } }, bhMoney(e))); }),
        h('div', { style: Object.assign({}, card, { marginTop: 12 }) },
          h('div', { style: { fontSize: 11, fontWeight: 800, color: '#FFB74D', marginBottom: 4 } }, 'SELF-EMPLOYMENT TAX ESTIMATE'),
          h('div', { style: { fontSize: 13, color: '#fff' } }, 'Net profit × 92.35% × 15.3% = ', h('b', null, bhMoney(seTax))),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 } }, h('div', { style: { flex: 1, fontSize: 11, color: '#ccc' } }, 'Percent of profit to set aside for taxes (your choice):'), h('input', { type: 'number', min: 0, max: 60, defaultValue: taxPct == null ? '' : taxPct, onBlur: function (e) { var v = parseFloat(e.target.value); syncSet('household/taxpct', isNaN(v) ? null : v); }, style: Object.assign({}, inp, { width: 70, marginBottom: 0 }) })),
          taxPct > 0 && h('div', { style: { fontSize: 13, color: '#fff', marginTop: 6 } }, 'Set aside so far this year: ', h('b', null, bhMoney(setAside))),
          h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 8, lineHeight: 1.5 } }, 'Estimate only. Does not include income tax, state tax, or deductions. Ask your tax preparer for your real figures.')),
        B('⬇ Export ledger for your accountant', '#42A5F5', '#000', exportCsv))));
}
