'use client';

import { useState } from 'react';
import { GachaItem } from '@/lib/types';

export default function GachaCard({ items }: { items: GachaItem[] }) {
  const [current, setCurrent] = useState<GachaItem | null>(null);
  const [rolling, setRolling] = useState(false);

  const roll = async () => {
    if (rolling || items.length === 0) return;
    setRolling(true);
    setCurrent(null);

    for (let i = 0; i < 50; i++) {
      const random = items[Math.floor(Math.random() * items.length)];
      setCurrent(random);
      await new Promise((r) => setTimeout(r, 50 + i * 5));
    }

    setRolling(false);
  };

  return (
    <div className='flex flex-col items-center gap-6'>
      {/* 버튼 + 툴팁 */}
      <div className='relative group flex'>
        <button
          onClick={roll}
          disabled={rolling}
          className='flex items-center gap-2 px-4 py-2 text-white rounded-xl disabled:opacity-50'
        >
          <img src='/button/icon_accept1.png' alt='열쇠' className='w-15 h-15 object-contain' />
        </button>

        {/* 툴팁 */}
        <div className='min-w-max absolute left-1/2 -translate-x-1/2 mt-20 px-4 py-2 bg-white text-black rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 z-10 whitespace-nowrap overflow-x-auto max-w-xl flex gap-2 items-center'>
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className='flex flex-wrap items-center'>
                <img src={item.image} alt={item.name} className='w-[100px] h-[100px] object-contain border rounded' />
              </div>
            ))
          ) : (
            <div className='text-red-500'>무기 없음</div>
          )}
        </div>
      </div>

      {/* 결과 무기 출력 */}
      {current && (
        <div className='text-center mt-4'>
          <img src={current.image} alt={current.name} className='w-40 h-40 object-contain mx-auto' />
          <div className='flex gap-4 mt-8'>
            <img src={'/button/icon_daebak.png'} className='w-10 h-10 object-contain mx-auto' />
            <div className='text-lg mt-2 font-semibold'>{current.name}</div>
            <img src={'/button/icon_daebak.png'} className='w-10 h-10 object-contain mx-auto' />
          </div>
        </div>
      )}
    </div>
  );
}
