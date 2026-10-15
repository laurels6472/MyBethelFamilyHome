// ═══ SUBJECT CURRICULUM ═══
// ═══ JW-INTEGRATED SUBJECT CURRICULUM ════════════════════════════════════════
// Grades: Mykah=4, Ashelyn=8, Kayla=11, Ryan=12
// Each lesson: focus, script, activity, answerKey {short, long}

function getLessonForDay(subjectId, day, grade) {
  const unit = SUBJECT_UNITS[subjectId]?.find(u => day >= u.startDay && day <= u.endDay);
  const detailed = DETAILED_LESSONS[subjectId]?.[day]?.[grade];
  if (detailed) return {
    ...detailed,
    unit: unit?.title || ''
  };
  if (typeof lsBuildLesson === 'function') {
    const built = lsBuildLesson(subjectId, day, grade);
    if (built) return built;
  }
  if (unit) {
    const dayInUnit = day - unit.startDay + 1;
    const topic = unit.topics?.[dayInUnit - 1] || unit.topics?.[unit.topics.length - 1] || unit.title;
    return {
      focus: topic,
      script: `Refer to ${unit.resources || 'the New World Translation, Insight on the Scriptures, and wol.jw.org'} for today\'s lesson. Topic: ${topic}. Open with: ${unit.verse || 'Proverbs 3:5-6'}. Present the concept, check understanding, then complete the activity.`,
      activity: unit.activity || 'Complete the assigned work, then discuss how today\'s lesson connects to Jehovah\'s wisdom.',
      answerKey: {
        short: `See teacher\'s guide for Day ${dayInUnit} of "${unit.title}". Key principle: ${unit.principle || 'All wisdom comes from Jehovah (Prov 1:7).'}`,
        long: `Unit "${unit.title}" (Days ${unit.startDay}-${unit.endDay}). Today\'s topic: ${topic}. Core principle: ${unit.principle || 'Apply Jehovah\'s wisdom to every area of learning.'}. Source: ${unit.resources || 'teacher\'s guide'}. Review the full unit guide for detailed answer keys for this topic.`
      },
      unit: unit.title
    };
  }
  return null;
}
const SUBJECT_UNITS = {
  lang: [{
    startDay: 1,
    endDay: 20,
    title: 'Word of God — Foundation of Language',
    verse: 'Heb 4:12',
    principle: 'Jehovah authored the most important written communication in history.',
    resources: 'JW Library, Bible, Watchtower publications',
    activity: 'Read the assigned passage, identify grammar elements, answer comprehension questions.',
    topics: ['What is language? (Genesis and the gift of speech)', 'Parts of speech — nouns and pronouns in Scripture', 'Verbs: action and state of being in Biblical context', 'Adjectives and adverbs — descriptive language in the Psalms', 'Sentence structure — simple sentences from the Bible', 'Compound sentences — connecting ideas', 'Complex sentences — subordinate clauses', 'Reading comprehension — Proverbs passages', 'Vocabulary building from JW publications', 'Unit 1 Review']
  }, {
    startDay: 21,
    endDay: 40,
    title: 'Reading With Understanding',
    verse: 'Neh 8:8',
    principle: 'Reading for meaning, not just words — as the Levites read scripture with clear understanding.',
    resources: 'Watchtower study articles, JW.ORG articles, Bible stories',
    activity: 'Read assigned text, summarize main idea, identify supporting details.',
    topics: ['Main idea and supporting details', 'Making inferences from text', 'Cause and effect in Bible narratives', 'Compare and contrast — Bible characters', 'Sequence of events', 'Author\'s purpose', 'Fact vs opinion', 'Context clues', 'Reading fluency practice', 'Unit 2 Assessment']
  }, {
    startDay: 41,
    endDay: 60,
    title: 'Poetry and Figurative Language',
    verse: 'Ps 19:14',
    principle: 'The Psalms are master classes in figurative language, rhythm, and emotional expression.',
    resources: 'Book of Psalms, Proverbs',
    activity: 'Identify poetic devices; write short poems using the same devices.',
    topics: ['What is poetry?', 'Simile and metaphor in Psalms', 'Personification in scripture', 'Alliteration and repetition', 'Imagery', 'Parallelism in Hebrew poetry', 'The Beatitudes as poetry', 'Acrostic poetry (Psalm 119)', 'Writing scripture-inspired poetry', 'Unit 3 Assessment']
  }, {
    startDay: 61,
    endDay: 90,
    title: 'Grammar Mastery',
    verse: 'Prov 25:11',
    principle: 'A word at the right time is as beautiful as golden apples — grammar makes our speech precise.',
    resources: 'New World Translation (NWT) passages, wol.jw.org Watchtower & Awake! articles for analysis',
    activity: 'Diagram sentences, correct errors, write grammatically precise paragraphs.',
    topics: ['Nouns: common, proper, collective', 'Pronouns and antecedents', 'Action vs linking verbs', 'Verb tenses', 'Subject-verb agreement', 'Adjective phrases and clauses', 'Adverb phrases and clauses', 'Prepositions', 'Conjunctions', 'Complex sentence patterns', 'Paragraph structure', 'Unit assessment']
  }, {
    startDay: 91,
    endDay: 120,
    title: 'Literature and Analysis',
    verse: 'Eccl 12:12',
    principle: 'Studying great literature trains the mind to think clearly and communicate powerfully.',
    resources: 'Grade-appropriate literature, Bible narratives',
    activity: 'Read chapters, answer discussion questions, write literary analysis paragraphs.',
    topics: ['Elements of fiction: plot, character, setting, theme', 'Character development', 'Point of view', 'Theme vs topic', 'Types of conflict', 'Irony and foreshadowing', 'Symbolism in literature and the Bible', 'Reading the Bible as literature', 'Analyzing JW testimonies', 'Unit assessment']
  }, {
    startDay: 121,
    endDay: 150,
    title: 'Vocabulary and Word Study',
    verse: 'Prov 15:23',
    principle: 'Well-chosen words are a gift — the Bible gives us the richest vocabulary of all.',
    resources: 'JW publications, Bible concordance, vocabulary workbooks',
    activity: 'Word maps, etymologies, usage in sentences.',
    topics: ['Root words: Greek and Latin roots', 'Prefixes: un-, re-, pre-, dis-', 'Suffixes: -tion, -ment, -ful, -less', 'Word families', 'Synonyms and antonyms', 'Connotation vs denotation', 'Biblical vocabulary: covenant, atonement, righteousness', 'JW vocabulary: theocratic, Armageddon, paradise', 'Context clues strategy', 'Dictionary and concordance skills', 'Vocabulary assessment']
  }, {
    startDay: 151,
    endDay: 180,
    title: 'Communication and Presentation',
    verse: 'Eccl 3:7',
    principle: 'There is a time to speak — Jehovah\'s people must speak clearly, confidently, and lovingly.',
    resources: 'JW Public Talk outline examples',
    activity: 'Plan and deliver short presentations on Biblical topics.',
    topics: ['Elements of effective communication', 'Oral vs written communication', 'Preparing a Bible-based talk', 'Introduction: hook, thesis, preview', 'Body: main points with scripture support', 'Conclusion: summary and application', 'Voice, pace, and emphasis', 'Eye contact and body language', 'Answering questions', 'Final presentation project']
  }],
  math: [{
    startDay: 1,
    endDay: 20,
    title: 'Number Sense and Operations',
    verse: 'Prov 11:1',
    principle: 'Jehovah is a God of order — numbers and patterns reflect His perfect design.',
    resources: 'NWT (measurements, numbers & counting scriptures), Insight on the Scriptures (“Weights and Measures,” “Numbers”), notebook',
    activity: 'Complete 15 practice problems; word problems use JW real-world scenarios.',
    topics: ['Place value review', 'Addition and subtraction', 'Multiplication facts', 'Division — fair shares', 'Order of operations', 'Factors and multiples', 'Prime and composite numbers', 'Greatest common factor', 'Least common multiple', 'Unit 1 Test']
  }, {
    startDay: 21,
    endDay: 45,
    title: 'Fractions, Decimals, Percentages',
    verse: '1 Cor 12:12',
    principle: 'Parts and wholes — like the parts of the body of Christ working together.',
    resources: 'Insight on the Scriptures (“Weights and Measures”), NWT Appendix B, measuring tools',
    activity: 'Fraction operations, decimal conversions, percentage word problems.',
    topics: ['Fractions — meaning and forms', 'Equivalent fractions', 'Comparing fractions', 'Adding fractions same denominator', 'Adding fractions different denominators', 'Subtracting fractions', 'Multiplying fractions', 'Dividing fractions', 'Fractions to decimals', 'Decimal place value', 'Adding/subtracting decimals', 'Multiplying decimals', 'Dividing decimals', 'Percents — understanding', 'Percent of a number', 'Finding the whole', 'Unit test']
  }, {
    startDay: 46,
    endDay: 65,
    title: 'Geometry and Measurement',
    verse: 'Ezek 40:3',
    principle: 'Jehovah used geometry in the tabernacle and temple — perfect measurements matter.',
    resources: 'Ruler, protractor, compass, graph paper',
    activity: 'Measure, calculate, and draw geometric figures.',
    topics: ['Points, lines, planes', 'Angles — types and measurement', 'Triangles — types and properties', 'Quadrilaterals', 'Polygons', 'Circles — radius, diameter, circumference', 'Area of rectangles', 'Area of triangles', 'Area of circles', 'Perimeter', 'Volume of rectangular prisms', 'Unit test']
  }, {
    startDay: 66,
    endDay: 90,
    title: 'Algebra Foundations',
    verse: 'Dan 2:28',
    principle: 'Variables and unknowns — like the mysteries Jehovah reveals progressively to His people.',
    resources: 'NWT scriptures on wisdom & order, Insight on the Scriptures, graph paper',
    activity: 'Solve equations, graph functions, write algebraic expressions.',
    topics: ['Variables and expressions', 'Evaluating expressions', 'Writing equations', 'Solving one-step equations', 'Solving two-step equations', 'Inequalities', 'Graphing on a number line', 'Coordinate plane', 'Plotting points', 'Graphing linear equations', 'Slope', 'y-intercept', 'Writing linear equations', 'Systems introduction', 'Unit test']
  }, {
    startDay: 91,
    endDay: 115,
    title: 'Data, Statistics, and Probability',
    verse: 'Matt 16:3',
    principle: 'Understanding patterns in data — like reading the signs of the times.',
    resources: 'Graph paper, calculator',
    activity: 'Collect data, create graphs, calculate statistics.',
    topics: ['Organizing data', 'Bar graphs', 'Line graphs', 'Circle graphs', 'Histograms', 'Mean, median, mode', 'Range and outliers', 'Box and whisker plots', 'Probability basics', 'Probability fractions', 'Probability experiments', 'Theoretical vs experimental', 'Unit test']
  }, {
    startDay: 116,
    endDay: 150,
    title: 'Ratios, Proportions, and Scale',
    verse: 'Gen 6:15',
    principle: 'Proportionality — Noah\'s ark, temple measurements — divine proportion.',
    resources: 'See the Good Land maps, Insight on the Scriptures (“Weights and Measures”), scale drawing tools',
    activity: 'Set up and solve proportions; create scale drawings.',
    topics: ['What is a ratio?', 'Equivalent ratios', 'Unit rates', 'Proportions — cross multiplication', 'Scale drawings', 'Maps and scale', 'Indirect measurement', 'Percent as proportion', 'Percent increase and decrease', 'Discount and markup', 'Tax and tip', 'Simple interest', 'Unit test']
  }, {
    startDay: 151,
    endDay: 180,
    title: 'Year Review and Problem Solving',
    verse: 'Matt 7:24',
    principle: 'Applying wisdom — all we\'ve learned put into practice, like the wise builder.',
    resources: 'Full-year notes, NWT, Insight on the Scriptures',
    activity: 'Multi-step word problems, math projects, year-end assessment.',
    topics: ['Multi-step word problems', 'Problem-solving strategies', 'Real-life math — congregation event budgeting', 'Review: fractions and decimals', 'Review: geometry', 'Review: algebra', 'Review: data and statistics', 'Year-end project', 'Final exam review', 'Final assessment']
  }],
  history: [{
    startDay: 1,
    endDay: 25,
    title: 'Ancient Civilizations and Bible Prophecy',
    verse: 'Isa 46:9-10',
    principle: 'History is HIS story — Jehovah has directed events from the beginning.',
    resources: 'Bible Atlas, "Pay Attention to Daniel\'s Prophecy" (jw.org)',
    activity: 'Map ancient civilizations; connect historical events to Bible prophecy.',
    topics: ['What is history? Why does it matter?', 'Ancient Middle East — cradle of civilization', 'Mesopotamia: Babylon and Bible prophecy', 'Egypt: the Exodus', 'The Israelite kingdoms', 'Assyrian Empire — fulfilled prophecy', 'Babylonian Empire — Daniel\'s prophecy', 'Medo-Persian Empire — Cyrus', 'Ancient Greece — Daniel 8', 'Rome — the fourth world power', 'Roman Empire and early Christianity', 'Fall of Rome — fulfilled prophecy', 'The Middle Ages', 'The Crusades', 'Renaissance and Reformation', 'Unit assessment']
  }, {
    startDay: 26,
    endDay: 50,
    title: 'Jehovah\'s People Through History',
    verse: 'Ps 94:14',
    principle: 'Jehovah never abandoned His people — their history shows His faithful love.',
    resources: '"Jehovah\'s Witnesses — Proclaimers of God\'s Kingdom" (jw.org)',
    activity: 'Timeline projects; research and present on a period of JW history.',
    topics: ['Bible Students in the 1870s', 'Charles Taze Russell and Bible study groups', 'Early preaching work', 'Persecution in World War I', 'Rutherford and organizational growth', 'WWII persecution', 'Concentration camps — faithful witnesses', 'Post-war expansion', 'Modern organization and growth', '180+ countries — preaching worldwide', 'Legal victories for religious freedom', 'What history teaches about loyalty', 'Review', 'Unit assessment']
  }, {
    startDay: 51,
    endDay: 80,
    title: 'American History in Biblical Context',
    verse: 'Dan 4:17',
    principle: 'Nations rise and fall by Jehovah\'s permission.',
    resources: 'See the Good Land, Insight on the Scriptures, NWT, jw.org / wol.jw.org (Watchtower & Awake! history articles)',
    activity: 'Document analysis; connect events to Proverbs 14:34.',
    topics: ['Colonial America — religious freedom', 'American Revolution', 'The Constitution', 'The Bill of Rights and JW legal cases', 'Slavery — a moral failure', 'The Civil War', 'Reconstruction', 'Industrial Revolution', 'Immigration', 'World War I — Christian neutrality', 'World War II', 'JW experiences in WWII America', 'Civil Rights Movement', 'The Cold War', 'Modern America and morality', 'Unit assessment']
  }, {
    startDay: 81,
    endDay: 110,
    title: 'World History — Nations in Prophecy',
    verse: 'Rev 17:8',
    principle: 'The rise and fall of nations fulfills Bible prophecy precisely.',
    resources: 'See the Good Land, Insight on the Scriptures, NWT, “Pay Attention to Daniel’s Prophecy!” (jw.org)',
    activity: 'Map global events to Daniel 2 statue and Revelation prophecies.',
    topics: ['Asia — ancient China and India', 'Africa — historical context', 'The Ottoman Empire', 'The British Empire', 'World War I — causes', 'The League of Nations', 'World War II', 'The United Nations — Rev 17:8', 'The Cold War', 'Decolonization', 'The modern Middle East', 'China\'s rise', 'Environmental history', 'Modern conflicts — Matt 24', 'The world stage today', 'Unit assessment']
  }, {
    startDay: 111,
    endDay: 140,
    title: 'Economics and Stewardship',
    verse: 'Luke 14:28',
    principle: 'Jehovah\'s principles of stewardship and generosity are the foundation of good economics.',
    resources: 'NWT Proverbs & Ecclesiastes, Insight on the Scriptures, wol.jw.org (Watchtower & Awake! articles on money & work)',
    activity: 'Budget projects, economic analysis, real-world application.',
    topics: ['What is economics?', 'Supply and demand', 'Economic systems', 'The biblical view of money', 'Poverty and wealth in the Bible', 'Debt — Proverbs warns us', 'Interest and banking — biblical history', 'Trade and globalization', 'Government and economics', 'Taxation — Matt 22:21', 'Charity and generosity', 'Budgeting a household', 'The congregation — how it operates', 'Economic inequality — biblical response', 'Unit assessment']
  }, {
    startDay: 141,
    endDay: 180,
    title: 'Government, Law, and Citizenship',
    verse: 'Rom 13:1-2',
    principle: 'Jehovah is the ultimate lawgiver — all human law reflects or departs from His standard.',
    resources: 'NWT (Romans 13; Acts 5:29), Insight on the Scriptures (“Law,” “Government”), jw.org Legal Developments / news pages',
    activity: 'Study landmark court cases involving JW religious freedom.',
    topics: ['Types of government', 'Democracy — strengths and weaknesses', 'Theocracy — Jehovah\'s system', 'The rule of law', 'Constitutional law basics', 'Freedom of religion', 'Landmark JW Supreme Court cases', 'Civil liberties and their limits', 'International law', 'Governments and persecution', 'Obeying law vs obeying God (Acts 5:29)', 'Conscientious objector status', 'Criminal vs civil law', 'The future government — God\'s Kingdom', 'Year review and assessment']
  }],
  comp: [{
    startDay: 1,
    endDay: 20,
    title: 'Foundation of Written Communication',
    verse: 'Rev 1:19',
    principle: 'Jehovah communicated His will through written words — writing is a sacred skill.',
    resources: 'NWT, wol.jw.org, personal journal/binder',
    activity: 'Write daily; each assignment builds on the previous day.',
    topics: ['Why we write — Jehovah\'s example', 'The writing process: prewrite, draft, revise, edit, publish', 'Audience and purpose', 'Paragraph structure', 'Transition words and flow', 'Sentence variety', 'Show don\'t tell — vivid language', 'Word choice — precision and clarity', 'Proofreading and editing', 'Unit 1 published writing piece']
  }, {
    startDay: 21,
    endDay: 40,
    title: 'Personal Narrative Writing',
    verse: 'Ps 71:18',
    principle: 'Our personal experiences — especially of Jehovah\'s care — are worth writing down.',
    resources: 'Journal, published JW testimonies from Watchtower/Awake',
    activity: 'Write, revise, and publish a personal narrative about a faith experience.',
    topics: ['What is a personal narrative?', 'Finding your story — brainstorming', 'Setting the scene', 'Introducing yourself as narrator', 'Rising action — the challenge', 'The turning point', 'Resolution', 'Reflection — what you learned', 'Revision: dialogue and sensory details', 'Final: publish and share']
  }, {
    startDay: 41,
    endDay: 65,
    title: 'Expository Writing — Explaining Clearly',
    verse: 'Acts 18:28',
    principle: 'Explaining the truth clearly — as Apollos was powerful in the scriptures.',
    resources: 'JW.ORG research tools, encyclopedias',
    activity: 'Write a multi-paragraph expository essay on a JW doctrine or Biblical topic.',
    topics: ['What is expository writing?', 'Choosing a topic and thesis', 'Research — finding credible sources', 'Note-taking strategies', 'Outline your essay', 'Introduction: hook, background, thesis', 'Body paragraphs — main point + evidence', 'Counterargument and rebuttal', 'Conclusion: restate, synthesize, call to action', 'Citations and references', 'Revision', 'Peer review', 'Final expository essay']
  }, {
    startDay: 66,
    endDay: 90,
    title: 'Persuasive Writing',
    verse: 'Acts 17:2',
    principle: 'Paul reasoned from the scriptures to persuade — we must persuade with words.',
    resources: 'NWT, Love People—Make Disciples, jw.org Bible Teachings articles',
    activity: 'Write a persuasive essay defending a Biblical position.',
    topics: ['What is persuasive writing?', 'Logos, ethos, pathos', 'Choosing a position', 'Finding your strongest arguments', 'Anticipating the opposition', 'Thesis: clear position statement', 'Body: argument + scripture evidence', 'Addressing counterarguments', 'Emotional appeal — telling stories', 'Logical fallacies to avoid', 'Revision', 'Peer feedback', 'Final persuasive essay']
  }, {
    startDay: 91,
    endDay: 110,
    title: 'Research Writing',
    verse: '2 Tim 2:15',
    principle: 'Study to show yourself approved — thorough research honors Jehovah.',
    resources: 'JW.ORG library, Bible concordance',
    activity: 'Complete a research paper on a Bible topic using multiple sources.',
    topics: ['Choosing a research topic', 'Developing research questions', 'Finding and evaluating sources', 'Note-taking: paraphrase vs quote', 'Creating an outline', 'Introduction with thesis', 'Integrating citations', 'Body paragraphs with evidence', 'Synthesis across sources', 'Conclusion', 'Works cited page', 'Revision and editing', 'Peer review', 'Final research paper']
  }, {
    startDay: 111,
    endDay: 135,
    title: 'Creative Writing',
    verse: 'Gen 1:1',
    principle: 'Jehovah is the ultimate Creator — made in His image, we create too.',
    resources: 'NWT Bible narratives, Love People—Make Disciples, jw.org Bible stories & Awake! experiences',
    activity: 'Write short stories, poetry, and creative pieces with Biblical themes.',
    topics: ['Elements of fiction', 'Character creation', 'Setting and world-building', 'Plot structure', 'Dialogue writing', 'Point of view', 'Conflict and resolution', 'Writing with sensory details', 'Short story: first draft', 'Revision: character depth', 'Revision: dialogue polish', 'Pacing', 'Peer workshop', 'Final story published', 'Poetry unit']
  }, {
    startDay: 136,
    endDay: 180,
    title: 'Practical Writing — Letters and More',
    verse: '1 Cor 16:21',
    principle: 'Letters changed the world — Paul\'s letters built congregations. Our letters matter too.',
    resources: 'Letter-writing guide, email etiquette guide',
    activity: 'Write formal letters, thank-you notes, emails, and a letter to Bethel.',
    topics: ['Formal letter format', 'Business vs personal letter', 'The thank-you letter', 'Letter of inquiry', 'The complaint letter — respectful tone', 'Letter of recommendation', 'Email etiquette', 'Application letters', 'Writing to Bethel — what to include', 'Letter revision', 'Resume basics (grades 11-12)', 'Cover letter (grades 11-12)', 'Technical writing introduction', 'Year-end writing portfolio']
  }],
  art: [{
    startDay: 1,
    endDay: 20,
    title: 'Principles of Design — Jehovah\'s Aesthetic',
    verse: 'Exod 31:3-4',
    principle: 'Beauty is Jehovah\'s gift — the tabernacle\'s design shows God values beauty.',
    resources: 'Art supply kit (pencils, paper), NWT, Insight on the Scriptures (“Tabernacle,” “Temple”)',
    activity: 'Study the principle, then create a small artwork applying it.',
    topics: ['What is art? Jehovah — the first artist', 'Line — contour, gesture, expression', 'Shape vs form', 'Value — light and shadow', 'Color theory — primary, secondary, tertiary', 'Color emotions — warm vs cool', 'Texture — real and implied', 'Space — positive and negative', 'Balance — symmetrical and asymmetrical', 'Unity and variety — unit artwork']
  }, {
    startDay: 21,
    endDay: 40,
    title: 'Drawing Fundamentals',
    verse: 'Job 38:4',
    principle: 'Drawing trains the eye to see as Jehovah sees — the details in creation.',
    resources: 'Sketchbook, pencils HB-4B, reference photos of nature',
    activity: 'Daily drawing exercises and observation sketches.',
    topics: ['Basic shapes in everything', 'Gesture drawing', 'Contour line drawing', 'Observational drawing — still life', 'Perspective: one-point', 'Perspective: two-point', 'Drawing hands and figures', 'Drawing from imagination', 'Nature drawing — Jehovah\'s creation', 'Drawing unit portfolio']
  }, {
    startDay: 41,
    endDay: 60,
    title: 'Color and Painting',
    verse: 'Gen 9:13',
    principle: 'The rainbow is Jehovah\'s covenant — color carries meaning and promise.',
    resources: 'Watercolor or acrylic paints, brushes, paper',
    activity: 'Paint small studies exploring color relationships and techniques.',
    topics: ['Color wheel — mixing primary colors', 'Tints and shades', 'Complementary colors', 'Analogous color schemes', 'Warm color painting', 'Cool color painting', 'Blending and gradients', 'Painting a sunset', 'Painting from a Psalm (abstract)', 'Color portfolio']
  }, {
    startDay: 61,
    endDay: 80,
    title: 'Art History — Connecting to Faith',
    verse: '1 John 5:21',
    principle: 'Art has been used to glorify Jehovah and also to promote false worship — we learn to discern.',
    resources: 'See the Good Land, Insight on the Scriptures, JW.ORG images of Bible lands',
    activity: 'Study an artwork each day — identify technique and purpose.',
    topics: ['Ancient art — early symbolism', 'Egyptian art — idolatry and truth', 'Greek and Roman art', 'Byzantine art — iconography', 'The Renaissance', 'Baroque art', 'Impressionism', 'Modern art', 'JW.ORG illustration style', 'Art history timeline project']
  }, {
    startDay: 81,
    endDay: 100,
    title: 'Illustration and Storytelling',
    verse: 'Prov 1:6',
    principle: 'JW publications use beautiful illustration to teach truth — words and images together.',
    resources: 'JW publications, Bible story book, tracing paper',
    activity: 'Create illustrated pages for a Bible story in JW publication style.',
    topics: ['Sequential art — panels and flow', 'Storyboarding a Bible story', 'Character design', 'Background design', 'Light and shadow in illustration', 'Color in storytelling', 'Lettering and text integration', 'Illustrating a Psalm', 'Illustrating a parable', 'Final illustrated Bible story page']
  }, {
    startDay: 101,
    endDay: 120,
    title: 'Three-Dimensional Art',
    verse: 'Exod 35:31-32',
    principle: 'Bezalel worked in three dimensions for Jehovah\'s tabernacle — form and sculpture matter.',
    resources: 'Clay, cardboard, basic craft supplies',
    activity: 'Build 3D models: paradise scene, Bible setting, abstract forms.',
    topics: ['Introduction to 3D — sculpture basics', 'Clay hand-building: pinch method', 'Clay: coil method', 'Clay: slab method', 'Relief sculpture', 'Paper sculpture', 'Cardboard engineering', 'Creating a Bible setting in 3D', 'Nature-inspired sculpture', '3D portfolio display']
  }, {
    startDay: 121,
    endDay: 180,
    title: 'Personal Art Project and Portfolio',
    verse: '1 Pet 4:10',
    principle: 'Our talents are gifts from Jehovah — using them brings Him glory.',
    resources: 'All year\'s supplies, personal sketchbook',
    activity: 'Plan and complete a significant personal art project; build a portfolio.',
    topics: ['Choosing your project concept', 'Researching your subject', 'Sketching ideas and planning', 'Gathering materials', 'Beginning the project', 'Working session', 'Working session', 'Working session', 'Critique and revision', 'Working session', 'Assessment — nearly complete', 'Final completion', 'Matting and presentation', 'Artist statement', 'Portfolio review and year-end presentation']
  }],
  science: [{
    startDay: 1,
    endDay: 25,
    title: 'Creation — Jehovah\'s Masterpiece',
    verse: 'Ps 19:1',
    principle: 'The heavens declare Jehovah\'s glory — science is the study of His handiwork.',
    resources: 'NWT Genesis 1, Insight on the Scriptures (“Creation”), “The Origin of Life—Five Questions Worth Asking” & “Was Life Created?” (jw.org), Enjoy Life Forever!',
    activity: 'Observe, record, and marvel — scientific method meets creation appreciation.',
    topics: ['What is science? Faith and evidence', 'The scientific method', 'Origins: creation vs evolution', 'DNA — information demands a designer', 'The cell — irreducible complexity', 'Animal design — adaptation and intelligence', 'The human body — fearfully and wonderfully made', 'Physics of the universe — fine-tuned constants', 'Age of the earth — examining both sides', 'Fossils — what do they prove?', 'The Cambrian explosion', 'Bird migration — design and navigation', 'Echolocation — bats and dolphins', 'The immune system — complex defense', 'Plant biology — photosynthesis and provision', 'Water — designed for life', 'Chemistry basics', 'The periodic table', 'Review', 'Unit test']
  }, {
    startDay: 26,
    endDay: 50,
    title: 'Life Science — Biology',
    verse: 'Gen 1:21',
    principle: 'Every living thing reproduces after its kind — life is designed, not random.',
    resources: 'NWT Genesis 1, Psalm 139, Insight on the Scriptures (“Creation”), jw.org “Was It Designed?” articles, nature samples',
    activity: 'Observe specimens, draw biological diagrams, answer lab questions.',
    topics: ['Characteristics of living things', 'Cell structure and function', 'Prokaryotes vs eukaryotes', 'Cell division — mitosis', 'Chromosomes and heredity', 'Genetics — dominant and recessive traits', 'DNA structure', 'Mutations and genetic variation', 'Kingdoms of life — classification', 'The plant kingdom', 'The animal kingdom', 'Human body systems overview', 'Digestive system', 'Respiratory system', 'Circulatory system', 'Nervous system', 'Ecosystems and food webs', 'Jehovah\'s ecological balance', 'Review', 'Unit test']
  }, {
    startDay: 51,
    endDay: 75,
    title: 'Earth Science',
    verse: 'Isa 45:18',
    principle: 'Jehovah formed the earth and made it — He did not create it simply for nothing.',
    resources: 'NWT Job 38, Insight on the Scriptures (“Earth,” “Flood”), See the Good Land, map, globe, rock samples',
    activity: 'Map projects, rock collection, weather observation journals.',
    topics: ['Structure of the earth', 'Plate tectonics', 'Earthquakes and volcanoes', 'The rock cycle', 'Minerals and rocks', 'Weathering and erosion', 'Soil formation — Jehovah\'s provision', 'Water cycle', 'Weather systems', 'Climate vs weather', 'The atmosphere', 'Ocean science', 'Rivers and lakes', 'Deserts — survival design', 'Mountains — Psalm 121', 'Environmental stewardship — Gen 2:15', 'Review', 'Unit test']
  }, {
    startDay: 76,
    endDay: 100,
    title: 'Physical Science — Physics',
    verse: 'Isa 40:22',
    principle: 'Jehovah stretched out the heavens — the laws of physics are His laws.',
    resources: 'NWT Job 38–41, Psalm 19, Insight on the Scriptures, jw.org “Was It Designed?” articles, basic lab materials',
    activity: 'Simple experiments: forces, motion, energy; record observations.',
    topics: ['What is physics?', 'Matter and its states', 'Density and buoyancy', 'Forces — push and pull', 'Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Gravity — Jehovah\'s design for order', 'Friction and motion', 'Simple machines', 'Energy: potential and kinetic', 'Heat energy and temperature', 'Light — reflection and refraction', 'Sound waves', 'Electricity basics', 'Magnets', 'The electromagnetic spectrum', 'Review', 'Unit test']
  }, {
    startDay: 101,
    endDay: 125,
    title: 'Chemistry',
    verse: 'Job 38:4',
    principle: 'Jehovah prepared the earth with precisely the right chemical composition for life.',
    resources: 'NWT Genesis 1, Insight on the Scriptures (“Creation”), safe household experiment supplies',
    activity: 'Safe chemistry experiments: acids/bases, reactions, observations.',
    topics: ['What is chemistry?', 'Atoms — the building blocks', 'The periodic table', 'Elements, compounds, mixtures', 'Chemical vs physical changes', 'Chemical bonds', 'Acids and bases — pH', 'Neutralization reactions', 'Photosynthesis — chemical equation', 'Respiration — chemical equation', 'Combustion', 'Polymers', 'Metals and non-metals', 'Carbon — basis of life chemistry', 'Water chemistry', 'Lab safety rules', 'Measurement in chemistry', 'Review', 'Unit test']
  }, {
    startDay: 126,
    endDay: 155,
    title: 'Astronomy and Space',
    verse: 'Ps 147:4',
    principle: 'He counts the number of the stars; He calls them all by name.',
    resources: 'NWT Psalm 8 & 19, Isaiah 40:26, Insight on the Scriptures (“Heaven,” “Star”), jw.org videos, night sky',
    activity: 'Night sky observation journal; scale model of solar system.',
    topics: ['Our solar system overview', 'The sun — Jehovah\'s provision of energy', 'Mercury and Venus', 'Earth — the privileged planet', 'The moon — tides and light', 'Mars — what we know', 'Jupiter and Saturn', 'Uranus and Neptune', 'Comets and asteroids', 'Stars — classification and life cycle', 'The Milky Way galaxy', 'Other galaxies', 'The Big Bang — examining the evidence', 'The fine-tuned universe', 'Space exploration history', 'Is there life elsewhere? — Bible answer', 'Light years and cosmic scale', 'The heavens declare His glory — synthesis', 'Review', 'Astronomy test']
  }, {
    startDay: 156,
    endDay: 180,
    title: 'Environmental Science and Stewardship',
    verse: 'Gen 2:15',
    principle: 'Jehovah assigned man to cultivate and take care of the garden — stewardship is our mandate.',
    resources: 'NWT Genesis 1–2, Psalm 104, Insight on the Scriptures, jw.org Awake! nature articles, local nature',
    activity: 'Audit home energy use; plant something; write stewardship plan.',
    topics: ['What is an ecosystem?', 'Food chains and food webs', 'Biodiversity', 'Biomes of the world', 'Pollution — causes and consequences', 'Air pollution', 'Water pollution', 'Soil degradation', 'Deforestation', 'Renewable energy', 'Conservation practices', 'Sustainable living', 'Jehovah\'s coming restoration — Rev 11:18', 'Paradise earth — ecological perfection', 'What we can do now', 'Year-end science project', 'Final assessment']
  }]
};

// ─── DETAILED LESSONS — Days 1-3 per subject, all 4 grade levels ──────────────
const DETAILED_LESSONS = {
  lang: {
    1: {
      4: {
        focus: 'Language is Jehovah\'s Gift',
        script: 'Open with Genesis 11:1 — "All the earth had one language." Ask Mykah: "Before Babel, everyone spoke the same way. What does that tell us about where language came from?" Today we learn the building blocks. Hold up a book: "Every word is made of letters. Every sentence is made of words." Chart: Letter → Word → Sentence → Paragraph → Story.',
        activity: 'Write your full name in big letters. Draw one thing you can see. Write one sentence about it. Read it aloud to the class.',
        answerKey: {
          short: 'Language is Jehovah\'s gift to humans — He gave us the ability to speak and communicate. Genesis 11:1 shows one original language came from Jehovah.',
          long: 'Genesis 11:1 tells us the whole earth had one language before the Tower of Babel. This shows Jehovah gave humans the unique gift of complex language — animals communicate but not with the depth and flexibility of human speech. After Babel, Jehovah created multiple languages, showing His power over all human ability. Today we honor that gift by learning to use it well. The building blocks of language are: letters form words, words form sentences, sentences form paragraphs, paragraphs form complete works. Mastering each level is how we communicate as precisely and beautifully as Jehovah intended when He gifted us this ability.'
        }
      },
      8: {
        focus: 'Parts of Speech Review — Grammar Foundation',
        script: 'Read Philippians 4:8 aloud. Ask: "Paul uses many powerful words — \'true,\' \'righteous,\' \'lovable.\' What kind of words are those?" After responses: "Adjectives. Today we review all 8 parts of speech using Bible verses as examples." Demonstrate each with one specific verse.',
        activity: 'Rewrite Philippians 4:8. Above each word write its part of speech: N=noun, V=verb, ADJ=adjective, ADV=adverb, PREP=preposition, CONJ=conjunction, PRON=pronoun, INTERJ=interjection.',
        answerKey: {
          short: 'The 8 parts of speech: noun, pronoun, verb, adjective, adverb, preposition, conjunction, interjection. Every English word fits one of these categories.',
          long: 'The eight parts of speech are the foundation of English grammar. Nouns name people, places, things, or ideas (Jehovah, earth, love). Pronouns replace nouns (He, she, it — even God used pronouns: "Let US make man," Genesis 1:26). Verbs express action or state of being (created, is, became). Adjectives describe nouns (faithful, holy, righteous). Adverbs modify verbs, adjectives, or other adverbs (truly, righteously). Prepositions show relationships (in, on, through, by). Conjunctions connect words or clauses (and, but, for, because). Interjections express emotion (Hallelujah! Amen!). Understanding these categories enables us to read and write with precision — honoring Jehovah\'s gift of language.'
        }
      },
      11: {
        focus: 'Advanced Grammar — Rhetoric and Style',
        script: 'Read Romans 8:38-39 dramatically. Ask: "What technique is Paul using here? What effect does it create?" Discuss anaphora and parallelism as rhetorical devices. Great writers — and the Bible — use grammar not just correctly but artistically.',
        activity: 'Find 3 rhetorical devices in a Watchtower article of your choosing. Write a paragraph explaining the effect of each device on the reader.',
        answerKey: {
          short: 'Rhetorical devices like anaphora, parallelism, and chiasm are used in the Bible to create emphasis, beauty, and memorability. Grammar serves both correctness and artistry.',
          long: 'Advanced grammar includes understanding rhetorical effect. Anaphora is the repetition of words at the beginning of successive clauses — Paul uses this masterfully in Romans 8:38-39 to build a crescendo of assurance. Parallelism balances grammatically equivalent structures — Proverbs is built on parallelism. Chiasm is a mirror-structure (A-B-B-A) common in Hebrew poetry. Periodic sentences hold the main clause to the end, building tension. Rhetorical questions engage the reader. A skilled writer uses grammar not just to communicate correctly but to shape emotion, emphasize key ideas, and create lasting impressions — exactly as the Bible\'s inspired writers did under Jehovah\'s direction.'
        }
      },
      12: {
        focus: 'Language and Worldview — How Words Shape Thought',
        script: 'Open with Genesis 1 — Jehovah SPOKE the world into existence. Ask Ryan: "What does it mean that God used language to create?" Discuss the Sapir-Whorf hypothesis, then connect to 2 Corinthians 10:5 — "take every thought captive." Words shape how we think. How does Biblical language differ from secular language in discussing death, truth, and identity?',
        activity: 'Write a 2-paragraph analysis: Compare how secular media discusses death vs how the Bible discusses it. What language does each use? What worldview does each reveal?',
        answerKey: {
          short: 'Language is not neutral — words reveal and reinforce worldview. Biblical language about death (sleep, resurrection, hope) differs profoundly from secular language, reflecting fundamentally different worldviews.',
          long: 'The Sapir-Whorf hypothesis suggests language shapes thought — words available to us influence how we perceive reality. Secular culture uses euphemisms (passing away, gone to a better place) reflecting uncertainty about death; the Bible uses clear language (sleep, resurrection, Sheol) based on clear theological foundation. The culture says "my truth" while the Bible speaks of "THE truth" (John 14:6) — individualism vs absolute truth. Paul warned to take every thought captive to Christ (2 Cor 10:5) — this requires evaluating language around us. Satan blinds minds through cultural language (2 Cor 4:4). The Christian exercises careful attention to language — using Biblical terms precisely and recognizing how secular language subtly shapes thinking away from Jehovah\'s truth.'
        }
      }
    },
    2: {
      4: {
        focus: 'Nouns — Naming Everything in Creation',
        script: 'Ask Mykah: "Can you name 5 things in this room?" List them. "These are all nouns — naming words! Genesis 2:19-20 says God gave Adam the job of naming the animals — that\'s the first time nouns were used!" Explain common nouns (cat, tree) vs proper nouns (Mykah, Jehovah, York). Practice together: "I say a noun, you tell me if it\'s common or proper."',
        activity: 'Noah\'s Ark Noun Hunt: List 10 animals from Genesis. Circle proper nouns. Write 5 sentences, each with a different noun. Read them aloud.',
        answerKey: {
          short: 'A noun is a naming word — it names a person, place, thing, or idea. Common nouns name general things (dog, city). Proper nouns name specific things and are always capitalized (Jehovah, Jerusalem).',
          long: 'A noun is one of the most fundamental parts of speech — it names everything in our world. Common nouns name general things without specifying which one: animal, river, day. Proper nouns name specific people, places, or organizations and are always capitalized: Jehovah (the specific name of God), Jerusalem (the specific city), the Bible. Collective nouns name groups: a congregation, a flock, an army. Abstract nouns name ideas: love, faith, hope, righteousness. Concrete nouns name things we can touch. Genesis 2:19-20 records Adam naming every living creature — the first proper nouns in human history. Mastering nouns helps us communicate precisely, which honors Jehovah\'s gift of language.'
        }
      },
      8: {
        focus: 'Verb Tenses — Time and Scripture',
        script: 'Read John 11:35 — "Jesus wept." What tense? (past). John 3:16 — "God so loved..." — what tense? Then Exodus 3:14 — "I AM THAT I AM." Why does God use present tense for His own name? Cover all 6 main tenses with Bible examples.',
        activity: 'Take the verb "to love." Write one sentence for each of the 6 tenses (simple past, past progressive, simple present, present progressive, simple future, future progressive) using Jehovah or Jesus as the subject.',
        answerKey: {
          short: 'The six main tenses: simple past, past progressive, simple present, present progressive, simple future, future progressive. God\'s name "I AM" in Exodus 3:14 uses present tense to show His eternal, unchanging existence across all time.',
          long: 'Verb tense locates action in time. Simple past (wept, loved) describes completed actions — Jesus wept at Lazarus\'s tomb. Present progressive (is weeping) shows ongoing current action. Simple future (will come) describes prophecy. Jehovah\'s name "YHWH" (I AM) or "Jehovah" (He Causes to Become) is rooted in the Hebrew verb "to be" in an imperfect form suggesting continuous existence. This is why Revelation 1:8 calls Him the one "who is and who was and who is coming" — all tenses encompassing eternity. Understanding tense helps us read prophecy, history, and promise in the Bible with proper understanding.'
        }
      },
      11: {
        focus: 'Sentence Variety and Sophistication',
        script: 'Read Romans 8:1-4 vs 1 John 4:7-8. Ask Kayla: "Why do these two inspired writers sound so different?" Discuss how sentence variety reflects personality and purpose. Vary: sentence length (short for impact, long for complexity), sentence type (simple, compound, complex, compound-complex), and sentence openings.',
        activity: 'Rewrite a paragraph from the Watchtower in three different styles: Paul\'s complex style, John\'s simple style, and James\'s direct style. Evaluate which worked best and why.',
        answerKey: {
          short: 'Sophisticated writers vary sentence length, type, and structure. Short sentences create impact; longer complex sentences develop nuanced ideas. The four types (simple, compound, complex, compound-complex) each serve different purposes.',
          long: 'Sentence variety is a hallmark of mature writing. Simple sentences punch hard: "God is love." Compound sentences show equal ideas in balance: "Paul planted, but Apollos watered, yet God kept making it grow." Complex sentences show relationships: "Although persecution intensified, the brothers continued to preach." Varying sentence openings prevents monotony — beginning with participial phrases, prepositional phrases, or adverb clauses creates rhythm and interest. Reading the Bible reveals that inspired writers used sentence variety intentionally for effect, reflecting both their distinct personalities and the guidance of Jehovah\'s spirit.'
        }
      },
      12: {
        focus: 'Syntax and Semantics — The Architecture of Meaning',
        script: '"The man saw the woman with the telescope." Ask Ryan: "How many meanings does this have?" (Two). This is structural ambiguity — syntax (arrangement of words) vs semantics (meaning of words). Bible translators wrestle with both — one Greek or Hebrew word can carry layered meanings English can\'t capture in a single word.',
        activity: 'Research the Greek word "agape" (love) and compare its semantic range to the English word "love." Write a 3-paragraph analysis explaining what is lost in translation and what tools help recover meaning.',
        answerKey: {
          short: 'Syntax is the arrangement of words; semantics is the study of meaning. Both are critical to accurate communication. Bible translation requires mastery of both because ancient languages have different syntactic structures and richer semantic ranges than modern English.',
          long: 'Syntax — word arrangement rules — determines meaning as much as word choice does. "The dog bit the man" and "The man bit the dog" use identical words but opposite meanings through different syntax. Semantics studies meaning at every level: lexical (individual word), sentential (full sentence), and pragmatic (context-dependent). The Greek word "agape" covers a semantic field of unconditional, selfless love that English\'s "love" cannot capture — English uses it for everything from romance to pizza. Hebrew "shalom" means not just peace but wholeness, completeness, prosperity — again untranslatable in one English word. A senior study of language recognizes that meaning is always richer than any single translation captures, which is why studying original languages and multiple translations deepens understanding of Jehovah\'s word.'
        }
      }
    }
  },
  math: {
    1: {
      4: {
        focus: 'Place Value — Jehovah\'s Order in Numbers',
        script: 'Ask Mykah: "If I have 1,000 brothers and sisters at a circuit assembly, and 100 came from our congregation, how do I write 1,100?" Write it out. "Every digit sits in a PLACE — like everyone has a place in the congregation!" Explain place value: ones, tens, hundreds, thousands. Use congregation numbers, assembly attendance, and pioneer hours as examples.',
        activity: 'Place Value Congregation Math: (1) Our congregation has 67 publishers. What\'s the tens digit? The ones digit? (2) The assembly hall holds 2,450 people. Write in expanded form: 2,000+___+___+___. (3) Write three 4-digit numbers that could be assembly attendance. Read each aloud.',
        answerKey: {
          short: 'Place value means each digit in a number has a value based on its position. From right to left: ones, tens, hundreds, thousands. 2,450 = 2,000+400+50+0.',
          long: 'Place value is the system that gives each digit its specific value based on position, not just the digit itself. In base-10, each place is worth 10 times the place to its right. In 2,450: the 2 (thousands place) = 2,000; the 4 (hundreds place) = 400; the 5 (tens place) = 50; the 0 (ones place) = 0. Expanded form writes out each value. Understanding place value is essential for all arithmetic operations. Jehovah is a God of perfect order (1 Cor 14:40), and our number system reflects that — every digit has its proper place and proper value, just as every person in the congregation has their proper place and role.'
        }
      },
      8: {
        focus: 'Integer Operations and Absolute Value',
        script: 'Ask Ashelyn: "If the temperature is -5° and rises 8°, what is it now?" Work through it. Introduce the number line, negative numbers, and absolute value. Real-world context: if a congregation\'s spending was $2,000 but receipts were only $1,500, the deficit is -$500. Absolute value represents magnitude regardless of direction.',
        activity: 'Integer Practice: (1) A missionary arrived with $300, spent $450 on travel. Balance: ___. (2) Temperature was -12° at night; rose 20° by noon. Final: ___. (3) Find absolute value of -17, -4, 0, 25, -100. (4) Order from least to greatest: -8, 3, -12, 0, 7, -1.',
        answerKey: {
          short: 'Integers include all whole numbers and their negatives. Same-sign addition: add and keep the sign. Different-sign addition: subtract smaller absolute value from larger, keep sign of larger. Absolute value is distance from zero — always positive.',
          long: 'Integers are the set of whole numbers and their opposites including zero. They represent quantities with direction: debt (-) vs savings (+), below zero (-) vs above (+). Addition rules: two positives give a positive sum; two negatives give a negative sum; different signs require finding the difference and assigning the sign of the larger absolute value (-3 + 8 = +5 because |8| > |3|, and 8 is positive). Absolute value |n| represents magnitude — |-17| = 17 because -17 is 17 steps from zero. Integer operations appear constantly in real life: budgeting, temperature changes, elevation — all practical scenarios Proverbs 27:23 urges us to understand well.'
        }
      },
      11: {
        focus: 'Function Notation and Domain/Range',
        script: 'Ask Kayla: "If Jehovah says He will never leave us, that\'s a relationship: whatever our situation (input), His faithfulness (output) remains constant. A function works the same way — every input has exactly one output." Write f(x) = 2x + 3. Explain notation, domain (all valid inputs), and range (all possible outputs).',
        activity: '(1) Evaluate f(x) = 3x² - 2x + 1 for x = -2, 0, 3, 5. (2) Determine if each relation is a function and state domain/range: {(1,2),(2,3),(3,4)}, {(1,2),(1,3),(2,4)}, {(-1,0),(0,1),(1,2)}. (3) Write m(x) = 0.67x for mileage reimbursement. Find m(50), m(120), m(250).',
        answerKey: {
          short: 'A function is a relationship where each input produces exactly one output. Notation f(x) means "the value of function f at input x." Domain = all valid inputs; range = all resulting outputs. A relation is a function if and only if no x-value is repeated with a different y-value.',
          long: 'A function is a specific mathematical relation where each domain element is paired with exactly one range element. f(x) — read "f of x" — means "function f evaluated at input x," not "f times x." So f(3) means substitute 3 for x and compute. The vertical line test: if any vertical line intersects the graph in more than one point, the relation is NOT a function. Domain is the complete set of allowable inputs; range is all outputs the function actually produces. For m(x) = 0.67x: m(50) = $33.50; m(120) = $80.40; m(250) = $167.50. Functions are the language of relationships in mathematics — every formula, physical law, and statistical model is a function, reflecting Jehovah\'s perfectly ordered creation where causes reliably produce effects.'
        }
      },
      12: {
        focus: 'Limits and Introduction to Calculus',
        script: 'Ask Ryan: "If you drive toward a stop sign, you get closer and closer. In calculus, a limit asks: what value does the function APPROACH as the input approaches a specific point?" Write lim(x→2) of (x²-4)/(x-2). Factor and evaluate. Connect to instantaneous rate of change.',
        activity: '(1) Evaluate: lim(x→3) of (x²-9)/(x-3). (2) lim(x→0) of sin(x)/x [use table of values]. (3) For f(x) = x², find average rate of change from x=1 to x=3; then find the instantaneous rate at x=2 using the limit definition of derivative. (4) Explain in words what a derivative measures.',
        answerKey: {
          short: 'A limit is the value a function approaches as the input approaches a specified value. The derivative, defined as the limit of the average rate of change as the interval approaches zero, measures instantaneous rate of change — how fast a function is changing at a single point.',
          long: 'The limit lim(x→c) f(x) = L means that as x gets arbitrarily close to c, f(x) gets arbitrarily close to L without x ever equaling c. For lim(x→3) of (x²-9)/(x-3): direct substitution gives 0/0 (indeterminate). Factor: (x-3)(x+3)/(x-3) = x+3 for all x≠3. So the limit = 6. The derivative is: f\'(x) = lim(h→0) of [f(x+h)-f(x)]/h. For f(x) = x²: f\'(x) = lim(h→0) of [(x+h)²-x²]/h = lim(h→0) of [2xh+h²]/h = 2x. At x=2, f\'(2) = 4 — the instantaneous rate of change, representing the slope of the tangent line at that point. Calculus was developed simultaneously by Newton and Leibniz to describe rates of change and accumulation — the mathematics of Jehovah\'s dynamic creation.'
        }
      }
    }
  },
  history: {
    1: {
      4: {
        focus: 'Why We Study History — HIS Story',
        script: 'Ask Mykah: "Have you heard \'History is HIS story\'?" Explain: "When we study history, we\'re reading Jehovah\'s story. Psalm 46:8 says \'Come and see the works of Jehovah.\' That\'s history class!" Introduce BC and AD. Use a simple timeline: Creation → Flood → Abraham → Moses → David → Jesus → Today.',
        activity: 'Create an 8-point timeline from Creation to today. At each point write one thing Jehovah did. Decorate it. Mark where WE live on the timeline.',
        answerKey: {
          short: 'History is the record of past events. As Jehovah\'s people we study it to see how He has directed events (Isaiah 46:10). Key Bible history events: Creation, Flood, Abraham, Exodus, the kings, Jesus, the early church, and the last days (from 1914).',
          long: 'History is the systematic study of past events and their causes and consequences. For Jehovah\'s people, Isaiah 46:10 gives history special meaning: Jehovah declares "the end from the beginning" — He knew the course of history before it happened, and His word reveals its meaning. The Bible is confirmed repeatedly by archaeology, ancient manuscripts, and secular records. Major periods of Bible history: Creation (approximately 6,000 years ago), the pre-Flood world, Noah\'s Flood, the patriarchs (Abraham, Isaac, Jacob), the Exodus from Egypt, the judges and kings of Israel, the Babylonian exile, the return to Judea, the birth of Jesus, the early Christian congregation, and the current last days (1914 to present). Secular history overlaps with Bible history at verifiable points — the reigns of Nebuchadnezzar and Cyrus the Great are confirmed by both biblical and non-biblical sources. We study history not as past events only but as the unfolding of Jehovah\'s purpose, giving us both understanding and hope.'
        }
      },
      8: {
        focus: 'Ancient Mesopotamia — Cradle of Civilization and Bible Prophecy',
        script: 'Show a map of Mesopotamia (modern Iraq). "Everything important in the beginning happened here — the Garden of Eden, Babel, Abraham\'s hometown Ur, and Babylon, the most powerful ancient empire." Connect directly to Daniel chapters 2, 4, and 5. History and prophecy meet here precisely.',
        activity: 'On a map of the ancient Middle East: (1) Label: Garden of Eden (approximate), Ur, Babylon, Nineveh, Jerusalem, Egypt. (2) Match events to location: Tower of Babel, Call of Abraham, Birth of Moses, Fall of Jerusalem to Babylon. (3) Write 2 sentences explaining how Daniel 2 predicted Babylon\'s fall.',
        answerKey: {
          short: 'Mesopotamia (modern Iraq) was the cradle of civilization, home to Babylon, Assyria, and Ur (Abraham\'s hometown). Daniel 2\'s prophecy predicted the rise and fall of Babylon and all subsequent world empires with precise accuracy. Cyrus the Great is even named in Isaiah 44:27-45:1 — written 150 years before he was born.',
          long: 'Mesopotamia means "land between the rivers" (Tigris and Euphrates, modern Iraq). Genesis 2:14 identifies it near the Garden of Eden. Ur (Abraham\'s homeland, Genesis 11:31) was a sophisticated Sumerian city by 2000 BCE. The Babylonian Empire under Nebuchadnezzar II conquered Jerusalem (605-562 BCE), destroyed Solomon\'s temple, and exiled the Jews — fulfilling the prophets. Daniel\'s statue vision identified Babylon as the "head of gold," then prophesied Medo-Persia (silver), Greece (bronze), Rome (iron), divided nations (iron and clay), and finally God\'s Kingdom (stone cut without hands) destroying all. The fall of Babylon to Cyrus (539 BCE) — entering through diverted river waters under the city walls — was described by Isaiah 44:27-45:1, written 150 years earlier, naming Cyrus by name. This remains one of history\'s most remarkable fulfilled prophecies.'
        }
      },
      11: {
        focus: 'The 20th Century — World Wars and Bible Prophecy',
        script: 'Ask Kayla: "The 20th century killed more people than any previous century combined. What does that tell us?" Discuss the convergence of Matthew 24 signs: WWI (1914 — the year Bible prophecy predicted as when Christ\'s kingdom would begin), Spanish Flu (50-100 million dead), WWII, the Holocaust, nuclear weapons. The 20th century is the most prophetically significant century in history.',
        activity: 'Timeline of 1914-1945: Mark WWI start, 1914 Bible prophecy connection (Luke 21:24, Dan 4:25), Russian Revolution, end of WWI + Spanish Flu, rise of Hitler, WWII start, Holocaust, atomic bomb, UN founded. Write a paragraph connecting this to Matthew 24:3-8.',
        answerKey: {
          short: 'The 20th century saw the convergence of Matthew 24\'s signs — nation against nation, famines, earthquakes, pestilences — on an unprecedented global scale beginning in 1914. JWs connect 1914 to the end of the "Gentile times" of Luke 21:24, marking the start of Christ\'s invisible rule in heaven and the beginning of the last days.',
          long: 'The 20th century is the most densely prophetically significant period in history. WWI (1914-1918) killed 17-20 million. The Spanish Influenza of 1918-1919 killed 50-100 million — more than WWI. WWII (1939-1945) killed 70-85 million including 6 million Jews in the Holocaust. The atomic bombings introduced weapons capable of ending all human life — something Jesus warned against (Matthew 24:22). Jehovah\'s Witnesses identify 1914 as a pivotal year based on the "seven times" prophecy of Daniel 4 — 2,520 years from 607 BCE, ending at 1914 CE, when they believe Christ\'s heavenly kingdom began ruling. The founding of the League of Nations (1919) and UN (1945) is identified as the development described in Revelation 17:8 — a "beast" that was, yet was not, then appeared. WWII was also the period when JWs faced severe organized persecution in concentration camps across Europe — remaining faithful, providing the most prominent non-Jewish witness of conscientious objection to Nazism.'
        }
      },
      12: {
        focus: 'Historiography — How We Know What We Know',
        script: 'Ask Ryan: "When you read a history book, how do you know if it\'s accurate? Who wrote it? When? Why?" Introduce historiography — the study of how history is written. Primary vs secondary sources. Historical bias. Archaeological confirmation. The Bible is the most documented, most archaeologically confirmed ancient document in history.',
        activity: 'Analyze a primary source (WWI-era newspaper or biblical manuscript description). Apply HAPP criteria: Historical context, Audience, Purpose, Point of view. Write a 3-paragraph historiographical analysis evaluating the source\'s reliability.',
        answerKey: {
          short: 'Historiography is the study of how history is written and how we evaluate sources. Primary sources are first-hand accounts from the period being studied. Secondary sources analyze primary sources. We evaluate sources for HAPP: historical context, author, purpose, and point of view. The Bible\'s historicity is confirmed by archaeology, manuscript evidence, and internal consistency to an unparalleled degree.',
          long: 'Historiography asks not just "what happened?" but "how do we know, who said so, and why should we trust them?" Primary sources are direct first-hand accounts: eyewitness testimony, government documents, letters, artifacts created at the time of events. Secondary sources are later analyses: history textbooks, documentary films, scholarly articles. Evaluating sources requires examining: (1) Authorship — who wrote it, their perspective and potential bias; (2) Date — how close to the events; earlier generally more reliable; (3) Purpose — was it written to persuade, record, celebrate, condemn? (4) Corroboration — do multiple independent sources agree? The Bible has exceptional historiographical credentials: the NT has 5,800+ Greek manuscripts with fragments dating within decades of original writings — far exceeding Homer\'s Iliad (1,800 manuscripts) or Caesar\'s Gallic Wars (10 manuscripts, 900 years after Caesar). Over 25,000 archaeological sites relate to the Bible, and discoveries consistently confirm rather than contradict the biblical record.'
        }
      }
    }
  },
  comp: {
    1: {
      4: {
        focus: 'Why We Write — Jehovah\'s Example',
        script: 'Ask Mykah: "Did Jehovah ever write anything?" Responses, then: "Yes! Exodus 31:18 says He wrote the Ten Commandments with His own finger! And He inspired 40 different writers to write the Bible over 1,600 years. Why did Jehovah want His words written down?" Discuss permanence, accuracy, and the ability to spread to many people. Introduce the 5 stages of writing.',
        activity: 'Draw 5 boxes in a row. Label them: Prewrite, Draft, Revise, Edit, Publish. In each box draw a picture of what a writer does at that stage. Then pick a topic you love and do Step 1: brainstorm at least 5 ideas about it.',
        answerKey: {
          short: 'Jehovah wrote the Ten Commandments (Exodus 31:18) and inspired 40 writers to record the Bible over 1,600 years. Writing preserves information accurately, allows it to spread widely, and helps people remember. The 5 stages: Prewrite, Draft, Revise, Edit, Publish.',
          long: 'Jehovah set the example for the importance of written communication. Exodus 31:18 states that the two stone tablets were "written by God\'s finger" — emphasizing permanence and divine authority of written words. The Bible, written by approximately 40 human writers over about 1,600 years, demonstrates how writing preserves truth accurately across centuries and continents. Writing matters because it creates permanent records, allows ideas to travel to people the writer never meets, enables careful revision that speaking often doesn\'t allow, and provides a standard that can be checked and verified. The five-stage writing process mirrors the careful, thoughtful approach the Bible\'s human writers took under Jehovah\'s guidance: Prewriting (planning), Drafting (getting ideas on paper), Revising (improving content), Editing (correcting mechanics), and Publishing (sharing the final product). No great piece of writing — including the best JW publications — goes from first thought to finished page without this process.'
        }
      },
      8: {
        focus: 'The Paragraph — Architecture of Ideas',
        script: 'Hold up a building with bricks. "A paragraph is like a brick wall. The first brick — the topic sentence — tells you what the wall is about. Middle bricks add details and support. The last brick — the concluding sentence — finishes it off." Read Proverbs 3:5-7 as a perfect paragraph: topic (trust in Jehovah), support (specifics of HOW), conclusion (result of not being wise in own eyes).',
        activity: 'Write a paragraph about why you trust Jehovah. Requirements: (1) Begin with a clear topic sentence, (2) Write 3-4 supporting sentences with specific reasons or examples, (3) End with a concluding sentence. Minimum 6 sentences total.',
        answerKey: {
          short: 'A paragraph is a group of related sentences developing one main idea. It consists of a topic sentence (states the main idea), body sentences (specific support, examples, details), and a concluding sentence (reinforces or summarizes). All sentences must clearly relate to the topic sentence.',
          long: 'A well-constructed paragraph is the fundamental unit of written communication beyond the sentence. It has three components: (1) Topic Sentence: Announces the single main idea; specific enough to direct but broad enough to need explanation. "Jehovah\'s promises give me courage" is a good topic sentence. (2) Body Sentences: Three to five sentences that develop, explain, illustrate, or prove the topic sentence with specific examples, facts, reasons, or evidence. Every body sentence should clearly connect back to the topic sentence — if it doesn\'t support the main idea, it doesn\'t belong. (3) Concluding Sentence: Brings the paragraph to a close by restating the main idea in different words, summarizing support, or connecting to a broader implication. Never introduce a new topic in the concluding sentence. Proverbs 3:5-7 follows exactly this structure: verse 5a is the topic sentence ("Trust in Jehovah with all your heart"), verses 5b-6a are the body (how to trust Him), and verse 6b-7 is the conclusion (the result of trusting).'
        }
      },
      11: {
        focus: 'The Thesis Statement — Your Argument\'s Foundation',
        script: 'Ask Kayla: "Before Paul wrote any letter, what did he decide first?" Lead to: his main point — what he wanted the reader to understand. That\'s a thesis. "The resurrection is the foundation of Christian faith" — is this a thesis? Contrast with "The Bible talks about the resurrection" (not a thesis — it\'s a fact). A thesis makes a claim that can be argued and supported.',
        activity: 'Evaluate these as THESIS ✅ or NOT A THESIS ❌: (1) "The Bible teaches many things." (2) "Jehovah\'s preservation of His people through persecution demonstrates that spiritual loyalty is worth any cost." (3) "Should we pray every day?" (4) "Field service is an important activity." (5) "The Memorial\'s annual attendance of 20+ million suggests that humanity\'s hunger for meaning cannot be satisfied by secular alternatives."',
        answerKey: {
          short: 'A thesis statement is a single clear sentence stating the main argument of an essay. It must be arguable (not just a fact), specific (not vague), and provable (supportable with evidence). Answers: (1) ❌ Too broad. (2) ✅ Specific, arguable, significant. (3) ❌ Questions are not theses. (4) ❌ Too vague. (5) ✅ Specific, arguable, significant.',
          long: 'The thesis statement is the most important sentence in an academic essay — the claim that everything else exists to support. A strong thesis is: (1) Arguable — makes a claim someone could reasonably disagree with, requiring evidence to support. "The Bible has 66 books" is a fact, not a thesis. "The structure of the Bible\'s 66 books reflects a unified divine authorship that no human collaboration could produce" is a thesis. (2) Specific — identifies exactly what the essay will argue. "Jehovah is good" is too broad. "Jehovah\'s response to Job\'s suffering demonstrates that divine justice and compassion are perfectly integrated aspects of His character" is specific. (3) Significant — argues something worth arguing. Romans 1:16-17 is Paul\'s thesis for the entire letter: "I am not ashamed of the good news; it is God\'s power for salvation...For in it God\'s righteousness is being revealed by faith and toward faith." Everything in Romans develops and supports this thesis. Evaluating the five examples: (1) ❌ Vague fact. (2) ✅ Specific, arguable, significant. (3) ❌ Not a thesis. (4) ❌ "Important" means nothing without definition. (5) ✅ Makes a specific, arguable, significant interpretive claim.'
        }
      },
      12: {
        focus: 'Argumentation — Logic, Evidence, and Rhetorical Strategy',
        script: 'Read Hebrews 11:1 — "Faith is the assured expectation of what is hoped for, the evident demonstration of realities that are not seen." Ask Ryan: "Is this a logical argument or a rhetorical one? Can you prove faith exists the same way you prove a mathematical theorem?" Discuss formal logic (deductive, inductive) vs rhetorical appeals (ethos, logos, pathos, kairos) and Biblical argumentation from established scripture.',
        activity: 'Write a 500-word argumentative essay: "In an era of declining religious participation, is organized religion still relevant to modern life?" Requirements: (1) Clear thesis, (2) 2 arguments using logos with evidence, (3) 1 appeal to ethos or pathos used ethically, (4) A steelmanned counterargument before rebuttal, (5) Synthesizing conclusion.',
        answerKey: {
          short: 'Effective argumentation combines logos (logic and evidence), ethos (credibility), and pathos (emotional resonance). A strong argument includes a clear thesis, well-reasoned supporting points with evidence, honest acknowledgment and rebuttal of counterarguments (steelmanning), and a synthesizing conclusion. Biblical argumentation reasons from established scripture (Acts 17:2).',
          long: 'Argumentation at the senior level requires mastery of both formal logic and rhetorical strategy. Formal logic provides the skeleton: deductive reasoning (if all A are B, and C is an A, then C is B) provides certainty when premises are true; inductive reasoning (this, that, and the other all show X, therefore X is probably generally true) provides probability. The three rhetorical appeals: (1) Logos: logic and evidence — specific facts, data, statistics, logical reasoning chains. (2) Ethos: credibility and character — we trust arguments from sources who demonstrate knowledge, fairness, and integrity. Paul establishes ethos in Galatians by narrating his apostolic credentials and his willingness to rebuke Peter publicly — showing he is a truth-teller, not a people-pleaser. (3) Pathos: emotional appeal — not manipulative emotion but legitimate appeals to values and genuine stakes. A fourth element is kairos: timeliness — the right argument at the right moment. Steelmanning is the ethical obligation to represent the strongest version of the opposing argument before rebutting it. Paul does this in Romans: "What shall we say then? Are we to continue in sin so that grace may abound? Certainly not!" (Romans 6:1-2). Biblical argumentation follows Acts 17:2\'s model: "reasoning with them from the Scriptures, explaining and proving" — reasoning from an established authoritative source rather than purely from personal reasoning.'
        }
      }
    }
  },
  art: {
    1: {
      4: {
        focus: 'Jehovah — The First Artist',
        script: 'Ask Mykah: "Who made the most beautiful things you\'ve ever seen?" After responses: "Jehovah did! Exodus 31:3 says Bezalel was filled with God\'s spirit to create beautiful things for the tabernacle. Art is a gift from Jehovah!" Show beautiful nature photos. Ask: "What makes these beautiful?" Introduce LINE — the most basic element of art.',
        activity: 'LINE EXPLORATION: (1) Draw a horizontal line. (2) Vertical line. (3) Diagonal line. (4) Curved line. (5) Zigzag line. Now use all 5 types to draw a simple outdoor scene: horizon (horizontal), tree trunk (vertical), mountains (diagonal), river (curved), grass (zigzag). Label each line type.',
        answerKey: {
          short: 'Jehovah is the first and greatest artist — all beauty in creation reflects His aesthetic. Exodus 31:3-5 shows He gifts humans with artistic skill. Line types and their emotional qualities: horizontal (calm, rest), vertical (strength, growth), diagonal (movement, energy), curved (grace, softness), zigzag (excitement, tension).',
          long: 'Art and beauty are deeply connected to Jehovah\'s nature — the entire physical creation is a work of art reflecting His aesthetic sensibilities. Psalm 19:1 declares: "The heavens declare the glory of God." Every sunset, every flower\'s symmetry, every snowflake\'s geometry is a piece of Jehovah\'s art. Exodus 31:2-5 records that Jehovah specifically gifted Bezalel "in wisdom, understanding, and knowledge in all craftsmanship" to create the tabernacle — showing that artistic skill is a divine gift. Line is the first and most fundamental element of visual art — any mark that has length and direction. Different lines convey different emotional qualities: horizontal lines suggest rest, calm, and stability (like the horizon); vertical lines suggest strength, growth, and dignity (like a standing tree or person); diagonal lines create movement, tension, and energy; curved lines feel graceful, soft, and natural (found abundantly in living organisms — reflecting Jehovah\'s organic design); zigzag lines create excitement, disruption, or visual intensity. When we draw with intentional lines, we participate in the gift Jehovah gave Bezalel — using line to create beauty and meaning.'
        }
      },
      8: {
        focus: 'Color Theory and Emotional Communication',
        script: 'Show a red painting and a blue painting side by side. Ask Ashelyn: "How do these make you feel differently?" In Revelation 21:19-20, the foundations of New Jerusalem are described as 12 specific gemstones — a riot of color chosen deliberately by Jehovah. In Revelation 1:14, Jesus\'s hair is white as wool — purity and age. Color is theological as well as aesthetic.',
        activity: 'Color Wheel + Emotion Map: (1) Draw and fill in a color wheel (12 sections: 3 primary, 3 secondary, 6 tertiary). Label each color. (2) Write an emotion next to each color. (3) Choose Psalm 23, 46, or 139 and decide which 3 colors you would use to illustrate it. Write 2 sentences explaining why you chose each color.',
        answerKey: {
          short: 'Primary colors (red, yellow, blue) mix to form secondary colors (orange, green, violet), which mix with primaries to form tertiary colors. Warm colors (red, orange, yellow) convey energy; cool colors (blue, green, violet) convey calm. Complementary colors (opposite on the wheel) create maximum visual contrast.',
          long: 'Color theory is the systematic study of how colors relate to each other and the meanings and emotions they convey. The color wheel organizes colors by relationship: Primary colors (red, yellow, blue) cannot be mixed from other colors. Secondary colors are mixed from two primaries: red+yellow=orange, yellow+blue=green, red+blue=violet. Tertiary colors are mixed from a primary and an adjacent secondary. Color relationships create harmonies: Complementary colors are directly opposite (red and green, blue and orange) — they create maximum contrast. Analogous colors are adjacent — they create harmony. Color temperature affects emotion: warm colors advance, energize, and draw attention; cool colors recede, calm, and soothe. Jehovah designed both into creation — fire and sunsets in warm tones; oceans and skies in cool. In Revelation, the New Jerusalem\'s multicolored gemstone foundations suggest that heaven itself will be an explosion of perfectly harmonized color — beauty we can barely imagine.'
        }
      },
      11: {
        focus: 'Composition and Visual Hierarchy',
        script: 'Show two photographs of the same scene — one with poor composition, one with the rule of thirds applied. Ask Kayla: "Which one draws your eye where it should go? Why?" Discuss the rule of thirds, leading lines, visual hierarchy (which element is most important?), negative space, and balance. Then analyze a JW publication cover.',
        activity: 'Composition analysis: Study 3 different JW publication covers. For each: (1) Draw a 3×3 grid over a rough sketch. Where are main subjects placed? (2) Identify leading lines. (3) Describe the visual hierarchy — what draws your eye first, second, third? (4) Write 1-2 sentences evaluating the effectiveness of the composition.',
        answerKey: {
          short: 'Composition is the arrangement of visual elements in an artwork. Key principles: rule of thirds (placing subjects at grid intersections), leading lines (guides viewer\'s eye to the focal point), visual hierarchy (most important element most prominent), and balance (distributing visual weight evenly or intentionally unevenly for effect).',
          long: 'Composition — the arrangement of visual elements within the picture plane — determines whether an image is dynamic and engaging or flat and lifeless. The rule of thirds divides the picture plane into a 3×3 grid; placing subjects at the intersection points ("power points") creates more dynamic images than dead-center placement. Leading lines use actual or implied lines within the image to guide the viewer\'s eye toward the main subject — a road leading to a horizon, a person\'s gaze directed toward another subject. Visual hierarchy refers to the principle that not all elements are equal — the most important subject should be most prominent through size, placement, color contrast, sharpness, or isolation. Negative space — the empty areas around the main subject — is as compositionally significant as the subject itself; adequate negative space creates elegance and allows the subject to stand out. JW publications use these principles with professional skill: artwork guides the viewer\'s eye to the scriptural text, then to human figures, then to environmental details — a hierarchy that reinforces that God\'s word is primary, people\'s response is secondary, and the world provides context.'
        }
      },
      12: {
        focus: 'Art as Theological Communication',
        script: 'Show Michelangelo\'s "Creation of Adam" from the Sistine Chapel. Ask Ryan: "What theology is embedded in this image?" Discuss: God depicted as an old man (contradicts John 4:24 — God is Spirit), God reaching toward man (suggests God is physical and approachable in a casual way). Ask: "How does this image TEACH theology — even false theology — without words? What would a biblically accurate image of creation look like?"',
        activity: 'Design concept: Sketch an illustration that accurately represents Jehovah\'s creation of Adam from a biblical perspective WITHOUT depicting Jehovah physically (per John 1:18). Write a 3-paragraph artist\'s statement explaining: (1) your compositional choices, (2) the theological message you intend to convey, (3) how you avoided common false theological images while creating meaningful art.',
        answerKey: {
          short: 'Art communicates theology and worldview with extraordinary power — often bypassing rational defenses to shape beliefs and emotional associations. Christian art history contains many theologically problematic images. Biblically faithful art must be simultaneously aesthetically effective and theologically accurate. Jehovah as Spirit (John 4:24) means He cannot be accurately depicted in human form.',
          long: 'The intersection of art and theology is one of the most consequential in human history. Art communicates through emotion, symbol, and narrative simultaneously — bypassing analytical filters to plant images and associations that persist for lifetimes. The Catholic Church explicitly weaponized this in the Counter-Reformation, commissioning the Baroque style to overwhelm viewers with sensory experiences reinforcing Catholic theology. Michelangelo\'s Sistine Chapel ceiling has taught billions that God is an old man with a white beard — an anthropomorphization directly contradicting John 4:24 ("God is Spirit") and John 1:18 ("No man has seen God at any time"). This single image may have done more to implant this misconception than any theological textbook. For Jehovah\'s Witnesses, art creates special responsibilities: Jehovah as spirit (not visible), Jesus as a separate being, and the Bible as the only source of truth mean that every artistic depiction must be evaluated against those standards. JW publications handle this carefully: Jehovah\'s spirit and presence is represented through light, through the organizational structure of His people, or left appropriately abstract. An artist who is also Jehovah\'s servant must think theologically about every compositional choice — what message does the image send about who Jehovah is, what He values, and how He relates to humans? Beauty and truth must both be served, because Jehovah is both the source of beauty and the author of truth.'
        }
      }
    }
  },
  science: {
    1: {
      4: {
        focus: 'Jehovah Made Everything — What Is Science?',
        script: 'Look outside or at a nature photo. Ask Mykah: "What do you see? How many different things did Jehovah make?" List them. "Scientists study the things Jehovah made. They ask questions, look carefully, and write down what they find. Today WE become scientists!" Introduce the 5 steps of scientific method using a simple demonstration: Does a heavier item fall faster than a lighter one? Drop a pencil and an eraser simultaneously.',
        activity: 'MINI SCIENCE EXPERIMENT — Does color affect how fast ice melts? Get 2 ice cubes. Place one on dark paper, one on white paper. Observe every 5 minutes for 20 minutes. Record observations in a chart. Write your hypothesis, observation chart, and conclusion. What does this tell us about why Jehovah made polar bears WHITE?',
        answerKey: {
          short: 'Science is the study of the natural world through observation and testing. Scientific method: (1) Question, (2) Hypothesis, (3) Experiment, (4) Observation/Data, (5) Conclusion. Dark colors absorb more light and heat; light colors reflect it — which is why Jehovah gave polar animals white fur for camouflage AND temperature regulation.',
          long: 'Science is the systematic study of the natural world through observation, experimentation, and reasoning. Science is not in conflict with faith in Jehovah — it is the study of His handiwork. Psalm 104:24 exclaims: "How many are your works, O Jehovah! You have made all of them in wisdom." Every scientific discovery is, for a person of faith, another glimpse into Jehovah\'s design. The scientific method is the structured process scientists use: (1) Question: observe something and ask why or how. (2) Hypothesis: form an educated prediction — "I think X will happen because..." (3) Experiment: design a fair test changing only ONE variable (independent variable) while keeping everything else the same (controlled variables), measuring the result (dependent variable). (4) Data/Observation: record exactly what happens without interpretation. (5) Conclusion: evaluate whether results support or contradict the hypothesis and what can be learned. The ice cube experiment demonstrates heat absorption: dark surfaces absorb more electromagnetic radiation (light and heat) than light surfaces, which reflect it. Polar bears have transparent hollow hairs that appear white — they reflect Arctic sun and channel ultraviolet light to the black skin beneath which absorbs warmth. This is a remarkable example of multiple engineering solutions working simultaneously — the kind of complexity pointing to deliberate intelligent design, not random accident.'
        }
      },
      8: {
        focus: 'Cell Structure — The Basic Unit of Life',
        script: 'Hold up a brick. "This is to a building what a cell is to your body. Every living thing is made of cells — some creatures are just ONE cell; you are made of about 37 TRILLION cells!" Use a diagram to show animal cell parts. Emphasize: "The cell is irreducibly complex — remove the nucleus and the cell dies. This alone points powerfully to a Creator." Psalm 139:14 — "I am wonderfully made."',
        activity: 'Draw and label an animal cell with 8 organelles: (1) cell membrane, (2) nucleus, (3) cytoplasm, (4) mitochondria, (5) endoplasmic reticulum, (6) ribosomes, (7) Golgi apparatus, (8) vacuoles. For each organelle, write its job in one sentence. Then write a paragraph: "How is the cell like a city? What is each organelle\'s \'job\' in the city?"',
        answerKey: {
          short: 'Key animal cell organelles: cell membrane (controls entry/exit), nucleus (command center — contains DNA), cytoplasm (fluid filling the cell), mitochondria (powerhouse — produces ATP energy), endoplasmic reticulum (manufacturing/transport), ribosomes (protein factories), Golgi apparatus (packages and ships proteins), vacuoles (storage). The cell\'s irreducible complexity strongly suggests design.',
          long: 'The cell is the fundamental unit of all living things. Animal cells (eukaryotic — with a membrane-bound nucleus) contain specialized compartments called organelles: Cell membrane: a phospholipid bilayer with protein channels controlling what enters and exits — selective permeability. Nucleus: the control center containing DNA organized into chromosomes; the nucleolus within produces ribosomes. Cytoplasm: the gel-like fluid providing medium for chemical reactions and transportation. Mitochondria: the power plants, generating ATP (adenosine triphosphate) through cellular respiration; they have their own DNA. Endoplasmic reticulum: a membrane network; rough ER (with ribosomes) synthesizes proteins; smooth ER synthesizes lipids. Ribosomes: protein factories, reading mRNA and assembling proteins. Golgi apparatus: receives proteins from the ER, modifies, packages, and ships them — the cell\'s post office. Vacuoles: storage compartments for water, nutrients, or waste. The interdependence of these organelles demonstrates irreducible complexity — each must exist for the cell to survive; they could not have evolved independently and then combined, as each part has no function without the others. This is a powerful argument for intelligent design (Psalm 139:14).'
        }
      },
      11: {
        focus: 'Thermodynamics and Creation',
        script: 'Ask Kayla: "The second law of thermodynamics says everything moves from order to disorder — entropy always increases in a closed system. If everything naturally moves toward disorder, how did the extraordinary order of life originate and increase over time without a directing intelligence?" Introduce the laws of thermodynamics and apply to evolutionary theory.',
        activity: '(1) Define: First Law of Thermodynamics, Second Law, entropy, open vs closed system. (2) Calculate energy efficiency: input 1,000 J; output 250 J mechanical work. What is the efficiency percentage? What law explains the energy lost? (3) Write 3 paragraphs: How does the second law challenge the naturalistic origin of biological information?',
        answerKey: {
          short: 'First Law: energy cannot be created or destroyed, only converted. Second Law: in any energy conversion, entropy (disorder) increases in a closed system. Efficiency = useful output/total input × 100% = 250J/1000J = 25%. Biological evolution requires a sustained decrease in entropy (increase in specified DNA complexity) — a fundamental challenge given the second law.',
          long: 'The First Law of Thermodynamics (Conservation of Energy) states that energy cannot be created or destroyed in an isolated system — only converted between forms. This is why perpetual motion machines are impossible. The Second Law states that in any spontaneous energy conversion, total entropy (disorder, randomness) of a closed system always increases over time — usable, organized energy degrades into unusable thermal energy. Car engine efficiency: (250 J / 1000 J) × 100% = 25% efficient; the Second Law explains the 75% energy loss dissipated as heat. The evolutionary challenge: the origin of life requires not just matter and energy but specified, complex information — the precise sequence of nucleotide bases in DNA coding for functional proteins. Information is the antithesis of entropy — it is structured, specific, and non-random. The Second Law predicts that without an intelligent, directed information source, information degrades over time. The generation of new specified biological information — required by evolution — would require repeated, sustained decreases in informational entropy. While Earth is an open system, raw energy input alone does not organize information without a pre-existing system to capture and direct it — solar energy hitting rocks doesn\'t create DNA sequences, just as electricity into a junkyard doesn\'t build computers. This is why information theorist Stephen Meyer and others argue that the origin of biological information is the most powerful scientific argument for an intelligent Creator — Jehovah, who in Psalm 147:5 is described as possessing "infinite understanding."'
        }
      },
      12: {
        focus: 'Quantum Mechanics and Philosophical Implications',
        script: 'Ask Ryan: "At the quantum level — individual particles — the universe behaves in ways Einstein called \'spooky.\' Particles exist in multiple states simultaneously until observed. Cause and effect breaks down at this scale. What does this tell us about the limitations of purely materialistic science?" Introduce the Copenhagen interpretation vs Many-Worlds. Connect to Hebrews 11:3 — "what is seen has come into existence from things that are not visible."',
        activity: '(1) Explain: quantum superposition, wave-particle duality, the observer effect, and Heisenberg\'s uncertainty principle. (2) Evaluate two interpretations of quantum mechanics: Copenhagen and Many-Worlds. What are the philosophical implications of each? Which is more consistent with a biblical worldview? (3) How does Hebrews 11:3 take on new meaning in light of quantum physics?',
        answerKey: {
          short: 'Quantum mechanics describes matter and energy at subatomic scales. Key principles: superposition (particles exist in multiple states until measured), wave-particle duality (quanta behave as waves or particles depending on observation), uncertainty principle (position and momentum cannot both be known precisely), observer effect (measurement affects the system). These phenomena suggest materialistic assumptions about reality require fundamental revision.',
          long: 'Quantum mechanics, developed in the early 20th century, describes behavior at atomic and subatomic scales — and its results are profoundly strange. Superposition: prior to measurement, a quantum particle doesn\'t have a definite state but exists in superposition of multiple possible states simultaneously. Wave-particle duality: quanta exhibit both wave-like and particle-like properties depending on the experimental setup. The double-slit experiment shows an electron going through BOTH slits simultaneously when not observed, but through only one when measured — observation changes the result. Heisenberg\'s Uncertainty Principle: there is a fundamental limit to the precision with which complementary properties (position and momentum) can be known simultaneously — this is a limit of nature, not instruments. Observer effect: measurement inevitably disturbs quantum systems. The Copenhagen interpretation holds that quantum mechanics describes probabilities of measurement outcomes, not an objective reality independent of observation. The Many-Worlds interpretation posits that every quantum event causes the universe to split into parallel universes — an interpretation with no empirical evidence and enormous philosophical baggage. Hebrews 11:3: "what is seen has come into existence from things that are not visible." Quantum physics has revealed that the material world emerges from quantum fields and probability waves that are profoundly non-material in behavior. The naive materialist assumption (only matter exists operating by deterministic mechanical laws) has been overturned by quantum physics itself — opening space for the recognition that non-material reality, including Jehovah\'s spirit, is fully consistent with what modern physics reveals about the nature of reality.'
        }
      }
    }
  }
};

// ─── SubjectLessonContent component ─────────────────────────────────────────
function SubjectLessonContent({
  subjectId,
  day,
  grade,
  showTeacher
}) {
  const lesson = getLessonForDay(subjectId, day, grade);
  const c = SUBJECTS?.find(s => s.id === subjectId);
  const color = c?.c || '#888';
  if (!lesson) return React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#555',
      padding: '8px 0'
    }
  }, `Day ${day} content — refer to teacher\'s unit guide for today\'s topic in ${c?.l || subjectId}.`);
  return React.createElement('div', null, lesson.unit && React.createElement('div', {
    style: {
      fontSize: 8,
      color: color,
      marginBottom: 3,
      letterSpacing: 1,
      textTransform: 'uppercase'
    }
  }, `Unit: ${lesson.unit}`), React.createElement('div', {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#fff',
      marginBottom: 6
    }
  }, lesson.focus), React.createElement('div', {
    style: {
      background: 'rgba(0,0,0,.2)',
      borderRadius: 8,
      padding: '7px 10px',
      marginBottom: showTeacher ? 6 : 0
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      color: color,
      marginBottom: 3
    }
  }, 'TODAY\'S ACTIVITY'), React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#ccc',
      lineHeight: 1.7,
      whiteSpace: 'pre-line'
    }
  }, lesson.activity)), (typeof CompLink === 'function' ? React.createElement(CompLink, { subjectId: subjectId, day: day, grade: grade }) : null), (typeof MenuLink === 'function' ? React.createElement(MenuLink, { subjectId: subjectId, day: day, grade: grade }) : null), showTeacher && React.createElement('div', null, React.createElement('div', {
    style: {
      background: 'rgba(0,0,0,.35)',
      borderRadius: 8,
      padding: '8px 10px',
      marginBottom: 5
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      letterSpacing: 1,
      marginBottom: 4
    }
  }, '📋 TEACHER SCRIPT'), React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#ddd',
      lineHeight: 1.8,
      whiteSpace: 'pre-line'
    }
  }, lesson.script)), React.createElement('div', {
    style: {
      background: 'rgba(239,83,80,.06)',
      borderRadius: 8,
      padding: '8px 10px'
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#EF5350',
      marginBottom: 5
    }
  }, '🔑 ANSWER KEY'), React.createElement('div', {
    style: {
      marginBottom: 6
    }
  }, React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#FF9800',
      fontWeight: 700,
      marginBottom: 2
    }
  }, 'SHORT ANSWER'), React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#ccc',
      lineHeight: 1.6,
      whiteSpace: 'pre-line'
    }
  }, lesson.answerKey.short)), React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 9,
      color: '#EF5350',
      fontWeight: 700,
      marginBottom: 2
    }
  }, 'LONG ANSWER (FULL EXPLANATION)'), React.createElement('div', {
    style: {
      fontSize: 10,
      color: '#aaa',
      lineHeight: 1.8,
      whiteSpace: 'pre-line'
    }
  }, lesson.answerKey.long)))));
}



// ═══ SCHOOL MODULE ═══
const SCHOOL_STUDENTS = [{
  id: 'ryan',
  name: 'Ryan',
  emoji: '👦',
  color: '#039BE5',
  grade: 12,
  reading: 12,
  level: 4
}, {
  id: 'kayla',
  name: 'Kayla',
  emoji: '👧',
  color: '#F48FB1',
  grade: 12,
  reading: 12,
  level: 4
}, {
  id: 'ashelyn',
  name: 'Ashelyn',
  emoji: '👧',
  color: '#9E69AF',
  grade: 8,
  reading: 8,
  level: 3
}, {
  id: 'mykah',
  name: 'Mykah',
  emoji: '👦',
  color: '#4CAF82',
  grade: 4,
  reading: 2,
  readTarget: 5,
  level: 1
}];
const SUBJECTS = [{
  id: 'bible',
  l: '📖 Bible Study',
  c: '#7986CB',
  jw: true
}, {
  id: 'science',
  l: '🔬 Science',
  c: '#4CAF82'
}, {
  id: 'lang',
  l: '📚 Language Arts',
  c: '#F4511E'
}, {
  id: 'math',
  l: '➕ Math',
  c: '#1A73E8'
}, {
  id: 'history',
  l: '🌍 History',
  c: '#FF9800'
}, {
  id: 'comp',
  l: '✏️ Composition',
  c: '#C0CA33'
}];

// ─── JW Songs (sample set, random selection) ─────────────────────────────────
const JW_SONGS = [{
  n: 1,
  t: 'Jehovah Is Your Name'
}, {
  n: 2,
  t: 'Jehovah, Our Strength'
}, {
  n: 3,
  t: 'Our Strength, Our Hope, Our Confidence'
}, {
  n: 4,
  t: 'Making Known the Kingdom Truth'
}, {
  n: 5,
  t: 'God\'s Wondrous Works'
}, {
  n: 7,
  t: 'Praise Jehovah Our God!'
}, {
  n: 8,
  t: 'The Heavens Declare God\'s Glory'
}, {
  n: 9,
  t: 'Listen, Obey, and Be Blessed'
}, {
  n: 11,
  t: 'The One Who Shows Us Loyalty'
}, {
  n: 12,
  t: 'Now We Are One'
}, {
  n: 14,
  t: 'Gratitude for Divine Patience'
}, {
  n: 15,
  t: 'Praise Jehovah, All You Nations!'
}, {
  n: 17,
  t: 'Let Me Tell the World'
}, {
  n: 19,
  t: 'Baptized Into Your Name'
}, {
  n: 20,
  t: 'You Gave Your Precious Son'
}, {
  n: 22,
  t: 'Jehovah, God, Close to Us Always'
}, {
  n: 23,
  t: 'Jehovah Is My Shepherd'
}, {
  n: 25,
  t: 'A Special Possession'
}, {
  n: 27,
  t: 'The Lord\'s Prayer'
}, {
  n: 28,
  t: 'Draw Close to Jehovah'
}, {
  n: 30,
  t: 'My Father, My God and Friend'
}, {
  n: 31,
  t: 'Oh, Walk With God'
}, {
  n: 33,
  t: 'Our Reasons for Joy'
}, {
  n: 35,
  t: 'Children Are a Trust From God'
}, {
  n: 36,
  t: 'We Guard Our Hearts'
}, {
  n: 38,
  t: 'He Will Make You Strong'
}, {
  n: 41,
  t: 'Just a Little While Longer'
}, {
  n: 43,
  t: 'A Prayer of the Lowly One'
}, {
  n: 44,
  t: 'A Prayer for the Whole Association'
}, {
  n: 46,
  t: 'Loyal Love'
}, {
  n: 48,
  t: 'Daily Walking With Jehovah'
}, {
  n: 50,
  t: 'My Prayer of Dedication'
}, {
  n: 52,
  t: 'Faithfully Bearing Witness'
}, {
  n: 54,
  t: 'Ever Loyal'
}, {
  n: 57,
  t: 'Preaching to All Sorts of People'
}, {
  n: 60,
  t: 'It Means Their Life'
}, {
  n: 62,
  t: 'The New Song'
}, {
  n: 65,
  t: 'Move Ahead'
}, {
  n: 67,
  t: 'Sing to Jehovah'
}, {
  n: 69,
  t: 'Walking in Integrity'
}, {
  n: 71,
  t: 'We Will Be Taught by Jehovah'
}, {
  n: 73,
  t: 'Jehovah\'s Lovely Paradise'
}, {
  n: 75,
  t: 'The Meek Ones Shall Possess the Earth'
}, {
  n: 77,
  t: 'May Jehovah Bless You'
}, {
  n: 78,
  t: 'Hold Fast to What Is Fine'
}, {
  n: 80,
  t: 'Stand Firm!'
}, {
  n: 82,
  t: 'Reaching Out'
}, {
  n: 83,
  t: 'Come to Jehovah\'s Mountain'
}, {
  n: 85,
  t: 'Welcome One Another'
}, {
  n: 87,
  t: 'To Whom Do We Belong?'
}, {
  n: 88,
  t: 'Make Me Know Your Ways'
}, {
  n: 90,
  t: 'Praise Jehovah With Me'
}, {
  n: 135,
  t: 'Listen, Obey, and Be Blessed (Children)'
}, {
  n: 138,
  t: 'Jehovah Is Our Refuge'
}, {
  n: 139,
  t: 'See Yourself When All Is New'
}, {
  n: 140,
  t: 'Gratitude for Grace'
}, {
  n: 141,
  t: 'Searching for Friends of Peace'
}, {
  n: 142,
  t: 'Enduring to the End'
}, {
  n: 143,
  t: 'Keep Working, Keep Watching'
}, {
  n: 145,
  t: 'Now Is the Time to Preach'
}, {
  n: 146,
  t: 'From the Rising of the Sun'
}, {
  n: 147,
  t: 'Jehovah Is King!'
}, {
  n: 149,
  t: 'We Are Jehovah\'s Army!'
}, {
  n: 150,
  t: 'My Bible Tells Me So'
}, {
  n: 151,
  t: 'Sowing Kingdom Seed'
}, {
  n: 152,
  t: 'Jehovah, Our Shepherd'
}, {
  n: 153,
  t: 'Children, Obey Your Parents'
}];
function getRandomSong(exclude) {
  const pool = JW_SONGS.filter(s => !exclude || s.n !== exclude.n);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── 180-Day Bible Study Curriculum (JW-based) ────────────────────────────────
// Units drawn from: "What Does the Bible Really Teach?", "Draw Close to Jehovah",
// Bible reading plan, JW.ORG study articles, and Enduring to the End lessons

const BIBLE_UNITS = [{
  unit: 1,
  title: 'Who Is Jehovah?',
  days: 10,
  source: 'Bible Teach Ch.1; jw.org/en/library/books/bible-teach/',
  overview: 'Students discover Jehovah\'s qualities, name, and purposes.',
  keyVerses: ['Ps 83:18', 'Jas 4:8', 'Isa 46:10'],
  lessons: [{
    d: 1,
    focus: 'Jehovah\'s Name — Why It Matters',
    verse: 'Ps 83:18',
    script: 'Open your Bible to Psalm 83:18. Read it aloud together. Ask: "What is God\'s personal name? How many times does it appear in the Bible? (about 7,000 times)"',
    discuss: ['Why do you think God told us His name?', 'What does the name Jehovah mean?'],
    activity: 'Write Jehovah\'s name in 5 different languages. Find examples on jw.org.',
    answers: {
      'What does Jehovah mean?': 'He Causes to Become — showing He fulfills His promises',
      'How many times in Bible?': 'About 7,000 times in original manuscripts'
    }
  }, {
    d: 2,
    focus: 'God Is Love — 1 John 4:8',
    verse: '1 John 4:8',
    script: 'Read 1 John 4:8. Ask: "What does this verse say IS God\'s quality — not just something He has, but what He IS?" Discuss how love shapes every decision Jehovah makes.',
    discuss: ['How has Jehovah shown love to YOU personally?', 'How does knowing God is love help us when bad things happen?'],
    activity: 'Draw or describe one way Jehovah has shown love in your life this week.',
    answers: {
      'What quality defines God?': 'Love — it is His very nature, not just an action',
      'Example from creation?': 'Food, beauty, the gift of family, sunshine and rain for all'
    }
  }, {
    d: 3,
    focus: 'Jehovah Is Just',
    verse: 'Deut 32:4',
    script: 'Read Deuteronomy 32:4. Define "justice" together. Ask: "Why is it important that God is perfectly just? How does that make you feel about the future?"',
    discuss: ['What does it mean that Jehovah\'s ways are perfect?', 'How does His justice comfort us when we see unfairness?'],
    activity: 'List 3 examples of injustice in the world today. Beside each, write how Jehovah will correct it.',
    answers: {
      'What does Deut 32:4 say about God?': 'His work is perfect, all His ways are just, a God of faithfulness and without injustice'
    }
  }, {
    d: 4,
    focus: 'Jehovah Is Wise',
    verse: 'Prov 2:6',
    script: 'Read Proverbs 2:6. Ask: "Where does all true wisdom come from? How can we get it?" Discuss the difference between knowledge and wisdom.',
    discuss: ['Why is Jehovah\'s wisdom better than any human wisdom?', 'How do we access His wisdom?'],
    activity: 'Read James 1:5 together. Write a short prayer asking Jehovah for wisdom in one area of your life.',
    answers: {
      'Source of wisdom per Prov 2:6?': 'From Jehovah\'s own mouth come wisdom and understanding'
    }
  }, {
    d: 5,
    focus: 'Jehovah\'s Power',
    verse: 'Jer 10:12',
    script: 'Read Jeremiah 10:12. Discuss the creation of the universe. Ask: "If Jehovah made all of this, what can\'t He do for us?" Address the question of why He doesn\'t use His power to end suffering yet.',
    discuss: ['What is one example of Jehovah\'s power you can see in nature?', 'Why does He allow suffering for now?'],
    activity: 'Choose one creation (animal, plant, or planet) and research how it shows Jehovah\'s power. Share tomorrow.',
    answers: {
      'What does Jer 10:12 say Jehovah made?': 'The earth by His power, established the world by His wisdom, stretched out the heavens by His understanding'
    }
  }, {
    d: 6,
    focus: 'Review Day — Quiz',
    verse: 'All week verses',
    script: 'Open with song and prayer. Review Days 1-5 with Q&A quiz below. Use warm encouragement. End with: "Jehovah wants us to know HIM. That\'s why He put His name in the Bible 7,000 times."',
    discuss: ['Name one quality of Jehovah for each letter: J-E-H-O-V-A-H'],
    activity: 'QUIZ: Match quality to Bible verse. Grade together as a family.',
    answers: {
      'Week quiz key': {
        'Ps 83:18': 'Name is Jehovah',
        '1 John 4:8': 'God is love',
        'Deut 32:4': 'God is just',
        'Prov 2:6': 'Source of wisdom',
        'Jer 10:12': 'Creator and sustainer'
      }
    }
  }, {
    d: 7,
    focus: 'Drawing Close to Jehovah — Jas 4:8',
    verse: 'Jas 4:8',
    script: 'Read James 4:8. Ask: "What promise does Jehovah make here? What is our part? What is His part?" Emphasize that Jehovah WANTS a relationship with each of you.',
    discuss: ['What are practical ways to draw close to Jehovah daily?', 'What might pull us away?'],
    activity: 'Make a "Draw Close" chart — 5 daily habits that help (prayer, Bible reading, meetings, service, meditation).',
    answers: {
      'What is the promise of Jas 4:8?': 'Draw close to God and He will draw close to you — it is a guarantee'
    }
  }, {
    d: 8,
    focus: 'Jehovah Cares Personally — 1 Pet 5:7',
    verse: '1 Pet 5:7',
    script: 'Read 1 Peter 5:7. Ask: "Does Jehovah care about YOUR worries specifically?" Share: "The word \'cast\' means to throw — like throwing a heavy burden off your shoulders onto Him."',
    discuss: ['What burden can you throw onto Jehovah today?', 'How does prayer help us feel His care?'],
    activity: 'Write a personal letter to Jehovah — not a prayer, but a letter. Share as much or as little as you want.',
    answers: {
      '1 Pet 5:7 instruction?': 'Cast ALL your anxiety on Him because He cares about you — personal, not generic'
    }
  }, {
    d: 9,
    focus: 'Jehovah\'s Purpose for the Earth',
    verse: 'Ps 37:29',
    script: 'Read Psalm 37:29. Ask: "What did Jehovah originally purpose for humans? Did that purpose change?" Show jw.org video: "What Is God\'s Purpose for the Earth?"',
    discuss: ['What will life be like in paradise?', 'How does knowing this affect how we live now?'],
    activity: 'Draw your version of paradise earth. Include specific details from the Bible (Isa 35:5-6; Rev 21:4).',
    answers: {
      'Original purpose for earth?': 'To be a paradise home for humans forever — Gen 1:28 mandate never cancelled'
    }
  }, {
    d: 10,
    focus: 'Unit Review + Project',
    verse: 'Synthesis',
    script: 'Students present their paradise drawing. Review all 9 days. Play a family quiz game: one team asks questions, the other answers from memory. Award "Jehovah\'s Learner" certificates.',
    discuss: ['What is your favorite quality of Jehovah and why?'],
    activity: 'Write a 1-paragraph summary of what you learned about Jehovah this unit. Keep in your school binder.',
    answers: {
      'Unit summary key points': ['Jehovah is His personal name — 7,000 times in Bible', 'His qualities: Love, Justice, Wisdom, Power', 'He cares personally for each of us', 'His purpose for a paradise earth stands']
    }
  }]
}, {
  unit: 2,
  title: 'Jesus Christ — Our King and Ransomer',
  days: 10,
  source: 'Bible Teach Ch.2-3; jw.org/en/library/',
  overview: 'Students learn about Jesus\' pre-human existence, his earthly ministry, death, resurrection, and role as King.',
  keyVerses: ['John 17:3', 'Rom 6:23', '1 Pet 2:24'],
  lessons: [{
    d: 11,
    focus: 'Jesus\' Pre-Human Existence',
    verse: 'John 1:1-3',
    script: 'Read John 1:1-3. Explain that "the Word" is Jesus. Ask: "What do these verses tell us Jesus was before he came to earth?" Clarify the JW understanding: Jesus is God\'s Son, not God Himself.',
    discuss: ['Why is it important that Jesus is separate from Jehovah?', 'What does it mean that "all things came into existence through him"?'],
    activity: 'Read Colossians 1:15-16. List what Jesus created. Draw a timeline from his pre-human existence to today.',
    answers: {
      'John 1:1-3 identity?': 'The Word (Jesus) was WITH God, created alongside God, used to create everything else — not equal to God but first of God\'s creations'
    }
  }, {
    d: 12,
    focus: 'Why Jesus Came to Earth',
    verse: 'John 3:16',
    script: 'Read John 3:16 slowly. Ask: "How much did Jehovah love us? What did that love cost Him?" Discuss the concept of sacrifice — giving up something precious.',
    discuss: ['How do you feel knowing Jehovah gave His Son for YOU personally?', 'What response does John 3:16 call for from us?'],
    activity: 'Memorize John 3:16 together as a family. Test each other.',
    answers: {
      'Why did Jesus come?': 'To give his life as a ransom — to undo what Adam lost, to make eternal life possible for obedient humans'
    }
  }, {
    d: 13,
    focus: 'The Ransom — How It Works',
    verse: '1 Tim 2:5-6',
    script: 'Read 1 Timothy 2:5-6. Explain the ransom illustration: Adam was a perfect human who sinned and lost perfection for all his children. Jesus, a perfect human, paid back exactly what was lost. This is called a "corresponding ransom."',
    discuss: ['Why did the ransom have to be a HUMAN life?', 'How does the ransom show both Jehovah\'s justice AND love?'],
    activity: 'Draw the ransom diagram: Adam (perfect) → sin → death / Jesus (perfect) → sacrifice → life restored.',
    answers: {
      'Why a human ransom?': 'Adam was human. Justice required a perfect human life to balance a perfect human life — that is why Jesus came in the flesh, not as a spirit'
    }
  }, {
    d: 14,
    focus: 'Jesus\' Resurrection',
    verse: 'Acts 17:31',
    script: 'Read Acts 17:31. Ask: "Why is the resurrection of Jesus so important to our faith?" Read 1 Corinthians 15:14 — "if Christ has not been raised, our faith is useless."',
    discuss: ['How does Jesus\' resurrection give us confidence about our own hope?', 'What kind of body did Jesus have after resurrection?'],
    activity: 'List the people who saw Jesus after his resurrection (1 Cor 15:5-8). How many witnesses? What does this mean?',
    answers: {
      'Why is resurrection vital?': 'Proves Jehovah backed Jesus — confirms the ransom was accepted, guarantees our resurrection too'
    }
  }, {
    d: 15,
    focus: 'Jesus Now — King in Heaven',
    verse: 'Rev 11:15',
    script: 'Read Revelation 11:15. Explain that in 1914, Jesus began ruling as King of God\'s Kingdom. Ask: "What does it mean for us that our King is already ruling?"',
    discuss: ['How does knowing Jesus is King right now change how you live today?', 'What will his Kingdom accomplish?'],
    activity: 'Research jw.org: "What Is the Kingdom of God?" Read the article together. List 5 things the Kingdom will do.',
    answers: {
      'When did Jesus begin ruling?': '1914 — based on the "seven times" of Daniel 4 and Luke 21:24 — Gentile times ended'
    }
  }, {
    d: 16,
    focus: 'Jesus\' Teachings — Sermon on the Mount',
    verse: 'Matt 5:3-12',
    script: 'Read Matthew 5:3-12 (the Beatitudes) slowly. After each, ask: "What does this quality look like in real life?"',
    discuss: ['Which beatitude do you need to work on most?', 'How are these qualities different from what the world values?'],
    activity: 'Choose one beatitude. Write a short paragraph describing someone (real or fictional) who lived that quality.',
    answers: {
      'The Beatitudes summary': '8 qualities of those who will receive Kingdom blessings: poor in spirit, mourning, meek, righteous hunger, merciful, pure in heart, peaceable, persecuted for righteousness'
    }
  }, {
    d: 17,
    focus: 'Jesus\' Example of Prayer',
    verse: 'Matt 6:9-13',
    script: 'Read the Lord\'s Prayer in Matthew 6:9-13. Break it into parts: (1) Hallowing God\'s name, (2) Kingdom, (3) Will on earth, (4) Daily needs, (5) Forgiveness, (6) Deliverance.',
    discuss: ['What does this prayer teach us about what to pray FOR?', 'Notice the prayer starts with Jehovah, not our personal needs. What lesson is there?'],
    activity: 'Write your own prayer using the same structure as Matthew 6:9-13.',
    answers: {
      'Lord\'s Prayer structure?': 'Name honored first, then Kingdom, then will done, THEN personal needs — shows proper priorities in prayer'
    }
  }, {
    d: 18,
    focus: 'Imitating Jesus',
    verse: '1 Pet 2:21',
    script: 'Read 1 Peter 2:21. Ask: "What does it mean to \'follow his steps closely\'?" Discuss specific situations where we can ask WWJD (What Would Jesus Do?).',
    discuss: ['In what situation this week can you specifically imitate Jesus?', 'Which quality of Jesus is hardest to imitate and why?'],
    activity: 'Role-play scenarios: How would Jesus respond to: (1) a mean classmate, (2) someone who needs help, (3) temptation.',
    answers: {
      '1 Pet 2:21 meaning?': 'Jesus left us a model — a detailed pattern to follow in every situation, not just in spiritual matters'
    }
  }, {
    d: 19,
    focus: 'Memorial of Jesus\' Death — 1 Cor 11:23-26',
    verse: '1 Cor 11:24',
    script: 'Read 1 Corinthians 11:23-26. Explain what the Memorial is, why we observe it, who partakes of the emblems, and who attends as observers. Ask: "What does the bread represent? The wine?"',
    discuss: ['Why is observing the Memorial important every year?', 'How does the Memorial draw us closer to Jehovah and Jesus?'],
    activity: 'Look up this year\'s Memorial date on jw.org. Mark it on your calendar. Write why it matters to you personally.',
    answers: {
      'Bread represents?': 'Jesus\' perfect human body sacrificed for us — only anointed ones partake',
      'Wine represents?': 'His blood of the new covenant — seals the arrangement for Kingdom rulers'
    }
  }, {
    d: 20,
    focus: 'Unit Review + Presentation',
    verse: 'Synthesis',
    script: 'Each student presents one fact about Jesus to the "class." Grade unit quiz. Award certificates. Close with discussion: "How has learning about Jesus changed how you feel about him?"',
    discuss: ['If you could ask Jesus one question, what would it be?'],
    activity: 'Complete Unit 2 quiz. Store in binder. Begin Unit 3 preview: The Kingdom of God.',
    answers: {
      'Unit 2 key points': ['Jesus pre-existed as God\'s firstborn Son', 'Ransom: perfect life for perfect life', 'Resurrection confirmed Jehovah\'s approval', 'Jesus now rules as King since 1914', 'We imitate Jesus daily']
    }
  }]
}, {
  unit: 3,
  title: 'God\'s Kingdom — Our Only Hope',
  days: 10,
  source: 'Bible Teach Ch.3; jw.org/en/library/videos/#en/mediaitems/GODSKingdom',
  overview: 'Students learn what God\'s Kingdom is, who rules it, what it will accomplish, and why no human government can solve mankind\'s problems.',
  keyVerses: ['Matt 6:9-10', 'Dan 2:44', 'Rev 21:3-4'],
  lessons: [{
    d: 21,
    focus: 'What Is God\'s Kingdom?',
    verse: 'Dan 2:44',
    script: 'Read Daniel 2:44. Ask: "What kind of government is God\'s Kingdom? Who established it? What will it do to human governments?" Explain that this is not a spiritual condition in our hearts but a REAL government.',
    discuss: ['Why can\'t human governments solve mankind\'s problems?', 'What makes God\'s Kingdom different?'],
    activity: 'Read the "What Is God\'s Kingdom?" article on jw.org. List 5 things it will do.',
    answers: {
      'Dan 2:44 promise?': 'God will set up a Kingdom that will crush all other kingdoms and stand forever — it is a literal government, not symbolic'
    }
  }, {
    d: 22,
    focus: 'The Kingdom Will Transform Earth',
    verse: 'Rev 21:3-4',
    script: 'Read Revelation 21:3-4 slowly. For each promise, ask students: "What problem does this solve?" Death → mortality. Mourning → grief. Outcrying → suffering. Pain → disease/hardship.',
    discuss: ['What are you most looking forward to in the new world?', 'How does this hope affect how you handle problems today?'],
    activity: 'Create a "New World Promise" poster. Take each promise in Rev 21:3-4 and illustrate it.',
    answers: {
      'What 4 things will be gone?': 'Death, mourning, outcrying, and pain — ALL former things will have passed away'
    }
  }, {
    d: 23,
    focus: 'Human Governments Have Failed',
    verse: 'Jer 10:23',
    script: 'Read Jeremiah 10:23. Ask: "What does this verse say about human ability to direct their own steps?" Review history: despite 6,000 years of human governments, war, poverty, and disease continue.',
    discuss: ['Why do you think humans keep trying to solve problems without God?', 'What does this tell us we need?'],
    activity: 'Research: Find 3 examples from current news where human governments have failed to solve major problems.',
    answers: {
      'Jer 10:23 lesson?': 'It does not belong to man to direct his own steps — humans need God\'s direction, which is why all human governments ultimately fail'
    }
  }, {
    d: 24,
    focus: 'The Kingdom Is Already Ruling',
    verse: 'Rev 12:10',
    script: 'Read Revelation 12:10. Explain that the Kingdom began ruling in 1914 — but from heaven. We now live in "the last days" as evidence proves. Use Matthew 24 signs to show where we are in history.',
    discuss: ['What "signs" of the last days do you see in the world today?', 'How does knowing the Kingdom is already ruling motivate you?'],
    activity: 'Read Matthew 24:3-14. Make a checklist of signs. Check off which are being fulfilled today.',
    answers: {
      'When did Kingdom rule begin?': '1914 — when "Gentile times" ended per Luke 21:24 and Daniel\'s prophecy — now proven by world events'
    }
  }, {
    d: 25,
    focus: 'Who Will Live Under Kingdom Rule?',
    verse: 'Ps 37:29',
    script: 'Read Psalm 37:29. Ask: "Who will inherit the earth?" Distinguish between the anointed (144,000 who rule in heaven) and the "great crowd" who will live on earth under Kingdom rule.',
    discuss: ['What kind of people will be welcome in the new world?', 'What changes do we need to make now to be ready?'],
    activity: 'Read Revelation 7:9,14. Describe the "great crowd." Who are they? What did they do? Where do they stand?',
    answers: {
      'Two hopes?': '144,000 anointed rule with Christ in heaven; great crowd of "other sheep" inherit paradise earth — John 10:16'
    }
  }, {
    d: 26,
    focus: 'Prayer for the Kingdom — Matt 6:9-10',
    verse: 'Matt 6:9-10',
    script: 'Re-read Matthew 6:9-10. Ask: "When Jesus said to pray for God\'s Kingdom to come, what was he saying? Is this a prayer for something already here, or something still coming fully?" Discuss the "coming" in full power.',
    discuss: ['How often do you pray specifically for God\'s Kingdom?', 'What difference would it make if everyone prayed this sincerely?'],
    activity: 'Write a Kingdom prayer in your own words — specific, personal, from the heart.',
    answers: {
      'Matt 6:10 meaning?': 'Praying for Jehovah\'s sovereignty to be fully vindicated and His Kingdom to begin its work of transforming earth to paradise'
    }
  }, {
    d: 27,
    focus: 'Preaching the Kingdom — Matt 24:14',
    verse: 'Matt 24:14',
    script: 'Read Matthew 24:14. Ask: "Who is responsible to preach this good news? Where? When will it end?" Discuss how preaching is the most important work we can do right now.',
    discuss: ['How does knowing about the Kingdom motivate you to share it?', 'What is one way you can share the Kingdom hope this week?'],
    activity: 'Prepare a 2-minute Kingdom presentation. Practice on a family member. Use one scripture.',
    answers: {
      'Matt 24:14 responsibility?': 'EVERY disciple is responsible to share — it will be preached in ALL the inhabited earth — then the end comes'
    }
  }, {
    d: 28,
    focus: 'Daniel\'s Prophecy — Dan 2:31-45',
    verse: 'Dan 2:44',
    script: 'Read Daniel 2:31-45 together. Explain the statue and what each part represents (Babylon, Medo-Persia, Greece, Rome, Divided nations). The rock = God\'s Kingdom that destroys all.',
    discuss: ['Why is Daniel\'s prophecy remarkable from a historical standpoint?', 'How does fulfilled prophecy build faith?'],
    activity: 'Draw the statue from Daniel 2. Label each section with the correct world power.',
    answers: {
      'The rock in Dan 2?': 'Represents God\'s Kingdom — cut without hands (no human origin) — will crush all human kingdoms and stand forever'
    }
  }, {
    d: 29,
    focus: 'Life Under Kingdom Rule',
    verse: 'Isa 35:5-6',
    script: 'Read Isaiah 35:5-6 and Micah 4:3-4. Paint a verbal picture: no sickness, no war, everyone has their own home and garden, animals are peaceful, resurrected loved ones return.',
    discuss: ['Who in your family do you hope to see resurrected?', 'What specific problem in your life will the Kingdom fix?'],
    activity: 'Write a "Day in Paradise" journal entry — describe your perfect day in the new world using Bible details.',
    answers: {
      'Isa 35 promises?': 'Blind see, deaf hear, lame walk, mute speak — nature restored — these are literal, not just symbolic healings'
    }
  }, {
    d: 30,
    focus: 'Unit 3 Review + Presentations',
    verse: 'Synthesis',
    script: 'Students share their "Day in Paradise" journals. Complete unit quiz. Discussion: "Why is the Kingdom our only true hope?" Close with song and prayer.',
    discuss: ['What is YOUR hope for the Kingdom?'],
    activity: 'Unit quiz and binder update. Preview Unit 4: Why Does God Allow Suffering?',
    answers: {
      'Unit 3 summary': ['Kingdom is a real government ruling from heaven since 1914', 'It will replace all human governments', 'Paradise earth for billions — forever', 'Preaching is our urgent response', 'Fulfilled prophecy proves it is real']
    }
  }]
}, {
  unit: 4,
  title: 'Why Does God Allow Suffering?',
  days: 5,
  source: 'Bible Teach Ch.11; jw.org/en/library/books/bible-teach/why-does-god-allow-suffering/',
  overview: 'Students understand the issue of sovereignty, why Jehovah has permitted suffering temporarily, and how this will be resolved.',
  keyVerses: ['Gen 3:1-5', 'Rom 5:12', 'Rev 21:4'],
  lessons: [{
    d: 31,
    focus: 'The Big Questions About Suffering',
    verse: 'Hab 1:3',
    script: 'Read Habakkuk 1:3. Ask: "Have you ever asked this question?" Validate the emotion. Then say: "Jehovah has a satisfying answer — not just \'be patient.\' Let\'s find it."',
    discuss: ['Why do YOU think God allows suffering?', 'What is the most painful form of suffering for you personally?'],
    activity: 'Write down the 3 hardest questions you have about suffering. We\'ll answer them this unit.',
    answers: {
      'Why this matters?': 'If God is all-powerful and loving, there must be a REASON He permits suffering — the Bible gives a satisfying answer involving sovereignty and free will'
    }
  }, {
    d: 32,
    focus: 'How Suffering Began — The Issue of Sovereignty',
    verse: 'Gen 3:1-5',
    script: 'Read Genesis 3:1-5. Explain: Satan challenged Jehovah\'s RIGHT to rule. He said: (1) God is a liar, (2) You can run your own life better. This was a challenge that had to be answered over TIME — not just by God zapping Satan.',
    discuss: ['Why didn\'t God just destroy Satan immediately?', 'What would that have proven to the angels watching?'],
    activity: 'Write the argument Satan made in Gen 3. Then write Jehovah\'s response from a biblical perspective.',
    answers: {
      'Satan\'s challenges?': '(1) God lied — you will not die; (2) God withholds good — you can be like God; (3) implied: God has no right to rule — man is better off independent'
    }
  }, {
    d: 33,
    focus: 'Why Time Was Needed',
    verse: 'Rom 5:12',
    script: 'Read Romans 5:12. Explain that Adam\'s choice brought sin and death to ALL his children. The 6,000-year "court case" has demonstrated: (1) humans CANNOT rule themselves (Jer 10:23), (2) loyal ones WILL serve Jehovah under any pressure (Job\'s example).',
    discuss: ['What has history proven about human self-rule?', 'How does Job\'s example encourage you when you suffer?'],
    activity: 'Read Job 1:8-12. What challenge did Satan make? Read Job 1:22. How did Job respond? What did this prove?',
    answers: {
      'What Romans 5:12 teaches?': 'Through one man (Adam) sin entered and spread to all — suffering and death are the consequence of that rebellion, not God\'s original design'
    }
  }, {
    d: 34,
    focus: 'Jehovah Feels Our Pain',
    verse: 'John 11:35',
    script: 'Read John 11:35. Ask: "Why did Jesus weep if he knew he was about to resurrect Lazarus?" Discuss: Jehovah and Jesus are NOT indifferent to our suffering. They FEEL it with us. Isa 63:9.',
    discuss: ['How does it help to know Jehovah sees and feels your pain?', 'What is one current suffering you can bring to Jehovah in prayer today?'],
    activity: 'Read Isaiah 63:9. Write a prayer that shares your current pain honestly with Jehovah.',
    answers: {
      'Why did Jesus weep?': 'He felt the pain of those mourning — showing empathy, not just power — Jehovah is not a distant uncaring God'
    }
  }, {
    d: 35,
    focus: 'The Resolution Is Coming',
    verse: 'Rev 21:4',
    script: 'Read Revelation 21:4. Ask: "Is this a hope or a promise?" It is a promise — God will WIPE OUT every tear. Every cause of suffering will be eliminated. This is the answer Jehovah has been preparing.',
    discuss: ['What specific suffering do you most want Jehovah to wipe away?'],
    activity: 'Write answers to the 3 questions from Day 31 using what you\'ve learned. Store in binder.',
    answers: {
      'Rev 21:4 guarantee?': 'He will wipe out EVERY tear — death, mourning, outcrying, pain ALL gone — the word "former" means a complete break from everything painful'
    }
  }]
}, {
  unit: 5,
  title: 'The Resurrection Hope',
  days: 5,
  source: 'Bible Teach Ch.7; jw.org/en/library/books/bible-teach/resurrection/',
  overview: 'Understanding the resurrection as a real, literal hope — not going to heaven at death but a future resurrection to life.',
  keyVerses: ['John 5:28-29', 'Acts 24:15', 'Dan 12:13'],
  lessons: [{
    d: 36,
    focus: 'What Happens When We Die?',
    verse: 'Eccl 9:5',
    script: 'Read Ecclesiastes 9:5. Ask: "According to this verse, what do the dead know?" Dispel the myth of an immortal soul going to heaven. The dead are unconscious — like a deep sleep.',
    discuss: ['Why does it comfort you to know the dead are not suffering?', 'How does this change how we view funerals?'],
    activity: 'Read Genesis 2:7 — man BECAME a living soul (not given one). Draw the equation: dust + breath of life = living soul. Remove breath = the soul dies.',
    answers: {
      'Eccl 9:5 teaching?': 'The dead are not conscious — they cannot think, feel, or communicate — death is like a dreamless sleep, not a conscious state'
    }
  }, {
    d: 37,
    focus: 'The Resurrection Promise',
    verse: 'John 5:28-29',
    script: 'Read John 5:28-29 slowly. Ask: "Who made this promise? How many will be resurrected? What kinds of resurrection are there?" All who are in the memorial tombs — billions — will hear his voice.',
    discuss: ['Who do YOU want to see resurrected?', 'What will you say to them first?'],
    activity: 'Read Acts 24:15. Write the names of loved ones you hope to see in the resurrection.',
    answers: {
      'John 5:28-29 promise?': 'ALL those in memorial tombs will be resurrected — a resurrection of the righteous AND the unrighteous — Jesus himself made this promise'
    }
  }, {
    d: 38,
    focus: 'Resurrection Examples in the Bible',
    verse: 'John 11:43-44',
    script: 'Read the resurrection of Lazarus (John 11:38-44) dramatically. Ask: "How long had Lazarus been dead? What condition was the body in? What does this tell us about God\'s power?"',
    discuss: ['Why did Jesus resurrect these specific people while others died?', 'How does each resurrection account build your faith?'],
    activity: 'Find 3 Bible resurrections (Elijah, Jesus, Jairus\'s daughter). List: WHO raised them, HOW LONG were they dead, WHAT was the result.',
    answers: {
      'Lazarus significance?': '4 days dead — body decaying — impossible by human standards — Jesus raised him to demonstrate what the Kingdom resurrection will accomplish for millions'
    }
  }, {
    d: 39,
    focus: 'Heaven or Earth — Two Hopes',
    verse: 'Ps 37:29',
    script: 'Re-read Psalm 37:29. Ask: "Where does the Bible say the righteous will live?" Explain the two hopes: 144,000 anointed who rule in heaven, and the "great crowd" who will be resurrected to/survive into paradise earth.',
    discuss: ['How do you know which hope is yours?', 'How does understanding the earthly hope make the resurrection more exciting?'],
    activity: 'Read Revelation 5:10 — "they will reign over the earth." Read Revelation 7:9. Compare the groups. Draw a diagram showing heaven and earth separately.',
    answers: {
      'Two hopes distinction?': 'Anointed 144,000 rule with Christ in heaven (born again to heavenly life); great crowd and other righteous resurrected to enjoy eternal life on earth — separate but related hopes'
    }
  }, {
    d: 40,
    focus: 'Living With Resurrection Hope',
    verse: '1 Cor 15:55',
    script: 'Read 1 Corinthians 15:55. Ask: "How should the resurrection hope change how we feel about death?" Discuss how this hope comforts us when loved ones die, how it motivates our daily choices.',
    discuss: ['How does the resurrection hope change how you feel about: (1) growing old, (2) losing a loved one, (3) your own death?'],
    activity: 'Unit quiz. Write your own "hope statement" — one paragraph about your personal resurrection hope.',
    answers: {
      'Practical impact of resurrection hope?': 'Death loses its sting — we grieve but not as those without hope (1 Thess 4:13) — every loss is temporary, not permanent'
    }
  }]
}, {
  unit: 6,
  title: 'Prayer and Bible Study',
  days: 5,
  source: 'Bible Teach Ch.17; jw.org/en/library/books/bible-teach/prayer/',
  overview: 'Developing a meaningful personal relationship with Jehovah through regular prayer and Bible study habits.',
  keyVerses: ['Phil 4:6', '2 Tim 3:16-17', 'Josh 1:8'],
  lessons: [{
    d: 41,
    focus: 'How to Pray Effectively',
    verse: 'Phil 4:6',
    script: 'Read Philippians 4:6-7. Note the elements: do not be anxious → pray about EVERYTHING → give thanks. The result: the peace of God guards your heart. Ask: "How specific do you get when you pray?"',
    discuss: ['What stops people from praying regularly?', 'What is the difference between a memorized prayer and a heartfelt one?'],
    activity: 'Practice a heartfelt spontaneous prayer — not memorized — talking to Jehovah like a close friend.',
    answers: {
      'Phil 4:6-7 formula?': '(1) Be anxious about nothing (2) Pray about everything with thanksgiving (3) Result = God\'s peace guards heart and mind'
    }
  }, {
    d: 42,
    focus: 'Why Bible Study Works',
    verse: '2 Tim 3:16-17',
    script: 'Read 2 Timothy 3:16-17. List the 4 uses of scripture: teaching, reproving, setting things straight, disciplining. Ask: "Which of these do you most need right now?"',
    discuss: ['What is the difference between reading the Bible and studying it?', 'How can we make Bible study a daily habit?'],
    activity: 'Set up a Bible reading schedule. Choose a Bible book to read this month. Log reading daily.',
    answers: {
      '4 uses of scripture?': '(1) Teaching doctrine, (2) Reproving wrong conduct, (3) Setting things straight (correcting mistakes), (4) Disciplining in righteousness'
    }
  }, {
    d: 43,
    focus: 'Meditation — Josh 1:8',
    verse: 'Josh 1:8',
    script: 'Read Joshua 1:8. Define meditation as "turning a thought over in your mind deeply — not just reading, but THINKING about what you read." Ask: "What\'s the last thing you deeply thought about from the Bible?"',
    discuss: ['How is Bible meditation different from just reading?', 'What is one Bible verse you want to meditate on today?'],
    activity: 'Read Psalm 1:1-3. Meditate on it for 5 minutes. Write down 3 thoughts that came to you during meditation.',
    answers: {
      'Meditation per Josh 1:8?': 'Reading AND meditating — day AND night — then acting on it = the path to success and good results'
    }
  }, {
    d: 44,
    focus: 'Personal Worship — Making Time',
    verse: 'Heb 10:24-25',
    script: 'Read Hebrews 10:24-25. Ask: "Why does meeting together matter? Can we have personal worship alone?" Discuss the importance of both private study AND congregation meetings.',
    discuss: ['What is your current Bible reading routine?', 'How do meetings and personal study work together?'],
    activity: 'Design your personal weekly worship schedule: prayer times, Bible reading, meeting prep, family study.',
    answers: {
      'Heb 10:25 warning?': 'Not forsaking meeting together — the pattern of some — but encouraging one another as the day draws near — meetings are non-negotiable'
    }
  }, {
    d: 45,
    focus: 'Unit Review — Building Habits',
    verse: 'Synthesis',
    script: 'Review Units 1-6 milestones. Discuss habit formation. Make a "Spiritual Habits Tracker" for the next 30 days.',
    discuss: ['Which spiritual habit is your greatest strength? Greatest weakness?'],
    activity: 'Complete Unit 6 quiz. Set 3 specific spiritual goals for the next month. Sign and date them.',
    answers: {
      'Key habit building principles?': ['Daily prayer — morning and evening minimum', 'Bible reading — at least one chapter daily', 'Meeting attendance — all scheduled meetings', 'Service — regular participation in ministry']
    }
  }]
}, {
  unit: 7,
  title: 'Family and Marriage — Jehovah\'s Design',
  days: 5,
  source: 'Bible Teach Ch.14; jw.org/en/library/books/bible-teach/family/',
  overview: 'Understanding Jehovah\'s design for family, the role of parents and children, and why Jehovah\'s standards for marriage protect us.',
  keyVerses: ['Eph 5:22-25', 'Col 3:20', 'Deut 6:6-7'],
  lessons: [{
    d: 46,
    focus: 'God\'s Pattern for Family',
    verse: 'Eph 5:22-25',
    script: 'Read Ephesians 5:22-25. Discuss the headship arrangement: Jehovah → Christ → Husband → Wife. Ask: "Why do you think Jehovah set up family roles?" Emphasize these are roles, not rankings of worth.',
    discuss: ['How does the headship arrangement protect the family?', 'What happens when family members ignore their roles?'],
    activity: 'Draw the headship diagram from Ephesians 5-6. Label each role and its corresponding responsibility.',
    answers: {
      'Headship arrangement?': 'Husband as head like Christ is head of the congregation — not domination but loving self-sacrifice — wife as complement, not inferior'
    }
  }, {
    d: 47,
    focus: 'Children\'s Role — Col 3:20',
    verse: 'Col 3:20',
    script: 'Read Colossians 3:20. Ask: "How does obedience to parents connect to pleasing Jehovah?" Discuss the link: respecting parents is practice for respecting Jehovah\'s authority.',
    discuss: ['Why do you think Jehovah put children under parental authority?', 'What is one way you show honor to your parents daily?'],
    activity: 'Write a letter of appreciation to your parents. Be specific about things you\'re thankful for.',
    answers: {
      'Col 3:20 command?': 'Children obey parents in all things — because this is well-pleasing to the Lord — not just because parents say so but because Jehovah values it'
    }
  }, {
    d: 48,
    focus: 'Teaching Children — Deut 6:6-7',
    verse: 'Deut 6:6-7',
    script: 'Read Deuteronomy 6:6-7. Ask: "When and where should parents teach spiritual things?" Note: when sitting, walking, lying down, getting up — CONSTANTLY, not just at set times.',
    discuss: ['How does YOUR family discuss spiritual things informally?', 'What is one informal spiritual conversation you could start today?'],
    activity: 'Plan a family "walk and talk" — go for a 20-minute walk discussing one spiritual topic.',
    answers: {
      'Deut 6:7 method?': 'Impress upon children — repeat, discuss, make it part of every activity — not a weekly formal class only but constant natural integration'
    }
  }, {
    d: 49,
    focus: 'Peer Pressure and Bad Associations',
    verse: '1 Cor 15:33',
    script: 'Read 1 Corinthians 15:33. Ask: "What does this verse warn about?" Discuss how friendships shape values and behavior — for good or bad. Then read Proverbs 13:20.',
    discuss: ['What qualities do you look for in a friend?', 'How do you handle pressure from friends who have different values?'],
    activity: 'Rate your 3 closest friendships: Are they making you better or worse spiritually? Be honest.',
    answers: {
      '1 Cor 15:33 warning?': 'Bad associations corrupt useful habits — the people we spend time with gradually reshape our values, speech, and behavior'
    }
  }, {
    d: 50,
    focus: 'Unit Review — Family Appreciation',
    verse: 'Synthesis',
    script: 'Have each family member share one thing they appreciate about every other member. Unit quiz. Close with a family prayer of gratitude.',
    discuss: ['What is the strongest thing about YOUR family?'],
    activity: 'Family appreciation circle. Quiz. Binder update. Preview Weeks 11-18 overview.',
    answers: {
      'Unit 7 summary': ['Headship protects the family — not about worth but role', 'Children honor parents as practice for honoring Jehovah', 'Spiritual teaching woven into daily life', 'Choose friends wisely — associations shape character']
    }
  }]
}, {
  unit: 8,
  title: 'Living as Christians in a Difficult World',
  days: 10,
  source: 'Bible Teach Ch.15-16; jw.org',
  overview: 'Practical application of Bible principles in daily life: entertainment choices, work, school, social media, integrity, and enduring to the end.',
  keyVerses: ['Rom 12:2', 'Phil 4:8', '1 John 2:15-17'],
  lessons: [{
    d: 51,
    focus: 'Christian Neutrality',
    verse: 'John 17:16',
    script: 'Read John 17:16. Ask: "What does \'no part of the world\' mean practically?" Discuss political neutrality, military service, and why JWs remain neutral.',
    discuss: ['How do you explain neutrality to friends who don\'t understand?', 'What are the challenges of being neutral?'],
    activity: 'Find jw.org article: "Why Don\'t Jehovah\'s Witnesses Get Involved in Politics?" Summarize in 3 points.',
    answers: {
      'Christian neutrality basis?': 'We follow Jesus who refused earthly kingship (John 6:15) — our citizenship is in heaven (Phil 3:20) — we trust Jehovah\'s Kingdom, not human politics'
    }
  }, {
    d: 52,
    focus: 'Entertainment Choices',
    verse: 'Phil 4:8',
    script: 'Read Philippians 4:8. Create a checklist: Is what I\'m watching/playing/listening to — TRUE? VIRTUOUS? JUST? PURE? LOVABLE? Of FINE REPORT? Use this as a filter for entertainment choices.',
    discuss: ['What entertainment do you currently enjoy? How does it score on the Phil 4:8 filter?', 'Has any entertainment ever affected your thinking or mood negatively?'],
    activity: 'Apply the Phil 4:8 filter to 3 specific shows, games, or songs you enjoy. Be honest with yourself.',
    answers: {
      'Phil 4:8 entertainment filter?': 'These things are the filter: true, virtuous, righteous, chaste, lovable, well-spoken of — "continue considering these things"'
    }
  }, {
    d: 53,
    focus: 'Social Media Wisdom',
    verse: 'Prov 11:2',
    script: 'Read Proverbs 11:2. Discuss: How does pride drive social media behavior? Oversharing, seeking validation, comparing ourselves. Ask: "What does wisdom look like on social media?"',
    discuss: ['What are the dangers of social media for a Christian?', 'How can social media be used for good?'],
    activity: 'Create a personal "Social Media Rules" list based on Bible principles. Be specific and honest.',
    answers: {
      'Social media wisdom principles?': 'Privacy (Eccl 3:7), no boasting (Jer 9:23), kindness (Eph 4:29), truth only (Prov 12:17), modesty (1 Pet 5:5)'
    }
  }, {
    d: 54,
    focus: 'School and Work — Integrity',
    verse: 'Col 3:23',
    script: 'Read Colossians 3:23. Ask: "How should a Christian approach school work or a job?" Discuss integrity: no cheating, doing your best, being honest even when it costs you.',
    discuss: ['Has it ever been tempting to cheat or cut corners? What did you do?', 'How does your work/school performance reflect on Jehovah?'],
    activity: 'Write: "What does integrity at school look like for ME specifically?" Give 3 concrete examples.',
    answers: {
      'Col 3:23 principle?': 'Work whole-souled as for Jehovah, not for men — quality and integrity in ALL work, not just ministry — your daily work is spiritual service'
    }
  }, {
    d: 55,
    focus: 'Handling Conflict Peacefully',
    verse: 'Matt 5:9',
    script: 'Read Matthew 5:9 and Romans 12:18. Ask: "Is peace always possible? What does \'as far as it depends on you\' mean?" Discuss the difference between being a peacemaker and being a pushover.',
    discuss: ['Describe a conflict you handled badly. How could you have applied Matt 5:9?'],
    activity: 'Role-play: How would you handle (1) a classmate spreading rumors, (2) a family argument, (3) a neighbor who is unfair.',
    answers: {
      'Peacemaking vs. pushover?': 'Peacemaking takes courage — it means pursuing peace actively, not just avoiding conflict — sometimes it requires honest, loving confrontation'
    }
  }, {
    d: 56,
    focus: 'Materialism — Keep Your Life Free',
    verse: 'Heb 13:5',
    script: 'Read Hebrews 13:5. Ask: "What does \'free from the love of money\' look like practically?" Discuss the difference between needs and wants, and why contentment is rare and precious.',
    discuss: ['What possessions are you tempted to love more than Jehovah?', 'How does materialism compete with Kingdom interests?'],
    activity: 'Evaluate your spending/wanting habits: What do I spend money on that adds little real value? What brings lasting joy?',
    answers: {
      'Heb 13:5 principle?': 'Be content with current possessions — love of money is a root of harmful things (1 Tim 6:10) — wealth is temporary, Kingdom is eternal'
    }
  }, {
    d: 57,
    focus: 'Enduring to the End',
    verse: 'Matt 24:13',
    script: 'Read Matthew 24:13. Ask: "What does it mean to \'endure to the end\'? What makes endurance hard?" Share the illustration: a marathon — the finish line matters more than the starting pace.',
    discuss: ['What makes you want to give up sometimes?', 'What keeps you going spiritually?'],
    activity: 'Read Hebrews 12:1-3 — the cloud of witnesses. Write the name of one person (past or present) whose endurance inspires you.',
    answers: {
      'Matt 24:13 promise?': 'The one who endures to the END — that specific person — will be saved. Endurance is ongoing, not a one-time event'
    }
  }, {
    d: 58,
    focus: 'Staying Spiritually Strong — Armor of God',
    verse: 'Eph 6:11',
    script: 'Read Ephesians 6:11-17 dramatically. Name each piece of armor: truth, righteousness, good news, faith, salvation, word of God. Ask: "Which piece do YOU feel weakest in?"',
    discuss: ['How do we put on the armor of God practically — it\'s not literal?'],
    activity: 'Draw the armor and label each piece. Next to each, write a specific way you will "wear" it this week.',
    answers: {
      'Armor of God pieces?': 'Belt=truth; Breastplate=righteousness; Footwear=readiness from good news; Shield=faith; Helmet=salvation; Sword=God\'s word (only offensive weapon)'
    }
  }, {
    d: 59,
    focus: 'Our Spiritual Routine',
    verse: '1 Cor 9:27',
    script: 'Read 1 Corinthians 9:27. Paul "disciplined his body." Ask: "What spiritual disciplines keep you healthy?" Discuss the weekly spiritual routine: personal study, meeting prep, service, family worship.',
    discuss: ['What is your spiritual routine right now? What\'s missing?'],
    activity: 'Design your ideal weekly spiritual schedule. Compare to current reality. Identify gaps.',
    answers: {
      '1 Cor 9:27 principle?': 'Conscious self-discipline — not leaving spirituality to chance — actively training the mind and heart like an athlete trains the body'
    }
  }, {
    d: 60,
    focus: 'Unit 8 Review — Living Our Faith',
    verse: 'Synthesis',
    script: 'Review all practical topics. Students share: "One way I will apply what I learned this unit starting today."',
    discuss: ['Which topic was most convicting for you?'],
    activity: 'Complete Unit 8 quiz. Full binder review of all 8 units. Plan for Units 9-18.',
    answers: {
      'Unit 8 summary': ['Christian neutrality — no part of the world', 'Entertainment filter — Phil 4:8', 'Integrity in all work', 'Peacemaking takes courage', 'Endure to the end — Matt 24:13']
    }
  }]
}];

// Generate days 61-180 as a compact format (remaining 9 units)
const BIBLE_UNITS_COMPACT = [{
  unit: 9,
  title: 'Baptism and Dedication',
  days: 10,
  source: 'Bible Teach Ch.18',
  range: '61-70',
  summary: 'What baptism means, how to prepare, the dedication vow, and living dedicated life.',
  keyTopics: ['What is dedication?', 'Baptism requirements', 'Living your vow daily', 'Renewing dedication after failure'],
  keyVerses: ['Matt 28:19', 'Rom 6:4', 'Acts 8:36-38']
}, {
  unit: 10,
  title: 'The Earth — Jehovah\'s Footstool',
  days: 5,
  source: 'Ps 115:16; jw.org',
  range: '71-75',
  summary: 'Stewardship of the earth, environmental responsibility, wonder at creation, Jehovah as Creator.',
  keyTopics: ['Creation vs. evolution', 'Stewardship of creation', 'Psalm 104 study', 'Science and faith'],
  keyVerses: ['Ps 104:24', 'Gen 1:28', 'Rev 11:18']
}, {
  unit: 11,
  title: 'The Holy Spirit — God\'s Active Force',
  days: 5,
  source: 'Bible Teach Ch.15',
  range: '76-80',
  summary: 'What the holy spirit is (not a person), how it operates, how to pray for it, fruits of the spirit.',
  keyTopics: ['Spirit as force not person', 'Fruits of the spirit (Gal 5:22-23)', 'How to receive holy spirit', 'Grieving the spirit'],
  keyVerses: ['Acts 2:17', 'Gal 5:22-23', 'Luke 11:13']
}, {
  unit: 12,
  title: 'Satan and the Demons',
  days: 5,
  source: 'Bible Teach Ch.10',
  range: '81-85',
  summary: 'Who Satan and demons are, how they operate, how to resist them, the outcome of their judgment.',
  keyTopics: ['Origin of Satan', 'How demons operate today', 'Resisting the Devil (Jas 4:7)', 'Their future destruction'],
  keyVerses: ['1 Pet 5:8', 'Jas 4:7', 'Rev 20:10']
}, {
  unit: 13,
  title: 'Blood and Medical Choices',
  days: 5,
  source: 'Bible Teach; jw.org/en/medical-library/',
  range: '86-90',
  summary: 'Why Jehovah\'s Witnesses respect blood, the sacredness of blood in Scripture, and navigating medical decisions.',
  keyTopics: ['Acts 15:28-29 — abstain from blood', 'Blood as sacred symbol', 'Medical alternatives', 'Advance medical directives'],
  keyVerses: ['Acts 15:28', 'Lev 17:14', 'John 15:13']
}, {
  unit: 14,
  title: 'Tongues, False Religion, and True Worship',
  days: 10,
  source: 'Bible Teach Ch.13',
  range: '91-100',
  summary: 'Identifying true religion, Babylon the Great, why JWs don\'t celebrate certain holidays.',
  keyTopics: ['Marks of true religion', 'Babylon the Great', 'Holiday origins', 'Coming out of false religion'],
  keyVerses: ['Matt 7:21-23', 'Rev 18:4', 'John 4:23-24']
}, {
  unit: 15,
  title: 'The Last Days — Signs and Response',
  days: 10,
  source: 'Bible Teach Ch.9; Matt 24',
  range: '101-110',
  summary: 'Deep study of Matthew 24, Daniel 12, and Revelation 16 signs of the end.',
  keyTopics: ['Matthew 24 sign by sign', 'What to do in the last days', 'Armageddon — what it is', 'Surviving the end'],
  keyVerses: ['Matt 24:3-14', 'Dan 12:1', 'Rev 16:16']
}, {
  unit: 16,
  title: 'The New World — Life After Armageddon',
  days: 10,
  source: 'Bible Teach Ch.8',
  range: '111-120',
  summary: 'What the first days/years of the new world will look like, the resurrection process, healing, building.',
  keyTopics: ['The resurrection process', 'Healing and perfection', 'New earth government', 'Meeting resurrected ones'],
  keyVerses: ['Rev 21:3-5', 'Isa 65:21-23', 'John 5:28-29']
}, {
  unit: 17,
  title: 'Prophetic Books — Daniel and Revelation',
  days: 30,
  source: 'jw.org; "Pure Worship" book; "Pay Attention to Daniel\'s Prophecy"',
  range: '121-150',
  summary: 'Survey of key prophecies, the 2,300 days, seven seals, 144,000, great tribulation.',
  keyTopics: ['Daniel 2 statue', 'Daniel 4 — seven times', 'Revelation seals', '144,000 and great crowd'],
  keyVerses: ['Dan 2:44', 'Dan 4:25', 'Rev 7:9', 'Rev 14:1']
}, {
  unit: 18,
  title: 'Year-End Review and Personal Goals',
  days: 30,
  source: 'All units',
  range: '151-180',
  summary: 'Comprehensive review of all 17 units, personal spiritual goals for the year ahead, presentations, certificates.',
  keyTopics: ['Portfolio review', 'Personal testimony', 'Ministry presentation', 'Goals for baptism'],
  keyVerses: ['Phil 3:13-14', '2 Tim 4:7-8', 'Rev 22:20']
}];

// ═══ DISCOVERING KIDS ACADEMY — SCHOOL MODULE v2 ══════════════════════════════
// Children: see assignments + timers (no teacher content)
// Admin/Teacher (Laurel): sees everything + teacher script + answer key
// All subject time integrates with the main clock system

// Subject expected durations in minutes
const SUBJECT_TIMES = {
  bible: 45,
  science: 30,
  lang: 40,
  math: 45,
  history: 30,
  comp: 20,
  art: 20
};

// ─── useSchool hook ───────────────────────────────────────────────────────────
function useSchool() {
  const [progress, setProgress] = useState({});
  const [notes, setNotes] = useState({});
  useEffect(() => {
    const u1 = syncOn('school/progress', d => {
      if (d) setProgress(d);
    });
    const u2 = syncOn('school/notes', d => {
      if (d) setNotes(d);
    });
    return () => {
      u1();
      u2();
    };
  }, []);
  function saveProgress(studentId, day, subjectId, done, actualMins) {
    const key = `${studentId}_d${day}_${subjectId}`;
    const prev_val = progress[key] || {
      done: false,
      actualMins: 0,
      attempts: [],
      status: 'not_started'
    };
    const attempts = [...(prev_val.attempts || [])];
    if (done && actualMins > 0) {
      attempts.push({
        mins: Math.round(actualMins * 10) / 10,
        ts: Date.now(),
        label: attempts.length === 0 ? 'Attempt 1' : `Redo ${attempts.length}`
      });
    }
    const totalMins = attempts.reduce((s, a) => s + a.mins, 0);
    // When student marks done, status moves to 'submitted' awaiting teacher review
    const status = done ? 'submitted' : prev_val.status || 'not_started';
    const val = {
      ...prev_val,
      done: false,
      actualMins: totalMins,
      attempts,
      status,
      ts: Date.now()
    };
    setProgress(prev => ({
      ...prev,
      [key]: val
    }));
    syncSet('school/progress/' + key, val);
  }
  function resetProgress(studentId, day, subjectId, adminNote) {
    const key = `${studentId}_d${day}_${subjectId}`;
    const prev_val = progress[key] || {
      done: false,
      actualMins: 0,
      attempts: []
    };
    const val = {
      ...prev_val,
      done: false,
      status: 'needs_redo',
      resetAt: Date.now(),
      resetNote: adminNote || 'Admin reset — please redo'
    };
    setProgress(prev => ({
      ...prev,
      [key]: val
    }));
    syncSet('school/progress/' + key, val);
  }
  function submitForReview(studentId, day, subjectId) {
    const key = `${studentId}_d${day}_${subjectId}`;
    const prev_val = progress[key] || {
      done: false,
      actualMins: 0,
      attempts: []
    };
    const val = {
      ...prev_val,
      status: 'submitted',
      submittedAt: Date.now()
    };
    setProgress(prev => ({
      ...prev,
      [key]: val
    }));
    syncSet('school/progress/' + key, val);
  }
  function gradeAssignment(studentId, day, subjectId, {
    grade,
    score,
    feedback,
    approved
  }) {
    const key = `${studentId}_d${day}_${subjectId}`;
    const prev_val = progress[key] || {
      done: false,
      actualMins: 0,
      attempts: []
    };
    const val = {
      ...prev_val,
      grade,
      score: score || null,
      feedback: feedback || '',
      teacherApproved: !!approved,
      status: approved ? 'approved' : 'needs_redo',
      gradedAt: Date.now(),
      done: !!approved
    };
    setProgress(prev => ({
      ...prev,
      [key]: val
    }));
    syncSet('school/progress/' + key, val);
    // Save notification for student
    const notifId = 'sn_' + Date.now();
    const msg = approved ? `✅ ${grade} — Job Well Done! ${feedback || ''}` : `${grade} — Redo needed: ${feedback || 'Please review and resubmit.'}`;
    syncSet('school/feedback/' + studentId + '/' + key, {
      grade,
      score,
      feedback,
      approved,
      ts: Date.now(),
      subjectId,
      day,
      msg,
      read: false
    });
  }
  function getProgress(studentId, day, subjectId) {
    return progress[`${studentId}_d${day}_${subjectId}`] || {
      done: false,
      actualMins: 0,
      attempts: []
    };
  }
  function getDayDone(studentId, day) {
    return SUBJECTS.every(s => getProgress(studentId, day, s.id).done);
  }
  function saveNote(studentId, day, text) {
    const key = `${studentId}_d${day}`;
    setNotes(prev => ({
      ...prev,
      [key]: text
    }));
    syncSet('school/notes/' + key, text);
  }
  function getNote(studentId, day) {
    return notes[`${studentId}_d${day}`] || '';
  }

  // ── Teacher Prep: track which Bible units teacher has studied ──
  const [unitChecks, setUnitChecks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dka_unit_checks') || '{}');
    } catch {
      return {};
    }
  });
  function toggleUnitCheck(unitId) {
    const next = {
      ...unitChecks,
      [unitId]: !unitChecks[unitId]
    };
    setUnitChecks(next);
    localStorage.setItem('dka_unit_checks', JSON.stringify(next));
    syncSet('school/unit_checks', next);
  }

  // ── Meeting Study: weekly JW schedule check-ins ──
  const [meetingStudy, setMeetingStudy] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dka_meeting_study') || '{}');
    } catch {
      return {};
    }
  });
  function toggleMeetingItem(weekKey, item) {
    const prev = meetingStudy[weekKey] || {};
    const next = {
      ...meetingStudy,
      [weekKey]: {
        ...prev,
        [item]: !prev[item]
      }
    };
    setMeetingStudy(next);
    localStorage.setItem('dka_meeting_study', JSON.stringify(next));
    syncSet('school/meeting_study', next);
  }
  function getMeetingWeek(weekKey) {
    return meetingStudy[weekKey] || {};
  }
  return {
    saveProgress,
    resetProgress,
    gradeAssignment,
    submitForReview,
    getProgress,
    getDayDone,
    saveNote,
    getNote,
    progress,
    toggleUnitCheck,
    unitChecks,
    toggleMeetingItem,
    getMeetingWeek
  };
}

// ─── Clock-in helper for school subjects ─────────────────────────────────────
function schoolClockIn(personId, sessions, onUpdate) {
  const data = sessions[personId] || {
    current: null,
    today: []
  };
  // If already clocked in to something else, clock out first
  let today = data.today || [];
  if (data.current) {
    const dur = (Date.now() - data.current.startTime) / 60000;
    today = [...today, {
      ...data.current,
      endTime: Date.now(),
      duration: Math.round(dur * 10) / 10
    }];
  }
  const s = {
    activity: 'school',
    startTime: Date.now(),
    approvalStatus: 'approved'
  };
  const updated = {
    ...sessions,
    [personId]: {
      current: s,
      today
    }
  };
  onUpdate(updated);
  syncSet('sessions/' + todayKey() + '/' + personId, {
    current: s,
    today
  });
}
function schoolClockOut(personId, sessions, onUpdate, actualMins) {
  const data = sessions[personId] || {
    current: null,
    today: []
  };
  if (!data.current) return;
  const dur = actualMins || (Date.now() - data.current.startTime) / 60000;
  const entry = {
    ...data.current,
    endTime: Date.now(),
    duration: Math.round(dur * 10) / 10
  };
  const today = [...(data.today || []), entry];
  const updated = {
    ...sessions,
    [personId]: {
      current: null,
      today
    }
  };
  onUpdate(updated);
  syncSet('sessions/' + todayKey() + '/' + personId, {
    current: null,
    today
  });
}

// ─── General work clock-in/out (any CLOCK_ACTS activity) ────────────────────
// Multiple tasks can run at once: data.current = the main/latest task, data.others = extra tasks running together.
// Every task keeps its own start/end/duration, so overlapping tasks are each counted (and paid) in full.
function clockActiveList(data) { return [data && data.current].concat((data && data.others) || []).filter(Boolean); }
function clockSave(personId, sessions, onUpdate, cur, others, today) {
  const rec = { current: cur || null, others: (others && others.length) ? others : null, today: today };
  const updated = { ...(sessions||{}), [personId]: rec };
  try { if (window._clockApi) window._clockApi.sessions = updated; } catch(e){}
  if (onUpdate) onUpdate(updated);
  try { syncSet('sessions/' + todayKey() + '/' + personId, rec); } catch(e){}
}
function clockClose(a) { return { ...a, endTime: Date.now(), duration: Math.round(((Date.now() - a.startTime) / 60000)*10)/10 }; }
// opts.stack === true -> keep what is running and ALSO start this one. Otherwise: switch (closes the main task first).
function clockInActivity(personId, sessions, onUpdate, activityId, opts) {
  const data = (sessions||{})[personId] || { current: null, today: [] };
  let today = data.today || [];
  const act = activityId || 'service';
  const active = clockActiveList(data);
  if (active.some(a => a.activity === act)) return;
  const s = { activity: act, startTime: Date.now(), approvalStatus: 'approved' };
  if (opts && opts.label) s.label = opts.label;
  if (opts && opts.linked) s.linked = true;
  if (opts && opts.stack && active.length) { clockSave(personId, sessions, onUpdate, s, active, today); return; }
  if (data.current) today = [...today, clockClose(data.current)];
  clockSave(personId, sessions, onUpdate, s, (data.others || []), today);
}
// activityId given -> close just that task; omitted -> close the main task. The next running task becomes the main one.
function clockOutActivity(personId, sessions, onUpdate, activityId) {
  const data = (sessions||{})[personId] || { current: null, today: [] };
  const list = clockActiveList(data);
  const target = activityId ? list.find(a => a.activity === activityId) : data.current;
  if (!target) return;
  const rest = list.filter(a => a !== target);
  clockSave(personId, sessions, onUpdate, rest[0] || null, rest.slice(1), [...(data.today||[]), clockClose(target)]);
}
function clockOutAll(personId, sessions, onUpdate) {
  const data = (sessions||{})[personId] || { current: null, today: [] };
  const list = clockActiveList(data); if (!list.length) return;
  clockSave(personId, sessions, onUpdate, null, [], [...(data.today||[]), ...list.map(clockClose)]);
}

// Pay out an approved routine/daily check-off notification (credits points or cash once an admin says yes)
function approveRoutineNotif(notif) {
  try {
    var rc = notif && notif.routineCredit;
    if (rc && typeof window._creditFn === 'function') window._creditFn(rc.pid, rc.amount, rc.reason, rc.key, true);
  } catch (e) {}
}

// Award points for a completed SOP inspection notification (looked up by sopId in sop_library)
function approveSopInspectionNotif(notif) {
  try {
    const lib = syncGet('sop_library') || {};
    let sop = null;
    Object.values(lib).forEach(list => (list||[]).forEach(s => { if (s && s.id === notif.sopId) sop = s; }));
    const pts = (sop && sop.pts) || 15;
    if (typeof window._creditFn === 'function' && notif.personId) {
      window._creditFn(notif.personId, pts, 'SOP Complete: ' + (notif.sopTitle || (sop && sop.title) || 'SOP'), 'sop_' + notif.sopId + '_' + todayKey(), true);
    }
    return pts;
  } catch(e) { return 0; }
}

// ─── Song of the Day ─────────────────────────────────────────────────────────
function SongOfDay({
  position
}) {
  const [song] = useState(() => {
    const dayN = Math.floor(Date.now() / 86400000);
    return JW_SONGS[(dayN + (position === 'open' ? 0 : 7)) % JW_SONGS.length];
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(121,134,203,.15)',
      border: '1px solid rgba(121,134,203,.3)',
      borderRadius: 10,
      padding: '9px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20
    }
  }, "🎵"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#7986CB',
      letterSpacing: 1
    }
  }, position === 'open' ? 'OPENING SONG' : 'CLOSING SONG'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: '#fff'
    }
  }, "Song ", song.n, " — ", song.t), /*#__PURE__*/React.createElement("a", {
    href: "https://www.jw.org/en/library/music/",
    target: "_blank",
    style: {
      fontSize: 9,
      color: '#7986CB'
    }
  }, "Open JW.ORG Music →")));
}

// ─── Grade Badge ─────────────────────────────────────────────────────────────
const GRADE_COLORS = {
  A: '#4CAF82',
  B: '#C0CA33',
  C: '#FF9800',
  D: '#FF5722',
  F: '#EF5350'
};
const GRADE_LABELS = {
  A: 'Excellent',
  B: 'Good',
  C: 'Satisfactory',
  D: 'Needs Work',
  F: 'Redo Required'
};
function GradeBadge({
  grade,
  score
}) {
  if (!grade) return null;
  const c = GRADE_COLORS[grade] || '#888';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      background: `${c}20`,
      border: `1.5px solid ${c}`,
      borderRadius: 20,
      padding: '4px 10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: c
    }
  }, grade), score && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: c
    }
  }, score, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: c
    }
  }, GRADE_LABELS[grade] || ''));
}

// ─── Teacher Grading Panel ───────────────────────────────────────────────────
function GradingPanel({
  studentId,
  day,
  subject,
  hook,
  prog
}) {
  const [grade, setGrade] = useState(prog.grade || '');
  const [score, setScore] = useState(prog.score || '');
  const [feedback, setFeedback] = useState(prog.feedback || '');
  const grades = ['A', 'B', 'C', 'D', 'F'];
  function approve() {
    if (!grade) {
      alert('Please select a grade first.');
      return;
    }
    hook.gradeAssignment(studentId, day, subject.id, {
      grade,
      score: parseInt(score) || null,
      feedback,
      approved: true
    });
  }
  function requestRedo() {
    if (!grade) {
      alert('Please select a grade first.');
      return;
    }
    hook.gradeAssignment(studentId, day, subject.id, {
      grade,
      score: parseInt(score) || null,
      feedback,
      approved: false
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.4)',
      border: '1px solid rgba(192,202,51,.3)',
      borderRadius: 10,
      padding: 12,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      letterSpacing: 1,
      marginBottom: 10
    }
  }, "📋 TEACHER REVIEW — ", subject.l), (prog.attempts || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555',
      marginBottom: 3
    }
  }, "TIME LOG"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      flexWrap: 'wrap'
    }
  }, (prog.attempts || []).map((a, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontSize: 9,
      padding: '3px 7px',
      borderRadius: 8,
      background: 'rgba(255,255,255,.06)',
      color: '#aaa'
    }
  }, a.label, ": ", a.mins.toFixed(0), "min")), (prog.attempts || []).length > 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      padding: '3px 7px',
      borderRadius: 8,
      background: 'rgba(76,175,80,.12)',
      color: '#4CAF82',
      fontWeight: 700
    }
  }, "Total: ", (prog.attempts || []).reduce((s, a) => s + a.mins, 0).toFixed(0), "min"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555',
      marginBottom: 4
    }
  }, "GRADE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, grades.map(g => /*#__PURE__*/React.createElement("button", {
    key: g,
    onClick: () => setGrade(g),
    style: {
      flex: 1,
      padding: '8px 4px',
      borderRadius: 10,
      fontWeight: 900,
      fontSize: 15,
      border: 'none',
      background: grade === g ? `${GRADE_COLORS[g]}33` : 'rgba(255,255,255,.06)',
      color: grade === g ? GRADE_COLORS[g] : '#555',
      outline: grade === g ? `2px solid ${GRADE_COLORS[g]}` : 'none'
    }
  }, g))), grade && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: GRADE_COLORS[grade],
      textAlign: 'center',
      marginTop: 4
    }
  }, GRADE_LABELS[grade])), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555',
      marginBottom: 3
    }
  }, "SCORE (optional)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: score,
    onChange: e => setScore(e.target.value),
    placeholder: "e.g. 92",
    inputMode: "numeric",
    pattern: "[0-9]*",
    min: "0",
    max: "100",
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 8,
      padding: '9px 12px',
      color: '#fff',
      fontSize: 15,
      fontWeight: 700
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555',
      marginBottom: 3
    }
  }, "FEEDBACK TO STUDENT"), /*#__PURE__*/React.createElement("textarea", {
    value: feedback,
    onChange: e => setFeedback(e.target.value),
    placeholder: "Write specific, encouraging feedback... What was great? What needs improvement? What to focus on for the redo?",
    autoCorrect: "on",
    autoCapitalize: "sentences",
    spellCheck: true,
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.15)',
      borderRadius: 8,
      padding: '10px 12px',
      color: '#fff',
      fontSize: 13,
      minHeight: 80,
      resize: 'vertical',
      fontFamily: 'inherit',
      lineHeight: 1.6
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: approve,
    style: {
      flex: 1,
      background: '#4CAF82',
      color: '#000',
      padding: '10px',
      borderRadius: 25,
      fontSize: 12,
      fontWeight: 800,
      border: 'none'
    }
  }, "✅ Job Well Done!"), /*#__PURE__*/React.createElement("button", {
    onClick: requestRedo,
    style: {
      flex: 1,
      background: 'rgba(255,152,0,.2)',
      border: '1px solid #FF9800',
      color: '#FF9800',
      padding: '10px',
      borderRadius: 25,
      fontSize: 12,
      fontWeight: 700
    }
  }, "⟳ Needs Redo")));
}

// ─── Student Feedback View ───────────────────────────────────────────────────
function StudentFeedbackView({
  prog,
  subject,
  onStartRedo
}) {
  if (!prog.grade) return null;
  const c = GRADE_COLORS[prog.grade] || '#888';
  const approved = prog.teacherApproved || prog.status === 'approved';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${c}12`,
      border: `1.5px solid ${c}44`,
      borderRadius: 10,
      padding: 10,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(GradeBadge, {
    grade: prog.grade,
    score: prog.score
  }), approved && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#4CAF82',
      fontWeight: 700
    }
  }, "✅ Teacher Approved!"), !approved && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#FF9800',
      fontWeight: 700
    }
  }, "⟳ Redo Required")), prog.feedback && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.25)',
      borderRadius: 8,
      padding: '8px 10px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555',
      marginBottom: 3
    }
  }, "TEACHER FEEDBACK"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#ddd',
      lineHeight: 1.7,
      fontStyle: 'italic'
    }
  }, "\"", prog.feedback, "\"")), !approved && /*#__PURE__*/React.createElement("button", {
    onClick: onStartRedo,
    style: {
      width: '100%',
      background: 'rgba(255,152,0,.15)',
      border: '1px solid #FF9800',
      color: '#FF9800',
      padding: '9px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700
    }
  }, "▶ Start Redo"));
}

// ─── Subject Card (child view with timer + submission + grading) ──────────────
function SubjectCard({
  subject,
  studentId,
  day,
  hook,
  sessions,
  onUpdate,
  showTeacher,
  bibleDayLesson,
  isMykah
}) {
  const {
    saveProgress,
    getProgress,
    resetProgress
  } = hook;
  const prog = getProgress(studentId, day, subject.id);
  const [startTime, setStartTime] = useState(null);
  const expectedMin = subject.id === 'lang' && isMykah ? 45 : SUBJECT_TIMES[subject.id] || 30;
  const isActive = !!startTime;
  const status = prog.status || 'not_started';
  const isApproved = prog.teacherApproved || status === 'approved';
  const isSubmitted = status === 'submitted';
  const needsRedo = status === 'needs_redo';
  const hasGrade = !!prog.grade;
  function start() {
    const now = Date.now();
    setStartTime(now);
    schoolClockIn(studentId, sessions, onUpdate);
  }
  function finish() {
    const mins = startTime ? (Date.now() - startTime) / 60000 : 0;
    const rounded = Math.round(mins * 10) / 10;
    saveProgress(studentId, day, subject.id, true, rounded);
    schoolClockOut(studentId, sessions, onUpdate, rounded);
    setStartTime(null);
    playSound('clockOut');
  }
  function startRedo() {
    resetProgress(studentId, day, subject.id, 'Student redo started');
    setStartTime(null);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${subject.c}10`,
      border: `1.5px solid ${isApproved ? subject.c : isSubmitted ? 'rgba(121,134,203,.5)' : isActive ? subject.c + '66' : needsRedo ? 'rgba(255,152,0,.5)' : 'rgba(255,255,255,.07)'}`,
      borderLeft: `4px solid ${isApproved ? subject.c : isSubmitted ? '#7986CB' : isActive ? subject.c : needsRedo ? '#FF9800' : 'rgba(255,255,255,.1)'}`,
      borderRadius: 12,
      padding: '10px 12px',
      marginBottom: 8,
      transition: 'border .2s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#fff'
    }
  }, subject.l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555',
      marginTop: 1
    }
  }, "Day ", day, " · ", getLessonForDay(subject.id, day, isMykah ? 4 : studentId === 'ashelyn' ? 8 : 12)?.unit || 'Unit Overview'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555',
      marginTop: 1
    }
  }, "⏱ ~", expectedMin, " min", prog.actualMins > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 5,
      fontWeight: 700,
      color: prog.actualMins <= expectedMin * 1.5 ? '#4CAF82' : '#FF9800'
    }
  }, "· ", prog.actualMins.toFixed(0), " min total")), (prog.attempts || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 3,
      flexWrap: 'wrap',
      marginTop: 3
    }
  }, (prog.attempts || []).map((a, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontSize: 7,
      padding: '2px 5px',
      borderRadius: 6,
      background: i === 0 ? 'rgba(255,255,255,.06)' : 'rgba(255,152,0,.15)',
      color: i === 0 ? '#555' : '#FF9800'
    }
  }, a.label, ": ", a.mins.toFixed(0), "m")))), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, isApproved && /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${subject.c}22`,
      border: `1px solid ${subject.c}`,
      borderRadius: 20,
      padding: '5px 10px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18
    }
  }, "✅"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: subject.c,
      fontWeight: 700
    }
  }, "Approved")), isSubmitted && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(121,134,203,.15)',
      border: '1px solid #7986CB',
      borderRadius: 20,
      padding: '5px 10px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14
    }
  }, "⏳"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#7986CB',
      fontWeight: 700
    }
  }, "Reviewing")), needsRedo && !isActive && /*#__PURE__*/React.createElement("button", {
    onClick: start,
    style: {
      background: 'rgba(255,152,0,.2)',
      border: '1px solid #FF9800',
      color: '#FF9800',
      borderRadius: 20,
      padding: '8px 12px',
      fontSize: 11,
      fontWeight: 800
    }
  }, "⟳ Redo"), !isApproved && !isSubmitted && !needsRedo && (isActive ? /*#__PURE__*/React.createElement("button", {
    onClick: finish,
    style: {
      background: '#4CAF82',
      color: '#000',
      border: 'none',
      borderRadius: 20,
      padding: '8px 12px',
      fontSize: 11,
      fontWeight: 800
    }
  }, "✅ Submit") : /*#__PURE__*/React.createElement("button", {
    onClick: start,
    style: {
      background: subject.c,
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      padding: '8px 12px',
      fontSize: 11,
      fontWeight: 800
    }
  }, "▶ Start")))), isActive && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.3)',
      borderRadius: 8,
      padding: '7px 10px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: subject.c,
      animation: 'pulse 1s infinite',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: subject.c,
      fontWeight: 700
    }
  }, "Working —"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: '#fff',
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement(LiveTimer, {
    startTime: startTime
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555',
      marginLeft: 'auto'
    }
  }, "Target: ", expectedMin, "min")), hasGrade && !showTeacher && /*#__PURE__*/React.createElement(StudentFeedbackView, {
    prog: prog,
    subject: subject,
    onStartRedo: startRedo
  }), showTeacher && isSubmitted && /*#__PURE__*/React.createElement(GradingPanel, {
    studentId: studentId,
    day: day,
    subject: subject,
    hook: hook,
    prog: prog
  }), showTeacher && hasGrade && !isSubmitted && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.2)',
      borderRadius: 8,
      padding: '7px 10px',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(GradeBadge, {
    grade: prog.grade,
    score: prog.score
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: isApproved ? '#4CAF82' : '#FF9800',
      flex: 1
    }
  }, isApproved ? '✅ Approved' : '⟳ Awaiting redo'), /*#__PURE__*/React.createElement("button", {
    onClick: () => hook.gradeAssignment(studentId, day, subject.id, {
      grade: prog.grade,
      score: prog.score,
      feedback: prog.feedback,
      approved: !prog.teacherApproved
    }),
    style: {
      fontSize: 9,
      color: '#7986CB',
      background: 'rgba(121,134,203,.1)',
      border: '1px solid rgba(121,134,203,.3)',
      borderRadius: 20,
      padding: '3px 9px'
    }
  }, isApproved ? 'Revoke' : 'Approve Now')), prog.feedback && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#444',
      marginTop: 4,
      fontStyle: 'italic'
    }
  }, "\"", prog.feedback.slice(0, 80), prog.feedback.length > 80 ? '...' : '', "\"")), showTeacher && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      alignItems: 'center',
      marginTop: 6,
      padding: '4px 6px',
      background: 'rgba(0,0,0,.2)',
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 8,
      color: '#333',
      flex: 1
    }
  }, "Admin"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window._safeConfirm(`Reset ${subject.l} for redo? Time history kept.`)) {
        resetProgress(studentId, day, subject.id, 'Admin reset — redo required');
        setStartTime(null);
      }
    },
    style: {
      background: 'rgba(255,152,0,.1)',
      border: '1px solid rgba(255,152,0,.3)',
      color: '#FF9800',
      padding: '3px 8px',
      borderRadius: 20,
      fontSize: 8,
      fontWeight: 700
    }
  }, "⟳ Reset"), (prog.attempts || []).length > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window._safeConfirm('Clear ALL history for this subject?')) {
        syncSet('school/progress/' + `${studentId}_d${day}_${subject.id}`, {
          done: false,
          actualMins: 0,
          attempts: [],
          status: 'not_started',
          ts: Date.now()
        });
        setStartTime(null);
      }
    },
    style: {
      background: 'rgba(239,83,80,.1)',
      border: '1px solid rgba(239,83,80,.3)',
      color: '#EF5350',
      padding: '3px 7px',
      borderRadius: 20,
      fontSize: 8
    }
  }, "✕ Clear")), !isApproved && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(SubjectLessonContent, {
    subjectId: subject.id,
    day: day,
    grade: isMykah ? 4 : studentId === 'ashelyn' ? 8 : 12, // Kayla=Level4=grade12, Ryan=12
    showTeacher: showTeacher
  }), subject.id === 'science' && typeof MealScienceModule !== 'undefined' && /*#__PURE__*/React.createElement(MealScienceModule, {
    studentId: studentId,
    grade: isMykah ? 4 : studentId === 'ashelyn' ? 8 : 12,
    day: day,
    isTeacher: showTeacher
  }), /*#__PURE__*/React.createElement(DKALessonCard, {
    subject: subject,
    day: day,
    grade: isMykah ? 4 : studentId === 'ashelyn' ? 8 : 12,
    lesson: getLessonForDay(subject.id, day, isMykah ? 4 : studentId === 'ashelyn' ? 8 : 12),
    showTeacher: showTeacher,
    isArtDay: isArtDay(day),
    artProject: getArtProject(day),
    studentId: studentId
  })));
}

// ─── Daily School Day View ────────────────────────────────────────────────────
function DailySchoolDay({
  day,
  student,
  hook,
  sessions,
  onUpdate,
  showTeacher
}) {
  const studentId = student?.id || '';
  const isMykah2 = studentId === 'mykah';
  const bibleDayLesson = BIBLE_UNITS.flatMap(u => u.lessons || []).find(l => l.d === day);
  const isMykah = student.id === 'mykah';
  const totalDone = SUBJECTS.filter(s => hook.getProgress(student.id, day, s.id).done).length;
  const totalSubjects = SUBJECTS.length;
  const allDone = totalDone === totalSubjects;
  const totalMinToday = SUBJECTS.reduce((s, sub) => {
    const p = hook.getProgress(student.id, day, sub.id);
    return s + (p.done && p.actualMins ? p.actualMins : 0);
  }, 0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SongOfDay, {
    position: "open"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#7986CB',
      fontStyle: 'italic',
      textAlign: 'center',
      margin: '8px 0'
    }
  }, "🙏 Open with prayer before starting"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,.05)',
      borderRadius: 10,
      padding: '8px 12px',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#fff'
    }
  }, "Day ", day, " — ", student.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: allDone ? '#4CAF82' : '#7986CB'
    }
  }, totalDone, "/", totalSubjects, " subjects ", allDone ? '🎉' : '')), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: 'rgba(255,255,255,.07)',
      borderRadius: 3,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${totalDone / totalSubjects * 100}%`,
      background: allDone ? '#4CAF82' : '#7986CB',
      borderRadius: 3,
      transition: 'width .4s'
    }
  })), totalMinToday > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#b8b8c8',
      marginTop: 4
    }
  }, "⏱ Total time today: ", fmtDur(totalMinToday))), typeof FieldServiceBanner !== 'undefined' && /*#__PURE__*/React.createElement(FieldServiceBanner, {
    day: day
  }), typeof SchoolDaySchedule !== 'undefined' && /*#__PURE__*/React.createElement(SchoolDaySchedule, {
    day: day,
    student: student
  }), isMykah && /*#__PURE__*/React.createElement(MykahReadingBoost, {
    day: day
  }), SUBJECTS.map(subject => /*#__PURE__*/React.createElement(SubjectCard, {
    key: subject.id,
    subject: subject,
    studentId: student.id,
    day: day,
    hook: hook,
    sessions: sessions,
    onUpdate: onUpdate,
    showTeacher: showTeacher,
    bibleDayLesson: bibleDayLesson,
    isMykah: isMykah
  })), showTeacher && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#b8b8c8',
      marginBottom: 4
    }
  }, "TEACHER NOTES"), /*#__PURE__*/React.createElement("textarea", {
    value: hook.getNote(student.id, day),
    onChange: e => hook.saveNote(student.id, day, e.target.value),
    placeholder: "Add observations, student progress notes, adjustments for tomorrow...",
    style: {
      width: '100%',
      background: 'rgba(255,255,255,.07)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 8,
      padding: '9px 11px',
      color: '#fff',
      fontSize: 13,
      minHeight: 70,
      resize: 'vertical'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(SongOfDay, {
    position: "close"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#7986CB',
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: 6
    }
  }, "🙏 Close with prayer of thanks for today's learning")));
}

// ─── Progress Overview ────────────────────────────────────────────────────────
function SchoolProgress({
  hook,
  showTeacher
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Student Progress — 180-Day Year"), SCHOOL_STUDENTS.map(s => {
    const completed = SUBJECTS.reduce((tot, sub) => {
      let days = 0;
      for (let d = 1; d <= 180; d++) {
        if (hook.getProgress(s.id, d, sub.id).done) days++;
      }
      return tot + days;
    }, 0);
    const pct = Math.round(completed / (180 * SUBJECTS.length) * 100);
    // Today's time
    const todayTotal = SUBJECTS.reduce((t, sub) => {
      const p = hook.getProgress(s.id, parseInt(new Date().toLocaleDateString('en-CA').replace(/-/g, '').slice(-3)) || 1, sub.id);
      return t + (p.done && p.actualMins ? p.actualMins : 0);
    }, 0);
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      className: "card",
      style: {
        marginBottom: 8,
        borderColor: `${s.color}33`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: s.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16
      }
    }, s.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: '#fff'
      }
    }, s.name, " · Grade ", s.grade), s.readTarget && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#4CAF82'
      }
    }, "Reading boost: 2nd→", s.readTarget, "th grade")), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: s.color
      }
    }, pct, "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#444'
      }
    }, "complete"))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 5,
        background: 'rgba(255,255,255,.07)',
        borderRadius: 3,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        width: `${pct}%`,
        background: s.color,
        borderRadius: 3
      }
    })));
  }));
}

// ─── Mykah Reading Boost ─────────────────────────────────────────────────────
function MykahReadingBoost({
  day
}) {
  const phases = [{
    r: [1, 40],
    l: 'Phase 1: Phonics & Fluency',
    c: '#EF5350',
    daily: ['5 min phonics drill: prefixes/suffixes', '10 min fluency reading (aloud, timed)', '5 min sight words', '5 min comprehension Qs']
  }, {
    r: [41, 90],
    l: 'Phase 2: Vocabulary Expansion',
    c: '#FF9800',
    daily: ['3 new words — define, draw, use in sentence', '10 min chapter book (3rd grade)', '5 min spelling', '5 min verbal summary']
  }, {
    r: [91, 135],
    l: 'Phase 3: Comprehension',
    c: '#C0CA33',
    daily: ['15 min reading (4th grade)', '5 min written response', '5 min vocab review', 'Summarize in 3 sentences']
  }, {
    r: [136, 180],
    l: 'Phase 4: 5th Grade Ready',
    c: '#4CAF82',
    daily: ['20 min reading (5th grade)', '10 min written analysis', 'Note-taking from nonfiction', 'Vocabulary in context']
  }];
  const phase = phases.find(p => day >= p.r[0] && day <= p.r[1]) || phases[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${phase.c}14`,
      border: `1px solid ${phase.c}44`,
      borderRadius: 12,
      padding: '10px 12px',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: phase.c,
      marginBottom: 5
    }
  }, "🚀 Reading Boost — ", phase.l), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      flexWrap: 'wrap'
    }
  }, phase.daily.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 9,
      color: '#aaa',
      background: 'rgba(0,0,0,.2)',
      borderRadius: 6,
      padding: '3px 7px'
    }
  }, "• ", t))));
}

// ─── JW.org Hyperlink Helper ─────────────────────────────────────────────────
function JWLink({
  type,
  id,
  label,
  children
}) {
  const urls = {
    song: n => `https://www.jw.org/en/library/books/sing-out-joyfully-to-jehovah/song-${n}/`,
    watchtower: 'https://www.jw.org/en/library/magazines/watchtower/',
    workbook: 'https://www.jw.org/en/library/jw-meeting-workbook/',
    bookstudy: 'https://www.jw.org/en/library/books/',
    bible: 'https://www.jw.org/en/library/bible/',
    ministry: 'https://www.jw.org/en/library/jw-meeting-workbook/',
    research: 'https://www.jw.org/en/research-tools/',
    home: 'https://www.jw.org/'
  };
  const href = type === 'song' ? urls.song(id) : urls[type] || urls.home;
  return React.createElement('a', {
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
    style: {
      color: '#7986CB',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: 'inherit'
    },
    title: `Open on JW.org`
  }, children || label || href);
}
function SongLink({
  num,
  title
}) {
  const songTitle = title || (JW_SONGS.find(s => s.n === num) || {}).t || `Song ${num}`;
  return React.createElement(JWLink, {
    type: 'song',
    id: num
  }, `Song ${num} — ${songTitle} 🔗`);
}

// Parse text and auto-link "Song XX" patterns and JW.org references
function ParsedText({
  text
}) {
  if (!text) return null;
  const parts = [];
  let remaining = text;
  const songRx = /Song\s+(\d+)(?:\s+[—–-]\s+([^,.;]+))?/gi;
  let lastIdx = 0;
  let match;
  const str = String(text);
  songRx.lastIndex = 0;
  while ((match = songRx.exec(str)) !== null) {
    if (match.index > lastIdx) parts.push(str.slice(lastIdx, match.index));
    const num = parseInt(match[1]);
    const songTitle = (JW_SONGS.find(s => s.n === num) || {}).t || match[2] || ``;
    parts.push(React.createElement(SongLink, {
      key: `song-${match.index}`,
      num,
      title: songTitle
    }));
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < str.length) parts.push(str.slice(lastIdx));
  return React.createElement('span', null, ...parts);
}

// ─── TeacherPrepPanel — Bible Units with checkbox + full expandable detail ────
function TeacherPrepPanel({
  hook
}) {
  const {
    toggleUnitCheck,
    unitChecks
  } = hook;
  const [openUnit, setOpenUnit] = useState(null);
  const [unitPage, setUnitPage] = useState(0);
  const UNITS_PER_PAGE = 5;
  const allUnits = [...BIBLE_UNITS, ...BIBLE_UNITS_COMPACT];
  const totalPages = Math.ceil(allUnits.length / UNITS_PER_PAGE);
  const pageUnits = allUnits.slice(unitPage * UNITS_PER_PAGE, (unitPage + 1) * UNITS_PER_PAGE);
  const totalChecked = allUnits.filter(u => unitChecks[u.unit]).length;
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
      marginBottom: 2
    }
  }, "📋 Teacher Prep — Bible Units"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555'
    }
  }, "Check each unit after you've studied it. Tap to expand full lesson detail. Opening units here does NOT affect student day timers.")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: '#7986CB'
    }
  }, totalChecked, "/", allUnits.length), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555'
    }
  }, "studied"))), /*#__PURE__*/React.createElement("div", {
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
      width: `${totalChecked / allUnits.length * 100}%`,
      background: '#7986CB',
      borderRadius: 3,
      transition: 'width .3s'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setUnitPage(Math.max(0, unitPage - 1));
      setOpenUnit(null);
    },
    disabled: unitPage === 0,
    style: {
      padding: '5px 12px',
      borderRadius: 20,
      border: 'none',
      fontSize: 11,
      fontWeight: 800,
      background: unitPage === 0 ? 'rgba(255,255,255,.04)' : 'rgba(121,134,203,.2)',
      color: unitPage === 0 ? '#333' : '#7986CB'
    }
  }, "‹ Prev"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: '#7986CB'
    }
  }, "Units ", unitPage * UNITS_PER_PAGE + 1, "–", Math.min((unitPage + 1) * UNITS_PER_PAGE, allUnits.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555'
    }
  }, "Page ", unitPage + 1, " of ", totalPages, " · Study max 5 units at a time")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setUnitPage(Math.min(totalPages - 1, unitPage + 1));
      setOpenUnit(null);
    },
    disabled: unitPage === totalPages - 1,
    style: {
      padding: '5px 12px',
      borderRadius: 20,
      border: 'none',
      fontSize: 11,
      fontWeight: 800,
      background: unitPage === totalPages - 1 ? 'rgba(255,255,255,.04)' : 'rgba(121,134,203,.2)',
      color: unitPage === totalPages - 1 ? '#333' : '#7986CB'
    }
  }, "Next ›")), pageUnits.map(u => {
    const checked = !!unitChecks[u.unit];
    const isOpen = openUnit === u.unit;
    const lessons = u.lessons || [];
    const range = lessons.length ? `Days ${lessons[0].d}–${lessons[lessons.length - 1].d}` : u.range ? `Days ${u.range}` : '';
    return /*#__PURE__*/React.createElement("div", {
      key: u.unit,
      style: {
        marginBottom: 8,
        background: checked ? 'rgba(121,134,203,.06)' : 'rgba(255,255,255,.02)',
        border: `1.5px solid ${checked ? 'rgba(121,134,203,.5)' : 'rgba(255,255,255,.07)'}`,
        borderRadius: 12,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: '10px 12px',
        cursor: 'pointer'
      },
      onClick: () => setOpenUnit(isOpen ? null : u.unit)
    }, /*#__PURE__*/React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        toggleUnitCheck(u.unit);
      },
      style: {
        width: 22,
        height: 22,
        borderRadius: 6,
        flexShrink: 0,
        border: `2px solid ${checked ? '#7986CB' : 'rgba(255,255,255,.2)'}`,
        background: checked ? '#7986CB' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, checked && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: '#fff'
      }
    }, "✓")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        flexShrink: 0,
        background: checked ? '#7986CB' : 'rgba(121,134,203,.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 800,
        color: checked ? '#fff' : '#7986CB'
      }
    }, u.unit), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: checked ? '#fff' : '#ccc'
      }
    }, u.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#555'
      }
    }, range, " · ~45 min prep"), u.keyVerses && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap',
        marginTop: 2
      }
    }, u.keyVerses.map(v => /*#__PURE__*/React.createElement("span", {
      key: v,
      style: {
        fontSize: 7,
        padding: '1px 5px',
        borderRadius: 6,
        background: 'rgba(121,134,203,.15)',
        color: '#7986CB'
      }
    }, v)))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: '#444',
        flexShrink: 0
      }
    }, isOpen ? '▾' : '▸')), isOpen && /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid rgba(255,255,255,.06)',
        padding: '10px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(192,202,51,.06)',
        border: '1px solid rgba(192,202,51,.2)',
        borderRadius: 8,
        padding: '8px 10px',
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#C0CA33',
        marginBottom: 4
      }
    }, "⏱ 45-MIN TEACHER PREPARATION GUIDE"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 4
      }
    }, [['0–10 min', 'Read all lesson focuses for this unit'], ['10–20 min', 'Study answer keys (short + long) for each day'], ['20–30 min', 'Look up all key scriptures in JW Library'], ['30–38 min', 'Review teacher scripts aloud'], ['38–45 min', 'Note questions students may ask + prepare answers']].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        fontSize: 9,
        color: '#aaa',
        background: 'rgba(0,0,0,.2)',
        borderRadius: 6,
        padding: '4px 7px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: '#C0CA33',
        fontWeight: 700
      }
    }, t), d)))), lessons.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#7986CB',
        letterSpacing: 1,
        marginBottom: 5
      }
    }, "UNIT LESSONS"), lessons.map(l => /*#__PURE__*/React.createElement("div", {
      key: l.d,
      style: {
        marginBottom: 8,
        background: 'rgba(0,0,0,.2)',
        borderRadius: 8,
        padding: '8px 10px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: '#fff',
        marginBottom: 3
      }
    }, "Day ", l.d, ": ", l.focus), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#7986CB',
        marginBottom: 3
      }
    }, "🔑 ", l.verse || ''), l.discuss && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#555',
        marginBottom: 2
      }
    }, "DISCUSSION QUESTIONS"), l.discuss.map((q, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 9,
        color: '#aaa',
        marginBottom: 1
      }
    }, "• ", q))), l.script && /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(0,0,0,.3)',
        borderRadius: 6,
        padding: '6px 8px',
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#C0CA33',
        marginBottom: 2
      }
    }, "TEACHER SCRIPT"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#ccc',
        lineHeight: 1.7
      }
    }, l.script)), l.activity && /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(76,175,130,.05)',
        borderRadius: 6,
        padding: '5px 7px',
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#4CAF82',
        marginBottom: 1
      }
    }, "ACTIVITY"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#aaa'
      }
    }, l.activity)), l.answers && /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(239,83,80,.06)',
        borderRadius: 6,
        padding: '6px 8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#EF5350',
        marginBottom: 3
      }
    }, "🔑 ANSWER KEY"), typeof l.answers === 'object' && !l.answers.short && Object.entries(l.answers).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#EF5350',
        fontWeight: 700
      }
    }, k), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#aaa',
        lineHeight: 1.6
      }
    }, Array.isArray(v) ? v.map((x, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 1
      }
    }, "• ", x)) : typeof v === 'object' ? Object.entries(v).map(([kk, vv]) => /*#__PURE__*/React.createElement("div", {
      key: kk
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#ccc'
      }
    }, kk, ":"), " ", vv)) : v))), l.answers.short && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#FF9800',
        fontWeight: 700,
        marginBottom: 1
      }
    }, "SHORT ANSWER"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#ccc',
        lineHeight: 1.6
      }
    }, l.answers.short)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#EF5350',
        fontWeight: 700,
        marginBottom: 1
      }
    }, "LONG ANSWER"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#aaa',
        lineHeight: 1.7
      }
    }, l.answers.long))))))), lessons.length === 0 && u.topics && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#7986CB',
        letterSpacing: 1,
        marginBottom: 5
      }
    }, "UNIT TOPICS"), u.topics.map((t, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 9,
        color: '#aaa',
        marginBottom: 3,
        background: 'rgba(0,0,0,.2)',
        borderRadius: 6,
        padding: '4px 8px'
      }
    }, "Day ", (u.lessons ? u.lessons[0].d : parseInt(u.range)) + i, ": ", t))), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        toggleUnitCheck(u.unit);
      },
      style: {
        width: '100%',
        marginTop: 8,
        padding: '9px',
        borderRadius: 20,
        border: 'none',
        fontWeight: 800,
        fontSize: 11,
        background: checked ? 'rgba(239,83,80,.15)' : '#7986CB',
        color: checked ? '#EF5350' : '#fff'
      }
    }, checked ? '✕ Mark as Not Yet Studied' : '✅ Mark Unit as Studied')));
  }));
}

// ─── OnlineSchoolPanel — Penn Foster / Khan Academy + Timer ─────────────────
function OnlineSchoolPanel({
  initialStudent,
  day,
  allStudents
}) {
  const [selectedId, setSelectedId] = useState(initialStudent?.id || 'ryan');
  const student = allStudents?.find(s => s.id === selectedId) || initialStudent || {
    id: 'ryan',
    name: 'Ryan',
    color: '#039BE5',
    emoji: '👦'
  };
  const ONLINE = {
    ryan: {
      label: 'Penn Foster',
      color: '#039BE5',
      emoji: '📘',
      hours: 2,
      desc: 'Ryan completes 2 hours of Penn Foster coursework daily as part of his accredited high school program.',
      courses: ['English Composition', 'U.S. History', 'College Prep Math', 'Elective: Business Fundamentals'],
      tip: 'Log into Penn Foster portal. Complete 1–2 lessons per subject. Screenshot completion certificates for records.'
    },
    kayla: {
      label: 'Penn Foster',
      color: '#F48FB1',
      emoji: '📗',
      hours: 2,
      desc: 'Kayla completes 2 hours of Penn Foster coursework daily as part of her accredited high school program.',
      courses: ['Language Arts', 'World History', 'Algebra II', 'Elective: Introduction to Business'],
      tip: 'Log into Penn Foster portal. Work through lessons sequentially. Save completion summaries to Google Drive.'
    },
    ashelyn: {
      label: 'Khan Academy',
      color: '#9E69AF',
      emoji: '📙',
      hours: 2,
      desc: 'Ashelyn completes 2 hours of Khan Academy coursework daily, covering her Grade 8 subjects.',
      courses: ['8th Grade Math (Pre-Algebra)', '8th Grade Language Arts', 'World History: 500–1500 CE', 'Biology'],
      tip: 'Open Khan Academy. Work assigned missions until the 2-hour mark. Khan tracks progress automatically — check mastery points weekly.'
    },
    mykah: {
      label: 'Khan Academy',
      color: '#4CAF82',
      emoji: '📒',
      hours: 1,
      desc: 'Mykah completes 1 hour of Khan Academy each day, focused on his reading boost targets and Grade 4 math.',
      courses: ['3rd–5th Grade Reading (adaptive)', '4th Grade Math', 'Early Grammar'],
      tip: 'Open Khan Academy Kids or Khan Academy. Select the assigned mission. Parent checks completion screen.'
    }
  };
  const info = ONLINE[student.id] || ONLINE.mykah;
  const targetMins = (info.hours || 2) * 60;
  const storageKey = `online_complete_${student.id}_d${day}`;
  const sessionKey = `online_session_${student.id}_d${day}`;
  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || 'false');
    } catch {
      return false;
    }
  });
  const [timerStart, setTimerStart] = useState(() => {
    try {
      const v = localStorage.getItem(sessionKey);
      return v ? parseInt(v) : null;
    } catch {
      return null;
    }
  });
  const [savedMins, setSavedMins] = useState(() => {
    try {
      return parseFloat(localStorage.getItem(storageKey + '_mins') || '0');
    } catch {
      return 0;
    }
  });
  const [now, setNow] = useState(Date.now());
  const [prevStudent, setPrevStudent] = useState(student.id);

  // Reset timer display when switching students
  if (student.id !== prevStudent) {
    setPrevStudent(student.id);
    const sk = `online_complete_${student.id}_d${day}`;
    const d2 = JSON.parse(localStorage.getItem(sk) || 'false');
    setDone(d2);
    const ss = localStorage.getItem(`online_session_${student.id}_d${day}`);
    setTimerStart(ss ? parseInt(ss) : null);
    setSavedMins(parseFloat(localStorage.getItem(sk + '_mins') || '0'));
  }
  React.useEffect(() => {
    if (!timerStart) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [timerStart]);
  const elapsedMins = timerStart ? savedMins + (now - timerStart) / 60000 : savedMins;
  const elapsedPct = Math.min(100, elapsedMins / targetMins * 100);
  const fmtTime = m => {
    const mins = Math.floor(m);
    const secs = Math.floor((m - mins) * 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };
  function startTimer() {
    const ts = Date.now();
    setTimerStart(ts);
    localStorage.setItem(sessionKey, String(ts));
    setNow(ts);
  }
  function pauseTimer() {
    const elapsed = timerStart ? savedMins + (Date.now() - timerStart) / 60000 : savedMins;
    setSavedMins(elapsed);
    localStorage.setItem(storageKey + '_mins', String(elapsed));
    setTimerStart(null);
    localStorage.removeItem(sessionKey);
  }
  function toggleDone() {
    if (timerStart) pauseTimer();
    const next = !done;
    setDone(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl",
    style: {
      marginBottom: 8
    }
  }, "🎓 Online School"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      overflowX: 'auto',
      marginBottom: 10
    }
  }, (allStudents || SCHOOL_STUDENTS).map(s => {
    const si = ONLINE[s.id] || ONLINE.mykah;
    const sk2 = `online_complete_${s.id}_d${day}`;
    const isD2 = JSON.parse(localStorage.getItem(sk2) || 'false');
    return /*#__PURE__*/React.createElement("button", {
      key: s.id,
      onClick: () => setSelectedId(s.id),
      style: {
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 10px',
        borderRadius: 20,
        background: selectedId === s.id ? s.color : 'rgba(255,255,255,.07)',
        border: `1px solid ${selectedId === s.id ? s.color : 'rgba(255,255,255,.08)'}`,
        color: selectedId === s.id ? '#fff' : '#666'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13
      }
    }, si.emoji), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 700
      }
    }, s.name), isD2 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10
      }
    }, "✅"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${info.color}10`,
      border: `2px solid ${timerStart ? info.color : done ? '#4CAF82' : info.color + '44'}`,
      borderRadius: 14,
      padding: '14px',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26
    }
  }, info.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      color: '#fff'
    }
  }, student.name, " · ", info.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: info.color
    }
  }, "Target: ", info.hours, " hours daily · Day ", day)), done && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(76,175,82,.2)',
      border: '1px solid #4CAF82',
      borderRadius: 20,
      padding: '5px 10px',
      fontSize: 11,
      fontWeight: 800,
      color: '#4CAF82'
    }
  }, "✅ Done!")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.3)',
      borderRadius: 10,
      padding: '10px 14px',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 900,
      color: timerStart ? info.color : '#fff',
      fontVariantNumeric: 'tabular-nums'
    }
  }, fmtTime(elapsedMins)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555'
    }
  }, "elapsed · target ", fmtTime(targetMins))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: 'rgba(255,255,255,.08)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${elapsedPct}%`,
      borderRadius: 4,
      transition: 'width .5s',
      background: elapsedPct >= 100 ? '#4CAF82' : timerStart ? info.color : 'rgba(255,255,255,.2)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: elapsedPct >= 100 ? '#4CAF82' : '#555'
    }
  }, elapsedPct >= 100 ? '✅ Target reached!' : Math.round(elapsedPct) + '% complete'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 8
    }
  }, !timerStart ? /*#__PURE__*/React.createElement("button", {
    onClick: startTimer,
    style: {
      flex: 1,
      background: info.color,
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      padding: '9px',
      fontSize: 11,
      fontWeight: 800
    }
  }, "▶ Start Session") : /*#__PURE__*/React.createElement("button", {
    onClick: pauseTimer,
    style: {
      flex: 1,
      background: 'rgba(255,255,255,.1)',
      color: '#FF9800',
      border: '1px solid #FF9800',
      borderRadius: 20,
      padding: '9px',
      fontSize: 11,
      fontWeight: 800
    }
  }, "⏸ Pause"), /*#__PURE__*/React.createElement("button", {
    onClick: toggleDone,
    style: {
      flex: 1,
      border: 'none',
      borderRadius: 20,
      padding: '9px',
      fontSize: 11,
      fontWeight: 800,
      background: done ? 'rgba(239,83,80,.15)' : 'rgba(76,175,82,.2)',
      color: done ? '#EF5350' : '#4CAF82'
    }
  }, done ? '↩ Undo' : '✅ Mark Done'))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: info.color,
      marginBottom: 4
    }
  }, "TODAY'S COURSES"), info.courses.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 9,
      color: '#ccc',
      marginBottom: 2,
      background: 'rgba(0,0,0,.2)',
      borderRadius: 6,
      padding: '4px 8px'
    }
  }, "📚 ", c))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(192,202,51,.06)',
      borderRadius: 8,
      padding: '6px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#C0CA33',
      marginBottom: 1
    }
  }, "💡 TIP"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa'
    }
  }, info.tip))));
}

// ─── MeetingStudyPanel — JW Weekly Meeting Schedule integrated into school ────
const MEETING_ITEMS = [{
  id: 'wb_treasures',
  l: '💎 Treasures from God\'s Word',
  mins: 10,
  cat: 'wb',
  desc: 'Read the assigned Bible passage for the week and study the "Treasures" portion of the Workbook. Note the main teaching point and 1-2 key scriptures.',
  hint: 'Open the week\'s lesson in JW Library → Meetings tab. Read the Bible text, then the Treasures points. Write the theme scripture from memory before checking.'
}, {
  id: 'wb_spiritual',
  l: '🌱 Apply Yourself to Ministry',
  mins: 15,
  cat: 'wb',
  desc: 'Study the ministry-based demonstrations and articles in the Workbook\'s second section. Be prepared to discuss or demonstrate the assigned part.',
  hint: "Read each part title and the corresponding scripture. If there's a demonstration, rehearse it aloud once. Note any new ministry skills highlighted."
}, {
  id: 'wb_living',
  l: '🏡 Living as Christians',
  mins: 20,
  cat: 'wb',
  desc: 'Study the third section of the Workbook including the Congregation Bible Study and any videos or articles assigned.',
  hint: 'Read the "Living as Christians" parts in order. For videos, watch them in JW Library. For the CBS portion, mark your answers before the meeting.'
}, {
  id: 'fw_discuss',
  l: '🏠 Family Worship — Discussion',
  mins: 30,
  cat: 'fw',
  desc: "Family Worship is a weekly household gathering to study together. Prepare a topic, Bible study, or JW publication discussion that meets the family's current spiritual needs.",
  hint: 'Choose from: current Watchtower article, Bible reading, a chapter from a JW book, or questions children have had. Aim for 30–60 minutes of engaged study.'
}, {
  id: 'fw_prayer',
  l: '🙏 Family Worship — Opening Prayer',
  mins: 5,
  cat: 'fw',
  desc: 'Prepare a prayer for family worship. It should thank Jehovah for the family, request spiritual guidance for the study, and set a reverent tone.',
  hint: "Write out a brief prayer outline: (1) Address Jehovah by name, (2) Thanksgiving for specific blessings this week, (3) Request understanding and application of what you'll study, (4) Close in Jesus's name."
}, {
  id: 'song_med',
  l: '🎵 Meditation on Kingdom Songs',
  mins: 10,
  cat: 'songs',
  desc: "Listen to and meditate on this week's assigned Kingdom songs from JW.ORG. Reflect on the lyrics and how they connect to Jehovah's qualities or your personal faith journey.",
  hint: "Open JW Library or JW.ORG Music section. Listen to the opening and closing song for this week's meeting. Read the lyrics. Journal 2–3 sentences on what the song means to you."
}, {
  id: 'bs_prep',
  l: '📖 Congregation Bible Study Prep',
  mins: 20,
  cat: 'bs',
  desc: 'The Congregation Bible Study (CBS) follows a rotating schedule of JW books. Read the assigned chapter or section, underline key points, and prepare your answers.',
  hint: 'Open the current CBS book in JW Library. Read the assigned pages slowly. Use the study questions in the margins. Write short answers. Mark any questions you want to raise.'
}, {
  id: 'personal_study',
  l: '📚 Personal Study',
  mins: 30,
  cat: 'personal',
  desc: "Personal study is each family member's individual time to grow spiritually. This could be Bible reading, a JW book, Watchtower or Awake articles, or JW.ORG videos.",
  hint: "Each person should have their own ongoing study project: a Bible book they're reading, a JW publication chapter by chapter, or a topic-based study using the Research Guide on JW.ORG."
}, {
  id: 'wt_audio',
  l: '🎧 Watchtower — Audio Study',
  mins: 25,
  cat: 'wt',
  desc: 'Listen to the upcoming Watchtower study article in audio format on JW Library. This helps familiarize you with the content before the group study.',
  hint: 'Open JW Library → Watchtower → current month → study article. Use the audio player. Follow along in the text while listening. Pause to mark good paragraphs.'
}, {
  id: 'wt_group',
  l: '📑 Watchtower Group Study Prep',
  mins: 20,
  cat: 'wt',
  desc: 'Prepare for the Watchtower group study by reading the article and marking your answers to the study questions printed at the bottom of each paragraph.',
  hint: 'Read each paragraph. The study question is at the bottom. Write your answer in the margin or in your notebook. Use the scriptures cited. Aim to answer at least 4–5 questions.'
}];
const MEETING_CATS = {
  wb: {
    l: '📒 Meeting Workbook Prep',
    c: '#7986CB'
  },
  fw: {
    l: '🏠 Family Worship Prep',
    c: '#F48FB1'
  },
  songs: {
    l: '🎵 Song Meditation',
    c: '#C0CA33'
  },
  bs: {
    l: '📖 Book Study',
    c: '#4CAF82'
  },
  personal: {
    l: '📚 Personal Study',
    c: '#FF9800'
  },
  wt: {
    l: '🗓 Watchtower Study',
    c: '#9E69AF'
  }
};
function MeetingStudyPanel({
  hook,
  day
}) {
  const {
    toggleMeetingItem,
    getMeetingWeek
  } = hook;
  const weekNum = Math.ceil(day / 5);
  const weekKey = `week_${weekNum}`;
  const weekItems = getMeetingWeek(weekKey);
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const totalMins = ACTIVE_ITEMS.reduce((s, i) => s + i.mins, 0);
  const completedMins = ACTIVE_ITEMS.filter(i => weekItems[i.id]).reduce((s, i) => s + i.mins, 0);
  const completedCount = ACTIVE_ITEMS.filter(i => weekItems[i.id]).length;

  // Group by category
  const cats = Object.keys(ACTIVE_CATS);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
    className: "lbl",
    style: {
      marginBottom: 1
    }
  }, "🏛 Meeting Study Schedule"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555'
    }
  }, "School Week ", weekNum, " · Day ", day, " · Resets each school week")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      color: '#9E69AF'
    }
  }, completedMins, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: '#555'
    }
  }, "/", totalMins, "min")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#555'
    }
  }, completedCount, "/", ACTIVE_ITEMS.length, " done"))), /*#__PURE__*/React.createElement("div", {
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
      width: `${completedMins / totalMins * 100}%`,
      background: '#9E69AF',
      borderRadius: 3,
      transition: 'width .3s'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,.2)',
      borderRadius: 8,
      padding: '8px 10px',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#C0CA33',
      marginBottom: 4
    }
  }, "ℹ HOW THIS WORKS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa',
      lineHeight: 1.7
    }
  }, "This panel tracks all your JW meeting-related preparation as part of the school curriculum. Each item has an estimated time. Check items off as you complete them throughout the week. These study habits are part of the spiritual education component of Discovering Kids Academy. Content is based on the weekly meeting schedule through JW Library.")), cats.map(catId => {
    const cat = ACTIVE_CATS[catId];
    const catItems = ACTIVE_ITEMS.filter(i => i.cat === catId);
    const catDone = catItems.filter(i => weekItems[i.id]).length;
    const isExpanded = expandedCat === catId;
    return /*#__PURE__*/React.createElement("div", {
      key: catId,
      style: {
        marginBottom: 8,
        border: `1.5px solid ${catDone === catItems.length ? cat.c : 'rgba(255,255,255,.07)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        background: catDone === catItems.length ? `${cat.c}08` : 'rgba(255,255,255,.02)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        cursor: 'pointer'
      },
      onClick: () => setExpandedCat(isExpanded ? null : catId)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: catDone === catItems.length ? cat.c : '#ccc'
      }
    }, cat.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: '#555'
      }
    }, catDone, "/", catItems.length, " complete · ", catItems.reduce((s, i) => s + i.mins, 0), " min total")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 3
      }
    }, catItems.map(i => /*#__PURE__*/React.createElement("div", {
      key: i.id,
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: weekItems[i.id] ? cat.c : 'rgba(255,255,255,.1)'
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: '#444'
      }
    }, isExpanded ? '▾' : '▸')), isExpanded && /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid rgba(255,255,255,.05)',
        padding: '8px 12px'
      }
    }, catItems.map(item => {
      const done = !!weekItems[item.id];
      const isItemOpen = expandedItem === item.id;
      return /*#__PURE__*/React.createElement("div", {
        key: item.id,
        style: {
          marginBottom: 6,
          background: done ? `${cat.c}12` : 'rgba(0,0,0,.2)',
          border: `1px solid ${done ? cat.c : 'rgba(255,255,255,.05)'}`,
          borderRadius: 10,
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '8px 10px'
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => toggleMeetingItem(weekKey, item.id),
        style: {
          width: 20,
          height: 20,
          borderRadius: 6,
          flexShrink: 0,
          border: `2px solid ${done ? cat.c : 'rgba(255,255,255,.2)'}`,
          background: done ? cat.c : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, done && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: '#fff'
        }
      }, "✓")), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          cursor: 'pointer'
        },
        onClick: () => setExpandedItem(isItemOpen ? null : item.id)
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          fontWeight: 700,
          color: done ? '#fff' : '#bbb'
        }
      }, item.l), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 8,
          color: '#555'
        }
      }, "~", item.mins, " min")), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: '#444',
          cursor: 'pointer'
        },
        onClick: () => setExpandedItem(isItemOpen ? null : item.id)
      }, isItemOpen ? '▾' : '▸')), isItemOpen && /*#__PURE__*/React.createElement("div", {
        style: {
          borderTop: '1px solid rgba(255,255,255,.05)',
          padding: '8px 10px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: '#ccc',
          lineHeight: 1.7,
          marginBottom: 6
        }
      }, item.desc), /*#__PURE__*/React.createElement("div", {
        style: {
          background: 'rgba(192,202,51,.06)',
          borderRadius: 7,
          padding: '6px 8px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 8,
          color: '#C0CA33',
          marginBottom: 2
        }
      }, "💡 HOW TO DO THIS"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: '#aaa',
          lineHeight: 1.7
        }
      }, item.hint)), /*#__PURE__*/React.createElement("button", {
        onClick: () => toggleMeetingItem(weekKey, item.id),
        style: {
          width: '100%',
          marginTop: 7,
          padding: '8px',
          borderRadius: 20,
          border: 'none',
          fontWeight: 800,
          fontSize: 10,
          background: done ? 'rgba(239,83,80,.15)' : 'rgba(255,255,255,.08)',
          color: done ? '#EF5350' : '#aaa'
        }
      }, done ? 'Mark Incomplete' : 'Mark Complete')));
    })));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      background: 'rgba(121,134,203,.06)',
      borderRadius: 8,
      padding: '8px 10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#7986CB',
      marginBottom: 3
    }
  }, "📅 MEETING SCHEDULE REMINDER"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#aaa',
      lineHeight: 1.7
    }
  }, ['Mid-week Meeting: Workbook Prep, Ministry Demo, CBS portion', 'Weekend Meeting: Watchtower Audio + Group Study Prep', 'Each week: Family Worship, Personal Study, Song Meditation', 'All of these are part of your spiritual curriculum through JW Library.'].map((t, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: {
      marginBottom: 2
    }
  }, "• ", t)))));
}

// ─── MAIN SCHOOL MODULE ───────────────────────────────────────────────────────
function HomeschoolModule({
  isTeacher = false,
  isAdmin = false,
  personId = '',
  sessions = {},
  onUpdate,
  effectiveId = ''
}) {
  const [tab, setTab] = useState(isAdmin ? 'script' : 'today');
  const [day, setDay] = useState(() => { try { const i = typeof getSchoolDayInfo === 'function' ? getSchoolDayInfo() : null; const n = i && i.dayNum ? i.dayNum : 1; return Math.max(1, Math.min(180, n)); } catch (e) { return 1; } });
  const todayDay = (() => { try { const i = typeof getSchoolDayInfo === 'function' ? getSchoolDayInfo() : null; return Math.max(1, Math.min(180, (i && i.dayNum) || 1)); } catch (e) { return 1; } })();
  const [teacherToggle, setTeacherToggle] = useState(false);
  const hook = typeof useSchool !== "undefined" ? useSchool() : {getProgress:()=>({}),progress:{}};
  const isLaurel = personId === 'laurel';
  const showTeacher = isTeacher || teacherToggle;

  // Determine which student to show by default
  const viewingStudent = SCHOOL_STUDENTS.find(s => s.id === effectiveId) || (isAdmin ? SCHOOL_STUDENTS[0] : SCHOOL_STUDENTS.find(s => s.id === personId));
  const [student, setStudent] = useState(viewingStudent || SCHOOL_STUDENTS[0]);
  const tabs = [...(isAdmin ? [{
    id: 'script',
    l: '🎬 Teacher Script'
  }] : []), {
    id: 'today',
    l: '📅 Today'
  }, {
    id: 'units',
    l: '📚 Units & Lessons'
  }, {
    id: 'progress',
    l: '📊 Progress'
  }, ...(isAdmin ? [{
    id: 'teacherprep',
    l: '📋 Teacher Prep'
  }, {
    id: 'pennfoster',
    l: '🎓 Online School'
  }, {
    id: 'meeting',
    l: '🏛 Meeting Study'
  }] : []), ...(student.id === 'mykah' || isAdmin ? [{
    id: 'reading',
    l: '🚀 Reading'
  }] : [])];
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
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: '#C0CA33',
      letterSpacing: 1.5,
      textTransform: 'uppercase'
    }
  }, "Discovering Kids Academy"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#b8b8c8'
    }
  }, "180-Day Faith-Integrated Curriculum"), /*#__PURE__*/React.createElement("div", {
    style: {display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}
  }, /*#__PURE__*/React.createElement("a", {
    href:'https://classroom.google.com',target:'_blank',rel:'noopener noreferrer',
    style:{fontSize:12,fontWeight:700,padding:'8px 12px',borderRadius:20,background:'rgba(26,115,232,.15)',
      border:'1px solid rgba(26,115,232,.3)',color:'#1A73E8',textDecoration:'none'}
  }, '🎓 Google Classroom 🔗'), /*#__PURE__*/React.createElement("a", {
    href:'https://calendar.google.com',target:'_blank',rel:'noopener noreferrer',
    style:{fontSize:12,fontWeight:700,padding:'8px 12px',borderRadius:20,background:'rgba(76,175,82,.12)',
      border:'1px solid rgba(76,175,82,.3)',color:'#4CAF82',textDecoration:'none'}
  }, '📅 Google Calendar 🔗'), /*#__PURE__*/React.createElement("a", {
    href:'https://docs.google.com/document/d/1gbjyGfa1GitlPQn30-YrRezEd23FU-kqdBxs0B2EVtw/edit',target:'_blank',rel:'noopener noreferrer',
    style:{fontSize:12,fontWeight:700,padding:'8px 12px',borderRadius:20,background:'rgba(255,152,0,.12)',
      border:'1px solid rgba(255,152,0,.3)',color:'#FF9800',textDecoration:'none'}
  }, '🍽 Meal Plan 🔗'),
  /*#__PURE__*/React.createElement("a", {
    href:'https://www.jw.org/en/library/magazines/g/was-it-designed/',target:'_blank',rel:'noopener noreferrer',
    style:{fontSize:12,fontWeight:700,padding:'8px 12px',borderRadius:20,background:'rgba(121,134,203,.15)',
      border:'1px solid rgba(121,134,203,.3)',color:'#7986CB',textDecoration:'none'}
  }, '🔬 Was It Designed?'),
  /*#__PURE__*/React.createElement("a", {
    href:'https://www.jw.org/en/library/',target:'_blank',rel:'noopener noreferrer',
    style:{fontSize:12,fontWeight:700,padding:'8px 12px',borderRadius:20,background:'rgba(121,134,203,.12)',
      border:'1px solid rgba(121,134,203,.25)',color:'#7986CB',textDecoration:'none'}
  }, '📚 JW Library'))), isLaurel && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(192,202,51,.15)',
      border: '1px solid rgba(192,202,51,.4)',
      borderRadius: 20,
      padding: '5px 11px',
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12
    }
  }, "👑"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 800,
      color: '#C0CA33'
    }
  }, "TEACHER")), !isLaurel && isAdmin && /*#__PURE__*/React.createElement("button", {
    onClick: () => setTeacherToggle(!teacherToggle),
    style: {
      background: teacherToggle ? 'rgba(192,202,51,.2)' : 'rgba(255,255,255,.06)',
      border: `1px solid ${teacherToggle ? '#C0CA33' : 'rgba(255,255,255,.1)'}`,
      borderRadius: 20,
      padding: '5px 11px',
      fontSize: 9,
      fontWeight: 700,
      color: teacherToggle ? '#C0CA33' : '#555'
    }
  }, "📋 ", teacherToggle ? 'Teacher ON' : 'Teacher Mode')), /*#__PURE__*/React.createElement("div", {
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
      padding: '11px 16px',
      borderRadius: 24,
      fontSize: 14,
      fontWeight: 800,
      border: 'none',
      cursor: 'pointer',
      background: tab === t.id ? '#7986CB' : 'rgba(255,255,255,.1)',
      color: tab === t.id ? '#fff' : '#d0d0de'
    }
  }, t.l))), isAdmin && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      overflowX: 'auto',
      marginBottom: 12
    }
  }, SCHOOL_STUDENTS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setStudent(s),
    style: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '10px 14px',
      cursor: 'pointer',
      borderRadius: 24,
      background: student.id === s.id ? s.color : 'rgba(255,255,255,.1)',
      border: `1px solid ${student.id === s.id ? s.color : 'rgba(255,255,255,.08)'}`,
      color: student.id === s.id ? '#fff' : '#d0d0de'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, s.emoji), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700
    }
  }, s.name), hook.getDayDone(s.id, day) && /*#__PURE__*/React.createElement("span", null, "✅")))), (tab === 'today' || tab === 'script' || tab === 'units') && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDay(Math.max(1, day - 1)),
    style: {
      background: 'rgba(255,255,255,.07)',
      color: '#fff',
      padding: '10px 18px',
      borderRadius: 24,
      border: 'none',
      cursor: 'pointer',
      fontSize: 24,
      lineHeight: 1
    }
  }, "‹"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: '#fff'
    }
  }, "Day ", day, day === todayDay && /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, marginLeft: 8, background: '#4CAF82', color: '#000', borderRadius: 12, padding: '2px 8px', verticalAlign: 'middle' } }, "TODAY"), day !== todayDay && /*#__PURE__*/React.createElement("button", { onClick: () => setDay(todayDay), style: { fontSize: 11, marginLeft: 8, background: 'rgba(76,175,130,.2)', color: '#4CAF82', border: '1px solid #4CAF82', borderRadius: 12, padding: '3px 10px', cursor: 'pointer', fontWeight: 800, verticalAlign: 'middle' } }, "Jump to today")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#b8b8c8'
    }
  }, "of 180 school days"), /*#__PURE__*/React.createElement("div", {
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
      width: `${day / 180 * 100}%`,
      background: '#7986CB',
      borderRadius: 2
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDay(Math.min(180, day + 1)),
    style: {
      background: 'rgba(255,255,255,.07)',
      color: '#fff',
      padding: '10px 18px',
      borderRadius: 24,
      border: 'none',
      cursor: 'pointer',
      fontSize: 24,
      lineHeight: 1
    }
  }, "›")), tab === 'today' && /*#__PURE__*/React.createElement(DailySchoolDay, {
    day: day,
    student: student,
    hook: hook,
    sessions: sessions,
    onUpdate: onUpdate,
    showTeacher: showTeacher
  }), tab === 'script' && isAdmin && typeof TeacherScriptView === 'function' && /*#__PURE__*/React.createElement(TeacherScriptView, {
    student: student,
    hook: hook,
    day: day,
    goStudent: s => { setStudent(s); setTab('today'); }
  }), tab === 'units' && typeof SchoolUnitsView === 'function' && /*#__PURE__*/React.createElement(SchoolUnitsView, {
    student: student,
    hook: hook,
    day: day,
    goDay: d => { setDay(d); setTab('today'); }
  }), tab === 'progress' && /*#__PURE__*/React.createElement(SchoolProgress, {
    hook: hook,
    showTeacher: showTeacher
  }), tab === 'teacherprep' && isAdmin && /*#__PURE__*/React.createElement(TeacherPrepPanel, {
    hook: hook
  }), tab === 'pennfoster' && isAdmin && /*#__PURE__*/React.createElement(OnlineSchoolPanel, {
    initialStudent: student,
    day: day,
    allStudents: SCHOOL_STUDENTS
  }), tab === 'meeting' && isAdmin && /*#__PURE__*/React.createElement(MeetingStudyPanel, {
    hook: hook,
    day: day
  }), tab === 'reading' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "🚀 Mykah's Reading Boost — 4 Phases"), [{
    r: 'Days 1–40',
    l: 'Phase 1: Phonics & Fluency',
    c: '#EF5350',
    goal: '100 wpm; decode multisyllabic words'
  }, {
    r: 'Days 41–90',
    l: 'Phase 2: Vocabulary',
    c: '#FF9800',
    goal: '3rd-grade vocabulary; 120 wpm'
  }, {
    r: 'Days 91–135',
    l: 'Phase 3: Comprehension',
    c: '#C0CA33',
    goal: 'Main idea, inference at 4th-grade level'
  }, {
    r: 'Days 136–180',
    l: 'Phase 4: 5th Grade Ready',
    c: '#4CAF82',
    goal: 'Independent 5th-grade reading + analysis'
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.l,
    className: "card",
    style: {
      marginBottom: 8,
      borderColor: `${p.c}44`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: p.c
    }
  }, p.l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#555'
    }
  }, p.r), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#aaa',
      marginTop: 3
    }
  }, "Goal: ", p.goal))), /*#__PURE__*/React.createElement(MykahReadingBoost, {
    day: day
  })));
}


