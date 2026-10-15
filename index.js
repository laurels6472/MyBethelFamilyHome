// Sends a phone/tablet push whenever a notification is written to the app.
// Deploy: firebase deploy --only functions   (needs the Blaze pay-as-you-go plan; typical family use costs ~$0)
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.pushOnNotif = functions.database.ref('/argilan/notifs/{id}').onCreate(async (snap) => {
  const n = snap.val() || {};
  const db = admin.database();
  const all = (await db.ref('/argilan/push_tokens').once('value')).val() || {};
  const who = n.personId === 'all' ? Object.keys(all) : [n.personId];
  if (n.requiresApproval && who.indexOf('laurel') < 0) who.push('laurel');
  const tokens = [], where = [];
  who.forEach((pid) => Object.keys(all[pid] || {}).forEach((k) => { const t = all[pid][k] && all[pid][k].t; if (t) { tokens.push(t); where.push([pid, k]); } }));
  if (!tokens.length) return null;
  const res = await admin.messaging().sendEachForMulticast({
    tokens,
    data: { title: String(n.title || 'MyBethelFamilyHome'), body: String(n.message || ''), tag: String(n.type || 'n') },
    webpush: { headers: { Urgency: 'high' } },
    android: { priority: 'high' },
  });
  const dead = [];
  res.responses.forEach((r, i) => { if (!r.success && r.error && /registration-token-not-registered|invalid-registration-token/.test(r.error.code || '')) dead.push(db.ref('/argilan/push_tokens/' + where[i][0] + '/' + where[i][1]).remove()); });
  await Promise.all(dead);
  return null;
});
