/**
 * Reinforcement probability calculations
 */

/**
 * Reinforcement probability rates by level
 */
export const REINFORCEMENT_RATES = {
  0: { success: 100, fail: 0, reset: 0 },
  1: { success: 75, fail: 25, reset: 0 },
  2: { success: 75, fail: 25, reset: 0 },
  3: { success: 75, fail: 25, reset: 0 },
  4: { success: 75, fail: 25, reset: 0 },
  5: { success: 60, fail: 40, reset: 0 },
  6: { success: 45, fail: 55, reset: 0 },
  7: { success: 40, fail: 57.5, reset: 2.5 },
  8: { success: 40, fail: 57.5, reset: 2.5 },
  9: { success: 40, fail: 57.5, reset: 2.5 },
  10: { success: 40, fail: 57.5, reset: 2.5 },
  11: { success: 40, fail: 57.5, reset: 2.5 },
  12: { success: 30, fail: 67.5, reset: 2.5 },
  13: { success: 20, fail: 77.5, reset: 2.5 },
  14: { success: 10, fail: 87.5, reset: 2.5 },
} as const;

/**
 * Get success rate for a given reinforcement level
 */
export const getSuccessRate = (currentLevel: number): number => {
  if (currentLevel < 0 || currentLevel > 14) return 0;
  return REINFORCEMENT_RATES[currentLevel as keyof typeof REINFORCEMENT_RATES].success;
};

/**
 * Get fail rate for a given reinforcement level
 */
export const getFailRate = (currentLevel: number): number => {
  if (currentLevel < 0 || currentLevel > 14) return 0;
  return REINFORCEMENT_RATES[currentLevel as keyof typeof REINFORCEMENT_RATES].fail;
};

/**
 * Get reset rate for a given reinforcement level
 */
export const getResetRate = (currentLevel: number): number => {
  if (currentLevel < 0 || currentLevel > 14) return 0;
  return REINFORCEMENT_RATES[currentLevel as keyof typeof REINFORCEMENT_RATES].reset;
};

/**
 * Get all rates for a given reinforcement level
 */
export const getReinforcementRates = (currentLevel: number) => {
  if (currentLevel < 0 || currentLevel > 14) {
    return { success: 0, fail: 0, reset: 0 };
  }
  return REINFORCEMENT_RATES[currentLevel as keyof typeof REINFORCEMENT_RATES];
};
