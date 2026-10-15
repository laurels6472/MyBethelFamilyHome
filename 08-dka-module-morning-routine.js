// ═══ DKA MODULE ═══
"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// ─── School Calendar Constants ─────────────────────────────────────────────────
var SCHOOL_START_DATE = '2026-10-06'; // First day of school — Tuesday Oct 6, 2026 (revised start)
var SCHOOL_END_DATE = '2027-06-29'; // 180th school day — Tuesday Jun 29, 2027 (Mon-Fri, minus the 11 holidays listed below, which are days off)
var SCHOOL_START_MS = new Date(SCHOOL_START_DATE + 'T08:00:00').getTime();

var SC_OFF_DAYS = ['2026-10-12','2026-11-11','2026-11-26','2026-11-27','2026-12-24','2026-12-25','2027-01-01','2027-01-18','2027-02-15','2027-05-10','2027-05-31'];
// Calendar date of school day n (Day 1 = Tue Oct 6, 2026; Mon-Fri, holidays are days off)
function schoolDayDate(n) {
  var d = new Date(SCHOOL_START_DATE + 'T12:00:00'), count = 0, guard = 0;
  while (guard++ < 800) {
    var dow = d.getDay();
    var ds = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    if (dow >= 1 && dow <= 5 && SC_OFF_DAYS.indexOf(ds) === -1) { count++; if (count === n) return d; }
    d.setDate(d.getDate() + 1);
  }
  return d;
}
function schoolDayLabel(n, long) {
  return schoolDayDate(n).toLocaleDateString('en-US', long ? { weekday: 'long', month: 'long', day: 'numeric' } : { weekday: 'short', month: 'short', day: 'numeric' });
}
function getSchoolDayInfo() {
  var now = new Date();
  var _p2 = function(n){ return (n<10?'0':'')+n; };
  var _ld = function(d){ return d.getFullYear()+'-'+_p2(d.getMonth()+1)+'-'+_p2(d.getDate()); };
  var todayStr = _ld(now);
  
  // Before school starts
  if(todayStr < SCHOOL_START_DATE) {
    var msUntil = new Date(SCHOOL_START_DATE + 'T08:00:00').getTime() - Date.now();
    var daysUntil = Math.ceil(msUntil / 86400000);
    return { started: false, daysUntil: daysUntil, week: 1, day: 1, dayNum: 1 };
  }
  
  // SC Federal + state holidays excluded — 2026-27 school year
  // Source: timeanddate.com — 11 holidays are days off so the kids aren't overworked
  var SC_HOLIDAYS_2026_27 = [
    '2026-10-12', // Columbus Day (day off — not celebrated, just a rest day)
    '2026-11-11', // Veterans Day
    '2026-11-26', // Thanksgiving Day
    '2026-11-27', // Day After Thanksgiving
    '2026-12-24', // Christmas Eve
    '2026-12-25', // Christmas Day
    '2027-01-01', // New Year's Day
    '2027-01-18', // Martin Luther King Jr. Day
    '2027-02-15', // Presidents' Day
    '2027-05-10', // Confederate Memorial Day (SC)
    '2027-05-31', // Memorial Day
  ];

  // Count school days elapsed (Mon-Fri only, skip weekends + SC holidays)
  var start = new Date(SCHOOL_START_DATE + 'T00:00:00');
  var today = new Date(todayStr + 'T00:00:00');
  var schoolDays = 0;
  var cur = new Date(start);
  while(cur <= today) {
    var dow = cur.getDay(); // 0=Sun, 6=Sat
    var ds = _ld(cur);
    if(dow >= 1 && dow <= 5 && SC_HOLIDAYS_2026_27.indexOf(ds) === -1) schoolDays++;
    cur.setDate(cur.getDate() + 1);
  }
  schoolDays = Math.max(1, Math.min(180, schoolDays));
  
  // Is today actually a school day?
  var todayDow = now.getDay();
  var isSchoolDay = todayDow >= 1 && todayDow <= 5;
  
  var weekNum = Math.ceil(schoolDays / 5);
  var dayNum_in_week = ((schoolDays - 1) % 5) + 1;
  
  return {
    started: true,
    isSchoolDay: isSchoolDay,
    dayNum: schoolDays,
    week: weekNum,
    day: dayNum_in_week,
    todayStr: todayStr
  };
}

// ═══ DKA 180-DAY CURRICULUM MODULE ════════════════════════════════════════════

// ── Curriculum Data ────────────────────────────────────────────────────────────
var DKA_CURRICULUM = [
// ─── WEEK 1: LIGHT ORIENTATION WEEK (Oct 6-9, 2026) ───────────────────────
// First week = getting settled, logging in, learning the routine.
// Light on writing, heavy on worship, relationship-building, and discovery.

[1, 1, 'Orientation Week', 'Welcome to My Bethel School — Day 1', null, 43, 'Give Us More Faith', 
 'TEACHER SCRIPT (ORIENTATION DAY)\nHook: Read Eccl 3:1 together — "There is an appointed time for everything." This is OUR appointed time.\nActivity: Family tour of the school app — each child logs into their accounts (Penn Foster / Khan Academy / MyBethelFamilyHome). No lesson pressure today.\nSpiritual: Daily Text together. Song #43. Family prayer specifically for the school year.\nWorship Dig Deeper: Read Ps 127:1 — "Unless Jehovah builds the house, those building it work hard for nothing." Ask: What does it mean for Jehovah to be the foundation of our school year?\nThursday CLAM: Review meeting workbook together as a family — highlight one part each person will answer at the meeting.\nGoal: Every child knows how to clock in/out, find their assignments, and use the app. Low stress, high encouragement.'],

[2, 1, 'Orientation Week', 'Setting Up Our Routine — Getting Organized', null, 73, 'Jehovah Knows', 
 'TEACHER SCRIPT (ORIENTATION DAY 2)\nHook: Ask each child — what is ONE thing they want to learn this year? Write it down.\nActivity: Set up physical school spaces. Organize notebooks, pencils, devices. Each child logs into their academic platform and finds Week 1 material. No assignments due — just explore.\nSpiritual: Daily Text. Song #73. Dig Deeper: What does it mean that "Jehovah knows"? Read Job 28:23-24. How does knowing Jehovah sees us affect how we approach our work?\nMusic Introduction: Today introduce the instrument choices — Guitar 🎸, Drums 🥁, Ukulele 🎵, Piano 🎹, Bass 🎸. Each child picks their instrument in the app. No lessons yet — just exploration.\nRoutine Focus: Walk through the daily schedule block by block. Make sure everyone knows what happens at 8am, 9am, etc. Practice the morning worship flow.'],

[3, 1, 'Orientation Week', 'First Light Lesson — Who Is Jehovah?', 'Ps 83:18; Ex 3:14-15', 2, 'Jehovah Is Your Name', 
 'TEACHER SCRIPT (FIRST REAL LESSON — KEEP IT LIGHT)\nHook: Hold up something beautiful from nature. "Who made this?" Take turns answering.\nTeach: Jehovah has a personal name. Read Psalm 83:18 together. SAY it together: JE-HO-VAH. Discuss: Why does a name matter? How does knowing His name change how we feel about Him?\nNo writing assignments today — just oral discussion. Mykah draws Jehovah\'s name on paper.\nWorship Dig Deeper: Use wol.jw.org to find the Daily Text. Read Insight on the Scriptures entry for "Jehovah" as a family — even just 2-3 paragraphs.\nMusic: First 15 min of Music Class — each child opens their instrument lesson track. Orientation to their instrument. How to hold it, what parts are called.\nAfter School: 30 min free practice — just explore the instrument. No pressure.'],

[4, 1, 'Orientation Week', 'Digging Deeper into Worship — Daily Text & Songs', null, 2, 'Jehovah Is Your Name', 
 'TEACHER SCRIPT (WORSHIP RHYTHM DAY)\nGoal: Establish the daily worship habits that will carry them through 180 days.\nMorning Worship Deep Dive: Instead of rushing through — today make worship the whole lesson.\n1. Daily Text (wol.jw.org/en/wol/h/r1/lp-e) — read it slowly, discuss what it means for TODAY.\n2. Song (jw.org/en/library/music-songs/) — learn all the words, not just the first verse.\n3. Prayer — each child prays about something specific to them.\n4. Thursday Meeting Prep: Go through the CLAM Meeting Workbook — circle answers, prepare one comment each.\n5. Watchtower Study Prep (for Sunday): Read the assigned study article together. Underline answers.\nAfter Worship: Light academics — 30 min of reading their platform. No writing.\nMusic: 30 min Music Class. Begin Lesson 1 on chosen instrument. First chord or first beat pattern.\nAfter School: 30 min practice — Lesson 1 review.'],

[5, 1, 'Orientation Week', 'Week 1 Celebration — Routine Check & Instrument Demo', null, 0, 'Child\'s Choice', 
 'TEACHER SCRIPT (WEEK 1 WRAP-UP)\nHook: Ask — what was the BEST thing about this week? What was hardest?\nWorship Celebration: Family sings together. Each child shares one thing they learned from the Daily Text this week.\nRoutine Review: Walk through the school schedule together. Is it working? Any adjustments needed?\nInstrument Demo Day: Each child shows the family what they learned so far on their instrument. Even one chord or one beat earns a standing ovation.\nNext Week Preview: "Starting Monday we begin the full 180-day curriculum. Unit 1: Jehovah Our Creator." Give each child a sense of what\'s coming.\nThursday CLAM & Sunday Watchtower: Have the meeting materials ready. Practice commenting.\nFamily Declaration: Together agree — we are running My Bethel School for Jehovah\'s glory. Eccl 12:13.'],

[6, 1, 'Jehovah Our Creator', 'The Garden of Eden — Jehovah\'s Perfect Design', 'Gen 2:8-17; Ps 37:29', 12, 'Great God, Jehovah', 'TEACHER SCRIPT — Hook: Design your perfect home — what would it have? Teach: Gen 2:8-17. Eden was purposeful — rivers, gold, trees. The one restriction was a loving warning, not a harsh rule. Depth: Is 45:18 — earth formed to be inhabited.'], [7, 1, 'Jehovah Our Creator', 'Angels — Jehovah\'s Heavenly Family', 'Job 1:6; Heb 1:7,14; Rev 12:7', 1, 'Jehovah\'s Attributes', 'TEACHER SCRIPT — Hook: Before humans existed Jehovah already had a family. Teach: Angels are spirit creatures — real persons with names and feelings. Dan 7:10 — 100 million angels. Heb 1:14 — sent to serve those who inherit salvation. Depth: Why did Jehovah give angels free will?'], [8, 1, 'Jehovah Our Creator', 'Satan — How Rebellion Began in Heaven', 'Rev 12:9; John 8:44; Ezek 28:12-17', 32, 'Take Sides With Jehovah!', 'TEACHER SCRIPT — Hook: Has anyone ever lied to you and you believed it? Teach: Ezek 28:12-17 — once perfect, became proud. Is 14:13-14 — wanted to be like the Most High. John 8:44 — did not stand in the truth. Depth: Why didn\'t Jehovah destroy Satan immediately? The sovereignty issue.'], [9, 1, 'Jehovah Our Creator', 'The Temptation and the Fall', 'Gen 3:1-7; Rom 5:12', 36, 'We Guard Our Hearts', 'TEACHER SCRIPT — Hook: Has anyone been told something untrue and believed it at first? Teach: Three tactics — doubt (exaggerate restriction), denial (you will not die), distortion (Jehovah is withholding something good). Five verbs in Gen 3:6: she saw, desired, took, ate, gave. Depth: Connect to 1 John 2:16.'], [10, 1, 'Jehovah Our Creator', 'Week 2 Review + The Seed Promise Gen 3:15', 'Gen 3:8-24; Gen 3:15; Gal 3:16', 30, 'My Father, My God and Friend', 'TEACHER SCRIPT — Hook: In the worst moment of history Jehovah gave hope. Teach: Gen 3:15 — first prophecy. Gal 3:16 — seed = Christ. Rev 12:17 — we are part of the war. Depth: Gen 3:15 is the seed from which the entire Bible grows.'], [11, 1, 'Jehovah Our Creator', 'Jehovah\'s Judgment and First Consequences', 'Gen 3:8-24; Rom 8:20-22', 130, 'Be Forgiving', 'TEACHER SCRIPT — Hook: Consequences = outcomes of sin, not revenge. Gen 3:21 — first animal death foreshadows the ransom. Mykah: draw Adam and Eve leaving the garden.'], [12, 1, 'Jehovah Our Creator', 'Cain and Abel — Two Kinds of Worship', 'Gen 4:1-16; Heb 11:4', 108, 'God\'s Loyal Love', 'TEACHER SCRIPT — Hook: Heb 11:4 — Abel offered by FAITH. The difference was what was in the heart. How do we offer our best to Jehovah today?'], [13, 1, 'Jehovah Our Creator', 'Why True Worship Matters', 'John 4:23-24; Rom 12:1', 37, 'Serving Jehovah Whole-Souled', 'TEACHER SCRIPT — True worship requires right heart + right knowledge + right action. Compare and contrast: Cain vs. Abel, religious traditions vs. Bible truth.'], [14, 1, 'Jehovah Our Creator', 'From Adam to Noah — Early Chronology', 'Gen 5:1-32; Heb 11:5', 48, 'Daily Walking With Jehovah', 'TEACHER SCRIPT — Enoch walked with God — what does that look like in a family? Chart the pre-flood patriarchs. Calculate years. Ryan: cross-reference with secular ancient history.'], [15, 1, 'Jehovah Our Creator', 'Week 3 Review + Chronology Project', 'Gen 3-5', 0, 'Child\'s Choice', 'TEACHER SCRIPT — Quiz: Name the events of creation week. Quiz: Three tactics of Satan. Project: Ashelyn completes personal project. Mykah shares drawings from this unit.'], [16, 2, 'Faithful Servants', 'Noah — Faith in Action', 'Gen 6:1-22; Heb 11:7', 7, 'Jehovah Is Our Refuge', 'TEACHER SCRIPT — Hook: Have you ever done something that nobody else understood or supported? Teach: Gen 6:1-22. Noah found favor. He obeyed in EVERY detail. Depth: How long did Noah preach? (~50 years). What did that require of his family?'], [17, 2, 'Faithful Servants', 'The Flood and Jehovah\'s Faithfulness', 'Gen 7-8; 2 Pet 2:5', 9, 'Jehovah Provides Escape', 'TEACHER SCRIPT — Hook: 40 days and nights. But 371 days total inside. Teach: How Jehovah preserved every animal kind. The rainbow covenant. Application: When Jehovah promises something, how long does He give us to believe it?'], [18, 2, 'Faithful Servants', 'After the Flood — New Beginning', 'Gen 9:1-17; Acts 17:26', 4, '\"A House Built on Sand\"', 'TEACHER SCRIPT — Teach: Gen 9 — the covenant with Noah. Blood — sacred. Life belongs to Jehovah. Depth: Gen 9:4 — foundation for Lev 17:14 and Acts 15:28-29. Ryan: research how this still applies to JW medical decisions.'], [19, 2, 'Faithful Servants', 'The Tower of Babel — One Language Divided', 'Gen 11:1-9; Acts 17:26', 3, 'Our Strength, Our Hope', 'TEACHER SCRIPT — Hook: Why would humans want to build a tower to the heavens? Teach: Gen 11:1-9 — false religion begins here. Babylon = confusion. Depth: Trace Babylon through Daniel, Revelation — it never really ended.'], [20, 2, 'Faithful Servants', 'Week 4 Review + Noah\'s Faith Portrait', 'Gen 6-11', 0, 'Child\'s Choice', 'TEACHER SCRIPT — Review: What made Noah different from his generation? Faith Portrait activity: Each child draws or writes their personal "faith portrait." What would YOU be known for in your generation?']];

// Generate remaining days (21-180) as framework entries
for (var _d = 21; _d <= 180; _d++) {
  var _unit = Math.min(9, Math.ceil(_d / 20));
  var _unitNames = ['', 'Jehovah Our Creator', 'Faithful Servants', 'Family, Faith & Forgiveness', 'Moses & Birth of a Nation', "Jehovah's Law & True Worship", 'The Promised Land', 'Kings & Prophets', 'The Prophets', 'The Messiah & the Kingdom'];
  var _wk = Math.ceil(_d / 5);
  var _dy = (_d - 1) % 5 + 1;
  var _titles = {
    21: 'Abraham — Called to Leave Everything',
    22: 'Abraham\'s Faith Tested',
    23: 'Isaac — Child of Promise',
    24: 'Jacob — Becoming Israel',
    25: 'Week 5 Review',
    26: 'Joseph — Betrayed by Brothers',
    27: 'Joseph in Egypt — Integrity Under Pressure',
    28: 'Joseph Reveals Himself',
    29: 'The 12 Tribes Begin',
    30: 'Week 6 Review',
    31: 'Moses — Birth and Early Life',
    32: 'The Burning Bush',
    33: 'The Ten Plagues Begin',
    34: 'Plagues 6-10 + Passover',
    35: 'Week 7 Review',
    36: 'The Exodus — Leaving Egypt',
    37: 'Crossing the Red Sea',
    38: 'Wilderness — Manna and Water',
    39: 'The Ten Commandments',
    40: 'Week 8 Review',
    41: 'The Tabernacle',
    42: 'The Golden Calf',
    43: 'Spies in Canaan',
    44: '40 Years in the Wilderness',
    45: 'Week 9 Review',
    46: 'Joshua — Crossing the Jordan',
    47: 'Jericho Falls',
    48: 'Conquering the Land',
    49: 'Dividing the Land',
    50: 'Week 10 Review',
    51: 'Judges — Othniel & Deborah',
    52: 'Gideon\'s Faith',
    53: 'Samson',
    54: 'Ruth\'s Loyalty',
    55: 'Week 11 Review',
    56: 'Samuel — Last Judge, First Prophet',
    57: 'Israel Demands a King',
    58: 'Saul — A Promising Beginning',
    59: 'David & Goliath',
    60: 'Week 12 Review',
    61: 'David Becomes King',
    62: 'David & Bathsheba — Consequences of Sin',
    63: 'Solomon\'s Wisdom',
    64: 'The Temple Built',
    65: 'Week 13 Review',
    66: 'The Kingdom Divides',
    67: 'Elijah vs. Baal Prophets',
    68: 'Elisha\'s Miracles',
    69: 'Jehu\'s Reforms',
    70: 'Week 14 Review',
    71: 'Isaiah — Prophesying the Messiah',
    72: 'Isaiah\'s Vision of Peace',
    73: 'Jeremiah — The Weeping Prophet',
    74: 'Lamentations',
    75: 'Week 15 Review',
    76: 'Ezekiel\'s Visions',
    77: 'Daniel in Babylon',
    78: 'Daniel and the Lions',
    79: 'Nebuchadnezzar\'s Dream',
    80: 'Week 16 Review',
    81: 'Esther — Courage Under Pressure',
    82: 'Nehemiah Rebuilds the Wall',
    83: 'Ezra and the Return',
    84: 'Malachi — God\'s Final OT Message',
    85: 'Week 17 Review',
    86: 'Between the Testaments',
    87: 'John the Baptist',
    88: 'Jesus\' Birth and Early Life',
    89: 'Jesus\' Baptism and Temptation',
    90: 'Week 18 Review',
    91: 'Jesus Begins His Ministry',
    92: 'The Sermon on the Mount',
    93: 'Jesus\' Miracles',
    94: 'The Parables',
    95: 'Week 19 Review',
    96: 'Opposition Grows',
    97: 'Peter\'s Confession',
    98: 'The Transfiguration',
    99: 'Zacchaeus and the Tax Collector',
    100: 'Week 20 Review — HALFWAY CELEBRATION',
    101: 'Palm Sunday',
    102: 'Cleansing the Temple',
    103: 'The Last Supper',
    104: 'Gethsemane and Arrest',
    105: 'Week 21 Review',
    106: 'The Trial',
    107: 'The Crucifixion',
    108: 'The Resurrection',
    109: 'Appearances After Resurrection',
    110: 'Week 22 Review',
    111: 'Pentecost 33 CE',
    112: 'Early Christian Congregation',
    113: 'Stephen — First Martyr',
    114: 'Philip and the Ethiopian',
    115: 'Week 23 Review',
    116: 'Saul Becomes Paul',
    117: 'Paul\'s First Missionary Journey',
    118: 'Paul\'s Second Journey',
    119: 'Paul\'s Third Journey',
    120: 'Week 24 Review',
    121: 'Romans — Righteousness by Faith',
    122: 'Corinthians — Love Chapter',
    123: 'Galatians — Christian Freedom',
    124: 'Ephesians — Spiritual Armor',
    125: 'Week 25 Review',
    126: 'Philippians — Joy in Prison',
    127: 'Colossians — Christ the Head',
    128: 'Thessalonians — Resurrection Hope',
    129: 'Timothy & Titus — Congregation Order',
    130: 'Week 26 Review',
    131: 'Hebrews — Better Covenant',
    132: 'James — Faith in Action',
    133: 'Peter — Suffering and Hope',
    134: 'John\'s Letters — Love',
    135: 'Week 27 Review',
    136: 'Revelation — Letters to 7 Congregations',
    137: 'Revelation — Seals and Trumpets',
    138: 'Revelation — The Woman and the Dragon',
    139: 'Revelation — Babylon Falls',
    140: 'Week 28 Review',
    141: 'Revelation — Armageddon',
    142: 'Revelation — The Millennium',
    143: 'Revelation — New Heavens New Earth',
    144: 'Revelation — The New Jerusalem',
    145: 'Week 29 Review',
    146: 'Paradise Earth — What the Bible Promises',
    147: 'The Resurrection — Who & When',
    148: 'The Memorial — Why We Observe It',
    149: 'The Ransom — Its Full Meaning',
    150: 'Week 30 Review',
    151: 'Jehovah\'s Name Sanctified',
    152: 'The Kingdom — God\'s Government',
    153: '144,000 — The Heavenly Class',
    154: 'The Great Crowd — Earthly Hope',
    155: 'Week 31 Review',
    156: 'The Faithful Slave — Spiritual Food',
    157: 'Congregation Organization',
    158: 'Disfellowshipping — Mercy and Justice',
    159: 'Neutrality — Why JWs Don\'t Vote',
    160: 'Week 32 Review',
    161: 'Blood — The Sacred Life Force',
    162: 'Higher Education — JW Perspective',
    163: 'Holidays — Why We Don\'t Celebrate',
    164: 'The Cross vs. The Stake',
    165: 'Week 33 Review',
    166: 'Creation — Scientific Evidence',
    167: 'Evolution — A Faith-Strengthening Response',
    168: 'Was It Designed? Deep Dive',
    169: 'The Age of the Earth — Bible View',
    170: 'Week 34 Review',
    171: 'Field Service — Our Ministry',
    172: 'Return Visits and Bible Studies',
    173: 'Public Talk and Meetings',
    174: 'Regional Convention Preparation',
    175: 'Week 35 Review',
    176: 'Year Review — Unit 1-3',
    177: 'Year Review — Unit 4-6',
    178: 'Year Review — Unit 7-9',
    179: 'Personal Faith Portfolio Presentations',
    180: 'Graduation Day — Celebration & Commissioning'
  };
  DKA_CURRICULUM.push([_d, _unit, _unitNames[_unit], _titles[_d] || 'Day ' + _d + ' — See Teacher Script', 'See 180-day document', 0, 'Child\'s Choice', 'TEACHER SCRIPT — Use 4-layer method: Hook → Foundation → Building → Depth.\nRefer to the Discovering Kids Academy 180-Day Teacher Script Document for full lecture content for Day ' + _d + '.\n\nStandard structure:\n• Hook (3-5 min): Make it relevant and engaging\n• Foundation (7-8 min): Core truth for all levels\n• Building (10-12 min): Open Bibles, read together\n• Depth (8-10 min): Research for Ryan & Kayla\n• Application: One question per child']);
}
var DKA_UNITS = {
  1: 'Jehovah Our Creator',
  2: 'Faithful Servants',
  3: 'Family, Faith & Forgiveness',
  4: 'Moses & Birth of a Nation',
  5: "Jehovah's Law & True Worship",
  6: 'The Promised Land',
  7: 'Kings & Prophets',
  8: 'The Prophets',
  9: 'The Messiah & the Kingdom'
};
var DKA_BLOCKS = [
  {t:'7:45-8:00',  l:'🧩 Morning Puzzle Time',   s:'Puzzle book · Word search · Crossword · Sudoku — settle in at the table while waiting for school to start', c:'#9C8DC4'},
  {t:'8:00-8:20',  l:'🌅 Morning Worship',       s:'Daily Text · Song · Prayer · Dig Deeper discussion', c:'#F6BF26'},
  {t:'8:20-9:00',  l:'📖 Bible Lecture',         s:'All together · One room · 4 layers',                  c:'#7986CB'},
  {t:'9:00-9:30',  l:'✏️ Level Assignments',     s:'Independent work · 30 min',                           c:'#4CAF82'},
  {t:'9:30-9:45',  l:'🔄 Reconvene',             s:"What I found · Where · How I'll apply it",            c:'#1A73E8'},
  {t:'9:45-10:00', l:'🍎 Snack + Movement',      s:'Water · Snack · Stretch · 15 min',                    c:'#EF5350'},
  {t:'10:00-10:25',l:'✏️ Reading & Handwriting', s:'All children · 25 min every day',                     c:'#33B679'},
  {t:'10:25-12:10',l:'📚 Independent Academics', s:'Ryan & Kayla: Penn Foster · Ashelyn: Khan · Mykah: Khan + Reading', c:'#9E69AF'},
  {t:'12:10-12:40',l:'🎵 Music Class',           s:'Instrument lesson · Chords · Rhythm · 30 min',        c:'#E91E63'},
  {t:'12:40-1:00', l:'🗓 Wrap-Up + Meal Plan',   s:"Organize materials · Plan tomorrow's dinner",          c:'#9E9E9E'},
  {t:'1:00-1:30',  l:'🎸 Music Practice',         s:'After school · 30 min · Continue where you left off', c:'#AD1457'},
  {t:'1:30 PM+',   l:'🏡 Chores & Life Skills',  s:'Science Kitchen + Home management',                   c:'#795548'},
];

var DKA_STUDENT_TASKS = {
  ryan: 'Read all scriptures + build research chain (scripture → cross-ref → Insight → Watchtower). Write weekly research paper 2-3 pages. Peer review Kayla\'s essay. Teach one concept to Mykah.',
  kayla: 'Read scriptures + Insight on the Scriptures entry. Write 2-paragraph essay daily. Proofread Ashelyn\'s work. Find one Watchtower article on wol.jw.org.',
  ashelyn: 'Read scriptures. Write 5 complete-sentence answers. Define 5 vocabulary words. Find one jw.org article (3-sentence summary). Grammar: subject and predicate in 3 scripture sentences.',
  mykah: 'Listen to lecture. Oral narration: "Today I learned that Jehovah..." Draw one scene from the lesson. Practice memory verse. Reading block: 15 min phonics + 15 min leveled reader.'
};

// ─── School Attendance Clock ──────────────────────────────────────────────────
function SchoolAttendanceClock(_ref) {
  var personId = _ref.personId,
    isAdmin = _ref.isAdmin,
    family = _ref.family;
  var today = new Date().toISOString().split('T')[0];
  var storeKey = 'school_attend_' + today;
  var _React$useState = React.useState(function () {
      try {
        var fb = syncGet('school_attendance/' + today);
        if (fb) return fb;
        return JSON.parse(localStorage.getItem(storeKey) || '{}');
      } catch (_unused) {
        return {};
      }
    }),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    records = _React$useState2[0],
    setRecords = _React$useState2[1];
  var _React$useState3 = React.useState(null),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    editingPid = _React$useState4[0],
    setEditingPid = _React$useState4[1];
  var _React$useState5 = React.useState(''),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    editIn = _React$useState6[0],
    setEditIn = _React$useState6[1];
  var _React$useState7 = React.useState(''),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    editOut = _React$useState8[0],
    setEditOut = _React$useState8[1];
  var _React$useState9 = React.useState(''),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    note = _React$useState0[0],
    setNote = _React$useState0[1];
  React.useEffect(function () {
    var unsub = syncOn('school_attendance/' + today, function (d) {
      if (d && _typeof(d) === 'object') {
        setRecords(d);
        try {
          localStorage.setItem(storeKey, JSON.stringify(d));
        } catch (_unused2) {}
      }
    });
    return function () {
      if (unsub) unsub();
    };
  }, [today]);
  function save(next) {
    setRecords(next);
    try {
      localStorage.setItem(storeKey, JSON.stringify(next));
    } catch (_unused3) {}
    syncSet('school_attendance/' + today, next);
  }
  function clockIn(pid) {
    var _find;
    var now = new Date();
    var timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    var next = _objectSpread(_objectSpread({}, records), {}, _defineProperty({}, pid, _objectSpread(_objectSpread({}, records[pid] || {}), {}, {
      clockIn: timeStr,
      clockInTs: Date.now(),
      clockOut: null,
      clockOutTs: null
    })));
    save(next);
    if (window._sendNotif) window._sendNotif(((_find = (family || DEFAULT_FAMILY).find(function (p) {
      return p.id === pid;
    })) === null || _find === void 0 ? void 0 : _find.name) + ' clocked in to school', timeStr);
  }
  function clockOut(pid) {
    var now = new Date();
    var timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    var r = records[pid] || {};
    var mins = r.clockInTs ? Math.round((Date.now() - r.clockInTs) / 60000) : 0;
    var next = _objectSpread(_objectSpread({}, records), {}, _defineProperty({}, pid, _objectSpread(_objectSpread({}, r), {}, {
      clockOut: timeStr,
      clockOutTs: Date.now(),
      duration: mins
    })));
    save(next);
  }
  function deleteRecord(pid) {
    if (!window._safeConfirm('Delete school record for this student today?')) return;
    var next = _objectSpread({}, records);
    delete next[pid];
    save(next);
  }
  function saveEdit(pid) {
    var r = records[pid] || {};
    var inTs = editIn ? new Date(today + 'T' + editIn).getTime() : r.clockInTs;
    var outTs = editOut ? new Date(today + 'T' + editOut).getTime() : r.clockOutTs;
    var mins = inTs && outTs ? Math.round((outTs - inTs) / 60000) : r.duration;
    var inStr = editIn ? new Date(inTs).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) : r.clockIn;
    var outStr = editOut ? new Date(outTs).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) : r.clockOut;
    var next = _objectSpread(_objectSpread({}, records), {}, _defineProperty({}, pid, _objectSpread(_objectSpread({}, r), {}, {
      clockIn: inStr,
      clockInTs: inTs,
      clockOut: outStr,
      clockOutTs: outTs,
      duration: mins,
      adminNote: note || r.adminNote
    })));
    save(next);
    setEditingPid(null);
    setEditIn('');
    setEditOut('');
    setNote('');
  }
  var students = (family || DEFAULT_FAMILY).filter(function (p) {
    return ['ryan', 'kayla', 'ashelyn', 'mykah'].includes(p.id);
  });
  var iStyle = {
    background: 'rgba(255,255,255,.07)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 8,
    padding: '6px 10px',
    color: '#fff',
    fontSize: 12
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#9C8DC4',
      letterSpacing: 1,
      marginBottom: 8,
      padding: '0 2px'
    }
  }, "\uD83D\uDCCB SCHOOL ATTENDANCE \u2014 ", today), students.map(function (s) {
    var r = records[s.id] || {};
    var isIn = !!r.clockIn && !r.clockOut;
    var isDone = !!r.clockIn && !!r.clockOut;
    var isEditing = editingPid === s.id;
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        marginBottom: 6,
        background: "".concat(s.color, "10"),
        border: "1px solid ".concat(s.color, "33"),
        borderRadius: 12,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20
      }
    }, s.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 800,
        color: '#fff'
      }
    }, s.name), isDone && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#4CAF82'
      }
    }, "\u2713 ", r.clockIn, " \u2192 ", r.clockOut, " (", r.duration, "min)"), isIn && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#FF9800'
      }
    }, "\uD83D\uDFE1 In since ", r.clockIn), !isIn && !isDone && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: 'rgba(255,255,255,.3)'
      }
    }, "Not clocked in")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5,
        flexShrink: 0
      }
    }, !isIn && !isDone && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return clockIn(s.id);
      },
      style: {
        padding: '5px 10px',
        background: 'rgba(76,175,82,.2)',
        color: '#4CAF82',
        border: '1px solid rgba(76,175,82,.3)',
        borderRadius: 20,
        fontSize: 9,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, "Clock In"), isIn && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return clockOut(s.id);
      },
      style: {
        padding: '5px 10px',
        background: 'rgba(239,83,80,.15)',
        color: '#EF5350',
        border: '1px solid rgba(239,83,80,.3)',
        borderRadius: 20,
        fontSize: 9,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, "Clock Out"), isAdmin && (isIn || isDone) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setEditingPid(isEditing ? null : s.id);
        setNote(r.adminNote || '');
      },
      style: {
        padding: '5px 8px',
        background: 'rgba(192,202,51,.1)',
        color: '#C0CA33',
        border: '1px solid rgba(192,202,51,.25)',
        borderRadius: 20,
        fontSize: 9,
        cursor: 'pointer'
      }
    }, "\u270F\uFE0F"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return deleteRecord(s.id);
      },
      style: {
        padding: '5px 8px',
        background: 'rgba(239,83,80,.08)',
        color: '#EF5350',
        border: '1px solid rgba(239,83,80,.2)',
        borderRadius: 20,
        fontSize: 9,
        cursor: 'pointer'
      }
    }, "\uD83D\uDDD1")))), isAdmin && isEditing && /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid rgba(255,255,255,.05)',
        padding: '10px 12px',
        background: 'rgba(0,0,0,.2)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#C0CA33',
        fontWeight: 800,
        marginBottom: 7
      }
    }, "ADMIN EDIT"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 6,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#555',
        marginBottom: 2
      }
    }, "Clock In Time"), /*#__PURE__*/React.createElement("input", {
      type: "time",
      value: editIn,
      onChange: function onChange(e) {
        return setEditIn(e.target.value);
      },
      style: _objectSpread(_objectSpread({}, iStyle), {}, {
        width: '100%'
      })
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#555',
        marginBottom: 2
      }
    }, "Clock Out Time"), /*#__PURE__*/React.createElement("input", {
      type: "time",
      value: editOut,
      onChange: function onChange(e) {
        return setEditOut(e.target.value);
      },
      style: _objectSpread(_objectSpread({}, iStyle), {}, {
        width: '100%'
      })
    }))), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: note,
      onChange: function onChange(e) {
        return setNote(e.target.value);
      },
      placeholder: "Admin note (optional)",
      style: _objectSpread(_objectSpread({}, iStyle), {}, {
        width: '100%',
        marginBottom: 7
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return saveEdit(s.id);
      },
      style: {
        flex: 1,
        background: '#C0CA33',
        color: '#000',
        border: 'none',
        borderRadius: 20,
        padding: '7px',
        fontWeight: 800,
        fontSize: 11,
        cursor: 'pointer'
      }
    }, "Save Changes"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setEditingPid(null);
        setEditIn('');
        setEditOut('');
        setNote('');
      },
      style: {
        padding: '7px 12px',
        background: 'rgba(255,255,255,.06)',
        color: '#aaa',
        border: 'none',
        borderRadius: 20,
        fontSize: 10,
        cursor: 'pointer'
      }
    }, "Cancel"))));
  }));
}

// ─── DKA Curriculum Module (full 180 days) ───────────────────────────────────
// ── Field Trip Day Lookup ─────────────────────────────────────────────────────
var FIELD_TRIP_DAYS_MAP = {
  // ALL FREE, all within 25-30 miles of Fort Mill, SC (York County)
  20:  {dest:'Glencairn Garden — Rock Hill, SC (~10 mi)',          scripture:'Psalm 104:14',      theme:'Free public botanical garden. Study plant biology, Jehovah\'s creation, seasonal blooms. Sketch 3 plants in nature journals.', miles:10},
  40:  {dest:'Crowders Mountain State Park — Kings Mountain, NC (~25 mi)', scripture:'Psalm 104:18', theme:'Free hiking trails, summit views, geology study. Discuss how mountains declare Jehovah\'s power. Bring water and snacks.', miles:25},
  60:  {dest:'McDowell Nature Preserve — Charlotte, NC (~22 mi)',  scripture:'Job 12:7-9',        theme:'Free nature trails, creek exploration, bird watching. Study Jehovah\'s design in ecosystems. Bring bug nets.', miles:22},
  80:  {dest:'Latta Nature Preserve — Huntersville, NC (~20 mi)',  scripture:'Genesis 1:25',      theme:'Free trails, farm animals, historic site. Study animal care, history, and Jehovah as creator of every living thing.', miles:20},
  100: {dest:'Lake Wylie / Ebenezer Park Trail — York Co, SC (~15 mi)', scripture:'Psalm 46:4',   theme:'Free lakeside nature walk, water science, water cycle study. Discuss how Jehovah provides water for all living things.', miles:15},
  120: {dest:'Reedy Creek Nature Preserve — Charlotte, NC (~23 mi)',scripture:'Isaiah 43:19-20',  theme:'Free 7-mile trail system, creek, nature center. Winter nature study — what survives, what sleeps? Creation science.', miles:23},
  140: {dest:'Landsford Canal State Park — Chester, SC (~28 mi)',  scripture:'Ecclesiastes 1:7',  theme:'Free hiking, historic canal, Catawba River. Study water, history, and Jehovah\'s wisdom in how people used rivers.', miles:28},
  160: {dest:'Freedom Park & Little Sugar Creek — Charlotte, NC (~20 mi)', scripture:'Psalm 36:9', theme:'Free urban greenway, creek exploration, spring nature study. Identify spring wildflowers and record in journals.', miles:20},
  175: {dest:'White Memorial Nature Preserve — Fort Mill, SC (~5 mi)', scripture:'Philippians 4:4', theme:'Year-end celebration walk at the closest free nature preserve. Thank Jehovah for the school year. Picnic and reflection.', miles:5},
};

function DKAModuleFull(_ref2) {
  var isTeacher = _ref2.isTeacher,
    isAdmin = _ref2.isAdmin,
    personId = _ref2.personId,
    family = _ref2.family;
  // Auto-calculate today's school week/day from Oct 6, 2026 start date
  var _schoolInfo = (typeof getSchoolDayInfo === 'function') ? getSchoolDayInfo() : {started:false,week:1,day:1,dayNum:1};
  var _savedState = {};
  try { _savedState = JSON.parse(localStorage.getItem('dka_state')||'{}'); } catch {}
  // Admin uses saved/manual position; children auto-lock to today
  var _initWeek = _schoolInfo.week || 1;
  var _initDay  = _schoolInfo.day  || 1;
  var _React$useState1 = React.useState(_initWeek),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    week = _React$useState10[0],
    setWeek = _React$useState10[1];
  var _React$useState11 = React.useState(_initDay),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    day = _React$useState12[0],
    setDay = _React$useState12[1];
  var _React$useState13 = React.useState('plan'),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    view = _React$useState14[0],
    _setViewRaw = _React$useState14[1];
  var _hist = React.useRef([]);
  function setView(v) { if (v === view) return; _hist.current.push(view); _setViewRaw(v); try { window.scrollTo(0, 0); } catch (e) {} }
  function backView() { var p = _hist.current.pop(); if (p) { _setViewRaw(p); try { window.scrollTo(0, 0); } catch (e) {} } }
  var _React$useState15 = React.useState(false),
    _React$useState16 = _slicedToArray(_React$useState15, 2),
    showScript = _React$useState16[0],
    setShowScript = _React$useState16[1];
  function persist(w, d) { /* browsing no longer saved — the app always opens on today's school day */ }
  function _clampNav(w, d) {
    if (!isTeacher) {
      var t = (typeof getSchoolDayInfo === 'function') ? getSchoolDayInfo().dayNum : 1;
      if ((w - 1) * 5 + d > t) { w = Math.ceil(t / 5); d = ((t - 1) % 5) + 1; }
    }
    return [w, d];
  }
  function goWeek(dir) {
    var r = _clampNav(Math.max(1, Math.min(36, week + dir)), day);
    setWeek(r[0]); setDay(r[1]);
  }
  function goDay(dir) {
    var r = _clampNav(week, Math.max(1, Math.min(5, day + dir)));
    setWeek(r[0]); setDay(r[1]);
  }
  function jumpToday() {
    var i = (typeof getSchoolDayInfo === 'function') ? getSchoolDayInfo() : {week:1, day:1};
    setWeek(i.week || 1); setDay(i.day || 1);
  }
  var dayNum = (week - 1) * 5 + day;
  var _ft = (typeof FIELD_TRIP_DAYS_MAP !== 'undefined') ? (FIELD_TRIP_DAYS_MAP[dayNum] || null) : null;
  var isFieldTrip = !!_ft;
  var entry = _ft
    ? [dayNum, 0, 'FIELD TRIP', '🚌 ' + _ft.dest, _ft.scripture, 151, 'He-Will-Call', _ft.theme]
    : DKA_CURRICULUM[dayNum - 1] || DKA_CURRICULUM[DKA_CURRICULUM.length - 1];
  var unitNum = entry[1];
  var unitTitle = DKA_UNITS[unitNum] || '';
  var title = entry[3];
  var scripture = entry[4];
  var songNum = entry[5];
  var songSlug = entry[6];
  var script = (!_ft && typeof scScriptFor === 'function') ? scScriptFor(dayNum, entry[7]) : entry[7];
  var pct = Math.round(dayNum / 180 * 100);
  // ── Child lesson lock: kids see yesterday's lesson, not today's ──────────
  // Teachers/admins always see today. Children must wait until the NEXT day.
  var todaySchoolDayNum = (typeof getSchoolDayInfo === 'function')
    ? getSchoolDayInfo().dayNum : dayNum;
  // Children see TODAY's lesson on the actual day — cannot peek AHEAD at future days
  var lessonLocked = !isTeacher && (dayNum > todaySchoolDayNum);
  // If navigated to a future day, show current day's entry instead
  var visibleEntry = lessonLocked
    ? (DKA_CURRICULUM[todaySchoolDayNum - 1] || DKA_CURRICULUM[0])
    : entry;
  var visibleTitle    = visibleEntry[3];
  var visibleScripture= visibleEntry[4];
  var visibleSongNum  = visibleEntry[5];
  var iStyle = {
    background: 'rgba(255,255,255,.07)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 8,
    padding: '6px 10px',
    color: '#fff',
    fontSize: 12,
    width: '100%'
  };
  var VIEWS = isTeacher ? [{
    id: 'plan',
    l: '🎯 Today'
  }, {
    id: 'schedule',
    l: '⏰ Schedule'
  }, {
    id: 'manual',
    l: '📖 Teacher Manual'
  }, {
    id: 'teacher',
    l: '📋 Today\'s Script'
  }, {
    id: 'worship',
    l: '✨ Worship'
  }, {
    id: 'levels',
    l: '✍️ Assignments'
  }, {
    id: 'music',
    l: '🎵 Music'
  }, {
    id: 'attendance',
    l: '📋 Attendance'
  }] : [{
    id: 'plan',
    l: '🎯 Today'
  }, {
    id: 'schedule',
    l: '⏰ Schedule'
  }, {
    id: 'worship',
    l: '✨ Worship'
  }, {
    id: 'levels',
    l: '✍️ My Work'
  }, {
    id: 'attendance',
    l: '📋 Attendance'
  }];
  // Pre-school gate: children see countdown until Oct 6 2026
  if(!isTeacher && !_schoolInfo.started) {
    var dUntil = _schoolInfo.daysUntil || 5;
    return /*#__PURE__*/React.createElement("div", {style:{padding:30,textAlign:"center",background:"rgba(156,141,196,.05)",border:"1px solid rgba(156,141,196,.15)",borderRadius:16,margin:16}},
      /*#__PURE__*/React.createElement("div",{style:{fontSize:48,marginBottom:12}},"\uD83D\uDCDA"),
      /*#__PURE__*/React.createElement("div",{style:{fontSize:18,fontWeight:900,color:"#9C8DC4",marginBottom:6}},"School Starts Soon!"),
      /*#__PURE__*/React.createElement("div",{style:{fontSize:13,color:"#fff",fontWeight:800,marginBottom:4}},"First Day: Tuesday, October 6, 2026"),
      /*#__PURE__*/React.createElement("div",{style:{fontSize:36,fontWeight:900,color:"#F6BF26",margin:"12px 0",letterSpacing:2}},dUntil + (dUntil===1?" Day":" Days") + " to go!"),
      /*#__PURE__*/React.createElement("div",{style:{fontSize:11,color:"rgba(255,255,255,.4)",lineHeight:1.7}},"The curriculum unlocks automatically on Monday morning. Get some rest!")
    );
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 40
    }
  }, (typeof MeetingMaterialPanel === 'function') ? React.createElement("div", {style:{padding:'10px 14px 0'}}, React.createElement(MeetingMaterialPanel, {compact:true})) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px',
      background: 'rgba(156,141,196,.08)',
      borderBottom: '1px solid rgba(156,141,196,.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: '#9C8DC4'
    }
  }, "\uD83C\uDF3F DKA School"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.3)'
    }
  }, "Discovering Kids Academy")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      color: '#9C8DC4'
    }
  }, pct, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: 'rgba(255,255,255,.3)'
    }
  }, "Day ", dayNum, "/180"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: 'rgba(255,255,255,.06)',
      borderRadius: 2,
      overflow: 'hidden',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: pct + '%',
      background: 'linear-gradient(90deg,#9C8DC4,#B8860B)',
      borderRadius: 2,
      transition: 'width .3s'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      goWeek(-1);
    },
    style: {
      background: 'rgba(255,255,255,.08)',
      border: 'none',
      color: '#aaa',
      borderRadius: 20,
      padding: '4px 10px',
      cursor: 'pointer',
      fontSize: 11
    }
  }, "\u2039 Wk"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#fff'
    }
  }, "School Day ", dayNum, " of 180 \xB7 ", schoolDayLabel(dayNum, true)), /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: '#fff', opacity: .6 } }, "Week ", week, " \xB7 Day ", day, " of the week", dayNum === _schoolInfo.dayNum ? " \u00B7 TODAY" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#9C8DC4'
    }
  }, "Unit ", unitNum, " \u2014 ", unitTitle), (week !== (_schoolInfo.week||1) || day !== (_schoolInfo.day||1)) && /*#__PURE__*/React.createElement("button", {
    onClick: jumpToday,
    style: { marginTop: 3, background: '#F6BF26', color: '#000', border: 'none', borderRadius: 20, fontSize: 9, fontWeight: 900, padding: '3px 10px', cursor: 'pointer' }
  }, "\uD83D\uDCCD Jump to Today (Week " + (_schoolInfo.week||1) + " \u00B7 Day " + (_schoolInfo.day||1) + ")")), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      goWeek(1);
    },
    style: {
      background: 'rgba(255,255,255,.08)',
      border: 'none',
      color: '#aaa',
      borderRadius: 20,
      padding: '4px 10px',
      cursor: 'pointer',
      fontSize: 11
    }
  }, "Wk \u203A")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 8,
      marginTop: 6
    }
  }, [1, 2, 3, 4, 5].map(function (d) {
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: function onClick() {
        return goDay(d - day);
      },
      style: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        fontSize: 11,
        fontWeight: 800,
        background: day === d ? '#9C8DC4' : 'rgba(255,255,255,.08)',
        color: day === d ? '#fff' : '#888',
        width: 52, height: 40, borderRadius: 12, lineHeight: 1.15,
        outline: ((week - 1) * 5 + d === _schoolInfo.dayNum) ? '2px solid #F6BF26' : 'none'
      }
    }, "Day " + d, React.createElement("br"), React.createElement("span", { style: { fontSize: 8, fontWeight: 600 } }, schoolDayDate((week - 1) * 5 + d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      overflowX: 'auto',
      borderBottom: '1px solid rgba(255,255,255,.06)'
    }
  }, VIEWS.map(function (v) {
    return /*#__PURE__*/React.createElement("button", {
      key: v.id,
      onClick: function onClick() {
        return setView(v.id);
      },
      style: {
        flex: '1 0 auto',
        whiteSpace: 'nowrap',
        padding: '13px 10px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: view === v.id ? '#9C8DC4' : 'rgba(255,255,255,.3)',
        fontSize: 12,
        fontWeight: view === v.id ? 800 : 500,
        borderBottom: view === v.id ? '2px solid #9C8DC4' : '2px solid transparent'
      }
    }, v.l);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14
    }
  }, (_hist.current.length > 0 && view !== 'plan') ? React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 12 } }, React.createElement('button', { onClick: backView, style: { background: '#9C8DC4', color: '#000', border: 'none', borderRadius: 14, padding: '12px 16px', fontWeight: 900, fontSize: 15, cursor: 'pointer' } }, '‹ Back'), React.createElement('button', { onClick: function () { setView('plan'); }, style: { background: 'rgba(255,255,255,.12)', color: '#fff', border: 'none', borderRadius: 14, padding: '12px 16px', fontWeight: 900, fontSize: 15, cursor: 'pointer' } }, '🎯 Today'), React.createElement('button', { onClick: function () { setView('schedule'); }, style: { background: 'rgba(255,255,255,.12)', color: '#fff', border: 'none', borderRadius: 14, padding: '12px 16px', fontWeight: 900, fontSize: 15, cursor: 'pointer' } }, '⏰ Schedule')) : null, view === 'manual' && isTeacher && (typeof TeacherManual === 'function') && React.createElement(TeacherManual, { dayNum: dayNum, today: todaySchoolDayNum }), view === 'plan' && (typeof TeachingPlan === 'function') && React.createElement(TeachingPlan, { isTeacher: !!isTeacher, personId: personId, kids: (family || DEFAULT_FAMILY).filter(function (p) { return ['ryan', 'kayla', 'ashelyn', 'mykah'].includes(p.id) && (isTeacher || p.id === personId); }), views: VIEWS.map(function (v) { return v.id; }), setView: setView, dayNum: dayNum, title: lessonLocked ? visibleTitle : title, scripture: lessonLocked ? visibleScripture : scripture, songNum: songNum, script: script, unitTitle: unitTitle, blocks: DKA_BLOCKS, tasks: DKA_STUDENT_TASKS }), view === 'schedule' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10,
      background: 'rgba(156,141,196,.08)',
      border: '1px solid rgba(156,141,196,.2)',
      borderRadius: 10,
      padding: '10px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#9C8DC4',
      fontWeight: 800,
      marginBottom: 3
    }
  }, "TODAY'S LESSON"),
  lessonLocked && /*#__PURE__*/React.createElement("span", {
    style:{marginLeft:6,fontSize:8,background:'rgba(255,152,0,.15)',color:'#FF9800',
      border:'1px solid rgba(255,152,0,.3)',borderRadius:20,padding:'2px 7px',fontWeight:800}
  }, "🔒 Future Lesson — Not Yet Available"),
  /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: '#fff',
      marginBottom: 2
    }
  }, lessonLocked ? visibleTitle : title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'rgba(255,255,255,.4)'
    }
  }, lessonLocked ? visibleScripture : scripture), songNum > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#B8860B',
      marginTop: 4
    }
  }, "\uD83C\uDFB5 Song #", songNum)), DKA_BLOCKS.map(function (b, i) {
    var _goV = (typeof scBlockView === 'function') ? scBlockView(b.l, VIEWS.map(function (v) { return v.id; })) : null;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: function () { if (_goV) setView(_goV); else if (/independent/i.test(b.l) && typeof scOpen === 'function') scOpen('https://classroom.google.com'); },
      style: {
        cursor: (_goV || /independent/i.test(b.l)) ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 10,
        marginBottom: 5,
        border: '1px solid rgba(255,255,255,.06)',
        background: 'rgba(255,255,255,.02)',
        borderLeftColor: b.c,
        borderLeftWidth: 3,
        borderLeftStyle: 'solid'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        color: b.c,
        minWidth: 72,
        paddingTop: 2
      }
    }, b.t), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: '#bbb'
      }
    }, b.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: 'rgba(255,255,255,.4)',
        marginTop: 2
      }
    }, i === 1 ? 'Today: ' + title : b.s)));
  })), view === 'worship' && (typeof JWSpiritualEngine === 'function') && /*#__PURE__*/React.createElement(JWSpiritualEngine, { personId: personId, isAdmin: !!isAdmin, isTeacher: !!isTeacher, syncSet: syncSet }), view === 'teacher' && isTeacher && /*#__PURE__*/React.createElement("div", null,
  isFieldTrip && typeof FieldTripChooser !== 'undefined' && /*#__PURE__*/React.createElement(FieldTripChooser, {isTeacher:isTeacher}),
  isFieldTrip && typeof _ft !== 'undefined' && /*#__PURE__*/React.createElement("div", {style:{
    margin:'0 0 14px',padding:'16px',
    background:'linear-gradient(135deg,rgba(255,152,0,.12),rgba(255,152,0,.04))',
    border:'2px solid rgba(255,152,0,.4)',borderRadius:16,textAlign:'center'
  }},
    /*#__PURE__*/React.createElement("div",{style:{fontSize:32,marginBottom:6}},"🚌"),
    /*#__PURE__*/React.createElement("div",{style:{fontSize:15,fontWeight:900,color:'#FF9800',marginBottom:4}},"FIELD TRIP DAY"),
    /*#__PURE__*/React.createElement("div",{style:{fontSize:12,color:'#fff',fontWeight:700,marginBottom:6}},_ft.dest),
    /*#__PURE__*/React.createElement("div",{style:{fontSize:10,color:'rgba(255,255,255,.5)',marginBottom:10}},_ft.scripture+' · '+_ft.theme),
    /*#__PURE__*/React.createElement("div",{style:{background:'rgba(0,0,0,.2)',borderRadius:10,padding:'10px 12px',textAlign:'left',fontSize:10,color:'rgba(255,255,255,.7)',lineHeight:2}},
      "📋 FIELD TRIP SCHEDULE",/*#__PURE__*/React.createElement("br"),
      "🕗 8:00 AM — Morning Worship + travel safety prayer",/*#__PURE__*/React.createElement("br"),
      "🚌 8:30 AM — Depart from home",/*#__PURE__*/React.createElement("br"),
      "🌿 Arrive — Field trip activities (free, local!)",/*#__PURE__*/React.createElement("br"),
      "🏠 3:30 PM — Return journey",/*#__PURE__*/React.createElement("br"),
      "✍️ 4:00 PM — Debrief: each child shares what they learned about Jehovah",/*#__PURE__*/React.createElement("br"),
      "📓 Journal entry required · Attendance marked ✅"
    )
  ), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(156,141,196,.08)',
      border: '1px solid rgba(156,141,196,.3)',
      borderRadius: 12,
      padding: 14,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#9C8DC4',
      fontWeight: 800,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "DAY ", dayNum, " TEACHER SCRIPT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: '#fff',
      marginBottom: 4
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'rgba(255,255,255,.5)',
      marginBottom: 8
    }
  }, scripture), songNum > 0 && /*#__PURE__*/React.createElement("a", {
    href: "https://www.jw.org/en/library/music-songs/sing-out-joyfully/".concat(songSlug, "/"),
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 10px',
      borderRadius: 8,
      background: 'rgba(184,134,11,.1)',
      border: '1px solid rgba(184,134,11,.3)',
      textDecoration: 'none',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\uD83C\uDFB5"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#B8860B'
    }
  }, "Song #", songNum, " \u2014 Open on JW.org \u2192")), [{
    icon: '🎯',
    label: 'Hook (3-5 min)',
    color: '#F6BF26',
    text: 'Make it relevant and curiosity-driven. Every child must be engaged before teaching begins.'
  }, {
    icon: '🌱',
    label: 'Foundation (7-8 min)',
    color: '#7986CB',
    text: 'Simple core truth for all ages. Open My Book of Bible Stories for Mykah. One clear statement.'
  }, {
    icon: '📖',
    label: 'Building (10-12 min)',
    color: '#4CAF82',
    text: 'Open Bibles. Read scripture aloud together. Discussion question for the whole room.'
  }, {
    icon: '🔬',
    label: 'Depth (8-10 min)',
    color: '#9E69AF',
    text: 'Deeper research content for Ryan & Kayla. Ashelyn listens. Mykah draws or colors.'
  }, {
    icon: '✅',
    label: 'Application',
    color: '#1A73E8',
    text: 'One question per child. 30-60 seconds each. Celebrate every answer with specific praise.'
  }].map(function (layer) {
    return /*#__PURE__*/React.createElement("div", {
      key: layer.label,
      style: {
        padding: '8px 10px',
        borderRadius: 8,
        marginBottom: 6,
        background: "".concat(layer.color, "14"),
        border: "1px solid ".concat(layer.color, "33")
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 800,
        color: layer.color,
        letterSpacing: 1,
        marginBottom: 3
      }
    }, layer.icon, " ", layer.label.toUpperCase()), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'rgba(255,255,255,.6)',
        lineHeight: 1.7
      }
    }, layer.text));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setShowScript(function (p) {
        return !p;
      });
    },
    style: {
      width: '100%',
      background: 'rgba(156,141,196,.1)',
      border: '1px solid rgba(156,141,196,.3)',
      borderRadius: 10,
      padding: '10px',
      color: '#9C8DC4',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer',
      marginBottom: 8
    }
  }, showScript ? '▾ Hide' : '▸ Show', " Full Lecture Script"), showScript && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.3)',
      borderRadius: 10,
      padding: 12,
      fontSize: 11,
      color: 'rgba(255,255,255,.7)',
      lineHeight: 1.9,
      whiteSpace: 'pre-wrap',
      border: '1px solid rgba(156,141,196,.15)'
    }
  }, script), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.3)',
      fontWeight: 800,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "RESOURCES"),
  /*#__PURE__*/React.createElement("button", {
    onClick: function() {
      var url = "https://classroom.google.com/share?url=" +
        encodeURIComponent("https://wol.jw.org") +
        "&title=" + encodeURIComponent("DKA Day " + dayNum + ": " + title) +
        "&body=" + encodeURIComponent(
          "Scripture: " + scripture + "\n\nLesson: " + title +
          "\n\nDay " + dayNum + " of 180 — Discovering Kids Academy"
        );
      window.open(url, '_blank');
    },
    style: {
      width: '100%', marginBottom: 10,
      background: 'rgba(26,115,232,.12)', border: '1px solid rgba(26,115,232,.35)',
      borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left'
    }
  },
    /*#__PURE__*/React.createElement("span", {style:{fontSize:22}}, "🎓"),
    /*#__PURE__*/React.createElement("div", null,
      /*#__PURE__*/React.createElement("div", {style:{fontSize:11,fontWeight:800,color:'#1A73E8'}},
        "Post to Google Classroom"),
      /*#__PURE__*/React.createElement("div", {style:{fontSize:9,color:'rgba(255,255,255,.3)'}},
        "Share Day " + dayNum + " lesson with your students")
    )
  ),
  [['📅', 'Daily Text', 'https://wol.jw.org/en/wol/h/r1/lp-e', '#9C8DC4'], ['📖', 'NWT Bible', 'https://wol.jw.org/en/wol/binav/r1/lp-e', '#1A73E8'], ['📚', 'Insight Vol.1', 'https://wol.jw.org/en/wol/lv/r1/lp-e/0#h=17:0', '#33B679'], ['🎵', 'Songbook', 'https://www.jw.org/en/library/music-songs/sing-out-joyfully/', '#B8860B'], ['📗', 'My Book of Bible Stories', 'https://www.jw.org/en/library/books/My-Book-of-Bible-Stories/', '#4CAF82']].map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 4),
      icon = _ref4[0],
      label = _ref4[1],
      url = _ref4[2],
      color = _ref4[3];
    return /*#__PURE__*/React.createElement("a", {
      key: url,
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 10,
        textDecoration: 'none',
        marginBottom: 5,
        background: "".concat(color, "10"),
        border: "1px solid ".concat(color, "33")
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: color
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        fontSize: 10,
        color: 'rgba(255,255,255,.2)'
      }
    }, "\u203A"));
  }))), view === 'levels' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10,
      background: 'rgba(156,141,196,.06)',
      border: '1px solid rgba(156,141,196,.15)',
      borderRadius: 10,
      padding: '10px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#9C8DC4',
      fontWeight: 800,
      marginBottom: 2
    }
  }, "TODAY'S SCRIPTURE"),
  lessonLocked && /*#__PURE__*/React.createElement("span",{
    style:{marginLeft:6,fontSize:8,background:'rgba(255,152,0,.15)',color:'#FF9800',
      border:'1px solid rgba(255,152,0,.3)',borderRadius:20,padding:'2px 7px',fontWeight:800}
  },"📅 Today's Lesson"),
  /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#ccc'
    }
  }, lessonLocked ? visibleScripture : scripture)), (family || DEFAULT_FAMILY).filter(function (p) {
    return ['ryan', 'kayla', 'ashelyn', 'mykah'].includes(p.id);
  }).map(function (s) {
    var task = (typeof syncGet === 'function' && (syncGet('school/assign/' + dayNum + '/' + s.id) || null)) || DKA_STUDENT_TASKS[s.id] || 'See teacher for today\'s assignment.';
    var isMe = s.id === personId;
    return /*#__PURE__*/React.createElement("div", {
      id: 'dka_stu_' + s.id,
      key: s.id,
      style: {
        marginBottom: 8,
        background: "".concat(s.color, "12"),
        border: "1px solid ".concat(s.color).concat(isMe ? '66' : '33'),
        borderRadius: 12,
        padding: '10px 12px',
        outline: (isMe || window._dkaFocus === s.id) ? "2px solid ".concat(s.color) : undefined
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20
      }
    }, s.emoji), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 800,
        color: s.color
      }
    }, s.name, " ", isMe ? '(You)' : ''))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'rgba(255,255,255,.7)',
        lineHeight: 1.7
      }
    }, task));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      background: 'rgba(26,115,232,.06)',
      border: '1px solid rgba(26,115,232,.2)',
      borderRadius: 10,
      padding: '10px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontWeight: 800,
      color: '#1A73E8',
      letterSpacing: 1,
      marginBottom: 5
    }
  }, "\uD83D\uDD04 RECONVENE \u2014 After assignments"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'rgba(255,255,255,.6)',
      lineHeight: 1.8
    }
  }, "1. ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#9C8DC4'
    }
  }, "What did you find?"), " \u2014 Tell us in a complete sentence.", /*#__PURE__*/React.createElement("br", null), "2. ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#9C8DC4'
    }
  }, "Where did you find it?"), " \u2014 Name the scripture, article, or page.", /*#__PURE__*/React.createElement("br", null), "3. ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#9C8DC4'
    }
  }, "How will you apply it?"), " \u2014 One specific, real way."))), view === 'music' && typeof MusicClassPanel !== 'undefined' && /*#__PURE__*/React.createElement(MusicClassPanel, {
    personId: personId,
    isTeacher: isTeacher,
    dayNum: dayNum
  }),
  view === 'music' && typeof JwSongProgram === 'function' && /*#__PURE__*/React.createElement(JwSongProgram, { personId: personId }),
  view === 'attendance' && /*#__PURE__*/React.createElement(SchoolAttendanceClock, {
    personId: personId,
    isAdmin: isTeacher || isAdmin,
    family: family
  })));
}


// ═══ MORNING ROUTINE ═══
"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// ═══ MORNING ROUTINE + PEER APPROVAL + ADMIN CHECKLISTS ══════════════════════

// ── Default morning routine items (admin can edit) ─────────────────────────────
var DEFAULT_ROUTINE = [{
  id: 'wakeup',
  label: 'Woke up on time',
  pts: 5,
  icon: '⏰'
}, {
  id: 'dressed',
  label: 'Fully dressed & presentable',
  pts: 8,
  icon: '👕'
}, {
  id: 'bed',
  label: 'Bed made neatly',
  pts: 5,
  icon: '🛏'
}, {
  id: 'room',
  label: 'Room picked up & clean',
  pts: 10,
  icon: '🧹'
}, {
  id: 'hygiene',
  label: 'Brushed teeth & hygiene done',
  pts: 5,
  icon: '🪥'
}, {
  id: 'breakfast',
  label: 'Ate breakfast & cleaned up after',
  pts: 5,
  icon: '🍳'
}, {
  id: 'bible',
  label: 'Read or listened to Bible text',
  pts: 8,
  icon: '📖'
}, {
  id: 'ready',
  label: 'Fully ready & at school spot',
  pts: 10,
  icon: '🎒'
}];
var SPEED_BONUSES = [{
  rank: 1,
  pts: 20,
  label: '⚡ First Ready!',
  color: '#F6BF26'
}, {
  rank: 2,
  pts: 12,
  label: '🥈 Second Ready',
  color: '#B0BEC5'
}, {
  rank: 3,
  pts: 6,
  label: '🥉 Third Ready',
  color: '#A1887F'
}];

// ── Morning Routine Component ──────────────────────────────────────────────────
function MorningRoutine(_ref) {
  var _SPEED_BONUSES, _SPEED_BONUSES2, _SPEED_BONUSES3;
  var personId = _ref.personId,
    isAdmin = _ref.isAdmin,
    family = _ref.family,
    credit = _ref.credit,
    approveCredit = _ref.approveCredit,
    wallets = _ref.wallets;
  var today = new Date().toISOString().split('T')[0];
  var storeKey = 'routine_' + today;

  // Load routine config (admin-editable items)
  var _React$useState = React.useState(function () {
      try {
        var saved = syncGet('routine_config');
        return saved || DEFAULT_ROUTINE;
      } catch (_unused) {
        return DEFAULT_ROUTINE;
      }
    }),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    routineItems = _React$useState2[0],
    setRoutineItems = _React$useState2[1];
  // Load today's submissions
  var _React$useState3 = React.useState(function () {
      try {
        var fb = syncGet('morning_routine/' + today);
        if (fb) return fb;
        return JSON.parse(localStorage.getItem(storeKey) || '{}');
      } catch (_unused2) {
        return {};
      }
    }),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    submissions = _React$useState4[0],
    setSubmissions = _React$useState4[1];
  var _React$useState5 = React.useState(function () {
      var s = {};
      try {
        s = JSON.parse(localStorage.getItem('routine_checks_' + personId + '_' + today) || '{}');
      } catch (_unused3) {}
      return s;
    }),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    myChecks = _React$useState6[0],
    setMyChecks = _React$useState6[1];
  var _React$useState7 = React.useState(function () {
      return localStorage.getItem('routine_start_' + today) || null;
    }),
    _React$useState8 = _slicedToArray(_React$useState7, 1),
    startTime = _React$useState8[0];
  var _React$useState9 = React.useState(function () {
      try {
        return JSON.parse(localStorage.getItem('routine_submitted_' + personId + '_' + today) || 'false');
      } catch (_unused4) {
        return false;
      }
    }),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    submitted = _React$useState0[0],
    setSubmitted = _React$useState0[1];
  var _React$useState1 = React.useState(false),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    editMode = _React$useState10[0],
    setEditMode = _React$useState10[1];
  var _React$useState11 = React.useState(''),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    newLabel = _React$useState12[0],
    setNewLabel = _React$useState12[1];
  var _React$useState13 = React.useState(5),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    newPts = _React$useState14[0],
    setNewPts = _React$useState14[1];
  var _React$useState15 = React.useState('✅'),
    _React$useState16 = _slicedToArray(_React$useState15, 2),
    newIcon = _React$useState16[0],
    setNewIcon = _React$useState16[1];

  // Subscribe to Firebase for real-time submission updates
  React.useEffect(function () {
    if (!localStorage.getItem('routine_start_' + today)) {
      localStorage.setItem('routine_start_' + today, new Date().toISOString());
    }
    var unsub = syncOn('morning_routine/' + today, function (d) {
      if (d && _typeof(d) === 'object') {
        setSubmissions(d);
        try {
          localStorage.setItem(storeKey, JSON.stringify(d));
        } catch (_unused5) {}
      }
    });
    return function () {
      if (unsub) unsub();
    };
  }, [today]);
  function saveRoutineConfig(items) {
    setRoutineItems(items);
    syncSet('routine_config', items);
  }
  function toggleCheck(itemId) {
    if (submitted) return;
    if (__hb) { var __it = routineItems.filter(function (x) { return x.id === itemId; })[0] || {}; rtHabitSet(personId, itemId, !myChecks[itemId], __it.label); return; }
    var next = _objectSpread(_objectSpread({}, myChecks), {}, _defineProperty({}, itemId, !myChecks[itemId]));
    setMyChecks(next);
    try {
      localStorage.setItem('routine_checks_' + personId + '_' + today, JSON.stringify(next));
    } catch (_unused6) {}
  }
  function submitRoutine() {
    var now = Date.now();
    var start = new Date(localStorage.getItem('routine_start_' + today) || new Date().toISOString()).getTime();
    var elapsed = Math.round((now - start) / 60000);
    var pts = routineItems.filter(function (item) {
      return myChecks[item.id];
    }).reduce(function (s, item) {
      return s + (item.pts || 0);
    }, 0);
    var cleanedAsYouWent = !!myChecks['room'];
    var sub = {
      personId: personId,
      pts: __hb ? 0 : pts,
      paidPts: __hb ? pts : 0,
      elapsed: elapsed,
      checks: myChecks,
      cleanedAsYouWent: cleanedAsYouWent,
      submittedAt: now,
      votes: {},
      adminApproved: null
    };
    var rank = Object.keys(submissions).length + 1;
    sub.rank = rank;
    if (rank <= 3) sub.speedBonus = SPEED_BONUSES[rank - 1];
    if (__hb && isAdmin) { sub.adminApproved = true; if (sub.speedBonus && credit) credit(personId, sub.speedBonus.pts, sub.speedBonus.label + ' bonus', 'speed_' + today); }
    var next = _objectSpread(_objectSpread({}, submissions), {}, _defineProperty({}, personId, sub));
    setSubmissions(next);
    syncSet('morning_routine/' + today, next);
    try {
      localStorage.setItem(storeKey, JSON.stringify(next));
    } catch (_unused7) {}
    setSubmitted(true);
    try {
      localStorage.setItem('routine_submitted_' + personId + '_' + today, 'true');
    } catch (_unused8) {}
  }
  function voteForPeer(targetId, approve) {
    var sub = submissions[targetId];
    if (!sub) return;
    var votes = _objectSpread(_objectSpread({}, sub.votes || {}), {}, _defineProperty({}, personId, approve));
    var updated = _objectSpread(_objectSpread({}, submissions), {}, _defineProperty({}, targetId, _objectSpread(_objectSpread({}, sub), {}, {
      votes: votes
    })));
    setSubmissions(updated);
    syncSet('morning_routine/' + today, updated);
  }
  function adminApprove(targetId) {
    var sub = submissions[targetId];
    if (!sub) return;
    var updated = _objectSpread(_objectSpread({}, submissions), {}, _defineProperty({}, targetId, _objectSpread(_objectSpread({}, sub), {}, {
      adminApproved: true
    })));
    setSubmissions(updated);
    syncSet('morning_routine/' + today, updated);
    // Award the points
    if (credit) {
      if (sub.pts > 0) credit(targetId, sub.pts, '🌅 Morning routine', 'routine_' + today);
      if (sub.speedBonus) credit(targetId, sub.speedBonus.pts, sub.speedBonus.label + ' bonus', 'speed_' + today);
    }
    // Also send notification
    if (window._sendNotif) {
      var p = (family || DEFAULT_FAMILY).find(function (f) {
        return f.id === targetId;
      });
      if (p) window._sendNotif(p.name + ' morning routine approved!', '+' + sub.pts + ' pts earned');
    }
  }
  function adminReset(targetId) {
    if (!window._safeConfirm('Reset this submission?')) return;
    var next = _objectSpread({}, submissions);
    delete next[targetId];
    setSubmissions(next);
    syncSet('morning_routine/' + today, next);
    if (targetId === personId) {
      setSubmitted(false);
      setMyChecks({});
      try {
        localStorage.removeItem('routine_submitted_' + personId + '_' + today);
      } catch (_unused9) {}
      try {
        localStorage.removeItem('routine_checks_' + personId + '_' + today);
      } catch (_unused0) {}
    }
  }
  var students = (family || DEFAULT_FAMILY).filter(function (p) {
    return ['ryan', 'kayla', 'ashelyn', 'mykah'].includes(p.id);
  });
  // ── Bridge: the same morning habits the person checks off in My Day / Chores show up here ──
  var __hb = typeof rtHabits === 'function' && typeof rtHabitSet === 'function';
  var __hdS = ktUse('habitsdone/' + (typeof rtDay === 'function' ? rtDay() : today) + '/' + personId, {}), __ownS = ktUse('habits/' + personId, null), __allS = ktUse('habits/__all', null);
  if (__hb) {
    var __nm = ((family || DEFAULT_FAMILY).filter(function (f) { return f.id === personId; })[0] || {}).name || personId;
    var __pc = typeof mdCfgDefaults === 'function' ? mdCfgDefaults(syncGet('points_cfg') || null).habitPts : 1;
    routineItems = rtHabits(__nm, personId, 'morning', __ownS[0], __allS[0]).map(function (lab) { return { id: 'morning_' + rtHash(lab), label: rtParse(lab).text, pts: __pc, icon: '✅' }; });
    myChecks = __hdS[0] || {};
  }
  var mySub = submissions[personId];
  var myPts = routineItems.filter(function (i) {
    return myChecks[i.id];
  }).reduce(function (s, i) {
    return s + (i.pts || 0);
  }, 0);
  var iStyle = {
    background: 'rgba(255,255,255,.07)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 8,
    padding: '6px 10px',
    color: '#fff',
    fontSize: 12
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px',
      background: 'linear-gradient(135deg,rgba(246,191,38,.08),rgba(156,141,196,.08))',
      borderBottom: '1px solid rgba(255,255,255,.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      color: '#F6BF26',
      marginBottom: 2
    }
  }, "\uD83C\uDF05 Morning Routine"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.3)'
    }
  }, new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }))), isAdmin && !__hb && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 14px',
      borderBottom: '1px solid rgba(255,255,255,.04)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setEditMode(!editMode);
    },
    style: {
      padding: '5px 12px',
      background: editMode ? 'rgba(192,202,51,.15)' : 'rgba(255,255,255,.06)',
      border: editMode ? '1px solid rgba(192,202,51,.4)' : '1px solid rgba(255,255,255,.1)',
      borderRadius: 20,
      color: editMode ? '#C0CA33' : '#666',
      fontSize: 9,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, editMode ? '✅ Done Editing' : '✏️ Edit Routine Items')), isAdmin && editMode && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px',
      background: 'rgba(0,0,0,.2)',
      borderBottom: '1px solid rgba(255,255,255,.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      fontWeight: 800,
      marginBottom: 8
    }
  }, "ROUTINE ITEMS (drag to reorder)"), routineItems.map(function (item, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 5,
        background: 'rgba(255,255,255,.04)',
        borderRadius: 8,
        padding: '6px 8px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        flexShrink: 0
      }
    }, item.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 10,
        color: '#ddd'
      }
    }, item.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: '#C0CA33',
        fontWeight: 800
      }
    }, item.pts, "pts"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        var next = routineItems.filter(function (_, j) {
          return j !== i;
        });
        saveRoutineConfig(next);
      },
      style: {
        background: 'rgba(239,83,80,.1)',
        color: '#EF5350',
        border: 'none',
        borderRadius: 20,
        padding: '3px 8px',
        fontSize: 8,
        cursor: 'pointer'
      }
    }, "\u2715"));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: newIcon,
    onChange: function onChange(e) {
      return setNewIcon(e.target.value);
    },
    maxLength: 2,
    style: _objectSpread(_objectSpread({}, iStyle), {}, {
      width: 38,
      textAlign: 'center',
      fontSize: 16,
      padding: '5px'
    })
  }), /*#__PURE__*/React.createElement("input", {
    value: newLabel,
    onChange: function onChange(e) {
      return setNewLabel(e.target.value);
    },
    placeholder: "New item...",
    autoCorrect: "on",
    style: _objectSpread(_objectSpread({}, iStyle), {}, {
      flex: 1
    })
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newPts,
    onChange: function onChange(e) {
      return setNewPts(parseInt(e.target.value) || 5);
    },
    inputMode: "numeric",
    min: 1,
    max: 50,
    style: _objectSpread(_objectSpread({}, iStyle), {}, {
      width: 50,
      textAlign: 'center'
    })
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      if (!newLabel.trim()) return;
      var item = {
        id: 'custom_' + Date.now(),
        label: newLabel.trim(),
        pts: newPts || 5,
        icon: newIcon || '✅'
      };
      saveRoutineConfig([].concat(_toConsumableArray(routineItems), [item]));
      setNewLabel('');
      setNewPts(5);
      setNewIcon('✅');
    },
    style: {
      background: '#C0CA33',
      color: '#000',
      border: 'none',
      borderRadius: 20,
      padding: '6px 12px',
      fontWeight: 800,
      fontSize: 11,
      cursor: 'pointer'
    }
  }, "+")), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      saveRoutineConfig(DEFAULT_ROUTINE);
    },
    style: {
      marginTop: 8,
      background: 'transparent',
      color: 'rgba(255,255,255,.3)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 20,
      padding: '5px 12px',
      fontSize: 9,
      cursor: 'pointer'
    }
  }, "\u21BA Reset to defaults")), !submitted && !mySub && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)',
      fontWeight: 800,
      letterSpacing: 1,
      marginBottom: 8
    }
  }, "YOUR MORNING CHECKLIST"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(246,191,38,.06)',
      border: '1px solid rgba(246,191,38,.2)',
      borderRadius: 10,
      padding: '8px 12px',
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, "\u26A1"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#F6BF26'
    }
  }, "Speed Bonus Available"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)'
    }
  }, "Finish 1st: +20pts \xB7 2nd: +12pts \xB7 3rd: +6pts \xB7 ", Object.keys(submissions).length, " already submitted"))), routineItems.map(function (item) {
    var checked = !!myChecks[item.id];
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      onClick: function onClick() {
        return toggleCheck(item.id);
      },
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        marginBottom: 5,
        background: checked ? "rgba(76,175,82,.12)" : 'rgba(255,255,255,.03)',
        border: checked ? '1px solid rgba(76,175,82,.4)' : '1px solid rgba(255,255,255,.07)',
        borderRadius: 12,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all .2s'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        flexShrink: 0,
        background: checked ? '#4CAF82' : 'rgba(255,255,255,.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: checked ? 14 : 18,
        fontWeight: 900,
        color: checked ? '#000' : 'rgba(255,255,255,.2)'
      }
    }, checked ? '✓' : item.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: checked ? '#4CAF82' : '#ccc',
        textDecoration: checked ? 'line-through' : 'none'
      }
    }, item.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 800,
        color: '#C0CA33'
      }
    }, "+", item.pts));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#C0CA33',
      fontWeight: 800
    }
  }, Object.keys(myChecks).filter(function (k) { return myChecks[k] && routineItems.some(function (i) { return i.id === k; }); }).length, "/", routineItems.length, " done \xB7 ", myPts, " pts", __hb ? (typeof window._payrollOn==='function'&&window._payrollOn(personId)?' (counted toward your paycheck)':' (already in your wallet)') : ''), /*#__PURE__*/React.createElement("button", {
    onClick: submitRoutine,
    disabled: !Object.values(myChecks).some(Boolean),
    style: {
      background: Object.values(myChecks).some(Boolean) ? '#C0CA33' : 'rgba(255,255,255,.06)',
      color: Object.values(myChecks).some(Boolean) ? '#000' : '#444',
      border: 'none',
      borderRadius: 20,
      padding: '10px 20px',
      fontWeight: 800,
      fontSize: 12,
      cursor: Object.values(myChecks).some(Boolean) ? 'pointer' : 'default'
    }
  }, "Submit & Claim Points \u203A"))), (submitted || mySub) && !(mySub !== null && mySub !== void 0 && mySub.adminApproved) && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '10px 14px',
      background: 'rgba(255,152,0,.08)',
      border: '1px solid rgba(255,152,0,.25)',
      borderRadius: 12,
      padding: 12,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      marginBottom: 6
    }
  }, "\u23F3"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#FF9800'
    }
  }, "Submitted! Waiting for approval"), (mySub === null || mySub === void 0 ? void 0 : mySub.rank) && mySub.rank <= 3 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: (_SPEED_BONUSES = SPEED_BONUSES[mySub.rank - 1]) === null || _SPEED_BONUSES === void 0 ? void 0 : _SPEED_BONUSES.color,
      fontWeight: 800,
      marginTop: 4
    }
  }, (_SPEED_BONUSES2 = SPEED_BONUSES[mySub.rank - 1]) === null || _SPEED_BONUSES2 === void 0 ? void 0 : _SPEED_BONUSES2.label, " \xB7 +", (_SPEED_BONUSES3 = SPEED_BONUSES[mySub.rank - 1]) === null || _SPEED_BONUSES3 === void 0 ? void 0 : _SPEED_BONUSES3.pts, " bonus pending"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.3)',
      marginTop: 4
    }
  }, (mySub === null || mySub === void 0 ? void 0 : mySub.pts) || myPts, " pts \xB7 peers review first, then admin approves")), (mySub === null || mySub === void 0 ? void 0 : mySub.adminApproved) && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '10px 14px',
      background: 'rgba(76,175,82,.1)',
      border: '1px solid rgba(76,175,82,.3)',
      borderRadius: 12,
      padding: 12,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      marginBottom: 4
    }
  }, "\uD83C\uDF89"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: '#4CAF82'
    }
  }, "Points Approved!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'rgba(255,255,255,.5)',
      marginTop: 2
    }
  }, mySub.pts, " pts + ", mySub.speedBonus ? mySub.speedBonus.pts : 0, " speed bonus")), Object.keys(submissions).length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)',
      fontWeight: 800,
      letterSpacing: 1,
      marginTop: 12,
      marginBottom: 8
    }
  }, "FAMILY SUBMISSIONS"), students.map(function (s) {
    var sub = submissions[s.id];
    if (!sub) return null;
    var peerVotes = sub.votes || {};
    var upvotes = Object.values(peerVotes).filter(Boolean).length;
    var downvotes = Object.values(peerVotes).filter(function (v) {
      return !v;
    }).length;
    var myVote = peerVotes[personId];
    var canVote = s.id !== personId && !isAdmin;
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        marginBottom: 8,
        background: sub.adminApproved ? 'rgba(76,175,82,.07)' : 'rgba(255,255,255,.03)',
        border: "1px solid ".concat(sub.adminApproved ? 'rgba(76,175,82,.3)' : 'rgba(255,255,255,.07)'),
        borderRadius: 12,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '9px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20
      }
    }, s.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 800,
        color: '#fff'
      }
    }, s.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: sub.adminApproved ? '#4CAF82' : 'rgba(255,255,255,.3)'
      }
    }, sub.adminApproved ? '✅ Approved' : '⏳ Pending', " \xB7 Rank #", sub.rank, " \xB7 ", sub.pts, " pts", sub.speedBonus ? ' + ' + sub.speedBonus.pts + ' speed' : '', sub.cleanedAsYouWent ? ' · 🧹 cleaned as went' : '')), canVote && !sub.adminApproved && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return voteForPeer(s.id, true);
      },
      style: {
        padding: '5px 10px',
        borderRadius: 20,
        border: 'none',
        cursor: 'pointer',
        fontSize: 11,
        background: myVote === true ? 'rgba(76,175,82,.3)' : 'rgba(255,255,255,.06)',
        color: myVote === true ? '#4CAF82' : '#666'
      }
    }, "\uD83D\uDC4D ", upvotes), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return voteForPeer(s.id, false);
      },
      style: {
        padding: '5px 10px',
        borderRadius: 20,
        border: 'none',
        cursor: 'pointer',
        fontSize: 11,
        background: myVote === false ? 'rgba(239,83,80,.2)' : 'rgba(255,255,255,.06)',
        color: myVote === false ? '#EF5350' : '#666'
      }
    }, "\uD83D\uDC4E ", downvotes)), isAdmin && !sub.adminApproved && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return adminApprove(s.id);
      },
      style: {
        padding: '5px 12px',
        borderRadius: 20,
        border: 'none',
        cursor: 'pointer',
        fontSize: 9,
        fontWeight: 800,
        background: 'rgba(76,175,82,.2)',
        color: '#4CAF82'
      }
    }, "\u2713 Approve"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return adminReset(s.id);
      },
      style: {
        padding: '5px 8px',
        borderRadius: 20,
        border: '1px solid rgba(239,83,80,.2)',
        cursor: 'pointer',
        fontSize: 9,
        background: 'rgba(239,83,80,.08)',
        color: '#EF5350'
      }
    }, "\u2715")), isAdmin && sub.adminApproved && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return adminReset(s.id);
      },
      style: {
        padding: '4px 8px',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,.1)',
        cursor: 'pointer',
        fontSize: 8,
        background: 'transparent',
        color: 'rgba(255,255,255,.3)'
      }
    }, "Reset")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4
      }
    }, routineItems.filter(function (item) {
      var _sub$checks;
      return (_sub$checks = sub.checks) === null || _sub$checks === void 0 ? void 0 : _sub$checks[item.id];
    }).map(function (item) {
      return /*#__PURE__*/React.createElement("span", {
        key: item.id,
        style: {
          fontSize: 8,
          background: 'rgba(76,175,82,.1)',
          border: '1px solid rgba(76,175,82,.2)',
          borderRadius: 20,
          padding: '2px 7px',
          color: '#4CAF82'
        }
      }, item.icon, " ", item.label);
    }))));
  })));
}

