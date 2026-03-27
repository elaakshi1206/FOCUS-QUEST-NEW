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

export const SUBJECTS: Subject[] = [
  { id: 'math', title: 'Mathematics', icon: '🔢', color: 'from-blue-400 to-blue-600', description: 'Master numbers and shapes!' },
  { id: 'science', title: 'Science', icon: '🔬', color: 'from-green-400 to-green-600', description: 'Discover how the universe works.' },
  { id: 'english', title: 'English', icon: '📚', color: 'from-purple-400 to-purple-600', description: 'The power of words and stories.' },
  { id: 'social', title: 'Social Studies', icon: '🌍', color: 'from-orange-400 to-orange-600', description: 'Explore history and geography.' },
  { id: 'logic', title: 'Logical Thinking', icon: '🧩', color: 'from-pink-400 to-pink-600', description: 'Solve puzzles and think critically.' }
];

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
