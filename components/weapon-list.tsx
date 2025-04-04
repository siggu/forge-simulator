import { useRef } from 'react';
import { WeaponCategory } from '@/components/weapon-category';

const randomAudios = ['shopkeeper_01', 'smith_01'];

export function ForgeWeaponList() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (!audioRef.current) {
      const randomIndex = Math.floor(Math.random() * randomAudios.length);
      audioRef.current = new Audio(`/bgm/${randomAudios[randomIndex]}.ogg`);
    }

    audioRef.current.play().catch((error) => console.error('Auto-play blocked:', error));
  };

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-20'>
        <WeaponCategory title='영웅 무기' color='purple' href='/items/hero' onClick={playAudio} />
        <WeaponCategory title='전설 무기' color='yellow' href='/items/legendary' onClick={playAudio} />
        <WeaponCategory title='필멸 무기' color='red' href='/items/mortal' onClick={playAudio} />
      </div>
    </div>
  );
}

export function ForgeAudio() {
  return (
    <video width={300} controls preload='none'>
      <source src='/bgm/raidbgm1.ogg' />
    </video>
  );
}
