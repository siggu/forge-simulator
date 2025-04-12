'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const villageData = [
  { village: 'village1', icons: ['icon_slime_covered_crown', 'icon_tree_thorn'], rates: [4, 2], result: [2, 4] },
  { village: 'village2', icons: ['icon_lobster_shell', 'icon_king_treasure'], rates: [4, 4], result: [3, 9] },
  { village: 'village3', icons: ['icon_golem_heart', 'icon_burning_muffler'], rates: [2, 2], result: [2, 6] },
  { village: 'village4', icons: ['icon_skull_powder', 'icon_wither_skeleton_skull'], rates: [4, 4], result: [5, 13] },
  { village: 'village5', icons: ['icon_dwarf_workbench', 'icon_oriental_brush'], rates: [2, 2], result: [3, 8] },
  { village: 'village6', icons: ['icon_frozen_horn', 'icon_polarbear_claws'], rates: [4, 4], result: [7, 17] },
  { village: 'village7', icons: ['7_monster_drop10', '7_monster_drop11'], rates: [2, 2], result: [4, 10] },
];

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

  const totalFragments = quantities.reduce((sum, qty, idx) => {
    const village = villageData[Math.floor(idx / 2)];
    const i = idx % 2;
    return sum + Math.floor(qty / village.rates[i]) * village.result[i];
  }, 0);

  const totalShards = Math.floor(totalFragments / 4);
  const totalPrice = totalShards * shardPrice;

  const updateQuantity = (index: number, value: number) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <Link href='/' className='text-blue-400 hover:underline mb-4 inline-block'>
          ← 메인으로 돌아가기
        </Link>

        <div className='flex flex-row gap-10 mb-10 items-center'>
          <Image src='/boss_item/soulstone2.png' width={70} height={70} alt='무파' />
          <div className='text-4xl font-bold text-pink-500'>무파 계산기</div>
        </div>

        <button
          onClick={resetAll}
          className='bg-red-500 px-4 py-2 rounded text-white mb-4 transition-all duration-300 transform hover:scale-105 hover:cursor-pointer'
        >
          전체 초기화
        </button>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {villageData.map(({ village, icons }, vIdx) => (
            <div key={village} className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <Image src={`/boss_item/${village}.png`} width={50} height={50} alt={village} priority />
                <button
                  onClick={() => resetVillage(vIdx)}
                  className='bg-yellow-500 px-2 py-1 rounded text-white text-sm transition-all duration-300 transform hover:scale-105 hover:cursor-pointer'
                >
                  초기화
                </button>
              </div>
              <div className='flex gap-4'>
                {icons.map((icon, iIdx) => (
                  <div key={icon} className='flex flex-col items-center'>
                    <div className='w-[50px] h-[50px]'>
                      <Image src={`/boss_item/${icon}.png`} width={50} height={50} alt={icon} loading='lazy' />
                    </div>
                    <input
                      type='number'
                      className='w-16 text-center mt-2'
                      value={quantities[vIdx * 2 + iIdx]}
                      onChange={(e) => updateQuantity(vIdx * 2 + iIdx, Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className='mt-6 text-xl'>총 무형의 조각: {totalFragments}개</div>
        <div className='text-xl'>총 무형의 파편: {totalShards}개</div>
        <div className='flex items-center gap-2 mt-2'>
          <span>파편 개당 가격:</span>
          <input
            type='number'
            className='w-24 text-center'
            value={shardPrice}
            onChange={(e) => setShardPrice(Number(e.target.value))}
          />
        </div>
        <div className='text-2xl font-bold mt-4'>총 가격: {totalPrice.toLocaleString()} 원</div>
      </div>
    </div>
  );
}
