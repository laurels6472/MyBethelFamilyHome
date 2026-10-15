// ═══ STANDARD TASKS + MESSENGER + GRADEBOOK ═══
// ═══ STANDARD TASKS + MESSENGER + GRADEBOOK ══════════════════════════════════

// ─── Standard Tasks Data ─────────────────────────────────────────────────────
const DEFAULT_STANDARD_TASKS = {
  morning: [{
    id: 'm1',
    time: '8:30–9:15 AM',
    icon: '🍳',
    label: 'Have breakfast, get dressed & make the bed'
  }, {
    id: 'm2',
    time: '9:15–9:30 AM',
    icon: '🐾',
    label: 'Feed/water dogs & check on the rabbit'
  }, {
    id: 'm3',
    time: '9:30–10:45 AM',
    icon: '📖',
    label: 'Watchtower study preparation'
  }, {
    id: 'm4',
    time: '10:45–11:00 AM',
    icon: '🧺',
    label: 'Start the first load of laundry'
  }, {
    id: 'm5',
    time: '11:00–12:00 PM',
    icon: '🧽',
    label: 'Detail clean the bathroom (see checklist)',
    hasChecklist: 'bathroom'
  }, {
    id: 'm6',
    time: '12:00–12:45 PM',
    icon: '🥪',
    label: 'Quick lunch & get ready for the meeting'
  }],
  afternoon: [{
    id: 'a1',
    time: '1:00–2:45 PM',
    icon: '👔',
    label: 'Attend the Meeting'
  }, {
    id: 'a2',
    time: '2:45–3:00 PM',
    icon: '🧺',
    label: 'Swap the laundry'
  }, {
    id: 'a3',
    time: '3:00–4:00 PM',
    icon: '📺',
    label: 'Clean out the downstairs corner in front of the TV'
  }, {
    id: 'a4',
    time: '4:00–4:30 PM',
    icon: '🗑️',
    label: 'Collect all household trash for Tuesday'
  }, {
    id: 'a5',
    time: '4:30–5:30 PM',
    icon: '🛋️',
    label: 'Free time / catch up on any unfinished chores'
  }],
  evening: [{
    id: 'e1',
    time: '5:30–6:30 PM',
    icon: '🍽️',
    label: 'Dinner prep & family time'
  }, {
    id: 'e2',
    time: '6:30–7:00 PM',
    icon: '🐾',
    label: 'Evening feed for the dogs & final laundry fold'
  }, {
    id: 'e3',
    time: '7:00–7:30 PM',
    icon: '🧼',
    label: 'Clear kitchen counters & sink'
  }, {
    id: 'e4',
    time: '7:30 PM+',
    icon: '🗓️',
    label: 'Review ClickUp for Monday & unwind'
  }],
  bathroom: [{
    id: 'b1',
    label: 'Wipe down mirror and fixtures'
  }, {
    id: 'b2',
    label: 'Scrub the sink and countertops'
  }, {
    id: 'b3',
    label: 'Clean and disinfect the toilet (bowl, base, and seat)'
  }, {
    id: 'b4',
    label: 'Scrub the shower/tub walls and floor'
  }, {
    id: 'b5',
    label: 'Empty the trash can, wipe it down and reline it'
  }, {
    id: 'b6',
    label: 'Refill anything that is empty'
  }, {
    id: 'b7',
    label: 'Sweep and mop the floor'
  }, {
    id: 'b8',
    label: 'Replace all linens'
  }],
  kitchen: [{
    id: 'k1',
    label: 'Wipe down stove & appliances'
  }, {
    id: 'k2',
    label: 'Scrub the sink and countertops'
  }, {
    id: 'k3',
    label: 'Empty the trash can, wipe it down and reline it'
  }, {
    id: 'k4',
    label: 'Sweep and mop the floor'
  }]
};

// ─── Standard Tasks Component ─────────────────────────────────────────────────
function StandardTasksPanel({
  personId,
  isAdmin,
  syncSet
}) {
  const todayStr = new Date().toLocaleDateString('en-CA');
  const storeKey = 'std_tasks_' + todayStr;
  const [tasks, setTasks] = useState(() => {
    try {
      const v = localStorage.getItem(storeKey);
      return v ? JSON.parse(v) : {};
    } catch {
      return {};
    }
  });
  const [customTasks, setCustomTasks] = useState(() => {
    try {
      const v = localStorage.getItem('std_tasks_custom');
      return v ? JSON.parse(v) : DEFAULT_STANDARD_TASKS;
    } catch {
      return DEFAULT_STANDARD_TASKS;
    }
  });
  // Real-time Firebase sync — AFTER useState declarations
  useEffect(() => {
    const unsub = syncOn('std_tasks/' + todayStr, d => {
      if (d && typeof d === 'object') {
        setTasks(d);
        try { localStorage.setItem(storeKey, JSON.stringify(d)); } catch {}
      }
    });
    return () => { if (unsub) unsub(); };
  }, [todayStr]);
  const [editing, setEditing] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editText, setEditText] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editIcon, setEditIcon] = useState('✅');
  const [addSection, setAddSection] = useState(null);
  const [expandChecklist, setExpandChecklist] = useState({});
  const [history, setHistory] = useState(null); // one undo

  function saveCustom(next) {
    setHistory(customTasks);
    setCustomTasks(next);
    localStorage.setItem('std_tasks_custom', JSON.stringify(next));
    if (syncSet) syncSet('argilan/standard_tasks_custom', next);
  }
  function undoCustom() {
    if (!history) return;
    setCustomTasks(history);
    localStorage.setItem('std_tasks_custom', JSON.stringify(history));
    setHistory(null);
  }
  function toggle(id) {
    const wasChecked = !!tasks[id];
    const next = { ...tasks, [id]: !wasChecked };
    setTasks(next);
    localStorage.setItem(storeKey, JSON.stringify(next));
    if (syncSet) syncSet('std_tasks/' + todayStr, next);
    // Award points when checking ON
    if (!wasChecked) {
      // Find task pts
      var taskPts = 5; // default
      Object.values(customTasks||{}).forEach(function(section){
        (section||[]).forEach(function(t){
          if(t.id === id && t.pts) taskPts = t.pts;
        });
      });
      if (window._creditFn && window._currentPersonId) {
        window._creditFn(window._currentPersonId, taskPts, '✅ Task complete: ' + id, 'task_'+id+'_'+todayStr);
      }
      // If needs inspection (pts > 20), also send admin notification
      if (taskPts > 20) {
        var pname = window._currentPersonName || window._currentPersonId || 'Someone';
        if (typeof syncSet === 'function') {
          syncSet('notifs/insp_'+Date.now(), {
            id: 'insp_'+Date.now(), type: 'inspection_needed',
            personId: window._currentPersonId, personName: pname,
            title: '🔍 ' + pname + ' needs inspection',
            message: 'Task "' + id + '" completed — please inspect for ' + taskPts + ' pts',
            timestamp: Date.now(), read: false, approved: null
          });
        }
        if (window._sendNotif) window._sendNotif('🔍 Inspection needed', pname + ' completed a task — inspect for ' + taskPts + ' pts');
      }
    }
  }
  function deleteTask(section, id) {
    if (!window._safeConfirm('Remove this task? Admin can restore default tasks.')) return;
    saveCustom({
      ...customTasks,
      [section]: customTasks[section].filter(t => t.id !== id)
    });
  }
  function addTask(section) {
    if (!editText.trim()) return;
    const newTask = {
      id: section + '_' + Date.now(),
      label: editText.trim(),
      time: editTime || '',
      icon: editIcon || '✅'
    };
    saveCustom({
      ...customTasks,
      [section]: [...customTasks[section], newTask]
    });
    setEditText('');
    setEditTime('');
    setEditIcon('✅');
    setAddSection(null);
  }
  function restoreDefaults() {
    if (!window._safeConfirm('Restore ALL tasks to default? This cannot be undone.')) return;
    setHistory(customTasks);
    setCustomTasks(DEFAULT_STANDARD_TASKS);
    localStorage.setItem('std_tasks_custom', JSON.stringify(DEFAULT_STANDARD_TASKS));
  }
  function SectionBlock({
    title,
    sectionId,
    icon,
    color,
    items
  }) {
    const sectionItems = customTasks[sectionId] || [];
    const done = sectionItems.filter(t => tasks[t.id]).length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 800,
        color: '#fff'
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#555',
        marginLeft: 'auto'
      }
    }, done, "/", sectionItems.length)), sectionItems.map(task => {
      const isDone = !!tasks[task.id];
      const hasCL = task.hasChecklist;
      const clOpen = expandChecklist[task.id];
      return /*#__PURE__*/React.createElement("div", {
        key: task.id
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginBottom: 4,
          background: isDone ? `${color}10` : 'rgba(255,255,255,.02)',
          border: `1px solid ${isDone ? color : 'rgba(255,255,255,.06)'}`,
          borderRadius: 8,
          padding: '7px 10px'
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => toggle(task.id),
        style: {
          width: 20,
          height: 20,
          borderRadius: 5,
          flexShrink: 0,
          border: `2px solid ${isDone ? color : 'rgba(255,255,255,.2)'}`,
          background: isDone ? color : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, isDone && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: '#000',
          fontWeight: 900
        }
      }, "✓")), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 14,
          flexShrink: 0
        }
      }, task.icon || '✅'), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          cursor: 'pointer'
        },
        onClick: () => toggle(task.id)
      }, task.time && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 8,
          color: color,
          fontWeight: 700
        }
      }, task.time), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: isDone ? '#888' : '#ccc',
          textDecoration: isDone ? 'line-through' : 'none'
        }
      }, task.label),
      /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 7, color: 'rgba(255,255,255,.3)', fontWeight: 700, letterSpacing: .3, marginTop: 2 }
      }, '🌅 Daily Routine & Hygiene · Argilan Family')
    ), hasCL && /*#__PURE__*/React.createElement("button", {
        onClick: () => setExpandChecklist(p => ({
          ...p,
          [task.id]: !p[task.id]
        })),
        style: {
          fontSize: 9,
          color: '#7986CB',
          background: 'rgba(121,134,203,.1)',
          border: '1px solid rgba(121,134,203,.3)',
          borderRadius: 20,
          padding: '2px 7px'
        }
      }, clOpen ? '▾' : '▸', " Detail"), isAdmin && /*#__PURE__*/React.createElement("button", {
        onClick: () => deleteTask(sectionId, task.id),
        style: {
          fontSize: 9,
          color: '#EF5350',
          background: 'none',
          border: 'none',
          padding: '0 4px'
        }
      }, "✕")), hasCL && clOpen && /*#__PURE__*/React.createElement("div", {
        style: {
          marginLeft: 16,
          marginBottom: 6,
          background: 'rgba(0,0,0,.2)',
          borderRadius: 8,
          padding: '8px 10px',
          borderLeft: '3px solid ' + color
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: color,
          marginBottom: 5,
          fontWeight: 700,
          letterSpacing: 1
        }
      }, "🧽 ", hasCL.toUpperCase(), " DETAIL CHECKLIST"), (customTasks[hasCL] || []).map(ci => /*#__PURE__*/React.createElement("div", {
        key: ci.id,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 3
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => toggle(hasCL + '_' + ci.id),
        style: {
          width: 16,
          height: 16,
          borderRadius: 4,
          flexShrink: 0,
          border: `2px solid ${tasks[hasCL + '_' + ci.id] ? color : 'rgba(255,255,255,.2)'}`,
          background: tasks[hasCL + '_' + ci.id] ? color : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, tasks[hasCL + '_' + ci.id] && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 8,
          color: '#000'
        }
      }, "✓")), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 9,
          color: tasks[hasCL + '_' + ci.id] ? '#555' : '#ccc',
          textDecoration: tasks[hasCL + '_' + ci.id] ? 'line-through' : 'none'
        }
      }, ci.label)))));
    }), isAdmin && (addSection === sectionId ? /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(0,0,0,.3)',
        borderRadius: 8,
        padding: '10px',
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5,
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: editIcon,
      onChange: e => setEditIcon(e.target.value),
      style: {
        width: 36,
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 6,
        padding: '5px',
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
      }
    }), /*#__PURE__*/React.createElement("input", {
      value: editTime,
      onChange: e => setEditTime(e.target.value),
      placeholder: "Time (e.g. 9:00–10:00 AM)",
      style: {
        flex: 1,
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 6,
        padding: '5px 8px',
        color: '#fff',
        fontSize: 10
      }
    })), /*#__PURE__*/React.createElement("input", {
      value: editText,
      onChange: e => setEditText(e.target.value),
      placeholder: "Task description...",
      style: {
        width: '100%',
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 6,
        padding: '6px 8px',
        color: '#fff',
        fontSize: 10,
        marginBottom: 6
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => addTask(sectionId),
      style: {
        flex: 1,
        background: color,
        color: '#000',
        border: 'none',
        borderRadius: 20,
        padding: '6px',
        fontSize: 10,
        fontWeight: 800
      }
    }, "✅ Add Task"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setAddSection(null),
      style: {
        flex: 1,
        background: 'rgba(255,255,255,.07)',
        color: '#777',
        border: 'none',
        borderRadius: 20,
        padding: '6px',
        fontSize: 10
      }
    }, "Cancel"))) : /*#__PURE__*/React.createElement("button", {
      onClick: () => setAddSection(sectionId),
      style: {
        width: '100%',
        marginTop: 2,
        padding: '5px',
        borderRadius: 20,
        border: '1px dashed rgba(255,255,255,.12)',
        color: '#444',
        background: 'transparent',
        fontSize: 9
      }
    }, "+ Add Task (Admin)")));
  }
  const totalAll = Object.values(customTasks).flat().filter(t => !['bathroom', 'kitchen'].includes(t.hasChecklist)).length;
  const doneAll = Object.values(customTasks).flat().filter(t => tasks[t.id]).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lbl",
    style: {
      marginBottom: 1
    }
  }, "📋 Daily Tasks"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555'
    }
  }, new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      color: '#C0CA33'
    }
  }, doneAll, "/", totalAll), history && isAdmin && /*#__PURE__*/React.createElement("button", {
    onClick: undoCustom,
    style: {
      fontSize: 9,
      background: 'rgba(255,152,0,.15)',
      border: '1px solid #FF9800',
      color: '#FF9800',
      borderRadius: 20,
      padding: '4px 9px'
    }
  }, "↩ Undo"), isAdmin && /*#__PURE__*/React.createElement("button", {
    onClick: restoreDefaults,
    style: {
      fontSize: 9,
      background: 'rgba(255,255,255,.05)',
      border: '1px solid rgba(255,255,255,.1)',
      color: '#555',
      borderRadius: 20,
      padding: '4px 9px'
    }
  }, "🔄 Defaults")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      background: 'rgba(255,255,255,.06)',
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${doneAll / Math.max(1, totalAll) * 100}%`,
      background: '#C0CA33',
      borderRadius: 3,
      transition: 'width .3s'
    }
  })), /*#__PURE__*/React.createElement(SectionBlock, {
    title: "☀️ Morning",
    sectionId: "morning",
    icon: "☀️",
    color: "#FF9800",
    items: customTasks.morning
  }), /*#__PURE__*/React.createElement(SectionBlock, {
    title: "🌤️ Afternoon",
    sectionId: "afternoon",
    icon: "🌤️",
    color: "#1A73E8",
    items: customTasks.afternoon
  }), /*#__PURE__*/React.createElement(SectionBlock, {
    title: "🌙 Evening",
    sectionId: "evening",
    icon: "🌙",
    color: "#9E69AF",
    items: customTasks.evening
  }));
}

// ─── Messenger Component ──────────────────────────────────────────────────────
const FAMILY_MEMBERS = window.__FM_DEFAULT = [{
  id: 'laurel',
  name: 'Laurel',
  emoji: '👑',
  color: '#8D6E63'
}, {
  id: 'eric',
  name: 'Eric',
  emoji: '👨',
  color: '#1A73E8'
}, {
  id: 'ryan',
  name: 'Ryan',
  emoji: '👦',
  color: '#039BE5'
}, {
  id: 'kayla',
  name: 'Kayla',
  emoji: '👧',
  color: '#F48FB1'
}, {
  id: 'ashelyn',
  name: 'Ashelyn',
  emoji: '👧',
  color: '#9E69AF'
}, {
  id: 'mykah',
  name: 'Mykah',
  emoji: '👦',
  color: '#4CAF82'
}, {
  id: 'jacob',
  name: 'Jacob',
  emoji: '👦',
  color: '#558BB2'
}];
function MessengerPanel({ personId, isAdmin, syncSet, family }) {
  const mArr = v => Array.isArray(v) ? v.filter(Boolean) : (v && typeof v === 'object' ? Object.keys(v).sort((a, b) => a - b).map(k => v[k]).filter(Boolean) : []);
  const FAMILY_MEMBERS = (family && family.length) ? family.filter(p => !p.deleted).map(p => ({ id: p.id, name: p.name, emoji: p.emoji || '🙂', color: p.color || '#8D6E63' })) : window.__FM_DEFAULT;
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dka_messages') || '{}'); } catch { return {}; }
  });
  const [input, setInput] = useState('');
  const [unread, setUnread] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dka_unread_' + personId) || '{}'); } catch { return {}; }
  });
  const messagesEndRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // Subscribe to Firebase messages in real time
  useEffect(() => {
    const unsub = syncOn('messages', d => {
      if (d && typeof d === 'object') {
        setMessages(prev => {
          const next = { ...prev, ...d };
          try { localStorage.setItem('dka_messages', JSON.stringify(next)); } catch {}
          // Update unread counts for threads we are not currently viewing
          const newUnread = {};
          Object.keys(next).forEach(tid => {
            if (tid === thread) return; // currently open — mark as read
            const msgs = mArr(next[tid]);
            const unreadMsgs = msgs.filter(m => !m.read && m.to === personId);
            if (unreadMsgs.length) newUnread[tid] = unreadMsgs.length;
          });
          if (JSON.stringify(newUnread) !== JSON.stringify(unread)) {
            setUnread(newUnread);
            try { localStorage.setItem('dka_unread_' + personId, JSON.stringify(newUnread)); } catch {}
          }
          return next;
        });
      }
    });
    return () => { if (unsub) unsub(); };
  }, [personId, thread]);

  // Auto-scroll to bottom when thread opens or new message arrives
  useEffect(() => {
    if (thread) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  }, [thread, messages]);

  // Focus input when thread opens
  useEffect(() => {
    if (thread) setTimeout(() => inputRef.current?.focus(), 100);
  }, [thread]);

  function getThreadId(a, b) { return [a, b].sort().join('_'); }
  function getOther(tid) { return tid.split('_').find(id => id !== personId); }

  const contacts = isAdmin
    ? FAMILY_MEMBERS.filter(m => m.id !== personId)
    : FAMILY_MEMBERS.filter(m => m.id !== personId && m.id !== 'grandpa');

  // Sort: unread first, then by most recent message
  const sortedContacts = [...contacts].sort((a, b) => {
    const tidA = getThreadId(personId, a.id);
    const tidB = getThreadId(personId, b.id);
    const unreadA = unread[tidA] || 0;
    const unreadB = unread[tidB] || 0;
    if (unreadA !== unreadB) return unreadB - unreadA;
    const lastA = (mArr(messages[tidA]).slice(-1)[0] || {}).ts || 0;
    const lastB = (mArr(messages[tidB]).slice(-1)[0] || {}).ts || 0;
    return lastB - lastA;
  });

  function sendMessage() {
    if (!input.trim() || !thread) return;
    const other = getOther(thread);
    const msg = { from: personId, to: other, text: input.trim(), ts: Date.now(), read: false, id: 'msg_' + Date.now() };
    const next = { ...messages, [thread]: [...mArr(messages[thread]), msg] };
    setMessages(next);
    try { localStorage.setItem('dka_messages', JSON.stringify(next)); } catch {}
    if (syncSet) syncSet('messages/' + thread, next[thread]);
    setInput('');
    try { const me2 = FAMILY_MEMBERS.find(m => m.id === personId); if (window._addNotifFn) window._addNotifFn('message', other, '💬 ' + (me2 ? me2.name : personId), input.trim(), { fromId: personId }); } catch (e) {}
    if (window._sendNotif) {
      const me = FAMILY_MEMBERS.find(m => m.id === personId);
      window._sendNotif('💬 ' + (me?.name || personId), input.trim());
    }
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function openThread(contactId) {
    const tid = getThreadId(personId, contactId);
    setThread(tid);
    // Mark all as read
    const msgs = mArr(messages[tid]);
    const anyUnread = msgs.some(m => !m.read && m.to === personId);
    if (anyUnread) {
      const updated = msgs.map(m => m.to === personId ? { ...m, read: true } : m);
      const next = { ...messages, [tid]: updated };
      setMessages(next);
      if (syncSet) syncSet('messages/' + tid, updated);
      try { localStorage.setItem('dka_messages', JSON.stringify(next)); } catch {}
    }
    const newUnread = { ...unread };
    delete newUnread[tid];
    setUnread(newUnread);
    try { localStorage.setItem('dka_unread_' + personId, JSON.stringify(newUnread)); } catch {}
  }

  function fmtTime(ts) {
    if (!ts) return '';
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  useEffect(() => { const w = window._msgOpenWith; if (w && w !== personId) { window._msgOpenWith = null; openThread(w); } }, []);

  const activeContact = thread ? FAMILY_MEMBERS.find(m => m.id === getOther(thread)) : null;
  const threadMessages = thread ? mArr(messages[thread]) : [];
  const totalUnread = Object.values(unread).reduce((s, n) => s + n, 0);

  const iStyle = {
    background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 22, padding: '10px 14px', color: '#fff', fontSize: 13,
    flex: 1, outline: 'none', fontFamily: 'inherit'
  };

  return /*#__PURE__*/React.createElement("div", { style: { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 400 } },

    // ── HEADER ──────────────────────────────────────────────────────────────
    /*#__PURE__*/React.createElement("div", { style: {
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,.07)',
      background: 'rgba(0,0,0,.15)', flexShrink: 0
    } },
      // Back button (in thread view)
      thread && /*#__PURE__*/React.createElement("button", {
        onClick: () => setThread(null),
        style: { background: 'transparent', border: 'none', color: '#1A73E8', fontSize: 20, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }
      }, '‹'),
      // Avatar (in thread view)
      thread && activeContact && /*#__PURE__*/React.createElement("div", {
        style: { width: 34, height: 34, borderRadius: '50%', background: activeContact.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }
      }, activeContact.emoji),
      // Title
      /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 13, fontWeight: 900, color: '#fff' } },
          thread && activeContact ? activeContact.name : '💬 Messages'
        ),
        !thread && totalUnread > 0 && /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, color: '#1A73E8', fontWeight: 700 } },
          totalUnread + ' unread message' + (totalUnread === 1 ? '' : 's')
        ),
        !thread && totalUnread === 0 && /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, color: 'rgba(255,255,255,.3)' } },
          'Tap a person to start messaging'
        )
      ),
      // Unread badge on header
      !thread && totalUnread > 0 && /*#__PURE__*/React.createElement("div", {
        style: { background: '#1A73E8', color: '#fff', borderRadius: 20, padding: '3px 9px', fontSize: 11, fontWeight: 900 }
      }, totalUnread)
    ),

    // ── CONTACT LIST (inbox view) ────────────────────────────────────────────
    !thread && /*#__PURE__*/React.createElement("div", { style: { flex: 1, overflowY: 'auto' } },
      sortedContacts.map(contact => {
        const tid = getThreadId(personId, contact.id);
        const msgs = mArr(messages[tid]);
        const last = (msgs[msgs.length-1]);
        const hasUnread = (unread[tid] || 0) > 0;
        const unreadCount = unread[tid] || 0;

        return /*#__PURE__*/React.createElement("div", {
          key: contact.id,
          onClick: () => openThread(contact.id),
          style: {
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer',
            background: hasUnread ? `${contact.color}14` : 'transparent',
            borderBottom: '1px solid rgba(255,255,255,.04)',
            borderLeft: hasUnread ? `3px solid ${contact.color}` : '3px solid transparent',
            transition: 'background .15s'
          }
        },
          // Avatar
          /*#__PURE__*/React.createElement("div", { style: { position: 'relative', flexShrink: 0 } },
            /*#__PURE__*/React.createElement("div", {
              style: { width: 44, height: 44, borderRadius: '50%', background: contact.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }
            }, contact.emoji),
            hasUnread && /*#__PURE__*/React.createElement("div", {
              style: { position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: '#1A73E8', border: '2px solid #0f0c29', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }
            }, unreadCount > 9 ? '9+' : unreadCount)
          ),
          // Name + preview
          /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            /*#__PURE__*/React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 } },
              /*#__PURE__*/React.createElement("div", { style: { fontSize: 13, fontWeight: hasUnread ? 900 : 600, color: hasUnread ? '#fff' : '#ccc' } }, contact.name),
              /*#__PURE__*/React.createElement("div", { style: { marginLeft: 'auto', fontSize: 9, color: 'rgba(255,255,255,.3)', flexShrink: 0 } }, fmtTime(last?.ts))
            ),
            /*#__PURE__*/React.createElement("div", { style: { fontSize: 11, color: hasUnread ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.3)', fontWeight: hasUnread ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
              last ? (last.from === personId ? 'You: ' : '') + last.text : 'No messages yet — say hello!'
            )
          ),
          // Chevron
          /*#__PURE__*/React.createElement("div", { style: { color: 'rgba(255,255,255,.2)', fontSize: 16, flexShrink: 0 } }, '›')
        );
      })
    ),

    // ── THREAD VIEW ─────────────────────────────────────────────────────────
    thread && /*#__PURE__*/React.createElement(React.Fragment, null,
      // Messages area
      /*#__PURE__*/React.createElement("div", { style: { flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 } },
        threadMessages.length === 0 && /*#__PURE__*/React.createElement("div", { style: { textAlign: 'center', padding: 30, color: 'rgba(255,255,255,.3)', fontSize: 11 } },
          "No messages yet. Say something! 👋"
        ),
        threadMessages.map((msg, i) => {
          const isMe = msg.from === personId;
          const sender = FAMILY_MEMBERS.find(m => m.id === msg.from);
          const prevMsg = threadMessages[i - 1];
          const showDate = !prevMsg || new Date(msg.ts).toDateString() !== new Date(prevMsg.ts).toDateString();
          return /*#__PURE__*/React.createElement(React.Fragment, { key: msg.id || i },
            showDate && /*#__PURE__*/React.createElement("div", { style: { textAlign: 'center', fontSize: 9, color: 'rgba(255,255,255,.3)', margin: '6px 0' } },
              new Date(msg.ts).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
            ),
            /*#__PURE__*/React.createElement("div", { style: { display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 6 } },
              !isMe && sender && /*#__PURE__*/React.createElement("div", { style: { width: 28, height: 28, borderRadius: '50%', background: sender.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 } }, sender.emoji),
              /*#__PURE__*/React.createElement("div", { style: {
                maxWidth: '75%', padding: '9px 13px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isMe ? '#1A73E8' : 'rgba(255,255,255,.09)',
                color: '#fff', fontSize: 13, lineHeight: 1.5, wordBreak: 'break-word'
              } },
                msg.text,
                /*#__PURE__*/React.createElement("div", { style: { fontSize: 8, color: isMe ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.3)', marginTop: 3, textAlign: isMe ? 'right' : 'left' } },
                  fmtTime(msg.ts)
                )
              )
            )
          );
        }),
        /*#__PURE__*/React.createElement("div", { ref: messagesEndRef })
      ),
      // Input bar
      /*#__PURE__*/React.createElement("div", { style: { display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,.07)', flexShrink: 0, background: 'rgba(0,0,0,.1)' } },
        /*#__PURE__*/React.createElement("input", {
          ref: inputRef, value: input, style: iStyle, placeholder: 'Message ' + (activeContact?.name || '') + '...',
          onChange: e => setInput(e.target.value),
          onKeyDown: e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }
        }),
        /*#__PURE__*/React.createElement("button", {
          onClick: sendMessage,
          disabled: !input.trim(),
          style: { background: input.trim() ? '#1A73E8' : 'rgba(255,255,255,.06)', color: input.trim() ? '#fff' : '#444', border: 'none', borderRadius: '50%', width: 44, height: 44, fontSize: 18, cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }
        }, '↑')
      )
    )
  );
}


function GradebookPanel({
  personId,
  isAdmin,
  day
}) {
  const hook = useSchool();
  const [filterStudent, setFilterStudent] = useState(isAdmin ? null : personId);
  const [filterSubject, setFilterSubject] = useState(null);
  const students = isAdmin ? SCHOOL_STUDENTS : SCHOOL_STUDENTS.filter(s => s.id === personId);
  const GRADE_COLORS = {
    A: '#4CAF82',
    B: '#C0CA33',
    C: '#FF9800',
    D: '#FF5722',
    F: '#EF5350'
  };

  // Collect all graded work
  const entries = [];
  for (const s of students) {
    if (filterStudent && s.id !== filterStudent) continue;
    for (let d = 1; d <= day; d++) {
      for (const sub of SUBJECTS) {
        if (filterSubject && sub.id !== filterSubject) continue;
        const prog = hook.getProgress(s.id, d, sub.id);
        if (prog.grade) {
          entries.push({
            student: s,
            day: d,
            subject: sub,
            prog
          });
        }
      }
    }
  }
  entries.sort((a, b) => b.day - a.day || b.prog.gradedAt - a.prog.gradedAt);

  // GPA calc
  const gpaMap = {
    A: 4,
    B: 3,
    C: 2,
    D: 1,
    F: 0
  };
  function calcGPA(sid) {
    const grades = entries.filter(e => e.student.id === sid).map(e => gpaMap[e.prog.grade] || 0);
    if (!grades.length) return null;
    return (grades.reduce((s, g) => s + g, 0) / grades.length).toFixed(2);
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl",
    style: {
      marginBottom: 10
    }
  }, "📊 Gradebook"), isAdmin && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginBottom: 12
    }
  }, SCHOOL_STUDENTS.map(s => {
    const gpa = calcGPA(s.id);
    const gradeCount = entries.filter(e => e.student.id === s.id).length;
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      onClick: () => setFilterStudent(filterStudent === s.id ? null : s.id),
      style: {
        flex: '1 1 100px',
        background: filterStudent === s.id ? `${s.color}20` : 'rgba(255,255,255,.03)',
        border: `1.5px solid ${filterStudent === s.id ? s.color : 'rgba(255,255,255,.07)'}`,
        borderRadius: 10,
        padding: '8px',
        textAlign: 'center',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18
      }
    }, s.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: '#fff'
      }
    }, s.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 900,
        color: s.color
      }
    }, gpa || '—'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#555'
      }
    }, gradeCount, " graded"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      overflowX: 'auto',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setFilterSubject(null),
    style: {
      flexShrink: 0,
      padding: '4px 10px',
      borderRadius: 20,
      border: 'none',
      fontSize: 9,
      fontWeight: 700,
      background: !filterSubject ? '#7986CB' : 'rgba(255,255,255,.07)',
      color: !filterSubject ? '#fff' : '#555'
    }
  }, "All"), SUBJECTS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setFilterSubject(filterSubject === s.id ? null : s.id),
    style: {
      flexShrink: 0,
      padding: '4px 9px',
      borderRadius: 20,
      border: 'none',
      fontSize: 9,
      fontWeight: 700,
      background: filterSubject === s.id ? s.c : 'rgba(255,255,255,.07)',
      color: filterSubject === s.id ? '#fff' : '#555'
    }
  }, s.l))), entries.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: '#333',
      fontSize: 11,
      padding: 20
    }
  }, "No graded assignments yet"), entries.map((e, i) => {
    const c = GRADE_COLORS[e.prog.grade] || '#888';
    const isApproved = e.prog.teacherApproved || e.prog.status === 'approved';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: 'rgba(255,255,255,.02)',
        border: `1px solid rgba(255,255,255,.06)`,
        borderLeft: `4px solid ${c}`,
        borderRadius: 8,
        padding: '8px 10px',
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, isAdmin && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: e.student.color,
        fontWeight: 700
      }
    }, e.student.emoji, " ", e.student.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: '#fff'
      }
    }, e.subject.l, " · Day ", e.day), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#555'
      }
    }, e.prog.actualMins ? e.prog.actualMins.toFixed(0) + ' min total' : '', e.prog.gradedAt ? ' · Graded ' + new Date(e.prog.gradedAt).toLocaleDateString() : '')), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 900,
        color: c
      }
    }, e.prog.grade), e.prog.score && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: c
      }
    }, e.prog.score, "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: isApproved ? '#4CAF82' : '#FF9800'
      }
    }, isApproved ? '✅ Approved' : '⟳ Redo'))), e.prog.feedback && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 5,
        background: 'rgba(0,0,0,.2)',
        borderRadius: 6,
        padding: '5px 8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#555',
        marginBottom: 1
      }
    }, "TEACHER FEEDBACK"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#ccc',
        fontStyle: 'italic'
      }
    }, "\"", e.prog.feedback, "\"")));
  }));
}


