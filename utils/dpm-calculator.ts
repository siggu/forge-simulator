/**
 * DPM (Damage Per Minute) calculation utilities for job weapons
 */

import type { JobWeaponItem } from '@/lib/types';
import {
  BLADE_LEFT_COOLDOWN_BONUS,
  WARRIOR_BASE_MULTIPLIER,
  WARRIOR_SHIFT_MULTIPLIER,
  MAGE_STACK_MULTIPLIER,
  MAGE_STACK_USAGE_RATE,
} from '@/constants/damage-multipliers';

/**
 * Calculate base DPM for a weapon skill
 * @param cooldown - Skill cooldown in seconds
 * @param damage - Skill damage
 * @returns DPM value
 */
const calculateBaseDPM = (cooldown: number, damage: number): number => {
  return (60 / cooldown) * damage;
};

/**
 * Calculate DPM for Blade job weapon
 * Blade has a passive bonus on left click attacks
 */
const calculateBladeDPM = (
  damageInfo: any,
  level: number,
  weaponItem: JobWeaponItem
): number => {
  const left = damageInfo.left[level];
  const right = damageInfo.right?.[level] ?? 0;
  const leftShift = damageInfo.left_shift?.[level];
  const rightShift = damageInfo.shift_right[level];

  let leftDamage = calculateBaseDPM(weaponItem.left_cooldown, left);
  const rightDamage = weaponItem.right_cooldown
    ? calculateBaseDPM(weaponItem.right_cooldown, right)
    : 0;
  const leftShiftDamage = calculateBaseDPM(weaponItem.left_shift_cooldown, leftShift);
  const rightShiftDamage = calculateBaseDPM(weaponItem.right_shift_cooldown, rightShift);

  // Apply Blade passive bonus to left click
  if (damageInfo.left_bonus) {
    leftDamage *= BLADE_LEFT_COOLDOWN_BONUS;
  }

  return leftDamage + rightDamage + leftShiftDamage + rightShiftDamage;
};

/**
 * Calculate DPM for Warrior job weapon
 * Warrior has passive bonuses on all attacks
 */
const calculateWarriorDPM = (
  damageInfo: any,
  level: number,
  weaponItem: JobWeaponItem
): number => {
  const left = damageInfo.left[level];
  const right = damageInfo.right?.[level] ?? 0;
  const leftShift = damageInfo.left_shift?.[level];
  const rightShift = damageInfo.shift_right[level];

  let leftDamage = calculateBaseDPM(weaponItem.left_cooldown, left);
  let rightDamage = weaponItem.right_cooldown
    ? calculateBaseDPM(weaponItem.right_cooldown, right)
    : 0;
  let leftShiftDamage = calculateBaseDPM(weaponItem.left_shift_cooldown, leftShift);
  let rightShiftDamage = calculateBaseDPM(weaponItem.right_shift_cooldown, rightShift);

  // Apply Warrior passive bonuses
  if (damageInfo.passive_bonus) {
    leftDamage *= WARRIOR_BASE_MULTIPLIER;
    rightDamage *= WARRIOR_BASE_MULTIPLIER;
    leftShiftDamage *= WARRIOR_SHIFT_MULTIPLIER;
    rightShiftDamage *= WARRIOR_SHIFT_MULTIPLIER;
  }

  return leftDamage + rightDamage + leftShiftDamage + rightShiftDamage;
};

/**
 * Calculate DPM for Frost job weapon
 * Frost has additional damage on certain skills and special left-click pattern
 */
const calculateFrostDPM = (
  damageInfo: any,
  level: number,
  weaponItem: JobWeaponItem
): number => {
  const left = damageInfo.left[level];
  const right = damageInfo.right?.[level] ?? 0;
  const leftShift = damageInfo.left_shift?.[level];
  const rightShift = damageInfo.shift_right[level];

  let rightDamage = weaponItem.right_cooldown
    ? calculateBaseDPM(weaponItem.right_cooldown, right)
    : 0;
  let leftShiftDamage = calculateBaseDPM(weaponItem.left_shift_cooldown, leftShift);
  let rightShiftDamage = calculateBaseDPM(weaponItem.right_shift_cooldown, rightShift);

  // Add additional damage to skills
  if (damageInfo.additional_damage) {
    const add = damageInfo.additional_damage[level];
    rightDamage += add;
    rightShiftDamage += add;
    leftShiftDamage += add;
  }

  // Left click has special 3-hit pattern with 50% bonus on third hit
  const atk1 = left;
  const atk2 = left;
  const atk3 = left * 1.5;
  const leftDamage = (60 / (weaponItem.left_cooldown * 3)) * (atk1 + atk2 + atk3);

  return leftDamage + rightDamage + leftShiftDamage + rightShiftDamage;
};

/**
 * Calculate DPM for Mage job weapon
 * Mage has stack mechanics that boost certain skills
 */
const calculateMageDPM = (
  damageInfo: any,
  level: number,
  weaponItem: JobWeaponItem
): number => {
  const left = damageInfo.left[level];
  const leftShift = damageInfo.left_shift?.[level];
  const rightShift = damageInfo.shift_right[level];

  // Left click: Arcane Slash (no stack)
  const leftDamage = calculateBaseDPM(weaponItem.left_cooldown, left);

  // Shift + Left click: Meteor (uses stack)
  const normalLeftShift = calculateBaseDPM(weaponItem.left_shift_cooldown, leftShift) * (1 - MAGE_STACK_USAGE_RATE);
  const boostedLeftShift = calculateBaseDPM(weaponItem.left_shift_cooldown, leftShift * MAGE_STACK_MULTIPLIER) * MAGE_STACK_USAGE_RATE;
  const leftShiftDamage = normalLeftShift + boostedLeftShift;

  // Shift + Right click: Inferno Chain (uses stack)
  const normalRightShift = calculateBaseDPM(weaponItem.right_shift_cooldown, rightShift) * (1 - MAGE_STACK_USAGE_RATE);
  const boostedRightShift = calculateBaseDPM(weaponItem.right_shift_cooldown, rightShift * MAGE_STACK_MULTIPLIER) * MAGE_STACK_USAGE_RATE;
  const rightShiftDamage = normalRightShift + boostedRightShift;

  // Right click: Blink (movement skill, no damage)
  const rightDamage = 0;

  return leftDamage + rightDamage + leftShiftDamage + rightShiftDamage;
};

/**
 * Calculate generic DPM for jobs without special mechanics
 */
const calculateGenericDPM = (
  damageInfo: any,
  level: number,
  weaponItem: JobWeaponItem
): number => {
  const left = damageInfo.left[level];
  const right = damageInfo.right?.[level] ?? 0;
  const leftShift = damageInfo.left_shift?.[level];
  const rightShift = damageInfo.shift_right[level];

  const leftDamage = calculateBaseDPM(weaponItem.left_cooldown, left);
  const rightDamage = weaponItem.right_cooldown
    ? calculateBaseDPM(weaponItem.right_cooldown, right)
    : 0;
  const leftShiftDamage = calculateBaseDPM(weaponItem.left_shift_cooldown, leftShift);
  const rightShiftDamage = calculateBaseDPM(weaponItem.right_shift_cooldown, rightShift);

  return leftDamage + rightDamage + leftShiftDamage + rightShiftDamage;
};

/**
 * Calculate DPM for a job weapon based on job type and level
 * @param job - Job name (블레이드, 워리어, 프로스트, 메이지)
 * @param weaponItem - The job weapon item data
 * @param level - Weapon level
 * @returns Calculated DPM value
 */
export const calculateJobWeaponDPM = (
  job: string,
  weaponItem: JobWeaponItem,
  level: number
): number => {
  const damageInfo = weaponItem.damages?.[0];
  if (!damageInfo) {
    return 0;
  }

  // Route to appropriate calculation based on job
  switch (job) {
    case '블레이드':
      return calculateBladeDPM(damageInfo, level, weaponItem);
    case '워리어':
      return calculateWarriorDPM(damageInfo, level, weaponItem);
    case '프로스트':
      return calculateFrostDPM(damageInfo, level, weaponItem);
    case '메이지':
      return calculateMageDPM(damageInfo, level, weaponItem);
    default:
      return calculateGenericDPM(damageInfo, level, weaponItem);
  }
};

/**
 * Calculate DPMs for all job weapons
 * @param jobWeaponLevels - Record of job names to their weapon levels
 * @param jobItems - Array of all job weapon items
 * @returns Record of job names to their calculated DPM values
 */
export const calculateAllJobWeaponDPMs = (
  jobWeaponLevels: Record<string, number>,
  jobItems: JobWeaponItem[]
): Record<string, number> => {
  const result: Record<string, number> = {};

  Object.keys(jobWeaponLevels).forEach((job) => {
    const level = jobWeaponLevels[job];
    if (level === undefined) {
      return;
    }

    const weaponItem = jobItems.find((item) => item.id === job);
    if (!weaponItem) {
      return;
    }

    result[job] = calculateJobWeaponDPM(job, weaponItem, level);
  });

  return result;
};
