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
    <main className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white'>
      <div className='container mx-auto max-w-[1280px] px-6 py-12'>
        {/* 헤더 영역 */}
        <div className='flex items-center justify-center gap-8 mb-12'>
          {/* 왼쪽 캐릭터 */}
          <div className='relative group cursor-pointer' onMouseEnter={getRandomText}>
            <Image
              src='/chibi/robbery_chibi.png'
              width={100}
              height={100}
              alt='robbery_chibi'
              className='drop-shadow-lg'
            />
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 text-sm text-white bg-black/80 backdrop-blur rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap z-10'>
              {randomText}
            </div>
          </div>

          {/* 타이틀 */}
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-center'>원숭이 시뮬레이터</h1>

          {/* 오른쪽 캐릭터 */}
          <div className='relative group cursor-pointer' onMouseEnter={getRandomText}>
            <Image
              src='/chibi/candleknight_chibi.png'
              width={100}
              height={100}
              alt='candleknight_chibi'
              className='drop-shadow-lg'
            />
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 text-sm text-white bg-black/80 backdrop-blur rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap z-10'>
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
              className='block p-6 bg-zinc-800 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transform transition duration-300 ease-in-out text-center font-semibold text-lg tracking-tight hover:bg-zinc-700'
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>

      <div className='mt-12 flex justify-center'>
        <InstallPWAButton />
      </div>
    </main>
  );
}
