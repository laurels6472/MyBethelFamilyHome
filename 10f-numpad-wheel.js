// ═══ NUMBER ENTRY EVERYWHERE — numpad on every number box + a scroll-wheel picker ═══
// Every <input type="number"> gets the phone number pad. When one is tapped, a "🎡 Spin" chip appears;
// it opens a scroll wheel (whole number + decimal). Typing always still works.
(function () {
  if (typeof document === 'undefined' || window._fmNumWheel) return; window._fmNumWheel = true;
  function fix(el) { if (el.tagName === 'INPUT' && el.type === 'number') { var st = el.getAttribute('step'); el.setAttribute('inputmode', st && /^\d+$/.test(st) && el.getAttribute('min') !== null && parseFloat(el.getAttribute('min')) >= 0 && !el.hasAttribute('data-dec') ? 'decimal' : 'decimal'); el.setAttribute('enterkeyhint', 'done'); } }
  function scanAll(root) { try { (root.querySelectorAll ? root.querySelectorAll('input[type=number]') : []).forEach(fix); } catch (e) {} }
  var obs = new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { fix(n); scanAll(n); } }); }); });
  function start() { scanAll(document); obs.observe(document.body, { childList: true, subtree: true }); }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);

  var chip = null, sheet = null, target = null;
  function setVal(el, v) { var set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }
  function hideChip() { if (chip) { chip.remove(); chip = null; } }
  function showChip(el) {
    hideChip(); var r = el.getBoundingClientRect(); chip = document.createElement('button'); chip.textContent = '🎡 Spin';
    chip.style.cssText = 'position:fixed;z-index:99998;background:#C0CA33;color:#000;border:none;border-radius:20px;padding:5px 11px;font-weight:800;font-size:11px;box-shadow:0 2px 8px rgba(0,0,0,.5);left:' + Math.max(6, Math.min(window.innerWidth - 80, r.right - 70)) + 'px;top:' + Math.max(4, r.top - 30) + 'px';
    chip.onmousedown = chip.ontouchstart = function (e) { e.preventDefault(); };
    chip.onclick = function (e) { e.preventDefault(); openWheel(el); };
    document.body.appendChild(chip);
  }
  document.addEventListener('focusin', function (e) { var el = e.target; if (el && el.tagName === 'INPUT' && el.type === 'number' && !el.readOnly && !el.disabled) { target = el; showChip(el); } });
  document.addEventListener('focusout', function () { setTimeout(function () { if (!sheet && document.activeElement !== target) hideChip(); }, 250); });
  window.addEventListener('scroll', function () { if (chip && target) showChip(target); }, true);

  function column(max, start, pad) {
    var H = 44, col = document.createElement('div');
    col.style.cssText = 'height:' + H * 5 + 'px;overflow-y:scroll;scroll-snap-type:y mandatory;flex:1;-webkit-overflow-scrolling:touch;scrollbar-width:none;text-align:center';
    var html = '<div style="height:' + H * 2 + 'px"></div>';
    for (var i = 0; i <= max; i++) html += '<div style="height:' + H + 'px;line-height:' + H + 'px;scroll-snap-align:center;font-size:26px;font-weight:800;color:#fff">' + (pad ? ('0' + i).slice(-pad) : i) + '</div>';
    col.innerHTML = html + '<div style="height:' + H * 2 + 'px"></div>';
    setTimeout(function () { col.scrollTop = start * H; }, 30);
    col.get = function () { return Math.max(0, Math.min(max, Math.round(col.scrollTop / H))); };
    return col;
  }
  function openWheel(el) {
    if (sheet) return; var cur = parseFloat(el.value); if (isNaN(cur)) cur = 0;
    var maxA = el.getAttribute('max'), minA = el.getAttribute('min'); var min = minA !== null && minA !== '' ? parseFloat(minA) : 0;
    var max = maxA !== null && maxA !== '' ? parseFloat(maxA) : Math.max(100, Math.ceil(cur * 3), 20);
    if (max > 1000) max = Math.ceil(cur * 2 + 100); var span = Math.floor(max) - Math.floor(min);
    var whole = Math.floor(cur), dec = Math.round((cur - whole) * 10);
    var c1 = column(span, Math.max(0, whole - Math.floor(min))), c2 = column(9, dec);
    sheet = document.createElement('div'); sheet.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.6);display:flex;align-items:flex-end';
    var box = document.createElement('div'); box.style.cssText = 'width:100%;background:#1c1c2b;border-radius:20px 20px 0 0;padding:14px 16px 22px;color:#fff;font-family:inherit';
    var ttl = document.createElement('div'); ttl.style.cssText = 'text-align:center;font-size:12px;color:#aaa;margin-bottom:6px'; ttl.textContent = (el.placeholder || 'Scroll to pick a number');
    var wrap = document.createElement('div'); wrap.style.cssText = 'position:relative;display:flex;align-items:center;gap:4px;max-width:320px;margin:0 auto';
    var band = document.createElement('div'); band.style.cssText = 'position:absolute;left:0;right:0;top:88px;height:44px;border-top:2px solid #C0CA33;border-bottom:2px solid #C0CA33;pointer-events:none;background:rgba(192,202,51,.1)';
    var dot = document.createElement('div'); dot.textContent = '.'; dot.style.cssText = 'font-size:28px;font-weight:900;color:#C0CA33';
    wrap.appendChild(c1); wrap.appendChild(dot); wrap.appendChild(c2); wrap.appendChild(band);
    var row = document.createElement('div'); row.style.cssText = 'display:flex;gap:10px;margin-top:12px;max-width:320px;margin-left:auto;margin-right:auto';
    function btn(t, bg, fg, fn) { var b = document.createElement('button'); b.textContent = t; b.style.cssText = 'flex:1;border:none;border-radius:24px;padding:12px;font-weight:900;font-size:14px;background:' + bg + ';color:' + fg; b.onclick = fn; return b; }
    function close() { sheet.remove(); sheet = null; hideChip(); }
    row.appendChild(btn('Cancel', 'rgba(255,255,255,.12)', '#fff', close));
    row.appendChild(btn('Use this', '#C0CA33', '#000', function () { var v = Math.floor(min) + c1.get() + c2.get() / 10; if (v < min) v = min; setVal(el, Math.round(v * 10) / 10); close(); }));
    box.appendChild(ttl); box.appendChild(wrap); box.appendChild(row); sheet.appendChild(box);
    sheet.onclick = function (e) { if (e.target === sheet) close(); }; document.body.appendChild(sheet);
  }
})();
