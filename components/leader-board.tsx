'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type LeaderboardEntry = {
  nickname: string;
  attempts: number;
  timestamp: string; // Supabase에서 받아오는 값은 보통 string
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const params = useParams();
  const itemId = params?.itemId as string;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!itemId) return;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayISOString = todayStart.toISOString();

      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('item_id', itemId)
        .gte('timestamp', todayISOString);

      if (error) {
        console.error('리더보드 불러오기 오류:', error);
        return;
      }

      const sorted = data.sort((a, b) => {
        if (a.attempts === b.attempts) {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        return a.attempts - b.attempts;
      });

      setEntries(sorted);
    };

    fetchLeaderboard();
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
                {new Date(entry.timestamp).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
