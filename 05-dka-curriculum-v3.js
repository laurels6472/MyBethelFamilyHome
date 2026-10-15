// ═══ DKA CURRICULUM v3 ═══
// ═══ DKA CURRICULUM v3 — Teacher Script Format + Art Activities + Schedule ═══
// Modeled after DKA Curriculum v2 Complete format
// Lecture: 10-15 min teacher script → Independent work remainder of time
// Art: 1 project per week, embedded in regular lessons (randomized day)
// Total school day: 5 hours (subjects + 2 hours online)

// ─── Art Activity Scheduler ──────────────────────────────────────────────────
// Determines if a given school day includes an art activity (1 per 5-day week)
// Returns art project details or null
const ART_PROJECTS = [{
  id: 'a1',
  title: 'Jehovah\'s Creation Map',
  medium: 'Colored pencils or watercolor',
  instruction: 'Draw a map of the Garden of Eden as you imagine it from Genesis 2. Include the four rivers (Pishon, Gihon, Tigris, Euphrates), varieties of trees and plants, and label each one. Add Adam naming the animals in one corner.',
  grades: {
    1: 'Draw your favorite animal from Genesis. Label it with its name.',
    3: 'Illustrate the garden landscape with 5 named plants and 3 animals. Add a scripture reference.',
    4: 'Create a detailed topographical map with geographic features, labeled with their Hebrew/Greek names and scripture references.'
  }
}, {
  id: 'a2',
  title: 'Illuminated Scripture',
  medium: 'Fine marker or calligraphy pen, decorative border',
  instruction: 'Choose your favorite scripture from this week\'s lessons. Write it in your best handwriting in the center of the page. Decorate the border with drawings related to the scripture\'s meaning.',
  grades: {
    1: 'Write one scripture in your best handwriting. Draw pictures from the verse in the corners.',
    3: 'Write the scripture in stylized lettering. Research what illuminated manuscripts looked like in the Middle Ages. Create a decorative border inspired by that style.',
    4: 'Study the Book of Kells or other illuminated manuscripts. Create an illuminated page with ornate letterwork, gold-effect coloring, and a decorative miniature illustration.'
  }
}, {
  id: 'a3',
  title: 'Meal Planner Illustration',
  medium: 'Markers or colored pencils',
  instruction: 'Choose one of this week\'s meals and draw it as a beautiful food illustration — the way magazines and cookbooks show food. Include all ingredients arranged artistically around the finished dish.',
  grades: {
    1: 'Draw today\'s dinner on a plate. Color it carefully. Write the name of each food you drew.',
    3: 'Create a food layout illustration showing the meal\'s main dish with labeled ingredient items arranged around it. Add the recipe title in styled lettering.',
    4: 'Design a full cookbook page spread: the dish photo illustration, ingredient list with quantity annotations, and a decorative header with the recipe title in professional typography-inspired lettering.'
  }
}, {
  id: 'a4',
  title: 'Kingdom Hall Architecture Sketch',
  medium: 'Pencil, then pen',
  instruction: 'Draw the floor plan or exterior of your Kingdom Hall from memory. Include the main entrance, seating areas, and the platform. Label each section.',
  grades: {
    1: 'Draw what the outside of our Kingdom Hall looks like. Add the sign with the congregation name.',
    3: 'Draw the exterior using perspective techniques. Include architectural details. Add trees and the parking lot.',
    4: 'Create both an exterior perspective drawing and a labeled floor plan. Research the history of Kingdom Hall design and write a paragraph about it.'
  }
}, {
  id: 'a5',
  title: 'Weather & Creation Observation',
  medium: 'Watercolor or colored pencils',
  instruction: 'Go outside for 10 minutes and observe the sky. Come back and paint or draw exactly what you saw — clouds, light, colors. This is the same exercise artists have used for centuries to study Jehovah\'s creation.',
  grades: {
    1: 'Draw the sky right now. What color is it? Are there clouds? What shape are they?',
    3: 'Paint a sky study showing at least 3 different types of clouds. Identify each cloud type (cirrus, cumulus, stratus, etc.).',
    4: 'Create a scientific/artistic sky study — label cloud types, estimate cloud altitude, note the direction of light source, and use thumbnail sketches to plan your composition before executing the final piece.'
  }
}, {
  id: 'a6',
  title: 'Illustrated Timeline',
  medium: 'Ruler, markers, colored pencils',
  instruction: 'Create a visual timeline of this week\'s history or Bible study topic. Use small drawings to mark each major event, not just words.',
  grades: {
    1: 'Draw 5 important events from the Bible story we studied this week in order. Draw an arrow between each one.',
    3: 'Create a timeline with illustrated event markers, dates or approximate periods, and connecting narrative text explaining each event.',
    4: 'Create a dual-timeline comparing your history lesson\'s events alongside corresponding world events, with illustrated markers and analysis of how they connect.'
  }
}, {
  id: 'a7',
  title: 'Nature Journal Page',
  medium: 'Pencil, pen, colored pencils',
  instruction: 'Choose one plant or animal from today\'s science lesson. Draw it as a scientific naturalist would — detailed, accurate, labeled. Think of John James Audubon\'s bird illustrations or botanical drawings.',
  grades: {
    1: 'Draw your favorite plant or animal from our science lesson. Label 3 parts.',
    3: 'Create a scientific illustration with anatomical labels, lifecycle or growth stages, and a note about the organism\'s role in the ecosystem.',
    4: 'Complete a naturalist journal page: detailed anatomical illustration with binomial nomenclature, a species description paragraph, distribution notes, and ecological function analysis.'
  }
}, {
  id: 'a8',
  title: 'Family Portrait — Biblical Context',
  medium: 'Any medium of choice',
  instruction: 'Draw our family doing a spiritual activity — Family Worship, field service, or the morning meeting. Try to capture expressions and clothing accurately.',
  grades: {
    1: 'Draw our family sitting together for Family Worship. Give everyone their correct hair color and a smile.',
    3: 'Create a scene showing our family in a meaningful spiritual moment. Focus on facial expressions and body language that convey the mood.',
    4: 'Plan a composition that tells a story — consider foreground, middle ground, and background. Use lighting to draw the viewer\'s eye to the most important person or action in the scene.'
  }
}, {
  id: 'a9',
  title: 'Color Mixing Science',
  medium: 'Watercolor or acrylic paint',
  instruction: 'Starting with just red, blue, and yellow paint (the three primaries), mix every color on the color wheel. Document each mixture in a painted color wheel.',
  grades: {
    1: 'Mix red + blue. What color do you get? Mix blue + yellow. What color? Mix red + yellow. What color? Paint all 6 results.',
    3: 'Create a full 12-section color wheel. Label each color as primary, secondary, or tertiary. Note the mixing formula for each tertiary color.',
    4: 'Create a professional color wheel with tints and shades (adding white or black to each). Document the pigment names used. Research why "red, blue, yellow" primaries differ from "cyan, magenta, yellow" print primaries.'
  }
}, {
  id: 'a10',
  title: 'Paradise Earth Illustration',
  medium: 'Any medium',
  instruction: 'Illustrate Revelation 21:4 or Isaiah 11:6-9 — what do you think the paradise earth will look like? Include people, animals, and landscape working together in harmony.',
  grades: {
    1: 'Draw your favorite animal from Isaiah 11:6-9 "The wolf will live with the lamb." Show them together in peace.',
    3: 'Illustrate a scene from paradise earth with humans and animals in harmony. Include plants and architecture that suggest the natural abundance described in scripture.',
    4: 'Create a conceptual illustration of paradise earth that incorporates your knowledge of ecology, architecture, and human life. Write an artist\'s statement explaining your choices and the scriptures that inspired them.'
  }
}, {
  id: 'a11',
  title: 'Recipe Illustration Card',
  medium: 'Fine marker or pen, colored pencils',
  instruction: 'Choose one recipe from our meal plan and create a beautiful illustrated recipe card — the kind that could go on a kitchen wall. Include the ingredients listed artistically, the dish name in beautiful lettering, and a small illustration of the finished meal.',
  grades: {
    1: 'Draw a picture of one meal we made this week. Write its name in your best letters.',
    3: 'Design a 5x7 recipe card with the recipe name in styled lettering, a small food illustration, and the ingredients listed in a decorative way.',
    4: 'Design a full recipe card with professional graphic design principles — consistent typography hierarchy, color palette, balanced layout, and a food illustration in your chosen medium.'
  }
}, {
  id: 'a12',
  title: 'Map of Bible Lands',
  medium: 'Colored pencils',
  instruction: 'Draw a map of the ancient Near East from memory, labeling the countries and cities important to Bible history: Egypt, Canaan, Babylon, Jerusalem, Nazareth, Jordan River, Dead Sea, Mediterranean Sea.',
  grades: {
    1: 'Draw a simple map. Label: Israel, Egypt, and Babylon. Draw a line showing where Moses walked.',
    3: 'Create a detailed map with geography (mountains, rivers, seas) and labeled cities. Add small event markers showing where 5 key Bible events happened.',
    4: 'Create a historically accurate map with trade routes, approximate political boundaries for a specific biblical period, geographic features to scale, and a legend. Compare this map to a modern political map of the same region.'
  }
}];
function isArtDay(schoolDay) {
  // One art day per 5-day week — pseudorandom but consistent
  const week = Math.ceil(schoolDay / 5);
  const artDayInWeek = (week * 7 + 3) % 5 + 1; // generates 1-5
  const dayInWeek = (schoolDay - 1) % 5 + 1;
  return dayInWeek === artDayInWeek;
}
function getArtProject(schoolDay) {
  const week = Math.ceil(schoolDay / 5);
  return ART_PROJECTS[(week * 3 + 7) % ART_PROJECTS.length];
}

// ─── DKA v2-Style Lesson Formatter ───────────────────────────────────────────
// Takes raw lesson data and displays it in DKA curriculum v2 format:
// Teacher Script (10-15 min) → Vocabulary → Independent Work → Art (if scheduled)

const DKA_VOCAB = {
  bible: {
    'covenant': 'A sacred, binding agreement or promise — like when Jehovah promised Noah He would never flood the earth again (Genesis 9:11)',
    'prophecy': 'A message from Jehovah about the future — given to His servants like Isaiah, Daniel, and Ezekiel',
    'righteous': 'Doing what is right in Jehovah\'s eyes — following His standards with sincerity and love',
    'faith': 'Complete trust and confidence in Jehovah — not just believing He exists, but trusting His promises',
    'resurrection': 'The miracle of bringing the dead back to life — one of Jehovah\'s most wonderful promises',
    'paradise': 'The beautiful future earth Jehovah has promised — a perfect world where no one will be sick, sad, or die',
    'theocracy': 'A government led by God — the type of government Jehovah\'s Kingdom will be',
    'sovereignty': 'The right to rule — Jehovah\'s universal sovereignty means HE has the right to govern all creation',
    'redemption': 'Being freed or bought back — Jesus\' sacrifice redeemed humanity from sin and death',
    'worship': 'Giving honor and devotion to Jehovah — through prayer, study, field service, and the way we live daily'
  },
  lang: {
    'syntax': 'The arrangement of words and phrases to create well-formed sentences — like how Jehovah arranged the words of scripture to communicate perfectly',
    'semantics': 'The meaning of words and sentences — why the exact words Jehovah inspired in the Bible matter',
    'rhetoric': 'The art of effective communication — Paul used excellent rhetoric in his letters',
    'thesis': 'The main point or argument of a piece of writing — the single most important idea',
    'parallelism': 'Repeating the same grammatical structure for effect — used constantly in Hebrew poetry like the Psalms',
    'diction': 'Word choice — the specific words a writer selects to create meaning and effect',
    'inference': 'A conclusion you reach based on evidence — what a skilled Bible reader does when understanding deeper meaning',
    'connotation': 'The emotional or cultural meaning of a word beyond its literal definition',
    'annotation': 'Notes you write in the margins of a text to track your thinking and understanding'
  },
  math: {
    'variable': 'A letter that stands for an unknown number — like n for the number of pioneers in a territory',
    'ratio': 'A comparison of two quantities — like 1:1000 territory assignment ratio',
    'proportion': 'A statement that two ratios are equal — essential for scaling recipes and budgets',
    'percentage': 'A ratio expressed out of 100 — used in budgeting, tithing, and shopping',
    'algorithm': 'A step-by-step procedure for solving a problem — Jehovah\'s universe runs on mathematical algorithms',
    'coefficient': 'The number multiplied by a variable in an algebraic expression',
    'denominator': 'The bottom number in a fraction — tells how many equal parts the whole is divided into',
    'numerator': 'The top number in a fraction — tells how many of those parts we have',
    'integer': 'Any whole number, positive or negative, including zero',
    'function': 'A mathematical relationship where each input produces exactly one output'
  },
  history: {
    'sovereignty': 'A nation\'s right to govern itself — Jehovah\'s sovereignty over all nations is a central Bible theme',
    'prophecy': 'A prediction of future events — Bible prophecy has been fulfilled with 100% accuracy',
    'persecution': 'Mistreatment because of one\'s beliefs — Jehovah\'s Witnesses have faced this throughout history',
    'theocracy': 'Government by Jehovah — the coming Kingdom of God is the ultimate theocracy',
    'neutrality': 'Not taking sides in political or military conflict — the Bible-based position of Jehovah\'s Witnesses',
    'dynasty': 'A succession of rulers from the same family — like the kings of Judah descended from David',
    'exile': 'Being forced to leave your homeland — Israel\'s Babylonian exile fulfilled Isaiah\'s prophecy',
    'covenant': 'A binding agreement between parties — God\'s covenants with Abraham, Moses, and David shaped history',
    'archaeology': 'The study of ancient history through physical evidence — confirms the Bible\'s accuracy repeatedly',
    'chronology': 'The arrangement of events in the order they occurred — essential for understanding Bible prophecy'
  },
  science: {
    'photosynthesis': 'The process plants use to convert sunlight into food — one of Jehovah\'s most elegant designs',
    'organism': 'Any living thing — from the smallest bacterium to the largest whale, all created by Jehovah',
    'cell': 'The basic unit of all living things — containing more organized information than any human-made computer',
    'atom': 'The smallest unit of an element — everything in creation is built from these tiny particles',
    'molecule': 'Two or more atoms bonded together — the building block of all matter',
    'nutrient': 'A substance that provides nourishment — Jehovah built essential nutrients into the foods He gave us',
    'metabolism': 'All the chemical processes in a living organism that keep it alive and functioning',
    'enzyme': 'A biological molecule that speeds up chemical reactions — essential for digestion and cellular function',
    'protein': 'Large molecules made of amino acids — build muscles, enzymes, and virtually every structure in the body',
    'carbohydrate': 'Molecules made of carbon, hydrogen, and oxygen — the body\'s primary energy source',
    'antioxidant': 'A molecule that prevents cellular damage from free radicals — abundant in colorful fruits and vegetables',
    'fermentation': 'The breakdown of substances by bacteria or yeast — used in food preservation since ancient times'
  },
  comp: {
    'thesis': 'The central argument of a piece of writing — the one sentence that everything else supports',
    'evidence': 'Facts, examples, and reasoning that support your thesis — in Christian writing, scripture is primary evidence',
    'voice': 'The unique personality and style that comes through in your writing',
    'revision': 'Improving your writing after the first draft — professional writers revise multiple times',
    'coherence': 'The quality of writing that flows logically from one idea to the next',
    'transition': 'A word or phrase that connects ideas — "furthermore," "in contrast," "as a result"',
    'argument': 'A position supported by reasons and evidence — Paul\'s letters are masterful arguments',
    'narrative': 'A story or account of events — the Bible contains many powerful narratives',
    'persuasion': 'Writing designed to change the reader\'s thinking or actions — Acts 17:2 describes Paul\'s persuasion',
    'format': 'The structure and layout of a written piece — matching format to purpose is professional skill'
  }
};
function DKALessonCard({
  subject,
  day,
  grade,
  lesson,
  showTeacher,
  isArtDay,
  artProject,
  studentId
}) {
  const [showVocab, setShowVocab] = useState(true); // Always open — vocab is for everyone
  const [showIndWork, setShowIndWork] = useState(true);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const vocab = DKA_VOCAB[subject?.id] || {};
  const vocabEntries = Object.entries(vocab).slice(0, 5); // 5 words per lesson
  const color = subject?.c || '#888';
  const levelLabel = grade <= 4 ? 'Level 1' : grade <= 8 ? 'Level 2-3' : 'Level 4';
  const gradeLabel = grade <= 4 ? 'Mykah' : grade <= 8 ? 'Ashelyn' : 'Kayla & Ryan';
  if (!lesson) return null;
  return React.createElement('div', {
    style: {
      marginTop: 8
    }
  },
  // ── Lecture Timer Badge ──
  React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8
    }
  }, React.createElement('div', {
    style: {
      background: 'rgba(192,202,51,.15)',
      border: '1px solid rgba(192,202,51,.3)',
      borderRadius: 20,
      padding: '4px 10px',
      fontSize: 9,
      color: '#C0CA33',
      fontWeight: 700
    }
  }, '🎓 10-15 MIN LECTURE → INDEPENDENT WORK'), isArtDay && React.createElement('div', {
    style: {
      background: 'rgba(158,105,175,.15)',
      border: '1px solid rgba(158,105,175,.3)',
      borderRadius: 20,
      padding: '4px 9px',
      fontSize: 9,
      color: '#9E69AF',
      fontWeight: 700
    }
  }, '🎨 ART DAY')),
  // ── Teacher Script (always visible to teacher, collapsed for student) ──
  React.createElement('div', {
    style: {
      background: 'rgba(0,0,0,.3)',
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 8,
      border: `1px solid ${showTeacher ? 'rgba(192,202,51,.3)' : 'rgba(255,255,255,.06)'}`
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: showTeacher ? 8 : 0
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      fontWeight: 800,
      color: '#C0CA33',
      letterSpacing: 1,
      flex: 1
    }
  }, showTeacher ? '📋 TEACHER SCRIPT (Read aloud — 10-15 min)' : '📖 TODAY\'S LESSON')), showTeacher && React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#ddd',
      lineHeight: 1.9,
      fontStyle: 'italic',
      borderLeft: '2px solid rgba(192,202,51,.3)',
      paddingLeft: 10
    }
  }, `"Good morning, class! Let's open with a question: `, React.createElement('strong', {
    style: {
      color: '#C0CA33'
    }
  }, `${lesson.focus}?`), `" [Pause and let each student respond in one or two sentences.] `, `"Today in ${subject?.l} we're studying: `, React.createElement('strong', {
    style: {
      color: '#fff'
    }
  }, lesson.focus), `." [Read the scripture connection if available.] `, lesson.script), !showTeacher && React.createElement('div', {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#fff'
    }
  }, lesson.focus)),
  // ── Vocabulary Section — always visible for ALL students ──
  vocabEntries.length > 0 && React.createElement('div', {
    style: {
      marginBottom: 8,
      background: 'rgba(26,115,232,.06)',
      border: '1.5px solid rgba(26,115,232,.3)',
      borderRadius: 10,
      padding: '10px 12px'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
      paddingBottom: 6,
      borderBottom: '1px solid rgba(26,115,232,.15)'
    }
  }, React.createElement('span', {
    style: {
      fontSize: 16
    }
  }, '📚'), React.createElement('div', {
    style: {
      flex: 1
    }
  }, React.createElement('div', {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#1A73E8'
    }
  }, 'VOCABULARY — Study these words FIRST'), React.createElement('div', {
    style: {
      fontSize: 8,
      color: '#555'
    }
  }, 'Read each word and its meaning aloud before starting independent work'))), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 6
    }
  }, vocabEntries.map(([word, def], idx) => React.createElement('div', {
    key: word,
    style: {
      background: 'rgba(0,0,0,.25)',
      borderRadius: 8,
      padding: '8px 10px',
      borderLeft: `3px solid rgba(26,115,232,${0.4 + idx * .1})`
    }
  }, React.createElement('div', {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#fff',
      marginBottom: 3
    }
  }, word), React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#ccc',
      lineHeight: 1.7
    }
  }, def))))),
  // ── Student Self-Guide (for independent work when Mom is at work) ──
  !showTeacher && React.createElement('div', {
    style: {
      background: 'rgba(192,202,51,.06)',
      border: '1.5px solid rgba(192,202,51,.25)',
      borderRadius: 10,
      padding: '9px 12px',
      marginBottom: 8
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      fontWeight: 800,
      color: '#C0CA33',
      marginBottom: 6,
      letterSpacing: 1
    }
  }, '📋 YOUR LESSON STEPS — Follow these in order:'), [`1️⃣ Read the vocabulary words above out loud — say each word AND its meaning`, '2️⃣ Read today\'s lesson focus: ' + (lesson && lesson.focus ? lesson.focus : 'Today\'s lesson'), `3️⃣ Complete the independent work below — do your BEST`, ...(isArtDay ? [`4️⃣ When done — do today's art project 🎨`] : []), `${isArtDay ? '5' : '4'}️⃣ When ALL work is finished — tap ✅ Submit to send to Mom for review`, `${isArtDay ? '6' : '5'}️⃣ Mom will check your work and leave you feedback when she's back`].map((step, i) => React.createElement('div', {
    key: i,
    style: {
      fontSize: 9,
      color: '#ddd',
      marginBottom: 4,
      padding: '4px 6px',
      background: 'rgba(0,0,0,.15)',
      borderRadius: 5
    }
  }, step))),
  // ── Independent Work ──
  React.createElement('div', {
    style: {
      background: 'rgba(76,175,82,.06)',
      border: '1px solid rgba(76,175,82,.25)',
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 8
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#4CAF82',
      fontWeight: 800,
      marginBottom: 6,
      letterSpacing: 1
    }
  }, `✏️ INDEPENDENT WORK — ${gradeLabel} · ${levelLabel} · ${subject?.id === 'bible' ? '30' : subject?.id === 'lang' || subject?.id === 'math' ? '30' : '20'} min`), React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#ccc',
      lineHeight: 1.8
    }
  }, lesson.activity)),
  // ── Art Activity (if art day) ──
  isArtDay && artProject && React.createElement('div', {
    style: {
      background: 'rgba(158,105,175,.08)',
      border: '1px solid rgba(158,105,175,.35)',
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 8
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#9E69AF',
      fontWeight: 800,
      marginBottom: 4,
      letterSpacing: 1
    }
  }, '🎨 WEEKLY ART PROJECT — 20 min'), React.createElement('div', {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#fff',
      marginBottom: 4
    }
  }, artProject.title), React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#9E69AF',
      marginBottom: 6
    }
  }, `Medium: ${artProject.medium}`), React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#ccc',
      marginBottom: 8,
      lineHeight: 1.7
    }
  }, artProject.instruction), React.createElement('div', {
    style: {
      background: 'rgba(0,0,0,.2)',
      borderRadius: 7,
      padding: '6px 9px'
    }
  }, React.createElement('div', {
    style: {
      fontSize: 8,
      color: '#9E69AF',
      marginBottom: 2
    }
  }, 'YOUR LEVEL:'), React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#ccc'
    }
  }, artProject.grades[grade <= 4 ? 1 : grade <= 8 ? 3 : 4] || artProject.instruction))),
  // ── Answer Key (teacher only, teacher-script style) ──
  showTeacher && lesson.answerKey && React.createElement('div', {
    style: {
      marginTop: 4
    }
  }, React.createElement('button', {
    onClick: () => setShowAnswerKey(!showAnswerKey),
    style: {
      width: '100%',
      background: 'rgba(239,83,80,.06)',
      border: '1px solid rgba(239,83,80,.3)',
      borderRadius: 10,
      padding: '7px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer'
    }
  }, React.createElement('span', {
    style: {
      fontSize: 9,
      color: '#EF5350',
      fontWeight: 800,
      flex: 1,
      letterSpacing: 1
    }
  }, '🔑 ANSWER KEY — TEACHER SCRIPT STYLE'), React.createElement('span', {
    style: {
      fontSize: 12,
      color: '#EF5350'
    }
  }, showAnswerKey ? '▾' : '▸')), showAnswerKey && React.createElement('div', {
    style: {
      background: 'rgba(239,83,80,.04)',
      border: '1px solid rgba(239,83,80,.2)',
      borderTop: 'none',
      borderRadius: '0 0 10px 10px',
      padding: '10px 12px'
    }
  },
  // Vocabulary check
  React.createElement('div', {
    style: {
      marginBottom: 10
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#FF9800',
      fontWeight: 700,
      marginBottom: 4
    }
  }, '🗣 VOCABULARY CHECK — Read this to the class:'), vocabEntries.slice(0, 3).map(([word, def]) => React.createElement('div', {
    key: word,
    style: {
      fontSize: 9,
      color: '#ccc',
      marginBottom: 4,
      background: 'rgba(0,0,0,.2)',
      borderRadius: 6,
      padding: '5px 8px'
    }
  }, React.createElement('span', {
    style: {
      color: '#FF9800',
      fontWeight: 700
    }
  }, `"What does "${word}" mean?"`), React.createElement('br', null), React.createElement('span', {
    style: {
      color: '#aaa'
    }
  }, `→ "${def}" — Repeat it back: "${word}" means...`)))),
  // Short answer
  React.createElement('div', {
    style: {
      marginBottom: 8
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#EF5350',
      fontWeight: 700,
      marginBottom: 3
    }
  }, '📌 SHORT ANSWER (What to listen for):'), React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#ccc',
      lineHeight: 1.6,
      fontStyle: 'italic',
      borderLeft: '2px solid rgba(239,83,80,.3)',
      paddingLeft: 8
    }
  }, `"A great short answer would be: `, lesson.answerKey.short, `" [If they say something close to this, affirm it.]`)),
  // Full explanation
  React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#EF5350',
      fontWeight: 700,
      marginBottom: 3
    }
  }, '📖 FULL EXPLANATION (Teacher\'s complete understanding):'), React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#aaa',
      lineHeight: 1.8
    }
  }, lesson.answerKey.long || lesson.answerKey.short)))));
}

// ─── Rotating 5-Hour School Day Schedule ────────────────────────────────────
// Monday–Friday, 9:00 AM – 2:00 PM (5 hours)
// Core daily: Bible + Online + Exercise + Opening/Closing (always runs)
// Rotating subjects vary by day so no single day is overloaded
// Field Service Mode: shortened day — Bible + Online only (~3h 15 min)

const CORE_DAILY = [{
  time: "9:00",
  label: "Opening Assembly",
  mins: 10,
  color: "#7986CB",
  icon: "🎵",
  note: "Opening Song (JW.org) → Prayer → Bible text → DKA announcements"
}, {
  time: "9:10",
  label: "📖 Bible Study",
  mins: 35,
  color: "#7986CB",
  icon: "📖",
  note: "10-min lecture · 25 min independent work · EVERY day"
}];
const CORE_CLOSE = [{
  time: "1:40",
  label: "🏃 Exercise & Movement",
  mins: 20,
  color: "#4CAF82",
  icon: "🏃",
  note: "Walk · stretch · jumping jacks · disc golf · bowling · family choice · 1 Tim 4:8"
}, {
  time: "2:00",
  label: "Closing Assembly",
  mins: 15,
  color: "#7986CB",
  icon: "🙏",
  note: "Closing Song (JW.org) → Prayer → Daily review → Dismiss"
}];
const ONLINE_BLOCK = {
  time: "11:35",
  label: "🎓 Online Schooling",
  mins: 120,
  color: "#039BE5",
  icon: "💻",
  note: "Ryan & Kayla: Penn Foster (2 hrs) · Ashelyn: Khan Academy (2 hrs) · Mykah: ESL + Khan Academy (2 hrs)"
};
const SNACK_BLOCK = {
  time: "11:25",
  label: "☀️ Snack Break",
  mins: 10,
  color: "#FF9800",
  icon: "🍎",
  note: "Quick snack · bathroom · reset for online school"
};

// Rotating subject blocks per day
const WEEKLY_SCHEDULE = {
  monday: {
    label: "Monday — Language Arts + Math",
    tag: "📚 ➕",
    color: "#F4511E",
    note: "Core subjects day — build skills for the week",
    rotating: [{
      time: "9:45",
      label: "📚 Language Arts",
      mins: 40,
      color: "#F4511E",
      icon: "📚",
      note: "10-min lecture · 30 min independent work · vocabulary + grammar or reading"
    }, {
      time: "10:25",
      label: "➕ Math",
      mins: 40,
      color: "#1A73E8",
      icon: "➕",
      note: "10-min lecture · 30 min independent work · Khan Academy supplement if needed"
    }]
  },
  tuesday: {
    label: "Tuesday — Science + History",
    tag: "🔬 🌍",
    color: "#4CAF82",
    note: "Exploration day — kitchen science + world study",
    rotating: [{
      time: "9:45",
      label: "🔬 Science / Kitchen",
      mins: 40,
      color: "#4CAF82",
      icon: "🔬",
      note: "10-min lecture · 30 min kitchen activity or written science · Meal plan science"
    }, {
      time: "10:25",
      label: "🌍 History",
      mins: 35,
      color: "#FF9800",
      icon: "🌍",
      note: "10-min lecture · 25 min independent work · Bible prophecy + world history"
    }]
  },
  wednesday: {
    label: "Wednesday — Math + Composition",
    tag: "➕ ✏️",
    color: "#1A73E8",
    note: "Math reinforcement + writing skills",
    rotating: [{
      time: "9:45",
      label: "➕ Math",
      mins: 40,
      color: "#1A73E8",
      icon: "➕",
      note: "10-min lecture · 30 min independent work · problem sets or cooking math"
    }, {
      time: "10:25",
      label: "✏️ Composition",
      mins: 35,
      color: "#C0CA33",
      icon: "✏️",
      note: "10-min lecture · 25 min writing assignment · essays, letters, or creative writing"
    }]
  },
  thursday: {
    label: "Thursday — Language Arts + Science",
    tag: "📚 🔬",
    color: "#F48FB1",
    note: "Meeting night — school ends by 2 PM. Allow prep time for evening meeting.",
    rotating: [{
      time: "9:45",
      label: "📚 Language Arts",
      mins: 40,
      color: "#F4511E",
      icon: "📚",
      note: "10-min lecture · 30 min independent work · reading comprehension or grammar"
    }, {
      time: "10:25",
      label: "🔬 Science",
      mins: 30,
      color: "#4CAF82",
      icon: "🔬",
      note: "10-min lesson · 20 min written science OR kitchen activity"
    }],
    meetingAlert: true
  },
  friday: {
    label: "Friday — Composition + Art / Review",
    tag: "✏️ 🎨",
    color: "#C0CA33",
    note: "Wrap-up day · Art project week · Field service may shorten — see Field Service Mode",
    rotating: [{
      time: "9:45",
      label: "✏️ Composition",
      mins: 35,
      color: "#C0CA33",
      icon: "✏️",
      note: "10-min lecture · 25 min writing · publish or share the week\'s best piece"
    }, {
      time: "10:20",
      label: "🎨 Art / Week Review",
      mins: 30,
      color: "#9E69AF",
      icon: "🎨",
      note: "Weekly art project (when scheduled) OR subject review · student-led discussion"
    }]
  }
};

// Field Service shortened day
const FIELD_SERVICE_DAY = [{
  time: "9:00",
  label: "Opening Assembly",
  mins: 10,
  color: "#7986CB",
  icon: "🎵",
  note: "Quick opening — song + prayer + scripture"
}, {
  time: "9:10",
  label: "📖 Bible Study",
  mins: 30,
  color: "#7986CB",
  icon: "📖",
  note: "Shortened Bible lesson — connect to today\'s ministry theme"
}, {
  time: "9:40",
  label: "🌱 Field Service Prep",
  mins: 20,
  color: "#4CAF82",
  icon: "🌱",
  note: "Practice presentations · review territory · prepare for the ministry"
}, {
  time: "10:00",
  label: "🚗 Depart for Field Service",
  mins: 0,
  color: "#4CAF82",
  icon: "🚗",
  note: "Return time varies — continue online school when home"
}, {
  time: "—",
  label: "🎓 Online School (on return)",
  mins: 120,
  color: "#039BE5",
  icon: "💻",
  note: "Complete 2 hours online when back — Penn Foster / Khan Academy"
}, {
  time: "—",
  label: "Closing Prayer",
  mins: 5,
  color: "#7986CB",
  icon: "🙏",
  note: "Brief closing prayer at end of online work"
}];
const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
function SchoolDaySchedule({
  day,
  student
}) {
  const [expanded, setExpanded] = useState(true);
  const [fieldService, setFieldService] = useState(false);
  const artDay = isArtDay(day || 1);
  const todayName = DAY_NAMES[new Date().getDay()] || "monday";
  const daySchedule = WEEKLY_SCHEDULE[todayName] || WEEKLY_SCHEDULE.monday;
  const schedule = fieldService ? FIELD_SERVICE_DAY : [...CORE_DAILY, ...(daySchedule.rotating || []), SNACK_BLOCK, ONLINE_BLOCK, ...CORE_CLOSE];
  const totalMins = schedule.filter(b => b.mins > 0).reduce((s, b) => s + b.mins, 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setExpanded(!expanded),
    style: {
      width: "100%",
      background: "rgba(255,255,255,.03)",
      border: `1px solid ${fieldService ? "rgba(76,175,82,.4)" : "rgba(255,255,255,.08)"}`,
      borderRadius: 10,
      padding: "9px 12px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, fieldService ? "🌱" : "🕘"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: fieldService ? "#4CAF82" : "#fff"
    }
  }, fieldService ? "Field Service Day — Shortened Schedule" : daySchedule.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: "#555"
    }
  }, fieldService ? "Bible + Field Prep + Online when home" : `9:00 AM – 2:15 PM · ~${Math.round(totalMins / 60 * 10) / 10} hrs · ${artDay ? "🎨 Art Day" : "Regular Day"}`)), daySchedule.meetingAlert && !fieldService && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      padding: "2px 7px",
      borderRadius: 20,
      background: "rgba(121,134,203,.2)",
      color: "#7986CB",
      fontWeight: 700
    }
  }, "🏛 Meeting Night"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#555"
    }
  }, expanded ? "▾" : "▸")), expanded && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(0,0,0,.2)",
      borderRadius: "0 0 10px 10px",
      border: "1px solid rgba(255,255,255,.06)",
      borderTop: "none",
      padding: "8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      marginBottom: 8,
      padding: "6px 8px",
      background: "rgba(76,175,82,.06)",
      borderRadius: 8,
      border: "1px solid rgba(76,175,82,.2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, "🌱"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 9,
      color: "#4CAF82"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700
    }
  }, "Field Service Mode"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#555"
    }
  }, "Shortens school day for ministry — Bible + Online only")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFieldService(!fieldService),
    style: {
      padding: "5px 12px",
      borderRadius: 20,
      fontSize: 9,
      fontWeight: 800,
      border: "none",
      background: fieldService ? "#4CAF82" : "rgba(255,255,255,.08)",
      color: fieldService ? "#000" : "#555"
    }
  }, fieldService ? "✅ Active" : "Switch")), !fieldService && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3,
      overflowX: "auto",
      marginBottom: 8
    }
  }, Object.entries(WEEKLY_SCHEDULE).map(([k, d]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      flexShrink: 0,
      padding: "4px 8px",
      borderRadius: 8,
      fontSize: 8,
      fontWeight: 700,
      textAlign: "center",
      background: k === todayName ? `${d.color}25` : "rgba(255,255,255,.03)",
      border: `1px solid ${k === todayName ? d.color : "rgba(255,255,255,.06)"}`,
      color: k === todayName ? d.color : "#444"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textTransform: "capitalize"
    }
  }, k.slice(0, 3)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9
    }
  }, d.tag)))), !fieldService && daySchedule.note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: "#555",
      fontStyle: "italic",
      marginBottom: 6,
      padding: "4px 8px",
      background: "rgba(0,0,0,.2)",
      borderRadius: 6
    }
  }, daySchedule.note), schedule.map((block, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 8,
      padding: "5px 6px",
      marginBottom: 3,
      background: i % 2 === 0 ? "rgba(255,255,255,.02)" : "transparent",
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: "#555",
      width: 32,
      flexShrink: 0,
      marginTop: 1,
      fontFamily: "monospace"
    }
  }, block.time), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 3,
      alignSelf: "stretch",
      borderRadius: 2,
      flexShrink: 0,
      background: block.color,
      opacity: .7
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      color: "#ccc"
    }
  }, block.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      color: "#444"
    }
  }, block.mins > 0 ? `${block.mins} min · ` : "", block.note)))), !fieldService && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      padding: "6px 8px",
      background: "rgba(121,134,203,.06)",
      borderRadius: 7,
      border: "1px solid rgba(121,134,203,.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: "#7986CB",
      fontWeight: 700,
      marginBottom: 3
    }
  }, "📊 WEEKLY SUBJECT COVERAGE (per week)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      flexWrap: "wrap"
    }
  }, [["📖 Bible", "5x/wk", "#7986CB"], ["📚 LA", "2x/wk", "#F4511E"], ["➕ Math", "2x/wk", "#1A73E8"], ["🔬 Science", "2x/wk", "#4CAF82"], ["🌍 History", "1x/wk", "#FF9800"], ["✏️ Comp", "2x/wk", "#C0CA33"], ["💻 Online", "5x/wk", "#039BE5"], ["🏃 Exercise", "5x/wk", "#4CAF82"]].map(([sub, freq, c]) => /*#__PURE__*/React.createElement("div", {
    key: sub,
    style: {
      fontSize: 7,
      padding: "2px 6px",
      borderRadius: 8,
      background: `${c}15`,
      color: c,
      fontWeight: 700
    }
  }, sub, " ", freq))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      color: "#555",
      marginTop: 4
    }
  }, "✅ 5 hrs M–F · Field Service Mode: shorten any day instantly"))));
}

// ─── FieldServiceBanner ─────────────────────────────
// ─── FieldServiceBanner — always-visible field service toggle ─────────────
var _fsMode = false;
var _fsModeListeners = [];
function setFSMode(val) {
  _fsMode = val;
  _fsModeListeners.forEach(fn => fn(val));
}
function useFieldServiceMode() {
  const [active, setActive] = useState(_fsMode);
  React.useEffect(() => {
    const listener = v => setActive(v);
    _fsModeListeners.push(listener);
    return () => {
      _fsModeListeners = _fsModeListeners.filter(fn => fn !== listener);
    };
  }, []);
  return [active, setFSMode];
}
function FieldServiceBanner({
  day
}) {
  const [fsMode, setFs] = useFieldServiceMode();
  const todayName = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()] || "monday";
  const sched = typeof WEEKLY_SCHEDULE !== "undefined" && WEEKLY_SCHEDULE[todayName];
  const FS_PLAN = [["9:00", "🎵 Opening + Prayer", "10 min"], ["9:10", "📖 Bible Study — Ministry theme", "30 min"], ["9:40", "🌱 Field Service Prep", "20 min — practice presentations, review territory"], ["10:00", "🚗 Depart for Field Service", "Return time varies"], ["—", "💻 Online School (on return)", "Complete 2 hrs when home"], ["—", "🙏 Closing Prayer", "End of day"]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 12px",
      background: fsMode ? "rgba(76,175,82,.12)" : "rgba(255,255,255,.03)",
      border: `1.5px solid ${fsMode ? "#4CAF82" : "rgba(255,255,255,.1)"}`,
      borderRadius: 10,
      marginBottom: fsMode ? 8 : 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, "🌱"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: fsMode ? "#4CAF82" : "#ccc"
    }
  }, fsMode ? "Field Service Day — Active" : "Field Service Mode"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: "#555"
    }
  }, fsMode ? "Bible + Ministry Prep + Online only — regular subjects paused" : "Tap ON to shorten school day for the ministry")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFs(!fsMode),
    style: {
      padding: "9px 16px",
      borderRadius: 20,
      border: "none",
      fontWeight: 900,
      fontSize: 12,
      background: fsMode ? "#4CAF82" : "rgba(255,255,255,.1)",
      color: fsMode ? "#000" : "#777"
    }
  }, fsMode ? "✅ ON" : "OFF")), fsMode && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(76,175,82,.06)",
      border: "1px solid rgba(76,175,82,.3)",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "#4CAF82",
      fontWeight: 800,
      letterSpacing: 1,
      marginBottom: 8
    }
  }, "TODAY — FIELD SERVICE SCHEDULE"), FS_PLAN.map(([time, label, note], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      padding: "5px 0",
      borderBottom: i < FS_PLAN.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: "#555",
      width: 32,
      flexShrink: 0,
      fontFamily: "monospace",
      marginTop: 2
    }
  }, time), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: "#fff"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: "#555"
    }
  }, note)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 8,
      color: "#4CAF82",
      fontStyle: "italic",
      textAlign: "center"
    }
  }, "Matthew 9:37 — The harvest is great. Go preach!")), !fsMode && sched && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 10px",
      background: "rgba(0,0,0,.15)",
      borderRadius: 8,
      border: `1px solid ${sched.color}30`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, sched.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: sched.color
    }
  }, sched.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: "#555"
    }
  }, sched.note)), sched.meetingAlert && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      padding: "3px 8px",
      borderRadius: 20,
      background: "rgba(121,134,203,.2)",
      color: "#7986CB",
      fontWeight: 700
    }
  }, "🏛 Meeting Night")));
}


// ─── Device Setup Guide ───────────────────────────────────────────────────────
function DeviceSetupGuide() {
  const [method, setMethod] = useState('github');
  const methods = [{
    id: 'github',
    l: '🐙 GitHub Pages (Easiest – free)',
    sub: 'Free · Permanent URL · What you already use'
  }, {
    id: 'firebase',
    l: '🔥 Firebase Hosting (Best)',
    sub: 'Free · Already using Firebase'
  }, {
    id: 'local',
    l: '📁 Open on iPad (Offline)',
    sub: 'No internet needed on device'
  }];
  const steps = {
    github: [{
      n: 1,
      title: 'Create a GitHub repository',
      detail: 'Go to:\n📍 github.com/new\nName it something like "family-master"\nSet it to Public (Private repos need a paid plan for Pages on some account types — Public is simplest and fine for this).\nClick "Create repository".',
      note: 'If you already have a repo for this app, just reuse it — skip to step 2.'
    }, {
      n: 2,
      title: 'Upload MyBethelFamilyHome.html as index.html',
      detail: 'On your new repo\'s page, click "Add file" → "Upload files".\nDrag in your MyBethelFamilyHome.html file.\nIMPORTANT: rename it to index.html before committing (GitHub Pages looks for index.html by default) — click the filename in the upload box and change it.\nScroll down and click "Commit changes".',
      note: 'Renaming to index.html is what makes the URL work without typing a filename at the end.'
    }, {
      n: 3,
      title: 'Turn on GitHub Pages',
      detail: 'In your repo, click "Settings" (top right of the repo, not your account settings).\nIn the left sidebar, click "Pages".\nUnder "Build and deployment" → "Source", choose "Deploy from a branch".\nUnder "Branch", choose "main" and folder "/ (root)". Click "Save".',
      note: 'GitHub will show a banner "Your site is live at https://yourusername.github.io/family-master/" — that can take 1-2 minutes to appear the first time.'
    }, {
      n: 4,
      title: 'Copy your app\'s URL',
      detail: 'Your app is now live at:\n🌐 https://yourusername.github.io/family-master/\n\nCopy this URL — it will not change unless you rename the repo.',
      note: 'Bookmark this or save it in your notes — you\'ll type it once per device.'
    }, {
      n: 5,
      title: 'Open on each child\'s device',
      detail: 'On each iPad, iPhone, or tablet:\n1. Open Safari (NOT Chrome — it must be Safari for "Add to Home Screen" to work)\n2. Type or paste your GitHub Pages URL in the address bar\n3. Wait for the app to load fully\n4. Tap the Share button (□ with ↑ arrow at the bottom of Safari)\n5. Scroll down and tap "Add to Home Screen"\n6. Name it: MyBethelFamilyHome\n7. Tap Add',
      note: 'The app icon will now appear on the home screen just like a real app!'
    }, {
      n: 6,
      title: 'Set up each child\'s PIN',
      detail: 'Open the app. You will see the family member selector.\n1. Tap Laurel (👑)\n2. Enter your PIN\n3. Go to Admin → 🔧 Admin tab\n4. Find "PIN Manager"\n5. Set a PIN for each child\n6. Have each child log in with their PIN to test it',
      note: 'Each child will only see their own school content and age-appropriate features.'
    }, {
      n: 7,
      title: 'Update the app when changes are made',
      detail: 'Whenever you get a new MyBethelFamilyHome.html file:\n1. Go to your repo on github.com\n2. Click on index.html in the file list\n3. Click the pencil (✏️) "Edit this file" icon, or use "Add file" → "Upload files" and re-upload with the same name (index.html) to overwrite it\n4. Scroll down and click "Commit changes"\nThe URL stays exactly the same — GitHub Pages rebuilds automatically in about a minute, and every device that has it added to their home screen updates the next time they open it.',
      note: '💡 Tip: GitHub Pages needs no login on the child devices at all — only you need a GitHub account to publish updates.'
    }],
    firebase: [{
      n: 1,
      title: 'Install Node.js on your computer',
      detail: 'Go to: nodejs.org\nClick "LTS" (the green button — this is the stable version)\nDownload and install it. Accept all defaults.\nAfter installing, open Command Prompt (Windows) or Terminal (Mac) and type:\nnode --version\nIf you see a number like v18.x.x, it worked!',
      note: 'You only need to do this step once. Node.js is already needed for Babel compilation.'
    }, {
      n: 2,
      title: 'Install Firebase Tools',
      detail: 'In Command Prompt or Terminal, type:\nnpm install -g firebase-tools\nPress Enter and wait 1-2 minutes for it to install.',
      note: 'The -g means "global" — it installs once for your whole computer.'
    }, {
      n: 3,
      title: 'Log in to Firebase',
      detail: 'Type: firebase login\nPress Enter.\nA browser window will open asking you to sign in to Google.\nSign in with the same Google account connected to your Firebase project (laurels6472@gmail.com).\nThe terminal will say "Success! Logged in as..."',
      note: 'This connects the command line tool to your Firebase account.'
    }, {
      n: 4,
      title: 'Set up hosting folder',
      detail: 'Create a new folder on your Desktop called "dka-app"\nInside that folder, create another folder called "public"\nCopy your MyBethelFamilyHome.html into the "public" folder\nIn Command Prompt, navigate to dka-app:\nWindows: cd C:\\Users\\Owner\\Desktop\\dka-app\nMac: cd ~/Desktop/dka-app\nThen run: firebase init hosting\nWhen it asks which project — select your existing Firebase project\nWhen it asks "What do you want to use as your public directory?" type: public\nWhen it asks "Configure as single-page app?" type: y\nWhen it asks "Overwrite index.html?" type: N',
      note: 'This sets up the connection between your local folder and Firebase.'
    }, {
      n: 5,
      title: 'Deploy the app',
      detail: 'In Command Prompt while still in the dka-app folder, type:\nfirebase deploy --only hosting\nWait 30-60 seconds.\nFirebase will give you a URL like:\n🌐 https://your-project-id.web.app\n\nThis URL is permanent — copy it and save it somewhere safe.',
      note: 'Every time you update MyBethelFamilyHome.html, copy it back into the public folder and run firebase deploy again. The URL never changes.'
    }, {
      n: 6,
      title: 'Add to home screen on each device',
      detail: 'Follow the same steps as the GitHub Pages Method Step 5:\n1. Open Safari on each child\'s device\n2. Go to your Firebase URL\n3. Tap Share → Add to Home Screen\n4. Name it MyBethelFamilyHome\n5. Tap Add',
      note: 'The Firebase URL never changes, so you only set this up once per device.'
    }],
    local: [{
      n: 1,
      title: 'Transfer the HTML file to the device',
      detail: 'The easiest way is AirDrop (iPhone/iPad to iPhone/iPad/Mac):\n1. On your computer or phone, find MyBethelFamilyHome.html\n2. Share it via AirDrop to the child\'s device\n3. When it arrives on their device, tap "Save to Files"\n4. Save it to "On My iPhone/iPad" → Downloads\n\nAlternative: Email the file to yourself and download it on the device.',
      note: 'This method works offline but Firebase sync won\'t work. The app still functions using localStorage.'
    }, {
      n: 2,
      title: 'Open the file in Safari',
      detail: 'On the child\'s device:\n1. Open the Files app (looks like a blue folder)\n2. Tap "Browse" at the bottom\n3. Go to "On My iPhone" → Downloads\n4. Tap MyBethelFamilyHome.html\n5. It will ask which app to open with — choose Safari',
      note: 'It MUST be Safari. Other browsers don\'t support "Add to Home Screen" on iOS.'
    }, {
      n: 3,
      title: 'Add to Home Screen',
      detail: 'Once the app is open in Safari:\n1. Tap the Share button (□ with ↑ arrow)\n2. Scroll down until you see "Add to Home Screen"\n3. Tap it\n4. Name it MyBethelFamilyHome (or "School App" for younger kids)\n5. Tap Add in the top right corner\n\nThe app icon now appears on the home screen!',
      note: 'The file URL will show as "file:///..." which is the local file path — this is normal.'
    }, {
      n: 4,
      title: 'Limitations of this method',
      detail: '⚠️ Firebase sync won\'t work (no internet connection to Firebase)\n✅ All progress saves locally on the device\n✅ All school content works offline\n✅ Timer and progress tracking works\n⚠️ Family members can\'t see each other\'s progress across devices\n\nFor full cross-device sync, use the GitHub Pages or Firebase Hosting method.',
      note: 'This is fine for a single child on their dedicated tablet. Not recommended if you want Laurel to see all children\'s progress from her device.'
    }]
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(26,115,232,.08)',
      border: '1px solid rgba(26,115,232,.3)',
      borderRadius: 12,
      padding: '12px 14px',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 900,
      color: '#1A73E8',
      marginBottom: 4
    }
  }, "📱 Get the App on Your Kids' Devices"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa',
      lineHeight: 1.7
    }
  }, "The MyBethelFamilyHome app is a self-contained HTML file. To install it on phones and tablets like a real app, you need to host it at a web address and then \"Add to Home Screen\" from Safari. Choose the method that fits your comfort level below.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      marginBottom: 12
    }
  }, methods.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    onClick: () => setMethod(m.id),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '9px 12px',
      borderRadius: 10,
      border: `1.5px solid ${method === m.id ? '#1A73E8' : 'rgba(255,255,255,.07)'}`,
      background: method === m.id ? 'rgba(26,115,232,.12)' : 'rgba(255,255,255,.02)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: method === m.id ? '#fff' : '#888'
    }
  }, m.l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555'
    }
  }, m.sub)), method === m.id && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#1A73E8'
    }
  }, "✓")))), /*#__PURE__*/React.createElement("div", null, (steps[method] || []).map(step => /*#__PURE__*/React.createElement("div", {
    key: step.n,
    style: {
      marginBottom: 10,
      background: 'rgba(0,0,0,.2)',
      borderRadius: 10,
      padding: '10px 12px',
      borderLeft: `3px solid ${method === 'github' ? '#4CAF82' : method === 'firebase' ? '#FF9800' : '#7986CB'}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      flexShrink: 0,
      background: method === 'github' ? '#4CAF82' : method === 'firebase' ? '#FF9800' : '#7986CB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      fontWeight: 900,
      color: '#000'
    }
  }, step.n), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#fff',
      marginBottom: 6
    }
  }, step.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#ccc',
      lineHeight: 1.8,
      whiteSpace: 'pre-line',
      background: 'rgba(0,0,0,.3)',
      borderRadius: 7,
      padding: '6px 9px',
      marginBottom: 5
    }
  }, step.detail), step.note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555',
      fontStyle: 'italic',
      background: 'rgba(255,255,255,.02)',
      borderRadius: 5,
      padding: '4px 7px'
    }
  }, "💡 ", step.note)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      background: 'rgba(76,175,82,.06)',
      borderRadius: 8,
      padding: '9px 11px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#4CAF82',
      fontWeight: 700,
      marginBottom: 4
    }
  }, "🆘 If the app isn't loading correctly"), ['Make sure you\'re using Safari, not Chrome or Firefox (iOS requires Safari for Add to Home Screen)', 'If the app shows a blank white screen, try a hard refresh: long-press the Reload button in Safari', 'If Firebase data isn\'t saving, check that the device has internet connection', 'If a child can\'t log in, Laurel (Admin) can reset PINs from her Admin → PIN Manager tab', 'The app works best on iOS 16+, Android 12+, or any modern desktop browser'].map((tip, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 8,
      color: '#aaa',
      marginBottom: 3
    }
  }, "• ", tip))));
}



