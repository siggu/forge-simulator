interface LevelAttemptsProps {
  attemptsPerLevel: Record<number, number>;
  maxLevel: number;
}

export function LevelAttempts({ attemptsPerLevel, maxLevel }: LevelAttemptsProps) {
  // Create an array of levels from 0 to maxLevel
  const levels = Array.from({ length: maxLevel + 1 }, (_, i) => i);

  // Filter out levels with no attempts
  const levelsWithAttempts = levels.filter((level) => attemptsPerLevel[level]);

  if (levelsWithAttempts.length === 0) {
    return null;
  }

  return (
    <div className='bg-zinc-700 rounded-lg p-4 mt-4'>
      <h3 className='text-lg font-semibold mb-2'>강화 단계별 시도 횟수</h3>
      <div className='grid grid-cols-3 gap-2 max-h-40 overflow-y-auto'>
        {levelsWithAttempts.map((level) => (
          <div key={level} className='flex justify-between py-1 px-2 bg-zinc-800 rounded'>
            <span>{level}강:</span>
            <span className='font-bold'>{attemptsPerLevel[level] || 0}회</span>
          </div>
        ))}
      </div>
    </div>
  );
}
