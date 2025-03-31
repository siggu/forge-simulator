import { ItemCard } from '@/components/item-card';
import { items } from '@/lib/items-data';
import Link from 'next/link';
import { use } from 'react';

export default function ItemsPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params); // ✅ use()를 사용하여 비동기 데이터 처리

  console.log('Received params:', category); // { category: "hero" } 같은 값이 정상적으로 찍힘

  const categoryItems = items.filter((item) => item.category === category);

  const categoryTitleMap: Record<string, string> = {
    hero: '영웅 무기',
    legendary: '전설 무기',
    mortal: '필멸 무기',
  };

  const categoryColorMap: Record<string, string> = {
    hero: 'text-purple-400',
    legendary: 'text-yellow-400',
    mortal: 'text-red-400',
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <Link href='/' className='text-blue-400 hover:underline mb-4 inline-block'>
          ← 메인으로 돌아가기
        </Link>

        <h1 className={`text-4xl font-bold my-8 ${categoryColorMap[category]}`}>{categoryTitleMap[category]}</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {categoryItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
