'use client';

import GachaCard from '@/components/gacha-card';
import { gachaItems } from '@/lib/items-data';
import Link from 'next/link';
import { use } from 'react';

export default function GachaWeapon({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);

  const categoryItems = gachaItems.filter((item) => item.category === category);

  const categoryTitleMap: Record<string, string> = {
    mystery: '신비로운 열쇠',
    hero: '영웅 열쇠',
    legendary: '전설 열쇠',
  };

  const categoryColorMap: Record<string, string> = {
    mystery: 'text-red-400',
    hero: 'text-purple-400',
    legendary: 'text-yellow-400',
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <div className='flex flex-col'>
          <Link href='/' className='text-blue-400 hover:underline mb-4 inline-block'>
            ← 메인으로 돌아가기
          </Link>
          <Link href='/gacha' className='text-blue-400 hover:underline mb-4 inline-block'>
            ← 열쇠 뽑기 목록으로 돌아가기
          </Link>
        </div>
        <h1 className={`text-4xl font-bold my-8 ${categoryColorMap[category]}`}>{categoryTitleMap[category]}</h1>
        <div className='grid grid-cols-1'>
          <GachaCard items={categoryItems} />
        </div>
      </div>
    </div>
  );
}
