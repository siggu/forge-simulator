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
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white py-8 px-4'>
      <div className='container mx-auto max-w-7xl'>
        <Link href='/' className='text-blue-400 hover:underline mb-6 inline-block text-sm'>
          ← 메인으로 돌아가기
        </Link>

        <div className='flex flex-wrap items-center gap-4 mb-8'>
          <Image src='/boss_item/soulstone2.png' width={70} height={70} alt='무파' />
          <h1 className='text-3xl sm:text-4xl font-bold text-pink-500'>무파 계산기</h1>
        </div>

        <button
          onClick={resetAll}
          className='bg-red-600 hover:bg-red-500 px-5 py-2 rounded-md font-semibold transition transform hover:scale-105 mb-8'
        >
          전체 초기화
        </button>

        <div className='flex flex-wrap gap-6'>
          {villageData.map(({ village, icons }, vIdx) => (
            <div key={village} className='flex flex-col bg-zinc-800 rounded-lg p-4 shadow-md w-fit justify-between'>
              <div className='flex items-center gap-6 mb-2'>
                <div className='flex items-center gap-3 p-3'>
                  <Image src={`/boss_item/${village}.png`} width={50} height={50} alt={village} priority />
                </div>
                <button
                  onClick={() => resetVillage(vIdx)}
                  className='text-sm px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-400 transition'
                >
                  초기화
                </button>
              </div>

              <div className='flex gap-6'>
                {icons.map((icon, iIdx) => (
                  <div key={icon} className='flex flex-col items-center justify-between'>
                    <Image src={`/boss_item/${icon}.png`} width={50} height={50} alt={icon} className='m-2' />
                    <input
                      type='number'
                      min={0}
                      className='w-16 text-center mt-2 bg-zinc-900 border border-zinc-700 rounded p-1'
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

        <div className='mt-10 text-lg space-y-3'>
          <div>
            총 <span className='font-bold text-pink-400'>{totalFragments.toLocaleString()}</span>개의 무형의 조각
          </div>
          <div>
            총 <span className='font-bold text-yellow-300'>{totalShards.toLocaleString()}</span>개의 무형의 파편
          </div>

          <div className='flex items-center gap-3 mt-4'>
            <label htmlFor='shardPrice'>파편 개당 가격:</label>
            <input
              id='shardPrice'
              type='number'
              min={0}
              className='w-28 text-center bg-zinc-900 border border-zinc-700 rounded p-1'
              value={shardPrice}
              onChange={(e) => setShardPrice(Number(e.target.value))}
            />
          </div>

          <div className='text-2xl font-bold mt-4'>
            총 가격: <span className='text-green-400'>{totalPrice.toLocaleString()} 원</span>
          </div>
        </div>
      </div>
    </div>
  );
}
