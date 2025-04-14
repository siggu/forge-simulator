'use clinet';

import Link from 'next/link';

export default function HwansanPage() {
  return (
    <div className='min-h-screen bg-gray-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <Link href='/' className='text-blue-400 hover:underline mb-4 inline-block'>
          ← 메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
