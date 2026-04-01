/**
 * Antigravity Fairness Engine
 * Dynamically adjusts individual difficulty inside team sessions
 * and calculates rewards based on effort and consistency.
 */

export interface PlayerStats {
  userId: number;
  level: string; // "Beginner" | "Intermediate" | "Advanced"
  focusScore: number;
  improvementRate: number;
}

const levelValues: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export function adjustDifficultyForSession(player: PlayerStats, teamPlayers: PlayerStats[]): string {
  const playerVal = levelValues[player.level] || 1;
  const teamAvg = teamPlayers.reduce((acc, p) => acc + (levelValues[p.level] || 1), 0) / teamPlayers.length;

  if (playerVal < teamAvg - 0.8) {
     // Give an easier variant or help modifier (Antigravity lift)
     return "Beginner-Assisted";
  }
  if (playerVal > teamAvg + 0.8) {
     // Harder variant to prevent boredom (Antigravity anchor)
     return "Advanced-Plus";
  }
  return player.level;
}

export function calculateEffortReward(rawScore: number, player: PlayerStats, teamPlayers: PlayerStats[]): number {
  let effortMultiplier = 1.0;
  const playerVal = levelValues[player.level] || 1;
  const teamAvg = teamPlayers.reduce((acc, p) => acc + (levelValues[p.level] || 1), 0) / teamPlayers.length;

  // Bonus for lower level players keeping up
  if (playerVal < teamAvg) {
     effortMultiplier += 0.25; 
  }
  
  // Consistency bonus
  if (player.improvementRate > 5) {
     effortMultiplier += 0.15;
  }

  // Diminishing returns for high-level players dominating
  if (playerVal > teamAvg && rawScore > 100) {
      effortMultiplier -= 0.1; 
  }

  return Math.max(1, Math.round(rawScore * effortMultiplier));
}
