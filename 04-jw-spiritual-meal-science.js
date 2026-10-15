// ═══ JW SPIRITUAL ENGINE ═══
// ═══ JW SPIRITUAL PARENTING ENGINE ══════════════════════════════════════════
// All JW.org material hyperlinked · Family study editor · School credit tracking

const JW_BASE = 'https://www.jw.org';
const JW_URLS = {
  watchtower: JW_BASE + '/en/library/magazines/watchtower/',
  workbook: JW_BASE + '/en/library/jw-meeting-workbook/',
  bookstudy: JW_BASE + '/en/library/books/',
  bible: JW_BASE + '/en/library/bible/',
  ministry: JW_BASE + '/en/library/jw-meeting-workbook/',
  research: JW_BASE + '/en/research-tools/',
  songs: JW_BASE + '/en/library/books/sing-out-joyfully-to-jehovah/',
  home: JW_BASE + '/',
  jwlibrary: 'jwlibrary://catalog/?contentId='
};
function JWAnchor({
  href,
  children,
  style
}) {
  return React.createElement('a', {
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
    style: {
      color: '#7986CB',
      textDecoration: 'none',
      ...(style || {})
    }
  }, children);
}
function SongAnchor({
  num
}) {
  const song = JW_SONGS?.find(s => s.n === num);
  const title = song?.t || `Song ${num}`;
  return React.createElement(JWAnchor, {
    href: `${JW_URLS.songs}song-${num}/`,
    style: {
      fontSize: 'inherit',
      color: '#C0CA33',
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3
    }
  }, [`♪ Song ${num} — ${title} `, React.createElement('span', {
    style: {
      fontSize: 9
    }
  }, '🔗')]);
}

// ─── Default weekly study items ──────────────────────────────────────────────
function defaultWeeklyItems() {
  return [{
    id: 'wt_study',
    cat: 'meeting',
    schoolCredit: true,
    l: '📖 Watchtower Study Prep',
    mins: 30,
    url: JW_URLS.watchtower,
    urlLabel: 'Open Watchtower on JW.org',
    desc: 'Read the week\'s Watchtower study article and mark your answers to each paragraph\'s study question. Read all scriptures cited.',
    tip: 'Find the article in JW Library → Watchtower → current month. Mark answers in margins. Aim to answer at least 5 questions.',
    schoolField: 'Bible Study'
  }, {
    id: 'wb_treasures',
    cat: 'meeting',
    schoolCredit: true,
    l: '💎 Treasures from God\'s Word',
    mins: 10,
    url: JW_URLS.workbook,
    urlLabel: 'Open Meeting Workbook on JW.org',
    desc: 'Read the Bible passage for the week and study the Treasures portion of the CLAM Workbook.',
    tip: 'Open the week\'s lesson in JW Library. Read the Bible text slowly. Note the main theme and 2 key scriptures.',
    schoolField: 'Bible Study'
  }, {
    id: 'wb_ministry',
    cat: 'meeting',
    schoolCredit: true,
    l: '🌱 Apply Yourself to Ministry',
    mins: 15,
    url: JW_URLS.workbook,
    urlLabel: 'Open Meeting Workbook',
    desc: 'Study the ministry parts in the Workbook second section. Practice any assigned demonstrations.',
    tip: 'Read each part title and find the corresponding scripture. Rehearse demonstrations aloud once.',
    schoolField: 'Language Arts'
  }, {
    id: 'wb_living',
    cat: 'meeting',
    schoolCredit: true,
    l: '🏡 Living as Christians',
    mins: 20,
    url: JW_URLS.workbook,
    urlLabel: 'Open Meeting Workbook',
    desc: 'Study the third Workbook section including the Congregation Bible Study portion.',
    tip: 'Watch any assigned JW.org videos. Mark your CBS answers before the meeting.',
    schoolField: 'Bible Study'
  }, {
    id: 'bs_prep',
    cat: 'study',
    schoolCredit: true,
    l: '📚 Book Study Preparation',
    mins: 25,
    url: JW_URLS.bookstudy,
    urlLabel: 'Open JW Books on JW.org',
    desc: 'Read the assigned chapter or pages from the current congregation book study material. Answer questions in the margins.',
    tip: 'Read the assigned pages slowly. Use the study questions. Write short answers. Mark questions you want to raise.',
    schoolField: 'Bible Study'
  }, {
    id: 'personal',
    cat: 'study',
    schoolCredit: true,
    l: '📝 Personal Study',
    mins: 30,
    url: JW_URLS.research,
    urlLabel: 'JW Research Tools',
    desc: 'Individual spiritual growth time: Bible reading, a JW book, Watchtower or Awake articles, or JW.org videos.',
    tip: 'Have an ongoing study project. Use the Research Guide on JW.org to find topics. Keep a spiritual notebook.',
    schoolField: 'Bible Study'
  }, {
    id: 'song_med',
    cat: 'worship',
    schoolCredit: true,
    l: '🎵 Kingdom Song Meditation',
    mins: 10,
    url: JW_URLS.songs,
    urlLabel: 'Songs on JW.org',
    desc: 'Listen to and meditate on Kingdom songs from JW.org. Reflect on the lyrics and their connection to Jehovah.',
    tip: 'Open JW Library Music section. Listen to both meeting songs for this week. Read the lyrics. Journal your thoughts.',
    schoolField: 'Bible Study'
  }, {
    id: 'ministry',
    cat: 'worship',
    schoolCredit: true,
    l: '🚶 Ministry / Field Service',
    mins: 60,
    url: JW_URLS.ministry,
    urlLabel: 'Ministry Resources on JW.org',
    desc: 'Participate in field service, return visits, or informal witnessing. Prepare presentations and keep records.',
    tip: 'Prepare a simple presentation using the current campaign topic. Report your time and studies to the congregation.',
    schoolField: 'History'
  }];
}

// ─── Family Study Projects (editable by admin) ────────────────────────────────
function defaultFamilyStudy() {
  return {
    currentProject: 'Bible Reading — Book of John',
    currentUrl: JW_URLS.bible + 'nwt/books/john/1/',
    notes: 'Reading one chapter per family worship. Currently in John chapter 1. Discuss how Jesus reflects Jehovah\'s qualities.',
    schedule: 'Weekly — Family Worship evening',
    projects: [{
      id: 'fs1',
      title: 'Book of John — Bible Reading',
      url: JW_URLS.bible + 'nwt/books/john/1/',
      desc: 'Reading and discussing the Gospel of John chapter by chapter during Family Worship.',
      active: true
    }, {
      id: 'fs2',
      title: 'Draw Close to Jehovah',
      url: JW_BASE + '/en/library/books/draw-close-to-jehovah/',
      desc: 'Studying Jehovah\'s qualities one chapter per week.',
      active: false
    }, {
      id: 'fs3',
      title: 'Questions Young People Ask',
      url: JW_BASE + '/en/library/books/young-people-ask-answers-work/',
      desc: 'Practical guidance for teenagers — Ryan and Kayla take turns choosing topics.',
      active: false
    }]
  };
}

// ─── Main Spiritual Engine ────────────────────────────────────────────────────
function JWSpiritualEngine({
  personId,
  isAdmin,
  syncSet,
  isTeacher
}) {
  const weekKey = 'spirit_week_' + Math.ceil(new Date().getDay() / 7) + '_' + new Date().getFullYear();
  const todayKey2 = 'spirit_' + new Date().toLocaleDateString('en-CA');
  const [items, setItems] = useState(() => {
    try {
      const v = localStorage.getItem('jw_spirit_items');
      return v ? JSON.parse(v) : defaultWeeklyItems();
    } catch {
      return defaultWeeklyItems();
    }
  });
  const [checks, setChecks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jw_spirit_checks_' + weekKey) || '{}');
    } catch {
      return {};
    }
  });
  const [familyStudy, setFamilyStudy] = useState(() => {
    try {
      const v = localStorage.getItem('jw_family_study');
      return v ? JSON.parse(v) : defaultFamilyStudy();
    } catch {
      return defaultFamilyStudy();
    }
  });
  const [tab, setTab] = useState('week');
  const [editFS, setEditFS] = useState(false);
  const [fsEdit, setFsEdit] = useState({});
  const [addProject, setAddProject] = useState(false);
  const [newProj, setNewProj] = useState({
    title: '',
    url: '',
    desc: ''
  });
  const [addItem, setAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    l: '',
    mins: 20,
    cat: 'study',
    url: '',
    desc: '',
    schoolCredit: false
  });
  const [editItemId, setEditItemId] = useState(null);
  const [prevItems, setPrevItems] = useState(null);
  const [prevFS, setPrevFS] = useState(null);
  const [songsOpen, setSongsOpen] = useState(false);

  // Meeting song picker
  const [meetingSongs, setMeetingSongs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jw_meeting_songs_' + weekKey) || 'null');
    } catch {
      return null;
    }
  }) || {
    open: null,
    close: null
  };
  function saveItems(next) {
    setPrevItems(items);
    setItems(next);
    localStorage.setItem('jw_spirit_items', JSON.stringify(next));
    if (syncSet) syncSet('argilan/jw_spirit_items', next);
  }
  function undoItems() {
    if (prevItems) {
      saveItems(prevItems);
      setPrevItems(null);
    }
  }
  function saveFS(next) {
    setPrevFS(familyStudy);
    setFamilyStudy(next);
    localStorage.setItem('jw_family_study', JSON.stringify(next));
    if (syncSet) syncSet('argilan/jw_family_study', next);
  }
  function toggleCheck(id) {
    const next = {
      ...checks,
      [id]: !checks[id]
    };
    setChecks(next);
    localStorage.setItem('jw_spirit_checks_' + weekKey, JSON.stringify(next));
    if (syncSet) syncSet('argilan/jw_spirit_checks/' + weekKey, next);
  }
  function saveMeetingSongs(songs) {
    setMeetingSongs(songs);
    localStorage.setItem('jw_meeting_songs_' + weekKey, JSON.stringify(songs));
  }
  const cats = {
    meeting: {
      l: '📅 Meeting Preparation',
      c: '#7986CB'
    },
    study: {
      l: '📚 Personal Study',
      c: '#4CAF82'
    },
    worship: {
      l: '🙏 Worship & Ministry',
      c: '#C0CA33'
    }
  };
  const total = items.length;
  const done = items.filter(i => checks[i.id]).length;

  // Week credit report for school
  const creditItems = items.filter(i => i.schoolCredit && checks[i.id]);
  const tabs = [{
    id: 'week',
    l: '📅 This Week'
  }, {
    id: 'family',
    l: '🏠 Family Study'
  }, {
    id: 'songs',
    l: '🎵 Songs'
  }, ...(isAdmin ? [{
    id: 'settings',
    l: '⚙️ Manage'
  }] : [])];
  return /*#__PURE__*/React.createElement("div", null, typeof MeetingMaterialPanel === 'function' ? React.createElement(MeetingMaterialPanel, { isAdmin: !!isAdmin }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 900,
      color: '#7986CB',
      letterSpacing: 1
    }
  }, "🏛 JW SPIRITUAL ENGINE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555'
    }
  }, "Weekly spiritual curriculum · JW.org integrated")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: '#7986CB'
    }
  }, done, "/", total), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      color: '#555'
    }
  }, "done"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      background: 'rgba(255,255,255,.06)',
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${done / Math.max(1, total) * 100}%`,
      background: '#7986CB',
      borderRadius: 3,
      transition: 'width .3s'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      overflowX: 'auto',
      marginBottom: 12
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      flexShrink: 0,
      padding: '5px 11px',
      borderRadius: 20,
      fontSize: 9,
      fontWeight: 700,
      border: 'none',
      background: tab === t.id ? '#7986CB' : 'rgba(255,255,255,.07)',
      color: tab === t.id ? '#fff' : '#555'
    }
  }, t.l))), tab === 'week' && /*#__PURE__*/React.createElement("div", null, creditItems.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(76,175,82,.08)',
      border: '1px solid rgba(76,175,82,.3)',
      borderRadius: 8,
      padding: '8px 10px',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#4CAF82',
      marginBottom: 3
    }
  }, "🎓 SCHOOL CREDIT EARNED THIS WEEK"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      flexWrap: 'wrap'
    }
  }, creditItems.map(i => /*#__PURE__*/React.createElement("span", {
    key: i.id,
    style: {
      fontSize: 8,
      padding: '2px 7px',
      borderRadius: 8,
      background: 'rgba(76,175,82,.15)',
      color: '#4CAF82'
    }
  }, i.schoolField, " — ", i.l.replace(/[^\w ]/g, '').trim())))), Object.entries(cats).map(([catId, cat]) => {
    const catItems = items.filter(i => i.cat === catId);
    if (!catItems.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: catId,
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 800,
        color: cat.c,
        marginBottom: 6,
        paddingBottom: 4,
        borderBottom: '1px solid rgba(255,255,255,.06)'
      }
    }, cat.l), catItems.map(item => {
      const isDone = !!checks[item.id];
      const isEditing = editItemId === item.id && isAdmin;
      return /*#__PURE__*/React.createElement("div", {
        key: item.id,
        style: {
          marginBottom: 7,
          background: isDone ? `${cat.c}08` : 'rgba(255,255,255,.02)',
          border: `1.5px solid ${isDone ? cat.c : 'rgba(255,255,255,.07)'}`,
          borderRadius: 10,
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '9px 11px'
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => toggleCheck(item.id),
        style: {
          width: 22,
          height: 22,
          borderRadius: 6,
          flexShrink: 0,
          border: `2px solid ${isDone ? cat.c : 'rgba(255,255,255,.2)'}`,
          background: isDone ? cat.c : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, isDone && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: '#000',
          fontWeight: 900
        }
      }, "✓")), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          fontWeight: 700,
          color: isDone ? '#888' : '#fff'
        }
      }, item.l), item.schoolCredit && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 7,
          padding: '1px 5px',
          borderRadius: 6,
          background: 'rgba(76,175,82,.15)',
          color: '#4CAF82'
        }
      }, "🎓 Credit")), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 8,
          color: '#555'
        }
      }, "~", item.mins, " min · ", item.schoolField || '')), item.url && React.createElement(JWAnchor, {
        href: item.url,
        style: {
          fontSize: 9,
          color: '#7986CB',
          background: 'rgba(121,134,203,.1)',
          border: '1px solid rgba(121,134,203,.3)',
          borderRadius: 20,
          padding: '3px 8px',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }
      }, '🔗 JW.org')), isDone === false && /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '0 11px 9px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: '#aaa',
          marginBottom: 4
        }
      }, item.desc), item.tip && /*#__PURE__*/React.createElement("div", {
        style: {
          background: 'rgba(192,202,51,.05)',
          borderRadius: 6,
          padding: '4px 7px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 8,
          color: '#C0CA33'
        }
      }, "💡 "), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 8,
          color: '#888'
        }
      }, item.tip))));
    }));
  })), tab === 'family' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#fff'
    }
  }, "🏠 Family Study"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555'
    }
  }, familyStudy.schedule)), isAdmin && /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditFS(!editFS),
    style: {
      fontSize: 9,
      background: editFS ? 'rgba(192,202,51,.2)' : 'rgba(255,255,255,.07)',
      border: `1px solid ${editFS ? '#C0CA33' : 'rgba(255,255,255,.1)'}`,
      color: editFS ? '#C0CA33' : '#555',
      borderRadius: 20,
      padding: '5px 11px'
    }
  }, editFS ? '✅ Done' : '✏️ Edit')), familyStudy.projects.filter(p => p.active).map(proj => /*#__PURE__*/React.createElement("div", {
    key: proj.id,
    style: {
      background: 'rgba(121,134,203,.08)',
      border: '1.5px solid rgba(121,134,203,.4)',
      borderRadius: 12,
      padding: '12px',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#7986CB',
      marginBottom: 4
    }
  }, "📖 Current: ", proj.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa',
      marginBottom: 8
    }
  }, proj.desc), proj.url && React.createElement(JWAnchor, {
    href: proj.url,
    style: {
      display: 'inline-block',
      background: 'rgba(121,134,203,.15)',
      border: '1px solid rgba(121,134,203,.4)',
      borderRadius: 20,
      padding: '5px 12px',
      fontSize: 9,
      color: '#7986CB'
    }
  }, '🔗 Open on JW.org'))), editFS ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      marginBottom: 3
    }
  }, "STUDY NOTES"), /*#__PURE__*/React.createElement("textarea", {
    value: familyStudy.notes || '',
    onChange: e => saveFS({
      ...familyStudy,
      notes: e.target.value
    }),
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 8,
      padding: '8px',
      color: '#fff',
      fontSize: 10,
      minHeight: 70,
      resize: 'vertical',
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      marginBottom: 3
    }
  }, "SCHEDULE"), /*#__PURE__*/React.createElement("input", {
    value: familyStudy.schedule || '',
    onChange: e => saveFS({
      ...familyStudy,
      schedule: e.target.value
    }),
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 8,
      padding: '7px 10px',
      color: '#fff',
      fontSize: 10,
      marginBottom: 8
    }
  })) : familyStudy.notes && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.2)',
      borderRadius: 8,
      padding: '8px 10px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555',
      marginBottom: 2
    }
  }, "NOTES"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa'
    }
  }, familyStudy.notes)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555',
      marginBottom: 5
    }
  }, "ALL STUDY PROJECTS"), familyStudy.projects.map(proj => /*#__PURE__*/React.createElement("div", {
    key: proj.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: proj.active ? 'rgba(121,134,203,.06)' : 'rgba(255,255,255,.02)',
      border: `1px solid ${proj.active ? 'rgba(121,134,203,.4)' : 'rgba(255,255,255,.06)'}`,
      borderRadius: 8,
      padding: '7px 10px',
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: proj.active ? '#fff' : '#666'
    }
  }, proj.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555'
    }
  }, proj.desc)), proj.url && React.createElement(JWAnchor, {
    href: proj.url,
    style: {
      fontSize: 8,
      color: '#7986CB',
      padding: '2px 7px',
      background: 'rgba(121,134,203,.1)',
      borderRadius: 20,
      border: '1px solid rgba(121,134,203,.2)'
    }
  }, '🔗'), isAdmin && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const next = {
        ...familyStudy,
        projects: familyStudy.projects.map(p => ({
          ...p,
          active: p.id === proj.id
        }))
      };
      saveFS(next);
    },
    style: {
      fontSize: 8,
      padding: '3px 8px',
      borderRadius: 20,
      border: 'none',
      background: proj.active ? 'rgba(76,175,82,.2)' : 'rgba(255,255,255,.07)',
      color: proj.active ? '#4CAF82' : '#555'
    }
  }, proj.active ? 'Active' : 'Set Active'))), isAdmin && (addProject ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.3)',
      borderRadius: 10,
      padding: '10px',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      marginBottom: 5
    }
  }, "ADD STUDY PROJECT"), /*#__PURE__*/React.createElement("input", {
    value: newProj.title,
    onChange: e => setNewProj({
      ...newProj,
      title: e.target.value
    }),
    placeholder: "Project title...",
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '6px 8px',
      color: '#fff',
      fontSize: 10,
      marginBottom: 5
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: newProj.url,
    onChange: e => setNewProj({
      ...newProj,
      url: e.target.value
    }),
    placeholder: "JW.org URL (e.g. https://www.jw.org/en/...)",
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '6px 8px',
      color: '#fff',
      fontSize: 10,
      marginBottom: 5
    }
  }), /*#__PURE__*/React.createElement("textarea", {
    value: newProj.desc,
    onChange: e => setNewProj({
      ...newProj,
      desc: e.target.value
    }),
    placeholder: "Description...",
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '6px 8px',
      color: '#fff',
      fontSize: 10,
      minHeight: 50,
      resize: 'vertical',
      marginBottom: 7
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!newProj.title.trim()) return;
      const proj = {
        ...newProj,
        id: 'fs_' + Date.now(),
        active: false
      };
      saveFS({
        ...familyStudy,
        projects: [...familyStudy.projects, proj]
      });
      setNewProj({
        title: '',
        url: '',
        desc: ''
      });
      setAddProject(false);
    },
    style: {
      flex: 1,
      background: '#7986CB',
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      padding: '7px',
      fontSize: 10,
      fontWeight: 800
    }
  }, "✅ Add Project"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddProject(false),
    style: {
      flex: 1,
      background: 'rgba(255,255,255,.07)',
      color: '#777',
      border: 'none',
      borderRadius: 20,
      padding: '7px',
      fontSize: 10
    }
  }, "Cancel"))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddProject(true),
    style: {
      width: '100%',
      marginTop: 5,
      padding: '6px',
      borderRadius: 20,
      border: '1px dashed rgba(255,255,255,.12)',
      color: '#444',
      background: 'transparent',
      fontSize: 9
    }
  }, "+ Add Study Project (Admin)")))), tab === 'songs' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#fff',
      marginBottom: 4
    }
  }, "🎵 This Week\\'s Songs"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555',
      marginBottom: 8
    }
  }, "Set the opening and closing songs for meetings this week. Tap a song link to open it on JW.org."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      marginBottom: 3
    }
  }, "OPENING SONG"), meetingSongs?.open ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement(SongAnchor, {
    num: meetingSongs.open
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => saveMeetingSongs({
      ...meetingSongs,
      open: null
    }),
    style: {
      fontSize: 9,
      color: '#555',
      background: 'none',
      border: 'none'
    }
  }, "✕")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    max: "153",
    placeholder: "Song number",
    style: {
      flex: 1,
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 8,
      padding: '6px 10px',
      color: '#fff',
      fontSize: 11
    },
    id: "song_open_input"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const v = document.getElementById('song_open_input').value;
      if (v) saveMeetingSongs({
        ...meetingSongs,
        open: parseInt(v)
      });
    },
    style: {
      background: '#7986CB',
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      padding: '6px 12px',
      fontSize: 10,
      fontWeight: 800
    }
  }, "Set"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      marginBottom: 3
    }
  }, "CLOSING SONG"), meetingSongs?.close ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement(SongAnchor, {
    num: meetingSongs.close
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => saveMeetingSongs({
      ...meetingSongs,
      close: null
    }),
    style: {
      fontSize: 9,
      color: '#555',
      background: 'none',
      border: 'none'
    }
  }, "✕")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    max: "153",
    placeholder: "Song number",
    style: {
      flex: 1,
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 8,
      padding: '6px 10px',
      color: '#fff',
      fontSize: 11
    },
    id: "song_close_input"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const v = document.getElementById('song_close_input').value;
      if (v) saveMeetingSongs({
        ...meetingSongs,
        close: parseInt(v)
      });
    },
    style: {
      background: '#7986CB',
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      padding: '6px 12px',
      fontSize: 10,
      fontWeight: 800
    }
  }, "Set")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555',
      marginBottom: 5
    }
  }, "ALL KINGDOM SONGS (clickable → JW.org)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      maxHeight: 300,
      overflowY: 'auto'
    }
  }, (JW_SONGS || []).map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      background: 'rgba(255,255,255,.02)',
      borderRadius: 6,
      padding: '5px 8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: '#555',
      width: 28,
      flexShrink: 0,
      textAlign: 'right'
    }
  }, s.n), React.createElement(JWAnchor, {
    href: `${JW_URLS.songs}song-${s.n}/`,
    style: {
      fontSize: 10,
      color: '#C0CA33',
      flex: 1
    }
  }, s.t + ' 🔗'))))), tab === 'settings' && isAdmin && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#fff'
    }
  }, "⚙️ Manage Study Items"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555'
    }
  }, "Admin can add, edit, or remove weekly study items. All items save immediately.")), prevItems && /*#__PURE__*/React.createElement("button", {
    onClick: undoItems,
    style: {
      fontSize: 9,
      background: 'rgba(255,152,0,.15)',
      border: '1px solid #FF9800',
      color: '#FF9800',
      borderRadius: 20,
      padding: '5px 10px'
    }
  }, "↩ Undo")), items.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    style: {
      background: 'rgba(255,255,255,.02)',
      border: '1px solid rgba(255,255,255,.07)',
      borderRadius: 8,
      padding: '8px 10px',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: '#fff'
    }
  }, item.l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555'
    }
  }, item.cat, " · ", item.mins, " min · ", item.schoolField)), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 8,
      color: '#4CAF82',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!item.schoolCredit,
    onChange: e => {
      saveItems(items.map(i => i.id === item.id ? {
        ...i,
        schoolCredit: e.target.checked
      } : i));
    }
  }), "School credit"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window._safeConfirm('Remove this item?')) saveItems(items.filter(i => i.id !== item.id));
    },
    style: {
      fontSize: 9,
      color: '#EF5350',
      background: 'none',
      border: 'none'
    }
  }, "✕")), item.url && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      marginTop: 3
    }
  }, React.createElement(JWAnchor, {
    href: item.url,
    style: {
      color: '#7986CB',
      fontSize: 8
    }
  }, item.urlLabel || item.url)))), addItem ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.3)',
      borderRadius: 10,
      padding: '10px',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      marginBottom: 5
    }
  }, "ADD STUDY ITEM"), /*#__PURE__*/React.createElement("input", {
    value: newItem.l,
    onChange: e => setNewItem({
      ...newItem,
      l: e.target.value
    }),
    placeholder: "Label (e.g. 📖 Bible Reading)",
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '6px 8px',
      color: '#fff',
      fontSize: 10,
      marginBottom: 5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: newItem.url,
    onChange: e => setNewItem({
      ...newItem,
      url: e.target.value
    }),
    placeholder: "JW.org URL",
    style: {
      flex: 1,
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '6px 8px',
      color: '#fff',
      fontSize: 9
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newItem.mins,
    onChange: e => setNewItem({
      ...newItem,
      mins: parseInt(e.target.value) || 20
    }),
    style: {
      width: 50,
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '6px 8px',
      color: '#fff',
      fontSize: 9,
      textAlign: 'center'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: newItem.cat,
    onChange: e => setNewItem({
      ...newItem,
      cat: e.target.value
    }),
    style: {
      flex: 1,
      background: 'rgba(0,0,0,.4)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '5px',
      color: '#fff',
      fontSize: 9
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "meeting"
  }, "Meeting Prep"), /*#__PURE__*/React.createElement("option", {
    value: "study"
  }, "Personal Study"), /*#__PURE__*/React.createElement("option", {
    value: "worship"
  }, "Worship & Ministry")), /*#__PURE__*/React.createElement("input", {
    value: newItem.schoolField || '',
    onChange: e => setNewItem({
      ...newItem,
      schoolField: e.target.value
    }),
    placeholder: "School field (e.g. Bible Study)",
    style: {
      flex: 1,
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '5px 8px',
      color: '#fff',
      fontSize: 9
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 9,
      color: '#4CAF82',
      marginBottom: 7,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!newItem.schoolCredit,
    onChange: e => setNewItem({
      ...newItem,
      schoolCredit: e.target.checked
    })
  }), "Count for school credit"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!newItem.l.trim()) return;
      const item = {
        ...newItem,
        id: 'custom_' + Date.now(),
        desc: ''
      };
      saveItems([...items, item]);
      setNewItem({
        l: '',
        mins: 20,
        cat: 'study',
        url: '',
        desc: '',
        schoolCredit: false
      });
      setAddItem(false);
    },
    style: {
      flex: 1,
      background: '#7986CB',
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      padding: '7px',
      fontSize: 10,
      fontWeight: 800
    }
  }, "✅ Add"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddItem(false),
    style: {
      flex: 1,
      background: 'rgba(255,255,255,.07)',
      color: '#777',
      border: 'none',
      borderRadius: 20,
      padding: '7px',
      fontSize: 10
    }
  }, "Cancel"))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddItem(true),
    style: {
      width: '100%',
      marginTop: 5,
      padding: '6px',
      borderRadius: 20,
      border: '1px dashed rgba(255,255,255,.15)',
      color: '#555',
      background: 'transparent',
      fontSize: 9
    }
  }, "+ Add Study Item (Admin)")));
}




// ═══ MEAL SCIENCE CURRICULUM ═══
// ═══ CORRECTED JW MEETING PREP + MEAL SCIENCE CURRICULUM ════════════════════

// ─── Corrected JW Meeting Items (accurate CLAM + Weekend structure) ──────────
const MEETING_ITEMS_V2 = [
// ── CLAM (Midweek Meeting) ─────────────────────────────
{
  id: 'clam_reading',
  cat: 'clam',
  schoolCredit: true,
  l: '📖 Bible Reading Prep',
  mins: 5,
  url: 'https://www.jw.org/en/library/jw-meeting-workbook/',
  urlLabel: 'Open Workbook on JW.org',
  desc: 'Read the Bible passage assigned for the "Bible Reading" student part at this week\'s midweek meeting. This is a 4-minute reading — practice it aloud at least once.',
  hint: 'Find it under "Bible Reading" in the workbook lesson. Read slowly and clearly. Note any difficult names or words to practice beforehand. This is also part of your Language Arts credit.'
}, {
  id: 'clam_treasures',
  cat: 'clam',
  schoolCredit: true,
  l: '💎 Treasures from God\'s Word',
  mins: 10,
  url: 'https://www.jw.org/en/library/jw-meeting-workbook/',
  urlLabel: 'Open Workbook on JW.org',
  desc: 'Study the "Treasures from God\'s Word" section — a 10-minute chairman talk. Read the Bible passage highlighted and look up the cited scriptures.',
  hint: 'Open the meeting workbook in JW Library. Read the Bible text first, then the Treasures discussion points. Try to explain the main teaching in your own words before the meeting.'
}, {
  id: 'clam_gems',
  cat: 'clam',
  schoolCredit: true,
  l: '⛏ Digging for Spiritual Gems',
  mins: 8,
  url: 'https://www.jw.org/en/library/jw-meeting-workbook/',
  urlLabel: 'Open Workbook on JW.org',
  desc: 'Find and answer the two "Digging for Spiritual Gems" questions in the workbook. These require looking up specific scriptures and digging a little deeper.',
  hint: 'Each question usually asks you to find a scripture and explain what it teaches. Write your answers in the margin. Aim to answer at least one of the two questions during the actual meeting.'
}, {
  id: 'clam_ministry',
  cat: 'clam',
  schoolCredit: true,
  l: '🌱 Apply Yourself to the Ministry',
  mins: 15,
  url: 'https://www.jw.org/en/library/jw-meeting-workbook/',
  urlLabel: 'Open Workbook on JW.org',
  desc: 'Study all the "Apply Yourself to the Field Ministry" parts. These cover return visits, Bible studies, and informal witnessing. If you have an assigned part, rehearse it.',
  hint: 'Read each part\'s title and the scripture it\'s based on. For any demonstration, practice it at least once — timing matters. Note the talking point to use in actual ministry this week.'
}, {
  id: 'clam_cbs',
  cat: 'clam',
  schoolCredit: true,
  l: '📚 Congregation Bible Study',
  mins: 20,
  url: 'https://www.jw.org/en/library/books/',
  urlLabel: 'Open CBS book on JW.org',
  desc: 'Read the assigned pages from the current Congregation Bible Study book. Answer the review questions. This is the final part of the midweek meeting.',
  hint: 'Open the current CBS book in JW Library. Read each paragraph slowly. The study questions are usually in the margin or at the end. Mark your answers. Aim to answer at least 2 questions at the meeting.'
},
// ── Weekend Meeting (Public Talk + Watchtower Study) ──
{
  id: 'wt_read',
  cat: 'weekend',
  schoolCredit: true,
  l: '🗞 Watchtower Article — Read',
  mins: 25,
  url: 'https://www.jw.org/en/library/magazines/watchtower/',
  urlLabel: 'Open Watchtower on JW.org',
  desc: 'Read the entire Watchtower study article for this week\'s weekend meeting. Read it carefully — this is the main study material for the public Watchtower Study.',
  hint: 'Find the study article in JW Library under Watchtower → Study Edition → current month. Read each paragraph. Look up every scripture cited. The article will be clearer when you arrive if you\'ve already read it once.'
}, {
  id: 'wt_answers',
  cat: 'weekend',
  schoolCredit: true,
  l: '✏️ Watchtower — Mark Your Answers',
  mins: 20,
  url: 'https://www.jw.org/en/library/magazines/watchtower/',
  urlLabel: 'Open Watchtower on JW.org',
  desc: 'Go back through the Watchtower article paragraph by paragraph and mark your answers to the printed study questions at the bottom of each paragraph.',
  hint: 'The study question is printed below each paragraph (or sometimes at the end of a section). Write your answer in the margin or in your notebook. Aim to have at least 5 marked answers so you\'re ready to participate. Underline the words in the paragraph that directly answer the question.'
},
// ── Family & Personal ──────────────────────────────────
{
  id: 'fw_study',
  cat: 'family',
  schoolCredit: true,
  l: '🏠 Family Worship — Prepare Topic',
  mins: 30,
  url: 'https://www.jw.org/en/library/books/',
  urlLabel: 'JW.org Books Library',
  desc: 'Prepare this week\'s Family Worship topic or study project. This can be a Bible reading, a chapter from a JW publication, or questions the children have raised.',
  hint: 'Check the current Family Study project set in the app. Gather materials beforehand — open books, printed scriptures, or JW.org videos. The teacher (Laurel) should have the discussion questions ready before family worship begins.'
}, {
  id: 'personal_study',
  cat: 'personal',
  schoolCredit: true,
  l: '📚 Personal Study Time',
  mins: 30,
  url: 'https://www.jw.org/en/research-tools/',
  urlLabel: 'JW Research Tools',
  desc: 'Each person\'s individual spiritual growth time — Bible reading, a JW publication, Watchtower/Awake articles, or JW.org videos of personal interest.',
  hint: 'Keep an ongoing study project: a Bible book chapter by chapter, a JW publication you\'re working through, or a topic-based study using the Research Guide on JW.org. Keep a spiritual notebook of insights.'
}, {
  id: 'song_prep',
  cat: 'songs',
  schoolCredit: true,
  l: '🎵 Meeting Songs — Listen & Prepare',
  mins: 8,
  url: 'https://www.jw.org/en/library/books/sing-out-joyfully-to-jehovah/',
  urlLabel: 'Songs on JW.org',
  desc: 'Listen to and read the lyrics of this week\'s meeting songs. Meditate on how they connect to the meeting\'s theme. Knowing the songs in advance makes participation more meaningful.',
  hint: 'Find the week\'s song numbers in the meeting workbook (opening + closing). Open JW Library → Music → the song. Read the lyrics while listening. Write 1-2 sentences in your journal about what the song means to you.'
}];
const MEETING_CATS_V2 = {
  clam: {
    l: '📒 Midweek Meeting (CLAM) Prep',
    c: '#7986CB',
    sub: 'Treasures · Gems · Ministry · CBS'
  },
  weekend: {
    l: '🗓 Weekend Meeting Prep',
    c: '#9E69AF',
    sub: 'Watchtower Study'
  },
  family: {
    l: '🏠 Family Worship',
    c: '#F48FB1',
    sub: 'Weekly Family Study'
  },
  personal: {
    l: '📚 Personal & Song Study',
    c: '#4CAF82',
    sub: 'Individual Growth'
  },
  songs: {
    l: '🎵 Songs',
    c: '#C0CA33',
    sub: ''
  }
};

// ─── 14-Day Meal Science Curriculum ─────────────────────────────────────────
const MEAL_SCIENCE_DAYS = [{
  d: 1,
  title: 'Cinnamon Berry Oats',
  dinner: 'Summer Sweet Corn Burger Bowls',
  topic: 'Complex Carbohydrates & Sustained Energy',
  jw: 'Jehovah designed grains as one of our primary food sources (Genesis 1:29). Oat groats are the whole grain — exactly as He created them, nothing removed.',
  cookToday: 'Cook the oat groats this morning. Observe how they swell and soften — that\'s starch absorbing water and swelling (gelatinization). Stir every 5 minutes.',
  prepTonight: 'Soak 1 cup Oat Groats overnight for tomorrow.',
  answers: {
    1: {
      short: 'Oats give us slow energy because they\'re a complex carbohydrate — your body has to break them apart slowly.',
      long: 'Oat groats are a whole grain containing starch (a complex carbohydrate), fiber (beta-glucan), and protein. Complex carbohydrates are long chains of glucose molecules. Your digestive system must break each chain apart one link at a time — that slow breakdown keeps blood sugar steady for hours. Simple sugars (like candy) are already short chains — they enter the bloodstream fast, cause an energy spike, then a crash. Jehovah gave us whole grains that provide steady, sustained energy for a full morning of learning and work.'
    },
    3: {
      short: 'Complex carbohydrates have a lower glycemic index than simple carbs, meaning they raise blood sugar more slowly and sustain energy longer. Oat beta-glucan also feeds beneficial gut bacteria.',
      long: 'Starch is a polysaccharide — a polymer of glucose units linked by alpha-1,4-glycosidic bonds (with branching at alpha-1,6 bonds in amylopectin). Digestion requires amylase enzymes to cleave these bonds sequentially. Beta-glucan in oats is a soluble fiber that forms a viscous gel in the intestine, slowing glucose absorption (lowering glycemic index to ~55 vs white bread at ~75). This gel also acts as a prebiotic — food for Lactobacillus and Bifidobacterium species in the gut microbiome, supporting immune function (Ps 139:14 — fearfully and wonderfully made).'
    },
    4: {
      short: 'The glycemic index (GI) of oat groats is ~40 vs rolled oats ~57 vs instant oats ~83. Intact grain structure slows starch gelatinization and enzymatic access, reducing postprandial glucose response. Beta-glucan fiber forms a viscous intestinal matrix.',
      long: 'Oat groats have a GI of ~40 because the intact cell wall structure limits amylase access to the starch granules — starch gelatinization in cooking partially disrupts this, but whole groats retain significantly more physical barrier than rolled oats. The Maillard reaction doesn\'t apply here (no browning), but starch retrogradation during overnight soaking creates resistant starch — a third type of carbohydrate that resists digestion entirely and ferments in the colon (prebiotic). Beta-glucan (a mixed-linkage (1→3)(1→4)-beta-D-glucan) forms a viscous gel that delays gastric emptying and glucose absorption. Clinical studies show 3g beta-glucan daily reduces LDL cholesterol by 5-10% (FDA approved health claim). This is the nutritional design Jehovah built into whole grains before human processing degrades their integrity.'
    }
  }
}, {
  d: 2,
  title: 'Brain-Booster Avocado Scramble',
  dinner: 'Garlic-Roasted Chicken Thighs & Green Beans',
  topic: 'Complete Proteins & the Amino Acid Blueprint',
  jw: 'Psalm 139:14 says we are fearfully and wonderfully made. The protein in eggs contains all 9 essential amino acids — exactly what Jehovah designed our bodies to require.',
  cookToday: 'Cook scrambled eggs — watch how the protein changes from liquid to solid. That\'s denaturation: heat uncoils the protein chains so they tangle together and solidify.',
  prepTonight: 'Thaw 2 lbs Chicken Thighs from freezer for tonight\'s dinner.',
  answers: {
    1: {
      short: 'Eggs have complete protein — that means they have all the building blocks our muscles, brain, and organs need to grow.',
      long: 'Protein is made of amino acids — like LEGO bricks that build everything in your body: muscles, hair, enzymes, brain chemicals. There are 20 amino acids total. 9 of them are "essential" — your body cannot make them, so you MUST eat them. Eggs contain all 9 essential amino acids in exactly the right amounts — scientists call this a "complete protein." When we scramble eggs, heat unfolds the protein strands and they reconnect in a new shape — that\'s why liquid egg becomes solid.'
    },
    3: {
      short: 'Eggs are a complete protein (biological value ~100) containing all 9 essential amino acids. Cooking causes protein denaturation — heat unfolds protein chains, exposing bonds that cross-link, changing texture from liquid to solid.',
      long: 'Proteins are polypeptide chains built from 20 amino acid monomers linked by peptide bonds. The 9 essential amino acids (histidine, isoleucine, leucine, lysine, methionine, phenylalanine, threonine, tryptophan, valine) cannot be synthesized by the human body and must come from diet. Eggs have a Biological Value (BV) of ~100 — the gold standard of protein quality. During cooking, heat causes protein denaturation: thermal energy disrupts weak hydrogen bonds and hydrophobic interactions maintaining the protein\'s 3D structure. The unfolded chains then form new cross-links (disulfide bonds between cysteine residues) — this is why eggs solidify irreversibly. Avocado adds monounsaturated fats that are needed to absorb fat-soluble vitamins in the eggs.'
    },
    4: {
      short: 'Egg protein has a PDCAAS (Protein Digestibility-Corrected Amino Acid Score) of 1.0 — the highest possible. Leucine is particularly important for mTOR activation and muscle protein synthesis. Egg yolk choline (147mg/yolk) is essential for acetylcholine neurotransmitter synthesis.',
      long: 'Protein quality is measured by PDCAAS (Protein Digestibility-Corrected Amino Acid Score) or DIAAS (Digestible Indispensable Amino Acid Score). Whole egg scores 1.0 on both scales. Leucine (1.09g per egg) directly activates mTOR (mechanistic Target of Rapamycin), the primary signaling pathway for muscle protein synthesis. Egg yolk contains 147mg choline — a precursor to phosphatidylcholine (cell membrane component) and acetylcholine (memory neurotransmitter). One egg contains 68% of the RDI for selenium (antioxidant enzyme cofactor), and vitamin D3 (1,25-dihydroxycholecalciferol after liver/kidney conversion). Protein denaturation in cooking: the disulfide bonds between cysteine residues in ovalbumin (the main egg white protein) cross-link upon heat exposure, forming a permanent gel network. This process is irreversible — denatured proteins cannot be renatured.'
    }
  }
}, {
  d: 3,
  title: 'Strawberry Overnight Oats',
  dinner: 'Hearty Garlic Beef & Bean Chili',
  topic: 'Probiotics, the Microbiome & Immune Health',
  jw: 'Jehovah designed the human gut with trillions of beneficial microorganisms. Proverbs 17:22 says "a joyful heart is good medicine" — and scientists now know gut health directly affects mood.',
  cookToday: 'The overnight oats were your science experiment — observe how the yogurt changed the texture of the oats without cooking. That\'s fermentation at work in the cold.',
  prepTonight: 'Assemble full Strawberry Overnight Oats jar for tomorrow (oats + milk + yogurt + strawberries — refrigerate tonight).',
  answers: {
    1: {
      short: 'Yogurt has good bacteria called probiotics that live in your tummy and help you stay healthy. They fight the bad bacteria and help your body use food.',
      long: 'Your gut (intestines) has about 100 TRILLION bacteria living in it — more bacteria than cells in your whole body! Most of them are helpful. Yogurt contains special bacteria called Lactobacillus and Bifidobacterium. When you eat yogurt, these good bacteria join the team in your gut and help digest food, make vitamins, and fight off harmful germs. Fermentation is what makes yogurt: bacteria eat the sugar in milk and make it tangy. This is why yogurt is sour. The overnight oats became soft because the oat starch absorbed the liquid — no cooking needed.'
    },
    3: {
      short: 'Yogurt contains live probiotic cultures (Lactobacillus, Bifidobacterium) that colonize the gut microbiome. The gut-brain axis connects digestive health to mood and cognitive function. Beans\' insoluble fiber feeds these beneficial bacteria (prebiotic effect).',
      long: 'The human gut microbiome contains ~38 trillion microorganisms across 1,000+ species, collectively carrying 150× more genes than the human genome. Probiotics in yogurt (Lactobacillus bulgaricus, Streptococcus thermophilus) survive gastric acid and colonize the intestinal mucosa. They compete with pathogenic bacteria for adhesion sites, produce short-chain fatty acids (SCFAs) like butyrate that nourish colonocytes, and stimulate IgA antibody production (immune response). The gut-brain axis (via the vagus nerve and enteroendocrine cells) means gut bacteria influence serotonin production — 95% of the body\'s serotonin is made in the gut. This is why Proverbs 17:22 rings true biologically: gut health affects mood. Beans (today\'s chili) contain indigestible oligosaccharides that serve as prebiotics — food for probiotic bacteria.'
    },
    4: {
      short: 'Probiotic colonization involves adherence to intestinal epithelial cells via fimbrial proteins, competitive exclusion of pathogens, SCFA production (butyrate as colonocyte energy substrate), and modulation of Th1/Th2 balance via dendritic cell interaction. The microbiome-gut-brain axis operates via vagal afferents, enteroendocrine signaling (GLP-1, GIP, serotonin), and SCFAs crossing the blood-brain barrier.',
      long: 'Yogurt\'s probiotic strains (minimum 10^7 CFU/g to qualify as probiotic) colonize the colon mucus layer via adherence proteins. Lactobacillus acidophilus produces lactic acid (lowering pH, inhibiting Clostridium difficile and Salmonella growth), bacteriocins (antimicrobial peptides), and hydrogen peroxide. Bifidobacterium species ferment oligosaccharides to acetate and lactate — these enter portal circulation and modulate hepatic lipid metabolism. Butyrate (C4 SCFA) is the primary energy substrate for colonocytes, promotes epithelial barrier integrity by upregulating tight junction proteins (claudin, occludin), and has anti-neoplastic effects on colorectal cells via HDAC (histone deacetylase) inhibition. The overnight oat fermentation: raw oat phytic acid (an antinutrient binding minerals) is partially hydrolyzed by soaking, increasing bioavailability of zinc, magnesium, and iron — a phenomenon used in traditional grain preparation worldwide. Jehovah\'s design included these synergistic food relationships millennia before food science identified them.'
    }
  }
}, {
  d: 4,
  title: 'Leftover Chili Rice Bowls',
  dinner: 'Shredded Pork Lettuce Boats',
  topic: 'Food Safety & the Science of Leftovers',
  jw: 'Jehovah commanded specific food handling practices for Israel (Leviticus). These weren\'t arbitrary — they prevented foodborne illness centuries before germ theory.',
  cookToday: 'Reheat the chili from Day 3 until steaming (165°F minimum). Observe: smell it before heating. Note any changes. This is a food safety lesson.',
  prepTonight: 'Nothing to prep — tomorrow is fruit & eggs day. Check that leftover chili reached proper temperature.',
  answers: {
    1: {
      short: 'Leftovers must be heated until they are very hot (steaming) to kill any germs that might have grown. Always put food in the fridge within 2 hours of cooking.',
      long: 'When food cools down after cooking, it enters a "danger zone" between 40°F and 140°F where bacteria can double in number every 20 minutes. If food sits out for more than 2 hours in this zone, it can become unsafe to eat. When we reheat leftovers, we heat them back above 165°F — that temperature kills the harmful bacteria. A kitchen thermometer is the only way to know for sure. Jehovah gave Israel food safety rules in Leviticus long before scientists understood bacteria — showing His wisdom and care.'
    },
    3: {
      short: 'The temperature danger zone (40-140°F/4-60°C) supports rapid bacterial multiplication. Proper cooling requires reaching 40°F within 4 hours. Reheating to 165°F (74°C) denatures bacterial proteins and destroys most vegetative cells. Some spore-forming bacteria (Bacillus cereus, Clostridium) require 212°F+ for spore destruction.',
      long: 'Bacterial growth follows a sigmoid curve: lag phase (adaptation), exponential phase (doubling every 15-30 min in optimal conditions), stationary phase (resource competition), death phase. Staphylococcus aureus can produce heat-stable enterotoxins at room temperature — reheating kills the bacteria but NOT the toxins already produced. This is why "smell and taste" testing is unreliable: toxin-containing food may taste/smell normal. The "2-4-hour rule" (food safe for 2 hrs at room temp, discard at 4 hrs) is based on Staphylococcal toxin production rates. FIFO (First In, First Out) storage prevents forgotten leftovers. Chili is particularly safe to reheat (high acidity from beans, thorough initial cooking) — but rice is higher risk (Bacillus cereus spores survive cooking, germinate during cooling). Always refrigerate rice within 1 hour.'
    },
    4: {
      short: 'Foodborne illness mechanisms: Staphylococcal enterotoxin (preformed, heat-stable, 100°C for 30 min cannot destroy), Bacillus cereus emetic toxin (cereulide, heat-stable, produced in improperly cooled rice/grains), Clostridium perfringens (spore germination in slowly cooled meat/beans, produces enterotoxin during gut sporulation). Safe food handling protocols and the thermophile/mesophile/psychrophile bacterial classification system.',
      long: 'Foodborne pathogens are classified by mechanism: Intoxication (preformed toxin consumed — Staphylococcus aureus produces 7 enterotoxin serotypes, SEA-SEG, that are stable to 100°C for 30+ min, resist gastric acid, stimulate vagal nerve causing rapid-onset vomiting); Infection (live bacteria consumed that colonize gut — Salmonella, Campylobacter, Listeria); Toxico-infection (bacteria consumed, toxin produced in vivo — Clostridium perfringens type A produces heat-labile enterotoxin during sporulation in the small intestine, causing cramping/diarrhea 8-16hr post-ingestion). Temperature control science: refrigeration at ≤40°F (4°C) slows but doesn\'t stop mesophilic bacterial growth — psychrophiles like Listeria monocytogenes continue multiplying (Listeria can grow at 28°F/-2.2°C). Proper cooling protocol: large volumes must be divided into small containers and cooled in ice water bath before refrigeration to move through the danger zone within 2 hours. Leviticus 11 and Numbers 19 contain food handling and hygiene protocols (boiling water, burning contaminated items, washing) that parallel modern food microbiology principles developed 3,000 years later.'
    }
  }
}, {
  d: 5,
  title: 'Cinnamon Honey Oats + Baked Chicken Strips',
  dinner: 'Baked Skillet Chicken Strips',
  topic: 'Anti-Inflammatory Herbs, Spices & Phytochemistry',
  jw: 'Genesis 1:11-12 describes Jehovah creating plants with seeds and herbs. Ezekiel 47:12 says the leaves of certain trees are "for healing." Turmeric and ginger aren\'t coincidences — they\'re designed.',
  cookToday: 'Rub chicken with the Sweet Garlic & Herb Glaze. Smell the spices before and after cooking. The heat releases volatile compounds (essential oils) — that\'s why cooked spices smell stronger.',
  prepTonight: 'Soak 1 cup Oat Groats overnight. Thaw 2 lbs Chicken Breast for tomorrow.',
  answers: {
    1: {
      short: 'Spices like turmeric and ginger have special chemicals that calm down swelling in our bodies. Jehovah put these medicines right in the plants.',
      long: 'When you get hurt, your body swells up to protect the injury — that\'s called inflammation. It\'s helpful when you scrape your knee, but sometimes your body inflames too much over time without a clear injury, and that makes you feel tired and sick. God put special chemicals in plants like turmeric (curcumin) and ginger (gingerol) that tell your body\'s inflammation to calm down. Scientists call these chemicals "phytochemicals" — that means "plant chemicals." When you cook with these spices, you\'re using Jehovah\'s medicine cabinet.'
    },
    3: {
      short: 'Curcumin (turmeric) inhibits NF-κB signaling and COX-2 enzymes, reducing inflammatory cytokine production. Gingerols (ginger) also inhibit COX and 5-LOX pathways. Black pepper\'s piperine increases curcumin bioavailability 2,000% by inhibiting glucuronidation in the intestinal epithelium.',
      long: 'Chronic low-grade inflammation underlies most modern diseases: cardiovascular disease, type 2 diabetes, Alzheimer\'s, and cancer. The inflammatory cascade involves: NF-κB (nuclear factor kappa-light-chain-enhancer of activated B cells) transcription factor activating genes for TNF-α, IL-6, and IL-1β (pro-inflammatory cytokines). Curcumin (diferuloylmethane) directly inhibits IκB kinase, preventing NF-κB nuclear translocation. Gingerol and shogaol (formed from gingerol during cooking) inhibit both COX-2 (prostaglandin synthesis) and 5-LOX (leukotriene synthesis) pathways — dual anti-inflammatory action. The Golden Turmeric Blend includes black pepper (piperine) which inhibits cytochrome P450 enzymes in the intestinal wall, slowing curcumin\'s phase II conjugation and dramatically increasing its bioavailability from ~1% to ~20%. Ezekiel 47:12 describes medicinal plants ("their leaves will serve as medicine") — phytomedicine is Jehovah\'s original pharmacy.'
    },
    4: {
      short: 'Curcumin\'s anti-inflammatory mechanism: IκBα phosphorylation inhibition → NF-κB nuclear translocation blocked → reduced transcription of TNF-α, IL-1β, IL-6, COX-2, iNOS. Gingerol\'s COX-2 selectivity (similar to celecoxib mechanism). Piperine\'s P-glycoprotein and CYP3A4 inhibition enhancing curcumin bioavailability. Clinical trial data on bioavailability enhancement strategies (lipid formulations, nanoparticles, piperine co-administration).',
      long: 'Curcumin targets over 150 molecular pathways simultaneously. Key mechanisms: (1) IκB kinase (IKK) inhibition: NF-κB is held inactive in cytoplasm by IκBα. IKK normally phosphorylates IκBα, targeting it for ubiquitin-proteasome degradation, releasing NF-κB to translocate to nucleus. Curcumin directly inhibits IKKβ\'s ATP binding site. (2) AP-1 transcription factor inhibition (additional inflammatory gene regulation). (3) JAK-STAT pathway inhibition (cytokine signaling). (4) HO-1 (heme oxygenase-1) induction (antioxidant enzyme). Clinical bioavailability challenge: curcumin is highly lipophilic (log P ~3.2) and rapidly conjugated in intestinal epithelium (glucuronidation and sulfation). Standard curcumin oral bioavailability ~1%. Piperine co-administration (20mg with 2g curcumin) increases AUC 2,000% by inhibiting CYP3A4 and P-glycoprotein efflux pump in intestinal mucosa. Alternative: liposomal or phospholipid-complexed formulations (Meriva) achieve 29× higher bioavailability. The culinary tradition of combining turmeric + black pepper (as in our blend) represents millennia of empirical optimization that modern pharmacokinetics has only recently explained — another example of Jehovah\'s wisdom encoded in traditional food practices.'
    }
  }
}, {
  d: 6,
  title: 'Hard-Boiled Brain Fuel & Tuna Skillet Rice',
  dinner: 'Garlic Chicken Stir-Fry',
  topic: 'Omega-3 Fatty Acids & Brain Development',
  jw: 'Jehovah made the ocean full of fish (Gen 1:20-21). Wild-caught fish like tuna contains DHA — the primary building block of the human brain. He provided brain food in His creation.',
  cookToday: 'Tuna skillet rice — mix the tuna into warm rice. Observe how tuna flakes apart. This is because fish muscle fiber is arranged differently than land animal muscle.',
  prepTonight: 'Nothing to prep — tomorrow is overnight oats day.',
  answers: {
    1: {
      short: 'Tuna has a special fat called omega-3 that makes your brain grow and work better. Wild fish like tuna have more of this brain-growing fat than farm fish.',
      long: 'Your brain is about 60% fat. The most important fat for your brain is called DHA (doctors call it "docosahexaenoic acid" — that\'s a big word!). Wild-caught tuna and other ocean fish are full of DHA. When you eat fish, the DHA goes to your brain and helps brain cells talk to each other better. That\'s why fish is called "brain food"! Flaxseed also has a related omega-3 called ALA. Wild fish eat tiny sea plants that make DHA, which is why they have more of it than farm-raised fish that eat different food.'
    },
    3: {
      short: 'DHA (docosahexaenoic acid, 22:6 n-3) and EPA (eicosapentaenoic acid, 20:5 n-3) are long-chain omega-3 fatty acids found in marine fish. DHA is incorporated into neuronal cell membrane phospholipids, improving membrane fluidity and synaptic signaling. EPA reduces neuroinflammation. ALA from flaxseed is a short-chain omega-3 that must be converted to DHA/EPA (poor conversion efficiency ~5%).',
      long: 'Omega-3 fatty acids are essential polyunsaturated fats (PUFAs) with the first double bond at the 3rd carbon from the methyl end. The three dietary omega-3s: ALA (α-linolenic acid, 18:3, from flaxseed/chia) → EPA (eicosapentaenoic acid, 20:5, from fish/algae) → DHA (docosahexaenoic acid, 22:6, from fish/algae). ALA→EPA conversion efficiency in humans is ~5-8%; ALA→DHA efficiency is ~0.5-1%. This is why marine sources are far superior for brain development. DHA comprises 40% of PUFAs in the brain and 60% in the retina. It\'s incorporated into neuronal membrane phospholipids (especially synaptosomes), where its 6 double bonds create extreme membrane flexibility, facilitating rapid conformation changes in membrane proteins (receptors, ion channels) needed for synaptic signaling. EPA\'s primary role is anti-inflammatory: it competes with arachidonic acid (pro-inflammatory omega-6) for COX and LOX enzymes, shifting prostaglandin production toward anti-inflammatory series-3 prostaglandins. The omega-3:omega-6 ratio in the modern Western diet is ~1:20 (ideal is 1:4), contributing to chronic inflammation — this meal plan\'s emphasis on fish, flaxseed, and avocado (oleic acid) helps rebalance this ratio.'
    },
    4: {
      short: 'Omega-3 fatty acid metabolism: DHA biosynthesis from ALA via elongases (ELOVL2, ELOVL5) and desaturases (FADS1/D5D, FADS2/D6D) — rate-limiting enzymes with poor activity in humans. DHA\'s role in synaptogenesis (membrane microdomains/lipid rafts), BDNF expression, and GPR120 signaling (anti-inflammatory adipokine modulation). EPA\'s resolvins and protectins as specialized pro-resolving mediators (SPMs).',
      long: 'DHA biosynthesis: ALA undergoes alternating elongation (ELOVL5) and desaturation (FADS2/D6D) to produce 18:4n-3, 20:4n-3 (via ELOVL5), 20:5n-3 (EPA, via FADS1/D5D), 22:5n-3 (via ELOVL2), 24:5n-3 (via ELOVL2), 24:6n-3 (via FADS2/D6D in ER), then peroxisomal beta-oxidation to 22:6n-3 (DHA) — a 6-step pathway with rate-limiting D6D converting ALA at <5% efficiency. Marine algae (Thraustochytrid species) directly synthesize DHA via PUFA synthase (non-ribosomal enzyme complex), which fish accumulate by eating algae — the original source. DHA in neuronal membranes facilitates: (1) lipid raft formation (membrane microdomains enriched in cholesterol + sphingomyelin that serve as signaling platforms for GPCRs and ion channels); (2) BDNF (brain-derived neurotrophic factor) gene expression upregulation (promotes neurogenesis and synaptic plasticity); (3) phospholipase A2-mediated release as free DHA with neuroprotective signaling. EPA-derived SPMs: resolvin E1 (RvE1, from EPA), resolvin D1 (RvD1, from DHA), protectin D1 (PD1, from DHA) — these are not anti-inflammatory but actively resolve inflammation by promoting phagocyte removal of cellular debris and restoring tissue homeostasis. This distinction (suppressing vs resolving inflammation) is clinically significant.'
    }
  }
}, {
  d: 7,
  title: 'Berry-Cream Oatmeal Bowl + Pork Tacos',
  dinner: 'Crispy Lettuce Pork Tacos',
  topic: 'Batch Cooking & the Maillard Reaction',
  jw: 'Proverbs 31:15 describes the virtuous woman who "rises while it is still night and provides food for her household." Good meal prep is a Biblical virtue — planning ahead is wisdom.',
  cookToday: 'When heating shredded pork for tonight\'s tacos, let it get slightly caramelized in the skillet. That browning is the Maillard reaction — flavor chemistry.',
  prepTonight: 'Soak 1 cup Oat Groats overnight for Day 8\'s breakfast. Start of Week 2!',
  answers: {
    1: {
      short: 'When food turns brown while cooking, that\'s called the "Maillard reaction" — it makes new flavors. Batch cooking (making lots at once) saves time, just like wise planning in Proverbs.',
      long: 'Have you noticed that browned meat tastes different from pale boiled meat? The brown color and new flavors happen when heat causes proteins and sugars in food to react together and make hundreds of new flavor molecules. Scientists call this the "Maillard reaction." It\'s why toast smells good and grilled chicken tastes different from steamed chicken. Our shredded pork has been batch-cooked — we made a big amount at the start of the week so we could use it for multiple meals. This is the Proverbs 31 principle: a wise person prepares ahead.'
    },
    3: {
      short: 'The Maillard reaction is a non-enzymatic browning reaction between reducing sugars and amino groups at temperatures above 140°C/280°F, producing thousands of flavor compounds (pyrazines, furans, melanoidins). Caramelization (sugar-only browning) occurs at higher temperatures (~160°C+). Batch cooking reduces food waste, energy use, and decision fatigue.',
      long: 'The Maillard reaction (Louis-Camille Maillard, 1912) occurs when a reducing sugar\'s carbonyl group reacts with a free amino group (from proteins or amino acids) in a condensation reaction, producing a Schiff base that undergoes cyclization and rearrangement (Amadori product). Further heating produces hundreds of heterocyclic compounds: pyrazines (nutty, roasted aromas), furans (caramel-like), aldehydes, and brown melanoidin polymers. Temperature threshold: ~140°C (284°F), accelerated by low water activity (browning won\'t occur in boiling water because temperature is limited to 100°C). Caramelization is a separate reaction: direct thermal degradation of sugars without amino groups, producing caramel flavor compounds (diacetyl, hydroxymethylfurfural). The pork browning in tonight\'s skillet tacos undergoes Maillard reaction on the protein-rich meat surface, creating a significantly more complex flavor profile than the slow-cooked shredded interior. Batch cooking science: cooking 10 lbs pork at once vs 1.5 lbs daily reduces total active cooking time by 73%, energy consumption by 45% (oven heating loss amortized over larger volume), and decision fatigue (cognitive load of daily meal decisions).'
    },
    4: {
      short: 'Maillard reaction kinetics: pseudo-first-order rate dependence on reducing sugar concentration; Arrhenius relationship with temperature (rate doubles every 10°C); water activity impact (aw 0.6-0.8 optimal, free water inhibits at aw>0.9 by cooling surface via evaporation). Key flavor compound classes and their precursors. Acrylamide formation risk at high temperatures with asparagine-rich starchy foods.',
      long: 'Maillard reaction kinetics follow the Arrhenius equation: k = Ae^(-Ea/RT), where Ea (activation energy) for Maillard reaction is ~50-80 kJ/mol — meaning reaction rate doubles approximately every 10°C increase in the 100-180°C range. Water activity (aw) profoundly affects rate: optimal aw is 0.5-0.8 (some water needed as reactant medium and to maintain mobility of reactants, but not so much that it cools the surface via evaporative cooling). Above aw 0.9 (high moisture), surface temperature in a skillet cannot exceed 100°C because free water evaporation absorbs energy (latent heat of vaporization = 2,260 kJ/kg). This is why wet food steams rather than browns — the cook must dry the surface first. The Amadori rearrangement product undergoes three main degradation pathways: (1) Strecker degradation of amino acids → characteristic amine-derived aldehydes; (2) Cyclization reactions → pyrazines, imidazoles; (3) Aldol condensation → melanoidin polymer network (brown color, significant antioxidant activity). Acrylamide (2A carcinogen) forms from asparagine + reducing sugars above 120°C — primarily in starchy foods (not meat-based). Our pork taco browning is safe from acrylamide formation.'
    }
  }
}, {
  d: 8,
  title: 'Blueberry Choline Booster + Pork Corn Hash',
  dinner: 'Garlic Pork Loin & Corn Hash',
  topic: 'Choline, Memory & the Brain-Body Connection',
  jw: 'God created the human brain with 86 billion neurons. The choline in eggs builds the neurotransmitter acetylcholine — literally the chemical of memory. Jehovah designed learning chemicals into our breakfast.',
  cookToday: 'Make scrambled eggs — notice how adding more eggs makes the scramble more "custardy." More protein chains = more cross-linking = firmer texture.',
  prepTonight: 'Nothing to prep tonight.',
  answers: {
    1: {
      short: 'Eggs have a special nutrient called choline that helps your brain remember things. Your brain uses choline to send messages between brain cells.',
      long: 'Your brain is like a city with 86 billion buildings (neurons) connected by roads (synapses). Messages travel between buildings using special chemical messengers. One of the most important messengers is called "acetylcholine" — and your body makes it from choline found in egg yolks. When you eat eggs, the choline goes to your brain and helps it make more memory messengers. Students who eat breakfast with eggs tend to concentrate better because choline helps the brain\'s "send message" system work properly.'
    },
    3: {
      short: 'Choline is an essential nutrient (AI: 400-550mg/day) serving as precursor to acetylcholine (motor/memory neurotransmitter) and phosphatidylcholine (cell membrane component). Egg yolk contains ~147mg choline each — the richest dietary source. Choline deficiency impairs memory formation and liver function.',
      long: 'Choline is classified as an essential nutrient (not synthesized in adequate amounts endogenously). Dietary choline is phosphorylated to phosphocholine → CDP-choline (cytidine 5\'-diphosphocholine) → phosphatidylcholine (PC, the most abundant phospholipid in cell membranes, ~40% of all membrane phospholipids). In cholinergic neurons, choline is transported into the presynaptic terminal and acetylated by choline acetyltransferase (ChAT) using acetyl-CoA to form acetylcholine (ACh). ACh is the neurotransmitter at all neuromuscular junctions (motor control), the autonomic ganglia, and in the basal forebrain cholinergic system (memory/attention — hippocampus and cortex). Basal forebrain cholinergic neurons are the primary neurons lost in Alzheimer\'s disease — explaining memory loss. The hippocampus, critical for memory consolidation (converting short-term to long-term memory), has the highest density of muscarinic acetylcholine receptors in the brain. Adequate dietary choline during development is critical: maternal choline supplementation improves infant cognitive development scores.'
    },
    4: {
      short: 'Choline metabolism: CDP-choline pathway (Kennedy pathway) for PC synthesis; beta-oxidation of PC releases choline for reuse; SAM (S-adenosylmethionine) can methylate phosphatidylethanolamine to PC (PEMT pathway — liver only). Acetylcholine synthesis, vesicular storage, release by calcium-triggered exocytosis, postsynaptic mAChR/nAChR activation, and AChE-catalyzed hydrolysis at the synapse.',
      long: 'The CDP-choline (Kennedy) pathway: choline → phosphocholine (choline kinase, CK) → CDP-choline (CTP:phosphocholine cytidylyltransferase, CCT — rate-limiting, regulated by membrane composition) → phosphatidylcholine (CDP-choline:diacylglycerol phosphocholine transferase). The PEMT pathway: phosphatidylethanolamine receives three sequential methyl groups from SAM (S-adenosylmethionine) via phosphatidylethanolamine N-methyltransferase — expressed primarily in liver. This is why liver failure compromises choline status (cannot synthesize via PEMT). Acetylcholine synthesis at the presynaptic terminal: cytoplasmic choline + acetyl-CoA → ACh (ChAT, constitutively active) → stored in synaptic vesicles (vesicular acetylcholine transporter, VAChT, using H+ gradient). Action potential→calcium entry (VGCC)→vesicle fusion→ACh release into synaptic cleft→muscarinic (G-protein coupled) or nicotinic (ion channel) receptor activation→AChE-catalyzed hydrolysis (choline recycled, acetate released). Long-term potentiation (LTP) in hippocampus: repeated synaptic stimulation strengthens connections (Hebbian plasticity) — choline availability affects the cholinergic modulation of LTP, explaining the direct link between dietary choline and memory consolidation efficiency.'
    }
  }
}, {
  d: 9,
  title: 'Overnight Blueberry Oats + Chicken Rice Skillet',
  dinner: 'Savory Chicken & Onion Rice Skillet',
  topic: 'Antioxidants, Free Radicals & Cellular Protection',
  jw: 'Jehovah made blueberries blue with anthocyanins — the same pigment that protects the plant from UV damage. He built protection right into the color. Psalm 104:14 praises Him for making plants grow.',
  cookToday: 'Look at today\'s blueberries — the deep blue-purple color comes from anthocyanins. Notice how they stain everything they touch. That color IS the antioxidant.',
  prepTonight: 'Assemble Overnight Blueberry Oats (oats + milk + flaxseed + blueberries) and refrigerate. Thaw 1.5 lbs Chicken Breast for tomorrow.',
  answers: {
    1: {
      short: 'Blueberries are blue because of a special color called anthocyanin that protects the plant. That same color protects your body too — it fights tiny things called "free radicals" that can hurt your cells.',
      long: 'Imagine tiny little bullets constantly bouncing around inside your body — these are called "free radicals." They\'re made when your body uses oxygen, or when you breathe pollution. Too many free radicals can damage your cells like rust damages iron. Antioxidants are like tiny shields that stop free radicals. The blue color in blueberries (called anthocyanin) is one of the most powerful antioxidants in food. When you eat blueberries, all that purple pigment goes into your blood and protects your cells. This is why the Bible\'s encouragement to eat fruit (Rev 22:2) is also great health advice.'
    },
    3: {
      short: 'Free radicals are unstable molecules with unpaired electrons that oxidize cellular components (DNA, proteins, lipids), causing inflammation and cellular damage. Antioxidants (anthocyanins, vitamin C, vitamin E, beta-carotene) donate electrons to free radicals, neutralizing them. Blueberries\' ORAC (Oxygen Radical Absorbance Capacity) score ~9,621 µmol TE/100g — among highest of any food.',
      long: 'Free radicals are reactive oxygen species (ROS) and reactive nitrogen species (RNS) generated as byproducts of aerobic metabolism (mitochondrial electron transport chain leaks ~2% electrons as superoxide O2•−), UV exposure, ionizing radiation, and pro-oxidant compounds. ROS include: superoxide anion (O2•−), hydrogen peroxide (H2O2, not a free radical but oxidant), and the most damaging — hydroxyl radical (•OH, reacts at diffusion-limited speed with anything). DNA damage: •OH attacks guanine → 8-hydroxy-2\'-deoxyguanosine (8-OHdG) → G→T transversion mutations → cancer risk. Lipid peroxidation chain reaction: •OH abstracts H from polyunsaturated fatty acid → lipid radical → reacts with O2 → lipid peroxyl radical → propagates through membrane, destroying membrane integrity. Anthocyanins (flavonoids) donate a hydrogen atom to •OH (superior radical-scavenging kinetics vs vitamin C), terminating chain reactions. The electron is delocalized across the aromatic ring system, stabilizing the anthocyanin radical. The body\'s own antioxidant defense: superoxide dismutase (SOD, converts O2•− to H2O2), catalase (converts H2O2 to H2O + O2), glutathione peroxidase (GPx). Dietary antioxidants supplement this enzymatic defense, particularly in high-oxidative-stress conditions (exercise, illness, aging).'
    },
    4: {
      short: 'ROS generation at mitochondrial Complex I and III; antioxidant defense hierarchy (enzymatic vs dietary); anthocyanin mechanism (hydrogen atom transfer vs electron transfer vs radical adduct formation); transcription factor Nrf2 activation by polyphenols → antioxidant response element (ARE) → HO-1, NQO1, GPx upregulation; hormesis concept (low-level oxidative stress induces stronger antioxidant response).',
      long: 'Mitochondrial ROS generation: Complex I (NADH dehydrogenase) and Complex III (ubiquinol-cytochrome c reductase) are primary sites — ubisemiquinone radical (Q•−) transfers electron to O2, forming O2•−. Rate of ROS production increases with high NADH/NAD+ ratio (after large carbohydrate meals) and low ADP (when ATP synthesis demand is low). Superoxide dismutase (SOD1/2/3) converts O2•− to H2O2 (log k = 9 M−1s−1, diffusion-limited). Fenton reaction: Fe2+ + H2O2 → Fe3+ + •OH + OH− — this is why iron overload is pro-oxidant. Anthocyanin antioxidant mechanisms: HAT (hydrogen atom transfer) — most important kinetically; SET-PT (sequential electron transfer-proton transfer); RAF (radical adduct formation). Anthocyanins exist in 4 pH-dependent structural forms — flavylium cation (red, acidic), quinonoidal base (blue-purple, basic), hemiketal (colorless, neutral), chalcone (yellow, neutral). At physiological pH (7.4), anthocyanins are primarily in hemiketal and chalcone forms — yet show antioxidant activity, suggesting metabolites (particularly phenolic acid derivatives from colonic microbiome degradation) may be the active circulating forms. Polyphenol→Nrf2 pathway: polyphenols oxidize Keap1\'s cysteine thiols → releases Nrf2 → nuclear ARE binding → transcription of phase II detoxification enzymes (HO-1, NQO1, GCLC) — an indirect antioxidant effect more significant than direct radical scavenging.'
    }
  }
}, {
  d: 10,
  title: 'Avocado Egg Boats + Garlic Herbed Chicken',
  dinner: 'Garlic Herbed Chicken Thighs & Green Beans',
  topic: 'Healthy Fats, Fat-Soluble Vitamins & Absorption',
  jw: 'Jehovah designed fats not just for energy but as the KEY to absorbing vital vitamins. Avocado + eggs is a perfect combination He wrote into creation — the fat in avocado unlocks the vitamins in the egg yolk.',
  cookToday: 'Place a fried egg directly on a thick avocado slice. Notice how the warm egg fat and the avocado fat mix. These monounsaturated fats from avocado increase absorption of vitamins A, D, E, and K from the egg.',
  prepTonight: 'Thaw 2 lbs Chicken Thighs for tonight\'s dinner.',
  answers: {
    1: {
      short: 'Avocado has healthy fat that is like a key — it opens the door so your body can absorb vitamins from other foods like eggs. Fat is not bad — it is one of the ways Jehovah designed our bodies to get vitamins.',
      long: 'Some vitamins need fat to be absorbed — they\'re called "fat-soluble vitamins" (vitamins A, D, E, and K). When you eat avocado with eggs, the fat in the avocado helps your body absorb vitamin D and vitamin A from the egg yolk. Without the fat, these vitamins might just pass through without being absorbed. This is why Jehovah designed foods to be eaten together — avocado and eggs go together scientifically, not just because they taste good! Different types of fat exist: unhealthy saturated fats (solid at room temperature, found in butter) and healthy unsaturated fats (liquid at room temperature) like those in avocado.'
    },
    3: {
      short: 'Vitamins A, D, E, and K are fat-soluble — they require dietary fat for absorption and are stored in adipose tissue and liver. Avocado\'s monounsaturated oleic acid (omega-9) increases micellar solubilization of fat-soluble vitamins in the small intestine, dramatically improving their bioavailability. Adding fat to salads increases carotenoid absorption up to 15-fold.',
      long: 'Fat-soluble vitamins (A, D, E, K) are incorporated into dietary fat micelles for absorption — they cannot be absorbed without fat present in the intestinal lumen. Process: dietary fat → bile salt-mediated emulsification → pancreatic lipase hydrolysis → fatty acids + monoglycerides → mixed micelles with bile salts, fat-soluble vitamins, and cholesterol → passive diffusion across enterocyte brush border. Without adequate dietary fat, micelle formation is impaired and fat-soluble vitamins pass through in the stool. Clinical example: patients on low-fat diets or with fat malabsorption (Crohn\'s, cystic fibrosis) develop fat-soluble vitamin deficiencies despite adequate dietary intake. Avocado\'s oleic acid (55-70% of fat content, omega-9 monounsaturated fatty acid) is ideal for micellar formation. Research: adding avocado to salad increased carotenoid (beta-carotene, lycopene, lutein) absorption 4-15 fold vs fat-free dressing. Egg yolk vitamins: vitamin D3 (~1-2mcg/yolk), vitamin A (retinol, ~100mcg RAE/yolk), vitamin K2 (menaquinone MK-4, ~15mcg/yolk), vitamin E (~0.5mg/yolk). The fat in the same yolk facilitates absorption of these vitamins within the same meal — another elegant design.'
    },
    4: {
      short: 'Micellar solubilization thermodynamics; bile salt critical micellar concentration (CMC); fat-soluble vitamin transport in chylomicrons (lymphatic vs portal absorption); apolipoprotein-mediated uptake; retinol binding protein (RBP4) transport; vitamin D hydroxylation (25-hydroxylase in liver, 1α-hydroxylase in kidney); calcitriol as hormone at VDR nuclear receptor.',
      long: 'Micellar solubilization: bile salts (amphipathic, CMC ~1-3mM in intestinal lumen) self-assemble into mixed micelles when combined with dietary lipid digestion products (monoglycerides, fatty acids, lysophospholipids). The hydrophobic core of micelles dissolves fat-soluble vitamins; hydrophilic exterior interacts with aqueous intestinal content. Micelle size (4-6nm) and composition determine partitioning of vitamins (log Pow values: retinol ~3.1, tocopherol ~6.7, calcitriol ~3.0, phylloquinone ~8.8). The high log Pow of vitamin K2 explains its preferential incorporation into large triglyceride-rich micelles. Chylomicron assembly in enterocytes: fat-soluble vitamins + triglycerides → packaged with apoB-48, apoA-I, apoA-IV → secreted via lymph (not portal blood) — bypassing first-pass liver metabolism. Vitamin D metabolism: skin UV-B (290-315nm) → 7-dehydrocholesterol → previtamin D3 → vitamin D3 (cholecalciferol) → liver 25-hydroxylation (CYP2R1, CYP27A1) → 25(OH)D3 (calcidiol, the serum marker measured clinically) → kidney 1α-hydroxylation (CYP27B1, regulated by PTH and FGF23) → calcitriol [1,25(OH)2D3] — the active hormone. Calcitriol binds VDR (vitamin D receptor, nuclear receptor superfamily) → VDR:RXR heterodimer → VDRE (vitamin D response element) binding → transactivation of 200+ target genes including TRPV6 (calcium channel), calbindin-D9k (calcium binding protein), RANKL (bone remodeling). Jehovah\'s elegant system: sunlight, food fats, and hepatorenal hydroxylation working in concert to regulate calcium homeostasis — the integrative physiology of a wisely designed body.'
    }
  }
}, {
  d: 11,
  title: 'Cinnamon Honey Oatmeal + Beef & Bean Stew',
  dinner: 'Hearty Ground Beef & Pinto Bean Stew',
  topic: 'Legumes, Plant Protein & Nitrogen Fixation',
  jw: 'Genesis 1:29 gives us "seed-bearing plants" as food. Beans are seeds — and they carry out one of Jehovah\'s most remarkable biochemical processes: nitrogen fixation, pulling fertilizer from the air itself.',
  cookToday: 'Cook the beef and bean stew from scratch. Observe the beans\' texture before and after long simmering. Dried beans rehydrate and become soft as their starch granules absorb water and swell.',
  prepTonight: 'Make sure leftover stew is cooled within 1 hour and refrigerated — food safety review.',
  answers: {
    1: {
      short: 'Beans grow by using a special process called nitrogen fixation — they can take fertilizer right out of the air! Beans are also a great protein food that helps our muscles grow, and they\'re seeds, just like Genesis 1:29 says Jehovah gave us.',
      long: 'Nitrogen is a gas in the air (78% of air is nitrogen) but most plants can\'t use it — it\'s in a form they can\'t eat. Beans are special because tiny bacteria living on their roots can "fix" nitrogen from the air and turn it into a form the plant can use as food. This is called nitrogen fixation, and it\'s one of the most incredible things in all of creation — the bean plant works with bacteria as a team to make its own fertilizer! Beans also have lots of protein (the building blocks our muscles need) and fiber (food for the good bacteria in our tummy).'
    },
    3: {
      short: 'Legumes host Rhizobium bacteria in root nodules that fix atmospheric N2 into NH4+ (ammonium) — via nitrogenase enzyme — providing the plant with bioavailable nitrogen without synthetic fertilizers. Beans are an incomplete protein (low methionine) but complemented by rice or corn (limiting lysine), creating a complete amino acid profile together.',
      long: 'Biological nitrogen fixation: Rhizobium species infect legume root hairs, triggering root nodule formation. Within nodules, bacteria differentiate into bacteroids expressing nitrogenase complex: Fe protein (dinitrogenase reductase) + MoFe protein (dinitrogenase). Nitrogenase reaction: N2 + 8H+ + 8e- + 16 ATP → 2NH3 + H2 + 16 ADP + 16 Pi. The MoFe cofactor (iron-molybdenum cofactor, FeMo-co) is the active site for N≡N triple bond cleavage — an extraordinarily stable bond requiring 945 kJ/mol to break. Leghemoglobin (analogous to hemoglobin) in nodules buffers oxygen concentration — nitrogenase is irreversibly inactivated by O2, yet aerobic respiration is needed for ATP production. Leghemoglobin buffers O2 to ~10nM (10,000x lower than surrounding soil). Beans as complementary protein: pinto beans are limiting in methionine but rich in lysine; rice is limiting in lysine but has adequate methionine. Together they provide all 9 essential amino acids — the traditional combination used across global cultures before protein science existed. Beans also contain resistant starch + soluble fiber (pectin, guar gum) that ferment to SCFAs in the colon.'
    },
    4: {
      short: 'Nitrogenase mechanism: FeMo-co N2 binding and sequential protonation; obligate anaerobiosis vs leghemoglobin O2 buffering; alternating nitrogenase (V-nitrogenase, Fe-nitrogenase for Mo-limited conditions); legume-rhizobium signaling (Nod factors → calcium spiking → NIN transcription factor). Dietary protein quality: DIAAS scoring; leucine threshold for mTOR activation; plant protein digestibility vs animal protein.',
      long: 'Nitrogenase mechanism (Mo-nitrogenase): substrate binding at FeMo-co proceeds via E (electronic) intermediates E0-E8. N2 binds at E4 state (after 4H have reduced the cluster); N≡N bond is cleaved via a "chemo-distal" mechanism with alternating or distal protonation pathways. ATP hydrolysis (2 ATPs per electron transferred) drives conformational changes in Fe protein that enable sequential electron transfer from Fe protein to MoFe protein (at ~1 electron per cycle, rate-limiting step). Obligate anaerobiosis creates an evolutionary paradox: nitrogenase requires O2-free conditions yet bacteria need aerobic respiration for the 16 ATPs per N2 fixed. Leghemoglobin solution: concentration maintained at ~0.5-1mM in nodule cytoplasm; Kd for O2 of ~10 nM provides rapid O2 buffering while maintaining respiratory activity. Nod factor signaling: Rhizobium secretes lipochito-oligosaccharide Nod factors recognized by LysM receptor kinases (NFR1, NFR5 in soybean) → calcium spiking in root hair nucleus → calcium-calmodulin dependent kinase (CCaMK) activation → CYCLOPS/NSP1/NSP2/NIN transcription factor cascade → infection thread formation, nodule organogenesis. DIAAS (Digestible Indispensable Amino Acid Score): pinto beans DIAAS ~0.71 (limiting amino acid: methionine) vs egg DIAAS ~1.13. Plant-animal protein combination strategies for adequate methionine+cysteine (sulfur amino acids) while reducing environmental impact of meat production (legumes produce ~0.5 kg CO2eq/100g protein vs beef ~25 kg CO2eq/100g protein) — stewarding Jehovah\'s earth (Gen 2:15, Rev 11:18).'
    }
  }
}, {
  d: 12,
  title: 'Scrambled Eggs + Pork Rice Skillet',
  dinner: 'Shredded Pork Rice Skillet',
  topic: 'Portion Science & Caloric Needs',
  jw: 'Proverbs 25:16 says "Have you found honey? Eat just enough." Even good food can be consumed unwisely. Jehovah\'s wisdom includes portion control — knowing the right amount is also health knowledge.',
  cookToday: 'Kitchen Roundup Day — use all remaining ingredients. Calculate: How many meals have we prepared in the last 12 days? What was the approximate cost per meal per person?',
  prepTonight: 'Hard-boil 7 eggs for tomorrow\'s morning snack.',
  answers: {
    1: {
      short: 'Our bodies need just the right amount of food — not too much and not too little. Jehovah tells us in Proverbs to eat enough but not too much, even of good food like honey.',
      long: 'Every food we eat gives us energy measured in calories. Your body needs a certain number of calories each day to grow, think, and move. Too few calories = your body doesn\'t have enough fuel. Too many = your body stores the extra as fat. For a growing child your age, your body needs about 1,600-2,000 calories per day. Proverbs 25:16 says even honey (a healthy food) should only be eaten in the right amount. Our meal plan is sized for 6-7 people — that\'s a big family and takes a lot of food! To figure out one person\'s portion, you divide the recipe amount by the number of people.'
    },
    3: {
      short: 'Caloric needs are determined by BMR (basal metabolic rate) + activity factor. BMR = resting energy expenditure (Mifflin-St Jeor or Harris-Benedict equations). Growing teens have higher caloric needs per kg of body weight than adults due to tissue synthesis requirements. Macronutrient ratios: 45-65% carbohydrates, 20-35% fat, 10-35% protein (AMDR, DRI).',
      long: 'Total Daily Energy Expenditure (TDEE) = BMR × Activity Factor. Mifflin-St Jeor BMR (most accurate): Men: 10×weight(kg) + 6.25×height(cm) − 5×age(yrs) + 5; Women: 10×weight(kg) + 6.25×height(cm) − 5×age(yrs) − 161. Activity multipliers: sedentary (×1.2), lightly active (×1.375), moderately active (×1.55), very active (×1.725). Growing teens require additional energy: ~200 kcal/day above TDEE for tissue growth during puberty. Our family meal plan provides approximately 2,200-2,600+ kcal/day per person — appropriate for active teens. Protein: RDA = 0.8g/kg/day for adults; growing teens need 1.0-1.5g/kg/day. Per meal cost: Total plan cost $573.34 ÷ 14 days ÷ 6.5 people ÷ 5 meals = approximately $1.26 per meal per person — significantly below restaurant or processed food costs. Proverbs 25:16: the wisdom of moderation is applicable to macronutrients — excess carbohydrate (above glycogen capacity) → de novo lipogenesis → fat storage.'
    },
    4: {
      short: 'Energy homeostasis: leptin (adipokine, signals satiety to hypothalamus), ghrelin (stomach hormone, signals hunger), CCK (cholecystokinin, postprandial satiety), insulin (glucose-mediated satiety signal). Set-point theory vs settling point model of body weight regulation. BMI limitations as population metric. Total energy expenditure components: REE (60-70%), TEF (thermic effect of food, 10%), TEA (thermic effect of activity, 20-30%).',
      long: 'Energy homeostasis is regulated by the hypothalamus integrating peripheral signals: Leptin (adipokine from adipose tissue, proportional to fat mass) → hypothalamic ARC (arcuate nucleus) POMC/CART neurons (anorexigenic) activation + NPY/AgRP (orexigenic) inhibition → decreased food intake and increased energy expenditure. Ghrelin (stomach, peak pre-meal) → ARC AgRP/NPY activation → appetite stimulation. CCK (duodenum, released by dietary fat and protein) → vagal afferents → NTS (nucleus tractus solitarius) → satiety. Insulin (pancreatic beta cells, post-prandial) → ARC insulin receptor → POMC activation, reduced NPY → satiety (long-term) AND acute appetite stimulation (low insulin = enhanced ghrelin sensitivity = hunger). Thermic Effect of Food (TEF/DIT): energy expended digesting and absorbing macronutrients. Protein has highest TEF (~20-35% of calories consumed used in digestion); carbohydrate ~5-10%; fat ~0-5%. This means a high-protein meal\'s net caloric contribution is ~20-30% lower than labeled. Total energy expenditure components: REE (Resting Energy Expenditure, 60-70% total) — maintained by thyroid hormones, sympathetic tone; TEF (10%); TEA (Thermic Effect of Activity, 20-30%) — voluntary exercise; NEAT (Non-Exercise Activity Thermogenesis, highly variable) — fidgeting, posture, spontaneous movement. Set-point theory (hypothalamic regulation defends a body weight "set point") vs settling point (body weight determined by environmental factors → behavioral outputs → energy balance). Modern obesity epidemiology supports the settling point model — ultra-processed food environments shift the settling point upward by bypassing satiety signals.'
    }
  }
}, {
  d: 13,
  title: 'Strawberry Cream Overnight Oats + Shredded Pork Salad',
  dinner: 'Garlic Chicken Taco Bowls',
  topic: 'Fermentation, Preservation & Food History',
  jw: 'Ancient Israel used fermentation to preserve food — salted fish, leavened bread, preserved olives. Jehovah\'s creation included the microorganisms that make fermentation possible. John 6:9 — even the disciples recognized the value of preserved food (the boy\'s five loaves and two fish).',
  cookToday: 'Your overnight oats are already fermented! Notice how the texture is different from fresh oats. The yogurt\'s bacteria have been working overnight, partially breaking down the oat starches.',
  prepTonight: 'Assemble Strawberry Cream Overnight Oats for tomorrow. Thaw 1.5 lbs Chicken Breast.',
  answers: {
    1: {
      short: 'Fermentation is when bacteria eat sugar and make food change — like when yogurt turns milk tangy, or dough rises. Jehovah put tiny bacteria in the world that help us preserve and make food. People have done this since Bible times.',
      long: 'Long before refrigerators existed, people needed ways to keep food from spoiling. Jehovah put tiny microorganisms (bacteria and yeast) in the world that could help. When bacteria eat sugar in food, they make acids that stop other harmful bacteria from growing — this preserves the food. That\'s fermentation! Yogurt is milk that bacteria fermented into something thick and tangy. Bread rises because yeast ferments flour sugars into gas bubbles. In Bible times, the disciples had "five loaves" — bread made with fermented dough that could travel with them. Our overnight oats got softer because the yogurt bacteria started breaking down the oat starches overnight.'
    },
    3: {
      short: 'Fermentation is anaerobic metabolism by microorganisms — bacteria produce lactic acid (lacto-fermentation, preserving food via pH reduction) or CO2+ethanol (yeast fermentation, leavening bread). Lactic acid fermentation: glucose → 2 pyruvate (glycolysis) → 2 lactate (lactate dehydrogenase). pH drops to 4.0-4.5, inhibiting most pathogens. Overnight oat fermentation: yogurt Lactobacillus species partially break down oat beta-glucan and phytic acid during cold fermentation.',
      long: 'Fermentation is humanity\'s oldest food preservation technology — predating written history. Lacto-fermentation mechanism: Lactobacillus species ferment glucose/lactose via homofermentative pathway: glucose → 2 pyruvate (10-step glycolysis) → 2 lactate (LDH, lactate dehydrogenase, regenerates NAD+ for continued glycolysis). Net: 1 glucose → 2 lactate + 2 ATP (inefficient compared to aerobic respiration\'s 30-32 ATP, but anaerobic conditions allow rapid colonization). Lactic acid lowers food pH to 4.0-4.5, below the minimum growth pH of most pathogens (Listeria: min pH 4.4, Salmonella: min pH 4.2) — creating a hostile environment that preservation exploits. Additional antimicrobials: bacteriocins (nisin, plantaricin), hydrogen peroxide, diacetyl. Biblical fermentation: the "five loaves" of John 6:9 were almost certainly leavened bread (artos in Greek = leavened bread, distinct from unleavened azumos). Leaven (sourdough starter) was a working culture of wild yeast and bacteria maintained for months — exactly the culture-passing technology that archaeology confirms throughout the ancient Near East. Overnight oat cold fermentation: at refrigerator temperature (4°C), Lactobacillus activity is slowed but not stopped — phytase enzymes (pH-sensitive, most active at pH 4.5-5.5) degrade some phytic acid, and amylolytic enzymes partially hydrolize starch, contributing to the characteristic softened overnight texture.'
    },
    4: {
      short: 'Lactic acid fermentation biochemistry: homofermentative vs heterofermentative pathways; ΔG of glucose fermentation vs oxidative phosphorylation; pH and bacteriocin-mediated competitive exclusion. Sourdough microbiome succession (pioneering bacteria → stable community). SCOBY (symbiotic culture of bacteria and yeast) ecology. Traditional fermented foods and their role in gut microbiome diversity maintenance across human evolutionary history.',
      long: 'Homofermentative lacto-fermentation: L. bulgaricus, L. acidophilus — convert glucose primarily to lactate. Heterofermentative: L. brevis, L. fermentum — produce equimolar CO2, ethanol, and lactate from glucose via phosphoketolase pathway. The phosphoketolase pathway bypasses the fructose-1,6-bisphosphate aldolase step, cleaving xylulose-5-phosphate to acetyl-phosphate + glyceraldehyde-3-phosphate. This allows fermentation of pentoses (xylose, arabinose from hemicellulose) that homofermenters cannot use. Thermodynamics: glucose → 2 lactate (ΔG° = -197 kJ/mol, vs full oxidation ΔG° = -2870 kJ/mol). The 93% "wasted" energy makes fermentation appear inefficient — but the cells capture 2 ATP (ΔG ~ -30.5 kJ/mol each = -61 kJ/mol captured), an efficiency of 31% of the fermentation ΔG, comparable to photovoltaic efficiency. Sourdough microbiome succession: initial inoculation with environmental microorganisms → acid-tolerant bacteria outcompete neutralophiles → stable LAB (lactic acid bacteria) + Saccharomyces cerevisiae community. The bacteria-yeast mutualism: yeast cannot metabolize maltose from flour amylase activity; LAB metabolize maltose → provide monosaccharides to yeast. Yeast produce CO2 (leavening) + ethanol + flavor esters; bacteria produce organic acids (flavor) + antimicrobials protecting yeast. Human gut microbiome diversity correlates with fermented food consumption (Science, 2021: 10-week fermented food intervention increased microbiome diversity and reduced inflammatory markers vs high-fiber diet). Archaeological evidence: fermented grain residues found in 30,000-year-old vessels — Jehovah\'s created microorganisms have been essential partners in human food history from the beginning.'
    }
  }
}, {
  d: 14,
  title: 'Fried Eggs & Avocado + Final Kitchen Roundup',
  dinner: 'Omega Tuna Rice Bowls',
  topic: 'Cooking Science Review & Meal Plan Assessment',
  jw: 'Proverbs 31:27 says she "watches over the activities of her household." This two-week meal plan has been a complete science course — and now you can teach others how to plan and cook for a family.',
  cookToday: 'Final Kitchen Roundup: use ALL remaining ingredients creatively. Practice the science skills from this unit.',
  prepTonight: 'CONGRATULATIONS — Two-Week Meal Plan COMPLETE! Now plan the next two weeks together.',
  answers: {
    1: {
      short: 'You have now learned 14 days of cooking science! You know about proteins, carbohydrates, fats, vitamins, antioxidants, fermentation, food safety, and Jehovah\'s amazing design in every food. Now it\'s time to help plan the next two weeks of meals!',
      long: 'You\'ve completed a full two-week meal science unit! Look at everything you learned: Day 1: Oats give us complex carbohydrates for slow energy. Day 2: Eggs have complete protein with all 9 building blocks. Day 3: Yogurt has probiotics that help your gut microbiome. Day 4: Food safety keeps us healthy. Day 5: Turmeric has curcumin that fights inflammation. Day 6: Tuna has DHA omega-3s for brain development. Day 7: The Maillard reaction makes browned food taste better. Day 8: Choline in eggs builds memory chemicals. Day 9: Blueberries\' antioxidants fight free radical damage. Day 10: Avocado fat helps absorb vitamins from eggs. Day 11: Beans fix nitrogen from the air and complement rice protein. Day 12: Portion science and caloric needs. Day 13: Fermentation is ancient food preservation. Now YOU are the scientist. Let\'s plan the next two weeks!'
    },
    3: {
      short: 'Week 2 science summary: choline and acetylcholine neurotransmission, anthocyanin antioxidant mechanisms, monounsaturated fat and fat-soluble vitamin absorption, legume nitrogen fixation and complementary proteins, energy homeostasis and caloric needs, lactic acid fermentation and sourdough microbiology. Transition: apply all concepts to independently plan the next 2-week meal cycle using nutritional knowledge.',
      long: 'The 14-day curriculum has covered six major biochemistry and food science domains: (1) Macronutrient metabolism — complex carbohydrate glycolysis and glycemic index, protein quality metrics (BV, PDCAAS, DIAAS), lipid classes and functions. (2) Micronutrient absorption — fat-soluble vitamins (A,D,E,K) and micellar transport, choline and neurochemistry, omega-3 fatty acid metabolism. (3) Phytochemistry — curcumin\'s anti-inflammatory mechanisms (NF-κB, COX-2), anthocyanin antioxidant kinetics, Nrf2 pathway activation. (4) Food microbiology — gut microbiome composition and probiotic colonization, fermentation biochemistry (homofermentative vs heterofermentative), food safety (danger zone kinetics, spore-forming pathogen risk). (5) Cooking chemistry — Maillard reaction mechanism and kinetics, protein denaturation and gelation, starch gelatinization and retrogradation. (6) Nutritional science — energy homeostasis (leptin, ghrelin, CCK), BMR and TDEE calculations, AMDR macronutrient ranges. The meal planning unit (Days 15-19) will integrate all these concepts in practical application.'
    },
    4: {
      short: 'Integration assessment: design a complete 14-day meal plan that (a) achieves complementary protein coverage (DIAAS ≥ 0.8/day), (b) maintains omega-3:omega-6 ratio ≤ 1:6, (c) includes at least 5g beta-glucan/day for cholesterol management, (d) provides adequate choline (DRI: 400-550mg/day), and (e) stays within budget of $483.40/2 weeks. Document the nutritional rationale for each food combination choice.',
      long: 'Advanced integration assessment: nutritional analysis requires tracking across all 20+ nutrients simultaneously. Key performance indicators: (1) Protein quality: daily DIAAS tracking using the most-limiting amino acid across all protein sources. Rice + beans achieves DIAAS ~0.85 (complementarity); fish alone achieves DIAAS ~0.90-1.0. (2) Omega-3:6 balance: standard Western diet at 1:20 ratio → target ≤1:6. Calculation: 4 cans tuna (56g combined EPA+DHA)/week + daily 2tsp flaxseed (3.6g ALA) + avocado (low omega-6) vs corn (high omega-6 linoleic acid at ~2.1g/ear) requires careful balancing. (3) Beta-glucan: oat groats contain 3.5g beta-glucan/100g dry weight; 3 cups oat groats/meal ÷ 7 people = ~43g dry oats/person → ~1.5g beta-glucan/oat breakfast. Multiple oat days per week approach but may not reach 3g daily target every day — supplementation or increased frequency indicated. (4) Choline: eggs (147mg/yolk × 1.4 eggs/person on egg days) + liver (if added), lecithin from beans (~15mg/cup). Non-egg days may fall below the 400mg AI. Budget analysis: $483.40 ÷ 14 days ÷ 6.5 people = $5.31/person/day for 5 meals = $1.06/meal/person — compare to USDA "Thrifty Food Plan" benchmark of ~$8.41/person/day, demonstrating this plan\'s exceptional value. The stewardship principle (Luke 14:28 — "count the cost") applied to family nutrition planning.'
    }
  }
}];

// ─── Meal Planning Unit (Days 15-19 of Science) ──────────────────────────────
const MEAL_PLANNING_UNIT = {
  title: 'Meal Planning Science — Planning the Next 2 Weeks',
  jw: 'Luke 14:28 — "Who of you wanting to build a tower does not first sit down and calculate the expense?" Jehovah\'s wisdom applies to food planning. A wise family plans their meals with the same care.',
  days: [{
    n: 15,
    title: 'Nutrition Labels & Budget Planning',
    activity: 'Read a nutrition label from 3 different foods in your pantry. Calculate: (a) % of daily protein met by one serving, (b) total cost per gram of protein for each food. Which food gives the most protein per dollar?',
    l1: 'Find 3 food labels. Write down: serving size, protein grams, and price. Figure out which is the best deal for protein.',
    l34: 'Apply DIAAS scoring to each food\'s protein. Calculate cost per gram of each essential amino acid. Identify the most economical complete protein source for your family.'
  }, {
    n: 16,
    title: 'Seasonal & Local Eating Strategy',
    activity: 'Look up what produce is in season in South Carolina right now. Circle 5 seasonal items from the current meal plan. Research: why does seasonal produce typically cost less AND provide more nutrients?',
    l1: 'Draw the 4 seasons. In each one, draw 3 foods that grow in that season. Which season has the most variety near us in South Carolina?',
    l34: 'Research: nutrient density of produce at harvest vs post-transit vs stored. Calculate the nutritional ROI of buying local seasonal produce vs imported out-of-season. Design a seasonal rotation for 4 cycles of the meal plan.'
  }, {
    n: 17,
    title: 'Shopping List Science',
    activity: 'Take the Two-Week Family Meal Plan shopping list and reorganize it by grocery store section (produce, meat, dairy, pantry). Then calculate: which items could be bought at Sam\'s Club in bulk to save money on the NEXT cycle?',
    l1: 'Draw a grocery store map with 5 sections. Sort 10 items from our shopping list into the right section. This saves time and you don\'t forget anything!',
    l34: 'Analyze the shopping list for unit economics: price per oz or per serving for each protein source. Calculate the break-even point for bulk buying (when does buying in bulk actually save money vs the cost of storage space and potential spoilage?).'
  }, {
    n: 18,
    title: 'Recipe Scaling & Ratio Math',
    activity: 'Take the Day 1 Cinnamon Berry Oats recipe (serves 6-7). Scale it to serve exactly 4 people. Then scale it to serve 10 people. Show all your math.',
    l1: 'Day 1 breakfast calls for 3 cups of oats for 6-7 people. How many cups for 3 people? For 12 people? Use fractions.',
    l34: 'Write a general formula R(n) for any recipe in the meal plan where R(n) = original quantities × (n ÷ original_serving_count). Apply to all 5 meals for Day 3 scaled to 9 people. Identify which quantities round easily vs which require measurement precision.'
  }, {
    n: 19,
    title: 'Create Your Family\'s Next Meal Plan',
    activity: 'Using everything you\'ve learned in this science unit, work together to plan the next 2 weeks of family meals. Requirements: (1) 5 meals per day, (2) at least 3 different protein sources per week, (3) at least 1 meal with oats per week, (4) a shopping list organized by store, (5) 2 seasoning blend recipes of your own creation.',
    l1: 'Draw 3 breakfast ideas, 3 lunch ideas, and 3 dinner ideas your family could make. Pick your favorites for next week\'s menu.',
    l34: 'Design the complete next 2-week meal plan: full ingredient lists, estimated cost per meal per person, macronutrient profiles for each day (carb/protein/fat in grams), shopping list by store with price estimates, and a written rationale for at least 3 nutritional choices you made. Include 2 original seasoning blend recipes with the biochemical rationale for each ingredient selection.'
  }]
};

// ─── MealScienceModule React Component ───────────────────────────────────────
function MealScienceModule({
  studentId,
  grade,
  day,
  isTeacher
}) {
  const [view, setView] = useState('today');
  const [planDay, setPlanDay] = useState(day || 1);
  const level = SCHOOL_STUDENTS?.find(s => s.id === studentId)?.level || 4;
  const answerLevel = level <= 1 ? 1 : level <= 2 ? 1 : level <= 3 ? 3 : 4;
  const mealDay = MEAL_SCIENCE_DAYS[planDay - 1];
  const planUnit = view === 'planning';
  const tabs = [{
    id: 'today',
    l: `📅 Day ${planDay}`
  }, {
    id: 'planning',
    l: '📋 Meal Planning Unit'
  }];
  if (typeof MenuScience === 'function') return React.createElement("div", null, (typeof KitchenTodayCard === 'function') ? React.createElement(KitchenTodayCard, { studentId: studentId }) : null, (typeof CameraLabCard === 'function') ? React.createElement(CameraLabCard, { studentId: studentId }) : null, React.createElement(MenuScience, { grade: grade, day: day }));
  return /*#__PURE__*/React.createElement("div", null, (typeof KitchenTodayCard === 'function') ? React.createElement(KitchenTodayCard, { studentId: studentId }) : null, (typeof CameraLabCard === 'function') ? React.createElement(CameraLabCard, { studentId: studentId }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(76,175,82,.08)',
      border: '1px solid rgba(76,175,82,.3)',
      borderRadius: 12,
      padding: '10px 12px',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#4CAF82',
      marginBottom: 2
    }
  }, "🧪 Science: Cooking & Nutrition"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa'
    }
  }, "14-Day Family Meal Plan × Science Curriculum · ", level <= 1 ? 'Level 1' : level <= 2 ? 'Level 1-2' : level <= 3 ? 'Level 2-3' : 'Level 4', " content"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#4CAF82',
      marginTop: 3
    }
  }, `Jehovah's wisdom embedded in every meal — Psalm 104:14`)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPlanDay(Math.max(1, planDay - 1)),
    style: {
      background: 'rgba(255,255,255,.07)',
      color: '#aaa',
      padding: '5px 12px',
      borderRadius: 20,
      border: 'none'
    }
  }, "‹"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 900,
      color: '#4CAF82'
    }
  }, "Meal Plan Day ", planDay), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: 'rgba(255,255,255,.06)',
      borderRadius: 2,
      marginTop: 4,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${planDay / 14 * 100}%`,
      background: '#4CAF82',
      borderRadius: 2
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPlanDay(Math.min(14, planDay + 1)),
    style: {
      background: 'rgba(255,255,255,.07)',
      color: '#aaa',
      padding: '5px 12px',
      borderRadius: 20,
      border: 'none'
    }
  }, "›")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      marginBottom: 10
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setView(t.id),
    style: {
      flex: 1,
      padding: '6px',
      borderRadius: 20,
      fontSize: 9,
      fontWeight: 700,
      border: 'none',
      background: view === t.id ? '#4CAF82' : 'rgba(255,255,255,.07)',
      color: view === t.id ? '#000' : '#555'
    }
  }, t.l))), !planUnit && mealDay && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.2)',
      borderRadius: 8,
      padding: '8px 10px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#4CAF82',
      marginBottom: 4
    }
  }, "TODAY\\'S MEALS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: '#fff',
      marginBottom: 1
    }
  }, mealDay.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa'
    }
  }, "🍽 Dinner: ", mealDay.dinner)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(76,175,82,.06)',
      border: '1px solid rgba(76,175,82,.3)',
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#4CAF82',
      marginBottom: 4
    }
  }, "🔬 ", mealDay.topic), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa',
      fontStyle: 'italic',
      marginBottom: 6
    }
  }, mealDay.jw), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.2)',
      borderRadius: 7,
      padding: '6px 8px',
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#FF9800',
      marginBottom: 1
    }
  }, "👨‍🍳 COOK TODAY"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#ccc'
    }
  }, mealDay.cookToday)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(121,134,203,.08)',
      borderRadius: 7,
      padding: '6px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#7986CB',
      marginBottom: 1
    }
  }, "🌙 PREP TONIGHT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#ccc'
    }
  }, mealDay.prepTonight))), isTeacher ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(239,83,80,.06)',
      borderRadius: 8,
      padding: '8px 10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#EF5350',
      marginBottom: 5
    }
  }, "🔑 ANSWER KEYS — ALL LEVELS"), Object.entries(mealDay.answers).map(([lvl, ans]) => /*#__PURE__*/React.createElement("div", {
    key: lvl,
    style: {
      marginBottom: 8,
      background: 'rgba(0,0,0,.2)',
      borderRadius: 7,
      padding: '7px 9px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#C0CA33',
      fontWeight: 700,
      marginBottom: 3
    }
  }, "LEVEL ", lvl, " (", lvl === '1' ? 'Mykah' : lvl === '3' ? 'Ashelyn' : 'Kayla & Ryan', ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#FF9800',
      fontWeight: 700,
      marginBottom: 1
    }
  }, "SHORT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#ccc',
      marginBottom: 4
    }
  }, ans.short), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#EF5350',
      fontWeight: 700,
      marginBottom: 1
    }
  }, "LONG"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa',
      lineHeight: 1.7
    }
  }, ans.long)))) : mealDay.answers[answerLevel] && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(76,175,82,.05)',
      borderRadius: 8,
      padding: '8px 10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#4CAF82',
      marginBottom: 4
    }
  }, "💡 SCIENCE LEARNING"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#ccc',
      lineHeight: 1.7
    }
  }, mealDay.answers[answerLevel].short))), planUnit && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(76,175,82,.08)',
      border: '1px solid rgba(76,175,82,.3)',
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#4CAF82',
      marginBottom: 2
    }
  }, MEAL_PLANNING_UNIT.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa',
      fontStyle: 'italic'
    }
  }, MEAL_PLANNING_UNIT.jw)), MEAL_PLANNING_UNIT.days.map(ud => /*#__PURE__*/React.createElement("div", {
    key: ud.n,
    style: {
      marginBottom: 8,
      background: 'rgba(0,0,0,.2)',
      border: '1px solid rgba(76,175,82,.2)',
      borderRadius: 10,
      padding: '9px 11px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#4CAF82',
      marginBottom: 4
    }
  }, "Science Day ", ud.n, ": ", ud.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa',
      marginBottom: 6
    }
  }, ud.activity), isTeacher ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.3)',
      borderRadius: 6,
      padding: '6px 8px',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#4CAF82',
      marginBottom: 1
    }
  }, "LEVEL 1 (Mykah)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#ccc'
    }
  }, ud.l1)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.3)',
      borderRadius: 6,
      padding: '6px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#4CAF82',
      marginBottom: 1
    }
  }, "LEVEL 3-4 (Ashelyn/Kayla/Ryan)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#ccc'
    }
  }, ud.l34))) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(76,175,82,.05)',
      borderRadius: 6,
      padding: '6px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa'
    }
  }, level <= 1 ? ud.l1 : ud.l34)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(26,115,232,.08)',
      border: '1px solid rgba(26,115,232,.3)',
      borderRadius: 8,
      padding: '8px 10px',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#1A73E8',
      marginBottom: 3
    }
  }, "📄 FULL MEAL PLAN DOCUMENT"), /*#__PURE__*/React.createElement("a", {
    href: "https://docs.google.com/document/d/1gbjyGfa1GitlPQn30-YrRezEd23FU-kqdBxs0B2EVtw/edit",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontSize: 10,
      color: '#1A73E8',
      fontWeight: 700
    }
  }, "Open Two-Week Family Meal Plan in Google Drive 🔗"))));
}



