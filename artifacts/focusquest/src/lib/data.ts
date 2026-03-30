export interface Character {
  id: string;
  name: string;
  theme: 'ocean' | 'space' | 'future';
  requiredXp: number;
  imagePath: string;
  description: string;
}

export const CHARACTERS: Character[] = [
  // Ocean theme (1st-4th std)
  { id: 'c1', name: 'Cabin Boy', theme: 'ocean', requiredXp: 0, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.22_1774375181412.jpeg', description: 'Ready for adventure!' },
  { id: 'c2', name: 'Deckhand Girl', theme: 'ocean', requiredXp: 0, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.24_1774375181418.jpeg', description: 'Swift with the ropes!' },
  { id: 'c3', name: 'Navigator Boy', theme: 'ocean', requiredXp: 500, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.23_1774375181416.jpeg', description: 'Always knows the way.' },
  { id: 'c4', name: 'Pirate Lookout', theme: 'ocean', requiredXp: 500, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.23_(1)_1774375181414.jpeg', description: 'Eagle eyes.' },
  { id: 'c5', name: 'Storm Mage', theme: 'ocean', requiredXp: 1200, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.24_(1)_1774375181417.jpeg', description: 'Controls the lightning.' },
  { id: 'c6', name: 'Powder Monkey', theme: 'ocean', requiredXp: 1200, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.26_(1)_1774375168567.jpeg', description: 'Explosive personality!' },
  { id: 'c7', name: "Cap'n Cookie", theme: 'ocean', requiredXp: 2500, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.25_(1)_1774375168566.jpeg', description: 'Feeds the crew.' },
  { id: 'c8', name: 'Bosun Boy', theme: 'ocean', requiredXp: 2500, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.26_(2)_1774375168568.jpeg', description: 'Strongest on deck.' },
  { id: 'c9', name: 'Cannoneer', theme: 'ocean', requiredXp: 2500, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.26_1774375168568.jpeg', description: 'Boom!' },
  { id: 'c10', name: 'Treasure Hunter', theme: 'ocean', requiredXp: 5000, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.25_(2)_1774375168567.jpeg', description: 'Finds the gold.' },
  { id: 'c11', name: 'First Mate', theme: 'ocean', requiredXp: 5000, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.25_1774375168567.jpeg', description: 'Loyal and fierce.' },
  { id: 'c12', name: 'Sea King', theme: 'ocean', requiredXp: 5000, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.27_(1)_1774375168569.jpeg', description: 'Ruler of the waves.' },
  { id: 'c13', name: 'Pirate Queen', theme: 'ocean', requiredXp: 5000, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.27_(2)_1774375168569.jpeg', description: 'Legendary captain.' },
  { id: 'c14', name: 'Ocean Witch', theme: 'ocean', requiredXp: 5000, imagePath: '/characters/sea/WhatsApp_Image_2026-03-24_at_14.08.27_1774375168570.jpeg', description: 'Mystical depths.' },
  // Space theme (5th-7th std)
  { id: 's1', name: 'Astro Rookie', theme: 'space', requiredXp: 0, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.46 (1).jpeg', description: 'Fresh out of the academy.' },
  { id: 's2', name: 'Star Cadet', theme: 'space', requiredXp: 200, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.46.jpeg', description: 'Ready for the stars.' },
  { id: 's3', name: 'Galactic Explorer', theme: 'space', requiredXp: 500, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.47.jpeg', description: 'Seeking new worlds.' },
  { id: 's4', name: 'Orbit Ranger', theme: 'space', requiredXp: 800, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.48 (1).jpeg', description: 'Patrolling the asteroid belt.' },
  { id: 's5', name: 'Nebula Pilot', theme: 'space', requiredXp: 1200, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.48.jpeg', description: 'Master of light speed.' },
  { id: 's6', name: 'Cosmic Voyager', theme: 'space', requiredXp: 1600, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.49.jpeg', description: 'Traversing the deep void.' },
  { id: 's7', name: 'Meteor Knight', theme: 'space', requiredXp: 2000, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.50 (1).jpeg', description: 'Defender of the galaxy.' },
  { id: 's8', name: 'Nova Captain', theme: 'space', requiredXp: 2500, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.50 (2).jpeg', description: 'Commanding the flagship.' },
  { id: 's9', name: 'Quantum Engineer', theme: 'space', requiredXp: 3000, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.51 (1).jpeg', description: 'Fixes any hyperdrive.' },
  { id: 's10', name: 'Solar Guardian', theme: 'space', requiredXp: 3500, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.51 (2).jpeg', description: 'Powered by a dying star.' },
  { id: 's11', name: 'Void Walker', theme: 'space', requiredXp: 4000, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.51.jpeg', description: 'Steps through dimensions.' },
  { id: 's12', name: 'Starfleet Admiral', theme: 'space', requiredXp: 5000, imagePath: '/characters/space/WhatsApp Image 2026-03-24 at 15.31.52.jpeg', description: 'Legendary space commander.' },
  // Future theme (8th-10th std)
  { id: 'f1', name: 'Angel Warrior', theme: 'future', requiredXp: 0, imagePath: '/characters/future/angel_warrior.png', description: 'Celestial protector of the digital realm.' },
  { id: 'f2', name: 'Neon Sniper', theme: 'future', requiredXp: 0, imagePath: '/characters/future/neon_sniper.png', description: 'Silent shadow with deadly precision.' },
  { id: 'f3', name: 'Cyber Guardian', theme: 'future', requiredXp: 500, imagePath: '/characters/future/cyber_guardian.png', description: 'Advanced AI sentinel with drone escorts.' },
  { id: 'f4', name: 'Samurai Knight', theme: 'future', requiredXp: 1200, imagePath: '/characters/future/samurai_knight.png', description: 'Ancient honor meets futuristic power.' },
];

export interface Subject {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}

export const SUBJECTS_BASE: Subject[] = [
  { id: 'math', title: 'Mathematics', icon: '🔢', color: 'from-blue-400 to-blue-600', description: 'Master numbers and shapes!' },
  { id: 'science', title: 'Science', icon: '🔬', color: 'from-green-400 to-green-600', description: 'Discover how the universe works.' },
  { id: 'english', title: 'English', icon: '📚', color: 'from-purple-400 to-purple-600', description: 'The power of words and stories.' },
  { id: 'social', title: 'Social Studies', icon: '🌍', color: 'from-orange-400 to-orange-600', description: 'Explore history and geography.' },
  { id: 'logic', title: 'Logical Thinking', icon: '🧩', color: 'from-pink-400 to-pink-600', description: 'Solve puzzles and think critically.' }
];

export const SUBJECTS_MIDDLE: Subject[] = [
  { id: 'math_mid', title: 'Mathematics', icon: '📐', color: 'from-blue-500 to-indigo-500', description: 'Pre-Algebra & Advanced Geometry.' },
  { id: 'science_mid', title: 'Science', icon: '🌍', color: 'from-green-500 to-teal-500', description: 'Earth, Life & Physical Sciences.' },
  { id: 'english_mid', title: 'Language Arts', icon: '📖', color: 'from-purple-500 to-fuchsia-500', description: 'Literature, Grammar & Writing.' },
  { id: 'social_mid', title: 'Social Studies', icon: '🗺️', color: 'from-orange-500 to-red-500', description: 'World History & Geography.' },
  { id: 'logic_mid', title: 'Logic & Coding', icon: '💻', color: 'from-cyan-500 to-blue-500', description: 'Algorithms & Problem Solving.' }
];

export const SUBJECTS_HIGH: Subject[] = [
  { id: 'math_high', title: 'Mathematics', icon: '➗', color: 'from-blue-400 to-indigo-600', description: 'Algebra, Geometry & Trigonometry.' },
  { id: 'physics', title: 'Physics', icon: '⚛️', color: 'from-cyan-400 to-cyan-600', description: 'Motion, Forces & Energy.' },
  { id: 'chemistry', title: 'Chemistry', icon: '🧪', color: 'from-emerald-400 to-emerald-600', description: 'Matter & Chemical Reactions.' },
  { id: 'biology', title: 'Biology', icon: '🧬', color: 'from-lime-400 to-lime-600', description: 'Cells & Human Body.' },
  { id: 'computer', title: 'Computer Science', icon: '💻', color: 'from-indigo-400 to-indigo-600', description: 'Coding & Algorithms.' }
];

export const SUBJECTS: Subject[] = [...SUBJECTS_BASE, ...SUBJECTS_MIDDLE, ...SUBJECTS_HIGH];

export function getSubjectsForGrade(grade: number): Subject[] {
  if (grade >= 8) return SUBJECTS_HIGH;
  if (grade >= 5) return SUBJECTS_MIDDLE;
  return SUBJECTS_BASE;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export interface Quest {
  id: string;
  subjectId: string;
  title: string;
  difficulty: number;
  xpReward: number;
  requiredXp: number;
  timeMins: number;
  notes: string[];
  quiz: QuizQuestion[];
  /** YouTube video ID for the lesson video (optional) */
  videoId?: string;
}

export const QUESTS: Quest[] = [
  // ======== MATH ========
  {
    id: 'math_1', subjectId: 'math', title: 'Fractions Intro', difficulty: 1, xpReward: 50, requiredXp: 0, timeMins: 5,
    videoId: '362JVVvgYPE',
    notes: [
      "A fraction represents a part of a whole.",
      "The top number is the Numerator — how many parts we have.",
      "The bottom number is the Denominator — how many equal parts make a whole.",
      "Example: 3/4 means 3 pieces out of 4 equal pieces.",
      "Equivalent fractions look different but are equal: 1/2 = 2/4 = 4/8."
    ],
    quiz: [
      { id: 'mq1', question: "What is the top number of a fraction called?", options: ["Denominator", "Numerator", "Quotient", "Product"], correctIndex: 1, hint: "It starts with N!" },
      { id: 'mq2', question: "If you cut a pizza into 4 slices and eat 1, what fraction is left?", options: ["1/4", "2/4", "3/4", "4/4"], correctIndex: 2, hint: "Subtract 1 from 4." },
      { id: 'mq3', question: "Which fraction is bigger?", options: ["1/2", "1/4", "1/8", "They are equal"], correctIndex: 0, hint: "Would you rather have half a cake or a quarter?" },
      { id: 'mq4', question: "What fraction is equivalent to 1/2?", options: ["1/3", "2/4", "2/6", "3/8"], correctIndex: 1, hint: "Double both top and bottom of 1/2." }
    ]
  },
  {
    id: 'math_2', subjectId: 'math', title: 'Geometry Shapes', difficulty: 2, xpReward: 100, requiredXp: 100, timeMins: 7,
    notes: [
      "Polygons are closed 2D shapes with straight sides.",
      "Triangle: 3 sides, 3 angles. Sum of angles = 180°.",
      "Quadrilateral: 4 sides. Squares, rectangles, and rhombuses are quadrilaterals.",
      "Pentagon: 5 sides. Hexagon: 6 sides. Octagon: 8 sides.",
      "A regular polygon has all sides and angles equal."
    ],
    quiz: [
      { id: 'mq5', question: "How many sides does a Hexagon have?", options: ["4", "5", "6", "8"], correctIndex: 2, hint: "Hex- means 6." },
      { id: 'mq6', question: "Is a circle a polygon?", options: ["Yes, it is", "No, it has no straight sides", "Yes if drawn with a ruler", "Only small circles"], correctIndex: 1, hint: "Polygons have straight sides." },
      { id: 'mq7', question: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], correctIndex: 1, hint: "All triangles, big or tiny, share this rule." },
      { id: 'mq8', question: "A shape with 4 equal sides and right angles is called a?", options: ["Rectangle", "Rhombus", "Square", "Trapezoid"], correctIndex: 2, hint: "Perfectly equal — all 4 sides the same!" }
    ]
  },
  {
    id: 'math_3', subjectId: 'math', title: 'Multiplication Tables', difficulty: 1, xpReward: 75, requiredXp: 0, timeMins: 6,
    notes: [
      "Multiplication is repeated addition: 4 × 3 = 4 + 4 + 4 = 12.",
      "Any number multiplied by 0 equals 0.",
      "Any number multiplied by 1 equals itself.",
      "The order doesn't matter: 3 × 5 = 5 × 3 = 15.",
      "Knowing your times tables makes math much faster!"
    ],
    quiz: [
      { id: 'mq9', question: "What is 7 × 8?", options: ["54", "56", "58", "63"], correctIndex: 1, hint: "7 × 8 = 56. Seven ate (8) fifty-six!" },
      { id: 'mq10', question: "What is 9 × 6?", options: ["54", "63", "48", "45"], correctIndex: 0, hint: "9 × 6: fingers trick — hold down 6th finger." },
      { id: 'mq11', question: "What is 12 × 11?", options: ["121", "122", "132", "123"], correctIndex: 2, hint: "12 × 10 = 120, plus 12 more." }
    ]
  },

  // ======== SCIENCE ========
  {
    id: 'sci_1', subjectId: 'science', title: 'Solar System', difficulty: 2, xpReward: 75, requiredXp: 0, timeMins: 6,
    notes: [
      "Our solar system has 8 planets orbiting the Sun.",
      "Inner (rocky) planets: Mercury, Venus, Earth, Mars.",
      "Outer (gas giant) planets: Jupiter, Saturn, Uranus, Neptune.",
      "Jupiter is the largest planet — 1,300 Earths fit inside it!",
      "Saturn has beautiful rings made of ice and rock."
    ],
    quiz: [
      { id: 'sq1', question: "Which planet is closest to the Sun?", options: ["Venus", "Earth", "Mars", "Mercury"], correctIndex: 3, hint: "It's the smallest and fastest orbiting." },
      { id: 'sq2', question: "What is the largest planet in our solar system?", options: ["Saturn", "Jupiter", "Uranus", "Neptune"], correctIndex: 1, hint: "It has a Great Red Spot storm." },
      { id: 'sq3', question: "Which planet has the most famous rings?", options: ["Jupiter", "Neptune", "Saturn", "Mars"], correctIndex: 2, hint: "Its rings are made of ice chunks." },
      { id: 'sq4', question: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], correctIndex: 1, hint: "Pluto was reclassified in 2006." }
    ]
  },
  {
    id: 'sci_2', subjectId: 'science', title: 'States of Matter', difficulty: 1, xpReward: 60, requiredXp: 0, timeMins: 5,
    notes: [
      "Matter exists in 3 main states: Solid, Liquid, Gas.",
      "Solids have a fixed shape and volume (e.g., ice, rock).",
      "Liquids have a fixed volume but take the shape of their container (e.g., water).",
      "Gases have no fixed shape or volume (e.g., air, steam).",
      "Heating can change states: ice → water → steam."
    ],
    quiz: [
      { id: 'sq5', question: "What state of matter is water at room temperature?", options: ["Solid", "Liquid", "Gas", "Plasma"], correctIndex: 1, hint: "You can pour it!" },
      { id: 'sq6', question: "When ice melts it becomes?", options: ["Gas", "Solid", "Liquid", "Plasma"], correctIndex: 2, hint: "Ice cube left in the sun." },
      { id: 'sq7', question: "Which has a fixed shape?", options: ["Water", "Air", "Steam", "Rock"], correctIndex: 3, hint: "You can pick it up and it stays the same." }
    ]
  },
  {
    id: 'sci_3', subjectId: 'science', title: 'Food Chains', difficulty: 2, xpReward: 80, requiredXp: 150, timeMins: 7,
    notes: [
      "A food chain shows how energy flows from one organism to another.",
      "Producers (plants) make their own food using sunlight — photosynthesis.",
      "Primary consumers eat plants (e.g., rabbits).",
      "Secondary consumers eat primary consumers (e.g., foxes eat rabbits).",
      "Decomposers break down dead organisms (e.g., bacteria, fungi)."
    ],
    quiz: [
      { id: 'sq8', question: "What do producers use to make food?", options: ["Meat", "Sunlight", "Water only", "Other animals"], correctIndex: 1, hint: "Plants 'cook' with the sun!" },
      { id: 'sq9', question: "A rabbit eating grass is an example of?", options: ["Decomposer", "Secondary consumer", "Primary consumer", "Producer"], correctIndex: 2, hint: "It's eating a plant directly." },
      { id: 'sq10', question: "What do decomposers do?", options: ["Hunt animals", "Make sunlight", "Break down dead organisms", "Eat producers"], correctIndex: 2, hint: "Nature's clean-up crew." }
    ]
  },

  // ======== ENGLISH ========
  {
    id: 'eng_1', subjectId: 'english', title: 'Parts of Speech', difficulty: 1, xpReward: 50, requiredXp: 0, timeMins: 5,
    videoId: '_PqkZDSnZFM',
    notes: [
      "Noun: A person, place, thing, or idea (e.g., dog, school, love).",
      "Verb: An action or state (e.g., run, jump, is, feels).",
      "Adjective: Describes a noun (e.g., red, tall, happy).",
      "Adverb: Describes a verb, adjective, or other adverb (e.g., quickly, very).",
      "Pronoun: Takes the place of a noun (e.g., he, she, they, it)."
    ],
    quiz: [
      { id: 'eq1', question: "In 'The fast dog ran quickly', what is 'ran'?", options: ["Noun", "Adjective", "Verb", "Adverb"], correctIndex: 2, hint: "Which word is the action?" },
      { id: 'eq2', question: "Which of these is an adjective?", options: ["Beautiful", "Quickly", "House", "Sing"], correctIndex: 0, hint: "It describes something." },
      { id: 'eq3', question: "'She went to the store.' What is 'She'?", options: ["Noun", "Pronoun", "Verb", "Adjective"], correctIndex: 1, hint: "It replaces a person's name." },
      { id: 'eq4', question: "What is the noun in: 'The brave knight slayed the dragon'?", options: ["brave", "slayed", "knight", "the"], correctIndex: 2, hint: "It names a person." }
    ]
  },
  {
    id: 'eng_2', subjectId: 'english', title: 'Punctuation Mastery', difficulty: 2, xpReward: 80, requiredXp: 100, timeMins: 6,
    notes: [
      "A period (.) ends a declarative sentence.",
      "A question mark (?) ends an interrogative sentence.",
      "An exclamation mark (!) shows strong emotion.",
      "A comma (,) separates items in a list or clauses.",
      "An apostrophe (') shows possession or contraction: John's, can't."
    ],
    quiz: [
      { id: 'eq5', question: "Which punctuation ends a question?", options: [".", "!", "?", ","], correctIndex: 2, hint: "It curves like a question." },
      { id: 'eq6', question: "What does an apostrophe in 'John's book' show?", options: ["Contraction", "Plural", "Possession", "Question"], correctIndex: 2, hint: "The book belongs to John." },
      { id: 'eq7', question: "Choose the correctly punctuated sentence:", options: ["I love dogs cats and birds", "I love dogs, cats, and birds", "I love, dogs cats and birds", "I love dogs cats, and birds"], correctIndex: 1, hint: "Items in a list need separators." }
    ]
  },
  {
    id: 'eng_3', subjectId: 'english', title: 'Reading Comprehension', difficulty: 3, xpReward: 120, requiredXp: 200, timeMins: 10,
    notes: [
      "The main idea is what a passage is mostly about.",
      "Supporting details give evidence for the main idea.",
      "Inference: Using clues in the text to figure out what isn't stated.",
      "Summarizing means retelling only the key points.",
      "Context clues help you understand unfamiliar words from surrounding text."
    ],
    quiz: [
      { id: 'eq8', question: "What is 'inference'?", options: ["Copying the text", "Making conclusions from clues", "Memorizing details", "Finding the main character"], correctIndex: 1, hint: "Reading between the lines!" },
      { id: 'eq9', question: "A summary should:", options: ["Include every detail", "Be longer than the original", "Capture only key points", "Be written as questions"], correctIndex: 2, hint: "Less is more!" },
      { id: 'eq10', question: "Context clues help you:", options: ["Spell words correctly", "Find the title", "Understand unfamiliar words", "Write dialogue"], correctIndex: 2, hint: "The surrounding text gives hints." }
    ]
  },

  // ======== SOCIAL STUDIES ========
  {
    id: 'soc_1', subjectId: 'social', title: 'World Continents', difficulty: 1, xpReward: 50, requiredXp: 0, timeMins: 5,
    notes: [
      "Earth has 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, South America.",
      "Asia is the largest continent. Australia is both a continent and a country.",
      "Antarctica is the coldest and is mostly covered in ice.",
      "Africa has the most countries (54) of any continent.",
      "The Americas are divided into North and South America."
    ],
    quiz: [
      { id: 'ssq1', question: "How many continents are on Earth?", options: ["5", "6", "7", "8"], correctIndex: 2, hint: "Seven!" },
      { id: 'ssq2', question: "Which is the largest continent?", options: ["Africa", "Europe", "Asia", "North America"], correctIndex: 2, hint: "It contains both India and China!" },
      { id: 'ssq3', question: "Which continent is also a country?", options: ["Africa", "Australia", "Europe", "Antarctica"], correctIndex: 1, hint: "Home of kangaroos and the Great Barrier Reef." }
    ]
  },
  {
    id: 'soc_2', subjectId: 'social', title: 'Ancient Egypt', difficulty: 2, xpReward: 90, requiredXp: 100, timeMins: 8,
    notes: [
      "Ancient Egypt was one of the world's earliest civilizations, lasting over 3,000 years.",
      "The Nile River was vital — it provided water and fertile soil for farming.",
      "Pharaohs were the god-kings who ruled Egypt.",
      "Pyramids were massive tombs built for pharaohs to reach the afterlife.",
      "Hieroglyphics were the writing system using pictures as symbols."
    ],
    quiz: [
      { id: 'ssq4', question: "Which river was central to ancient Egypt?", options: ["Amazon", "Nile", "Ganges", "Euphrates"], correctIndex: 1, hint: "It flows northward through Africa." },
      { id: 'ssq5', question: "What were pyramids used for?", options: ["Schools", "Markets", "Tombs for pharaohs", "Hospitals"], correctIndex: 2, hint: "Final resting places of kings." },
      { id: 'ssq6', question: "What was Egypt's writing system called?", options: ["Cuneiform", "Latin", "Hieroglyphics", "Sanskrit"], correctIndex: 2, hint: "Picture-based writing." }
    ]
  },
  {
    id: 'soc_3', subjectId: 'social', title: 'Map Skills', difficulty: 1, xpReward: 60, requiredXp: 0, timeMins: 6,
    notes: [
      "Maps use a legend/key to explain symbols.",
      "A compass rose shows North, South, East, and West.",
      "Latitude lines run horizontally (east-west). The Equator is 0° latitude.",
      "Longitude lines run vertically (north-south). The Prime Meridian is 0° longitude.",
      "Scale shows the real-world distance on the map."
    ],
    quiz: [
      { id: 'ssq7', question: "Which compass direction points up on a standard map?", options: ["South", "East", "West", "North"], correctIndex: 3, hint: "Standard maps have this at the top." },
      { id: 'ssq8', question: "What is the 0° latitude line called?", options: ["Prime Meridian", "Tropic of Cancer", "The Equator", "Arctic Circle"], correctIndex: 2, hint: "It divides Earth into North and South halves." },
      { id: 'ssq9', question: "What does a map legend (key) show?", options: ["The map's title", "What symbols on the map mean", "The date it was drawn", "The map scale"], correctIndex: 1, hint: "It decodes the map's special symbols." }
    ]
  },

  // ======== LOGIC ========
  {
    id: 'log_1', subjectId: 'logic', title: 'Patterns & Sequences', difficulty: 1, xpReward: 60, requiredXp: 0, timeMins: 5,
    notes: [
      "A pattern is a sequence that follows a rule.",
      "Arithmetic sequence: each term increases/decreases by the same number (e.g., 2,4,6,8).",
      "Geometric sequence: each term is multiplied by the same number (e.g., 2,4,8,16).",
      "Finding the rule helps you predict what comes next!",
      "Visual patterns use shapes, colors, or sizes repeating in order."
    ],
    quiz: [
      { id: 'lq1', question: "What comes next? 2, 4, 6, 8, __", options: ["9", "10", "12", "11"], correctIndex: 1, hint: "Add 2 each time." },
      { id: 'lq2', question: "What comes next? 3, 6, 12, 24, __", options: ["36", "48", "30", "26"], correctIndex: 1, hint: "Multiply by 2 each time." },
      { id: 'lq3', question: "Which best describes 5, 10, 15, 20, 25?", options: ["Subtract 5 each time", "Add 5 each time", "Multiply by 5", "Divide by 5"], correctIndex: 1, hint: "Skip counting by 5s!" }
    ]
  },
  {
    id: 'log_2', subjectId: 'logic', title: 'Critical Thinking', difficulty: 2, xpReward: 100, requiredXp: 150, timeMins: 8,
    notes: [
      "Critical thinking means analyzing information before accepting it.",
      "A fact is something that can be proven true.",
      "An opinion is someone's personal view and cannot be proven.",
      "Good arguments use evidence, not just feelings.",
      "Looking at a problem from different angles often reveals the best solution."
    ],
    quiz: [
      { id: 'lq4', question: "'The Eiffel Tower is in Paris.' Is this a fact or opinion?", options: ["Opinion", "Fact", "Both", "Neither"], correctIndex: 1, hint: "Can it be proven? Yes!" },
      { id: 'lq5', question: "'Pizza is the best food.' Is this a fact or opinion?", options: ["Fact", "Opinion", "Both", "Neither"], correctIndex: 1, hint: "Not everyone agrees!" },
      { id: 'lq6', question: "The best way to solve a hard problem is to:", options: ["Panic", "Give up", "Break it into smaller parts", "Guess randomly"], correctIndex: 2, hint: "Big problems = small steps." }
    ]
  },
  {
    id: 'log_3', subjectId: 'logic', title: 'Code & Algorithms', difficulty: 3, xpReward: 150, requiredXp: 300, timeMins: 10,
    notes: [
      "An algorithm is a step-by-step set of instructions to solve a problem.",
      "Computers follow algorithms — they don't think, they follow rules!",
      "Conditionals: If something is true, do this; otherwise, do that.",
      "Loops: Repeat an action multiple times (like a 'while' loop).",
      "Debugging means finding and fixing errors in your instructions."
    ],
    quiz: [
      { id: 'lq7', question: "What is an algorithm?", options: ["A type of math problem", "Step-by-step instructions to solve a task", "A programming language", "A computer chip"], correctIndex: 1, hint: "A recipe is an algorithm for cooking!" },
      { id: 'lq8', question: "A conditional says: 'IF it rains, THEN take an umbrella.' What triggers the action?", options: ["Always carry umbrella", "If it rains", "If you want", "Never go out"], correctIndex: 1, hint: "The IF part is the condition." },
      { id: 'lq9', question: "What does debugging mean in programming?", options: ["Adding more code", "Finding and fixing errors", "Deleting the program", "Running the code"], correctIndex: 1, hint: "Bugs are mistakes in the code." }
    ]
  },

  // ======== MIDDLE SCHOOL MATH ========
  {
    id: 'math_m1', subjectId: 'math_mid', title: 'Pre-Algebra Basics', difficulty: 2, xpReward: 80, requiredXp: 0, timeMins: 8,
    notes: ["Variables substitute unknown numbers.", "Isolate the variable to solve the equation."],
    quiz: [
      { id: 'mmq1', question: "Solve for x: 2x = 10", options: ["3", "4", "5", "6"], correctIndex: 2, hint: "Divide by 2." },
      { id: 'mmq2', question: "What is 3 + x = 7?", options: ["4", "5", "3", "2"], correctIndex: 0, hint: "Subtract 3." }
    ]
  },
  {
    id: 'math_m2', subjectId: 'math_mid', title: 'Area & Perimeter', difficulty: 2, xpReward: 80, requiredXp: 50, timeMins: 8,
    notes: ["Perimeter is distance around.", "Area is the space inside."],
    quiz: [
      { id: 'mmq3', question: "Perimeter of a square with side 4?", options: ["8", "12", "16", "20"], correctIndex: 2, hint: "4 x 4 sides." }
    ]
  },
  // ======== MIDDLE SCHOOL SCIENCE ========
  {
    id: 'sci_m1', subjectId: 'science_mid', title: 'Ecosystems & Energy', difficulty: 2, xpReward: 80, requiredXp: 0, timeMins: 8,
    notes: ["Food webs show energy transfer.", "Producers are at the bottom of the food web."],
    quiz: [
      { id: 'msq1', question: "Which organism is a producer?", options: ["Lion", "Grass", "Hawk", "Human"], correctIndex: 1, hint: "Makes its own food." }
    ]
  },
  {
    id: 'sci_m2', subjectId: 'science_mid', title: 'Human Biology', difficulty: 2, xpReward: 90, requiredXp: 50, timeMins: 8,
    notes: ["Circulatory system pumps blood.", "Respiratory system handles oxygen."],
    quiz: [
      { id: 'msq2', question: "Which system includes the lungs?", options: ["Digestive", "Nervous", "Circulatory", "Respiratory"], correctIndex: 3, hint: "Breathing system." }
    ]
  },
  // ======== MIDDLE SCHOOL ENGLISH ========
  {
    id: 'eng_m1', subjectId: 'english_mid', title: 'Advanced Grammar', difficulty: 2, xpReward: 80, requiredXp: 0, timeMins: 8,
    notes: ["A dependent clause cannot stand alone.", "Conjunctions connect clauses."],
    quiz: [
      { id: 'meq1', question: "Which word is a conjunction?", options: ["And", "Run", "Quickly", "Happy"], correctIndex: 0, hint: "It connects words." }
    ]
  },
  {
    id: 'eng_m2', subjectId: 'english_mid', title: 'Literature Analysis', difficulty: 3, xpReward: 100, requiredXp: 50, timeMins: 10,
    notes: ["Theme is the main message.", "Conflict drives the plot."],
    quiz: [
      { id: 'meq2', question: "What is the main message of a story called?", options: ["Plot", "Setting", "Theme", "Conflict"], correctIndex: 2, hint: "The moral or lesson." }
    ]
  },
  // ======== MIDDLE SCHOOL SOCIAL STUDIES ========
  {
    id: 'soc_m1', subjectId: 'social_mid', title: 'Ancient Civilizations', difficulty: 2, xpReward: 85, requiredXp: 0, timeMins: 8,
    notes: ["Mesopotamia is the cradle of civilization.", "Greece birthed democracy."],
    quiz: [
      { id: 'mss1', question: "Where did democracy originate?", options: ["Egypt", "Rome", "Greece", "China"], correctIndex: 2, hint: "Athens is its capital." }
    ]
  },
  {
    id: 'soc_m2', subjectId: 'social_mid', title: 'World Geography', difficulty: 2, xpReward: 85, requiredXp: 50, timeMins: 8,
    notes: ["Equator divides Earth into Northern and Southern hemispheres."],
    quiz: [
      { id: 'mss2', question: "Which line divides Earth into N/S hemispheres?", options: ["Prime Meridian", "Equator", "Tropic of Cancer", "Tropic of Capricorn"], correctIndex: 1, hint: "0 degrees latitude." }
    ]
  },
  // ======== MIDDLE SCHOOL LOGIC & CODING ========
  {
    id: 'log_m1', subjectId: 'logic_mid', title: 'Intro to Python', difficulty: 2, xpReward: 90, requiredXp: 0, timeMins: 8,
    notes: ["Variables store data.", "Print() outputs text."],
    quiz: [
      { id: 'mcq1', question: "Which command outputs text in Python?", options: ["echo()", "write()", "print()", "log()"], correctIndex: 2, hint: "Like printing on paper." }
    ]
  },
  {
    id: 'log_m2', subjectId: 'logic_mid', title: 'Loops & Logic', difficulty: 3, xpReward: 100, requiredXp: 50, timeMins: 10,
    notes: ["A 'for' loop repeats a specific number of times.", "A 'while' loop repeats until a condition is met."],
    quiz: [
      { id: 'mcq2', question: "Which loop repeats while a condition is true?", options: ["for loop", "while loop", "if loop", "do loop"], correctIndex: 1, hint: "Name is in the question." }
    ]
  },

  // ======== HIGH SCHOOL MATH ========
  {
    id: 'math_h1', subjectId: 'math_high', title: 'Algebra', difficulty: 2, xpReward: 100, requiredXp: 0, timeMins: 10,
    notes: [
      "Algebra uses letters (variables) to represent numbers.",
      "An equation states that two expressions are equal.",
      "Linear equations form a straight line when graphed."
    ],
    quiz: [
      { id: 'mhq1', question: "What is x if x + 5 = 12?", options: ["5", "6", "7", "8"], correctIndex: 2, hint: "Subtract 5 from 12." },
      { id: 'mhq1b', question: "Simplify the expression: 2x + 3x", options: ["5", "5x", "x^5", "6x"], correctIndex: 1, hint: "Add the coefficients." },
      { id: 'mhq1c', question: "What represents the unknown value in algebra?", options: ["Constant", "Variable", "Operator", "Exponent"], correctIndex: 1, hint: "Usually a letter like x or y." }
    ]
  },
  {
    id: 'math_h2', subjectId: 'math_high', title: 'Geometry', difficulty: 2, xpReward: 100, requiredXp: 50, timeMins: 10,
    notes: [
      "Geometry focuses on properties of space and figures.",
      "The sum of interior angles in a triangle is 180°.",
      "Pythagorean theorem applies to right-angled triangles."
    ],
    quiz: [
      { id: 'mhq2', question: "What is the area of a rectangle with length 6 and width 4?", options: ["24", "10", "20", "12"], correctIndex: 0, hint: "Length x Width." },
      { id: 'mhq2b', question: "In a right triangle, what is the longest side called?", options: ["Adjacent", "Opposite", "Hypotenuse", "Base"], correctIndex: 2, hint: "It's completely opposite to the 90 degree angle." },
      { id: 'mhq2c', question: "If two angles of a triangle are 50° and 60°, what is the third?", options: ["60°", "70°", "80°", "90°"], correctIndex: 1, hint: "All three must add to 180." }
    ]
  },
  {
    id: 'math_h3', subjectId: 'math_high', title: 'Trigonometry', difficulty: 3, xpReward: 150, requiredXp: 100, timeMins: 10,
    notes: [
      "Trigonometry studies relationships involving lengths and angles of triangles.",
      "SOH CAH TOA is a mnemonic for Sine, Cosine, and Tangent.",
      "Sine is Opposite / Hypotenuse."
    ],
    quiz: [
      { id: 'mhq3', question: "What does Sine represent in a right triangle?", options: ["Opposite / Hypotenuse", "Adjacent / Hypotenuse", "Opposite / Adjacent", "Adjacent / Opposite"], correctIndex: 0, hint: "Remember SOH." },
      { id: 'mhq3b', question: "What is the Tangent of an angle?", options: ["Opposite / Hypotenuse", "Adjacent / Hypotenuse", "Opposite / Adjacent", "Hypotenuse / Opposite"], correctIndex: 2, hint: "Remember TOA." },
      { id: 'mhq3c', question: "What is the inverse ratio of Cosine?", options: ["Secant", "Cosecant", "Cotangent", "Sine"], correctIndex: 0, hint: "Starts with Sec." }
    ]
  },

  // ======== PHYSICS ========
  {
    id: 'phy_1', subjectId: 'physics', title: 'Motion', difficulty: 2, xpReward: 100, requiredXp: 0, timeMins: 10,
    notes: [
      "Motion is measured by displacement, velocity, and acceleration.",
      "Velocity is speed with a direction.",
      "Acceleration is the rate of change of velocity."
    ],
    quiz: [
      { id: 'pq1', question: "What is Velocity?", options: ["Speed without direction", "Speed with a direction", "Rate of change of acceleration", "Force x Distance"], correctIndex: 1, hint: "It's a vector quantity." },
      { id: 'pq1b', question: "What unit is typically used for acceleration?", options: ["m/s", "N", "m/s²", "J"], correctIndex: 2, hint: "Meters per second squared." },
      { id: 'pq1c', question: "If a car travels 100 meters in 10 seconds, what is its average speed?", options: ["5 m/s", "10 m/s", "20 m/s", "100 m/s"], correctIndex: 1, hint: "Distance divided by time." }
    ]
  },
  {
    id: 'phy_2', subjectId: 'physics', title: 'Forces', difficulty: 2, xpReward: 100, requiredXp: 50, timeMins: 10,
    notes: [
      "A force is a push or pull that can cause an object to accelerate.",
      "Newton's First Law: An object at rest stays at rest unless acted upon.",
      "Friction opposes motion between surfaces relative to each other."
    ],
    quiz: [
      { id: 'pq2', question: "What is Newton's Second Law statement?", options: ["Action equals reaction", "Force = mass × acceleration", "Energy cannot be destroyed", "Mass is conserved"], correctIndex: 1, hint: "F = ma." },
      { id: 'pq2b', question: "Which force pulls objects toward the center of the Earth?", options: ["Friction", "Magnetism", "Gravity", "Tension"], correctIndex: 2, hint: "It keeps us on the ground." },
      { id: 'pq2c', question: "What force opposes the sliding motion of two surfaces?", options: ["Inertia", "Gravity", "Friction", "Normal Force"], correctIndex: 2, hint: "It causes heat when you rub hands together." }
    ]
  },
  {
    id: 'phy_3', subjectId: 'physics', title: 'Electromagnetism', difficulty: 3, xpReward: 150, requiredXp: 100, timeMins: 10,
    notes: [
      "Moving electric charges create magnetic fields.",
      "A changing magnetic field can induce an electric current.",
      "Voltage is the electrical potential difference."
    ],
    quiz: [
      { id: 'pq3', question: "What particles flow to create an electric current?", options: ["Protons", "Neutrons", "Electrons", "Atoms"], correctIndex: 2, hint: "Negatively charged particles." },
      { id: 'pq3b', question: "What device turns mechanical energy into electrical energy?", options: ["Motor", "Generator", "Resistor", "Capacitor"], correctIndex: 1, hint: "It 'generates' electricity." },
      { id: 'pq3c', question: "Like magnetic poles will...", options: ["Attract", "Repel", "Cancel out", "Do nothing"], correctIndex: 1, hint: "North pushes away North." }
    ]
  },

  // ======== CHEMISTRY ========
  {
    id: 'chem_1', subjectId: 'chemistry', title: 'Matter', difficulty: 2, xpReward: 100, requiredXp: 0, timeMins: 10,
    notes: [
      "Matter is anything that has mass and takes up space.",
      "Atoms are the fundamental building blocks of matter.",
      "Protons and neutrons are in the nucleus; electrons orbit around it."
    ],
    quiz: [
      { id: 'cq1', question: "What charge does a neutron have?", options: ["Positive", "Negative", "Neutral", "Variable"], correctIndex: 2, hint: "It's built into the name." },
      { id: 'cq1b', question: "What is the center of an atom called?", options: ["Orbit", "Nucleus", "Core", "Cell"], correctIndex: 1, hint: "Similar to a biological cell's center." },
      { id: 'cq1c', question: "Which particles determine the element's atomic number?", options: ["Neutrons", "Electrons", "Protons", "Quarks"], correctIndex: 2, hint: "They are positively charged." }
    ]
  },
  {
    id: 'chem_2', subjectId: 'chemistry', title: 'Reactions', difficulty: 2, xpReward: 100, requiredXp: 50, timeMins: 10,
    notes: [
      "A chemical reaction rearranges atoms to form new substances.",
      "Exothermic reactions release heat.",
      "Catalysts lower the activation energy required for a reaction."
    ],
    quiz: [
      { id: 'cq2', question: "In a reaction equation, what are the starting materials called?", options: ["Products", "Reactants", "Catalysts", "Enzymes"], correctIndex: 1, hint: "They react together." },
      { id: 'cq2b', question: "A reaction that absorbs energy/heat is called...", options: ["Exothermic", "Endothermic", "Combustion", "Decomposition"], correctIndex: 1, hint: "Endo = internal/into." },
      { id: 'cq2c', question: "What speeds up a chemical reaction without being consumed?", options: ["Reactant", "Product", "Inhibitor", "Catalyst"], correctIndex: 3, hint: "It 'catalyzes' the change." }
    ]
  },
  {
    id: 'chem_3', subjectId: 'chemistry', title: 'Periodic Table', difficulty: 3, xpReward: 150, requiredXp: 100, timeMins: 10,
    notes: [
      "The periodic table arranges elements by atomic number.",
      "Vertical columns are called Groups or Families.",
      "Noble gases found on the far right are unreactive."
    ],
    quiz: [
      { id: 'cq3', question: "What element has the chemical symbol 'O'?", options: ["Osmium", "Oxygen", "Oganesson", "Gold"], correctIndex: 1, hint: "We breathe it." },
      { id: 'cq3b', question: "What are the horizontal rows on the periodic table called?", options: ["Groups", "Families", "Periods", "Blocks"], correctIndex: 2, hint: "Hence the name 'Periodic' Table." },
      { id: 'cq3c', question: "Which group contains the highly unreactive noble gases?", options: ["Group 1", "Group 2", "Group 17", "Group 18"], correctIndex: 3, hint: "The far right column." }
    ]
  },

  // ======== BIOLOGY ========
  {
    id: 'bio_1', subjectId: 'biology', title: 'Cells', difficulty: 2, xpReward: 100, requiredXp: 0, timeMins: 10,
    notes: [
      "Cells are the basic structural, functional, and biological units of all known organisms.",
      "Plant cells have a rigid cell wall; animal cells do not.",
      "Mitochondria generate most of the cell's supply of ATP."
    ],
    quiz: [
      { id: 'bq1', question: "What is the 'powerhouse' of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Cell Wall"], correctIndex: 2, hint: "It produces ATP." },
      { id: 'bq1b', question: "What structure is unique to plant cells compared to animal cells?", options: ["Nucleus", "Cell Wall", "Cell Membrane", "Cytoplasm"], correctIndex: 1, hint: "It makes plants rigid." },
      { id: 'bq1c', question: "Where is the genetic material (DNA) housed in a eukaryotic cell?", options: ["Nucleus", "Vacuole", "Ribosome", "Golgi"], correctIndex: 0, hint: "The 'brain' or control center of the cell." }
    ]
  },
  {
    id: 'bio_2', subjectId: 'biology', title: 'Human Body', difficulty: 2, xpReward: 100, requiredXp: 50, timeMins: 10,
    notes: [
      "The human body's circulatory system transports blood and oxygen.",
      "The nervous system transmits signals between different body parts.",
      "White blood cells help fight off infections."
    ],
    quiz: [
      { id: 'bq2', question: "Which organ pumps blood throughout the body?", options: ["Lungs", "Brain", "Liver", "Heart"], correctIndex: 3, hint: "It beats continuously." },
      { id: 'bq2b', question: "What type of blood cells fight infection?", options: ["Red Blood Cells", "White Blood Cells", "Platelets", "Plasma"], correctIndex: 1, hint: "They are the 'immune' defenders." },
      { id: 'bq2c', question: "What system controls and coordinates body activities?", options: ["Digestive", "Circulatory", "Nervous", "Skeletal"], correctIndex: 2, hint: "It includes the brain and spinal cord." }
    ]
  },
  {
    id: 'bio_3', subjectId: 'biology', title: 'Ecosystems', difficulty: 3, xpReward: 150, requiredXp: 100, timeMins: 10,
    notes: [
      "An ecosystem is a geographic area where plants, animals, and other organisms interact.",
      "Producers make their own food; consumers eat. ",
      "Biodiversity refers to the variety of life in a habitat."
    ],
    quiz: [
      { id: 'bq3', question: "What do herbivores primarily consume?", options: ["Meat", "Plants", "Both", "Insects"], correctIndex: 1, hint: "Herb = plant." },
      { id: 'bq3b', question: "What process do producers use to make food from sunlight?", options: ["Respiration", "Digestion", "Photosynthesis", "Fermentation"], correctIndex: 2, hint: "Synthesizing with light." },
      { id: 'bq3c', question: "What type of organism breaks down dead organic material?", options: ["Producer", "Primary Consumer", "Decomposer", "Apex Predator"], correctIndex: 2, hint: "Fungi and bacteria play this role." }
    ]
  },

  // ======== COMPUTER SCIENCE ========
  {
    id: 'cs_1', subjectId: 'computer', title: 'Coding Basics', difficulty: 2, xpReward: 100, requiredXp: 0, timeMins: 10,
    notes: [
      "A variable stores a data value.",
      "Functions are reusable blocks of code.",
      "If-statements allow for conditional execution."
    ],
    quiz: [
      { id: 'csq1', question: "What is used to store data values in programming?", options: ["Function", "Variable", "Loop", "Syntax"], correctIndex: 1, hint: "It can 'vary'." },
      { id: 'csq1b', question: "Which concept allows a block of code to repeat multiple times?", options: ["Variables", "Conditionals", "Loops", "Classes"], correctIndex: 2, hint: "It goes around and around." },
      { id: 'csq1c', question: "Which of these is a popular programming language?", options: ["Python", "Cobra", "Viper", "Anaconda"], correctIndex: 0, hint: "A type of snake." }
    ]
  },
  {
    id: 'cs_2', subjectId: 'computer', title: 'Data Structures', difficulty: 3, xpReward: 150, requiredXp: 50, timeMins: 10,
    notes: [
      "An Array stores items sequentially.",
      "A Stack follows Last-In, First-Out (LIFO).",
      "A Queue follows First-In, First-Out (FIFO)."
    ],
    quiz: [
      { id: 'csq2', question: "Which data structure operates on a 'First-In, First-Out' (FIFO) basis?", options: ["Stack", "Queue", "Tree", "Graph"], correctIndex: 1, hint: "Like a line at a store." },
      { id: 'csq2b', question: "Which data structure operates on a 'Last-In, First-Out' (LIFO) basis?", options: ["Array", "Queue", "Stack", "List"], correctIndex: 2, hint: "Like a stack of plates." },
      { id: 'csq2c', question: "What structure stores elements sequentially in memory?", options: ["Graph", "Array", "Tree", "Hash Map"], correctIndex: 1, hint: "A basic contiguous list." }
    ]
  },
  {
    id: 'cs_3', subjectId: 'computer', title: 'AI', difficulty: 3, xpReward: 150, requiredXp: 100, timeMins: 10,
    notes: [
      "Artificial Intelligence allows machines to learn from data.",
      "Machine learning focuses on predictive algorithms.",
      "Neural networks loosely mimic the human brain."
    ],
    quiz: [
      { id: 'csq3', question: "What does AI stand for?", options: ["Automated Internet", "Artificial Intelligence", "Advanced Integration", "Active Interface"], correctIndex: 1, hint: "Simulated human smarts." },
      { id: 'csq3b', question: "What subfield of AI enables models to learn from large amounts of data without explicit programming?", options: ["Web Dev", "Machine Learning", "Cloud Computing", "Cybersecurity"], correctIndex: 1, hint: "The machine 'learns'." },
      { id: 'csq3c', question: "What AI structure is designed to mimic neurons in the human brain?", options: ["Decision Tree", "Neural Network", "Hash Array", "Linked List"], correctIndex: 1, hint: "Network of neurons." }
    ]
  }
];

// ======== TOPICS PER SUBJECT ========
export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  icon: string;
}

export const TOPICS: Topic[] = [
  { id: 'math_fractions', subjectId: 'math', title: 'Fractions', icon: '🍕' },
  { id: 'math_geometry', subjectId: 'math', title: 'Geometry', icon: '📐' },
  { id: 'math_algebra', subjectId: 'math', title: 'Algebra Basics', icon: '🔣' },
  { id: 'math_tables', subjectId: 'math', title: 'Times Tables', icon: '✖️' },
  { id: 'sci_solar', subjectId: 'science', title: 'Solar System', icon: '🌍' },
  { id: 'sci_matter', subjectId: 'science', title: 'States of Matter', icon: '🧊' },
  { id: 'sci_food', subjectId: 'science', title: 'Food Chains', icon: '🦊' },
  { id: 'sci_plants', subjectId: 'science', title: 'Plant Biology', icon: '🌱' },
  { id: 'eng_speech', subjectId: 'english', title: 'Parts of Speech', icon: '📖' },
  { id: 'eng_punct', subjectId: 'english', title: 'Punctuation', icon: '❓' },
  { id: 'eng_reading', subjectId: 'english', title: 'Reading Skills', icon: '📚' },
  { id: 'soc_continents', subjectId: 'social', title: 'Continents', icon: '🗺️' },
  { id: 'soc_egypt', subjectId: 'social', title: 'Ancient Egypt', icon: '🏛️' },
  { id: 'soc_maps', subjectId: 'social', title: 'Map Skills', icon: '🧭' },
  { id: 'log_patterns', subjectId: 'logic', title: 'Patterns', icon: '🔢' },
  { id: 'log_critical', subjectId: 'logic', title: 'Critical Thinking', icon: '🧠' },
  { id: 'log_code', subjectId: 'logic', title: 'Code & Algorithms', icon: '💻' },
  
  // Middle School Topics
  { id: 'math_prealg', subjectId: 'math_mid', title: 'Pre-Algebra', icon: '✖️' },
  { id: 'math_areaperim', subjectId: 'math_mid', title: 'Area & Perimeter', icon: '📏' },
  { id: 'sci_ecosys', subjectId: 'science_mid', title: 'Ecosystems', icon: '🌲' },
  { id: 'sci_human', subjectId: 'science_mid', title: 'Human Biology', icon: '🦴' },
  { id: 'eng_grammar', subjectId: 'english_mid', title: 'Adv. Grammar', icon: '✨' },
  { id: 'eng_lit', subjectId: 'english_mid', title: 'Literature', icon: '📚' },
  { id: 'soc_ancient', subjectId: 'social_mid', title: 'Ancient Civ', icon: '🏛️' },
  { id: 'soc_geog', subjectId: 'social_mid', title: 'World Geography', icon: '🗺️' },
  { id: 'log_intro', subjectId: 'logic_mid', title: 'Python Basics', icon: '🐍' },
  { id: 'log_loops', subjectId: 'logic_mid', title: 'Loops & Logic', icon: '🔄' },

  // High School Topics
  { id: 'math_algebra', subjectId: 'math_high', title: 'Algebra', icon: '➗' },
  { id: 'math_hgeometry', subjectId: 'math_high', title: 'Geometry', icon: '📐' },
  { id: 'math_trig', subjectId: 'math_high', title: 'Trigonometry', icon: '🔺' },
  
  { id: 'phy_motion', subjectId: 'physics', title: 'Motion', icon: '🏃' },
  { id: 'phy_forces', subjectId: 'physics', title: 'Forces', icon: '🧲' },
  { id: 'phy_electro', subjectId: 'physics', title: 'Electromagnetism', icon: '⚡' },

  { id: 'chem_matter', subjectId: 'chemistry', title: 'Matter', icon: '🪨' },
  { id: 'chem_reaction', subjectId: 'chemistry', title: 'Reactions', icon: '🔥' },
  { id: 'chem_periodic', subjectId: 'chemistry', title: 'Periodic Table', icon: '🧪' },

  { id: 'bio_cells', subjectId: 'biology', title: 'Cells', icon: '🔬' },
  { id: 'bio_human', subjectId: 'biology', title: 'Human Body', icon: '🫀' },
  { id: 'bio_eco', subjectId: 'biology', title: 'Ecosystems', icon: '🌿' },

  { id: 'cs_basics', subjectId: 'computer', title: 'Coding Basics', icon: '⌨️' },
  { id: 'cs_data', subjectId: 'computer', title: 'Data Structures', icon: '🧱' },
  { id: 'cs_ai', subjectId: 'computer', title: 'AI', icon: '🤖' },
];

// ======== EQUIPMENT / CUSTOMIZATION ========
export interface Equipment {
  id: string;
  name: string;
  theme: 'ocean' | 'space' | 'future';
  category: 'outfit' | 'vehicle' | 'accessory';
  requiredXp: number;
  emoji: string;
}

export const EQUIPMENT: Equipment[] = [
  // Ocean theme
  { id: 'o_outfit1', name: 'Pirate Coat', theme: 'ocean', category: 'outfit', requiredXp: 0, emoji: '🏴‍☠️' },
  { id: 'o_outfit2', name: 'Captain Hat', theme: 'ocean', category: 'outfit', requiredXp: 300, emoji: '🎩' },
  { id: 'o_outfit3', name: 'Royal Cape', theme: 'ocean', category: 'outfit', requiredXp: 1000, emoji: '👑' },
  { id: 'o_vehicle1', name: 'Wooden Boat', theme: 'ocean', category: 'vehicle', requiredXp: 0, emoji: '🚣' },
  { id: 'o_vehicle2', name: 'Treasure Ship', theme: 'ocean', category: 'vehicle', requiredXp: 500, emoji: '⛵' },
  { id: 'o_vehicle3', name: 'Pirate Galleon', theme: 'ocean', category: 'vehicle', requiredXp: 2000, emoji: '🏴‍☠️' },
  { id: 'o_acc1', name: 'Treasure Map', theme: 'ocean', category: 'accessory', requiredXp: 0, emoji: '🗺️' },
  { id: 'o_acc2', name: 'Spyglass', theme: 'ocean', category: 'accessory', requiredXp: 400, emoji: '🔭' },
  { id: 'o_acc3', name: 'Golden Compass', theme: 'ocean', category: 'accessory', requiredXp: 1500, emoji: '🧭' },
  // Space theme
  { id: 's_outfit1', name: 'Space Suit', theme: 'space', category: 'outfit', requiredXp: 0, emoji: '🧑‍🚀' },
  { id: 's_outfit2', name: 'Galaxy Armor', theme: 'space', category: 'outfit', requiredXp: 300, emoji: '🛡️' },
  { id: 's_outfit3', name: 'Cosmic Cloak', theme: 'space', category: 'outfit', requiredXp: 1000, emoji: '✨' },
  { id: 's_vehicle1', name: 'Shuttle Pod', theme: 'space', category: 'vehicle', requiredXp: 0, emoji: '🚀' },
  { id: 's_vehicle2', name: 'Star Cruiser', theme: 'space', category: 'vehicle', requiredXp: 500, emoji: '🛸' },
  { id: 's_vehicle3', name: 'Galaxy Warship', theme: 'space', category: 'vehicle', requiredXp: 2000, emoji: '🌟' },
  { id: 's_acc1', name: 'Jetpack', theme: 'space', category: 'accessory', requiredXp: 0, emoji: '🎒' },
  { id: 's_acc2', name: 'Space Helmet', theme: 'space', category: 'accessory', requiredXp: 400, emoji: '⛑️' },
  { id: 's_acc3', name: 'Star Blaster', theme: 'space', category: 'accessory', requiredXp: 1500, emoji: '🔫' },
  // Future theme
  { id: 'f_outfit1', name: 'Tech Suit', theme: 'future', category: 'outfit', requiredXp: 0, emoji: '🦾' },
  { id: 'f_outfit2', name: 'Holo Armor', theme: 'future', category: 'outfit', requiredXp: 300, emoji: '💠' },
  { id: 'f_outfit3', name: 'Neural Cloak', theme: 'future', category: 'outfit', requiredXp: 1000, emoji: '🧬' },
  { id: 'f_vehicle1', name: 'Hover Board', theme: 'future', category: 'vehicle', requiredXp: 0, emoji: '🛹' },
  { id: 'f_vehicle2', name: 'Energy Glider', theme: 'future', category: 'vehicle', requiredXp: 500, emoji: '⚡' },
  { id: 'f_vehicle3', name: 'Quantum Jet', theme: 'future', category: 'vehicle', requiredXp: 2000, emoji: '🌀' },
  { id: 'f_acc1', name: 'Data Visor', theme: 'future', category: 'accessory', requiredXp: 0, emoji: '🥽' },
  { id: 'f_acc2', name: 'Neural Helmet', theme: 'future', category: 'accessory', requiredXp: 400, emoji: '🪖' },
  { id: 'f_acc3', name: 'Mind Link', theme: 'future', category: 'accessory', requiredXp: 1500, emoji: '🔮' },
];

// ======== VIDEO TIMESTAMPS FOR SMART FEEDBACK ========
export interface VideoTimestamp {
  questionId: string;
  startTime: string;   // "MM:SS"
  endTime: string;     // "MM:SS"
  label: string;
  /** YouTube video ID — used to build the watch link */
  videoId?: string;
}

// Scratch Garden – "Fractions! | Mini Math Movies" (362JVVvgYPE)
// Timestamps are mapped to question IDs in the mathFractions bank (mf1-mf12)
const FRACTIONS_VIDEO = '362JVVvgYPE';
// Missing parts of speech video
const PARTS_OF_SPEECH_VIDEO = '_PqkZDSnZFM';

export const VIDEO_TIMESTAMPS: VideoTimestamp[] = [
  // ── Fractions Intro (math_1) – all tied to the Scratch Garden video ──────
  { questionId: 'mf1',  startTime: '00:30', endTime: '01:10', label: 'What is a Numerator?',              videoId: FRACTIONS_VIDEO },
  { questionId: 'mq1',  startTime: '00:30', endTime: '01:10', label: 'What is a Numerator?',              videoId: FRACTIONS_VIDEO },
  { questionId: 'mf2',  startTime: '00:50', endTime: '01:30', label: 'Parts of a Whole (pizza example)', videoId: FRACTIONS_VIDEO },
  { questionId: 'mq2',  startTime: '00:50', endTime: '01:30', label: 'Parts of a Whole (pizza example)', videoId: FRACTIONS_VIDEO },
  { questionId: 'mf3',  startTime: '02:40', endTime: '03:20', label: 'Equivalent Fractions',              videoId: FRACTIONS_VIDEO },
  { questionId: 'mq4',  startTime: '02:40', endTime: '03:20', label: 'Equivalent Fractions',              videoId: FRACTIONS_VIDEO },
  { questionId: 'mf4',  startTime: '00:45', endTime: '01:15', label: 'What is a Denominator?',            videoId: FRACTIONS_VIDEO },
  { questionId: 'mf5',  startTime: '01:45', endTime: '02:25', label: 'Comparing Fractions',               videoId: FRACTIONS_VIDEO },
  { questionId: 'mq3',  startTime: '01:45', endTime: '02:25', label: 'Comparing Fractions',               videoId: FRACTIONS_VIDEO },
  { questionId: 'mf6',  startTime: '02:50', endTime: '03:30', label: 'Simplifying Fractions',             videoId: FRACTIONS_VIDEO },
  { questionId: 'mf7',  startTime: '00:55', endTime: '01:35', label: 'Fractions of a Pizza',              videoId: FRACTIONS_VIDEO },
  { questionId: 'mf8',  startTime: '01:50', endTime: '02:30', label: 'Ordering Fractions',                videoId: FRACTIONS_VIDEO },
  { questionId: 'mf9',  startTime: '03:10', endTime: '03:50', label: 'Fractions as Decimals',             videoId: FRACTIONS_VIDEO },
  { questionId: 'mf10', startTime: '02:45', endTime: '03:25', label: 'Equivalent Fractions – Deep Dive',  videoId: FRACTIONS_VIDEO },
  { questionId: 'mf11', startTime: '03:20', endTime: '04:00', label: 'Fraction of a Number',              videoId: FRACTIONS_VIDEO },
  { questionId: 'mf12', startTime: '02:50', endTime: '03:30', label: 'Simplifying: 2/4 = 1/2',           videoId: FRACTIONS_VIDEO },

  // ── Parts of Speech (eng_1) ──────
  { questionId: 'eq1', startTime: '01:00', endTime: '01:45', label: 'Verbs explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'ep1', startTime: '01:00', endTime: '01:45', label: 'Verbs explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'eq2', startTime: '01:50', endTime: '02:30', label: 'Adjectives explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'ep2', startTime: '01:50', endTime: '02:30', label: 'Adjectives explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'eq3', startTime: '02:30', endTime: '03:10', label: 'Pronouns explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'ep3', startTime: '02:30', endTime: '03:10', label: 'Pronouns explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'eq4', startTime: '00:30', endTime: '01:00', label: 'Nouns explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'ep4', startTime: '00:30', endTime: '01:00', label: 'Nouns explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'ep5', startTime: '00:30', endTime: '03:10', label: 'Parts of Speech overview', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'ep6', startTime: '02:30', endTime: '03:10', label: 'Pronouns explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'ep7', startTime: '03:15', endTime: '03:45', label: 'Adverbs explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'ep8', startTime: '01:00', endTime: '01:45', label: 'Verbs explained', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'ep9', startTime: '04:00', endTime: '04:30', label: 'Sentence structure', videoId: PARTS_OF_SPEECH_VIDEO },
  { questionId: 'ep10', startTime: '03:15', endTime: '03:45', label: 'Adverbs explained', videoId: PARTS_OF_SPEECH_VIDEO },

  // ── Legacy question IDs from old quizzes (kept for compatibility) ─────────
  { questionId: 'mq5', startTime: '00:45', endTime: '01:30', label: 'Polygon sides' },
  { questionId: 'mq6', startTime: '01:35', endTime: '02:10', label: 'What is a polygon' },
  { questionId: 'mq7', startTime: '02:30', endTime: '03:15', label: 'Triangle angles' },
  { questionId: 'mq8', startTime: '03:20', endTime: '04:00', label: 'Types of quadrilaterals' },
  { questionId: 'sq1', startTime: '00:30', endTime: '01:20', label: 'Inner planets' },
  { questionId: 'sq2', startTime: '01:30', endTime: '02:15', label: 'Gas giants' },
  { questionId: 'sq3', startTime: '02:20', endTime: '03:00', label: "Saturn's rings" },
  { questionId: 'sq4', startTime: '03:10', endTime: '03:50', label: 'Number of planets' },
  { questionId: 'lq1', startTime: '00:30', endTime: '01:15', label: 'Arithmetic sequences' },
  { questionId: 'lq7', startTime: '00:20', endTime: '01:00', label: 'What is an algorithm' },
];

// ======== FOCUS ISSUES ========
export const FOCUS_ISSUES = [
  { id: 'distracted', label: 'I get distracted easily', emoji: '📱' },
  { id: 'bored', label: 'I get bored quickly', emoji: '😴' },
  { id: 'hard', label: "I don't understand topics", emoji: '🤯' },
  { id: 'motivation', label: 'I lose motivation', emoji: '😔' },
  { id: 'improve', label: 'I want to improve focus', emoji: '🎯' },
];

// ======== THEME MAP LABELS ========
export const THEME_MAP_CONFIG = {
  ocean: {
    mapTitle: '🗺️ Treasure Seas Map',
    subjectLabels: { math: 'Math Island', science: 'Science Reef', english: 'Language Lagoon', social: 'History Harbor', logic: 'Logic Bay' },
  },
  space: {
    mapTitle: '🌌 Galaxy Map',
    subjectLabels: { math: 'Math Planet', science: 'Science Galaxy', english: 'Knowledge Station', social: 'History Nebula', logic: 'Logic Nebula' },
  },
  future: {
    mapTitle: '⚡ Cyber Grid Map',
    subjectLabels: { math: 'Logic Grid', science: 'Science Lab', english: 'Data Arena', social: 'Knowledge Vault', logic: 'Mastery Core' },
  },
};

export function getGradeTheme(grade: number): 'ocean' | 'space' | 'future' {
  if (grade <= 4) return 'ocean';
  if (grade <= 7) return 'space';
  return 'future';
}

export function getMascotThemeProps(theme: 'ocean' | 'space' | 'future') {
  switch(theme) {
    case 'ocean': return { emoji: '🦜', name: 'Captain Beak' };
    case 'space': return { emoji: '🤖', name: 'AstroBot' };
    case 'future': return { emoji: '🧠', name: 'Cortex.AI' };
  }
}
