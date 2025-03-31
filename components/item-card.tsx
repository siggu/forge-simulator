'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Item } from '@/lib/types';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryColorMap: Record<string, string> = {
    hero: 'border-purple-600 bg-purple-900/50',
    legendary: 'border-yellow-600 bg-yellow-900/50',
    mortal: 'border-red-600 bg-red-900/50',
  };

  return (
    <Link
      href={`/reinforce/${item.id}`}
      className={`relative rounded-lg border-2 ${
        categoryColorMap[item.category]
      } p-4 transition-all duration-300 hover:scale-105 cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='flex flex-col items-center'>
        <Image
          src={item.images[0] || '/placeholder.svg'}
          alt={item.name}
          width={120}
          height={120}
          className='object-contain h-32'
        />
        <h3 className='mt-4 text-xl font-semibold text-center'>{item.name}</h3>
      </div>

      {isHovered && (
        <div className='absolute inset-0 bg-black/80 rounded-lg p-4 flex flex-col justify-center'>
          <h3 className='text-xl font-bold mb-2'>{item.name}</h3>
          <p className='text-gray-300 mb-2'>{item.description}</p>
          <div className='text-sm'>
            <p>최대 강화 단계: {item.maxLevel}</p>
          </div>
        </div>
      )}
    </Link>
  );
}
