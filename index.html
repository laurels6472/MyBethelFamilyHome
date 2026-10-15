function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} = React;

// ── Error Boundary — catches crashes, shows friendly error ─────────────────────
class AppErrorBoundary extends React.Component {
  constructor(p){super(p);this.state={err:null};}
  static getDerivedStateFromError(e){return{err:e};}
  componentDidCatch(e,i){console.error('[FM]',e.message);}
  render(){
    if(this.state.err)return React.createElement('div',{style:{padding:30,textAlign:'center'}},
      React.createElement('div',{style:{fontSize:36,marginBottom:10}},'⚠️'),
      React.createElement('div',{style:{fontSize:16,fontWeight:800,color:'#fff',marginBottom:8}},'Something went wrong'),
      React.createElement('div',{style:{fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:16}},(this.state.err.message||'').slice(0,100)),
      React.createElement('button',{onClick:()=>this.setState({err:null}),style:{background:'#C0CA33',color:'#000',border:'none',borderRadius:20,padding:'10px 22px',fontWeight:800,cursor:'pointer'}},'← Go Back'),
      React.createElement('span',{style:{width:12,display:'inline-block'}}),
      React.createElement('button',{onClick:()=>window.location.reload(),style:{background:'transparent',color:'rgba(255,255,255,.4)',border:'1px solid rgba(255,255,255,.2)',borderRadius:20,padding:'10px 16px',fontSize:11,cursor:'pointer'}},'Reload'));
    return this.props.children;
  }
}

// ── React Sync Hooks (needs useState/useEffect) ───────────────────────────────
function useSyncState(fbPath, localKey, defaultValue) {
  var init = useState(function() {
    try { var ls = localStorage.getItem(localKey); if (ls) return JSON.parse(ls); } catch {}
    var fb = syncGet(fbPath);
    return fb !== null ? fb : (defaultValue || null);
  });
  var value = init[0], _setValue = init[1];
  useEffect(function() {
    var unsub = syncOn(fbPath, function(d) {
      if (d !== null && d !== undefined) {
        _setValue(d);
        try { localStorage.setItem(localKey, JSON.stringify(d)); } catch {}
      }
    });
    return function() { if (unsub) unsub(); };
  }, [fbPath]);
  function update(v) {
    _setValue(v);
    try { localStorage.setItem(localKey, JSON.stringify(v)); } catch {}
    syncSet(fbPath, v);
  }
  return [value, update];
}
function useSyncStatus() {
  var s = useState(_syncStatus);
  var status = s[0], setStatus = s[1];
  useEffect(function() {
    _syncStatusListeners.push(setStatus);
    return function() {
      _syncStatusListeners = _syncStatusListeners.filter(function(f) { return f !== setStatus; });
    };
  }, []);
  return status;
}
// ─────────────────────────────────────────────────────────────────────────────

// V9 DATA
const C = {
  wake: "#b83020",
  devotion: "#8a5c00",
  service: "#5b2d8e",
  school: "#1a6e38",
  va: "#1050a0",
  molding: "#0e5a7a",
  worship: "#6a1a8e",
  meeting: "#3a1270",
  prep: "#7a5800",
  rec: "#7a3a00",
  park: "#2d6a2d",
  chores: "#5a2020",
  hydration: "#0369a1",
  exercise: "#0e6b5e",
  bath: "#1e3a8c",
  meal: "#8e4a00",
  sleep: "#2d3748",
  free: "#3a5a3a",
  business: "#184878",
  commute: "#4a4080"
};

// ── PERSON COLORS ─────────────────────────────────────────────────────────────
// ── FAMILY COLOR SYSTEM ──────────────────────────────────────────────────────
// All colors match Google Calendar calendar colors exactly
const PCOLORS = {
  Eric: "#1A73E8",
  // Cobalt         — Joseph Eric Argilan II
  Laurel: "#8D6E63",
  // Coco           — Laurel Argilan
  Ryan: "#039BE5",
  // Peacock        — Ryan Argilan
  Kayla: "#F48FB1",
  // Cherry Blossom — Kayla Michelle Argilan
  Ashelyn: "#9E69AF",
  // Amethyst       — Ashelyn Renee Argilan
  Mykah: "#4CAF82",
  // Eucalyptus     — Mykah Kade Argilan
  Jacob: "#558BB2",
  // Custom         — Jacob Landen Argilan Smith
  Grandpa: "#15847E" // Custom         — Eric Argilan SR
};
// Calendar + activity colors
const CAL_COLORS = {
  // ── E.L. Services & Sales ─────────────────────────────
  va: "#E67C73",
  // Flamingo  — E.L. Services VA · Laurel Argilan
  consulting: "#33B679",
  // Sage      — E.L. Services · Eric Mold Consulting
  // ── Eric Work ─────────────────────────────────────────
  work: "#0B8043",
  // Basil     — Work · Eric II · Delta Mold LLC
  // ── School ────────────────────────────────────────────
  school: "#9C8DC4",
  // Wisteria  — 26-27 School Attendance
  // ── Spiritual ─────────────────────────────────────────
  jwworship: "#F4511E",
  // Tangerine — .00 JW Family Worship Study Projects
  jwservice: "#F09300",
  // Mango     — JW Service · RVs · Bible Studies
  spiritual: "#7986CB",
  // Lavender  — Bible Reading / Spiritual Prep
  // ── Routine ───────────────────────────────────────────
  routine: "#C0CA33",
  // Citron    — My Bethel Routine, Prep & Menu
  // ── Life ──────────────────────────────────────────────
  birthdays: "#616161",
  // Graphite  — Birthdays (moved · Flamingo now VA)
  tasks: "#616161",
  // Graphite  — Tasks / Errands / Chores
  free: "#7986CB",
  // Lavender  — Free Time / Park / Animals
  fun: "#F6BF26", // Banana    — Fun Night / Recreation
  doctors: "#EF5350",  // Tomato — All family doctor visits
  vet: "#26A69A"       // Teal   — Khaniikos Kappa, Skyli Enia, S'Moresey
};

// ── VA SLOTS ─────────────────────────────────────────────────────────────────
const mkSlots = (p, times) => times.map((t, i) => ({
  id: p + String(i + 1),
  time: t
}));
const MON_WED_T = ["2:00–2:30 PM", "2:30–3:00 PM", "3:00–3:30 PM", "3:30–4:00 PM", "4:00–4:30 PM", "4:30–5:00 PM", "5:00–5:30 PM", "5:30–6:00 PM", "6:00–6:30 PM", "6:30–7:00 PM", "7:00–7:30 PM", "7:30–8:00 PM", "8:00–8:30 PM", "8:30–9:00 PM", "9:00–9:30 PM", "9:30–10:00 PM"];
const NINE5_T = ["9:00–9:30 AM", "9:30–10:00 AM", "10:00–10:30 AM", "10:30–11:00 AM", "11:00–11:30 AM", "11:30 AM–12:00 PM", "12:00–12:30 PM", "12:30–1:00 PM", "1:00–1:30 PM", "1:30–2:00 PM", "2:00–2:30 PM", "2:30–3:00 PM", "3:00–3:30 PM", "3:30–4:00 PM", "4:00–4:30 PM", "4:30–5:00 PM"];
const VA_SLOTS = {
  mon: {
    label: "Mon — Service Day",
    hours: "2:00–10:00 PM",
    note: "16 slots · 8 hrs · same as Eric 2–10 PM · School inside 1:15–6:15 PM",
    slots: mkSlots("m", MON_WED_T)
  },
  tue: {
    label: "Tue",
    hours: "9:00 AM–5:00 PM",
    note: "16 slots · 8 hrs · same as Eric 9–5 PM · School inside 8 AM–1 PM",
    slots: mkSlots("t", NINE5_T)
  },
  wed: {
    label: "Wed — Service Day",
    hours: "2:00–10:00 PM",
    note: "16 slots · 8 hrs · same as Eric 2–10 PM · School inside 1:15–6:15 PM",
    slots: mkSlots("w", MON_WED_T)
  },
  thu: {
    label: "Thu",
    hours: "9:00 AM–5:00 PM",
    note: "16 slots · 8 hrs · same as Eric 9–5 PM · School inside 8 AM–1 PM",
    slots: mkSlots("h", NINE5_T)
  },
  fri: {
    label: "Fri",
    hours: "9:00 AM–5:00 PM",
    note: "16 slots · 8 hrs · School inside 8 AM–1 PM · Fun night after",
    slots: mkSlots("f", NINE5_T)
  }
};
const BIZ_TASKS = ["Cold outreach calls", "Email campaigns", "Social media posting", "Write client proposals", "Ask for referrals", "Research new leads", "Follow up on quotes", "Update portfolio / rate sheet"];

// ── FREE TIME ─────────────────────────────────────────────────────────────────
const FREE_TIME = [{
  day: "Monday",
  color: "#5b2d8e",
  adult: [{
    t: "Very little",
    n: "Service + 5-hr block fills Laurels day"
  }],
  kids: [{
    t: "3:15–5:30 PM",
    n: "2 hrs 15 min after school ends"
  }]
}, {
  day: "Tuesday",
  color: "#1050a0",
  adult: [{
    t: "1:00–3:30 PM",
    n: "After school+VA · 2.5 hrs"
  }, {
    t: "5:30–7:00 PM",
    n: "Eric home · before worship"
  }],
  kids: [{
    t: "1:00–3:30 PM",
    n: "2.5 hrs · anything they want"
  }]
}, {
  day: "Wednesday",
  color: "#5b2d8e",
  adult: [{
    t: "Very little",
    n: "Same as Monday"
  }],
  kids: [{
    t: "3:15–5:30 PM",
    n: "2 hrs 15 min after school ends"
  }]
}, {
  day: "Thursday",
  color: "#3a1270",
  adult: [{
    t: "1:00–2:00 PM",
    n: "1 hr after school before meeting prep"
  }, {
    t: "5:30–6:30 PM",
    n: "Eric home · family time before meeting"
  }],
  kids: [{
    t: "1:00–3:30 PM",
    n: "2.5 hrs before exercise + bathroom rotation"
  }]
}, {
  day: "Friday",
  color: "#7a3a00",
  adult: [{
    t: "3:00–5:00 PM",
    n: "BEST weekday · 2 hrs · relax"
  }, {
    t: "5:30–7:00 PM",
    n: "Fun Night · Eric home"
  }],
  kids: [{
    t: "1:00–3:00 PM",
    n: "2 hrs after school"
  }, {
    t: "5:30–7:00 PM",
    n: "Fun Night"
  }]
}, {
  day: "Saturday (Most Free)",
  color: "#2d6a2d",
  adult: [{
    t: "9:00–10:00 AM",
    n: "Slow morning"
  }, {
    t: "2:00–4:00 PM",
    n: "Park — whole family + all 3 animals"
  }, {
    t: "4:00–5:00 PM",
    n: "Couple time"
  }, {
    t: "6:30–8:00 PM",
    n: "Evening rec"
  }],
  kids: [{
    t: "9:00–10:00 AM",
    n: "Slow morning"
  }, {
    t: "2:00–4:00 PM",
    n: "Park"
  }, {
    t: "4:00–5:00 PM",
    n: "Free"
  }, {
    t: "6:30–8:00 PM",
    n: "Evening"
  }]
}, {
  day: "Sunday",
  color: "#1e3a8c",
  adult: [{
    t: "6:00–8:00 PM",
    n: "After cleaning + meal prep · park walk or relax"
  }],
  kids: [{
    t: "6:00–8:00 PM",
    n: "Evening free time"
  }]
}];

// ── PERSONAL CHORES ───────────────────────────────────────────────────────────
const PERSONAL_CHORES = {
  Ryan: ["Clean up after your own meals — rinse dish, put in sink", "Make your bed every morning before school", "Keep your room tidy — floor clear, nothing on the bed", "Dirty clothes in the laundry basket — not the floor", "Wipe up any mess you make in common areas immediately", "Put your shoes, backpack, and belongings in their spot", "Replace anything you used — toilet paper, soap, etc.", "Screen time devices charged and put away when done"],
  Kayla: ["Clean up after your own meals — rinse dish, put in sink", "Make your bed every morning before school", "Keep your room tidy — floor clear, desk organized", "Dirty clothes in the laundry basket — not the floor", "Wipe up any mess you make in common areas immediately", "Put your shoes, bags, and belongings in their spot", "Replace anything you used — toilet paper, soap, etc.", "Hair products and beauty items put away after use"],
  Ashelyn: ["Clean up after your own meals — rinse dish, put in sink", "Make your bed every morning before school", "Keep your room tidy — floor clear, nothing piled up", "Dirty clothes in the laundry basket — not the floor", "Wipe up any mess you make in common areas immediately", "Put your shoes and belongings in their spot", "Replace anything you used — toilet paper, soap, etc.", "Art and craft supplies put away completely when done"],
  Mykah: ["Clean up after your own meals — ask for help rinsing dish", "Make your bed every morning — Laurel checks", "Keep your room tidy — toys in bins, floor clear", "Dirty clothes in the laundry basket — parent verifies", "Pick up after yourself in common areas right away", "Put shoes, backpack, and belongings in their spot", "Flush the toilet and wash hands every time", "Put toys away before getting new ones out"]
};

// ── ROTATING CHORES ───────────────────────────────────────────────────────────
const ROTATION_CHORES = [{
  name: "Kitchen and Dishes",
  icon: "🍳",
  desc: "All dishes after all 3 meals. Wipe counters, stove, microwave outside.",
  items: ["Clear and wipe table after breakfast", "Wash all breakfast dishes — dry and put away", "Clear and wipe table after lunch", "Wash all lunch dishes — dry and put away", "Help with dinner dishes — wash, dry, put away", "Wipe down all countertops after dinner", "Wipe stove top and knobs", "Wipe outside of microwave", "Sweep kitchen floor after meals", "Replace dish soap or sponge if out"]
}, {
  name: "Bathroom",
  icon: "🚿",
  desc: "Full bathroom clean. Toilet, tub, sink, mirror, floor.",
  items: ["Scrub inside toilet bowl with brush", "Wipe toilet seat, base, lid, and tank", "Scrub sink — faucet, drain, and basin", "Wipe mirror — streak free", "Scrub tub or shower walls and floor", "Wipe all cabinet fronts", "Replace toilet paper if low", "Empty bathroom trash into main trash bag", "Replace hand soap if out", "Sweep and mop bathroom floor"]
}, {
  name: "Floors",
  icon: "🧹",
  desc: "Sweep all rooms, vacuum carpets and rugs, mop all hard floors.",
  items: ["Sweep kitchen and dining area", "Sweep living room and hallways", "Sweep all bedrooms", "Vacuum all rugs and carpeted areas", "Mop kitchen and dining hard floors", "Mop bathroom floor", "Mop any other hard floor areas", "Shake out entry mat or door rugs", "Sweep or wipe baseboards if dusty", "Check corners for dust or pet hair"]
}, {
  name: "Laundry",
  icon: "🧺",
  desc: "Full family laundry. Wash, dry, fold, and put away everything.",
  items: ["Collect dirty clothes from all rooms", "Sort laundry — lights, darks, delicates", "Start first wash load", "Move to dryer when done — no leaving it wet", "Start second load if needed", "Fold everything as it comes out warm", "Separate by person — each person's pile", "Put away your own pile in your room", "Remind each person to put away theirs", "Wipe down washer and dryer exterior"]
}];
const KIDS_ROT = ["Ryan", "Kayla", "Ashelyn", "Mykah"];
const MYKAH_ASSIST = {
  "Kitchen and Dishes": "Set and clear table, collect dishes to sink, wipe table",
  "Bathroom": "Clean sink and mirror — Laurel does toilet and tub with Mykah",
  "Floors": "Sweep common areas and hallways — parent checks",
  "Laundry": "Fold towels and simple items, sort by person"
};

// ── DAILY CHORES ──────────────────────────────────────────────────────────────
const CHORES_DAILY = ["Beds made — all six beds made before school", "Common areas picked up — nothing on the floor", "After breakfast — dishes done, table wiped, kitchen clean", "After lunch — dishes done, table wiped", "After dinner — dishes done, kitchen reset, stove wiped", "Dogs — 4 potty walks completed (6:30 AM, 10 AM, 2 PM, 6 PM)", "Dogs — water bowls checked and refilled", "Dogs — evening meal fed (1 meal per day)", "S'mores'e — checked, fed, and watered", "Quick 5-minute tidy of living area before bed", "All laundry off floors and in baskets", "Trash bags checked — full bags tied and moved to door"];

// ── WEEKLY CHORES ─────────────────────────────────────────────────────────────
const CHORES_WEEKLY = {
  Monday: ["Sweep all floors throughout the home", "Vacuum all rugs and carpeted areas", "Wipe light switches and door handles throughout"],
  Tuesday: ["Mop all hard floors", "Wipe all doors and large surface areas", "Dust shelves and furniture surfaces"],
  Wednesday: ["Rabbit S'mores'e — FULL crate wash and bedding replace", "Deep clean bathroom — toilet, tub, sink, mirror, floor", "Wipe inside microwave"],
  Thursday: ["Laundry day — wash, dry, fold, put away all family laundry", "Deep tidy all kids rooms — inspect each one", "Wipe refrigerator door and handles"],
  Friday: ["Catch-all declutter — everything goes back to its place", "Empty ALL trash bins from every room — prep for dump run", "Wipe all mirrors throughout home", "Check and restock: toilet paper, soap, dish soap, sponges"],
  Saturday: ["Deep clean one room — rotate each week", "Dog bathing if due (every 2 to 4 weeks)", "Full grocery shopping run — meal plan list + pet supplies"],
  Sunday: ["FULL apartment clean — all hands on deck — assign zones", "Meal prep for the entire week — proteins, veg, pack lunches", "Wipe all appliance exteriors", "Mop entire apartment"]
};

// ── TRASH ─────────────────────────────────────────────────────────────────────
const TRASH_RULES = ["No curbside pickup — must drive bags to the dump", "CLOSED every Wednesday — never go on Wednesday", "Saturday is HALF DAY — closes at 7 PM — go in the MORNING", "Best day: Friday morning before Eric leaves at 8:30 AM", "Also good: Thursday morning — or Saturday by 10 AM", "Collect ALL trash Thursday evening so bags are ready to go", "After returning: put new bags in every trash bin throughout home"];
const TRASH_ITEMS = ["Kitchen trash bag — tied and ready", "Bathroom trash — tied and ready", "Ryan's room trash — collected", "Kayla's room trash — collected", "Ashelyn's room trash — collected", "Mykah's room trash — collected", "Any cardboard broken down flat", "All bags loaded in the car", "Drive to dump — check it is open today", "Unload at dump", "Return home — new bags in all bins", "Wash hands after trash run"];

// ── MONTHLY / YEARLY CHORES ───────────────────────────────────────────────────
const CHORES_MONTHLY = ["Deep clean inside the oven", "Deep clean inside the refrigerator — all shelves and drawers", "Clean refrigerator coils", "Run dishwasher empty with cleaner tablet", "Clean dryer lint trap and wipe drum inside", "Pull out washer and dryer and sweep behind them", "Wash all windows inside — every room", "Wipe all baseboards and door frames", "Clean ceiling fans — blades and light covers", "Dust all vents and air return grilles", "Clean under all furniture — beds, sofas, dressers", "Dog bath for Khaniikos and Skyli (if not done in 3 weeks)", "Flip or rotate mattresses — all beds", "Check and refill all household supplies", "Check all medications for expiration date", "Wipe inside all cabinets — kitchen and bathroom"];
const CHORES_YEARLY = ["Full deep clean of entire home — top to bottom", "Test all smoke detectors and CO detectors — replace batteries", "Clean oven thoroughly — inside and out", "Clean refrigerator coils and all interior panels", "Descale coffee maker and kettle", "Wash all curtains and window treatments", "Deep clean all mattresses — vacuum and deodorize", "Wipe all walls throughout the home", "Inspect for any mold, leaks, or damage — report to landlord", "Purge and donate unused clothing — all 6 family members", "Purge and donate unused toys, games, and items", "Update all important document copies — ID, insurance, records", "Photograph important documents for digital backup", "Review and update emergency contact list for all family members", "Organize and purge school records and portfolios", "Review budget and update E.L. Services rate sheet for the new year"];

// ── MORNING ROUTINE ───────────────────────────────────────────────────────────
const MORNING_ITEMS = {
  Eric: ["Wake up — 6:00 AM — first alarm, get up immediately", "Coffee and personal quiet time", "Personal Bible reading or spiritual review", "Brush teeth and wash face", "Get fully dressed and ready for the day", "Hair done — presentable", "Help wake kids if needed", "Eat breakfast with family", "Read Daily Text with family"],
  Laurel: ["Wake up — 6:00 AM alarm", "Coffee and personal quiet time", "Personal Bible reading or spiritual prep", "Brush teeth, skincare, wash face", "Deodorant", "Get fully dressed — hair done", "Wake kids at 6:30 AM", "Start breakfast prep 7:00 AM", "Eat breakfast with family", "Read Daily Text with family"],
  Ryan: ["Wake up when called — no snoozing", "Use bathroom", "Make bed — no shortcuts", "Brush teeth 2 minutes", "Wash face", "Deodorant — every single day", "Get dressed for school", "Hair done", "Eat breakfast with family"],
  Kayla: ["Wake up when called", "Use bathroom", "Make bed", "Brush teeth 2 minutes", "Wash face and skincare", "Deodorant", "Get dressed for school", "Hair done", "Eat breakfast with family"],
  Ashelyn: ["Wake up when called", "Use bathroom", "Make bed", "Brush teeth 2 minutes", "Wash face", "Deodorant", "Get dressed for school", "Hair done or braided", "Eat breakfast with family"],
  Mykah: ["Wake up when called", "Use bathroom", "Make bed — Laurel checks", "Brush teeth — PARENT VERIFIES", "Wash face and hands", "Deodorant — building the habit", "Get dressed — parent approves", "Hair combed", "Eat breakfast with family"]
};

// ── BEDTIME ROUTINE ───────────────────────────────────────────────────────────
const BEDTIME_ITEMS = {
  "8 PM — Devices Away": ["ALL phones away from kids — charging in common area", "TV off", "Tablets put away", "Tone of home shifts to quiet and calm"],
  Mykah: ["Bath or full wash-up", "Brush teeth — PARENT CHECKS", "Wash face and hands", "Pajamas on", "Small cup of water", "Settled calmly in bed"],
  Ashelyn: ["Shower or wash up", "Brush teeth 2 minutes", "Wash face", "Deodorant", "Hair braided or protected for sleep", "Pajamas on", "Final water of the night"],
  Kayla: ["Shower or wash up", "Brush teeth 2 min and floss", "Skincare — cleanse and moisturize", "Deodorant", "Hair protected for sleep", "Pajamas on", "Phone charging in common area", "Final water of the night"],
  Ryan: ["Shower or wash up", "Brush teeth 2 min and floss", "Wash face — acne care if needed", "Deodorant", "Pajamas on", "Phone charging in common area", "Final water of the night"],
  Laurel: ["Shower or wash up", "Brush teeth 2 min and floss", "Full skincare — cleanse, treat, moisturize", "Deodorant", "Hair wrapped or protected", "Pajamas on", "Final water of the night"],
  Eric: ["Shower or wash up", "Brush teeth 2 min and floss", "Face wash", "Deodorant", "Pajamas on", "Final water of the night"],
  "Dogs and S'mores'e": ["Final potty walk — Khaniikos and Skyli", "Water bowls filled and fresh", "Dogs settled in their sleeping spot", "S'mores'e checked — food, water, cage secure"],
  "9:30 PM — Bible Reading": ["ALL 6 gathered together — no exceptions", "QUIET — all devices completely away", "Read together for 30 minutes", "Close with prayer", "Everyone ready for lights out"],
  "10 PM — Lights Out": ["All kids in bed and staying there", "Lights off throughout the house", "Doors locked — front and back", "Eric and Laurel settled", "Alarms set for tomorrow morning"]
};

// ── NEXT DAY SETUP ────────────────────────────────────────────────────────────
const NEXTDAY_ITEMS = [{
  section: "Check Tomorrow",
  items: ["Is tomorrow a service day — Monday or Wednesday?", "Is tomorrow meeting night — Thursday, leave 6:30 PM?", "Is tomorrow Sunday meeting — leave 12:30 PM?", "What shift does Eric have tomorrow?", "Any VA client appointments booked?", "Any special events or appointments?"]
}, {
  section: "Service Day Prep — Mon and Wed",
  items: ["Ministry bags packed — Bible, NWT, tracts, territory map", "Water bottles filled", "Everyone's clothes accessible for morning", "Review territory or return visits to make", "Car has gas"]
}, {
  section: "School Prep",
  items: ["Check Google Classroom — any assignments due tomorrow?", "Kids reminded of what is coming up", "School area tidy and ready", "All tablets charged to 100%", "Laurel has lesson plan ready for Hour 1"]
}, {
  section: "Trash Check",
  items: ["Is today Thursday or Friday — is trash ready to go?", "Are trash bags full enough to warrant a dump run?", "Reminder: dump CLOSED Wednesdays, Saturday closes 7 PM", "Load full bags in car tonight for Friday or Saturday morning run"]
}, {
  section: "Meals and Food",
  items: ["Breakfast planned — any prep needed tonight?", "Lunch packed or planned", "Defrost anything needed for dinner tomorrow", "Dogs food measured out", "S'mores'e food checked and stocked"]
}, {
  section: "Morning Setup",
  items: ["Alarms set — 6:00 AM Eric and Laurel, 6:30 AM kids", "Coffee maker prepped", "Kids clothes laid out — check Mykah specifically", "Eric's work clothes ready", "Bags by the door for whoever leaves early", "Vitamins or medications set out"]
}, {
  section: "Home Wind-Down",
  items: ["Kitchen clean and reset for morning", "Living area tidied", "All lights off except nightlights", "Last check on animals — all settled?"]
}];

// ── SPIRITUAL PREPARATION ────────────────────────────────────────────────────
// Items marked (School) count toward ESA homeschool hours
const SPIRITUAL_PREP = {
  daily: {
    label: "Every Day — Daily Spiritual Habits",
    color: "#6a1a8e",
    school: false,
    items: ["Read the Bible — personal daily reading (all family members)", "Check JW.org — news, articles, broadcasts, updates", "Check JW Newsroom — current world events through a spiritual lens", "Check NW Publisher — log field service hours and records"]
  },
  mon: {
    label: "Monday — Morning Worship + Workbook Prep",
    color: "#5b2d8e",
    time: "7:00–8:00 AM — before breakfast and service",
    school: true,
    schoolNote: "Meeting Workbook Prep counts as Bible education + public speaking ESA",
    items: ["7:00–7:30 AM — Morning Worship — all 6 family members together", "7:00 AM — Open with a song (JW.org Songs app)", "Share a brief spiritual thought or scripture", "Close with family prayer", "7:00–8:00 AM — Meeting Workbook Preparation (CLAM)", "7:00–8:00 AM — Weekly Bible Reading — read the assigned chapters", "Mark student assignment parts for Thursday meeting", "Look up and review all scriptures in the workbook"]
  },
  tue: {
    label: "Tuesday — Family Worship Preparation",
    color: "#1050a0",
    time: "7:00–8:00 AM + 6:30 PM worship",
    school: true,
    schoolNote: "Family Worship Prep counts as Bible research and spiritual studies ESA",
    items: ["7:00–8:00 AM — Family Worship Preparation", "Choose topic or JW.org video for tonight's Family Worship", "Print or pull up any study materials needed", "Kids: review any assigned Bible reading", "Prepare questions or discussion points for worship time", "6:30 PM — FAMILY WORSHIP — all 6 together", "Open with song and prayer", "Watch JW.org video OR study a Bible topic together", "Each person shares what they learned", "Close with family prayer"]
  },
  wed: {
    label: "Wednesday — Songs + Book Study Prep + Evening Service",
    color: "#5b2d8e",
    time: "7:00–8:00 AM + 6:00 PM service",
    school: true,
    schoolNote: "Song meditation counts as music education. Book Study Prep = reading comprehension ESA",
    items: ["7:00–8:00 AM — Meditation on songs for Thursday meeting", "Listen to assigned meeting songs on JW.org", "Read and reflect on the lyrics — discuss meaning", "7:00–8:00 AM — Book Study Preparation", "Read the assigned book study material", "Look up all scriptures referenced", "Write down questions or comments to share", "6:00 PM — Evening Service", "Gather with congregation for group field service or special activity"]
  },
  thu: {
    label: "Thursday — Personal Study Preparation",
    color: "#3a1270",
    time: "7:00–8:00 AM before school",
    school: true,
    schoolNote: "Personal Study Preparation counts as self-directed learning ESA",
    items: ["7:00–8:00 AM — Personal Study Preparation", "Review all meeting workbook material one final time", "Practice any student assignment parts out loud", "Review book study material", "Prepare personal comments for tonight's meeting", "Make sure Bibles and workbooks are packed for the meeting", "Check that meeting clothes are clean and ready"]
  },
  fri: {
    label: "Friday — Watchtower Audio Study",
    color: "#7a3a00",
    time: "7:00–8:00 AM",
    school: true,
    schoolNote: "Watchtower audio study counts as listening comprehension and spiritual studies ESA",
    items: ["7:00–8:00 AM — Study Watchtower — Listen to Audio", "Open JW.org app — find this week's Watchtower article", "Listen to the audio version while following along", "Mark key paragraphs and scriptures", "Write down 1–2 comments to share on Sunday", "Older kids: find the scriptures and look them up", "After audio: check JW.org for any new articles or broadcasts"]
  },
  sat: {
    label: "Saturday — Service Prep + Morning Service",
    color: "#2d6a2d",
    time: "7:30–8:50 AM prep + 9:30 AM service",
    school: false,
    items: ["7:30–8:50 AM — GET READY FOR SERVICE MEETING", "Do your clothes need attention? Iron, steam, or spot clean NOW", "Service dress for all 6 — neat, modest, presentable", "Eric: dress shirt, dress pants, clean shoes", "Laurel: appropriate service attire", "Ryan, Kayla, Ashelyn: neat service clothes", "Mykah: Laurel checks outfit", "Pack service bags: Bible, NWT, tracts, territory map, water", "Review territory or return visits to make today", "Leave for service at 9:00 AM to arrive by 9:30 AM", "9:30 AM — Morning Service — whole family", "Meet at Kingdom Hall or designated group meeting point"]
  },
  sun: {
    label: "Sunday — Watchtower Study + Family Meeting",
    color: "#1e3a8c",
    time: "9:00 AM study + 6:00–7:00 PM family meeting",
    school: true,
    schoolNote: "Watchtower group study counts as discussion, critical thinking, and Bible studies ESA",
    items: ["9:00 AM — Study Watchtower with Eric and Laurel", "Read all paragraphs of this week's Watchtower article", "Discuss the questions at the bottom of each paragraph", "Kids: look up and read aloud the key scriptures", "Everyone prepare at least 1 comment for the meeting", "Review all meeting materials before leaving at 12:30 PM", "6:00–7:00 PM — Weekly Family Meeting + School Scheduling", "Review how the week went — spiritual highlights", "Plan next week's school schedule — Google Classroom", "Set VA appointment slots for the week", "Review any field service plans or return visits", "Assign rotating chores for the new week", "Quick calendar check — any special events coming?", "Close with prayer and encouragement for the week ahead"]
  }
};
const SPIRITUAL_ORDER = ["daily", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const SPIRITUAL_LABELS = {
  daily: "Daily",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun"
};

// V9 DAYS
// ── SCHEDULE DATA ─────────────────────────────────────────────────────────────
const DAYS = {
  mon: {
    label: "Monday — Service Day",
    sub: "Home to Hall 30min · Service 9–12:45 · Hall to Home · School+VA 1:15–6:15",
    tags: [{
      l: "Service 9–12:45",
      c: C.service
    }, {
      l: "School+VA 1:15–6:15",
      c: C.school
    }, {
      l: "Eric to Delta 2–10",
      c: C.molding
    }],
    dc: "#5b2d8e",
    blocks: [{
      t: "6:00",
      title: "Eric and Laurel wake up",
      sub: "Eric drives Hall to Delta after service today",
      c: C.wake,
      alarm: true
    }, {
      t: "6:30",
      title: "Wake kids + dogs walk 1",
      sub: "Ryan, Kayla, Ashelyn, Mykah — morning hygiene",
      c: C.wake,
      alarm: true
    }, {
      t: "7:30",
      title: "Breakfast + Daily Text",
      sub: "All 6 together",
      c: C.devotion,
      alarm: true
    }, {
      t: "8:30",
      title: "Leave home — Kingdom Hall",
      sub: "30 min — 250 Wesley Amaker Rd York SC",
      c: C.commute,
      alarm: true
    }, {
      t: "9:00",
      title: "Field Service — Whole Family",
      sub: "3 hrs 45 min — door-to-door, return visits, Bible studies",
      c: C.service
    }, {
      t: "12:45",
      title: "Leave Hall — split",
      sub: "Eric to Delta direct — Laurel and kids drive home 30 min",
      c: C.commute,
      alarm: true
    }, {
      t: "1:15",
      title: "Home — settle in — S'mores'e check",
      sub: "Quick bathroom, water, ready to work",
      c: C.wake
    }, {
      t: "1:15",
      title: "Hour 1 — Laurel teaches",
      sub: "Lecture all 4 kids — Google Classroom open",
      c: C.school,
      alarm: true
    }, {
      t: "2:00",
      title: "Eric — Delta shift begins",
      sub: "9315 Stockport Pl Charlotte NC — 2 PM to 10 PM",
      c: C.molding
    }, {
      t: "2:15",
      title: "VA Slots begin — kids on independent work",
      sub: "Guided work, ESA, independent — Laurel does client slots",
      c: C.business,
      alarm: true
    }, {
      t: "3:15",
      title: "Kids free time",
      sub: "Anything they want — Laurel still on VA",
      c: C.free,
      free: true
    }, {
      t: "4:00",
      title: "Hydration break",
      sub: "Everyone stops and drinks water",
      c: C.hydration,
      alarm: true
    }, {
      t: "5:30",
      title: "Kids start dinner — dogs meal",
      sub: "Ryan or Kayla leads cooking — feed Khaniikos and Skyli",
      c: C.meal
    }, {
      t: "6:15",
      title: "School done — VA done",
      sub: "All Classroom work submitted — clients wrapped",
      c: C.school,
      alarm: true
    }, {
      t: "6:30",
      title: "Dinner — Laurel and kids",
      sub: "Eric at Delta — plate in fridge",
      c: C.meal,
      alarm: true
    }, {
      t: "7:00",
      title: "Hydration + dogs final walk",
      c: C.hydration,
      alarm: true
    }, {
      t: "7:30",
      title: "Personal study — JW.org — Newsroom",
      sub: "Laurel and older kids",
      c: C.prep
    }, {
      t: "8:00",
      title: "Bedtime hygiene — all kids",
      sub: "See Bedtime Checklist tab",
      c: C.sleep,
      alarm: true
    }, {
      t: "9:30",
      title: "Bible Reading — QUIET — all 6",
      sub: "30 min — no devices — close with prayer",
      c: C.worship,
      alarm: true
    }, {
      t: "10:00",
      title: "Lights out",
      c: C.sleep,
      alarm: true
    }, {
      t: "10:30",
      title: "Eric arrives home",
      sub: "Dinner in fridge",
      c: C.commute
    }]
  },
  tue: {
    label: "Tuesday — School + VA + Family Worship",
    sub: "School+VA 8–1 (5 hrs) — Eric 8:30 to 9–5 — Home 5:30 — Worship 7 PM",
    tags: [{
      l: "School+VA 8–1 PM",
      c: C.school
    }, {
      l: "Eric 8:30 to 9–5",
      c: C.molding
    }, {
      l: "Worship 7 PM",
      c: C.worship
    }],
    dc: "#1050a0",
    blocks: [{
      t: "6:00",
      title: "Eric and Laurel wake up",
      sub: "Eric leaves 8:30 — home 5:30",
      c: C.wake,
      alarm: true
    }, {
      t: "6:30",
      title: "Wake kids + morning hygiene",
      sub: "All 4 — see Morning Checklist tab",
      c: C.wake,
      alarm: true
    }, {
      t: "7:30",
      title: "Breakfast + Daily Text",
      sub: "All 6 together",
      c: C.devotion,
      alarm: true
    }, {
      t: "8:00",
      title: "Hour 1 — Laurel teaches",
      sub: "Eric present for first 30 min of school",
      c: C.school,
      alarm: true
    }, {
      t: "8:30",
      title: "Eric leaves — Delta",
      sub: "30 min drive — arrives 9:00 AM",
      c: C.commute,
      alarm: true
    }, {
      t: "9:00",
      title: "VA Slots begin — kids independent work",
      sub: "Client slots 9 AM to 1 PM — 8 slots of 30 min",
      c: C.business
    }, {
      t: "9:00",
      title: "Eric — Delta — 9 AM to 5 PM",
      c: C.molding
    }, {
      t: "10:00",
      title: "Hydration break",
      c: C.hydration,
      alarm: true
    }, {
      t: "1:00",
      title: "School done — VA done",
      sub: "5-hour block complete",
      c: C.school,
      alarm: true
    }, {
      t: "1:00",
      title: "Free time — kids and Laurel",
      sub: "2.5 hrs — rest, outside, games",
      c: C.free,
      free: true
    }, {
      t: "1:30",
      title: "Lunch + hydration",
      sub: "S'mores'e check",
      c: C.meal,
      alarm: true
    }, {
      t: "3:30",
      title: "Hydration + exercise",
      sub: "60 min — Laurel, kids, Khaniikos and Skyli",
      c: C.exercise,
      alarm: true
    }, {
      t: "5:00",
      title: "Dinner prep + dogs meal",
      sub: "Ready for Eric coming home",
      c: C.meal,
      alarm: true
    }, {
      t: "5:30",
      title: "Eric arrives home",
      sub: "30 min from Delta — 1.5 hrs before worship",
      c: C.commute,
      alarm: true
    }, {
      t: "5:30",
      title: "Dinner — all 6 together",
      sub: "Eric eats with the whole family",
      c: C.meal
    }, {
      t: "6:30",
      title: "Hydration — everyone freshens up",
      c: C.hydration,
      alarm: true
    }, {
      t: "7:00",
      title: "FAMILY WORSHIP",
      sub: "All 6 — 1 hour — songs, Bible discussion, prayer — no devices",
      c: C.worship,
      alarm: true
    }, {
      t: "8:00",
      title: "Bedtime hygiene — all 6",
      sub: "See Bedtime Checklist tab",
      c: C.sleep,
      alarm: true
    }, {
      t: "9:30",
      title: "Bible Reading — QUIET",
      sub: "All 6 — 30 min",
      c: C.worship,
      alarm: true
    }, {
      t: "10:00",
      title: "Lights Out",
      c: C.sleep,
      alarm: true
    }]
  },
  wed: {
    label: "Wednesday — Service Day",
    sub: "Home to Hall 30min · Service 9–12:45 · Hall to Home · School+VA 1:15–6:15",
    tags: [{
      l: "Service 9–12:45",
      c: C.service
    }, {
      l: "School+VA 1:15–6:15",
      c: C.school
    }, {
      l: "Eric to Delta 2–10",
      c: C.molding
    }],
    dc: "#5b2d8e",
    blocks: [{
      t: "6:00",
      title: "Eric and Laurel wake up",
      sub: "Same flow as Monday",
      c: C.wake,
      alarm: true
    }, {
      t: "6:30",
      title: "Wake kids + dogs walk — S'mores'e check",
      c: C.wake,
      alarm: true
    }, {
      t: "7:30",
      title: "Breakfast + Daily Text",
      c: C.devotion,
      alarm: true
    }, {
      t: "8:30",
      title: "Leave home — Kingdom Hall",
      sub: "30 min — York SC",
      c: C.commute,
      alarm: true
    }, {
      t: "9:00",
      title: "Field Service — Whole Family",
      sub: "3 hrs 45 min — rabbit crate wash when home",
      c: C.service
    }, {
      t: "12:45",
      title: "Leave Hall — split",
      sub: "Eric to Delta — Laurel and kids home",
      c: C.commute,
      alarm: true
    }, {
      t: "1:15",
      title: "Home — S'mores'e crate wash now",
      c: C.wake
    }, {
      t: "1:15",
      title: "Hour 1 — Laurel teaches",
      sub: "All 4 kids — Google Classroom",
      c: C.school,
      alarm: true
    }, {
      t: "2:00",
      title: "Eric — Delta — 2 PM to 10 PM",
      c: C.molding
    }, {
      t: "2:15",
      title: "VA Slots begin — kids independent",
      sub: "Client slots 2:15 to 6:15 — 8 slots of 30 min",
      c: C.business,
      alarm: true
    }, {
      t: "3:15",
      title: "Kids free time",
      sub: "Anything they want",
      c: C.free,
      free: true
    }, {
      t: "4:00",
      title: "Hydration break",
      c: C.hydration,
      alarm: true
    }, {
      t: "5:30",
      title: "Kids start dinner — dogs meal",
      c: C.meal
    }, {
      t: "6:15",
      title: "School done — VA done",
      c: C.school,
      alarm: true
    }, {
      t: "6:30",
      title: "Dinner — Laurel and kids",
      sub: "Eric at Delta — plate saved",
      c: C.meal,
      alarm: true
    }, {
      t: "7:00",
      title: "Hydration + dogs final walk",
      c: C.hydration,
      alarm: true
    }, {
      t: "7:30",
      title: "Watchtower + JW.org + Newsroom",
      c: C.prep
    }, {
      t: "8:00",
      title: "Bedtime hygiene — all kids",
      sub: "Laurel solo tonight — see Bedtime Checklist",
      c: C.sleep,
      alarm: true
    }, {
      t: "9:30",
      title: "Bible Reading — QUIET",
      sub: "Kids and Laurel",
      c: C.worship,
      alarm: true
    }, {
      t: "10:00",
      title: "Lights out",
      c: C.sleep,
      alarm: true
    }, {
      t: "10:30",
      title: "Eric arrives home",
      sub: "Dinner in fridge",
      c: C.commute
    }]
  },
  thu: {
    label: "Thursday — School + VA + Meeting Night",
    sub: "School+VA 8–1 — Eric 8:30 to 9–5 — Home 5:30 — Leave 6:30",
    tags: [{
      l: "School+VA 8–1 PM",
      c: C.school
    }, {
      l: "Eric 8:30 to 9–5",
      c: C.molding
    }, {
      l: "Meeting 7 PM",
      c: C.meeting
    }],
    dc: "#3a1270",
    blocks: [{
      t: "6:00",
      title: "Eric and Laurel wake up",
      sub: "Eric home 5:30 — meeting tonight",
      c: C.wake,
      alarm: true
    }, {
      t: "6:30",
      title: "Wake kids + morning hygiene",
      sub: "See Morning Checklist tab",
      c: C.wake,
      alarm: true
    }, {
      t: "7:30",
      title: "Breakfast + Daily Text",
      c: C.devotion,
      alarm: true
    }, {
      t: "8:00",
      title: "Hour 1 — Laurel teaches",
      sub: "Eric present 30 min",
      c: C.school,
      alarm: true
    }, {
      t: "8:30",
      title: "Eric leaves — Delta",
      sub: "30 min — arrives 9:00 AM",
      c: C.commute,
      alarm: true
    }, {
      t: "9:00",
      title: "VA Slots begin — kids independent",
      sub: "8 slots 30 min each — 9 AM to 1 PM",
      c: C.business
    }, {
      t: "9:00",
      title: "Eric — Delta — 9 AM to 5 PM",
      c: C.molding
    }, {
      t: "10:00",
      title: "Hydration break",
      c: C.hydration,
      alarm: true
    }, {
      t: "1:00",
      title: "School done — VA done",
      c: C.school,
      alarm: true
    }, {
      t: "1:00",
      title: "Lunch + hydration — S'mores'e check",
      c: C.meal,
      alarm: true
    }, {
      t: "1:00",
      title: "Free time — 1 hour",
      sub: "Rest before meeting prep",
      c: C.free,
      free: true
    }, {
      t: "2:00",
      title: "CLAM Workbook Prep",
      sub: "45 min — meeting workbook and student assignments",
      c: C.prep
    }, {
      t: "2:45",
      title: "Book Study Prep + Personal Study",
      sub: "45 min — review weeks material",
      c: C.prep
    }, {
      t: "3:30",
      title: "Exercise + free time",
      sub: "60 min — kids, Laurel, dogs",
      c: C.exercise,
      alarm: true
    }, {
      t: "4:30",
      title: "Bathroom Rotation — Meeting Ready",
      sub: "Laurel 4:30 — Ryan 4:50 — Kayla 5:10 — Ashelyn 5:30 — Mykah 5:50",
      c: C.bath,
      alarm: true
    }, {
      t: "5:30",
      title: "Eric home — quick dinner — dogs meal",
      sub: "All 6 eat — Eric changes for meeting",
      c: C.commute,
      alarm: true
    }, {
      t: "6:00",
      title: "Hydration — final gather",
      sub: "Watchtower, workbook, bags — all 6 at door",
      c: C.hydration,
      alarm: true
    }, {
      t: "6:30",
      title: "Leave — all 6 — 250 Wesley Amaker Rd York SC",
      sub: "30 min drive",
      c: C.meeting,
      alarm: true
    }, {
      t: "7:00",
      title: "Midweek Meeting — approx 2 hours",
      sub: "All 6 — CLAM program",
      c: C.meeting
    }, {
      t: "9:00",
      title: "Drive home — arrive 9:30",
      c: C.meeting
    }, {
      t: "9:30",
      title: "Bible Reading — QUIET",
      sub: "All 6 — 30 min",
      c: C.worship,
      alarm: true
    }, {
      t: "10:00",
      title: "Lights Out",
      c: C.sleep,
      alarm: true
    }]
  },
  fri: {
    label: "Friday — School + VA + Fun Night",
    sub: "School+VA 8–1 — Eric 9:30 to 10–6 — Home 6:30 — Fun Night",
    tags: [{
      l: "School+VA 8–1 PM",
      c: C.school
    }, {
      l: "Eric 9:30 to 10–6",
      c: C.molding
    }, {
      l: "Fun Night 6:30",
      c: C.rec
    }],
    dc: "#7a3a00",
    blocks: [{
      t: "6:00",
      title: "Eric and Laurel wake up",
      sub: "Eric home 6:30 — fun night tonight",
      c: C.wake,
      alarm: true
    }, {
      t: "6:30",
      title: "Wake kids + morning hygiene",
      c: C.wake,
      alarm: true
    }, {
      t: "7:30",
      title: "Breakfast + Daily Text",
      sub: "All 6 — Eric present",
      c: C.devotion,
      alarm: true
    }, {
      t: "8:00",
      title: "Hour 1 — Laurel teaches",
      sub: "Eric present until 9:30",
      c: C.school,
      alarm: true
    }, {
      t: "9:00",
      title: "VA Slots begin — kids independent",
      sub: "9 AM to 1 PM — 8 slots",
      c: C.business
    }, {
      t: "9:30",
      title: "Eric leaves — Delta",
      sub: "30 min — arrives 10:00 AM",
      c: C.commute,
      alarm: true
    }, {
      t: "10:00",
      title: "Eric — Delta — 10 AM to 6 PM",
      c: C.molding
    }, {
      t: "10:00",
      title: "Hydration break",
      c: C.hydration,
      alarm: true
    }, {
      t: "1:00",
      title: "School done — VA done — TGIF",
      c: C.school,
      alarm: true
    }, {
      t: "1:00",
      title: "Lunch + hydration — S'mores'e check",
      c: C.meal,
      alarm: true
    }, {
      t: "2:00",
      title: "JW.org + Newsroom + Territory Prep",
      sub: "Field service prep for Monday — 1 hour",
      c: C.prep
    }, {
      t: "3:00",
      title: "Free Time — 2 hours — best weekday block",
      sub: "Rest, outside, games — Laurel and kids",
      c: C.free,
      free: true
    }, {
      t: "3:30",
      title: "Hydration + exercise",
      sub: "60 min — kids and dogs",
      c: C.exercise,
      alarm: true
    }, {
      t: "5:00",
      title: "Dinner prep + dogs meal",
      sub: "Ready when Eric walks in",
      c: C.meal,
      alarm: true
    }, {
      t: "6:30",
      title: "Eric arrives home — Family Fun Night",
      sub: "Movie, games, park walk — Khaniikos, Skyli, S'mores'e",
      c: C.park,
      alarm: true
    }, {
      t: "8:00",
      title: "Bedtime hygiene — all 6",
      sub: "See Bedtime Checklist tab",
      c: C.sleep,
      alarm: true
    }, {
      t: "9:30",
      title: "Bible Reading — QUIET",
      sub: "All 6 — 30 min",
      c: C.worship,
      alarm: true
    }, {
      t: "10:00",
      title: "Lights Out",
      c: C.sleep,
      alarm: true
    }]
  },
  sat: {
    label: "Saturday — Eric OFF — Most Free Day",
    sub: "Chores, Groceries, Park 2–4 PM, Free Evening",
    tags: [{
      l: "Park 2–4 PM",
      c: C.park
    }, {
      l: "Chores",
      c: C.chores
    }, {
      l: "Free Evening",
      c: C.rec
    }],
    dc: "#2d6a2d",
    blocks: [{
      t: "7:00",
      title: "Wake up — all 6",
      sub: "Eric fully OFF — relax",
      c: C.wake,
      alarm: true
    }, {
      t: "7:30",
      title: "Breakfast + Daily Text",
      c: C.devotion,
      alarm: true
    }, {
      t: "8:30",
      title: "Morning hygiene + dogs walk + S'mores'e",
      c: C.hydration
    }, {
      t: "9:00",
      title: "Free time — slow morning",
      sub: "Eric and Laurel: coffee and rest — Kids: TV, games",
      c: C.free,
      free: true
    }, {
      t: "10:00",
      title: "Grocery shopping + errands",
      sub: "Weekly run — meal plan — food for all 3 animals",
      c: C.chores
    }, {
      t: "11:30",
      title: "Saturday chores",
      sub: "See Chores Checklist tab — kids assigned zones",
      c: C.chores
    }, {
      t: "12:30",
      title: "Lunch + hydration",
      sub: "S'mores'e crate wash today",
      c: C.meal,
      alarm: true
    }, {
      t: "2:00",
      title: "PARK — Whole Family",
      sub: "Eric, Laurel, Ryan, Kayla, Ashelyn, Mykah — Khaniikos, Skyli, S'mores'e — 2 hours",
      c: C.park,
      alarm: true
    }, {
      t: "4:00",
      title: "Hydration — home",
      sub: "Animals settled",
      c: C.hydration,
      alarm: true
    }, {
      t: "4:00",
      title: "Free time — couple time + kids",
      sub: "Eric and Laurel: couple time together\nKids: phones, games, outside",
      c: C.free,
      free: true
    }, {
      t: "5:00",
      title: "Dinner prep + dogs meal",
      c: C.meal,
      alarm: true
    }, {
      t: "5:30",
      title: "Dinner — all 6",
      c: C.meal
    }, {
      t: "6:30",
      title: "Evening rec time",
      sub: "Movie, games, family choice — 1.5 hours free",
      c: C.rec,
      free: true
    }, {
      t: "8:00",
      title: "Bedtime hygiene — all 6",
      sub: "See Bedtime Checklist tab",
      c: C.sleep,
      alarm: true
    }, {
      t: "9:30",
      title: "Bible Reading — QUIET",
      sub: "All 6 — 30 min",
      c: C.worship,
      alarm: true
    }, {
      t: "10:00",
      title: "Lights Out",
      c: C.sleep,
      alarm: true
    }]
  },
  sun: {
    label: "Sunday — Meeting + Clean + Meal Prep",
    sub: "Watchtower 9 AM — Meeting 1 PM York SC — Cleaning 3:30 — Free 6 PM",
    tags: [{
      l: "Watchtower 9 AM",
      c: C.prep
    }, {
      l: "Meeting 1 PM",
      c: C.meeting
    }, {
      l: "Clean 3:30",
      c: C.chores
    }, {
      l: "Free 6 PM",
      c: C.free
    }],
    dc: "#1e3a8c",
    blocks: [{
      t: "7:00",
      title: "Eric and Laurel wake up",
      sub: "Coffee — personal spiritual time",
      c: C.wake,
      alarm: true
    }, {
      t: "7:30",
      title: "Breakfast + Daily Text",
      c: C.devotion,
      alarm: true
    }, {
      t: "8:00",
      title: "Kids up + hygiene — dogs — S'mores'e",
      c: C.wake
    }, {
      t: "8:30",
      title: "Hydration",
      c: C.hydration,
      alarm: true
    }, {
      t: "9:00",
      title: "Watchtower Preparation — all 6",
      sub: "Eric and Laurel study together — 1 hour — kids look up scriptures",
      c: C.prep,
      alarm: true
    }, {
      t: "10:00",
      title: "Bathroom Rotation — Meeting Prep",
      sub: "Eric 10:00 — Laurel 10:20 — Ryan 10:40 — Kayla 11:00 — Ashelyn 11:20 — Mykah 11:40",
      c: C.bath,
      alarm: true
    }, {
      t: "12:00",
      title: "Hydration — final gather",
      sub: "All dressed — Watchtower — bags — at door",
      c: C.hydration,
      alarm: true
    }, {
      t: "12:30",
      title: "Leave — all 6 — 250 Wesley Amaker Rd York SC",
      c: C.meeting,
      alarm: true
    }, {
      t: "1:00",
      title: "Sunday Meeting — Watchtower Study — approx 2 hours",
      sub: "All 6",
      c: C.meeting
    }, {
      t: "3:00",
      title: "Drive home — arrive 3:30 — dogs out immediately",
      c: C.meeting
    }, {
      t: "3:30",
      title: "Apartment Clean + Week Meal Prep",
      sub: "All hands — 2 hours — kids each assigned zone",
      c: C.chores,
      alarm: true
    }, {
      t: "5:30",
      title: "Dinner + dogs meal",
      sub: "Use meal prepped food",
      c: C.meal,
      alarm: true
    }, {
      t: "6:00",
      title: "Free Time — 2 hours",
      sub: "Park walk if weather is nice — S'mores'e evening check",
      c: C.park,
      free: true
    }, {
      t: "7:30",
      title: "Hydration",
      c: C.hydration,
      alarm: true
    }, {
      t: "8:00",
      title: "Bedtime hygiene — all 6",
      sub: "Full routine — see Bedtime Checklist",
      c: C.sleep,
      alarm: true
    }, {
      t: "9:30",
      title: "Bible Reading — QUIET",
      sub: "All 6 — 30 min",
      c: C.worship,
      alarm: true
    }, {
      t: "10:00",
      title: "Lights Out",
      c: C.sleep,
      alarm: true
    }]
  }
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
const ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const LABELS = {
  mon: "MON",
  tue: "TUE",
  wed: "WED",
  thu: "THU",
  fri: "FRI",
  sat: "SAT",
  sun: "SUN"
};
const DCLR = {
  mon: "#5b2d8e",
  tue: "#1050a0",
  wed: "#5b2d8e",
  thu: "#3a1270",
  fri: "#7a3a00",
  sat: "#2d6a2d",
  sun: "#1e3a8c"
};
const TODAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];

// V9 COMPONENTS
// ── CheckableBlock — schedule event with checkbox, edit, done state ──────────
var _schedDone = {};
var _schedDoneKey = '';
function _loadSchedDone(){
  var k = 'sched_done_' + new Date().toISOString().split('T')[0];
  if(k !== _schedDoneKey){
    _schedDoneKey = k;
    try{ _schedDone = JSON.parse(localStorage.getItem(k)||'{}'); }catch{ _schedDone = {}; }
  }
  return _schedDone;
}
function _saveSchedDone(){
  localStorage.setItem(_schedDoneKey, JSON.stringify(_schedDone));
  // Also sync to Firebase so all devices see today's completed items
  syncSet('sched_done/'+_schedDoneKey.replace('sched_done_',''), _schedDone);
}

function Block({ b, onUpdate, onDelete, isAdmin }) {
  const isFree = b.free;
  const isCommute = b.c === C.commute;
  _loadSchedDone();
  const [done, setDone] = useState(!!_schedDone[b.id]);
  const [editing, setEditing] = useState(false);
  const [eTime, setETime] = useState(b.t||'');
  const [eTitle, setETitle] = useState(b.title||'');
  const [eSub, setESub] = useState(b.sub||'');
  const col = b.c || '#7986CB';

  function toggleDone(){
    const next = !done;
    setDone(next);
    _schedDone[b.id] = next;
    _saveSchedDone();
    if(next && window._creditFn && window._currentPersonId){
      window._creditFn(window._currentPersonId, 5, '✅ ' + (b.title||b.t||'Schedule item'), 'sched_'+b.id);
    }
  }

  function saveEdit(){
    if(onUpdate) onUpdate(b.id, {t:eTime, title:eTitle, sub:eSub});
    setEditing(false);
  }

  if(editing){
    return React.createElement('div', {style:{
      marginBottom:6, borderRadius:10, border:`2px solid ${col}`,
      background:'rgba(0,0,0,.2)', padding:10
    }},
      React.createElement('div',{style:{display:'flex',gap:5,marginBottom:5}},
        React.createElement('input',{type:'text', value:eTime,
          onChange:e=>setETime(e.target.value), placeholder:'Time (e.g. 9:00 AM)',
          style:{width:100,background:'rgba(255,255,255,.08)',border:`1px solid ${col}44`,
            borderRadius:6,padding:'5px 8px',color:'#fff',fontSize:12}}),
        React.createElement('input',{type:'text', value:eTitle,
          onChange:e=>setETitle(e.target.value), placeholder:'Event title',
          autoCorrect:'on', autoCapitalize:'words',
          style:{flex:1,background:'rgba(255,255,255,.08)',border:`1px solid ${col}44`,
            borderRadius:6,padding:'5px 8px',color:'#fff',fontSize:12}})
      ),
      React.createElement('input',{type:'text', value:eSub,
        onChange:e=>setESub(e.target.value), placeholder:'Details (optional)',
        autoCorrect:'on', autoCapitalize:'sentences',
        style:{width:'100%',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.1)',
          borderRadius:6,padding:'5px 8px',color:'#fff',fontSize:11,marginBottom:6}}),
      React.createElement('div',{style:{display:'flex',gap:6}},
        React.createElement('button',{onClick:saveEdit,
          style:{flex:1,background:col,color:'#000',border:'none',borderRadius:20,
            padding:'6px',fontWeight:800,fontSize:11,cursor:'pointer'}},'✓ Save'),
        onDelete && React.createElement('button',{
          onClick:()=>{if(window._safeConfirm('Delete this event?'))onDelete(b.id);},
          style:{padding:'6px 12px',background:'rgba(239,83,80,.1)',color:'#EF5350',
            border:'1px solid rgba(239,83,80,.2)',borderRadius:20,fontSize:10,cursor:'pointer'}},
          '🗑'),
        React.createElement('button',{onClick:()=>setEditing(false),
          style:{padding:'6px 12px',background:'rgba(255,255,255,.06)',color:'#aaa',
            border:'none',borderRadius:20,fontSize:10,cursor:'pointer'}},'✕')
      )
    );
  }

  return React.createElement('div', {style:{
    display:'flex', marginBottom:6, borderRadius:10, overflow:'hidden',
    border: done ? '1px solid rgba(76,175,82,.25)' : (isFree ? '1.5px dashed #3a5a3a88' : '1px solid ' + col + '22'),
    background: done ? 'rgba(76,175,82,.04)' : (isFree ? '#f0faf0' : isCommute ? '#f0f4ff' : '#fff'),
    opacity: done ? 0.5 : 1, transition:'all .25s'
  }},
    // Checkbox
    React.createElement('button', {onClick:toggleDone, style:{
      width:38, flexShrink:0, background:done?'rgba(76,175,82,.15)':'rgba(0,0,0,.04)',
      border:'none', borderRight:'1px solid rgba(0,0,0,.06)', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center', fontSize:16
    }}, done ? '✅' : '○'),
    // Time column
    React.createElement('div', {style:{
      width:50, flexShrink:0, background:done?'rgba(76,175,82,.1)': (isFree ? '#3a5a3a33' : col),
      padding:'9px 3px', display:'flex', alignItems:'flex-start', justifyContent:'center',
      fontSize:9, fontWeight:700, color:isFree?'#2d6a2d':'rgba(255,255,255,0.92)',
      textAlign:'center', lineHeight:1.3,
      textDecoration:done?'line-through':'none'
    }}, done?'✓':b.t),
    // Content
    React.createElement('div', {style:{flex:1, padding:'9px 10px'}},
      React.createElement('div', {style:{
        fontSize:13, fontWeight:700, color:done?'#555':(isFree?'#2d6a2d':col),
        lineHeight:1.3, textDecoration:done?'line-through':'none'
      }},
        b.alarm && !isFree && React.createElement('span',{style:{fontSize:9,marginRight:3}},'🔔'),
        isFree && React.createElement('span',{style:{fontSize:9,marginRight:3}},'⬜'),
        b.title
      ),
      b.sub && React.createElement('div', {style:{
        fontSize:11, color:done?'#666':(isFree?'#3a5a3a':isCommute?'#3a5a9a':'#5a5a5a'),
        marginTop:3, lineHeight:1.45, textDecoration:done?'line-through':'none'
      }}, b.sub)
    ),
    // Edit button — admin only; children get request button
    isAdmin
      ? React.createElement('button', {onClick:()=>setEditing(true), style:{
          background:'transparent', border:'none', color:'rgba(0,0,0,.15)',
          fontSize:14, cursor:'pointer', padding:'6px 8px', alignSelf:'center', flexShrink:0
        }}, '✏️')
      : React.createElement('button', {
          onClick:()=>{
            const req = null; // Schedule requests use the messaging system instead
            if(req&&req.trim()){
              // Store as a pending schedule request
              const reqData = {
                id: 'req_'+Date.now(),
                from: window._currentPersonId || 'child',
                type: 'schedule_change',
                blockTitle: b.title,
                request: req.trim(),
                ts: Date.now(),
                status: 'pending'
              };
              if(typeof syncSet === 'function') syncSet('schedule_requests/'+reqData.id, reqData);
              // Also add to the notifs system so admin sees it with Approve/Deny buttons
              const notifId = 'sched_req_'+reqData.id;
              if(typeof syncSet === 'function') syncSet('notifs/'+notifId, {
                id: notifId,
                type: 'schedule_request',
                personId: reqData.from,
                personName: window._currentPersonName || reqData.from,
                title: '📋 Schedule Request from ' + (window._currentPersonName||'child'),
                message: 'Change/add to "'+b.title+'": '+req.trim(),
                blockTitle: b.title,
                requestText: req.trim(),
                reqDataId: reqData.id,
                timestamp: Date.now(),
                read: false,
                approved: null,
                adminNote: ''
              });
              // Push notification to admin
              if(window._sendNotif) window._sendNotif(
                '📋 Schedule request from '+(window._currentPersonName||'child'),
                'Change/add to "'+b.title+'": '+req.trim()
              );
              alert('✅ Your request was sent to Laurel for approval!\nShe will approve or deny it shortly.');
            }
          },
          style:{
            background:'transparent', border:'1px solid rgba(0,0,0,.1)',
            color:'rgba(0,0,0,.3)', fontSize:9, cursor:'pointer',
            padding:'4px 8px', alignSelf:'center', flexShrink:0, borderRadius:10,
            fontWeight:700
          }
        }, '🙋 Ask')
  );
}
function SpiritualPrep() {
  const [activeDay, setActiveDay] = useState("daily");
  const [checks, setChecks] = useState({});
  useEffect(() => {
    const load = async () => {
      try {
        const r = await window.storage.get("spirit-v1");
        if (r) setChecks(JSON.parse(r.value));
      } catch (e) {}
    };
    load();
  }, []);
  const toggle = key => {
    const u = {
      ...checks,
      [key]: !checks[key]
    };
    setChecks(u);
    window.storage.set("spirit-v1", JSON.stringify(u)).catch(() => {});
  };
  const resetDay = day => {
    const u = {
      ...checks
    };
    Object.keys(u).forEach(k => {
      if (k.startsWith("sp-" + day + "-")) delete u[k];
    });
    setChecks(u);
    window.storage.set("spirit-v1", JSON.stringify(u)).catch(() => {});
  };
  const d = SPIRITUAL_PREP[activeDay];
  const doneCount = d.items.filter((_, i) => checks["sp-" + activeDay + "-" + i]).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#5b2d8e,#3a1270)",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: "#fff",
      marginBottom: 3
    }
  }, "📚", " JW Spiritual Preparation"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#c8b0e8",
      lineHeight: 1.5
    }
  }, "Daily habits \xB7 Weekly preparation \xB7 Some items count as ESA school hours")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#f2fdf6",
      border: "1.5px solid #52c47a",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#1a6e38",
      marginBottom: 4
    }
  }, "📚", " Counts toward ESA School Hours"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#3a7a50",
      lineHeight: 1.5
    }
  }, "Meeting Workbook Prep \xB7 Family Worship Prep \xB7 Meditation on Songs \xB7 Book Study Preparation \xB7 Personal Study \xB7 Watchtower Audio \xB7 Watchtower Group Study \u2014 all qualify as homeschool curriculum.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      overflowX: "auto",
      paddingBottom: 5,
      marginBottom: 12
    }
  }, SPIRITUAL_ORDER.map(key => {
    const dp = SPIRITUAL_PREP[key];
    const done = dp.items.filter((_, i) => checks["sp-" + key + "-" + i]).length;
    const isActive = activeDay === key;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      onClick: () => setActiveDay(key),
      style: {
        flexShrink: 0,
        padding: "6px 10px",
        borderRadius: 20,
        border: "none",
        background: isActive ? dp.color : "#e8e0d4",
        color: isActive ? "#fff" : "#7a6a5a",
        fontFamily: "inherit",
        fontSize: 10,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: isActive ? "0 2px 8px " + dp.color + "55" : "none"
      }
    }, SPIRITUAL_LABELS[key], done > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 4,
        fontSize: 8,
        opacity: 0.8
      }
    }, done, "/", dp.items.length));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: "1px solid " + d.color + "33",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: d.color,
      marginBottom: 2
    }
  }, d.label), d.time && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#888",
      marginBottom: 3
    }
  }, "🕐", " ", d.time), d.school && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      fontSize: 9,
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: 10,
      background: "#e8f5e8",
      color: "#1a6e38",
      border: "1px solid #c8e8c8"
    }
  }, "📚", " Counts as ESA school")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: d.color
    }
  }, doneCount, "/", d.items.length), /*#__PURE__*/React.createElement("button", {
    onClick: () => resetDay(activeDay),
    style: {
      fontSize: 9,
      padding: "2px 7px",
      borderRadius: 10,
      border: "1px solid #e0d8cc",
      background: "#fff",
      color: "#888",
      fontFamily: "inherit",
      cursor: "pointer",
      marginTop: 3
    }
  }, "Reset"))), d.schoolNote && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#3a7a50",
      background: "#f0faf0",
      padding: "5px 8px",
      borderRadius: 6,
      marginBottom: 6
    }
  }, d.schoolNote)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      borderRadius: 2,
      background: "#e8e0d4",
      marginBottom: 12,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      borderRadius: 2,
      background: d.color,
      width: doneCount / d.items.length * 100 + "%",
      transition: "width 0.3s"
    }
  })), d.items.map((item, i) => {
    const id = "sp-" + activeDay + "-" + i;
    const done = !!checks[id];
    const isHeader = item.includes(" AM —") || item.includes(" PM —") || item.includes(" PM —");
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => toggle(id),
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 9,
        padding: isHeader ? "10px 10px 6px" : "8px 10px",
        background: done ? "#f0faf0" : isHeader ? "#faf5ff" : "#fff",
        border: "0.5px solid " + (done ? "#52c47a" : isHeader ? d.color + "33" : "#e0d8cc"),
        borderRadius: 8,
        marginBottom: 5,
        cursor: "pointer"
      }
    }, !isHeader && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 4,
        flexShrink: 0,
        marginTop: 1,
        border: "1.5px solid " + (done ? "#2d6a2d" : "#c0c0c0"),
        background: done ? "#2d6a2d" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, done && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "#fff",
        lineHeight: 1
      }
    }, "✓")), isHeader && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        marginTop: 1
      }
    }, "📚"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: isHeader ? 12 : 12,
        fontWeight: isHeader ? 700 : 400,
        color: done ? "#5a8a5a" : isHeader ? d.color : "#3a2e22",
        textDecoration: done && !isHeader ? "line-through" : "none",
        lineHeight: 1.4,
        flex: 1
      }
    }, item));
  }));
}
function Checklists() {
  const [tab, setTab] = useState("morning");
  const [choreSub, setChoreSub] = useState("personal");
  const [checks, setChecks] = useState({});
  const [person, setPerson] = useState("Eric");
  const [rotWeek, setRotWeek] = useState(0);
  useEffect(() => {
    const load = async () => {
      try {
        const r = await window.storage.get("chk-v2");
        if (r) setChecks(JSON.parse(r.value));
        const rw = await window.storage.get("rot-week");
        if (rw) setRotWeek(parseInt(rw.value) || 0);
      } catch (e) {}
    };
    load();
  }, []);
  const toggle = key => {
    const u = {
      ...checks,
      [key]: !checks[key]
    };
    setChecks(u);
    window.storage.set("chk-v2", JSON.stringify(u)).catch(() => {});
  };
  const resetPfx = prefix => {
    const u = {
      ...checks
    };
    Object.keys(u).forEach(k => {
      if (k.startsWith(prefix)) delete u[k];
    });
    setChecks(u);
    window.storage.set("chk-v2", JSON.stringify(u)).catch(() => {});
  };
  const advRot = () => {
    const n = (rotWeek + 1) % 4;
    setRotWeek(n);
    window.storage.set("rot-week", String(n)).catch(() => {});
  };
  const Item = ({
    id,
    text,
    accent
  }) => {
    const done = !!checks[id];
    return /*#__PURE__*/React.createElement("div", {
      onClick: () => toggle(id),
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 9,
        padding: "8px 10px",
        background: done ? "#f0faf0" : "#fff",
        border: "0.5px solid " + (done ? "#52c47a" : "#e0d8cc"),
        borderRadius: 8,
        marginBottom: 5,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 4,
        border: "1.5px solid " + (done ? "#2d6a2d" : "#c0c0c0"),
        flexShrink: 0,
        marginTop: 1,
        background: done ? "#2d6a2d" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, done && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "#fff",
        lineHeight: 1
      }
    }, "✓")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: done ? "#5a8a5a" : "#3a2e22",
        textDecoration: done ? "line-through" : "none",
        lineHeight: 1.4,
        flex: 1
      }
    }, text));
  };
  const SHead = ({
    text,
    color,
    prefix
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 14,
      marginBottom: 8,
      paddingBottom: 5,
      borderBottom: "1px solid #e0d8cc"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: color || "#9e8d7a",
      letterSpacing: 2,
      textTransform: "uppercase"
    }
  }, text), prefix && /*#__PURE__*/React.createElement("button", {
    onClick: () => resetPfx(prefix),
    style: {
      fontSize: 9,
      padding: "2px 8px",
      borderRadius: 10,
      border: "1px solid #e0d8cc",
      background: "#fff",
      color: "#888",
      fontFamily: "inherit",
      cursor: "pointer"
    }
  }, "Reset"));
  const doneOf = (items, pfx) => items.filter((_, i) => checks[pfx + i]).length;
  const people = Object.keys(MORNING_ITEMS);

  // Current week rotation assignments
  const rotAssign = ROTATION_CHORES.map((chore, ci) => {
    const kidIdx = (ci + rotWeek) % 4;
    return {
      ...chore,
      kid: KIDS_ROT[kidIdx],
      isMykah: kidIdx === 3
    };
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      overflowX: "auto",
      paddingBottom: 5,
      marginBottom: 14
    }
  }, [["morning", "🌅 Morning"], ["chores", "🧹 Chores"], ["bedtime", "🌙 Bedtime"], ["nextday", "📋 Next Day"]].map(([id, lbl]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setTab(id),
    style: {
      flexShrink: 0,
      padding: "7px 11px",
      borderRadius: 20,
      border: "none",
      background: tab === id ? "#2d3748" : "#e8e0d4",
      color: tab === id ? "#fff" : "#7a6a5a",
      fontFamily: "inherit",
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, lbl))), tab === "morning" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff8f2",
      border: "1.5px solid #e8905a",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#b83020"
    }
  }, "🌅", " Morning Routine \u2014 tap each person")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
      marginBottom: 12
    }
  }, people.map(p => {
    const items = MORNING_ITEMS[p];
    const done = doneOf(items, "morn-" + p + "-");
    return /*#__PURE__*/React.createElement("button", {
      key: p,
      onClick: () => setPerson(p),
      style: {
        padding: "6px 12px",
        borderRadius: 20,
        border: "none",
        background: person === p ? PCOLORS[p] || "#555" : "#e8e0d4",
        color: person === p ? "#fff" : "#7a6a5a",
        fontFamily: "inherit",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: person === p ? "0 2px 8px " + (PCOLORS[p] || "#555") + "55" : "none"
      }
    }, p, " ", done, "/", items.length);
  })), /*#__PURE__*/React.createElement(SHead, {
    text: person + " Morning Routine",
    color: PCOLORS[person] || "#b83020",
    prefix: "morn-" + person + "-"
  }), MORNING_ITEMS[person].map((item, i) => /*#__PURE__*/React.createElement(Item, {
    key: i,
    id: "morn-" + person + "-" + i,
    text: item
  }))), tab === "chores" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      overflowX: "auto",
      paddingBottom: 4,
      marginBottom: 12
    }
  }, [["personal", "👤 Personal"], ["rotating", "🔄 Rotating"], ["daily", "📅 Daily"], ["weekly", "📆 Weekly"], ["monthly", "🗓 Monthly"], ["yearly", "📅 Yearly"], ["trash", "🗑️ Trash"]].map(([id, lbl]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setChoreSub(id),
    style: {
      flexShrink: 0,
      padding: "6px 10px",
      borderRadius: 20,
      border: "none",
      background: choreSub === id ? "#5a2020" : "#e8e0d4",
      color: choreSub === id ? "#fff" : "#7a6a5a",
      fontFamily: "inherit",
      fontSize: 10,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, lbl))), choreSub === "personal" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff5f5",
      border: "1.5px solid #e07070",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#7a2828"
    }
  }, "👤", " Personal Chores \u2014 each kid owns these"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#9e8d7a",
      marginTop: 2
    }
  }, "These are not shared. Each person is responsible for their own.")), Object.entries(PERSONAL_CHORES).map(([kid, items]) => {
    const done = doneOf(items, "pers-" + kid + "-");
    return /*#__PURE__*/React.createElement("div", {
      key: kid,
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(SHead, {
      text: kid + " — Personal (" + done + "/" + items.length + ")",
      color: PCOLORS[kid] || "#7a2828",
      prefix: "pers-" + kid + "-"
    }), items.map((item, i) => /*#__PURE__*/React.createElement(Item, {
      key: i,
      id: "pers-" + kid + "-" + i,
      text: item
    })));
  })), choreSub === "rotating" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff5f5",
      border: "1.5px solid #e07070",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#7a2828"
    }
  }, "🔄", " Rotating Shared Chores \u2014 Week ", rotWeek + 1, " of 4"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#9e8d7a",
      marginTop: 2
    }
  }, "Rotates weekly. Tap next week to advance the rotation."), /*#__PURE__*/React.createElement("button", {
    onClick: advRot,
    style: {
      marginTop: 8,
      padding: "6px 14px",
      borderRadius: 20,
      border: "none",
      background: "#7a2828",
      color: "#fff",
      fontFamily: "inherit",
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Next week (advance rotation)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 6,
      marginBottom: 14
    }
  }, rotAssign.map((ra, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: "#fff",
      border: "1.5px solid #e07070",
      borderRadius: 10,
      padding: "8px 10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: PCOLORS[ra.kid] || "#7a2828"
    }
  }, ra.icon, " ", ra.kid), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#5a2020",
      fontWeight: 600,
      marginTop: 2
    }
  }, ra.name), ra.isMykah && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "#888",
      marginTop: 2
    }
  }, "Assist: ", MYKAH_ASSIST[ra.name])))), rotAssign.map((ra, ci) => {
    const pfx = "rot-" + rotWeek + "-" + ci + "-";
    const done = doneOf(ra.items, pfx);
    return /*#__PURE__*/React.createElement("div", {
      key: ci,
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(SHead, {
      text: ra.icon + " " + ra.kid + " — " + ra.name + " (" + done + "/" + ra.items.length + ")",
      color: PCOLORS[ra.kid] || "#7a2828",
      prefix: pfx
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#888",
        marginBottom: 8
      }
    }, ra.desc), ra.isMykah && /*#__PURE__*/React.createElement("div", {
      style: {
        background: "#fff9ee",
        border: "1px solid #f0c040",
        borderRadius: 8,
        padding: "6px 10px",
        marginBottom: 8,
        fontSize: 10,
        color: "#8a6000"
      }
    }, "⭐", " Mykah assists: ", MYKAH_ASSIST[ra.name]), ra.items.map((item, i) => /*#__PURE__*/React.createElement(Item, {
      key: i,
      id: pfx + i,
      text: item
    })));
  })), choreSub === "daily" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff5f5",
      border: "1.5px solid #e07070",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#7a2828"
    }
  }, "📅", " Daily Chores \u2014 every single day")), /*#__PURE__*/React.createElement(SHead, {
    text: "Every Day",
    color: "#7a2828",
    prefix: "daily-"
  }), CHORES_DAILY.map((item, i) => /*#__PURE__*/React.createElement(Item, {
    key: i,
    id: "daily-" + i,
    text: item
  }))), choreSub === "weekly" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff5f5",
      border: "1.5px solid #e07070",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#7a2828"
    }
  }, "📆", " Weekly Chores \u2014 each day has a focus")), Object.entries(CHORES_WEEKLY).map(([day, items]) => {
    const pfx = "wk-" + day + "-";
    const done = doneOf(items, pfx);
    return /*#__PURE__*/React.createElement("div", {
      key: day,
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement(SHead, {
      text: day + " (" + done + "/" + items.length + ")",
      color: "#7a2828",
      prefix: pfx
    }), items.map((item, i) => /*#__PURE__*/React.createElement(Item, {
      key: i,
      id: pfx + i,
      text: item
    })));
  })), choreSub === "monthly" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff5f5",
      border: "1.5px solid #e07070",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#7a2828"
    }
  }, "🗓", " Monthly Chores \u2014 do these once a month")), /*#__PURE__*/React.createElement(SHead, {
    text: "Monthly — " + doneOf(CHORES_MONTHLY, "mo-") + "/" + CHORES_MONTHLY.length + " done",
    color: "#7a2828",
    prefix: "mo-"
  }), CHORES_MONTHLY.map((item, i) => /*#__PURE__*/React.createElement(Item, {
    key: i,
    id: "mo-" + i,
    text: item
  }))), choreSub === "yearly" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff5f5",
      border: "1.5px solid #e07070",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#7a2828"
    }
  }, "📅", " Yearly Chores \u2014 annual deep tasks")), /*#__PURE__*/React.createElement(SHead, {
    text: "Yearly — " + doneOf(CHORES_YEARLY, "yr-") + "/" + CHORES_YEARLY.length + " done",
    color: "#7a2828",
    prefix: "yr-"
  }), CHORES_YEARLY.map((item, i) => /*#__PURE__*/React.createElement(Item, {
    key: i,
    id: "yr-" + i,
    text: item
  }))), choreSub === "trash" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#3a2e22",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: "#fff",
      marginBottom: 6
    }
  }, "🗑️", " Trash Dump Run"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#f0a040",
      marginBottom: 4
    }
  }, "⛔", " CLOSED every Wednesday"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#f0c040",
      marginBottom: 8
    }
  }, "⚠️", " Saturday HALF DAY \u2014 closes 7 PM \u2014 go in the MORNING"), TRASH_RULES.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 11,
      color: "#d0c8b8",
      marginBottom: 4,
      padding: "4px 8px",
      background: "rgba(255,255,255,0.07)",
      borderRadius: 6
    }
  }, i === 1 || i === 2 ? "⛔" : i === 3 || i === 4 ? "✓ " : " ", " ", r))), /*#__PURE__*/React.createElement(SHead, {
    text: "Trash Run Checklist — " + doneOf(TRASH_ITEMS, "tr-") + "/" + TRASH_ITEMS.length,
    color: "#7a2828",
    prefix: "tr-"
  }), TRASH_ITEMS.map((item, i) => /*#__PURE__*/React.createElement(Item, {
    key: i,
    id: "tr-" + i,
    text: item
  })))), tab === "bedtime" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#f5f6f8",
      border: "1.5px solid #8090a8",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#2d3748"
    }
  }, "🌙", " Bedtime Routine \u2014 8 PM devices away, 9:30 Bible, 10 PM lights out")), Object.entries(BEDTIME_ITEMS).map(([section, items]) => /*#__PURE__*/React.createElement("div", {
    key: section
  }, /*#__PURE__*/React.createElement(SHead, {
    text: section,
    color: PCOLORS[section] || "#2d3748",
    prefix: "bed-" + section + "-"
  }), items.map((item, i) => /*#__PURE__*/React.createElement(Item, {
    key: i,
    id: "bed-" + section + "-" + i,
    text: item
  }))))), tab === "nextday" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#f0f6ff",
      border: "1.5px solid #4a8fe8",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#1050a0"
    }
  }, "📋", " Setup for Tomorrow"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#9e8d7a",
      marginTop: 3
    }
  }, "Do this during bedtime hygiene \u2014 right before Bible reading at 9:30 PM. By 9:30 PM everything below should be checked off so you can close the day peacefully.")), NEXTDAY_ITEMS.map((section, si) => /*#__PURE__*/React.createElement("div", {
    key: si
  }, /*#__PURE__*/React.createElement(SHead, {
    text: section.section,
    color: "#1050a0",
    prefix: "nd-" + si + "-"
  }), section.items.map((item, i) => /*#__PURE__*/React.createElement(Item, {
    key: i,
    id: "nd-" + si + "-" + i,
    text: item
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: () => resetPfx("nd-"),
    style: {
      width: "100%",
      padding: 10,
      borderRadius: 10,
      border: "1px solid #e0d8cc",
      background: "#f8f5f2",
      color: "#888",
      fontFamily: "inherit",
      fontSize: 12,
      cursor: "pointer",
      marginTop: 8
    }
  }, "Reset all \u2014 Next Day checklist")));
}

// ── VA SCHEDULER ──────────────────────────────────────────────────────────────
const EMPTY_SLOT = {
  type: "open",
  client: "",
  rate: "",
  notes: ""
};
function VAScheduler() {
  const [minRate, setMinRate] = useState("25");
  const [slots, setSlots] = useState(() => {
    const s = {};
    Object.values(VA_SLOTS).forEach(day => day.slots.forEach(sl => {
      s[sl.id] = {
        ...EMPTY_SLOT
      };
    }));
    return s;
  });
  const [activeDay, setActiveDay] = useState("mon");
  useEffect(() => {
    const load = async () => {
      try {
        const r = await window.storage.get("va-v3");
        if (r) setSlots(JSON.parse(r.value));
        const r2 = await window.storage.get("va-min");
        if (r2) setMinRate(r2.value);
      } catch (e) {}
    };
    load();
  }, []);
  const persist = (s, m) => {
    window.storage.set("va-v3", JSON.stringify(s)).catch(() => {});
    window.storage.set("va-min", m).catch(() => {});
  };
  const upd = (id, field, val) => {
    const s = {
      ...slots,
      [id]: {
        ...(slots[id] || EMPTY_SLOT),
        [field]: val
      }
    };
    setSlots(s);
    persist(s, minRate);
  };
  const setType = (id, type) => {
    const s = {
      ...slots,
      [id]: {
        ...(slots[id] || EMPTY_SLOT),
        type
      }
    };
    setSlots(s);
    persist(s, minRate);
  };
  const dayData = VA_SLOTS[activeDay];
  const min = parseFloat(minRate) || 0;
  const clientSlots = dayData.slots.filter(sl => (slots[sl.id] || EMPTY_SLOT).type === "client");
  const bizSlots = dayData.slots.filter(sl => (slots[sl.id] || EMPTY_SLOT).type === "bizdev");
  const dayEarn = clientSlots.reduce((s, sl) => {
    const r = parseFloat((slots[sl.id] || {}).rate) || 0;
    return s + r / 2;
  }, 0);
  const wkEarn = Object.values(VA_SLOTS).reduce((s, d) => s + d.slots.reduce((s2, sl) => {
    if ((slots[sl.id] || {}).type !== "client") return s2;
    return s2 + (parseFloat((slots[sl.id] || {}).rate) || 0) / 2;
  }, 0), 0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#f0f6ff",
      border: "1.5px solid #4a8fe8",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#1050a0",
      marginBottom: 8
    }
  }, "💻", " E.L. Services and Sales \u2014 40 hrs/week matching Delta"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#3a5a9a"
    }
  }, "Min hourly rate $"), /*#__PURE__*/React.createElement("input", {
    value: minRate,
    onChange: e => {
      setMinRate(e.target.value);
      persist(slots, e.target.value);
    },
    type: "number",
    style: {
      width: 65,
      padding: "4px 8px",
      borderRadius: 6,
      border: "1px solid #4a8fe8",
      fontSize: 12,
      fontFamily: "inherit"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: "#888"
    }
  }, "30-min slot earns half")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gap: 6
    }
  }, [{
    l: "Today",
    v: "$" + dayEarn.toFixed(0),
    c: "#1050a0"
  }, {
    l: "This Week",
    v: "$" + wkEarn.toFixed(0),
    c: "#2d6a2d"
  }, {
    l: "Biz Dev",
    v: bizSlots.length * 0.5 + " hrs",
    c: "#5b2d8e"
  }, {
    l: "Hours/day",
    v: "8 hrs",
    c: "#0e5a7a"
  }].map(r => /*#__PURE__*/React.createElement("div", {
    key: r.l,
    style: {
      background: "#fff",
      borderRadius: 8,
      padding: "7px 8px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: r.c
    }
  }, r.v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "#888"
    }
  }, r.l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fdf5ff",
      border: "1.5px solid #c5a8f0",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#5b2d8e",
      marginBottom: 4
    }
  }, "⚡", " Schedule \u2014 Same Hours as Eric at Delta"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#6a3a9e",
      lineHeight: 1.5
    }
  }, "Mon + Wed: 2–10 PM (service days) · Tue + Thu + Fri: 9–5 PM", /*#__PURE__*/React.createElement("br", null), "School (5 hrs) runs inside the first 5 hours of each block.", /*#__PURE__*/React.createElement("br", null), "No clients? Use at least 1–2 slots for Business Development. You are not chained to the desk — but you are on the clock.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      overflowX: "auto",
      paddingBottom: 4,
      marginBottom: 10
    }
  }, Object.entries(VA_SLOTS).map(([key, d]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => setActiveDay(key),
    style: {
      flexShrink: 0,
      padding: "6px 10px",
      borderRadius: 20,
      border: "none",
      background: activeDay === key ? "#184878" : "#e8e0d4",
      color: activeDay === key ? "#fff" : "#7a6a5a",
      fontFamily: "inherit",
      fontSize: 10,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, d.label.split("—")[0].trim()))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8,
      padding: "8px 12px",
      background: "#fff",
      borderRadius: 8,
      border: "1px solid #e0d8cc"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "#184878"
    }
  }, dayData.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "#1050a0",
      marginTop: 2
    }
  }, "🕐", " ", dayData.hours), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#888",
      marginTop: 2
    }
  }, dayData.note), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "#1050a0",
      fontWeight: 600
    }
  }, "👤", " ", clientSlots.length, " client slots"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "#5b2d8e",
      fontWeight: 600
    }
  }, "🏗", " ", bizSlots.length, " biz dev"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      background: "#f2fdf6",
      border: "1px solid #c8f0d8",
      borderRadius: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: "#1a6e38",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "#1a6e38"
    }
  }, "📚", " Hour 1 \u2014 Laurel Teaches \u2014 Not available for clients")), bizSlots.length === 0 && clientSlots.length < 8 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff9ee",
      border: "1px solid #f0c040",
      borderRadius: 8,
      padding: "8px 12px",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: "#8a6000"
    }
  }, "⚠️", " No Business Development scheduled"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#8a6000",
      marginTop: 2
    }
  }, "Set at least 1 to 2 slots to Biz Dev to keep growing your clients.")), dayData.slots.map((sl, i) => {
    const slot = slots[sl.id] || EMPTY_SLOT;
    const t = slot.type || "open";
    const rate = parseFloat(slot.rate) || 0;
    const earn = t === "client" ? rate / 2 : 0;
    const tooLow = t === "client" && slot.rate && rate < min;
    const bc = tooLow ? "#e07070" : t === "client" ? "#4a8fe8" : t === "bizdev" ? "#a06ad4" : "#e0d8cc";
    const bg = t === "client" ? "#f0f6ff" : t === "bizdev" ? "#faf5ff" : "#fff";
    return /*#__PURE__*/React.createElement("div", {
      key: sl.id,
      style: {
        background: bg,
        border: "1.5px solid " + bc,
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: "#184878"
      }
    }, sl.time), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        alignItems: "center"
      }
    }, earn > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: "#2d6a2d"
      }
    }, "$", earn.toFixed(2)), tooLow && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 10,
        background: "#FCEBEB",
        color: "#A32D2D"
      }
    }, "⚠️", " Below min"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        marginBottom: t !== "open" ? 8 : 0
      }
    }, [["open", "⬜ Open"], ["client", "👤 Client"], ["bizdev", "🏗 Biz Dev"]].map(([val, lbl]) => /*#__PURE__*/React.createElement("button", {
      key: val,
      onClick: () => setType(sl.id, val),
      style: {
        flex: 1,
        padding: "5px 4px",
        borderRadius: 8,
        border: "1px solid " + (t === val ? bc : "#e0d8cc"),
        background: t === val ? val === "client" ? "#184878" : val === "bizdev" ? "#5b2d8e" : "#444" : "#fff",
        color: t === val ? "#fff" : "#7a6a5a",
        fontFamily: "inherit",
        fontSize: 10,
        fontWeight: 600,
        cursor: "pointer"
      }
    }, lbl))), t === "client" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: "#888",
        marginBottom: 2
      }
    }, "CLIENT NAME"), /*#__PURE__*/React.createElement("input", {
      value: slot.client || "",
      onChange: e => upd(sl.id, "client", e.target.value),
      placeholder: "Client name",
      style: {
        width: "100%",
        padding: "5px 8px",
        borderRadius: 6,
        border: "1px solid #c0d0f0",
        fontSize: 12,
        fontFamily: "inherit"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: "#888",
        marginBottom: 2
      }
    }, "$/HR RATE"), /*#__PURE__*/React.createElement("input", {
      value: slot.rate || "",
      onChange: e => upd(sl.id, "rate", e.target.value),
      type: "number",
      placeholder: "0",
      style: {
        width: "100%",
        padding: "5px 8px",
        borderRadius: 6,
        border: "1px solid " + (tooLow ? "#e07070" : "#c0d0f0"),
        fontSize: 12,
        fontFamily: "inherit"
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: "#888",
        marginBottom: 2
      }
    }, "TASK FOR THIS SLOT"), /*#__PURE__*/React.createElement("input", {
      value: slot.notes || "",
      onChange: e => upd(sl.id, "notes", e.target.value),
      placeholder: "What are you doing for this client...",
      style: {
        width: "100%",
        padding: "5px 8px",
        borderRadius: 6,
        border: "1px solid #c0d0f0",
        fontSize: 12,
        fontFamily: "inherit"
      }
    }), tooLow && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 10,
        color: "#A32D2D"
      }
    }, "⚠️", " $", rate, "/hr is below your $", minRate, "/hr minimum"), !tooLow && earn > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 10,
        color: "#2d6a2d"
      }
    }, "✓", " Earns $", earn.toFixed(2), " for this 30-min slot")), t === "bizdev" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: "#888",
        marginBottom: 3
      }
    }, "WHAT ARE YOU WORKING ON?"), /*#__PURE__*/React.createElement("input", {
      value: slot.notes || "",
      onChange: e => upd(sl.id, "notes", e.target.value),
      placeholder: "Cold calls, email outreach, proposals...",
      style: {
        width: "100%",
        padding: "5px 8px",
        borderRadius: 6,
        border: "1px solid #c5a8f0",
        fontSize: 12,
        fontFamily: "inherit",
        marginBottom: 6
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 4
      }
    }, BIZ_TASKS.map((task, bi) => /*#__PURE__*/React.createElement("button", {
      key: bi,
      onClick: () => upd(sl.id, "notes", task),
      style: {
        fontSize: 9,
        padding: "3px 7px",
        borderRadius: 6,
        border: "1px solid #c5a8f0",
        background: "#faf5ff",
        color: "#5b2d8e",
        fontFamily: "inherit",
        cursor: "pointer"
      }
    }, task)))));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      background: "#184878",
      borderRadius: 10,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#a0c8f0",
      marginBottom: 4
    }
  }, "💡", " Your Time Rules"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#80a8d0",
      lineHeight: 1.7
    }
  }, "Never accept below $", minRate, "/hr \u2014 your time has real value. No clients? Use 1 to 2 slots for Biz Dev then you are free. 30 min max per slot keeps you from over-giving your time. Book yourself just like you would book any client appointment.")));
}

// PORTAL + HOOKS
// ═══ FAMILY + PORTAL CONSTANTS ═══════════════════════════════════════════════
const FAMILY = [{
  id: 'laurel',
  name: 'Laurel',
  full: 'Laurel Argilan',
  role: 'parent',
  color: '#8D6E63',
  colorName: 'Coco',
  emoji: '👩',
  inPaySystem: true
}, {
  id: 'eric',
  name: 'Eric',
  full: 'Joseph Eric Argilan II',
  role: 'parent',
  color: '#1A73E8',
  colorName: 'Cobalt',
  emoji: '👨',
  inPaySystem: true
}, {
  id: 'ryan',
  name: 'Ryan',
  full: 'Ryan Argilan',
  role: 'child',
  color: '#039BE5',
  colorName: 'Peacock',
  emoji: '👦',
  age: 18,
  inPaySystem: true
}, {
  id: 'kayla',
  name: 'Kayla',
  full: 'Kayla Argilan',
  role: 'child',
  color: '#F48FB1',
  colorName: 'Cherry Blossom',
  emoji: '👧',
  age: 16,
  inPaySystem: true
}, {
  id: 'ashelyn',
  name: 'Ashelyn',
  full: 'Ashelyn Argilan',
  role: 'child',
  color: '#9E69AF',
  colorName: 'Amethyst',
  emoji: '👧',
  age: 13,
  inPaySystem: true
}, {
  id: 'mykah',
  name: 'Mykah',
  full: 'Mykah Kade Argilan',
  role: 'child',
  color: '#4CAF82',
  colorName: 'Eucalyptus',
  emoji: '👦',
  age: 10,
  inPaySystem: true
}, {
  id: 'jacob',
  name: 'Jacob',
  full: 'Jacob Landen Argilan Smith',
  role: 'child',
  color: '#558BB2',
  colorName: 'Custom',
  emoji: '👦',
  inPaySystem: true
}, {
  id: 'grandpa',
  name: 'Grandpa',
  full: 'Eric Argilan SR',
  role: 'elder',
  color: '#15847E',
  colorName: 'Custom',
  emoji: '👴',
  inPaySystem: false
}];
const CLOCK_ACTS = [{
  id: 'spiritual',
  label: '📚 Spiritual',
  color: '#7986CB',
  productive: true,
  expectedMin: 30,
  pts: 3
}, {
  id: 'service',
  label: '💼 Service',
  color: '#F4511E',
  productive: true,
  expectedMin: 225,
  pts: 2
}, {
  id: 'school',
  label: '📝 School',
  color: '#9C8DC4',
  productive: true,
  expectedMin: 300,
  pts: 2
}, {
  id: 'va_work',
  label: '💻 VA Work',
  color: '#E67C73',
  productive: true,
  expectedMin: 480,
  pts: 1
}, {
  id: 'eric_work',
  label: '🏗 Delta',
  color: '#0B8043',
  productive: true,
  expectedMin: 480,
  pts: 1
}, {
  id: 'consulting',
  label: '🌿 Consult',
  color: '#33B679',
  productive: true,
  expectedMin: 120,
  pts: 1
}, {
  id: 'el_sales',
  label: '🏢 E&L Services & Sales',
  color: '#00ACC1',
  productive: true,
  expectedMin: 240,
  pts: 2
}, {
  id: 'chores',
  label: '🧹 Chores',
  color: '#795548',
  productive: true,
  expectedMin: 60,
  pts: 2
}, {
  id: 'meals',
  label: '🍽️ Meals',
  color: '#C0CA33',
  productive: true,
  expectedMin: 30,
  pts: 1
}, {
  id: 'animals',
  label: '🐕 Animals',
  color: '#8BC34A',
  productive: true,
  expectedMin: 20,
  pts: 1
}, {
  id: 'free',
  label: '🧘 My Time',
  color: '#4CAF82',
  productive: false,
  expectedMin: 120,
  pts: 0
}, {
  id: 'fun',
  label: '🎉 Fun & Entertainment',
  color: '#F6BF26',
  productive: false,
  expectedMin: 90,
  pts: 1
}, {
  id: 'driving',
  label: '🚗 Errands',
  color: '#9E9E9E',
  productive: false,
  expectedMin: 45,
  pts: 1
}, {
  id: 'rest',
  label: '😴 Rest',
  color: '#546E7A',
  productive: false,
  expectedMin: 480,
  pts: 1
}, {
  id: 'phone',
  label: '📱 Screens',
  color: '#EF5350',
  productive: false,
  expectedMin: 30,
  pts: 1
}, {
  id: 'waiting',
  label: '⏳ Idle',
  color: '#FF7043',
  productive: false,
  expectedMin: 15,
  pts: 1
}];
const DEFAULT_CHECKLIST_PAY = {
  morning: 0.25,
  chores: 1.00,
  spiritual: 0.50,
  bedtime: 0.25,
  nextday: 0.50
};
const NOTIF_COLORS = {
  clock_in: '#4CAF82',
  clock_out: '#1A73E8',
  overdue: '#FF9800',
  missed: '#EF5350',
  approval: '#F4511E',
  reminder: '#C0CA33',
  payment: '#4CAF82',
  info: '#888',
  claim: '#9E69AF'
};
const getPerson = id => FAMILY.find(f => f.id === id) || FAMILY[0];
const getAct = id => CLOCK_ACTS.find(a => a.id === id) || {
  label: id || '?',
  color: '#888',
  productive: false,
  expectedMin: 60
};
function fmtDur(m) {
  if (!m || m < 1) return '< 1m';
  const h = Math.floor(m / 60),
    mn = Math.round(m % 60);
  return h > 0 ? `${h}h ${mn}m` : `${mn}m`;
}
function fmtTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  let h = d.getHours(),
    m = d.getMinutes();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// ═══ NOTIFICATION HOOK ═══════════════════════════════════════════════════════
function useNotifications() {
  const _nraw = ktUse('notifs', {})[0];
  const notifs = React.useMemo(() => Object.values(_nraw || {}).filter(n => n && typeof n === 'object' && n.timestamp).map(n => n.approved === undefined ? Object.assign({}, n, { approved: null }) : n).sort((a, b) => b.timestamp - a.timestamp), [_nraw]);
  const addNotif = useCallback((type, personId, title, msg, extra = {}) => {
    const id = 'n' + Date.now() + Math.random().toString(36).slice(2, 5);
    const n = {
      id,
      type,
      personId,
      title,
      message: msg,
      timestamp: Date.now(),
      read: false,
      approved: null,
      adminNote: '',
      ...extra
    };
    syncSet('notifs/' + id, n);
    fireBrowserNotif(title, msg);
    try { if (window._ntfyNotif) window._ntfyNotif(n); } catch (e) {}
    playSound('notif');
    return id;
  }, []);
  const markAllRead = useCallback(() => notifs.filter(n => !n.read).forEach(n => syncSet('notifs/' + n.id, {
    ...n,
    read: true
  })), [notifs]);
  const approveNotif = useCallback((id, ok, note) => {
    const n = notifs.find(x => x.id === id);
    if (n) syncSet('notifs/' + id, {
      ...n,
      read: true,
      approved: ok,
      adminNote: note || '',
      resolvedAt: Date.now()
    });
  }, [notifs]);
  const unread = notifs.filter(n => !n.read).length;
  const pending = notifs.filter(n => n.requiresApproval && n.approved === null).length;
  const deleteNotif = useCallback(id => { try { syncSet('notifs/' + id, null); } catch (e) {} }, []);
  const deleteMany = useCallback(ids => { (ids || []).forEach(id => { try { syncSet('notifs/' + id, null); } catch (e) {} }); }, []);
  const toggleSave = useCallback(id => {
    const n = notifs.find(x => x.id === id);
    if (n) syncSet('notifs/' + id, { ...n, saved: !n.saved });
  }, [notifs]);
  // clear everything that is not saved and not waiting for a decision
  const clearAll = useCallback(() => { notifs.filter(n => !n.saved && !(n.requiresApproval && n.approved == null)).forEach(n => { try { syncSet('notifs/' + n.id, null); } catch (e) {} }); }, [notifs]);
  // automatic tidy-up: unsaved notices older than 14 days go away
  useEffect(() => {
    const cut = Date.now() - 14 * 86400000;
    const old = notifs.filter(n => !n.saved && n.timestamp < cut && !(n.requiresApproval && n.approved == null));
    if (old.length && (window._isAdminSession)) old.forEach(n => { try { syncSet('notifs/' + n.id, null); } catch (e) {} });
  }, [notifs.length, !!window._isAdminSession]);
  return {
    notifs,
    addNotif,
    markAllRead,
    approveNotif,
    deleteNotif,
    deleteMany,
    toggleSave,
    clearAll,
    unread,
    pending
  };
}

// ═══ WALLET HOOK ═════════════════════════════════════════════════════════════
function useWallets() {
  const [wallets, setWallets] = useState({});
  useEffect(() => syncOn('wallets', d => {
    if (d) setWallets(d);
  }), []);
  const getWallet = useCallback(pid => wallets[pid] || {
    balance: 0,
    pending: 0,
    history: [],
    linked: {
      type: null,
      username: ''
    }
  }, [wallets]);
  const credit = useCallback((pid, amount, reason, taskId, forceApprove) => {
    if (amount > 0 && !window._payrollBypass && typeof window._payrollOn === 'function' && window._payrollOn(pid)) { window._payrollLog(pid, amount, reason || 'Work', taskId); return; }
    const w = getWallet(pid);
    const tx = {
      id: 'tx' + Date.now(),
      type: 'earned',
      amount,
      reason,
      taskId,
      timestamp: Date.now(),
      approved: false
    };
    // Auto-approve small routine credits (≤20 pts), OR anything an admin has already
    // explicitly approved (task/SOP/inspection approvals pass forceApprove=true) —
    // those shouldn't sit in "pending" a second time.
    const autoApprove = forceApprove || amount <= 20;
    const txFinal = {...tx, approved: autoApprove};
    const updated = {
      ...w,
      pending: autoApprove ? (w.pending || 0) : (w.pending || 0) + amount,
      balance: autoApprove ? (w.balance || 0) + amount : (w.balance || 0),
      history: [txFinal, ...(w.history || [])].slice(0, 100)
    };
    setWallets(function(prev){return Object.assign({}, prev, {[pid]:updated});});
    syncSet('wallets/' + pid, updated);
    playSound('payment');
  }, [getWallet]);
  const approveCredit = useCallback((pid, txId) => {
    const w = getWallet(pid);
    const history = (w.history || []).map(t => t.id === txId ? {
      ...t,
      approved: true
    } : t);
    const tx = history.find(t => t.id === txId);
    const updated = {
      ...w,
      balance: (w.balance || 0) + (tx?.amount || 0),
      pending: Math.max(0, (w.pending || 0) - (tx?.amount || 0)),
      history
    };
    setWallets(function(prev){return Object.assign({}, prev, {[pid]:updated});});
    syncSet('wallets/' + pid, updated);
  }, [getWallet]);
  const deduct = useCallback((pid, amount, reason) => {
    const w = getWallet(pid);
    const tx = {
      id: 'tx' + Date.now(),
      type: 'deduction',
      amount: -amount,
      reason,
      timestamp: Date.now(),
      approved: true
    };
    const deductUpdated = {...w, balance:Math.max(0,(w.balance||0)-amount), history:[tx,...(w.history||[])].slice(0,100)};
    setWallets(prev => ({...prev, [pid]: deductUpdated}));
    syncSet('wallets/' + pid, deductUpdated);
  }, [getWallet, setWallets]);
  const setLinked = useCallback((pid, type, username) => {
    const w = getWallet(pid);
    syncSet('wallets/' + pid, {
      ...w,
      linked: {
        type,
        username
      }
    });
  }, [getWallet]);
  const adminBonus = useCallback((pid, amount, reason) => {
    const w = getWallet(pid);
    const tx = {
      id: 'tx' + Date.now(),
      type: 'bonus',
      amount,
      reason,
      timestamp: Date.now(),
      approved: true
    };
    syncSet('wallets/' + pid, {
      ...w,
      balance: (w.balance || 0) + amount,
      history: [tx, ...(w.history || [])].slice(0, 100)
    });
    playSound('payment');
  }, [getWallet]);
  return {
    wallets,
    getWallet,
    credit,
    approveCredit,
    deduct,
    setLinked,
    adminBonus
  };
}

// ═══ TASK HOOK ═══════════════════════════════════════════════════════════════
function useTasks() {
  const [tasks, setTasks] = useState({});
  useEffect(() => syncOn('tasks/' + todayKey(), d => {
    if (d) setTasks(d);
  }), []);
  function saveTask(t) {
    syncSet('tasks/' + todayKey() + '/' + t.id, t);
  }
  function addTask(task) {
    const id = 'task' + Date.now();
    const t = {
      id,
      ...task,
      createdAt: Date.now(),
      status: 'pending',
      completedBy: null,
      claimedBy: null
    };
    saveTask(t);
    return id;
  }
  function completeTask(taskId, personId) {
    const t = tasks[taskId];
    if (!t) return;
    saveTask({
      ...t,
      status: 'awaiting_approval',
      completedBy: personId,
      completedAt: Date.now()
    });
  }
  function approveTask(taskId, approved, adminNote) {
    const t = tasks[taskId];
    if (!t) return;
    saveTask({
      ...t,
      status: approved ? 'approved' : 'rejected',
      approvedAt: Date.now(),
      adminNote: adminNote || ''
    });
  }
  function claimTask(taskId, personId) {
    const t = tasks[taskId];
    if (!t) return;
    if (t.completedBy || t.claimedBy) return;
    saveTask({
      ...t,
      claimedBy: personId,
      originalAssignee: t.assignedTo,
      assignedTo: personId
    });
    playSound('claim');
  }
  const todayTasks = Object.values(tasks).filter(Boolean);
  const pendingApproval = todayTasks.filter(t => t.status === 'awaiting_approval');
  return {
    tasks,
    todayTasks,
    pendingApproval,
    addTask,
    completeTask,
    approveTask,
    claimTask
  };
}

// ═══ OVERDUE / MISSED ALERT HOOK ══════════════════════════════════════════════
function useAlerts(sessions, addNotif) {
  const fired = useRef(new Set());
  useEffect(() => {
    function check() {
      const now = Date.now(),
        h = new Date().getHours(),
        day = new Date().getDay();
      const schoolDay = day >= 1 && day <= 5,
        serviceDay = day === 1 || day === 3;
      FAMILY.forEach(p => {
        const cur = (sessions[p.id] || {}).current;
        if (!cur) return;
        const elapsed = (now - cur.startTime) / 60000,
          act = getAct(cur.activity);
        const key = 'od_' + p.id + '_' + cur.startTime;
        if (elapsed > act.expectedMin + 20 && !fired.current.has(key)) {
          fired.current.add(key);
          addNotif('overdue', p.id, `${p.name} overdue — ${act.label}`, `${p.name} has been on ${act.label} for ${fmtDur(elapsed)} (expected ${fmtDur(act.expectedMin)}). May have forgotten to clock out.`, {
            requiresApproval: false
          });
          playSound('alert');
        }
      });
      if (schoolDay && h >= 9 && h < 14) {
        const key = 'school_' + todayKey();
        if (!fired.current.has(key)) {
          const any = FAMILY.filter(p => p.role === 'child').some(p => {
            const d = sessions[p.id] || {};
            return d.current?.activity === 'school' || (d.today || []).some(e => e.activity === 'school');
          });
          if (!any) {
            fired.current.add(key);
            addNotif('missed', 'all', 'No one clocked into school', `It is after 9 AM on a school day and no child has clocked into School yet.`, {
              requiresApproval: false
            });
            playSound('alert');
          }
        }
      }
      if (serviceDay && h >= 10 && h < 13) {
        const key = 'svc_' + todayKey();
        if (!fired.current.has(key)) {
          const any = FAMILY.some(p => {
            const d = sessions[p.id] || {};
            return d.current?.activity === 'service' || (d.today || []).some(e => e.activity === 'service');
          });
          if (!any) {
            fired.current.add(key);
            addNotif('missed', 'all', 'No one clocked into service', `Service day — no family member has logged field service yet.`, {
              requiresApproval: false
            });
            playSound('alert');
          }
        }
      }
    }
    check();
    const t = setInterval(check, 60000);
    return () => clearInterval(t);
  }, [sessions, addNotif]);
}
function useReminders(reminders, addNotif) {
  const fired = useRef(new Set());
  useEffect(() => {
    function check() {
      const d = new Date(),
        hh = String(d.getHours()).padStart(2, '0'),
        mm = String(d.getMinutes()).padStart(2, '0'),
        t = hh + ':' + mm;
      const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
        today = days[d.getDay()];
      Object.values(reminders || {}).filter(Boolean).forEach(r => {
        if (!r.time) return;
        const match = !r.days || r.days.length === 0 || r.days.includes(today) || r.days.includes('daily');
        if (r.time === t && match) {
          const k = 'rem_' + r.id + '_' + todayKey() + '_' + t;
          if (!fired.current.has(k)) {
            fired.current.add(k);
            addNotif('reminder', 'all', r.title || 'Reminder', r.message || r.title, {
              requiresApproval: false
            });
            playSound('reminder');
          }
        }
      });
    }
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, [reminders, addNotif]);
}
const DEFAULT_FAMILY = FAMILY;

// NEW FEATURES

// ═══ NEW V4 CONSTANTS (DEFAULT_FAMILY and FAMILY already defined in portal_and_hooks)
function calcPoints(sessions, personId) {
  const data = sessions[personId] || {};
  const cur = data.current;
  const all = cur ? [...(data.today || []), {
    ...cur,
    duration: (Date.now() - cur.startTime) / 60000
  }] : data.today || [];
  return Math.round(all.reduce((s, e) => {
    const a = getAct(e.activity);
    return s + (a.pts || 0) * (e.duration || 0) / 60;
  }, 0));
}
function fmtMoney(n, mode) {
  return mode === 'points' ? Math.round(n || 0) + 'pts' : '$' + (n || 0).toFixed(2);
}

// ═══ usePeople HOOK ══════════════════════════════════════════════════════════
function usePeople() {
  const [overrides, setOverrides] = useState({});
  useEffect(() => syncOn('people', d => {
    if (d) setOverrides(d);
  }), []);
  const family = useMemo(() => {
    const base = [...DEFAULT_FAMILY];
    const custom = Object.values(overrides).filter(Boolean);
    const merged = base.map(p => ({
      ...p,
      ...(custom.find(c => c.id === p.id) || {})
    })).filter(p => !p.deleted);
    const added = custom.filter(c => !base.find(b => b.id === c.id) && !c.deleted);
    return [...merged, ...added];
  }, [overrides]);
  const savePerson = useCallback(p => syncSet('people/' + p.id, p), []);
  const deletePerson = useCallback(id => syncSet('people/' + id, {
    id,
    deleted: true
  }), []);
  const addPerson = useCallback(p => {
    const id = 'person_' + Date.now();
    const np = {
      ...p,
      id
    };
    syncSet('people/' + id, np);
    return id;
  }, []);
  const getPersonDyn = useCallback(id => family.find(f => f.id === id) || DEFAULT_FAMILY.find(f => f.id === id) || {
    id,
    name: '?',
    emoji: '👤',
    color: '#888',
    role: 'child',
    inPaySystem: false
  }, [family]);
  return {
    family,
    savePerson,
    deletePerson,
    addPerson,
    getPerson: getPersonDyn
  };
}

// ═══ useSettings HOOK ════════════════════════════════════════════════════════
function useSettings() {
  // v31: sound was found muted on devices — reset once to LOUD, then keep volume per-device (not shared through Firebase)
  try { if (localStorage.getItem('alarm_vol_fix31') !== '1') { localStorage.setItem('alarm_vol', '4'); localStorage.setItem('alarm_vol_fix31', '1'); } } catch (e) {}
  const [settings, setS] = useState({
    payMode: 'pay',
    alarmVol: (function () { var v = parseInt(localStorage.getItem('alarm_vol')); return isNaN(v) ? 4 : v; })()
  });
  useEffect(() => syncOn('settings', d => {
    if (d) setS(s => {
      var rest = { ...d }; delete rest.alarmVol;
      return { ...s, ...rest };
    });
  }), []);
  const updateSetting = useCallback((k, v) => {
    setS(s => {
      const n = {
        ...s,
        [k]: v
      };
      var shared = { ...n }; delete shared.alarmVol;
      syncSet('settings', shared);
      if (k === 'alarmVol') localStorage.setItem('alarm_vol', String(v));
      return n;
    });
  }, []);
  return {
    settings,
    updateSetting
  };
}

// ═══ useWallets EXTENDED ═════════════════════════════════════════════════════
function useWalletsV2() {
  const [wallets, setWallets] = useState({});
  useEffect(() => syncOn('wallets', d => {
    if (d) setWallets(d);
  }), []);
  const getWallet = useCallback(pid => wallets[pid] || {
    balance: 0,
    pending: 0,
    history: [],
    linked: {
      type: null,
      username: ''
    }
  }, [wallets]);
  const credit = useCallback((pid, amount, reason, taskId) => {
    if (amount > 0 && !window._payrollBypass && typeof window._payrollOn === 'function' && window._payrollOn(pid)) { window._payrollLog(pid, amount, reason || 'Work', taskId); return; }
    const w = getWallet(pid);
    const tx = {
      id: 'tx' + Date.now(),
      type: 'earned',
      amount,
      reason,
      taskId,
      timestamp: Date.now(),
      approved: false
    };
    syncSet('wallets/' + pid, {
      ...w,
      pending: (w.pending || 0) + amount,
      history: [tx, ...(w.history || [])].slice(0, 200)
    });
    playSound('payment');
  }, [getWallet]);
  const approveCredit = useCallback((pid, txId) => {
    const w = getWallet(pid);
    const h = (w.history || []).map(t => t.id === txId ? {
      ...t,
      approved: true
    } : t);
    const tx = h.find(t => t.id === txId);
    syncSet('wallets/' + pid, {
      ...w,
      balance: (w.balance || 0) + (tx?.amount || 0),
      pending: Math.max(0, (w.pending || 0) - (tx?.amount || 0)),
      history: h
    });
  }, [getWallet]);
  const rejectCredit = useCallback((pid, txId) => {
    const w = getWallet(pid);
    const h = (w.history || []).map(t => t.id === txId ? {
      ...t,
      rejected: true,
      approved: false
    } : t);
    const tx = h.find(t => t.id === txId);
    syncSet('wallets/' + pid, {
      ...w,
      pending: Math.max(0, (w.pending || 0) - (tx?.amount || 0)),
      history: h
    });
  }, [getWallet]);
  const deduct = useCallback((pid, amount, reason) => {
    const w = getWallet(pid);
    const tx = {
      id: 'tx' + Date.now(),
      type: 'deduction',
      amount: -amount,
      reason,
      timestamp: Date.now(),
      approved: true
    };
    syncSet('wallets/' + pid, {
      ...w,
      balance: Math.max(0, (w.balance || 0) - amount),
      history: [tx, ...(w.history || [])].slice(0, 200)
    });
  }, [getWallet]);
  const resetWallet = useCallback(pid => syncSet('wallets/' + pid, {
    balance: 0,
    pending: 0,
    history: [],
    linked: {
      type: null,
      username: ''
    }
  }), []);
  const setLinked = useCallback((pid, type, username) => {
    const w = getWallet(pid);
    syncSet('wallets/' + pid, {
      ...w,
      linked: {
        type,
        username
      }
    });
  }, [getWallet]);
  const adminBonus = useCallback((pid, amount, reason) => {
    const w = getWallet(pid);
    const tx = {
      id: 'tx' + Date.now(),
      type: 'bonus',
      amount,
      reason,
      timestamp: Date.now(),
      approved: true
    };
    syncSet('wallets/' + pid, {
      ...w,
      balance: (w.balance || 0) + amount,
      history: [tx, ...(w.history || [])].slice(0, 200)
    });
    playSound('payment');
  }, [getWallet]);
  return {
    wallets,
    getWallet,
    credit,
    approveCredit,
    rejectCredit,
    deduct,
    resetWallet,
    setLinked,
    adminBonus
  };
}

// ═══ useTasksV2 EXTENDED ═════════════════════════════════════════════════════
function useTasksV2() {
  const [tasks, setTasks] = useState({});
  useEffect(() => syncOn('tasks/' + todayKey(), d => {
    if (d) setTasks(d);
  }), []);
  function saveTask(t) {
    setTasks(prev => ({
      ...prev,
      [t.id]: t
    }));
    syncSet('tasks/' + todayKey() + '/' + t.id, t);
  }
  const addTask = useCallback(task => {
    const id = 'task' + Date.now();
    const t = {
      id,
      ...task,
      createdAt: Date.now(),
      status: 'pending',
      completedBy: null,
      claimedBy: null
    };
    saveTask(t);
    return id;
  }, []);
  const completeTask = useCallback((taskId, personId) => {
    const t = tasks[taskId];
    if (!t) return;
    saveTask({
      ...t,
      status: 'awaiting_approval',
      completedBy: personId,
      completedAt: Date.now()
    });
  }, [tasks]);
  const approveTask = useCallback((taskId, approved, adminNote) => {
    const t = tasks[taskId];
    if (!t) return;
    saveTask({
      ...t,
      status: approved ? 'approved' : 'rejected',
      approvedAt: Date.now(),
      adminNote: adminNote || ''
    });
  }, [tasks]);
  const resetTask = useCallback(taskId => {
    const t = tasks[taskId];
    if (!t) return;
    saveTask({
      ...t,
      status: 'pending',
      completedBy: null,
      claimedBy: null,
      completedAt: null,
      approvedAt: null,
      adminNote: ''
    });
  }, [tasks]);
  const deleteTask = useCallback(taskId => {
    setTasks(prev => {
      const n = {
        ...prev
      };
      delete n[taskId];
      syncSet('tasks/' + todayKey(), n);
      return n;
    });
  }, []);
  const claimTask = useCallback((taskId, personId) => {
    const t = tasks[taskId];
    if (!t || t.completedBy || t.claimedBy) return;
    saveTask({
      ...t,
      claimedBy: personId,
      originalAssignee: t.assignedTo,
      assignedTo: personId
    });
    playSound('claim');
  }, [tasks]);
  const todayTasks = Object.values(tasks).filter(Boolean);
  const pendingApproval = todayTasks.filter(t => t.status === 'awaiting_approval');
  return {
    tasks,
    todayTasks,
    pendingApproval,
    addTask,
    completeTask,
    approveTask,
    resetTask,
    deleteTask,
    claimTask
  };
}

// ═══ SndToggle V2 — 5 levels ═════════════════════════════════════════════════
function SndToggle2({
  vol,
  onUpdate,
  locked
}) {
  const labels = ['🔇', '🔈', '🔊', '📢', '📣'];
  const colors = ['#333', '#888', '#1A73E8', '#FF9800', '#EF5350'];
  if (locked) return /*#__PURE__*/React.createElement("div", { title: 'Volume is set by Mom & Dad', style: { background: 'rgba(255,255,255,.07)', color: '#4CAF82', padding: '5px 9px', borderRadius: 20, fontSize: 11, minWidth: 30 } }, '\uD83D\uDD12', labels[Math.max(vol, 1)] || '\uD83D\uDD0A');
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const n = window._isAdminSession ? (vol >= 4 ? 1 : (vol < 1 ? 2 : vol + 1)) : (vol + 1) % 5; // parents' button never mutes by accident
      onUpdate('alarmVol', n);
      if (n > 0) setTimeout(() => playSound('notif'), 50);
    },
    style: {
      background: 'rgba(255,255,255,.07)',
      color: colors[vol] || '#888',
      padding: '5px 9px',
      borderRadius: 20,
      fontSize: 11,
      border: 'none',
      minWidth: 30
    }
  }, labels[vol] || '🔊');
}

// ═══ LEADERBOARD ═════════════════════════════════════════════════════════════
function getISOWeek(d){
  const dt=new Date(d); dt.setHours(0,0,0,0);
  dt.setDate(dt.getDate()+3-(dt.getDay()+6)%7);
  const w1=new Date(dt.getFullYear(),0,4);
  return dt.getFullYear()+'-W'+String(1+Math.round(((dt-w1)/86400000-3+(w1.getDay()+6)%7)/7)).padStart(2,'0');
}
const THIS_WEEK = getISOWeek(Date.now());

function Leaderboard({
  sessions,
  wallets,
  family,
  payMode
}) {
  const [weekOnly, setWeekOnly] = useState(true);
  const cats = [{
    k: 'all',
    l: '🏆 Total'
  }, {
    k: 'spiritual',
    l: '📚 Spirit'
  }, {
    k: 'school',
    l: '📝 School'
  }, {
    k: 'chores',
    l: '🧹 Chores'
  }, {
    k: 'service',
    l: '💼 Service'
  }];
  const [cat, setCat] = useState('all');
  const cpAll = (typeof ktUse === 'function' ? ktUse('clockpaid', {})[0] : null) || {};
  const boards = useMemo(() => {
    // Compute week filter inline (avoids TDZ issue with weekSessions)
    function getWeekData(pid) {
      const raw = sessions[pid] || {today:[], current:null};
      if (!weekOnly) return raw;
      const thisWeek = THIS_WEEK;
      return {
        ...raw,
        today: (raw.today||[]).filter(e => getISOWeek(e.startTime||Date.now())===thisWeek),
        current: raw.current
      };
    }
    return (family || DEFAULT_FAMILY).filter(p => p.inPaySystem).map(p => {
      const today = getWeekData(p.id).today || [];
      const cur = getWeekData(p.id).current;
      const all = cur ? [...today, {
        ...cur,
        duration: (Date.now() - cur.startTime) / 60000
      }] : today;
      const filtered = cat === 'all' ? all : all.filter(e => e.activity === cat || e.activity.startsWith(cat));
      const pts = Math.round(filtered.reduce((s, e) => s + (getAct(e.activity).pts || 0) * (e.duration || 0) / 60, 0));
      const mins = filtered.reduce((s, e) => s + (e.duration || 0), 0);
      const wallet = wallets[p.id] || {balance:0, pending:0};
      const _toPts = (window._payMode === 'points') ? 1 : (window._ptsPerB || 20);
      const _cp = Object.keys(cpAll).reduce((n, dk) => n + (+((cpAll[dk] || {})[p.id] || {}).pts || 0), 0);
      const walletPts = Math.max(0, ((wallet.balance || 0) + (wallet.pending || 0)) * _toPts - _cp);
      const totalPts = pts + walletPts;
      return {
        person: p,
        pts: totalPts,
        sessionPts: pts,
        walletPts,
        mins,
        bal: wallet.balance || 0
      };
    }).sort((a, b) => b.pts - a.pts);
  }, [sessions, wallets, family, cat, weekOnly, cpAll]);
  // Filter sessions to current week only when weekOnly=true
  const weekSessions = useMemo(() => {
    if(!weekOnly) return sessions;
    const filtered = {};
    Object.keys(sessions).forEach(pid => {
      const s = sessions[pid] || {};
      const today = (s.today || []).filter(e => getISOWeek(e.startTime||Date.now())===THIS_WEEK);
      filtered[pid] = {...s, today};
    });
    return filtered;
  }, [sessions, weekOnly]);

  const medals = ['🥇', '🥈', '🥉'];
  // Ties: same pts = same rank
  const ranked = useMemo(() => {
    let prevPts = null,
      rank = 0,
      assignedRank = 0;
    return boards.map((b, i) => {
      if (b.pts !== prevPts) {
        assignedRank = i + 1;
        prevPts = b.pts;
      }
      return {
        ...b,
        rank: assignedRank
      };
    });
  }, [boards]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      marginBottom: 4
    }
  }, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: '#C0CA33'
    }
  }, "Family Leaderboard"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#555',
      marginTop: 3
    }
  }, "Based on today's activity points")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      overflowX: 'auto',
      marginBottom: 14
    }
  },
    /*#__PURE__*/React.createElement("div", {style:{width:'100%',display:'flex',alignItems:'center',gap:8,marginBottom:6,paddingBottom:6,borderBottom:'1px solid rgba(255,255,255,.06)'}},
      /*#__PURE__*/React.createElement("button", {
        onClick: ()=>setWeekOnly(function(p){return !p;}),
        style:{padding:'5px 12px',borderRadius:20,border:'none',cursor:'pointer',fontSize:9,fontWeight:800,
          background:weekOnly?'#C0CA33':'rgba(255,255,255,.08)',color:weekOnly?'#000':'#555'}
      }, weekOnly?'📅 This Week':'📅 All Time'),
      weekOnly&&/*#__PURE__*/React.createElement("div",{style:{fontSize:8,color:'rgba(255,255,255,.3)'}},
        '↺ Resets every Monday')
    ),
  cats.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.k,
    onClick: () => setCat(c.k),
    style: {
      flexShrink: 0,
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 700,
      background: cat === c.k ? '#C0CA33' : 'rgba(255,255,255,.07)',
      color: cat === c.k ? '#000' : '#555',
      border: 'none'
    }
  }, c.l))), boards.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: b.person.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px 13px',
      borderRadius: 12,
      marginBottom: 7,
      background: b.rank === 1 ? 'rgba(192,202,51,.1)' : b.rank === 2 ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.03)',
      border: `1px solid ${b.rank === 1 ? '#C0CA33' : b.rank === 2 ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.05)'}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: b.rank <= 3 ? 24 : 14,
      width: 30,
      textAlign: 'center'
    }
  }, medals[b.rank - 1] || `#${b.rank}`), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: b.person.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      boxShadow: `0 0 10px ${b.person.color}44`
    }
  }, b.person.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#fff'
    }
  }, b.person.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555'
    }
  }, fmtDur(b.mins), " tracked today")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: b.rank === 1 ? '#C0CA33' : b.rank === 2 ? '#aaa' : b.rank === 3 ? '#cd7f32' : '#555'
    }
  }, b.pts), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#444'
    }
  }, "pts")), payMode === 'pay' && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      minWidth: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#4CAF82'
    }
  }, "$", b.bal.toFixed(2)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      color: '#444'
    }
  }, "earned")))), boards.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '30px 0',
      color: '#333',
      fontSize: 13
    }
  }, "No one clocked in yet today"));
}

// ═══ PEOPLE MANAGER ══════════════════════════════════════════════════════════
// Passcode box inside a family member's edit screen: masked by default, a button reveals it
function MemberPinBox(props) {
  var h = React.createElement, p = props.person;
  var a = React.useState(''), val = a[0], setVal = a[1], b = React.useState(false), show = b[0], setShow = b[1], c = React.useState(''), msg = c[0], setMsg = c[1], d = React.useState(0), setV = d[1];
  var stored = ''; try { stored = String((JSON.parse(localStorage.getItem('argilan_pins') || '{}'))[p.id] || '').trim(); } catch (e) {}
  var has = !!stored;
  function save() {
    var clean = val.replace(/[^0-9]/g, '').slice(0, 4);
    if (clean.length !== 4) { setMsg('Passcode must be exactly 4 numbers.'); return; }
    if (typeof window._appSetPin === 'function') window._appSetPin(p.id, clean); else { try { var o = JSON.parse(localStorage.getItem('argilan_pins') || '{}'); o[p.id] = clean; localStorage.setItem('argilan_pins', JSON.stringify(o)); syncSet('pins/' + p.id, clean); } catch (e) {} }
    setVal(''); setMsg('✅ Passcode saved for ' + p.name + '.'); setV(function (x) { return x + 1; });
  }
  var btn = function (bg, fg, fn, t) { return h('button', { onClick: fn, style: { background: bg, color: fg, border: 'none', borderRadius: 18, padding: '9px 14px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, t); };
  return h('div', { style: { margin: '12px 0', padding: 12, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 } },
    h('div', { style: { fontSize: 12, fontWeight: 900, color: '#fff', marginBottom: 4 } }, '🔐 Passcode'),
    h('div', { style: { fontSize: 13, fontWeight: 800, color: has ? '#4CAF82' : '#FFB74D', marginBottom: 8 } }, has ? '✅ A passcode has been set' + (show ? ' — it is ' + stored : ' (hidden)') : '⚠️ No passcode set yet'),
    h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
      h('input', { type: show ? 'text' : 'password', inputMode: 'numeric', maxLength: 4, value: val, placeholder: has ? 'New 4-digit passcode' : '4-digit passcode', onChange: function (e) { setVal(e.target.value.replace(/[^0-9]/g, '').slice(0, 4)); }, style: { width: 150, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, padding: 10, color: '#fff', fontSize: 16, letterSpacing: 4 } }),
      btn('rgba(66,165,245,.25)', '#90CAF9', function () { setShow(!show); }, show ? '🙈 Hide' : '👁 Show passcode'),
      btn('#9C8DC4', '#000', save, has ? 'Change passcode' : 'Save passcode')),
    msg && h('div', { style: { fontSize: 12, color: '#FFB74D', marginTop: 8 } }, msg),
    (p.role === 'parent') && h('div', { style: { fontSize: 11, color: '#9a9ab0', marginTop: 8 } }, 'Parent passcodes stay on each device and are never shared online.'));
}
function PeopleManager({
  family,
  savePerson,
  deletePerson
}) {
  const blank = {
    name: '',
    full: '',
    emoji: '😊',
    color: '#888888',
    colorName: '',
    role: 'child',
    age: '',
    inPaySystem: true
  };
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(false);
  const ROLES = ['parent', 'child', 'elder'];
  const EMOJIS = ['👩', '👨', '👦', '👧', '👴', '👵', '🧑', '🧒', '😊', '🌟'];
  function save() {
    if (!form.name || !form.full) return;
    const id = form.id || 'p' + Date.now();
    const p = {
      ...form,
      id,
      age: form.age ? parseInt(form.age) : undefined
    };
    savePerson(p);
    setForm(blank);
    setEditing(false);
  }
  function del(p) {
    if (window._safeConfirm(`Remove ${p.name}? Data is kept but they won't appear.`)) deletePerson(p.id);
  }
  const inp = {
    width: '100%',
    background: 'rgba(255,255,255,.08)',
    border: '1px solid rgba(255,255,255,.1)',
    borderRadius: 8,
    padding: '8px 10px',
    color: '#fff',
    fontSize: 11,
    marginTop: 3
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl",
    style: {
      marginTop: 16
    }
  }, "Family Members"), (family || DEFAULT_FAMILY).map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "card",
    style: {
      marginBottom: 7,
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: p.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 17
    }
  }, p.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: '#fff'
    }
  }, p.name, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: '#444'
    }
  }, p.role)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#444'
    }
  }, p.full, p.age ? ` · Age ${p.age}` : ''), /*#__PURE__*/React.createElement("div", {
    style: { fontSize: 11, fontWeight: 800, marginTop: 2, color: (function () { try { return JSON.parse(localStorage.getItem('argilan_pins') || '{}')[p.id] ? '#4CAF82' : '#FFB74D'; } catch (e) { return '#FFB74D'; } })() }
  }, (function () { try { return JSON.parse(localStorage.getItem('argilan_pins') || '{}')[p.id] ? '🔒 Passcode set' : '⚠️ Passcode not set'; } catch (e) { return '⚠️ Passcode not set'; } })() + (p.role === 'parent' ? ' (on this device)' : ''))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setForm({
        ...p,
        age: p.age || ''
      });
      setEditing(true);
      setTimeout(function () { try { var el = document.getElementById('pm_edit_form'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} }, 80);
    },
    style: {
      background: '#9C8DC4',
      color: '#000',
      padding: '10px 16px',
      borderRadius: 20,
      fontSize: 14,
      fontWeight: 800,
      border: 'none',
      cursor: 'pointer'
    }
  }, "\u270F\uFE0F Edit"), /*#__PURE__*/React.createElement("button", {
    onClick: () => del(p),
    style: {
      background: 'rgba(239,83,80,.1)',
      color: '#EF5350',
      padding: '10px 12px',
      borderRadius: 20,
      border: 'none',
      fontSize: 14
    }
  }, "\u2715"))), editing ? /*#__PURE__*/React.createElement("div", {
    id: "pm_edit_form",
    className: "card",
    style: {
      marginTop: 10,
      borderColor: 'rgba(192,202,51,.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#C0CA33',
      marginBottom: 10
    }
  }, form.id ? 'EDIT' : 'ADD', " FAMILY MEMBER"), [{
    k: 'name',
    l: 'Display Name',
    p: 'e.g. Sarah'
  }, {
    k: 'full',
    l: 'Full Name',
    p: 'e.g. Sarah Grace Argilan'
  }, {
    k: 'colorName',
    l: 'Color Name',
    p: 'e.g. Rose'
  }, {
    k: 'age',
    l: 'Age (optional)',
    p: '14',
    t: 'number'
  }].map(f => /*#__PURE__*/React.createElement("div", {
    key: f.k,
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#444'
    }
  }, f.l), /*#__PURE__*/React.createElement("input", {
    type: f.t || 'text',
    value: form[f.k] || '',
    placeholder: f.p,
    onChange: e => setForm({
      ...form,
      [f.k]: e.target.value
    }),
    style: inp
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#444',
      marginBottom: 4
    }
  }, "Color"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: form.color || '#888888',
    onChange: e => setForm({
      ...form,
      color: e.target.value
    }),
    style: {
      width: 40,
      height: 34,
      borderRadius: 8,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: form.color
    }
  }, form.color))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#444',
      marginBottom: 4
    }
  }, "Emoji"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      flexWrap: 'wrap'
    }
  }, EMOJIS.map(e => /*#__PURE__*/React.createElement("button", {
    key: e,
    onClick: () => setForm({
      ...form,
      emoji: e
    }),
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: form.emoji === e ? form.color : 'rgba(255,255,255,.07)',
      fontSize: 17,
      border: form.emoji === e ? `2px solid ${form.color}` : 'none'
    }
  }, e)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#444',
      marginBottom: 4
    }
  }, "Role"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, ROLES.map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    onClick: () => setForm({
      ...form,
      role: r
    }),
    style: {
      padding: '6px 14px',
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 700,
      background: form.role === r ? '#1A73E8' : 'rgba(255,255,255,.07)',
      color: form.role === r ? '#fff' : '#555',
      border: 'none'
    }
  }, r)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 10,
      color: '#555'
    }
  }, "Include in payment/points"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setForm({
      ...form,
      inPaySystem: !form.inPaySystem
    }),
    style: {
      background: form.inPaySystem ? '#4CAF82' : 'rgba(255,255,255,.07)',
      color: form.inPaySystem ? '#000' : '#555',
      padding: '6px 14px',
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 700,
      border: 'none'
    }
  }, form.inPaySystem ? 'Yes' : 'No')), form.id && /*#__PURE__*/React.createElement(MemberPinBox, { person: form }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: save,
    style: {
      flex: 1,
      background: '#C0CA33',
      color: '#000',
      padding: '10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700
    }
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditing(false);
      setForm(blank);
    },
    style: {
      background: 'rgba(255,255,255,.07)',
      color: '#555',
      padding: '10px 16px',
      borderRadius: 20,
      fontSize: 11
    }
  }, "Cancel"))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(true),
    style: {
      width: '100%',
      background: 'rgba(192,202,51,.07)',
      border: '1px dashed #C0CA33',
      color: '#C0CA33',
      padding: '10px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      marginTop: 6
    }
  }, "+ Add Family Member"));
}

// ═══ ADMIN CONTROL PANEL ═════════════════════════════════════════════════════
function AdminControl({
  sessions,
  setSessions,
  notifs,
  clearAllNotifs,
  deleteNotif,
  wallets,
  resetWallet,
  deduct,
  adminBonus,
  tasks,
  todayTasks,
  resetTask,
  deleteTask,
  family,
  settings,
  updateSetting
}) {
  const [tab, setTab] = useState('sessions');
  const ctabs = [{
    id: 'sessions',
    l: '⏱ Sessions'
  }, {
    id: 'wallets',
    l: '💰 Wallets'
  }, {
    id: 'tasks',
    l: '🎯 Tasks'
  }, {
    id: 'notifs',
    l: '🔔 Alerts'
  }, {
    id: 'system',
    l: '⚙️ System'
  }, {
    id: 'alarm',
    l: '📣 Alarms'
  }];
  function deleteSession(pid, idx) {
    const data = sessions[pid] || {
      current: null,
      today: []
    };
    const today = [...(data.today || [])];
    today.splice(idx, 1);
    const updated = {
      ...sessions,
      [pid]: {
        ...data,
        today
      }
    };
    setSessions(updated);
    syncSet('sessions/' + todayKey() + '/' + pid, {
      ...data,
      today
    });
  }
  function deleteCurrentClock(pid) {
    const data = sessions[pid] || {
      current: null,
      today: []
    };
    const updated = {
      ...sessions,
      [pid]: {
        ...data,
        current: null
      }
    };
    setSessions(updated);
    syncSet('sessions/' + todayKey() + '/' + pid, {
      ...data,
      current: null
    });
  }
  function resetPerson(pid) {
    if (!window._safeConfirm('Reset ALL clock data for this person today?')) return;
    const updated = {
      ...sessions,
      [pid]: {
        current: null,
        today: []
      }
    };
    setSessions(updated);
    syncSet('sessions/' + todayKey() + '/' + pid, {
      current: null,
      today: []
    });
  }
  function resetAll() {
    if (!window._safeConfirm('Reset ALL clock data for EVERYONE today?')) return;
    const updated = {};
    (family || DEFAULT_FAMILY).forEach(p => {
      updated[p.id] = {
        current: null,
        today: []
      };
      syncSet('sessions/' + todayKey() + '/' + p.id, {
        current: null,
        today: []
      });
    });
    setSessions(updated);
  }
  const VOL_LABELS = ['🔇 Mute — No sounds', '🔈 Soft — Quiet beeps', '🔊 Normal — Standard', '📢 Loud — Hard to miss', '📣 Ultra — Max + vibrate'];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      overflowX: 'auto',
      marginBottom: 12
    }
  }, ctabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      flexShrink: 0,
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 700,
      background: tab === t.id ? '#EF5350' : 'rgba(255,255,255,.07)',
      color: tab === t.id ? '#fff' : '#555',
      border: 'none'
    }
  }, t.l))), tab === 'sessions' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lbl",
    style: {
      margin: 0
    }
  }, "Today Clock Data"), /*#__PURE__*/React.createElement("button", {
    onClick: resetAll,
    style: {
      background: 'rgba(239,83,80,.1)',
      color: '#EF5350',
      padding: '5px 10px',
      borderRadius: 20,
      fontSize: 9
    }
  }, "Reset All")), (family || DEFAULT_FAMILY).map(p => {
    const data = sessions[p.id] || {};
    const cur = data.current;
    const tod = data.today || [];
    if (!cur && tod.length === 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "card",
      style: {
        marginBottom: 10,
        borderColor: `${p.color}33`
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
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: p.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15
      }
    }, p.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 12,
        fontWeight: 700,
        color: '#fff'
      }
    }, p.name), /*#__PURE__*/React.createElement("button", {
      onClick: () => resetPerson(p.id),
      style: {
        background: 'rgba(239,83,80,.1)',
        color: '#EF5350',
        padding: '4px 8px',
        borderRadius: 20,
        fontSize: 9
      }
    }, "Reset")), cur && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        padding: '5px 8px',
        background: 'rgba(255,152,0,.08)',
        borderRadius: 8,
        marginBottom: 5,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: '#FF9800',
        flex: 1
      }
    }, "ACTIVE: ", getAct(cur.activity).label, " since ", fmtTime(cur.startTime)), /*#__PURE__*/React.createElement("button", {
      onClick: () => deleteCurrentClock(p.id),
      style: {
        background: 'rgba(239,83,80,.15)',
        color: '#EF5350',
        padding: '3px 7px',
        borderRadius: 20,
        fontSize: 9
      }
    }, "\u2715 Delete")), tod.map((e, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 0',
        borderBottom: '1px solid rgba(255,255,255,.04)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: getAct(e.activity).color,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 10,
        color: '#bbb'
      }
    }, getAct(e.activity).label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#444'
      }
    }, fmtTime(e.startTime)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#777'
      }
    }, fmtDur(e.duration)), /*#__PURE__*/React.createElement("button", {
      onClick: () => deleteSession(p.id, i),
      style: {
        background: 'rgba(239,83,80,.12)',
        color: '#EF5350',
        padding: '2px 6px',
        borderRadius: 20,
        fontSize: 8
      }
    }, "\u2715"))));
  })), tab === 'wallets' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Wallet Control"), (family || DEFAULT_FAMILY).filter(p => p.inPaySystem).map(p => {
    const w = wallets[p.id] || {
      balance: 0,
      pending: 0,
      history: []
    };
    const pending = (w.history || []).filter(t => !t.approved && !t.rejected && t.amount > 0);
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "card",
      style: {
        marginBottom: 10,
        borderColor: `${p.color}33`
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
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: p.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15
      }
    }, p.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: '#fff'
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: '#4CAF82'
      }
    }, "$", (w.balance || 0).toFixed(2), " \xB7 Pending: $", (w.pending || 0).toFixed(2))), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window._safeConfirm(`Reset ${p.name}'s wallet?`)) resetWallet(p.id);
      },
      style: {
        background: 'rgba(239,83,80,.1)',
        color: '#EF5350',
        padding: '4px 8px',
        borderRadius: 20,
        fontSize: 9
      }
    }, "Reset")), pending.map(tx => /*#__PURE__*/React.createElement("div", {
      key: tx.id,
      style: {
        display: 'flex',
        gap: 7,
        padding: '5px 6px',
        background: 'rgba(255,152,0,.07)',
        borderRadius: 8,
        marginBottom: 4,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 10,
        color: '#ccc'
      }
    }, tx.reason), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: '#FF9800'
      }
    }, "$", tx.amount.toFixed(2)), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const ww = wallets[p.id];
        if (!ww) return;
        const h = (ww.history || []).map(t => t.id === tx.id ? {
          ...t,
          approved: true
        } : t);
        syncSet('wallets/' + p.id, {
          ...ww,
          balance: (ww.balance || 0) + tx.amount,
          pending: Math.max(0, (ww.pending || 0) - tx.amount),
          history: h
        });
      },
      style: {
        background: 'rgba(76,175,80,.15)',
        color: '#4CAF82',
        padding: '3px 7px',
        borderRadius: 20,
        fontSize: 9
      }
    }, "\u2705"), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const ww = wallets[p.id];
        if (!ww) return;
        const h = (ww.history || []).map(t => t.id === tx.id ? {
          ...t,
          rejected: true,
          approved: false
        } : t);
        syncSet('wallets/' + p.id, {
          ...ww,
          pending: Math.max(0, (ww.pending || 0) - tx.amount),
          history: h
        });
      },
      style: {
        background: 'rgba(239,83,80,.12)',
        color: '#EF5350',
        padding: '3px 7px',
        borderRadius: 20,
        fontSize: 9
      }
    }, "\u274C"))));
  })), tab === 'tasks' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Task Control"), todayTasks.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#333',
      fontSize: 12,
      textAlign: 'center',
      padding: '20px 0'
    }
  }, "No tasks today"), todayTasks.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "card",
    style: {
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#fff'
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555'
    }
  }, t.status, t.pay ? ` · $${t.pay}` : '')), t.status !== 'pending' && /*#__PURE__*/React.createElement("button", {
    onClick: () => resetTask(t.id),
    style: {
      background: 'rgba(255,152,0,.1)',
      color: '#FF9800',
      padding: '4px 8px',
      borderRadius: 20,
      fontSize: 9
    }
  }, "Reset"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window._safeConfirm('Delete task?')) deleteTask(t.id);
    },
    style: {
      background: 'rgba(239,83,80,.1)',
      color: '#EF5350',
      padding: '4px 8px',
      borderRadius: 20,
      fontSize: 9
    }
  }, "\u2715"))))), tab === 'notifs' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lbl",
    style: {
      margin: 0
    }
  }, "Notifications"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window._safeConfirm('Clear ALL?')) clearAllNotifs();
    },
    style: {
      background: 'rgba(239,83,80,.1)',
      color: '#EF5350',
      padding: '5px 10px',
      borderRadius: 20,
      fontSize: 9
    }
  }, "Clear All")), (notifs || []).slice(0, 30).map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    style: {
      display: 'flex',
      gap: 8,
      padding: '6px 0',
      borderBottom: '1px solid rgba(255,255,255,.04)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#ccc'
    }
  }, n.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#333'
    }
  }, new Date(n.timestamp).toLocaleTimeString())), /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteNotif(n.id),
    style: {
      background: 'rgba(239,83,80,.1)',
      color: '#EF5350',
      padding: '3px 7px',
      borderRadius: 20,
      fontSize: 9
    }
  }, "\u2715")))), tab === 'alarm' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Alarm Volume"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#aaa',
      marginBottom: 12
    }
  }, "Tap to select. Test plays a sample sound. Ultra also vibrates your device."), VOL_LABELS.map((l, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => {
      updateSetting('alarmVol', i);
      if (i > 0) setTimeout(() => playSound('notif'), 50);
    },
    style: {
      display: 'block',
      width: '100%',
      padding: '11px',
      borderRadius: 20,
      marginBottom: 8,
      fontSize: 12,
      fontWeight: 700,
      background: settings.alarmVol === i ? '#1A73E8' : 'rgba(255,255,255,.06)',
      color: settings.alarmVol === i ? '#fff' : '#555',
      border: `1px solid ${settings.alarmVol === i ? '#1A73E8' : 'rgba(255,255,255,.07)'}`
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Device Reminders (works when app is closed)"), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#aaa',
      lineHeight: 1.7,
      marginBottom: 10
    }
  }, "Connect Google Calendar so reminders fire on all family devices even when this app is closed. Your phone's built-in Google Calendar notifications will handle it."), ['Connect Google Calendar in the Calendar tab', 'Create reminders in the Reminders tab', 'Enable "Add to Google Calendar" on each reminder', 'Google Calendar fires device alerts at the set time — even when app is closed', 'Works on iPhone, Android, Mac, and Windows'].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 7,
      marginBottom: 6,
      fontSize: 10,
      color: '#bbb'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: '#C0CA33',
      color: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 8,
      fontWeight: 700,
      flexShrink: 0
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.5
    }
  }, s))))), tab === 'system' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Reward Mode"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#aaa',
      marginBottom: 10
    }
  }, "Choose how family members earn for completing tasks and clocking in."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7
    }
  }, [{
    k: 'pay',
    l: '💰 Payment',
    d: 'Earns real dollars. Cash App or Chime.'
  }, {
    k: 'points',
    l: '🏆 Points',
    d: 'Leaderboard mode. Encourages friendly competition.'
  }].map(m => /*#__PURE__*/React.createElement("button", {
    key: m.k,
    onClick: () => updateSetting('payMode', m.k),
    style: {
      flex: 1,
      padding: '11px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 700,
      background: settings.payMode === m.k ? '#C0CA33' : 'rgba(255,255,255,.07)',
      color: settings.payMode === m.k ? '#000' : '#555',
      border: 'none',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", null, m.l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      opacity: .6,
      marginTop: 3
    }
  }, m.d))))), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Data Management"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const d = {
        sessions: syncGet('sessions/' + todayKey()),
        notifs: syncGet('notifs'),
        wallets: syncGet('wallets'),
        tasks: syncGet('tasks/' + todayKey())
      };
      const b = new Blob([JSON.stringify(d, null, 2)], {
        type: 'application/json'
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = `argilan_${todayKey()}.json`;
      a.click();
    },
    style: {
      display: 'block',
      width: '100%',
      padding: '11px',
      borderRadius: 20,
      marginBottom: 8,
      fontSize: 11,
      fontWeight: 700,
      background: 'rgba(26,115,232,.1)',
      border: '1px solid #1A73E833',
      color: '#1A73E8',
      textAlign: 'left'
    }
  }, "\uD83D\uDCE5 Export All Data"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window._safeConfirm('Reset today\'s sessions and tasks?')) {
        syncSet('sessions/' + todayKey(), null);
        syncSet('tasks/' + todayKey(), null);
      }
    },
    style: {
      display: 'block',
      width: '100%',
      padding: '11px',
      borderRadius: 20,
      marginBottom: 8,
      fontSize: 11,
      fontWeight: 700,
      background: 'rgba(255,152,0,.1)',
      border: '1px solid #FF980033',
      color: '#FF9800',
      textAlign: 'left'
    }
  }, "\u26A0\uFE0F Reset Today's Data"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window._safeConfirm('NUCLEAR RESET — delete ALL data? Cannot be undone.')) {
        ['sessions', 'notifs', 'wallets', 'tasks', 'people', 'reminders', 'settings'].forEach(k => syncSet(k, null));
        window.location.reload();
      }
    },
    style: {
      display: 'block',
      width: '100%',
      padding: '11px',
      borderRadius: 20,
      marginBottom: 8,
      fontSize: 11,
      fontWeight: 700,
      background: 'rgba(239,83,80,.1)',
      border: '1px solid #EF535033',
      color: '#EF5350',
      textAlign: 'left'
    }
  }, "\uD83D\uDC80 Nuclear Reset \u2014 Everything")));
}

// PIN + PERMISSIONS

// ═══ DEFAULT PERMISSIONS PER ROLE ════════════════════════════════════════════
const DEFAULT_PERMISSIONS = {
  parent: {
    canSeeSchedule: true,
    canSeeVA: true,
    canSeeSpiritual: true,
    canSeeFree: true,
    canSeeOthersTasks: true,
    canClaimTasks: true,
    canAddTasks: true,
    canSeeLeaderboard: true,
    canSeeCalendar: true,
    canManageReminders: true,
    canSeeFamily: true,
    canSeeReport: true,
    canSeeMyEarnings: true
  },
  child: {
    canSeeSchedule: true,
    canSeeVA: false,
    canSeeSpiritual: true,
    canSeeFree: true,
    canSeeOthersTasks: true,
    canClaimTasks: true,
    canAddTasks: false,
    canSeeLeaderboard: true,
    canSeeCalendar: false,
    canManageReminders: false,
    canSeeFamily: false,
    canSeeReport: false,
    canSeeMyEarnings: true
  },
  elder: {
    canSeeSchedule: true,
    canSeeVA: false,
    canSeeSpiritual: true,
    canSeeFree: false,
    canSeeOthersTasks: false,
    canClaimTasks: false,
    canAddTasks: false,
    canSeeLeaderboard: false,
    canSeeCalendar: false,
    canManageReminders: false,
    canSeeFamily: false,
    canSeeReport: false,
    canSeeMyEarnings: false
  }
};
const PERM_LABELS = {
  canSeeSchedule: '📅 See Schedule',
  canSeeVA: '💻 See VA Slots',
  canSeeSpiritual: '📚 See Spiritual',
  canSeeFree: '⬜ See Free Time',
  canSeeOthersTasks: '🎯 See All Tasks',
  canClaimTasks: '🤝 Claim Tasks',
  canAddTasks: '➕ Add Tasks (Admin only)',
  canSeeLeaderboard: '🏆 See Leaderboard',
  canSeeCalendar: '📆 See Calendar',
  canManageReminders: '🔔 Manage Reminders',
  canSeeFamily: '👥 See Family Tab',
  canSeeReport: '📊 See Reports',
  canSeeMyEarnings: '💰 See My Earnings'
};

// ═══ usePins HOOK ═════════════════════════════════════════════════════════════
function usePins() {
  // ── Load PINs from localStorage INSTANTLY on init ──────────────────────────
  // localStorage persists across ALL app updates on the same domain.
  // Firebase is additive — it syncs changes across devices but NEVER blocks login.
  const [pins, setPins] = useState(() => {
    try {
      const local = localStorage.getItem('argilan_pins');
      return local ? JSON.parse(local) : {};
    } catch { return {}; }
  });

  // pinsLoaded = true immediately if localStorage has ANY pins.
  // Only false briefly on a brand-new device with no local data.
  const [pinsLoaded, setPinsLoaded] = useState(() => {
    try {
      const local = localStorage.getItem('argilan_pins');
      return !!(local && Object.keys(JSON.parse(local)).length > 0);
    } catch { return false; }
  });

  useEffect(() => {
    // Firebase syncs cross-device changes — but we give it max 2 seconds.
    // After that, we use whatever localStorage has (which is fine).
    const timeout = setTimeout(() => setPinsLoaded(true), 2000);
    const unsub = syncOn('pins', d => {
      clearTimeout(timeout);
      if (d && typeof d === 'object') {
        // Merge Firebase data with localStorage — Firebase wins for each key
        setPins(prev => {
          const merged = { ...d };
        try { const lp = JSON.parse(localStorage.getItem('argilan_pins') || '{}'); ['laurel', 'eric'].forEach(k => { if (lp[k]) merged[k] = lp[k]; else delete merged[k]; }); } catch {}
          try { localStorage.setItem('argilan_pins', JSON.stringify(merged)); } catch {}
          return merged;
        });
      }
      setPinsLoaded(true);
    });
    return () => { clearTimeout(timeout); if (unsub) unsub(); };
  }, []);

  const setPin = useCallback((personId, pin) => {
    const clean = (pin || '').toString().trim();
    // Write to localStorage SYNCHRONOUSLY before anything else
    try {
      const current = JSON.parse(localStorage.getItem('argilan_pins') || '{}');
      current[personId] = clean;
      localStorage.setItem('argilan_pins', JSON.stringify(current));
    } catch {}
    // Update React state (for UI refresh)
    setPins(prev => ({ ...prev, [personId]: clean }));
    // Sync to Firebase (cross-device)
    syncSet('pins/' + personId, clean);
    try { if (clean) syncSet('pinset/' + personId, Date.now()); } catch (e) {}
  }, []);

  // Read PINs directly from localStorage — always fresh, never stale.
  // React state (pins) is kept in sync but checkPin/hasPin bypass it
  // to avoid any timing issues with state initialization.
  function _readPins() {
    try { return JSON.parse(localStorage.getItem('argilan_pins') || '{}'); } catch { return {}; }
  }

  const checkPin = useCallback((personId, pin) => {
    const stored = _readPins()[personId];
    if (!stored || stored === '') return false;
    return String(pin).trim() === String(stored).trim();
  }, []);

  const hasPin = useCallback(personId => {
    const stored = _readPins()[personId];
    return !!(stored && String(stored).trim() !== '');
  }, []);

  return { pins, setPin, checkPin, hasPin, pinsLoaded };
}

// ═══ usePermissions HOOK ══════════════════════════════════════════════════════
function usePermissions() {
  const [perms, setPermsState] = useState({});
  useEffect(() => syncOn('permissions', d => {
    if (d) setPermsState(d);
  }), []);
  const getPerms = useCallback((personId, role) => {
    const base = DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.child;
    return {
      ...base,
      ...(perms[personId] || {})
    };
  }, [perms]);
  const setPerms = useCallback((personId, p) => syncSet('permissions/' + personId, p), []);
  return {
    getPerms,
    setPerms
  };
}

// ═══ PIN ENTRY SCREEN ════════════════════════════════════════════════════════




function PinEntry(props) {
  var person    = props.person;
  var onSuccess = props.onSuccess;
  var onBack    = props.onBack;
  var checkPin  = props.checkPin;
  var hasPin    = props.hasPin;
  var setPinFn  = props.setPin;

  var s1 = React.useState('');      var digits   = s1[0]; var setDigits   = s1[1];
  var s2 = React.useState('');      var err      = s2[0]; var setErr      = s2[1];
  var s3 = React.useState('enter'); var step     = s3[0]; var setStep     = s3[1];
  var s4 = React.useState('');      var newPin   = s4[0]; var setNewPin   = s4[1];
  var s5 = React.useState(false);   var showReset= s5[0]; var setShowReset= s5[1];
  var s6 = React.useState(false);   var confirmReset = s6[0]; var setConfirmReset = s6[1];
  var s7 = React.useState(false);   var requestSent = s7[0]; var setRequestSent = s7[1];

  var noPin   = !hasPin(person.id);
  var isAdmin = person.role === 'parent';

  React.useEffect(function() {
    if (!noPin) return;
    setStep('create');
    if (false && isAdmin && typeof db !== 'undefined' && db) {
      setStep('checking');
      var done = false, to = setTimeout(function() { if (!done) { done = true; setStep('create'); } }, 4000);
      try {
        db.ref('argilan/pins/' + person.id).once('value').then(function(snap) {
          if (done) return; done = true; clearTimeout(to);
          var v = snap.val();
          if (v) {
            try { var st = JSON.parse(localStorage.getItem('argilan_pins') || '{}'); st[person.id] = String(v); localStorage.setItem('argilan_pins', JSON.stringify(st)); } catch (e) {}
            try { if (typeof window._appSetPin === 'function') window._appSetPin(person.id, String(v)); } catch (e) {}
            setStep('enter');
          } else setStep('create');
        }).catch(function() { if (!done) { done = true; clearTimeout(to); setStep('create'); } });
      } catch (e) { setStep('create'); }
    }
  }, []);

  function savePin(id, pin) {
    var pinStr = String(pin);
    // Write to localStorage first — synchronous, always works
    try {
      var stored = {};
      try { stored = JSON.parse(localStorage.getItem('argilan_pins') || '{}'); } catch(e2) {}
      stored[id] = pinStr;
      localStorage.setItem('argilan_pins', JSON.stringify(stored));
    } catch(e) {}
    // Firebase sync — wrapped so any error is silent
    try {
      if (typeof syncSet === 'function') syncSet('pins/' + id, pinStr);
    } catch(e) {}
    // React state update via global — wrapped
    try {
      if (typeof window._appSetPin === 'function') window._appSetPin(id, pinStr);
    } catch(e) {}
  }

  function doReset() {
    try {
      var stored = {};
      try { stored = JSON.parse(localStorage.getItem('argilan_pins') || '{}'); } catch(e2) {}
      delete stored[person.id];
      localStorage.setItem('argilan_pins', JSON.stringify(stored));
    } catch(e) {}
    try { if (typeof syncSet === 'function') syncSet('pins/' + person.id, null); } catch(e) {}
    setDigits(''); setErr(''); setStep('create'); setNewPin('');
    setShowReset(false); setConfirmReset(false);
  }

  function press(d) {
    try {
      var n = digits + String(d);
      if (n.length > 4) return;
      setDigits(n); setErr('');
      if (n.length < 4) return;

      if (step === 'checking') return;
      if (step === 'enter') {
        var ok = false;
        try { ok = checkPin(person.id, n); } catch(e) {}
        if (ok) { setDigits(''); onSuccess(); }
        else {
          setErr('Incorrect PIN');
          setTimeout(function() { setDigits(''); setErr(''); setShowReset(true); }, 800);
        }
      } else if (step === 'create') {
        setNewPin(n); setDigits(''); setStep('confirm');
      } else if (step === 'confirm') {
        if (n === newPin) {
          savePin(person.id, newPin);
          setDigits('');
          onSuccess();
        } else {
          setErr('PINs did not match');
          setTimeout(function() { setNewPin(''); setDigits(''); setStep('create'); setErr(''); }, 900);
        }
      }
    } catch(e) {
      setErr('Tap again');
      setDigits('');
    }
  }

  function del() {
    setDigits(function(prev) { return prev.slice(0, -1); });
    setErr('');
  }

  // Also accept physical/on-screen keyboard input (top-row numbers work even if
  // NumLock is off — only the numeric keypad depends on NumLock). This means the
  // PIN screen isn't tap-only: any keyboard, or a touchscreen's own keyboard, works.
  React.useEffect(function() {
    function onKeyDown(e) {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        press(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        del();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return function() { window.removeEventListener('keydown', onKeyDown); };
  });

  // No-pin non-admin screen
  if (noPin && !isAdmin) {
    return /*#__PURE__*/React.createElement("div", {style:{minHeight:'100vh',background:'linear-gradient(160deg,#0f0c29,#1a1a2e)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}},
      /*#__PURE__*/React.createElement("div",{style:{width:72,height:72,borderRadius:'50%',background:person.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,marginBottom:16}},person.emoji),
      /*#__PURE__*/React.createElement("div",{style:{fontSize:16,fontWeight:800,color:'#fff',marginBottom:8}},person.name),
      /*#__PURE__*/React.createElement("div",{style:{textAlign:'center',fontSize:14,color:'rgba(255,255,255,.7)',lineHeight:1.6,maxWidth:280,marginBottom:16}},"You do not have a PIN yet. A parent sets it for you."),
      !requestSent && /*#__PURE__*/React.createElement("button",{onClick:requestPinHelp,style:{background:'#FF1493',color:'#fff',border:'3px solid #fff',borderRadius:30,padding:'16px 26px',fontWeight:900,fontSize:18,cursor:'pointer',marginBottom:14,boxShadow:'0 0 22px #FF1493aa'}},"🙋 Ask Laurel or Eric to set my PIN"),
      requestSent && /*#__PURE__*/React.createElement("div",{style:{fontSize:14,color:'#4CAF82',marginBottom:14,textAlign:'center'}},"✅ Sent! Laurel or Eric will set your PIN."),
      /*#__PURE__*/React.createElement("button",{onClick:onBack,style:{background:'transparent',border:'1px solid rgba(255,255,255,.15)',color:'rgba(255,255,255,.5)',borderRadius:20,padding:'8px 24px',fontSize:12,cursor:'pointer'}},"Back")
    );
  }

  var heading = step==='checking' ? 'Checking your family account…' : step==='create' ? (isAdmin ? 'Create your PIN' : 'Welcome! Make your own 4-digit passcode') : step==='confirm' ? 'Confirm your PIN' : 'Enter your PIN';

  var dots = /*#__PURE__*/React.createElement("div", {style:{display:'flex',gap:16,marginBottom:6}},
    [0,1,2,3].map(function(i) {
      return /*#__PURE__*/React.createElement("div", {key:i, style:{width:18,height:18,borderRadius:'50%',background:i<digits.length?person.color:'rgba(255,255,255,.15)',border:'2px solid '+(i<digits.length?person.color:'rgba(255,255,255,.2)'),transition:'background .12s'}});
    })
  );

  var numpadKeys = [1,2,3,4,5,6,7,8,9,'',0,'del'];
  var numpad = /*#__PURE__*/React.createElement("div", {style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,width:'100%',maxWidth:280}},
    numpadKeys.map(function(k, i) {
      var isEmpty = k === '';
      var isDel   = k === 'del';
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: function() {
          if (isEmpty) return;
          try { isDel ? del() : press(k); } catch(e) {}
        },
        style:{height:70,borderRadius:16,border:'none',cursor:isEmpty?'default':'pointer',background:isEmpty?'transparent':'rgba(255,255,255,.08)',color:'#fff',fontSize:isDel?18:24,fontWeight:700,boxShadow:isEmpty?'none':'0 2px 8px rgba(0,0,0,.2)',opacity:isEmpty?0:1}
      }, isDel ? '⌫' : k);
    })
  );

  function requestPinHelp() {
    try {
      const id = 'pin_req_' + Date.now();
      if (typeof syncSet === 'function') syncSet('notifs/' + id, {
        id, type: 'pin_reset_request',
        personId: person.id, personName: person.name,
        title: '🔒 ' + person.name + ' forgot their PIN',
        message: person.name + ' needs a PIN set or reset. Go to Admin → PIN Manager (you can also tap 🔐 Show PIN to read it to them).',
        timestamp: Date.now(), read: false, approved: null
      });
    } catch(e) {}
    setRequestSent(true);
  }

  return /*#__PURE__*/React.createElement("div", {style:{minHeight:'100vh',background:'linear-gradient(160deg,#0f0c29,#1a1a2e)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}},
    /*#__PURE__*/React.createElement("div",{style:{width:72,height:72,borderRadius:'50%',background:person.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,marginBottom:12,boxShadow:'0 0 24px '+person.color+'66'}},person.emoji),
    /*#__PURE__*/React.createElement("div",{style:{fontSize:18,fontWeight:800,color:'#fff',marginBottom:4}},person.name),
    /*#__PURE__*/React.createElement("div",{style:{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:20}},heading),
    dots,
    err
      ? /*#__PURE__*/React.createElement("div",{style:{color:'#FF5252',fontSize:11,marginTop:6,marginBottom:2,textAlign:'center'}},err)
      : /*#__PURE__*/React.createElement("div",{style:{height:20}}),
    numpad,
    /*#__PURE__*/React.createElement("div",{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:10,marginTop:24}},
      /*#__PURE__*/React.createElement("button",{onClick:onBack,style:{background:'transparent',border:'none',color:'rgba(255,255,255,.3)',fontSize:11,cursor:'pointer'}},"Back"),
      false && showReset && isAdmin && !confirmReset && /*#__PURE__*/React.createElement("button",{
        onClick:function(){ setConfirmReset(true); },
        style:{background:'transparent',border:'none',color:'rgba(255,82,82,.4)',fontSize:10,cursor:'pointer'}
      },"Forgot PIN? Reset it"),
      false && showReset && isAdmin && confirmReset && /*#__PURE__*/React.createElement("div",{style:{textAlign:'center'}},
        /*#__PURE__*/React.createElement("div",{style:{fontSize:10,color:'rgba(255,255,255,.5)',marginBottom:8}},"This will clear your PIN so you can create a new one."),
        /*#__PURE__*/React.createElement("div",{style:{display:'flex',gap:8,justifyContent:'center'}},
          /*#__PURE__*/React.createElement("button",{onClick:doReset,style:{background:'#EF5350',color:'#fff',border:'none',borderRadius:20,padding:'7px 16px',fontSize:11,fontWeight:800,cursor:'pointer'}},"Yes, Reset PIN"),
          /*#__PURE__*/React.createElement("button",{onClick:function(){ setConfirmReset(false); },style:{background:'rgba(255,255,255,.08)',color:'#aaa',border:'none',borderRadius:20,padding:'7px 16px',fontSize:11,cursor:'pointer'}},"Cancel")
        )
      ),
      showReset && isAdmin && /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'rgba(255,255,255,.55)',textAlign:'center',maxWidth:240,lineHeight:1.5}},'Forgot it? Go Back, tap "Forgot a PIN?" at the bottom, and a parent enters the Admin Key to reset yours.'),
      // Children/others: no self-reset — ask a parent instead
      !isAdmin && !requestSent && /*#__PURE__*/React.createElement("button",{
        onClick: requestPinHelp,
        style:{background:'#FF1493',border:'3px solid #fff',color:'#fff',fontSize:18,fontWeight:900,cursor:'pointer',borderRadius:30,padding:'16px 26px',boxShadow:'0 0 22px #FF1493aa',maxWidth:320}
      },"🙋 Forgot or need a new PIN? Ask Laurel or Eric"),
      !isAdmin && requestSent && /*#__PURE__*/React.createElement("div",{style:{fontSize:10,color:'#4CAF82',textAlign:'center',maxWidth:220}},"✅ Request sent! Laurel or Eric will set you a new PIN soon.")
    )
  );
}




var _pinAttempts = {};
function _recordFail(id){ _pinAttempts[id]=(_pinAttempts[id]||0)+1; }
function _isLocked(id){ return (_pinAttempts[id]||0)>=5; }
function _clearFails(id){ _pinAttempts[id]=0; }

function LoginScreen(props) {
  var onLogin=props.onLogin, family=props.family, checkPin=props.checkPin,
      hasPin=props.hasPin, setPin=props.setPin;
  var s1=React.useState(null); var pinFor=s1[0]; var setPinFor=s1[1];
  var sj=React.useState(0); var jv=sj[0]; var setJv=sj[1];
  if (typeof fmNeedsJoin === 'function' && fmNeedsJoin()) return React.createElement(JoinGate,{onSkip:function(){ try{localStorage.setItem('fm_nosync','1');}catch(e){} setJv(jv+1); }});

  var base = DEFAULT_FAMILY||[];
  var fam = (family||base).map(function(p){
    var b=base.find(function(x){return x.id===p.id;})||{};
    return Object.assign({},b,p);
  }).filter(function(p){ return p.id&&p.role&&!p.deleted; });

  if (pinFor && typeof fmIsTrusted === 'function' && (pinFor.role==='parent' || pinFor.id==='laurel' || pinFor.id==='eric') && !fmIsTrusted()) return React.createElement(ParentGate,{person:pinFor,onPass:function(){ setJv(jv+1); },onBack:function(){ setPinFor(null); }});
  if (pinFor) return /*#__PURE__*/React.createElement(PinEntry,{
    person:pinFor, checkPin:checkPin, hasPin:hasPin, setPin:setPin,
    onSuccess:function(){ _clearFails(pinFor.id); onLogin(pinFor.id,pinFor.role||'child'); setPinFor(null); },
    onBack:function(){ setPinFor(null); }
  });

  var parents  = fam.filter(function(p){return p.role==='parent';});
  var children = fam.filter(function(p){return p.role==='child';});
  var elders   = fam.filter(function(p){return p.role==='elder';});

  function Card(p, large) {
    var locked = _isLocked(p.id);
    return /*#__PURE__*/React.createElement('div',{
      key:p.id,
      onClick:function(){ if(!locked) setPinFor(p); },
      style:{
        background:'linear-gradient(135deg,'+p.color+'28,'+p.color+'0a)',
        border:'1.5px solid '+(locked?'rgba(239,83,80,.4)':p.color+'70'),
        borderRadius:large?20:14, padding:large?'22px 14px':'14px 10px',
        display:'flex',flexDirection:'column',alignItems:'center',
        gap:large?8:5, cursor:locked?'not-allowed':'pointer',
        opacity:locked?0.6:1, boxShadow:'0 4px 16px rgba(0,0,0,.3)'
      }
    },
      /*#__PURE__*/React.createElement('div',{style:{fontSize:large?44:32}},locked?'lock':(p.emoji||'?')),
      /*#__PURE__*/React.createElement('div',{style:{fontSize:large?15:12,fontWeight:800,color:'#fff',textAlign:'center'}},p.name),
      locked
        ? /*#__PURE__*/React.createElement('div',{style:{fontSize:8,color:'#EF5350',fontWeight:800}},'LOCKED - Ask Laurel')
        : hasPin(p.id)
          ? /*#__PURE__*/React.createElement('div',{style:{fontSize:11,fontWeight:800,color:'#4CAF82'}},'🔒 PIN is set')
          : /*#__PURE__*/React.createElement('div',{style:{fontSize:11,fontWeight:800,color:'#FFB74D'}},p.role==='parent'?'Tap to create PIN':'⚠️ No PIN yet — ask Laurel')
    );
  }

  return /*#__PURE__*/React.createElement('div',{style:{minHeight:'100vh',background:'linear-gradient(160deg,#0f0c29,#1a1a2e,#16213e)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px 16px'}},
    /*#__PURE__*/React.createElement('div',{style:{textAlign:'center',marginBottom:20}},
      /*#__PURE__*/React.createElement('div',{style:{fontSize:20,fontWeight:900,color:'#fff'}},'🏠 MyBethelFamilyHome'),
      /*#__PURE__*/React.createElement('div',{style:{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.45)',letterSpacing:2,textTransform:'uppercase',marginTop:2}},'Argilan Family')
    ),
    /*#__PURE__*/React.createElement('div',{style:{
      width:'100%',maxWidth:380,display:'grid',gridTemplateColumns:'1fr 1fr',gap:0,
      background:'#0b0b12',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,
      overflow:'hidden',marginBottom:28
    }},
      /*#__PURE__*/React.createElement('div',{style:{padding:'14px 12px',borderRight:'1px solid rgba(255,255,255,.08)'}},
        /*#__PURE__*/React.createElement('div',{style:{fontSize:10,fontWeight:800,color:'#fff',marginBottom:6}},'1 Corinthians 14:40'),
        /*#__PURE__*/React.createElement('div',{style:{fontSize:10.5,fontWeight:700,color:'#fff',lineHeight:1.5}},
          'But let ', /*#__PURE__*/React.createElement('b',null,'all things'), ' take place ', /*#__PURE__*/React.createElement('b',null,'decently and by arrangement'), '.'
        )
      ),
      /*#__PURE__*/React.createElement('div',{style:{padding:'14px 12px'}},
        /*#__PURE__*/React.createElement('div',{style:{fontSize:10,fontWeight:800,color:'#fff',marginBottom:6}},'1 Corinthians 12:18'),
        /*#__PURE__*/React.createElement('div',{style:{fontSize:10.5,fontWeight:700,color:'#fff',lineHeight:1.5}},
          'But now God has ', /*#__PURE__*/React.createElement('b',null,'arranged each of the body members just as he pleased'), '.'
        )
      )
    ),
    parents.length>0&&/*#__PURE__*/React.createElement('div',{style:{width:'100%',maxWidth:380,marginBottom:24}},
      /*#__PURE__*/React.createElement('div',{style:{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.3)',letterSpacing:2,marginBottom:10}},'PARENTS'),
      /*#__PURE__*/React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}},
        parents.map(function(p){return Card(p,true);})
      )
    ),
    children.length>0&&/*#__PURE__*/React.createElement('div',{style:{width:'100%',maxWidth:380,marginBottom:24}},
      /*#__PURE__*/React.createElement('div',{style:{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.3)',letterSpacing:2,marginBottom:10}},'CHILDREN'),
      /*#__PURE__*/React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}},
        children.map(function(p){return Card(p,false);})
      )
    ),
    elders.length>0&&/*#__PURE__*/React.createElement('div',{style:{width:'100%',maxWidth:380,marginBottom:24}},
      /*#__PURE__*/React.createElement('div',{style:{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.3)',letterSpacing:2,marginBottom:10}},'FAMILY ELDER'),
      /*#__PURE__*/React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr',gap:10}},
        elders.map(function(p){return Card(p,false);})
      )
    ),
    fam.length===0&&/*#__PURE__*/React.createElement('div',{style:{color:'rgba(255,255,255,.3)',fontSize:13,textAlign:'center'}},'Loading...'),
    /*#__PURE__*/React.createElement(ForgotPinPanel,{fam:fam,hasPin:hasPin,setPin:setPin,checkPin:checkPin})
  );
}

function ForgotPinPanel(props) {
  var fam=props.fam, hasPin=props.hasPin, setPin=props.setPin, checkPin=props.checkPin;
  var s1=React.useState(false); var open=s1[0]; var setOpen=s1[1];
  var s2=React.useState('');    var adminPin=s2[0]; var setAdminPin=s2[1];
  var s3=React.useState(false); var verified=s3[0]; var setVerified=s3[1];
  var s4=React.useState('');    var msg=s4[0]; var setMsg=s4[1];
  var s5=React.useState('');    var recovPhrase=s5[0]; var setRecovPhrase=s5[1];
  var s7=React.useState(null);  var resetting=s7[0]; var setResetting=s7[1];
  var s8=React.useState('');    var newPinInput=s8[0]; var setNewPinInput=s8[1];

  function verifyAdmin() {
    try {
      var v = adminPin.trim();
      var ok = checkPin('laurel', v) || checkPin('eric', v);
      if (ok) { setVerified(true); setMsg(''); setAdminPin(''); }
      else if (v.length >= 8 && window.fmCheckAdminKey) { window.fmCheckAdminKey(v).then(function(g){ if (g) { setVerified(true); setMsg(''); setAdminPin(''); } else { setMsg('Incorrect PIN or Admin Key'); setAdminPin(''); } }); }
      else { setMsg('Incorrect PIN'); setAdminPin(''); }
    } catch(e) { setMsg('Try again'); }
  }

  function tryRecovery() {
    setMsg('Recovery phrases are turned off. Use the other parent\u2019s PIN.');
  }

  function resetFor(personId, personName) {
    setMsg('');
    setResetting({id:personId, name:personName});
    setNewPinInput('');
  }
  function doResetPin() {
    if(!resetting) return;
    var clean = (newPinInput||'').replace(/[^0-9]/g,'').slice(0,4);
    if(clean.length!==4){ setMsg('Must be exactly 4 digits'); return; }
    if(setPin) setPin(resetting.id, clean);
    _clearFails(resetting.id);
    setMsg(resetting.name + ' PIN updated to ' + clean + '!');
    setResetting(null); setNewPinInput('');
  }

  if (!open) return /*#__PURE__*/React.createElement('button',{
    onClick:function(){setOpen(true);},
    style:{marginTop:28,background:'#FF1493',border:'3px solid #fff',color:'#fff',fontSize:17,fontWeight:900,cursor:'pointer',padding:'14px 26px',borderRadius:30,boxShadow:'0 0 22px #FF1493aa'}
  },'🔑 Forgot a PIN?');

  return /*#__PURE__*/React.createElement('div',{style:{marginTop:20,width:'100%',maxWidth:380,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',borderRadius:16,padding:16}},
    /*#__PURE__*/React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}},
      /*#__PURE__*/React.createElement('div',{style:{fontSize:12,fontWeight:800,color:'#fff'}},'Reset a PIN'),
      /*#__PURE__*/React.createElement('button',{onClick:function(){setOpen(false);setVerified(false);setAdminPin('');setMsg('');setRecovPhrase('');},style:{background:'transparent',border:'none',color:'rgba(255,255,255,.4)',fontSize:20,cursor:'pointer',lineHeight:1}},'x')
    ),
    !verified&&/*#__PURE__*/React.createElement('div',null,
      /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'rgba(255,255,255,.5)',marginBottom:6}},"A parent must approve. Enter a parent PIN or the Admin Key:"),
      /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8,marginBottom:16}},
        /*#__PURE__*/React.createElement('input',{
          type:'password',maxLength:60,value:adminPin,
          onChange:function(e){setAdminPin(e.target.value);},
          placeholder:'Parent PIN or Admin Key',
          style:{flex:1,background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:10,padding:'10px 12px',color:'#fff',fontSize:18,textAlign:'center',letterSpacing:4}
        }),
        /*#__PURE__*/React.createElement('button',{onClick:verifyAdmin,style:{background:'#9C8DC4',color:'#000',border:'none',borderRadius:10,padding:'10px 14px',fontWeight:800,fontSize:11,cursor:'pointer'}},'Verify')
      ),
      false && /*#__PURE__*/React.createElement('div',{style:{borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:12}},
        /*#__PURE__*/React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.3)',marginBottom:6}},'Admin forgot their own PIN? Use recovery phrase:'),
        /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8}},
          /*#__PURE__*/React.createElement('input',{
            type:'text',value:recovPhrase,
            onChange:function(e){setRecovPhrase(e.target.value);},
            placeholder:'Recovery phrase',
            style:{flex:1,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'8px 12px',color:'#fff',fontSize:11}
          }),
          /*#__PURE__*/React.createElement('button',{onClick:tryRecovery,style:{background:'rgba(239,83,80,.15)',color:'#EF5350',border:'1px solid rgba(239,83,80,.3)',borderRadius:10,padding:'8px 12px',fontWeight:800,fontSize:10,cursor:'pointer'}},'Use')
        ),
        /*#__PURE__*/React.createElement('div',{style:{fontSize:8,color:'rgba(255,255,255,.15)',marginTop:4}},'')
      ),
      msg&&/*#__PURE__*/React.createElement('div',{style:{color:'#EF5350',fontSize:10,marginTop:8,textAlign:'center'}},msg)
    ),
    verified&&/*#__PURE__*/React.createElement('div',null,
      /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#4CAF82',marginBottom:10}},'Tap a name to reset their PIN:'),
      (fam||[]).filter(function(p){return p.role!=='elder';}).map(function(p){
        return /*#__PURE__*/React.createElement('div',{key:p.id,style:{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',marginBottom:6,background:'rgba(255,255,255,.05)',borderRadius:10}},
          /*#__PURE__*/React.createElement('span',{style:{fontSize:20}},p.emoji||'?'),
          /*#__PURE__*/React.createElement('div',{style:{flex:1}},
            /*#__PURE__*/React.createElement('div',{style:{fontSize:11,fontWeight:700,color:'#fff'}},p.name),
            /*#__PURE__*/React.createElement('div',{style:{fontSize:8,color:hasPin(p.id)?'#4CAF82':'rgba(255,255,255,.3)'}},hasPin(p.id)?'PIN set':'No PIN')
          ),
          /*#__PURE__*/React.createElement('button',{
            onClick:function(){ resetFor(p.id,p.name); },
            style:{fontSize:9,background:'rgba(156,141,196,.2)',color:'#9C8DC4',border:'1px solid rgba(156,141,196,.3)',borderRadius:20,padding:'5px 12px',cursor:'pointer',fontWeight:800}
          },'Reset')
        ),
        resetting && /*#__PURE__*/React.createElement('div',{style:{marginTop:10,padding:'10px 12px',background:'rgba(156,141,196,.08)',border:'1px solid rgba(156,141,196,.25)',borderRadius:10}},
          /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#9C8DC4',fontWeight:800,marginBottom:6}},'New PIN for '+resetting.name+':'),
          /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8}},
            /*#__PURE__*/React.createElement('input',{type:'password',inputMode:'numeric',maxLength:4,value:newPinInput,onChange:function(e){setNewPinInput(e.target.value.replace(/[^0-9]/g,'').slice(0,4));},placeholder:'4 digits',style:{flex:1,background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:10,padding:'10px',color:'#fff',fontSize:20,textAlign:'center',letterSpacing:4,boxSizing:'border-box'}}),
            /*#__PURE__*/React.createElement('button',{onClick:doResetPin,style:{background:'#9C8DC4',color:'#000',border:'none',borderRadius:10,padding:'10px 14px',fontWeight:800,fontSize:11,cursor:'pointer'}},'Set PIN'),
            /*#__PURE__*/React.createElement('button',{onClick:function(){setResetting(null);setNewPinInput('');},style:{background:'rgba(255,255,255,.06)',color:'#aaa',border:'none',borderRadius:10,padding:'10px',cursor:'pointer'}},'x')
          )
        );
      }),
      msg&&/*#__PURE__*/React.createElement('div',{style:{color:'#4CAF82',fontSize:11,marginTop:8,textAlign:'center',fontWeight:700}},msg)
    )
  );
}


function useSchedule() {
  const [schedData, setSchedData] = React.useState({});
  React.useEffect(() => {
    const unsub = syncOn('schedule', d => { if (d) setSchedData(d); });
    return () => { if (unsub) unsub(); };
  }, []);
  function getDay(dayKey) {
    return schedData[dayKey] || { blocks: [], meta: {} };
  }
  function updateBlock(dayKey, block) {
    const day = getDay(dayKey);
    const blocks = (day.blocks || []).map(b => b.id === block.id ? block : b);
    const next = { ...schedData, [dayKey]: { ...day, blocks } };
    setSchedData(next);
    syncSet('schedule/' + dayKey, { ...day, blocks });
  }
  function addBlock(dayKey, block) {
    const day = getDay(dayKey);
    const blocks = [...(day.blocks || []), block];
    const next = { ...schedData, [dayKey]: { ...day, blocks } };
    setSchedData(next);
    syncSet('schedule/' + dayKey, { ...day, blocks });
  }
  function deleteBlock(dayKey, blockId) {
    const day = getDay(dayKey);
    const blocks = (day.blocks || []).filter(b => b.id !== blockId);
    const next = { ...schedData, [dayKey]: { ...day, blocks } };
    setSchedData(next);
    syncSet('schedule/' + dayKey, { ...day, blocks });
  }
  function moveBlock(dayKey, blockId, dir) {
    const day = getDay(dayKey);
    const blocks = [...(day.blocks || [])];
    const i = blocks.findIndex(b => b.id === blockId);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    const next = { ...schedData, [dayKey]: { ...day, blocks } };
    setSchedData(next);
    syncSet('schedule/' + dayKey, { ...day, blocks });
  }
  function updateDayMeta(dayKey, meta) {
    const day = getDay(dayKey);
    const next = { ...schedData, [dayKey]: { ...day, meta } };
    setSchedData(next);
    syncSet('schedule/' + dayKey, { ...day, meta });
  }
  function resetDay(dayKey) {
    const next = { ...schedData };
    delete next[dayKey];
    setSchedData(next);
    syncSet('schedule/' + dayKey, null);
  }
  return { getDay, updateBlock, addBlock, deleteBlock, moveBlock, updateDayMeta, resetDay, schedData };
}

// ── Schedule View (read-only for children) ───────────────────────────────────
function ScheduleView({ schedHook, personId, isAdmin, activeDay }) {
  if (!schedHook) return null;
  const day = schedHook.getDay(activeDay || (typeof planDayKey === 'function' ? planDayKey() : new Date().toISOString().split('T')[0]));
  const blocks = day.blocks || [];
  if (blocks.length === 0) return React.createElement('div', { style: { padding: 20, textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: 11 } }, 'No schedule blocks for today. Admin can add them.');
  return React.createElement('div', { style: { padding: '0 0 10px' } },
    blocks.map(b => React.createElement('div', { key: b.id, style: { padding: '9px 12px', marginBottom: 6, background: (b.color || '#555') + '18', border: '1px solid ' + (b.color || '#555') + '44', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 } },
      b.emoji && React.createElement('span', { style: { fontSize: 18 } }, b.emoji),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: '#fff' } }, b.title || 'Block'),
        b.time && React.createElement('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)' } }, b.time)
      )
    ))
  );
}

// ── Schedule Editor View (admin) ─────────────────────────────────────────────
function ScheduleEditorView({ isAdmin, editMode, setEditMode, schedHook, activeDay }) {
  const dayKey = activeDay || (typeof planDayKey === 'function' ? planDayKey() : new Date().toISOString().split('T')[0]);
  const day = schedHook ? schedHook.getDay(dayKey) : { blocks: [], meta: {} };
  const blocks = day.blocks || [];
  const [newTitle, setNewTitle] = React.useState('');
  const [newTime, setNewTime] = React.useState('');
  const [newAct, setNewAct] = React.useState('');
  const [newKids, setNewKids] = React.useState([]);
  const kidList = (typeof DEFAULT_FAMILY !== 'undefined' ? DEFAULT_FAMILY : []).filter(p => p.role === 'child' && !p.deleted);

  if (!isAdmin) return React.createElement(ScheduleView, { schedHook, personId: '', isAdmin: false, activeDay: dayKey });

  function handleAdd() {
    if (!newTitle.trim() || !schedHook) return;
    schedHook.addBlock(dayKey, { id: 'blk_' + Date.now(), title: newTitle.trim(), time: newTime.trim(), color: '#9C8DC4', emoji: '', activity: newAct || '', kids: newKids.length ? newKids : null });
    setNewTitle(''); setNewTime(''); setNewAct(''); setNewKids([]);
  }

  return React.createElement('div', null,
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } },
      React.createElement('div', { style: { fontSize: 11, fontWeight: 800, color: '#fff' } }, 'Schedule'),
      isAdmin && React.createElement('button', { onClick: () => setEditMode && setEditMode(!editMode), style: { fontSize: 9, color: '#9C8DC4', background: 'transparent', border: '1px solid rgba(156,141,196,.3)', borderRadius: 20, padding: '4px 10px', cursor: 'pointer' } }, editMode ? 'Done' : 'Edit')
    ),
    blocks.map(b => React.createElement('div', { key: b.id, style: { padding: '9px 12px', marginBottom: 6, background: (b.color || '#555') + '18', border: '1px solid ' + (b.color || '#555') + '44', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 } },
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: '#fff' } }, (b.emoji || '') + ' ' + (b.title || 'Block')),
        b.time && React.createElement('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)' } }, b.time)
      ),
      editMode && React.createElement('select', { value: b.activity || '', onChange: e => schedHook && schedHook.updateBlock(dayKey, { ...b, activity: e.target.value }), style: { maxWidth: 110, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: 4, color: '#fff', fontSize: 10, marginRight: 6 } }, React.createElement('option', { value: '', style: { color: '#000' } }, 'no clock'), (typeof CLOCK_ACTS !== 'undefined' ? CLOCK_ACTS : []).map(a => React.createElement('option', { key: a.id, value: a.id, style: { color: '#000' } }, a.label))),
      editMode && React.createElement('button', { onClick: () => schedHook && schedHook.deleteBlock(dayKey, b.id), style: { background: 'transparent', border: 'none', color: '#EF5350', fontSize: 16, cursor: 'pointer' } }, 'x')
    )),
    editMode && React.createElement('div', { style: { display: 'flex', gap: 6, marginTop: 8 } },
      React.createElement('input', { value: newTime, onChange: e => setNewTime(e.target.value), placeholder: '8:00 AM', style: { width: 70, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '6px 8px', color: '#fff', fontSize: 10 } }),
      React.createElement('input', { value: newTitle, onChange: e => setNewTitle(e.target.value), placeholder: 'Block title', style: { flex: 1, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '6px 8px', color: '#fff', fontSize: 10 } }),
      React.createElement('button', { onClick: handleAdd, style: { background: '#9C8DC4', color: '#000', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 10, fontWeight: 800, cursor: 'pointer' } }, '+')
    ),
    editMode && React.createElement('div', { style: { marginTop: 8 } },
      React.createElement('div', { style: { fontSize: 11, color: '#c8c8d8', marginBottom: 4 } }, 'Kids clock into (so the clock matches the schedule):'),
      React.createElement('select', { value: newAct, onChange: e => setNewAct(e.target.value), style: { width: '100%', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: 8, color: '#fff', fontSize: 12, marginBottom: 6 } },
        React.createElement('option', { value: '', style: { color: '#000' } }, '— no clock activity —'),
        (typeof CLOCK_ACTS !== 'undefined' ? CLOCK_ACTS : []).map(a => React.createElement('option', { key: a.id, value: a.id, style: { color: '#000' } }, a.label))),
      React.createElement('div', { style: { fontSize: 11, color: '#c8c8d8', marginBottom: 4 } }, 'For (none picked = everyone):'),
      React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, kidList.map(k => { const on = newKids.indexOf(k.id) !== -1; return React.createElement('button', { key: k.id, onClick: () => setNewKids(on ? newKids.filter(x => x !== k.id) : newKids.concat(k.id)), style: { padding: '6px 10px', borderRadius: 16, border: '1px solid ' + (on ? '#9C8DC4' : 'rgba(255,255,255,.2)'), background: on ? '#9C8DC4' : 'transparent', color: on ? '#000' : '#ccc', fontSize: 12, fontWeight: 800, cursor: 'pointer' } }, (k.emoji || '') + ' ' + k.name); }))
    )
  );
}


// ── Restored missing components ───────────────────────────────────────────────

function SyncDot() {
  const [status, setStatus] = React.useState('ok');
  React.useEffect(() => { window._setSyncStatus = setStatus; return () => { delete window._setSyncStatus; }; }, []);
  const colors = { ok: '#4CAF82', syncing: '#F6BF26', error: '#EF5350' };
  const offline = (typeof db === 'undefined' || !db);
  const shown = offline ? 'error' : status;
  return /*#__PURE__*/React.createElement('div', { title: offline ? 'Not connected to family sync' : status, style: { width: 8, height: 8, borderRadius: '50%', background: colors[shown]||'#4CAF82', display: 'inline-block', marginLeft: 4, transition: 'background .3s' } });
}

function WaterQuickBar({ personId, onSwitchTab }) {
  const [entries, setEntries] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('health_log_' + personId) || '[]'); } catch (e) { return []; }
  });
  const goalKey = 'water_goal_' + personId;
  const [goal, setGoal] = React.useState(() => { try { return parseInt(localStorage.getItem(goalKey), 10) || 64; } catch (e) { return 64; } });
  const [editGoal, setEditGoal] = React.useState(false);
  const [goalDraft, setGoalDraft] = React.useState('');
  React.useEffect(() => {
    try { setEntries(JSON.parse(localStorage.getItem('health_log_' + personId) || '[]')); } catch (e) { setEntries([]); }
    try { setGoal(parseInt(localStorage.getItem(goalKey), 10) || 64); } catch (e) {}
    let unsub = null;
    try {
      unsub = syncOn('health_log/' + personId, d => {
        if (d) { const arr = Object.values(d).sort((x, y) => y.ts - x.ts); setEntries(arr); try { localStorage.setItem('health_log_' + personId, JSON.stringify(arr)); } catch (e) {} }
      });
    } catch (e) {}
    let unsubG = null;
    try { unsubG = syncOn('water_goal/' + personId, g => { if (g) { setGoal(parseInt(g, 10) || 64); } }); } catch (e) {}
    return () => { if (typeof unsub === 'function') unsub(); if (typeof unsubG === 'function') unsubG(); };
  }, [personId]);
  const day = d => new Date(d).toLocaleDateString('en-CA');
  const todayStr = day(Date.now());
  const waters = entries.filter(e => e.type === 'water' && day(e.ts) === todayStr);
  const total = waters.reduce((n, e) => n + (parseFloat(e.amount) || 0), 0);
  const pct = Math.min(100, Math.round(total / goal * 100));
  function add(oz) {
    const id = 'hl_' + Date.now();
    const entry = { id, type: 'water', ts: Date.now(), loggedBy: window._currentPersonId || personId, amount: String(oz), note: '' };
    const next = [entry, ...entries];
    setEntries(next);
    try { localStorage.setItem('health_log_' + personId, JSON.stringify(next)); } catch (e) {}
    try { syncSet('health_log/' + personId + '/' + id, entry); } catch (e) {}
  }
  function undo() {
    if (!waters.length) return;
    const last = waters.slice().sort((x, y) => y.ts - x.ts)[0];
    const next = entries.filter(e => e.id !== last.id);
    setEntries(next);
    try { localStorage.setItem('health_log_' + personId, JSON.stringify(next)); } catch (e) {}
    try { syncSet('health_log/' + personId + '/' + last.id, null); } catch (e) {}
  }
  function saveGoal() {
    const g = parseInt(goalDraft, 10);
    if (g > 0 && g < 400) { setGoal(g); try { localStorage.setItem(goalKey, String(g)); } catch (e) {} try { syncSet('water_goal/' + personId, g); } catch (e) {} }
    setEditGoal(false);
  }
  const btn = (oz) => React.createElement('button', { key: oz, onClick: () => add(oz), style: { fontSize: 11, fontWeight: 800, background: 'rgba(3,105,161,.35)', color: '#7CC8F5', border: '1px solid rgba(3,105,161,.6)', borderRadius: 20, padding: '5px 10px', cursor: 'pointer' } }, '+' + oz);
  const done = total >= goal;
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(3,105,161,.12)', borderTop: '1px solid rgba(3,105,161,.25)', flexWrap: 'wrap' } },
    React.createElement('div', { style: { flex: 1, minWidth: 130 } },
      React.createElement('div', { style: { fontSize: 11, fontWeight: 800, color: done ? '#4CAF82' : '#7CC8F5' } },
        '💧 Water today: ' + (Math.round(total * 10) / 10) + ' / ',
        editGoal
          ? React.createElement('span', null,
              React.createElement('input', { type: 'number', inputMode: 'numeric', value: goalDraft, autoFocus: true, onChange: e => setGoalDraft(e.target.value), style: { width: 44, fontSize: 11, background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', borderRadius: 6, padding: '1px 4px' } }),
              React.createElement('button', { onClick: saveGoal, style: { marginLeft: 4, fontSize: 10, background: '#4CAF82', border: 'none', borderRadius: 10, padding: '1px 7px', cursor: 'pointer' } }, 'OK'))
          : React.createElement('span', { onClick: () => { setGoalDraft(String(goal)); setEditGoal(true); }, title: 'Tap to change daily goal', style: { textDecoration: 'underline dotted', cursor: 'pointer' } }, goal),
        ' oz' + (done ? ' ✅' : '')),
      React.createElement('div', { style: { height: 6, borderRadius: 3, background: 'rgba(255,255,255,.1)', marginTop: 3, overflow: 'hidden' } },
        React.createElement('div', { style: { width: pct + '%', height: '100%', background: done ? '#4CAF82' : '#29B6F6', transition: 'width .3s' } }))),
    [8, 16, 24].map(btn),
    waters.length > 0 && React.createElement('button', { onClick: undo, title: 'Undo last drink', style: { fontSize: 11, background: 'transparent', color: 'rgba(255,255,255,.45)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 20, padding: '4px 9px', cursor: 'pointer' } }, '↩'),
    onSwitchTab && React.createElement('div', { style: { width: '100%', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', paddingTop: 2 } },
      React.createElement('button', { onClick: () => { window._healthStartType = null; onSwitchTab('health'); }, style: { fontSize: 11, fontWeight: 800, background: '#26A69A', color: '#000', border: 'none', borderRadius: 20, padding: '6px 12px', cursor: 'pointer' } }, '🩺 Health Tracker — log it ›'),
      [['exercise', '🏃 Exercise'], ['med', '💊 Meds'], ['insulin', '💉 Insulin'], ['bg', '🩸 Blood Sugar'], ['meal', '🍽️ Meal']].map(c => React.createElement('button', { key: c[0], onClick: () => { window._healthStartType = c[0]; onSwitchTab('health'); }, style: { fontSize: 10, fontWeight: 700, background: 'rgba(38,166,154,.15)', color: '#7FDDD2', border: '1px solid rgba(38,166,154,.4)', borderRadius: 20, padding: '5px 10px', cursor: 'pointer' } }, c[1]))));
}

function TopClockBar({ personId, role, sessions, onUpdate, addNotif, family, payMode, wallets, onSwitchTab, unreadCount }) {
  const data = ((sessions||{})[personId])||{};
  const cur = data.current;
  const [elapsed, setElapsed] = React.useState(0);
  const acts = (typeof CLOCK_ACTS !== 'undefined' ? CLOCK_ACTS : []);
  const [pickedAct, setPickedAct] = React.useState(() => (localStorage.getItem('_lastAct_'+personId) || (acts[0] && acts[0].id) || 'service'));
  React.useEffect(() => {
    if (!cur) { setElapsed(0); return; }
    setElapsed(Math.floor((Date.now() - cur.startTime) / 1000));
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - cur.startTime) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [cur && cur.startTime]);
  function fmt(s) { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60; return h>0?h+'h '+m+'m '+('0'+sc).slice(-2)+'s':m+'m '+('0'+sc).slice(-2)+'s'; }
  const person = ((family||[]).find(f => f.id === personId)) || {};
  function startAct(actId) {
    try { localStorage.setItem('_lastAct_'+personId, actId); } catch(e){}
    if (typeof clockInActivity === 'function') {
      clockInActivity(personId, sessions, onUpdate, actId);
      if (addNotif) addNotif('clock_in', personId, (person.name || '') + (cur ? ' switched to ' : ' clocked in: ') + getAct(actId).label, getAct(actId).label, {});
    }
  }
  function clockIn() { startAct(pickedAct); }
  function switchTo(actId) { setPickedAct(actId); if (cur && actId !== cur.activity) startAct(actId); }
  function clockOut() {
    if (!cur) return;
    if (typeof clockOutActivity === 'function') {
      clockOutActivity(personId, sessions, onUpdate);
    } else {
      const dur = (Date.now() - cur.startTime) / 60000;
      const entry = {...cur, endTime: Date.now(), duration: Math.round(dur*10)/10};
      const today = new Date().toISOString().split('T')[0];
      const updated = {...(sessions||{}), [personId]: {current:null, today:[...(data.today||[]), entry]}};
      if (onUpdate) onUpdate(updated);
      try { if (typeof syncSet==='function') syncSet('sessions/'+today+'/'+personId, {current:null, today:[...(data.today||[]), entry]}); } catch(e){}
    }
  }
  const others = (data.others || []).filter(Boolean);
  const [, setTick] = React.useState(0);
  const [addOpen, setAddOpen] = React.useState(false);
  React.useEffect(() => { if (!others.length) return; const iv = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(iv); }, [others.length]);
  function addTask(actId) {
    setAddOpen(false);
    if (typeof clockInActivity === 'function') {
      clockInActivity(personId, sessions, onUpdate, actId, { stack: true });
      if (addNotif) addNotif('clock_in', personId, (person.name || '') + ' also started: ' + getAct(actId).label, getAct(actId).label, {});
    }
  }
  function stopOne(actId) { if (typeof clockOutActivity === 'function') clockOutActivity(personId, sessions, onUpdate, actId); }
  function stopAll() { if (typeof clockOutAll === 'function') clockOutAll(personId, sessions, onUpdate); }
  const runningAll = [cur].concat(others).filter(Boolean);
  const curActMeta = cur ? getAct(cur.activity) : null;
  const doneMins = (data.today || []).reduce((n, e) => n + (e.duration || 0), 0) + runningAll.reduce((n, r) => n + (Date.now() - r.startTime) / 60000, 0);
  const totalLbl = doneMins >= 60 ? Math.floor(doneMins/60) + 'h ' + Math.round(doneMins%60) + 'm' : Math.round(doneMins) + 'm';
  const sel = (value, onChange) => React.createElement('select', {
    value: value, onChange: e => onChange(e.target.value),
    style: { fontSize:12, fontWeight:700, background:'rgba(255,255,255,.12)', color:'#fff', border:'1px solid rgba(255,255,255,.25)', borderRadius:10, padding:'7px 8px', maxWidth:170 }
  }, acts.map(a => React.createElement('option', { key:a.id, value:a.id, style:{color:'#000'} }, a.label)));
  const accent = cur ? ((curActMeta && curActMeta.color) || '#4CAF82') : '#888';
  return React.createElement('div', { style: { position:'sticky', top:0, zIndex:60, flexShrink:0, background:'#14122b', borderBottom:'2px solid ' + accent, boxShadow:'0 2px 10px rgba(0,0,0,.4)' } },
    React.createElement('div', { style: { display:'flex', alignItems:'center', padding:'8px 14px', gap:8, flexWrap:'wrap', minHeight:52, background: cur ? 'rgba(76,175,82,.12)' : 'rgba(255,255,255,.04)' } },
      React.createElement('div', { style: { fontSize:22 } }, person.emoji || '⏱'),
      React.createElement('div', { style: { flex:1, minWidth:120 } },
        cur
          ? React.createElement('div', null,
              React.createElement('div', { style: { fontSize:9, color:'rgba(255,255,255,.5)', fontWeight:800, letterSpacing:1 } }, (person.name || '').toUpperCase() + ' · CLOCKED IN'),
              React.createElement('div', { style: { fontSize:17, fontWeight:900, color:'#4CAF82', lineHeight:1.2 } }, fmt(elapsed)),
              React.createElement('div', { style: { fontSize:11, color:accent, fontWeight:700 } }, (curActMeta && curActMeta.label) || cur.activity))
          : React.createElement('div', null,
              React.createElement('div', { style: { fontSize:9, color:'rgba(255,255,255,.5)', fontWeight:800, letterSpacing:1 } }, (person.name || '').toUpperCase() + ' · NOT CLOCKED IN'),
              React.createElement('div', { style: { fontSize:12, color:'rgba(255,255,255,.7)' } }, 'Pick a task and clock in')),
        React.createElement('div', { style: { fontSize:9, color:'rgba(255,255,255,.4)' } }, 'Today total: ' + totalLbl)),
      cur
        ? React.createElement('div', { style: { display:'flex', flexDirection:'column', gap:5, alignItems:'stretch' } },
            sel(cur.activity, switchTo),
            React.createElement('button', { onClick:clockOut, style:{ fontSize:12, fontWeight:900, background:'#EF5350', color:'#fff', border:'none', borderRadius:20, padding:'7px 14px', cursor:'pointer' } }, '⏹ Clock Out'))
        : React.createElement('div', { style: { display:'flex', flexDirection:'column', gap:5, alignItems:'stretch' } },
            sel(pickedAct, setPickedAct),
            React.createElement('button', { onClick:clockIn, style:{ fontSize:12, fontWeight:900, background:'#4CAF82', color:'#000', border:'none', borderRadius:20, padding:'7px 14px', cursor:'pointer' } }, '▶ Clock In')),
      unreadCount > 0 && React.createElement('button', { onClick: () => onSwitchTab&&onSwitchTab('messages'), style: { background:'#1A73E8', color:'#fff', border:'none', borderRadius:20, padding:'4px 10px', fontSize:10, fontWeight:800, cursor:'pointer' } }, '💬 '+unreadCount),
      React.createElement(SyncDot, null)),
    cur && React.createElement('div', { style: { padding:'2px 14px 6px' } },
      runningAll.length > 1 && React.createElement('div', { style: { display:'flex', flexWrap:'wrap', gap:6, marginBottom:6 } },
        runningAll.map(r => { const m = getAct(r.activity); const sec = Math.floor((Date.now() - r.startTime)/1000); return React.createElement('div', { key:r.activity, style:{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,.08)', border:'1px solid '+((m&&m.color)||'#4CAF82'), borderRadius:20, padding:'3px 4px 3px 10px' } },
          React.createElement('span', { style:{ fontSize:11, color:'#fff', fontWeight:700 } }, ((m&&m.label)||r.activity) + ' · ' + fmt(sec)),
          React.createElement('button', { onClick:() => stopOne(r.activity), style:{ background:'#EF5350', color:'#fff', border:'none', borderRadius:'50%', width:20, height:20, fontSize:10, cursor:'pointer' } }, '⏹')); })),
      React.createElement('div', { style:{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' } },
        React.createElement('button', { onClick:() => setAddOpen(!addOpen), style:{ fontSize:11, fontWeight:800, background:'rgba(66,165,245,.2)', color:'#90CAF9', border:'1px solid rgba(66,165,245,.5)', borderRadius:20, padding:'5px 12px', cursor:'pointer' } }, '＋ Also clock in to another task'),
        runningAll.length > 1 && React.createElement('button', { onClick:stopAll, style:{ fontSize:11, fontWeight:800, background:'transparent', color:'#EF9A9A', border:'1px solid rgba(239,83,80,.5)', borderRadius:20, padding:'5px 12px', cursor:'pointer' } }, '⏹ Clock out of all')),
      addOpen && React.createElement('div', { style:{ display:'flex', flexWrap:'wrap', gap:5, marginTop:6 } },
        acts.filter(a => !runningAll.some(r => r.activity === a.id)).map(a => React.createElement('button', { key:a.id, onClick:() => addTask(a.id), style:{ fontSize:11, background:'rgba(255,255,255,.08)', color:'#fff', border:'1px solid rgba(255,255,255,.2)', borderRadius:20, padding:'5px 10px', cursor:'pointer' } }, a.label))),
      React.createElement('div', { style: { fontSize:9, color:'rgba(255,255,255,.4)', marginTop:4 } }, 'The dropdown switches tasks. "＋ Also clock in" runs tasks together — each one keeps its own time and pay.')),
    (typeof db === 'undefined' || !db) && React.createElement('div', { style: { background: 'rgba(239,83,80,.18)', color: '#FFAB91', fontSize: 10, fontWeight: 700, padding: '5px 14px', lineHeight: 1.4 } }, '⚠️ This device is NOT connected to family sync — PINs and check-offs stay on this device only. Admin: open Admin → Sync Setup, or open the device link on this device.'),
    React.createElement(WaterQuickBar, { personId: personId, onSwitchTab: onSwitchTab })
  );
}

function NotifBell({ count, onClick }) {
  return /*#__PURE__*/React.createElement('button', { onClick:onClick, style:{ background:'transparent', border:'none', color:count>0?'#F6BF26':'rgba(255,255,255,.4)', fontSize:20, cursor:'pointer', position:'relative', padding:'4px 8px' } },
    '🔔',
    count>0 && /*#__PURE__*/React.createElement('div', { style:{ position:'absolute', top:0, right:0, width:16, height:16, borderRadius:'50%', background:'#EF5350', color:'#fff', fontSize:8, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center' } }, count>9?'9+':count)
  );
}

function NotifPanel({ notifs, onClose, onApprove, onApproveTask, onMarkAllRead, onDelete, onDeleteMany, onToggleSave, onClearAll, isAdmin, currentPersonId }) {
  const [filt, setFilt] = React.useState('all');
  const [sel, setSel] = React.useState({});
  const [conf, setConf] = React.useState('');
  const all = (notifs||[]);
  const items = all.filter(n => filt === 'saved' ? n.saved : filt === 'todo' ? (n.requiresApproval && n.approved == null) : true).slice(0,100);
  const selIds = Object.keys(sel).filter(k => sel[k]);
  const sbtn = (bg, fg, fn, t) => React.createElement('button', { onClick: fn, style:{ background:bg, color:fg, border:'none', borderRadius:18, padding:'10px 14px', fontWeight:800, fontSize:13, cursor:'pointer' } }, t);
  function handleTaskDecision(n, ok) {
    if (ok && n.routineCredit && typeof approveRoutineNotif === 'function') approveRoutineNotif(n);
    if (onApproveTask && n.taskId) onApproveTask(n.taskId, ok, '');
    if (onApprove) onApprove(n.id, ok, '');
  }
  function handleSopDecision(n, ok) {
    if (ok) approveSopInspectionNotif(n);
    if (onApprove) onApprove(n.id, ok, ok ? '' : 'Needs redo');
  }
  return /*#__PURE__*/React.createElement('div', { style:{ padding:'10px 4px' } },
    /*#__PURE__*/React.createElement('div', { style:{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 10px 8px' } },
      /*#__PURE__*/React.createElement('div', { style:{ fontSize:13, fontWeight:900, color:'#fff' } }, '🔔 Notifications'),
      /*#__PURE__*/React.createElement('div', { style:{ display:'flex', gap:8 } },
        onMarkAllRead && /*#__PURE__*/React.createElement('button', { onClick:onMarkAllRead, style:{ fontSize:12, background:'rgba(255,255,255,.12)', color:'#ddd', border:'none', borderRadius:20, padding:'9px 12px', cursor:'pointer' } }, 'Mark all read'),
        onClose && /*#__PURE__*/React.createElement('button', { onClick:onClose, style:{ fontSize:12, background:'rgba(255,255,255,.12)', color:'#ddd', border:'none', borderRadius:20, padding:'9px 12px', cursor:'pointer' } }, 'Close')
      )
    ),
    /*#__PURE__*/React.createElement('div', { style:{ display:'flex', gap:6, flexWrap:'wrap', padding:'0 10px 8px', alignItems:'center' } },
      [['all','All ('+all.length+')'],['todo','Needs a decision'],['saved','⭐ Saved ('+all.filter(n=>n.saved).length+')']].map(f => React.createElement('button', { key:f[0], onClick:()=>{ setFilt(f[0]); setSel({}); }, style:{ padding:'8px 12px', borderRadius:18, border:'2px solid '+(filt===f[0]?'#FFD54F':'rgba(255,255,255,.2)'), background: filt===f[0]?'rgba(255,213,79,.18)':'transparent', color:'#fff', fontWeight:800, fontSize:12, cursor:'pointer' } }, f[1]))
    ),
    onDeleteMany && /*#__PURE__*/React.createElement('div', { style:{ display:'flex', gap:6, flexWrap:'wrap', padding:'0 10px 10px', alignItems:'center' } },
      sbtn('rgba(255,255,255,.12)', '#fff', ()=>{ const o={}; items.forEach(n=>{ o[n.id]=true; }); setSel(o); }, '☑ Select all'),
      selIds.length>0 && sbtn('#EF5350', '#fff', ()=>{ if (conf==='sel') { onDeleteMany(selIds.filter(id => { const n=all.find(x=>x.id===id); return n && !n.saved; })); setSel({}); setConf(''); } else setConf('sel'); }, conf==='sel' ? 'Tap again: delete '+selIds.length : '🗑 Delete '+selIds.length+' selected'),
      selIds.length>0 && sbtn('#FFD54F', '#000', ()=>{ selIds.forEach(id => { const n=all.find(x=>x.id===id); if (n && !n.saved && onToggleSave) onToggleSave(id); }); setSel({}); }, '⭐ Save selected'),
      onClearAll && sbtn('rgba(239,83,80,.25)', '#FF8A80', ()=>{ if (conf==='all') { onClearAll(); setConf(''); setSel({}); } else setConf('all'); }, conf==='all' ? 'Tap again: clear all unsaved' : '🧹 Clear all (keeps ⭐ saved & pending)')
    ),
    isAdmin && items.filter(n => n.routineCredit && n.approved === null).length >= 2 && /*#__PURE__*/React.createElement('div',{style:{padding:'0 10px 8px'}},
      /*#__PURE__*/React.createElement('button',{onClick:()=>{ items.filter(n => n.routineCredit && n.approved === null).forEach(n => handleTaskDecision(n, true)); },style:{width:'100%',background:'#4CAF82',color:'#000',border:'none',borderRadius:20,padding:'9px',fontWeight:900,fontSize:12,cursor:'pointer'}},'✅ Approve all ('+items.filter(n => n.routineCredit && n.approved === null).length+') routine check-offs')),
    items.length === 0 && /*#__PURE__*/React.createElement('div',{style:{padding:20,textAlign:'center',color:'rgba(255,255,255,.3)',fontSize:11}},'No notifications'),
    /*#__PURE__*/React.createElement('div',{style:{maxHeight:520,overflowY:'auto'}},
      items.map(n => {
        const needsTaskApproval = isAdmin && n.requiresApproval && n.approved === null && n.type !== 'sop_inspection';
        const needsSopApproval = isAdmin && n.type === 'sop_inspection' && n.approved === null;
        return /*#__PURE__*/React.createElement('div',{key:n.id||Math.random(),style:{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,.05)',background: (needsTaskApproval||needsSopApproval) ? 'rgba(246,191,38,.06)' : (n.saved ? 'rgba(255,213,79,.07)' : 'transparent')}},
          onDeleteMany && /*#__PURE__*/React.createElement('label',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:4,fontSize:12,color:'#aaa'}},/*#__PURE__*/React.createElement('input',{type:'checkbox',checked:!!sel[n.id],onChange:e=>{ const v=e.target.checked; setSel(o=>Object.assign({},o,{[n.id]:v})); },style:{width:22,height:22}}),n.saved?'⭐ Saved':'Select'),
          /*#__PURE__*/React.createElement('div',{style:{fontSize:11,color:'#fff',marginBottom:3,fontWeight: (needsTaskApproval||needsSopApproval) ? 800 : 400}},n.title||n.message||'Notification'),
          n.title && n.message && /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'rgba(255,255,255,.5)',marginBottom:3}},n.message),
          /*#__PURE__*/React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.35)',marginBottom: (needsTaskApproval||needsSopApproval) ? 8 : 0}},new Date(n.timestamp||Date.now()).toLocaleString()),
          needsTaskApproval && /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8}},
            /*#__PURE__*/React.createElement('button',{onClick:()=>handleTaskDecision(n,true),style:{flex:1,background:'#4CAF82',color:'#000',border:'none',borderRadius:20,padding:'7px',fontSize:10,fontWeight:900,cursor:'pointer'}},'✅ Approve & Pay'),
            /*#__PURE__*/React.createElement('button',{onClick:()=>handleTaskDecision(n,false),style:{flex:1,background:'rgba(239,83,80,.15)',color:'#EF5350',border:'1px solid rgba(239,83,80,.3)',borderRadius:20,padding:'7px',fontSize:10,fontWeight:800,cursor:'pointer'}},'↩︎ Send Back')
          ),
          needsSopApproval && /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8}},
            /*#__PURE__*/React.createElement('button',{onClick:()=>handleSopDecision(n,true),style:{flex:1,background:'#4CAF82',color:'#000',border:'none',borderRadius:20,padding:'7px',fontSize:10,fontWeight:900,cursor:'pointer'}},'✅ Approve & Award Points'),
            /*#__PURE__*/React.createElement('button',{onClick:()=>handleSopDecision(n,false),style:{flex:1,background:'rgba(239,83,80,.15)',color:'#EF5350',border:'1px solid rgba(239,83,80,.3)',borderRadius:20,padding:'7px',fontSize:10,fontWeight:800,cursor:'pointer'}},'↩︎ Send Back')
          ),
          n.approved === true && /*#__PURE__*/React.createElement('div',{style:{fontSize:9,color:'#4CAF82',fontWeight:800}},'✓ Approved'),
          n.approved === false && /*#__PURE__*/React.createElement('div',{style:{fontSize:9,color:'#EF5350',fontWeight:800}},'✗ Sent back'),
          /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8,marginTop:8}},
            (n.fromId || n.personId) && (n.fromId || n.personId) !== 'all' && (n.fromId || n.personId) !== currentPersonId && window._msgTo && /*#__PURE__*/React.createElement('button',{onClick:()=>window._msgTo(n.fromId || n.personId),style:{fontSize:13,fontWeight:800,background:'#1A73E8',color:'#fff',border:'none',borderRadius:16,padding:'9px 14px',cursor:'pointer'}},'💬 Reply'),
            onToggleSave && /*#__PURE__*/React.createElement('button',{onClick:()=>onToggleSave(n.id),style:{fontSize:13,fontWeight:800,background:n.saved?'#FFD54F':'rgba(255,213,79,.15)',color:n.saved?'#000':'#FFD54F',border:'none',borderRadius:16,padding:'9px 14px',cursor:'pointer'}},n.saved?'⭐ Saved':'☆ Save'),
            onDelete && !n.saved && /*#__PURE__*/React.createElement('button',{onClick:()=>onDelete(n.id),style:{fontSize:13,fontWeight:800,background:'rgba(239,83,80,.2)',color:'#FF8A80',border:'none',borderRadius:16,padding:'9px 14px',cursor:'pointer'}},'🗑 Delete'))
        );
      })
    )
  );
}

// Read-only "what's waiting for inspection right now" feed — everyone can see it,
// but nobody can check boxes or approve from here. Approving happens via the
// 🔔 notification bell or (for admins) the SOP inspector on the Admin tab.
function PendingInspectionsFeed({ notifs, family, isAdmin }) {
  const items = (notifs||[]).filter(n => (n.type === 'sop_inspection' || n.type === 'bethel_inspection' || n.type === 'approval') && n.approved === null);
  if (items.length === 0) return null;
  const fam = family || DEFAULT_FAMILY;
  const nameFor = pid => (fam.find(p=>p.id===pid)||{}).name || pid;
  return /*#__PURE__*/React.createElement('div', { style:{ background:'rgba(246,191,38,.06)', border:'1px solid rgba(246,191,38,.25)', borderRadius:12, padding:'10px 12px' } },
    /*#__PURE__*/React.createElement('div', { style:{ fontSize:10, fontWeight:800, color:'#F6BF26', marginBottom:6 } }, '👀 WAITING FOR INSPECTION (' + items.length + ')'),
    items.slice(0,10).map(n => /*#__PURE__*/React.createElement('div', { key:n.id, style:{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,.05)' } },
      /*#__PURE__*/React.createElement('div', { style:{ flex:1, fontSize:10, color:'#ddd' } }, nameFor(n.personId) + ' — ' + (n.sopTitle || n.title || 'Task')),
      /*#__PURE__*/React.createElement('div', { style:{ fontSize:8, color:'rgba(255,255,255,.35)' } }, new Date(n.timestamp||Date.now()).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}))
    )),
    isAdmin && /*#__PURE__*/React.createElement('div', { style:{ fontSize:8, color:'rgba(255,255,255,.35)', marginTop:8 } }, 'Tap 🔔 above to approve — or use SOP Inspection on the Admin tab.')
  );
}

function SHead({ children, style }) { return /*#__PURE__*/React.createElement('div',{style:{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.35)',letterSpacing:2,padding:'8px 0 4px',...style}},children); }

function LiveTimer({ startTime, color }) {
  const [s, setS] = React.useState(0);
  React.useEffect(() => { const iv = setInterval(()=>setS(Math.floor((Date.now()-startTime)/1000)),1000); return ()=>clearInterval(iv); }, [startTime]);
  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;
  return /*#__PURE__*/React.createElement('span',{style:{color:color||'#4CAF82',fontWeight:800}}, h>0?h+'h '+m+'m':m+'m '+('0'+sc).slice(-2)+'s');
}

// ─── Health Tracker — meals, snacks, meds, hydration, BG, with photo logging ──
const HEALTH_LOG_TYPES = [
  { id:'meal',   l:'🍽️ Meal',      color:'#F09300', fields:['carbs','photo','note'] },
  { id:'snack',  l:'🍪 Snack',     color:'#FF9800', fields:['carbs','photo','note'] },
  { id:'water',  l:'💧 Hydration', color:'#0369a1', fields:['amount','note'] },
  { id:'med',    l:'💊 Medication',color:'#9C27B0', fields:['medName','dose','note'] },
  { id:'insulin',l:'💉 Insulin',   color:'#26A69A', fields:['dose','site','note'] },
  { id:'bg',     l:'🩸 Blood Sugar',color:'#EF5350', fields:['bgValue','note'] },
  { id:'exercise', l:'🏃 Exercise', color:'#26A69A', fields:['note'] },
];
function getHealthTypeMeta(id){ return HEALTH_LOG_TYPES.find(t=>t.id===id) || HEALTH_LOG_TYPES[0]; }

function HealthTracker({ personId, family, isAdmin, sessions, onUpdate }) {
  const fam = family || DEFAULT_FAMILY;
  const [targetId, setTargetId] = React.useState(personId);
  const dateStr = new Date().toISOString().split('T')[0];
  const storeKey = 'health_log_' + targetId;
  const [entries, setEntries] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(storeKey) || '[]'); } catch { return []; }
  });
  const [type, setType] = React.useState(() => { const t = window._healthStartType || 'meal'; window._healthStartType = null; return t; });
  const [form, setForm] = React.useState({});
  const [photoData, setPhotoData] = React.useState(null);
  const fileRef = React.useRef(null);
  const [filter, setFilter] = React.useState('all');

  // ── Exercise timer / clock in-out ──────────────────────────────────────────
  const exKey = 'exercise_current_' + targetId;
  const [exCurrent, setExCurrent] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(exKey) || 'null'); } catch { return null; }
  });
  const [exType, setExType] = React.useState('Walk/Run');
  const [exNow, setExNow] = React.useState(Date.now());
  React.useEffect(() => {
    if (!exCurrent) return;
    const iv = setInterval(() => setExNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [exCurrent]);
  function exFmt(sec) {
    const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
    return (h>0?h+'h ':'') + m + 'm ' + String(s).padStart(2,'0') + 's';
  }
  function exStart() {
    const rec = { activity: exType, startTime: Date.now() };
    setExCurrent(rec);
    try { localStorage.setItem(exKey, JSON.stringify(rec)); } catch {}
    if (typeof clockInActivity === 'function' && sessions && onUpdate) clockInActivity(targetId, sessions, onUpdate, 'exercise');
  }
  function exStop() {
    if (!exCurrent) return;
    const durMin = Math.round(((Date.now() - exCurrent.startTime)/60000)*10)/10;
    const id = 'hl_' + Date.now();
    const entry = { id, type:'exercise', ts: Date.now(), loggedBy: window._currentPersonId || personId, exerciseType: exCurrent.activity, duration: durMin, note: form.exNote || '' };
    const next = [entry, ...entries];
    setEntries(next);
    try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch {}
    syncSet('health_log/' + targetId + '/' + id, entry);
    setExCurrent(null);
    try { localStorage.removeItem(exKey); } catch {}
    if (typeof clockOutActivity === 'function' && sessions && onUpdate) clockOutActivity(targetId, sessions, onUpdate);
    if (typeof playSound === 'function') playSound('clockOut');
  }

  React.useEffect(() => {
    const unsub = syncOn('health_log/' + targetId, d => {
      if (d) { const arr = Object.values(d).sort((a,b)=>b.ts-a.ts); setEntries(arr); try{localStorage.setItem('health_log_'+targetId, JSON.stringify(arr));}catch{} }
    });
    return () => { if (unsub) unsub(); };
  }, [targetId]);

  function handlePhoto(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (typeof ntResizeImage === 'function') ntResizeImage(file, 900, d => setPhotoData(d));
    else { const reader = new FileReader(); reader.onload = ev => setPhotoData(ev.target.result); reader.readAsDataURL(file); }
  }

  function logInsulinFromMeal(units, note) {
    const id = 'hl_' + Date.now() + 'i';
    const entry = { id, type:'insulin', ts: Date.now(), loggedBy: window._currentPersonId || personId, dose: units + ' u', note };
    const next = [entry, ...entries];
    setEntries(next);
    try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch {}
    syncSet('health_log/' + targetId + '/' + id, entry);
  }

  function logEntry() {
    const meta = getHealthTypeMeta(type);
    const id = 'hl_' + Date.now();
    const entry = {
      id, type, ts: Date.now(),
      loggedBy: window._currentPersonId || personId,
      photo: photoData || null,
      ...form
    };
    const next = [entry, ...entries];
    setEntries(next);
    try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch {}
    syncSet('health_log/' + targetId + '/' + id, entry);
    setForm({});
    setPhotoData(null);
    if (fileRef.current) fileRef.current.value = '';
    playSound && playSound('claim');
  }

  function deleteEntry(id) {
    if (!window._safeConfirm('Delete this log entry?')) return;
    const next = entries.filter(e => e.id !== id);
    setEntries(next);
    try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch {}
    syncSet('health_log/' + targetId + '/' + id, null);
  }

  const meta = getHealthTypeMeta(type);
  const iStyle = { flex:1, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, padding:'8px 10px', color:'#fff', fontSize:13 };
  const todayEntries = entries.filter(e => new Date(e.ts).toISOString().split('T')[0] === dateStr);
  const visible = filter === 'all' ? entries : entries.filter(e => e.type === filter);
  const targetPerson = fam.find(p=>p.id===targetId) || {};

  return /*#__PURE__*/React.createElement('div', { style:{ paddingBottom: 40 } },
    /*#__PURE__*/React.createElement('div', { style:{ padding:'12px 14px 8px', background:'rgba(0,0,0,.2)', borderBottom:'1px solid rgba(255,255,255,.06)' } },
      /*#__PURE__*/React.createElement('div', { style:{ fontSize:14, fontWeight:900, color:'#fff', marginBottom:1 } }, '🩺 Health Tracker'),
      /*#__PURE__*/React.createElement('div', { style:{ fontSize:9, color:'rgba(255,255,255,.3)' } }, 'Meals · snacks · hydration · meds · insulin · blood sugar — with photo logging')
    ),
    isAdmin && /*#__PURE__*/React.createElement('div', { style:{ display:'flex', gap:5, overflowX:'auto', padding:'8px 12px', borderBottom:'1px solid rgba(255,255,255,.04)' } },
      fam.filter(p=>p.role!=='elder'&&!p.deleted).map(p => /*#__PURE__*/React.createElement('button', {
        key:p.id, onClick:()=>setTargetId(p.id),
        style:{ flexShrink:0, display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:20,
          background: targetId===p.id ? p.color : 'rgba(255,255,255,.07)', border:'1px solid '+(targetId===p.id?p.color:'rgba(255,255,255,.08)'), color: targetId===p.id?'#fff':'#666' }
      }, /*#__PURE__*/React.createElement('span',{style:{fontSize:13}},p.emoji), /*#__PURE__*/React.createElement('span',{style:{fontSize:9,fontWeight:700}},p.name))
      )
    ),
    typeof TodayNutrition==='function' && /*#__PURE__*/React.createElement(TodayNutrition,{personId:targetId, entries}),
    isAdmin && typeof HealthSettingsPanel==='function' && /*#__PURE__*/React.createElement(HealthSettingsPanel,{personId:targetId, name:targetPerson.name}),
    /*#__PURE__*/React.createElement('div', { style:{ margin:'0 14px 12px', background: exCurrent ? 'rgba(76,175,82,.1)' : 'rgba(38,166,154,.08)', border:'1px solid '+(exCurrent?'rgba(76,175,82,.35)':'rgba(38,166,154,.25)'), borderRadius:12, padding:12 } },
      /*#__PURE__*/React.createElement('div', { style:{ fontSize:10, fontWeight:800, color: exCurrent?'#4CAF82':'#26A69A', marginBottom:8 } }, '🏃 Exercise Timer'),
      exCurrent
        ? /*#__PURE__*/React.createElement('div', null,
            /*#__PURE__*/React.createElement('div', { style:{ fontSize:24, fontWeight:900, color:'#4CAF82', textAlign:'center', marginBottom:4 } }, exFmt(Math.floor((exNow-exCurrent.startTime)/1000))),
            /*#__PURE__*/React.createElement('div', { style:{ fontSize:10, color:'rgba(255,255,255,.4)', textAlign:'center', marginBottom:10 } }, exCurrent.activity + ' — started ' + new Date(exCurrent.startTime).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})),
            /*#__PURE__*/React.createElement('button', { onClick:exStop, style:{ width:'100%', background:'#EF5350', color:'#fff', border:'none', borderRadius:20, padding:11, fontWeight:900, fontSize:12, cursor:'pointer' } }, '⏹ Clock Out & Log Exercise')
          )
        : /*#__PURE__*/React.createElement('div', null,
            /*#__PURE__*/React.createElement('div', { style:{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 } },
              ['Walk/Run','Bike','Swim','Strength','Sports','Stretch/Yoga','Other'].map(t => /*#__PURE__*/React.createElement('button', {
                key:t, onClick:()=>setExType(t),
                style:{ padding:'5px 10px', borderRadius:20, fontSize:9, fontWeight:700, cursor:'pointer',
                  border:'1px solid '+(exType===t?'#26A69A':'rgba(255,255,255,.1)'),
                  background: exType===t ? 'rgba(38,166,154,.2)' : 'rgba(255,255,255,.04)',
                  color: exType===t ? '#26A69A' : 'rgba(255,255,255,.4)' }
              }, t))
            ),
            /*#__PURE__*/React.createElement('button', { onClick:exStart, style:{ width:'100%', background:'#26A69A', color:'#000', border:'none', borderRadius:20, padding:11, fontWeight:900, fontSize:12, cursor:'pointer' } }, '▶ Clock In — Start ' + exType)
          )
    ),
    /*#__PURE__*/React.createElement('div', { style:{ padding:'0 14px 10px' } },
      /*#__PURE__*/React.createElement('div', { style:{ fontSize:9, color:'rgba(255,255,255,.4)', fontWeight:800, letterSpacing:1, marginBottom:6 } }, 'LOG NEW ENTRY FOR ' + (targetPerson.name || 'ME').toUpperCase()),
      /*#__PURE__*/React.createElement('div', { style:{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 } },
        HEALTH_LOG_TYPES.map(t => /*#__PURE__*/React.createElement('button', {
          key:t.id, onClick:()=>{ setType(t.id); setForm({}); },
          style:{ padding:'6px 10px', borderRadius:20, fontSize:10, fontWeight:800, cursor:'pointer',
            border:'1px solid '+(type===t.id?t.color:'rgba(255,255,255,.1)'),
            background: type===t.id ? t.color+'22' : 'rgba(255,255,255,.04)',
            color: type===t.id ? t.color : 'rgba(255,255,255,.4)' }
        }, t.l))
      ),
      /*#__PURE__*/React.createElement('div', { style:{ background: meta.color+'0c', border:'1px solid '+meta.color+'33', borderRadius:12, padding:12 } },
        (type==='meal'||type==='snack') && typeof NutritionMealBuilder==='function' && /*#__PURE__*/React.createElement(NutritionMealBuilder,{key:targetId+type, targetId, entries, isAdmin, showInsulin:true, onApply:(t)=>setForm(f=>({...f,carbs:t.carbs,protein:t.protein,fat:t.fat,cal:t.cal,fiber:t.fiber,note:(f.note?f.note+' · ':'')+t.foods.join(', ')})), onLogInsulin:logInsulinFromMeal}),
        meta.fields.includes('carbs') && /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8,marginBottom:8}},
          /*#__PURE__*/React.createElement('input',{type:'number', inputMode:'numeric', placeholder:'Carbs (g)', value:form.carbs||'', onChange:e=>setForm({...form,carbs:e.target.value}), style:iStyle})
        ),
        meta.fields.includes('amount') && /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8,marginBottom:8}},
          /*#__PURE__*/React.createElement('input',{type:'number', inputMode:'numeric', placeholder:'Amount (oz)', value:form.amount||'', onChange:e=>setForm({...form,amount:e.target.value}), style:iStyle})
        ),
        meta.fields.includes('medName') && /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8,marginBottom:8}},
          /*#__PURE__*/React.createElement('input',{type:'text', placeholder:'Medication name', value:form.medName||'', onChange:e=>setForm({...form,medName:e.target.value}), style:iStyle}),
          /*#__PURE__*/React.createElement('input',{type:'text', placeholder:'Dose (e.g. 5mg)', value:form.dose||'', onChange:e=>setForm({...form,dose:e.target.value}), style:{...iStyle,flex:0.7}})
        ),
        meta.fields.includes('dose') && type==='insulin' && /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8,marginBottom:8}},
          /*#__PURE__*/React.createElement('input',{type:'text', placeholder:'Units given (e.g. 10u)', value:form.dose||'', onChange:e=>setForm({...form,dose:e.target.value}), style:iStyle}),
          /*#__PURE__*/React.createElement('input',{type:'text', placeholder:'Site (e.g. thigh)', value:form.site||'', onChange:e=>setForm({...form,site:e.target.value}), style:{...iStyle,flex:0.7}})
        ),
        meta.fields.includes('bgValue') && /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8,marginBottom:8}},
          /*#__PURE__*/React.createElement('input',{type:'number', inputMode:'numeric', placeholder:'Blood sugar (mg/dL)', value:form.bgValue||'', onChange:e=>setForm({...form,bgValue:e.target.value}), style:iStyle})
        ),
        /*#__PURE__*/React.createElement('input',{type:'text', placeholder:'Note (optional — what, how it looked, how they felt...)', value:form.note||'', onChange:e=>setForm({...form,note:e.target.value}), autoCorrect:'on', style:{...iStyle,width:'100%',marginBottom:8,boxSizing:'border-box'}}),
        meta.fields.includes('photo') && /*#__PURE__*/React.createElement('div',{style:{marginBottom:8}},
          /*#__PURE__*/React.createElement('input',{ref:fileRef, type:'file', accept:'image/*', style:{display:'none'}, onChange:handlePhoto}),
          !photoData
            ? /*#__PURE__*/React.createElement('button',{onClick:()=>fileRef.current&&fileRef.current.click(), style:{display:'flex',alignItems:'center',gap:6,padding:'8px 12px',background:'rgba(26,115,232,.1)',border:'1px solid rgba(26,115,232,.25)',borderRadius:20,color:'#1A73E8',fontSize:10,fontWeight:700,cursor:'pointer'}}, '📷 Take / Add Photo')
            : /*#__PURE__*/React.createElement('div',{style:{position:'relative',display:'inline-block'}},
                /*#__PURE__*/React.createElement('img',{src:photoData, style:{width:70,height:70,borderRadius:10,objectFit:'cover',border:'2px solid '+meta.color}}),
                /*#__PURE__*/React.createElement('button',{onClick:()=>{setPhotoData(null); if(fileRef.current) fileRef.current.value='';}, style:{position:'absolute',top:-6,right:-6,width:20,height:20,borderRadius:'50%',background:'rgba(239,83,80,.9)',color:'#fff',border:'none',fontSize:11,cursor:'pointer'}},'×')
              )
        ),
        /*#__PURE__*/React.createElement('button',{onClick:logEntry, style:{width:'100%',background:meta.color,color:'#000',border:'none',borderRadius:20,padding:11,fontWeight:900,fontSize:12,cursor:'pointer'}}, '✅ Log ' + meta.l.replace(/[^\w ]/g,'').trim())
      ),
      type==='insulin' && /*#__PURE__*/React.createElement('div', {style:{fontSize:8,color:'rgba(255,255,255,.3)',marginTop:6,lineHeight:1.6}}, 'This logs what was given. To see the dose math, log a meal and use the Insulin Helper (a parent turns it on in Health settings).')
    ),
    /*#__PURE__*/React.createElement('div', { style:{ padding:'0 14px 8px', display:'flex', alignItems:'center', gap:8 } },
      /*#__PURE__*/React.createElement('div', { style:{ fontSize:9, color:'rgba(255,255,255,.4)', fontWeight:800, letterSpacing:1, flex:1 } }, "TODAY'S LOG (" + todayEntries.length + ')'),
      /*#__PURE__*/React.createElement('select', { value:filter, onChange:e=>setFilter(e.target.value), style:{fontSize:9,background:'rgba(255,255,255,.07)',color:'#fff',border:'1px solid rgba(255,255,255,.12)',borderRadius:8,padding:'4px 6px'} },
        /*#__PURE__*/React.createElement('option',{value:'all',style:{color:'#000'}},'All types'),
        HEALTH_LOG_TYPES.map(t=>/*#__PURE__*/React.createElement('option',{key:t.id,value:t.id,style:{color:'#000'}},t.l))
      )
    ),
    /*#__PURE__*/React.createElement('div', { style:{ padding:'0 14px' } },
      visible.length===0 && /*#__PURE__*/React.createElement('div',{style:{textAlign:'center',padding:20,color:'rgba(255,255,255,.3)',fontSize:11}}, 'No entries logged yet.'),
      visible.slice(0,60).map(e => {
        const m = getHealthTypeMeta(e.type);
        const loggerName = (fam.find(p=>p.id===e.loggedBy)||{}).name || e.loggedBy;
        return /*#__PURE__*/React.createElement('div', { key:e.id, style:{ display:'flex', gap:10, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,.05)' } },
          e.photo
            ? /*#__PURE__*/React.createElement('img',{src:e.photo, style:{width:52,height:52,borderRadius:10,objectFit:'cover',flexShrink:0,border:'1px solid '+m.color+'55'}})
            : /*#__PURE__*/React.createElement('div',{style:{width:52,height:52,borderRadius:10,flexShrink:0,background:m.color+'18',border:'1px solid '+m.color+'33',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}, m.l.split(' ')[0]),
          /*#__PURE__*/React.createElement('div',{style:{flex:1,minWidth:0}},
            /*#__PURE__*/React.createElement('div',{style:{fontSize:11,fontWeight:800,color:m.color}}, m.l.replace(/^\S+\s/,'')),
            e.carbs && /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#ccc'}}, e.carbs+'g carbs'+(e.protein?' · '+e.protein+'g protein':'')+(e.fat?' · '+e.fat+'g fat':'')+(e.cal?' · '+e.cal+' cal':'')),
            e.amount && /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#ccc'}}, e.amount+' oz'),
            e.medName && /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#ccc'}}, e.medName+(e.dose?' — '+e.dose:'')),
            e.type==='insulin' && e.dose && /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#ccc'}}, e.dose+(e.site?' — '+e.site:'')),
            e.bgValue && /*#__PURE__*/React.createElement('div',{style:{fontSize:14,fontWeight:900,color: parseInt(e.bgValue)>180||parseInt(e.bgValue)<70 ? '#EF5350' : '#4CAF82'}}, e.bgValue+' mg/dL'),
            e.type==='exercise' && /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#ccc'}}, e.exerciseType+' — '+e.duration+' min'),
            e.note && /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'rgba(255,255,255,.5)',marginTop:2}}, e.note),
            /*#__PURE__*/React.createElement('div',{style:{fontSize:8,color:'rgba(255,255,255,.25)',marginTop:3}}, loggerName + ' · ' + new Date(e.ts).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}))
          ),
          /*#__PURE__*/React.createElement('button',{onClick:()=>deleteEntry(e.id), style:{background:'transparent',border:'none',color:'rgba(239,83,80,.35)',fontSize:14,cursor:'pointer',alignSelf:'flex-start'}}, '×')
        );
      })
    )
  );
}

function TodaySummary({ personId, sessions }) {
  const data = ((sessions||{})[personId])||{};
  const today = data.today||[];
  if (!today.length) return /*#__PURE__*/React.createElement('div',{style:{padding:12,color:'rgba(255,255,255,.3)',fontSize:11,textAlign:'center'}},'No sessions yet today.');
  return /*#__PURE__*/React.createElement('div',{style:{padding:'8px 0'}},
    today.map((s,i)=>/*#__PURE__*/React.createElement('div',{key:i,style:{padding:'6px 12px',marginBottom:4,background:'rgba(255,255,255,.04)',borderRadius:8,display:'flex',gap:10}},
      /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#fff',flex:1}},s.activity||'Work'),
      /*#__PURE__*/React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.4)'}},Math.round(s.duration||0)+'m')
    ))
  );
}

function ClockPanel({ personId, role, sessions, onUpdate, family, isAdmin }) {
  const data = ((sessions||{})[personId])||{};
  const cur = data.current;
  const acts = (typeof CLOCK_ACTS !== 'undefined' ? CLOCK_ACTS : []);
  const [pickedAct, setPickedAct] = React.useState(() => (localStorage.getItem('_lastAct_'+personId) || (acts[0] && acts[0].id) || 'service'));
  function clockIn() {
    try { localStorage.setItem('_lastAct_'+personId, pickedAct); } catch(e){}
    if (typeof clockInActivity === 'function') clockInActivity(personId, sessions, onUpdate, pickedAct);
  }
  function clockOut() {
    if (typeof clockOutActivity === 'function') clockOutActivity(personId, sessions, onUpdate);
  }
  const curActMeta = cur ? getAct(cur.activity) : null;
  return /*#__PURE__*/React.createElement('div',{style:{padding:14}},
    /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8,alignItems:'center',marginBottom:12,flexWrap:'wrap'}},
      cur
        ? /*#__PURE__*/React.createElement(React.Fragment, null,
            /*#__PURE__*/React.createElement('div',{style:{fontSize:11,color:(curActMeta&&curActMeta.color)||'#4CAF82',fontWeight:800}}, 'On: '+((curActMeta&&curActMeta.label)||cur.activity)),
            /*#__PURE__*/React.createElement('button',{onClick:clockOut,style:{fontSize:10,fontWeight:800,background:'rgba(239,83,80,.2)',color:'#EF5350',border:'1px solid rgba(239,83,80,.3)',borderRadius:20,padding:'6px 12px',cursor:'pointer'}},'⏹ Clock Out')
          )
        : /*#__PURE__*/React.createElement(React.Fragment, null,
            /*#__PURE__*/React.createElement('select',{
              value:pickedAct, onChange:e=>setPickedAct(e.target.value),
              style:{fontSize:11,background:'rgba(255,255,255,.08)',color:'#fff',border:'1px solid rgba(255,255,255,.15)',borderRadius:8,padding:'6px 8px'}
            }, acts.map(a=>/*#__PURE__*/React.createElement('option',{key:a.id,value:a.id,style:{color:'#000'}},a.label))),
            /*#__PURE__*/React.createElement('button',{onClick:clockIn,style:{fontSize:10,fontWeight:800,background:'rgba(76,175,82,.2)',color:'#4CAF82',border:'1px solid rgba(76,175,82,.3)',borderRadius:20,padding:'6px 12px',cursor:'pointer'}},'▶ Clock In')
          )
    ),
    /*#__PURE__*/React.createElement(TodaySummary,{personId,sessions})
  );
}

function FamilyActivityPanel({ sessions, family }) {
  return /*#__PURE__*/React.createElement('div',{style:{padding:14,color:'rgba(255,255,255,.4)',fontSize:11,textAlign:'center'}},'Family activity');
}

function QuickClockFAB({ personId, sessions, onUpdate }) { return null; }
function ChecklistWidget({ personId, isAdmin }) { return null; }

function FinancialDashboard({ personId, wallet, payMode, sessions, isAdmin, fin, credit, approveCredit, deduct }) {
  const w = wallet||{balance:0,pending:0};
  return /*#__PURE__*/React.createElement('div',{style:{padding:14}},
    /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:12}},
      [['Balance','$'+(w.balance||0).toFixed(2),'#4CAF82'],['Pending','$'+(w.pending||0).toFixed(2),'#F6BF26']].map(([l,v,c])=>
        /*#__PURE__*/React.createElement('div',{key:l,style:{flex:1,background:'rgba(255,255,255,.05)',borderRadius:10,padding:'12px 10px',textAlign:'center'}},
          /*#__PURE__*/React.createElement('div',{style:{fontSize:20,fontWeight:900,color:c}},v),
          /*#__PURE__*/React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.4)',marginTop:2}},l)
        )
      )
    )
  );
}


function SyncSetupPanel() {
  const [txt, setTxt] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [link, setLink] = React.useState('');
  const connected = !(typeof db === 'undefined' || !db);
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem('fb_cfg') || 'null'); } catch (e) {}
  function parseCfg(t) {
    const a = t.indexOf('{'), b = t.lastIndexOf('}');
    if (a < 0 || b < a) throw new Error('Paste the whole firebaseConfig block (the part with apiKey, projectId…).');
    let o = t.slice(a, b + 1)
      .replace(/\/\/.*$/gm, '')
      .replace(/([{,]\s*)([A-Za-z_]\w*)\s*:/g, '$1"$2":')
      .replace(/'([^']*)'/g, '"$1"')
      .replace(/,\s*}/g, '}');
    const cfg = JSON.parse(o);
    if (!cfg.apiKey || !cfg.projectId) throw new Error('Missing apiKey or projectId.');
    if (!cfg.databaseURL) cfg.databaseURL = 'https://' + cfg.projectId + '-default-rtdb.firebaseio.com';
    return cfg;
  }
  function makeLink(cfg) {
    return location.origin + location.pathname + '#fb=' + encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(cfg)))));
  }
  function connect() {
    try {
      const cfg = parseCfg(txt);
      try { localStorage.setItem('fm_setup_device', '1'); } catch (e) {}
      if (!initFirebase(cfg)) throw new Error('Firebase would not start with that config.');
      // push this device's PINs up without overwriting ones already in the cloud
      let local = {};
      try { local = JSON.parse(localStorage.getItem('argilan_pins') || '{}'); } catch (e) {}
      db.ref('argilan/pins').once('value').then(snap => {
        const remote = snap.val() || {};
        const add = {};
        Object.keys(local).forEach(k => { if (k !== 'laurel' && k !== 'eric' && local[k] && !remote[k]) add[k] = local[k]; });
        return Object.keys(add).length ? db.ref('argilan/pins').update(add) : null;
      }).catch(() => {}).then(() => { setMsg('✅ Connected. Reloading…'); setTimeout(() => location.reload(), 900); });
      setLink(makeLink(cfg));
      setMsg('Connecting…');
    } catch (e) { setMsg('❌ ' + e.message); }
  }
  const showLink = link || (saved ? makeLink(saved) : '');
  const box = { background: 'rgba(66,165,245,.08)', border: '1px solid rgba(66,165,245,.3)', borderRadius: 12, padding: 12, marginBottom: 14 };
  return React.createElement('div', { style: box },
    React.createElement('div', { style: { fontSize: 12, fontWeight: 900, color: connected ? '#4CAF82' : '#EF5350', marginBottom: 4 } }, (connected ? '🟢 Family sync is ON for this device' : '🔴 Family sync is OFF on this device')),
    React.createElement('div', { style: { fontSize: 10, color: 'rgba(255,255,255,.55)', lineHeight: 1.5, marginBottom: 8 } }, 'PINs, check-offs and approvals only reach the admin and other devices when every device is connected to the same Firebase database. Connect this device once, then use the device link on each other phone/tablet/PC — no PIN re-setup needed.'),
    !connected && React.createElement('div', null,
      React.createElement('textarea', { rows: 5, value: txt, onChange: e => setTxt(e.target.value), placeholder: 'Paste your firebaseConfig here (Firebase console → Project settings → Your apps)', style: { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, color: '#fff', fontSize: 11, padding: 8, marginBottom: 6 } }),
      React.createElement('button', { onClick: connect, style: { background: '#42A5F5', color: '#000', border: 'none', borderRadius: 20, padding: '8px 16px', fontWeight: 800, fontSize: 11, cursor: 'pointer' } }, 'Connect this device')),
    showLink && React.createElement('div', null,
      React.createElement('div', { style: { fontSize: 10, color: '#9FA8DA', fontWeight: 800, margin: '8px 0 3px' } }, 'DEVICE LINK — open this on each other device once'),
      React.createElement('textarea', { readOnly: true, rows: 3, value: showLink, onFocus: e => e.target.select(), style: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, color: '#9FA8DA', fontSize: 9, padding: 6 } }),
      React.createElement('button', { onClick: () => { try { navigator.clipboard.writeText(showLink); setMsg('Link copied.'); } catch (e) { setMsg('Select the link above and copy it.'); } }, style: { marginTop: 4, background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', borderRadius: 20, padding: '6px 12px', fontSize: 10, cursor: 'pointer' } }, '📋 Copy link')),
    msg && React.createElement('div', { style: { fontSize: 10, color: '#FFB74D', marginTop: 6 } }, msg));
}

function PinManager({ pins, setPin, family, hasPin }) {
  const fam = (family||DEFAULT_FAMILY).filter(p=>!p.deleted);
  const [shown, setShown] = React.useState({});
  const readPin = id => { try { const l = JSON.parse(localStorage.getItem('argilan_pins')||'{}'); return (pins && pins[id]) || l[id] || ''; } catch { return (pins && pins[id]) || ''; } };
  const [editingId, setEditingId] = React.useState(null);
  const [pinInput, setPinInput] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const _rq = ktUse('notifs', {})[0];
  const requests = Object.values(_rq || {}).filter(n => n && n.type === 'pin_reset_request' && n.approved == null).sort((a,b)=>b.timestamp-a.timestamp);

  function startEdit(id) { setEditingId(id); setPinInput(''); setMsg(''); }
  function savePin(id, name) {
    const clean = pinInput.replace(/[^0-9]/g,'').slice(0,4);
    if (clean.length !== 4) { setMsg('PIN must be exactly 4 digits.'); return; }
    if (setPin) setPin(id, clean);
    setMsg(name + '\'s PIN set to ' + clean + '!');
    setEditingId(null);
    setPinInput('');
    // Resolve any pending request for this person
    requests.filter(r => r.personId === id).forEach(r => {
      try { syncSet('notifs/' + r.id, { ...r, read: true, approved: true, adminNote: 'PIN reset to a new code.' }); } catch {}
    });
  }
  function clearPin(id, name) {
    if (!window._safeConfirm('Remove ' + name + '\'s PIN? They cannot log in until you set a new one here.')) return;
    if (setPin) setPin(id, '');
    setMsg(name + '\'s PIN was cleared.');
  }

  const iStyle = { flex:1, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:10, padding:'8px 10px', color:'#fff', fontSize:16, textAlign:'center', letterSpacing:4 };

  return /*#__PURE__*/React.createElement('div',{style:{padding:14}},
    /*#__PURE__*/React.createElement('div',{style:{fontSize:12,fontWeight:800,color:'#fff',marginBottom:12}},'PIN Manager'),
    msg && /*#__PURE__*/React.createElement('div',{style:{fontSize:10,color:'#4CAF82',background:'rgba(76,175,82,.08)',border:'1px solid rgba(76,175,82,.25)',borderRadius:8,padding:'7px 10px',marginBottom:10}},msg),
    requests.length > 0 && /*#__PURE__*/React.createElement('div',{style:{marginBottom:14,background:'rgba(255,152,0,.08)',border:'1px solid rgba(255,152,0,.3)',borderRadius:10,padding:'10px 12px'}},
      /*#__PURE__*/React.createElement('div',{style:{fontSize:10,fontWeight:800,color:'#FF9800',marginBottom:6}},'🙋 PIN RESET REQUESTS'),
      requests.map(r => {
        const p = fam.find(f=>f.id===r.personId) || {name:r.personName||r.personId, emoji:'👤'};
        return /*#__PURE__*/React.createElement('div',{key:r.id,style:{display:'flex',alignItems:'center',gap:8,padding:'6px 0'}},
          /*#__PURE__*/React.createElement('span',{style:{fontSize:16}},p.emoji),
          /*#__PURE__*/React.createElement('div',{style:{flex:1,fontSize:10,color:'#fff'}}, p.name + ' is locked out and needs a new PIN'),
          /*#__PURE__*/React.createElement('button',{onClick:()=>startEdit(r.personId), style:{fontSize:9,background:'#FF9800',color:'#000',border:'none',borderRadius:20,padding:'5px 12px',fontWeight:800,cursor:'pointer'}}, 'Set New PIN')
        );
      })
    ),
    fam.map(p=>{
      const isEditing = editingId === p.id;
      return /*#__PURE__*/React.createElement('div',{key:p.id,style:{marginBottom:6,background:'rgba(255,255,255,.05)',borderRadius:8,overflow:'hidden'}},
        /*#__PURE__*/React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,padding:'8px 10px'}},
          /*#__PURE__*/React.createElement('span',{style:{fontSize:20}},p.emoji||'👤'),
          /*#__PURE__*/React.createElement('div',{style:{flex:1}},
            /*#__PURE__*/React.createElement('div',{style:{fontSize:11,fontWeight:700,color:'#fff'}},p.name),
            /*#__PURE__*/React.createElement('div',{style:{fontSize:9,color:hasPin&&hasPin(p.id)?'#4CAF82':'rgba(255,255,255,.35)'}},hasPin&&hasPin(p.id)?(shown[p.id] ? '🔐 PIN is ' + readPin(p.id) + ' — tell them this number' : '🔒 PIN is set'):'No PIN yet — set one here so they can log in')
          ),
          /*#__PURE__*/React.createElement('button',{
            onClick: () => isEditing ? setEditingId(null) : startEdit(p.id),
            style:{fontSize:9,background:'rgba(156,141,196,.2)',color:'#9C8DC4',border:'1px solid rgba(156,141,196,.3)',borderRadius:20,padding:'4px 10px',cursor:'pointer'}
          }, isEditing ? 'Cancel' : (hasPin&&hasPin(p.id) ? 'Reset PIN' : 'Set PIN')),
          hasPin && hasPin(p.id) && /*#__PURE__*/React.createElement('button',{
            onClick: () => setShown(Object.assign({}, shown, {[p.id]: !shown[p.id]})),
            style:{fontSize:12,fontWeight:800,background:'rgba(66,165,245,.2)',color:'#90CAF9',border:'1px solid rgba(66,165,245,.5)',borderRadius:20,padding:'7px 12px',cursor:'pointer'}
          }, shown[p.id] ? 'Hide' : '🔐 Show PIN'),
          hasPin && hasPin(p.id) && /*#__PURE__*/React.createElement('button',{
            onClick: () => clearPin(p.id, p.name),
            style:{fontSize:9,background:'rgba(239,83,80,.1)',color:'#EF5350',border:'1px solid rgba(239,83,80,.25)',borderRadius:20,padding:'4px 10px',cursor:'pointer'}
          }, 'Delete')
        ),
        isEditing && /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:8,padding:'0 10px 10px'}},
          /*#__PURE__*/React.createElement('input',{
            type:'password', inputMode:'numeric', maxLength:4, value:pinInput,
            onChange:e=>setPinInput(e.target.value.replace(/[^0-9]/g,'').slice(0,4)),
            placeholder:'4 digits', style:iStyle
          }),
          /*#__PURE__*/React.createElement('button',{onClick:()=>savePin(p.id,p.name), style:{background:'#9C8DC4',color:'#000',border:'none',borderRadius:10,padding:'8px 14px',fontWeight:800,fontSize:11,cursor:'pointer'}}, 'Save')
        )
      );
    })
  );
}

function ProfileModal({ person, onClose, isAdmin, savePerson }) {
  if (!person) return null;
  return /*#__PURE__*/React.createElement('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000},onClick:onClose},
    /*#__PURE__*/React.createElement('div',{style:{background:'#1a1a2e',borderRadius:16,padding:24,minWidth:260},onClick:e=>e.stopPropagation()},
      /*#__PURE__*/React.createElement('div',{style:{textAlign:'center',marginBottom:16}},
        /*#__PURE__*/React.createElement('div',{style:{fontSize:48}},person.emoji||'👤'),
        /*#__PURE__*/React.createElement('div',{style:{fontSize:16,fontWeight:800,color:'#fff'}},person.name)
      ),
      /*#__PURE__*/React.createElement('button',{onClick:onClose,style:{width:'100%',background:'rgba(255,255,255,.08)',color:'#fff',border:'none',borderRadius:20,padding:10,cursor:'pointer'}},'Close')
    )
  );
}

function AccountSwitcherRow({ family, currentId, onSwitch, isAdmin }) {
  if (!isAdmin) return null;
  const fam = (family||DEFAULT_FAMILY).filter(p=>p.id!==currentId&&p.role!=='elder'&&!p.deleted);
  return /*#__PURE__*/React.createElement('div',{style:{display:'flex',gap:6,overflowX:'auto',padding:'4px 0'}},
    fam.map(p=>/*#__PURE__*/React.createElement('button',{key:p.id,onClick:()=>onSwitch&&onSwitch(p.id),style:{flexShrink:0,background:p.color+'22',border:'1px solid '+p.color+'44',borderRadius:20,padding:'4px 10px',color:'#fff',fontSize:9,cursor:'pointer'}},p.emoji+' '+p.name))
  );
}

function PermissionsManager({ family, getPerms, setPerms }) { return /*#__PURE__*/React.createElement('div',{style:{padding:14,color:'rgba(255,255,255,.4)',fontSize:11,textAlign:'center'}},'Permissions Manager'); }
function PersonalLists({ personId }) { return /*#__PURE__*/React.createElement('div',{style:{padding:14,color:'rgba(255,255,255,.4)',fontSize:11,textAlign:'center'}},'Personal lists'); }
function WasteReport({ sessions, family }) { return /*#__PURE__*/React.createElement('div',{style:{padding:14,color:'rgba(255,255,255,.4)',fontSize:11,textAlign:'center'}},'Time report'); }
const MOLD_APPT_TYPES = ['Initial Inspection', 'Follow-up Consult', 'Remediation Plan Review', 'Final Clearance Test'];
const MOLD_STATUSES = [
  { id: 'lead',      l: 'Lead',       c: '#9E9E9E' },
  { id: 'scheduled', l: 'Scheduled',  c: '#42A5F5' },
  { id: 'consulted', l: 'Consulted',  c: '#33B679' },
  { id: 'invoiced',  l: 'Invoiced',   c: '#F6BF26' },
  { id: 'paid',      l: 'Paid',       c: '#4CAF82' },
];
function moldStatusMeta(id) { return MOLD_STATUSES.find(s => s.id === id) || MOLD_STATUSES[0]; }

function MoldingConsultingModule({ personId, isAdmin }) {
  const blank = { id:null, name:'', phone:'', apptType: MOLD_APPT_TYPES[0], status:'lead', date:'', amount:'', notes:'' };
  const [clients, setClients] = React.useState([]);
  const [form, setForm] = React.useState(blank);
  const [filter, setFilter] = React.useState('all');

  React.useEffect(() => {
    const unsub = syncOn('mold_clients', d => { if (d) setClients(Object.values(d)); });
    return () => { if (unsub) unsub(); };
  }, []);

  function saveClient() {
    if (!form.name.trim()) return;
    const id = form.id || ('mc_' + Date.now());
    const rec = { ...form, id };
    const next = { ...(clients.reduce((a,c)=>({...a,[c.id]:c}),{})), [id]: rec };
    setClients(Object.values(next));
    syncSet('mold_clients', next);
    setForm(blank);
  }
  function editClient(c) { setForm(c); }
  function deleteClient(id) {
    if (!window._safeConfirm || window._safeConfirm('Delete this client record?')) {
      const next = clients.filter(c => c.id !== id).reduce((a,c)=>({...a,[c.id]:c}),{});
      setClients(Object.values(next));
      syncSet('mold_clients', next);
      if (form.id === id) setForm(blank);
    }
  }
  function setStatus(c, status) {
    const rec = { ...c, status };
    const next = { ...(clients.reduce((a,x)=>({...a,[x.id]:x}),{})), [c.id]: rec };
    setClients(Object.values(next));
    syncSet('mold_clients', next);
  }

  const visible = filter === 'all' ? clients : clients.filter(c => c.status === filter);
  const sorted = [...visible].sort((a,b) => (a.date||'9999').localeCompare(b.date||'9999'));
  const unpaidTotal = clients.filter(c => c.status==='invoiced').reduce((s,c)=>s+(parseFloat(c.amount)||0),0);
  const iStyle = { fontSize:11, background:'rgba(255,255,255,.06)', color:'#fff', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, padding:'7px 9px', width:'100%' };
  const lbl = { fontSize:8, color:'rgba(255,255,255,.4)', marginBottom:2, fontWeight:800, letterSpacing:.5 };

  return /*#__PURE__*/React.createElement('div', { style:{ padding:14 } },
    /*#__PURE__*/React.createElement('div', { style:{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' } },
      [['Leads', clients.filter(c=>c.status==='lead').length, '#9E9E9E'],
       ['Scheduled', clients.filter(c=>c.status==='scheduled').length, '#42A5F5'],
       ['Unpaid Invoiced', '$'+unpaidTotal.toFixed(0), '#F6BF26']].map(([l,v,c]) =>
        /*#__PURE__*/React.createElement('div', { key:l, style:{ flex:1, minWidth:90, background:'rgba(255,255,255,.05)', borderRadius:10, padding:'10px 8px', textAlign:'center' } },
          /*#__PURE__*/React.createElement('div', { style:{ fontSize:16, fontWeight:900, color:c } }, v),
          /*#__PURE__*/React.createElement('div', { style:{ fontSize:8, color:'rgba(255,255,255,.4)', marginTop:2 } }, l)
        )
      )
    ),
    /*#__PURE__*/React.createElement('div', { style:{ background:'rgba(51,182,121,.08)', border:'1px solid rgba(51,182,121,.25)', borderRadius:12, padding:12, marginBottom:14 } },
      /*#__PURE__*/React.createElement('div', { style:{ fontSize:10, fontWeight:800, color:'#33B679', marginBottom:8 } }, form.id ? '✏️ EDIT CLIENT' : '➕ NEW CLIENT / LEAD'),
      /*#__PURE__*/React.createElement('div', { style:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 } },
        /*#__PURE__*/React.createElement('div', null, /*#__PURE__*/React.createElement('div',{style:lbl},'Name'), /*#__PURE__*/React.createElement('input', { style:iStyle, value:form.name, onChange:e=>setForm({...form,name:e.target.value}), placeholder:'Client name' })),
        /*#__PURE__*/React.createElement('div', null, /*#__PURE__*/React.createElement('div',{style:lbl},'Phone'), /*#__PURE__*/React.createElement('input', { style:iStyle, value:form.phone, onChange:e=>setForm({...form,phone:e.target.value}), placeholder:'(xxx) xxx-xxxx' }))
      ),
      /*#__PURE__*/React.createElement('div', { style:{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:8 } },
        /*#__PURE__*/React.createElement('div', null, /*#__PURE__*/React.createElement('div',{style:lbl},'Appointment Type'),
          /*#__PURE__*/React.createElement('select', { style:iStyle, value:form.apptType, onChange:e=>setForm({...form,apptType:e.target.value}) },
            MOLD_APPT_TYPES.map(t=>/*#__PURE__*/React.createElement('option',{key:t,value:t,style:{color:'#000'}},t)))),
        /*#__PURE__*/React.createElement('div', null, /*#__PURE__*/React.createElement('div',{style:lbl},'Status'),
          /*#__PURE__*/React.createElement('select', { style:iStyle, value:form.status, onChange:e=>setForm({...form,status:e.target.value}) },
            MOLD_STATUSES.map(s=>/*#__PURE__*/React.createElement('option',{key:s.id,value:s.id,style:{color:'#000'}},s.l)))),
        /*#__PURE__*/React.createElement('div', null, /*#__PURE__*/React.createElement('div',{style:lbl},'Date'), /*#__PURE__*/React.createElement('input', { type:'date', style:iStyle, value:form.date, onChange:e=>setForm({...form,date:e.target.value}) }))
      ),
      /*#__PURE__*/React.createElement('div', { style:{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:8, marginBottom:8 } },
        /*#__PURE__*/React.createElement('div', null, /*#__PURE__*/React.createElement('div',{style:lbl},'Amount ($)'), /*#__PURE__*/React.createElement('input', { type:'number', style:iStyle, value:form.amount, onChange:e=>setForm({...form,amount:e.target.value}), placeholder:'0.00' })),
        /*#__PURE__*/React.createElement('div', null, /*#__PURE__*/React.createElement('div',{style:lbl},'Notes'), /*#__PURE__*/React.createElement('input', { style:iStyle, value:form.notes, onChange:e=>setForm({...form,notes:e.target.value}), placeholder:'Site details, findings, etc.' }))
      ),
      /*#__PURE__*/React.createElement('div', { style:{ display:'flex', gap:8 } },
        /*#__PURE__*/React.createElement('button', { onClick:saveClient, style:{ flex:1, background:'#33B679', color:'#fff', border:'none', borderRadius:20, padding:'9px', fontSize:11, fontWeight:800, cursor:'pointer' } }, form.id ? 'Save Changes' : 'Add Client'),
        form.id && /*#__PURE__*/React.createElement('button', { onClick:()=>setForm(blank), style:{ background:'rgba(255,255,255,.08)', color:'#aaa', border:'none', borderRadius:20, padding:'9px 14px', fontSize:11, cursor:'pointer' } }, 'Cancel')
      )
    ),
    /*#__PURE__*/React.createElement('div', { style:{ display:'flex', gap:5, marginBottom:10, flexWrap:'wrap' } },
      [['all','All']].concat(MOLD_STATUSES.map(s=>[s.id,s.l])).map(([id,l]) =>
        /*#__PURE__*/React.createElement('button', { key:id, onClick:()=>setFilter(id), style:{ fontSize:9, fontWeight:800, padding:'5px 10px', borderRadius:20, border:'1px solid '+(filter===id?'#33B679':'rgba(255,255,255,.15)'), background:filter===id?'rgba(51,182,121,.2)':'transparent', color:filter===id?'#33B679':'rgba(255,255,255,.5)', cursor:'pointer' } }, l)
      )
    ),
    sorted.length === 0
      ? /*#__PURE__*/React.createElement('div', { style:{ padding:20, textAlign:'center', color:'rgba(255,255,255,.3)', fontSize:11 } }, 'No clients yet — add one above.')
      : sorted.map(c => {
          const sm = moldStatusMeta(c.status);
          return /*#__PURE__*/React.createElement('div', { key:c.id, style:{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:10, padding:'10px 12px', marginBottom:8 } },
            /*#__PURE__*/React.createElement('div', { style:{ display:'flex', alignItems:'center', gap:8, marginBottom:4 } },
              /*#__PURE__*/React.createElement('div', { style:{ fontSize:12, fontWeight:800, color:'#fff', flex:1 } }, c.name),
              /*#__PURE__*/React.createElement('span', { style:{ fontSize:8, fontWeight:800, padding:'3px 8px', borderRadius:20, background:sm.c+'22', color:sm.c, border:'1px solid '+sm.c+'44' } }, sm.l)
            ),
            /*#__PURE__*/React.createElement('div', { style:{ fontSize:9, color:'rgba(255,255,255,.45)', marginBottom:2 } }, c.apptType + (c.date?' · '+c.date:'') + (c.phone?' · '+c.phone:'')),
            (c.amount) && /*#__PURE__*/React.createElement('div', { style:{ fontSize:9, color:'#F6BF26', marginBottom:2 } }, '$'+parseFloat(c.amount).toFixed(2)),
            c.notes && /*#__PURE__*/React.createElement('div', { style:{ fontSize:9, color:'rgba(255,255,255,.35)', marginBottom:6, fontStyle:'italic' } }, c.notes),
            /*#__PURE__*/React.createElement('div', { style:{ display:'flex', gap:5, flexWrap:'wrap' } },
              MOLD_STATUSES.filter(s=>s.id!==c.status).map(s =>
                /*#__PURE__*/React.createElement('button', { key:s.id, onClick:()=>setStatus(c,s.id), style:{ fontSize:8, background:'transparent', color:s.c, border:'1px solid '+s.c+'44', borderRadius:20, padding:'3px 7px', cursor:'pointer' } }, '→ '+s.l)
              ),
              /*#__PURE__*/React.createElement('button', { onClick:()=>editClient(c), style:{ fontSize:8, background:'rgba(192,202,51,.1)', color:'#C0CA33', border:'1px solid rgba(192,202,51,.25)', borderRadius:20, padding:'3px 7px', cursor:'pointer' } }, '✏️ Edit'),
              /*#__PURE__*/React.createElement('button', { onClick:()=>deleteClient(c.id), style:{ fontSize:8, background:'rgba(239,83,80,.08)', color:'#EF5350', border:'1px solid rgba(239,83,80,.2)', borderRadius:20, padding:'3px 7px', cursor:'pointer' } }, '🗑')
            )
          );
        })
  );
}
function FreeTimeView({ personId }) { return /*#__PURE__*/React.createElement('div',{style:{padding:14,color:'rgba(255,255,255,.4)',fontSize:11,textAlign:'center'}},'Enjoy your free time!'); }
function Item({ children, style }) { return /*#__PURE__*/React.createElement('div',{style:{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)',...style}},children); }


function TasksTab2({ currentPersonId, role, tasks, todayTasks, pendingApproval, onComplete, onClaim, onApprove, onReset, onDelete, isAdmin, payMode, family, addTask }) {
  var [newTitle, setNewTitle] = React.useState('');
  var [newPts, setNewPts] = React.useState('10');
  var [showAdd, setShowAdd] = React.useState(false);

  var allTasks = Array.isArray(tasks) ? tasks : Object.values(tasks || {});
  var myTasks = isAdmin ? allTasks : allTasks.filter(function(t) { return !t.assignedTo || t.assignedTo === currentPersonId || t.status === 'open'; });

  var statusColor = { open: '#9C8DC4', claimed: '#F6BF26', pending: '#FF9800', done: '#4CAF82', approved: '#4CAF82' };

  function handleAdd() {
    if (!newTitle.trim()) return;
    if (addTask) addTask({ id: 'task_'+Date.now(), title: newTitle.trim(), pts: parseInt(newPts)||10, status: 'open', createdAt: Date.now() });
    setNewTitle(''); setNewPts('10'); setShowAdd(false);
  }

  return /*#__PURE__*/React.createElement('div', { style: { paddingBottom: 20 } },
    isAdmin && /*#__PURE__*/React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px 4px' } },
      /*#__PURE__*/React.createElement('div', { style: { fontSize: 11, fontWeight: 800, color: '#fff' } }, 'Tasks'),
      /*#__PURE__*/React.createElement('button', { onClick: function() { setShowAdd(function(p) { return !p; }); }, style: { fontSize: 9, background: 'rgba(156,141,196,.2)', color: '#9C8DC4', border: '1px solid rgba(156,141,196,.3)', borderRadius: 20, padding: '4px 10px', cursor: 'pointer' } }, showAdd ? 'Cancel' : '+ Add Task')
    ),
    showAdd && isAdmin && /*#__PURE__*/React.createElement('div', { style: { display: 'flex', gap: 6, padding: '6px 14px', marginBottom: 4 } },
      /*#__PURE__*/React.createElement('input', { value: newTitle, onChange: function(e) { setNewTitle(e.target.value); }, placeholder: 'Task title', autoCorrect: 'on', style: { flex: 1, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: 11 } }),
      /*#__PURE__*/React.createElement('input', { value: newPts, onChange: function(e) { setNewPts(e.target.value); }, placeholder: 'Pts', type: 'number', style: { width: 50, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '7px 8px', color: '#fff', fontSize: 11 } }),
      /*#__PURE__*/React.createElement('button', { onClick: handleAdd, style: { background: '#9C8DC4', color: '#000', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' } }, 'Add')
    ),
    myTasks.length === 0 && /*#__PURE__*/React.createElement('div', { style: { padding: 20, textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: 11 } }, isAdmin ? 'No tasks yet. Tap + Add Task to create one.' : 'No tasks assigned yet.'),
    myTasks.map(function(task) {
      var st = task.status || 'open';
      var col = statusColor[st] || '#888';
      return /*#__PURE__*/React.createElement('div', { key: task.id, style: { margin: '6px 14px', background: col+'10', border: '1px solid '+col+'35', borderLeft: '3px solid '+col, borderRadius: 10, padding: '10px 12px' } },
        /*#__PURE__*/React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } },
          /*#__PURE__*/React.createElement('div', { style: { flex: 1, fontSize: 12, fontWeight: 700, color: '#fff' } }, task.title || 'Task'),
          /*#__PURE__*/React.createElement('div', { style: { fontSize: 11, fontWeight: 800, color: col } }, (task.pts || 0)+'pts'),
          /*#__PURE__*/React.createElement('div', { style: { fontSize: 8, background: col+'20', color: col, border: '1px solid '+col+'40', borderRadius: 20, padding: '2px 7px', fontWeight: 800 } }, st.toUpperCase())
        ),
        /*#__PURE__*/React.createElement('div', { style: { fontSize: 8, color: 'rgba(255,255,255,.35)', fontWeight: 700, letterSpacing: .3, marginBottom: 6 } }, '✅ Family Chores & Tasks · Argilan Family'),
        task.assignedTo && /*#__PURE__*/React.createElement('div', { style: { fontSize: 9, color: 'rgba(255,255,255,.4)', marginBottom: 6 } }, 'Assigned to: '+task.assignedTo),
        st === 'awaiting_approval' && task.completedBy && /*#__PURE__*/React.createElement('div', { style: { fontSize: 9, color: '#F6BF26', marginBottom: 6, fontWeight: 700 } }, '✋ Submitted by ' + task.completedBy + ' — awaiting your approval'),
        /*#__PURE__*/React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
          st === 'open' && !isAdmin && /*#__PURE__*/React.createElement('button', { onClick: function() { if(onClaim) onClaim(task.id, currentPersonId); }, style: { padding: '5px 10px', fontSize: 9, fontWeight: 800, background: 'rgba(156,141,196,.2)', color: '#9C8DC4', border: '1px solid rgba(156,141,196,.3)', borderRadius: 20, cursor: 'pointer' } }, 'Claim'),
          (st === 'claimed' || st === 'open') && !isAdmin && /*#__PURE__*/React.createElement('button', { onClick: function() { if(onComplete) onComplete(task.id, currentPersonId); }, style: { padding: '5px 10px', fontSize: 9, fontWeight: 800, background: 'rgba(76,175,82,.2)', color: '#4CAF82', border: '1px solid rgba(76,175,82,.3)', borderRadius: 20, cursor: 'pointer' } }, 'Mark Done'),
          st === 'awaiting_approval' && isAdmin && /*#__PURE__*/React.createElement('button', { onClick: function() { if(onApprove) onApprove(task.id, true); }, style: { padding: '5px 10px', fontSize: 9, fontWeight: 800, background: 'rgba(76,175,82,.2)', color: '#4CAF82', border: '1px solid rgba(76,175,82,.3)', borderRadius: 20, cursor: 'pointer' } }, '✅ Approve & Pay'),
          st === 'awaiting_approval' && isAdmin && /*#__PURE__*/React.createElement('button', { onClick: function() { if(onApprove) onApprove(task.id, false); }, style: { padding: '5px 10px', fontSize: 9, fontWeight: 800, background: 'rgba(239,83,80,.15)', color: '#EF5350', border: '1px solid rgba(239,83,80,.3)', borderRadius: 20, cursor: 'pointer' } }, '↩︎ Send Back'),
          isAdmin && /*#__PURE__*/React.createElement('button', { onClick: function() { if(onReset) onReset(task.id); }, style: { padding: '5px 10px', fontSize: 9, background: 'rgba(255,255,255,.06)', color: '#aaa', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, cursor: 'pointer' } }, 'Reset'),
          isAdmin && /*#__PURE__*/React.createElement('button', { onClick: function() { if(window._safeConfirm('Delete this task?') && onDelete) onDelete(task.id); }, style: { padding: '5px 10px', fontSize: 9, background: 'transparent', color: 'rgba(239,83,80,.5)', border: 'none', cursor: 'pointer' } }, '🗑')
        )
      );
    })
  );
}


function Dashboard({
  personId,
  role,
  sessions,
  setSessions,
  onUpdate,
  onLogout,
  notifs,
  addNotif,
  unread,
  pending,
  approveNotif,
  markAllRead,
  deleteNotif,
  deleteMany,
  toggleSave,
  clearAllNotifs,
  reminders,
  onSaveRem,
  onDelRem,
  wallets,
  getWallet,
  credit,
  approveCredit,
  rejectCredit,
  deduct,
  resetWallet,
  setLinked,
  adminBonus,
  tasks,
  todayTasks,
  pendingApproval,
  addTask,
  completeTask,
  approveTask,
  resetTask,
  deleteTask,
  claimTask,
  family,
  savePerson,
  deletePerson,
  addPerson,
  settings,
  updateSetting,
  pins,
  setPin,
  checkPin,
  hasPin,
  getPerms,
  setPerms,
  schedHook
}) {
  const [tab, setTab] = useState(role === 'child' ? 'start' : role === 'elder' ? 'schedule' : 'clock');
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMsgs, setShowMsgs] = useState(false);
  const tabStack = React.useRef([]); const backing = React.useRef(false);
  React.useEffect(() => { if (backing.current) { backing.current = false; return; } const st = tabStack.current; if (st[st.length - 1] !== tab) st.push(tab); if (st.length > 25) st.shift(); }, [tab]);
  React.useEffect(() => { window._msgTo = function (pid) { window._msgOpenWith = pid || null; setShowNotifs(false); setShowMsgs(true); }; }, []);
  const [profileId, setProfileId] = useState(null);
  const [showSwitch, setShowSwitch] = useState(false);
  const [viewingAs, setViewingAs] = useState(null); // admin switching to another person's account
  const [schedEditMode, setSchedEditMode] = useState(false);

  // ── Back / Forward screen navigation history ─────────────────────────────
  const [navStack, setNavStack] = useState([role === 'child' ? 'start' : role === 'elder' ? 'schedule' : 'clock']);
  const [navIndex, setNavIndex] = useState(0);
  const navSkipRef = useRef(false);
  useEffect(() => {
    if (navSkipRef.current) { navSkipRef.current = false; return; }
    setNavStack(prev => {
      if (prev[navIndex] === tab) return prev;
      const trimmed = prev.slice(0, navIndex + 1);
      const next = [...trimmed, tab];
      setNavIndex(next.length - 1);
      return next;
    });
    // eslint-disable-next-line
  }, [tab]);
  function navBack() {
    if (navIndex <= 0) return;
    navSkipRef.current = true;
    setNavIndex(navIndex - 1);
    setTab(navStack[navIndex - 1]);
  }
  function navForward() {
    if (navIndex >= navStack.length - 1) return;
    navSkipRef.current = true;
    setNavIndex(navIndex + 1);
    setTab(navStack[navIndex + 1]);
  }
  const canGoBack = navIndex > 0;
  const canGoForward = navIndex < navStack.length - 1;
  const [sopInspectPerson, setSopInspectPerson] = useState(null);
  const isAdmin = role === 'parent'; window._isAdminSession = isAdmin;
  const isLaurel = personId === 'laurel';
  const isChild = role === 'child';
  const [adminMode, setAdminMode] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('_adminMode_' + personId) || 'false'); } catch { return false; }
  });
  function toggleAdminMode() {
    const next = !adminMode;
    setAdminMode(next);
    localStorage.setItem('_adminMode_' + personId, JSON.stringify(next));
    setTab(next ? 'admin' : 'board');
  }
  const payMode = settings?.payMode || 'pay';
  const alarmVol = (settings&&settings.alarmVol!=null?settings.alarmVol:2);
  const fam = family || DEFAULT_FAMILY;
  const getPerson = useCallback(id => fam.find(f => f.id === id) || DEFAULT_FAMILY.find(f => f.id === id) || {
    id,
    name: '?',
    emoji: '👤',
    color: '#888',
    role: 'child',
    inPaySystem: false
  }, [fam]);
  const person = getPerson(personId);
  const isOwner = !!(person.isOwner || personId === 'laurel' || personId === 'eric');

  // Phone automation link (#trip=start): opens Bill Pay -> Mileage and starts the GPS trip
  React.useEffect(() => {
    try { if (isOwner && /trip=start/.test(location.hash || '')) { window._tripAutoStart = true; setTab('bills'); } } catch (e) {}
  }, []);

  // Who we're currently viewing (admin can view others)
  const effectiveId = viewingAs || personId;
  React.useEffect(() => { window._dashSetTab = setTab; }, []);
  React.useEffect(() => { window._clockApi = { sessions: sessions, onUpdate: onUpdate }; });
  React.useEffect(() => {
    window._currentPersonId = effectiveId; window._loginPersonId = personId;
    window._currentPersonName = (typeof getPerson === 'function' ? getPerson(effectiveId)?.name : null) || effectiveId;
  }, [effectiveId]);
  React.useEffect(() => {
    window._sendFamilyMessage = (text) => {
      if(typeof syncSet === 'function'){
        const ts = Date.now();
        syncSet('argilan/messages/admin_laurel_'+ts, {
          id: ts, from: effectiveId, to: 'laurel',
          text: text, ts: ts, unread: true
        });
      }
    };
  }, [effectiveId]);
  const effectivePerson = getPerson(effectiveId);
  const effectiveRole = viewingAs ? effectivePerson.role : role;
  const effectivePerms = getPerms(effectiveId, effectiveRole);
  const homeNow = effectiveRole === 'child' ? 'start' : effectiveRole === 'elder' ? 'schedule' : 'clock';
  const goBack = () => { const st = tabStack.current; st.pop(); const prev = st[st.length - 1] || homeNow; if (prev !== tab) { backing.current = true; setTab(prev); } try { window.scrollTo(0, 0); } catch (e) {} };

  // Build tabs for the effective person (who we're viewing)
  function buildTabs() {
    // ── ADMIN MODE (Laurel + Eric) ─────────────────────────────────────────
    if (effectiveRole === 'parent' && adminMode && isOwner) {
      return [
        {id:'clock',    l:'⏱ My Day Time Tracker'},
        {id:'admin',    l:'🔧 Admin'+(pending>0?' ('+pending+')':'')},
        {id:'family',   l:'👥 Family'},
        {id:'money',    l:'💰 Money'},
        {id:'store',    l:'🛒 Store & Envelopes'},
        {id:'bills',    l:'🧾 Bill Pay'},
        {id:'safety',   l:'🛡 Safety'},
        {id:'menu',     l:'🍳 Kitchen'},
        {id:'health',   l:'🩺 Health'},
        {id:'journal',  l:'📓 Journal'},
        {id:'complab',  l:'💻 Computer Lab'},
        {id:'finplan',  l:'🏦 Money Skills'},
        {id:'habits',  l:'🏆 Habit Leaders'},
        {id:'work',     l:'💼 Work'},
        {id:'gradebook',l:'📒 Grades & Attendance'},
      ];
    }
    // ── PARENT DAILY MODE ──────────────────────────────────────────────────
    if (effectiveRole === 'parent') {
      return [
        {id:'clock',    l:'⏱ My Day Time Tracker'},
        {id:'board',    l:'🏆 Board'},
        {id:'chores',   l:'🧹 Chores'},
        {id:'work',     l:'💼 Work'},
        {id:'money',    l:'💰 Money'},
        {id:'store',    l:'🛒 Store & Envelopes'},
        {id:'bills',    l:'🧾 Bill Pay'},
        {id:'safety',   l:'🛡 Safety'},
        {id:'menu',     l:'🍳 Kitchen'},
        {id:'health',   l:'🩺 Health'},
        {id:'journal',  l:'📓 Journal'},
        {id:'complab',  l:'💻 Computer Lab'},
        {id:'finplan',  l:'🏦 Money Skills'},
        {id:'habits',  l:'🏆 Habit Leaders'},
        {id:'gradebook',l:'📒 Grades & Attendance'},
      ];
    }
    // ── ELDER (Grandpa) ────────────────────────────────────────────────────
    if (effectiveRole === 'elder') {
      return [
        {id:'schedule', l:'📋 My Day'},
        {id:'spiritual',l:'✨ Spiritual'},
        {id:'health',   l:'🩺 Health'},
        {id:'accounts', l:'🔗 My Accounts'},
        {id:'journal',  l:'📓 Journal'},
        {id:'complab',  l:'💻 Computer Lab'},
        {id:'finplan',  l:'🏦 Money Skills'},
        {id:'habits',  l:'🏆 Habit Leaders'},
      ];
    }
    // ── CHILDREN ──────────────────────────────────────────────────────────
    return [
      {id:'start',    l:'⏱ My Day Clock-In'},
      {id:'journal',  l:'📓 Journal'},
        {id:'complab',  l:'💻 Computer Lab'},
        {id:'finplan',  l:'🏦 Money Skills'},
        {id:'habits',  l:'🏆 Habit Leaders'},
      {id:'chores',   l:'🧹 Chores'},
      {id:'work',     l:'💼 Work'},
      {id:'board',    l:'🏆 Board'},
      {id:'money',    l:'💼 My Bethel Job'},
      {id:'store',    l:'🛒 Store & Envelopes'},
      {id:'menu',     l:'🍳 Kitchen'},
      {id:'health',   l:'🩺 Health'},
      {id:'gradebook',l:'📒 My Grades'},
    ];
  }
  const [, setFocusV] = useState(0);
  useEffect(() => { const f = () => setFocusV(v => v + 1); window.addEventListener('fm-focus', f); return () => window.removeEventListener('fm-focus', f); }, []);
  let tabs = buildTabs();
  if (window._focusOn && !isOwner) tabs = tabs.filter(t => ['money', 'board', 'journal', 'bills', 'accounts'].indexOf(t.id) === -1);
  useEffect(() => { if (window._focusOn && !isOwner && ['money', 'board', 'journal', 'bills', 'accounts'].indexOf(tab) !== -1) setTab(effectiveRole === 'child' ? 'start' : 'clock'); });
  // Make sure tab is valid
  useEffect(() => {
    if (!tabs.find(t => t.id === tab) && tabs.length > 0) setTab(tabs[0].id||'board');
  }, [effectiveId, effectiveRole]);
  const _ncCfg = ktUse('notify_cfg', null)[0] || {};
  const myNotifs = isAdmin ? notifs.filter(n => typeof ncWants !== 'function' || ncWants(personId, n, _ncCfg)) : notifs.filter(n => n.personId === personId || n.personId === 'all');
  const myUnread = isAdmin ? unread : myNotifs.filter(n => !n.read).length;
  function handleSwitch(pid) {
    setViewingAs(pid === personId ? null : pid);
    setTab('start');
  }
  if (showSwitch && isAdmin) return /*#__PURE__*/React.createElement('div', { style: { position: 'fixed', inset: 0, background: '#0f0c29', zIndex: 1000, overflowY: 'auto', padding: 20 } },
    /*#__PURE__*/React.createElement('div', { style: { fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 } }, 'Switch to who?'),
    /*#__PURE__*/React.createElement('div', { style: { fontSize: 11, color: 'rgba(255,255,255,.5)', marginBottom: 14 } }, 'See the app exactly as that person does. Tap yourself to come back.'),
    fam.filter(p => !p.deleted).map(p => /*#__PURE__*/React.createElement('button', { key: p.id, onClick: () => { handleSwitch(p.id); setShowSwitch(false); }, style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: p.color + '22', border: '1px solid ' + p.color + '66', borderRadius: 16, padding: '12px 14px', marginBottom: 8, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', textAlign: 'left' } },
      /*#__PURE__*/React.createElement('span', { style: { fontSize: 26 } }, p.emoji), p.name + (p.id === personId ? ' (me)' : ''), effectiveId === p.id ? ' ✓' : '')),
    /*#__PURE__*/React.createElement('button', { onClick: () => setShowSwitch(false), style: { width: '100%', background: 'rgba(255,255,255,.08)', color: '#fff', border: 'none', borderRadius: 20, padding: 12, fontWeight: 800, marginTop: 8, cursor: 'pointer' } }, 'Close'));
  if (showMsgs) return React.createElement('div', { style: { minHeight: '100vh', background: 'linear-gradient(160deg,#0f0c29,#1a1a2e,#24243e)', padding: 12 } },
    React.createElement('button', { onClick: () => setShowMsgs(false), style: { background: '#4CAF82', color: '#000', border: 'none', borderRadius: 18, padding: '12px 18px', fontWeight: 900, fontSize: 15, cursor: 'pointer', marginBottom: 10 } }, '← Back'),
    React.createElement(MessengerPanel, { personId: personId, isAdmin: isAdmin || isOwner, syncSet: syncSet, family: fam }));
  if (showNotifs) return /*#__PURE__*/React.createElement(NotifPanel, {
    notifs: myNotifs,
    onClose: () => setShowNotifs(false),
    onApprove: approveNotif,
    onApproveTask: approveTask,
    onMarkAllRead: markAllRead,
    onDelete: deleteNotif,
    onDeleteMany: deleteMany,
    onToggleSave: toggleSave,
    onClearAll: clearAllNotifs,
    isAdmin: isAdmin || isOwner,
    currentPersonId: personId
  });
  if (profileId) return /*#__PURE__*/React.createElement(ProfileModal, {
    person: getPerson(profileId),
    personId: profileId,
    onClose: () => setProfileId(null),
    sessions: sessions,
    wallets: wallets,
    getWallet: getWallet,
    isAdmin: isAdmin,
    credit: credit,
    approveCredit: approveCredit,
    rejectCredit: rejectCredit,
    deduct: deduct,
    setLinked: setLinked,
    adminBonus: adminBonus,
    tasks: tasks,
    todayTasks: todayTasks,
    onCompleteTask: completeTask,
    onClaimTask: claimTask,
    onApproveTask: approveTask,
    addNotif: addNotif,
    payMode: payMode,
    family: fam
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(160deg,#0f0c29,#1a1a2e,#24243e)'
    }
  }, /*#__PURE__*/React.createElement("div", { style: { position: 'sticky', top: 0, zIndex: 60, background: '#14112e', flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,.4)' } }, /*#__PURE__*/React.createElement("div", {
    style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#14112e', borderBottom: '1px solid rgba(255,255,255,.1)', flexShrink: 0, position: 'relative' }
  }, /*#__PURE__*/React.createElement("div", { style: { flex: 1, fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, (viewingAs ? (effectivePerson.emoji || '') + ' Viewing ' + effectivePerson.name + '\u2019s account  ·  you are ' + (person ? person.name : '') : (person && person.emoji ? person.emoji + ' ' : '') + 'Signed in as ' + (person ? person.name : ''))),
  /*#__PURE__*/React.createElement(SyncDot, null), /*#__PURE__*/React.createElement(SndToggle2, {
    vol: isChild && typeof window._effVol === 'function' && window._effVol() != null ? window._effVol() : alarmVol,
    onUpdate: updateSetting
  }), typeof MsgBubble === 'function' && React.createElement(MsgBubble, { personId: personId, onClick: () => window._msgTo && window._msgTo(null) }), /*#__PURE__*/React.createElement(NotifBell, {
    unread: myUnread,
    pending: isAdmin ? pending : 0,
    onClick: () => setShowNotifs(true)
  }),
  viewingAs && /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewingAs(null),
    style: { background: 'rgba(255,255,255,.15)', color: '#fff', border: 'none', borderRadius: 22, padding: '10px 12px', fontWeight: 800, fontSize: 12, cursor: 'pointer', minHeight: 44 }
  }, "\u21A9 Back to me"),
  /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    style: { background: '#E53935', color: '#fff', border: 'none', borderRadius: 22, padding: '10px 18px', fontWeight: 900, fontSize: 15, cursor: 'pointer', minHeight: 44 }
  }, "\uD83D\uDD12 Log out")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px 0',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: navBack,
    disabled: !canGoBack,
    title: "Back",
    style: {
      width: 30, height: 30, borderRadius: '50%',
      background: 'rgba(255,255,255,.07)',
      color: canGoBack ? '#fff' : 'rgba(255,255,255,.2)',
      border: 'none', fontSize: 14, flexShrink: 0,
      cursor: canGoBack ? 'pointer' : 'default'
    }
  }, "\u2039"), /*#__PURE__*/React.createElement("button", {
    onClick: navForward,
    disabled: !canGoForward,
    title: "Forward",
    style: {
      width: 30, height: 30, borderRadius: '50%',
      background: 'rgba(255,255,255,.07)',
      color: canGoForward ? '#fff' : 'rgba(255,255,255,.2)',
      border: 'none', fontSize: 14, flexShrink: 0,
      cursor: canGoForward ? 'pointer' : 'default'
    }
  }, "\u203A"), /*#__PURE__*/React.createElement("button", { onClick: () => { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {} }, title: "Menu", style: { background: 'rgba(255,255,255,.12)', color: '#fff', border: 'none', borderRadius: 14, padding: '0 10px', height: 30, fontSize: 12, fontWeight: 800, cursor: 'pointer', flexShrink: 0 } }, "\u2630 Menu"), /*#__PURE__*/React.createElement(isAdmin ? "button" : "div", {
    onClick: isAdmin ? () => setShowSwitch(true) : undefined,
    title: isAdmin ? "Switch to another family member" : undefined,
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: (viewingAs ? effectivePerson : person).color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 18,
      border: isOwner ? '2px solid #C0CA33' : 'none',
      cursor: isAdmin ? 'pointer' : 'default',
      flexShrink: 0
    }
  }, viewingAs ? effectivePerson.emoji : person.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#fff'
    }
  }, (viewingAs ? effectivePerson : person).name + (viewingAs ? ' (viewing)' : '')), isOwner && !viewingAs && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      marginLeft: 5
    }
  }, "\uD83D\uDC51"), !isOwner && isAdmin && !viewingAs && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: person.color,
      marginLeft: 5
    }
  }, "Admin"), (viewingAs ? effectivePerson : person).inPaySystem && payMode === 'pay' && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: '#4CAF82',
      marginLeft: 8
    }
  }, "$", (getWallet(effectiveId).balance || 0).toFixed(2)), (viewingAs ? effectivePerson : person).inPaySystem && payMode === 'points' && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      marginLeft: 8
    }
  }, calcPoints(sessions, effectiveId), "pts")))), (isLaurel || personId === 'eric') && /*#__PURE__*/React.createElement("button", {
    onClick: toggleAdminMode,
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      background: adminMode ? 'rgba(192,202,51,.1)' : 'rgba(76,175,82,.08)',
      border: 'none',
      borderBottom: adminMode
        ? '2px solid rgba(192,202,51,.4)'
        : '2px solid rgba(76,175,82,.3)',
      cursor: 'pointer',
      flexShrink: 0
    }
  },
    /*#__PURE__*/React.createElement("div", {style:{display:'flex',alignItems:'center',gap:8}},
      /*#__PURE__*/React.createElement("span", {style:{fontSize:16}},
        adminMode ? '⚙️' : '👩‍🏫'),
      /*#__PURE__*/React.createElement("div", {style:{textAlign:'left'}},
        /*#__PURE__*/React.createElement("div", {
          style:{fontSize:10,fontWeight:800,
            color: adminMode ? '#C0CA33' : '#4CAF82'}},
          adminMode ? 'Admin Mode — Settings & Management'
                    : 'Daily Mode — Board · My Day · Spiritual · Work · Clock'),
        /*#__PURE__*/React.createElement("div", {
          style:{fontSize:8,color:'rgba(255,255,255,.35)'}},
          adminMode ? 'Tap to switch back to your daily workflow'
                    : 'Tap to switch to Admin settings'))
    ),
    /*#__PURE__*/React.createElement("div", {
      style:{
        fontSize:9,fontWeight:800,padding:'4px 10px',borderRadius:20,
        background: adminMode ? 'rgba(192,202,51,.2)' : 'rgba(76,175,82,.15)',
        color: adminMode ? '#C0CA33' : '#4CAF82',
        border: adminMode ? '1px solid rgba(192,202,51,.4)' : '1px solid rgba(76,175,82,.3)'
      }
    }, adminMode ? 'SWITCH TO DAILY ›' : 'SWITCH TO ADMIN ›')
  ),
    /*#__PURE__*/React.createElement("div", {
    style: { display: 'grid', gridTemplateColumns: 'repeat(' + (tabs.length > 8 ? 4 : 3) + ',1fr)', gap: 6, padding: '8px 12px', flexShrink: 0 }
  }, tabs.map(t => { const sp = String(t.l).indexOf(' '), emo = sp > 0 ? String(t.l).slice(0, sp) : '', txt = sp > 0 ? String(t.l).slice(sp + 1) : t.l, on = tab === t.id; return /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: { minHeight: 54, padding: '6px 3px', borderRadius: 12, fontSize: 10.5, fontWeight: 700, lineHeight: 1.15, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, cursor: 'pointer', wordBreak: 'break-word',
      background: on ? effectivePerson.color : 'rgba(255,255,255,.07)', color: on ? '#fff' : '#cfd3e0', border: `1px solid ${on ? effectivePerson.color : 'rgba(255,255,255,.12)'}` }
  }, /*#__PURE__*/React.createElement("span", { style: { fontSize: 18 } }, emo), /*#__PURE__*/React.createElement("span", null, txt)); })), (typeof VolumeGuard === 'function' ? React.createElement(VolumeGuard, { personId: personId, isChild: isChild }) : null), (typeof PayrollEngine === 'function' ? React.createElement(PayrollEngine, { family: fam, isAdmin: !!(isAdmin || isOwner) && !viewingAs }) : null), (!viewingAs && effectiveRole === 'child' && typeof AttendanceAuto === 'function') ? /*#__PURE__*/React.createElement(AttendanceAuto, { personId: personId, sessions: sessions }) : null, (!viewingAs && effectiveRole === 'child' && typeof ClockPayEngine === 'function') ? /*#__PURE__*/React.createElement(ClockPayEngine, { personId: personId, sessions: sessions }) : null, (tab === homeNow && !viewingAs && (isAdmin || isOwner) && typeof FamilyGlance === 'function') ? /*#__PURE__*/React.createElement(FamilyGlance, { sessions: sessions, family: fam, onUpdate: onUpdate, setTab: setTab, schedHook: schedHook, addNotif: addNotif }) : null, (isAdmin || isOwner) && typeof PinRequestBanner === 'function' ? /*#__PURE__*/React.createElement(PinRequestBanner, { personId: personId, notifs: notifs, family: fam, onOpen: () => setTab('family') }) : null, (typeof AlertsSetup === 'function' && !viewingAs) ? React.createElement(AlertsSetup, { personId: personId, isAdmin: isAdmin || isOwner, family: fam }) : null, (tab === homeNow && personId === 'laurel' && !viewingAs && typeof BillsStartNotices === 'function') ? /*#__PURE__*/React.createElement(BillsStartNotices, { family: fam, addNotif: addNotif }) : null, (tab === homeNow && effectiveRole !== 'elder' && typeof ComingUp === 'function') ? /*#__PURE__*/React.createElement(ComingUp, { personId: effectiveId, isAdmin: !viewingAs && (isAdmin || isOwner), family: fam, addNotif: addNotif, onGo: () => setTab('store'), onGoStart: () => setTab(effectiveRole === 'child' ? 'start' : 'clock') }) : null, typeof IncomingAlerts === 'function' ? /*#__PURE__*/React.createElement(IncomingAlerts, { personId: personId, isAdmin: isAdmin || isOwner, notifs: notifs, onOpen: () => setShowNotifs(true) }) : null, (typeof ParentCheckIn === 'function' && role === 'child') ? /*#__PURE__*/React.createElement(ParentCheckIn, { personId: personId, name: person && person.name, sessions: sessions, addNotif: addNotif, role: role }) : null, (typeof CheckInReminders === 'function' && role !== 'elder') ? /*#__PURE__*/React.createElement(CheckInReminders, { personId: personId, onGo: () => setTab('health') }) : null, (typeof JournalReminder === 'function') && /*#__PURE__*/React.createElement(JournalReminder, { personId: personId, onGo: function(){ setTab('journal'); } }), isAdmin && /*#__PURE__*/React.createElement(AccountSwitcherRow, {
    family: fam,
    sessions: sessions,
    currentPersonId: personId,
    viewingAs: viewingAs,
    onSwitch: handleSwitch
  }), /*#__PURE__*/React.createElement(ChecklistWidget, {
    personId: effectiveId,
    role: effectiveRole,
    onOpenChecklist: () => setTab('checklists')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '4px 14px 120px'
    }
  }, (tab !== homeNow && typeof BackBar === 'function') && React.createElement(BackBar, { onBack: goBack, onHome: () => { setTab(homeNow); try { window.scrollTo(0, 0); } catch (e) {} }, homeLabel: effectiveRole === 'child' ? 'My Day' : 'Home' }), tab === 'start' && effectiveRole === 'child' && typeof StartMyDay === 'function' && /*#__PURE__*/React.createElement(StartMyDay, {
    personId: effectiveId,
    name: effectivePerson && effectivePerson.name,
    sessions: sessions,
    onSwitchTab: setTab,
    addNotif: addNotif,
    topEl: typeof AttendanceCard === 'function' ? /*#__PURE__*/React.createElement(AttendanceCard, { personId: effectiveId, name: effectivePerson && effectivePerson.name, isAdmin: !viewingAs && (isAdmin || isOwner), sessions: sessions, onUpdate: onUpdate }) : null,
    safetyEl: typeof SafetyCard !== 'undefined' ? /*#__PURE__*/React.createElement(SafetyCard, { personId: effectiveId, name: effectivePerson && effectivePerson.name }) : null,
    dayEl: typeof DayClock === 'function' ? /*#__PURE__*/React.createElement(DayClock, { personId: effectiveId, sessions: sessions, onUpdate: onUpdate, canReset: !!(isAdmin || isOwner), inside: /*#__PURE__*/React.createElement(typeof ClockDepartments === 'function' ? ClockDepartments : ClockPanel, { personId: effectiveId, role: effectiveRole, sessions: sessions, onUpdate: onUpdate, addNotif: addNotif, getPerson: getPerson }) }) : null,
    rightNow: typeof PlanRightNow === 'function' ? /*#__PURE__*/React.createElement(PlanRightNow, { schedHook: schedHook, personId: effectiveId, sessions: sessions, onUpdate: onUpdate }) : null,
    clockEl: null,
    habitsEl: typeof HabitsPanel === 'function' ? /*#__PURE__*/React.createElement(HabitsPanel, { personId: effectiveId, name: effectivePerson && effectivePerson.name, only: 'morning' }) : null,
    habitsAllEl: typeof HabitsPanel === 'function' ? /*#__PURE__*/React.createElement(HabitsPanel, { personId: effectiveId, name: effectivePerson && effectivePerson.name }) : null,
    planEl: typeof SchedulePlan === 'function' ? /*#__PURE__*/React.createElement(SchedulePlan, { schedHook: schedHook, personId: effectiveId, name: effectivePerson && effectivePerson.name, sessions: sessions, onUpdate: onUpdate, addNotif: addNotif }) : null
  }), tab === 'chores' && typeof OrderOfOps === 'function' && /*#__PURE__*/React.createElement(OrderOfOps, { personId: effectiveId, name: effectivePerson && effectivePerson.name, addNotif: addNotif }), tab === 'schedule' && effectiveRole === 'elder' && typeof GrandpaWelcome !== 'undefined' && /*#__PURE__*/React.createElement(GrandpaWelcome, null),
  false, tab === 'calendar' && typeof FamilyCalendar !== 'undefined' && /*#__PURE__*/React.createElement(FamilyCalendar, {personId:effectiveId, isAdmin:isAdmin||isOwner, family:fam}),
  tab === 'free' && typeof FreeTimeCelebration !== 'undefined'
    ? /*#__PURE__*/React.createElement(FreeTimeCelebration, {personId:effectiveId,role:effectiveRole})
    : (tab === 'free' && /*#__PURE__*/React.createElement(FreeTimeView, null)), tab === 'work' && /*#__PURE__*/React.createElement(WorkPanel, {
    role: effectiveRole, isAdmin: isAdmin, isOwner: isOwner,
    personId: effectiveId, sessions: sessions, wallets: wallets,
    reminders: reminders, onSaveRem: onSaveRem, onDelRem: onDelRem,
    syncSet: syncSet, addNotif: addNotif, credit: credit, onSwitchTab: setTab
  }),
  tab === 'va' && effectiveRole === 'parent' && /*#__PURE__*/React.createElement(VAScheduler, null), tab === 'checklists' && /*#__PURE__*/React.createElement(PersonalLists, {
    personId: effectiveId,
    personColor: effectivePerson.color || '#888',
    personEmoji: effectivePerson.emoji || '👤',
    personName: effectivePerson.name || '?',
    currentPersonId: personId,
    isAdmin: isAdmin,
    family: fam
  }), tab === 'school' && effectiveRole !== 'elder' && /*#__PURE__*/React.createElement(HomeschoolModule, { isTeacher: personId === 'laurel', isAdmin: isAdmin, personId: personId, sessions: sessions, onUpdate: onUpdate, effectiveId: effectiveId }), tab === 'consulting' && /*#__PURE__*/React.createElement(MoldingConsultingModule, {
    reminders: reminders,
    onSaveRem: onSaveRem,
    onDelRem: onDelRem,
    updateSetting: updateSetting
  }), tab === 'spiritual' && /*#__PURE__*/React.createElement(JWSpiritualEngine, {
    personId: effectiveId,
    isAdmin: isAdmin || isLaurel,
    isTeacher: isLaurel,
    syncSet: syncSet
  }), tab === 'clock' && /*#__PURE__*/React.createElement("div", null,
  typeof AttendanceCard === 'function' && /*#__PURE__*/React.createElement("div", {style:{padding:'0 14px'}}, /*#__PURE__*/React.createElement(AttendanceCard, { personId: effectiveId, name: effectivePerson && effectivePerson.name, isAdmin: !viewingAs && (isAdmin || isOwner), sessions: sessions, onUpdate: onUpdate })),
  typeof SafetyCard !== 'undefined' && /*#__PURE__*/React.createElement(SafetyCard, { personId: effectiveId, name: (effectivePerson && effectivePerson.name) }),
  React.createElement(Fold, { id: 'operations', title: '🏠 My Bethel Operations' },
    React.createElement('div', {style:{fontSize:12,color:'rgba(255,255,255,.55)',lineHeight:1.5,padding:'2px 4px 8px'}}, 'Routines, schedule, tasks and chores all live here. Every approved piece of work earns points toward the paycheck.'),
    typeof DayClock === 'function' && React.createElement(Fold, { id: 'dayclock', title: '🕐 My Day Clock' }, React.createElement(DayClock, { personId: effectiveId, sessions: sessions, onUpdate: onUpdate, canReset: !!(isAdmin || isOwner), inside: /*#__PURE__*/React.createElement(typeof ClockDepartments === 'function' ? ClockDepartments : ClockPanel, { personId: effectiveId, role: effectiveRole, sessions: sessions, onUpdate: onUpdate, addNotif: addNotif, getPerson: getPerson }) })),
    React.createElement(Fold, { id: 'clockinout', title: '🕐 Clock In / Out — ' + (effectivePerson && effectivePerson.name) },
  typeof MorningRoutine !== 'undefined' && /*#__PURE__*/React.createElement(MorningRoutine, {
    personId: effectiveId,
    isAdmin: isAdmin || isOwner,
    family: fam,
    credit: credit,
    approveCredit: approveCredit,
    wallets: wallets
  }),
  (!(isAdmin || isOwner) && effectiveRole !== 'elder') && React.createElement(Fold, { id: 'kidreq', title: '📝 My requests' }, typeof ScheduleRequestsPanel !== 'undefined' && /*#__PURE__*/React.createElement("div", {style:{margin:'12px 0'}},
    /*#__PURE__*/React.createElement("div", {
      style:{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.4)',letterSpacing:1,marginBottom:6}},
      "MY SCHEDULE REQUESTS"),
    /*#__PURE__*/React.createElement(ScheduleRequestsPanel, {
      personId: effectiveId, isAdmin: false, family: fam,
      notifs: notifs, approveNotif: approveNotif, addNotif: addNotif
    })
  ),
  typeof TimeAdjustRequest !== 'undefined' && /*#__PURE__*/React.createElement(TimeAdjustRequest, {
    personId: effectiveId,
    personName: effectivePerson?.name || personId
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    },
    className: "lbl"
  }, "Today's Sessions"), /*#__PURE__*/React.createElement(TodaySummary, {
    personId: effectiveId,
    sessions: sessions
  })),
    effectiveRole === 'parent' && React.createElement(Fold, { id: 'sched', title: '📅 Today\u2019s Schedule, Tasks & Chores' },
    /*#__PURE__*/React.createElement('div',{style:{padding:'14px 14px 4px'}}, /*#__PURE__*/React.createElement('div',{style:{fontSize:16,fontWeight:900,color:'#fff'}},'📅 Today\u2019s Schedule, Tasks & Chores'), /*#__PURE__*/React.createElement('div',{style:{fontSize:11,color:'rgba(255,255,255,.45)'}},'Everyone\u2019s day in one place')),
    (!isAdmin && !isOwner && typeof SchedulePlan === 'function') ? /*#__PURE__*/React.createElement(SchedulePlan, { schedHook: schedHook, personId: effectiveId, name: effectivePerson && effectivePerson.name, sessions: sessions, onUpdate: onUpdate, addNotif: addNotif }) : schedHook ? /*#__PURE__*/React.createElement(ScheduleEditorView, {
      isAdmin: isAdmin, editMode: schedEditMode,
      setEditMode: setSchedEditMode, schedHook: schedHook
    }) : /*#__PURE__*/React.createElement(ScheduleView, null),
    /*#__PURE__*/React.createElement("div", {style:{marginTop:16}},
      /*#__PURE__*/React.createElement(StandardTasksPanel, {
        personId: effectiveId, isAdmin: isAdmin || isOwner, syncSet: syncSet
      })
    ),
    typeof BethelOpsPanel !== 'undefined' && /*#__PURE__*/React.createElement("div", {style:{marginTop:12}},
      /*#__PURE__*/React.createElement(BethelOpsPanel, {
        personId: effectiveId, isAdmin: isAdmin||isOwner,
        family: fam, credit: credit, addNotif: addNotif
      })
    ),
    !isAdmin && !isOwner && typeof SOPModule !== 'undefined' && /*#__PURE__*/React.createElement("div", {style:{marginTop:12}},
    /*#__PURE__*/React.createElement(SOPModule, {personId:effectiveId, isAdmin:false, family:fam})
  ),
  !isAdmin && !isOwner && typeof ScheduleRequestsPanel !== 'undefined' && /*#__PURE__*/React.createElement("div", {style:{marginTop:12,borderTop:'1px solid rgba(255,255,255,.05)',paddingTop:12}},
      /*#__PURE__*/React.createElement("div", {style:{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.4)',letterSpacing:1,marginBottom:8}}, "MY SCHEDULE REQUESTS"),
      /*#__PURE__*/React.createElement(ScheduleRequestsPanel, {
        personId: effectiveId, isAdmin: false, family: fam,
        notifs: notifs, approveNotif: approveNotif, addNotif: addNotif
      })
    ),
    (isAdmin || isOwner) && /*#__PURE__*/React.createElement("div", {style:{marginTop:8}},
      /*#__PURE__*/React.createElement(TasksTab2, {
        currentPersonId: effectiveId, role: effectiveRole,
        tasks: tasks, todayTasks: todayTasks, pendingApproval: pendingApproval,
        onComplete: completeTask, onClaim: claimTask, onApprove: approveTask,
        onReset: resetTask, onDelete: deleteTask, isAdmin: isAdmin||isOwner,
        payMode: payMode, family: fam, addTask: addTask
      })
    )),
    (isAdmin || isOwner) && typeof PayrollAdmin === 'function' && React.createElement(PayrollAdmin, { family: fam }),
    (isAdmin || isOwner) && typeof VolumeAdmin === 'function' && React.createElement(VolumeAdmin, { family: fam }),
    isOwner && typeof OpsApprovals === 'function' && /*#__PURE__*/React.createElement(OpsApprovals, {family: fam}),
    isOwner && typeof RoutinesAdmin === 'function' && React.createElement(Fold, { id: 'routines', title: '🧹 Set up habits & chores' }, React.createElement(RoutinesAdmin, {family: fam})),
    isOwner && typeof PlanApprovals === 'function' && /*#__PURE__*/React.createElement(PlanApprovals, {family: fam})),
    (isAdmin || isOwner) && typeof Fold === 'function' && React.createElement(Fold, { id: 'adminsettings', title: '⚙️ Admin settings & tools' },
    typeof ScheduleToCalendar === 'function' && React.createElement(ScheduleToCalendar, { family: fam }),
    typeof NotifyRouting === 'function' && React.createElement(NotifyRouting, { family: fam }),
    typeof FamilyFreshStart === 'function' && React.createElement(FamilyFreshStart, { family: fam, sessions: sessions, onUpdate: onUpdate }),
    typeof PciSettings === 'function' && React.createElement(PciSettings, null),
    typeof CheckInSettings === 'function' && React.createElement(CheckInSettings, null),
    typeof PointsSettings === 'function' && React.createElement(PointsSettings, null),
    typeof ReadyTimerSettings === 'function' && React.createElement(ReadyTimerSettings, null)),
  isAdmin && typeof BudgetHomeCard !== 'undefined' && React.createElement(Fold, { id: 'budget', title: '💵 Budget snapshot' }, React.createElement(BudgetHomeCard, {isAdmin: true, onOpen: () => setTab('bills')})),
  isOwner && typeof LiveNow === 'function' && React.createElement(Fold, { id: 'livenow', title: '🔴 Live now' }, React.createElement(LiveNow, {family: fam})),
  typeof SchoolLinks !== 'undefined' && React.createElement(Fold, { id: 'schoollinks', title: '🏫 Google Classroom & school links' }, React.createElement(SchoolLinks, {personId: effectiveId, isAdmin: isOwner, family: fam})),
  typeof WasteReport !== 'undefined' && isAdmin && React.createElement(Fold, { id: 'waste', title: '📉 Time waste report' }, React.createElement(WasteReport, {sessions: sessions, family: fam, wallets: wallets, payMode: payMode}))), tab === 'menu' && (typeof KitchenModule !== 'undefined' ? /*#__PURE__*/React.createElement(KitchenModule, { isAdmin: isAdmin || isOwner, personId: effectiveId, family: fam }) : (typeof WeeklyMenuReview !== 'undefined' && /*#__PURE__*/React.createElement(WeeklyMenuReview, {isAdmin:isAdmin||isOwner}))),
  tab === 'admin' && (isAdmin || isOwner) && typeof MyAccounts !== 'undefined' && typeof Fold === 'function' && React.createElement(Fold, { id: 'adminaccounts', title: '🔗 Accounts' }, React.createElement(MyAccounts, { personId: effectiveId, isAdmin: isAdmin || isOwner, family: fam })),
  tab === 'accounts' && typeof MyAccounts !== 'undefined' && /*#__PURE__*/React.createElement(MyAccounts, { personId: effectiveId, isAdmin: isAdmin || isOwner, family: fam }),
  tab === 'safety' && typeof SafetyCenter !== 'undefined' && /*#__PURE__*/React.createElement(SafetyCenter, { isAdmin: isAdmin || isOwner, family: fam }),
  tab === 'bills' && typeof BillHub !== 'undefined' && /*#__PURE__*/React.createElement(BillHub, { isAdmin: isAdmin || isOwner, isOwner: personId === 'laurel', personId: personId, family: fam }),
  tab === 'store' && typeof BethelStore === 'function' && /*#__PURE__*/React.createElement(BethelStore, { personId: effectiveId, isAdmin: isAdmin || isOwner, family: fam, payMode: payMode, updateSetting: updateSetting, addNotif: addNotif }),
  tab === 'habits' && typeof HabitLeaders === 'function' && React.createElement(HabitLeaders, { personId: effectiveId, isAdmin: !!(isAdmin || isOwner) && !viewingAs, family: fam }),
  typeof HabitTimerBar === 'function' && effectiveId && React.createElement(HabitTimerBar, { personId: effectiveId }),
  tab === 'finplan' && typeof MoneySkills === 'function' && React.createElement(MoneySkills, { personId: effectiveId, isAdmin: !!(isAdmin || isOwner) && !viewingAs, family: fam }),
  tab === 'complab' && typeof CompLab === 'function' && React.createElement(CompLab, { personId: effectiveId, isAdmin: !!(isAdmin || isOwner) && !viewingAs, family: fam }),
  tab === 'money' && typeof MoneyModule !== 'undefined' && (effectiveRole === 'child' && !(isAdmin || isOwner) && typeof KidJob === 'function' ? React.createElement(KidJob, { personId: effectiveId, name: effectivePerson && effectivePerson.name }, /*#__PURE__*/React.createElement(MoneyModule, { personId: effectiveId, isAdmin: false, family: fam, payMode: payMode, settings: settings, updateSetting: updateSetting })) : /*#__PURE__*/React.createElement(MoneyModule, { personId: effectiveId, isAdmin: isAdmin || isOwner, family: fam, payMode: payMode, settings: settings, updateSetting: updateSetting })),
  tab === 'health' && typeof HealthTracker !== 'undefined' && /*#__PURE__*/React.createElement(HealthTracker, {personId: effectiveId, family: fam, isAdmin: isAdmin||isOwner, sessions: sessions, onUpdate: onUpdate}),
  tab === 'journal' && typeof JournalModule !== 'undefined' && /*#__PURE__*/React.createElement(JournalModule, {
    personId: effectiveId,
    personName: effectivePerson?.name || personId,
    personColor: effectivePerson?.color || '#888',
    isAdmin: isAdmin
  }), tab === 'gradebook' && /*#__PURE__*/React.createElement("div", null,
    (isAdmin || isOwner) && typeof TakeAttendance === 'function' && /*#__PURE__*/React.createElement(TakeAttendance, { family: fam }),
    React.createElement(Fold, { id: 'gradesatt', title: '📒 Grades, assignments & attendance report' },
      typeof AssignmentGrades === 'function' && /*#__PURE__*/React.createElement(AssignmentGrades, { personId: effectiveId, isAdmin: isAdmin || isOwner, family: fam, addNotif: addNotif }),
      /*#__PURE__*/React.createElement(GradebookPanel, {personId: effectiveId, isAdmin: isAdmin || isLaurel, day: 1}),
      typeof AttendanceReport !== 'undefined' && /*#__PURE__*/React.createElement("div",{style:{marginTop:16}},
        /*#__PURE__*/React.createElement(AttendanceReport, {family:fam, isAdmin:isAdmin||isOwner, syncSet:syncSet})
      ))
  ),
  tab === 'messages' && /*#__PURE__*/React.createElement(MessengerPanel, {
    personId: effectiveId,
    isAdmin: isAdmin || isLaurel,
    syncSet: syncSet
  }), tab === 'dailytasks' && typeof MyDaySchedule !== 'undefined' && /*#__PURE__*/React.createElement(MyDaySchedule, {
    personId: effectiveId,
    role: effectiveRole,
    credit: credit,
    onSwitchTab: setTab
  }), tab === 'dailytasks' && typeof MyDaySchedule === 'undefined' && /*#__PURE__*/React.createElement(StandardTasksPanel, {
    personId: effectiveId,
    isAdmin: isAdmin || isLaurel,
    syncSet: syncSet
  }), tab === 'tasks' && /*#__PURE__*/React.createElement(TasksTab2, {
    currentPersonId: effectiveId,
    role: effectiveRole,
    tasks: tasks,
    todayTasks: todayTasks,
    pendingApproval: pendingApproval,
    onComplete: completeTask,
    onClaim: claimTask,
    onApprove: isAdmin ? approveTask : null,
    onReset: isAdmin ? resetTask : null,
    onDelete: isAdmin ? deleteTask : null,
    isAdmin: isAdmin,
    payMode: payMode,
    family: fam,
    addTask: isAdmin ? addTask : null
  }), tab === 'earnings' && effectivePerson.inPaySystem && /*#__PURE__*/React.createElement(FinancialDashboard, {
    personId: effectiveId,
    wallet: getWallet(effectiveId),
    payMode: payMode,
    sessions: sessions,
    isAdmin: isAdmin && !viewingAs || isOwner,
    onTransfer: (from, to, amt) => {/* handled internally by useFinances */},
    onUpdateRules: () => {},
    onSetGoal: () => {},
    fin: defaultFinances()
  }), tab === 'board' && /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("div", {style:{textAlign:'center', padding:'10px 4px 14px'}},
      /*#__PURE__*/React.createElement("div", {style:{fontSize:20, fontWeight:900, color:'#fff', letterSpacing:.3}}, "🏠 MyBethelFamilyHome"),
      /*#__PURE__*/React.createElement("div", {style:{fontSize:11, fontWeight:700, color:'rgba(255,255,255,.45)', letterSpacing:2, textTransform:'uppercase', marginTop:2}}, "Argilan Family")
    ),
    /*#__PURE__*/React.createElement("div", {style:{
      display:'grid', gridTemplateColumns:'1fr 1fr', gap:0,
      background:'#0b0b12', border:'1px solid rgba(255,255,255,.08)', borderRadius:14,
      overflow:'hidden', marginBottom:16
    }},
      /*#__PURE__*/React.createElement("div", {style:{padding:'16px 14px', borderRight:'1px solid rgba(255,255,255,.08)'}},
        /*#__PURE__*/React.createElement("div", {style:{fontSize:11, fontWeight:800, color:'#fff', marginBottom:6}}, "1 Corinthians 14:40"),
        /*#__PURE__*/React.createElement("div", {style:{fontSize:11.5, fontWeight:700, color:'#fff', lineHeight:1.5}},
          "But let ", /*#__PURE__*/React.createElement("b", null, "all things"), " take place ", /*#__PURE__*/React.createElement("b", null, "decently and"), " ", /*#__PURE__*/React.createElement("b", null, "by arrangement"), "."
        )
      ),
      /*#__PURE__*/React.createElement("div", {style:{padding:'16px 14px'}},
        /*#__PURE__*/React.createElement("div", {style:{fontSize:11, fontWeight:800, color:'#fff', marginBottom:6}}, "1 Corinthians 12:18"),
        /*#__PURE__*/React.createElement("div", {style:{fontSize:11.5, fontWeight:700, color:'#fff', lineHeight:1.5}},
          "But now God has ", /*#__PURE__*/React.createElement("b", null, "arranged each of the body members just as he pleased"), "."
        )
      )
    ),
    typeof SOPModule !== 'undefined' && /*#__PURE__*/React.createElement("div", {style:{marginBottom:16}},
      /*#__PURE__*/React.createElement(SOPModule, {personId:effectiveId, isAdmin:isAdmin||isOwner, family:fam})
    ),
    typeof PendingInspectionsFeed !== 'undefined' && /*#__PURE__*/React.createElement("div", {style:{marginBottom:16}},
      /*#__PURE__*/React.createElement(PendingInspectionsFeed, {notifs:notifs, family:fam, isAdmin:isAdmin||isOwner})
    ),
    /*#__PURE__*/React.createElement(Leaderboard, {
      sessions: sessions, wallets: wallets, family: fam, payMode: payMode
    }),
    isAdmin && /*#__PURE__*/React.createElement("div", {style:{marginTop:16}},
      /*#__PURE__*/React.createElement(GradebookPanel, {personId: effectiveId, isAdmin: true, day: 1})
    ),
    !isAdmin && effectivePerson && effectivePerson.inPaySystem && /*#__PURE__*/React.createElement("div", {style:{marginTop:16}},
      /*#__PURE__*/React.createElement(GradebookPanel, {personId: effectiveId, isAdmin: false, day: 1})
    ),
    !isAdmin && effectivePerson && effectivePerson.inPaySystem && /*#__PURE__*/React.createElement(FinancialDashboard, {
      personId: effectiveId, wallet: getWallet(effectiveId),
      payMode: payMode, sessions: sessions, isAdmin: false,
      credit: credit, approveCredit: approveCredit, deduct: deduct,
      onTransfer: function(){}, onUpdateRules: function(){}, onSetGoal: function(){},
      fin: typeof defaultFinances === 'function' ? defaultFinances() : {accounts:{},rules:{},history:[]}
    })
  ), tab === 'time' && /*#__PURE__*/React.createElement(TodaySummary, {
    personId: effectiveId,
    sessions: sessions
  }), tab === 'report' && isAdmin && /*#__PURE__*/React.createElement(WasteReport, {
    sessions: sessions,
    family: fam
  }), tab === 'family' && isAdmin && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Family Activity \u2014 Tap Any Person"), /*#__PURE__*/React.createElement(FamilyActivityPanel, {
    sessions: sessions,
    family: fam,
    payMode: payMode,
    wallets: wallets,
    onViewProfile: setProfileId
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(PeopleManager, {
    family: fam,
    savePerson: savePerson,
    deletePerson: deletePerson
  }))), tab === 'admin' && isAdmin && typeof SOPModule !== 'undefined' && /*#__PURE__*/React.createElement("div", {style:{marginTop:12}},
    /*#__PURE__*/React.createElement("div", {style:{display:'flex',alignItems:'center',gap:8,padding:'0 4px 8px'}},
      /*#__PURE__*/React.createElement("div", {style:{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.4)',letterSpacing:1}}, "INSPECTING SOPs FOR:"),
      /*#__PURE__*/React.createElement("select", {
        value: sopInspectPerson || '',
        onChange: e => setSopInspectPerson(e.target.value || null),
        style: {fontSize:10,background:'rgba(255,255,255,.08)',color:'#fff',border:'1px solid rgba(255,255,255,.15)',borderRadius:8,padding:'5px 8px'}
      },
        /*#__PURE__*/React.createElement("option", {value:'', style:{color:'#000'}}, '— choose family member —'),
        (fam||DEFAULT_FAMILY).filter(p=>p.role!=='elder'&&!p.deleted).map(p=>
          /*#__PURE__*/React.createElement("option", {key:p.id, value:p.id, style:{color:'#000'}}, p.emoji+' '+p.name)
        )
      )
    ),
    sopInspectPerson
      ? /*#__PURE__*/React.createElement(SOPModule, {personId:sopInspectPerson, isAdmin:true, family:fam})
      : /*#__PURE__*/React.createElement("div", {style:{padding:14,color:'rgba(255,255,255,.35)',fontSize:11,textAlign:'center'}}, "Pick who you're inspecting above — this shows THEIR steps and awards points to THEM. (Fastest way to approve day-to-day: tap the 🔔 notification bell instead — it lists everyone's pending SOP and chore approvals in one place.)")
  ),
  tab === 'admin' && isAdmin && typeof ScheduleRequestsPanel !== 'undefined' && /*#__PURE__*/React.createElement("div", {
    style:{margin:'16px 0',background:'rgba(255,152,0,.04)',
      border:'1px solid rgba(255,152,0,.15)',borderRadius:14,overflow:'hidden'}},
    /*#__PURE__*/React.createElement("div", {
      style:{padding:'10px 14px',background:'rgba(255,152,0,.06)',
        borderBottom:'1px solid rgba(255,152,0,.12)',
        fontSize:12,fontWeight:900,color:'#FF9800'}},
      "📋 Schedule Requests"),
    /*#__PURE__*/React.createElement(ScheduleRequestsPanel, {
      personId: effectiveId, isAdmin: true, family: fam,
      notifs: notifs, approveNotif: approveNotif, addNotif: addNotif
    })
  ),
  tab === 'admin' && isAdmin && effectiveRole !== 'elder' && typeof AdminJournalViewer !== 'undefined' && /*#__PURE__*/React.createElement("div", {style:{marginTop:20}}, /*#__PURE__*/React.createElement(AdminJournalViewer, {family: fam})), tab === 'admin' && isAdmin && effectiveRole !== 'elder' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AdminControl, {
    sessions: sessions,
    setSessions: setSessions,
    notifs: notifs,
    clearAllNotifs: clearAllNotifs,
    deleteNotif: deleteNotif,
    wallets: wallets,
    resetWallet: resetWallet,
    deduct: deduct,
    adminBonus: adminBonus,
    tasks: tasks,
    todayTasks: todayTasks,
    resetTask: resetTask,
    deleteTask: deleteTask,
    family: fam,
    settings: settings,
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(SyncSetupPanel, null), typeof FamilyAccessPanel === 'function' && /*#__PURE__*/React.createElement(FamilyAccessPanel, null), /*#__PURE__*/React.createElement(PinManager, {
    family: fam,
    pins: pins,
    setPin: setPin,
    isOwner: isOwner
  })), isOwner && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(PermissionsManager, {
    family: fam,
    getPerms: getPerms,
    setPerms: setPerms,
    currentPersonId: personId
  })))), /*#__PURE__*/React.createElement(QuickClockFAB, {
    personId: personId,
    role: role,
    sessions: sessions,
    onUpdate: onUpdate,
    addNotif: addNotif,
    getPerson: getPerson
  }));
}

// ═══ APP ROOT ═════════════════════════════════════════════════════════════════
function App() {
  // Restore timer if app was closed mid-session
  React.useEffect(function() {
    function handleVisibilityChange() {
      if (!document.hidden && db) {
        // Re-read today's sessions from Firebase when app comes to foreground
        db.ref('argilan/sessions/' + todayKey()).once('value', function(snap) {
          var d = snap.val();
          if (d) setSessions(d);
        });
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return function() { document.removeEventListener('visibilitychange', handleVisibilityChange); };
  }, []);

  // On app start: ensure localStorage data is preserved + sync to Firebase
  React.useEffect(function() {
    // 1. Push any local-only data up to Firebase in background
    autoSyncLocalToFirebase();
    // 2. Start checking for new app versions every 60 seconds
    startVersionCheck();
    // 3. Mark current app version in Firebase so all devices can detect updates
    try {
      var v = document.querySelector('meta[name="app-version"]');
      if (v && v.content && db) {
        db.ref('argilan/app_version').set(v.content).catch(function(){});
        localStorage.setItem('_app_version', v.content);
      }
    } catch {}
    // Write current app version to Firebase (using build timestamp embedded at deploy time)
    var deployTs = document.querySelector('meta[name="app-version"]')?.content;
    if (deployTs && db) {
      db.ref('argilan/app_version').once('value', function(snap) {
        var stored = snap.val();
        if (!stored || stored !== deployTs) {
          db.ref('argilan/app_version').set(deployTs);
        }
        localStorage.setItem('_app_version', deployTs);
      });
    }
  }, []);
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState({});
  const [reminders, setReminders] = useState({});
  const {
    family,
    savePerson,
    deletePerson,
    addPerson
  } = usePeople();
  const {
    notifs,
    addNotif,
    markAllRead,
    approveNotif,
    deleteNotif,
    deleteMany,
    toggleSave,
    clearAll: clearAllNotifs,
    unread,
    pending
  } = useNotifications();
  const {
    wallets,
    getWallet,
    credit,
    approveCredit,
    rejectCredit,
    deduct,
    resetWallet,
    setLinked,
    adminBonus
  } = useWalletsV2();
  const {
    tasks,
    todayTasks,
    pendingApproval,
    addTask,
    completeTask,
    approveTask,
    resetTask,
    deleteTask,
    claimTask
  } = useTasksV2();
  const {
    settings,
    updateSetting
  } = useSettings();
  const schedHook = useSchedule();
  const {
    pins,
    setPin,
    checkPin,
    hasPin,
    pinsLoaded
  } = usePins();
  React.useEffect(() => { window._appSetPin = setPin; }, [setPin]);
  React.useEffect(() => { window._addNotifFn = addNotif; }, [addNotif]);
  // Routine / schedule / daily-task check-offs no longer pay instantly: they go to the admin approval inbox
  // (🔔) like tasks and SOPs. Calls with force=true (an admin already approved) pay straight through.
  React.useEffect(() => {
    window._payMode = (settings && settings.payMode) || 'pay';
    window._deductFn = deduct;
    window._walletCredit = function (pid, amt, reason, key) { window._payrollBypass = true; try { return credit(pid, amt, reason, key, true); } finally { window._payrollBypass = false; } };
    window._creditFn = function (pid, amount, reason, key, force) {
      if (force) return credit(pid, amount, reason, key, true);
      const cash = ((settings && settings.payMode) || 'pay') === 'pay';
      const rc = parseFloat(settings && settings.routineCash);
      const amt = cash ? Math.round((amount / 5) * (isNaN(rc) ? 0.25 : rc) * 100) / 100 : amount;
      const dk = new Date().toLocaleDateString('en-CA');
      const safe = String(key || reason || 'x').replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 60);
      const id = 'rt_' + pid + '_' + dk + '_' + safe;
      if (syncGet('notifs/' + id)) return;
      const who = ((enrichedFamily || []).find(p => p.id === pid) || {}).name || pid;
      syncSet('notifs/' + id, { id, type: 'approval', personId: pid, title: 'Check-off: ' + reason, message: who + ' checked this off — ' + (cash ? '$' + amt.toFixed(2) : amt + ' pts') + ' once approved.', timestamp: Date.now(), read: false, approved: null, adminNote: '', requiresApproval: true, routineCredit: { pid, amount: amt, reason, key: key || id } });
    };
  }, [credit, settings && settings.payMode, settings && settings.routineCash]);
  // _currentPersonId set inside Dashboard
  const {
    getPerms,
    setPerms
  } = usePermissions();
  const enrichedFamily = useMemo(() => (family || DEFAULT_FAMILY).map(p => ({
    ...p,
    isOwner: p.id === 'laurel'
  })), [family]);
  useEffect(() => {
    askNotifPerm();
    const u1 = syncOn('sessions/' + todayKey(), d => {
      if (d) setSessions(d);
    });
    const u2 = syncOn('reminders', d => {
      if (d) setReminders(d);
    });
    // Privacy: never stay signed in — everyone enters their PIN each time the app opens
    localStorage.removeItem('last_user');
    return () => {
      u1();
      u2();
    };
  }, []);
  useAlerts(sessions, addNotif);
  useReminders(reminders, addNotif);
  function login(id, role) {
    const u = {
      personId: id,
      role
    };
    setUser(u);
  }
  function logout() {
    setUser(null);
    localStorage.removeItem('last_user');
  }
  function handleComplete(taskId, personId, actualDuration) {
    const t = todayTasks.find(x => x.id === taskId);
    completeTask(taskId, personId);
    if (t && actualDuration) syncSet('tasks/' + todayKey() + '/' + taskId, {
      ...t,
      actualDuration,
      status: 'awaiting_approval',
      completedBy: personId,
      completedAt: Date.now()
    });
    const pName = enrichedFamily.find(p => p.id === personId)?.name || personId;
    if (t) addNotif('approval', personId, 'Task submitted for approval', `${pName} completed "${t.title}"${actualDuration ? ' in ' + fmtDur(actualDuration) : ''} — awaiting admin approval.`, {
      requiresApproval: true,
      taskId
    });
  }
  function handleApprove(taskId, approved, note) {
    approveTask(taskId, approved, note);
    const t = todayTasks.find(x => x.id === taskId);
    const who = t?.completedBy || t?.assignedTo || 'all';
    const pName = enrichedFamily.find(p => p.id === who)?.name || who;
    const amount = (t?.pay || t?.pts || 0);
    if (t && approved && amount > 0 && t.taskType !== 'habit') credit(who, amount, 'Task: ' + t.title, taskId, true);
    addNotif(approved ? 'payment' : 'info', who, approved ? `Task approved${amount ? ' — ' + (settings?.payMode === 'points' ? amount + 'pts' : '$' + amount) + ' earned' : ' — great job!'}` : 'Task flagged', approved ? `Great job ${pName}! "${t?.title}" approved.` : `"${t?.title}" needs to be redone. ${note || ''}`, {
      requiresApproval: false
    });
    playSound(approved ? 'payment' : 'alert');
  }
  if (!user) return /*#__PURE__*/React.createElement(LoginScreen, {
    onLogin: login,
    family: enrichedFamily,
    checkPin: checkPin,
    hasPin: hasPin,
    setPin: setPin,
    pinsLoaded: pinsLoaded
  });
  const {
    personId,
    role
  } = user;
  return /*#__PURE__*/React.createElement(Dashboard, {
    personId: personId,
    role: role,
    sessions: sessions,
    setSessions: setSessions,
    onUpdate: s => setSessions(s),
    onLogout: logout,
    notifs: notifs,
    addNotif: addNotif,
    unread: unread,
    pending: pending,
    approveNotif: approveNotif,
    markAllRead: markAllRead,
    deleteNotif: deleteNotif,
    deleteMany: deleteMany,
    toggleSave: toggleSave,
    clearAllNotifs: clearAllNotifs,
    reminders: reminders,
    onSaveRem: r => setReminders(p => ({
      ...p,
      [r.id]: r
    })),
    onDelRem: id => setReminders(p => {
      const n = {
        ...p
      };
      delete n[id];
      return n;
    }),
    wallets: wallets,
    getWallet: getWallet,
    credit: credit,
    approveCredit: approveCredit,
    rejectCredit: rejectCredit,
    deduct: deduct,
    resetWallet: resetWallet,
    setLinked: setLinked,
    adminBonus: adminBonus,
    tasks: tasks,
    todayTasks: todayTasks,
    pendingApproval: pendingApproval,
    addTask: addTask,
    completeTask: handleComplete,
    approveTask: handleApprove,
    resetTask: resetTask,
    deleteTask: deleteTask,
    claimTask: claimTask,
    family: enrichedFamily,
    savePerson: savePerson,
    deletePerson: deletePerson,
    addPerson: addPerson,
    settings: settings,
    updateSetting: updateSetting,
    pins: pins,
    setPin: setPin,
    checkPin: checkPin,
    hasPin: hasPin,
    getPerms: getPerms,
    setPerms: setPerms,
    schedHook: schedHook,
    wallets: wallets
  });
}
