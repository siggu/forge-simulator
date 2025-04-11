'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GachaItem } from '@/lib/types';

export default function GachaCard({ items }: { items: GachaItem[] }) {
  const [current, setCurrent] = useState<GachaItem | null>(null);
  const [rolling, setRolling] = useState(false);

  const gachaAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gachaAudioRef.current) {
      gachaAudioRef.current.volume = 0.1; // 적당한 기본 볼륨
    }
  }, []);

  const isHero = items[0]?.category === 'hero';
  const boxImage = isHero ? '/box/toffy_crate_paladin.png' : '/box/toffy_crate_viking.png';

  const roll = useCallback(async () => {
    if (rolling || items.length === 0) return;

    setRolling(true);
    setCurrent(null);

    for (let i = 0; i < 60; i++) {
      const random = items[Math.floor(Math.random() * items.length)];
      setCurrent(random);

      if (gachaAudioRef.current) {
        gachaAudioRef.current.currentTime = 0;
        gachaAudioRef.current.play().catch(() => {});
      }

      await new Promise((r) => setTimeout(r, 50 + i * 4));
    }

    // 마지막 한 번 더 재생
    if (gachaAudioRef.current) {
      gachaAudioRef.current.currentTime = 0;
      gachaAudioRef.current.play().catch(() => {});
    }

    setRolling(false);
  }, [rolling, items]);

  return (
    <div className='flex flex-col items-center gap-6'>
      {/* 하나의 오디오 요소만 사용 */}
      <audio ref={gachaAudioRef} src='/bgm/levelup.mp3' preload='auto' />

      {/* 버튼 */}
      <div className='relative group flex'>
        <button
          onClick={roll}
          disabled={rolling}
          className='flex items-center gap-2 px-4 py-2 text-white rounded-xl disabled:opacity-50'
        >
          <img src={boxImage} alt='열쇠' className='w-[150px] h-[150px] object-contain' />
        </button>

        {/* 툴팁 */}
        <div className='min-w-max absolute left-1/2 -translate-x-1/2 mt-50 px-4 py-2 bg-white text-black rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 z-10 whitespace-nowrap overflow-x-auto max-w-xl flex gap-2 items-center'>
          {items.length > 0 ? (
            items.map((item) => (
              <div key={`tooltip-${item.id}`} className='flex items-center'>
                <img src={item.image} alt={item.name} className='w-[100px] h-[100px] object-contain border rounded' />
              </div>
            ))
          ) : (
            <div className='text-red-500'>무기 없음</div>
          )}
        </div>
      </div>

      {/* 결과 출력 */}
      {current && (
        <div className='text-center mt-4'>
          <img src={current.image} alt={current.name} className='w-40 h-40 object-contain mx-auto' />
          <div className='flex gap-4 mt-8 items-center justify-center'>
            <img src='/button/icon_daebak.png' alt='대박' className='w-10 h-10 object-contain' />
            <div className='text-lg font-semibold'>{current.name}</div>
            <img src='/button/icon_daebak.png' alt='대박' className='w-10 h-10 object-contain' />
          </div>
        </div>
      )}
    </div>
  );
}
