'use client';

interface ReinforceButtonProps {
  onClick: () => void;
  disabled: boolean;
  level: number;
  maxLevel: number;
  getSuccessRate: (level: number) => number;
  getFailRate: (level: number) => number;
  getResetRate: (level: number) => number;
}

export function ReinforceButton({
  onClick,
  disabled,
  level,
  maxLevel,
  getSuccessRate,
  getFailRate,
  getResetRate,
}: ReinforceButtonProps) {
  // Always show probability information unless at max level
  const showProbability = level < maxLevel;

  // Get the probabilities
  const successRate = getSuccessRate(level);
  const failRate = getFailRate(level);
  const resetRate = getResetRate(level);

  return (
    <div className='mt-8'>
      {/* Fixed height container for probability info to prevent button from moving */}
      <div className='h-[160px] bg-gray-700 rounded-lg p-4 mb-4'>
        <h3 className='text-lg font-semibold mb-2'>강화 확률</h3>
        {showProbability ? (
          <div className='space-y-1'>
            <div className='flex justify-between'>
              <span>성공 (레벨 상승)</span>
              <span className='text-green-400'>{successRate}%</span>
            </div>

            {level < 8 ? (
              <div className='flex justify-between'>
                <span>실패 (유지)</span>
                <span className='text-gray-400'>{failRate}%</span>
              </div>
            ) : (
              <div className='flex justify-between'>
                <span>실패 (레벨 하락)</span>
                <span className='text-yellow-400'>{failRate}%</span>
              </div>
            )}

            {resetRate > 0 && (
              <div className='flex justify-between'>
                <span>나락 (레벨 초기화)</span>
                <span className='text-red-400'>{resetRate}%</span>
              </div>
            )}
          </div>
        ) : (
          <div className='flex items-center justify-center h-[100px]'>
            <p className='text-gray-400'>최대 강화 단계에 도달했습니다.</p>
          </div>
        )}
      </div>

      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-4 px-6 rounded-lg text-xl font-bold transition-all duration-300
          ${
            disabled
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 active:transform active:scale-95'
          }`}
      >
        {level >= maxLevel ? '최대 강화 달성!' : '강화하기'}
      </button>

      {level >= maxLevel && (
        <p className='text-center mt-4 text-green-400'>축하합니다! 이 아이템은 최대 강화 단계에 도달했습니다.</p>
      )}
    </div>
  );
}
