// ═══ JOURNAL MODULE ═══
// ═══ JOURNAL MODULE — Full keyboard access for all family members ═════════════
const JOURNAL_PROMPTS = ["What was the most meaningful part of today?", "What scripture meant something to me today?", "Something I am thankful to Jehovah for today:", "What did I learn at school or work today?", "How did I show kindness to a family member?", "What goal am I working toward this week?", "Something from the meeting that stood out:", "How did field service go today?", "What is something I want to remember from this week?", "A challenge I faced and how I handled it:"];

// ═══ DAILY AFFIRMATIONS + JOURNAL REMINDER ═══════════════════════════════════
function jDayKey(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function jTodayLabel(){return new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});}
function jPromptForToday(){
  var n=Math.floor(new Date(jDayKey()+'T12:00:00').getTime()/86400000);
  return JOURNAL_PROMPTS[n%JOURNAL_PROMPTS.length];
}
var AFFIRMATION_PROMPTS=["Say something true and kind about who you are in Jehovah\u2019s eyes.","What is one strength Jehovah gave you that you want to use today?","Write a promise you will keep today.","What good thing do you believe about yourself?","Finish this: Today I choose to be\u2026","How will you show love to your family today?","What scripture-based hope will carry you today?","Write something encouraging you would say to a friend \u2014 then say it to yourself.","What are you becoming better at? Say it as if it\u2019s already happening.","What can you thank Jehovah for about yourself?"];
function affPromptForToday(){var n=Math.floor(new Date(jDayKey()+'T12:00:00').getTime()/86400000);return AFFIRMATION_PROMPTS[(n+3)%AFFIRMATION_PROMPTS.length];}
function getAffirmations(pid){
  var v=null;try{v=syncGet('affirmations/'+pid+'/'+jDayKey());}catch(e){}
  if(!v){try{v=JSON.parse(localStorage.getItem('aff_'+pid+'_'+jDayKey())||'null');}catch(e){}}
  return v||{a1:'',a2:''};
}
function getJournalStatus(pid){
  var aff=getAffirmations(pid);
  var affDone=!!(aff.a1&&aff.a1.trim())&&!!(aff.a2&&aff.a2.trim());
  var entries=[];
  try{var fb=syncGet('journals/'+pid);entries=Array.isArray(fb)?fb:JSON.parse(localStorage.getItem('journal_'+pid)||'[]');}catch(e){}
  var label=jTodayLabel();
  var journalDone=entries.some(function(e){return e&&e.date===label;});
  return {affDone:affDone,affAM:!!(aff.a1&&aff.a1.trim()),affPM:!!(aff.a2&&aff.a2.trim()),journalDone:journalDone,aff:aff};
}
var JOURNAL_REMINDER_TIMES=[{h:8,m:0,kind:'morning'},{h:17,m:0,kind:'evening'}];
function JournalReminder(props){
  var pid=props.personId;
  var st=React.useState(null),msg=st[0],setMsg=st[1];
  React.useEffect(function(){
    function check(){
      if(!pid||msg)return;
      var now=new Date();var mins=now.getHours()*60+now.getMinutes();
      var snooze=0;try{snooze=parseInt(localStorage.getItem('jr_snooze_'+pid)||'0',10);}catch(e){}
      if(Date.now()<snooze)return;
      var status=getJournalStatus(pid);
      for(var i=0;i<JOURNAL_REMINDER_TIMES.length;i++){
        var t=JOURNAL_REMINDER_TIMES[i];var at=t.h*60+t.m;
        var key='jr_done_'+pid+'_'+jDayKey()+'_'+t.kind;
        if(mins>=at&&mins<at+180){
          var already=false;try{already=!!localStorage.getItem(key);}catch(e){}
          var needed=t.kind==='morning'?!status.affAM:(!status.affPM||!status.journalDone);
          if(!already&&needed){
            var text=t.kind==='morning'
              ?'Good morning! Write your morning affirmation for today.'
              :(!status.affPM&&!status.journalDone?'Good evening! Write your evening affirmation and journal about today’s prompt.':(!status.affPM?'You still need your evening affirmation for today.':'Don’t forget to journal about today’s prompt.'));
            setMsg({text:text,key:key});
            try{playSound('reminder');}catch(e){}
            try{fireBrowserNotif('Journal & Affirmations',text);}catch(e){}
            try{if(navigator.vibrate)navigator.vibrate([200,100,200]);}catch(e){}
            return;
          }
        }
      }
    }
    check();
    var iv=setInterval(check,30000);
    return function(){clearInterval(iv);};
  },[pid,msg]);
  if(!msg)return null;
  function done(){try{localStorage.setItem(msg.key,'1');}catch(e){}setMsg(null);}
  return React.createElement('div',{style:{position:'fixed',left:0,right:0,top:0,bottom:0,zIndex:9999,background:'rgba(0,0,0,.65)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}},
    React.createElement('div',{style:{background:'#1a1a2e',border:'2px solid #C0CA33',borderRadius:18,padding:20,maxWidth:340,width:'100%',textAlign:'center'}},
      React.createElement('div',{style:{fontSize:40,marginBottom:6}},'📓✨'),
      React.createElement('div',{style:{fontSize:16,fontWeight:900,color:'#C0CA33',marginBottom:6}},'Affirmations & Journal'),
      React.createElement('div',{style:{fontSize:13,color:'#fff',lineHeight:1.6,marginBottom:6}},msg.text),
      React.createElement('div',{style:{fontSize:11,color:'rgba(255,255,255,.55)',marginBottom:14}},'Today’s prompt: '+jPromptForToday()),
      React.createElement('button',{onClick:function(){done();if(props.onGo)props.onGo();},style:{width:'100%',background:'#C0CA33',color:'#000',border:'none',borderRadius:20,padding:12,fontWeight:900,fontSize:13,cursor:'pointer',marginBottom:8}},'✏️ Write now'),
      React.createElement('button',{onClick:function(){try{localStorage.setItem('jr_snooze_'+pid,String(Date.now()+15*60000));}catch(e){}setMsg(null);},style:{background:'transparent',color:'rgba(255,255,255,.6)',border:'1px solid rgba(255,255,255,.2)',borderRadius:20,padding:'8px 16px',fontSize:11,cursor:'pointer'}},'Remind me in 15 min')));
}
function JournalModule({personId,personName,personColor,isAdmin,viewingPersonId}){
  // viewingPersonId: when admin is reviewing someone else's journal
  const targetId = viewingPersonId || personId;
  const isViewingOwn = targetId === personId;
  const targetName = viewingPersonId
    ? (DEFAULT_FAMILY.find(p=>p.id===viewingPersonId)?.name||viewingPersonId)
    : personName;

  const [entries,setEntries]=React.useState(()=>{
    try{
      var fb=syncGet('journals/'+targetId);
      if(fb) return fb;
      return JSON.parse(localStorage.getItem('journal_'+targetId)||'[]');
    }catch{return[];}
  });
  // Subscribe to Firebase for real-time journal sync
  React.useEffect(()=>{
    var unsub=syncOn('journals/'+targetId,function(d){
      if(d&&Array.isArray(d)){setEntries(d);}
      else{
        // Fall back to localStorage
        try{setEntries(JSON.parse(localStorage.getItem('journal_'+targetId)||'[]'));}catch{setEntries([]);}
      }
    });
    return function(){if(unsub)unsub();};
  },[targetId]);

  const [text,setText]=React.useState('');
  const [title,setTitle]=React.useState('');
  const [editing,setEditing]=React.useState(null);
  const [view,setView]=React.useState('write');
  const [prompt,setPrompt]=React.useState(()=>jPromptForToday());
  const [affPrompt,setAffPrompt]=React.useState(()=>affPromptForToday());
  const [aff,setAff]=React.useState(()=>getAffirmations(targetId));
  const [affMsg,setAffMsg]=React.useState('');
  React.useEffect(()=>{
    setAff(getAffirmations(targetId));
    var u=syncOn('affirmations/'+targetId+'/'+jDayKey(),function(d){if(d)setAff({a1:d.a1||'',a2:d.a2||''});});
    return function(){if(u)u();};
  },[targetId]);
  function saveAff(){
    var v={a1:(aff.a1||'').trim(),a2:(aff.a2||'').trim(),ts:Date.now(),date:jTodayLabel()};
    try{localStorage.setItem('aff_'+targetId+'_'+jDayKey(),JSON.stringify(v));}catch(e){}
    try{syncSet('affirmations/'+targetId+'/'+jDayKey(),v);}catch(e){}
    setAffMsg(v.a1&&v.a2?'\u2705 Morning and evening affirmations saved!':(v.a1?'\u2705 Morning affirmation saved \u2014 add your evening one tonight.':'Saved \u2014 write your morning affirmation, then your evening one tonight.'));
  }
  const textRef=React.useRef(null);

  function saveEntry(){
    if(!text.trim()||!isViewingOwn)return;
    if(editing!==null){
      const u=entries.map((e,i)=>i===editing?{...e,text:text.trim(),title:title.trim()||e.title,edited:Date.now()}:e);
      setEntries(u);localStorage.setItem('journal_'+targetId,JSON.stringify(u));try{syncSet('journals/'+targetId,u);}catch(e){}setEditing(null);
    }else{
      const e={id:Date.now(),
        date:new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}),
        time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}),
        title:title.trim()||'Journal Entry',text:text.trim(),prompt};
      const n=[e,...entries];setEntries(n);localStorage.setItem('journal_'+targetId,JSON.stringify(n));try{syncSet('journals/'+targetId,n);}catch(e){}
    }
    setText('');setTitle('');setView('entries');
  }
  function deleteEntry(i){
    if(!window._safeConfirm('Delete this journal entry?'))return;
    const n=entries.filter((_,idx)=>idx!==i);
    setEntries(n);localStorage.setItem('journal_'+targetId,JSON.stringify(n));syncSet('journals/'+targetId,n);
  }
  function startEdit(i){setEditing(i);setTitle(entries[i].title);setText(entries[i].text);setView('write');}

  const TABS=isViewingOwn
    ?[{id:'write',l:'✏️ Write'},{id:'entries',l:'📖 My Journal ('+entries.length+')'}]
    :[];// Admin viewing-only mode has no tabs — just shows entries list

  const iStyle={width:'100%',background:'rgba(255,255,255,.07)',border:'1.5px solid rgba(255,255,255,.12)',
    borderRadius:10,padding:'12px 14px',color:'#fff',fontSize:16,fontFamily:'inherit',
    lineHeight:1.6,WebkitAppearance:'none',appearance:'none',boxSizing:'border-box'};

  // Admin viewing someone else's journal — read-only list
  if(!isViewingOwn){
    return React.createElement('div',{style:{padding:14}},
      React.createElement('div',{style:{background:'rgba(192,202,51,.06)',border:'1px solid rgba(192,202,51,.2)',
        borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:10,color:'rgba(255,255,255,.5)'}},
        React.createElement('div',{style:{color:'#C0CA33',fontWeight:800,marginBottom:4}},'📓 '+targetName+"'s Journal"),
        'This journal is private to '+targetName+'. As Admin you can view and delete entries.',
        React.createElement('br',null),
        React.createElement('strong',{style:{color:'rgba(255,255,255,.6)'}},'Entries cannot be edited by Admin — only the journal owner can edit.')
      ),
      React.createElement('div',{style:{background:'rgba(171,71,188,.08)',border:'1px solid rgba(171,71,188,.3)',borderRadius:10,padding:'8px 12px',marginBottom:12,fontSize:11,color:'#ddd',lineHeight:1.6}},
        React.createElement('div',{style:{fontSize:9,color:'#CE93D8',fontWeight:800,marginBottom:3}},'\u2728 TODAY\'S AFFIRMATIONS'),
        (aff.a1||aff.a2)?[['\u2600\uFE0F Morning',aff.a1],['\uD83C\uDF19 Evening',aff.a2]].filter(function(x){return x[1];}).map((x,i)=>React.createElement('div',{key:i},x[0]+': '+x[1])):React.createElement('div',{style:{color:'rgba(255,255,255,.35)'}},'Not written yet today')),
      entries.length===0
        ? React.createElement('div',{style:{textAlign:'center',padding:'30px 0',color:'rgba(255,255,255,.3)',fontSize:11}},
            '📓 No journal entries yet for '+targetName)
        : entries.map((e,i)=>React.createElement('div',{key:e.id,style:{marginBottom:10,
            background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:12,overflow:'hidden'}},
            React.createElement('div',{style:{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,.05)',
              display:'flex',alignItems:'flex-start',gap:8}},
              React.createElement('div',{style:{flex:1}},
                React.createElement('div',{style:{fontSize:12,fontWeight:800,color:'#fff',marginBottom:1}},e.title),
                React.createElement('div',{style:{fontSize:8,color:'rgba(255,255,255,.3)'}},e.date,' at ',e.time)),
              React.createElement('button',{onClick:()=>deleteEntry(i),
                style:{fontSize:9,padding:'4px 10px',borderRadius:20,
                  background:'rgba(239,83,80,.08)',color:'#EF5350',
                  border:'1px solid rgba(239,83,80,.2)',cursor:'pointer'}},'Delete')
            ),
            React.createElement('div',{style:{padding:'10px 14px',fontSize:12,color:'rgba(255,255,255,.65)',
              lineHeight:1.8,whiteSpace:'pre-wrap'}},e.text)
          ))
    );
  }

  // Own journal — full read/write
  return React.createElement('div',{style:{paddingBottom:80}},
    React.createElement('div',{style:{padding:'12px 14px 8px',background:'rgba(0,0,0,.25)',
      borderBottom:'1px solid rgba(255,255,255,.06)'}},
      React.createElement('div',{style:{fontSize:14,fontWeight:900,color:'#fff',marginBottom:1}},
        '📓 My Journal'),
      React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.25)'}},
        '🔒 Private — your personal journal')
    ),
    /* Tabs */
    React.createElement('div',{style:{display:'flex',background:'rgba(0,0,0,.2)',borderBottom:'1px solid rgba(255,255,255,.06)'}},
      TABS.map(t=>React.createElement('button',{key:t.id,
        onClick:()=>{setView(t.id);if(t.id==='write')setTimeout(()=>textRef.current&&textRef.current.focus(),150);},
        style:{flex:1,padding:'10px 4px',border:'none',background:'transparent',cursor:'pointer',
          color:view===t.id?'#C0CA33':'rgba(255,255,255,.3)',fontSize:10,fontWeight:view===t.id?800:400,
          borderBottom:view===t.id?'2px solid #C0CA33':'2px solid transparent'}},t.l))
    ),
    React.createElement('div',{style:{padding:14}},
      /* WRITE */
      view==='write'&&React.createElement('div',null,
        React.createElement('div',{style:{background:'rgba(171,71,188,.08)',border:'1px solid rgba(171,71,188,.3)',borderRadius:10,padding:'10px 14px',marginBottom:14}},
          React.createElement('div',{style:{fontSize:9,color:'#CE93D8',fontWeight:800,marginBottom:4}},'\u2728 WHAT IS YOUR AFFIRMATION FOR THE DAY? (one in the morning, one in the evening)'),
          React.createElement('div',{style:{display:'flex',gap:8,alignItems:'center',marginBottom:8}},
            React.createElement('div',{style:{flex:1,fontSize:12,color:'#fff',fontStyle:'italic',lineHeight:1.5}},'\u201c'+affPrompt+'\u201d'),
            React.createElement('button',{onClick:()=>setAffPrompt(AFFIRMATION_PROMPTS[Math.floor(Math.random()*AFFIRMATION_PROMPTS.length)]),style:{background:'rgba(171,71,188,.25)',color:'#E1BEE7',border:'1px solid rgba(171,71,188,.5)',borderRadius:20,padding:'5px 10px',fontSize:10,fontWeight:800,cursor:'pointer',flexShrink:0}},'New Prompt')),
          React.createElement('input',{type:'text',value:aff.a1||'',onChange:e=>setAff({...aff,a1:e.target.value}),placeholder:'\u2600\uFE0F Morning affirmation \u2014 e.g. I am loved by Jehovah and my family.',autoCorrect:'on',autoCapitalize:'sentences',style:{...iStyle,fontSize:14,marginBottom:8}}),
          (new Date().getHours()<17&&!aff.a2)?React.createElement('div',{style:{...iStyle,fontSize:13,marginBottom:8,opacity:.5,fontStyle:'italic'}},'\uD83D\uDD12 Evening affirmation opens at 5:00 PM'):React.createElement('input',{type:'text',value:aff.a2||'',onChange:e=>setAff({...aff,a2:e.target.value}),placeholder:'\uD83C\uDF19 Evening affirmation \u2014 how I will end today with Jehovah\u2019s help',autoCorrect:'on',autoCapitalize:'sentences',style:{...iStyle,fontSize:14,marginBottom:8}}),
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8}},
            React.createElement('button',{onClick:saveAff,style:{background:'#AB47BC',color:'#fff',border:'none',borderRadius:20,padding:'7px 14px',fontWeight:800,fontSize:11,cursor:'pointer'}},'Save affirmations'),
            React.createElement('div',{style:{fontSize:10,color:(aff.a1&&aff.a2)?'#4CAF82':'rgba(255,255,255,.4)'}},affMsg||(((aff.a1?1:0)+(aff.a2?1:0))+'/2 written (morning + evening)')))
        ),
        React.createElement('div',{style:{background:'rgba(192,202,51,.06)',border:'1px solid rgba(192,202,51,.2)',
          borderRadius:10,padding:'10px 14px',marginBottom:14}},
          React.createElement('div',{style:{fontSize:9,color:'#C0CA33',fontWeight:800,marginBottom:4}},'💡 TODAY\'S PROMPT'),
          React.createElement('div',{style:{fontSize:13,color:'#ddd',lineHeight:1.7,marginBottom:8}},prompt),
          React.createElement('button',{onClick:()=>setPrompt(JOURNAL_PROMPTS[Math.floor(Math.random()*JOURNAL_PROMPTS.length)]),
            style:{fontSize:8,color:'#C0CA33',background:'transparent',
              border:'1px solid rgba(192,202,51,.3)',borderRadius:20,padding:'3px 10px',cursor:'pointer'}},
            'New Prompt')
        ),
        React.createElement('div',{style:{marginBottom:10}},
          React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.4)',marginBottom:5}},'TITLE (optional)'),
          React.createElement('input',{type:'text',value:title,onChange:e=>setTitle(e.target.value),
            placeholder:'Give this entry a title...',
            autoCorrect:'on',autoCapitalize:'sentences',spellCheck:true,
            style:{...iStyle,fontSize:15,fontWeight:700}})
        ),
        React.createElement('div',{style:{marginBottom:14}},
          React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.4)',marginBottom:5}},'YOUR ENTRY'),
          React.createElement('textarea',{ref:textRef,value:text,onChange:e=>setText(e.target.value),
            placeholder:'Tap here and your keyboard opens. Write freely...',
            autoCorrect:'on',autoCapitalize:'sentences',spellCheck:true,
            style:{...iStyle,minHeight:200,resize:'vertical'}}),
          React.createElement('div',{style:{fontSize:8,color:'rgba(255,255,255,.2)',marginTop:3,textAlign:'right'}},
            text.trim().split(/\s+/).filter(Boolean).length,' words')
        ),
        React.createElement('div',{style:{display:'flex',gap:8}},
          React.createElement('button',{onClick:saveEntry,disabled:!text.trim(),
            style:{flex:1,background:text.trim()?'#C0CA33':'rgba(255,255,255,.06)',
              color:text.trim()?'#000':'#444',border:'none',borderRadius:20,
              padding:'13px',fontWeight:800,fontSize:14,cursor:text.trim()?'pointer':'default'}},
            editing!==null?'💾 Save Changes':'💾 Save Entry'),
          (text.trim()||editing!==null)&&React.createElement('button',{
            onClick:()=>{setText('');setTitle('');setEditing(null);},
            style:{padding:'13px 16px',background:'rgba(239,83,80,.12)',color:'#EF5350',
              border:'1px solid rgba(239,83,80,.25)',borderRadius:20,fontSize:12,cursor:'pointer'}},'Clear')
        )
      ),
      /* ENTRIES */
      view==='entries'&&React.createElement('div',null,
        entries.length===0
          ? React.createElement('div',{style:{textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,.3)'}},
              React.createElement('div',{style:{fontSize:36,marginBottom:10}},'📓'),
              React.createElement('div',{style:{fontSize:13,fontWeight:700,marginBottom:8}},'No entries yet'),
              React.createElement('button',{onClick:()=>setView('write'),
                style:{background:'#C0CA33',color:'#000',border:'none',borderRadius:20,
                  padding:'10px 20px',fontWeight:800,cursor:'pointer',fontSize:13}},'Write First Entry'))
          : entries.map((e,i)=>React.createElement('div',{key:e.id,style:{marginBottom:10,
              background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',
              borderRadius:12,overflow:'hidden'}},
              React.createElement('div',{style:{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,.05)',
                display:'flex',alignItems:'flex-start',gap:8}},
                React.createElement('div',{style:{flex:1}},
                  React.createElement('div',{style:{fontSize:12,fontWeight:800,color:'#fff',marginBottom:1}},e.title),
                  React.createElement('div',{style:{fontSize:8,color:'rgba(255,255,255,.3)'}},
                    e.date,' at ',e.time,e.edited?' · edited':'')),
                React.createElement('div',{style:{display:'flex',gap:5}},
                  React.createElement('button',{onClick:()=>startEdit(i),
                    style:{fontSize:9,padding:'5px 11px',borderRadius:20,
                      background:'rgba(192,202,51,.1)',color:'#C0CA33',
                      border:'1px solid rgba(192,202,51,.25)',cursor:'pointer'}},'Edit'),
                  React.createElement('button',{onClick:()=>deleteEntry(i),
                    style:{fontSize:9,padding:'5px 11px',borderRadius:20,
                      background:'rgba(239,83,80,.08)',color:'#EF5350',
                      border:'1px solid rgba(239,83,80,.2)',cursor:'pointer'}},'Delete'))
              ),
              React.createElement('div',{style:{padding:'10px 14px',fontSize:12,color:'rgba(255,255,255,.65)',
                lineHeight:1.8,whiteSpace:'pre-wrap',maxHeight:150,overflow:'hidden',
                WebkitMaskImage:'linear-gradient(to bottom,black 50%,transparent 100%)'}},e.text),
              React.createElement('button',{onClick:()=>startEdit(i),
                style:{width:'100%',padding:'7px',background:'transparent',border:'none',
                  color:'#C0CA33',fontSize:9,cursor:'pointer'}},'Read & Edit ›')
            ))
      )
    )
  );
}

// ── Admin Journal Viewer — in admin tab lets admin choose any member ───────────
function AdminJournalViewer({family}){
  const fam=(family||DEFAULT_FAMILY).filter(p=>p.id!=='grandpa');
  const [selected,setSelected]=React.useState(null);
  if(selected){
    const person=fam.find(p=>p.id===selected);
    return React.createElement('div',null,
      React.createElement('button',{
        onClick:()=>setSelected(null),
        style:{display:'flex',alignItems:'center',gap:6,background:'transparent',
          border:'1px solid rgba(255,255,255,.1)',borderRadius:20,padding:'6px 12px',
          color:'rgba(255,255,255,.5)',fontSize:10,cursor:'pointer',marginBottom:10}},
        '← Back to journal list'),
      React.createElement(JournalModule,{
        personId:'admin_viewer',
        personName:'Admin',
        personColor:'#888',
        isAdmin:true,
        viewingPersonId:selected
      })
    );
  }
  return React.createElement('div',{style:{padding:14}},
    React.createElement('div',{style:{fontSize:12,fontWeight:800,color:'#fff',marginBottom:4}},
      '📓 Family Journals — Admin View'),
    React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.4)',marginBottom:14}},
      'Family journals — tap a name to read.'),
    fam.map(p=>{
      const entries=[];try{const s=localStorage.getItem('journal_'+p.id);if(s)entries.push(...JSON.parse(s));}catch{}
      return React.createElement('button',{key:p.id,onClick:()=>setSelected(p.id),
        style:{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'11px 14px',
          marginBottom:8,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',
          borderRadius:12,cursor:'pointer',textAlign:'left'}},
        React.createElement('div',{style:{width:36,height:36,borderRadius:'50%',background:p.color,
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}},p.emoji),
        React.createElement('div',{style:{flex:1}},
          React.createElement('div',{style:{fontSize:12,fontWeight:700,color:'#fff'}},p.name),
          React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.35)'}},
            entries.length,' journal '+(entries.length===1?'entry':'entries'))
        ),
        React.createElement('span',{style:{fontSize:14,color:'rgba(255,255,255,.2)'}},'›')
      );
    })
  );
}
// ═══ SCHEDULE & MENU COMPONENTS ═══
// ═══ CHECKABLE SCHEDULE EVENTS + WEEKLY MENU REVIEW ═════════════════════════

// ─── Schedule Event storage key ──────────────────────────────────────────────
function getSchedKey() {
  return 'sched_done_' + new Date().toISOString().split('T')[0];
}

// ─── Editable Schedule Event Block ───────────────────────────────────────────
function ScheduleEventBlock({
  event,
  color,
  onToggleDone,
  onEdit,
  onDelete,
  isDone
}) {
  const [editing, setEditing] = React.useState(false);
  const [editTime, setEditTime] = React.useState(event.time || '');
  const [editLabel, setEditLabel] = React.useState(event.label || event.l || '');
  if (editing) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 8px',
        background: 'rgba(0,0,0,.4)',
        borderRadius: 10,
        marginBottom: 4,
        border: `1.5px solid ${color}`
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "time",
      value: editTime,
      onChange: e => setEditTime(e.target.value),
      style: {
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.2)',
        borderRadius: 6,
        padding: '4px 8px',
        color: '#fff',
        fontSize: 12,
        width: 90
      }
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: editLabel,
      onChange: e => setEditLabel(e.target.value),
      autoCorrect: "on",
      autoCapitalize: "sentences",
      style: {
        flex: 1,
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.2)',
        borderRadius: 6,
        padding: '4px 10px',
        color: '#fff',
        fontSize: 12
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        onEdit({
          ...event,
          time: editTime,
          label: editLabel
        });
        setEditing(false);
      },
      style: {
        background: color,
        color: '#000',
        border: 'none',
        borderRadius: 20,
        padding: '5px 10px',
        fontSize: 10,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, "Save"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setEditing(false),
      style: {
        background: 'transparent',
        color: '#aaa',
        border: '1px solid #333',
        borderRadius: 20,
        padding: '5px 10px',
        fontSize: 10,
        cursor: 'pointer'
      }
    }, "✕"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      marginBottom: 4,
      opacity: isDone ? 0.4 : 1,
      transition: 'opacity .3s'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggleDone,
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      flexShrink: 0,
      border: 'none',
      background: isDone ? color : 'rgba(255,255,255,.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      marginRight: 6,
      transition: 'background .2s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: isDone ? '#000' : 'rgba(255,255,255,.3)'
    }
  }, isDone ? '✓' : '○')), /*#__PURE__*/React.createElement("div", {
    style: {
      background: color,
      borderRadius: 6,
      padding: '4px 8px',
      marginRight: 6,
      flexShrink: 0,
      minWidth: 48,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 800,
      color: '#000',
      letterSpacing: .5
    }
  }, event.time || event.t || '')), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 11,
      color: isDone ? '#555' : '#ddd',
      textDecoration: isDone ? 'line-through' : 'none'
    }
  }, editLabel || event.label || event.l || ''), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(true),
    style: {
      background: 'transparent',
      border: 'none',
      color: 'rgba(255,255,255,.2)',
      fontSize: 14,
      cursor: 'pointer',
      padding: '4px',
      lineHeight: 1
    }
  }, "✏️"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window._safeConfirm('Remove this event?')) onDelete();
    },
    style: {
      background: 'transparent',
      border: 'none',
      color: 'rgba(239,83,80,.3)',
      fontSize: 12,
      cursor: 'pointer',
      padding: '4px',
      lineHeight: 1
    }
  }, "✕"));
}

// ─── Enhanced Daily Schedule View ─────────────────────────────────────────────
function EnhancedDaySchedule({
  events,
  color,
  onEventsChange
}) {
  const storageKey = getSchedKey();
  const [done, setDone] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      return {};
    }
  });
  const [localEvents, setLocalEvents] = React.useState(events || []);
  const [showDone, setShowDone] = React.useState(false);
  const [addMode, setAddMode] = React.useState(false);
  const [newTime, setNewTime] = React.useState('');
  const [newLabel, setNewLabel] = React.useState('');
  function toggleDone(id) {
    const next = {
      ...done,
      [id]: !done[id]
    };
    setDone(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }
  function editEvent(id, updated) {
    const next = localEvents.map(e => e.id === id ? {
      ...e,
      ...updated
    } : e);
    setLocalEvents(next);
    if (onEventsChange) onEventsChange(next);
  }
  function deleteEvent(id) {
    const next = localEvents.filter(e => e.id !== id);
    setLocalEvents(next);
    if (onEventsChange) onEventsChange(next);
  }
  function addEvent() {
    if (!newLabel.trim()) return;
    const newEv = {
      id: 'ev_' + Date.now(),
      time: newTime,
      label: newLabel.trim()
    };
    const next = [...localEvents, newEv].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    setLocalEvents(next);
    if (onEventsChange) onEventsChange(next);
    setNewTime('');
    setNewLabel('');
    setAddMode(false);
  }
  const pending = localEvents.filter(e => !done[e.id]);
  const finished = localEvents.filter(e => !!done[e.id]);
  return /*#__PURE__*/React.createElement("div", null, pending.map(ev => /*#__PURE__*/React.createElement(ScheduleEventBlock, {
    key: ev.id,
    event: ev,
    color: color || '#7986CB',
    isDone: false,
    onToggleDone: () => toggleDone(ev.id),
    onEdit: u => editEvent(ev.id, u),
    onDelete: () => deleteEvent(ev.id)
  })), !addMode ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddMode(true),
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.04)',
      border: '1px dashed rgba(255,255,255,.12)',
      borderRadius: 10,
      padding: '7px',
      color: 'rgba(255,255,255,.3)',
      fontSize: 10,
      cursor: 'pointer',
      marginBottom: 4
    }
  }, "+ Add Event") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginBottom: 6,
      padding: '6px',
      background: 'rgba(0,0,0,.3)',
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: newTime,
    onChange: e => setNewTime(e.target.value),
    style: {
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.15)',
      borderRadius: 6,
      padding: '5px 8px',
      color: '#fff',
      fontSize: 12,
      width: 90
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newLabel,
    onChange: e => setNewLabel(e.target.value),
    placeholder: "Event name...",
    autoCorrect: "on",
    autoCapitalize: "sentences",
    onKeyDown: e => e.key === 'Enter' && addEvent(),
    style: {
      flex: 1,
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.15)',
      borderRadius: 6,
      padding: '5px 10px',
      color: '#fff',
      fontSize: 12
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addEvent,
    style: {
      background: color || '#7986CB',
      color: '#000',
      border: 'none',
      borderRadius: 20,
      padding: '5px 12px',
      fontSize: 10,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, "Add"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddMode(false),
    style: {
      background: 'transparent',
      color: '#aaa',
      border: 'none',
      fontSize: 14,
      cursor: 'pointer'
    }
  }, "✕")), finished.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowDone(p => !p),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 8px',
      background: 'rgba(76,175,82,.06)',
      border: '1px solid rgba(76,175,82,.2)',
      borderRadius: 8,
      cursor: 'pointer',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, "✅"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 10,
      color: '#4CAF82',
      fontWeight: 700,
      textAlign: 'left'
    }
  }, "Finished Today (", finished.length, ")"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#4CAF82'
    }
  }, showDone ? '▾' : '▸')), showDone && finished.map(ev => /*#__PURE__*/React.createElement(ScheduleEventBlock, {
    key: ev.id,
    event: ev,
    color: "#4CAF82",
    isDone: true,
    onToggleDone: () => toggleDone(ev.id),
    onEdit: u => editEvent(ev.id, u),
    onDelete: () => deleteEvent(ev.id)
  }))));
}

// ─── Weekly Menu Review Panel ─────────────────────────────────────────────────
const MEAL_PLAN_DRIVE_ID = '1gbjyGfa1GitlPQn30-YrRezEd23FU-kqdBxs0B2EVtw';
const MEAL_PLAN_DRIVE_URL = `https://docs.google.com/document/d/${MEAL_PLAN_DRIVE_ID}/edit`;
const STORES = [{
  id: 'fl',
  name: 'Food Lion',
  icon: '🦁'
}, {
  id: 'sams',
  name: "Sam's Club",
  icon: '🏢'
}, {
  id: 'pub',
  name: 'Publix',
  icon: '🟢'
}, {
  id: 'wm',
  name: 'Walmart',
  icon: '🔵'
}, {
  id: 'amz',
  name: 'Amazon',
  icon: '📦'
}];
function WeeklyMenuReview({
  isAdmin
}) {
  const weekKey = 'menu_week_' + new Date().toISOString().slice(0, 10).slice(0, 7);
  const [weekMenu, setWeekMenu] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(weekKey) || 'null') || {
        days: [],
        sales: [],
        notes: ''
      };
    } catch {
      return {
        days: [],
        sales: [],
        notes: ''
      };
    }
  });
  const [tab, setTab] = React.useState('menu');
  const [saleItem, setSaleItem] = React.useState('');
  const [saleStore, setSaleStore] = React.useState('fl');
  const [salePrice, setSalePrice] = React.useState('');
  function save(next) {
    setWeekMenu(next);
    localStorage.setItem(weekKey, JSON.stringify(next));
  }
  function addSale() {
    if (!saleItem.trim()) return;
    const next = {
      ...weekMenu,
      sales: [...(weekMenu.sales || []), {
        id: Date.now(),
        item: saleItem.trim(),
        store: saleStore,
        price: salePrice.trim()
      }]
    };
    save(next);
    setSaleItem('');
    setSalePrice('');
  }
  const MENU_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayMenus = weekMenu.days || [];
  function updateDay(i, field, val) {
    const days = [...(weekMenu.days || Array(7).fill(null).map((_, i) => ({
      breakfast: '',
      lunch: '',
      dinner: '',
      snack: ''
    })))];
    if (!days[i]) days[i] = {
      breakfast: '',
      lunch: '',
      dinner: '',
      snack: ''
    };
    days[i] = {
      ...days[i],
      [field]: val
    };
    save({
      ...weekMenu,
      days
    });
  }
  const dayData = MENU_DAYS.map((_, i) => weekMenu.days?.[i] || {
    breakfast: '',
    lunch: '',
    dinner: '',
    snack: ''
  });
  const TABS = [{
    id: 'menu',
    l: '🗓 This Week\'s Menu'
  }, {
    id: 'sales',
    l: '🏷 Sales Flyers'
  }, {
    id: 'drive',
    l: '📄 Drive & Recipes'
  }];
  const iStyle = {
    width: '100%',
    background: 'rgba(255,255,255,.07)',
    border: '1px solid rgba(255,255,255,.1)',
    borderRadius: 8,
    padding: '8px 10px',
    color: '#fff',
    fontSize: 13,
    fontFamily: 'inherit',
    WebkitAppearance: 'none',
    appearance: 'none',
    boxSizing: 'border-box',
    autoCorrect: 'on'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px 8px',
      borderBottom: '1px solid rgba(255,255,255,.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: '#fff',
      marginBottom: 1
    }
  }, "🍽 Weekly Menu"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.3)'
    }
  }, "Review, update, and plan this week's meals")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderBottom: '1px solid rgba(255,255,255,.06)'
    }
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      flex: 1,
      padding: '9px 4px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: tab === t.id ? '#FF9800' : 'rgba(255,255,255,.3)',
      fontSize: 9,
      fontWeight: tab === t.id ? 800 : 400,
      borderBottom: tab === t.id ? '2px solid #FF9800' : '2px solid transparent'
    }
  }, t.l))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14
    }
  }, tab === 'menu' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: MEAL_PLAN_DRIVE_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      flex: 1,
      display: 'block',
      background: 'rgba(26,115,232,.12)',
      border: '1px solid rgba(26,115,232,.3)',
      borderRadius: 10,
      padding: '10px 12px',
      color: '#1A73E8',
      fontSize: 10,
      fontWeight: 700,
      textDecoration: 'none',
      textAlign: 'center'
    }
  }, "📄 Open Full Meal Plan on Google Drive")), MENU_DAYS.map((day, i) => /*#__PURE__*/React.createElement("div", {
    key: day,
    style: {
      marginBottom: 12,
      background: 'rgba(255,255,255,.03)',
      border: '1px solid rgba(255,255,255,.07)',
      borderRadius: 12,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,152,0,.1)',
      padding: '7px 12px',
      borderBottom: '1px solid rgba(255,255,255,.06)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#FF9800'
    }
  }, day)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px',
      display: 'grid',
      gap: 5
    }
  }, ['breakfast', 'lunch', 'dinner', 'snack'].map(meal => /*#__PURE__*/React.createElement("div", {
    key: meal,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)',
      width: 60,
      flexShrink: 0,
      textTransform: 'capitalize'
    }
  }, meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : meal === 'dinner' ? '🌙' : '🍎', " ", meal), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: dayData[i][meal] || '',
    onChange: e => updateDay(i, meal, e.target.value),
    placeholder: `${meal} for ${day}...`,
    autoCorrect: "on",
    autoCapitalize: "words",
    spellCheck: true,
    style: {
      ...iStyle,
      padding: '6px 10px',
      fontSize: 12
    }
  }))))))), tab === 'sales' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,152,0,.06)',
      border: '1px solid rgba(255,152,0,.2)',
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 12,
      fontSize: 10,
      color: 'rgba(255,255,255,.5)'
    }
  }, "📰 Log items on sale this week from your store flyers. Use these to plan your menu above. Check flyers at:\xA0", /*#__PURE__*/React.createElement("a", {
    href: "https://www.foodlion.com/weekly-specials/",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: '#FF9800'
    }
  }, "Food Lion"), " ·\xA0", /*#__PURE__*/React.createElement("a", {
    href: "https://www.samsclub.com/savings",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: '#FF9800'
    }
  }, "Sam's Club"), " ·\xA0", /*#__PURE__*/React.createElement("a", {
    href: "https://www.publix.com/savings/weekly-ad",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: '#FF9800'
    }
  }, "Publix")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.25)',
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#FF9800',
      fontWeight: 800,
      marginBottom: 8
    }
  }, "+ LOG SALE ITEM"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 6,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: saleItem,
    onChange: e => setSaleItem(e.target.value),
    placeholder: "e.g. Chicken Thighs 3lb",
    onKeyDown: e => e.key === 'Enter' && addSale(),
    autoCorrect: "on",
    autoCapitalize: "words",
    style: {
      ...iStyle,
      fontSize: 13
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: salePrice,
    onChange: e => setSalePrice(e.target.value),
    placeholder: "$0.00",
    onKeyDown: e => e.key === 'Enter' && addSale(),
    style: {
      ...iStyle,
      width: 70,
      textAlign: 'center',
      fontSize: 13
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginBottom: 8
    }
  }, STORES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setSaleStore(s.id),
    style: {
      flex: 1,
      padding: '5px 4px',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      fontSize: 9,
      fontWeight: 700,
      background: saleStore === s.id ? 'rgba(255,152,0,.25)' : 'rgba(255,255,255,.05)',
      color: saleStore === s.id ? '#FF9800' : '#555'
    }
  }, s.icon, " ", s.name.split(' ')[0]))), /*#__PURE__*/React.createElement("button", {
    onClick: addSale,
    disabled: !saleItem.trim(),
    style: {
      width: '100%',
      background: saleItem.trim() ? '#FF9800' : 'rgba(255,255,255,.06)',
      color: saleItem.trim() ? '#000' : '#444',
      border: 'none',
      borderRadius: 20,
      padding: '10px',
      fontWeight: 800,
      fontSize: 13,
      cursor: saleItem.trim() ? 'pointer' : 'default'
    }
  }, "Save Sale Item")), (weekMenu.sales || []).length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: 'rgba(255,255,255,.3)',
      padding: '20px 0',
      fontSize: 11
    }
  }, "No sale items logged yet") : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#FF9800',
      fontWeight: 800,
      marginBottom: 6
    }
  }, "THIS WEEK'S DEALS (", (weekMenu.sales || []).length, ")"), (weekMenu.sales || []).map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 10px',
      marginBottom: 5,
      background: 'rgba(255,255,255,.03)',
      border: '1px solid rgba(255,255,255,.06)',
      borderRadius: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, STORES.find(st => st.id === s.store)?.icon || '🏪'), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#fff'
    }
  }, s.item), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: 'rgba(255,255,255,.35)'
    }
  }, STORES.find(st => st.id === s.store)?.name || s.store)), s.price && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#4CAF82'
    }
  }, s.price), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const next = {
        ...weekMenu,
        sales: weekMenu.sales.filter((_, j) => j !== i)
      };
      save(next);
    },
    style: {
      background: 'transparent',
      border: 'none',
      color: 'rgba(239,83,80,.4)',
      fontSize: 14,
      cursor: 'pointer',
      padding: '2px'
    }
  }, "✕"))))), tab === 'drive' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: MEAL_PLAN_DRIVE_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'block',
      background: 'rgba(26,115,232,.1)',
      border: '1px solid rgba(26,115,232,.3)',
      borderRadius: 12,
      padding: '14px',
      color: '#1A73E8',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      marginBottom: 4
    }
  }, "📄"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800
    }
  }, "Two-Week Family Meal Plan"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)',
      marginTop: 2
    }
  }, "Open, edit, or update the full recipe collection on Google Drive"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://drive.google.com",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'block',
      background: 'rgba(255,255,255,.03)',
      border: '1px solid rgba(255,255,255,.07)',
      borderRadius: 12,
      padding: '12px',
      color: '#4CAF82',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800
    }
  }, "🗂 Open Google Drive"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.3)',
      marginTop: 2
    }
  }, "Access all family documents, recipes, and school materials"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)',
      marginBottom: 8,
      fontWeight: 700
    }
  }, "QUICK LINKS"), [['🛒 Food Lion Weekly Ad', 'https://www.foodlion.com/weekly-specials/'], ['🏢 Sam\'s Club Savings', 'https://www.samsclub.com/savings'], ['🟢 Publix Weekly Ad', 'https://www.publix.com/savings/weekly-ad'], ['🔵 Walmart Deals', 'https://www.walmart.com/store/weeklyads']].map(([label, url]) => /*#__PURE__*/React.createElement("a", {
    key: url,
    href: url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'block',
      padding: '9px 12px',
      marginBottom: 5,
      background: 'rgba(255,255,255,.03)',
      border: '1px solid rgba(255,255,255,.06)',
      borderRadius: 9,
      color: '#FF9800',
      textDecoration: 'none',
      fontSize: 11,
      fontWeight: 600
    }
  }, label, " ›"))))));
}


// ═══ MY DAY SCHEDULE ═══
// ═══ MY DAY — Checkable Schedule + Points + Field Service Flip ════════════════

// Global credit accessor — set by Dashboard on mount
// usage: window._creditFn(personId, amount, reason)
window._creditFn = window._creditFn || null;

// ─── Day's pre-built time blocks by role ─────────────────────────────────────
function buildDayBlocks(role, isFieldService, dayName) {
  const isChild = role === 'child';
  const isFri = dayName === 'friday';
  const isThu = dayName === 'thursday'; // meeting night

  if (isFieldService) {
    // Field service schedule — school moves to EVENING
    return [{
      id: 'fs_wake',
      time: '7:30 AM',
      label: 'Wake up — get dressed right away',
      pts: 5,
      color: '#7986CB'
    }, {
      id: 'fs_bfast',
      time: '8:00 AM',
      label: 'Quick breakfast together',
      pts: 5,
      color: '#FF9800'
    }, {
      id: 'fs_depart',
      time: '8:30 AM',
      label: '🚗 Depart for territory',
      pts: 10,
      color: '#4CAF82'
    }, {
      id: 'fs_serve',
      time: '9:00 AM',
      label: '🌱 Field service begins',
      pts: 20,
      color: '#4CAF82'
    }, {
      id: 'fs_return',
      time: '12:00 PM',
      label: 'Return home · Lunch',
      pts: 5,
      color: '#FF9800'
    }, {
      id: 'fs_rest',
      time: '1:00 PM',
      label: 'Rest · debrief · hydrate',
      pts: 5,
      color: '#9E69AF'
    }, {
      id: 'fs_online',
      time: '2:00 PM',
      label: '💻 Online school — 2 hours',
      pts: 15,
      color: '#039BE5'
    }, {
      id: 'fs_bible',
      time: '4:00 PM',
      label: '📖 Bible study',
      pts: 10,
      color: '#7986CB'
    }, {
      id: 'fs_school',
      time: '4:45 PM',
      label: '📚 Core subject — simplified',
      pts: 10,
      color: '#F4511E'
    }, {
      id: 'fs_close',
      time: '5:30 PM',
      label: 'Closing prayer · Day review',
      pts: 5,
      color: '#7986CB'
    }];
  }

  // Regular school day
  const morning = [{
    id: 'wake',
    time: '7:00 AM',
    label: 'Wake up · prayer · make bed',
    pts: 5,
    color: '#9E69AF'
  }, {
    id: 'dress',
    time: '7:15 AM',
    label: 'Get dressed · brush teeth · hygiene',
    pts: 5,
    color: '#9E69AF'
  }, {
    id: 'bfast',
    time: '7:30 AM',
    label: 'Breakfast · hydration',
    pts: 5,
    color: '#FF9800'
  }, {
    id: 'open',
    time: '9:00 AM',
    label: '🎵 Opening — song · prayer · Bible text',
    pts: 5,
    color: '#7986CB'
  }, {
    id: 'bible',
    time: '9:10 AM',
    label: '📖 Bible Study — 35 min',
    pts: 10,
    color: '#7986CB'
  }, {
    id: 'lang',
    time: '9:45 AM',
    label: isFri ? '📚 Language Arts — essay writing day (35 min)' : '📚 Language Arts — 25 min reading + 10 min activity',
    pts: 10,
    color: '#F4511E'
  }, {
    id: 'math',
    time: '10:30 AM',
    label: isFri ? '➕ Math — word problems + worksheet (40 min)' : '➕ Math — 20 min lesson + 10 min practice',
    pts: 10,
    color: '#1A73E8'
  }];

  // Rotating afternoon by day
  const afternoonByDay = {
    monday: [{
      id: 'sci',
      time: '11:15 AM',
      label: '🔬 Science / Kitchen',
      pts: 10,
      color: '#4CAF82'
    }, {
      id: 'snack',
      time: '12:00 PM',
      label: 'Snack break · hydrate',
      pts: 3,
      color: '#FF9800'
    }],
    tuesday: [{
      id: 'hist',
      time: '11:15 AM',
      label: '🌍 History — 30 min',
      pts: 10,
      color: '#FF9800'
    }, {
      id: 'sci2',
      time: '11:50 AM',
      label: '🔬 Science reading',
      pts: 5,
      color: '#4CAF82'
    }],
    wednesday: [{
      id: 'comp',
      time: '11:15 AM',
      label: '✏️ Composition — one paragraph only',
      pts: 8,
      color: '#C0CA33'
    }, {
      id: 'rev',
      time: '11:45 AM',
      label: 'Review + art activity',
      pts: 5,
      color: '#9E69AF'
    }],
    thursday: [{
      id: 'sci3',
      time: '11:15 AM',
      label: '🔬 Science — short activity',
      pts: 8,
      color: '#4CAF82'
    }, {
      id: 'mtg',
      time: '11:45 AM',
      label: '📒 Meeting prep — mark answers',
      pts: 10,
      color: '#7986CB'
    }],
    friday: [{
      id: 'essay',
      time: '11:20 AM',
      label: '✏️ Weekly essay or project (25 min)',
      pts: 12,
      color: '#C0CA33'
    }, {
      id: 'art',
      time: '11:50 AM',
      label: '🎨 Weekly art project',
      pts: 8,
      color: '#9E69AF'
    }]
  };
  const afternoon = afternoonByDay[dayName] || afternoonByDay.monday;
  const midday = [{
    id: 'lunch',
    time: '12:00 PM',
    label: '☀️ Lunch · cleanup',
    pts: 5,
    color: '#FF9800'
  }, {
    id: 'exer',
    time: '12:30 PM',
    label: '🏃 Exercise / movement — 20 min',
    pts: 8,
    color: '#4CAF82'
  }, {
    id: 'online',
    time: '1:00 PM',
    label: '💻 Online school — 2 hours',
    pts: 15,
    color: '#039BE5'
  }, {
    id: 'hist2',
    time: '3:00 PM',
    label: '🌍 History / Composition — 25 min',
    pts: 8,
    color: '#FF9800'
  }];
  const closing = isThu ? [{
    id: 'close',
    time: '3:30 PM',
    label: 'Closing prayer · school done',
    pts: 5,
    color: '#7986CB'
  }, {
    id: 'mtgprep',
    time: '4:00 PM',
    label: '🏛 Meeting prep — get dressed · leave by 5:30',
    pts: 10,
    color: '#7986CB'
  }] : [{
    id: 'close',
    time: '3:30 PM',
    label: 'Closing prayer · school done',
    pts: 5,
    color: '#7986CB'
  }, {
    id: 'free',
    time: '3:45 PM',
    label: '⬜ Free time / chores',
    pts: 3,
    color: '#555'
  }];
  return [...morning, ...afternoon, ...midday, ...closing];
}

// ─── Checkable Day Block ──────────────────────────────────────────────────────
function DayBlock({
  block,
  done,
  onCheck,
  onEdit,
  onDelete,
  personId
}) {
  const [editing, setEditing] = React.useState(false);
  const [eTime, setETime] = React.useState(block.time);
  const [eLabel, setELabel] = React.useState(block.label);
  const col = block.color || '#7986CB';
  if (editing) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5,
        padding: '7px',
        marginBottom: 4,
        background: 'rgba(0,0,0,.4)',
        borderRadius: 10,
        border: `1.5px solid ${col}`
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "time",
      value: eTime.replace(' AM', '').replace(' PM', ''),
      onChange: e => {
        const [h, m] = e.target.value.split(':');
        const hr = parseInt(h);
        setETime(`${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`);
      },
      style: {
        width: 90,
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.2)',
        borderRadius: 6,
        padding: '5px 8px',
        color: '#fff',
        fontSize: 12
      }
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: eLabel,
      onChange: e => setELabel(e.target.value),
      autoCorrect: "on",
      autoCapitalize: "sentences",
      style: {
        flex: 1,
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.2)',
        borderRadius: 6,
        padding: '5px 10px',
        color: '#fff',
        fontSize: 12
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        onEdit({
          ...block,
          time: eTime,
          label: eLabel
        });
        setEditing(false);
      },
      style: {
        background: col,
        color: '#000',
        border: 'none',
        borderRadius: 20,
        padding: '5px 10px',
        fontSize: 10,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, "✓"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setEditing(false),
      style: {
        background: 'rgba(255,255,255,.06)',
        color: '#aaa',
        border: 'none',
        borderRadius: 20,
        padding: '5px 9px',
        fontSize: 10,
        cursor: 'pointer'
      }
    }, "✕"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
      opacity: done ? 0.35 : 1,
      transition: 'all .3s'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCheck,
    style: {
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: 9,
      border: 'none',
      cursor: 'pointer',
      background: done ? col : 'rgba(255,255,255,.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: done ? `0 0 8px ${col}55` : 'none',
      transition: 'all .2s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: done ? 14 : 13,
      color: done ? '#000' : 'rgba(255,255,255,.25)',
      fontWeight: 900
    }
  }, done ? '✓' : '○')), /*#__PURE__*/React.createElement("div", {
    style: {
      background: col,
      borderRadius: 6,
      padding: '3px 7px',
      flexShrink: 0,
      minWidth: 52,
      textAlign: 'center',
      opacity: done ? .5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 8,
      fontWeight: 800,
      color: '#000',
      letterSpacing: .3,
      textDecoration: done ? 'line-through' : 'none'
    }
  }, block.time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 10,
      color: done ? '#444' : '#ddd',
      lineHeight: 1.3,
      textDecoration: done ? 'line-through' : 'none'
    }
  }, block.label), !done && block.pts && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#C0CA33',
      fontWeight: 700,
      background: 'rgba(192,202,51,.08)',
      borderRadius: 20,
      padding: '2px 6px',
      flexShrink: 0
    }
  }, "+", block.pts, "pts"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(true),
    style: {
      background: 'transparent',
      border: 'none',
      color: 'rgba(255,255,255,.15)',
      fontSize: 12,
      cursor: 'pointer',
      padding: '2px',
      lineHeight: 1,
      flexShrink: 0
    }
  }, "✏️"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window._safeConfirm('Remove this block?')) onDelete();
    },
    style: {
      background: 'transparent',
      border: 'none',
      color: 'rgba(239,83,80,.2)',
      fontSize: 11,
      cursor: 'pointer',
      padding: '2px',
      lineHeight: 1,
      flexShrink: 0
    }
  }, "✕"));
}

// ─── My Day Full Component ────────────────────────────────────────────────────
function MyDaySchedule({
  personId,
  role,
  credit,
  onSwitchTab
}) {
  const today = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[today.getDay()];
  const dateKey = today.toISOString().split('T')[0];
  const storeKey = `myday_blocks_${personId}_${dateKey}`;
  const doneKey = `myday_done_${personId}_${dateKey}`;
  const isFS = typeof _fsMode !== 'undefined' ? _fsMode : false;
  const [blocks, setBlocks] = React.useState(() => {
    try {
      const s = localStorage.getItem(storeKey);
      return s ? JSON.parse(s) : buildDayBlocks(role, isFS, dayName);
    } catch {
      return buildDayBlocks(role, isFS, dayName);
    }
  });
  const [done, setDone] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(doneKey) || '{}');
    } catch {
      return {};
    }
  });
  const [showDone, setShowDone] = React.useState(false);
  const [addMode, setAddMode] = React.useState(false);
  const [newTime, setNewTime] = React.useState('');
  const [newLabel, setNewLabel] = React.useState('');
  const [newPts, setNewPts] = React.useState(5);
  const [totalEarned, setTotalEarned] = React.useState(() => {
    try {
      return parseInt(localStorage.getItem(`myday_pts_${personId}_${dateKey}`) || '0');
    } catch {
      return 0;
    }
  });
  function saveBlocks(b) {
    setBlocks(b);
    localStorage.setItem(storeKey, JSON.stringify(b));
  }
  function checkBlock(id) {
    const block = blocks.find(b => b.id === id);
    const wasDone = !!done[id];
    const next = {
      ...done,
      [id]: !wasDone
    };
    setDone(next);
    localStorage.setItem(doneKey, JSON.stringify(next));
    if (!wasDone && block?.pts) {
      // Award points
      const pts = block.pts;
      if (window._creditFn) window._creditFn(personId, pts, '✅ ' + block.label, 'myday_' + id);
      const newTotal = totalEarned + pts;
      setTotalEarned(newTotal);
      localStorage.setItem(`myday_pts_${personId}_${dateKey}`, String(newTotal));
    }
  }
  function editBlock(id, updated) {
    saveBlocks(blocks.map(b => b.id === id ? {
      ...b,
      ...updated
    } : b));
  }
  function deleteBlock(id) {
    saveBlocks(blocks.filter(b => b.id !== id));
  }
  function addBlock() {
    if (!newLabel.trim()) return;
    const b = {
      id: 'custom_' + Date.now(),
      time: newTime || '—',
      label: newLabel.trim(),
      pts: newPts || 5,
      color: '#7986CB'
    };
    const next = [...blocks, b].sort((a, z) => (a.time || '').localeCompare(z.time || ''));
    saveBlocks(next);
    setNewTime('');
    setNewLabel('');
    setNewPts(5);
    setAddMode(false);
  }
  const pending = blocks.filter(b => !done[b.id]);
  const finished = blocks.filter(b => !!done[b.id]);
  const pct = blocks.length ? Math.round(finished.length / blocks.length * 100) : 0;
  const dayLabel = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px 10px',
      background: isFS ? 'rgba(76,175,82,.08)' : 'rgba(0,0,0,.2)',
      borderBottom: '1px solid rgba(255,255,255,.06)'
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
      fontSize: 14,
      fontWeight: 900,
      color: '#fff'
    }
  }, isFS ? '🌱 Field Service Day' : '📋 My Day', " — ", dayLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.3)'
    }
  }, today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }), isFS ? ' · School moves to evening' : ' · Regular school schedule')), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSwitchTab && onSwitchTab('messages'),
    style: {
      padding: '8px 12px',
      background: 'rgba(26,115,232,.15)',
      border: '1px solid rgba(26,115,232,.3)',
      borderRadius: 20,
      color: '#1A73E8',
      fontSize: 10,
      fontWeight: 700,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, "💬 Message")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: 'rgba(255,255,255,.06)',
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${pct}%`,
      borderRadius: 3,
      background: pct === 100 ? '#4CAF82' : '#C0CA33',
      transition: 'width .4s'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: pct === 100 ? '#4CAF82' : 'rgba(255,255,255,.3)'
    }
  }, pct === 100 ? '✅ Day complete!' : `${finished.length}/${blocks.length} done · ${pct}%`), totalEarned > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      fontWeight: 700,
      background: 'rgba(192,202,51,.1)',
      borderRadius: 20,
      padding: '2px 8px',
      marginLeft: 'auto'
    }
  }, "⭐ ", totalEarned, " pts earned today"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 12px'
    }
  }, pending.map(b => /*#__PURE__*/React.createElement(DayBlock, {
    key: b.id,
    block: b,
    done: false,
    personId: personId,
    onCheck: () => checkBlock(b.id),
    onEdit: u => editBlock(b.id, u),
    onDelete: () => deleteBlock(b.id)
  })), !addMode ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddMode(true),
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.03)',
      border: '1px dashed rgba(255,255,255,.1)',
      borderRadius: 10,
      padding: '8px',
      color: 'rgba(255,255,255,.25)',
      fontSize: 10,
      cursor: 'pointer',
      marginBottom: 6
    }
  }, "+ Add time block") : /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.3)',
      borderRadius: 10,
      padding: '10px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto auto',
      gap: 5,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: newTime,
    onChange: e => {
      const [h, m] = e.target.value.split(':');
      const hr = parseInt(h);
      setNewTime(`${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`);
    },
    style: {
      background: 'rgba(255,255,255,.07)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '6px',
      color: '#fff',
      fontSize: 12
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newLabel,
    onChange: e => setNewLabel(e.target.value),
    onKeyDown: e => e.key === 'Enter' && addBlock(),
    placeholder: "What's on the schedule?",
    autoCorrect: "on",
    autoCapitalize: "sentences",
    style: {
      background: 'rgba(255,255,255,.07)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '6px 10px',
      color: '#fff',
      fontSize: 12
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newPts,
    onChange: e => setNewPts(+e.target.value),
    min: 1,
    max: 50,
    inputMode: "numeric",
    style: {
      width: 48,
      background: 'rgba(255,255,255,.07)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 6,
      padding: '6px',
      color: '#C0CA33',
      fontSize: 12,
      textAlign: 'center'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addBlock,
    style: {
      background: '#C0CA33',
      color: '#000',
      border: 'none',
      borderRadius: 20,
      padding: '6px 12px',
      fontSize: 10,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, "+")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: 'rgba(255,255,255,.2)',
      textAlign: 'right'
    }
  }, "pts = points earned on completion"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddMode(false),
    style: {
      background: 'transparent',
      color: '#555',
      border: 'none',
      fontSize: 9,
      cursor: 'pointer',
      marginTop: 2
    }
  }, "Cancel")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window._safeConfirm('Reset to the default schedule for today?')) {
        const fresh = buildDayBlocks(role, isFS, dayName);
        saveBlocks(fresh);
        setDone({});
        localStorage.removeItem(doneKey);
      }
    },
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.02)',
      border: '1px solid rgba(255,255,255,.05)',
      borderRadius: 8,
      padding: '6px',
      color: 'rgba(255,255,255,.2)',
      fontSize: 8,
      cursor: 'pointer',
      marginBottom: 10
    }
  }, "↺ Reset to today's default schedule"), finished.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowDone(p => !p),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '9px 12px',
      background: 'rgba(76,175,82,.07)',
      border: '1px solid rgba(76,175,82,.25)',
      borderRadius: 10,
      cursor: 'pointer',
      marginBottom: showDone ? 0 : 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "✅"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#4CAF82'
    }
  }, "Finished Today — ", finished.length, " item", finished.length !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: 'rgba(76,175,130,.5)'
    }
  }, "⭐ ", totalEarned, " pts earned · tap to view")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#4CAF82'
    }
  }, showDone ? '▾' : '▸')), showDone && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.2)',
      borderRadius: '0 0 10px 10px',
      border: '1px solid rgba(76,175,82,.15)',
      borderTop: 'none',
      padding: '8px 10px',
      marginBottom: 10
    }
  }, finished.map(b => /*#__PURE__*/React.createElement(DayBlock, {
    key: b.id,
    block: b,
    done: true,
    personId: personId,
    onCheck: () => checkBlock(b.id),
    onEdit: u => editBlock(b.id, u),
    onDelete: () => deleteBlock(b.id)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(158,105,175,.06)',
      border: '1px solid rgba(158,105,175,.15)',
      borderRadius: 10,
      padding: '9px 12px',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#9E69AF',
      fontWeight: 700,
      marginBottom: 3
    }
  }, "💜 Focus Tip for Today"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'rgba(255,255,255,.4)',
      lineHeight: 1.7
    }
  }, isFS ? 'Field service day — school is in the evening. Do your best in the ministry first. Jehovah sees your effort. 🌱' : dayName === 'friday' ? 'Friday is our writing and project day — take your time, one paragraph at a time. You can do this! ✏️' : 'Work on one block at a time. Check it off. Celebrate each ✓. You\'re doing great! ⭐'))));
}



// ─── Grandpa schedule placeholder ────────────────────────────────────────────
function GrandpaWelcome(){
  return React.createElement('div',{style:{padding:30,textAlign:'center',color:'rgba(255,255,255,.4)'}},
    React.createElement('div',{style:{fontSize:56,marginBottom:14}},'👴'),
    React.createElement('div',{style:{fontSize:18,fontWeight:800,color:'#fff',marginBottom:8}},
      'Welcome, Grandpa!'),
    React.createElement('div',{style:{fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.8,
      maxWidth:280,margin:'0 auto',marginBottom:20}},
      'Your personal section is coming soon.',
      React.createElement('br',null),
      'Use the tabs above to access Spiritual content, Messages, and Family updates.'),
    React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.2)'}},
      'MyBethelFamilyHome · Eric Argilan Sr.')
  );
}

// ─── Free Time Celebration ───────────────────────────────────────────────────
var FREE_ACTIVITIES=[
  {icon:'🎳',label:'Bowling',       desc:'Hit the lanes! Strike it up as a family.',     color:'#1A73E8'},
  {icon:'🥏',label:'Disc Golf',     desc:'Fresh air and friendly competition on the course.',color:'#4CAF82'},
  {icon:'🎨',label:'Arts & Crafts', desc:'Paint, draw, do origami — anything creative!', color:'#9E69AF'},
  {icon:'🎮',label:'Video Games',   desc:'Game time! You earned it. Pick your favorite.', color:'#039BE5'},
  {icon:'📚',label:'Free Reading',  desc:'Comics, adventure novels, whatever you love.',  color:'#FF9800'},
  {icon:'🧁',label:'Bake a Treat',  desc:'Pick a recipe and make something delicious.',   color:'#F48FB1'},
  {icon:'🎵',label:'Music & Dance', desc:'Play music, sing, or just dance around.',       color:'#C0CA33'},
  {icon:'🏃',label:'Outside Play',  desc:'Ride bikes, play catch, explore outside.',      color:'#4CAF82'},
  {icon:'🧩',label:'Board Games',   desc:'Break out a board game — challenge the family.',color:'#7986CB'},
  {icon:'🌿',label:'Nature Walk',   desc:"Explore Jehovah's creation — plants, bugs, birds.", color:'#4CAF82'},
];

function FreeTimeCelebration({personId,role}){
  const [picked,setPicked]=React.useState(null);
  const today=new Date().toISOString().split('T')[0];
  const storeKey='freetime_'+personId+'_'+today;
  const [done,setDone]=React.useState(()=>{
    try{return JSON.parse(localStorage.getItem(storeKey)||'[]');}catch{return[];}
  });
  function logIt(a){
    const n=[...done,{label:a.label,icon:a.icon,ts:Date.now()}];
    setDone(n);localStorage.setItem(storeKey,JSON.stringify(n));
    if(window._creditFn&&window._currentPersonId)
      window._creditFn(window._currentPersonId,3,'Free time: '+a.label,'ft_'+Date.now());
    setPicked(null);
  }
  return React.createElement('div',{style:{paddingBottom:60}},
    React.createElement('div',{style:{
      background:'linear-gradient(135deg,rgba(192,202,51,.12),rgba(158,105,175,.12))',
      border:'1px solid rgba(192,202,51,.25)',borderRadius:14,padding:'20px 16px',
      margin:14,textAlign:'center'}},
      React.createElement('div',{style:{fontSize:42,marginBottom:10}},'🎉'),
      React.createElement('div',{style:{fontSize:20,fontWeight:900,color:'#C0CA33',marginBottom:6}},
        'Free Time!'),
      React.createElement('div',{style:{fontSize:11,color:'rgba(255,255,255,.6)',lineHeight:1.8}},
        'All done! School done. Chores done. Spiritual goals met.',
        React.createElement('br',null),
        React.createElement('strong',{style:{color:'#fff'}},'This time is YOURS. Enjoy every minute! ⭐'))
    ),
    React.createElement('div',{style:{padding:'0 14px'}},
      React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.4)',
        fontWeight:800,letterSpacing:1,marginBottom:10}},
        'WHAT DO YOU WANT TO DO?'),
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}},
        FREE_ACTIVITIES.map(function(a){
          return React.createElement('button',{key:a.label,onClick:()=>setPicked(a),
            style:{padding:'12px 8px',borderRadius:12,
              border:'2px solid '+(picked&&picked.label===a.label?a.color:a.color+'33'),
              background:picked&&picked.label===a.label?a.color+'20':a.color+'10',
              cursor:'pointer',textAlign:'center',transition:'all .2s'}},
            React.createElement('div',{style:{fontSize:26,marginBottom:3}},a.icon),
            React.createElement('div',{style:{fontSize:10,fontWeight:800,color:a.color}},a.label)
          );
        })
      ),
      picked&&React.createElement('div',{style:{background:'rgba(0,0,0,.3)',borderRadius:12,
        padding:14,border:'1px solid '+picked.color+'44',marginBottom:12}},
        React.createElement('div',{style:{fontSize:28,textAlign:'center',marginBottom:6}},picked.icon),
        React.createElement('div',{style:{fontSize:14,fontWeight:800,color:picked.color,
          textAlign:'center',marginBottom:4}},"Let's "+picked.label+'!'),
        React.createElement('div',{style:{fontSize:11,color:'rgba(255,255,255,.5)',
          textAlign:'center',marginBottom:12,lineHeight:1.6}},picked.desc),
        React.createElement('div',{style:{display:'flex',gap:8}},
          React.createElement('button',{onClick:()=>logIt(picked),
            style:{flex:1,background:picked.color,color:'#000',border:'none',borderRadius:20,
              padding:11,fontWeight:800,fontSize:13,cursor:'pointer'}},
            '\u2705 Log It (+3 pts)'),
          React.createElement('button',{onClick:()=>setPicked(null),
            style:{padding:'11px 14px',background:'rgba(255,255,255,.06)',color:'#aaa',
              border:'none',borderRadius:20,fontSize:11,cursor:'pointer'}},'Back')
        )
      ),
      done.length>0&&React.createElement('div',null,
        React.createElement('div',{style:{fontSize:9,color:'rgba(255,255,255,.35)',
          fontWeight:800,letterSpacing:1,marginBottom:6}},"TODAY'S ADVENTURES"),
        done.map(function(a,i){
          return React.createElement('div',{key:i,style:{display:'flex',alignItems:'center',
            gap:8,padding:'7px 10px',marginBottom:4,
            background:'rgba(255,255,255,.03)',borderRadius:8}},
            React.createElement('span',{style:{fontSize:16}},a.icon),
            React.createElement('span',{style:{fontSize:11,color:'rgba(255,255,255,.6)'}},a.label)
          );
        })
      )
    )
  );
}

