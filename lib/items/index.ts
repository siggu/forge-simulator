import type { BossItem, DestinyItem, GachaItem, Item, JobWeaponItem } from '../types';
import { heroWeapons } from './hero-weapons';
import { legendaryWeapons } from './legendary-weapons';
import { mortalWeapons } from './mortal-weapons';
import { gachaItems } from './gacha-items';
import { jobItems } from './job-weapons';
import { destinyItems } from './destiny-weapons';
import { bossItems } from './boss-weapons';

// Combine all reinforcement weapons (hero, legendary, mortal)
export const items: Item[] = [...heroWeapons, ...legendaryWeapons, ...mortalWeapons];

// Re-export individual categories
export { heroWeapons, legendaryWeapons, mortalWeapons };

// Re-export other weapon types
export { gachaItems, jobItems, destinyItems, bossItems };

// Re-export types for convenience
export type { Item, GachaItem, JobWeaponItem, DestinyItem, BossItem };
