export const getFallbackQuestions = (world: string, count: number) => {
  const oceanQuestions = [
    { questionText: "If Captain Bluebeard finds 5 gold coins and adds them to his chest of 7 gold coins, how many does he have?", options: ["10", "11", "12", "15"], correctAnswer: "12", topic: "Math", difficulty: "Easy" },
    { questionText: "Which of these animals lives in the ocean?", options: ["Lion", "Octopus", "Giraffe", "Elephant"], correctAnswer: "Octopus", topic: "Science", difficulty: "Easy" },
    { questionText: "Choose the correct spelling:", options: ["Tressure", "Treasure", "Tresur", "Traesure"], correctAnswer: "Treasure", topic: "English", difficulty: "Easy" },
    { questionText: "What is 15 - 8?", options: ["6", "7", "8", "9"], correctAnswer: "7", topic: "Math", difficulty: "Medium" },
    { questionText: "Which ocean is the largest on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correctAnswer: "Pacific Ocean", topic: "Geography", difficulty: "Medium" },
    { questionText: "Identify the noun in the sentence: 'The pirate sailed the ship.'", options: ["sailed", "The", "pirate", "quickly"], correctAnswer: "pirate", topic: "English", difficulty: "Medium" },
    { questionText: "What do fish use to breathe underwater?", options: ["Lungs", "Gills", "Fins", "Scales"], correctAnswer: "Gills", topic: "Science", difficulty: "Easy" },
    { questionText: "If a pirate ship has 4 masts and each mast has 2 sails, how many sails are there in total?", options: ["6", "8", "10", "12"], correctAnswer: "8", topic: "Math", difficulty: "Medium" },
    { questionText: "What is the opposite of 'Deep'?", options: ["Low", "High", "Shallow", "Dark"], correctAnswer: "Shallow", topic: "English", difficulty: "Easy" },
    { questionText: "How many legs does a crab have?", options: ["6", "8", "10", "12"], correctAnswer: "10", topic: "Science", difficulty: "Medium" }
  ];

  const spaceQuestions = [
    { questionText: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: "Mars", topic: "Science", difficulty: "Easy" },
    { questionText: "What is the result of 15 * 6?", options: ["80", "90", "100", "110"], correctAnswer: "90", topic: "Math", difficulty: "Easy" },
    { questionText: "Identify the synonym for 'vast':", options: ["Tiny", "Narrow", "Immense", "Brief"], correctAnswer: "Immense", topic: "English", difficulty: "Medium" },
    { questionText: "Which force keeps the planets in orbit around the Sun?", options: ["Friction", "Magnetism", "Gravity", "Tension"], correctAnswer: "Gravity", topic: "Science", difficulty: "Medium" },
    { questionText: "If a spaceship travels at 500 km/h, how far will it travel in 4 hours?", options: ["1000 km", "1500 km", "2000 km", "2500 km"], correctAnswer: "2000 km", topic: "Math", difficulty: "Medium" },
    { questionText: "What is the central core of an atom called?", options: ["Electron", "Proton", "Nucleus", "Neutron"], correctAnswer: "Nucleus", topic: "Science", difficulty: "Medium" },
    { questionText: "Choose the correctly punctuated sentence:", options: ["The alien said 'hello!'", "The alien said, \"Hello!\"", "The alien said hello.", "the alien said hello"], correctAnswer: "The alien said, \"Hello!\"", topic: "English", difficulty: "Hard" },
    { questionText: "Solve for x: 3x + 5 = 20", options: ["x = 4", "x = 5", "x = 6", "x = 7"], correctAnswer: "x = 5", topic: "Math", difficulty: "Medium" },
    { questionText: "What gas do plants absorb from the atmosphere in space stations?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], correctAnswer: "Carbon Dioxide", topic: "Science", difficulty: "Medium" },
    { questionText: "What is the past tense of 'fly'?", options: ["Flyed", "Flew", "Flown", "Flying"], correctAnswer: "Flew", topic: "English", difficulty: "Easy" }
  ];

  const techQuestions = [
    { questionText: "What is the value of x in the equation 2(x - 3) = 4x + 6?", options: ["-6", "-3", "3", "6"], correctAnswer: "-6", topic: "Math", difficulty: "Medium" },
    { questionText: "Which fundamental force is responsible for radioactive decay?", options: ["Strong Nuclear Force", "Weak Nuclear Force", "Electromagnetism", "Gravity"], correctAnswer: "Weak Nuclear Force", topic: "Science", difficulty: "Medium" },
    { questionText: "In a right-angled triangle, if the sides are 6 cm and 8 cm, what is the length of the hypotenuse?", options: ["9 cm", "10 cm", "12 cm", "14 cm"], correctAnswer: "10 cm", topic: "Math", difficulty: "Medium" },
    { questionText: "Which law of thermodynamics states that energy cannot be created or destroyed?", options: ["Zeroth Law", "First Law", "Second Law", "Third Law"], correctAnswer: "First Law", topic: "Science", difficulty: "Easy" },
    { questionText: "What is the chemical formula for sulfuric acid?", options: ["H2SO4", "HCl", "HNO3", "H2CO3"], correctAnswer: "H2SO4", topic: "Science", difficulty: "Easy" },
    { questionText: "Solve the quadratic equation: x^2 - 5x + 6 = 0", options: ["x=2, x=3", "x=-2, x=-3", "x=1, x=6", "x=-1, x=-6"], correctAnswer: "x=2, x=3", topic: "Math", difficulty: "Hard" },
    { questionText: "What is the SI unit of electric resistance?", options: ["Volt", "Ampere", "Ohm", "Joule"], correctAnswer: "Ohm", topic: "Science", difficulty: "Easy" },
    { questionText: "If the probability of an event is 0.2, what is the probability of the event not happening?", options: ["0.2", "0.5", "0.8", "1.0"], correctAnswer: "0.8", topic: "Math", difficulty: "Easy" },
    { questionText: "Which organelle is known as the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"], correctAnswer: "Mitochondria", topic: "Science", difficulty: "Easy" },
    { questionText: "What happens to the resistance of a semiconductor when its temperature increases?", options: ["Increases", "Decreases", "Remains constant", "First increases then decreases"], correctAnswer: "Decreases", topic: "Science", difficulty: "Hard" }
  ];

  let pool = oceanQuestions;
  if (world === "Space Explorer") pool = spaceQuestions;
  else if (world === "Futuristic Mind Lab") pool = techQuestions;

  // Shuffle to provide variance when requested count is less than pool length
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
