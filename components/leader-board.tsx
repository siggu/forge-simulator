'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type LeaderboardEntry = {
  nickname: string;
  attempts: number;
  timestamp: number;
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const params = useParams();
  const itemId = params?.itemId as string;

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // '2025-04-11' 형식
    const leaderboardRaw = localStorage.getItem('leaderboard');
    if (!leaderboardRaw || !itemId) return;

    try {
      const leaderboard = JSON.parse(leaderboardRaw);
      const todayData = leaderboard[today];
      const todayEntries = Array.isArray(todayData?.[itemId]) ? todayData[itemId] : [];

      // 시도 횟수 오름차순 + 동일하면 시간 빠른 순
      const sorted = [...todayEntries].sort((a, b) => {
        if (a.attempts === b.attempts) {
          return a.timestamp - b.timestamp;
        }
        return a.attempts - b.attempts;
      });

      setEntries(sorted);
    } catch (error) {
      console.error('리더보드 파싱 오류:', error);
    }
  }, [itemId]);

  if (entries.length === 0) return null;

  return (
    <div className='bg-gray-800 p-4 rounded-lg mb-8'>
      <h2 className='text-2xl font-bold mb-4 text-yellow-400'>🏆 오늘의 리더보드</h2>
      <table className='w-full text-left text-sm'>
        <thead>
          <tr className='text-gray-400 border-b border-gray-700'>
            <th className='py-2'>순위</th>
            <th className='py-2'>닉네임</th>
            <th className='py-2'>시도 횟수</th>
            <th className='py-2 hidden sm:table-cell'>달성 시간</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index} className='border-b border-gray-700'>
              <td className='py-2'>{index + 1}</td>
              <td className='py-2'>{entry.nickname}</td>
              <td className='py-2'>{entry.attempts}</td>
              <td className='py-2 hidden sm:table-cell text-gray-400'>
                {new Date(entry.timestamp).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
