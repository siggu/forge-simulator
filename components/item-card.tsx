'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Item } from '@/lib/types';

interface ItemCardProps {
  item: Item;
}

const categoryStyleMap: Record<string, string> = {
  hero: 'border-purple-600 bg-purple-900/40 hover:ring-purple-400',
  legendary: 'border-yellow-500 bg-yellow-900/40 hover:ring-yellow-300',
  mortal: 'border-red-600 bg-red-900/40 hover:ring-red-400',
};

export function ItemCard({ item }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryClass = categoryStyleMap[item.category] || 'border-zinc-500 bg-zinc-800';

  return (
    <Link
      href={`/reinforce/${item.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative p-4 rounded-xl border-2 ${categoryClass} transition-all duration-300 hover:scale-105 hover:ring-2 shadow-md`}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='w-full aspect-square relative'>
          <Image
            src={item.images[0] || '/placeholder.svg'}
            alt={item.name}
            fill
            className='object-contain rounded-md'
            sizes='(max-width: 768px) 100px, 120px'
          />
        </div>
        <h3 className='mt-4 text-center text-lg font-bold tracking-tight text-white group-hover:text-yellow-100'>
          {item.name}
        </h3>
      </div>
    </Link>
  );
}
