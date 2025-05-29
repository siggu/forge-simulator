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
    audioRef.current.play().catch((error) => {
      console.error('Auto-play blocked:', error);
    });
  };

  return (
    <main className='px-4 py-12 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white min-h-screen'>
      <Link href='/' className='text-blue-400 hover:underline mb-6 inline-block text-sm'>
        ← 메인으로 돌아가기
      </Link>
      <h2 className='text-center text-4xl font-extrabold tracking-tight mb-10 drop-shadow-md'>무기 강화</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        <WeaponCategory title='영웅 무기' color='purple' href='/items/hero' onClick={playAudio} />
        <WeaponCategory title='전설 무기' color='yellow' href='/items/legendary' onClick={playAudio} />
        <WeaponCategory title='필멸 무기' color='red' href='/items/mortal' onClick={playAudio} />
      </div>
    </main>
  );
}
