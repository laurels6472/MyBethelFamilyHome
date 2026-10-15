// ═══ TIME EDITOR + CAMERA ═══
// ═══ ADMIN TIME EDITOR + TIME ADJUSTMENT REQUEST + CAMERA PROOF ══════════════

// ─── Admin Time Editor ─────────────────────────────────────────────────────
function AdminTimeEditor({
  sessions,
  family,
  onUpdate,
  syncSet
}) {
  const fam = (family || DEFAULT_FAMILY).filter(p => p.id !== 'grandpa');
  const [selPerson, setSelPerson] = React.useState(fam[0]?.id || '');
  const [addMode, setAddMode] = React.useState(false);
  const [addActivity, setAddActivity] = React.useState('chores');
  const [addStart, setAddStart] = React.useState('');
  const [addEnd, setAddEnd] = React.useState('');
  const [addNote, setAddNote] = React.useState('');
  const [msg, setMsg] = React.useState('');
  // uses the app's local-date todayKey() so edits land on the right day
  const data = sessions[selPerson] || {
    current: null,
    today: []
  };
  const entries = data.today || [];
  function deleteEntry(i) {
    if (!window._safeConfirm('Delete this time entry?')) return;
    const updated = {
      ...sessions,
      [selPerson]: {
        ...data,
        today: entries.filter((_, j) => j !== i)
      }
    };
    onUpdate(updated);
    if (syncSet) syncSet('sessions/' + todayKey() + '/' + selPerson, {
      ...data,
      today: entries.filter((_, j) => j !== i)
    });
    setMsg('Entry deleted');
    setTimeout(() => setMsg(''), 2000);
  }
  function editEntry(i, field, val) {
    const entry = {
      ...entries[i]
    };
    if (field === 'startTime') entry.startTime = new Date(val).getTime();
    if (field === 'endTime') entry.endTime = new Date(val).getTime();
    if (field === 'duration') entry.duration = parseFloat(val) || 0;
    if (field === 'activity') entry.activity = val;
    const today = entries.map((e, j) => j === i ? entry : e);
    const updated = {
      ...sessions,
      [selPerson]: {
        ...data,
        today
      }
    };
    onUpdate(updated);
    if (syncSet) syncSet('sessions/' + todayKey() + '/' + selPerson, {
      ...data,
      today
    });
    setMsg('Entry updated');
    setTimeout(() => setMsg(''), 2000);
  }
  function addEntry() {
    if (!addStart || !addEnd) {
      setMsg('Please fill in start and end time');
      return;
    }
    const st = new Date(addStart).getTime(),
      et = new Date(addEnd).getTime();
    if (et <= st) {
      setMsg('End time must be after start time');
      return;
    }
    const dur = (et - st) / 60000;
    const entry = {
      activity: addActivity,
      startTime: st,
      endTime: et,
      duration: Math.round(dur * 10) / 10,
      approvalStatus: 'approved',
      adminAdded: true,
      note: addNote
    };
    const today = [...entries, entry];
    const updated = {
      ...sessions,
      [selPerson]: {
        ...data,
        today
      }
    };
    onUpdate(updated);
    if (syncSet) syncSet('sessions/' + todayKey() + '/' + selPerson, {
      ...data,
      today
    });
    setAddMode(false);
    setAddStart('');
    setAddEnd('');
    setAddNote('');
    setMsg('Time entry added');
    setTimeout(() => setMsg(''), 2000);
  }
  const person = fam.find(p => p.id === selPerson);
  const iStyle = {
    background: 'rgba(255,255,255,.07)',
    border: '1px solid rgba(255,255,255,.15)',
    borderRadius: 6,
    padding: '5px 8px',
    color: '#fff',
    fontSize: 12,
    width: '100%'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      background: 'rgba(192,202,51,.05)',
      border: '1px solid rgba(192,202,51,.2)',
      borderRadius: 12,
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#C0CA33',
      marginBottom: 8
    }
  }, "⏱ Admin Time Management"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      overflowX: 'auto',
      marginBottom: 10
    }
  }, fam.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    onClick: () => setSelPerson(p.id),
    style: {
      flexShrink: 0,
      padding: '4px 10px',
      borderRadius: 20,
      border: 'none',
      cursor: 'pointer',
      fontSize: 9,
      fontWeight: 700,
      background: selPerson === p.id ? p.color : 'rgba(255,255,255,.07)',
      color: selPerson === p.id ? '#000' : '#555'
    }
  }, p.emoji, " ", p.name))), msg && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#4CAF82',
      marginBottom: 8,
      textAlign: 'center'
    }
  }, msg), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)',
      fontWeight: 800,
      marginBottom: 6
    }
  }, "TODAY'S TIME ENTRIES — ", person?.name), entries.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'rgba(255,255,255,.3)',
      marginBottom: 8
    }
  }, "No entries for today."), entries.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: 6,
      background: 'rgba(0,0,0,.25)',
      borderRadius: 8,
      padding: '8px 10px',
      border: `1px solid ${e.adminAdded ? 'rgba(192,202,51,.3)' : 'rgba(255,255,255,.06)'}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#C0CA33',
      flex: 1,
      fontWeight: 700
    }
  }, getAct(e.activity)?.label || e.activity, e.adminAdded && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 8,
      color: '#C0CA33',
      marginLeft: 4
    }
  }, "Admin Added")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: '#4CAF82'
    }
  }, (e.duration || 0).toFixed(1), " min"), /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteEntry(i),
    style: {
      background: 'rgba(239,83,80,.12)',
      color: '#EF5350',
      border: '1px solid rgba(239,83,80,.2)',
      borderRadius: 20,
      padding: '3px 8px',
      fontSize: 8,
      cursor: 'pointer'
    }
  }, "Delete")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555',
      marginBottom: 2
    }
  }, "Start"), /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    defaultValue: e.startTime ? new Date(e.startTime).toISOString().slice(0, 16) : '',
    onChange: ev => editEntry(i, 'startTime', ev.target.value),
    style: {
      ...iStyle,
      fontSize: 10
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555',
      marginBottom: 2
    }
  }, "End"), /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    defaultValue: e.endTime ? new Date(e.endTime).toISOString().slice(0, 16) : '',
    onChange: ev => editEntry(i, 'endTime', ev.target.value),
    style: {
      ...iStyle,
      fontSize: 10
    }
  }))))), !addMode ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddMode(true),
    style: {
      width: '100%',
      background: 'rgba(192,202,51,.1)',
      border: '1px dashed rgba(192,202,51,.4)',
      borderRadius: 10,
      padding: '8px',
      color: '#C0CA33',
      fontSize: 10,
      fontWeight: 700,
      cursor: 'pointer',
      marginTop: 4
    }
  }, "+ Add Time Entry") : /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.3)',
      borderRadius: 10,
      padding: 10,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      fontWeight: 800,
      marginBottom: 6
    }
  }, "ADD TIME ENTRY"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555',
      marginBottom: 2
    }
  }, "Activity"), /*#__PURE__*/React.createElement("select", {
    value: addActivity,
    onChange: e => setAddActivity(e.target.value),
    style: {
      ...iStyle
    }
  }, (CLOCK_ACTS || []).map(a => /*#__PURE__*/React.createElement("option", {
    key: a.id,
    value: a.id
  }, a.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 5,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555',
      marginBottom: 2
    }
  }, "Start Time"), /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    value: addStart,
    onChange: e => setAddStart(e.target.value),
    style: {
      ...iStyle
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555',
      marginBottom: 2
    }
  }, "End Time"), /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    value: addEnd,
    onChange: e => setAddEnd(e.target.value),
    style: {
      ...iStyle
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555',
      marginBottom: 2
    }
  }, "Note (optional)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: addNote,
    onChange: e => setAddNote(e.target.value),
    placeholder: "Reason for adding (e.g. forgot to clock in)",
    autoCorrect: "on",
    style: {
      ...iStyle
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: addEntry,
    style: {
      flex: 1,
      background: '#C0CA33',
      color: '#000',
      border: 'none',
      borderRadius: 20,
      padding: '8px',
      fontWeight: 800,
      fontSize: 11,
      cursor: 'pointer'
    }
  }, "Add Entry"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddMode(false),
    style: {
      padding: '8px 14px',
      background: 'rgba(255,255,255,.06)',
      color: '#aaa',
      border: 'none',
      borderRadius: 20,
      fontSize: 10,
      cursor: 'pointer'
    }
  }, "Cancel"))));
}

// ─── Time Adjustment Request (for non-admin) ──────────────────────────────────
function TimeAdjustRequest({
  personId,
  personName
}) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState('');
  const [sent, setSent] = React.useState(false);
  function sendRequest() {
    if (!reason.trim()) return;
    const msg = '⏱ Time adjustment request from ' + personName + ': ' + reason.trim();
    if (window._sendFamilyMessage) window._sendFamilyMessage(msg);else if (window._appSetPin) alert('Request sent to Admin: ' + msg);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setOpen(false);
      setReason('');
    }, 3000);
  }
  if (sent) return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '12px 0',
      padding: '10px',
      background: 'rgba(76,175,82,.1)',
      border: '1px solid rgba(76,175,82,.3)',
      borderRadius: 10,
      textAlign: 'center',
      fontSize: 10,
      color: '#4CAF82',
      fontWeight: 700
    }
  }, "✅ Request sent to Admin");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '12px 0',
      background: 'rgba(255,255,255,.03)',
      border: '1px solid rgba(255,255,255,.07)',
      borderRadius: 10,
      padding: 10
    }
  }, !open ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(true),
    style: {
      width: '100%',
      background: 'rgba(255,152,0,.1)',
      border: '1px solid rgba(255,152,0,.25)',
      borderRadius: 20,
      padding: '8px',
      color: '#FF9800',
      fontSize: 10,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "🙋 Request Time Adjustment") : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#FF9800',
      marginBottom: 6
    }
  }, "Request Time Adjustment"), /*#__PURE__*/React.createElement("textarea", {
    value: reason,
    onChange: e => setReason(e.target.value),
    placeholder: "Explain what needs adjusting and why (e.g. forgot to clock out at 3pm, was cleaning kitchen)",
    autoCorrect: "on",
    autoCapitalize: "sentences",
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.07)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 8,
      padding: '8px 10px',
      color: '#fff',
      fontSize: 13,
      minHeight: 80,
      resize: 'vertical',
      fontFamily: 'inherit',
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: sendRequest,
    disabled: !reason.trim(),
    style: {
      flex: 1,
      background: reason.trim() ? '#FF9800' : 'rgba(255,255,255,.06)',
      color: reason.trim() ? '#000' : '#444',
      border: 'none',
      borderRadius: 20,
      padding: '8px',
      fontWeight: 800,
      fontSize: 11,
      cursor: reason.trim() ? 'pointer' : 'default'
    }
  }, "Send to Admin"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(false),
    style: {
      padding: '8px 12px',
      background: 'rgba(255,255,255,.06)',
      color: '#aaa',
      border: 'none',
      borderRadius: 20,
      fontSize: 10,
      cursor: 'pointer'
    }
  }, "Cancel"))));
}

// ─── Camera Proof for Tasks ───────────────────────────────────────────────────
function TaskPhotoProof({
  taskId,
  personId,
  isAdmin,
  onPhotoApproved
}) {
  const storageKey = 'task_photo_' + taskId + '_' + personId;
  const [photos, setPhotos] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  });
  const [showCamera, setShowCamera] = React.useState(false);
  const fileRef = React.useRef(null);
  function savePhotos(p) {
    setPhotos(p);
    localStorage.setItem(storageKey, JSON.stringify(p));
  }
  function handleCapture(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const photo = {
        id: Date.now(),
        data: ev.target.result,
        ts: Date.now(),
        approved: false
      };
      savePhotos([...photos, photo]);
    };
    reader.readAsDataURL(file);
  }
  function approvePhoto(id) {
    const next = photos.map(p => p.id === id ? {
      ...p,
      approved: true
    } : p);
    savePhotos(next);
    if (onPhotoApproved) onPhotoApproved(taskId);
  }
  function removePhoto(id) {
    if (window._safeConfirm('Remove this photo?')) savePhotos(photos.filter(p => p.id !== id));
  }
  const pending = photos.filter(p => !p.approved);
  const approved = photos.filter(p => p.approved);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, photos.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginBottom: 6
    }
  }, photos.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.data,
    alt: "proof",
    style: {
      width: 60,
      height: 60,
      borderRadius: 8,
      objectFit: 'cover',
      border: `2px solid ${p.approved ? '#4CAF82' : '#FF9800'}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -4,
      right: -4,
      fontSize: 12
    }
  }, p.approved ? '✅' : '⏳'), isAdmin && !p.approved && /*#__PURE__*/React.createElement("button", {
    onClick: () => approvePhoto(p.id),
    style: {
      position: 'absolute',
      bottom: -2,
      left: 0,
      right: 0,
      background: 'rgba(76,175,82,.9)',
      color: '#000',
      border: 'none',
      fontSize: 7,
      fontWeight: 800,
      cursor: 'pointer',
      borderRadius: '0 0 6px 6px',
      padding: 2
    }
  }, "✓ Approve"), (isAdmin || pending.length > 0 && !p.approved) && /*#__PURE__*/React.createElement("button", {
    onClick: () => removePhoto(p.id),
    style: {
      position: 'absolute',
      top: -4,
      left: -4,
      width: 16,
      height: 16,
      background: 'rgba(239,83,80,.9)',
      color: '#fff',
      border: 'none',
      fontSize: 10,
      cursor: 'pointer',
      borderRadius: '50%',
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "×")))), !isAdmin && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: handleCapture
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => fileRef.current?.click(),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      padding: '5px 10px',
      background: 'rgba(26,115,232,.1)',
      border: '1px solid rgba(26,115,232,.25)',
      borderRadius: 20,
      color: '#1A73E8',
      fontSize: 9,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "📷 ", photos.length > 0 ? 'Add Another Photo' : 'Add Photo Proof'), pending.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#FF9800',
      marginTop: 3
    }
  }, "⏳ ", pending.length, " photo", pending.length > 1 ? 's' : '', " waiting for Admin approval")), isAdmin && pending.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#FF9800',
      fontWeight: 700
    }
  }, "⏳ ", pending.length, " photo", pending.length > 1 ? 's' : '', " need approval"));
}


// ═══ WORK PANEL ═══
// ═══ WORK PANEL — Consolidates VA, Consulting, School ══════════════════════════
function WorkPanel({
  role,
  isAdmin,
  isOwner,
  personId,
  sessions,
  wallets,
  reminders,
  onSaveRem,
  onDelRem,
  syncSet,
  addNotif,
  credit,
  onSwitchTab
}) {
  const isParent = role === 'parent';
  const isChild = role === 'child';
  const isElder = role === 'elder';

  // Which sub-tabs to show
  const subTabs = [];
  if (isParent || isOwner) {
    subTabs.push({
      id: 'school',
      l: '🏫 School'
    });
    subTabs.push({
      id: 'va',
      l: '💻 VA Work'
    });
    subTabs.push({
      id: 'consulting',
      l: '🌿 Consulting'
    });
  } else {
    // Children just see school
    subTabs.push({
      id: 'school',
      l: '🏫 School'
    });
  }
  const [subTab, setSubTab] = React.useState(subTabs[0]?.id || 'school');
  return /*#__PURE__*/React.createElement("div", null, (isAdmin || isOwner) && typeof AdminQuickTiles === 'function' && /*#__PURE__*/React.createElement(AdminQuickTiles, { onSwitchTab: onSwitchTab || function(){} }), subTabs.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      padding: '8px 14px 0',
      background: 'rgba(0,0,0,.15)',
      borderBottom: '1px solid rgba(255,255,255,.05)'
    }
  }, subTabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setSubTab(t.id),
    style: {
      padding: '10px 14px',
      borderRadius: '10px 10px 0 0',
      border: 'none',
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 700,
      background: subTab === t.id ? 'rgba(255,255,255,.06)' : 'transparent',
      color: subTab === t.id ? '#C0CA33' : 'rgba(255,255,255,.3)',
      borderBottom: subTab === t.id ? '2px solid #C0CA33' : '2px solid transparent'
    }
  }, t.l))), subTab === 'school' && typeof DKAModule !== 'undefined' && React.createElement(DKAModule, {
    personId: personId,
    isTeacher: isAdmin || isOwner,
    isAdmin: isAdmin || isOwner,
    family: (typeof DEFAULT_FAMILY !== 'undefined' ? DEFAULT_FAMILY : [])
  }), subTab === 'school' && typeof HomeschoolModule !== 'undefined' && typeof DKAModule === 'undefined' && React.createElement(HomeschoolModule, {
    personId, isAdmin: isAdmin||isOwner, syncSet, addNotif
  }), subTab === 'va' && (isParent || isOwner) && (typeof VAScheduler !== 'undefined' ? React.createElement(VAScheduler, null) : React.createElement('div', {
    style: {
      padding: 20,
      color: 'rgba(255,255,255,.4)',
      textAlign: 'center'
    }
  }, '💻 VA Scheduler coming soon')), subTab === 'consulting' && (isParent || isOwner) && (typeof MoldingConsultingModule !== 'undefined' ? React.createElement(MoldingConsultingModule, {
    reminders: reminders || {},
    onSaveRem: onSaveRem || ((k, v) => {}),
    onDelRem: onDelRem || (() => {})
  }) : React.createElement('div', {
    style: {
      padding: 20,
      color: 'rgba(255,255,255,.4)',
      textAlign: 'center'
    }
  }, '🌿 Consulting module loading...')));
}


// ═══ ATTENDANCE + NOTIFICATIONS ═══
// ═══ ATTENDANCE REPORT + NOTIFICATION SYSTEM ══════════════════════════════════

// ─── Attendance Report ────────────────────────────────────────────────────────
// SCHOOL_STUDENTS already defined above
function AttendanceReport({
  family,
  isAdmin,
  syncSet
}) {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [month, setMonth] = React.useState(new Date().getMonth());
  const [records, setRecords] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('attendance_' + year) || '{}');
    } catch {
      return {};
    }
  });
  React.useEffect(() => {
    var unsub = syncOn('attendance/' + year, function (d) {
      if (d && typeof d === 'object') {
        setRecords(d);
        try {
          localStorage.setItem('attendance_' + year, JSON.stringify(d));
        } catch {}
      }
    });
    return function () {
      if (unsub) unsub();
    };
  }, [year]);
  function saveRecords(next) {
    setRecords(next);
    try {
      localStorage.setItem('attendance_' + year, JSON.stringify(next));
    } catch {}
    syncSet('attendance/' + year, next);
  }
  function toggleDay(studentId, dateStr, status) {
    // status: 'present'|'absent'|'excused'|null (cycle through)
    var cycle = {
      present: 'absent',
      absent: 'excused',
      excused: null,
      null: 'present'
    };
    var current = (records[studentId] || {})[dateStr] || null;
    var next = cycle[current] || 'present';
    var updated = {
      ...records,
      [studentId]: {
        ...(records[studentId] || {}),
        [dateStr]: next
      }
    };
    if (!next) {
      delete updated[studentId][dateStr];
    }
    saveRecords(updated);
  }

  // Get days in month
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = new Date().toISOString().split('T')[0];
  var monthDays = Array.from({
    length: daysInMonth
  }, (_, i) => {
    var d = new Date(year, month, i + 1);
    var ds = d.toISOString().split('T')[0];
    var dow = d.getDay();
    return {
      date: ds,
      day: i + 1,
      isWeekend: dow === 0 || dow === 6,
      isFuture: ds > today
    };
  }).filter(d => !d.isWeekend);
  var students = (family || DEFAULT_FAMILY).filter(p => SCHOOL_STUDENTS.includes(p.id));
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var STATUS_COLOR = {
    present: '#4CAF82',
    absent: '#EF5350',
    excused: '#FF9800'
  };
  var STATUS_ICON = {
    present: '✓',
    absent: '✗',
    excused: 'E'
  };
  function getStats(sid) {
    var recs = records[sid] || {};
    var days = monthDays.filter(d => !d.isFuture);
    var p = 0,
      a = 0,
      e = 0;
    days.forEach(d => {
      var s = recs[d.date];
      if (s === 'present') p++;else if (s === 'absent') a++;else if (s === 'excused') e++;
    });
    return {
      present: p,
      absent: a,
      excused: e,
      total: days.length,
      pct: days.length ? Math.round(p / days.length * 100) : 0
    };
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px',
      borderBottom: '1px solid rgba(255,255,255,.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      color: '#fff',
      marginBottom: 6
    }
  }, "📋 Attendance Report"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMonth(m => (m + 11) % 12),
    style: {
      background: 'rgba(255,255,255,.08)',
      border: 'none',
      color: '#fff',
      borderRadius: 20,
      padding: '4px 10px',
      cursor: 'pointer',
      fontSize: 12
    }
  }, "‹"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#C0CA33',
      minWidth: 60,
      textAlign: 'center'
    }
  }, MONTHS[month], " ", year), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMonth(m => (m + 1) % 12),
    style: {
      background: 'rgba(255,255,255,.08)',
      border: 'none',
      color: '#fff',
      borderRadius: 20,
      padding: '4px 10px',
      cursor: 'pointer',
      fontSize: 12
    }
  }, "›"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      fontSize: 8,
      color: 'rgba(255,255,255,.3)'
    }
  }, isAdmin ? 'Tap day to mark' : 'Read-only'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: '6px 14px',
      borderBottom: '1px solid rgba(255,255,255,.04)'
    }
  }, [['present', '✓ Present'], ['absent', '✗ Absent'], ['excused', 'E Excused']].map(([s, l]) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: STATUS_COLOR[s]
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(255,255,255,.4)'
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 9
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 10px',
      textAlign: 'left',
      color: 'rgba(255,255,255,.4)',
      fontWeight: 700,
      minWidth: 70
    }
  }, "Student"), monthDays.slice(0, 20).map(d => /*#__PURE__*/React.createElement("th", {
    key: d.date,
    style: {
      padding: '4px 2px',
      textAlign: 'center',
      color: 'rgba(255,255,255,.3)',
      fontWeight: 400,
      minWidth: 22
    }
  }, d.day)), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 8px',
      textAlign: 'center',
      color: '#C0CA33',
      fontSize: 8,
      fontWeight: 800
    }
  }, "%"))), /*#__PURE__*/React.createElement("tbody", null, students.map(s => {
    var stats = getStats(s.id);
    var recs = records[s.id] || {};
    return /*#__PURE__*/React.createElement("tr", {
      key: s.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '5px 10px',
        color: '#fff',
        fontWeight: 700,
        fontSize: 10
      }
    }, s.emoji, " ", s.name), monthDays.slice(0, 20).map(d => {
      var status = recs[d.date] || null;
      return /*#__PURE__*/React.createElement("td", {
        key: d.date,
        style: {
          padding: 2,
          textAlign: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        onClick: () => isAdmin && !d.isFuture && toggleDay(s.id, d.date, status),
        style: {
          width: 20,
          height: 20,
          borderRadius: 4,
          margin: '0 auto',
          background: status ? STATUS_COLOR[status] : 'rgba(255,255,255,.06)',
          cursor: isAdmin && !d.isFuture ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 8,
          fontWeight: 800,
          color: status ? '#fff' : 'rgba(255,255,255,.15)',
          opacity: d.isFuture ? 0.3 : 1
        }
      }, status ? STATUS_ICON[status] : ''));
    }), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '5px 8px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 800,
        color: stats.pct >= 90 ? '#4CAF82' : stats.pct >= 75 ? '#FF9800' : '#EF5350'
      }
    }, stats.pct, "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 7,
        color: 'rgba(255,255,255,.3)'
      }
    }, stats.present, "/", stats.total)));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)',
      fontWeight: 800,
      marginBottom: 8,
      letterSpacing: 1
    }
  }, "MONTHLY SUMMARY"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, students.map(s => {
    var st = getStats(s.id);
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        background: 'rgba(255,255,255,.03)',
        border: '1px solid rgba(255,255,255,.07)',
        borderRadius: 10,
        padding: '10px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, s.emoji), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: '#fff'
      }
    }, s.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: st.pct >= 90 ? '#4CAF82' : st.pct >= 75 ? '#FF9800' : '#EF5350',
        fontWeight: 800
      }
    }, st.pct, "% attendance"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, [['✓', st.present, '#4CAF82'], ['✗', st.absent, '#EF5350'], ['E', st.excused, '#FF9800']].map(([icon, count, color]) => /*#__PURE__*/React.createElement("div", {
      key: icon,
      style: {
        flex: 1,
        background: `${color}11`,
        borderRadius: 6,
        padding: '4px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 800,
        color
      }
    }, count), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 7,
        color: 'rgba(255,255,255,.3)'
      }
    }, icon)))));
  }))));
}

// ─── Notification System ──────────────────────────────────────────────────────
function requestNotifPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
function sendNotif(title, body, opts) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') {
    Notification.requestPermission(function (perm) {
      if (perm === 'granted') new Notification(title, {
        body,
        icon: '/favicon.ico',
        ...(opts || {})
      });
    });
    return;
  }
  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      ...(opts || {})
    });
  } catch {}
}

// Expose globally for use across components
window._sendNotif = sendNotif;
window._requestNotifPermission = requestNotifPermission;


// ═══ FAMILY CLOCK DASHBOARD ═══
// ═══ FAMILY CLOCK DASHBOARD — Admin sees all active + today's sessions ═════════

function FamilyClockDashboard({
  sessions,
  family,
  isAdmin,
  payMode
}) {
  const [now, setNow] = React.useState(Date.now());
  const [expanded, setExpanded] = React.useState(null); // personId to show history

  // Live clock — updates every 10 seconds
  React.useEffect(function () {
    var t = setInterval(function () {
      setNow(Date.now());
    }, 10000);
    return function () {
      clearInterval(t);
    };
  }, []);
  var fam = (family || DEFAULT_FAMILY).filter(function (p) {
    return p.id !== 'grandpa';
  });
  function fmtDuration(ms) {
    var min = Math.floor(ms / 60000);
    if (min < 60) return min + 'm';
    return Math.floor(min / 60) + 'h ' + min % 60 + 'm';
  }
  function fmtTime(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  // Build status for each person
  var statuses = fam.map(function (p) {
    var data = sessions[p.id] || {
      current: null,
      today: []
    };
    var cur = data.current;
    var today = data.today || [];
    var act = cur ? getAct(cur.activity) : null;
    var elapsed = cur ? now - cur.startTime : 0;
    var todayMin = today.reduce(function (s, e) {
      return s + (e.duration || 0);
    }, 0);
    if (cur) todayMin += elapsed / 60000;
    return {
      person: p,
      current: cur,
      act: act,
      elapsed: elapsed,
      today: today,
      todayMin: Math.round(todayMin)
    };
  });
  var activeNow = statuses.filter(function (s) {
    return s.current;
  });
  var idleToday = statuses.filter(function (s) {
    return !s.current && s.today.length > 0;
  });
  var notStarted = statuses.filter(function (s) {
    return !s.current && s.today.length === 0;
  });
  function PersonRow({
    s,
    showHistory
  }) {
    var p = s.person;
    var isActive = !!s.current;
    return React.createElement('div', {
      style: {
        marginBottom: 6,
        background: isActive ? `${s.act?.color || '#555'}11` : 'rgba(255,255,255,.02)',
        border: `1px solid ${isActive ? (s.act?.color || '#555') + '44' : 'rgba(255,255,255,.06)'}`,
        borderRadius: 12,
        overflow: 'hidden'
      }
    },
    // Main row
    React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        cursor: 'pointer'
      },
      onClick: function () {
        setExpanded(expanded === p.id ? null : p.id);
      }
    },
    // Avatar with live pulse if active
    React.createElement('div', {
      style: {
        position: 'relative',
        flexShrink: 0
      }
    }, React.createElement('div', {
      style: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: p.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20
      }
    }, p.emoji), isActive && React.createElement('div', {
      style: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#4CAF82',
        border: '2px solid #0f0c29',
        boxShadow: '0 0 6px #4CAF82',
        animation: 'pulse 2s infinite'
      }
    })),
    // Name + status
    React.createElement('div', {
      style: {
        flex: 1
      }
    }, React.createElement('div', {
      style: {
        fontSize: 12,
        fontWeight: 800,
        color: '#fff'
      }
    }, p.name), isActive ? React.createElement('div', {
      style: {
        fontSize: 10,
        color: s.act?.color || '#888',
        fontWeight: 600
      }
    }, s.act?.label || 'Working') : React.createElement('div', {
      style: {
        fontSize: 9,
        color: 'rgba(255,255,255,.3)'
      }
    }, s.today.length > 0 ? 'Done for now' : 'Not started')),
    // Right side: elapsed / total
    React.createElement('div', {
      style: {
        textAlign: 'right',
        flexShrink: 0
      }
    }, isActive && React.createElement('div', {
      style: {
        fontSize: 14,
        fontWeight: 900,
        color: s.act?.color || '#888'
      }
    }, fmtDuration(s.elapsed)), isActive && React.createElement('div', {
      style: {
        fontSize: 8,
        color: 'rgba(255,255,255,.3)'
      }
    }, 'since ' + fmtTime(s.current.startTime)), s.todayMin > 0 && React.createElement('div', {
      style: {
        fontSize: 9,
        color: 'rgba(255,255,255,.4)',
        marginTop: 2
      }
    }, fmtDuration(s.todayMin * 60000) + ' today')),
    // Expand arrow
    React.createElement('div', {
      style: {
        fontSize: 10,
        color: 'rgba(255,255,255,.2)',
        flexShrink: 0
      }
    }, expanded === p.id ? '▾' : '▸')),
    // History expand
    expanded === p.id && s.today.length > 0 && React.createElement('div', {
      style: {
        borderTop: '1px solid rgba(255,255,255,.05)',
        padding: '8px 12px',
        background: 'rgba(0,0,0,.2)'
      }
    }, React.createElement('div', {
      style: {
        fontSize: 8,
        color: 'rgba(255,255,255,.4)',
        fontWeight: 800,
        marginBottom: 6,
        letterSpacing: 1
      }
    }, "TODAY'S SESSIONS"), s.today.map(function (entry, i) {
      var a = getAct(entry.activity);
      return React.createElement('div', {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 0',
          borderBottom: '1px solid rgba(255,255,255,.04)'
        }
      }, React.createElement('div', {
        style: {
          width: 8,
          height: 8,
          borderRadius: '50%',
          flexShrink: 0,
          background: a?.color || '#888'
        }
      }), React.createElement('div', {
        style: {
          flex: 1,
          fontSize: 10,
          color: 'rgba(255,255,255,.7)'
        }
      }, a?.label || entry.activity), React.createElement('div', {
        style: {
          fontSize: 9,
          color: 'rgba(255,255,255,.4)'
        }
      }, fmtTime(entry.startTime) + ' – ' + fmtTime(entry.endTime)), React.createElement('div', {
        style: {
          fontSize: 9,
          fontWeight: 700,
          color: 'rgba(255,255,255,.6)',
          minWidth: 36,
          textAlign: 'right'
        }
      }, Math.round(entry.duration || 0) + 'm'));
    })), expanded === p.id && s.today.length === 0 && React.createElement('div', {
      style: {
        borderTop: '1px solid rgba(255,255,255,.05)',
        padding: '8px 12px',
        fontSize: 10,
        color: 'rgba(255,255,255,.3)',
        textAlign: 'center'
      }
    }, 'No sessions logged yet today'));
  }
  return React.createElement('div', {
    style: {
      marginBottom: 16
    }
  },
  // Header
  React.createElement('div', {
    style: {
      padding: '10px 14px 8px',
      background: 'rgba(0,0,0,.2)',
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
      color: '#fff',
      marginBottom: 1
    }
  }, '👨‍👩‍👧‍👦 Family Clock Status'), React.createElement('div', {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.3)'
    }
  }, 'Live · updates every 10 sec · tap a name for history')),
  // Active count badge
  activeNow.length > 0 && React.createElement('div', {
    style: {
      background: 'rgba(76,175,82,.15)',
      border: '1px solid rgba(76,175,82,.3)',
      borderRadius: 20,
      padding: '4px 10px',
      fontSize: 9,
      fontWeight: 800,
      color: '#4CAF82'
    }
  }, activeNow.length + ' active now')), React.createElement('div', {
    style: {
      padding: '10px 12px'
    }
  },
  // Currently active
  activeNow.length > 0 && React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 8,
      color: '#4CAF82',
      fontWeight: 800,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, '🟢 CLOCKED IN NOW'), activeNow.map(function (s) {
    return React.createElement(PersonRow, {
      key: s.person.id,
      s: s
    });
  })),
  // Done for today
  idleToday.length > 0 && React.createElement('div', {
    style: {
      marginTop: activeNow.length ? 12 : 0
    }
  }, React.createElement('div', {
    style: {
      fontSize: 8,
      color: 'rgba(255,255,255,.3)',
      fontWeight: 800,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, '⏹ CLOCKED OUT TODAY'), idleToday.map(function (s) {
    return React.createElement(PersonRow, {
      key: s.person.id,
      s: s
    });
  })),
  // Not started
  notStarted.length > 0 && React.createElement('div', {
    style: {
      marginTop: activeNow.length || idleToday.length ? 12 : 0
    }
  }, React.createElement('div', {
    style: {
      fontSize: 8,
      color: 'rgba(255,255,255,.2)',
      fontWeight: 800,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, '○ NOT STARTED'), React.createElement('div', {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, notStarted.map(function (s) {
    return React.createElement('div', {
      key: s.person.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        background: 'rgba(255,255,255,.03)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,.06)'
      }
    }, React.createElement('span', {
      style: {
        fontSize: 14
      }
    }, s.person.emoji), React.createElement('span', {
      style: {
        fontSize: 10,
        color: 'rgba(255,255,255,.35)'
      }
    }, s.person.name));
  })))));
}

