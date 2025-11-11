'use client';

import GachaCard from '@/components/gacha-card';
import { categoryTitleMap } from '@/constants/categoryMap';
import { gachaItems } from '@/lib/items';
import Link from 'next/link';
import { use } from 'react';

export default function GachaWeapon({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);

  const categoryItems = gachaItems.filter((item) => item.category === category);

  return (
    <div className='min-h-screen bg-slate-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <div className='flex flex-col gap-2 mb-6'>
          <Link href='/' className='inline-flex items-center gap-2 text-slate-300 hover:text-white group transition-colors w-fit'>
            <svg className='w-5 h-5 transform group-hover:-translate-x-1 transition-transform' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
              <path d='M15 19l-7-7 7-7'></path>
            </svg>
            메인으로 돌아가기
          </Link>
          <Link href='/gacha' className='inline-flex items-center gap-2 text-slate-300 hover:text-white group transition-colors w-fit'>
            <svg className='w-5 h-5 transform group-hover:-translate-x-1 transition-transform' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
              <path d='M15 19l-7-7 7-7'></path>
            </svg>
            열쇠 뽑기 목록으로 돌아가기
          </Link>
        </div>

        <div className='mb-12'>
          <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2'>
            {categoryTitleMap[category]}
          </h1>
          <div className='h-1 w-24 bg-purple-500 rounded-full'></div>
        </div>

        <div className='grid grid-cols-1'>
          <GachaCard items={categoryItems} />
        </div>
      </div>
    </div>
  );
}
