'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { items } from '@/lib/items-data';
import { ResourceSettings } from '@/components/resource-settings';
import { ReinforceButton } from '@/components/reinforce-button';
import { ResourceCounter } from '@/components/resource-counter';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ReinforcementHistory } from '@/components/reinforcement-history';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap } from 'lucide-react';
import { LevelAttempts } from '@/components/level-attempts';
import { HERO_STONE_AMOUNTS, LEGENDARY_STONE_AMOUNTS } from '@/lib/reinforcement-constants';

export default function ReinforcePage({ params }: { params: { itemId: string } }) {
  const item = items.find((i) => i.id === params.itemId);

  const [level, setLevel] = useState(0);
  const [fragmentPrice, setFragmentPrice] = useLocalStorage('fragmentPrice', 600000);
  const [stonePrice, setStonePrice] = useLocalStorage('stonePrice', 600000);

  const [usedStones, setUsedStones] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [history, setHistory] = useState<
    Array<{ level: number; result: 'success' | 'decrease' | 'reset' | 'fail'; timestamp: number }>
  >([]);
  const [attempts, setAttempts] = useState(0);
  const [attemptsPerLevel, setAttemptsPerLevel] = useState<Record<number, number>>({});

  if (!item) {
    return <div>아이템을 찾을 수 없습니다.</div>;
  }

  // Reset function to clear all records
  const handleReset = () => {
    setLevel(0);
    setUsedStones(0);
    setTotalCost(0);
    setHistory([]);
    setAttempts(0);
    setAttemptsPerLevel({});
  };

  // Jump to level 10 function
  const jumpToLevel11 = () => {
    setLevel(11);
    setHistory((prev) => [...prev, { level: 11, result: 'success', timestamp: Date.now() }]);
  };
  const jumpToLevel12 = () => {
    setLevel(12);
    setHistory((prev) => [...prev, { level: 12, result: 'success', timestamp: Date.now() }]);
  };
  const jumpToLevel13 = () => {
    setLevel(13);
    setHistory((prev) => [...prev, { level: 13, result: 'success', timestamp: Date.now() }]);
  };
  const jumpToLevel14 = () => {
    setLevel(14);
    setHistory((prev) => [...prev, { level: 14, result: 'success', timestamp: Date.now() }]);
  };

  // Get success rate based on current level
  const getSuccessRate = (currentLevel: number) => {
    if (currentLevel === 0) return 100;
    if (currentLevel >= 1 && currentLevel <= 4) return 75;
    if (currentLevel === 5) return 60;
    if (currentLevel === 6) return 45;
    if (currentLevel >= 7 && currentLevel <= 11) return 40;
    if (currentLevel === 12) return 30;
    if (currentLevel === 13) return 20;
    if (currentLevel === 14) return 10;
    return 0;
  };

  // Get fail rate (decrease or stay at current level) based on current level
  const getFailRate = (currentLevel: number) => {
    if (currentLevel === 0) return 0;
    if (currentLevel >= 1 && currentLevel <= 4) return 25;
    if (currentLevel === 5) return 40;
    if (currentLevel === 6) return 55;
    if (currentLevel >= 7 && currentLevel <= 11) return 57.5;
    if (currentLevel === 12) return 67.5;
    if (currentLevel === 13) return 77.5;
    if (currentLevel === 14) return 87.5;
    return 0;
  };

  // Get reset rate based on current level
  const getResetRate = (currentLevel: number) => {
    if (currentLevel < 7) return 0;
    return 2.5;
  };

  // Update the handleReinforce function to include updated probability calculations
  const handleReinforce = () => {
    if (level >= item.maxLevel) return;

    // Increment attempts counter
    setAttempts((prev) => prev + 1);

    // Increment attempts counter for current level
    setAttemptsPerLevel((prev) => ({
      ...prev,
      [level]: (prev[level] || 0) + 1,
    }));

    // Calculate resources needed for this level
    const fragmentsNeeded = Math.ceil((level + 1) * 1.5);
    const stonesNeeded = Math.ceil((level + 1) * 0.5);

    // Update used resources
    setUsedStones((prev) => prev + stonesNeeded);

    // Update total cost
    const levelCost = fragmentsNeeded * fragmentPrice + stonesNeeded * stonePrice;
    setTotalCost((prev) => prev + levelCost);

    const random = Math.random() * 100;
    const successRate = getSuccessRate(level);
    const failRate = getFailRate(level);

    let newLevel = level;
    let result = '';

    if (random < successRate) {
      // 성공
      newLevel = level + 1;
      result = 'success';
    } else if (level < 8) {
      // 7 이하의 레벨에서는 실패해도 유지
      result = 'fail';
    } else if (random < successRate + failRate) {
      // 7 이상의 레벨에서는 실패 시 1레벨 감소
      newLevel = level - 1;
      result = 'decrease';
    } else {
      // 7 이상의 레벨에서 리셋 확률에 걸릴 경우 0레벨로 초기화
      newLevel = 0;
      result = 'reset';
    }

    // 상태 업데이트 (setLevel과 setHistory를 한 번만 실행)
    setLevel(newLevel);
    setHistory((h) => [...h, { level: newLevel, result, timestamp: Date.now() }]);
  };

  const categoryColorMap: Record<string, string> = {
    hero: 'text-purple-400',
    legendary: 'text-yellow-400',
    mortal: 'text-red-400',
  };

  const currentImage = item.images[Math.min(level, item.images.length - 1)];

  const stonesNeeded = item.category === 'hero' ? HERO_STONE_AMOUNTS[level] : LEGENDARY_STONE_AMOUNTS[level];
  const nextLevelCost = stonesNeeded * stonePrice;

  return (
    <div className='min-h-screen bg-gray-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <div className='flex justify-between items-center mb-4'>
          <Link href={`/items/${item.category}`} className='text-blue-400 hover:underline inline-block'>
            ← 아이템 목록으로 돌아가기
          </Link>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={jumpToLevel11}
              className='flex items-center gap-2 text-yellow-400 border-yellow-400 hover:bg-yellow-400/10'
              disabled={level >= 11}
            >
              <Zap size={16} />
              11강으로 점프
            </Button>
            <Button
              variant='outline'
              onClick={jumpToLevel12}
              className='flex items-center gap-2 text-blue-400 border-blue-400 hover:bg-blue-400/10'
              disabled={level >= 12}
            >
              <Zap size={16} />
              12강으로 점프
            </Button>
            <Button
              variant='outline'
              onClick={jumpToLevel13}
              className='flex items-center gap-2 text-purple-400 border-purple-400 hover:bg-purple-400/10'
              disabled={level >= 13}
            >
              <Zap size={16} />
              13강으로 점프
            </Button>
            <Button
              variant='outline'
              onClick={jumpToLevel14}
              className='flex items-center gap-2 text-red-400 border-red-400 hover:bg-red-400/10'
              disabled={level >= 14}
            >
              <Zap size={16} />
              14강으로 점프
            </Button>

            <Button
              variant='outline'
              onClick={handleReset}
              className='flex items-center gap-2 text-red-400 border-red-400 hover:bg-red-400/10'
            >
              <RefreshCw size={16} />
              초기화
            </Button>
          </div>
        </div>

        <h1 className={`text-3xl font-bold my-6 ${categoryColorMap[item.category]}`}>{item.name} 강화</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left side - Item display */}
          <div className='bg-gray-800 rounded-lg p-6 flex flex-col items-center'>
            <div className='relative w-64 h-64 mb-6'>
              <Image
                src={currentImage || '/placeholder.svg'}
                alt={`${item.name} Level ${level}`}
                fill
                className='object-contain'
              />
            </div>

            <div className='text-center w-full'>
              <h2 className='text-2xl font-bold mb-2'>{item.name}</h2>
              <p className='text-gray-300 mb-4'>{item.description}</p>

              <div className='bg-gray-700 rounded-lg p-4 mb-4'>
                <p className='text-xl'>
                  현재 강화 단계: <span className='font-bold'>{level}</span> / {item.maxLevel}
                </p>
                <p className='text-xl mt-2'>
                  총 강화 시도: <span className='font-bold'>{attempts}</span>회
                </p>
              </div>

              <ResourceCounter usedStones={usedStones} totalCost={totalCost} stonePrice={stonePrice} />

              <LevelAttempts attemptsPerLevel={attemptsPerLevel} maxLevel={item.maxLevel} />

              <ReinforcementHistory history={history} />
            </div>
          </div>

          {/* Right side - Reinforcement controls */}
          <div className='bg-gray-800 rounded-lg p-6'>
            <ResourceSettings
              fragmentPrice={fragmentPrice}
              stonePrice={stonePrice}
              setFragmentPrice={setFragmentPrice}
              setStonePrice={setStonePrice}
            />

            <div className='mt-8 bg-gray-700 rounded-lg p-4'>
              <h3 className='text-xl font-semibold mb-4'>다음 강화 비용</h3>
              <div className='space-y-2 mb-4'>
                <p>정교한 강화석: {stonesNeeded}개</p>
                <p className='text-xl mt-4'>
                  총 비용: <span className='font-bold'>{nextLevelCost}</span> 골드
                </p>
              </div>
            </div>

            <ReinforceButton
              onClick={handleReinforce}
              disabled={level >= item.maxLevel}
              level={level}
              maxLevel={item.maxLevel}
              getSuccessRate={getSuccessRate}
              getFailRate={getFailRate}
              getResetRate={getResetRate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
