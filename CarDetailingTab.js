/*
 * CarDetailingTab.js  -  "Car Detailing" business tab for MyBethelFamilyHome
 * Add-on module: plain JavaScript (no JSX, no build step). It adds one new component,
 * window.CarDetailingTab, and does not touch any existing app code or saved data.
 * Data is stored under its own key/path ("carDetailing"), separate from everything else.
 * Admin only. Free: uses localStorage, plus your existing Firebase Realtime Database if you pass a ref.
 */
(function (root) {
  "use strict";
  var React = root.React || (typeof require !== "undefined" ? require("react") : null);
  var h = React.createElement, useState = React.useState, useEffect = React.useEffect, useRef = React.useRef, useMemo = React.useMemo;

  /* ---------- helpers ---------- */
  function uid() { return "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function money(n) { n = num(n); return (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function money0(n) { n = num(n); return (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US"); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function todayStr() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function monthOf(s) { return (s || "").slice(0, 7); }
  function addDays(s, n) { var d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fmtDate(s) { if (!s) return ""; var d = new Date(s + "T12:00:00"); return isNaN(d) ? s : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function arr(v) { if (Array.isArray(v)) return v.filter(function (x) { return x != null; }); if (v && typeof v === "object") return Object.keys(v).map(function (k) { return v[k]; }); return []; }

  /* ---------- starter data ---------- */
  var SIZES = ["Car", "SUV / Truck", "3-row / Van"];
  var PRICES = {
    "Essential Wash": [75, 95, 115],
    "Interior Reset": [140, 170, 200],
    "Signature Full Detail": [200, 250, 300],
    "Deep Restore": [350, 425, 500],
    "Maintain (monthly plan)": [65, 85, 0],
    "Maintain Plus (monthly plan)": [130, 165, 0],
    "Keep Fresh (monthly plan)": [105, 130, 0],
    "Fleet visit": [45, 65, 85],
    "Fleet Plus visit": [75, 95, 115]
  };
  var ADDONS = [
    ["Carpet / seat extraction", 90], ["Pet hair removal", 55], ["Clay bar + sealant", 100],
    ["Engine bay detail", 100], ["Heavy-soil surcharge", 75], ["Condition surcharge", 50]
  ];
  var PHASES = ["Load-out check", "Wheels & tires", "Exterior wash", "Interior", "Final inspection"];
  var JOB_STATUS = ["Quote", "Booked", "In progress", "Done", "Canceled"];
  var EXP_CATS = ["Equipment", "Chemicals & supplies", "Fuel", "Insurance", "Software", "Marketing", "Phone", "Accounting", "Vehicle maintenance", "Water & waste", "Licenses & fees", "Other"];

  var DEFAULT_SETTINGS = {
    bizName: "Mobile Detailing (E&L Services & Sales)", phone: "", email: "", address: "Rock Hill, SC",
    taxRate: 0, payNote: "Payment due on completion. Thank you for your business!", footer: "",
    foundingLimit: 25, foundingPct: 15, referralCredit: 20, travelFee: 0, mileageRate: 0, nextInv: 1001, seeded: false,
    prices: PRICES, addons: ADDONS
  };

  // [category, item, vendor, url, est. price]
  var SHOPPING = [
    ["Core equipment", "Honda EU3000iS inverter generator", "Martin's Outdoor", "https://martinsoutdoor.com/products/honda-eu3000is-generator", 2399],
    ["Core equipment", "Simpson PowerShot PS60869 pressure washer", "Tractor Supply", "https://tractorsupply.com/tsc/product/simpson-powershot-series-ps60869-4000-psi-@-35-gpm-gas-pressure-washer-powered-by-honda", 1100],
    ["Core equipment", "Mytee HP120 heated extractor (hold until demand)", "Car Supplies Warehouse", "https://carsupplieswarehouse.com/products/mytee-grand-prix-hp120-automotive-heated-detail-extractor", 2258],
    ["Core equipment", "Clean-water tank 50-55 gal", "Detail King", "https://www.detailking.com/products/100-gallon-plastic-water-tank", 275],
    ["Core equipment", "Foam cannon + spray gun combo", "Adam's Polishes", "https://adamspolishes.com/products/adam-s-foam-cannon-ultra-foam-combo", 100],
    ["Core equipment", "Tri-fold aluminum ramp, 1500 lb", "Harbor Freight", "https://www.harborfreight.com/automotive/ramps/loading-ramps.html", 250],
    ["Core equipment", "Hose reels and hoses", "", "", 620],
    ["Core equipment", "E-track tie-downs + isolator feet", "", "", 140],
    ["Core equipment", "Rear shelf (custom build)", "Hardware store", "", 275],
    ["Core equipment", "Fridge, trash can, portable restroom", "Slickdeals (BougeRV)", "https://slickdeals.net/f/19753284-23-qt-bougerv-portable-12v-car-refrigerator-152-free-s-h", 340],
    ["Wastewater kit", "Containment mat / berm", "Detail King", "https://www.detailking.com/collections/water-containment-reclamation", 1295],
    ["Wastewater kit", "16-gal wet/dry vac (Husky)", "Home Depot", "https://homedepot.com/p/Husky-16-Gal-6-5-Peak-HP-Poly-Cart-Design-Wet-Dry-Vac-with-a-Cartridge-Filter-Hose-and-Accessories-AT18621P-16A/323107484", 107],
    ["Wastewater kit", "Wastewater collection tank", "Detail King", "https://www.detailking.com/products/100-gallon-plastic-water-tank", 280],
    ["Wastewater kit", "Transfer pump and hose", "", "", 100],
    ["Wastewater kit", "Spill kit and absorbents", "", "", 60],
    ["Wastewater kit", "Storm drain cover / blocker", "", "", 60],
    ["Added gear & safety", "Second 16-gal wet/dry vac", "Home Depot", "https://homedepot.com/p/Husky-16-Gal-6-5-Peak-HP-Poly-Cart-Design-Wet-Dry-Vac-with-a-Cartridge-Filter-Hose-and-Accessories-AT18621P-16A/323107484", 107],
    ["Added gear & safety", "Steamer (Vapamore)", "Detail King", "https://www.detailking.com/shop-by-brand/vapamore/", 999],
    ["Added gear & safety", "6-gal air compressor", "Slickdeals / Home Depot", "https://slickdeals.net/f/17009452-ridgid-6-gal-portable-electric-pancake-air-compressor-99", 129],
    ["Added gear & safety", "10x10 pop-up canopy", "Home Depot", "https://www.homedepot.com/p/EAGLE-PEAK-10-ft-x-10-ft-Heavy-Duty-Commercial-Pop-Up-Instant-Canopy-Tent-White-CP100-01-AZ/320648786", 200],
    ["Added gear & safety", "50 ft 12/3 GFCI extension cord (x2)", "Do it Best", "https://www.doitbest.com/product/545345/southwire-50-ft-12-3-heavy-duty-gfci-in-line-extension-cord-545345", 230],
    ["Added gear & safety", "ABC fire extinguisher 5.5 lb (x2)", "Home Depot", "https://www.homedepot.com/p/Kidde-Pro-340-Rechargeable-3-A-40-B-C-Class-ABC-5-5-lb-Fire-Extinguisher-21030916-21030916/100558332", 120],
    ["Added gear & safety", "Carbon monoxide alarm", "Electric Bargain Stores", "https://electricbargainstores.com/products/kidde-kn-cob-b", 34],
    ["Added gear & safety", "First aid kit, 118-piece", "Walmart", "https://www.walmart.com/ip/3M-Industrical-Construction-First-Aid-Kit-118-Pieces-OSHA-ANSI-Compliant/23086447", 24],
    ["Added gear & safety", "Traffic cones, 18 in (set of 4)", "", "", 30],
    ["Storage & towels", "Wire shelving 36x14x72", "Amazon", "", 78],
    ["Storage & towels", "Wall-mount jug racks (x2)", "", "", 69],
    ["Storage & towels", "Spray bottle racks", "", "", 42],
    ["Storage & towels", "Clean-towel bins (x9)", "", "", 108],
    ["Storage & towels", "Reusable microfiber towels (about 70)", "", "", 49],
    ["Storage & towels", "Disposable shop towels (case)", "Scott", "", 65],
    ["Storage & towels", "Nitrile gloves, XL, case of 1,000", "", "", 73],
    ["Storage & towels", "Trash liners, bulk case", "", "", 49],
    ["PPE", "Nitrile gloves 6-9 mil (box)", "", "", 25],
    ["PPE", "Anti-fog safety glasses", "", "", 15],
    ["PPE", "Half-face respirator", "", "", 45],
    ["PPE", "UV sun hat", "", "", 20],
    ["PPE", "UV work shirts (5-pack)", "", "", 75],
    ["PPE", "Water-resistant work boots", "", "", 110]
  ];
  // [name, unit, cost per unit, reorder at]
  var STOCK = [
    ["Car wash soap concentrate", "gal", 55, 1], ["Wheel and tire cleaner", "gal", 50, 1], ["Degreaser / all-purpose cleaner", "gal", 35, 1],
    ["Interior cleaner", "gal", 45, 1], ["Glass cleaner", "gal", 30, 1], ["Leather cleaner and conditioner", "bottle", 30, 1],
    ["Upholstery / extraction shampoo", "gal", 35, 1], ["Tire dressing", "gal", 45, 1], ["Clay bar kit", "kit", 30, 1],
    ["Spray sealant or wax", "bottle", 30, 1], ["Odor eliminator", "bottle", 20, 1], ["Microfiber towels (reusable)", "each", 0.7, 20],
    ["Disposable shop towels", "case", 65, 1], ["Nitrile gloves", "box", 7.3, 2], ["Trash liners", "case", 49, 1]
  ];

  /* ---------- storage ---------- */
  var LS_KEY = "mbfh_carDetailing_v1";
  function blankDb() { return { customers: [], jobs: [], invoices: [], purchases: [], stock: [], expenses: [], mileage: [], settings: DEFAULT_SETTINGS }; }
  function normalize(d) {
    var b = blankDb(); d = d || {};
    var s = Object.assign({}, DEFAULT_SETTINGS, d.settings || {});
    s.prices = Object.assign({}, PRICES, (d.settings && d.settings.prices) || {});
    Object.keys(s.prices).forEach(function (k) { s.prices[k] = arr(s.prices[k]).map(num); while (s.prices[k].length < 3) s.prices[k].push(0); });
    s.addons = (d.settings && d.settings.addons) ? arr(d.settings.addons).map(function (a) { return [a[0] || a["0"], num(a[1])]; }) : ADDONS;
    b.settings = s;
    ["customers", "jobs", "invoices", "purchases", "stock", "expenses", "mileage"].forEach(function (k) { b[k] = arr(d[k]); });
    b.jobs.forEach(function (j) { j.addons = arr(j.addons); j.products = arr(j.products); j.phases = j.phases || {}; });
    b.invoices.forEach(function (i) { i.lines = arr(i.lines); i.payments = arr(i.payments); });
    return b;
  }
  function seed(db) {
    if (db.settings.seeded) return db;
    var n = Object.assign({}, db);
    if (!n.purchases.length) n.purchases = SHOPPING.map(function (r) { return { id: uid(), cat: r[0], item: r[1], vendor: r[2], url: r[3], est: r[4], actual: 0, qty: 1, status: "To buy", date: "" }; });
    if (!n.stock.length) n.stock = STOCK.map(function (r) { return { id: uid(), name: r[0], unit: r[1], cost: r[2], reorder: r[3], onHand: 0 }; });
    n.settings = Object.assign({}, n.settings, { seeded: true });
    return n;
  }
  function useStore(props) {
    var st = useState(null), db = st[0], setDb = st[1];
    var ready = useRef(false), timer = useRef(null), ref = props.firebaseRef || null;
    useEffect(function () {
      var cancelled = false;
      function done(raw) { if (cancelled) return; setDb(seed(normalize(raw))); ready.current = true; }
      var local = null; try { local = JSON.parse(localStorage.getItem(LS_KEY) || "null"); } catch (e) {}
      if (ref && ref.once) {
        ref.once("value").then(function (s) { var v = s.val(); done(v || local); }).catch(function () { done(local); });
      } else if (props.storage && props.storage.load) {
        Promise.resolve(props.storage.load()).then(function (v) { done(v || local); }).catch(function () { done(local); });
      } else done(local);
      return function () { cancelled = true; };
    }, []);
    function update(fn) {
      setDb(function (prev) {
        var next = fn(prev);
        if (ready.current) {
          clearTimeout(timer.current);
          timer.current = setTimeout(function () {
            try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch (e) {}
            try { if (ref && ref.set) ref.set(JSON.parse(JSON.stringify(next))); else if (props.storage && props.storage.save) props.storage.save(next); } catch (e) {}
          }, 500);
        }
        return next;
      });
    }
    return [db, update];
  }

  /* ---------- calculations ---------- */
  function jobTotals(j, s) {
    var row = (s.prices[j.package] || [0, 0, 0]);
    var base = j.basePrice !== "" && j.basePrice != null && j.basePrice !== undefined && j.priceOverride ? num(j.basePrice) : num(row[j.size == null ? 0 : j.size]);
    var addons = arr(j.addons).reduce(function (t, a) { return t + num(a.price); }, 0);
    var travel = num(j.travel);
    var disc = 0, dtype = j.discountType || "none";
    if (dtype === "founding") disc = (base + addons) * num(s.foundingPct) / 100;
    else if (dtype === "referral") disc = num(s.referralCredit);
    else if (dtype === "custom") disc = num(j.discountAmt);
    var subtotal = base + addons + travel;
    disc = Math.min(disc, subtotal);
    var total = subtotal - disc;
    var tax = total * num(s.taxRate) / 100;
    return { base: base, addons: addons, travel: travel, subtotal: subtotal, discount: disc, tax: tax, total: total + tax };
  }
  function invTotals(inv) {
    var sub = arr(inv.lines).reduce(function (t, l) { return t + num(l.qty) * num(l.price); }, 0);
    var disc = Math.min(num(inv.discount), sub);
    var tax = (sub - disc) * num(inv.taxRate) / 100;
    var total = sub - disc + tax;
    var paid = arr(inv.payments).reduce(function (t, p) { return t + num(p.amount); }, 0);
    return { sub: sub, disc: disc, tax: tax, total: total, paid: paid, balance: Math.round((total - paid) * 100) / 100 };
  }
  function invStatus(inv) {
    var t = invTotals(inv);
    if (inv.void) return "Void";
    if (t.total > 0 && t.balance <= 0) return "Paid";
    if (t.paid > 0) return "Partial";
    if (inv.due && inv.due < todayStr()) return "Overdue";
    return "Unpaid";
  }
  function custName(db, id) { var c = db.customers.filter(function (x) { return x.id === id; })[0]; return c ? c.name : "(no customer)"; }
  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }

  /* ---------- styles ---------- */
  var CSS = [
    ".cd{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1b2733;max-width:980px;margin:0 auto;padding:12px 12px 80px}",
    ".cd *{box-sizing:border-box}",
    ".cd h2{font-size:22px;margin:4px 0 2px;color:#0b1f33}.cd h3{font-size:16px;margin:0 0 8px;color:#0b1f33}",
    ".cd .sub{color:#5f6e7e;font-size:13px;margin-bottom:10px}",
    ".cd-nav{display:flex;gap:6px;overflow-x:auto;padding:6px 0 10px;position:sticky;top:0;background:#f4f8fb;z-index:5;-webkit-overflow-scrolling:touch}",
    ".cd-nav button{flex:0 0 auto;border:0;border-radius:20px;padding:9px 14px;font-size:14px;background:#e3edf3;color:#0b1f33;cursor:pointer}",
    ".cd-nav button.on{background:#0e7c86;color:#fff;font-weight:600}",
    ".cd-card{background:#fff;border:1px solid #e1e8ef;border-radius:12px;padding:12px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,.05)}",
    ".cd-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:10px}",
    ".cd-stat{background:#fff;border:1px solid #e1e8ef;border-radius:12px;padding:12px;text-align:center}",
    ".cd-stat b{display:block;font-size:22px;color:#0b1f33}.cd-stat span{font-size:12px;color:#5f6e7e}",
    ".cd-row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid #eef2f6}.cd-row:last-child{border-bottom:0}",
    ".cd-row .t{font-weight:600}.cd-row .m{font-size:12px;color:#5f6e7e}",
    ".cd-btn{border:0;border-radius:9px;padding:10px 14px;font-size:14px;background:#0e7c86;color:#fff;cursor:pointer;font-weight:600}",
    ".cd-btn.sec{background:#e3edf3;color:#0b1f33}.cd-btn.warn{background:#c0392b}.cd-btn.sm{padding:6px 10px;font-size:12px}",
    ".cd-in,.cd select,.cd textarea{width:100%;padding:10px;border:1px solid #cdd8e2;border-radius:8px;font-size:16px;background:#fff;color:#1b2733}",
    ".cd label{display:block;font-size:12px;color:#5f6e7e;margin:8px 0 3px}",
    ".cd-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".cd-pill{display:inline-block;padding:2px 9px;border-radius:12px;font-size:12px;font-weight:600;background:#e3edf3;color:#0b1f33}",
    ".cd-pill.g{background:#d8f3e8;color:#0b6b46}.cd-pill.o{background:#ffe9d9;color:#a4480f}.cd-pill.r{background:#fde0dc;color:#9c2b1f}.cd-pill.b{background:#dbe9fb;color:#1c4f94}",
    ".cd-bar{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}",
    ".cd-chk{display:flex;align-items:center;gap:8px;padding:6px 0}.cd-chk input{width:20px;height:20px}",
    ".cd table{width:100%;border-collapse:collapse;font-size:14px}.cd th{text-align:left;color:#5f6e7e;font-size:12px;padding:4px}.cd td{padding:4px;border-top:1px solid #eef2f6}",
    ".cd-empty{color:#5f6e7e;text-align:center;padding:18px;font-size:14px}",
    ".cd a{color:#1c6fd6}"
  ].join("\n");

  /* ---------- small UI pieces ---------- */
  function Field(p) { return h("div", null, h("label", null, p.label), p.children); }
  function In(p) {
    return h("input", { className: "cd-in", type: p.type || "text", value: p.value == null ? "" : p.value, placeholder: p.ph || "", inputMode: p.type === "number" ? "decimal" : undefined, step: p.type === "number" ? "any" : undefined, onChange: function (e) { p.onChange(e.target.value); } });
  }
  function Sel(p) {
    return h("select", { value: p.value == null ? "" : p.value, onChange: function (e) { p.onChange(e.target.value); } }, p.options.map(function (o) { var v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return h("option", { key: v, value: v }, l); }));
  }
  function Btn(p) { return h("button", { className: "cd-btn " + (p.kind || "") + (p.sm ? " sm" : ""), onClick: p.onClick, type: "button", disabled: p.disabled }, p.children); }
  function Pill(p) { return h("span", { className: "cd-pill " + (p.c || "") }, p.children); }
  function Empty(p) { return h("div", { className: "cd-empty" }, p.children); }
  function Header(p) { return h("div", null, h("h2", null, p.title), p.sub ? h("div", { className: "sub" }, p.sub) : null); }
  function download(name, text, type) {
    try { var b = new Blob([text], { type: type || "text/plain" }); var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { document.body.removeChild(a); }, 300); } catch (e) { alert("Download not supported here."); }
  }
  function toCsv(rows) { return rows.map(function (r) { return r.map(function (c) { c = String(c == null ? "" : c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(","); }).join("\n"); }
  function confirmDel(msg, fn) { if (window.confirm(msg || "Delete this?")) fn(); }

  /* ---------- Home ---------- */
  function Home(p) {
    var db = p.db, s = db.settings, t = todayStr(), m = monthOf(t);
    var upcoming = db.jobs.filter(function (j) { return (j.status === "Booked" || j.status === "In progress") && j.date >= t; }).sort(function (a, b) { return (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")); });
    var unpaid = db.invoices.filter(function (i) { var st = invStatus(i); return st === "Unpaid" || st === "Partial" || st === "Overdue"; });
    var owed = unpaid.reduce(function (x, i) { return x + invTotals(i).balance; }, 0);
    var rev = 0; db.invoices.forEach(function (i) { arr(i.payments).forEach(function (pm) { if (monthOf(pm.date) === m) rev += num(pm.amount); }); });
    var exp = db.expenses.filter(function (e) { return monthOf(e.date) === m; }).reduce(function (x, e) { return x + num(e.amount); }, 0);
    var founding = db.customers.filter(function (c) { return c.founding; }).length;
    var low = db.stock.filter(function (x) { return num(x.onHand) <= num(x.reorder); }).length;
    var toBuy = db.purchases.filter(function (x) { return x.status === "To buy"; });
    var toBuyCost = toBuy.reduce(function (x, y) { return x + num(y.est) * num(y.qty || 1); }, 0);
    return h("div", null,
      h(Header, { title: "Car Detailing", sub: s.bizName }),
      h("div", { className: "cd-grid" },
        h("div", { className: "cd-stat" }, h("b", null, upcoming.filter(function (j) { return j.date === t; }).length), h("span", null, "Jobs today")),
        h("div", { className: "cd-stat" }, h("b", null, upcoming.length), h("span", null, "Upcoming jobs")),
        h("div", { className: "cd-stat" }, h("b", null, money0(owed)), h("span", null, "Unpaid invoices")),
        h("div", { className: "cd-stat" }, h("b", null, money0(rev)), h("span", null, "Collected this month")),
        h("div", { className: "cd-stat" }, h("b", null, money0(rev - exp)), h("span", null, "Profit this month (before owner pay)")),
        h("div", { className: "cd-stat" }, h("b", null, founding + " of " + s.foundingLimit), h("span", null, "Founding Customers used"))),
      h("div", { className: "cd-bar" },
        h(Btn, { onClick: function () { p.go("jobs", { new: true }); } }, "+ New job"),
        h(Btn, { kind: "sec", onClick: function () { p.go("customers", { new: true }); } }, "+ New customer"),
        h(Btn, { kind: "sec", onClick: function () { p.go("money", { new: true }); } }, "+ Expense")),
      h("div", { className: "cd-card" }, h("h3", null, "Next jobs"),
        upcoming.length ? upcoming.slice(0, 6).map(function (j) {
          return h("div", { className: "cd-row", key: j.id, onClick: function () { p.go("jobs", { edit: j.id }); }, style: { cursor: "pointer" } },
            h("div", null, h("div", { className: "t" }, custName(db, j.customerId)), h("div", { className: "m" }, fmtDate(j.date) + (j.time ? " at " + j.time : "") + " - " + j.package + " - " + (j.vehicle || ""))),
            h(Pill, { c: "b" }, j.status));
        }) : h(Empty, null, "No upcoming jobs yet.")),
      h("div", { className: "cd-grid" },
        h("div", { className: "cd-card" }, h("h3", null, "Needs attention"),
          h("div", { className: "cd-row" }, h("span", null, "Low or empty supplies"), h(Pill, { c: low ? "o" : "g" }, low)),
          h("div", { className: "cd-row" }, h("span", null, "Overdue invoices"), h(Pill, { c: "r" }, db.invoices.filter(function (i) { return invStatus(i) === "Overdue"; }).length)),
          h("div", { className: "cd-row" }, h("span", null, "Items still to buy"), h(Pill, null, toBuy.length + " (" + money0(toBuyCost) + ")")))));
  }

  /* ---------- Customers ---------- */
  function Customers(p) {
    var db = p.db, s = db.settings;
    var _f = useState(p.intent && p.intent.new ? { id: "", type: "Residential" } : null), form = _f[0], setForm = _f[1];
    var _q = useState(""), q = _q[0], setQ = _q[1];
    function set(k, v) { setForm(Object.assign({}, form, (function () { var o = {}; o[k] = v; return o; })())); }
    function save() {
      if (!form.name || !form.name.trim()) { alert("Please enter a name."); return; }
      var c = Object.assign({}, form);
      if (c.founding && !byId(db.customers, c.id || "x") ) {
        var used = db.customers.filter(function (x) { return x.founding; }).length;
        if (used >= num(s.foundingLimit) && !window.confirm("All " + s.foundingLimit + " Founding Customer spots are used. Add anyway?")) return;
      }
      p.update(function (d) {
        var list = d.customers.slice();
        if (c.id) list = list.map(function (x) { return x.id === c.id ? c : x; }); else { c.id = uid(); c.created = todayStr(); list.push(c); }
        return Object.assign({}, d, { customers: list });
      });
      setForm(null);
    }
    if (form) {
      var refList = db.customers.filter(function (x) { return x.id !== form.id; }).map(function (x) { return [x.id, x.name]; });
      return h("div", null, h(Header, { title: form.id ? "Edit customer" : "New customer" }),
        h("div", { className: "cd-card" },
          h(Field, { label: "Name" }, h(In, { value: form.name, onChange: function (v) { set("name", v); } })),
          h("div", { className: "cd-two" },
            h(Field, { label: "Type" }, h(Sel, { value: form.type, options: ["Residential", "Fleet / commercial"], onChange: function (v) { set("type", v); } })),
            h(Field, { label: "Phone" }, h(In, { type: "tel", value: form.phone, onChange: function (v) { set("phone", v); } }))),
          h(Field, { label: "Email" }, h(In, { type: "email", value: form.email, onChange: function (v) { set("email", v); } })),
          h(Field, { label: "Service address" }, h(In, { value: form.address, onChange: function (v) { set("address", v); } })),
          h(Field, { label: "Vehicles (year, make, model, color, plate)" }, h("textarea", { rows: 3, value: form.vehicles || "", onChange: function (e) { set("vehicles", e.target.value); } })),
          h("div", { className: "cd-two" },
            h(Field, { label: "Monthly plan (if any)" }, h(Sel, { value: form.plan || "", options: [["", "None"], "Maintain", "Maintain Plus", "Keep Fresh", "Fleet account"], onChange: function (v) { set("plan", v); } })),
            h(Field, { label: "Referred by" }, h(Sel, { value: form.referredBy || "", options: [["", "Nobody"]].concat(refList), onChange: function (v) { set("referredBy", v); } }))),
          h("div", { className: "cd-chk" }, h("input", { type: "checkbox", checked: !!form.founding, onChange: function (e) { set("founding", e.target.checked); } }), h("span", null, "Founding Customer (" + s.foundingPct + "% off first service)")),
          h(Field, { label: "Notes (gate codes, pets, preferences)" }, h("textarea", { rows: 3, value: form.notes || "", onChange: function (e) { set("notes", e.target.value); } })),
          h("div", { className: "cd-bar" }, h(Btn, { onClick: save }, "Save"), h(Btn, { kind: "sec", onClick: function () { setForm(null); } }, "Cancel"),
            form.id ? h(Btn, { kind: "warn", onClick: function () { confirmDel("Delete this customer? Their jobs and invoices stay.", function () { p.update(function (d) { return Object.assign({}, d, { customers: d.customers.filter(function (x) { return x.id !== form.id; }) }); }); setForm(null); }); } }, "Delete") : null)));
    }
    var list = db.customers.filter(function (c) { var t = (c.name + " " + (c.phone || "") + " " + (c.address || "")).toLowerCase(); return t.indexOf(q.toLowerCase()) >= 0; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    return h("div", null, h(Header, { title: "Customers", sub: db.customers.length + " total" }),
      h("div", { className: "cd-bar" }, h(Btn, { onClick: function () { setForm({ id: "", type: "Residential" }); } }, "+ Add customer")),
      h("input", { className: "cd-in", placeholder: "Search name, phone or address", value: q, onChange: function (e) { setQ(e.target.value); } }),
      h("div", { className: "cd-card", style: { marginTop: 10 } }, list.length ? list.map(function (c) {
        var jobs = db.jobs.filter(function (j) { return j.customerId === c.id && j.status === "Done"; }).length;
        return h("div", { className: "cd-row", key: c.id, style: { cursor: "pointer" }, onClick: function () { setForm(c); } },
          h("div", null, h("div", { className: "t" }, c.name), h("div", { className: "m" }, [c.type, c.phone, c.plan].filter(Boolean).join(" - "))),
          h("div", null, c.founding ? h(Pill, { c: "g" }, "Founding") : null, " ", h(Pill, null, jobs + " jobs")));
      }) : h(Empty, null, "No customers yet. Tap + Add customer.")));
  }

  /* ---------- Jobs ---------- */
  function newJob(s) { return { id: "", customerId: "", date: todayStr(), time: "", status: "Booked", vehicle: "", size: 0, package: "Signature Full Detail", addons: [], travel: 0, discountType: "none", discountAmt: 0, priceOverride: false, basePrice: "", deposit: 0, products: [], phases: {}, notes: "" }; }
  function Jobs(p) {
    var db = p.db, s = db.settings;
    var init = null;
    if (p.intent && p.intent.new) init = newJob(s);
    if (p.intent && p.intent.edit) init = byId(db.jobs, p.intent.edit) || null;
    var _f = useState(init), form = _f[0], setForm = _f[1];
    var _flt = useState("Active"), flt = _flt[0], setFlt = _flt[1];
    function set(k, v) { var o = {}; o[k] = v; setForm(Object.assign({}, form, o)); }
    function save(andClose) {
      if (!form.customerId) { alert("Please choose a customer."); return null; }
      var j = Object.assign({}, form); var wasNew = !j.id; if (wasNew) j.id = uid();
      var prev = byId(db.jobs, j.id);
      p.update(function (d) {
        var jobs = d.jobs.slice(), stock = d.stock;
        if (j.status === "Done" && !j.stockDeducted) {
          stock = d.stock.map(function (it) { var used = arr(j.products).filter(function (u) { return u.itemId === it.id; }).reduce(function (t, u) { return t + num(u.qty); }, 0); return used ? Object.assign({}, it, { onHand: Math.round((num(it.onHand) - used) * 100) / 100 }) : it; });
          j.stockDeducted = true;
        }
        if (prev) jobs = jobs.map(function (x) { return x.id === j.id ? j : x; }); else jobs.push(j);
        return Object.assign({}, d, { jobs: jobs, stock: stock });
      });
      if (andClose !== false) setForm(null);
      return j;
    }
    function makeInvoice() {
      var j = save(false); if (!j) return;
      var t = jobTotals(j, s);
      var lines = [{ id: uid(), desc: j.package + " - " + SIZES[j.size == null ? 0 : j.size] + (j.vehicle ? " (" + j.vehicle + ")" : ""), qty: 1, price: t.base }];
      arr(j.addons).forEach(function (a) { lines.push({ id: uid(), desc: a.name, qty: 1, price: num(a.price) }); });
      if (num(j.travel)) lines.push({ id: uid(), desc: "Travel fee", qty: 1, price: num(j.travel) });
      var inv = { id: uid(), no: "INV-" + s.nextInv, date: todayStr(), due: addDays(todayStr(), 7), customerId: j.customerId, jobId: j.id, lines: lines, discount: t.discount, discountNote: j.discountType === "founding" ? "Founding Customer " + s.foundingPct + "% off" : j.discountType === "referral" ? "Referral credit" : j.discountType === "custom" ? "Discount" : "", taxRate: num(s.taxRate), payments: num(j.deposit) ? [{ id: uid(), date: j.date, amount: num(j.deposit), method: "Deposit" }] : [], notes: "" };
      p.update(function (d) { return Object.assign({}, d, { invoices: d.invoices.concat([inv]), settings: Object.assign({}, d.settings, { nextInv: num(d.settings.nextInv) + 1 }) }); });
      p.go("invoices", { edit: inv.id });
    }
    if (form) {
      var t = jobTotals(form, s), cust = byId(db.customers, form.customerId);
      var linked = db.invoices.filter(function (i) { return i.jobId === form.id; })[0];
      var pkgNames = Object.keys(s.prices);
      return h("div", null, h(Header, { title: form.id ? "Edit job" : "New job" }),
        h("div", { className: "cd-card" },
          h(Field, { label: "Customer" }, h(Sel, { value: form.customerId, options: [["", "Choose..."]].concat(db.customers.map(function (c) { return [c.id, c.name]; })), onChange: function (v) { set("customerId", v); } })),
          cust && cust.vehicles ? h("div", { className: "m", style: { fontSize: 12, color: "#5f6e7e" } }, "Saved vehicles: " + cust.vehicles) : null,
          h("div", { className: "cd-two" },
            h(Field, { label: "Date" }, h(In, { type: "date", value: form.date, onChange: function (v) { set("date", v); } })),
            h(Field, { label: "Time" }, h(In, { type: "time", value: form.time, onChange: function (v) { set("time", v); } }))),
          h(Field, { label: "Vehicle (year, make, model, color)" }, h(In, { value: form.vehicle, onChange: function (v) { set("vehicle", v); } })),
          h("div", { className: "cd-two" },
            h(Field, { label: "Vehicle size" }, h(Sel, { value: form.size, options: SIZES.map(function (x, i) { return [i, x]; }), onChange: function (v) { set("size", parseInt(v, 10)); } })),
            h(Field, { label: "Package" }, h(Sel, { value: form.package, options: pkgNames, onChange: function (v) { set("package", v); } }))),
          h("div", { className: "cd-chk" }, h("input", { type: "checkbox", checked: !!form.priceOverride, onChange: function (e) { set("priceOverride", e.target.checked); if (e.target.checked && form.basePrice === "") set("basePrice", t.base); } }), h("span", null, "Set my own base price")),
          form.priceOverride ? h(Field, { label: "Base price" }, h(In, { type: "number", value: form.basePrice, onChange: function (v) { set("basePrice", v); } })) : null,
          h("label", null, "Add-ons"),
          s.addons.map(function (a) {
            var on = arr(form.addons).filter(function (x) { return x.name === a[0]; })[0];
            return h("div", { className: "cd-chk", key: a[0] },
              h("input", { type: "checkbox", checked: !!on, onChange: function (e) { set("addons", e.target.checked ? arr(form.addons).concat([{ name: a[0], price: a[1] }]) : arr(form.addons).filter(function (x) { return x.name !== a[0]; })); } }),
              h("span", { style: { flex: 1 } }, a[0]),
              on ? h("input", { className: "cd-in", style: { width: 90 }, type: "number", value: on.price, onChange: function (e) { var v = e.target.value; set("addons", arr(form.addons).map(function (x) { return x.name === a[0] ? { name: x.name, price: v } : x; })); } }) : h("span", { className: "m", style: { color: "#5f6e7e" } }, money0(a[1])));
          }),
          h("div", { className: "cd-two" },
            h(Field, { label: "Travel fee" }, h(In, { type: "number", value: form.travel, onChange: function (v) { set("travel", v); } })),
            h(Field, { label: "Deposit paid" }, h(In, { type: "number", value: form.deposit, onChange: function (v) { set("deposit", v); } }))),
          h("div", { className: "cd-two" },
            h(Field, { label: "Discount" }, h(Sel, { value: form.discountType, options: [["none", "None"], ["founding", "Founding Customer " + s.foundingPct + "%"], ["referral", "Referral credit " + money0(s.referralCredit)], ["custom", "Custom amount"]], onChange: function (v) { set("discountType", v); } })),
            form.discountType === "custom" ? h(Field, { label: "Discount amount" }, h(In, { type: "number", value: form.discountAmt, onChange: function (v) { set("discountAmt", v); } })) : h("div", null)),
          h("div", { className: "cd-card", style: { background: "#f4f8fb" } },
            h("div", { className: "cd-row" }, h("span", null, "Base"), h("span", null, money(t.base))),
            t.addons ? h("div", { className: "cd-row" }, h("span", null, "Add-ons"), h("span", null, money(t.addons))) : null,
            t.travel ? h("div", { className: "cd-row" }, h("span", null, "Travel"), h("span", null, money(t.travel))) : null,
            t.discount ? h("div", { className: "cd-row" }, h("span", null, "Discount"), h("span", null, "-" + money(t.discount))) : null,
            t.tax ? h("div", { className: "cd-row" }, h("span", null, "Tax"), h("span", null, money(t.tax))) : null,
            h("div", { className: "cd-row" }, h("b", null, "Total"), h("b", null, money(t.total)))),
          h(Field, { label: "Status" }, h(Sel, { value: form.status, options: JOB_STATUS, onChange: function (v) { set("status", v); } })),
          h("label", null, "Checklist"),
          PHASES.map(function (ph, i) { return h("div", { className: "cd-chk", key: ph }, h("input", { type: "checkbox", checked: !!form.phases[i], onChange: function (e) { var o = Object.assign({}, form.phases); o[i] = e.target.checked; set("phases", o); } }), h("span", null, (i + 1) + ". " + ph)); }),
          h("label", null, "Products used" + (form.stockDeducted ? " (already taken out of stock)" : " (taken out of stock when the job is marked Done)")),
          arr(form.products).map(function (u, i) {
            return h("div", { className: "cd-two", key: i, style: { marginBottom: 6, gridTemplateColumns: "2fr 1fr auto" } },
              h(Sel, { value: u.itemId, options: [["", "Choose product..."]].concat(db.stock.map(function (x) { return [x.id, x.name]; })), onChange: function (v) { set("products", arr(form.products).map(function (x, k) { return k === i ? { itemId: v, qty: x.qty } : x; })); } }),
              h(In, { type: "number", value: u.qty, ph: "qty", onChange: function (v) { set("products", arr(form.products).map(function (x, k) { return k === i ? { itemId: x.itemId, qty: v } : x; })); } }),
              h(Btn, { kind: "sec", sm: true, onClick: function () { set("products", arr(form.products).filter(function (x, k) { return k !== i; })); } }, "x"));
          }),
          h(Btn, { kind: "sec", sm: true, onClick: function () { set("products", arr(form.products).concat([{ itemId: "", qty: 1 }])); } }, "+ Add product"),
          h(Field, { label: "Notes (before/after condition, damage, requests)" }, h("textarea", { rows: 3, value: form.notes || "", onChange: function (e) { set("notes", e.target.value); } })),
          h("div", { className: "cd-bar" },
            h(Btn, { onClick: function () { save(); } }, "Save"),
            linked ? h(Btn, { kind: "sec", onClick: function () { save(false); p.go("invoices", { edit: linked.id }); } }, "Open invoice " + linked.no) : h(Btn, { kind: "sec", onClick: makeInvoice }, "Save + create invoice"),
            h(Btn, { kind: "sec", onClick: function () { setForm(null); } }, "Cancel"),
            form.id ? h(Btn, { kind: "warn", onClick: function () { confirmDel("Delete this job?", function () { p.update(function (d) { return Object.assign({}, d, { jobs: d.jobs.filter(function (x) { return x.id !== form.id; }) }); }); setForm(null); }); } }, "Delete") : null)));
    }
    var list = db.jobs.filter(function (j) { return flt === "All" ? true : flt === "Active" ? (j.status === "Quote" || j.status === "Booked" || j.status === "In progress") : j.status === flt; }).sort(function (a, b) { return (b.date + (b.time || "")).localeCompare(a.date + (a.time || "")); });
    var pc = { Quote: "", Booked: "b", "In progress": "o", Done: "g", Canceled: "r" };
    return h("div", null, h(Header, { title: "Jobs", sub: "What each customer wants done, and what we used" }),
      h("div", { className: "cd-bar" }, h(Btn, { onClick: function () { setForm(newJob(s)); } }, "+ New job"),
        h("div", { style: { flex: 1, minWidth: 140 } }, h(Sel, { value: flt, options: ["Active", "All"].concat(JOB_STATUS), onChange: setFlt }))),
      h("div", { className: "cd-card" }, list.length ? list.map(function (j) {
        return h("div", { className: "cd-row", key: j.id, style: { cursor: "pointer" }, onClick: function () { setForm(j); } },
          h("div", null, h("div", { className: "t" }, custName(db, j.customerId)), h("div", { className: "m" }, fmtDate(j.date) + " - " + j.package + " - " + SIZES[j.size == null ? 0 : j.size])),
          h("div", { style: { textAlign: "right" } }, h("div", null, money0(jobTotals(j, s).total)), h(Pill, { c: pc[j.status] }, j.status)));
      }) : h(Empty, null, "No jobs here yet.")));
  }

  /* ---------- Invoices ---------- */
  function printInvoice(inv, db) {
    var s = db.settings, c = byId(db.customers, inv.customerId) || {}, t = invTotals(inv);
    var rows = arr(inv.lines).map(function (l) { return "<tr><td>" + esc(l.desc) + "</td><td style='text-align:right'>" + esc(l.qty) + "</td><td style='text-align:right'>" + money(l.price) + "</td><td style='text-align:right'>" + money(num(l.qty) * num(l.price)) + "</td></tr>"; }).join("");
    var pays = arr(inv.payments).map(function (pm) { return "<tr><td colspan='3'>Payment " + esc(fmtDate(pm.date)) + " " + esc(pm.method || "") + "</td><td style='text-align:right'>-" + money(pm.amount) + "</td></tr>"; }).join("");
    var html = "<!doctype html><html><head><meta charset='utf-8'><title>" + esc(inv.no) + "</title><style>body{font-family:Arial,sans-serif;color:#1b2733;max-width:720px;margin:24px auto;padding:0 16px}h1{margin:0;color:#0b1f33}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#0b1f33;color:#fff;text-align:left;padding:8px}td{padding:8px;border-bottom:1px solid #e1e8ef}.tot td{border:0;font-weight:bold}.s{color:#5f6e7e;font-size:13px}</style></head><body>" +
      "<h1>" + esc(s.bizName) + "</h1><div class='s'>" + esc([s.address, s.phone, s.email].filter(Boolean).join(" | ")) + "</div><hr>" +
      "<h2 style='margin:8px 0'>Invoice " + esc(inv.no) + "</h2><div class='s'>Date: " + esc(fmtDate(inv.date)) + (inv.due ? " &nbsp; Due: " + esc(fmtDate(inv.due)) : "") + "</div>" +
      "<p><b>Bill to:</b><br>" + esc(c.name || "") + "<br>" + esc(c.address || "") + "<br>" + esc(c.phone || "") + " " + esc(c.email || "") + "</p>" +
      "<table><tr><th>Description</th><th style='text-align:right'>Qty</th><th style='text-align:right'>Price</th><th style='text-align:right'>Amount</th></tr>" + rows +
      "<tr class='tot'><td colspan='3' style='text-align:right'>Subtotal</td><td style='text-align:right'>" + money(t.sub) + "</td></tr>" +
      (t.disc ? "<tr class='tot'><td colspan='3' style='text-align:right'>" + esc(inv.discountNote || "Discount") + "</td><td style='text-align:right'>-" + money(t.disc) + "</td></tr>" : "") +
      (t.tax ? "<tr class='tot'><td colspan='3' style='text-align:right'>Tax (" + esc(inv.taxRate) + "%)</td><td style='text-align:right'>" + money(t.tax) + "</td></tr>" : "") +
      "<tr class='tot'><td colspan='3' style='text-align:right'>Total</td><td style='text-align:right'>" + money(t.total) + "</td></tr>" + pays +
      "<tr class='tot'><td colspan='3' style='text-align:right'>Balance due</td><td style='text-align:right'>" + money(t.balance) + "</td></tr></table>" +
      "<p class='s'>" + esc(s.payNote) + "</p><p class='s'>" + esc(s.footer) + "</p><script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>";
    var w = window.open("", "_blank");
    if (!w) { alert("Please allow pop-ups to print or save the invoice as PDF."); return; }
    w.document.open(); w.document.write(html); w.document.close();
  }
  function Invoices(p) {
    var db = p.db, s = db.settings;
    var init = null;
    if (p.intent && p.intent.edit) init = byId(db.invoices, p.intent.edit) || null;
    var _f = useState(init), form = _f[0], setForm = _f[1];
    var _fl = useState("Open"), flt = _fl[0], setFlt = _fl[1];
    var _pay = useState({ amount: "", method: "Cash", date: todayStr() }), pay = _pay[0], setPay = _pay[1];
    function set(k, v) { var o = {}; o[k] = v; setForm(Object.assign({}, form, o)); }
    function saveInv(f, close) {
      p.update(function (d) { var exists = byId(d.invoices, f.id); return Object.assign({}, d, { invoices: exists ? d.invoices.map(function (x) { return x.id === f.id ? f : x; }) : d.invoices.concat([f]) }); });
      if (close) setForm(null); else setForm(f);
    }
    function blank() {
      var n = { id: uid(), no: "INV-" + s.nextInv, date: todayStr(), due: addDays(todayStr(), 7), customerId: "", jobId: "", lines: [{ id: uid(), desc: "", qty: 1, price: 0 }], discount: 0, discountNote: "", taxRate: num(s.taxRate), payments: [], notes: "" };
      p.update(function (d) { return Object.assign({}, d, { settings: Object.assign({}, d.settings, { nextInv: num(d.settings.nextInv) + 1 }) }); });
      return n;
    }
    if (form) {
      var t = invTotals(form), st = invStatus(form);
      return h("div", null, h(Header, { title: "Invoice " + form.no, sub: st }),
        h("div", { className: "cd-card" },
          h(Field, { label: "Customer" }, h(Sel, { value: form.customerId, options: [["", "Choose..."]].concat(db.customers.map(function (c) { return [c.id, c.name]; })), onChange: function (v) { set("customerId", v); } })),
          h("div", { className: "cd-two" }, h(Field, { label: "Date" }, h(In, { type: "date", value: form.date, onChange: function (v) { set("date", v); } })), h(Field, { label: "Due" }, h(In, { type: "date", value: form.due, onChange: function (v) { set("due", v); } }))),
          h("label", null, "Line items"),
          form.lines.map(function (l, i) {
            function setL(k, v) { var o = Object.assign({}, l); o[k] = v; set("lines", form.lines.map(function (x, n) { return n === i ? o : x; })); }
            return h("div", { key: l.id || i, style: { display: "grid", gridTemplateColumns: "3fr 1fr 1.4fr auto", gap: 6, marginBottom: 6 } },
              h(In, { value: l.desc, ph: "Description", onChange: function (v) { setL("desc", v); } }), h(In, { type: "number", value: l.qty, onChange: function (v) { setL("qty", v); } }), h(In, { type: "number", value: l.price, onChange: function (v) { setL("price", v); } }),
              h(Btn, { kind: "sec", sm: true, onClick: function () { set("lines", form.lines.filter(function (x, n) { return n !== i; })); } }, "x"));
          }),
          h(Btn, { kind: "sec", sm: true, onClick: function () { set("lines", form.lines.concat([{ id: uid(), desc: "", qty: 1, price: 0 }])); } }, "+ Add line"),
          h("div", { className: "cd-two" }, h(Field, { label: "Discount amount" }, h(In, { type: "number", value: form.discount, onChange: function (v) { set("discount", v); } })), h(Field, { label: "Discount note" }, h(In, { value: form.discountNote, onChange: function (v) { set("discountNote", v); } }))),
          h(Field, { label: "Tax %" }, h(In, { type: "number", value: form.taxRate, onChange: function (v) { set("taxRate", v); } })),
          h("div", { className: "cd-card", style: { background: "#f4f8fb", marginTop: 10 } },
            h("div", { className: "cd-row" }, h("span", null, "Subtotal"), h("span", null, money(t.sub))),
            t.disc ? h("div", { className: "cd-row" }, h("span", null, "Discount"), h("span", null, "-" + money(t.disc))) : null,
            t.tax ? h("div", { className: "cd-row" }, h("span", null, "Tax"), h("span", null, money(t.tax))) : null,
            h("div", { className: "cd-row" }, h("b", null, "Total"), h("b", null, money(t.total))),
            h("div", { className: "cd-row" }, h("span", null, "Paid"), h("span", null, money(t.paid))),
            h("div", { className: "cd-row" }, h("b", null, "Balance"), h("b", null, money(t.balance)))),
          h("h3", null, "Payments"),
          form.payments.map(function (pm) { return h("div", { className: "cd-row", key: pm.id }, h("span", null, fmtDate(pm.date) + " - " + pm.method), h("span", null, money(pm.amount), " ", h(Btn, { kind: "sec", sm: true, onClick: function () { set("payments", form.payments.filter(function (x) { return x.id !== pm.id; })); } }, "x"))); }),
          h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 6, marginTop: 6 } },
            h(In, { type: "number", value: pay.amount, ph: "Amount", onChange: function (v) { setPay(Object.assign({}, pay, { amount: v })); } }),
            h(Sel, { value: pay.method, options: ["Cash", "Card", "Check", "Zelle / Venmo / Cash App", "Deposit", "Other"], onChange: function (v) { setPay(Object.assign({}, pay, { method: v })); } }),
            h(In, { type: "date", value: pay.date, onChange: function (v) { setPay(Object.assign({}, pay, { date: v })); } }),
            h(Btn, { sm: true, onClick: function () { if (!num(pay.amount)) return; set("payments", form.payments.concat([{ id: uid(), date: pay.date, amount: num(pay.amount), method: pay.method }])); setPay({ amount: "", method: pay.method, date: todayStr() }); } }, "Add")),
          h(Btn, { kind: "sec", sm: true, onClick: function () { var bal = Math.max(0, t.balance); if (bal) set("payments", form.payments.concat([{ id: uid(), date: todayStr(), amount: bal, method: pay.method }])); } }, "Mark paid in full"),
          h(Field, { label: "Notes" }, h("textarea", { rows: 2, value: form.notes || "", onChange: function (e) { set("notes", e.target.value); } })),
          h("div", { className: "cd-bar" },
            h(Btn, { onClick: function () { saveInv(form, true); } }, "Save"),
            h(Btn, { kind: "sec", onClick: function () { saveInv(form, false); printInvoice(form, db); } }, "Print / save PDF"),
            h(Btn, { kind: "sec", onClick: function () { setForm(null); } }, "Close"),
            h(Btn, { kind: "warn", onClick: function () { confirmDel("Delete this invoice?", function () { p.update(function (d) { return Object.assign({}, d, { invoices: d.invoices.filter(function (x) { return x.id !== form.id; }) }); }); setForm(null); }); } }, "Delete"))));
    }
    var list = db.invoices.filter(function (i) { var st = invStatus(i); return flt === "All" ? true : flt === "Open" ? (st === "Unpaid" || st === "Partial" || st === "Overdue") : st === flt; }).sort(function (a, b) { return b.date.localeCompare(a.date); });
    var pc = { Paid: "g", Partial: "o", Unpaid: "b", Overdue: "r", Void: "" };
    return h("div", null, h(Header, { title: "Billing & invoices" }),
      h("div", { className: "cd-bar" }, h(Btn, { onClick: function () { setForm(blank()); } }, "+ New invoice"), h("div", { style: { flex: 1, minWidth: 140 } }, h(Sel, { value: flt, options: ["Open", "All", "Paid", "Overdue"], onChange: setFlt }))),
      h("div", { className: "cd-card" }, list.length ? list.map(function (i) {
        var t = invTotals(i), st = invStatus(i);
        return h("div", { className: "cd-row", key: i.id, style: { cursor: "pointer" }, onClick: function () { setForm(i); } },
          h("div", null, h("div", { className: "t" }, i.no + " - " + custName(db, i.customerId)), h("div", { className: "m" }, fmtDate(i.date))),
          h("div", { style: { textAlign: "right" } }, h("div", null, money(t.total)), h(Pill, { c: pc[st] }, st + (st === "Partial" || st === "Unpaid" || st === "Overdue" ? " " + money0(t.balance) : ""))));
      }) : h(Empty, null, "No invoices here. Create one from a job, or tap + New invoice.")));
  }

  /* ---------- Purchasing ---------- */
  function Buy(p) {
    var db = p.db;
    var _f = useState(null), form = _f[0], setForm = _f[1];
    var _fl = useState("To buy"), flt = _fl[0], setFlt = _fl[1];
    function set(k, v) { var o = {}; o[k] = v; setForm(Object.assign({}, form, o)); }
    function setStatus(it, status) {
      p.update(function (d) {
        var exp = d.expenses;
        var upd = Object.assign({}, it, { status: status, date: status === "To buy" ? "" : (it.date || todayStr()) });
        if (status === "Received" && !it.expenseId) {
          var amt = num(it.actual) || num(it.est) * num(it.qty || 1);
          var e = { id: uid(), date: todayStr(), cat: /Chemical|Storage|PPE/.test(it.cat) ? "Chemicals & supplies" : "Equipment", vendor: it.vendor || "", amount: amt, note: it.item, method: "" };
          exp = exp.concat([e]); upd.expenseId = e.id; upd.actual = amt;
        }
        return Object.assign({}, d, { expenses: exp, purchases: d.purchases.map(function (x) { return x.id === it.id ? upd : x; }) });
      });
    }
    function save() {
      if (!form.item) { alert("Please enter an item."); return; }
      p.update(function (d) { var f = Object.assign({}, form); var ex = byId(d.purchases, f.id); if (!f.id) f.id = uid(); return Object.assign({}, d, { purchases: ex ? d.purchases.map(function (x) { return x.id === f.id ? f : x; }) : d.purchases.concat([f]) }); });
      setForm(null);
    }
    if (form) return h("div", null, h(Header, { title: form.id ? "Edit item" : "Add purchase item" }),
      h("div", { className: "cd-card" },
        h(Field, { label: "Item" }, h(In, { value: form.item, onChange: function (v) { set("item", v); } })),
        h("div", { className: "cd-two" }, h(Field, { label: "Category" }, h(In, { value: form.cat, onChange: function (v) { set("cat", v); } })), h(Field, { label: "Store" }, h(In, { value: form.vendor, onChange: function (v) { set("vendor", v); } }))),
        h(Field, { label: "Product link" }, h(In, { value: form.url, onChange: function (v) { set("url", v); } })),
        h("div", { className: "cd-two" }, h(Field, { label: "Quantity" }, h(In, { type: "number", value: form.qty, onChange: function (v) { set("qty", v); } })), h(Field, { label: "Estimated price (each)" }, h(In, { type: "number", value: form.est, onChange: function (v) { set("est", v); } }))),
        h("div", { className: "cd-two" }, h(Field, { label: "Actual price paid (total)" }, h(In, { type: "number", value: form.actual, onChange: function (v) { set("actual", v); } })), h(Field, { label: "Status" }, h(Sel, { value: form.status, options: ["To buy", "Ordered", "Received"], onChange: function (v) { set("status", v); } }))),
        h("div", { className: "cd-bar" }, h(Btn, { onClick: save }, "Save"), h(Btn, { kind: "sec", onClick: function () { setForm(null); } }, "Cancel"),
          form.id ? h(Btn, { kind: "warn", onClick: function () { confirmDel("Delete this item?", function () { p.update(function (d) { return Object.assign({}, d, { purchases: d.purchases.filter(function (x) { return x.id !== form.id; }) }); }); setForm(null); }); } }, "Delete") : null)));
    var list = db.purchases.filter(function (x) { return flt === "All" || x.status === flt; });
    var cats = {}; list.forEach(function (x) { (cats[x.cat || "Other"] = cats[x.cat || "Other"] || []).push(x); });
    var total = list.reduce(function (t, x) { return t + (num(x.actual) || num(x.est) * num(x.qty || 1)); }, 0);
    return h("div", null, h(Header, { title: "Purchasing", sub: "Shopping list with store links. Marking an item Received adds it to expenses." }),
      h("div", { className: "cd-bar" }, h(Btn, { onClick: function () { setForm({ id: "", cat: "Other", item: "", vendor: "", url: "", est: 0, actual: 0, qty: 1, status: "To buy" }); } }, "+ Add item"), h("div", { style: { flex: 1, minWidth: 140 } }, h(Sel, { value: flt, options: ["To buy", "Ordered", "Received", "All"], onChange: setFlt }))),
      h("div", { className: "sub" }, list.length + " items, about " + money0(total)),
      Object.keys(cats).map(function (cat) {
        return h("div", { className: "cd-card", key: cat }, h("h3", null, cat),
          cats[cat].map(function (x) {
            return h("div", { className: "cd-row", key: x.id },
              h("div", { style: { flex: 1, cursor: "pointer" }, onClick: function () { setForm(x); } }, h("div", { className: "t" }, x.item), h("div", { className: "m" }, (x.vendor || "no store") + " - " + money0(num(x.actual) || num(x.est) * num(x.qty || 1)) + (x.url ? "" : ""))),
              h("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, x.url ? h("a", { href: x.url, target: "_blank", rel: "noopener noreferrer" }, "Open") : null,
                h("select", { value: x.status, style: { width: 100, padding: 6, fontSize: 13 }, onChange: function (e) { setStatus(x, e.target.value); } }, ["To buy", "Ordered", "Received"].map(function (o) { return h("option", { key: o, value: o }, o); }))));
          }));
      }),
      !list.length ? h(Empty, null, "Nothing here.") : null);
  }

  /* ---------- Supplies (stock) ---------- */
  function Stock(p) {
    var db = p.db;
    var _f = useState(null), form = _f[0], setForm = _f[1];
    function set(k, v) { var o = {}; o[k] = v; setForm(Object.assign({}, form, o)); }
    function adj(it, d) { p.update(function (x) { return Object.assign({}, x, { stock: x.stock.map(function (y) { return y.id === it.id ? Object.assign({}, y, { onHand: Math.round((num(y.onHand) + d) * 100) / 100 }) : y; }) }); }); }
    function save() {
      if (!form.name) { alert("Please enter a name."); return; }
      p.update(function (d) { var f = Object.assign({}, form); var ex = byId(d.stock, f.id); if (!f.id) f.id = uid(); return Object.assign({}, d, { stock: ex ? d.stock.map(function (x) { return x.id === f.id ? f : x; }) : d.stock.concat([f]) }); });
      setForm(null);
    }
    if (form) return h("div", null, h(Header, { title: form.id ? "Edit product" : "Add product" }),
      h("div", { className: "cd-card" },
        h(Field, { label: "Product name" }, h(In, { value: form.name, onChange: function (v) { set("name", v); } })),
        h("div", { className: "cd-two" }, h(Field, { label: "Unit (gal, bottle, each...)" }, h(In, { value: form.unit, onChange: function (v) { set("unit", v); } })), h(Field, { label: "Cost per unit" }, h(In, { type: "number", value: form.cost, onChange: function (v) { set("cost", v); } }))),
        h("div", { className: "cd-two" }, h(Field, { label: "On hand" }, h(In, { type: "number", value: form.onHand, onChange: function (v) { set("onHand", v); } })), h(Field, { label: "Reorder when at or below" }, h(In, { type: "number", value: form.reorder, onChange: function (v) { set("reorder", v); } }))),
        h("div", { className: "cd-bar" }, h(Btn, { onClick: save }, "Save"), h(Btn, { kind: "sec", onClick: function () { setForm(null); } }, "Cancel"),
          form.id ? h(Btn, { kind: "warn", onClick: function () { confirmDel("Delete this product?", function () { p.update(function (d) { return Object.assign({}, d, { stock: d.stock.filter(function (x) { return x.id !== form.id; }) }); }); setForm(null); }); } }, "Delete") : null)));
    var value = db.stock.reduce(function (t, x) { return t + num(x.onHand) * num(x.cost); }, 0);
    return h("div", null, h(Header, { title: "Supplies on hand", sub: "Products are used up automatically when a job is marked Done. Stock value " + money0(value) }),
      h("div", { className: "cd-bar" }, h(Btn, { onClick: function () { setForm({ id: "", name: "", unit: "each", cost: 0, onHand: 0, reorder: 1 }); } }, "+ Add product")),
      h("div", { className: "cd-card" }, db.stock.length ? db.stock.map(function (x) {
        var low = num(x.onHand) <= num(x.reorder);
        return h("div", { className: "cd-row", key: x.id },
          h("div", { style: { flex: 1, cursor: "pointer" }, onClick: function () { setForm(x); } }, h("div", { className: "t" }, x.name), h("div", { className: "m" }, money(x.cost) + " per " + x.unit)),
          h("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, low ? h(Pill, { c: "o" }, "Low") : null,
            h(Btn, { kind: "sec", sm: true, onClick: function () { adj(x, -1); } }, "-"), h("b", { style: { minWidth: 34, textAlign: "center" } }, x.onHand), h(Btn, { kind: "sec", sm: true, onClick: function () { adj(x, 1); } }, "+")));
      }) : h(Empty, null, "No products yet.")));
  }

  /* ---------- Money (expenses, mileage, reports) ---------- */
  function Money(p) {
    var db = p.db, s = db.settings;
    var _t = useState("Report"), tab = _t[0], setTab = _t[1];
    var _f = useState(p.intent && p.intent.new ? { id: "", date: todayStr(), cat: "Equipment", vendor: "", amount: "", note: "", method: "" } : null), form = _f[0], setForm = _f[1];
    var _m = useState({ date: todayStr(), miles: "", purpose: "" }), mi = _m[0], setMi = _m[1];
    function set(k, v) { var o = {}; o[k] = v; setForm(Object.assign({}, form, o)); }
    function save() {
      if (!num(form.amount)) { alert("Please enter an amount."); return; }
      p.update(function (d) { var f = Object.assign({}, form); var ex = byId(d.expenses, f.id); if (!f.id) f.id = uid(); return Object.assign({}, d, { expenses: ex ? d.expenses.map(function (x) { return x.id === f.id ? f : x; }) : d.expenses.concat([f]) }); });
      setForm(null);
    }
    var tabs = h("div", { className: "cd-nav", style: { position: "static" } }, ["Report", "Expenses", "Mileage"].map(function (x) { return h("button", { key: x, className: x === tab ? "on" : "", onClick: function () { setTab(x); setForm(null); } }, x); }));
    if (form) return h("div", null, h(Header, { title: form.id ? "Edit expense" : "New expense" }),
      h("div", { className: "cd-card" },
        h("div", { className: "cd-two" }, h(Field, { label: "Date" }, h(In, { type: "date", value: form.date, onChange: function (v) { set("date", v); } })), h(Field, { label: "Amount" }, h(In, { type: "number", value: form.amount, onChange: function (v) { set("amount", v); } }))),
        h("div", { className: "cd-two" }, h(Field, { label: "Category" }, h(Sel, { value: form.cat, options: EXP_CATS, onChange: function (v) { set("cat", v); } })), h(Field, { label: "Store / vendor" }, h(In, { value: form.vendor, onChange: function (v) { set("vendor", v); } }))),
        h(Field, { label: "What was it for?" }, h(In, { value: form.note, onChange: function (v) { set("note", v); } })),
        h("div", { className: "cd-bar" }, h(Btn, { onClick: save }, "Save"), h(Btn, { kind: "sec", onClick: function () { setForm(null); } }, "Cancel"),
          form.id ? h(Btn, { kind: "warn", onClick: function () { confirmDel("Delete this expense?", function () { p.update(function (d) { return Object.assign({}, d, { expenses: d.expenses.filter(function (x) { return x.id !== form.id; }) }); }); setForm(null); }); } }, "Delete") : null)));
    var body;
    if (tab === "Expenses") {
      var ex = db.expenses.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
      body = h("div", null, h("div", { className: "cd-bar" }, h(Btn, { onClick: function () { setForm({ id: "", date: todayStr(), cat: "Equipment", vendor: "", amount: "", note: "", method: "" }); } }, "+ Add expense")),
        h("div", { className: "cd-card" }, ex.length ? ex.map(function (e) { return h("div", { className: "cd-row", key: e.id, style: { cursor: "pointer" }, onClick: function () { setForm(e); } }, h("div", null, h("div", { className: "t" }, e.note || e.cat), h("div", { className: "m" }, fmtDate(e.date) + " - " + e.cat + (e.vendor ? " - " + e.vendor : ""))), h("b", null, money(e.amount))); }) : h(Empty, null, "No expenses yet.")));
    } else if (tab === "Mileage") {
      var ml = db.mileage.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
      var totalMi = ml.reduce(function (t, x) { return t + num(x.miles); }, 0);
      body = h("div", null, h("div", { className: "sub" }, totalMi + " miles logged" + (num(s.mileageRate) ? ", deduction about " + money0(totalMi * num(s.mileageRate)) : ". Enter the current IRS mileage rate in Settings to see a deduction.")),
        h("div", { className: "cd-card" }, h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, h(In, { type: "date", value: mi.date, onChange: function (v) { setMi(Object.assign({}, mi, { date: v })); } }), h(In, { type: "number", value: mi.miles, ph: "Miles", onChange: function (v) { setMi(Object.assign({}, mi, { miles: v })); } })),
          h("div", { style: { marginTop: 6 } }, h(In, { value: mi.purpose, ph: "Where to / purpose", onChange: function (v) { setMi(Object.assign({}, mi, { purpose: v })); } })),
          h("div", { className: "cd-bar" }, h(Btn, { onClick: function () { if (!num(mi.miles)) return; p.update(function (d) { return Object.assign({}, d, { mileage: d.mileage.concat([{ id: uid(), date: mi.date, miles: num(mi.miles), purpose: mi.purpose }]) }); }); setMi({ date: todayStr(), miles: "", purpose: "" }); } }, "Add trip"))),
        h("div", { className: "cd-card" }, ml.map(function (x) { return h("div", { className: "cd-row", key: x.id }, h("div", null, h("div", { className: "t" }, x.miles + " miles"), h("div", { className: "m" }, fmtDate(x.date) + " - " + (x.purpose || ""))), h(Btn, { kind: "sec", sm: true, onClick: function () { p.update(function (d) { return Object.assign({}, d, { mileage: d.mileage.filter(function (y) { return y.id !== x.id; }) }); }); } }, "x")); })));
    } else {
      var months = {};
      function mk(m) { return months[m] = months[m] || { rev: 0, exp: 0, jobs: 0 }; }
      db.invoices.forEach(function (i) { arr(i.payments).forEach(function (pm) { mk(monthOf(pm.date)).rev += num(pm.amount); }); });
      db.expenses.forEach(function (e) { mk(monthOf(e.date)).exp += num(e.amount); });
      db.jobs.forEach(function (j) { if (j.status === "Done") mk(monthOf(j.date)).jobs += 1; });
      var keys = Object.keys(months).filter(Boolean).sort().reverse();
      var byPkg = {}; db.jobs.filter(function (j) { return j.status === "Done"; }).forEach(function (j) { byPkg[j.package] = (byPkg[j.package] || 0) + 1; });
      var allRev = keys.reduce(function (t, k) { return t + months[k].rev; }, 0), allExp = keys.reduce(function (t, k) { return t + months[k].exp; }, 0);
      body = h("div", null,
        h("div", { className: "cd-grid" }, h("div", { className: "cd-stat" }, h("b", null, money0(allRev)), h("span", null, "Collected, all time")), h("div", { className: "cd-stat" }, h("b", null, money0(allExp)), h("span", null, "Expenses, all time")), h("div", { className: "cd-stat" }, h("b", null, money0(allRev - allExp)), h("span", null, "Profit before owner pay"))),
        h("div", { className: "cd-card" }, h("h3", null, "By month"), keys.length ? h("table", null, h("thead", null, h("tr", null, ["Month", "Jobs", "Collected", "Expenses", "Profit"].map(function (x) { return h("th", { key: x }, x); }))),
          h("tbody", null, keys.map(function (k) { var m = months[k]; return h("tr", { key: k }, h("td", null, k), h("td", null, m.jobs), h("td", null, money0(m.rev)), h("td", null, money0(m.exp)), h("td", null, h("b", null, money0(m.rev - m.exp)))); }))) : h(Empty, null, "Numbers appear once you record payments and expenses.")),
        h("div", { className: "cd-card" }, h("h3", null, "Completed jobs by package"), Object.keys(byPkg).length ? Object.keys(byPkg).map(function (k) { return h("div", { className: "cd-row", key: k }, h("span", null, k), h("b", null, byPkg[k])); }) : h(Empty, null, "None yet.")),
        h("div", { className: "cd-bar" }, h(Btn, { kind: "sec", onClick: function () {
          var rows = [["Type", "Date", "Customer / vendor", "Description", "Amount"]];
          db.invoices.forEach(function (i) { arr(i.payments).forEach(function (pm) { rows.push(["Income", pm.date, custName(db, i.customerId), i.no + " " + (pm.method || ""), num(pm.amount)]); }); });
          db.expenses.forEach(function (e) { rows.push(["Expense", e.date, e.vendor, e.cat + ": " + (e.note || ""), -num(e.amount)]); });
          download("car-detailing-books.csv", toCsv(rows), "text/csv");
        } }, "Export income + expenses (CSV)")));
    }
    return h("div", null, h(Header, { title: "Money", sub: "Income comes from invoice payments. Profit shown is before owner pay and taxes." }), tabs, body);
  }

  /* ---------- Settings ---------- */
  function Settings(p) {
    var db = p.db, s = db.settings;
    function setS(k, v) { p.update(function (d) { var o = {}; o[k] = v; return Object.assign({}, d, { settings: Object.assign({}, d.settings, o) }); }); }
    function setPrice(name, i, v) { p.update(function (d) { var pr = Object.assign({}, d.settings.prices); var row = pr[name].slice(); row[i] = v; pr[name] = row; return Object.assign({}, d, { settings: Object.assign({}, d.settings, { prices: pr }) }); }); }
    function setAddon(i, v) { p.update(function (d) { var a = d.settings.addons.map(function (x) { return x.slice(); }); a[i][1] = v; return Object.assign({}, d, { settings: Object.assign({}, d.settings, { addons: a }) }); }); }
    var fileRef = useRef(null);
    return h("div", null, h(Header, { title: "Settings", sub: "Business details, price list and backups" }),
      h("div", { className: "cd-card" }, h("h3", null, "Business"),
        h(Field, { label: "Business name" }, h(In, { value: s.bizName, onChange: function (v) { setS("bizName", v); } })),
        h("div", { className: "cd-two" }, h(Field, { label: "Phone" }, h(In, { value: s.phone, onChange: function (v) { setS("phone", v); } })), h(Field, { label: "Email" }, h(In, { value: s.email, onChange: function (v) { setS("email", v); } }))),
        h(Field, { label: "Address" }, h(In, { value: s.address, onChange: function (v) { setS("address", v); } })),
        h(Field, { label: "Payment note on invoices" }, h(In, { value: s.payNote, onChange: function (v) { setS("payNote", v); } })),
        h("div", { className: "cd-two" }, h(Field, { label: "Sales tax % (0 until you confirm with SC DOR)" }, h(In, { type: "number", value: s.taxRate, onChange: function (v) { setS("taxRate", v); } })), h(Field, { label: "IRS mileage rate ($/mile)" }, h(In, { type: "number", value: s.mileageRate, onChange: function (v) { setS("mileageRate", v); } })))),
      h("div", { className: "cd-card" }, h("h3", null, "Founding Customer offer"),
        h("div", { className: "cd-two" }, h(Field, { label: "Spots" }, h(In, { type: "number", value: s.foundingLimit, onChange: function (v) { setS("foundingLimit", v); } })), h(Field, { label: "Percent off first service" }, h(In, { type: "number", value: s.foundingPct, onChange: function (v) { setS("foundingPct", v); } }))),
        h(Field, { label: "Referral credit ($)" }, h(In, { type: "number", value: s.referralCredit, onChange: function (v) { setS("referralCredit", v); } }))),
      h("div", { className: "cd-card" }, h("h3", null, "Price list"),
        h("table", null, h("thead", null, h("tr", null, h("th", null, "Package"), SIZES.map(function (x) { return h("th", { key: x }, x); }))),
          h("tbody", null, Object.keys(s.prices).map(function (k) { return h("tr", { key: k }, h("td", null, k), [0, 1, 2].map(function (i) { return h("td", { key: i }, h("input", { className: "cd-in", style: { padding: 6, fontSize: 14 }, type: "number", value: s.prices[k][i], onChange: function (e) { setPrice(k, i, e.target.value); } })); })); }))),
        h("h3", { style: { marginTop: 12 } }, "Add-on default prices"),
        s.addons.map(function (a, i) { return h("div", { className: "cd-row", key: a[0] }, h("span", null, a[0]), h("input", { className: "cd-in", style: { width: 90, padding: 6 }, type: "number", value: a[1], onChange: function (e) { setAddon(i, e.target.value); } })); })),
      h("div", { className: "cd-card" }, h("h3", null, "Backup"),
        h("div", { className: "cd-bar" },
          h(Btn, { kind: "sec", onClick: function () { download("car-detailing-backup.json", JSON.stringify(db, null, 1), "application/json"); } }, "Download backup"),
          h(Btn, { kind: "sec", onClick: function () { if (fileRef.current) fileRef.current.click(); } }, "Restore from backup")),
        h("input", { ref: fileRef, type: "file", accept: ".json,application/json", style: { display: "none" }, onChange: function (e) {
          var f = e.target.files && e.target.files[0]; if (!f) return; var r = new FileReader();
          r.onload = function () { try { var d = normalize(JSON.parse(r.result)); if (window.confirm("Replace everything in Car Detailing with this backup?")) p.update(function () { return d; }); } catch (x) { alert("That file could not be read."); } };
          r.readAsText(f); e.target.value = "";
        } })));
  }

  /* ---------- Main ---------- */
  var TABS = [["home", "Home"], ["customers", "Customers"], ["jobs", "Jobs"], ["invoices", "Invoices"], ["buy", "Purchasing"], ["stock", "Supplies"], ["money", "Money"], ["settings", "Settings"]];
  function CarDetailingTab(props) {
    var st = useStore(props), db = st[0], update = st[1];
    var _t = useState({ name: "home", intent: null, k: 0 }), view = _t[0], setView = _t[1];
    useEffect(function () {
      if (document.getElementById("cd-style")) return;
      var el = document.createElement("style"); el.id = "cd-style"; el.textContent = CSS; document.head.appendChild(el);
    }, []);
    if (props.isAdmin === false) return h("div", { className: "cd" }, h("div", { className: "cd-empty" }, "This tab is for the administrator."));
    if (!db) return h("div", { className: "cd" }, h("div", { className: "cd-empty" }, "Loading..."));
    function go(name, intent) { setView({ name: name, intent: intent || null, k: view.k + 1 }); }
    var P = { db: db, update: update, go: go, intent: view.intent };
    var screens = { home: Home, customers: Customers, jobs: Jobs, invoices: Invoices, buy: Buy, stock: Stock, money: Money, settings: Settings };
    return h("div", { className: "cd" },
      h("div", { className: "cd-nav" }, TABS.map(function (t) { return h("button", { key: t[0], className: view.name === t[0] ? "on" : "", onClick: function () { go(t[0]); } }, t[1]); })),
      h(screens[view.name], Object.assign({ key: view.name + view.k }, P)));
  }

  CarDetailingTab._calc = { jobTotals: jobTotals, invTotals: invTotals, invStatus: invStatus, normalize: normalize, seed: seed, blankDb: blankDb };
  root.CarDetailingTab = CarDetailingTab;
  if (typeof module !== "undefined" && module.exports) module.exports = CarDetailingTab;
})(typeof window !== "undefined" ? window : globalThis);
