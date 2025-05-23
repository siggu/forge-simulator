'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ForgeWeaponList } from '@/components/forge-weapon-list';
import Link from 'next/link';
import InstallPWAButton from '@/components/install-pwa-button';
import randomTexts from '@/constants/randomText';

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

        <ForgeWeaponList />
        <Link
          href={'/password-gate'}
          className='bg-blue-900 hover:bg-blue-800 text-blue-300 border-blue-600 flex mt-20 p-8 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 items-center justify-center'
        >
          <h2 className='text-3xl font-bold text-center'>환산 계산기</h2>
        </Link>
        <div className='grid grid-cols-2 gap-8'>
          <Link
            href={'/gacha'}
            className='bg-green-900 hover:bg-green-800 text-green-300 border-green-600 flex mt-20 p-8 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 items-center justify-center'
          >
            <h2 className='text-3xl font-bold text-center'>열쇠 뽑기</h2>
          </Link>
          <Link
            href={'/mupa-calculator'}
            className='bg-pink-900 hover:bg-pink-800 text-pink-300 border-pink-600 flex mt-20 p-8 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 items-center justify-center'
          >
            <h2 className='text-3xl font-bold text-center'>무파 계산기</h2>
          </Link>
        </div>
      </div>
      <InstallPWAButton />
    </main>
  );
}
