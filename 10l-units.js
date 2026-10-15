// ═══ UNITS & LESSONS BY CHILD (teacher-friendly view) ═══
function SchoolUnitsView(props) {
  var h = React.createElement, student = props.student, hook = props.hook, day = props.day;
  var oS = React.useState(null), open = oS[0], setOpen = oS[1];
  var card = { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 12, marginBottom: 10 };
  function unitsFor(sub) {
    if (sub.id === 'bible') {
      var start = 1;
      return (typeof BIBLE_UNITS !== 'undefined' ? BIBLE_UNITS : []).map(function (u) { var o = { title: 'Unit ' + u.unit + ': ' + u.title, startDay: start, endDay: start + (u.days || (u.lessons || []).length) - 1, verse: (u.keyVerses || []).join(', '), principle: u.overview, topics: (u.lessons || []).map(function (l) { return l.focus; }) }; start = o.endDay + 1; return o; });
    }
    return (typeof SUBJECT_UNITS !== 'undefined' && SUBJECT_UNITS[sub.id]) || [];
  }
  function doneIn(sub, u) { var n = 0, t = 0; for (var d = u.startDay; d <= u.endDay; d++) { t++; try { if (hook.getProgress(student.id, d, sub.id).done) n++; } catch (e) {} } return [n, t]; }
  var board = h('div', { style: card },
    h('div', { style: { fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 8 } }, '👩‍🏫 All children — Day ' + day),
    (typeof SCHOOL_STUDENTS !== 'undefined' ? SCHOOL_STUDENTS : []).map(function (s) {
      return h('div', { key: s.id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,.08)' } },
        h('div', { style: { width: 90, fontSize: 14, fontWeight: 800, color: '#fff' } }, s.emoji + ' ' + s.name),
        h('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1 } }, SUBJECTS.map(function (sub) {
          var p = {}; try { p = hook.getProgress(s.id, day, sub.id) || {}; } catch (e) {}
          var st = p.done ? '✅' : p.status === 'submitted' ? '🕓' : p.status === 'needs_redo' ? '🔁' : '⬜';
          return h('span', { key: sub.id, title: sub.l, style: { fontSize: 12, background: sub.c + '33', border: '1px solid ' + sub.c + '77', borderRadius: 10, padding: '3px 7px', color: '#fff' } }, sub.l.split(' ')[0] + ' ' + st);
        })));
    }),
    h('div', { style: { fontSize: 11, color: '#b8b8c8', marginTop: 6 } }, '✅ done · 🕓 waiting for your review · 🔁 redo · ⬜ not started'));
  return h('div', null, board,
    h('div', { style: { fontSize: 16, fontWeight: 900, color: '#fff', margin: '14px 0 8px' } }, student.emoji + ' ' + student.name + '’s units — Grade ' + (student.grade || '')),
    SUBJECTS.map(function (sub) {
      var us = unitsFor(sub);
      return h('div', { key: sub.id, style: Object.assign({}, card, { borderColor: sub.c + '77' }) },
        h('div', { style: { fontSize: 15, fontWeight: 900, color: sub.c, marginBottom: 6 } }, sub.l),
        us.length === 0 && h('div', { style: { fontSize: 13, color: '#b8b8c8' } }, 'No units listed for this subject.'),
        us.map(function (u, i) {
          var key = sub.id + i, d = doneIn(sub, u), cur = day >= u.startDay && day <= u.endDay, isOpen = open === key;
          return h('div', { key: key, style: { borderTop: '1px solid rgba(255,255,255,.08)', padding: '8px 0', background: cur ? 'rgba(76,175,130,.08)' : 'transparent' } },
            h('div', { onClick: function () { setOpen(isOpen ? null : key); }, style: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' } },
              h('div', { style: { flex: 1 } },
                h('div', { style: { fontSize: 14, fontWeight: 800, color: '#fff' } }, (cur ? '▶ ' : '') + u.title),
                h('div', { style: { fontSize: 12, color: '#b8b8c8' } }, 'Days ' + u.startDay + '–' + u.endDay + ' · ' + d[0] + '/' + d[1] + ' days done')),
              h('div', { style: { fontSize: 18, color: '#b8b8c8' } }, isOpen ? '▾' : '▸')),
            isOpen && h('div', { style: { marginTop: 8 } },
              u.verse && h('div', { style: { fontSize: 13, color: '#CE93D8' } }, '📖 ' + u.verse),
              u.principle && h('div', { style: { fontSize: 13, color: '#ddd', margin: '4px 0' } }, u.principle),
              u.activity && h('div', { style: { fontSize: 13, color: '#ddd', margin: '4px 0' } }, '✏️ ' + u.activity),
              u.resources && h('div', { style: { fontSize: 12, color: '#b8b8c8', margin: '4px 0' } }, '📚 ' + u.resources),
              (u.topics || []).map(function (t, ti) {
                var dd = u.startDay + ti, dn = false; try { dn = !!hook.getProgress(student.id, dd, sub.id).done; } catch (e) {}
                return h('button', { key: ti, onClick: function () { props.goDay(dd); }, style: { display: 'flex', width: '100%', textAlign: 'left', gap: 8, background: dn ? 'rgba(76,175,130,.12)' : 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '9px 10px', marginTop: 4, color: '#fff', fontSize: 13, cursor: 'pointer' } },
                  h('span', { style: { fontWeight: 800, minWidth: 54 } }, 'Day ' + dd), h('span', { style: { flex: 1 } }, t), h('span', null, dn ? '✅' : '›'));
              })));
        }));
    }));
}

// ═══ TEACHER SCRIPT: for the chosen day, every child's lessons with the words to say ═══
function TeacherScriptView(props) {
  var h = React.createElement, day = props.day, hook = props.hook;
  var oS = React.useState(props.student ? props.student.id : null), openId = oS[0], setOpenId = oS[1];
  var sS = React.useState({}), sub = sS[0], setSub = sS[1];
  var card = { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 12, marginBottom: 10 };
  function lessonFor(s, subject) {
    if (subject.id === 'bible') {
      var b = (typeof BIBLE_UNITS !== 'undefined' ? BIBLE_UNITS : []).flatMap(function (u) { return (u.lessons || []).map(function (l) { return Object.assign({ unit: u.title }, l); }); }).find(function (l) { return l.d === day; });
      return b ? { unit: b.unit, focus: b.focus, verse: b.verse, script: b.script, activity: b.activity, answerKey: b.answerKey } : null;
    }
    try { return typeof getLessonForDay === 'function' ? getLessonForDay(subject.id, day, s.grade) : null; } catch (e) { return null; }
  }
  var students = typeof SCHOOL_STUDENTS !== 'undefined' ? SCHOOL_STUDENTS : [];
  return h('div', null,
    h('div', { style: { fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 2 } }, '🎬 Teacher Script — Day ' + day),
    h('div', { style: { fontSize: 13, color: '#c8c8d8', marginBottom: 12 } }, 'What to say and do with each child today. Tap a child to open their day. Tap a subject for the full script.'),
    students.map(function (s) {
      var isOpen = openId === s.id, doneN = 0, totalMin = 0;
      SUBJECTS.forEach(function (x) { try { if (hook.getProgress(s.id, day, x.id).done) doneN++; } catch (e) {} totalMin += (typeof SUBJECT_TIMES !== 'undefined' && SUBJECT_TIMES[x.id]) || 30; });
      return h('div', { key: s.id, style: Object.assign({}, card, { borderColor: s.color + '99' }) },
        h('div', { onClick: function () { setOpenId(isOpen ? null : s.id); }, style: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' } },
          h('div', { style: { fontSize: 30 } }, s.emoji),
          h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 18, fontWeight: 900, color: '#fff' } }, s.name + ' — Grade ' + s.grade), h('div', { style: { fontSize: 13, color: '#b8b8c8' } }, doneN + '/' + SUBJECTS.length + ' subjects done · about ' + Math.round(totalMin / 60 * 10) / 10 + ' hours')),
          h('div', { style: { fontSize: 20, color: '#b8b8c8' } }, isOpen ? '▾' : '▸')),
        isOpen && h('div', { style: { marginTop: 10 } },
          typeof SchoolDaySchedule !== 'undefined' && h(SchoolDaySchedule, { day: day, student: s }),
          SUBJECTS.map(function (x) {
            var L = lessonFor(s, x), k = s.id + x.id, op = sub[k], mins = (typeof SUBJECT_TIMES !== 'undefined' && SUBJECT_TIMES[x.id]) || 30, st = {}; try { st = hook.getProgress(s.id, day, x.id) || {}; } catch (e) {}
            return h('div', { key: x.id, style: { border: '1px solid ' + x.c + '77', background: x.c + '12', borderRadius: 12, padding: 10, marginBottom: 8 } },
              h('div', { onClick: function () { var n = Object.assign({}, sub); n[k] = !op; setSub(n); }, style: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' } },
                h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 15, fontWeight: 900, color: x.c } }, x.l + '  ·  ' + mins + ' min'), L && h('div', { style: { fontSize: 14, color: '#fff' } }, L.focus), L && L.unit && h('div', { style: { fontSize: 12, color: '#b8b8c8' } }, 'Unit: ' + L.unit)),
                h('div', { style: { fontSize: 18 } }, st.done ? '✅' : st.status === 'submitted' ? '🕓' : st.status === 'needs_redo' ? '🔁' : '⬜'), h('div', { style: { fontSize: 16, color: '#b8b8c8' } }, op ? '▾' : '▸')),
              !L && h('div', { style: { fontSize: 13, color: '#b8b8c8', marginTop: 4 } }, 'No lesson is written for this subject on this day.'),
              op && L && h('div', { style: { marginTop: 8, fontSize: 14, color: '#eee', lineHeight: 1.6 } },
                L.verse && h('div', { style: { color: '#CE93D8', marginBottom: 4 } }, '📖 ' + L.verse),
                L.script && h('div', null, h('b', { style: { color: '#FFD54F' } }, '🎙 SAY: '), L.script),
                L.activity && h('div', { style: { marginTop: 6 } }, h('b', { style: { color: '#81C784' } }, '✏️ DO: '), L.activity),
                L.answerKey && L.answerKey.short && h('div', { style: { marginTop: 6 } }, h('b', { style: { color: '#90CAF9' } }, '🔑 ANSWER: '), L.answerKey.short),
                L.answerKey && L.answerKey.long && h('div', { style: { marginTop: 4, fontSize: 13, color: '#c8c8d8' } }, L.answerKey.long)));
          }),
          h('button', { onClick: function () { props.goStudent(s); }, style: { width: '100%', background: s.color, color: '#fff', border: 'none', borderRadius: 14, padding: 14, fontWeight: 900, fontSize: 15, cursor: 'pointer' } }, 'Open ' + s.name + '’s lessons & grading ›')));
    }));
}
