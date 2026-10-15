// ═══ NUTRITION + CARB MATH — plate builder, daily macros, insulin helper (uses the parent's doctor-given numbers) ═══
// Food values are typical averages (USDA-style) — real labels and packaged-food lookups are more exact. Estimates only.

// [name, serving, calories, carbs g, protein g, fat g, fiber g]
var NT_FOODS = [
  ['Apple', '1 medium', 95, 25, 0.5, 0.3, 4.4], ['Banana', '1 medium', 105, 27, 1.3, 0.4, 3.1], ['Orange', '1 medium', 62, 15, 1.2, 0.2, 3.1],
  ['Grapes', '1 cup', 104, 27, 1.1, 0.2, 1.4], ['Strawberries', '1 cup', 49, 12, 1, 0.5, 3], ['Blueberries', '1 cup', 84, 21, 1.1, 0.5, 3.6],
  ['Watermelon', '1 cup diced', 46, 11.5, 0.9, 0.2, 0.6], ['Pear', '1 medium', 101, 27, 0.6, 0.2, 5.5], ['Peach', '1 medium', 59, 14, 1.4, 0.4, 2.3],
  ['Raisins', '1 small box', 130, 34, 1, 0, 2], ['Applesauce, unsweetened', '½ cup', 50, 14, 0, 0, 1.5], ['Orange juice', '1 cup', 112, 26, 1.7, 0.5, 0.5],
  ['Apple juice', '1 cup', 114, 28, 0.2, 0.3, 0.5], ['Juice box', '1 box (6.75 oz)', 90, 22, 0, 0, 0],
  ['Carrots', '1 cup', 52, 12, 1.2, 0.3, 3.6], ['Broccoli, cooked', '1 cup', 55, 11, 3.7, 0.6, 5], ['Salad greens + veggies', '2 cups', 20, 4, 1.5, 0.2, 2],
  ['Corn', '½ cup', 66, 15, 2.5, 1, 2], ['Green beans', '1 cup', 44, 10, 2.4, 0.4, 4], ['Peas', '½ cup', 59, 10, 4, 0.2, 3.5],
  ['Sweet potato, baked', '1 medium', 103, 24, 2.3, 0.2, 3.8], ['Potato, baked', '1 medium', 161, 37, 4.3, 0.2, 3.8], ['French fries', '1 medium order', 365, 48, 4, 17, 4.5],
  ['Cucumber', '1 cup', 16, 4, 0.7, 0.1, 0.5], ['Tomato', '1 medium', 22, 4.8, 1.1, 0.2, 1.5],
  ['Bread, white', '1 slice', 75, 14, 2.5, 1, 0.8], ['Bread, whole wheat', '1 slice', 80, 14, 4, 1, 2], ['Tortilla, flour', '1 (8 in)', 146, 25, 4, 3.5, 1.5],
  ['Rice, white', '1 cup cooked', 205, 45, 4.3, 0.4, 0.6], ['Rice, brown', '1 cup cooked', 215, 45, 5, 1.8, 3.5], ['Pasta', '1 cup cooked', 220, 43, 8, 1.3, 2.5],
  ['Oatmeal', '1 cup cooked', 150, 27, 5, 2.5, 4], ['Cheerios-type cereal', '1 cup', 100, 20, 3, 2, 3], ['Granola', '½ cup', 210, 30, 5, 7, 3],
  ['Pancake', '1 (4 in)', 90, 14, 2, 3, 0.5], ['Waffle', '1 frozen', 100, 15, 2, 3.5, 1], ['Bagel', '1 medium', 270, 53, 10, 1.5, 2],
  ['Crackers', '5 crackers', 60, 10, 1, 1.5, 0.4], ['Goldfish crackers', '55 pieces', 140, 20, 4, 5, 1], ['Popcorn, air-popped', '3 cups', 90, 18, 3, 1, 3.5],
  ['Tortilla chips', '1 oz', 140, 19, 2, 7, 1.5], ['Potato chips', '1 oz', 155, 15, 2, 10, 1], ['Pretzels', '1 oz', 108, 23, 3, 1, 1],
  ['Cookie, chocolate chip', '1 medium', 80, 10, 1, 4.5, 0.4], ['Granola bar', '1 bar', 100, 17, 2, 3, 1], ['Muffin', '1 medium', 340, 52, 5, 13, 1.5],
  ['Pizza, cheese', '1 slice', 285, 36, 12, 10, 2.5], ['Hamburger bun', '1 bun', 120, 21, 4, 2, 1], ['Cornbread', '1 piece', 190, 29, 4, 7, 1],
  ['Mac and cheese', '1 cup', 350, 47, 11, 13, 2], ['Spaghetti sauce', '½ cup', 70, 10, 2, 2, 2], ['Chicken noodle soup', '1 cup', 60, 8, 3.5, 1.5, 0.5],
  ['PB&J sandwich', '1 sandwich', 380, 50, 12, 16, 4], ['Grilled cheese sandwich', '1 sandwich', 370, 28, 14, 22, 1], ['Cheese quesadilla', '1 medium', 320, 28, 13, 17, 1.5],
  ['Hamburger', '1 sandwich', 250, 31, 12, 9, 1], ['Cheeseburger', '1 sandwich', 300, 33, 15, 12, 1.5],
  ['Egg', '1 large', 72, 0.4, 6.3, 5, 0], ['Bacon', '1 slice', 43, 0.1, 3, 3.3, 0], ['Breakfast sausage', '2 links', 180, 1, 8, 16, 0],
  ['Chicken breast', '3 oz cooked', 140, 0, 26, 3, 0], ['Chicken nuggets', '4 pieces', 190, 12, 10, 12, 1], ['Ground beef', '3 oz cooked', 215, 0, 22, 14, 0],
  ['Hot dog', '1 frank', 150, 2, 5, 13, 0], ['Turkey deli meat', '2 oz', 60, 1, 11, 1, 0], ['Ham deli meat', '2 oz', 60, 1, 10, 2, 0],
  ['Salmon', '3 oz cooked', 175, 0, 19, 11, 0], ['Tuna, canned', '3 oz', 100, 0, 22, 1, 0], ['Shrimp', '3 oz cooked', 85, 0, 18, 1, 0],
  ['Black beans', '½ cup', 115, 20, 7.5, 0.5, 7.5], ['Pinto beans', '½ cup', 120, 22, 7, 0.5, 7.5], ['Peanut butter', '2 tbsp', 190, 7, 7, 16, 2],
  ['Almonds', '1 oz', 165, 6, 6, 14, 3.5], ['Hummus', '2 tbsp', 70, 4, 2, 5, 1.5], ['Tofu', '½ cup', 90, 2, 10, 5, 0.5],
  ['Milk, whole', '1 cup', 150, 12, 8, 8, 0], ['Milk, 2%', '1 cup', 122, 12, 8, 5, 0], ['Chocolate milk', '1 cup', 190, 28, 8, 5, 1],
  ['Yogurt, flavored', '6 oz', 150, 27, 6, 2, 0], ['Greek yogurt, plain', '6 oz', 100, 6, 17, 0, 0], ['Cheese slice', '1 slice', 70, 2, 4, 5.5, 0],
  ['Cheddar cheese', '1 oz', 115, 0.4, 7, 9.5, 0], ['String cheese', '1 stick', 80, 1, 7, 6, 0], ['Cottage cheese', '½ cup', 90, 4, 12, 2.5, 0],
  ['Ice cream', '½ cup', 140, 16, 2.5, 7, 0.5], ['Butter', '1 tbsp', 100, 0, 0, 11, 0], ['Cream cheese', '1 tbsp', 50, 1, 1, 5, 0],
  ['Jelly or jam', '1 tbsp', 50, 13, 0, 0, 0], ['Honey', '1 tbsp', 64, 17, 0, 0, 0], ['Syrup', '2 tbsp', 105, 27, 0, 0, 0],
  ['Ketchup', '1 tbsp', 20, 5, 0, 0, 0], ['Mayonnaise', '1 tbsp', 90, 0, 0, 10, 0], ['Ranch dressing', '2 tbsp', 130, 2, 0.5, 13, 0], ['Olive oil', '1 tbsp', 120, 0, 0, 14, 0],
  ['Soda', '12 oz can', 140, 39, 0, 0, 0], ['Sports drink', '20 oz', 130, 34, 0, 0, 0], ['Fruit snacks', '1 pouch', 80, 18, 0, 0, 0], ['Candy bar', '1.5 oz', 210, 27, 3, 11, 1]
].map(function (r, i) { return { id: 'f' + i, name: r[0], serving: r[1], cal: r[2], carbs: r[3], protein: r[4], fat: r[5], fiber: r[6] }; });

function ntR(n, d) { var m = Math.pow(10, d == null ? 1 : d); return Math.round((Number(n) || 0) * m) / m; }
function ntLocalDay(ts) { var d = ts ? new Date(ts) : new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }

// Shrink big phone photos before saving (keeps the shared database small)
function ntResizeImage(file, maxDim, cb) {
  try {
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        try {
          var s = Math.min(1, maxDim / Math.max(img.width, img.height)), c = document.createElement('canvas');
          c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          cb(c.toDataURL('image/jpeg', 0.72));
        } catch (e) { cb(ev.target.result); }
      };
      img.onerror = function () { cb(ev.target.result); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  } catch (e) {}
}

function ntOffToFood(p) {
  var n = p.nutriments || {}, perServ = n['carbohydrates_serving'] != null;
  var sfx = perServ ? '_serving' : '_100g';
  var kcal = n['energy-kcal' + sfx] != null ? n['energy-kcal' + sfx] : (n['energy' + sfx] != null ? n['energy' + sfx] / 4.184 : 0);
  var name = [p.brands && String(p.brands).split(',')[0], p.product_name].filter(Boolean).join(' ');
  if (!name || n['carbohydrates' + sfx] == null) return null;
  return { id: 'off' + Math.random().toString(36).slice(2, 7), name: name, serving: perServ ? (p.serving_size || '1 serving') : '100 g', cal: ntR(kcal, 0), carbs: ntR(n['carbohydrates' + sfx]), protein: ntR(n['proteins' + sfx]), fat: ntR(n['fat' + sfx]), fiber: ntR(n['fiber' + sfx]), online: true };
}

// ── barcode scanner (one scan, then closes) ───────────────────────────────────
function NutriScan(props) {
  var h = React.createElement;
  var vRef = React.useRef(null), sRef = React.useRef(null), stop = React.useRef(false);
  React.useEffect(function () {
    stop.current = false;
    (async function () {
      try {
        if (!('BarcodeDetector' in window)) { props.onFail('This browser cannot scan barcodes — type the number instead.'); return; }
        var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        sRef.current = stream;
        var v = vRef.current; if (!v) return; v.srcObject = stream; try { await v.play(); } catch (e) {}
        var det = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
        (async function loop() {
          if (stop.current) return;
          try { var r = await det.detect(v); if (r && r.length) { props.onCode(r[0].rawValue); return; } } catch (e) {}
          setTimeout(loop, 350);
        })();
      } catch (e) { props.onFail('Camera not available — allow camera access or type the barcode.'); }
    })();
    return function () { stop.current = true; if (sRef.current) sRef.current.getTracks().forEach(function (t) { t.stop(); }); };
  }, []);
  return h('div', { style: { marginBottom: 8 } }, h('video', { ref: vRef, playsInline: true, muted: true, style: { width: '100%', borderRadius: 12, background: '#000', maxHeight: 240 } }), h('button', { onClick: props.onClose, style: { marginTop: 6, background: 'transparent', color: '#aaa', border: '1px solid rgba(255,255,255,.2)', borderRadius: 20, padding: '5px 12px', fontSize: 11 } }, 'Close camera'));
}

var NT_CARD = { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: 12, marginBottom: 10 };
var NT_INP = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 10, color: '#fff', padding: '8px 10px', fontSize: 14, width: '100%', boxSizing: 'border-box', marginBottom: 6, fontFamily: 'inherit' };
function ntBtn(bg, fg) { return { background: bg, color: fg || '#000', border: 'none', borderRadius: 20, padding: '7px 13px', fontWeight: 800, fontSize: 12, cursor: 'pointer' }; }
var NT_GHOST = { background: 'transparent', color: 'rgba(255,255,255,.65)', border: '1px solid rgba(255,255,255,.22)', borderRadius: 20, padding: '5px 10px', fontSize: 11, cursor: 'pointer' };

// ── plate builder + insulin helper ────────────────────────────────────────────
function NutritionMealBuilder(props) {
  var h = React.createElement;
  var itS = React.useState([]), items = itS[0], setItems = itS[1];
  var qS = React.useState(''), q = qS[0], setQ = qS[1];
  var orS = React.useState([]), online = orS[0], setOnline = orS[1];
  var bzS = React.useState(false), busy = bzS[0], setBusy = bzS[1];
  var msS = React.useState(''), msg = msS[0], setMsg = msS[1];
  var scS = React.useState(false), scan = scS[0], setScan = scS[1];
  var cuS = React.useState(false), custom = cuS[0], setCustom = cuS[1];
  var cfS = React.useState({}), cf = cfS[0], setCf = cfS[1];
  var bgS = React.useState(''), bg = bgS[0], setBg = bgS[1];
  var cnS = React.useState(false), confirmed = cnS[0], setConfirmed = cnS[1];
  var duS = React.useState(''), doseEdit = duS[0], setDoseEdit = duS[1];
  var dgS = ktUse('diabetes/' + props.targetId, {}), dm = dgS[0];

  var tot = items.reduce(function (a, it) { var n = it.n; a.cal += it.cal * n; a.carbs += it.carbs * n; a.protein += it.protein * n; a.fat += it.fat * n; a.fiber += (it.fiber || 0) * n; return a; }, { cal: 0, carbs: 0, protein: 0, fat: 0, fiber: 0 });
  var netCarbs = Math.max(0, tot.carbs);
  var say = function (t) { setMsg(t); setTimeout(function () { setMsg(''); }, 3500); };
  var local = q.trim().length >= 2 ? NT_FOODS.filter(function (f) { return f.name.toLowerCase().indexOf(q.trim().toLowerCase()) !== -1; }).slice(0, 8) : [];

  function addFood(f) { setItems(items.concat([Object.assign({}, f, { key: f.id + Date.now(), n: 1 })])); setQ(''); setOnline([]); }
  function setN(key, n) { setItems(items.map(function (it) { return it.key === key ? Object.assign({}, it, { n: Math.max(0.25, ntR(n, 2)) }) : it; })); }
  function drop(key) { setItems(items.filter(function (it) { return it.key !== key; })); }
  async function searchOnline() {
    if (q.trim().length < 2) return;
    try { if (typeof sfWordBlocked === 'function' && sfWordBlocked(q, window._currentPersonId)) { say('That search is not allowed.'); return; } } catch (e) {}
    setBusy(true); setOnline([]);
    try {
      var r = await fetch('https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + encodeURIComponent(q.trim()) + '&search_simple=1&action=process&json=1&page_size=10&fields=product_name,brands,serving_size,nutriments');
      var j = await r.json(); var list = (j.products || []).map(ntOffToFood).filter(Boolean).slice(0, 6);
      setOnline(list); if (!list.length) say('Nothing found online — add it yourself from the label.');
    } catch (e) { say('Could not search online right now.'); }
    setBusy(false);
  }
  async function byBarcode(code) {
    setScan(false); setBusy(true);
    try {
      var r = await fetch('https://world.openfoodfacts.org/api/v2/product/' + encodeURIComponent(code) + '.json?fields=product_name,brands,serving_size,nutriments');
      var j = await r.json(); var f = j && j.status === 1 ? ntOffToFood(j.product) : null;
      if (f) { addFood(f); say('Added ' + f.name); } else say('Barcode not found — add it from the label.');
    } catch (e) { say('Could not look that up.'); }
    setBusy(false);
  }
  function addCustom() {
    var c = parseFloat(cf.carbs); if (!cf.name || isNaN(c)) { say('Give it a name and the carbs from the label.'); return; }
    addFood({ id: 'c', name: cf.name, serving: cf.serving || '1 serving', cal: parseFloat(cf.cal) || 0, carbs: c, protein: parseFloat(cf.protein) || 0, fat: parseFloat(cf.fat) || 0, fiber: parseFloat(cf.fiber) || 0 });
    setCf({}); setCustom(false);
  }

  // insulin math — only with the doctor's numbers entered by a parent
  var on = dm && dm.enabled && parseFloat(dm.icr) > 0;
  var icr = parseFloat(dm.icr), isf = parseFloat(dm.isf), target = parseFloat(dm.target), maxDose = parseFloat(dm.maxDose) || 0, step = parseFloat(dm.rounding) || 0.5;
  var bgN = parseFloat(bg);
  var low = !isNaN(bgN) && bgN < (parseFloat(dm.lowBg) || 70);
  var high = !isNaN(bgN) && bgN >= (parseFloat(dm.highBg) || 300);
  var carbU = on ? netCarbs / icr : 0;
  var corrU = on && !isNaN(bgN) && isf > 0 && !isNaN(target) && bgN > target ? (bgN - target) / isf : 0;
  var rawTotal = carbU + corrU;
  var rounded = on ? Math.round(rawTotal / step) * step : 0;
  var capped = on && maxDose > 0 && rounded > maxDose;
  var suggest = capped ? maxDose : rounded;
  var recent = (props.entries || []).filter(function (e) { return e.type === 'insulin' && Date.now() - e.ts < 3 * 3600 * 1000; });
  var doseVal = doseEdit !== '' ? doseEdit : (on ? String(ntR(suggest, 2)) : '');
  var needsParent = !props.isAdmin;

  function applyTotals() { props.onApply({ carbs: String(ntR(tot.carbs)), protein: String(ntR(tot.protein)), fat: String(ntR(tot.fat)), cal: String(ntR(tot.cal, 0)), fiber: String(ntR(tot.fiber)), foods: items.map(function (it) { return it.n + '× ' + it.name + ' (' + it.serving + ')'; }) }); say('✅ Numbers added to the log entry below.'); }
  function logDose() {
    var u = parseFloat(doseVal); if (!(u > 0)) { say('Enter the units.'); return; }
    if (needsParent && !confirmed) { say('A parent needs to check the dose first.'); return; }
    var note = 'Carbs ' + ntR(netCarbs) + ' g' + (!isNaN(bgN) ? ' · BG ' + bgN : '') + ' · suggested ' + ntR(suggest, 2) + ' u';
    props.onLogInsulin(ntR(u, 2), note); setConfirmed(false); setDoseEdit(''); say('💉 Dose logged.');
  }

  return h('div', { style: { background: 'rgba(255,183,77,.07)', border: '1px solid rgba(255,183,77,.3)', borderRadius: 12, padding: 12, marginBottom: 10 } },
    h('div', { style: { fontSize: 11, fontWeight: 800, color: '#FFB74D', marginBottom: 2 } }, '🍽 WHAT’S ON THE PLATE?'),
    h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.5)', marginBottom: 8 } }, 'Pick the foods and how much — the app does the math. (It cannot read a photo by itself; the photo is saved with the meal.)'),
    msg && h('div', { style: { background: 'rgba(76,175,130,.15)', color: '#9be5bd', borderRadius: 8, padding: '6px 10px', fontSize: 11, marginBottom: 6 } }, msg),
    scan && h(NutriScan, { onCode: byBarcode, onFail: function (t) { setScan(false); say(t); }, onClose: function () { setScan(false); } }),
    h('div', { style: { display: 'flex', gap: 6 } },
      h('input', { type: 'text', value: q, onChange: function (e) { setQ(e.target.value); }, placeholder: 'Search a food (apple, rice, pizza…)', style: Object.assign({}, NT_INP, { marginBottom: 0 }) }),
      h('button', { onClick: function () { setScan(true); }, style: ntBtn('#42A5F5') }, '📷')),
    local.map(function (f) { return h('div', { key: f.id, onClick: function () { addFood(f); }, style: { display: 'flex', gap: 8, padding: '9px 6px', borderBottom: '1px solid rgba(255,255,255,.07)', cursor: 'pointer' } }, h('div', { style: { flex: 1, fontSize: 13, color: '#fff' } }, f.name, h('span', { style: { color: 'rgba(255,255,255,.45)', fontSize: 11 } }, ' · ' + f.serving)), h('div', { style: { fontSize: 11, color: '#FFB74D', fontWeight: 800 } }, f.carbs + ' g carbs')); }),
    q.trim().length >= 2 && h('div', { style: { display: 'flex', gap: 6, margin: '6px 0', flexWrap: 'wrap' } },
      h('button', { onClick: searchOnline, disabled: busy, style: NT_GHOST }, busy ? 'Searching…' : '🌐 Search packaged foods online'),
      h('button', { onClick: function () { setCustom(true); setCf({ name: q }); }, style: NT_GHOST }, '✍️ Add from a label')),
    online.map(function (f) { return h('div', { key: f.id, onClick: function () { addFood(f); }, style: { display: 'flex', gap: 8, padding: '9px 6px', borderBottom: '1px solid rgba(255,255,255,.07)', cursor: 'pointer' } }, h('div', { style: { flex: 1, fontSize: 12, color: '#fff' } }, f.name, h('span', { style: { color: 'rgba(255,255,255,.45)', fontSize: 10 } }, ' · per ' + f.serving)), h('div', { style: { fontSize: 11, color: '#FFB74D', fontWeight: 800 } }, f.carbs + ' g')); }),
    q.trim().length < 2 && !custom && h('button', { onClick: function () { setCustom(true); }, style: Object.assign({}, NT_GHOST, { marginTop: 6 }) }, '✍️ Add from a Nutrition Facts label'),
    custom && h('div', { style: Object.assign({}, NT_CARD, { marginTop: 8 }) },
      h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.55)', marginBottom: 6 } }, 'Type what the label says for ONE serving:'),
      h('input', { type: 'text', value: cf.name || '', onChange: function (e) { setCf(Object.assign({}, cf, { name: e.target.value })); }, placeholder: 'Food name', style: NT_INP }),
      h('input', { type: 'text', value: cf.serving || '', onChange: function (e) { setCf(Object.assign({}, cf, { serving: e.target.value })); }, placeholder: 'Serving size (e.g. 1 cup, 28 g)', style: NT_INP }),
      h('div', { style: { display: 'flex', gap: 6 } }, [['carbs', 'Carbs g'], ['protein', 'Protein g'], ['fat', 'Fat g'], ['cal', 'Calories']].map(function (k) { return h('input', { key: k[0], type: 'number', inputMode: 'decimal', value: cf[k[0]] || '', onChange: function (e) { var o = Object.assign({}, cf); o[k[0]] = e.target.value; setCf(o); }, placeholder: k[1], style: NT_INP }); })),
      h('div', { style: { display: 'flex', gap: 8 } }, h('button', { onClick: addCustom, style: ntBtn('#C0CA33') }, 'Add'), h('button', { onClick: function () { setCustom(false); }, style: NT_GHOST }, 'Cancel'))),

    items.length > 0 && h('div', { style: { marginTop: 10 } },
      items.map(function (it) {
        return h('div', { key: it.key, style: { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            h('div', { style: { flex: 1, fontSize: 13, color: '#fff', fontWeight: 700 } }, it.name, h('span', { style: { color: 'rgba(255,255,255,.4)', fontWeight: 400, fontSize: 11 } }, ' · ' + it.serving)),
            h('div', { style: { fontSize: 12, color: '#FFB74D', fontWeight: 800 } }, ntR(it.carbs * it.n) + ' g'),
            h('button', { onClick: function () { drop(it.key); }, style: Object.assign({}, NT_GHOST, { color: '#EF5350' }) }, '✕')),
          h('div', { style: { display: 'flex', gap: 5, alignItems: 'center', marginTop: 5, flexWrap: 'wrap' } },
            h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)' } }, 'How many servings?'),
            [0.5, 1, 1.5, 2, 3].map(function (n) { var onN = Math.abs(it.n - n) < 0.01; return h('button', { key: n, onClick: function () { setN(it.key, n); }, style: { padding: '5px 9px', borderRadius: 20, fontSize: 12, fontWeight: 800, cursor: 'pointer', border: '1px solid ' + (onN ? '#C0CA33' : 'rgba(255,255,255,.18)'), background: onN ? '#C0CA33' : 'rgba(255,255,255,.06)', color: onN ? '#000' : '#ddd' } }, n === 0.5 ? '½' : n === 1.5 ? '1½' : String(n)); }),
            h('button', { onClick: function () { setN(it.key, it.n - 0.25); }, style: NT_GHOST }, '−¼'), h('button', { onClick: function () { setN(it.key, it.n + 0.25); }, style: NT_GHOST }, '+¼'),
            h('div', { style: { fontSize: 11, color: '#fff', fontWeight: 800 } }, '= ' + ntR(it.n, 2) + '×')));
      }),
      h('div', { style: { display: 'flex', gap: 6, margin: '10px 0', textAlign: 'center' } },
        [['Carbs', ntR(tot.carbs) + ' g', '#FFB74D'], ['Protein', ntR(tot.protein) + ' g', '#42A5F5'], ['Fat', ntR(tot.fat) + ' g', '#AB47BC'], ['Calories', ntR(tot.cal, 0), '#66BB6A']].map(function (m) { return h('div', { key: m[0], style: { flex: 1, background: m[2] + '22', border: '1px solid ' + m[2] + '66', borderRadius: 10, padding: '8px 2px' } }, h('div', { style: { fontSize: 17, fontWeight: 900, color: '#fff' } }, m[1]), h('div', { style: { fontSize: 9, color: m[2], fontWeight: 800 } }, m[0])); })),
      tot.fiber > 0 && h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.5)', marginBottom: 6 } }, 'Fiber ' + ntR(tot.fiber) + ' g'),
      h('button', { onClick: applyTotals, style: Object.assign({}, ntBtn('#4CAF82'), { width: '100%', padding: 11 }) }, '✅ Use these numbers for this meal')),

    // insulin helper
    props.showInsulin && items.length > 0 && h('div', { style: { marginTop: 12, background: 'rgba(38,166,154,.1)', border: '1px solid rgba(38,166,154,.4)', borderRadius: 12, padding: 12 } },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#26A69A', marginBottom: 4 } }, '💉 INSULIN HELPER'),
      !on && h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.55)', lineHeight: 1.5 } }, 'Not turned on for this person. A parent enters the doctor’s numbers in the Health tab → ⚙️ Health settings.'),
      on && h('div', null,
        h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.5)', marginBottom: 6 } }, 'Uses the numbers a parent entered from the care team. It shows the math so you can learn it.'),
        h('input', { type: 'number', inputMode: 'numeric', value: bg, onChange: function (e) { setBg(e.target.value); setDoseEdit(''); }, placeholder: 'Blood sugar right now (mg/dL) — optional', style: NT_INP }),
        low && h('div', { style: { background: 'rgba(239,83,80,.2)', border: '1px solid #EF5350', borderRadius: 10, padding: 10, color: '#FFAB91', fontSize: 13, fontWeight: 700, marginBottom: 8, lineHeight: 1.5 } }, '⚠️ Blood sugar is LOW. Treat the low first with fast sugar and tell a parent right now. Do not take mealtime insulin until a parent says so.'),
        !low && h('div', null,
          high && h('div', { style: { background: 'rgba(255,152,0,.18)', border: '1px solid #FF9800', borderRadius: 10, padding: 8, color: '#FFCC80', fontSize: 12, marginBottom: 8 } }, '⚠️ Blood sugar is very high. Tell a parent and follow your care plan (ketone check, etc.).'),
          recent.length > 0 && h('div', { style: { background: 'rgba(255,152,0,.18)', border: '1px solid #FF9800', borderRadius: 10, padding: 8, color: '#FFCC80', fontSize: 12, marginBottom: 8 } }, '⏱ Insulin was logged in the last 3 hours (' + recent.map(function (e) { return e.dose + ' at ' + new Date(e.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }).join(', ') + '). Some may still be working — ask a parent.'),
          h('div', { style: { background: 'rgba(0,0,0,.25)', borderRadius: 10, padding: 10, fontSize: 13, color: '#fff', lineHeight: 1.9, fontFamily: 'ui-monospace,Menlo,monospace' } },
            h('div', null, 'Food: ' + ntR(netCarbs) + ' g carbs ÷ ' + icr + ' (1 unit per ' + icr + ' g) = ' + ntR(carbU, 2) + ' u'),
            !isNaN(bgN) && isf > 0 && !isNaN(target) ? h('div', null, bgN > target ? 'Correction: (' + bgN + ' − ' + target + ') ÷ ' + isf + ' = ' + ntR(corrU, 2) + ' u' : 'Correction: blood sugar is at or under target → 0 u') : h('div', { style: { color: 'rgba(255,255,255,.45)' } }, 'Correction: add blood sugar above to include it'),
            h('div', { style: { borderTop: '1px solid rgba(255,255,255,.2)', marginTop: 4, paddingTop: 4, fontWeight: 800, color: '#26A69A' } }, 'Total ' + ntR(rawTotal, 2) + ' u → rounds to ' + ntR(rounded, 2) + ' u')),
          capped && h('div', { style: { fontSize: 12, color: '#FF9800', margin: '6px 0' } }, '⚠️ That is over the safety limit of ' + maxDose + ' u set by your parent, so the limit is shown. Ask a parent.'),
          h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 } },
            h('div', { style: { fontSize: 12, color: '#ddd' } }, 'Dose to log (units):'),
            h('input', { type: 'number', inputMode: 'decimal', value: doseVal, onChange: function (e) { setDoseEdit(e.target.value); }, style: Object.assign({}, NT_INP, { width: 90, marginBottom: 0 }) })),
          needsParent && h('label', { style: { display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#fff', margin: '10px 0' } }, h('input', { type: 'checkbox', checked: confirmed, onChange: function (e) { setConfirmed(e.target.checked); }, style: { width: 20, height: 20 } }), 'A parent checked this dose with me'),
          h('button', { onClick: logDose, style: Object.assign({}, ntBtn(needsParent && !confirmed ? 'rgba(255,255,255,.15)' : '#26A69A', needsParent && !confirmed ? '#888' : '#000'), { width: '100%', padding: 11, marginTop: needsParent ? 0 : 10 }) }, '💉 Log this dose'),
          h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.35)', marginTop: 6, lineHeight: 1.5 } }, 'This is a math helper, not medical advice. It does not know about insulin still working from earlier doses, exercise, or illness. Always follow your care team’s plan.')))));
}

// ── parent settings: doctor's numbers + daily targets ─────────────────────────
function HealthSettingsPanel(props) {
  var h = React.createElement, pid = props.personId;
  var dgS = ktUse('diabetes/' + pid, {}), dm = dgS[0];
  var tgS = ktUse('nutrition_targets/' + pid, {}), tg = tgS[0];
  var opS = React.useState(false), open = opS[0], setOpen = opS[1];
  var save = function (k, v) { syncSet('diabetes/' + pid + '/' + k, v); };
  var saveT = function (k, v) { var n = parseFloat(v); syncSet('nutrition_targets/' + pid + '/' + k, isNaN(n) ? null : n); };
  var num = function (label, key, ph) {
    return h('div', { key: key, style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 } },
      h('div', { style: { flex: 1, fontSize: 11, color: '#ccc' } }, label),
      h('input', { type: 'number', inputMode: 'decimal', key: pid + key + (dm[key] == null ? '' : dm[key]), defaultValue: dm[key] == null ? '' : dm[key], placeholder: ph || '', onBlur: function (e) { var v = parseFloat(e.target.value); save(key, isNaN(v) ? null : v); }, style: Object.assign({}, NT_INP, { width: 90, marginBottom: 0 }) }));
  };
  return h('div', { style: Object.assign({}, NT_CARD, { margin: '0 14px 12px' }) },
    h('button', { onClick: function () { setOpen(!open); }, style: Object.assign({}, NT_GHOST, { width: '100%', textAlign: 'left' }) }, '⚙️ Health settings for ' + (props.name || pid) + (open ? ' ▲' : ' ▼')),
    open && h('div', { style: { marginTop: 10 } },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#26A69A', marginBottom: 4 } }, 'INSULIN HELPER — enter ONLY the numbers from the care team'),
      h('label', { style: { display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#fff', marginBottom: 8 } }, h('input', { type: 'checkbox', checked: !!dm.enabled, onChange: function (e) { save('enabled', e.target.checked); }, style: { width: 20, height: 20 } }), 'Turn on the insulin helper'),
      num('Carb ratio — grams of carbs per 1 unit', 'icr', 'e.g. 10'),
      num('Correction — mg/dL dropped by 1 unit', 'isf', 'e.g. 50'),
      num('Target blood sugar (mg/dL)', 'target', 'e.g. 120'),
      num('Maximum dose the app may show (units)', 'maxDose', 'safety cap'),
      num('Round doses to nearest (0.5 or 1)', 'rounding', '0.5'),
      num('Treat as LOW under (mg/dL)', 'lowBg', '70'),
      num('Warn as HIGH at or over (mg/dL)', 'highBg', '300'),
      h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', margin: '4px 0 10px', lineHeight: 1.5 } }, 'No numbers are pre-filled on purpose. Kids must have a parent check each dose before it can be logged. Does not track insulin on board.'),
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#FFB74D', marginBottom: 4 } }, 'DAILY FOOD TARGETS (optional — shows progress bars)'),
      [['cal', 'Calories'], ['carbs', 'Carbs (g)'], ['protein', 'Protein (g)'], ['fat', 'Fat (g)']].map(function (t) {
        return h('div', { key: t[0], style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 } }, h('div', { style: { flex: 1, fontSize: 11, color: '#ccc' } }, t[1]),
          h('input', { type: 'number', inputMode: 'decimal', key: pid + t[0] + (tg[t[0]] || ''), defaultValue: tg[t[0]] == null ? '' : tg[t[0]], onBlur: function (e) { saveT(t[0], e.target.value); }, style: Object.assign({}, NT_INP, { width: 90, marginBottom: 0 }) }));
      })));
}

// ── today's food totals ───────────────────────────────────────────────────────
function TodayNutrition(props) {
  var h = React.createElement;
  var tgS = ktUse('nutrition_targets/' + props.personId, {}), tg = tgS[0];
  var today = ntLocalDay();
  var meals = (props.entries || []).filter(function (e) { return (e.type === 'meal' || e.type === 'snack') && ntLocalDay(e.ts) === today; });
  var sum = function (k) { return meals.reduce(function (a, e) { return a + (parseFloat(e[k]) || 0); }, 0); };
  var rows = [['Carbs', 'carbs', 'g', '#FFB74D'], ['Protein', 'protein', 'g', '#42A5F5'], ['Fat', 'fat', 'g', '#AB47BC'], ['Calories', 'cal', '', '#66BB6A']];
  return h('div', { style: Object.assign({}, NT_CARD, { margin: '0 14px 12px' }) },
    h('div', { style: { fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: 1, marginBottom: 8 } }, '🥗 TODAY’S FOOD'),
    meals.length === 0 && h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.4)' } }, 'No meals or snacks logged yet today.'),
    meals.length > 0 && h('div', null,
      rows.map(function (r) {
        var v = sum(r[1]), t = parseFloat(tg[r[1]]), pct = t > 0 ? Math.min(100, Math.round(v / t * 100)) : null;
        return h('div', { key: r[1], style: { marginBottom: 7 } },
          h('div', { style: { display: 'flex', fontSize: 12, color: '#fff' } }, h('div', { style: { flex: 1, fontWeight: 700 } }, r[0]), h('div', null, ntR(v, r[1] === 'cal' ? 0 : 1) + r[2] + (t > 0 ? ' of ' + t + r[2] : ''))),
          pct != null && h('div', { style: { height: 6, borderRadius: 3, background: 'rgba(255,255,255,.1)', marginTop: 3, overflow: 'hidden' } }, h('div', { style: { width: pct + '%', height: '100%', background: r[3] } })));
      }),
      h('div', { style: { borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 6, paddingTop: 6 } },
        meals.slice().sort(function (a, b) { return a.ts - b.ts; }).map(function (e) {
          return h('div', { key: e.id, style: { display: 'flex', fontSize: 11, color: 'rgba(255,255,255,.65)', padding: '3px 0' } }, h('div', { style: { flex: 1 } }, new Date(e.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' · ' + (e.type === 'snack' ? 'Snack' : 'Meal')), h('div', null, (e.carbs ? e.carbs + ' g carbs' : '—') + (e.cal ? ' · ' + e.cal + ' cal' : '')));
        }))));
}
