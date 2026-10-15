// ═══ v42 MENU LEARNING — the Smart Menu feeds the math, science and money lessons; weekly flyer reminder ═══
var ML_TOPICS = [
  { t: 'Water and the kidneys', g4: 'Your kidneys are two filters that clean your blood. Count how many cups of water you drink today. Goal: pale-yellow pee and at least 6–8 cups. Draw your kidneys.', g8: 'Stones form when minerals become too concentrated in urine. Dissolve 1 tsp of salt in 1 cup of water, then in 4 cups. Which is more concentrated? How does drinking more water help?', g12: 'Describe saturation and solubility. Explain why a larger urine volume lowers the chance that calcium oxalate crystals form. Calculate: to make 2.5 L of urine a day, about how many liters of fluid must an adult drink if some is lost by sweat and breath?' },
  { t: 'Calcium with meals', g4: 'Strong bones need calcium. Name 3 foods in today’s menu that have calcium (milk, yogurt, cheese).', g8: 'Calcium in food binds to oxalate in the gut, so less oxalate reaches the kidneys. Find the calcium-rich food in today’s meals and explain why we eat it with the meal, not apart.', g12: 'Explain why dietary calcium lowers stone risk while high-dose calcium pills can raise it. Draw the path of calcium and oxalate through the digestive tract.' },
  { t: 'Salt (sodium) and the body', g4: 'Salt can make our body hold water. Read one food label and find the sodium. Which of today’s foods has no label?', g8: 'Compare the sodium in a processed food label with the same food made from scratch. Make a bar graph. Why do we cook with lemon and herbs?', g12: 'Explain how sodium affects calcium excretion by the kidneys and blood pressure. Compare mg sodium in the plan (estimate) with the 2,300 mg daily limit and the 1,500 mg ideal.' },
  { t: 'Lemons and citrate (kitchen experiment)', g4: 'Squeeze a lemon in water. Does it taste sour? Sour foods are acids. Smell and taste, then draw it.', g8: 'Make red-cabbage indicator: boil cabbage, strain the juice. Add it to plain water, lemon water and a pinch of baking soda. Record the colors and rank them by acidity.', g12: 'Citrate binds calcium and raises urine pH slightly. Using the red-cabbage indicator, estimate the pH of lemon water, plain water and baking soda water, and explain how citrate in the urine helps prevent stones.' },
  { t: 'Omega-3 fats and the brain', g4: 'Fish like salmon is “brain food.” Draw a plate with your fish dinner and 3 foods that help you focus.', g8: 'Your brain is about 60% fat. Find the fish meals on this week’s plan and count how many days you eat omega-3. Keep a focus log after breakfast for 3 days.', g12: 'Describe what DHA and EPA do in nerve cell membranes. Design a fair self-experiment on how breakfast with protein affects focus; explain why one person’s results can’t prove a rule.' },
  { t: 'Fiber and digestion', g4: 'Fiber helps food move through your body. Name 3 fiber foods you ate today.', g8: 'Chart the fiber (g) in 5 foods from today’s menu using labels or a nutrition website. Which meal gives the most?', g12: 'Compare soluble and insoluble fiber, and explain how fiber affects blood sugar and cholesterol. Compute the grams of fiber for one day on this menu.' },
  { t: 'Energy in, energy out (for everyone’s growth)', g4: 'Food gives your body energy to grow and play. Why do kids eat more rice and fruit than grown-ups?', g8: 'A calorie is a unit of energy. Explain why a growing child and an adult need different portions of the same meal.', g12: 'Estimate basal metabolic rate with the Mifflin–St Jeor formula for an adult. Explain why growing teens need more energy and why this menu uses portions, not separate diets.' },
  { t: 'Food safety and cooking temperatures', g4: 'Wash hands for 20 seconds. Chicken must be hot all the way through. Practice with a thermometer.', g8: 'Poultry needs 165°F, pork 145°F, and ground beef 160°F. Check today’s dinner with a thermometer and record the temperature.', g12: 'Explain the “danger zone” (40–140°F) and bacterial growth rates. Make a simple graph of doubling every 20 minutes.' },
  { t: 'Sugar, energy and focus', g4: 'Compare an orange and a glass of juice. Which fills you up more?', g8: 'Find the grams of sugar in 3 drinks. Convert grams to teaspoons (4 g = 1 tsp).', g12: 'Explain how blood sugar and insulin work and why whole fruit with fiber affects the body differently than sugary drinks.' }
];
function mlGrade(g) { return g <= 5 ? 'g4' : g <= 9 ? 'g8' : 'g12'; }
function mlDayIndex() { var d = new Date(); return d.getDay(); }
function mlRecipeCost(rid) { if (!rid || String(rid).indexOf('lib_') !== 0) return null; var k = rid.slice(4), r = SM_LIB.filter(function (x) { return x.k === k; })[0]; return r ? Math.round(r.ing.reduce(function (a, i) { return a + i[1]; }, 0) * 100) / 100 : null; }
function mlWeekTotals(menu) { var tot = 0, n = 0, known = 0, days = menu && menu.days ? menu.days : {}; Object.keys(days).forEach(function (di) { Object.keys(days[di] || {}).forEach(function (m) { n++; var c = mlRecipeCost(days[di][m].rid); if (c != null) { tot += c; known++; } }); }); return { total: Math.round(tot * 100) / 100, meals: n, known: known }; }
function mlToday(menu) { var d = ((menu && menu.days) || {})[mlDayIndex()] || {}; return { breakfast: d.breakfast, lunch: d.lunch, dinner: d.dinner, snack: d.snack }; }
function MenuLink(props) {
  var sid = props.subjectId; if (sid !== 'math' && sid !== 'science') return null;
  if (typeof ktUse !== 'function' || typeof ktWeekStart !== 'function') return null;
  var h = React.createElement, ws = ktWeekStart(), mS = ktUse('kitchen_menu/' + ws, {}), menu = mS[0], td = mlToday(menu), g = mlGrade(props.grade || 8), day = parseInt(props.day) || 0;
  var dinner = td.dinner && td.dinner.title, dc = td.dinner ? mlRecipeCost(td.dinner.rid) : null, wk = mlWeekTotals(menu), budget = 300, body, label;
  if (sid === 'science') {
    var T = ML_TOPICS[day % ML_TOPICS.length]; label = '🧪 MENU SCIENCE — ' + T.t; body = T[g];
  } else if (day % 2 === 0) {
    label = '🍽 MENU MATH';
    body = g === 'g4' ? (dinner ? 'Tonight we are making “' + dinner + '” for 6 people. If we invite 6 more, how many times do we double the recipe? Pick one ingredient and double it. Then halve it for 3 people.' : 'Pick any recipe on the menu. It feeds 6. How many would it feed if you doubled it? Halved it?')
      : g === 'g8' ? (dc ? '“' + dinner + '” costs about $' + dc.toFixed(2) + ' for 6 people. Find the cost per serving. What would it cost for 10 people? Write your unit rate.' : 'Choose a dinner from this week’s menu. Add the estimated ingredient costs and find the cost per serving for 6.')
      : (wk.known ? 'This week’s menu has ' + wk.known + ' planned meals priced at about $' + wk.total.toFixed(2) + ' before pantry savings. What percent of the $' + budget + ' budget is that? Find the average cost per meal and per person per day. If prices rise 8%, what is the new total?' : 'Use the Smart Menu estimate and the $' + budget + ' weekly budget: compute % of budget used, cost per meal and cost per person per day. Then model an 8% price increase.');
  } else {
    label = '💰 MENU MONEY';
    body = g === 'g4' ? 'Our family has a grocery budget. If we spend $10 on apples and $5 on carrots, how much did we spend? How much change from $20?'
      : g === 'g8' ? 'A flyer says chicken is $1.99 a lb; last week it was $2.99. Find the percent savings. Which is the better buy: 3 lb at $1.99 or 2 lb at $1.49?'
      : 'Build a one-week grocery budget table: categories (produce, protein, dairy, grains), planned and actual cost, and the difference. Which category is the most flexible when prices change?';
  }
  return h('div', { style: { background: 'rgba(76,175,130,.12)', border: '1px solid rgba(76,175,130,.4)', borderRadius: 8, padding: '6px 9px', margin: '6px 0' } },
    h('div', { style: { fontSize: 9, color: '#81C784', letterSpacing: 1, marginBottom: 2 } }, label),
    h('div', { style: { fontSize: 10, color: '#ddd', lineHeight: 1.6 } }, body),
    dinner ? h('div', { style: { fontSize: 9, color: '#9be5bd', marginTop: 2 } }, 'Tonight’s dinner: ' + dinner) : h('div', { style: { fontSize: 9, color: '#9ad', marginTop: 2 } }, 'A parent can put this week’s plan on the menu in Kitchen → Smart Menu.'));
}
// Replaces the old built-in meal-plan content in the Science lesson with the live Smart Menu.
function MenuScience(props) {
  var h = React.createElement, ws = ktWeekStart(), mS = ktUse('kitchen_menu/' + ws, {}), menu = mS[0], td = mlToday(menu), wk = mlWeekTotals(menu);
  var g = mlGrade(props.grade || 8), T = ML_TOPICS[(parseInt(props.day) || 0) % ML_TOPICS.length], names = [['breakfast', '🌅'], ['lunch', '🥪'], ['dinner', '🍽'], ['snack', '🍎']];
  return h('div', { style: { background: 'rgba(76,175,130,.08)', border: '1px solid rgba(76,175,130,.3)', borderRadius: 10, padding: 10, margin: '8px 0' } },
    h('div', { style: { fontSize: 11, fontWeight: 900, color: '#81C784', letterSpacing: 1 } }, '🍳 SCIENCE KITCHEN — THIS WEEK’S MENU'),
    h('div', { style: { fontSize: 11, color: '#ccc', margin: '4px 0' } }, 'Today’s meals come from our Smart Menu. Science, math and money lessons use the real menu.'),
    names.map(function (n) { var e = td[n[0]]; return h('div', { key: n[0], style: { fontSize: 12, color: e ? '#fff' : '#678', padding: '2px 0' } }, n[1] + ' ' + (e ? e.title : '—')); }),
    wk.known ? h('div', { style: { fontSize: 11, color: '#9ad', marginTop: 4 } }, 'This week: ' + wk.meals + ' meals planned, about $' + wk.total.toFixed(2) + ' in recipes (before pantry and sales).') : null,
    h('div', { style: { fontSize: 12, fontWeight: 800, color: '#FFD54F', marginTop: 8 } }, '🧪 Today’s menu science: ' + T.t), h('div', { style: { fontSize: 12, color: '#ddd', lineHeight: 1.6 } }, T[g]));
}
// ── weekly reminder: parents' device nudges when it is time to refresh the flyers and renew the menu ──
(function () {
  function check() {
    try {
      if (!window._isAdminSession || typeof window._addNotifFn !== 'function' || typeof ktWeekStart !== 'function' || typeof db === 'undefined' || !db) return;
      var now = new Date(); if (now.getDay() < 3 || now.getHours() < 16) return;
      var ws = ktWeekStart(), key = 'smartmenu_remind_' + ws; if (localStorage.getItem(key)) return;
      db.ref('argilan/smartmenu/sales/' + ws).once('value', function (a) {
        if (a.val()) { localStorage.setItem(key, '1'); return; }
        db.ref('argilan/smartmenu/remind/' + ws).once('value', function (b) {
          if (b.val()) { localStorage.setItem(key, '1'); return; }
          try { db.ref('argilan/smartmenu/remind/' + ws).set(Date.now()); } catch (e) {}
          localStorage.setItem(key, '1');
          window._addNotifFn('task', 'laurel', '🛒 New flyers are out — renew the menu', 'Open Kitchen → Smart Menu, add this week’s sales, tap New ideas, then Put this plan on the weekly menu.', {});
        });
      });
    } catch (e) {}
  }
  setTimeout(check, 20000); setInterval(check, 30 * 60 * 1000);
})();

// ═══ JW SONG PROGRAM — music class is part of the Kingdom song program (words are read from the songbook, not copied here) ═══
var JSP_GRADE = { mykah: 4, ashelyn: 8, kayla: 11, ryan: 12 };
function jspWeek() { var d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 604800000); }
function JwSongProgram(props) {
  if (typeof JW_SONGS === 'undefined' || typeof syncOn !== 'function') return null;
  var h = React.createElement, pid = props.personId, g = JSP_GRADE[pid] || 8, wk = jspWeek(), key = new Date().getFullYear() + '_' + wk, song = JW_SONGS[wk % JW_SONGS.length];
  var s = React.useState({}), d = s[0], setD = s[1], path = 'school/songprog/' + pid + '/' + key;
  React.useEffect(function () { var u = syncOn(path, function (v) { setD(v || {}); }, true); return function () { if (u) u(); }; }, [path]);
  function put(k, v) { setD(function (o) { var n = Object.assign({}, o); n[k] = v; return n; }); try { syncSet(path + '/' + k, v); } catch (e) {} }
  var steps = [
    ['listen', '🎧 Listen to Song ' + song.n + ', “' + song.t + '” on jw.org (Music) or in JW Library — at least 3 times.'],
    ['read', '📖 Read the words with your family from the songbook. Find the Bible idea behind the song and say it in your own words.'],
    ['sing', '🎤 Sing it: stand tall, breathe from your belly, match the pitch of the recording.'],
    ['play', '🎹 Play the melody or the rhythm of the first line on your instrument. Practice it slowly, then at tempo.']
  ];
  if (g >= 8) steps.push(['theory', '🎼 Find the time signature and count the beats in one measure. Clap the rhythm of a line.']);
  if (g >= 11) steps.push(['harmony', '🎶 Learn a harmony part (alto, tenor or bass) or play the chords that fit the melody.']);
  steps.push(['lead', '👨‍👩‍👧‍👦 Lead the family in singing it at worship. Teach one line to someone younger.']);
  var done = steps.filter(function (x) { return d[x[0]]; }).length;
  return h('div', { style: { background: 'rgba(103,58,183,.15)', border: '1px solid rgba(179,136,255,.4)', borderRadius: 12, padding: 12, margin: 14 } },
    h('div', { style: { fontSize: 11, fontWeight: 900, color: '#B39DDB', letterSpacing: 1 } }, '🎵 JW SONG PROGRAM — SONG OF THE WEEK'),
    h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', margin: '2px 0' } }, 'Song ' + song.n + ' — ' + song.t),
    h('div', { style: { fontSize: 11, color: '#cfc4e8', lineHeight: 1.5, marginBottom: 6 } }, 'Music class is part of our Kingdom song program. We praise Jehovah with song (Psalm 33:1-3). Every instrument lesson supports the week’s song.'),
    h('a', { href: 'https://www.jw.org/en/library/music-songs/', target: '_blank', rel: 'noopener noreferrer', style: { color: '#B39DDB', fontSize: 12, fontWeight: 800 } }, 'Open Music on jw.org ↗'),
    h('div', { style: { height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 4, margin: '8px 0' } }, h('div', { style: { height: 6, width: (100 * done / steps.length) + '%', background: '#9575CD', borderRadius: 4 } })),
    steps.map(function (x) { return h('div', { key: x[0], onClick: function () { put(x[0], !d[x[0]]); }, style: { display: 'flex', gap: 8, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,.07)', cursor: 'pointer' } }, h('span', null, d[x[0]] ? '✅' : '⬜'), h('span', { style: { fontSize: 12, color: d[x[0]] ? '#9be5bd' : '#eee', lineHeight: 1.5 } }, x[1])); }),
    h('div', { style: { fontSize: 12, color: '#cfc4e8', marginTop: 8 } }, 'Practice minutes this week: ', h('input', { defaultValue: d.mins || '', key: 'm' + (d.mins || ''), inputMode: 'numeric', onBlur: function (e) { put('mins', Math.max(0, +e.target.value || 0)); }, style: { width: 60, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.25)', borderRadius: 6, color: '#fff', padding: 4 } })));
}
