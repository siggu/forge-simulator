interface HistoryEntry {
  level: number;
  result: 'success' | 'decrease' | 'reset' | 'fail';
  timestamp: number;
}

interface ReinforcementHistoryProps {
  history: HistoryEntry[];
}

const resultConfig = {
  success: {
    text: '성공',
    color: 'text-green-400',
  },
  decrease: {
    text: '하락',
    color: 'text-yellow-400',
  },
  reset: {
    text: '초기화',
    color: 'text-red-400',
  },
  fail: {
    text: '유지',
    color: 'text-zinc-400',
  },
};

export function ReinforcementHistory({ history }: ReinforcementHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className='bg-zinc-700 rounded-lg p-4 mt-4'>
      <h3 className='text-lg font-semibold mb-2'>강화 기록</h3>
      <div className='max-h-40 overflow-y-auto'>
        {history
          .slice()
          .reverse()
          .map((entry, index) => (
            <div key={index} className='flex justify-between py-1 border-b border-zinc-600 last:border-0'>
              <span>
                {new Date(entry.timestamp).toLocaleTimeString()} -
                {entry.result === 'success'
                  ? ` ${entry.level - 1}강 → ${entry.level}강`
                  : entry.result === 'decrease'
                  ? ` ${entry.level + 1}강 → ${entry.level}강`
                  : entry.result === 'reset'
                  ? ` ${entry.level}강 → 0강`
                  : ` ${entry.level}강 유지`}
              </span>
              <span className={resultConfig[entry.result].color}>{resultConfig[entry.result].text}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
