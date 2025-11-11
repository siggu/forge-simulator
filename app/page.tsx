'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InstallPWAButton from '@/components/install-pwa-button';
import randomTexts from '@/constants/randomText';

export default function Home() {
  const [randomText, setRandomText] = useState(randomTexts[0]);

  const getRandomText = () => {
    const randomIndex = Math.floor(Math.random() * randomTexts.length);
    setRandomText(randomTexts[randomIndex]);
  };

  const links = [
    { text: '무기 강화', href: '/reinforce' },
    { text: '환산 계산기', href: '/password-gate' },
    { text: '열쇠 뽑기', href: '/gacha' },
    { text: '무파 계산기', href: '/mupa-calculator' },
  ];

  return (
    <main className='min-h-screen bg-slate-900 text-white'>
      <div className='container mx-auto max-w-[1280px] px-6 py-16'>
        {/* 헤더 영역 */}
        <div className='flex items-center justify-center gap-4 md:gap-8 mb-16'>
          {/* 왼쪽 캐릭터 */}
          <div className='relative group cursor-pointer' onMouseEnter={getRandomText}>
            <Image
              src='/chibi/robbery_chibi.png'
              width={100}
              height={100}
              alt='robbery_chibi'
            />
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2 text-sm text-white bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 border border-slate-700'>
              {randomText}
            </div>
          </div>

          {/* 타이틀 */}
          <div className='text-center'>
            <h1 className='text-5xl md:text-7xl font-bold tracking-tight text-white mb-2'>
              원숭이 시뮬레이터
            </h1>
            <p className='text-slate-400 text-sm md:text-base'>
              강화, 가챠, 환산을 한 곳에서
            </p>
          </div>

          {/* 오른쪽 캐릭터 */}
          <div className='relative group cursor-pointer' onMouseEnter={getRandomText}>
            <Image
              src='/chibi/candleknight_chibi.png'
              width={100}
              height={100}
              alt='candleknight_chibi'
            />
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2 text-sm text-white bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 border border-slate-700'>
              {randomText}
            </div>
          </div>
        </div>

        {/* 링크 카드 */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {links.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              className='block rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 hover:bg-slate-750 transition-all duration-200 p-8'
            >
              <h2 className='text-2xl font-bold text-center text-white'>
                {link.text}
              </h2>
            </Link>
          ))}
        </div>

        {/* PWA Install Button */}
        <div className='mt-16 flex justify-center'>
          <InstallPWAButton />
        </div>
      </div>
    </main>
  );
}
