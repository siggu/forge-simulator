'use client';

import { useState } from 'react';
import Image from 'next/image';
import { WeaponGacha } from '@/components/weapon-gacha';
import { WeaponList } from '@/components/audio-player';

const randomTexts = [
  'ㅋㅋ 원숭이',
  '쫄?',
  '넌 무파가 딱이야 ㅇㅇ',
  '쌀먹이나 하러 가세요라',
  '언제 정신 차릴래?',
  '원숭이가 더 건실하겠다 ㅇㅇ',
  '넌 걍 운이 없다',
];

export default function Home() {
  const [randomText, setRandomText] = useState(randomTexts[0]);

  // 랜덤 텍스트 설정 함수
  const getRandomText = () => {
    const randomIndex = Math.floor(Math.random() * randomTexts.length);
    setRandomText(randomTexts[randomIndex]);
  };

  return (
    <main className='min-h-screen bg-gray-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        {/* 헤더 영역 */}
        <div className='flex items-center justify-center gap-4 my-8'>
          {/* Ghost 이미지 + 툴팁 */}
          <div
            className='relative group'
            onMouseEnter={getRandomText} // hover 시 랜덤 텍스트 업데이트
          >
            <Image src={'/chibi/robbery_chibi.png'} width={100} height={100} alt='robbery_chibi' />
            <div className='absolute top-full left-1/2 min-w-[150px] -translate-x-1/2 mt-2 px-3 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition flex items-center justify-center'>
              {randomText} {/* 랜덤 텍스트 출력 */}
            </div>
          </div>

          <h1 className='text-4xl font-bold text-center'>원숭이 시뮬레이터</h1>

          {/* Candle Knight 이미지 + 툴팁 */}
          <div
            className='relative group'
            onMouseEnter={getRandomText} // hover 시 랜덤 텍스트 업데이트
          >
            <Image src={'/chibi/candleknight_chibi.png'} width={100} height={100} alt='candleknight_chibi' />
            <div className='absolute top-full left-1/2 min-w-[150px] -translate-x-1/2 mt-2 px-3 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition flex items-center justify-center'>
              {randomText} {/* 랜덤 텍스트 출력 */}
            </div>
          </div>
        </div>

        <WeaponList />
      </div>
    </main>
  );
}
