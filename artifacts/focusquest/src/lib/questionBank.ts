/**
 * questionBank.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Expanded question pool for FocusQuest quizzes.
 * Each topic has 10-15 questions of varied types. The quiz engine picks a
 * random subset (5-7) on every session so quizzes feel fresh.
 *
 * Question types:
 *   mcq        – 4-option multiple choice
 *   truefalse  – True / False
 *   fillblank  – text input (answer is a string to match)
 *   match      – match pairs (left[] matched to right[])
 *   sequence   – arrange steps in order
 *   image      – emoji/image prompt + MCQ
 */

export type QuestionType = 'mcq' | 'truefalse' | 'fillblank' | 'match' | 'sequence' | 'image';

export interface MatchPair {
  left: string;
  right: string;
}

export interface RichQuestion {
  id: string;
  type: QuestionType;
  question: string;
  // MCQ / TrueFalse / Image
  options?: string[];
  correctIndex?: number;
  // FillBlank
  answer?: string;
  // Match
  pairs?: MatchPair[];
  // Sequence
  sequence?: string[];   // correct order; engine shuffles for display
  // Image (emoji used as visual prompt)
  imageEmoji?: string;
  hint: string;
  difficulty: 1 | 2 | 3;  // 1=easy, 2=medium, 3=hard
  // optional video timestamp link
  videoRef?: { startTime: string; endTime: string; label: string };
}

// ─── MATH: Fractions ──────────────────────────────────────────────────────────
export const mathFractions: RichQuestion[] = [
  { id:'mf1', type:'mcq', difficulty:1, question:'What is the top number of a fraction called?', options:['Denominator','Numerator','Quotient','Product'], correctIndex:1, hint:'It starts with N!', videoRef:{startTime:'00:30',endTime:'01:15',label:'Fraction terminology'} },
  { id:'mf2', type:'mcq', difficulty:1, question:'If you cut a pizza into 4 slices and eat 1, what fraction remains?', options:['1/4','2/4','3/4','4/4'], correctIndex:2, hint:'4 - 1 = 3 slices left.' },
  { id:'mf3', type:'mcq', difficulty:1, question:'Which fraction is equivalent to 1/2?', options:['1/3','2/4','2/6','3/8'], correctIndex:1, hint:'Double both top and bottom of 1/2.' },
  { id:'mf4', type:'truefalse', difficulty:1, question:'The denominator tells us how many equal parts make the whole.', options:['True','False'], correctIndex:0, hint:'Bottom number = total parts.' },
  { id:'mf5', type:'truefalse', difficulty:2, question:'1/3 is greater than 1/2.', options:['True','False'], correctIndex:1, hint:'Larger denominator = smaller piece.' },
  { id:'mf6', type:'fillblank', difficulty:2, question:'Fill in the blank: 3/6 is equal to ___ / 2.', answer:'1', hint:'Divide both 3 and 6 by 3.' },
  { id:'mf7', type:'image', difficulty:1, imageEmoji:'🍕', question:'This pizza is cut into 8 equal slices. You ate 3. What fraction is left?', options:['3/8','5/8','5/3','3/5'], correctIndex:1, hint:'8 - 3 = 5 slices remain.' },
  { id:'mf8', type:'sequence', difficulty:2, question:'Arrange these fractions from SMALLEST to LARGEST:', sequence:['1/8','1/4','1/2','3/4','1/1'], hint:'Bigger denominator = smaller piece (when numerator=1).' },
  { id:'mf9', type:'match', difficulty:2, question:'Match each fraction to its equivalent decimal:', pairs:[{left:'1/2',right:'0.5'},{left:'1/4',right:'0.25'},{left:'3/4',right:'0.75'},{left:'1/10',right:'0.1'}], hint:'Divide numerator by denominator.' },
  { id:'mf10', type:'mcq', difficulty:3, question:'Which of these is NOT equivalent to 2/3?', options:['4/6','6/9','8/12','6/8'], correctIndex:3, hint:'Simplify each fraction.' },
  { id:'mf11', type:'fillblank', difficulty:3, question:'What fraction of 12 is 4? Write as a fraction (e.g. 1/3).', answer:'1/3', hint:'4 out of 12. Simplify!' },
  { id:'mf12', type:'truefalse', difficulty:2, question:'2/4 = 1/2 is a true statement.', options:['True','False'], correctIndex:0, hint:'Simplify 2/4 by dividing top and bottom by 2.' },
];

// ─── MATH: Geometry ───────────────────────────────────────────────────────────
export const mathGeometry: RichQuestion[] = [
  { id:'mg1', type:'mcq', difficulty:1, question:'How many sides does a hexagon have?', options:['4','5','6','8'], correctIndex:2, hint:'Hex- means 6.' },
  { id:'mg2', type:'mcq', difficulty:1, question:'What is the sum of angles in a triangle?', options:['90°','180°','270°','360°'], correctIndex:1, hint:'All triangles share this rule.' },
  { id:'mg3', type:'truefalse', difficulty:1, question:'A circle is a polygon.', options:['True','False'], correctIndex:1, hint:'Polygons have straight sides.' },
  { id:'mg4', type:'mcq', difficulty:2, question:'A shape with 4 equal sides and right angles is called a...?', options:['Rectangle','Rhombus','Square','Trapezoid'], correctIndex:2, hint:'All 4 sides equal + all right angles.' },
  { id:'mg5', type:'image', difficulty:2, imageEmoji:'📐', question:'This is a right-angle triangle. What is the sum of its three angles?', options:['90°','180°','270°','360°'], correctIndex:1, hint:'Every triangle = 180°.' },
  { id:'mg6', type:'fillblank', difficulty:2, question:'A polygon with 8 sides is called an ___.', answer:'octagon', hint:'Oct- means 8.' },
  { id:'mg7', type:'match', difficulty:2, question:'Match each shape to its number of sides:', pairs:[{left:'Triangle',right:'3'},{left:'Pentagon',right:'5'},{left:'Octagon',right:'8'},{left:'Hexagon',right:'6'}], hint:'Think of the prefix of each word.' },
  { id:'mg8', type:'sequence', difficulty:3, question:'Arrange these polygons by number of sides (fewest first):', sequence:['Triangle','Quadrilateral','Pentagon','Hexagon','Octagon'], hint:'Count their side count.' },
  { id:'mg9', type:'truefalse', difficulty:2, question:'A square is always a rectangle.', options:['True','False'], correctIndex:0, hint:'A square has 4 right angles AND equal sides — so it fits the rectangle definition.' },
  { id:'mg10', type:'mcq', difficulty:3, question:'What do you call a triangle with all sides equal?', options:['Isosceles','Scalene','Equilateral','Right-angle'], correctIndex:2, hint:'Equi = equal, lateral = sides.' },
  { id:'mg11', type:'fillblank', difficulty:3, question:'The perimeter of a square with side 7 cm is ___ cm.', answer:'28', hint:'4 × side length.' },
  { id:'mg12', type:'mcq', difficulty:3, question:'How many degrees are in a full circle?', options:['90°','180°','270°','360°'], correctIndex:3, hint:'Think: how many right angles fit in a full spin?' },
];

// ─── MATH: Times Tables (with procedural variation) ──────────────────────────
export const mathTables: RichQuestion[] = [
  { id:'mt1', type:'mcq', difficulty:1, question:'What is 7 × 8?', options:['54','56','58','63'], correctIndex:1, hint:'Seven ate (8) fifty-six!' },
  { id:'mt2', type:'mcq', difficulty:1, question:'What is 9 × 6?', options:['54','63','48','45'], correctIndex:0, hint:'9 × 6: fingers trick.' },
  { id:'mt3', type:'mcq', difficulty:2, question:'What is 12 × 11?', options:['121','122','132','123'], correctIndex:2, hint:'12 × 10 + 12.' },
  { id:'mt4', type:'fillblank', difficulty:1, question:'6 × 7 = ___', answer:'42', hint:'Six sevens.' },
  { id:'mt5', type:'fillblank', difficulty:2, question:'8 × 9 = ___', answer:'72', hint:'8 × 9: think 72 has digits summing to 9.' },
  { id:'mt6', type:'truefalse', difficulty:1, question:'5 × 5 = 25', options:['True','False'], correctIndex:0, hint:'Count by 5s.' },
  { id:'mt7', type:'truefalse', difficulty:1, question:'0 × 999 = 999', options:['True','False'], correctIndex:1, hint:'Anything × 0 = 0.' },
  { id:'mt8', type:'mcq', difficulty:2, question:'What is 11 × 11?', options:['111','112','121','122'], correctIndex:2, hint:'11 × 11 = 121. Palindrome!' },
  { id:'mt9', type:'mcq', difficulty:2, question:'Which multiplication equals 36?', options:['4×8','6×6','5×7','7×4'], correctIndex:1, hint:'6 × 6 = 6².' },
  { id:'mt10', type:'sequence', difficulty:3, question:'Put the 7-times-table results in order (smallest first):', sequence:['7','14','21','28','35'], hint:'Add 7 each time.' },
  { id:'mt11', type:'fillblank', difficulty:3, question:'12 × 12 = ___', answer:'144', hint:'The famous "dozen dozen".' },
  { id:'mt12', type:'match', difficulty:2, question:'Match each multiplication to its result:', pairs:[{left:'3 × 7',right:'21'},{left:'4 × 8',right:'32'},{left:'6 × 9',right:'54'},{left:'5 × 5',right:'25'}], hint:'Calculate each one.' },
];

// ─── SCIENCE: Solar System ────────────────────────────────────────────────────
export const sciSolar: RichQuestion[] = [
  { id:'ss1', type:'mcq', difficulty:1, question:'Which planet is closest to the Sun?', options:['Venus','Earth','Mars','Mercury'], correctIndex:3, hint:'Smallest and fastest.' },
  { id:'ss2', type:'mcq', difficulty:1, question:'What is the largest planet in our solar system?', options:['Saturn','Jupiter','Uranus','Neptune'], correctIndex:1, hint:'Great Red Spot storm.' },
  { id:'ss3', type:'truefalse', difficulty:1, question:'Saturn has rings made of ice and rock.', options:['True','False'], correctIndex:0, hint:'Its iconic rings are particles of ice.' },
  { id:'ss4', type:'truefalse', difficulty:2, question:'Pluto is considered a full planet.', options:['True','False'], correctIndex:1, hint:'Reclassified as a dwarf planet in 2006.' },
  { id:'ss5', type:'mcq', difficulty:2, question:'How many planets are in our solar system?', options:['7','8','9','10'], correctIndex:1, hint:'Pluto was reclassified.' },
  { id:'ss6', type:'fillblank', difficulty:1, question:'The planet known as "the red planet" is ___.', answer:'Mars', hint:'Iron oxide gives it its colour.' },
  { id:'ss7', type:'sequence', difficulty:2, question:'Arrange the planets in order from the Sun (closest first):', sequence:['Mercury','Venus','Earth','Mars','Jupiter'], hint:'My Very Educated Mother...' },
  { id:'ss8', type:'match', difficulty:2, question:"Match each planet feature:", pairs:[{left:'Jupiter',right:'Largest planet'},{left:'Saturn',right:'Has giant rings'},{left:'Mercury',right:'Closest to Sun'},{left:'Earth',right:'Has one moon'}], hint:"Think about each planet's most famous feature." },
  { id:'ss9', type:'image', difficulty:2, imageEmoji:'🪐', question:'This ringed planet is the 6th from the Sun. What is its name?', options:['Jupiter','Uranus','Saturn','Neptune'], correctIndex:2, hint:'Famous for its spectacular rings.' },
  { id:'ss10', type:'mcq', difficulty:3, question:'Which two planets have no moons?', options:['Mercury & Venus','Earth & Mars','Jupiter & Saturn','Neptune & Uranus'], correctIndex:0, hint:'The two innermost planets.' },
  { id:'ss11', type:'fillblank', difficulty:3, question:'The distance from Earth to the Sun is approximately ___ million km.', answer:'150', hint:'Astronomers call this 1 Astronomical Unit (AU).' },
  { id:'ss12', type:'truefalse', difficulty:3, question:'Uranus rotates on its side (extreme axial tilt ~98°).', options:['True','False'], correctIndex:0, hint:'It essentially rolls around the Sun!' },
];

// ─── SCIENCE: States of Matter ────────────────────────────────────────────────
export const sciMatter: RichQuestion[] = [
  { id:'sm1', type:'mcq', difficulty:1, question:'What state of matter is water at room temperature?', options:['Solid','Liquid','Gas','Plasma'], correctIndex:1, hint:'You can pour it.' },
  { id:'sm2', type:'truefalse', difficulty:1, question:'Gases take the shape of their container.', options:['True','False'], correctIndex:0, hint:'Gas fills any container it is put in.' },
  { id:'sm3', type:'fillblank', difficulty:1, question:'Ice is water in a ___ state.', answer:'solid', hint:'Ice cube is rigid — fixed shape.' },
  { id:'sm4', type:'mcq', difficulty:2, question:'When water evaporates it becomes?', options:['Solid','Liquid','Gas','Plasma'], correctIndex:2, hint:'Steam is water vapour.' },
  { id:'sm5', type:'image', difficulty:1, imageEmoji:'🧊', question:'This cube of ice melts in the sun. What state does it become?', options:['Solid','Liquid','Gas','Plasma'], correctIndex:1, hint:'Ice → water.' },
  { id:'sm6', type:'match', difficulty:2, question:'Match each state of matter to its property:', pairs:[{left:'Solid',right:'Fixed shape & volume'},{left:'Liquid',right:'Fixed volume, no fixed shape'},{left:'Gas',right:'No fixed shape or volume'}], hint:'Think about how each behaves in a container.' },
  { id:'sm7', type:'sequence', difficulty:2, question:'Arrange these in order of heating water (coldest to hottest state):', sequence:['Ice (Solid)','Water (Liquid)','Steam (Gas)'], hint:'Heat = more energy = less rigid.' },
  { id:'sm8', type:'truefalse', difficulty:2, question:'Liquids have a fixed shape.', options:['True','False'], correctIndex:1, hint:'Liquids take the shape of their container.' },
  { id:'sm9', type:'mcq', difficulty:3, question:'What is the scientific term for a liquid turning into a gas at its surface (below boiling point)?', options:['Condensation','Melting','Evaporation','Sublimation'], correctIndex:2, hint:'Puddles disappear this way.' },
  { id:'sm10', type:'fillblank', difficulty:3, question:'When a gas cools and turns into a liquid, the process is called ___.', answer:'condensation', hint:'Water droplets on a cold glass.' },
];

// ─── ENGLISH: Parts of Speech ─────────────────────────────────────────────────
export const engSpeech: RichQuestion[] = [
  { id:'ep1', type:'mcq', difficulty:1, question:"In 'The fast dog ran quickly', what is 'ran'?", options:['Noun','Adjective','Verb','Adverb'], correctIndex:2, hint:'Which word is the action?' },
  { id:'ep2', type:'mcq', difficulty:1, question:"Which of these is an adjective?", options:['Beautiful','Quickly','House','Sing'], correctIndex:0, hint:'It describes something.' },
  { id:'ep3', type:'truefalse', difficulty:1, question:"A pronoun replaces a noun.", options:['True','False'], correctIndex:0, hint:"'He', 'She', 'They' are pronouns." },
  { id:'ep4', type:'fillblank', difficulty:1, question:"A ___ names a person, place, or thing.", answer:'noun', hint:'Dog, city, love are examples.' },
  { id:'ep5', type:'match', difficulty:2, question:'Match each word to its part of speech:', pairs:[{left:'Quickly',right:'Adverb'},{left:'Dog',right:'Noun'},{left:'Happy',right:'Adjective'},{left:'Jump',right:'Verb'}], hint:'Think about what role each word plays.' },
  { id:'ep6', type:'mcq', difficulty:2, question:"'She went to the store.' What is 'She'?", options:['Noun','Pronoun','Verb','Adjective'], correctIndex:1, hint:'It replaces a name.' },
  { id:'ep7', type:'fillblank', difficulty:2, question:"A word that describes a verb is called an ___ .", answer:'adverb', hint:"'Quickly' describes how something is done." },
  { id:'ep8', type:'truefalse', difficulty:2, question:"'Run' can only be a verb, never a noun.", options:['True','False'], correctIndex:1, hint:"'A morning run' — here 'run' is a noun!" },
  { id:'ep9', type:'sequence', difficulty:3, question:'Rearrange to form a correct sentence:', sequence:['The','brave','knight','slayed','the','dragon'], hint:'Article → adjective → noun → verb → article → noun.' },
  { id:'ep10', type:'mcq', difficulty:3, question:"Which sentence uses an adverb correctly?", options:["She is a very tall girl.","She is a tall very girl.","She runs slow.","He eats quick food."], correctIndex:0, hint:"'Very' modifies the adjective 'tall'." },
];

// ─── LOGIC: Patterns & Sequences ──────────────────────────────────────────────
export const logicPatterns: RichQuestion[] = [
  { id:'lp1', type:'mcq', difficulty:1, question:'What comes next? 2, 4, 6, 8, ___', options:['9','10','12','11'], correctIndex:1, hint:'Add 2 each time.' },
  { id:'lp2', type:'mcq', difficulty:1, question:'What comes next? 3, 6, 12, 24, ___', options:['36','48','30','26'], correctIndex:1, hint:'Multiply by 2 each time.' },
  { id:'lp3', type:'fillblank', difficulty:1, question:'5, 10, 15, 20, ___', answer:'25', hint:'Add 5 each time (skip counting).' },
  { id:'lp4', type:'truefalse', difficulty:2, question:'The sequence 1, 4, 9, 16, 25 consists of perfect squares.', options:['True','False'], correctIndex:0, hint:'1², 2², 3², 4², 5².' },
  { id:'lp5', type:'sequence', difficulty:2, question:'Put these steps in order to solve a pattern:', sequence:['Spot the first term','Find the rule (add/multiply)','Verify with next terms','Predict the next term'], hint:'You need the rule BEFORE you can predict.' },
  { id:'lp6', type:'match', difficulty:2, question:'Match each sequence to its rule:', pairs:[{left:'2, 4, 6, 8',right:'+2'},{left:'3, 9, 27, 81',right:'×3'},{left:'100, 50, 25',right:'÷2'},{left:'1, 1, 2, 3, 5',right:'Fibonacci'}], hint:'Look at the relationship between consecutive terms.' },
  { id:'lp7', type:'mcq', difficulty:3, question:'What is the 10th term of 3, 7, 11, 15, ...?', options:['35','39','40','43'], correctIndex:1, hint:'First term + (n-1) × difference. 3 + 9 × 4.' },
  { id:'lp8', type:'fillblank', difficulty:3, question:'The missing term: 2, ___, 18, 54, 162', answer:'6', hint:'Each term is multiplied by 3.' },
];

// ─── LOGIC: Algorithms ────────────────────────────────────────────────────────
export const logicAlgorithms: RichQuestion[] = [
  { id:'la1', type:'mcq', difficulty:1, question:'What is an algorithm?', options:['A type of math','Step-by-step instructions to solve a task','A programming language','A computer chip'], correctIndex:1, hint:'A recipe is an algorithm for cooking!' },
  { id:'la2', type:'truefalse', difficulty:1, question:"A computer follows algorithms blindly — it doesn't think.", options:['True','False'], correctIndex:0, hint:'Computers execute instructions, not decisions.' },
  { id:'la3', type:'fillblank', difficulty:1, question:'Finding and fixing errors in an algorithm is called ___.', answer:'debugging', hint:"'Bugs' are errors in code." },
  { id:'la4', type:'sequence', difficulty:2, question:'Put these algorithm steps in order to make a sandwich:', sequence:['Get two slices of bread','Spread filling on one slice','Place second slice on top','Cut diagonally'], hint:'Follow the logical cooking order.' },
  { id:'la5', type:'mcq', difficulty:2, question:"'IF it rains, THEN take an umbrella'. What is this an example of?", options:['Loop','Function','Conditional','Variable'], correctIndex:2, hint:"IF-THEN = Conditional." },
  { id:'la6', type:'match', difficulty:2, question:'Match each programming concept to its meaning:', pairs:[{left:'Loop',right:'Repeat action multiple times'},{left:'Conditional',right:'If-then decision'},{left:'Variable',right:'Stores a value'},{left:'Function',right:'Reusable block of code'}], hint:'Think about what each does.' },
  { id:'la7', type:'mcq', difficulty:3, question:'Which loop runs at least ONCE before checking the condition?', options:['for loop','while loop','do-while loop','if loop'], correctIndex:2, hint:'It executes the body DO first, checks WHILE after.' },
];

// ─── SOCIAL: World Continents ──────────────────────────────────────────────────
export const socContinents: RichQuestion[] = [
  { id:'sc1', type:'mcq', difficulty:1, question:'How many continents are on Earth?', options:['5','6','7','8'], correctIndex:2, hint:'Seven!' },
  { id:'sc2', type:'fillblank', difficulty:1, question:'The largest continent is ___.', answer:'Asia', hint:'Contains India, China, Russia...' },
  { id:'sc3', type:'truefalse', difficulty:1, question:'Australia is both a continent and a country.', options:['True','False'], correctIndex:0, hint:'Unique fact — only continent-country!' },
  { id:'sc4', type:'match', difficulty:2, question:'Match each continent to a famous feature:', pairs:[{left:'Africa',right:'Sahara Desert'},{left:'Europe',right:'Eiffel Tower'},{left:'South America',right:'Amazon Rainforest'},{left:'Antarctica',right:'South Pole'}], hint:'Each continent has iconic landmarks.' },
  { id:'sc5', type:'sequence', difficulty:2, question:'Arrange continents from largest to smallest (by area):', sequence:['Asia','Africa','North America','South America','Europe'], hint:'Asia first, Europe last of these five.' },
  { id:'sc6', type:'mcq', difficulty:2, question:'Which continent has the most countries?', options:['Asia','North America','Africa','Europe'], correctIndex:2, hint:'54 countries!' },
  { id:'sc7', type:'image', difficulty:2, imageEmoji:'🌍', question:'This globe emoji shows Earth. Which ocean is the largest?', options:['Atlantic','Indian','Arctic','Pacific'], correctIndex:3, hint:'It covers about one-third of Earth.' },
  { id:'sc8', type:'fillblank', difficulty:3, question:'The continent with the least population is ___.', answer:'Antarctica', hint:'Only scientists live there temporarily.' },
];

// ─── Master bank registry (keyed by quest id) ─────────────────────────────────
export const QUESTION_BANK: Record<string, RichQuestion[]> = {
  math_1: mathFractions,
  math_2: mathGeometry,
  math_3: mathTables,
  sci_1:  sciSolar,
  sci_2:  sciMatter,
  sci_3:  sciMatter,   // food chains quest reuses matter for now (can be extended)
  eng_1:  engSpeech,
  eng_2:  engSpeech,
  eng_3:  engSpeech,
  soc_1:  socContinents,
  soc_2:  socContinents,
  soc_3:  socContinents,
  log_1:  logicPatterns,
  log_2:  logicPatterns,
  log_3:  logicAlgorithms,
};

// ─── Procedural math generator ────────────────────────────────────────────────
/** Generates a fresh addition question with randomised numbers within a range */
export function generateMathAddition(difficulty: 1|2|3): RichQuestion {
  const ranges: Record<number,[number,number]> = { 1:[1,20], 2:[10,50], 3:[25,100] };
  const [min, max] = ranges[difficulty];
  const a = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);
  const correct = a + b;
  // Generate 3 plausible wrong answers
  const wrongs = [correct-1, correct+1, correct+2].map(n => n < 0 ? n + 3 : n);
  const options = shuffle([String(correct), ...wrongs.map(String)]);
  const correctIndex = options.indexOf(String(correct));
  return {
    id: `proc_add_${Date.now()}`,
    type: 'mcq',
    difficulty,
    question: `What is ${a} + ${b}?`,
    options,
    correctIndex,
    hint: `Try counting up from ${a}.`,
  };
}

/** Generates a fresh multiplication question */
export function generateMathMultiply(difficulty: 1|2|3): RichQuestion {
  const tables: Record<number,number[]> = { 1:[2,3,4,5], 2:[6,7,8], 3:[9,11,12] };
  const pool = tables[difficulty];
  const a = pool[Math.floor(Math.random() * pool.length)];
  const b = Math.floor(Math.random() * 10) + 2;
  const correct = a * b;
  const wrongs = [correct-a, correct+a, correct+b].map(n => n < 0 ? n + a : n);
  const options = shuffle([String(correct), ...wrongs.map(String)]);
  const correctIndex = options.indexOf(String(correct));
  return {
    id: `proc_mul_${Date.now()}`,
    type: 'mcq',
    difficulty,
    question: `What is ${a} × ${b}?`,
    options,
    correctIndex,
    hint: `${a} groups of ${b}.`,
  };
}

// ─── Utility: Fisher-Yates shuffle ────────────────────────────────────────────
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Select a random subset of questions for a quiz session.
 * @param questId   - which quest's bank to use
 * @param count     - how many questions to return (default 6)
 * @param focusLevel - 0-100; lower → prefer easier; higher → prefer harder
 * @param injectProcedural - for math quests, add 1-2 procedural generated questions
 */
export function getRandomQuestions(
  questId: string,
  count = 6,
  focusLevel = 50,
  injectProcedural = false,
): RichQuestion[] {
  const bank = QUESTION_BANK[questId] ?? [];
  let pool = [...bank];

  // Adaptive difficulty: filter pool bias
  if (focusLevel < 35) {
    // Low focus: prefer easy + some medium
    const easy = pool.filter(q => q.difficulty === 1);
    const med  = pool.filter(q => q.difficulty === 2);
    pool = [...easy, ...easy, ...med]; // double weight easy
  } else if (focusLevel > 70) {
    // High focus: prefer hard + some medium
    const hard = pool.filter(q => q.difficulty === 3);
    const med  = pool.filter(q => q.difficulty === 2);
    pool = [...hard, ...hard, ...med];
  }

  // Inject 1-2 procedural math questions for math quests
  if (injectProcedural && questId.startsWith('math')) {
    const diff: 1|2|3 = focusLevel > 60 ? 3 : focusLevel > 30 ? 2 : 1;
    pool.push(generateMathAddition(diff));
    pool.push(generateMathMultiply(diff));
  }

  return shuffle(pool).slice(0, Math.min(count, pool.length));
}
