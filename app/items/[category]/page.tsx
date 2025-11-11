import { ItemCard } from '@/components/item-card';
import { categoryTitleMap } from '@/constants/categoryMap';
import { items } from '@/lib/items';
import Link from 'next/link';
import { use } from 'react';

export default function ItemsPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);

  const categoryItems = items.filter((item) => item.category === category);

  return (
    <div className='min-h-screen py-8 px-4 bg-slate-900 text-white relative overflow-hidden'>
      <div className='container mx-auto max-w-7xl relative z-10'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 group transition-colors'
        >
          <svg className='w-5 h-5 transform group-hover:-translate-x-1 transition-transform' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
            <path d='M15 19l-7-7 7-7'></path>
          </svg>
          메인으로 돌아가기
        </Link>

        <div className='mb-12'>
          <h1
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2`}
          >
            {categoryTitleMap[category] ?? '알 수 없는 카테고리'}
          </h1>
          <div className='h-1 w-24 bg-purple-500 rounded-full'></div>
        </div>

        {categoryItems.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {categoryItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className='text-center text-purple-300/70 text-lg mt-12'>해당 카테고리에 아이템이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
