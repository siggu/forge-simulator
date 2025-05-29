'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GachaItem } from '@/lib/types';
import Image from 'next/image';

export default function GachaCard({ items }: { items: GachaItem[] }) {
  const [current, setCurrent] = useState<GachaItem | null>(null);
  const [rolling, setRolling] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);

  const gachaAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gachaAudioRef.current) {
      gachaAudioRef.current.volume = 0.1;
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

      gachaAudioRef.current?.play().catch(() => {});
      gachaAudioRef.current!.currentTime = 0;

      await new Promise((r) => setTimeout(r, 50 + i * 4));
    }

    gachaAudioRef.current?.play().catch(() => {});
    gachaAudioRef.current!.currentTime = 0;

    setRolling(false);
  }, [rolling, items]);

  return (
    <div className='flex flex-col items-center gap-8'>
      <audio ref={gachaAudioRef} src='/bgm/levelup.mp3' preload='auto' />

      {/* Gacha 버튼 */}
      <button onClick={roll} disabled={rolling} className='transition-all hover:scale-105 disabled:opacity-50'>
        <Image src={boxImage} width={150} height={150} alt='열쇠 박스' className='object-contain drop-shadow-lg' />
      </button>

      {/* 뽑기 결과 */}
      {current && (
        <div className='text-center mt-6 bg-zinc-800 px-6 py-4 rounded-xl shadow-lg w-full max-w-sm'>
          <div className='relative w-32 aspect-square mx-auto mb-4 bg-white rounded-lg shadow'>
            <Image src={current.image} alt={current.name} fill className='object-contain p-2' sizes='128px' />
          </div>
          <div className='flex gap-3 items-center justify-center'>
            <Image src='/button/icon_daebak.png' width={40} height={30} alt='대박' />
            <div className='text-lg font-bold text-yellow-300 line-clamp-2 leading-snug break-words'>
              {current.name}
            </div>
            <Image src='/button/icon_daebak.png' width={40} height={30} alt='대박' />
          </div>
        </div>
      )}

      {/* 뽑기 목록 보기 버튼 */}
      <button
        onClick={() => setIsListOpen((prev) => !prev)}
        className='mt-4 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition'
      >
        {isListOpen ? '뽑기 목록 닫기' : '뽑기 목록 보기'}
      </button>

      {/* 뽑기 아이템 목록 */}
      {isListOpen && (
        <div className='mt-4 bg-white text-black rounded-xl shadow-lg p-4 w-fit max-w-4xl overflow-x-auto'>
          <div className='flex gap-9'>
            {items.map((item) => (
              <div key={`list-${item.id}`} className='flex flex-col items-center w-24 flex-shrink-0'>
                <div className='relative w-20 aspect-square bg-zinc-100 rounded shadow-sm'>
                  <Image src={item.image} alt={item.name} fill className='object-contain p-1' sizes='80px' />
                </div>
                <div className='text-xs text-center mt-1 truncate'>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
