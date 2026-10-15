// ═══ KITCHEN — recipes · weekly menu · grocery list · scannable pantry · step-by-step cooking ═══════════
// Everything here is synced through Firebase paths: recipes, kitchen_menu/<weekStart>, pantry, grocery, school/kitchen_log.
// Whatever is on the menu is what shows up in the Science Kitchen school assignment (see KitchenTodayCard).

// ── parsing helpers ───────────────────────────────────────────────────────────
var KT_UNITS = { cup: 'cup', cups: 'cup', c: 'cup', tablespoon: 'tbsp', tablespoons: 'tbsp', tbsp: 'tbsp', tbs: 'tbsp', tbsps: 'tbsp', teaspoon: 'tsp', teaspoons: 'tsp', tsp: 'tsp', tsps: 'tsp', ounce: 'oz', ounces: 'oz', oz: 'oz', pound: 'lb', pounds: 'lb', lb: 'lb', lbs: 'lb', gram: 'g', grams: 'g', g: 'g', kilogram: 'kg', kg: 'kg', milliliter: 'ml', ml: 'ml', liter: 'l', liters: 'l', l: 'l', clove: 'clove', cloves: 'clove', can: 'can', cans: 'can', pinch: 'pinch', dash: 'dash', slice: 'slice', slices: 'slice', package: 'pkg', packages: 'pkg', pkg: 'pkg', stick: 'stick', sticks: 'stick', bunch: 'bunch', head: 'head', quart: 'qt', quarts: 'qt', pint: 'pt', pints: 'pt', gallon: 'gal', gallons: 'gal' };
var KT_DESCRIPTORS = ['fresh', 'freshly', 'chopped', 'diced', 'minced', 'sliced', 'grated', 'shredded', 'crushed', 'large', 'small', 'medium', 'big', 'ripe', 'peeled', 'cut', 'into', 'pieces', 'finely', 'roughly', 'thinly', 'softened', 'melted', 'divided', 'optional', 'to', 'taste', 'or', 'and', 'of', 'for', 'the', 'a', 'an', 'plus', 'more', 'extra', 'virgin', 'low', 'sodium', 'organic', 'boneless', 'skinless', 'whole', 'cooked', 'uncooked', 'raw', 'packed', 'drained', 'rinsed', 'warm', 'cold', 'hot', 'room', 'temperature', 'about', 'cubed', 'halved', 'ground', 'dried', 'frozen', 'canned'];

function ktDay(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function ktWeekStart(d) { d = d ? new Date(d) : new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - d.getDay()); return ktDay(d); }
function ktAddDays(iso, n) { var d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return ktDay(d); }
function ktId(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

function ktNormFractions(s) {
  var map = { '½': ' 1/2', '¼': ' 1/4', '¾': ' 3/4', '⅓': ' 1/3', '⅔': ' 2/3', '⅛': ' 1/8', '⅜': ' 3/8', '⅝': ' 5/8', '⅞': ' 7/8' };
  return String(s).replace(/[½¼¾⅓⅔⅛⅜⅝⅞]/g, function (m) { return map[m]; });
}
function ktNum(str) {
  str = String(str).trim();
  var m;
  if ((m = str.match(/^(\d+)\s+(\d+)\/(\d+)$/))) return parseInt(m[1], 10) + parseInt(m[2], 10) / parseInt(m[3], 10);
  if ((m = str.match(/^(\d+)\/(\d+)$/))) return parseInt(m[1], 10) / parseInt(m[2], 10);
  var f = parseFloat(str); return isNaN(f) ? null : f;
}
function ktSingular(w) {
  if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + 'y';
  if (w.length > 4 && /(oes|ches|shes|sses)$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
  return w;
}
function ktTokens(name) {
  var s = String(name).toLowerCase().replace(/\([^)]*\)/g, ' ').split(',')[0].replace(/[^a-z\s]/g, ' ');
  var out = [];
  s.split(/\s+/).forEach(function (w) { if (!w) return; w = ktSingular(w); if (KT_DESCRIPTORS.indexOf(w) === -1 && KT_UNITS[w] == null) out.push(w); });
  return out;
}
function ktParseIngredient(line) {
  var raw = String(line).trim();
  var s = ktNormFractions(raw).replace(/^[-•*]\s*/, '').trim();
  var qty = null, unit = '', rest = s, m;
  m = s.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.?\d+)(?:\s*(?:-|–|to)\s*(?:\d+\s+\d+\/\d+|\d+\/\d+|\d*\.?\d+))?\s*(.*)$/i);
  if (m) {
    qty = ktNum(m[1]); rest = m[2];
    var um = rest.match(/^([A-Za-z]+)\.?\s*(.*)$/);
    if (um && KT_UNITS[um[1].toLowerCase()]) { unit = KT_UNITS[um[1].toLowerCase()]; rest = um[2]; }
    rest = rest.replace(/^of\s+/i, '');
  }
  var name = rest.replace(/\s+/g, ' ').trim() || raw;
  return { raw: raw, qty: qty, unit: unit, name: name, tokens: ktTokens(name) };
}
function ktFindTimer(text) {
  var m = String(text).match(/(\d+(?:\.\d+)?)(?:\s*(?:-|–|to)\s*(\d+(?:\.\d+)?))?\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)\b/i);
  if (!m) return null;
  var v = parseFloat(m[2] || m[1]), u = m[3].toLowerCase();
  if (/^h/.test(u)) v = v * 60; else if (/^s/.test(u)) v = v / 60;
  return Math.max(0.1, Math.round(v * 10) / 10);
}
// Turn any block of directions (a paragraph, numbered list, bullet list) into clean steps — each with a timer if it mentions a time.
function ktToSteps(text) {
  var t = String(text || '').replace(/\r/g, '').trim();
  if (!t) return [];
  var lines = t.split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean);
  if (lines.length <= 1) lines = t.replace(/([.!?])\s+(?=[A-Z0-9])/g, '$1\n').split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean);
  var steps = [];
  lines.forEach(function (l) {
    l = l.replace(/^(\d+\s*[.)]|step\s*\d+\s*[:.\-]?|[-•*])\s*/i, '').trim();
    if (!l) return;
    if (l.length > 200) {
      var sentences = l.replace(/([.!?])\s+(?=[A-Z0-9])/g, '$1\n').split(/\n+/), cur = '';
      sentences.forEach(function (sn) { if (cur && (cur + ' ' + sn).length > 160) { steps.push(cur); cur = sn; } else cur = cur ? cur + ' ' + sn : sn; });
      if (cur) steps.push(cur);
    } else steps.push(l);
  });
  return steps.map(function (s) { return { text: s, timerMin: ktFindTimer(s) }; });
}
function ktBuildRecipe(o) {
  var ings = (o.ingredients || []).map(function (i) { return typeof i === 'string' ? ktParseIngredient(i) : i; }).filter(function (i) { return i && i.raw; });
  var steps = o.steps && o.steps.length && typeof o.steps[0] === 'object' ? o.steps : ktToSteps(Array.isArray(o.steps) ? o.steps.join('\n') : (o.directionsText || ''));
  return { id: o.id || ktId('r'), title: (o.title || 'Untitled recipe').trim(), servings: o.servings || '', source: o.source || '', url: o.url || '', notes: o.notes || '', ingredients: ings, steps: steps, fav: !!o.fav, addedAt: o.addedAt || Date.now() };
}
function ktParseTextRecipe(text) {
  var lines = String(text).replace(/\r/g, '').split('\n').map(function (l) { return l.trim(); });
  var title = '', mode = '', ing = [], dir = [];
  lines.forEach(function (l, i) {
    if (!l) return;
    if (!title && !/^(ingredients?|directions?|instructions?|method|steps?)\b/i.test(l)) { title = l.replace(/^#+\s*/, ''); return; }
    if (/^ingredients?\b/i.test(l)) { mode = 'i'; return; }
    if (/^(directions?|instructions?|method|steps?|preparation)\b/i.test(l)) { mode = 'd'; return; }
    if (mode === 'i') ing.push(l);
    else if (mode === 'd') dir.push(l);
    else if (/^[-•*]?\s*(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.?\d+|[½¼¾⅓⅔])\s*[A-Za-z]/.test(l) && l.length < 90) ing.push(l);
    else dir.push(l);
  });
  return ktBuildRecipe({ title: title, ingredients: ing, directionsText: dir.join('\n') });
}
// schema.org Recipe from a web page's HTML
function ktRecipeFromHtml(html, url) {
  var re = /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi, m, found = null;
  function walk(n) {
    if (!n || found) return;
    if (Array.isArray(n)) { n.forEach(walk); return; }
    if (typeof n !== 'object') return;
    var t = n['@type']; if (t && (t === 'Recipe' || (Array.isArray(t) && t.indexOf('Recipe') !== -1))) { found = n; return; }
    if (n['@graph']) walk(n['@graph']);
  }
  while ((m = re.exec(html)) && !found) { try { walk(JSON.parse(m[1].trim())); } catch (e) {} }
  if (!found) return null;
  function stepText(x) {
    if (!x) return [];
    if (typeof x === 'string') return [x];
    if (Array.isArray(x)) return x.reduce(function (a, y) { return a.concat(stepText(y)); }, []);
    if (x.itemListElement) return stepText(x.itemListElement);
    return x.text ? [x.text] : (x.name ? [x.name] : []);
  }
  var strip = function (s) { return String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').trim(); };
  var yieldV = Array.isArray(found.recipeYield) ? found.recipeYield[0] : found.recipeYield;
  return ktBuildRecipe({ title: strip(found.name || ''), ingredients: (found.recipeIngredient || []).map(strip), directionsText: stepText(found.recipeInstructions).map(strip).join('\n'), servings: yieldV ? String(yieldV) : '', url: url, source: (function () { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } })() });
}
async function ktFetchPage(url) {
  var enc = encodeURIComponent(url), tries = [url, 'https://api.allorigins.win/raw?url=' + enc, 'https://corsproxy.io/?' + enc], last = null;
  for (var i = 0; i < tries.length; i++) {
    try { var r = await fetch(tries[i]); if (r.ok) { var t = await r.text(); if (t && t.length > 200) return t; } } catch (e) { last = e; }
  }
  throw last || new Error('Could not reach that page');
}
// Paprika export (.paprikarecipes) = zip of gzip'd JSON recipes
async function ktInflate(bytes, fmt) {
  var stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(fmt));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
async function ktReadPaprika(buf) {
  var u8 = new Uint8Array(buf), dv = new DataView(buf), out = [], eocd = -1, i;
  for (i = u8.length - 22; i >= 0 && i > u8.length - 70000; i--) { if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; } }
  if (eocd < 0) throw new Error('Not a Paprika export file');
  var count = dv.getUint16(eocd + 10, true), cd = dv.getUint32(eocd + 16, true), p = cd;
  for (var n = 0; n < count; n++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break;
    var method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
    p += 46 + nl + el + cl;
    var lnl = dv.getUint16(lo + 26, true), lel = dv.getUint16(lo + 28, true), start = lo + 30 + lnl + lel;
    var data = u8.slice(start, start + csize);
    try {
      if (method === 8) data = await ktInflate(data, 'deflate-raw');
      if (data[0] === 0x1f && data[1] === 0x8b) data = await ktInflate(data, 'gzip');
      var j = JSON.parse(new TextDecoder().decode(data));
      if (j && j.name) out.push(ktBuildRecipe({ title: j.name, ingredients: String(j.ingredients || '').split(/\n+/).filter(function (x) { return x.trim(); }), directionsText: j.directions || '', servings: j.servings || '', source: j.source || '', url: j.source_url || '', notes: j.notes || '' }));
    } catch (e) {}
  }
  return out;
}

// ── pantry matching ───────────────────────────────────────────────────────────
function ktPantryMatch(ing, pantry) {
  var it = ing.tokens || ktTokens(ing.name);
  if (!it.length) return null;
  var list = Object.values(pantry || {});
  for (var i = 0; i < list.length; i++) {
    var p = list[i]; if (!p || p.qty === 0) continue;
    var pt = p.tokens || ktTokens(p.name);
    if (!pt.length) continue;
    var a = it.every(function (w) { return pt.indexOf(w) !== -1; }), b = pt.every(function (w) { return it.indexOf(w) !== -1; });
    if (a || b) return p;
  }
  return null;
}
function ktHaveNeed(recipe, pantry) {
  var have = [], need = [];
  (recipe.ingredients || []).forEach(function (ing) { (ktPantryMatch(ing, pantry) ? have : need).push(ing); });
  return { have: have, need: need };
}

// ── storage places + fill levels ──────────────────────────────────────────────
var KT_DEFAULT_LOCS = [{ id: 'pantry', name: 'Pantry', icon: '🥫', order: 1 }, { id: 'fridge', name: 'Refrigerator', icon: '🧊', order: 2 }, { id: 'freezer', name: 'Freezer', icon: '❄️', order: 3 }];
var KT_LEVELS = [[0, 'Empty'], [0.25, '¼'], [0.5, '½'], [0.75, '¾'], [1, 'Full']];
function ktLocList(locs) {
  var l = Object.values(locs || {}).filter(function (x) { return x && x.name; });
  if (!l.length) l = KT_DEFAULT_LOCS;
  return l.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
}
function ktLocName(locs, id) {
  var l = ktLocList(locs), f = l.find(function (x) { return x.id === (id || l[0].id); });
  return f ? (f.icon || '📍') + ' ' + f.name : '';
}
function ktFracStr(q) {
  q = Number(q) || 0;
  if (q <= 0) return 'Empty';
  var whole = Math.floor(q + 0.125), frac = Math.round((q - whole) * 4) / 4;
  if (frac >= 1) { whole += 1; frac = 0; }
  var f = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' }[frac] || '';
  return (whole ? String(whole) : '') + f || '¼';
}

// ── data hook ─────────────────────────────────────────────────────────────────
// Offline (no Firebase): rebuild a path's value from this device's saved data, including child writes like habitsdone/<day>/<pid>/<item>
function ktLocal(path, fallback) {
  var base = null; try { base = syncGet(path); } catch (e) {}
  var out = (base && typeof base === 'object' && !Array.isArray(base)) ? JSON.parse(JSON.stringify(base)) : null;
  var any = false, bk = (typeof _backupData !== 'undefined' && _backupData) || {};
  Object.keys(bk).forEach(function (k) {
    if (k.indexOf(path + '/') !== 0) return;
    var parts = k.slice(path.length + 1).split('/'), v = bk[k];
    if (!out) out = {};
    var o = out;
    for (var i = 0; i < parts.length - 1; i++) { if (o[parts[i]] == null || typeof o[parts[i]] !== 'object') o[parts[i]] = {}; o = o[parts[i]]; }
    if (v == null) delete o[parts[parts.length - 1]]; else { o[parts[parts.length - 1]] = v; any = true; }
  });
  if (out && (any || base != null)) return out;
  return base != null ? base : fallback;
}
function ktUse(path, fallback) {
  var s = React.useState(function () { return (typeof db !== 'undefined' && db) ? fallback : ktLocal(path, fallback); });
  React.useEffect(function () {
    var u = null;
    try { u = syncOn(path, function (d) { s[1](d == null ? fallback : d); }, true); } catch (e) {}
    var loc = function (ev) {
      if (!ev || typeof ev.detail !== 'string') return;
      var d = ev.detail;
      if (d === path || d.indexOf(path + '/') === 0 || path.indexOf(d + '/') === 0) { if (!(typeof db !== 'undefined' && db)) s[1](ktLocal(path, fallback)); }
    };
    window.addEventListener('fm-local', loc);
    if (!(typeof db !== 'undefined' && db)) s[1](ktLocal(path, fallback));
    return function () { window.removeEventListener('fm-local', loc); if (typeof u === 'function') u(); };
  }, [path]);
  return s;
}

var KT_CARD = { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: 12, marginBottom: 10 };
var KT_INP = { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 10, color: '#fff', padding: '9px 10px', fontSize: 14, width: '100%', boxSizing: 'border-box', marginBottom: 6, fontFamily: 'inherit' };
function ktBtn(bg, fg) { return { background: bg, color: fg || '#000', border: 'none', borderRadius: 20, padding: '8px 14px', fontWeight: 800, fontSize: 12, cursor: 'pointer' }; }
var KT_GHOST = { background: 'transparent', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 20, padding: '6px 12px', fontSize: 11, cursor: 'pointer' };

// ── step timer ────────────────────────────────────────────────────────────────
function KitchenTimer(props) {
  var h = React.createElement;
  var total = Math.round(props.minutes * 60);
  var st = React.useState(total), left = st[0], setLeft = st[1];
  var rs = React.useState(false), running = rs[0], setRunning = rs[1];
  var ds = React.useState(false), done = ds[0], setDone = ds[1];
  React.useEffect(function () { setLeft(total); setRunning(false); setDone(false); }, [props.minutes, props.stepKey]);
  React.useEffect(function () { try { if (typeof tcLink === 'function' && window._currentPersonId) tcLink(window._currentPersonId, 'meals', 'Cooking timer', !!running); } catch (e) {} }, [running]);
  React.useEffect(function () {
    if (!running) return;
    var iv = setInterval(function () {
      setLeft(function (l) {
        if (l <= 1) { clearInterval(iv); setRunning(false); setDone(true); try { playSound('alert'); } catch (e) {} try { if (navigator.vibrate) navigator.vibrate([400, 150, 400, 150, 600]); } catch (e) {} return 0; }
        return l - 1;
      });
    }, 1000);
    return function () { clearInterval(iv); };
  }, [running]);
  var m = Math.floor(left / 60), s = left % 60;
  return h('div', { style: { textAlign: 'center', margin: '12px 0', padding: 12, borderRadius: 14, background: done ? 'rgba(76,175,130,.2)' : 'rgba(255,183,77,.1)', border: '1px solid ' + (done ? '#4CAF82' : 'rgba(255,183,77,.4)') } },
    h('div', { style: { fontSize: 38, fontWeight: 900, color: done ? '#4CAF82' : '#FFB74D', letterSpacing: 2 } }, done ? '⏰ Time’s up!' : ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2)),
    h('div', { style: { display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 } },
      !done && h('button', { onClick: function () { setRunning(!running); }, style: ktBtn(running ? '#EF5350' : '#FFB74D', running ? '#fff' : '#000') }, running ? '⏸ Pause' : (left < total ? '▶ Resume' : '▶ Start timer')),
      h('button', { onClick: function () { setLeft(total); setRunning(false); setDone(false); }, style: KT_GHOST }, 'Reset')));
}

// ── cook mode ─────────────────────────────────────────────────────────────────
function KitchenCook(props) {
  var h = React.createElement;
  var recipe = props.recipe, pantry = props.pantry || {};
  var is = React.useState(-1), idx = is[0], setIdx = is[1];     // -1 = gather ingredients
  var cs = React.useState({}), checked = cs[0], setChecked = cs[1];
  var ns = React.useState(''), note = ns[0], setNote = ns[1];
  var ds = React.useState(false), saved = ds[0], setSaved = ds[1];
  var steps = recipe.steps || [];
  var hn = ktHaveNeed(recipe, pantry);
  var pid = window._currentPersonId || props.studentId || 'unknown';
  var total = steps.length;
  function finish() {
    var rec = { rid: recipe.id, title: recipe.title, by: pid, ts: Date.now(), steps: total, note: note.trim() };
    try { syncSet('school/kitchen_log/' + pid + '/' + ktDay() + '/' + recipe.id, rec); } catch (e) {}
    setSaved(true);
  }
  var shell = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9000, background: '#12102a', overflowY: 'auto', padding: 16, paddingBottom: 60 };
  var head = h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 } },
    h('button', { onClick: props.onClose, style: KT_GHOST }, '✕ Close'),
    h('div', { style: { flex: 1, fontSize: 14, fontWeight: 900, color: '#fff' } }, '👩‍🍳 ' + recipe.title));
  if (saved) return h('div', { style: shell }, head, h('div', { style: { textAlign: 'center', padding: 30 } },
    h('div', { style: { fontSize: 60 } }, '🎉'), h('div', { style: { fontSize: 20, fontWeight: 900, color: '#4CAF82', margin: '8px 0' } }, 'Great cooking!'),
    h('div', { style: { color: 'rgba(255,255,255,.6)', fontSize: 13 } }, 'Your teacher can see you finished this recipe.'),
    h('button', { onClick: props.onClose, style: Object.assign({}, ktBtn('#C0CA33'), { marginTop: 18 }) }, 'Done')));
  return h('div', { style: shell }, head,
    h('div', { style: { height: 6, borderRadius: 3, background: 'rgba(255,255,255,.1)', marginBottom: 14, overflow: 'hidden' } }, h('div', { style: { width: (idx < 0 ? 0 : Math.round((idx + 1) / (total + 1) * 100)) + '%', height: '100%', background: '#4CAF82' } })),
    idx === -1 && h('div', null,
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', letterSpacing: 1, marginBottom: 6 } }, 'STEP 0 · GATHER YOUR INGREDIENTS'),
      h('div', { style: { fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 10 } }, '🏠 Shopping your pantry: ' + hn.have.length + ' of ' + (recipe.ingredients || []).length + ' ingredients on hand' + (hn.need.length ? ' · ' + hn.need.length + ' to get' : ' — you have everything!')),
      (recipe.ingredients || []).map(function (ing, i) {
        var has = ktPantryMatch(ing, pantry);
        return h('div', { key: i, onClick: function () { var c = Object.assign({}, checked); c[i] = !c[i]; setChecked(c); }, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,.07)', cursor: 'pointer', opacity: checked[i] ? .45 : 1 } },
          h('div', { style: { width: 24, height: 24, borderRadius: 6, border: '2px solid #4CAF82', background: checked[i] ? '#4CAF82' : 'transparent', color: '#000', textAlign: 'center', fontWeight: 900 } }, checked[i] ? '✓' : ''),
          h('div', { style: { flex: 1, fontSize: 15, color: '#fff', textDecoration: checked[i] ? 'line-through' : 'none' } }, ing.raw),
          h('div', { style: { fontSize: 10, fontWeight: 800, color: has ? '#4CAF82' : '#FFB74D', textAlign: 'right' } }, has ? '✅ ' + ktLocName(props.locs, has.loc) : '🛒 need'));
      }),
      h('button', { onClick: function () { setIdx(0); }, style: Object.assign({}, ktBtn('#4CAF82'), { width: '100%', padding: 14, fontSize: 15, marginTop: 14 }) }, 'Start cooking ›')),
    idx >= 0 && idx < total && h('div', null,
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', letterSpacing: 1, marginBottom: 8 } }, 'STEP ' + (idx + 1) + ' OF ' + total),
      h('div', { style: { fontSize: 22, color: '#fff', lineHeight: 1.5, fontWeight: 600, marginBottom: 8 } }, steps[idx].text),
      steps[idx].timerMin ? h(KitchenTimer, { minutes: steps[idx].timerMin, stepKey: idx }) : null,
      h('div', { style: { display: 'flex', gap: 10, marginTop: 18 } },
        h('button', { onClick: function () { setIdx(idx - 1); }, style: Object.assign({}, KT_GHOST, { flex: 1, padding: 14, fontSize: 14 }) }, '‹ Back'),
        h('button', { onClick: function () { setIdx(idx + 1); }, style: Object.assign({}, ktBtn('#4CAF82'), { flex: 2, padding: 14, fontSize: 15 }) }, idx === total - 1 ? 'Finish ›' : 'Next step ›'))),
    idx >= total && total >= 0 && idx !== -1 && h('div', null,
      h('div', { style: { fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 8 } }, '🧪 Kitchen science check'),
      h('div', { style: { fontSize: 13, color: 'rgba(255,255,255,.65)', marginBottom: 8 } }, 'What did you notice while cooking? (Heat, mixing, changes in texture, color or smell…)'),
      h('textarea', { rows: 4, value: note, onChange: function (e) { setNote(e.target.value); }, style: KT_INP, placeholder: 'I noticed…' }),
      h('button', { onClick: finish, style: Object.assign({}, ktBtn('#C0CA33'), { width: '100%', padding: 14, fontSize: 15 }) }, '✅ I finished cooking')));
}

// ── today's menu card for the school assignment ───────────────────────────────
function KitchenTodayCard(props) {
  var h = React.createElement;
  var ws = ktWeekStart(), di = new Date().getDay();
  var menuS = ktUse('kitchen_menu/' + ws, {}), menu = menuS[0];
  var recS = ktUse('recipes', {}), recipes = recS[0];
  var panS = ktUse('pantry', {}), pantry = panS[0];
  var locS = ktUse('pantry_locations', {}), locs = locS[0];
  var cooking = React.useState(null), cook = cooking[0], setCook = cooking[1];
  var day = (menu.days && menu.days[di]) || {};
  var meals = [['breakfast', '🌅 Breakfast'], ['lunch', '🥪 Lunch'], ['dinner', '🍽 Dinner'], ['snack', '🍎 Snack']];
  var items = meals.map(function (m) { var e = day[m[0]]; return e ? { slot: m[1], e: e, r: e.rid ? recipes[e.rid] : null } : null; }).filter(Boolean);
  return h('div', { style: { background: 'rgba(255,183,77,.08)', border: '1px solid rgba(255,183,77,.35)', borderRadius: 12, padding: 12, marginBottom: 12 } },
    h('div', { style: { fontSize: 11, fontWeight: 800, color: '#FFB74D', marginBottom: 2 } }, '🍳 TODAY’S MENU — this is your cooking assignment'),
    h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.5)', marginBottom: 8 } }, 'Cook what is on the family menu. Check the pantry first, then follow the steps.'),
    items.length === 0 && h('div', { style: { fontSize: 12, color: 'rgba(255,255,255,.45)' } }, 'No menu planned for today yet. Ask an admin to add meals in 🍳 Kitchen → Menu.'),
    items.map(function (it, i) {
      var hn = it.r ? ktHaveNeed(it.r, pantry) : null;
      return h('div', { key: i, style: { padding: '8px 0', borderTop: i ? '1px solid rgba(255,255,255,.08)' : 'none' } },
        h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)' } }, it.slot),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
          h('div', { style: { flex: 1, fontSize: 14, fontWeight: 800, color: '#fff' } }, it.e.title || (it.r && it.r.title)),
          hn && h('div', { style: { fontSize: 10, fontWeight: 800, color: hn.need.length ? '#FFB74D' : '#4CAF82' } }, hn.need.length ? '🛒 need ' + hn.need.length : '✅ all in pantry'),
          it.r && it.r.steps && it.r.steps.length > 0 && h('button', { onClick: function () { setCook(it.r); }, style: ktBtn('#FFB74D') }, '👩‍🍳 Cook it')),
        !it.r && h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)' } }, 'No recipe attached yet — ask an admin to add one.'));
    }),
    cook && h(KitchenCook, { recipe: cook, pantry: pantry, locs: locs, studentId: props.studentId, onClose: function () { setCook(null); } }));
}

// ── main module ───────────────────────────────────────────────────────────────
function KitchenModule(props) {
  var h = React.createElement;
  var isAdmin = !!props.isAdmin;
  var tabS = React.useState('smart'), tab = tabS[0], setTab = tabS[1];
  var wsS = React.useState(ktWeekStart()), week = wsS[0], setWeek = wsS[1];
  var recS = ktUse('recipes', {}), recipes = recS[0], setRecipes = recS[1];
  var panS = ktUse('pantry', {}), pantry = panS[0], setPantry = panS[1];
  var menuS = ktUse('kitchen_menu/' + week, {}), menu = menuS[0], setMenu = menuS[1];
  var chkS = ktUse('grocery/checked/' + week, {}), gChecked = chkS[0], setGChecked = chkS[1];
  var exS = ktUse('grocery/extra', {}), gExtra = exS[0], setGExtra = exS[1];
  var logS = ktUse('school/kitchen_log', {}), kLog = logS[0];
  var locS = ktUse('pantry_locations', {}), locs = locS[0], setLocs = locS[1];
  var cookS = React.useState(null), cook = cookS[0], setCook = cookS[1];
  var openS = React.useState(null), openRec = openS[0], setOpenRec = openS[1];
  var msgS = React.useState(''), msg = msgS[0], setMsg = msgS[1];
  var say = function (t) { setMsg(t); setTimeout(function () { setMsg(''); }, 3500); };

  var recList = Object.values(recipes).sort(function (a, b) { return (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || (b.addedAt || 0) - (a.addedAt || 0); });
  function saveRecipe(r) { var n = Object.assign({}, recipes); n[r.id] = r; setRecipes(n); syncSet('recipes/' + r.id, r); }
  function delRecipe(id) { var n = Object.assign({}, recipes); delete n[id]; setRecipes(n); syncSet('recipes/' + id, null); setOpenRec(null); }
  function savePantry(it) { var n = Object.assign({}, pantry); n[it.id] = it; setPantry(n); syncSet('pantry/' + it.id, it); }
  function saveLoc(l) { var n = Object.assign({}, locs); if (!Object.keys(n).length) KT_DEFAULT_LOCS.forEach(function (d) { n[d.id] = d; syncSet('pantry_locations/' + d.id, d); }); n[l.id] = l; setLocs(n); syncSet('pantry_locations/' + l.id, l); }
  function delLoc(id) { var n = Object.assign({}, locs); if (!Object.keys(n).length) KT_DEFAULT_LOCS.forEach(function (d) { n[d.id] = d; }); delete n[id]; setLocs(n); syncSet('pantry_locations/' + id, null); }
  function delPantry(id) { var n = Object.assign({}, pantry); delete n[id]; setPantry(n); syncSet('pantry/' + id, null); }

  var tabs = [['smart', '🧠 Smart Menu'], ['kids', '👩‍🍳 Kids’ Menu Challenge'], ['hosp', '🤝 Fun & Hospitality'], ['menu', '🗓 Week at a glance'], ['recipes', '📖 Recipes (' + recList.length + ')'], ['grocery', '🛒 Grocery'], ['pantry', '🥫 Pantry']];

  return h('div', { style: { padding: 14, paddingBottom: 90 } },
    h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 2 } }, '🍳 Kitchen'),
    h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', marginBottom: 10 } }, 'Menu · recipes · groceries · pantry — all linked to the Science Kitchen school assignment'),
    msg && h('div', { style: { background: 'rgba(76,175,130,.15)', color: '#9be5bd', borderRadius: 10, padding: '8px 12px', fontSize: 12, marginBottom: 10 } }, msg),
    h('div', { style: { display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 12 } },
      tabs.map(function (t) { return h('button', { key: t[0], onClick: function () { setTab(t[0]); setOpenRec(null); }, style: { flexShrink: 0, padding: '8px 12px', border: 'none', borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: 'pointer', background: tab === t[0] ? '#FFB74D' : 'rgba(255,255,255,.07)', color: tab === t[0] ? '#000' : 'rgba(255,255,255,.55)' } }, t[1]); })),

    tab === 'menu' && h(KitchenMenu, { isAdmin: isAdmin, locs: locs, week: week, setWeek: setWeek, menu: menu, setMenu: setMenu, recipes: recipes, recList: recList, pantry: pantry, kLog: kLog, onCook: setCook, family: props.family }),
    tab === 'hosp' && (typeof KitchenFunTab === 'function' ? h(KitchenFunTab, { isAdmin: isAdmin, personId: props.personId, family: props.family }) : null),
    tab === 'kids' && (typeof KitchenChallenge === 'function' ? h(KitchenChallenge, { isAdmin: isAdmin, personId: props.personId, family: props.family }) : null),
    tab === 'smart' && (typeof SmartMenu === 'function' ? h(SmartMenu, { isAdmin: isAdmin }) : null),
    tab === 'recipes' && h(KitchenRecipes, { isAdmin: isAdmin, locs: locs, recList: recList, pantry: pantry, openRec: openRec, setOpenRec: setOpenRec, saveRecipe: saveRecipe, delRecipe: delRecipe, onCook: setCook, say: say }),
    tab === 'grocery' && h(KitchenGrocery, { isAdmin: isAdmin, locs: locs, week: week, setWeek: setWeek, menu: menu, recipes: recipes, pantry: pantry, savePantry: savePantry, checked: gChecked, setChecked: setGChecked, extra: gExtra, setExtra: setGExtra, say: say }),
    tab === 'pantry' && h(KitchenPantry, { isAdmin: isAdmin, locs: locs, saveLoc: saveLoc, delLoc: delLoc, pantry: pantry, savePantry: savePantry, delPantry: delPantry, say: say }),
    tab === 'sales' && (typeof WeeklyMenuReview === 'function' ? h(WeeklyMenuReview, { isAdmin: isAdmin }) : null),
    cook && h(KitchenCook, { recipe: cook, pantry: pantry, locs: locs, studentId: props.personId, onClose: function () { setCook(null); } }));
}

// ── weekly menu ───────────────────────────────────────────────────────────────
function KitchenMenu(props) {
  var h = React.createElement;
  var DN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MEALS = [['breakfast', '🌅 Breakfast'], ['lunch', '🥪 Lunch'], ['dinner', '🍽 Dinner'], ['snack', '🍎 Snack']];
  var pS = React.useState(null), pick = pS[0], setPick = pS[1];       // {day, meal}
  var tS = React.useState(''), txt = tS[0], setTxt = tS[1];
  var today = ktDay(), days = props.menu.days || {};
  function setSlot(di, meal, entry) {
    var m = Object.assign({}, props.menu); m.days = Object.assign({}, days); m.days[di] = Object.assign({}, days[di] || {});
    if (entry) m.days[di][meal] = entry; else delete m.days[di][meal];
    props.setMenu(m);
    syncSet('kitchen_menu/' + props.week + '/days/' + di + '/' + meal, entry || null);
    setPick(null); setTxt('');
  }
  var wl = new Date(props.week + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  var todayDoneBy = {};
  Object.keys(props.kLog || {}).forEach(function (pid) { var d = (props.kLog[pid] || {})[today] || {}; Object.keys(d).forEach(function (rid) { (todayDoneBy[rid] = todayDoneBy[rid] || []).push(pid); }); });
  var fname = function (pid) { return ((props.family || []).find(function (p) { return p.id === pid; }) || {}).name || pid; };
  return h('div', null,
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 } },
      h('button', { onClick: function () { props.setWeek(ktAddDays(props.week, -7)); }, style: KT_GHOST }, '‹'),
      h('div', { style: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 800, color: '#fff' } }, 'Week of ' + wl),
      h('button', { onClick: function () { props.setWeek(ktAddDays(props.week, 7)); }, style: KT_GHOST }, '›'),
      props.week !== ktWeekStart() && h('button', { onClick: function () { props.setWeek(ktWeekStart()); }, style: ktBtn('#F6BF26') }, 'This week')),
    !props.isAdmin && h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 8 } }, 'Only an admin can change the menu. Tap 👩‍🍳 to cook a meal.'),
    DN.map(function (name, di) {
      var iso = ktAddDays(props.week, di), isToday = iso === today;
      return h('div', { key: di, style: Object.assign({}, KT_CARD, { border: '1px solid ' + (isToday ? '#FFB74D' : 'rgba(255,255,255,.1)'), background: isToday ? 'rgba(255,183,77,.07)' : 'rgba(255,255,255,.05)' }) },
        h('div', { style: { fontSize: 12, fontWeight: 900, color: isToday ? '#FFB74D' : '#fff', marginBottom: 6 } }, name + ' · ' + new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + (isToday ? ' · TODAY' : '')),
        MEALS.map(function (m) {
          var e = (days[di] || {})[m[0]], r = e && e.rid ? props.recipes[e.rid] : null;
          var open = pick && pick.day === di && pick.meal === m[0];
          var done = e && e.rid && isToday ? todayDoneBy[e.rid] : null;
          return h('div', { key: m[0], style: { padding: '6px 0', borderTop: '1px solid rgba(255,255,255,.06)' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
              h('div', { style: { width: 86, fontSize: 10, color: 'rgba(255,255,255,.45)' } }, m[1]),
              h('div', { style: { flex: 1, minWidth: 120, fontSize: 13, color: e ? '#fff' : 'rgba(255,255,255,.3)', fontWeight: e ? 700 : 400 } }, e ? (e.title || (r && r.title)) : '—'),
              done && h('div', { style: { fontSize: 9, color: '#4CAF82', fontWeight: 800 } }, '✅ ' + done.map(fname).join(', ')),
              r && r.steps && r.steps.length > 0 && h('button', { onClick: function () { props.onCook(r); }, style: ktBtn('#FFB74D') }, '👩‍🍳'),
              props.isAdmin && h('button', { onClick: function () { setPick(open ? null : { day: di, meal: m[0] }); setTxt(''); }, style: KT_GHOST }, e ? '✏️' : '＋'),
              props.isAdmin && e && h('button', { onClick: function () { setSlot(di, m[0], null); }, style: Object.assign({}, KT_GHOST, { color: '#EF5350' }) }, '✕')),
            open && h('div', { style: { marginTop: 6, padding: 8, background: 'rgba(0,0,0,.25)', borderRadius: 10 } },
              h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.5)', marginBottom: 4 } }, 'Pick from your recipes:'),
              h('div', { style: { maxHeight: 150, overflowY: 'auto', marginBottom: 6 } },
                props.recList.length === 0 && h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.4)' } }, 'No recipes yet — add some in the Recipes tab.'),
                props.recList.map(function (rc) { return h('div', { key: rc.id, onClick: function () { setSlot(di, m[0], { rid: rc.id, title: rc.title }); }, style: { padding: '8px 6px', fontSize: 13, color: '#fff', borderBottom: '1px solid rgba(255,255,255,.06)', cursor: 'pointer' } }, (rc.fav ? '⭐ ' : '') + rc.title); })),
              h('div', { style: { display: 'flex', gap: 6 } },
                h('input', { type: 'text', value: txt, onChange: function (ev) { setTxt(ev.target.value); }, placeholder: 'Or type a meal (no recipe)', style: Object.assign({}, KT_INP, { marginBottom: 0 }) }),
                h('button', { onClick: function () { if (txt.trim()) setSlot(di, m[0], { title: txt.trim() }); }, style: ktBtn('#C0CA33') }, 'Add'))));
        }));
    }));
}

// ── recipes ───────────────────────────────────────────────────────────────────
function KitchenRecipes(props) {
  var h = React.createElement;
  var qS = React.useState(''), q = qS[0], setQ = qS[1];
  var mS = React.useState(null), mode = mS[0], setMode = mS[1];      // null | text | url | paprika
  var xS = React.useState(''), text = xS[0], setText = xS[1];
  var uS = React.useState(''), url = uS[0], setUrl = uS[1];
  var bS = React.useState(false), busy = bS[0], setBusy = bS[1];
  var dS = React.useState(null), draft = dS[0], setDraft = dS[1];     // preview before saving
  var sS = React.useState(''), search = sS[0], setSearch = sS[1];
  var eS = React.useState(false), editing = eS[0], setEditing = eS[1];

  function startText() { if (!text.trim()) return; setDraft(ktParseTextRecipe(text)); }
  async function fetchUrl() {
    if (!url.trim()) return;
    setBusy(true);
    try {
      var html = await ktFetchPage(url.trim());
      var r = ktRecipeFromHtml(html, url.trim());
      if (!r || !r.ingredients.length) { props.say('That page has no readable recipe. Copy the recipe text and use “Paste text” instead.'); }
      else setDraft(r);
    } catch (e) { props.say('Could not open that link. Copy the recipe text and use “Paste text” instead.'); }
    setBusy(false);
  }
  async function readFile(ev) {
    var f = ev.target.files && ev.target.files[0]; if (!f) return;
    setBusy(true);
    try {
      var list = await ktReadPaprika(await f.arrayBuffer());
      if (!list.length) props.say('No recipes found in that file.');
      else { list.forEach(function (r) { props.saveRecipe(r); }); props.say('✅ Imported ' + list.length + ' recipes from Paprika.'); setMode(null); }
    } catch (e) { props.say('Could not read that file. In Paprika choose Settings → Export Recipes → .paprikarecipes.'); }
    setBusy(false); ev.target.value = '';
  }

  // detail
  if (props.openRec) {
    var r = props.openRec, hn = ktHaveNeed(r, props.pantry);
    return h('div', null,
      h('button', { onClick: function () { props.setOpenRec(null); setEditing(false); }, style: Object.assign({}, KT_GHOST, { marginBottom: 10 }) }, '‹ All recipes'),
      h('div', { style: KT_CARD },
        h('div', { style: { fontSize: 18, fontWeight: 900, color: '#fff' } }, r.title),
        h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', margin: '2px 0 8px' } }, [r.servings && 'Serves ' + r.servings, r.source].filter(Boolean).join(' · ')),
        h('div', { style: { fontSize: 12, fontWeight: 800, color: hn.need.length ? '#FFB74D' : '#4CAF82', marginBottom: 8 } }, '🏠 Pantry check: ' + hn.have.length + ' on hand' + (hn.need.length ? ', ' + hn.need.length + ' to buy' : ' — you have everything!')),
        h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
          r.steps.length > 0 && h('button', { onClick: function () { props.onCook(r); }, style: ktBtn('#FFB74D') }, '👩‍🍳 Cook step-by-step'),
          h('button', { onClick: function () { props.saveRecipe(Object.assign({}, r, { fav: !r.fav })); props.setOpenRec(Object.assign({}, r, { fav: !r.fav })); }, style: KT_GHOST }, r.fav ? '⭐ Saved' : '☆ Save for later'),
          r.url && h('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer', style: Object.assign({}, KT_GHOST, { textDecoration: 'none' }) }, 'Original ›'),
          props.isAdmin && h('button', { onClick: function () { setEditing(!editing); }, style: KT_GHOST }, '✏️ Edit'),
          props.isAdmin && h('button', { onClick: function () { props.delRecipe(r.id); }, style: Object.assign({}, KT_GHOST, { color: '#EF5350' }) }, '🗑 Delete'))),
      editing ? h(KitchenRecipeEditor, { recipe: r, onSave: function (nr) { props.saveRecipe(nr); props.setOpenRec(nr); setEditing(false); props.say('Saved.'); }, onCancel: function () { setEditing(false); } }) : h('div', null,
        h('div', { style: KT_CARD }, h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', marginBottom: 6 } }, 'INGREDIENTS'),
          r.ingredients.map(function (ing, i) { var has = ktPantryMatch(ing, props.pantry); return h('div', { key: i, style: { display: 'flex', gap: 8, padding: '5px 0', fontSize: 13, color: '#fff' } }, h('div', { style: { flex: 1 } }, ing.raw), h('div', { style: { fontSize: 10, color: has ? '#4CAF82' : '#FFB74D', fontWeight: 800 } }, has ? '✅ ' + ktLocName(props.locs, has.loc) : '🛒')); })),
        h('div', { style: KT_CARD }, h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', marginBottom: 6 } }, 'STEPS'),
          r.steps.map(function (s, i) { return h('div', { key: i, style: { padding: '7px 0', fontSize: 13, color: '#fff', lineHeight: 1.5, borderBottom: '1px solid rgba(255,255,255,.06)' } }, h('b', null, (i + 1) + '. '), s.text, s.timerMin ? h('span', { style: { color: '#FFB74D', fontSize: 11 } }, '  ⏱ ' + s.timerMin + ' min') : null); }))));
  }

  var shown = props.recList.filter(function (r) { return !q || r.title.toLowerCase().indexOf(q.toLowerCase()) !== -1; });
  return h('div', null,
    props.isAdmin && h('div', { style: KT_CARD },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#FFB74D', marginBottom: 6 } }, 'ADD A RECIPE'),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 } },
        [['text', '📋 Paste text'], ['url', '🔗 From web link'], ['paprika', '🌶 Paprika file']].map(function (m) { return h('button', { key: m[0], onClick: function () { setMode(mode === m[0] ? null : m[0]); setDraft(null); }, style: ktBtn(mode === m[0] ? '#FFB74D' : 'rgba(255,255,255,.1)', mode === m[0] ? '#000' : '#ccc') }, m[1]); })),
      h('div', { style: { display: 'flex', gap: 6, marginBottom: 6 } },
        h('input', { type: 'text', value: search, onChange: function (e) { setSearch(e.target.value); }, placeholder: 'Find recipes online…', style: Object.assign({}, KT_INP, { marginBottom: 0 }) }),
        h('button', { onClick: function () { if (search.trim()) window.open('https://www.google.com/search?q=' + encodeURIComponent(search.trim() + ' recipe'), '_blank'); }, style: ktBtn('#42A5F5') }, '🔎 Search')),
      h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)' } }, 'Find one you like, copy its link, then use “From web link”.'),
      mode === 'text' && h('div', { style: { marginTop: 8 } }, h('textarea', { rows: 8, value: text, onChange: function (e) { setText(e.target.value); }, placeholder: 'Paste a recipe here (title, then Ingredients, then Directions). Paprika’s “Share → Copy” works too.', style: KT_INP }), h('button', { onClick: startText, style: ktBtn('#C0CA33') }, 'Convert to step-by-step')),
      mode === 'url' && h('div', { style: { marginTop: 8 } }, h('input', { type: 'url', value: url, onChange: function (e) { setUrl(e.target.value); }, placeholder: 'https://…', style: KT_INP }), h('button', { onClick: fetchUrl, disabled: busy, style: ktBtn('#C0CA33') }, busy ? 'Reading…' : 'Get recipe'), h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.35)', marginTop: 4 } }, 'Some sites block this. Then copy the recipe text and use “Paste text”. The page address is sent through a free public relay service to read the page.')),
      mode === 'paprika' && h('div', { style: { marginTop: 8 } }, h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.6)', marginBottom: 6, lineHeight: 1.5 } }, 'Paprika has no live connection to other apps. In Paprika: Settings → Export Recipes → “Paprika Recipe Format” (.paprikarecipes). Save the file, then choose it here. Re-import any time to pick up new recipes.'), h('input', { type: 'file', accept: '.paprikarecipes,.zip', onChange: readFile, style: { color: '#fff', fontSize: 12 } }), busy && h('div', { style: { color: '#FFB74D', fontSize: 12, marginTop: 6 } }, 'Importing…'))),
    draft && h('div', { style: Object.assign({}, KT_CARD, { border: '2px solid #C0CA33' }) },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#C0CA33', marginBottom: 6 } }, 'CHECK THIS BEFORE SAVING'),
      h(KitchenRecipeEditor, { recipe: draft, onSave: function (nr) { props.saveRecipe(nr); setDraft(null); setMode(null); setText(''); setUrl(''); props.say('✅ Recipe saved.'); }, onCancel: function () { setDraft(null); } })),
    h('input', { type: 'text', value: q, onChange: function (e) { setQ(e.target.value); }, placeholder: 'Search my recipes…', style: KT_INP }),
    shown.length === 0 && h('div', { style: { textAlign: 'center', color: 'rgba(255,255,255,.4)', fontSize: 12, padding: 24 } }, 'No recipes yet.' + (props.isAdmin ? ' Add one above.' : '')),
    shown.map(function (r) { var hn = ktHaveNeed(r, props.pantry); return h('div', { key: r.id, onClick: function () { props.setOpenRec(r); }, style: Object.assign({}, KT_CARD, { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }) }, h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 14, fontWeight: 800, color: '#fff' } }, (r.fav ? '⭐ ' : '') + r.title), h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)' } }, r.ingredients.length + ' ingredients · ' + r.steps.length + ' steps')), h('div', { style: { fontSize: 10, fontWeight: 800, color: hn.need.length ? '#FFB74D' : '#4CAF82' } }, hn.need.length ? '🛒 ' + hn.need.length : '✅')); }));
}

function KitchenRecipeEditor(props) {
  var h = React.createElement, r = props.recipe;
  var tS = React.useState(r.title), title = tS[0], setTitle = tS[1];
  var sS = React.useState(r.servings || ''), servings = sS[0], setServings = sS[1];
  var iS = React.useState((r.ingredients || []).map(function (i) { return i.raw; }).join('\n')), ings = iS[0], setIngs = iS[1];
  var dS = React.useState((r.steps || []).map(function (s) { return s.text; }).join('\n')), dirs = dS[0], setDirs = dS[1];
  var steps = ktToSteps(dirs);
  return h('div', null,
    h('input', { type: 'text', value: title, onChange: function (e) { setTitle(e.target.value); }, placeholder: 'Recipe name', style: KT_INP }),
    h('input', { type: 'text', value: servings, onChange: function (e) { setServings(e.target.value); }, placeholder: 'Servings', style: KT_INP }),
    h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', marginBottom: 3 } }, 'INGREDIENTS (one per line)'),
    h('textarea', { rows: 6, value: ings, onChange: function (e) { setIngs(e.target.value); }, style: KT_INP }),
    h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', marginBottom: 3 } }, 'DIRECTIONS (any format — it becomes numbered steps with timers)'),
    h('textarea', { rows: 6, value: dirs, onChange: function (e) { setDirs(e.target.value); }, style: KT_INP }),
    h('div', { style: { fontSize: 11, color: '#4CAF82', marginBottom: 8 } }, steps.length + ' steps · ' + steps.filter(function (s) { return s.timerMin; }).length + ' with timers'),
    h('div', { style: { display: 'flex', gap: 8 } },
      h('button', { onClick: function () { props.onSave(ktBuildRecipe({ id: r.id, title: title, servings: servings, source: r.source, url: r.url, notes: r.notes, fav: r.fav, addedAt: r.addedAt, ingredients: ings.split(/\n+/).filter(function (x) { return x.trim(); }), steps: steps })); }, style: ktBtn('#C0CA33') }, 'Save recipe'),
      h('button', { onClick: props.onCancel, style: KT_GHOST }, 'Cancel')));
}

// ── grocery list ──────────────────────────────────────────────────────────────
function KitchenGrocery(props) {
  var h = React.createElement;
  var xS = React.useState(''), newItem = xS[0], setNewItem = xS[1];
  var days = (props.menu && props.menu.days) || {};
  var agg = {}, noRecipe = [];
  Object.keys(days).forEach(function (di) {
    Object.keys(days[di] || {}).forEach(function (meal) {
      var e = days[di][meal]; if (!e) return;
      var r = e.rid ? props.recipes[e.rid] : null;
      if (!r) { noRecipe.push(e.title); return; }
      (r.ingredients || []).forEach(function (ing) {
        var key = (ing.tokens && ing.tokens.length ? ing.tokens.join(' ') : ing.name.toLowerCase()) + '|' + (ing.unit || '');
        if (!agg[key]) agg[key] = { key: key, name: ing.name, unit: ing.unit, qty: 0, hasQty: true, ing: ing, from: [] };
        if (ing.qty == null) agg[key].hasQty = false; else agg[key].qty += ing.qty;
        if (agg[key].from.indexOf(r.title) === -1) agg[key].from.push(r.title);
      });
    });
  });
  var all = Object.values(agg).map(function (a) { a.pantry = ktPantryMatch(a.ing, props.pantry); return a; });
  var need = all.filter(function (a) { return !a.pantry; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  var have = all.filter(function (a) { return a.pantry; });
  var extras = Object.values(props.extra || {});
  var restock = Object.values(props.pantry || {}).filter(function (p) { return p && (p.qty || 0) <= 0.25; }).sort(function (a, b) { return (a.qty || 0) - (b.qty || 0) || a.name.localeCompare(b.name); });
  var label = function (a) { return (a.hasQty && a.qty ? (Math.round(a.qty * 100) / 100) + (a.unit ? ' ' + a.unit : '') + ' ' : '') + a.name; };
  function toggle(key) { var n = Object.assign({}, props.checked); if (n[key]) delete n[key]; else n[key] = true; props.setChecked(n); syncSet('grocery/checked/' + props.week + '/' + key.replace(/[.#$\[\]\/]/g, '_'), n[key] ? true : null); }
  function addExtra() { if (!newItem.trim()) return; var id = ktId('g'), it = { id: id, name: newItem.trim() }, n = Object.assign({}, props.extra); n[id] = it; props.setExtra(n); syncSet('grocery/extra/' + id, it); setNewItem(''); }
  function delExtra(id) { var n = Object.assign({}, props.extra); delete n[id]; props.setExtra(n); syncSet('grocery/extra/' + id, null); }
  var ck = function (k) { return !!props.checked[k.replace(/[.#$\[\]\/]/g, '_')]; };
  function plain() { return 'Grocery list — week of ' + props.week + '\n' + need.map(function (a) { return '• ' + label(a); }).concat(restock.map(function (p) { return '• ' + p.name + ' (' + ((p.qty || 0) <= 0 ? 'out' : 'low') + ')'; })).concat(extras.map(function (e) { return '• ' + e.name; })).join('\n'); }
  function copy() { try { navigator.clipboard.writeText(plain()); props.say('Copied — paste it into a text or note.'); } catch (e) { props.say('Could not copy.'); } }
  function share() { if (navigator.share) navigator.share({ title: 'Grocery list', text: plain() }).catch(function () {}); else copy(); }
  function boughtToPantry() {
    var n = 0;
    restock.forEach(function (p) { var k = 'restock_' + p.id; if (ck(k)) { props.savePantry(Object.assign({}, p, { qty: 1 })); n++; toggle(k); } });
    need.forEach(function (a) { if (ck(a.key)) { props.savePantry({ id: ktId('p'), name: a.name, qty: a.hasQty && a.qty ? a.qty : 1, unit: a.unit || '', tokens: ktTokens(a.name), addedAt: Date.now() }); n++; toggle(a.key); } });
    props.say(n ? '✅ ' + n + ' items added to the pantry.' : 'Check off what you bought first.');
  }
  return h('div', null,
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 } },
      h('button', { onClick: function () { props.setWeek(ktAddDays(props.week, -7)); }, style: KT_GHOST }, '‹'),
      h('div', { style: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 800, color: '#fff' } }, 'Week of ' + new Date(props.week + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      h('button', { onClick: function () { props.setWeek(ktAddDays(props.week, 7)); }, style: KT_GHOST }, '›')),
    h('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.55)', marginBottom: 8 } }, 'Built from this week’s menu, minus what’s already in the pantry.'),
    noRecipe.length > 0 && h('div', { style: { fontSize: 10, color: '#FFB74D', marginBottom: 8 } }, '⚠️ No recipe attached, so not on the list: ' + noRecipe.join(', ')),
    restock.length > 0 && h('div', { style: Object.assign({}, KT_CARD, { border: '1px solid rgba(239,83,80,.5)' }) },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#EF5350', marginBottom: 6 } }, '⚠️ EMPTY OR RUNNING LOW IN THE HOUSE (' + restock.length + ')'),
      restock.map(function (p) { var k = 'restock_' + p.id, c = ck(k); return h('div', { key: p.id, onClick: function () { toggle(k); }, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 4px', borderBottom: '1px solid rgba(255,255,255,.06)', cursor: 'pointer', opacity: c ? .45 : 1 } }, h('div', { style: { width: 22, height: 22, borderRadius: 6, border: '2px solid #EF5350', background: c ? '#EF5350' : 'transparent', textAlign: 'center', color: '#fff', fontWeight: 900 } }, c ? '✓' : ''), h('div', { style: { flex: 1, fontSize: 14, color: '#fff' } }, p.name), h('div', { style: { fontSize: 10, fontWeight: 800, color: '#EF5350' } }, (p.qty || 0) <= 0 ? 'EMPTY' : ktFracStr(p.qty) + ' left')); })),
    h('div', { style: KT_CARD },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#FFB74D', marginBottom: 6 } }, '🛒 TO BUY (' + need.length + ')'),
      need.length === 0 && h('div', { style: { fontSize: 12, color: 'rgba(255,255,255,.45)' } }, 'Nothing needed — add meals with recipes to the menu.'),
      need.map(function (a) { var c = ck(a.key); return h('div', { key: a.key, onClick: function () { toggle(a.key); }, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 4px', borderBottom: '1px solid rgba(255,255,255,.06)', cursor: 'pointer', opacity: c ? .45 : 1 } }, h('div', { style: { width: 22, height: 22, borderRadius: 6, border: '2px solid #FFB74D', background: c ? '#FFB74D' : 'transparent', textAlign: 'center', color: '#000', fontWeight: 900 } }, c ? '✓' : ''), h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 14, color: '#fff', textDecoration: c ? 'line-through' : 'none' } }, label(a)), h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.35)' } }, a.from.join(', ')))); }),
      extras.map(function (e) { return h('div', { key: e.id, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 4px', borderBottom: '1px solid rgba(255,255,255,.06)' } }, h('div', { style: { flex: 1, fontSize: 14, color: '#fff' } }, '＋ ' + e.name), props.isAdmin && h('button', { onClick: function () { delExtra(e.id); }, style: KT_GHOST }, '✕')); }),
      h('div', { style: { display: 'flex', gap: 6, marginTop: 8 } },
        h('input', { type: 'text', value: newItem, onChange: function (e) { setNewItem(e.target.value); }, placeholder: 'Add something else (paper towels…)', style: Object.assign({}, KT_INP, { marginBottom: 0 }) }),
        h('button', { onClick: addExtra, style: ktBtn('#C0CA33') }, 'Add'))),
    h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 } },
      h('button', { onClick: share, style: ktBtn('#42A5F5') }, '📤 Send list'), h('button', { onClick: copy, style: KT_GHOST }, '📋 Copy'), props.isAdmin && h('button', { onClick: boughtToPantry, style: ktBtn('#4CAF82') }, '🥫 Checked → pantry')),
    have.length > 0 && h('div', { style: KT_CARD }, h('div', { style: { fontSize: 11, fontWeight: 800, color: '#4CAF82', marginBottom: 6 } }, '✅ ALREADY IN THE PANTRY (' + have.length + ')'), have.map(function (a) { return h('div', { key: a.key, style: { fontSize: 13, color: 'rgba(255,255,255,.7)', padding: '3px 0' } }, label(a) + '  — have ' + a.pantry.name); })));
}

// ── pantry with barcode scanner, storage places and fill levels ───────────────
function KitchenPantry(props) {
  var h = React.createElement;
  var locList = ktLocList(props.locs);
  var fS = React.useState({ qty: '1' }), f = fS[0], setF = fS[1];
  var scS = React.useState(false), scanning = scS[0], setScanning = scS[1];
  var qS = React.useState(''), q = qS[0], setQ = qS[1];
  var lfS = React.useState('all'), locFilter = lfS[0], setLocFilter = lfS[1];
  var nlS = React.useState(''), newLoc = nlS[0], setNewLoc = nlS[1];
  var mgS = React.useState(false), manage = mgS[0], setManage = mgS[1];
  var vRef = React.useRef(null), streamRef = React.useRef(null), stopRef = React.useRef(false);
  var supported = typeof window !== 'undefined' && 'BarcodeDetector' in window;
  var defLoc = locList[0].id;
  var locOf = function (p) { return locList.some(function (l) { return l.id === p.loc; }) ? p.loc : defLoc; };
  var all = Object.values(props.pantry);
  var list = all.filter(function (p) { return (locFilter === 'all' || locOf(p) === locFilter) && (!q || p.name.toLowerCase().indexOf(q.toLowerCase()) !== -1); }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  var addLoc = f.loc && locList.some(function (l) { return l.id === f.loc; }) ? f.loc : (locFilter !== 'all' ? locFilter : defLoc);
  function set(k, v) { setF(function (p) { var n = Object.assign({}, p); n[k] = v; return n; }); }
  function stopCam() { stopRef.current = true; if (streamRef.current) { streamRef.current.getTracks().forEach(function (t) { t.stop(); }); streamRef.current = null; } setScanning(false); }
  React.useEffect(function () { return function () { stopRef.current = true; if (streamRef.current) streamRef.current.getTracks().forEach(function (t) { t.stop(); }); }; }, []);
  async function lookup(code) {
    set('barcode', code);
    try {
      var r = await fetch('https://world.openfoodfacts.org/api/v2/product/' + encodeURIComponent(code) + '.json?fields=product_name,brands,quantity');
      var j = await r.json();
      if (j && j.status === 1 && j.product) { var nm = [j.product.brands && j.product.brands.split(',')[0], j.product.product_name].filter(Boolean).join(' '); setF(function (p) { return Object.assign({}, p, { barcode: code, name: nm || p.name || '', note: j.product.quantity || '' }); }); props.say('Found: ' + (nm || code)); return; }
    } catch (e) {}
    props.say('Barcode ' + code + ' saved — type what it is.');
  }
  async function startScan() {
    if (!supported) { props.say('This browser cannot scan barcodes. Type the name, or type the barcode number below.'); return; }
    try {
      stopRef.current = false;
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream; setScanning(true);
      setTimeout(async function () {
        var v = vRef.current; if (!v) return; v.srcObject = stream; try { await v.play(); } catch (e) {}
        var det = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] });
        (async function loop() {
          if (stopRef.current) return;
          try { var res = await det.detect(v); if (res && res.length) { var code = res[0].rawValue; stopCam(); try { if (navigator.vibrate) navigator.vibrate(100); } catch (e) {} lookup(code); return; } } catch (e) {}
          setTimeout(loop, 350);
        })();
      }, 200);
    } catch (e) { props.say('Camera not available. Allow camera access, or type the item.'); }
  }
  function add() {
    var name = (f.name || '').trim(); if (!name) { props.say('Type what it is.'); return; }
    var existing = f.barcode ? all.find(function (p) { return p.barcode === f.barcode; }) : null;
    var qty = parseFloat(f.qty); if (isNaN(qty)) qty = 1;
    if (existing) props.savePantry(Object.assign({}, existing, { qty: (existing.qty || 0) + qty, loc: existing.loc || addLoc }));
    else props.savePantry({ id: ktId('p'), name: name, qty: qty, unit: f.unit || '', barcode: f.barcode || '', note: f.note || '', loc: addLoc, tokens: ktTokens(name), addedAt: Date.now() });
    setF({ qty: '1', loc: addLoc }); props.say('✅ Added to ' + ktLocName(props.locs, addLoc) + '.');
  }
  function setQty(p, v) { props.savePantry(Object.assign({}, p, { qty: Math.max(0, Math.round(v * 100) / 100), loc: locOf(p) })); }
  function addPlace() {
    var n = newLoc.trim(); if (!n) return;
    var icon = /freez/i.test(n) ? '❄️' : /fridge|refrig/i.test(n) ? '🧊' : /spice/i.test(n) ? '🧂' : /snack/i.test(n) ? '🍪' : '🗄️';
    props.saveLoc({ id: ktId('loc'), name: n, icon: icon, order: Date.now() }); setNewLoc('');
  }
  var QTY_OPTS = [0.25, 0.5, 0.75, 1, 2, 3, 4, 5, 6, 8, 10, 12, 24];
  var count = function (id) { return all.filter(function (p) { return locOf(p) === id; }).length; };
  var renderItem = function (p) {
    var q0 = p.qty == null ? 1 : p.qty, out = q0 <= 0, low = q0 > 0 && q0 <= 0.25;
    var fill = Math.max(0, Math.min(100, Math.round((q0 > 1 ? 1 : q0) * 100)));
    return h('div', { key: p.id, style: Object.assign({}, KT_CARD, { padding: 10, border: '1px solid ' + (out ? 'rgba(239,83,80,.6)' : low ? 'rgba(255,183,77,.6)' : 'rgba(255,255,255,.1)') }) },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        h('div', { style: { flex: 1 } },
          h('div', { style: { fontSize: 14, fontWeight: 800, color: out ? 'rgba(255,255,255,.45)' : '#fff' } }, p.name),
          h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)' } }, ktLocName(props.locs, locOf(p)) + (p.note ? ' · ' + p.note : ''))),
        h('div', { style: { textAlign: 'right' } },
          h('div', { style: { fontSize: 18, fontWeight: 900, color: out ? '#EF5350' : low ? '#FFB74D' : '#4CAF82' } }, out ? 'EMPTY' : ktFracStr(q0)),
          h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.45)' } }, out ? 'on grocery list' : (p.unit || (q0 > 1 ? 'on hand' : 'left'))))),
      h('div', { style: { height: 7, borderRadius: 4, background: 'rgba(255,255,255,.1)', margin: '8px 0', overflow: 'hidden' } }, h('div', { style: { width: fill + '%', height: '100%', background: out ? '#EF5350' : low ? '#FFB74D' : '#4CAF82', transition: 'width .2s' } })),
      h('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' } },
        KT_LEVELS.map(function (lv) { var on = Math.abs(q0 - lv[0]) < 0.001; return h('button', { key: lv[0], onClick: function () { setQty(p, lv[0]); }, style: { padding: '6px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800, cursor: 'pointer', border: '1px solid ' + (on ? '#C0CA33' : 'rgba(255,255,255,.18)'), background: on ? '#C0CA33' : 'rgba(255,255,255,.06)', color: on ? '#000' : '#ddd' } }, lv[1]); }),
        h('div', { style: { flex: 1 } }),
        h('button', { onClick: function () { setQty(p, q0 - 1); }, style: KT_GHOST }, '−1'),
        h('button', { onClick: function () { setQty(p, q0 + 1); }, style: KT_GHOST }, '+1')),
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', marginTop: 8 } },
        h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)' } }, 'Stored in:'),
        h('select', { value: locOf(p), onChange: function (e) { props.savePantry(Object.assign({}, p, { loc: e.target.value })); }, style: { background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.18)', borderRadius: 8, padding: '5px 6px', fontSize: 12 } }, locList.map(function (l) { return h('option', { key: l.id, value: l.id, style: { color: '#000' } }, (l.icon || '') + ' ' + l.name); })),
        h('div', { style: { flex: 1 } }),
        h('button', { onClick: function () { props.delPantry(p.id); }, style: Object.assign({}, KT_GHOST, { color: '#EF5350' }) }, '🗑')));
  };
  return h('div', null,
    h('div', { style: { display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 10, alignItems: 'center' } },
      [{ id: 'all', name: 'Everything', icon: '🏠' }].concat(locList).map(function (l) {
        var on = locFilter === l.id;
        return h('button', { key: l.id, onClick: function () { setLocFilter(l.id); }, style: { flexShrink: 0, padding: '8px 12px', borderRadius: 20, border: '1px solid ' + (on ? '#FFB74D' : 'rgba(255,255,255,.15)'), background: on ? '#FFB74D' : 'rgba(255,255,255,.06)', color: on ? '#000' : '#ddd', fontSize: 12, fontWeight: 800, cursor: 'pointer' } }, (l.icon || '') + ' ' + l.name + ' (' + (l.id === 'all' ? all.length : count(l.id)) + ')');
      }),
      h('button', { onClick: function () { setManage(!manage); }, style: Object.assign({}, KT_GHOST, { flexShrink: 0 }) }, manage ? 'Done' : '⚙️ Places')),
    manage && h('div', { style: KT_CARD },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#FFB74D', marginBottom: 6 } }, 'WHERE FOOD IS STORED'),
      locList.map(function (l) { return h('div', { key: l.id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' } }, h('div', { style: { flex: 1, fontSize: 14, color: '#fff' } }, (l.icon || '') + ' ' + l.name + '  (' + count(l.id) + ')'), props.isAdmin && locList.length > 1 && h('button', { onClick: function () { props.delLoc(l.id); if (locFilter === l.id) setLocFilter('all'); }, style: Object.assign({}, KT_GHOST, { color: '#EF5350' }) }, 'Remove')); }),
      props.isAdmin ? h('div', { style: { display: 'flex', gap: 6, marginTop: 8 } }, h('input', { type: 'text', value: newLoc, onChange: function (e) { setNewLoc(e.target.value); }, placeholder: 'New place (e.g. Garage freezer, Spice cabinet)', style: Object.assign({}, KT_INP, { marginBottom: 0 }) }), h('button', { onClick: addPlace, style: ktBtn('#C0CA33') }, 'Add')) : h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)' } }, 'An admin can add or remove places.'),
      h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.35)', marginTop: 6 } }, 'Removing a place moves its items to the first place in the list.')),
    h('div', { style: KT_CARD },
      h('div', { style: { fontSize: 11, fontWeight: 800, color: '#FFB74D', marginBottom: 6 } }, '➕ ADD FOOD'),
      scanning && h('div', { style: { marginBottom: 8 } }, h('video', { ref: vRef, playsInline: true, muted: true, style: { width: '100%', borderRadius: 12, background: '#000', maxHeight: 260 } }), h('button', { onClick: stopCam, style: Object.assign({}, KT_GHOST, { marginTop: 6 }) }, 'Stop camera')),
      !scanning && h('button', { onClick: startScan, style: Object.assign({}, ktBtn('#42A5F5'), { marginBottom: 8 }) }, '📷 Scan barcode'),
      !supported && h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 6 } }, 'Barcode scanning needs Chrome or Edge (Android or PC). On iPhone, type the barcode number or the item name.'),
      h('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.45)', marginBottom: 4 } }, 'Where does it go?'),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 } }, locList.map(function (l) { var on = addLoc === l.id; return h('button', { key: l.id, onClick: function () { set('loc', l.id); }, style: { padding: '7px 11px', borderRadius: 20, fontSize: 12, fontWeight: 800, cursor: 'pointer', border: '1px solid ' + (on ? '#4CAF82' : 'rgba(255,255,255,.18)'), background: on ? '#4CAF82' : 'rgba(255,255,255,.06)', color: on ? '#000' : '#ddd' } }, (l.icon || '') + ' ' + l.name); })),
      h('input', { type: 'text', value: f.name || '', onChange: function (e) { set('name', e.target.value); }, placeholder: 'Item (e.g. olive oil, black beans)', style: KT_INP }),
      h('div', { style: { display: 'flex', gap: 6 } },
        h('select', { value: f.qty || '1', onChange: function (e) { set('qty', e.target.value); }, style: Object.assign({}, KT_INP, { flex: 1 }) }, QTY_OPTS.map(function (n) { return h('option', { key: n, value: n, style: { color: '#000' } }, ktFracStr(n) + (n < 1 ? ' left' : '')); })),
        h('input', { type: 'text', value: f.unit || '', onChange: function (e) { set('unit', e.target.value); }, placeholder: 'Unit (cans, lb…)', style: Object.assign({}, KT_INP, { flex: 1 }) })),
      h('div', { style: { display: 'flex', gap: 6 } },
        h('input', { type: 'text', inputMode: 'numeric', value: f.barcode || '', onChange: function (e) { set('barcode', e.target.value); }, placeholder: 'Barcode number (optional)', style: KT_INP }),
        f.barcode && h('button', { onClick: function () { lookup(f.barcode); }, style: ktBtn('rgba(255,255,255,.12)', '#fff') }, 'Look up')),
      h('button', { onClick: add, style: ktBtn('#4CAF82') }, 'Add to ' + ktLocName(props.locs, addLoc).replace(/^\S+\s/, '')),
      h('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 6 } }, 'Product names come from the free Open Food Facts database.')),
    h('input', { type: 'text', value: q, onChange: function (e) { setQ(e.target.value); }, placeholder: 'Search — where is the…?', style: KT_INP }),
    list.length === 0 && h('div', { style: { textAlign: 'center', color: 'rgba(255,255,255,.4)', fontSize: 12, padding: 24 } }, all.length ? 'Nothing here.' : 'Nothing stored yet. Scan or add what we have.'),
    locFilter === 'all' && !q
      ? locList.map(function (l) { var items = list.filter(function (p) { return locOf(p) === l.id; }); if (!items.length) return null; return h('div', { key: l.id }, h('div', { style: { fontSize: 12, fontWeight: 900, color: '#FFB74D', margin: '10px 0 6px' } }, (l.icon || '') + ' ' + l.name + ' · ' + items.length), items.map(renderItem)); })
      : list.map(renderItem));
}
