'use client';

import { jobItems } from '@/lib/items-data';
import Link from 'next/link';
import { use } from 'react';

export default function JobPage({ params }: { params: Promise<{ job: string }> }) {
  const { job } = use(params);

  const jobs = jobItems.filter((item) => item.id === job);

  console.log(jobs);

  const jobTitleMap: Record<string, string> = {};

  const jobColorMap: Record<string, string> = {
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
        <h1 className={`text-4xl font-bold my-8 ${jobColorMap[job]}`}>{jobTitleMap[job]}</h1>
        <div className='grid grid-cols-1'></div>
      </div>
    </div>
  );
}
