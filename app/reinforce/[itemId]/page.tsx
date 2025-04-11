'use client';

import { playSound } from '@/utils/play-sound';
import { use, useState } from 'react';
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
import Leaderboard from '@/components/leader-board';
import RegisterNickname from '@/components/register-nickname';

export default function ReinforcePage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = use(params);

  const item = items.find((item) => item.id === itemId);
  const [level, setLevel] = useState(0);
  const [stonePrice, setStonePrice] = useLocalStorage('stonePrice', 600000);
  const [usedStones, setUsedStones] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [history, setHistory] = useState<
    {
      level: number;
      result: 'success' | 'decrease' | 'reset' | 'fail';
      timestamp: number;
    }[]
  >([]); // 상태의 타입을 명확히 설정
  const [attempts, setAttempts] = useState(0);
  const [attemptsPerLevel, setAttemptsPerLevel] = useState<Record<number, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [hasSubmittedNickname, setHasSubmittedNickname] = useState(false);

  if (!item) {
    return <div>아이템을 찾을 수 없습니다.</div>;
  }

  // Reset function to clear all records
  const handleReset = () => {
    setLevel(0);
    setUsedStones(0);
    setTotalCost(0);
    setAttempts(0);
    setAttemptsPerLevel({});
    setHistory([]);
    setShowModal(false);
    setHasSubmittedNickname(false);
  };

  const handleSubmitNickname = (nickname: string, itemName: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const leaderboardRaw = localStorage.getItem('leaderboard');
    const leaderboard = leaderboardRaw ? JSON.parse(leaderboardRaw) : {};

    // 📌 날짜 key가 없다면 빈 객체로 초기화
    if (!leaderboard[today]) leaderboard[today] = {};

    // 📌 itemName key가 없다면 빈 배열로 초기화
    if (!leaderboard[today][itemName]) leaderboard[today][itemName] = [];

    leaderboard[today][itemName].push({
      nickname,
      attempts,
      timestamp: Date.now(),
    });

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    setHasSubmittedNickname(true);
    setShowModal(false);
  };

  // Jump to level 10 function
  const jumpToLevel = (targetLevel: number) => {
    setLevel(targetLevel);
    setHistory((prev) => [...prev, { level: targetLevel, result: 'success', timestamp: Date.now() }]);
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

    setAttempts((prev) => prev + 1);
    setAttemptsPerLevel((prev) => ({
      ...prev,
      [level]: (prev[level] || 0) + 1,
    }));
    setUsedStones((prev) => prev + stonesNeeded);
    setTotalCost((prev) => prev + nextLevelCost);

    const random = Math.random() * 100;
    const successRate = getSuccessRate(level);
    const failRate = getFailRate(level);

    let newLevel = level;
    let result: 'success' | 'decrease' | 'reset' | 'fail' = 'fail';

    if (random < successRate) {
      newLevel = level + 1;
      result = 'success';
    } else if (level < 8) {
      result = 'fail';
    } else if (random < successRate + failRate) {
      newLevel = level - 1;
      result = 'fail';
    } else {
      newLevel = 0;
      result = 'reset';
    }

    setLevel(newLevel);
    setHistory((prev) => [...prev, { level: newLevel, result, timestamp: Date.now() }]);

    if (result === 'success' && newLevel === item.maxLevel && !hasSubmittedNickname) {
      setTimeout(() => setShowModal(true), 300);
    }

    playSound(result);
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
        <div className='flex-row justify-between sm:flex-col items-center mb-4'>
          <div className='flex justify-between'>
            <Link href={`/items/${item.category}`} className='text-blue-400 hover:underline inline-block'>
              ← 아이템 목록으로 돌아가기
            </Link>
            <Button
              variant='outline'
              onClick={handleReset}
              className='flex items-center gap-2 text-red-400 border-red-400 hover:bg-red-400/10'
            >
              <RefreshCw size={16} />
              초기화
            </Button>
          </div>

          <div className='grid grid-cols-2 gap-8 mt-8'>
            {[11, 12, 13, 14].map((lvl) => (
              <Button
                key={lvl}
                variant='outline'
                onClick={() => jumpToLevel(lvl)}
                className='flex text-black items-center gap-2 border hover:bg-opacity-20'
                disabled={level >= lvl}
              >
                <Zap size={16} />
                {lvl}강으로 점프
              </Button>
            ))}
          </div>
        </div>

        <h1 className={`text-3xl font-bold my-6 ${categoryColorMap[item.category]}`}>{item.name} 강화</h1>

        {/* 강화 리더보드 */}
        <Leaderboard />
        <RegisterNickname
          isOpen={showModal}
          attempts={attempts}
          onSubmit={(nickname) => handleSubmitNickname(nickname, itemId)}
          onClose={() => setShowModal(false)}
        />
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
            <ResourceSettings stonePrice={stonePrice} setStonePrice={setStonePrice} />

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
