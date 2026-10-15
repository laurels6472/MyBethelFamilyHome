// ═══ SCHEDULE REQUESTS ═══
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// ═══ SCHEDULE REQUESTS PANEL ══════════════════════════════════════════════════
// Admin: see all pending schedule requests with Approve / Deny + note
// Children: see status of their own requests

function ScheduleRequestsPanel(_ref) {
  var personId = _ref.personId,
    isAdmin = _ref.isAdmin,
    family = _ref.family,
    notifs = _ref.notifs,
    approveNotif = _ref.approveNotif,
    addNotif = _ref.addNotif;
  var _React$useState = React.useState(null),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    denyTarget = _React$useState2[0],
    setDenyTarget = _React$useState2[1];
  var _React$useState3 = React.useState(''),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    denyNote = _React$useState4[0],
    setDenyNote = _React$useState4[1];
  var _React$useState5 = React.useState({}),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    done = _React$useState6[0],
    setDone = _React$useState6[1];

  // Load all schedule request notifs from Firebase in real time
  var _React$useState7 = React.useState(function () {
      try {
        var d = syncGet('notifs');
        if (!d) return [];
        return Object.values(d).filter(function (n) {
          return n && n.type === 'schedule_request';
        }).sort(function (a, b) {
          return b.timestamp - a.timestamp;
        });
      } catch (_unused) {
        return [];
      }
    }),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    requests = _React$useState8[0],
    setRequests = _React$useState8[1];
  React.useEffect(function () {
    var unsub = syncOn('notifs', function (d) {
      if (d) {
        var reqs = Object.values(d).filter(function (n) {
          return n && n.type === 'schedule_request';
        }).sort(function (a, b) {
          return b.timestamp - a.timestamp;
        });
        setRequests(reqs);
      }
    });
    return function () {
      if (unsub) unsub();
    };
  }, []);
  function getPerson(pid) {
    return (family || DEFAULT_FAMILY).find(function (p) {
      return p.id === pid;
    }) || {
      name: pid,
      emoji: '👤',
      color: '#888'
    };
  }
  function handleApprove(req) {
    // Mark notif approved
    if (approveNotif) approveNotif(req.id, true, 'Approved! Admin will update the schedule.');
    // Update the schedule_requests record
    syncSet('schedule_requests/' + req.reqDataId, {
      status: 'approved',
      resolvedAt: Date.now(),
      resolvedBy: personId
    });
    // Send notification back to the child
    var childNotifId = 'sr_reply_' + Date.now();
    syncSet('notifs/' + childNotifId, {
      id: childNotifId,
      type: 'schedule_request_reply',
      personId: req.personId,
      toPersonId: req.personId,
      title: '✅ Schedule Request Approved!',
      message: 'Your request for "' + req.blockTitle + '" was approved by Admin. ' + 'Watch for the update on the schedule.',
      timestamp: Date.now(),
      read: false,
      approved: true,
      adminNote: 'Approved! Admin will update the schedule.',
      originalRequest: req.requestText
    });
    // Push notification to child
    if (window._sendNotif) {
      var p = getPerson(req.personId);
      window._sendNotif('✅ Your schedule request was approved!', '"' + req.blockTitle + '" — ' + req.requestText);
    }
    setDone(function (prev) {
      return Object.assign({}, prev, _defineProperty({}, req.id, 'approved'));
    });
  }
  function handleDeny(req) {
    var note = denyNote.trim() || 'Your request was reviewed but cannot be accommodated right now.';
    // Mark notif denied
    if (approveNotif) approveNotif(req.id, false, note);
    // Update the schedule_requests record
    syncSet('schedule_requests/' + req.reqDataId, {
      status: 'denied',
      reason: note,
      resolvedAt: Date.now(),
      resolvedBy: personId
    });
    // Send notification back to the child
    var childNotifId = 'sr_reply_' + Date.now();
    syncSet('notifs/' + childNotifId, {
      id: childNotifId,
      type: 'schedule_request_reply',
      personId: req.personId,
      toPersonId: req.personId,
      title: '❌ Schedule Request Not Approved',
      message: 'Your request for "' + req.blockTitle + '" was reviewed. Admin note: ' + note,
      timestamp: Date.now(),
      read: false,
      approved: false,
      adminNote: note,
      originalRequest: req.requestText
    });
    // Push notification to child
    if (window._sendNotif) {
      window._sendNotif('❌ Schedule request update', req.blockTitle + ' — ' + note);
    }
    setDone(function (prev) {
      return Object.assign({}, prev, _defineProperty({}, req.id, 'denied'));
    });
    setDenyTarget(null);
    setDenyNote('');
  }

  // Filter: admin sees all, child sees only their own
  var visible = isAdmin ? requests : requests.filter(function (r) {
    return r.personId === personId || r.toPersonId === personId;
  });
  var pending = visible.filter(function (r) {
    return r.approved == null && !done[r.id];
  });
  var resolved = visible.filter(function (r) {
    return r.approved != null || done[r.id];
  });
  var iStyle = {
    background: 'rgba(255,255,255,.07)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 8,
    padding: '7px 10px',
    color: '#fff',
    fontSize: 12,
    width: '100%',
    fontFamily: 'inherit'
  };
  if (visible.length === 0) {
    return React.createElement('div', {
      style: {
        padding: '20px',
        textAlign: 'center',
        color: 'rgba(255,255,255,.3)',
        fontSize: 11
      }
    }, React.createElement('div', {
      style: {
        fontSize: 28,
        marginBottom: 8
      }
    }, '📋'), isAdmin ? 'No schedule requests yet.' : 'You haven\'t sent any schedule requests yet.');
  }
  return React.createElement('div', {
    style: {
      paddingBottom: 40
    }
  },
  // ── PENDING ─────────────────────────────────────────────────────────────
  pending.length > 0 && React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 9,
      fontWeight: 800,
      color: '#FF9800',
      letterSpacing: 1,
      padding: '8px 14px 6px',
      borderBottom: '1px solid rgba(255,255,255,.05)'
    }
  }, '⏳ PENDING — ' + pending.length + ' request' + (pending.length === 1 ? '' : 's')), pending.map(function (req) {
    var p = getPerson(req.personId);
    var isDenyOpen = denyTarget === req.id;
    return React.createElement('div', {
      key: req.id,
      style: {
        margin: '8px 12px',
        background: 'rgba(255,152,0,.06)',
        border: '1px solid rgba(255,152,0,.25)',
        borderRadius: 12,
        overflow: 'hidden'
      }
    },
    // Request header
    React.createElement('div', {
      style: {
        padding: '10px 12px'
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6
      }
    }, React.createElement('span', {
      style: {
        fontSize: 20
      }
    }, "p.emoji" in p ? p.emoji : '👤'), React.createElement('div', {
      style: {
        flex: 1
      }
    }, React.createElement('div', {
      style: {
        fontSize: 11,
        fontWeight: 800,
        color: '#fff'
      }
    }, p.name || req.personName), React.createElement('div', {
      style: {
        fontSize: 9,
        color: 'rgba(255,255,255,.4)'
      }
    }, new Date(req.timestamp).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }))), React.createElement('div', {
      style: {
        fontSize: 8,
        background: 'rgba(255,152,0,.15)',
        color: '#FF9800',
        border: '1px solid rgba(255,152,0,.3)',
        borderRadius: 20,
        padding: '3px 8px',
        fontWeight: 800
      }
    }, '⏳ Pending')),
    // Block name
    React.createElement('div', {
      style: {
        fontSize: 9,
        color: '#FF9800',
        fontWeight: 700,
        marginBottom: 4
      }
    }, '📅 Re: "' + req.blockTitle + '"'),
    // Request text
    React.createElement('div', {
      style: {
        fontSize: 11,
        color: '#ddd',
        lineHeight: 1.7,
        background: 'rgba(0,0,0,.2)',
        borderRadius: 8,
        padding: '8px 10px',
        marginBottom: 8
      }
    }, req.requestText || req.message),
    // Admin action buttons
    isAdmin && !isDenyOpen && React.createElement('div', {
      style: {
        display: 'flex',
        gap: 6
      }
    }, React.createElement('button', {
      onClick: function onClick() {
        handleApprove(req);
      },
      style: {
        flex: 1,
        background: 'rgba(76,175,82,.2)',
        color: '#4CAF82',
        border: '1px solid rgba(76,175,82,.4)',
        borderRadius: 20,
        padding: '8px',
        fontWeight: 800,
        fontSize: 11,
        cursor: 'pointer'
      }
    }, '✅ Approve'), React.createElement('button', {
      onClick: function onClick() {
        setDenyTarget(req.id);
        setDenyNote('');
      },
      style: {
        flex: 1,
        background: 'rgba(239,83,80,.1)',
        color: '#EF5350',
        border: '1px solid rgba(239,83,80,.3)',
        borderRadius: 20,
        padding: '8px',
        fontWeight: 800,
        fontSize: 11,
        cursor: 'pointer'
      }
    }, '❌ Deny')),
    // Deny with note
    isAdmin && isDenyOpen && React.createElement('div', null, React.createElement('div', {
      style: {
        fontSize: 9,
        color: '#EF5350',
        fontWeight: 800,
        marginBottom: 5
      }
    }, 'Add a note for ' + p.name + ' (optional):'), React.createElement('textarea', {
      value: denyNote,
      onChange: function onChange(e) {
        setDenyNote(e.target.value);
      },
      placeholder: 'e.g. "We need to keep the schedule as-is this week, try again next month"',
      autoCorrect: 'on',
      autoCapitalize: 'sentences',
      style: Object.assign({}, iStyle, {
        minHeight: 60,
        resize: 'vertical',
        marginBottom: 6,
        fontSize: 11
      })
    }), React.createElement('div', {
      style: {
        display: 'flex',
        gap: 6
      }
    }, React.createElement('button', {
      onClick: function onClick() {
        handleDeny(req);
      },
      style: {
        flex: 1,
        background: '#EF5350',
        color: '#fff',
        border: 'none',
        borderRadius: 20,
        padding: '8px',
        fontWeight: 800,
        fontSize: 11,
        cursor: 'pointer'
      }
    }, 'Send Denial'), React.createElement('button', {
      onClick: function onClick() {
        setDenyTarget(null);
        setDenyNote('');
      },
      style: {
        padding: '8px 12px',
        background: 'rgba(255,255,255,.06)',
        color: '#aaa',
        border: 'none',
        borderRadius: 20,
        fontSize: 10,
        cursor: 'pointer'
      }
    }, 'Cancel')))));
  })),
  // ── RESOLVED ────────────────────────────────────────────────────────────
  resolved.length > 0 && React.createElement('div', {
    style: {
      marginTop: pending.length > 0 ? 16 : 0
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      fontWeight: 800,
      color: 'rgba(255,255,255,.3)',
      letterSpacing: 1,
      padding: '8px 14px 6px',
      borderBottom: '1px solid rgba(255,255,255,.04)'
    }
  }, '✓ RESOLVED — ' + resolved.length + ' request' + (resolved.length === 1 ? '' : 's')), resolved.map(function (req) {
    var p = getPerson(req.personId || req.toPersonId);
    var wasApproved = req.approved === true || done[req.id] === 'approved';
    var title = req.title || (wasApproved ? '✅ Approved' : '❌ Denied');
    return React.createElement('div', {
      key: req.id,
      style: {
        margin: '6px 12px',
        background: wasApproved ? 'rgba(76,175,82,.05)' : 'rgba(239,83,80,.04)',
        border: "1px solid ".concat(wasApproved ? 'rgba(76,175,82,.2)' : 'rgba(239,83,80,.15)'),
        borderRadius: 10,
        padding: '9px 12px'
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4
      }
    }, React.createElement('span', {
      style: {
        fontSize: 16
      }
    }, "p.emoji" in p ? p.emoji : '👤'), React.createElement('div', {
      style: {
        flex: 1
      }
    }, React.createElement('div', {
      style: {
        fontSize: 10,
        fontWeight: 800,
        color: wasApproved ? '#4CAF82' : '#EF5350'
      }
    }, title), req.originalRequest && React.createElement('div', {
      style: {
        fontSize: 9,
        color: 'rgba(255,255,255,.3)',
        fontStyle: 'italic',
        marginTop: 1
      }
    }, '"' + req.originalRequest + '"'))), req.adminNote && React.createElement('div', {
      style: {
        fontSize: 9,
        color: 'rgba(255,255,255,.5)',
        background: 'rgba(0,0,0,.15)',
        borderRadius: 6,
        padding: '5px 8px'
      }
    }, '📝 Admin note: ' + req.adminNote));
  })));
}


// ═══ BETHEL OPS + GCAL ═══
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// ═══ MY BETHEL OPERATIONS + GOOGLE CALENDAR SETUP ════════════════════════════

// ─── My Bethel Operations Panel ───────────────────────────────────────────────
// Integrates the task-card inspection/approval flow from the Bethel Operations system

var BETHEL_STATUS_STYLES = {
  pending: {
    bg: 'rgba(255,255,255,.03)',
    border: 'rgba(255,255,255,.08)',
    badge: null,
    left: '#888'
  },
  awaiting: {
    bg: 'rgba(246,191,38,.06)',
    border: 'rgba(246,191,38,.25)',
    badge: '🟡 Awaiting Inspection',
    left: '#F6BF26'
  },
  approved: {
    bg: 'rgba(76,175,82,.07)',
    border: 'rgba(76,175,82,.3)',
    badge: '🟢 Approved — Points Awarded',
    left: '#4CAF82'
  },
  reminded: {
    bg: 'rgba(239,83,80,.06)',
    border: 'rgba(239,83,80,.25)',
    badge: null,
    left: '#EF5350'
  }
};
function BethelTaskCard(_ref) {
  var task = _ref.task,
    isAdmin = _ref.isAdmin,
    onRequestInspection = _ref.onRequestInspection,
    onApprove = _ref.onApprove,
    onRemind = _ref.onRemind,
    onReset = _ref.onReset,
    onSetStatus = _ref.onSetStatus,
    personId = _ref.personId;
  var st = task.status || 'pending';
  var style = BETHEL_STATUS_STYLES[st] || BETHEL_STATUS_STYLES.pending;
  var isReminded = st === 'reminded';
  var displayPts = isReminded ? Math.floor((task.points || 10) / 2) : task.points || 10;
  var _React$useState0 = React.useState(false);
  var expanded = _React$useState0[0], setExpanded = _React$useState0[1];
  return React.createElement('div', {
    style: {
      borderRadius: 12,
      padding: '12px 14px',
      marginBottom: 8,
      background: style.bg,
      border: "1px solid ".concat(style.border),
      borderLeft: "4px solid ".concat(style.left),
      transition: 'all .25s',
      cursor: 'pointer'
    },
    onClick: function() { setExpanded(function(p) { return !p; }); }
  },
  // Header row
  React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      fontWeight: 800,
      color: style.left,
      background: "".concat(style.left, "18"),
      border: "1px solid ".concat(style.left, "44"),
      borderRadius: 20,
      padding: '3px 8px',
      textTransform: 'uppercase',
      letterSpacing: .5
    }
  }, task.time || 'Daily'), React.createElement('div', {
    style: {
      flex: 1
    }
  }), React.createElement('div', {
    style: { fontSize: 11, color: 'rgba(255,255,255,.3)', marginRight: 2 }
  }, expanded ? '▲' : '▼'), React.createElement('div', {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: style.left
    }
  }, (isReminded ? '⚠️ ' : '') + displayPts + 'pts')),
  React.createElement('div', {
    style: { fontSize: 8, color: 'rgba(255,255,255,.35)', fontWeight: 700, letterSpacing: .3, marginBottom: 6 }
  }, '🏠 My Bethel Operations · Routine Maintenance · Argilan Family'),
  // Description
  React.createElement('div', {
    style: {
      fontSize: 12,
      color: st === 'approved' ? '#4CAF82' : st === 'reminded' ? '#EF5350' : '#ccc',
      fontWeight: 600,
      marginBottom: isReminded ? 4 : 8,
      lineHeight: 1.6
    }
  }, task.desc), isReminded && React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#EF5350',
      fontWeight: 800,
      marginBottom: 8
    }
  }, '⚠️ 50% Deduction — Revision Required. Fix and re-submit.'),
  // Steps checklist — visible to everyone when expanded
  expanded && (task.steps || []).length > 0 && React.createElement('div', {
    style: {
      background: 'rgba(0,0,0,.2)',
      borderRadius: 8,
      padding: '10px 12px',
      marginBottom: 8
    },
    onClick: function(e) { e.stopPropagation(); }
  },
    React.createElement('div', {
      style: { fontSize: 9, fontWeight: 800, color: style.left, letterSpacing: .5, marginBottom: 6 }
    }, '🪜 STEPS TO COMPLETE THIS TASK'),
    (task.steps || []).map(function(step, i) {
      return React.createElement('div', {
        key: i,
        style: { display: 'flex', gap: 8, alignItems: 'flex-start', padding: '5px 0', borderBottom: i < task.steps.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }
      },
        React.createElement('div', {
          style: { width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: style.left, color: '#000', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }
        }, i + 1),
        React.createElement('div', { style: { fontSize: 11, color: '#ddd', lineHeight: 1.6 } }, step)
      );
    })
  ),
  // Status badge
  style.badge && React.createElement('div', {
    style: {
      textAlign: 'center',
      fontSize: 11,
      fontWeight: 800,
      padding: '7px',
      borderRadius: 8,
      background: "".concat(style.left, "18"),
      color: style.left,
      marginBottom: 8
    }
  }, style.badge),
  // Action buttons
  React.createElement('div', {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    },
    onClick: function(e) { e.stopPropagation(); }
  },
  // Child: request inspection
  !isAdmin && (st === 'pending' || st === 'reminded') && React.createElement('button', {
    onClick: function onClick() {
      onRequestInspection && onRequestInspection(task.id);
    },
    style: {
      flex: 1,
      padding: '10px',
      border: 'none',
      borderRadius: 20,
      cursor: 'pointer',
      background: isReminded ? '#EF5350' : '#1A73E8',
      color: '#fff',
      fontSize: 11,
      fontWeight: 800
    }
  }, isReminded ? 'Fixed! Request Re-Inspection' : 'Complete — Request Inspection ›'),
  // Admin: always-visible controls once expanded, regardless of current status
  isAdmin && expanded && React.createElement(React.Fragment, null,
    st !== 'awaiting' && React.createElement('button', {
      onClick: function() { onSetStatus ? onSetStatus(task.id, 'awaiting') : (onRequestInspection && onRequestInspection(task.id)); },
      style: { flex: 1, minWidth: 130, padding: '9px', border: '1px solid rgba(26,115,232,.35)', borderRadius: 20, cursor: 'pointer', background: 'rgba(26,115,232,.12)', color: '#1A73E8', fontSize: 10, fontWeight: 800 }
    }, '📥 Mark Ready for Review'),
    React.createElement('button', {
      onClick: function() { onApprove && onApprove(task.id); },
      style: { flex: 1, minWidth: 110, padding: '9px', border: '1px solid rgba(76,175,82,.4)', borderRadius: 20, cursor: 'pointer', background: 'rgba(76,175,82,.2)', color: '#4CAF82', fontSize: 10, fontWeight: 800 }
    }, '✅ Approve & Award ' + displayPts + 'pts'),
    st !== 'reminded' && React.createElement('button', {
      onClick: function() { onRemind && onRemind(task.id); },
      style: { flex: 1, minWidth: 110, padding: '9px', border: '1px solid rgba(239,83,80,.3)', borderRadius: 20, cursor: 'pointer', background: 'rgba(239,83,80,.08)', color: '#EF5350', fontSize: 10, fontWeight: 800 }
    }, '⚠️ Send Back'),
    st !== 'pending' && React.createElement('button', {
      onClick: function() { onReset && onReset(task.id); },
      style: { padding: '9px 12px', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,.4)', fontSize: 10 }
    }, 'Reset to Pending')
  ),
  // Quick-access admin buttons even when collapsed, for the one action that matters most
  isAdmin && !expanded && st === 'awaiting' && React.createElement(React.Fragment, null,
    React.createElement('button', {
      onClick: function onClick() { onApprove && onApprove(task.id); },
      style: { flex: 1, padding: '9px', border: '1px solid rgba(76,175,82,.4)', borderRadius: 20, cursor: 'pointer', background: 'rgba(76,175,82,.2)', color: '#4CAF82', fontSize: 11, fontWeight: 800 }
    }, '✅ Approve'),
    React.createElement('button', {
      onClick: function onClick() { onRemind && onRemind(task.id); },
      style: { flex: 1, padding: '9px', border: '1px solid rgba(239,83,80,.3)', borderRadius: 20, cursor: 'pointer', background: 'rgba(239,83,80,.08)', color: '#EF5350', fontSize: 11, fontWeight: 800 }
    }, '⚠️ Needs Revision')
  )));
}
function BethelOpsPanel(_ref2) {
  var personId = _ref2.personId,
    isAdmin = _ref2.isAdmin,
    family = _ref2.family,
    credit = _ref2.credit,
    addNotif = _ref2.addNotif;
  var today = new Date().toISOString().split('T')[0];
  var storeKey = 'bethel_ops_' + today;

  // Default task templates per role
  var DEFAULT_TASKS = [{
    id: 'morning_reset',
    time: 'Morning Reset',
    desc: 'Post-Breakfast Floor Reset & Kitchen Clear. Zero items on counter.',
    points: 10,
    steps: [
      'Clear and rinse all breakfast dishes — load dishwasher or wash by hand.',
      'Wipe down the table and countertops.',
      'Push in all chairs.',
      'Sweep any crumbs or spills off the floor.',
      'Put away any food, condiments, or dishes left out.',
      'Final check — zero items on the counter.'
    ]
  }, {
    id: 'afternoon_reset',
    time: 'Afternoon Reset',
    desc: 'Post-School Desk Clear & Afternoon Sweep.',
    points: 10,
    steps: [
      'Clear your desk/school area — put away books, papers, and supplies.',
      'Push in your chair.',
      'Sweep the school area floor.',
      'Throw away any trash or scrap paper.',
      'Return any shared supplies to their home location.'
    ]
  }, {
    id: 'evening_reset',
    time: 'Evening Reset',
    desc: 'Post-Dinner Complete Kitchen 6S & Final Sweep.',
    points: 15,
    steps: [
      'Clear and rinse all dinner dishes — load dishwasher or wash by hand.',
      'Wipe down countertops and the stovetop.',
      'Empty and reline the kitchen trash if full.',
      'Sweep the kitchen floor, mop if needed.',
      'Wipe the table and push in all chairs.',
      'Return all items to their assigned home location (6S standard).',
      'Final check — counters clear, sink empty, floor clean.'
    ]
  }, {
    id: 'laundry',
    time: 'Continuous',
    desc: 'Complete 1 full load of laundry (Wash / Dry / Fold / Put Away).',
    points: 20,
    steps: [
      'Sort a full load — lights, darks, or colors.',
      'Start the wash cycle.',
      'Move to the dryer promptly when the wash cycle ends.',
      'Fold everything within 30 minutes of the dryer finishing.',
      'Return all folded items to the correct person\'s room.',
      'Wipe washer/dryer tops and clear the lint trap.'
    ]
  }, {
    id: 'animals',
    time: 'Morning',
    desc: 'Feed animals, clean water bowls. Pets: Khaniikos Kappa, Skyli Enia, S\'Moresey.',
    points: 8,
    steps: [
      'Wash and refill fresh water for all 3 pets.',
      'Measure and serve Khaniikos Kappa\'s food.',
      'Measure and serve Skyli Enia\'s food.',
      'Prepare S\'Moresey\'s pellets + fresh greens, check hay level.',
      'Clean rabbit litter box if needed.',
      'Report any health concerns to Laurel.'
    ]
  }, {
    id: 'room_reset',
    time: 'Evening',
    desc: 'Room fully reset to 6S standard. Floor clear, surfaces wiped.',
    points: 10,
    steps: [
      'Pick up everything off the floor — clothes, toys, trash.',
      'Make the bed.',
      'Clear and wipe your desk/nightstand.',
      'Put dirty clothes in the hamper.',
      'Put away any books, devices, or supplies.',
      'Final check — floor clear, surfaces wiped.'
    ]
  }];
  var _React$useState = React.useState(function () {
      try {
        var fb = syncGet('bethel_ops/' + today);
        if (fb) return fb;
        // Initialize with default pending tasks
        var init = {};
        DEFAULT_TASKS.forEach(function (t) {
          init[t.id] = _objectSpread(_objectSpread({}, t), {}, {
            status: 'pending',
            hasBeenReminded: false
          });
        });
        return init;
      } catch (_unused) {
        var init = {};
        DEFAULT_TASKS.forEach(function (t) {
          init[t.id] = _objectSpread(_objectSpread({}, t), {}, {
            status: 'pending',
            hasBeenReminded: false
          });
        });
        return init;
      }
    }),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    tasks = _React$useState2[0],
    setTasks = _React$useState2[1];
  React.useEffect(function () {
    var unsub = syncOn('bethel_ops/' + today, function (d) {
      if (d && _typeof(d) === 'object') setTasks(d);
    });
    return function () {
      if (unsub) unsub();
    };
  }, [today]);
  function save(next) {
    setTasks(next);
    syncSet('bethel_ops/' + today, next);
  }
  function requestInspection(id) {
    var t = tasks[id];
    if (!t) return;
    var pid = window._currentPersonId || personId;
    var pname = window._currentPersonName || pid;
    save(_objectSpread(_objectSpread({}, tasks), {}, _defineProperty({}, id, _objectSpread(_objectSpread({}, t), {}, {
      status: 'awaiting',
      personId: pid
    }))));
    // Notify admin
    syncSet('notifs/bethel_insp_' + Date.now(), {
      id: 'bethel_insp_' + Date.now(),
      type: 'bethel_inspection',
      personId: pid,
      personName: pname,
      title: '🏠 Inspection Request from ' + pname,
      message: t.desc + ' — ready for inspection',
      taskId: id,
      timestamp: Date.now(),
      read: false,
      approved: null
    });
    if (window._sendNotif) window._sendNotif('🏠 ' + pname + ' is ready for inspection', t.desc);
  }
  function approveTask(id) {
    var t = tasks[id];
    if (!t) return;
    var pts = t.hasBeenReminded ? Math.floor((t.points || 10) / 2) : t.points || 10;
    save(_objectSpread(_objectSpread({}, tasks), {}, _defineProperty({}, id, _objectSpread(_objectSpread({}, t), {}, {
      status: 'approved',
      approvedAt: Date.now()
    }))));
    // Award points
    if (credit) credit(t.personId || personId, pts, '🏠 ' + t.desc, 'bethel_' + id, true);
    // Notify child
    syncSet('notifs/bethel_approved_' + Date.now(), {
      type: 'bethel_approved',
      toPersonId: t.personId || personId,
      title: '✅ Task Approved! +' + pts + ' pts',
      message: t.desc,
      timestamp: Date.now(),
      read: false
    });
    if (window._sendNotif) window._sendNotif('✅ Task Approved! +' + pts + ' pts', t.desc);
  }
  function remindTask(id) {
    var t = tasks[id];
    if (!t) return;
    save(_objectSpread(_objectSpread({}, tasks), {}, _defineProperty({}, id, _objectSpread(_objectSpread({}, t), {}, {
      status: 'reminded',
      hasBeenReminded: true
    }))));
    if (window._sendNotif) window._sendNotif('⚠️ Needs revision', t.desc + ' — please fix and resubmit');
  }
  function resetTask(id) {
    var t = tasks[id];
    if (!t) return;
    save(_objectSpread(_objectSpread({}, tasks), {}, _defineProperty({}, id, _objectSpread(_objectSpread({}, t), {}, {
      status: 'pending'
    }))));
  }
  function setStatus(id, status) {
    var t = tasks[id];
    if (!t) return;
    save(_objectSpread(_objectSpread({}, tasks), {}, _defineProperty({}, id, _objectSpread(_objectSpread({}, t), {}, {
      status: status
    }))));
  }
  var taskList = DEFAULT_TASKS.map(function (def) {
    return tasks[def.id] || _objectSpread(_objectSpread({}, def), {}, {
      status: 'pending'
    });
  });
  var pendingCount = taskList.filter(function (t) {
    return t.status === 'awaiting';
  }).length;
  return React.createElement('div', {
    style: {
      paddingBottom: 20
    }
  }, React.createElement('div', {
    style: {
      padding: '10px 14px',
      background: 'linear-gradient(135deg,rgba(44,62,80,.4),rgba(52,152,219,.15))',
      borderBottom: '1px solid rgba(255,255,255,.06)',
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
      fontSize: 13,
      fontWeight: 900,
      color: '#fff'
    }
  }, '🏠 My Bethel Operations'), React.createElement('div', {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.3)'
    }
  }, new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }))), pendingCount > 0 && React.createElement('div', {
    style: {
      background: 'rgba(246,191,38,.2)',
      border: '1px solid rgba(246,191,38,.4)',
      borderRadius: 20,
      padding: '4px 10px',
      fontSize: 9,
      fontWeight: 800,
      color: '#F6BF26'
    }
  }, pendingCount + ' awaiting')), React.createElement('div', {
    style: {
      padding: '10px 12px'
    }
  }, taskList.map(function (t) {
    return React.createElement(BethelTaskCard, {
      key: t.id,
      task: t,
      isAdmin: isAdmin,
      onRequestInspection: requestInspection,
      onApprove: approveTask,
      onRemind: remindTask,
      onReset: resetTask,
      onSetStatus: setStatus,
      personId: personId
    });
  })));
}

// ─── Google Calendar Setup ─────────────────────────────────────────────────────
var ARGILAN_CALENDARS = [
// ── FAMILY PERSONAL ───────────────────────────────────────────────────────
{
  id: 'laurel',
  group: 'Family',
  name: 'Laurel',
  emoji: '👑',
  color: '#8D6E63',
  gcalColor: 'Coco',
  desc: 'Laurel — personal events & appointments'
}, {
  id: 'eric',
  group: 'Family',
  name: 'Eric',
  emoji: '👨',
  color: '#1A73E8',
  gcalColor: 'Cobalt',
  desc: 'Eric — work schedule & personal events'
}, {
  id: 'ryan',
  group: 'Family',
  name: 'Ryan',
  emoji: '👦',
  color: '#039BE5',
  gcalColor: 'Peacock',
  desc: 'Ryan Alexander — 12th grade schedule'
}, {
  id: 'kayla',
  group: 'Family',
  name: 'Kayla',
  emoji: '👧',
  color: '#F48FB1',
  gcalColor: 'Cherry Blossom',
  desc: 'Kayla Michelle — 11th grade schedule'
}, {
  id: 'ashelyn',
  group: 'Family',
  name: 'Ashelyn',
  emoji: '👧',
  color: '#9E69AF',
  gcalColor: 'Amethyst',
  desc: 'Ashelyn Renee — 8th grade schedule'
}, {
  id: 'mykah',
  group: 'Family',
  name: 'Mykah',
  emoji: '👦',
  color: '#4CAF82',
  gcalColor: 'Eucalyptus',
  desc: 'Mykah Kade — 4th grade schedule'
},
// ── SCHOOL ────────────────────────────────────────────────────────────────
{
  id: 'school',
  group: 'School',
  name: 'DKA 2026–27',
  emoji: '📚',
  color: '#9C8DC4',
  gcalColor: 'Wisteria',
  desc: 'Discovering Kids Academy — school days, tests, field trips'
},
// ── SPIRITUAL ─────────────────────────────────────────────────────────────
{
  id: 'jw_worship',
  group: 'Spiritual',
  name: 'Family Worship',
  emoji: '📖',
  color: '#F4511E',
  gcalColor: 'Tangerine',
  desc: 'Family Worship Study — Thursday evenings'
}, {
  id: 'jw_service',
  group: 'Spiritual',
  name: 'Field Service',
  emoji: '🏠',
  color: '#F09300',
  gcalColor: 'Mango',
  desc: 'Ministry — field service & return visits'
}, {
  id: 'meetings',
  group: 'Spiritual',
  name: 'Congregation',
  emoji: '🕊',
  color: '#7986CB',
  gcalColor: 'Lavender',
  desc: 'Congregation meetings — Tue evening & Sun morning'
},
// ── BUSINESS ──────────────────────────────────────────────────────────────
{
  id: 'el_biz',
  group: 'Business',
  name: 'E&L Services',
  emoji: '💼',
  color: '#3F51B5',
  gcalColor: 'Blueberry',
  desc: 'E.L. Services & Sales — shared business events'
}, {
  id: 'va_work',
  group: 'Business',
  name: 'VA Clients',
  emoji: '💻',
  color: '#E67C73',
  gcalColor: 'Flamingo',
  desc: 'Laurel — VA client appointments & deadlines'
}, {
  id: 'eric_work',
  group: 'Business',
  name: 'Eric Work',
  emoji: '🏗',
  color: '#0B8043',
  gcalColor: 'Basil',
  desc: 'Eric — Delta Mold work schedule'
}, {
  id: 'consulting',
  group: 'Business',
  name: 'Eric Consulting',
  emoji: '🌿',
  color: '#33B679',
  gcalColor: 'Sage',
  desc: 'Eric — mold consulting appointments'
},
// ── HOME ──────────────────────────────────────────────────────────────────
{
  id: 'routine',
  group: 'Home',
  name: 'My Bethel Routine',
  emoji: '🏡',
  color: '#C0CA33',
  gcalColor: 'Citron',
  desc: 'Daily routine, meal prep, home management'
}, {
  id: 'birthdays',
  group: 'Home',
  name: 'Birthdays',
  emoji: '🎂',
  color: '#616161',
  gcalColor: 'Graphite',
  desc: 'All family birthdays & anniversaries'
}, {
  id: 'fun',
  group: 'Home',
  name: 'Fun & Recreation',
  emoji: '🎉',
  color: '#F6BF26',
  gcalColor: 'Banana',
  desc: 'Fun nights, outings & family recreation'
},
// ── HEALTH ────────────────────────────────────────────────────────────────
{
  id: 'doctors',
  group: 'Health',
  name: 'Doctor Visits',
  emoji: '🏥',
  color: '#EF5350',
  gcalColor: 'Tomato',
  desc: 'All family — doctor, dentist, specialist appointments'
}, {
  id: 'vet',
  group: 'Health',
  name: 'Vet Visits',
  emoji: '🐾',
  color: '#26A69A',
  gcalColor: 'Teal',
  desc: 'Pets: 🐕 Khaniikos Kappa · 🐕 Skyli Enia · 🐇 S\'Moresey'
}];
var CAL_GROUPS = ['Family', 'School', 'Spiritual', 'Business', 'Home', 'Health'];

function GoogleCalSetup() {
  var [copied, setCopied] = React.useState(null);
  var [expanded, setExpanded] = React.useState(null);

  function copy(text, id) {
    try { navigator.clipboard.writeText(text); } catch {}
    setCopied(id);
    setTimeout(function () { setCopied(null); }, 1800);
  }

  // Clean consolidated calendar list — no Jacob, no Grandpa
  var CALS = [
    // ── FAMILY ────────────────────────────────────────────────────────────────
    { id:'laurel',    name:'Laurel',            emoji:'👑', color:'#8D6E63', gcal:'Coco',           section:'Family' },
    { id:'eric',      name:'Eric',              emoji:'👨', color:'#1A73E8', gcal:'Cobalt',         section:'Family' },
    { id:'ryan',      name:'Ryan',              emoji:'👦', color:'#039BE5', gcal:'Peacock',        section:'Family' },
    { id:'kayla',     name:'Kayla',             emoji:'👧', color:'#F48FB1', gcal:'Cherry Blossom', section:'Family' },
    { id:'ashelyn',   name:'Ashelyn',           emoji:'👧', color:'#9E69AF', gcal:'Amethyst',       section:'Family' },
    { id:'mykah',     name:'Mykah',             emoji:'👦', color:'#4CAF82', gcal:'Eucalyptus',     section:'Family' },
    // ── SCHOOL & SPIRITUAL ────────────────────────────────────────────────────
    { id:'dka',       name:'DKA 2026–27',       emoji:'📚', color:'#9C8DC4', gcal:'Wisteria',       section:'School & Spiritual' },
    { id:'worship',   name:'Family Worship',    emoji:'📖', color:'#F4511E', gcal:'Tangerine',      section:'School & Spiritual' },
    { id:'service',   name:'Field Service',     emoji:'🏠', color:'#F09300', gcal:'Mango',          section:'School & Spiritual' },
    { id:'meetings',  name:'Congregation',      emoji:'🕊', color:'#7986CB', gcal:'Lavender',       section:'School & Spiritual' },
    // ── BUSINESS ──────────────────────────────────────────────────────────────
    { id:'el',        name:'E&L Services',      emoji:'💼', color:'#3F51B5', gcal:'Blueberry',      section:'Business' },
    { id:'va',        name:'VA Clients',         emoji:'💻', color:'#E67C73', gcal:'Flamingo',       section:'Business' },
    { id:'ework',     name:'Eric Work',         emoji:'🏗', color:'#0B8043', gcal:'Basil',          section:'Business' },
    { id:'consult',   name:'Eric Consulting',   emoji:'🌿', color:'#33B679', gcal:'Sage',           section:'Business' },
    // ── HOME & HEALTH ─────────────────────────────────────────────────────────
    { id:'bethel',    name:'My Bethel Routine', emoji:'🏡', color:'#C0CA33', gcal:'Citron',         section:'Home & Health' },
    { id:'bdays',     name:'Birthdays',         emoji:'🎂', color:'#616161', gcal:'Graphite',       section:'Home & Health' },
    { id:'fun',       name:'Fun & Recreation',  emoji:'🎉', color:'#F6BF26', gcal:'Banana',         section:'Home & Health' },
    { id:'doctors',   name:'Doctor Visits',     emoji:'🏥', color:'#EF5350', gcal:'Tomato',         section:'Home & Health' },
    { id:'vet',       name:'Vet Visits',        emoji:'🐾', color:'#26A69A', gcal:'Teal',           section:'Home & Health' },
  ];

  var sections = ['Family', 'School & Spiritual', 'Business', 'Home & Health'];

  return React.createElement('div', { style: { paddingBottom: 40 } },
    // Header
    React.createElement('div', { style: { background: 'linear-gradient(135deg,#1a1a3e,#1a2a3e)', padding: '12px 14px', borderBottom: '1px solid rgba(26,115,232,.2)' } },
      React.createElement('div', { style: { fontSize: 14, fontWeight: 900, color: '#1A73E8', marginBottom: 2 } }, '📅 Argilan Family Calendars'),
      React.createElement('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.35)' } }, '19 calendars · argilan2family@gmail.com · No Jacob or Grandpa'),
      // Download SW button
      React.createElement('button', {
        onClick: function () { if (window._downloadSW) window._downloadSW(); },
        style: { marginTop: 8, padding: '5px 12px', background: 'rgba(76,175,82,.15)', color: '#4CAF82', border: '1px solid rgba(76,175,82,.3)', borderRadius: 20, fontSize: 9, fontWeight: 800, cursor: 'pointer' }
      }, '⬇️ Download sw.js — Upload this to your GitHub repo alongside index.html')
    ),

    // Setup Guide
    React.createElement('div', {
      onClick: function () { setExpanded(expanded === 'guide' ? null : 'guide'); },
      style: { padding: '10px 14px', background: 'rgba(76,175,82,.06)', borderBottom: '1px solid rgba(76,175,82,.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }
    },
      React.createElement('div', { style: { flex: 1, fontSize: 10, fontWeight: 800, color: '#4CAF82' } }, (expanded === 'guide' ? '▾' : '▸') + '  How to set up — Step by step'),
      React.createElement('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.3)' } }, 'Tap to expand')
    ),
    expanded === 'guide' && React.createElement('div', { style: { padding: '10px 14px', background: 'rgba(0,0,0,.2)', borderBottom: '1px solid rgba(255,255,255,.04)' } },
      [
        ['1', 'Create one shared family Google account: argilan2family@gmail.com'],
        ['2', 'Go to calendar.google.com on a computer'],
        ['3', 'Click "+" next to "Other calendars" → "Create new calendar"'],
        ['4', 'Name it exactly as shown below — copy each name with the Copy button'],
        ['5', 'Click the colored dot next to calendar name → pick the color shown'],
        ['6', 'Tap ⋮ → Settings → Share → add every family member\'s Gmail'],
        ['7', 'On each phone/iPad: open Google Calendar app → tap the calendar to show it'],
      ].map(function (s) {
        return React.createElement('div', { key: s[0], style: { display: 'flex', gap: 8, marginBottom: 5 } },
          React.createElement('div', { style: { width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: '#4CAF82', color: '#000', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, s[0]),
          React.createElement('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.6)', lineHeight: 1.6 } }, s[1])
        );
      })
    ),

    // Calendar sections
    React.createElement('div', { style: { padding: '8px 12px' } },
      sections.map(function (section) {
        var sectionCals = CALS.filter(function (c) { return c.section === section; });
        return React.createElement('div', { key: section, style: { marginBottom: 16 } },
          // Section header
          React.createElement('div', { style: { fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,.35)', letterSpacing: 2, marginBottom: 6, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,.05)' } }, section.toUpperCase()),
          // Calendar cards — 2-column grid
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 } },
            sectionCals.map(function (cal) {
              return React.createElement('div', { key: cal.id, style: { background: cal.color + '12', border: '1px solid ' + cal.color + '40', borderRadius: 10, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 } },
                // Name row
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
                  React.createElement('div', { style: { width: 12, height: 12, borderRadius: '50%', flexShrink: 0, background: cal.color } }),
                  React.createElement('div', { style: { fontSize: 11, fontWeight: 800, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, cal.emoji + ' ' + cal.name)
                ),
                // Color badge + copy button
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
                  React.createElement('div', { style: { fontSize: 8, color: cal.color, background: cal.color + '18', border: '1px solid ' + cal.color + '35', borderRadius: 20, padding: '2px 6px', fontWeight: 800, flex: 1, textAlign: 'center' } }, cal.gcal),
                  React.createElement('button', {
                    onClick: function () { copy(cal.name, cal.id); },
                    style: { padding: '2px 8px', background: copied === cal.id ? '#4CAF82' : 'transparent', color: copied === cal.id ? '#000' : cal.color, border: '1px solid ' + cal.color + '55', borderRadius: 20, fontSize: 8, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .2s' }
                  }, copied === cal.id ? '✓' : 'Copy')
                )
              );
            })
          )
        );
      })
    ),

    // Vet pets note
    React.createElement('div', { style: { margin: '0 12px 12px', padding: '8px 12px', background: 'rgba(38,166,154,.06)', border: '1px solid rgba(38,166,154,.2)', borderRadius: 10 } },
      React.createElement('div', { style: { fontSize: 9, fontWeight: 800, color: '#26A69A', marginBottom: 4 } }, '🐾 VET VISITS CALENDAR — PET NAMES'),
      React.createElement('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.6)', lineHeight: 1.9 } },
        '🐕 Khaniikos Kappa   🐕 Skyli Enia   🐇 S\'Moresey\nAdd pet name in event title, e.g. "Max — Annual Shots"')
    ),

    // Field trip calendar note
    React.createElement('div', { style: { margin: '0 12px', padding: '8px 12px', background: 'rgba(255,152,0,.06)', border: '1px solid rgba(255,152,0,.2)', borderRadius: 10 } },
      React.createElement('div', { style: { fontSize: 9, fontWeight: 800, color: '#FF9800', marginBottom: 4 } }, '🚌 FIELD TRIP DAYS — ADD TO DKA CALENDAR'),
      React.createElement('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.5)', lineHeight: 2 } },
        'Sep: Glencairn Garden · Oct: Crowders Mountain · Nov: McDowell Preserve\n' +
        'Dec: Latta Preserve · Jan: Lake Wylie · Feb: Reedy Creek\n' +
        'Mar: Landsford Canal · Apr: Freedom Park · May: White Memorial Preserve'
      )
    )
  );
}


// ═══ MUSIC CLASS ═══
"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// ═══ DKA MUSIC CLASS MODULE ═══════════════════════════════════════════════════

var INSTRUMENTS = [{
  id: 'guitar',
  name: 'Guitar',
  emoji: '🎸',
  color: '#E91E63',
  desc: 'Acoustic or electric — chords, strumming, songs'
}, {
  id: 'drums',
  name: 'Drums',
  emoji: '🥁',
  color: '#FF5722',
  desc: 'Rhythm, beats, drum patterns, coordination'
}, {
  id: 'ukulele',
  name: 'Ukulele',
  emoji: '🎵',
  color: '#FF9800',
  desc: 'Small guitar — easy chords, Hawaiian roots'
}, {
  id: 'piano',
  name: 'Piano',
  emoji: '🎹',
  color: '#2196F3',
  desc: 'Keys, scales, chords, reading music'
}, {
  id: 'bass',
  name: 'Bass Guitar',
  emoji: '🎶',
  color: '#9C27B0',
  desc: 'Low end, groove, rhythm foundation'
}, {
  id: 'violin',
  name: 'Violin',
  emoji: '🎻',
  color: '#4CAF50',
  desc: 'Strings, bow technique, classical & more'
}, {
  id: 'singing',
  name: 'Voice / Singing',
  emoji: '🎤',
  color: '#9C27B0',
  desc: 'Vocal technique, worship songs, breath control, harmony'
}];

// Structured lessons per instrument — 30 days of progressive content
var GUITAR_LESSONS = [{
  day: 1,
  title: 'Meet Your Guitar',
  focus: 'Parts of the guitar, how to hold it, tuning basics (EADGBE)',
  chord: null,
  song: null
}, {
  day: 2,
  title: 'Your First Chord — Em',
  focus: 'E minor chord shape, finger placement, clean strumming',
  chord: 'Em',
  song: null
}, {
  day: 3,
  title: 'Add Am Chord',
  focus: 'A minor chord, switching between Em and Am',
  chord: 'Am',
  song: null
}, {
  day: 4,
  title: 'Practice Em → Am',
  focus: 'Smooth chord transitions, 4-beat strumming pattern',
  chord: 'Em/Am',
  song: null
}, {
  day: 5,
  title: 'G Major Chord',
  focus: 'G chord shape, 3-finger placement, clearing string buzz',
  chord: 'G',
  song: null
}, {
  day: 6,
  title: 'C Major Chord',
  focus: 'C chord, watch finger 2 position, Em→Am→G→C progression',
  chord: 'C',
  song: 'Simple progression: G - C - G - C'
}, {
  day: 7,
  title: 'D Major Chord',
  focus: 'D chord shape, the 4 essential chords: G - C - Am - D',
  chord: 'D',
  song: '4-chord song intro'
}, {
  day: 8,
  title: '4-Chord Song Practice',
  focus: 'G - D - Am - C (the most popular chord progression in pop music)',
  chord: 'G D Am C',
  song: 'Can play: "Stand by Me" style'
}, {
  day: 9,
  title: 'Strumming Patterns',
  focus: 'Down-down-up-up-down pattern, keeping rhythm steady',
  chord: 'Review',
  song: 'Apply to G-C-D'
}, {
  day: 10,
  title: 'Week 2 Review',
  focus: 'Run through all 5 chords, play full chord progression cleanly',
  chord: 'Review all',
  song: 'Mini performance for family'
}, {
  day: 11,
  title: 'E Major Chord',
  focus: 'E major — subtle difference from Em, bright vs. dark sound',
  chord: 'E',
  song: null
}, {
  day: 12,
  title: 'A Major Chord',
  focus: 'A major chord, compare to Am — major vs. minor sound',
  chord: 'A',
  song: null
}, {
  day: 13,
  title: 'Fingerpicking Intro',
  focus: 'Thumb picks bass string, fingers pick treble, Travis picking',
  chord: 'G C',
  song: 'Simple fingerpick pattern'
}, {
  day: 14,
  title: 'Power Chords',
  focus: 'Two-finger power chords (5th chords) — used in rock music',
  chord: 'E5 A5',
  song: 'Rock riff intro'
}, {
  day: 15,
  title: 'Barre Chord Intro',
  focus: 'F major barre chord — the hardest first barre, wrist position',
  chord: 'F (barre)',
  song: null
}, {
  day: 16,
  title: 'JW Song Practice',
  focus: 'Find a favorite JW Kingdom song and learn its chords',
  chord: 'Applied',
  song: 'Kingdom song on guitar'
}, {
  day: 17,
  title: 'Scales: Pentatonic',
  focus: 'E minor pentatonic scale — 5 notes, foundation of most rock solos',
  chord: 'Scale',
  song: 'Scale exercise'
}, {
  day: 18,
  title: 'Picking Speed',
  focus: 'Alternate picking technique, metronome practice at 60bpm',
  chord: 'Scale',
  song: 'Spider exercise'
}, {
  day: 19,
  title: 'Song: "Amazing Grace"',
  focus: 'Learn the chord progression, slow strumming, vocal timing',
  chord: 'G C D',
  song: 'Amazing Grace'
}, {
  day: 20,
  title: 'Month 1 Showcase',
  focus: 'Play everything learned — full mini concert for the family',
  chord: 'All',
  song: 'Performance day'
}];
var DRUMS_LESSONS = [{
  day: 1,
  title: 'Meet Your Drums',
  focus: 'Parts of the drum kit, how to hold sticks (matched grip)',
  pattern: null,
  song: null
}, {
  day: 2,
  title: 'Single Stroke Roll',
  focus: 'Right-Left-Right-Left — the foundation of all drumming',
  pattern: 'RLRL',
  song: null
}, {
  day: 3,
  title: 'Basic Hi-Hat Beat',
  focus: 'Hi-hat on every beat, snare on 2 and 4, kick on 1',
  pattern: '4/4 basic',
  song: null
}, {
  day: 4,
  title: 'Add the Kick Drum',
  focus: 'Kick on beats 1 and 3, snare on 2 and 4, hi-hat steady',
  pattern: 'Rock beat',
  song: null
}, {
  day: 5,
  title: 'Double Stroke Roll',
  focus: 'RRLL pattern — builds speed and control',
  pattern: 'RRLL',
  song: null
}, {
  day: 6,
  title: 'Fill: 4-stroke tom fill',
  focus: 'Simple fill going down the toms at the end of a phrase',
  pattern: 'Fill',
  song: 'Play 7 beats + 1 fill'
}, {
  day: 7,
  title: 'The Shuffle Beat',
  focus: 'Swung hi-hat rhythm — the feeling of blues and gospel',
  pattern: 'Shuffle',
  song: 'Blues feel'
}, {
  day: 8,
  title: 'Open Hi-Hat',
  focus: 'Open vs. closed hi-hat, the "sizzle" on beat 3',
  pattern: 'Open/closed',
  song: null
}, {
  day: 9,
  title: 'Dynamic Control',
  focus: 'Play same beat at 3 volumes: pp, mf, ff — control matters',
  pattern: 'Dynamic',
  song: null
}, {
  day: 10,
  title: 'Week 2 Review + Groove',
  focus: 'Put it all together: solid groove for 2 minutes straight',
  pattern: 'Review',
  song: 'Groove session'
}, {
  day: 11,
  title: 'Paradiddle',
  focus: 'RLRR-LRLL — fundamental rudiment, used in every style',
  pattern: 'Paradiddle',
  song: null
}, {
  day: 12,
  title: 'Ride Cymbal Beat',
  focus: 'Ride instead of hi-hat — jazz and worship music feel',
  pattern: 'Ride beat',
  song: 'Worship feel'
}, {
  day: 13,
  title: 'Kick Variations',
  focus: 'Kick on the "and" of 2 — syncopated rhythms',
  pattern: 'Syncopation',
  song: null
}, {
  day: 14,
  title: 'JW Song Drumming',
  focus: 'Pick a JW Kingdom song and drum along to the rhythm',
  pattern: 'Applied',
  song: 'Kingdom song'
}, {
  day: 15,
  title: 'Drum Solo Basics',
  focus: 'Build an 8-bar mini solo using everything learned',
  pattern: 'Solo',
  song: 'Family performance'
}, {
  day: 16,
  title: 'Quarter Note Triplets',
  focus: 'Triplet feel — the heartbeat of gospel music',
  pattern: 'Triplets',
  song: 'Gospel triplet feel'
}, {
  day: 17,
  title: 'Linear Drumming',
  focus: 'No two limbs hit at the same time — cleaner, crisper sound',
  pattern: 'Linear',
  song: null
}, {
  day: 18,
  title: 'Speed Building',
  focus: 'Metronome at 80bpm, increase 5bpm each practice until tension',
  pattern: 'Speed',
  song: null
}, {
  day: 19,
  title: 'Play Along: "Amazing Grace"',
  focus: 'Drum along to a hymn — learn to serve the song, not show off',
  pattern: 'Applied',
  song: 'Amazing Grace'
}, {
  day: 20,
  title: 'Month 1 Showcase',
  focus: 'Full mini drum performance for the family',
  pattern: 'All',
  song: 'Performance day'
}];
var PIANO_LESSONS = [{
  day: 1,
  title: 'Meet the Piano',
  focus: '88 keys, Middle C, octave layout, hand position',
  note: 'C D E F G',
  song: null
}, {
  day: 2,
  title: 'Five Finger Position',
  focus: 'Right hand: C-D-E-F-G, each finger on one note, no lifting',
  note: 'C major 5',
  song: null
}, {
  day: 3,
  title: 'Left Hand Five Fingers',
  focus: 'Left hand same position, bass notes C-B-A-G-F going down',
  note: 'LH 5-note',
  song: null
}, {
  day: 4,
  title: 'Both Hands Together',
  focus: 'Simple melody RH, steady bass LH — coordination challenge',
  note: 'Both hands',
  song: 'Mary Had a Little Lamb'
}, {
  day: 5,
  title: 'C Major Scale',
  focus: 'Full 8-note scale both hands, thumb-under technique',
  note: 'C scale',
  song: 'Scale exercise'
}, {
  day: 6,
  title: 'C Major Chord',
  focus: 'C-E-G together, broken chord (arpeggio) vs. block chord',
  note: 'C chord',
  song: null
}, {
  day: 7,
  title: 'G Major Chord',
  focus: 'G-B-D chord, switch between C and G with left hand',
  note: 'G chord',
  song: 'C-G-C-G progression'
}, {
  day: 8,
  title: 'F Major Chord',
  focus: 'F-A-C, the classic C-F-G-C progression — basis of hundreds of songs',
  note: 'F chord',
  song: 'Simple hymn feel'
}, {
  day: 9,
  title: 'JW Song on Piano',
  focus: 'Pick any slow Kingdom song and play the melody with right hand',
  note: 'Applied',
  song: 'Kingdom song melody'
}, {
  day: 10,
  title: 'Week 2 Review',
  focus: 'Run through all chords and scales — family mini concert',
  note: 'Review',
  song: 'Performance'
}];
var UKULELE_LESSONS = [{
  day: 1,
  title: 'Meet Your Ukulele',
  focus: '4 strings (GCEA), how to hold, tuning with a tuner app',
  chord: null,
  song: null
}, {
  day: 2,
  title: 'C Major Chord',
  focus: 'One-finger C chord — easiest first chord on uke',
  chord: 'C',
  song: null
}, {
  day: 3,
  title: 'Am Chord',
  focus: 'A minor chord shape — 2 fingers, easy switch from C',
  chord: 'Am',
  song: null
}, {
  day: 4,
  title: 'F and G7 Chords',
  focus: 'F chord (2 fingers), G7 chord (3 fingers) — the classic 4-chord set',
  chord: 'F G7',
  song: 'C F Am G7'
}, {
  day: 5,
  title: 'Strumming Pattern',
  focus: 'Down-down-up-up-down — ukulele calypso pattern',
  chord: 'C Am F G7',
  song: 'Happy strumming'
}, {
  day: 6,
  title: 'JW Song on Ukulele',
  focus: 'Find a simple Kingdom song and strum the chords',
  chord: 'Applied',
  song: 'Kingdom song'
}, {
  day: 7,
  title: 'Fingerpicking on Uke',
  focus: 'Thumb down, index/middle up on strings 1-2',
  chord: 'C Am',
  song: 'Simple fingerpick'
}, {
  day: 8,
  title: 'Week 1 Showcase',
  focus: 'Play C-Am-F-G7 progression for the family',
  chord: 'All',
  song: 'Performance day'
}];

var BASS_LESSONS = [{
  day: 1, title: 'Meet Your Bass', focus: 'Parts of the bass, how to hold it, tuning basics (EADG — same letters as the bottom 4 guitar strings, one octave down)', chord: null, song: null
}, {
  day: 2, title: 'Open String Groove', focus: 'Play open E, A, D, G in steady quarter notes with a metronome. Bass is about the pocket, not speed.', chord: 'E A D G', song: null
}, {
  day: 3, title: 'Root Note Basics', focus: 'Find the root note of a chord on the fretboard — bass follows the chord progression, usually playing the root', chord: 'Root notes', song: null
}, {
  day: 4, title: 'Finger Technique', focus: 'Alternating index/middle finger plucking (or pick), muting unused strings with the fretting hand', chord: 'Technique', song: null
}, {
  day: 5, title: 'Simple Walking Pattern', focus: 'Root - 3rd - 5th - octave walking bassline over one chord', chord: 'I-iii-V-VIII', song: null
}, {
  day: 6, title: 'Follow a Chord Progression', focus: 'Play root notes under G - C - D progression, locking in with the kick drum feel', chord: 'G C D', song: 'Simple bass line over G-C-D'
}, {
  day: 7, title: 'Rhythm & the Pocket', focus: 'Lock in with a drum beat (real or metronome) — bass and drums are a team', chord: 'Review', song: null
}, {
  day: 8, title: '8th Note Grooves', focus: 'Steady 8th-note bass pattern, the backbone of most pop/rock/gospel songs', chord: 'Groove', song: null
}, {
  day: 9, title: 'JW Song Bass Line', focus: 'Pick a favorite Kingdom song and play root notes along with the recording', chord: 'Applied', song: 'Kingdom song bass line'
}, {
  day: 10, title: 'Week 2 Showcase', focus: 'Play a full groove with root notes over a 4-chord progression for the family', chord: 'Review all', song: 'Mini performance for family'
}, {
  day: 11, title: 'Adding the 5th', focus: 'Root-5th pattern — the classic punchy bass sound used in rock and gospel', chord: 'Root-5th', song: null
}, {
  day: 12, title: 'Syncopation', focus: 'Playing off the beat — the "and" counts — adds groove and funk feel', chord: 'Syncopated', song: null
}, {
  day: 13, title: 'Slides & Hammer-ons', focus: 'Slide into a note from a fret below, hammer-on for smooth connections between notes', chord: 'Technique', song: null
}, {
  day: 14, title: 'Fingerstyle vs Pick', focus: 'Compare tone: warm fingerstyle vs. punchy pick attack — when to use each', chord: 'Technique', song: null
}, {
  day: 15, title: 'Minor Pentatonic Bass Fills', focus: 'Simple fill notes between phrases using the minor pentatonic shape', chord: 'Fills', song: null
}, {
  day: 16, title: 'Playing with Others', focus: 'Practice following a guitar or piano player — listen more than you play', chord: 'Ensemble', song: 'Play along with a sibling'
}, {
  day: 17, title: 'Octave Jumps', focus: 'Jumping between the root note and its octave for energy in a chorus', chord: 'Octaves', song: null
}, {
  day: 18, title: 'Speed & Control', focus: 'Metronome practice at 70bpm building to 100bpm — clean notes over fast notes', chord: 'Speed', song: null
}, {
  day: 19, title: 'Song: "Amazing Grace"', focus: 'Play simple root-note bass line under the hymn, locking the tempo steady', chord: 'G C D', song: 'Amazing Grace'
}, {
  day: 20, title: 'Month 1 Showcase', focus: 'Full mini performance — play bass over a full song with the family', chord: 'All', song: 'Performance day'
}];

// Fixed instrument assignments per child (set by Laurel/Eric — not freely chosen)
// Fixed instrument assignments per child — a string (one instrument) or array (choice of several)
var MUSIC_ASSIGNMENTS = {
  ryan: ['bass', 'guitar'],
  ashelyn: ['bass', 'guitar'],
  mykah: 'guitar',
  kayla: 'drums'
};
function getAssignedInstruments(personId) {
  var a = MUSIC_ASSIGNMENTS[personId];
  if (!a) return null;
  return Array.isArray(a) ? a : [a];
}

// Get lesson for instrument and day number
function getMusicLesson(instrumentId, dayNum) {
  var lessons = instrumentId === 'guitar' ? GUITAR_LESSONS : instrumentId === 'drums' ? DRUMS_LESSONS : instrumentId === 'piano' ? PIANO_LESSONS : instrumentId === 'ukulele' ? UKULELE_LESSONS : instrumentId === 'bass' ? BASS_LESSONS : instrumentId === 'singing' ? (typeof SINGING_LESSONS !== 'undefined' ? SINGING_LESSONS : GUITAR_LESSONS) : GUITAR_LESSONS; // default
  return lessons[Math.min(dayNum - 1, lessons.length - 1)] || lessons[0];
}

// ─── Music Class Component ─────────────────────────────────────────────────────
// ── Singing Lessons Curriculum ─────────────────────────────────────────────────
var SINGING_LESSONS = [
  {day:1,  title:"Meet Your Voice",        focus:"How the voice works: vocal cords, breath, resonance. Humming exercise to feel vibration.",  song:"Hum Song #43"},
  {day:2,  title:"Proper Breathing",       focus:"Diaphragmatic breathing: hand on belly, breathe low. 4-count inhale, 8-count exhale.",       song:"Breath exercise with Song #45"},
  {day:3,  title:"Warm Up Every Day",      focus:"Lip trills, sirens low to high, ma-me-mi-mo-mu on 5 notes. Never skip the warm up.",          song:"Apply to Song #1"},
  {day:4,  title:"Pitch Matching",         focus:"Teacher plays a note, student sings it back. Start on middle E. Move up and down.",            song:"Pitch exercise with Song #90"},
  {day:5,  title:"Kingdom Song Connection",focus:"Morning and evening songs ARE voice lessons. Learn every word, vowel, breath mark.",           song:"Deep study: Song #135"},
  {day:6,  title:"Vowel Shaping",          focus:"Ah, Eh, Ee, Oh, Oo — each vowel has a shape in the mouth. Singing is shaped vowels.",         song:"Apply to Song #73"},
  {day:7,  title:"Chest vs Head Voice",    focus:"Chest = lower fuller. Head = higher lighter. Finding the natural break between them.",          song:"Sing same phrase in both registers"},
  {day:8,  title:"Consonants Matter",      focus:"Crisp T, D, K, G, M, N — sharp consonants make words understood in singing.",                  song:"Diction exercise with Song #151"},
  {day:9,  title:"Reading Music Basics",   focus:"Staff, treble clef, notes. Every Good Boy Does Fine. Quarter, half, whole notes.",             song:"Clap the rhythm of Song #9"},
  {day:10, title:"First Harmony",          focus:"Harmony = two notes that sound pleasing together. Find the third above the melody.",            song:"Two-part harmony on Song #43"},
  {day:11, title:"Vibrato and Tone",       focus:"Natural vibrato comes from a relaxed jaw. Wiggle the jaw, let the note wobble naturally.",      song:"Apply to long notes in Song #27"},
  {day:12, title:"Memorizing Songs",       focus:"Section by section: verse, chorus, bridge. Connect meaning to help memory stick.",              song:"Memorize Song #135 completely"},
  {day:13, title:"Singing in a Group",     focus:"Listen more than you sing. Match the person next to you. Blend, do not stick out.",             song:"Family sing-along practice"},
  {day:14, title:"Vocal Health",           focus:"Hydration, no screaming, steam for recovery. What damages vocal cords and how to protect them.", song:"Rest day — listen and analyze"},
  {day:15, title:"Month 1 Performance",    focus:"Sing a complete Kingdom Song for the family — full performance with breath, diction, tone.",    song:"Song of your choice"},
];

// ── History of Music (JW Sources) ─────────────────────────────────────────────
var MUSIC_HISTORY_LESSONS = [
  {title:"Where Did Music Come From?", scripture:"Genesis 4:21", content:"The Bible names Jubal as the founder of all those who play the harp and the flute. Music was part of human life from earliest history. Jehovah designed humans to enjoy and create music.", link:"https://wol.jw.org/en/wol/s/r1/lp-e?q=music"},
  {title:"Music in Worship", scripture:"Psalm 150:1-6", content:"Ancient Israel used harps, lyres, tambourines, flutes, and cymbals. 1 Chronicles 15:16: Levites appointed as trained musicians praising Jehovah daily.", link:"https://wol.jw.org/en/wol/s/r1/lp-e?q=music+worship"},
  {title:"The Psalms: A Songbook", scripture:"Psalm 33:1-3", content:"The book of Psalms is a hymnal of 150 songs. David was a skilled musician. Sing to him a new song; play skillfully on the strings.", link:"https://www.jw.org/en/bible/nwt/books/psalms/1/"},
  {title:"Music in the New World", scripture:"Revelation 5:9; 15:3", content:"Music in paradise: the great crowd sings a new song. In Revelation, harps and singing are part of heavenly worship. Paradise will be filled with joyful music.", link:"https://wol.jw.org/en/wol/s/r1/lp-e?q=music+new+world"},
  {title:"Our Kingdom Songs: Why We Sing", scripture:"Colossians 3:16", content:"Let the word of Christ dwell in you richly, singing with gratitude in your hearts to God. Each Kingdom song is a prayer set to melody.", link:"https://www.jw.org/en/library/music-songs/"},
];

// ── YouTube Tutorial Library ──────────────────────────────────────────────────
var YOUTUBE_TUTORIALS = {
  guitar:[
    {title:"Beginner Guitar: First Chords",genre:"Acoustic/Worship",url:"https://www.youtube.com/results?search_query=beginner+guitar+first+chords+worship"},
    {title:"Gospel Guitar Chords",genre:"Gospel",url:"https://www.youtube.com/results?search_query=gospel+guitar+chords+beginner"},
    {title:"Chord Transitions Practice",genre:"All Styles",url:"https://www.youtube.com/results?search_query=guitar+chord+switching+beginner"},
    {title:"Kingdom Song on Guitar",genre:"JW Worship",url:"https://www.youtube.com/results?search_query=kingdom+song+guitar+tutorial"},
  ],
  drums:[
    {title:"Drum Lessons: Basic Beat",genre:"Rock/Gospel",url:"https://www.youtube.com/results?search_query=beginner+drum+lessons+basic+beat"},
    {title:"Gospel Drumming Basics",genre:"Gospel",url:"https://www.youtube.com/results?search_query=gospel+drumming+basics+beginner"},
    {title:"Worship Drumming Patterns",genre:"Contemporary Worship",url:"https://www.youtube.com/results?search_query=worship+drumming+patterns+beginner"},
  ],
  ukulele:[
    {title:"Ukulele for Beginners",genre:"Folk/Pop",url:"https://www.youtube.com/results?search_query=ukulele+complete+beginners+lesson"},
    {title:"Worship Songs on Ukulele",genre:"Worship",url:"https://www.youtube.com/results?search_query=worship+songs+ukulele+beginner"},
  ],
  piano:[
    {title:"Piano for Beginners",genre:"Classical/All",url:"https://www.youtube.com/results?search_query=piano+beginners+lesson+1"},
    {title:"Gospel Piano Chords",genre:"Gospel/Worship",url:"https://www.youtube.com/results?search_query=gospel+piano+chords+beginner"},
    {title:"Hymns on Piano Easy",genre:"Traditional Hymns",url:"https://www.youtube.com/results?search_query=hymns+piano+easy+beginner"},
  ],
  bass:[
    {title:"Bass Guitar Beginners",genre:"Rock/Gospel",url:"https://www.youtube.com/results?search_query=bass+guitar+beginners+lesson"},
    {title:"Gospel Bass Lines",genre:"Gospel",url:"https://www.youtube.com/results?search_query=gospel+bass+guitar+lines+beginner"},
  ],
  violin:[
    {title:"Violin for Beginners",genre:"Classical",url:"https://www.youtube.com/results?search_query=violin+beginner+lesson+1"},
    {title:"Worship Violin",genre:"Contemporary Worship",url:"https://www.youtube.com/results?search_query=worship+violin+tutorials+beginner"},
  ],
  singing:[
    {title:"Singing Lessons for Beginners",genre:"All Styles",url:"https://www.youtube.com/results?search_query=singing+lessons+beginners+vocal+warmup"},
    {title:"Gospel Vocal Technique",genre:"Gospel/Worship",url:"https://www.youtube.com/results?search_query=gospel+vocal+technique+beginner"},
    {title:"Breath Control for Singers",genre:"All Styles",url:"https://www.youtube.com/results?search_query=breath+control+singing+beginners"},
    {title:"Harmony and Worship Singing",genre:"Worship",url:"https://www.youtube.com/results?search_query=harmony+singing+worship+beginner"},
    {title:"Kingdom Songs Sing Along",genre:"JW Worship",url:"https://www.jw.org/en/library/music-songs/sing-out-joyfully/"},
  ],
};


function MusicClassPanel(_ref) {
  var personId = _ref.personId,
    isTeacher = _ref.isTeacher,
    dayNum = _ref.dayNum;
  var storageKey = 'music_' + personId;
  var assignedList = getAssignedInstruments(personId);
  var _React$useState = React.useState(function () {
      try {
        var saved = syncGet('music_progress/' + personId);
        if (saved && saved.instrument) return saved.instrument;
        var local = JSON.parse(localStorage.getItem(storageKey) || '{}').instrument;
        if (local) return local;
        return assignedList ? assignedList[0] : null;
      } catch (_unused) {
        return assignedList ? assignedList[0] : null;
      }
    }),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    instrument = _React$useState2[0],
    setInstrument = _React$useState2[1];
  var _React$useState3 = React.useState(function () {
      try {
        var saved = syncGet('music_progress/' + personId);
        if (saved && saved.lessonDay) return saved.lessonDay;
        return JSON.parse(localStorage.getItem(storageKey) || '{}').lessonDay || 1;
      } catch (_unused2) {
        return 1;
      }
    }),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    lessonDay = _React$useState4[0],
    setLessonDay = _React$useState4[1];
  var _React$useState5 = React.useState(function () {
      try {
        var saved = syncGet('music_progress/' + personId);
        return saved && saved.notes || '';
      } catch (_unused3) {
        return '';
      }
    }),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    notes = _React$useState6[0],
    setNotes = _React$useState6[1];
  var _React$useState7 = React.useState(false),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    showNotes = _React$useState8[0],
    setShowNotes = _React$useState8[1];
  var _React$useState9 = React.useState(false),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    practicing = _React$useState0[0],
    setPracticing = _React$useState0[1];
  var _React$useState1 = React.useState(null),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    practiceStart = _React$useState10[0],
    setPracticeStart = _React$useState10[1];
  var _React$useState11 = React.useState(0),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    practiceElapsed = _React$useState12[0],
    setPracticeElapsed = _React$useState12[1];
  var timerRef = React.useRef(null);

  // Subscribe to Firebase for cross-device sync
  React.useEffect(function () {
    var unsub = syncOn('music_progress/' + personId, function (d) {
      if (d && d.instrument) {
        setInstrument(d.instrument);
        setLessonDay(d.lessonDay || 1);
        setNotes(d.notes || '');
      }
    });
    return function () {
      if (unsub) unsub();
    };
  }, [personId]);

  // Persist a fixed assignment on first visit so it syncs across devices
  React.useEffect(function () {
    if (instrument && assignedList && assignedList.indexOf(instrument) !== -1) {
      var existing = null;
      try { existing = syncGet('music_progress/' + personId); } catch (_e) {}
      if (!existing || !existing.instrument) {
        syncSet('music_progress/' + personId, { instrument: instrument, lessonDay: 1, notes: '', updatedAt: Date.now() });
      }
    }
  }, [personId]);

  // Practice timer
  React.useEffect(function () {
    if (practicing) {
      timerRef.current = setInterval(function () {
        setPracticeElapsed(function (e) {
          return e + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return function () {
      clearInterval(timerRef.current);
    };
  }, [practicing]);
  function saveProgress(inst, day, n) {
    var data = {
      instrument: inst,
      lessonDay: day,
      notes: n || notes,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (_unused4) {}
    syncSet('music_progress/' + personId, data);
  }
  function chooseInstrument(inst) {
    setInstrument(inst);
    saveProgress(inst, 1, '');
  }
  function advanceLesson() {
    var next = lessonDay + 1;
    setLessonDay(next);
    saveProgress(instrument, next, notes);
  }
  function startPractice() {
    setPracticing(true);
    setPracticeStart(Date.now());
    setPracticeElapsed(0);
  }
  function stopPractice() {
    setPracticing(false);
    var mins = Math.round(practiceElapsed / 60);
    if (mins > 0) syncSet('music_practice/' + personId + '/' + new Date().toISOString().split('T')[0], {
      mins: mins,
      instrument: instrument,
      ts: Date.now()
    });
    if (window._sendNotif) window._sendNotif('🎵 Practice done!', mins + ' min ' + (instrument || '') + ' practice logged');
  }
  function fmtTimer(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }
  var instr = instrument ? INSTRUMENTS.find(function (i) {
    return i.id === instrument;
  }) : null;
  var lesson = instrument ? getMusicLesson(instrument, lessonDay) : null;
  var GOAL_SECS = 30 * 60; // 30 minutes
  var pct = Math.min(100, Math.round(practiceElapsed / GOAL_SECS * 100));

  // ── Instrument chooser ───────────────────────────────────────────────────────
  if (!instrument) {
    return React.createElement('div', {
      style: {
        padding: 14
      }
    }, React.createElement('div', {
      style: {
        fontSize: 13,
        fontWeight: 900,
        color: '#E91E63',
        marginBottom: 4
      }
    }, '🎵 Choose Your Instrument'), React.createElement('div', {
      style: {
        fontSize: 10,
        color: 'rgba(255,255,255,.4)',
        marginBottom: 14
      }
    }, 'This is your instrument for the year. Your lessons will be saved and continue each day.'), React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8
      }
    }, (assignedList && !isTeacher ? INSTRUMENTS.filter(function (i) { return assignedList.indexOf(i.id) !== -1; }) : INSTRUMENTS).map(function (inst) {
      return React.createElement('button', {
        key: inst.id,
        onClick: function onClick() {
          chooseInstrument(inst.id);
        },
        style: {
          background: inst.color + '18',
          border: '1px solid ' + inst.color + '55',
          borderRadius: 12,
          padding: '14px 10px',
          cursor: 'pointer',
          textAlign: 'center'
        }
      }, React.createElement('div', {
        style: {
          fontSize: 32,
          marginBottom: 4
        }
      }, inst.emoji), React.createElement('div', {
        style: {
          fontSize: 11,
          fontWeight: 800,
          color: '#fff'
        }
      }, inst.name), React.createElement('div', {
        style: {
          fontSize: 8,
          color: 'rgba(255,255,255,.4)',
          marginTop: 2,
          lineHeight: 1.5
        }
      }, inst.desc));
    })), React.createElement('div', {
      style: {
        marginTop: 12,
        fontSize: 9,
        color: 'rgba(255,255,255,.3)',
        textAlign: 'center'
      }
    }, 'More instruments (Violin, Bass, and others) can be added. Ask Laurel!'));
  }

  // ── Lesson view ─────────────────────────────────────────────────────────────
  return React.createElement('div', {
    style: {
      paddingBottom: 20
    }
  },
  // Header
  React.createElement('div', {
    style: {
      background: 'linear-gradient(135deg,' + instr.color + '22,transparent)',
      border: '1px solid ' + instr.color + '44',
      borderRadius: 12,
      padding: '12px 14px',
      margin: 14
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 6
    }
  }, React.createElement('div', {
    style: {
      fontSize: 32
    }
  }, instr.emoji), React.createElement('div', {
    style: {
      flex: 1
    }
  }, React.createElement('div', {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: instr.color
    }
  }, instr.name + ' — Lesson ' + lessonDay), React.createElement('div', {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)'
    }
  }, lesson ? lesson.title : '')), (!assignedList || assignedList.length > 1 || isTeacher) && React.createElement('button', {
    onClick: function onClick() {
      setInstrument(null);
      setLessonDay(1);
      saveProgress(null, 1, '');
    },
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.3)',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer'
    }
  }, 'Change')),
  // Lesson content
  lesson && React.createElement('div', {
    style: {
      background: 'rgba(0,0,0,.2)',
      borderRadius: 8,
      padding: '10px 12px'
    }
  }, React.createElement('div', {
    style: {
      fontSize: 10,
      color: instr.color,
      fontWeight: 800,
      marginBottom: 5
    }
  }, '📋 TODAY: ' + lesson.title), React.createElement('div', {
    style: {
      fontSize: 11,
      color: 'rgba(255,255,255,.7)',
      lineHeight: 1.7,
      marginBottom: 8
    }
  }, lesson.focus), (lesson.chord || lesson.pattern || lesson.note) && React.createElement('div', {
    style: {
      background: instr.color + '22',
      border: '1px solid ' + instr.color + '44',
      borderRadius: 8,
      padding: '6px 10px',
      fontSize: 10,
      fontWeight: 800,
      color: instr.color,
      marginBottom: 8
    }
  }, '🎯 Focus: ' + (lesson.chord || lesson.pattern || lesson.note)), lesson.song && React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#F6BF26',
      fontStyle: 'italic'
    }
  }, '🎵 Apply to: ' + lesson.song), !isTeacher && React.createElement('button', {
    onClick: advanceLesson,
    style: {
      marginTop: 10,
      width: '100%',
      background: instr.color,
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      padding: 10,
      fontWeight: 800,
      fontSize: 11,
      cursor: 'pointer'
    }
  }, "I'm done with this lesson — Next Lesson ›"))),
  // YouTube tutorials for this instrument
  (YOUTUBE_TUTORIALS[instrument] || []).length > 0 && React.createElement('div', {
    style: { margin: '0 14px 12px', background: 'rgba(255,0,0,.05)', border: '1px solid rgba(255,0,0,.2)', borderRadius: 12, padding: '10px 12px' }
  },
    React.createElement('div', { style: { fontSize: 10, fontWeight: 800, color: '#FF5252', marginBottom: 6 } }, '▶️ Video Tutorials'),
    YOUTUBE_TUTORIALS[instrument].map(function (v, i) {
      return React.createElement('a', {
        key: i, href: v.url, target: '_blank', rel: 'noopener noreferrer',
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < YOUTUBE_TUTORIALS[instrument].length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none', textDecoration: 'none' }
      },
        React.createElement('span', { style: { fontSize: 10, color: '#fff' } }, v.title),
        React.createElement('span', { style: { fontSize: 8, color: 'rgba(255,255,255,.35)' } }, v.genre + ' ›')
      );
    })
  ),
  // Submit this lesson as an assignment to Google Classroom
  lesson && React.createElement('div', { style: { margin: '0 14px 12px' } },
    React.createElement('button', {
      onClick: function () {
        var url = "https://classroom.google.com/share?url=" +
          encodeURIComponent("https://www.jw.org/en/library/music-songs/") +
          "&title=" + encodeURIComponent(instr.name + " — Lesson " + lessonDay + ": " + lesson.title) +
          "&body=" + encodeURIComponent(
            "Instrument: " + instr.name + "\nLesson " + lessonDay + ": " + lesson.title +
            "\n\nFocus: " + lesson.focus +
            (lesson.chord || lesson.pattern || lesson.note ? "\nKey element: " + (lesson.chord || lesson.pattern || lesson.note) : "") +
            (lesson.song ? "\nApply to: " + lesson.song : "") +
            "\n\nDiscovering Kids Academy — Music Class"
          );
        window.open(url, '_blank');
      },
      style: {
        width: '100%', background: 'rgba(26,115,232,.12)', border: '1px solid rgba(26,115,232,.35)',
        borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        color: '#1A73E8', fontSize: 11, fontWeight: 800
      }
    }, '📤 Submit This Lesson to Google Classroom')
  ),
  // Practice Timer (after-school)
  React.createElement('div', {
    style: {
      margin: '0 14px 12px',
      background: 'rgba(233,30,99,.06)',
      border: '1px solid rgba(233,30,99,.25)',
      borderRadius: 12,
      padding: '10px 12px'
    }
  }, React.createElement('div', {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#E91E63',
      marginBottom: 8
    }
  }, '🎸 30-Minute Practice Timer'), !practicing && React.createElement('button', {
    onClick: startPractice,
    style: {
      width: '100%',
      background: '#E91E63',
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      padding: 10,
      fontWeight: 800,
      fontSize: 12,
      cursor: 'pointer'
    }
  }, '▶ Start Practice Session'), practicing && React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 36,
      fontWeight: 900,
      color: pct >= 100 ? '#4CAF82' : '#E91E63',
      textAlign: 'center',
      marginBottom: 6
    }
  }, fmtTimer(practiceElapsed)), React.createElement('div', {
    style: {
      height: 8,
      background: 'rgba(255,255,255,.06)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8
    }
  }, React.createElement('div', {
    style: {
      height: '100%',
      width: pct + '%',
      background: pct >= 100 ? '#4CAF82' : '#E91E63',
      transition: 'width 1s'
    }
  })), React.createElement('div', {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)',
      textAlign: 'center',
      marginBottom: 8
    }
  }, pct >= 100 ? '✅ 30 minutes reached!' : Math.round((GOAL_SECS - practiceElapsed) / 60) + ' minutes remaining'), React.createElement('button', {
    onClick: stopPractice,
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.08)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,.2)',
      borderRadius: 20,
      padding: 10,
      fontWeight: 800,
      fontSize: 11,
      cursor: 'pointer'
    }
  }, '⏹ Stop & Save Practice'))),
  // Personal notes
  React.createElement('div', {
    style: {
      margin: '0 14px'
    }
  }, React.createElement('button', {
    onClick: function onClick() {
      setShowNotes(function (p) {
        return !p;
      });
    },
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.04)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 20,
      padding: '7px',
      color: 'rgba(255,255,255,.5)',
      fontSize: 9,
      fontWeight: 700,
      cursor: 'pointer',
      marginBottom: 6
    }
  }, showNotes ? '▾ Hide practice notes' : '▸ My practice notes'), showNotes && React.createElement('textarea', {
    value: notes,
    onChange: function onChange(e) {
      setNotes(e.target.value);
      saveProgress(instrument, lessonDay, e.target.value);
    },
    placeholder: 'Write what you practiced, what was hard, what clicked today...',
    autoCorrect: 'on',
    autoCapitalize: 'sentences',
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.07)',
      border: '1px solid rgba(255,255,255,.12)',
      borderRadius: 8,
      padding: '8px 10px',
      color: '#fff',
      fontSize: 12,
      minHeight: 80,
      resize: 'vertical',
      fontFamily: 'inherit'
    }
  })));
}