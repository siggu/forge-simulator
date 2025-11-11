'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Item } from '@/lib/types';

interface ItemCardProps {
  item: Item;
}

const categoryStyleMap: Record<string, { bg: string; border: string; hover: string }> = {
  hero: {
    bg: 'bg-slate-800',
    border: 'border-purple-500/50',
    hover: 'hover:border-purple-400/80',
  },
  legendary: {
    bg: 'bg-slate-800',
    border: 'border-yellow-500/50',
    hover: 'hover:border-yellow-400/80',
  },
  mortal: {
    bg: 'bg-slate-800',
    border: 'border-red-500/50',
    hover: 'hover:border-red-400/80',
  },
};

export function ItemCard({ item }: ItemCardProps) {
  const styles = categoryStyleMap[item.category] || {
    bg: 'bg-slate-800',
    border: 'border-slate-500',
    hover: 'hover:border-slate-400',
  };

  return (
    <Link
      href={`/reinforce/${item.id}`}
      className={`group block p-5 rounded-2xl ${styles.bg} border ${styles.border} ${styles.hover} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200`}
    >
      <div className='flex flex-col items-center'>
        <div className='w-full aspect-square relative mb-4'>
          <Image
            src={item.images[0] || '/placeholder.svg'}
            alt={item.name}
            fill
            className='object-contain'
            sizes='(max-width: 768px) 100px, 120px'
          />
        </div>
        <h3 className='text-center text-lg font-bold text-white'>
          {item.name}
        </h3>
      </div>
    </Link>
  );
}
