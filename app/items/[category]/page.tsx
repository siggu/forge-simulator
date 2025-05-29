import { ItemCard } from '@/components/item-card';
import { categoryColorMap, categoryTitleMap } from '@/constants/categoryMap';
import { items } from '@/lib/items-data';
import Link from 'next/link';
import { use } from 'react';

export default function ItemsPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);

  const categoryItems = items.filter((item) => item.category === category);

  return (
    <div className='min-h-screen py-8 px-4 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white'>
      <div className='container mx-auto max-w-7xl'>
        <Link
          href='/'
          className='inline-flex items-center text-blue-400 hover:underline hover:text-blue-300 transition mb-6'
        >
          ← 메인으로 돌아가기
        </Link>

        <h1
          className={`text-4xl sm:text-5xl font-extrabold tracking-tight border-b pb-4 mb-10 ${categoryColorMap[category]}`}
        >
          {categoryTitleMap[category] ?? '알 수 없는 카테고리'}
        </h1>

        {categoryItems.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {categoryItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className='text-center text-zinc-400 text-lg mt-12'>해당 카테고리에 아이템이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
