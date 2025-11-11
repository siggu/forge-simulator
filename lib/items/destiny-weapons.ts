import type { DestinyItem } from '../types';

export const destinyItems: DestinyItem[] = [
  {
    id: 'dragon_sword_ef',
    name: '발할라',
    category: 'destiny',
    image: '/destiny/dragon_sword_ef.png',
    damages: [
      {
        left: [1418, 1702, 2042, 2450],
        left_times: 2,
        left_cooldown: [52, 47, 42, 35],
        right: 882,
        right_times: 2,
        right_cooldown: 14,
      },
    ],
  },
  {
    id: 'zeus_spear_ef',
    name: '올림푸스',
    category: 'destiny',
    image: '/destiny/zeus_spear_ef.png',
    damages: [
      {
        left: [3205, 3846, 4615, 5538],
        left_times: 1,
        left_cooldown: [60, 54, 48, 42],
        right: 1099,
        right_times: 2,
        right_cooldown: 19,
      },
    ],
  },
];
