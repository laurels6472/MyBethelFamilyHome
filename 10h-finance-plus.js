// ═══ FINANCE PLUS — alerts, budgets, mileage, documents/receipts, taxes, split pay ═══
// Alerts are checked while the app is open on an admin device. Text/call messages are QUEUED in household/outbox;
// they only actually send once a texting service (e.g. Twilio via a Firebase Cloud Function) is connected.
// Calendar (.ics) reminders DO fire on the phone even when the app is closed.
var BH_BIZ_CATS = ['Advertising', 'Contract labor', 'Insurance', 'Legal & professional', 'Office expense', 'Rent', 'Supplies', 'Taxes & licenses', 'Travel', 'Meals', 'Utilities', 'Phone & Internet', 'Software & Subscriptions', 'Education'];
var BH_SCHEDC = { 'Advertising': 'Line 8 Advertising', 'Contract labor': 'Line 11 Contract labor', 'Insurance': 'Line 15 Insurance', 'Legal & professional': 'Line 17 Legal & professional', 'Office expense': 'Line 18 Office expense', 'Software & Subscriptions': 'Line 18 Office expense', 'Rent': 'Line 20 Rent/lease', 'Supplies': 'Line 22 Supplies', 'Taxes & licenses': 'Line 23 Taxes & licenses', 'Travel': 'Line 24a Travel', 'Meals': 'Line 24b Meals (50% deductible)', 'Utilities': 'Line 25 Utilities', 'Phone & Internet': 'Line 25 Utilities', 'Education': 'Line 27a Other expenses', 'Other': 'Line 27a Other expenses' };
var BH_ALERT_TYPES = [
  ['bill_due', '🧾 A bill is coming due', 'days'], ['bill_overdue', '🚨 A bill is overdue', ''], ['balance_below', '🏦 Account balance falls below $', 'threshold+acct'],
  ['credit_over', '💳 Credit owed goes over $', 'threshold+acct'], ['budget_pct', '📊 Category reaches % of its budget', 'pct+cat'], ['invoice_due', '📄 An invoice/document is due', 'days'],
  ['left_below', '⚠️ Left-after-bills falls below $', 'threshold']
];
function bhAlloc(t) {
  var amt = Number(t.amount) || 0, p = t.split && Number(t.split.pct) > 0 ? Math.min(100, Number(t.split.pct)) : 0;
  if (!p) return [{ stream: t.stream, amt: amt }];
  return [{ stream: t.split.stream, amt: amt * p / 100 }, { stream: t.stream, amt: amt * (100 - p) / 100 }];
}
function bhHav(a, b) { var R = 3958.8, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lon - a.lon) * r, x = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) * Math.sin(dLo / 2); return 2 * R * Math.asin(Math.sqrt(x)); }
function bhDownload(name, text, type) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/csv' })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
function bhCsv(rows) { return rows.map(function (r) { return r.map(function (c) { c = c == null ? '' : String(c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\n'); }

// ── alert evaluation ─────────────────────────────────────────────────────────
function bhEvalRule(r, D) {
  var out = [], ym = bhMonthKey(), today = new Date().toISOString().slice(0, 10);
  var acct = function (id) { return D.accts.filter(function (a) { return !id || a.id === id; }); };
  if (r.type === 'bill_due') D.bills.forEach(function (b) { if (b.paid && b.paid[ym]) return; var d = bhDaysTo(b); if (d >= 0 && d <= (Number(r.days) || 3)) out.push({ key: 'b' + b.id + ym, title: '🧾 ' + b.name + ' due ' + (d === 0 ? 'TODAY' : 'in ' + d + ' day(s)'), message: bhMoney(b.amount) + (b.autopay ? ' (autopay)' : ' — tap Bill Pay to pay it.') }); });
  if (r.type === 'bill_overdue') D.bills.forEach(function (b) { if (b.paid && b.paid[ym]) return; var d = bhDaysTo(b); if (d < 0) out.push({ key: 'o' + b.id + ym, title: '🚨 ' + b.name + ' is OVERDUE', message: bhMoney(b.amount) + ' was due ' + (-d) + ' day(s) ago.' }); });
  if (r.type === 'balance_below') acct(r.accountId).filter(function (a) { return a.type !== 'credit' && a.type !== 'loan'; }).forEach(function (a) { if ((Number(a.balance) || 0) < Number(r.threshold)) out.push({ key: 'bal' + a.id, title: '🏦 ' + a.name + ' is low', message: 'Balance ' + bhMoney(a.balance) + ' is under your ' + bhMoney(r.threshold) + ' alert.' }); });
  if (r.type === 'credit_over') acct(r.accountId).filter(function (a) { return a.type === 'credit' || a.type === 'loan'; }).forEach(function (a) { if ((Number(a.balance) || 0) > Number(r.threshold)) out.push({ key: 'cr' + a.id, title: '💳 ' + a.name + ' is over your limit alert', message: 'Owed ' + bhMoney(a.balance) + ' (alert at ' + bhMoney(r.threshold) + ').' }); });
  if (r.type === 'budget_pct') {
    var spent = {}; D.ledger.filter(function (t) { return t.type === 'expense' && (t.date || '').slice(0, 7) === ym; }).forEach(function (t) { spent[t.category || 'Other'] = (spent[t.category || 'Other'] || 0) + (Number(t.amount) || 0); });
    Object.keys(D.budgets).forEach(function (c) { if (r.category && r.category !== c) return; var lim = Number(D.budgets[c].limit); if (!(lim > 0)) return; var pct = (spent[c] || 0) / lim * 100; if (pct >= (Number(r.pct) || 100)) out.push({ key: 'bp' + c + ym + (r.pct || 100), title: '📊 ' + c + ' budget at ' + Math.round(pct) + '%', message: 'Spent ' + bhMoney(spent[c] || 0) + ' of ' + bhMoney(lim) + (pct > 100 ? ' — OVER budget.' : '.') }); });
  }
  if (r.type === 'invoice_due') D.docs.forEach(function (d) { if (d.paid || !d.due) return; var n = Math.ceil((new Date(d.due + 'T12:00:00') - new Date(today + 'T12:00:00')) / 86400000); if (n <= (Number(r.days) || 3)) out.push({ key: 'in' + d.id, title: '📄 ' + (d.vendor || 'Invoice') + (n < 0 ? ' is OVERDUE' : ' due ' + (n === 0 ? 'TODAY' : 'in ' + n + ' day(s)')), message: bhMoney(d.amount) + ' · ' + (d.stream || '') }); });
  if (r.type === 'left_below') { var S = bhSummary(D.bills, D.accts); if (S.left < Number(r.threshold)) out.push({ key: 'left' + ym, title: '⚠️ Money left after bills is low', message: 'Only ' + bhMoney(S.left) + ' left after this month’s bills.' }); }
  return out;
}

// Mounted once for admins (inside BillHub and on the home card). Safe to run on several devices: ids are deterministic.
function AlertEngine(props) {
  var bS = ktUse('household/bills', {}), aS = ktUse('household/accounts', {}), lS = ktUse('household/ledger', {}), dS = ktUse('household/docs', {}), bgS = ktUse('household/budgets', {}), rS = ktUse('household/alerts', {}), cS = ktUse('household/alertcfg', {});
  var ref = React.useRef(null);
  ref.current = { D: { bills: Object.values(bS[0] || {}), accts: Object.values(aS[0] || {}), ledger: Object.values(lS[0] || {}), docs: Object.values(dS[0] || {}), budgets: bgS[0] || {} }, rules: Object.values(rS[0] || {}), cfg: cS[0] || {} };
  React.useEffect(function () {
    if (!props.isAdmin) return;
    function run() {
      var c = ref.current, today = new Date().toISOString().slice(0, 10), hr = new Date().getHours();
      c.rules.forEach(function (r) {
        if (r.enabled === false) return; var ch = r.channels || { inapp: true };
        bhEvalRule(r, c.D).forEach(function (a) {
          var id = 'al_' + r.id + '_' + a.key + '_' + today; if (syncGet('notifs/' + id) || syncGet('household/outbox/' + id)) return;
          var q = c.cfg.quietStart != null && c.cfg.quietEnd != null && c.cfg.quietStart !== '' && c.cfg.quietEnd !== '' ? (Number(c.cfg.quietStart) <= Number(c.cfg.quietEnd) ? (hr >= c.cfg.quietStart && hr < c.cfg.quietEnd) : (hr >= c.cfg.quietStart || hr < c.cfg.quietEnd)) : false;
          if (q) return;
          if (ch.inapp !== false) syncSet('notifs/' + id, { id: id, type: 'finance', personId: 'laurel', title: a.title, message: a.message, timestamp: Date.now(), read: false, approved: null, requiresApproval: false });
          if (ch.push) { try { if (window.Notification && Notification.permission === 'granted') new Notification(a.title, { body: a.message }); } catch (e) {} }
          ['sms', 'call'].forEach(function (k) { if (ch[k]) syncSet('household/outbox/' + id + '_' + k, { id: id + '_' + k, channel: k, to: k === 'call' ? (c.cfg.callPhone || c.cfg.phone || '') : (c.cfg.phone || ''), text: a.title + ' — ' + a.message, ts: Date.now(), status: 'queued' }); });
          if (!syncGet('notifs/' + id)) syncSet('household/outbox/' + id, { id: id, ts: Date.now(), marker: true });
        });
      });
    }
    var t0 = setTimeout(run, 4000), iv = setInterval(run, 120000); return function () { clearTimeout(t0); clearInterval(iv); };
  }, [props.isAdmin]);
  return null;
}

// ── Alerts tab ───────────────────────────────────────────────────────────────
function BH_Alerts(P) {
  var h = React.createElement, inp = P.inp, card = P.card, B = P.B;
  var rS = ktUse('household/alerts', {}), rules = Object.values(rS[0] || {});
  var cS = ktUse('household/alertcfg', {}), cfg = cS[0] || {};
  var pS = React.useState({ type: 'bill_due', days: 3, channels: { inapp: true } }), f = pS[0], setF = pS[1];
  var canEdit = P.isOwner || (cfg.editors || []).indexOf(P.personId) !== -1;
  var cs = function (k, v) { syncSet('household/alertcfg/' + k, v); };
  var meta = BH_ALERT_TYPES.find(function (t) { return t[0] === f.type; }) || BH_ALERT_TYPES[0];
  var chk = function (k, label) { return h('label', { key: k, style: { display: 'flex', gap: 6, alignItems: 'center', color: '#ddd', fontSize: 12 } }, h('input', { type: 'checkbox', checked: !!(f.channels || {})[k], onChange: function (e) { var c = Object.assign({}, f.channels); c[k] = e.target.checked; setF(Object.assign({}, f, { channels: c })); }, style: { width: 18, height: 18 } }), label); };
  function save() { var id = f.id || P.uid('ar'); syncSet('household/alerts/' + id, Object.assign({}, f, { id: id, enabled: f.enabled !== false })); setF({ type: 'bill_due', days: 3, channels: { inapp: true } }); P.say('Alert saved.'); }
  function askPush() { try { Notification.requestPermission().then(function (p) { P.say(p === 'granted' ? 'Phone pop-ups on (while the app is open).' : 'Pop-ups blocked in this browser.'); }); } catch (e) { P.say('This browser cannot show pop-ups.'); } }
  function icsAll() {
    var days = Number(cfg.icsDays) || 3, L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MyBethelHome//Bills//EN'], pad = function (n) { return ('0' + n).slice(-2); }, n = new Date();
    P.bills.forEach(function (b) {
      var d = new Date(n.getFullYear(), n.getMonth(), Math.min(28, b.dueDay || 1)); var ds = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
      L.push('BEGIN:VEVENT', 'UID:bill-' + b.id + '@mybethelhome', 'DTSTAMP:' + ds + 'T120000Z', 'DTSTART;VALUE=DATE:' + ds, 'RRULE:FREQ=MONTHLY', 'SUMMARY:💵 ' + String(b.name).replace(/[,;\n]/g, ' ') + ' due ' + bhMoney(b.amount), 'DESCRIPTION:' + (b.url ? bhUrl(b.url) : 'Bill due'),
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Bill due', 'TRIGGER:-P' + days + 'D', 'END:VALARM', 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Bill due today', 'TRIGGER:PT9H', 'END:VALARM', 'END:VEVENT');
    });
    L.push('END:VCALENDAR'); bhDownload('bill-reminders.ics', L.join('\r\n'), 'text/calendar');
  }
  var typeLabel = function (t) { return (BH_ALERT_TYPES.find(function (x) { return x[0] === t; }) || [t, t])[1]; };
  var ob = Object.values(ktUse('household/outbox', {})[0] || {}).filter(function (o) { return o.status === 'queued'; }).length;
  return h('div', null,
    h('div', { style: Object.assign({}, card, { borderColor: 'rgba(255,152,0,.5)' }) },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#FFB74D', marginBottom: 4 } }, 'HOW EACH KIND OF REMINDER WORKS'),
      h('div', { style: { fontSize: 11, color: '#ddd', lineHeight: 1.6 } },
        '🔔 In-app: works now on every device. 📱 Pop-up: works while the app is open. 📅 Calendar: the button below puts every bill in your phone calendar with real alarms — those ring even when the app is closed. 💬 Text / ☎️ Call: the app queues the message (' + ob + ' waiting) but cannot send it alone — a texting service must be connected (see my note in chat).')),
    h('div', { style: card },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 6 } }, 'WHERE TO REACH ME'),
      h('input', { type: 'tel', placeholder: 'Mobile number for texts', defaultValue: cfg.phone || '', disabled: !canEdit, onBlur: function (e) { cs('phone', e.target.value); }, style: inp }),
      h('input', { type: 'tel', placeholder: 'Number for phone calls (optional)', defaultValue: cfg.callPhone || '', disabled: !canEdit, onBlur: function (e) { cs('callPhone', e.target.value); }, style: inp }),
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 } }, h('div', { style: { fontSize: 11, color: '#ccc', flex: 1 } }, 'Quiet hours (24h clock) — no alerts from / until:'), h('input', { type: 'number', min: 0, max: 23, placeholder: '22', defaultValue: cfg.quietStart == null ? '' : cfg.quietStart, disabled: !canEdit, onBlur: function (e) { cs('quietStart', e.target.value === '' ? null : Number(e.target.value)); }, style: Object.assign({}, inp, { width: 60, marginBottom: 0 }) }), h('input', { type: 'number', min: 0, max: 23, placeholder: '7', defaultValue: cfg.quietEnd == null ? '' : cfg.quietEnd, disabled: !canEdit, onBlur: function (e) { cs('quietEnd', e.target.value === '' ? null : Number(e.target.value)); }, style: Object.assign({}, inp, { width: 60, marginBottom: 0 }) })),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, B('📱 Allow phone pop-ups', '#42A5F5', '#000', askPush), B('📅 Download bill calendar (.ics)', '#C0CA33', '#000', icsAll)),
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', marginTop: 8 } }, h('div', { style: { fontSize: 11, color: '#ccc', flex: 1 } }, 'Calendar alarm: days before due'), h('input', { type: 'number', min: 0, max: 30, defaultValue: cfg.icsDays || 3, onBlur: function (e) { cs('icsDays', Number(e.target.value) || 3); }, style: Object.assign({}, inp, { width: 70, marginBottom: 0 }) }))),
    P.isOwner && h('div', { style: card },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 6 } }, '🔐 WHO MAY EDIT ALERTS & BILL SETTINGS'),
      h('div', { style: { fontSize: 10, color: '#aaa', marginBottom: 6 } }, 'You (the owner) always can. Tick anyone else you give permission to.'),
      P.fam.filter(function (p) { return p.role === 'parent' && p.id !== 'laurel'; }).map(function (p) { var on = (cfg.editors || []).indexOf(p.id) !== -1; return h('label', { key: p.id, style: { display: 'flex', gap: 8, alignItems: 'center', color: '#ddd', fontSize: 12, marginBottom: 4 } }, h('input', { type: 'checkbox', checked: on, onChange: function (e) { var ed = (cfg.editors || []).filter(function (x) { return x !== p.id; }); if (e.target.checked) ed.push(p.id); cs('editors', ed); }, style: { width: 18, height: 18 } }), p.name); })),
    !canEdit && h('div', { style: { color: '#FFAB91', fontSize: 12, padding: 10 } }, 'The owner has not given you permission to edit alerts.'),
    canEdit && h('div', null,
      rules.map(function (r) { var ch = r.channels || {}; return h('div', { key: r.id, style: Object.assign({}, card, { opacity: r.enabled === false ? 0.5 : 1 }) },
        h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, r.name || typeLabel(r.type)), h('div', { style: { fontSize: 10, color: '#aaa' } }, typeLabel(r.type) + (r.days != null && r.days !== '' && (r.type === 'bill_due' || r.type === 'invoice_due') ? ' · ' + r.days + ' day(s) before' : '') + (r.threshold ? ' · $' + r.threshold : '') + (r.pct ? ' · ' + r.pct + '%' : '') + (r.category ? ' · ' + r.category : '') + ' · ' + ['inapp', 'push', 'sms', 'call'].filter(function (k) { return ch[k]; }).join(', ')),
        h('div', { style: { display: 'flex', gap: 6, marginTop: 6 } }, B(r.enabled === false ? 'Turn on' : 'Pause', 'rgba(255,255,255,.12)', '#fff', function () { syncSet('household/alerts/' + r.id + '/enabled', r.enabled === false); }), B('Edit', 'rgba(255,255,255,.12)', '#fff', function () { setF(r); }), B('Delete', 'rgba(239,83,80,.2)', '#EF5350', function () { syncSet('household/alerts/' + r.id, null); }))); }),
      h('div', { style: card },
        h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', marginBottom: 6 } }, f.id ? 'EDIT ALERT' : '➕ NEW ALERT'),
        h('select', { value: f.type, onChange: function (e) { setF(Object.assign({}, f, { type: e.target.value })); }, style: inp }, BH_ALERT_TYPES.map(function (t) { return h('option', { key: t[0], value: t[0], style: { color: '#000' } }, t[1]); })),
        h('input', { type: 'text', placeholder: 'Name (optional)', value: f.name || '', onChange: function (e) { setF(Object.assign({}, f, { name: e.target.value })); }, style: inp }),
        meta[2].indexOf('days') !== -1 && h('input', { type: 'number', min: 0, placeholder: 'How many days before?', value: f.days == null ? '' : f.days, onChange: function (e) { setF(Object.assign({}, f, { days: e.target.value })); }, style: inp }),
        meta[2].indexOf('threshold') !== -1 && h('input', { type: 'number', placeholder: 'Dollar amount', value: f.threshold || '', onChange: function (e) { setF(Object.assign({}, f, { threshold: e.target.value })); }, style: inp }),
        meta[2].indexOf('acct') !== -1 && h('select', { value: f.accountId || '', onChange: function (e) { setF(Object.assign({}, f, { accountId: e.target.value })); }, style: inp }, h('option', { value: '' }, 'Any account'), P.accts.map(function (a) { return h('option', { key: a.id, value: a.id, style: { color: '#000' } }, a.name); })),
        meta[2].indexOf('pct') !== -1 && h('div', null, h('input', { type: 'number', min: 1, placeholder: 'Percent of budget (80, 100…)', value: f.pct || '', onChange: function (e) { setF(Object.assign({}, f, { pct: e.target.value })); }, style: inp }), h('select', { value: f.category || '', onChange: function (e) { setF(Object.assign({}, f, { category: e.target.value })); }, style: inp }, h('option', { value: '' }, 'Any budgeted category'), BH_CATS_ALL().map(function (c) { return h('option', { key: c, value: c, style: { color: '#000' } }, c); }))),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, margin: '6px 0 10px' } }, chk('inapp', '🔔 In-app'), chk('push', '📱 Pop-up'), chk('sms', '💬 Text'), chk('call', '☎️ Call')),
        h('div', { style: { display: 'flex', gap: 8 } }, B(f.id ? 'Save alert' : 'Add alert', '#C0CA33', '#000', save), f.id && B('Cancel', 'rgba(255,255,255,.12)', '#fff', function () { setF({ type: 'bill_due', days: 3, channels: { inapp: true } }); })))));
}
function BH_CATS_ALL() { var s = {}; BH_CATS_EXP.concat(BH_BIZ_CATS).forEach(function (c) { s[c] = 1; }); return Object.keys(s); }

// ── Budgets tab (monthly category limits + groceries planned-vs-spent) ───────
function BH_Budgets(P) {
  var h = React.createElement, inp = P.inp, card = P.card;
  var bS = ktUse('household/budgets', {}), bud = bS[0] || {}, ym = bhMonthKey();
  var spent = {}; P.ledger.filter(function (t) { return t.type === 'expense' && (t.date || '').slice(0, 7) === ym; }).forEach(function (t) { spent[t.category || 'Other'] = (spent[t.category || 'Other'] || 0) + (Number(t.amount) || 0); });
  var nS = React.useState(''), nc = nS[0], setNc = nS[1];
  var cats = Object.keys(bud);
  var income = P.ledger.filter(function (t) { return t.type === 'income' && (t.date || '').slice(0, 7) === ym; }).reduce(function (s, t) { return s + (Number(t.amount) || 0); }, 0);
  var allSpent = Object.values(spent).reduce(function (a, b) { return a + b; }, 0), totalLimit = cats.reduce(function (s, c) { return s + (Number(bud[c].limit) || 0); }, 0);
  return h('div', null,
    h('div', { style: Object.assign({}, card, { display: 'flex', textAlign: 'center' }) }, [['Money in', bhMoney(income), '#4CAF82'], ['Spent', bhMoney(allSpent), '#EF9A9A'], ['Budgeted', bhMoney(totalLimit), '#90CAF9']].map(function (m) { return h('div', { key: m[0], style: { flex: 1 } }, h('div', { style: { fontSize: 15, fontWeight: 900, color: m[2] } }, m[1]), h('div', { style: { fontSize: 9, color: '#aaa' } }, m[0].toUpperCase() + ' THIS MONTH')); })),
    cats.length === 0 && h('div', { style: { color: '#999', fontSize: 12, padding: 8 } }, 'Add a category below (try Groceries) and set its monthly limit.'),
    cats.map(function (c) {
      var lim = Number(bud[c].limit) || 0, pl = Number(bud[c].planned) || 0, sp = spent[c] || 0, pct = lim > 0 ? Math.round(sp / lim * 100) : 0, left = lim - sp - pl;
      return h('div', { key: c, style: card },
        h('div', { style: { display: 'flex', alignItems: 'center' } }, h('div', { style: { flex: 1, fontSize: 14, fontWeight: 800, color: '#fff' } }, (c === 'Groceries' ? '🛒 ' : '') + c), h('button', { onClick: function () { syncSet('household/budgets/' + c, null); }, style: { background: 'transparent', border: 'none', color: 'rgba(239,83,80,.5)', cursor: 'pointer' } }, '×')),
        h('div', { style: { height: 8, borderRadius: 4, background: 'rgba(255,255,255,.1)', margin: '6px 0', overflow: 'hidden', display: 'flex' } }, h('div', { style: { width: Math.min(100, pct) + '%', background: pct >= 100 ? '#EF5350' : pct >= 80 ? '#FF9800' : '#4CAF82' } }), lim > 0 && pl > 0 && h('div', { style: { width: Math.min(100 - Math.min(100, pct), Math.round(pl / lim * 100)) + '%', background: 'rgba(66,165,245,.7)' } })),
        h('div', { style: { fontSize: 11, color: '#ddd' } }, 'Spent ' + bhMoney(sp) + ' of ' + bhMoney(lim) + ' (' + pct + '%)' + (pl > 0 ? ' · about to spend ' + bhMoney(pl) : '')),
        h('div', { style: { fontSize: 12, fontWeight: 800, color: left < 0 ? '#EF5350' : '#4CAF82', margin: '2px 0 6px' } }, left < 0 ? 'Over by ' + bhMoney(-left) : bhMoney(left) + ' left' + (pl > 0 ? ' after the planned spending' : '')),
        h('div', { style: { display: 'flex', gap: 6 } },
          h('input', { type: 'number', placeholder: 'Monthly limit $', key: c + 'l' + lim, defaultValue: lim || '', onBlur: function (e) { syncSet('household/budgets/' + c + '/limit', parseFloat(e.target.value) || 0); }, style: inp }),
          h('input', { type: 'number', placeholder: c === 'Groceries' ? 'About to buy $ (shopping list)' : 'Planned $', key: c + 'p' + pl, defaultValue: pl || '', onBlur: function (e) { syncSet('household/budgets/' + c + '/planned', parseFloat(e.target.value) || 0); }, style: inp })));
    }),
    h('div', { style: card }, h('select', { value: nc, onChange: function (e) { setNc(e.target.value); }, style: inp }, h('option', { value: '' }, 'Add a budget category…'), BH_CATS_ALL().filter(function (c) { return !bud[c]; }).map(function (c) { return h('option', { key: c, value: c, style: { color: '#000' } }, c); })), P.B('Add category', '#C0CA33', '#000', function () { if (nc) { syncSet('household/budgets/' + nc, { limit: 0, planned: 0 }); setNc(''); } })));
}

// ── Mileage tab ──────────────────────────────────────────────────────────────
function BH_Mileage(P) {
  var h = React.createElement, inp = P.inp, card = P.card, B = P.B, up = P.up;
  var mS = ktUse('household/miles', {}), trips = Object.values(mS[0] || {}).sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  var rS = ktUse('household/mileRate', 0.725), rate = Number(rS[0]) || 0.725;
  var fS = React.useState({ date: new Date().toISOString().slice(0, 10), stream: BH_STREAMS[0] }), f = fS[0], setF = fS[1];
  var gS = React.useState(null), gps = gS[0], setGps = gS[1];
  var wid = React.useRef(null);
  var yr = String(new Date().getFullYear()), yTrips = trips.filter(function (t) { return (t.date || '').slice(0, 4) === yr; });
  var miles = yTrips.reduce(function (s, t) { return s + (Number(t.miles) || 0); }, 0);
  function startGps() {
    if (!navigator.geolocation) { P.say('GPS not available here.'); return; }
    var st = { miles: 0, last: null, start: Date.now() }; setGps(st);
    wid.current = navigator.geolocation.watchPosition(function (p) { var pt = { lat: p.coords.latitude, lon: p.coords.longitude }; if (st.last) { var d = bhHav(st.last, pt); if (d > 0.01) { st.miles += d; st.last = pt; } } else st.last = pt; setGps(Object.assign({}, st)); }, function () { P.say('Could not read location — allow location access.'); }, { enableHighAccuracy: true });
  }
  function stopGps() { if (wid.current != null) navigator.geolocation.clearWatch(wid.current); wid.current = null; if (gps) setF(Object.assign({}, f, { miles: String(Math.round(gps.miles * 10) / 10) })); setGps(null); }
  React.useEffect(function () { if (window._tripAutoStart) { window._tripAutoStart = false; setTimeout(startGps, 400); } return function () { if (wid.current != null) navigator.geolocation.clearWatch(wid.current); }; }, []);
  function save() {
    var od = parseFloat(f.odoEnd) - parseFloat(f.odoStart), m = parseFloat(f.miles); if (!(m > 0) && od > 0) m = od;
    if (!(m > 0)) { P.say('Enter miles (or start/end odometer).'); return; }
    var id = P.uid('mi'); syncSet('household/miles/' + id, Object.assign({}, f, { id: id, miles: Math.round(m * 10) / 10 })); setF({ date: f.date, stream: f.stream }); P.say('Trip saved.');
  }
  return h('div', null,
    h('div', { style: Object.assign({}, card, { display: 'flex', textAlign: 'center' }) }, [[miles.toFixed(1), 'MILES ' + yr, '#fff'], [bhMoney(miles * rate), 'DEDUCTION @ ' + (rate * 100).toFixed(1) + '¢', '#4CAF82']].map(function (m) { return h('div', { key: m[1], style: { flex: 1 } }, h('div', { style: { fontSize: 18, fontWeight: 900, color: m[2] } }, m[0]), h('div', { style: { fontSize: 9, color: '#aaa' } }, m[1])); })),
    h('div', { style: Object.assign({}, card, { borderColor: 'rgba(66,165,245,.5)' }) },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#90CAF9', marginBottom: 4 } }, '📍 REMIND ME WHEN I LEAVE'),
      h('div', { style: { fontSize: 11, color: '#ddd', lineHeight: 1.6 } }, 'A web app can\u2019t watch your location in the background, but your phone can. Make your phone do the watching:'),
      h('div', { style: { fontSize: 11, color: '#ddd', lineHeight: 1.6, marginTop: 6 } }, h('b', null, 'iPhone: '), 'Shortcuts → Automation → New → \u201cLeave\u201d → pick Home/Office → add action \u201cOpen URL\u201d with the link below (or \u201cShow Notification\u201d). Or simply Reminders → \u201cRemind me at a location → When Leaving.\u201d'),
      h('div', { style: { fontSize: 11, color: '#ddd', lineHeight: 1.6, marginTop: 6 } }, h('b', null, 'Android: '), 'Samsung Routines, or the free apps Tasker / MacroDroid: trigger \u201cLeave location\u201d → action \u201cOpen URL\u201d (link below) or \u201cNotification.\u201d'),
      h('div', { style: { background: 'rgba(0,0,0,.3)', borderRadius: 8, padding: 8, margin: '8px 0', fontSize: 11, color: '#C0CA33', wordBreak: 'break-all', userSelect: 'all' } }, location.href.split('#')[0] + '#trip=start'),
      B('📋 Copy link', '#42A5F5', '#000', function () { try { navigator.clipboard.writeText(location.href.split('#')[0] + '#trip=start'); P.say('Link copied.'); } catch (e) { P.say('Press and hold the link to copy.'); } }),
      h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 8, lineHeight: 1.5 } }, 'Opening the link starts the GPS trip (allow Location when asked, choose \u201cWhile using\u201d). Tracking only runs while this screen stays open and awake; iPhone may ask you to tap the notification first. Open the app once and log in before relying on it.')),
    h('div', { style: card },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', marginBottom: 6 } }, '🚗 LOG A BUSINESS TRIP'),
      gps ? h('div', { style: { background: 'rgba(76,175,130,.15)', borderRadius: 10, padding: 10, marginBottom: 8, textAlign: 'center' } }, h('div', { style: { fontSize: 22, fontWeight: 900, color: '#4CAF82' } }, gps.miles.toFixed(1) + ' mi'), h('div', { style: { fontSize: 10, color: '#aaa', marginBottom: 6 } }, 'GPS tracking — keep this screen open'), B('⏹ End trip', '#EF5350', '#fff', stopGps)) : B('▶ Start GPS trip', '#42A5F5', '#000', startGps),
      h('div', { style: { height: 8 } }),
      h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'date', value: f.date, onChange: up(f, setF, 'date'), style: inp }), h('input', { type: 'number', placeholder: 'Miles', value: f.miles || '', onChange: up(f, setF, 'miles'), style: inp })),
      h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'number', placeholder: 'Odometer start', value: f.odoStart || '', onChange: up(f, setF, 'odoStart'), style: inp }), h('input', { type: 'number', placeholder: 'Odometer end', value: f.odoEnd || '', onChange: up(f, setF, 'odoEnd'), style: inp })),
      h('input', { type: 'text', placeholder: 'From → To (e.g. Home → client site)', value: f.route || '', onChange: up(f, setF, 'route'), style: inp }),
      h('input', { type: 'text', placeholder: 'Business purpose (required by the IRS)', value: f.purpose || '', onChange: up(f, setF, 'purpose'), style: inp }),
      h('select', { value: f.stream, onChange: up(f, setF, 'stream'), style: inp }, BH_STREAMS.slice(0, 3).map(function (s) { return h('option', { key: s, value: s, style: { color: '#000' } }, s); })),
      B('Save trip', '#C0CA33', '#000', save)),
    h('div', { style: card }, h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } }, h('div', { style: { flex: 1, fontSize: 11, color: '#ccc' } }, 'Rate per mile $ (IRS 2026 business rate is 0.725 — change if yours differs)'), h('input', { type: 'number', step: '0.001', defaultValue: rate, onBlur: function (e) { syncSet('household/mileRate', parseFloat(e.target.value) || 0.725); }, style: Object.assign({}, inp, { width: 90, marginBottom: 0 }) })), h('div', { style: { marginTop: 8 } }, B('⬇ Export mileage log', 'rgba(255,255,255,.12)', '#fff', function () { bhDownload('mileage-' + yr + '.csv', bhCsv([['Date', 'Miles', 'From/To', 'Purpose', 'Business', 'Odometer start', 'Odometer end', 'Deduction']].concat(yTrips.map(function (t) { return [t.date, t.miles, t.route, t.purpose, t.stream, t.odoStart, t.odoEnd, (t.miles * rate).toFixed(2)]; })))); }))),
    trips.slice(0, 60).map(function (t) { return h('div', { key: t.id, style: { display: 'flex', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.06)', alignItems: 'center' } }, h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 12, color: '#fff' } }, (t.route || 'Trip') + ' — ' + (t.purpose || '')), h('div', { style: { fontSize: 9, color: '#999' } }, t.date + ' · ' + t.stream)), h('div', { style: { fontWeight: 800, color: '#fff' } }, t.miles + ' mi'), h('button', { onClick: function () { syncSet('household/miles/' + t.id, null); }, style: { background: 'transparent', border: 'none', color: 'rgba(239,83,80,.5)', cursor: 'pointer' } }, '×')); }));
}

// ── Documents tab (receipts, invoices, statements) ───────────────────────────
function BH_DocView(props) {
  var d = ktUse('household/docfiles/' + props.id, null)[0]; var h = React.createElement;
  if (!d) return h('div', { style: { fontSize: 10, color: '#999' } }, 'Loading…');
  return d.indexOf('data:image') === 0 ? h('img', { src: d, style: { width: '100%', borderRadius: 10, marginTop: 6 } }) : h('a', { href: d, download: 'document', style: { color: '#90CAF9', fontSize: 12 } }, 'Download file');
}
function BH_Docs(P) {
  var h = React.createElement, inp = P.inp, card = P.card, B = P.B, up = P.up;
  var dS = ktUse('household/docs', {}), docs = Object.values(dS[0] || {}).sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  var fS = React.useState({ kind: 'receipt', date: new Date().toISOString().slice(0, 10), stream: BH_STREAMS[3] }), f = fS[0], setF = fS[1];
  var pS = React.useState(null), photo = pS[0], setPhoto = pS[1];
  var vS = React.useState(null), view = vS[0], setView = vS[1];
  var fl = React.useState('all'), flt = fl[0], setFlt = fl[1];
  var kinds = [['receipt', '🧾 Receipt'], ['invoice', '📄 Invoice (due)'], ['bill', '🏠 Bill / statement'], ['tax', '🗂 Tax document'], ['contract', '✍️ Contract / other']];
  function onFile(file) {
    if (!file) return;
    if (file.type.indexOf('image') === 0) ntResizeImage(file, 1400, function (d) { setPhoto(d); });
    else { if (file.size > 900000) { P.say('PDF is over 900 KB — too big to store here. Photograph it instead.'); return; } var r = new FileReader(); r.onload = function (e) { setPhoto(e.target.result); }; r.readAsDataURL(file); }
  }
  function save() {
    var amt = parseFloat(f.amount); if (!photo && !f.vendor) { P.say('Add a photo or a vendor name.'); return; }
    var id = P.uid('dc'); if (photo) syncSet('household/docfiles/' + id, photo);
    syncSet('household/docs/' + id, Object.assign({}, f, { id: id, amount: isNaN(amt) ? 0 : amt, hasFile: !!photo, paid: f.kind === 'receipt' }));
    if (f.kind === 'receipt' && f.addLedger && amt > 0) { var lid = P.uid('lg'); syncSet('household/ledger/' + lid, { id: lid, date: f.date, type: 'expense', amount: amt, category: f.category || 'Other', stream: f.stream, school: !!f.school, note: 'Receipt: ' + (f.vendor || ''), docId: id }); }
    setPhoto(null); setF({ kind: f.kind, date: f.date, stream: f.stream }); P.say('Saved to documents.');
  }
  function toLedger(d) { var lid = P.uid('lg'); syncSet('household/ledger/' + lid, { id: lid, date: new Date().toISOString().slice(0, 10), type: 'expense', amount: d.amount, category: d.category || 'Other', stream: d.stream, school: !!d.school, note: (d.kind === 'invoice' ? 'Invoice paid: ' : 'Receipt: ') + (d.vendor || ''), docId: d.id }); syncSet('household/docs/' + d.id + '/paid', true); P.say('Added to ledger.'); }
  var shown = docs.filter(function (d) { return flt === 'all' || d.kind === flt || (flt === 'due' && !d.paid && d.due); });
  var dueTotal = docs.filter(function (d) { return !d.paid && d.kind === 'invoice'; }).reduce(function (s, d) { return s + (Number(d.amount) || 0); }, 0);
  return h('div', null,
    dueTotal > 0 && h('div', { style: Object.assign({}, card, { borderColor: '#FF9800' }) }, h('div', { style: { fontSize: 13, color: '#FFB74D', fontWeight: 800 } }, 'Invoices waiting to be paid: ' + bhMoney(dueTotal))),
    h('div', { style: card },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', marginBottom: 6 } }, '📷 SCAN OR UPLOAD A DOCUMENT'),
      h('div', { style: { display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' } },
        h('label', { style: Object.assign({}, ntBtn('#42A5F5'), { padding: '8px 12px' }) }, '📷 Take photo', h('input', { type: 'file', accept: 'image/*', capture: 'environment', style: { display: 'none' }, onChange: function (e) { onFile(e.target.files[0]); e.target.value = ''; } })),
        h('label', { style: Object.assign({}, ntBtn('rgba(255,255,255,.15)', '#fff'), { padding: '8px 12px' }) }, '🖼 Photos / files', h('input', { type: 'file', accept: 'image/*,application/pdf', style: { display: 'none' }, onChange: function (e) { onFile(e.target.files[0]); e.target.value = ''; } }))),
      photo && photo.indexOf('data:image') === 0 && h('img', { src: photo, style: { width: 90, borderRadius: 8, marginBottom: 8 } }), photo && photo.indexOf('data:image') !== 0 && h('div', { style: { fontSize: 11, color: '#9be5bd', marginBottom: 6 } }, '📎 PDF attached'),
      h('select', { value: f.kind, onChange: up(f, setF, 'kind'), style: inp }, kinds.map(function (k) { return h('option', { key: k[0], value: k[0], style: { color: '#000' } }, k[1]); })),
      h('input', { type: 'text', placeholder: 'Vendor / who it is from', value: f.vendor || '', onChange: up(f, setF, 'vendor'), style: inp }),
      h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'number', placeholder: 'Amount $', value: f.amount || '', onChange: up(f, setF, 'amount'), style: inp }), h('input', { type: 'date', value: f.date, onChange: up(f, setF, 'date'), style: inp })),
      f.kind === 'invoice' && h('div', null, h('div', { style: { fontSize: 10, color: '#aaa' } }, 'Due date (alerts use this):'), h('input', { type: 'date', value: f.due || '', onChange: up(f, setF, 'due'), style: inp })),
      h('select', { value: f.stream, onChange: up(f, setF, 'stream'), style: inp }, BH_STREAMS.map(function (s) { return h('option', { key: s, value: s, style: { color: '#000' } }, s); })),
      h('select', { value: f.category || '', onChange: up(f, setF, 'category'), style: inp }, h('option', { value: '' }, 'Category'), BH_CATS_ALL().map(function (c) { return h('option', { key: c, value: c, style: { color: '#000' } }, c); })),
      h('label', { style: { display: 'flex', gap: 8, alignItems: 'center', color: '#ddd', fontSize: 12, marginBottom: 8 } }, h('input', { type: 'checkbox', checked: !!f.school, onChange: function (e) { setF(Object.assign({}, f, { school: e.target.checked })); }, style: { width: 18, height: 18 } }), '🏫 School / homeschool purchase'),
      f.kind === 'receipt' && h('label', { style: { display: 'flex', gap: 8, alignItems: 'center', color: '#ddd', fontSize: 12, marginBottom: 8 } }, h('input', { type: 'checkbox', checked: !!f.addLedger, onChange: function (e) { setF(Object.assign({}, f, { addLedger: e.target.checked })); }, style: { width: 18, height: 18 } }), 'Also add it to my ledger as an expense'),
      B('Save document', '#C0CA33', '#000', save),
      h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 8, lineHeight: 1.5 } }, 'Photos are shrunk and stored in your family database. For years of scans, keep the originals in Google Drive too. The app cannot read the numbers off a photo itself — type the amount and vendor.')),
    h('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 } }, [['all', 'All'], ['due', 'Due'], ['receipt', 'Receipts'], ['invoice', 'Invoices'], ['bill', 'Bills'], ['tax', 'Tax']].map(function (k) { return h('button', { key: k[0], onClick: function () { setFlt(k[0]); }, style: { padding: '5px 10px', borderRadius: 20, border: '1px solid ' + (flt === k[0] ? '#C0CA33' : 'rgba(255,255,255,.2)'), background: flt === k[0] ? '#C0CA33' : 'transparent', color: flt === k[0] ? '#000' : '#ccc', fontSize: 11, fontWeight: 700, cursor: 'pointer' } }, k[1]); })),
    shown.map(function (d) {
      return h('div', { key: d.id, style: card },
        h('div', { style: { display: 'flex', gap: 8 } }, h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, (d.vendor || 'Document') + (d.school ? ' 🏫' : '') + (d.paid ? ' ✅' : '')), h('div', { style: { fontSize: 10, color: '#aaa' } }, (kinds.find(function (k) { return k[0] === d.kind; }) || ['', d.kind])[1] + ' · ' + d.date + (d.due ? ' · due ' + d.due : '') + ' · ' + (d.stream || ''))), h('div', { style: { fontWeight: 900, color: '#fff' } }, d.amount ? bhMoney(d.amount) : '')),
        h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 } }, d.hasFile && B(view === d.id ? 'Hide' : '👁 View', 'rgba(255,255,255,.12)', '#fff', function () { setView(view === d.id ? null : d.id); }), !d.paid && d.amount > 0 && B('Paid → ledger', '#4CAF82', '#000', function () { toLedger(d); }), B('Delete', 'rgba(239,83,80,.2)', '#EF5350', function () { syncSet('household/docs/' + d.id, null); syncSet('household/docfiles/' + d.id, null); })),
        view === d.id && h(BH_DocView, { id: d.id }));
    }));
}

// ── Tax tab ──────────────────────────────────────────────────────────────────
function BH_Tax(P) {
  var h = React.createElement, card = P.card, B = P.B;
  var yS = React.useState(String(new Date().getFullYear())), yr = yS[0], setYr = yS[1];
  var mS = ktUse('household/miles', {}), trips = Object.values(mS[0] || {}).filter(function (t) { return (t.date || '').slice(0, 4) === yr; });
  var rate = Number(ktUse('household/mileRate', 0.725)[0]) || 0.725;
  var L = P.ledger.filter(function (t) { return (t.date || '').slice(0, 4) === yr; });
  var streams = BH_STREAMS.slice(0, 3);
  var part = function (t) { return bhAlloc(t); };
  var data = {}; streams.forEach(function (s) { data[s] = { inc: 0, cats: {} }; });
  L.forEach(function (t) { part(t).forEach(function (p) { if (!data[p.stream]) return; if (t.type === 'income') data[p.stream].inc += p.amt; else { var c = t.category || 'Other'; data[p.stream].cats[c] = (data[p.stream].cats[c] || 0) + p.amt; } }); });
  var miles = {}; trips.forEach(function (t) { miles[t.stream] = (miles[t.stream] || 0) + (Number(t.miles) || 0); });
  var donations = L.filter(function (t) { return t.type === 'expense' && (t.category === 'Donations' || t.donation); });
  var donTotal = donations.reduce(function (s, t) { return s + (Number(t.amount) || 0); }, 0);
  var school = L.filter(function (t) { return t.type === 'expense' && t.school; });
  var schoolTotal = school.reduce(function (a, t) { return a + (Number(t.amount) || 0); }, 0);
  var schoolCats = {}; school.forEach(function (t) { schoolCats[t.category || 'Other'] = (schoolCats[t.category || 'Other'] || 0) + (Number(t.amount) || 0); });
  var lines = function (s) { var rows = {}; Object.keys(data[s].cats).forEach(function (c) { var ln = BH_SCHEDC[c] || 'Line 27a Other expenses'; var v = data[s].cats[c] * (c === 'Meals' ? 0.5 : 1); rows[ln] = (rows[ln] || 0) + v; }); if (miles[s]) rows['Line 9 Car & truck (mileage ' + miles[s].toFixed(1) + ' mi)'] = miles[s] * rate; return rows; };
  var totals = function (s) { var l = lines(s), e = Object.values(l).reduce(function (a, b) { return a + b; }, 0); return { exp: e, net: data[s].inc - e }; };
  function exportC() { var rows = [['Business', 'Schedule C line', 'Amount']]; streams.forEach(function (s) { rows.push([s, 'Line 1 Gross receipts', data[s].inc.toFixed(2)]); var l = lines(s); Object.keys(l).sort().forEach(function (k) { rows.push([s, k, l[k].toFixed(2)]); }); var t = totals(s); rows.push([s, 'NET PROFIT', t.net.toFixed(2)]); }); bhDownload('schedule-c-summary-' + yr + '.csv', bhCsv(rows)); }
  function exportAll() { bhDownload('all-transactions-' + yr + '.csv', bhCsv([['Date', 'Type', 'Amount', 'Category', 'Business/Personal', 'Split to', 'Split %', 'Donation', 'Note']].concat(L.map(function (t) { return [t.date, t.type, t.amount, t.category, t.stream, t.split ? t.split.stream : '', t.split ? t.split.pct : '', (t.category === 'Donations' || t.donation) ? 'yes' : '', t.note]; })))); }
  function exportSchool() { bhDownload('school-expenses-' + yr + '.csv', bhCsv([['Date', 'Amount', 'Category', 'Paid for (business/personal)', 'Note', 'Receipt on file']].concat(school.map(function (t) { return [t.date, t.amount, t.category, t.stream, t.note, t.docId ? 'yes' : '']; })))); }
  function exportDon() { bhDownload('donations-' + yr + '.csv', bhCsv([['Date', 'To', 'Amount', 'Note']].concat(donations.map(function (t) { return [t.date, t.recipient || '', t.amount, t.note]; })))); }
  function printIt() {
    var w = window.open('', '_blank'); if (!w) { P.say('Allow pop-ups to print.'); return; }
    var html = '<html><head><title>Tax summary ' + yr + '</title><style>body{font-family:sans-serif;padding:24px}td,th{padding:4px 10px;text-align:left}td.r{text-align:right}h2{margin-top:24px}</style></head><body><h1>Tax summary ' + yr + '</h1><p>Estimates from the family app. Verify with your records and tax preparer.</p>';
    streams.forEach(function (s) { var l = lines(s), t = totals(s); html += '<h2>' + s + '</h2><table><tr><td>Gross receipts</td><td class=r>' + bhMoney(data[s].inc) + '</td></tr>' + Object.keys(l).sort().map(function (k) { return '<tr><td>' + k + '</td><td class=r>' + bhMoney(l[k]) + '</td></tr>'; }).join('') + '<tr><th>Net profit</th><th class=r>' + bhMoney(t.net) + '</th></tr></table>'; });
    html += '<h2>Donations</h2><table>' + donations.map(function (d) { return '<tr><td>' + d.date + '</td><td>' + (d.recipient || d.note || '') + '</td><td class=r>' + bhMoney(d.amount) + '</td></tr>'; }).join('') + '<tr><th colspan=2>Total</th><th class=r>' + bhMoney(donTotal) + '</th></tr></table></body></html>';
    w.document.write(html); w.document.close(); setTimeout(function () { w.print(); }, 400);
  }
  return h('div', null,
    h('div', { style: Object.assign({}, card, { borderColor: 'rgba(66,165,245,.5)' }) },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#90CAF9', marginBottom: 4 } }, '🧾 TAX TIME'),
      h('div', { style: { fontSize: 11, color: '#ddd', lineHeight: 1.6 } }, 'Each business is sorted into IRS Schedule C lines below. Download the files and use them to fill in TurboTax (or hand them to a preparer). The app does not log in to TurboTax or push data into it.')),
    h('select', { value: yr, onChange: function (e) { setYr(e.target.value); }, style: P.inp }, [0, 1, 2, 3].map(function (i) { var y = String(new Date().getFullYear() - i); return h('option', { key: y, value: y, style: { color: '#000' } }, 'Tax year ' + y); })),
    streams.map(function (s) {
      var l = lines(s), t = totals(s);
      return h('div', { key: s, style: card }, h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 6 } }, s),
        h('div', { style: { display: 'flex', fontSize: 12, color: '#4CAF82' } }, h('div', { style: { flex: 1 } }, 'Line 1 Gross receipts'), bhMoney(data[s].inc)),
        Object.keys(l).sort().map(function (k) { return h('div', { key: k, style: { display: 'flex', fontSize: 12, color: '#ddd', padding: '2px 0' } }, h('div', { style: { flex: 1 } }, k), bhMoney(l[k])); }),
        h('div', { style: { display: 'flex', fontSize: 13, fontWeight: 900, color: t.net < 0 ? '#EF9A9A' : '#fff', borderTop: '1px solid rgba(255,255,255,.15)', marginTop: 4, paddingTop: 4 } }, h('div', { style: { flex: 1 } }, 'Net profit'), bhMoney(t.net)));
    }),
    h('div', { style: card }, h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, '🏫 School / homeschool purchases ' + yr + ': ' + bhMoney(schoolTotal)),
      Object.keys(schoolCats).map(function (k) { return h('div', { key: k, style: { display: 'flex', fontSize: 11, color: '#ccc', padding: '2px 0' } }, h('div', { style: { flex: 1 } }, k), bhMoney(schoolCats[k])); }),
      school.length === 0 && h('div', { style: { fontSize: 11, color: '#999' } }, 'Tick "🏫 School / homeschool expense" in the Ledger (or on a scanned receipt) and it collects here.'),
      h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', margin: '6px 0', lineHeight: 1.5 } }, 'Kept for your records. Homeschool costs are generally personal expenses on a federal return. Curriculum or supplies for Discovering Kids Academy may be treated differently if it operates as part of your business, and some states offer education credits. Ask a tax preparer what applies to you in your state.'),
      B('⬇ School expenses CSV', 'rgba(255,255,255,.15)', '#fff', exportSchool)),
    h('div', { style: card }, h('div', { style: { fontSize: 13, fontWeight: 800, color: '#fff' } }, '🙏 Donations ' + yr + ': ' + bhMoney(donTotal)), donations.slice(0, 30).map(function (d) { return h('div', { key: d.id, style: { display: 'flex', fontSize: 11, color: '#ccc', padding: '3px 0' } }, h('div', { style: { flex: 1 } }, d.date + ' · ' + (d.recipient || d.note || 'Donation')), bhMoney(d.amount)); }), h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 6 } }, 'Tracked for your records. Whether a gift is tax-deductible depends on the receiving organization — ask your tax preparer.')),
    h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, B('⬇ Schedule C summary', '#42A5F5', '#000', exportC), B('⬇ All transactions', 'rgba(255,255,255,.15)', '#fff', exportAll), B('⬇ Donations', 'rgba(255,255,255,.15)', '#fff', exportDon), B('🖨 Print / save PDF', '#C0CA33', '#000', printIt)));
}
