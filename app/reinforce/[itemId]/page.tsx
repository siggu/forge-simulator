'use client';

import { playSound } from '@/utils/play-sound';
import { use, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { items } from '@/lib/items';
import { ResourceSettings } from '@/components/resource-settings';
import { ReinforceButton } from '@/components/reinforce-button';
import { ResourceCounter } from '@/components/resource-counter';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ReinforcementHistory } from '@/components/reinforcement-history';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { LevelAttempts } from '@/components/level-attempts';
import { HERO_STONE_AMOUNTS, LEGENDARY_STONE_AMOUNTS } from '@/lib/reinforcement-constants';
import Leaderboard from '@/components/leader-board';
import RegisterNickname from '@/components/register-nickname';
import { getSuccessRate, getFailRate, getResetRate } from '@/utils/reinforcement-probability';
import { formatKoreanCurrency } from '@/utils/currency-formatter';

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [finalAttempts, setFinalAttempts] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showModal) return;

      switch (e.key) {
        case '1':
          jumpToLevel(11);
          break;
        case '2':
          jumpToLevel(12);
          break;
        case '3':
          jumpToLevel(13);
          break;
        case '4':
          jumpToLevel(14);
          break;
        case ' ':
          e.preventDefault();
          buttonRef.current?.click();
          break;
        case 'r':
          handleReset();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  if (!item) {
    return <div>아이템을 찾을 수 없습니다.</div>;
  }

  /**
   * Reset all reinforcement progress and statistics
   * Clears level, stones used, cost, attempts, and history
   */
  const handleReset = () => {
    setLevel(0);
    setUsedStones(0);
    setTotalCost(0);
    setAttempts(0);
    setAttemptsPerLevel({});
    setHistory([]);
    setShowModal(false);
    setHasSubmittedNickname(false);
    setFinalAttempts(null);
  };

  /**
   * Jump directly to a specific reinforcement level
   * Used for testing or quick navigation to higher levels
   * @param targetLevel - The level to jump to
   */
  const jumpToLevel = (targetLevel: number) => {
    setLevel(targetLevel);
    setHistory((prev) => [...prev, { level: targetLevel, result: 'success', timestamp: Date.now() }]);
  };

  /**
   * Handle reinforcement attempt
   * Calculates success/fail/reset based on probability rates and updates state accordingly
   */
  const handleReinforce = () => {
    if (level >= item.maxLevel) return;

    const nextAttempts = attempts + 1;
    const updatedAttemptsPerLevel = {
      ...attemptsPerLevel,
      [level]: (attemptsPerLevel[level] || 0) + 1,
    };

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

    // ✅ state 업데이트
    setAttempts(nextAttempts);
    setAttemptsPerLevel(updatedAttemptsPerLevel);
    setUsedStones((prev) => prev + stonesNeeded);
    setTotalCost((prev) => prev + nextLevelCost);
    setLevel(newLevel);
    setHistory((prev) => [...prev, { level: newLevel, result, timestamp: Date.now() }]);

    // ✅ 강화 성공 + maxLevel 도달 + 처음 도달했을 경우
    if (result === 'success' && newLevel === item.maxLevel && !hasSubmittedNickname) {
      if (finalAttempts === null) {
        setFinalAttempts(nextAttempts);
      }
      setTimeout(() => setShowModal(true), 300);
    }

    playSound(result);
  };

  const currentImage = item.images[Math.min(level, item.images.length - 1)];

  const stonesNeeded = item.category === 'hero' ? HERO_STONE_AMOUNTS[level] : LEGENDARY_STONE_AMOUNTS[level];
  const nextLevelCost = stonesNeeded * stonePrice;

  return (
    <div className='min-h-screen bg-slate-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <div className='flex-row justify-between sm:flex-col items-center mb-4'>
          <div className='flex flex-col sm:flex-row justify-between items-start gap-4 mb-6'>
            <Link
              href={`/items/${item.category}`}
              className='group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-200'
            >
              <span className='text-slate-300 group-hover:text-white'>← 아이템 목록으로 돌아가기</span>
            </Link>
            <Button
              variant='outline'
              onClick={handleReset}
              className='flex items-center gap-2 px-6 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white transition-all duration-200'
            >
              <RefreshCw size={16} />
              전체 초기화 (r)
            </Button>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 my-8'>
            {[11, 12, 13, 14].map((lvl) => (
              <Button
                key={lvl}
                variant='outline'
                onClick={() => jumpToLevel(lvl)}
                disabled={level >= lvl}
                className='relative px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white hover:border-slate-600 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200'
              >
                {lvl}강 (단축키: {lvl - 10})
              </Button>
            ))}
          </div>
        </div>

        <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight mb-8 text-white'>
          {item.name} 강화
        </h1>

        {/* 강화 리더보드 */}
        <div>
          <Leaderboard />
        </div>
        <RegisterNickname isOpen={showModal} attempts={finalAttempts ?? attempts} />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left side - Item display */}
          <div className='bg-slate-800 rounded-2xl p-8 flex flex-col items-center border border-slate-700 shadow-xl'>
            {/* Weapon image */}
            <div className='relative w-64 h-64 mb-6'>
              <div className='relative w-full h-full bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center overflow-hidden'>
                <Image
                  src={currentImage || '/placeholder.svg'}
                  alt={`${item.name} Level ${level}`}
                  fill
                  className='object-contain p-4'
                />
              </div>
            </div>

            <div className='text-center w-full space-y-4'>
              <h2 className='text-3xl font-bold text-white'>
                {item.name}
              </h2>
              <p className='text-slate-300 text-lg'>{item.description}</p>

              {/* Level display */}
              <div className='bg-slate-900 rounded-2xl p-6 border border-slate-700'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-slate-300 text-lg'>현재 강화 단계</span>
                    <span className='text-2xl font-bold text-white'>
                      {level} / {item.maxLevel}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className='w-full bg-slate-700 rounded-full h-3 overflow-hidden'>
                    <div
                      className='h-full bg-purple-500 rounded-full transition-all duration-200'
                      style={{ width: `${(level / item.maxLevel) * 100}%` }}
                    />
                  </div>
                  <div className='flex items-center justify-between pt-2'>
                    <span className='text-slate-300 text-lg'>총 강화 시도</span>
                    <span className='text-2xl font-bold text-white'>
                      {attempts}회
                    </span>
                  </div>
                </div>
              </div>

              <ResourceCounter usedStones={usedStones} totalCost={totalCost} stonePrice={stonePrice} />

              <LevelAttempts attemptsPerLevel={attemptsPerLevel} maxLevel={item.maxLevel} />

              <ReinforcementHistory history={history} />
            </div>
          </div>

          {/* Right side - Reinforcement controls */}
          <div className='bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl'>
            <ResourceSettings stonePrice={stonePrice} setStonePrice={setStonePrice} />

            {/* Next reinforcement cost card */}
            <div className='mt-8 bg-slate-900 rounded-2xl p-6 border border-slate-700'>
              <h3 className='text-2xl font-bold mb-6 text-white'>
                다음 강화 비용
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700'>
                  <span className='text-slate-300 text-lg'>정교한 강화석</span>
                  <span className='text-2xl font-bold text-white'>{stonesNeeded}개</span>
                </div>
                <div className='flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700'>
                  <span className='text-slate-300 text-lg'>총 비용</span>
                  <span className='text-2xl font-bold text-white'>
                    {formatKoreanCurrency(nextLevelCost)} 골드
                  </span>
                </div>
              </div>
            </div>

            <ReinforceButton
              ref={buttonRef}
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
