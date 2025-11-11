'use client';

import { useState } from 'react';
import villageData from '@/constants/villageData';
import Image from 'next/image';
import Link from 'next/link';

export default function MupaCalculator() {
  const [quantities, setQuantities] = useState<number[]>(Array(villageData.length * 2).fill(0));
  const [shardPrice, setShardPrice] = useState(0);

  const resetAll = () => {
    setQuantities(Array(villageData.length * 2).fill(0));
    setShardPrice(0);
  };

  const resetVillage = (vIdx: number) => {
    const newQuantities = [...quantities];
    newQuantities[vIdx * 2] = 0;
    newQuantities[vIdx * 2 + 1] = 0;
    setQuantities(newQuantities);
  };

  const updateQuantity = (index: number, value: number) => {
    const newQuantities = [...quantities];
    newQuantities[index] = Math.max(0, value);
    setQuantities(newQuantities);
  };

  const totalFragments = quantities.reduce((sum, qty, idx) => {
    const village = villageData[Math.floor(idx / 2)];
    const i = idx % 2;
    return sum + Math.floor(qty / village.rates[i]) * village.result[i];
  }, 0);

  const totalShards = Math.floor(totalFragments / 4);
  const totalPrice = totalShards * shardPrice;

  return (
    <div className='min-h-screen bg-slate-900 text-white py-8 px-4 relative overflow-hidden'>
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

        <div className='flex flex-wrap items-center gap-6 mb-12'>
          <Image src='/boss_item/soulstone2.png' width={80} height={80} alt='무파' className='drop-shadow-2xl' />
          <h1 className='text-4xl sm:text-5xl font-extrabold text-white'>
            무파 계산기
          </h1>
        </div>

        <button
          onClick={resetAll}
          className='bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 mb-8'
        >
          전체 초기화
        </button>

        <div className='flex flex-wrap gap-6 mb-12'>
          {villageData.map(({ village, icons }, vIdx) => (
            <div key={village} className='flex flex-col bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-slate-700/50 transition-all duration-200 w-fit'>
              <div className='flex items-center gap-6 mb-4'>
                <Image src={`/boss_item/${village}.png`} width={60} height={60} alt={village} priority />
                <button
                  onClick={() => resetVillage(vIdx)}
                  className='text-sm px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-medium shadow-lg transition-all duration-200'
                >
                  초기화
                </button>
              </div>

              <div className='flex gap-6'>
                {icons.map((icon, iIdx) => (
                  <div key={icon} className='flex flex-col items-center justify-between'>
                    <Image src={`/boss_item/${icon}.png`} width={50} height={50} alt={icon} className='mb-3' />
                    <input
                      type='number'
                      min={0}
                      className='w-20 text-center bg-slate-800/50 border border-purple-500/30 rounded-xl p-2 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200'
                      value={quantities[vIdx * 2 + iIdx]}
                      onChange={(e) => updateQuantity(vIdx * 2 + iIdx, Number(e.target.value))}
                      title='수량 입력'
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className='bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl space-y-6'>
          <div className='text-xl'>
            총 <span className='font-bold text-2xl text-pink-400'>{totalFragments.toLocaleString()}</span>개의 무형의 조각
          </div>
          <div className='text-xl'>
            총 <span className='font-bold text-2xl text-yellow-400'>{totalShards.toLocaleString()}</span>개의 무형의 파편
          </div>

          <div className='flex items-center gap-4 pt-4 border-t border-slate-700'>
            <label htmlFor='shardPrice' className='text-lg text-slate-300'>파편 개당 가격:</label>
            <input
              id='shardPrice'
              type='number'
              min={0}
              className='w-32 text-center bg-slate-700 border border-slate-600 rounded-xl p-3 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200'
              value={shardPrice}
              onChange={(e) => setShardPrice(Number(e.target.value))}
            />
          </div>

          <div className='text-3xl font-bold pt-6 border-t border-slate-700'>
            총 가격: <span className='text-green-400'>{totalPrice.toLocaleString()} 원</span>
          </div>
        </div>
      </div>
    </div>
  );
}
