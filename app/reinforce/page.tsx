'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { WeaponCategory } from '@/components/weapon-category';

const randomAudios = ['shopkeeper_01', 'smith_01'];

export default function ReinforcePage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    const randomIndex = Math.floor(Math.random() * randomAudios.length);
    const selectedAudio = new Audio(`/bgm/${randomAudios[randomIndex]}.ogg`);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audioRef.current = selectedAudio;
    audioRef.current.play().catch(() => {
      // Auto-play blocked by browser
    });
  };

  return (
    <main className='min-h-screen bg-slate-900 text-white relative overflow-hidden'>
      <div className='container mx-auto max-w-6xl px-6 py-12 relative z-10'>
        {/* Back Link */}
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 group transition-colors'
        >
          <svg className='w-5 h-5 transform group-hover:-translate-x-1 transition-transform' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
            <path d='M15 19l-7-7 7-7'></path>
          </svg>
          메인으로 돌아가기
        </Link>

        {/* Title Section */}
        <div className='text-center mb-16'>
          <h2 className='text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3'>
            무기 강화
          </h2>
          <p className='text-slate-400 text-lg'>
            강화할 무기의 등급을 선택하세요
          </p>
        </div>

        {/* Category Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          <WeaponCategory title='영웅 무기' color='purple' href='/items/hero' onClick={playAudio} />
          <WeaponCategory title='전설 무기' color='yellow' href='/items/legendary' onClick={playAudio} />
          <WeaponCategory title='필멸 무기' color='red' href='/items/mortal' onClick={playAudio} />
        </div>
      </div>
    </main>
  );
}
