// 열쇠 무기 대미지
interface KeyWeaponDamage {
  level: number;
  damage: number;
  cooldown: number;
  mana: number;
}

// 직업 무기 대미지
interface JobWeaponDamage {
  left: number[];
  right?: number[];
  left_shift: number[];
  shift_right: number[];
  left_bonus?: number;
  passive_bonus?: number;
  passive_rate?: number;
  additional_damage?: number[];
}

// 운명 무기 대미지
interface DestinyWeaponDamage {
  left: number;
  left_times: number;
  left_cooldown: number;
  right: number;
  right_times: number;
  right_cooldown: number;
}

// 강화 아이템
export interface Item {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'legendary' | 'mortal';
  maxLevel: number;
  images: string[];
  damages?: KeyWeaponDamage[];
  times: number;
}

// 열쇠 뽑기 아이템
export interface GachaItem {
  id: string;
  name: string;
  category: 'hero' | 'legendary';
  image: string;
}

// 직업 무기 대미지
export interface JobWeaponItem {
  id: string;
  image: string;
  left_cooldown: number;
  right_cooldown?: number;
  left_shift_cooldown: number;
  right_shift_cooldown: number;
  damages?: JobWeaponDamage[];
}

// 운명 무기
export interface DestinyItem {
  id: string;
  name: string;
  category: 'destiny';
  image: string;
  damages?: DestinyWeaponDamage[];
  bonus?: number;
}

// 보스 무기
export interface BossItem {
  id: string;
  name: string;
  category: 'boss';
  images: string[];
  damages: KeyWeaponDamage[];
  times: number;
}
