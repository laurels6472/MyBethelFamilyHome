// ═══ SOP MODULE ═══
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// ═══ SOP MODULE — E&L SERVICES & SALES ════════════════════════════════════════
// Style: Sales SOP template with bubblegum pink (#F48FB1) accent
// Admin: full CRUD. Children/staff: sticky note comments only.

var SOP_COLORS = {
  primary: '#1A73E8',
  // Blue
  secondary: '#4CAF82',
  // Green
  accent: '#F48FB1',
  // Bubblegum pink
  header: 'linear-gradient(135deg,#1a1a3e,#2a1a3e)',
  rowAlt: 'rgba(244,143,177,.04)',
  rowBorder: 'rgba(244,143,177,.15)',
  sectionBg: 'rgba(26,115,232,.07)'
};
var SOP_DEPARTMENTS = [{
  id: 'kitchen',
  name: 'Kitchen',
  emoji: '🍳',
  color: '#FF9800'
}, {
  id: 'laundry',
  name: 'Laundry',
  emoji: '👕',
  color: '#2196F3'
}, {
  id: 'cleaning',
  name: 'Cleaning',
  emoji: '🧹',
  color: '#4CAF50'
}, {
  id: 'animals',
  name: 'Animal Care',
  emoji: '🐾',
  color: '#9C27B0'
}, {
  id: 'yard',
  name: 'Yard & Outdoor',
  emoji: '🌿',
  color: '#33B679'
}, {
  id: 'school',
  name: 'School/DKA',
  emoji: '📚',
  color: '#9C8DC4'
}, {
  id: 'business',
  name: 'Business/VA',
  emoji: '💼',
  color: '#E67C73'
}, {
  id: 'vehicles',
  name: 'Vehicles',
  emoji: '🚗',
  color: '#795548'
}];

// Default pre-filled SOPs per department
var DEFAULT_SOPS = {
  kitchen: [{
    id: 'kit_daily_clean',
    dept: 'kitchen',
    freq: 'Daily',
    taskNum: 1,
    title: 'Post-Meal Kitchen 6S Reset',
    assignedTo: '',
    assignedBy: 'Laurel',
    version: '1.0',
    effectiveDate: '2026-08-24',
    purpose: 'Ensure the kitchen is clean, safe, and reset to standard after every meal.',
    scope: 'Applies to all family members participating in meal preparation and cleanup.',
    supplies: [['Dish soap', 'Under sink'], ['Surface cleaner spray', 'Cabinet above sink'], ['Microfiber cloths', 'Drawer by stove'], ['Trash bags', 'Under sink cabinet']],
    steps: ['Rinse all dishes and load dishwasher or wash by hand.', 'Wipe down all countertops with surface cleaner.', 'Clean stovetop — remove burner grates and wipe under them.', 'Empty and reline trash and compost bins.', 'Sweep floor, then mop if needed.', 'Return all items to their assigned home location (6S standard).', 'Final check — counters clear, sink empty, floor clean.'],
    inspectionCriteria: 'Zero items on counter. Sink empty and dry. Floor swept. No food residue on stovetop.',
    resources: [['Cleaning supply vendor', 'Amazon Subscribe & Save'], ['6S Reference Chart', 'Posted on refrigerator']],
    notes: [],
    status: 'active'
  }, {
    id: 'kit_weekly',
    dept: 'kitchen',
    freq: 'Weekly',
    taskNum: 2,
    title: 'Deep Clean Kitchen',
    assignedTo: '',
    assignedBy: 'Laurel',
    version: '1.0',
    effectiveDate: '2026-08-24',
    purpose: 'Full deep clean of all kitchen surfaces, appliances, and storage areas.',
    scope: 'All family members on rotation. Weekly on Saturday morning.',
    supplies: [['Degreaser', 'Cleaning caddy'], ['Oven cleaner', 'Under sink'], ['Refrigerator shelf liner cleaner', 'Cabinet'], ['Scrub brush set', 'Cabinet']],
    steps: ['Remove everything from refrigerator, wipe all shelves, check expiration dates.', 'Clean inside of microwave with damp cloth and baking soda.', 'Degrease cabinet fronts and handles.', 'Clean oven interior per oven cleaner instructions.', 'Wipe inside of all drawers.', 'Mop entire floor with hot water and cleaner.', 'Restock and organize pantry — pull forward, push back.'],
    inspectionCriteria: 'Refrigerator organized. Oven clean. Cabinets wiped. Floor mopped.',
    resources: [['Cleaning schedule', 'Posted on board'], ['Food storage guide', 'Laminated in pantry']],
    notes: [],
    status: 'active'
  }],
  laundry: [{
    id: 'lau_daily',
    dept: 'laundry',
    freq: 'Daily',
    taskNum: 1,
    title: 'Daily Laundry Cycle',
    assignedTo: '',
    assignedBy: 'Laurel',
    version: '1.0',
    effectiveDate: '2026-08-24',
    purpose: 'Keep laundry current — wash, dry, fold, and return to owner same day.',
    scope: 'Assigned Bethel Operations Laundry Lead each month.',
    supplies: [['Laundry detergent', 'Laundry room shelf'], ['Fabric softener', 'Laundry room shelf'], ['Dryer sheets', 'Laundry room shelf'], ['Laundry baskets', 'Each bedroom']],
    steps: ['Collect all dirty laundry from bedrooms by 8:30 AM.', 'Sort by color — whites, darks, colors.', 'Load washer — do NOT overfill.', 'Transfer to dryer promptly when cycle ends.', 'Fold within 30 minutes of dryer finishing.', 'Return all items to correct owner — do not leave folded on beds unput-away.', 'Reset laundry room — wipe washer/dryer tops, clear lint trap.'],
    inspectionCriteria: 'All clothes washed, dried, folded, and put away by 6 PM. Lint trap cleaned. Washer door left open.',
    resources: [['Laundry room schedule', 'Posted above washer'], ['Fabric care symbols chart', 'Laminated near washer']],
    notes: [],
    status: 'active'
  }],
  cleaning: [{
    id: 'cln_daily_rooms',
    dept: 'cleaning',
    freq: 'Daily',
    taskNum: 1,
    title: 'Bedroom 6S Reset',
    assignedTo: '',
    assignedBy: 'Laurel',
    version: '1.0',
    effectiveDate: '2026-08-24',
    purpose: 'Every bedroom resets to 6S standard each evening before bed.',
    scope: 'Each child maintains their own room. Laurel and Eric maintain master bedroom.',
    supplies: [['Trash bag', 'Bedroom trash can'], ['Wipe cloth', 'Each room'], ['Hamper', 'Each bedroom']],
    steps: ['Remove all items from floor — everything has a home.', 'Make bed — sheets tucked, pillows arranged.', 'Clear desk/workspace surface completely.', 'Put dirty clothes in hamper only — nothing on floor.', 'Wipe desk surface and nightstand.', 'Quick dust of surfaces with dry cloth.', 'Final check: floor clear, bed made, surfaces wiped.'],
    inspectionCriteria: 'Floor clear. Bed made. Desk cleared. Hamper used. Surfaces dusted.',
    resources: [['6S room standard photos', 'Posted inside each closet door']],
    notes: [],
    status: 'active'
  }, {
    id: 'cln_bathrooms',
    dept: 'cleaning',
    freq: 'Daily',
    taskNum: 2,
    title: 'Bathroom Daily Reset',
    assignedTo: '',
    assignedBy: 'Laurel',
    version: '1.0',
    effectiveDate: '2026-08-24',
    purpose: 'All bathrooms clean, sanitized, and stocked each morning.',
    scope: 'Assigned Bethel Ops member. All household bathrooms.',
    supplies: [['Toilet brush and cleaner', 'Each bathroom cabinet'], ['Surface spray', 'Each bathroom'], ['Paper towels or cloths', 'Each bathroom'], ['Extra toilet paper', 'Closet']],
    steps: ['Squirt toilet bowl cleaner and let sit 5 minutes.', 'Wipe mirror with glass cleaner.', 'Wipe sink and faucet.', 'Wipe down countertop and remove clutter.', 'Scrub toilet bowl, wipe seat/tank/outside.', 'Wipe floor around toilet and near sink.', 'Check and restock toilet paper, soap, and paper towels.'],
    inspectionCriteria: 'Toilet clean inside and out. Mirror streak-free. Sink clean. Floor dry. Paper products stocked.',
    resources: [],
    notes: [],
    status: 'active'
  }],
  animals: [{
    id: 'ani_daily',
    dept: 'animals',
    freq: 'Daily',
    taskNum: 1,
    title: 'Pet Daily Care Routine',
    assignedTo: '',
    assignedBy: 'Laurel',
    version: '1.0',
    effectiveDate: '2026-08-24',
    purpose: 'Ensure Khaniikos Kappa, Skyli Enia, and S\'Moresey are fed, watered, and cared for daily.',
    scope: 'Assigned Bethel Ops Animal Care Supervisor each month.',
    supplies: [['Dog food (Khaniikos Kappa)', 'Pantry'], ['Dog food (Skyli Enia)', 'Pantry'], ['Rabbit pellets (S\'Moresey)', 'Pantry shelf'], ['Fresh vegetables for rabbit', 'Refrigerator'], ['Water bowls x3', 'Under sink']],
    steps: ['Fill fresh water bowls for all 3 pets — wash bowls first.', 'Measure and serve morning meal for Khaniikos Kappa (per vet instructions).', 'Measure and serve morning meal for Skyli Enia (per vet instructions).', 'Prepare S\'Moresey\'s meal: fresh pellets + leafy greens + check hay level.', 'Clean rabbit litter box if needed.', 'Check all pets for any health concerns — record anything unusual.', 'Serve evening meals and refresh water before 6 PM.'],
    inspectionCriteria: 'All pets fed twice. Water fresh. Rabbit litter clean. Any health issues reported to Laurel.',
    resources: [['Vet contact', 'On refrigerator emergency card'], ['Pet feeding chart', 'Posted in pantry']],
    notes: [],
    status: 'active'
  }],
  yard: [{
    id: 'yard_weekly',
    dept: 'yard',
    freq: 'Weekly',
    taskNum: 1,
    title: 'Yard Maintenance',
    assignedTo: '',
    assignedBy: 'Laurel',
    version: '1.0',
    effectiveDate: '2026-08-24',
    purpose: 'Maintain curb appeal and safe outdoor spaces for family and pets.',
    scope: 'All outdoor areas of the Argilan family home, Fort Mill SC.',
    supplies: [['Lawn mower', 'Garage'], ['Weed trimmer', 'Garage'], ['Rake', 'Garage'], ['Leaf blower', 'Garage'], ['Trash bags', 'Garage shelf']],
    steps: ['Walk entire yard to pick up pet waste before mowing.', 'Mow front yard in overlapping rows.', 'Mow back yard in overlapping rows.', 'Edge along sidewalks and driveway.', 'Trim around fence, trees, and beds.', 'Blow clippings off driveway and walkway.', 'Bag and dispose of all clippings properly.'],
    inspectionCriteria: 'Lawn even. Edges clean. Driveway and walks clear of clippings. No pet waste on lawn.',
    resources: [],
    notes: [],
    status: 'active'
  }],
  school: [{
    id: 'sch_daily_setup',
    dept: 'school',
    freq: 'Daily',
    taskNum: 1,
    title: 'DKA Classroom Setup',
    assignedTo: 'Laurel',
    assignedBy: 'Laurel',
    version: '1.0',
    effectiveDate: '2026-08-24',
    purpose: 'Prepare the school area before 8:00 AM for morning worship and full day of instruction.',
    scope: 'Lead Educator (Laurel). DKA classroom area.',
    supplies: [['Whiteboard markers', 'School desk drawer'], ['Daily Text printout', 'Printer'], ['Song book / JW app', 'iPad'], ['Assignment sheets', 'Printer or binder']],
    steps: ['Pull up today\'s Daily Text at wol.jw.org by 7:50 AM.', 'Cue today\'s Kingdom Song on JW app.', 'Set out assignment sheets for each child.', 'MyBethelFamilyHome app open and logged into teacher mode.', 'Verify all children are at their seats by 8:00 AM.', 'Lead Morning Worship — text, song, prayer, dig deeper.'],
    inspectionCriteria: 'All materials ready by 8 AM. Each child has assignments. Daily Text read. Song sung.',
    resources: [['JW Daily Text', 'https://wol.jw.org/en/wol/h/r1/lp-e'], ['Kingdom Songs', 'https://www.jw.org/en/library/music-songs/']],
    notes: [],
    status: 'active'
  }],
  business: [{
    id: 'biz_weekly_admin',
    dept: 'business',
    freq: 'Weekly',
    taskNum: 1,
    title: 'VA & Business Weekly Admin Review',
    assignedTo: 'Laurel',
    assignedBy: 'Laurel',
    version: '1.0',
    effectiveDate: '2026-08-24',
    purpose: 'Keep E&L Services accounts, communications, and deliverables current each week.',
    scope: 'Laurel Argilan, VA Services. Every Monday morning.',
    supplies: [['Laptop', 'Home office'], ['Zoho CRM access', 'Zoho One login'], ['Client task board', 'Zoho Projects'], ['Invoice system', 'Zoho Books']],
    steps: ['Check all client inboxes — respond to any unanswered messages.', 'Review open tasks in Zoho Projects — update statuses.', 'Check Zoho Books — any unpaid invoices over 7 days old? Follow up.', 'Review social media queues if client has scheduled posts.', 'Log all billable hours for the previous week.', 'Send weekly status update to active clients.', 'Update mold consulting pipeline if any new Eric leads.'],
    inspectionCriteria: 'All client messages answered. Hours logged. Invoices current. Weekly updates sent.',
    resources: [['Zoho One', 'https://one.zoho.com'], ['Client SOP folder', 'Google Drive: E&L Services']],
    notes: [],
    status: 'active'
  }],
  vehicles: [{
    id: 'veh_monthly',
    dept: 'vehicles',
    freq: 'Monthly',
    taskNum: 1,
    title: 'Vehicle Monthly Check',
    assignedTo: 'Eric',
    assignedBy: 'Laurel',
    version: '1.0',
    effectiveDate: '2026-08-24',
    purpose: 'Maintain all family vehicles in safe operating condition.',
    scope: 'All Argilan family vehicles. First Saturday of every month.',
    supplies: [['Tire pressure gauge', 'Garage shelf'], ['Paper towels', 'Garage'], ['Window cleaner', 'Garage'], ['Oil dipstick cloth', 'Garage']],
    steps: ['Check tire pressure on all 4 tires — inflate to door sticker spec.', 'Check oil level — top up if low.', 'Check coolant level — only when engine is COLD.', 'Check windshield washer fluid.', 'Test all lights — headlights, brake lights, turn signals.', 'Clean interior — vacuum, wipe dash, clean windows.', 'Note any sounds, leaks, or warning lights and report to Eric.'],
    inspectionCriteria: 'Tires at correct PSI. Fluids checked. Lights working. Interior clean. Any issues documented.',
    resources: [['Mechanic contact', 'On refrigerator emergency card'], ['Vehicle owner manual', 'Glove compartment']],
    notes: [],
    status: 'active'
  }]
};

// ── SOP Module Root Component ─────────────────────────────────────────────────
function SOPModule(_ref) {
  var personId = _ref.personId,
    isAdmin = _ref.isAdmin,
    family = _ref.family;
  var _React$useState = React.useState('kitchen'),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    dept = _React$useState2[0],
    setDept = _React$useState2[1];
  var _React$useState3 = React.useState(function () {
      try {
        var saved = syncGet('sop_library');
        return saved || DEFAULT_SOPS;
      } catch (_unused) {
        return DEFAULT_SOPS;
      }
    }),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    sops = _React$useState4[0],
    setSops = _React$useState4[1];
  var _React$useState5 = React.useState(null),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    editingSop = _React$useState6[0],
    setEditingSop = _React$useState6[1]; // SOP being edited/created
  var _React$useState7 = React.useState(null),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    viewSop = _React$useState8[0],
    setViewSop = _React$useState8[1]; // SOP being viewed

  React.useEffect(function () {
    var unsub = syncOn('sop_library', function (d) {
      if (d) setSops(d);
    });
    return function () {
      if (unsub) unsub();
    };
  }, []);
  function saveSop(sop) {
    var deptSops = (sops[sop.dept] || []).filter(function (s) {
      return s.id !== sop.id;
    });
    var next = Object.assign({}, sops, _defineProperty({}, sop.dept, [sop].concat(_toConsumableArray(deptSops))));
    setSops(next);
    syncSet('sop_library', next);
    setEditingSop(null);
  }
  function deleteSop(sopId, deptId) {
    if (!window._safeConfirm('Delete this SOP permanently?')) return;
    var next = Object.assign({}, sops, _defineProperty({}, deptId, (sops[deptId] || []).filter(function (s) {
      return s.id !== sopId;
    })));
    setSops(next);
    syncSet('sop_library', next);
    if (viewSop && viewSop.id === sopId) setViewSop(null);
  }
  function addNote(sopId, deptId, noteText) {
    if (!noteText.trim()) return;
    var note = {
      id: 'note_' + Date.now(),
      text: noteText.trim(),
      by: personId,
      ts: Date.now(),
      resolved: false
    };
    var deptSops = (sops[deptId] || []).map(function (s) {
      return s.id === sopId ? Object.assign({}, s, {
        notes: [].concat(_toConsumableArray(s.notes || []), [note])
      }) : s;
    });
    var next = Object.assign({}, sops, _defineProperty({}, deptId, deptSops));
    setSops(next);
    syncSet('sop_library', next);
    setViewSop(function (prev) {
      return prev && prev.id === sopId ? Object.assign({}, prev, {
        notes: [].concat(_toConsumableArray(prev.notes || []), [note])
      }) : prev;
    });
  }
  function resolveNote(sopId, deptId, noteId) {
    var deptSops = (sops[deptId] || []).map(function (s) {
      return s.id === sopId ? Object.assign({}, s, {
        notes: (s.notes || []).map(function (n) {
          return n.id === noteId ? Object.assign({}, n, {
            resolved: true
          }) : n;
        })
      }) : s;
    });
    var next = Object.assign({}, sops, _defineProperty({}, deptId, deptSops));
    setSops(next);
    syncSet('sop_library', next);
    setViewSop(function (prev) {
      if (!prev || prev.id !== sopId) return prev;
      return Object.assign({}, prev, {
        notes: (prev.notes || []).map(function (n) {
          return n.id === noteId ? Object.assign({}, n, {
            resolved: true
          }) : n;
        })
      });
    });
  }
  if (editingSop !== null) {
    return React.createElement(SOPForm, {
      sop: editingSop,
      isAdmin: isAdmin,
      onSave: saveSop,
      onCancel: function onCancel() {
        setEditingSop(null);
      }
    });
  }
  if (viewSop) {
    return React.createElement(SOPDetail, {
      sop: viewSop,
      isAdmin: isAdmin,
      personId: personId,
      onEdit: function onEdit() {
        setEditingSop(viewSop);
      },
      onDelete: function onDelete() {
        deleteSop(viewSop.id, viewSop.dept);
      },
      onAddNote: function onAddNote(text) {
        addNote(viewSop.id, viewSop.dept, text);
      },
      onResolveNote: function onResolveNote(nid) {
        resolveNote(viewSop.id, viewSop.dept, nid);
      },
      onBack: function onBack() {
        setViewSop(null);
      }
    });
  }
  var activeDept = SOP_DEPARTMENTS.find(function (d) {
    return d.id === dept;
  }) || SOP_DEPARTMENTS[0];
  var deptSops = sops[dept] || [];
  return React.createElement('div', {
    style: {
      paddingBottom: 40
    }
  },
  // Header
  React.createElement('div', {
    style: {
      background: SOP_COLORS.header,
      borderBottom: '1px solid rgba(244,143,177,.2)',
      padding: '12px 14px'
    }
  }, React.createElement('div', {
    style: {
      fontSize: 14,
      fontWeight: 900,
      color: SOP_COLORS.accent,
      marginBottom: 2
    }
  }, '📋 Standard Operating Procedures'), React.createElement('div', {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)'
    }
  }, 'E&L Services & Sales · Argilan Family · ' + (sops ? Object.values(sops).reduce(function (n, d) {
    return n + d.length;
  }, 0) : 0) + ' SOPs')),
  // Department tabs
  React.createElement('div', {
    style: {
      display: 'flex',
      overflowX: 'auto',
      borderBottom: '1px solid rgba(244,143,177,.1)',
      padding: '0 8px',
      gap: 2
    }
  }, SOP_DEPARTMENTS.map(function (d) {
    var active = dept === d.id;
    var count = (sops[d.id] || []).length;
    return React.createElement('button', {
      key: d.id,
      onClick: function onClick() {
        setDept(d.id);
      },
      style: {
        flexShrink: 0,
        padding: '8px 10px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: 9,
        fontWeight: active ? 800 : 400,
        color: active ? SOP_COLORS.accent : 'rgba(255,255,255,.3)',
        borderBottom: active ? '2px solid ' + SOP_COLORS.accent : '2px solid transparent',
        whiteSpace: 'nowrap'
      }
    }, d.emoji + ' ' + d.name + ' (' + count + ')');
  })),
  // SOP list
  React.createElement('div', {
    style: {
      padding: '10px 12px'
    }
  }, isAdmin && React.createElement('button', {
    onClick: function onClick() {
      setEditingSop({
        id: 'sop_' + Date.now(),
        dept: dept,
        freq: 'Daily',
        taskNum: deptSops.length + 1,
        title: '',
        assignedTo: '',
        assignedBy: personId,
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        purpose: '',
        scope: '',
        supplies: [['', '']],
        steps: [''],
        inspectionCriteria: '',
        resources: [['', '']],
        notes: [],
        status: 'active'
      });
    },
    style: {
      width: '100%',
      marginBottom: 10,
      background: 'rgba(244,143,177,.1)',
      border: '1px dashed ' + SOP_COLORS.accent,
      borderRadius: 10,
      padding: '10px',
      color: SOP_COLORS.accent,
      fontWeight: 800,
      fontSize: 11,
      cursor: 'pointer'
    }
  }, '+ Create New SOP for ' + activeDept.emoji + ' ' + activeDept.name), deptSops.length === 0 && React.createElement('div', {
    style: {
      textAlign: 'center',
      padding: 30,
      color: 'rgba(255,255,255,.3)',
      fontSize: 11
    }
  }, 'No SOPs yet for this department.'), deptSops.map(function (sop) {
    var unresolved = (sop.notes || []).filter(function (n) {
      return !n.resolved;
    }).length;
    return React.createElement('div', {
      key: sop.id,
      onClick: function onClick() {
        setViewSop(sop);
      },
      style: {
        marginBottom: 8,
        background: 'rgba(244,143,177,.04)',
        border: '1px solid rgba(244,143,177,.2)',
        borderRadius: 10,
        padding: '10px 12px',
        cursor: 'pointer',
        transition: 'background .15s'
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, React.createElement('div', {
      style: {
        flex: 1
      }
    }, React.createElement('div', {
      style: {
        fontSize: 12,
        fontWeight: 800,
        color: '#fff',
        marginBottom: 2
      }
    }, sop.title || 'Untitled SOP'), React.createElement('div', {
      style: {
        display: 'flex',
        gap: 6
      }
    }, React.createElement('span', {
      style: {
        fontSize: 8,
        background: 'rgba(26,115,232,.2)',
        color: SOP_COLORS.primary,
        border: '1px solid rgba(26,115,232,.3)',
        borderRadius: 20,
        padding: '2px 7px',
        fontWeight: 800
      }
    }, sop.freq || 'Daily'), sop.assignedTo && React.createElement('span', {
      style: {
        fontSize: 8,
        color: 'rgba(255,255,255,.4)'
      }
    }, '→ ' + sop.assignedTo))), unresolved > 0 && React.createElement('div', {
      style: {
        background: '#F6BF26',
        color: '#000',
        borderRadius: 20,
        padding: '3px 8px',
        fontSize: 9,
        fontWeight: 900
      }
    }, unresolved + ' note' + (unresolved > 1 ? 's' : '')), React.createElement('div', {
      style: {
        color: 'rgba(255,255,255,.2)',
        fontSize: 16
      }
    }, '›')));
  })));
}

// ── SOP Detail View ────────────────────────────────────────────────────────────

function SOPDetail({ sop, isAdmin, personId, onEdit, onDelete, onAddNote, onResolveNote, onBack }) {
  var todayKey = new Date().toISOString().split('T')[0];
  var storeKey = 'sop_steps_' + sop.id + '_' + personId + '_' + todayKey;

  var [checkedSteps, setCheckedSteps] = React.useState(function() {
    try { return JSON.parse(localStorage.getItem(storeKey) || '{}'); } catch { return {}; }
  });
  var [inspChecked, setInspChecked] = React.useState({});
  var [noteInput, setNoteInput] = React.useState('');

  var dept = SOP_DEPARTMENTS.find(function(d) { return d.id === sop.dept; }) || SOP_DEPARTMENTS[0];
  var steps = (sop.steps || []).filter(Boolean);
  var doneCount = steps.filter(function(_, i) { return !!checkedSteps[i]; }).length;
  var allDone = doneCount === steps.length && steps.length > 0;

  function toggleStep(i) {
    var next = Object.assign({}, checkedSteps, { [i]: !checkedSteps[i] });
    setCheckedSteps(next);
    try { if (typeof tcLink === 'function') { var _n = steps.filter(function(_, i) { return !!next[i]; }).length; if (_n > 0 && _n < steps.length) tcLink(personId, tcSopAct(sop.dept), 'SOP: ' + sop.title, true); else tcLink(personId, tcSopAct(sop.dept), '', false); } } catch (e) {}
    try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch {}
    if (typeof syncSet === 'function') {
      syncSet('sop_progress/' + sop.id + '/' + personId + '/' + todayKey, { steps: next, updatedAt: Date.now() });
    }
  }

  function requestInspection() {
    if (typeof syncSet === 'function') {
      var notifId = 'sop_insp_' + Date.now();
      syncSet('notifs/' + notifId, {
        id: notifId, type: 'sop_inspection',
        personId: personId, personName: window._currentPersonName || personId,
        sopId: sop.id, sopTitle: sop.title, dept: sop.dept,
        title: '🏠 SOP Inspection Request: ' + sop.title,
        message: (window._currentPersonName || personId) + ' completed all steps of [' + sop.title + '] and is ready for inspection.',
        timestamp: Date.now(), read: false, approved: null, requiresApproval: true
      });
    }
    if (window._sendNotif) window._sendNotif('SOP Ready for Inspection', sop.title + ' — all steps done');
    alert('Inspection request sent to Laurel!');
  }

  function adminApprove() {
    var pts = sop.pts || 15;
    if (typeof window._creditFn === 'function' && personId) {
      window._creditFn(personId, pts, 'SOP Complete: ' + sop.title, 'sop_' + sop.id + '_' + todayKey, true);
    }
    if (typeof syncSet === 'function') {
      syncSet('sop_progress/' + sop.id + '/' + personId + '/' + todayKey, {
        steps: checkedSteps, approved: true, approvedBy: window._currentPersonId, approvedAt: Date.now()
      });
    }
    if (window._sendNotif) window._sendNotif(pts + ' pts awarded!', sop.title + ' approved');
    alert('Approved! ' + pts + ' points awarded.');
  }

  function printSOP() {
    var lines = [
      'STANDARD OPERATING PROCEDURE',
      dept.name.toUpperCase() + ' DEPARTMENT',
      '================================',
      'TITLE: ' + sop.title,
      'FREQUENCY: ' + (sop.freq || 'Daily'),
      'ASSIGNED TO: ' + (sop.assignedTo || '—'),
      'ASSIGNED BY: ' + (sop.assignedBy || '—'),
      'VERSION: v' + (sop.version || '1.0'),
      'EFFECTIVE: ' + (sop.effectiveDate || '—'),
      '',
      'PURPOSE:',
      sop.purpose || '',
      '',
      'SCOPE:',
      sop.scope || '',
      '',
      'SUPPLIES:',
    ];
    (sop.supplies || []).filter(function(r) { return r[0]; }).forEach(function(r) {
      lines.push('  [ ] ' + r[0] + '   (' + r[1] + ')');
    });
    lines.push('', 'STEP-BY-STEP INSTRUCTIONS:');
    steps.forEach(function(s, i) { lines.push('  ' + (i + 1) + '. [ ] ' + s); });
    lines.push('', 'INSPECTION CRITERIA:', sop.inspectionCriteria || '', '', 'RESOURCES:');
    (sop.resources || []).filter(function(r) { return r[0]; }).forEach(function(r) {
      lines.push('  ' + r[0] + ': ' + r[1]);
    });
    lines.push('', 'Inspector Signature: _________________  Date: ___________');
    var w = window.open('', '_blank');
    if (w) {
      w.document.write('<pre style="font-family:monospace;padding:24px;font-size:12px;line-height:1.8;">' + lines.join('\n') + '</pre>');
      w.document.close();
      w.print();
    }
  }

  var cardStyle = { background: 'rgba(26,115,232,.07)', border: '1px solid rgba(244,143,177,.15)', borderRadius: 8, padding: '10px 12px', marginBottom: 8 };
  var labelStyle = { fontSize: 9, fontWeight: 800, color: '#F48FB1', letterSpacing: 1, marginBottom: 4 };
  var valueStyle = { fontSize: 11, color: 'rgba(255,255,255,.8)', lineHeight: 1.7 };

  function fmtTime(ts) {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  return /*#__PURE__*/React.createElement("div", { style: { paddingBottom: 80 } },
    // Header bar
    /*#__PURE__*/React.createElement("div", { style: { background: 'linear-gradient(135deg,#1a1a3e,#2a1a3e)', borderBottom: '1px solid rgba(244,143,177,.25)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 } },
      /*#__PURE__*/React.createElement("button", { onClick: onBack, style: { background: 'transparent', border: 'none', color: '#F48FB1', fontSize: 20, cursor: 'pointer' } }, '‹'),
      /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 12, fontWeight: 900, color: '#fff' } }, sop.title),
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, color: 'rgba(255,255,255,.4)' } }, dept.emoji + ' ' + dept.name + ' · ' + (sop.freq || 'Daily') + ' · v' + (sop.version || '1.0')),
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 8, color: 'rgba(244,143,177,.6)', fontWeight: 700, letterSpacing: .3, marginTop: 2 } }, '📋 Standard Operating Procedures · E&L Services & Sales · Argilan Family')
      ),
      /*#__PURE__*/React.createElement("button", { onClick: printSOP, style: { padding: '5px 8px', background: 'rgba(255,255,255,.08)', color: '#ccc', border: '1px solid rgba(255,255,255,.15)', borderRadius: 20, fontSize: 9, cursor: 'pointer', marginRight: 4 } }, '\uD83D\uDDB8 Print'),
      isAdmin && /*#__PURE__*/React.createElement("button", { onClick: onEdit, style: { padding: '5px 10px', background: 'rgba(26,115,232,.2)', color: '#1A73E8', border: '1px solid rgba(26,115,232,.3)', borderRadius: 20, fontSize: 9, fontWeight: 800, cursor: 'pointer', marginRight: 4 } }, '✏️ Edit'),
      isAdmin && /*#__PURE__*/React.createElement("button", { onClick: onDelete, style: { padding: '5px 8px', background: 'rgba(239,83,80,.1)', color: '#EF5350', border: '1px solid rgba(239,83,80,.2)', borderRadius: 20, fontSize: 9, cursor: 'pointer' } }, '🗑')
    ),
    /*#__PURE__*/React.createElement("div", { style: { padding: '10px 12px' } },
      // Progress bar
      steps.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginBottom: 12 } },
        /*#__PURE__*/React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 } },
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, color: 'rgba(255,255,255,.4)' } }, 'PROGRESS'),
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, fontWeight: 800, color: allDone ? '#4CAF82' : '#F48FB1' } }, doneCount + '/' + steps.length + ' steps')
        ),
        /*#__PURE__*/React.createElement("div", { style: { height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' } },
          /*#__PURE__*/React.createElement("div", { style: { height: '100%', width: (steps.length > 0 ? doneCount / steps.length * 100 : 0) + '%', background: allDone ? '#4CAF82' : '#F48FB1', transition: 'width .3s', borderRadius: 3 } })
        )
      ),
      // Header info
      /*#__PURE__*/React.createElement("div", { style: Object.assign({}, cardStyle, { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }) },
        [['Assigned To', sop.assignedTo || '—'], ['Assigned By', sop.assignedBy || '—'], ['Date', sop.effectiveDate || '—'], ['Frequency', sop.freq || 'Daily']].map(function(row) {
          return /*#__PURE__*/React.createElement("div", { key: row[0] },
            /*#__PURE__*/React.createElement("div", { style: labelStyle }, row[0].toUpperCase()),
            /*#__PURE__*/React.createElement("div", { style: valueStyle }, row[1])
          );
        })
      ),
      sop.purpose && /*#__PURE__*/React.createElement("div", { style: cardStyle }, /*#__PURE__*/React.createElement("div", { style: labelStyle }, '📌 PURPOSE'), /*#__PURE__*/React.createElement("div", { style: valueStyle }, sop.purpose)),
      sop.scope && /*#__PURE__*/React.createElement("div", { style: cardStyle }, /*#__PURE__*/React.createElement("div", { style: labelStyle }, '🎯 SCOPE'), /*#__PURE__*/React.createElement("div", { style: valueStyle }, sop.scope)),
      // Supplies
      (sop.supplies || []).some(function(r) { return r[0]; }) && /*#__PURE__*/React.createElement("div", { style: cardStyle },
        /*#__PURE__*/React.createElement("div", { style: labelStyle }, '📦 SUPPLIES'),
        (sop.supplies || []).filter(function(r) { return r[0]; }).map(function(row, i) {
          return /*#__PURE__*/React.createElement("div", { key: i, style: { display: 'flex', gap: 8, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,.04)', fontSize: 10, color: '#ddd' } },
            /*#__PURE__*/React.createElement("span", { style: { color: '#F48FB1', flex: 2 } }, row[0]),
            /*#__PURE__*/React.createElement("span", { style: { color: 'rgba(255,255,255,.4)' } }, row[1])
          );
        })
      ),
      // Steps with checkboxes
      steps.length > 0 && /*#__PURE__*/React.createElement("div", { style: cardStyle },
        /*#__PURE__*/React.createElement("div", { style: labelStyle }, '🪜 STEPS — tap each to check off'),
        steps.map(function(step, i) {
          var done = !!checkedSteps[i];
          return /*#__PURE__*/React.createElement("div", { key: i, onClick: function() { toggleStep(i); }, style: { display: 'flex', gap: 10, padding: '9px 0', borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none', cursor: 'pointer', transition: 'all .2s', opacity: done ? 0.6 : 1 } },
            /*#__PURE__*/React.createElement("div", { style: { width: 24, height: 24, borderRadius: 6, flexShrink: 0, border: '2px solid ' + (done ? '#4CAF82' : 'rgba(255,255,255,.25)'), background: done ? '#4CAF82' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', marginTop: 1 } },
              done && /*#__PURE__*/React.createElement("span", { style: { color: '#000', fontSize: 14, fontWeight: 900, lineHeight: 1 } }, '✓')
            ),
            /*#__PURE__*/React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8, flex: 1 } },
              /*#__PURE__*/React.createElement("div", { style: { width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: done ? '#4CAF82' : '#F48FB1', color: '#000', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, i + 1),
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 11, color: done ? '#4CAF82' : '#ddd', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.5 } }, step)
            )
          );
        }),
        // Request inspection (non-admin, all done)
        !isAdmin && allDone && /*#__PURE__*/React.createElement("button", { onClick: requestInspection, style: { marginTop: 12, width: '100%', background: '#F48FB1', color: '#000', border: 'none', borderRadius: 20, padding: 12, fontWeight: 900, fontSize: 12, cursor: 'pointer' } }, '✅ All Done — Send to Admin for Approval & Points'),
        !isAdmin && !allDone && steps.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginTop: 8, fontSize: 9, color: 'rgba(255,255,255,.3)', textAlign: 'center' } }, 'Complete all ' + steps.length + ' steps, then request inspection for points')
      ),
      // Admin inspection panel — visible to everyone, but only admin can check boxes / approve
      /*#__PURE__*/React.createElement("div", { style: Object.assign({}, cardStyle, { border: '1px solid rgba(76,175,82,.3)', background: 'rgba(76,175,82,.05)' }) },
        /*#__PURE__*/React.createElement("div", { style: Object.assign({}, labelStyle, { color: '#4CAF82' }) }, '🔍 ADMIN INSPECTION PANEL'),
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', marginBottom: 8 } }, isAdmin ? ('Verify each step, then approve to award ' + (sop.pts || 15) + ' points.') : ('Admin verifies each step and approves to award ' + (sop.pts || 15) + ' points.')),
        steps.map(function(step, i) {
          return /*#__PURE__*/React.createElement("div", { key: i, style: { display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.04)', opacity: isAdmin ? 1 : 0.55 } },
            /*#__PURE__*/React.createElement("button", { disabled: !isAdmin, onClick: function() { if (isAdmin) setInspChecked(function(p) { return Object.assign({}, p, { [i]: !p[i] }); }); }, style: { width: 22, height: 22, borderRadius: 5, flexShrink: 0, border: '2px solid ' + (inspChecked[i] ? '#4CAF82' : 'rgba(255,255,255,.2)'), background: inspChecked[i] ? '#4CAF82' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isAdmin ? 'pointer' : 'default' } },
              inspChecked[i] && /*#__PURE__*/React.createElement("span", { style: { color: '#000', fontSize: 12, fontWeight: 900 } }, '✓')
            ),
            /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: '#ddd', flex: 1 } }, (i + 1) + '. ' + step)
          );
        }),
        isAdmin
          ? /*#__PURE__*/React.createElement("button", { onClick: adminApprove, style: { marginTop: 12, width: '100%', background: '#4CAF82', color: '#000', border: 'none', borderRadius: 20, padding: 12, fontWeight: 900, fontSize: 12, cursor: 'pointer' } }, '✅ Approve & Award ' + (sop.pts || 15) + ' Points Immediately')
          : /*#__PURE__*/React.createElement("div", { style: { marginTop: 12, width: '100%', textAlign: 'center', background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.3)', borderRadius: 20, padding: 12, fontWeight: 700, fontSize: 11 } }, '🔒 Only Admin can check off and approve this panel')
      ),
      sop.inspectionCriteria && /*#__PURE__*/React.createElement("div", { style: Object.assign({}, cardStyle, { border: '1px solid rgba(76,175,82,.2)' }) },
        /*#__PURE__*/React.createElement("div", { style: Object.assign({}, labelStyle, { color: '#4CAF82' }) }, '✅ INSPECTION CRITERIA'),
        /*#__PURE__*/React.createElement("div", { style: valueStyle }, sop.inspectionCriteria)
      ),
      (sop.resources || []).some(function(r) { return r[0]; }) && /*#__PURE__*/React.createElement("div", { style: cardStyle },
        /*#__PURE__*/React.createElement("div", { style: labelStyle }, '🔗 RESOURCES'),
        (sop.resources || []).filter(function(r) { return r[0]; }).map(function(r, i) {
          return /*#__PURE__*/React.createElement("div", { key: i, style: { display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,.04)' } },
            /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: '#F48FB1', flex: 1 } }, r[0]),
            r[1] && r[1].startsWith('http') ?
              /*#__PURE__*/React.createElement("a", { href: r[1], target: '_blank', style: { fontSize: 9, color: '#1A73E8' } }, '🔗 Open') :
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: '#aaa' } }, r[1])
          );
        })
      ),
      // Sticky notes
      /*#__PURE__*/React.createElement("div", { style: Object.assign({}, cardStyle, { border: '1px solid rgba(246,191,38,.25)', background: 'rgba(246,191,38,.04)' }) },
        /*#__PURE__*/React.createElement("div", { style: Object.assign({}, labelStyle, { color: '#F6BF26' }) }, '📝 NOTES & ADJUSTMENT REQUESTS'),
        (sop.notes || []).length === 0 && /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: 'rgba(255,255,255,.3)', marginBottom: 8 } }, 'No notes yet.'),
        (sop.notes || []).map(function(note) {
          return /*#__PURE__*/React.createElement("div", { key: note.id, style: { marginBottom: 6, padding: '7px 10px', background: note.resolved ? 'rgba(76,175,82,.06)' : 'rgba(246,191,38,.08)', border: '1px solid ' + (note.resolved ? 'rgba(76,175,82,.2)' : 'rgba(246,191,38,.3)'), borderRadius: 8 } },
            /*#__PURE__*/React.createElement("div", { style: { display: 'flex', gap: 8, alignItems: 'flex-start' } },
              /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
                /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: note.resolved ? '#4CAF82' : '#F6BF26' } }, (note.resolved ? '✅ ' : '📝 ') + note.text),
                /*#__PURE__*/React.createElement("div", { style: { fontSize: 8, color: 'rgba(255,255,255,.3)', marginTop: 2 } }, (note.by || '?') + ' · ' + (new Date(note.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })))
              ),
              !note.resolved && isAdmin && /*#__PURE__*/React.createElement("button", { onClick: function() { onResolveNote(note.id); }, style: { padding: '3px 8px', background: 'rgba(76,175,82,.15)', color: '#4CAF82', border: '1px solid rgba(76,175,82,.3)', borderRadius: 20, fontSize: 8, fontWeight: 800, cursor: 'pointer' } }, 'Resolve')
            )
          );
        }),
        /*#__PURE__*/React.createElement("div", { style: { display: 'flex', gap: 6, marginTop: 8 } },
          /*#__PURE__*/React.createElement("input", { value: noteInput, onChange: function(e) { setNoteInput(e.target.value); }, onKeyDown: function(e) { if (e.key === 'Enter' && noteInput.trim()) { onAddNote(noteInput); setNoteInput(''); } }, placeholder: 'Add a note or adjustment request...', autoCorrect: 'on', autoCapitalize: 'sentences', style: { flex: 1, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: '7px 12px', color: '#fff', fontSize: 11 } }),
          /*#__PURE__*/React.createElement("button", { onClick: function() { if (noteInput.trim()) { onAddNote(noteInput); setNoteInput(''); } }, style: { background: '#F48FB1', color: '#000', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } }, '\u2191')
        )
      )
    )
  );
}


function SOPForm(_ref3) {
  var sop = _ref3.sop,
    isAdmin = _ref3.isAdmin,
    onSave = _ref3.onSave,
    onCancel = _ref3.onCancel;
  var _React$useState1 = React.useState(sop || {}),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    form = _React$useState10[0],
    setForm = _React$useState10[1];
  function set(key, val) {
    setForm(function (p) {
      return Object.assign({}, p, _defineProperty({}, key, val));
    });
  }
  function setSupply(i, col, val) {
    var s = _toConsumableArray(form.supplies || [['', '']]);
    s[i] = [col === 0 ? val : s[i][0], col === 1 ? val : s[i][1]];
    set('supplies', s);
  }
  function setStep(i, val) {
    var s = _toConsumableArray(form.steps || ['']);
    s[i] = val;
    set('steps', s);
  }
  function setResource(i, col, val) {
    var r = _toConsumableArray(form.resources || [['', '+']]);
    r[i] = [col === 0 ? val : r[i][0], col === 1 ? val : r[i][1]];
    set('resources', r);
  }
  var iStyle = {
    width: '100%',
    background: 'rgba(255,255,255,.07)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 8,
    padding: '8px 10px',
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Georgia,serif'
  };
  var sectionLabel = function sectionLabel(label) {
    return React.createElement('div', {
      style: {
        fontSize: 10,
        fontWeight: 800,
        color: SOP_COLORS.accent,
        letterSpacing: 1,
        margin: '14px 0 5px'
      }
    }, label);
  };
  return React.createElement('div', {
    style: {
      paddingBottom: 80
    }
  },
  // Header
  React.createElement('div', {
    style: {
      background: SOP_COLORS.header,
      borderBottom: '1px solid rgba(244,143,177,.25)',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement('button', {
    onClick: onCancel,
    style: {
      background: 'transparent',
      border: 'none',
      color: SOP_COLORS.accent,
      fontSize: 20,
      cursor: 'pointer'
    }
  }, '‹'), React.createElement('div', {
    style: {
      fontSize: 12,
      fontWeight: 900,
      color: '#fff'
    }
  }, form.id && form.id.startsWith('sop_') ? 'Create New SOP' : 'Edit SOP')), React.createElement('div', {
    style: {
      padding: '10px 14px'
    }
  },
  // Basic info grid
  sectionLabel('📋 SOP HEADER'), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, [['title', 'Task Title', 'e.g. Post-Meal Kitchen Reset'], ['assignedTo', 'Assigned To', 'Person or Role'], ['assignedBy', 'Assigned By', 'Supervisor name'], ['effectiveDate', 'Date of Assignment', 'YYYY-MM-DD'], ['version', 'Version', 'e.g. 1.0'], ['taskNum', 'Task #', '1, 2, 3...']].map(function (f) {
    return React.createElement('div', {
      key: f[0]
    }, React.createElement('div', {
      style: {
        fontSize: 8,
        color: 'rgba(255,255,255,.5)',
        marginBottom: 3
      }
    }, f[1].toUpperCase()), React.createElement('input', {
      value: form[f[0]] || '',
      onChange: function onChange(e) {
        set(f[0], e.target.value);
      },
      placeholder: f[2],
      autoCorrect: 'on',
      style: iStyle
    }));
  })),
  // Frequency
  sectionLabel('📅 FREQUENCY'), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Biannual', 'Yearly'].map(function (f) {
    return React.createElement('button', {
      key: f,
      onClick: function onClick() {
        set('freq', f);
      },
      style: {
        padding: '6px 12px',
        background: form.freq === f ? SOP_COLORS.accent : 'rgba(255,255,255,.06)',
        color: form.freq === f ? '#000' : '#ccc',
        border: '1px solid ' + (form.freq === f ? SOP_COLORS.accent : 'rgba(255,255,255,.1)'),
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, f);
  })),
  // Purpose
  sectionLabel('📌 PURPOSE'), React.createElement('textarea', {
    value: form.purpose || '',
    onChange: function onChange(e) {
      set('purpose', e.target.value);
    },
    placeholder: 'Why does this SOP exist?',
    autoCorrect: 'on',
    autoCapitalize: 'sentences',
    style: Object.assign({}, iStyle, {
      minHeight: 60,
      resize: 'vertical'
    })
  }),
  // Scope
  sectionLabel('🎯 SCOPE'), React.createElement('textarea', {
    value: form.scope || '',
    onChange: function onChange(e) {
      set('scope', e.target.value);
    },
    placeholder: 'Where and who does this apply to?',
    autoCorrect: 'on',
    autoCapitalize: 'sentences',
    style: Object.assign({}, iStyle, {
      minHeight: 50,
      resize: 'vertical'
    })
  }),
  // Supplies
  sectionLabel('📦 SUPPLIES NEEDED'), (form.supplies || [['', '']]).map(function (row, i) {
    return React.createElement('div', {
      key: i,
      style: {
        display: 'flex',
        gap: 6,
        marginBottom: 5
      }
    }, React.createElement('input', {
      value: row[0] || '',
      onChange: function onChange(e) {
        setSupply(i, 0, e.target.value);
      },
      placeholder: 'Supply name',
      style: Object.assign({}, iStyle, {
        flex: 2
      })
    }), React.createElement('input', {
      value: row[1] || '',
      onChange: function onChange(e) {
        setSupply(i, 1, e.target.value);
      },
      placeholder: 'Location',
      style: Object.assign({}, iStyle, {
        flex: 1
      })
    }), React.createElement('button', {
      onClick: function onClick() {
        set('supplies', (form.supplies || []).filter(function (_, j) {
          return j !== i;
        }));
      },
      style: {
        padding: '0 8px',
        background: 'transparent',
        color: '#EF5350',
        fontSize: 16,
        cursor: 'pointer',
        border: 'none'
      }
    }, '×'));
  }), React.createElement('button', {
    onClick: function onClick() {
      set('supplies', [].concat(_toConsumableArray(form.supplies || []), [['', '']]));
    },
    style: {
      fontSize: 9,
      color: SOP_COLORS.accent,
      background: 'transparent',
      border: '1px dashed ' + SOP_COLORS.accent,
      borderRadius: 20,
      padding: '4px 12px',
      cursor: 'pointer',
      marginBottom: 4
    }
  }, '+ Add Supply'),
  // Steps
  sectionLabel('🪜 STEP-BY-STEP INSTRUCTIONS'), (form.steps || ['']).map(function (step, i) {
    return React.createElement('div', {
      key: i,
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 5,
        alignItems: 'flex-start'
      }
    }, React.createElement('div', {
      style: {
        width: 22,
        height: 22,
        borderRadius: '50%',
        flexShrink: 0,
        background: SOP_COLORS.accent,
        color: '#000',
        fontSize: 9,
        fontWeight: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6
      }
    }, i + 1), React.createElement('textarea', {
      value: step,
      onChange: function onChange(e) {
        setStep(i, e.target.value);
      },
      placeholder: 'Step ' + (i + 1) + ' instruction',
      autoCorrect: 'on',
      autoCapitalize: 'sentences',
      style: Object.assign({}, iStyle, {
        flex: 1,
        minHeight: 40,
        resize: 'vertical'
      })
    }), React.createElement('button', {
      onClick: function onClick() {
        set('steps', (form.steps || []).filter(function (_, j) {
          return j !== i;
        }));
      },
      style: {
        padding: '4px 8px',
        background: 'transparent',
        color: '#EF5350',
        fontSize: 16,
        cursor: 'pointer',
        border: 'none',
        marginTop: 4
      }
    }, '×'));
  }), React.createElement('button', {
    onClick: function onClick() {
      set('steps', [].concat(_toConsumableArray(form.steps || []), ['']));
    },
    style: {
      fontSize: 9,
      color: SOP_COLORS.accent,
      background: 'transparent',
      border: '1px dashed ' + SOP_COLORS.accent,
      borderRadius: 20,
      padding: '4px 12px',
      cursor: 'pointer',
      marginBottom: 4
    }
  }, '+ Add Step'),
  // Inspection Criteria
  sectionLabel('✅ INSPECTION CRITERIA'), React.createElement('textarea', {
    value: form.inspectionCriteria || '',
    onChange: function onChange(e) {
      set('inspectionCriteria', e.target.value);
    },
    placeholder: 'What does "done correctly" look like?',
    autoCorrect: 'on',
    autoCapitalize: 'sentences',
    style: Object.assign({}, iStyle, {
      minHeight: 50,
      resize: 'vertical'
    })
  }),
  // Resources
  sectionLabel('🔗 RESOURCES'), (form.resources || [['', '']]).map(function (row, i) {
    return React.createElement('div', {
      key: i,
      style: {
        display: 'flex',
        gap: 6,
        marginBottom: 5
      }
    }, React.createElement('input', {
      value: row[0] || '',
      onChange: function onChange(e) {
        setResource(i, 0, e.target.value);
      },
      placeholder: 'Resource type / name',
      style: Object.assign({}, iStyle, {
        flex: 1
      })
    }), React.createElement('input', {
      value: row[1] || '',
      onChange: function onChange(e) {
        setResource(i, 1, e.target.value);
      },
      placeholder: 'URL or description',
      style: Object.assign({}, iStyle, {
        flex: 2
      })
    }), React.createElement('button', {
      onClick: function onClick() {
        set('resources', (form.resources || []).filter(function (_, j) {
          return j !== i;
        }));
      },
      style: {
        padding: '0 8px',
        background: 'transparent',
        color: '#EF5350',
        fontSize: 16,
        cursor: 'pointer',
        border: 'none'
      }
    }, '×'));
  }), React.createElement('button', {
    onClick: function onClick() {
      set('resources', [].concat(_toConsumableArray(form.resources || []), [['', '']]));
    },
    style: {
      fontSize: 9,
      color: SOP_COLORS.accent,
      background: 'transparent',
      border: '1px dashed ' + SOP_COLORS.accent,
      borderRadius: 20,
      padding: '4px 12px',
      cursor: 'pointer'
    }
  }, '+ Add Resource'),
  // Save button
  React.createElement('div', {
    style: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '10px 14px',
      background: 'rgba(15,12,41,.95)',
      borderTop: '1px solid rgba(244,143,177,.2)',
      display: 'flex',
      gap: 8,
      zIndex: 100
    }
  }, React.createElement('button', {
    onClick: onCancel,
    style: {
      flex: 1,
      padding: 12,
      background: 'rgba(255,255,255,.06)',
      color: '#aaa',
      border: 'none',
      borderRadius: 20,
      fontSize: 11,
      cursor: 'pointer'
    }
  }, 'Cancel'), React.createElement('button', {
    onClick: function onClick() {
      onSave(form);
    },
    style: {
      flex: 2,
      padding: 12,
      background: SOP_COLORS.accent,
      color: '#000',
      border: 'none',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, '💾 Save SOP'))));
}


// ═══ CALENDAR + FIELD TRIPS ═══

var FREE_FIELD_TRIPS = [
  {id:"glencairn",  county:"York Co SC",    name:"Glencairn Garden",              addr:"725 Crest St, Rock Hill SC",        miles:10, url:"https://www.cityofrockhill.com/parks/glencairn-garden", theme:"Botany - Psalm 104:14",   questions:["Name 3 plants you see and describe how Jehovah designed them","How does caring for a garden reflect Jehovah qualities?","Draw your favorite plant and label its parts"]},
  {id:"crowders",   county:"York Co NC",    name:"Crowders Mountain State Park",   addr:"522 Park Office Ln, Kings Mountain NC", miles:25, url:"https://www.ncparks.gov/crowders-mountain-state-park", theme:"Geology - Psalm 104:18", questions:["What kind of rocks did you find? How old might they be?","How does the view from the summit show Jehovah power?","Write 3 sentences about what you observed on the trail"]},
  {id:"white",      county:"York Co SC",    name:"White Memorial Nature Preserve", addr:"Fort Mill SC",                      miles:5,  url:"https://catawbalands.org",             theme:"Nature - Isaiah 43:20",   questions:["What animals or birds did you spot?","How does Jehovah provide water for the animals here?","Describe the preserve using all 5 senses in your journal"]},
  {id:"landsford",  county:"Chester Co SC", name:"Landsford Canal State Park",     addr:"2051 Park Dr, Catawba SC",           miles:28, url:"https://southcarolinaparks.com/landsford-canal", theme:"History - Eccl 1:7",    questions:["How did people use the canal?","Read Ecclesiastes 1:7 - how do rivers show God design?","Map the route water takes from the river to the canal"]},
  {id:"kings_mtn",  county:"York Co SC",    name:"Kings Mountain State Park",      addr:"1277 Park Rd, Blacksburg SC",       miles:30, url:"https://southcarolinaparks.com/kings-mountain", theme:"History - Prov 21:30",   questions:["What happened at Kings Mountain?","Read Proverbs 21:30 - what does Jehovah allow?","Write a short diary entry from a soldier perspective"]},
  {id:"freedom",    county:"Mecklenburg NC",name:"Freedom Park + Little Sugar Creek",addr:"1900 East Blvd, Charlotte NC",    miles:20, url:"https://parkandrec.com/freedom-park",   theme:"Creation - Psalm 36:9",   questions:["Identify 3 trees using a field guide","How does the creek show Jehovah water cycle design?","Collect 5 natural objects and describe each one"]},
  {id:"mcdowell",   county:"Mecklenburg NC",name:"McDowell Nature Preserve",       addr:"15222 York Rd, Charlotte NC",       miles:22, url:"https://parkandrec.com/mcdowell-nature-center", theme:"Ecology - Job 12:7-9",   questions:["What is an ecosystem? Find 2 examples here","Read Job 12:7-9 - what do animals teach us about Jehovah?","Draw a simple food chain you observed"]},
  {id:"reedy",      county:"Mecklenburg NC",name:"Reedy Creek Nature Preserve",    addr:"2900 Rocky River Rd, Charlotte NC", miles:23, url:"https://parkandrec.com/reedy-creek",   theme:"Seasons - Isaiah 43:19",  questions:["What signs of the season do you notice?","Read Isaiah 43:19 - how does Jehovah make things new?","Research one native plant or animal you saw"]},
  {id:"latta",      county:"Mecklenburg NC",name:"Latta Nature Preserve",          addr:"6211 Sample Rd, Huntersville NC",   miles:20, url:"https://parkandrec.com/latta-plantation-nature-preserve", theme:"History+Nature - Gen 1:25", questions:["Name 3 farm animals - what was their biblical purpose?","Read Genesis 1:25 - how does this apply to what you observed?","Interview a park ranger and write 3 things you learned"]},
  {id:"wing_haven", county:"Mecklenburg NC",name:"Wing Haven Bird Sanctuary",      addr:"248 Ridgewood Ave, Charlotte NC",   miles:21, url:"https://winghavengardens.com",        theme:"Birds - Matthew 6:26",    questions:["Identify 3 birds using the Merlin Bird ID app","Read Matthew 6:26 - how does Jehovah care for birds?","Describe one bird behavior in detail in your journal"]},
  {id:"davidson",   county:"Mecklenburg NC",name:"Davidson Greenway and Farm",     addr:"Davidson NC",                      miles:25, url:"https://www.townofdavidson.org/greenway", theme:"Farming - Eccl 5:9",    questions:["What crops grow here? Research how they are grown","Read Ecclesiastes 5:9 - why does Jehovah value the land?","Write a farm journal entry from a biblical farmer perspective"]},
];

function FamilyCalendar(props) {
  var personId = props.personId;
  var isAdmin  = props.isAdmin;
  var today    = new Date();
  var MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var WDAYS    = ["S","M","T","W","T","F","S"];
  var CAL_COLORS = ["#1A73E8","#EF5350","#4CAF82","#F6BF26","#9C8DC4","#F48FB1","#FF9800","#26A69A"];
  var CAL_EMOJIS = ["P","B","D","W","H","F","M","A","T","S","G","R"];

  var s1=React.useState(today.getMonth()); var curMonth=s1[0]; var setCurMonth=s1[1];
  var s2=React.useState(today.getFullYear()); var curYear=s2[0]; var setCurYear=s2[1];
  var s3=React.useState({}); var events=s3[0]; var setEvents=s3[1];
  var s4=React.useState(null); var viewDay=s4[0]; var setViewDay=s4[1];
  var s5=React.useState(false); var showAdd=s5[0]; var setShowAdd=s5[1];
  var s6=React.useState({title:"",time:"",color:"#1A73E8"}); var form=s6[0]; var setForm=s6[1];

  React.useEffect(function() {
    var unsub = syncOn("family_calendar", function(d) { if(d) setEvents(d); });
    return function() { if(unsub) unsub(); };
  }, []);

  function prevMonth() { if(curMonth===0){setCurMonth(11);setCurYear(function(y){return y-1;});}else setCurMonth(function(m){return m-1;}); }
  function nextMonth() { if(curMonth===11){setCurMonth(0);setCurYear(function(y){return y+1;});}else setCurMonth(function(m){return m+1;}); }

  function saveEvent() {
    if(!form.title.trim()) return;
    var ev = {title:form.title.trim(),time:form.time.trim(),color:form.color,createdBy:personId};
    var dayEvs = (events[viewDay]||[]).concat([ev]);
    var next = Object.assign({},events,{[viewDay]:dayEvs});
    setEvents(next);
    try{ syncSet("family_calendar/"+viewDay, dayEvs); }catch(e){}
    setShowAdd(false); setForm({title:"",time:"",color:"#1A73E8"});
  }

  function deleteEvent(date, i) {
    var dayEvs = (events[date]||[]).filter(function(_,j){ return j!==i; });
    var next = Object.assign({},events,{[date]:dayEvs});
    setEvents(next);
    try{ syncSet("family_calendar/"+date, dayEvs.length?dayEvs:null); }catch(e){}
  }

  if(viewDay) {
    var dayEvs = events[viewDay]||[];
    return React.createElement("div",{style:{paddingBottom:60}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(26,115,232,.08)",borderBottom:"1px solid rgba(26,115,232,.2)"}},
        React.createElement("button",{onClick:function(){setViewDay(null);setShowAdd(false);},style:{background:"transparent",border:"none",color:"#1A73E8",fontSize:22,cursor:"pointer",padding:"0 4px"}},"<"),
        React.createElement("div",{style:{flex:1,fontSize:13,fontWeight:800,color:"#fff"}},viewDay),
        isAdmin && React.createElement("button",{onClick:function(){setShowAdd(!showAdd);},style:{background:"#1A73E8",color:"#fff",border:"none",borderRadius:20,padding:"6px 14px",fontSize:10,fontWeight:800,cursor:"pointer"}},showAdd?"Cancel":"+ Add")
      ),
      dayEvs.length===0&&!showAdd&&React.createElement("div",{style:{padding:24,textAlign:"center",color:"rgba(255,255,255,.3)",fontSize:11}},"No events. Tap + Add to create one."),
      dayEvs.map(function(ev,i){
        return React.createElement("div",{key:i,style:{margin:"8px 14px",background:(ev.color||"#1A73E8")+"18",border:"1px solid "+(ev.color||"#1A73E8")+"44",borderLeft:"4px solid "+(ev.color||"#1A73E8"),borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",gap:10}},
          React.createElement("div",{style:{flex:1}},
            React.createElement("div",{style:{fontSize:12,fontWeight:800,color:"#fff"}},ev.title),
            ev.time&&React.createElement("div",{style:{fontSize:9,color:"rgba(255,255,255,.4)"}},ev.time)
          ),
          isAdmin&&React.createElement("button",{onClick:function(){deleteEvent(viewDay,i);},style:{background:"transparent",border:"none",color:"#EF5350",fontSize:20,cursor:"pointer",padding:"0 4px"}},"x")
        );
      }),
      showAdd&&isAdmin&&React.createElement("div",{style:{margin:"10px 14px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:14}},
        React.createElement("div",{style:{fontSize:11,fontWeight:800,color:"#fff",marginBottom:10}},"Add Event"),
        React.createElement("input",{value:form.title,onChange:function(e){setForm(function(p){return Object.assign({},p,{title:e.target.value});});},placeholder:"Event title",autoCorrect:"on",autoCapitalize:"sentences",style:{width:"100%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",borderRadius:8,padding:"8px 10px",color:"#fff",fontSize:12,marginBottom:8,boxSizing:"border-box"}}),
        React.createElement("input",{value:form.time,onChange:function(e){setForm(function(p){return Object.assign({},p,{time:e.target.value});});},placeholder:"Time e.g. 10:00 AM",style:{width:"100%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",borderRadius:8,padding:"8px 10px",color:"#fff",fontSize:12,marginBottom:10,boxSizing:"border-box"}}),
        React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}},
          CAL_COLORS.map(function(c,ci){
            return React.createElement("div",{key:ci,onClick:function(){setForm(function(p){return Object.assign({},p,{color:c});});},style:{width:28,height:28,borderRadius:"50%",background:c,border:form.color===c?"3px solid #fff":"2px solid transparent",cursor:"pointer"}});
          })
        ),
        React.createElement("div",{style:{display:"flex",gap:8}},
          React.createElement("button",{onClick:function(){setShowAdd(false);},style:{flex:1,background:"rgba(255,255,255,.06)",color:"#aaa",border:"none",borderRadius:20,padding:10,cursor:"pointer",fontSize:11}},"Cancel"),
          React.createElement("button",{onClick:saveEvent,style:{flex:2,background:"#1A73E8",color:"#fff",border:"none",borderRadius:20,padding:10,fontWeight:800,fontSize:11,cursor:"pointer"}},"Save Event")
        )
      )
    );
  }

  var firstDay = new Date(curYear,curMonth,1).getDay();
  var daysInMonth = new Date(curYear,curMonth+1,0).getDate();
  var todayStr = today.toISOString().split("T")[0];
  var cells = [];
  for(var i=0;i<firstDay;i++) cells.push(null);
  for(var d=1;d<=daysInMonth;d++) cells.push(d);

  return React.createElement("div",{style:{paddingBottom:40}},
    React.createElement("div",{style:{background:"rgba(26,115,232,.08)",borderBottom:"1px solid rgba(26,115,232,.2)",padding:"10px 14px"}},
      React.createElement("div",{style:{fontSize:14,fontWeight:900,color:"#1A73E8",marginBottom:2}},"Family Calendar"),
      React.createElement("div",{style:{fontSize:9,color:"rgba(255,255,255,.35)"}},"argilan2family@gmail.com - Tap any day to see or add events")
    ),
    React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px"}},
      React.createElement("button",{onClick:prevMonth,style:{background:"transparent",border:"none",color:"#1A73E8",fontSize:24,cursor:"pointer",padding:"4px 10px"}},"<"),
      React.createElement("div",{style:{fontSize:16,fontWeight:900,color:"#fff"}},MONTHS[curMonth]+" "+curYear),
      React.createElement("button",{onClick:nextMonth,style:{background:"transparent",border:"none",color:"#1A73E8",fontSize:24,cursor:"pointer",padding:"4px 10px"}},">")
    ),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,padding:"0 8px",marginBottom:4}},
      WDAYS.map(function(d,i){return React.createElement("div",{key:i,style:{textAlign:"center",fontSize:9,fontWeight:800,color:"rgba(255,255,255,.3)",padding:"4px 0"}},d);})
    ),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,padding:"0 8px"}},
      cells.map(function(day,ci){
        if(!day) return React.createElement("div",{key:ci});
        var dateStr = curYear+"-"+String(curMonth+1).padStart(2,"0")+"-"+String(day).padStart(2,"0");
        var dayEvs = events[dateStr]||[];
        var isToday = dateStr===todayStr;
        var isSun = ci%7===0; var isSat = ci%7===6;
        return React.createElement("div",{key:ci,onClick:function(){setViewDay(dateStr);},
          style:{minHeight:52,borderRadius:8,padding:"4px 3px",background:isToday?"rgba(26,115,232,.2)":"rgba(255,255,255,.03)",border:isToday?"1.5px solid #1A73E8":"1px solid rgba(255,255,255,.06)",cursor:"pointer"}},
          React.createElement("div",{style:{fontSize:11,fontWeight:isToday?900:500,color:isToday?"#1A73E8":isSun||isSat?"rgba(255,120,120,.7)":"rgba(255,255,255,.7)",textAlign:"center",marginBottom:2}},day),
          dayEvs.slice(0,2).map(function(ev,j){return React.createElement("div",{key:j,style:{fontSize:7,background:(ev.color||"#1A73E8")+"44",color:"#fff",borderRadius:3,padding:"1px 3px",marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},ev.title);})
        );
      })
    )
  );
}

function FieldTripChooser(props) {
  var s1=React.useState(null); var sel=s1[0]; var setSel=s1[1];

  if(sel) {
    var trip = FREE_FIELD_TRIPS.find(function(t){return t.id===sel;});
    if(!trip) return null;
    return React.createElement("div",{style:{paddingBottom:40}},
      React.createElement("div",{style:{background:"rgba(255,152,0,.08)",border:"2px solid rgba(255,152,0,.35)",borderRadius:16,padding:16,margin:14}},
        React.createElement("button",{onClick:function(){setSel(null);},style:{background:"transparent",border:"none",color:"#FF9800",fontSize:11,cursor:"pointer",marginBottom:8,padding:0}},"< Choose different trip"),
        React.createElement("div",{style:{fontSize:15,fontWeight:900,color:"#FF9800",marginBottom:4}},trip.name),
        React.createElement("div",{style:{fontSize:10,color:"rgba(255,255,255,.5)",marginBottom:4}},trip.addr+" - "+trip.miles+" miles - FREE"),
        React.createElement("div",{style:{fontSize:10,color:"rgba(255,255,255,.6)",marginBottom:12}},trip.theme),
        React.createElement("a",{href:trip.url,target:"_blank",rel:"noopener noreferrer",style:{display:"block",background:"rgba(255,152,0,.15)",color:"#FF9800",border:"1px solid rgba(255,152,0,.3)",borderRadius:20,padding:"8px 14px",textAlign:"center",fontSize:10,fontWeight:800,textDecoration:"none",marginBottom:14}},"Open Location Info"),
        React.createElement("div",{style:{fontSize:10,fontWeight:800,color:"#fff",marginBottom:8}},"FIELD TRIP QUESTIONS"),
        trip.questions.map(function(q,i){
          return React.createElement("div",{key:i,style:{display:"flex",gap:10,padding:"8px 10px",marginBottom:6,background:"rgba(255,255,255,.05)",borderRadius:8}},
            React.createElement("div",{style:{width:22,height:22,borderRadius:"50%",flexShrink:0,background:"#FF9800",color:"#000",fontSize:9,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}},i+1),
            React.createElement("div",{style:{fontSize:11,color:"#ddd",lineHeight:1.6}},q)
          );
        })
      )
    );
  }

  var counties = ["York Co SC","Chester Co SC","Mecklenburg NC"];
  return React.createElement("div",{style:{padding:14}},
    React.createElement("div",{style:{fontSize:14,fontWeight:900,color:"#FF9800",marginBottom:4}},"Choose Your Field Trip Destination"),
    React.createElement("div",{style:{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:14}},"All free, within 30 miles of Fort Mill SC:"),
    counties.map(function(county){
      var trips = FREE_FIELD_TRIPS.filter(function(t){return t.county===county;});
      if(!trips.length) return null;
      return React.createElement("div",{key:county,style:{marginBottom:16}},
        React.createElement("div",{style:{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.3)",letterSpacing:2,marginBottom:8}},county.toUpperCase()),
        trips.map(function(t){
          return React.createElement("div",{key:t.id,onClick:function(){setSel(t.id);},style:{marginBottom:8,background:"rgba(255,152,0,.06)",border:"1px solid rgba(255,152,0,.2)",borderRadius:10,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}},
            React.createElement("div",{style:{flex:1}},
              React.createElement("div",{style:{fontSize:12,fontWeight:800,color:"#fff"}},t.name),
              React.createElement("div",{style:{fontSize:9,color:"rgba(255,255,255,.4)"}},t.addr+" - "+t.miles+" mi - FREE")
            ),
            React.createElement("div",{style:{color:"rgba(255,255,255,.25)",fontSize:18}},">")
          );
        })
      );
    })
  );
}

