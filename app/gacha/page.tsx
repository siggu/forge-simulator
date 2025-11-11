'use clinet';

import { GachaWeaponList } from '@/components/gacha-weapon-list';
import Link from 'next/link';

export default function GachaWeapon() {
  return (
    <div className='min-h-screen bg-slate-900 text-white p-4 relative overflow-hidden'>
      <div className='container mx-auto max-w-7xl relative z-10'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 group transition-colors'
        >
          <svg className='w-5 h-5 transform group-hover:-translate-x-1 transition-transform' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
            <path d='M15 19l-7-7 7-7'></path>
          </svg>
          메인으로 돌아가기
        </Link>
        <GachaWeaponList />
      </div>
    </div>
  );
}
