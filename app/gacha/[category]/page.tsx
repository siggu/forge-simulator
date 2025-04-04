'use clinet';

import Link from 'next/link';
import { use } from 'react';

export default function GachaWeapon({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params); // ✅ use()를 사용하여 비동기 데이터 처리

  //   const categoryItems = items.filter((item) => item.category === category);

  const categoryTitleMap: Record<string, string> = {
    rare: '희귀 무기',
    hero: '영웅 무기',
    legendary: '전설 무기',
  };

  const categoryColorMap: Record<string, string> = {
    rare: 'text-blue-400',
    hero: 'text-purple-400',
    legendary: 'text-yellow-400',
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <Link href='/' className='text-blue-400 hover:underline mb-4 inline-block'>
          ← 메인으로 돌아가기
        </Link>

        <h1 className={`text-4xl font-bold my-8 ${categoryColorMap[category]}`}>{categoryTitleMap[category]}</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>준비중...</div>
      </div>
    </div>
  );
}
