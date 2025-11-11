import type { BossItem } from '../types';

export const bossItems: BossItem[] = [
  {
    id: 'frozen_staff',
    name: '프로즌 스태프',
    category: 'boss',
    images: ['/boss/frozen_staff.png'],
    damages: [
      {
        level: 0,
        damage: 340,
        cooldown: 90,
        mana: 30,
      },
      {
        level: 1,
        damage: 340,
        cooldown: 30,
        mana: 30,
      },
      {
        level: 2,
        damage: 425,
        cooldown: 30,
        mana: 30,
      },
      {
        level: 3,
        damage: 510,
        cooldown: 30,
        mana: 30,
      },
    ],
    times: 6,
  },
];
